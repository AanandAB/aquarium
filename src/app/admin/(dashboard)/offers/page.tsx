import Link from "next/link";
import { Plus, Pencil, ArrowLeft } from "lucide-react";
import { requireAdmin, listOffersAdmin, getOfferById } from "@/lib/admin";
import { saveOffer, deleteOffer } from "@/app/admin/actions";
import { OFFER_PLACEMENTS } from "@/db/schema";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30";

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/55">{label}</span>
      {children}
    </label>
  );
}

export default async function OffersPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  await requireAdmin("staff");
  const { edit } = await searchParams;
  const offers = await listOffersAdmin();
  const offer = edit ? await getOfferById(edit) : null;
  const isEditing = !!offer;

  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-clay">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Offers</h1>
          <p className="mt-1 text-sm text-ink/55">{offers.length} offers. Scheduled start/end supported.</p>
        </div>
        {!isEditing && (
          <Link href="/admin/offers?edit=new" className="inline-flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-paper hover:bg-clay-2">
            <Plus className="h-4 w-4" /> New Offer
          </Link>
        )}
      </div>

      {/* Offers list */}
      <div className="mt-6 space-y-2">
        {offers.map((o) => (
          <div key={o.id} className="flex items-center justify-between rounded-2xl border border-ink/10 bg-[#fffdf8] px-4 py-3">
            <div className="min-w-0">
              <p className="font-medium text-ink">{o.title}</p>
              <p className="text-xs text-ink/45">
                {o.badge ? `${o.badge} · ` : ""}{o.placement} · {o.active ? "Active" : "Inactive"}
                {o.startAt ? ` · From ${new Date(o.startAt).toLocaleDateString("en-IN")}` : ""}
                {o.endAt ? ` → ${new Date(o.endAt).toLocaleDateString("en-IN")}` : ""}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Link href={`/admin/offers?edit=${o.id}`} className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/[0.1]">
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Link>
              <form action={deleteOffer}>
                <input type="hidden" name="id" value={o.id} />
                <button type="submit" className="rounded-lg bg-rose-500/15 px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-500/25">Delete</button>
              </form>
            </div>
          </div>
        ))}
        {offers.length === 0 && (
          <p className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-8 text-center text-sm text-ink/45">No offers yet. Create one below.</p>
        )}
      </div>

      {/* Create/edit form */}
      <form action={saveOffer} className="mt-8 rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          {isEditing ? `Edit: ${offer?.title}` : "New offer"}
        </h2>
        {isEditing && <input type="hidden" name="id" value={offer!.id} />}
        <div className="grid gap-4 sm:grid-cols-2">
          <F label="Title"><input name="title" required defaultValue={offer?.title ?? ""} className={inputCls} /></F>
          <F label="Subtitle"><input name="subtitle" defaultValue={offer?.subtitle ?? ""} className={inputCls} /></F>
          <F label="Badge (e.g. COMBO, FLASH)"><input name="badge" defaultValue={offer?.badge ?? ""} className={inputCls} /></F>
          <F label="Discount text (e.g. 20% OFF)"><input name="discountText" defaultValue={offer?.discountText ?? ""} className={inputCls} /></F>
          <F label="CTA text"><input name="ctaText" defaultValue={offer?.ctaText ?? ""} className={inputCls} /></F>
          <F label="CTA link"><input name="ctaLink" defaultValue={offer?.ctaLink ?? ""} className={inputCls} /></F>
          <F label="Image URL"><input name="image" defaultValue={offer?.image ?? ""} className={inputCls} /></F>
          <F label="Description"><textarea name="description" rows={2} defaultValue={offer?.description ?? ""} className={inputCls} /></F>
          <F label="Placement">
            <select name="placement" defaultValue={offer?.placement ?? "homepage_banner"} className={inputCls}>
              {OFFER_PLACEMENTS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </F>
          <F label="Sort order"><input name="sortOrder" type="number" defaultValue={offer?.sortOrder ?? 0} className={inputCls} /></F>
          <F label="Start date/time"><input name="startAt" type="datetime-local" defaultValue={offer?.startAt ? new Date(offer.startAt).toISOString().slice(0, 16) : ""} className={inputCls} /></F>
          <F label="End date/time"><input name="endAt" type="datetime-local" defaultValue={offer?.endAt ? new Date(offer.endAt).toISOString().slice(0, 16) : ""} className={inputCls} /></F>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input type="checkbox" name="active" id="act" defaultChecked={isEditing ? offer!.active : true} className="h-4 w-4 accent-clay" />
          <label htmlFor="act" className="text-sm text-ink">Active</label>
        </div>
        <div className="mt-5 flex justify-end gap-3 border-t border-ink/10 pt-4">
          {isEditing && <Link href="/admin/offers" className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]">Cancel</Link>}
          <button type="submit" className="rounded-full bg-clay px-8 py-3 text-sm font-semibold text-paper hover:bg-clay-2">
            {isEditing ? "Save changes" : "Create offer"}
          </button>
        </div>
      </form>
    </div>
  );
}
