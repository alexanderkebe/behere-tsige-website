-- ============================================================================
-- Behere Tsige — Comment moderation + Project Dejeselam sponsorships
-- 1. New comments start as 'pending' and only appear after an admin approves
--    them (protects against offensive/taboo posts).
-- 2. dejeselam_sponsorships: meal sponsorships are finally stored in the DB
--    (they were mock client state before). Public sees a safe view without
--    phone numbers; admins manage everything.
-- 3. article_stats(): per-article views/likes/comments for the admin panel.
-- ============================================================================

-- ---------- 1. Comment moderation ----------
alter table public.article_comments
  alter column status set default 'pending';

-- Force new guest/user comments to 'pending' — nobody can self-publish.
drop policy if exists comments_insert on public.article_comments;
create policy comments_insert on public.article_comments
  for insert with check (
    status = 'pending'
    and (
      (auth.uid() is not null and auth.uid() = user_id)
      or (
        user_id is null
        and guest_name is not null
        and length(trim(guest_name)) between 1 and 80
        and length(body) between 1 and 2000
      )
    )
  );

-- ---------- 2. Project Dejeselam sponsorships ----------
create table if not exists public.dejeselam_sponsorships (
  id            uuid primary key default gen_random_uuid(),
  group_id      uuid,                          -- ties the rows of one monthly/year-round booking together
  sponsor_date  date not null,                 -- the day whose meals are covered
  sponsor_name  text not null,
  phone         text,
  message       text,
  frequency     text not null default 'one_time',  -- one_time | monthly | year_round
  meals         int not null,
  meal_price    int not null default 170,      -- birr per meal at booking time
  status        text not null default 'pending',   -- pending | confirmed | paid | cancelled
  created_at    timestamptz not null default now()
);

create index if not exists dejeselam_date_idx on public.dejeselam_sponsorships (sponsor_date);
create index if not exists dejeselam_status_idx on public.dejeselam_sponsorships (status);

alter table public.dejeselam_sponsorships enable row level security;

-- Visitors may submit a sponsorship (always starts pending); admins manage all.
drop policy if exists dejeselam_insert on public.dejeselam_sponsorships;
create policy dejeselam_insert on public.dejeselam_sponsorships
  for insert with check (
    status = 'pending'
    and meal_price = 170
    and length(trim(coalesce(sponsor_name, ''))) between 1 and 120
    and char_length(coalesce(phone, ''))   <= 40
    and char_length(coalesce(message, '')) <= 500
    and frequency in ('one_time', 'monthly', 'year_round')
    and meals between 1 and 400
    and sponsor_date >= current_date
  );

drop policy if exists dejeselam_admin_all on public.dejeselam_sponsorships;
create policy dejeselam_admin_all on public.dejeselam_sponsorships
  for all using (public.is_admin()) with check (public.is_admin());

-- Public calendar view: sponsor names/meals per day, but never phone numbers.
create or replace view public.dejeselam_public as
  select id, group_id, sponsor_date, sponsor_name, message, frequency, meals, status, created_at
  from public.dejeselam_sponsorships
  where status <> 'cancelled';

grant select on public.dejeselam_public to anon, authenticated;

-- ---------- 3. Per-article analytics for the admin panel ----------
create or replace function public.article_stats()
returns table (
  id uuid,
  slug text,
  title_en text,
  status text,
  published_at timestamptz,
  like_count int,
  views bigint,
  comments_visible bigint,
  comments_pending bigint,
  comments_hidden bigint
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  return query
  select
    a.id, a.slug, a.title_en, a.status, a.published_at, a.like_count,
    (select count(*) from interactions i
      where i.event_type = 'page_view' and i.page like '/articles/' || a.slug || '%'),
    (select count(*) from article_comments c where c.article_id = a.id and c.status = 'visible'),
    (select count(*) from article_comments c where c.article_id = a.id and c.status = 'pending'),
    (select count(*) from article_comments c where c.article_id = a.id and c.status = 'hidden')
  from articles a
  order by a.created_at desc;
end;
$$;
