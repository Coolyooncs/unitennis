"use client";

import { useState } from "react";
import type { PriceTable } from "@/lib/site";

export function PriceTabs({ tables }: { tables: PriceTable[] }) {
  const [active, setActive] = useState(0);
  const t = tables[active];
  return (
    <div>
      <div role="tablist" aria-label="레슨 구분" className="inline-flex rounded-full bg-white p-1.5 shadow-sm">
        {tables.map((tb, i) => (
          <button
            key={tb.title}
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold transition sm:px-7 ${
              i === active ? "bg-brand-500 text-white" : "text-ink/60 hover:text-ink"
            }`}
          >
            {tb.title}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-8">
        <h2 className="text-2xl font-extrabold">{t.title} 프로그램</h2>

        {/* 데스크톱: 표 */}
        <div className="mt-6 hidden overflow-hidden rounded-3xl bg-white md:block">
          <table className="w-full text-left">
            <thead className="bg-brand-950 text-sm text-white">
              <tr>
                <th className="px-6 py-4 font-semibold" colSpan={2}>구분</th>
                {t.columns.map((c) => (
                  <th key={c} className="px-6 py-4 text-right font-semibold">{c}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {t.rows.map((r) => (
                <tr key={r.time + r.type} className="transition hover:bg-brand-50/60">
                  <td className="w-24 px-6 py-5 font-display font-bold text-brand-500">{r.time}</td>
                  <td className="w-24 px-6 py-5 font-semibold">{r.type}</td>
                  {r.prices.map((p, i) => (
                    <td key={i} className="px-6 py-5 text-right tabular-nums">
                      <Price value={p} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 모바일: 카드 */}
        <div className="mt-6 grid gap-3 md:hidden">
          {t.rows.map((r) => (
            <div key={r.time + r.type} className="rounded-3xl bg-white p-5">
              <p className="font-bold">
                <span className="text-brand-500">{r.time}</span> · {r.type}
              </p>
              <dl className="mt-3 divide-y divide-ink/5">
                {t.columns.map((c, i) => (
                  <div key={c} className="flex justify-between py-2 text-sm">
                    <dt className="text-ink/50">{c}</dt>
                    <dd className="tabular-nums"><Price value={r.prices[i]} /></dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Price({ value }: { value: string | null }) {
  if (!value) return <span className="text-ink/30">–</span>;
  const [total, per] = value.split(" ");
  return (
    <>
      <span className="font-bold">{total}</span>
      {per && <span className="ml-1.5 text-sm text-ink/45">1인 {per.replace(/[()]/g, "")}</span>}
    </>
  );
}
