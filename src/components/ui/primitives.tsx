import Link from "next/link";
import { cn } from "@/lib/utils";

/* ----------------------------- Container ----------------------------- */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/* ------------------------------ Button ------------------------------- */
type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "ghost" | "coral" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/50 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

const variants: Record<string, string> = {
  // warm terracotta — primary call to action
  primary:
    "bg-clay text-paper shadow-[0_10px_26px_-12px_rgba(180,85,46,0.7)] hover:bg-clay-2 hover:-translate-y-0.5",
  coral:
    "bg-clay text-paper shadow-[0_10px_26px_-12px_rgba(180,85,46,0.7)] hover:bg-clay-2 hover:-translate-y-0.5",
  // deep pine ink outline
  outline:
    "border border-ink/25 text-ink hover:border-ink/50 hover:bg-ink/[0.04]",
  ghost:
    "bg-ink/[0.04] text-ink hover:bg-ink/[0.08]",
};

const sizes: Record<string, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-[15px]",
};

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  external,
  ariaLabel,
}: ButtonProps) {
  const cls = cn(base, variants[variant], sizes[size], className);
  if (href) {
    if (external || href.startsWith("http") || href.startsWith("tel")) {
      return (
        <a
          href={href}
          aria-label={ariaLabel}
          target={href.startsWith("http") ? "_blank" : undefined}
          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
          className={cls}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} aria-label={ariaLabel} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button aria-label={ariaLabel} className={cls}>
      {children}
    </button>
  );
}

/* ------------------------------ Badge -------------------------------- */
export function Badge({
  children,
  tone = "aqua",
  className,
}: {
  children: React.ReactNode;
  tone?: "aqua" | "coral" | "green" | "amber" | "muted";
  className?: string;
}) {
  const tones: Record<string, string> = {
    aqua: "border-teal/30 text-teal bg-teal/[0.06]",
    coral: "border-clay/40 text-clay bg-clay/[0.07]",
    green: "border-emerald-600/30 text-emerald-700 bg-emerald-600/[0.07]",
    amber: "border-amber-600/30 text-amber-700 bg-amber-600/[0.08]",
    muted: "border-ink/15 text-ink/60 bg-ink/[0.04]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/* -------------------------- Section Heading -------------------------- */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "eyebrow mb-3 flex items-center gap-2",
            align === "center" && "justify-center",
          )}
        >
          <span className="h-px w-6 bg-clay/50" />
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-[2rem] font-medium leading-[1.05] text-ink sm:text-4xl md:text-[2.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-ink/60 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
