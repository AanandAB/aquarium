"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { cn, callHref } from "@/lib/utils";

export type NavLink = { label: string; url: string };

export default function Header({
  nav,
  storeName,
  phone,
}: {
  nav: NavLink[];
  storeName: string;
  phone: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-ink/10 bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Wordmark */}
          <Link href="/" className="group flex items-baseline gap-2">
            <span className="font-display text-xl font-semibold tracking-tight text-ink">
              {storeName}
            </span>
            <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-clay sm:inline">
              · Est. Kerala
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {nav.map((item) => {
              const active =
                item.url === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.url);
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={cn(
                    "relative text-sm transition-colors",
                    active ? "text-ink" : "text-ink/60 hover:text-ink",
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 h-px w-full bg-clay" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={callHref(phone)}
              className="hidden items-center gap-2 rounded-full bg-clay px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-clay-2 sm:inline-flex"
            >
              <Phone className="h-4 w-4" />
              {phone}
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-400 lg:hidden",
            open ? "mb-3 max-h-[70vh]" : "max-h-0",
          )}
        >
          <nav
            aria-label="Mobile"
            className="flex flex-col gap-1 rounded-2xl border border-ink/10 bg-[#fffdf8] p-3"
          >
            {nav.map((item) => (
              <Link
                key={item.url}
                href={item.url}
                className="rounded-xl px-4 py-3 text-sm text-ink/80 hover:bg-ink/[0.05]"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={callHref(phone)}
              className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-clay px-4 py-3 text-sm font-medium text-paper"
            >
              <Phone className="h-4 w-4" /> Call {phone}
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
