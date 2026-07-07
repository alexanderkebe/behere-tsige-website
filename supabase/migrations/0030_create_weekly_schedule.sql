-- ============================================================================
-- Create weekly_schedule table and seed data
-- ============================================================================

create table if not exists public.weekly_schedule (
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

-- Enable RLS
alter table public.weekly_schedule enable row level security;

-- Policies
create policy public_select_weekly on public.weekly_schedule for select using (true);
create policy admin_all_weekly on public.weekly_schedule for all using (public.is_admin()) with check (public.is_admin());

-- Seed initial data
insert into public.weekly_schedule (day_of_week, service_type, title_en, title_am, start_time, display_order)
values
  -- Daily Liturgy (Kidase)
  ('monday', 'kidase', 'Holy Liturgy (Kidase)', 'ቅዳሴ', '06:00:00', 1),
  ('tuesday', 'kidase', 'Holy Liturgy (Kidase)', 'ቅዳሴ', '06:00:00', 2),
  ('wednesday', 'kidase', 'Holy Liturgy (Kidase)', 'ቅዳሴ', '06:00:00', 3),
  ('thursday', 'kidase', 'Holy Liturgy (Kidase)', 'ቅዳሴ', '06:00:00', 4),
  ('friday', 'kidase', 'Holy Liturgy (Kidase)', 'ቅዳሴ', '06:00:00', 5),
  ('saturday', 'kidase', 'Holy Liturgy (Kidase)', 'ቅዳሴ', '06:00:00', 6),
  ('sunday', 'kidase', 'Holy Liturgy (Kidase)', 'ቅዳሴ', '06:00:00', 7),
  
  -- Specific Mahlets
  ('sene 19', 'mahlet', 'St. Gabriel Mahlet (Sene 19)', 'የቅዱስ ገብርኤል ማኅሌት', '01:00:00', 8),
  ('sene 21', 'mahlet', 'St. Mary Mahlet (Sene 21)', 'የእመቤታችን ማኅሌት', '01:00:00', 9)
on conflict do nothing;
