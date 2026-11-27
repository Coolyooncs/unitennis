"use client";

import { useActionState } from "react";
import { adminLogin, type FormState } from "@/app/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(adminLogin, {});
  return (
    <form action={action} className="w-full max-w-sm rounded-3xl bg-white p-8 sm:p-10">
      <p className="eyebrow">Admin</p>
      <h1 className="mt-2 text-2xl font-extrabold">관리자 로그인</h1>
      <label htmlFor="admin-pw" className="label mt-8">비밀번호</label>
      <input id="admin-pw" name="password" type="password" required autoFocus autoComplete="current-password" className="field" />
      {state.error && <p className="mt-3 text-sm font-semibold text-red-600" role="alert">{state.error}</p>}
      <button disabled={pending} className="btn-primary mt-6 w-full py-3">{pending ? "확인 중…" : "로그인"}</button>
    </form>
  );
}
