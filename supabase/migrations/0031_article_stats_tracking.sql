-- ============================================================================
-- RPC function to toggle article likes (for authenticated & guest users)
-- ============================================================================

create or replace function public.toggle_article_like(target_article_id uuid, increment_like bool)
returns int
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count int;
  curr_user_id uuid := auth.uid();
begin
  if increment_like then
    -- Increment the count
    update public.articles
    set like_count = like_count + 1
    where id = target_article_id
    returning like_count into new_count;

    -- If a user is logged in, also record in article_likes
    if curr_user_id is not null then
      insert into public.article_likes (article_id, user_id)
      values (target_article_id, curr_user_id)
      on conflict do nothing;
    end if;
  else
    -- Decrement the count
    update public.articles
    set like_count = greatest(0, like_count - 1)
    where id = target_article_id
    returning like_count into new_count;

    -- If a user is logged in, also remove from article_likes
    if curr_user_id is not null then
      delete from public.article_likes
      where article_id = target_article_id and user_id = curr_user_id;
    end if;
  end if;

  return new_count;
end;
$$;

-- ============================================================================
-- Database view for articles including likes, comments, and views count
-- ============================================================================

create or replace view public.articles_with_stats with (security_invoker = true) as
select
  a.*,
  a.like_count as likes_count,
  (select count(*) from public.article_comments c where c.article_id = a.id and c.status = 'visible') as comments_count,
  (select count(*) from public.interactions i
   where i.event_type = 'page_view'
     and trim(trailing '/' from split_part(split_part(i.page, '?', 1), '#', 1)) in (
       '/articles/' || a.slug,
       '/am/articles/' || a.slug,
       '/gez/articles/' || a.slug,
       '/en/articles/' || a.slug
     )
  ) as views_count
from public.articles a;
