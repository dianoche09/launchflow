# LaunchFlow — IDE Build Prompts
> Cursor, Windsurf veya GitHub Copilot'a sırayla yapıştır.

---

## ⚠️ Önce Bunu Oku

Bu dosya 6 aşamalı bir build planı içeriyor.
Her aşamayı **sırayla** yap. Bir aşama bitmeden diğerine geçme.

**Stack:**
- Frontend: Next.js 14 (App Router) + Tailwind + Shadcn UI
- Backend: Supabase (auth + database + storage)
- Queue: Upstash Redis + BullMQ
- Automation: Playwright (Node.js worker)
- AI: OpenAI API
- Deploy: Vercel (frontend) + Railway (worker)

**Tahmini maliyet:** $0–30/ay (free tier)

---

## AŞAMA 1 — Proje Kurulumu

### Cursor'a yapıştır:

```
Create a new Next.js 14 project called "launchflow" with the following setup:

1. Initialize with App Router, TypeScript, Tailwind CSS
2. Install and configure Shadcn UI (use "new-york" style, zinc base color)
3. Install dependencies:
   - @supabase/supabase-js
   - @supabase/auth-helpers-nextjs
   - openai
   - bullmq
   - ioredis
   - playwright
   - @ioredis/client
   - zod
   - react-hook-form
   - @hookform/resolvers
   - lucide-react
   - next-themes

4. Create .env.local with these variables (empty values):
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   OPENAI_API_KEY=
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=

5. Create folder structure:
   /app
     /dashboard
     /launch
     /analytics
     /api
       /projects
       /launch
       /submissions
   /components
     /ui
     /dashboard
     /forms
   /lib
     /supabase
     /openai
     /queue
     /bots
   /types
```

---

## AŞAMA 2 — Supabase Database Şeması

### Supabase SQL Editor'a yapıştır:

```sql
-- Users tablosu (Supabase auth ile otomatik gelir, extend ediyoruz)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan text default 'free' check (plan in ('free', 'indie', 'pro', 'agency')),
  submission_count integer default 0,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Projects tablosu
create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  website text not null,
  tagline text,
  description text,
  category text,
  pricing_model text,
  logo_url text,
  screenshots text[],
  founder_name text,
  twitter text,
  email text,
  status text default 'draft' check (status in ('draft', 'launching', 'launched')),
  created_at timestamp with time zone default timezone('utc', now())
);

-- Launch content (AI tarafından üretilen içerikler)
create table public.launch_content (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  tagline text,
  short_pitch text,
  long_pitch text,
  tags text[],
  product_hunt_description text,
  reddit_post text,
  hn_post text,
  twitter_thread text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Platforms tablosu
create table public.platforms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  website text,
  submit_url text,
  category text check (category in ('launch', 'ai_directory', 'saas_directory', 'review', 'community', 'deal')),
  automation_type text check (automation_type in ('api', 'form', 'email', 'manual')),
  automation_difficulty text check (automation_difficulty in ('easy', 'medium', 'hard', 'manual')),
  login_required boolean default false,
  priority text check (priority in ('tier_1', 'tier_2', 'tier_3')),
  is_active boolean default true,
  seo_value integer default 5,
  notes text
);

-- Submissions tablosu
create table public.submissions (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  platform_id uuid references public.platforms(id),
  status text default 'pending' check (status in ('pending', 'queued', 'submitted', 'approved', 'rejected', 'failed')),
  submitted_at timestamp with time zone,
  result_url text,
  error_message text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- RLS (Row Level Security) aktif et
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.launch_content enable row level security;
alter table public.submissions enable row level security;

-- RLS politikaları
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own projects" on public.projects for select using (auth.uid() = user_id);
create policy "Users can create own projects" on public.projects for insert with check (auth.uid() = user_id);
create policy "Users can update own projects" on public.projects for update using (auth.uid() = user_id);
create policy "Users can delete own projects" on public.projects for delete using (auth.uid() = user_id);

create policy "Users can view own submissions" on public.submissions for select using (
  project_id in (select id from public.projects where user_id = auth.uid())
);

-- Platforms herkese açık (okuma)
alter table public.platforms enable row level security;
create policy "Platforms are public" on public.platforms for select using (true);
```

---

## AŞAMA 3 — Platform Seed Verisi

### Supabase SQL Editor'a yapıştır (şema kurulduktan sonra):

```sql
insert into public.platforms (name, website, submit_url, category, automation_type, automation_difficulty, login_required, priority, seo_value) values
-- Tier 1 Launch Platforms
('Product Hunt', 'https://producthunt.com', 'https://producthunt.com/posts/new', 'launch', 'manual', 'manual', true, 'tier_1', 10),
('BetaList', 'https://betalist.com', 'https://betalist.com/submit', 'launch', 'form', 'medium', false, 'tier_1', 9),
('Uneed', 'https://uneed.best', 'https://uneed.best/submit', 'launch', 'form', 'easy', false, 'tier_1', 8),
('Fazier', 'https://fazier.com', 'https://fazier.com/submit', 'launch', 'form', 'easy', false, 'tier_1', 8),
('Microlaunch', 'https://microlaunch.net', 'https://microlaunch.net/submit', 'launch', 'form', 'easy', false, 'tier_1', 8),
('DevHunt', 'https://devhunt.org', 'https://devhunt.org/submit', 'launch', 'form', 'medium', true, 'tier_1', 8),
('Peerlist', 'https://peerlist.io', 'https://peerlist.io', 'launch', 'manual', 'manual', true, 'tier_1', 7),
('Indie Hackers', 'https://indiehackers.com', 'https://indiehackers.com', 'community', 'manual', 'manual', true, 'tier_1', 9),
('Hacker News', 'https://news.ycombinator.com', 'https://news.ycombinator.com/submit', 'community', 'manual', 'manual', true, 'tier_1', 10),
('SideProjectors', 'https://sideprojectors.com', 'https://sideprojectors.com/submit', 'launch', 'form', 'medium', false, 'tier_2', 6),
-- AI Directories
('There''s an AI for That', 'https://theresanaiforthat.com', 'https://theresanaiforthat.com/submit/', 'ai_directory', 'form', 'easy', false, 'tier_1', 9),
('Futurepedia', 'https://futurepedia.io', 'https://futurepedia.io/submit-tool', 'ai_directory', 'form', 'easy', false, 'tier_1', 9),
('AI Scout', 'https://aiscout.net', 'https://aiscout.net/submit-tool', 'ai_directory', 'form', 'easy', false, 'tier_2', 6),
('AI Valley', 'https://aivalley.ai', 'https://aivalley.ai/submit', 'ai_directory', 'form', 'easy', false, 'tier_2', 5),
('AI Tool Hunt', 'https://aitoolhunt.com', 'https://aitoolhunt.com/submit', 'ai_directory', 'form', 'easy', false, 'tier_2', 5),
-- SaaS Directories
('SaaSHub', 'https://saashub.com', 'https://www.saashub.com/submit', 'saas_directory', 'form', 'medium', false, 'tier_1', 8),
('AlternativeTo', 'https://alternativeto.net', 'https://alternativeto.net/software/new/', 'saas_directory', 'manual', 'manual', true, 'tier_1', 9),
('StartupBase', 'https://startupbase.io', 'https://startupbase.io/submit', 'saas_directory', 'form', 'easy', false, 'tier_2', 6),
('PitchWall', 'https://pitchwall.co', 'https://pitchwall.co/submit', 'saas_directory', 'form', 'easy', false, 'tier_2', 5),
('StartupBuffer', 'https://startupbuffer.com', 'https://startupbuffer.com/site/submit', 'saas_directory', 'form', 'easy', false, 'tier_2', 5),
('LaunchingNext', 'https://launchingnext.com', 'https://launchingnext.com/submit', 'saas_directory', 'form', 'easy', false, 'tier_2', 5),
('FoundrList', 'https://foundrlist.com', 'https://foundrlist.com', 'saas_directory', 'form', 'easy', false, 'tier_2', 4),
('ToolFame', 'https://toolfame.com', 'https://toolfame.com/submit', 'saas_directory', 'form', 'easy', false, 'tier_3', 4),
('Firsto', 'https://firsto.xyz', 'https://firsto.xyz/submit', 'saas_directory', 'form', 'easy', false, 'tier_3', 4),
('TinyLaunch', 'https://tinylaunch.co', 'https://tinylaunch.co', 'saas_directory', 'form', 'easy', false, 'tier_3', 3),
('Stacker News', 'https://stacker.news', 'https://stacker.news', 'community', 'manual', 'manual', true, 'tier_2', 5),
('ShowMeBestAI', 'https://showmebest.ai', 'https://showmebest.ai', 'ai_directory', 'form', 'easy', false, 'tier_3', 4),
('Trendy Startups', 'https://trendystartups.co', 'https://trendystartups.co', 'saas_directory', 'form', 'easy', false, 'tier_3', 3),
('Slocco', 'https://slocco.com', 'https://slocco.com', 'saas_directory', 'form', 'easy', false, 'tier_3', 3),
('Indie Deals', 'https://indiedeals.io', 'https://indiedeals.io', 'deal', 'manual', 'manual', true, 'tier_3', 3),
-- Review Platforms
('G2', 'https://g2.com', 'https://www.g2.com/products/new', 'review', 'manual', 'manual', true, 'tier_1', 10),
('Capterra', 'https://capterra.com', 'https://www.capterra.com/vendors/sign-up/', 'review', 'manual', 'manual', true, 'tier_1', 9),
('GetApp', 'https://getapp.com', 'https://www.getapp.com/vendors/signup', 'review', 'manual', 'manual', true, 'tier_2', 8),
-- Deal Platforms
('AppSumo', 'https://appsumo.com', 'https://appsumo.com/sell/', 'deal', 'manual', 'manual', true, 'tier_1', 9),
('Dealify', 'https://dealify.com', 'https://dealify.com', 'deal', 'manual', 'manual', true, 'tier_2', 6),
('SaaS Mantra', 'https://saasmantra.com', 'https://saasmantra.com', 'deal', 'manual', 'manual', true, 'tier_2', 6),
('LTD Hunt', 'https://ltdhunt.com', 'https://ltdhunt.com', 'deal', 'manual', 'manual', true, 'tier_2', 5),
('SaaSZilla', 'https://saaszilla.co', 'https://saaszilla.co', 'deal', 'manual', 'manual', true, 'tier_2', 5);
```

---

## AŞAMA 4 — Core Uygulama Kodu

### Cursor'a yapıştır:

```
Build the LaunchFlow SaaS application. Here are the exact files and their purpose:

=== FILE: lib/supabase/client.ts ===
Create Supabase browser client using @supabase/supabase-js.
Use createClientComponentClient from @supabase/auth-helpers-nextjs.

=== FILE: lib/supabase/server.ts ===
Create Supabase server client.
Use createServerComponentClient from @supabase/auth-helpers-nextjs.

=== FILE: types/index.ts ===
Create TypeScript types matching the Supabase schema:
- Project
- Platform
- Submission
- LaunchContent
- Profile
- PlanType ('free' | 'indie' | 'pro' | 'agency')
- SubmissionStatus ('pending' | 'queued' | 'submitted' | 'approved' | 'rejected' | 'failed')
- AutomationType ('api' | 'form' | 'email' | 'manual')
- PlatformCategory ('launch' | 'ai_directory' | 'saas_directory' | 'review' | 'community' | 'deal')

=== FILE: lib/openai/generate-launch-content.ts ===
Create a function generateLaunchContent(project: Project) that calls OpenAI API.
System prompt: "You are a startup launch copywriter. Generate concise, compelling launch content."
User prompt: Include project name, website, tagline, description, category.
Return JSON with: tagline, short_pitch, long_pitch, tags (array), product_hunt_description, reddit_post, hn_post, twitter_thread.
Use GPT-4o-mini model.
Parse and validate response with Zod.

=== FILE: app/api/projects/route.ts ===
GET: Return current user's projects from Supabase.
POST: Create new project. Validate with Zod. Associate with auth user.

=== FILE: app/api/projects/[id]/launch/route.ts ===
POST: 
1. Get project by ID
2. Generate launch content via OpenAI
3. Save launch_content to Supabase
4. Get all active platforms ordered by priority
5. Create submission records (status: 'queued') for each platform
6. Add jobs to BullMQ queue
7. Return { success: true, submissions_count }

=== FILE: app/api/submissions/[projectId]/route.ts ===
GET: Return all submissions for a project with platform details joined.

=== FILE: app/dashboard/page.tsx ===
Server component. 
Show:
- Welcome message with user email
- Stats cards: Total Projects, Total Submissions, Approved Submissions, Pending Submissions
- Recent projects list with status badge
- "Create Project" button linking to /dashboard/new

=== FILE: app/dashboard/new/page.tsx ===
Client component with form to create new project.
Fields: name, website, tagline, description, category (dropdown), pricing_model (dropdown: free/freemium/paid/one-time), founder_name, twitter, email.
Use react-hook-form + Zod validation.
On submit: POST to /api/projects, redirect to /dashboard.

=== FILE: app/dashboard/[id]/page.tsx ===
Project detail page showing:
- Project info
- Launch Content (if generated) - show tagline, short pitch, tags
- "Generate Launch Kit" button (calls AI)
- "Launch Now" button (starts submission queue)
- Submissions table with: platform name, category, status badge, submitted date

=== FILE: components/dashboard/submission-status-badge.tsx ===
Component that renders a colored badge based on SubmissionStatus.
pending = gray, queued = blue, submitted = yellow, approved = green, rejected = red, failed = red

=== FILE: app/(auth)/login/page.tsx ===
Simple login page with Supabase auth (email/password + magic link option).
Redirect to /dashboard after login.

=== FILE: app/page.tsx (Landing page) ===
Hero section with:
  - Headline: "Launch your startup to 80+ platforms automatically"
  - Subheadline: "Stop filling launch forms. Ship everywhere with one click."
  - CTA button: "Start Launching Free" -> /login
  
Problem/Solution section.
Features section (3 cards): AI Launch Kit, Automated Submission, Launch Analytics.
Platform logos grid (show 12 platform names).
Pricing section (Free/Indie $19/Pro $49/Agency $149).
Footer.
Use Tailwind for styling. Dark/light mode support.
```

---

## AŞAMA 5 — Automation Worker

### Cursor'a yapıştır (ayrı terminal / Railway'e deploy edilecek):

```
Create a standalone Node.js worker service in /worker folder:

=== FILE: worker/index.ts ===
- Connect to Upstash Redis
- Create BullMQ Worker listening to "launch-queue"
- Process jobs: { projectId, submissionId, platformId, project, platform }
- Call the correct bot based on platform automation_type
- Update submission status in Supabase (use service role key)
- Log results

=== FILE: worker/bots/base-bot.ts ===
Abstract base class for all bots:
- launch(project, platform): Promise<{ success: boolean, url?: string, error?: string }>

=== FILE: worker/bots/form-bot.ts ===
Extends BasBot.
Uses Playwright chromium.
Generic form filler that:
1. Opens submit_url
2. Tries to find and fill common fields:
   - input[name*='name'], input[name*='title'] -> project.name
   - input[name*='url'], input[name*='website'] -> project.website
   - textarea[name*='description'], textarea[name*='about'] -> project.description
   - input[name*='email'] -> project.email
   - input[name*='twitter'] -> project.twitter
3. Takes screenshot before submit
4. Clicks submit button
5. Returns success/failure

=== FILE: worker/bots/microlaunch-bot.ts ===
Specific bot for Microlaunch.
URL: https://microlaunch.net/submit
Selectors:
  name: input[placeholder*='name' i] or input[name='name']
  url: input[placeholder*='url' i] or input[name='url']  
  description: textarea
  submit: button[type='submit']

=== FILE: worker/bots/betalist-bot.ts ===
Specific bot for BetaList.
URL: https://betalist.com/submit
Fill name, website, tagline fields.

=== FILE: worker/Dockerfile ===
FROM node:20-slim
RUN npx playwright install-deps chromium
COPY . .
RUN npm install
RUN npx playwright install chromium
CMD ["npx", "ts-node", "index.ts"]

=== FILE: worker/package.json ===
Dependencies: playwright, bullmq, ioredis, @supabase/supabase-js, typescript, ts-node
```

---

## AŞAMA 6 — Deploy & Env Setup

### Cursor'a (veya kendine hatırlatma olarak) yapıştır:

```
Create deployment configuration:

=== FILE: vercel.json ===
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "framework": "nextjs"
}

=== FILE: .env.example ===
# Supabase - get from supabase.com/dashboard
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI - get from platform.openai.com
OPENAI_API_KEY=sk-...

# Upstash Redis - get from upstash.com
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# Worker only (Railway env vars)
DATABASE_URL=postgresql://...

=== FILE: README.md ===
Write a complete setup guide:
1. Clone repo
2. Install dependencies
3. Set up Supabase project + run SQL schema
4. Set up Upstash Redis (free tier)
5. Add env vars
6. Run locally: npm run dev
7. Deploy frontend to Vercel
8. Deploy worker to Railway (use Dockerfile)
```

---

## Sıradaki Adımlar (MVP Sonrası)

1. **Manual submission helper** — Bot çalışamayan platformlar (Product Hunt, G2) için kullanıcıya adım adım rehber göster
2. **Screenshot generator** — Puppeteer ile otomatik mockup
3. **Analytics** — Supabase'den backlink/trafik takibi
4. **Reddit integration** — Reddit API ile r/sideproject otomatik post
5. **Stripe entegrasyonu** — Plan upgrade için

---

## Ücretsiz Servis Linkleri

| Servis | Link | Ne İçin |
|--------|------|---------|
| Supabase | https://supabase.com | Database + Auth + Storage |
| Upstash | https://upstash.com | Redis queue (free: 10k/gün) |
| Vercel | https://vercel.com | Frontend deploy |
| Railway | https://railway.app | Worker deploy ($5 free credit) |
| OpenAI | https://platform.openai.com | AI content (pay-as-you-go) |
| GitHub | https://github.com | Repo + CI/CD |

**Toplam tahmini aylık maliyet (MVP): ~$5–15**

---

*LaunchFlow — Build Once. Launch Everywhere.*
