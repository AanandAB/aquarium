/**
 * Seed script — populates the local (or remote) Cloudflare D1 database with
 * all content: 35 fish, categories, accessories, blog, offers, testimonials,
 * FAQs, gallery, planner presets, nav, homepage layout, a compatibility
 * matrix and a default admin user.
 *
 * Run: npm run db:seed:local   (uses wrangler getPlatformProxy -> local D1)
 */
import { getPlatformProxy } from "wrangler";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../src/db/schema";
import { hashPassword } from "../src/lib/password";
import { allCategories } from "../src/db/seed/data-categories";
import { fishA } from "../src/db/seed/data-fish-a";
import { fishB } from "../src/db/seed/data-fish-b";
import { fishC } from "../src/db/seed/data-fish-c";
import type { FishSeed } from "../src/db/seed/fish-helpers";
import { products as productSeeds } from "../src/db/seed/data-products";
import { blogPosts as blogSeeds } from "../src/db/seed/data-blog";
import { img, gallery } from "../src/db/seed/images";
import {
  siteSettings,
  homepageSections,
  offers,
  testimonials,
  faqs,
  navItems,
  galleryItems,
  plannerPresets,
} from "../src/db/seed/data-content";

const uid = () => crypto.randomUUID();

async function main() {
  const { env, dispose } = await getPlatformProxy<{ DB: D1Database }>();
  const db = drizzle(env.DB, { schema });

  console.log("Clearing existing content…");
  for (const t of [
    schema.fishCompatibility,
    schema.fish,
    schema.products,
    schema.blogPosts,
    schema.categories,
    schema.offers,
    schema.testimonials,
    schema.faqs,
    schema.navItems,
    schema.galleryItems,
    schema.plannerPresets,
    schema.homepageSections,
    schema.siteSettings,
  ]) {
    await db.delete(t);
  }

  /* ---- Categories (pre-generate ids -> slug map) ---- */
  const catId: Record<string, string> = {};
  const catRows = allCategories.map((c) => {
    const id = uid();
    catId[`${c.kind}:${c.slug}`] = id;
    return { ...c, id };
  });
  for (const row of catRows) await db.insert(schema.categories).values(row);
  console.log(`Inserted ${catRows.length} categories`);

  /* ---- Fish ---- */
  const allFish: FishSeed[] = [...fishA, ...fishB, ...fishC];
  const fishId: Record<string, string> = {};
  for (const f of allFish) {
    const id = uid();
    fishId[f.slug] = id;
    const stock = f.stock ?? 0;
    await db.insert(schema.fish).values({
      id,
      slug: f.slug,
      name: f.name,
      scientificName: f.sci,
      categoryId: catId[`fish:${f.cat}`],
      shortDescription: f.short,
      description: f.desc ?? f.short,
      careGuide: f.care,
      origin: f.origin,
      temperatureMin: f.t?.[0],
      temperatureMax: f.t?.[1],
      phMin: f.ph?.[0],
      phMax: f.ph?.[1],
      difficulty: f.diff ?? "beginner",
      aggression: f.agg ?? "peaceful",
      waterType: f.water ?? "freshwater",
      tankSizeMin: f.tank,
      adultSize: f.size,
      lifespan: f.life,
      diet: f.diet,
      compatibility: f.compat,
      price: f.price,
      offerPrice: f.offer,
      stock,
      availability: f.avail ?? (stock === 0 ? "out_of_stock" : "available"),
      varieties: f.varieties,
      heroImage: img(f.kw, f.lock),
      gallery: gallery(f.kw, f.lock * 7, 4),
      video: null,
      featured: f.feat ?? false,
      trending: f.trend ?? false,
      isImported: f.imp ?? false,
      isNewArrival: f.nw ?? false,
      tags: f.tags,
      published: true,
      metaTitle: `${f.name} for sale — Happy Aquarium, Kerala`,
      metaDescription: f.short,
    });
  }
  console.log(`Inserted ${allFish.length} fish`);

  /* ---- Products ---- */
  for (const p of productSeeds) {
    const stock = p.stock ?? 0;
    await db.insert(schema.products).values({
      id: uid(),
      slug: p.slug,
      name: p.name,
      categoryId: catId[`product:${p.cat}`],
      sku: p.sku,
      brand: p.brand,
      shortDescription: p.short,
      description: p.desc ?? p.short,
      specs: p.specs,
      price: p.price,
      offerPrice: p.offer,
      stock,
      availability: p.avail ?? (stock === 0 ? "out_of_stock" : "available"),
      heroImage: img(p.kw, p.lock),
      gallery: gallery(p.kw, p.lock * 7, 3),
      featured: p.feat ?? false,
      trending: p.trend ?? false,
      isImported: p.imp ?? false,
      isNewArrival: p.nw ?? false,
      tags: p.tags,
      published: true,
      metaTitle: `${p.name} — Happy Aquarium`,
      metaDescription: p.short,
    });
  }
  console.log(`Inserted ${productSeeds.length} products`);

  /* ---- Blog posts ---- */
  for (const b of blogSeeds) {
    await db.insert(schema.blogPosts).values({
      id: uid(),
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      content: b.content,
      coverImage: img(b.kw, b.lock, 1200, 675),
      categoryId: catId[`blog:${b.cat}`],
      tags: b.tags,
      author: "Happy Aquarium",
      status: "published",
      readTime: b.readTime,
      publishedAt: new Date(),
      featured: b.featured ?? false,
      metaTitle: b.title,
      metaDescription: b.excerpt,
    });
  }
  console.log(`Inserted ${blogSeeds.length} blog posts`);

  /* ---- Site settings (singleton) ---- */
  await db.insert(schema.siteSettings).values(siteSettings);

  /* ---- Homepage sections ---- */
  for (const s of homepageSections)
    await db.insert(schema.homepageSections).values({ id: uid(), ...s });

  /* ---- Offers ---- */
  for (const o of offers) await db.insert(schema.offers).values({ id: uid(), ...o });

  /* ---- Testimonials ---- */
  for (const t of testimonials)
    await db.insert(schema.testimonials).values({ id: uid(), ...t });

  /* ---- FAQs ---- */
  for (const f of faqs) await db.insert(schema.faqs).values({ id: uid(), ...f });

  /* ---- Nav ---- */
  for (const n of navItems)
    await db.insert(schema.navItems).values({ id: uid(), ...n });

  /* ---- Gallery ---- */
  for (const g of galleryItems)
    await db.insert(schema.galleryItems).values({ id: uid(), ...g });

  /* ---- Planner presets (resolve fish slugs -> ids) ---- */
  for (const p of plannerPresets) {
    const { fishSlugs, ...rest } = p;
    await db.insert(schema.plannerPresets).values({
      id: uid(),
      ...rest,
      fishIds: fishSlugs.map((s) => fishId[s]).filter(Boolean),
    });
  }
  console.log(
    `Inserted homepage(${homepageSections.length}), offers(${offers.length}), testimonials(${testimonials.length}), faqs(${faqs.length}), nav(${navItems.length}), gallery(${galleryItems.length}), planner(${plannerPresets.length})`,
  );

  /* ---- Compatibility matrix (curated pairs) ---- */
  const pairs: [string, string, "compatible" | "semi" | "incompatible", string][] = [
    ["guppy", "molly", "compatible", "Both peaceful livebearers — a classic community mix."],
    ["guppy", "tiger-oscar", "incompatible", "Oscars will eat guppies."],
    ["cardinal-tetra", "corydoras", "compatible", "Perfect peaceful planted-tank companions."],
    ["betta-fighter", "guppy", "semi", "Bettas may nip colourful guppy tails — watch closely."],
    ["tiger-oscar", "red-parrot", "semi", "Possible in a large tank with careful monitoring."],
    ["angel-fish-breeding", "cardinal-tetra", "semi", "Angels may eat very small tetras when grown."],
    ["koi-carp", "oranda-goldfish", "compatible", "Both coldwater — great pond/large-tank mates."],
    ["flowerhorn-thailand", "guppy", "incompatible", "Flowerhorns are highly aggressive and predatory."],
    ["dwarf-gourami", "cardinal-tetra", "compatible", "A gentle, colourful community pairing."],
    ["rainbow-shark", "corydoras", "semi", "Rainbow sharks can be territorial with bottom dwellers."],
    ["zebra-fish", "guppy", "compatible", "Active, peaceful and hardy together."],
    ["black-ghost-fish", "cardinal-tetra", "incompatible", "Ghost knives eat small fish at night."],
  ];
  for (const [a, b, level, note] of pairs) {
    if (!fishId[a] || !fishId[b]) continue;
    await db.insert(schema.fishCompatibility).values({
      id: uid(),
      fishAId: fishId[a],
      fishBId: fishId[b],
      level,
      note,
    });
  }
  console.log(`Inserted ${pairs.length} compatibility pairs`);

  /* ---- Default admin user ---- */
  await db.delete(schema.users);
  await db.insert(schema.users).values({
    id: uid(),
    email: "admin@happyaquarium.in",
    name: "Store Admin",
    passwordHash: await hashPassword("admin123"),
    role: "admin",
    active: true,
  });
  console.log("Inserted default admin (admin@happyaquarium.in / admin123)");

  await dispose();
  console.log("\n✅ Seed complete.");
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
