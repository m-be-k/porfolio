export class MessagesActor {
    db;
    wss;
    stmtSession;
    stmtInsertMessage;
    stmtListMessages;
    stmtGetSender;

    constructor(db, wss) {
        this.db = db;
        this.wss = wss;
        this.stmtSession = db.prepare(`
            SELECT s.id, s.user_id FROM sessions s
            WHERE s.id = ? AND s.expires_at > datetime('now')
        `);
        this.stmtInsertMessage = db.prepare(`
            INSERT INTO messages (sender_id, content, created_at)
            VALUES (?, ?, COALESCE(?, datetime('now')))
        `);
        this.stmtListMessages = db.prepare(`
            SELECT m.id, m.sender_id as senderId, u.username as sender, u.icon_url as senderIcon,
                   m.content, m.created_at as createdAt
            FROM messages m
            JOIN users u ON u.id = m.sender_id
            WHERE (? IS NULL OR m.created_at >= ?)
            ORDER BY m.created_at ASC
            LIMIT 500
        `);
        this.stmtGetSender = db.prepare("SELECT username as sender, icon_url as senderIcon FROM users WHERE id = ?");
    }

    ensureSession(session, res) {
        if (!session) {
            res.status(401).json({status: "error", payload: {message: "unauthorized"}});
            return null;
        }
        const s = this.stmtSession.get(session.id);
        if (!s) {
            res.status(401).json({status: "error", payload: {message: "session expired or invalid"}});
            return null;
        }
        return s;
    }

    broadcast(event, payload) {
        const data = JSON.stringify({event, payload});
        this.wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(data);
            }
        });
    }

    async fetch({session, payload, res}) {
        const s = this.ensureSession(session, res);
        if (!s) return res;
        const since = payload?.since ?? null;
        const messages = this.stmtListMessages.all(since, since);
        return res.json({status: "success", payload: {messages}});
    }

    async send({session, payload, res}) {
        const s = this.ensureSession(session, res);
        if (!s) return res;
        const {content} = payload || {};
        if (!content || typeof content !== "string" || !content.trim()) {
            return res.json({status: "error", payload: {message: "empty content"}});
        }
        const createdAt = new Date().toISOString();
        const info = this.stmtInsertMessage.run(s.user_id, content, createdAt);
        const senderRow = this.stmtGetSender.get(s.user_id);
        const message = {
            id: info.lastInsertRowid,
            sender: senderRow?.sender,
            senderIcon: senderRow?.senderIcon,
            content,
            createdAt
        };
        this.broadcast("message:new", message);
        return res.json({status: "success", payload: {}});
    }
}
