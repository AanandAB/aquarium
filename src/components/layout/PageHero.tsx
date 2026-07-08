import { Container } from "@/components/ui/primitives";
import Link from "next/link";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  breadcrumb?: { label: string; href?: string }[];
}) {
  return (
    <section className="relative pt-32 pb-10 sm:pt-36 sm:pb-14">
      <Container>
        {breadcrumb && (
          <nav aria-label="Breadcrumb" className="mb-5 text-xs text-ink/50">
            {breadcrumb.map((b, i) => (
              <span key={i}>
                {b.href ? (
                  <Link href={b.href} className="hover:text-clay">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-ink/75">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && (
                  <span className="mx-2 text-ink/30">/</span>
                )}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <span className="eyebrow mb-4 flex items-center gap-2">
            <span className="h-px w-6 bg-clay/50" />
            {eyebrow}
          </span>
        )}
        <h1 className="max-w-4xl font-display text-4xl font-medium leading-[1.03] tracking-tight text-ink sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/65">
            {subtitle}
          </p>
        )}
        <div className="mt-10 rule" />
      </Container>
    </section>
  );
}
