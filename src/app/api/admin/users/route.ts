import { NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');

    let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, error } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
