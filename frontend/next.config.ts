import path from "node:path";
import type { NextConfig } from "next";

const root = path.join(import.meta.dirname, "..");
const serverUrl = process.env.SERVER_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingRoot: root,
  turbopack: {
    root,
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${serverUrl}/api/:path*` }];
  },
};

export default nextConfig;
