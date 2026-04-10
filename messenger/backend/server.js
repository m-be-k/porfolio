import express from "express";
import cookieParser from "cookie-parser";
import {WebSocketServer} from "ws";
import http from "node:http";
import {createDb} from "./db.js";
import {AuthActor} from "./actors/auth.js";
import {UsersActor} from "./actors/users.js";
import {MessagesActor} from "./actors/messages.js";


const app = express();
// Dev CORS for dashboard/local usage
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});
// Increase the limit for JSON and URL-encoded payloads
app.use(express.json({limit: '50mb'})); // Example: 50 megabytes
app.use(express.urlencoded({extended: true, limit: '50mb'}));
app.use(express.json());
app.use(cookieParser());

const db = createDb();
// Быстрая проверка сессии для WS
const stmtSession = db.prepare(`
    SELECT s.id, s.user_id
    FROM sessions s
    WHERE s.id = ?
      AND s.expires_at > datetime('now')
`);

const wss = new WebSocketServer({noServer: true});
const actors = {
    auth: new AuthActor(db, wss),
    users: new UsersActor(db, wss),
    messages: new MessagesActor(db, wss)
};

function getSession(req) {
    // sid хранится в httpOnly cookie
    const sid = req.cookies?.sid || null;
    if (!sid) return null;
    return {id: sid};
}

app.post("/api", async (req, res) => {
    // Универсальный вход: actor + action + payload
    const {actor, action, payload} = req.body || {};
    if (!actor || !action) {
        return res.status(400).json({status: "error", payload: {message: "actor and action are required"}});
    }

    const actorImpl = actors[actor];
    if (!actorImpl || typeof actorImpl[action] !== "function") {
        return res.status(404).json({status: "error", payload: {message: "unknown actor/action"}});
    }

    const session = getSession(req);
    try {
        const actorResponse = await actorImpl[action]({payload, session, req, res});
        // actors формируют ответ сами; если ничего не вернули, считаем это ошибкой
        if (!actorResponse) {
            return res.status(500).json({status: "error", payload: {message: "empty response"}});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({status: "error", payload: {message: "internal error"}});
    }
});

app.get("/ping", (_req, res) => {
    // Простой ping-эндпоинт
    res.json({status: "ok"});
});

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
    // Принимаем только WS на /ws
    if (req.url !== "/ws") {
        socket.destroy();
        return;
    }
    // Простая проверка аутентификации по sid в cookie
    const cookies = Object.fromEntries(
        (req.headers.cookie || "")
            .split(";")
            .map(v => v.trim())
            .filter(Boolean)
            .map(v => v.split("=").map(decodeURIComponent))
    );
    const sid = cookies.sid;
    const session = sid ? stmtSession.get(sid) : null;
    if (!session) {
        socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
        socket.destroy();
        return;
    }
    wss.handleUpgrade(req, socket, head, ws => {
        ws._session = session; // прокидываем сессию в соединение
        wss.emit("connection", ws, req);
    });
});

wss.on("connection", ws => {
    // Минимальное приветствие после подключения
    ws.send(JSON.stringify({event: "connected", payload: {message: "ws connected"}}));
    // Устанавливаем статус online и рассылаем обновление
    if (ws._session?.user_id) {
        actors.users.setStatus(ws._session.user_id, "online");
    }

    ws.on("close", () => {
        if (ws._session?.user_id) {
            actors.users.setStatus(ws._session.user_id, "offline");
        }
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`API server listening on http://localhost:${PORT}`);
});
