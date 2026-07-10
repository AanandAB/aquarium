import Link from "next/link";
import { Plus, Pencil, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { requireAdmin, listGalleryAdmin, getGalleryItemByIdAdmin } from "@/lib/admin";
import { saveGalleryItem, deleteGalleryItem, toggleGalleryPublished } from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/55">{label}</span>
      {children}
    </label>
  );
}

export default async function GalleryAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin("staff");
  const { edit } = await searchParams;
  const items = await listGalleryAdmin();
  const item = edit && edit !== "new" ? await getGalleryItemByIdAdmin(edit) : null;
  const isEditing = !!item;
  const showForm = !!edit;

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-clay">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Gallery</h1>
          <p className="mt-1 text-sm text-ink/55">{items.length} images</p>
        </div>
        {!showForm && (
          <Link href="/admin/gallery?edit=new" className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper hover:bg-clay-2">
            <Plus className="h-4 w-4" /> New Image
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-2">
        {items.map((g) => (
          <div key={g.id} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-[#fffdf8] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              {g.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={g.url} alt="" className="h-12 w-12 shrink-0 rounded-lg object-cover" />
              ) : (
                <div className="h-12 w-12 shrink-0 rounded-lg bg-paper-2" />
              )}
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{g.title ?? "Untitled"}</p>
                <p className="text-xs text-ink/45">{g.kind ?? "showcase"} · Order {g.sortOrder}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <form action={toggleGalleryPublished}>
                <input type="hidden" name="id" value={g.id} />
                <button type="submit" title={g.published ? "Published — click to hide" : "Hidden — click to publish"} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs ${g.published ? "bg-emerald-500/15 text-emerald-700" : "bg-ink/[0.06] text-ink/50"}`}>
                  {g.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {g.published ? "Visible" : "Hidden"}
                </button>
              </form>
              <Link href={`/admin/gallery?edit=${g.id}`} className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/[0.1]">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <form action={deleteGalleryItem}>
                <input type="hidden" name="id" value={g.id} />
                <button type="submit" className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-500/25">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-8 text-center text-sm text-ink/45">No gallery images yet.</p>
        )}
      </div>

      {showForm && (
        <form action={saveGalleryItem} className="mt-8 rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">
            {isEditing ? `Edit: ${item?.title ?? "image"}` : "New image"}
          </h2>
          {isEditing && <input type="hidden" name="id" value={item!.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Title"><input name="title" defaultValue={item?.title ?? ""} className={inputCls} /></F>
            <F label="Kind"><input name="category" defaultValue={item?.kind ?? "showcase"} className={inputCls} placeholder="showcase, tank, store…" /></F>
            <div className="sm:col-span-2">
              <F label="Caption"><textarea name="description" rows={2} defaultValue={item?.caption ?? ""} className={inputCls} /></F>
            </div>
            <div className="sm:col-span-2">
              <ImageField name="image" label="Image" defaultValue={item?.url ?? ""} hint="Paste a URL, or upload a photo from your device" />
            </div>
            <F label="Sort order"><input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? items.length + 1} className={inputCls} /></F>
          </div>
          <div className="mt-4 flex items-center gap-5">
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" name="featured" defaultChecked={isEditing ? item!.featured : false} className="h-4 w-4 accent-clay" /> Featured
            </label>
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" name="published" defaultChecked={isEditing ? item!.published : true} className="h-4 w-4 accent-clay" /> Published
            </label>
          </div>
          <div className="mt-5 flex justify-end gap-3 border-t border-ink/10 pt-4">
            <Link href="/admin/gallery" className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]">Cancel</Link>
            <button type="submit" className="rounded-full bg-clay px-8 py-3 text-sm font-semibold text-paper hover:bg-clay-2">
              {isEditing ? "Save changes" : "Add image"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
