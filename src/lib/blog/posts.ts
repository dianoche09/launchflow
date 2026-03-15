import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Assuming the execution context is the root of the project
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const CHANGELOG_DIR = path.join(process.cwd(), 'content', 'changelog');

export interface BlogPost {
    slug: string;
    title: string;
    date: string;
    author: string;
    type: string;
    summary: string;
    image?: string;
    content: string;
}

export interface ChangelogPost {
    slug: string;
    version: string;
    date: string;
    title: string;
    content: string;
}

export function getAllBlogPosts(): BlogPost[] {
    if (!fs.existsSync(BLOG_DIR)) return [];

    const files = fs.readdirSync(BLOG_DIR);

    const posts = files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const slug = file.replace(/\.mdx$/, '');
            const fullPath = path.join(BLOG_DIR, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            const { data, content } = matter(fileContents);

            return {
                slug,
                title: data.title,
                date: data.date,
                author: data.author,
                type: data.type,
                summary: data.summary,
                image: data.image,
                content,
            } as BlogPost;
        })
        .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

    return posts;
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title,
            date: data.date,
            author: data.author,
            type: data.type,
            summary: data.summary,
            image: data.image,
            content,
        } as BlogPost;
    } catch (error) {
        return null;
    }
}

export function getBlogPostsByType(type: string): BlogPost[] {
    const posts = getAllBlogPosts();
    return posts.filter((post) => post.type.toLowerCase() === type.toLowerCase());
}

export function getAllChangelogs(): ChangelogPost[] {
    if (!fs.existsSync(CHANGELOG_DIR)) return [];

    const files = fs.readdirSync(CHANGELOG_DIR);

    const posts = files
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => {
            const slug = file.replace(/\.mdx$/, '');
            const fullPath = path.join(CHANGELOG_DIR, file);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            const { data, content } = matter(fileContents);

            return {
                slug,
                version: data.version,
                date: data.date,
                title: data.title,
                content,
            } as ChangelogPost;
        })
        .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));

    return posts;
}
