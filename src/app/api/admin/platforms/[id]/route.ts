import { NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const { is_active } = body;

    const { data, error } = await supabase
        .from('platforms')
        .update({ is_active })
        .eq('id', params.id)
        .select()
        .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
}
