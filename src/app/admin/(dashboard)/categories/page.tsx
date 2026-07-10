import Link from "next/link";
import { Plus, Pencil, ArrowLeft } from "lucide-react";
import {
  requireAdmin,
  listCategoriesAdmin,
  getCategoryByIdAdmin,
} from "@/lib/admin";
import { saveCategory, deleteCategory } from "@/app/admin/actions";
import { CATEGORY_KINDS } from "@/db/schema";
import ImageField from "@/components/admin/ImageField";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide text-ink/55">
        {label}
      </span>
      {children}
    </label>
  );
}

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin("staff");
  const { edit } = await searchParams;
  const categories = await listCategoriesAdmin();
  const c = edit && edit !== "new" ? await getCategoryByIdAdmin(edit) : null;
  const isEditing = !!c;
  const showForm = !!edit;

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-clay"
      >
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            Categories
          </h1>
          <p className="mt-1 text-sm text-ink/55">
            {categories.length} categories across fish, products &amp; blog.
          </p>
        </div>
        {!showForm && (
          <Link
            href="/admin/categories?edit=new"
            className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper hover:bg-clay-2"
          >
            <Plus className="h-4 w-4" /> New Category
          </Link>
        )}
      </div>

      {/* Categories table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10 bg-[#fffdf8]">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 bg-ink/[0.03] text-left text-xs uppercase tracking-wide text-ink/55">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Kind</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-t border-ink/[0.07] hover:bg-ink/[0.02]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">
                      {cat.icon || "🐟"}
                    </span>
                    <span className="font-medium text-ink">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink/55">
                  {cat.slug}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-teal/10 px-2.5 py-0.5 text-xs font-medium capitalize text-teal">
                    {cat.kind}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink/70">{cat.itemCount}</td>
                <td className="px-4 py-3">
                  {cat.published ? (
                    <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      Published
                    </span>
                  ) : (
                    <span className="rounded-full bg-ink/[0.06] px-2.5 py-0.5 text-xs font-medium text-ink/50">
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/categories?edit=${cat.id}`}
                      className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/[0.1]"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </Link>
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
                      <button
                        type="submit"
                        className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-500/25"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-sm text-ink/45"
                >
                  No categories yet. Create one below.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / edit form */}
      {showForm && (
        <section className="mt-8 rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-clay">
            {isEditing ? `Edit: ${c?.name}` : "New Category"}
          </h2>
          <form action={saveCategory}>
            {isEditing && <input type="hidden" name="id" value={c!.id} />}
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Name">
                <input
                  name="name"
                  required
                  defaultValue={c?.name ?? ""}
                  className={inputCls}
                />
              </F>
              <F label="Slug">
                <input
                  name="slug"
                  defaultValue={c?.slug ?? ""}
                  placeholder="auto-generated from name"
                  className={inputCls}
                />
              </F>
              <F label="Icon (emoji/text)">
                <input
                  name="icon"
                  defaultValue={c?.icon ?? ""}
                  placeholder="🐟"
                  className={inputCls}
                />
              </F>
              <F label="Kind">
                <select
                  name="kind"
                  defaultValue={c?.kind ?? "fish"}
                  className={inputCls}
                >
                  {CATEGORY_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </F>
              <F label="Sort order">
                <input
                  name="sortOrder"
                  type="number"
                  defaultValue={c?.sortOrder ?? 0}
                  className={inputCls}
                />
              </F>
              <div className="sm:col-span-2">
                <ImageField
                  name="image"
                  label="Image"
                  defaultValue={c?.image ?? ""}
                />
              </div>
              <div className="sm:col-span-2">
                <F label="Description">
                  <textarea
                    name="description"
                    rows={3}
                    defaultValue={c?.description ?? ""}
                    className={inputCls}
                  />
                </F>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                id="cat-published"
                defaultChecked={isEditing ? c!.published : true}
                className="h-4 w-4 accent-clay"
              />
              <label htmlFor="cat-published" className="text-sm text-ink">
                Published
              </label>
            </div>
            <div className="mt-5 flex justify-end gap-3 border-t border-ink/10 pt-4">
              <Link
                href="/admin/categories"
                className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="rounded-full bg-clay px-8 py-3 text-sm font-semibold text-paper hover:bg-clay-2"
              >
                {isEditing ? "Save changes" : "Create category"}
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
