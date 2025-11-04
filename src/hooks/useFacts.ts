import { useState, useEffect } from 'react';
import { Fact } from '../types';
import { getFacts, refreshFacts } from '../utils/fetchFacts';
import { getTodayDateString } from '../utils/dateUtils';

export function useFacts() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFacts() {
      try {
        setLoading(true);
        setError(null);
        
        // 날짜 변경 확인: 페이지 로드 시 즉시 확인
        const lastFetchDate = localStorage.getItem('lastFetchDate');
        const todayDate = getTodayDateString();
        
        if (lastFetchDate && lastFetchDate !== todayDate) {
          console.log(`날짜가 변경되었습니다: ${lastFetchDate} → ${todayDate}. 캐시를 무시하고 새 데이터를 가져옵니다.`);
          // 날짜가 바뀌었으면 캐시 무시하고 강제로 새로고침
          const data = await refreshFacts();
          setFacts(data);
        } else {
          const data = await getFacts();
          setFacts(data);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        console.error('Facts 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadFacts();

    // 날짜 변경 감지: 매 분마다 날짜를 확인하고 변경되면 데이터 새로고침
    const checkDateInterval = setInterval(() => {
      const lastFetchDate = localStorage.getItem('lastFetchDate');
      const todayDate = getTodayDateString();
      
      if (lastFetchDate && lastFetchDate !== todayDate) {
        console.log('날짜가 변경되었습니다. 데이터를 새로 가져옵니다.');
        loadFacts();
      }
    }, 60000); // 1분마다 확인

    return () => clearInterval(checkDateInterval);
  }, []);

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await refreshFacts();
      setFacts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('Facts 새로고침 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  return { facts, loading, error, refresh };
}

