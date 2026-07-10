"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/utils";
import { WHATSAPP_DEFAULT_MSG } from "@/lib/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero({
  storeName,
  tagline,
  badges,
  whatsapp,
}: {
  storeName: string;
  tagline: string;
  badges: string[];
  whatsapp: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.to(plate.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  const words = tagline.trim().split(" ");
  const lead = words.slice(0, -1).join(" ");
  const last = words[words.length - 1];

  return (
    <section ref={root} className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* Copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow flex items-center gap-2"
          >
            <span className="h-px w-8 bg-clay/60" />
            {storeName} · Kuthuparamba, Kerala
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-5xl font-medium leading-[1.02] tracking-tight text-ink sm:text-6xl md:text-7xl"
          >
            {lead}{" "}
            <em className="font-normal italic text-teal">{last}</em>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink/65"
          >
            A curated collection of aquarium &amp; imported fish, tanks, live
            plants and everything you need — hand-raised and cared for in Kerala.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <a
              href="/fish"
              className="inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-[15px] font-medium text-paper shadow-[0_12px_30px_-14px_rgba(180,85,46,0.8)] transition-all hover:-translate-y-0.5 hover:bg-clay-2"
            >
              Explore the collection <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={whatsappHref(whatsapp, WHATSAPP_DEFAULT_MSG)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-ink/25 px-7 py-3.5 text-[15px] font-medium text-ink transition-colors hover:border-ink/50 hover:bg-ink/[0.04]"
            >
              <MessageCircle className="h-4 w-4 text-teal" /> WhatsApp us
            </a>
          </motion.div>

          {/* Meta row */}
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-ink/10 pt-6"
          >
            {badges.map((b, i) => (
              <li key={i} className="text-sm text-ink/70">
                <span className="mr-2 font-num font-semibold text-clay">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {b}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Documentary photo plate */}
        <motion.figure
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[1.5rem] border border-ink/10 bg-[#fffdf8] p-2 shadow-[0_40px_80px_-50px_rgba(34,29,22,0.5)]">
            <div ref={plate} className="relative aspect-[4/5] overflow-hidden rounded-[1rem]">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/a/a8/Amaterske_akvarium.jpg"
                alt="A display aquarium at Happy Aquarium"
                fill
                priority
                sizes="(max-width:1024px) 90vw, 520px"
                className="scale-105 object-cover"
              />
            </div>
          </div>
          <figcaption className="fig-label mt-3 flex items-center justify-between">
            <span>Fig. 01 — From our display tanks</span>
            <span className="text-clay">Live inventory</span>
          </figcaption>
          <div className="animate-floaty absolute -left-4 -top-4 hidden rounded-2xl border border-ink/10 bg-[#fffdf8] px-4 py-3 shadow-lg sm:block">
            <p className="font-display text-2xl font-semibold text-teal">35+</p>
            <p className="text-[11px] text-ink/60">species in stock</p>
          </div>
        </motion.figure>
      </div>
    </section>
  );
}
