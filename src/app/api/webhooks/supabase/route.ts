import { NextRequest, NextResponse } from 'next/server';
import { sendLoopsWelcomeEmail } from '@/lib/email/loops';

// Secret to verify webhook requests from Supabase
const WEBHOOK_SECRET = process.env.SUPABASE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();

        // In production, verify the webhook signature using WEBHOOK_SECRET
        // For now, we expect a payload like:
        // { type: 'INSERT', table: 'profiles', record: { id, email, full_name, ... } }

        if (payload.type === 'INSERT' && payload.table === 'profiles') {
            const { email, full_name } = payload.record;

            if (!email) {
                return NextResponse.json({ error: 'No email found in record' }, { status: 400 });
            }

            const firstName = full_name ? full_name.split(' ')[0] : 'Founder';

            await sendLoopsWelcomeEmail(email, firstName);

            return NextResponse.json({ message: 'Welcome email event mapped to Loops' });
        }

        return NextResponse.json({ message: 'Webhook ignored (not an INSERT profile)' });
    } catch (err: any) {
        console.error('Webhook processing error:', err);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
