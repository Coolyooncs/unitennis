import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "관리자 로그인", robots: { index: false } };

export default function AdminLoginPage() {
  return (
    <section className="container-x grid min-h-[60vh] place-items-center py-20">
      <LoginForm />
    </section>
  );
}
