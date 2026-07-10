"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Fish, Package, Inbox, Images, Star,
  FileText, LogOut, ExternalLink,
} from "lucide-react";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/settings", label: "Settings", icon: LayoutDashboard },
  { href: "/admin/homepage", label: "Homepage", icon: LayoutDashboard },
  { href: "/admin/offers", label: "Offers", icon: LayoutDashboard },
  { href: "/admin/fish", label: "Fish", icon: Fish },
  { href: "/admin/products", label: "Accessories", icon: Package },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/categories", label: "Categories", icon: LayoutDashboard },
  { href: "/admin/faqs", label: "FAQs", icon: LayoutDashboard },
];

export default function AdminSidebar({
  name,
  role,
}: {
  name: string;
  role: string;
}) {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-white/10 bg-[#04121c] p-4">
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

      <nav className="flex-1 space-y-1">
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
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-aqua/15 text-aqua"
                  : "text-slate-400 hover:bg-white/5 hover:text-softwhite",
              )}
            >
              <Icon className="h-4 w-4" />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-softwhite"
        >
          <ExternalLink className="h-4 w-4" /> View site
        </Link>
        <div className="px-3 py-2">
          <p className="truncate text-xs font-medium text-softwhite">{name}</p>
          <p className="text-[10px] uppercase tracking-wide text-slate-500">
            {role}
          </p>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-rose-300 hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
