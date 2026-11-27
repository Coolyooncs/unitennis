import type { MetadataRoute } from "next";
import { nav } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://unitennis.co.kr";
  return [{ url: base, priority: 1 }, ...nav.map((n) => ({ url: base + n.href, priority: 0.8 }))];
}
