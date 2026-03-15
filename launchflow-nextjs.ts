// ============================================================
// LaunchFlow — Next.js 14 App Router
// Complete project structure + core files
// ============================================================

// ============================================================
// FILE: middleware.ts (root)
// ============================================================
/*
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  // Protected routes
  if (path.startsWith('/dashboard') || path.startsWith('/launch')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Admin routes
  if (path.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  // Redirect logged-in users away from login
  if (path === '/login' && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/launch/:path*', '/login']
}
*/

// ============================================================
// FILE: lib/supabase/client.ts
// ============================================================
/*
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

export const createClient = () => createClientComponentClient<Database>()
*/

// ============================================================
// FILE: lib/supabase/server.ts
// ============================================================
/*
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

export const createServerClient = () =>
  createServerComponentClient<Database>({ cookies })
*/

// ============================================================
// FILE: lib/supabase/admin.ts  (service role — server only)
// ============================================================
/*
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)
*/

// ============================================================
// FILE: types/index.ts
// ============================================================
/*
export type PlanSlug = 'starter' | 'launch' | 'pro'
export type AutomationType = 'auto' | 'assisted' | 'guided'
export type SubmissionStatus = 'queued' | 'submitted' | 'approved' | 'rejected' | 'failed' | 'skipped' | 'manual_pending'
export type PlatformCategory = 'launch' | 'ai_directory' | 'saas_directory' | 'community' | 'deal' | 'press' | 'review'
export type PlatformTier = 1 | 2 | 3

export interface Profile {
  id: string
  email: string
  full_name?: string
  twitter?: string
  credits: number
  role: 'user' | 'admin'
  created_at: string
}

export interface Project {
  id: string
  user_id: string
  name: string
  website: string
  tagline?: string
  description: string
  category?: string
  pricing_model?: string
  logo_url?: string
  screenshots?: string[]
  founder_name?: string
  twitter?: string
  email?: string
  status: 'draft' | 'launching' | 'launched'
  created_at: string
}

export interface Platform {
  id: string
  name: string
  website: string
  submit_url?: string
  category: PlatformCategory
  tier: PlatformTier
  automation_type: AutomationType
  domain_rating: number
  seo_value: number
  traffic_value: number
  is_active: boolean
  success_rate: number
  submission_notes?: string
}

export interface Submission {
  id: string
  project_id: string
  platform_id: string
  platform?: Platform
  status: SubmissionStatus
  submission_type: AutomationType
  submitted_at?: string
  result_url?: string
  guided_copy?: GuidedCopy
  error_message?: string
  created_at: string
}

export interface GuidedCopy {
  title: string
  description: string
  tags?: string[]
  step_by_step: string[]
}

export interface LaunchContent {
  project_id: string
  tagline: string
  short_pitch: string
  long_pitch: string
  tags: string[]
  product_hunt_description: string
  reddit_post: string
  hn_post: string
  twitter_thread: string
}

export interface Package {
  id: string
  slug: PlanSlug
  name: string
  price_cents: number
  credits: number
  max_tier: PlatformTier
  features: string[]
  stripe_price_id: string
}
*/

// ============================================================
// FILE: lib/openai/generate-kit.ts
// ============================================================
/*
import OpenAI from 'openai'
import { z } from 'zod'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const LaunchKitSchema = z.object({
  tagline: z.string().max(60),
  short_pitch: z.string().max(140),
  long_pitch: z.string().max(400),
  tags: z.array(z.string()).max(6),
  product_hunt_description: z.string(),
  reddit_post: z.string(),
  hn_post: z.string(),
  twitter_thread: z.string(),
})

export async function generateLaunchKit(project: {
  name: string
  url: string
  description: string
  category?: string
  pricing_model?: string
  founder_name?: string
  twitter?: string
}) {
  const prompt = `You are a startup launch copywriter for indie hackers and vibecoders.
Generate launch content for the following product.
Return ONLY valid JSON. No markdown, no explanation.

Product:
Name: ${project.name}
URL: ${project.url}
Description: ${project.description}
Category: ${project.category || 'SaaS'}
Pricing: ${project.pricing_model || 'Freemium'}
Founder: ${project.founder_name || 'The founder'}

Return this exact JSON structure:
{
  "tagline": "max 60 chars, punchy one-liner",
  "short_pitch": "max 140 chars, Twitter bio style",
  "long_pitch": "2-3 sentences, problem + solution + call to action",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "product_hunt_description": "Product Hunt maker comment, 150-200 words, casual and genuine, starts with Hi Product Hunt",
  "reddit_post": "Reddit r/sideproject post, 100-150 words, problem-solution format, ends asking for feedback",
  "hn_post": "Show HN post, 80-120 words, technical, honest, ends with tech stack",
  "twitter_thread": "Launch thread, 5 tweets numbered 1/-5/, ends with link and hashtags"
}`

  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  })

  const raw = response.choices[0].message.content
  if (!raw) throw new Error('Empty OpenAI response')

  const parsed = JSON.parse(raw)
  return LaunchKitSchema.parse(parsed)
}
*/

// ============================================================
// FILE: lib/queue/launch-queue.ts
// ============================================================
/*
import { Queue, Worker } from 'bullmq'
import { Redis } from 'ioredis'

const connection = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null })

export const launchQueue = new Queue('launch', { connection })

export interface LaunchJob {
  submissionId: string
  projectId: string
  platformId: string
  project: {
    name: string
    website: string
    description: string
    tagline?: string
    email?: string
    twitter?: string
    logo_url?: string
  }
  platform: {
    name: string
    submit_url: string
    automation_type: string
    selectors?: Record<string, string>
    login_required: boolean
  }
}

export async function addLaunchJob(job: LaunchJob, delayMs = 0) {
  return launchQueue.add('submit', job, {
    delay: delayMs,
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },
    removeOnComplete: { age: 86400 },
    removeOnFail: { age: 604800 },
  })
}
*/

// ============================================================
// FILE: app/api/auth/callback/route.ts
// ============================================================
/*
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  const next = req.nextUrl.searchParams.get('next') || '/dashboard'

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(next, req.url))
}
*/

// ============================================================
// FILE: app/api/projects/route.ts
// ============================================================
/*
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const ProjectSchema = z.object({
  name: z.string().min(1).max(100),
  website: z.string().url(),
  tagline: z.string().max(60).optional(),
  description: z.string().min(10).max(1000),
  category: z.string().optional(),
  pricing_model: z.string().optional(),
  founder_name: z.string().optional(),
  twitter: z.string().optional(),
  email: z.string().email().optional(),
})

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = ProjectSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues }, { status: 400 })

  const { data, error } = await supabase
    .from('projects')
    .insert({ ...parsed.data, user_id: session.user.id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
*/

// ============================================================
// FILE: app/api/projects/[id]/kit/generate/route.ts
// ============================================================
/*
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { generateLaunchKit } from '@/lib/openai/generate-kit'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get project — verify ownership
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()

  if (projErr || !project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Generate via OpenAI
  const kit = await generateLaunchKit({
    name: project.name,
    url: project.website,
    description: project.description,
    category: project.category,
    pricing_model: project.pricing_model,
    founder_name: project.founder_name,
    twitter: project.twitter,
  })

  // Upsert to Supabase
  const { data, error } = await supabase
    .from('launch_content')
    .upsert({ project_id: params.id, ...kit })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
*/

// ============================================================
// FILE: app/api/projects/[id]/launch/route.ts
// ============================================================
/*
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { addLaunchJob } from '@/lib/queue/launch-queue'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { package: packageSlug } = await req.json()

  // Get project
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', session.user.id)
    .single()

  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Get package
  const { data: pkg } = await supabase
    .from('packages')
    .select('*')
    .eq('slug', packageSlug)
    .single()

  if (!pkg) return NextResponse.json({ error: 'Invalid package' }, { status: 400 })

  // Check credits
  const { data: creditRow } = await supabase
    .from('credits')
    .select('amount, used')
    .eq('user_id', session.user.id)
    .single()

  const remaining = (creditRow?.amount || 0) - (creditRow?.used || 0)
  if (remaining < pkg.credits) {
    return NextResponse.json({ error: 'insufficient_credits', needed: pkg.credits, have: remaining }, { status: 402 })
  }

  // Get platforms for this package
  const { data: platforms } = await supabase
    .rpc('get_platforms_for_package', { package_slug: packageSlug })

  if (!platforms) return NextResponse.json({ error: 'No platforms' }, { status: 500 })

  // Create submissions + queue
  let count = 0
  for (const [i, platform] of platforms.entries()) {
    // Delay: tier1=15min, tier2=1day, tier3=2days
    const delayMs = platform.tier === 1
      ? i * 15 * 60 * 1000
      : platform.tier === 2
      ? 86400000 + i * 30 * 60 * 1000
      : 172800000 + i * 60 * 60 * 1000

    // Insert submission
    const { data: sub } = await supabase
      .from('submissions')
      .insert({
        project_id: params.id,
        platform_id: platform.platform_id,
        status: platform.automation_type === 'guided' ? 'manual_pending' : 'queued',
        submission_type: platform.automation_type,
      })
      .select()
      .single()

    // Queue auto/assisted
    if (sub && platform.automation_type !== 'guided') {
      const { data: fullPlatform } = await supabase
        .from('platforms')
        .select('*, platform_selectors(*)')
        .eq('id', platform.platform_id)
        .single()

      await addLaunchJob({
        submissionId: sub.id,
        projectId: params.id,
        platformId: platform.platform_id,
        project: {
          name: project.name,
          website: project.website,
          description: project.description,
          tagline: project.tagline,
          email: project.email,
          twitter: project.twitter,
          logo_url: project.logo_url,
        },
        platform: {
          name: fullPlatform!.name,
          submit_url: fullPlatform!.submit_url!,
          automation_type: fullPlatform!.automation_type,
          selectors: fullPlatform!.platform_selectors?.[0] || {},
          login_required: fullPlatform!.login_required,
        },
      }, delayMs)
    }

    count++
  }

  // Deduct credits
  await supabase.rpc('deduct_credits', { user_id: session.user.id, amount: pkg.credits })

  // Update project status
  await supabase.from('projects').update({ status: 'launching' }).eq('id', params.id)

  return NextResponse.json({ success: true, submissions_created: count })
}
*/

// ============================================================
// FILE: app/api/webhooks/stripe/route.ts
// ============================================================
/*
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase/admin'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession
    const userId = session.metadata?.user_id
    const credits = parseInt(session.metadata?.credits || '0')
    const packageSlug = session.metadata?.package_slug

    if (!userId || !credits) return NextResponse.json({ ok: true })

    // Add credits
    await supabaseAdmin.rpc('add_credits', { p_user_id: userId, p_amount: credits })

    // Log purchase
    await supabaseAdmin.from('purchase_history').insert({
      user_id: userId,
      package: packageSlug,
      amount_paid: session.amount_total,
      credits_added: credits,
      stripe_session_id: session.id,
    })
  }

  return NextResponse.json({ ok: true })
}

export const runtime = 'nodejs'
*/

// ============================================================
// FILE: app/api/checkout/route.ts
// ============================================================
/*
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-12-18.acacia' })

const PRICE_MAP: Record<string, { price_id: string; credits: number }> = {
  starter:     { price_id: process.env.STRIPE_PRICE_STARTER!,     credits: 19 },
  launch:      { price_id: process.env.STRIPE_PRICE_LAUNCH!,      credits: 49 },
  pro:         { price_id: process.env.STRIPE_PRICE_PRO!,         credits: 99 },
  credits_19:  { price_id: process.env.STRIPE_PRICE_CREDITS_19!,  credits: 19 },
  credits_49:  { price_id: process.env.STRIPE_PRICE_CREDITS_49!,  credits: 49 },
  credits_120: { price_id: process.env.STRIPE_PRICE_CREDITS_120!, credits: 120 },
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { package: packageSlug } = await req.json()
  const pkg = PRICE_MAP[packageSlug]
  if (!pkg) return NextResponse.json({ error: 'Invalid package' }, { status: 400 })

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{ price: pkg.price_id, quantity: 1 }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    customer_email: session.user.email,
    metadata: {
      user_id: session.user.id,
      credits: pkg.credits.toString(),
      package_slug: packageSlug,
    },
  })

  return NextResponse.json({ checkoutUrl: checkoutSession.url })
}
*/

// ============================================================
// FILE: app/dashboard/page.tsx  (Server Component)
// ============================================================
/*
import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const [projectsRes, submissionsRes, creditsRes] = await Promise.all([
    supabase.from('projects').select('*').eq('user_id', session.user.id),
    supabase.from('submissions')
      .select('status, projects!inner(user_id)')
      .eq('projects.user_id', session.user.id),
    supabase.from('credits').select('amount, used').eq('user_id', session.user.id).single(),
  ])

  const stats = {
    projects: projectsRes.data?.length || 0,
    submissions: submissionsRes.data?.length || 0,
    approved: submissionsRes.data?.filter(s => s.status === 'approved').length || 0,
    credits: (creditsRes.data?.amount || 0) - (creditsRes.data?.used || 0),
  }

  return (
    <div>
      {/* Render dashboard with stats */}
    </div>
  )
}
*/

// ============================================================
// FILE: .env.local  (template)
// ============================================================
/*
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# OpenAI
OPENAI_API_KEY=sk-...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_LAUNCH=price_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_CREDITS_19=price_...
STRIPE_PRICE_CREDITS_49=price_...
STRIPE_PRICE_CREDITS_120=price_...

# Redis (Upstash)
REDIS_URL=redis://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# App
NEXT_PUBLIC_APP_URL=https://launchflow.io
*/

// ============================================================
// FILE: worker/index.ts  (Railway — ayrı servis)
// ============================================================
/*
import { Worker } from 'bullmq'
import { Redis } from 'ioredis'
import { createClient } from '@supabase/supabase-js'
import { selectBot } from './bots'

const connection = new Redis(process.env.REDIS_URL!, { maxRetriesPerRequest: null })

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const worker = new Worker('launch', async (job) => {
  const { submissionId, project, platform } = job.data

  console.log(`[worker] Processing: ${platform.name} for ${project.name}`)

  // Update status → submitted
  await supabase.from('submissions')
    .update({ status: 'submitted', submitted_at: new Date().toISOString() })
    .eq('id', submissionId)

  // Run bot
  const bot = selectBot(platform)
  const result = await bot.launch(project, platform)

  // Save result
  await supabase.from('submissions')
    .update({
      status: result.success ? 'approved' : 'failed',
      result_url: result.url || null,
      error_message: result.error || null,
    })
    .eq('id', submissionId)

  // Log to system_logs
  await supabase.from('system_logs').insert({
    type: 'submission',
    level: result.success ? 'info' : 'warn',
    message: `${platform.name}: ${result.success ? 'approved' : 'failed'}`,
    meta: { submissionId, platform: platform.name, project: project.name },
  })

  return { success: result.success, url: result.url }
}, {
  connection,
  concurrency: 3,
})

worker.on('failed', (job, err) => {
  console.error(`[worker] Failed: ${job?.id}`, err)
})

console.log('[worker] LaunchFlow worker started')
*/

// ============================================================
// FILE: worker/bots/index.ts
// ============================================================
/*
import { FormBot } from './form-bot'
import { MicrolaunchBot } from './microlaunch'
import { UneedBot } from './uneed'
import { BetalistBot } from './betalist'

export function selectBot(platform: { name: string; automation_type: string }) {
  const botMap: Record<string, any> = {
    'Microlaunch': MicrolaunchBot,
    'Uneed': UneedBot,
    'BetaList': BetalistBot,
  }
  const BotClass = botMap[platform.name] || FormBot
  return new BotClass()
}
*/

// ============================================================
// FILE: worker/bots/form-bot.ts  (Generic)
// ============================================================
/*
import { chromium } from 'playwright'

export interface BotResult {
  success: boolean
  url?: string
  error?: string
}

export class FormBot {
  async launch(project: any, platform: any): Promise<BotResult> {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    try {
      await page.goto(platform.submit_url, { waitUntil: 'networkidle', timeout: 30000 })

      const s = platform.selectors || {}

      if (s.name_input) await page.fill(s.name_input, project.name).catch(() => {})
      if (s.url_input) await page.fill(s.url_input, project.website).catch(() => {})
      if (s.tagline_input) await page.fill(s.tagline_input, project.tagline || project.name).catch(() => {})
      if (s.description_input) await page.fill(s.description_input, project.description).catch(() => {})
      if (s.email_input) await page.fill(s.email_input, project.email || '').catch(() => {})

      await page.screenshot({ path: `/tmp/${platform.name}-${Date.now()}.png` })

      if (s.submit_button) {
        await page.click(s.submit_button)
        await page.waitForTimeout(2000)
      }

      const url = page.url()
      return { success: true, url }
    } catch (err: any) {
      return { success: false, error: err.message }
    } finally {
      await browser.close()
    }
  }
}
*/

// ============================================================
// FILE: worker/bots/microlaunch.ts
// ============================================================
/*
import { chromium } from 'playwright'
import type { BotResult } from './form-bot'

export class MicrolaunchBot {
  async launch(project: any, _platform: any): Promise<BotResult> {
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()

    try {
      await page.goto('https://microlaunch.net/submit', { waitUntil: 'networkidle' })

      await page.waitForSelector('input[name="name"]', { timeout: 10000 })
      await page.fill('input[name="name"]', project.name)
      await page.fill('input[name="url"]', project.website)
      await page.fill('textarea[name="description"]', project.description)

      if (project.twitter) {
        await page.fill('input[name="twitter"]', project.twitter).catch(() => {})
      }

      await page.screenshot({ path: `/tmp/microlaunch-${Date.now()}.png` })
      await page.click('button[type="submit"]')
      await page.waitForTimeout(3000)

      return { success: true, url: page.url() }
    } catch (err: any) {
      return { success: false, error: err.message }
    } finally {
      await browser.close()
    }
  }
}
*/

// ============================================================
// FILE: worker/Dockerfile
// ============================================================
/*
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]
*/

// ============================================================
// FILE: package.json (root)
// ============================================================
/*
{
  "name": "launchflow",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18",
    "react-dom": "^18",
    "@supabase/supabase-js": "^2",
    "@supabase/auth-helpers-nextjs": "^0.10",
    "openai": "^4",
    "stripe": "^15",
    "bullmq": "^5",
    "ioredis": "^5",
    "zod": "^3",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^3",
    "lucide-react": "^0.383.0",
    "next-themes": "^0.3"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "tailwindcss": "^3",
    "postcss": "^8",
    "autoprefixer": "^10"
  }
}
*/

// ============================================================
// FILE: worker/package.json
// ============================================================
/*
{
  "name": "launchflow-worker",
  "version": "1.0.0",
  "scripts": {
    "start": "ts-node index.ts",
    "build": "tsc"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2",
    "bullmq": "^5",
    "ioredis": "^5",
    "playwright": "^1.44"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "ts-node": "^10"
  }
}
*/
