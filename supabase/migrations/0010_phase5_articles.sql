-- ============================================================================
-- Behere Tsige — Phase 5: Articles platform
-- authors, articles, tags, articles_tags, article_likes, article_comments
-- (Dev A — migration range 0010–0019)
-- ============================================================================

create table if not exists public.authors (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid references public.profiles(id) on delete set null,
  name        text not null,
  bio         text,
  photo_url   text,
  created_at  timestamptz not null default now()
);

create table if not exists public.articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title_en      text not null,
  title_am      text,
  excerpt_en    text,
  excerpt_am    text,
  body_en       text,
  body_am       text,
  cover_url     text,
  author_id     uuid references public.authors(id) on delete set null,
  status        text not null default 'draft', -- draft | scheduled | published | unlisted | archived
  scheduled_at  timestamptz,
  published_at  timestamptz,
  like_count    int not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.tags (
  id   uuid primary key default gen_random_uuid(),
  tag  text unique not null
);

create table if not exists public.articles_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id     uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create table if not exists public.article_likes (
  article_id uuid references public.articles(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (article_id, user_id)
);

create table if not exists public.article_comments (
  id                uuid primary key default gen_random_uuid(),
  article_id        uuid references public.articles(id) on delete cascade,
  user_id           uuid references auth.users(id) on delete set null,
  parent_comment_id uuid references public.article_comments(id) on delete cascade,
  body              text not null,
  status            text not null default 'visible', -- visible | hidden
  created_at        timestamptz not null default now()
);

create index if not exists idx_articles_status_pub on public.articles (status, published_at desc);
create index if not exists idx_comments_article on public.article_comments (article_id, created_at);

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.authors           enable row level security;
alter table public.articles          enable row level security;
alter table public.tags              enable row level security;
alter table public.articles_tags     enable row level security;
alter table public.article_likes     enable row level security;
alter table public.article_comments  enable row level security;

drop policy if exists authors_select on public.authors;
create policy authors_select on public.authors for select using (true);
drop policy if exists authors_admin on public.authors;
create policy authors_admin on public.authors for all using (public.is_admin()) with check (public.is_admin());

-- Public sees published; admins see everything.
drop policy if exists articles_select on public.articles;
create policy articles_select on public.articles
  for select using (status = 'published' or public.is_admin());
drop policy if exists articles_admin on public.articles;
create policy articles_admin on public.articles for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists tags_select on public.tags;
create policy tags_select on public.tags for select using (true);
drop policy if exists tags_admin on public.tags;
create policy tags_admin on public.tags for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists at_select on public.articles_tags;
create policy at_select on public.articles_tags for select using (true);
drop policy if exists at_admin on public.articles_tags;
create policy at_admin on public.articles_tags for all using (public.is_admin()) with check (public.is_admin());

-- Likes: anyone can read counts; a logged-in user manages only their own like.
drop policy if exists likes_select on public.article_likes;
create policy likes_select on public.article_likes for select using (true);
drop policy if exists likes_insert on public.article_likes;
create policy likes_insert on public.article_likes for insert with check (auth.uid() = user_id);
drop policy if exists likes_delete on public.article_likes;
create policy likes_delete on public.article_likes for delete using (auth.uid() = user_id);

-- Comments: public reads visible ones; logged-in users post; own/admin edit+delete.
drop policy if exists comments_select on public.article_comments;
create policy comments_select on public.article_comments
  for select using (status = 'visible' or public.is_admin());
drop policy if exists comments_insert on public.article_comments;
create policy comments_insert on public.article_comments
  for insert with check (auth.uid() = user_id);
drop policy if exists comments_update on public.article_comments;
create policy comments_update on public.article_comments
  for update using (auth.uid() = user_id or public.is_admin()) with check (auth.uid() = user_id or public.is_admin());
drop policy if exists comments_delete on public.article_comments;
create policy comments_delete on public.article_comments
  for delete using (auth.uid() = user_id or public.is_admin());

-- ============================================================================
-- Seed (sample content)
-- ============================================================================
insert into public.authors (name, bio, photo_url) values
  ('Melake Genet Memhir Habtewold Tegegn', 'Head priest of the parish.', '/assets/profile-pic-preist.png'),
  ('Sunday School Media Team', 'Articles and reflections from the parish youth.', null)
on conflict do nothing;

insert into public.tags (tag) values ('faith'), ('teaching'), ('community'), ('feast')
on conflict do nothing;

do $$
declare a1 uuid; auth1 uuid;
begin
  select id into auth1 from public.authors order by created_at limit 1;

  insert into public.articles (slug, title_en, title_am, excerpt_en, excerpt_am, body_en, body_am, author_id, status, published_at)
  values
    ('walking-in-faith', 'Walking in Faith', 'በእምነት መመላለስ',
     'A short reflection on living each day in the light of the Gospel.',
     'በወንጌል ብርሃን በየዕለቱ ስለ መኖር አጭር ነጸብራቅ።',
     'Faith is not a single moment but a daily walk. As the faithful gather in prayer, we are reminded that the Lord walks with us through every season of life.\n\nLet us hold fast to the traditions handed to us, and carry the light of Christ into our homes and communities.',
     'እምነት የአንድ አፍታ ጉዳይ ሳይሆን የየዕለት መመላለስ ነው። ምእመናን በጸሎት ሲሰበሰቡ፣ ጌታ በሕይወታችን ወቅት ሁሉ ከእኛ ጋር እንደሚሄድ ይታወሰናል።',
     auth1, 'published', now() - interval '2 days'),
    ('the-meaning-of-tsome', 'The Meaning of Fasting (Tsome)', 'የጾም ትርጉም',
     'Why the Church fasts, and how fasting forms the soul.',
     'ቤተ ክርስቲያን ለምን እንደምትጾም እና ጾም ነፍስን እንዴት እንደሚቀርጽ።',
     'Fasting in the Ethiopian Orthodox Tewahedo tradition is a school of the soul. It teaches humility, sharpens prayer, and opens the heart to the needs of others.\n\nThrough fasting we deny the body a little, that the spirit may be filled.',
     'በኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ትውፊት ጾም የነፍስ ትምህርት ቤት ነው። ትሕትናን ያስተምራል፣ ጸሎትን ያጠራል።',
     auth1, 'published', now() - interval '6 days')
  on conflict (slug) do nothing;
end $$;
