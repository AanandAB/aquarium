"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Fish, Package, Inbox, Images, Star,
  FileText, LogOut, ExternalLink, SlidersHorizontal,
  Menu, X, Home, Sparkles, HelpCircle, Settings,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/homepage", label: "Homepage", icon: Home },
  { href: "/admin/offers", label: "Offers", icon: Sparkles },
  { href: "/admin/fish", label: "Fish", icon: Fish },
  { href: "/admin/products", label: "Accessories", icon: Package },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/categories", label: "Categories", icon: LayoutDashboard },
  { href: "/admin/planner", label: "Planner", icon: SlidersHorizontal },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {LINKS.map((l) => {
        const active =
          l.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(l.href);
        const Icon = l.icon;
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-aqua/15 text-aqua"
                : "text-slate-400 hover:bg-white/5 hover:text-softwhite",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {l.label}
          </Link>
        );
      })}
    </>
  );
}

function Footer({ name, role }: { name: string; role: string }) {
  return (
    <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
      <Link
        href="/"
        target="_blank"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-softwhite"
      >
        <ExternalLink className="h-4 w-4 shrink-0" /> View site
      </Link>
      <div className="px-3 py-2">
        <p className="truncate text-xs font-medium text-softwhite">{name}</p>
        <p className="text-[10px] uppercase tracking-wide text-slate-500">{role}</p>
      </div>
      <form action={logoutAction}>
        <button
          type="submit"
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-300 hover:bg-rose-500/10"
        >
          <LogOut className="h-4 w-4 shrink-0" /> Sign out
        </button>
      </form>
    </div>
  );
}

export default function AdminSidebar({
  name,
  role,
}: {
  name: string;
  role: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on route change
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center gap-3 border-b border-white/10 bg-[#04121c] px-4 py-3 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-300"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/admin" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-aqua to-turquoise text-navy">
            <Fish className="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-softwhite">Happy Aquarium</span>
        </Link>
      </div>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#04121c] p-4 transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between px-2">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-aqua to-turquoise text-navy">
              <Fish className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-softwhite">Happy Aquarium</p>
              <p className="text-[10px] uppercase tracking-wide text-aqua">Admin</p>
            </div>
          </Link>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          <NavLinks pathname={pathname} onNavigate={() => setOpen(false)} />
        </nav>

        <Footer name={name} role={role} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-[#04121c] p-4 lg:flex">
        <div className="mb-6 px-2">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-aqua to-turquoise text-navy">
              <Fish className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-softwhite">Happy Aquarium</p>
              <p className="text-[10px] uppercase tracking-wide text-aqua">Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          <NavLinks pathname={pathname} />
        </nav>

        <Footer name={name} role={role} />
      </aside>
    </>
  );
}
