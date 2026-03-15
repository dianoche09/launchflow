# LaunchFlow: Ultimate Deployment Guide (Vercel + Supabase + Railway)

This absolute master guide ensures the full architecture of LaunchFlow is deployed securely and correctly for production, following the exact Swiss-Punk framework.

## 1. Supabase (Database & Auth)

1. Create a new Supabase project in your region.
2. Go to **Settings > Database** and copy your direct Connection String (URI).
3. Go to **Settings > API** and copy the `Project URL`, `anon / public key`, and `service_role` secret key.
4. Open the SQL Editor and run everything inside `supabase/seed.sql` to initialize your schemas and initial profiles/platforms.
5. Create a storage bucket called `public_assets`:
   - Set it to **Public**.
   - Add a security policy allowing `SELECT` for everyone and `INSERT` / `UPDATE` only for authenticated users saving logos.
6. Enable Email Auth in **Authentication > Providers**. Adjust the confirmation templates using styling from `launchflow-emails.html`.
7. Turn ON **Realtime** specifically for the `submissions` table inside **Database > Replication** to ensure the live user dashboard reflects immediate log updates.

## 2. Upstash (Redis Queue)

1. Create a Redis database on Upstash (Serverless mode).
2. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
3. This is used by BullMQ inside your worker.

## 3. Railway (Playwright Automation Worker)

Since Vercel imposes max timeout limits (10 to 60s max) that kill heavy browser automations, we run the automated submit worker on Railway.

1. Log into Railway and create a **New Project > Deploy from GitHub Repo**.
2. Connect your LaunchFlow repo.
3. Edit the Deployment settings:
   - Root Directory: `/worker` (or use the custom `Dockerfile`)
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Inject the environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
   - `OPENAI_API_KEY`
5. Railway will automatically install Playwright's Chromium binary within the container. Verify logs to ensure `[Worker] LaunchFlow Submission Worker started.` is seen.

## 4. Stripe (Subscriptions & One-time Credits)

1. Create 3 Credit Packs in Stripe dashboard: Starter ($9), Growth ($19), and Builder ($39).
2. Create 3 Launch Packages in Stripe: Starter ($9), Launch ($19), and Pro ($29). Note: You might map credits into packages.
3. Copy all 6 Price IDs to your environment placeholders.
4. Capture your Stripe Webhook Secret (needs to listen to `checkout.session.completed`).

## 5. Resend (Email Deliverability)

1. Go to **Resend > Domains**. Add `launchflow.io`.
2. Add the provided DNS records (MX, TXT, TXT DMARC) to your domain registrar (Vercel, Namecheap, etc.).
3. Validate domain and copy `RESEND_API_KEY`.
4. Set your production `RESEND_FROM` email address.

## 6. Vercel (Next.js Application)

1. Import your GitHub repository to Vercel.
2. Select **Next.js** framework preset.
3. Overwrite the `npm run build` command if needed to ensure `NEXT_TELEMETRY_DISABLED=1`.
4. Attach ALL production environment variables from previous steps:
   - Supabase (URL, ANON_KEY)
   - Stripe (Keys + Webhook)
   - Resend
   - Upstash
   - Axiom + Sentry (Monitoring)
   - PostHog (Analytics)
5. Deploy and verify. Check your domains.

---

> Always double check `SECURITY: PRODUCTION` in Supabase (especially Row Level Security permissions) before officially driving user traffic.
