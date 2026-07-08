import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";

// Force dynamic (edge) rendering — this route reads/writes live D1 data.
export const dynamic = "force-dynamic";

/**
 * Health check that proves the full D1 pipeline works at runtime:
 * write a timestamp to the settings table, then read it back.
 */
export async function GET() {
  try {
    const db = getDb();
    const stamp = new Date().toISOString();

    await db
      .insert(settings)
      .values({ key: "healthcheck", value: stamp })
      .onConflictDoUpdate({ target: settings.key, set: { value: stamp } });

    const [row] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, "healthcheck"));

    return NextResponse.json({
      ok: true,
      db: "cloudflare-d1",
      wrote: stamp,
      readBack: row?.value ?? null,
      match: row?.value === stamp,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
