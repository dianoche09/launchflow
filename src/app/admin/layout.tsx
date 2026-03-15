import { redirect } from 'next/navigation';
import { createServer } from '@/lib/supabase/server';
import AdminLayoutClient from './AdminLayoutClient';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = createServer();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect('/dashboard');
    }

    return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
