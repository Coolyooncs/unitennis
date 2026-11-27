import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  experimental: {
    serverActions: { bodySizeLimit: "12mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // 기존 워드프레스 URL → 새 URL (검색엔진/즐겨찾기 호환)
  async redirects() {
    return [
      { source: "/commnunity", has: [{ type: "query", key: "uid", value: "(?<uid>\\d+)" }], destination: "/community/:uid", permanent: true },
      { source: "/commnunity/", has: [{ type: "query", key: "uid", value: "(?<uid>\\d+)" }], destination: "/community/:uid", permanent: true },
      { source: "/commnunity", destination: "/community", permanent: true },
      { source: "/gallery", destination: "/facility", permanent: true },
      { source: "/%EA%B0%95%EC%82%AC%EC%A7%84-%EC%86%8C%EA%B0%9C", destination: "/coaches", permanent: true },
      { source: "/%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%A8", destination: "/program", permanent: true },
    ];
  },
};

export default nextConfig;
