import Link from "next/link";
import { Fish, Package, Inbox, FileText, Star, AlertTriangle, ArrowRight } from "lucide-react";
import { getDashboardStats } from "@/lib/admin";
import { AVAILABILITY_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

function StatCard({
  label, value, icon, href, tone,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl glass p-5 transition-all hover:-translate-y-0.5 hover:ocean-ring"
    >
      <div className="flex items-center justify-between">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
          {icon}
        </span>
        <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1" />
      </div>
      <p className="mt-4 font-num text-3xl font-bold text-softwhite">{value}</p>
      <p className="text-sm text-slate-400">{label}</p>
    </Link>
  );
}

export default async function AdminDashboard() {
  const { counts, lowStock, recent } = await getDashboardStats();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-softwhite">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-400">
        Overview of your store. Everything here is live from the database.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Fish species" value={counts.fish} href="/admin/fish" icon={<Fish className="h-5 w-5 text-aqua" />} tone="bg-aqua/15" />
        <StatCard label="Accessories" value={counts.products} href="/admin/products" icon={<Package className="h-5 w-5 text-turquoise" />} tone="bg-turquoise/15" />
        <StatCard label="New enquiries" value={counts.newEnquiries} href="/admin/enquiries" icon={<Inbox className="h-5 w-5 text-coral-soft" />} tone="bg-coral/15" />
        <StatCard label="Blog posts" value={counts.posts} href="/admin/blog" icon={<FileText className="h-5 w-5 text-amber-300" />} tone="bg-amber-400/15" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Recent enquiries */}
        <div className="rounded-2xl glass p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-softwhite">Latest enquiries</h2>
            <Link href="/admin/enquiries" className="text-xs text-aqua hover:text-turquoise">
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-sm text-slate-500">No enquiries yet.</p>
          ) : (
            <ul className="space-y-2">
              {recent.map((e) => (
                <li key={e.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate text-softwhite">
                      {e.name ?? e.email ?? e.phone ?? "Anonymous"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {e.type} · {e.itemName ?? e.message?.slice(0, 40) ?? "—"}
                    </p>
                  </div>
                  <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase ${
                    e.status === "new" ? "bg-coral/20 text-coral-soft" : "bg-white/10 text-slate-300"
                  }`}>
                    {e.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Low stock */}
        <div className="rounded-2xl glass p-5">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h2 className="font-semibold text-softwhite">Low / out of stock</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-slate-500">All fish are well stocked. 🎉</p>
          ) : (
            <ul className="space-y-2">
              {lowStock.map((f) => (
                <li key={f.id}>
                  <Link
                    href={`/admin/fish/${f.id}`}
                    className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 text-sm hover:bg-white/10"
                  >
                    <span className="truncate text-softwhite">{f.name}</span>
                    <span className="ml-3 shrink-0 text-xs text-amber-300">
                      {f.stock} left · {AVAILABILITY_LABELS[f.availability ?? "available"]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
