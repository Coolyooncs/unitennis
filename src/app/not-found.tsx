import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <p className="font-display text-8xl font-black text-brand-500">404</p>
        <h1 className="mt-4 text-2xl font-extrabold">페이지를 찾을 수 없습니다</h1>
        <p className="mt-2 text-ink/60">요청하신 페이지가 이동되었거나 삭제되었을 수 있습니다.</p>
        <Link href="/" className="btn-primary mt-8">홈으로 돌아가기</Link>
      </div>
    </section>
  );
}
