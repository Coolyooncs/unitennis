import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { PageHero } from "@/components/page-hero";
import { PostForm } from "@/components/board/post-form";
import { createCaptcha } from "@/lib/captcha";
import { isAdmin } from "@/lib/session";

export const metadata: Metadata = { title: "글쓰기", robots: { index: false } };

export default function WritePage() {
  return (
    <>
      <PageHero title="글쓰기" en="Community" description="강습 문의를 남겨주시면 빠르게 답변드리겠습니다." />
      <section className="container-x max-w-4xl py-16">
        <Suspense fallback={<div className="h-[600px] animate-pulse rounded-[2rem] bg-white" />}>
          <Writer />
        </Suspense>
      </section>
    </>
  );
}

async function Writer() {
  await connection();
  const admin = await isAdmin();
  return <PostForm mode="create" admin={admin} captcha={admin ? undefined : createCaptcha()} />;
}
