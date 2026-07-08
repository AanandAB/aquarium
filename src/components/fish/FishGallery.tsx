"use client";

import { useState } from "react";
import Image from "next/image";

export default function FishGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const list = images.filter(Boolean);
  if (list.length === 0) return null;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl glass">
        <Image
          key={active}
          src={list[active]}
          alt={alt}
          fill
          priority
          sizes="(max-width:1024px) 100vw, 600px"
          className="object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                i === active
                  ? "border-aqua"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
