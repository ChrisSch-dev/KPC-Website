import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchBlogPosts } from '../services/github';
import { useAuth } from '../context/AuthContext';
import type { BlogPost } from '../types/blog';

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isAuthenticated, logout } = useAuth();

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const fetchedPosts = await fetchBlogPosts();
            setPosts(fetchedPosts);
            setError(null);
        } catch (err) {
            setError('無法載入教會動態，請稍後再試。');
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

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={loadPosts}>重新載入</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* 標題導航 */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link to="/" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                <span>←</span>
                                <span>返回首頁</span>
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 mt-2">教會動態</h1>
                            <p className="text-gray-600 mt-1">中華基督教會基磐堂最新消息與分享</p>
                        </div>
                        <div className="flex gap-4">
                            {isAuthenticated ? (
                                <>
                                    <Link to="/blog/admin">
                                        <Button>發佈新動態</Button>
                                    </Link>
                                    <Button variant="outline" onClick={logout}>
                                        登出
                                    </Button>
                                </>
                            ) : (
                                <Link to="/blog/login">
                                    <Button variant="outline">管理員登入</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* 主要內容 */}
            <main className="container mx-auto px-4 py-8">
                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="max-w-md mx-auto">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 text-2xl font-bold">基</span>
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                尚無教會動態
                            </h2>
                            <p className="text-gray-600 mb-8">
                                歡迎成為第一個分享教會動態的人！
                            </p>
                            {isAuthenticated ? (
                                <Link to="/blog/admin">
                                    <Button>發佈第一篇動態</Button>
                                </Link>
                            ) : (
                                <Link to="/blog/login">
                                    <Button>管理員登入發佈</Button>
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* 動態統計 */}
                        <div className="mb-8">
                            <div className="bg-white rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            共有 {posts.length} 篇動態
                                        </h2>
                                        <p className="text-gray-600">
                                            感謝主的恩典，與弟兄姊妹分享生命中的見證
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <span className="text-blue-600 text-xl font-bold">基</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 動態列表 */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.map((post) => (
                                <Card key={post.id} className="hover:shadow-lg transition-shadow bg-white">
                                    <CardHeader>
                                        <CardTitle className="line-clamp-2 text-lg">
                                            <Link
                                                to={`/blog/post/${post.slug}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {post.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <span>作者：{post.author}</span>
                                            <span>•</span>
                                            <span>{formatDate(post.createdAt)}</span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                            {post.excerpt}
                                        </p>
                                        {post.tags && post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
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
                                        <Link to={`/blog/post/${post.slug}`}>
                                            <Button variant="outline" size="sm" className="w-full">
                                                閱讀全文
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* 分頁提示 */}
                        {posts.length > 0 && (
                            <div className="mt-12 text-center">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <p className="text-gray-600">
                                        "你們要將一切的憂慮卸給神，因為他顧念你們。" - 彼得前書 5:7
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        感謝主，願我們在基督裡彼此分享，互相鼓勵
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* 頁尾 */}
            <footer className="bg-white border-t mt-16">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">基</span>
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">中華基督教會基磐堂</p>
                                <p className="text-sm text-gray-600">教會動態分享平台</p>
                            </div>
                        </div>
                        <div className="flex space-x-6">
                            <Link to="/" className="text-gray-600 hover:text-blue-600">返回首頁</Link>
                            <Link to="#" className="text-gray-600 hover:text-blue-600">聯絡我們</Link>
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
