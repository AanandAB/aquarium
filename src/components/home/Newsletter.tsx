"use client";

import { useState } from "react";
import { Send, Check } from "lucide-react";
import { Container } from "@/components/ui/primitives";

export default function Newsletter({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "newsletter", email, source: "newsletter" }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] glass-strong px-6 py-12 text-center sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-aqua/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-turquoise/20 blur-3xl" />
          <h2 className="relative text-3xl font-semibold text-ink sm:text-4xl">
            {title}
          </h2>
          {subtitle && (
            <p className="relative mx-auto mt-3 max-w-md text-ink/70">
              {subtitle}
            </p>
          )}

          {state === "done" ? (
            <p className="relative mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-emerald-400/15 px-5 py-3 text-sm text-emerald-700">
              <Check className="h-4 w-4" /> You&apos;re subscribed — welcome aboard!
            </p>
          ) : (
            <form
              onSubmit={submit}
              className="relative mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 rounded-full border border-ink/15 bg-ink/5 px-5 py-3.5 text-sm text-ink placeholder:text-ink/45 focus:border-aqua/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={state === "loading"}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-aqua to-turquoise px-6 py-3.5 text-sm font-semibold text-paper transition-transform hover:scale-105 disabled:opacity-60"
              >
                {state === "loading" ? "Subscribing…" : "Subscribe"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
          {state === "error" && (
            <p className="relative mt-3 text-sm text-rose-600">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
