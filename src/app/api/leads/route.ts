import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { enquiries, ENQUIRY_TYPES } from "@/db/schema";

export const dynamic = "force-dynamic";

type Body = {
  type?: string;
  name?: string;
  phone?: string;
  email?: string;
  itemType?: string;
  itemId?: string;
  itemName?: string;
  message?: string;
  source?: string;
};

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const type = (
    ENQUIRY_TYPES.includes(body.type as never) ? body.type : "enquiry"
  ) as (typeof ENQUIRY_TYPES)[number];

  // Basic validation: need at least one contact method.
  if (!body.phone && !body.email) {
    return NextResponse.json(
      { ok: false, error: "Please provide a phone number or email." },
      { status: 400 },
    );
  }

  // Light honeypot / length guards
  if ((body.message?.length ?? 0) > 3000) {
    return NextResponse.json({ ok: false, error: "Message too long" }, { status: 400 });
  }

  try {
    const db = getDb();
    await db.insert(enquiries).values({
      type,
      name: body.name?.slice(0, 160),
      phone: body.phone?.slice(0, 40),
      email: body.email?.slice(0, 200),
      itemType: body.itemType?.slice(0, 40),
      itemId: body.itemId?.slice(0, 80),
      itemName: body.itemName?.slice(0, 200),
      message: body.message?.slice(0, 3000),
      source: body.source?.slice(0, 60) ?? "website",
      status: "new",
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Failed" },
      { status: 500 },
    );
  }
}
