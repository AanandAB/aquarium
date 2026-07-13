"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

/**
 * Minimal cookie consent banner for DPDP Act 2023 compliance.
 * Shown at the bottom of the page until the user accepts.
 * No tracking cookies are set — this is purely for transparency.
 */
export default function CookieBanner() {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("cookie-consent")) return;
    setHidden(false);
  }, []);

  if (hidden) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-paper px-4 py-4 shadow-lg sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="pr-8 text-sm text-ink/75">
          We use essential cookies to make this site work, and analytics cookies to understand how it&apos;s used. No personal data is sold or shared.{' '}
          <a href="/privacy" className="font-semibold text-clay underline">Privacy Policy</a>
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => { localStorage.setItem("cookie-consent", "1"); setHidden(true); }}
            className="rounded-full bg-clay px-5 py-2 text-sm font-semibold text-paper hover:bg-clay-2"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => setHidden(true)}
            aria-label="Close banner"
            className="rounded-full p-2 text-ink/50 hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
