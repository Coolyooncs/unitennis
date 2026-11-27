"use client";

import { useActionState } from "react";
import { verifyPost, type FormState } from "@/app/actions";

const copy = {
  view: { title: "비밀글입니다", desc: "작성 시 입력한 비밀번호를 입력해주세요.", button: "확인" },
  edit: { title: "게시글 수정", desc: "수정하려면 작성 시 입력한 비밀번호를 입력해주세요.", button: "확인" },
  delete: { title: "게시글 삭제", desc: "비밀번호 확인 즉시 게시글이 삭제됩니다.", button: "삭제하기" },
};

export function PasswordForm({ id, next }: { id: number; next: "view" | "edit" | "delete" }) {
  const [state, action, pending] = useActionState<FormState, FormData>(verifyPost, {});
  const c = copy[next];
  return (
    <form action={action} className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center sm:p-10">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-brand-50 text-2xl">🔒</div>
      <h2 className="mt-5 text-xl font-extrabold">{c.title}</h2>
      <p className="mt-2 text-sm text-ink/60">{c.desc}</p>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="next" value={next} />
      <label className="sr-only" htmlFor="pw">비밀번호</label>
      <input id="pw" name="password" type="password" required autoFocus autoComplete="current-password" placeholder="비밀번호" className="field mt-6 text-center" />
      {state.error && <p className="mt-3 text-sm font-semibold text-red-600" role="alert">{state.error}</p>}
      <button disabled={pending} className={`${next === "delete" ? "btn bg-red-600 text-white hover:bg-red-700" : "btn-primary"} mt-5 w-full py-3`}>
        {pending ? "확인 중…" : c.button}
      </button>
    </form>
  );
}
