/* ================= 정치: 파벌 · 강령 · 성향 =================
   성향 점수 s.pol: -100(절대왕정) … +100(급진 상퀼로트). 해마다 s.polHist에 남는다.
   파벌은 실제로 존재한 기간에만 나타나고, 몰락할 때 소속원은 화를 입는다. */
const tm=(y,m)=>y+(m-3)/12; // T() 눈금으로 바꾼 '연도+달'
// st: 강령 7개(왕정·참정권·재산권·교회·경제·혁명사법·전쟁)에 대한 파벌의 입장(-1 = 입장 없음)
const FACTIONS=[
 {id:'devot',n:'신앙파',fr:'Parti dévot',lead:'보몽 대주교',goal:'교회와 왕권 수호',belief:'신앙과 전통',sup:'성직자·법복귀족 일부',pol:-60,a:1750,b:tm(1789,5),st:[0,0,0,0,-1,-1,-1]},
 {id:'philosophe',n:'철학자파',fr:'Philosophes',lead:'볼테르',goal:'관용과 이성의 개혁',belief:'계몽',sup:'살롱·문필가',pol:20,a:1750,b:tm(1789,5),st:[1,1,1,3,0,0,0]},
 {id:'parlement',n:'고등법원파',fr:'Parlementaires',lead:'데프레메스닐',goal:'왕권 견제와 특권 수호',belief:'왕국의 기본법',sup:'법복귀족·법률가',pol:-15,a:1750,b:tm(1789,5),st:[1,0,1,0,0,1,-1]},
 {id:'absolutist',n:'귀족파',fr:'Aristocrates (les Noirs)',lead:'아르투아 백작',goal:'신분제와 구체제 유지',belief:'왕과 제단',sup:'대귀족·고위 성직자',pol:-80,a:tm(1788,9),b:tm(1792,9),st:[0,0,0,0,0,-1,-1]},
 {id:'monarchien',n:'군주제파',fr:'Monarchiens',lead:'무니에',goal:'영국식 양원제 입헌군주정',belief:'왕의 절대 거부권',sup:'자유주의 귀족·법률가',pol:-35,a:tm(1789,5),b:tm(1790,12),st:[1,1,1,0,0,1,0]},
 {id:'patriote',n:'애국파',fr:'Parti patriote',lead:'미라보',goal:'헌법 제정과 특권 폐지',belief:'국민주권',sup:'제3신분 대표',pol:15,a:tm(1788,9),b:tm(1791,7),st:[1,1,2,1,0,1,1]},
 {id:'jacobin',n:'자코뱅·산악파',fr:'Jacobins / Montagnards',lead:'로베스피에르',goal:'단일 불가분의 공화국',belief:'덕과 공포',sup:'상퀼로트·소생산자',pol:60,a:tm(1789,11),b:tm(1794,11),st:[2,3,2,3,1,2,0]},
 {id:'cordelier',n:'코르들리에·에베르파',fr:'Cordeliers / Hébertistes',lead:'에베르',goal:'최고가격제와 비기독교화',belief:'인민의 직접 행동',sup:'파리 빈민·구민회',pol:85,a:tm(1790,4),b:tm(1794,3),st:[2,2,3,2,1,2,2]},
 {id:'feuillant',n:'푀양파',fr:'Feuillants',lead:'라파예트',goal:'입헌군주정 수호',belief:'자유와 질서',sup:'부르주아·국민방위대',pol:-10,a:tm(1791,7),b:tm(1792,9),st:[1,1,1,1,0,1,1]},
 {id:'girondin',n:'지롱드파',fr:'Girondins (Brissotins)',lead:'브리소',goal:'공화국과 혁명 전쟁',belief:'법치와 지방 자치',sup:'상공업 부르주아',pol:25,a:tm(1791,10),b:tm(1793,11),st:[2,2,2,1,0,1,2]},
 {id:'plaine',n:'평원파',fr:'la Plaine (le Marais)',lead:'시에예스',goal:'혁명의 결실을 지키며 살아남기',belief:'중도',sup:'지방 유산층',pol:10,a:tm(1792,9),b:tm(1795,10),st:[2,1,1,1,0,1,1]},
 {id:'indulgent',n:'관용파',fr:'Indulgents',lead:'당통',goal:'공포정치 완화와 평화',belief:'관용',sup:'온건 공화파',pol:40,a:tm(1793,12),b:tm(1794,4),st:[2,2,2,3,0,0,0]},
 {id:'royalist',n:'왕당파',fr:'Royalistes',lead:'프로방스 백작',goal:'부르봉 왕정 복고',belief:'왕과 제단',sup:'망명 귀족·방데 농민',pol:-70,a:tm(1792,9),b:tm(1814,4),st:[0,0,0,0,0,-1,0]},
 {id:'thermidor',n:'테르미도르파',fr:'Thermidoriens',lead:'바라스',goal:'공포 청산과 재산 질서',belief:'유산자의 공화국',sup:'부유층·금빛 청년단',pol:5,a:tm(1794,8),b:tm(1799,11),st:[2,1,2,3,0,1,2]},
 {id:'babeuf',n:'평등파',fr:'Conjuration des Égaux',lead:'바뵈프',goal:'토지 공유와 1793년 헌법',belief:'완전한 평등',sup:'파리 빈민·옛 자코뱅',pol:95,a:tm(1795,10),b:tm(1797,6),st:[2,2,3,2,1,2,1]},
 {id:'clichy',n:'클리시파',fr:'Club de Clichy',lead:'피슈그뤼',goal:'합법적 왕정 복고',belief:'질서와 신앙',sup:'지방 유산층·가톨릭',pol:-45,a:tm(1795,6),b:tm(1797,10),st:[1,1,1,0,0,0,0]},
 {id:'neojacobin',n:'신자코뱅',fr:'Néo-Jacobins',lead:'주르당',goal:'공화국 수호',belief:'조국이 위기에',sup:'군인·옛 상퀼로트',pol:55,a:tm(1797,10),b:tm(1799,12),st:[2,2,2,3,1,2,2]},
 {id:'ideologue',n:'자유파',fr:'Idéologues / Libéraux',lead:'뱅자맹 콩스탕',goal:'대의정치와 개인의 자유',belief:'자유주의',sup:'학자·문필가',pol:20,a:tm(1795,10),b:tm(1830,8),st:[1,1,1,3,0,1,0]},
 {id:'bonapartist',n:'보나파르트파',fr:'Bonapartistes',lead:'나폴레옹',goal:'강한 국가로 혁명의 결실 보존',belief:'영광과 능력주의',sup:'군대·농민·신흥 명사',pol:0,a:tm(1799,11),b:1900,st:[-1,3,2,1,0,1,2]},
 {id:'ultra',n:'극우 왕당파',fr:'Ultras',lead:'아르투아 백작',goal:'구체제 복원',belief:'왕좌와 제단',sup:'귀국 망명 귀족',pol:-80,a:tm(1814,4),b:tm(1830,8),st:[0,0,0,0,0,2,0]},
 {id:'doctrinaire',n:'독트리네르',fr:'Doctrinaires',lead:'기조',goal:'헌장에 따른 입헌왕정',belief:'이성의 주권',sup:'명사층',pol:-5,a:tm(1814,4),b:tm(1848,2),st:[1,1,1,3,0,1,0]},
 {id:'republican',n:'공화파',fr:'Républicains',lead:'르드뤼롤랭',goal:'공화국과 보통선거',belief:'1792년의 이상',sup:'학생·노동자',pol:55,a:tm(1830,8),b:1900,st:[2,2,2,3,0,1,1]},
 {id:'legitimist',n:'정통왕조파',fr:'Légitimistes',lead:'샹보르 백작',goal:'부르봉 장자계 복위',belief:'정통성',sup:'서부 귀족·성직자',pol:-70,a:tm(1830,8),b:1900,st:[0,1,1,0,0,1,0]}
];
const FAC={};FACTIONS.forEach(f=>FAC[f.id]=f);
const ISSUES=[
 {id:'crown',n:'왕정',fr:'Le Roi',opts:[['절대왕정',-80],['입헌군주정',-15],['공화정',50]]},
 {id:'vote',n:'참정권',fr:'Le suffrage',opts:[['신분별 투표',-70],['납세자 선거',-10],['남성 보통선거',55],['혁명정부(선거 중단)',75]]},
 {id:'prop',n:'재산권',fr:'La propriété',opts:[['영주권 보호',-75],['사유재산 보호',-10],['국유재산 매각',25],['농지 분배',85]]},
 {id:'church',n:'교회',fr:'L’Église',opts:[['가톨릭 국교',-60],['성직자 시민헌법',20],['비기독교화',80],['신앙의 자유',30]]},
 {id:'econ',n:'경제',fr:'Les subsistances',opts:[['곡물 자유 거래',-5],['최고가격제',70]]},
 {id:'justice',n:'혁명 사법',fr:'La justice',opts:[['관용',-20],['공정한 재판',10],['공포와 처형',80]]},
 {id:'war',n:'전쟁',fr:'La guerre',opts:[['평화',-10],['방어전',15],['혁명 수출',40]]}
];
const PRANK=['지지자','회원','연사','지도부'];
const politic=()=>!!s.party||s.plan==='정치'||((lit()||urban())&&s.age>=18&&R()<.7);
function activeFactions(t=T()){return FACTIONS.filter(f=>t>=f.a&&t<f.b)}
function party(){return s.party?FAC[s.party]:null}
function affinity(f){let a=100-Math.abs(s.pol-f.pol)*.9;
  ISSUES.forEach((iss,k)=>{const mine=s.stance[iss.id],theirs=f.st[k];if(mine==null||theirs<0)return;a+=mine===theirs?7:-5});
  if(s.party===f.id)a+=10;a+=frelOf(f.id)*.15;return clamp(Math.round(a),0,100)}
// 소속 파벌이 지금 권력과 얼마나 맞는가(선거·위험에 쓰인다)
const RULING=t=>t<tm(1789,5)?['devot','parlement']:t<tm(1791,7)?['patriote']:t<tm(1791,10)?['feuillant','jacobin']:t<tm(1793,6)?['girondin','jacobin']:t<tm(1794,8)?['jacobin']:t<tm(1797,4)?['thermidor','plaine']:t<tm(1797,9)?['clichy','thermidor']:t<tm(1799,11)?['thermidor','neojacobin']:t<tm(1814,4)?['bonapartist']:t<tm(1830,8)?['ultra','doctrinaire']:t<tm(1848,2)?['doctrinaire']:['republican'];
function partyFit(){if(!s.party)return 0;return RULING(T()).includes(s.party)?1:-1}
function setStance(id,i,pub){const iss=ISSUES.find(x=>x.id===id);if(!iss)return;const prev=s.stance[id];s.stance[id]=i;
  const v=iss.opts[i][1];const d=Math.round((v-s.pol)*.2);s.pol=clamp(s.pol+d,-100,100);stanceBelief(id,v);if(pub)frelStance(id,v);
  if(pub&&prev!==i){const txt=`‘${iss.n}’에 대해 ${iss.opts[i][0]} 입장을 밝혔다.`;
    let sus=0;if(inTerror()&&v<10)sus=8;if(T()>=tm(1815,7)&&T()<tm(1830,8)&&v>40)sus=4;
    say(txt+fx({fame:s.party?1:0,sus}),'sys')}}
function joinParty(id,auto){const f=FAC[id];if(!f)return;if(s.party===id)return;
  const was=s.party;s.party=id;s.prank=auto?Math.max(1,s.prank&&was?s.prank-1:1):0;s.partySince=T();
  if(['jacobin','cordelier','neojacobin'].includes(id))s.flags.club=true;if(id==='girondin')s.flags.girondin=true;if(id==='bonapartist')s.flags.bonap=true;
  say(`${f.n}에 ${auto?'몸담게':'들어가게'} 되었다. 지도자는 ${f.lead}.`+fx({pol:Math.round((f.pol-s.pol)*.15)}),'big');frelJoin(id)}
function leaveParty(why){if(!s.party)return;const f=FAC[s.party];frelAdd(f.id,-20);s.party=null;s.prank=0;say(why||`${jo(f.n,'을','를')} 떠났다.`)}
// 파벌의 초대: 그 파벌 성향과 가깝고 정치에 관심 있는 사람에게만
async function partyInvite(id,force){const f=FAC[id];if(!f||!adult()||s.age<18||s.party===id)return;if(!(T()>=f.a&&T()<f.b))return;
  if(affinity(f)<(force?55:60))return;if(!force&&(!(s.plan==='정치'||lit()||urban()||s.fame>=20)||R()>.6))return;
  const i=await Q(`${f.n}의 초대`,f.fr,`${f.lead}${bat(f.lead)?'을':'를'} 따르는 이들이 모임에 나오라고 권한다. 목표: ${f.goal}. 지지층: ${f.sup}.`,[{l:'가입한다',s:`성향 친밀도 ${affinity(f)}%`,a:'social radical'},{l:'사양한다',s:'',a:'safe'}]);
  if(i===0)joinParty(id);else say('정중히 사양하였다.');await done()}
async function partySplit(){if(s.party!=='jacobin'&&s.party!=='patriote')return;
  const i=await Q('클럽의 분열','scission des Feuillants','왕을 폐위할 것인가. 라파예트와 바르나브가 자코뱅을 떠나 푀양 수도원으로 간다. 어느 쪽에 남겠는가.',[{l:'자코뱅에 남는다 (폐위 찬성)',s:'',a:'radical'},{l:'푀양파로 간다 (입헌군주정 수호)',s:'',a:'safe'}]);
  if(i===0){joinParty('jacobin');setStance('crown',2,true)}else{joinParty('feuillant');setStance('crown',1,true)}await done()}
// 파벌 몰락: 소속원은 지위(prank)에 따라 혐의·체포·처형을 겪는다
const PURGE={
 feuillant:{t:'푀양파의 몰락',d:'라파예트가 달아나고 입헌군주파는 ‘반혁명’으로 몰렸다.',sus:[5,15,25,35],arrest:[0,.05,.15,.3],death:.2},
 girondin:{t:'지롱드파 숙청',d:'지롱드파 지도자들이 체포되었다. 당원 명부가 구 위원회로 넘어갔다.',sus:[10,20,35,50],arrest:[.02,.15,.4,.7],death:.4},
 cordelier:{t:'에베르파 숙청',d:'“극단파”가 외국의 음모에 가담했다는 죄목으로 재판에 넘겨졌다.',sus:[5,15,30,45],arrest:[0,.08,.35,.7],death:.6},
 indulgent:{t:'관용파 숙청',d:'당통과 데물랭이 “관용”을 외친 죄로 처형되었다.',sus:[5,15,30,45],arrest:[0,.08,.35,.7],death:.6},
 jacobin:{t:'테르미도르 반동',d:'로베스피에르를 따르던 이들이 “꼬리”로 몰려 사냥당했다.',sus:[10,20,35,50],arrest:[.02,.1,.3,.6],death:.35},
 babeuf:{t:'평등파 검거',d:'경찰 첩자가 바뵈프 일당의 명단을 넘겼다.',sus:[10,20,35,50],arrest:[.05,.25,.5,.8],death:.1},
 clichy:{t:'프뤽티도르 숙청',d:'왕당파 의원과 신문 발행인들이 기아나 유형에 처해졌다.',sus:[5,15,30,45],arrest:[0,.05,.25,.5],death:.3},
 neojacobin:{t:'브뤼메르 이후',d:'통령정부가 자코뱅 잔당 명단을 만들었다.',sus:[5,10,20,30],arrest:[0,.02,.1,.25],death:0}
};
async function purge(id){const P=PURGE[id];if(s.dead)return;if(s.party!==id){await relPurge(id);return}const r=s.prank;
  if(s.cond!=='normal'){fx({sus:P.sus[r]});return}
  sheetOpen(P.t,FAC[id].fr);shText(P.d,'q b');fx({sus:P.sus[r]});
  if(await chance(P.arrest[r],'체포',`${PRANK[r]}급 당원이 붙잡힌 비율`)){s.cnt.arrest++;
    if(P.death&&await chance(P.death,'재판','붙잡힌 이들 가운데 처형된 비율')){die(id==='clichy'?'deported':'guillotine');await done();return}
    s.cond='prison';s.prisonKind=inTerror()?'terror':'plain';s.condSince=T();say('감옥에 갇혔다.','big')}
  else say(r>=2?'이름을 바꾸고 몸을 숨겨 화를 면했다.':'명부에서 이름이 빠져 화를 면했다.');
  const succ={jacobin:null,girondin:null,feuillant:null}[id];leaveParty(`${jo(FAC[id].n,'은','는')} 무너졌다.`);if(succ)joinParty(succ,true);
  await done()}
// 파벌이 사라지면 자연스레 이어지는 쪽으로 옮긴다
const SUCC={devot:'absolutist',parlement:'patriote',philosophe:'patriote',patriote:null,absolutist:'royalist',monarchien:'feuillant',plaine:'thermidor',thermidor:'bonapartist',royalist:'ultra',clichy:'royalist',ultra:'legitimist',doctrinaire:null,ideologue:'doctrinaire',neojacobin:null,babeuf:null};
async function partyTick(){if(!s.party){if(s.month===0&&adult()&&s.age>=18&&T()>=tm(1788,9)&&R()<.3){const best=activeFactions().filter(f=>affinity(f)>=55).sort((a,b)=>affinity(b)-affinity(a))[0];if(best)await partyInvite(best.id,true)}return}const f=party();if(T()<f.b)return;
  const nx=SUCC[f.id]!==undefined?SUCC[f.id]:null;const old=f.n;s.party=null;
  if(nx&&FAC[nx]&&T()>=FAC[nx].a&&T()<FAC[nx].b){s.party=nx;say(`${old}의 사람들은 이제 ${jo(FAC[nx].n,'으로')} 불린다.`,'sys')}
  else if(f.id==='patriote'){joinParty(s.pol>=10?'jacobin':'feuillant',true)}
  else say(`${jo(old,'은','는')} 역사 속으로 사라졌다.`,'sys')}
// 1790년 첫 시정부 선거
async function municipal(){if(!adult()||!isM()||s.age<25||s.money<60||s.job==='p1'||s.job==='p2'||deputy())return;
  if(s.fame<15&&s.plan!=='정치')return;
  const i=await Q('시정부 선거','élections municipales','고을에서 처음으로 시장과 시정 위원을 주민이 뽑는다. 능동시민 명부에 그대의 이름이 있다.',[{l:'시정 위원에 출마한다',s:'사교·명성 판정',a:'social radical'},{l:'투표만 한다',s:'',a:'safe'}]);
  if(i===1){say('투표함에 표를 넣었다.');await done();return}
  const {m,why}=md([[s.st.soc>=50,1,'사교'],[s.fame>=35,1,'명성'],[!!s.party,1,'파벌의 지원'],[s.rep.rloc>=65,1,'이웃의 신망'],[s.rep.rloc<=30,-1,'나쁜 평판'],[s.sk.orat>=40,1,'웅변'],[noble(),-1,'귀족 출신']]);
  const r=await roll(m,{label:'시정부 선거',why});
  if(r.v>=4){if(s.job)s.prevJob=s.job;takeJob(r.v>=6&&s.fame>=30?'p2':'p1');fx({fame:4})}else say('표가 모자랐다.'+fx({fame:1}));await done()}

/* ---------- 당 활동 (한 해에 한 번씩) ---------- */
const PACTS=[
 {k:'speech',n:'클럽 연단에서 연설한다',s:'사교·웅변 판정. 명성과 당내 지위',c:()=>!!s.party&&s.age>=18&&lit(),inter:async()=>{const f=party();
   const r=await roll(md([[s.st.soc>=55,1,'사교'],[s.sk.orat>=45,1,'웅변'],[s.st.edu>=60,1,'학식'],[trait('열정'),1,'열정'],[s.sk.orat<15,-1,'연단이 낯섦']]).m,{label:'연설'});fx({orat:r.v>=4?3:2});frelAdd(f.id,r.v>=4?5:1);
   if(r.v>=5){say(`${f.n} 회합에서 연설해 우레 같은 박수를 받았다.`+fx({fame:4,soc:1,inf:3,rpeople:f.pol>=40?3:0}));if(s.prank<3&&R()<.6){s.prank++;say(`${f.n}의 ${PRANK[s.prank]}이 되었다.`,'big')}}
   else if(r.v<=2)say('야유 속에 연단을 내려왔다.'+fx({fame:-2}));else say('연설은 무난했다.'+fx({fame:1}));await done()}},
 {k:'write',n:'당 신문에 논설을 싣는다',s:'학식 판정. 성향이 당 쪽으로 기운다',c:()=>!!s.party&&lit()&&s.year>=1789,inter:async()=>{const f=party();
   const r=await roll(md([[s.st.edu>=60,1,'학식'],[s.sk.pen>=45,1,'문장력']]).m,{label:'논설'});fx({pen:2});frelAdd(f.id,3);say(`『${pick(['인민의 벗','애국 프랑스인','뒤셴 영감','혁명 연보','국민 소식'])}』에 ${f.goal}을 호소하는 글을 실었다.`+fx({fame:r.v>=4?3:1,pol:Math.round((f.pol-s.pol)*.2),sus:inTerror()&&f.pol<40?6:0}));await done()}},
 {k:'rally',n:'청원과 시위를 조직한다',s:'의지 판정. 명성↑, 혐의↑',c:()=>!!s.party&&s.age>=18&&((T()>=1789.25&&T()<1795.5)||T()>=tm(1830,7)),inter:async()=>{
   const r=await roll(s.st.cour>=50?1:0,{label:'시위'});if(r.v>=4)say('구민 수천 명이 청원서에 서명하였다.'+fx({fame:4,sus:6,cour:2,orat:2,rpeople:4,relite:-2,inf:3}));else if(r.v===1){say('국민방위대에 해산당하고 주동자로 찍혔다.'+fx({sus:15}));if(R()<.3){s.cond='prison';s.prisonKind=inTerror()?'terror':'plain';s.condSince=T();say('감옥에 갇혔다.','big')}}else say('모인 사람이 많지 않았다.'+fx({sus:3}));await done()}},
 {k:'caucus',n:'파벌 지도부와 만난다',s:'사교 판정. 당내 지위',c:()=>!!s.party&&s.prank<3,inter:async()=>{const f=party();
   const r=await roll(s.st.soc>=50?1:0,{label:'회합'});if(r.v>=5&&s.prank<3){s.prank++;meet(f.lead);frelAdd(f.id,8);fx({inf:2});say(`${f.lead}${bat(f.lead)?'과':'와'} 마주 앉았다. ${f.n}의 ${PRANK[s.prank]}이 되었다.`+fx({fame:2}),'big')}else say('지도부는 바빴다.');await done()}},
 {k:'run',n:'선거에 나선다',s:'의원이 될 수 있다',c:()=>isM()&&s.age>=25&&lit()&&!deputy()&&s.fame>=30&&[1791,1792,1795,1797,1798,1799].includes(s.year),inter:async()=>{await election('보궐 선거',.08)}},
 {k:'leave',n:'파벌을 떠난다',s:'',c:()=>!!s.party,f:()=>leaveParty()}
];
