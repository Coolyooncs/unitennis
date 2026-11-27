import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { PageHero } from "@/components/page-hero";
import { PostForm } from "@/components/board/post-form";
import { getPost, listAttachments } from "@/lib/board";
import { hasPostAccess, isAdmin } from "@/lib/session";

export default function EditPage({ params }: PageProps<"/community/[id]/edit">) {
  return (
    <>
      <PageHero title="게시글 수정" en="Community" />
      <section className="container-x max-w-4xl py-16">
        <Suspense fallback={<div className="h-[600px] animate-pulse rounded-[2rem] bg-white" />}>
          <Editor params={params} />
        </Suspense>
      </section>
    </>
  );
}

async function Editor({ params }: Pick<PageProps<"/community/[id]/edit">, "params">) {
  await connection();
  const id = Number((await params).id);
  const post = Number.isInteger(id) ? getPost(id) : undefined;
  if (!post) notFound();
  if (!(await hasPostAccess(id))) redirect(`/community/${id}/password?next=edit`);
  const attachments = listAttachments(id).map(({ id, kind, filename, size }) => ({ id, kind, filename, size }));
  return <PostForm mode="edit" admin={await isAdmin()} post={{ ...post, attachments }} />;
}
