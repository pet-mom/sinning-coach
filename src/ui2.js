/* ================= 5차 화면: 양피지 · 동판화 · 메달 초상 =================
   ui.js 위에 덮어쓴다. 일상(홈) · 프로필 · 관계 · 생활 · 시대 다섯 칸과 사건 화면, 결과 카드, 인물 기록. */

/* ---------- 그림 도우미 ---------- */
// 픽셀 인물 하나를 작은 캔버스에 크게 (초상·메달·목록 썸네일)
function drawFig(cv,p){if(!cv||typeof makeG!=='function'||typeof drawPeople!=='function')return;const W=256,H=96;const off=document.createElement('canvas');off.width=W;off.height=H;const c=off.getContext('2d');
  const g=makeG(c,{seed:(p.seed||7)>>>0,t:T(),era:era().k,season:s?s.season:1,loc:'paris'});drawPeople(g,[{sex:p.sex||'M',age:clamp(p.age||30,1,90),me:false,estate:p.estate||'bourgeois',role:p.role||null,pol:p.pol||0}]);
  const pc=cv.getContext('2d');pc.imageSmoothingEnabled=false;pc.clearRect(0,0,cv.width,cv.height);const sw=22,sh=24,sx=W/2-sw/2,sy=GY+3-30;pc.drawImage(off,sx,sy,sw,sh,0,0,cv.width,cv.height)}
function drawPortrait(cv){drawFig(cv,{sex:s.sex,age:s.age,estate:s.estate,role:sceneRole(),pol:s.pol,seed:s.by})}
function medal(cls,fig){const w=el('div','medal '+(cls||''));const cv=el('canvas');cv.width=66;cv.height=72;cv.setAttribute('aria-hidden','true');w.appendChild(cv);requestAnimationFrame(()=>drawFig(cv,fig));return w}
// 파리 풍경(표지·시대 머리그림)
function drawParis(cv,t,kind){if(!cv||typeof makeG!=='function')return;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;const g=makeG(c,{seed:1789,t:t||1789,era:(ERAS.find(e=>(t||1789)>=e.a&&(t||1789)<e.b)||ERAS[0]).k,season:1,loc:'paris'});artSky(g);(ART[kind||'city']||ART.city)(g)}
// 월계관 액자
function drawLaurel(svg){if(!svg)return;const NS='http://www.w3.org/2000/svg';let h='';const cx=160,cy=150,rx=118,ry=128;
  for(const side of [-1,1])for(let i=0;i<15;i++){const a=Math.PI/2+side*(0.28+i*0.17);const x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*ry;const rot=(a*180/Math.PI)+(side>0?-60:60)+90;
    h+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5" ry="13" transform="rotate(${rot.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    const a2=a+side*.08,x2=cx+Math.cos(a2)*(rx-14),y2=cy+Math.sin(a2)*(ry-14);h+=`<ellipse class="in" cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" rx="4" ry="10" transform="rotate(${(rot+(side>0?40:-40)).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)})"/>`}
  h+=`<path class="rib" d="M104 268 q56 22 112 0 l14 14 q-70 26 -140 0 z"/><circle class="knot" cx="160" cy="276" r="7"/>`;svg.innerHTML=h}

/* ---------- 머리 그림과 날짜 ---------- */
function heroDate(){const d=$('#heroDate');if(!d||!s)return;d.innerHTML=`<span>${s.year}년 ${s.month+1}월 · 파리 · ${SEASON[s.season]}</span><span class="mut">${era().n}</span>`}

/* ---------- 홈(일상): 메달 초상 · 기본 정보 · 능력치 · 재산 · 현재 사건 · 오늘의 일과 ---------- */
function quartier(){try{if(typeof rxQ==='function'){const q=rxQ();if(q&&q.n)return q.n}}catch(e){}return REGIONS[loc()].n}
function statusName(){const j=job();if(child())return inSchool()?schoolStatus().split(' · ')[0]:s.age<7?'어린아이':'아이';const c={prison:'수감 중',hiding:'은신 중',emigre:'망명 중'}[s.cond];if(c)return c;return j?pname(j):s.flags.retired?'은퇴':noble()&&s.land?'지주':'일 없음'}
function renderHome(){const C=$('#homeCard');if(!C||!s)return;C.innerHTML='';
  const top=el('div','hm-top');top.appendChild(medal('big',{sex:s.sex,age:s.age,estate:s.estate,role:sceneRole(),pol:s.pol,seed:s.by}));
  const id=el('div','hm-id');id.innerHTML=`<div class="hm-n">${s.given[0]} ${s.sur[0]}</div>${s.given[1]?`<div class="hm-fr">${s.given[1]} ${s.sur[1]}</div>`:''}<dl class="facts"><dt>출생</dt><dd>${s.by}년 ${s.bm+1}월 ${s.bd||1}일</dd><dt>나이</dt><dd>${s.age}세</dd><dt>신분</dt><dd>${ESTATES[s.estate].n}</dd><dt>처지</dt><dd>${statusName()}</dd><dt>거주지</dt><dd>${quartier()} · ${homeLabel()}</dd></dl>`;
  top.appendChild(id);C.appendChild(top);
  C.appendChild(el('h3','sec','주요 능력치'));const st=el('div','pf-stats');st.innerHTML=STATS.map(([k,n])=>`<div class="ps"><span>${n}</span><s><u style="width:${s.st[k]}%"></u></s><b>${s.st[k]}</b></div>`).join('');C.appendChild(st);
  const mo=el('button','rowbtn');mo.type='button';mo.innerHTML=`<span class="ri">⚜</span><span>재산</span><b>${fmt(s.money)} ${money()}</b><span class="chev">›</span>`;mo.onclick=()=>setTab('life');C.appendChild(mo);
  const ev=s.log.slice(-14).reverse().find(e=>['big','ev','dark'].includes(e.k));
  if(ev){const cur=el('button','curev');cur.type='button';const txt=ev.t.replace(/\s?\([^()]*[+-]\s?[\d,]+[^()]*\)\.?$/,'');cur.innerHTML=`<span class="tagr">현재 사건</span><b>${txt.length>38?txt.slice(0,38)+'…':txt}</b><small>${ev.a!=null?ev.a+'세':''} · 인생 기록에서 보기</small><span class="chev">›</span>`;cur.onclick=()=>{$('.logc').scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})};C.appendChild(cur)}}
// 오늘의 일과: 나이 · 학교 · 직업 · 신분 · 처지 · 신앙 · 정치에 맞춘 하루
function daySchedule(){const j=job(),a=s.age,x=SCH(),out=[];const add=(t,n,h)=>out.push([t,n,h||'']);const win=s.season===3;
  if(s.cond==='prison'){add('06:00','간수의 점호');add('08:00','묽은 수프와 빵');add('11:00','안뜰 산책','건강 −');add('15:00','같은 방 사람들과 이야기','사교');add('19:00','촛불 아래 편지 쓰기','글씨');add('21:00','짚더미 위의 잠');return out}
  if(s.cond==='hiding'){add('05:00','동트기 전 잠깐의 바람');add('09:00','다락방에 숨어 책 읽기','학식');add('14:00','발소리에 귀 기울이기','의지');add('22:00','몰래 내려가 저녁');return out}
  if(s.cond==='emigre'){add('08:00','하숙집 아침');add('10:00','고국 소식 신문 읽기');add('13:00',isM()?'프랑스어·검술 개인 교습으로 생계':'자수와 모자 만들기로 생계',isM()?'예법':'기술');add('18:00','망명객들의 모임','사교');return out}
  if(a<7){add('07:00','기상');add('08:00',`${s.mo.alive?'어머니':'유모'} 곁에서 아침`);add('10:00',noble()?'정원에서 놀기':'골목에서 동무들과 놀기','체력 +');add('15:00',noble()?'낮잠':'심부름');add('19:00','저녁');add('20:00','잠자리 기도');return out}
  if(inSchool()){const board=!x.ext&&['college','convent','seminary'].includes(x.st);add(board?'05:30':'06:30',board?'기숙사 종소리에 기상':'기상');add('07:00',x.st==='convent'?'예배당 미사':'미사·아침');
    if(x.st==='petite'){add('08:00','읽기와 교리문답','읽기·쓰기 +');add('13:00','쓰기와 셈','산수 +');add('16:00',s.estate==='artisan'?'공방 심부름':'집안일 거들기')}
    else if(x.st==='college'){add('08:00','라틴어 수업','고전학 +');add('10:30',T()>=1795.75&&T()<1802.5?'수학·자연사':'작문과 번역',T()>=1795.75?'자연과학 +':'고전학 +');add('14:00',s.age>=15?'철학반 논쟁':'역사와 지리',s.age>=15?'철학·수사학 +':'');add('17:00','자습','학식 +');add('19:30','저녁과 묵상')}
    else if(x.st==='convent'){add('08:00','교리와 읽기','읽기·쓰기 +');add('10:00','바느질·자수','재봉 +');add('14:00',noble()?'하프·클라브생':'셈과 살림','악기 +');add('16:00','춤과 예법','예법 +')}
    else if(x.st==='univ'){add('08:00',x.fac==='med'?'해부 강의':'법학 강의',x.fac==='med'?'의학 +':'법학 +');add('12:00','카페에서 동기들과','사교 +');add('15:00',x.fac==='med'?'병원 회진 참관':'변론 연습',x.fac==='med'?'외과 +':'웅변 +');add('20:00','하숙방에서 복습','학식 +')}
    else if(x.st==='seminary'){add('05:00','아침 기도');add('08:00','신학 강의','신학 +');add('14:00','라틴어 성무일도','고전학 +');add('20:00','저녁 기도와 침묵')}
    add('21:00','잠자리');return out}
  const tr=j?j.tr:null;add(tr==='army'?'05:00':noble()&&!j?'10:00':win?'06:30':'05:30',tr==='army'?'기상나팔':noble()&&!j?'느지막한 기상과 몸단장':'기상');
  if(faithModeNow()==='devout')add('06:30','새벽 미사','신앙 +');
  if(!j){if(noble()||rich()){add('12:00','방문객 맞이','사교 +');add('15:00',T()<1789?'튈르리 정원 산책':'팔레루아얄 산책','');add('18:00',T()<1793||T()>=1795?'극장 또는 살롱':'조용한 저녁','예법 +');add('22:00','만찬')}else{add('08:00','일거리 찾아 거리로');add('12:00','빵 한 조각');add('15:00','장터 품팔이','체력 +');add('20:00','저녁')}}
  else if(tr==='craft'){add('06:00',`${SPECS[pickSpec()]||'공방'} 일`,`${FXN[pickSpec()]} +`);add('12:00','점심');add('13:00','다시 공방','기술 +');add('19:00','선술집','사교 +')}
  else if(tr==='farm'){add('05:00','들일','농사일 +');add('12:00','들판에서 점심');add('13:00','들일','체력 +')}
  else if(tr==='law'){add('08:00',j.t>=3?'법정':'사무소 서류','법학 +');add('13:00','의뢰인 상담','대화술 +');add('17:00',T()>=1789.5?'카페에서 신문':'고등법원 복도','사교 +')}
  else if(tr==='church'){add('05:00','성무일도');add('07:00','미사 집전','웅변 +');add('10:00','병자 방문','신앙 +');add('15:00','교구 기록','글씨 +')}
  else if(tr==='med'){add('07:00','병원 회진','의학 +');add('11:00','왕진','외과 +');add('16:00','진료와 처방')}
  else if(tr==='army'){add('06:00','훈련','검술 +');add('12:00','막사 점심');add('14:00','행군·사격','체력 +')}
  else if(tr==='pol'){add('09:00',deputy()?'의회 회의':'시청 업무','웅변 +');add('15:00','위원회','영향력 +')}
  else if(tr==='letters'){add('08:00','원고 쓰기','글씨 +');add('14:00','도서관','철학·수사학 +');add('18:00','살롱','대화술 +')}
  else if(tr==='serv'){add('06:00','주인댁 불 지피기');add('09:00','시중과 심부름','예법 +');add('20:00','주인 저녁 시중')}
  else if(tr==='sea'){add('05:00','갑판 일','체력 +');add('12:00','항구 점심');add('15:00','짐 싣기','짐 나르기 +')}
  else if(tr==='art'){add('09:00','작업실','그림·악기 +');add('15:00','연습 또는 손님');add('20:00','공연·전시')}
  else if(tr==='state'){add('08:00','사무실 업무','산수·회계 +');add('14:00','순찰·검사')}
  else if(tr==='peuple'){add('05:00','물 긷기·짐 나르기','짐 나르기 +');add('12:00','장터 점심');add('14:00','다시 일','체력 +')}
  else{add('08:00',pname(j)+' 일');add('14:00','일')}
  if(s.party)add('19:30',`${FAC[s.party].n} 회합`,'웅변 +');
  if(s.spouse&&s.spouse.alive)add('20:00',`${isM()?'아내':'남편'}와 저녁${kidsAlive().length?' · 아이들':''}`,'가족 +');else add('20:00','저녁');
  add(noble()?'23:30':'21:30','잠자리');return out.sort((a,b)=>a[0].localeCompare(b[0]))}
function renderSched(){const C=$('#schedCard');if(!C||!s)return;C.innerHTML='';const h=el('div','ch');h.innerHTML=`<h2>오늘의 일과</h2><span class="mut small">${s.year}년 ${s.month+1}월 · 방침 ${s.plan||'근면'}</span>`;C.appendChild(h);
  const ul=el('ul','sched-l');daySchedule().forEach(([t,n,hh])=>{const li=el('li');li.innerHTML=`<span class="tm">${t}</span><span class="dot"></span><span class="nm">${n}${hh?` <i>${hh}</i>`:''}</span>`;ul.appendChild(li)});C.appendChild(ul)}

/* ---------- 프로필: 성격 · 신념 · 직업과 사회적 지위 ---------- */
const PERS_T={열정:'열정적',신중:'신중함',경건:'경건함',계몽:'호기심 많음',야심:'야심만만',쾌활:'쾌활함'};
const PERS_V={vfam:'가정적',vhon:'자존심 강함',vjus:'책임감',vlib:'자유분방',veq:'공정함',vord:'원칙적'};
const PERS_TAL={social:'눈치 빠름',observe:'세심함',strat:'계산이 빠름',art:'감수성 풍부',music:'흥이 많음',orat:'말솜씨 좋음',memory:'꼼꼼함',lang:'재치 있음',math:'논리적',space:'손눈이 맞음'};
function personality(){const o=[];if(s.trait)o.push(PERS_T[s.trait]||s.trait);const tv=topValues(2).map(n=>VALUES.find(x=>x[1]===n)[0]);tv.forEach(k=>o.push(PERS_V[k]));const tt=topTalents(1)[0];if(tt&&tt[2]>=60)o.push(PERS_TAL[tt[0]]);
  if(s.st.cour>=65)o.push('대담함');else if(s.st.cour<=25)o.push('겁이 많음');return [...new Set(o.filter(Boolean))]}
function statusLadder(){const j=job();if(!j)return '';const rows=PL.filter(x=>x[1]===j.tr).map(x=>POST[x[0]]).filter(p=>p.ok()&&canSex(p)).sort((a,b)=>a.t-b.t);return rows.map(p=>`<span class="lad${p.id===j.id?' on':p.t<j.t?' past':''}">${pname(p)}</span>`).join('<i>›</i>')}
function profileExtra(H){const c=cardIn(H,'성격 · 신념 · 지위','Caractère');
  c.appendChild(el('div','lab','성격'));const pc=el('div','chips');personality().forEach(x=>pc.appendChild(el('span','chip on',x)));c.appendChild(pc);
  c.appendChild(el('p','mut small','성격은 자동 선택의 성향과 주변 사람들의 반응, 일부 판정에 영향을 줍니다.'));
  c.appendChild(el('div','lab','신념'));const bl=el('p','small');bl.innerHTML=`<b>${polLabel(s.pol)}</b> · ${faithLabel()} · 중히 여기는 가치 ${topValues(3).join(', ')}${s.goal?` · 평생의 뜻 ‘${s.goal}’`:''}`;c.appendChild(bl);
  c.appendChild(el('div','lab','직업과 사회적 지위'));const j=job();const jp=el('p','small');jp.innerHTML=`${ESTATES[s.estate].n} (${ESTATES[s.estate].fr}) · ${statusName()}${j?` · ${s.year-s.jobSince}년째 · ${TRACKS[j.tr]||''}`:''} · 명성 ${s.fame} · 영향력 ${influence().v}`;c.appendChild(jp);
  const ld=statusLadder();if(ld){const d=el('div','ladder');d.innerHTML=ld;c.appendChild(d)}}

/* ---------- 관계: 분류 · 목록 · 인물 기록 ---------- */
let relFilter='all';
function famPeople(){const o=[];if(s.fa)o.push({fam:'fa',n:'아버지',role:'가족',alive:s.fa.alive,age:s.fa.age,sex:'M',estate:s.estate,note:s.fa.alive?`${s.fa.age}세`:`${s.fa.dy||''}년 세상을 떠남`});
  if(s.mo)o.push({fam:'mo',n:'어머니',role:'가족',alive:s.mo.alive,age:s.mo.age,sex:'F',estate:s.estate,note:s.mo.alive?`${s.mo.age}세`:`${s.mo.dy||''}년 세상을 떠남`});
  if(s.spouse)o.push({fam:'sp',n:s.spouse.n||(isM()?'아내':'남편'),role:isM()?'아내':'남편',alive:s.spouse.alive,age:s.spouse.age,sex:isM()?'F':'M',estate:s.spouse.estate||s.estate,note:s.spouse.alive?`${s.spouse.age}세`:s.divorced?'이혼':'사별'});
  s.kids.forEach((k,i)=>o.push({fam:'k'+i,n:k.n,role:k.sex==='M'?'아들':'딸',alive:k.alive,age:s.year-k.y,sex:k.sex,estate:s.estate,note:k.alive?`${s.year-k.y}세`:`${k.dy||''}년에 잃음`}));return o}
function relCat(r){const b=relBond(r);if(['스승','후원자'].includes(r.role)||b==='존경')return 'mentor';if(['연인','라이벌','혐오','경쟁자'].includes(b)||r.role==='경쟁자')return 'heart';return 'friend'}
function relAge(r){const P=perOf(r);if(P)return s.year-P.b;if(typeof npAge==='function'&&r.kind==='fic')try{return npAge(r)}catch(e){}return 30}
function relNote(r){if(!r.alive)return relEnd(r)||'떠난 사람';if(r.kind==='fic'&&r.fate&&r.fate.length)return String(r.fate[r.fate.length-1]).slice(0,40);const P=perOf(r);if(P)return (r.w||P.bio||'').slice(0,40);return r.w||''}
const BOND_IC={친우:'♥',연인:'♥',존경:'✦',라이벌:'⚔',혐오:'✕',경쟁자:'⚔'};
function renderRel(){const C=$('#relCard');if(!C||!s)return;C.innerHTML='';const h=el('div','ch');h.innerHTML=`<h2>인간관계</h2><span class="mut small">${relsAlive().length}명과 인연</span>`;C.appendChild(h);
  const seg=el('div','seg');[['all','전체'],['fam','가족'],['friend','친구·동료'],['mentor','스승·후원'],['heart','연인·라이벌'],['gone','떠난 이']].forEach(([k,n])=>{const b=el('button',null,n);b.type='button';b.setAttribute('aria-pressed',String(relFilter===k));b.onclick=()=>{relFilter=k;renderTab('rel')};seg.appendChild(b)});C.appendChild(seg)}
function relMore(H){H.innerHTML='';const list=el('div','plist');const fam=famPeople();const rs=(s.rel||[]).slice();
  const show=[];if(relFilter==='all'||relFilter==='fam')fam.filter(p=>p.alive||relFilter==='fam').forEach(p=>show.push(['fam',p]));
  rs.filter(r=>relFilter==='gone'?!r.alive:r.alive&&(relFilter==='all'||relCat(r)===relFilter)).sort((a,b)=>(b.close+(b.hate||0)+b.riv)-(a.close+(a.hate||0)+a.riv)).forEach(r=>show.push(['rel',r]));
  if(relFilter==='gone')fam.filter(p=>!p.alive).forEach(p=>show.push(['fam',p]));
  if(!show.length)list.appendChild(el('p','mut',child()?'아직 어려서 집 밖의 인연이 많지 않다.':'아직 이 칸에 들어갈 사람이 없다.'));
  show.forEach(([k,p])=>{const b=el('button','prow'+(p.alive===false?' dead':''));b.type='button';
    if(k==='fam'){const t=el('div','pt');t.innerHTML=`<b>${p.n}</b><span>${p.role}</span><small>${p.note}</small>`;b.appendChild(t);b.appendChild(el('span','pic fam','⌂'))}
    else{const P=perOf(p);const bd=relBond(p);const t=el('div','pt');t.innerHTML=`<b>${p.n}</b><span>${p.role}${bd!==p.role?` · ${bd}`:''}${P?' · 실존 인물':''}</span><small>${relNote(p)}</small>`;b.appendChild(t);b.appendChild(el('span','pic b-'+(bd==='혐오'||bd==='라이벌'||bd==='경쟁자'?'bad':bd==='친우'||bd==='연인'?'love':'mid'),BOND_IC[bd]||'·'));b.onclick=()=>personPage(p)}
    list.appendChild(b)});
  const c=el('section','card');c.appendChild(list);c.appendChild(el('p','mut small center','지인들도 저마다의 삶을 살아갑니다. 혁명에 가담하고, 떠나고, 죽기도 합니다.'));H.appendChild(c);
  const f=cardIn(H,'파벌과의 관계','Les factions');const fs=activeFactions();if(!fs.length)f.appendChild(el('p','mut','아직 뚜렷한 파벌이 없다.'));
  const fl=el('ul','infl');fs.forEach(x=>fl.appendChild(el('li',null,`${x.n} — ${s.party===x.id?`소속 · ${PRANK[s.prank]} · `:''}${frelWord(frelOf(x.id))} ${frelOf(x.id)} · 성향 친밀도 ${affinity(x)}%`)));f.appendChild(fl)}
let ppTab='sum';
function personPage(r){const pin=openPanel('인물 기록');pin.innerHTML='';const P=perOf(r);
  const top=el('div','pp-top noimg');
  const id=el('div');id.innerHTML=`<div class="hm-n">${r.n}</div><div class="hm-fr">${P?P.fr:''}</div><div class="small mut">${r.role} · ${relBond(r)}${P?` · ${P.b}~${P.d}`:r.by?` · ${r.by}년생`:''}${r.home?` · ${r.home}`:''}</div>`;top.appendChild(id);pin.appendChild(top);
  const seg=el('div','seg');[['sum','개요'],['rel','관계'],['log','기록']].forEach(([k,n])=>{const b=el('button',null,n);b.type='button';b.setAttribute('aria-pressed',String(ppTab===k));b.onclick=()=>{ppTab=k;personPage(r)};seg.appendChild(b)});pin.appendChild(seg);
  if(ppTab==='sum'){if(P)pin.appendChild(el('p',null,P.bio));if(r.w)pin.appendChild(el('p','small',`만난 곳: ${r.w}.`));
    const pers=[];if(r.tr)pers.push(r.tr);if(r.v)pers.push(PERS_V[r.v]||'');pin.appendChild(el('div','lab','성격'));const pc=el('div','chips');pers.filter(Boolean).forEach(x=>pc.appendChild(el('span','chip',x)));pin.appendChild(pc);
    pin.appendChild(el('div','lab','관심사'));const ic=el('div','chips');[r.fac&&FAC[r.fac]?FAC[r.fac].n:'',P&&P.ctx&&P.ctx[0]?'':'',r.kind==='fic'&&typeof npJob==='function'?(()=>{try{return npJob(r)}catch(e){return ''}})():'',VALUES.find(x=>x[0]===r.v)?.[1]||''].filter(Boolean).forEach(x=>ic.appendChild(el('span','chip',x)));pin.appendChild(ic);
    pin.appendChild(el('div','lab','최근 소식'));pin.appendChild(el('p','small',relNote(r)||'별다른 소식이 없다.'))}
  if(ppTab==='rel'){pin.appendChild(el('div','lab','관계 상태'));const g=el('div','pf-stats');g.innerHTML=[['친밀도',r.close],['신뢰',r.trust],['존경',r.resp],['경쟁심',r.riv],['미움',r.hate||0]].map(([n,v])=>`<div class="ps"><span>${n}</span><s><u style="width:${v}%"></u></s><b>${v}</b></div>`).join('');pin.appendChild(g);
    pin.appendChild(el('p','small mut',`관계의 성격: ${relBond(r)}. ${r.fac&&FAC[r.fac]?`${FAC[r.fac].n} 사람이다. `:''}${s.party&&r.fac?(facPair(s.party,r.fac)<=-40?'당신의 파벌과 적대 관계다.':facPair(s.party,r.fac)>=40?'당신의 파벌과 손잡은 쪽이다.':''):''}`))}
  if(ppTab==='log'){const ul=el('ul','tl');const f=(r.fate||[]).slice().reverse();if(P){ul.appendChild(el('li',null,`${P.d}년 — ${P.dc||'세상을 떠났다'}`));(P.fac||[]).slice().reverse().forEach(([a,b,id])=>FAC[id]&&ul.appendChild(el('li',null,`${Math.floor(a)}~${Math.floor(b)}년 — ${FAC[id].n}`)));ul.appendChild(el('li',null,`${P.b}년 — 태어났다`))}
    f.forEach(x=>ul.appendChild(el('li',null,String(x))));ul.appendChild(el('li',null,`${r.y}년 — 당신과 처음 만났다`));pin.appendChild(ul)}
  const can=r.alive&&!child()&&s.cond!=='prison'&&lit()&&(s.acts['let_'+(r.fid||r.pid)]!==s.year);
  const b=el('button','pill pri wide','✉ 편지 보내기');b.type='button';b.disabled=!can;b.onclick=()=>{s.acts['let_'+(r.fid||r.pid)]=s.year;say(`${r.n}에게 편지를 보냈다.`+fx({pen:1})+relFx(r,{close:4,trust:2}));save();personPage(r);render()};pin.appendChild(b);
  if(!can&&r.alive)pin.appendChild(el('p','mut small center',!lit()?'글을 몰라 편지를 쓸 수 없다.':s.acts['let_'+(r.fid||r.pid)]===s.year?'올해는 이미 편지를 보냈다.':''))}

/* ---------- 생활: 직업 · 수입과 지출 · 재산 · 거주지 · 소지품 · 교육 · 사회 활동 ---------- */
function possessions(){const o=[];const m=s.money;if(lit())o.push(m>=3000?'장정한 책들':'낡은 책 몇 권');if(m>=1500)o.push('회중시계');if(noble()||soldier()||s.sk.arms>=30)o.push('검');if(rich())o.push('마차와 말');else if(s.sk.ride>=30)o.push('말 한 필');
  if(s.sk.music>=30)o.push(noble()?'하프':'바이올린');if(onTrack('craft'))o.push(`${SPECS[pickSpec()]||'장인'}의 연장`);if(onTrack('med'))o.push('왕진 가방');if(onTrack('law'))o.push('법복');if(priest())o.push('성무일도서');
  if(s.faithKind==='catholic'&&s.faith>=50)o.push('묵주');if(T()>=1789.5&&T()<1795&&s.pol>=30)o.push('삼색 모표');if(s.flags.legion)o.push('레지옹 도뇌르 훈장');if(s.land)o.push('땅문서');if(m<30)o.push('입은 옷 한 벌');return o}
function lifeTab(H){H.innerHTML='';const j=job(),L=s.ledger;
  const c1=cardIn(H,'직업과 지위','État');c1.appendChild(el('p',null,`${statusName()}${j?` · ${TRACKS[j.tr]||''} ${j.t}단계 · ${s.year-s.jobSince}년째 · 연 ${fmt(j.pay)} ${money()}`:''}`));const ld=statusLadder();if(ld){const d=el('div','ladder');d.innerHTML=ld;c1.appendChild(d)}
  if(j){const nx=PL.filter(x=>x[1]===j.tr&&x[2]===j.t+1).map(x=>POST[x[0]]).filter(p=>p.ok()&&canSex(p));if(nx.length)c1.appendChild(el('p','small mut',`다음 자리: ${nx.map(p=>`${pname(p)}${needText(p)?` (${needText(p)})`:''}`).join(' / ')}`))}
  const c2=cardIn(H,'수입과 지출','Le budget');if(L){const ul=el('ul','basket');[['벌이',L.pay],['배우자 벌이',L.sp],['지대',L.land],['영주 공납',L.dues],['생활비',-L.life],['한 해 살림',L.net]].filter(x=>x[1]).forEach(([n,v])=>{const li=el('li');li.innerHTML=`<span>${n}</span><b class="${v<0?'neg':''}">${v>0?'+':''}${fmt(v)}</b>`;ul.appendChild(li)});c2.appendChild(ul);c2.appendChild(el('p','mut small',`${L.y}년 결산 · 방침 ${L.pl}`))}else c2.appendChild(el('p','mut','아직 한 해 결산이 없다.'));
  const c3=cardIn(H,'재산 · 거주지 · 소지품','Les biens');c3.appendChild(el('p',null,`재산 ${fmt(s.money)} ${money()}${s.land?` · 지대 ${fmt(s.land)}/년`:''}${s.dues?` · 영주 공납 ${fmt(s.dues)}/년`:''}`));c3.appendChild(el('p','small',`거주지: ${quartier()} · ${homeLabel()}`));const pc=el('div','chips');possessions().forEach(x=>pc.appendChild(el('span','chip',x)));c3.appendChild(pc);
  const c4=cardIn(H,'교육','L’instruction');c4.appendChild(el('p','small',inSchool()?schoolStatus():`${lit()?'글을 읽고 쓴다':'글을 모른다'}${SCH().school?` · 다닌 학교: ${SCH().school}`:''}${SCH().grade?` · 마지막 성적 ${SCH().grade}`:''}`));
  buildActs(cardIn(H,'방침과 사회 활동','Les occupations'));lifeEcon(cardIn(H,'물가','Le prix des choses'));showHist(cardIn(H,'이력','État civil'))}

/* ---------- 시대: 머리그림 · 시대 이름 · 주요 사건 · 정치 세력 · 경제 · 자료 ---------- */
let eraSub='ev';
function eraSpan(){const e=era();return `${Math.floor(e.a)}–${Math.min(Math.floor(e.b),1850)}`}
function eraTab(H){H.innerHTML='';const top=el('section','card era-h');const cv=el('canvas','engr');cv.width=256;cv.height=96;top.appendChild(cv);requestAnimationFrame(()=>drawParis(cv,T(),'city'));
  const t=el('div','era-t');t.innerHTML=`<b>${era().n} (${eraSpan()})</b><span class="mut small">${ruler()}${repYear(s.year)?' · '+repYear(s.year):''}</span>`;top.appendChild(t);
  const seg=el('div','seg');[['ev','주요 사건'],['pol','정치 세력'],['eco','경제'],['src','자료']].forEach(([k,n])=>{const b=el('button',null,n);b.type='button';b.setAttribute('aria-pressed',String(eraSub===k));b.onclick=()=>{eraSub=k;renderTab('era')};seg.appendChild(b)});top.appendChild(seg);H.appendChild(top);
  if(eraSub==='ev'){const c=el('section','card');const mi=MI();const past=HIST.filter(h=>h.mi<=mi&&h.text).sort((a,b)=>b.mi-a.mi).slice(0,40);const ul=el('ul','evl');past.forEach(h=>{const li=el('li');const y=Math.floor(h.mi/12),m=h.mi%12+1;li.innerHTML=`<span class="yb">${y}</span><span><b>${m}월</b> ${String(h.text).replace(/^\d+월(\s?\d+일)?,?\s?/,'').slice(0,90)}</span>`;ul.appendChild(li)});if(!past.length)c.appendChild(el('p','mut','아직 기록할 큰 사건이 없다.'));c.appendChild(ul);H.appendChild(c)}
  if(eraSub==='pol'){const pc=el('section','card polc');H.appendChild(pc);const keep=$('#polCard');renderPolCardInto(pc);buildPolitics(cardIn(H,'정치','La politique'))}
  if(eraSub==='eco'){const c=cardIn(H,'그 시절의 경제','L’économie');const E=econ();const g=el('div','egrid two');g.innerHTML=`<div><span class="lab">물가</span><b>×${E.price.toFixed(2)}</b><small>${econWord('price',E.price)}</small></div><div><span class="lab">화폐 가치</span><b>${Math.round(E.cur*100)}%</b><small>${econWord('cur',E.cur)}</small></div>`;c.appendChild(g);lifeEcon(c)}
  if(eraSub==='src'){const c=cardIn(H,'참고 문헌','Sources');if(typeof LIFE_SRC==='undefined'||!LIFE_SRC.length)c.appendChild(el('p','mut','자료 없음'));else{c.appendChild(el('p','mut small',`생활사 장면 ${LIFE_DATA.length}건의 근거가 된 학술 자료 ${LIFE_SRC.length}개.`));const ol=el('ol','srcs');LIFE_SRC.slice().sort((a,b)=>b.n-a.n).slice(0,60).forEach(x=>{const li=el('li');const a=el('a',null,x.c);a.href=x.u;a.target='_blank';a.rel='noopener';li.appendChild(a);ol.appendChild(li)});c.appendChild(ol);const b=el('button','pill','전체 목록');b.type='button';b.onclick=showSources;c.appendChild(b)}}}
function renderPolCardInto(C){const real=$('#polCard');if(real){const id=real.id;real.removeAttribute('id');C.id='polCard';renderPolCard();C.removeAttribute('id');real.id=id}}

/* ---------- 탭 다시 그리기(ui.js의 renderTab을 바꾼다) ---------- */
renderTab=function(t){if(!s||tabBusy)return;tabBusy=true;const keepY=window.scrollY;
  try{
  if(t==='daily'){}
  if(t==='profile'){renderProfile();const H=hostClear('#profMore');profileExtra(H);buildInfo(cardIn(H,'세부 정보','Détails'))}
  if(t==='rel'){renderRel();relMore(hostClear('#relMore'))}
  if(t==='life')lifeTab(hostClear('#lifeHost'));
  if(t==='era'){$('#polCard').hidden=true;eraTab(hostClear('#eraHost'))}
  }catch(e){console.error(e)}tabBusy=false;window.scrollTo(0,keepY)};
// 일상 칸도 매 진행마다 갱신


/* ---------- 사건 화면 ---------- */
{const _so=sheetOpen;sheetOpen=function(t,fr){_so(t,fr);if(s)$('#shFr').textContent=`${s.year}년 ${s.month+1}월 · 파리${fr?` · ${fr}`:''}`;}}
{const _sb=shButtons;shButtons=function(opts){$('#shB').appendChild(el('div','ask','어떻게 하시겠습니까?'));return _sb(opts)}}
// 선택 뒤: 결과 카드(계속 버튼 없이 잠깐 떠 있다가 사라진다)
done=async function(){if(!sheetLive)return;if(lastPick&&typeof reactAfter==='function'){try{reactAfter(lastPick)}catch(e){console.error(e)}}lastPick=null;
  const news=s.log.slice(sheetMark).filter(e=>['ev','big','dark','sys'].includes(e.k));sheetClose();const main=news.filter(e=>e.k!=='sys');if(!main.length&&!news.length)return;
  const deltas={};const FXRE=/\(([^()]*(?:[+-]\s?[\d,]+)[^()]*)\)\.?$/;news.forEach(e=>{const m=e.t.match(FXRE);if(!m)return;m[1].split(', ').forEach(x=>{const mm=x.match(/^(.+?)\s([+-])\s?([\d,]+)$/);if(!mm)return;const k=mm[1],v=(mm[2]==='-'?-1:1)*+mm[3].replace(/,/g,'');deltas[k]=(deltas[k]||0)+v})});
  const head=(main.length?main[main.length-1]:news[news.length-1]).t.replace(FXRE,'').trim();resultCard(head,deltas)};
function resultCard(head,deltas){const b=$('#toast');b.innerHTML='';b.className='toast res';b.appendChild(el('div','rk','사건 결과'));b.appendChild(el('p','rh',head.length>120?head.slice(0,120)+'…':head));
  const ks=Object.entries(deltas).filter(([,v])=>v);if(ks.length){b.appendChild(el('div','rk2','변화된 상태'));const ul=el('ul','rd');ks.slice(0,6).forEach(([k,v])=>{const bad=BAD.has(k)?v>0:v<0;const li=el('li');li.innerHTML=`<span>${k}</span><b class="${k==='급진'||k==='보수'?'':bad?'dn':'up'}">${v>0?'+':''}${fmt(v)} ${v>0?'▲':'▼'}</b>`;ul.appendChild(li)});b.appendChild(ul)}
  b.hidden=false;b.onclick=()=>{b.hidden=true};clearTimeout(toastT);toastT=setTimeout(()=>{b.hidden=true},Math.max(2600,6000/Math.sqrt(speed)))}

/* ---------- 표지 ---------- */
drawLaurel($('#laurel'));

/* ---------- 실제 그림(퍼블릭 도메인, docs/img/credits.json) ---------- */
const IMGS={};(typeof IMG_CREDITS!=='undefined'?IMG_CREDITS:[]).forEach(c=>IMGS[c.file]=c);
const hasImg=f=>!!IMGS[f];
const imgSrc=f=>'img/'+f;
// 인물에 맞는 패션 판화·초상: 나이·성별·신분·역할·시대
function plateFor(p){const t=T(),F=p.sex==='F',E=p.estate||'bourgeois',nb=['epee','robe','hobereau'].includes(E),rich=nb||E==='bourgeois';const c=[];
  if((p.age||30)<13)c.push('p_child.jpg');
  if(p.role==='priest'||p.role==='nun')c.push('p_priest.jpg');if(p.role==='soldier'||p.role==='officer')c.push('p_soldier.jpg');if(p.role==='sansculotte')c.push('p_sansculotte.jpg');
  if(t<1792.6){c.push(nb?(F?'p_noble_f_1780.jpg':'p_noble_m_1780.jpg'):rich?(F?'p_bourg_f_1780.jpg':'p_bourg_m_1780.jpg'):(F?'p_people_f.jpg':'p_people_m.jpg'))}
  else if(t<1795.5){c.push(!rich&&!F&&(p.pol||0)>=20?'p_sansculotte.jpg':rich?(F?'p_bourg_f_1780.jpg':'p_bourg_m_1780.jpg'):(F?'p_people_f.jpg':'p_people_m.jpg'))}
  else if(t<1800){c.push(rich&&(p.age||30)<40?(F?'p_merveilleuse.jpg':'p_incroyable.jpg'):rich?(F?'p_bourg_f_1780.jpg':'p_bourg_m_1780.jpg'):(F?'p_people_f.jpg':'p_people_m.jpg'))}
  else if(t<1815){c.push(rich?(F?'p_empire_f.jpg':'p_empire_m.jpg'):(F?'p_people_f.jpg':'p_people_m.jpg'))}
  else c.push(rich?(F?'p_restor_f.jpg':'p_restor_m.jpg'):(F?'p_people_f.jpg':'p_people_m.jpg'));
  c.push(F?'p_bourg_f_1780.jpg':'p_bourg_m_1780.jpg');return c.find(hasImg)||null}
function plateImg(p,cls){const f=plateFor(p);if(!f)return null;const im=el('img',cls||'');im.src=imgSrc(f);im.alt='';im.loading='lazy';im.decoding='async';im.title=`${IMGS[f].title||''} — ${IMGS[f].artist||''}`;return im}
{const _medal=medal;medal=function(cls,fig){const w=_medal(cls,fig);const im=plateImg(fig);if(im){const cv=w.querySelector('canvas');im.onerror=()=>{im.replaceWith(cv)};if(cv)cv.replaceWith(im);else w.appendChild(im)}return w}}
{const _dp=drawPortrait;drawPortrait=function(cv){const im=plateImg({sex:s.sex,age:s.age,estate:s.estate,role:sceneRole(),pol:s.pol},'pf-por');if(im&&cv&&cv.parentNode){im.onerror=()=>{im.replaceWith(cv);_dp(cv)};cv.replaceWith(im)}else _dp(cv)}}
const ERA_IMG={ancien:'era_ancien.jpg',constit:'era_constit.jpg',republic:'era_republic.jpg',directory:'era_directory.jpg',consulate:'era_empire.jpg',empire:'era_empire.jpg',restoration:'era_restoration.jpg',july:'era_july.jpg',republic2:'era_july.jpg',empire2:'era_july.jpg'};
function eraImgFile(k){const f=ERA_IMG[k||era().k];return hasImg(f)?f:hasImg('title.jpg')?'title.jpg':null}
function credLine(f){const c=IMGS[f];return c?`${c.title||''} · ${c.artist||''}${c.date?`, ${c.date}`:''}`:''}
{const _et=eraTab;eraTab=function(H){_et(H);const f=eraImgFile();if(!f)return;const top=H.querySelector('.era-h');const cv=top&&top.querySelector('canvas');if(!cv)return;const im=el('img','era-img');im.src=imgSrc(f);im.alt=IMGS[f].title||'';im.onerror=()=>im.replaceWith(cv);cv.replaceWith(im);const cap=el('div','era-cap',credLine(f));im.after(cap)}}
{const _se=showEnd;showEnd=function(){_se();const box=$('#end .sp');if(!box||!s)return;box.querySelectorAll('.ob-oval').forEach(x=>x.remove());const f=eraImgFile();if(!f)return;const im=el('img','ob-oval');im.src=imgSrc(f);im.alt='';im.title=credLine(f);box.insertBefore(im,$('#obName'))}}
function showImgCredits(){const pin=openPanel('그림 출처');pin.appendChild(el('p','mut small','화면의 그림은 모두 저작권 보호 기간이 끝난 퍼블릭 도메인 작품입니다(위키미디어 공용).'));const ul=el('ol','srcs');(typeof IMG_CREDITS!=='undefined'?IMG_CREDITS:[]).forEach(c=>{const li=el('li');const a=el('a',null,`${c.title||c.file}`);a.href=c.source;a.target='_blank';a.rel='noopener';li.appendChild(a);li.appendChild(el('small',null,` · ${c.artist||''}${c.date?`, ${c.date}`:''} · ${c.license||''}`));ul.appendChild(li)});pin.appendChild(ul);if(!ul.children.length)pin.appendChild(el('p','mut','아직 그림이 없습니다.'))}
{const b=$('#mImg');if(b)b.onclick=()=>{$('#menu').hidden=true;showImgCredits()}}
// 표지 그림



/* ---------- 픽셀 그림을 모두 걷어 내고 실제 그림만 쓴다 ----------
   그림이 없으면 금색 카메오 실루엣(초상) 또는 빈 액자(풍경)로 대신한다. */
function cameo(F){return `<svg class="cameo" viewBox="0 0 60 70" aria-hidden="true"><ellipse cx="30" cy="35" rx="28" ry="33"/><path class="sil" d="${F?'M36 18c-7-5-17-2-19 7-1 5 1 9 3 11-1 2-4 3-4 5 2 1 4 1 5 2l-1 4c2 1 4 1 6 0l2 6c-6 2-12 5-14 11h32c-1-6-6-9-11-11 1-4 3-6 3-10 3-2 4-6 4-9 2 0 4-2 3-4-3-1-5-3-6-6 1-2 0-4-3-6z':'M35 17c-8-4-18 0-19 9 0 5 2 8 3 10-1 2-3 3-3 5 2 1 3 1 4 2l-1 4c2 1 5 1 7 0l1 6c-7 2-13 5-15 12h34c-1-7-7-10-12-12 1-4 3-6 3-10 3-1 4-5 4-8 1-1 3-2 2-4-2-1-3-3-4-5 1-4 0-7-4-9z'}"/></svg>`}
function figBox(fig,cls){const im=plateImg(fig,cls||'');if(im){im.onerror=()=>{const d=el('div','cameo-w');d.innerHTML=cameo(fig.sex==='F');im.replaceWith(d)};return im}const d=el('div','cameo-w');d.innerHTML=cameo(fig.sex==='F');return d}
medal=function(cls,fig){const w=el('div','medal '+(cls||''));w.appendChild(figBox(fig));return w};
drawPortrait=function(cv){if(!cv||!cv.parentNode||!s)return;const b=figBox({sex:s.sex,age:s.age,estate:s.estate,role:sceneRole(),pol:s.pol},'pf-por');if(!b.classList.contains('pf-por'))b.classList.add('pf-por');cv.replaceWith(b)};
drawFig=function(){};drawParis=function(){};
// 시대 그림을 액자에 넣는다
function paintInto(box,k){if(!box)return;const f=eraImgFile(k);const cur=box.dataset.f||'';if(f&&cur===f)return;box.dataset.f=f||'none';box.innerHTML='';
  if(f){const im=el('img');im.src=imgSrc(f);im.alt=IMGS[f].title||'';im.decoding='async';im.onerror=()=>{box.innerHTML='';box.classList.add('empty')};box.appendChild(im);box.title=credLine(f);box.classList.remove('empty')}else box.classList.add('empty')}
drawScene=function(cv){if(!s)return;paintInto(cv||$('#cv'))};
{const _so2=sheetOpen;sheetOpen=function(t,fr){_so2(t,fr);const a=$('#shArt');if(a){a.dataset.f='';paintInto(a)}}}
eraTab=function(H){H.innerHTML='';const top=el('section','card era-h');const box=el('div','era-pic');top.appendChild(box);paintInto(box);const f=eraImgFile();
  const t=el('div','era-t');t.innerHTML=`<b>${era().n} (${eraSpan()})</b><span class="mut small">${ruler()}${repYear(s.year)?' · '+repYear(s.year):''}</span>`;top.appendChild(t);if(f)top.appendChild(el('div','era-cap',credLine(f)));
  const seg=el('div','seg');[['ev','주요 사건'],['pol','정치 세력'],['eco','경제'],['src','자료']].forEach(([k,n])=>{const b=el('button',null,n);b.type='button';b.setAttribute('aria-pressed',String(eraSub===k));b.onclick=()=>{eraSub=k;renderTab('era')};seg.appendChild(b)});top.appendChild(seg);H.appendChild(top);
  const tmp=el('div');_eraBody(tmp);while(tmp.firstChild)H.appendChild(tmp.firstChild)};
function _eraBody(H){if(eraSub==='ev'){const c=el('section','card');const mi=MI();const past=HIST.filter(h=>h.mi<=mi&&h.text).sort((a,b)=>b.mi-a.mi).slice(0,40);const ul=el('ul','evl');past.forEach(h=>{const li=el('li');const y=Math.floor(h.mi/12),m=h.mi%12+1;li.innerHTML=`<span class="yb">${y}</span><span><b>${m}월</b> ${String(h.text).replace(/^\d+월(\s?\d+일)?,?\s?/,'').slice(0,90)}</span>`;ul.appendChild(li)});if(!past.length)c.appendChild(el('p','mut','아직 기록할 큰 사건이 없다.'));c.appendChild(ul);H.appendChild(c)}
  if(eraSub==='pol'){const pc=el('section','card polc');H.appendChild(pc);renderPolCardInto(pc);buildPolitics(cardIn(H,'정치','La politique'))}
  if(eraSub==='eco'){const c=cardIn(H,'그 시절의 경제','L’économie');const E=econ();const g=el('div','egrid two');g.innerHTML=`<div><span class="lab">물가</span><b>×${E.price.toFixed(2)}</b><small>${econWord('price',E.price)}</small></div><div><span class="lab">화폐 가치</span><b>${Math.round(E.cur*100)}%</b><small>${econWord('cur',E.cur)}</small></div>`;c.appendChild(g);lifeEcon(c)}
  if(eraSub==='src'){const c=cardIn(H,'참고 문헌','Sources');c.appendChild(el('p','mut small',`생활사 장면 ${LIFE_DATA.length}건의 근거가 된 학술 자료 ${LIFE_SRC.length}개.`));const ol=el('ol','srcs');LIFE_SRC.slice().sort((a,b)=>b.n-a.n).slice(0,60).forEach(x=>{const li=el('li');const a=el('a',null,x.c);a.href=x.u;a.target='_blank';a.rel='noopener';li.appendChild(a);ol.appendChild(li)});c.appendChild(ol);const b=el('button','pill','전체 목록');b.type='button';b.onclick=showSources;c.appendChild(b);const b2=el('button','pill','그림 출처');b2.type='button';b2.onclick=showImgCredits;c.appendChild(b2)}}
// 표지 그림
{const tb=$('#titleArt');if(tb&&hasImg('title.jpg')){const im=el('img');im.src=imgSrc('title.jpg');im.alt='';tb.appendChild(im)}}
