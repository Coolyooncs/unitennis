"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createPost, updatePost, type FormState } from "@/app/actions";
import { formatBytes } from "@/lib/format";

type Existing = {
  id: number;
  title: string;
  content: string;
  author: string;
  is_secret: number;
  is_notice: number;
  search_scope: string;
  attachments: { id: number; kind: string; filename: string; size: number }[];
};

export function PostForm({
  mode,
  admin,
  captcha,
  post,
}: {
  mode: "create" | "edit";
  admin: boolean;
  captcha?: { question: string; token: string };
  post?: Existing;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(mode === "create" ? createPost : updatePost, {});
  const [secret, setSecret] = useState(post ? !!post.is_secret : true);
  const v = { title: state.fields?.title ?? post?.title ?? "", content: state.fields?.content ?? post?.content ?? "", author: state.fields?.author ?? post?.author ?? "" };

  return (
    <form action={action} className="space-y-6 rounded-[2rem] bg-white p-6 sm:p-10" encType="multipart/form-data">
      {post && <input type="hidden" name="id" value={post.id} />}
      {captcha && <input type="hidden" name="captcha_token" value={captcha.token} />}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div>
        <label htmlFor="title" className="label">제목 <span className="text-red-500">*</span></label>
        <input id="title" name="title" required maxLength={120} defaultValue={v.title} key={`t${v.title}`} className="field" placeholder="예) 평일 저녁 1:1 레슨 문의드립니다" />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-3 rounded-2xl bg-paper px-5 py-4">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" name="is_secret" checked={secret} onChange={(e) => setSecret(e.target.checked)} className="size-4 accent-brand-500" />
          🔒 비밀글
          <span className="font-normal text-ink/50">(작성자와 관리자만 열람)</span>
        </label>
        {admin && (
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input type="checkbox" name="is_notice" defaultChecked={!!post?.is_notice} className="size-4 accent-brand-500" />
            📌 공지사항
          </label>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="author" className="label">작성자 {!admin && <span className="text-red-500">*</span>}</label>
          <input id="author" name="author" required={!admin && mode === "create"} maxLength={30} defaultValue={v.author || (admin ? "U&I Tennis" : "")} key={`a${v.author}`} className="field" autoComplete="name" />
        </div>
        {!admin && (
          <div>
            <label htmlFor="password" className="label">
              비밀번호 {mode === "create" ? <span className="text-red-500">*</span> : <span className="font-normal text-ink/50">(변경 시에만 입력)</span>}
            </label>
            <input id="password" name="password" type="password" required={mode === "create"} minLength={4} autoComplete="new-password" className="field" placeholder="4자 이상 · 수정/삭제 시 필요" />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="content" className="label">내용 <span className="text-red-500">*</span></label>
        <textarea
          id="content"
          name="content"
          required
          rows={12}
          maxLength={20000}
          defaultValue={v.content}
          key={`c${v.content.length}`}
          className="field resize-y leading-relaxed"
          placeholder={"희망 요일·시간대, 레슨 형태(1:1 / 2:1), 수강생 연령과 경력을 적어주시면 빠르게 안내해 드립니다.\n연락처를 남기실 경우 비밀글로 작성해 주세요."}
        />
      </div>

      <fieldset className="space-y-4">
        <legend className="label">첨부 <span className="font-normal text-ink/50">(각 5MB 이하)</span></legend>
        {post && post.attachments.length > 0 && (
          <ul className="space-y-2">
            {post.attachments.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 rounded-xl bg-paper px-4 py-2.5 text-sm">
                <span className="truncate">
                  <span className="mr-2 rounded bg-ink/10 px-1.5 py-0.5 text-xs">{a.kind === "thumbnail" ? "썸네일" : "첨부"}</span>
                  {a.filename} <span className="text-ink/40">({formatBytes(a.size)})</span>
                </span>
                <label className="flex shrink-0 items-center gap-1.5 text-red-600">
                  <input type="checkbox" name="remove_attachment" value={a.id} className="accent-red-600" /> 삭제
                </label>
              </li>
            ))}
          </ul>
        )}
        <div className="grid gap-3 sm:grid-cols-3">
          <FileInput name="thumbnail" label="썸네일 이미지" accept="image/jpeg,image/png,image/gif,image/webp" />
          <FileInput name="files" label="첨부파일 1" />
          <FileInput name="files" label="첨부파일 2" />
        </div>
      </fieldset>

      <div>
        <label htmlFor="search_scope" className="label">통합검색</label>
        <select id="search_scope" name="search_scope" defaultValue={post?.search_scope ?? (secret ? "title" : "all")} key={String(secret)} className="field">
          {!secret && <option value="all">제목과 내용 검색허용</option>}
          <option value="title">제목만 검색허용{secret ? " (비밀글)" : ""}</option>
          <option value="none">통합검색 제외</option>
        </select>
      </div>

      {captcha && (
        <div>
          <label htmlFor="captcha" className="label">보안코드 <span className="text-red-500">*</span></label>
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-brand-950 px-4 py-3 font-display text-lg font-bold tracking-widest text-ball select-none">{captcha.question}</span>
            <input id="captcha" name="captcha" required inputMode="numeric" className="field w-28 text-center" placeholder="정답" />
          </div>
        </div>
      )}

      {state.error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-ink/10 pt-6">
        <Link href={post ? `/community/${post.id}` : "/community"} className="btn-ghost">
          돌아가기
        </Link>
        <button disabled={pending} className="btn-primary px-8 py-3">
          {pending ? "저장 중…" : "저장하기"}
        </button>
      </div>
    </form>
  );
}

function FileInput({ name, label, accept }: { name: string; label: string; accept?: string }) {
  const [file, setFile] = useState<string>("");
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-ink/15 px-4 py-5 text-center text-sm transition hover:border-brand-400 hover:bg-brand-50/50">
      <span className="font-semibold text-ink/70">{label}</span>
      <span className="w-full truncate text-xs text-ink/45">{file || "클릭하여 선택"}</span>
      <input type="file" name={name} accept={accept} className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")} />
    </label>
  );
}
