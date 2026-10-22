/* ================= 책 한 쪽: 시간이 흐르는 대신 쪽을 넘긴다 =================
   - 자동으로 흐르던 시간(타이머·배속·진행 막대)을 없앤다. 쪽 모서리를 넘기면 한 해를 살고, 그해의 이야기가 새 쪽에 적힌다.
   - 그해 안에 결정할 일이 생기면 사건 창이 뜨고, 고르고 나면 다시 넘어간다.
   - 아래 알약: 쪽 번호(누르면 목차) · 메뉴. 아래 탭 막대는 예전 그대로(프로필 · 관계 · 일상 · 생활 · 시대). */
let pgView=-1,pgBusy=false;
// -1: 가장 최근 쪽, -2: 서장

// 타이머로 흐르지 않게 한다
schedule=function(){clearTimeout(timer);ticking=false};
async function liveYear(){if(!s||s.dead||pgBusy||busy)return;pgBusy=true;document.body.classList.add('living');const y=s.year;let g=0;
  try{while(s&&!s.dead&&s.year===y&&g++<40){await step();if(!running)break}}catch(e){console.error(e)}
  pgBusy=false;document.body.classList.remove('living');s.pgSeen=s.log.length;pgView=-1;renderStory(true)}
function pgPrologue(){const rows=s.log.filter(e=>['big','ev'].includes(e.k)).slice(0,3).map(e=>stClean(e.t));
  const fam=[];if(s.fa&&s.fa.alive)fam.push(`아버지는 ${s.fa.age}세`);if(s.mo&&s.mo.alive)fam.push(`어머니는 ${s.mo.age}세`);
  const sib=(typeof stSibs==='function'?stSibs():[]).filter(x=>x.by<=s.year);
  return rows.join(' ')+(fam.length?` ${fam.join(', ')}였다.`:'')+(sib.length?` 집에는 ${jo(sib.map(x=>`${stTerm(x)} ${x.n}`).join(', '),'이','가')} 있었다.`:' 당신은 그 집의 첫아이였다.')+' 당신의 이야기는 여기서 시작된다.'}
// 쪽 목록: 서장 · 지난 해들 · (있으면) 올해 쓰이는 중
function pgPages(){const L0=s.story||[];const P=[{k:'pro'}].concat(L0.map(c=>({k:'ch',c})));let d=null;try{if(pgBusy||s.log.length>(s.pgSeen||0))d=ssDraft()}catch(e){}if(d)P.push({k:'dr',d});return P}
const pgCur=P=>pgView<0||pgView>=P.length?P.length-1:pgView;
renderStory=function(force){const Pg=$('#page');if(!Pg||!s)return;const P=pgPages();const i=pgCur(P),pg=P[i];
  let yr,ag,ti,paras;
  if(pg.k==='pro'){yr=s.by;ag='태어난 해';ti='서장';paras=[pgPrologue()]}
  else if(pg.k==='ch'){const c=pg.c;yr=c.y;ag=`${c.a}세`;ti=c.t;paras=c.p&&c.p.length?c.p:[c.x]}
  else{yr=s.year;ag=`${s.age}세`;ti='올해 · 쓰이는 중';paras=pg.d}
  // 예전의 긴 쪽은 500자 안팎으로 줄여 보여 준다
  if(pg.k==='ch'&&paras.join(' ').length>700){try{paras=slExpand(pg.c)}catch(e){}}
  $('#pgYear').textContent=yr;$('#pgAge').textContent=ag;$('#pgTitle').textContent=ti;Pg.classList.toggle('draft',pg.k==='dr');
  const tx=$('#pgText');tx.innerHTML='';const body=paras.join(' ');tx.classList.toggle('dc',/^[가-힣]/.test(body));paras.forEach(t=>tx.appendChild(el('p',null,t)));
  $('#pgStamp').innerHTML=`<span>PARIS</span><b>${yr}</b><span>${noble()?'NOBLESSE':s.estate==='bourgeois'?'BOURGEOISIE':'TIERS ÉTAT'}</span>`;
  $('#pgFoot').textContent=`— ${i+1} —`;$('#pgNo').textContent=i+1;
  const latest=i===P.length-1;const cu=$('#pgCurl');cu.setAttribute('aria-label',latest?(s.dead?'끝':'다음 해로 넘기기'):'다음 쪽');cu.disabled=!!s.dead&&latest;
  $('#pgHint').textContent=!latest?'지난 쪽을 보고 있습니다. 모서리를 넘기면 다음 쪽으로 갑니다.':pg.k==='dr'?'방금 일어난 일이 이 쪽에 적혔습니다. 모서리를 넘기면 남은 한 해가 흐릅니다.':P.length<3?'모서리를 넘기면 한 해가 흐릅니다':'';
  $('#miniLine').textContent=`${s.given[0]} ${s.sur[0]} · ${s.year}년 · ${s.age}세`};
async function pgTurn(){if(!s||pgBusy)return;const P=pgPages();const Pg=$('#page');const cur=pgCur(P);
  Pg.classList.add('turn');await new Promise(r=>setTimeout(r,260));
  if(cur<P.length-1){pgView=cur+1;renderStory(true)}else{Pg.classList.remove('turn');pgView=-1;await liveYear()}
  Pg.classList.remove('turn');Pg.classList.add('land');setTimeout(()=>Pg.classList.remove('land'),400);window.scrollTo({top:0})}
function pgToc(){const pin=openPanel('목차');const ol=el('ol','toc');const P=pgPages();
  P.forEach((pg,i)=>{const li=el('li');const b=el('button',null);b.type='button';const t=pg.k==='pro'?['서장',s.by,'태어난 해']:pg.k==='ch'?[pg.c.t,pg.c.y,`${pg.c.a}세`]:['올해 · 쓰이는 중',s.year,`${s.age}세`];
    b.innerHTML=`<span class="tn">${i+1}</span><span class="tt">${t[0]}</span><span class="ty">${t[1]} · ${t[2]}</span>`;b.onclick=()=>{pgView=i===P.length-1?-1:i;closePanel();setTab('daily');renderStory(true)};li.appendChild(b);ol.appendChild(li)});pin.appendChild(ol)}
{const cu=$('#pgCurl');if(cu)cu.onclick=()=>pgTurn();const pg=$('#page');if(pg)pg.addEventListener('click',e=>{if(e.target.closest('.pg-curl'))return});
 const no=$('#pgNo');if(no)no.onclick=e=>{e.stopPropagation();if(s)pgToc()};
 const mn=$('#pgMenu'),menu=$('#menu');if(menu){document.body.appendChild(menu);menu.classList.add('pgmenu')}
 if(mn)mn.onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden};
 const mt=$('#mToc');if(mt)mt.onclick=()=>{menu.hidden=true;if(s)pgToc()};
 const ml=$('#mLog');if(ml)ml.onclick=()=>{menu.hidden=true;setTab('daily');const lc=$('#logCard');lc.hidden=!lc.hidden;ml.textContent=lc.hidden?'연대기 보기':'연대기 닫기';if(!lc.hidden){try{rebuildLog()}catch(e){}lc.scrollIntoView({behavior:'smooth'})}};
 document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>setTab(b.dataset.t))}
{const _st=start;start=function(f,o){_st(f,o);pgView=-1;if(f&&s)s.pgSeen=s.log.length;try{renderStory(true)}catch(e){}}}
// 이야기 탭에서는 알약이 쪽 아래 흐름 속에, 다른 탭에서는 화면 구석에 떠 있다
function pgPillPlace(t){const pill=$('#pgPill');if(!pill)return;if(t==='daily'){let w=$('#tDaily .pgwrap');if(!w){w=el('div','pgwrap');$('#pgHint').after(w)}w.appendChild(pill);pill.classList.add('inflow')}else{document.body.appendChild(pill);pill.classList.remove('inflow')}}
{const _set=setTab;setTab=function(t){_set(t);pgPillPlace(t);if(t==='daily'&&s){pgView=-1;try{renderStory(true)}catch(e){}}}}
pgPillPlace('daily');

{const _d=done;done=async function(){const r=await _d.apply(this,arguments);try{if(s&&curTab==='daily'){pgView=-1;renderStory(true)}}catch(e){}return r}}
