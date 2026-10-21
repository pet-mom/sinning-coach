/* ================= 인생 기록 (최근 순) ================= */
let logBox=null;
function entryNode(e){
  if(e.k==='yr'){const d=el('div','le yr');const m=e.t.match(/^(\d+)년(?: · (.*))?$/);d.appendChild(el('b',null,m?m[1]+'년':e.t));if(m&&m[2])d.appendChild(el('span','mut',m[2]));return d}
  const d=el('div','le '+(e.k==='fact'?'dice fact':e.k));d.appendChild(el('span','ag',e.a!=null?e.a+'세':''));
  const body=el('div','lb');
  if(e.k==='dice'){body.appendChild(el('span','tag data','자료'));body.appendChild(el('span','mono',e.t))}
  else if(e.k==='fact'){body.appendChild(el('span','tag data','자료'));body.appendChild(el('span','mono',e.t+' '));(e.d&&e.d.src||[]).forEach(i=>{const a=el('a','cite',srcShort(i));a.href=LIFE_SRC[i].u;a.target='_blank';a.rel='noopener';body.appendChild(a)})}
  else{let txt=e.t,fxs=null;const m=txt.match(/^(.*?)\s?\(([^()]*(?:[+-]\s?[\d,]+)[^()]*)\)(\.?)$/);if(m&&e.k!=='sys'){txt=m[1]+m[3];fxs=m[2].split(', ')}
    if(e.k==='hist'){body.appendChild(el('span','tag hist',`${e.m!=null?e.m+1+'월':''} 역사`.trim()));body.appendChild(document.createTextNode(' '))}
    body.appendChild(el('span','tx',txt));
    if(fxs){const w=el('span','fxs');fxs.forEach(x=>{const lab=x.split(' ')[0];const neg=/\s-\s?\d/.test(x);const bad=BAD.has(lab)?!neg:neg;w.appendChild(el('span','fx '+(lab==='급진'||lab==='보수'?'':bad?'dn':'up'),x))});body.appendChild(w)}}
  d.appendChild(body);return d}
// 최근 항목 LOG_STEP개만 보이고, '더 보기'를 누를 때마다 LOG_STEP개씩 더 펼친다
const LOG_STEP=5;let logLimit=LOG_STEP;
function flushLog(){const box=logBox||$('#log');if(!box||!s)return;
  for(;shown<s.log.length;shown++)box.prepend(entryNode(s.log[shown]));
  while(box.childElementCount>360)box.lastElementChild.remove();foldLog()}
function foldLog(){const box=logBox||$('#log');if(!box)return;let n=0,total=0;
  for(const c of box.children){const item=!c.classList.contains('yr')&&!c.classList.contains('dice');c.hidden=n>=logLimit;if(item){n++;total++}}
  const rest=Math.max(0,total-logLimit),more=$('#logMore'),less=$('#logLess');if(!more)return;
  more.hidden=rest===0;more.textContent=`이전 기록 ${Math.min(LOG_STEP,rest)}개 더 보기 · 남은 ${rest}개`;less.hidden=logLimit<=LOG_STEP}
function rebuildLog(){const box=$('#log');box.innerHTML='';logLimit=LOG_STEP;shown=Math.max(0,s.log.length-360);flushLog()}

/* ================= 결정 창 ================= */
let sheetMark=0;
function sheetOpen(t,fr){if(s)$('#shDecree').textContent=era().h||'';sheetMark=s?s.log.length:0;$('#shT').textContent=t;$('#shFr').textContent=fr||'';$('#shB').innerHTML='';$('#sheet').hidden=false;sheetLive=true;freeze();document.body.classList.add('modal')}
function sheetClose(){$('#sheet').hidden=true;sheetLive=false;document.body.classList.remove('modal')}
function shText(t,c){$('#shB').appendChild(el('p',c||'',t))}
let autoMode=false,pend=null;
function ad(){return Math.max(220,1100/Math.sqrt(speed))}
function arm(fn){pend=fn;if(autoMode)setTimeout(()=>{if(autoMode&&pend===fn)fn()},ad())}
const PREF={열정:{bold:2,radical:1.5},신중:{safe:2.5},경건:{pious:2.5,royal:.6},계몽:{study:1.6,radical:1.2},야심:{social:1.4,greedy:1,bold:.6},쾌활:{social:2,family:1}};
function autoPick(opts,btns){let best=-1e9,bi=0;opts.forEach((o,i)=>{if(btns[i].disabled)return;let sc=R()*.6;const tags=(o.a||'').split(' ');
  if(tags.includes('safe'))sc+=.5;if(tags.includes('work'))sc+=1.2;if(tags.includes('family'))sc+=.8;const P=PREF[s&&s.trait]||{};for(const t of tags)sc+=P[t]||0;
  if(s&&s.pol<-30&&tags.includes('royal'))sc+=.4;if(s&&s.pol>40&&tags.includes('radical'))sc+=.4;if(sc>best){best=sc;bi=i}});return bi}
function setAuto(on){autoMode=on;$('#autoT').setAttribute('aria-pressed',String(on));$('#autoT').textContent=on?'자동 선택 켜짐':'자동 선택 꺼짐';if(on&&pend)setTimeout(()=>{if(autoMode&&pend)pend()},ad())}
function shButtons(opts){return new Promise(res=>{const box=el('div','opts');
  opts.forEach((o,i)=>{const b=el('button','opt');b.type='button';b.appendChild(el('span','ol',o.l));if(o.s)b.appendChild(el('small',null,o.s));if(o.dis)b.disabled=true;
    b.onclick=()=>{pend=null;lastPick=o;box.querySelectorAll('button').forEach(x=>x.disabled=true);b.classList.add('chosen');res(i)};box.appendChild(b)});
  $('#shB').appendChild(box);arm(()=>{const btns=[...box.querySelectorAll('button')];btns[autoPick(opts,btns)].click()});const f=box.querySelector('button:not(:disabled)');if(f)f.focus({preventScroll:true})})}
async function shContinue(){}
// 선택 뒤 바로 닫고, 그사이 생긴 결과를 잠깐 띄운다
let lastPick=null;
async function done(){if(!sheetLive)return;if(lastPick&&typeof reactAfter==='function'){try{reactAfter(lastPick)}catch(e){console.error(e)}}lastPick=null;const news=s.log.slice(sheetMark).filter(e=>['ev','big','dark'].includes(e.k)).map(e=>e.t);sheetClose();if(news.length)toast(news.slice(-2).join(' '))}
let toastT=null;
function toast(t){const b=$('#toast');b.textContent=t;b.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{b.hidden=true},Math.max(1600,4200/Math.sqrt(speed)))}

/* ================= 화면 ================= */
const STATC={hp:'var(--green)',edu:'var(--teal)',soc:'var(--pink)',dex:'var(--yellow)',str:'var(--roy)',cour:'var(--rad)'};
const STATORD=STATS;
function statusText(){if(inSchool()&&s.cond==='normal')return schoolStatus();if(child())return s.age<7?'어린아이':'아이';
  const c={prison:'수감 중',hiding:s.flags.refractaire?'징집 기피자로 숨어 지냄':'은신 중',emigre:`망명 중 · ${s.emiPlace||''}`}[s.cond];if(c)return c;
  const j=job();if(j)return pname(j);return s.flags.retired?'은퇴':noble()&&s.land?'지대로 사는 지주':'일 없음'}
function render(){if(!s)return;document.documentElement.style.setProperty('--era',eraColor());$('#decree').textContent=era().h||'';
  $('#age').textContent=s.age;const nm=`${s.given[0]} ${s.sur[0]}`;
  $('#subline').innerHTML=`<b>${nm}</b> · ${ym()} · <span class="mut">1년 ≈ ${secPerYear()}초</span>`;
  $('#where').innerHTML='';$('#where').append(s.cond==='emigre'?`${s.emiPlace||'국외'} (망명) · ${homeLabel().replace(/ · .*/,'')} · ${companions()}`:`${REGIONS[loc()].n}, 프랑스 · ${homeLabel()} · ${companions()}`);
  $('#famAges').textContent=familyAges();
  $('#era').textContent=era().n===ruler()?era().n:`${era().n} · ${ruler()}`;
  drawScene($('#cv'));
  renderEcon();if(curTab!=='daily')renderTab(curTab);drawProg(0)}
function polPos(p){return (p+100)/2}
function polSpark(w,h){const pts=(s.polHist||[]).slice(-40).concat([[s.year,s.pol]]);if(pts.length<2)return '';const n=pts.length;
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="${w}" y1="${h/2}" y2="${h/2}" stroke="var(--line)" stroke-width="1"/><polyline fill="none" stroke="var(--fg)" stroke-width="1.5" points="${pts.map((p,i)=>`${(i/(n-1)*w).toFixed(1)},${(h/2-p[1]/100*(h/2-2)).toFixed(1)}`).join(' ')}"/><circle cx="${w}" cy="${(h/2-s.pol/100*(h/2-2)).toFixed(1)}" r="2.5" fill="var(--pink)"/></svg>`}
function facColor(f){return f.pol<=-40?'var(--roy)':f.pol>=45?'var(--rad)':'var(--mod)'}
function facCard(f,big){const a=affinity(f),mem=s.party===f.id;const c=el('button','fac'+(mem?' mem':'')+(big?' big':''));c.type='button';c.style.setProperty('--fc',facColor(f));
  c.innerHTML=`<span class="fh">${f.n}</span><span class="por" aria-hidden="true">${f.lead.slice(0,1)}</span><span class="fl">${f.lead}</span>`+
   (big?`<dl><dt>목표</dt><dd>${f.goal}</dd><dt>신념</dt><dd>${f.belief}</dd><dt>지지층</dt><dd>${f.sup}</dd></dl>`:'')+
   `<span class="aff"><i style="width:${a}%"></i></span><span class="fa">${mem?`소속 · ${PRANK[s.prank]}`:`친밀도 ${a}%`}</span>`+
   `<span class="fr2">${frelOf(f.id)?`${frelWord(frelOf(f.id))} ${frelOf(f.id)>0?'+':''}${frelOf(f.id)}`:''}${s.party&&!mem&&FAC[s.party]?(()=>{const v=facPair(s.party,f.id);return v>=40?' · 우리와 동맹':v<=-40?' · 우리와 적대':''})():''}</span>`;
  c.onclick=()=>showPolitics();return c}
function specLabels(){const S=spectrum();return S.l.map(x=>x[1])}
function renderPolCard(){const C=$('#polCard');C.innerHTML='';const pp=pubPol(),S=spectrum();
  const h=el('div','ch');h.innerHTML=`<h2>정치 성향</h2><span class="mut small">${S.n}</span>`;C.appendChild(h);
  const lab=el('div','pol-lab');lab.innerHTML=`<b style="color:${s.pol<=-25?'var(--roy)':s.pol>=35?'var(--rad)':'var(--fg)'}">${polLabel(s.pol)}</b> <span class="mut">${s.pol>0?'+':''}${s.pol}</span>${pp!==s.pol?` <span class="mut small">· 겉으로는 ${polLabel(pp)}</span>`:''}`;C.appendChild(lab);
  const sp=el('div','spec');sp.innerHTML=`<div class="bar">${pp!==s.pol?`<i class="pub" style="left:${polPos(pp)}%"></i>`:''}<i class="mk" style="left:${polPos(s.pol)}%"></i></div><div class="lbl">${specLabels().map(x=>`<span>${x}</span>`).join('')}</div>`;C.appendChild(sp);
  const info=el('p','small');info.innerHTML=`${s.party?`<b>${FAC[s.party].n}</b> ${PRANK[s.prank]}`:'<span class="mut">무소속</span>'} · <span class="mut">처신</span> ${CONDUCT.find(x=>x.k===conduct()).n}`;C.appendChild(info);
  const b=el('button','pill','정치 활동 ›');b.type='button';b.onclick=()=>showPolitics();C.appendChild(b)}
function planBox(){const W=el('div','planw');W.appendChild(el('h3',null,'한 해의 방침'));
  W.appendChild(el('p','mut',`해가 바뀔 때 이 방침대로 지표가 자랍니다.${s.goal?` 평생의 뜻은 ‘${s.goal}’${s.goalDone?'(이룸)':''}.`:''}`));
  const pg=el('div','plans');PLANS.forEach(p=>{const b=el('button','plan');b.type='button';b.innerHTML=`<b>${p.k}</b><small>${p.s}</small>`;b.setAttribute('aria-pressed',String(s.plan===p.k));
    if(p.k==='학업'&&!lit())b.disabled=true;if(p.k==='정치'&&s.year<1788)b.disabled=true;
    b.onclick=()=>{s.plan=p.k;save();pg.querySelectorAll('.plan').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))};pg.appendChild(b)});W.appendChild(pg);return W}
// 진행 막대: 한 해 가운데 지금 위치
function drawProg(dur){const f=$('#progFill');if(!f||!s)return;const step=tickMonths()/12;const cur=(s.month+1)/12;f.style.transition='none';f.style.width=Math.min(100,(cur-step+step*frac)*100)+'%';
  if(dur){void f.offsetWidth;f.style.transition=`width ${dur}ms linear`;f.style.width=Math.min(100,cur*100)+'%'}}

/* ================= 겹창(행동·정치·이력·설명) ================= */
let panelResume=false;
function openPanel(title){const pin=$('#pin');pin.innerHTML='';$('#pT').textContent=title;$('#panel').hidden=false;document.body.classList.add('modal');if(running&&!paused){panelResume=true;setPaused(true)}return pin}
function closePanel(){$('#panel').hidden=true;document.body.classList.remove('modal');if(panelResume){panelResume=false;setPaused(false)}}
function actButtons(list,box){list.forEach(a=>{const used=s.acts[a.k]===s.year,poor=a.cost&&s.money<a.cost;const b=el('button','opt row');b.type='button';
  const sp=el('span');sp.appendChild(el('span','ol',a.n));sp.appendChild(el('small',null,a.s));b.appendChild(sp);b.appendChild(el('em',null,used?'올해 함':a.cost?`${a.cost}`:''));b.disabled=used||poor||sheetLive||busy;
  b.onclick=async()=>{if(busy||sheetLive)return;s.acts[a.k]=s.year;busy=true;$('#panel').hidden=true;try{if(a.inter){await a.inter();if(sheetLive)await done()}else a.f()}catch(e){console.error(e);sheetClose()}busy=false;render();save();if(s.dead){running=false;setTimeout(showEnd,900);return}closePanel()};
  box.appendChild(b)})}
function buildActs(pin){if(!s)return;
  if(child()){pin.appendChild(el('p','mut','열네 살이 되면 할 수 있는 일이 생깁니다.'));return}
  pin.appendChild(planBox());
  pin.appendChild(el('p','mut','행동은 각각 한 해에 한 번. 시간이 멈춘 동안 고를 수 있습니다.'));
  const list=ACTS.filter(a=>{try{return !a.hide&&a.c()}catch(e){return false}});const box=el('div','acts');
  if(list.length){ACT_GROUPS.forEach(([g,gn])=>{const sub=list.filter(a=>(a.g||actGroup(a))===g);if(!sub.length)return;box.appendChild(el('h3','ag',gn));actButtons(sub,box)});pin.appendChild(box);return}
  if(!list.length)box.appendChild(el('p','mut',s.cond==='prison'?'감옥에서는 할 수 있는 일이 없다.':s.cond==='emigre'?'망명지에서는 기다릴 수밖에 없다.':'지금은 할 수 있는 일이 없다.'));
  actButtons(list,box);pin.appendChild(box)}
function buildPolitics(pin){if(!s)return;
  const top=el('div','pol-top');top.innerHTML=`<div class="big">${s.pol>0?'+':''}${s.pol}</div><div><b>${polLabel(s.pol)}</b><div class="mut small">공개 입장 ${polLabel(pubPol())} · 처신: ${CONDUCT.find(x=>x.k===conduct()).n}</div><div class="mut">${s.party?`${FAC[s.party].n} ${PRANK[s.prank]}`:'무소속'}</div></div>${polSpark(160,40)}`;pin.appendChild(top);
  pin.appendChild(el('h3',null,'지금의 파벌'));const fs=activeFactions().slice().sort((a,b)=>a.pol-b.pol);
  if(!fs.length)pin.appendChild(el('p','mut','아직 정치적 파벌이 뚜렷하지 않다.'));
  const row=el('div','facs big');fs.forEach(f=>{const card=facCard(f,true);card.onclick=null;const w=el('div','facw');w.appendChild(card);
    if(!child()&&s.age>=16&&s.cond==='normal'&&s.party!==f.id){const b=el('button','pill',isM()?'가입한다':'지지한다');b.type='button';b.onclick=()=>{joinParty(f.id);render();save();showPolitics()};w.appendChild(b)}
    row.appendChild(w)});pin.appendChild(row);
  pin.appendChild(el('h3',null,'나의 강령'));pin.appendChild(el('p','mut','쟁점마다 입장을 밝힌다. 한 해에 쟁점 하나당 한 번. 공포정치 때 관용을, 복고왕정 때 급진을 말하면 혐의를 산다.'));
  if(!activeIssues().length)pin.appendChild(el('p','mut','지금은 공론장에서 다투는 큰 쟁점이 없다.'));
  activeIssues().forEach(iss=>{const r=el('div','iss');r.appendChild(el('div','in',`${iss.n} · `));r.firstChild.appendChild(el('span','fr',iss.fr));const ns=el('div','nodes');
    iss.opts.forEach(([n,v],i)=>{const on=s.stance[iss.id]===i;const b=el('button','node'+(on?' on':''));b.type='button';b.innerHTML=`<b>${n}</b><small>${on?'✓ 지지 중':'표명'}</small>`;b.style.setProperty('--nc',v<=-30?'var(--roy)':v>=40?'var(--rad)':'var(--mod)');
      b.disabled=on||child()||s.acts['st_'+iss.id]===s.year||s.cond!=='normal';b.onclick=()=>{s.acts['st_'+iss.id]=s.year;setStance(iss.id,i,true);render();save();showPolitics()};ns.appendChild(b)});r.appendChild(ns);pin.appendChild(r)});
  pin.appendChild(el('h3',null,'당 활동'));const list=PACTS.filter(a=>{try{return a.c()}catch(e){return false}});const box=el('div','acts');
  if(!list.length)box.appendChild(el('p','mut',s.party?'지금은 할 수 있는 당 활동이 없다.':'파벌에 들면 연설, 논설, 시위, 출마 같은 활동을 할 수 있다.'));actButtons(list,box);pin.appendChild(box)}
function showHist(host){if(!s)return;const pin=host||openPanel('이력');
  const dl=el('dl','kv');const add=(k,v)=>{dl.appendChild(el('dt',null,k));dl.appendChild(el('dd',null,v))};
  add('이름',`${s.given[0]} ${s.sur[0]}${s.given[1]?` (${s.given[1]} ${s.sur[1]})`:''}`);add('태어난 곳',`${REGIONS[s.region].n}, ${s.by}년 ${s.bm+1}월`);add('신분',`${ESTATES[s.estate].n} — ${ESTATES[s.estate].fr}`);add('신앙',{catholic:'가톨릭',protestant:'신교(위그노·루터파)',jewish:'유대교'}[s.faithKind]);add('글',lit()?'읽고 쓴다':'문맹');
  if(s.trait)add('성품',s.trait);if(s.goal)add('평생의 뜻',`${s.goal}${s.goalDone?' (이룸)':''}`);
  add('부모',`아버지 ${s.fa.alive?'생존':'사망'}, 어머니 ${s.mo.alive?'생존':'사망'}, 형제 ${s.sibs}명`);
  add('배우자',s.spouse?`${s.spouse.n} (${ESTATES[s.spouse.estate].n}) ${s.spouse.alive?'':s.divorced?'— 이혼':'— 사별'}`:'없음');
  add('자녀',s.kids.length?s.kids.map(k=>`${k.n}(${k.sex==='M'?'남':'여'}, ${k.alive?s.year-k.y+'세':'사망'})`).join(', '):'없음');
  add('정치',`${polLabel(s.pol)} (${s.pol>0?'+':''}${s.pol})${s.party?` · ${FAC[s.party].n} ${PRANK[s.prank]}`:''}`);pin.appendChild(dl);
  pin.appendChild(el('h3',null,'거쳐 간 일'));const ul=el('ul','hist');if(!s.hist.length)ul.appendChild(el('li',null,'아직 없다'));
  s.hist.forEach(h=>{const li=el('li',null,h.n);li.appendChild(el('small',null,` ${h.y0}–${h.y1??'지금'} · ${h.age}세부터`));ul.appendChild(li)});pin.appendChild(ul);
  const ex=[];if(s.flags.bastille)ex.push('바스티유 공격');if(s.flags.marche)ex.push('베르사유 행진');if(s.flags.dix)ex.push('8월 10일 튈르리 공격');if(s.flags.regicide)ex.push('국왕 사형 투표');if(s.flags.refractory)ex.push('선서 거부');if(s.flags.juror)ex.push('헌법 선서');if(s.cnt.emigre)ex.push('망명');if(s.cnt.arrest)ex.push(`체포 ${s.cnt.arrest}회`);if(s.cnt.battle)ex.push(`전투 ${s.cnt.battle}회`);if(s.flags.legion)ex.push('레지옹 도뇌르');if(s.flags.title)ex.push('제국 작위');if(s.flags.bienNat)ex.push('국유재산 매입');if(s.met&&s.met.length)ex.push('만난 인물: '+s.met.join(', '));
  if(ex.length){pin.appendChild(el('h3',null,'혁명의 발자취'));pin.appendChild(el('p',null,ex.join(' · ')))}}
function showHelp(){const pin=openPanel('설명');const g=el('div','gloss');
  [['진행','1789년 전에는 계절 단위, 1789년 1월부터는 한 달 단위로 흐릅니다. 중요한 결정이 오면 시간이 멈춰요. 고르면 바로 이어집니다.'],['건강','낮을수록 병에 잘 걸리고, 걸리면 더 위험합니다. 천연두·이질·발진티푸스·폐결핵·늑막염·콜레라 같은 병은 당대 기록의 발병률과 치사율을 따릅니다. 시기(1779년 서부 이질, 1832년 콜레라), 지역(늪 지방의 간헐열), 처지(감옥·전쟁·기근)에 따라 달라집니다. 쉰 살부터 해마다 줄어듭니다.'],['학식','글과 교양. 문맹이면 25를 넘지 못합니다. 분야가 따로 있습니다: 라틴어·고전, 신학, 법학, 의학 지식, 수학·자연과학, 철학·사상, 역사·지리, 외국어, 문학. 학교와 학부, 직업, 독서로 자라고 승진과 시험에 쓰입니다.'],['사교','사람을 다루는 솜씨. 승진, 선거, 항변, 당내 지위에 쓰입니다.'],['기술','손과 도구를 쓰는 솜씨. 수공업, 재봉, 그림, 악기, 인쇄, 외과 수술. 분야마다 숙련이 따로 있어 한 분야에 뛰어나도 다른 분야는 따로 익혀야 합니다.'],['체력','실제로 낼 수 있는 힘. 농사, 운반, 군사 훈련, 전투. 건강이 몸 전체의 상태라면 체력은 힘입니다. 마흔부터 줄어듭니다.'],['웅변','사교의 하위 숙련. 연설과 토론을 거듭할수록 오르고, 선거·클럽 연설·시정 선거에 쓰입니다.'],['신앙','소속(가톨릭·개신교·유대교)은 타고나고, 신앙생활은 고릅니다: 독실하게, 관습대로, 성직자와 갈등하며, 의심하며. 혁명기에는 비밀 미사, 이성의 축제, 최고 존재 숭배, 경신박애교도 고를 수 있습니다. 한 해에 한 번 바꿀 수 있습니다.'],['명성','얼마나 널리 알려졌는가. 좋기만 한 것은 아니어서 적의 눈에도 띕니다.'],['평판','집단마다 다릅니다. 가족, 이웃, 동업자, 민중, 상류사회가 같은 사람을 다르게 봅니다. 이웃 평판이 나쁘면 공포정치기에 고발당하기 쉽습니다.'],['영향력','공직, 파벌 내 지위, 인맥, 재산, 대중의 지지, 정권과의 관계를 합한 값입니다. 정권이 바뀌면 같은 경력도 득이 되거나 짐이 됩니다.'],['가치·의지','자유, 평등, 명예, 가족, 질서, 정의 가운데 무엇을 중히 여기는가. 겪은 일과 고른 길에 따라 조금씩 바뀝니다. 의지는 위험한 선택(전투, 도주, 시위, 결투)에 쓰입니다.'],['관계','실존 인물만 나옵니다. 그 시기 그 장소에 실제로 있던 사람을 학교, 일터, 클럽, 살롱, 군대에서 만납니다. 그들의 파벌과 죽음은 역사를 따릅니다. 친구, 스승, 동료, 후원자, 연인, 맞수. 친밀·신뢰·존경·경쟁심을 따로 셉니다. 후원자는 승진을 돕고 맞수는 방해합니다. 친한 사람이 적대 파벌에 있으면 갈등이 생깁니다.'],['경제','사는 곳(파리·지방 도시·농촌)의 물가와 화폐 가치. 빵·고기·포도주·장작·집세 값을 그 시절 돈(리브르와 수, 1795년부터 프랑과 상팀)으로 보여 줍니다. 아시냐 지폐가 무너지면 모아 둔 돈이 녹습니다.'],['처신','속마음과 공개 입장을 따로 봅니다. 소신대로 밝히면 명예를, 시류에 맞추면 안전을 얻지만 들통날 수 있고, 침묵하면 위험도 영향력도 줄어듭니다. 정권이 바뀔 때마다 지조를 지킬지 고릅니다.'],
   ['정치 성향','-100(절대왕정)에서 +100(급진 상퀼로트)까지. 강령 표명, 사건 선택, 파벌 활동으로 움직이고 해마다 기록됩니다. 시대마다 위험한 쪽이 바뀝니다.'],['파벌','그 시기에 실제로 있던 파벌만 나타납니다. 친밀도는 성향과 강령이 얼마나 맞는지입니다. 파벌이 몰락하면 지위가 높을수록 위험합니다.'],
   ['혐의','공포정치(1793~94) 때 체포 확률을 높입니다. 귀족 출신, 선서 거부, 왕당파 성향, 부유함, 반란 지역도 위험합니다.'],['자료','기록의 ‘자료’ 줄은 판정 주사위와 당대 통계에서 뽑은 확률을 보여 줍니다.']].forEach(([k,v])=>{const d=el('div');d.appendChild(el('b',null,k));d.appendChild(el('p',null,v));g.appendChild(d)});pin.appendChild(g)}
function showSources(){const pin=openPanel('참고 문헌');if(typeof LIFE_SRC==='undefined'||!LIFE_SRC.length){pin.appendChild(el('p','mut','아직 자료가 없습니다.'));return}
  pin.appendChild(el('p','mut',`게임 속 생활사 장면 ${LIFE_DATA.length}건의 근거가 된 학술 자료 ${LIFE_SRC.length}개입니다. 기록의 ‘자료’ 줄에서도 바로 열 수 있습니다.`));
  const ul=el('ol','srcs');LIFE_SRC.map((x,i)=>[x,i]).sort((a,b)=>a[0].c.localeCompare(b[0].c)).forEach(([x])=>{const li=el('li');const a=el('a',null,x.c);a.href=x.u;a.target='_blank';a.rel='noopener';li.appendChild(a);li.appendChild(el('small',null,` · 장면 ${x.n}건`));ul.appendChild(li)});pin.appendChild(ul)}
function showLives(){const pin=openPanel('지난 인생');const l=loadLives();if(!l.length)pin.appendChild(el('p','mut','아직 기록이 없습니다.'));const ul=el('ul','lives');
  l.forEach(x=>{const li=el('li');li.appendChild(el('b',null,x.ep));li.appendChild(document.createTextNode(` — ${x.n}, ${x.y}, ${x.age}세`));li.appendChild(el('p',null,x.txt));ul.appendChild(li)});pin.appendChild(ul)}

/* ================= 진행 제어 ================= */
let running=false,paused=false,busy=false,speed=1,timer=null;
let frac=0,tStart=0,tDur=0,ticking=false;
function freeze(){if(ticking){const e=performance.now()-tStart;frac=Math.min(.999,frac+(1-frac)*e/tDur);ticking=false}clearTimeout(timer);drawProg(0)}
function schedule(){clearTimeout(timer);if(!running||paused||busy||sheetLive||s.dead){drawProg(0);return}
  const dur=(1-frac)*msPer()/speed;tStart=performance.now();tDur=dur;ticking=true;drawProg(dur);
  timer=setTimeout(()=>{ticking=false;frac=0;step()},dur)}
async function step(){if(!running||busy)return;busy=true;try{await advanceSeason()}catch(e){console.error(e);sheetClose()}
  busy=false;render();save();if(s.dead){running=false;setTimeout(showEnd,900);return}
  if(!child()&&!s.goal&&s.age>=20)await pickGoal();schedule()}
async function pickGoal(){busy=true;sheetOpen('평생의 뜻','vocation');shText('스무 살. 무엇을 이루며 살고 싶은가?','q');
  const i=await shButtons(GOALS.map(g=>({l:g.k,s:g.s,a:{부:'greedy',명예:'social',자유:'radical',신앙:'pious',장수:'safe',가문:'family',학문:'study',무공:'bold'}[g.k]})));s.goal=GOALS[i].k;say(`평생의 뜻을 ‘${s.goal}’에 두었다.`);await done();busy=false;render();save()}
const PLAY='<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',PAUSE='<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><rect x="3" y="2" width="3.4" height="12" rx="1" fill="currentColor"/><rect x="9.6" y="2" width="3.4" height="12" rx="1" fill="currentColor"/></svg>';
function setPaused(p){paused=p;$('#pp').innerHTML=p?PLAY:PAUSE;$('#pp').setAttribute('aria-label',p?'재생':'일시정지');if(p)freeze();else schedule()}
function setSpeed(v){speed=v;document.querySelectorAll('#spd button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===v)));if(s)$('#subline').innerHTML=`<b>${s.given[0]} ${s.sur[0]}</b> · ${ym()} · <span class="mut">1년 ≈ ${secPerYear()}초</span>`;if(running&&!paused&&!busy){freeze();schedule()}try{localStorage.setItem(KEY+'_spd',v)}catch(e){}}

/* ================= 저장 ================= */
function save(){try{if(s&&!s.dead)localStorage.setItem(KEY,JSON.stringify(s));else localStorage.removeItem(KEY)}catch(e){}}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&x.v===2?attrsMigrate(x):null}catch(e){return null}}
function loadLives(){try{return JSON.parse(localStorage.getItem(LKEY)||'[]')}catch(e){return []}}
function recordLife(out,ep){try{const l=loadLives();l.unshift({n:`${s.given[0]} ${s.sur[0]}`,ep,y:`${s.by}–${s.year}`,age:s.age,txt:out.slice(0,2).join(' ')});localStorage.setItem(LKEY,JSON.stringify(l.slice(0,30)))}catch(e){}}

/* ================= 시작 ================= */
function start(fresh,o){$('#title').hidden=true;$('#end').hidden=true;document.body.classList.remove('covered');sheetClose();curTab='daily';setTab('daily');
  if(fresh){s=newState(o);rebuildLog();birth()}else rebuildLog();
  render();running=true;busy=false;frac=0;setPaused(false);save();
  try{if(!localStorage.getItem(KEY+'_hint')){$('#hint').hidden=false;localStorage.setItem(KEY+'_hint','1');setTimeout(()=>{$('#hint').hidden=true},7000)}}catch(e){}}
function showNameForm(){const f=$('#nameForm');f.hidden=false;
  $('#inYear').innerHTML='<option value="">무작위 (1750~1790)</option>'+Array.from({length:41},(_,i)=>1750+i).map(y=>`<option value="${y}">${y}년</option>`).join('');
  const est=$('#inEst');est.innerHTML='<option value="">무작위 (역사 비율)</option>'+Object.entries(ESTATES).map(([k,v])=>`<option value="${k}">${v.n} (${v.w}%)</option>`).join('');
  const reg=$('#inReg');reg.innerHTML='<option value="">무작위</option>'+Object.entries(REGIONS).map(([k,v])=>`<option value="${k}">${v.n}</option>`).join('');
  const rg=()=>{const sx=$('#inSex').value==='F'?'F':'M';$('#inGiven').value=pick(sx==='M'?M_NAMES:F_NAMES)[0]};const rs=()=>{const e=$('#inEst').value;$('#inSur').value=(e&&ESTATES[e].noble?pick(NOBLE_SURS):pick(SURS))[0]};
  $('#rGiven').onclick=rg;$('#rSur').onclick=rs;$('#inSex').onchange=()=>{$('#inGiven').value=''};$('#inEst').onchange=()=>{$('#inSur').value=''};
  $('#goB').onclick=()=>{const sex=$('#inSex').value==='R'?(R()<.5?'M':'F'):$('#inSex').value;start(true,{sex,year:+$('#inYear').value||null,estate:$('#inEst').value||null,region:$('#inReg').value||null,given:$('#inGiven').value.trim()||null,sur:$('#inSur').value.trim()||null,hard:$('#inHard').checked})};
  f.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}

/* ================= 부고 ================= */
function eraColor(){return `var(--${era().c})`}
function epithet(){const d=s.death||{},c=d.cause;
  if(s.age<5)return '세례 명부의 짧은 이름';
  if(c==='guillotine')return deputy()||s.flags.wasDeputy?'국민공회의 희생자':noble()?'단두대에 오른 귀족':'단두대의 이슬';
  if(c==='massacre')return loc()==='vendee'?'방데의 순교자':'9월의 희생자';
  if(c==='cold')return '러시아 설원의 병사';
  if(c==='battle'&&(s.best.army||0)>=6)return '전장에 쓰러진 장군';if(c==='battle')return `${d.detail||'전장'}의 전사자`;
  if(c==='deported')return '기아나의 유형수';if(c==='drowned')return '강물에 잠긴 이';
  if((s.best.army||0)>=7)return '제국의 원수';if((s.best.army||0)>=6)return T()<1804?'공화국의 장군':'제국의 장군';
  if(s.party&&s.prank>=3)return `${FAC[s.party].n}의 지도자`;
  if(s.flags.regicide)return '국왕 시해자';if(s.flags.bastille)return '바스티유의 정복자';if(s.flags.marche)return '베르사유로 간 여인';
  if(s.flags.wasDeputy)return '인민의 대표';if(s.best.church>=5)return '주교 각하';if(s.flags.refractory)return '숲 속의 사제';
  if(s.cond==='emigre')return '돌아오지 못한 망명객';if(s.cnt.emigre)return '돌아온 망명객';
  if(s.flags.vendeen)return '하느님과 왕을 위하여';if(s.cnt.arrest&&T()>1794.5)return '공포정치 생존자';
  if(s.flags.bienNat&&s.money>=50000)return '국유재산의 주인';if(s.best.craft>=6)return '혁명이 만든 부자';if(s.flags.title)return '제국의 귀족';
  if(s.age>=80)return '세기의 증인';if(noble()&&!s.hist.length)return '영지의 주인';
  const j=s.hist.length?s.hist[s.hist.length-1].n:null;return j?`이름 없는 ${j}`:'이름 없는 사람'}
function obituary(){const d=s.death,nm=`${s.given[0]} ${s.sur[0]}`,out=[];
  const bestH=s.hist.reduce((b,h)=>{const p=POST[h.id];return !b||p.t>POST[b.id].t?h:b},null);
  const ttl=s.job?pname(job()):bestH?`전 ${bestH.n}`:'';
  out.push(`${d.year}년 ${s.month+1}월, ${ttl?ttl+' ':''}${jo(nm,'이','가')} ${s.age}세로 숨을 거두었다. 사인은 ${d.cause==='ill'?d.detail:CAUSE[d.cause]}.`);
  out.push(`${s.by}년 ${REGIONS[s.region].n}의 ${ESTATES[s.estate].n} 집안에서 ${isM()?'아들':'딸'}로 태어났다.${s.faithKind==='protestant'?' 위그노였다.':s.faithKind==='jewish'?' 유대인이었다.':''}${lit()||s.age<8?'':' 평생 글을 몰랐다.'}`);
  if(s.age<14){out.push(s.age<2?'세례를 받은 것이 생의 거의 전부였다. 그 시절 프랑스 아이 넷 중 하나가 그렇게 갔다.':'어른이 되기 전에 세상을 떠났다.');return out}
  if(s.hist.length){const seq=s.hist.map(h=>h.n);out.push(`${[...new Set(seq)].join(', ')}${bat(seq[seq.length-1])?'을':'를'} 거쳤다.`)}
  const ex=[];if(s.flags.bastille)ex.push('1789년 7월 14일 바스티유를 공격했다');if(s.flags.marche)ex.push('빵을 달라며 베르사유까지 행진했다');if(s.flags.constituent)ex.push('삼부회 대표로 뽑혀 테니스코트의 방에 있었다');else if(s.flags.wasDeputy)ex.push('국민의 대표로 의사당에 앉았다');
  if(s.flags.regicide)ex.push('왕의 사형에 표를 던졌다');if(s.flags.refractory)ex.push('헌법 선서를 거부했다');if(s.flags.juror)ex.push('헌법에 선서했다');if(s.flags.vendeen)ex.push('방데의 왕당군에 들었다');
  if(s.cnt.emigre)ex.push(`${s.emiPlace||'국외'}로 망명했다`);if(s.cnt.arrest)ex.push(`${s.cnt.arrest}번 체포되었다`);if(s.cnt.battle)ex.push(`${s.cnt.battle}번의 전투에 나섰다`);
  if(ex.length)out.push(ex.join(', ')+'.');
  out.push(`정치적으로는 ${polLabel(s.pol)}(${s.pol>0?'+':''}${s.pol})였다.${s.party?` 마지막으로 ${FAC[s.party].n}의 ${PRANK[s.prank]}였다.`:''}`);
  const hon=[];if(s.flags.legion)hon.push('레지옹 도뇌르를 받았다');if(s.flags.title)hon.push('제국 작위를 받았다');if(s.flags.book)hon.push('책을 남겼다');if(hon.length)out.push(hon.join(', ')+'.');
  if(s.met&&s.met.length)out.push(`생전에 ${s.met.join(', ')}${bat(s.met[s.met.length-1])?'을':'를'} 직접 보았다.`);
  const k=s.kids.length,ka=adultKids();out.push(s.spouse?`${jo(s.spouse.n,'과','와')} 혼인하여 자녀 ${k}명을 두었고, 그 가운데 ${ka}명이 어른이 되었다.`:'혼인하지 않았다.');
  out.push(`남긴 재산은 ${fmt(s.money)} ${money()}${s.land?`, 해마다 ${fmt(s.land)}의 지대가 나오는 땅`:''}.`);
  return out}
function showEnd(){if(!s||!s.dead||!s.death)return;const out=obituary(),ep=epithet();recordLife(out,ep);try{localStorage.removeItem(KEY)}catch(e){}
  $('#obName').innerHTML=`${s.given[0]} ${s.sur[0]}${s.given[1]?`<small>${s.given[1]} ${s.sur[1]}</small>`:''}`;
  $('#obYears').textContent=`${s.by}. ${s.bm+1}. ${s.bd||1} – ${s.year}`;
  $('#obWill').textContent=`“${willLine()}”`;
  // 인간관계의 결과
  const ul=$('#obRels');ul.innerHTML='';const fam=[];
  if(s.spouse)fam.push([`${isM()?'아내':'남편'} ${s.spouse.n||''}`.trim(),s.spouse.alive?'그대를 떠나보냈다':s.divorced?'오래전에 갈라섰다':'먼저 세상을 떠났다']);
  const kA=kidsAlive().length,kD=s.kids.length-kA;if(s.kids.length)fam.push([`자녀 ${s.kids.length}명`,`${kA}명이 살아 남았다${kD?` · ${kD}명을 먼저 묻었다`:''}`]);
  const rs=(s.rel||[]).slice().sort((a,b)=>(b.close+(b.hate||0)+b.riv+b.resp)-(a.close+(a.hate||0)+a.riv+a.resp)).slice(0,6);
  fam.concat(rs.map(r=>[`${r.n} · ${relBond(r)}`,r.alive?(relBond(r)==='혐오'?'그대가 죽은 뒤에도 살아남았다':relBond(r)==='친우'?'관 곁을 지켰다':'소식을 듣고 슬퍼했다'):relEnd(r)||'먼저 떠났다'])).forEach(([n,v])=>{const li=el('li');li.innerHTML=`<b>${n}</b><span>${v}</span>`;ul.appendChild(li)});
  if(!ul.children.length)ul.appendChild(el('li','mut','곁에 남은 이가 없었다.'));
  // 사후 평가
  const ev=$('#obEval');ev.innerHTML='';const sc=legacyScore();ev.appendChild(el('div','ob-ep',`「${ep}」`));ev.appendChild(el('div','ob-st',`${'★'.repeat(sc)}${'☆'.repeat(5-sc)}`));
  ev.appendChild(el('p','small',legacyText()));
  $('#end').hidden=false;document.body.classList.add('covered');$('#end').scrollTop=0}
// 후세의 평가: 명성·영향력·업적·혐의로 별 다섯 개까지
function legacyScore(){let p=0;p+=s.fame>=70?2:s.fame>=35?1:0;const iv=influence().v;p+=iv>=50?1:0;if((s.best&&Object.values(s.best).some(v=>v>=5))||s.flags.wasDeputy||s.flags.book||s.flags.legion)p++;if(s.flags.bastille||s.flags.regicide||s.flags.title)p++;if(s.age>=14&&s.goalDone)p++;return clamp(p,s.age>=14?1:0,5)}
function legacyText(){const o=obituary();const txt=o.slice(0,1).concat(o.slice(2,4)).join(' ');const pol=s.age>=16?` 후세 사람들은 그를 ${polLabel(s.pol)}의 한 사람으로 기억했다.`:'';const rp=s.rep&&s.rep.rpeople>=65?' 이웃들은 오래도록 그의 이름을 말했다.':s.rep&&s.rep.rloc<=30?' 동네 사람들은 그의 이름을 꺼내지 않았다.':'';return txt+pol+rp}
// 마지막 한마디: 성품·가치·정치 성향·신앙·평생의 뜻·죽음의 방식에서 고른다
function willLine(){const d=s.death||{},c=d.cause,p=s.pol,tv=topValues(1)[0],fm=faithModeNow(),k=kidsAlive().length,tr=s.trait;
  if(s.age<7)return pick(['엄마…','따뜻하다.','빵 한 조각만…']);
  if(s.age<14)return pick(['아버지처럼 큰 사람이 되고 싶었는데.','내일은 강가에 가자고 약속했잖아.','무섭지 않아요. 신부님이 천국이 있다고 했어요.']);
  const L=[];const add=(w,txt)=>L.push([txt,w]);
  if(c==='guillotine')add(6,p>=30?'공화국 만세. 내 머리는 가져가도 내 신념은 못 가져간다.':noble()?'왕과 신 앞에 부끄러움은 없다. 아이들에게 내 이름을 숨기지 말라고 전해 다오.':'나는 죄 없이 죽는다. 그대들의 공화국이 언젠가 이 피를 기억하기를.');
  if(c==='battle'||c==='cold')add(6,T()>=1804?'황제 폐하 만세… 고향의 포도밭이 보고 싶다.':'조국이 위기에 처했을 때 나는 달아나지 않았다.');
  if(c==='childbirth')add(6,'아이 이름은… 아이를 부탁해요.');
  if(c==='massacre'||c==='shot'||c==='executed')add(5,'내 이웃들이여, 언젠가 부끄러워할 날이 올 것이다.');
  if(s.flags.girouette||(s.turns||0)>=3)add(4,'바람이 바뀔 때마다 돛을 고쳐 달았을 뿐이다. 살아남는 것도 재주다.');
  if(p>=60)add(3,'빵과 자유를. 내가 못 본 공화국을 너희는 보아라.');
  if(p<=-50)add(3,'왕좌와 제단이 다시 서는 것을 보았으니 여한이 없다.');
  if(s.flags.bastille)add(3,'7월 14일의 그 아침, 나는 거기 있었다. 그것으로 충분하다.');
  if(s.flags.regicide)add(3,'왕의 목에 표를 던진 손이다. 역사가 나를 판단하겠지.');
  if(fm==='devout'||fm==='secret')add(3,'주님, 이 죄 많은 영혼을 받아 주소서. 미사는 꼭 올려 다오.');
  if(fm==='doubt')add(2,'신부는 부르지 마라. 볼테르처럼, 조용히 가겠다.');
  if(fm==='conflict')add(2,'교회에는 한 푼도 남기지 마라. 가난한 이웃에게 나눠 주어라.');
  if(s.goal&&s.goalDone)add(3,{부:'금고 열쇠는 맏이에게. 돈은 피보다 진하지 않다는 걸 잊지 마라.',명예:'훈장은 관에 넣지 말고 손자에게 물려주어라.',자유:'의사당 연단에서 외친 말들, 하나도 후회하지 않는다.',신앙:'평생 하느님을 떠나지 않았다. 이제 그분께 간다.',장수:'왕 셋과 황제 하나를 보았다. 이만하면 오래 살았다.',가문:'너희가 내 재산이다. 서로 다투지 마라.',학문:'내 책은 서가 맨 위 칸에. 누군가 읽어 주기를.',무공:'칼은 녹슬어도 내 이름은 연대 깃발에 남았다.'}[s.goal]);
  if(s.goal&&!s.goalDone)add(2,`${s.goal}${bat(s.goal)?'을':'를'} 이루지 못했다. 너희가 대신 이뤄 다오.`);
  if(k>=3)add(2,'아이들아, 서로 미워하지 말고 집을 지켜라.');
  if(s.widowed&&!(s.spouse&&s.spouse.alive))add(2,`${s.spouse&&s.spouse.n?s.spouse.n:'그 사람'} 곁에 묻어 다오.`);
  const fr=(s.rel||[]).filter(r=>r.alive&&relBond(r)==='친우')[0];if(fr)add(2,`${fr.n}에게 전해 다오. 그대 같은 벗이 있어 견딜 수 있었다고.`);
  const foe=(s.rel||[]).filter(r=>relBond(r)==='혐오')[0];if(foe)add(1,`${jo(foe.n,'은','는')} 용서하지 않겠다. 아니, 이제는 다 부질없다.`);
  if(tr==='열정')add(2,'뜨겁게 살았다. 미지근한 삶보다는 나았다.');if(tr==='신중')add(2,'조심스럽게 살았기에 여기까지 왔다. 너희도 그렇게 살아라.');if(tr==='야심')add(2,'조금만 더 시간이 있었다면 더 높이 올라갔을 텐데.');if(tr==='쾌활')add(2,'포도주 한 잔 따라 다오. 장례는 시끌벅적하게.');if(tr==='계몽')add(2,'빛을 보았다. 미신과 무지를 물리쳐라.');if(tr==='경건')add(2,'내 묵주를 손에 쥐여 다오.');
  add(1,{vlib:'누구에게도 무릎 꿇지 마라.',veq:'왕이든 짐꾼이든 묘지에서는 같다.',vhon:'이름에 먹칠하지 마라. 그것만 지켜라.',vfam:'식구끼리 밥상에 함께 앉거라. 그게 전부다.',vord:'법과 질서를 지켜라. 혼란은 모두를 삼킨다.',vjus:'빚진 사람에게 다 갚았다. 떳떳하게 간다.'}[tv]);
  if(s.money<50)add(1,'남길 것은 없다. 이름 하나뿐.');if(rich())add(1,'공증인을 불러라. 한 푼도 허투루 나누지 마라.');
  return wpick(L)}
/* ================= 연결 ================= */
function boot(){logBox=$('#log');$('#logMore').onclick=()=>{logLimit+=LOG_STEP;foldLog()};$('#logLess').onclick=()=>{logLimit=LOG_STEP;foldLog();$('.logc').scrollIntoView({block:'start',behavior:RM?'auto':'smooth'})};
  try{const v=+localStorage.getItem(KEY+'_spd');if([1,2,4,8,12,16].includes(v))speed=v}catch(e){}setSpeed(speed);
  const saved=load();if(saved){$('#contB').hidden=false;$('#contB').onclick=()=>{s=load()||saved;start(false)}}
  $('#againB').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;document.body.classList.add('covered');s=null;$('#contB').hidden=true;rollPre()};
  $('#homeB').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;s=null;$('#contB').hidden=!load()};
  $('#pClose').onclick=closePanel;
  $('#pp').onclick=()=>{if(running)setPaused(!paused)};
  document.querySelectorAll('#spd button').forEach(b=>b.onclick=()=>setSpeed(+b.dataset.s));
  $('#nextB').onclick=()=>{if(!running||busy||sheetLive)return;clearTimeout(timer);ticking=false;frac=0;step()};
  $('#moreB').onclick=e=>{e.stopPropagation();$('#menu').hidden=!$('#menu').hidden};document.addEventListener('click',()=>{$('#menu').hidden=true});
  $('#mHist').onclick=()=>showHist();$('#mHelp').onclick=showHelp;$('#mLives').onclick=showLives;$('#mSrc').onclick=showSources;$('#mPol').onclick=showPolitics;$('#mInfo').onclick=showInfo;
  try{if(localStorage.getItem(KEY+'_data')==='1')document.body.classList.add('showdata')}catch(e){}$('#dataT').setAttribute('aria-pressed',String(document.body.classList.contains('showdata')));
  $('#dataT').onclick=()=>{const on=document.body.classList.toggle('showdata');$('#dataT').setAttribute('aria-pressed',String(on));$('#dataT').textContent=on?'자료 가리기':'자료 보기';try{localStorage.setItem(KEY+'_data',on?'1':'0')}catch(e){}};$('#autoT').onclick=()=>setAuto(!autoMode);
  $('#mNew').onclick=()=>{if(!s)return;running=false;freeze();save();$('#menu').hidden=true;$('#title').hidden=false;document.body.classList.add('covered');$('#contB').hidden=!load()};$('#hint').onclick=()=>{$('#hint').hidden=true};
  $('#pp').innerHTML=PAUSE;
}
boot();

/* ================= 인물 · 관계 · 경제 카드 ================= */
const bar=(v,lo=0,hi=100,c='var(--fg)')=>`<s class="mbar"><u style="width:${Math.round((v-lo)/(hi-lo)*100)}%;background:${c}"></u></s>`;
const axBar=v=>`<s class="axbar"><i style="left:${(v+100)/2}%"></i></s>`;
function faithBox(compact){const W=el('div','faithw');W.appendChild(el('div','lab',`신앙 · ${faithLabel()}`));const row=el('div','fopts');
  FAITHM.filter(m=>m.ok()).forEach(m=>{const b=el('button','fopt');b.type='button';b.innerHTML=compact?m.n:`<b>${m.n}</b><small>${m.s}</small>`;b.setAttribute('aria-pressed',String(faithModeNow()===m.k));
    b.disabled=child()||s.acts.faithMode===s.year||s.cond==='prison';b.title=m.s;b.onclick=()=>{setFaithMode(m.k);render();save();if(!compact)showInfo()};row.appendChild(b)});
  W.appendChild(row);if(s.acts.faithMode===s.year)W.appendChild(el('small','mut','올해는 이미 신앙생활을 바꾸었다.'));return W}
function skillGroups(min=0){return SKG.map(([base,gn,keys])=>{const src=base==='edu'?(s.kn||{}):s.sk;const ks=keys.filter(k=>(src[k]||0)>min).sort((a,b)=>src[b]-src[a]);return [base,gn,ks,src]})}
// 초상: 장면과 같은 픽셀 인물을 한 사람만 크게
function drawPortrait(cv){if(!cv||typeof makeG!=='function'||typeof drawPeople!=='function')return;const W=256,H=96;const off=document.createElement('canvas');off.width=W;off.height=H;const c=off.getContext('2d');
  const g=makeG(c,{seed:s.by*31+7,t:T(),era:era().k,season:s.season,loc:loc()});c.fillStyle='rgba(0,0,0,0)';c.clearRect(0,0,W,H);
  drawPeople(g,[{sex:s.sex,age:s.age,me:false,estate:s.estate,role:sceneRole(),pol:s.pol}]);
  const pc=cv.getContext('2d');pc.imageSmoothingEnabled=false;pc.clearRect(0,0,cv.width,cv.height);
  const sw=26,sh=32,sx=W/2-sw/2,sy=GY+3-sh;pc.drawImage(off,sx,sy,sw,sh,0,0,cv.width,cv.height)}
function statusLine(){const j=job();return [ESTATES[s.estate].n,child()?(inSchool()?schoolStatus():s.age<7?'어린아이':'아이'):statusText()].filter(Boolean).join(' · ')}
function docTitle(){const t=T();return t<1792.6?['세례 증서','Extrait baptistaire']:t<1795.8?['시민증','Carte de civisme']:t<1814.3?['신분증','Carte de sûreté']:['여권','Passeport']}
function renderProfile(){const C=$('#profCard');if(!C)return;C.innerHTML='';const inf=influence(),[dt,dtf]=docTitle();
  const top=el('div','pf-top');top.innerHTML=`<div class="pf-doc"><span>${dt}</span><i>${dtf}</i></div>`;C.appendChild(top);
  const id=el('div','pf-id');const cv=el('canvas','pf-por');cv.width=72;cv.height=88;cv.setAttribute('aria-hidden','true');id.appendChild(cv);
  const who=el('div','pf-who');who.innerHTML=`<div class="pf-n">${s.given[0]} ${s.sur[0]}</div><div class="pf-fr">${[s.given[1],s.sur[1]].filter(Boolean).join(' ')}</div>`+
   `<div class="pf-l">${s.age}세 · ${isM()?'남':'여'} · ${statusLine()}</div><div class="pf-l mut">${REGIONS[loc()].n} · ${homeLabel()}</div><div class="pf-l mut">${familyAges().replace(/^나 \d+세( · )?/,'')||'혼자'}</div>`;
  id.appendChild(who);C.appendChild(id);drawPortrait(cv);
  const bd=el('div','pf-badges');
  bd.innerHTML=[['명성',s.fame,s.fame>=60?'나라 안에 이름이 났다':s.fame>=30?'고장의 유명인':s.fame>=10?'아는 사람만 안다':'이름 없는 사람','fame'],['영향력',inf.v,inf.b.filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,1).map(x=>x[0])[0]||'없음','inf'],['재산',fmt(s.money),money()+(s.land?` · 지대 ${fmt(s.land)}`:''),'money'],['혐의',s.sus,s.sus>=50?'위험':s.sus>=25?'주목받음':'깨끗함','sus']]
   .map(([n,v,sm,k])=>`<div class="bdg ${k}${k==='sus'&&s.sus>=30?' warn':''}"><span>${n}</span><b>${v}</b><small>${sm}</small></div>`).join('');C.appendChild(bd);
  const st=el('div','pf-stats');st.innerHTML=STATS.map(([k,n,ab])=>`<div class="ps"><span>${n}<i>${ab}</i></span><s><u style="width:${s.st[k]}%;background:${STATC[k]}"></u></s><b>${s.st[k]}</b></div>`).join('');C.appendChild(st);
  const tl=el('div','pf-tal small');tl.innerHTML=`<span class="mut">재능</span> ${topTalents(3).filter(x=>x[2]>=55).map(x=>`<span class="tchip">${x[1]} <i>${stars(x[2])}</i></span>`).join('')||'<span class="mut">아직 드러나지 않았다</span>'}${s.trait?` <span class="mut">· 성품</span> ${s.trait}`:''}${s.goal?` <span class="mut">· 뜻</span> ${s.goal}`:''}`;C.appendChild(tl);
  C.appendChild(faithBox(true));
  const rp=el('div','chips reps');REPG.forEach(([k,n])=>{const v=s.rep[k];if(v>=40&&v<=60)return;const w=repWord(k);rp.appendChild(el('span','chip'+(v>=65?' on':'')+(v<=35?' bad':''),`${n} ${w&&w!=='—'?w:v}`))});if(rp.children.length)C.appendChild(rp);
}
function famLine(){const o=[];if(s.fa.alive)o.push(`아버지 ${s.fa.age}세`);if(s.mo.alive)o.push(`어머니 ${s.mo.age}세`);if(s.spouse&&s.spouse.alive)o.push(`${isM()?'아내':'남편'} ${s.spouse.n||''}`.trim());const k=kidsAlive().length;if(k)o.push(`자녀 ${k}`);return o.join(' · ')||'가족이 없다'}
function relRow(r,full){const d=el('div','rel');const f=r.fac&&FAC[r.fac];const P=perOf(r);
  d.innerHTML=`<div class="rh"><b>${r.n}</b>${P?`<span class="mut small">${P.fr} · ${P.b}~${P.d}</span>`:''}<span class="tag">${r.role}</span>${f?`<span class="tag f" style="--fc:${facColor(f)}">${f.n}</span>`:''}</div>`+
   (full&&P?`<p class="small mut">${P.bio}${r.w?` ${r.w}.`:''}</p>`:'')+`<div class="rv"><span>친밀 ${r.close}</span><span>신뢰 ${r.trust}</span><span>존경 ${r.resp}</span>${r.riv>=20?`<span class="warn">경쟁심 ${r.riv}</span>`:''}</div>`;return d}
function renderRel(){const C=$('#relCard');if(!C)return;C.innerHTML='';const h=el('div','ch');h.innerHTML=`<h2>관계</h2><span class="mut">${famLine()}</span>`;C.appendChild(h);
  const rl=relsAlive().sort((a,b)=>(b.close+b.riv)-(a.close+a.riv)).slice(0,5);
  if(!rl.length)C.appendChild(el('p','mut',child()?'아직 어려서 집 밖의 인연이 많지 않다.':'가까운 사람이 아직 없다. 학교, 일터, 파벌, 이웃에서 사람을 만난다.'));
  const box=el('div','rels');rl.forEach(r=>box.appendChild(relRow(r)));C.appendChild(box);
  if(s.party&&FAC[s.party]){const my=FAC[s.party];const fs=activeFactions().filter(f=>f.id!==my.id).map(f=>[f,facPair(my.id,f.id)]).filter(x=>Math.abs(x[1])>=40);
    if(fs.length){const p=el('p','mut small');p.innerHTML=`${my.n}의 동맹: ${fs.filter(x=>x[1]>0).map(x=>x[0].n).join(', ')||'없음'} · 적: ${fs.filter(x=>x[1]<0).map(x=>x[0].n).join(', ')||'없음'}`;C.appendChild(p)}}}
function renderEcon(){const C=$('#econCard');if(!C)return;const E=econ();const bk=basket();
  C.innerHTML=`<span class="ec-i"><span class="mut">빵 4리브르</span> <b>${priceTxt(bk[0][1],bk[0][2])}</b></span><span class="ec-i"><span class="mut">물가</span> <b>×${E.price.toFixed(2)}</b> ${econWord('price',E.price)}</span><span class="ec-i"><span class="mut">화폐 가치</span> <b>${Math.round(E.cur*100)}%</b></span>`;C.title=curNote()}
function buildInfo(pin){if(!s)return;
  pin.appendChild(el('h3',null,'건강 (CON)'));const hg=el('div','cgrid');hg.innerHTML=HSUB.map(([k,n])=>`<div><span class="lab">${n}</span><b>${hsub(k)}</b>${bar(hsub(k),0,100,'var(--green)')}</div>`).join('');pin.appendChild(hg);
  if(s.ill)pin.appendChild(el('p','warn',`지금 앓는 병: ${illName()}`));
  pin.appendChild(el('h3',null,'재능 · 타고난 잠재력'));const tg=el('div','tals');
  TALENTS.map(x=>[x,(s.tal||{})[x[0]]||0]).sort((a,b)=>b[1]-a[1]).forEach(([[k,n,ks],v])=>{const d=el('div','tal'+(v>=55?' on':''));d.innerHTML=`<b>${n}</b><span class="st">${stars(v)||'·'}</span><small>${ks.map(x=>FXN[x]).slice(0,3).join(' · ')}</small>`;tg.appendChild(d)});pin.appendChild(tg);
  skillGroups(-1).forEach(([base,gn,ks,src])=>{pin.appendChild(el('h3',null,`${gn} (${STATS.find(x=>x[0]===base)[2]}) 분야`));const g=el('div','cgrid');g.innerHTML=ks.map(k=>`<div><span class="lab">${FXN[k]}${TAL_BY[k]&&TAL_BY[k].some(t=>(s.tal||{})[t]>=70)?' <i class="tk">★</i>':''}</span><b>${src[k]||0}</b>${bar(src[k]||0)}</div>`).join('');pin.appendChild(g)});
  pin.appendChild(el('h3',null,'신앙'));pin.appendChild(faithBox(false));
  pin.appendChild(el('h3',null,'평판'));const rp=el('div','cgrid');rp.innerHTML=REPG.map(([k,n])=>`<div><span class="lab">${n}</span><b>${s.rep[k]}</b>${bar(s.rep[k],0,100,s.rep[k]<=35?'var(--red)':'var(--green)')}<small>${repWord(k)}</small></div>`).join('');pin.appendChild(rp);
  const inf=influence();pin.appendChild(el('h3',null,`명성 ${s.fame} · 정치적 영향력 ${inf.v}`));const ul=el('ul','infl');(inf.b.length?inf.b:[['아직 아무 영향력이 없다',0]]).forEach(([n,v])=>ul.appendChild(el('li',null,`${n} ${v>0?'+':''}${v||''}`)));pin.appendChild(ul);
  pin.appendChild(el('h3',null,'가치와 의지'));const vv=el('div','cgrid');vv.innerHTML=VALUES.map(([k,n])=>`<div><span class="lab">${n}</span><b>${s.val[k]}</b>${bar(s.val[k],0,100,'var(--teal)')}</div>`).join('')+`<div><span class="lab">의지</span><b>${s.st.cour}</b>${bar(s.st.cour,0,100,'var(--rad)')}</div>`;pin.appendChild(vv)}

/* ================= 하단 메뉴: 프로필 · 관계 · 일상 · 생활 · 시대 ================= */
let curTab='daily';
const TABS={profile:'#tProfile',rel:'#tRel',daily:'#tDaily',life:'#tLife',era:'#tEra'};
function setTab(t){if(!TABS[t])return;curTab=t;Object.entries(TABS).forEach(([k,q])=>{$(q).hidden=k!==t});document.querySelectorAll('#nav button').forEach(b=>{if(b.dataset.t===t)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')});
  closePanel();if(s)renderTab(t);if(t==='daily'&&s)drawScene($('#cv'));window.scrollTo({top:0,behavior:'auto'})}
function showActs(){setTab('life')}function showPolitics(){setTab('era')}function showInfo(){setTab('profile')}
function hostClear(q){const h=$(q);h.innerHTML='';return h}
function cardIn(host,title,fr){const c=el('section','card');const h=el('div','ch');h.innerHTML=`<h2>${title}</h2>${fr?`<span class="fr">${fr}</span>`:''}`;c.appendChild(h);host.appendChild(c);return c}
let tabBusy=false;
function renderTab(t){if(!s||tabBusy)return;tabBusy=true;const keepY=window.scrollY;
  try{
  if(t==='profile'){renderProfile();const H=hostClear('#profMore');buildInfo(cardIn(H,'세부 정보','Détails'))}
  if(t==='rel'){renderRel();const H=hostClear('#relMore');relMore(H)}
  if(t==='life'){const H=hostClear('#lifeHost');buildActs(cardIn(H,'생활','La vie quotidienne'));showHist(cardIn(H,'이력','État civil'));lifeEcon(cardIn(H,'살림과 물가','Le ménage'))}
  if(t==='era'){renderPolCard();const H=hostClear('#eraHost');eraCard(cardIn(H,era().n,era().h));buildPolitics(cardIn(H,'정치','La politique'))}
  }catch(e){console.error(e)}tabBusy=false;window.scrollTo(0,keepY)}
function relMore(H){const c=cardIn(H,'사람들','Les proches');const rl=relsAlive();if(!rl.length)c.appendChild(el('p','mut','아직 가까운 사람이 없다. 학교, 일터, 클럽, 이웃에서 사람을 만난다.'));
  const box=el('div','rels');rl.sort((a,b)=>(b.close+(b.hate||0)+b.riv)-(a.close+(a.hate||0)+a.riv)).forEach(r=>box.appendChild(relRow(r,true)));c.appendChild(box);
  const gone=(s.rel||[]).filter(r=>!r.alive);if(gone.length){c.appendChild(el('h3',null,'떠난 사람들'));const ul=el('ul','infl');gone.forEach(r=>ul.appendChild(el('li',null,`${r.n} — ${relBond(r)}${relEnd(r)?` · ${relEnd(r)}`:''}`)));c.appendChild(ul)}
  const f=cardIn(H,'파벌과의 관계','Les factions');const fs=activeFactions();if(!fs.length)f.appendChild(el('p','mut','아직 뚜렷한 파벌이 없다.'));
  const fl=el('ul','infl');fs.forEach(x=>fl.appendChild(el('li',null,`${x.n} — ${s.party===x.id?`소속 · ${PRANK[s.prank]} · `:''}${frelWord(frelOf(x.id))} ${frelOf(x.id)} · 성향 친밀도 ${affinity(x)}%`)));f.appendChild(fl)}
// 관계가 어떻게 끝났는가(사망·연락 두절)
function relEnd(r){const P=typeof perOf==='function'?perOf(r):null;if(r.alive)return '';if(P)return `${P.d}년 ${P.dc||'사망'}`;
  const f=r.fate&&r.fate.length?r.fate[r.fate.length-1]:null;const ft=f?(typeof f==='string'?f:(f.t||'')):'';if(r.dead)return `${r.dead}년 사망${ft?` — ${ft.slice(0,40)}`:''}`;if(r.lost)return '연락이 끊김';return ft.slice(0,50)}
function lifeEcon(c){const E=econ();const bu=el('ul','basket');basket().forEach(([n,v,u])=>{const li=el('li');li.innerHTML=`<span>${n}</span><b>${priceTxt(v,u)}</b>`;bu.appendChild(li)});c.appendChild(bu);
  c.appendChild(el('p','small',`재산 ${fmt(s.money)} ${money()}${s.land?` · 지대 ${fmt(s.land)}/년`:''}${s.dues?` · 영주 공납 ${fmt(s.dues)}/년`:''} · 물가 ×${E.price.toFixed(2)} · 화폐 가치 ${Math.round(E.cur*100)}%`));c.appendChild(el('p','mut small',curNote()))}
function eraCard(c){c.appendChild(el('p',null,`${ruler()} · ${s.year}년${repYear(s.year)?' · '+repYear(s.year):''}`));
  const hs=s.log.filter(e=>e.k==='hist').slice(-8).reverse();if(hs.length){c.appendChild(el('h3',null,'최근의 사건'));const ul=el('ul','infl');hs.forEach(e=>ul.appendChild(el('li',null,e.t)));c.appendChild(ul)}}
// 시작 화면: 이름·성별·신분·출생일, 주사위
let pre={};
function rollPre(){const sex=R()<.5?'M':'F';const PW={epee:.8,robe:1.4,hobereau:.3,bourgeois:16,artisan:81.5};const estate=wpick(Object.entries(PW));const nm=rollName(sex,estate,'paris');
  pre={sex,estate,given:nm.g[0],givenFr:nm.g[1],sur:nm.f[0],surFr:nm.f[1],year:ri(1750,1790),month:ri(1,12),day:ri(1,28)};fillPre()}
function fillPre(){$('#inGiven').value=pre.given;$('#inSur').value=pre.sur;$('#estName').textContent=ESTATES[pre.estate].n;$('#estFr').textContent=' · '+ESTATES[pre.estate].fr;
  document.querySelectorAll('.nf-sex button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.x===pre.sex)));$('#bY').value=pre.year;$('#bM').value=pre.month;fillDays();$('#bD').value=pre.day}
function fillDays(){const y=+$('#bY').value,m=+$('#bM').value;const n=new Date(y,m,0).getDate();const cur=+$('#bD').value||pre.day||1;$('#bD').innerHTML=Array.from({length:n},(_,i)=>`<option value="${i+1}">${i+1}일</option>`).join('');$('#bD').value=Math.min(cur,n)}
function bootStart(){$('#bY').innerHTML=Array.from({length:41},(_,i)=>`<option value="${1750+i}">${1750+i}년</option>`).join('');$('#bM').innerHTML=Array.from({length:12},(_,i)=>`<option value="${i+1}">${i+1}월</option>`).join('');
  $('#bY').onchange=fillDays;$('#bM').onchange=fillDays;$('#rollB').onclick=()=>rollPre();
  document.querySelectorAll('.nf-sex button').forEach(b=>b.onclick=()=>{if(pre.sex===b.dataset.x)return;pre.sex=b.dataset.x;const g=rollName(pre.sex,pre.estate,'paris').g;pre.given=g[0];pre.givenFr=g[1];fillPre()});
  $('#goB').onclick=()=>{const g=$('#inGiven').value.trim(),sr=$('#inSur').value.trim();start(true,{hard:true,sex:pre.sex,estate:pre.estate,year:+$('#bY').value,month:+$('#bM').value,day:+$('#bD').value,given:g||pre.given,givenFr:(!g||g===pre.given)?pre.givenFr:'',sur:sr||pre.sur,surFr:(!sr||sr===pre.sur)?pre.surFr:''})};
  document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>setTab(b.dataset.t));document.body.classList.add('covered');rollPre()}
bootStart();
