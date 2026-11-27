import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/session";
import { listPosts, listNotices } from "@/lib/board";
import { formatDate, formatDateTime } from "@/lib/format";
import { adminDeletePost, adminLogout, deleteConsultation, toggleConsultation, toggleNotice } from "@/app/actions";
import { LockIcon } from "@/components/board/icons";

export const metadata: Metadata = { title: "관리자", robots: { index: false } };

type Consultation = { id: number; name: string; phone: string; message: string | null; handled: number; created_at: string };

export default function AdminPage() {
  return (
    <section className="container-x py-12">
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-white" />}>
        <Dashboard />
      </Suspense>
    </section>
  );
}

async function Dashboard() {
  await connection();
  if (!(await isAdmin())) redirect("/admin/login");

  const consultations = db().prepare("SELECT * FROM consultations ORDER BY handled, id DESC LIMIT 100").all() as Consultation[];
  const pending = consultations.filter((c) => !c.handled).length;
  const { rows, total } = listPosts({ page: 1, field: "all", q: "" });
  const unanswered = (
    db()
      .prepare("SELECT COUNT(*) AS n FROM posts p WHERE is_notice = 0 AND NOT EXISTS (SELECT 1 FROM comments c WHERE c.post_id = p.id AND c.is_admin = 1)")
      .get() as { n: number }
  ).n;
  const posts = [...listNotices(), ...rows];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-1 text-3xl font-extrabold">관리자 대시보드</h1>
        </div>
        <div className="flex gap-2">
          <Link href="/community/write" className="btn-primary">공지/글 작성</Link>
          <form action={adminLogout}><button className="btn-ghost">로그아웃</button></form>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="미처리 상담 신청" value={pending} accent />
        <Stat label="답변 대기 게시글" value={unanswered} />
        <Stat label="전체 게시글" value={total} />
      </div>

      <h2 className="mt-12 text-xl font-extrabold">빠른 상담 신청</h2>
      <div className="mt-4 overflow-x-auto rounded-3xl bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-ink/10 text-ink/50">
            <tr><th className="px-5 py-3">신청일</th><th className="px-5 py-3">이름</th><th className="px-5 py-3">연락처</th><th className="px-5 py-3">메모</th><th className="px-5 py-3 text-right">처리</th></tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {consultations.map((c) => (
              <tr key={c.id} className={c.handled ? "text-ink/40" : ""}>
                <td className="px-5 py-3 tabular-nums">{formatDateTime(c.created_at)}</td>
                <td className="px-5 py-3 font-semibold">{c.name}</td>
                <td className="px-5 py-3"><a href={`tel:${c.phone}`} className="text-brand-500 underline">{c.phone}</a></td>
                <td className="px-5 py-3">{c.message}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <form action={toggleConsultation}><input type="hidden" name="id" value={c.id} /><button className={c.handled ? "btn-ghost py-1.5 text-xs" : "btn-ball py-1.5 text-xs"}>{c.handled ? "처리 취소" : "처리 완료"}</button></form>
                    <form action={deleteConsultation}><input type="hidden" name="id" value={c.id} /><button className="btn-danger py-1.5 text-xs">삭제</button></form>
                  </div>
                </td>
              </tr>
            ))}
            {consultations.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-ink/40">상담 신청이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 text-xl font-extrabold">최근 게시글</h2>
      <p className="mt-1 text-sm text-ink/50">관리자로 로그인한 상태에서는 모든 비밀글을 열람하고 관리자 댓글로 답변할 수 있습니다.</p>
      <ul className="mt-4 divide-y divide-ink/5 overflow-hidden rounded-3xl bg-white text-sm">
        {posts.map((p) => (
          <li key={`${p.is_notice}-${p.id}`} className="flex flex-wrap items-center gap-3 px-5 py-3">
            {p.is_notice ? <span className="rounded-full bg-ball px-2 py-0.5 text-xs font-bold">공지</span> : null}
            {p.is_secret ? <LockIcon className="text-ink/40" /> : null}
            <Link href={`/community/${p.id}`} className="min-w-0 flex-1 truncate font-medium hover:text-brand-500">{p.title}</Link>
            <span className={p.comment_count ? "text-brand-500" : "font-semibold text-red-500"}>{p.comment_count ? `댓글 ${p.comment_count}` : "미답변"}</span>
            <span className="text-ink/50">{p.author} · {formatDate(p.created_at)}</span>
            <form action={toggleNotice}><input type="hidden" name="id" value={p.id} /><button className="btn-ghost py-1 text-xs">{p.is_notice ? "공지 해제" : "공지 지정"}</button></form>
            <form action={adminDeletePost}><input type="hidden" name="id" value={p.id} /><button className="btn-danger py-1 text-xs">삭제</button></form>
          </li>
        ))}
      </ul>
    </>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-3xl p-6 ${accent ? "bg-brand-500 text-white" : "bg-white"}`}>
      <p className={`text-sm ${accent ? "text-white/70" : "text-ink/50"}`}>{label}</p>
      <p className="mt-2 font-display text-4xl font-extrabold tabular-nums">{value}</p>
    </div>
  );
}
