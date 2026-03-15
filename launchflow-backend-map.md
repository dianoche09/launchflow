# LaunchFlow — Frontend / Backend İlişki Haritası

Her sayfanın hangi API endpoint'lerini çağırdığı, hangi Supabase tablolarına dokunduğu,
hangi servislerle konuştuğu ve auth gereksinimleri bu dokümanda tanımlanmıştır.

---

## Genel Mimari

```
Browser (Next.js)
    │
    ├── /app (App Router)
    │       ├── Public sayfalar    → auth gerektirmez
    │       └── Protected sayfalar → Supabase auth middleware
    │
    ├── /api (Route Handlers)
    │       ├── Supabase ile doğrudan konuşur
    │       ├── OpenAI API çağırır
    │       └── Queue'ya (Upstash Redis) iş ekler
    │
    └── Worker (Railway — ayrı servis)
            ├── Redis queue'yu dinler
            ├── Playwright botları çalıştırır
            └── Sonuçları Supabase'e yazar
```

---

## 1. Landing Page — `/`

**Auth:** Gerekmez (public)

**Bağlantılar:**
- Hiç API çağrısı yok
- Waitlist formu → `POST /api/waitlist`

**`POST /api/waitlist`**
```
Body: { email: string }
Action: Supabase → waitlist tablosuna INSERT
Response: { success: true }
```

**Supabase Tablosu:**
```sql
waitlist (
  id uuid,
  email text unique,
  created_at timestamptz
)
```

---

## 2. Login Sayfası — `/login`

**Auth:** Gerekmez (public, auth sonrası redirect)

**Bağlantılar:**

**GitHub OAuth**
```
Supabase Auth → supabase.auth.signInWithOAuth({ provider: 'github' })
Callback: /auth/callback
```

**Google OAuth**
```
Supabase Auth → supabase.auth.signInWithOAuth({ provider: 'google' })
Callback: /auth/callback
```

**Email + Şifre (Sign In)**
```
supabase.auth.signInWithPassword({ email, password })
Success: redirect /dashboard
Error: "Invalid credentials" mesajı
```

**Email + Şifre (Sign Up)**
```
supabase.auth.signUp({ email, password })
→ profiles tablosuna otomatik INSERT tetiklenir (DB trigger)
Success: email doğrulama maili gönderilir
```

**Forgot Password**
```
supabase.auth.resetPasswordForEmail(email)
→ Supabase reset maili gönderir
```

**Auth Callback — `/auth/callback`**
```
supabase.auth.exchangeCodeForSession(code)
→ Session set edilir
→ redirect /dashboard
```

**Supabase Tabloları:**
```sql
-- Supabase Auth (otomatik yönetilir)
auth.users (id, email, ...)

-- Trigger ile otomatik oluşturulur
profiles (
  id uuid references auth.users,
  email text,
  credits integer default 0,
  created_at timestamptz
)
```

---

## 3. Demo Sayfası — `/demo`

**Auth:** Gerekmez (public)

**Bağlantılar:**

**URL Analiz (fake — client-side JS)**
```
Şu an tamamen frontend'de simüle ediliyor.
Gerçek implementasyonda:

POST /api/demo/analyze
Body: { url: string }
Action:
  1. URL'den meta tag'leri çeker (og:title, og:description, keywords)
  2. OpenAI'ya gönderir → launch kit üretir
  3. Cache'e yazar (Redis, 1 saat TTL)
Response: { name, description, tags, kit: { ph, reddit, hn, twitter } }
```

**Demo → Sign Up yönlendirmesi**
```
"Launch Free" butonuna basınca → /login?ref=demo&url={encodedUrl}
Login sonrası URL parametresi okunur → proje otomatik doldurulur
```

**Not:** Demo verisi gerçek submission yapmaz. Auth olmadan sadece kit üretir.

---

## 4. Pricing Sayfası — `/pricing`

**Auth:** Gerekmez (public)

**Bağlantılar:**

**Paket Satın Alma**
```
POST /api/checkout
Body: { package: 'starter' | 'full' | 'pro', type: 'package' | 'credits' }
Action:
  1. Stripe Checkout Session oluşturur
  2. Session URL döner
Response: { checkoutUrl: string }
→ Browser Stripe'a redirect olur
```

**Stripe Webhook — `/api/webhooks/stripe`**
```
Event: checkout.session.completed
Action:
  1. user_id ve paket bilgisi alınır
  2. credits tablosuna ekleme yapılır
  3. purchase_history'e kayıt atılır
```

**Supabase Tabloları:**
```sql
credits (
  id uuid,
  user_id uuid references profiles,
  amount integer,         -- toplam kredi
  used integer default 0,
  created_at timestamptz
)

purchase_history (
  id uuid,
  user_id uuid references profiles,
  package text,           -- 'starter' | 'full' | 'pro' | 'credits_25' | ...
  amount_paid integer,    -- cent cinsinden (900, 1900, 2900, ...)
  credits_added integer,
  stripe_session_id text,
  created_at timestamptz
)
```

---

## 5. User Dashboard — `/dashboard`

**Auth:** Gerekir → middleware redirect /login

### 5a. Overview `/dashboard`

**Bağlantılar:**

```
GET /api/dashboard/overview
Action: Supabase'den tek sorguda:
  - projects count
  - submissions count + breakdown (approved/pending/queued/failed)
  - backlinks count
  - credits remaining
Response: { projects, submissions, backlinks, credits }
```

**Supabase Query:**
```sql
select
  (select count(*) from projects where user_id = $1) as project_count,
  (select count(*) from submissions s
   join projects p on s.project_id = p.id
   where p.user_id = $1) as submission_count,
  (select count(*) from submissions s
   join projects p on s.project_id = p.id
   where p.user_id = $1 and s.status = 'approved') as approved_count
```

---

### 5b. Projects `/dashboard/projects`

**Bağlantılar:**

**Liste:**
```
GET /api/projects
Auth: JWT'den user_id alınır
Action: SELECT * FROM projects WHERE user_id = $1 ORDER BY created_at DESC
Response: Project[]
```

**Yeni Proje:**
```
POST /api/projects
Body: {
  name, website, tagline, description,
  category, pricing_model, logo_url,
  screenshots, founder_name, twitter, email
}
Action: INSERT INTO projects
Response: { id, ...project }
```

**Proje Sil:**
```
DELETE /api/projects/:id
Action:
  1. projects kaydı silindi (CASCADE → submissions da silinir)
  2. Storage'daki logo/screenshots silinir
```

**Supabase Tablosu:**
```sql
projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles on delete cascade,
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
  status text default 'draft',  -- draft | launching | launched
  created_at timestamptz default now()
)
```

---

### 5c. Launch Status `/dashboard/launch`

**Bağlantılar:**

**Submission Listesi:**
```
GET /api/projects/:id/submissions
Action:
  SELECT s.*, p.name as platform_name, p.category, p.website
  FROM submissions s
  JOIN platforms p ON s.platform_id = p.id
  WHERE s.project_id = $1
  ORDER BY s.created_at ASC
Response: Submission[]
```

**Launch Başlat:**
```
POST /api/projects/:id/launch
Body: { package: 'starter' | 'full' | 'pro' }
Action:
  1. Kredi kontrolü (yeterli kredi var mı?)
  2. Credits tablosundan düşür
  3. Seçilen pakete göre platform listesi al
  4. Her platform için submissions INSERT (status: 'queued')
  5. Redis queue'ya job'ları ekle
  6. project.status → 'launching'
Response: { submitted_count, queue_id }

Hata: { error: 'insufficient_credits' }
```

**Real-time Submission Updates:**
```
Supabase Realtime subscription:

supabase
  .channel('submissions')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'submissions',
    filter: `project_id=eq.${projectId}`
  }, (payload) => {
    // Dashboard'u güncelle
  })
  .subscribe()
```

**Supabase Tablosu:**
```sql
submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects on delete cascade,
  platform_id uuid references platforms,
  status text default 'queued',  -- queued | submitted | approved | rejected | failed
  submitted_at timestamptz,
  result_url text,
  error_message text,
  retry_count integer default 0,
  created_at timestamptz default now()
)
```

---

### 5d. AI Launch Kit `/dashboard/kit`

**Bağlantılar:**

**Kit Getir:**
```
GET /api/projects/:id/kit
Action: SELECT * FROM launch_content WHERE project_id = $1
Response: LaunchContent | null
```

**Kit Üret (OpenAI):**
```
POST /api/projects/:id/kit/generate
Action:
  1. Proje bilgileri alınır
  2. OpenAI gpt-4o-mini'ye gönderilir
  3. System prompt: "Launch copywriter. JSON only."
  4. User prompt: proje name + desc + category + url
  5. Response parse edilir + Supabase'e kaydedilir
Response: LaunchContent

OpenAI Prompt:
  Generate launch content for:
  Name: {name}
  URL: {url}
  Description: {description}
  Category: {category}

  Return JSON:
  {
    tagline: string (max 60 chars),
    short_pitch: string (max 140 chars),
    long_pitch: string (max 300 chars),
    tags: string[],
    product_hunt_description: string,
    reddit_post: string,
    hn_post: string,
    twitter_thread: string
  }
```

**Kit Düzenle:**
```
PATCH /api/projects/:id/kit
Body: Partial<LaunchContent>
Action: UPDATE launch_content SET ... WHERE project_id = $1
```

**Supabase Tablosu:**
```sql
launch_content (
  id uuid primary key,
  project_id uuid references projects on delete cascade unique,
  tagline text,
  short_pitch text,
  long_pitch text,
  tags text[],
  product_hunt_description text,
  reddit_post text,
  hn_post text,
  twitter_thread text,
  generated_at timestamptz default now(),
  updated_at timestamptz default now()
)
```

---

### 5e. Analytics `/dashboard/analytics`

**Bağlantılar:**

```
GET /api/projects/:id/analytics
Action: Supabase'den aggregated data:
  - submissions by status
  - approved platforms list + DA scores
  - estimated backlink count
  - traffic sources (manual input veya integration)
Response: AnalyticsData
```

**Not:** Gerçek trafik verisi için Ahrefs/Semrush API entegrasyonu gerekir.
MVP'de tahmini değerler kullanılabilir (platform DA * coefficient).

---

### 5f. Plan & Credits `/dashboard/plan`

**Bağlantılar:**

```
GET /api/user/credits
Action: SELECT credits.*, purchase_history FROM credits WHERE user_id = $1
Response: { total, used, remaining, history[] }

POST /api/checkout
→ Stripe'a yönlendirir (Pricing sayfasıyla aynı)

GET /api/user/purchases
Action: SELECT * FROM purchase_history WHERE user_id = $1 ORDER BY created_at DESC
Response: Purchase[]
```

---

### 5g. Settings `/dashboard/settings`

**Bağlantılar:**

```
GET /api/user/profile
Action: SELECT * FROM profiles WHERE id = $1
Response: Profile

PATCH /api/user/profile
Body: { full_name, twitter, default_category, ... }
Action: UPDATE profiles SET ... WHERE id = $1

POST /api/user/avatar
Body: FormData (image)
Action: Supabase Storage → avatars/{user_id}
Response: { avatar_url }

DELETE /api/user/account
Action:
  1. Tüm projeler ve submissions CASCADE silinir
  2. Storage temizlenir
  3. supabase.auth.admin.deleteUser(user_id)
```

---

## 6. Worker Servisi (Railway)

**Bağlantılar:**

**Queue dinleyici:**
```typescript
// BullMQ worker
const worker = new Worker('launch-queue', async (job) => {
  const { submissionId, projectId, platformId, project, platform } = job.data

  // Bot seçimi
  const bot = selectBot(platform.automation_type, platform.name)

  // Supabase: status → 'submitted' olarak güncelle
  await supabase
    .from('submissions')
    .update({ status: 'submitted', submitted_at: new Date() })
    .eq('id', submissionId)

  // Bot çalıştır
  const result = await bot.launch(project, platform)

  // Sonucu kaydet
  await supabase
    .from('submissions')
    .update({
      status: result.success ? 'approved' : 'failed',
      result_url: result.url || null,
      error_message: result.error || null
    })
    .eq('id', submissionId)
})
```

**Job Yapısı (Redis):**
```json
{
  "submissionId": "uuid",
  "projectId": "uuid",
  "platformId": "uuid",
  "project": {
    "name": "ShipStack",
    "website": "https://shipstack.io",
    "description": "...",
    "tagline": "...",
    "email": "founder@example.com",
    "twitter": "@founder"
  },
  "platform": {
    "name": "Microlaunch",
    "submit_url": "https://microlaunch.net/submit",
    "automation_type": "form",
    "selectors": { ... }
  }
}
```

**Retry Politikası:**
```
attempts: 3
backoff: { type: 'exponential', delay: 5000 }
CAPTCHA hatası → manuel queue'ya taşı
5xx hatası → retry
404/rejection → failed olarak işaretle
```

---

## 7. Admin Dashboard — `/admin`

**Auth:** Supabase auth + `profiles.role = 'admin'` kontrolü

### 7a. Overview

```
GET /api/admin/overview
Action: Supabase service_role key ile:
  - users count
  - revenue (Stripe API)
  - launches today
  - bot uptime (Railway API)
Response: AdminOverview
```

### 7b. Users

```
GET /api/admin/users?page=1&search=&plan=
Action: SELECT * FROM profiles ORDER BY created_at DESC
Response: { users: Profile[], total: number }

PATCH /api/admin/users/:id
Body: { role, banned, credits }
Action: UPDATE profiles + auth.users

DELETE /api/admin/users/:id
Action: supabase.auth.admin.deleteUser(id)
```

### 7c. Platform Manager

```
GET /api/admin/platforms
Action: SELECT * FROM platforms ORDER BY priority, name

POST /api/admin/platforms
Body: PlatformData
Action: INSERT INTO platforms

PATCH /api/admin/platforms/:id
Body: { is_active, automation_type, selectors, ... }
Action: UPDATE platforms SET ...

DELETE /api/admin/platforms/:id
Action: DELETE FROM platforms (soft delete önerilir)
```

**Supabase Tablosu:**
```sql
platforms (
  id uuid primary key,
  name text not null,
  website text,
  submit_url text,
  category text,
  automation_type text,  -- api | form | email | manual
  automation_difficulty text,
  login_required boolean default false,
  priority text,          -- tier_1 | tier_2 | tier_3
  is_active boolean default true,
  seo_value integer,
  selectors jsonb,        -- Playwright CSS selectors
  notes text,
  created_at timestamptz
)
```

### 7d. Bot Status

```
GET /api/admin/bots
Action:
  1. Redis'ten queue stats al (BullMQ)
  2. Her worker'ın son job timestamp'ini al
  3. Hata sayılarını hesapla
Response: { workers: WorkerStatus[], queue_size: number }

POST /api/admin/bots/:id/restart
Action: Railway API → worker restart

GET /api/admin/bots/queue
Action: BullMQ job listesi (waiting, active, completed, failed)
```

### 7e. Revenue

```
GET /api/admin/revenue
Action:
  1. Stripe API → charges listesi
  2. purchase_history aggregation
  3. MRR hesaplama (son 30 gün)
Response: RevenueData
```

### 7f. Blog & Changelog

```
GET /api/admin/posts
POST /api/admin/posts
PATCH /api/admin/posts/:id
DELETE /api/admin/posts/:id

Body: { title, content, type, status, published_at }
```

**Supabase Tablosu:**
```sql
posts (
  id uuid primary key,
  title text not null,
  slug text unique,
  content text,
  type text,    -- blog | changelog
  status text,  -- draft | published
  published_at timestamptz,
  created_at timestamptz
)
```

### 7g. Social Media

```
GET /api/admin/social/accounts
Action: Social media account istatistikleri

POST /api/admin/social/schedule
Body: { content, platform, scheduled_at }
Action: scheduled_posts tablosuna INSERT

GET /api/admin/social/scheduled
Action: SELECT * FROM scheduled_posts WHERE scheduled_at > now()
```

**Supabase Tablosu:**
```sql
scheduled_posts (
  id uuid,
  content text,
  platform text,  -- twitter | linkedin | producthunt | indiehackers
  scheduled_at timestamptz,
  status text,    -- scheduled | posted | failed
  post_url text
)
```

### 7h. SEO & Links

```
GET /api/admin/seo
Action:
  1. Ahrefs API (opsiyonel) → DR, backlinks
  2. submissions tablosundan approved listings aggregation
Response: SeoData
```

### 7i. System Logs

```
GET /api/admin/logs?page=1&type=
Action: SELECT * FROM system_logs ORDER BY created_at DESC LIMIT 50
```

**Supabase Tablosu:**
```sql
system_logs (
  id uuid,
  type text,     -- submission | auth | payment | bot | error
  level text,    -- info | warn | error
  message text,
  meta jsonb,
  created_at timestamptz
)
```

---

## 8. Tüm Tablolar — Özet

```sql
-- Auth
auth.users              (Supabase managed)

-- Core
profiles                (user_id, email, credits, role)
projects                (user_id, name, website, status, ...)
submissions             (project_id, platform_id, status, result_url, ...)
launch_content          (project_id, tagline, ph_desc, reddit_post, ...)
platforms               (name, submit_url, automation_type, selectors, ...)

-- Billing
purchase_history        (user_id, package, amount_paid, credits_added, ...)

-- Content
posts                   (title, slug, content, type, status, ...)
scheduled_posts         (content, platform, scheduled_at, ...)

-- System
system_logs             (type, level, message, meta, ...)
waitlist                (email, created_at)
```

---

## 9. Auth Middleware

**Next.js middleware.ts:**
```typescript
// Protected routes
const protectedPaths = ['/dashboard', '/admin']
const adminPaths = ['/admin']

export async function middleware(request: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()

  // Auth kontrolü
  if (!session && protectedPaths.some(p => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin kontrolü
  if (adminPaths.some(p => request.nextUrl.pathname.startsWith(p))) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }
}
```

---

## 10. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Worker (Railway)
REDIS_URL=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Optional
AHREFS_API_KEY=
RAILWAY_API_KEY=
```

---

## 11. Servis Maliyeti (MVP)

| Servis | Free Tier | Aşıldığında |
|--------|-----------|-------------|
| Supabase | 500MB DB, 2GB storage, 50k MAU | $25/ay |
| Vercel | 100GB bandwidth | $20/ay |
| Upstash Redis | 10k req/gün | $0.20/100k req |
| Railway | $5 free credit | ~$10/ay (worker) |
| OpenAI | — | ~$0.002/kit (gpt-4o-mini) |
| Stripe | — | 2.9% + 30¢ per transaction |

**Tahmini ilk ay maliyeti:** $0–15

---

*Son güncelleme: LaunchFlow v1 — 2025*
