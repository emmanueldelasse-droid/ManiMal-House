import type { NextConfig } from "next";
import path from "node:path";

const workspaceRoot = path.join(process.cwd(), "../..");

const nextConfig: NextConfig = {
  transpilePackages: ["@creator-ai-studio/shared"],
  typedRoutes: true,
  turbopack: {
    root: workspaceRoot
  }
};

export default nextConfig;
