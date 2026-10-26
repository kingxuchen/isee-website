import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Trace from Workspace root so standalone keeps apps/isee-china nesting
  outputFileTracingRoot: path.join(__dirname, "../../"),
  // /features 已并入首页功能区块（#features），旧链接 301 到首页锚点
  async redirects() {
    return [
      { source: "/features", destination: "/#features", permanent: true },
    ];
  },
};

export default nextConfig;
