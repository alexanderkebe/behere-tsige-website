-- ============================================================================
-- Behere Tsige — Phase 2: Services schema
-- ============================================================================

-- ---------- site_settings ----------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- ---------- Liturgy & Night Services ----------
create table if not exists public.liturgy_schedule (
  id uuid primary key default gen_random_uuid(),
  day_of_week text not null, -- monday, tuesday, etc.
  service_type text not null, -- mahlet, seatat, wazema, kidan, kidase
  title_en text,
  title_am text,
  start_time time not null,
  note_en text,
  note_am text,
  display_order int not null default 0
);

-- ---------- Sunday School ----------
create table if not exists public.ss_team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_en text,
  role_am text,
  photo_url text,
  bio_en text,
  bio_am text,
  display_order int not null default 0
);

create table if not exists public.ss_projects (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_am text,
  description_en text,
  description_am text,
  type text not null, -- project, event
  event_date date,
  poster_url text,
  status text not null default 'upcoming'
);

create table if not exists public.ss_departments (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_am text,
  description_en text,
  description_am text,
  display_order int not null default 0
);

create table if not exists public.ss_registrations (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.ss_departments(id),
  full_name text not null,
  phone text not null,
  email text,
  date_of_birth date,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- Abnet School ----------
create table if not exists public.abnet_events (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_am text,
  description_en text,
  description_am text,
  event_date date,
  poster_url text
);

create table if not exists public.abnet_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  previous_education text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- Evangelism ----------
create table if not exists public.gospel_programs (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_am text,
  description_en text,
  description_am text,
  schedule text,
  poster_url text,
  display_order int not null default 0
);

create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_am text,
  youtube_url text not null,
  published_at timestamptz not null default now(),
  display_order int not null default 0
);

-- ---------- Penance (Confession) ----------
-- Privacy sensitive table
create table if not exists public.confession_requests (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  phone text,
  email text,
  father_id uuid references public.fathers(id) on delete set null,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- ---------- Baptism & Catechumen ----------
create table if not exists public.catechumen_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  track text not null, -- infant, catechumen, returning
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ---------- Memorial Services ----------
create table if not exists public.memorial_services (
  id uuid primary key default gen_random_uuid(),
  type text not null, -- fitehat, nefs-yimar, etc.
  name_en text not null,
  name_am text,
  description_en text,
  description_am text,
  price numeric not null,
  currency text not null default 'ETB'
);

create table if not exists public.memorial_orders (
  id uuid primary key default gen_random_uuid(),
  service_id uuid references public.memorial_services(id),
  requester_name text not null,
  requester_phone text not null,
  requester_email text,
  deceased_name text not null,
  preferred_date date,
  amount numeric not null,
  payment_status text not null default 'pending',
  chapa_tx_ref text,
  created_at timestamptz not null default now()
);


-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.site_settings enable row level security;
alter table public.liturgy_schedule enable row level security;
alter table public.ss_team enable row level security;
alter table public.ss_projects enable row level security;
alter table public.ss_departments enable row level security;
alter table public.ss_registrations enable row level security;
alter table public.abnet_events enable row level security;
alter table public.abnet_registrations enable row level security;
alter table public.gospel_programs enable row level security;
alter table public.sermons enable row level security;
alter table public.confession_requests enable row level security;
alter table public.catechumen_registrations enable row level security;
alter table public.memorial_services enable row level security;
alter table public.memorial_orders enable row level security;


-- Public reads for configuration and public data
create policy public_select_site_settings on public.site_settings for select using (true);
create policy public_select_liturgy on public.liturgy_schedule for select using (true);
create policy public_select_ssteam on public.ss_team for select using (true);
create policy public_select_ssprojects on public.ss_projects for select using (true);
create policy public_select_ssdepts on public.ss_departments for select using (true);
create policy public_select_abnetevents on public.abnet_events for select using (true);
create policy public_select_gospel on public.gospel_programs for select using (true);
create policy public_select_sermons on public.sermons for select using (true);
create policy public_select_memorialsrv on public.memorial_services for select using (true);

-- Public inserts for registrations and orders
create policy public_insert_ssreg on public.ss_registrations for insert with check (true);
create policy public_insert_abnetreg on public.abnet_registrations for insert with check (true);
create policy public_insert_confession on public.confession_requests for insert with check (true);
create policy public_insert_catechumen on public.catechumen_registrations for insert with check (true);
create policy public_insert_memorialord on public.memorial_orders for insert with check (true);

-- Admin full access for all new tables
do $$ 
declare
  t text;
begin
  for t in 
    select table_name 
    from information_schema.tables 
    where table_schema = 'public' 
      and table_name in (
        'site_settings', 'liturgy_schedule', 'ss_team', 'ss_projects', 'ss_departments', 
        'ss_registrations', 'abnet_events', 'abnet_registrations', 'gospel_programs', 
        'sermons', 'confession_requests', 'catechumen_registrations', 'memorial_services', 'memorial_orders'
      )
  loop
    execute format('create policy admin_all_%I on public.%I for all using (public.is_admin()) with check (public.is_admin());', t, t);
  end loop;
end $$;

-- ============================================================================
-- Initial Settings Seed
-- ============================================================================
insert into public.site_settings (key, value)
values
  ('evangelism', '{"head_priest_message_en": "Welcome to our parish. Our mission is to spread the Gospel and love of Christ to everyone.", "head_priest_message_am": "እንኳን ወደ ደብራችን በደህና መጡ።", "welcome_verses": "Luke 15:11-32"}'),
  ('sunday_school', '{"message_en": "Our Sunday School is dedicated to teaching the Orthodox faith to children and youth.", "message_am": "የሰንበት ትምህርት ቤታችን ኦርቶዶክሳዊ እምነትን ለልጆችና ለወጣቶች ያስተምራል።", "plan_en": "Weekly classes, annual camps, and community service.", "plan_am": "ሳምንታዊ ትምህርቶች፣ ዓመታዊ ጉባኤዎች እና መንፈሳዊ አገልግሎቶች።"}'),
  ('abnet', '{"mission_en": "To preserve and teach the ancient traditions of the Ethiopian Orthodox Tewahedo Church.", "mission_am": "የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያንን ጥንታዊ ትውፊት ጠብቆ ማቆየት እና ማስተማር።", "vision_en": "A generation deeply rooted in faith and tradition.", "vision_am": "በእምነት እና በትውፊት የጸና ትውልድ።"}'),
  ('penance_resources', '{"application_url": "#", "guide_booklet_url": "#"}'),
  ('baptism_info', '{"infant_track_en": "Infants are baptized at 40 days (boys) or 80 days (girls).", "infant_track_am": "ሕጻናት በ40 ቀናቸው (ወንዶች) ወይም በ80 ቀናቸው (ሴቶች) ይጠመቃሉ።", "catechumen_track_en": "For adults seeking to join the church or return to the faith.", "catechumen_track_am": "ወደ ቤተክርስቲያን ለመቀላቀል ወይም ወደ እምነት ለመመለስ ለሚፈልጉ አዋቂዎች።"}')
on conflict do nothing;
