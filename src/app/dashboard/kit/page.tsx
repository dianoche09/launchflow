import React from 'react';
import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { KitClient } from '@/components/dashboard/kit-client';

export default async function AiLaunchKitPage() {
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
        return <KitClient initialProjects={[]} initialContent={null} />;
    }

    const { data: content } = await supabase
        .from('launch_content')
        .select('*')
        .eq('project_id', projects[0].id)
        .single();

    return (
        <KitClient
            initialProjects={projects}
            initialContent={content}
        />
    );
}
