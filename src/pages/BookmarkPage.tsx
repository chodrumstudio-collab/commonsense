import { useBookmarks } from '../contexts/BookmarkContext';
import { useFacts } from '../hooks/useFacts';
import { FactCard } from '../components/FactCard';

export function BookmarkPage() {
  const { bookmarks } = useBookmarks();
  const { facts, loading } = useFacts();

  const bookmarkedFacts = facts.filter(fact => bookmarks.has(fact.id));

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
        <h1 className="text-center">💾 저장한 상식</h1>
      </header>

      <main className="p-4">
        <div className="max-w-[480px] mx-auto">
          {bookmarkedFacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-6xl mb-4">💾</div>
              <p className="text-gray-500 text-center">
                아직 저장한 상식이 없습니다
              </p>
              <p className="text-sm text-gray-400 text-center mt-2">
                마음에 드는 상식을 저장해보세요
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookmarkedFacts.map(fact => (
                <FactCard key={fact.id} fact={fact} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
