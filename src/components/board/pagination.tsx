import Link from "next/link";

export function Pagination({ page, pages, query }: { page: number; pages: number; query: Record<string, string> }) {
  if (pages <= 1) return null;
  const href = (p: number) => {
    const sp = new URLSearchParams({ ...query, page: String(p) });
    return `/community?${sp}`;
  };
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const nums = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
  const base = "grid size-10 place-items-center rounded-full text-sm font-semibold transition";
  return (
    <nav aria-label="페이지 이동" className="mt-10 flex items-center justify-center gap-1">
      <Link href={href(1)} aria-label="첫 페이지" className={`${base} hover:bg-ink/5 ${page === 1 ? "pointer-events-none opacity-30" : ""}`}>«</Link>
      <Link href={href(Math.max(1, page - 1))} aria-label="이전 페이지" className={`${base} hover:bg-ink/5 ${page === 1 ? "pointer-events-none opacity-30" : ""}`}>‹</Link>
      {nums.map((n) => (
        <Link key={n} href={href(n)} aria-current={n === page ? "page" : undefined} className={`${base} ${n === page ? "bg-brand-500 text-white" : "hover:bg-ink/5"}`}>
          {n}
        </Link>
      ))}
      <Link href={href(Math.min(pages, page + 1))} aria-label="다음 페이지" className={`${base} hover:bg-ink/5 ${page === pages ? "pointer-events-none opacity-30" : ""}`}>›</Link>
      <Link href={href(pages)} aria-label="마지막 페이지" className={`${base} hover:bg-ink/5 ${page === pages ? "pointer-events-none opacity-30" : ""}`}>»</Link>
    </nav>
  );
}
