import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import BlogLogin from './pages/BlogLogin';
import BlogAdmin from './pages/BlogAdmin';
import BlogPost from './pages/BlogPost';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/login" element={<BlogLogin />} />
                    <Route path="/blog/admin" element={<BlogAdmin />} />
                    <Route path="/blog/post/:id" element={<BlogPost />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
