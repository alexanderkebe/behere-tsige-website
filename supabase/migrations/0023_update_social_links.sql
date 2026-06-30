-- Behere Tsige — Update media_links with the real, verified parish social links.
-- Replaces the placeholder seed (migration 0021) with the official accounts.
-- LinkedIn is intentionally excluded from the public media portal.
-- ============================================================================

alter table public.media_links add column if not exists handle text;

delete from public.media_links;

insert into public.media_links
  (platform, title_en, title_am, handle, url, is_live, display_order)
values
  ('youtube',  'YouTube Channel',   'የዩቲዩብ ቻናል',     '@ብሔረጽጌማርያም',                'https://www.youtube.com/@%E1%89%A5%E1%88%94%E1%88%A8%E1%8C%BD%E1%8C%8C%E1%88%9B%E1%88%AD%E1%8B%AB%E1%88%9D', false, 1),
  ('telegram', 'Telegram Channel',  'የቴሌግራም ቻናል',    '@Behere_tsege_mariam',       'https://t.me/Behere_tsege_mariam',                          false, 2),
  ('telegram', 'Telegram Account',  'የቴሌግራም መለያ',     '@Beheretsegemariam',         'https://t.me/Beheretsegemariam',                           false, 3),
  ('telegram', 'Telegram Group',    'የቴሌግራም ቡድን',     'Join group',                 'https://t.me/+fmrtZ3AUgMAyN2Q0',                           false, 4),
  ('instagram','Instagram',         'ኢንስታግራም',        '@behere_tsege_mariam_official','https://www.instagram.com/behere_tsege_mariam_official/?hl=en', false, 5),
  ('tiktok',   'TikTok',            'ቲክቶክ',            '@beheretsegemariam',         'https://www.tiktok.com/@beheretsegemariam',                false, 6),
  ('facebook', 'Facebook Page',     'የፌስቡክ ገጽ',       'Facebook',                   'https://web.facebook.com/?_rdc=1&_rdr',                    false, 7);
