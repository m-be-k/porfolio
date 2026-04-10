#!/usr/bin/env python3
"""
Reset the SQLite database to the default state defined in schema.sql.
Deletes existing backend/messenger.db (if any) and recreates it from schema.sql.
"""
import pathlib
import sqlite3

BASE_DIR = pathlib.Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "messenger.db"
SCHEMA_PATH = BASE_DIR / "schema.sql"


def reset_db():
    if DB_PATH.exists():
        DB_PATH.unlink()
    schema = SCHEMA_PATH.read_text(encoding="utf-8")
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(schema)
    conn.commit()
    conn.close()
    print(f"Rebuilt {DB_PATH} from {SCHEMA_PATH}")


if __name__ == "__main__":
    reset_db()
