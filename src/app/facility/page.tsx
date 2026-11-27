import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactCta } from "@/components/contact-cta";
import { Gallery } from "@/components/gallery";
import { facilityPhotos } from "@/lib/site";

export const metadata: Metadata = { title: "시설정보" };

export default function FacilityPage() {
  return (
    <>
      <PageHero title="시설정보" en="Facility" description="U&I Tennis Academy의 시설정보입니다." />
      <section className="container-x py-20">
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            ["정식 규격 코트", "1면"],
            ["입문자·어린이 미니코트", "1면"],
            ["샤워실 · 미팅룸", "완비"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-3xl bg-white p-6">
              <p className="text-sm text-ink/50">{k}</p>
              <p className="mt-1 font-display text-3xl font-extrabold text-brand-500">{v}</p>
            </div>
          ))}
        </div>
        <Gallery photos={facilityPhotos} />
      </section>
      <ContactCta />
    </>
  );
}
