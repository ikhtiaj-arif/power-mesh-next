import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  output: "export",
  images: {
    // Required for `output: "export"` (no Next Image Optimization server).
    unoptimized: true,
  },
};

export default nextConfig;
