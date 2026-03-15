import { Nav } from '@/components/nav';
import Link from 'next/link';

export default function PlatformsPage() {
    const tiers = [
        {
            id: 'tier1',
            name: 'Tier 1 — Starter',
            count: 19,
            description: 'The essentials. High-traffic launch sites and major communities for immediate visibility.',
            platforms: [
                { name: 'Product Hunt', type: 'guided', value: 'Traffic ⭐⭐⭐⭐⭐', cat: 'Launch' },
                { name: 'Uneed', type: 'auto', value: 'Traffic ⭐⭐⭐⭐', cat: 'Launch' },
                { name: 'DevHunt', type: 'auto', value: 'Traffic ⭐⭐⭐⭐', cat: 'Launch' },
                { name: 'BetaList', type: 'auto', value: 'Traffic ⭐⭐⭐⭐', cat: 'Launch' },
                { name: 'Microlaunch', type: 'auto', value: 'Traffic ⭐⭐⭐', cat: 'Launch' },
                { name: 'Peerlist', type: 'assisted', value: 'Traffic ⭐⭐⭐', cat: 'Launch' },
                { name: 'Indie Hackers', type: 'guided', value: 'Traffic ⭐⭐⭐⭐', cat: 'Community' },
                { name: 'Hacker News', type: 'guided', value: 'Traffic ⭐⭐⭐⭐⭐', cat: 'Community' },
                { name: 'SideProjectors', type: 'auto', value: 'SEO ⭐⭐⭐', cat: 'Launch' },
            ]
        },
        {
            id: 'tier2',
            name: 'Tier 2 — Launch',
            count: 30,
            description: 'AI directories and major SaaS catalogs. Essential for long-term SEO and discovery.',
            platforms: [
                { name: "There's an AI for That", type: 'auto', value: 'DR 72 ⭐⭐⭐⭐⭐', cat: 'AI' },
                { name: 'Futurepedia', type: 'auto', value: 'DR 68 ⭐⭐⭐⭐⭐', cat: 'AI' },
                { name: 'Toolify', type: 'auto', value: 'DR 52 ⭐⭐⭐⭐', cat: 'AI' },
                { name: 'SaaSHub', type: 'auto', value: 'DR 78 ⭐⭐⭐⭐⭐', cat: 'SaaS' },
                { name: 'AlternativeTo', type: 'guided', value: 'DR 80 ⭐⭐⭐⭐⭐', cat: 'SaaS' },
                { name: 'G2', type: 'guided', value: 'DR 91 ⭐⭐⭐⭐⭐', cat: 'SaaS' },
                { name: 'Capterra', type: 'guided', value: 'DR 90 ⭐⭐⭐⭐⭐', cat: 'SaaS' },
                { name: 'Startup Stash', type: 'auto', value: 'DR 55 ⭐⭐⭐⭐', cat: 'SaaS' },
            ]
        },
        {
            id: 'tier3',
            name: 'Tier 3 — Pro',
            count: 50,
            description: 'Communities, niche directories, and newsletter submissions for maximum coverage.',
            platforms: [
                { name: 'r/sideproject', type: 'guided', value: 'Targeted', cat: 'Reddit' },
                { name: 'r/saas', type: 'guided', value: 'Targeted', cat: 'Reddit' },
                { name: 'Dev.to', type: 'guided', value: 'Developers', cat: 'Community' },
                { name: "Ben's Bites", type: 'guided', value: 'AI Alpha', cat: 'Newsletter' },
                { name: 'AppSumo', type: 'guided', value: 'LTD Sales', cat: 'Deals' },
                { name: '300AI Directories', type: 'auto', value: 'Bulk SEO', cat: 'Directory' },
                { name: 'KillerStartups', type: 'auto', value: 'Heritage', cat: 'Startup' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
            <Nav />

            {/* HERO */}
            <section className="p-10 lg:p-20 border-b-2 border-[var(--ink)]">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[2px] uppercase text-[var(--blue)] mb-8 before:content-[''] before:block before:w-6 before:h-[2px] before:bg-[var(--blue)]">
                        Platform Registry
                    </div>
                    <h1 className="font-display text-[clamp(60px,10vw,140px)] leading-[0.85] mb-10">
                        99+ SITES.<br />ONE <span className="text-[var(--acid-dark)]">COMMAND.</span>
                    </h1>
                    <p className="font-body text-xl text-[#555] leading-relaxed max-w-2xl ml-2">
                        We've mapped the entire startup ecosystem. From high-traffic launch pads like Product Hunt to deep SEO directories and niche AI catalogs. No more manual form filling.
                    </p>
                </div>
            </section>

            {/* LEGEND / STATS */}
            <section className="grid md:grid-cols-4 border-b-2 border-[var(--ink)] bg-[var(--paper2)]">
                {[
                    { label: 'TOTAL PLATFORMS', val: '99+' },
                    { label: 'AUTO-SUBMISSION', val: '55+' },
                    { label: 'GUIDED SUBMISSION', val: '32+' },
                    { label: 'TOTAL REACH', val: '2M+' },
                ].map((stat, i) => (
                    <div key={i} className="p-8 border-r-2 last:border-r-0 border-[var(--ink)]">
                        <div className="font-display text-5xl mb-1">{stat.val}</div>
                        <div className="font-mono text-[10px] tracking-widest text-[#888] uppercase">{stat.label}</div>
                    </div>
                ))}
            </section>

            {/* WHY GUIDED SECTION */}
            <section className="grid lg:grid-cols-2 border-b-2 border-[var(--ink)]">
                <div className="p-12 lg:p-20 border-r-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]">
                    <h2 className="font-display text-6xl tracking-widest mb-8 text-[var(--acid)]">THE GUIDED PROTOCOL.</h2>
                    <p className="font-mono text-sm leading-relaxed text-white/60 mb-8 lowercase">
                        Platforms like Product Hunt, Reddit, and G2 have strict community rules that prohibit automated submissions. We respect these rules — and honestly, a human-submitted listing performs better anyway.
                    </p>
                    <div className="space-y-4">
                        {['AI writes your custom copy', 'We provide step-by-step instructions', 'One-click copy/paste assistance', 'Manual verification for quality'].map((step, i) => (
                            <div key={i} className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-widest">
                                <span className="w-2 h-2 bg-[var(--acid)]" /> {step}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-12 lg:p-20 flex flex-col justify-center gap-12">
                    <div className="grid grid-cols-2 gap-12">
                        <div>
                            <div className="badge badge-auto mb-4">AUTO</div>
                            <p className="font-mono text-xs text-[#888] leading-normal uppercase">Bot navigates, fills forms, and submits entirely on your behalf while you sleep.</p>
                        </div>
                        <div>
                            <div className="badge badge-blue mb-4">ASSISTED</div>
                            <p className="font-mono text-xs text-[#888] leading-normal uppercase">Bot fills everything; you just review and hit the final "Submit" button.</p>
                        </div>
                    </div>
                    <div>
                        <div className="badge badge-rust mb-4">GUIDED</div>
                        <p className="font-mono text-xs text-[#888] leading-normal uppercase tracking-tight">System provides copy + live instructions. You submit manually to comply with platform strict policies.</p>
                    </div>
                </div>
            </section>

            {/* TIERS & PLATFORMS */}
            {tiers.map((tier) => (
                <section key={tier.id} className="border-b-2 border-[var(--ink)]">
                    <div className="p-10 lg:px-20 py-16 border-b-2 border-[var(--ink)] flex flex-col md:flex-row items-baseline justify-between gap-8">
                        <div>
                            <h2 className="font-display text-7xl tracking-widest uppercase mb-2">{tier.name}</h2>
                            <p className="font-mono text-xs text-[#888] uppercase tracking-widest">{tier.count} PLATFORMS INCLUDED</p>
                        </div>
                        <p className="font-body text-lg text-[#666] max-w-sm">{tier.description}</p>
                    </div>

                    <div className="grid border-[var(--ink)]">
                        <div className="hidden md:grid grid-cols-[1fr_120px_180px_100px] border-b-2 border-[var(--ink)] bg-[var(--paper3)]">
                            <div className="p-4 px-10 font-mono text-[10px] tracking-widest uppercase text-[#888]">Platform Name</div>
                            <div className="p-4 font-mono text-[10px] tracking-widest uppercase text-[#888]">Type</div>
                            <div className="p-4 font-mono text-[10px] tracking-widest uppercase text-[#888]">Strength / Reach</div>
                            <div className="p-4 font-mono text-[10px] tracking-widest uppercase text-[#888]">Cat</div>
                        </div>

                        {tier.platforms.map((plt, i) => (
                            <div key={i} className="grid md:grid-cols-[1fr_120px_180px_100px] border-b-2 last:border-b-0 border-[var(--ink)] hover:bg-[var(--paper2)] transition-colors group">
                                <div className="p-6 md:p-4 px-10 font-bold text-lg md:text-sm tracking-tight flex items-center justify-between md:block">
                                    {plt.name}
                                    <span className="md:hidden badge badge-auto text-[8px]">{plt.type}</span>
                                </div>
                                <div className="hidden md:flex items-center p-4">
                                    <div className={`badge ${plt.type === 'auto' ? 'badge-auto' : plt.type === 'guided' ? 'badge-rust' : 'badge-blue'}`}>
                                        {plt.type}
                                    </div>
                                </div>
                                <div className="p-6 md:p-4 font-mono text-[12px] md:text-[10px] text-[var(--ink)] flex items-center bg-[var(--paper2)] md:bg-transparent border-y-2 md:border-0 border-[var(--ink)] md:border-none">
                                    {plt.value}
                                </div>
                                <div className="p-6 md:p-4 font-mono text-[11px] md:text-[9px] text-[#888] uppercase tracking-widest flex items-center">
                                    {plt.cat}
                                </div>
                            </div>
                        ))}

                        <div className="p-10 text-center bg-[var(--paper3)]">
                            <p className="font-mono text-[10px] text-[#888] uppercase tracking-[3px] mb-6">...AND {tier.count - tier.platforms.length} MORE IN THIS TIER</p>
                            <Link href="/login" className="btn px-10 py-4 text-base">VIEW FULL LIST →</Link>
                        </div>
                    </div>
                </section>
            ))}

            {/* FINAL CTA */}
            <section className="bg-[var(--rust)] p-12 lg:p-24 text-center">
                <h2 className="font-display text-7xl lg:text-9xl text-white tracking-widest leading-none mb-10">
                    READY TO<br /><span className="text-[var(--paper)] opacity-50">DEPLOY?</span>
                </h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <Link href="/login" className="btn-big bg-white text-[var(--rust)] border-white">SIGN UP NOW</Link>
                    <Link href="/pricing" className="btn-outline border-white/30 text-white hover:border-white">VIEW PRICING</Link>
                </div>
            </section>

            <footer className="p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-[var(--ink)]">
                <div className="font-display text-2xl tracking-widest">LAUNCHFLOW</div>
                <div className="font-mono text-[10px] text-[#aaa] uppercase tracking-widest">Built for vibecoders — 2025</div>
                <div className="flex gap-8">
                    {[['Twitter', '#'], ['GitHub', '#'], ['Terms', '/legal']].map(([link, href]) => (
                        <Link key={link} href={href} className="font-mono text-[11px] text-[#aaa] hover:text-[var(--ink)] transition-colors uppercase tracking-widest">{link}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
