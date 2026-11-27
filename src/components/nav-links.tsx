"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

export function NavLinks() {
  return <NavLinksView pathname={usePathname()} />;
}

/** pathname 없이도 렌더 가능한 정적 셸 (Suspense fallback 용) */
export function NavLinksView({ pathname }: { pathname: string }) {
  return (
    <nav aria-label="주 메뉴" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {nav.map((n) => {
          const active = pathname === n.href || pathname.startsWith(n.href + "/");
          return (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-[15px] font-semibold transition hover:bg-ink/5 ${
                  active ? "text-brand-500" : "text-ink/80"
                }`}
              >
                {n.label}
                {active && <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand-500" />}
              </Link>
            </li>
          );
        })}
        <li className="ml-3">
          <Link href="/#consult" className="btn-primary">
            상담 신청
          </Link>
        </li>
      </ul>
    </nav>
  );
}
