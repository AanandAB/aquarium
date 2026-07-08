import type { NewCategory } from "../schema";
import { img } from "./images";

/** Fish categories (8) — each fish maps to one of these via slug. */
export const fishCategories: NewCategory[] = [
  { kind: "fish", slug: "livebearers", name: "Livebearers", sortOrder: 1, featured: true, icon: "🐟", color: "#38bdf8", image: img("guppy,aquarium", 101), description: "Hardy, colourful and beginner-friendly fish that give birth to live young — guppies, mollies and platies." },
  { kind: "fish", slug: "tetras", name: "Tetras", sortOrder: 2, featured: true, icon: "✨", color: "#22d3ee", image: img("tetra,fish", 102), description: "Peaceful shoaling jewels that shimmer under aquarium light — perfect for planted community tanks." },
  { kind: "fish", slug: "cichlids", name: "Cichlids", sortOrder: 3, featured: true, icon: "👑", color: "#f97316", image: img("cichlid,fish", 103), description: "Bold, intelligent and striking — from playful oscars to the prized flowerhorn." },
  { kind: "fish", slug: "goldfish-koi", name: "Goldfish & Koi", sortOrder: 4, featured: true, icon: "🌕", color: "#fbbf24", image: img("goldfish,koi", 104), description: "Timeless coldwater classics with flowing fins and rich colour for ponds and tanks." },
  { kind: "fish", slug: "catfish-loaches", name: "Catfish & Loaches", sortOrder: 5, icon: "🦐", color: "#a3e635", image: img("catfish,aquarium", 105), description: "Hard-working bottom dwellers that keep your substrate clean and add character." },
  { kind: "fish", slug: "bettas-gouramis", name: "Bettas & Gouramis", sortOrder: 6, featured: true, icon: "🎏", color: "#e879f9", image: img("betta,fish", 106), description: "Labyrinth fish with dramatic fins and personality — centrepieces for nano and community tanks." },
  { kind: "fish", slug: "sharks-suckers", name: "Sharks & Suckers", sortOrder: 7, icon: "🦈", color: "#60a5fa", image: img("rainbow,shark,fish", 107), description: "Active swimmers and algae-grazers that bring movement and cleaning power." },
  { kind: "fish", slug: "angelfish-oddballs", name: "Angelfish & Oddballs", sortOrder: 8, icon: "🪸", color: "#2dd4bf", image: img("angelfish,aquarium", 108), description: "Elegant angels and fascinating oddballs — from black ghost knifefish to alligator gar." },
];

/** Accessory / product categories (from the store's catalogue). */
export const productCategories: NewCategory[] = [
  { kind: "product", slug: "aquariums", name: "Aquariums & Tanks", sortOrder: 1, featured: true, icon: "🫙", image: img("aquarium,tank,glass", 201), description: "Rimless, cabinet and starter tanks in every size." },
  { kind: "product", slug: "filters", name: "Filters", sortOrder: 2, featured: true, icon: "🌀", image: img("aquarium,filter", 202), description: "Internal, canister and sponge filtration for crystal-clear water." },
  { kind: "product", slug: "air-pumps", name: "Air Pumps", sortOrder: 3, icon: "💨", image: img("air,pump", 203), description: "Quiet, reliable aeration for healthy, oxygen-rich water." },
  { kind: "product", slug: "lighting", name: "Lighting", sortOrder: 4, featured: true, icon: "💡", image: img("aquarium,led,light", 204), description: "Full-spectrum LED lighting to make colours pop and plants thrive." },
  { kind: "product", slug: "plants", name: "Aquarium Plants", sortOrder: 5, featured: true, icon: "🌿", image: img("aquatic,plant", 205), description: "Live and easy-care plants for natural, oxygenated aquascapes." },
  { kind: "product", slug: "decor", name: "Decor & Ornaments", sortOrder: 6, icon: "🪨", image: img("aquarium,decoration", 206), description: "Driftwood, rocks, caves and ornaments to build your underwater world." },
  { kind: "product", slug: "food", name: "Fish Food", sortOrder: 7, featured: true, icon: "🍤", image: img("fish,food,flakes", 207), description: "Flakes, pellets, and frozen foods for vibrant colour and growth." },
  { kind: "product", slug: "medicines", name: "Medicines", sortOrder: 8, icon: "💊", image: img("aquarium,medicine", 208), description: "Treatments and remedies to keep your fish healthy and disease-free." },
  { kind: "product", slug: "water-conditioners", name: "Water Conditioners", sortOrder: 9, icon: "🧪", image: img("water,test,kit", 209), description: "Conditioners, dechlorinators and test kits for stable water chemistry." },
  { kind: "product", slug: "gravel-substrate", name: "Gravel & Substrate", sortOrder: 10, icon: "⛰️", image: img("aquarium,gravel", 210), description: "Coloured gravel, sand and planted substrates." },
  { kind: "product", slug: "cleaning-tools", name: "Cleaning Tools", sortOrder: 11, icon: "🧽", image: img("aquarium,cleaning", 211), description: "Siphons, magnets, nets and scrapers for effortless maintenance." },
  { kind: "product", slug: "backgrounds", name: "Background Sheets", sortOrder: 12, icon: "🖼️", image: img("aquarium,background", 212), description: "3D and printed backgrounds for depth and drama." },
];

/** Blog / knowledge-base categories. */
export const blogCategories: NewCategory[] = [
  { kind: "blog", slug: "fish-care", name: "Fish Care", sortOrder: 1, icon: "❤️" },
  { kind: "blog", slug: "water-quality", name: "Water Quality", sortOrder: 2, icon: "💧" },
  { kind: "blog", slug: "diseases", name: "Diseases", sortOrder: 3, icon: "🩺" },
  { kind: "blog", slug: "feeding", name: "Feeding", sortOrder: 4, icon: "🍽️" },
  { kind: "blog", slug: "aquascaping", name: "Aquascaping", sortOrder: 5, icon: "🌱" },
  { kind: "blog", slug: "maintenance", name: "Maintenance", sortOrder: 6, icon: "🔧" },
  { kind: "blog", slug: "news", name: "News", sortOrder: 7, icon: "📰" },
];

export const allCategories = [
  ...fishCategories,
  ...productCategories,
  ...blogCategories,
];
