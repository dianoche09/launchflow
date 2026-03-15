import React from 'react';
import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const supabase = createServer();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const [{ data: profile }, { count: projectCount }] = await Promise.all([
        supabase.from('profiles').select('full_name, credits').eq('id', user.id).single(),
        supabase.from('projects').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ]);

    return (
        <DashboardShell
            profile={profile}
            projectCount={projectCount || 0}
        >
            {children}
        </DashboardShell>
    );
}
