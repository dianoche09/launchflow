import { Nav } from '@/components/nav';
import { getAllBlogPosts } from '@/lib/blog/posts';
import Link from 'next/link';

export default function BlogPage() {
    const posts = getAllBlogPosts();

    // Separate featured post (the first one)
    const [featuredPost, ...restPosts] = posts;

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
            <Nav />

            {/* HERO / FEATURED POST */}
            {featuredPost && (
                <section className="grid lg:grid-cols-2 border-b-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]">
                    <div className="p-10 lg:p-20 border-r-2 border-[var(--ink)] border-r-white/10 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-3 font-mono text-[10px] tracking-[2px] uppercase text-[var(--acid)] mb-8 before:content-[''] before:block before:w-6 before:h-[2px] before:bg-[var(--acid)]">
                                Latest inside look
                            </div>
                            <h1 className="font-display text-[clamp(44px,6vw,84px)] leading-[0.9] mb-6 text-[var(--paper)] hover:text-[var(--acid)] transition-colors">
                                <Link href={`/blog/${featuredPost.slug}`}>
                                    {featuredPost.title}
                                </Link>
                            </h1>
                            <p className="font-body text-[16px] text-white/60 leading-relaxed max-w-lg mb-10">
                                {featuredPost.summary}
                            </p>
                        </div>

                        <div className="flex items-center justify-between font-mono text-[11px] text-[#888] uppercase tracking-widest pt-8 border-t border-white/10">
                            <div>By {featuredPost.author}</div>
                            <div>{new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                        </div>
                    </div>
                    <Link href={`/blog/${featuredPost.slug}`} className="block relative min-h-[300px] bg-[var(--paper2)] group overflow-hidden">
                        {/* Abstract placeholder for featured image if missing */}
                        <div className="absolute inset-0 bg-[var(--acid)] opacity-10 group-hover:opacity-20 transition-opacity" />
                        <div className="absolute inset-x-0 bottom-0 p-8">
                            <span className="badge badge-auto">{featuredPost.type}</span>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[120px] text-[var(--ink)] opacity-10 group-hover:scale-110 transition-transform duration-700">
                            READ
                        </div>
                    </Link>
                </section>
            )}

            {/* FILTER TABS */}
            <section className="border-b-2 border-[var(--ink)] bg-[var(--paper2)] overflow-x-auto scrollbar-none">
                <div className="flex">
                    {['All', 'Journey', 'Design', 'Guide'].map((filter, i) => (
                        <button key={i} className={`p-6 px-10 border-r-2 border-[var(--ink)] font-mono text-[11px] tracking-widest uppercase transition-colors whitespace-nowrap ${i === 0 ? 'bg-[var(--ink)] text-[var(--acid)]' : 'hover:bg-black/5 text-[#888] hover:text-[var(--ink)]'}`}>
                            {filter}
                        </button>
                    ))}
                </div>
            </section>

            {/* POSTS GRID */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3">
                {restPosts.map((post, i) => (
                    <Link href={`/blog/${post.slug}`} key={i} className="flex flex-col border-b-2 border-r-2 border-[var(--ink)] hover:bg-[var(--paper2)] transition-colors group">
                        <div className="h-48 bg-[#ddd] border-b-2 border-[var(--ink)] relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                            <div className="absolute bottom-4 left-4">
                                <span className="badge badge-auto bg-[var(--paper)]">{post.type}</span>
                            </div>
                        </div>
                        <div className="p-8 flex flex-col flex-1">
                            <h3 className="font-display text-[32px] leading-[0.9] tracking-wider mb-4 group-hover:text-[var(--acid-dark)] transition-colors">
                                {post.title}
                            </h3>
                            <p className="font-body text-[#666] text-sm leading-relaxed mb-8 flex-1">
                                {post.summary}
                            </p>
                            <div className="font-mono text-[10px] text-[#aaa] uppercase tracking-widest flex items-center justify-between pt-6 border-t border-[var(--paper3)]">
                                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--ink)]">READ MORE →</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </section>

            {/* NEWSLETTER FORM */}
            <section className="border-b-2 border-r-2 border-[var(--ink)] bg-[var(--acid)] p-12 lg:p-20 text-center flex flex-col items-center">
                <h2 className="font-display text-[56px] lg:text-[72px] tracking-widest leading-none mb-4">
                    THE BUILDERS <span className="text-white text-outline">LOOP</span>
                </h2>
                <p className="font-mono text-xs text-[#666] uppercase tracking-widest mb-10 max-w-md">
                    We drop one high-signal, zero-fluff email per week about shipping fast and growth hacking.
                </p>
                <form className="flex w-full max-w-lg border-2 border-[var(--ink)] bg-[var(--paper)]">
                    <input
                        type="email"
                        placeholder="ENTER EMAIL"
                        className="flex-1 bg-transparent px-6 font-mono text-[11px] uppercase tracking-widest outline-none placeholder:text-[#aaa]"
                    />
                    <button type="submit" className="border-l-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--acid)] font-display text-xl tracking-widest px-8 py-4 hover:bg-[#222]">
                        SUBSCRIBE
                    </button>
                </form>
            </section>

            <footer className="p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="font-display text-2xl tracking-widest">LAUNCHFLOW</div>
                <div className="font-mono text-[10px] text-[#aaa] uppercase tracking-widest">Built for vibecoders — 2025</div>
                <div className="flex gap-8">
                    {['Twitter', 'GitHub', 'Terms'].map(link => (
                        <Link key={link} href="#" className="font-mono text-[11px] text-[#aaa] hover:text-[var(--ink)] transition-colors uppercase tracking-widest">{link}</Link>
                    ))}
                </div>
            </footer>
        </div>
    );
}
