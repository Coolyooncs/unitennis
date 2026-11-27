import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { PageHero } from "@/components/page-hero";
import { SearchBar } from "@/components/board/search-bar";
import { Pagination } from "@/components/board/pagination";
import { ClipIcon, LockIcon } from "@/components/board/icons";
import { listNotices, listPosts, rowNumber, type PostListItem, type SearchField } from "@/lib/board";
import { formatDate, isRecent } from "@/lib/format";

export const metadata: Metadata = { title: "커뮤니티", description: "유앤아이 테니스 아카데미 강습 문의 게시판" };

export default function CommunityPage({ searchParams }: PageProps<"/community">) {
  return (
    <>
      <PageHero title="커뮤니티" en="Community" description="유앤아이 테니스 아카데미의 강습문의 커뮤니티입니다." />
      <section className="container-x py-16">
        <Suspense fallback={<BoardSkeleton />}>
          <Board searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function Board({ searchParams }: { searchParams: PageProps<"/community">["searchParams"] }) {
  await connection();
  const sp = await searchParams;
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const field = (["all", "title", "content", "author"].includes(one(sp.field)) ? one(sp.field) : "all") as SearchField;
  const q = one(sp.q).slice(0, 50);
  const { rows, total, page, pages } = listPosts({ page: Number(one(sp.page)) || 1, field, q });
  const notices = page === 1 && !q ? listNotices() : [];

  return (
    <>
      {one(sp.deleted) && (
        <p className="mb-6 rounded-2xl bg-brand-50 px-5 py-3 text-sm font-semibold text-brand-700" role="status">
          게시글이 삭제되었습니다.
        </p>
      )}
      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/60">
          {q ? (
            <>
              <strong className="text-ink">&ldquo;{q}&rdquo;</strong> 검색 결과 <strong className="text-brand-500">{total}</strong>건 ·{" "}
              <Link href="/community" className="underline">전체 보기</Link>
            </>
          ) : (
            <>
              전체 <strong className="text-brand-500">{total.toLocaleString()}</strong>건
            </>
          )}
        </p>
        <SearchBar field={field} q={q} />
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl bg-white">
        <div className="hidden grid-cols-[80px_1fr_120px_110px_70px] border-b border-ink/10 bg-brand-950 px-6 py-4 text-sm font-semibold text-white md:grid">
          <span className="text-center">번호</span>
          <span>제목</span>
          <span className="text-center">작성자</span>
          <span className="text-center">작성일</span>
          <span className="text-center">조회</span>
        </div>
        <ul className="divide-y divide-ink/5">
          {notices.map((p) => (
            <Row key={`n${p.id}`} post={p} num={<span className="rounded-full bg-ball px-2.5 py-1 text-xs font-bold text-ink">공지</span>} />
          ))}
          {rows.map((p, i) => (
            <Row key={p.id} post={p} num={rowNumber(total, page, i)} />
          ))}
          {rows.length === 0 && (
            <li className="px-6 py-20 text-center text-ink/50">{q ? "검색 결과가 없습니다." : "등록된 게시글이 없습니다."}</li>
          )}
        </ul>
      </div>

      <div className="mt-6 flex justify-end">
        <Link href="/community/write" className="btn-primary">
          ✎ 글쓰기
        </Link>
      </div>
      <Pagination page={page} pages={pages} query={q ? { field, q } : {}} />
    </>
  );
}

function Row({ post: p, num }: { post: PostListItem; num: React.ReactNode }) {
  return (
    <li className={p.is_notice ? "bg-brand-50/50" : ""}>
      <Link
        href={`/community/${p.id}`}
        className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-1 px-5 py-4 transition hover:bg-brand-50/60 md:grid-cols-[80px_1fr_120px_110px_70px] md:items-center md:px-6"
      >
        <span className="hidden text-center text-sm text-ink/50 tabular-nums md:block">{num}</span>
        <span className="flex min-w-0 items-center gap-1.5">
          {p.is_notice ? <span className="shrink-0 md:hidden">{num}</span> : null}
          {p.is_secret ? <LockIcon className="shrink-0 text-ink/40" /> : null}
          <span className={`truncate ${p.is_notice ? "font-bold" : "font-medium"}`}>{p.title}</span>
          {p.comment_count > 0 && <span className="shrink-0 text-sm font-bold text-brand-500">[{p.comment_count}]</span>}
          {p.has_file ? <ClipIcon className="shrink-0 text-ink/40" /> : null}
          {isRecent(p.created_at) && <span className="shrink-0 rounded bg-red-500 px-1 text-[10px] leading-4 font-bold text-white">N</span>}
        </span>
        <span className="col-span-2 flex gap-2 text-xs text-ink/50 md:col-span-1 md:block md:text-center md:text-sm md:text-ink/70">
          <span className={p.is_admin ? "font-semibold text-brand-500" : ""}>{p.author}</span>
          <span className="md:hidden">· {formatDate(p.created_at)} · 조회 {p.views}</span>
        </span>
        <span className="hidden text-center text-sm text-ink/50 tabular-nums md:block">{formatDate(p.created_at)}</span>
        <span className="hidden text-center text-sm text-ink/50 tabular-nums md:block">{p.views.toLocaleString()}</span>
      </Link>
    </li>
  );
}

function BoardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="ml-auto h-11 w-80 max-w-full rounded-xl bg-ink/5" />
      <div className="mt-6 space-y-px overflow-hidden rounded-3xl bg-white">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-14 border-b border-ink/5 px-6 py-4">
            <div className="h-4 w-2/3 rounded bg-ink/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
