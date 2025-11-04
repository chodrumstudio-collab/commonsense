import { Fact } from '../types';
import { parseCSV } from './csvParser';
import { facts as localFacts } from '../data/facts';
import { getTodayDateString } from './dateUtils';

// Google Sheets CSV URL
// 사용자가 Google Sheets를 생성하고 "웹에 게시"한 후 여기에 URL을 넣으세요
// Vite에서는 import.meta.env를 사용합니다
const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || '';

/**
 * Google Sheets에서 CSV 데이터를 가져옴
 */
async function fetchDailyFactsFromSheet(): Promise<Fact[]> {
  if (!GOOGLE_SHEETS_URL) {
    console.warn('Google Sheets URL이 설정되지 않았습니다. 로컬 데이터를 사용합니다.');
    return localFacts;
  }

  try {
    const response = await fetch(GOOGLE_SHEETS_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const csv = await response.text();
    const parsedFacts = parseCSV(csv);
    
    // 파싱된 데이터가 있으면 사용, 없으면 로컬 데이터 사용
    if (parsedFacts.length > 0) {
      return parsedFacts;
    } else {
      console.warn('CSV에서 데이터를 파싱할 수 없습니다. 로컬 데이터를 사용합니다.');
      return localFacts;
    }
  } catch (error) {
    console.error('Google Sheets에서 데이터를 가져오는 중 오류 발생:', error);
    console.warn('로컬 데이터를 사용합니다.');
    return localFacts;
  }
}

/**
 * localStorage에서 캐시된 데이터 가져오기
 */
function getCachedFacts(): Fact[] | null {
  try {
    const cached = localStorage.getItem('facts');
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    console.error('캐시 데이터 읽기 오류:', error);
  }
  return null;
}

/**
 * localStorage에 데이터 캐시하기
 */
function setCachedFacts(facts: Fact[]): void {
  try {
    localStorage.setItem('facts', JSON.stringify(facts));
    localStorage.setItem('lastFetch', Date.now().toString());
    localStorage.setItem('lastFetchDate', getTodayDateString());
  } catch (error) {
    console.error('캐시 데이터 저장 오류:', error);
  }
}

/**
 * 마지막 fetch 시간 가져오기
 */
function getLastFetchTime(): number | null {
  try {
    const lastFetch = localStorage.getItem('lastFetch');
    return lastFetch ? parseInt(lastFetch, 10) : null;
  } catch (error) {
    return null;
  }
}

/**
 * 마지막 fetch 날짜 가져오기
 */
function getLastFetchDate(): string | null {
  try {
    return localStorage.getItem('lastFetchDate');
  } catch (error) {
    return null;
  }
}

/**
 * Facts 데이터 가져오기 (캐시 확인 포함)
 * - 오늘 날짜와 마지막 fetch 날짜를 비교하여 날짜가 같으면 캐시 사용
 * - 날짜가 다르거나 캐시가 없으면 새로 fetch
 */
export async function getFacts(): Promise<Fact[]> {
  const cached = getCachedFacts();
  const lastFetchDate = getLastFetchDate();
  const todayDate = getTodayDateString();
  
  // 캐시 확인: 오늘 날짜와 마지막 fetch 날짜가 같으면 캐시 사용
  if (cached && lastFetchDate === todayDate) {
    console.log('캐시된 데이터를 사용합니다.');
    return cached;
  }
  
  // 날짜가 바뀌었거나 캐시가 없으면 새로 fetch
  console.log('새 데이터를 가져옵니다.');
  const facts = await fetchDailyFactsFromSheet();
  setCachedFacts(facts);
  
  return facts;
}

/**
 * 강제로 새로고침 (캐시 무시)
 */
export async function refreshFacts(): Promise<Fact[]> {
  const facts = await fetchDailyFactsFromSheet();
  setCachedFacts(facts);
  return facts;
}

