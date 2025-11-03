/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 날짜 문자열을 한국어 형식으로 변환
 * @param dateString YYYY-MM-DD 형식의 날짜 문자열
 * @returns "2025년 1월 15일" 형식
 */
export function formatDateKorean(dateString?: string): string {
  if (!dateString) {
    return formatDateKorean(getTodayDateString());
  }
  
  const [year, month, day] = dateString.split('-');
  return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일`;
}

/**
 * 현재 날짜를 기준으로 한 연중 일수(1-365 또는 366) 계산
 */
export function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * 날짜 기반 로테이션으로 facts 배열에서 선택
 * 매일 같은 개수의 상식을 보여주며, 연중 일수를 기준으로 순환
 * @param facts Fact 배열
 * @param count 선택할 개수 (기본 5개)
 * @returns 선택된 Fact 배열 (항상 count개 반환, 부족하면 처음부터 반복)
 */
export function getRotatedFactsByDate<T extends { id: string }>(
  facts: T[],
  count: number = 5
): T[] {
  if (facts.length === 0) return [];
  
  const dayOfYear = getDayOfYear();
  
  // 상식 개수를 count로 나눈 그룹 수 계산
  // 예: 100개 상식, 5개씩 보여주면 20개 그룹
  // 예: 12개 상식, 5개씩 보여주면 3개 그룹 (5, 5, 2)
  const totalGroups = Math.ceil(facts.length / count);
  
  // 연중 일수를 그룹 수로 나눈 나머지로 오늘의 그룹 결정
  const todayGroup = dayOfYear % totalGroups;
  
  // 그룹의 시작 인덱스 계산
  const startIndex = todayGroup * count;
  
  // result 배열에 count개 채우기
  const result: T[] = [];
  for (let i = 0; i < count; i++) {
    // 배열을 순환하면서 가져오기
    const index = (startIndex + i) % facts.length;
    result.push(facts[index]);
  }
  
  return result;
}

