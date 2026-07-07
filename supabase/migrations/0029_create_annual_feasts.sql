-- ============================================================================
-- Drop liturgy_schedule and create annual_feasts
-- ============================================================================

-- Drop old table
drop table if exists public.liturgy_schedule cascade;

-- Create new table
create table public.annual_feasts (
  id uuid primary key default gen_random_uuid(),
  date_en text not null,
  date_am text not null,
  title_en text not null,
  title_am text not null,
  display_order int not null default 0
);

-- Enable RLS
alter table public.annual_feasts enable row level security;

-- Policies
create policy public_select_feasts on public.annual_feasts for select using (true);
create policy admin_all_feasts on public.annual_feasts for all using (public.is_admin()) with check (public.is_admin());

-- Seed initial data
insert into public.annual_feasts (date_en, date_am, title_en, title_am, display_order)
values
  ('Meskerem 21', 'መስከረም ፳፩', 'Emme Bizuhaan Maryam (Our Lady, Mother of Multitudes)', 'እመ ብዙኃን ማርያም', 1),
  ('Tikimt 27', 'ጥቅምት ፳፯', 'Medhane Alem (Christ the Savior of the World)', 'መድኃኔዓለም', 2),
  ('Hidar 8', 'ኅዳር ፰', 'The Four Living Creatures', 'አርባዕቱ እንስሳ', 3),
  ('Hidar 21', 'ኅዳር ፳፩', 'Tsion Maryam (St. Mary of Zion)', 'ጽዮን ማርያም', 4),
  ('Tir 4', 'ጥር ፬', 'Saint John the Evangelist', 'ቅዱስ ዮሐንስ ወንጌላዊ', 5),
  ('Tir 21', 'ጥር ፳፩', 'Aster''eyo Maryam (The Revelation/Appearance of the Virgin Mary)', 'አስተርዕዮ ማርያም', 6),
  ('Megabit 27', 'መጋቢት ፳፯', 'Medhane Alem (Christ the Savior of the World)', 'መድኃኔዓለም', 7),
  ('Ginbot 1', 'ግንቦት ፩', 'Lideta LeMaryam (The Nativity of the Virgin Mary)', 'ልደታ ለማርያም', 8),
  ('Ginbot 21', 'ግንቦት ፳፩', 'Debre Mitmaq', 'ደብረ ምጥማቅ', 9),
  ('Ginbot 28', 'ግንቦት ፳፰', 'Emmanuel', 'አማኑኤል', 10),
  ('Sene 21', 'ሰኔ ፳፩', 'Hinseta Beta (Church Dedication Feast)', 'ሕንጸተ ቤታ', 11),
  ('Pagume 3', 'ጳግሜ ፫', 'Saint Raphael the Archangel', 'ቅዱስ ሩፋኤል', 12);
