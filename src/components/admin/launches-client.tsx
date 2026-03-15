'use client';

import React, { useState } from 'react';

interface Submission {
    id: string;
    platform: string;
    status: string;
    created_at: string;
    result_url: string | null;
    projects: { name: string; user_id: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
    approved: 'bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]',
    submitted: 'bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]',
    pending: 'bg-[#fffbe6] text-[#8a6600] border-[#d4b800]',
    manual_pending: 'bg-[#fffbe6] text-[#8a6600] border-[#d4b800]',
    queued: 'bg-[var(--blue-dim)] text-[var(--blue)] border-[var(--blue)]',
    failed: 'bg-[var(--rust-dim)] text-[var(--rust)] border-[var(--rust)]',
    rejected: 'bg-[var(--rust-dim)] text-[var(--rust)] border-[var(--rust)]',
    skipped: 'bg-[var(--paper3)] text-[#888] border-[#ccc]',
};

export function AdminLaunchesClient({ initialSubmissions }: { initialSubmissions: Submission[] }) {
    const [statusFilter, setStatusFilter] = useState('all');

    const filtered = statusFilter === 'all'
        ? initialSubmissions
        : initialSubmissions.filter((s) => s.status === statusFilter);

    const counts = {
        all: initialSubmissions.length,
        approved: initialSubmissions.filter((s) => ['approved', 'submitted'].includes(s.status)).length,
        pending: initialSubmissions.filter((s) => ['pending', 'manual_pending'].includes(s.status)).length,
        queued: initialSubmissions.filter((s) => s.status === 'queued').length,
        failed: initialSubmissions.filter((s) => ['failed', 'rejected'].includes(s.status)).length,
    };

    return (
        <div className="pb-12">
            <header className="px-8 pt-7 pb-6 flex items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-[44px] tracking-widest leading-[0.9] uppercase">ALL LAUNCHES</h1>
                    <p className="font-mono text-[11px] text-[#888] tracking-widest mt-1.5 uppercase">{initialSubmissions.length} total submissions across all users.</p>
                </div>
            </header>

            {/* KPI */}
            <div className="px-8 mb-6 grid grid-cols-2 md:grid-cols-5 border-2 border-[var(--ink)] mx-8 bg-[var(--ink)] gap-[2px]">
                {([
                    { label: 'Total', val: counts.all, color: '', key: 'all' },
                    { label: 'Approved', val: counts.approved, color: 'text-[var(--green)]', key: 'approved' },
                    { label: 'Pending', val: counts.pending, color: 'text-[#d4b800]', key: 'pending' },
                    { label: 'Queued', val: counts.queued, color: 'text-[var(--blue)]', key: 'queued' },
                    { label: 'Failed', val: counts.failed, color: 'text-[var(--rust)]', key: 'failed' },
                ] as { label: string; val: number; color: string; key: string }[]).map((kpi) => (
                    <button
                        key={kpi.key}
                        onClick={() => setStatusFilter(kpi.key)}
                        className={`bg-[var(--paper)] p-5 px-6 flex flex-col justify-end min-h-[90px] text-left transition-colors ${statusFilter === kpi.key ? 'bg-[var(--paper2)]' : 'hover:bg-[var(--paper2)]'}`}
                    >
                        <div className={`font-display text-[36px] tracking-widest leading-[0.9] mb-1 ${kpi.color}`}>{kpi.val}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888]">{kpi.label}</div>
                    </button>
                ))}
            </div>

            <section className="mx-8 border-2 border-[var(--ink)] bg-[var(--paper)]">
                <div className="border-b-2 border-[var(--ink)] p-3 px-5">
                    <h2 className="font-display text-[20px] tracking-widest uppercase">
                        {statusFilter === 'all' ? 'ALL SUBMISSIONS' : statusFilter.toUpperCase()}
                        {' '}
                        <span className="text-[#aaa] font-mono text-[14px] normal-case">({filtered.length})</span>
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {['Project', 'Platform', 'Status', 'Date', 'URL'].map((h) => (
                                    <th key={h} className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[9px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center font-mono text-[11px] text-[#888] tracking-widest">
                                        No submissions found.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((s) => (
                                    <tr key={s.id} className="hover:bg-[var(--paper2)] group transition-colors">
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-semibold text-[13px]">{s.projects?.name ?? '—'}</td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-mono text-[11px] text-[#888]">{s.platform}</td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)]">
                                            <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border-[1.5px] ${STATUS_COLORS[s.status] ?? STATUS_COLORS.skipped}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-mono text-[11px] text-[#888]">
                                            {new Date(s.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-mono text-[10px]">
                                            {s.result_url
                                                ? <a href={s.result_url} target="_blank" rel="noopener noreferrer" className="text-[var(--blue)] hover:underline">VIEW →</a>
                                                : <span className="text-[#aaa]">—</span>
                                            }
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
