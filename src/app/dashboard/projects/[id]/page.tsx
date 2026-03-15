'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Rocket,
    ArrowLeft,
    Globe,
    Zap,
    CheckCircle2,
    Clock,
    ExternalLink,
    ChevronRight,
    ShieldCheck,
    Loader2,
    Sparkles,
    Terminal,
    Activity
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Project } from '@/types';

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [launching, setLaunching] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function fetchProject() {
            const { data } = await supabase.from('projects').select('*').eq('id', params.id).single();
            setProject(data);
            setLoading(false);
        }
        fetchProject();
    }, [params.id, supabase]);

    const handleLaunch = async () => {
        setLaunching(true);
        try {
            const res = await fetch(`/api/projects/${params.id}/launch`, { method: 'POST' });
            if (!res.ok) throw new Error('Launch sequence aborted');
            alert('Launch Sequence Initialized! AI is generating your kit.');
            // Refresh project
            const { data } = await supabase.from('projects').select('*').eq('id', params.id).single();
            setProject(data);
        } catch (err) {
            alert('Transmission Error.');
        } finally {
            setLaunching(false);
        }
    };

    if (loading) return <div className="flex flex-col items-center justify-center py-64 gap-6"><Loader2 className="w-12 h-12 animate-spin text-[var(--ink)]" /></div>;
    if (!project) return <div>Project not found.</div>;

    return (
        <div className="space-y-16">
            <div className="flex items-center gap-6 mb-8 text-[#888] hover:text-[var(--ink)] transition-colors w-fit">
                <Link href="/dashboard" className="w-14 h-14 border-2 border-[var(--ink)] flex items-center justify-center hover:bg-[var(--paper2)] transition-colors group bg-[var(--paper)]">
                    <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                </Link>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.3em]">BACK_TO_INVENTORY</span>
            </div>

            {/* TOP HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 border-b-2 border-[var(--ink)] pb-16">
                <div className="space-y-8 flex-1">
                    <div className="flex items-center gap-8">
                        <div className="w-24 h-24 bg-[var(--paper2)] border-2 border-[var(--ink)] flex items-center justify-center">
                            <Rocket className="w-12 h-12 text-[var(--rust)]" />
                        </div>
                        <div>
                            <div className="flex flex-wrap items-center gap-6 mb-4">
                                <h1 className="font-display text-8xl italic uppercase tracking-widest leading-none">{project.name}</h1>
                                <div className={`px-6 py-2 border-2 border-[var(--ink)] font-mono text-[10px] font-bold uppercase tracking-widest ${project.status === 'launching' ? 'bg-[var(--acid)] text-[var(--ink)]' : 'bg-[var(--ink)] text-white'}`}>
                                    {project.status.toUpperCase()}
                                </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-8 text-[#666] font-mono text-[11px] tracking-widest font-bold uppercase">
                                <div className="flex items-center gap-2 transition-colors hover:text-[var(--ink)]"><Globe className="w-4 h-4" /> {project.website}</div>
                                <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> INGESTED {new Date(project.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full lg:w-auto">
                    {project.status === 'draft' ? (
                        <button
                            onClick={handleLaunch}
                            disabled={launching}
                            className="bg-[var(--ink)] text-[var(--acid)] px-12 py-8 border-2 border-[var(--ink)] font-display text-[26px] tracking-widest uppercase flex items-center justify-center gap-6 transition-all active:scale-95 group hover:bg-[var(--acid)] hover:text-[var(--ink)]"
                        >
                            {launching ? <Loader2 className="w-8 h-8 animate-spin" /> : <><Zap className="w-8 h-8 group-hover:scale-110 transition-transform" /> INITIATE_LAUNCH_SYNC</>}
                        </button>
                    ) : (
                        <div className="bg-[var(--acid)] text-[var(--ink)] px-12 py-8 border-2 border-[var(--ink)] font-display text-[26px] tracking-widest uppercase flex items-center justify-center gap-6">
                            <Sparkles className="w-8 h-8 animate-pulse" /> SYNCING_META
                        </div>
                    )}
                    <div className="p-6 border-2 border-[var(--ink)] bg-[var(--paper2)] flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest">Protocol_Integrity</span>
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* LEFT: CONTENT & ANALYTICS */}
                <div className="lg:col-span-8 space-y-16">
                    <section className="border-2 border-[var(--ink)] p-12 bg-[var(--paper)]">
                        <h3 className="font-display text-4xl italic uppercase tracking-widest mb-10 border-b-2 border-[var(--paper2)] pb-8">PROJECT_BRIEF</h3>
                        <div className="space-y-12">
                            <div className="grid grid-cols-2 gap-12">
                                <div>
                                    <span className="font-mono text-[10px] font-bold text-[#999] uppercase tracking-widest block mb-4">Category</span>
                                    <p className="text-2xl font-display tracking-widest uppercase italic">{project.category}</p>
                                </div>
                                <div>
                                    <span className="font-mono text-[10px] font-bold text-[#999] uppercase tracking-widest block mb-4">Node_ID</span>
                                    <p className="text-xl font-mono tracking-widest font-bold text-[var(--rust)]">LF-{project.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                            </div>
                            <div>
                                <span className="font-mono text-[10px] font-bold text-[#999] uppercase tracking-widest block mb-4">Primary_Objective</span>
                                <p className="text-2xl font-bold leading-relaxed">{project.description}</p>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="border-2 border-[var(--ink)] p-10 bg-[var(--paper2)]/30 space-y-8">
                            <div className="flex justify-between items-center border-b border-[var(--ink)]/10 pb-4">
                                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#888]">LAUNCH_KIT_STATUS</span>
                                <div className="w-2 h-2 rounded-full bg-[var(--ink)] animate-pulse" />
                            </div>
                            <div className="flex flex-col gap-1">
                                {['Product Hunt Content', 'Twitter Thread', 'Reddit Post', 'Hacker News Post'].map(item => (
                                    <div key={item} className="flex justify-between items-center py-4 border-b border-[var(--paper2)] last:border-0 opacity-40">
                                        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em]">{item}</span>
                                        <Clock className="w-4 h-4" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-2 border-[var(--ink)] p-10 flex flex-col justify-center items-center text-center space-y-8">
                            <Activity className="w-16 h-16 text-[var(--paper2)]" />
                            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#888] leading-relaxed">Global distribution Map <br /> awaiting sequence trigger.</p>
                        </div>
                    </section>
                </div>

                {/* RIGHT: DEPLOYMENT STATUS */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="border-2 border-[var(--ink)] p-10 bg-[var(--ink)] text-[var(--paper)]">
                        <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest mb-10 text-[var(--acid)]">TRANSMISSION_FEED</h4>
                        <div className="space-y-8 font-mono">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex gap-6 items-start opacity-30">
                                    <div className="w-[1px] h-12 bg-[var(--paper)]/20" />
                                    <div>
                                        <p className="text-[10px] font-bold tracking-widest uppercase">AWAIT_JOB_{i}00X</p>
                                        <p className="text-[9px] text-[var(--acid)] tracking-widest uppercase mt-2">STATUS::IDLE</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-2 border-dashed border-[var(--ink)] p-10 bg-[var(--paper)]">
                        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#888] block mb-6 px-1">DIAGNOSTIC_LOGS</span>
                        <div className="font-mono text-[10px] text-[var(--ink)] uppercase space-y-2 bg-[var(--paper2)] p-4 border border-[var(--ink)]/10">
                            <p className="opacity-40">[01:22:10] _engine_booted</p>
                            <p className="opacity-40">[01:22:11] _id_verified_{project.id.slice(0, 4)}</p>
                            <p className="font-bold text-[var(--rust)] animate-pulse">[01:22:11] _ready_for_sync</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
