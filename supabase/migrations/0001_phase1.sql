-- ============================================================================
-- Behere Tsige — Phase 1 schema
-- Tables: profiles, fathers, members, confessor_requests
-- Plus: roles, RLS policies, new-user trigger, media storage bucket, seed data.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query → Run).
-- ============================================================================

-- ---------- Roles ----------
do $$ begin
  create type public.user_role as enum ('member', 'author', 'admin', 'super_admin');
exception when duplicate_object then null; end $$;

-- ---------- profiles (mirrors auth.users) ----------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  email       text,
  avatar_url  text,
  role        public.user_role not null default 'member',
  locale      text default 'en',
  created_at  timestamptz not null default now()
);

-- Admin check as SECURITY DEFINER to avoid recursive RLS on profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$;

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.email,
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- fathers (clergy) ----------
create table if not exists public.fathers (
  id                uuid primary key default gen_random_uuid(),
  full_name_en      text not null,
  full_name_am      text,
  title_en          text,
  title_am          text,
  role              text,           -- head_priest, confessor, deacon, ...
  bio_en            text,
  bio_am            text,
  photo_url         text,
  is_confessor      boolean not null default false,
  is_penance_father boolean not null default false,
  phone             text,
  email             text,
  display_order     int not null default 0,
  is_published      boolean not null default true,
  created_at        timestamptz not null default now()
);

-- ---------- members (parish office) ----------
create table if not exists public.members (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  role_en       text,
  role_am       text,
  department    text,
  photo_url     text,
  contact       text,
  bio_en        text,
  bio_am        text,
  display_order int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ---------- confessor_requests (Father-Confessor contact form) ----------
create table if not exists public.confessor_requests (
  id                  uuid primary key default gen_random_uuid(),
  requester_name      text not null,
  phone               text,
  email               text,
  preferred_father_id uuid references public.fathers(id) on delete set null,
  message             text,
  status              text not null default 'new',  -- new, contacted, assigned, closed
  created_at          timestamptz not null default now()
);

-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.profiles           enable row level security;
alter table public.fathers            enable row level security;
alter table public.members            enable row level security;
alter table public.confessor_requests enable row level security;

-- profiles: read own or admin; update own or admin.
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update using (id = auth.uid() or public.is_admin());

-- fathers: public reads published; admins do everything.
drop policy if exists fathers_select on public.fathers;
create policy fathers_select on public.fathers
  for select using (is_published or public.is_admin());

drop policy if exists fathers_admin_write on public.fathers;
create policy fathers_admin_write on public.fathers
  for all using (public.is_admin()) with check (public.is_admin());

-- members: public reads published; admins do everything.
drop policy if exists members_select on public.members;
create policy members_select on public.members
  for select using (is_published or public.is_admin());

drop policy if exists members_admin_write on public.members;
create policy members_admin_write on public.members
  for all using (public.is_admin()) with check (public.is_admin());

-- confessor_requests: anyone may submit (insert); only admins may read/manage.
drop policy if exists confessor_insert on public.confessor_requests;
create policy confessor_insert on public.confessor_requests
  for insert with check (true);

drop policy if exists confessor_admin_read on public.confessor_requests;
create policy confessor_admin_read on public.confessor_requests
  for select using (public.is_admin());

drop policy if exists confessor_admin_manage on public.confessor_requests;
create policy confessor_admin_manage on public.confessor_requests
  for update using (public.is_admin()) with check (public.is_admin());

-- ============================================================================
-- Storage: public 'media' bucket for photos (profiles, fathers, posters...)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists media_admin_write on storage.objects;
create policy media_admin_write on storage.objects
  for all using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- ============================================================================
-- Seed data (placeholders — edit later via the admin dashboard)
-- ============================================================================
insert into public.fathers
  (full_name_en, full_name_am, title_en, title_am, role, bio_en, bio_am, photo_url, is_confessor, is_penance_father, display_order)
values
  ('Melake Genet Memhir Habtewold Tegegn', 'መልዓከ ገነት መምህር ሃብተወልድ ተገኝ',
   'Head Priest', 'የደብሩ አስተዳዳሪ', 'head_priest',
   'Head priest of the parish, serving the congregation in worship, teaching, and pastoral care.',
   'የደብሩ አስተዳዳሪ፤ ምዕመናንን በአምልኮ፣ በትምህርትና በመንፈሳዊ እንክብካቤ ያገለግላሉ።',
   '/assets/profile-pic-preist.png', true, true, 1),
  ('Father Tesfaye Bekele', 'አባ ተስፋዬ በቀለ',
   'Priest & Confessor', 'ካህንና የንስሐ አባት', 'confessor',
   'Serves as a confessor and guides the faithful in the sacrament of penance.',
   'የንስሐ አባት ሆነው ምዕመናንን በንስሐ ሥርዓት ይመራሉ።',
   '/assets/profile-pic-preist.png', true, true, 2)
on conflict do nothing;

insert into public.members
  (full_name, role_en, role_am, department, display_order)
values
  ('Ato Solomon Girma', 'Parish Council Chairperson', 'የሰበካ ጉባኤ ሰብሳቢ', 'Administration', 1),
  ('W/ro Hana Tadesse', 'Treasurer', 'ገንዘብ ያዥ', 'Finance', 2),
  ('Ato Daniel Alemu', 'Secretary', 'ጸሐፊ', 'Administration', 3)
on conflict do nothing;
