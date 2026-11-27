"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Photo = { src: string; caption: string };

/** 매소너리 그리드 + 네이티브 <dialog> 라이트박스 (←/→/Esc, 스와이프) */
export function Gallery({ photos }: { photos: Photo[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const show = (i: number) => {
    setOpen(i);
    dialog.current?.showModal();
  };
  const move = useCallback(
    (d: number) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialog.current?.open) return;
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>li]:mb-4">
        {photos.map((p, i) => (
          <li key={p.src} className="break-inside-avoid">
            <button onClick={() => show(i)} className="group relative block w-full overflow-hidden rounded-2xl bg-ink/5" aria-label={`${p.caption} 크게 보기`}>
              <Image
                src={p.src}
                alt={p.caption}
                width={720}
                height={720}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className={`w-full object-cover transition duration-500 group-hover:scale-105 ${i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"}`}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                {p.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && dialog.current.close()}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-black/90"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {current && (
          <figure className="relative">
            <Image src={current.src} alt={current.caption} width={1200} height={1200} className="max-h-[85dvh] w-auto max-w-[92vw] rounded-xl object-contain" />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {current.caption} · {open! + 1} / {photos.length}
            </figcaption>
          </figure>
        )}
        <button onClick={() => dialog.current?.close()} className="fixed top-4 right-4 grid size-12 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20" aria-label="닫기">
          ×
        </button>
        <button onClick={() => move(-1)} className="fixed top-1/2 left-4 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20" aria-label="이전 사진">
          ‹
        </button>
        <button onClick={() => move(1)} className="fixed top-1/2 right-4 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20" aria-label="다음 사진">
          ›
        </button>
      </dialog>
    </>
  );
}
