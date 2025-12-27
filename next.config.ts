import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // cacheComponents: true,
  productionBrowserSourceMaps: false,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
