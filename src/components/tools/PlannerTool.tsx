"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Fish as FishIcon,
  Sparkles,
  MessageCircle,
  Layers,
  Ruler,
  Calculator,
} from "lucide-react";
import { cn, formatPrice, whatsappHref } from "@/lib/utils";
import { Button } from "@/components/ui/primitives";
import type { TankPricing } from "@/db/schema";

/* --------------------------------- types --------------------------------- */

type Experience = "beginner" | "intermediate" | "expert";

type FishLite = {
  id: string;
  slug: string;
  name: string;
  heroImage: string | null;
  aggression: "peaceful" | "semi_aggressive" | "aggressive" | null;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert" | null;
  tankSizeMin: number | null;
  adultSize: number | null;
  price: number | null;
  offerPrice: number | null;
  waterType: string | null;
  categoryName: string | null;
};

type Preset = {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  tankSizeMin: number | null;
  tankSizeMax: number | null;
  budgetMin: number | null;
  budgetMax: number | null;
  experience: Experience | null;
  fishIds: string[] | null;
};

type EquipmentLine = { label: string; cost: number };

const WHATSAPP = "919947770808";

const EXP_RANK: Record<Experience, number> = { beginner: 0, intermediate: 1, expert: 2 };
const DIFF_RANK: Record<string, number> = { beginner: 0, intermediate: 1, advanced: 2, expert: 3 };
const EXP_MAX_DIFF: Record<Experience, number> = { beginner: 0, intermediate: 1, expert: 3 };

function priceOf(f: FishLite): number { return f.offerPrice ?? f.price ?? 0; }
function difficultyAllowed(exp: Experience, diff: FishLite["difficulty"]): boolean {
  const d = DIFF_RANK[diff ?? "beginner"] ?? 0;
  return d <= EXP_MAX_DIFF[exp];
}

/** Compute volume in litres from dimensions in cm. */
function litresFromCm(l: number, b: number, h: number): number {
  return (l * b * h) / 1000;
}

/* -------------------------------------------------------------------------- */

export default function PlannerTool({
  presets,
  fish,
  tankPricing,
}: {
  presets: Preset[];
  fish: FishLite[];
  tankPricing: TankPricing[];
}) {
  /* tank dimensions */
  const [length, setLength] = useState("60");
  const [breadth, setBreadth] = useState("30");
  const [height, setHeight] = useState("36");
  const [unit, setUnit] = useState<"cm" | "feet">("cm");
  const [budget, setBudget] = useState("3000");
  const [experience, setExperience] = useState<Experience>("beginner");
  const [category, setCategory] = useState("");

  const fishById = useMemo(() => {
    const m = new Map<string, FishLite>();
    for (const f of fish) m.set(f.id, f);
    return m;
  }, [fish]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const f of fish) if (f.categoryName) set.add(f.categoryName);
    return Array.from(set).sort();
  }, [fish]);

  /* --- volume & matching pricing tier --- */
  const tankLitres = useMemo(() => {
    let l = Number(length) || 0;
    let b = Number(breadth) || 0;
    let h = Number(height) || 0;
    if (unit === "feet") { l *= 30.48; b *= 30.48; h *= 30.48; }
    return Math.round(litresFromCm(l, b, h));
  }, [length, breadth, height, unit]);

  const matchingTier = useMemo<TankPricing | null>(() => {
    return tankPricing.find((t) => tankLitres >= t.litresMin && (t.litresMax == null || tankLitres <= t.litresMax)) ?? null;
  }, [tankPricing, tankLitres]);

  const equipment = useMemo<EquipmentLine[]>(() => {
    if (!matchingTier) return [];
    const t = matchingTier;
    const lines: EquipmentLine[] = [];
    if (t.baseSetup > 0) lines.push({ label: "Tank + setup", cost: t.baseSetup });
    const perL = Math.round(tankLitres * t.perLitre);
    if (perL > 0) lines.push({ label: `Water / conditioner (${tankLitres} L × ₹${t.perLitre}/L)`, cost: perL });
    if (t.filterCost > 0) lines.push({ label: "Filter", cost: t.filterCost });
    if (t.heaterCost > 0) lines.push({ label: "Heater", cost: t.heaterCost });
    if (t.lightCost > 0) lines.push({ label: "Light", cost: t.lightCost });
    if (t.substrateCost > 0) lines.push({ label: "Substrate", cost: t.substrateCost });
    if (t.decorCost > 0) lines.push({ label: "Decor", cost: t.decorCost });
    return lines;
  }, [matchingTier, tankLitres]);

  const equipTotal = useMemo(() => equipment.reduce((s, e) => s + e.cost, 0), [equipment]);

  const bud = Number(budget) || 0;
  const fishBudget = Math.max(0, bud - equipTotal);

  /* --- live recommendation (remaining budget after equipment) --- */
  const recommended = useMemo<FishLite[]>(() => {
    if (!tankLitres || !bud) return [];
    const pool = fish
      .filter((f) => {
        const p = priceOf(f);
        if (p <= 0) return false;
        if ((f.tankSizeMin ?? 0) > tankLitres) return false;
        if (!difficultyAllowed(experience, f.difficulty)) return false;
        if (category && f.categoryName !== category) return false;
        if (p > fishBudget) return false;
        return true;
      })
      .slice()
      .sort((a, b) => priceOf(a) - priceOf(b));

    const chosen: FishLite[] = [];
    let total = 0;
    let hasAggressive = false;
    let hasPeaceful = false;

    for (const f of pool) {
      if (chosen.length >= 6) break;
      const p = priceOf(f);
      if (total + p > fishBudget) continue;
      if (f.aggression === "aggressive" && hasPeaceful) continue;
      if (f.aggression === "peaceful" && hasAggressive) continue;
      chosen.push(f);
      total += p;
      if (f.aggression === "aggressive") hasAggressive = true;
      if (f.aggression === "peaceful") hasPeaceful = true;
    }
    return chosen;
  }, [fish, tankLitres, fishBudget, experience, category]);

  const fishTotal = useMemo(() => recommended.reduce((s, f) => s + priceOf(f), 0), [recommended]);
  const grandTotal = equipTotal + fishTotal;

  /* --- curated preset matches --- */
  const matchingPresets = useMemo(() => {
    if (!tankLitres || !bud) return [];
    return presets.filter((p) => {
      const tankOk = (p.tankSizeMin ?? 0) <= tankLitres && tankLitres <= (p.tankSizeMax ?? Infinity);
      const budOk = (p.budgetMin ?? 0) <= bud && bud <= (p.budgetMax ?? Infinity);
      const expOk = p.experience == null || EXP_RANK[p.experience] <= EXP_RANK[experience];
      return tankOk && budOk && expOk;
    });
  }, [presets, tankLitres, bud, experience]);

  /* --- WhatsApp message --- */
  const waHref = useMemo(() => {
    let msg = `Hi Happy Aquarium! I'd love a quote for this setup:\n\nTank: ${length}×${breadth}×${height} ${unit} = ~${tankLitres} L\nBudget: ${formatPrice(bud)}\n`;

    if (matchingTier) msg += `\n--- Equipment (${matchingTier.name}) ---\n`;
    for (const e of equipment) msg += `${e.label}: ${formatPrice(e.cost)}\n`;
    msg += `Subtotal equipment: ${formatPrice(equipTotal)}\n`;

    if (recommended.length > 0) {
      msg += `\n--- Recommended fish (remaining: ${formatPrice(fishBudget)}) ---\n`;
      for (const f of recommended) msg += `${f.name} — ${formatPrice(priceOf(f))}\n`;
    }
    msg += `\nFish total: ${formatPrice(fishTotal)}\n`;
    msg += `Grand total: ${formatPrice(grandTotal)}`;
    return whatsappHref(WHATSAPP, msg);
  }, [length, breadth, height, unit, tankLitres, bud, matchingTier, equipment, equipTotal, recommended, fishTotal, grandTotal]);

  const inputCls =
    "w-full rounded-xl border border-ink/15 bg-ink/5 px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-aqua/60 focus:outline-none font-num";

  return (
    <div className="py-6 sm:py-10">
      {/* Inputs */}
      <div className="rounded-3xl glass-strong p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* dimensions */}
          <label className="block space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink/60 flex items-center gap-1">
              <Ruler className="h-3 w-3" /> Tank dimensions
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="block text-[10px] text-ink/45">{unit === "cm" ? "L cm" : "L ft"}</span>
                <input type="number" min={1} value={length} onChange={(e) => setLength(e.target.value)} className={cn(inputCls, "py-2 text-sm")} />
              </div>
              <div>
                <span className="block text-[10px] text-ink/45">{unit === "cm" ? "B cm" : "B ft"}</span>
                <input type="number" min={1} value={breadth} onChange={(e) => setBreadth(e.target.value)} className={cn(inputCls, "py-2 text-sm")} />
              </div>
              <div>
                <span className="block text-[10px] text-ink/45">{unit === "cm" ? "H cm" : "H ft"}</span>
                <input type="number" min={1} value={height} onChange={(e) => setHeight(e.target.value)} className={cn(inputCls, "py-2 text-sm")} />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setUnit(unit === "cm" ? "feet" : "cm")}
              className="text-[10px] text-aqua underline hover:text-clay"
            >
              Switch to {unit === "cm" ? "feet" : "cm"}
            </button>
            <p className="text-xs font-num font-semibold text-aqua"><Calculator className="inline h-3 w-3" /> ~{tankLitres} L</p>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/60">Budget (₹)</span>
            <input type="number" min={0} value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g. 5000" className={inputCls} />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/60">Experience</span>
            <select value={experience} onChange={(e) => setExperience(e.target.value as Experience)} className={cn(inputCls, "!font-sans")}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/60">Preferred type</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputCls, "!font-sans")}>
              <option value="">Any type</option>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </label>
        </div>
      </div>

      {/* Equipment estimate */}
      {matchingTier && equipment.length > 0 && (
        <section className="mt-6 rounded-2xl glass p-5">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-clay">
            <Calculator className="h-4 w-4" /> Equipment estimate — {matchingTier.name}
          </h2>
          {matchingTier.note && <p className="mb-3 text-xs italic text-ink/55">{matchingTier.note}</p>}
          <ul className="space-y-1.5 text-sm text-ink/75">
            {equipment.map((e) => (
              <li key={e.label} className="flex justify-between">
                <span>{e.label}</span>
                <span className="font-num font-semibold">{formatPrice(e.cost)}</span>
              </li>
            ))}
            <li className="border-t border-ink/10 pt-1.5 flex justify-between font-semibold text-ink">
              <span>Equipment subtotal</span>
              <span className="font-num">{formatPrice(equipTotal)}</span>
            </li>
            <li className="flex justify-between text-xs text-ink/55">
              <span>Remaining for fish</span>
              <span className="font-num">{formatPrice(fishBudget)}</span>
            </li>
          </ul>
        </section>
      )}

      {/* Curated presets */}
      {matchingPresets.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            <Layers className="h-4 w-4" /> Curated setups for you
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchingPresets.map((p) => {
              const names = (p.fishIds ?? []).map((id) => fishById.get(id)?.name).filter((n): n is string => Boolean(n));
              return (
                <article key={p.id} className="flex flex-col overflow-hidden rounded-3xl glass">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {p.image ? (
                      <Image src={p.image} alt={p.name} fill sizes="(max-width:768px) 90vw, 360px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-ocean-900"><FishIcon className="h-9 w-9 text-aqua/40" /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-semibold text-ink">{p.name}</h3>
                    {p.description && <p className="mt-1 line-clamp-2 text-sm text-ink/60">{p.description}</p>}
                    {names.length > 0 && <p className="mt-3 text-sm text-ink/75"><span className="text-ink/45">Includes: </span>{names.join(", ")}</p>}
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-ink/60">
                      {(p.tankSizeMin != null || p.tankSizeMax != null) && (
                        <span className="rounded-md bg-ink/5 px-2 py-1 font-num">{p.tankSizeMin ?? "?"}–{p.tankSizeMax ?? "?"} L</span>
                      )}
                      {(p.budgetMin != null || p.budgetMax != null) && (
                        <span className="rounded-md bg-ink/5 px-2 py-1 font-num">{formatPrice(p.budgetMin)}–{formatPrice(p.budgetMax)}</span>
                      )}
                      {p.experience && <span className="rounded-md bg-ink/5 px-2 py-1 capitalize">{p.experience}</span>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* Live recommendation */}
      <section className="mt-10">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
          <Sparkles className="h-4 w-4" /> Your recommended fish
        </h2>

        {recommended.length === 0 ? (
          <div className="rounded-3xl glass p-10 text-center text-ink/75">
            {tankLitres > 0 && bud > 0
              ? "No fish fit these constraints with the remaining budget. Try a larger tank, higher budget, or adjust the equipment tiers."
              : "Enter your tank dimensions and budget above to see a tailored stocking plan."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {recommended.map((f) => (
                <article key={f.id} className="flex flex-col overflow-hidden rounded-2xl glass">
                  <div className="relative aspect-square overflow-hidden">
                    {f.heroImage ? (
                      <Image src={f.heroImage} alt={f.name} fill sizes="(max-width:768px) 45vw, 220px" className="object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-ocean-900"><FishIcon className="h-8 w-8 text-aqua/40" /></div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <p className="truncate text-sm font-semibold text-ink">{f.name}</p>
                    {f.categoryName && <p className="truncate text-[11px] text-ink/60">{f.categoryName}</p>}
                    <span className="mt-2 font-num text-base font-semibold text-aqua">{formatPrice(priceOf(f))}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-3xl glass-strong p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-ink/60">
                  {recommended.length} species · fits a <span className="font-num text-ink">{tankLitres} L</span> tank ({length}×{breadth}×{height} {unit})
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  Grand total{" "}
                  <span className="font-num text-turquoise">{formatPrice(grandTotal)}</span>
                </p>
                <p className="text-xs text-ink/45">
                  Equipment {formatPrice(equipTotal)} + Fish {formatPrice(fishTotal)}
                </p>
              </div>
              <Button href={waHref} external variant="primary" size="lg">
                <MessageCircle className="h-4 w-4" />
                Reserve this setup on WhatsApp
              </Button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
