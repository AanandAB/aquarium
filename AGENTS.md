# Happy Aquarium — Project Context (read me first)

> Auto-loaded context for future Hermes/agent sessions working on this repo.
> This file is the single source of truth for project state. Update it when state changes.

## What this is

A live aquarium storefront for **Happy Aquarium, Kerala** — a Next.js app running on
Cloudflare Workers + D1 (free tier). Includes a full admin CMS the (non-technical)
client uses to manage fish, accessories, images, offers, and enquiries.

## Stack

- **Next.js 16.2.10** (App Router, webpack), React 19, TypeScript
- **Tailwind CSS v4**, Drizzle ORM, GSAP + Lenis (animations)
- **Cloudflare Workers** via OpenNext (`@opennextjs/cloudflare` 1.20.1)
- **D1 database** `happy-aquarium-db`
- Live URL: `https://happy-aquarium.aanandab44.workers.dev`
- Repo: `https://github.com/AanandAB/aquarium` (branch `main`)

## Current live state

- 49 fish species, 21 products, 28 categories
- **rateType**: 14 "single" (betta, alligator gar, all 4 snails, flowerhorn,
  giant gourami, black ghost, red tail catfish, jaguar, tricolour cichlid, EVJD,
  Thailand oscar) / 35 "pair". Shown as "per fish" / "per pair" on cards + detail.
- **Variants**: admin VariantPicker dropdown links same-item versions (e.g. LED 10W/
  15W/20W, alligator gar sizes). Stored as `variant_ids` (JSON array of IDs — query
  by `id`, NOT slug). Displayed as "Also available in" cards on detail pages.
- Real fish photos in `public/images/fish/{slug}.jpg` (49 images, Wikipedia-sourced).
  Products still use picsum placeholders — client uploads own product photos.
- Compatibility / Planner / Blog removed from nav; `/compatibility` page deleted.

## Key files

| Path | Purpose |
|------|---------|
| `src/db/schema.ts` | Drizzle schema (fish, products, categories, offers, blog, nav, etc.) |
| `src/db/seed/` | Seed data (data-fish-a..d.ts = 49 fish, data-products.ts, data-categories.ts) |
| `scripts/seed.ts` | Seed runner (`rateType` via slug allowlist; fish image paths) |
| `src/lib/queries.ts` | Public read queries (fishSelect/productSelect use `getTableColumns`) |
| `src/lib/admin.ts` | Admin queries (listFishAdmin, listProductsAdmin, etc.) |
| `src/app/admin/actions.ts` | Server actions (saveFish, saveProduct, delete, toggle publish) |
| `src/components/admin/AdminSidebar.tsx` | Admin sidebar (mobile drawer + desktop) |
| `src/components/admin/VariantPicker.tsx` | Variant multi-select dropdown (stores IDs) |
| `src/app/(site)/fish/[slug]/page.tsx` | Fish detail (price, per-pair/fish, variants, stat grid) |
| `src/app/(site)/accessories/[slug]/page.tsx` | Product detail (specs, variants) |
| `src/components/cards/FishCard.tsx` | Fish card (per-pair/fish label) |
| `drizzle/migrations/` | 0000–0007 schema migrations |
| `drizzle/seed-dump-clean.sql` | Idempotent full content import (49 fish + 21 products) |
| `public/images/fish/` | 49 real fish photos |

## Client handover

- `HANDOVER.md` — full 3-part setup guide (Part 1: dev does it via API token;
  Part 2: client DIY; Part 3: day-to-day admin)
- `ADMIN-GUIDE.html` — plain-English admin manual (open in browser), 16 topics
- Admin login: email `admin@happyaquarium.in`, password `admin123` (client must change)
- `AUTH_SECRET` set via `npx wrangler secret put AUTH_SECRET`
- Cloudflare Access (Google OAuth) recommended as extra `/admin` gate (free ≤50 users)

## Deploy workflow (CRITICAL — read before deploying)

- **Local deploy:** `npm run deploy` (runs `opennextjs-cloudflare build` then
  `opennextjs-cloudflare deploy`).
- **`build` script MUST stay `next build --webpack`.** Do NOT set it to
  `opennextjs-cloudflare build` — that command internally calls `npm run build`,
  causing infinite recursion.
- **No CI/CD.** Pushing to GitHub does NOT deploy. "Push redeploy" = push + run
  `npm run deploy` (or Cloudflare Workers Builds with build=`npm run build`,
  deploy=`npx wrangler deploy`).
- **Windows file lock gotcha:** a running `next dev` server locks `.open-next`
  (`EPERM`, "Device or resource busy"). Kill node processes (`taskkill //PID <pid> //F`)
  before deploying. Check with `wmic process where "name='node.exe'" get ProcessId,CommandLine`.
- D1 is bound as `env.DB`; assets as `env.ASSETS`.

## Data / DB gotchas

- Local D1 can drift out of sync (missing columns). Regenerate seed dump from
  **remote** (which is authoritative/live): `npx wrangler d1 export happy-aquarium-db
  --remote --output drizzle/seed-dump.sql`, then `py -3.12 _clean_dump.py`.
- `_clean_dump.py` strips `d1_migrations` + CREATE TABLE/INDEX, prepends DELETEs
  (FK-safe order), writes `drizzle/seed-dump-clean.sql`.
- Migrate remote: `npx wrangler d1 migrations apply happy-aquarium-db --remote`.
- VariantPicker submits product/fish **IDs** (hidden inputs). Display queries must
  use `inArray(<table>.id, ids)` — not slug.

## Non-obvious conventions

- Freshwater fish only. Pair is default rate; single via slug allowlist in seed.
- Tailwind uses custom tokens: `text-ink`, `text-aqua`, `text-clay`, `text-teal`,
  `bg-[#fffdf8]`, `glass` / `glass-strong` (site, light) vs `bg-[#04121c]` (admin, dark).
- WhatsApp number in Settings must be international format, no `+` (e.g. `919947770808`).
- `formatPrice` / `discountPct` / `whatsappHref` in `src/lib/utils.ts`.

## Last known good deploy

Version ID `0864d7f7` — mobile admin UI (sidebar drawer + card lists), per-pair/fish
labels, variants, compatibility removed, all live.
