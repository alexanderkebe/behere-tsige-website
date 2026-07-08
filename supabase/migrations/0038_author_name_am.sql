-- ============================================================================
-- Behere Tsige — Localize author names.
-- The authors table only had a single `name`, so the byline stayed in English
-- even on the Amharic site. Add an Amharic name and backfill the head priest
-- from the fathers table (single source of truth for his localized name).
-- ============================================================================

alter table public.authors
  add column if not exists name_am text;

update public.authors a
set name_am = f.full_name_am
from public.fathers f
where a.name = f.full_name_en
  and f.full_name_am is not null;
