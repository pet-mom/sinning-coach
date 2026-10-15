/* ================= 기록 화면 ================= */
function logNode(e,prev){const d=el('div','le '+e.k);
  if(e.k==='yr'){d.textContent=e.t;return d}
  const showSe=!prev||prev.k==='yr'||prev.se!==e.se;d.appendChild(el('span','se',showSe?SEASON[e.se]:''));
  let txt=e.t,fxs=null;const m=txt.match(/^(.*?)\s?\(([^()]*(?:[+-]\s?[\d,]+)[^()]*)\)(\.?)$/);if(m&&e.k!=='sys'){txt=m[1]+m[3];fxs=m[2].split(', ')}
  const p=el('p',null,txt);
  if(e.d&&e.d.f){const c=el('span','chips');const ci=e.d.f.indexOf(e.d.v);e.d.f.forEach((f,i)=>c.appendChild(el('span','chip'+(i===ci?' on':''),String(f))));p.prepend(c)}
  if(fxs){const w=el('span','fxs');fxs.forEach(x=>{const lab=x.split(' ')[0];const neg=/\s-\s?\d/.test(x)||/ -[\d]/.test(x);const bad=BAD.has(lab)?!neg:neg;w.appendChild(el('span','fx '+(lab==='급진'||lab==='보수'?'':bad?'dn':'up'),x))});p.appendChild(w)}
  d.appendChild(p);return d}
function flushLog(){const box=$('#log');if(!box)return;const near=box.scrollHeight-box.scrollTop-box.clientHeight<160;let added=false;
  for(;shown<s.log.length;shown++){box.appendChild(logNode(s.log[shown],s.log[shown-1]));added=true}
  while(box.childElementCount>600)box.firstElementChild.remove();
  if(near)box.scrollTop=box.scrollHeight;else if(added)$('#toBottom').hidden=false}

/* ================= 사건 창 ================= */
function sheetOpen(t,fr){$('#shT').innerHTML='';$('#shT').append(t);if(fr){$('#shT').appendChild(el('span','fr',fr))}$('#shB').innerHTML='';$('#sheet').hidden=false;$('#sheet').classList.remove('min');$('#shRet').hidden=true;sheetLive=true}
function sheetClose(){$('#sheet').hidden=true;$('#sheet').classList.remove('min');$('#shRet').hidden=true;sheetLive=false}
function sheetMin(on){$('#sheet').classList.toggle('min',on);$('#shRet').hidden=!on;if(on){const b=$('#log');b.scrollTop=b.scrollHeight;$('#shRet').focus()}else{const f=$('#shB').querySelector('button:not(:disabled)');if(f)f.focus()}}
function shScroll(){const sh=$('.sh');sh.scrollTop=sh.scrollHeight}
function shText(t,c){$('#shB').appendChild(el('p',c||'',t));shScroll()}
let autoMode=false,pend=null;
function ad(){return Math.max(250,1300/Math.sqrt(speed))}
function arm(fn){pend=fn;if(autoMode)setTimeout(()=>{if(autoMode&&pend===fn)fn()},ad())}
const PREF={열정:{bold:2,radical:1.5},신중:{safe:2.5},경건:{pious:2.5,royal:.6},계몽:{study:1.6,radical:1.2},야심:{social:1.4,greedy:1,bold:.6},쾌활:{social:2,family:1}};
function autoPick(opts,btns){let best=-1e9,bi=0;opts.forEach((o,i)=>{if(btns[i].disabled)return;let sc=R()*.6;const tags=(o.a||'').split(' ');
  if(tags.includes('safe'))sc+=.5;if(tags.includes('work'))sc+=1.2;if(tags.includes('family'))sc+=.8;const P=PREF[s&&s.trait]||{};for(const t of tags)sc+=P[t]||0;
  if(s&&s.pol<-30&&tags.includes('royal'))sc+=1;if(s&&s.pol>40&&tags.includes('radical'))sc+=1;
  if(sc>best){best=sc;bi=i}});return bi}
function setAuto(on){autoMode=on;$('#autoB').setAttribute('aria-pressed',String(on));if(on&&pend)setTimeout(()=>{if(autoMode&&pend)pend()},ad())}
function shButtons(opts){return new Promise(res=>{const box=el('div','opts');
  opts.forEach((o,i)=>{const b=el('button','opt');b.type='button';b.appendChild(document.createTextNode(o.l));if(o.s)b.appendChild(el('small',null,o.s));if(o.dis)b.disabled=true;
    b.onclick=()=>{pend=null;box.querySelectorAll('button').forEach(x=>x.disabled=true);b.classList.add('chosen');res(i)};box.appendChild(b)});
  $('#shB').appendChild(box);shScroll();arm(()=>{const btns=[...box.querySelectorAll('button')];btns[autoPick(opts,btns)].click()});const f=box.querySelector('button:not(:disabled)');if(f)f.focus({preventScroll:true})})}
function shContinue(label='계속'){return new Promise(res=>{const b=el('button','btn primary cont',label);b.type='button';
  b.onclick=()=>{pend=null;b.remove();res()};$('#shB').appendChild(b);shScroll();b.focus({preventScroll:true});arm(()=>b.click())})}
async function done(){if(!sheetLive)return;await shContinue();sheetClose()}
const PIPS={1:[[50,50]],2:[[28,28],[72,72]],3:[[26,26],[50,50],[74,74]],4:[[28,28],[72,28],[28,72],[72,72]],5:[[26,26],[74,26],[50,50],[26,74],[74,74]],6:[[28,24],[72,24],[28,50],[72,50],[28,76],[72,76]]};
function dieSvg(v){return `<svg viewBox="0 0 100 100" aria-label="${v}">${(PIPS[v]||[]).map(([x,y])=>`<circle cx="${x}" cy="${y}" r="9" fill="currentColor"/>`).join('')}</svg>`}
function modText(m){return m===0?'주사위 한 개를 던진다':m>0?`주사위 ${m+1}개를 던져 가장 높은 눈을 쓴다`:`주사위 ${1-m}개를 던져 가장 낮은 눈을 쓴다`}
function shThrow(r,label,why){return new Promise(res=>{const box=el('div','dicebox');
  box.appendChild(el('p','dinfo',(label?label+'. ':'')+modText(r.m)+(why?` (${why})`:'')+'. 5 이상이면 대개 성공, 2 이하는 실패다.'));
  const row=el('div','dice');const dies=r.f.map(()=>{const d=el('div','die');d.innerHTML=dieSvg(0);row.appendChild(d);return d});box.appendChild(row);
  const btn=el('button','btn primary throw','주사위를 던진다');btn.type='button';box.appendChild(btn);$('#shB').appendChild(box);shScroll();btn.focus({preventScroll:true});arm(()=>btn.click());
  btn.onclick=()=>{pend=null;btn.remove();const settle=()=>{const ci=r.f.indexOf(r.v);dies.forEach((d,i)=>{d.innerHTML=dieSvg(r.f[i]);d.classList.add(i===ci?'on':'off')});box.appendChild(el('p','dres',`${r.v} · ${RES[r.v]}`));shScroll();res()};
    if(RM){settle();return}let t=0;const iv=setInterval(()=>{dies.forEach(d=>d.innerHTML=dieSvg(ri(1,6)));if((t+=70)>=630){clearInterval(iv);settle()}},70)}})}
function shDraw(p,hit,label,why){return new Promise(res=>{const box=el('div','dicebox');const pc=Math.round(p*1000)/10;
  box.appendChild(el('p','dinfo',`${label}. 역사적 확률 ${pc}%`+(why?` — ${why}`:'')));
  const tr=el('div','track');tr.style.height='14px';const fill=el('i');fill.style.width=pc+'%';fill.style.background='var(--rouge)';tr.appendChild(fill);const mk=el('b');mk.style.cssText='position:absolute;top:-3px;bottom:-3px;width:3px;background:var(--ink);left:0;display:none';tr.appendChild(mk);box.appendChild(tr);
  const btn=el('button','btn primary throw','운명을 뽑는다');btn.type='button';box.appendChild(btn);$('#shB').appendChild(box);shScroll();btn.focus({preventScroll:true});arm(()=>btn.click());
  btn.onclick=()=>{pend=null;btn.remove();const x=hit?R()*pc:pc+R()*(100-pc);mk.style.display='block';
    const fin=()=>{mk.style.left=`calc(${x}% - 1px)`;box.appendChild(el('p','dres',hit?`${label} — 피하지 못했다`:`${label} — 피했다`));shScroll();res()};
    if(RM){fin();return}let t=0;const iv=setInterval(()=>{mk.style.left=(R()*100)+'%';if((t+=70)>=630){clearInterval(iv);fin()}},70)}})}

/* ================= 화면 ================= */
function eraColor(){return `var(--${era().c})`}
function statusText(){if(child())return [s.age<7?'어린아이':'아이',s.literate?'글을 깨쳤다':''];
  const c={prison:'수감 중',hiding:s.flags.refractaire?'징집 기피자로 숨어 지냄':'은신 중',emigre:`망명 중 · ${s.emiPlace||''}`}[s.cond];if(c)return [c,job()?`전 ${pname(job())}`:''];
  const j=job();if(j)return [pname(j),`${j.fr} · ${TRACKS[j.tr]} · ${s.year-s.jobSince}년째`];
  return [s.flags.retired?'은퇴':noble()&&s.land?'지대로 사는 지주':'일 없음',s.prevJob?`전 ${pname(POST[s.prevJob])}`:''] }
function famText(){const a=[];if(s.spouse&&s.spouse.alive)a.push(isM()?'아내 있음':'남편 있음');else if(s.widowed)a.push(isM()?'홀아비':'과부');const k=kidsAlive().length;if(k)a.push(`자녀 ${k}`);return a.join(' · ')}
function render(){if(!s)return;document.documentElement.style.setProperty('--era',eraColor());
  const nm=$('#nm');nm.innerHTML='';nm.append(`${s.given[0]} ${s.sur[0]}`);if(s.given[1])nm.appendChild(el('span','frn',`${s.given[1]} ${s.sur[1]}`));
  $('#meta').textContent=`${REGIONS[loc()].n}${s.loc&&s.loc!==s.region?` (고향 ${REGIONS[s.region].n})`:''} · ${ESTATES[s.estate].n}${s.faithKind==='protestant'?' · 신교도':s.faithKind==='jewish'?' · 유대교':''}${s.trait?` · 성품 ${s.trait}`:''}${!child()?` · 방침 ${s.plan}`:''}`;
  const w=`${yl()} ${SEASON[s.season]}`;$('#age').textContent=s.age+'세';$('#when').textContent=w;$('#dwhen').textContent=w;$('#dage').textContent=s.age+'세';$('#druler').textContent=`${era().n} · ${ruler()}`;
  const [a,b]=statusText();$('#post').textContent=a;$('#postk').textContent=b;$('#fam').textContent=famText();
  const st=$('#stats');if(!st.children.length)STATS.forEach(([k,n])=>{const d=el('div','st');d.innerHTML=`${n}<b data-k="${k}"></b><s><u data-u="${k}"></u></s>`;st.appendChild(d)});
  STATS.forEach(([k])=>{st.querySelector(`[data-k="${k}"]`).textContent=s.st[k];st.querySelector(`[data-u="${k}"]`).style.width=s.st[k]+'%'});
  $('#sub').innerHTML=`<span>재산 <b>${fmt(s.money)}</b> ${money()}</span>${s.land?`<span>지대 <b>${fmt(s.land)}</b>/년</span>`:''}<span>명성 <b>${s.fame}</b></span><span>신앙 <b>${s.faith}</b></span><span class="${s.sus>=30?'warn':''}">혐의 <b>${s.sus}</b></span><span>성향 <b>${polLabel(s.pol)}</b></span><button class="helpb" type="button" id="helpB">설명</button>`;
  $('#helpB').onclick=()=>{if(isDesk()){deskTab='설명';refreshSide()}else showHelp()};
  renderBoard()}
function renderBoard(){const B=$('#dboard');if(!B||!s||!isDesk())return;B.innerHTML='';
  const h=el('div','db-h');h.innerHTML=`시대의 띠 <span>1750–1850</span>`;B.appendChild(h);
  const band=el('div','eras');ERAS.forEach(e=>{const a=Math.max(1750,e.a),b=Math.min(1850,e.b);if(b<=a)return;const i=el('i');i.style.width=((b-a)/100*100)+'%';i.style.background=`color-mix(in srgb,var(--${e.c}) 60%,var(--line))`;i.title=`${e.n} (${Math.floor(e.a)}–${Math.floor(e.b)})`;band.appendChild(i)});
  const mk=el('b');mk.style.left=((clamp(T(),1750,1850)-1750))+'%';band.appendChild(mk);B.appendChild(band);
  const erl=el('div','erl');['1750','1789','1799','1815','1830','1850'].forEach(x=>erl.appendChild(el('span',null,x)));B.appendChild(erl);
  const h2=el('div','db-h');h2.innerHTML=`출세의 사다리 <span>칠한 칸: 거쳐 간 자리</span>`;B.appendChild(h2);
  const lad=el('div','ladder');const held=new Set(s.hist.map(x=>x.id));
  for(const [tr,nm] of Object.entries(TRACKS)){const row=el('div','lrow');row.appendChild(el('em',null,nm));
    for(let t=1;t<=7;t++){const ps=PL.filter(x=>x[1]===tr&&x[2]===t).map(x=>POST[x[0]]);const c=el('span','lc');
      if(!ps.length)c.classList.add('none');else{const p=ps.find(p=>held.has(p.id))||ps[0];c.textContent=pname(p);c.title=ps.map(p=>`${pname(p)} (${p.fr})`).join(' / ');if(ps.some(p=>held.has(p.id)))c.classList.add('held');if(ps.some(p=>p.id===s.job))c.classList.add('cur')}
      row.appendChild(c)}lad.appendChild(row)}
  B.appendChild(lad)}
const DQ=matchMedia('(min-width: 1100px)');function isDesk(){return DQ.matches}
let deskTab='행동';
function refreshSide(){if(!s||!isDesk())return;document.querySelectorAll('#dtabs button').forEach(b=>b.setAttribute('aria-selected',String(b.dataset.t===deskTab)));if(deskTab==='행동')showActs();else if(deskTab==='이력')showPanel();else showHelp()}
function panelTarget(){const D=isDesk();const pin=D?$('#dsBody'):$('#pin');pin.innerHTML='';if(!D){$('#panel').hidden=false;setPaused(true,true)}return pin}
function closePanel(){$('#panel').hidden=true;if(resumeAfterPanel)setPaused(false);resumeAfterPanel=false}
let resumeAfterPanel=false;
function showActs(){if(!s)return;const pin=panelTarget();if(!isDesk())pin.appendChild(el('h2','disp','행동'));
  if(child()){pin.appendChild(el('p',null,'열네 살이 되면 한 해의 방침과 행동을 정할 수 있다.'));return}
  pin.appendChild(el('h3',null,'한 해의 방침'));pin.appendChild(el('p','meta','해가 바뀔 때 이 방침대로 지표가 자란다.'));
  const pg=el('div','plans');PLANS.forEach(p=>{const b=el('button','opt');b.type='button';b.appendChild(document.createTextNode(p.k));b.appendChild(el('small',null,p.s));b.setAttribute('aria-pressed',String(s.plan===p.k));
    if(p.k==='학업'&&!lit())b.disabled=true;if(p.k==='정치'&&s.year<1788)b.disabled=true;
    b.onclick=()=>{s.plan=p.k;save();pg.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render()};pg.appendChild(b)});pin.appendChild(pg);
  pin.appendChild(el('h3',null,'올해 할 일'));pin.appendChild(el('p','meta','각각 한 해에 한 번. 사건 창이 열려 있으면 끝난 뒤에 할 수 있다.'));
  const ac=el('div','acts');const list=ACTS.filter(a=>{try{return a.c()}catch(e){return false}});
  if(!list.length)ac.appendChild(el('p','meta',s.cond==='prison'?'감옥에서는 할 수 있는 일이 없다.':s.cond==='emigre'?'망명지에서는 기다릴 수밖에 없다.':'지금은 할 수 있는 일이 없다.'));
  list.forEach(a=>{const used=s.acts[a.k]===s.year,poor=a.cost&&s.money<a.cost;const b=el('button','opt');b.type='button';const sp=el('span');sp.appendChild(document.createTextNode(a.n));sp.appendChild(el('small',null,a.s));b.appendChild(sp);
    b.appendChild(el('em',null,used?'올해 함':sheetLive?'사건 뒤에':''));b.disabled=used||poor||sheetLive||busy;
    b.onclick=async()=>{if(busy||sheetLive)return;s.acts[a.k]=s.year;busy=true;freeze();try{if(a.inter){await a.inter();if(sheetLive)await done()}else a.f()}catch(e){console.error(e);sheetClose()}busy=false;render();save();if(s.dead){running=false;setTimeout(showEnd,900);return}if(isDesk())refreshSide();else showActs();schedule()};
    ac.appendChild(b)});pin.appendChild(ac);
  if(!isDesk()){const c=el('button','btn','닫기');c.type='button';c.style.marginTop='16px';c.onclick=closePanel;pin.appendChild(c)}}
function showPanel(){if(!s)return;const pin=panelTarget();pin.appendChild(el('h2','disp',`${s.given[0]} ${s.sur[0]}의 이력`));
  const dl=el('dl','kv');const add=(k,v)=>{dl.appendChild(el('dt',null,k));dl.appendChild(el('dd',null,v))};
  add('태어난 곳',`${REGIONS[s.region].n} (${REGIONS[s.region].fr}), 1750년`);add('신분',`${ESTATES[s.estate].n} — ${ESTATES[s.estate].fr}`);add('신앙',{catholic:'가톨릭',protestant:'신교(위그노·루터파)',jewish:'유대교'}[s.faithKind]);add('글',lit()?'읽고 쓴다':'문맹');
  if(s.trait)add('성품',s.trait);if(s.goal)add('평생의 뜻',`${s.goal}${s.goalDone?' (이룸)':''}`);
  add('부모',`아버지 ${s.fa.alive?'생존':'사망'}, 어머니 ${s.mo.alive?'생존':'사망'}, 형제 ${s.sibs}명`);
  add('배우자',s.spouse?`${s.spouse.n} (${ESTATES[s.spouse.estate].n}) ${s.spouse.alive?'':s.divorced?'— 이혼':'— 사별'}`:'없음');
  add('자녀',s.kids.length?s.kids.map(k=>`${k.n}(${k.sex==='M'?'남':'여'}, ${k.alive?s.year-k.y+'세':'사망'})`).join(', '):'없음');
  add('정치 성향',`${polLabel(s.pol)} (${s.pol>0?'+':''}${s.pol})`);pin.appendChild(dl);
  pin.appendChild(el('h3',null,'거쳐 간 일'));const ul=el('ul','hist');if(!s.hist.length)ul.appendChild(el('li',null,'아직 없다'));
  s.hist.forEach(h=>{const li=el('li',null,h.n);li.appendChild(el('small',null,`${h.y0}–${h.y1??'지금'} · ${h.age}세부터`));ul.appendChild(li)});pin.appendChild(ul);
  const ex=[];if(s.flags.bastille)ex.push('바스티유 공격');if(s.flags.marche)ex.push('베르사유 행진');if(s.flags.dix)ex.push('8월 10일 튈르리 공격');if(s.flags.club)ex.push('자코뱅 클럽');if(s.flags.regicide)ex.push('국왕 사형 투표');if(s.flags.refractory)ex.push('선서 거부');if(s.flags.juror)ex.push('헌법 선서');if(s.cnt.emigre)ex.push('망명');if(s.cnt.arrest)ex.push(`체포 ${s.cnt.arrest}회`);if(s.cnt.battle)ex.push(`전투 ${s.cnt.battle}회`);if(s.cnt.wound)ex.push(`부상 ${s.cnt.wound}회`);if(s.flags.legion)ex.push('레지옹 도뇌르');if(s.flags.title)ex.push('제국 작위');if(s.flags.bienNat)ex.push('국유재산 매입');
  if(ex.length){pin.appendChild(el('h3',null,'혁명의 발자취'));pin.appendChild(el('p',null,ex.join(' · ')))}
  if(!isDesk()){const c=el('button','btn','닫기');c.type='button';c.style.marginTop='16px';c.onclick=closePanel;pin.appendChild(c)}}
function showHelp(){const pin=panelTarget();pin.appendChild(el('h2','disp','설명'));const g=el('div','gloss');
  [['학식','글과 교양. 문맹이면 25를 넘지 못한다. 법조·교회·문필의 길과 선거에 쓰인다.'],['처세','사람을 다루는 솜씨. 승진, 항변, 혼담, 협상에 쓰인다.'],['건강','낮으면 병사 확률이 크게 오른다. 나이 쉰부터 해마다 줄어든다.'],['담력','위험한 선택의 판정에 쓰인다. 전투, 도주, 결투.'],
   ['재산',`리브르(1795년부터 프랑). 날품팔이 연 140, 변호사 1,800, 대귀족은 수만에 이른다. 1791~96년 아시냐 붕괴 때 현금 가치가 녹는다. 땅(지대)은 덜 잃는다.`],['명성','이름이 알려진 정도. 선거, 승진, 훈장에 쓰인다.'],['신앙','교회에 대한 마음. 성직의 조건이고, 비기독교화 시기엔 화를 부를 수 있다.'],
   ['혐의','공포정치(1793~94) 때 체포될 확률을 끌어올린다. 귀족 출신, 선서 거부, 왕당파 성향, 부유함, 반란 지역 거주도 체포 확률을 높인다. 해마다 조금씩 줄어든다.'],['성향','절대왕정파에서 급진 상퀼로트까지. 시대마다 위험한 쪽이 바뀐다. 1794년엔 왕당파가, 1795년 남부와 1816년엔 급진파가 위험하다.'],
   ['주사위','유리한 조건마다 주사위를 하나 더 던져 높은 눈을, 불리하면 낮은 눈을 쓴다(최대 3개).'],['역사적 확률','징집, 학살, 처형, 전사 같은 일은 당대 통계에서 뽑은 확률로 정해진다. 붉은 막대가 그 확률이다.']].forEach(([k,v])=>{const d=el('div');d.appendChild(el('b',null,k));d.appendChild(el('p',null,v));g.appendChild(d)});
  pin.appendChild(g);if(!isDesk()){const c=el('button','btn','닫기');c.type='button';c.style.marginTop='16px';c.onclick=closePanel;pin.appendChild(c)}}

/* ================= 진행 제어 ================= */
let running=false,paused=false,busy=false,speed=1,timer=null;
let frac=0,tStart=0,tDur=0,ticking=false;
function drawClock(dur){for(const f of [$('#clockFill'),$('#dclockFill')]){if(!f||!s)continue;f.style.transition='none';f.style.width=((s.season+frac)/4*100)+'%';
  if(dur){void f.offsetWidth;f.style.transition=`width ${dur}ms linear`;f.style.width=((s.season+1)/4*100)+'%'}}}
function freeze(){if(ticking){const e=performance.now()-tStart;frac=Math.min(.999,frac+(1-frac)*e/tDur);ticking=false}clearTimeout(timer);drawClock(0)}
function schedule(){clearTimeout(timer);if(!running||paused||busy||s.dead){drawClock(0);return}
  const dur=(1-frac)*msPer()/speed;tStart=performance.now();tDur=dur;ticking=true;drawClock(dur);
  timer=setTimeout(()=>{ticking=false;frac=0;drawClock(0);step()},dur)}
async function step(){if(!running||busy)return;busy=true;try{await advanceSeason()}catch(e){console.error(e);sheetClose()}
  busy=false;render();save();refreshSide();if(s.dead){running=false;setTimeout(showEnd,900);return}
  if(!child()&&!s.goal&&s.age>=20&&!sheetLive)await pickGoal();schedule()}
async function pickGoal(){busy=true;sheetOpen('평생의 뜻','vocation');shText('스무 살. 무엇을 이루며 살고 싶은가?','q');
  const i=await shButtons(GOALS.map(g=>({l:g.k,s:g.s,a:{부:'greedy',명예:'social',자유:'radical',신앙:'pious',장수:'safe',가문:'family',학문:'study',무공:'bold'}[g.k]})));s.goal=GOALS[i].k;say(`평생의 뜻을 ‘${s.goal}’에 두었다.`);await shContinue();sheetClose();busy=false;render();save()}
const PLAY='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>',PAUSE='<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="2" width="3.4" height="12" rx="1" fill="currentColor"/><rect x="9.6" y="2" width="3.4" height="12" rx="1" fill="currentColor"/></svg>';
function setPaused(p,fromPanel){if(fromPanel&&p&&!paused)resumeAfterPanel=true;paused=p;$('#pp').innerHTML=p?PLAY:PAUSE;$('#pp').setAttribute('aria-label',p?'재생':'일시정지');if(p)freeze();else schedule()}
function setSpeed(v){speed=v;document.querySelectorAll('#spd button').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.s===v)));if(running&&!paused&&!busy){freeze();schedule()}try{localStorage.setItem(KEY+'_spd',v)}catch(e){}}

/* ================= 저장 ================= */
function save(){try{if(s&&!s.dead)localStorage.setItem(KEY,JSON.stringify(s));else localStorage.removeItem(KEY)}catch(e){}}
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||'null');return x&&x.v===1?x:null}catch(e){return null}}
function loadLives(){try{return JSON.parse(localStorage.getItem(LKEY)||'[]')}catch(e){return []}}
function recordLife(out,ep){try{const l=loadLives();l.unshift({n:`${s.given[0]} ${s.sur[0]}`,ep,y:`1750–${s.year}`,age:s.age,txt:out.slice(0,2).join(' ')});localStorage.setItem(LKEY,JSON.stringify(l.slice(0,30)))}catch(e){}}

/* ================= 시작 ================= */
function start(fresh,o){$('#title').hidden=true;$('#end').hidden=true;$('#log').innerHTML='';shown=0;sheetClose();
  if(fresh){s=newState(o);birth()}else{flushLog()}
  render();refreshSide();running=true;busy=false;frac=0;setPaused(false);save()}
function showNameForm(){const f=$('#nameForm');f.hidden=false;
  const est=$('#inEst');est.innerHTML='<option value="">무작위 (역사 비율)</option>'+Object.entries(ESTATES).map(([k,v])=>`<option value="${k}">${v.n} (${v.w}%)</option>`).join('');
  const reg=$('#inReg');reg.innerHTML='<option value="">무작위</option>'+Object.entries(REGIONS).map(([k,v])=>`<option value="${k}">${v.n}</option>`).join('');
  const rg=()=>{const sx=$('#inSex').value==='F'?'F':'M';$('#inGiven').value=pick(sx==='M'?M_NAMES:F_NAMES)[0]};const rs=()=>{const e=$('#inEst').value;$('#inSur').value=(e&&ESTATES[e].noble?pick(NOBLE_SURS):pick(SURS))[0]};
  $('#rGiven').onclick=rg;$('#rSur').onclick=rs;$('#inSex').onchange=()=>{$('#inGiven').value=''};$('#inEst').onchange=()=>{$('#inSur').value=''};
  $('#goB').onclick=()=>{const sex=$('#inSex').value==='R'?(R()<.5?'M':'F'):$('#inSex').value;start(true,{sex,estate:$('#inEst').value||null,region:$('#inReg').value||null,given:$('#inGiven').value.trim()||null,sur:$('#inSur').value.trim()||null,hard:$('#inHard').checked})};
  f.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}

/* ================= 부고 ================= */
function epithet(){const d=s.death||{},c=d.cause;
  if(s.age<5)return '세례 명부의 짧은 이름';
  if(c==='guillotine')return deputy()||s.flags.wasDeputy?'국민공회의 희생자':noble()?'단두대에 오른 귀족':'단두대의 이슬';
  if(c==='massacre')return loc()==='vendee'?'방데의 순교자':'9월의 희생자';
  if(c==='cold')return '러시아 설원의 병사';
  if(c==='battle'&&(s.best.army||0)>=6)return '전장에 쓰러진 장군';if(c==='battle')return `${d.detail||'전장'}의 전사자`;
  if(c==='deported')return '기아나의 유형수';if(c==='drowned')return '강물에 잠긴 이';
  if((s.best.army||0)>=7)return '제국의 원수';if((s.best.army||0)>=6)return T()<1804?'공화국의 장군':'제국의 장군';
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
  out.push(`${d.year}년 ${d.season}, ${ttl?ttl+' ':''}${jo(nm,'이','가')} ${s.age}세로 숨을 거두었다. 사인은 ${d.cause==='ill'?d.detail:CAUSE[d.cause]}.`);
  out.push(`1750년 ${REGIONS[s.region].n}의 ${ESTATES[s.estate].n} 집안에서 ${isM()?'아들':'딸'}로 태어났다.${s.faithKind==='protestant'?' 위그노였다.':s.faithKind==='jewish'?' 유대인이었다.':''}${lit()||s.age<8?'':' 평생 글을 몰랐다.'}`);
  if(s.age<14){out.push(s.age<2?'세례를 받은 것이 생의 거의 전부였다. 그 시절 프랑스 아이 넷 중 하나가 그렇게 갔다.':'어른이 되기 전에 세상을 떠났다.');return out}
  if(s.hist.length){const seq=s.hist.map(h=>h.n);out.push(`${[...new Set(seq)].join(', ')}${bat(seq[seq.length-1])?'을':'를'} 거쳤다.`)}
  const ex=[];if(s.flags.bastille)ex.push('1789년 7월 14일 바스티유를 공격했다');if(s.flags.marche)ex.push('빵을 달라며 베르사유까지 행진했다');if(s.flags.constituent)ex.push('삼부회 대표로 뽑혀 테니스코트의 방에 있었다');else if(s.flags.wasDeputy)ex.push('국민의 대표로 의사당에 앉았다');
  if(s.flags.regicide)ex.push('왕의 사형에 표를 던졌다');if(s.flags.refractory)ex.push('헌법 선서를 거부했다');if(s.flags.juror)ex.push('헌법에 선서했다');if(s.flags.club)ex.push('자코뱅 클럽에 드나들었다');if(s.flags.vendeen)ex.push('방데의 왕당군에 들었다');
  if(s.cnt.emigre)ex.push(`${s.emiPlace||'국외'}로 망명했다`);if(s.cnt.arrest)ex.push(`${s.cnt.arrest}번 체포되었다`);if(s.flags.russia===false&&s.flags.pow)ex.push('러시아에서 포로가 되었다');if(s.cnt.battle)ex.push(`${s.cnt.battle}번의 전투에 나섰다`);
  if(ex.length)out.push(ex.join(', ')+'.');
  const hon=[];if(s.flags.legion)hon.push('레지옹 도뇌르를 받았다');if(s.flags.title)hon.push('제국 작위를 받았다');if(s.flags.book)hon.push('책을 남겼다');if(hon.length)out.push(hon.join(', ')+'.');
  const k=s.kids.length,ka=adultKids();out.push(s.spouse?`${jo(s.spouse.n,'과','와')} 혼인하여 자녀 ${k}명을 두었고, 그 가운데 ${ka}명이 어른이 되었다.`:'혼인하지 않았다.');
  out.push(`남긴 재산은 ${fmt(s.money)} ${money()}${s.land?`, 해마다 ${fmt(s.land)}의 지대가 나오는 땅`:''}.`);
  return out}
function showEnd(){const out=obituary(),ep=epithet();recordLife(out,ep);try{localStorage.removeItem(KEY)}catch(e){}
  const card=$('#card');card.innerHTML='';document.documentElement.style.setProperty('--era',eraColor());
  card.appendChild(el('div','meta','부고 — nécrologie'));card.appendChild(el('div','ep disp',ep));
  card.appendChild(el('div','who',`${s.given[0]} ${s.sur[0]}${s.given[1]?` (${s.given[1]} ${s.sur[1]})`:''} · 1750–${s.year} · 향년 ${s.age}세${s.goal?` · 평생의 뜻 ${s.goal} (${s.goalDone?'이룸':'못 이룸'})`:''}`));
  out.forEach(t=>card.appendChild(el('p',null,t)));
  const sa={guillotine:'“시민들이여, 나는 공화국의 적이 아니었다.”',battle:'“앞으로!” 그것이 마지막 말이었다.',cold:'눈은 모든 것을 덮었다.',childbirth:'아이는 살았다.'}[s.death.cause]||(s.age>=75?'혁명과 제국과 왕정복고를 모두 겪은 사람이었다.':'');
  if(sa)card.appendChild(el('p','sa',sa));
  const eg=$('#endlog');eg.innerHTML='';eg.appendChild(el('h3','disp','평생의 기록'));s.log.forEach((e,i)=>eg.appendChild(logNode(e,s.log[i-1])));
  $('#end').hidden=false;$('#end').scrollTop=0;$('#copyB').textContent='부고 복사';
  $('#copyB').onclick=async()=>{const txt=`【${ep}】\n${out.join('\n')}\n\n— 1789 한 시민의 일생`;try{await navigator.clipboard.writeText(txt);$('#copyB').textContent='복사됨'}catch(e){const ta=el('textarea');ta.value=txt;ta.style.width='100%';ta.rows=8;card.appendChild(ta);ta.select();$('#copyB').textContent='아래 글을 선택해 복사하세요'}}}
function showLives(){const pin=$('#pin');pin.innerHTML='';$('#panel').hidden=false;if(running)setPaused(true,true);pin.appendChild(el('h2','disp','지난 인생'));
  const l=loadLives();if(!l.length)pin.appendChild(el('p','meta','아직 기록이 없다.'));const ul=el('ul','lives');
  l.forEach(x=>{const li=el('li');li.appendChild(el('b',null,`${x.ep}`));li.appendChild(document.createTextNode(` — ${x.n}, ${x.y}, ${x.age}세`));li.appendChild(el('p',null,x.txt));ul.appendChild(li)});pin.appendChild(ul)}

/* ================= 연결 ================= */
function boot(){
  try{const v=+localStorage.getItem(KEY+'_spd');if([1,4,8,12,16].includes(v))speed=v}catch(e){}setSpeed(speed);
  const saved=load();if(saved){$('#contB').hidden=false;$('#contB').onclick=()=>{s=saved;start(false)}}
  if(loadLives().length){$('#livesB').hidden=false}
  $('#newB').onclick=showNameForm;$('#livesB').onclick=showLives;$('#livesB2').onclick=showLives;$('#dLives').onclick=showLives;
  $('#againB').onclick=()=>{$('#end').hidden=true;$('#title').hidden=false;s=null;$('#contB').hidden=true;$('#livesB').hidden=false;showNameForm()};
  $('#pClose').onclick=closePanel;
  $('#pp').onclick=()=>{if(running)setPaused(!paused)};$('#autoB').onclick=()=>setAuto(!autoMode);
  document.querySelectorAll('#spd button').forEach(b=>b.onclick=()=>setSpeed(+b.dataset.s));
  $('#ab').onclick=showActs;$('#hb').onclick=showPanel;
  document.querySelectorAll('#dtabs button').forEach(b=>b.onclick=()=>{deskTab=b.dataset.t;refreshSide()});
  $('#shMin').onclick=()=>sheetMin(true);$('#shRet').onclick=()=>sheetMin(false);
  $('#toBottom').onclick=()=>{const b=$('#log');b.scrollTop=b.scrollHeight;$('#toBottom').hidden=true};
  $('#log').addEventListener('scroll',()=>{const b=$('#log');if(b.scrollHeight-b.scrollTop-b.clientHeight<60)$('#toBottom').hidden=true});
  DQ.addEventListener('change',()=>{render();refreshSide()});
  $('#pp').innerHTML=PAUSE;
}
boot();
