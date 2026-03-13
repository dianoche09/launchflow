# LaunchFlow - Startup Distribution Engine
**Build Once → Launch Everywhere**

LaunchFlow is a startup distribution automation platform that submits a product to 100+ launch platforms, directories, and communities automatically.

This blueprint contains:
*   Product vision and features
*   Technical architecture and database design
*   Master Platform Database & Automation blueprint
*   UI/UX architecture and MVP roadmap
*   $1M ARR growth strategy
*   24-hour build plan using IDE (Cursor / Windsurf)

---

## Part 1: Complete SaaS Blueprint (Product • Tech • Growth • Automation)

### 1. Product Vision
**The Problem**
Every time a startup launches, founders must submit their product to dozens of places. Examples: Product directories, AI tool directories, Startup launch platforms, SaaS review platforms, Communities.
Each one requires: account creation, filling forms, writing descriptions, uploading images. Total effort: 30–100 manual submissions.
Most founders skip this. Result: low visibility, weak SEO, slow user growth.

**The Solution**
LaunchFlow solves the startup distribution problem.
User flow: `Create Project → AI generates launch content → Click Launch → LaunchFlow submits to 100+ platforms → User tracks backlinks + traffic`

### 2. Core Product Features
**3.1 Project Creation**
Users create a project once. Fields:
`project_name, website_url, tagline, description, category, pricing_model, logo, screenshots, founder_name, twitter, email`

**3.2 AI Launch Kit Generator**
AI automatically generates launch content. Generated assets:
`tagline, short description, long description, feature list, hashtags, Product Hunt description, Reddit launch post, Hacker News post, Twitter launch thread`

**3.3 Automated Directory Submission**
LaunchFlow submits automatically using:
`API submissions, Form automation, Email submissions, Manual queues`

**3.4 Launch Queue System**
Submissions are spread across time. Example:
*   Day 1 → Product Hunt
*   Day 2 → BetaList
*   Day 3 → Microlaunch
*   Day 4 → AI directories
*   Day 5 → SaaS directories
*   Day 6 → communities

Benefits: natural backlinks, SEO indexing, steady traffic.

**3.5 Analytics Dashboard**
Users see: `submitted platforms, approved listings, pending reviews, generated backlinks, traffic sources`

### 3. System Architecture & Infrastructure (Low Cost)
Recommended stack:
*   **Frontend:** Next.js, Tailwind, Shadcn UI, Framer Motion
*   **Backend:** Supabase, PostgreSQL, Edge Functions
*   **Automation:** Node.js, Playwright
*   **Queue:** Redis, BullMQ
*   **AI:** OpenAI API
*   **Hosting:** Vercel

LaunchFlow can run almost entirely on free tiers.
*   **Frontend:** Vercel
*   **Backend & Storage:** Supabase
*   **Queue:** Upstash Redis
*   **Workers:** Railway
*   **Monitoring:** BetterStack
*   **CI/CD:** GitHub Actions

*Estimated monthly cost early stage: $10–30*

### 4. Pricing Model
*   **Free:** 5 submissions
*   **Indie:** $19/month (30 submissions)
*   **Pro:** $49/month (100 submissions, AI launch kit)
*   **Agency:** $149/month (unlimited launches, team access)

### 5. Product Hunt Launch Strategy
**Tagline:** Submit your startup to 100+ directories automatically
**Launch message:**
> "Launching startups is painful. Every time I built a project I had to submit it to: Product Hunt, BetaList, Microlaunch, AI directories, startup directories. So I built LaunchFlow. Add your startup once and LaunchFlow submits it everywhere."

**Traffic sources:** Twitter, Reddit, Indie Hackers, Builder communities.

---

## Part 2: Master Platform Database & Automation Blueprint

### 1. Platform Database Structure
Each platform in LaunchFlow should follow this schema.
`id, name, website, submit_url, category, automation_type, automation_difficulty, login_required, priority, seo_value, traffic_score, notes`

*   **Automation Types:** `api`, `form`, `email`, `manual`
*   **Automation Difficulty:** `easy`, `medium`, `hard`, `manual`
*   **Platform Priority:** `tier_1` (massive traffic), `tier_2` (medium traffic), `tier_3` (SEO backlinks)

### 2. Launch Platform Database (Core List)

**Tier 1 Launch Platforms**
| Platform | Submit URL | Category | Automation | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **Product Hunt** | producthunt.com/posts/new | launch | manual | tier_1 |
| **BetaList** | betalist.com/submit | launch | form | tier_1 |
| **Uneed** | uneed.best/submit | launch | form | tier_1 |
| **Fazier** | fazier.com/submit | launch | form | tier_1 |
| **Microlaunch** | microlaunch.net/submit | launch | form | tier_1 |
| **DevHunt** | devhunt.org/submit | launch | form | tier_1 |
| **Peerlist** | peerlist.io | launch | manual | tier_1 |
| **Indie Hackers**| indiehackers.com | community | manual | tier_1 |
| **Hacker News** | news.ycombinator.com | community | manual | tier_1 |
| **SideProjectors**| sideprojectors.com/submit | marketplace| form | tier_2 |

**AI Tool Directories**
Futurepedia, There's an AI for That, AI Scout, AI Valley, AI Database, AI Cyclopedia, AI Stage, AI Tools Hub, AI Tool Hunt. (Mostly `form` automation).

**SaaS Directories**
SaaSHub, AlternativeTo, StartupBase, Toolfolio, LaunchingNext, StartupBuffer, PitchWall, AppRater, ToolFame. (Mostly `form` automation).

**Review Platforms**
G2, Capterra, GetApp, TrustRadius, SaaSGenius. (Mostly `manual` automation).

**Startup Discovery & Deal Platforms**
Firsto, TinyStartups, StartupBlink, AppSumo, DealMirror, StackSocial, SaaS Mantra.

**Community Platforms**
Reddit communities (r/sideproject, r/startups, r/saas, r/imadethis, r/buildinpublic). Automation: manual recommended originally but can evolve.

### 3. Automation Architecture
`User clicks "Launch" → Launch tasks created → Tasks inserted into Redis Queue → Worker service consumes jobs → Playwright bot runs submission → Result stored in database`

---

## Part 3: IDE Build Prompts (Cursor / Windsurf / GitHub Copilot)

> ⚠️ **First Read This**
> This file contains a 6-stage build plan. Do each stage **in order**. Do not skip ahead.
> **Stack:** Next.js 14, Supabase, Upstash Redis, BullMQ, Playwright, OpenAI.

### STAGE 1 — Project Setup
Create a new Next.js 14 project called "launchflow" with the following setup:
1. Initialize with App Router, TypeScript, Tailwind CSS
2. Install and configure Shadcn UI (use "new-york" style, zinc base color)
3. Install dependencies: `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`, `openai`, `bullmq`, `ioredis`, `playwright`, `@ioredis/client`, `zod`, `react-hook-form`, `@hookform/resolvers`, `lucide-react`, `next-themes`
4. Create `.env.local` with empty values for: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `OPENAI_API_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
5. Create folder structure: `/app/dashboard`, `/components/ui`, `/lib/supabase`, `/types`, etc.

### STAGE 2 — Supabase Database Schema
Run in Supabase SQL Editor:
```sql
-- Users, Projects, Launch Content, Platforms, Submissions
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  plan text default 'free' check (plan in ('free', 'indie', 'pro', 'agency')),
  submission_count integer default 0,
  created_at timestamp with time zone default timezone('utc', now())
);

create table public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  website text not null,
  tagline text,
  description text,
  category text,
  status text default 'draft',
  created_at timestamp with time zone default timezone('utc', now())
);

-- (Extend to launch_content, platforms, submissions tables. See complete schema rules).
-- Enable RLS and create policies for user access control.
```

### STAGE 3 — Platform Seed Data
Run in Supabase SQL Editor after creating tables:
```sql
insert into public.platforms (name, website, submit_url, category, automation_type, automation_difficulty, login_required, priority, seo_value) values
('Product Hunt', 'https://producthunt.com', 'https://producthunt.com/posts/new', 'launch', 'manual', 'manual', true, 'tier_1', 10),
('BetaList', 'https://betalist.com', 'https://betalist.com/submit', 'launch', 'form', 'medium', false, 'tier_1', 9),
('Microlaunch', 'https://microlaunch.net', 'https://microlaunch.net/submit', 'launch', 'form', 'easy', false, 'tier_1', 8);
-- (Add remaining tier 1, 2, 3 directories)
```

### STAGE 4 — Core App Code
*   **`lib/supabase/client.ts` & `server.ts`**: Auth helpers.
*   **`types/index.ts`**: TypeScript types.
*   **`lib/openai/generate-launch-content.ts`**: OpenAI GPT-4o-mini generation.
*   **`app/api/projects/route.ts`**: GET/POST projects.
*   **`app/api/projects/[id]/launch/route.ts`**: Generate content, queue BullMQ jobs.
*   **`app/dashboard/page.tsx`**: Stats and project list.
*   **`app/dashboard/new/page.tsx`**: React-Hook-Form for creation.

### STAGE 5 — Automation Worker
Create a standalone Node.js worker service in `/worker` folder:
*   **`worker/index.ts`**: Upstash Redis + BullMQ worker listening to "launch-queue".
*   **`worker/bots/form-bot.ts`**: Generic Playwright bot (opens URL, fills generic fields like name, website, takes screenshot, submits).
*   **`worker/bots/microlaunch-bot.ts`**: Specific selectors for Microlaunch.
*   **`worker/Dockerfile`**: Playwright base for Railway deployment.

### STAGE 6 — Deploy & Env Setup
1. Clone repo, install deps.
2. Set up Supabase + Upstash + OpenAI.
3. Deploy frontend to Vercel.
4. Deploy worker to Railway.

---

## Future Roadmap (Post-MVP)
1. **Manual submission helper** — Wizard for platforms where bots fail.
2. **Screenshot generator** — Puppeteer automated mockups.
3. **Analytics** — Supabase backlink and traffic monitoring.
4. **Reddit integration** — Auto-post to r/sideproject via API. 
5. **Stripe integration** — Plan upgrades.

*LaunchFlow — AI Growth Agent.*
