import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // CSR 최적화 설정
  reactStrictMode: true,

  // 이미지 최적화 설정
  images: {
    remotePatterns: [],
  },

  // Turbopack 활성화 (Next.js 16 기본값)
  turbopack: {},
};

export default nextConfig;
