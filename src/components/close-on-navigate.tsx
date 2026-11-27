"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** 라우트가 바뀌면 지정한 popover를 닫는다. */
export function CloseOnNavigate({ id }: { id: string }) {
  const pathname = usePathname();
  useEffect(() => {
    const el = document.getElementById(id);
    if (el?.matches(":popover-open")) el.hidePopover();
  }, [pathname, id]);
  return null;
}
