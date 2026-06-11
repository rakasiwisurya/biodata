import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.arcxora.com",
        pathname: "/biodata/**",
      },
    ],
  },
};

export default nextConfig;
