import { NextResponse } from 'next/server'
import { createServer } from '@/lib/supabase/server'
import { generateLaunchContent } from '@/lib/openai/generate-launch-content'
import { addLaunchJob } from '@/lib/queue'
import { Project, Platform } from '@/types'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createServer()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params

    try {
        // 1. Get project
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (projectError || !project) {
            return NextResponse.json({ error: 'Project not found' }, { status: 404 })
        }

        // 2. Generate content
        const content = await generateLaunchContent(project as Project)

        // 3. Save launch content
        const { error: insertContentError } = await supabase
            .from('launch_content')
            .insert({
                project_id: project.id,
                ...content,
            })

        if (insertContentError) {
            console.error('Failed to save launch content', insertContentError)
        }

        // Update project status
        await supabase.from('projects').update({ status: 'launching' }).eq('id', project.id)

        // 4. Get active platforms
        const { data: platforms, error: platformsError } = await supabase
            .from('platforms')
            .select('*')
            .eq('is_active', true)
            .order('priority', { ascending: true })

        if (platformsError) throw new Error(platformsError.message)

        // 5. Create submissions and queue jobs
        let queuedCount = 0

        for (const platform of platforms) {
            // Create pending submission
            const { data: submission, error: subError } = await supabase
                .from('submissions')
                .insert({
                    project_id: project.id,
                    platform_id: platform.id,
                    status: 'queued',
                })
                .select()
                .single()

            if (!subError && submission) {
                // Enqueue job via BullMQ -> Redis
                await addLaunchJob({
                    projectId: project.id,
                    platformId: platform.id,
                    submissionId: submission.id,
                    project: project,
                    platform: platform,
                })
                queuedCount++
            }
        }

        return NextResponse.json({ success: true, queued: queuedCount, content })
    } catch (error: any) {
        console.error('Launch Error:', error)
        return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 })
    }
}
