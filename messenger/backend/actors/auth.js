import crypto from "node:crypto";
import {v4 as uuidv4} from "uuid";

const SESSION_TTL_HOURS = 24 * 7;

export class AuthActor {
    db;
    wss;
    stmtGetUserByUsername;
    stmtInsertUser;
    stmtInsertSession;
    stmtDeleteSession;
    stmtDeleteUserSessions;

    #hashPassword(salt, password) {
        return crypto.createHash("sha256").update(salt + password).digest("hex");
    }

    #requirePayload(fields, payload) {
        for (const f of fields) {
            if (payload?.[f] === undefined || payload?.[f] === null || payload?.[f] === "") {
                throw new Error(`Missing field: ${f}`);
            }
        }
    }

    constructor(db, wss) {
        this.db = db;
        this.wss = wss;
        this.stmtGetUserByUsername = db.prepare("SELECT * FROM users WHERE username = ?");
        this.stmtInsertUser = db.prepare(`
            INSERT INTO users (username, password_hash, password_salt, nickname, icon_url, status)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        this.stmtInsertSession = db.prepare(`
            INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, datetime('now', ? || ' hours'))
        `);
        this.stmtDeleteSession = db.prepare("DELETE FROM sessions WHERE id = ?");
        this.stmtDeleteUserSessions = db.prepare("DELETE FROM sessions WHERE user_id = ?");
    }

    createSession(userId) {
        const sid = uuidv4();
        this.stmtInsertSession.run(sid, userId, SESSION_TTL_HOURS);
        return sid;
    }

    async register({payload, res}) {
        this.#requirePayload(["username", "password"], payload);
        const {username, password} = payload;
        const existing = this.stmtGetUserByUsername.get(username);
        if (existing) {
            return res.status(400).json({status: "error", payload: {message: "user already exists"}});
        }
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = this.#hashPassword(salt, password);
        // avatar ставится позже (updateProfile), пока дефолт
        const icon = "/images/free-user-icon-3296-thumb.png";
        const status = "online";
        const info = this.stmtInsertUser.run(username, hash, salt, username, icon, status);
        const sid = this.createSession(info.lastInsertRowid);
        res.cookie("sid", sid, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({status: "success", payload: {}});
    }

    async login({payload, res}) {
        this.#requirePayload(["username", "password"], payload);
        const {username, password} = payload;
        const user = this.stmtGetUserByUsername.get(username);
        if (!user) {
            return res.status(401).json({status: "error", payload: {message: "user not found"}});
        }
        const hash = this.#hashPassword(user.password_salt, password);
        if (user.password_hash !== hash) {
            return res.status(401).json({status: "error", payload: {message: "invalid credentials"}});
        }
        const sid = this.createSession(user.id);
        res.cookie("sid", sid, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.json({status: "success", payload: {}});
    }

    async logout({session, res}) {
        if (!session) {
            return res.json({status: "success", payload: {message: "already logged out"}});
        }
        this.stmtDeleteSession.run(session.id);
        res.clearCookie("sid", {httpOnly: true, sameSite: "lax", path: "/"});
        // Закрываем все WS с этой сессией
        this.closeWebSocketsBySession(session.id);
        return res.json({status: "success", payload: {message: "logged out"}});
    }

    async logoutAll({session, res}) {
        if (!session) {
            return res.json({status: "success", payload: {message: "already logged out"}});
        }
        this.stmtDeleteUserSessions.run(session.user_id);
        res.clearCookie("sid", {httpOnly: true, sameSite: "lax", path: "/"});
        // Закрываем все WS этого пользователя
        this.closeWebSocketsByUser(session.user_id);
        return res.json({status: "success", payload: {message: "logged out everywhere"}});
    }

    closeWebSocketsBySession(sessionId) {
        if (!this.wss) return;
        this.wss.clients.forEach(client => {
            if (client._session?.id === sessionId && client.readyState === 1) {
                client.close(1000, "Logged out");
            }
        });
    }

    closeWebSocketsByUser(userId) {
        if (!this.wss) return;
        this.wss.clients.forEach(client => {
            if (client._session?.user_id === userId && client.readyState === 1) {
                client.close(1000, "Logged out everywhere");
            }
        });
    }
}
