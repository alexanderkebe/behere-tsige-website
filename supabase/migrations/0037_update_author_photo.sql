-- ============================================================================
-- Behere Tsige — Sync the head-priest author's photo with the fathers page.
-- The fathers table uses an uploaded photo in Supabase storage; point the
-- article author (and the article cover) at the same image so the byline
-- avatar matches the fathers page.
-- ============================================================================

update public.authors
set photo_url = (
  select photo_url from public.fathers
  where full_name_en = 'Melake Genet Memhir Habtewold Tegegn'
  limit 1
)
where name = 'Melake Genet Memhir Habtewold Tegegn'
  and exists (
    select 1 from public.fathers
    where full_name_en = 'Melake Genet Memhir Habtewold Tegegn'
      and photo_url is not null
  );

-- Keep the article cover in sync with the same portrait.
update public.articles
set cover_url = (
  select photo_url from public.fathers
  where full_name_en = 'Melake Genet Memhir Habtewold Tegegn'
  limit 1
)
where slug = 'you-created-summer-and-winter'
  and exists (
    select 1 from public.fathers
    where full_name_en = 'Melake Genet Memhir Habtewold Tegegn'
      and photo_url is not null
  );
