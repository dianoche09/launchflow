import React from 'react';
import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminPlatformsClient } from '@/components/admin/platforms-client';

export default async function AdminPlatforms() {
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

    const { data: platforms } = await supabase
        .from('platforms')
        .select('*')
        .order('category', { ascending: true })
        .order('tier', { ascending: true })
        .order('name', { ascending: true });

    return (
        <AdminPlatformsClient initialPlatforms={platforms || []} />
    );
}
