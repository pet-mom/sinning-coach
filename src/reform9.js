/* ================= 개편 9: 1789~1794 사건 정리 =================
   1. 사건창 없이 그달의 역사로 언급만 하는 사건(목록 3·6·16·19·21·25·27·32·33·34·36·38·39·42·46·56·66, 67의 방데·노예제, 68의 4~6월)
   2. 1794년 4월 1일 ~ 7월 31일은 하루씩 진행하며, 실제 날짜 순서대로 사건을 띄운다. 죽은 사람은 그날 이후로만 죽어 있다.
   3. 나머지 사건에는 상황에 가장 어울리는 다섯 벗 · 데물랭 · 로베스피에르 · 당통의 반응을 붙인다. */

/* ---------- 1. 언급만 ---------- */
const RF9_MUTE=[[1789,4,/레베용/],[1789,7,/14수 반/],[1789,12,/아시냐 발행/],[1790,3,/83개 도/],[1790,5,/국유재산 경매/],[1790,7,/연맹제/],[1790,8,/낭시/],
  [1791,3,/알라르드/],[1791,4,/미라보|판테옹을/],[1791,6,/르 샤플리에/],[1791,7,/볼테르의 유해/],[1791,8,/생도맹그/],[1791,9,/헌법이 완성/],[1792,2,/설탕값/],[1792,7,/조국이 위기/],
  [1793,2,/영국과 네덜란드/],[1793,3,/혁명재판소|방데/],[1793,12,/비외 코르들리에|툴롱 탈환/],[1794,1,/지옥의 종대/],[1794,2,/노예제를 폐지/],[1794,4,/조제핀/],[1794,5,/라부아지에/],[1794,6,/최고존재/]];
const rf9Txt=h=>{try{return typeof h.text==='function'?'':String(h.text||'')}catch(e){return ''}};
for(const h of HIST){const y=Math.floor(h.mi/12),m=h.mi%12+1,tx=rf9Txt(h);if(RF9_MUTE.some(([a,b,re])=>a===y&&b===m&&re.test(tx))){h.mute=true;h.fn=null}}
{const _ra=rf2Att;rf2Att=async function(h,tx){if(h&&h.mute)return;return _ra(h,tx)}}

/* ---------- 2. 1794년 4~7월: 하루씩 ---------- */
const RF9_A=1794*12+3,RF9_B=1794*12+6; // 4월 ~ 7월
const rf9In=()=>s&&MI()>=RF9_A&&MI()<=RF9_B;
const RF9_DIM=[31,28,31,30,31,30,31,31,30,31,30,31];
// 그 기간의 역사는 달 처리에서 빼고 날짜에 맞춰 다시 적는다
for(const h of HIST){if(h.mi>=RF9_A&&h.mi<=RF9_B){h.day9=true}}
{const _rh9=runHistory;runHistory=async function(a,b){const keep=[];for(const h of HIST){if(h.day9&&h.mi>a&&h.mi<=b){keep.push(h);h.mi9=h.mi;h.mi=-1}}try{return await _rh9(a,b)}finally{keep.forEach(h=>{h.mi=h.mi9})}}}
// 날짜가 박힌 사람의 죽음
const RF9_DD={danton:[1794,4,5],desmoulins:[1794,4,5],lucile:[1794,4,13],robespierre:[1794,7,28],saintjust:[1794,7,28],augustinrobespierre:[1794,7,28],lebas:[1794,7,28],couthon:[1794,7,28],hebert:[1794,3,24]};
relSync=function(){for(const r of s.rel||[]){if(r.kind==='fic')continue;const p=perOf(r);if(!p){r.alive=false;continue}
  if(r.alive){r.fac=at(p.fac);r.inf=at(p.inf)||0;const dd=RF9_DD[p.id];
    let dead=s.year>p.d||(s.year===p.d&&s.month+1>=(p.dm||7));if(dead&&dd&&s.year===dd[0]&&s.month+1===dd[1]&&rf9In()&&(s.day||1)<dd[2])dead=false;
    if(dead){r.alive=false;r.dead=p.d;r.dc=p.dc==='단두대'?'guillotine':r.dc;L(`${r.role} ${p.n}${bat(p.n)?'이':'가'} ${p.d}년 ${p.dc==='노환'||p.dc==='병'?`${p.d-p.b}세로 세상을 떠났다`:p.dc==='단두대'?'단두대에서 처형되었다':p.dc==='전사'?'전사하였다':`세상을 떠났다 (${p.dc})`}.`,r.close>=55?'ev':'sys');if(r.close>=60&&!child())fx({hp:-1})}}}};
// 실존 인물의 죽음은 해마다가 아니라 달마다(그리고 하루 진행 중에는 날마다) 확인한다
{const _rd9=rfDaily;rfDaily=async function(){try{relSync()}catch(e){}await _rd9()}}
// 하루 진행 동안의 사건표
const RF9_DAYS=[
 [4,1,()=>L('4월, 당통과 데물랭이 체포된 지 사흘. 혁명재판소의 방청석은 매일 아침 가득 찼다. 당통의 목소리가 법정 창문 밖까지 들렸다고 한다.','hist')],
 [4,5,async()=>{L('4월 5일(제르미날 16일), 당통과 데물랭, 그리고 그 친구들이 혁명 광장의 단두대에 올랐다. 수레가 생토노레 거리를 지날 때 당통이 로베스피에르의 하숙집 쪽을 향해 무언가를 외쳤다고 한다.','hist');await rf9React('d0405')}],
 [4,13,()=>L('4월 13일, 카미유의 아내 뤼실 데물랭이 단두대에 올랐다. 스물셋이었다. 남편이 열하루 전에 간 길이었다.','hist')],
 [4,22,()=>L('4월 말, 조제핀 드 보아르네가 카름 감옥에 갇혔다. 남편 알렉상드르는 이미 그곳에 있었다.','hist')],
 [5,8,()=>L('5월 8일, 징세청부인 스물여덟 명이 처형되었다. 그 가운데 화학자 라부아지에가 있었다.','hist')],
 [6,8,()=>L('6월 8일, 샹드마르스에서 최고존재의 제전이 열렸다. 로베스피에르가 맨 앞에서 횃불로 ‘무신론’의 허수아비에 불을 붙였다.','hist')],
 [6,10,()=>L('6월 10일(프레리알 22일), 피고는 변호인도 증인도 없이 재판받게 되었다. 대공포정치. 혁명 광장의 단두대는 문밖 트론 광장으로 옮겨졌다.','hist')],
 [6,26,()=>L('6월 26일, 플뢰뤼스에서 공화국 군대가 이겼다. 전선이 멀어지자 사람들은 공포가 왜 아직 필요한지 묻기 시작했다.','hist')],
 [7,17,()=>L('7월 17일, 콩피에뉴의 카르멜회 수녀 열여섯 명이 트론 광장의 단두대에 올랐다. 그들은 차례를 기다리며 「오소서 성령이여」를 불렀고, 노래는 한 사람씩 줄어들었다.','hist')],
 [7,23,()=>L('7월 23일, 알렉상드르 드 보아르네가 단두대에 올랐다. 감옥의 조제핀은 다음 차례를 기다렸다.','hist')],
 [7,25,()=>L('7월 25일, 시인 앙드레 셰니에가 단두대에 올랐다. 감옥에서 쓴 시들은 빨래 바구니에 숨겨져 밖으로 나갔다.','hist')],
 [7,26,()=>L('7월 26일(테르미도르 8일), 로베스피에르가 국민공회에서 두 시간 동안 연설했다. 부패한 자들이 있다고, 그러나 이름은 대지 않았다. 그날 밤 많은 의원들이 잠들지 못했다.','hist')],
 [7,27,async()=>{L('7월 27일(테르미도르 9일), 생쥐스트의 연설이 고함에 묻혔다. 로베스피에르가 말하려 하자 목이 막혔다. 그와 아우, 생쥐스트, 쿠통, 르바가 체포되었다. 밤이 되자 시청에 갇힌 그들을 구하려고 시 자치회 쪽 구민들이 모였다.','hist');await rf9Scene('rv_therm')}],
 [7,28,async()=>{L('7월 28일(테르미도르 10일) 새벽, 국민공회 군대가 시청에 들어갔다. 르바는 스스로 목숨을 끊었고, 로베스피에르는 턱이 부서졌다. 저녁에 그와 생쥐스트, 쿠통 등 스물두 명이 혁명 광장의 단두대에 올랐다.','hist');
   relSync();rf9Fame('robespierre');await rf9Att('thermidor');await rf9Regime();await rf9React('d0728')}]];
async function rf9Scene(id){try{s.rv=s.rv||{d:{},nx:0};const x=RV.find(r=>r.id===id);if(!x||s.rv.d[id])return;if(!rvOn())return;let ok=false;try{ok=x.c()}catch(e){}if(!ok)return;s.rv.d[id]=s.year;await x.run()}catch(e){console.error(e);sheetClose()}}
async function rf9Att(id){try{if(!adult()||!inParis())return;const a=RF_ATT.find(x=>x[2]===id);if(!a||(s.att&&s.att[id]))return;const mi=a[0]*12+a[1]-1;rf9AttOK=true;await rfAttitude(mi-1,mi)}catch(e){console.error(e)}finally{rf9AttOK=false}}
let rf9AttOK=false,rf9RegOK=false;
// 그 기간에는 태도 창(테르미도르)과 정권 교체 창을 달 처리에서 띄우지 않고 날짜에 맞춘다
{const _fa=rfAttitude;rfAttitude=async function(a,b){if(rf9In()&&!rf9AttOK)return;return _fa(a,b)}}
{const _rt=regimeTurn;regimeTurn=async function(t0,t1){if(rf9In()&&!rf9RegOK)return;return _rt(t0,t1)}}
async function rf9Regime(){rf9RegOK=true;try{await regimeTurn(tm(1794,7)-1e-6,tm(1794,7))}catch(e){console.error(e)}finally{rf9RegOK=false}}
// 날짜 장면(테르미도르 밤)은 그날까지 미룬다
{const x=RV.find(r=>r.id==='rv_therm');if(x)x.day=27}
{const _rv=rvTick;rvTick=async function(){if(rf9In()){const x=RV.find(r=>r.id==='rv_therm');if(x&&!(s.rv&&s.rv.d.rv_therm)&&MI()===x.at&&(s.day||1)<27){const keep=x.at;x.at=-1;try{return await _rv()}finally{x.at=keep}}}return _rv()}}
// 벗 이야기의 처형일
{const fixB=(id,fn)=>{const b=BFB.find(x=>x.id===id);if(b){const w=b.when;b.when=()=>w()&&fn()}};
  fixB('ds_death',()=>!rf9In()||MI()>RF9_A||(s.day||1)>=5);fixB('rb_death',()=>!rf9In()||(s.day||1)>=28);fixB('et_fall',()=>!rf9In()||(s.day||1)>=28)}
// 하루 진행
async function rf9DayStep(){if(!s||s.dead)return false;const mi=MI();
  if(mi<RF9_A-1||mi>RF9_B){s.day=null;return false}
  // 3월에서 4월로 넘어가는 순간: 달 처리 뒤 4월 1일부터 하루씩
  if(mi===RF9_A-1){s.day=null;return false}
  const dim=RF9_DIM[s.month];const d=(s.day||1)+1;
  if(d>dim){s.day=null;return false} // 달이 바뀐다: 아래의 달 처리
  s.day=d;s.tick=0;await rf9DayEvents();try{relSync()}catch(e){}
  try{await bfTick()}catch(e){}try{await rvTick()}catch(e){}
  return true}
async function rf9DayEvents(){s.d9=s.d9||{};const m=s.month+1,d=s.day||1;
  for(const [mm,dd,f] of RF9_DAYS){const k=mm+'-'+dd;if(mm!==m||dd>d||s.d9[k])continue;s.d9[k]=1;try{await f()}catch(e){console.error(e)}if(s.dead)return}}
// 달이 바뀌는 날(1일)도 그날의 사건을 확인한다
{const _as9=advanceSeason;advanceSeason=async function(){await _as9();try{if(s&&!s.dead&&rf9In()){if(!s.day)s.day=1;await rf9DayEvents()}}catch(e){console.error(e)}}}
// 하루는 짧게 지나간다
{const _mp=msPer;msPer=function(){const v=_mp();return rf9In()&&s&&s.day?Math.max(260,v/7):v}}
// 날짜 표시
function rf9Sub(){try{if(!s||!rf9In()||!s.day)return;const sl=$('#subline');if(sl)sl.innerHTML=sl.innerHTML.replace(`${s.year}년 ${s.month+1}월`,`${s.year}년 ${s.month+1}월 ${s.day}일`)}catch(e){}}
{const _r9=render;render=function(){_r9();rf9Sub()}}
{const _so9=sheetOpen;sheetOpen=function(t,fr){_so9(t,fr);rf9Sub();try{if(rf9In()&&s.day){const f=$('#shFr');if(f)f.textContent=f.textContent.replace(`${s.year}년 ${s.month+1}월`,`${s.year}년 ${s.month+1}월 ${s.day}일`)}}catch(e){}}}

/* ---------- 3. 벗들의 반응 ---------- */
const rf9Core=k=>bfMet(k)&&bfAlive(k)&&!bfR(k).cut&&bfR(k).cond==='normal';
const rf9Fig=k=>{const r=typeof rvR==='function'?rvR(k):null;return !!(r&&r.alive)};
const rf9Ok=k=>['danton','robespierre','desmoulins','saintjust'].includes(k)?rf9Fig(k):rf9Core(k);
const N9=k=>['danton','robespierre','desmoulins','saintjust'].includes(k)?rvN(k):bN(k);
const U9=k=>jo(N9(k),'은','는'),I9=k=>jo(N9(k),'이','가'),H9=k=>['danton','robespierre','desmoulins','saintjust'].includes(k)?'그':bHe(k);
const RF9_RX={
 '1789-1':[['louise',()=>`빵값이 오를 때마다 ${U9('louise')} 새벽 화덕 앞에서 한숨을 쉬었다. “밀가루 한 포대가 지난달보다 열 수나 비싸. 이러다 사람들이 빵집에 돌을 던지겠어.”`],['etienne',()=>`${I9('etienne')} 시에예스의 소책자를 구해 와 밤새 읽어 주었다. 지금껏 아무것도 아니었던 사람들이 이제 무언가가 되려 한다는 대목에서 ${H9('etienne')}의 목소리가 높아졌다.`]],
 '1789-3':[['etienne',()=>`${U9('etienne')} 구의 진정서 초안에 ‘빚 때문에 사람을 가두는 법을 없애 달라’는 한 줄을 끼워 넣었다. 퐁뇌프에서 한 약속을 잊지 않은 것이다.`],['antoine',()=>`${U9('antoine')} 진정서에 내국 관세를 없애 달라는 조항을 넣자고 동네 상인들을 설득하고 다녔다. “관문마다 세금을 떼이니 장사가 되겠어?”`]],
 '1789-5':[['gabriel',()=>`베르사유에서 돌아온 ${U9('gabriel')} 개회식 이야기를 늘어놓았다. 제3신분 대표들에게는 검은 옷만 입게 했다고. “옷을 그렇게 입히면 화가 나지. 나라도 화나겠어.”`],['etienne',()=>`${U9('etienne')} 베르사유까지 걸어가 회의장 밖에서 하루를 보냈다. 돌아와서는 신분별 투표가 왜 속임수인지 밤새 설명했다.`]],
 '1789-6':[['etienne',()=>`${I9('etienne')} 숨을 몰아쉬며 달려왔다. “정구장에서 맹세했대. 헌법을 만들 때까지 흩어지지 않겠다고!” 그날 밤 ${H9('etienne')}는 처음으로 술에 취했다.`],['robespierre',()=>`${N9('robespierre')}에게서 짧은 편지가 왔다. 정구장의 맹세에 자기도 이름을 올렸다고, 손이 떨려 서명이 조금 비뚤어졌다고.`]],
 '1789-7a':[['etienne',()=>`네케르가 파면되었다는 소식에 ${U9('etienne')} 거리로 뛰쳐나갔다. 저녁에 돌아온 ${H9('etienne')}의 모자에 초록 나뭇잎이 꽂혀 있었다.`]],
 '1789-7b':[['jules',()=>`그날 오후 ${bfPar()}의 종이 경종으로 울렸다. 종을 친 사람은 ${N9('jules')}${bat(N9('jules'))?'이었다':'였다'}. “사, 사람들이 치라고 해서…” 손바닥이 줄에 쓸려 벗겨져 있었다.`],['louise',()=>`${U9('louise')} 그날 빵을 굽지 않았다. 대신 바스티유로 달려가는 사람들에게 어제 구운 빵을 모두 나눠 주었다.`]],
 '1789-7c':[['gabriel',()=>`${N9('gabriel')}의 ${noble()?'사촌':'단골손님'}들이 밤 마차를 타고 국경으로 떠났다. ${U9('gabriel')} 남았다. “도망치는 건 촌스러워.” 그렇게 말하면서도 손거울을 쥔 손이 하얗게 질려 있었다.`]],
 '1789-8a':[['antoine',()=>`${U9('antoine')} 시골에서 올라오던 곡물 수레가 털렸다며 장부를 붙잡고 울상을 지었다. “도적이 아니라 겁먹은 농부들이래. 그게 더 무서워.”`],['louise',()=>`${U9('louise')} 시골 외삼촌이 영주 성관의 문서 창고에 불을 질렀다는 편지를 받았다. 글을 읽어 준 당신에게 그녀가 물었다. “잘한 거지? 그렇지?”`]],
 '1789-8b':[['gabriel',()=>`${U9('gabriel')} 그 소식을 듣고 한참 웃더니 갑자기 조용해졌다. “하룻밤 사이에 ${noble()?'우리 집안의 이백 년':'귀족 손님들의 이백 년'}이 사라졌어. 그런데 이상하게 홀가분해.”`],['etienne',()=>`${I9('etienne')} 당신 집 문을 두드렸다. “특권이 사라졌어. 다음은 빚 감옥이야.” 퐁뇌프의 약속 이야기였다.`]],
 '1789-9':[['etienne',()=>`${I9('etienne')} 마라의 『인민의 벗』 첫 호를 구해 와 탁자에 펼쳤다. 거친 말들이었다. ${U9('etienne')} 그 거친 말이 좋다고 했다.`],['gabriel',()=>`${U9('gabriel')} 영국처럼 상원을 두자던 사람들이 졌다며 혀를 찼다. “우아함이라고는 없는 나라가 되겠어.”`]],
 '1789-10':[['louise',()=>`${U9('louise')} 베르사유까지 걸어갔다 왔다. 진흙투성이 치마로 빵집 문을 열며 말했다. “왕을 데려왔어. 이제 빵도 같이 오겠지.” 그 웃음소리가 골목 끝까지 들렸다.`]],
 '1789-11':[['jules',()=>`교회 재산이 나라의 것이 되었다는 소식에 ${U9('jules')} 성구실의 은촛대를 오래 닦았다. “이, 이것도 가져갈까?” 당신은 대답하지 못했다.`],['robespierre',()=>`생토노레 거리의 옛 수도원에서 새 클럽이 모이기 시작했다. ${U9('robespierre')} 첫 모임부터 맨 앞줄에 앉았다고 했다.`]],
 '1790-2':[['jules',()=>`수도원들이 문을 닫는다는 소식에 ${U9('jules')} 하루 종일 말이 없었다. 저녁에야 물었다. “수, 수녀님들은 이제 어디로 가?”`]],
 '1790-4':[['danton',()=>`${N9('danton')}의 목소리가 새 클럽의 천장을 울렸다는 소문이 동네까지 들렸다. 회비 두 수면 누구든 들어갈 수 있다고 했다.`],['desmoulins',()=>`${U9('desmoulins')} 코르들리에 클럽이 열린 날 당신을 끌고 가려 했다. “거긴 의자가 모자라서 다들 서서 떠들어. 그게 좋아.”`]],
 '1790-6':[['gabriel',()=>noble()?`${U9('gabriel')} 명함에서 ‘드’ 자를 칼로 긁어냈다. “이름이 짧아지니 가볍네.” 그러고는 긁어낸 자리를 손가락으로 오래 문질렀다.`:`${U9('gabriel')} 귀족 손님들이 하룻밤 사이에 ‘시민’이 됐다며 웃었다. “이제 나랑 똑같네.” 그런데 웃음 끝이 조금 씁쓸했다.`]],
 '1790-7':[['jules',()=>`${U9('jules')} 성직자 시민헌법 조문을 읽고 또 읽었다. “주, 주교를 투표로 뽑는다고?” 그 밤 ${H9('jules')}는 종탑에서 내려오지 않았다.`]],
 '1790-9':[['antoine',()=>`${U9('antoine')} 관직 값을 나라가 갚아 준다는 소식에 셈부터 했다. “법관 집안들이 현금을 쥐게 되겠군. 그 돈이 어디로 갈지 알아?” 국유재산 경매장이었다.`],['gabriel',()=>`${U9('gabriel')} 고등법원이 문을 닫던 날 법관들의 붉은 법복이 헌옷 가게에 걸린 것을 보았다고 했다. “다음엔 내 비단 옷 차례일까.”`]],
 '1790-11':[['jules',()=>`${U9('jules')} 선서 기한까지 남은 날을 손가락으로 세었다. 셀 때마다 손가락이 하나씩 모자랐다.`]],
 '1791-6':[['robespierre',()=>`${N9('robespierre')}에게서 쪽지가 왔다. “왕은 스스로 왕관을 벗었소. 이제 우리가 결정할 차례요.” 글씨가 평소보다 빨랐다.`],['gabriel',()=>`${U9('gabriel')} 바렌 소식을 듣고 거울 앞에 오래 서 있었다. “왕이 하인 옷을 입었대. 나라면 그런 옷은 안 입어.” 농담인데 아무도 웃지 않았다.`]],
 '1791-7':[['desmoulins',()=>`발포 뒤 ${U9('desmoulins')} 몸을 숨겼다는 소문이 돌았다. 며칠 뒤 당신 집 문틈으로 쪽지 하나가 들어왔다. “살아 있어. 신문은 잠시 쉰다. 카미유.”`],['danton',()=>`${U9('danton')} 영국으로 몸을 피했다고 했다. 그 거구가 배에서 뱃멀미를 했을 걸 생각하니 웃음이 났다. 웃을 일이 아닌데도.`],['etienne',()=>`샹드마르스의 총성이 그친 뒤 ${U9('etienne')} 피 묻은 청원서 한 장을 들고 돌아왔다. 서명란에 이름이 빽빽했다. ${H9('etienne')}의 이름도 있었다.`]],
 '1791-10':[['robespierre',()=>`${jo(N9('robespierre'),'은','는')} 제헌의원이라 새 의회에 나갈 수 없었다. 대신 자코뱅 연단에서 전쟁을 외치는 브리소를 매일 밤 반박했다. 전쟁은 자유가 아니라 장군들을 키울 뿐이라고.`],['etienne',()=>`${U9('etienne')} 브리소의 연설에 반해 돌아왔다. “유럽의 모든 민중이 우리를 기다려.” 당신은 그 모든 민중이 누구인지 묻지 않았다.`]],
 '1791-11':[['louise',()=>`${U9('louise')} 빵집 손님들 앞에서 왕 흉내를 냈다. “거부! 거부!” 손님들이 배를 잡고 웃었다. 당신도 웃었지만, 그 웃음이 어딘가 아슬아슬했다.`]],
 '1792-3':[['antoine',()=>`${U9('antoine')} 새 내각의 장관들이 상인 편이라며 반겼다. “롤랑 부인의 살롱에 줄을 대 봐야겠어.” 그 줄이 몇 해 뒤 어떤 올가미가 될지 ${H9('antoine')}는 몰랐다.`]],
 '1792-4':[['robespierre',()=>`${U9('robespierre')} 끝까지 전쟁에 반대했다. 남의 나라에 총칼로 자유를 들고 가면 아무도 반기지 않는다고. 그날 자코뱅 회의장에서 그는 거의 혼자였다.`],['jules',()=>`단두대가 처음 쓰였다는 소식에 ${U9('jules')} 묵주를 쥐고 오래 기도했다. “빠, 빠르고 아프지 않대. 그게 더 무서워.”`]],
 '1792-6':[['louise',()=>`${U9('louise')} 튈르리로 몰려간 행렬 속에 있었다. 돌아와서 말했다. “왕이 빨간 모자를 쓰고 우리랑 건배했어. 그런데 하나도 기쁘지 않더라.”`],['gabriel',()=>`${U9('gabriel')} 왕이 억지로 붉은 모자를 썼다는 말에 몸서리를 쳤다. “모자가 어울리지도 않았을 거야.” 그 농담이 떨리고 있었다.`]],
 '1792-8a':[['gabriel',()=>`스위스 근위대의 시신이 튈르리 정원에 쌓였다는 말에 ${U9('gabriel')} 하얗게 질렸다. 어린 시절 얼음이 깨지던 그 연못이 있는 정원이었다.`],['danton',()=>`그날 밤 ${U9('danton')} 법무장관이 되었다. 시청 앞에서 그를 본 사람들은 그가 밤새 한숨도 자지 않았다고 했다.`],['etienne',()=>`${U9('etienne')} 튈르리 계단에서 돌아왔다. 소매에 묻은 피가 누구의 것인지 말하지 않았다.`]],
 '1792-8b':[['jules',()=>`선서 거부 사제는 보름 안에 나라를 떠나라는 법령이 붙었다. ${U9('jules')} 짐을 싸지 않았다. 대신 종탑 열쇠를 당신에게 맡겼다. “조, 종은 울려야 하니까.”`]],
 '1792-9a':[['danton',()=>`학살이 이어지는 동안 법무장관 ${U9('danton')} 아무 명령도 내리지 않았다는 말이 돌았다. 당신은 그 거구가 감옥 쪽 하늘을 바라보며 서 있는 모습을 떠올렸다.`],['louise',()=>`${U9('louise')} 아베 감옥 앞을 지나다 돌아왔다. 그날 저녁 그녀는 빵을 하나도 굽지 못했다. 손이 떨려서 반죽이 되지 않았다고 했다.`]],
 '1792-9b':[['etienne',()=>`공화국이 선포된 날 ${U9('etienne')} 당신 집 창문 아래에서 노래를 불렀다. 이웃들이 창문을 열고 따라 불렀다.`],['louise',()=>`이혼법 소식에 ${U9('louise')} 반죽을 치대며 말했다. “맞은편 집 마르트가 드디어 술주정뱅이 남편이랑 갈라설 수 있겠네.”`]],
 '1792-10':[['robespierre',()=>`${U9('robespierre')} 회의장 가장 높은 왼쪽 자리에 앉았다. ‘산’ 위의 사람들. 방청석에서 보니 그 자리가 이상하게 멀어 보였다.`],['etienne',()=>`${U9('etienne')} 국민공회 방청석에서 산악파 쪽에 박수를 치다 지롱드파 의원에게 삿대질을 받았다. 돌아와서 그 이야기를 자랑처럼 했다.`]],
 '1792-11':[['gabriel',()=>`쇠 궤짝에서 왕의 비밀 편지가 쏟아져 나왔다는 소식에 ${U9('gabriel')} 한참 말이 없었다. “왕도 거짓말을 했구나.” 그 목소리가 처음으로 늙어 보였다.`]],
 '1792-12':[['desmoulins',()=>`${U9('desmoulins')} 신문에 왕의 재판을 두고 날 선 글을 썼다. 그러다 당신에게만 털어놓았다. “막시밀리앙이 사형을 원해. 사형제를 없애자던 사람이.”`],['jules',()=>`${U9('jules')} 왕을 위해 매일 밤 기도한다고 했다. “와, 왕도 사람이잖아.” 그 말을 하며 문단속을 두 번 했다.`]],
 '1793-1':[['jules',()=>`그날 아침 ${U9('jules')} 숨어서 미사를 드렸다. 성체를 들어 올린 시각이 칼날이 떨어진 시각과 같았다고, 나중에 ${H9('jules')}가 말했다.`],['etienne',()=>`${U9('etienne')} 혁명 광장에서 돌아와 아무 말 없이 물 한 잔을 마셨다. 그러고는 말했다. “이제 되돌아갈 길은 없어.”`]],
 '1793-4':[['danton',()=>`${U9('danton')} 새로 만든 공안위원회에 들어갔다. “이제야 일을 할 수 있겠군.” 그 위원회가 일 년 뒤 무엇이 될지 그는 몰랐다.`]],
 '1793-5':[['louise',()=>`최고가격제가 정해지자 ${U9('louise')} 밤마다 장부를 들여다보았다. 정해진 값에 팔면 남는 게 없었다. “그래도 줄 선 사람들이 굶진 않겠지.”`],['antoine',()=>`${U9('antoine')} 최고가격 목록을 보고 코웃음을 쳤다. “값을 묶으면 물건이 숨지. 숨는 곳은 내가 잘 알아.”`]],
 '1793-6':[['desmoulins',()=>`${U9('desmoulins')} 지롱드파를 비꼬는 소책자로 이름을 날렸었다. 그들이 끌려가던 날, 카미유는 자기 글이 그들을 거기로 보냈다며 밤새 잠들지 못했다.`],['etienne',()=>`${U9('etienne')} 대포를 끌고 국민공회를 둘러싼 구민들 맨 앞에 있었다. 돌아와서 말했다. “이제 공화국은 하나야.”`]],
 '1793-7':[['etienne',()=>`마라가 죽었다. ${U9('etienne')} 구 회의장에 마라의 흉상을 세우는 일을 맡았다. 흉상을 닦는 손길이 성상을 닦던 쥘의 손길과 닮아 보였다.`],['robespierre',()=>`${U9('robespierre')} 공안위원회에 들어갔다. 축하하러 간 당신에게 그는 말했다. “축하할 일이 아니오. 짐이오.”`]],
 '1793-8':[['antoine',()=>`${U9('antoine')} 군대에 장화를 대는 계약을 따냈다. “나라가 싸우는 동안 누군가는 신발을 만들어야지.” 밑창이 무엇으로 되어 있는지는 묻지 않았다.`],['etienne',()=>`${U9('etienne')} 국민총동원령 벽보를 소리 내어 읽었다. 젊은이는 싸우고 기혼자는 무기를 만든다는 대목에서 당신을 돌아보았다.`]],
 '1793-9':[['louise',()=>`${U9('louise')} 빵집 문 앞에 붙은 혐의자법 벽보를 당신에게 읽어 달라고 했다. 다 듣고 나서 말했다. “그러니까 아무나 잡아갈 수 있다는 거네.”`],['antoine',()=>`${U9('antoine')} 전면 최고가격제가 공포된 날 창고 열쇠를 세 번 확인했다.`]],
 '1793-10':[['gabriel',()=>`왕비가 처형되던 날 ${U9('gabriel')} 창문을 모두 닫았다. 그리고 거울에 검은 천을 씌웠다.`],['louise',()=>`여성 정치클럽이 금지되었다. ${U9('louise')} 혁명여성협회 모임에서 받은 붉은 모자를 서랍에 넣으며 말했다. “빵 줄에 서는 건 여자인데, 말은 남자만 하래.”`]],
 '1793-11':[['jules',()=>`${bfPar()}의 종이 끌려 내려갔다. ${U9('jules')} 종이 실려 가는 수레를 끝까지 따라갔다. 대장간 앞에서 수레가 멈추자 종을 한 번 쓰다듬었다.`]],
 '1794-3a':[['louise',()=>`초석을 긁으라는 명령이 내려왔다. ${U9('louise')} 빵집 지하실 흙을 긁어 구 공방에 냈다. “빵 굽던 집 흙으로 대포가 나간대.”`],['antoine',()=>`${U9('antoine')} 초석 공방에 통 쉰 개를 대는 계약을 따냈다. 그러고는 당신 귀에 속삭였다. “요즘은 애국이 장사야.”`]],
 '1794-3b':[['desmoulins',()=>`에베르가 처형되었다. ${U9('desmoulins')} 그 소식에 웃었다. 그러나 그 웃음은 오래가지 않았다. “다음은 누구 차례일까.”`],['danton',()=>`${U9('danton')} 에베르의 처형 소식에 어깨를 으쓱했다. “놈들이 나를 건드리진 못해.” 그 말이 이상하게 크게 들렸다.`]],
 'd0405':[['etienne',()=>`${U9('etienne')} 그날 구 회의에 나가지 않았다. 『비외 코르들리에』 한 부를 접어 품에 넣고 혁명 광장 쪽으로 걸어갔다가, 끝내 광장에 들어서지 못하고 돌아왔다.`],['louise',()=>`${U9('louise')} 수레가 지나가는 길가에 서 있었다. 카미유라는 청년이 군중에게 무언가를 외치다 목이 메는 것을 보았다고 했다. 그날 빵집 문은 열리지 않았다.`]],
 'd0728':[['gabriel',()=>`${U9('gabriel')} 그날 밤 축하 무도회에 갔다. 그러나 돌아와 거울 앞에 앉아서는 오래 울었다. 왜 우는지 ${H9('gabriel')}도 몰랐다.`],['jules',()=>`${U9('jules')} 숨어 있던 지하실에서 나와 처음으로 햇볕을 쬐었다. 종탑은 비어 있었다. 그래도 ${H9('jules')}는 종 줄을 한 번 당겨 보았다.`],['louise',()=>`${U9('louise')} 수레가 지나간 저녁, 말없이 빵 두 덩이를 당신에게 내밀었다. “하나는 너, 하나는… 모르겠다. 아무나.”`]],
 '1794-8':[['jules',()=>`감옥 문이 열리기 시작했다. ${U9('jules')} 수염이 덥수룩한 얼굴로 돌아와 종탑 열쇠를 돌려받았다. 손이 떨려 열쇠를 두 번 떨어뜨렸다.`]],
 '1794-11':[['etienne',()=>`자코뱅 클럽이 문을 닫았다. ${U9('etienne')} 회원증을 난로에 넣고 불길이 종이를 다 삼킬 때까지 지켜보았다.`],['gabriel',()=>`${U9('gabriel')} 귀를 덮는 머리에 넥타이를 높이 맨 금빛 청년단 차림으로 나타났다. 손에 든 몽둥이가 너무 새것이었다.`]],
 '1794-12':[['louise',()=>`최고가격제가 사라지자 밀가루 값이 한 달 만에 세 배가 되었다. ${U9('louise')} 빵을 반으로 잘라 팔기 시작했다. “반쪽이라도 먹어야지.”`]]};
// 사건 → 반응 키
const RF9_KEY=[[1789,1,/혹한/,'1789-1'],[1789,3,/진정서|삼부회 선거/,'1789-3'],[1789,5,/삼부회가 개회/,'1789-5'],[1789,6,/국민의회|정구장/,'1789-6'],[1789,7,/네케르를 파면/,'1789-7a'],[1789,7,/바스티유 요새/,'1789-7b'],[1789,7,/삼색 모표/,'1789-7c'],
 [1789,8,/대공포/,'1789-8a'],[1789,8,/봉건적 특권/,'1789-8b'],[1789,9,/거부권/,'1789-9'],[1789,10,/베르사유로 행진/,'1789-10'],[1789,11,/교회 재산이 국가/,'1789-11'],[1790,2,/수도 서원/,'1790-2'],[1790,4,/코르들리에 클럽/,'1790-4'],[1790,6,/작위가 폐지/,'1790-6'],
 [1790,7,/성직자 시민헌법/,'1790-7'],[1790,9,/고등법원이 폐지/,'1790-9'],[1790,11,/선서가 요구/,'1790-11'],[1791,6,/바렌/,'1791-6'],[1791,7,/샹드마르스/,'1791-7'],[1791,10,/입법의회/,'1791-10'],[1791,11,/거부권 씨/,'1791-11'],
 [1792,3,/지롱드파 내각/,'1792-3'],[1792,4,/선전포고/,'1792-4'],[1792,6,/프리지아/,'1792-6'],[1792,8,/튈르리 궁을 습격/,'1792-8a'],[1792,8,/추방|라파예트/,'1792-8b'],[1792,9,/학살/,'1792-9a'],[1792,9,/공화국을 선포/,'1792-9b'],[1792,10,/산악파/,'1792-10'],
 [1792,11,/쇠 궤짝/,'1792-11'],[1792,12,/재판을 시작/,'1792-12'],[1793,1,/처형되었다/,'1793-1'],[1793,4,/공안위원회/,'1793-4'],[1793,5,/최고가격제/,'1793-5'],[1793,6,/지롱드파 의원/,'1793-6'],[1793,7,/마라/,'1793-7'],[1793,8,/총동원령/,'1793-8'],
 [1793,9,/공포를 의사일정/,'1793-9'],[1793,10,/마리 앙투아네트/,'1793-10'],[1793,11,/이성의 신전/,'1793-11'],[1794,3,/초석/,'1794-3a'],[1794,3,/에베르/,'1794-3b'],[1794,8,/혐의자들이 풀려/,'1794-8'],[1794,11,/자코뱅 클럽이 문을 닫/,'1794-11'],[1794,12,/최고가격제가 폐지/,'1794-12']];
let rf9Tag='';{const _q9=Q;Q=async function(title,fr,text,opts){const i=await _q9(title,fr,text,opts);try{rf9Tag=(opts&&opts[i]&&opts[i].a)||''}catch(e){}return i}}
async function rf9React(key){if(!s||s.dead||child()||s.age<12)return;const L0=RF9_RX[key];if(!L0)return;s.r9=s.r9||{};if(s.r9[key])return;s.r9[key]=1;
  let n=0;for(const [k,f] of L0){if(n>=2)break;if(!rf9Ok(k))continue;let t='';try{t=f()}catch(e){continue}if(!t)continue;
    // 당신이 고른 태도와 그 사람의 성향
    const r=['danton','robespierre','desmoulins','saintjust'].includes(k)?rvR(k):bfR(k);const fp=r?(r.pol||0):0;const rad=/radical/.test(rf9Tag),roy=/royal|pious/.test(rf9Tag);
    let tail='';if(rad&&fp>=30||roy&&fp<=-20){tail=` ${U9(k)} 당신의 대답을 듣고 고개를 끄덕였다.`;try{if(r&&RV_BFK&&!RV_BFK[k]&&!['danton','robespierre','desmoulins','saintjust'].includes(k))bfRel(k,{close:2});else rvRel(k,{close:2})}catch(e){}}
    else if(rad&&fp<=-20||roy&&fp>=30){tail=` 당신의 대답에 ${U9(k)} 말없이 눈길을 돌렸다.`;try{if(['danton','robespierre','desmoulins','saintjust'].includes(k))rvRel(k,{close:-2});else bfRel(k,{close:-2})}catch(e){}}
    L(t+tail,'ev');n++}}
{const _rh9b=runHistory;runHistory=async function(a,b){const hs=HIST.filter(h=>h.mi>a&&h.mi<=b&&!h.mute&&!h.day9);rf9Tag='';await _rh9b(a,b);if(!s||s.dead)return;
  for(const h of hs){const y=Math.floor(h.mi/12),m=h.mi%12+1,tx=rf9Txt(h);const k=RF9_KEY.find(([yy,mm,re])=>yy===y&&mm===m&&re.test(tx));if(k)try{await rf9React(k[3])}catch(e){console.error(e)}}}}

// 날짜 사건표와 겹치는 짧은 이야기(당통·카르멜회·셰니에)는 달 처리에서 빼고 날짜에 맞춘 줄로 대신한다
for(const id of ['danton','carmelites','chenier']){const e=(typeof EV!=='undefined'?EV:[]).find(x=>x.id===id);if(e)e.c=()=>false}

// 유명인의 죽음에 대한 반응(grief.js)도 그날에: 로베스피에르는 7월 28일
let rf9FameOK=false;
{const _gf=gFame;gFame=function(prev,now){const held=[];if(rf9In()&&!rf9FameOK){for(let i=G_FAME.length-1;i>=0;i--)if(G_FAME[i][2]==='robespierre')held.push([i,G_FAME.splice(i,1)[0]])}
  try{return _gf(prev,now)}finally{held.reverse().forEach(([i,e])=>G_FAME.splice(i,0,e))}}}
function rf9Fame(id){rf9FameOK=true;try{const e=G_FAME.find(x=>x[2]===id);if(e){const mi=e[0]*12+e[1];gFame(mi-1,mi)}}catch(x){console.error(x)}finally{rf9FameOK=false}}
