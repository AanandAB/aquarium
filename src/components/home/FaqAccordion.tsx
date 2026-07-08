"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Container, SectionHeading } from "@/components/ui/primitives";

type Faq = { id: string; question: string; answer: string };

export default function FaqAccordion({
  title,
  subtitle,
  faqs,
}: {
  title: string;
  subtitle?: string;
  faqs: Faq[];
}) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  if (!faqs.length) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <div className="mb-10">
          <SectionHeading eyebrow="FAQ" title={title} subtitle={subtitle} />
        </div>
        <div className="space-y-3">
          {faqs.map((f) => {
            const isOpen = open === f.id;
            return (
              <div key={f.id} className="overflow-hidden rounded-2xl glass">
                <button
                  onClick={() => setOpen(isOpen ? null : f.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-medium text-ink">
                    {f.question}
                  </span>
                  <Plus
                    className={`h-5 w-5 shrink-0 text-aqua transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-ink/75">
                      {f.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
