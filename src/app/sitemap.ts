import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog/posts';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://launchflow.io';

    // Get static routes
    const staticRoutes = [
        '',
        '/pricing',
        '/platforms',
        '/changelog',
        '/blog',
        '/login',
        '/legal',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Get blog routes
    const posts = getAllBlogPosts();
    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date).toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    return [...staticRoutes, ...blogRoutes];
}
