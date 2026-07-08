import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Workers runtime has no sharp; serve images as-is (R2 / Cloudflare
    // Images handled at the edge). Optimisation is revisited in deployment.
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;

// Enable Cloudflare bindings (D1, R2, KV) during `next dev` via miniflare,
// so getCloudflareContext() works locally exactly like in production.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
void initOpenNextCloudflareForDev();
