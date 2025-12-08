import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: '/whispr',
  assetPrefix: '/whispr',
  serverExternalPackages: ['ably', '@ably/chat'],
};

export default nextConfig;
