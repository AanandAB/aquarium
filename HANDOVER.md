# Happy Aquarium — Client Handover Guide

## What you're getting

A complete aquarium store website + admin CMS running on Cloudflare's free tier:
- **Storefront** — fish catalogue (49 species), accessories, gallery, contact form, WhatsApp CTAs
- **Admin CMS** — edit fish, products, blog, offers, homepage sections, settings
- **Hosting** — Cloudflare Workers + D1 database, ₹0/month indefinitely

---

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free)
- A [GitHub account](https://github.com/signup) (free)
- Node.js installed on your computer ([download](https://nodejs.org/))

---

## Step 1 — Fork the repository

1. Go to https://github.com/AanandAB/aquarium
2. Click **Fork** (top-right) → Create fork

---

## Step 2 — Clone to your computer

```bash
git clone https://github.com/YOUR_USERNAME/aquarium.git
cd aquarium
npm install
```

---

## Step 3 — Login to Cloudflare

```bash
npx wrangler login
```

This opens a browser — approve the connection.

---

## Step 4 — Create the database

```bash
npx wrangler d1 create happy-aquarium-db
```

Copy the `database_id` from the output. Open `wrangler.jsonc` and paste it on line 18:

```json
"database_id": "your-id-here",
```

Commit this change:

```bash
git add wrangler.jsonc && git commit -m "Update database ID" && git push
```

---

## Step 5 — Seed the database

```bash
npm run db:migrate:remote
npx wrangler d1 execute happy-aquarium-db --remote --file drizzle/seed-dump-clean.sql
```

This loads all 49 fish, 21 products, categories, blog posts, FAQs, navigation, and homepage layout.

---

## Step 6 — Set the admin password secret

```bash
npx wrangler secret put AUTH_SECRET
```

Enter a long random string (e.g., mash your keyboard for 30+ characters). Save this value — you'll need it if you ever change the Cloudflare project.

---

## Step 7 — Deploy to Cloudflare

Go to **Cloudflare Dashboard → Workers & Pages → Create → Workers Builds**.

1. Connect your GitHub account
2. Select the `aquarium` repository
3. Leave build settings as default:

   | Setting | Value |
   |---------|-------|
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |

4. Add environment variable:

   | Name | Value |
   |------|-------|
   | `AUTH_SECRET` | *(same value from Step 6)* |

5. Click **Save and Deploy**

Your site will be live at `https://happy-aquarium.YOUR_USERNAME.workers.dev` in about 3-5 minutes.

---

## Step 8 — Customize store details

Log into the admin panel at `/admin/login`:
- **Email:** `admin@happyaquarium.in`
- **Password:** `admin123`

**Do these immediately:**

1. **Change password** — Settings → scroll to Users section
2. **Update store info** — Settings:
   - Store name, tagline, description
   - Phone number, WhatsApp number
   - Address, area, city, state, pincode
   - Map coordinates (lat/lng)
   - Opening hours
   - Social media links (Instagram, Facebook, YouTube)
3. **Update homepage** — Homepage Builder:
   - Edit hero text, badges, CTAs
   - Reorder or hide sections
4. **Upload images** — Fish → click any fish → upload real photo
   - Each fish has a hero image field
   - Products also support image uploads
   - Images you upload go to Cloudflare R2 (needs setup — see below)

---

## Optional — Add your own domain

1. In Cloudflare Dashboard → Workers & Pages → `happy-aquarium`
2. Go to **Custom Domains** → Add your domain
3. DNS is handled automatically if the domain is on Cloudflare

---

## Optional — Image storage (R2)

Images uploaded through admin need an R2 bucket:

```bash
npx wrangler r2 bucket create happy-aquarium-media
```

Add to `wrangler.jsonc` under `d1_databases`:

```json
"r2_buckets": [
  {
    "binding": "MEDIA",
    "bucket_name": "happy-aquarium-media"
  }
]
```

Redeploy from the Cloudflare dashboard. Images will now persist properly.

---

## Admin capabilities

| Section | What you can do |
|---------|----------------|
| **Fish** | Add/edit/delete fish. 30+ fields: name, scientific name, category, price (single/pair), temperature, pH, difficulty, diet, care guide, images |
| **Products** | Manage accessories, equipment, food, medicines |
| **Enquiries** | View customer enquiries from the contact form |
| **Offers** | Create time-limited offers with countdowns |
| **Blog** | Write care articles, news posts |
| **Gallery** | Upload customer tank photos, store photos |
| **Testimonials** | Add customer reviews with ratings |
| **FAQs** | Edit frequently asked questions |
| **Categories** | Manage fish/product categories |
| **Homepage** | Add/remove/reorder homepage sections |
| **Settings** | Store info, contact, socials, SEO metadata |

---

## Rate types (pair vs single)

- **Pair rate** (35 fish): guppies, mollies, tetras, cichlids, goldfish, catfish, gouramis — price is for a pair
- **Single rate** (14 fish): bettas, flowerhorn, alligator gar, snails, large predators — price is per fish

Edit in admin → Fish → click a fish → scroll to "Rate Type" dropdown.

---

## Updating prices

1. Go to `/admin/fish` or `/admin/products`
2. Click any item
3. Edit the Price and Offer Price fields
4. Save

Changes appear instantly on the live site.

---

## Re-seeding after customization

If you want to reset the database to factory state:

```bash
# Re-seed local (preview)
npm run db:seed:local

# Export + clean
npx wrangler d1 export happy-aquarium-db --local --output drizzle/seed-dump.sql
py -3.12 _clean_dump.py

# Push to production
npx wrangler d1 execute happy-aquarium-db --remote --file drizzle/seed-dump-clean.sql
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Site shows "Worker not found" | Wait 3-5 min for deployment to finish |
| Categories show no fish | Database wasn't seeded — redo Step 5 |
| Images not loading | Upload images via admin panel or set up R2 (see above) |
| Admin login fails | Verify `AUTH_SECRET` matches in Workers Builds env vars |
| Build fails on deploy | Run `npm run typecheck` locally to find TypeScript errors |

---

## Support

For code-level issues, the original developer can be reached through the GitHub repository. For Cloudflare-specific issues, [Cloudflare Workers docs](https://developers.cloudflare.com/workers/) are the best resource.

---

*Built with Next.js 16, React 19, Cloudflare Workers, D1, Tailwind CSS v4, Drizzle ORM.*
