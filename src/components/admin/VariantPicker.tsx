"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";

type Option = { id: string; name: string; slug: string };

export default function VariantPicker({
  name,
  options,
  defaultValue = [],
}: {
  name: string;
  options: Option[];
  defaultValue?: string[];
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>(defaultValue);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const filtered = options.filter(
    (o) =>
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.slug.toLowerCase().includes(search.toLowerCase()),
  );

  const selectedNames = options
    .filter((o) => selected.includes(o.id))
    .map((o) => o.name);

  return (
    <div ref={ref} className="relative">
      {/* Hidden inputs for form submission */}
      {selected.map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-xl border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30"
      >
        <span className="truncate">
          {selectedNames.length > 0
            ? `${selectedNames.length} selected`
            : "Select variants…"}
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-ink/50" />
      </button>

      {/* Selected chips */}
      {selectedNames.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selectedNames.map((n, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-aqua/10 px-2.5 py-1 text-xs text-aqua"
            >
              {n}
              <button
                type="button"
                onClick={() => {
                  const id = options.find((o) => o.name === n)?.id;
                  if (id) toggle(id);
                }}
                className="text-aqua/70 hover:text-aqua"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-ink/15 bg-[#fffdf8] shadow-lg">
          <div className="border-b border-ink/10 p-2">
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full rounded-lg border border-ink/10 px-3 py-1.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-ink/50">No matches</p>
            )}
            {filtered.map((o) => {
              const isSel = selected.includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggle(o.id)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-clay/[0.06]"
                >
                  <span
                    className={`flex h-4 w-4 items-center justify-center rounded border ${
                      isSel ? "border-aqua bg-aqua text-paper" : "border-ink/25"
                    }`}
                  >
                    {isSel && <Check className="h-3 w-3" />}
                  </span>
                  <span className="truncate">{o.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
