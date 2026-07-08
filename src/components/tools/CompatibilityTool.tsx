"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Check,
  X,
  Fish as FishIcon,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------- types --------------------------------- */

type Level = "compatible" | "semi" | "incompatible";

type FishLite = {
  id: string;
  slug: string;
  name: string;
  heroImage: string | null;
  aggression: "peaceful" | "semi_aggressive" | "aggressive" | null;
  difficulty: "beginner" | "intermediate" | "advanced" | "expert" | null;
  tankSizeMin: number | null;
  adultSize: number | null;
  categoryName: string | null;
};

type CompatPair = {
  fishAId: string;
  fishBId: string;
  level: Level;
  note: string | null;
};

type PairResult = {
  a: FishLite;
  b: FishLite;
  level: Level;
  note: string;
  inferred: boolean;
};

/* --------------------------------- theme --------------------------------- */

const LEVEL_STYLES: Record<Level, string> = {
  compatible: "bg-emerald-400/15 text-emerald-700 border-emerald-400/30",
  semi: "bg-amber-400/15 text-amber-700 border-amber-400/30",
  incompatible: "bg-rose-400/15 text-rose-700 border-rose-400/30",
};

const LEVEL_LABEL: Record<Level, string> = {
  compatible: "Compatible",
  semi: "With care",
  incompatible: "Avoid",
};

const LEVEL_DOT: Record<Level, string> = {
  compatible: "bg-emerald-400",
  semi: "bg-amber-400",
  incompatible: "bg-rose-400",
};

function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide",
        LEVEL_STYLES[level],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", LEVEL_DOT[level])} />
      {LEVEL_LABEL[level]}
    </span>
  );
}

/* ------------------------------ inference -------------------------------- */

function inferLevel(a: FishLite, b: FishLite): { level: Level; note: string } {
  const aAgg = a.aggression;
  const bAgg = b.aggression;

  if (aAgg === "aggressive" || bAgg === "aggressive") {
    const aggressive = aAgg === "aggressive" ? a : b;
    const other = aAgg === "aggressive" ? b : a;
    const otherPeaceful = other.aggression === "peaceful";
    const muchSmaller =
      other.adultSize != null &&
      aggressive.adultSize != null &&
      other.adultSize <= aggressive.adultSize * 0.5;

    if (otherPeaceful && muchSmaller) {
      return {
        level: "incompatible",
        note: `${aggressive.name} is aggressive and much larger — it will likely bully or eat the peaceful ${other.name}.`,
      };
    }
    return {
      level: "semi",
      note: `${aggressive.name} can be aggressive — keep them only with robust tank mates and plenty of space and hiding spots.`,
    };
  }

  if (aAgg === "peaceful" && bAgg === "peaceful") {
    return {
      level: "compatible",
      note: `Both ${a.name} and ${b.name} are peaceful — a calm, harmonious pairing.`,
    };
  }

  return {
    level: "semi",
    note: `${a.name} and ${b.name} can usually coexist in a spacious, well-planted tank — monitor them at first.`,
  };
}

/* ------------------------------ component -------------------------------- */

export default function CompatibilityTool({
  fish,
  pairs,
}: {
  fish: FishLite[];
  pairs: CompatPair[];
}) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fast lookup for stored compatibility pairs (either direction).
  const pairMap = useMemo(() => {
    const m = new Map<string, CompatPair>();
    for (const p of pairs) {
      m.set(`${p.fishAId}::${p.fishBId}`, p);
      m.set(`${p.fishBId}::${p.fishAId}`, p);
    }
    return m;
  }, [pairs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fish;
    return fish.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.categoryName ?? "").toLowerCase().includes(q),
    );
  }, [fish, query]);

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => fish.find((f) => f.id === id))
        .filter((f): f is FishLite => Boolean(f)),
    [selectedIds, fish],
  );

  const results = useMemo<PairResult[]>(() => {
    const out: PairResult[] = [];
    for (let i = 0; i < selected.length; i++) {
      for (let j = i + 1; j < selected.length; j++) {
        const a = selected[i];
        const b = selected[j];
        const stored = pairMap.get(`${a.id}::${b.id}`);
        if (stored) {
          out.push({
            a,
            b,
            level: stored.level,
            note:
              stored.note ??
              `${a.name} and ${b.name} are a documented ${LEVEL_LABEL[
                stored.level
              ].toLowerCase()} pairing.`,
            inferred: false,
          });
        } else {
          const inf = inferLevel(a, b);
          out.push({ a, b, level: inf.level, note: inf.note, inferred: true });
        }
      }
    }
    return out;
  }, [selected, pairMap]);

  const verdict = useMemo(() => {
    if (results.some((r) => r.level === "incompatible")) {
      return {
        level: "incompatible" as Level,
        title: "Not recommended together",
        text: "Some of these fish are likely to fight, stress or prey on each other. Swap out the flagged pairs before stocking your tank.",
      };
    }
    if (results.some((r) => r.level === "semi")) {
      return {
        level: "semi" as Level,
        title: "Can work — with care",
        text: "This mix can thrive in a spacious, well-planted tank. Keep an eye on behaviour when first introduced.",
      };
    }
    return {
      level: "compatible" as Level,
      title: "Great community!",
      text: "These fish should live together happily. Provide the right tank size and water conditions and you're set.",
    };
  }, [results]);

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className="py-6 sm:py-10">
      {/* Search */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/60" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search fish by name…"
            className="w-full rounded-xl border border-ink/15 bg-ink/5 py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink/45 focus:border-aqua/60 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-3 text-sm text-ink/60">
          <span className="font-num text-aqua">{selected.length}</span> selected
          {selected.length > 0 && (
            <button
              onClick={() => setSelectedIds([])}
              className="inline-flex items-center gap-1 rounded-full border border-ink/15 px-3 py-1 text-xs text-ink/75 transition-colors hover:border-coral/50 hover:text-coral-soft"
            >
              <X className="h-3 w-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Fish grid */}
      {filtered.length === 0 ? (
        <div className="rounded-3xl glass p-10 text-center text-ink/75">
          No fish match “{query}”.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((f) => {
            const isSel = selectedIds.includes(f.id);
            return (
              <button
                key={f.id}
                onClick={() => toggle(f.id)}
                aria-pressed={isSel}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl glass text-left transition-all duration-300 hover:-translate-y-1",
                  isSel && "ring-2 ring-aqua ring-offset-2 ring-offset-navy",
                )}
              >
                <div className="relative aspect-square overflow-hidden">
                  {f.heroImage ? (
                    <Image
                      src={f.heroImage}
                      alt={f.name}
                      fill
                      sizes="(max-width:768px) 45vw, 200px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-ocean-900">
                      <FishIcon className="h-8 w-8 text-aqua/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                  {isSel && (
                    <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-aqua to-turquoise text-paper shadow-lg">
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="truncate text-sm font-semibold text-ink group-hover:text-aqua">
                    {f.name}
                  </p>
                  {f.categoryName && (
                    <p className="truncate text-[11px] text-ink/60">
                      {f.categoryName}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Results */}
      {selected.length < 2 ? (
        <div className="mt-8 rounded-3xl glass p-8 text-center">
          <Sparkles className="mx-auto mb-3 h-6 w-6 text-aqua" />
          <p className="text-ink/75">
            Select <span className="text-ink">two or more fish</span> above
            to see how well they live together.
          </p>
        </div>
      ) : (
        <div className="mt-10 space-y-6">
          {/* Verdict */}
          <div
            className={cn(
              "rounded-3xl border p-6 glass-strong",
              LEVEL_STYLES[verdict.level],
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "inline-flex h-9 w-9 items-center justify-center rounded-full",
                  verdict.level === "compatible"
                    ? "bg-emerald-400/20 text-emerald-700"
                    : verdict.level === "semi"
                      ? "bg-amber-400/20 text-amber-700"
                      : "bg-rose-400/20 text-rose-700",
                )}
              >
                {verdict.level === "incompatible" ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
              </span>
              <div>
                <h3 className="text-lg font-semibold text-ink">
                  {verdict.title}
                </h3>
                <p className="text-sm text-ink/75">{verdict.text}</p>
              </div>
            </div>
          </div>

          {/* Pair list */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua">
              Pair-by-pair breakdown
            </h3>
            {results.map((r) => (
              <div
                key={`${r.a.id}-${r.b.id}`}
                className="flex flex-col gap-3 rounded-2xl glass p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-ink">
                    <span className="font-medium">{r.a.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-ink/45" />
                    <span className="font-medium">{r.b.name}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {r.note}
                    {r.inferred && (
                      <span className="ml-1 text-[11px] text-ink/45">
                        (estimated from traits)
                      </span>
                    )}
                  </p>
                </div>
                <LevelBadge level={r.level} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
