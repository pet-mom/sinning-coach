/* ================= 인물의 지표: 숙련 · 평판 · 영향력 · 신념 · 관계 · 지역 경제 =================
   핵심 능력치 5개는 s.st {hp 건강, edu 학식, soc 사교, dex 기술, str 체력}. 의지(s.st.cour)는 '신념 및 의지'에 속한다.
   fx()는 아래 키를 모두 받는다.
   숙련  orat 웅변 · pen 글씨·문서 · craft 수공 · sew 바느질 · draw 그림 · music 악기 · print 인쇄 · heal 외과 손기술 · trade 장사 · farm 농사 · arms 무예 · ride 승마
   평판  rfam 가족 · rloc 이웃 · rguild 동업자 · rpeople 민중 · relite 상류사회   (0~100, 50 보통)
   신념  brg 정치 체제 · bor 사회 질서 · bch 변화의 방식 · bpw 권력 구조 · brl 종교와 국가   (-100~+100)
   가치  vlib 자유 · veq 평등 · vhon 명예 · vfam 가족 · vord 질서 · vjus 정의   (0~100)
   영향력 inf (쌓아 온 영향력. 공직·파벌·인맥·재산·대중의 지지·정권과의 관계와 합쳐 계산한다) */
const SKILLS=[['orat','웅변','soc'],['pen','글씨·문서','dex'],['craft','수공 솜씨','dex'],['sew','바느질·재봉','dex'],['draw','그림','dex'],['music','악기','dex'],['print','인쇄','dex'],['heal','외과 손기술','dex'],['trade','장사·셈','soc'],['farm','농사일','str'],['arms','무예','str'],['ride','승마','str']];
const REPG=[['rfam','가족'],['rloc','이웃·고을'],['rguild','동업자'],['rpeople','민중'],['relite','상류사회']];
const BELIEF=[['brg','정치 체제','왕정','공화정'],['bor','사회 질서','신분 특권','법적 평등'],['bch','변화의 방식','점진 개혁','급진 변화'],['bpw','권력 구조','중앙집권','지방 자치'],['brl','종교와 국가','긴밀한 결합','분리']];
const VALUES=[['vlib','자유'],['veq','평등'],['vhon','명예'],['vfam','가족'],['vord','질서'],['vjus','정의']];
SKILLS.forEach(([k,n])=>FXN[k]=n);REPG.forEach(([k,n])=>FXN[k]='평판('+n+')');BELIEF.forEach(([k,n])=>FXN[k]=n);VALUES.forEach(([k,n])=>FXN[k]='가치('+n+')');
const SKK=new Set(SKILLS.map(x=>x[0])),REPK=new Set(REPG.map(x=>x[0])),BELK=new Set(BELIEF.map(x=>x[0])),VALK=new Set(VALUES.map(x=>x[0]));
// fx()가 부르는 확장 키 처리. 처리했으면 실제 바뀐 양, 아니면 null.
function fxAttr(k,n){
  if(SKK.has(k)){const v=s.sk[k]||0;if(n>0){const g=n*(1-v/120);n=Math.max(1,Math.floor(g)+(R()<g%1?1:0))}const nv=clamp(v+n,0,100);n=nv-v;s.sk[k]=nv;return n}
  if(REPK.has(k)){const v=s.rep[k];const nv=clamp(v+n,0,100);s.rep[k]=nv;return nv-v}
  if(BELK.has(k)){const v=s.bel[k];const nv=clamp(v+n,-100,100);s.bel[k]=nv;return nv-v}
  if(VALK.has(k)){const v=s.val[k];const nv=clamp(v+n,0,100);s.val[k]=nv;return nv-v}
  if(k==='inf'){const v=s.inf0||0;const nv=clamp(v+n,0,40);s.inf0=nv;return nv-v}
  return null}

/* ---------- 새 인생 · 옛 저장 맞추기 ---------- */
function attrsInit(o){const E=o.estate,nb=ESTATES[E].noble;
  o.st.dex=ri(4,10);o.st.str=ri(6,14);
  o.sk={};SKILLS.forEach(([k])=>o.sk[k]=0);
  o.rep={rfam:60,rloc:50,rguild:50,rpeople:50,relite:nb?55:E==='bourgeois'?45:35};
  const p=o.pol;
  o.bel={brg:clamp(p-30+ri(-10,10),-100,100),bor:clamp((nb?-55:E==='bourgeois'?15:E==='artisan'?10:0)+ri(-12,12),-100,100),bch:clamp(Math.round(p*.8)+ri(-15,15),-100,100),
    bpw:clamp((o.region==='paris'?-10:12)+ri(-20,20),-100,100),brl:clamp((o.faith>=65?-45:o.faith<40?10:-20)+(o.faithKind!=='catholic'?40:0)+ri(-10,10),-100,100)};
  o.val={vlib:ri(30,50),veq:ri(30,50),vhon:ri(30,50),vfam:ri(40,60),vord:ri(35,55),vjus:ri(35,55)};
  if(nb){o.val.vhon+=20;o.val.vord+=10;o.val.veq-=15}
  if(E==='bourgeois'){o.val.vlib+=12;o.val.vjus+=5}
  if(E==='artisan'){o.val.veq+=10;o.val.vjus+=8}
  if(E==='peasant'){o.val.vfam+=15;o.val.vord+=5}
  o.rel=[];o.frel={};o.inf0=0;o.econ=null;o.econPrev=null;return o}
// 이전 판의 저장(능력치 4개)을 새 판으로 옮긴다
function attrsMigrate(o){if(!o)return o;if(o.sk&&o.rep&&o.bel)return o;
  const base={estate:o.estate,region:o.region,pol:o.pol,faith:o.faith,faithKind:o.faithKind,st:o.st};attrsInit(base);
  o.st.dex=o.st.dex??clamp(base.st.dex+Math.min(o.age,18)*1.5,0,100);o.st.str=o.st.str??clamp(base.st.str+Math.min(o.age,18)*2.4,0,100);
  for(const k of ['sk','rep','bel','val','rel','frel','inf0','econ','econPrev'])if(o[k]==null)o[k]=base[k];return o}

/* ---------- 해마다 ---------- */
// 직업 트랙이 기르는 숙련
const TRACK_SK={farm:{farm:3,str:1},craft:{craft:3,dex:1},law:{pen:3,orat:2},church:{orat:2,pen:1},med:{heal:3,dex:1},army:{arms:3,str:1},pol:{orat:3},letters:{pen:3}};
function mainSkill(){const j=job();if(j){if(j.tr==='craft'&&j.t>=4)return 'trade';if(j.tr==='craft'&&!isM()&&j.t<=3)return 'sew';const t=TRACK_SK[j.tr];if(t)return Object.keys(t).find(k=>SKK.has(k))}
  let best='craft',bv=-1;for(const [k] of SKILLS)if(s.sk[k]>bv){bv=s.sk[k];best=k}return best}
function grow(k,n){if(k in s.st)s.st[k]=clamp(s.st[k]+n,0,100);else if(SKK.has(k))s.sk[k]=clamp((s.sk[k]||0)+Math.max(n>0?1:n,Math.round(n*(1-(s.sk[k]||0)/120))),0,100)}
function childGrowth(){const a=s.age,f=isM()?1:.8;
  if(a>=2&&a<=18){grow('str',Math.round((ri(2,3)+(a>=8&&['peasant','artisan'].includes(s.estate)?1:0))*f));grow('dex',ri(0,2))}
  if(a>=7&&a<14){if(s.estate==='peasant')grow('farm',ri(2,4));if(s.estate==='artisan')grow('craft',ri(1,3));if(!isM())grow('sew',ri(2,4));
    if(noble()&&a>=10){if(isM()){grow('ride',ri(2,4));grow('arms',ri(2,4))}else{grow('music',ri(2,4));grow('draw',ri(1,3))}}
    if(lit())grow('pen',ri(1,3))}}
function attrsYear(pl){if(child()){childGrowth();return}
  const away=s.cond!=='normal';const j=job();
  if(j&&!away){const t=TRACK_SK[j.tr]||{};for(const k in t)if(R()<.75)grow(k,t[k]);
    if(j.tr==='craft'&&j.t>=4)grow('trade',2);if(j.tr==='craft'&&!isM()&&j.t<=3)grow('sew',2);if(j.tr==='army'&&j.t>=3)grow('ride',2);if(j.tr==='med'&&j.t>=3)grow('orat',1)}
  if(s.age>=14&&s.age<20&&!away)grow('str',isM()?ri(0,2):ri(0,1));
  if(pl==='수련'){grow('dex',2);grow(mainSkill(),3)}
  if(pl==='단련'){grow('str',3);grow('hp',1)}
  if(s.age>=40)grow('str',s.age>=55?-2:-1);if(s.age>=60)grow('dex',-1);if(s.st.hp<30)grow('str',-1);
  if(s.cond==='prison'){grow('str',-2);grow('dex',-1)}
  // 평판은 해마다 조금씩 보통으로 돌아온다
  for(const [k] of REPG)s.rep[k]=Math.round(s.rep[k]+(50-s.rep[k])*.06);
  if(s.sus>=50)s.rep.rloc=clamp(s.rep.rloc-2,0,100);
  s.inf0=Math.round((s.inf0||0)*.9)}

/* ---------- 신앙 ---------- */
function faithLabel(){const k={catholic:'가톨릭',protestant:'개신교(위그노)',jewish:'유대교'}[s.faithKind]||'가톨릭';const f=s.faith;
  let m=f>=70?'독실한 신자':f>=40?'관습을 따르는 신자':f>=20?'신앙이 식은 신자':'믿음을 잃은 사람';
  if(s.faithKind==='catholic'&&f>=35&&(s.flags.anticler||s.bel.brl>=45))m='성직자와 갈등하는 신자';
  if(priest()||nun())m=f>=50?(s.flags.refractory?'선서 거부 성직자':s.flags.juror?'선서 성직자':'성직자'):'흔들리는 성직자';
  return `${k} · ${m}`}

/* ---------- 평판: 집단마다 다른 평가 ---------- */
function repWord(k){const v=s.rep[k],j=job();
  if(k==='rfam')return v>=70?(isM()?'믿음직한 아들·가장':'믿음직한 딸·안주인'):v<=30?'집안의 골칫거리':'평범한 식구';
  if(k==='rloc')return v>=70?'성실한 이웃':v<=30?(s.sus>=40?'수상한 사람':'고을의 골칫거리'):'이웃';
  if(k==='rguild'){if(!j)return v>=70?'존경받는 사람':v<=30?'믿을 수 없는 사람':'—';
    const w={farm:'일 잘하는 농군',craft:j.t>=4?'믿을 만한 상인':'유능한 장인',law:'믿을 만한 법률가',church:'좋은 목자',med:'솜씨 좋은 의사',army:'용감한 군인',pol:'노련한 정치가',letters:'이름난 문필가'}[j.tr]||'유능한 사람';
    return v>=70?w:v<=30?{farm:'게으른 일꾼',craft:'솜씨 없는 일꾼',law:'엉터리 법률가',church:'평판 나쁜 성직자',med:'돌팔이',army:'겁쟁이',pol:'배신자',letters:'삼류 글쟁이'}[j.tr]||'무능한 사람':'동료'}
  if(k==='rpeople')return v>=70?(s.pol>=30?'민중의 벗':'인심 좋은 분'):v<=30?(noble()?'인민의 적':'인색한 사람'):'—';
  if(k==='relite')return v>=70?'훌륭한 신사·숙녀':v<=30?(s.pol>=30?'위험한 선동가':'촌뜨기'):'—';return ''}

/* ---------- 정치적 영향력 ---------- */
function regimeFit(){const e=era().k;let r=0;
  if(noble())r+=e==='ancien'?(s.estate==='epee'?10:s.estate==='robe'?6:2):['republic','directory'].includes(e)?-10:e==='restoration'?6:e==='constit'?0:-2;
  if(s.estate==='bourgeois'&&['constit','directory','consulate','empire','july'].includes(e))r+=3;
  if(priest()){r+=e==='ancien'||e==='restoration'?4:e==='republic'?-8:0}
  if(s.flags.refractory&&['constit','republic','directory'].includes(e))r-=5;
  if(s.flags.regicide&&e==='restoration')r-=10;
  if(s.flags.bonap&&(e==='consulate'||e==='empire'))r+=4;
  if(s.cond!=='normal')r-=15;return r}
const OFFICE={pol:[0,8,16,30,38,45],law:[0,2,6,12,20,30,40],church:[0,1,4,8,14,25],army:[0,1,2,5,10,18,26,32],letters:[0,2,5,12,14],med:[0,1,2,4,8,12],craft:[0,0,1,2,4,8,14],farm:[0,0,1,2,4,6]};
function influence(){const b=[],j=job();
  if(j&&s.cond==='normal'){const o=(OFFICE[j.tr]||[])[j.t]||0;if(o)b.push(['공직·직책',o])}
  if(s.party){const o=Math.round([2,5,10,18][s.prank]*(partyFit()>0?1.5:partyFit()<0?.5:1));b.push(['파벌 내 지위',o])}
  const rl=(s.rel||[]).filter(r=>r.alive);const net=Math.min(12,rl.filter(r=>r.role==='후원자'&&r.close>=50).length*4+rl.filter(r=>r.close>=65&&r.inf>=25).length*2);if(net)b.push(['인맥',net]);
  const w=s.money+s.land*20;const mw=w>=200000?12:w>=50000?8:w>=10000?4:w>=2000?1:0;if(mw)b.push(['재산',mw]);
  const pop=Math.round(Math.max(0,s.rep.rpeople-50)*.25+s.fame*.08);if(pop)b.push(['대중의 지지',pop]);
  const rg=regimeFit();if(rg)b.push(['정권과의 관계',rg]);
  if(s.inf0)b.push(['쌓아 온 영향력',s.inf0]);
  return {v:clamp(Math.round(b.reduce((a,x)=>a+x[1],0)),0,100),b}}

/* ---------- 신념 ---------- */
function belWord(k){const v=s.bel[k],B=BELIEF.find(x=>x[0]===k);return Math.abs(v)<15?'중간':v<0?B[2]+(v<=-55?' (강하게)':''):B[3]+(v>=55?' (강하게)':'')}
function topValues(n=2){return VALUES.slice().sort((a,b)=>s.val[b[0]]-s.val[a[0]]).slice(0,n).map(x=>x[1])}
// 강령을 밝히면 해당 신념 축이 그쪽으로 기운다
const STANCE_AX={crown:'brg',vote:'bor',prop:'bor',church:'brl',econ:'bch',justice:'bch'};
function stanceBelief(id,v){const ax=STANCE_AX[id];if(!ax)return;const tgt=id==='church'?(v>=20?60:-55):v;s.bel[ax]=clamp(Math.round(s.bel[ax]+(tgt-s.bel[ax])*.25),-100,100)}

/* ---------- 파벌 사이의 관계 ---------- */
// 기본은 성향 거리로 정하고, 실제로 갈라서거나 손잡은 시기는 따로 적는다
const FREL=[['jacobin','girondin',tm(1792,4),tm(1794,1),-80],['jacobin','feuillant',tm(1791,7),tm(1792,9),-70],['jacobin','cordelier',tm(1793,12),tm(1794,4),-60],['jacobin','indulgent',tm(1793,12),tm(1794,5),-60],
 ['jacobin','cordelier',tm(1790,4),tm(1793,12),40],['thermidor','jacobin',tm(1794,8),1900,-90],['thermidor','babeuf',tm(1795,10),1900,-85],['thermidor','royalist',tm(1795,9),1900,-60],['clichy','neojacobin',tm(1797,1),1900,-80],
 ['bonapartist','royalist',tm(1799,11),1900,-80],['bonapartist','ideologue',tm(1802,1),1900,-30],['ultra','doctrinaire',tm(1815,7),1900,-35],['ultra','bonapartist',tm(1814,4),1900,-85],['republican','legitimist',tm(1830,8),1900,-70],
 ['patriote','absolutist',tm(1788,9),1900,-80],['monarchien','patriote',tm(1789,9),1900,-40],['philosophe','devot',1750,1900,-60],['parlement','devot',1750,1900,-30]];
function facPair(a,b,t=T()){if(a===b)return 100;for(const [x,y,f,u,v] of FREL)if(((x===a&&y===b)||(x===b&&y===a))&&t>=f&&t<u)return v;
  return clamp(Math.round(60-Math.abs(FAC[a].pol-FAC[b].pol)*1.2),-100,100)}
function frelOf(id){return (s.frel&&s.frel[id])||0}
function frelAdd(id,n){s.frel=s.frel||{};s.frel[id]=clamp(Math.round((s.frel[id]||0)+n),-100,100)}
function frelWord(v){return v>=50?'깊은 신뢰':v>=20?'신뢰':v<=-50?'적대':v<=-20?'경계':'무관'}
// 파벌에 들거나 떠날 때, 강령을 밝힐 때
function frelJoin(id){frelAdd(id,30);activeFactions().forEach(f=>{if(f.id!==id)frelAdd(f.id,facPair(id,f.id)*.2)});
  const fp=FAC[id].pol;if(fp>=45){fxAttr('rpeople',4);fxAttr('relite',-4)}else if(fp<=-40){fxAttr('relite',4);fxAttr('rpeople',-4)}
  (s.rel||[]).filter(r=>r.alive&&r.fac&&r.fac!==id&&facPair(id,r.fac)<=-50).forEach(r=>{r.close=clamp(r.close-10,0,100);L(`${r.n}${bat(r.n)?'은':'는'} ${FAC[r.fac].n} 사람이다. 사이가 서먹해졌다.`,'sys')})}
function frelStance(id,v){activeFactions().forEach(f=>{const k=ISSUES.findIndex(x=>x.id===id);const th=f.st[k];if(th==null||th<0)return;frelAdd(f.id,ISSUES[k].opts[th][1]===v?3:-2)})}

/* ---------- 사람 사이의 관계 ---------- */
// r = {n 이름, role 관계, sex, fac 소속 파벌, close 친밀도, trust 신뢰, resp 존경, riv 경쟁심, y 만난 해, alive, v 그가 중히 여기는 가치, inf 그의 영향력, tr 직업 트랙}
const ROLEN=['친구','스승','동료','후원자','연인','경쟁자'];
const relsAlive=()=>(s.rel||[]).filter(r=>r.alive);
function addRel(role,o={}){s.rel=s.rel||[];if(relsAlive().length>=12)return null;
  const sex=o.sex||(role==='연인'?(isM()?'F':'M'):(role==='친구'&&!isM()?(R()<.8?'F':'M'):R()<.8?'M':'F'));const n=o.n||(sex==='M'?person():woman());
  const r={n,role,sex,fac:o.fac||null,close:o.close??ri(40,60),trust:o.trust??ri(35,60),resp:o.resp??ri(30,60),riv:o.riv??(role==='경쟁자'?ri(50,75):ri(0,15)),y:s.year,alive:true,
    v:o.v||pick(VALUES)[0],inf:o.inf??(role==='후원자'?ri(30,70):ri(0,25)),tr:o.tr||(job()?job().tr:null),w:o.w||''};
  s.rel.push(r);return r}
function relFx(r,o){const parts=[];for(const [k,lab] of [['close','친밀'],['trust','신뢰'],['resp','존경'],['riv','경쟁심']])if(o[k]){r[k]=clamp(r[k]+o[k],0,100);parts.push(`${lab} ${o[k]>0?'+':''}${o[k]}`)}return parts.length?` (${r.n}: ${parts.join(', ')})`:''}
const patron=()=>relsAlive().find(r=>r.role==='후원자'&&r.close>=55&&r.trust>=50);
const rival=()=>relsAlive().find(r=>r.role==='경쟁자'&&r.riv>=60&&(!r.tr||!job()||r.tr===job().tr));
// 그의 가치관에 내 처신이 맞는가: -1 · 0 · +1
function relJudge(r){const b=s.bel;return r.v==='vord'?(b.bch>=40||s.sus>=40?-1:b.bch<=-10?1:0):r.v==='veq'?(b.bor>=30?1:b.bor<=-30?-1:0):r.v==='vlib'?(b.brl>=20||b.brg>=20?1:0):r.v==='vhon'?(s.rep.relite>=60?1:s.rep.relite<=30?-1:0):r.v==='vfam'?(s.married?1:0):r.v==='vjus'?(s.rep.rloc>=60?1:0):0}
async function relTick(){if(child()||s.cond==='prison')return;const rl=relsAlive();
  // 새로 만나는 사람
  const ctx=[];
  if(inSchool(['college','univ','seminary','convent']))ctx.push(['친구',.35,'동창'],['스승',.15,'선생']);
  if(job()&&s.cond==='normal'){ctx.push(['동료',.22,'일터'],['경쟁자',trait('야심')?.2:.1,'일터']);if(job().t>=2)ctx.push(['후원자',.12+(s.st.soc>=55?.08:0),'윗사람'])}
  if(s.party)ctx.push(['동료',.25,'파벌']);
  if(!s.married&&s.age>=16&&s.age<=32&&!priest()&&!nun())ctx.push(['연인',.12+(s.st.soc>=50?.05:0),'']);
  if(!rl.some(r=>r.role==='친구'))ctx.push(['친구',.3,'이웃']);
  for(const [role,p,w] of ctx){if(rl.filter(r=>r.role===role).length>=(role==='동료'?3:2))continue;if(R()<p){const r=addRel(role,{w,fac:w==='파벌'?s.party:null});if(r)L(`${w==='파벌'?FAC[s.party].n+'에서 ':w==='동창'?'학교에서 ':w==='선생'?'':w==='윗사람'?'':w==='일터'?'일터에서 ':''}${r.n}${bat(r.n)?'과':'와'} ${role==='연인'?'가까워졌다':role==='경쟁자'?'맞수가 되었다':role==='후원자'?'연이 닿아 그가 뒤를 봐주기로 했다':role==='스승'?'스승으로 모시게 되었다':'알게 되었다'}.`,'sys');break}}
  // 정치의 계절: 지인들도 파벌을 고른다
  if(T()>=1789.5)relsAlive().filter(r=>!r.fac&&R()<.25).forEach(r=>{const fs=activeFactions();if(fs.length)r.fac=pick(fs).id});
  relsAlive().forEach(r=>{if(r.fac&&FAC[r.fac]&&T()>=FAC[r.fac].b)r.fac=SUCC[r.fac]||null});
  // 죽음과 멀어짐
  for(const r of relsAlive()){if(R()<(r.role==='스승'||r.role==='후원자'?.05:.025)){r.alive=false;L(`${r.role} ${r.n}${bat(r.n)?'이':'가'} 세상을 떠났다.`,r.close>=60?'ev':'sys');if(r.close>=60)fx({hp:-1})}
    else if(r.close<15&&r.role!=='경쟁자'&&R()<.5){r.alive=false;L(`${r.n}${bat(r.n)?'과':'와'}는 연락이 끊겼다.`,'sys')}}
  // 한 해의 사귐
  const live=relsAlive();if(live.length&&R()<.7)await relEvent(pick(live))}
async function relEvent(r){const j=relJudge(r);const roleS=`${r.role} ${r.n}`;
  if(r.role==='경쟁자'){if(R()<.5){say(`맞수 ${r.n}${bat(r.n)?'이':'가'} 뒤에서 험담을 퍼뜨렸다.`+fx({rguild:-3})+relFx(r,{riv:4}))}
    else{const i=await Q('맞수',`rivalité`,`${r.n}${bat(r.n)?'과':'와'} 같은 자리를 두고 겨루게 되었다.`,[{l:'정면으로 겨룬다',s:'기술·사교 판정',a:'bold work'},{l:'손을 내밀어 화해한다',s:'',a:'social safe'}]);
      if(i===0){const r2=await roll(md([[s.st.dex>=50||s.st.edu>=55,1,'실력'],[s.st.soc>=50,1,'사교'],[!!patron(),1,'후원자']]).m,{label:'경쟁'});say(r2.v>=4?`${r.n}${bat(r.n)?'을':'를'} 눌렀다.`+fx({rguild:4,fame:1})+relFx(r,{riv:6,resp:5}):`${r.n}에게 밀렸다.`+fx({rguild:-2})+relFx(r,{riv:3}))}
      else say(`${r.n}${bat(r.n)?'과':'와'} 술잔을 나누었다. 앙금이 조금 풀렸다.`+relFx(r,{riv:-20,close:12,trust:5}));await done()}return}
  if(r.role==='연인'){if(s.married){r.role='친구';return}
    const i=await Q('연정',`amour`,`${r.n}${bat(r.n)?'이':'가'} 몰래 편지를 보냈다. 집안끼리는 아직 아무 말이 없다.`,[{l:'마음을 받아들인다',s:'친밀 +',a:'family'},{l:'거리를 둔다',s:'',a:'safe'}]);
    if(i===0)say(`${r.n}${bat(r.n)?'과':'와'} 성당 뒤 산책길에서 만나기 시작했다.`+fx({rfam:noble()?-2:0})+relFx(r,{close:15,trust:8}));else say('답장을 쓰지 않았다.'+relFx(r,{close:-15}));await done();return}
  if(r.role==='후원자'){if(j<0){say(`후원자 ${r.n}${bat(r.n)?'은':'는'} 그대의 처신이 못마땅하다는 말을 흘렸다.`+relFx(r,{trust:-8,close:-5}));return}
    const i=await Q('후원자의 부탁',`protection`,`${r.n}${bat(r.n)?'이':'가'} 그의 일을 거들어 달라고 한다. 시간과 돈이 든다.`,[{l:'기꺼이 돕는다',s:'재산 -50, 신뢰 +',a:'social work'},{l:'핑계를 대고 빠진다',s:'',a:'safe'}]);
    if(i===0)say(`${r.n}의 일을 도왔다. 그는 그대를 잊지 않겠다고 했다.`+fx({money:-50,inf:2})+relFx(r,{trust:12,close:8}));else say('그는 아무 말도 하지 않았다.'+relFx(r,{trust:-10}));await done();return}
  if(r.role==='스승'){say(`${roleS}에게서 ${pick(['책 몇 권을 빌렸다','편지로 조언을 받았다','손수 고친 원고를 돌려받았다'])}.`+fx({edu:1})+relFx(r,{resp:4,close:3}));return}
  // 친구 · 동료
  const pool=[
    ()=>say(`${roleS}${bat(r.n)?'과':'와'} ${pick(['장터 선술집에서 밤늦도록 이야기했다','함께 성인 축일 축제에 갔다','사냥을 나갔다','카페에서 신문을 같이 읽었다','이사를 거들었다'])}.`+relFx(r,{close:6})),
    ()=>say(`${r.n}${bat(r.n)?'이':'가'} 집안의 비밀을 털어놓았다.`+relFx(r,{trust:8,close:4})),
    ()=>say(`${r.n}${bat(r.n)?'과':'와'} ${pick(['돈 문제로','정치 이야기로','여자(남자) 문제로','하찮은 일로'])} 크게 다투었다.`+relFx(r,{close:-12,riv:5})),
    ()=>{if(j>0)say(`${r.n}${bat(r.n)?'은':'는'} 그대가 ${VALUES.find(x=>x[0]===r.v)[1]}${bat(VALUES.find(x=>x[0]===r.v)[1])?'을':'를'} 지키는 사람이라며 치켜세웠다.`+fx({rloc:1})+relFx(r,{resp:8}));else if(j<0)say(`${r.n}${bat(r.n)?'은':'는'} 그대의 요즘 처신을 탐탁지 않아 한다.`+relFx(r,{resp:-8,close:-4}));else say(`${r.n}${bat(r.n)?'과':'와'} 편지를 주고받았다.`+relFx(r,{close:3}))},
    ()=>{if(s.money<50&&r.close>=55)say(`살림이 어렵다는 말을 듣고 ${r.n}${bat(r.n)?'이':'가'} 돈을 꾸어 주었다.`+fx({money:ri(30,80)})+relFx(r,{trust:5}));
      else say(`${r.n}의 아이 세례식에 ${isM()?'대부':'대모'}로 섰다.`+fx({rloc:1})+relFx(r,{close:8,trust:4}))}];
  pick(pool)()}
// 아는 사람의 파벌이 몰락할 때: 숨겨 줄 것인가
async function relPurge(id){const r=relsAlive().find(x=>x.fac===id&&x.close>=45);if(!r||s.cond!=='normal'||child()||s.party===id)return;
  const i=await Q('숨겨 달라는 부탁',`asile`,`${FAC[id].n}${bat(FAC[id].n)?'이':'가'} 무너지자 ${r.role} ${r.n}${bat(r.n)?'이':'가'} 밤중에 찾아왔다. 며칠만 숨겨 달라고 한다.`,[
    {l:'다락에 숨겨 준다',s:'혐의 +, 친밀·신뢰 크게 +',a:'bold family'},{l:'돈을 쥐여 보내고 문을 닫는다',s:'재산 -60',a:'safe'},{l:'구 위원회에 알린다',s:'혐의 -, 관계 끝',a:'radical'}]);
  if(i===0){const caught=await chance(inTerror()?.15:.06,'발각','숨겨 준 사람이 들킨 비율');
    if(caught){say(`가택 수색에서 ${r.n}${bat(r.n)?'이':'가'} 붙잡혔다. 그대도 공범으로 의심받는다.`+fx({sus:20,rloc:-3}),'big');r.alive=R()<.5}
    else say(`${r.n}${bat(r.n)?'은':'는'} 열흘 뒤 몰래 길을 떠났다. 평생 이 일을 잊지 않을 것이다.`+fx({sus:5})+relFx(r,{close:25,trust:30,resp:15}),'big')}
  else if(i===1){say(`${r.n}에게 돈을 쥐여 보냈다.`+fx({money:-60})+relFx(r,{close:-10,trust:-5}))}
  else{say(`${r.n}${bat(r.n)?'을':'를'} 고발하였다. 이웃들은 그대를 다른 눈으로 본다.`+fx({sus:-10,rloc:-6,pol:4}),'dark');r.alive=R()<.3;r.close=0;r.trust=0;r.role='경쟁자'}
  await done()}

/* ---------- 지역 경제 ---------- */
// 물가·임금·일자리·물자 공급·화폐 가치. 파리 · 지방 도시 · 농촌을 따로 해마다 새로 계산한다.
const AREA=()=>loc()==='paris'?'paris':urban()?'city':'rural';
const AREAN={paris:'파리',city:'지방 도시',rural:'농촌'};
// 지폐(아시냐, 1796년 토지 증권)의 금속 화폐 대비 가치. 1797년 2월 정화 복귀.
const CUR={1790:.95,1791:.84,1792:.68,1793:.45,1794:.34,1795:.06,1796:.01};
// 일자리 충격: 1786년 영불 통상조약 뒤 직물업 불황(1787~89), 1795 기근, 1811 금융 위기, 1816~17 흉년, 1827~32 불황, 1846~48 위기
const JOBS={1787:-10,1788:-20,1789:-30,1790:-15,1791:-5,1793:10,1794:5,1795:-15,1796:-10,1797:-5,1811:-20,1812:-15,1816:-10,1817:-15,1827:-10,1828:-15,1829:-15,1830:-25,1831:-20,1832:-10,1846:-10,1847:-25,1848:-30};
function econCalc(a,y){const pr=price(y);
  let p=pr*(a==='paris'?1.12:a==='city'?1.04:.95);
  if(y>=1793&&y<=1794&&a!=='rural')p*=.85; // 최고가격제
  let w=1;if(a==='rural'&&y>=1793&&y<=1799)w=1.25;else if(y>=1800&&y<1820)w=1.1;else if(y>=1820)w=1.15;if(a==='paris')w*=1.2;
  if(pr>=1.4&&a!=='rural')w*=.92;
  let jobs=70+(JOBS[y]||0)*(a==='rural'?.5:1);if(a!=='rural'&&atWar()&&y>=1793&&y<=1813)jobs+=5;
  let sup=100-(pr-1)*90;if(y>=1793&&y<=1794&&a!=='rural')sup-=15;if(y>=1807&&y<=1813&&REGIONS[loc()].port)sup-=12;if(y>=1793&&y<=1795&&a==='rural')sup-=8;
  return {y,a,price:Math.round(p*100)/100,wage:Math.round(w*100)/100,jobs:clamp(Math.round(jobs+ri(-5,5)),5,100),supply:clamp(Math.round(sup+ri(-5,5)),5,100),cur:CUR[y]||1}}
function econ(){const a=AREA();if(!s.econ||s.econ.y!==s.year||s.econ.a!==a){if(s.econ&&s.econ.y!==s.year)s.econPrev=s.econ;s.econ=econCalc(a,s.year)}return s.econ}
const wageEarner=()=>{const j=job();return !!j&&((j.tr==='farm'&&j.t<=2)||(j.tr==='craft'&&j.t<=2))};
function econWord(k,v){if(k==='price')return v>=1.6?'폭등':v>=1.3?'높음':v>=1.1?'조금 높음':v<=.9?'쌈':'보통';if(k==='wage')return v>=1.2?'좋음':v<=.95?'나쁨':'보통';if(k==='cur')return v>=.95?'안정':v>=.5?'하락':v>=.1?'폭락':'휴지 조각';return v>=75?'넉넉':v>=55?'보통':v>=35?'모자람':'심각'}
