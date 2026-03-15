import React from 'react';
import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminLaunchesClient } from '@/components/admin/launches-client';

export default async function AdminLaunches() {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Role check
    const { data: prof } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (prof?.role !== 'admin') {
        redirect('/dashboard');
    }

    const { data: submissions } = await supabase
        .from('submissions')
        .select(`
            id,
            platform,
            status,
            created_at,
            result_url,
            projects (name, user_id)
        `)
        .order('created_at', { ascending: false });

    return (
        <AdminLaunchesClient initialSubmissions={submissions || []} />
    );
}
