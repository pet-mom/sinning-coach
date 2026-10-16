/* ================= 상태 ================= */
let s=null;
const isM=()=>s.sex==='M';
const child=()=>s.age<14;
const free=()=>!child()&&s.cond==='normal';
const noble=()=>ESTATES[s.estate].noble;
const loc=()=>s.loc||s.region;
const inParis=()=>loc()==='paris';
const urban=()=>REGIONS[loc()].urban;
const rich=()=>s&&(s.money>=20000||s.land>=1000);
const lit=()=>s.literate;
const west=()=>['vendee','bretagne','nantes'].includes(loc())||(loc()==='normandie'&&R()<.3);
const south=()=>['provence','languedoc','marseille','lyon','gascogne'].includes(loc());
const trait=k=>s.trait===k;
const job=()=>s.job?POST[s.job]:null;
const onTrack=k=>!!job()&&job().tr===k;
const priest=()=>onTrack('church')&&isM()&&s.job!=='r1';
const nun=()=>onTrack('church')&&!isM();
const soldier=()=>onTrack('army');
const deputy=()=>s.job==='p3'||s.job==='p4'||s.job==='p5';
const money=()=>T()>=1795.5?'프랑':'리브르';
const yl=()=>`${s.year}년`;
const ym=()=>`${s.year}년 ${s.month+1}월`;
const kidsAlive=()=>s.kids.filter(k=>k.alive);
const adultKids=()=>s.kids.filter(k=>k.alive&&s.year-k.y>=20).length;

/* ================= 직업 ================= */
// tr: 트랙, t: 단계, n/nf: 남/녀 명칭(nf가 null이면 남성만), pay: 연 수입(리브르), ok: 그 시대·신분에 그 자리가 있는가, need: 진입 조건
const TRACKS={farm:'농업',craft:'수공업·상업',law:'법조·행정',church:'교회',med:'의학',army:'군대',pol:'정치',letters:'문필'};
const PL=[
 ['f1','farm',1,'날품팔이 농군','날품팔이 아낙','journalier',160],
 ['f2','farm',2,'소작농','소작농','métayer',300],
 ['f3','farm',3,'자영농','자영농','laboureur',600,{cost:600}],
 ['f4','farm',4,'대농 차지농','대농 차지농','fermier',1800,{cost:2500,soc:30}],
 ['f5','farm',5,'지주','지주','propriétaire',3500,{land:900}],
 ['c1','craft',1,'견습공','하녀','apprenti / servante',70],
 ['c2','craft',2,'직인','재봉사','compagnon / couturière',330],
 ['c3','craft',3,'장인','의상실 주인','maître / marchande de modes',900,{cost:500,soc:25}],
 ['c4','craft',4,'상인','상인','marchand',3000,{cost:3000,soc:35}],
 ['c5','craft',5,'도매상·선주','도매상','négociant',9000,{money:15000,soc:45}],
 ['c6','craft',6,'은행가·군납업자',null,'banquier / munitionnaire',25000,{money:60000,soc:55}],
 ['l1','law',1,'법률사무소 서기',null,'clerc',300,{edu:30}],
 ['l2','law',2,'변호사',null,'avocat',1800,{edu:50,cost:1200}],
 ['l3','law',3,'판사',null,'juge',3500,{edu:55,fame:15}],
 ['l4','law',4,'고등법원 판사',null,'conseiller au Parlement',9000,{edu:60,cost:40000},()=>T()<1790.75],
 ['l4b','law',4,'공소관',null,'accusateur public',5000,{edu:55,fame:25},()=>T()>=1791&&T()<1800],
 ['l4c','law',4,'도지사',null,'préfet',12000,{edu:55,soc:50,fame:40},()=>T()>=1800],
 ['l5','law',5,'지방 감독관',null,'intendant',20000,{edu:65,soc:55,fame:45},()=>T()<1789.25&&noble()],
 ['l5b','law',5,'국사원 위원',null,'conseiller d’État',20000,{edu:65,soc:55,fame:50},()=>T()>=1800],
 ['l6','law',6,'장관',null,'ministre',60000,{edu:65,soc:65,fame:65}],
 ['r1','church',1,'신학생','수련 수녀','séminariste / novice',0],
 ['r2','church',2,'보좌신부','수녀','vicaire / religieuse',350,{faith:40}],
 ['r3','church',3,'본당 신부','수녀원 부원장','curé / prieure',700,{faith:45,edu:35}],
 ['r4','church',4,'참사회원','수녀원장','chanoine / abbesse',3000,{faith:45,edu:45,soc:35},()=>T()<1790||T()>=1802],
 ['r5','church',5,'주교',null,'évêque',25000,{faith:50,edu:55,soc:50,fame:35},()=>(T()<1790&&noble())||(T()>=1791&&T()<1793.5)||T()>=1802],
 ['a1','army',1,'병사',null,'soldat',90],
 ['a2','army',2,'하사관',null,'sergent',200,{cour:30}],
 ['a3','army',3,'소위·중위',null,'lieutenant',1100,{cour:35},()=>T()>=1789.25||noble()],
 ['a4','army',4,'대위',null,'capitaine',2400,{cour:40,soc:25}],
 ['a5','army',5,'대령·여단장',null,'colonel / chef de brigade',7000,{cour:50,soc:35,fame:20}],
 ['a6','army',6,'장군',null,'général de division',15000,{cour:55,soc:40,fame:40}],
 ['a7','army',7,'제국 원수',null,'maréchal d’Empire',40000,{cour:60,soc:50,fame:70},()=>T()>=1804.25],
 ['p1','pol',1,'시정 위원',null,'officier municipal',600,{fame:10},()=>T()>=1790],
 ['p2','pol',2,'시장',null,'maire',1500,{fame:25,soc:35},()=>T()>=1790],
 ['p3','pol',3,'의원',null,'député',6500,{},()=>T()>=1789],
 ['p4','pol',4,'파견의원·위원',null,'représentant en mission',6500,{},()=>T()>=1792.5],
 ['p5','pol',5,'원로원 의원',null,'sénateur',30000,{},()=>T()>=1799.75],
 ['w1','letters',1,'가정교사','가정교사','précepteur / gouvernante',400,{edu:40}],
 ['w2','letters',2,'문필가','살롱 안주인','homme de lettres / salonnière',600,{edu:50}],
 ['w3','letters',3,'신문 발행인',null,'journaliste',2500,{edu:55,fame:15},()=>T()>=1789.25],
 ['m1','med',1,'의학생','산파 수련생','étudiant en médecine / élève sage-femme',0,{edu:35}],
 ['m2','med',2,'외과의','산파','chirurgien / sage-femme',800,{edu:40}],
 ['m3','med',3,'의사',null,'docteur en médecine',2500,{edu:60}],
 ['m4','med',4,'병원 의사·의학 교수',null,'médecin des hôpitaux / professeur',6000,{edu:65,fame:30}],
 ['m5','med',5,'궁정 시의',null,'premier médecin du Roi / de l’Empereur',20000,{edu:70,fame:55,soc:50}],
 ['w4','letters',4,'아카데미 회원',null,'académicien',3000,{edu:70,fame:45},()=>T()<1793.5||T()>=1795.75]
];
const POST={};PL.forEach(([id,tr,t,n,nf,fr,pay,need,ok])=>POST[id]={id,tr,t,n,nf,fr,pay,need:need||{},ok:ok||(()=>true)});
function pname(p){return (isM()||!p.nf)?p.n:p.nf}
function canSex(p){return isM()||!!p.nf}
function meets(p,quiet){const n=p.need;if(!canSex(p)||!p.ok())return false;
  if(p.tr==='law'&&!isM())return false;if(p.tr!=='farm'&&p.tr!=='craft'&&p.tr!=='army'&&!lit())return false;
  if(s.faithKind!=='catholic'&&(p.tr==='church'||(T()<1789.5&&(p.tr==='law'||(p.tr==='army'&&p.t>=3)))))return false;
  for(const k of ['edu','soc','cour','faith','fame'])if(n[k]&&(k in s.st?s.st[k]:s[k])<n[k])return false;
  if(n.money&&s.money<n.money)return false;if(n.cost&&s.money<n.cost)return false;if(n.land&&s.land<n.land)return false;return true}
function needText(p){const n=p.need,o=[];for(const k of ['edu','soc','cour','faith','fame'])if(n[k])o.push(`${FXN[k]} ${n[k]}`);
  if(n.cost)o.push(`비용 ${fmt(n.cost)}`);if(n.money)o.push(`재산 ${fmt(n.money)}`);if(n.land)o.push(`지대 수입 ${fmt(n.land)}`);return o.join(', ')}
function takeJob(id,pre=''){const p=POST[id];if(s.job)closeJob();if(p.need.cost)s.money-=p.need.cost;s.job=id;s.jobSince=s.year;
  s.hist.push({id,n:pname(p),y0:s.year,y1:null,age:s.age});s.best[p.tr]=Math.max(s.best[p.tr]||0,p.t);
  say(`${pre}${jo(pname(p),'이','가')} 되었다.`+(p.need.cost?` (재산 -${fmt(p.need.cost)})`:''),'big')}
function closeJob(){const h=s.hist[s.hist.length-1];if(h&&h.y1==null)h.y1=s.year}
function loseJob(why){if(!s.job)return;closeJob();const n=pname(job());s.prevJob=s.job;s.job=null;if(why)say(why.replace('%',n),'big')}

/* ================= 기록 ================= */
let shown=0,sheetLive=false;
function L(t,k='ev',d){s.log.push({t,k,a:s.age,m:s.month,d});flushLog()}
function say(t,k='ev'){L(t,k);if(sheetLive)shText(t,k==='big'||k==='dark'?'q b':'q')}
const BAD=new Set(['혐의']);
function fx(o){const parts=[];for(const k in o){let n=o[k];if(typeof n==='function')n=n();if(!n)continue;
  if(k==='edu'&&n>0){if(trait('계몽'))n=Math.round(n*1.4)+0;if(!lit())n=Math.min(n,Math.max(0,25-s.st.edu))}
  if(k==='cour'&&n>0&&trait('열정'))n=Math.round(n*1.4);
  if(k==='soc'&&n>0&&trait('쾌활'))n=Math.round(n*1.3);
  if(k==='sus'&&n>0&&trait('열정'))n=Math.round(n*1.25);
  if(k==='sus'&&n>0&&trait('신중'))n=Math.max(1,Math.round(n*.75));
  if(k in s.st&&n>0&&k!=='hp'){const g=n*(1-s.st[k]/125);n=Math.max(g>0?1:0,Math.floor(g)+(R()<g%1?1:0))}
  if(k==='fame'&&n>0){const g=n*(1-s.fame/150);n=Math.max(1,Math.round(g))}
  if(!n)continue;
  if(k in s.st)s.st[k]=clamp(s.st[k]+n,0,100);
  else if(k==='money'){if(n<0)n=-Math.min(s.money,-n);if(!n)continue;s.money+=n}
  else if(k==='pol')s.pol=clamp(s.pol+n,-100,100);
  else s[k]=clamp(s[k]+n,0,100);
  if(k==='money')parts.push(`재산 ${n>0?'+':''}${fmt(n)}`);
  else if(k==='pol')parts.push(n>0?`급진 +${n}`:`보수 +${-n}`);
  else parts.push(FXN[k]+(n>0?' +':' ')+n)}
  return parts.length?' ('+parts.join(', ')+')':''}

/* ================= 판정 ================= */
function md(list){let m=0;const up=[],dn=[];for(const [c,d,l] of list){if(c){m+=d;if(l)(d>0?up:dn).push(l)}}
  m=clamp(m,-2,2);return {m,why:[up.length?'유리: '+up.join(', '):'',dn.length?'불리: '+dn.join(', '):''].filter(Boolean).join(' / ')}}
const RES=['','대실패','실패','보통','보통','성공','대성공'];
async function roll(mod,o={}){let m=mod,why=o.why||'';
  if(s.flags.blessed){m+=1;s.flags.blessed=false;why=(why?why+' / ':'')+'성유물의 가호'}
  m=clamp(m,-2,2);const n=1+Math.abs(m);const f=Array.from({length:n},()=>ri(1,6));const v=m>=0?Math.max(...f):Math.min(...f);
  const r={f,v,m};
  L(`${o.label||'판정'} — 주사위 ${f.join('·')} → ${v} ${RES[v]}${why?` (${why})`:''}`,'dice',{f,v});return r}
// 역사 통계에 따른 확률 추첨. true = 그 일이 일어난다.
async function chance(p,label,why){p=clamp(p,0,1);const hit=R()<p;
  L(`${label} ${Math.round(p*1000)/10}% → ${hit?'일어났다':'피했다'}${why?` · ${why}`:''}`,'dice');return hit}
