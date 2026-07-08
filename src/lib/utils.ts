import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a price in Indian Rupees. */
export function formatPrice(value?: number | null, currency = "INR"): string {
  if (value == null) return "—";
  const symbol = currency === "INR" ? "₹" : "";
  return `${symbol}${new Intl.NumberFormat("en-IN").format(value)}`;
}

/** Percentage discount between a price and its offer price. */
export function discountPct(price?: number | null, offer?: number | null) {
  if (!price || !offer || offer >= price) return 0;
  return Math.round(((price - offer) / price) * 100);
}

/** Build a WhatsApp click-to-chat link with a prefilled message. */
export function whatsappHref(number: string, message?: string): string {
  const digits = (number || "").replace(/[^\d]/g, "");
  const q = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${q}`;
}

/** Telephone dial link. */
export function callHref(number: string): string {
  return `tel:${(number || "").replace(/\s+/g, "")}`;
}

/** Title-case a slug. */
export function titleize(slug: string): string {
  return slug
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Safe JSON parse for D1 text columns that hold JSON. */
export function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value !== "string") return value as T;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const AGGRESSION_LABELS: Record<string, string> = {
  peaceful: "Peaceful",
  semi_aggressive: "Semi-aggressive",
  aggressive: "Aggressive",
};

export const AVAILABILITY_LABELS: Record<string, string> = {
  available: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
  reserved: "Reserved",
};
