import Link from "next/link";
import Image from "next/image";

export function PageHero({ title, en, description }: { title: string; en: string; description?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-950 text-white">
      <Image src="/images/slide-3.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-950 via-brand-950/80 to-transparent" />
      <div className="container-x py-16 sm:py-24">
        <nav aria-label="현재 위치" className="text-sm text-white/60">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <span className="mx-2">›</span>
          <span className="text-white">{title}</span>
        </nav>
        <p className="mt-6 font-display text-sm font-bold uppercase tracking-[0.25em] text-ball">{en}</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-xl text-white/70">{description}</p>}
      </div>
    </section>
  );
}
