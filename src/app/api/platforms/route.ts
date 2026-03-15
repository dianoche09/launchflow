import { NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const supabase = createServer();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

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

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
