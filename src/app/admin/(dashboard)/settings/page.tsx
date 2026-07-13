import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { requireAdmin, getSiteSettingsRow } from "@/lib/admin";
import { updateSiteSettings } from "@/app/admin/actions";

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

export default async function SiteSettingsPage() {
  await requireAdmin("admin");
  const s = await getSiteSettingsRow();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-clay">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Site Settings</h1>
      <p className="mt-1 text-sm text-ink/55">Store information, contact details, social links and SEO defaults.</p>

      <form action={updateSiteSettings} className="mt-6 space-y-6">
        <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">Store info</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Store name"><input name="storeName" required defaultValue={s?.storeName ?? ""} className={inputCls} /></F>
            <F label="Tagline"><input name="tagline" defaultValue={s?.tagline ?? ""} className={inputCls} /></F>
            <F label="Phone"><input name="phone" defaultValue={s?.phone ?? ""} className={inputCls} /></F>
            <F label="WhatsApp (with country code)"><input name="whatsapp" defaultValue={s?.whatsapp ?? ""} className={inputCls} /></F>
            <F label="Email"><input name="email" type="email" defaultValue={s?.email ?? ""} className={inputCls} /></F>
            <F label="Description"><textarea name="description" rows={3} defaultValue={s?.description ?? ""} className={inputCls} /></F>
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Address line"><input name="addressLine" defaultValue={s?.addressLine ?? ""} className={inputCls} /></F>
            <F label="Area"><input name="area" defaultValue={s?.area ?? ""} className={inputCls} /></F>
            <F label="City"><input name="city" defaultValue={s?.city ?? ""} className={inputCls} /></F>
            <F label="State"><input name="state" defaultValue={s?.state ?? ""} className={inputCls} /></F>
            <F label="Pincode"><input name="pincode" defaultValue={s?.pincode ?? ""} className={inputCls} /></F>
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">Map & directions</h2>
          <div className="grid gap-4">
            <F label="Google Maps embed URL"><input name="mapEmbedUrl" defaultValue={s?.mapEmbedUrl ?? ""} className={inputCls} /></F>
            <F label="Directions URL"><input name="directionsUrl" defaultValue={s?.directionsUrl ?? ""} className={inputCls} /></F>
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Map latitude"><input name="mapLat" type="number" step="0.0001" defaultValue={s?.mapLat ?? ""} className={inputCls} /></F>
              <F label="Map longitude"><input name="mapLng" type="number" step="0.0001" defaultValue={s?.mapLng ?? ""} className={inputCls} /></F>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">Socials</h2>
          <F label="Social links (JSON)"><textarea name="socials" rows={4} defaultValue={s?.socials ? JSON.stringify(s.socials, null, 2) : ""} className={inputCls} /></F>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">Analytics & SEO defaults</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Google Analytics ID"><input name="gaId" defaultValue={s?.gaId ?? ""} className={inputCls} /></F>
            <F label="Meta Pixel ID"><input name="metaPixel" defaultValue={s?.metaPixel ?? ""} className={inputCls} /></F>
            <F label="Meta title"><input name="metaTitle" defaultValue={s?.metaTitle ?? ""} className={inputCls} /></F>
            <F label="Meta description"><textarea name="metaDescription" rows={2} defaultValue={s?.metaDescription ?? ""} className={inputCls} /></F>
            <F label="Keywords"><input name="keywords" defaultValue={s?.keywords ?? ""} className={inputCls} /></F>
          </div>
        </section>

        <section className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-5">
          <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">Instagram feed</h2>
          <F label="LightWidget token"><input name="instagramWidgetToken" defaultValue={s?.instagramWidgetToken ?? ""} className={inputCls} placeholder="Get a free token at lightwidget.com" /></F>
          <p className="mt-2 text-[11px] text-ink/45">Sign up at lightwidget.com (free), connect your Instagram, paste the token here. Posts appear automatically, no rebuild needed.</p>
        </section>

        <div className="flex justify-end gap-3 border-t border-ink/10 pt-5">
          <Link href="/admin" className="rounded-full border border-ink/20 px-6 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]">Cancel</Link>
          <button type="submit" className="rounded-full bg-clay px-8 py-3 text-sm font-semibold text-paper hover:bg-clay-2">Save settings</button>
        </div>
      </form>
    </div>
  );
}
