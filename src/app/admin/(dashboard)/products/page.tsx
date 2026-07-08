import { requireAdmin, listProductsAdmin } from "@/lib/admin";
import { formatPrice, AVAILABILITY_LABELS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  await requireAdmin("viewer");
  const products = await listProductsAdmin();
  return (
    <div>
      <h1 className="text-2xl font-semibold text-softwhite">Accessories</h1>
      <p className="mt-1 text-sm text-slate-400">
        {products.length} products, live from the database.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl glass">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Brand</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-white/5 hover:bg-white/[0.03]">
                <td className="px-4 py-3 font-medium text-softwhite">{p.name}</td>
                <td className="px-4 py-3 text-slate-300">{p.categoryName ?? "—"}</td>
                <td className="px-4 py-3 text-slate-400">{p.brand ?? "—"}</td>
                <td className="px-4 py-3 font-num text-slate-200">
                  {formatPrice(p.offerPrice ?? p.price, p.currency)}
                </td>
                <td className="px-4 py-3 text-slate-300">
                  {p.stock} · {AVAILABILITY_LABELS[p.availability ?? "available"]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
