import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PasswordForm } from "@/components/board/password-form";
import { DeletePostButton } from "@/components/board/delete-post-button";
import { Comments } from "@/components/board/comments";
import { Linkify } from "@/components/board/linkify";
import { ClipIcon, LockIcon } from "@/components/board/icons";
import { getNeighbors, getPost, incrementViews, listAttachments, listComments } from "@/lib/board";
import { hasPostAccess, isAdmin } from "@/lib/session";
import { createCaptcha } from "@/lib/captcha";
import { formatBytes, formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "커뮤니티", robots: { index: false } };

export default function PostPage({ params }: PageProps<"/community/[id]">) {
  return (
    <>
      <PageHero title="커뮤니티" en="Community" />
      <section className="container-x max-w-4xl py-16">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-[2rem] bg-white" />}>
          <Post params={params} />
        </Suspense>
      </section>
    </>
  );
}

async function Post({ params }: { params: PageProps<"/community/[id]">["params"] }) {
  await connection();
  const id = Number((await params).id);
  const post = Number.isInteger(id) ? getPost(id) : undefined;
  if (!post) notFound();

  const access = await hasPostAccess(id);
  if (post.is_secret && !access) return <PasswordForm id={id} next="view" />;

  incrementViews(id);
  const admin = await isAdmin();
  const attachments = listAttachments(id);
  const thumb = attachments.find((a) => a.kind === "thumbnail");
  const files = attachments.filter((a) => a.kind === "file");
  const comments = listComments(id);
  const { prev, next } = getNeighbors(id);

  return (
    <>
      <article className="overflow-hidden rounded-[2rem] bg-white">
        <header className="border-b border-ink/10 p-6 sm:p-10">
          <div className="flex flex-wrap items-center gap-2">
            {post.is_notice ? <span className="rounded-full bg-ball px-2.5 py-1 text-xs font-bold">공지</span> : null}
            {post.is_secret ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink/5 px-2.5 py-1 text-xs font-semibold text-ink/60">
                <LockIcon /> 비밀글
              </span>
            ) : null}
          </div>
          <h2 className="mt-3 text-2xl leading-snug font-extrabold sm:text-3xl">{post.title}</h2>
          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink/50">
            <div className="flex gap-1.5"><dt className="sr-only">작성자</dt><dd className={post.is_admin ? "font-semibold text-brand-500" : "font-semibold text-ink/80"}>{post.author}</dd></div>
            <div className="flex gap-1.5"><dt>작성일</dt><dd className="tabular-nums">{formatDateTime(post.created_at)}</dd></div>
            <div className="flex gap-1.5"><dt>조회</dt><dd className="tabular-nums">{(post.views + 1).toLocaleString()}</dd></div>
          </dl>
        </header>

        <div className="p-6 sm:p-10">
          {thumb && (
            <Image src={`/api/files/${thumb.id}`} alt="" width={1200} height={800} unoptimized className="mb-8 h-auto max-h-[600px] w-full rounded-2xl object-contain" />
          )}
          <div className="text-[16px] leading-[1.9] whitespace-pre-wrap text-ink/85">
            <Linkify text={post.content} />
          </div>
          {files.length > 0 && (
            <ul className="mt-10 space-y-2 rounded-2xl bg-paper p-4">
              {files.map((f) => (
                <li key={f.id}>
                  <a href={`/api/files/${f.id}`} className="flex items-center gap-2 text-sm hover:text-brand-500">
                    <ClipIcon className="shrink-0" />
                    <span className="truncate font-medium">{f.filename}</span>
                    <span className="shrink-0 text-ink/40">({formatBytes(f.size)})</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/community" className="btn-ghost">목록보기</Link>
        <div className="flex gap-2">
          <Link href={access ? `/community/${id}/edit` : `/community/${id}/password?next=edit`} className="btn-ghost">수정</Link>
          {access ? (
            <DeletePostButton id={id} />
          ) : (
            <Link href={`/community/${id}/password?next=delete`} className="btn-danger">삭제</Link>
          )}
        </div>
      </div>

      <Comments postId={id} comments={comments} canWrite={!post.is_secret || access} admin={admin} captcha={createCaptcha()} />

      <nav aria-label="이전/다음 글" className="mt-10 divide-y divide-ink/5 overflow-hidden rounded-2xl bg-white text-sm">
        {[["다음글", next], ["이전글", prev]].map(([label, p]) => {
          const n = p as typeof next;
          return (
            <div key={label as string} className="flex items-center gap-4 px-5 py-4">
              <span className="w-12 shrink-0 font-semibold text-ink/40">{label as string}</span>
              {n ? (
                <Link href={`/community/${n.id}`} className="flex min-w-0 items-center gap-1.5 hover:text-brand-500">
                  {n.is_secret ? <LockIcon className="shrink-0 text-ink/40" /> : null}
                  <span className="truncate">{n.title}</span>
                </Link>
              ) : (
                <span className="text-ink/30">없음</span>
              )}
            </div>
          );
        })}
      </nav>
    </>
  );
}
