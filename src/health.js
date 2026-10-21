/* ================= 병: 건강이 낮을수록 병에 잘 걸린다 =================
   해마다 걸릴 확률(inc)과 걸린 사람 가운데 죽는 비율(cfr)은 당대 기록을 단순화한 값이다.
   - 천연두: 18세기 사망의 약 10%, 걸린 이의 약 15%(아이 20%)가 죽었다. 1800년 제너 종두가 들어온 뒤 크게 줄었다 (Darmon, La longue traque de la variole).
   - 이질: 1779년 서부(브르타뉴·앙주·멘)에서 약 17만5천 명이 죽었다 (Lebrun; Goubert).
   - 발진티푸스: 감옥·군대·포위전의 병. 1813~14년 라인 전선과 알자스·로렌에서 크게 돌았다.
   - 간헐열(말라리아): 랑드, 카마르그, 동브, 방데 습지대 같은 늪 지방의 여름·가을 병.
   - 폐결핵: 도시 젊은 성인의 주요 사인. 오래 앓다 죽는다.
   - 콜레라: 1832년 3~9월 파리에서 약 18,400명(인구의 2.3%) 사망, 걸린 이의 절반가량이 죽었다. 1849년 다시 돌았다 (Bourdelais & Raulot).
   - 유행성 감기(라 그리프): 1775, 1780, 1782, 1803, 1831, 1833, 1837년.
   - 펠라그라: 1818년 무렵부터 옥수수 죽에 기대던 랑드 농민 사이에 퍼졌다. */
const mo=()=>s.month+1;
const inMo=(...ms)=>{for(let k=0;k<tickMonths();k++){const m=((s.month-k)%12+12)%12+1;if(ms.includes(m))return true}return false};
const MARSH=()=>['gascogne','provence','vendee'].includes(loc())||(loc()==='lyon'&&!urban())||(loc()==='bretagne'&&R()<.3);
const DISEASES=[
 {k:'pox',n:'천연두',fr:'petite vérole',inc:()=>s.flags.pox||s.flags.vacc?0:(T()<1801?(s.age<10?.04:.01):(s.age<10?.02:.004)),cfr:()=>s.age<5?.2:.15,sev:25,mo:1,after:()=>{s.flags.pox=true;if(R()<.6){s.flags.pocks=true;fxAttr('relite',-2);L('얼굴에 곰보 자국이 남았다.','sys')}}},
 {k:'measles',n:'홍역',fr:'rougeole',inc:()=>s.flags.measles||s.age>=12?0:.05,cfr:()=>s.age<3?.08:.03,sev:12,mo:1,after:()=>{s.flags.measles=true}},
 {k:'whoop',n:'백일해',fr:'coqueluche',inc:()=>s.flags.whoop||s.age>=8?0:.05,cfr:()=>s.age<2?.1:.02,sev:10,mo:2,after:()=>{s.flags.whoop=true}},
 {k:'croup',n:'디프테리아',fr:'croup',inc:()=>s.age<12?.004:.0005,cfr:()=>.3,sev:20,mo:1},
 {k:'dys',n:'이질',fr:'dysenterie',inc:()=>!inMo(7,8,9,10)?0:(s.year===1779&&['bretagne','vendee','normandie','nantes'].includes(loc())?.25:(price(s.year)>=1.5?.05:.015))*(s.age<5?1.6:1),cfr:()=>s.age<5||s.age>=60?.2:.08,sev:18,mo:1},
 {k:'typhus',n:'발진티푸스',fr:'typhus',inc:()=>s.cond==='prison'?.18:(soldier()&&atWar())?.08:(s.year>=1813&&s.year<=1814&&['alsace','champagne','picardie'].includes(loc()))?.06:(s.year>=1793&&s.year<=1796&&loc()==='vendee')?.04:price(s.year)>=1.6?.012:.003,cfr:()=>s.age>=40?.25:.15,sev:22,mo:1},
 {k:'typhoid',n:'장티푸스',fr:'fièvre putride',inc:()=>urban()?.007:.004,cfr:()=>.12,sev:18,mo:2},
 {k:'ague',n:'간헐열',fr:'fièvre intermittente',inc:()=>MARSH()&&inMo(7,8,9,10)?.12:0,cfr:()=>s.age<5?.05:.015,sev:10,mo:2,chronic:.35},
 {k:'phthisis',n:'폐결핵',fr:'phtisie',inc:()=>s.age<15||s.flags.phthisis?0:(urban()?.005:.0025)*(s.cond==='prison'?3:1),cfr:()=>0,sev:8,mo:3,chronic:1},
 {k:'pneu',n:'늑막염',fr:'fluxion de poitrine',inc:()=>inMo(11,12,1,2,3)?(s.age>=50?.035:.008):0,cfr:()=>s.age>=65?.35:s.age>=50?.2:.08,sev:18,mo:1},
 {k:'flu',n:'유행성 감기',fr:'la grippe',inc:()=>[1775,1780,1782,1803,1831,1833,1837].includes(s.year)?.3:.02,cfr:()=>s.age>=65?.06:s.age<2?.03:.005,sev:8,mo:1},
 {k:'cholera',n:'콜레라',fr:'choléra morbus',inc:()=>(s.year===1832&&inMo(3,4,5,6,7,8,9)&&(inParis()||['rouen','picardie','ile','marseille','bretagne'].includes(loc()))?(inParis()?.05:.02):0)+(s.year===1849&&inMo(3,4,5,6,7,8,9)&&(inParis()||urban())?(inParis()?.03:.012):0)+(s.year===1835&&inMo(6,7,8,9)&&['marseille','provence'].includes(loc())?.03:0),cfr:()=>.5,sev:30,mo:1},
 {k:'pellagra',n:'펠라그라',fr:'pellagre',inc:()=>s.year>=1818&&loc()==='gascogne'&&s.estate==='peasant'?.015:0,cfr:()=>0,sev:6,mo:3,chronic:1},
 {k:'pox2',n:'매독',fr:'mal vénérien',inc:()=>s.age>=16&&(soldier()||(urban()&&!s.married))?.008:0,cfr:()=>0,sev:5,mo:3,chronic:1}];
const DIS={};DISEASES.forEach(d=>DIS[d.k]=d);
function illName(){return s.ill?DIS[s.ill.k].n:''}
// 건강이 낮을수록, 가난할수록, 기근이 들수록 잘 걸린다
function illMult(){const h=s.st.hp;let m=h<25?3:h<40?2:h<55?1.3:h>=75?.6:1;m*=1.4-hsub('res')/100*.8;
  if(!child()&&s.money<50&&!rich())m*=1.3;if(price(s.year)>=1.5&&!rich())m*=1.25;if(econ().supply<45)m*=1.15;if(rich())m*=.85;if(!s.hard&&s.age<10)m*=.35;return m}
async function illnessTick(){if(s.dead||s.ill)return;const f=s.tick/12;const m=illMult();
  const am=s.age>=14?.7:1;for(const d of DISEASES){let p=d.inc()*m*f*am;if(!p)continue;if(R()<p){await fallIll(d);return}}
  // 오래 앓는 병
  if(s.flags.phthisis&&quarter()&&R()<.035*f*4/(s.st.hp>=50?2:1)){die('ill','폐결핵');return}}
async function fallIll(d){const P=Math.round((1.3-hsub('rec')/100*.6)*d.cfr()*(s.st.hp<30?1.6:s.st.hp<45?1.25:s.st.hp>=70?.7:1)*(s.age>=70?1.4:1)*1000)/1000;
  s.ill={k:d.k,y:s.year};let cfr=P;
  if(!child()&&cfr>=.08&&s.cond==='normal'){const doc=Math.max(10,Math.round(s.money*.03));
    const i=await Q(`${d.n}`,d.fr,`${d.n}에 걸렸다. 열이 오르고 자리에서 일어나지 못한다.`,[{l:'의사를 부른다',s:`재산 -${doc}. 사혈과 하제, 키나 껍질`,a:'safe',dis:s.money<doc},{l:urban()?'시립 병원(오텔디외)에 간다':'이웃 아낙의 민간요법을 쓴다',s:urban()?'돈은 들지 않으나 병원은 붐비고 위험하다':'약초와 기도',a:'greedy'},{l:'성인에게 기도한다',s:'신앙에 기댄다',a:'pious'}]);
    if(i===0){fx({money:-doc});cfr*=d.k==='ague'?.5:.88}else if(i===1&&urban())cfr*=1.25;else if(i===2&&s.faith>=60)fx({faith:2});await done()}
  if(await chance(cfr,`${d.n} 사망`,`이 병에 걸린 사람이 죽은 비율 · 건강 ${s.st.hp}`)){die('ill',d.n);return}
  const sev=d.sev;say(`${d.n}${bat(d.n)?'을':'를'} 앓았다.${d.mo>1?` ${d.mo}달 넘게 앓아누웠다.`:''}`+fx({hp:-sev,str:-Math.round(sev/4)}),sev>=18?'big':'ev');
  if(d.after)d.after();if(d.chronic&&R()<d.chronic){s.flags[d.k==='phthisis'?'phthisis':d.k]=true;if(d.k==='phthisis')L('기침이 멎지 않는다. 폐병이 깊어졌다.','sys')}
  s.illLoss=(s.illLoss||0)+d.mo;s.ill=null}
// 해마다: 오래 앓는 병의 영향
function illYear(){if(!s.flags.phthisis&&!s.flags.pellagra){if(s.st.hp<45)s.st.hp=clamp(s.st.hp+ri(3,5)+Math.round(hsub('rec')/30),0,100);else if(s.st.hp<58)s.st.hp=clamp(s.st.hp+2,0,100)}
  if(s.year>=1801&&s.age<20&&!s.flags.pox&&!s.flags.vacc&&R()<(s.year<1810?.06:.1)*(urban()?1.5:1)){s.flags.vacc=true;L('제너의 우두 종두를 맞았다. 이제 천연두를 겁내지 않아도 된다.','sys')}if(s.flags.phthisis)fx({hp:-3,str:-1});if(s.flags.ague&&R()<.5)fx({hp:-2});if(s.flags.pellagra)fx({hp:-2,edu:-1});if(s.flags.pox2)fx({hp:-1})}
