"use client";

import { useState } from "react";
import { Send, Check, MessageCircle } from "lucide-react";
import { whatsappHref } from "@/lib/utils";
import { WHATSAPP_DEFAULT_MSG } from "@/lib/site";

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-ink/15 bg-ink/5 px-4 py-3 text-sm text-ink placeholder:text-ink/45 focus:border-aqua/60 focus:outline-none";

export function ContactForm({ whatsapp }: { whatsapp: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = phone.trim().length > 0 || email.trim().length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) {
      setError("Please provide a phone number or email so we can reach you.");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "enquiry",
          name: name.trim() || undefined,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          message: message.trim() || undefined,
          source: "contact",
        }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="glass-strong rounded-3xl p-7">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-6">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-700">
            <Check className="h-6 w-6" />
          </span>
          <p className="text-lg font-medium text-emerald-200">
            Thanks! We&rsquo;ll get back to you shortly.
          </p>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-sm text-aqua hover:text-turquoise"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-3xl p-7">
      <h2 className="text-2xl font-semibold text-ink">Send an enquiry</h2>
      <p className="mt-2 text-sm text-ink/60">
        Fill in the form and we&rsquo;ll reach out. Prefer to chat instantly?
      </p>
      <a
        href={whatsappHref(whatsapp, WHATSAPP_DEFAULT_MSG)}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-coral-soft hover:text-coral"
      >
        <MessageCircle className="h-4 w-4" />
        Message us on WhatsApp
      </a>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-ink/75">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
            autoComplete="name"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm text-ink/75">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className={inputClass}
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm text-ink/75">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="message" className="mb-1.5 block text-sm text-ink/75">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you're looking for…"
            className={inputClass}
          />
        </div>

        {status === "error" && error && (
          <p className="rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral-soft">
            {error}
          </p>
        )}

        <p className="text-xs text-ink/45">
          Please provide at least a phone number or an email.
        </p>

        <button
          type="submit"
          disabled={status === "loading" || !canSubmit}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-aqua to-turquoise px-6 py-3 text-sm font-medium text-paper transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {status === "loading" ? (
            "Sending…"
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send enquiry
            </>
          )}
        </button>
      </form>
    </div>
  );
}
