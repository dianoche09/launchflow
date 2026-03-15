import React from 'react';
import Link from 'next/link';
import { createServer } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const STATUS_COLORS: Record<string, string> = {
    approved: 'bg-[var(--green)]',
    submitted: 'bg-[var(--green)]',
    failed: 'bg-[var(--rust)]',
    rejected: 'bg-[var(--rust)]',
    queued: 'bg-[var(--blue)]',
    pending: 'bg-[#d4b800]',
    manual_pending: 'bg-[#d4b800]',
};

export default async function AdminOverview() {
    const supabase = createServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Role check (already in layout but good to be safe)
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
        redirect('/dashboard');
    }

    const [
        { count: userCount },
        { count: projectCount },
        { count: submissionCount },
        { count: approvedCount },
        { count: failedCount },
    ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }),
        supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('status', 'failed'),
    ]);

    // Recent activity: last 10 submissions with project info
    const { data: recentActivity } = await supabase
        .from('submissions')
        .select('id, status, created_at, platform, projects(name)')
        .order('created_at', { ascending: false })
        .limit(10);

    const kpis = [
        { num: userCount ?? 0, label: 'Total Users', color: '' },
        { num: projectCount ?? 0, label: 'Total Projects', color: '' },
        { num: submissionCount ?? 0, label: 'Total Launches', color: '' },
        { num: approvedCount ?? 0, label: 'Approved', color: 'text-[var(--green)]' },
        { num: failedCount ?? 0, label: 'Failed', color: 'text-[var(--rust)]' },
    ];

    return (
        <div className="pb-12">
            {/* HEADER */}
            <header className="px-8 pt-7 pb-5 flex items-end justify-between mb-5">
                <div>
                    <h1 className="font-display text-[44px] tracking-widest leading-[0.9] uppercase">OVERVIEW</h1>
                    <p className="font-mono text-[11px] text-[#888] tracking-widest mt-1.5 uppercase">LaunchFlow — Real-time system status</p>
                </div>
            </header>

            {/* KPI ROW */}
            <section className="px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 border-2 border-[var(--ink)] mx-8 mb-5 bg-[var(--ink)] gap-[2px]">
                {kpis.map((kpi, i) => (
                    <div key={i} className="bg-[var(--paper)] p-5 px-6 flex flex-col justify-end min-h-[120px]">
                        <div className={`font-display text-[40px] tracking-widest leading-[0.9] mb-1 ${kpi.color}`}>{kpi.num}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888]">{kpi.label}</div>
                    </div>
                ))}
            </section>

            {/* QUICK LINKS */}
            <section className="mx-8 mb-5 grid grid-cols-2 lg:grid-cols-4 border-2 border-[var(--ink)] bg-[var(--ink)] gap-[2px]">
                {[
                    { label: 'Users', href: '/admin/users' },
                    { label: 'Platforms', href: '/admin/platforms' },
                    { label: 'All Launches', href: '/admin/launches' },
                    { label: 'Bot Status', href: '/admin/bots' },
                ].map((link) => (
                    <Link key={link.href} href={link.href} className="bg-[var(--paper)] p-5 px-6 flex items-center justify-between group hover:bg-[var(--paper2)] transition-colors">
                        <span className="font-display text-[22px] tracking-widest uppercase">{link.label}</span>
                        <span className="font-mono text-[18px] text-[var(--rust)] group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                ))}
            </section>

            {/* RECENT ACTIVITY */}
            <section className="mx-8 mb-5 border-2 border-[var(--ink)] bg-[var(--paper)]">
                <div className="border-b-2 border-[var(--ink)] p-3 px-5 flex items-center justify-between">
                    <h2 className="font-display text-[20px] tracking-widest uppercase">RECENT ACTIVITY</h2>
                </div>
                <div className="bg-[var(--paper)]">
                    {!recentActivity || recentActivity.length === 0 ? (
                        <div className="px-5 py-10 text-center font-mono text-[11px] text-[#888] tracking-widest">
                            No activity yet.
                        </div>
                    ) : (
                        recentActivity.map((item: any) => (
                            <div key={item.id} className="px-5 py-3 border-b border-[var(--paper3)] last:border-0 flex items-start gap-3.5 text-[13px]">
                                <div className="font-mono text-[10px] text-[#aaa] min-w-[80px] whitespace-nowrap mt-0.5">
                                    {new Date(item.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${STATUS_COLORS[item.status] ?? 'bg-gray-400'}`} />
                                <div className="text-[#444] leading-relaxed">
                                    <strong>{item.projects?.name ?? 'Unknown'}</strong>
                                    {' — '}
                                    <span className="text-[#888]">{item.platform}</span>
                                    {' '}
                                    <span className={`font-mono text-[9px] uppercase px-1.5 py-0.5 text-white ${STATUS_COLORS[item.status] ?? 'bg-gray-400'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
