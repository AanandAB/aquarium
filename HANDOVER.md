# 🐠 Happy Aquarium — Client Handover Guide

This document is for the **client** (the aquarium store owner) or anyone setting up
the website on a new Cloudflare account. It explains, step by step, how to get the
site live, and how to run it day-to-day.

**Two ways to set up:**

- **Option A (easiest):** you (the developer) do everything for the client — you just
  need their Cloudflare login or an API token. See *Part 1*.
- **Option B:** the client does it themselves following the commands in *Part 2*.

After setup, the client manages everything from the admin panel — see *Part 3*.

---

## Part 1 — Do it for the client (you have their Cloudflare access)

If the client has **forked** the repo already, and gives you their Cloudflare
credentials (login, or better, an API token), here is the exact sequence.

### 1.1 Get access

Ask the client to create an API token (safer than sharing a password):

1. Cloudflare Dashboard → **My Profile** (top-right icon) → **API Tokens**
2. Create Token → use the **"Edit Cloudflare Workers"** template
3. Copy the token **and** their **Account ID** (shown on the right sidebar of the dashboard)

### 1.2 Log in as them

```bash
export CLOUDFLARE_API_TOKEN=<the token>
export CLOUDFLARE_ACCOUNT_ID=<their account id>
```

### 1.3 Create the database

```bash
npx wrangler d1 create happy-aquarium-db
```

Copy the returned `database_id`.

### 1.4 Update `wrangler.jsonc` with their database id

In the client's fork, edit `wrangler.jsonc` and replace the `database_id` value with
theirs. Commit + push.

### 1.5 Create the schema + load all content

```bash
npm install
npm run db:migrate:remote
npx wrangler d1 execute happy-aquarium-db --remote --file drizzle/seed-dump-clean.sql
```

This loads **49 fish, 21 products, all categories, nav, blog, FAQs, offers,
testimonials, homepage layout, and the default admin user.**

### 1.6 Set the auth secret

```bash
npx wrangler secret put AUTH_SECRET
```

Paste a long random string (mash the keyboard for 30+ characters). Save it — you'll
need the same value in the Workers Builds env var below.

### 1.7 Connect GitHub → Cloudflare Workers Builds

1. Cloudflare Dashboard → **Workers & Pages → Create → Workers Builds**
2. Connect the client's GitHub account, select the forked repo
3. Set the build config:

   | Setting | Value |
   |---------|-------|
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |

4. Add environment variable:

   | Name | Value |
   |------|-------|
   | `AUTH_SECRET` | *(same value from step 1.6)* |

5. **Save and Deploy.** The site goes live at
   `https://happy-aquarium.<client>.workers.dev` in ~5 minutes.

> ⚠️ **Important:** the build command MUST be `npm run build` and deploy command
> MUST be `npx wrangler deploy`. Any other combo will fail. (The `build` script in
> `package.json` already points to the full OpenNext build, so `npm run build`
> produces everything `npx wrangler deploy` needs.)

---

## Part 2 — Client does it themselves (step by step)

### Prerequisites
- Cloudflare account (free)
- GitHub account (free)
- Node.js installed

### Steps

```bash
# 1. Fork the repo on GitHub (button in top-right), then clone it
git clone https://github.com/THEIR_USERNAME/aquarium.git
cd aquarium
npm install

# 2. Log in to Cloudflare
npx wrangler login

# 3. Create the database — copy the database_id
npx wrangler d1 create happy-aquarium-db

# 4. Edit wrangler.jsonc — paste the database_id, commit + push

# 5. Create schema + load all content
npm run db:migrate:remote
npx wrangler d1 execute happy-aquarium-db --remote --file drizzle/seed-dump-clean.sql

# 6. Set the auth secret
npx wrangler secret put AUTH_SECRET
```

Then connect GitHub to Workers Builds exactly as in **Part 1.7**.

---

## Part 3 — Running the site day-to-day

### Log in to the admin panel

Go to `https://your-site/admin/login`

- **Email:** `admin@happyaquarium.in`
- **Password:** `admin123`

> 🔴 **Do this first:** change the password (Settings → Users).

### The complete admin guide

A full, plain-English guide with screenshots-style instructions is in this repo as
**`ADMIN-GUIDE.html`** — just double-click it to open in any browser. It covers:

- Adding / editing / deleting fish
- Adding accessories &amp; products
- Uploading images
- Pair vs single pricing
- Setting up variants (sizes, wattages, colour types)
- Creating offers &amp; discounts
- Managing categories, gallery, testimonials, FAQs
- Editing the homepage sections
- Updating store info (phone, WhatsApp, address, map, hours, socials)
- Handling customer enquiries
- Changing the password

### Key facts to remember

| Thing | Detail |
|-------|--------|
| Admin URL | `/admin/login` |
| Fish in catalogue | 49 species |
| Products | 21 items |
| Pair rate | default for most fish (guppies, tetras, cichlids, etc.) |
| Single rate | bettas, flowerhorn, alligator gar, snails, large predators |
| Variants | link same-item versions (e.g. LED 10W/15W/20W) via the Variants dropdown |
| WhatsApp | set in Settings — must be international format, e.g. `919947770808` |

### Re-seeding / resetting to factory state

If the client ever wants to wipe and restore the original content:

```bash
npm run db:migrate:remote
npx wrangler d1 execute happy-aquarium-db --remote --file drizzle/seed-dump-clean.sql
```

---

## Files in this repo (what's what)

| File | Purpose |
|------|---------|
| `HANDOVER.md` | This guide |
| `ADMIN-GUIDE.html` | Plain-English admin manual (open in browser) |
| `drizzle/seed-dump-clean.sql` | One-shot full content import (49 fish + 21 products + everything) |
| `drizzle/migrations/` | Database schema migrations |
| `wrangler.jsonc` | Cloudflare config — **the client must put their own `database_id` here** |
| `src/db/seed/` | The seed data source files |
| `public/images/fish/` | 49 real fish photos |

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Deploy fails "Could not find compiled Open Next config" | Deploy command is wrong — must be `npx wrangler deploy` and build must be `npm run build` |
| Site shows no fish | Database wasn't seeded — re-run the `seed-dump-clean.sql` import |
| Admin login fails | `AUTH_SECRET` env var doesn't match the secret you set |
| Images missing | Upload them via admin, or check `public/images/fish/` exists |
| Custom domain not working | Add it in Cloudflare → Workers → Triggers → Custom Domains |
| Categories empty | The category has no fish assigned — edit the fish and set its category |

---

*Built with Next.js 16, React 19, Cloudflare Workers + D1, Tailwind CSS v4, Drizzle ORM.*
