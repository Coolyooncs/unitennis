import Link from "next/link";
import Image from "next/image";
import { HeroSlider } from "@/components/hero-slider";
import { ConsultForm } from "@/components/consult-form";
import { highlights, quote, site } from "@/lib/site";

const cards = [
  {
    href: "/about",
    en: "U&I Tennis Academy",
    body: "유앤아이 테니스는 쾌적한 실내 환경과 최고의 코칭 스태프로 구성되어 있으며, 날씨에 구애받지 않고 언제든 테니스를 즐길 수 있습니다.",
    img: "/images/facility/03_Photo_court1.jpg",
  },
  {
    href: "/program",
    en: "Program",
    body: "유앤아이 테니스 아카데미는 평일반, 주말반 레슨으로 구성되어 있으며, 더 자세한 교육 일정은 프로그램 게시판을 통해 지금 확인하세요.",
    img: "/images/facility/08_Photo_court_mach.jpg",
  },
  {
    href: "/community",
    en: "Community",
    body: "유앤아이 테니스 본원의 위치정보와 자세한 프로그램 및 교육 일정은 전화 상담 및 홈페이지 게시판을 통해 확인하실 수 있습니다.",
    img: "/images/facility/09_Photo_meet.jpg",
  },
];

export default function Home() {
  return (
    <>
      <h1 className="sr-only">U&amp;I TENNIS ACADEMY 유앤아이테니스 – 광교·분당 실내 테니스 레슨</h1>
      <HeroSlider />

      {/* 마퀴 띠 */}
      <div className="overflow-hidden bg-ball py-4 text-ink" aria-hidden>
        <div className="flex w-max animate-marquee gap-10 font-display text-2xl font-extrabold uppercase italic">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Indoor Court", "All Weather", "Elite Coaches", "Kids & Adults", "Sanghyeon St. Exit 2", "Since 2019"].map((t) => (
              <span key={`${k}-${t}`} className="flex items-center gap-10">
                {t} <span className="size-3 rounded-full bg-ink" />
              </span>
            )),
          )}
        </div>
      </div>

      {/* 명언 */}
      <section className="container-x py-24 text-center sm:py-32">
        <blockquote className="reveal mx-auto max-w-4xl">
          <p className="font-display text-2xl leading-snug font-semibold text-ink sm:text-4xl">&ldquo;{quote.en}&rdquo;</p>
          <p className="mt-6 text-lg text-ink/60">&ldquo;{quote.ko}&rdquo;</p>
          <footer className="mt-6 text-sm font-semibold tracking-wide text-brand-500">— {quote.by}</footer>
        </blockquote>
      </section>

      {/* 3개 소개 카드 */}
      <section className="container-x pb-24">
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="reveal group relative isolate flex min-h-[420px] flex-col justify-end overflow-hidden rounded-[2rem] p-8 text-white"
            >
              <Image src={c.img} alt="" fill sizes="(min-width: 768px) 33vw, 100vw" className="-z-10 object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-950 via-brand-950/60 to-transparent" />
              <h2 className="font-display text-2xl font-bold">{c.en}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">{c.body}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ball">
                More
                <span className="transition group-hover:translate-x-1">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 특징 벤토 */}
      <section className="bg-white py-24">
        <div className="container-x">
          <p className="eyebrow">Why U&amp;I</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            날씨 걱정 없이, 약속된 시간에
            <br />
            쾌적한 실내 코트에서.
          </h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map((h, i) => (
              <div key={h.title} className={`reveal rounded-3xl p-7 ${i === 0 ? "bg-brand-500 text-white" : "bg-paper"}`}>
                <span className={`font-display text-sm font-bold ${i === 0 ? "text-ball" : "text-brand-500"}`}>0{i + 1}</span>
                <h3 className="mt-10 text-xl font-extrabold">{h.title}</h3>
                <p className={`mt-2 text-[15px] ${i === 0 ? "text-white/75" : "text-ink/60"}`}>{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 빠른 상담 신청 */}
      <section id="consult" className="relative isolate scroll-mt-24 overflow-hidden bg-brand-950 py-24 text-white">
        <Image src="/images/bg.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-20" />
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ball">Quick Consulting</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-5xl">빠른 상담 신청</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              성함과 연락처를 남겨주시면
              <br />
              유앤아이 테니스 아카데미에서
              <br />
              빠른 상담 안내하겠습니다.
            </p>
            <p className="mt-8 text-sm text-white/50">
              전화 <a href={`tel:${site.phone}`} className="font-semibold text-white">{site.phone}</a> · 카카오톡 ID{" "}
              <span className="font-semibold text-white">{site.kakaoId}</span>
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md sm:p-10">
            <ConsultForm />
          </div>
        </div>
      </section>
    </>
  );
}
