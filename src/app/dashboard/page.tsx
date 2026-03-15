'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Project } from '@/types';

export default function DashboardOverview() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProjects() {
            const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            if (data) setProjects(data);
            setLoading(false);
        }
        fetchProjects();
    }, [supabase]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-52px)] gap-6">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--ink)]" />
            <div className="font-mono text-[10px] font-bold tracking-[4px] uppercase animate-pulse">SYNCING_DATA_STREAM...</div>
        </div>
    );

    return (
        <div className="pb-12">
            {/* PAGE HEADER */}
            <header className="px-8 pt-8 pb-6 flex flex-col md:flex-row items-end justify-between gap-6 mb-6">
                <div>
                    <h1 className="font-display text-[48px] tracking-widest leading-[0.9] uppercase">OVERVIEW</h1>
                    <p className="font-mono text-[11px] text-[#888] tracking-widest mt-1.5 uppercase">Welcome back, {projects.length > 0 ? 'User' : 'Gürkan'}. Here's what's happening.</p>
                </div>
                <Link href="/dashboard/new" className="px-[18px] py-[9px] border-[1.5px] border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)] font-mono text-[11px] tracking-widest hover:bg-[#222] transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" /> NEW PROJECT
                </Link>
            </header>

            {/* KPI ROW */}
            <section className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-2 border-[var(--ink)] mx-8 mb-6 bg-[var(--ink)] gap-[2px]">
                {[
                    { label: 'Active Projects', val: projects.length, delta: '+1 this month', deltaUp: true },
                    { label: 'Total Submissions', val: '127', delta: '+48 this week', deltaUp: true, color: 'text-[var(--rust)]' },
                    { label: 'Approved Listings', val: '89', delta: '70% approval rate', color: 'text-[var(--green)]' },
                    { label: 'Backlinks Generated', val: '2.4k', delta: '+340 this week', deltaUp: true }
                ].map((kpi, i) => (
                    <div key={i} className="bg-[var(--paper)] p-6 flex flex-col justify-end">
                        <div className={`font-display text-[44px] tracking-widest leading-[0.9] mb-1.5 ${kpi.color || ''}`}>{kpi.val}</div>
                        <div className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#888]">{kpi.label}</div>
                        <div className={`font-mono text-[10px] mt-1.5 flex items-center gap-1 ${kpi.deltaUp ? 'text-[var(--green)]' : 'text-[#888]'}`}>
                            {kpi.deltaUp && <ArrowUpRight className="w-3 h-3" />}
                            {kpi.delta}
                        </div>
                    </div>
                ))}
            </section>

            {/* RECENT PROJECTS */}
            <section className="mx-8 mb-6 border-2 border-[var(--ink)] bg-[var(--paper)]">
                <div className="border-b-2 border-[var(--ink)] p-[14px] px-5 flex items-center justify-between">
                    <h2 className="font-display text-[22px] tracking-widest uppercase">RECENT PROJECTS</h2>
                    <Link href="/dashboard/projects" className="px-3 py-1 border-[1.5px] border-[var(--ink)] font-mono text-[11px] tracking-widest hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all uppercase">
                        View all
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">Project</th>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">Status</th>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">Platforms</th>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">Backlinks</th>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">Launched</th>
                                <th className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[10px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center font-mono text-[11px] text-[#888] tracking-widest uppercase">
                                        No active projects found.
                                    </td>
                                </tr>
                            ) : (
                                projects.slice(0, 3).map((project) => (
                                    <tr key={project.id} className="hover:bg-[var(--paper2)] group transition-colors">
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                            <div className="font-bold">{project.name}</div>
                                            <div className="font-mono text-[10px] text-[#888]">{project.website}</div>
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                            <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border-[1.5px] ${project.status === 'live' ? 'bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]' : (project.status === 'launching' ? 'bg-[var(--blue-dim)] text-[var(--blue)] border-[var(--blue)]' : 'bg-[var(--paper3)] text-[#888] border-[#ccc]')}`}>
                                                {project.status || 'Draft'}
                                            </span>
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                            <div className="font-mono text-[11px] mb-1.5">62 / 80</div>
                                            <div className="h-1 bg-[var(--paper3)] w-24 relative overflow-hidden">
                                                <div className="h-full bg-[var(--acid-dark)] transition-all duration-500" style={{ width: '77%' }}></div>
                                            </div>
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                            <div className="font-mono text-[12px]">1,240</div>
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)]">
                                            <div className="font-mono text-[11px] text-[#888]">
                                                {project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}
                                            </div>
                                        </td>
                                        <td className="p-[13px] px-5 border-b border-[var(--paper3)] text-right">
                                            <Link href={`/dashboard/projects/${project.id}`} className="px-3 py-1.5 border-[1.5px] border-[var(--ink)] font-mono text-[10px] tracking-widest hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all uppercase">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* BOTTOM SECTION: GRID 2 */}
            <section className="mx-8 grid grid-cols-1 lg:grid-cols-2 border-2 border-[var(--ink)] bg-[var(--ink)] gap-[2px]">
                <div className="bg-[var(--paper)] flex flex-col">
                    <div className="border-b-2 border-[var(--ink)] p-[14px] px-5">
                        <h2 className="font-display text-[22px] tracking-widest uppercase">PLATFORM COVERAGE</h2>
                    </div>
                    <div className="p-5 overflow-hidden">
                        <div className="flex flex-wrap gap-1">
                            {Array.from({ length: 80 }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2.5 h-2.5 border border-[#ddd] ${i < 42 ? 'bg-[var(--acid-dark)] border-[var(--acid-dark)]' : (i < 54 ? 'bg-[var(--ink)] border-[var(--ink)]' : (i < 62 ? 'bg-[#d4b800] border-[#d4b800]' : 'bg-[var(--paper3)]'))}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-auto border-t border-[var(--paper3)] p-3 px-5 flex gap-4">
                        {[
                            { label: 'Live', color: 'bg-[var(--acid-dark)]' },
                            { label: 'Submitted', color: 'bg-[var(--ink)]' },
                            { label: 'Pending', color: 'bg-[#d4b800]' },
                            { label: 'Queued', color: 'bg-[var(--paper3)]' }
                        ].map((l, i) => (
                            <span key={i} className="flex items-center gap-1.5 font-mono text-[10px] text-[#666] uppercase tracking-widest">
                                <span className={`w-2.5 h-2.5 ${l.color}`}></span> {l.label}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="bg-[var(--paper)] flex flex-col min-h-[240px]">
                    <div className="border-b-2 border-[var(--ink)] p-[14px] px-5">
                        <h2 className="font-display text-[22px] tracking-widest uppercase">WEEKLY TRAFFIC</h2>
                    </div>
                    <div className="flex-1 flex items-end justify-between gap-1.5 p-5 pt-10">
                        {[320, 480, 390, 610, 540, 280, 180].map((v, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                <div
                                    className={`w-full group-hover:opacity-80 transition-all ${i === 3 ? 'bg-[var(--acid-dark)]' : 'bg-[var(--ink)]'}`}
                                    style={{ height: `${(v / 610) * 100}%` }}
                                ></div>
                                <div className="font-mono text-[8px] text-[#aaa] tracking-widest">{'MTWTFSS'[i]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
