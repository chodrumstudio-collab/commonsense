import { Home, Grid, Bookmark } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-[60px] flex items-center justify-around max-w-[480px] mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors"
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        <Home
          size={24}
          className="transition-colors"
          style={{ color: isActive('/') ? '#5FCEA8' : '#9CA3AF' }}
        />
        <span
          className="text-xs"
          style={{ color: isActive('/') ? '#5FCEA8' : '#9CA3AF' }}
        >
          홈
        </span>
      </button>

      <button
        onClick={() => navigate('/categories')}
        className="flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors"
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        <Grid
          size={24}
          className="transition-colors"
          style={{ color: isActive('/categories') ? '#5FCEA8' : '#9CA3AF' }}
        />
        <span
          className="text-xs"
          style={{ color: isActive('/categories') ? '#5FCEA8' : '#9CA3AF' }}
        >
          카테고리
        </span>
      </button>

      <button
        onClick={() => navigate('/bookmarks')}
        className="flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors"
        style={{ minHeight: '44px', minWidth: '44px' }}
      >
        <Bookmark
          size={24}
          className="transition-colors"
          style={{ color: isActive('/bookmarks') ? '#5FCEA8' : '#9CA3AF' }}
        />
        <span
          className="text-xs"
          style={{ color: isActive('/bookmarks') ? '#5FCEA8' : '#9CA3AF' }}
        >
          북마크
        </span>
      </button>
    </nav>
  );
}
