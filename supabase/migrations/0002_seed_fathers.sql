-- ============================================================================
-- Behere Tsige — Dev seed: a fuller set of fathers & office members
-- (boilerplate placeholder data to preview the Parish Office layout)
-- Run AFTER 0001_phase1.sql. Safe to re-run — it clears and reinserts the seed.
-- ============================================================================

-- Clear existing seed. Deleting fathers nulls confessor_requests.preferred_father_id
-- (FK is ON DELETE SET NULL), so submitted requests are preserved.
delete from public.members;
delete from public.fathers;

insert into public.fathers
  (full_name_en, full_name_am, title_en, title_am, role, bio_en, bio_am, photo_url, is_confessor, is_penance_father, phone, email, display_order)
values
  ('Melake Genet Memhir Habtewold Tegegn', 'መልአከ ገነት መምህር ሀብተወልድ ተገኝ',
   'Head Priest', 'የደብሩ አስተዳዳሪ', 'head_priest',
   'Head priest of the parish for over two decades, leading the congregation in worship, teaching, and pastoral care.',
   'ከሁለት አስርት ዓመታት በላይ የደብሩ አስተዳዳሪ ሆነው ምዕመናንን በአምልኮ፣ በትምህርትና በመንፈሳዊ እንክብካቤ ይመራሉ።',
   '/assets/profile-pic-preist.png', true, true, '+251 911 100 101', 'habtewold@beheretsigestmary.org', 1),

  ('Kesis Tesfaye Bekele', 'ቀሲስ ተስፋዬ በቀለ',
   'Priest & Confessor', 'ካህንና የንስሐ አባት', 'confessor',
   'A devoted confessor who guides the faithful through the sacrament of penance with patience and compassion.',
   'ምዕመናንን በትዕግሥትና በርኅራኄ በንስሐ ሥርዓት የሚመሩ ቅን የንስሐ አባት።',
   '/assets/profile-pic-preist.png', true, true, '+251 911 100 102', null, 2),

  ('Kesis Gebremariam Asfaw', 'ቀሲስ ገብረማርያም አስፋው',
   'Priest', 'ካህን', 'confessor',
   'Serves in the Divine Liturgy and accompanies young families in their spiritual journey.',
   'በቅዳሴ ሥርዓት የሚያገለግሉና ወጣት ቤተሰቦችን በመንፈሳዊ ጉዟቸው የሚያጅቡ ካህን።',
   '/assets/profile-pic-preist.png', true, false, '+251 911 100 103', null, 3),

  ('Liqe Kahenat Wolde Giyorgis Tadesse', 'ሊቀ ካህናት ወልደ ጊዮርጊስ ታደሰ',
   'Senior Priest', 'ሊቀ ካህናት', 'senior_priest',
   'A senior priest and elder of the parish, respected for his deep knowledge of the church canons and tradition.',
   'የደብሩ ሊቀ ካህናትና ሽማግሌ፤ በቤተ ክርስቲያን ሕግጋትና ወግ ጥልቅ ዕውቀታቸው የተከበሩ።',
   '/assets/profile-pic-preist.png', true, true, '+251 911 100 104', null, 4),

  ('Kesis Tekle Haymanot Mengistu', 'ቀሲስ ተክለ ሃይማኖት መንግስቱ',
   'Priest & Spiritual Father', 'ካህንና መንፈሳዊ አባት', 'confessor',
   'A spiritual father known for his counsel to the youth and his teaching in the Sunday school.',
   'ለወጣቶች በሚሰጡት ምክርና በሰንበት ትምህርት ቤት በሚያስተምሩት ትምህርት የሚታወቁ መንፈሳዊ አባት።',
   '/assets/profile-pic-preist.png', true, true, '+251 911 100 105', null, 5),

  ('Diakon Mebratu Alemu', 'ዲያቆን መብራቱ ዓለሙ',
   'Deacon', 'ዲያቆን', 'deacon',
   'Assists in the Divine Liturgy and leads the choir in sacred hymns (mezmur).',
   'በቅዳሴ ሥርዓት የሚያግዙና መዘምራንን በቅዱስ ዝማሬ የሚመሩ ዲያቆን።',
   '/assets/profile-pic-preist.png', false, false, '+251 911 100 106', null, 6),

  ('Kesis Berhanu Kidane', 'ቀሲስ ብርሃኑ ኪዳኔ',
   'Priest', 'ካህን', 'confessor',
   'Ministers to the sick and the elderly, bringing prayer and communion to those who cannot attend.',
   'ለታማሚዎችና ለአረጋውያን አገልግሎት የሚሰጡ፣ ጸሎትና ቍርባን ለማይገኙ የሚያደርሱ ካህን።',
   '/assets/profile-pic-preist.png', true, false, '+251 911 100 107', null, 7),

  ('Memhir Asnake Hailu', 'መምህር አስናቀ ኃይሉ',
   'Church Scholar & Teacher', 'የቤተ ክርስቲያን መምህር', 'teacher',
   'A scholar of the traditional church school (Abnet), teaching Ge''ez, Qene, and Zema to the next generation.',
   'የግእዝ፣ የቅኔና የዜማ ትምህርትን ለቀጣዩ ትውልድ የሚያስተምሩ የአብነት ትምህርት ቤት መምህር።',
   '/assets/profile-pic-preist.png', false, false, '+251 911 100 108', null, 8)
;

insert into public.members
  (full_name, role_en, role_am, department, display_order)
values
  ('Ato Solomon Girma',   'Parish Council Chairperson', 'የሰበካ ጉባኤ ሰብሳቢ',   'Administration', 1),
  ('W/ro Hana Tadesse',   'Treasurer',                  'ገንዘብ ያዥ',          'Finance',        2),
  ('Ato Daniel Alemu',    'Secretary',                  'ጸሐፊ',              'Administration', 3),
  ('Ato Yohannes Bekele', 'Property Administrator',     'የንብረት አስተዳዳሪ',     'Administration', 4),
  ('W/ro Marta Gebre',    'Member Affairs',             'የአባላት ጉዳይ',        'Community',      5),
  ('Ato Henok Tesfaye',   'Audit & Control',            'ኦዲትና ቁጥጥር',       'Finance',        6)
;
