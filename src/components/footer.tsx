import Link from "next/link";
import Image from "next/image";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-brand-950 text-white/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Image src="/images/logo.png" alt="U&I Tennis Academy" width={1000} height={183} className="h-9 w-auto brightness-0 invert" />
          <p className="mt-6 max-w-sm leading-relaxed">
            유앤아이 테니스 아카데미는 &ldquo;U &amp; I&rdquo; 라는 모토 아래 남녀노소 누구든 관계없이 테니스를 쉽게 배우고 즐길 수 있는
            공간입니다.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ball">Address</h2>
          <p className="mt-4 leading-relaxed">
            {site.address}
            <br />
            {site.addressDetail}
          </p>
          <p className="mt-2 text-sm text-white/50">{site.subway}</p>
        </div>
        <div>
          <h2 className="font-display text-xs font-bold uppercase tracking-[0.2em] text-ball">CS Center</h2>
          <ul className="mt-4 space-y-1.5">
            <li>
              대표전화 :{" "}
              <a href={`tel:${site.phone}`} className="font-semibold text-white hover:text-ball">
                {site.phone}
              </a>
            </li>
            <li>
              email :{" "}
              <a href={`mailto:${site.email}`} className="hover:text-ball">
                {site.email}
              </a>
            </li>
            <li>카톡 아이디 : {site.kakaoId}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <nav aria-label="하단 메뉴">
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="hover:text-white">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p>
            Copyright © U&amp;I Tennis Academy. All rights reserved. ·{" "}
            <Link href="/admin" className="hover:text-white">
              관리자
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
