import { readFile } from "node:fs/promises";
import path from "node:path";
import { getAttachment, getPost } from "@/lib/board";
import { UPLOAD_DIR } from "@/lib/db";
import { hasPostAccess } from "@/lib/session";

export async function GET(_req: Request, ctx: RouteContext<"/api/files/[id]">) {
  const a = getAttachment(Number((await ctx.params).id));
  if (!a) return new Response("Not found", { status: 404 });
  const post = getPost(a.post_id);
  if (!post) return new Response("Not found", { status: 404 });
  if (post.is_secret && !(await hasPostAccess(post.id))) return new Response("Forbidden", { status: 403 });

  const body = await readFile(path.join(UPLOAD_DIR, path.basename(a.stored_name))).catch(() => null);
  if (!body) return new Response("Not found", { status: 404 });
  const inline = /^image\/(jpeg|png|gif|webp)$/.test(a.mime);
  return new Response(body, {
    headers: {
      "Content-Type": inline ? a.mime : "application/octet-stream",
      "Content-Disposition": `${inline ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(a.filename)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": post.is_secret ? "private, no-store" : "public, max-age=3600",
    },
  });
}
