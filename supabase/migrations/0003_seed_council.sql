-- ============================================================================
-- Behere Tsige — Dev seed: Parish Council (Sebeka Gubae) members
-- Replaces the office members with the council roster. Safe to re-run.
-- Run AFTER 0001_phase1.sql.
-- ============================================================================

delete from public.members;

insert into public.members
  (full_name, role_en, role_am, department, display_order)
values
  ('Melake Bisrat Abba Admasie',  'Parish Administrator',      'የደብር አስተዳዳሪ',        'Administration', 1),
  ('Mrs. Meskerem Arga',          'Treasurer',                 'ገንዘብ ያዥ',             'Finance',        2),
  ('Liqe Diyakon Yared Dagnew',   'Parish Secretary',          'የደብር ጸሐፊ',            'Administration', 3),
  ('Mr. Haile',                   'Parish Sunday School Rep',  'የሰንበት ት/ቤት ተወካይ',     'Sunday School',  4),
  ('Megabe Sirat Kesis Assefa Desta', 'Parish Clergy Rep',     'የካህናት ተወካይ',         'Clergy',         5),
  ('Mr. Eyob Demsie',             'Accounts Manager',          'የሒሳብ ኃላፊ',            'Finance',        6),
  ('Mr. Hailemaryam Wolde',       'Public Relations',          'የሕዝብ ግንኙነት',         'Community',      7)
;
