export interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    tags: string[];
}

export interface BlogFormData {
    title: string;
    content: string;
    author: string;
    tags: string;
}

export interface GitHubFile {
    name: string;
    path: string;
    type: 'file' | 'dir';
    size: number;
    sha: string;
    url: string;
    git_url: string;
    html_url: string;
    download_url: string | null;
}
