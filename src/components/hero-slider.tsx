"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { heroSlides } from "@/lib/site";

/** scroll-snap 기반 슬라이더 – 터치 스와이프는 브라우저 기본 동작, 자동재생은 탭이 보일 때만 */
export function HeroSlider() {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = (i + heroSlides.length) % heroSlides.length;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const onScroll = () => setIndex(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (document.visibilityState === "visible") go(index + 1);
    }, 6000);
    return () => clearInterval(t);
  }, [index, paused]);

  return (
    <section
      className="relative isolate h-[78svh] max-h-[860px] min-h-[520px] overflow-hidden bg-brand-950 text-white"
      aria-roledescription="carousel"
      aria-label="메인 슬라이드"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <div ref={track} className="scrollbar-none flex h-full snap-x snap-mandatory overflow-x-auto">
        {heroSlides.map((s, i) => (
          <div
            key={s.src}
            className="relative h-full w-full shrink-0 snap-start"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${heroSlides.length}`}
          >
            <Image src={s.src} alt="" fill priority={i === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-brand-950/10" />
            <div className="container-x relative flex h-full flex-col justify-end pb-24 sm:pb-28">
              <p className="font-display text-sm font-bold uppercase tracking-[0.25em] text-ball">{s.eyebrow}</p>
              <h2 className="mt-4 text-4xl leading-[1.15] font-extrabold tracking-tight whitespace-pre-line sm:text-6xl lg:text-7xl">
                {s.title}
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/program" className="btn-ball px-6 py-3">
                  프로그램 보기
                </Link>
                <Link href="/#consult" className="btn border border-white/40 px-6 py-3 text-white backdrop-blur hover:bg-white/10">
                  빠른 상담 신청
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container-x pointer-events-none absolute inset-x-0 bottom-8 flex items-center justify-between">
        <div className="pointer-events-auto flex items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`${i + 1}번 슬라이드`}
              aria-current={i === index}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-10 bg-ball" : "w-5 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
        <p className="font-display text-sm text-white/70 tabular-nums">
          <span className="text-white">{String(index + 1).padStart(2, "0")}</span> / {String(heroSlides.length).padStart(2, "0")}
        </p>
      </div>
    </section>
  );
}
