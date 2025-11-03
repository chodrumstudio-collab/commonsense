import { Fact } from '../types';

/**
 * CSV 문자열을 Fact 배열로 변환
 * @param csv CSV 형식의 문자열
 * @returns Fact 배열
 */
export function parseCSV(csv: string): Fact[] {
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return [];

  // 헤더 추출
  const headers = lines[0].split(',').map(h => h.trim());
  
  // 데이터 행 파싱
  return lines.slice(1).map((line, index) => {
    // 쉼표로 분리하되, 큰따옴표 안의 쉼표는 제외
    const values: string[] = [];
    let currentValue = '';
    let insideQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        values.push(currentValue.trim());
        currentValue = '';
      } else {
        currentValue += char;
      }
    }
    values.push(currentValue.trim()); // 마지막 값
    
    const obj: any = {};
    
    headers.forEach((header, idx) => {
      let value = values[idx]?.trim() || '';
      // 큰따옴표 제거
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      obj[header] = value;
    });
    
    // 필드명 매핑 (Google Sheets → Fact 인터페이스)
    const fact: any = {
      id: obj.id ? String(obj.id) : String(index + 1),
      title: obj.title || '',
      category: obj.category || '',
      shortDescription: obj.summary || obj.shortDescription || '',
      fullContent: obj.detail || obj.fullContent || '',
      relatedFacts: [],
      date: obj.date || undefined,
    };
    
    // relatedIds 또는 relatedFacts를 배열로 변환 (세미콜론 또는 쉼표로 구분)
    const relatedIdsValue = obj.relatedIds || obj.relatedFacts || '';
    if (relatedIdsValue) {
      fact.relatedFacts = relatedIdsValue
        .split(/[;,]/)
        .map((id: string) => String(id.trim()))
        .filter((id: string) => id.length > 0);
    }
    
    // 필수 필드 확인
    if (!fact.title || !fact.category) {
      return null;
    }
    
    return fact as Fact;
  }).filter((fact): fact is Fact => fact !== null);
}

