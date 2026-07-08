"use client";

import { useEffect, useState } from "react";
import { Phone, MessageCircle } from "lucide-react";
import { whatsappHref, callHref } from "@/lib/utils";
import { WHATSAPP_DEFAULT_MSG } from "@/lib/site";

/** Floating WhatsApp + call actions, always reachable on every scroll. */
export default function FloatingActions({
  phone,
  whatsapp,
}: {
  phone: string;
  whatsapp: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <a
        href={callHref(phone)}
        aria-label="Call Happy Aquarium"
        className="glass-strong flex h-12 w-12 items-center justify-center rounded-full text-aqua transition-transform hover:scale-110"
      >
        <Phone className="h-5 w-5" />
      </a>
      <a
        href={whatsappHref(whatsapp, WHATSAPP_DEFAULT_MSG)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-6px_rgba(37,211,102,0.7)] transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
        <MessageCircle className="relative h-6 w-6" />
      </a>
    </div>
  );
}
