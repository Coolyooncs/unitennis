import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { hashPassword } from "./crypto";

export const DATA_DIR = path.join(process.cwd(), "data");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

declare global {
  var __unitennisDb: DatabaseSync | undefined;
}

function open(): DatabaseSync {
  mkdirSync(UPLOAD_DIR, { recursive: true });
  const db = new DatabaseSync(path.join(DATA_DIR, "unitennis.db"));
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS posts (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT    NOT NULL,
      content       TEXT    NOT NULL,
      author        TEXT    NOT NULL,
      password_hash TEXT    NOT NULL,
      is_secret     INTEGER NOT NULL DEFAULT 0,
      is_notice     INTEGER NOT NULL DEFAULT 0,
      is_admin      INTEGER NOT NULL DEFAULT 0,
      search_scope  TEXT    NOT NULL DEFAULT 'all',  -- all | title | none
      views         INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now')),
      updated_at    TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(is_notice DESC, id DESC);

    CREATE TABLE IF NOT EXISTS comments (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id       INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      author        TEXT    NOT NULL,
      password_hash TEXT    NOT NULL,
      content       TEXT    NOT NULL,
      is_admin      INTEGER NOT NULL DEFAULT 0,
      created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
    );
    CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);

    CREATE TABLE IF NOT EXISTS attachments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id     INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      kind        TEXT    NOT NULL,              -- thumbnail | file
      filename    TEXT    NOT NULL,
      stored_name TEXT    NOT NULL,
      mime        TEXT    NOT NULL,
      size        INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_attachments_post ON attachments(post_id);

    CREATE TABLE IF NOT EXISTS consultations (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      message    TEXT,
      handled    INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  seed(db);
  return db;
}

function seed(db: DatabaseSync) {
  const row = db.prepare("SELECT COUNT(*) AS n FROM posts").get() as { n: number };
  if (row.n > 0) return;
  const pw = hashPassword(process.env.ADMIN_PASSWORD ?? "admin");
  const insert = db.prepare(
    `INSERT INTO posts (title, content, author, password_hash, is_secret, is_notice, is_admin, views, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const notice = insert.run(
    "유앤아이 테니스 아카데미의 강습문의 커뮤니티입니다.",
    `안녕하세요, 유앤아이 테니스 아카데미입니다.

이 게시판은 강습 문의를 위한 커뮤니티입니다.
문의 글을 남기실 때 아래 내용을 함께 적어주시면 더 빠르게 안내해 드릴 수 있습니다.

- 희망 요일 / 시간대 (평일·주말, 오전·오후·저녁)
- 레슨 형태 (개인 1:1 / 2:1)
- 레슨 시간 (20분 / 30분)
- 수강생 연령 및 테니스 경력

개인정보 보호를 위해 연락처가 포함된 글은 '비밀글'로 작성해 주세요.
전화 010-9949-6811 / 카카오톡 ID unitennis 로도 상담 가능합니다.`,
    "U&I Tennis",
    pw,
    0,
    1,
    1,
    0,
    "2019-03-25 10:00:00",
  );
  const sample = insert.run(
    "평일 저녁 1:1 레슨 문의드립니다",
    "평일 저녁 7시 이후 30분 개인 레슨 가능한지 문의드립니다. 테니스는 처음입니다.",
    "테린이",
    hashPassword("1234"),
    1,
    0,
    0,
    0,
    new Date().toISOString().slice(0, 19).replace("T", " "),
  );
  db.prepare(
    "INSERT INTO comments (post_id, author, password_hash, content, is_admin) VALUES (?, ?, ?, ?, 1)",
  ).run(
    Number(sample.lastInsertRowid),
    "U&I Tennis",
    pw,
    "안녕하세요. 평일 저녁 시간대 레슨 가능합니다. 남겨주신 연락처로 자세한 일정 안내드리겠습니다. 감사합니다!",
  );
  void notice;
}

export function db(): DatabaseSync {
  globalThis.__unitennisDb ??= open();
  return globalThis.__unitennisDb;
}
