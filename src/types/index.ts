export type PlanType = 'free' | 'indie' | 'pro' | 'agency'
export type SubmissionStatus = 'pending' | 'queued' | 'submitted' | 'approved' | 'rejected' | 'failed'
export type AutomationType = 'api' | 'form' | 'email' | 'manual'
export type PlatformCategory = 'launch' | 'ai_directory' | 'saas_directory' | 'review' | 'community' | 'deal'
export type ProjectStatus = 'draft' | 'launching' | 'launched'

export interface Profile {
    id: string
    email: string | null
    plan: PlanType
    submission_count: number
    created_at: string
}

export interface Project {
    id: string
    user_id: string
    name: string
    website: string
    tagline: string | null
    description: string | null
    category: string | null
    pricing_model: string | null
    logo_url: string | null
    screenshots: string[] | null
    founder_name: string | null
    twitter: string | null
    email: string | null
    status: ProjectStatus
    created_at: string
}

export interface LaunchContent {
    id: string
    project_id: string
    tagline: string | null
    short_pitch: string | null
    long_pitch: string | null
    tags: string[] | null
    product_hunt_description: string | null
    reddit_post: string | null
    hn_post: string | null
    twitter_thread: string | null
    created_at: string
}

export interface Platform {
    id: string
    name: string
    website: string | null
    submit_url: string | null
    category: PlatformCategory | null
    automation_type: AutomationType | null
    automation_difficulty: 'easy' | 'medium' | 'hard' | 'manual' | null
    login_required: boolean
    priority: 'tier_1' | 'tier_2' | 'tier_3' | null
    is_active: boolean
    seo_value: number
    notes: string | null
}

export interface Submission {
    id: string
    project_id: string
    platform_id: string
    status: SubmissionStatus
    submitted_at: string | null
    result_url: string | null
    error_message: string | null
    created_at: string
    platform?: Platform // Joined relation
}
