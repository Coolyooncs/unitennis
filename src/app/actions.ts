"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { db } from "@/lib/db";
import { hashPassword, safeEqual, verifyPassword } from "@/lib/crypto";
import { checkHuman } from "@/lib/captcha";
import { grantPostAccess, hasPostAccess, isAdmin, setAdmin } from "@/lib/session";
import {
  deletePost as removePost,
  getAttachment,
  getCommentHash,
  getPost,
  listAttachments,
  removeAttachment,
  saveAttachment,
  validateFile,
} from "@/lib/board";

export type FormState = { ok?: boolean; error?: string; message?: string; fields?: Record<string, string> };

const str = (f: FormData, k: string, max = 10_000) => String(f.get(k) ?? "").trim().slice(0, max);
const files = (f: FormData, k: string) =>
  f.getAll(k).filter((v): v is File => v instanceof File && v.size > 0);

/* ───────────────────────── 빠른 상담 신청 ───────────────────────── */

export async function submitConsultation(_: FormState, form: FormData): Promise<FormState> {
  const name = str(form, "name", 40);
  const phone = str(form, "phone", 20).replace(/[^\d-]/g, "");
  const agree = form.get("agree") === "on";
  if (String(form.get("website") ?? "")) return { ok: true, message: "접수되었습니다." };
  if (!name) return { error: "이름을 입력해주세요.", fields: { name, phone } };
  if (!/^01\d-?\d{3,4}-?\d{4}$/.test(phone))
    return { error: "휴대폰 번호를 정확히 입력해주세요.", fields: { name, phone } };
  if (!agree) return { error: "개인정보 수집·이용에 동의해주세요.", fields: { name, phone } };
  db().prepare("INSERT INTO consultations (name, phone, message) VALUES (?, ?, ?)").run(name, phone, str(form, "message", 500) || null);
  return { ok: true, message: `${name}님, 상담 신청이 접수되었습니다. 빠르게 연락드리겠습니다.` };
}

/* ───────────────────────── 게시글 ───────────────────────── */

function readPostFields(form: FormData) {
  return {
    title: str(form, "title", 120),
    content: str(form, "content", 20_000),
    author: str(form, "author", 30),
    password: String(form.get("password") ?? ""),
    is_secret: form.get("is_secret") === "on" ? 1 : 0,
    search_scope: (["all", "title", "none"].includes(str(form, "search_scope")) ? str(form, "search_scope") : "all") as
      | "all"
      | "title"
      | "none",
  };
}

function validateUploads(form: FormData): string | null {
  const thumb = files(form, "thumbnail").slice(0, 1);
  const attach = files(form, "files").slice(0, 2);
  for (const t of thumb) {
    const e = validateFile(t, "thumbnail");
    if (e) return e;
  }
  for (const a of attach) {
    const e = validateFile(a, "file");
    if (e) return e;
  }
  return null;
}

async function storeUploads(postId: number, form: FormData) {
  const thumb = files(form, "thumbnail")[0];
  if (thumb) {
    for (const old of listAttachments(postId).filter((a) => a.kind === "thumbnail")) await removeAttachment(old);
    await saveAttachment(postId, "thumbnail", thumb);
  }
  const existing = listAttachments(postId).filter((a) => a.kind === "file").length;
  for (const f of files(form, "files").slice(0, Math.max(0, 2 - existing))) await saveAttachment(postId, "file", f);
}

export async function createPost(_: FormState, form: FormData): Promise<FormState> {
  const admin = await isAdmin();
  const p = readPostFields(form);
  const fields = { title: p.title, content: p.content, author: p.author };
  if (!admin) {
    const human = checkHuman(form);
    if (human) return { error: human, fields };
  }
  if (!p.title) return { error: "제목을 입력해주세요.", fields };
  if (!p.content) return { error: "내용을 입력해주세요.", fields };
  if (!admin && !p.author) return { error: "작성자를 입력해주세요.", fields };
  if (!admin && p.password.length < 4) return { error: "비밀번호는 4자 이상 입력해주세요.", fields };
  const uploadError = validateUploads(form);
  if (uploadError) return { error: uploadError, fields };

  const isNotice = admin && form.get("is_notice") === "on" ? 1 : 0;
  const res = db()
    .prepare(
      `INSERT INTO posts (title, content, author, password_hash, is_secret, is_notice, is_admin, search_scope)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      p.title,
      p.content,
      admin ? p.author || "U&I Tennis" : p.author,
      hashPassword(p.password || crypto.randomUUID()),
      p.is_secret,
      isNotice,
      admin ? 1 : 0,
      p.is_secret ? (p.search_scope === "all" ? "title" : p.search_scope) : p.search_scope,
    );
  const id = Number(res.lastInsertRowid);
  await storeUploads(id, form);
  await grantPostAccess(id);
  redirect(`/community/${id}`);
}

export async function updatePost(_: FormState, form: FormData): Promise<FormState> {
  const id = Number(form.get("id"));
  const post = getPost(id);
  if (!post) return { error: "게시글을 찾을 수 없습니다." };
  if (!(await hasPostAccess(id))) return { error: "수정 권한이 없습니다. 비밀번호를 다시 확인해주세요." };
  const admin = await isAdmin();
  const p = readPostFields(form);
  const fields = { title: p.title, content: p.content, author: p.author };
  if (!p.title || !p.content) return { error: "제목과 내용을 입력해주세요.", fields };
  const uploadError = validateUploads(form);
  if (uploadError) return { error: uploadError, fields };

  for (const rid of form.getAll("remove_attachment").map(Number)) {
    const a = getAttachment(rid);
    if (a && a.post_id === id) await removeAttachment(a);
  }
  db()
    .prepare(
      `UPDATE posts SET title = ?, content = ?, author = ?, is_secret = ?, search_scope = ?, is_notice = ?,
       password_hash = COALESCE(?, password_hash), updated_at = datetime('now') WHERE id = ?`,
    )
    .run(
      p.title,
      p.content,
      p.author || post.author,
      p.is_secret,
      p.is_secret && p.search_scope === "all" ? "title" : p.search_scope,
      admin ? (form.get("is_notice") === "on" ? 1 : 0) : post.is_notice,
      p.password.length >= 4 ? hashPassword(p.password) : null,
      id,
    );
  await storeUploads(id, form);
  redirect(`/community/${id}`);
}

/** 비밀글 열람 / 수정 / 삭제 전 비밀번호 확인 */
export async function verifyPost(_: FormState, form: FormData): Promise<FormState> {
  const id = Number(form.get("id"));
  const next = str(form, "next");
  const post = getPost(id);
  if (!post) return { error: "게시글을 찾을 수 없습니다." };
  if (!verifyPassword(String(form.get("password") ?? ""), post.password_hash))
    return { error: "비밀번호가 일치하지 않습니다." };
  await grantPostAccess(id);
  if (next === "delete") {
    await removePost(id);
    redirect("/community?deleted=1");
  }
  redirect(next === "edit" ? `/community/${id}/edit` : `/community/${id}`);
}

export async function deletePostAction(form: FormData) {
  const id = Number(form.get("id"));
  if (!(await hasPostAccess(id))) redirect(`/community/${id}/password?next=delete`);
  await removePost(id);
  redirect("/community?deleted=1");
}

/* ───────────────────────── 댓글 ───────────────────────── */

export async function addComment(_: FormState, form: FormData): Promise<FormState> {
  const postId = Number(form.get("post_id"));
  const post = getPost(postId);
  if (!post) return { error: "게시글을 찾을 수 없습니다." };
  if (post.is_secret && !(await hasPostAccess(postId))) return { error: "비밀글에는 작성자만 댓글을 달 수 있습니다." };
  const admin = await isAdmin();
  const author = admin ? str(form, "author", 30) || "U&I Tennis" : str(form, "author", 30);
  const content = str(form, "content", 3000);
  const password = String(form.get("password") ?? "");
  const fields = { author, content };
  if (!admin) {
    const human = checkHuman(form);
    if (human) return { error: human, fields };
    if (!author) return { error: "작성자를 입력해주세요.", fields };
    if (password.length < 4) return { error: "비밀번호는 4자 이상 입력해주세요.", fields };
  }
  if (!content) return { error: "댓글 내용을 입력해주세요.", fields };
  db()
    .prepare("INSERT INTO comments (post_id, author, password_hash, content, is_admin) VALUES (?, ?, ?, ?, ?)")
    .run(postId, author, hashPassword(password || crypto.randomUUID()), content, admin ? 1 : 0);
  refresh();
  return { ok: true };
}

export async function deleteComment(_: FormState, form: FormData): Promise<FormState> {
  const id = Number(form.get("id"));
  const c = getCommentHash(id);
  if (!c) return { error: "댓글을 찾을 수 없습니다." };
  if (!(await isAdmin()) && !verifyPassword(String(form.get("password") ?? ""), c.password_hash))
    return { error: "비밀번호가 일치하지 않습니다." };
  db().prepare("DELETE FROM comments WHERE id = ?").run(id);
  refresh();
  return { ok: true };
}

/* ───────────────────────── 관리자 ───────────────────────── */

export async function adminLogin(_: FormState, form: FormData): Promise<FormState> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return { error: "서버에 ADMIN_PASSWORD 환경변수가 설정되지 않았습니다." };
  if (!safeEqual(String(form.get("password") ?? ""), expected)) return { error: "비밀번호가 올바르지 않습니다." };
  await setAdmin(true);
  redirect("/admin");
}

export async function adminLogout() {
  await setAdmin(false);
  redirect("/");
}

async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function toggleConsultation(form: FormData) {
  await requireAdmin();
  db().prepare("UPDATE consultations SET handled = 1 - handled WHERE id = ?").run(Number(form.get("id")));
  refresh();
}

export async function deleteConsultation(form: FormData) {
  await requireAdmin();
  db().prepare("DELETE FROM consultations WHERE id = ?").run(Number(form.get("id")));
  refresh();
}

export async function toggleNotice(form: FormData) {
  await requireAdmin();
  db().prepare("UPDATE posts SET is_notice = 1 - is_notice WHERE id = ?").run(Number(form.get("id")));
  refresh();
}

export async function adminDeletePost(form: FormData) {
  await requireAdmin();
  await removePost(Number(form.get("id")));
  refresh();
}
