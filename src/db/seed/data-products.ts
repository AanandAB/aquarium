import { img } from "./images";

export type ProductSeed = {
  slug: string;
  name: string;
  cat: string; // category slug
  brand?: string;
  sku?: string;
  short: string;
  desc?: string;
  price: number;
  offer?: number;
  stock?: number;
  avail?: "available" | "low_stock" | "out_of_stock" | "reserved";
  specs?: { label: string; value: string }[];
  feat?: boolean;
  trend?: boolean;
  nw?: boolean;
  imp?: boolean;
  tags?: string[];
  lock: number;
  kw: string;
};

export const products: ProductSeed[] = [
  { slug: "starter-aquarium-2ft", name: "2ft Starter Glass Aquarium", cat: "aquariums", brand: "AquaClear", sku: "TANK-2FT", short: "A crystal-clear 60cm all-glass tank — the perfect first aquarium.", desc: "Rimless-style 2ft glass aquarium (approx. 55 litres) with polished edges. Ideal for community fish, bettas or a small planted setup.", price: 1200, offer: 999, stock: 15, feat: true, nw: true, lock: 2001, kw: "glass,aquarium,tank", specs: [{ label: "Size", value: "60 × 30 × 30 cm" }, { label: "Volume", value: "~55 L" }, { label: "Glass", value: "5 mm" }] },
  { slug: "cabinet-aquarium-4ft", name: "4ft Cabinet Aquarium Set", cat: "aquariums", brand: "AquaClear", sku: "TANK-4FT", short: "A statement 4ft tank with matching cabinet stand.", desc: "Premium 4ft aquarium (approx. 240 litres) with a sturdy cabinet, hood and lighting cutout. A true living-room centrepiece.", price: 8500, offer: 7800, stock: 5, avail: "low_stock", feat: true, lock: 2002, kw: "aquarium,cabinet,tank", specs: [{ label: "Size", value: "120 × 45 × 45 cm" }, { label: "Volume", value: "~240 L" }] },
  { slug: "internal-power-filter", name: "Internal Power Filter 1200 L/h", cat: "filters", brand: "SunSun", sku: "FILT-INT-1200", short: "Quiet, powerful internal filtration with adjustable flow.", desc: "Three-stage internal power filter with spray bar and venturi aeration. Keeps water crystal clear in tanks up to 200L.", price: 850, offer: 720, stock: 25, feat: true, trend: true, lock: 2003, kw: "aquarium,filter", specs: [{ label: "Flow", value: "1200 L/h" }, { label: "For tanks", value: "up to 200 L" }] },
  { slug: "canister-filter-2000", name: "External Canister Filter 2000 L/h", cat: "filters", brand: "SunSun", sku: "FILT-CAN-2000", short: "Serious multi-stage canister filtration for big, clean tanks.", desc: "Four-tray external canister filter with media, ideal for large cichlid and planted aquariums up to 400L.", price: 3200, offer: 2850, stock: 10, feat: true, lock: 2004, kw: "canister,filter", specs: [{ label: "Flow", value: "2000 L/h" }, { label: "For tanks", value: "up to 400 L" }] },
  { slug: "silent-air-pump-dual", name: "Silent Dual-Outlet Air Pump", cat: "air-pumps", brand: "Boyu", sku: "AIR-DUAL", short: "Whisper-quiet aeration with two adjustable outlets.", desc: "Reliable dual-outlet air pump for driftwood bubblers, sponge filters and air stones. Barely audible.", price: 550, offer: 460, stock: 30, trend: true, lock: 2005, kw: "air,pump", specs: [{ label: "Outlets", value: "2" }, { label: "Output", value: "3.5 L/min" }] },
  { slug: "led-aqua-light-60", name: "Full-Spectrum LED Aqua Light 60cm", cat: "lighting", brand: "Chihiros", sku: "LED-60", short: "Vivid full-spectrum LED that makes colours and plants pop.", desc: "Slim aluminium LED bar with white, blue and RGB channels. Promotes plant growth and dazzling fish colour.", price: 2200, offer: 1950, stock: 12, feat: true, nw: true, lock: 2006, kw: "aquarium,led,light", specs: [{ label: "Length", value: "60 cm" }, { label: "Spectrum", value: "Full RGB + White" }] },
  { slug: "clip-on-nano-light", name: "Clip-On Nano LED Light", cat: "lighting", brand: "Nicrew", sku: "LED-NANO", short: "Compact clip light for nano tanks and betta bowls.", desc: "Adjustable clip-on LED delivering bright, natural light for small planted or nano aquariums.", price: 750, offer: 620, stock: 22, lock: 2007, kw: "nano,led,light", specs: [{ label: "For tanks", value: "up to 40 cm" }] },
  { slug: "live-anubias-plant", name: "Live Anubias Nana Plant", cat: "plants", brand: "AquaFlora", sku: "PLANT-ANUB", short: "A bulletproof, slow-growing live plant for any tank.", desc: "Hardy Anubias nana attached to driftwood — thrives in low light, safe with all fish. A perfect first live plant.", price: 250, offer: 199, stock: 40, feat: true, trend: true, lock: 2008, kw: "anubias,aquatic,plant", specs: [{ label: "Light", value: "Low–Medium" }, { label: "Care", value: "Very easy" }] },
  { slug: "amazon-sword-plant", name: "Amazon Sword Live Plant", cat: "plants", brand: "AquaFlora", sku: "PLANT-SWORD", short: "A lush, tall background plant for natural aquascapes.", desc: "Fast-growing Amazon sword that forms a dramatic green backdrop and provides shelter for fish and fry.", price: 220, offer: 180, stock: 35, feat: true, lock: 2009, kw: "aquatic,plant,green", specs: [{ label: "Light", value: "Medium" }, { label: "Placement", value: "Background" }] },
  { slug: "malaysian-driftwood", name: "Malaysian Driftwood (Medium)", cat: "decor", brand: "NatureAqua", sku: "DECOR-DW-M", short: "Natural driftwood centrepiece for aquascapes and plecos.", desc: "Hand-picked Malaysian driftwood — sinks readily, tannin-rich and perfect for attaching anubias or moss.", price: 350, offer: 299, stock: 18, lock: 2010, kw: "driftwood,aquarium", specs: [{ label: "Size", value: "~25–30 cm" }] },
  { slug: "colour-flakes-food", name: "Colour-Enhancing Flake Food 100g", cat: "food", brand: "Tetra", sku: "FOOD-FLAKE-100", short: "Daily staple flakes that boost natural colour.", desc: "Premium colour-enhancing flakes for all tropical community fish. Highly digestible, less waste.", price: 320, offer: 280, stock: 50, feat: true, trend: true, lock: 2011, kw: "fish,food,flakes", specs: [{ label: "Weight", value: "100 g" }, { label: "For", value: "All tropical fish" }] },
  { slug: "cichlid-pellets-food", name: "Cichlid Colour Pellets 250g", cat: "food", brand: "Hikari", sku: "FOOD-CICH-250", short: "Protein-rich sinking pellets for oscars, parrots & cichlids.", desc: "Colour-and-growth cichlid pellets with premium protein. Ideal for oscars, flowerhorns and parrots.", price: 480, offer: 420, stock: 30, feat: true, lock: 2012, kw: "fish,pellets,food", specs: [{ label: "Weight", value: "250 g" }, { label: "Type", value: "Sinking pellets" }] },
  { slug: "anti-ich-medicine", name: "Anti-Ich & Fungus Treatment", cat: "medicines", brand: "Seachem", sku: "MED-ICH", short: "Fast, effective treatment for white-spot and fungus.", desc: "Reliable remedy for ich (white spot) and fungal infections. Safe for community tanks when dosed correctly.", price: 260, offer: 220, stock: 24, lock: 2013, kw: "aquarium,medicine", specs: [{ label: "Volume", value: "100 ml" }] },
  { slug: "water-conditioner-500", name: "Water Conditioner & Dechlorinator 500ml", cat: "water-conditioners", brand: "API", sku: "COND-500", short: "Makes tap water instantly safe for fish.", desc: "Removes chlorine and chloramine and detoxifies heavy metals — a must for every water change.", price: 300, offer: 250, stock: 45, feat: true, trend: true, lock: 2014, kw: "water,conditioner", specs: [{ label: "Volume", value: "500 ml" }, { label: "Treats", value: "~2000 L" }] },
  { slug: "natural-gravel-5kg", name: "Natural River Gravel 5kg", cat: "gravel-substrate", brand: "NatureAqua", sku: "GRAV-5KG", short: "Smooth, fish-safe river gravel for a natural look.", desc: "Washed natural river gravel, safe for all fish and plants. Provides a beautiful, natural substrate.", price: 280, offer: 230, stock: 40, lock: 2015, kw: "aquarium,gravel", specs: [{ label: "Weight", value: "5 kg" }, { label: "Grain", value: "3–5 mm" }] },
  { slug: "gravel-cleaner-siphon", name: "Gravel Cleaner Siphon Kit", cat: "cleaning-tools", brand: "AquaClear", sku: "CLEAN-SIPHON", short: "Effortless water changes and substrate cleaning.", desc: "Self-priming gravel siphon with flow control — cleans debris from substrate while draining water.", price: 350, offer: 299, stock: 28, nw: true, lock: 2016, kw: "aquarium,siphon,cleaning", specs: [{ label: "Hose", value: "1.5 m" }] },
];
