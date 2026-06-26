# Behere Tsige — Project Status & How to Continue

**Last updated:** 2026-06-26 · **Branch:** `nextjs-migration` (not yet merged to `main`)

This is the living "where are we / what's next" doc. The full requirements live in
[PROJECT-SPEC.md](PROJECT-SPEC.md); this file tracks progress against it.

---

## 1. Snapshot

- **Stack:** Next.js (App Router) · Supabase (Postgres + Auth + Storage) · Vercel · Chapa (planned) · Crisp (planned)
- **Repo:** `github.com/alexanderkebe/behere-tsige-website`
- **Active branch:** `nextjs-migration` — all the full-app work lives here.
- **`main`:** still the OLD Vite single-page site (untouched, still what's live on the domain). **Nothing here is deployed to production yet.**
- **Supabase project ref:** `tozstfdnhjtldigdiscv` (region eu-west-1)

> ⚠️ **The Next.js app has not been deployed.** When ready, we point Vercel at this
> branch (or merge to `main`) and set the env vars in the Vercel dashboard.

---

## 2. What's done ✅

### Phase 0 — Foundation
- Migrated Vite → **Next.js App Router**. Route group `(site)` holds the public
  pages with shared Navbar/Footer chrome; `/admin` is separate.
- App-wide **language switch** (en/am) via `LanguageContext`.
- **Supabase** wired in: browser + server clients (`src/lib/supabase/`), env in
  gitignored `.env.local`. Connectivity verified.
- **Supabase CLI** automation set up (apply migrations without copy-paste).

### Phase 1 — Home
- **3-section home:** Hero · About · Parish Office.
- **About:** original two-column layout (heritage text + Parish Life Gallery
  carousel); **Learn More** expands redesigned Vision / Mission / Community /
  History feature cards (boilerplate text in-component for now).
- **Parish Office (Parish Council / ሰበካ ጉባዔ):** council intro, members grid,
  **Our Fathers** list, then the **Father-Confessor contact form** (writes to
  `confessor_requests`). Fed by **live Supabase data**.

### Phase 2 — Services
- `/services` page (`ServicesView.jsx`) with: **Liturgy & night services**
  schedule, **Sunday School**, **Abnet School**, **Evangelism** (+ sermons),
  **Penance**, **Baptism & Catechumen**, **Memorial services**.
- Data layer `src/lib/data/services.js`: `getSiteSettings`, `getLiturgySchedule`,
  `getSundaySchoolData`, `getAbnetData`, `getEvangelismData`, `getMemorialServices`.
- Schema + seed migrations `0005`, `0006` applied (liturgy schedule seeded).

### Admin dashboard
- `/admin` — **Supabase-auth** app (email login/signup + admin role gate).
- **Fathers** CRUD + photo upload; **Parish Council members** CRUD + photo upload;
  **Confessor Requests** inbox with status management.
- All writes enforced by **Row-Level Security** (only admins can mutate).

---

## 3. Database state (verified live)

Migrations in `supabase/migrations/`, applied **through 0006**:

| # | File | Creates |
|---|------|---------|
| 0001 | phase1 | profiles, fathers, members, confessor_requests + RLS, triggers, `media` storage bucket |
| 0002 | seed_fathers | 8 boilerplate fathers |
| 0003 | seed_council | 7 parish-council members |
| 0004 | admin_bootstrap | auto-admin for allow-listed email (`alexanderkebe@gmail.com`) |
| 0005 | phase2_services | liturgy_schedule, memorial_services, site_settings (+ Sunday School / Abnet / Evangelism config) |
| 0006 | seed_liturgy | weekly liturgy schedule seed |

Verified present via REST: `fathers`, `members`, `liturgy_schedule`,
`memorial_services`, `site_settings`. (`sunday_school` / `evangelism` are **config
rows in `site_settings`**, not their own tables — 404 on direct query is expected.)

### How to apply a new migration (the WORKING command)
The npm `db:push` script does **not** expand `${SUPABASE_DB_PASSWORD}` on Windows.
Use this from Git Bash instead (port 6543 because the dev network blocks 5432):

```bash
set -a; source .env.local; set +a
npx supabase db push --db-url "postgresql://postgres.tozstfdnhjtldigdiscv:${SUPABASE_DB_PASSWORD}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
```

> TODO: replace the `db:push` npm script with a small Node script
> (`scripts/db-push.mjs`) that reads `process.env` so it works cross-shell.

---

## 4. Admin access

1. Go to `/admin` → **Sign up** with **alexanderkebe@gmail.com** (migration 0004
   auto-grants this email the `admin` role on signup).
2. If signup is blocked by email confirmation, either confirm via the email, or
   disable confirmation in Supabase → Authentication → Providers → Email
   ("Confirm email" off).
3. To make a different/extra admin: add the email to the allow-list in a new
   migration, or run `update profiles set role='admin' where email='…';`.

---

## 5. Known issues & gotchas

- ⚠️ **Secrets were pasted in chat earlier** (access token + DB password). **Rotate
  both** when convenient: regenerate the access token, reset the DB password, then
  update `.env.local`.
- ⚠️ **Local build can hang** on `.next/trace` because the project sits under
  `Desktop` (OneDrive-synced). Always build with `NEXT_TELEMETRY_DISABLED=1`, and
  ideally move the project to a non-OneDrive path (e.g. `C:\dev\behere-tsige`).
- The untracked `build_error.txt`, `dev_logs.txt`, `error.html` are transient debug
  artifacts (now gitignored).
- Inner pages (`/events`, `/media`, `/articles`, `/donate`, `/contact`) still use
  the **old hardcoded components** — not yet on Supabase.
- The "About" Vision/Mission/etc. text and the council intro are **in-component
  boilerplate**, not yet admin-editable.

---

## 6. How to continue — roadmap

### Immediate next steps (pick up here)
1. **Verify Phase 2 end-to-end** — run `NEXT_TELEMETRY_DISABLED=1 npm run dev`, open
   `/services`, confirm liturgy/memorial render from the DB in both languages.
2. **Admin for Services** — add managers so staff can edit the liturgy schedule,
   memorial services, and the Sunday School / Abnet / Evangelism `site_settings`
   (incl. the 3 sermon YouTube links).
3. **Make `db:push` robust** (Node script) and **rotate secrets**.

### Remaining phases (per spec)
- [ ] **Phase 3 — Events:** `events` table + admin CRUD; replace hardcoded `/events`.
- [ ] **Phase 4 — Media:** `media_links` table + admin; aggregate socials on `/media`.
- [ ] **Phase 5 — Articles:** authoring workflow, scheduling, hashtags, search, likes,
      nested comments, moderation; "latest 7 + read more".
- [ ] **Phase 6 — Donate:** `donation_projects` + `contributions` + `bank_accounts`;
      live progress bars; **Chapa** integration; copy-paste bank details.
- [ ] **Phase 7 — Contact:** `contact_messages` table + secure form (captcha/rate
      limit) + admin inbox (replace the current mailto form).
- [ ] **Phase 8 — Polish:** Crisp chat bubble, cookie consent, SEO (sitemap/metadata),
      accessibility pass, Ge'ez "coming soon", social logins (Google/Apple/Meta),
      per-page hero sections, security hardening.

### Cross-cutting still open
- Dedicated **hero sections** for each inner page.
- Move About / council / services boilerplate into DB + admin editors.
- **Deploy** this branch to Vercel (env vars) and eventually merge to `main`.

---

## 7. Command reference

```bash
# Dev (avoids the OneDrive build hang)
NEXT_TELEMETRY_DISABLED=1 npm run dev

# Production build locally
NEXT_TELEMETRY_DISABLED=1 npm run build

# Apply DB migrations (see §3 for why this exact form)
set -a; source .env.local; set +a
npx supabase db push --db-url "postgresql://postgres.tozstfdnhjtldigdiscv:${SUPABASE_DB_PASSWORD}@aws-0-eu-west-1.pooler.supabase.com:6543/postgres"
```

## 8. What we still need from you
- **Rotate** the exposed access token + DB password (see §5).
- Real **content**: father photos, schedules, sermon YouTube links, event posters,
  donation projects, **real bank details** (placeholders in use).
- Accounts when their phase arrives: **Chapa** merchant, **Crisp**, OAuth apps
  (Google / Apple / Meta) for social login.
