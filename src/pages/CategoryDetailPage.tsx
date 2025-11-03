import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { categoryInfo } from '../data/facts';
import { FactCard } from '../components/FactCard';
import { useFacts } from '../hooks/useFacts';
import { Category } from '../types';

export function CategoryDetailPage() {
  const { category } = useParams<{ category: Category }>();
  const navigate = useNavigate();
  const { facts, loading } = useFacts();

  if (!category || !categoryInfo[category]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>카테고리를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const categoryData = categoryInfo[category];
  const categoryFacts = facts.filter(f => f.category === category);

  if (loading) {
    return (
      <div className="min-h-screen pb-8 flex items-center justify-center" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#F8F9FA' }}>
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/categories')}
            className="p-2"
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <ArrowLeft size={24} style={{ color: '#2C3E50' }} />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{categoryData.emoji}</span>
            <h1>{categoryData.name}</h1>
          </div>
        </div>
      </header>

      <main className="p-4">
        <div className="max-w-[480px] mx-auto space-y-4">
          {categoryFacts.map(fact => (
            <FactCard key={fact.id} fact={fact} />
          ))}
        </div>
      </main>
    </div>
  );
}
