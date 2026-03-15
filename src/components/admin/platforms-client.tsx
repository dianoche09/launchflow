'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface Platform {
    id: string;
    name: string;
    category: string;
    automation_type: string;
    tier: number;
    is_active: boolean;
    success_rate: number | null;
}

interface AdminPlatformsClientProps {
    initialPlatforms: Platform[];
}

export function AdminPlatformsClient({ initialPlatforms }: AdminPlatformsClientProps) {
    const [platforms, setPlatforms] = useState<Platform[]>(initialPlatforms);
    const [toggling, setToggling] = useState<string | null>(null);

    const togglePlatform = async (id: string, current: boolean) => {
        setToggling(id);
        const res = await fetch(`/api/admin/platforms/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: !current }),
        });
        if (res.ok) {
            const updated = await res.json();
            setPlatforms((prev) => prev.map((p) => p.id === id ? { ...p, is_active: updated.is_active } : p));
        }
        setToggling(null);
    };

    return (
        <div className="pb-12">
            <header className="px-8 pt-7 pb-6 flex items-end justify-between gap-4 mb-6">
                <div>
                    <h1 className="font-display text-[44px] tracking-widest leading-[0.9] uppercase">PLATFORM MANAGER</h1>
                    <p className="font-mono text-[11px] text-[#888] tracking-widest mt-1.5 uppercase">{platforms.length} platforms — enable, disable, configure.</p>
                </div>
            </header>

            <section className="mx-8 border-2 border-[var(--ink)] bg-[var(--paper)]">
                <div className="border-b-2 border-[var(--ink)] p-3 px-5 flex items-center justify-between">
                    <h2 className="font-display text-[20px] tracking-widest uppercase">ALL PLATFORMS</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                {['Platform', 'Category', 'Automation', 'Tier', 'Status', 'Success Rate', 'Toggle'].map((h) => (
                                    <th key={h} className="font-mono text-[9px] tracking-[1.5px] uppercase text-[#999] p-[9px] px-5 text-left bg-[var(--paper3)] border-b border-[var(--paper3)]">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {platforms.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-10 text-center font-mono text-[11px] text-[#888] tracking-widest">
                                        No platforms found.
                                    </td>
                                </tr>
                            ) : (
                                platforms.map((p) => (
                                    <tr key={p.id} className="hover:bg-[var(--paper2)] group transition-colors">
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-semibold text-[13px]">{p.name}</td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-mono text-[10px] text-[#888]">{p.category}</td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)]">
                                            <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border-[1.5px] ${p.automation_type === 'auto' ? 'bg-[var(--acid-dim)] text-[var(--acid-dark)] border-[var(--acid-dark)]' : 'bg-[var(--blue-dim)] text-[var(--blue)] border-[var(--blue)]'}`}>
                                                {p.automation_type}
                                            </span>
                                        </td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-mono text-[11px]">Tier {p.tier}</td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)]">
                                            <span className={`font-mono text-[9px] tracking-widest uppercase px-2 py-1 border-[1.5px] ${p.is_active ? 'bg-[var(--green-dim)] text-[var(--green)] border-[var(--green)]' : 'bg-[var(--paper3)] text-[#888] border-[#ccc]'}`}>
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)] font-mono text-[12px]">
                                            {p.success_rate !== null ? `${p.success_rate}%` : '—'}
                                        </td>
                                        <td className="p-[11px] px-5 border-b border-[var(--paper3)]">
                                            {toggling === p.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-[#888]" />
                                            ) : (
                                                <div className="flex border-[1.5px] border-[var(--ink)] w-fit overflow-hidden">
                                                    <button
                                                        onClick={() => !p.is_active && togglePlatform(p.id, p.is_active)}
                                                        className={`px-3 py-1.5 font-mono text-[10px] tracking-widest transition-all ${p.is_active ? 'bg-[var(--ink)] text-[var(--acid)]' : 'bg-transparent text-[#888] hover:bg-[var(--paper2)]'}`}
                                                    >ON</button>
                                                    <button
                                                        onClick={() => p.is_active && togglePlatform(p.id, p.is_active)}
                                                        className={`px-3 py-1.5 font-mono text-[10px] tracking-widest border-l-[1.5px] border-[var(--ink)] transition-all ${!p.is_active ? 'bg-[var(--ink)] text-[var(--acid)]' : 'bg-transparent text-[#888] hover:bg-[var(--paper2)]'}`}
                                                    >OFF</button>
                                                </div>
                                            )}
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
