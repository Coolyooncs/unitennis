"use client";

import { deletePostAction } from "@/app/actions";

export function DeletePostButton({ id }: { id: number }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(e) => {
        if (!confirm("이 게시글을 삭제할까요? 삭제 후에는 되돌릴 수 없습니다.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button className="btn-danger">삭제</button>
    </form>
  );
}
