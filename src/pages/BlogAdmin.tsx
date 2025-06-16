import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { saveBlogPost } from '../services/github';
import { useAuth } from '../context/AuthContext';
import type { BlogFormData } from '../types/blog';

export default function BlogAdmin() {
    const [formData, setFormData] = useState<BlogFormData>({
        title: '',
        content: '',
        author: '',
        tags: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/blog/login');
        }
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        // Basic validation
        if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
            setError('標題、內容和作者為必填欄位。');
            setLoading(false);
            return;
        }

        try {
            const success = await saveBlogPost(formData);
            if (success) {
                setSuccess(true);
                setFormData({
                    title: '',
                    content: '',
                    author: '',
                    tags: '',
                });
                // Redirect to blog page after a short delay
                setTimeout(() => {
                    navigate('/blog');
                }, 2000);
            } else {
                setError('發佈失敗，請檢查 GitHub 設定並重試。');
            }
        } catch (err) {
            setError('發佈動態時發生錯誤。');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setFormData({
            title: '',
            content: '',
            author: '',
            tags: '',
        });
        setError('');
        setSuccess(false);
    };

    if (!isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <Card className="max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-green-600 text-2xl font-bold">✓</span>
                        </div>
                        <CardTitle className="text-green-600">發佈成功！</CardTitle>
                        <CardDescription>
                            您的教會動態已成功發佈並儲存至 GitHub。
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            正在跳轉至教會動態頁面...
                        </p>
                        <Link to="/blog">
                            <Button>查看教會動態</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link to="/blog" className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                <span>←</span>
                                <span>返回教會動態</span>
                            </Link>
                            <h1 className="text-3xl font-bold text-gray-900 mt-2">發佈教會動態</h1>
                            <p className="text-gray-600 mt-1">分享上帝的恩典與教會生活</p>
                        </div>
                        <Button variant="outline" onClick={logout}>
                            登出
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <span className="text-blue-600 font-bold">基</span>
                                </div>
                                編寫教會動態
                            </CardTitle>
                            <CardDescription>
                                以 Markdown 格式撰寫動態內容，分享見證、講道信息或教會消息。內容將儲存到 GitHub 庫中。
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="title">動態標題 *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1"
                                        placeholder="請輸入動態標題，例如：主日講道分享、見證分享等"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="author">作者 *</Label>
                                    <Input
                                        id="author"
                                        name="author"
                                        type="text"
                                        value={formData.author}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1"
                                        placeholder="請輸入作者姓名或職份，例如：陳牧師、李傳道、王弟兄"
                                        disabled={loading}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="tags">標籤分類</Label>
                                    <Input
                                        id="tags"
                                        name="tags"
                                        type="text"
                                        value={formData.tags}
                                        onChange={handleInputChange}
                                        className="mt-1"
                                        placeholder="請輸入標籤，用逗號分隔，例如：講道, 見證, 禱告會, 團契活動"
                                        disabled={loading}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        建議標籤：講道、見證、禱告會、團契、主日學、福音、讚美、感恩
                                    </p>
                                </div>

                                <div>
                                    <Label htmlFor="content">動態內容 * (支援 Markdown 格式)</Label>
                                    <Textarea
                                        id="content"
                                        name="content"
                                        value={formData.content}
                                        onChange={handleInputChange}
                                        required
                                        className="mt-1"
                                        placeholder="請以 Markdown 格式撰寫動態內容...

範例：
# 主日講道：信心的力量

感謝主的恩典，今天牧師與我們分享了關於信心的寶貴信息。

## 經文分享
> 「信就是所望之事的實底，是未見之事的確據。」- 希伯來書 11:1

## 信息重點
- 信心是屬靈成長的基礎
- 透過禱告建立與神的關係
- 在生活中實踐神的話語

願上帝祝福我們每一個人！"
                                        rows={15}
                                        disabled={loading}
                                    />
                                    <p className="text-sm text-gray-500 mt-1">
                                        支援 Markdown 語法：**粗體**、*斜體*、[連結](網址)、`程式碼`、&gt; 引用等
                                    </p>
                                </div>

                                {error && (
                                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        disabled={loading || !formData.title.trim() || !formData.content.trim() || !formData.author.trim()}
                                        className="flex-1"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                發佈中...
                                            </>
                                        ) : (
                                            '發佈動態'
                                        )}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleReset}
                                        disabled={loading}
                                    >
                                        重置表單
                                    </Button>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-900 mb-2">發佈須知</h3>
                                    <ul className="text-sm text-blue-800 space-y-1">
                                        <li>• 發佈的內容將公開顯示在教會動態頁面</li>
                                        <li>• 請確保內容符合基督教價值觀與教會理念</li>
                                        <li>• 標題應簡潔明瞭，內容應真實可信</li>
                                        <li>• 發佈後內容將自動儲存至 GitHub 庫</li>
                                    </ul>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
