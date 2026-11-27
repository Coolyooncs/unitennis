import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { ContactCta } from "@/components/contact-cta";
import { PriceTabs } from "@/components/price-tabs";
import { priceTables, site, specialLessons } from "@/lib/site";

export const metadata: Metadata = { title: "프로그램" };

export default function ProgramPage() {
  return (
    <>
      <PageHero title="프로그램" en="Program" description="평일반 · 주말반 · 쿠폰레슨 · 특별레슨으로 구성되어 있습니다." />
      <section className="container-x py-20">
        <PriceTabs tables={priceTables} />

        <div className="mt-16">
          <h2 className="text-2xl font-extrabold">특별레슨</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {specialLessons.map((s) => (
              <div key={s.name} className="flex items-end justify-between rounded-3xl bg-white p-7">
                <div>
                  <p className="text-sm text-ink/50">대상 {s.target} · {s.time}</p>
                  <h3 className="mt-1 text-xl font-extrabold">{s.name}</h3>
                </div>
                <p className="font-display text-3xl font-extrabold text-brand-500">
                  {s.price}
                  <span className="ml-1 text-base text-ink/50">원</span>
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-1 rounded-2xl border border-dashed border-ink/20 p-6 text-sm text-ink/60">
          <p>* 모든 비용은 &ldquo;원&rdquo; 기준이며, 모든 금액은 VAT 포함입니다.</p>
          <p>* 2인 레슨의 괄호 안 금액은 1인당 금액입니다.</p>
          <p>* 계좌정보 : {site.bankAccount}</p>
        </div>
      </section>
      <ContactCta />
    </>
  );
}
