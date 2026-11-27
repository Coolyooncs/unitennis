import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { FloatingCta } from "@/components/floating-cta";
import { site } from "@/lib/site";

const archivo = Archivo({ variable: "--font-archivo", subsets: ["latin"], weight: ["500", "600", "700", "800", "900"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://unitennis.co.kr"),
  title: { default: `${site.name} | ${site.nameKo}`, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ["광교테니스", "분당테니스", "실내테니스레슨", "강습전문테니스아카데미", "상현역 테니스", "수지 테니스"],
  openGraph: {
    title: `U&I | ${site.nameKo}`,
    description: site.description,
    images: ["/images/slide-2.jpg"],
    locale: "ko_KR",
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = { themeColor: "#0f1d36" };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsActivityLocation",
  name: "U&I Tennis Academy 유앤아이테니스",
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "광교중앙로 302, 7층 (상현동, 블루스퀘어)",
    addressLocality: "용인시 수지구",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={archivo.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 btn-ball">
          본문 바로가기
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingCta />
      </body>
    </html>
  );
}
