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
