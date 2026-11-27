"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addComment, deleteComment, type FormState } from "@/app/actions";
import type { CommentRow } from "@/lib/board";
import { formatDateTime } from "@/lib/format";
import { Linkify } from "./linkify";

type Captcha = { question: string; token: string };

export function Comments({
  postId,
  comments,
  canWrite,
  admin,
  captcha,
}: {
  postId: number;
  comments: CommentRow[];
  canWrite: boolean;
  admin: boolean;
  captcha: Captcha;
}) {
  return (
    <section className="mt-10" aria-labelledby="comments-title">
      <h2 id="comments-title" className="text-lg font-extrabold">
        댓글 <span className="text-brand-500">{comments.length}</span>
      </h2>
      <ul className="mt-4 space-y-3">
        {comments.map((c) => (
          <CommentItem key={c.id} comment={c} admin={admin} />
        ))}
      </ul>
      {canWrite ? (
        <CommentForm postId={postId} admin={admin} captcha={captcha} />
      ) : (
        <p className="mt-4 rounded-2xl bg-ink/5 px-5 py-4 text-sm text-ink/60">비밀글에는 작성자와 관리자만 댓글을 남길 수 있습니다.</p>
      )}
    </section>
  );
}

function CommentItem({ comment: c, admin }: { comment: CommentRow; admin: boolean }) {
  const [asking, setAsking] = useState(false);
  const [state, action, pending] = useActionState<FormState, FormData>(deleteComment, {});
  return (
    <li className={`rounded-2xl p-5 ${c.is_admin ? "border border-brand-100 bg-brand-50" : "bg-white"}`}>
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="flex items-center gap-2">
          <strong className={c.is_admin ? "text-brand-600" : ""}>{c.author}</strong>
          {c.is_admin ? <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[11px] font-bold text-white">관리자</span> : null}
          <span className="text-ink/40">{formatDateTime(c.created_at)}</span>
        </p>
        <button onClick={() => setAsking((v) => !v)} className="text-xs text-ink/40 hover:text-red-600">
          삭제
        </button>
      </div>
      <p className="mt-2 whitespace-pre-wrap leading-relaxed text-ink/80">
        <Linkify text={c.content} />
      </p>
      {asking && (
        <form action={action} className="mt-3 flex flex-wrap items-center gap-2">
          <input type="hidden" name="id" value={c.id} />
          {!admin && <input name="password" type="password" required placeholder="댓글 비밀번호" className="field w-44 py-2 text-sm" />}
          <button disabled={pending} className="btn-danger py-2">{admin ? "관리자 권한으로 삭제" : "삭제 확인"}</button>
          {state.error && <span className="text-sm text-red-600" role="alert">{state.error}</span>}
        </form>
      )}
    </li>
  );
}

function CommentForm({ postId, admin, captcha }: { postId: number; admin: boolean; captcha: Captcha }) {
  const [state, action, pending] = useActionState<FormState, FormData>(addComment, {});
  const form = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) form.current?.reset();
  }, [state]);
  return (
    <form ref={form} action={action} className="mt-6 space-y-3 rounded-3xl bg-white p-5 sm:p-6">
      <input type="hidden" name="post_id" value={postId} />
      <input type="hidden" name="captcha_token" value={captcha.token} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <label className="sr-only" htmlFor="comment-content">댓글 내용</label>
      <textarea id="comment-content" name="content" required rows={3} maxLength={3000} defaultValue={state.ok ? "" : state.fields?.content} placeholder="댓글을 입력하세요" className="field resize-y" />
      <div className="flex flex-wrap items-center gap-2">
        {admin ? (
          <input name="author" defaultValue="U&I Tennis" className="field w-40 py-2.5 text-sm" aria-label="작성자" />
        ) : (
          <>
            <input name="author" required maxLength={30} defaultValue={state.fields?.author} placeholder="작성자" className="field w-32 py-2.5 text-sm" aria-label="작성자" />
            <input name="password" type="password" required minLength={4} placeholder="비밀번호" autoComplete="new-password" className="field w-32 py-2.5 text-sm" aria-label="비밀번호" />
            <label className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-ink/60">{captcha.question}</span>
              <input name="captcha" required inputMode="numeric" className="field w-16 py-2.5 text-center text-sm" aria-label="보안코드" />
            </label>
          </>
        )}
        <button disabled={pending} className="btn-primary ml-auto">{pending ? "등록 중…" : "댓글 등록"}</button>
      </div>
      {state.error && <p className="text-sm font-semibold text-red-600" role="alert">{state.error}</p>}
    </form>
  );
}
