# 🎤 AI 노래방 (SINGING-coach-ai)

음정을 실시간으로 분석하고 AI 코치가 가창 피드백을 제공하는 노래방 애플리케이션입니다.

## ✨ 주요 기능

- 🎵 **레코드 앨범 갤러리**: 비닐 레코드 디자인의 곡 선택 화면
- 🎧 **원음 듣기**: 각 소절을 먼저 들어보고 학습
- 🎤 **실시간 음정 분석**: 노래하는 동안 실시간으로 음정 측정 (자기상관법)
- 📊 **시각적 피드백**: 노래방 스타일의 음정 바와 평가
- 🤖 **AI 코칭**: OpenAI GPT-4o가 상세한 가창 피드백 제공
- 🏆 **결과 리포트**: 소절별 평가와 종합 점수 (S/A/B/C 등급)

## 🛠 기술 스택

- **React 18** - UI 프레임워크
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링 (노래방 테마)
- **Web Audio API** - 음정 감지
- **OpenAI GPT-4o** - AI 피드백

## 🚀 시작하기

### 1. 설치

```bash
npm install
```

### 2. OpenAI API 키 설정

1. `.env.example` 파일을 `.env`로 복사:
```bash
cp .env.example .env
```

2. `.env` 파일을 열고 OpenAI API 키 입력:
```env
VITE_OPENAI_API_KEY=sk-your-api-key-here
```

> 💡 OpenAI API 키는 [OpenAI Platform](https://platform.openai.com/api-keys)에서 발급받을 수 있습니다.

### 3. 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 4. 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

## 🎯 사용 방법

1. **곡 선택**: 레코드 앨범 갤러리에서 원하는 곡 클릭
2. **마이크 권한**: 브라우저에서 마이크 권한 허용
3. **준비**: 3초 카운트다운
4. **듣기**: 원음을 들으며 음정 파악 (각 소절마다)
5. **따라하기**: 음정 바를 보며 노래 부르기
6. **결과 확인**: AI 코치의 상세 피드백 받기

## 🎵 곡 추가하기

새로운 곡을 추가하려면 `src/data/songs.json` 파일에 곡 정보를 추가하세요:

```json
{
  "id": 2,
  "title": "새로운 곡",
  "emoji": "🌟",
  "genre": "발라드",
  "key": "C major",
  "tempo": 120,
  "timeSignature": "4/4",
  "audioUrl": "/audio/new-song.mp3",
  "lines": [
    {
      "lineNumber": 1,
      "text": "가사 첫 줄",
      "mainNote": "C5",
      "targetFreq": 523.25,
      "audioStart": 0,
      "audioEnd": 8,
      "listenDuration": 8,
      "practiceDuration": 8.0
    }
    // ... 더 많은 소절들
  ]
}
```

## 🎯 음정 평가 기준

- **🎉 완벽해요!**: 0.7 반음 이내 차이
- **⭐ 잘하셨어요!**: 0.7~1.5 반음 차이
- **💫 조금만 더!**: 1.5~3.0 반음 차이
- **💪 다시 도전!**: 3.0 반음 이상 차이

## 📁 프로젝트 구조

```
SINGING-coach-ai/
├── public/
│   ├── audio/              # 음원 파일들
│   └── notes/              # 악보 이미지
├── src/
│   ├── data/
│   │   └── songs.json      # 곡 데이터
│   ├── App.jsx             # 메인 컴포넌트
│   └── main.jsx
├── .env.example            # 환경 변수 예제
├── .gitignore
├── tailwind.config.js      # Tailwind 설정 (노래방 테마)
└── package.json
```

## 🎨 UI 테마

- **노래방 컨셉**: 화려한 네온 색상과 그라디언트
- **레코드 샵 분위기**: LP 레코드 디자인의 앨범 커버
- **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- **동심원 패턴**: 실제 비닐 레코드처럼

## 📱 브라우저 호환성

- ✅ Chrome/Edge (권장)
- ✅ Firefox
- ✅ Safari

※ 마이크 권한이 필요하며, HTTPS 환경에서 동작합니다.

## 📄 라이선스

ISC

## 🤝 기여

이슈와 PR은 언제나 환영합니다!
