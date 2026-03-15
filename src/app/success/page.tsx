import Link from 'next/link';
import { Nav } from '@/components/nav';

export default function SuccessPage() {
    const steps = [
        { num: '01', title: 'AI LAUNCH KIT GENERATED', desc: 'Your taglines, HN pitch, Reddit copy and Twitter thread are ready.' },
        { num: '02', title: 'TIER 1 QUEUE PROCESSING', desc: 'Product Hunt, Uneed, DevHunt, BetaList — bots are running now.' },
        { num: '03', title: 'DIRECTORIES SCHEDULED', desc: 'AI and SaaS directories will be submitted over 24–48h for natural SEO pacing.' },
        { num: '04', title: 'GUIDED TASKS READY', desc: 'Product Hunt and Reddit require manual submit. Your copy is waiting.' },
    ];

    const tips = [
        'Post your launch link on Twitter and tag @launchflow',
        'Engage on Product Hunt within the first 2 hours',
        'Reply to every comment — it signals activity to the algorithm',
        'Schedule 3 Reddit posts for your top subreddits this week',
    ];

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
            <Nav />

            {/* HERO */}
            <section className="grid md:grid-cols-[1fr_480px] border-b-2 border-[var(--ink)]">
                <div className="p-10 lg:p-20 border-r-0 md:border-r-2 border-[var(--ink)] flex flex-col justify-between gap-16">
                    <div>
                        <div className="inline-block bg-[var(--acid)] text-[var(--ink)] font-mono text-[10px] px-3 py-1.5 tracking-widest uppercase mb-10">
                            LAUNCH INITIATED
                        </div>
                        <h1 className="font-display text-[clamp(72px,11vw,160px)] leading-[0.85] mb-8">
                            YOU&apos;RE<br />LIVE.
                        </h1>
                        <p className="font-body text-xl text-[#555] leading-relaxed max-w-md">
                            Your project is being submitted across the network. Sit back — or better, go make some noise on Twitter.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/dashboard" className="btn-big">VIEW DASHBOARD</Link>
                        <Link href="/dashboard/new" className="btn px-8 py-4 text-base">LAUNCH ANOTHER →</Link>
                    </div>
                </div>

                <div className="flex flex-col border-t-2 md:border-t-0 border-[var(--ink)]">
                    <div className="p-8 border-b-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)]">
                        <div className="font-mono text-[10px] tracking-widest uppercase mb-4 text-white/40">LAUNCH STATUS</div>
                        <div className="font-display text-5xl tracking-widest">PROCESSING</div>
                    </div>
                    {[
                        { label: 'PLATFORMS QUEUED', val: '49', color: 'text-[var(--acid-dark)]' },
                        { label: 'AUTO-SUBMIT', val: '31', color: 'text-[var(--ink)]' },
                        { label: 'GUIDED TASKS', val: '18', color: 'text-[var(--rust)]' },
                    ].map((stat, i) => (
                        <div key={i} className="flex items-center justify-between p-8 border-b-2 last:border-b-0 border-[var(--ink)]">
                            <div className="font-mono text-[10px] tracking-widest uppercase text-[#888]">{stat.label}</div>
                            <div className={`font-display text-4xl ${stat.color}`}>{stat.val}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* WHAT HAPPENS NEXT */}
            <section className="border-b-2 border-[var(--ink)]">
                <div className="p-10 lg:px-16 py-14 border-b-2 border-[var(--ink)]">
                    <h2 className="font-display text-6xl tracking-widest">WHAT HAPPENS NOW</h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, i) => (
                        <div key={i} className="p-10 border-r-2 last:border-r-0 border-b-2 md:border-b-0 border-[var(--ink)] hover:bg-[var(--paper2)] transition-colors">
                            <div className="font-display text-[80px] leading-none text-[var(--paper3)] mb-6">{step.num}</div>
                            <h3 className="font-display text-xl tracking-widest mb-4">{step.title}</h3>
                            <p className="font-mono text-[11px] text-[#888] leading-relaxed uppercase tracking-tight">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* TIPS */}
            <section className="grid lg:grid-cols-[1fr_480px] border-b-2 border-[var(--ink)]">
                <div className="p-10 lg:p-16 border-r-0 lg:border-r-2 border-[var(--ink)]">
                    <div className="font-mono text-[11px] tracking-[3px] uppercase text-[var(--rust)] mb-8 flex items-center gap-4">
                        <span className="w-8 h-0.5 bg-[var(--rust)]" /> Launch Day Playbook
                    </div>
                    <h2 className="font-display text-5xl tracking-widest mb-12">DON&apos;T JUST<br />SIT THERE.</h2>
                    <div className="space-y-6">
                        {tips.map((tip, i) => (
                            <div key={i} className="flex gap-6 items-start group">
                                <span className="font-display text-3xl text-[var(--paper3)] group-hover:text-[var(--acid-dark)] transition-colors shrink-0 leading-none mt-1">
                                    {String(i + 1).padStart(2, '0')}
                                </span>
                                <p className="font-body text-lg text-[#555] leading-relaxed">{tip}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-10 lg:p-16 bg-[var(--paper2)] flex flex-col justify-between">
                    <div>
                        <div className="font-mono text-[10px] tracking-[3px] uppercase text-[#999] mb-6">GUIDED TASKS WAITING</div>
                        <div className="space-y-3 mb-10">
                            {['Product Hunt submission', 'r/sideproject post', 'r/saas post', 'Hacker News: Show HN'].map((task, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border-2 border-[var(--ink)] bg-[var(--paper)] hover:bg-[var(--ink)] hover:text-[var(--acid)] transition-all cursor-pointer group">
                                    <span className="w-2 h-2 border-2 border-[var(--ink)] group-hover:border-[var(--acid)] shrink-0" />
                                    <span className="font-mono text-[12px] uppercase tracking-wide">{task}</span>
                                    <span className="ml-auto font-mono text-[#aaa] group-hover:text-[var(--acid)]">→</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Link href="/dashboard" className="btn py-5 text-base w-full justify-center">
                        OPEN FULL DASHBOARD →
                    </Link>
                </div>
            </section>

            {/* SHARE CTA */}
            <section className="bg-[var(--ink)] p-12 lg:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
                <div>
                    <h2 className="font-display text-[clamp(48px,6vw,80px)] text-[var(--paper)] leading-[0.9] mb-4">
                        TELL THE<br /><span className="text-[var(--acid)]">WORLD.</span>
                    </h2>
                    <p className="font-mono text-sm text-white/40 uppercase tracking-wide">Every share amplifies your launch velocity.</p>
                </div>
                <div className="flex flex-col gap-4 min-w-[240px]">
                    <a href="https://twitter.com/intent/tweet?text=Just+launched+with+%40launchflow+%E2%80%94+submitted+to+49%2B+platforms+in+minutes.+%F0%9F%9A%80" target="_blank" rel="noopener noreferrer"
                        className="btn bg-[var(--acid)] border-[var(--acid)] text-[var(--ink)] hover:bg-[var(--acid-dark)] hover:border-[var(--acid-dark)] py-4 text-sm w-full justify-center">
                        SHARE ON TWITTER →
                    </a>
                    <Link href="/dashboard/new" className="btn border-white/20 text-white hover:bg-white hover:text-[var(--ink)] py-4 text-sm w-full justify-center">
                        LAUNCH ANOTHER PROJECT
                    </Link>
                </div>
            </section>

            <footer className="p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-[var(--ink)]">
                <div className="font-display text-2xl tracking-widest">LAUNCHFLOW</div>
                <div className="font-mono text-[10px] text-[#aaa] uppercase tracking-widest">Built for vibecoders — 2025</div>
                <div className="flex gap-8">
                    {[['Dashboard', '/dashboard'], ['Pricing', '/pricing'], ['Platforms', '/platforms']].map(([label, href]) => (
                        <Link key={label} href={href} className="font-mono text-[11px] text-[#aaa] hover:text-[var(--ink)] transition-colors uppercase tracking-widest">{label}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
