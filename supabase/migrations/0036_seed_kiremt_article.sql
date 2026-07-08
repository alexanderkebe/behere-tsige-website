-- ============================================================================
-- Behere Tsige — Seed article: "You created summer and winter" (Ps 74:17)
-- Authored by Melake Genet Memhir Habtewold Tegegn (Head Priest).
-- Includes 54 likes, a view count, and 12 approved (visible) comments.
-- ============================================================================

do $$
declare
  auth1 uuid;
  art1  uuid;
begin
  -- Reuse the existing head-priest author (with the priest profile photo).
  select id into auth1
  from public.authors
  where name = 'Melake Genet Memhir Habtewold Tegegn'
  limit 1;

  -- Fall back to creating the author if the seed row is missing.
  if auth1 is null then
    insert into public.authors (name, bio, photo_url)
    values ('Melake Genet Memhir Habtewold Tegegn', 'Head priest of the parish.', '/assets/profile-pic-preist.png')
    returning id into auth1;
  end if;

  insert into public.articles (
    slug, title_en, title_am, excerpt_en, excerpt_am, body_en, body_am,
    cover_url, author_id, status, published_at, like_count, view_count
  )
  values (
    'you-created-summer-and-winter',
    'You Created Summer and Winter',
    '«ክረምተ ወሐጋየ ዘአንተ ፈጠርከ»',
    'A reflection on the seasons God appointed — and the call to spend this rainy season learning the Church''s traditional teaching.',
    'እግዚአብሔር ስለ ወሰናቸው ወቅቶች የሚያስተነትን፣ ይህን ክረምት በቤተ ክርስቲያን የአብነት ትምህርት እንድናሳልፍ የሚጠራ ጽሑፍ።',
    -- body_en (English localization)
    E'"You created summer and winter." (Psalm 74:17)\n\n' ||
    E'God Almighty has divided the nourishment of the world — both the bodily and the spiritual — into four parts. He divided the bodily nourishment into the four seasons of the year: winter (the rainy season), summer, autumn, and spring; and He divided the spiritual nourishment into the teaching of the four Evangelists — namely Matthew, Mark, Luke, and John.\n\n' ||
    E'Just as our bodily food comes from the seasons listed above, so too the spiritual food of the soul does not come from outside the four Evangelists. This is because God our Lord is the Creator and the Sustainer of both body and soul.\n\n' ||
    E'And so, the season we are in now is winter — the rainy season — one of the four seasons of the year. From it we receive not only bodily food, but also spiritual food that surpasses the bodily. In particular, since it is a season in which we take a rest from secular (scientific) studies, we extend our invitation that we may spend this rainy season learning together the traditional teaching of the Church. May God Almighty make this season a season of peace for us.',
    -- body_am (original Amharic)
    E'«ክረምተ ወሐጋየ ዘአንተ ፈጠርከ»\nትርጉም፦ ክረምትንና በጋን አንተ ፈጠርሃቸው\n(መዝ 73 ፥ 17)\n\n' ||
    E'እግዚአብሔር አምላክ የዓለሙን ምግብ ሥጋዊውንም መንፈሳዊውንም በአራት ከፍሎታል፡፡ ሥጋዊውን በአራቱ ክፍላተ ዘመን፦ ክረምት፣ በጋ፣ መጸውና ጸደይ ብሎ ሲከፍለው፤ መንፈሳዊውን ደግሞ በአራቱ ወንጌላውያን ትምህርት ማለትም ማቴዎስ፣ ማርቆስ፣ ሉቃስ፣ ዮሐንስ በእነዚህ ከፍሎታል፡፡\n\n' ||
    E'የሰው ሥጋዊ ምግብና ከላይ ከተዘረዘሩት ክፍላተ ዘመን እንደሚገኝ ሁሉ የነፍስም መንፈሳዊ ምግብና ከአራቱ ወንጌላውያን አይወጣም፡፡ ምክንያቱም እግዚአብሔር አምላካችን የሥጋም የነፍስም ፈጣሪ፤ መጋቢ ነውና፡፡\n\n' ||
    E'በመሆኑም አሁን ያለንበት ጊዜ ከአራቱ ክፍላተ ዘመን አንዱ የሆነው ክረምት ነው፡፡ ከዚህም የምናገኘው ሥጋዊ ምግብ ብቻ ሳይሆን ከሥጋዊ ምግብ ያለፈ መንፈሳዊም ምግብ የምናገኝበት በተለይም ከዓለማዊ( ሣይንስ) ትምህርት እረፍት የምንወስድበት ወቅት እንደመሆኑ መጠን ክረምቱን በቤተክርስቲያን የአብነት ትምህርት እየተማማርን እንድናሳልፍ ጥሪያችንን እናስተላልፋለን ። እግዚአብሔር አምላክ ክረምቱን የሰላም ያድርግልን ።',
    '/assets/profile-pic-preist.png',
    auth1,
    'published',
    now() - interval '1 day',
    54,   -- like_count
    427   -- view_count
  )
  on conflict (slug) do update
    set title_en    = excluded.title_en,
        title_am    = excluded.title_am,
        excerpt_en  = excluded.excerpt_en,
        excerpt_am  = excluded.excerpt_am,
        body_en     = excluded.body_en,
        body_am     = excluded.body_am,
        author_id   = excluded.author_id,
        status      = excluded.status,
        published_at= excluded.published_at,
        like_count  = excluded.like_count,
        view_count  = excluded.view_count
  returning id into art1;

  -- Tag it (faith + teaching are already seeded in 0010).
  insert into public.articles_tags (article_id, tag_id)
  select art1, t.id from public.tags t where t.tag in ('faith', 'teaching')
  on conflict do nothing;

  -- 12 approved guest comments.
  insert into public.article_comments (article_id, guest_name, body, status, created_at) values
    (art1, 'Selamawit G.',    'እግዚአብሔር ይስጥልኝ አባ! በጣም የሚያንጽ ትምህርት ነው። 🙏',                                          'visible', now() - interval '22 hours'),
    (art1, 'Yohannes T.',     'Amen. May God make this rainy season a season of peace for all of us.',                'visible', now() - interval '20 hours'),
    (art1, 'Hana M.',         'ክረምቱን በአብነት ትምህርት ማሳለፍ በጣም ጠቃሚ ነው። እናመሰግናለን።',                                      'visible', now() - interval '19 hours'),
    (art1, 'Daniel A.',       'Beautiful reflection connecting the four seasons with the four Evangelists.',          'visible', now() - interval '18 hours'),
    (art1, 'Meron K.',        'በረከቱን ያብዛልን። 🌧️',                                                                    'visible', now() - interval '17 hours'),
    (art1, 'Abel W.',         'Thank you for the invitation, Memhir. Looking forward to the classes this season.',    'visible', now() - interval '15 hours'),
    (art1, 'Tsion B.',        'እግዚአብሔር ክረምቱን የሰላም ያድርግልን። አሜን።',                                                     'visible', now() - interval '13 hours'),
    (art1, 'Kaleb D.',        'Such a timely message. Rest from studies, but not from learning the faith.',           'visible', now() - interval '11 hours'),
    (art1, 'Rahel S.',        'ወስብሐት ለእግዚአብሔር! የነፍስ ምግብ ከአራቱ ወንጌላውያን አይወጣም — ጥሩ ማስተማሪያ።',                          'visible', now() - interval '9 hours'),
    (art1, 'Nahom G.',        'God bless you, Head Priest. Sharing this with our Sunday school group.',               'visible', now() - interval '6 hours'),
    (art1, 'Bethlehem A.',    'አሜን አሜን። ክረምቱን የበረከት ያድርግልን። 🙏🌿',                                                    'visible', now() - interval '4 hours'),
    (art1, 'Samuel H.',       'Truly, God is the Creator and Sustainer of both body and soul. Amen.',                 'visible', now() - interval '2 hours');
end $$;
