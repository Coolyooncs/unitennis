import "server-only";
import { randomUUID } from "node:crypto";
import { writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { db, UPLOAD_DIR } from "./db";

export const PAGE_SIZE = 15;

/** node:sqlite 행은 null-prototype 객체라 Client Component로 넘길 수 없으므로 일반 객체로 변환 */
const plain = <T,>(row: unknown) => (row ? { ...(row as object) } : undefined) as T;
const plainAll = <T,>(rows: unknown[]) => rows.map((r) => ({ ...(r as object) })) as T[];

export type SearchField = "all" | "title" | "content" | "author";

export type PostRow = {
  id: number;
  title: string;
  content: string;
  author: string;
  password_hash: string;
  is_secret: number;
  is_notice: number;
  is_admin: number;
  search_scope: "all" | "title" | "none";
  views: number;
  created_at: string;
  updated_at: string | null;
};

export type PostListItem = Pick<
  PostRow,
  "id" | "title" | "author" | "is_secret" | "is_notice" | "is_admin" | "views" | "created_at"
> & { comment_count: number; has_file: number };

export type CommentRow = {
  id: number;
  post_id: number;
  author: string;
  content: string;
  is_admin: number;
  created_at: string;
};

export type AttachmentRow = {
  id: number;
  post_id: number;
  kind: "thumbnail" | "file";
  filename: string;
  stored_name: string;
  mime: string;
  size: number;
};

const LIST_COLUMNS = `
  p.id, p.title, p.author, p.is_secret, p.is_notice, p.is_admin, p.views, p.created_at,
  (SELECT COUNT(*) FROM comments c WHERE c.post_id = p.id) AS comment_count,
  EXISTS (SELECT 1 FROM attachments a WHERE a.post_id = p.id) AS has_file`;

export function listNotices(): PostListItem[] {
  return plainAll<PostListItem>(db().prepare(`SELECT ${LIST_COLUMNS} FROM posts p WHERE p.is_notice = 1 ORDER BY p.id DESC`).all());
}

export function listPosts(opts: { page: number; field: SearchField; q: string }) {
  const where: string[] = ["p.is_notice = 0"];
  const params: (string | number)[] = [];
  const q = opts.q.trim();
  if (q) {
    const like = `%${q.replace(/[%_\\]/g, (m) => "\\" + m)}%`;
    // 비밀글/작성자 설정(search_scope)에 따라 검색 노출 범위를 제한한다 (원본 KBoard 동작).
    const title = "(p.search_scope != 'none' AND p.title LIKE ? ESCAPE '\\')";
    const content = "(p.search_scope = 'all' AND p.is_secret = 0 AND p.content LIKE ? ESCAPE '\\')";
    const author = "(p.search_scope != 'none' AND p.author LIKE ? ESCAPE '\\')";
    const map = { title: [title], content: [content], author: [author], all: [title, content, author] };
    const clauses = map[opts.field];
    where.push(`(${clauses.join(" OR ")})`);
    clauses.forEach(() => params.push(like));
  }
  const whereSql = where.join(" AND ");
  const total = (
    db().prepare(`SELECT COUNT(*) AS n FROM posts p WHERE ${whereSql}`).get(...params) as { n: number }
  ).n;
  const page = Math.max(1, Math.min(opts.page, Math.max(1, Math.ceil(total / PAGE_SIZE))));
  const rows = plainAll<PostListItem>(
    db()
      .prepare(`SELECT ${LIST_COLUMNS} FROM posts p WHERE ${whereSql} ORDER BY p.id DESC LIMIT ? OFFSET ?`)
      .all(...params, PAGE_SIZE, (page - 1) * PAGE_SIZE),
  );
  return { rows, total, page, pages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

/** 목록 번호: 전체 게시글 수 기준 역순 번호 */
export function rowNumber(total: number, page: number, index: number) {
  return total - (page - 1) * PAGE_SIZE - index;
}

export function getPost(id: number): PostRow | undefined {
  return plain<PostRow | undefined>(db().prepare("SELECT * FROM posts WHERE id = ?").get(id));
}

type Neighbor = Pick<PostRow, "id" | "title" | "is_secret">;

export function getNeighbors(id: number) {
  const prev = plain<Neighbor | undefined>(
    db().prepare("SELECT id, title, is_secret FROM posts WHERE id < ? AND is_notice = 0 ORDER BY id DESC LIMIT 1").get(id),
  );
  const next = plain<Neighbor | undefined>(
    db().prepare("SELECT id, title, is_secret FROM posts WHERE id > ? AND is_notice = 0 ORDER BY id ASC LIMIT 1").get(id),
  );
  return { prev, next };
}

export function incrementViews(id: number) {
  db().prepare("UPDATE posts SET views = views + 1 WHERE id = ?").run(id);
}

export function listComments(postId: number): CommentRow[] {
  return plainAll<CommentRow>(
    db().prepare("SELECT id, post_id, author, content, is_admin, created_at FROM comments WHERE post_id = ? ORDER BY id").all(postId),
  );
}

export function getCommentHash(id: number) {
  return plain<{ post_id: number; password_hash: string } | undefined>(
    db().prepare("SELECT post_id, password_hash FROM comments WHERE id = ?").get(id),
  );
}

export function listAttachments(postId: number): AttachmentRow[] {
  return plainAll<AttachmentRow>(db().prepare("SELECT * FROM attachments WHERE post_id = ? ORDER BY kind DESC, id").all(postId));
}

export function getAttachment(id: number): AttachmentRow | undefined {
  return plain<AttachmentRow | undefined>(db().prepare("SELECT * FROM attachments WHERE id = ?").get(id));
}

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = /\.(jpe?g|png|gif|webp|pdf|hwp|hwpx|docx?|xlsx?|pptx?|txt|zip)$/i;

export function validateFile(file: File, kind: "thumbnail" | "file"): string | null {
  if (file.size > MAX_FILE_BYTES) return `${file.name}: 파일은 5MB 이하만 올릴 수 있습니다.`;
  if (kind === "thumbnail" && !/^image\/(jpeg|png|gif|webp)$/.test(file.type))
    return "썸네일은 이미지(JPG, PNG, GIF, WEBP)만 가능합니다.";
  if (!ALLOWED_EXT.test(file.name)) return `${file.name}: 허용되지 않는 파일 형식입니다.`;
  return null;
}

export async function saveAttachment(postId: number, kind: "thumbnail" | "file", file: File) {
  const ext = path.extname(file.name).toLowerCase();
  const stored = `${randomUUID()}${ext}`;
  await writeFile(path.join(UPLOAD_DIR, stored), Buffer.from(await file.arrayBuffer()));
  db()
    .prepare("INSERT INTO attachments (post_id, kind, filename, stored_name, mime, size) VALUES (?, ?, ?, ?, ?, ?)")
    .run(postId, kind, file.name.slice(0, 200), stored, file.type || "application/octet-stream", file.size);
}

export async function removeAttachment(a: AttachmentRow) {
  db().prepare("DELETE FROM attachments WHERE id = ?").run(a.id);
  await unlink(path.join(UPLOAD_DIR, a.stored_name)).catch(() => {});
}

export async function deletePost(id: number) {
  for (const a of listAttachments(id)) await removeAttachment(a);
  db().prepare("DELETE FROM posts WHERE id = ?").run(id);
}
