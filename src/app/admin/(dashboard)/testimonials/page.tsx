import Link from "next/link";
import { Plus, Pencil, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { requireAdmin, listTestimonialsAdmin, getTestimonialByIdAdmin } from "@/lib/admin";
import { saveTestimonial, deleteTestimonial, toggleTestimonialPublished } from "@/app/admin/actions";
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

function stars(n: number) {
  return "★".repeat(Math.max(0, Math.min(5, n))) + "☆".repeat(Math.max(0, 5 - n));
}

export default async function TestimonialsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin("staff");
  const { edit } = await searchParams;
  const items = await listTestimonialsAdmin();
  const item = edit && edit !== "new" ? await getTestimonialByIdAdmin(edit) : null;
  const isEditing = !!item;
  const showForm = !!edit;

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-clay">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Testimonials</h1>
          <p className="mt-1 text-sm text-ink/55">{items.length} reviews</p>
        </div>
        {!showForm && (
          <Link href="/admin/testimonials?edit=new" className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper hover:bg-clay-2">
            <Plus className="h-4 w-4" /> New Testimonial
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-[#fffdf8] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              {t.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.avatar} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal/15 text-sm font-semibold text-teal">
                  {(t.customerName ?? "?").charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{t.customerName}</p>
                <p className="text-xs text-ink/45">
                  <span className="text-clay">{stars(t.rating ?? 5)}</span>
                  {t.location ? ` · ${t.location}` : ""}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <form action={toggleTestimonialPublished}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" title={t.published ? "Published — click to hide" : "Hidden — click to publish"} className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs ${t.published ? "bg-emerald-500/15 text-emerald-700" : "bg-ink/[0.06] text-ink/50"}`}>
                  {t.published ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  {t.published ? "Visible" : "Hidden"}
                </button>
              </form>
              <Link href={`/admin/testimonials?edit=${t.id}`} className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/[0.1]">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <form action={deleteTestimonial}>
                <input type="hidden" name="id" value={t.id} />
                <button type="submit" className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-500/25">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-8 text-center text-sm text-ink/45">No testimonials yet.</p>
        )}
      </div>

      {showForm && (
        <form action={saveTestimonial} className="mt-8 rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">
            {isEditing ? `Edit: ${item?.customerName}` : "New testimonial"}
          </h2>
          {isEditing && <input type="hidden" name="id" value={item!.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Name"><input name="name" required defaultValue={item?.customerName ?? ""} className={inputCls} /></F>
            <F label="Location"><input name="role" defaultValue={item?.location ?? ""} className={inputCls} placeholder="e.g. Kannur" /></F>
            <div className="sm:col-span-2">
              <F label="Review"><textarea name="content" rows={4} defaultValue={item?.review ?? ""} className={inputCls} /></F>
            </div>
            <F label="Rating (1–5)"><input name="rating" type="number" min={1} max={5} defaultValue={item?.rating ?? 5} className={inputCls} /></F>
            <F label="Sort order"><input name="sortOrder" type="number" defaultValue={item?.sortOrder ?? items.length + 1} className={inputCls} /></F>
            <div className="sm:col-span-2">
              <ImageField name="avatar" label="Avatar / photo" defaultValue={item?.avatar ?? ""} hint="Paste a URL, or upload a photo from your device" />
            </div>
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
            <Link href="/admin/testimonials" className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]">Cancel</Link>
            <button type="submit" className="rounded-full bg-clay px-8 py-3 text-sm font-semibold text-paper hover:bg-clay-2">
              {isEditing ? "Save changes" : "Add testimonial"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
