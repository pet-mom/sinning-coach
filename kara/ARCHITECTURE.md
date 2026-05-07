# Web Karaoke 아키텍처 가이드

프로토타입(`karaoke.html`)에서 시작해 본격적인 프로덕션 가라오케 앱으로 확장하기 위한 설계 문서입니다.

## 1. 현재 프로토타입에 들어 있는 것

`karaoke.html` 한 파일로 핵심 4가지 기능이 모두 동작합니다.

| 기능 | 구현 방식 | 관련 코드 |
|---|---|---|
| 원곡 재생 | Web Audio `OscillatorNode`로 멜로디 합성 (퍼블릭 도메인 곡 3개 내장) | `MelodyPlayer` 클래스 |
| 가사 싱크 | LRC 포맷 파서 + 현재 줄 강조 (그라디언트 텍스트) | `parseLRC`, `renderLyrics` |
| 음정 채점 | 마이크 → AnalyserNode → autocorrelation으로 F0 추정 → 목표 주파수와 cents 차이 계산 | `autoCorrelate`, `pitchScore` |
| 녹음/저장 | MediaRecorder API → Blob → 다운로드 링크 | `toggleRecord` |

브라우저에서 바로 열어 마이크 권한만 허용하면 작동합니다.

## 2. 프로덕션으로 가기 위한 단계

### Stage 1 — 진짜 음원 재생

현재는 합성 멜로디입니다. MP3/WAV 파일을 재생하려면 `<audio>` 태그 또는 `AudioBufferSourceNode`로 교체하면 됩니다. 채점 정확도를 위해서는 곡의 보컬 멜로디 라인이 시간/주파수로 매핑된 메타데이터(노트 시퀀스)가 필요합니다. UltraStar Deluxe의 `.txt` 포맷이 사실상 표준이고, 이미 수만 곡의 커뮤니티 매핑이 존재합니다.

> 참고: github.com/UltraStar-Deluxe/format

### Stage 2 — 보컬 제거 (MR 자동 생성)

이건 브라우저 단독으로는 어렵습니다. 가능한 옵션:

**옵션 A. 백엔드 처리 (추천)**
- Spleeter (Deezer, TensorFlow): `pip install spleeter`, `spleeter separate -p spleeter:2stems audio.mp3` → vocals/accompaniment 두 트랙 분리
- Demucs (Meta): 더 좋은 품질, 더 느림
- 클라이언트가 MP3 업로드 → FastAPI/Express 서버 → MR 트랙 + 보컬 트랙 반환 → S3에 캐시

**옵션 B. 브라우저에서 ONNX 추론**
- ONNX Runtime Web으로 작은 보컬 분리 모델을 WASM/WebGPU에서 실행
- 품질은 낮고 30초 곡에 수십 초 걸림 — 데모용으로는 가능

**옵션 C. 사전 처리된 라이브러리만 제공**
- 라이브러리에 미리 분리된 MR/원곡/보컬 3종 + 가사 LRC를 묶어 배포
- 사용자 정의 곡 업로드는 막거나 옵션 A로 폴백

### Stage 3 — 음정 채점 고도화

현재 autocorrelation은 가볍지만 노이즈에 약합니다. 업그레이드 경로:

- **Pitchy.js** (github.com/ianprime0509/pitchy): McLeod Pitch Method, 더 정확
- **CREPE / SPICE** (TensorFlow.js): 딥러닝 기반, 모바일에서도 동작
- **세그먼트 단위 채점**: 노트 단위로 평균 cents 차이를 내고 가중 평균 → UltraStar는 "Cool/Awful/Sing" 3단계 평가

### Stage 4 — 곡 데이터 확장

저작권 무료 음원 출처:
- Free Music Archive (freemusicarchive.org) — Creative Commons
- ccMixter (ccmixter.org) — CC-BY/CC-BY-NC
- IMSLP (imslp.org) — 클래식 악보, 일부 음원
- MuseScore Public Domain — MIDI/MusicXML로 받아 합성 가능

가사 + 노트 매핑은 직접 만들거나 UltraStar 커뮤니티 자료(usdb.animux.de 등)를 활용할 수 있습니다 (라이선스 확인 필요).

### Stage 5 — 사용자 경험

- 듀엣/배틀 모드 — WebRTC로 두 사용자 동시 채점
- 영상 배경 — `<video>` 태그로 뮤직비디오 합성
- 스코어보드 + 공유 — 녹음을 서버로 업로드, 공유 링크
- 모바일 PWA — `manifest.json` + Service Worker로 홈화면 설치

## 3. 추천 오픈소스 레퍼런스

직접 프로젝트를 키워가기보다 기존 코드에서 출발하는 게 빠릅니다.

| 프로젝트 | 언어 | 무엇이 좋은가 |
|---|---|---|
| UltraStar Deluxe | Pascal | 노트/가사 포맷, 채점 알고리즘, 수만 곡 라이브러리 |
| Performous | C++ | 멀티플레이어 구조, 마이크 입력 처리 |
| Vocaluxe | C# | UltraStar 호환 + 모던 UI |
| Spleeter / Demucs | Python | 보컬 제거 SOTA |
| Pitchy.js | JS | 브라우저 피치 감지 |
| Tone.js | JS | Web Audio 추상화, 시퀀서 |
| Wavesurfer.js | JS | 파형 시각화, 영역 선택, 가사 매핑 도구 만들 때 유용 |

## 4. 권장 기술 스택 (full app)

```
[Frontend]
- Next.js + React + TypeScript
- Tone.js (오디오 엔진)
- Pitchy.js (피치 감지)
- Wavesurfer.js (파형/가사 매핑 에디터)
- Tailwind CSS

[Backend]
- FastAPI (Python) - Spleeter/Demucs 워커
- Redis Queue - 보컬 분리 작업 큐
- PostgreSQL - 곡 메타/사용자/녹음
- S3/R2 - 오디오 파일 저장

[Infra]
- Docker Compose 로컬 개발
- Railway/Fly.io 배포 (GPU 워커는 RunPod 등)
```

## 5. 다음에 할 만한 작업

1. 프로토타입에 실제 MP3 파일을 `<audio>`로 재생하는 모드 추가
2. LRC 가사 매핑 에디터 (Wavesurfer.js + 클릭으로 타임스탬프 찍기)
3. Pitchy.js로 피치 감지 교체 → 채점 안정성 확인
4. Spleeter 백엔드 1대 띄우고 업로드 → MR 변환 데모
5. 노트 시퀀스 에디터 (UltraStar `.txt` 포맷 입출력)

원하시는 단계부터 같이 만들어 드릴 수 있어요. 다음 스텝은 어디서 시작하고 싶으세요?
