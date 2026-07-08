"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/db/schema";

export function GalleryLightbox({ items }: { items: GalleryItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const isOpen = openIndex !== null;

  const close = useCallback(() => setOpenIndex(null), []);

  const next = useCallback(() => {
    setOpenIndex((i) => (i === null ? i : (i + 1) % items.length));
  }, [items.length]);

  const prev = useCallback(() => {
    setOpenIndex((i) =>
      i === null ? i : (i - 1 + items.length) % items.length,
    );
  }, [items.length]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, next, prev]);

  const active = openIndex !== null ? items[openIndex] : null;

  return (
    <>
      {/* Masonry */}
      <div className="columns-2 gap-4 md:columns-3">
        {items.map((item, i) => {
          const src = item.thumbnailUrl || item.url;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={item.title ?? "Open gallery image"}
              className="group mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl glass"
            >
              <Image
                src={src}
                alt={item.title ?? item.caption ?? "Aquarium gallery image"}
                width={item.width ?? 800}
                height={item.height ?? 600}
                sizes="(max-width:768px) 45vw, 30vw"
                className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </button>
          );
        })}
      </div>

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title ?? "Gallery image"}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/95 backdrop-blur"
          onClick={close}
        >
          {/* Close */}
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full glass text-ink hover:bg-ink/10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass text-ink hover:bg-ink/10 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Content */}
          <figure
            className="mx-4 flex max-h-[90vh] max-w-[92vw] flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.url}
              alt={active.title ?? active.caption ?? "Aquarium gallery image"}
              width={active.width ?? 1200}
              height={active.height ?? 900}
              sizes="90vw"
              className="h-auto max-h-[80vh] w-auto max-w-[92vw] rounded-2xl object-contain"
            />
            {(active.title || active.caption) && (
              <figcaption className="max-w-2xl text-center">
                {active.title && (
                  <p className="text-base font-medium text-ink">
                    {active.title}
                  </p>
                )}
                {active.caption && (
                  <p className="mt-1 text-sm text-ink/60">
                    {active.caption}
                  </p>
                )}
              </figcaption>
            )}
          </figure>

          {/* Next */}
          {items.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full glass text-ink hover:bg-ink/10 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
    </>
  );
}
