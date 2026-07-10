import { ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import {
  requireAdmin,
  listTankPricingAdmin,
  getTankPricingByIdAdmin,
  listPlannerPresetsAdmin,
  getPlannerPresetByIdAdmin,
  getFishForSelectAdmin,
} from "@/lib/admin";
import {
  saveTankPricing,
  deleteTankPricing,
  savePlannerPreset,
  deletePlannerPreset,
} from "@/app/admin/actions";
import ImageField from "@/components/admin/ImageField";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30";

function F({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink/55">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-ink/45">{hint}</span>}
    </label>
  );
}

const inr = (n: number | null | undefined) => `₹${Math.round(Number(n ?? 0)).toLocaleString("en-IN")}`;

export default async function PlannerAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tier?: string; preset?: string }>;
}) {
  await requireAdmin("staff");
  const sp = await searchParams;

  const [tiers, presets, fishList, editTier, editPreset] = await Promise.all([
    listTankPricingAdmin(),
    listPlannerPresetsAdmin(),
    getFishForSelectAdmin(),
    sp.tier ? getTankPricingByIdAdmin(sp.tier) : Promise.resolve(null),
    sp.preset ? getPlannerPresetByIdAdmin(sp.preset) : Promise.resolve(null),
  ]);

  const tierEditing = !!editTier;
  const presetEditing = !!editPreset;
  const presetFishIds = new Set(editPreset?.fishIds ?? []);

  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-ink/60 hover:text-clay">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <h1 className="mt-3 font-display text-2xl font-semibold text-ink">Aquarium Planner</h1>
      <p className="mt-1 text-sm text-ink/55">
        Set equipment pricing per tank-size tier, and curate ready-made setups. Everything here drives the public
        Planner tool instantly.
      </p>

      {/* ============================= TANK PRICING ============================= */}
      <section className="mt-8">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">Tank pricing tiers</h2>
        <p className="mt-1 text-sm text-ink/55">
          Each tier maps a tank-volume range (litres) to equipment costs. The planner picks the tier that matches the
          customer&rsquo;s L×B×H volume and adds up the estimate.
        </p>

        <div className="mt-4 space-y-2">
          {tiers.length === 0 && <p className="text-sm text-ink/45">No tiers yet — add one below.</p>}
          {tiers.map((t) => {
            const equip = t.filterCost + t.heaterCost + t.lightCost + t.substrateCost + t.decorCost;
            return (
              <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-[#fffdf8] p-4">
                <div>
                  <p className="font-medium text-ink">
                    {t.name}{" "}
                    <span className="text-xs font-normal text-ink/45">
                      · {t.litresMin}–{t.litresMax ?? "∞"} L {t.published ? "" : "· hidden"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-xs text-ink/55">
                    Base {inr(t.baseSetup)} + {inr(t.perLitre)}/L · Equipment {inr(equip)} (filter/heater/light/substrate/decor)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/planner?tier=${t.id}`} className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/[0.1]">
                    <Pencil className="h-3 w-3" /> Edit
                  </Link>
                  <form action={deleteTankPricing}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-500/20">
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>

        <form action={saveTankPricing} className="mt-5 rounded-2xl border border-ink/10 bg-paper-2/40 p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink">
            {tierEditing ? `Edit tier: ${editTier?.name}` : "Add pricing tier"}
          </h3>
          {tierEditing && <input type="hidden" name="id" value={editTier!.id} />}
          <div className="grid gap-4 sm:grid-cols-3">
            <F label="Tier name"><input name="name" required defaultValue={editTier?.name ?? ""} placeholder="e.g. Standard 2ft" className={inputCls} /></F>
            <F label="Min litres"><input name="litresMin" type="number" defaultValue={editTier?.litresMin ?? 0} className={inputCls} /></F>
            <F label="Max litres" hint="Leave blank for the largest tier"><input name="litresMax" type="number" defaultValue={editTier?.litresMax ?? ""} className={inputCls} /></F>
            <F label="Base / setup fee (₹)"><input name="baseSetup" type="number" step="0.01" defaultValue={editTier?.baseSetup ?? 0} className={inputCls} /></F>
            <F label="Per-litre rate (₹)" hint="× volume (water, conditioner, misc)"><input name="perLitre" type="number" step="0.01" defaultValue={editTier?.perLitre ?? 0} className={inputCls} /></F>
            <F label="Filter (₹)"><input name="filterCost" type="number" step="0.01" defaultValue={editTier?.filterCost ?? 0} className={inputCls} /></F>
            <F label="Heater (₹)"><input name="heaterCost" type="number" step="0.01" defaultValue={editTier?.heaterCost ?? 0} className={inputCls} /></F>
            <F label="Light (₹)"><input name="lightCost" type="number" step="0.01" defaultValue={editTier?.lightCost ?? 0} className={inputCls} /></F>
            <F label="Substrate (₹)"><input name="substrateCost" type="number" step="0.01" defaultValue={editTier?.substrateCost ?? 0} className={inputCls} /></F>
            <F label="Decor (₹)"><input name="decorCost" type="number" step="0.01" defaultValue={editTier?.decorCost ?? 0} className={inputCls} /></F>
            <F label="Sort order"><input name="sortOrder" type="number" defaultValue={editTier?.sortOrder ?? tiers.length + 1} className={inputCls} /></F>
            <F label="Note (optional)"><input name="note" defaultValue={editTier?.note ?? ""} placeholder="Shown as a hint" className={inputCls} /></F>
          </div>
          <label className="mt-4 flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={tierEditing ? editTier!.published : true} className="h-4 w-4 accent-clay" />
            <span className="text-sm text-ink">Visible on the planner</span>
          </label>
          <div className="mt-4 flex gap-3">
            {tierEditing && <Link href="/admin/planner" className="rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink/70 hover:bg-ink/[0.04]">Cancel</Link>}
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-full bg-clay px-6 py-2.5 text-sm font-semibold text-paper hover:bg-clay-2">
              <Plus className="h-4 w-4" /> {tierEditing ? "Save tier" : "Add tier"}
            </button>
          </div>
        </form>
      </section>

      {/* ============================= CURATED PRESETS ============================= */}
      <section className="mt-12">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">Curated setups</h2>
        <p className="mt-1 text-sm text-ink/55">
          Ready-made stocking plans shown when a customer&rsquo;s tank &amp; budget match. Pick exactly which fish go in each.
        </p>

        <div className="mt-4 space-y-2">
          {presets.length === 0 && <p className="text-sm text-ink/45">No curated setups yet — add one below.</p>}
          {presets.map((p) => (
            <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ink/10 bg-[#fffdf8] p-4">
              <div>
                <p className="font-medium text-ink">
                  {p.name}{" "}
                  <span className="text-xs font-normal text-ink/45">
                    · {p.tankSizeMin ?? "?"}–{p.tankSizeMax ?? "?"} L · {inr(p.budgetMin)}–{inr(p.budgetMax)} · {p.experience} · {(p.fishIds ?? []).length} fish {p.published ? "" : "· hidden"}
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/planner?preset=${p.id}`} className="inline-flex items-center gap-1 rounded-lg bg-ink/[0.06] px-3 py-1.5 text-xs text-ink hover:bg-ink/[0.1]">
                  <Pencil className="h-3 w-3" /> Edit
                </Link>
                <form action={deletePlannerPreset}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-500/20">
                    <Trash2 className="h-3 w-3" /> Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <form action={savePlannerPreset} className="mt-5 rounded-2xl border border-ink/10 bg-paper-2/40 p-5">
          <h3 className="mb-4 text-sm font-semibold text-ink">
            {presetEditing ? `Edit setup: ${editPreset?.name}` : "Add curated setup"}
          </h3>
          {presetEditing && <input type="hidden" name="id" value={editPreset!.id} />}
          <div className="grid gap-4 sm:grid-cols-2">
            <F label="Setup name"><input name="name" required defaultValue={editPreset?.name ?? ""} placeholder="e.g. Beginner Nano Community" className={inputCls} /></F>
            <F label="Experience">
              <select name="experience" defaultValue={editPreset?.experience ?? "beginner"} className={inputCls}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </F>
            <F label="Min tank (L)"><input name="tankSizeMin" type="number" defaultValue={editPreset?.tankSizeMin ?? ""} className={inputCls} /></F>
            <F label="Max tank (L)"><input name="tankSizeMax" type="number" defaultValue={editPreset?.tankSizeMax ?? ""} className={inputCls} /></F>
            <F label="Min budget (₹)"><input name="budgetMin" type="number" defaultValue={editPreset?.budgetMin ?? ""} className={inputCls} /></F>
            <F label="Max budget (₹)"><input name="budgetMax" type="number" defaultValue={editPreset?.budgetMax ?? ""} className={inputCls} /></F>
            <F label="Sort order"><input name="sortOrder" type="number" defaultValue={editPreset?.sortOrder ?? presets.length + 1} className={inputCls} /></F>
          </div>
          <div className="mt-4">
            <F label="Description"><textarea name="description" rows={2} defaultValue={editPreset?.description ?? ""} className={inputCls} /></F>
          </div>
          <div className="mt-4">
            <ImageField name="image" label="Setup image" defaultValue={editPreset?.image ?? ""} hint="Paste a URL, or upload a photo from your device" />
          </div>
          <div className="mt-4">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/55">Fish in this setup</span>
            <div className="grid max-h-64 gap-1.5 overflow-y-auto rounded-xl border border-ink/10 bg-[#fffdf8] p-3 sm:grid-cols-2 lg:grid-cols-3">
              {fishList.map((f) => (
                <label key={f.id} className="flex items-center gap-2 text-sm text-ink/80">
                  <input type="checkbox" name="fishIds" value={f.id} defaultChecked={presetFishIds.has(f.id)} className="h-4 w-4 accent-clay" />
                  {f.name}
                </label>
              ))}
            </div>
          </div>
          <label className="mt-4 flex items-center gap-2">
            <input type="checkbox" name="published" defaultChecked={presetEditing ? editPreset!.published : true} className="h-4 w-4 accent-clay" />
            <span className="text-sm text-ink">Visible on the planner</span>
          </label>
          <div className="mt-4 flex gap-3">
            {presetEditing && <Link href="/admin/planner" className="rounded-full border border-ink/20 px-6 py-2.5 text-sm text-ink/70 hover:bg-ink/[0.04]">Cancel</Link>}
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-full bg-clay px-6 py-2.5 text-sm font-semibold text-paper hover:bg-clay-2">
              <Plus className="h-4 w-4" /> {presetEditing ? "Save setup" : "Add setup"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
