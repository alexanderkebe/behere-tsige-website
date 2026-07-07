-- Update title_am and bio/description for the head priest
update public.fathers 
set 
  title_am = 'የደብሩ አስተዳዳሪ',
  bio_en = 'Insert your message here.',
  bio_am = 'እባክዎን መልእክትዎን እዚህ ያስገቡ።'
where full_name_en = 'Melake Genet Memhir Habtewold Tegegn';

-- Update site content news section for Amharic fatherRole
update public.site_content
set data = jsonb_set(data, '{am,fatherRole}', '"የደብሩ አስተዳዳሪ"')
where section = 'news';
