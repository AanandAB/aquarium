"use client";

import { useState } from "react";
import { ClipboardList, MessageCircle, Ruler, MapPin, Check } from "lucide-react";
import { cn, whatsappHref } from "@/lib/utils";
import { Button } from "@/components/ui/primitives";

const WHATSAPP = "919947770808";

const SHAPES = ["Rectangle", "Bow-front", "Cylinder", "Cube", "Corner", "Custom"];
const PLACEMENTS = ["Drawing room", "Office / cabin", "Retail shop", "Restaurant / hotel", "Balcony / terrace", "Bedroom", "Outdoor (covered)"];
const GLASS_TYPES = ["Regular float glass", "Ultra-clear (low-iron)", "Optiwhite", "Acrylic"];
const EXTRAS = [
  "Stand / cabinet",
  "LED lighting system",
  "Live plants (aquascaped)",
  "CO₂ system",
  "Chiller / cooling",
  "Protein skimmer (marine)",
  "Maintenance contract (monthly)",
  "Delivery + setup",
];

const inputCls = "w-full rounded-xl border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none focus:ring-1 focus:ring-clay/30";

export default function CustomQuoteForm() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const [shape, setShape] = useState("");
  const [lengthCm, setLengthCm] = useState("");
  const [breadthCm, setBreadthCm] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [sizeNote, setSizeNote] = useState("");
  const [placement, setPlacement] = useState("");
  const [glassType, setGlassType] = useState("");
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");

  function toggleExtra(e: string) {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      if (next.has(e)) next.delete(e); else next.add(e);
      return next;
    });
  }

  function buildWhatsAppUrl() {
    const dims = [lengthCm, breadthCm, heightCm].filter(Boolean);
    let msg = "Hi Happy Aquarium! I'd like a custom aquarium quote:\n\n";
    if (dims.length > 0) msg += `📐 Size: ${dims.join(" × ")} cm`;
    if (sizeNote) msg += ` (${sizeNote})`;
    if (dims.length > 0 || sizeNote) msg += "\n";
    if (shape) msg += `🔷 Shape: ${shape}\n`;
    if (placement) msg += `📍 Where: ${placement}\n`;
    if (glassType) msg += `🪟 Glass: ${glassType}\n`;
    if (selectedExtras.size > 0) {
      msg += `➕ Extras: ${[...selectedExtras].join(", ")}\n`;
    }
    if (notes) msg += `\n📝 Notes: ${notes}\n`;
    msg += "\nPlease share a quote — thank you! 🙏";
    return whatsappHref(WHATSAPP, msg);
  }

  return (
    <div className="mt-12 border-t border-ink/10 pt-10">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group mx-auto flex items-center gap-3 rounded-3xl border-2 border-dashed border-clay/40 px-8 py-6 text-center transition-colors hover:border-clay/70 hover:bg-clay/[0.04]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-clay/10 text-clay transition-transform group-hover:scale-110">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div className="text-left">
            <p className="font-display text-lg font-semibold text-ink">Want a custom aquarium?</p>
            <p className="text-sm text-ink/55">Tell us the size, shape & where you'd like it — we'll quote you on WhatsApp.</p>
          </div>
        </button>
      ) : sent ? (
        <div className="rounded-3xl bg-emerald-500/10 p-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-600">
            <Check className="h-7 w-7" />
          </div>
          <p className="font-display text-lg font-semibold text-ink">Quote request sent!</p>
          <p className="mt-1 text-sm text-ink/55">Your requirements have been shared. We'll reply on WhatsApp soon.</p>
          <button
            type="button"
            onClick={() => { setOpen(false); setSent(false); }}
            className="mt-4 text-sm font-semibold text-clay underline hover:text-clay/80"
          >
            Send another enquiry
          </button>
        </div>
      ) : (
        <div className="rounded-3xl border border-ink/10 bg-[#fffdf8] p-6 sm:p-8">
          <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-semibold text-ink">
            <ClipboardList className="h-5 w-5 text-clay" /> Custom aquarium enquiry
          </h2>

          {/* size */}
          <div className="mb-6">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/55">
              <Ruler className="h-3 w-3" /> Size (approx)
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div><span className="block text-[10px] text-ink/45 mb-1">Length (cm)</span><input type="number" min={1} value={lengthCm} onChange={(e) => setLengthCm(e.target.value)} placeholder="e.g. 120" className={inputCls} /></div>
              <div><span className="block text-[10px] text-ink/45 mb-1">Breadth (cm)</span><input type="number" min={1} value={breadthCm} onChange={(e) => setBreadthCm(e.target.value)} placeholder="e.g. 45" className={inputCls} /></div>
              <div><span className="block text-[10px] text-ink/45 mb-1">Height (cm)</span><input type="number" min={1} value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="e.g. 50" className={inputCls} /></div>
            </div>
            <input type="text" value={sizeNote} onChange={(e) => setSizeNote(e.target.value)} placeholder="Or describe: ~200 litres, 4 ft tank…" className={cn(inputCls, "mt-2")} />
          </div>

          {/* shape */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/55">Shape</p>
            <div className="flex flex-wrap gap-2">
              {SHAPES.map((s) => (
                <button key={s} type="button" onClick={() => setShape(shape === s ? "" : s)} className={cn("rounded-full border px-4 py-1.5 text-xs font-medium transition-colors", shape === s ? "border-clay bg-clay/10 text-clay" : "border-ink/15 text-ink/60 hover:border-clay/30 hover:text-ink")}>{s}</button>
              ))}
            </div>
          </div>

          {/* placement */}
          <div className="mb-5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink/55">
              <MapPin className="h-3 w-3" /> Where will you keep it?
            </p>
            <div className="flex flex-wrap gap-2">
              {PLACEMENTS.map((p) => (
                <button key={p} type="button" onClick={() => setPlacement(placement === p ? "" : p)} className={cn("rounded-full border px-4 py-1.5 text-xs font-medium transition-colors", placement === p ? "border-clay bg-clay/10 text-clay" : "border-ink/15 text-ink/60 hover:border-clay/30 hover:text-ink")}>{p}</button>
              ))}
            </div>
          </div>

          {/* glass */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/55">Glass type</p>
            <div className="flex flex-wrap gap-2">
              {GLASS_TYPES.map((g) => (
                <button key={g} type="button" onClick={() => setGlassType(glassType === g ? "" : g)} className={cn("rounded-full border px-4 py-1.5 text-xs font-medium transition-colors", glassType === g ? "border-clay bg-clay/10 text-clay" : "border-ink/15 text-ink/60 hover:border-clay/30 hover:text-ink")}>{g}</button>
              ))}
            </div>
          </div>

          {/* extras */}
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/55">Accessories & services (optional)</p>
            <div className="flex flex-wrap gap-2">
              {EXTRAS.map((e) => (
                <button key={e} type="button" onClick={() => toggleExtra(e)} className={cn("rounded-full border px-4 py-1.5 text-xs font-medium transition-colors", selectedExtras.has(e) ? "border-teal bg-teal/10 text-teal" : "border-ink/15 text-ink/60 hover:border-teal/30 hover:text-ink")}>{e}</button>
              ))}
            </div>
          </div>

          {/* notes */}
          <div className="mb-6">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink/55">Anything else?</p>
            <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Fish type preference, budget range, delivery timeline, any special requests…" className={inputCls} />
          </div>

          {/* action */}
          <div className="flex gap-3">
            <Button href={buildWhatsAppUrl()} external variant="primary" size="lg">
              <MessageCircle className="h-4 w-4" />
              Share on WhatsApp
            </Button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full border border-ink/20 px-5 py-3 text-sm text-ink/70 hover:bg-ink/[0.04]">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
