import { Suspense } from "react";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PasswordForm } from "@/components/board/password-form";
import { getPost } from "@/lib/board";

export default function PasswordPage({ params, searchParams }: PageProps<"/community/[id]/password">) {
  return (
    <>
      <PageHero title="커뮤니티" en="Community" />
      <section className="container-x py-20">
        <Suspense fallback={<div className="mx-auto h-80 max-w-md animate-pulse rounded-3xl bg-white" />}>
          <Gate params={params} searchParams={searchParams} />
        </Suspense>
      </section>
    </>
  );
}

async function Gate({ params, searchParams }: Pick<PageProps<"/community/[id]/password">, "params" | "searchParams">) {
  await connection();
  const id = Number((await params).id);
  if (!Number.isInteger(id) || !getPost(id)) notFound();
  const n = (await searchParams).next;
  const next = n === "edit" || n === "delete" ? n : "view";
  return <PasswordForm id={id} next={next} />;
}
