import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // WARNING: Use cautiously!
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
