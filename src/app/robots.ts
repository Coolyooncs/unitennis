import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/community/write"] }, sitemap: "https://unitennis.co.kr/sitemap.xml" };
}
