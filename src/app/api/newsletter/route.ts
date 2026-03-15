import { NextRequest, NextResponse } from 'next/server';
import { createServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
        }

        const supabase = createServer();

        // Instead of a dedicated table for MVP, we'll use profiles or a custom table
        // For now we'll mock success since the table might not exist

        // Example: await supabase.from('newsletter_subscribers').insert({ email })

        // Assume success for UI flow purposes
        return NextResponse.json({ success: true, message: 'Subscribed to the loop!' });
    } catch (error: any) {
        console.error('Newsletter error:', error);
        return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
    }
}
