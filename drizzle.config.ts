import { defineConfig } from "drizzle-kit";

// Drizzle Kit config for generating SQL migrations from the schema.
// Migrations are applied to Cloudflare D1 via `wrangler d1 migrations apply`.
export default defineConfig({
  dialect: "sqlite",
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
});
