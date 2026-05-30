import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel handles output automatically — no "output" config needed
  reactStrictMode: false,
  images: {
    // Allow external image domains if needed
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
