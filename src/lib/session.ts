import "server-only";
import { cookies } from "next/headers";
import { sign, unsign } from "./crypto";

const ADMIN_COOKIE = "ut_admin";
const ACCESS_COOKIE = "ut_access";
const DAY = 60 * 60 * 24;

type AdminToken = { admin: true; exp: number };
type AccessToken = { ids: number[]; exp: number };

const cookieBase = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function isAdmin(): Promise<boolean> {
  const t = unsign<AdminToken>((await cookies()).get(ADMIN_COOKIE)?.value);
  return !!t?.admin && t.exp > Date.now();
}

export async function setAdmin(on: boolean) {
  const jar = await cookies();
  if (!on) return jar.delete(ADMIN_COOKIE);
  jar.set(ADMIN_COOKIE, sign({ admin: true, exp: Date.now() + DAY * 1000 } satisfies AdminToken), {
    ...cookieBase,
    maxAge: DAY,
  });
}

/** 비밀번호 확인을 통과한 게시글 ID 목록 (비밀글 열람·수정 권한) */
async function accessIds(): Promise<number[]> {
  const t = unsign<AccessToken>((await cookies()).get(ACCESS_COOKIE)?.value);
  return t && t.exp > Date.now() ? t.ids : [];
}

export async function hasPostAccess(postId: number): Promise<boolean> {
  return (await isAdmin()) || (await accessIds()).includes(postId);
}

export async function grantPostAccess(postId: number) {
  const ids = [postId, ...(await accessIds()).filter((id) => id !== postId)].slice(0, 30);
  (await cookies()).set(ACCESS_COOKIE, sign({ ids, exp: Date.now() + DAY * 1000 / 4 } satisfies AccessToken), {
    ...cookieBase,
    maxAge: DAY / 4,
  });
}
