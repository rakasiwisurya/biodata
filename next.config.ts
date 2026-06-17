import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export so the app can be served on Firebase Hosting's free Spark plan.
  output: "export",
  trailingSlash: true,
  images: {
    // Required for static export: Next's image optimizer is server-side.
    unoptimized: true,
  },
};

export default nextConfig;
