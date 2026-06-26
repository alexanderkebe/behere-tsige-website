-- ============================================================================
-- Behere Tsige — Phase 6 (Donations & Bank Accounts)
-- Tables: donation_projects, contributions, bank_accounts
-- ============================================================================

-- ---------- donation_projects ----------
create table if not exists public.donation_projects (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_am text,
  description_en text,
  description_am text,
  read_more_en text,
  read_more_am text,
  category text not null default 'general', -- general, parish, sunday_school, abnet
  goal_amount numeric not null,
  raised_amount numeric not null default 0,
  currency text not null default 'ETB',
  status text not null default 'active', -- active, completed, archived
  cover_url text,
  created_at timestamptz not null default now()
);

-- ---------- contributions ----------
create table if not exists public.contributions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.donation_projects(id) on delete set null,
  donor_name text not null,
  donor_email text,
  amount numeric not null,
  currency text not null default 'ETB',
  method text not null default 'chapa', -- chapa, bank, cash
  chapa_tx_ref text unique,
  status text not null default 'pending', -- pending, completed, failed
  is_anonymous boolean not null default false,
  message text,
  created_at timestamptz not null default now()
);

-- ---------- bank_accounts ----------
create table if not exists public.bank_accounts (
  id uuid primary key default gen_random_uuid(),
  bank_name text not null,
  account_name text not null,
  account_number text not null,
  type text not null, -- local, international, us
  swift text,
  routing text,
  notes text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- Row-Level Security
-- ============================================================================
alter table public.donation_projects enable row level security;
alter table public.contributions enable row level security;
alter table public.bank_accounts enable row level security;

-- Public reads
create policy public_select_donation_projects on public.donation_projects for select using (true);
create policy public_select_bank_accounts on public.bank_accounts for select using (true);

-- Public insert contributions (allows anyone to donate)
create policy public_insert_contributions on public.contributions for insert with check (true);

-- Admin full access
do $$ 
declare
  t text;
begin
  for t in 
    select table_name 
    from information_schema.tables 
    where table_schema = 'public' 
      and table_name in ('donation_projects', 'contributions', 'bank_accounts')
  loop
    execute format('create policy admin_all_%I on public.%I for all using (public.is_admin()) with check (public.is_admin());', t, t);
  end loop;
end $$;

-- ============================================================================
-- Seed Initial Data
-- ============================================================================

-- Seed Donation Projects
insert into public.donation_projects (title_en, title_am, description_en, description_am, read_more_en, read_more_am, category, goal_amount, raised_amount, cover_url)
values
  (
    'Sanctuary Rebuilding & Expansion',
    'ቤተ መቅደሱን ማደስና ማስፋፋት',
    'Support the restoration of our ancient sanctuary, structural upgrades, and new liturgical decorations.',
    'የደብራችንን ቤተ መቅደስ መዋቅራዊ ግንባታ ለማደስ፣ ጥንታዊ ቅርሶችን ለመጠበቅና የውስጥ ማስጌጫዎችን ለመግጠም የሚደረግ ታላቅ ፕሮጀክት።',
    'This project focuses on expanding the main worship hall to accommodate the growing parish community, strengthening foundations, and installing traditional ecclesiastical paintings on the walls and dome.',
    'ይህ ፕሮጀክት ከጊዜ ወደ ጊዜ እያደገ የመጣውን የምዕመናን ቁጥር ለመያዝ ዋናውን የአምልኮ አዳራሽ ማስፋፋት፣ መሠረቱን ማጠናከር እና በግድግዳዎች እና በጉልላቱ ላይ ባህላዊ የቤተክርስቲያን ስዕሎችን መትከል ላይ ያተኩራል።',
    'parish',
    5000000,
    1200000,
    'https://images.unsplash.com/photo-1548625361-155de6c7f54a?q=80&w=600'
  ),
  (
    'Sunday School & Youth Outreach',
    'የሰንበት ትምህርት ቤት አገልግሎት',
    'Help purchase educational materials, instruments, and fund seasonal youth camps.',
    'የሰንበት ትምህርት ቤት መፃህፍት፣ የዜማ ዕቃዎች ግዥ እና የወጣቶች መንፈሳዊ ጉዞዎችንና መርሃ ግብሮችን መደገፊያ።',
    'We aim to empower the next generation with deep spiritual foundations through digital learning materials, choir audio systems, and local charity projects.',
    'የዲጂታል መማሪያ ቁሳቁሶችን፣ የመዘምራን የድምፅ ማጉያ ስርዓቶችን እና የአካባቢ የበጎ አድራጎት ፕሮጀክቶችን በማቅረብ ቀጣዩን ትውልድ ጥልቅ መንፈሳዊ መሠረት ለማስታጠቅ አልመናል።',
    'sunday_school',
    1500000,
    450000,
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=600'
  ),
  (
    'Abnet Traditional School Support',
    'የአብነት ትምህርት ቤት ማጠናከሪያ',
    'Support traditional Ge''ez classes, liturgy training, and sustain teaching clergy.',
    'የባህላዊ የግዕዝ ቋንቋ፣ የዜማ፣ የቅኔ የአብነት ትምህርት ክፍሎችንና መምህራን ካህናትን መደገፊያ።',
    'This project provides living stipends and classroom facilities for traditional students learning ancient chant books (Degua, Soma Degua) and liturgical leadership.',
    'ይህ ፕሮጀክት የጥንት የዜማ መጻሕፍትን (ድጓ፣ ጾመ ድጓ) እና ሥርዓተ ቅዳሴን ለሚማሩ የአብነት ተማሪዎች የመኖሪያ አበል እና የክፍል መገልገያዎችን ያቀርባል።',
    'abnet',
    2000000,
    600000,
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600'
  );

-- Seed Bank Accounts
insert into public.bank_accounts (bank_name, account_name, account_number, type, swift, routing, notes, display_order)
values
  (
    'Commercial Bank of Ethiopia (CBE)',
    'Bihere Tsige Kidist Dengel Mariam Church',
    '1000123456789',
    'local',
    null,
    null,
    'Primary account for local contributions inside Ethiopia.',
    1
  ),
  (
    'Bank of Abyssinia',
    'Bihere Tsige Kidist Dengel Mariam Church',
    '987654321',
    'local',
    null,
    null,
    'Alternative bank account for local transfers.',
    2
  ),
  (
    'Zelle (US / International)',
    'Bihere Tsige Church',
    'donate@beheretsige.org',
    'us',
    null,
    null,
    'Please write your name and purpose of donation in the Zelle memo.',
    3
  );
