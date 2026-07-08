"use client";

/**
 * Light editorial "paper" backdrop: a warm bone canvas with a faint contour /
 * water-line motif at the top and a soft sand wash at the foot of the page,
 * plus a subtle paper grain. Calm and static — no neon, no bubbles.
 */
export default function OceanBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* warm paper base + gentle vignette */}
      <div className="absolute inset-0 bg-paper" />
      <div className="absolute inset-x-0 top-0 h-[60vh] bg-[radial-gradient(1100px_520px_at_50%_-15%,rgba(18,82,74,0.08),transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-[#efe6d3] to-transparent" />

      {/* faint contour / depth lines */}
      <svg
        className="absolute inset-x-0 top-0 h-[46vh] w-full opacity-[0.5]"
        preserveAspectRatio="none"
        viewBox="0 0 1440 600"
        fill="none"
      >
        {Array.from({ length: 7 }).map((_, i) => (
          <path
            key={i}
            d={`M0 ${70 + i * 70} C 360 ${40 + i * 70}, 1080 ${120 + i * 70}, 1440 ${70 + i * 70}`}
            stroke="rgba(18,82,74,0.12)"
            strokeWidth="1"
          />
        ))}
      </svg>

      {/* paper grain */}
      <div
        className="absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.045'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
