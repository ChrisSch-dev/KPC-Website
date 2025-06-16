import { Octokit } from '@octokit/rest';
import type { BlogPost, GitHubFile, BlogFormData } from '../types/blog';

const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
});

const GITHUB_OWNER = import.meta.env.VITE_GITHUB_OWNER;
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO;
const POSTS_PATH = 'posts';

export async function fetchBlogPosts(): Promise<BlogPost[]> {
    try {
        const { data } = await octokit.rest.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: POSTS_PATH,
        });

        if (!Array.isArray(data)) {
            return [];
        }

        const posts: BlogPost[] = [];

        for (const file of data as GitHubFile[]) {
            if (file.name.endsWith('.md')) {
                const content = await fetchFileContent(file.path);
                const post = parseMarkdownPost(content, file.name);
                if (post) {
                    posts.push(post);
                }
            }
        }

        return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return [];
    }
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        const filename = `${slug}.md`;
        const content = await fetchFileContent(`${POSTS_PATH}/${filename}`);
        return parseMarkdownPost(content, filename);
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export async function saveBlogPost(formData: BlogFormData): Promise<boolean> {
    try {
        const slug = generateSlug(formData.title);
        const filename = `${slug}.md`;
        const filePath = `${POSTS_PATH}/${filename}`;

        const frontMatter = createFrontMatter(formData, slug);
        const content = `${frontMatter}\n\n${formData.content}`;

        // Check if file already exists
        let sha: string | undefined;
        try {
            const { data: existingFile } = await octokit.rest.repos.getContent({
                owner: GITHUB_OWNER,
                repo: GITHUB_REPO,
                path: filePath,
            });

            if (!Array.isArray(existingFile)) {
                sha = existingFile.sha;
            }
        } catch {
            // File doesn't exist, which is fine for creating new posts
        }

        await octokit.rest.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: filePath,
            message: `${sha ? 'Update' : 'Create'} blog post: ${formData.title}`,
            content: btoa(unescape(encodeURIComponent(content))),
            sha,
        });

        return true;
    } catch (error) {
        console.error('Error saving blog post:', error);
        return false;
    }
}

async function fetchFileContent(path: string): Promise<string> {
    const { data } = await octokit.rest.repos.getContent({
        owner: GITHUB_OWNER,
        repo: GITHUB_REPO,
        path,
    });

    if (Array.isArray(data)) {
        throw new Error('Expected file, got directory');
    }

    if (data.type !== 'file' || !data.content) {
        throw new Error('No content found');
    }

    return decodeURIComponent(escape(atob(data.content)));
}

function parseMarkdownPost(content: string, filename: string): BlogPost | null {
    try {
        const lines = content.split('\n');
        const frontMatterEnd = lines.findIndex((line, index) => index > 0 && line === '---');

        if (frontMatterEnd === -1) {
            return null;
        }

        const frontMatter = lines.slice(1, frontMatterEnd).join('\n');
        const postContent = lines.slice(frontMatterEnd + 1).join('\n').trim();

        const metadata: Record<string, string> = {};
        const frontMatterLines = frontMatter.split('\n');
        for (const line of frontMatterLines) {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length > 0) {
                const value = valueParts.join(':').trim();
                metadata[key.trim()] = value.replace(/^["']|["']$/g, '');
            }
        }

        const id = filename.replace('.md', '');
        const slug = metadata.slug || id;

        return {
            id,
            title: metadata.title || 'Untitled',
            content: postContent,
            excerpt: metadata.excerpt || `${postContent.substring(0, 150)}...`,
            author: metadata.author || 'Unknown',
            createdAt: metadata.createdAt || new Date().toISOString(),
            updatedAt: metadata.updatedAt || new Date().toISOString(),
            slug,
            tags: metadata.tags ? metadata.tags.split(',').map((tag: string) => tag.trim()) : [],
        };
    } catch (error) {
        console.error('Error parsing markdown post:', error);
        return null;
    }
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function createFrontMatter(formData: BlogFormData, slug: string): string {
    const now = new Date().toISOString();
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    return `---
title: "${formData.title}"
author: "${formData.author}"
createdAt: "${now}"
updatedAt: "${now}"
slug: "${slug}"
excerpt: "${formData.content.substring(0, 150)}..."
tags: "${tags.join(', ')}"
---`;
}
