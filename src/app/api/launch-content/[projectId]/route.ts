import { NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';

export async function GET(
    _request: Request,
    { params }: { params: { projectId: string } }
) {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { projectId } = params;

    const { data: project } = await supabase
        .from('projects')
        .select('id')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

    if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { data, error } = await supabase
        .from('launch_content')
        .select('*')
        .eq('project_id', projectId)
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
