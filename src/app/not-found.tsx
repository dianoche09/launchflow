import Link from 'next/link';
import { Nav } from '@/components/nav';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--paper)]">
            <Nav />

            <main className="flex-1 grid md:grid-cols-2 border-b-2 border-[var(--ink)]">
                <div className="bg-[var(--ink)] p-10 lg:p-20 flex flex-col justify-between border-r-2 border-[var(--ink)]">
                    <div className="font-display text-[clamp(120px,20vw,240px)] leading-[0.8] tracking-tighter text-white/5 pointer-events-none select-none">
                        404
                    </div>

                    <div>
                        <h1 className="font-display text-6xl lg:text-8xl text-[var(--paper)] leading-[0.9] mb-6">
                            PAGE<br />NOT<br /><span className="text-[var(--acid)]">FOUND.</span>
                        </h1>
                        <p className="font-body text-[var(--paper)]/50 text-lg max-w-sm mb-10">
                            This page doesn&apos;t exist. But your next launch does. Let&apos;s get back to building.
                        </p>
                        <Link href="/" className="btn-big">
                            GO HOME →
                        </Link>
                    </div>
                </div>

                <div className="p-10 lg:p-20 flex flex-col justify-between bg-[var(--paper)]">
                    <div>
                        <div className="font-mono text-[10px] tracking-[2px] uppercase text-[#888] mb-10">
                            Or go somewhere useful
                        </div>

                        <div className="flex flex-col">
                            {[
                                { label: 'HOME', desc: 'Back to the main page', href: '/' },
                                { label: 'DEMO', desc: 'Try the launch demo', href: '/demo' },
                                { label: 'PRICING', desc: '$9 per launch, no subscription', href: '/pricing' },
                                { label: 'PLATFORMS', desc: '99+ platforms we submit to', href: '/platforms' },
                                { label: 'DASHBOARD', desc: 'Sign in to your account', href: '/dashboard' },
                            ].map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="group flex items-center justify-between py-6 border-b-2 border-[var(--ink)] transition-all hover:pl-4"
                                >
                                    <div>
                                        <div className="font-display text-3xl tracking-wide">{link.label}</div>
                                        <div className="font-mono text-[11px] text-[#888]">{link.desc}</div>
                                    </div>
                                    <span className="font-mono text-2xl text-[#bbb] group-hover:text-[var(--ink)] group-hover:translate-x-2 transition-all">
                                        →
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="mt-20 p-8 border-2 border-[var(--ink)] bg-[var(--paper2)]">
                        <div className="font-mono text-[10px] tracking-[1.5px] uppercase text-[#888] mb-2">Lost?</div>
                        <p className="font-body text-sm text-[#666] leading-relaxed">
                            If you think this is a bug, email us at <strong className="text-[var(--ink)]">hello@launchflow.io</strong> and we&apos;ll fix it.
                        </p>
                    </div>
                </div>
            </main>

            <footer className="p-10 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
                <div className="font-display text-2xl tracking-widest">LAUNCHFLOW</div>
                <div className="font-mono text-[10px] text-[#aaa] uppercase tracking-widest">
                    Built for vibecoders — 2025
                </div>
            </footer>
        </div>
    );
}
