import Link from "next/link";
import { site } from "@/lib/site";

export function ContactCta() {
  return (
    <section className="container-x py-20">
      <div className="reveal relative overflow-hidden rounded-[2rem] bg-brand-500 px-8 py-12 text-white sm:px-14 sm:py-16">
        <div className="absolute -top-16 -right-16 size-64 rounded-full bg-ball/90 blur-0" aria-hidden />
        <div className="absolute -top-16 -right-16 size-64 rounded-full border-[10px] border-white/30" aria-hidden />
        <div className="relative max-w-xl">
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-white/70">U&amp;I Tennis Academy</p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">궁금한 사항을 지금 문의하세요</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/community/write" className="btn bg-white text-brand-600 hover:bg-brand-50">
              문의하기
            </Link>
            <a href={`tel:${site.phone}`} className="btn border border-white/40 text-white hover:bg-white/10">
              {site.phone}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
