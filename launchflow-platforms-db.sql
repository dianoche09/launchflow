-- ============================================================
-- LaunchFlow — Platform Backend & Database Sistemi
-- ============================================================

-- Clean up existing tables to avoid "already exists" errors
drop table if exists public.platform_test_logs cascade;
drop table if exists public.platform_selectors cascade;
drop table if exists public.launch_queue cascade;
drop table if exists public.submissions cascade;
drop table if exists public.platforms cascade;
drop table if exists public.packages cascade;
drop table if exists public.credit_packages cascade;

-- Profiles tablosunu güncelle (eksik kolonlar varsa ekle)
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'role') then
    alter table public.profiles add column role text default 'user';
  end if;
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'credits') then
    alter table public.profiles add column credits integer default 0;
  end if;
end $$;

-- ============================================================
-- 1. PLATFORMS TABLOSU
-- ============================================================

create table public.platforms (
  id            uuid default gen_random_uuid() primary key,

  -- Temel bilgiler
  name          text not null,
  website       text not null,
  submit_url    text,
  logo_url      text,

  -- Sınıflandırma
  category      text not null check (category in (
                  'launch',       -- Product Hunt, Uneed, BetaList...
                  'ai_directory', -- Futurepedia, TAAFT...
                  'saas_directory', -- SaaSHub, AlternativeTo...
                  'community',    -- Reddit, HN, Dev.to...
                  'deal',         -- AppSumo, Dealify...
                  'press',        -- Ben's Bites, TLDR...
                  'review'        -- G2, Capterra...
                )),

  tier          integer not null check (tier in (1, 2, 3)),
  -- 1 = Starter paketi, 2 = Launch paketi, 3 = Launch Pro paketi

  -- Otomasyon
  automation_type text not null check (automation_type in (
                  'auto',     -- Bot tamamen halleder
                  'assisted', -- Bot doldurur, kullanıcı submit basar
                  'guided'    -- Biz copy + rehber, kullanıcı submit
                )),

  automation_difficulty text check (automation_difficulty in (
                  'easy', 'medium', 'hard'
                )),

  -- Teknik detaylar
  login_required  boolean default false,
  captcha_risk    boolean default false,
  selectors       jsonb,
  -- Örnek: { "name": "input[name='name']", "url": "input[name='url']", ... }

  submission_notes text,
  -- Guided platformlar için kullanıcıya gösterilecek adım adım rehber

  -- Değer metrikleri
  domain_rating   integer default 0,  -- Ahrefs DR skoru
  monthly_traffic bigint default 0,   -- Tahmini aylık trafik
  seo_value       integer default 5 check (seo_value between 1 and 10),
  traffic_value   integer default 5 check (traffic_value between 1 and 10),

  -- Durum
  is_active       boolean default true,
  is_verified     boolean default false, -- Bot gerçekten çalışıyor mu test edildi mi
  last_tested_at  timestamptz,
  success_rate    numeric(5,2) default 0, -- Son 30 günlük başarı oranı (%)

  -- Meta
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Index'ler
create index idx_platforms_tier on public.platforms(tier);
create index idx_platforms_category on public.platforms(category);
create index idx_platforms_active on public.platforms(is_active);
create index idx_platforms_automation on public.platforms(automation_type);

-- RLS
alter table public.platforms enable row level security;
create policy "Platforms are public read" on public.platforms
  for select using (true);
create policy "Only admin can modify platforms" on public.platforms
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- 2. SUBMISSIONS TABLOSU (Genişletilmiş)
-- ============================================================

create table public.submissions (
  id            uuid default gen_random_uuid() primary key,
  project_id    uuid references public.projects(id) on delete cascade,
  platform_id   uuid references public.platforms(id),

  -- Durum
  status        text default 'queued' check (status in (
                  'queued',    -- Kuyruğa eklendi
                  'submitted', -- Bot/kullanıcı submit etti
                  'approved',  -- Platform onayladı
                  'rejected',  -- Platform reddetti
                  'failed',    -- Teknik hata
                  'skipped',   -- Önceden submit edilmiş, atlandı
                  'manual_pending' -- Guided: kullanıcı henüz submit etmedi
                )),

  submission_type text check (submission_type in ('auto', 'assisted', 'guided')),

  -- Zamanlama
  queued_at     timestamptz default now(),
  submitted_at  timestamptz,
  approved_at   timestamptz,

  -- Sonuç
  result_url    text,         -- Onaylanan listing URL'i
  screenshot_url text,        -- Submit anı screenshot
  error_message text,
  rejection_reason text,

  -- Retry
  retry_count   integer default 0,
  next_retry_at timestamptz,

  -- Analytics
  referral_visits integer default 0,
  backlink_dr   integer,       -- Platform'un DR skoru (snapshot)

  -- Guided submission için
  guided_copy   jsonb,
  -- { "title": "...", "description": "...", "tags": [...], "step_by_step": [...] }

  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

create index idx_submissions_project on public.submissions(project_id);
create index idx_submissions_status on public.submissions(status);
create index idx_submissions_platform on public.submissions(platform_id);


-- ============================================================
-- 3. PLATFORM SELECTORS TABLOSU
-- Bot için CSS selector'ları ayrı tutuyoruz — bot güncellemeleri
-- platform tablosunu etkilemesin
-- ============================================================

create table public.platform_selectors (
  id          uuid default gen_random_uuid() primary key,
  platform_id uuid references public.platforms(id) on delete cascade unique,

  -- Form alanları
  name_input        text,
  url_input         text,
  tagline_input     text,
  description_input text,
  email_input       text,
  twitter_input     text,
  category_select   text,
  logo_upload       text,
  submit_button     text,

  -- Login alanları (login_required = true için)
  login_email_input    text,
  login_pass_input     text,
  login_submit_button  text,

  -- Doğrulama
  success_indicator text,  -- Submit sonrası başarı göstergesi CSS selector
  error_indicator   text,

  -- Notlar
  notes             text,  -- Özel durumlar için geliştirici notu
  last_updated_at   timestamptz default now()
);

-- RLS: sadece admin
alter table public.platform_selectors enable row level security;
create policy "Only admin can manage selectors" on public.platform_selectors
  for all using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );


-- ============================================================
-- 4. PLATFORM TEST LOGS — Bot'ların test sonuçları
-- ============================================================

create table public.platform_test_logs (
  id            uuid default gen_random_uuid() primary key,
  platform_id   uuid references public.platforms(id) on delete cascade,
  tested_at     timestamptz default now(),
  success       boolean,
  error_type    text check (error_type in (
                  'selector_not_found',
                  'captcha_blocked',
                  'login_failed',
                  'timeout',
                  'network_error',
                  'form_validation_error',
                  'other'
                )),
  error_message text,
  duration_ms   integer,
  screenshot_url text
);

create index idx_platform_test_platform on public.platform_test_logs(platform_id);


-- ============================================================
-- 5. PACKAGES TABLOSU — Paket tanımları
-- ============================================================

create table public.packages (
  id            uuid default gen_random_uuid() primary key,
  slug          text unique not null,  -- 'starter' | 'launch' | 'pro'
  name          text not null,         -- 'Starter' | 'Launch' | 'Launch Pro'
  price_cents   integer not null,      -- 900 | 1900 | 2900
  credits       integer not null,      -- 19 | 49 | 99
  max_tier      integer not null,      -- 1 | 2 | 3
  description   text,
  features      jsonb,                 -- Feature listesi
  is_active     boolean default true,
  stripe_price_id text,                -- Stripe price ID
  created_at    timestamptz default now()
);

-- Başlangıç paketleri
insert into public.packages (slug, name, price_cents, credits, max_tier, description, features, stripe_price_id) values
(
  'starter',
  'Starter',
  900,
  19,
  1,
  'Perfect for testing. Top launch platforms only.',
  '["19 platform submissions", "Tier 1 launch sites", "Basic AI launch kit", "Submission dashboard", "Launch report"]'::jsonb,
  'price_starter_placeholder'
),
(
  'launch',
  'Full Launch',
  1900,
  49,
  2,
  'The full launch experience. Launch sites + directories.',
  '["49 platform submissions", "All Tier 1 + Tier 2", "Full AI launch kit", "AI + SaaS directories", "Smart queue ordering", "Live tracking dashboard", "Launch report PDF"]'::jsonb,
  'price_launch_placeholder'
),
(
  'pro',
  'Launch Pro',
  2900,
  99,
  3,
  'Maximum visibility. Every platform + communities.',
  '["99+ platform submissions", "All tiers included", "Communities + Reddit copy", "HN submit guide", "Deal platforms", "Priority queue", "Everything in Full Launch"]'::jsonb,
  'price_pro_placeholder'
);

-- Credit paketleri
create table public.credit_packages (
  id            uuid default gen_random_uuid() primary key,
  slug          text unique not null,
  name          text not null,
  price_cents   integer not null,
  credits       integer not null,
  price_per_credit numeric(6,4),
  is_active     boolean default true,
  stripe_price_id text,
  created_at    timestamptz default now()
);

insert into public.credit_packages (slug, name, price_cents, credits, price_per_credit, stripe_price_id) values
('credits_19',  'Starter Pack',  900,  19,  0.4737, 'price_credits_19_placeholder'),
('credits_49',  'Growth Pack',   1900, 49,  0.3878, 'price_credits_49_placeholder'),
('credits_120', 'Builder Pack',  3900, 120, 0.3250, 'price_credits_120_placeholder');


-- ============================================================
-- 6. LAUNCH QUEUE — Submission sırası ve öncelik sistemi
-- ============================================================

create table public.launch_queue (
  id            uuid default gen_random_uuid() primary key,
  project_id    uuid references public.projects(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete cascade,
  platform_id   uuid references public.platforms(id),

  priority      integer default 100,
  -- Düşük = yüksek öncelik (tier 1 = 10, tier 2 = 50, tier 3 = 100)

  scheduled_at  timestamptz default now(),
  -- SEO için tier 2-3 gecikmeli

  status        text default 'waiting' check (status in (
                  'waiting', 'processing', 'done', 'failed'
                )),

  worker_id     text,       -- Hangi worker işliyor
  started_at    timestamptz,
  completed_at  timestamptz,

  created_at    timestamptz default now()
);

create index idx_queue_status on public.launch_queue(status);
create index idx_queue_scheduled on public.launch_queue(scheduled_at);
create index idx_queue_priority on public.launch_queue(priority, scheduled_at);


-- ============================================================
-- 7. PLATFORM SEED DATA — Tier 1 (19 Platform)
-- ============================================================

insert into public.platforms (
  name, website, submit_url, category, tier, automation_type,
  automation_difficulty, login_required, captcha_risk,
  domain_rating, monthly_traffic, seo_value, traffic_value,
  is_active, submission_notes
) values

-- TIER 1
('Product Hunt',    'producthunt.com',    'producthunt.com/posts/new',          'launch',   1, 'guided',   null,   true,  true,  93, 4200000, 10, 10,
 true, 'Community rules require manual submission. We provide: tagline, description, maker comment, and tag suggestions. You submit — takes 5 minutes.'),

('Uneed',           'uneed.best',         'uneed.best/submit',                  'launch',   1, 'auto',     'easy', false, false, 48, 180000,  8,  8,
 true, null),

('DevHunt',         'devhunt.org',        'devhunt.org/submit',                 'launch',   1, 'auto',     'easy', true,  false, 42, 95000,   7,  7,
 true, null),

('BetaList',        'betalist.com',       'betalist.com/submit',                'launch',   1, 'auto',     'medium', false, false, 58, 220000, 8, 7,
 true, null),

('Microlaunch',     'microlaunch.net',    'microlaunch.net/submit',             'launch',   1, 'auto',     'easy', false, false, 38, 65000,   6,  6,
 true, null),

('Fazier',          'fazier.com',         'fazier.com/submit',                  'launch',   1, 'auto',     'easy', false, true,  32, 45000,   5,  5,
 true, null),

('Peerlist',        'peerlist.io',        'peerlist.io/tools/submit',           'launch',   1, 'assisted', 'medium', true, false, 52, 140000, 7, 6,
 true, 'Login required. Bot fills form, you click submit.'),

('TinyLaunch',      'tinylaunch.co',      'tinylaunch.co/submit',               'launch',   1, 'auto',     'easy', false, false, 22, 18000,   3,  3,
 true, null),

('LaunchIgniter',   'launchigniter.com',  'launchigniter.com/submit',           'launch',   1, 'auto',     'easy', false, false, 25, 22000,   3,  3,
 true, null),

('Indie Hackers',   'indiehackers.com',   'indiehackers.com/products',          'community', 1, 'guided',  null,   true,  false, 78, 1800000, 9, 8,
 true, 'Community rules: no promotional submissions. We write your product story in their format. You post — takes 3 minutes.'),

('Hacker News',     'news.ycombinator.com', 'news.ycombinator.com/submit',      'community', 1, 'guided',  null,   true,  false, 91, 8200000, 10, 10,
 true, 'Show HN requires genuine product and founder. We write your Show HN post. You submit — takes 2 minutes.'),

('SideProjectors',  'sideprojectors.com', 'sideprojectors.com/submit',          'launch',   1, 'auto',     'easy', false, false, 42, 75000,   6,  5,
 true, null),

('PitchWall',       'pitchwall.co',       'pitchwall.co/submit',                'launch',   1, 'auto',     'easy', false, false, 28, 28000,   4,  3,
 true, null),

('StartupBase',     'startupbase.io',     'startupbase.io/submit',              'launch',   1, 'auto',     'easy', false, false, 32, 35000,   4,  4,
 true, null),

('LaunchingNext',   'launchingnext.com',  'launchingnext.com/submit',           'launch',   1, 'auto',     'easy', false, false, 30, 25000,   4,  3,
 true, null),

('Firsto',          'firsto.xyz',         'firsto.xyz/submit',                  'launch',   1, 'auto',     'easy', false, false, 18, 12000,   2,  2,
 true, null),

('StartupBuffer',   'startupbuffer.com',  'startupbuffer.com/site/submit',      'launch',   1, 'auto',     'easy', false, false, 35, 40000,   5,  4,
 true, null),

('FoundrList',      'foundrlist.com',     'foundrlist.com/submit',              'launch',   1, 'auto',     'easy', false, false, 20, 10000,   2,  2,
 true, null),

('TrendyStartups',  'trendystartups.co',  'trendystartups.co/submit',           'launch',   1, 'auto',     'easy', false, false, 18, 8000,    2,  2,
 true, null),

-- TIER 2 — AI Directories
('There''s an AI for That', 'theresanaiforthat.com', 'theresanaiforthat.com/submit', 'ai_directory', 2, 'auto', 'easy', false, false, 72, 2800000, 9, 8, true, null),

('Futurepedia',     'futurepedia.io',     'futurepedia.io/submit-tool',         'ai_directory', 2, 'auto', 'easy', false, false, 68, 1900000, 9, 8, true, null),

('AI Scout',        'aiscout.net',        'aiscout.net/submit-tool',            'ai_directory', 2, 'auto', 'easy', false, false, 45, 280000,  6,  5, true, null),

('Toolify',         'toolify.ai',         'toolify.ai/submit',                  'ai_directory', 2, 'auto', 'medium', false, false, 52, 620000, 7, 6, true, null),

('AI Valley',       'aivalley.ai',        'aivalley.ai/submit',                 'ai_directory', 2, 'auto', 'easy', false, false, 38, 180000,  5,  4, true, null),

('FutureTools',     'futuretools.io',     'futuretools.io/submit',              'ai_directory', 2, 'assisted', 'medium', true, false, 55, 480000, 7, 6, true, 'Login required. Bot fills, you submit.'),

('AI Tool Hunt',    'aitoolhunt.com',     'aitoolhunt.com/submit',              'ai_directory', 2, 'auto', 'easy', false, false, 32, 95000,   4,  4, true, null),

('ShowMeBestAI',    'showmebest.ai',      'showmebest.ai/submit',               'ai_directory', 2, 'auto', 'easy', false, false, 28, 45000,   4,  3, true, null),

('TopAI.tools',     'topai.tools',        'topai.tools/submit',                 'ai_directory', 2, 'auto', 'easy', false, false, 42, 220000,  6,  5, true, null),

('ListMyAI',        'listmyai.net',       'listmyai.net/submit',                'ai_directory', 2, 'auto', 'easy', false, false, 40, 195000,  6,  5, true, null),

-- TIER 2 — SaaS Directories
('SaaSHub',         'saashub.com',        'saashub.com/submit',                 'saas_directory', 2, 'auto', 'medium', false, false, 78, 3200000, 9, 7, true, null),

('AlternativeTo',   'alternativeto.net',  'alternativeto.net/software/new',     'saas_directory', 2, 'guided', null, true, false, 80, 5800000, 10, 8,
 true, 'Account required. We write your product listing. You submit — takes 3 minutes.'),

('G2',              'g2.com',             'g2.com/products/new',                'review',   2, 'guided', null, true, false, 91, 12000000, 10, 9,
 true, 'Vendor registration required. We prepare all product info. You register and submit — takes 10 minutes. High DR, worth it.'),

('Capterra',        'capterra.com',       'capterra.com/vendors/sign-up',       'review',   2, 'guided', null, true, false, 90, 9500000,  10, 9,
 true, 'Vendor signup required. We prepare listing. You submit — takes 10 minutes.'),

('OpenAlternative',  'openalternative.co', 'openalternative.co/submit',         'saas_directory', 2, 'auto', 'easy', false, false, 48, 320000, 6, 5, true, null),

('LibHunt',         'libhunt.com',        'libhunt.com/submit',                 'saas_directory', 2, 'auto', 'easy', false, false, 55, 480000,  7,  5, true, null),

('Toolfolio',       'toolfolio.io',       'toolfolio.io/submit',                'saas_directory', 2, 'auto', 'easy', false, false, 35, 85000,   5,  4, true, null),

('SourceForge',     'sourceforge.net',    'sourceforge.net/register',           'saas_directory', 2, 'guided', null, true, false, 88, 18000000, 10, 7,
 true, 'Account required. Very high DR. We write listing. You submit — takes 5 minutes.'),

('Slant',           'slant.co',           'slant.co/topics/new',                'saas_directory', 2, 'assisted', 'medium', true, false, 65, 620000, 7, 5, true, null),

('TrustMRR',        'trustmrr.com',       'trustmrr.com/submit',                'saas_directory', 2, 'auto', 'easy', false, false, 28, 35000,   3,  3, true, null),

('Startup Stash',   'startupstash.com',   'startupstash.com/add-resource',      'saas_directory', 2, 'auto', 'easy', false, false, 55, 280000,  6,  5, true, null),

-- TIER 3 — Reddit (guided)
('r/sideproject',   'reddit.com/r/sideproject', 'reddit.com/r/sideproject/submit', 'community', 3, 'guided', null, true, false, 91, 45000, 8, 9,
 true, 'Reddit community rules apply. We write your post in the exact format r/sideproject loves. You post — takes 2 minutes.'),

('r/saas',          'reddit.com/r/saas',  'reddit.com/r/saas/submit',           'community', 3, 'guided', null, true, false, 91, 28000, 7, 8,
 true, 'Problem-solution post format. We write it. You post.'),

('r/startups',      'reddit.com/r/startups', 'reddit.com/r/startups/submit',    'community', 3, 'guided', null, true, false, 91, 82000, 7, 7,
 true, 'Founder story format. We write it. You post.'),

('r/imadethis',     'reddit.com/r/imadethis', 'reddit.com/r/imadethis/submit',  'community', 3, 'guided', null, true, false, 91, 15000, 6, 7,
 true, 'Showcase format. We write it. You post.'),

('r/buildinpublic', 'reddit.com/r/buildinpublic', 'reddit.com/r/buildinpublic/submit', 'community', 3, 'guided', null, true, false, 91, 12000, 6, 6,
 true, 'Progress update format. We write it. You post.'),

('Dev.to',          'dev.to',             'dev.to/new',                         'community', 3, 'guided', null, true, false, 78, 2800000, 8, 7,
 true, 'We write your launch blog post. You publish — takes 3 minutes.'),

-- TIER 3 — Deal Platforms (guided)
('AppSumo',         'appsumo.com',        'appsumo.com/sell',                   'deal', 3, 'guided', null, true, false, 84, 4200000, 9, 9,
 true, 'AppSumo vendor application. We prepare your pitch deck and product info. You apply — takes 15 minutes. High revenue potential.'),

('Dealify',         'dealify.com',        'dealify.com/submit',                 'deal', 3, 'guided', null, true, false, 42, 280000,  5,  6, true,
 'Deal listing application. We prepare listing. You submit.'),

('SaaS Mantra',     'saasmantra.com',     'saasmantra.com/submit',              'deal', 3, 'guided', null, true, false, 38, 180000,  5,  5, true,
 'Deal listing. We prepare content. You submit.'),

('LTD Hunt',        'ltdhunt.com',        'ltdhunt.com/submit',                 'deal', 3, 'guided', null, false, false, 28, 45000,   3,  4, true, null),

-- TIER 3 — Niche AI (auto)
('AI Cyclopedia',   'aicyclopedia.com',   'aicyclopedia.com/submit',            'ai_directory', 3, 'auto', 'easy', false, false, 22, 18000, 3, 2, true, null),
('AI Stage',        'aistage.net',        'aistage.net/submit',                 'ai_directory', 3, 'auto', 'easy', false, false, 20, 15000, 2, 2, true, null),
('AI Tools Hub',    'aitoolshub.net',     'aitoolshub.net/submit',              'ai_directory', 3, 'auto', 'easy', false, false, 18, 12000, 2, 2, true, null),
('Deeplaunch',      'deeplaunch.io',      'deeplaunch.io/submit',               'ai_directory', 3, 'auto', 'easy', false, false, 15, 8000,  2, 2, true, null),
('EliteAI Tools',   'eliteai.tools',      'eliteai.tools/submit',               'ai_directory', 3, 'auto', 'easy', false, false, 22, 25000, 3, 2, true, null),
('ListMyAI',        'listmyai.net',       'listmyai.net/submit',                'ai_directory', 3, 'auto', 'easy', false, false, 40, 195000, 5, 4, true, null),

-- TIER 3 — Discovery (auto)
('BetaPage',        'betapage.co',        'betapage.co/submit',                 'launch', 3, 'auto', 'easy', false, false, 35, 85000,  4, 4, true, null),
('KillerStartups',  'killerstartups.com', 'killerstartups.com/submit-startup',  'launch', 3, 'auto', 'easy', false, false, 42, 125000, 5, 4, true, null),
('StartupBlink',    'startupblink.com',   'startupblink.com/add-startup',       'launch', 3, 'auto', 'easy', false, false, 48, 280000, 5, 4, true, null),
('Softonic',        'softonic.com',       'softonic.com/submit',                'saas_directory', 3, 'auto', 'medium', false, false, 72, 8500000, 7, 5, true, null),
('Manta',           'manta.com',          'manta.com/add-business',             'saas_directory', 3, 'auto', 'easy', false, false, 62, 1200000, 6, 4, true, null),
('Vibe Coding Works', 'vibe-coding.works', 'vibe-coding.works/submit',          'launch', 3, 'auto', 'easy', false, false, 18, 8000,  3, 4, true, 'Vibecoder community — perfect fit for our users.'),
('Submit Checklist', 'submitchecklist.com', 'submitchecklist.com',              'launch', 3, 'auto', 'easy', false, false, 20, 15000, 2, 3, true, null);


-- ============================================================
-- 8. HELPER FUNCTIONS
-- ============================================================

-- Bir launch için kaç platform submit edileceğini hesapla
create or replace function get_platforms_for_package(package_slug text)
returns table(platform_id uuid, name text, tier integer, automation_type text, priority integer)
language sql stable as $$
  select
    p.id,
    p.name,
    p.tier,
    p.automation_type,
    case p.tier
      when 1 then 10
      when 2 then 50
      when 3 then 100
    end as priority
  from public.platforms p
  join public.packages pkg on pkg.slug = package_slug
  where p.is_active = true
    and p.tier <= pkg.max_tier
  order by
    p.tier asc,
    p.traffic_value desc,
    p.seo_value desc;
$$;

-- Bir launch başlatıldığında submissions ve queue oluştur
create or replace function create_launch_submissions(
  p_project_id uuid,
  p_package_slug text
) returns integer
language plpgsql as $$
declare
  v_platform record;
  v_submission_id uuid;
  v_count integer := 0;
  v_delay_minutes integer;
begin
  for v_platform in
    select * from get_platforms_for_package(p_package_slug)
  loop
    -- Gecikme hesapla (SEO için doğal dağılım)
    v_delay_minutes := case v_platform.tier
      when 1 then v_count * 15          -- Tier 1: 15 dk aralık
      when 2 then 1440 + v_count * 30   -- Tier 2: 1 gün sonra, 30 dk aralık
      when 3 then 2880 + v_count * 60   -- Tier 3: 2 gün sonra, 1 saat aralık
    end;

    -- Submission oluştur
    insert into public.submissions (
      project_id, platform_id, status, submission_type
    ) values (
      p_project_id,
      v_platform.platform_id,
      case v_platform.automation_type
        when 'guided' then 'manual_pending'
        else 'queued'
      end,
      v_platform.automation_type
    ) returning id into v_submission_id;

    -- Queue'ya ekle (sadece auto/assisted için)
    if v_platform.automation_type != 'guided' then
      insert into public.launch_queue (
        project_id, submission_id, platform_id,
        priority, scheduled_at
      ) values (
        p_project_id,
        v_submission_id,
        v_platform.platform_id,
        v_platform.priority,
        now() + (v_delay_minutes || ' minutes')::interval
      );
    end if;

    v_count := v_count + 1;
  end loop;

  -- Project status güncelle
  update public.projects
  set status = 'launching'
  where id = p_project_id;

  return v_count;
end;
$$;

-- Platform başarı oranını güncelle (cron ile çalışır)
create or replace function update_platform_success_rates()
returns void
language sql as $$
  update public.platforms p
  set
    success_rate = (
      select
        round(
          (count(*) filter (where s.status = 'approved') * 100.0) /
          nullif(count(*) filter (where s.status in ('approved','rejected','failed')), 0),
          2
        )
      from public.submissions s
      where s.platform_id = p.id
        and s.created_at > now() - interval '30 days'
    ),
    updated_at = now();
$$;


-- ============================================================
-- 9. REALTIME — Dashboard için live updates
-- ============================================================

-- submissions tablosunda realtime aktif et
alter publication supabase_realtime add table public.submissions;
alter publication supabase_realtime add table public.launch_queue;


-- ============================================================
-- 10. VIEWS — Dashboard için hazır sorgular
-- ============================================================

-- Proje bazlı submission özeti
create or replace view public.project_submission_summary as
select
  s.project_id,
  count(*) as total,
  count(*) filter (where s.status = 'approved') as approved,
  count(*) filter (where s.status = 'pending') as pending,
  count(*) filter (where s.status = 'queued') as queued,
  count(*) filter (where s.status = 'failed') as failed,
  count(*) filter (where s.status = 'manual_pending') as manual_pending,
  sum(p.domain_rating) filter (where s.status = 'approved') as total_dr,
  round(
    count(*) filter (where s.status = 'approved') * 100.0 /
    nullif(count(*) filter (where s.status in ('approved','rejected','failed')), 0),
    1
  ) as approval_rate
from public.submissions s
join public.platforms p on s.platform_id = p.id
group by s.project_id;

-- Tier bazlı platform sayıları
create or replace view public.platform_tier_counts as
select
  tier,
  count(*) as total,
  count(*) filter (where automation_type = 'auto') as auto_count,
  count(*) filter (where automation_type = 'assisted') as assisted_count,
  count(*) filter (where automation_type = 'guided') as guided_count,
  count(*) filter (where is_active = true) as active_count
from public.platforms
group by tier
order by tier;
