import { Nav } from '@/components/nav';
import { getAllChangelogs } from '@/lib/blog/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';

// Custom MDX components for Changelog
const components = {
    h3: (props: any) => <h3 className="font-display text-[32px] leading-[0.9] mt-10 mb-6 uppercase tracking-widest text-[var(--ink)]" {...props} />,
    ul: (props: any) => <ul className="list-none mb-8 space-y-4" {...props} />,
    li: (props: any) => (
        <li className="font-body text-[#444] text-[15px] leading-relaxed flex gap-4 items-start" {...props}>
            <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--ink)]"></span>
            <span>{props.children}</span>
        </li>
    ),
    p: (props: any) => <p className="font-body text-[#555] text-[16px] leading-relaxed mb-6" {...props} />,
    strong: (props: any) => <strong className="font-bold text-[var(--ink)]" {...props} />,
};

export default function ChangelogPage() {
    const logs = getAllChangelogs();

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
            <Nav />

            {/* HERO */}
            <section className="p-10 lg:p-20 border-b-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]">
                <div className="max-w-4xl">
                    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[2px] uppercase text-[var(--acid)] mb-8 before:content-[''] before:block before:w-6 before:h-[2px] before:bg-[var(--acid)]">
                        Changelog & Updates
                    </div>
                    <h1 className="font-display text-[clamp(64px,10vw,140px)] leading-[0.85] mb-8">
                        WHAT'S <span className="text-white text-outline">NEW.</span>
                    </h1>
                    <p className="font-mono text-ms text-white/50 uppercase tracking-widest max-w-xl">
                        A linear timeline of features, fixes, and automation upgrades designed to speed up your launch velocity.
                    </p>
                </div>
            </section>

            {/* TIMELINE */}
            <section className="max-w-5xl mx-auto w-full px-6 py-16 lg:py-24">
                <div className="relative border-l-[3px] border-[var(--paper3)] ml-4 md:ml-[120px]">
                    {logs.map((log, i) => (
                        <div key={log.slug} className="mb-20 last:mb-0 relative pl-8 md:pl-16">
                            {/* TIMELINE DOT & DATE */}
                            <div className="absolute top-0 -left-[14px] w-[25px] h-[25px] bg-[var(--acid)] border-4 border-[var(--paper)] rounded-full z-10" />
                            <div className="md:absolute top-1 md:-left-[150px] font-mono text-[10px] tracking-[2px] text-[#888] uppercase mb-4 md:mb-0 md:w-[100px] md:text-right">
                                {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                            </div>

                            {/* CARD */}
                            <article className="border-2 border-[var(--ink)] bg-[var(--paper2)] hover:bg-white transition-colors duration-300">
                                <header className="border-b-2 border-[var(--ink)] p-8 bg-[var(--paper)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <h2 className="font-display text-[44px] leading-[0.9] tracking-wider uppercase">
                                        {log.title}
                                    </h2>
                                    <div className="badge badge-auto">
                                        {log.version}
                                    </div>
                                </header>
                                <div className="p-8 md:p-12 prose-none max-w-none">
                                    <MDXRemote source={log.content} components={components} />
                                </div>
                            </article>
                        </div>
                    ))}
                </div>
            </section>

            <footer className="p-10 flex flex-col md:flex-row items-center justify-between gap-6 border-t-2 border-[var(--ink)]">
                <div className="font-display text-2xl tracking-widest">LAUNCHFLOW</div>
                <div className="font-mono text-[10px] text-[#aaa] uppercase tracking-widest">Built for vibecoders — 2025</div>
            </footer>
        </div>
    );
}
