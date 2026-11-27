import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/page-hero";
import { ContactCta } from "@/components/contact-cta";
import { coaches } from "@/lib/site";

export const metadata: Metadata = { title: "강사진 소개" };

export default function CoachesPage() {
  return (
    <>
      <PageHero title="강사진 소개" en="Instructors" description="U&I Tennis Academy 대표 강사진 정보입니다." />
      <section className="container-x space-y-6 py-20">
        {coaches.map((c, i) => (
          <article
            key={c.name}
            className="reveal grid overflow-hidden rounded-[2rem] bg-white md:grid-cols-[320px_1fr]"
          >
            <div className="relative aspect-[7/10] md:aspect-auto">
              <Image src={c.photo} alt={`${c.name} 프로`} fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
              <span className="absolute top-5 left-5 rounded-full bg-ball px-3 py-1 font-display text-xs font-bold">
                COACH 0{i + 1}
              </span>
            </div>
            <div className="p-8 sm:p-12">
              <h2 className="text-3xl font-extrabold">
                {c.name} <span className="text-brand-500">프로</span>
              </h2>
              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="eyebrow">Education</h3>
                  <ul className="mt-4 space-y-2 text-ink/75">
                    {c.education.map((e) => (
                      <li key={e} className="flex gap-3">
                        <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-teal-brand" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="eyebrow">Career</h3>
                  <ul className="mt-4 space-y-2 text-ink/75">
                    {c.career.map((e) => (
                      <li key={e} className="flex gap-3">
                        <span className="mt-2 size-2.5 shrink-0 rounded-full bg-ball ring-2 ring-ball/30" />
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>
      <ContactCta />
    </>
  );
}
