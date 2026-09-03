import type { NextConfig } from "next";

// standalone：把运行时依赖打进 .next/standalone，供 Docker 镜像瘦身部署
const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
