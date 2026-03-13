# LaunchFlow 🚀

> **Build once. Launch everywhere.**

LaunchFlow is the ultimate Startup Distribution OS built using the latest 2026 stack: Next.js 14, Supabase Auth/Postgres, Upstash Redis queues, and Playwright worker processes.

## 🛠 Features
- **AI Launch Copywriter**: Automatically generate metadata, Reddit posts, HackerNews posts, and Twitter threads.
- **One-Click Distribution**: Target 100+ review platforms, directories, and communities continuously.
- **Bot Automation**: Background worker utilizing BullMQ and Playwright simulating genuine launches.

---

## 💻 Tech Stack
- Frontend: Next.js 14 App Router, Tailwind CSS, Shadcn UI
- Backend: Supabase Auth, PostgreSQL
- Worker: Node.js, Playwright, BullMQ, ioredis
- AI: OpenAI

---

## 📦 Setup & Installation

### 1. Repository Setup
```bash
git clone https://github.com/your-repo/launchflow.git
cd launchflow

# Install Frontend dependencies
npm install

# Install Worker dependencies
cd worker
npm install
```

### 2. Environment Variables (.env.local)
Create a `.env.local` file at the root tracking the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY=sk-...
UPSTASH_REDIS_REST_URL=YOUR_REDIS_URL
UPSTASH_REDIS_REST_TOKEN=YOUR_REDIS_TOKEN
```

### 3. Supabase Configuration
Run the scripts sequentially inside the `supabase` directory into your remote or local Supabase instance's SQL Editor constraint:
1. `supabase/schema.sql`
2. `supabase/seed.sql`

### 4. Running Locally
Start your Next.js application:
```bash
npm run dev
```

In an isolated terminal instance, run your job listener bot:
```bash
cd worker
npm run dev
```

---

## ☁️ Deployment Guide

### Frontend -> Vercel
1. Upload your repository directly to [Vercel](https://vercel.com/)
2. Keep environmental instances mirrored (`NEXT_PUBLIC_SUPABASE_URL`, `OPENAI_API_KEY`, etc.)
3. Let Vercel build automatically through `vercel.json` and package configs.

### Worker -> Railway
1. Push to [Railway.app](https://railway.app/)
2. Railway will automatically pick the `Dockerfile` inside `worker/`.
3. Assure you've provided: `UPSTASH_REDIS_REST_URL`, `NEXT_PUBLIC_SUPABASE_URL`, etc. inside the specific Railway deployment instance bounds.
