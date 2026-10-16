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
  $('#subline').textContent=`${ym()} · ${nm} · 1년 ≈ ${secPerYear()}초`;
  $('#where').innerHTML='';$('#where').append(s.cond==='emigre'?`${s.emiPlace||'국외'} (망명) · ${homeLabel().replace(/ · .*/,'')} · ${companions()}`:`${REGIONS[loc()].n}, 프랑스 · ${homeLabel()} · ${companions()}`);
  $('#famAges').textContent=familyAges();
  $('#era').textContent=era().n===ruler()?era().n:`${era().n} · ${ruler()}`;
  drawScene($('#cv'));
  const st=$('#stats');if(!st.children.length)STATORD.forEach(([k,n,ab])=>{const d=el('div','st');d.innerHTML=`<span>${n} <i>${ab}</i></span><b data-k="${k}"></b><s><u data-u="${k}" style="background:${STATC[k]}"></u></s>`;st.appendChild(d)});
  STATORD.forEach(([k])=>{st.querySelector(`[data-k="${k}"]`).textContent=s.st[k];st.querySelector(`[data-u="${k}"]`).style.width=s.st[k]+'%'});
  $('#sub2').innerHTML=`<span>재산 <b>${fmt(s.money)}</b> ${money()}</span>${s.land?`<span>지대 <b>${fmt(s.land)}</b>/년</span>`:''}<span class="${s.sus>=30?'warn':''}">혐의 <b>${s.sus}</b></span>`;
  renderChar();renderPolCard();renderRel();renderEcon();drawProg(0)}
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
  const h=el('div','ch');h.innerHTML=`<h2>정치 성향 <span class="mut small">${S.n}</span></h2><span class="score" style="color:${s.pol<=-25?'var(--roy)':s.pol>=35?'var(--rad)':'var(--fg)'}">속마음 ${s.pol>0?'+':''}${s.pol} · ${polLabel(s.pol)}</span>`;C.appendChild(h);
  const sp=el('div','spec');const prev=(s.polHist&&s.polHist.length)?s.polHist[s.polHist.length-1][1]:s.pol;
  sp.innerHTML=`<div class="bar"><i class="ghost" style="left:${polPos(prev)}%"></i>${pp!==s.pol?`<i class="pub" style="left:${polPos(pp)}%" title="공개 입장"></i>`:''}<i class="mk" style="left:${polPos(s.pol)}%" title="속마음"></i></div><div class="lbl">${specLabels().map(x=>`<span>${x}</span>`).join('')}</div>`;C.appendChild(sp);
  if(pp!==s.pol)C.appendChild(el('p','small mut',`공개 입장 ${pp>0?'+':''}${pp} · ${polLabel(pp)} — 사람들은 그대를 이렇게 안다.`));
  const sk=el('div','sk');sk.innerHTML=`<span class="mut">성향의 변화</span>${polSpark(220,30)}`;C.appendChild(sk);
  const cw=el('div','fopts cond');CONDUCT.forEach(c=>{const b=el('button','fopt');b.type='button';b.textContent=c.n;b.title=c.s;b.setAttribute('aria-pressed',String(conduct()===c.k));b.disabled=child()||s.age<16||s.acts.conduct===s.year;b.onclick=()=>{setConduct(c.k);render();save()};cw.appendChild(b)});
  const cl=el('div','mut small');cl.textContent='처신';C.appendChild(cl);C.appendChild(cw);
  const fs=activeFactions();if(fs.length){const row=el('div','facs');fs.slice().sort((a,b)=>a.pol-b.pol).forEach(f=>row.appendChild(facCard(f)));C.appendChild(row)}
  const ai=activeIssues();if(ai.length){const ch=el('div','chips');ai.forEach(iss=>{const v=s.stance[iss.id];ch.appendChild(el('span','chip'+(v!=null?' on':''),`${iss.n} · ${v!=null?iss.opts[v][0]:'미정'}`))});C.appendChild(ch)}
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
function showActs(){if(!s)return;const pin=openPanel('행동');
  if(child()){pin.appendChild(el('p','mut','열네 살이 되면 할 수 있는 일이 생깁니다.'));return}
  pin.appendChild(planBox());
  pin.appendChild(el('p','mut','행동은 각각 한 해에 한 번. 시간이 멈춘 동안 고를 수 있습니다.'));
  const list=ACTS.filter(a=>{try{return !a.hide&&a.c()}catch(e){return false}});const box=el('div','acts');
  if(list.length){ACT_GROUPS.forEach(([g,gn])=>{const sub=list.filter(a=>(a.g||actGroup(a))===g);if(!sub.length)return;box.appendChild(el('h3','ag',gn));actButtons(sub,box)});pin.appendChild(box);return}
  if(!list.length)box.appendChild(el('p','mut',s.cond==='prison'?'감옥에서는 할 수 있는 일이 없다.':s.cond==='emigre'?'망명지에서는 기다릴 수밖에 없다.':'지금은 할 수 있는 일이 없다.'));
  actButtons(list,box);pin.appendChild(box)}
function showPolitics(){if(!s)return;const pin=openPanel('정치');
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
function showHist(){if(!s)return;const pin=openPanel('이력');
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
function setSpeed(v){speed=v;document.querySelectorAll('#spd button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===v)));if(s)$('#subline').textContent=`${ym()} · ${s.given[0]} ${s.sur[0]} · 1년 ≈ ${secPerYear()}초`;if(running&&!paused&&!busy){freeze();schedule()}try{localStorage.setItem(KEY+'_spd',v)}catch(e){}}

/* ================= 저장 ================= */
function save(){try{if(s&&!s.dead)localStorage.setItem(KEY,JSON.stringify(s));else localStorage.removeItem(KEY)}catch(e){}}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&x.v===2?attrsMigrate(x):null}catch(e){return null}}
function loadLives(){try{return JSON.parse(localStorage.getItem(LKEY)||'[]')}catch(e){return []}}
function recordLife(out,ep){try{const l=loadLives();l.unshift({n:`${s.given[0]} ${s.sur[0]}`,ep,y:`${s.by}–${s.year}`,age:s.age,txt:out.slice(0,2).join(' ')});localStorage.setItem(LKEY,JSON.stringify(l.slice(0,30)))}catch(e){}}

/* ================= 시작 ================= */
function start(fresh,o){$('#title').hidden=true;$('#end').hidden=true;sheetClose();
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
function showEnd(){const out=obituary(),ep=epithet();recordLife(out,ep);try{localStorage.removeItem(KEY)}catch(e){}
  const card=$('#card');card.innerHTML='';
  card.appendChild(el('div','mut','부고 — nécrologie'));card.appendChild(el('div','ep',ep));
  card.appendChild(el('div','who',`${s.given[0]} ${s.sur[0]} · ${s.by}–${s.year} · 향년 ${s.age}세${s.goal?` · 평생의 뜻 ${s.goal} (${s.goalDone?'이룸':'못 이룸'})`:''}`));
  out.forEach(t=>card.appendChild(el('p',null,t)));
  if((s.polHist||[]).length>1){const w=el('div','sk');w.innerHTML=`<span class="mut">평생의 정치 성향</span>${polSpark(300,40)}`;card.appendChild(w)}
  const eg=$('#endlog');eg.innerHTML='';eg.appendChild(el('h2',null,'평생의 기록'));s.log.slice().reverse().forEach(e=>eg.appendChild(entryNode(e)));
  $('#end').hidden=false;$('#end').scrollTop=0;$('#copyB').textContent='부고 복사';
  $('#copyB').onclick=async()=>{const txt=`【${ep}】\n${out.join('\n')}\n\n— 1789 한 시민의 일생`;try{await navigator.clipboard.writeText(txt);$('#copyB').textContent='복사됨'}catch(e){const ta=el('textarea');ta.value=txt;ta.style.width='100%';ta.rows=8;card.appendChild(ta);ta.select();$('#copyB').textContent='아래 글을 선택해 복사하세요'}}}

/* ================= 연결 ================= */
function boot(){logBox=$('#log');$('#logMore').onclick=()=>{logLimit+=LOG_STEP;foldLog()};$('#logLess').onclick=()=>{logLimit=LOG_STEP;foldLog();$('.logc').scrollIntoView({block:'start',behavior:RM?'auto':'smooth'})};
  try{const v=+localStorage.getItem(KEY+'_spd');if([1,2,4,8,12,16].includes(v))speed=v}catch(e){}setSpeed(speed);
  const saved=load();if(saved){$('#contB').hidden=false;$('#contB').onclick=()=>{s=saved;start(false)}}
  if(loadLives().length)$('#livesB').hidden=false;
  $('#newB').onclick=showNameForm;$('#livesB').onclick=showLives;$('#livesB2').onclick=showLives;
  $('#againB').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;s=null;$('#contB').hidden=true;$('#livesB').hidden=false;showNameForm()};
  $('#pClose').onclick=closePanel;
  $('#pp').onclick=()=>{if(running)setPaused(!paused)};
  document.querySelectorAll('#spd button').forEach(b=>b.onclick=()=>setSpeed(+b.dataset.s));
  $('#nextB').onclick=()=>{if(!running||busy||sheetLive)return;clearTimeout(timer);ticking=false;frac=0;step()};
  $('#moreB').onclick=e=>{e.stopPropagation();$('#menu').hidden=!$('#menu').hidden};document.addEventListener('click',()=>{$('#menu').hidden=true});
  $('#mHist').onclick=showHist;$('#mHelp').onclick=showHelp;$('#mLives').onclick=showLives;$('#mSrc').onclick=showSources;$('#mPol').onclick=showPolitics;$('#mInfo').onclick=showInfo;
  try{if(localStorage.getItem(KEY+'_data')==='1')document.body.classList.add('showdata')}catch(e){}$('#dataT').setAttribute('aria-pressed',String(document.body.classList.contains('showdata')));
  $('#dataT').onclick=()=>{const on=document.body.classList.toggle('showdata');$('#dataT').setAttribute('aria-pressed',String(on));$('#dataT').textContent=on?'자료 가리기':'자료 보기';try{localStorage.setItem(KEY+'_data',on?'1':'0')}catch(e){}};$('#autoT').onclick=()=>setAuto(!autoMode);
  $('#mNew').onclick=()=>{if(!s)return;running=false;freeze();save();$('#title').hidden=false;$('#contB').hidden=!load();showNameForm()};
  $('#actB').onclick=showActs;$('#hint').onclick=()=>{$('#hint').hidden=true};
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
function renderChar(){const C=$('#charCard');if(!C)return;C.innerHTML='';
  const inf=influence();const h=el('div','ch');h.innerHTML=`<h2>인물</h2><span class="mut">신앙 · 명성 · 평판 · 영향력 · 의지</span>`;C.appendChild(h);
  C.appendChild(faithBox(true));
  const g=el('div','cgrid');
  g.innerHTML=`<div><span class="lab">명성</span><b>${s.fame}</b>${bar(s.fame,0,100,'var(--yellow)')}<small>${s.fame>=60?'나라 안에 이름이 났다':s.fame>=30?'고장에서 알려진 인물':s.fame>=10?'아는 사람만 안다':'이름 없는 사람'}</small></div>`+
   `<div><span class="lab">영향력</span><b>${inf.v}</b>${bar(inf.v,0,100,'var(--pink)')}<small>${inf.b.filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]).join(' · ')||'없음'}${inf.b.some(x=>x[1]<0)?` · 불리: ${inf.b.filter(x=>x[1]<0).map(x=>x[0]).join(', ')}`:''}</small></div>`+
   `<div><span class="lab">의지</span><b>${s.st.cour}</b>${bar(s.st.cour,0,100,'var(--rad)')}<small>중히 여기는 가치: ${topValues().join(', ')}</small></div>`;
  C.appendChild(g);
  const rl=el('div','mut small');rl.textContent='평판';C.appendChild(rl);
  const rp=el('div','chips reps');REPG.forEach(([k,n])=>{const v=s.rep[k];const w=repWord(k);rp.appendChild(el('span','chip'+(v>=65?' on':'')+(v<=35?' bad':''),`${n} ${v}${w&&w!=='—'?' · '+w:''}`))});C.appendChild(rp);
  const sl=el('div','skl');skillGroups(4).forEach(([base,gn,ks,src])=>{if(!ks.length)return;const p=el('p','small');p.innerHTML=`<span class="mut">${gn}</span> ${ks.slice(0,4).map(k=>`${FXN[k]} <b>${src[k]}</b>`).join(' · ')}`;sl.appendChild(p)});
  if(!sl.children.length)sl.appendChild(el('p','mut small','아직 익힌 분야가 없다.'));C.appendChild(sl);
  const b=el('button','pill','자세히 ›');b.type='button';b.onclick=()=>showInfo();C.appendChild(b)}
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
function renderEcon(){const C=$('#econCard');if(!C)return;C.innerHTML='';const E=econ(),P=s.econPrev&&s.econPrev.a===E.a?s.econPrev:null;
  const h=el('div','ch');h.innerHTML=`<h2>그 시절의 경제</h2><span class="mut">${REGIONS[loc()].n} · ${AREAN[E.a]} · ${s.year}년</span>`;C.appendChild(h);
  const arrow=(k,good)=>{if(!P)return '';const d=E[k]-P[k];if(Math.abs(d)<.03)return '<i class="eq">→</i>';const up=d>0;return `<i class="${up===good?'gd':'bd'}">${up?'▲':'▼'}</i>`};
  const g=el('div','egrid two');g.innerHTML=`<div><span class="lab">물가</span><b>×${E.price.toFixed(2)}${arrow('price',false)}</b><small>평년 대비 · ${econWord('price',E.price)}</small></div><div><span class="lab">화폐 가치</span><b>${Math.round(E.cur*100)}%${arrow('cur',true)}</b><small>${econWord('cur',E.cur)}</small></div>`;C.appendChild(g);
  const ul=el('ul','basket');basket().forEach(([n,v,u])=>{const li=el('li');li.innerHTML=`<span>${n}</span><b>${priceTxt(v,u)}</b>`;ul.appendChild(li)});C.appendChild(ul);
  C.appendChild(el('p','mut small',curNote()))}
function showInfo(){if(!s)return;const pin=openPanel('인물');
  pin.appendChild(el('h3',null,'핵심 능력치'));const t=el('div','cgrid');t.innerHTML=STATS.map(([k,n,ab])=>`<div><span class="lab">${n} <i>${ab}</i></span><b>${s.st[k]}</b>${bar(s.st[k],0,100,STATC[k])}</div>`).join('');pin.appendChild(t);
  if(s.ill)pin.appendChild(el('p','warn',`지금 앓는 병: ${illName()}`));
  skillGroups(-1).forEach(([base,gn,ks,src])=>{pin.appendChild(el('h3',null,`${gn} (${FXN[base]})`));const g=el('div','cgrid');g.innerHTML=ks.map(k=>`<div><span class="lab">${FXN[k]}</span><b>${src[k]||0}</b>${bar(src[k]||0)}</div>`).join('');pin.appendChild(g)});
  pin.appendChild(el('h3',null,'재산과 혐의'));pin.appendChild(el('p',null,`재산 ${fmt(s.money)} ${money()}${s.land?` · 지대 ${fmt(s.land)}/년`:''}${s.dues?` · 영주 공납 ${fmt(s.dues)}/년`:''} · 혐의 ${s.sus}`));
  pin.appendChild(el('h3',null,'신앙'));pin.appendChild(faithBox(false));
  pin.appendChild(el('h3',null,'명성'));pin.appendChild(el('p',null,`명성 ${s.fame}`));
  pin.appendChild(el('h3',null,'평판'));const rp=el('div','cgrid');rp.innerHTML=REPG.map(([k,n])=>`<div><span class="lab">${n}</span><b>${s.rep[k]}</b>${bar(s.rep[k],0,100,s.rep[k]<=35?'var(--red)':'var(--green)')}<small>${repWord(k)}</small></div>`).join('');pin.appendChild(rp);
  const inf=influence();pin.appendChild(el('h3',null,`정치적 영향력 ${inf.v}`));const ul=el('ul','infl');(inf.b.length?inf.b:[['아직 아무 영향력이 없다',0]]).forEach(([n,v])=>ul.appendChild(el('li',null,`${n} ${v>0?'+':''}${v||''}`)));pin.appendChild(ul);
  pin.appendChild(el('h3',null,'가치와 의지'));const vv=el('div','cgrid');vv.innerHTML=VALUES.map(([k,n])=>`<div><span class="lab">${n}</span><b>${s.val[k]}</b>${bar(s.val[k],0,100,'var(--teal)')}</div>`).join('')+`<div><span class="lab">의지</span><b>${s.st.cour}</b>${bar(s.st.cour,0,100,'var(--rad)')}</div>`;pin.appendChild(vv);
  pin.appendChild(el('h3',null,'사람들'));const rl=relsAlive();if(!rl.length)pin.appendChild(el('p','mut','아직 가까운 사람이 없다.'));const box=el('div','rels');rl.forEach(r=>box.appendChild(relRow(r,true)));pin.appendChild(box);
  const gone=(s.rel||[]).filter(r=>!r.alive);if(gone.length)pin.appendChild(el('p','mut small',`떠난 사람들: ${gone.map(r=>`${r.n}${r.dead?` (${r.dead}년 사망)`:''}`).join(', ')}`));
  pin.appendChild(el('h3',null,'파벌과의 관계'));const fs=activeFactions();if(!fs.length)pin.appendChild(el('p','mut','아직 뚜렷한 파벌이 없다.'));
  const fl=el('ul','infl');fs.forEach(f=>fl.appendChild(el('li',null,`${f.n} — ${s.party===f.id?`소속 · ${PRANK[s.prank]} · `:''}${frelWord(frelOf(f.id))} ${frelOf(f.id)} · 성향 친밀도 ${affinity(f)}%`)));pin.appendChild(fl)}
