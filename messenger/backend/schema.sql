-- SQLite DDL for the messenger demo backend
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    nickname TEXT NOT NULL,
    icon_url TEXT,
    status TEXT NOT NULL DEFAULT 'offline',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TRIGGER IF NOT EXISTS trg_users_updated_at
AFTER UPDATE ON users
FOR EACH ROW
BEGIN
    UPDATE users SET updated_at = datetime('now') WHERE id = OLD.id;
END;

CREATE TABLE IF NOT EXISTS muted_users (
    user_id INTEGER NOT NULL,
    muted_user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (user_id, muted_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (muted_user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed data that mirrors the current localStorage mock
INSERT INTO users (username, password_hash, password_salt, nickname, icon_url, status)
VALUES
    ('Ansar', '51a24732198482a157a0fd19ee43229f2ac79340c0d2ddadff3666cd93730132', '634d95bc25949303d4388e595fff52f8', 'Ansar', '/images/free-user-icon-3296-thumb.png', 'online'),
    ('Denis', '5f2f433bc4f47311b610c9c1d4cb4e5e2ae24032fcb43edba57a12ad11c6c7f0', 'eaaf3a930a4d381d0f0507eb9d0069cd', 'Denis', '/images/free-user-icon-3296-thumb.png', 'away'),
    ('Alex', '192414d02636bd4bdab6a3e543350379640cb534b2c54c5284e6726aa06651ca', '101fa1847edfa0032ae8a04b5a102a7d', 'Alex', '/images/free-user-icon-3296-thumb.png', 'offline');

-- Ansar mutes Alex by default
INSERT INTO muted_users (user_id, muted_user_id)
VALUES
    (1, 3);

INSERT INTO messages (sender_id, content, created_at)
VALUES
    (1, 'Hello', '2025-11-07T13:46:03.982Z'),
    (2, 'World', '2025-11-07T13:47:03.982Z'),
    (1, 'Bye', '2025-11-07T13:48:03.982Z'),
    (2, 'Bye Bye', '2025-11-07T13:49:03.982Z');
