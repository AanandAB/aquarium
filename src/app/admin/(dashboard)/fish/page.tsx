import Link from "next/link";
import { Plus, Pencil, Star, Eye, EyeOff } from "lucide-react";
import { requireAdmin, listFishAdmin } from "@/lib/admin";
import { deleteFish } from "@/app/admin/actions";
import { formatPrice, AVAILABILITY_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminFishList() {
  await requireAdmin("viewer");
  const fish = await listFishAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-softwhite">Fish</h1>
          <p className="mt-1 text-sm text-slate-400">
            {fish.length} species. Manage species, pricing, stock and visibility.
          </p>
        </div>
        <Link
          href="/admin/fish/new"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-aqua to-turquoise px-5 py-2.5 text-sm font-semibold text-navy"
        >
          <Plus className="h-4 w-4" /> New Fish
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl glass">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {fish.map((f) => (
              <tr key={f.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3">
                  <p className="font-medium text-softwhite">{f.name}</p>
                  <p className="text-xs italic text-slate-500">{f.scientificName}</p>
                </td>
                <td className="px-4 py-3 text-slate-300">{f.categoryName ?? "—"}</td>
                <td className="px-4 py-3 font-num text-slate-200">
                  {formatPrice(f.offerPrice ?? f.price, f.currency)}
                </td>
                <td className="px-4 py-3">
                  <span className={f.stock <= 10 ? "text-amber-300" : "text-slate-300"}>
                    {f.stock}
                  </span>
                  <span className="ml-1 text-xs text-slate-500">
                    {AVAILABILITY_LABELS[f.availability ?? "available"]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5 text-slate-500">
                    {f.featured && <Star className="h-4 w-4 text-amber-400" />}
                    {f.published ? (
                      <Eye className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-slate-600" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/fish/${f.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/8 px-3 py-1.5 text-xs text-softwhite hover:bg-white/15"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <form action={deleteFish}>
                      <input type="hidden" name="id" value={f.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs text-rose-300 hover:bg-rose-500/25"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
