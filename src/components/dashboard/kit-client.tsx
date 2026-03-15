'use client';

import React, { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface Project { id: string; name: string; }
interface LaunchContent {
    tagline: string;
    short_pitch: string;
    long_pitch: string;
    tags: string[];
    product_hunt_description: string;
    reddit_post: string;
    hn_post: string;
    twitter_thread: string;
}

const TABS = [
    { key: 'ph', label: 'Product Hunt', icon: 'PH', field: 'product_hunt_description' as keyof LaunchContent },
    { key: 'reddit', label: 'Reddit', icon: 'RDT', field: 'reddit_post' as keyof LaunchContent },
    { key: 'hn', label: 'Hacker News', icon: 'HN', field: 'hn_post' as keyof LaunchContent },
    { key: 'twitter', label: 'Twitter', icon: 'X', field: 'twitter_thread' as keyof LaunchContent },
];

interface KitClientProps {
    initialProjects: Project[];
    initialContent: LaunchContent | null;
}

export function KitClient({ initialProjects, initialContent }: KitClientProps) {
    const [selectedId, setSelectedId] = useState<string>(initialProjects[0]?.id || '');
    const [content, setContent] = useState<LaunchContent | null>(initialContent);
    const [activeTab, setActiveTab] = useState('ph');
    const [copied, setCopied] = useState(false);
    const [contentLoading, setContentLoading] = useState(false);

    useEffect(() => {
        if (!selectedId || selectedId === initialProjects[0]?.id) return;

        setContentLoading(true);
        setContent(null);
        fetch(`/api/launch-content/${selectedId}`)
            .then((r) => r.ok ? r.json() : null)
            .then((data) => { if (data) setContent(data); })
            .finally(() => setContentLoading(false));
    }, [selectedId, initialProjects]);

    const activeTabData = TABS.find((t) => t.key === activeTab)!;
    const activeText = content ? String(content[activeTabData.field] ?? '') : '';
    const activeTags = content?.tags ?? [];

    const handleCopy = () => {
        if (!activeText) return;
        navigator.clipboard.writeText(activeText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const selectedProject = initialProjects.find((p) => p.id === selectedId);

    return (
        <div className="pb-12 text-sm">
            <header className="px-8 pt-8 pb-6 flex flex-col md:flex-row items-end justify-between gap-6 mb-6">
                <div>
                    <h1 className="font-display text-[48px] tracking-widest leading-[0.9] uppercase">AI LAUNCH KIT</h1>
                    <p className="font-mono text-[11px] text-[#888] tracking-widest mt-1.5 uppercase">
                        {selectedProject?.name ?? '—'} — AI-generated launch copy
                    </p>
                </div>
                <div className="flex gap-2 items-center">
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
                </div>
            </header>

            <section className="mx-8 border-2 border-[var(--ink)] bg-[var(--paper)]">
                <div className="border-b-2 border-[var(--ink)] p-[14px] px-5 flex items-center justify-between">
                    <h2 className="font-display text-[22px] tracking-widest uppercase">LAUNCH CONTENT</h2>
                    {contentLoading && <Loader2 className="w-4 h-4 animate-spin text-[#888]" />}
                </div>

                {!content && !contentLoading ? (
                    <div className="p-16 text-center">
                        <p className="font-mono text-[11px] text-[#888] tracking-widest uppercase mb-6">
                            {initialProjects.length === 0 ? 'Create a project first.' : 'No launch kit yet. Start a launch to generate AI copy.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
                        <div className="border-r-0 md:border-r-2 border-[var(--ink)] bg-[var(--paper)]">
                            {TABS.map((tab) => (
                                <div
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`p-3.5 px-5 border-b border-[var(--paper3)] font-mono text-[11px] cursor-pointer transition-all flex items-center gap-2.5 tracking-widest ${activeTab === tab.key ? 'bg-[var(--ink)] text-[var(--acid)]' : 'text-[#888] hover:bg-[var(--paper2)] hover:text-[var(--ink)]'}`}
                                >
                                    <div className={`w-[26px] h-[26px] flex items-center justify-center text-[9px] shrink-0 ${activeTab === tab.key ? 'bg-white/10 text-white' : 'bg-[var(--paper3)] text-[var(--ink)]'}`}>
                                        {tab.icon}
                                    </div>
                                    {tab.label}
                                </div>
                            ))}
                        </div>
                        <div className="p-6">
                            <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#888] mb-3">
                                {activeTabData.label} — AI-generated copy
                            </div>
                            <div className="text-[14px] leading-[1.75] bg-[var(--paper2)] p-5 border border-[var(--paper3)] font-body whitespace-pre-wrap break-words text-[var(--ink)] min-h-[180px]">
                                {contentLoading ? (
                                    <div className="flex items-center gap-3 text-[#aaa]">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="font-mono text-[11px] uppercase tracking-widest">Loading content...</span>
                                    </div>
                                ) : activeText || <span className="text-[#aaa] italic">No content available for this platform.</span>}
                            </div>
                            {activeTags.length > 0 && (
                                <div className="flex gap-1.5 flex-wrap mt-3">
                                    {activeTags.map((tag, i) => (
                                        <span key={i} className="font-mono text-[10px] px-2 py-1 bg-[var(--ink)] text-[var(--acid)] uppercase tracking-widest">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={handleCopy}
                                    disabled={!activeText}
                                    className="px-5 py-2.5 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)] font-display text-[20px] tracking-widest hover:bg-[#222] transition-colors uppercase flex items-center gap-2 disabled:opacity-40"
                                >
                                    {copied ? <Check className="w-5 h-5" /> : 'Copy content'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {content && (
                <section className="mx-8 mt-5 border-2 border-[var(--ink)] bg-[var(--paper)]">
                    <div className="border-b-2 border-[var(--ink)] p-3 px-5">
                        <h2 className="font-display text-[20px] tracking-widest uppercase">TAGLINE & PITCH</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <div className="font-mono text-[9px] tracking-[2px] uppercase text-[#888] mb-1">TAGLINE</div>
                            <p className="text-[15px] font-semibold">{content.tagline}</p>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] tracking-[2px] uppercase text-[#888] mb-1">SHORT PITCH</div>
                            <p className="text-[13px] text-[#555] leading-relaxed">{content.short_pitch}</p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
