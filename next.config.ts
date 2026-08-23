import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Abaikan error eslint saat build di Netlify
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Abaikan error typescript saat build di Netlify
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
