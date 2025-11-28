import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:8000/uploads/:path*', //TODO: change to production URL 
      },
    ];
  },
};

export default nextConfig;
