/* ================= 개편 8 =================
   1. 정치 쟁점 입장 표명을 서사로: 어디서, 무엇을, 누가 어떻게 받아들였는지
   2. 1789~1794년은 실제 역사의 달에 맞춘다: 날짜가 박힌 장면(바스티유, 바렌, 9월 학살, 혼례, 체포, 테르미도르 등)은 그 달에만 나온다 */

/* ---------- 1. 입장 표명 ---------- */
const RF8_SAY={
 crown:['왕은 신이 내린 자리이며 누구도 그 권위를 나눌 수 없다고 말했다','왕은 남되 헌법 아래에 있어야 한다고, 영국처럼 의회가 법을 만들어야 한다고 말했다','왕 없는 나라, 시민이 스스로 다스리는 공화국이어야 한다고 말했다'],
 vote:['삼부회의 옛 관습대로 신분마다 한 표씩 던져야 질서가 선다고 말했다','세금을 내는 사람, 나라에 몫이 있는 사람이 투표해야 한다고 말했다','가난하든 부자든 성인 남자라면 누구나 한 표를 가져야 한다고 말했다','조국이 위기에 있는 동안에는 선거를 멈추고 혁명정부가 다스려야 한다고 말했다'],
 prop:['영주의 권리도 대대로 물려받은 재산이니 함부로 빼앗아서는 안 된다고 말했다','사유재산은 인간의 신성한 권리이니 누구의 것이든 지켜야 한다고 말했다','교회와 망명자의 땅을 나라가 거두어 팔아야 빚을 갚는다고 말했다','땅은 그것을 가는 사람에게 돌아가야 한다고, 큰 영지를 쪼개 나눠야 한다고 말했다'],
 church:['가톨릭이 이 나라의 신앙이어야 하며 교회의 일에 의회가 손대서는 안 된다고 말했다','사제도 시민이니 헌법에 선서하고 국가의 봉급을 받아야 한다고 말했다','교회의 종을 녹이고 성상을 내려 이성의 신전을 세워야 한다고 말했다','무엇을 믿든 믿지 않든 그것은 각자의 양심에 맡겨야 한다고 말했다'],
 econ:['값을 법으로 묶으면 밀이 시장에서 사라질 뿐이니 거래는 자유로워야 한다고 말했다','굶주리는 사람이 있는 한 빵값은 법으로 묶고 매점매석꾼은 벌해야 한다고 말했다'],
 justice:['이제 피를 멈추고 관용을 베풀어야 할 때라고 말했다','적이라도 변호인과 증인이 있는 재판을 받아야 한다고 말했다','공화국의 적에게는 공포가 곧 정의라고, 머뭇거리면 혁명이 무너진다고 말했다'],
 war:['전쟁은 빵값과 젊은이들의 목숨만 앗아 간다며 평화를 맺어야 한다고 말했다','국경을 넘어오는 적은 막되 남의 나라까지 쳐들어갈 일은 아니라고 말했다','자유는 국경을 모른다며 혁명을 유럽의 모든 민중에게 가져가야 한다고 말했다']};
function rf8Venue(){const t=T();if(s.party&&['jacobin','cordelier'].includes(s.party))return pick(['클럽 연단에 올라','클럽의 저녁 회의에서']);
  if(noble()||s.estate==='bourgeois'&&R()<.4)return pick([t<1789?'살롱의 저녁 모임에서':'친구 집 응접실에서','카페 탁자에서 신문을 접고']);
  if(t>=1789.5&&t<1795.5)return pick(['구 회의(섹시옹) 자리에서','구 회의 뒷줄에서 손을 들고','빵집 앞 줄에서 이웃들에게']);
  return pick(['카페 탁자에서 신문을 접고','선술집 구석 자리에서','일터에서 동료들에게'])}
function rf8React(v){const ruling=(RULING(MI())||[]).map(id=>FAC[id]).filter(Boolean);const rp=ruling.length?ruling.reduce((a,f)=>a+f.pol,0)/ruling.length:0;const gap=Math.abs(v-rp);
  if(gap<=30)return pick(['몇 사람이 탁자를 두드리며 맞장구를 쳤다.','듣던 이들이 고개를 끄덕였다. 누군가 당신 잔에 포도주를 채웠다.','박수가 짧게 터졌다. 오늘은 당신 편이 많은 날이었다.']);
  if(gap<=60)return pick(['반은 고개를 끄덕였고 반은 팔짱을 꼈다. 논쟁은 밤늦게까지 이어졌다.','누군가 반박했고 당신도 물러서지 않았다. 결론은 나지 않았다.','잠시 침묵이 흘렀다. 그러고는 모두 각자의 이야기로 돌아갔다.']);
  return pick(['방 안이 조용해졌다. 누군가 당신 이름을 수첩에 적는 것이 보였다.','야유가 쏟아졌다. 돌아오는 길, 누군가 뒤따라오는 것 같아 몇 번이나 돌아보았다.','아무도 대꾸하지 않았다. 그 침묵이 반박보다 무서웠다.'])}
setStance=function(id,i,pub){const iss=ISSUES.find(x=>x.id===id);if(!iss)return;const prev=s.stance[id];s.stance[id]=i;
  const v=iss.opts[i][1];const d=Math.round((v-s.pol)*.2);s.pol=clamp(s.pol+d,-100,100);stanceBelief(id,v);if(pub)frelStance(id,v);
  if(pub&&prev!==i){let sus=0;if(inTerror()&&v<10)sus=8;if(T()>=tm(1815,7)&&T()<tm(1830,8)&&v>40)sus=4;
    const said=(RF8_SAY[id]&&RF8_SAY[id][i])||`‘${iss.n}’에 대해 ${iss.opts[i][0]} 쪽이 옳다고 말했다`;
    say(`${rf8Venue()} 당신은 ${said}. ${rf8React(v)}`+fx({fame:s.party?1:0,sus}),'ev')}};

/* ---------- 2. 1789~1794: 날짜가 박힌 장면은 그 달에만 ---------- */
const rf8M=(y,m)=>y*12+m-1;
// 혁명의 사람들(reform5): 날짜가 박힌 장면
const RF8_AT={rv_palais:rf8M(1789,7),rv_wed:rf8M(1790,12),rv_duplay:rf8M(1791,7),rv_audace:rf8M(1792,9),rv_sj:rf8M(1792,11),rv_vieux:rf8M(1794,1),rv_arrest:rf8M(1794,3),rv_therm:rf8M(1794,7)};
RV.forEach(x=>{if(RF8_AT[x.id]!=null)x.at=RF8_AT[x.id]});
// 벗들의 갈등(reform3) · 곁가지(reform2) 가운데 날짜가 박힌 것은 날짜 장면으로 옮긴다
const RF8_MOVE={cf_oath:rf8M(1791,1),cf_varennes:rf8M(1791,6),cf_sept:rf8M(1792,10),cf_max:rf8M(1793,10),cf_list:rf8M(1793,11),ds_wed:rf8M(1790,12),ds_horace:rf8M(1792,7)};
for(const id in RF8_MOVE){const i=RF2_SIDE.findIndex(x=>x.id===id);if(i<0)continue;const x=RF2_SIDE.splice(i,1)[0];const at=RF8_MOVE[id];
  RV.push({id,at,a:at/12,b:(at+1)/12,c:()=>{if(x.k!=='group'&&!(bfMet(x.k)&&bfAlive(x.k)&&!bfR(x.k).cut))return false;try{return x.when()}catch(e){return false}},run:x.run,side:id})}
// 날짜 조건을 그 달로 좁힌다(창 안의 아무 달이 아니라)
{const fx8=(id,fn)=>{const x=RV.find(r=>r.id===id);if(x){const c0=x.c;x.c=()=>c0()&&fn()}};
  fx8('ds_wed',()=>true);fx8('ds_horace',()=>true);
  // 바렌: 6월 말에 돌아왔으니 6월에(원래 창은 7월부터였다)
  const v=RV.find(r=>r.id==='cf_varennes');if(v)v.c=()=>bfRev()&&!child()&&s.age>=16&&rf3Two('gabriel','etienne');
  const o=RV.find(r=>r.id==='cf_oath');if(o)o.c=()=>bfRev()&&!child()&&s.age>=16&&rf3Two('etienne','jules')}
rvTick=async function(){if(!rvOn()||sheetLive)return;s.rv=s.rv||{d:{},nx:0};const now=MI(),t=T();
  // 1) 오늘 날짜에 박힌 장면: 간격과 상관없이, 그 달에만
  for(const x of RV){if(x.at==null||s.rv.d[x.id])continue;if(now>x.at){s.rv.d[x.id]='miss';continue}if(now<x.at)continue;
    let ok=false;try{ok=x.c()}catch(e){}if(!ok){s.rv.d[x.id]='miss';continue}
    s.rv.d[x.id]=s.year;if(x.side){const B=bfS();B.side=B.side||{};B.side[x.side]=s.year}s.rv.nx=now+1;try{await x.run()}catch(e){console.error('rv',x.id,e);sheetClose()}if(!s||s.dead||sheetLive)return}
  if(RV.some(x=>x.at===now&&s.rv.d[x.id]&&s.rv.d[x.id]!=='miss'))return;
  // 2) 날짜가 느슨한 장면: 창 안에서, 두 달 간격
  for(const x of RV){if(x.at!=null||s.rv.d[x.id])continue;if(t>=x.b){s.rv.d[x.id]='miss';continue}if(t<x.a)continue;
    if(now<s.rv.nx)return;let ok=false;try{ok=x.c()}catch(e){}if(!ok)continue;
    s.rv.d[x.id]=s.year;s.rv.nx=now+2;try{await x.run()}catch(e){console.error('rv',x.id,e);sheetClose()}return}};
// 벗 이야기: 바스티유의 날, 테르미도르, 처형일을 실제 달로
{const fixB=(id,o)=>{const b=BFB.find(x=>x.id===id);if(b)Object.assign(b,o)};
  fixB('et_dawn',{when:(w=>()=>(bfRev()?(T()>=1789.5&&T()<1789.55&&bfAlive('etienne')&&bfHere()&&!child()):w()))(BFB.find(x=>x.id==='et_dawn').when),until:(u=>()=>bfRev()?T()>=1789.55:u())(BFB.find(x=>x.id==='et_dawn').until),gap:0});
  fixB('et_fall',{when:(w=>()=>(bfRev()?(T()>=1794.5&&T()<1794.55&&bfAlive('etienne')&&!child()&&s.cond!=='prison'):w()))(BFB.find(x=>x.id==='et_fall').when),until:(u=>()=>bfRev()?T()>=1794.55:u())(BFB.find(x=>x.id==='et_fall').until),gap:0});
  fixB('ds_death',{when:()=>rfRDon()&&bfAlive('desmoulins')&&T()>=1794.25,until:()=>T()>=1794.34&&!bfAlive('desmoulins')});
  fixB('rb_death',{when:()=>rfRDon()&&bfAlive('robespierre')&&T()>=1794.5,until:()=>T()>=1794.59&&!bfAlive('robespierre')})}

/* ---------- 부고 화면: 이전으로 · 유언을 작성하기 ---------- */
// 이전으로: 부고를 닫고 마지막 플레이 화면으로 돌아간다(기록과 탭을 둘러볼 수 있다). 아래의 버튼으로 다시 부고를 연다.
function rf8BackPill(on){let b=$('#obBack');if(!b){b=el('button','shback');b.id='obBack';b.type='button';b.innerHTML='<span>부고로 돌아가기</span><small>Nécrologie</small>';b.onclick=()=>{rf8BackPill(false);showEnd()};document.body.appendChild(b)}b.hidden=!on}
{const hb=$('#homeB');if(hb){hb.textContent='이전으로';hb.onclick=()=>{if(!s){$('#end').hidden=true;$('#title').hidden=false;return}
  $('#end').hidden=true;$('#title').hidden=true;document.body.classList.remove('covered');try{render();setTab(curTab||'daily')}catch(e){}rf8BackPill(true)}}}
{const ab=$('#againB');if(ab){const a0=ab.onclick;ab.onclick=e=>{rf8BackPill(false);return a0&&a0(e)}}}
// 유언을 작성하기: 직접 쓴 말이 부고의 ‘마지막 말’이 된다
{const wb=$('#willB');if(wb)wb.onclick=()=>{if(!s)return;const w=$('#obWill');if(!w)return;let box=$('#willBox');if(box){box.remove();return}
  box=el('div','will-box');box.id='willBox';const ta=el('textarea');ta.maxLength=200;ta.rows=3;ta.placeholder='남기고 싶은 마지막 말을 적으세요. (200자 이내)';ta.value=s.willText||'';
  const row=el('div','will-row');const ok=el('button','pill pri','남긴다');ok.type='button';const cancel=el('button','pill','그만둔다');cancel.type='button';
  ok.onclick=()=>{const v=ta.value.trim();s.willText=v||null;try{save()}catch(e){}box.remove();showEnd()};cancel.onclick=()=>box.remove();
  row.appendChild(cancel);row.appendChild(ok);box.appendChild(ta);box.appendChild(row);w.after(box);ta.focus()}}
{const _se=showEnd;showEnd=function(){_se();try{rf8BackPill(false);const w=$('#obWill');if(!w||!s)return;const wb=$('#willB');if(wb)wb.textContent=s.willText?'유언을 고쳐 쓰기':'유언을 작성하기';
  if(s.willText){const wl=w.querySelector('.wl');if(wl)wl.textContent=`“${s.willText}”`;const k=w.querySelector('.wl-k');if(k)k.textContent='마지막 말 · 손수 남긴 글'}}catch(e){console.error(e)}}}
// 부고 뒤 둘러보기: 죽은 뒤에는 시간이 흐르지 않는다
{const _sp=setPaused;setPaused=function(v){if(s&&s.dead&&!v)return;return _sp(v)}}
{const _stp=step;step=async function(){if(s&&s.dead)return;return _stp()}}
