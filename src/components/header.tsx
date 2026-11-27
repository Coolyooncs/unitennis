import Link from "next/link";
import Image from "next/image";
import { nav, site } from "@/lib/site";
import { Suspense } from "react";
import { NavLinks, NavLinksView } from "./nav-links";
import { CloseOnNavigate } from "./close-on-navigate";

export function Header() {
  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-brand-950 text-[13px] text-white/70 sm:block">
        <div className="container-x flex h-9 items-center justify-end gap-5">
          <a href={`tel:${site.phone}`} className="hover:text-ball">
            대표전화 <strong className="font-semibold text-white">{site.phone}</strong>
          </a>
          <span className="h-3 w-px bg-white/20" />
          <span>
            카톡 아이디 <strong className="font-semibold text-white">{site.kakaoId}</strong>
          </span>
        </div>
      </div>
      <div className="border-b border-ink/5 bg-white/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="container-x flex h-16 items-center justify-between sm:h-20">
          <Link href="/" className="shrink-0" aria-label="U&I Tennis Academy 홈">
            <Image src="/images/logo.png" alt="U&I Tennis Academy" width={1000} height={183} priority className="h-8 w-auto sm:h-10" />
          </Link>

          <Suspense fallback={<NavLinksView pathname="" />}>
            <NavLinks />
          </Suspense>

          <button
            popoverTarget="mobile-menu"
            className="grid size-11 place-items-center rounded-full hover:bg-ink/5 lg:hidden"
            aria-label="메뉴 열기"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
          </button>
        </div>
      </div>

      <Suspense>
        <CloseOnNavigate id="mobile-menu" />
      </Suspense>
      {/* 모바일 메뉴 – 네이티브 Popover API (JS 불필요) */}
      <div
        id="mobile-menu"
        popover="auto"
        className="m-0 ml-auto h-dvh max-h-none w-[min(86vw,360px)] bg-brand-950 p-0 text-white backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="flex h-16 items-center justify-between px-6">
          <span className="font-display text-sm font-bold tracking-[0.2em] text-ball">MENU</span>
          <button popoverTarget="mobile-menu" popoverTargetAction="hide" className="grid size-11 place-items-center rounded-full hover:bg-white/10" aria-label="메뉴 닫기">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <nav className="px-6 pt-4">
          <ul className="space-y-1">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="flex items-baseline justify-between border-b border-white/10 py-4 text-xl font-bold">
                  {n.label}
                  <span className="font-display text-xs font-medium uppercase tracking-widest text-white/40">{n.en}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-3 text-sm text-white/70">
            <a href={`tel:${site.phone}`} className="btn-ball w-full">
              전화 상담 {site.phone}
            </a>
            <p className="text-center">카카오톡 ID · {site.kakaoId}</p>
          </div>
        </nav>
      </div>
    </header>
  );
}
