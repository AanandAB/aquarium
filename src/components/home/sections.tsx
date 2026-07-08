import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Clock, Navigation, BookOpen } from "lucide-react";
import type { FishCard as FishCardType, ProductCard as ProductCardType } from "@/lib/queries";
import type { Category, GalleryItem, BlogPost, SiteSettings } from "@/db/schema";
import { FishCard } from "@/components/cards/FishCard";
import { ProductCard } from "@/components/cards/ProductCard";
import { Reveal } from "@/components/ui/Reveal";
import { Container, SectionHeading, Button } from "@/components/ui/primitives";

/* --------------------------- Section shell --------------------------- */
export function SectionShell({
  id, eyebrow, title, subtitle, viewAll, children, tint,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  viewAll?: { href: string; label: string };
  children: React.ReactNode;
  tint?: boolean;
}) {
  return (
    <section id={id} className={`relative py-16 sm:py-24 ${tint ? "bg-paper-2/60" : ""}`}>
      <Container>
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} align="left" />
            {viewAll && (
              <Link
                href={viewAll.href}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:text-clay"
              >
                {viewAll.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </Reveal>
        {children}
      </Container>
    </section>
  );
}

/* ------------------------------ Fish rail ---------------------------- */
export function FishRail({
  title, subtitle, eyebrow, fish, whatsapp, tint,
}: {
  title: string; subtitle?: string; eyebrow?: string;
  fish: FishCardType[]; whatsapp: string; tint?: boolean;
}) {
  if (!fish.length) return null;
  return (
    <SectionShell eyebrow={eyebrow} title={title} subtitle={subtitle}
      viewAll={{ href: "/fish", label: "View all fish" }} tint={tint}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {fish.map((f, i) => (
          <Reveal key={f.id} delay={(i % 4) * 0.06}>
            <FishCard fish={f} whatsapp={whatsapp} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* --------------------------- Category grid --------------------------- */
export function CategoryGrid({
  title, subtitle, eyebrow, categories,
}: {
  title: string; subtitle?: string; eyebrow?: string; categories: Category[];
}) {
  if (!categories.length) return null;
  return (
    <SectionShell eyebrow={eyebrow} title={title} subtitle={subtitle} tint>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {categories.map((c, i) => (
          <Reveal key={c.id} delay={(i % 4) * 0.05}>
            <Link
              href={`/fish?category=${c.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-[#fffdf8] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(34,29,22,0.5)]"
            >
              <div className="relative aspect-[5/4] overflow-hidden">
                {c.image && (
                  <Image
                    src={c.image}
                    alt={c.name}
                    fill
                    sizes="(max-width:768px) 45vw, 280px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-4">
                <span className="text-xl">{c.icon}</span>
                <h3 className="mt-1 font-display text-lg font-medium text-ink group-hover:text-teal">
                  {c.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/55">
                  {c.description}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ------------------------- Accessories rail -------------------------- */
export function AccessoryRail({
  title, subtitle, eyebrow, products, whatsapp,
}: {
  title: string; subtitle?: string; eyebrow?: string;
  products: ProductCardType[]; whatsapp: string;
}) {
  if (!products.length) return null;
  return (
    <SectionShell eyebrow={eyebrow} title={title} subtitle={subtitle}
      viewAll={{ href: "/accessories", label: "Shop accessories" }}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-6">
        {products.map((p, i) => (
          <Reveal key={p.id} delay={(i % 4) * 0.06}>
            <ProductCard product={p} whatsapp={whatsapp} />
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* --------------------------- Gallery mosaic -------------------------- */
export function GalleryMosaic({
  title, subtitle, eyebrow, items,
}: {
  title: string; subtitle?: string; eyebrow?: string; items: GalleryItem[];
}) {
  if (!items.length) return null;
  return (
    <SectionShell eyebrow={eyebrow} title={title} subtitle={subtitle}
      viewAll={{ href: "/gallery", label: "Full gallery" }} tint>
      <div className="columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {items.map((g, i) => (
          <Reveal key={g.id} delay={(i % 3) * 0.05}>
            <Link href="/gallery" className="group relative block overflow-hidden rounded-2xl border border-ink/10">
              <Image
                src={g.thumbnailUrl ?? g.url}
                alt={g.title ?? "Aquarium gallery image"}
                width={500}
                height={i % 2 ? 620 : 400}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {g.title && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm font-medium text-paper">{g.title}</p>
                </div>
              )}
            </Link>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ---------------------------- Articles rail -------------------------- */
export function ArticlesRail({
  title, subtitle, eyebrow, posts,
}: {
  title: string; subtitle?: string; eyebrow?: string;
  posts: (BlogPost & { categoryName?: string | null })[];
}) {
  if (!posts.length) return null;
  return (
    <SectionShell eyebrow={eyebrow} title={title} subtitle={subtitle}
      viewAll={{ href: "/blog", label: "All articles" }}>
      <div className="grid gap-6 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.id} delay={i * 0.08}>
            <Link href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-[#fffdf8] transition-all hover:-translate-y-1 hover:shadow-[0_30px_60px_-40px_rgba(34,29,22,0.5)]">
              {post.coverImage && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image src={post.coverImage} alt={post.title} fill
                    sizes="(max-width:768px) 90vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
              )}
              <div className="flex flex-1 flex-col p-5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">
                  <BookOpen className="h-3.5 w-3.5" />
                  {post.categoryName ?? "Article"}
                  {post.readTime ? ` · ${post.readTime} min` : ""}
                </span>
                <h3 className="mt-2 font-display text-xl font-medium leading-snug text-ink group-hover:text-teal">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/60">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ------------------------------ Map ---------------------------------- */
export function MapSection({
  title, subtitle, eyebrow, settings,
}: {
  title: string; subtitle?: string; eyebrow?: string; settings: SiteSettings | null;
}) {
  const addr = [settings?.addressLine, settings?.area, settings?.city, settings?.state, settings?.pincode]
    .filter(Boolean).join(", ");
  return (
    <SectionShell eyebrow={eyebrow} title={title} subtitle={subtitle} tint>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="rounded-2xl border border-ink/10 bg-[#fffdf8] p-7">
          <ul className="space-y-5 text-sm text-ink/75">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
              <span>{addr || "Near Eye Hospital, Kuthuparamba, Kerala"}</span>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
              <span>Mon–Sat 9:00 AM – 8:00 PM · Sun 10:00 AM – 6:00 PM</span>
            </li>
          </ul>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button href={settings?.directionsUrl ?? "https://www.google.com/maps/dir/?api=1&destination=Kuthuparamba,Kerala"} external>
              <Navigation className="h-4 w-4" /> Get Directions
            </Button>
            <Button href="/contact" variant="outline">Contact &amp; Enquiry</Button>
          </div>
        </Reveal>
        <Reveal className="overflow-hidden rounded-2xl border border-ink/10" delay={0.1}>
          <iframe
            title="Happy Aquarium location"
            src={settings?.mapEmbedUrl ?? "https://www.google.com/maps?q=Kuthuparamba,Kerala&output=embed"}
            className="h-full min-h-[340px] w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      </div>
    </SectionShell>
  );
}
