'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    Users,
    Rocket,
    MessageSquare,
    Activity,
    Settings as SettingsIcon,
    Terminal,
    Share2,
    Database,
    Search,
    LogOut,
    Bell
} from 'lucide-react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const links = [
        {
            section: 'Overview', items: [
                { label: 'Overview', href: '/admin', icon: BarChart3 },
                { label: 'Revenue & MRR', href: '/admin/revenue', icon: Activity },
            ]
        },
        {
            section: 'Users', items: [
                { label: 'All Users', href: '/admin/users', icon: Users, badge: '248', ok: true },
                { label: 'Plans & Subscriptions', href: '/admin/plans', icon: Rocket },
            ]
        },
        {
            section: 'Launch Engine', items: [
                { label: 'All Launches', href: '/admin/launches', icon: Share2, badge: '12', warn: true },
                { label: 'Platform Manager', href: '/admin/platforms', icon: Database },
                { label: 'Bot Status', href: '/admin/bots', icon: Terminal, badge: '2' },
            ]
        },
        {
            section: 'Content', items: [
                { label: 'Blog & Changelog', href: '/admin/blog', icon: MessageSquare },
                { label: 'Social Media', href: '/admin/social', icon: Share2 },
                { label: 'SEO & Links', href: '/admin/seo', icon: Search },
            ]
        },
        {
            section: 'System', items: [
                { label: 'System Settings', href: '/admin/settings', icon: SettingsIcon },
                { label: 'API & Integrations', href: '/admin/api', icon: Database },
                { label: 'System Logs', href: '/admin/logs', icon: Terminal },
            ]
        },
    ];

    return (
        <div className="h-screen flex flex-col font-body bg-[var(--paper)] text-[var(--ink)] overflow-hidden selection:bg-[var(--acid)] selection:text-[var(--ink)] text-sm">

            {/* TOPBAR */}
            <header className="h-[52px] border-b-2 border-[var(--ink)] flex items-stretch bg-[var(--ink)] z-[100] shrink-0">
                <Link href="/" className="font-display text-[24px] tracking-widest leading-[52px] px-5 border-r-2 border-white/10 no-underline text-[var(--acid)] whitespace-nowrap">
                    LAUNCHFLOW
                </Link>
                <div className="flex items-center px-5 gap-5 border-r-2 border-white/10 font-mono text-[10px] text-white/40 tracking-widest uppercase">
                    <span className="bg-[var(--blue)] text-white px-2 py-0.5 text-[9px] tracking-widest">ADMIN</span>
                    <span className="hidden sm:inline">CONTROL PANEL</span>
                </div>
                <div className="hidden md:flex items-center px-5 gap-2.5 font-mono text-[11px] text-white/40 tracking-widest">
                    <span>Admin</span>
                    <span className="text-white/20">/</span>
                    <span className="text-white/80 capitalize">
                        {pathname === '/admin' ? 'Overview' : pathname.split('/').pop()?.replace('-', ' ')}
                    </span>
                </div>

                <div className="ml-auto flex items-stretch">
                    <div className="flex items-center px-5 border-l-2 border-white/10 gap-2 font-mono text-[11px] text-[var(--rust)] cursor-pointer hover:bg-white/5">
                        <Bell className="w-3.5 h-3.5" />
                        <span className="bg-[var(--rust)] text-white text-[9px] px-1.5 py-0.5">3</span>
                    </div>
                    <div className="flex items-center px-5 border-l-2 border-white/10 gap-2.5 cursor-pointer hover:bg-white/5 transition-colors">
                        <div className="w-7 h-7 rounded-full bg-[var(--blue)] flex items-center justify-center font-display text-[13px] text-white shrink-0 uppercase">A</div>
                        <div className="hidden sm:block">
                            <div className="font-mono text-[11px] text-white/70 leading-none mb-1">Admin</div>
                            <div className="font-mono text-[9px] text-white/30 tracking-widest uppercase">superadmin</div>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* SIDEBAR */}
                <aside className="w-[240px] border-r-2 border-[var(--ink)] bg-[var(--paper)] flex flex-col overflow-y-auto shrink-0 scrollbar-none">
                    {links.map((section, idx) => (
                        <div key={idx} className="border-b border-[var(--paper3)] py-1.5">
                            <div className="font-mono text-[9px] tracking-[2px] uppercase text-[#bbb] px-5 py-2">{section.section}</div>
                            {section.items.map((item: any) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-2.5 px-5 py-2 cursor-pointer font-mono text-[11px] tracking-widest text-[#666] transition-all border-l-[3px] ${isActive
                                            ? 'bg-[var(--blue-dim)] text-[var(--blue)] border-l-[var(--blue)]'
                                            : 'border-l-transparent hover:bg-[var(--paper2)] hover:text-[var(--ink)]'
                                            }`}
                                    >
                                        <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                                        {item.label}
                                        {item.badge && (
                                            <span className={`ml-auto text-white text-[9px] px-1.5 py-0.5 min-w-[16px] text-center ${item.ok ? 'bg-[var(--green)]' : (item.warn ? 'bg-[var(--rust)]' : 'bg-gray-400')}`}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}

                    <div className="mt-auto border-t border-[var(--paper3)] py-1.5">
                        <Link href="/dashboard" className="flex items-center gap-2.5 px-5 py-2 cursor-pointer font-mono text-[11px] tracking-widest text-[#666] transition-all border-l-[3px] border-l-transparent hover:bg-[var(--paper2)] hover:text-[var(--ink)]">
                            <LogOut className="w-3.5 h-3.5 shrink-0 opacity-60" />
                            User view
                        </Link>
                    </div>
                </aside>

                {/* MAIN */}
                <main className="flex-1 overflow-y-auto bg-[var(--paper2)]">
                    {children}
                </main>
            </div>

            <style jsx>{`
                .scrollbar-none::-webkit-scrollbar { width: 0; }
            `}</style>
        </div>
    );
}
