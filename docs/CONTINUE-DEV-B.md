# Continuing — Developer B (Dev 2)

How Dev B picks up and finishes their track. Companion to
[DEV-PLAN.md](DEV-PLAN.md) (full split) and [STATUS.md](STATUS.md) (overall state).

**Your branch:** `dev-b` · **Track:** Events · Media · Contact + global UX polish
**Migration range:** `0020`–`0029` · **Last updated:** 2026-06-26

---

## 0. TL;DR
- ✅ Your core pages (Events, Media, Contact), admin managers, Crisp chat, and
  cookie consent are **built and committed** (`c9af76b`).
- 🟡 Some polish (language menu, Ge'ez banner, SiteChrome) is **uncommitted WIP** —
  commit it to `dev-b`.
- ✅ Environment is fixed: the project is **off OneDrive** now (Desktop is local),
  so `npm run dev` no longer crashes.
- ▶️ Remaining: finish Phase 8 polish + verify your three pages end-to-end.

---

## 1. Environment & how to run
- The repo lives at `C:\Users\alexa\Desktop\Projects\behere tsige` and is **no
  longer OneDrive-synced** (OneDrive Desktop backup was turned off). The old
  `.next/trace` build hang is gone.
- Run the app:
  ```
  npm run dev          # http://localhost:3000
  ```
- Apply DB migrations (reads .env.local automatically):
  ```
  npm run db:push
  ```

## 2. Your branch & workflow
```
git checkout dev-b            # your branch (already pushed)
# ...build a feature...
git add <your files>          # stage only YOUR files (never `git add -A`)
git commit -m "Dev B: ..."
git push origin dev-b
# open a PR: dev-b -> nextjs-migration
```
Work only in **your** files (below). Merge into `nextjs-migration` via PRs.
Pull `nextjs-migration` regularly to stay current with Dev A.

## 3. What's already DONE (committed in `c9af76b`)
- **Phase 3 — Events:** `app/(site)/events/page.jsx`, `screens/EventsView.jsx`,
  `lib/data/events.js`, admin `EventsManager`. Table `events` (migration 0020) +
  seed (0021).
- **Phase 4 — Media:** `app/(site)/media/page.jsx`, `screens/MediaView.jsx`,
  `lib/data/media.js`, admin `MediaLinksManager`. Table `media_links` (0020).
- **Phase 7 — Contact:** `app/(site)/contact/page.jsx`, `screens/ContactView.jsx`,
  `lib/data/contact.js`, admin `MessagesInbox`. Table `contact_messages` (0020).
- **Phase 8 (partial):** `ChatBubble` (Crisp) + `CookieConsent`, both mounted in
  `SiteChrome`. Both are correct client components.
- All three admin managers are registered in `src/components/admin/registry.js`.

## 4. What's IN FLIGHT (uncommitted — commit to `dev-b`)
These are modified/new in the working tree and need a commit on `dev-b`:
```
 M src/components/Donate.jsx        M src/components/Navbar.jsx
 M src/components/Icons.jsx         M src/components/News.jsx
 M src/components/MobileMenu.jsx    M src/components/SiteChrome.jsx
 M src/screens/ContactView.jsx     M src/screens/EventsView.jsx
 M src/screens/MediaView.jsx       ?? src/components/GeezComingSoon.jsx
```
This is the **Ge'ez "coming soon"** work (language menu now offers ge'ez;
`GeezComingSoon` banner prompts back to Amharic). Commit it:
```
git checkout dev-b
git add src/components/GeezComingSoon.jsx src/components/Navbar.jsx \
        src/components/MobileMenu.jsx src/components/SiteChrome.jsx \
        src/components/Icons.jsx src/components/News.jsx \
        src/components/Donate.jsx src/screens/ContactView.jsx \
        src/screens/EventsView.jsx src/screens/MediaView.jsx
git commit -m "Dev B: Ge'ez coming-soon + UX polish"
git push origin dev-b
```

> Note: `News.jsx` was superseded by Dev A's Articles feature (the `/articles`
> route now uses `ArticlesView`). Your `News.jsx` edits are harmless but unused —
> safe to drop if you like.

## 5. Remaining Dev B tasks
- [ ] **Commit the WIP above** to `dev-b` (Ge'ez + polish).
- [ ] **Verify the three pages end-to-end** (en + am): `/events`, `/media`,
      `/contact`. Confirm Events render from `events` (seeded), Media shows the
      links, and the **Contact form saves a row to `contact_messages`** (check it
      in admin → Contact Messages).
- [ ] **Crisp:** set the real `NEXT_PUBLIC_CRISP_WEBSITE_ID` in `.env.local`
      (and Vercel later); currently a placeholder default.
- [ ] **PageHero rollout:** ensure every inner page uses `components/PageHero.jsx`
      for a consistent hero (Events/Media/Contact + help Dev A's Articles adopt it).
- [ ] **Accessibility pass:** semantic landmarks, focus states, alt text, contrast,
      keyboard nav on menus/forms/banners.
- [ ] **Cookie consent:** confirm it gates any non-essential scripts (e.g. only
      load Crisp after acceptance, if desired).
- [ ] **Ge'ez:** keep it a clear "coming soon" (don't half-translate content).

## 6. Conventions (so you never conflict with Dev A)
- **One feature = one owner.** Your files: `events/`, `media/`, `contact/`,
  their data layers, their admin managers, `ChatBubble`, `CookieConsent`,
  `GeezComingSoon`, `PageHero`, and your `src/styles/*.css`.
- **`src/index.css` is frozen** — put new styles in `src/styles/<feature>.css`.
- **Migrations:** use **0020–0029** only. Never reuse a number Dev A might take
  (Dev A uses 0010–0019; Articles took 0010).
- **Admin registry:** add a manager by importing it and appending **one line** to
  `src/components/admin/registry.js`. (Dev A appends there too — keep additions to
  one line to make merges trivial.)
- **Shared files** (`Navbar`, `SiteChrome`, `layout`, `providers`): you own the
  global-UX changes (chat, consent, ge'ez, heroes). Coordinate before large edits.

## 7. Hand-offs with Dev A
- **Form security:** Dev A builds `src/lib/security/*` (captcha + rate limit). Your
  **Contact form** should adopt it once it lands.
- **PageHero:** you own it; Dev A's Articles page will reuse it.
- Both merge into `nextjs-migration`; resolve the rare `registry.js` line conflicts
  by keeping both entries.

## 8. Definition of done (per page)
Public page renders from the DB in **English + Amharic**, the admin can CRUD it,
RLS verified (a non-admin cannot write), and `npm run build` passes.

## 9. Commands
```
npm run dev                          # local dev (off OneDrive — no hang)
npm run build                        # production build
npm run db:push                      # apply migrations (range 0020–0029)
git checkout dev-b                   # your branch
git push origin dev-b                # then PR -> nextjs-migration
```
