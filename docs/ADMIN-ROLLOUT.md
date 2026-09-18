# Admin access — database ready, website deployment pending

The active Supabase project is `beheretsegemaryam` (`bnwkxmlmajwvqkyykirj`).
On 2026-09-13 the user approved using this project after it was verified empty.

The local `/admin` page is sign-in only. Hosted public signup is disabled.
The administrator is `alexanderkebe@gmail.com`, with the `super_admin` role.
The generated password is in ignored `admin-credentials.local`; never commit
that file or put the password in frontend code.

## Completed

- Applied all 27 repository migrations in a single transaction through the
  Supabase Management API, preserving versions in
  `supabase_migrations.schema_migrations`.
- Created 34 public tables, two views, seven public functions, and the public
  `media` storage bucket. All 34 tables have RLS enabled.
- Applied migration 0039: email addresses no longer automatically grant admin.
- Configured email/password sign-in, disabled public signup, and set the site URL.
- Updated the ignored local environment with the new URL and project keys.
  The prior environment is backed up in `.env.before-supabase-rebuild.local`.
- Privately created and verified the administrator. No existing accounts needed
  deletion; the project had zero Auth users.
- Verified public reads, private profile visibility, blocked anonymous/member
  writes, blocked member role escalation, and successful admin content writes.
  Removed the temporary verification member and test content.
- Production build succeeded with the new connection; local preview is
  `http://localhost:3100/admin`.

## Still pending user approval

Commit/push the application changes and update the deployment's Supabase
environment variables before deploying. The production website has NOT been
redeployed by this task. Its environment has not been changed here.

Check seeded content before publishing: the repository includes sample article
comments/counters, donation totals, and placeholder bank details. These are
repository seeds, not recovered records from the inaccessible old project.

Do not rerun the account reset script as a normal deployment step. It is an
explicit operational tool that can delete other accounts. The existing inventory
predates the newly created admin and now fails the tool's changed-inventory guard.

The database password in `.env.local` was cleared because it belonged to the old
project. Management API access does not require that password. For future CLI
migrations, link to `bnwkxmlmajwvqkyykirj` with that project's database credentials;
do not use old cached CLI connection details.
