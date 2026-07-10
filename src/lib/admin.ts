import { redirect } from "next/navigation";
import { and, count, desc, eq, getTableColumns, lte, or } from "drizzle-orm";
import { getDb } from "@/db";
import * as s from "@/db/schema";
import { getSession, roleAtLeast, type Session } from "@/lib/auth";

/** Guard: returns the session or redirects to the login page. */
export async function requireAdmin(
  min: Session["role"] = "viewer",
): Promise<Session> {
  const session = await getSession();
  if (!session || !roleAtLeast(session.role, min)) {
    redirect("/admin/login");
  }
  return session;
}

export async function getDashboardStats() {
  const db = getDb();
  const [
    fishCount,
    productCount,
    newEnquiries,
    totalEnquiries,
    postCount,
    testimonialCount,
    lowStock,
    recent,
  ] = await Promise.all([
    db.select({ c: count() }).from(s.fish),
    db.select({ c: count() }).from(s.products),
    db
      .select({ c: count() })
      .from(s.enquiries)
      .where(eq(s.enquiries.status, "new")),
    db.select({ c: count() }).from(s.enquiries),
    db.select({ c: count() }).from(s.blogPosts),
    db.select({ c: count() }).from(s.testimonials),
    db
      .select({
        id: s.fish.id,
        name: s.fish.name,
        slug: s.fish.slug,
        stock: s.fish.stock,
        availability: s.fish.availability,
      })
      .from(s.fish)
      .where(or(lte(s.fish.stock, 10), eq(s.fish.availability, "out_of_stock")))
      .orderBy(s.fish.stock)
      .limit(8),
    db
      .select()
      .from(s.enquiries)
      .orderBy(desc(s.enquiries.createdAt))
      .limit(6),
  ]);

  return {
    counts: {
      fish: fishCount[0]?.c ?? 0,
      products: productCount[0]?.c ?? 0,
      newEnquiries: newEnquiries[0]?.c ?? 0,
      totalEnquiries: totalEnquiries[0]?.c ?? 0,
      posts: postCount[0]?.c ?? 0,
      testimonials: testimonialCount[0]?.c ?? 0,
    },
    lowStock,
    recent,
  };
}

export async function listFishAdmin() {
  const db = getDb();
  return db
    .select({
      ...getTableColumns(s.fish),
      categoryName: s.categories.name,
    })
    .from(s.fish)
    .leftJoin(s.categories, eq(s.fish.categoryId, s.categories.id))
    .orderBy(desc(s.fish.updatedAt));
}

export async function getFishByIdAdmin(id: string) {
  const db = getDb();
  const [row] = await db.select().from(s.fish).where(eq(s.fish.id, id)).limit(1);
  return row ?? null;
}

export async function listProductsAdmin() {
  const db = getDb();
  return db
    .select({
      ...getTableColumns(s.products),
      categoryName: s.categories.name,
    })
    .from(s.products)
    .leftJoin(s.categories, eq(s.products.categoryId, s.categories.id))
    .orderBy(desc(s.products.updatedAt));
}

export async function listEnquiriesAdmin(status?: string) {
  const db = getDb();
  const q = db.select().from(s.enquiries).$dynamic();
  if (status && status !== "all") {
    return q
      .where(eq(s.enquiries.status, status as never))
      .orderBy(desc(s.enquiries.createdAt));
  }
  return q.orderBy(desc(s.enquiries.createdAt));
}

export async function getFishCategoriesAdmin() {
  const db = getDb();
  return db
    .select({ id: s.categories.id, name: s.categories.name, slug: s.categories.slug })
    .from(s.categories)
    .where(eq(s.categories.kind, "fish"))
    .orderBy(s.categories.sortOrder);
}

export async function getProductCategoriesAdmin() {
  const db = getDb();
  return db
    .select({ id: s.categories.id, name: s.categories.name, slug: s.categories.slug })
    .from(s.categories)
    .where(eq(s.categories.kind, "product"))
    .orderBy(s.categories.sortOrder);
}

export async function listBlogAdmin() {
  const db = getDb();
  return db
    .select({
      ...getTableColumns(s.blogPosts),
      categoryName: s.categories.name,
    })
    .from(s.blogPosts)
    .leftJoin(s.categories, eq(s.blogPosts.categoryId, s.categories.id))
    .orderBy(desc(s.blogPosts.updatedAt));
}

export async function getBlogCategoriesAdmin() {
  const db = getDb();
  return db
    .select({ id: s.categories.id, name: s.categories.name, slug: s.categories.slug })
    .from(s.categories)
    .where(eq(s.categories.kind, "blog"))
    .orderBy(s.categories.sortOrder);
}

export async function listTestimonialsAdmin() {
  const db = getDb();
  return db.select().from(s.testimonials).orderBy(s.testimonials.sortOrder);
}

export async function getSiteSettingsRow() {
  const db = getDb();
  const [row] = await db.select().from(s.siteSettings).limit(1);
  return row ?? null;
}

export async function listHomepageSectionsAdmin() {
  const db = getDb();
  return db.select().from(s.homepageSections).orderBy(s.homepageSections.sortOrder);
}

export async function getHomepageSectionById(id: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(s.homepageSections)
    .where(eq(s.homepageSections.id, id))
    .limit(1);
  return row ?? null;
}

export async function listOffersAdmin() {
  const db = getDb();
  return db.select().from(s.offers).orderBy(s.offers.sortOrder);
}

export async function getOfferById(id: string) {
  const db = getDb();
  const [row] = await db.select().from(s.offers).where(eq(s.offers.id, id)).limit(1);
  return row ?? null;
}

export async function getProductByIdAdmin(id: string) {
  const db = getDb();
  const [row] = await db.select().from(s.products).where(eq(s.products.id, id)).limit(1);
  return row ?? null;
}

export async function getPostByIdAdmin(id: string) {
  const db = getDb();
  const [row] = await db.select().from(s.blogPosts).where(eq(s.blogPosts.id, id)).limit(1);
  return row ?? null;
}

export async function listGalleryAdmin() {
  const db = getDb();
  return db.select().from(s.galleryItems).orderBy(s.galleryItems.sortOrder);
}

export async function getGalleryItemByIdAdmin(id: string) {
  const db = getDb();
  const [row] = await db.select().from(s.galleryItems).where(eq(s.galleryItems.id, id)).limit(1);
  return row ?? null;
}

export async function getTestimonialByIdAdmin(id: string) {
  const db = getDb();
  const [row] = await db.select().from(s.testimonials).where(eq(s.testimonials.id, id)).limit(1);
  return row ?? null;
}

export async function listCategoriesAdmin() {
  const db = getDb();
  const cats = await db
    .select()
    .from(s.categories)
    .orderBy(s.categories.sortOrder);
  const [fishCounts, productCounts, blogCounts] = await Promise.all([
    db
      .select({ id: s.fish.categoryId, c: count() })
      .from(s.fish)
      .groupBy(s.fish.categoryId),
    db
      .select({ id: s.products.categoryId, c: count() })
      .from(s.products)
      .groupBy(s.products.categoryId),
    db
      .select({ id: s.blogPosts.categoryId, c: count() })
      .from(s.blogPosts)
      .groupBy(s.blogPosts.categoryId),
  ]);
  const counts = new Map<string, number>();
  for (const r of [...fishCounts, ...productCounts, ...blogCounts]) {
    if (r.id) counts.set(r.id, (counts.get(r.id) ?? 0) + Number(r.c));
  }
  return cats.map((c) => ({ ...c, itemCount: counts.get(c.id) ?? 0 }));
}

export async function getCategoryByIdAdmin(id: string) {
  const db = getDb();
  const [row] = await db.select().from(s.categories).where(eq(s.categories.id, id)).limit(1);
  return row ?? null;
}

export async function listFaqsAdmin() {
  const db = getDb();
  return db.select().from(s.faqs).orderBy(s.faqs.sortOrder);
}

export async function getFaqByIdAdmin(id: string) {
  const db = getDb();
  const [row] = await db.select().from(s.faqs).where(eq(s.faqs.id, id)).limit(1);
  return row ?? null;
}
