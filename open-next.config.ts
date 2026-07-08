import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// OpenNext configuration for Cloudflare Workers.
// Caching adapters (R2 incremental cache, D1 tag cache, etc.) can be wired
// here later for ISR. Defaults are fine for dynamic, edge-rendered pages.
export default defineCloudflareConfig({});
