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
