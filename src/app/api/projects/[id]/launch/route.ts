import { NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';
import { generateLaunchContent } from '@/lib/openai/generate-launch-content';
import { addLaunchJob } from '@/lib/queue';
import { sendLoopsLaunchStartedEmail } from '@/lib/email/loops';
import { logger } from '@/lib/logger';


export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // 1. Fetch project details
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

    if (projectError || !project) {
        logger.warn('Project not found for launch', { projectId: id });
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    try {
        logger.info('Starting launch sequence', { projectId: id, projectName: project.name });

        // 2. Generate AI Launch Content
        logger.info('Generating AI Launch content', { projectId: id });
        const content = await generateLaunchContent(project);

        // 3. Save generated content to database
        const { error: contentError } = await supabase
            .from('launch_content')
            .upsert({
                project_id: id,
                tagline: content.tagline,
                short_description: content.short_pitch,
                long_description: content.long_pitch,
                features: [], // Can be extracted if needed
                hashtags: content.tags,
                ph_description: content.product_hunt_description,
                reddit_post: content.reddit_post,
                hn_post: content.hn_post,
                twitter_thread: content.twitter_thread.split('\n'), // Split tweets
            });

        if (contentError) throw contentError;

        // 4. Update project status
        await supabase.from('projects').update({ status: 'launching' }).eq('id', id);

        // 5. Fetch platforms and queue jobs
        const { data: platforms } = await supabase
            .from('platforms')
            .select('*')
            .eq('priority', 'tier_1'); // Start with tier 1 for MVP

        let autoCount = 0;
        let guidedCount = 0;

        if (platforms) {
            for (const platform of platforms) {
                if (platform.automation_type === 'auto' || platform.automation_type === 'assisted') {
                    autoCount++;
                } else {
                    guidedCount++;
                }

                await addLaunchJob({
                    projectId: id,
                    platformId: platform.id,
                    content,
                });
            }
        }

        // 6. Send Launch Started Email
        if (user.email) {
            const firstName = user.user_metadata?.full_name?.split(' ')[0] || 'Founder';
            await sendLoopsLaunchStartedEmail(
                user.email,
                firstName,
                project.name
            );
        }

        return NextResponse.json({ success: true, content });
    } catch (error: any) {
        console.error('Launch sequence failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
