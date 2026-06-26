-- ============================================================================
-- Behere Tsige — Seed Dev B tables (events & media_links)
-- ============================================================================

-- ---------- Seed events ----------
insert into public.events
  (title_en, title_am, description_en, description_am, event_date, start_time, location_en, location_am, poster_url, is_main)
values
  (
    'Annual Feast of St. Mary (Hidar Tsion)',
    'ሕዳር ጽዮን ማርያም ዓመታዊ በዓል',
    'Join our annual celebration with divine liturgy, spiritual songs, and traditional sermons. Fellowship meal will follow.',
    'የእመቤታችን የቅድስት ድንግል ማርያም ዓመታዊ የሕዳር ጽዮን በዓል፤ በደማቅ ቅዳሴ፣ ማኅሌትና ስብከት ይከበራል፤ የበረከት ማዕድም ይዘረጋል።',
    '2026-11-30',
    '05:00:00',
    'Main Sanctuary',
    'ዋናው ቤተ መቅደስ',
    null,
    true
  ),
  (
    'Spiritual Youth Conference',
    'የወጣቶች መንፈሳዊ ኮንፈረንስ',
    'A special conference for teenagers and youth. Discussion on Orthodox faith in modern times, Q&A session, and hymns.',
    'ለወጣቶች የተዘጋጀ ልዩ መንፈሳዊ ኮንፈረንስ። በዘመናዊው ዓለም ኦርቶዶክሳዊ እምነትን ስለመኖር፣ ጥያቄና መልስ እንዲሁም መዝሙራት።',
    '2026-07-25',
    '13:00:00',
    'Church Hall',
    'የቤተ ክርስቲያን አዳራሽ',
    null,
    false
  )
on conflict do nothing;

-- ---------- Seed media_links ----------
insert into public.media_links
  (platform, title_en, title_am, url, thumb_url, is_live, display_order)
values
  (
    'youtube',
    'Official YouTube Channel',
    'ኦፊሴላዊ የዩቲዩብ ቻናል',
    'https://www.youtube.com/@beheretsigestmary',
    null,
    false,
    1
  ),
  (
    'facebook',
    'Facebook Page',
    'የፌስቡክ ገጽ',
    'https://facebook.com/beheretsigestmary',
    null,
    false,
    2
  ),
  (
    'telegram',
    'Telegram Channel',
    'የቴሌግራም ቻናል',
    'https://t.me/beheretsigestmary',
    null,
    false,
    3
  )
on conflict do nothing;
