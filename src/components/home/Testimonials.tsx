"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";

type Testimonial = {
  id: string;
  customerName: string;
  avatar: string | null;
  rating: number;
  review: string;
  location: string | null;
};

export default function Testimonials({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle?: string;
  items: Testimonial[];
}) {
  const [idx, setIdx] = useState(0);
  if (!items.length) return null;
  const t = items[idx];
  const go = (dir: number) =>
    setIdx((i) => (i + dir + items.length) % items.length);

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="mb-10 text-center">
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-aqua">
            Loved by hobbyists
          </span>
          <h2 className="text-3xl font-semibold text-ink sm:text-4xl">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-ink/70">{subtitle}</p>}
        </div>

        <div className="relative mx-auto max-w-3xl">
          <div className="glass-strong rounded-3xl p-8 sm:p-12">
            <Quote className="h-10 w-10 text-aqua/40" />
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <p className="mt-4 text-lg leading-relaxed text-ink sm:text-xl">
                  “{t.review}”
                </p>
                <div className="mt-6 flex items-center gap-4">
                  {t.avatar && (
                    <Image
                      src={t.avatar}
                      alt={t.customerName}
                      width={52}
                      height={52}
                      className="h-13 w-13 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-ink">
                      {t.customerName}
                    </p>
                    <p className="text-sm text-ink/60">{t.location}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < t.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-ink/35"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full glass text-aqua hover:bg-ink/[0.07]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  aria-label={`Review ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === idx ? "w-6 bg-aqua" : "w-2 bg-white/25"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full glass text-aqua hover:bg-ink/[0.07]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
