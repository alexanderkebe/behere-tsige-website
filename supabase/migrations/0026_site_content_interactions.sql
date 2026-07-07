-- ============================================================================
-- Behere Tsige — Site content + interaction analytics
-- Tables: site_content (all editable site copy, EN/AM, keyed by section),
--         interactions (every visitor event: page views, clicks, forms, chat).
-- Seed rows for site_content are appended below (generated from the previous
-- file-based content.json / defaultContent.js).
-- ============================================================================

-- ---------- site_content (one row per section, data holds en/am copy) ----------
create table if not exists public.site_content (
  section     text primary key,
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id) on delete set null
);

alter table public.site_content enable row level security;

-- Everyone can read site copy; only admins can change it.
drop policy if exists site_content_select on public.site_content;
create policy site_content_select on public.site_content
  for select using (true);

drop policy if exists site_content_admin_write on public.site_content;
create policy site_content_admin_write on public.site_content
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- interactions (visitor events for analytics) ----------
create table if not exists public.interactions (
  id          bigint generated always as identity primary key,
  event_type  text not null,            -- page_view, click, form_submit, language_switch, chat_message, ...
  page        text,
  session_id  text,
  lang        text,
  referrer    text,
  user_agent  text,
  metadata    jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists interactions_created_at_idx on public.interactions (created_at desc);
create index if not exists interactions_event_type_idx on public.interactions (event_type);
create index if not exists interactions_page_idx       on public.interactions (page);

alter table public.interactions enable row level security;

-- Anyone (anonymous visitors) may record events; only admins may read/purge.
drop policy if exists interactions_insert on public.interactions;
create policy interactions_insert on public.interactions
  for insert with check (
    char_length(coalesce(event_type, ''))  between 1 and 60
    and char_length(coalesce(page, ''))       <= 300
    and char_length(coalesce(session_id, '')) <= 80
    and char_length(coalesce(lang, ''))       <= 10
    and char_length(coalesce(referrer, ''))   <= 500
    and char_length(coalesce(user_agent, '')) <= 400
    and pg_column_size(metadata)              <= 8192
  );

drop policy if exists interactions_admin_read on public.interactions;
create policy interactions_admin_read on public.interactions
  for select using (public.is_admin());

drop policy if exists interactions_admin_delete on public.interactions;
create policy interactions_admin_delete on public.interactions
  for delete using (public.is_admin());

-- ---------- Seed: current site copy (from data/content.json + defaults) ----------
insert into public.site_content (section, data)
values ('hero', $seed${"en":{"bubble":"Welcome to Behere Tsige","title":"Mekane Selam St. Mary","description":"A sacred place of faith, fellowship, and spiritual growth established in the tradition of the Ethiopian Orthodox Tewahedo Church."},"am":{"bubble":"እንኳን ወደ ብሔረ ጽጌ","title":"መካነ ሰላም ቅድስት ድንግል ማርያም ቤተ ክርስቲያን","welcome":"በደህና መጡ","description":"“ከእግዚአብሔር ጋር የተባበረ መጻተኛ፦ ‘እግዚአብሔር ከሕዝቡ ለይቶ ይለየኛል’ አይበል።” — ኢሳይያስ 56፥3"}}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('about', $seed${"en":{"tag":"Our Journey","heading":"Our Journey","body1":"Nestled within the Addis Ababa Diocese near the beautiful Behire Tsegie Park sits Behire Tsegie Mekane Selam Kidist Mariam Church. While it stands today as a peaceful sanctuary in Ethiopia, the church's sacred foundation was forged through a miraculous journey of migration, survival, and profound healing across borders.","body2":"","learnMore":"Learn More","galleryTitle":"Parish Life Gallery"},"am":{"tag":"ከጉዞዋችን","heading":"ከጉዞዋችን","body1":"ዛሬ በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ምእመናን ዘንድ ታዋቂ የሆነችው እና በአዲስ አበባ በብሔረ ጽጌ ፓርክ አጠገብ የምትገኘው የብሔረ ጽጌ መካነ ሰላም ቅድስት ማርያም ቤተክርስቲያን ታሪክ፤ ከስደት፣ እና ከታላቅ ተአምርት ጋር የተያያዘ ነው። ዛሬ በግርማ ሞገስ ብትቆምም፣ መንፈሳዊ መሰረቷ ግን ድንበር የተሻገረ የሕዝብ መከራ እና መለኮታዊ ጥበቃ ውጤት ነው።","body2":"","learnMore":"ተጨማሪ ይወቁ","galleryTitle":"የመካነ ሰላም ምስሎች"},"gallery":[{"src":"/assets/about-1.jpg.png","en":"Our faithful parish community gathering in prayer and celebration.","am":"ምዕመናን በጸሎት እና በዓላት ላይ በአንድነት ሲሳተፉ።"},{"src":"/assets/about-2.jpg.png","en":"Inside the sanctuary, reflecting ancient Orthodox iconography.","am":"በቅድስት ሥላሴ ሥዕላት ያጌጠው የቤተ መቅደሱ ውስጣዊ እይታ።"},{"src":"/assets/about-3.jpg.png","en":"Celebrating traditional Ethiopian Orthodox liturgical ceremonies.","am":"ጥንታዊ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ሥርዓተ አምልኮ።"},{"src":"/assets/about-4.jpg.png","en":"Parish members and children participating in spiritual services.","am":"የደብሩ ምዕመናንና ሕፃናት በሰንበት መርሃ ግብር ሲሳተፉ።"}]}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('services', $seed${"en":{"title":"OUR SERVICES","worship":{"title":"Liturgy & Prayer","description":"Join our daily prayers, Mahlet, and Sunday Kidase."},"teaching":{"title":"Sacraments","description":"Baptism, Catechism, and Penance services."},"serving":{"title":"Church Education","description":"Sunday School and traditional Abnet classes."},"fellowship":{"title":"Evangelism","description":"Spiritual teachings and outreach programs."}},"am":{"title":"አገልግሎቶቻችን","worship":{"title":"ቅዳሴ እና ጸሎት","description":"በዕለታዊ ጸሎቶች፣ ማኅሌት እና የእሑድ ቅዳሴ ላይ ይሳተፉ።"},"teaching":{"title":"ምሥጢራት","description":"የጥምቀት፣ ትምህርተ ሃይማኖት እና የንስሐ አገልግሎቶች።"},"serving":{"title":"የቤተ ክርስቲያን ትምህርት","description":"የሰንበት ትምህርት ቤት እና የባህላዊ አብነት ትምህርቶች።"},"fellowship":{"title":"ስብከተ ወንጌል","description":"መንፈሳዊ ትምህርቶች እና የማኅበረሰብ ተደራሽነት ፕሮግራሞች።"}}}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('churchSchool', $seed${"en":{"sectionTag":"Serve at Your Parish","sectionTitle":"Church Education","abnet":{"title":"Traditional Church School","subtitle":"Abnet School","intro":"Preserving our sacred traditions by providing comprehensive religious education for all ages.","join":"Join Now"},"sundaySchool":{"title":"Sunday School","subtitle":"Youth & Family","intro":"Nurturing the next generation through biblical studies, cultural values, and spiritual fellowship tailored for children, youth, and families.","join":"Join Now"},"abnetLevels":{"nibab":{"title":"Nibab (Reading)","desc":"Learning Ge'ez alphabet and basic prayers."},"kidase":{"title":"Kidase (Liturgy)","desc":"Studying liturgical rites and sacred meanings."},"zema":{"title":"Zema (Hymns)","desc":"Learning ancient church hymns and sacred melodies."},"kine":{"title":"Kine (Poetry)","desc":"Advanced study of religious poetry and spiritual expression."}},"sundaySchoolLevels":{"bible":{"title":"Bible Study","desc":"Systematic study of scriptures and teachings."},"hymns":{"title":"Spiritual Hymns","desc":"Learning traditional spiritual songs and chants."},"liturgical":{"title":"Liturgical Education","desc":"Understanding church sacraments, rituals, and prayers."},"ethics":{"title":"Christian Life & Ethics","desc":"Practical guidance on Christian values, family, and community service."}}},"am":{"sectionTag":"በደብርዎ ያገልግሉ","sectionTitle":"ባህላዊ የቤተ ክርስቲያን ትምህርት ቤት","abnet":{"title":"የአቢነት ትምህርት","subtitle":"ባህላዊ ትምህርት ቤት","intro":"ለሁሉም ዕድሜ አጠቃላይ ሃይማኖታዊ ትምህርትን በማቅረብ ቅዱስ ወጎቻችንን እንጠብቃለን።","join":"ይቀላቀሉ"},"sundaySchool":{"title":"የሰንበት ትምህርት ቤት","subtitle":"ወጣቶች እና ቤተሰብ","intro":"ለልጆች፣ ወጣቶች እና ቤተሰቦች የተዘጋጀ የመጽሐፍ ቅዱስ ጥናት፣ ባህላዊ እሴቶች እና መንፈሳዊ ኅብረት።","join":"ይቀላቀሉ"},"abnetLevels":{"nibab":{"title":"ንባብ","desc":"የግእዝ ፊደል ማንበብ እና መሰረታዊ ጸሎቶችን መማር።"},"kidase":{"title":"ቅዳሴ","desc":"የቅዳሴ ሥርዓት እና ቅዱስ ትርጉሞቹን ማጥናት።"},"zema":{"title":"ዜማ","desc":"የቤተ ክርስቲያንን ጥንታዊ መዝሙሮች እና ቅዱስ ዜማዎችን መማር።"},"kine":{"title":"ቅኔ","desc":"የሃይማኖታዊ ግጥሞች እና የመንፈሳዊ ገለጻ የላቀ ጥናት።"}},"sundaySchoolLevels":{"bible":{"title":"መጽሐፍ ቅዱስ ጥናት","desc":"የመጽሐፍ ቅዱስ ቃላትንና አስተምህሮዎችን በጥልቀት ማጥናት።"},"hymns":{"title":"የመዝሙር ትምህርት","desc":"የበዓላት እና የክብረ በዓላት መዝሙራትን መማር።"},"liturgical":{"title":"የሥርዓተ አምልኮ ትምህርት","desc":"የቤተ ክርስቲያንን ሥርዓትና የጸሎት መርሃ ግብር ማጥናት።"},"ethics":{"title":"ክርስቲያናዊ ሥነ-ምግባር","desc":"በክርስቲያናዊ ሥነ-ምግባርና ፍቅር ማኅበረሰቡን ማገልገል።"}}}}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('news', $seed${"en":{"sectionTag":"Message & Blessings","sectionTitle":"From Our Father","fatherTitle":"Melake Genet Memhir Habtewold Tegegn","fatherRole":"Head Priest","fatherMessage":"\"May the grace of the Holy Trinity — Father, Son, and Holy Spirit — be upon all of you. Our church continues to grow in faith and love, serving as a beacon of hope for our community. Let us walk together in the light of our Lord.\"","newsTitle":"Latest News","news":[{"id":"news-1","date":"May 2026","title":"Community Outreach Program","excerpt":"Our parish launches a new community outreach program to support families in need through food donations and spiritual guidance."},{"id":"news-2","date":"April 2026","title":"Youth Fellowship Revival","excerpt":"A new youth fellowship program has been established, bringing young members together for Bible study, cultural activities, and spiritual growth."},{"id":"news-3","date":"March 2026","title":"Church Renovation Complete","excerpt":"The renovation of our prayer hall has been completed, featuring traditional Ethiopian Orthodox iconography and improved seating for our growing congregation."}]},"am":{"sectionTag":"መልእክት እና ቡራኬ","sectionTitle":"ከአባታችን","fatherTitle":"መልዓከ ገነት መምህር ሃብተወልድ ተገኝ","fatherRole":"የደብሩ አስተዳዳሪ","fatherMessage":"\"የቅድስት ሥላሴ — አብ፣ ወልድ እና መንፈስ ቅዱስ — ጸጋ በሁላችሁ ላይ ይሁን። ቤተ ክርስቲያናችን በእምነት እና በፍቅር ማደጉን ቀጥሏል፣ ለማኅበረሰባችን የተስፋ ምሰሶ ሆኖ በማገልገል። በጌታችን ብርሃን አብረን እንጓዝ።\"","newsTitle":"ዜና","news":[{"id":"news-1","date":"ግንቦት 2018","title":"የማኅበረሰብ ተደራሽነት ፕሮግራም","excerpt":"ደብራችን ችግረኞችን ለመርዳት የምግብ ልገሳ እና መንፈሳዊ ምክር አገልግሎት አዲስ ፕሮግራም ጀምሯል።"},{"id":"news-2","date":"ሚያዝያ 2018","title":"የወጣቶች ኅብረት ታድሷል","excerpt":"አዲስ የወጣቶች ኅብረት ፕሮግራም ተቋቁሞ ወጣቶችን ለመጽሐፍ ቅዱስ ጥናት፣ ባህላዊ ተግባራት እና መንፈሳዊ ዕድገት ያሰባስባል።"},{"id":"news-3","date":"መጋቢት 2018","title":"የቤተ ክርስቲያን ዕድሳት ተጠናቀቀ","excerpt":"የጸሎት አዳራሻችን ዕድሳት ተጠናቅቋል፣ ባህላዊ የኢትዮጵያ ኦርቶዶክስ ሥዕላትና ለዕድገታችን የተሻለ መቀመጫ ይዟል።"}]}}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('events', $seed${"en":{"sectionTag":"Parish Events","sectionTitle":"Annual Parish Celebrations","intro":"We celebrate the sacred feast days of our Lady Saint Virgin Mary throughout the year.","learnMore":"Learn More","mainFeastBadge":"Main Feast","events":[{"id":"event-1","title":"ኅዳር ጽጌ (Hidar Tsige)","date":"November 30 (ኅዳር 21)","description":"The main annual parish feast celebrating Our Lady Mary, Land of Grace (Bihere Tsige). Includes liturgical services, spiritual poetry (Qene), and a colorful procession.","isMain":true},{"id":"event-2","title":"ግንቦት ልደታ (Ginbot Lidet)","date":"May 9 (ግንቦት 1)","description":"Celebrating the birth of the Blessed Virgin Mary, Mother of God. A day filled with special divine liturgy and spiritual fellowship.","isMain":false},{"id":"event-3","title":"ነሐሴ ማርያም (Nehase Mariam)","date":"August 22 (ነሐሴ 16)","description":"Dormition and Assumption of the Blessed Virgin Mary. Marks the culmination of the 16-day Filseta Fasting with sacred liturgy.","isMain":false}]},"am":{"sectionTag":"የደብር በዓላት","sectionTitle":"ዓመታዊ የደብር በዓላት","intro":"በዓመቱ ውስጥ የእመቤታችን ቅድስት ድንግል ማርያም ቅዱስ በዓላትን በደመቀ ሁኔታ እናከብራለን።","learnMore":"ተጨማሪ ይወቁ","mainFeastBadge":"ዋና በዓል","events":[{"id":"event-1","title":"ኅዳር ጽጌ","date":"ኅዳር 21 (November 30)","description":"የደብራችን ዋና ዓመታዊ በዓል። እመቤታችን ቅድስት ድንግል ማርያምን በብሔረ ጽጌ ስም የምናስብበት፣ በዝማሬ፣ በቅኔ እና በታላቅ መንፈሳዊ ሥነ-ሥርዓት የሚከበር ታላቅ በዓል።","isMain":true},{"id":"event-2","title":"ግንቦት ልደታ","date":"ግንቦት 1 (May 9)","description":"የእመቤታችን የቅድስት ድንግል ማርያም ልደት በታላቅ መንፈሳዊ ጉባኤ እና በቅዳሴ ጸሎት የሚከበርበት የተቀደሰ ዕለት።","isMain":false},{"id":"event-3","title":"ነሐሴ ማርያም","date":"ነሐሴ 16 (August 22)","description":"የእመቤታችን የቅድስት ድንግል ማርያም ትንሣኤና ዕርገት (ፍልሰታ በዓል ፍጻሜ) በጸሎትና በቅዱስ ቍርባን የምናከብርበት ዕለት።","isMain":false}]}}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('donate', $seed${"en":{"sectionTag":"Generosity & Support","sectionTitle":"Support Our Ministry","intro":"Your generous donations support our parish, traditional school, Sunday school, and local community outreach programs. Every contribution helps preserve our sacred heritage.","copiedText":"Copied!","zelleNote":"Note: Please write your name and purpose of donation in the Zelle memo.","methods":[{"id":"cbe","bankName":"Commercial Bank of Ethiopia (CBE)","accountName":"Bihere Tsige Kidist Dengel Mariam Church","accountNumber":"1000123456789","type":"Bank Transfer","icon":"🏦"},{"id":"abyssinia","bankName":"Bank of Abyssinia","accountName":"Bihere Tsige Kidist Dengel Mariam Church","accountNumber":"987654321","type":"Bank Transfer","icon":"🏦"},{"id":"zelle","bankName":"Zelle (US / International)","accountName":"Bihere Tsige Church","accountNumber":"donate@beheretsige.org","type":"Mobile/Zelle Transfer","icon":"📱"}]},"am":{"sectionTag":"ልገሳ እና ድጋፍ","sectionTitle":"አገልግሎታችንን ይደግፉ","intro":"የእርስዎ ልግስና የደብራችንን አገልግሎት፣ የአቢነትና ሰንበት ትምህርት ቤቶችን፣ እንዲሁም የማኅበረሰብ ተደራሽነት ሥራዎችን ለመደገፍ ይውላል። እያንዳንዱ ድጋፍ የተቀደሰውን ሃይማኖታዊ ቅርሳችንን ለመጠበቅ ይረዳል።","copiedText":"ተገልብጧል!","zelleNote":"ማሳሰቢያ፡ እባክዎን በZelle ሜሞ ላይ ስምዎን እና የልገሳውን ዓላማ ይጥቀሱ።","methods":[{"id":"cbe","bankName":"የኢትዮጵያ ንግድ ባንክ (CBE)","accountName":"ብሔረ ጽጌ ቅድስት ድንግል ማርያም ቤተክርስቲያን","accountNumber":"1000123456789","type":"የባንክ ሒሳብ ማስተላለፊያ","icon":"🏦"},{"id":"abyssinia","bankName":"አቢሲኒያ ባንክ","accountName":"ብሔረ ጽጌ ቅድስት ድንግል ማርያም ቤተክርስቲያን","accountNumber":"987654321","type":"የባንክ ሒሳብ ማስተላለፊያ","icon":"🏦"},{"id":"zelle","bankName":"Zelle (ለአሜሪካ/ዓለም አቀፍ)","accountName":"Bihere Tsige Church","accountNumber":"donate@beheretsige.org","type":"በሞባይል/Zelle መላኪያ","icon":"📱"}]}}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('media', $seed${"en":{"sectionTag":"Watch & Listen","sectionTitle":"Media & Sermons","intro":"Watch divine liturgies, sermons, and spiritual programs from our parish, and follow us for the latest uploads.","viewAll":"Visit our YouTube Channel"},"am":{"sectionTag":"ይመልከቱ እና ያዳምጡ","sectionTitle":"ሚዲያ እና ስብከት","intro":"የቅዳሴ ሥርዓት፣ ስብከቶች እና መንፈሳዊ ፕሮግራሞችን ከደብራችን ይመልከቱ፣ አዳዲስ ይዘቶችን ለማግኘት ይከተሉን።","viewAll":"የዩቱብ ቻናላችንን ይጎብኙ"},"channelUrl":"https://youtube.com/@BehereTsigeMekaneSelamStMary","items":[{"id":"media-1","thumb":"/assets/about-1.jpg.png","href":"https://youtube.com/@BehereTsigeMekaneSelamStMary","en":{"type":"Video","title":"Sunday Divine Liturgy (Kidase)"},"am":{"type":"ቪዲዮ","title":"የእሑድ ቅዳሴ"}},{"id":"media-2","thumb":"/assets/about-3.jpg.png","href":"https://youtube.com/@BehereTsigeMekaneSelamStMary","en":{"type":"Video","title":"Feast of Hidar Tsige Celebration"},"am":{"type":"ቪዲዮ","title":"የኅዳር ጽጌ በዓል አከባበር"}},{"id":"media-3","thumb":"/assets/about-4.jpg.png","href":"https://youtube.com/@BehereTsigeMekaneSelamStMary","en":{"type":"Video","title":"Spiritual Teaching & Sermon"},"am":{"type":"ቪዲዮ","title":"መንፈሳዊ ትምህርትና ስብከት"}}]}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('contact', $seed${"en":{"sectionTag":"Get In Touch","sectionTitle":"Contact Us","intro":"We would love to hear from you. Reach out with questions, prayer requests, or to learn more about our parish.","infoHeading":"Reach Us","addressLabel":"Address","address":"Bihere Tsige Road, Gullele, Addis Ababa, Ethiopia","phoneLabel":"Phone","emailLabel":"Email","hoursLabel":"Office Hours","hours":"Monday – Saturday: 8:00 AM – 5:00 PM","formHeading":"Send Us a Message","nameLabel":"Full Name","namePlaceholder":"Your name","emailFieldLabel":"Email Address","emailPlaceholder":"you@example.com","messageLabel":"Your Message","messagePlaceholder":"How can we help you?","sendLabel":"Send Message"},"am":{"sectionTag":"ያግኙን","sectionTitle":"ያግኙን","intro":"ከእርስዎ መስማት እንወዳለን። ማንኛውም ጥያቄ፣ የጸሎት ጥያቄ ካለዎት ወይም ስለ ደብራችን የበለጠ ለማወቅ ያግኙን።","infoHeading":"ያግኙን","addressLabel":"አድራሻ","address":"የብሔረ ጽጌ መንገድ፣ ጉለሌ፣ አዲስ አበባ፣ ኢትዮጵያ","phoneLabel":"ስልክ","emailLabel":"ኢሜይል","hoursLabel":"የቢሮ ሰዓታት","hours":"ከሰኞ – ቅዳሜ፡ ከጠዋቱ 2:00 – ከቀኑ 11:00","formHeading":"መልእክት ይላኩልን","nameLabel":"ሙሉ ስም","namePlaceholder":"ስምዎ","emailFieldLabel":"ኢሜይል አድራሻ","emailPlaceholder":"you@example.com","messageLabel":"መልእክትዎ","messagePlaceholder":"እንዴት ልንረዳዎት እንችላለን?","sendLabel":"መልእክት ላክ"},"phone":"+251 11 320 1234","email":"info@beheretsigestmary.org","mapQuery":"Gullele, Addis Ababa, Ethiopia"}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('footer', $seed${"en":{"description":"Preserving the ancient traditions of the Ethiopian Orthodox Tewahedo Church while nurturing the spiritual growth of our community and providing a beacon of hope and grace.","colServices":"Service Hours","colContact":"Contact Us","colLinks":"Quick Links","sundayKidase":"Sunday Divine Liturgy (Kidase) - 5:00 AM","saturdayKidase":"Saturday Kidase - 6:00 AM","weekdayKidase":"Weekday Liturgy - 6:00 AM","address":"Bihere Tsige Road, Gullele, Addis Ababa, Ethiopia","phone":"Phone: +251 11 320 1234","email":"Email: info@beheretsigestmary.org","copyright":"© 2026 Bihere Tsige Mekane Selam Kidist Dengel Mariam Church. All rights reserved.","links":[{"label":"Home","href":"#home"},{"label":"About Us","href":"#about"},{"label":"Services","href":"#services"},{"label":"Events","href":"#events"},{"label":"News","href":"#news"},{"label":"Donate","href":"#donate"}]},"am":{"description":"የማኅበረሰባችንን መንፈሳዊ እድገት እያሳደገ የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተ ክርስቲያንን ጥንታዊ እምነት፣ ሥርዓትና ታሪክ ይጠብቃል።","colServices":"የአገልግሎት ሰዓታት","colContact":"ያግኙን","colLinks":"ፈጣን አገናኞች","sundayKidase":"የእሑድ ቅዳሴ - ከጧቱ 11:00 ሰዓት ጀምሮ","saturdayKidase":"የቅዳሜ ቅዳሴ - ከጧቱ 12:00 ሰዓት ጀምሮ","weekdayKidase":"የዕለታት ቅዳሴ - ከጧቱ 12:00 ሰዓት ጀምሮ","address":"የብሔረ ጽጌ መንገድ፣ ጉለሌ፣ አዲስ አበባ፣ ኢትዮጵያ","phone":"ስልክ፡ +251 11 320 1234","email":"ኢሜይል፡ info@beheretsigestmary.org","copyright":"© 2026 የብሔረ ጽጌ መካነ ሰላም ቅድስት ማርያም ቤተክርስቲያን። መብቱ በሕግ የተጠበቀ ነው።","links":[{"label":"መነሻ ገጽ","href":"#home"},{"label":"ስለ እኛ","href":"#about"},{"label":"አገልግሎቶች","href":"#services"},{"label":"መርሃ ግብራት","href":"#events"},{"label":"ዜናዎች","href":"#news"},{"label":"ዕርዳታ / መባዕ ያድርጉ","href":"#donate"}]}}$seed$::jsonb)
on conflict (section) do nothing;

insert into public.site_content (section, data)
values ('socials', $seed$[{"id":"social-youtube","label":"YouTube","href":"https://youtube.com/@BehereTsigeMekaneSelamStMary"},{"id":"social-facebook","label":"Facebook","href":"https://facebook.com/BehereTsigeMekaneSelamStMary"},{"id":"social-telegram","label":"Telegram","href":"https://t.me/BehereTsigeMekaneSelam"},{"id":"social-instagram","label":"Instagram","href":"https://instagram.com/behere.tsige.st.mary"},{"id":"social-tiktok","label":"TikTok","href":"https://tiktok.com/@beheretsige.st.mary"},{"id":"social-linkedin","label":"LinkedIn","href":"https://linkedin.com/company/beheretsige-st-mary"}]$seed$::jsonb)
on conflict (section) do nothing;


-- ---------- analytics_summary: aggregated stats for the admin dashboard ----------
create or replace function public.analytics_summary(days int default 30)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  since timestamptz := now() - make_interval(days => days);
  result jsonb;
begin
  if not public.is_admin() then
    raise exception 'not authorized';
  end if;

  select jsonb_build_object(
    'total_events',  (select count(*) from interactions where created_at >= since),
    'page_views',    (select count(*) from interactions where event_type = 'page_view' and created_at >= since),
    'views_today',   (select count(*) from interactions where event_type = 'page_view' and created_at >= date_trunc('day', now())),
    'sessions',      (select count(distinct session_id) from interactions where created_at >= since and session_id is not null),
    'form_submits',  (select count(*) from interactions where event_type = 'form_submit' and created_at >= since),
    'chat_messages', (select count(*) from interactions where event_type = 'chat_message' and created_at >= since),
    'daily_views', (
      select coalesce(jsonb_agg(jsonb_build_object('day', d.day, 'views', d.views) order by d.day), '[]'::jsonb)
      from (
        select date_trunc('day', created_at)::date as day, count(*) as views
        from interactions
        where event_type = 'page_view' and created_at >= since
        group by 1
      ) d
    ),
    'top_pages', (
      select coalesce(jsonb_agg(jsonb_build_object('page', p.page, 'views', p.views) order by p.views desc), '[]'::jsonb)
      from (
        select coalesce(page, '?') as page, count(*) as views
        from interactions
        where event_type = 'page_view' and created_at >= since
        group by 1
        order by count(*) desc
        limit 10
      ) p
    ),
    'event_types', (
      select coalesce(jsonb_agg(jsonb_build_object('type', e.event_type, 'count', e.cnt) order by e.cnt desc), '[]'::jsonb)
      from (
        select event_type, count(*) as cnt
        from interactions
        where created_at >= since
        group by 1
      ) e
    ),
    'languages', (
      select coalesce(jsonb_agg(jsonb_build_object('lang', l.lang, 'count', l.cnt) order by l.cnt desc), '[]'::jsonb)
      from (
        select coalesce(lang, '?') as lang, count(*) as cnt
        from interactions
        where event_type = 'page_view' and created_at >= since
        group by 1
      ) l
    ),
    'top_clicks', (
      select coalesce(jsonb_agg(jsonb_build_object('label', c.label, 'count', c.cnt) order by c.cnt desc), '[]'::jsonb)
      from (
        select coalesce(nullif(metadata->>'label', ''), '(no label)') as label, count(*) as cnt
        from interactions
        where event_type = 'click' and created_at >= since
        group by 1
        order by count(*) desc
        limit 10
      ) c
    )
  ) into result;

  return result;
end;
$$;
