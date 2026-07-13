import { img } from "./images";
import { SECTION_TYPES } from "../schema";
type SectionType = (typeof SECTION_TYPES)[number];

/* Store-wide settings (singleton). Real business details. */
export const siteSettings = {
  id: "default",
  storeName: "Happy Aquarium",
  tagline: "Dive into a world of living colour",
  description:
    "Kerala's premium aquarium store — aquarium fish, imported species, tanks, plants and everything you need to build a thriving underwater world. Near Eye Hospital, Kuthuparamba.",
  phone: "9947770808",
  whatsapp: "919947770808",
  email: "hello@happyaquarium.in",
  addressLine: "Near Eye Hospital",
  area: "Kuthuparamba",
  city: "Kannur",
  state: "Kerala",
  pincode: "670643",
  mapLat: 11.829637,
  mapLng: 75.562644,
  mapEmbedUrl:
    "https://www.google.com/maps?q=11.829637,75.562644&output=embed",
  directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=11.829637,75.562644",
  openingHours: {
    monday: { open: "09:00", close: "20:00" },
    tuesday: { open: "09:00", close: "20:00" },
    wednesday: { open: "09:00", close: "20:00" },
    thursday: { open: "09:00", close: "20:00" },
    friday: { open: "09:00", close: "20:00" },
    saturday: { open: "09:00", close: "20:30" },
    sunday: { open: "10:00", close: "18:00" },
  },
  logo: null as string | null,
  favicon: null as string | null,
  socials: {
    instagram: "https://instagram.com/happyaquarium",
    facebook: "https://facebook.com/happyaquarium",
    youtube: "https://youtube.com/@happyaquarium",
    whatsapp: "https://wa.me/919947770808",
  },
  theme: { animationIntensity: "cinematic" as const, accent: "#22d3ee" },
  metaTitle: "Happy Aquarium — Premium Aquarium Fish & Supplies in Kuthuparamba, Kerala",
  metaDescription:
    "Aquarium fish, imported species, tanks, plants, food and accessories. Visit Happy Aquarium near Eye Hospital, Kuthuparamba, Kerala. Call 9947770808.",
  keywords:
    "aquarium fish Kerala, aquarium shop Kuthuparamba, imported fish, fish tank, koi, oscar, flowerhorn, betta",
  instagramWidgetToken: null as string | null,
};

/* Modular homepage — ordered, each fully editable from admin. */
export const homepageSections: {
  sectionType: SectionType;
  title: string;
  subtitle: string;
  sortOrder: number;
  visible: boolean;
  config: Record<string, unknown>;
}[] = [
  { sectionType: "hero", title: "Happy Aquarium", subtitle: "Dive into a world of living colour", sortOrder: 1, visible: true, config: { ctaPrimary: { label: "Explore the Collection", href: "/fish" }, ctaSecondary: { label: "WhatsApp Us", href: "wa" }, badges: ["35+ species in stock", "Imported fish", "Setup service"] } },
  { sectionType: "featured_fish", title: "Featured Fish", subtitle: "Hand-picked favourites from our tanks", sortOrder: 2, visible: true, config: { limit: 8, filter: "featured" } },
  { sectionType: "categories", title: "Explore by Category", subtitle: "Find your perfect fish", sortOrder: 3, visible: true, config: { kind: "fish" } },
  { sectionType: "offers", title: "Today's Offers", subtitle: "Limited-time deals — while stocks last", sortOrder: 4, visible: true, config: { placement: "homepage_banner" } },
  { sectionType: "latest_arrivals", title: "Latest Arrivals", subtitle: "Freshly added to the store", sortOrder: 5, visible: true, config: { limit: 8, filter: "new" } },
  { sectionType: "popular_fish", title: "Popular Right Now", subtitle: "Trending with our customers", sortOrder: 6, visible: true, config: { limit: 8, filter: "trending" } },
  { sectionType: "accessories", title: "Premium Accessories", subtitle: "Everything your aquarium needs", sortOrder: 7, visible: true, config: { limit: 8, filter: "featured" } },
  { sectionType: "gallery", title: "Aquarium Gallery", subtitle: "Real tanks, real customers", sortOrder: 8, visible: true, config: { limit: 9 } },
  { sectionType: "testimonials", title: "Loved by Hobbyists", subtitle: "What our customers say", sortOrder: 9, visible: true, config: { limit: 6 } },
  { sectionType: "articles", title: "Fish Care Articles", subtitle: "Learn from our guides", sortOrder: 10, visible: true, config: { limit: 3 } },
  { sectionType: "map", title: "Visit Our Store", subtitle: "Near Eye Hospital, Kuthuparamba, Kerala", sortOrder: 11, visible: true, config: {} },
  { sectionType: "faq", title: "Frequently Asked Questions", subtitle: "Everything you need to know", sortOrder: 12, visible: true, config: {} },
  { sectionType: "newsletter", title: "Stay in the Loop", subtitle: "New arrivals and offers, straight to you", sortOrder: 13, visible: true, config: {} },
];

/* Today's offers with live countdown windows. */
const now = Date.now();
const days = (n: number) => new Date(now + n * 86400000);
export const offers = [
  { title: "Guppy & Platy Festival", subtitle: "Buy 5, pay for 4", description: "Mix & match any livebearers — the cheapest one is on us.", badge: "COMBO", discountText: "20% OFF", ctaText: "Shop Livebearers", ctaLink: "/fish?category=livebearers", placement: "homepage_banner" as const, startAt: days(-2), endAt: days(5), active: true, sortOrder: 1, image: img("guppy,aquarium", 301) },
  { title: "Oscar Week", subtitle: "All oscars at special prices", description: "Tiger, Red, Albino & Veiltail oscars — flat discounts all week.", badge: "FLASH", discountText: "Up to ₹50 OFF", ctaText: "See Oscars", ctaLink: "/fish?category=cichlids", placement: "hero_strip" as const, startAt: days(-1), endAt: days(3), active: true, sortOrder: 2, image: img("oscar,cichlid", 302) },
  { title: "Free Water Test", subtitle: "With every purchase", description: "Bring a water sample and get a free parameter check from our experts.", badge: "SERVICE", discountText: "FREE", ctaText: "Learn More", ctaLink: "/contact", placement: "homepage_banner" as const, startAt: days(-5), endAt: days(30), active: true, sortOrder: 3, image: img("aquarium,water,test", 303) },
];

/* Customer testimonials. */
export const testimonials = [
  { customerName: "Arjun Menon", rating: 5, location: "Thalassery", featured: true, sortOrder: 1, avatar: img("portrait,man", 401, 200, 200), review: "Best aquarium shop in the Kannur area. Their fish are always healthy and the flowerhorn I bought is stunning. Great advice too!" },
  { customerName: "Fathima Rasheed", rating: 5, location: "Kuthuparamba", featured: true, sortOrder: 2, avatar: img("portrait,woman", 402, 200, 200), review: "Set up my first planted tank with their help. They guided me on every accessory and the plants are thriving. Highly recommend." },
  { customerName: "Vishnu Prasad", rating: 5, location: "Mattannur", featured: true, sortOrder: 3, avatar: img("portrait,person", 403, 200, 200), review: "Huge variety of imported fish. Got a pair of breeding angels and cardinal tetras — all doing brilliantly a month on." },
  { customerName: "Sneha Nair", rating: 4, location: "Kannur", featured: true, sortOrder: 4, avatar: img("portrait,girl", 404, 200, 200), review: "Lovely store and very friendly staff. Their oscars have so much personality. Reserved one on WhatsApp and picked it up the next day." },
  { customerName: "Rahul Kumar", rating: 5, location: "Panoor", featured: true, sortOrder: 5, avatar: img("portrait,young,man", 405, 200, 200), review: "The koi selection is superb. My pond looks incredible now. They even helped with filtration advice for free." },
  { customerName: "Anjali Suresh", rating: 5, location: "Kuthuparamba", featured: true, sortOrder: 6, avatar: img("portrait,lady", 406, 200, 200), review: "Genuinely happy customers here! Healthy bettas, great prices and honest guidance. My go-to aquarium store." },
];

/* FAQs handling common objections. */
export const faqs = [
  { question: "Do you deliver fish, or is it in-store pickup only?", answer: "You can reserve any fish on WhatsApp or by phone and pick it up in-store. For nearby areas we can arrange safe local delivery — just message us on 9947770808.", category: "general", sortOrder: 1 },
  { question: "Are your fish healthy and quarantined?", answer: "Yes. All our fish are kept in monitored, filtered systems and observed before sale. We only sell healthy, active stock and give you care guidance for each species.", category: "general", sortOrder: 2 },
  { question: "Do you sell imported fish?", answer: "We regularly stock imported species like Thailand flowerhorns and premium goldfish strains. Ask us about current imports or check the 'Imported' tag on our fish pages.", category: "stock", sortOrder: 3 },
  { question: "Can you help me set up a new aquarium?", answer: "Absolutely — aquarium setup is one of our services. We help you choose the tank, filter, lighting, substrate and a compatible fish community for your space and budget.", category: "service", sortOrder: 4 },
  { question: "How do I know which fish can live together?", answer: "Use our Fish Compatibility Checker and Aquarium Planner tools on this site, or just ask us. We'll recommend a peaceful, thriving community for your tank size.", category: "care", sortOrder: 5 },
  { question: "What water conditions do I need?", answer: "It depends on the species — each fish page lists ideal temperature and pH. Bring a water sample for a free test and we'll advise on conditioners and adjustments.", category: "care", sortOrder: 6 },
  { question: "Do you offer any guarantee?", answer: "We stand behind our stock. If you have any issue shortly after purchase, contact us with photos and we'll do our best to make it right.", category: "general", sortOrder: 7 },
  { question: "What are your opening hours?", answer: "We're open 9:00 AM to 8:00 PM Monday–Saturday (till 8:30 PM Sat) and 10:00 AM to 6:00 PM on Sunday. Find us near Eye Hospital, Kuthuparamba.", category: "general", sortOrder: 8 },
];

/* Navigation — header + footer. */
export const navItems = [
  { label: "Home", url: "/", location: "header" as const, sortOrder: 1 },
  { label: "Fish", url: "/fish", location: "header" as const, sortOrder: 2 },
  { label: "Accessories", url: "/accessories", location: "header" as const, sortOrder: 3 },
  { label: "Aquarium Planner", url: "/planner", location: "header" as const, sortOrder: 4 },
  { label: "Compatibility", url: "/compatibility", location: "header" as const, sortOrder: 5 },
  { label: "Gallery", url: "/gallery", location: "header" as const, sortOrder: 6 },
  { label: "Blog", url: "/blog", location: "header" as const, sortOrder: 7 },
  { label: "Contact", url: "/contact", location: "header" as const, sortOrder: 8 },
  { label: "Fish", url: "/fish", location: "footer" as const, sortOrder: 1 },
  { label: "Accessories", url: "/accessories", location: "footer" as const, sortOrder: 2 },
  { label: "Gallery", url: "/gallery", location: "footer" as const, sortOrder: 3 },
  { label: "Fish Care Blog", url: "/blog", location: "footer" as const, sortOrder: 4 },
  { label: "Contact & Directions", url: "/contact", location: "footer" as const, sortOrder: 5 },
];

/* Gallery — customer tanks, aquascapes, before/after. */
export const galleryItems = [
  { title: "Planted community tank", kind: "aquascape" as const, url: img("planted,aquarium", 501), thumbnailUrl: img("planted,aquarium", 501, 500, 400), featured: true, sortOrder: 1, caption: "A lush 4ft community aquascape set up by a customer." },
  { title: "Flowerhorn showpiece", kind: "showcase" as const, url: img("flowerhorn,cichlid", 502), thumbnailUrl: img("flowerhorn,cichlid", 502, 500, 400), featured: true, sortOrder: 2, caption: "Premium Thailand flowerhorn in a customer's display tank." },
  { title: "Koi pond", kind: "customer_tank" as const, url: img("koi,pond", 503), thumbnailUrl: img("koi,pond", 503, 500, 400), sortOrder: 3, caption: "Backyard koi pond stocked from Happy Aquarium." },
  { title: "Reef-style rockwork", kind: "aquascape" as const, url: img("aquarium,rocks", 504), thumbnailUrl: img("aquarium,rocks", 504, 500, 400), sortOrder: 4 },
  { title: "Betta nano tank", kind: "showcase" as const, url: img("betta,aquarium", 505), thumbnailUrl: img("betta,aquarium", 505, 500, 400), featured: true, sortOrder: 5 },
  { title: "Goldfish display", kind: "customer_tank" as const, url: img("goldfish,tank", 506), thumbnailUrl: img("goldfish,tank", 506, 500, 400), sortOrder: 6 },
  { title: "Cichlid rock aquarium", kind: "showcase" as const, url: img("cichlid,aquarium", 507), thumbnailUrl: img("cichlid,aquarium", 507, 500, 400), sortOrder: 7 },
  { title: "Store display wall", kind: "store" as const, url: img("aquarium,shop", 508), thumbnailUrl: img("aquarium,shop", 508, 500, 400), sortOrder: 8 },
  { title: "Driftwood aquascape", kind: "aquascape" as const, url: img("driftwood,aquarium", 509), thumbnailUrl: img("driftwood,aquarium", 509, 500, 400), sortOrder: 9 },
];

/* Aquarium planner presets. fishSlugs resolved to ids by the seed runner. */
export const plannerPresets = [
  { name: "Beginner Nano Community", description: "A calm, easy 60L community perfect for first-timers.", tankSizeMin: 40, tankSizeMax: 80, budgetMin: 500, budgetMax: 1500, experience: "beginner" as const, fishSlugs: ["guppy", "platy", "corydoras", "zebra-fish"], sortOrder: 1, image: img("planted,nano,aquarium", 601) },
  { name: "Colourful Tetra Aquascape", description: "A planted 100L shimmering with shoaling tetras.", tankSizeMin: 80, tankSizeMax: 150, budgetMin: 1500, budgetMax: 3500, experience: "intermediate" as const, fishSlugs: ["cardinal-tetra", "colombian-tetra", "corydoras", "dwarf-gourami"], sortOrder: 2, image: img("tetra,planted,aquarium", 602) },
  { name: "Big Cichlid Showpiece", description: "A bold 300L centrepiece tank for oscar & parrot lovers.", tankSizeMin: 250, tankSizeMax: 500, budgetMin: 4000, budgetMax: 10000, experience: "expert" as const, fishSlugs: ["tiger-oscar", "red-parrot", "white-albino-sucker"], sortOrder: 3, image: img("oscar,cichlid,aquarium", 603) },
];

export type PlannerPresetSeed = (typeof plannerPresets)[number];
