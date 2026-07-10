"use client";

import { useRef, useState } from "react";
import { Link as LinkIcon, Upload, X, ImageIcon, Loader2 } from "lucide-react";

/**
 * Dual-mode image control: paste a URL, or upload a file from the device.
 * Uploaded files are downscaled + compressed in the browser to a data URL
 * (no server/R2 needed) and stored in the same field as a normal image value.
 * Renders a hidden <input name> so it plugs into existing server-action forms.
 */
export default function ImageField({
  name,
  label,
  defaultValue = "",
  hint,
  maxDim = 1400,
  quality = 0.82,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  maxDim?: number;
  quality?: number;
}) {
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"url" | "upload">(
    defaultValue.startsWith("data:") ? "upload" : "url",
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setErr(null);
    if (!file.type.startsWith("image/")) {
      setErr("Please choose an image file.");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await compressImage(file, maxDim, quality);
      setValue(dataUrl);
    } catch {
      setErr("Could not process that image.");
    } finally {
      setBusy(false);
    }
  }

  const isData = value.startsWith("data:");
  const sizeKb = isData ? Math.round((value.length * 0.75) / 1024) : null;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-ink/55">
          {label}
        </span>
        <div className="flex overflow-hidden rounded-lg border border-ink/15 text-[11px]">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex items-center gap-1 px-2.5 py-1 ${mode === "url" ? "bg-teal text-paper" : "text-ink/60 hover:bg-ink/[0.05]"}`}
          >
            <LinkIcon className="h-3 w-3" /> Link
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex items-center gap-1 px-2.5 py-1 ${mode === "upload" ? "bg-teal text-paper" : "text-ink/60 hover:bg-ink/[0.05]"}`}
          >
            <Upload className="h-3 w-3" /> Upload
          </button>
        </div>
      </div>

      {/* the actual submitted value */}
      <input type="hidden" name={name} value={value} readOnly />

      <div className="flex gap-3">
        {/* preview */}
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-paper-2">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-ink/30">
              <ImageIcon className="h-6 w-6" />
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={() => setValue("")}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-ink/70 text-paper hover:bg-ink"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1">
          {mode === "url" ? (
            <input
              type="url"
              value={isData ? "" : value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://…/image.jpg"
              className="w-full rounded-lg border border-ink/15 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-clay/50 focus:outline-none"
            />
          ) : (
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-ink/25 bg-[#fffdf8] px-3 py-2.5 text-sm text-ink/70 hover:border-clay/50 hover:text-ink disabled:opacity-60"
              >
                {busy ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing…</>
                ) : (
                  <><Upload className="h-4 w-4" /> {isData ? "Replace image" : "Choose image file"}</>
                )}
              </button>
              {isData && sizeKb != null && (
                <p className="mt-1 text-[11px] text-emerald-700">
                  ✓ Uploaded image ready ({sizeKb} KB, optimised)
                </p>
              )}
            </div>
          )}
          {hint && <p className="mt-1 text-[11px] text-ink/45">{hint}</p>}
          {err && <p className="mt-1 text-[11px] text-rose-600">{err}</p>}
        </div>
      </div>
    </div>
  );
}

/** Downscale to maxDim and re-encode as JPEG data URL to keep size small. */
function compressImage(file: File, maxDim: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          const scale = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("ctx"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
