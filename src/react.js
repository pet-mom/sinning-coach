/* ================= 주변 사람들의 반응 · 평판 · 정치 활동 =================
   1) reactAfter(opt): 결정 창에서 고른 선택지(opt.a 태그)를 보고 가족·이웃·동업자·민중·상류사회·본당 신부·
      아는 사람이 한두 마디 반응한다. 반응은 그 집단의 평판(s.rep), 공개 입장(pubPol())과 그들의 정치 성향의 거리,
      시대, 그 사람이 중히 여기는 가치(r.v)에 따라 달라진다.
   2) repMod(g) → -1/0/+1, crowd(g) → 그 집단의 태도를 한 문장으로. 장면의 md()·서술에 쓴다.
   3) PACTS.push: 시대별 정치 활동(구 총회·청원·혁명 축제·감시위원회·국민투표·카르보나리·바리케이드…)
   4) 해마다(conductYear 뒤): 공개 입장이 먼 사람과는 조금씩 멀어지고, 이웃의 시선은 동네 분위기를 따른다. */

// 시대 눈금: o 구체제 · r 혁명 초기 · t 공화국·공포정치 · d 테르미도르·총재정부 · e 통령·제국 · b 복고왕정 · j 7월 왕정
const RX_E='ortdebj';
function rxE(){const t=T();return t<tm(1789,5)?'o':t<tm(1792,8)?'r':t<tm(1794,8)?'t':t<tm(1799,11)?'d':t<tm(1814,4)?'e':(t>=tm(1815,3)&&t<tm(1815,7))?'e':t<tm(1830,8)?'b':'j'}
const rxI=()=>RX_E.indexOf(rxE());
function rxInit(){if(!s.rx)s.rx={q:null,t:-9,used:[],n:{},sp:null,spn:null,kp:{},aunt:null};return s.rx}
// 파리의 동네: 이름 · 1790~95년의 구(섹시옹) · 본당 · 시대별 동네 분위기(성향) · 이웃들
const RXQ={
 sant:{n:'생탕투안 문밖',sec:'캥즈뱅',par:'생트마르그리트',m:[0,45,80,40,15,35,55],nb:[['이웃 소목장 자크 영감',5],['아래층 과일 장수 마르그리트 아주머니',0],['건물 문지기 바르브 부인',-15],['맥줏집 단골 직인들',15]]},
 smar:{n:'생마르소 문밖',sec:'피니스테르',par:'생메다르',m:[0,40,75,40,10,30,55],nb:[['무두장이 이웃 루이',5],['비에브르 강가의 세탁부 잔',0],['고블랭 공방의 직조공 이웃',10]]},
 halles:{n:'레알 시장 구역',sec:'마르셰',par:'생퇴스타슈',m:[0,35,60,25,5,20,40],nb:[['생선 장수 아낙 마농',5],['레알의 짐꾼 앙투안',10],['건물 문지기 부인',-15]]},
 temple:{n:'탕플 구역',sec:'그라빌리에',par:'생니콜라데샹',m:[-5,35,70,30,5,20,45],nb:[['금은 세공사 이웃 피에르',0],['구두장이 이웃 바티스트',15],['건물 문지기 부인',-15]]},
 marais:{n:'마레 구역',sec:'인권',par:'생폴생루이',m:[-20,10,35,5,-5,0,15],nb:[['옆집 공증인 부인',-5],['은퇴한 검사 영감',-20],['건물 문지기',0]]},
 shon:{n:'생토노레 거리',sec:'뷔트데물랭',par:'생로크',m:[-15,15,40,-25,0,-20,5],nb:[['옆 가게 포목상 영감',-5],['생로크 성당 앞 꽃 장수',0],['모퉁이 카페 주인',10]]},
 sgerm:{n:'포부르 생제르맹',sec:'퐁텐드그르넬',par:'생쉴피스',m:[-45,-20,15,-30,-30,-65,-55],nb:[['옆 저택의 늙은 후작 부인',-25],['저택 집사 바티스트',0],['생쉴피스 앞 묵주 장수',-10]]},
 latin:{n:'라탱 구역',sec:'테아트르프랑세',par:'생테티엔뒤몽',m:[-10,45,70,35,10,40,60],nb:[['하숙집 안주인',-5],['이웃 법학도 에티엔',15],['생자크 거리의 서적상',5]]}};
const RXQW={artisan:[['sant',35],['smar',20],['halles',25],['temple',20]],bourgeois:[['marais',30],['shon',30],['halles',15],['latin',15],['temple',10]],robe:[['marais',60],['latin',20],['sgerm',20]],epee:[['sgerm',75],['shon',25]],hobereau:[['sgerm',50],['marais',50]],peasant:[['smar',60],['sant',40]]};
const RX_WEST=new Set(['vendee','bretagne']);
function rxQ(){const X=rxInit();if(inParis()){if(!X.q||!RXQ[X.q])X.q=wpick(RXQW[s.estate]||RXQW.artisan);return RXQ[X.q]}
  const i=rxI(),pp=RX_PEOPLE[i],w=RX_WEST.has(loc());const m=RX_E.split('').map((_,k)=>w?[-30,-30,-60,-50,-30,-50,-40][k]:Math.round(urban()?RX_PEOPLE[k]*.7:RX_PEOPLE[k]*.4-15));
  return {n:`${REGIONS[loc()].n}의 고을`,sec:null,par:'고을',m,nb:urban()?[['이웃 사람들',0],['골목 술집 주인',10]]:[['마을 사람들',-5],['이웃 농부',0]]}}
const RX_PEOPLE=[-5,40,65,25,5,25,45],RX_ELITE=[-25,-15,10,-10,-5,-45,-10];
const RX_FB={epee:-50,hobereau:-50,robe:-35,bourgeois:0,artisan:5,peasant:-15};
const RX_FS={artisan:[0,20,35,10,0,10,20],bourgeois:[0,15,10,0,0,5,5],robe:[0,0,-10,-5,0,-10,-10],epee:[0,-10,-15,-10,0,-15,-10],hobereau:[0,-10,-15,-10,0,-15,-10],peasant:[0,5,5,0,0,0,0]};
const rxMood=()=>rxQ().m[rxI()];
function rxFam(){return clamp((RX_FB[s.estate]??0)+((RX_FS[s.estate]||[])[rxI()]||0),-100,100)}
function rxSpPol(){const X=rxInit(),sp=s.spouse;if(!sp)return null;if(X.spn!==sp.n||X.sp==null){X.spn=sp.n;X.sp=clamp((RX_FB[sp.estate]??0)+((RX_FS[sp.estate]||[])[rxI()]||0)+ri(-15,15),-100,100)}return X.sp}
function rxKid(k){const X=rxInit(),id=k.n+k.y;if(X.kp[id]==null)X.kp[id]=clamp(Math.round(s.pol*.5+('bj'.includes(rxE())?20:0)+ri(-25,25)),-100,100);return X.kp[id]}
function rxRelPol(r){return r.pol!=null?r.pol:r.fac&&FAC[r.fac]?FAC[r.fac].pol:null}
function rxGuild(){const j=job();if(!j)return null;const E=rxE(),i=rxI(),pp=RX_PEOPLE[i];const t=T();
  const N={craft:t<tm(1791,3)?'동업조합(코르포라시옹)의 선임 장인들':'공방의 직인 동료들',law:'법조 동료들',church:'교구 사제단의 동료들',army:j.t>=4?'연대의 동료 장교들':'중대 동료들',letters:'카페의 문필가 동료들',med:'병원의 동료 외과의들',pol:'시청 동료들',farm:'같이 일하는 일꾼들'};
  const P={craft:pp+5,law:[-10,20,30,10,0,10,15][i],church:[-45,-10,-50,-50,-30,-60,-40][i],army:[-20,10,40,30,5,20,0][i],letters:[25,35,40,20,30,40,40][i],med:[10,30,35,20,10,30,35][i],pol:rulingPol(),farm:pp-20};
  return {W:N[j.tr]||'일터 동료들',pol:P[j.tr]??pp}}
function rxPeopleP(){const E=rxE();const L={o:[['퐁뇌프의 거리 노래꾼들',0],['선술집 손님들',0]],r:[['레알의 생선 장수 아낙들',5],['길모퉁이 신문팔이들',10]],t:[['붉은 모자를 쓴 상퀼로트들',15],['빵 가게 앞에 줄 선 아낙들',0]],d:[['빵 가게 앞에 줄 선 아낙들',5],['선술집 손님들',0]],e:[['선술집의 퇴역병들',0],['장터 사람들',0]],b:[['카페의 반쯤 봉급 장교들',15],['선술집 손님들',0]],j:[['카페의 노동자들',10],['학생들',15]]}[E];return pick(L)}
function rxEliteP(){const E=rxE();const L={o:[['살롱의 귀부인',0],['생제르맹 구역의 노후작',-20]],r:[['자유주의 귀족들',20],['살롱의 귀부인',-15]],t:[['몸을 사리는 부유한 납품업자들',-10]],d:[['멋쟁이 여인(메르베이외즈)들',-10],['총재정부의 투기꾼들',5]],e:[['새 제국 귀족들',5],['은행가 부인들',0]],b:[['생제르맹 구역의 귀부인들',-15],['튈르리 궁정 사람들',-10]],j:[['쇼세당탱의 은행가들',5],['생제르맹 구역의 정통왕조파 귀부인들',-50]]}[E];return pick(L)}
function rxPriest(){const t=T(),i=rxI(),q=rxQ();
  if(s.faithKind==='protestant')return {W:'개신교 목사',pol:[0,25,15,10,0,10,10][i],pious:.85};
  if(s.faithKind==='jewish')return {W:'랍비',pol:[0,20,15,10,0,5,10][i],pious:.85};
  const P=q.par==='고을'?'고을':q.par;
  if(t<tm(1791,1))return {W:`${P} 본당 신부`,pol:-35,pious:.95};
  if(t<tm(1793,11))return s.faith>=70&&R()<.5?{W:'몰래 미사를 드리는 선서 거부 신부',pol:-70,pious:1}:{W:`헌법에 선서한 ${P} 본당 신부`,pol:15,pious:.85};
  if(t<tm(1795,3))return s.faith>=60?{W:'다락방에 숨은 선서 거부 신부',pol:-70,pious:1}:null;
  if(t<tm(1801,8))return {W:'다시 문을 연 성당의 신부',pol:-30,pious:.95};
  return {W:`${P} 본당 신부`,pol:[-35,0,0,0,-20,-60,-40][i],pious:.95}}
// 지금 주변에 있는 사람들(가족·이웃·동업자·민중·상류사회·신부·아는 사람)
function rxPeople(){const X=rxInit(),out=[],kid=child(),add=(g,rk,W,pol,pious,w,o={})=>out.push(Object.assign({g,rk,W,pol,pious,w,v:[]},o));
  if(s.spouse&&s.spouse.alive)add('fam','rfam',(isM()?'아내 ':'남편 ')+s.spouse.n,rxSpPol(),isM()?.7:.4,1.2);
  if(s.fa.alive&&(kid||s.age<45))add('fam','rfam','아버지',rxFam(),.45,kid?1.5:.7);
  if(s.mo.alive&&(kid||s.age<50))add('fam','rfam','어머니',rxFam()-10,.8,kid?1.5:.7);
  if(!X.aunt)X.aunt=pick(['독실한 고모 쥐스틴','독실한 이모 쥐스틴','독실한 고모 앙젤리크','독실한 이모 앙젤리크']);
  if(s.age<60)add('fam','rfam',X.aunt,rxFam()-30,.95,.25);
  for(const k of kidsAlive().filter(k=>s.year-k.y>=16).slice(-2))add('fam','rfam',`${k.sex==='M'?'아들':'딸'} ${k.n}`,rxKid(k),.5,.6);
  const pr=s.cond==='normal'?rxPriest():null;if(pr)add('priest','rloc',pr.W,pr.pol,pr.pious,.3+s.faith/160);
  if(kid)return out;
  const q=rxQ(),m=rxMood();for(const [W,o] of q.nb)add('loc','rloc',W,clamp(m+o,-100,100),X.q==='sgerm'?.75:.55,.4);
  if(inParis()&&T()>=tm(1792,6)&&T()<tm(1795,6))add('loc','rloc',`${q.sec} 구의 열성 상퀼로트들`,clamp(m+25,-100,100),.2,.5);
  const gd=rxGuild();if(gd)add('guild','rguild',gd.W,gd.pol,.5,.8);
  const pp=rxPeopleP();add('people','rpeople',pp[0],RX_PEOPLE[rxI()]+pp[1],.5,.35+s.fame/120);
  const el=rxEliteP();add('elite','relite',el[0],RX_ELITE[rxI()]+el[1],.6,.15+((s.rep.relite>=55||noble()||rich())?.5:0)+s.fame/150);
  const rl=relsAlive();for(const r of rl){const b=relBond(r);const lab={존경:'존경하는',혐오:'원수 같은',라이벌:'맞수'}[b]||b;add('rel',null,`${lab} ${r.n}`,rxRelPol(r),.5,Math.min(.6,2/rl.length),{r,v:r.v?[r.v]:[]})}
  return out}
const RX_TV={bold:{fam:-.7,loc:.3,people:.6,elite:0,guild:.1,priest:-.2,rel:0},safe:{fam:.6,loc:0,people:-.3,elite:.3,guild:.3,priest:.3,rel:0},greedy:{fam:.1,loc:-.6,people:-.9,elite:.2,guild:-.3,priest:-.8,rel:-.2},
 family:{fam:1.1,loc:.4,people:.1,elite:.1,guild:0,priest:.6,rel:.1},work:{fam:.5,loc:.3,people:.2,elite:0,guild:.9,priest:.2,rel:.1},study:{fam:.4,loc:.2,people:-.2,elite:.5,guild:0,priest:.2,rel:.2},social:{fam:-.1,loc:.3,people:.1,elite:.8,guild:.2,priest:-.2,rel:.4}};
const RX_VT={vord:{safe:.5,work:.4,bold:-.5,radical:-.6},veq:{radical:.6,greedy:-.7,royal:-.6,social:.2},vlib:{radical:.5,study:.5,pious:-.4,royal:-.4},vhon:{bold:.6,safe:-.5,greedy:-.6},vfam:{family:.8,bold:-.4},vjus:{work:.3,greedy:-.6,social:.2}};
// 선택지의 정치적 무게: radical → +, royal → −
function rxPv(tags){if(child())return null;const E=rxE();const r=tags.includes('radical'),y=tags.includes('royal');if(!r&&!y)return null;
  const rv={o:35,e:40,b:45}[E]||55,yv=E==='o'?-30:-55;return r&&y?Math.round((rv+yv)/2):r?rv:yv}
function repMod(g){const k=rxK(g),v=s.rep&&s.rep[k];if(v==null)return 0;return v>=65?1:v<=35?-1:0}
const rxK=g=>s.rep&&g in s.rep?g:({fam:'rfam',loc:'rloc',guild:'rguild',people:'rpeople',elite:'relite',priest:'rloc'}[g]||'rloc');
const RXGN={rfam:'집안 식구들',rloc:'이웃들',rguild:'동업자들',rpeople:'장터와 선술집 사람들',relite:'살롱의 명사들'};
function crowd(g){const k=rxK(g),v=s.rep[k];let n=RXGN[k];if(k==='rloc'&&inParis()&&T()>=tm(1790,6)&&T()<tm(1795,10))n='구민들';if(k==='rguild'&&!job())n='옛 동료들';
  return v>=70?`${jo(n,'이','가')} 한목소리로 그대 편을 들었다.`:v>=58?`${jo(n,'은','는')} 고개를 끄덕여 주었다.`:v>=43?`${jo(n,'은','는')} 팔짱을 끼고 지켜보았다.`:v>=30?`${jo(n,'이','가')} 뒤에서 수군거렸다.`:`${jo(n,'이','가')} 대놓고 등을 돌렸다.`}
// 한 사람의 반응 점수와 그 까닭(주제)
function rxScore(p,tags,pv){const E=rxE(),con={},add=(k,v)=>{if(v)con[k]=(con[k]||0)+v};let sc=0;
  if(pv!=null&&p.pol!=null){const d=Math.abs(pv-p.pol);let a=d<=30?1.2:d<=50?.5:d>=90?-1.5:d>=65?-.9:0;if(E==='o')a*=.6;add(pv>0?'rad':'roy',a)}
  for(const t of tags){const tv=RX_TV[t];if(!tv)continue;let v=tv[p.g]||0;
    if(E==='t'&&t==='safe'&&p.pol!=null&&p.pol>=50)v-=.9;if(E==='t'&&t==='greedy'&&(p.g==='loc'||p.g==='people'))v-=.5;
    if(t==='study'&&p.W==='아버지'&&['artisan','peasant'].includes(s.estate))v=-.5;if(t==='family'&&p.g!=='fam'&&'rt'.includes(E)&&p.pol!=null&&p.pol>=55)v-=.6;add(t,v)}
  if(tags.includes('pious')){let v=(p.pious-.5)*1.6;if(p.g==='priest')v+=.6;if('rtd'.includes(E)&&T()>=1790.5&&p.pol!=null&&p.pol>=40)v-=.8;if('bj'.includes(E)&&p.pol!=null&&p.pol>=35)v-=.5;if(E==='b'&&p.pol!=null&&p.pol<=-30)v+=.4;add('pious',v)}
  for(const val of p.v||[]){const vt=RX_VT[val];if(!vt)continue;for(const t of tags)if(vt[t])add(t==='radical'?'rad':t==='royal'?'roy':t,vt[t])}
  for(const k in con)sc+=con[k];
  if(pv==null&&p.pol!=null&&E!=='o'&&s.age>=18&&!child()){const d2=Math.abs(pubPol()-p.pol);sc+=d2>=75?-.4:d2<=20?.2:0}
  const rm=p.r?(p.r.close>=65?1:p.r.close<=30?-1:0):p.rk?repMod(p.rk):0;sc+=rm*.45;
  const sign=sc>0?1:-1;let th=null,best=0;for(const k in con)if(con[k]*sign>0&&Math.abs(con[k])>best){best=Math.abs(con[k]);th=k}
  return th?{sc,sign,th,rm}:null}
/* 반응 문장: [주제±, 집단('*' 또는 fam loc guild people elite priest rel), 시대('*' 또는 ortdebj), 문장, {c:조건, sus:혐의}]
   {W는} {W가} {W를} {W와} {W} → 그 사람, {Q} 동네, {S} 구(섹시옹), {P} 본당 */
const RX_L=[
 ['rad+','*','rt','{W는} “그래야 애국자지!” 하며 그대의 등을 두드렸다.'],
 ['rad+','*','t','{W는} 그대를 ‘시민’이라 부르며 붉은 모자를 내밀었다.'],
 ['rad+','*','rt','{W는} 그대 이름을 넣어 「사 이라」를 흥얼거리며 지나갔다.'],
 ['rad+','*','*','{W는} 저녁에 포도주 한 병을 들고 와서 “우리 편”이라고 했다.'],
 ['rad+','loc','rt','{W가} 그대 이야기를 구 총회에서 자랑스레 옮겼다.'],
 ['rad+','*','debj','{W는} “1793년의 불씨가 아직 꺼지지 않았다”며 눈을 빛냈다.'],
 ['rad+','*','b','{W는} 문을 닫고 「라 마르세예즈」 한 소절을 낮게 불러 보였다.'],
 ['rad+','*','b','{W는} 카페에서 그대를 두고 “진짜 자유파”라고 말했다.'],
 ['rad+','*','j','{W는} 그대를 공화파 모임에 데려가고 싶어 했다.'],
 ['rad+','*','o','{W는} “볼테르 선생이 들었으면 기뻐했을 것”이라며 웃었다.'],
 ['rad+','guild','rt','{W는} “장인이든 직인이든 같은 시민”이라며 술잔을 부딪쳤다.'],
 ['rad+','people','rtd','{W는} 그대가 지나가자 “빵과 자유!”를 외쳐 주었다.'],
 ['rad+','elite','r','{W는} “자유주의 귀족도 있는 법이지요”라며 부채 너머로 미소 지었다.'],
 ['rad+','priest','r','{W는} “복음도 형제애를 말한다”며 조용히 고개를 끄덕였다.'],
 ['rad+','rel','*','{W는} “역시 같은 길을 가는군” 하며 그대 손을 맞잡았다.'],
 ['rad-','*','*','{W는} 그대를 ‘미친 선동꾼’이라 부르며 얼굴을 찌푸렸다.'],
 ['rad-','fam priest','*','{W는} 성호를 긋고 “하느님 맙소사” 하고 탄식하였다.',{c:p=>p.pious>=.7}],
 ['rad-','fam elite','*','{W는} 그대와 한 식탁에 앉기를 거부하였다.'],
 ['rad-','fam','td','{W는} “그러다 목이 달아난다”며 그날 밤 덧문을 걸어 잠갔다.'],
 ['rad-','elite','*','{W는} 살롱에서 그대 이름이 나오자 부채로 입을 가리고 웃었다.'],
 ['rad-','*','d','{W는} 그대를 ‘피에 굶주린 자코뱅 꼬리’라 불렀다.'],
 ['rad-','*','d','{W는} 그대를 ‘무정부주의자’라 부르며 고개를 돌렸다.'],
 ['rad-','loc people','eb','{W가} 경찰 끄나풀에게 그대 이야기를 흘렸다는 소문이 돌았다.',{sus:2}],
 ['rad-','*','e','{W는} “제국에서는 그런 말을 입에 담지 않는 법”이라고 일렀다.'],
 ['rad-','elite priest','b','{W는} 그대를 ‘보나파르트 잔당과 한통속’이라 손가락질했다.'],
 ['rad-','*','*','{W는} “질서가 먼저다”라며 그대를 길게 훈계하였다.'],
 ['rad-','*','o','{W는} “왕의 신민이 할 말이 아니다”라며 혀를 찼다.'],
 ['rad-','priest','obj','{W는} 강론에서 “교만한 철학자들”을 꾸짖었는데, 신자들의 눈이 모두 그대에게 쏠렸다.'],
 ['rad-','rel','*','{W는} 그대의 말을 듣고 한참 말이 없더니, 그날은 일찍 자리를 떴다.'],
 ['roy+','*','*','{W는} “역시 근본 있는 사람”이라며 그대 손을 잡았다.'],
 ['roy+','*','orb','{W는} 그대와 함께 왕의 건강을 비는 축배를 들었다.'],
 ['roy+','*','b','{W는} 백합꽃 문장을 수놓은 손수건을 선물하였다.'],
 ['roy+','*','tde','{W는} 몰래 “왕 만세”라고 속삭이며 눈을 찡긋했다.'],
 ['roy+','elite','bj','{W는} 생제르맹 구역의 만찬에 그대를 불렀다.'],
 ['roy+','*','b','{W는} 그대를 ‘바르게 생각하는 사람’이라 칭찬했다.'],
 ['roy+','*','b','{W는} 그대가 「앙리 4세 만세」를 부르자 따라 불렀다.'],
 ['roy+','priest','*','{W는} 미사가 끝난 뒤 그대에게 먼저 고개를 숙여 인사했다.'],
 ['roy+','elite','*','{W는} 저택 문지기에게 그대는 언제든 들이라고 일렀다.'],
 ['roy-','*','*','{W는} 그대를 차갑게 바라보며 인사를 받지 않았다.'],
 ['roy-','people loc','rt','{W는} 그대를 ‘귀족 놈들 편’이라 부르며 땅에 침을 뱉었다.'],
 ['roy-','loc','t','{W는} 문지기에게 그대가 언제 드나드는지 묻고 다녔다.',{sus:2}],
 ['roy-','loc people','rt','{W는} 그대 집 문에 분필로 ‘귀족’이라고 적어 놓았다.'],
 ['roy-','loc','t','{W가} {S} 구 감시위원회에 그대 이름을 적어 냈다는 말이 돌았다.',{sus:3,c:()=>inParis()}],
 ['roy-','*','d','{W는} 그대를 ‘슈앙 같은 자’라고 흘겨보았다.'],
 ['roy-','*','rtd','{W는} “망명자 앞잡이”라며 그대 앞에서 문을 닫았다.'],
 ['roy-','rel','bj','{W는} 차갑게 등을 돌렸다. 한때 같은 구호를 외치던 사이였다.'],
 ['roy-','*','b','{W는} 그대를 ‘울트라’라고 비꼬며 카페 자리를 옮겼다.'],
 ['roy-','*','b','{W는} 그대에게 “코블렌츠에서 이제 돌아오셨소?” 하고 빈정거렸다.'],
 ['roy-','*','bj','{W는} “아무것도 배우지 못했고 아무것도 잊지 않았다”는 말로 그대를 비웃었다.'],
 ['roy-','*','e','{W는} “옛 왕당 패거리”라며 그대를 피했다.'],
 ['roy-','people loc','o','{W는} “궁정 아첨꾼이 다 됐다”며 비웃었다.'],
 ['pious+','fam priest','*','{W는} 그대를 위해 묵주 기도를 바쳤다.'],
 ['pious+','*','*','{W는} 미사가 끝나고 그대의 손을 꼭 잡았다.'],
 ['pious+','priest','*','{W는} 성수반 옆에서 그대에게 축복을 빌어 주었다.'],
 ['pious+','*','td','{W는} 다락방에서 몰래 드리는 미사에 그대를 불렀다.',{c:p=>p.pious>=.7}],
 ['pious+','fam','*','{W는} “그래도 하느님을 잊지 않았구나”라며 눈시울을 붉혔다.'],
 ['pious+','elite priest','b','{W는} 그대를 성모회(콩그레가시옹) 모임에 추천하겠다고 했다.'],
 ['pious-','*','rtd','{W는} 그대를 ‘광신자’라 불렀다.'],
 ['pious-','*','*','{W는} “성직자들 꼭두각시”라며 코웃음을 쳤다.'],
 ['pious-','*','obj','{W는} 볼테르의 한 구절을 읊으며 그대를 놀렸다.'],
 ['pious-','*','b','{W는} 그대를 ‘예수회 끄나풀’이라 수군거렸다.'],
 ['pious-','loc','t','{W가} 그대가 선서 거부 신부와 어울린다고 구 위원회에 일러바쳤다.',{sus:3}],
 ['bold+','*','*','{W는} “배짱 하나는 알아줘야 한다”며 엄지를 치켜세웠다.'],
 ['bold+','people loc','*','{W는} 선술집에서 그대 이야기를 부풀려 퍼뜨렸다. 이야기 속 그대는 키가 두 뼘쯤 더 컸다.'],
 ['bold+','*','*','{W는} 그대를 다시 보았다는 듯 고개를 끄덕였다.'],
 ['bold+','fam rel','*','{W는} 그대의 용기가 집안의 자랑이라고 했다.'],
 ['bold-','fam','*','{W는} 밤새 잠을 못 잤다며 그대를 나무랐다.'],
 ['bold-','*','*','{W는} “무모함은 용기가 아니다”라며 혀를 찼다.'],
 ['bold-','fam','*','{W는} 그대가 집안을 위험에 빠뜨린다며 울먹였다.'],
 ['safe+','fam','*','{W는} “현명했다”며 안도의 숨을 쉬었다.'],
 ['safe+','*','*','{W는} 그대를 ‘믿을 만한 사람’이라고 했다.'],
 ['safe+','*','*','{W는} “물러설 줄 아는 것도 지혜”라고 거들었다.'],
 ['safe-','*','t','{W는} 그대를 ‘미지근한 자’라 불렀다. 이 무렵에는 무관심도 죄였다.',{sus:2}],
 ['safe-','*','*','{W는} “겁쟁이”라고 중얼거리며 돌아섰다.'],
 ['safe-','*','*','{W는} 그대가 늘 바람 부는 쪽에 선다며 비웃었다.'],
 ['greedy+','fam elite guild','*','{W는} “돈 셈이 빠르다”며 감탄하였다.'],
 ['greedy+','*','*','{W는} 그대에게 동업 이야기를 꺼내기 시작했다.'],
 ['greedy-','loc people','td','{W는} 그대를 ‘매점매석꾼’이라 불렀다.',{sus:2}],
 ['greedy-','loc people','*','{W는} 그대 가게 앞에서 일부러 빵값 이야기를 크게 하였다.'],
 ['greedy-','*','*','{W는} “구두쇠가 다 됐다”며 고개를 저었다.'],
 ['greedy-','priest','*','{W는} 다음 주일 강론에서 탐욕의 죄를 길게 이야기했다.'],
 ['greedy-','elite','*','{W는} 그대를 ‘졸부’라 비웃었다.'],
 ['family+','fam','*','{W는} 그대가 집안을 먼저 생각했다며 기뻐하였다.'],
 ['family+','*','*','{W는} 그대를 ‘가정의 기둥’이라 칭찬했다.'],
 ['family+','loc priest','*','{W는} 그대 아이들 머리를 쓰다듬으며 웃었다.',{c:()=>kidsAlive().some(k=>s.year-k.y<14)}],
 ['family-','*','rt','{W는} “집안일보다 조국이 먼저”라고 핀잔을 주었다.'],
 ['family-','*','*','{W는} 그대가 집 밖 세상을 모른다고 놀렸다.'],
 ['work+','guild','*','{W는} 그대 솜씨를 보고 “제대로 된 손”이라며 감탄했다.'],
 ['work+','loc','*','{W는} 새벽부터 불 켜진 그대 창을 보고 고개를 끄덕였다.'],
 ['work+','*','*','{W는} 그대를 ‘성실한 사람’이라 부르며 일감을 하나 더 돌려주었다.'],
 ['work-','guild','*','{W는} 그대가 일감을 다 가져간다며 투덜댔다.'],
 ['work-','*','*','{W는} 일만 하다가 사람 구실을 못 한다고 걱정했다.'],
 ['study+','fam','*','{W는} 그대가 책을 펼 때마다 자랑스러워했다.'],
 ['study+','loc people','*','{W는} 그대를 ‘배운 분’이라 부르며 편지 대필을 부탁했다.'],
 ['study+','*','ort','{W는} 그대와 루소를 두고 밤늦게까지 이야기했다.'],
 ['study+','*','*','{W는} 그대가 읽은 책 이야기를 귀담아들었다.'],
 ['study-','*','*','{W는} “책이 빵을 주지는 않는다”며 혀를 찼다.'],
 ['study-','people guild','*','{W는} 그대를 ‘잘난 체하는 먹물’이라 불렀다.'],
 ['social+','elite','*','{W는} 다음 만찬에도 그대를 꼭 부르겠다고 했다.'],
 ['social+','*','*','{W는} 그대 덕에 좋은 사람들을 만났다며 고마워했다.'],
 ['social-','fam','*','{W는} 그대가 겉치레에 돈을 쓴다며 잔소리했다.'],
 ['social-','*','*','{W는} 그대가 높은 사람들에게 아첨한다고 수군거렸다.']];
function rxFill(t,W){const q=rxQ();return t.replace(/\{W(는|가|를|와)?\}/g,(m,p)=>!p?W:p==='는'?jo(W,'은','는'):p==='가'?jo(W,'이','가'):p==='를'?jo(W,'을','를'):jo(W,'과','와')).replace(/\{Q\}/g,q.n).replace(/\{S\}/g,q.sec||'고을').replace(/\{P\}/g,q.par)}
function rxPool(p,key){const E=rxE(),X=rxInit();const ok=l=>l[0]===key&&(l[1]==='*'||l[1].split(' ').includes(p.g))&&(l[2]==='*'||l[2].includes(E))&&(!l[4]||!l[4].c||l[4].c(p));
  const all=RX_L.filter(ok);const fresh=all.filter(l=>!X.used.includes(l[3]));return fresh.length?fresh:all}
// 한 사람의 반응을 적고 효과를 준다
function rxSay(p,r,ctx){const X=rxInit();const pool=rxPool(p,r.th+(r.sign>0?'+':'-'));if(!pool.length)return false;const l=pick(pool);
  X.used.push(l[3]);if(X.used.length>40)X.used.splice(0,X.used.length-40);
  let mag=r.sign>0?(Math.abs(r.sc)>=2?2:1):Math.min(3,1+(Math.abs(r.sc)>=1.6?1:0)+(s.fame>=40&&(p.g==='people'||p.g==='elite')?1:0)),tail='';
  if(r.sign>0&&r.rm<0&&R()<.5){tail=' 그래도 다들 반신반의하는 눈치였다.';mag=Math.max(1,mag-1)}
  else if(r.sign<0&&r.rm>0&&R()<.5){tail=' 평소 신망이 두터운 덕에 말이 크게 번지지는 않았다.';mag=Math.max(1,mag-1)}
  else if(r.sign<0&&r.rm<0&&R()<.5){tail=' “역시 그럴 줄 알았다”는 말이 따라붙었다.';mag=Math.min(3,mag+1)}
  else if(r.sign>0&&r.rm>0&&R()<.3)tail=' 평판 좋은 사람의 일은 소문도 빨랐다.';
  const o={};if(!p.r&&!(r.sign>0&&s.rep[p.rk]>=75))o[p.rk]=r.sign*mag;if(l[4]&&l[4].sus&&r.sign<0&&s.cond==='normal')o.sus=l[4].sus;
  let rel='';if(p.r){const n=2*mag+ri(0,2);rel=relFx(p.r,r.sign>0?{close:n,resp:mag}:{close:-n,trust:-mag});if(p.r.fac)facRel(p.r.fac,r.sign)}
  say((ctx?`‘${ctx}’ 일을 두고 `:'')+rxFill(l[3],p.W)+tail+fx(o)+rel);return true}
function rxPickW(list){const t=list.reduce((a,x)=>a+x[2],0);let v=R()*t;for(const x of list){v-=x[2];if(v<=0)return x}return list[list.length-1]}
// 결정 창에서 고른 뒤 ui.js의 done()이 부른다. force: 반응이 일어날 확률을 직접 준다(정치 활동에서).
function reactAfter(opt,force){if(!s||s.dead||!opt||s.age<6)return;const tags=String(opt.a||'').split(/\s+/).filter(Boolean);if(!tags.length)return;if(s.cond!=='normal'&&force==null)return;
  const X=rxInit();if(!X.n||X.n.y!==s.year)X.n={y:s.year,c:0};if(X.n.c>=7&&force==null)return;
  const pv=rxPv(tags);let p=force!=null?force:.4+(pv!=null?.08:0)+(s.fame>=40?.04:0);if(force==null&&T()-X.t<.15)p*=.35;if(R()>=p)return;
  const cand=[];for(const q of rxPeople()){const r=rxScore(q,tags,pv);if(r&&Math.abs(r.sc)>=.8)cand.push([q,r,q.w*(.4+Math.min(2,Math.abs(r.sc)))])}
  if(!cand.length)return;let ti='';try{const e=typeof document!=='undefined'&&document.querySelector('#shT');ti=e?e.textContent.trim():''}catch(e){}
  const a=rxPickW(cand);const ctx=ti&&ti.length<=12&&['rad','roy','pious'].includes(a[1].th)&&R()<.35?ti:'';if(!rxSay(a[0],a[1],ctx))return;X.t=T();X.n.c++;
  if(R()<.15){const rest=cand.filter(x=>x[0].g!==a[0].g);const opp=rest.filter(x=>x[1].sign!==a[1].sign);const b=(opp.length?opp:rest);if(b.length)rxSay(rxPickW(b)[0],rxPickW(b)[1],'')}}

/* ---------- 해마다: 정치 성향이 주변 사람과의 사이를 바꾼다 ---------- */
function reactYearSync(){if(!s||s.dead||child()||s.age<16||s.cond!=='normal')return;const X=rxInit(),E=rxE(),pp=pubPol(),c=conduct();
  const w=(E==='o'?.5:1)*(c==='silent'?.5:1),notes=[];
  for(const r of relsAlive()){const rp=rxRelPol(r);if(rp==null)continue;const d=Math.abs(pp-rp);
    if(d>=55&&r.close>15&&R()<.6){const n=-Math.max(1,Math.min(4,Math.round((d-40)/15*w)));const t=relFx(r,{close:n});if(R()<.5)notes.push([Math.abs(n),`${jo(r.n,'과','와')}는 정치 이야기만 나오면 말이 엇갈렸다. 사이가 조금 멀어졌다.`+t])}
    else if(d<=15&&r.close<90&&E!=='o'){const t=relFx(r,{close:1});if(R()<.3)notes.push([.5,`${jo(r.n,'과','와')}는 시국을 보는 눈이 같아 더 가까워졌다.`+t])}}
  const q=rxQ(),m=rxMood(),d=Math.abs(pp-m);let n=E==='o'?0:d<=25?(s.rep.rloc<65&&R()<.35?1:0):d>=80?-3:d>=60?-2:d>=45?-1:0;if(n<0)n=Math.min(-1,Math.round(n*w));if(c==='silent'&&n>0)n=0;
  if(n){const sus=E==='t'&&n<=-2&&m>=50&&R()<.4?3:0;const nm=inParis()&&T()>=tm(1790,6)&&T()<tm(1795,10)?`${q.sec} 구 사람들`:`${q.n} 이웃들`;
    const t=n>0?pick([`${jo(nm,'은','는')} 그대를 ‘우리 편’으로 여겼다.`,`${jo(nm,'은','는')} 시국 이야기를 할 때 그대 말을 먼저 들었다.`]):E==='t'?`${jo(nm,'이','가')} 그대의 공개 입장을 두고 수군거렸다. 감시위원회 문턱이 가까워 보였다.`:E==='b'&&pp>=30?`${jo(nm,'은','는')} 그대를 ‘자유파 불평꾼’이라 불렀다.`:E==='b'||E==='d'?`${jo(nm,'은','는')} 그대 앞에서 정치 이야기를 꺼리게 되었다.`:`${jo(nm,'과','와')} 정치 이야기를 하면 분위기가 싸늘해졌다.`;
    const tx=t+fx({rloc:n,sus});if(n<0||R()<.3)notes.push([Math.abs(n)+(sus?1:0),tx])}
  if(s.spouse&&s.spouse.alive&&X.sp!=null){X.sp=clamp(Math.round(X.sp+(s.pol-X.sp)*.1),-100,100);if(Math.abs(s.pol-X.sp)>=60&&E!=='o'){notes.push([1.5,`${isM()?'아내와':'남편과'} 시국을 두고 자주 말다툼을 하였다.`+fx({rfam:-1})])}}
  // 공포정치 때 감시위원이었던 사람: 1795년 봄 ‘테러리스트’ 무장 해제
  if(s.flags.rxSurv&&!s.flags.rxSurv2&&T()>=tm(1795,4)){s.flags.rxSurv2=true;const hit=R()<.35;L(`옛 감시위원 무장 해제 35% → ${hit?'일어났다':'피했다'} · 제르미날 21일 법으로 공포정치기 위원들이 무장 해제된 비율`,'dice');
    if(hit){const jail=R()<.3;notes.push([9,`옛 감시위원회 일로 ‘테러리스트’ 명단에 올라 총을 빼앗겼다.${jail?' 이어 체포되었다.':''}`+fx({sus:12,rloc:-3,inf:-3})]);if(jail){s.cnt.arrest++;s.cond='prison';s.prisonKind='plain';s.condSince=T()}}}
  if(!notes.length)return;notes.sort((a,b)=>b[0]-a[0]);say(notes[0][1])}
async function reactYear(){reactYearSync()}
// conductYear(politics.js)는 해마다 한 번 불린다. 그 뒤에 이어 붙인다.
const rxConductYear0=conductYear;conductYear=function(){rxConductYear0();try{reactYearSync()}catch(e){console.error(e)}};

/* ================= 정치 활동 늘리기 (PACTS) ================= */
const rxGo=()=>free()&&s.age>=16;
const rxj=(w,a,b)=>w+(bat(w.replace(/[^가-힣0-9]+$/,''))?a:b);
function rxJail(t){s.cnt.arrest++;s.cond='prison';s.prisonKind=inTerror()?'terror':'plain';s.condSince=T();say(t||'감옥에 갇혔다.','big')}
function rxOpen(t,fr,x){sheetOpen(t,fr);if(x)shText(x,'q')}
const rxActive=()=>s.cond==='normal'&&!s.dead;
const rxMoodFit=pv=>{const d=Math.abs(pv-rxMood());return d<=30?1:d>=70?-1:0};
PACTS.push(
 {k:'rx_cahier',n:'진정서(카이에) 작성에 참여한다',s:'1789년 봄 삼부회 선거. 성향과 이웃 평판',c:()=>rxGo()&&isM()&&s.age>=25&&s.year===1789&&s.month<=4&&!noble(),inter:async()=>{
   const i=await Q('진정서','cahier de doléances',`${rxQ().n}의 제3신분 선거인 모임. 왕께 올릴 진정서를 함께 쓴다. 무엇을 적자고 하겠는가.`,[
    {l:'빵값과 파리 입시세(옥트루아) 폐지를 적자고 한다',s:'민중의 지지',a:'social radical'},{l:'삼부회는 머릿수로 투표해야 한다고 쓴다',s:'급진, 명성',a:'radical study'},{l:'왕께 충성을 바치고 옛 관습을 지키자고 한다',s:'',a:'royal safe'}]);
   if(i===0)say('“빵 4파운드 한 덩이에 8수를 넘지 않게.” 그대의 문장이 진정서에 들어갔다.'+fx({pol:4,rpeople:2,rloc:2,bor:3,pen:1}));
   else if(i===1)say('“삼부회는 신분별이 아니라 머릿수로 표결한다.” 시에예스의 소책자를 인용하였다.'+fx({pol:6,fame:2,orat:1,bor:4,brg:2}));
   else say('왕의 은혜에 감사하는 첫 줄을 그대가 썼다.'+fx({pol:-4,relite:1,brg:-3}));await done()}},
 {k:'rx_sect',n:'구 총회(섹시옹)에서 발언한다',s:'웅변·이웃 평판 판정. 명성·영향력, 공포정치기엔 위험',c:()=>rxGo()&&isM()&&s.age>=21&&inParis()&&T()>=tm(1789,5)&&T()<tm(1795,10)&&(T()>=tm(1792,8)||s.money>=30||!!s.job),inter:async()=>{
   const E=rxE(),q=rxQ(),hall=T()<tm(1790,6)?`${q.n} 디스트릭트 총회`:`${q.sec} 구(섹시옹) 총회`;
   const O=E==='r'?[{l:'왕의 거부권을 규탄하는 결의를 발의한다',s:'급진',a:'radical bold',pv:60},{l:'법과 국왕을 지키자고 호소한다',s:'온건',a:'royal safe',pv:-20},{l:'빵 공급 대책을 시정부에 묻자고 한다',s:'',a:'social',pv:30}]
    :E==='t'?[{l:'혐의자 가택 수색을 발의한다',s:'급진. 혐의 −',a:'radical bold',pv:80},{l:'최고가격제 단속을 더 세게 하자고 한다',s:'민중의 지지',a:'radical social',pv:70},{l:'“관용”을 호소한다',s:'위험하다',a:'bold',pv:20}]
    :[{l:'“빵과 1793년 헌법!”을 요구한다',s:'급진. 혐의 +',a:'radical bold',pv:70},{l:'‘테러리스트’ 무장 해제에 찬성한다',s:'온건·질서',a:'royal safe',pv:-10},{l:'빵 배급량을 늘리자고 한다',s:'',a:'social',pv:20}];
   const i=await Q(hall,'assemblée de section','저녁마다 성당이나 수도원 강당에서 총회가 열린다. 방청석에는 아낙들이 뜨개질을 하며 앉아 있다. 그대가 손을 들었다.',O);const o=O[i];
   const {m,why}=md([[s.sk.orat>=40,1,'웅변'],[s.st.soc>=55,1,'사교'],[repMod('rloc')>0,1,'이웃의 신망'],[repMod('rloc')<0,-1,'이웃의 불신'],[rxMoodFit(o.pv)>0,1,'구민 분위기와 맞음'],[rxMoodFit(o.pv)<0,-1,'구민 분위기와 어긋남']]);
   const r=await roll(m,{label:'총회 발언',why});const fit=rxMoodFit(o.pv);
   if(r.v>=5)say(`발의가 박수 속에 통과되었다. ${crowd('rloc')}`+fx({fame:3,inf:3,orat:2,rloc:fit>=0?2:-1,rpeople:o.pv>=50?2:0,pol:Math.round((o.pv-s.pol)*.1),sus:E==='t'&&o.pv<40?6:E==='t'?-3:E==='d'&&o.pv>=60?5:0}),'big');
   else if(r.v<=2)say(`방청석의 야유에 말이 끊겼다. ${crowd('rloc')}`+fx({fame:-1,rloc:-2,orat:1,sus:E==='t'&&o.pv<40?8:0}));
   else say('몇 사람이 거들었지만 안건은 다음 총회로 미뤄졌다.'+fx({orat:1,fame:1,sus:E==='t'&&o.pv<40?4:0}));
   if(o.pv>=60){facRel('jacobin',3);facRel('cordelier',3);facRel('neojacobin',3)}else if(o.pv<0){facRel('thermidor',3);facRel('feuillant',3)}await done()}},
 {k:'rx_petit',n:'청원서에 서명을 받으러 다닌다',s:'사교·글 판정. 명성·민중 평판',c:()=>rxGo()&&lit()&&((T()>=tm(1789,7)&&T()<tm(1795,6))||(T()>=tm(1814,6)&&T()<tm(1848,3))),inter:async()=>{
   const E=rxE(),cm=s.year===1791&&s.month>=5&&s.month<=6&&inParis();
   const what=cm?'샹드마르스 조국의 제단 위에 왕의 폐위를 요구하는 청원서가 놓였다.':E==='r'||E==='t'?pick(['국민의회에 보낼 구민 청원서','망명 귀족 재산 몰수를 요구하는 청원서','빵값 통제를 요구하는 청원서']):E==='d'?'빵값과 아시냐 폭락 대책을 요구하는 청원서':E==='b'?pick(['언론 자유를 지켜 달라는 하원 청원서','이중 투표법에 반대하는 하원 청원서']):'선거권을 넓히자는 개혁 청원서';
   rxOpen('청원','pétition',`${what}${cm?'':'를 들고 골목과 카페를 돈다.'}`);
   const {m,why}=md([[s.st.soc>=50,1,'사교'],[s.sk.pen>=40,1,'문장력'],[repMod('rpeople')>0,1,'민중의 신망'],[repMod('rloc')<0,-1,'이웃의 불신'],[s.fame>=35,1,'이름이 알려짐']]);const r=await roll(m,{label:'서명 받기',why});
   if(cm&&await chance(.12,'샹드마르스 발포','7월 17일 계엄령 아래 국민방위대가 군중에게 쏜 날, 청원 서명자가 다치거나 붙잡힌 비율')){say('붉은 계엄 깃발이 오르고 총성이 울렸다. 군중이 흩어지는 사이 국민방위대에 붙잡혔다.'+fx({hp:-6,sus:12,rpeople:3,pol:6}),'big');if(R()<.5)rxJail('주동자 명단에 올라 감옥에 갇혔다.');await done();return}
   if(r.v>=4)say(`서명 ${ri(300,2000)}명을 받아 냈다. ${crowd('rpeople')}`+fx({fame:3,rpeople:3,pen:1,soc:1,inf:2,pol:3,sus:E==='b'?3:E==='t'?0:1}));
   else say(`문 앞에서 거절당하는 일이 더 많았다. ${crowd('rloc')}`+fx({fame:1,rloc:-1}));reactAfter({a:'radical social'},.7);await done()}},
 {k:'rx_fete',n:'혁명 축제를 준비한다',s:'기술·사교 판정. 이웃·민중 평판',c:()=>rxGo()&&inParis()&&T()>=tm(1790,6)&&T()<tm(1799,11),inter:async()=>{
   const y=s.year,mo=s.month;const t=y===1790?'샹드마르스 연맹제. 귀부인도 짐꾼도 함께 외바퀴 수레로 흙을 날라 원형 경기장을 쌓는다.':y===1793?'8월 10일 ‘통일과 불가분의 축제’. 바스티유 터에 세운 자연의 여신상 가슴에서 물이 흐른다.':y===1794&&mo<=6?'최고존재의 축제. 다비드가 짠 행렬 순서대로 아이들이 꽃을 들고 걷는다.':y>=1795?'총재정부의 공화국 건국 기념 축제(방데미에르 1일). 경마와 풍선 띄우기가 열린다.':'구(섹시옹)의 애국 축제. 삼색 띠를 두른 아이들이 「사 이라」를 부른다.';
   rxOpen('혁명 축제','fête révolutionnaire',t);const {m,why}=md([[s.st.dex>=50,1,'손재주'],[s.sk.draw>=30||s.sk.music>=30,1,'그림·음악'],[s.st.soc>=50,1,'사교'],[repMod('rloc')>0,1,'이웃의 신망']]);const r=await roll(m,{label:'축제 준비',why});
   if(r.v>=4)say(`그대가 맡은 장식이 행렬에서 박수를 받았다. ${crowd('rloc')}`+fx({rloc:3,rpeople:2,fame:2,pol:3,dex:1,faith:y===1794?-1:0}));else say('비가 내려 삼색 종이꽃이 다 젖었다. 그래도 사람들은 춤을 추었다.'+fx({rloc:1,pol:1}));
   reactAfter({a:'radical social'},.6);await done()}},
 {k:'rx_don',n:'애국 헌금을 낸다',s:'재산을 내놓는다. 이웃 평판, 혐의 −',c:()=>rxGo()&&((T()>=tm(1789,9)&&T()<tm(1795,1))||(T()>=tm(1813,1)&&T()<tm(1814,3))),inter:async()=>{
   const emp=T()>=1813,v=Math.max(10,Math.round(s.money*.1));
   const i=await Q('애국 헌금','don patriotique',emp?'러시아에서 대육군을 잃었다. 도시와 동업자들이 황제에게 기병과 말을 바치자고 모금한다.':'국민의회에 애국 헌금이 쏟아진다. 화가들의 아내가 보석을 바쳤고, 사람들은 신발의 은 버클까지 떼어 낸다.',[
    {l:`형편껏 크게 낸다 (${fmt(v)})`,s:'',a:'radical social'},{l:emp?'말 한 필 값을 나눠 낸다':'은 버클과 장신구를 바친다',s:'',a:'social'},{l:emp?'붕대(샤르피)를 뜯어 보낸다':'병사들 셔츠를 짓고 붕대(샤르피)를 만든다',s:'바느질',a:'work family'},{l:'내지 않는다',s:'',a:'greedy safe'}]);
   if(i===0)say(`${emp?'시청':'국민의회'} 회보에 그대 이름과 헌금액이 실렸다.`+fx({money:-v,rloc:3,rpeople:2,fame:2,sus:-6,inf:1}));
   else if(i===1)say('작은 헌금이지만 명부에 이름이 올랐다.'+fx({money:-Math.min(s.money,Math.round(v/3)),rloc:1,sus:-3}));
   else if(i===2)say('저녁마다 등불 아래서 낡은 천을 뜯어 붕대를 만들었다.'+fx({sew:2,rloc:2,sus:-2,vfam:1}));
   else say('헌금 명부에 그대 이름이 없다는 것을 이웃들이 알아챘다.'+fx({rloc:-2,sus:inTerror()?5:emp?2:1}));
   if(i<=1){facRel(emp?'bonapartist':'patriote',3);facRel('jacobin',2)}await done()}},
 {k:'rx_paper',n:'클럽 신문을 돌린다',s:'어느 신문을 고르는지에 따라 성향과 위험이 달라진다',c:()=>rxGo()&&lit()&&inParis()&&T()>=tm(1789,9)&&T()<tm(1794,4),inter:async()=>{const t=T();
   const P=[[t<tm(1793,7),'마라의 『인민의 벗』','radical bold',70,4],[t>=tm(1790,9)&&t<tm(1794,3),'에베르의 『뒤셴 영감』','radical',80,3],[t>=tm(1793,12),'데물랭의 『늙은 코르들리에』','bold',35,14],[t<tm(1793,6),'브리소의 『프랑스 애국자』','radical study',30,t>=tm(1793,1)?6:1],[t>=tm(1790,6)&&t<tm(1792,5),'루아유 신부의 『왕의 벗』','royal',-60,4],[t<tm(1791,10),'『사도행전』(왕당파 풍자지)','royal social',-55,3]].filter(x=>x[0]);
   const O=P.map(x=>({l:`${rxj(x[1],'을','를')} 돌린다`,s:x[3]>0?'급진':'왕당',a:x[2]}));O.push({l:'그만둔다',s:'',a:'safe'});
   const i=await Q('신문팔이','colporteur','새벽 인쇄소 앞에서 신문 뭉치를 받아 퐁뇌프와 팔레루아얄 회랑을 돈다. 큰 소리로 제목을 외쳐야 팔린다.',O);
   if(i>=P.length){say('신문 뭉치를 내려놓았다.');await done();return}const x=P[i];
   say(`${rxj(x[1],'을','를')} 외치며 팔았다.`+fx({pol:Math.round((x[3]-s.pol)*.12),fame:1,orat:1,rpeople:x[3]>=50?2:x[3]<0?-2:0,relite:x[3]<0?1:0,brg:x[3]>0?2:-2}));
   const risk=x[3]<0&&t>=tm(1792,8)?.3:x[4]>=10?.2:x[3]<0?.06:t>=tm(1793,9)&&x[3]<50?.1:.03;
   if(await chance(risk,'단속','그 신문을 판 신문팔이가 그해 붙잡힌 어림 비율')){say((x[3]<0?'시정부 경찰이 왕당 신문 뭉치를 압수하고 그대를 끌고 갔다.':'구 위원회가 그대를 불러 신문의 출처를 캐물었다.')+fx({sus:x[4]+4}));if(x[3]<0||x[4]>=10)rxJail()}
   else fx({sus:Math.round(x[4]/2)});if(x[3]>=60){facRel('cordelier',3);facRel('jacobin',2)}else if(x[3]<0)facRel('royalist',3);else facRel('girondin',2);await done()}},
 {k:'rx_gnoff',n:'국민방위대 장교 선거에 나선다',s:'의지·사교·무예 판정. 동네의 장교가 된다',c:()=>rxGo()&&isM()&&s.age>=21&&inParis()&&T()>=tm(1789,8)&&T()<tm(1795,10)&&!s.flags.rxGN&&(T()>=tm(1792,8)||s.money>=60),inter:async()=>{
   rxOpen('국민방위대 선거','élection des officiers',`${rxQ().n} 대대가 중대장과 부관을 손을 들어 뽑는다. 제복과 칼은 제 돈으로 마련해야 한다.`);
   const {m,why}=md([[s.st.cour>=50,1,'의지'],[s.sk.arms>=30,1,'무예'],[s.st.soc>=55,1,'사교'],[repMod('rloc')>0,1,'이웃의 신망'],[repMod('rloc')<0,-1,'이웃의 불신'],[rxMoodFit(pubPol())<0,-1,'동네와 다른 정치색']]);const r=await roll(m,{label:'장교 선거',why});
   if(r.v>=4){s.flags.rxGN=true;say(`대대가 그대를 ${r.v>=6?'중대장':'부관'}으로 뽑았다. ${crowd('rloc')}`+fx({money:-40,fame:3,inf:3,rloc:2,cour:1,arms:1}),'big');facRel(T()<tm(1792,8)?'feuillant':'jacobin',3)}
   else say('표가 갈렸다. 이웃 정육점 주인이 뽑혔다.'+fx({fame:1,rloc:-1}));reactAfter({a:'bold social'},.6);await done()}},
 {k:'rx_surv',n:'구 감시위원회 위원이 된다',s:'혐의자를 가려낸다. 영향력과 양심 사이',c:()=>rxGo()&&isM()&&s.age>=25&&lit()&&inParis()&&T()>=tm(1793,3)&&T()<tm(1794,8)&&pubPol()>=30,inter:async()=>{
   s.flags.rxSurv=true;const nm=pick(['식료품상 뒤부아','시계공 르메르','과부 마르탱','전직 수도사 페랭','가발 장인 쿠르투아']);
   const i=await Q('감시위원회','comité de surveillance',`${rxQ().sec} 구 감시위원회의 일원이 되었다. 혐의자법 이후 위원회가 증명서를 내주고 체포 영장을 쓴다. 오늘 고발장 한 장이 올라왔다. ‘${jo(nm,'이','가')} 빵을 숨겨 두고 공화국을 욕했다.’ 고발한 자는 그와 빚 문제로 다투던 이웃이다.`,[
    {l:'체포 영장에 서명한다',s:'영향력, 혐의 −. 양심',a:'radical'},{l:'증거가 모자란다며 기각한다',s:'정의. ‘온건파’로 몰릴 수 있다',a:'bold'},{l:'위원직을 내놓는다',s:'',a:'safe'}]);
   if(i===0){say(`${jo(nm,'은','는')} 그날 밤 라포르스 감옥으로 끌려갔다.`+fx({inf:4,sus:-8,vjus:-4,rloc:rxMood()>=50?1:-2,rpeople:1,relite:-2,pol:4}),'big');facRel('jacobin',4)}
   else if(i===1){say(`고발장을 접어 서랍에 넣었다. ${jo(nm,'은','는')} 다음 날 빵 한 덩이를 문 앞에 두고 갔다.`+fx({vjus:4,rloc:2,inf:1}));if(await chance(.15,'역고발','관용을 보인 위원이 ‘온건파’로 고발당한 어림 비율'))say('동료 위원이 그대를 ‘관용파’로 지목하였다.'+fx({sus:12}))}
   else{s.flags.rxSurv=false;say('건강을 핑계로 물러났다.'+fx({sus:4,inf:-1}))}await done()}},
 {k:'rx_tree',n:'자유의 나무를 심는다',s:'이웃과 함께. 성향 +, 이웃 평판',c:()=>rxGo()&&((T()>=tm(1790,5)&&T()<tm(1794,8))||(T()>=tm(1848,3)&&T()<tm(1848,12))),inter:async()=>{
   const y48=T()>=1848;rxOpen('자유의 나무','arbre de la liberté',y48?'2월 혁명 뒤 동네마다 자유의 나무를 심는다. 본당 신부가 나와 나무에 성수를 뿌려 축복한다.':'구민들과 광장에 포플러를 심는다. 포플러(peuplier)는 인민(peuple)을 떠올리게 한다. 붉은 모자를 가지 끝에 씌우고 삼색 리본을 맸다.');
   say(`삽을 들고 흙을 덮었다. ${crowd('rloc')}`+fx({pol:3,rloc:repMod('rloc')>=0?2:1,rpeople:1,faith:y48?1:0,brg:2}));facRel(y48?'republican':'jacobin',2);reactAfter({a:'radical social'},.6);await done()}},
 {k:'rx_grace',n:'갇힌 이를 위해 탄원서를 낸다',s:'공포정치기. 정의, 혐의 +',c:()=>rxGo()&&T()>=tm(1793,9)&&T()<tm(1794,8),inter:async()=>{
   const rr=relsAlive().find(r=>r.fac&&['girondin','feuillant','indulgent','cordelier','royalist'].includes(r.fac));const who=rr?rr.n:pick(['사촌','옛 스승','이웃 공증인','먼 친척 아주머니']);
   const i=await Q('탄원','pétition de grâce',`${jo(who,'이','가')} 혐의자로 갇혔다. 아내와 딸들이 날마다 공안위원회 문 앞에서 기다린다고 한다.`,[
    {l:'공안위원회에 탄원서를 낸다',s:'글·명성 판정',a:'bold family'},{l:'구 위원회에 석방 보증인으로 선다',s:'애국자 증명이 있어야 한다. 위험',a:'bold'},{l:'아무것도 하지 않는다',s:'',a:'safe'}]);
   if(i===2){say(`${who}의 이름을 입에 올리지 않았다.`+fx({vjus:-2}));if(rr)relFx(rr,{close:-10,trust:-10});await done();return}
   const {m,why}=md([[s.sk.pen>=40,1,'문장력'],[pubPol()>=45,1,'애국자의 이력'],[s.fame>=40,1,'이름'],[repMod('rloc')>0,1,'구민의 신망'],[noble(),-1,'귀족 출신'],[greatTerror(),-1,'대공포정치']]);const r=await roll(m+(i===1?1:0),{label:'탄원',why});
   if(r.v>=5){say(`${jo(who,'이','가')} 풀려났다. 문 앞에서 그대 손에 입을 맞추었다.`+fx({vjus:4,rloc:2,sus:i===1?6:3})+(rr?relFx(rr,{close:20,trust:20,resp:10}):''),'big')}
   else{say('탄원서는 답이 없었다.'+fx({sus:i===1?10:5,vjus:2})+(rr?relFx(rr,{trust:8}):''));if(i===1&&await chance(.1,'공범 혐의','보증인이 함께 붙잡힌 어림 비율'))rxJail()}await done()}},
 {k:'rx_jdor',n:'금빛 청년단과 어울린다',s:'테르미도르 뒤 자코뱅 사냥. 상류사회 +, 민중 −',c:()=>rxGo()&&isM()&&s.age<=32&&inParis()&&T()>=tm(1794,9)&&T()<tm(1796,1),inter:async()=>{
   const i=await Q('금빛 청년단','jeunesse dorée','네모난 깃의 연미복, 귀를 덮는 ‘개 귀’ 머리, 납을 박은 몽둥이. 프레롱의 청년들이 「인민의 각성」을 부르며 자코뱅 잔당을 찾아다닌다.',[
    {l:'자코뱅 카페를 습격한다',s:'체력 판정. 위험',a:'royal bold'},{l:'극장에서 배우들에게 「인민의 각성」을 부르게 한다',s:'',a:'royal social'},{l:'빠진다',s:'',a:'safe'}]);
   if(i===2){say('몽둥이를 내려놓았다.');await done();return}
   if(i===0){const r=await roll(md([[s.st.str>=50,1,'체력'],[s.sk.arms>=30,1,'무예']]).m,{label:'패싸움'});say(r.v>=4?'포석 위에서 엎치락뒤치락한 끝에 자코뱅들이 달아났다.'+fx({relite:2,rpeople:-3,pol:-6,cour:2,fame:1}):'상퀼로트의 곤봉에 머리를 맞았다.'+fx({hp:-6,pol:-4,relite:1}))}
   else say('객석이 일어나 「인민의 각성」을 따라 불렀다. 「라 마르세예즈」는 야유에 묻혔다.'+fx({relite:2,rpeople:-1,pol:-4,soc:1}));facRel('thermidor',4);facRel('jacobin',-6);await done()}},
 {k:'rx_neoj',n:'신자코뱅 클럽에 나간다',s:'팡테옹 클럽(1795~96)·마네주 클럽(1799). 혐의 +',c:()=>rxGo()&&inParis()&&((T()>=tm(1795,11)&&T()<tm(1796,3))||(T()>=tm(1799,7)&&T()<tm(1799,9))),inter:async()=>{
   const pan=T()<1797;rxOpen(pan?'팡테옹 클럽':'마네주 클럽',pan?'club du Panthéon':'club du Manège',pan?'팡테옹 옆 생트주느비에브 수도원 지하에서 촛불을 켜고 모인다. 바뵈프의 『호민관』이 돌려 읽힌다.':'옛 국민공회의 마네주 강당. “조국이 위기에 처했다!” 1793년의 구호가 다시 울린다.');
   const r=await roll(md([[s.sk.orat>=40,1,'웅변'],[repMod('rpeople')>0,1,'민중의 신망']]).m,{label:'클럽 연설'});
   say((r.v>=4?'그대의 연설이 박수를 받았다. ':'구석 자리에서 듣기만 했다. ')+(pan?'몇 달 뒤 보나파르트 장군이 클럽 문을 닫았다.':'한 달 만에 경찰장관 푸셰가 클럽을 닫았다.')+fx({pol:5,fame:r.v>=4?2:0,orat:1,sus:6,rpeople:2,relite:-2}));facRel(pan?'babeuf':'neojacobin',5);facRel('thermidor',-3);reactAfter({a:'radical'},.6);await done()}},
 {k:'rx_dvote',n:'총재정부 선거 운동에 뛰어든다',s:'납세자 선거. 어느 편을 밀지 고른다',c:()=>rxGo()&&isM()&&s.age>=21&&s.money>=20&&(([1797,1798,1799].includes(s.year)&&s.month<=3)||(s.year===1795&&s.month>=8&&s.month<=9)),inter:async()=>{
   const y=s.year;const O=y===1795?[{l:'‘3분의 2 법령’에 반대해 새 사람을 뽑자고 한다',s:'왕당·온건',a:'royal',f:'clichy',p:-40},{l:'국민공회 의원들을 다시 뽑자고 한다',s:'공화파',a:'safe',f:'thermidor',p:10}]
    :y===1797?[{l:'클리시 클럽 후보를 민다',s:'왕당·온건. 프뤽티도르에 주의',a:'royal',f:'clichy',p:-40},{l:'총재정부 공화파 후보를 민다',s:'',a:'safe',f:'thermidor',p:10}]
    :[{l:'신자코뱅 후보를 민다',s:'급진. 당선 무효가 될 수 있다',a:'radical',f:'neojacobin',p:55},{l:'총재정부 후보를 민다',s:'',a:'safe',f:'thermidor',p:10}];
   O.push({l:'투표만 한다',s:'',a:'safe',f:null,p:null});
   const i=await Q('선거','élections de l’an '+({1795:'IV',1797:'V',1798:'VI',1799:'VII'}[y]),'1차 선거인 모임이 열린다. 직접세를 내는 남자만 표를 던지고, 선거인단이 의원을 뽑는다.',O);const o=O[i];
   if(!o.f){say('선거인 명부에 이름을 적었다.');await done();return}
   const r=await roll(md([[s.st.soc>=50,1,'사교'],[s.sk.orat>=35,1,'웅변'],[s.fame>=30,1,'명성'],[repMod('rloc')>0,1,'이웃의 신망'],[repMod('rloc')<0,-1,'이웃의 불신']]).m,{label:'선거 운동'});
   say((r.v>=4?'그대가 민 후보가 선거인단에 들었다. ':'그대가 민 후보는 떨어졌다. ')+(y===1798&&o.f==='neojacobin'&&r.v>=4?'그러나 플로레알 22일, 총재정부가 당선을 무효로 했다.':'')+fx({fame:r.v>=4?2:1,inf:r.v>=4?2:0,pol:Math.round((o.p-s.pol)*.1),sus:o.f==='clichy'&&y===1797?4:o.f==='neojacobin'?3:0}));facRel(o.f,5);await done()}},
 {k:'rx_pleb',n:'국민투표 명부에 서명한다',s:'찬반을 공개 명부에 적는다',c:()=>rxGo()&&isM()&&s.age>=21&&!s.flags['rxpl'+s.year]&&((s.year===1799&&s.month===11)||(s.year===1800&&s.month<=1)||(s.year===1802&&s.month>=4&&s.month<=7)||(s.year===1804&&s.month>=4&&s.month<=7)||(s.year===1815&&s.month>=3&&s.month<=4)),inter:async()=>{
   const y=s.year;s.flags['rxpl'+(y===1799?1800:y)]=true;s.flags['rxpl'+y]=true;
   const what={1799:'공화력 8년 헌법(제1통령 보나파르트)',1800:'공화력 8년 헌법(제1통령 보나파르트)',1802:'보나파르트의 종신 통령',1804:'나폴레옹의 황제 즉위와 세습',1815:'백일천하의 ‘제국 헌법 추가법’'}[y];
   const no=s.pol<-20?'royal bold':'radical bold';
   const i=await Q('국민투표','plébiscite',`${what}에 대한 국민투표. 비밀투표가 아니다. 시청과 공증인 사무실에 펼쳐 둔 명부에 ‘찬성’ 또는 ‘반대’를 적고 이름을 서명한다.`,[
    {l:'‘찬성(oui)’에 서명한다',s:'',a:'safe'},{l:'‘반대(non)’라고 적는다',s:'지조. 혐의 +',a:no},{l:'명부를 외면한다',s:'',a:'safe'}]);
   if(i===0){say('“찬성.” 이름 옆에 서명하였다.'+fx({inf:1,sus:-2,pol:Math.round((5-s.pol)*.05)}));facRel('bonapartist',4)}
   else if(i===1){say(`“반대.” 명부의 그 쪽에 서명한 이름은 손에 꼽을 만큼이었다.${s.fame>=30?' 그대 이름이 신문에 오르내렸다.':''}`+fx({sus:y===1815?2:6,vhon:3,fame:s.fame>=30?2:0}));facRel('bonapartist',-8);facRel(s.pol<-20?'royalist':'ideologue',4)}
   else say('투표하지 않았다. 대다수가 그렇게 했다.'+fx({vord:1}));await done()}},
 {k:'rx_carbo',n:'카르보나리(숯쟁이당) 지부에 든다',s:'복고왕정 타도 비밀결사. 체포 위험',c:()=>rxGo()&&s.age<=45&&T()>=tm(1821,5)&&T()<tm(1823,6)&&s.pol>=15&&!s.flags.rxCarbo,inter:async()=>{
   const i=await Q('숯쟁이당','Charbonnerie',`스무 명 이하의 ‘방’으로 나뉘어 서로 이름도 모른다. 단도 위에 손을 얹고 맹세한다. 라파예트가 뒤에 있다는 말이 돈다.${T()>=1822?' 벨포르와 소뮈르의 거사는 이미 실패했다.':''}`,[
    {l:'단도 위에 손을 얹고 맹세한다',s:'혐의 +, 자유파의 신뢰',a:'radical bold'},{l:'거절한다',s:'',a:'safe'}]);
   if(i===1){say('그 밤의 일을 아무에게도 말하지 않았다.');await done();return}s.flags.rxCarbo=true;
   say('‘좋은 사촌들’의 방에 들었다. 매달 회비와 탄약 한 갑을 바친다.'+fx({sus:8,pol:4,cour:2,vlib:3,money:-10}));facRel('ideologue',6);facRel('bonapartist',3);facRel('ultra',-8);
   if(await chance(T()>=1822?.15:.08,'밀고','숯쟁이당원이 밀고로 붙잡힌 어림 비율')){say(T()>=tm(1822,9)?'라로셸의 네 하사관이 처형된 그해, 그대의 방에도 밀정이 있었다.':'방장이 붙잡히며 명단이 넘어갔다.','big');rxJail()}await done()}},
 {k:'rx_libf',n:'자유파 장례 행렬·연회에 나간다',s:'복고왕정기 자유파 시위. 민중 +, 상류사회 −',c:()=>rxGo()&&inParis()&&T()>=tm(1820,6)&&T()<tm(1830,7),inter:async()=>{
   const y=s.year;const t=y===1820?'이중 투표법 반대 시위 중 근위병의 총에 죽은 학생 랄르망의 장례 행렬.':y===1825?'푸아 장군의 장례식. 10만 명이 빗속을 따라 걷는다. 그의 자식들을 위한 모금이 100만 프랑을 넘었다.':y===1827?'하원에서 쫓겨났던 마뉘엘 의원의 장례식. 경찰이 상여를 끌던 젊은이들과 실랑이를 벌인다.':y>=1829?'‘하늘은 스스로 돕는 자를 돕는다’ 협회가 자유파 의원들을 위한 연회를 연다.':'자유파 의원의 당선을 축하하는 연회.';
   const i=await Q('자유파 행렬','cortège libéral',t,[{l:'행렬 앞에서 구호를 외친다',s:'혐의 +',a:'radical bold'},{l:'조용히 따라 걷는다',s:'',a:'social'},{l:'모금에 돈만 낸다',s:'',a:'safe'}]);
   if(i===0){say(`“헌장 만세!” 그대의 목소리가 행렬을 따라 번졌다. ${crowd('rpeople')}`+fx({rpeople:3,relite:-2,fame:2,sus:4,pol:3,vlib:2}));if((y===1820||y===1827)&&await chance(.05,'체포','시위 가담자가 붙잡힌 어림 비율'))rxJail()}
   else if(i===1)say('수천 명 사이에 섞여 말없이 걸었다.'+fx({rpeople:1,pol:2}));else say('모금함에 돈을 넣었다.'+fx({money:-Math.min(s.money,20),rloc:1}));facRel('ideologue',4);facRel('ultra',-3);await done()}},
 {k:'rx_barr',n:'바리케이드에 선다',s:'봉기의 날. 의지 판정. 목숨을 건다',c:()=>rxGo()&&s.age<=60&&inParis()&&!!rxBarr(),inter:async()=>{const B=rxBarr();
   const i=await Q(B.n,B.fr,B.d,[{l:'총을 들고 바리케이드를 지킨다',s:'의지·무예 판정. 위험',a:'radical bold'},{l:'포석을 나르고 부상자를 돌본다',s:'',a:'social radical'},{l:'덧문을 닫고 집에 있는다',s:'',a:'safe family'}]);
   if(i===2){say('덧문 틈으로 총성을 들었다.'+fx({vfam:1}));await done();return}
   if(i===0){const {m,why}=md([[s.st.cour>=55,1,'의지'],[s.sk.arms>=30,1,'무예'],[s.st.str>=50,1,'체력'],[!B.win,-1,'정부군이 우세']]);const r=await roll(m,{label:'바리케이드',why});
     if(!B.win&&r.v<=2&&await chance(B.dp,'전사',B.why)){die('riot',`${B.n}의 바리케이드에서 쓰러졌다.`);await done();return}
     if(B.win)say(`바리케이드는 무너지지 않았다. ${B.after} ${crowd('rpeople')}`+fx({fame:4,rpeople:5,cour:3,pol:5,hp:r.v<=2?-6:0}),'big');
     else{say(`군대가 바리케이드를 넘었다. ${B.after}`+fx({hp:-5,sus:12,pol:4,rpeople:3}),'big');if(await chance(.25,'체포','진압 뒤 붙잡힌 가담자 비율'))rxJail()}}
   else say(`밤새 포석을 날랐다. 성당 계단에 누운 부상자들의 붕대를 갈았다.${B.win?' '+B.after:''}`+fx({rpeople:3,rloc:2,pol:3,heal:1}));
   facRel('republican',4);await done()}},
 {k:'rx_sdh',n:'인권협회 지부 모임에 나간다',s:'공화파 결사(1832~34). 혐의 +',c:()=>rxGo()&&urban()&&T()>=tm(1832,1)&&T()<tm(1834,5)&&s.pol>=25,inter:async()=>{
   const i=await Q('인권협회','Société des droits de l’homme','형법 291조를 피해 스무 명 이하의 지부로 모인다. 로베스피에르의 인권 선언을 소리 내어 읽는다. 지부마다 ‘로베스피에르’, ‘1793년’ 같은 이름이 붙어 있다.',[
    {l:'지부장을 맡는다',s:'명성·혐의 +',a:'radical bold'},{l:'회비만 낸다',s:'',a:'radical safe'},{l:'발을 끊는다',s:'',a:'safe'}]);
   if(i===2){say('모임에 나가지 않았다.');await done();return}
   say(i===0?'스무 명의 지부를 맡아 매주 신문을 읽히고 회비를 걷었다.'+fx({fame:2,sus:8,orat:2,pol:4,rpeople:2,inf:1}):'달마다 25상팀 회비를 냈다.'+fx({sus:3,pol:2,money:-2}));facRel('republican',i===0?6:3);facRel('doctrinaire',-3);
   if(T()>=tm(1834,3)&&await chance(i===0?.3:.08,'4월 검거','결사법 이후 지부장과 회원이 붙잡힌 어림 비율')){say('결사법이 통과되자 경찰이 지부 명단을 들고 왔다. ‘4월 사건’ 피고 명단에 이름이 올랐다.','big');rxJail()}await done()}},
 {k:'rx_banq',n:'선거법 개혁 연회에 간다',s:'7월 왕정의 반대파 연회. 회비',c:()=>rxGo()&&s.age>=21&&urban()&&((s.year===1840&&s.month>=5&&s.month<=9)||(T()>=tm(1847,7)&&T()<tm(1848,3))),inter:async()=>{
   const t=s.year===1840?'벨빌과 지방 곳곳에서 선거법 개혁을 요구하는 연회가 열린다. 집회가 금지되어 있어 ‘연회’라는 이름을 빌린다.':'샤토루주 연회로 시작된 개혁 연회 운동. 라마르틴과 르드뤼롤랭이 지방을 돌며 건배사를 한다. 정부는 파리 12구 연회를 금지하려 한다.';
   const i=await Q('개혁 연회','banquet réformiste',t,[{l:'“개혁 만세!” 건배사를 제의한다',s:'웅변 판정',a:'radical social'},{l:'‘왕의 건강을 위하여’ 건배를 빼자고 한다',s:'혐의 +',a:'radical bold'},{l:'식사만 하고 듣는다',s:'',a:'social'}]);
   fx({money:-Math.min(s.money,10)});
   if(i===0){const r=await roll(md([[s.sk.orat>=40,1,'웅변'],[repMod('relite')<0,-1,'명사들의 불신']]).m,{label:'건배사'});say(r.v>=4?`잔이 일제히 올라갔다. ${crowd('relite')}`+fx({fame:3,orat:2,pol:3,inf:2}):'건배사가 길어져 모두 수프가 식었다.'+fx({fame:1}))}
   else if(i===1)say('왕을 위한 건배가 빠졌다. 이튿날 정부 신문이 이 연회를 ‘공화파 모임’이라 불렀다.'+fx({sus:4,pol:5,rpeople:2,relite:-2}));else say('양고기와 연설을 함께 삼켰다.'+fx({soc:1,pol:1}));
   facRel('republican',3);facRel('doctrinaire',-3);await done()}},
 {k:'rx_ultra',n:'신앙·자선 결사에 든다',s:'복고왕정의 성모회·선행회. 상류사회 +, 신앙 +',c:()=>rxGo()&&s.faithKind==='catholic'&&T()>=tm(1815,7)&&T()<tm(1830,8)&&(s.pol<=0||s.faith>=60),inter:async()=>{
   const i=await Q('신앙 결사','Congrégation · Bonnes Œuvres','성모회(콩그레가시옹)와 선행회가 빈민 구호와 감옥 방문, 선교회를 꾸린다. 자유파 신문은 이를 ‘예수회의 그림자 정부’라 부른다.',[
    {l:'빈민과 감옥 방문을 맡는다',s:'',a:'pious social'},{l:'선교회 십자가 건립에 헌금한다',s:'',a:'pious royal'},{l:'사양한다',s:'',a:'safe'}]);
   if(i===2){say('정중히 사양하였다.');await done();return}
   if(i===0)say('겨울 내내 생트펠라지 감옥과 다락방 빈민을 찾아 수프와 담요를 날랐다.'+fx({faith:3,relite:2,rloc:2,inf:2,vjus:1}));else say('광장에 선교회의 커다란 십자가가 섰다. 그대 이름이 기부자 명단 앞쪽에 있었다.'+fx({money:-Math.min(s.money,40),faith:2,relite:3,rpeople:-2,inf:2,brl:-3}));
   facRel('ultra',5);facRel('ideologue',-3);await done()}},
 {k:'rx_bonap',n:'보나파르트파 비밀 모임에 나간다',s:'황제를 그리는 이들. 혐의 +',c:()=>rxGo()&&((T()>=tm(1815,8)&&T()<tm(1822,1))||(T()>=tm(1836,9)&&T()<tm(1840,9)))&&s.pol>=-10&&(s.flags.bonap||s.flags.centjours||s.cnt.battle>0||soldier()||s.pol>=10),inter:async()=>{
   const early=T()<1830;const i=await Q('제비꽃 모임','les violettes',early?'반쯤 봉급을 받는 퇴역 장교들이 카페 레몽블랭 뒷방에 모인다. 단추 구멍에 제비꽃을 꽂으면 ‘제비꽃 아저씨(황제)’가 봄에 돌아온다는 뜻이다.':'황제의 조카 루이 나폴레옹이 군대를 일으킬 날을 기다리는 사람들이 모인다.',[
    {l:'비밀 맹세를 한다',s:'혐의 +',a:'radical bold'},{l:'황제의 노래를 부르며 술잔만 기울인다',s:'',a:'social'},{l:'발을 끊는다',s:'',a:'safe'}]);
   if(i===2){say('그 카페에 다시 가지 않았다.');await done();return}
   say(i===0?'촛불 아래 독수리 문장에 손을 얹었다.'+fx({sus:8,cour:2,pol:2}):'「출정가」를 낮게 불렀다.'+fx({sus:2,soc:1}));facRel('bonapartist',i===0?8:3);facRel('ultra',-4);
   if(i===0&&await chance(early?.1:.06,'밀정','비밀 모임에 경찰 밀정이 섞여 있던 비율')){say(early?'1820년 8월 ‘바자르 프랑세’ 음모가 들통나며 명단이 넘어갔다.':'스트라스부르 거사가 실패하자 경찰이 연락책을 쫓았다.','big');rxJail()}await done()}},
 {k:'rx_frat',n:'애국 우애협회에 나간다',s:'남녀가 함께하는 민중 클럽(1790~95). 여성은 1793년 혁명공화주의 여성협회',c:()=>rxGo()&&inParis()&&T()>=tm(1790,2)&&T()<tm(1795,6),inter:async()=>{
   const wc=!isM()&&T()>=tm(1793,5)&&T()<tm(1793,11);
   const O=[{l:'인권 선언을 소리 내어 읽어 준다',s:'글 모르는 이웃들에게',a:'radical study'},{l:'토론에 나서 발언한다',s:'웅변 판정',a:'radical bold'},{l:'방청만 한다',s:'',a:'safe'}];if(wc)O.splice(1,0,{l:'혁명공화주의 여성협회에 든다',s:'레옹·라콩브의 여성 결사. 위험',a:'radical bold'});
   const i=await Q('우애협회','Société fraternelle des deux sexes','자코뱅 수도원 아래층 강당. 장인과 아낙들이 모여 법령을 읽고 토론한다. 회비는 거의 없다.',O);const o=O[i];
   if(o.l.startsWith('혁명공화주의')){say('붉은 모자를 쓰고 폴린 레옹의 행렬에 섰다. 10월, 국민공회가 모든 여성 클럽을 금지하였다.'+fx({pol:6,sus:6,fame:2,cour:2,rpeople:2}),'big');facRel('cordelier',4);await done();return}
   if(i===0)say('이웃들이 고개를 끄덕이며 들었다.'+fx({pol:2,rloc:2,pen:1,rpeople:1}));
   else if(o.a==='safe')say('뒤쪽 자리에서 토론을 들었다.'+fx({pol:1}));
   else{const r=await roll(md([[s.sk.orat>=35,1,'웅변'],[repMod('rloc')>0,1,'이웃의 신망']]).m,{label:'토론'});say(r.v>=4?`박수가 터졌다. ${crowd('rpeople')}`+fx({fame:2,orat:2,pol:3,rpeople:2}):'말이 꼬였다.'+fx({orat:1}))}
   facRel('jacobin',2);facRel('cordelier',2);await done()}}
);
// 봉기의 날(바리케이드): 그 달에만
function rxBarr(){const y=s.year,m=s.month;
  if(y===1830&&(m===6||m===7))return {n:'영광의 사흘',fr:'Trois Glorieuses',d:'칙령에 맞서 파리가 일어났다. 골목마다 포석을 뜯고 마차를 엎어 바리케이드를 쌓는다.',win:true,after:'사흘 만에 샤를 10세가 물러났다.'};
  if(y===1832&&m===5)return {n:'라마르크 장군 장례 봉기',fr:'juin 1832',d:'라마르크 장군의 장례 행렬에서 붉은 깃발이 올랐다. 생메리 수도원 거리에 바리케이드가 섰다.',win:false,dp:.08,why:'6월 봉기 가담자 가운데 죽은 이의 어림 비율',after:'생메리 거리의 마지막 바리케이드가 포격에 무너졌다.'};
  if(y===1834&&m===3)return {n:'4월 봉기',fr:'avril 1834',d:'리옹의 견직공 봉기 소식에 파리 공화파가 일어났다. 마레의 트랑스노냉 거리에 바리케이드가 선다.',win:false,dp:.08,why:'4월 봉기 가담자 가운데 죽은 이의 어림 비율',after:'트랑스노냉 거리 12번지에서 군대가 주민들까지 죽였다.'};
  if(y===1839&&m===4)return {n:'계절협회 봉기',fr:'12 mai 1839',d:'블랑키와 바르베스의 계절협회가 무기 상점을 털고 시청으로 향한다.',win:false,dp:.08,why:'5월 12일 봉기 가담자 가운데 죽은 이의 어림 비율',after:'하루 만에 진압되었다. 바르베스는 사형을 선고받았다가 감형되었다.'};
  if(y===1848&&(m===1||m===2))return {n:'2월 혁명',fr:'février 1848',d:'개혁 연회가 금지되자 파리에 바리케이드 1,500개가 섰다. 국민방위대도 군대 편을 들지 않는다.',win:true,after:'루이 필리프가 물러나고 공화국이 선포되었다.'};
  if(y===1848&&m===5)return {n:'6월 봉기',fr:'journées de Juin',d:'국립작업장이 폐쇄되었다. 생탕투안 문밖과 생마르소 노동자들이 바리케이드를 쌓는다.',win:false,dp:.1,why:'6월 봉기 가담자 가운데 죽은 이의 어림 비율',after:'카베냐크 장군의 대포가 바리케이드를 부쉈다. 1만여 명이 붙잡혔다.'};
  return null}
