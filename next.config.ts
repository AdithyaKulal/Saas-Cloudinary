import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  experimental: {
    // Increase max request body size for proxy so large
    // video uploads to /api/video-upload are not truncated at 10MB.
    proxyClientMaxBodySize: "100mb",
  },
};

export default nextConfig;
