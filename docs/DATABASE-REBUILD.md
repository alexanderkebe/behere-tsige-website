# Supabase database — initialized 2026-09-13

Project: `beheretsegemaryam` (`bnwkxmlmajwvqkyykirj`).
URL: `https://bnwkxmlmajwvqkyykirj.supabase.co`.

The user approved reusing this healthy project after checks confirmed zero public
relations, Auth users, storage buckets/objects, and migration schemas. The old
reference `tozstfdnhjtldigdiscv` is no longer used by the local application.

## Schema source

All 27 SQL files in `supabase/migrations`, through migration 0039, were applied
in filename order inside one transaction through the Management API. The
bootstrap records each original version, name, and SQL in
`supabase_migrations.schema_migrations` for migration-history compatibility.
The SQL executed successfully against the hosted database.

| Area | Final tables |
| --- | --- |
| Accounts and parish | `profiles`, `fathers`, `members`, `confessor_requests` |
| Settings and schedules | `site_settings`, `site_content`, `annual_feasts`, `weekly_schedule` |
| Sunday School | `ss_team`, `ss_projects`, `ss_departments`, `ss_registrations` |
| Abnet School | `abnet_events`, `abnet_registrations` |
| Teaching and sacraments | `gospel_programs`, `sermons`, `confession_requests`, `catechumen_registrations`, `memorial_services`, `memorial_orders` |
| Articles | `authors`, `articles`, `tags`, `articles_tags`, `article_likes`, `article_comments` |
| Events and messages | `events`, `media_links`, `contact_messages` |
| Donations and sponsorships | `donation_projects`, `contributions`, `bank_accounts`, `dejeselam_sponsorships` |
| Analytics | `interactions` |

There are 34 final public tables, all with RLS enabled. Migration 0029 removes
the historical `liturgy_schedule`; the current site uses `annual_feasts` and
`weekly_schedule`. Supabase supplies the Auth/storage schemas. Migration 0001
creates the public `media` bucket and admin upload policies.

Views: `articles_with_stats`, `dejeselam_public`.
Functions: `is_admin`, `handle_new_user`, `analytics_summary`, `article_stats`,
`toggle_article_like`, `record_article_view`, `admin_set_role`.

## Verification

`node scripts/check-database-schema.mjs` passed static coverage for literal
table/view and RPC references. This is not a complete security audit.

`node scripts/verify-admin-access.mjs --project=bnwkxmlmajwvqkyykirj` passed
live Auth and RLS checks. It verifies admin sign-in, public reads, private profile
protection, blocked visitor/member writes and role changes, and admin content
writes. Its temporary member and test content were removed.

The local production build passed with this database. No website deployment,
repository push, or deployment environment update has been performed.

## Data and operations

The database contains the content seeded by the repository. It does not restore
old submissions, uploaded media, or edits that existed only in the missing
project. Review placeholder bank details, sample donation totals, article
comments/counters, and other sample content before publishing.

`scripts/bootstrap-database.mjs` is for empty projects only. Do not use it for
incremental migrations or replay old seed migrations on this populated database.
It will refuse a populated target.

The active local connection is in ignored `.env.local`; the previous values are
in ignored `.env.before-supabase-rebuild.local`. The administrator's generated
password is in ignored `admin-credentials.local`. See [admin rollout](ADMIN-ROLLOUT.md)
for the remaining deployment steps.
