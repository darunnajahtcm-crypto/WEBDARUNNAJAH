import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Abaikan error eslint saat build di Netlify
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
