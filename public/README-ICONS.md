# 아이콘 파일 안내

이 폴더에는 웹사이트의 파비콘과 아이콘 파일들이 있습니다.

## 필요한 파일들

### 현재 생성된 파일
- `favicon.svg` - 기본 파비콘 (SVG 형식)
- `icon-source.svg` - 아이콘 소스 파일 (180x180)
- `manifest.json` - PWA 매니페스트 파일

### 생성이 필요한 파일
- `apple-touch-icon.png` - iOS 홈 화면 아이콘 (180x180 PNG)

## 아이콘 생성 방법

### 방법 1: 온라인 변환기 사용
1. `icon-source.svg` 파일을 열기
2. 온라인 SVG to PNG 변환기 사용 (예: https://cloudconvert.com/svg-to-png)
3. 180x180 크기로 변환
4. `public/apple-touch-icon.png`로 저장

### 방법 2: 이미지 편집 도구 사용
1. Figma, Photoshop, GIMP 등에서 `icon-source.svg` 열기
2. 180x180 픽셀로 내보내기
3. `public/apple-touch-icon.png`로 저장

### 방법 3: AI 이미지 생성 (generate-image.sh 사용)
프로젝트 루트에 `generate-image.sh` 스크립트가 있다면:
```bash
./generate-image.sh "일일 상식 앱 아이콘, 책 이모지, 파란색 배경"
```

## 현재 상태
- ✅ Favicon (SVG) - 브라우저 탭에 표시
- ✅ Manifest - PWA 설정
- ⏳ Apple Touch Icon - iOS 홈 화면에 추가 시 필요

