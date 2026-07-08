import { cookies } from "next/headers";

export const SESSION_COOKIE = "ha_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type Session = {
  userId: string;
  email: string;
  name: string | null;
  role: "admin" | "manager" | "staff" | "viewer";
  exp: number;
};

function secret(): string {
  return (
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "dev-insecure-secret-change-me-in-production"
  );
}

function b64urlEncode(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function b64urlDecode(str: string): Uint8Array {
  const pad = str.length % 4 ? 4 - (str.length % 4) : 0;
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad);
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data),
  );
  return new Uint8Array(sig);
}

export async function signSession(
  payload: Omit<Session, "exp"> & { exp?: number },
): Promise<string> {
  const body: Session = {
    ...payload,
    exp: payload.exp ?? Math.floor(Date.now() / 1000) + MAX_AGE,
  };
  const json = JSON.stringify(body);
  const data = b64urlEncode(new TextEncoder().encode(json));
  const sig = b64urlEncode(await hmac(data));
  return `${data}.${sig}`;
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const [data, sig] = token.split(".");
    if (!data || !sig) return null;
    const expected = b64urlEncode(await hmac(data));
    // constant-time-ish compare
    if (expected.length !== sig.length) return null;
    let diff = 0;
    for (let i = 0; i < sig.length; i++)
      diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
    if (diff !== 0) return null;
    const session = JSON.parse(
      new TextDecoder().decode(b64urlDecode(data)),
    ) as Session;
    if (session.exp * 1000 < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export function roleAtLeast(
  role: Session["role"],
  min: Session["role"],
): boolean {
  const order = ["viewer", "staff", "manager", "admin"];
  return order.indexOf(role) >= order.indexOf(min);
}

export const SESSION_MAX_AGE = MAX_AGE;
