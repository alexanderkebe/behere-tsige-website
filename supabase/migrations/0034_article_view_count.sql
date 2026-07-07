-- ============================================================================
-- Fix article view counters.
--
-- articles_with_stats counted page_view rows from `interactions`, but that
-- table is admin-read-only under RLS and the view runs with the caller's
-- rights (security_invoker) — so public visitors always saw views_count = 0.
--
-- Views now use a real counter column on articles (like like_count),
-- incremented through a SECURITY DEFINER function the client calls once per
-- article read. Existing history from `interactions` is backfilled.
-- ============================================================================

alter table public.articles
  add column if not exists view_count int not null default 0;

-- Backfill from the interactions history (same matching the old view used).
update public.articles a
set view_count = (
  select count(*)
  from public.interactions i
  where i.event_type = 'page_view'
    and trim(trailing '/' from split_part(split_part(i.page, '?', 1), '#', 1)) in (
      '/articles/' || a.slug,
      '/am/articles/' || a.slug,
      '/gez/articles/' || a.slug,
      '/en/articles/' || a.slug
    )
);

create or replace function public.record_article_view(target_article_id uuid)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count int;
begin
  update public.articles
  set view_count = view_count + 1
  where id = target_article_id
  returning view_count into new_count;

  return new_count;
end;
$$;

grant execute on function public.record_article_view(uuid) to anon, authenticated;

-- Recreate the stats view on top of the counter column. (drop + create:
-- articles gained a column, so the view's output columns change.)
drop view if exists public.articles_with_stats;
create view public.articles_with_stats with (security_invoker = true) as
select
  a.*,
  a.like_count as likes_count,
  (select count(*) from public.article_comments c
   where c.article_id = a.id and c.status = 'visible') as comments_count,
  a.view_count as views_count
from public.articles a;

grant select on public.articles_with_stats to anon, authenticated;
