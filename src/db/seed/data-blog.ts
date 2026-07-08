import { img } from "./images";

export type BlogSeed = {
  slug: string;
  title: string;
  cat: string; // blog category slug
  excerpt: string;
  content: string;
  tags?: string[];
  readTime?: number;
  featured?: boolean;
  lock: number;
  kw: string;
};

export const blogPosts: BlogSeed[] = [
  {
    slug: "beginners-guide-first-aquarium",
    title: "The Complete Beginner's Guide to Your First Aquarium",
    cat: "fish-care", featured: true, readTime: 7, lock: 3001, kw: "planted,aquarium",
    excerpt: "New to fishkeeping? Here's everything you need to set up a healthy, beautiful first tank — from choosing the tank to adding your first fish.",
    tags: ["beginner", "setup", "guide"],
    content: "## Welcome to the hobby\n\nSetting up your first aquarium is exciting — and easier than you think when you follow a few golden rules.\n\n### 1. Start bigger than you think\nA 2ft (55L) tank is more stable and forgiving than a tiny bowl. More water means more stable temperature and water chemistry.\n\n### 2. Cycle before you stock\nRun your filter for 2–4 weeks (or use a starter bacteria culture) before adding fish. This builds the beneficial bacteria that keep your water safe.\n\n### 3. Choose peaceful, hardy first fish\nGuppies, platies, mollies, zebra danios and corydoras are perfect starters. Add them gradually, not all at once.\n\n### 4. Feed lightly\nOnly feed what your fish finish in two minutes. Overfeeding is the #1 beginner mistake.\n\n### 5. Weekly water changes\nSwap 20–25% of the water each week and your fish will reward you with colour and health.\n\nVisit us near Eye Hospital, Kuthuparamba, and we'll help you pick the perfect starter setup.",
  },
  {
    slug: "understanding-water-parameters",
    title: "Understanding Water Parameters: pH, Ammonia & the Nitrogen Cycle",
    cat: "water-quality", readTime: 6, lock: 3002, kw: "water,test,aquarium",
    excerpt: "Clear water isn't always healthy water. Learn the key parameters every fishkeeper should understand.",
    tags: ["water quality", "nitrogen cycle"],
    content: "## Invisible chemistry, visible results\n\nMost fish problems trace back to water quality. Here's what matters.\n\n### The nitrogen cycle\nFish waste becomes **ammonia** (toxic), which bacteria convert to **nitrite** (toxic), then to **nitrate** (much safer, removed by water changes). A cycled tank has zero ammonia and nitrite.\n\n### pH\nEach species has a preferred range. Most community fish are happy at 6.8–7.6. Stability matters more than a perfect number.\n\n### Temperature\nTropical fish typically want 24–28°C. Use a reliable heater and thermometer.\n\n### Test regularly\nBring a water sample to Happy Aquarium for a **free test** and we'll tell you exactly what your tank needs.",
  },
  {
    slug: "common-fish-diseases-treatment",
    title: "Common Aquarium Fish Diseases and How to Treat Them",
    cat: "diseases", readTime: 8, lock: 3003, kw: "aquarium,fish",
    excerpt: "Spot the signs early. A practical guide to ich, fin rot, fungus and how to treat them safely.",
    tags: ["health", "disease", "treatment"],
    content: "## Catch problems early\n\n### White Spot (Ich)\nTiny white grains on fins and body. Treat by raising temperature slightly and dosing an anti-ich remedy. Highly contagious — act fast.\n\n### Fin Rot\nRagged, receding fins caused by poor water quality. Improve water changes and use an antibacterial treatment.\n\n### Fungus\nCotton-wool tufts on skin. Treat with an antifungal remedy and check water parameters.\n\n### Prevention beats cure\nGood filtration, regular water changes and not overstocking prevent most disease. We stock trusted medicines and can advise on the right one for your fish.",
  },
  {
    slug: "feeding-your-fish-right",
    title: "Feeding Your Fish Right: What, How Much and How Often",
    cat: "feeding", readTime: 5, lock: 3004, kw: "fish,food",
    excerpt: "The right diet means brighter colour, better health and cleaner water. Here's how to get feeding right.",
    tags: ["feeding", "nutrition"],
    content: "## Variety is key\n\nDifferent fish need different diets — herbivores like plecos need veg and algae, while oscars and cichlids need protein-rich pellets.\n\n### How much?\nFeed only what's eaten in ~2 minutes, once or twice a day. Uneaten food pollutes the water.\n\n### Mix it up\nAlternate quality flakes/pellets with frozen or live treats like bloodworm and brine shrimp for peak condition.\n\n### Colour foods\nColour-enhancing foods bring out natural reds and blues. Ask us for the best food for your species.",
  },
  {
    slug: "aquascaping-basics-planted-tank",
    title: "Aquascaping Basics: Designing a Beautiful Planted Tank",
    cat: "aquascaping", featured: true, readTime: 7, lock: 3005, kw: "aquascape,planted,aquarium",
    excerpt: "Turn a glass box into an underwater landscape. Learn the design principles behind stunning planted tanks.",
    tags: ["aquascaping", "plants", "design"],
    content: "## Design with intention\n\n### The rule of thirds\nPlace your focal point (driftwood or a rock) off-centre for a natural, pleasing composition.\n\n### Layering for depth\nUse foreground, midground and background plants to create a sense of depth — short plants in front, tall behind.\n\n### Hardscape first\nArrange driftwood and rocks before planting. This is the 'bones' of your scape.\n\n### Easy starter plants\nAnubias, java fern and amazon swords are hardy and forgiving. We stock all three plus everything you need to begin.",
  },
];
