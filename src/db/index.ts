import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

/**
 * Returns a Drizzle client bound to the Cloudflare D1 database for the
 * current request. Must be called within a request/render context
 * (dynamic rendering). During `next dev`, OpenNext's dev bindings make the
 * local D1 available via miniflare.
 */
export function getDb() {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}

/**
 * Async variant — safe to call outside the request context
 * (e.g. generateStaticParams, generateMetadata during prerender).
 */
export async function getDbAsync() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB, { schema });
}

export { schema };
