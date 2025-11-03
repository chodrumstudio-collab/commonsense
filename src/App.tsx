import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { HomePage } from './pages/HomePage';
import { DetailPage } from './pages/DetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { BookmarkPage } from './pages/BookmarkPage';
import { BottomNav } from './components/BottomNav';

export default function App() {
  return (
    <BookmarkProvider>
      <BrowserRouter>
        <div className="max-w-[480px] mx-auto relative min-h-screen" style={{ backgroundColor: '#F8F9FA' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/fact/:id" element={<DetailPage />} />
            <Route path="/categories" element={<CategoryPage />} />
            <Route path="/category/:category" element={<CategoryDetailPage />} />
            <Route path="/bookmarks" element={<BookmarkPage />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </BookmarkProvider>
  );
}
