import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["could-audacity-deed.ngrok-free.dev"],
  turbopack: {
    root: ".",
  },
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  // output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
