import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // Deaktiviert ESLint während des Builds
  },
};

export default nextConfig;
