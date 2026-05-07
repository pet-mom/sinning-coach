import { useState, useRef, useEffect } from "react";
import songsData from "./data/songs.json";

// ─── 음표 주파수 (JSON에서 가져옴) ────────────────────────────────────────────
const NF = songsData.noteFrequencies;

// ─── 곡 목록 (JSON에서 가져옴) ────────────────────────────────────────────────
const SONGS = songsData.songs;


// ─── 음정 감지 (자기상관법) ───────────────────────────────────────────────────
function detectPitch(analyser, sampleRate) {
  const full = new Float32Array(analyser.fftSize);
  analyser.getFloatTimeDomainData(full);

  let rms = 0;
  for (let i = 0; i < full.length; i++) rms += full[i] * full[i];
  rms = Math.sqrt(rms / full.length);
  if (rms < 0.02) return -1;

  const buf = full.subarray(0, Math.min(1024, full.length));
  const minPer = Math.floor(sampleRate / 900);
  const maxPer = Math.min(Math.floor(sampleRate / 70), buf.length / 2);

  let bestCorr = 0, bestOff = -1;
  for (let off = minPer; off <= maxPer; off++) {
    let corr = 0;
    const n = Math.min(512, buf.length - off);
    for (let i = 0; i < n; i++) corr += buf[i] * buf[i + off];
    corr /= n;
    if (corr > bestCorr) { bestCorr = corr; bestOff = off; }
  }
  return bestOff > 0 && bestCorr > 0.005 ? sampleRate / bestOff : -1;
}

function semitones(detected, target) {
  if (!detected || detected < 0 || !target) return null;
  return 12 * Math.log2(detected / target);
}

function accuracy(st) {
  if (st === null) return "none";
  const a = Math.abs(st);
  if (a < 0.7) return "perfect";
  if (a < 1.5) return "good";
  if (a < 3.0) return "fair";
  return "off";
}

const ACC_COLOR = {
  perfect: "#39FF14",  // 네온 그린
  good: "#FFD700",     // 골드
  fair: "#FF6B35",     // 오렌지
  off: "#FF1493",      // 핫핑크
  none: "#888888"      // 회색
};
const ACC_LABEL = {
  perfect: "🎉 완벽해요!",
  good: "⭐ 잘하셨어요!",
  fair: "💫 조금만 더!",
  off: "💪 다시 도전!",
  none: "🎤 노래해보세요"
};

// ─── 메인 컴포넌트 ────────────────────────────────────────────────────────────
export default function SingingCoach() {
  const [phase, setPhase] = useState("select");
  const [song, setSong] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [lineIdx, setLineIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pitchHz, setPitchHz] = useState(null);
  const [acc, setAcc] = useState("none");
  const [sessionData, setSessionData] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [listenCountdown, setListenCountdown] = useState(3);

  const songRef = useRef(null);
  const lineRef = useRef(0);
  const lineStartRef = useRef(0);
  const samplesRef = useRef([]);
  const sessionRef = useRef([]);
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const timerRef = useRef(null);
  const loopRef = useRef(null);
  const audioRef = useRef(null);

  // ── 클린업 ─────────────────────────────────────────────────────────────────
  function cleanup() {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(timerRef.current);
    stopAudio();
    streamRef.current?.getTracks().forEach(t => t.stop());
    try { ctxRef.current?.close(); } catch {}
    streamRef.current = null; ctxRef.current = null; analyserRef.current = null;
  }

  // ── MP3 음원 재생 (시작/끝 시간 지원) ──────────────────────────────────────
  function playAudio(audioUrl, startTime = 0, endTime = null) {
    stopAudio(); // 이전 오디오 정리

    try {
      const audio = new Audio(audioUrl);
      audio.volume = 0.7;

      // 오디오가 로드되면 시작 시간 설정
      audio.addEventListener('loadedmetadata', () => {
        audio.currentTime = startTime;
        console.log(`오디오 구간 재생: ${startTime}초 ~ ${endTime}초`);
      });

      // 끝 시간이 지정된 경우 해당 시간에 정지
      if (endTime !== null) {
        const checkTime = setInterval(() => {
          if (audio.currentTime >= endTime) {
            audio.pause();
            clearInterval(checkTime);
            console.log('구간 재생 완료');
          }
        }, 50); // 더 정확한 타이밍을 위해 50ms로 체크

        // 오디오가 끝나거나 정지되면 interval 정리
        audio.addEventListener('ended', () => clearInterval(checkTime));
        audio.addEventListener('pause', () => clearInterval(checkTime));
      }

      audio.play().catch(e => {
        console.error('오디오 재생 오류:', e);
      });
      audioRef.current = audio;
    } catch (e) {
      console.error('오디오 로드 오류:', e);
    }
  }

  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  }

  // ── 라인 이동 ────────────────────────────────────────────────────────────────
  function advanceLine(fromIdx) {
    const s = songRef.current;
    if (!s) return;
    const samples = [...samplesRef.current];
    const avgFreq = samples.length
      ? samples.reduce((a, b) => a + b, 0) / samples.length : 0;

    const line = s.lines[fromIdx];
    sessionRef.current.push({
      text: line.text,
      note: line.note || line.mainNote,
      targetFreq: line.targetFreq,
      avgFreq,
      count: samples.length
    });
    samplesRef.current = [];

    const next = fromIdx + 1;
    if (next >= s.lines.length) {
      cancelAnimationFrame(rafRef.current);
      cleanup();
      setSessionData([...sessionRef.current]);
      setPhase("analyzing");
    } else {
      // 다음 소절로 이동 - 먼저 듣기 단계로
      lineRef.current = next;
      setLineIdx(next);
      setProgress(0);
      cancelAnimationFrame(rafRef.current);
      setPhase("listening");
    }
  }

  // ── 피치 루프 ────────────────────────────────────────────────────────────────
  loopRef.current = function pitchLoop() {
    if (!analyserRef.current || !ctxRef.current) return;
    const freq = detectPitch(analyserRef.current, ctxRef.current.sampleRate);
    const s = songRef.current;
    const target = s?.lines[lineRef.current]?.targetFreq;

    if (freq > 0) {
      setPitchHz(Math.round(freq));
      const st = semitones(freq, target);
      setAcc(accuracy(st));
      samplesRef.current.push(freq);
    } else {
      setPitchHz(null);
      setAcc("none");
    }

    if (lineStartRef.current && s) {
      const curLine = s.lines[lineRef.current];
      const duration = curLine?.practiceDuration ? curLine.practiceDuration * 1000 : 8000;
      const elapsed = Date.now() - lineStartRef.current;
      setProgress(Math.min(elapsed / duration, 1));
    }
    rafRef.current = requestAnimationFrame(() => loopRef.current());
  };

  // ── 곡 선택 시 오디오 미리 초기화 (사용자 제스처 내) ────────────────────────
  const [micError, setMicError] = useState("");

  async function initAudio(s) {
    try {
      setMicError("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      await ctx.resume();
      ctxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.4;
      src.connect(analyser);
      analyserRef.current = analyser;
      setSong(s);
      setPhase("countdown");
    } catch (e) {
      setMicError("마이크 권한이 필요합니다. 브라우저 주소창 옆 🔒 아이콘에서 마이크를 허용해주세요.");
    }
  }

  // ── 노래 시작 (오디오는 이미 준비됨) ─────────────────────────────────────────
  function startSinging(s) {
    if (!analyserRef.current || !ctxRef.current) {
      setMicError("마이크가 준비되지 않았습니다. 곡을 다시 선택해주세요.");
      setPhase("select");
      return;
    }
    songRef.current = s;
    lineRef.current = 0;
    samplesRef.current = [];
    sessionRef.current = [];

    setLineIdx(0);
    setProgress(0);
    // 첫 소절 듣기부터 시작
    setPhase("listening");
  }

  // ── 특정 소절 연습 시작 ────────────────────────────────────────────────────────
  function startPracticeLine() {
    const curLine = songRef.current?.lines[lineRef.current];
    const duration = curLine?.practiceDuration ? curLine.practiceDuration * 1000 : 8000;

    lineStartRef.current = Date.now();
    setProgress(0);
    setPhase("singing");
    rafRef.current = requestAnimationFrame(() => loopRef.current());
    timerRef.current = setTimeout(() => advanceLine(lineRef.current), duration);
  }

  // ── 카운트다운 ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "countdown") return;
    let n = 3; setCountdown(n);
    const id = setInterval(() => {
      n--;
      if (n <= 0) { clearInterval(id); startSinging(song); }
      else setCountdown(n);
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // ── 듣기 단계 (MP3 음원 재생 with 시작/끝 시간) ─────────────────────────────
  useEffect(() => {
    if (phase !== "listening") return;

    // MP3 음원 재생 (전체 파일 또는 구간 재생)
    const song = songRef.current;
    const curLine = song?.lines[lineRef.current];

    if (curLine) {
      // audioUrl이 있으면 해당 파일 사용, 없으면 song.audioUrl 사용
      const audioUrl = curLine.audioUrl || song?.audioUrl;
      const startTime = curLine.audioStart || 0;
      const endTime = curLine.audioEnd || null;

      if (audioUrl) {
        playAudio(audioUrl, startTime, endTime);
      }
    }

    // listenDuration 사용 - 오디오 재생 시간과 동일하게
    const audioLength = (curLine?.audioEnd || 0) - (curLine?.audioStart || 0);
    const listenTime = Math.ceil(audioLength); // 오디오 길이를 올림

    console.log(`미리듣기: ${listenTime}초 (오디오: ${audioLength}초)`);

    let n = listenTime;
    setListenCountdown(n);

    const id = setInterval(() => {
      n--;
      if (n <= 0) {
        clearInterval(id);
        stopAudio();
        startPracticeLine();
      }
      else setListenCountdown(n);
    }, 1000);

    return () => {
      clearInterval(id);
      stopAudio();
    };
  }, [phase, lineIdx]);

  // ── OpenAI 피드백 ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "analyzing" || !sessionData.length) return;
    setIsLoading(true);

    const analysis = sessionData.map((d, i) => {
      const st = d.avgFreq > 0 ? (12 * Math.log2(d.avgFreq / d.targetFreq)).toFixed(2) : null;
      const status = !st ? "소리 없음"
        : Math.abs(st) < 0.7 ? "정확"
        : Math.abs(st) < 1.5 ? "약간 이탈"
        : Math.abs(st) < 3 ? "이탈"
        : "많이 이탈";
      const dir = st ? (parseFloat(st) > 0 ? "높음" : "낮음") : "";
      return `${i + 1}. "${d.text}" → 목표:${d.note}(${Math.round(d.targetFreq)}Hz) / 평균:${d.avgFreq > 0 ? Math.round(d.avgFreq) + "Hz" : "없음"} / 상태:${status}${dir ? "(" + dir + ")" : ""}${st ? " / " + st + "반음차이" : ""}`;
    }).join("\n");

    const title = songRef.current?.title || song?.title || "알 수 없는 곡";

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      setFeedback("⚠️ OpenAI API 키가 설정되지 않았습니다.\n\n.env 파일에 VITE_OPENAI_API_KEY를 설정해주세요.");
      setPhase("feedback");
      setIsLoading(false);
      return;
    }

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        max_tokens: 1000,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: "당신은 친근하고 전문적인 보컬 코치입니다. 노래 분석 결과를 바탕으로 구체적이고 실용적인 가창 조언을 제공합니다. 이모지를 적절히 사용하여 친근한 분위기를 만듭니다."
          },
          {
            role: "user",
            content: `"${title}" 노래 가창 분석 결과입니다:\n\n${analysis}\n\n아래 형식으로 친근하고 구체적인 가창 코칭을 해주세요:\n\n1) 각 가사 라인별 음정 평가 및 개선 방법\n2) 전반적인 총평\n3) 오늘의 연습 팁 1가지\n\n이모지를 활용하고 마크다운 없이 일반 텍스트로만 작성해주세요.`
          }
        ]
      })
    })
      .then(r => r.json())
      .then(data => {
        const text = data.choices?.[0]?.message?.content || "피드백을 받지 못했습니다.";
        setFeedback(text);
        setPhase("feedback");
      })
      .catch((error) => {
        console.error('OpenAI API 오류:', error);
        setFeedback("피드백을 가져오는 중 오류가 발생했습니다. API 키를 확인해주세요.");
        setPhase("feedback");
      })
      .finally(() => setIsLoading(false));
  }, [phase, sessionData]);

  useEffect(() => () => cleanup(), []);

  const acColor = ACC_COLOR[acc] || ACC_COLOR.none;

  // ─── 화면 1: 곡 선택 (레코드 앨범 갤러리) ────────────────────────────────────
  if (phase === "select") {
    // 플레이스홀더 앨범들 (향후 곡 추가될 자리)
    const placeholderAlbums = [
      { id: 'p1', title: 'Coming Soon', emoji: '🎵', genre: '추가 예정', locked: true },
      { id: 'p2', title: 'New Song', emoji: '🎶', genre: '준비중', locked: true },
      { id: 'p3', title: 'More Hits', emoji: '🎼', genre: '업데이트 예정', locked: true },
      { id: 'p4', title: 'Classic', emoji: '🎹', genre: '곧 공개', locked: true },
      { id: 'p5', title: 'Popular', emoji: '🎸', genre: '추가 예정', locked: true },
      { id: 'p6', title: 'Latest', emoji: '🎺', genre: '준비중', locked: true },
    ];

    const allAlbums = [...SONGS, ...placeholderAlbums];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 font-sans flex flex-col items-center p-8 gap-8 relative overflow-hidden">
        {/* 배경 - 레코드 샵 느낌 */}
        <div className="absolute inset-0 bg-neon-grid opacity-10" style={{backgroundSize: '40px 40px'}}></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0px, transparent 2px, transparent 100px, rgba(0,0,0,0.3) 102px)',
        }}></div>

        {/* 조명 효과 */}
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-karaoke-accent rounded-full blur-3xl opacity-20 animate-pulse-glow"></div>
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-karaoke-primary rounded-full blur-3xl opacity-20 animate-pulse-glow" style={{animationDelay: '1s'}}></div>

        {/* 헤더 - 레코드 샵 간판 */}
        <div className="text-center mb-6 animate-slide-in relative z-10">
          <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 px-12 py-6 rounded-2xl shadow-2xl border-8 border-yellow-700 relative">
            {/* 네온 효과 */}
            <div className="absolute inset-0 bg-yellow-400 opacity-20 blur-xl rounded-2xl animate-pulse"></div>
            <div className="relative flex items-center justify-center gap-4">
              <span className="text-6xl animate-float">💿</span>
              <h1 className="font-concert text-6xl font-black text-red-900 drop-shadow-lg">
                AI 노래방
              </h1>
              <span className="text-6xl animate-float" style={{animationDelay: '0.5s'}}>🎤</span>
            </div>
            <p className="text-red-800 text-xl font-black mt-2 relative">🎵 명곡 컬렉션 🎵</p>
          </div>
        </div>

        {/* 앨범 선택 타이틀 */}
        <div className="bg-gradient-to-r from-karaoke-primary to-karaoke-accent text-white px-10 py-4 rounded-full font-black text-2xl shadow-2xl animate-pulse-glow relative z-10 border-4 border-white/50">
          📀 앨범을 선택하세요 📀
        </div>

        {/* 레코드 앨범 갤러리 - 선반 스타일 */}
        <div className="w-full max-w-[1200px] relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
            {allAlbums.map((album, idx) => {
              const isLocked = album.locked;
              const isAvailable = !isLocked;

              return (
                <div
                  key={album.id}
                  className="relative group"
                  style={{animationDelay: `${idx * 0.1}s`}}
                >
                  {/* 레코드 앨범 커버 */}
                  <button
                    className={`w-full aspect-square rounded-2xl border-8 shadow-2xl transition-all duration-300 relative overflow-hidden ${
                      isAvailable
                        ? 'border-yellow-600 hover:-translate-y-4 hover:scale-105 hover:shadow-karaoke-primary cursor-pointer'
                        : 'border-gray-600 cursor-not-allowed opacity-60'
                    }`}
                    onClick={() => isAvailable && initAudio(album)}
                    disabled={isLocked}
                    style={{
                      background: isAvailable
                        ? `linear-gradient(135deg, #${Math.floor(Math.random()*16777215).toString(16)}, #${Math.floor(Math.random()*16777215).toString(16)})`
                        : 'linear-gradient(135deg, #333333, #111111)'
                    }}
                  >
                    {/* 비닐 레코드 홈 패턴 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-full relative">
                        {/* 동심원 패턴 */}
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute rounded-full border-2 border-white/20"
                            style={{
                              width: `${90 - i * 10}%`,
                              height: `${90 - i * 10}%`,
                              top: `${5 + i * 5}%`,
                              left: `${5 + i * 5}%`,
                            }}
                          />
                        ))}
                        {/* 중앙 라벨 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full w-1/2 h-1/2 flex flex-col items-center justify-center shadow-xl border-4 border-black/20">
                            <div className="text-6xl mb-2 group-hover:scale-125 transition-transform">
                              {album.emoji}
                            </div>
                            <div className="text-black font-concert text-lg font-black text-center px-2">
                              {album.title}
                            </div>
                            <div className="text-black/70 text-xs font-bold mt-1">
                              {album.genre}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 잠금 표시 */}
                    {isLocked && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                        <div className="text-center">
                          <div className="text-6xl mb-2">🔒</div>
                          <div className="text-white font-bold text-lg">Coming Soon</div>
                        </div>
                      </div>
                    )}

                    {/* 재생 가능 표시 */}
                    {isAvailable && (
                      <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-black shadow-lg animate-pulse">
                        ▶ PLAY
                      </div>
                    )}
                  </button>

                  {/* 앨범 제목 (하단) */}
                  <div className="mt-3 text-center">
                    <div className={`font-concert text-lg font-black ${isAvailable ? 'text-white' : 'text-gray-500'}`}>
                      {album.title}
                    </div>
                    {isAvailable && album.lines && (
                      <div className="text-karaoke-secondary text-sm font-bold">
                        {album.lines.length}곡 수록
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 에러 메시지 */}
        {micError && (
          <div className="bg-red-500 border-4 border-yellow-400 rounded-2xl px-6 py-4 text-white text-base max-w-[600px] text-center font-bold shadow-2xl animate-bounce-slow relative z-10">
            ⚠️ {micError}
          </div>
        )}

        {/* 하단 안내 */}
        <div className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-8 py-4 rounded-full text-white text-base relative z-10 border-2 border-white/30">
          <span className="text-3xl">🎙️</span>
          <span className="font-bold">앨범을 선택하면 마이크 권한을 요청합니다</span>
        </div>

        {/* 장식 음표들 */}
        <div className="absolute top-10 left-10 text-5xl animate-spin-slow opacity-40">💿</div>
        <div className="absolute top-20 right-20 text-4xl animate-spin-slow opacity-40" style={{animationDelay: '1s'}}>🎵</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-float opacity-40" style={{animationDelay: '1.5s'}}>🎶</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-float opacity-40" style={{animationDelay: '0.5s'}}>⭐</div>
      </div>
    );
  }

  // ─── 화면 2: 카운트다운 (노래방 테마) ──────────────────────────────────────────
  if (phase === "countdown") return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 font-sans flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* 배경 스파클 효과 */}
      <div className="absolute inset-0 bg-neon-grid opacity-20" style={{backgroundSize: '50px 50px'}}></div>

      {/* 펄스 라이트 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-karaoke-primary rounded-full blur-3xl opacity-30 animate-pulse-glow"></div>
      </div>

      <div className="text-center relative z-10">
        {/* 곡 정보 */}
        <div className="bg-gradient-to-r from-karaoke-primary to-karaoke-accent text-white px-8 py-4 rounded-full font-bold text-2xl mb-12 shadow-2xl inline-block">
          {song?.emoji} {song?.title}
        </div>

        {/* 카운트다운 숫자 */}
        <div className="font-concert text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-r from-karaoke-secondary via-karaoke-primary to-karaoke-accent leading-none animate-bounce-slow drop-shadow-2xl" style={{textShadow: '0 0 100px rgba(255, 215, 0, 0.8)'}}>
          {countdown}
        </div>

        {/* 준비 메시지 */}
        <div className="text-5xl text-white font-black mt-8 animate-pulse-glow drop-shadow-lg">
          ⏰ 준비하세요! ⏰
        </div>
      </div>

      {/* 장식 음표들 */}
      <div className="absolute top-20 left-20 text-6xl animate-float">🎵</div>
      <div className="absolute top-40 right-20 text-6xl animate-float" style={{animationDelay: '0.5s'}}>🎶</div>
      <div className="absolute bottom-40 left-40 text-6xl animate-float" style={{animationDelay: '1s'}}>🎤</div>
      <div className="absolute bottom-20 right-40 text-6xl animate-float" style={{animationDelay: '1.5s'}}>⭐</div>
    </div>
  );

  // ─── 화면 2.5: 원음 듣기 (노래방 테마) ──────────────────────────────────────
  if (phase === "listening") {
    const curLine = song?.lines[lineIdx];
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 font-sans flex flex-col items-center justify-center p-8 gap-8 relative overflow-hidden">
        {/* 배경 그리드 */}
        <div className="absolute inset-0 bg-neon-grid opacity-20" style={{backgroundSize: '40px 40px'}}></div>

        {/* 글로우 효과 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[500px] h-[500px] bg-karaoke-accent rounded-full blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="text-center relative z-10">
          {/* 상단 정보 */}
          <div className="bg-gradient-to-r from-karaoke-primary to-karaoke-purple text-white px-6 py-3 rounded-full font-bold text-lg mb-2 inline-block shadow-xl">
            {song?.title}
          </div>
          <div className="text-karaoke-secondary text-xl font-bold mb-8">
            {lineIdx + 1} / {song?.lines.length} 소절
          </div>

          {/* 듣기 아이콘 & 사운드 바 */}
          <div className="relative mb-8">
            <div className="text-9xl animate-bounce-slow drop-shadow-2xl">🎧</div>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <div className="w-2 h-8 bg-gradient-to-t from-karaoke-primary to-karaoke-secondary rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
              <div className="w-2 h-12 bg-gradient-to-t from-karaoke-accent to-karaoke-neon rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
              <div className="w-2 h-10 bg-gradient-to-t from-karaoke-orange to-karaoke-secondary rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
              <div className="w-2 h-14 bg-gradient-to-t from-karaoke-purple to-karaoke-primary rounded-full animate-pulse" style={{animationDelay: '450ms'}}></div>
              <div className="w-2 h-8 bg-gradient-to-t from-karaoke-neon to-karaoke-accent rounded-full animate-pulse" style={{animationDelay: '600ms'}}></div>
            </div>
          </div>

          {/* 재생 중 표시 */}
          <div className="bg-gradient-to-r from-karaoke-accent to-karaoke-neon text-white px-8 py-3 rounded-full text-xl font-black mb-8 inline-block shadow-2xl animate-pulse-glow">
            🔊 원음 듣기 중... 🔊
          </div>

          {/* 가사 */}
          <div className="font-concert text-5xl text-white mb-8 tracking-wide drop-shadow-2xl px-8 py-6 bg-black/30 rounded-3xl backdrop-blur-sm border-4 border-karaoke-secondary">
            {curLine?.text}
          </div>

          {/* 음표 정보 */}
          <div className="bg-gradient-to-br from-purple-700 to-pink-700 border-4 border-karaoke-secondary rounded-3xl px-8 py-6 inline-block shadow-2xl mb-8">
            <div className="text-sm text-karaoke-secondary font-bold mb-2">🎯 목표 음정</div>
            <div className="font-concert text-5xl text-white font-black">{curLine?.note || curLine?.mainNote}</div>
            <div className="text-base text-white/80 mt-2 font-bold">{Math.round(curLine?.targetFreq ?? 0)} Hz</div>
          </div>

          {/* 카운트다운 */}
          <div className="mt-8">
            <div className="text-white text-2xl font-bold mb-4">⏱️ 따라 부르기 시작까지</div>
            <div className="font-concert text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-karaoke-secondary via-karaoke-primary to-karaoke-accent animate-pulse-glow">
              {listenCountdown}
            </div>
          </div>
        </div>

        {/* 장식 음표 */}
        <div className="absolute top-10 left-10 text-5xl animate-float">🎵</div>
        <div className="absolute top-20 right-20 text-5xl animate-float" style={{animationDelay: '0.5s'}}>🎶</div>
        <div className="absolute bottom-20 left-20 text-5xl animate-float" style={{animationDelay: '1s'}}>✨</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-float" style={{animationDelay: '1.5s'}}>⭐</div>
      </div>
    );
  }

  // ─── 화면 3: 노래 중 (노래방 테마) ─────────────────────────────────────────
  if (phase === "singing") {
    const curLine = song?.lines[lineIdx];
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 font-sans flex flex-col items-center justify-center p-6 gap-6 relative overflow-hidden">
        {/* 배경 그리드 */}
        <div className="absolute inset-0 bg-neon-grid opacity-10" style={{backgroundSize: '30px 30px'}}></div>

        {/* 상단: 곡명 & 단계 */}
        <div className="flex items-center gap-4 relative z-10">
          <div className="bg-gradient-to-r from-karaoke-primary to-karaoke-purple text-white px-6 py-2 rounded-full font-bold text-lg shadow-xl">
            {song?.title}
          </div>
          <div className="bg-gradient-to-r from-karaoke-accent to-karaoke-neon text-white px-6 py-2 rounded-full font-black text-base shadow-xl animate-pulse-glow">
            🎤 따라 부르기 중
          </div>
        </div>

        {/* 진행 바 - 노래방 스타일 */}
        <div className="w-[95%] max-w-[700px] h-4 bg-black/40 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl relative z-10">
          <div
            className="h-full rounded-full transition-all duration-200 relative"
            style={{
              width: `${progress * 100}%`,
              background: `linear-gradient(90deg, ${acColor}, ${acColor}dd)`,
              boxShadow: `0 0 20px ${acColor}, 0 0 40px ${acColor}88`
            }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/50 blur-sm"></div>
          </div>
        </div>

        {/* 가사 - 노래방 자막 스타일 */}
        <div className="flex flex-col items-center gap-4 w-full max-w-[800px] min-h-[220px] justify-center relative z-10 bg-black/40 backdrop-blur-md rounded-3xl p-8 border-4 border-karaoke-secondary shadow-2xl">
          {song?.lines.map((l, i) => (
            <div
              key={i}
              className="font-concert text-center transition-all duration-400 px-4 py-2 rounded-xl"
              style={{
                fontSize: i === lineIdx ? '2.5rem' : '1.2rem',
                color: i === lineIdx ? "#FFD700" : i < lineIdx ? "#888888" : "#FFFFFF",
                transform: i === lineIdx ? "scale(1.1)" : "scale(1)",
                textShadow: i === lineIdx ? `0 0 20px ${acColor}, 0 0 40px ${acColor}aa, 0 4px 8px rgba(0,0,0,0.8)` : "0 2px 4px rgba(0,0,0,0.5)",
                background: i === lineIdx ? "linear-gradient(90deg, rgba(255,20,147,0.3), rgba(0,217,255,0.3))" : "transparent",
                fontWeight: i === lineIdx ? '900' : '700',
              }}
            >
              {i < lineIdx ? "✅ " : ""}{l.text}
            </div>
          ))}
        </div>

        {/* 음정 미터 - 노래방 스타일 */}
        <div
          className="bg-gradient-to-br from-purple-800 to-pink-800 border-4 rounded-3xl px-8 py-6 w-[95%] max-w-[650px] relative z-10 shadow-2xl"
          style={{ borderColor: acColor }}
        >
          <div className="text-center mb-6">
            <div className="text-sm text-white/70 font-bold tracking-wider uppercase mb-2">🎯 실시간 음정 분석</div>
            <div
              className="font-concert text-4xl font-black transition-colors duration-200 drop-shadow-lg"
              style={{ color: acColor, textShadow: `0 0 20px ${acColor}` }}
            >
              {pitchHz ? `${pitchHz} Hz` : "🎤 노래해주세요!"}
            </div>
            <div className="text-base text-white/80 mt-2 font-bold">
              목표: {curLine?.note || curLine?.mainNote} ({Math.round(curLine?.targetFreq ?? 0)} Hz)
            </div>
          </div>

          {/* 시각적 바 - 노래방 음정 바 */}
          <div className="relative h-16 bg-black/50 rounded-2xl mb-5 overflow-hidden border-2 border-white/30">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white/50" />
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">🎯</div>
            {pitchHz && curLine && (() => {
              const st = semitones(pitchHz, curLine.targetFreq);
              const offset = st !== null ? Math.max(-3, Math.min(3, st)) : 0;
              const pct = 50 + (offset / 3) * 45;
              return (
                <div
                  className="absolute top-[15%] bottom-[15%] w-[8%] rounded-full transition-[left] duration-150 animate-pulse-glow"
                  style={{
                    left: `${Math.min(Math.max(pct - 4, 0), 92)}%`,
                    background: `linear-gradient(180deg, ${acColor}, ${acColor}aa)`,
                    boxShadow: `0 0 30px ${acColor}, 0 0 60px ${acColor}88`,
                    border: `3px solid white`
                  }}
                />
              );
            })()}
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-white/70 font-bold">◀ 낮음</div>
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-white/70 font-bold">높음 ▶</div>
          </div>

          {/* 평가 라벨 */}
          <div className="text-center">
            <div
              className="inline-block px-8 py-3 rounded-full text-xl font-black transition-all duration-300 shadow-xl"
              style={{
                color: "white",
                border: `3px solid ${acColor}`,
                background: `linear-gradient(135deg, ${acColor}44, ${acColor}22)`,
                boxShadow: `0 0 20px ${acColor}88`
              }}
            >
              {ACC_LABEL[acc]}
            </div>
          </div>
        </div>

        {/* 소절 인디케이터 - 노래방 스타일 */}
        <div className="flex gap-3 relative z-10">
          {song?.lines.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300 border-2 border-white/50"
              style={{
                width: i === lineIdx ? 40 : 16,
                height: 16,
                background: i < lineIdx ? "#39FF14" : i === lineIdx ? acColor : "#555555",
                boxShadow: i === lineIdx ? `0 0 20px ${acColor}` : "none"
              }}
            />
          ))}
        </div>

        {/* 장식 음표 */}
        <div className="absolute top-10 left-10 text-4xl animate-float opacity-50">🎵</div>
        <div className="absolute top-20 right-20 text-4xl animate-float opacity-50" style={{animationDelay: '0.5s'}}>🎶</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-float opacity-50" style={{animationDelay: '1s'}}>✨</div>
        <div className="absolute bottom-10 right-10 text-4xl animate-float opacity-50" style={{animationDelay: '1.5s'}}>⭐</div>
      </div>
    );
  }

  // ─── 화면 4: 분석 중 (노래방 테마) ───────────────────────────────────────────
  if (phase === "analyzing") return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-purple-900 font-sans flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-neon-grid opacity-20" style={{backgroundSize: '50px 50px'}}></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-karaoke-primary rounded-full blur-3xl opacity-30 animate-pulse"></div>
      </div>

      <div className="text-center relative z-10">
        <div className="text-9xl animate-spin-slow inline-block mb-8">🎵</div>
        <div className="font-concert text-5xl text-transparent bg-clip-text bg-gradient-to-r from-karaoke-secondary via-karaoke-primary to-karaoke-accent font-black mb-6 animate-rainbow">
          AI 분석 중...
        </div>
        <p className="text-white text-2xl font-bold animate-pulse">Claude가 당신의 노래를 분석하고 있어요 ✨</p>

        {/* 로딩 바 */}
        <div className="mt-12 w-[400px] h-4 bg-black/40 rounded-full overflow-hidden border-2 border-karaoke-secondary mx-auto">
          <div className="h-full bg-gradient-to-r from-karaoke-primary via-karaoke-accent to-karaoke-neon animate-disco" style={{backgroundSize: '200% 100%'}}></div>
        </div>
      </div>

      {/* 장식 */}
      <div className="absolute top-20 left-20 text-6xl animate-float">🎤</div>
      <div className="absolute top-20 right-20 text-6xl animate-float" style={{animationDelay: '0.5s'}}>🎶</div>
      <div className="absolute bottom-20 left-20 text-6xl animate-float" style={{animationDelay: '1s'}}>⭐</div>
      <div className="absolute bottom-20 right-20 text-6xl animate-float" style={{animationDelay: '1.5s'}}>✨</div>
    </div>
  );

  // ─── 화면 5: 피드백 (노래방 테마) ───────────────────────────────────────────
  if (phase === "feedback") {
    const overall = sessionData.length
      ? sessionData.filter(d => {
        if (!d.avgFreq) return false;
        const st = Math.abs(semitones(d.avgFreq, d.targetFreq) || 99);
        return st < 1.5;
      }).length / sessionData.length
      : 0;
    const grade = overall >= .8 ? "S" : overall >= .6 ? "A" : overall >= .4 ? "B" : "C";
    const gradeColor = overall >= .8 ? "#39FF14" : overall >= .6 ? "#FFD700" : overall >= .4 ? "#FF6B35" : "#FF1493";
    const gradeEmoji = overall >= .8 ? "👑" : overall >= .6 ? "⭐" : overall >= .4 ? "💫" : "💪";

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 font-sans flex flex-col items-center p-8 gap-6 animate-slide-in relative overflow-hidden">
        {/* 배경 */}
        <div className="absolute inset-0 bg-neon-grid opacity-10" style={{backgroundSize: '40px 40px'}}></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-karaoke-accent rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-karaoke-primary rounded-full blur-3xl opacity-20"></div>

        {/* 헤더 */}
        <div className="flex items-center gap-4 relative z-10 flex-wrap justify-center">
          <div className="font-concert text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-karaoke-secondary via-karaoke-primary to-karaoke-accent">
            🏆 노래 결과 🏆
          </div>
          <div className="bg-gradient-to-r from-karaoke-primary to-karaoke-purple text-white px-6 py-3 rounded-full font-bold text-xl shadow-xl">
            {song?.emoji} {song?.title}
          </div>
        </div>

        {/* 종합 점수 - 대형 디스플레이 */}
        <div className="text-center relative z-10 bg-black/40 backdrop-blur-md rounded-3xl p-12 border-4 border-karaoke-secondary shadow-2xl">
          <div className="text-6xl mb-4 animate-bounce-slow">{gradeEmoji}</div>
          <div
            className="font-concert text-[120px] font-black leading-none drop-shadow-2xl"
            style={{
              color: gradeColor,
              textShadow: `0 0 60px ${gradeColor}, 0 0 100px ${gradeColor}aa`
            }}
          >
            {grade}
          </div>
          <div className="text-white text-3xl font-bold mt-4">
            {Math.round(overall * 100)}% 정확도
          </div>
        </div>

        {/* 소절별 카드 - 노래방 스타일 */}
        <div className="flex gap-4 flex-wrap max-w-[900px] w-full justify-center relative z-10">
          {sessionData.map((d, i) => {
            const st = d.avgFreq > 0 ? semitones(d.avgFreq, d.targetFreq) : null;
            const a = accuracy(st);
            const c = ACC_COLOR[a];
            const emojiMap = {perfect: "🎉", good: "⭐", fair: "💫", off: "💪", none: "—"};
            return (
              <div
                key={i}
                className="bg-gradient-to-br from-purple-700 to-pink-700 border-4 rounded-3xl px-5 py-5 min-w-[150px] flex-1 text-center shadow-xl transform transition-transform hover:scale-105"
                style={{ borderColor: c }}
              >
                <div className="font-concert text-base font-black mb-2 text-white">{d.text}</div>
                <div className="text-white/80 text-sm font-bold">
                  목표 {d.note}
                </div>
                <div className="text-white/60 text-xs mb-3">
                  {d.avgFreq > 0 ? Math.round(d.avgFreq) + "Hz" : "측정 안됨"}
                </div>
                <div className="text-5xl my-3">
                  {emojiMap[a]}
                </div>
                <div className="text-sm font-bold px-3 py-1 rounded-full" style={{
                  color: "white",
                  background: `linear-gradient(135deg, ${c}88, ${c}44)`,
                  border: `2px solid ${c}`
                }}>
                  {ACC_LABEL[a].replace(/[^가-힣a-zA-Z ]/g, "").trim()}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI 코칭 - 노래방 스타일 */}
        <div className="bg-gradient-to-br from-purple-800 to-pink-800 border-4 border-karaoke-secondary rounded-3xl px-8 py-8 w-full max-w-[900px] relative z-10 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-4xl">🤖</div>
            <div className="font-concert text-2xl text-karaoke-secondary font-black tracking-wider">AI 코치의 피드백</div>
          </div>
          {isLoading
            ? <div className="text-white py-8 text-center text-xl font-bold animate-pulse">분석 중... 잠시만 기다려주세요 ⏳</div>
            : <div className="text-lg leading-relaxed text-white whitespace-pre-wrap font-bold">{feedback}</div>
          }
        </div>

        {/* 다시 부르기 버튼 */}
        <button
          className="bg-gradient-to-r from-karaoke-primary to-karaoke-accent text-white px-12 py-5 rounded-full text-2xl font-black transition-all duration-300 hover:scale-110 hover:shadow-2xl relative z-10 shadow-xl border-4 border-white/50 animate-pulse-glow"
          onClick={() => {
            cleanup();
            setPhase("select");
            setSong(null);
            setSessionData([]);
            setFeedback("");
            setMicError("");
            sessionRef.current = [];
          }}
        >
          🎤 다시 부르기 🎤
        </button>

        {/* 장식 */}
        <div className="absolute top-10 left-10 text-5xl animate-bounce-slow opacity-60">🎵</div>
        <div className="absolute top-20 right-10 text-5xl animate-bounce-slow opacity-60" style={{animationDelay: '0.5s'}}>🎶</div>
        <div className="absolute bottom-20 left-10 text-5xl animate-float opacity-60" style={{animationDelay: '1s'}}>✨</div>
        <div className="absolute bottom-10 right-20 text-5xl animate-float opacity-60" style={{animationDelay: '1.5s'}}>⭐</div>
      </div>
    );
  }

  return null;
}
