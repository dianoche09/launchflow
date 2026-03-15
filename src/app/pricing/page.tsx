import Link from 'next/link';
import { Nav } from '@/components/nav';

export default function PricingPage() {
    const packages = [
        {
            name: 'Starter',
            price: '$9',
            period: 'one-time · per launch',
            tier: 'TIER 1 ONLY — TOP LAUNCH SITES',
            features: [
                '19 platforms',
                'Product Hunt, Uneed, DevHunt, BetaList + 15 more',
                'Basic AI launch kit',
                'Submission dashboard',
                'Launch report',
                'Guided where required',
            ],
            featured: false,
            cta: 'GET STARTER',
        },
        {
            name: 'Full Launch',
            price: '$19',
            period: 'one-time · per launch',
            tier: 'TIER 1 + 2 — LAUNCH + DIRECTORIES',
            features: [
                '49 platforms',
                'All Tier 1 + AI directories',
                'SaaS directories incl. G2, Capterra',
                'Full AI launch kit',
                'Smart queue + live tracking',
                'Launch report PDF',
            ],
            featured: true,
            cta: 'GET FULL LAUNCH',
        },
        {
            name: 'Launch Pro',
            price: '$29',
            period: 'one-time · per launch',
            tier: 'TIER 1 + 2 + 3 — MAXIMUM COVERAGE',
            features: [
                '99+ platforms',
                'All Tier 1 + 2 + communities',
                'Reddit copy for 5 subreddits',
                'HN + Dev.to guided submit',
                'Deal platforms (AppSumo etc.)',
                'Priority queue',
            ],
            featured: false,
            cta: 'GET LAUNCH PRO',
        },
        {
            name: 'Agency / Team',
            price: 'TALK',
            period: 'custom pricing',
            tier: 'ENTERPRISE SOLUTION',
            features: [
                'Unlimited launches',
                'Team access (up to 10)',
                'White-label reports',
                'API access',
                'Dedicated support',
                'Custom platform list',
            ],
            featured: false,
            cta: 'CONTACT US',
            isAgency: true
        },
    ];

    const creditPacks = [
        { name: 'Starter Pack', price: '$9', credits: '19 credits', unit: '$0.47 per platform', value: '~1 starter launch', desc: 'Submit one project to 19 Tier 1 platforms. Credits roll over — use them whenever you\'re ready.' },
        { name: 'Growth Pack', price: '$19', credits: '49 credits', unit: '$0.39 per platform', value: '1 full launch', desc: 'Submit one project to all 49 Tier 1 + 2 platforms. Or spread across multiple smaller launches.', featured: true },
        { name: 'Builder Pack', price: '$39', credits: '120 credits', unit: '$0.33 per platform', value: '2–3 launches', desc: 'Serial shipper? Launch 2–3 projects fully or mix and match tiers across many small launches.' },
    ];

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
            <Nav />

            {/* HERO */}
            <section className="grid md:grid-cols-2 border-b-2 border-[var(--ink)]">
                <div className="p-10 lg:p-16 border-r-2 border-[var(--ink)] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[2px] uppercase text-[var(--rust)] mb-8 before:content-[''] before:block before:w-6 before:h-[2px] before:bg-[var(--rust)]">
                            Pricing
                        </div>
                        <h1 className="font-display text-[clamp(72px,9vw,120px)] leading-[0.88] mb-8">
                            PAY PER<br /><span className="filled-acid">LAUNCH.</span>
                        </h1>
                        <p className="font-body text-lg text-[#666] leading-relaxed max-w-sm ml-2">
                            No subscriptions. No monthly fees. Pay once per launch and keep everything forever. Or buy credits and use them whenever.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col border-t-2 md:border-t-0 border-[var(--ink)]">
                    {[
                        { tag: 'FREE', label: 'TO START — NO CARD NEEDED', highlight: true },
                        { tag: '80+', label: 'PLATFORMS COVERED' },
                        { tag: '$0', label: 'MONTHLY FEE · EVER' },
                    ].map((stat, i) => (
                        <div key={i} className={`flex-1 flex flex-col justify-end p-8 border-b-2 last:border-b-0 border-[var(--ink)] ${stat.highlight ? 'bg-[var(--acid)]' : ''}`}>
                            <div className={`font-display text-6xl leading-none ${stat.highlight ? 'text-[var(--ink)]' : ''}`}>{stat.tag}</div>
                            <div className={`font-mono text-[10px] tracking-[1.5px] uppercase mt-2 ${stat.highlight ? 'text-[var(--ink)]/60' : 'text-[#888]'}`}>{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FREE ROW */}
            <section className="p-10 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8 border-b-2 border-[var(--ink)] bg-[var(--paper2)]">
                <div>
                    <div className="font-display text-4xl tracking-widest">FREE FOREVER</div>
                    <p className="font-mono text-xs text-[#888] tracking-tight">No credit card required. 3 platforms. Always free.</p>
                </div>
                <div className="flex flex-wrap gap-8">
                    {['3 platform submissions', 'Basic AI launch kit', 'Launch dashboard', 'No expiry'].map((feat, i) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-[11px] text-[#666]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#aaa]" />
                            {feat}
                        </div>
                    ))}
                </div>
                <Link href="/login" className="btn px-8 py-3">START FREE →</Link>
            </section>

            {/* PACKAGES */}
            <section className="border-b-2 border-[var(--ink)]">
                <div className="p-12 border-b-2 border-[var(--ink)] flex flex-col md:flex-row items-baseline justify-between gap-6">
                    <h2 className="font-display text-7xl tracking-widest uppercase">LAUNCH PACKAGES</h2>
                    <p className="font-mono text-xs text-[#888] text-right max-w-[280px] leading-relaxed">
                        One-time payment per launch. No subscriptions. No renewals. Credits never expire.
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4">
                    {packages.map((pkg, i) => (
                        <div key={i} className={`pkg ${pkg.featured ? 'featured' : ''}`}>
                            {pkg.featured && <div className="pkg-popular">Most popular</div>}
                            <div className="pkg-tier">{pkg.name}</div>
                            <div className="pkg-price">{pkg.price}</div>
                            <div className="pkg-period">{pkg.period}</div>
                            <div className="pkg-divider" />
                            <div className="font-mono text-[9px] tracking-widest text-[#888] mb-6 uppercase">
                                {pkg.tier}
                            </div>
                            <div className="pkg-features">
                                {pkg.features.map((feat, j) => (
                                    <div key={j} className="pkg-feat">
                                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 mt-1.5" />
                                        <span className={feat.includes('platforms') ? 'font-bold text-[var(--ink)] featured:text-white' : ''}>{feat}</span>
                                    </div>
                                ))}
                            </div>
                            <Link href="/login" className={`pricing-btn mt-8 ${pkg.isAgency ? 'bg-[var(--paper2)]' : ''}`}>
                                {pkg.cta}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* CREDITS */}
            <section className="border-b-2 border-[var(--ink)]">
                <div className="p-12 border-b-2 border-[var(--ink)] flex flex-col md:flex-row items-baseline justify-between gap-6">
                    <h2 className="font-display text-7xl tracking-widest uppercase">CREDIT PACKS</h2>
                    <p className="font-mono text-xs text-[#888] text-right max-w-[300px] leading-relaxed">
                        Ship multiple projects? Buy credits once, use them whenever. Never expire.
                    </p>
                </div>
                <div className="grid md:grid-cols-3">
                    {creditPacks.map((pack, i) => (
                        <div key={i} className={`credit-pkg ${pack.featured ? 'bg-[var(--ink)] text-white hover:bg-[#111]' : ''}`}>
                            {pack.featured && <div className="pkg-popular">Best value</div>}
                            <div className="cp-name">{pack.name}</div>
                            <div className={`cp-price ${pack.featured ? 'text-[var(--acid)]' : ''}`}>{pack.price}</div>
                            <div className={`font-display text-2xl tracking-widest mb-1 ${pack.featured ? 'text-white/40' : 'text-[#aaa]'}`}>
                                {pack.credits}
                            </div>
                            <div className={`font-mono text-[11px] mb-8 pb-6 border-b-2 ${pack.featured ? 'text-white/20 border-white/10' : 'text-[#999] border-[var(--paper3)]'}`}>
                                {pack.unit}
                            </div>
                            <div className={`font-display text-2xl tracking-widest mb-2 ${pack.featured ? 'text-[var(--acid)]' : ''}`}>
                                {pack.value}
                            </div>
                            <p className={`font-mono text-[11px] leading-relaxed mb-10 flex-1 ${pack.featured ? 'text-white/40' : 'text-[#888]'}`}>
                                {pack.desc}
                            </p>
                            <Link href="/login" className={`btn py-4 text-lg ${pack.featured ? 'bg-[var(--acid)] text-[var(--ink)] border-[var(--acid)] hover:bg-[var(--acid-dark)]' : ''}`}>
                                BUY PACK
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ */}
            <section className="border-b-2 border-[var(--ink)] bg-[var(--paper)]">
                <div className="p-12 border-b-2 border-[var(--ink)]">
                    <h2 className="font-display text-7xl tracking-widest uppercase">FAQ</h2>
                </div>
                <div className="grid md:grid-cols-2">
                    {[
                        { q: 'Difference between packages and credits?', a: 'Packages are fixed bundles for a single launch. Credits are flexible tokens for use across multiple projects. Both use the same pricing structure.' },
                        { q: 'Do credits expire?', a: 'Never. Credits stay in your account until you use them. No pressure to ship immediately.' },
                        { q: 'What if a platform rejects me?', a: 'We retry automatically. Rejections are outside our control, but our approval rate is 70%+. If a bot fails technically, we re-run for free.' },
                        { q: 'How fast does it launch?', a: 'Immediately. Once you click launch, Tier 1 sites go first. Directories follow over 24-48 hours for natural SEO pacing.' },
                    ].map((faq, i) => (
                        <div key={i} className="p-10 border-r-2 last:border-r-0 border-b-2 last:border-b-0 border-[var(--ink)] hover:bg-[var(--paper2)] transition-colors group">
                            <h4 className="font-body font-bold text-lg mb-4 flex justify-between gap-4">
                                {faq.q}
                                <span className="font-mono text-[#aaa] group-hover:text-[var(--ink)]">↓</span>
                            </h4>
                            <p className="text-[#666] leading-relaxed text-sm">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="grid lg:grid-cols-[1fr_400px] border-b-2 border-[var(--ink)]">
                <div className="bg-[var(--ink)] p-12 lg:p-20 border-r-2 border-[var(--ink)]">
                    <h2 className="font-display text-[clamp(56px,7vw,88px)] leading-[0.88] text-[var(--paper)] mb-8">
                        STOP BUILDING<br />INTO <span className="text-[var(--acid)]">SILENCE.</span>
                    </h2>
                    <p className="text-[var(--paper)]/50 text-lg mb-12 max-w-sm">
                        You shipped. Nobody saw it. That ends here. Start free, launch your first 3 platforms with zero commitment.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/login" className="btn-big">START FREE</Link>
                        <Link href="/demo" className="btn-outline border-[var(--paper)]/20 text-[var(--paper)] hover:border-[var(--paper)]/50">TRY DEMO</Link>
                    </div>
                </div>
                <div className="p-12 flex flex-col justify-center gap-6">
                    {['No credit card required', '3 platforms free, forever', 'Pay only when you launch more', 'Credits never expire'].map((note, i) => (
                        <div key={i} className="flex items-center gap-4 font-mono text-[11px] text-[#888]">
                            <span className="w-1 h-1 rounded-full bg-[var(--acid-dark)]" />
                            {note}
                        </div>
                    ))}
                </div>
            </section>

            <footer className="p-10 flex flex-col md:flex-row items-center justify-between gap-6">
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
