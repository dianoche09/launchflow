import { NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';

export async function GET() {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const [
        { count: userCount },
        { count: projectCount },
        { count: submissionCount },
        { count: approvedCount },
        { count: failedCount },
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    ]);

    // Recent activity: last 10 submissions with project info
    const { data: recentActivity } = await supabase
        .from('submissions')
        .select('id, status, created_at, platform, projects(name)')
        .order('created_at', { ascending: false })
        .limit(10);

    return NextResponse.json({
        users: userCount ?? 0,
        projects: projectCount ?? 0,
        submissions: submissionCount ?? 0,
        approved: approvedCount ?? 0,
        failed: failedCount ?? 0,
        recentActivity: recentActivity ?? [],
    });
}
