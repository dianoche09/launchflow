import React from 'react';
import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { LaunchClient } from '@/components/dashboard/launch-client';

export default async function LaunchStatusPage() {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: projects } = await supabase
        .from('projects')
        .select('id, name')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (!projects || projects.length === 0) {
        return <LaunchClient initialProjects={[]} initialSubmissions={[]} />;
    }

    const { data: submissions } = await supabase
        .from('submissions')
        .select(`
            *,
            platform:platforms(*)
        `)
        .eq('project_id', projects[0].id)
        .order('created_at', { ascending: false });

    return (
        <LaunchClient
            initialProjects={projects}
            initialSubmissions={submissions || []}
        />
    );
}
