import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

/* -------------------------------------------------------------------------- */
/*  Shared helpers & enum vocabularies (single source of truth for forms)     */
/* -------------------------------------------------------------------------- */

const pk = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
};

const seoColumns = {
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  keywords: text("keywords"),
  ogImage: text("og_image"),
  canonical: text("canonical"),
  noindex: integer("noindex", { mode: "boolean" }).notNull().default(false),
};

export const CATEGORY_KINDS = ["fish", "product", "blog"] as const;
export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
] as const;
export const AGGRESSION_LEVELS = [
  "peaceful",
  "semi_aggressive",
  "aggressive",
] as const;
export const WATER_TYPES = ["freshwater", "brackish", "marine"] as const;
export const AVAILABILITY = [
  "available",
  "low_stock",
  "out_of_stock",
  "reserved",
] as const;
export const POST_STATUS = ["draft", "published", "scheduled"] as const;
export const OFFER_PLACEMENTS = [
  "hero_strip",
  "homepage_banner",
  "popup",
  "sidebar",
] as const;
export const GALLERY_KINDS = [
  "customer_tank",
  "before_after",
  "showcase",
  "aquascape",
  "store",
] as const;
export const MEDIA_TYPES = ["image", "video"] as const;
export const NAV_LOCATIONS = ["header", "footer", "mega", "mobile"] as const;
export const SECTION_TYPES = [
  "hero",
  "featured_fish",
  "categories",
  "latest_arrivals",
  "offers",
  "popular_fish",
  "accessories",
  "gallery",
  "testimonials",
  "articles",
  "guides",
  "instagram",
  "map",
  "faq",
  "newsletter",
  "custom",
] as const;
export const ENQUIRY_TYPES = [
  "reservation",
  "enquiry",
  "call_request",
  "newsletter",
  "message",
] as const;
export const ENQUIRY_STATUS = [
  "new",
  "contacted",
  "confirmed",
  "completed",
  "cancelled",
] as const;
export const USER_ROLES = ["admin", "manager", "staff", "viewer"] as const;
export const COMPAT_LEVELS = ["compatible", "semi", "incompatible"] as const;
export const EXPERIENCE_LEVELS = ["beginner", "intermediate", "expert"] as const;

/* -------------------------------------------------------------------------- */
/*  JSON payload types                                                        */
/* -------------------------------------------------------------------------- */

export type Variety = {
  name: string;
  price?: number;
  offerPrice?: number;
  image?: string;
  note?: string;
};
export type SpecItem = { label: string; value: string };
export type OpeningHours = Record<
  string,
  { open: string; close: string; closed?: boolean }
>;
export type SocialLinks = {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  whatsapp?: string;
  x?: string;
  maps?: string;
};
export type ThemeConfig = {
  animationIntensity?: "off" | "subtle" | "normal" | "cinematic";
  accent?: string;
};

/* -------------------------------------------------------------------------- */
/*  settings — generic key/value store (misc flags, healthcheck)              */
/* -------------------------------------------------------------------------- */

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

/* -------------------------------------------------------------------------- */
/*  siteSettings — singleton row of store-wide configuration                  */
/* -------------------------------------------------------------------------- */

export const siteSettings = sqliteTable("site_settings", {
  id: text("id").primaryKey().default("default"),
  storeName: text("store_name").notNull().default("Happy Aquarium"),
  tagline: text("tagline"),
  description: text("description"),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  email: text("email"),
  addressLine: text("address_line"),
  area: text("area"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  mapLat: real("map_lat"),
  mapLng: real("map_lng"),
  mapEmbedUrl: text("map_embed_url"),
  directionsUrl: text("directions_url"),
  openingHours: text("opening_hours", { mode: "json" }).$type<OpeningHours>(),
  logo: text("logo"),
  favicon: text("favicon"),
  socials: text("socials", { mode: "json" }).$type<SocialLinks>(),
  gaId: text("ga_id"),
  metaPixel: text("meta_pixel"),
  theme: text("theme", { mode: "json" }).$type<ThemeConfig>(),
  instagramWidgetToken: text("instagram_widget_token"),
  ...seoColumns,
  ...timestamps,
});

/* -------------------------------------------------------------------------- */
/*  categories — fish / product / blog taxonomy (self-referential)            */
/* -------------------------------------------------------------------------- */

export const categories = sqliteTable(
  "categories",
  {
    id: pk(),
    kind: text("kind", { enum: CATEGORY_KINDS }).notNull().default("fish"),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    icon: text("icon"),
    image: text("image"),
    color: text("color"),
    parentId: text("parent_id"),
    sortOrder: integer("sort_order").notNull().default(0),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(true),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [
    index("categories_kind_idx").on(t.kind),
    uniqueIndex("categories_kind_slug_idx").on(t.kind, t.slug),
  ],
);

/* -------------------------------------------------------------------------- */
/*  fish — the core species collection                                        */
/* -------------------------------------------------------------------------- */

export const fish = sqliteTable(
  "fish",
  {
    id: pk(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    scientificName: text("scientific_name"),
    categoryId: text("category_id"),
    shortDescription: text("short_description"),
    description: text("description"),
    careGuide: text("care_guide"),
    origin: text("origin"),
    temperatureMin: real("temperature_min"),
    temperatureMax: real("temperature_max"),
    phMin: real("ph_min"),
    phMax: real("ph_max"),
    difficulty: text("difficulty", { enum: DIFFICULTY_LEVELS }).default(
      "beginner",
    ),
    aggression: text("aggression", { enum: AGGRESSION_LEVELS }).default(
      "peaceful",
    ),
    waterType: text("water_type", { enum: WATER_TYPES }).default("freshwater"),
    tankSizeMin: integer("tank_size_min"), // litres
    adultSize: real("adult_size"), // cm
    lifespan: text("lifespan"),
    diet: text("diet"),
    compatibility: text("compatibility"),
    price: real("price"),
    offerPrice: real("offer_price"),
    currency: text("currency").notNull().default("INR"),
    stock: integer("stock").notNull().default(0),
    availability: text("availability", { enum: AVAILABILITY }).default(
      "available",
    ),
    varieties: text("varieties", { mode: "json" }).$type<Variety[]>(),
    heroImage: text("hero_image"),
    gallery: text("gallery", { mode: "json" }).$type<string[]>(),
    video: text("video"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    trending: integer("trending", { mode: "boolean" }).notNull().default(false),
    isImported: integer("is_imported", { mode: "boolean" })
      .notNull()
      .default(false),
    isNewArrival: integer("is_new_arrival", { mode: "boolean" })
      .notNull()
      .default(false),
    tags: text("tags", { mode: "json" }).$type<string[]>(),
    sortOrder: integer("sort_order").notNull().default(0),
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(true),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [
    uniqueIndex("fish_slug_idx").on(t.slug),
    index("fish_category_idx").on(t.categoryId),
    index("fish_featured_idx").on(t.featured),
    index("fish_trending_idx").on(t.trending),
    index("fish_published_idx").on(t.published),
  ],
);

/* -------------------------------------------------------------------------- */
/*  products — accessories, equipment, consumables                           */
/* -------------------------------------------------------------------------- */

export const products = sqliteTable(
  "products",
  {
    id: pk(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    categoryId: text("category_id"),
    sku: text("sku"),
    brand: text("brand"),
    shortDescription: text("short_description"),
    description: text("description"),
    specs: text("specs", { mode: "json" }).$type<SpecItem[]>(),
    price: real("price"),
    offerPrice: real("offer_price"),
    currency: text("currency").notNull().default("INR"),
    stock: integer("stock").notNull().default(0),
    availability: text("availability", { enum: AVAILABILITY }).default(
      "available",
    ),
    heroImage: text("hero_image"),
    gallery: text("gallery", { mode: "json" }).$type<string[]>(),
    video: text("video"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    trending: integer("trending", { mode: "boolean" }).notNull().default(false),
    isImported: integer("is_imported", { mode: "boolean" })
      .notNull()
      .default(false),
    isNewArrival: integer("is_new_arrival", { mode: "boolean" })
      .notNull()
      .default(false),
    tags: text("tags", { mode: "json" }).$type<string[]>(),
    sortOrder: integer("sort_order").notNull().default(0),
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(true),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [
    uniqueIndex("products_slug_idx").on(t.slug),
    index("products_category_idx").on(t.categoryId),
    index("products_featured_idx").on(t.featured),
  ],
);

/* -------------------------------------------------------------------------- */
/*  blogPosts — content marketing / care articles                            */
/* -------------------------------------------------------------------------- */

export const blogPosts = sqliteTable(
  "blog_posts",
  {
    id: pk(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    content: text("content"),
    coverImage: text("cover_image"),
    categoryId: text("category_id"),
    tags: text("tags", { mode: "json" }).$type<string[]>(),
    author: text("author").default("Happy Aquarium"),
    status: text("status", { enum: POST_STATUS }).notNull().default("draft"),
    readTime: integer("read_time"),
    publishedAt: integer("published_at", { mode: "timestamp" }),
    scheduledAt: integer("scheduled_at", { mode: "timestamp" }),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    ...seoColumns,
    ...timestamps,
  },
  (t) => [
    uniqueIndex("blog_slug_idx").on(t.slug),
    index("blog_status_idx").on(t.status),
    index("blog_category_idx").on(t.categoryId),
  ],
);

/* -------------------------------------------------------------------------- */
/*  offers — flash sales, banners, countdown promotions                      */
/* -------------------------------------------------------------------------- */

export const offers = sqliteTable(
  "offers",
  {
    id: pk(),
    title: text("title").notNull(),
    subtitle: text("subtitle"),
    description: text("description"),
    image: text("image"),
    badge: text("badge"),
    discountText: text("discount_text"),
    ctaText: text("cta_text"),
    ctaLink: text("cta_link"),
    placement: text("placement", { enum: OFFER_PLACEMENTS })
      .notNull()
      .default("homepage_banner"),
    startAt: integer("start_at", { mode: "timestamp" }),
    endAt: integer("end_at", { mode: "timestamp" }),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [
    index("offers_active_idx").on(t.active),
    index("offers_placement_idx").on(t.placement),
  ],
);

/* -------------------------------------------------------------------------- */
/*  galleryItems — masonry gallery / customer tanks / before-after           */
/* -------------------------------------------------------------------------- */

export const galleryItems = sqliteTable(
  "gallery_items",
  {
    id: pk(),
    title: text("title"),
    caption: text("caption"),
    type: text("type", { enum: MEDIA_TYPES }).notNull().default("image"),
    url: text("url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    kind: text("kind", { enum: GALLERY_KINDS }).notNull().default("showcase"),
    width: integer("width"),
    height: integer("height"),
    featured: integer("featured", { mode: "boolean" }).notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(true),
    ...timestamps,
  },
  (t) => [index("gallery_kind_idx").on(t.kind)],
);

/* -------------------------------------------------------------------------- */
/*  testimonials — customer reviews (image / video / rating)                 */
/* -------------------------------------------------------------------------- */

export const testimonials = sqliteTable("testimonials", {
  id: pk(),
  customerName: text("customer_name").notNull(),
  avatar: text("avatar"),
  rating: integer("rating").notNull().default(5),
  review: text("review").notNull(),
  image: text("image"),
  video: text("video"),
  location: text("location"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  ...timestamps,
});

/* -------------------------------------------------------------------------- */
/*  faqs                                                                      */
/* -------------------------------------------------------------------------- */

export const faqs = sqliteTable("faqs", {
  id: pk(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  category: text("category"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

/* -------------------------------------------------------------------------- */
/*  media — media library (R2-backed)                                        */
/* -------------------------------------------------------------------------- */

export const media = sqliteTable(
  "media",
  {
    id: pk(),
    filename: text("filename").notNull(),
    key: text("key").notNull(),
    url: text("url").notNull(),
    mimeType: text("mime_type"),
    type: text("type", { enum: MEDIA_TYPES }).notNull().default("image"),
    size: integer("size"),
    width: integer("width"),
    height: integer("height"),
    alt: text("alt"),
    folder: text("folder").default("uploads"),
    uploadedBy: text("uploaded_by"),
    ...timestamps,
  },
  (t) => [
    uniqueIndex("media_key_idx").on(t.key),
    index("media_folder_idx").on(t.folder),
  ],
);

/* -------------------------------------------------------------------------- */
/*  navItems — menu builder (header / footer / mega)                         */
/* -------------------------------------------------------------------------- */

export const navItems = sqliteTable(
  "nav_items",
  {
    id: pk(),
    label: text("label").notNull(),
    url: text("url").notNull(),
    parentId: text("parent_id"),
    location: text("location", { enum: NAV_LOCATIONS })
      .notNull()
      .default("header"),
    icon: text("icon"),
    description: text("description"),
    isExternal: integer("is_external", { mode: "boolean" })
      .notNull()
      .default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(true),
    ...timestamps,
  },
  (t) => [index("nav_location_idx").on(t.location)],
);

/* -------------------------------------------------------------------------- */
/*  homepageSections — modular homepage builder                              */
/* -------------------------------------------------------------------------- */

export const homepageSections = sqliteTable(
  "homepage_sections",
  {
    id: pk(),
    sectionType: text("section_type", { enum: SECTION_TYPES }).notNull(),
    title: text("title"),
    subtitle: text("subtitle"),
    // Arbitrary per-section config: item ids, counts, colors, background,
    // animation intensity, cta, layout, etc. — fully controlled from admin.
    config: text("config", { mode: "json" }).$type<Record<string, unknown>>(),
    sortOrder: integer("sort_order").notNull().default(0),
    visible: integer("visible", { mode: "boolean" }).notNull().default(true),
    ...timestamps,
  },
  (t) => [index("homepage_sort_idx").on(t.sortOrder)],
);

/* -------------------------------------------------------------------------- */
/*  enquiries — reservations, enquiries, call requests, newsletter, messages */
/* -------------------------------------------------------------------------- */

export const enquiries = sqliteTable(
  "enquiries",
  {
    id: pk(),
    type: text("type", { enum: ENQUIRY_TYPES }).notNull().default("enquiry"),
    name: text("name"),
    phone: text("phone"),
    email: text("email"),
    itemType: text("item_type"), // "fish" | "product" | "general"
    itemId: text("item_id"),
    itemName: text("item_name"),
    message: text("message"),
    status: text("status", { enum: ENQUIRY_STATUS }).notNull().default("new"),
    notes: text("notes"),
    source: text("source").default("website"),
    ...timestamps,
  },
  (t) => [
    index("enquiries_type_idx").on(t.type),
    index("enquiries_status_idx").on(t.status),
  ],
);

/* -------------------------------------------------------------------------- */
/*  fishCompatibility — matrix for the compatibility checker                  */
/* -------------------------------------------------------------------------- */

export const fishCompatibility = sqliteTable(
  "fish_compatibility",
  {
    id: pk(),
    fishAId: text("fish_a_id").notNull(),
    fishBId: text("fish_b_id").notNull(),
    level: text("level", { enum: COMPAT_LEVELS }).notNull().default("semi"),
    note: text("note"),
    ...timestamps,
  },
  (t) => [uniqueIndex("compat_pair_idx").on(t.fishAId, t.fishBId)],
);

/* -------------------------------------------------------------------------- */
/*  plannerPresets — curated aquarium setups for the planner tool             */
/* -------------------------------------------------------------------------- */

export const plannerPresets = sqliteTable("planner_presets", {
  id: pk(),
  name: text("name").notNull(),
  description: text("description"),
  image: text("image"),
  tankSizeMin: integer("tank_size_min"),
  tankSizeMax: integer("tank_size_max"),
  budgetMin: real("budget_min"),
  budgetMax: real("budget_max"),
  experience: text("experience", { enum: EXPERIENCE_LEVELS }).default(
    "beginner",
  ),
  fishIds: text("fish_ids", { mode: "json" }).$type<string[]>(),
  productIds: text("product_ids", { mode: "json" }).$type<string[]>(),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

/* -------------------------------------------------------------------------- */
/*  tankPricing — equipment cost tiers by tank volume (planner estimate)      */
/* -------------------------------------------------------------------------- */

export const tankPricing = sqliteTable("tank_pricing", {
  id: pk(),
  name: text("name").notNull(), // e.g. "Nano", "Standard 2ft", "Large 4ft"
  litresMin: integer("litres_min").notNull().default(0),
  litresMax: integer("litres_max"), // null = no upper bound (largest tier)
  baseSetup: real("base_setup").notNull().default(0), // flat tank/setup fee
  perLitre: real("per_litre").notNull().default(0), // ₹ per litre (water, misc)
  filterCost: real("filter_cost").notNull().default(0),
  heaterCost: real("heater_cost").notNull().default(0),
  lightCost: real("light_cost").notNull().default(0),
  substrateCost: real("substrate_cost").notNull().default(0),
  decorCost: real("decor_cost").notNull().default(0),
  note: text("note"),
  sortOrder: integer("sort_order").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  ...timestamps,
});

/* -------------------------------------------------------------------------- */
/*  users & activity logs — auth + roles + audit trail                        */
/* -------------------------------------------------------------------------- */

export const users = sqliteTable(
  "users",
  {
    id: pk(),
    email: text("email").notNull(),
    name: text("name"),
    passwordHash: text("password_hash").notNull(),
    role: text("role", { enum: USER_ROLES }).notNull().default("viewer"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    lastLoginAt: integer("last_login_at", { mode: "timestamp" }),
    ...timestamps,
  },
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);

export const activityLogs = sqliteTable(
  "activity_logs",
  {
    id: pk(),
    userId: text("user_id"),
    userEmail: text("user_email"),
    action: text("action").notNull(),
    entity: text("entity"),
    entityId: text("entity_id"),
    meta: text("meta", { mode: "json" }).$type<Record<string, unknown>>(),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date(),
    ),
  },
  (t) => [index("activity_user_idx").on(t.userId)],
);

/* -------------------------------------------------------------------------- */
/*  analyticsEvents — first-party lightweight analytics (visits, WA clicks)   */
/* -------------------------------------------------------------------------- */

export const analyticsEvents = sqliteTable(
  "analytics_events",
  {
    id: pk(),
    event: text("event").notNull(), // pageview | whatsapp_click | call_click | reserve
    path: text("path"),
    itemType: text("item_type"),
    itemId: text("item_id"),
    referrer: text("referrer"),
    sessionId: text("session_id"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
      () => new Date(),
    ),
  },
  (t) => [
    index("analytics_event_idx").on(t.event),
    index("analytics_created_idx").on(t.createdAt),
  ],
);

/* -------------------------------------------------------------------------- */
/*  Relations                                                                 */
/* -------------------------------------------------------------------------- */

export const categoriesRelations = relations(categories, ({ many }) => ({
  fish: many(fish),
  products: many(products),
  posts: many(blogPosts),
}));

export const fishRelations = relations(fish, ({ one }) => ({
  category: one(categories, {
    fields: [fish.categoryId],
    references: [categories.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
}));

export const blogPostsRelations = relations(blogPosts, ({ one }) => ({
  category: one(categories, {
    fields: [blogPosts.categoryId],
    references: [categories.id],
  }),
}));

/* -------------------------------------------------------------------------- */
/*  Inferred types                                                            */
/* -------------------------------------------------------------------------- */

export type Setting = typeof settings.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Fish = typeof fish.$inferSelect;
export type NewFish = typeof fish.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewBlogPost = typeof blogPosts.$inferInsert;
export type Offer = typeof offers.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Media = typeof media.$inferSelect;
export type NavItem = typeof navItems.$inferSelect;
export type HomepageSection = typeof homepageSections.$inferSelect;
export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;
export type FishCompatibility = typeof fishCompatibility.$inferSelect;
export type PlannerPreset = typeof plannerPresets.$inferSelect;
export type TankPricing = typeof tankPricing.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
