"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Fish as FishIcon,
  Sparkles,
  MessageCircle,
  Layers,
} from "lucide-react";
import { cn, formatPrice, whatsappHref } from "@/lib/utils";
import { Button } from "@/components/ui/primitives";

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

const WHATSAPP = "919947770808";

const EXP_RANK: Record<Experience, number> = {
  beginner: 0,
  intermediate: 1,
  expert: 2,
};

const DIFF_RANK: Record<string, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
  expert: 3,
};

/** Max difficulty rank an experience level is comfortable with. */
const EXP_MAX_DIFF: Record<Experience, number> = {
  beginner: 0,
  intermediate: 1,
  expert: 3,
};

function priceOf(f: FishLite): number {
  return f.offerPrice ?? f.price ?? 0;
}

function difficultyAllowed(exp: Experience, diff: FishLite["difficulty"]): boolean {
  const d = DIFF_RANK[diff ?? "beginner"] ?? 0;
  return d <= EXP_MAX_DIFF[exp];
}

/* ------------------------------ component -------------------------------- */

export default function PlannerTool({
  presets,
  fish,
}: {
  presets: Preset[];
  fish: FishLite[];
}) {
  const [tankSize, setTankSize] = useState("100");
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

  const tank = Number(tankSize) || 0;
  const bud = Number(budget) || 0;

  /* ---------------------------- curated presets --------------------------- */
  const matchingPresets = useMemo(() => {
    if (!tank || !bud) return [];
    return presets.filter((p) => {
      const tankOk =
        (p.tankSizeMin ?? 0) <= tank && tank <= (p.tankSizeMax ?? Infinity);
      const budOk =
        (p.budgetMin ?? 0) <= bud && bud <= (p.budgetMax ?? Infinity);
      const expOk =
        p.experience == null || EXP_RANK[p.experience] <= EXP_RANK[experience];
      return tankOk && budOk && expOk;
    });
  }, [presets, tank, bud, experience]);

  /* -------------------------- live recommendation ------------------------- */
  const recommended = useMemo<FishLite[]>(() => {
    if (!tank || !bud) return [];
    const pool = fish
      .filter((f) => {
        const p = priceOf(f);
        if (p <= 0) return false;
        if ((f.tankSizeMin ?? 0) > tank) return false;
        if (!difficultyAllowed(experience, f.difficulty)) return false;
        if (category && f.categoryName !== category) return false;
        if (p > bud) return false;
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
      if (total + p > bud) continue;
      // Avoid mixing aggressive with peaceful fish.
      if (f.aggression === "aggressive" && hasPeaceful) continue;
      if (f.aggression === "peaceful" && hasAggressive) continue;
      chosen.push(f);
      total += p;
      if (f.aggression === "aggressive") hasAggressive = true;
      if (f.aggression === "peaceful") hasPeaceful = true;
    }
    return chosen;
  }, [fish, tank, bud, experience, category]);

  const total = useMemo(
    () => recommended.reduce((s, f) => s + priceOf(f), 0),
    [recommended],
  );

  const waHref = useMemo(() => {
    if (recommended.length === 0) return whatsappHref(WHATSAPP);
    const lines = recommended
      .map((f, i) => `${i + 1}. ${f.name} — ${formatPrice(priceOf(f))}`)
      .join("\n");
    const msg = `Hi Happy Aquarium! I'd love to reserve this aquarium setup:\n\nTank: ${tank} L • Budget: ${formatPrice(
      bud,
    )} • Experience: ${experience}\n\n${lines}\n\nEstimated total: ${formatPrice(
      total,
    )}`;
    return whatsappHref(WHATSAPP, msg);
  }, [recommended, tank, bud, experience, total]);

  const inputCls =
    "w-full rounded-xl border border-ink/15 bg-ink/5 px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-aqua/60 focus:outline-none";

  return (
    <div className="py-6 sm:py-10">
      {/* Inputs */}
      <div className="rounded-3xl glass-strong p-6 sm:p-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/60">
              Tank size (litres)
            </span>
            <input
              type="number"
              min={1}
              value={tankSize}
              onChange={(e) => setTankSize(e.target.value)}
              placeholder="e.g. 100"
              className={cn(inputCls, "font-num")}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/60">
              Budget (₹)
            </span>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 3000"
              className={cn(inputCls, "font-num")}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/60">
              Experience
            </span>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value as Experience)}
              className={inputCls}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink/60">
              Preferred type
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              <option value="">Any type</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Curated presets */}
      {matchingPresets.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
            <Layers className="h-4 w-4" /> Curated setups for you
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {matchingPresets.map((p) => {
              const names = (p.fishIds ?? [])
                .map((id) => fishById.get(id)?.name)
                .filter((n): n is string => Boolean(n));
              return (
                <article
                  key={p.id}
                  className="flex flex-col overflow-hidden rounded-3xl glass"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width:768px) 90vw, 360px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-ocean-900">
                        <FishIcon className="h-9 w-9 text-aqua/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-semibold text-ink">
                      {p.name}
                    </h3>
                    {p.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-ink/60">
                        {p.description}
                      </p>
                    )}
                    {names.length > 0 && (
                      <p className="mt-3 text-sm text-ink/75">
                        <span className="text-ink/45">Includes: </span>
                        {names.join(", ")}
                      </p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-ink/60">
                      {(p.tankSizeMin != null || p.tankSizeMax != null) && (
                        <span className="rounded-md bg-ink/5 px-2 py-1 font-num">
                          {p.tankSizeMin ?? "?"}–{p.tankSizeMax ?? "?"} L
                        </span>
                      )}
                      {(p.budgetMin != null || p.budgetMax != null) && (
                        <span className="rounded-md bg-ink/5 px-2 py-1 font-num">
                          {formatPrice(p.budgetMin)}–{formatPrice(p.budgetMax)}
                        </span>
                      )}
                      {p.experience && (
                        <span className="rounded-md bg-ink/5 px-2 py-1 capitalize">
                          {p.experience}
                        </span>
                      )}
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
          <Sparkles className="h-4 w-4" /> Your recommended community
        </h2>

        {recommended.length === 0 ? (
          <div className="rounded-3xl glass p-10 text-center text-ink/75">
            {tank && bud
              ? "No fish fit these constraints yet — try a larger tank or a higher budget."
              : "Enter your tank size and budget above to see a tailored stocking plan."}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {recommended.map((f) => (
                <article
                  key={f.id}
                  className="flex flex-col overflow-hidden rounded-2xl glass"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {f.heroImage ? (
                      <Image
                        src={f.heroImage}
                        alt={f.name}
                        fill
                        sizes="(max-width:768px) 45vw, 220px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-ocean-900">
                        <FishIcon className="h-8 w-8 text-aqua/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <p className="truncate text-sm font-semibold text-ink">
                      {f.name}
                    </p>
                    {f.categoryName && (
                      <p className="truncate text-[11px] text-ink/60">
                        {f.categoryName}
                      </p>
                    )}
                    <span className="mt-2 font-num text-base font-semibold text-aqua">
                      {formatPrice(priceOf(f))}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-4 rounded-3xl glass-strong p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-ink/60">
                  {recommended.length}{" "}
                  {recommended.length === 1 ? "species" : "species"} • fits a{" "}
                  <span className="font-num text-ink">{tank} L</span> tank
                </p>
                <p className="mt-1 text-2xl font-semibold text-ink">
                  Estimated total{" "}
                  <span className="font-num text-turquoise">
                    {formatPrice(total)}
                  </span>
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
