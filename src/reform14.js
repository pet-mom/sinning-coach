/* ================= 개편 14: 시간의 박자 =================
   1. 평소에는 한 번 넘어갈 때마다(계절 또는 달) 5초. 사건 창도 연달아 뜨면 앞 창이 닫히고 5초 뒤에 뜬다.
   2. 1794년 4~7월: 하루씩 넘기지 않는다. 역사 순서대로 사건이 있는 날로 건너뛰며, 7초마다 새 기록이 쌓인다.
   3. 1789~1794년에는 연달아 뜨는 사건 창 사이가 4초. 빨리감기와 자동 선택 중에도 이 쉼을 지킨다. */

/* ---------- 1·2. 한 칸의 길이 ---------- */
msPer=function(){return (typeof rf9In==='function'&&rf9In()&&s&&s.day)?7000:5000};

/* ---------- 2. 사건이 있는 날로만 건너뛴다 ---------- */
function r14Days(){const m=s.month+1,cur=s.day||1,d9=s.d9||{},o=new Set();
  for(const [mm,dd] of RF9_DAYS)if(mm===m&&dd>cur&&!d9[mm+'-'+dd])o.add(dd);
  for(const k in RF9_DD){const [y,mm,dd]=RF9_DD[k];if(y===s.year&&mm===m&&dd>cur)o.add(dd)}
  return [...o].sort((a,b)=>a-b)}
rf9DayStep=async function(){if(!s||s.dead)return false;const mi=MI();
  if(mi<RF9_A-1||mi>RF9_B){s.day=null;return false}
  if(mi===RF9_A-1){s.day=null;return false}
  const ds=r14Days();if(!ds.length){s.day=null;return false} // 이달에 남은 사건이 없으면 다음 달로
  s.day=Math.min(ds[0],RF9_DIM[s.month]);s.tick=0;await rf9DayEvents();try{relSync()}catch(e){}
  try{await bfTick()}catch(e){}try{await rvTick()}catch(e){}
  return true};

/* ---------- 3. 쉼은 실제 시간으로: 빨리감기·자동 선택도 기다린다 ---------- */
let r14ShowAt=0;
{const _so=sheetOpen;sheetOpen=function(t,fr){_so(t,fr);try{const w=rf11Last?rf11Last+rf11Gap()-Date.now():0;r14ShowAt=Date.now()+Math.max(0,w)}catch(e){r14ShowAt=0}}}
const r14Wait=()=>Math.max(0,r14ShowAt-Date.now());
arm=function(fn){pend=fn;if(autoMode)setTimeout(()=>{if(autoMode&&pend===fn)fn()},r14Wait()+ad())};
{setAuto=function(on){autoMode=on;$('#autoT').setAttribute('aria-pressed',String(on));$('#autoT').textContent=on?'자동 선택 켜짐':'자동 선택 꺼짐';
  if(on&&pend){const f=pend;setTimeout(()=>{if(autoMode&&pend===f)f()},r14Wait()+ad())}}}
