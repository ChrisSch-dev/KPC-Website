import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { fetchBlogPost } from '../services/github';
import { useAuth } from '../context/AuthContext';
import type { BlogPost as BlogPostType } from '../types/blog';

export default function BlogPost() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<BlogPostType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (id) {
            loadPost(id);
        }
    }, [id]);

    const loadPost = async (slug: string) => {
        try {
            setLoading(true);
            const fetchedPost = await fetchBlogPost(slug);
            if (fetchedPost) {
                setPost(fetchedPost);
                setError(null);
            } else {
                setError('找不到此教會動態。');
            }
        } catch (err) {
            setError('載入教會動態失敗，請稍後再試。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">載入教會動態中...</p>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-gray-500 text-2xl">?</span>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                        {error || '找不到教會動態'}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        此動態可能已被移除或網址錯誤
                    </p>
                    <Link to="/blog">
                        <Button>返回教會動態</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <Link to="/blog" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                            <span>←</span>
                            <span>返回教會動態</span>
                        </Link>
                        {isAuthenticated && (
                            <Link to="/blog/admin">
                                <Button variant="outline">發佈新動態</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <article className="max-w-4xl mx-auto">
                    <Card className="shadow-lg">
                        <CardHeader className="border-b bg-white">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 font-bold text-lg">基</span>
                                </div>
                                <div className="flex-1">
                                    <CardTitle className="text-3xl md:text-4xl font-bold leading-tight text-gray-900">
                                        {post.title}
                                    </CardTitle>
                                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mt-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">作者：</span>
                                            <span>{post.author}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-2">
                                            <span>發佈時間：</span>
                                            <span>{formatDate(post.createdAt)}</span>
                                        </div>
                                        {post.updatedAt !== post.createdAt && (
                                            <>
                                                <span>•</span>
                                                <div className="flex items-center gap-2">
                                                    <span>更新時間：</span>
                                                    <span>{formatDate(post.updatedAt)}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {post.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                                                >
                          #{tag}
                        </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="prose prose-lg max-w-none p-8">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h1: ({ children }) => (
                                        <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b pb-2">{children}</h1>
                                    ),
                                    h2: ({ children }) => (
                                        <h2 className="text-2xl font-semibold mt-6 mb-3 text-gray-900">{children}</h2>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-xl font-medium mt-5 mb-2 text-gray-900">{children}</h3>
                                    ),
                                    p: ({ children }) => (
                                        <p className="mb-4 text-gray-700 leading-relaxed text-lg">{children}</p>
                                    ),
                                    ul: ({ children }) => (
                                        <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1">{children}</ul>
                                    ),
                                    ol: ({ children }) => (
                                        <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1">{children}</ol>
                                    ),
                                    li: ({ children }) => (
                                        <li className="mb-1">{children}</li>
                                    ),
                                    blockquote: ({ children }) => (
                                        <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-gray-600 bg-blue-50 py-4">
                                            {children}
                                        </blockquote>
                                    ),
                                    code: ({ children, className }) => {
                                        const isInline = !className;
                                        if (isInline) {
                                            return (
                                                <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                                                    {children}
                                                </code>
                                            );
                                        }
                                        return (
                                            <code className="block bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto">
                                                {children}
                                            </code>
                                        );
                                    },
                                    pre: ({ children }) => (
                                        <pre className="bg-gray-100 p-4 rounded text-sm font-mono overflow-x-auto mb-4">
                      {children}
                    </pre>
                                    ),
                                    a: ({ href, children }) => (
                                        <a
                                            href={href}
                                            className="text-blue-600 hover:text-blue-800 underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {children}
                                        </a>
                                    ),
                                    img: ({ src, alt }) => (
                                        <img
                                            src={src}
                                            alt={alt}
                                            className="max-w-full h-auto rounded-lg shadow-md my-6"
                                        />
                                    ),
                                    hr: () => (
                                        <hr className="my-8 border-gray-300" />
                                    ),
                                }}
                            >
                                {post.content}
                            </ReactMarkdown>
                        </CardContent>
                    </Card>

                    {/* Navigation and Actions */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                        <Link to="/blog">
                            <Button variant="outline" className="w-full sm:w-auto">
                                ← 返回所有動態
                            </Button>
                        </Link>

                        {isAuthenticated && (
                            <Link to="/blog/admin">
                                <Button className="w-full sm:w-auto">
                                    發佈新動態
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* 分享祝福 */}
                    <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 font-bold">基</span>
                            </div>
                            <p className="text-gray-600 mb-2">
                                "你們要將一切的憂慮卸給神，因為他顧念你們。"
                            </p>
                            <p className="text-sm text-gray-500">
                                彼得前書 5:7 - 中華基督教會基磐堂
                            </p>
                        </div>
                    </div>
                </article>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">基</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">中華基督教會基磐堂</p>
                                <p className="text-sm text-gray-600">分享上帝的愛與恩典</p>
                            </div>
                        </div>
                        <div className="flex space-x-6">
                            <Link to="/" className="text-gray-600 hover:text-blue-600">教會首頁</Link>
                            <Link to="/blog" className="text-gray-600 hover:text-blue-600">教會動態</Link>
                            {isAuthenticated && (
                                <Link to="/blog/admin" className="text-gray-600 hover:text-blue-600">管理後台</Link>
                            )}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
