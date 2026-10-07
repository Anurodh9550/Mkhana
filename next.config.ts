import type { NextConfig } from "next";

const django = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", pathname: "/media/**" },
      { protocol: "http", hostname: "localhost", pathname: "/media/**" },
    ],
  },
  async rewrites() {
    return [
      { source: "/api/:path*", destination: `${django}/api/:path*` },
      { source: "/media/:path*", destination: `${django}/media/:path*` },
    ];
  },
};

export default nextConfig;
