import Link from "next/link";
import { site } from "@/lib/site";

/** 모바일 하단 고정 상담바 + 데스크톱 우측 플로팅 버튼 */
export function FloatingCta() {
  return (
    <>
      <div className="fixed right-6 bottom-6 z-30 hidden flex-col gap-3 lg:flex">
        <a
          href={`tel:${site.phone}`}
          className="group flex size-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-xl shadow-brand-900/30 transition hover:scale-105"
          aria-label={`전화 상담 ${site.phone}`}
          title={site.phone}
        >
          <PhoneIcon />
        </a>
        <Link
          href="/#consult"
          className="flex size-14 items-center justify-center rounded-full bg-ball text-ink shadow-xl shadow-brand-900/20 transition hover:scale-105"
          aria-label="빠른 상담 신청"
          title="빠른 상담 신청"
        >
          <ChatIcon />
        </Link>
      </div>
      <div className="h-16 lg:hidden" aria-hidden />
      <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-2 border-t border-ink/10 bg-white/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden">
        <a href={`tel:${site.phone}`} className="flex h-16 items-center justify-center gap-2 font-semibold text-brand-600">
          <PhoneIcon /> 전화 상담
        </a>
        <Link href="/#consult" className="flex h-16 items-center justify-center gap-2 bg-ball font-semibold text-ink">
          <ChatIcon /> 빠른 상담 신청
        </Link>
      </div>
    </>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
