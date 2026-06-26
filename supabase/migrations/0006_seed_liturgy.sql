-- ============================================================================
-- Seed Liturgy Schedule Data
-- ============================================================================

insert into public.liturgy_schedule
  (day_of_week, service_type, title_en, title_am, start_time, display_order)
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
