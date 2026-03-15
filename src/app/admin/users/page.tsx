import React from 'react';
import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AdminUsersSearch } from '@/components/admin/users-search';

const PLAN_COLORS: Record<string, string> = {
    admin: 'bg-[var(--blue-dim)] text-[var(--blue)] border-[var(--blue)]',
    pro: 'bg-[var(--acid-dim)] text-[var(--acid-dark)] border-[var(--acid-dark)]',
    user: 'bg-[var(--paper3)] text-[#888] border-[#ccc]',
};

export default async function AdminUsers({ searchParams }: { searchParams: { search?: string } }) {
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

    const search = searchParams.search;

    let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error } = await query;

    return (
        <div className="pb-12">
            <header className="px-8 pt-7 pb-6 flex flex-col lg:flex-row items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-[44px] tracking-widest leading-[0.9] uppercase">ALL USERS</h1>
                    <p className="font-mono text-[11px] text-[#888] tracking-widest mt-1.5 uppercase">
                        {users?.length || 0} registered users.
                    </p>
                </div>
                <AdminUsersSearch />
            </header>

            <section className="mx-8 border-2 border-[var(--ink)] bg-[var(--paper)]">
                <div className="border-b-2 border-[var(--ink)] p-3 px-5 flex items-center justify-between">
                    <h2 className="font-display text-[20px] tracking-widest uppercase">USER LIST</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {['Name', 'Email', 'Role', 'Credits', 'Joined', 'Actions'].map((h) => (
                                    <th key={h} className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[9px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {!users || users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center font-mono text-[11px] text-[#888] tracking-widest">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                users.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-[var(--paper2)] group transition-colors">
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-semibold text-[13px]">{u.full_name || '—'}</td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-mono text-[11px] text-[#888]">{u.email || '—'}</td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)]">
                                            <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border-[1.5px] ${PLAN_COLORS[u.role] ?? PLAN_COLORS.user}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-mono text-[13px]">{u.credits ?? 0}</td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-mono text-[11px] text-[#888]">
                                            {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })}
                                        </td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)]">
                                            <div className="flex gap-1.5 shadow-[0_0_10px_rgba(0,0,0,0.02)]">
                                                <button className="px-2.5 py-1 border-[1.5px] border-[var(--ink)] font-mono text-[10px] tracking-widest hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all uppercase">View</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
