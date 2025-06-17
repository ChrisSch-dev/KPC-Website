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
        console.log('🔄 Starting fetchBlogPosts...');
        console.log('📁 GitHub config:', {
            owner: GITHUB_OWNER || 'NOT_SET',
            repo: GITHUB_REPO || 'NOT_SET',
            path: POSTS_PATH
        });

        const { data } = await octokit.rest.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: POSTS_PATH,
        });

        console.log('📂 GitHub response type:', Array.isArray(data) ? 'array' : typeof data);

        if (!Array.isArray(data)) {
            console.warn('❌ Expected array from GitHub, got:', typeof data);
            return [];
        }

        console.log(`📄 Found ${data.length} total files in ${POSTS_PATH}`);
        const markdownFiles = data.filter(file => file.name.endsWith('.md'));
        console.log(`📝 Found ${markdownFiles.length} markdown files:`, markdownFiles.map(f => f.name));

        const posts: BlogPost[] = [];

        for (const file of data as GitHubFile[]) {
            if (file.name.endsWith('.md')) {
                console.log(`🔍 Processing file: ${file.name}`);
                try {
                    const content = await fetchFileContent(file.path);
                    console.log(`✅ Fetched content for ${file.name}, length: ${content.length}`);

                    const post = parseMarkdownPost(content, file.name);
                    if (post) {
                        console.log(`✅ Successfully parsed post: ${post.title} (slug: ${post.slug})`);
                        posts.push(post);
                    } else {
                        console.warn(`❌ Failed to parse post: ${file.name}`);
                    }
                } catch (fileError) {
                    console.error(`💥 Error processing file ${file.name}:`, fileError);
                    // Continue processing other files even if this one fails
                }
            }
        }

        const sortedPosts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return sortedPosts;
    } catch (error) {
        console.error('💥 Error fetching blog posts:', error);
        return [];
    }
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
    try {
        // With the new filename format (timestamp-title.md), we need to search
        // through all posts to find the one with the matching slug
        const posts = await fetchBlogPosts();
        const post = posts.find(p => p.slug === slug);

        if (post) {
            return post;
        }

        // Fallback: try direct filename lookup for old format compatibility
        try {
            const filename = `${slug}.md`;
            const content = await fetchFileContent(`${POSTS_PATH}/${filename}`);
            return parseMarkdownPost(content, filename);
        } catch {
            // File not found with old format either
        }

        return null;
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return null;
    }
}

export async function saveBlogPost(formData: BlogFormData): Promise<boolean> {
    try {
        const timestamp = Date.now();
        const titleSlug = generateTitleSlug(formData.title);
        const filename = `${timestamp}-${titleSlug}.md`;
        const filePath = `${POSTS_PATH}/${filename}`;

        // Generate a unique slug for URL routing (without timestamp)
        const slug = generateSlug(formData.title);

        const frontMatter = createFrontMatter(formData, slug, filename);
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
    console.log(`🔍 Parsing ${filename}...`);
    try {
        // Normalize line endings and split
        const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const lines = normalizedContent.split('\n');
        console.log(`📄 File has ${lines.length} lines`);

        // Find front matter boundaries
        let frontMatterStart = -1;
        let frontMatterEnd = -1;

        for (let i = 0; i < lines.length; i++) {
            const trimmedLine = lines[i].trim();
            if (trimmedLine === '---') {
                if (frontMatterStart === -1) {
                    frontMatterStart = i;
                    console.log(`📌 Front matter starts at line ${i}`);
                } else {
                    frontMatterEnd = i;
                    console.log(`📌 Front matter ends at line ${i}`);
                    break;
                }
            }
        }

        // If no proper front matter found, create a basic post
        if (frontMatterStart !== 0 || frontMatterEnd === -1) {
            console.warn(`⚠️  No valid front matter found in ${filename}, creating basic post`);
            console.log(`   Front matter start: ${frontMatterStart}, end: ${frontMatterEnd}`);
            const id = filename.replace('.md', '');
            const postContent = normalizedContent;
            const basicPost = {
                id,
                title: filename.replace('.md', '').replace(/[-_]/g, ' '),
                content: postContent,
                excerpt: `${postContent.substring(0, 150)}...`,
                author: 'Unknown',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                slug: id,
                tags: [],
            };
            console.log(`✅ Created basic post: ${basicPost.title}`);
            return basicPost;
        }

        const frontMatter = lines.slice(frontMatterStart + 1, frontMatterEnd).join('\n');
        const postContent = lines.slice(frontMatterEnd + 1).join('\n').trim();
        console.log(`📝 Front matter length: ${frontMatter.length}, content length: ${postContent.length}`);

        const metadata: Record<string, string> = {};
        const frontMatterLines = frontMatter.split('\n').filter(line => line.trim() !== '');
        console.log(`🔍 Processing ${frontMatterLines.length} front matter lines`);

        for (const line of frontMatterLines) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();
                if (key && value) {
                    // Remove surrounding quotes
                    metadata[key] = value.replace(/^["']|["']$/g, '');
                }
            }
        }

        console.log(`📋 Extracted metadata:`, metadata);

        // For new format files, use the slug from front matter
        // For old format files, use filename without .md extension
        const id = filename.replace('.md', '');
        const slug = metadata.slug || generateSlug(metadata.title || id);

        const parsedPost = {
            id,
            title: metadata.title || 'Untitled',
            content: postContent,
            excerpt: metadata.excerpt || `${postContent.substring(0, 150)}...`,
            author: metadata.author || 'Unknown',
            createdAt: metadata.createdAt || new Date().toISOString(),
            updatedAt: metadata.updatedAt || metadata.createdAt || new Date().toISOString(),
            slug,
            tags: metadata.tags ? metadata.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean) : [],
        };

        console.log(`✅ Successfully parsed ${filename} -> ${parsedPost.title} (slug: ${parsedPost.slug})`);
        return parsedPost;
    } catch (error) {
        console.error(`💥 Error parsing markdown post ${filename}:`, error);
        // Return a basic post even if parsing fails
        const id = filename.replace('.md', '');
        const fallbackPost = {
            id,
            title: filename.replace('.md', '').replace(/[-_]/g, ' '),
            content: content,
            excerpt: `${content.substring(0, 150)}...`,
            author: 'Unknown',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            slug: id,
            tags: [],
        };
        console.log(`🔄 Created fallback post: ${fallbackPost.title}`);
        return fallbackPost;
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

function generateTitleSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

function createFrontMatter(formData: BlogFormData, slug: string, filename: string): string {
    const now = new Date().toISOString();
    const tags = formData.tags.split(',').map(tag => tag.trim()).filter(Boolean);

    return `---
title: "${formData.title}"
author: "${formData.author}"
createdAt: "${now}"
updatedAt: "${now}"
slug: "${slug}"
filename: "${filename}"
excerpt: "${formData.content.substring(0, 150)}..."
tags: "${tags.join(', ')}"
---`;
}

// Debug utility function to test GitHub connectivity
export async function debugGitHubConnection(): Promise<void> {
    console.log('🔧 === GITHUB DEBUG UTILITY ===');

    // Check environment variables
    console.log('🔍 Environment check:');
    console.log('  VITE_GITHUB_TOKEN:', import.meta.env.VITE_GITHUB_TOKEN ? 'SET' : 'NOT SET');
    console.log('  VITE_GITHUB_OWNER:', import.meta.env.VITE_GITHUB_OWNER || 'NOT SET');
    console.log('  VITE_GITHUB_REPO:', import.meta.env.VITE_GITHUB_REPO || 'NOT SET');

    try {
        // Test basic repo access
        console.log('🔍 Testing repository access...');
        const repoInfo = await octokit.rest.repos.get({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
        });
        console.log('✅ Repository access successful:', {
            name: repoInfo.data.name,
            private: repoInfo.data.private,
            default_branch: repoInfo.data.default_branch
        });

        // Test posts directory access
        console.log('🔍 Testing posts directory access...');
        const { data } = await octokit.rest.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: POSTS_PATH,
        });

        if (Array.isArray(data)) {
            console.log(`✅ Posts directory found with ${data.length} files:`);
            data.forEach(file => {
                console.log(`  📄 ${file.name} (${file.type})`);
            });
        } else {
            console.log('⚠️  Posts path is not a directory:', data);
        }

    } catch (error) {
        console.error('💥 GitHub connection test failed:', error);
    }

    console.log('🔧 === END DEBUG ===');
}
