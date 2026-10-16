# 장면 콘텐츠 파일 규칙 (src/content/*.js)

빌드가 이 폴더의 .js를 알파벳순으로 이어 붙인다(엔진·연표·정치·학업 다음, 화면 코드 전). 전역 스코프의 일반 스크립트다.

## 무작위 장면 추가
- `EV.push(S(id, 조건함수, 가중치, 쿨다운년수, [[문장, fx객체, 추가조건?, 한번만?], ...]))` — 한 줄 서술 장면 묶음
- `EV.push(C(id, 조건, 가중치, 쿨다운, 제목, 프랑스어부제, 본문|()=>본문, [{l:'선택지', s:'설명', a:'태그', f:async()=>{...}}] | ()=>배열))` — 선택 장면
  - 태그 a: safe bold radical royal pious study social greedy family work (자동 선택 성향에 쓰임)
- id는 파일 접두어로 시작해 겹치지 않게(예: 'sch_', 'pro_', 'pea_', 'nob_').
- 가중치: 흔한 일 1~2, 드문 일 0.3~0.8. 쿨다운: 같은 장면이 다시 나오기까지 년수(한 번만이면 99).

## 쓸 수 있는 도구
- 상태 `s`: s.age s.year s.month(0=1월) s.season(0봄~3겨울) s.sex s.estate s.region s.money s.land s.fame s.sus s.pol s.faith s.st.{edu,soc,hp,cour} s.spouse s.kids s.flags s.trait s.plan
- 판별: `child()` `free()`(성인·평상시) `isM()` `noble()` `rich()` `lit()` `urban()` `loc()` `job()` `onTrack('farm'|'craft'|'law'|'church'|'med'|'army'|'pol'|'letters')` `priest()` `nun()` `soldier()` `T()`(연도+달) `inTerror()` `atWar()` `monthly()`
- 학업: `SCH()`(=s.sch) `inSchool()` `inSchool('college')` `faculty('law'|'med'|'theo')` `addGrade(n)`(문자열 반환, 문장 뒤에 붙임) `gradeLabel()` `collegeName()`
- 직업: `s.job` 아이디 — 법조 l1~l6, 교회 r1~r5(r1 신학생), 의학 m1~m5(m2 여성=산파), 농업 f1~f5, 수공 c1~c6, 문필 w1~w4(w2 여성=살롱 안주인)
- 효과: `fx({hp:-2,money:50,...})` → 문자열 ' (건강 -2, 재산 +50)'를 돌려주며 실제로 적용. 키 hp edu soc cour faith fame sus pol money
- 기록: `say(문장+fx(...), 'ev'|'big'|'dark'|'sys')`
- 판정: `const r=await roll(보정(-2~2),{label:'…',why:'…'})` → r.v 1~6(5 이상 성공). `md([[조건,±1,'이유'],...])` → {m,why}
- 확률: `await chance(p,'라벨','근거')` → true면 일어남
- 승진·직업: `takeJob(id,'앞말 ')` `loseJob('% 자리를 …')` `meets(POST[id])`
- 그 밖: `pick(arr)` `ri(a,b)` `R()` `person()` `woman()` `jo(단어,'이','가')` `meet('인물')` `s.seeds.push(...)`
- 선택 장면의 f 안에서 `await done()`은 부르지 않는다(C가 대신 닫는다).

## 문체
- 한국어, 주어 없는 과거형 서술(“~하였다/~했다”), 한 문장 80자 안팎. 당대 용어는 한국어로 풀고 필요하면 괄호에 원어.
- 사실과 시대에 맞게. 연도·제도·직함은 실제와 맞춰 조건으로 묶는다(예: T()<1790.5 고등법원).

## 능력치 체계 (src/attrs.js)

- **핵심 능력치 5개** `s.st`: `hp` 건강(CON) · `edu` 학식(INT) · `soc` 사교(CHA) · `dex` 기술(DEX) · `str` 체력(STR). 0~100.
  - 건강은 몸 전체의 상태(질병·회복·피로)이고, 체력은 실제로 낼 수 있는 힘(농사·운반·군사 훈련·몸싸움)이다.
  - 기술은 손재주와 정확성(재봉·그림·악기·수공업·인쇄·글씨·수술)이다.
- **의지** `s.st.cour`: '신념 및 의지'에 속한다. 위험한 선택(전투·도주·시위·결투)에 쓴다. 화면 이름은 '의지'.
- **재산** `s.money` · **혐의** `s.sus`.
- **신앙** `s.faith`(강도)와 `s.faithKind`(소속). `faithLabel()`이 '독실한 신자/관습을 따르는 신자/성직자와 갈등하는 신자…'를 준다. 성직자와의 갈등은 `s.flags.anticler=true`.
- **명성** `s.fame`: 얼마나 알려졌는가. 좋기만 하지 않다.
- **숙련** `s.sk[k]` 0~100. fx 키로 바로 쓴다.
  - `orat` 웅변(사교의 하위 숙련)
  - `pen` 글씨·문서 · `craft` 수공 · `sew` 바느질 · `draw` 그림 · `music` 악기 · `print` 인쇄 · `heal` 외과 손기술
  - `trade` 장사·셈 · `farm` 농사일 · `arms` 무예 · `ride` 승마
- **평판** `s.rep[k]` 0~100(50 보통). 집단마다 따로다.
  - `rfam` 가족 · `rloc` 이웃·고을 · `rguild` 동업자 · `rpeople` 민중 · `relite` 상류사회
  - 같은 행동이 민중에게는 +, 상류사회에는 −일 수 있다.
- **영향력** `influence().v`: 공직·파벌 지위·인맥·재산·대중의 지지·정권과의 관계를 합해 계산한다. 사건으로 쌓는 몫은 fx 키 `inf`(0~40, 해마다 10% 줄어든다).
- **신념 축** `s.bel[k]` −100~+100. fx 키:
  - `brg` 정치 체제(왕정 ↔ 공화정)
  - `bor` 사회 질서(신분 특권 ↔ 법적 평등)
  - `bch` 변화의 방식(점진 ↔ 급진)
  - `bpw` 권력 구조(중앙집권 ↔ 지방 자치)
  - `brl` 종교와 국가(결합 ↔ 분리)
- **가치** `s.val[k]` 0~100: `vlib` 자유 · `veq` 평등 · `vhon` 명예 · `vfam` 가족 · `vord` 질서 · `vjus` 정의.
  - 신념은 경험으로 바뀌되 한 사건이 성향을 정해 버리지 않게 작게(±2~6) 움직인다.
- **관계**
  - `addRel(role,{n,sex,fac,close,trust,resp,riv,v,inf,w})`로 사람을 만든다. role은 친구·스승·동료·후원자·연인·경쟁자.
  - `relsAlive()`, `relFx(r,{close,trust,resp,riv})`(로그 문자열을 돌려준다), `patron()`, `rival()`를 쓴다.
  - 관계 인물은 저마다 중히 여기는 가치 `r.v`가 있어 같은 행동에도 다르게 반응한다(`relJudge(r)` −1/0/+1).
- **파벌 관계**
  - `frelOf(id)`, `frelAdd(id,n)`: 나와 파벌 사이의 신뢰(+)·적대(−), −100~100.
  - `facPair(a,b)`: 파벌끼리의 동맹(+)·적대(−). 그 시기에 존재하는 파벌만 쓴다(`activeFactions()`).
- **지역 경제** `econ()` → `{a:'paris'|'city'|'rural', price, wage, jobs, supply, cur}`
  - price·wage는 배율(1 = 평년), jobs·supply는 0~100, cur는 지폐 가치(1 = 정화).
  - `wageEarner()`는 품삯으로 사는 사람인지 알려 준다.
- **판정 예**: `md([[s.st.dex>=55,1,'기술'],[s.sk.sew>=40,1,'바느질 솜씨'],[s.st.str<30,-1,'힘 부족'],[s.rep.rloc>=65,1,'이웃의 신망']])`.
