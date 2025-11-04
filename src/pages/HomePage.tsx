import { useMemo } from 'react';
import { FactCard } from '../components/FactCard';
import { useFacts } from '../hooks/useFacts';
import { formatDateKorean, getTodayDateString, getRotatedFactsByDate } from '../utils/dateUtils';

export function HomePage() {
  const { facts, loading, error, refresh } = useFacts();
  // 매 렌더링마다 현재 날짜를 가져와서 날짜가 바뀌었을 때 즉시 반영되도록 함
  const todayDateString = getTodayDateString();
  const formattedDate = formatDateKorean(todayDateString);
  
  // 디버깅: 날짜와 상식 개수 로그
  console.log('HomePage 렌더링:', { todayDateString, factsCount: facts.length, timestamp: new Date().toISOString() });

  // 날짜 기반으로 오늘의 상식 선택
  // useMemo를 사용하여 facts와 todayDateString이 변경될 때마다 재계산
  // 방법 1: date 필드가 있으면 해당 날짜의 상식 필터링
  // 방법 2: date 필드가 없으면 날짜 기반 로테이션 사용
  const todaysFacts = useMemo(() => {
    if (facts.length === 0) return [];

    // date 필드가 있는 상식들 필터링
    const factsWithTodayDate = facts.filter(
      fact => fact.date === todayDateString
    );

    if (factsWithTodayDate.length > 0) {
      return factsWithTodayDate.slice(0, 5);
    }

    // date 필드가 없거나 오늘 날짜와 일치하는 것이 없으면 날짜 기반 로테이션 사용
    return getRotatedFactsByDate(facts, 5);
  }, [facts, todayDateString]);

  if (loading) {
    return (
      <div className="min-h-screen pb-[80px] flex items-center justify-center" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">상식을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pb-[80px] flex items-center justify-center p-4" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="text-center max-w-[400px]">
          <p className="text-red-500 mb-4">⚠️ 오류가 발생했습니다</p>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-[80px]" style={{ backgroundColor: '#F8F9FA' }}>
      <header className="bg-white border-b border-gray-200 p-5 sticky top-0 z-10">
        <h1 className="text-center mb-1">📚 오늘의 상식</h1>
        <p className="text-center text-sm text-gray-500">{formattedDate}</p>
      </header>

      <main className="p-4">
        <div className="max-w-[480px] mx-auto space-y-4">
          {todaysFacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">오늘의 상식이 없습니다.</p>
              <button
                onClick={refresh}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                새로고침
              </button>
            </div>
          ) : (
            todaysFacts.map(fact => (
              <FactCard key={fact.id} fact={fact} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
