-- ============================================================================
-- Update seeded events: titles, descriptions, and locations
-- ============================================================================

-- Update Youth Spiritual Gathering / Conference
update public.events
set 
  title_am = 'የወጣቶች መንፈሳዊ ጉባኤ',
  description_am = 'ለወጣቶች የተዘጋጀ ልዩ መንፈሳዊ ጉባኤ። በዘመናዊው ዓለም ኦርቶዶክሳዊ እምነትን ስለመኖር፣ ጥያቄና መልስ እንዲሁም መዝሙራት።',
  location_am = 'ሰንበት ት/ቤት አዳራሽ',
  location_en = 'Sunday School Hall'
where title_en = 'Spiritual Youth Conference';

-- Update Annual Feast of St. Mary (Hidar Tsion)
update public.events
set 
  location_am = 'ቤተክርስቲያን አውደምሕረት',
  location_en = 'Church Courtyard'
where title_en = 'Annual Feast of St. Mary (Hidar Tsion)';
