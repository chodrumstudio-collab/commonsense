  # Daily Knowledge Mobile Web

  This is a code bundle for Daily Knowledge Mobile Web. The original project is available at https://www.figma.com/design/w9sOeLJMic6fTdijavO6sN/Daily-Knowledge-Mobile-Web.

  ## 실행 방법

  ### 1. 의존성 설치
  ```bash
  npm install
  ```

  ### 2. Google Sheets 연동 설정 (선택사항)

  Google Sheets를 사용하여 데이터를 자동으로 가져오려면:

  1. Google Sheets 생성
  2. 다음 열 구조로 데이터 입력:
     - `id`: 상식 ID (1, 2, 3...)
     - `category`: 카테고리 (과학, 역사, 생활, 문화, 건강, 지리)
     - `emoji`: 이모지 (🔬, 🏛️, 💡 등)
     - `title`: 상식 제목
     - `summary`: 요약 (2-3줄)
     - `detail`: 상세 설명
     - `relatedIds`: 관련 상식 ID (세미콜론으로 구분, 예: 2;5;8)
     - `date`: 날짜 (YYYY-MM-DD 형식, 선택사항)
  
  3. 파일 → 공유 → "웹에 게시" → CSV 형식 선택
  4. 생성된 URL을 `.env` 파일에 추가:
     ```
     VITE_GOOGLE_SHEETS_URL=https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/export?format=csv
     ```

  **참고**: Google Sheets URL이 설정되지 않으면 로컬 데이터(`src/data/facts.ts`)를 사용합니다.

  ### 3. 개발 서버 실행
  ```bash
  npm run dev
  ```

  ## 주요 기능

  - 📚 오늘의 상식: 날짜 기반으로 매일 다른 상식 제공
  - 📂 카테고리별 보기: 과학, 역사, 생활 등 카테고리별 필터링
  - 💾 북마크: 마음에 드는 상식 저장
  - 📱 모바일 우선 반응형 디자인
  - 🔄 자동 캐싱: 24시간 동안 캐시된 데이터 사용 (API 호출 최소화)

  ## 데이터 업데이트 방법

  자세한 내용은 `data_update_guide.md` 파일을 참고하세요.

  - **방법 1**: Google Sheets 사용 (추천) - 가장 쉬운 방법
  - **방법 2**: 로컬 JSON 파일 직접 수정 (`src/data/facts.ts`)
  - **방법 3**: Wikipedia API + GitHub Actions (고급)

  ## 기술 스택

  - React 18
  - TypeScript
  - Vite
  - React Router
  - Tailwind CSS
  - Radix UI
  