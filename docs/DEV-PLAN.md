# Two-Developer Plan — Parallel, Conflict-Free

**Goal:** finish Phases 3–8 fast by splitting work between **two developers** whose
tasks touch **different files**, so merges stay clean. See
[STATUS.md](STATUS.md) for where we are and [PROJECT-SPEC.md](PROJECT-SPEC.md) for full scope.

---

## 0. Environment fix (do this first, once)
Move the repo out of OneDrive to end sync + build hangs:
```
move "C:\Users\alexa\OneDrive\Desktop\Projects\behere tsige" "C:\dev\behere-tsige"
```
(Stop the dev server first.) Both developers then work from `C:\dev\behere-tsige`
(or their own clone of the `nextjs-migration` branch).

---

## 1. The golden rules (what keeps it harmonious)
These conventions mean the two tracks almost never edit the same file:

1. **One feature = one owner.** A page and its route, view, data layer, components,
   admin manager, and migration belong to a single developer.
2. **Per-feature CSS files.** `src/index.css` is **frozen** — no new rules there.
   New styles go in `src/styles/<feature>.css`, imported by that feature's view.
3. **Migration number ranges** (never reuse a number):
   - **Dev A → `0010`–`0019`** (then `0040`–`0049`)
   - **Dev B → `0020`–`0029`** (then `0050`–`0059`)
4. **Admin tabs via a registry** (see Foundation F1) — adding a manager is a new
   file + one append line, not an edit to shared dashboard JSX.
5. **Own data files.** Each feature gets `src/lib/data/<feature>.js`. No shared data file.
6. **Feature branches + small PRs**, merged into `nextjs-migration` daily. Run
   `NEXT_TELEMETRY_DISABLED=1 npm run build` before each merge.
7. **Shared files have a single owner for any change:** `layout.jsx`, `providers.jsx`,
   `Navbar.jsx`, `AdminDashboard.jsx`. Touch only via the Foundation tasks below.

---

## 2. Foundation (build & merge BEFORE parallel work — ~half a day)
Do these two first so neither dev reinvents shared pieces.

- **F1 — Admin registry (Owner: Dev A).** Refactor `AdminDashboard.jsx` to map over
  an array imported from `src/components/admin/registry.js`
  (`[{ id, label, Component }]`). Each future manager registers itself there.
  *After this, no one edits AdminDashboard again.*
- **F2 — PageHero + CSS convention (Owner: Dev B).** Build a reusable
  `src/components/PageHero.jsx` (+ `src/styles/page-hero.css`) for every inner
  page's hero, and set up the `src/styles/<feature>.css` import pattern.

---

## 3. Developer A — "Engagement & Money" (stateful / backend-heavy)

### Phase 5 — Articles  (migrations 0010–0013)
- DB: `articles, authors, tags, articles_tags, article_likes, article_comments` + RLS.
- Data: `src/lib/data/articles.js`
- Public: `app/(site)/articles/page.jsx`, `screens/ArticlesView.jsx`,
  `components/articles/*` (card, like button, nested comments), `styles/articles.css`
- Admin: `components/admin/ArticlesManager.jsx`, `CommentsModerationManager.jsx`
- Features: latest-7 + read-more, hashtags, search/filter, likes & nested comments
  (logged-in), authoring → schedule → publish, moderation.

### Phase 6 — Donate + Chapa  (migrations 0014–0016)
- DB: `donation_projects, contributions, bank_accounts` + RLS.
- Data: `src/lib/data/donations.js`
- Public: `app/(site)/donate/page.jsx`, `screens/DonateView.jsx`,
  `components/donate/*` (project card + live progress bar), `styles/donate.css`
- Payments: `app/api/chapa/initiate/route.js`, `app/api/chapa/webhook/route.js`
  (env: `CHAPA_SECRET_KEY`)
- Admin: `ProjectsManager.jsx`, `BankAccountsManager.jsx`, `ContributionsInbox.jsx`

### Phase 8 share
- Social logins (Google / Apple / Meta) — auth changes.
- SEO: `app/sitemap.js`, `app/robots.js`, per-page `metadata`.
- Form security util `src/lib/security/*` (captcha + rate limit) used by forms.

---

## 4. Developer B — "Content & Communication" (CRUD / presentation) + global UX

### Phase 3 — Events  (migrations 0020–0021)
- DB: `events` + RLS.  Data: `src/lib/data/events.js`
- Public: `app/(site)/events/page.jsx`, `screens/EventsView.jsx`,
  `components/events/*`, `styles/events.css` (uses **PageHero**)
- Admin: `components/admin/EventsManager.jsx`

### Phase 4 — Media  (migrations 0022–0023)
- DB: `media_links` + RLS.  Data: `src/lib/data/media.js`
- Public: `app/(site)/media/page.jsx`, `screens/MediaView.jsx`, `styles/media.css`
  (aggregate socials + latest post per platform; source:
  `beheretsegemaryam-socials.vercel.app`)
- Admin: `components/admin/MediaLinksManager.jsx`

### Phase 7 — Contact  (migrations 0024–0025)
- DB: `contact_messages` + RLS.  Data: `src/lib/data/contact.js`
- Public: `app/(site)/contact/page.jsx`, `screens/ContactView.jsx`, `styles/contact.css`
  (secure form: name/phone/username/email/subject/message + captcha + rate limit)
- Admin: `components/admin/MessagesInbox.jsx`

### Phase 8 share
- **Crisp** chat bubble — `components/ChatBubble.jsx`, mounted once in site layout.
- **Cookie consent** banner — `components/CookieConsent.jsx`.
- Accessibility pass; **Ge'ez "coming soon"** localization; roll PageHero onto all pages.

---

## 5. Shared-file conflict matrix
| File | Who edits it | How conflicts are avoided |
|------|--------------|---------------------------|
| `AdminDashboard.jsx` | nobody after F1 | registry pattern |
| `Navbar.jsx` | nobody | all routes already linked |
| `layout.jsx` / `providers.jsx` | Dev B (chat + consent only) | single owner, one-time |
| `index.css` | nobody | frozen; per-feature CSS files |
| `supabase/migrations/` | both | assigned number ranges |
| `lib/data/*` | per feature | one file per feature |

---

## 6. Cadence & done-criteria
- Each feature: branch → build green → small PR → merge to `nextjs-migration` daily.
- Migrations applied with `npm run db:push` (reads `.env.local`).
- **Definition of done per phase:** public page renders from DB in **en + am**,
  admin can CRUD it, RLS verified (non-admin can't write), build passes.
- **Deploy (joint, after both tracks land):** one owner connects Vercel to the
  branch, sets env vars (Supabase, Chapa, Crisp), then merge `nextjs-migration → main`.

---

## 7. Quick ownership summary
| | **Dev A** | **Dev B** |
|---|---|---|
| Foundation | F1 admin registry | F2 PageHero + CSS convention |
| Phases | 5 Articles, 6 Donate+Chapa | 3 Events, 4 Media, 7 Contact |
| Polish | social login, SEO, form security | Crisp chat, cookie consent, a11y, ge'ez, heroes |
| Migrations | 0010–0019 | 0020–0029 |
