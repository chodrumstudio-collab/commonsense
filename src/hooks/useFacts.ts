import { useState, useEffect } from 'react';
import { Fact } from '../types';
import { getFacts, refreshFacts } from '../utils/fetchFacts';

export function useFacts() {
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFacts() {
      try {
        setLoading(true);
        setError(null);
        const data = await getFacts();
        setFacts(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        console.error('Facts 로딩 오류:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadFacts();
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

