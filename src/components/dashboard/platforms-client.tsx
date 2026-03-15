'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Globe, ShieldCheck, ArrowRight, Database, Zap } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Platform {
    id: string;
    name: string;
    website: string;
    category: string;
    tier: number;
    automation_type: string;
    domain_rating: number;
    is_active: boolean;
    success_rate: number;
}

const CATEGORIES = ['all', 'launch', 'ai_directory', 'saas_directory', 'community', 'deal', 'press', 'review'];
const CAT_LABELS: Record<string, string> = {
    all: 'All',
    launch: 'Launch',
    ai_directory: 'AI Directory',
    saas_directory: 'SaaS Directory',
    community: 'Community',
    deal: 'Deal',
    press: 'Press',
    review: 'Review',
};

const IMPACT: Record<number, string> = { 1: 'Extreme', 2: 'High', 3: 'Medium' };

interface PlatformsClientProps {
    initialPlatforms: Platform[];
}

export function PlatformsClient({ initialPlatforms }: PlatformsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const filter = searchParams.get('category') || 'all';

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/dashboard/platforms?${params.toString()}`);
    };

    const handleSearch = (val: string) => {
        setSearchTerm(val);
        const params = new URLSearchParams(searchParams.toString());
        if (val) {
            params.set('search', val);
        } else {
            params.delete('search');
        }
        router.push(`/dashboard/platforms?${params.toString()}`);
    };

    return (
        <div className="space-y-16 p-8">
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 pb-16 border-b-2 border-[var(--ink)]">
                <div className="space-y-6">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[4px] text-[var(--rust)] flex items-center gap-4">
                        <Database className="w-5 h-5" /> REGISTRY_VERIFICATION
                    </div>
                    <h1 className="font-display text-8xl italic uppercase tracking-widest leading-none">PLATFORM <br /> <span className="text-outline">INDEX.</span></h1>
                    <p className="max-w-xl text-[17px] text-[#666] leading-relaxed">
                        {initialPlatforms.length} active launch platforms, communities, and directories in the LF-Core engine.
                    </p>
                </div>

                <div className="flex flex-col gap-4 w-full lg:w-96">
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-[#bbb]" />
                        <input
                            type="text"
                            placeholder="SEARCH_REGISTRY..."
                            className="w-full border-2 border-[var(--ink)] bg-[var(--paper)] pl-16 pr-6 py-6 font-mono text-sm tracking-widest outline-none focus:bg-[var(--paper2)] transition-colors"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-4 mr-6">
                    <Filter className="w-4 h-4 text-[#bbb]" />
                    <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-[#999]">Filter::</span>
                </div>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => updateParams('category', cat)}
                        className={`px-8 py-3 border-2 font-mono text-[10px] font-bold tracking-widest uppercase transition-all ${filter === cat ? 'bg-[var(--ink)] text-[var(--acid)] border-[var(--ink)]' : 'bg-transparent border-[var(--ink)] text-[var(--ink)] hover:bg-[var(--paper2)]'}`}
                    >
                        {CAT_LABELS[cat]}
                    </button>
                ))}
            </div>

            {/* GRID */}
            {initialPlatforms.length === 0 ? (
                <div className="py-20 text-center">
                    <p className="font-mono text-[11px] text-[#888] tracking-widest uppercase">No platforms found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border-l-2 border-t-2 border-[var(--ink)]">
                    <AnimatePresence>
                        {initialPlatforms.map((platform) => (
                            <motion.div
                                layout
                                key={platform.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-10 border-r-2 border-b-2 border-[var(--ink)] group bg-[var(--paper)] transition-all hover:bg-[var(--paper2)] flex flex-col justify-between aspect-square"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-14 h-14 border-2 border-[var(--ink)] flex items-center justify-center bg-[var(--paper)] group-hover:bg-[var(--acid)] transition-colors">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className={`px-3 py-1 border-2 border-[var(--ink)] font-mono text-[8px] font-bold uppercase tracking-widest ${platform.tier === 1 ? 'bg-[var(--rust)] text-white' : 'bg-[var(--paper2)]'}`}>
                                            {IMPACT[platform.tier] ?? 'Low'} IMPACT
                                        </div>
                                        <div className="flex items-center gap-1.5 text-emerald-600 font-mono text-[8px] font-bold uppercase tracking-widest">
                                            <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <span className="font-mono text-[9px] text-[#999] uppercase tracking-widest block mb-1">{CAT_LABELS[platform.category] ?? platform.category}</span>
                                    <h3 className="font-display text-[42px] leading-tight tracking-widest uppercase italic group-hover:text-[var(--rust)] transition-colors line-clamp-2">{platform.name}</h3>
                                    <div className="mt-6 flex items-center justify-between opacity-40 group-hover:opacity-100 transition-opacity">
                                        <span className="font-mono text-[10px] tracking-widest font-bold uppercase truncate max-w-[150px]">{platform.website}</span>
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* FOOTER CTA */}
            <div className="border-2 border-dashed border-[var(--ink)] p-16 flex flex-col items-center justify-center text-center bg-[var(--paper2)]/30">
                <Zap className="w-10 h-10 text-[var(--ink)] mb-6" />
                <h3 className="font-display text-4xl tracking-widest mb-4">MISSING A DIRECTORY?</h3>
                <p className="font-mono text-[11px] text-[#888] tracking-widest uppercase mb-8 max-w-sm">We are constantly expanding the nexus. Request a new platform for our engineers to map and automate.</p>
                <button className="px-8 py-4 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)] font-mono text-[11px] tracking-widest uppercase hover:bg-[#222] transition-colors">
                    SUGGEST_NEW_PLATFORM
                </button>
            </div>
        </div>
    );
}
