# Behere Tsige St. Mary — Web Application Specification

> Living spec for the rebuild from a single landing page into a full,
> database-backed, multi-page web application. This document is the source of
> truth we approve before building. Updated as decisions are made.

**Status:** Draft for approval · **Last updated:** 2026-06-25

---

## 1. Goals

Transform the current single marketing page into a complete parish platform with:

- Multi-page public site (Home, Services, Events, Media, Articles, Donate, Contact)
- A database for all content and submissions
- A secure, non-public **admin dashboard** (CMS) controlling everything
- **User accounts** (Google, Apple, Meta/Facebook, email) for engagement
- **Payments** via Chapa (memorial services + donations)
- Clean **localization** (Amharic + English now, Ge'ez "coming soon")
- SEO, security, cookies/consent, accessibility, responsive, performance
- A "Let's chat" bubble on every page

## 2. Confirmed stack

| Layer | Choice |
|---|---|
| Framework | **Next.js (App Router)** — replaces the current Vite SPA |
| Database / Auth / Storage / Realtime | **Supabase** (Postgres) |
| Payments | **Chapa** (ETB) at launch + copy-paste bank details (incl. US); Stripe/PayPal for international cards in a later phase |
| Localization | next-intl — `am`, `en`, `ge'ez` (coming soon) |
| Chat | **Crisp** (free) — embedded on all pages |
| Hosting | Vercel (Next.js + Supabase + Chapa webhooks) |
| Email notifications | Resend (form/admin notifications) |
| Anti-abuse | Cloudflare Turnstile captcha + rate limiting on public forms |

Reference content sources: `https://www.eotcstgabriel.org/am` (am/en copy &
section style) and `https://beheretsegemaryam-socials.vercel.app/contact`
(contact + media links).

## 3. Roles & access

| Role | Can |
|---|---|
| **Public (anon)** | Read published content; submit forms (contact, confessor requests, registrations); pay |
| **Member (logged in)** | All of the above + like and comment on articles (nested replies) |
| **Author** | Write/edit own articles, submit for review |
| **Admin** | Full CRUD on all content; schedule/moderate articles; view all submissions & messages; manage donations; manage media/sermon links |
| **Super admin** | Manage admins, roles, and site settings |

Access enforced by Supabase **Row-Level Security (RLS)**. Admin dashboard at a
protected route, never indexed, role-gated server-side.

## 4. Data model (overview)

Grouped by domain. Columns abbreviated; `*_en` / `*_am` denote localized pairs.
All tables have `id`, `created_at` unless noted.

### Identity
- **profiles** — `id` (=auth user), `full_name`, `email`, `avatar_url`, `role`, `locale`
- **authors** — `profile_id?`, `name`, `bio`, `photo_url`

### Clergy & parish office (Home)
- **fathers** — `full_name_en/am`, `title_en/am`, `role`, `bio_en/am`, `photo_url`, `is_confessor`, `is_penance_father`, `phone`, `email`, `display_order`
- **members** — `full_name`, `role_en/am`, `department`, `photo_url`, `contact`, `bio`, `display_order`
- **confessor_requests** — `requester_name`, `phone`, `email`, `preferred_father_id→fathers`, `message`, `status`

### Services
- **liturgy_schedule** — `day_of_week`, `service_type` (mahlet/seatat/wazema/kidan/kidase), `title_en/am`, `start_time`, `note_en/am`, `week_start_date|recurring`
- **sunday_school** (config) — `message_en/am`, `plan_en/am`
- **ss_team** — `name`, `role`, `photo_url`, `bio`, `display_order`
- **ss_projects** — `title`, `description`, `type` (project/event), `date`, `poster_url`, `status`
- **ss_departments** — `name_en/am`, `description`
- **ss_registrations** — `department_id`, applicant fields, `status`
- **abnet** (config) — `mission_en/am`, `vision_en/am`
- **abnet_events** — `title`, `description`, `date`, `poster_url`
- **abnet_registrations** — applicant fields
- **evangelism** (config) — `head_priest_message_en/am`, `welcome_verses`
- **gospel_programs** — `title`, `description`, `poster_url`, `schedule`
- **sermons** — `title`, `youtube_url`, `published_at`, `display_order` (last 3 shown)
- **penance_resources** (config) — `application_url`, `guide_booklet_url`
- **confession_requests** — requester info, `father_id`, `status` *(privacy-sensitive)*
- **baptism_info** (config) — infant track + catechumen/returning track content
- **catechumen_registrations** — `name`, `contact`, `track`, `notes`
- **memorial_services** — `type` (fitehat/nefs-yimar/mut-amet-arba/be-tselot-asbugn…), `name_en/am`, `description`, `price`, `currency`
- **memorial_orders** — `service_id`, requester, `deceased_name`, `date`, `amount`, `payment_status`, `chapa_tx_ref`

### Events
- **events** — `title_en/am`, `description_en/am`, `poster_url`, `start_datetime`, `end_datetime`, `location`, `is_featured`, `status`

### Media
- **media_links** — `platform`, `handle`, `url`, `last_post_url`, `is_sunday_school`, `display_order`

### Articles
- **articles** — `slug`, `title_en/am`, `body_en/am`, `excerpt`, `cover_graphic_url`, `author_id`, `status` (draft/pending_graphics/scheduled/published/unlisted/archived), `scheduled_at`, `published_at`, `like_count`
- **tags** — `tag`; **articles_tags** — `article_id`, `tag_id`
- **article_likes** — `article_id`, `user_id`
- **article_comments** — `article_id`, `user_id`, `parent_comment_id?` (nested), `body`, `status`

### Donations
- **donation_projects** — `title_en/am`, `description_en/am`, `read_more_en/am`, `category`, `goal_amount`, `raised_amount`, `currency`, `accomplishments_en/am`, `status`, `cover_url`
- **contributions** — `project_id?`, `donor_name`, `amount`, `currency`, `method` (chapa/bank), `chapa_tx_ref`, `status`, `is_anonymous`, `message`
- **bank_accounts** — `bank_name`, `account_name`, `account_number`, `type` (local/international/us), `swift`, `routing`, `notes`, `display_order`

### Contact & system
- **contact_messages** — `name`, `email`, `phone`, `username`, `subject`, `message`, `status`, anti-spam meta
- **site_settings** — `key`, `value(jsonb)` — hero copy per page, feature flags, "coming soon" ge'ez, etc.

## 5. Page specifications

### 5.1 Home (3 sections)
1. **Hero** — keep current animated hero.
2. **About Us** — localized parish intro/history (admin-editable).
3. **Parish Office** — info on all office members (`members`), then the
   highlighted **"Get in contact with a Father Confessor"** block: bible quotes
   + a form (`confessor_requests`) with optional preferred father. Followed by
   the **list of fathers** with photos and short bios (`fathers`).

### 5.2 Services (7 sub-areas, each its own hero)
1. **Liturgy & night services** — this week's plan: mahlet, seatat, wazema,
   kidan, kidase, per day (`liturgy_schedule`).
2. **Sunday School** — message, plans for all, team profiles, yearly large
   projects/events, departments + registration forms.
3. **Abnet School** — mission, vision, registration, events, projects.
4. **Evangelism** — Melake Genet's welcome message + loving verses (e.g. Luke 15),
   gospel programs with custom poster graphics, **last 3 YouTube sermons**
   (links set in admin).
5. **Penance** — flow: find a penance father → confess → confession application
   + guide mini-booklet → prayer of repentance → absolution → penitential acts →
   blessing. Plus list of penance fathers w/ bios & photos. *(Privacy-first.)*
6. **Baptism & Catechumen** — two tracks: (a) infants/those ready for baptism;
   (b) catechumen courses & those returning from denial of faith — welcoming
   tone, re-learning process, taking qeder.
7. **Memorial services** — ፍትሐት, ነፍስ ይማር, ሙት ዓመት/አርባ, በፀሎት አስቡኝ, etc. with a
   **Chapa payment** gateway (`memorial_orders`).

### 5.3 Events
Welcoming hero → this week's events list: each with poster, description, date,
time, location. Admin-managed (`events`).

### 5.4 Media
All parish media + latest post per platform + Sunday school media. Sourced from
`beheretsegemaryam-socials.vercel.app`. Admin-managed (`media_links`).

### 5.5 Articles
- Public: latest **7** articles, then "read more" reveals the rest.
- Each card: cover graphic, title, author name + photo.
- Logged-in engagement: **like**, **comment** with **nested replies**.
- **Hashtags** + search & filters (site and admin).
- Authoring workflow: authors write → pending graphics → scheduled → published.
  Admin can edit, unlist, release, delete, moderate comments, schedule posts.

### 5.6 Donate & Give
- Opening quote (2 Cor 9:7).
- **Current projects** (parish, Sunday school, Abnet, general): accomplishments
  + gratitude, total needed, **live progress bar** (refreshed daily), **read more**,
  and a **"contribute to this project"** button each (`donation_projects`).
- **General donations** + Chapa gateway.
- Copy-paste **bank details**: local, international, US (`bank_accounts`).
- *(Placeholder account numbers/names until real details are provided.)*

### 5.7 Contact
Secure contact form: name, phone, username, email, subject, message → stored for
admin (`contact_messages`). Captcha + rate limiting. All contact info mirrored
from the socials site.

## 6. Admin dashboard
Protected `/admin`. Per-domain CRUD; article scheduling & moderation; donation
tracking dashboard (live); submissions inbox (contact, confessor, confession,
registrations, memorial orders); media & sermon link management; site settings;
role management. Audit-friendly.

## 7. Cross-cutting
- **Localization:** am + en throughout; ge'ez stubbed "coming soon".
- **SEO:** SSR/SSG, per-page metadata, sitemap.xml, robots, structured data.
- **Security:** RLS, server validation, captcha + rate limits, signed Chapa
  webhooks, secure admin auth, secrets in env.
- **Privacy/cookies:** consent banner, cookie + cache policy.
- **Accessibility:** semantic HTML, keyboard nav, contrast, alt text, ARIA.
- **Performance:** image optimization, caching, code splitting.
- **Chat:** "Let's chat" bubble on all pages.

## 8. Phased roadmap

| Phase | Deliverable |
|---|---|
| **0 — Foundation** | Next.js migration, Supabase setup, auth + admin shell, i18n, design system carried over, deploy |
| **1 — Home** | About, Parish Office, Father-Confessor forms, Fathers list + admin CRUD |
| **2 — Services** | 6 sub-areas incl. Chapa for memorials |
| **3 — Events** | Events list + admin |
| **4 — Media** | Socials aggregation |
| **5 — Articles** | Authoring, engagement, moderation, search |
| **6 — Donate** | Projects, realtime progress, Chapa, bank details |
| **7 — Contact** | Secure form + admin inbox |
| **8 — Polish** | Chat, cookie consent, SEO/sitemap, a11y + security hardening, ge'ez stub |

## 9. What we need from you

- **Accounts/keys:** Supabase, Chapa merchant, OAuth apps (Google, Apple
  [~$99/yr Apple Developer], Meta/Facebook), Resend.
- **Content:** father profiles + photos, weekly schedules, sermon links, project
  details, real bank details (placeholders used until then).
- **Decisions locked:** Chat = **Crisp**. Payments = **Chapa-only at launch**
  (+ copy-paste bank details incl. US; Stripe/PayPal in a later phase). Account
  setup = **guided step-by-step**.
