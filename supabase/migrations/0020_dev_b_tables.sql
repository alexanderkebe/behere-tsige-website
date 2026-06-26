-- ============================================================================
-- Behere Tsige — Phase 3, 4, 7 (Dev B tables)
-- Tables: events, media_links, contact_messages
-- ============================================================================

-- ---------- events ----------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_am text,
  description_en text,
  description_am text,
  event_date date,
  start_time time,
  location_en text,
  location_am text,
  poster_url text,
  is_main boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- media_links ----------
create table if not exists public.media_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null, -- youtube, facebook, telegram, instagram, web
  title_en text not null,
  title_am text,
  url text not null,
  thumb_url text,
  is_live boolean not null default false,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- contact_messages ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text not null,
  subject text,
  message text not null,
  status text not null default 'new', -- new, read, replied, archived
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.events enable row level security;
alter table public.media_links enable row level security;
alter table public.contact_messages enable row level security;

-- Public reads
create policy public_select_events on public.events for select using (true);
create policy public_select_medialinks on public.media_links for select using (true);

-- Public insert messages
create policy public_insert_contact on public.contact_messages for insert with check (true);

-- Admin full access
do $$ 
declare
  t text;
begin
  for t in 
    select table_name 
    from information_schema.tables 
    where table_schema = 'public' 
      and table_name in ('events', 'media_links', 'contact_messages')
  loop
    execute format('create policy admin_all_%I on public.%I for all using (public.is_admin()) with check (public.is_admin());', t, t);
  end loop;
end $$;
