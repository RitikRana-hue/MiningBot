import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
      },
    ],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: false, // Disable to avoid critters dependency issue
  },
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
