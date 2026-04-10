import Database from "better-sqlite3";
import path from "node:path";
import {fileURLToPath} from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "messenger.db");

export function createDb() {
    const db = new Database(dbPath);
    db.pragma("foreign_keys = ON");
    return db;
}
