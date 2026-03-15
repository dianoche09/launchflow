import { Nav } from '@/components/nav';
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/blog/posts';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateStaticParams() {
    const posts = getAllBlogPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const post = getBlogPostBySlug(params.slug);
    if (!post) {
        return { title: 'Post not found' };
    }

    const ogUrl = `/api/og/blog?title=${encodeURIComponent(post.title)}&type=${encodeURIComponent(post.type)}`;

    return {
        title: `${post.title} — LaunchFlow Blog`,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            images: [{ url: ogUrl, width: 1200, height: 630 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: [ogUrl],
        },
    };
}

// Custom components for MDX matching Swiss-Punk aesthetic
const components = {
    h1: (props: any) => <h1 className="font-display text-[clamp(44px,6vw,84px)] leading-[0.9] mt-16 mb-8 uppercase tracking-wide text-[var(--ink)]" {...props} />,
    h2: (props: any) => <h2 className="font-display text-[32px] md:text-[48px] leading-[0.9] mt-12 mb-6 uppercase tracking-wider text-[var(--ink)]" {...props} />,
    h3: (props: any) => <h3 className="font-display text-[24px] md:text-[32px] mt-8 mb-4 uppercase tracking-widest text-[var(--ink)]" {...props} />,
    p: (props: any) => <p className="font-body text-[16px] md:text-[18px] leading-relaxed text-[#333] mb-6" {...props} />,
    ul: (props: any) => <ul className="list-disc pl-6 mb-8 space-y-3 font-body text-[16px] md:text-[18px] text-[#333]" {...props} />,
    ol: (props: any) => <ol className="list-decimal pl-6 mb-8 space-y-3 font-body text-[16px] md:text-[18px] text-[#333]" {...props} />,
    li: (props: any) => <li className="pl-2" {...props} />,
    blockquote: (props: any) => (
        <blockquote className="border-l-[4px] border-[var(--ink)] pl-6 py-2 my-8 font-body text-[18px] md:text-[20px] italic text-[#555] bg-[var(--paper2)]" {...props} />
    ),
    a: (props: any) => <a className="text-[var(--blue)] underline decoration-2 underline-offset-4 hover:bg-[var(--blue)] hover:text-white transition-colors" {...props} />,
    code: (props: any) => <code className="font-mono text-[14px] bg-[var(--paper2)] px-1.5 py-0.5 border border-[var(--paper3)] text-[#222]" {...props} />,
    pre: (props: any) => <pre className="font-mono text-[13px] bg-[var(--ink)] text-[var(--paper)] p-6 my-8 overflow-x-auto" {...props} />,
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = getBlogPostBySlug(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
            <Nav />

            <article className="max-w-3xl mx-auto px-6 py-12 md:py-20 lg:py-24">
                {/* POST HEADER */}
                <header className="mb-16 border-b-2 border-[var(--ink)] pb-12">
                    <div className="flex items-center gap-3 font-mono text-[10px] tracking-[2px] uppercase text-[var(--acid-dark)] mb-6 before:content-[''] before:block before:w-6 before:h-[2px] before:bg-[var(--acid-dark)]">
                        {post.type}
                    </div>
                    <h1 className="font-display text-[clamp(56px,8vw,104px)] leading-[0.9] mb-8 uppercase tracking-tight">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-[#888] font-mono text-[11px] uppercase tracking-widest pt-4 border-t border-[var(--paper3)]">
                        <span>By {post.author}</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ccc]"></span>
                        <time dateTime={post.date}>
                            {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </time>
                    </div>
                </header>

                {/* POST CONTENT */}
                <div className="prose-none">
                    <MDXRemote source={post.content} components={components} />
                </div>
            </article>

            <section className="border-y-2 border-[var(--ink)] bg-[var(--paper2)] p-12 lg:p-20 text-center flex flex-col items-center">
                <h2 className="font-display text-[56px] lg:text-[72px] tracking-widest leading-none mb-10 uppercase">
                    Back to <br className="md:hidden" /><span className="text-[var(--acid-dark)]">the source</span>
                </h2>
                <Link href="/blog" className="btn-big text-[24px]">READ MORE POSTS</Link>
            </section>

            <footer className="p-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="font-display text-2xl tracking-widest">LAUNCHFLOW</div>
                <div className="font-mono text-[10px] text-[#aaa] uppercase tracking-widest">Built for vibecoders — 2025</div>
            </footer>
        </div>
    );
}
