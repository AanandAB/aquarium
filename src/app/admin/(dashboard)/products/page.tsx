import Link from "next/link";
import { ArrowLeft, Plus, Pencil, Eye, EyeOff } from "lucide-react";
import {
  requireAdmin,
  listProductsAdmin,
  getProductByIdAdmin,
  getProductCategoriesAdmin,
} from "@/lib/admin";
import {
  saveProduct,
  deleteProduct,
  toggleProductPublished,
} from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30";

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink/45">{hint}</span>}
    </label>
  );
}

function money(v?: number | null) {
  return v == null ? "—" : `₹${v.toLocaleString("en-IN")}`;
}

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin("staff");
  const { edit } = await searchParams;
  const [products, categories, editing] = await Promise.all([
    listProductsAdmin(),
    getProductCategoriesAdmin(),
    edit ? getProductByIdAdmin(edit) : Promise.resolve(null),
  ]);
  const p = editing;
  const isEdit = !!p;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-clay"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>

      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink">Products</h1>
          <p className="mt-1 text-sm text-ink/55">
            {products.length} product{products.length === 1 ? "" : "s"}, live from the database.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper hover:bg-clay-2"
        >
          <Plus className="h-4 w-4" /> New product
        </Link>
      </div>

      {/* ----------------------------- list ----------------------------- */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-[#fffdf8]">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 bg-ink/[0.03] text-left text-xs uppercase tracking-wide text-ink/55">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ink/45">
                  No products yet. Use the form below to add your first one.
                </td>
              </tr>
            )}
            {products.map((row) => (
              <tr
                key={row.id}
                className="border-t border-ink/8 hover:bg-clay/[0.04]"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{row.name}</p>
                  <p className="text-xs text-ink/45">{row.slug}</p>
                </td>
                <td className="px-4 py-3 text-ink/70">{row.categoryName ?? "—"}</td>
                <td className="px-4 py-3">
                  {row.offerPrice != null ? (
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-ink">{money(row.offerPrice)}</span>
                      <span className="text-xs text-ink/40 line-through">{money(row.price)}</span>
                    </span>
                  ) : (
                    <span className="font-medium text-ink">{money(row.price)}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-ink/70">
                  <span className={row.stock <= 5 ? "text-amber-600" : ""}>{row.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <form action={toggleProductPublished}>
                    <input type="hidden" name="id" value={row.id} />
                    <button
                      type="submit"
                      title={row.published ? "Published — click to hide" : "Hidden — click to publish"}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        row.published
                          ? "bg-emerald-500/15 text-emerald-700"
                          : "bg-ink/8 text-ink/50"
                      }`}
                    >
                      {row.published ? (
                        <><Eye className="h-3.5 w-3.5" /> Live</>
                      ) : (
                        <><EyeOff className="h-3.5 w-3.5" /> Hidden</>
                      )}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/products?edit=${row.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/12"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={row.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-rose-500/12 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-500/20"
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

      {/* -------------------------- create/edit form -------------------------- */}
      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">
            {isEdit ? `Edit: ${p?.name}` : "Add new product"}
          </h2>
          {isEdit && (
            <Link href="/admin/products" className="text-xs text-clay hover:text-clay-2">
              + Start a new product instead
            </Link>
          )}
        </div>

        <form action={saveProduct} className="mt-4 space-y-6">
          {isEdit && <input type="hidden" name="id" value={p!.id} />}

          {/* BASICS */}
          <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-clay">Basics</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name">
                <input name="name" required defaultValue={p?.name ?? ""} className={inputCls} />
              </Field>
              <Field label="Slug" hint="Leave blank to auto-generate">
                <input name="slug" defaultValue={p?.slug ?? ""} className={inputCls} />
              </Field>
              <Field label="Category">
                <select name="categoryId" defaultValue={p?.categoryId ?? ""} className={inputCls}>
                  <option value="">— None —</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Sort order" hint="Lower shows first">
                <input name="sortOrder" type="number" defaultValue={p?.sortOrder ?? 0} className={inputCls} />
              </Field>
              <Field label="Price (₹)">
                <input name="price" type="number" step="0.01" defaultValue={p?.price ?? ""} className={inputCls} />
              </Field>
              <Field label="Offer price (₹)" hint="Optional — shown as the sale price">
                <input name="offerPrice" type="number" step="0.01" defaultValue={p?.offerPrice ?? ""} className={inputCls} />
              </Field>
              <Field label="Stock">
                <input name="stock" type="number" defaultValue={p?.stock ?? 0} className={inputCls} />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Description">
                <textarea name="description" rows={4} defaultValue={p?.description ?? ""} className={inputCls} />
              </Field>
            </div>
          </section>

          {/* MEDIA */}
          <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-clay">Media</h2>
            <div className="grid gap-4">
              <ImageField
                name="image"
                label="Product image"
                defaultValue={p?.heroImage ?? ""}
                hint="Paste a URL, or upload from device"
              />
              <Field label="Gallery URLs" hint="One per line">
                <textarea name="gallery" rows={3} defaultValue={(p?.gallery ?? []).join("\n")} className={inputCls} />
              </Field>
            </div>
          </section>

          {/* FLAGS */}
          <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-clay">Flags</h2>
            <div className="flex flex-wrap gap-5">
              {([
                ["featured", "Featured", p?.featured],
                ["trending", "Trending", p?.trending],
                ["published", "Published", p ? p.published : true],
              ] as const).map(([name, label, checked]) => (
                <label key={name} className="flex items-center gap-2 text-sm text-ink/80">
                  <input
                    type="checkbox"
                    name={name}
                    defaultChecked={!!checked}
                    className="h-4 w-4 accent-clay"
                  />
                  {label}
                </label>
              ))}
            </div>
          </section>

          {/* META */}
          <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-clay">Meta</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Meta title">
                <input name="metaTitle" defaultValue={p?.metaTitle ?? ""} className={inputCls} />
              </Field>
              <Field label="Meta description">
                <input name="metaDescription" defaultValue={p?.metaDescription ?? ""} className={inputCls} />
              </Field>
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link
              href="/admin/products"
              className="rounded-full border border-ink/15 px-6 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-full bg-clay px-8 py-3 text-sm font-semibold text-paper hover:bg-clay-2"
            >
              {isEdit ? "Save changes" : "Create product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
