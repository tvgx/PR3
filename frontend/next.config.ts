import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
