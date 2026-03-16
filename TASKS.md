# Tasks

## Phase 1: Project Setup (COMPLETED)
- [x] Create Next.js 14 project (App Router, TS, Tailwind)
- [x] Install and configure Shadcn UI
- [x] Install dependencies (supabase, openai, bullmq, ioredis, playwright)
- [x] Create `.env.local` template with required keys
- [x] Create folder structure (app, components, lib, types)

## Phase 2: Database Schema & RLS (COMPLETED)
- [x] Create `profiles` table and `projects` table
- [x] Create `launch_content` and `platforms` tables
- [x] Create `submissions` table
- [x] Enable RLS and define policies for all tables

## Phase 3: Platform Seed Data (COMPLETED)
- [x] Insert Tier 1 Launch Platforms
- [x] Insert AI Directories
- [x] Insert SaaS Directories & Review Platforms
- [x] Insert Deal Platforms & Communities

## Phase 4: Core Application Logic (COMPLETED)
- [x] Setup Supabase client components
- [x] Define TypeScript types (`src/types/index.ts`)
- [x] Implement AI launch content generator
- [x] Build API routes for projects and submissions

## Phase 5: Automation Worker (COMPLETED)
- [x] Initialize standalone `worker` directory
- [x] Create abstract `base-bot.ts` and generic `form-bot.ts`
- [x] Create specific bots (e.g., `microlaunch-bot.ts`)

## Phase 6: Swiss-Punk Aesthetic Refactor (COMPLETED)
- [x] Consolidate styles in `globals.css` (Swiss-Punk tokens)
- [x] Fix Tailwind syntax errors (no spaces in arbitrary values)
- [x] Update Landing Page (`/`) with Swiss-Punk layout
- [x] Create mobile-responsive `Nav` component
- [x] Create custom `404` (Not Found) page
- [x] Update `/pricing` page to Swiss-Punk
- [x] Update `/platforms` page to Swiss-Punk
- [x] Update `/login` page to Swiss-Punk (magic link redesign)
- [x] Resolve duplicate routing conflict for `/login`

## Phase 7: Service Integration & Polish (IN PROGRESS)

### 7.1 Missing Pages
- [x] Implement Success Page (`/success`)
- [x] Implement Legal/Terms Page (`/legal`) — tabs: Terms + Privacy
- [x] Implement Success Page (`/launch/[id]/success`) — project-specific post-launch page

### 7.2 Email (Resend)
- [x] Install and configure Resend (`npm install resend`)
- [x] Create `lib/email/resend.ts` client helper
- [x] Create `lib/email/templates.ts` (welcome, launch-started, launch-complete, low-credits)
- [x] Create `app/api/webhooks/supabase/route.ts` → send welcome email on signup
- [x] Update launch route → send launch-started email
- [x] Create `app/api/internal/launch-complete/route.ts` → send launch-complete email
- [x] Add `RESEND_API_KEY` and `RESEND_FROM` to `.env.local`

### 7.3 Blog & Changelog
- [x] Implement Blog/Changelog system (`/blog`)
- [x] Install `next-mdx-remote` and `gray-matter`
- [x] Create `/content/blog/` and `/content/changelog/` MDX file structure
- [x] Create `lib/blog/posts.ts` (getAllPosts, getPostBySlug, getPostsByType)
- [x] Build `app/blog/page.tsx` (featured post + grid + filter by type)
- [x] Build `app/blog/[slug]/page.tsx` (MDX renderer)
- [x] Build `app/changelog/page.tsx` (timeline layout)
- [x] Create `app/api/newsletter/route.ts`
- [x] Write 3 sample blog MDX files
- [x] Write 3 sample changelog MDX files (v1.0.0, v1.1.0, v1.2.0)

### 7.4 Monitoring (Sentry)
- [x] Integrate Sentry for monitoring (`sentry.*.config.ts`)
- [x] Run `npx @sentry/wizard@latest -i nextjs`
- [x] Configure `sentry.client.config.ts` (DSN, 10% trace sample rate)
- [x] Configure `sentry.server.config.ts`
- [x] Add Sentry to `worker/index.ts` (`@sentry/node`)
- [x] Add `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_DSN`, `SENTRY_AUTH_TOKEN` to `.env.local`

### 7.5 Logging (Axiom)
- [x] Integrate Axiom for logging (`next.config.mjs`)
- [x] Install `@axiomhq/nextjs` and `@axiomhq/js`
- [x] Create `lib/logger.ts` (info, warn, error helpers)
- [x] Wrap `next.config.mjs` with `withAxiom`
- [x] Add logger calls to launch, stripe webhook, kit generate, worker
- [x] Add `AXIOM_TOKEN` and `AXIOM_DATASET` to `.env.local`

### 7.6 OG Image
- [x] Create `app/api/og/route.tsx` (static OG — 1200x630, Swiss-Punk style)
- [x] Create `app/api/og/blog/route.tsx` (dynamic OG for blog posts)
- [x] Update all page metadata to use OG image URLs

### 7.7 SEO & Crawlability
- [x] Create `app/sitemap.ts` (all static + blog post URLs)
- [x] Create `app/robots.ts` (allow crawlers, disallow /dashboard /admin /api)

### 7.8 Deploy Configuration
- [x] Create `vercel.json` (security headers, region config)
- [x] Create `DEPLOY.md` (step-by-step: Vercel, Supabase, Upstash, Railway, Stripe, Resend)
- [x] Set up Supabase Storage bucket (logos + screenshots) (Documented in DEPLOY)
- [x] Enable Supabase Realtime on `submissions` table (Documented in DEPLOY)
- [x] Create all 6 Stripe products + prices, copy price IDs to env (Documented in DEPLOY)
- [x] Add Railway worker deploy with Dockerfile
- [x] Verify all env vars present in Vercel dashboard (Documented in DEPLOY)

### 7.9 Final Testing
- [ ] Auth flows (email, magic link, reset password)
- [ ] Project CRUD (create, edit, delete, upload logo)
- [ ] AI kit generation + edit + copy
- [ ] Launch flow end-to-end (select package → queue → status updates)
- [ ] Payment flow (buy credits → webhook → credits added)
- [ ] Guided submission flow (copy shown → mark as done)
- [ ] Admin panel access control
- [ ] Worker retry on failure (3x exponential backoff)
- [ ] Stripe webhook replay safety (no double-charge)

## Phase 8: Dashboard & Admin — Real Data Wiring (COMPLETED)

### Auth
- [x] Login: Magic link (`supabase.auth.signInWithOtp`)
- [x] Login: Password sign-in (`supabase.auth.signInWithPassword`)
- [x] Login: Sign up (`supabase.auth.signUp`) + profiles insert
- [x] Login: Forgot password (`supabase.auth.resetPasswordForEmail`)

### User Dashboard
- [x] `dashboard/layout.tsx` — credits + username from profiles table, real sign out
- [x] `dashboard/launch` — real submissions (Supabase join: submissions + platforms)
- [x] `dashboard/kit` — real launch_content (product_hunt_description, reddit_post, hn_post, twitter_thread)
- [x] `dashboard/platforms` — real platforms table (all active, tier/category filtered)
- [x] `dashboard/projects` — real submission counts per project

### Admin Dashboard
- [x] `admin/page.tsx` — real KPIs (user/project/submission counts from Supabase)
- [x] `admin/users` — real user list (profiles table), search/filter functional
- [x] `admin/platforms` — real platforms table, is_active toggle working
- [x] `admin/launches` — all submissions across all users

### New API Routes
- [x] `GET /api/platforms` — platform list for client pages
- [x] `GET /api/launch-content/[projectId]` — for kit page
- [x] `PATCH /api/admin/platforms/[id]` — is_active toggle
- [x] `GET /api/admin/stats` — KPIs (user count, submission count)
- [x] `GET /api/admin/users` — all users list
- [x] `GET /api/admin/launches` — all submissions across all users

### DB
- [x] Production Supabase: `ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text default 'user'`

## Phase 9: Advanced Integrations (PLANNED)

### Pinecone (Vector DB) — pinecone.io
- [x] `@pinecone-database/pinecone` install
- [x] Embed platform metadata for semantic platform matching
- [x] `PINECONE_API_KEY`, `PINECONE_INDEX` env vars

### LangChain — langchain.com
- [x] `langchain` + `@langchain/openai` install
- [x] Migrate `generate-launch-content.ts` to LangChain chains
- [ ] RAG pipeline for platform-specific copy generation

### Loops.so (Email Marketing) — loops.so
- [ ] `loops` package install
- [ ] `LOOPS_API_KEY` env var
- [ ] Onboarding email sequence (welcome → first launch → complete)
- [ ] Migrate transactional emails from Resend to Loops events
- [ ] Create `src/lib/email/loops.ts`

### Background Jobs — Vercel Timeout Aşımı Çözümleri
> Vercel 10-30 sn timeout koyar. AI üretimi, toplu submit, büyük analiz için gerekli.

#### Inngest (öneri)
- [ ] `inngest` + `@inngest/next` install
- [ ] `src/inngest/client.ts` oluştur
- [ ] `app/api/inngest/route.ts` (serve endpoint)
- [ ] Launch job'unu BullMQ'dan Inngest function'a taşı
- [ ] Email gönderimi Inngest step'e al (retry + delay desteği)
- [ ] `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY` env vars

> Pattern: UserService içinde `inngest.send('app/user.signed.up', { email })` → Inngest function'da `step.run()` ile mail gönder + `step.sleep('3d')` ile follow-up

#### Trigger.dev (alternatif, open-source)
- [ ] `@trigger.dev/nextjs` + `@trigger.dev/sdk` install
- [ ] `trigger.config.ts` oluştur
- [ ] `app/api/trigger/route.ts` serve endpoint
- [ ] Long-running launch automation job tanımla
- [ ] `TRIGGER_API_KEY`, `TRIGGER_API_URL` env vars

## Phase 10: Kod Mimarisi Standartları (ARCHITECTURE)
> Tüm projelerde (LaunchFlow, Negolio, Kolayimar) geçerli SaaS blueprint.

### Klasör Yapısı
```
/src
 ├── app/               # Next.js App Router
 ├── components/
 │   ├── ui/            # Shadcn atomic components
 │   ├── shared/        # Multi-page components
 │   └── features/      # Feature-specific (billing, launch, etc.)
 ├── lib/               # 3rd party SDK init (supabase, stripe, resend)
 ├── services/          # Business logic — DB queries here only
 ├── hooks/             # Custom React hooks
 ├── types/             # TypeScript types + Zod schemas
 ├── actions/           # Next.js Server Actions
 ├── store/             # Global state (Zustand)
 └── config/            # App-wide constants
```

### Validation → Action → Service → DB Pattern
- [ ] `src/types/` — Zod şemaları tanımla (RegisterSchema, ProjectSchema, vb.)
- [ ] `src/services/` klasörü oluştur
- [ ] `services/user-service.ts` — auth + profile işlemleri
- [ ] `services/project-service.ts` — CRUD + launch trigger
- [ ] `services/submission-service.ts` — status updates
- [ ] `src/actions/` klasörü oluştur
- [ ] `actions/auth-actions.ts` — Server Actions (signUp, signIn, resetPassword)
- [ ] `actions/project-actions.ts` — createProject, launchProject
- [ ] Mevcut API route'larını actions'a migrate et (form işlemleri için)
- [ ] `lib/safe-fetch.ts` — API istekleri için try-catch wrapper
- [ ] `lib/logger.ts` — Axiom/Sentry bağlı logger (info/warn/error)
- [ ] `lib/env.ts` — T3-Env standardı ile env var validasyonu

### Inngest Event-Driven Refactor
- [ ] `inngest.send('app/user.signed.up')` → welcome mail + onboarding
- [ ] `inngest.send('app/launch.started')` → platform submissions
- [ ] `inngest.send('app/launch.completed')` → completion email
- [ ] Retry mantığı Inngest'e taşı (BullMQ kaldır)

## Phase 11: SEO & Analytics

### 11.1 Google
- [ ] Google Search Console'a ekle
- [ ] Google Analytics 4 kur (`npm install @next/third-parties`)
- [ ] GA4'ü `app/layout.tsx`'e ekle (`<GoogleAnalytics gaId="G-XXXXXXX">`)
- [ ] Search Console'da sitemap submit et
- [ ] Google Tag Manager kur

### 11.2 Meta Pixel
- [ ] Meta Pixel kur → checkout conversion tracking
- [ ] `PageView`, `Purchase`, `Lead` events
- [ ] Meta Business Manager'da domain doğrula

### 11.3 Microsoft Clarity
- [ ] Clarity hesabı aç (ücretsiz heatmap + session recording)
- [ ] Script'i `app/layout.tsx`'e ekle

### 11.4 Structured Data (JSON-LD)
- [ ] Homepage'e `SoftwareApplication` schema
- [ ] Blog post'larına `Article` schema
- [ ] Pricing'e `Product` + `Offer` schema
- [ ] `Organization` schema (name, url, logo, sameAs)

### 11.5 Core Web Vitals
- [ ] `next/image` — tüm görseller optimize
- [ ] `next/font` — Bebas Neue + Bricolage Grotesque local font
- [ ] Bundle analiz: `npx @next/bundle-analyzer`
- [ ] LCP < 2.5s, CLS < 0.1, FID < 100ms hedefi

### 11.6 İçerik SEO
- [ ] Her sayfa için unique `<title>` + `<meta description>`
- [ ] `app/sitemap.ts` — static + blog post URLs
- [ ] `app/robots.ts` — crawlers allow, /dashboard /admin /api disallow
- [ ] Long-tail keywords: "startup launch automation", "how to submit startup to product hunt"

## Phase 12: PWA & Mobil

### 12.1 PWA
- [ ] `next-pwa` install
- [ ] `public/manifest.json` (name, icons, start_url, display: standalone)
- [ ] Icons: 192x192, 512x512 (black bg, acid green logo)
- [ ] Service worker: network-first for API, cache-first for assets
- [ ] `<meta name="theme-color" content="#0c0c0a">`

### 12.2 iOS Uyumluluğu
- [ ] `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`
- [ ] `public/apple-touch-icon.png` (180x180)

### 12.3 Mobil UX
- [ ] Tüm tap targets min 44x44px
- [ ] Font size min 16px (iOS zoom önleme)
- [ ] Bottom navigation — mobilde dashboard'da tab bar
- [ ] Her sayfayı 375px (iPhone SE) breakpoint'te test et

## Phase 13: Performans & Güvenlik

### 13.1 Performans
- [ ] API routes response cache headers (platforms: 1 saat)
- [ ] Supabase index kontrolü (`submissions.project_id`, `submissions.status`)
- [ ] Rate limiting: `@upstash/ratelimit` — launch endpoint max 5 req/dk/user
- [ ] Image optimization: Supabase Storage `?width=200`

### 13.2 Güvenlik
- [ ] `dangerouslySetInnerHTML` kullanımlarını kontrol et
- [ ] Env vars — `NEXT_PUBLIC_` olmayanlar client bundle'a sızmıyor mu?
- [ ] Supabase RLS — her tablo policy test
- [ ] File upload: MIME type kontrol, max 5MB, sadece image
- [ ] Stripe webhook `constructEvent` doğrulaması
- [ ] Bot credentials sadece env var'da, loglarda yok

### 13.3 Error Handling
- [ ] `app/error.tsx` global error boundary
- [ ] `loading.tsx` — her async route için
- [ ] API error format tutarlı: `{ error: string, code?: string }`
- [ ] Worker job fail → kullanıcıya email (submission failed)
- [ ] Graceful degradation: OpenAI down olsa bile launch başlasın

## Phase 14: Conversion & Growth

### 14.1 Analytics Events
- [ ] `signup_completed`, `project_created`, `kit_generated`
- [ ] `package_selected`, `launch_started`, `payment_completed`
- [ ] `guided_completed`, `share_clicked`

### 14.2 Social Proof
- [ ] "X products launched this week" — landing'de canlı counter
- [ ] Testimonial section — ilk 10 beta kullanıcıdan quote
- [ ] "Featured on" logos — Product Hunt, Uneed, HN

### 14.3 Retention
- [ ] "Launch anniversary" email — 30 gün sonra
- [ ] Dashboard'da "Launch again?" CTA — son launch'tan 30 gün sonra

## Phase 15: Pre-Launch Kontroller

### 15.1 Browser Testi
- [ ] Chrome (desktop + Android), Safari (desktop + iOS), Firefox, Edge

### 15.2 Accessibility
- [ ] `aria-label` tüm interactive elementlerde
- [ ] Keyboard navigation mantıklı tab sırası
- [ ] Color contrast — acid yeşil (#b8ff00) WCAG AA kontrolü
- [ ] `<html lang="en">`

### 15.3 Legal & Compliance
- [ ] Cookie consent banner (GDPR)
- [ ] Unsubscribe link tüm emaillerde
- [ ] Stripe vergi ayarları (KDV?)

### 15.4 Domain & DNS
- [ ] launchflow.io → Vercel
- [ ] SPF, DKIM, DMARC kayıtları (Resend deliverability)

### 15.5 GitHub Template
- [ ] `README.md` — kurulum adımları, env vars, deploy
- [ ] Bu mimariyi GitHub Template Repository olarak yayınla
- [ ] `DEPLOY.md` — Vercel, Supabase, Upstash, Railway, Stripe, Resend adım adım



