import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['ably', '@ably/chat'],
};

export default nextConfig;
