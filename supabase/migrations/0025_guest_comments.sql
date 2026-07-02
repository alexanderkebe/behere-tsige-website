-- Behere Tsige — Allow guest (name-only) comments on articles.
-- user_id was already nullable; add a display name for guests and open the
-- insert policy so visitors can comment without an account. Admins can still
-- hide/delete via the existing update/delete policies.
-- ============================================================================

alter table public.article_comments
  add column if not exists guest_name text;

drop policy if exists comments_insert on public.article_comments;
create policy comments_insert on public.article_comments
  for insert with check (
    (auth.uid() is not null and auth.uid() = user_id)
    or (
      user_id is null
      and guest_name is not null
      and length(trim(guest_name)) between 1 and 80
      and length(body) between 1 and 2000
    )
  );
