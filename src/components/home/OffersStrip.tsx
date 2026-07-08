"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tag, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";

type Offer = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image: string | null;
  badge: string | null;
  discountText: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  endAt: string | Date | null;
};

function useCountdown(end: string | Date | null) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    if (!end) return;
    const target = new Date(end).getTime();
    const tick = () => setLeft(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [end]);
  if (left == null) return null;
  const d = Math.floor(left / 86400000);
  const h = Math.floor((left % 86400000) / 3600000);
  const m = Math.floor((left % 3600000) / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { d, h, m, s };
}

function Unit({ v, label }: { v: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-num text-xl font-semibold tabular-nums text-ink">
        {String(v).padStart(2, "0")}
      </span>
      <span className="text-[10px] uppercase tracking-wide text-ink/60">
        {label}
      </span>
    </div>
  );
}

function OfferCard({ offer }: { offer: Offer }) {
  const cd = useCountdown(offer.endAt);
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl glass-strong p-6">
      {offer.image && (
        <Image
          src={offer.image}
          alt=""
          fill
          className="object-cover opacity-15 transition-opacity group-hover:opacity-25"
        />
      )}
      <div className="relative">
        <div className="flex items-center gap-2">
          {offer.badge && (
            <span className="inline-flex items-center gap-1 rounded-full bg-coral/20 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-coral-soft">
              <Tag className="h-3 w-3" /> {offer.badge}
            </span>
          )}
          {offer.discountText && (
            <span className="font-num text-sm font-bold text-aqua">
              {offer.discountText}
            </span>
          )}
        </div>
        <h3 className="mt-3 text-xl font-semibold text-ink">
          {offer.title}
        </h3>
        {offer.subtitle && (
          <p className="mt-1 text-sm text-ink/75">{offer.subtitle}</p>
        )}
      </div>

      <div className="relative mt-6 flex items-end justify-between">
        {cd && (offer.endAt) ? (
          <div className="flex gap-3">
            <Unit v={cd.d} label="days" />
            <Unit v={cd.h} label="hrs" />
            <Unit v={cd.m} label="min" />
            <Unit v={cd.s} label="sec" />
          </div>
        ) : (
          <span className="text-xs text-ink/60">Limited time</span>
        )}
        {offer.ctaLink && (
          <a
            href={offer.ctaLink}
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-aqua to-turquoise px-4 py-2 text-xs font-semibold text-paper transition-transform hover:scale-105"
          >
            {offer.ctaText ?? "Shop"} <ArrowRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export default function OffersStrip({
  title,
  subtitle,
  offers,
}: {
  title: string;
  subtitle?: string;
  offers: Offer[];
}) {
  if (!offers.length) return null;
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-8">
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-coral-soft">
            Limited time
          </span>
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-ink/70">{subtitle}</p>}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {offers.map((o) => (
            <OfferCard key={o.id} offer={o} />
          ))}
        </div>
      </Container>
    </section>
  );
}
