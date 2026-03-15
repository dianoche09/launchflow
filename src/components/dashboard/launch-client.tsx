'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface Project { id: string; name: string; }
interface Submission {
    id: string;
    platform: string | { name: string; category: string; website: string };
    status: string;
    submitted_at: string | null;
    result_url: string | null;
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

function getPlatformName(sub: Submission): string {
    if (typeof sub.platform === 'object' && sub.platform !== null) return sub.platform.name;
    return String(sub.platform ?? '—');
}

function getPlatformCategory(sub: Submission): string {
    if (typeof sub.platform === 'object' && sub.platform !== null) return sub.platform.category;
    return '—';
}

interface LaunchClientProps {
    initialProjects: Project[];
    initialSubmissions: Submission[];
}

export function LaunchClient({ initialProjects, initialSubmissions }: LaunchClientProps) {
    const [selectedId, setSelectedId] = useState<string>(initialProjects[0]?.id || '');
    const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions);
    const [subLoading, setSubLoading] = useState(false);

    useEffect(() => {
        if (!selectedId || selectedId === initialProjects[0]?.id) return;

        setSubLoading(true);
        fetch(`/api/submissions/${selectedId}`)
            .then((r) => r.json())
            .then((data) => { setSubmissions(Array.isArray(data) ? data : []); })
            .finally(() => setSubLoading(false));
    }, [selectedId, initialProjects]);

    const counts = {
        approved: submissions.filter((s) => ['approved', 'submitted'].includes(s.status)).length,
        pending: submissions.filter((s) => ['pending', 'manual_pending'].includes(s.status)).length,
        queued: submissions.filter((s) => s.status === 'queued').length,
        failed: submissions.filter((s) => ['failed', 'rejected'].includes(s.status)).length,
    };

    const selectedProject = initialProjects.find((p) => p.id === selectedId);

    return (
        <div className="pb-12 text-sm">
            <header className="px-8 pt-8 pb-6 flex flex-col md:flex-row items-end justify-between gap-6 mb-6">
                <div>
                    <h1 className="font-display text-[48px] tracking-widest leading-[0.9] uppercase">LAUNCH STATUS</h1>
                    <p className="font-mono text-[11px] text-[#888] tracking-widest mt-1.5 uppercase">
                        {selectedProject?.name ?? '—'} — {submissions.length} submissions
                    </p>
                </div>
                {initialProjects.length > 0 && (
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        className="font-mono text-[11px] px-3.5 py-2 border-[1.5px] border-[var(--ink)] bg-[var(--paper)] cursor-pointer outline-none uppercase tracking-widest"
                    >
                        {initialProjects.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                )}
            </header>

            <div className="px-8 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2 border-[var(--ink)] mx-8 bg-[var(--ink)] gap-[2px]">
                {[
                    { label: 'Approved', val: counts.approved, color: 'text-[var(--green)]' },
                    { label: 'Pending', val: counts.pending, color: 'text-[#d4b800]' },
                    { label: 'Queued', val: counts.queued, color: 'text-[var(--blue)]' },
                    { label: 'Failed', val: counts.failed, color: 'text-[var(--rust)]' },
                ].map((kpi, i) => (
                    <div key={i} className="bg-[var(--paper)] p-6 px-7 flex flex-col justify-end min-h-[100px]">
                        <div className={`font-display text-[44px] tracking-widest leading-[0.9] mb-1.5 ${kpi.color}`}>{kpi.val}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888] font-bold">{kpi.label}</div>
                    </div>
                ))}
            </div>

            <section className="mx-8 border-2 border-[var(--ink)] bg-[var(--paper)]">
                <div className="border-b-2 border-[var(--ink)] p-[14px] px-5 flex items-center justify-between">
                    <h2 className="font-display text-[22px] tracking-widest uppercase">ALL SUBMISSIONS</h2>
                    {subLoading && <Loader2 className="w-4 h-4 animate-spin text-[#888]" />}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {['Platform', 'Category', 'Submitted', 'Status', 'URL'].map((h) => (
                                    <th key={h} className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {submissions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center font-mono text-[11px] text-[#888] tracking-widest">
                                        {subLoading ? 'Loading...' : (initialProjects.length === 0 ? 'No projects yet.' : 'No submissions yet. Launch to populate.')}
                                    </td>
                                </tr>
                            ) : (
                                submissions.map((s) => (
                                    <tr key={s.id} className="hover:bg-[var(--paper2)] group transition-colors">
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)] font-semibold text-[13px]">{getPlatformName(s)}</td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)] font-mono text-[10px] text-[#888] uppercase">{getPlatformCategory(s)}</td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)] font-mono text-[11px] text-[#888]">
                                            {s.submitted_at ? new Date(s.submitted_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                            <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border-[1.5px] ${STATUS_COLORS[s.status] ?? STATUS_COLORS.skipped}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)] font-mono text-[10px] tracking-widest">
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
