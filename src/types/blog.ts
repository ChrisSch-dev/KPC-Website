export interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    slug: string;
    tags?: string[];
}

export interface GitHubFile {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    download_url: string;
    content?: string;
}

export interface AuthContextType {
    isAuthenticated: boolean;
    login: (password: string) => Promise<boolean>;
    logout: () => void;
}

export interface BlogFormData {
    title: string;
    content: string;
    author: string;
    tags: string;
}
