import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../context/AuthContext';

export default function BlogLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/blog/admin');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const success = await login(password);
            if (success) {
                navigate('/blog/admin');
            } else {
                setError('密碼錯誤，請重新輸入。');
            }
        } catch (err) {
            setError('登入時發生錯誤，請稍後再試。');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <Link to="/blog" className="text-blue-600 hover:text-blue-800 inline-flex items-center gap-2">
                        <span>←</span>
                        <span>返回教會動態</span>
                    </Link>
                </div>

                <Card className="mt-8 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-bold text-2xl">基</span>
                        </div>
                        <CardTitle className="text-2xl font-bold">管理員登入</CardTitle>
                        <CardDescription>
                            請輸入管理員密碼以進入教會動態管理後台
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="password">管理員密碼</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="mt-1"
                                    placeholder="請輸入管理員密碼"
                                    disabled={loading}
                                />
                            </div>

                            {error && (
                                <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading || !password.trim()}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                        登入中...
                                    </>
                                ) : (
                                    '登入管理後台'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600 bg-blue-50 p-3 rounded">
                            <p className="font-medium text-blue-900 mb-1">管理員權限說明</p>
                            <p>登入後可以發佈教會動態、分享見證與講道內容</p>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center text-sm text-gray-600 space-y-2">
                    <div>
                        <Link to="/" className="text-blue-600 hover:text-blue-800">
                            返回教會首頁
                        </Link>
                        <span className="mx-2">•</span>
                        <Link to="/blog" className="text-blue-600 hover:text-blue-800">
                            瀏覽教會動態
                        </Link>
                    </div>
                    <p className="text-xs text-gray-500">
                        "你們要將一切的憂慮卸給神，因為他顧念你們。" - 彼得前書 5:7
                    </p>
                </div>
            </div>
        </div>
    );
}
