import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: ".",
  },
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
