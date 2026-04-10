import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Переносим сохранение на уровень фронтенда: messenger/public/images
const projectRoot = path.resolve(__dirname, "..", "..");
const imagesDir = path.join(projectRoot, "public", "images");

const defaultProjection = `
    id, username, icon_url as iconUrl, status, created_at as createdAt, updated_at as updatedAt
`;

export class UsersActor {
    db;
    stmtSession;
    stmtGetUser;
    stmtListUsers;
    stmtUpdateUser;
    stmtGetMuted;
    stmtReplaceMuted;
    stmtInsertMuted;
    stmtUserIdByUsername;
    stmtUpdateStatus;
    stmtGetUserById;
    wss;
    allowedStatuses = new Set(["online", "away", "busy", "offline"]);

    constructor(db, wss) {
        this.db = db;
        this.wss = wss;
        if (!fs.existsSync(imagesDir)) {
            fs.mkdirSync(imagesDir, {recursive: true});
        }
        this.stmtSession = db.prepare(`
            SELECT s.id, s.user_id, u.username, u.icon_url as iconUrl, u.status
            FROM sessions s
            JOIN users u ON u.id = s.user_id
            WHERE s.id = ? AND s.expires_at > datetime('now')
        `);
        this.stmtGetUser = db.prepare(`SELECT ${defaultProjection} FROM users WHERE id = ?`);
        this.stmtListUsers = db.prepare(`SELECT ${defaultProjection} FROM users`);
        this.stmtUpdateUser = db.prepare(`
            UPDATE users SET icon_url = COALESCE(?, icon_url),
                             status = COALESCE(?, status)
            WHERE id = ?
        `);
        this.stmtGetMuted = db.prepare(`
            SELECT u.username
            FROM muted_users m
            JOIN users u ON u.id = m.muted_user_id
            WHERE m.user_id = ?
        `);
        this.stmtReplaceMuted = db.prepare("DELETE FROM muted_users WHERE user_id = ?");
        this.stmtInsertMuted = db.prepare(`
            INSERT INTO muted_users (user_id, muted_user_id)
            VALUES (?, ?)
            ON CONFLICT(user_id, muted_user_id) DO NOTHING
        `);
        this.stmtUserIdByUsername = db.prepare("SELECT id FROM users WHERE username = ?");
        this.stmtUpdateStatus = db.prepare("UPDATE users SET status = ? WHERE id = ?");
        this.stmtGetUserById = db.prepare(`SELECT ${defaultProjection} FROM users WHERE id = ?`);
    }

    ensureSession(session, res) {
        if (!session) {
            res.status(401).json({status: "error", payload: {message: "unauthorized"}});
            return null;
        }
        const fullSession = this.stmtSession.get(session.id);
        if (!fullSession) {
            res.status(401).json({status: "error", payload: {message: "session expired or invalid"}});
            return null;
        }
        return fullSession;
    }

    async me({session, res}) {
        const s = this.ensureSession(session, res);
        if (!s) return res;
        const muted = this.stmtGetMuted.all(s.user_id).map(r => r.username);
        return res.json({status: "success", payload: {...s, mutedUsernames: muted}});
    }

    async list({session, res}) {
        const s = this.ensureSession(session, res);
        if (!s) return res;
        const users = this.stmtListUsers.all();
        return res.json({status: "success", payload: {users}});
    }

    async updateProfile({session, payload, res}) {
        const s = this.ensureSession(session, res);
        if (!s) return res;
        const {imageB64, status} = payload || {};
        if (status !== undefined && status !== null) {
            if (typeof status !== "string" || !this.allowedStatuses.has(status)) {
                return res.status(400).json({status: "error", payload: {message: "status must be one of: online, away, offline"}});
            }
        }
        let newIconPath = null;
        if (imageB64.startsWith("data:image")) {
            try {
                newIconPath = await this.saveAvatar(imageB64, s.user_id);
            } catch (e) {
                return res.status(400).json({status: "error", payload: {message: e.message}});
            }
        }
        this.stmtUpdateUser.run(newIconPath ?? null, status, s.user_id);
        this.broadcastUserUpdate(s.user_id);
        return res.json({status: "success", payload: {}});
    }

    async replaceMuted({session, payload, res}) {
        const s = this.ensureSession(session, res);
        if (!s) return res;
        const mutedUsernames = Array.isArray(payload?.mutedUsernames) ? payload.mutedUsernames : [];
        for (const name of mutedUsernames) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({status: "error", payload: {message: "mutedUsernames must be non-empty strings"}});
            }
        }
        const tx = this.db.transaction(() => {
            this.stmtReplaceMuted.run(s.user_id);
            for (const name of mutedUsernames) {
                const row = this.stmtUserIdByUsername.get(name);
                if (!row) {
                    throw new Error(`unknown username: ${name}`);
                }
                this.stmtInsertMuted.run(s.user_id, row.id);
            }
        });
        try {
            tx();
        } catch (e) {
            return res.status(400).json({status: "error", payload: {message: e.message}});
        }
        return res.json({status: "success", payload: {}});
    }

    setStatus(userId, status) {
        if (!this.allowedStatuses.has(status)) return;
        this.stmtUpdateStatus.run(status, userId);
        this.broadcastUserUpdate(userId);
    }

    broadcastUserUpdate(userId) {
        if (!this.wss) return;
        const user = this.stmtGetUserById.get(userId);
        if (!user) return;
        const payload = JSON.stringify({event: "users:update", payload: user});
        this.wss.clients.forEach(client => {
            if (client.readyState === 1) {
                client.send(payload);
            }
        });
    }

    async saveAvatar(dataUrl, userId) {
        // Поддержка data URL или чистой base64
        let base64String = dataUrl;
        const dataUrlPrefix = /^data:image\/\w+;base64,/;
        if (dataUrlPrefix.test(dataUrl)) {
            base64String = dataUrl.replace(dataUrlPrefix, "");
        }
        if (!base64String) {
            throw new Error("invalid image data");
        }
        const buffer = Buffer.from(base64String, "base64");
        // Ресайз до 100x100 и конвертация в png
        const filename = `avatar_${userId}_${Date.now()}.png`;
        const targetPath = path.join(imagesDir, filename);
        await sharp(buffer)
            .resize(100, 100)
            .png({compressionLevel: 9})
            .toFile(targetPath);
        // Путь для клиента
        return `/images/${filename}`;
    }
}
