import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LaunchSuccessClient } from '@/components/launch/launch-success-client';

export default async function LaunchSuccessPage({ params }: { params: { id: string } }) {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { id } = params;

    const { data: project } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

    if (!project) {
        redirect('/dashboard/projects');
    }

    const { data: submissions } = await supabase
        .from('submissions')
        .select(`
            id,
            status,
            created_at,
            result_url,
            platform:platforms (name, category, automation_type, website)
        `)
        .eq('project_id', id)
        .order('created_at', { ascending: false });

    return <LaunchSuccessClient project={project} initialSubmissions={submissions || []} />;
}
