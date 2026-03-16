import { NextRequest, NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';
import { sendLoopsLaunchCompleteEmail } from '@/lib/email/loops';
import { logger } from '@/lib/logger';

export async function POST(req: NextRequest) {
    try {
        // Basic secret check to ensure only internal services / workers call this
        const authHeader = req.headers.get('Authorization');
        const internalSecret = process.env.INTERNAL_WORKER_SECRET;

        if (internalSecret && authHeader !== `Bearer ${internalSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { projectId } = await req.json();

        if (!projectId) {
            return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
        }

        const supabase = createServer();

        // 1. Fetch the project and user info
        const { data: project, error: projectError } = await supabase
            .from('projects')
            .select('id, name, user_id, profiles!projects_user_id_fkey(email, full_name)')
            .eq('id', projectId)
            .single();

        if (projectError || !project) {
            logger.warn('Project not found for launch-complete email', { projectId });
            return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }

        // Extract user data
        // TypeScript complaining about profiles array vs single object depending on relations, handle safely:
        const profileInfo = Array.isArray(project.profiles) ? project.profiles[0] : project.profiles;
        const email = profileInfo?.email;
        const fullName = profileInfo?.full_name;

        if (!email) {
            logger.warn('User email not found for launch-complete email', { projectId, userId: project.user_id });
            return NextResponse.json({ error: 'User email not found' }, { status: 404 });
        }

        // 2. Fetch submission stats
        const { data: submissions, error: subError } = await supabase
            .from('submissions')
            .select('id, status, platform:platforms(automation_type)')
            .eq('project_id', projectId);

        if (subError) {
            logger.error('Failed to fetch submissions for project', { projectId, error: subError.message });
        }

        const subs = submissions || [];
        const total = subs.length;
        const approved = subs.filter((s) => s.status === 'approved' || s.status === 'submitted').length;

        // 3. Send email via Loops
        const firstName = fullName ? fullName.split(' ')[0] : 'Founder';

        await sendLoopsLaunchCompleteEmail(email, firstName, project.name, approved);
        logger.info('Launch complete event sent to Loops', { projectId, email });

        // Update project status if needed, though usually worker handles this
        // await supabase.from('projects').update({ status: 'launched' }).eq('id', projectId);

        return NextResponse.json({ success: true });

    } catch (err: any) {
        logger.error('Error in launch-complete endpoint', { error: err.message || err });
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
