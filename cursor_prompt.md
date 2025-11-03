# 커서 개발 프롬프트: 일일 상식 모바일 웹 애플리케이션

## 프로젝트 개요
매일 3-5개의 일반 상식을 제공하는 모바일 우선 웹 애플리케이션. 개인 학습용으로 심플한 기능 구현.

## 기술 스택 제안

### 프론트엔드
- **프레임워크**: React (Next.js 또는 Vite)
- **스타일링**: Tailwind CSS
- **상태 관리**: React Context API 또는 Zustand (가볍게)
- **로컬 스토리지**: localStorage API (북마크 저장용)
- **라우팅**: React Router (SPA) 또는 Next.js App Router

### 데이터 관리 (자동 업데이트)
- **데이터 소스**: 무료 API 또는 자동 생성 시스템
- **저장소**: 브라우저 localStorage (북마크, 방문 기록)
- **자동화**: GitHub Actions 또는 Vercel Cron Jobs

## 무료 데이터 자동 업데이트 방법

### 방법 1: Wikipedia API + AI 요약 (추천)
```javascript
// Wikipedia의 "오늘" 또는 랜덤 페이지에서 상식 추출
// 무료 Wikipedia API: https://www.mediawiki.org/wiki/API:Main_page
// 1. Wikipedia "On this day" API로 오늘의 역사 가져오기
// 2. Wikipedia Random API로 랜덤 문서 가져오기
// 3. 간단한 파싱 후 상식 형태로 변환
```

**장점**: 완전 무료, 신뢰할 수 있는 데이터, 매일 자동 업데이트  
**단점**: 파싱 및 가공 필요

### 방법 2: Open Trivia Database API
```javascript
// URL: https://opentdb.com/api.php?amount=5&type=multiple
// 무료 퀴즈/상식 API
```

**장점**: 완전 무료, API로 바로 사용 가능  
**단점**: 영어 데이터 (번역 필요)

### 방법 3: Google Sheets를 무료 DB로 활용 (최고 추천!)
```javascript
// Google Sheets API 또는 공개 시트 CSV로 내보내기
// 1. Google Sheets에 상식 데이터 입력 (직접 관리)
// 2. 시트를 CSV로 공개 → 매일 fetch로 불러오기
// 3. 또는 Google Sheets API 사용 (무료 할당량)

// CSV URL 예시:
// https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv
```

**장점**: 완전 무료, 직접 관리 가능, 쉬운 업데이트  
**단점**: 수동으로 데이터 입력 필요

### 방법 4: GitHub + JSON 파일 + GitHub Actions
```yaml
# .github/workflows/update-facts.yml
# 매일 자동으로 새로운 상식 추가하는 워크플로우

name: Daily Facts Update
on:
  schedule:
    - cron: '0 0 * * *'  # 매일 자정 실행
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Fetch new facts
        run: |
          # Wikipedia API 호출
          # JSON 파일 업데이트
          # Git commit & push
```

**장점**: 완전 자동화, 무료, GitHub 호스팅  
**단점**: 워크플로우 설정 필요

### 방법 5: Notion API를 무료 CMS로 활용
```javascript
// Notion을 무료 콘텐츠 관리 시스템으로 사용
// Notion API로 데이터 fetch (무료)
// 1. Notion 데이터베이스에 상식 입력
// 2. Notion API로 읽어오기
// 3. 캐싱으로 API 호출 최소화
```

**장점**: 무료, UI 편리, 직접 관리  
**단점**: API 설정 필요

## 추천 구현 방식

### 최적 솔루션: Google Sheets + 매일 자동 fetch

#### 1단계: Google Sheets 설정
```
시트 구조:
| id | category | emoji | title | summary | detail | relatedIds | date |
|----|----------|-------|-------|---------|--------|------------|------|
| 1  | 과학     | 🔬    | ...   | ...     | ...    | 2,5        | 2025-11-03 |
```

#### 2단계: 시트를 웹에 공개
- 파일 → 공유 → "웹에 게시" → CSV 형식
- 생성된 URL 복사

#### 3단계: 앱에서 fetch
```javascript
// src/utils/fetchFacts.js
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv';

export async function fetchDailyFacts() {
  const response = await fetch(SHEET_URL);
  const csv = await response.text();
  
  // CSV를 JSON으로 파싱
  const facts = parseCSV(csv);
  
  // localStorage에 캐싱 (API 호출 최소화)
  localStorage.setItem('facts', JSON.stringify(facts));
  localStorage.setItem('lastFetch', Date.now());
  
  return facts;
}

// 매일 한 번만 fetch
export async function getFacts() {
  const cached = localStorage.getItem('facts');
  const lastFetch = localStorage.getItem('lastFetch');
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  
  if (cached && lastFetch && lastFetch > oneDayAgo) {
    return JSON.parse(cached);
  }
  
  return await fetchDailyFacts();
}
```

#### 4단계: 매일 새로운 상식 표시
```javascript
// 오늘 날짜에 해당하는 상식만 필터링
const today = new Date().toISOString().split('T')[0]; // '2025-11-03'
const todayFacts = allFacts.filter(fact => fact.date === today);

// 또는 날짜 기반 로테이션
const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
const todayIndex = dayOfYear % allFacts.length;
const todayFacts = allFacts.slice(todayIndex, todayIndex + 5);
```

## 폴더 구조
```
src/
├── components/
│   ├── Card.jsx              # 상식 카드 컴포넌트
│   ├── DetailView.jsx        # 상세 보기
│   ├── Navigation.jsx        # 하단 네비게이션
│   └── BookmarkButton.jsx    # 북마크 버튼
├── pages/
│   ├── Home.jsx              # 메인 화면
│   ├── CategoryList.jsx      # 카테고리 목록
│   ├── CategoryDetail.jsx    # 카테고리별 상식
│   └── Bookmarks.jsx         # 북마크 화면
├── data/
│   └── facts.json            # 상식 데이터 (백업용)
├── hooks/
│   ├── useBookmarks.js       # 북마크 관리 훅
│   └── useFacts.js           # 상식 데이터 관리 훅
└── utils/
    ├── fetchFacts.js         # Google Sheets에서 데이터 가져오기
    ├── csvParser.js          # CSV 파싱 유틸
    └── dateUtils.js          # 날짜 관련 유틸
```

## 핵심 기능 구현 요구사항

### 1. 데이터 구조 (facts.json)
```json
[
  {
    "id": 1,
    "category": "과학",
    "emoji": "🔬",
    "title": "물은 왜 투명할까?",
    "summary": "물 분자는 가시광선을 흡수하지 않고 통과시켜 투명하게 보입니다.",
    "detail": "물 분자는 가시광선 영역의 빛을 흡수하지 않고 통과시켜...(상세 내용)",
    "relatedIds": [2, 5],
    "date": "2025-11-03"
  }
]
```

### 2. 메인 화면 (Home)
- 오늘 날짜 기준으로 3-5개 상식 자동 노출
- 날짜별로 다른 상식 보여주기 (날짜 기반 필터링)
- 각 카드 클릭 시 상세 화면으로 이동
- 무한 스크롤 또는 페이지네이션 (선택)

### 3. 상세 화면
- 전체 내용 표시
- 북마크 토글 버튼 (localStorage에 저장)
- 관련 상식 링크 (relatedIds 활용)
- 뒤로가기 네비게이션

### 4. 카테고리 화면
- 전체 카테고리 리스트
- 각 카테고리 클릭 시 해당 카테고리 상식만 필터링
- 카테고리별 상식 개수 표시

### 5. 북마크 화면
- localStorage에서 북마크된 상식 ID 가져오기
- 북마크된 상식 리스트 표시
- 북마크 해제 기능
- 빈 상태 UI

### 6. 로컬 스토리지 구조
```javascript
// localStorage keys
bookmarks: [1, 5, 8, ...]  // 북마크된 상식 ID 배열
visitHistory: {
  "2025-11-03": [1, 2, 3],  // 날짜별 본 상식 ID
}
```

## 구현 우선순위

### Phase 1 (MVP)
1. 기본 라우팅 설정 (홈, 상세, 카테고리, 북마크)
2. Google Sheets 연동 및 CSV fetch 구현
3. 데이터 캐싱 로직 (localStorage)
4. 카드 컴포넌트 구현
5. 상세 화면 구현
6. 북마크 기능 (localStorage)

### Phase 2 (개선)
1. 날짜별 상식 자동 변경 로직
2. 카테고리 필터링
3. 반응형 디자인 최적화
4. 로딩 상태 및 에러 처리
5. 검색 기능 (선택)

### Phase 3 (고급)
1. PWA 설정 (오프라인 지원)
2. 다크 모드
3. 알림 기능 (웹 푸시)
4. 상식 데이터 API 전환

## 스타일링 가이드

### Tailwind CSS 클래스 예시
- 카드: `bg-white rounded-xl shadow-md p-6 mb-4`
- 제목: `text-xl font-bold text-gray-800`
- 본문: `text-gray-600 text-sm leading-relaxed`
- 버튼: `px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600`

### 반응형
- 모바일 우선: 기본 375px 기준
- 태블릿: max-width 768px
- 데스크톱: max-width 1024px (센터 정렬)

## 개발 시 주의사항
1. 모바일 터치 최적화 (최소 터치 영역 44x44px)
2. localStorage 용량 제한 고려 (5-10MB)
3. 날짜 관리 시 타임존 고려
4. 초기 로딩 속도 최적화 (Lazy loading)
5. 접근성(a11y) 고려 (시맨틱 HTML, ARIA 레이블)

## 테스트용 더미 데이터
최소 20-30개의 다양한 카테고리 상식 데이터 준비 필요.

## 배포
- Vercel, Netlify, GitHub Pages 등 정적 호스팅
- 환경변수 없이 순수 프론트엔드로 구현
- Google Sheets URL만 하드코딩하면 됨

## 실제 구현 코드 예시

### CSV 파싱 유틸 (csvParser.js)
```javascript
export function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    
    headers.forEach((header, index) => {
      obj[header.trim()] = values[index]?.trim() || '';
    });
    
    // relatedIds를 배열로 변환
    if (obj.relatedIds) {
      obj.relatedIds = obj.relatedIds.split(';').map(id => parseInt(id));
    }
    
    return obj;
  });
}
```

### useFacts 훅 (useFacts.js)
```javascript
import { useState, useEffect } from 'react';
import { getFacts } from '../utils/fetchFacts';

export function useFacts() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadFacts() {
      try {
        const data = await getFacts();
        setFacts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadFacts();
  }, []);

  return { facts, loading, error };
}
```

### 오늘의 상식 필터링 (Home.jsx)
```javascript
import { useFacts } from '../hooks/useFacts';

function Home() {
  const { facts, loading, error } = useFacts();
  
  // 방법 1: 날짜 필드로 필터링
  const today = new Date().toISOString().split('T')[0];
  const todayFacts = facts.filter(fact => fact.date === today);
  
  // 방법 2: 날짜 기반 로테이션 (365일 순환)
  const dayOfYear = Math.floor(
    (new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const startIndex = (dayOfYear * 5) % facts.length;
  const rotatedFacts = facts.slice(startIndex, startIndex + 5);
  
  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  
  return (
    <div>
      <h1>오늘의 상식</h1>
      {todayFacts.map(fact => (
        <Card key={fact.id} fact={fact} />
      ))}
    </div>
  );
}
```

## Google Sheets 템플릿

### 시트 설정 방법
1. Google Sheets 새 문서 생성
2. 첫 행에 헤더 입력:
   ```
   id | category | emoji | title | summary | detail | relatedIds | date
   ```
3. 데이터 입력 예시:
   ```
   1 | 과학 | 🔬 | 물은 왜 투명할까? | 물 분자는... | 물 분자는 가시광선... | 2;5 | 2025-11-03
   2 | 역사 | 🏛️ | 한글의 탄생 | 세종대왕이... | 1443년 세종대왕은... | 1;8 | 2025-11-03
   ```
4. 파일 → 공유 → 링크 있는 모든 사용자
5. 파일 → 공유 → 웹에 게시 → CSV 선택
6. 생성된 URL을 `fetchFacts.js`에 넣기

### 자동 업데이트 방법
- **매일 수동**: 매일 아침 시트에 새 상식 5개 추가
- **일괄 작성**: 한 달치 상식을 미리 작성하고 날짜 설정
- **Google Apps Script**: 시트에서 자동으로 Wikipedia API 호출 (고급)

## 추가 기능 아이디어 (옵션)
- 방문 스트릭(연속 방문일) 표시
- 퀴즈 모드 (상식 기반 OX 퀴즈)
- 랜덤 상식 뽑기
- 상식 공유 기능 (링크 복사)
- 읽은 상식 진행률 표시

## 무료 API 추가 옵션

### 1. Wikipedia API 활용 예시
```javascript
// "오늘의 역사" 가져오기
const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();

const url = `https://api.wikimedia.org/feed/v1/wikipedia/ko/onthisday/all/${month}/${day}`;
// 무료, 인증 불필요, 한국어 지원
```

### 2. Numbers API (숫자 상식)
```javascript
// URL: http://numbersapi.com/random/trivia
// 무료, 인증 불필요
// 예: "42 is the number of laws of cricket"
```

### 3. REST Countries API (국가 정보)
```javascript
// URL: https://restcountries.com/v3.1/all
// 무료, 국가별 상식/정보
```

### 4. 직접 크롤링 (주의사항)
```javascript
// 주의: 저작권 및 robots.txt 확인 필수
// 추천 소스:
// - 나무위키 오늘의 문서 (CC BY-NC-SA)
// - 위키백과 알고 계십니까 섹션
// - 공공데이터 포털의 상식 데이터셋
```

## 데이터 업데이트 자동화 (고급)

### GitHub Actions로 자동 크롤링
```yaml
# .github/workflows/daily-update.yml
name: Daily Facts Update

on:
  schedule:
    - cron: '0 0 * * *'  # 매일 자정 KST
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Fetch Wikipedia data
        run: |
          node scripts/fetch-wikipedia.js
      
      - name: Commit and push
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add src/data/facts.json
          git commit -m "Auto-update: $(date +'%Y-%m-%d')" || exit 0
          git push
```

### scripts/fetch-wikipedia.js 예시
```javascript
const fs = require('fs');

async function fetchDailyFacts() {
  const date = new Date();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const response = await fetch(
    `https://api.wikimedia.org/feed/v1/wikipedia/ko/onthisday/all/${month}/${day}`
  );
  const data = await response.json();
  
  // 데이터 가공
  const facts = data.events.slice(0, 5).map((event, index) => ({
    id: Date.now() + index,
    category: '역사',
    emoji: '🏛️',
    title: event.text,
    summary: event.text.substring(0, 100) + '...',
    detail: event.text,
    relatedIds: [],
    date: date.toISOString().split('T')[0]
  }));
  
  // JSON 파일에 추가
  const existingFacts = JSON.parse(
    fs.readFileSync('src/data/facts.json', 'utf8')
  );
  
  const updated = [...existingFacts, ...facts];
  fs.writeFileSync(
    'src/data/facts.json',
    JSON.stringify(updated, null, 2)
  );
}

fetchDailyFacts();
```

---

## 시작 명령어
```bash
# Vite + React 기준
npm create vite@latest daily-facts -- --template react
cd daily-facts
npm install
npm install -D tailwindcss postcss autoprefixer
npm install react-router-dom
npx tailwindcss init -p
npm run dev
```

이 프롬프트를 기반으로 단계적으로 개발을 진행하세요!
