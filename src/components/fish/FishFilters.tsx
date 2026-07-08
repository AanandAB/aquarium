"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

type Cat = { slug: string; name: string };

const DIFFICULTIES = [
  { v: "", label: "All levels" },
  { v: "beginner", label: "Beginner" },
  { v: "intermediate", label: "Intermediate" },
  { v: "advanced", label: "Advanced" },
  { v: "expert", label: "Expert" },
];
const SORTS = [
  { v: "featured", label: "Featured" },
  { v: "price_asc", label: "Price: Low to High" },
  { v: "price_desc", label: "Price: High to Low" },
  { v: "name", label: "Name A–Z" },
];

export default function FishFilters({ categories }: { categories: Cat[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") ?? "") !== q) setParam("q", q);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const activeCat = params.get("category") ?? "";
  const activeDiff = params.get("difficulty") ?? "";
  const activeSort = params.get("sort") ?? "featured";

  return (
    <div className="sticky top-20 z-30 mb-8 rounded-2xl glass-strong p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/60" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search fish by name…"
              className="w-full rounded-full border border-ink/15 bg-ink/5 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink/45 focus:border-aqua/60 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <SlidersHorizontal className="h-4 w-4 text-aqua" />
            <select
              value={activeDiff}
              onChange={(e) => setParam("difficulty", e.target.value)}
              className="rounded-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d.v} value={d.v}>{d.label}</option>
              ))}
            </select>
            <select
              value={activeSort}
              onChange={(e) => setParam("sort", e.target.value)}
              className="rounded-full border border-ink/15 bg-paper px-3 py-2 text-sm text-ink focus:outline-none"
            >
              {SORTS.map((sortOpt) => (
                <option key={sortOpt.v} value={sortOpt.v}>{sortOpt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setParam("category", "")}
            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              !activeCat ? "bg-aqua text-paper" : "bg-ink/[0.06] text-ink/75 hover:bg-ink/10"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => setParam("category", c.slug)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                activeCat === c.slug
                  ? "bg-aqua text-paper"
                  : "bg-ink/[0.06] text-ink/75 hover:bg-ink/10"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
