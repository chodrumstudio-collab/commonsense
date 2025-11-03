import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart } from 'lucide-react';
import { facts, categoryInfo } from '../data/facts';
import { useBookmarks } from '../contexts/BookmarkContext';

export function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const fact = facts.find(f => f.id === id);

  if (!fact) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>상식을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const category = categoryInfo[fact.category];
  const relatedFacts = facts.filter(f => fact.relatedFacts.includes(f.id));
  const bookmarked = isBookmarked(fact.id);

  return (
    <div className="min-h-screen pb-8" style={{ backgroundColor: '#F8F9FA' }}>
      <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2"
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <ArrowLeft size={24} style={{ color: '#2C3E50' }} />
        </button>
      </header>

      <main className="p-5 max-w-[480px] mx-auto">
        <div className="mb-4">
          <span
            className="inline-block text-xs px-3 py-1 rounded-full"
            style={{ backgroundColor: category.color, color: '#2C3E50' }}
          >
            {category.emoji} {category.name}
          </span>
        </div>

        <h1 className="mb-6" style={{ color: '#2C3E50' }}>
          {fact.title}
        </h1>

        <div className="bg-white rounded-xl p-5 mb-6" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <div className="whitespace-pre-line" style={{ lineHeight: '1.6', color: '#2C3E50' }}>
            {fact.fullContent}
          </div>
        </div>

        {relatedFacts.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-4" style={{ color: '#2C3E50' }}>
              관련 상식
            </h3>
            <div className="space-y-3">
              {relatedFacts.map(relatedFact => {
                const relatedCategory = categoryInfo[relatedFact.category];
                return (
                  <div
                    key={relatedFact.id}
                    onClick={() => navigate(`/fact/${relatedFact.id}`)}
                    className="bg-white rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{relatedCategory.emoji}</span>
                      <div className="flex-1">
                        <p className="text-sm mb-1" style={{ color: '#2C3E50' }}>
                          {relatedFact.title}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {relatedFact.shortDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <button
        onClick={() => toggleBookmark(fact.id)}
        className="fixed bottom-20 right-5 rounded-full p-4 shadow-lg transition-all"
        style={{
          backgroundColor: bookmarked ? '#5FCEA8' : 'white',
          minHeight: '56px',
          minWidth: '56px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        <Heart
          size={24}
          style={{
            color: bookmarked ? 'white' : '#9CA3AF',
            fill: bookmarked ? 'white' : 'none',
          }}
        />
      </button>
    </div>
  );
}
