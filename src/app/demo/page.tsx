'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Rocket, Loader2, Sparkles, Copy, Check, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DESCS = [
    (n: string) => `${n} helps developers and indie makers ship their projects faster with AI automation`,
    (n: string) => `${n} is an AI-powered tool that automates the boring parts of your workflow`,
    (n: string) => `${n} makes it easy to manage, track, and grow your SaaS without the overhead`,
    (n: string) => `${n} gives vibecoders a superpower — launch, track, and iterate in one place`,
    (n: string) => `${n} turns your ideas into launched products — AI-native, no-code friendly`,
];

const TAGSETS = [
    ['SaaS', 'Developer Tool', 'Automation'],
    ['AI Tool', 'Productivity', 'No-code'],
    ['Dev Tool', 'Maker', 'Build-in-Public'],
    ['SaaS', 'Indie Hacker', 'B2B'],
];

const PLATFORMS = [
    { t: 1, name: 'Product Hunt', desc: 'Biggest launch community', cat: 'Launch', auto: true },
    { t: 1, name: 'Uneed', desc: 'Curated tool discovery', cat: 'Launch', auto: true },
    { t: 1, name: 'DevHunt', desc: 'Developer tools community', cat: 'Launch', auto: true },
    { t: 1, name: 'BetaList', desc: 'Pre-launch & beta products', cat: 'Launch', auto: true },
    { t: 1, name: 'Microlaunch', desc: 'Micro SaaS launches', cat: 'Launch', auto: true },
    { t: 1, name: 'Fazier', desc: 'Daily product discoveries', cat: 'Launch', auto: true },
    { t: 1, name: 'Indie Hackers', desc: 'Founder community', cat: 'Community', auto: false },
    { t: 1, name: 'Hacker News', desc: 'Show HN submission', cat: 'Community', auto: false },
    { t: 2, name: 'Peerlist', desc: 'Professional network', cat: 'Launch', auto: true },
    { t: 2, name: 'SideProjectors', desc: 'Side project marketplace', cat: 'Launch', auto: true },
    { t: 2, name: "There's an AI for That", desc: 'AI tool directory', cat: 'AI Dir', auto: true },
    { t: 2, name: 'Futurepedia', desc: 'Large AI directory', cat: 'AI Dir', auto: true },
    { t: 2, name: 'AI Scout', desc: 'AI tool discovery', cat: 'AI Dir', auto: true },
    { t: 2, name: 'Toolify', desc: 'AI tool database', cat: 'AI Dir', auto: true },
    { t: 2, name: 'SaaSHub', desc: 'SaaS alternatives & reviews', cat: 'SaaS Dir', auto: true },
    { t: 2, name: 'AlternativeTo', desc: 'Software alternatives', cat: 'SaaS Dir', auto: true },
    { t: 2, name: 'StartupBase', desc: 'Startup directory', cat: 'SaaS Dir', auto: true },
    { t: 2, name: 'PitchWall', desc: 'Startup pitches', cat: 'SaaS Dir', auto: true },
    { t: 2, name: 'r/sideproject', desc: 'Biggest maker subreddit', cat: 'Community', auto: false },
    { t: 2, name: 'r/saas', desc: 'SaaS subreddit', cat: 'Community', auto: false },
    { t: 2, name: 'r/buildinpublic', desc: 'Build in public', cat: 'Community', auto: false },
    { t: 2, name: 'Stacker News', desc: 'Tech community', cat: 'Community', auto: true },
];

export default function DemoPage() {
    const [url, setUrl] = useState('');
    const [phase, setPhase] = useState<'input' | 'progress' | 'results'>('input');
    const [project, setProject] = useState<any>(null);
    const [progress, setProgress] = useState(0);
    const [activeStep, setActiveStep] = useState(0);
    const [activeTab, setActiveTab] = useState<'kit' | 'platforms' | 'launch'>('kit');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const steps = [
        'Fetching URL',
        'Analyzing product',
        'Writing launch copy',
        'Matching platforms',
        'Ordering by priority',
        'Launch kit ready'
    ];

    const handleAnalyze = () => {
        if (!url) return;
        const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
        const domain = cleanUrl.replace(/https?:\/\//, '').replace(/\/.*/, '').replace('www.', '');
        const rawName = domain.split('.')[0];
        const name = rawName.charAt(0).toUpperCase() + rawName.slice(1);

        setProject({
            name,
            url: cleanUrl,
            desc: DESCS[Math.floor(Math.random() * DESCS.length)](name),
            score: 88 + Math.floor(Math.random() * 10),
            tags: TAGSETS[Math.floor(Math.random() * TAGSETS.length)]
        });

        setPhase('progress');
        runSimulation();
    };

    const runSimulation = () => {
        let currentPct = 0;
        const interval = setInterval(() => {
            currentPct += Math.random() * 15;
            if (currentPct >= 100) {
                currentPct = 100;
                clearInterval(interval);
                setTimeout(() => setPhase('results'), 500);
            }
            setProgress(Math.round(currentPct));
            setActiveStep(Math.floor((currentPct / 100) * (steps.length - 1)));
        }, 400);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] font-body selection:bg-[var(--acid)] selection:text-[var(--ink)]">

            {/* NAV */}
            <nav className="border-b-2 border-[var(--ink)] flex items-stretch h-14 bg-[var(--paper)] sticky top-0 z-[100] px-8">
                <Link href="/" className="font-display text-[28px] tracking-widest px-8 border-r-2 border-[var(--ink)] flex items-center leading-none no-underline text-inherit">
                    LAUNCHFLOW
                </Link>
                <Link href="/" className="flex items-center gap-3 px-8 font-mono text-[11px] text-[#888] no-underline border-r-2 border-[var(--ink)] transition-colors hover:text-[var(--ink)] group">
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back
                </Link>
                <div className="ml-auto flex items-center px-8 border-l-2 border-[var(--ink)] font-mono text-[11px] text-[#888] tracking-[2px] uppercase gap-3">
                    <div className="w-2 h-2 rounded-full bg-[var(--acid-dark)] animate-pulse"></div>
                    Live demo
                </div>
            </nav>

            <AnimatePresence mode="wait">
                {phase === 'input' && (
                    <motion.section
                        key="input"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-[1fr_420px] min-h-[calc(100vh-56px)] bg-[var(--ink)]"
                    >
                        <div className="p-8 lg:p-20 flex flex-col justify-between border-r-0 lg:border-r-2 border-white/10 relative overflow-hidden">
                            <div className="absolute -bottom-10 -left-6 font-display text-[260px] tracking-widest text-[#b8ff000a] leading-none pointer-events-none select-none">
                                TRY
                            </div>
                            <div className="relative z-10">
                                <div className="font-mono text-[11px] tracking-[2px] uppercase text-white/30 mb-8">No signup required</div>
                                <h1 className="font-display text-[clamp(72px,9vw,120px)] tracking-widest leading-[0.88] text-white">
                                    ENTER<br />YOUR<br /><span className="text-[var(--acid)]">URL.</span>
                                </h1>
                                <p className="text-[17px] text-white/40 leading-[1.65] max-w-[400px] mt-8">
                                    We'll analyze your project and generate a full launch kit — AI copy, 80+ platforms, ready to go.
                                </p>
                            </div>

                            <div className="mt-16 relative z-10 max-w-xl">
                                <label className="font-mono text-[10px] tracking-[2px] uppercase text-white/30 mb-3 block">Your project URL</label>
                                <div className="flex border-2 border-white/20 focus-within:border-[var(--acid)] transition-colors">
                                    <input
                                        type="text"
                                        placeholder="HTTPS://YOURTOOL.COM"
                                        className="flex-1 bg-transparent p-5 font-mono text-[15px] text-white outline-none"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                                    />
                                    <button
                                        onClick={handleAnalyze}
                                        className="bg-[var(--acid)] text-[var(--ink)] font-display text-[22px] px-10 border-none cursor-pointer hover:bg-[var(--acid-dark)] transition-colors uppercase tracking-widest"
                                    >
                                        ANALYZE
                                    </button>
                                </div>
                                <div className="flex gap-2 mt-4 flex-wrap">
                                    {['myaiwriter.com', 'taskflow.app', 'codebuddy.dev', 'shipnow.io'].map(ex => (
                                        <button key={ex} onClick={() => setUrl(ex)} className="font-mono text-[10px] px-3 py-1.5 border border-white/10 text-white/40 hover:text-[var(--acid)] hover:border-[var(--acid)/30] transition-all">
                                            {ex}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col bg-[var(--ink)]">
                            {[
                                { num: '80+', label: 'platforms covered', accent: true },
                                { num: '<2MIN', label: 'average setup', accent: false },
                                { num: 'AI', label: 'writes your copy', accent: true, rust: true },
                                { num: '$0', label: 'to start free', accent: false, last: true }
                            ].map((stat, i) => (
                                <div key={i} className={`flex-1 p-8 flex flex-col justify-end border-b-2 border-white/5 ${stat.last ? 'border-b-0' : ''}`}>
                                    <div className={`font-display text-[64px] leading-[0.9] tracking-widest ${stat.accent ? (stat.rust ? 'text-[var(--rust)]' : 'text-[var(--acid)]') : 'text-white'}`}>
                                        {stat.num}
                                    </div>
                                    <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-white/30 mt-3">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {phase === 'progress' && (
                    <motion.section
                        key="progress"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-56px)]"
                    >
                        <div className="bg-[var(--ink)] p-12 lg:p-24 flex flex-col justify-between border-r-2 border-[var(--ink)]">
                            <div>
                                <h2 className="font-display text-[clamp(60px,7vw,88px)] leading-[0.88] text-white tracking-widest uppercase mb-6">
                                    ANALYZING<br />YOUR<br /><span className="text-[var(--acid)]">PROJECT</span>
                                </h2>
                                <div className="font-mono text-[13px] text-white/50 tracking-widest">{project?.url}</div>
                            </div>
                            <div className="space-y-6">
                                <div className="font-mono text-[10px] tracking-[2px] uppercase text-white/30">Transmission Progress</div>
                                <div className="h-1.5 bg-white/10 relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-y-0 left-0 bg-[var(--acid)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="font-display text-[96px] text-[var(--acid)] leading-none">{progress}%</div>
                            </div>
                        </div>
                        <div className="p-12 lg:p-20 flex flex-col justify-center">
                            {steps.map((step, i) => (
                                <div key={i} className={`flex items-center gap-6 py-6 border-b-2 border-[var(--paper2)] transition-opacity duration-500 ${i === activeStep ? 'opacity-100' : 'opacity-20'}`}>
                                    <div className={`w-3 h-3 rounded-full ${i === activeStep ? 'bg-[var(--rust)] animate-pulse' : i < activeStep ? 'bg-[var(--ink)]' : 'bg-[var(--paper2)]'}`}></div>
                                    <div className={`font-mono text-[13px] font-bold uppercase tracking-widest ${i === activeStep ? 'text-[var(--rust)]' : ''}`}>{step}</div>
                                </div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {phase === 'results' && (
                    <motion.section
                        key="results"
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="flex flex-col"
                    >
                        {/* RESULT HEADER */}
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] border-b-2 border-[var(--ink)]">
                            <div className="p-10 lg:p-16 border-r-0 lg:border-r-2 border-[var(--ink)]">
                                <div className="font-mono text-[10px] text-[var(--rust)] tracking-[2px] uppercase font-bold mb-6">Launch kit generated</div>
                                <h1 className="font-display text-[clamp(52px,6vw,80px)] tracking-widest leading-[0.9] uppercase italic mb-6">{project.name}</h1>
                                <div className="font-mono text-[13px] text-[#888] mb-8">{project.url}</div>
                                <div className="flex gap-2 flex-wrap">
                                    {project.tags.map((t: string) => (
                                        <span key={t} className="px-4 py-1.5 border-2 border-[var(--ink)] font-mono text-[10px] font-bold uppercase tracking-widest">{t}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2">
                                {[
                                    { l: 'Launch score', v: project.score, c: 'text-[var(--rust)]' },
                                    { l: 'Platforms', v: '80', c: 'text-[var(--ink)]' },
                                    { l: 'Copy assets', v: '4', c: 'text-[var(--ink)]' },
                                    { l: 'Time saved', v: '~2h', c: 'text-[var(--acid-dark)]' }
                                ].map((s, i) => (
                                    <div key={i} className={`p-8 border-b-2 border-[var(--ink)] last:border-b-0 flex flex-col justify-end ${i % 2 === 0 ? 'border-r-2' : ''} ${i >= 2 ? 'lg:border-b-0' : ''}`}>
                                        <div className={`font-display text-[52px] leading-none mb-2 ${s.c}`}>{s.v}</div>
                                        <div className="font-mono text-[10px] uppercase font-bold text-[#888] tracking-widest">{s.l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* TABS */}
                        <div className="flex border-b-2 border-[var(--ink)] sticky top-[56px] z-50 bg-[var(--paper)] overflow-x-auto">
                            {[
                                { id: 'kit', label: 'AI Launch Kit', n: 4 },
                                { id: 'platforms', label: 'Platforms', n: 80 },
                                { id: 'launch', label: 'Launch', n: null }
                            ].map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setActiveTab(t.id as any)}
                                    className={`px-10 h-14 font-mono text-[11px] font-bold tracking-widest uppercase border-r-2 border-[var(--ink)] flex items-center gap-3 transition-colors ${activeTab === t.id ? 'bg-[var(--ink)] text-[var(--acid)]' : 'hover:bg-[var(--paper2)]'}`}
                                >
                                    {t.label}
                                    {t.n && <span className={`px-2 py-0.5 text-[9px] ${activeTab === t.id ? 'bg-[var(--acid)] text-[var(--ink)]' : 'bg-[var(--paper3)] text-[#666]'}`}>{t.n}</span>}
                                </button>
                            ))}
                        </div>

                        {/* TAB PANELS */}
                        <div className="flex-1">
                            {activeTab === 'kit' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 border-b-2 border-[var(--ink)]">
                                    {[
                                        { i: 'PH', p: 'Product Hunt', t: 'tagline + maker comment', b: `Hi Product Hunt! I built ${project.name} because I was tired of doing this manually. ${project.desc}. Would love your feedback.`, tags: ['#launch', '#saas', '#indiemaker'], c: `${project.name} — ${project.desc}` },
                                        { i: 'RDT', p: 'Reddit · r/sideproject', t: 'Reddit post', b: `Built ${project.name} as a side project over the last few weeks. ${project.desc}. Would love honest feedback — what's missing, what's broken?`, tags: ['sideproject', 'saas', 'feedback'], c: `I built ${project.name} — ${project.desc} [feedback welcome]` },
                                        { i: 'HN', p: 'Hacker News', t: 'Show HN post', b: `Show HN: ${project.name} – ${project.desc}. I built this because I kept running into this problem myself. Happy to answer questions.`, tags: [], c: `Show HN: ${project.name} – ${project.desc}` },
                                        { i: 'X', p: 'Twitter / X Thread', t: 'launch thread', b: `Just launched ${project.name} 🚀 ${project.desc}. Here's what I built and why 🧵 👉 ${project.url}`, tags: ['#buildinpublic', '#saas'], c: `Just launched ${project.name} — ${project.desc} 🚀` }
                                    ].map((it, idx) => (
                                        <div key={idx} className={`p-12 border-b-2 border-[var(--ink)] md:border-b-0 ${idx % 2 === 0 ? 'md:border-r-2' : ''} hover:bg-[var(--paper2)] transition-colors group`}>
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-10 h-10 bg-[var(--ink)] text-[var(--acid)] flex items-center justify-center font-mono text-[11px] font-bold">{it.i}</div>
                                                <div className="font-mono text-[11px] text-[#666] font-bold uppercase tracking-widest">{it.p}</div>
                                            </div>
                                            <div className="text-[16px] leading-relaxed mb-8">
                                                {it.b}
                                            </div>
                                            <div className="flex flex-wrap gap-2 mb-10">
                                                {it.tags.map(tag => (
                                                    <span key={tag} className="font-mono text-[10px] px-3 py-1 bg-[var(--ink)] text-[var(--acid)] tracking-widest">{tag}</span>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(it.c, `copy-${idx}`)}
                                                className={`w-full py-4 border-2 border-[var(--ink)] font-mono text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all ${copiedId === `copy-${idx}` ? 'bg-[var(--acid-dark)] border-[var(--acid-dark)] text-white' : 'hover:bg-[var(--ink)] hover:text-[var(--acid)]'}`}
                                            >
                                                {copiedId === `copy-${idx}` ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy {it.t}</>}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'platforms' && (
                                <div className="p-0">
                                    {/* Reuse Platform Grid logic or Table styling from HTML */}
                                    <div className="bg-[var(--paper2)] p-4 px-10 border-b-2 border-[var(--ink)] font-mono text-[10px] font-bold tracking-[2px] text-[#888] uppercase flex items-center gap-4">
                                        <span className="px-3 py-1 bg-[var(--ink)] text-[var(--acid)]">Tier 1</span> High-impact launch platforms — submitted first
                                    </div>
                                    <div className="grid grid-cols-[220px_1fr_120px_110px] px-10 py-3 bg-[var(--paper3)] border-b-2 border-[var(--ink)] font-mono text-[10px] text-[#999] uppercase tracking-widest">
                                        <span>Platform</span><span>Description</span><span>Method</span><span>Category</span>
                                    </div>
                                    {PLATFORMS.filter(p => p.t === 1).map((p, i) => (
                                        <div key={i} className="grid grid-cols-[220px_1fr_120px_110px] px-10 py-6 border-b border-[var(--paper2)] items-center font-mono text-[12px] hover:bg-[var(--paper2)] transition-colors">
                                            <span className="font-bold">{p.name}</span>
                                            <span className="text-[#888]">{p.desc}</span>
                                            <span className={`px-2 py-1 border-[1.5px] border-[var(--ink)] w-fit text-[9px] font-bold ${p.auto ? 'bg-[var(--ink)] text-[var(--acid)]' : ''}`}>{p.auto ? 'AUTO' : 'ASSISTED'}</span>
                                            <span className="text-[#bbb] text-[10px]">{p.cat}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'launch' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
                                    <div className="bg-[var(--ink)] p-16 lg:p-24 flex flex-col justify-center border-r-2 border-[var(--ink)]">
                                        <h2 className="font-display text-[72px] leading-[0.88] text-white tracking-widest mb-8">READY<br />TO<br /><span className="text-[var(--acid)]">LAUNCH.</span></h2>
                                        <p className="text-[17px] text-white/50 leading-relaxed mb-12 max-w-sm">Your AI launch kit is ready. 80 platforms are queued. Sign up free and we'll start submitting immediately.</p>
                                        <Link href="/login" className="bg-[var(--acid)] text-[var(--ink)] px-16 py-8 font-display text-[32px] tracking-widest no-underline transition-transform active:scale-95 inline-block w-fit">LAUNCH FREE</Link>
                                    </div>
                                    <div className="p-16 lg:p-24 flex flex-col justify-center gap-12">
                                        <div className="grid grid-cols-2 border-2 border-[var(--ink)]">
                                            {[
                                                { l: 'Total platforms', v: '80', c: 'text-[var(--rust)]' },
                                                { l: 'Auto-submit', v: '42', c: 'text-[var(--ink)]' },
                                                { l: 'Assisted', v: '38', c: 'text-[var(--ink)]' },
                                                { l: 'Time saved', v: '~2h', c: 'text-[var(--acid-dark)]' }
                                            ].map((s, i) => (
                                                <div key={i} className={`p-8 ${i % 2 === 0 ? 'border-r-2' : ''} ${i < 2 ? 'border-b-2' : ''} border-[var(--ink)]`}>
                                                    <div className={`font-display text-[48px] leading-none mb-2 ${s.c}`}>{s.v}</div>
                                                    <div className="font-mono text-[10px] font-bold text-[#999] tracking-widest uppercase">{s.l}</div>
                                                </div>
                                            ))}
                                        </div>
                                        <ul className="space-y-6">
                                            {[
                                                'AI launch kit written for 4 platforms',
                                                '80+ platforms matched to your product',
                                                'Tier 1 launch platforms queued first',
                                                'Live tracking dashboard ready'
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-5 text-[15px] font-medium">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--ink)] shrink-0"></div>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* RESET BAR */}
                        <div className="bg-[var(--paper2)] p-5 px-10 border-t-2 border-[var(--ink)] flex items-center justify-between">
                            <div className="font-mono text-[11px] text-[#888] tracking-widest uppercase font-bold flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-[var(--rust)] animate-pulse"></div>
                                Analyzed: {project.url}
                            </div>
                            <button onClick={() => setPhase('input')} className="font-mono text-[11px] font-bold tracking-widest uppercase border-[1.5px] border-[#aaa] px-6 py-2 hover:border-[var(--ink)] hover:text-[var(--ink)] transition-colors text-[#888]">
                                Try another URL
                            </button>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

        </div>
    );
}
