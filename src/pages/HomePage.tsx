import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Smooth scroll function for anchor links
const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
};

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* 導航欄 */}
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-lg">基</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">中華基督教會基磐堂</h1>
                                <p className="text-sm text-gray-600">Chinese Christian Church Foundation</p>
                            </div>
                        </div>
                        <div className="flex space-x-6">
                            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">首頁</Link>
                            <Link to="/blog" className="text-gray-700 hover:text-blue-600 transition-colors">教會動態</Link>
                            <button
                                onClick={() => scrollToSection('about')}
                                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit"
                            >
                                關於我們
                            </button>
                            <button
                                onClick={() => scrollToSection('services')}
                                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit"
                            >
                                聚會時間
                            </button>
                            <button
                                onClick={() => scrollToSection('contact')}
                                className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer bg-transparent border-none p-0 font-inherit"
                            >
                                聯絡我們
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* 主橫幅 */}
            <section className="py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        歡迎來到基磐堂
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                        "耶穌說：凡聽見我這話就去行的，好比一個聰明人，把房子蓋在磐石上。" - 馬太福音 7:24
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => scrollToSection('services')}
                            className="inline-flex"
                        >
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                參加聚會
                            </Button>
                        </button>
                        <Link to="/blog">
                            <Button size="lg" variant="outline">
                                教會動態
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 特色服務 */}
            <section id="services" className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                        聚會時間
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center">
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-600">主日崇拜</CardTitle>
                                <CardDescription>週日上午聚會</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-gray-900 mb-2">上午 10:00am</p>
                                <p className="text-gray-600 mb-4">每週日</p>
                                <p className="text-sm text-gray-500">
                                    包含敬拜讚美、信息分享、聖餐禮拜
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-600">週六晚崇拜</CardTitle>
                                <CardDescription>週六晚間聚會</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-gray-900 mb-2">晚上 7:30</p>
                                <p className="text-gray-600 mb-4">每週六</p>
                                <p className="text-sm text-gray-500">
                                    包含敬拜讚美、信息分享、聖餐禮拜
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center">
                            <CardHeader>
                                <CardTitle className="text-xl text-blue-600">青年團契</CardTitle>
                                <CardDescription>週六晚間聚會</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-gray-900 mb-2">下午 5:00</p>
                                <p className="text-gray-600 mb-4">每週六</p>
                                <p className="text-sm text-gray-500">
                                    青年人的屬靈成長與團契生活
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 關於我們 */}
            <section id="about" className="py-16">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                關於基磐堂
                            </h2>
                            <p className="text-gray-600 mb-4">
                                中華基督教會基磐堂成立多年，致力於傳揚福音、造就信徒、服務社區。我們相信聖經是上帝的話語，耶穌基督是唯一的救主。
                            </p>
                            <p className="text-gray-600 mb-4">
                                我們的異象是建立一個以基督為中心的教會，讓每個人都能在此找到屬靈的家，經歷上帝的愛與恩典。
                            </p>
                            <p className="text-gray-600 mb-6">
                                無論您是初次接觸基督教，還是尋找教會的弟兄姊妹，我們都熱忱歡迎您的到來。
                            </p>
                            <Link to="/blog">
                                <Button variant="outline">
                                    了解更多教會動態
                                </Button>
                            </Link>
                        </div>
                        <div className="bg-blue-100 p-8 rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">我們的信仰</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li>• 相信三一真神：聖父、聖子、聖靈</li>
                                <li>• 相信聖經是上帝所默示的話語</li>
                                <li>• 相信耶穌基督的救贖恩典</li>
                                <li>• 相信永生與復活的盼望</li>
                                <li>• 相信教會是基督的身體</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* 教會動態預覽 */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            教會動態
                        </h2>
                        <p className="text-gray-600">
                            了解教會最新消息與活動
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>最新消息</CardTitle>
                                <CardDescription>
                                    瀏覽教會最新的公告與活動資訊
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link to="/blog">
                                    <Button variant="outline" className="w-full">
                                        查看動態
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>講道分享</CardTitle>
                                <CardDescription>
                                    聆聽牧師的信息分享與屬靈教導
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Link to="/blog">
                                    <Button variant="outline" className="w-full">
                                        閱讀分享
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* 聯絡資訊 */}
            <section id="contact" className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                聯絡我們
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900">地址</h3>
                                    <p className="text-gray-600">九龍深水埗營盤街163-173號建安大廈一樓1室</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">電話</h3>
                                    <p className="text-gray-600">2387-8179</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">電子郵件</h3>
                                    <p className="text-gray-600"><a href="mailto:keipunchurch@yahoo.com.hk">keipunchurch@yahoo.com.hk</a> </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                歡迎來訪
                            </h3>
                            <p className="text-gray-600 mb-6">
                                我們熱忱歡迎每一位朋友來到基磐堂。如果您是第一次來訪，我們會有專人為您介紹教會，讓您感受到家的溫暖。
                            </p>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-500">
                                    ✓ 探訪
                                </p>
                                <p className="text-sm text-gray-500">
                                    ✓ 兒童主日學
                                </p>
                                <p className="text-sm text-gray-500">
                                    ✓ 新朋友歡迎茶點
                                </p>
                                <p className="text-sm text-gray-500">
                                    ✓ 每月頭第一週六愛筵
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 頁尾 */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">基</span>
                            </div>
                            <div>
                                <p className="font-semibold">中華基督教會基磐堂</p>
                                <p className="text-sm text-gray-400">Chinese Christian Church Foundation</p>
                            </div>
                        </div>
                        <div className="flex space-x-6">
                            <Link to="/" className="text-gray-400 hover:text-white">首頁</Link>
                            <Link to="/blog" className="text-gray-400 hover:text-white">教會動態</Link>
                            <Link to="/blog/login" className="text-gray-400 hover:text-white text-xs">管理員</Link>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
                        <p>&copy; 2025 中華基督教會基磐堂. 願上帝賜福給您.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
