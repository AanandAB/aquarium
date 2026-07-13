"use client";

import { useEffect, useRef } from "react";

/**
 * Instagram feed section using LightWidget (free tier, auto-refreshing).
 *
 * Setup: sign up at https://lightwidget.com → connect your Instagram →
 * get the widget token from Settings → paste it as INSTAGRAM_WIDGET_TOKEN.
 * Posts appear automatically, no rebuild needed.
 */
export default function InstagramFeed({ token }: { token: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token || !ref.current) return;

    // LightWidget injects an iframe into the target element
    const scriptId = "lightwidget-script";
    if (document.getElementById(scriptId)) return; // already loaded

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
    script.async = true;
    script.onload = () => {
      // LightWidget exposes a global — call its init
      if (typeof (window as any).lightwidget_init === "function") {
        (window as any).lightwidget_init({ token });
      }
    };
    document.body.appendChild(script);

    return () => {
      // cleanup: remove iframe + script on unmount (SPA navigation)
      const el = document.getElementById(scriptId);
      if (el) el.remove();
      const frame = document.querySelector('iframe[src*="lightwidget"]');
      if (frame) frame.remove();
    };
  }, [token]);

  if (!token) return null;

  return (
    <div ref={ref} className="lightwidget-widget" style={{ width: "100%", minHeight: 300 }} />
  );
}
