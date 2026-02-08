import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix for Vercel deployment when using monorepo structure
  outputFileTracingRoot: path.join(__dirname, "../"),

  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_GATEWAY_URL?.replace('/api', '') || 'http://localhost:8000'}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
