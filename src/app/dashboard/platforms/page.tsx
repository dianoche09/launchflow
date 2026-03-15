import React from 'react';
import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PlatformsClient } from '@/components/dashboard/platforms-client';

export default async function PlatformsPage({ searchParams }: { searchParams: { category?: string, search?: string } }) {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { category, search } = searchParams;

    let query = supabase
        .from('platforms')
        .select('*')
        .eq('is_active', true)
        .order('tier', { ascending: true })
        .order('name', { ascending: true });

    if (category && category !== 'all') {
        query = query.eq('category', category);
    }

    if (search) {
        query = query.ilike('name', `%${search}%`);
    }

    const { data: platforms } = await query;

    return (
        <PlatformsClient
            initialPlatforms={platforms || []}
        />
    );
}
