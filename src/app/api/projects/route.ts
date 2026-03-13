import { NextResponse } from 'next/server'
import { createServer } from '@/lib/supabase/server'
import { z } from 'zod'

const CreateProjectSchema = z.object({
    name: z.string().min(1),
    website: z.string().url(),
    tagline: z.string().optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    pricing_model: z.string().optional(),
    founder_name: z.string().optional(),
    twitter: z.string().optional(),
    email: z.string().email().optional(),
})

export async function GET() {
    const supabase = createServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(projects)
}

export async function POST(request: Request) {
    const supabase = createServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const json = await request.json()
        const body = CreateProjectSchema.parse(json)

        const { data: project, error } = await supabase
            .from('projects')
            .insert({
                ...body,
                user_id: user.id,
            })
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(project)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 })
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
