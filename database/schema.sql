BEGIN;

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author TEXT NOT NULL,
    content TEXT,
    postDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited INTEGER DEFAULT 0 CHECK(edited IN (0,1) ),
    flags TEXT DEFAULT ""
);

COMMIT;