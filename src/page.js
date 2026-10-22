/* ================= 책 한 쪽: 시간이 흐르는 대신 쪽을 넘긴다 =================
   - 자동으로 흐르던 시간(타이머·배속·진행 막대)을 없앤다. 쪽 모서리를 넘기면 한 해를 살고, 그해의 이야기가 새 쪽에 적힌다.
   - 그해 안에 결정할 일이 생기면 사건 창이 뜨고, 고르고 나면 다시 넘어간다.
   - 아래 알약: 쪽 번호(누르면 목차) · 메뉴. 탭은 이야기 · 프로필 · 관계 · 시대 넷. 생활은 프로필 아래로 옮겼다. */
let pgView=-1,pgBusy=false;
// -1: 가장 최근 쪽, -2: 서장
const pgIdx=()=>{const n=(s.story||[]).length;return pgView===-2?-1:(pgView<0||pgView>=n?n-1:pgView)};
// 타이머로 흐르지 않게 한다
schedule=function(){clearTimeout(timer);ticking=false};
async function liveYear(){if(!s||s.dead||pgBusy||busy)return;pgBusy=true;document.body.classList.add('living');const y=s.year;let g=0;
  try{while(s&&!s.dead&&s.year===y&&g++<40){await step();if(!running)break}}catch(e){console.error(e)}
  pgBusy=false;document.body.classList.remove('living');pgView=-1;renderStory(true)}
function pgPrologue(){const rows=s.log.filter(e=>['big','ev'].includes(e.k)).slice(0,3).map(e=>stClean(e.t));
  const fam=[];if(s.fa&&s.fa.alive)fam.push(`아버지는 ${s.fa.age}세`);if(s.mo&&s.mo.alive)fam.push(`어머니는 ${s.mo.age}세`);
  const sib=(typeof stSibs==='function'?stSibs():[]).filter(x=>x.by<=s.year);
  return rows.join(' ')+(fam.length?` ${fam.join(', ')}였다.`:'')+(sib.length?` 집에는 ${jo(sib.map(x=>`${stTerm(x)} ${x.n}`).join(', '),'이','가')} 있었다.`:' 당신은 그 집의 첫아이였다.')+' 당신의 이야기는 여기서 시작된다.'}
renderStory=function(force){const P=$('#page');if(!P||!s)return;const L0=s.story||[];const n=L0.length;
  const idx=pgIdx();const c=idx>=0?L0[idx]:null;
  $('#pgYear').textContent=c?c.y:s.by;$('#pgAge').textContent=c?`${c.a}세`:'태어난 해';$('#pgTitle').textContent=c?c.t:'서장';
  const tx=$('#pgText');tx.innerHTML='';const body=c?c.x:pgPrologue();tx.classList.toggle('dc',/^[가-힣]/.test(body));
  // 문장을 두세 문단으로 나눈다
  const sent=[];body.split(/(?<=[.!?”])\s+/).filter(Boolean).forEach(x=>{if(sent.length&&(/^(하고|라고|라며|하며|이라고|라는|하는|하면서)/.test(x)||(sent[sent.length-1].split('“').length>sent[sent.length-1].split('”').length)))sent[sent.length-1]+=' '+x;else sent.push(x)});const per=Math.max(3,Math.ceil(sent.length/3));for(let i=0;i<sent.length;i+=per)tx.appendChild(el('p',null,sent.slice(i,i+per).join(' ')));
  $('#pgStamp').innerHTML=`<span>PARIS</span><b>${c?c.y:s.by}</b><span>${noble()?'NOBLESSE':s.estate==='bourgeois'?'BOURGEOISIE':'TIERS ÉTAT'}</span>`;
  $('#pgFoot').textContent=`— ${idx+2} —`;$('#pgNo').textContent=idx+2;
  const latest=idx===n-1;const cu=$('#pgCurl');cu.setAttribute('aria-label',latest?(s.dead?'끝':'다음 해로 넘기기'):'다음 쪽');cu.disabled=!!s.dead&&latest;
  $('#pgHint').textContent=!latest?'지난 쪽을 보고 있습니다. 모서리를 넘기면 다음 쪽으로 갑니다.':n<2?'모서리를 넘기면 한 해가 흐릅니다':'';
  $('#miniLine').textContent=`${s.given[0]} ${s.sur[0]} · ${s.year}년 · ${s.age}세`};
async function pgTurn(){if(!s||pgBusy)return;const n=(s.story||[]).length;const P=$('#page');
  const cur=pgIdx(),viewingOld=cur<n-1;P.classList.add('turn');await new Promise(r=>setTimeout(r,260));
  if(viewingOld){pgView=cur+1;renderStory(true)}else{P.classList.remove('turn');await liveYear()}
  P.classList.remove('turn');P.classList.add('land');setTimeout(()=>P.classList.remove('land'),400);window.scrollTo({top:0})}
function pgToc(){const pin=openPanel('목차');const ol=el('ol','toc');const L0=s.story||[];
  const add=(i,y,a,t)=>{const li=el('li');const b=el('button',null);b.type='button';b.innerHTML=`<span class="tn">${i+2}</span><span class="tt">${t}</span><span class="ty">${y} · ${a}</span>`;b.onclick=()=>{pgView=i<0?-2:i;closePanel();setTab('daily');renderStory(true)};li.appendChild(b);ol.appendChild(li)};
  add(-1,s.by,'태어난 해','서장');L0.forEach((c,i)=>add(i,c.y,`${c.a}세`,c.t));pin.appendChild(ol)}
{const cu=$('#pgCurl');if(cu)cu.onclick=()=>pgTurn();const pg=$('#page');if(pg)pg.addEventListener('click',e=>{if(e.target.closest('.pg-curl'))return});
 const no=$('#pgNo');if(no)no.onclick=e=>{e.stopPropagation();if(s)pgToc()};
 const mn=$('#pgMenu'),menu=$('#menu');if(menu){document.body.appendChild(menu);menu.classList.add('pgmenu')}
 if(mn)mn.onclick=e=>{e.stopPropagation();menu.hidden=!menu.hidden};
 const mt=$('#mToc');if(mt)mt.onclick=()=>{menu.hidden=true;if(s)pgToc()};
 const ml=$('#mLog');if(ml)ml.onclick=()=>{menu.hidden=true;setTab('daily');const lc=$('#logCard');lc.hidden=!lc.hidden;ml.textContent=lc.hidden?'연대기 보기':'연대기 닫기';if(!lc.hidden){try{rebuildLog()}catch(e){}lc.scrollIntoView({behavior:'smooth'})}};
 document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>setTab(b.dataset.t))}
// 생활은 프로필 아래에
showActs=function(){setTab('profile')};
{const _rt=renderTab;renderTab=function(t){_rt(t);if(t==='profile'&&s){try{const H=$('#profMore');const d=el('div','life-in');H.appendChild(d);lifeTab(d)}catch(e){console.error(e)}}}}
{const _st=start;start=function(f,o){_st(f,o);pgView=-1;try{renderStory(true)}catch(e){}}}
// 이야기 탭에서는 알약이 쪽 아래 흐름 속에, 다른 탭에서는 화면 구석에 떠 있다
function pgPillPlace(t){const pill=$('#pgPill');if(!pill)return;if(t==='daily'){let w=$('#tDaily .pgwrap');if(!w){w=el('div','pgwrap');$('#pgHint').after(w)}w.appendChild(pill);pill.classList.add('inflow')}else{document.body.appendChild(pill);pill.classList.remove('inflow')}}
{const _set=setTab;setTab=function(t){_set(t);pgPillPlace(t)}}
pgPillPlace('daily');
