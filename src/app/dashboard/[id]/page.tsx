'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Rocket,
    ArrowLeft,
    Globe,
    Terminal,
    ExternalLink,
    Activity,
    Info,
    Clock,
    BarChart3,
    ChevronRight,
    Plus,
    Loader2,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Project, Submission } from '@/types';

export default function ProjectDetail({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
    const params = use(paramsPromise);
    const [project, setProject] = useState<Project | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    const TARGET_PLATFORMS = 80;

    useEffect(() => {
        async function fetchData() {
            const [projectRes, submissionsRes] = await Promise.all([
                supabase.from('projects').select('*').eq('id', params.id).single(),
                supabase.from('submissions').select('*').eq('project_id', params.id).order('created_at', { ascending: false })
            ]);

            if (projectRes.data) setProject(projectRes.data);
            if (submissionsRes.data) setSubmissions(submissionsRes.data);
            setLoading(false);
        }
        fetchData();
    }, [params.id, supabase]);

    const initiateLaunch = async () => {
        const res = await fetch(`/api/projects/${params.id}/launch`, { method: 'POST' });
        if (res.ok) alert('Deployment sequence initiated successfully.');
        else alert('Failed to initiate deployment.');
    };

    const approvedCount = submissions.filter(s => s.status === 'approved' || s.status === 'submitted').length;
    const progressPercent = Math.min(Math.round((approvedCount / TARGET_PLATFORMS) * 100), 100);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-52px)] gap-6">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--ink)]" />
            <div className="font-mono text-[10px] font-bold tracking-[4px] uppercase animate-pulse">SYNCING_DATA_STREAM...</div>
        </div>
    );

    const badgeColors: Record<string, string> = {
        'approved': 'bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]',
        'submitted': 'bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]',
        'pending': 'bg-[#fffbe6] text-[#8a6600] border-[#d4b800]',
        'failed': 'bg-[var(--rust-dim)] text-[var(--rust)] border-[var(--rust)]',
    };

    return (
        <div className="pb-12 text-sm">
            {/* PAGE HEADER */}
            <header className="px-8 pt-8 pb-6 flex flex-col md:flex-row items-end justify-between gap-6 mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <Link href="/dashboard/projects" className="font-mono text-[10px] text-[#aaa] hover:text-[var(--ink)] transition-colors uppercase tracking-widest flex items-center gap-1.5">
                            <ArrowLeft className="w-3 h-3" /> Back to projects
                        </Link>
                    </div>
                    <h1 className="font-display text-[48px] tracking-widest leading-[0.9] uppercase">{project?.name}</h1>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="font-mono text-[11px] text-[#888] tracking-widest uppercase flex items-center gap-1.5">
                            <Globe className="w-3.5 h-3.5" /> {project?.website}
                        </div>
                        <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 border-[1.5px] bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]`}>
                            Active Node
                        </span>
                    </div>
                </div>
                <button
                    onClick={initiateLaunch}
                    className="px-8 py-3.5 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)] font-display text-[22px] tracking-widest hover:bg-[#222] transition-colors flex items-center gap-3 uppercase"
                >
                    <Rocket className="w-5 h-5" /> RE-INITIATE LAUNCH
                </button>
            </header>

            {/* KPI ROW */}
            <section className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2 border-[var(--ink)] mx-8 mb-6 bg-[var(--ink)] gap-[2px]">
                {[
                    { label: 'Completion', val: `${progressPercent}%`, color: 'text-[var(--acid-dark)]' },
                    { label: 'Platforms', val: `${approvedCount} / ${TARGET_PLATFORMS}` },
                    { label: 'Distribution Yield', val: '92%', color: 'text-[var(--green)]' },
                    { label: 'Network Pulse', val: 'STABLE', delta: '42ms latency' }
                ].map((kpi, i) => (
                    <div key={i} className="bg-[var(--paper)] p-6 px-7 flex flex-col justify-end min-h-[100px]">
                        <div className={`font-display text-[44px] tracking-widest leading-[0.9] mb-1.5 ${kpi.color || ''}`}>{kpi.val}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888] font-bold">{kpi.label}</div>
                    </div>
                ))}
            </section>

            <div className="mx-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
                <div className="space-y-6">
                    {/* METADATA */}
                    <section className="border-2 border-[var(--ink)] bg-[var(--paper)]">
                        <div className="border-b-2 border-[var(--ink)] p-[14px] px-5">
                            <h2 className="font-display text-[22px] tracking-widest uppercase italic">DEPLOYMENT METADATA</h2>
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-8">
                                <div>
                                    <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#bbb] mb-2 block">Distribution URL</label>
                                    <div className="font-bold text-[18px] text-[var(--blue)] hover:underline flex items-center gap-2 tracking-tight">
                                        {project?.website} <ExternalLink className="w-3.5 h-3.5" />
                                    </div>
                                </div>
                                <div>
                                    <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#bbb] mb-2 block">Classification</label>
                                    <div className="font-display text-[28px] tracking-widest uppercase leading-none">{project?.category || 'SaaS Platform'}</div>
                                </div>
                            </div>
                            <div>
                                <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#bbb] mb-2 block">Strategic Tagline</label>
                                <p className="font-display text-[32px] leading-[0.95] tracking-widest italic uppercase">
                                    "{project?.tagline || 'Engineered for absolute yield.'}"
                                </p>
                            </div>
                            <div className="md:col-span-2 pt-8 border-t-2 border-[var(--paper3)]">
                                <label className="font-mono text-[10px] tracking-[2px] uppercase text-[#bbb] mb-3 block">Operational Scope</label>
                                <p className="text-[#555] font-body text-[15px] leading-relaxed italic">
                                    {project?.description || 'No description provided.'}
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SUBMISSIONS */}
                    <section className="border-2 border-[var(--ink)] bg-[var(--paper)]">
                        <div className="border-b-2 border-[var(--ink)] p-[14px] px-5 flex items-center justify-between">
                            <h2 className="font-display text-[22px] tracking-widest uppercase italic font-bold">REGISTRY LOGS</h2>
                            <div className="font-mono text-[10px] text-[var(--acid-dark)] uppercase tracking-[0.2em] flex items-center gap-2 font-bold animate-pulse">
                                Synchronized
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">Platform</th>
                                        <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">Status</th>
                                        <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">Timestamp</th>
                                        <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-right bg-[var(--paper3)] border-b border-[var(--paper3)]">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-16 text-center font-mono text-[11px] text-[#ccc] tracking-widest uppercase italic">
                                                Awaiting distribution signal...
                                            </td>
                                        </tr>
                                    ) : (
                                        submissions.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-[var(--paper2)] group transition-all">
                                                <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                                    <div className="font-bold tracking-tight text-[14px] uppercase italic">
                                                        {sub.platform_id}
                                                    </div>
                                                </td>
                                                <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                                    <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border-[1.5px] ${badgeColors[sub.status] || 'bg-[var(--paper3)] text-[#888]'}`}>
                                                        {sub.status.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="p-[13px] px-5 border-b border-[var(--paper3)] font-mono text-[11px] text-[#888]">
                                                    {new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="p-[13px] px-5 border-b border-[var(--paper3)] text-right">
                                                    <button className="p-2 border-[1.5px] border-[var(--ink)] bg-transparent hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all">
                                                        <Terminal className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* SIDEBAR TOOLS */}
                <aside className="space-y-6">
                    <div className="border-2 border-[var(--ink)] bg-[var(--paper)] p-8">
                        <h3 className="font-mono text-[10px] tracking-[2px] uppercase text-[#bbb] mb-8 font-bold">Performance Index</h3>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="font-mono text-[11px] text-[#888] tracking-widest">Est. Visibility</div>
                                <div className="font-display text-[28px] tracking-widest uppercase">128.4K</div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="font-mono text-[11px] text-[#888] tracking-widest">Search Authority</div>
                                <div className="font-display text-[22px] tracking-widest text-[var(--acid-dark)] uppercase">OPTIMIZED</div>
                            </div>
                            <div className="pt-8 border-t-2 border-[var(--paper3)] flex items-center justify-between">
                                <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#bbb]">Health</div>
                                <div className="font-mono text-[10px] font-bold text-[var(--green)] uppercase px-2 py-0.5 border border-[var(--green)]">STABLE</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[var(--ink)] text-[var(--paper)] p-10 border-2 border-[var(--ink)] flex flex-col gap-6">
                        <div className="font-mono text-[9px] tracking-[3px] uppercase text-white/30 font-bold">Optimization Node</div>
                        <p className="font-display text-[32px] leading-[0.9] tracking-widest text-[var(--acid)] uppercase">
                            BOOST YOUR<br />LINK VALUE.
                        </p>
                        <p className="font-mono text-[10px] leading-relaxed text-white/50 tracking-widest">
                            Trigger AI-native engagement protocols to improve index speed.
                        </p>
                        <button className="w-full py-4 bg-[var(--acid)] text-[var(--ink)] font-display text-[22px] tracking-widest hover:bg-[var(--acid-dark)] transition-all">
                            ACTIVATE
                        </button>
                    </div>

                    <div className="border-2 border-[var(--ink)] bg-[var(--paper)] p-5 flex items-center gap-4">
                        <div className="w-10 h-10 border-[1.5px] border-[var(--ink)] bg-[var(--paper2)] flex items-center justify-center">
                            <Clock className="w-4 h-4 text-[#888]" />
                        </div>
                        <div>
                            <div className="font-mono text-[9px] tracking-[2px] uppercase text-[#bbb] font-bold">Last Sync</div>
                            <div className="font-mono text-[10px] font-bold uppercase">14 SECONDS AGO</div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
