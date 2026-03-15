'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Settings,
    Database,
    Rocket,
    BarChart3,
    History,
    MessageSquare,
    LogOut,
    Bell,
} from 'lucide-react';
import { signOut } from '@/actions/auth';

interface DashboardShellProps {
    children: React.ReactNode;
    profile: {
        full_name: string | null;
        credits: number;
    } | null;
    projectCount: number;
}

export function DashboardShell({ children, profile, projectCount }: DashboardShellProps) {
    const pathname = usePathname();

    const initials = profile?.full_name
        ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?';

    const displayName = profile?.full_name?.split(' ')[0] ?? '—';

    const mainLinks = [
        { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
        { label: 'Projects', href: '/dashboard/projects', icon: Database, badge: projectCount > 0 ? String(projectCount) : undefined },
        { label: 'Launch Status', href: '/dashboard/launch', icon: Rocket },
        { label: 'AI Launch Kit', href: '/dashboard/kit', icon: MessageSquare },
    ];

    const analyticsLinks = [
        { label: 'Traffic & Backlinks', href: '/dashboard/analytics', icon: BarChart3 },
        { label: 'All Submissions', href: '/dashboard/submissions', icon: History },
    ];

    const accountLinks = [
        { label: 'Plan & Billing', href: '/dashboard/plan', icon: Rocket },
        { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <div className="h-screen flex flex-col font-body bg-[var(--paper)] text-[var(--ink)] overflow-hidden selection:bg-[var(--acid)] selection:text-[var(--ink)]">
            {/* TOPBAR */}
            <header className="h-[52px] border-b-2 border-[var(--ink)] flex items-stretch bg-[var(--paper)] z-[100] shrink-0">
                <Link href="/" className="font-display text-[24px] tracking-widest leading-[52px] px-5 border-r-2 border-[var(--ink)] no-underline text-inherit whitespace-nowrap">
                    LAUNCHFLOW
                </Link>
                <div className="flex items-center px-5 gap-2.5 border-r-2 border-[var(--ink)] font-mono text-[11px] text-[#888] tracking-widest">
                    <span>Dashboard</span>
                    <span className="text-[var(--paper3)]">/</span>
                    <span className="text-[var(--ink)] capitalize">
                        {pathname === '/dashboard' ? 'Overview' : pathname.split('/').pop()?.replace('-', ' ')}
                    </span>
                </div>

                <div className="ml-auto flex items-stretch">
                    <div className="hidden sm:flex items-center px-5 border-l-2 border-[var(--ink)] gap-2.5 font-mono text-[11px] text-[#888]">
                        <span>Credits</span>
                        <span className="bg-[var(--ink)] text-[var(--acid)] px-2 py-0.5 text-[10px] tracking-widest uppercase">
                            {profile?.credits ?? '—'}
                        </span>
                    </div>
                    <div className="flex items-center px-4 border-l-2 border-[var(--ink)] cursor-pointer hover:bg-[var(--paper2)] transition-colors relative">
                        <Bell className="w-4 h-4" />
                        <div className="absolute top-2.5 right-3 w-1.5 h-1.5 rounded-full bg-[var(--rust)]"></div>
                    </div>
                    <div className="flex items-center px-5 border-l-2 border-[var(--ink)] gap-2.5 cursor-pointer hover:bg-[var(--paper2)] transition-colors">
                        <div className="w-7 h-7 rounded-full bg-[var(--ink)] flex items-center justify-center font-display text-[13px] text-[var(--acid)] shrink-0 uppercase">{initials}</div>
                        <span className="hidden sm:inline font-mono text-[11px] tracking-widest">{displayName}</span>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* SIDEBAR */}
                <aside className="w-[220px] border-r-2 border-[var(--ink)] bg-[var(--paper)] flex flex-col overflow-y-auto shrink-0 scrollbar-none">
                    <div className="border-b border-[var(--paper3)] py-2">
                        <div className="font-mono text-[9px] tracking-[2px] uppercase text-[#bbb] px-5 py-2">MAIN</div>
                        {mainLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2.5 px-5 py-2.5 cursor-pointer font-mono text-[11px] tracking-widest text-[#666] transition-all border-l-[3px] ${isActive ? 'bg-[var(--acid-dim)] text-[var(--ink)] border-l-[var(--acid-dark)] font-medium' : 'border-l-transparent hover:bg-[var(--paper2)] hover:text-[var(--ink)]'}`}
                                >
                                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                                    {link.label}
                                    {link.badge && <span className="ml-auto bg-[var(--rust)] text-white text-[9px] px-1.5 py-0.5 min-w-[16px] text-center">{link.badge}</span>}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="border-b border-[var(--paper3)] py-2">
                        <div className="font-mono text-[9px] tracking-[2px] uppercase text-[#bbb] px-5 py-2">ANALYTICS</div>
                        {analyticsLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2.5 px-5 py-2.5 cursor-pointer font-mono text-[11px] tracking-widest text-[#666] transition-all border-l-[3px] ${isActive ? 'bg-[var(--acid-dim)] text-[var(--ink)] border-l-[var(--acid-dark)] font-medium' : 'border-l-transparent hover:bg-[var(--paper2)] hover:text-[var(--ink)]'}`}
                                >
                                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="border-b border-[var(--paper3)] py-2">
                        <div className="font-mono text-[9px] tracking-[2px] uppercase text-[#bbb] px-5 py-2">ACCOUNT</div>
                        {accountLinks.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center gap-2.5 px-5 py-2.5 cursor-pointer font-mono text-[11px] tracking-widest text-[#666] transition-all border-l-[3px] ${isActive ? 'bg-[var(--acid-dim)] text-[var(--ink)] border-l-[var(--acid-dark)] font-medium' : 'border-l-transparent hover:bg-[var(--paper2)] hover:text-[var(--ink)]'}`}
                                >
                                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="mt-auto border-t border-[var(--paper3)] py-2">
                        <form action={signOut}>
                            <button
                                type="submit"
                                className="w-full flex items-center gap-2.5 px-5 py-2.5 cursor-pointer font-mono text-[11px] tracking-widest text-[#666] transition-all border-l-[3px] border-l-transparent hover:bg-[var(--paper2)] hover:text-[var(--rust)]"
                            >
                                <LogOut className="w-3.5 h-3.5 shrink-0 opacity-60" />
                                Sign out
                            </button>
                        </form>
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
