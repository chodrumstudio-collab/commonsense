import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { categoryInfo } from '../data/facts';
import { useFacts } from '../hooks/useFacts';
import { Category } from '../types';

export function CategoryPage() {
  const navigate = useNavigate();
  const { facts, loading } = useFacts();

  const categories = Object.values(categoryInfo);

  const getFactCount = (categoryName: Category) => {
    return facts.filter(f => f.category === categoryName).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-[80px] flex items-center justify-center" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-[80px]" style={{ backgroundColor: '#F8F9FA' }}>
      <header className="bg-white border-b border-gray-200 p-5 sticky top-0 z-10">
        <h1 className="text-center">카테고리별 보기</h1>
      </header>

      <main className="p-4">
        <div className="max-w-[480px] mx-auto space-y-3">
          {categories.map(category => {
            const count = getFactCount(category.name);
            return (
              <button
                key={category.name}
                onClick={() => navigate(`/category/${category.name}`)}
                className="w-full bg-white rounded-xl p-5 flex items-center justify-between hover:shadow-md transition-shadow"
                style={{
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  minHeight: '60px',
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{category.emoji}</span>
                  <div className="text-left">
                    <p style={{ color: '#2C3E50' }}>
                      {category.name}
                    </p>
                    <p className="text-sm text-gray-500">{count}개의 상식</p>
                  </div>
                </div>
                <ChevronRight size={24} style={{ color: '#9CA3AF' }} />
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
}
