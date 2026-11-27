"use client";

import { useActionState } from "react";
import { submitConsultation, type FormState } from "@/app/actions";

export function ConsultForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(submitConsultation, {});

  if (state.ok)
    return (
      <div className="rounded-2xl bg-white/10 p-8 text-center" role="status">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-ball text-2xl text-ink">✓</div>
        <p className="mt-4 text-lg font-bold">{state.message}</p>
        <p className="mt-1 text-sm text-white/60">영업시간 외 신청은 다음 영업일에 연락드립니다.</p>
      </div>
    );

  return (
    <form action={action} className="space-y-3" noValidate>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">이름 (필수)</span>
          <input
            name="name"
            required
            maxLength={40}
            autoComplete="name"
            defaultValue={state.fields?.name}
            placeholder="이름 (필수)"
            className="field border-white/15 bg-white/10 text-white placeholder:text-white/50 focus:bg-white/15"
          />
        </label>
        <label className="block">
          <span className="sr-only">휴대폰 번호 (필수)</span>
          <input
            name="phone"
            required
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            defaultValue={state.fields?.phone}
            placeholder="휴대폰 번호 (필수)"
            className="field border-white/15 bg-white/10 text-white placeholder:text-white/50 focus:bg-white/15"
          />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">문의 내용 (선택)</span>
        <input
          name="message"
          maxLength={500}
          placeholder="희망 요일·시간대 등 (선택)"
          className="field border-white/15 bg-white/10 text-white placeholder:text-white/50 focus:bg-white/15"
        />
      </label>
      <label className="flex items-start gap-2 pt-1 text-sm text-white/70">
        <input type="checkbox" name="agree" className="mt-0.5 size-4 accent-ball" />
        <span>상담을 위한 개인정보(이름, 연락처) 수집·이용에 동의합니다. 상담 완료 후 파기됩니다.</span>
      </label>
      {state.error && (
        <p className="rounded-lg bg-red-500/15 px-4 py-2.5 text-sm text-red-200" role="alert">
          {state.error}
        </p>
      )}
      <button disabled={pending} className="btn-ball w-full py-3.5 text-base">
        {pending ? "접수 중…" : "빠른 상담 신청"}
      </button>
    </form>
  );
}
