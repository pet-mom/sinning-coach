/* ================= 가상의 벗: 이웃·동창·동료·맞수·연인 =================
   실존 인물(addRel)과 같은 s.rel 배열에 kind:'fic'로 들어간다. 관계의 성격(친우·라이벌·존경·혐오)은 relBond()가 수치에서 읽는다.
   r = {kind:'fic', fid, n, sex, role, by 태어난 해, estate, job, home 파리 동네, tr 성격, v 가치, pol, fac, grp 모임, eng 정치 열의(0~100),
        close, trust, resp, riv, hate, alive, cond(normal·army·emigre·prison·hiding·deported), fate[], y 만난 해, w 만난 사연, inf, mar 배우자, kids}
   npcYear(): 12월마다 — 새 만남, 그들의 한 해(혼인·자식·일·정치·병·징집·망명), 그대와의 장면 하나.
   npcMonth(a,b): 진행 구간 안의 날짜 사건(바스티유, 8월 10일, 9월 학살, 공포정치, 테르미도르, 7월 혁명, 1832년 6월 봉기, 1848년…)과 달마다의 공포정치·콜레라.
   확률은 당대 통계를 단순화했다: 바스티유 공격자 약 900명 중 98명 전사, 9월 학살 수감자 약 2,700명 중 1,100~1,400명 사망,
   파리 혁명재판소 사형 약 2,600명, 1832년 콜레라 파리 주민 2.3% 사망, 1832년 6월 봉기 반란자 약 3,000명 중 약 90명 전사,
   1848년 6월 봉기 반란자 약 4만 명 중 수천 명 사망·1만 1천여 명 체포·4천여 명 알제리 유형. */
const NP_TR=['열정','신중','경건','계몽','야심','쾌활','다혈질','냉소','다정','허영'];
const NP_TRD={열정:'대의에 몸을 던진다',신중:'위험을 피한다',경건:'신앙이 깊다',계몽:'새 사상을 좋아한다',야심:'출세를 바란다',쾌활:'잘 웃고 잘 논다',다혈질:'욱하는 성미다',냉소:'아무것도 믿지 않는다',다정:'남의 일을 제 일처럼 여긴다',허영:'남의 눈을 많이 의식한다'};
const NP_ENG={열정:80,계몽:65,야심:55,다혈질:55,냉소:25,신중:20,경건:35,쾌활:25,다정:30,허영:35};
const NP_HOME={artisan:['생앙투안 문밖','생마르셀 문밖','레알','시테 섬','그레브 광장 뒤','탕플 구역','생드니 거리','몽마르트르 언덕 아래'],bourgeois:['마레','라탱 구역','생토노레 거리','레알','생드니 거리','시테 섬','팔레루아얄 근처'],noble:['생제르맹 문밖','마레','생토노레 문밖','팔레루아얄 근처'],peasant:['생마르셀 문밖','생앙투안 문밖','레알']};
const NP_JOB={artisan:{M:['목수 직인','소목장 직인','자물쇠공 직인','제화공','인쇄 직인','제빵 직인','무두장이','석공','짐꾼','유리장이','양초공','마부'],F:['세탁부','재봉사','모자 가게 점원','레알 시장 생선 장수','꽃 파는 처녀','레이스 직공','과일 행상','하녀']},
 bourgeois:{M:['공증인 서기','변호사 수습','약제사 견습','서적상','포목상','외과의 견습','법학생','시계공','화가 지망생'],F:['포목상의 딸','서적상 안주인','공증인의 딸','가게 안주인','화가 지망생','하숙집 안주인']},
 noble:{M:['근위 기병 중위','몰타 기사단 기사','궁정 시종','보병 연대 대위','고등법원 판사 견습'],F:['궁정 시녀','후작 부인','백작 부인','수녀원 기숙생']},
 peasant:{M:['오베르뉴에서 올라온 물장수','리무쟁에서 올라온 석공','사부아에서 온 굴뚝 청소부'],F:['노르망디에서 온 유모','시골에서 올라온 하녀']}};
const NP_UP={'목수 직인':'목수 장인','소목장 직인':'소목장 장인','자물쇠공 직인':'자물쇠 장인','인쇄 직인':'인쇄소 식자 반장','제빵 직인':'빵집 주인','재봉사':'의상실 주인','모자 가게 점원':'모자 가게 주인','공증인 서기':'공증인','변호사 수습':'변호사','약제사 견습':'약제사','외과의 견습':'외과의','법학생':'변호사','화가 지망생':'화가','근위 기병 중위':'기병 대위','보병 연대 대위':'대령','고등법원 판사 견습':'고등법원 판사','신학생':'보좌 신부','보좌 신부':'본당 신부','레알 시장 생선 장수':'레알 시장 생선 가게 주인','과일 행상':'과일 가게 주인','하녀':'하녀장','짐꾼':'마부','의학생':'의사','에콜 폴리테크니크 학생':'공병 장교','오베르뉴에서 올라온 물장수':'고철상','그리제트(여공)':'의상실 주인','기계공':'기계 공장 십장','식자공':'인쇄소 식자 반장'};
const NP_GRP={ng:'국민방위대',sc:'구민회의 상퀼로트',jd:'금빛 청년단',sdh:'공화파 인권협회',sais:'비밀결사 계절회'};
/* ---------- 도구 ---------- */
const npAll=()=>(s.rel||[]).filter(r=>r.kind==='fic');
const npLive=()=>npAll().filter(r=>r.alive);
const npAge=r=>s.year-r.by;
const npNob=r=>!!(ESTATES[r.estate]&&ESTATES[r.estate].noble);
const npM=r=>r.sex==='M';
const npIn=r=>r.alive&&r.cond==='normal';
const npEst=r=>npNob(r)?'noble':r.estate;
const npWho=r=>`${relBond(r)} ${r.n}`;
const npTop=r=>jo(r.n,'은','는'),npSub=r=>jo(r.n,'이','가'),npObj=r=>jo(r.n,'을','를'),npWith=r=>jo(r.n,'과','와');
const npJob=r=>r.job||(npAge(r)<14?'동네 아이':'일거리를 찾는 중');
const npCler=r=>!!r.cler;
// 그대와 그의 정치적 거리(공개 입장 기준)
const npGap=r=>Math.abs((r.pol||0)-(child()?s.pol:pubPol()));
const npTm=(y,m)=>y*12+m-1;
function npName(sex,E){const used=new Set((s.rel||[]).map(r=>r.n));for(let k=0;k<12;k++){const g=pick(sex==='M'?M_NAMES:F_NAMES)[0];
  const n=ESTATES[E]&&ESTATES[E].noble?`${g} 드 ${pick(NOBLE_SURS)[0]}`:`${g} ${pick(SURS.concat(PEOPLE_M))[0]}`;if(!used.has(n)&&!n.endsWith(' '+s.sur[0]))return n}return `${pick(sex==='M'?M_NAMES:F_NAMES)[0]} ${pick(SURS)[0]}`}
function npEraPol(E,t=T()){const b=t<1787?0:t<1789.5?10:t<1792.5?25:t<1794.6?40:t<1799.8?15:t<1814.3?0:t<1830.6?10:t<1848?20:30;
  return b+(E==='artisan'?(t<1787?5:15):E==='peasant'?-10:E==='noble'?(t<1787?-35:-50):0)}
function npJobPick(r){const t=T(),E=npEst(r),x=r.sex;let L0=(NP_JOB[E]||NP_JOB.artisan)[x].slice();
  if(r.cler)return x==='M'?(npAge(r)<25?'신학생':'보좌 신부'):'수녀';
  if(t>=1795&&E==='bourgeois'&&x==='M')L0.push('에콜 폴리테크니크 학생','의학생');if(t>=1820&&E==='artisan')L0.push(...(x==='M'?['기계공','식자공']:['그리제트(여공)']));
  if(E==='noble'&&t>=1792.6&&t<1814.3)L0=x==='M'?['몰락한 옛 귀족','가정교사로 연명하는 옛 귀족']:['몰래 바느질로 연명하는 옛 귀족 부인'];
  return pick(L0)}
// 가상의 벗을 만든다. 실존 인물 체계(addRel)와는 따로 둔다.
function addFic(role,o={}){s.rel=s.rel||[];if(relsAlive().length>=14)return null;s.npN=(s.npN||0)+1;
  const sex=o.sex||(R()<.5?'M':'F'),E=o.estate||s.estate,tr=o.tr||pick(NP_TR);const by=o.by||s.year-(o.age??s.age);
  const ek=ESTATES[E]&&ESTATES[E].noble?'noble':E;
  let pol=o.pol??(ek==='noble'?(R()<.2?ri(0,30):ri(-60,-15)):ek==='artisan'?ri(-10,25):ek==='bourgeois'?ri(-15,30):ri(-25,10));
  pol+=tr==='열정'?(pol<0?-15:15):tr==='계몽'?15:tr==='경건'?-20:0;pol=clamp(Math.round(pol+npEraPol(ek)*.4),-100,100);
  const v=o.v||wpick(ek==='noble'?[['vhon',4],['vord',2],['vfam',1]]:ek==='bourgeois'?[['vlib',3],['vjus',2],['vord',1],['vfam',1]]:[['veq',3],['vjus',2],['vfam',2],['vlib',1]]);
  const r={kind:'fic',fid:'f'+s.npN,n:o.n||npName(sex,E),sex,role,by,estate:E,job:null,home:o.home||pick(NP_HOME[ek]||NP_HOME.artisan),tr,v,pol,po:pol-npEraPol(ek),
    eng:clamp((NP_ENG[tr]||40)+ri(-15,15),0,100),fac:null,grp:null,close:o.close??ri(35,55),trust:o.trust??ri(30,55),resp:o.resp??ri(25,50),riv:o.riv??(role==='경쟁자'?ri(45,65):ri(0,12)),hate:o.hate||0,
    alive:true,cond:o.cond||'normal',fate:[],y:s.year,w:o.w||'',inf:o.inf||0,mar:null,kids:0,cler:!!o.cler,refr:!!o.refr};
  if(npAge(r)>=14)r.job=o.job||npJobPick(r);if(o.mar||(role!=='연인'&&npAge(r)>=28&&R()<.6)){r.mar=o.mar||(sex==='M'?woman():person());r.kids=npAge(r)>=30?ri(0,3):0}
  if(npAge(r)>=18&&R()<r.eng/120)npFacPick(r,true);r.bd=relBond(r);s.rel.push(r);return r}
/* ---------- 만남 ---------- */
// ctx: nbr(어린 시절 이웃) school work club salon army prison love street exile
function npcMeet(ctx){const a=s.age,E0=noble()?s.estate:s.estate;let role='친구',o={},w='',sx=R()<.5?'M':'F';const same=()=>isM()?'M':'F';const t=T();
  if(ctx==='nbr'){sx=R()<.75?same():(isM()?'F':'M');o.age=clamp(a+ri(-2,2),3,15);
    if(noble()){o.estate=R()<.7?s.estate:'artisan';w=o.estate==='artisan'?pick(['저택 하인의 아이','마부의 아이']):pick(['이웃 저택의 아이','튈르리 정원에서 만난 아이','사촌뻘 되는 집안 아이'])}
    else{o.estate=s.estate==='bourgeois'?(R()<.6?'bourgeois':'artisan'):(R()<.85?'artisan':'bourgeois');w=pick(['같은 골목에 사는 아이','본당 교리반에서 만난 아이','센 강가에서 함께 놀던 아이','같은 셋집 위층에 사는 아이'])}
    if(R()<.18){role='경쟁자';w='골목 아이들의 대장 노릇을 하던 아이'}}
  else if(ctx==='school'){const st=SCH().st;sx=same();o.age=a+ri(-1,1);
    if(st==='college'){o.estate=wpick([['bourgeois',6],['robe',2],['epee',1],['artisan',1]]);w=`${t<1762.5?'루이르그랑 예수회 콜레주':t<1793?pick(['루이르그랑 콜레주','아르쿠르 콜레주','마자랭 콜레주']):t<1802.5?'중앙학교':pick(['리세 앵페리알','리세 앙리 4세','리세 샤를마뉴'])} 동급생`}
    else if(st==='convent'){o.estate=noble()?(R()<.7?s.estate:'bourgeois'):(R()<.7?'bourgeois':'robe');w=`${noble()?'팡테몽 수녀원':'성모방문회 수녀원'} 기숙학교 동무`}
    else if(st==='seminary'){o.estate=wpick([['artisan',3],['bourgeois',3],['peasant',2],['robe',1]]);o.cler=true;w='생쉴피스 신학교 동기'}
    else{o.estate=wpick([['bourgeois',6],['robe',1],['artisan',1]]);w=`${SCH().fac==='med'?'의학부':SCH().fac==='law'?'법학부':'대학'} 동기`;o.age=a+ri(-2,3)}
    const k=R();if(k<.2)role='경쟁자';else if(k<.3){role='스승';o.age=a+ri(15,35);o.estate=st==='seminary'?'bourgeois':o.estate;o.cler=st!=='univ';sx=st==='convent'?'F':'M';w=st==='convent'?'기숙학교의 수녀 선생':st==='univ'?'학부의 교수':'학교의 선생';o.job=st==='convent'?'수녀 선생':st==='seminary'?'신학교 교수 신부':st==='univ'?'교수':'콜레주 교사'}}
  else if(ctx==='work'){const j=job();o.estate=j.tr==='craft'?(R()<.85?'artisan':'bourgeois'):['law','med','letters','pol'].includes(j.tr)?(R()<.8?'bourgeois':'robe'):s.estate;o.age=a+ri(-6,8);sx=R()<.75?same():(isM()?'F':'M');
    const wp={craft:'같은 공방',law:'같은 사무소',med:'오텔디외 병원',letters:'같은 인쇄소와 신문사',church:'같은 교구',pol:'같은 위원회',farm:'같은 장터'}[j.tr]||'일터';
    const k=R();if(k<.25){role='경쟁자';w=`${wp}에서 같은 자리를 노리는 사람`}else if(k<.38&&a<35){role='스승';o.age=a+ri(15,30);w=`${wp}의 선배`}else if(k<.48&&j.t>=2){role='후원자';o.age=a+ri(15,30);o.estate=E0==='artisan'?'bourgeois':o.estate;w=`${wp}의 윗사람`}else{role='동료';w=`${wp}의 동료`}
    if(j.tr==='church')o.cler=true}
  else if(ctx==='club'){const f=FAC[s.party];o.estate=f.pol>=50?wpick([['artisan',5],['bourgeois',3]]):f.pol<=-40?wpick([['epee',2],['robe',2],['bourgeois',2]]):wpick([['bourgeois',5],['artisan',2],['robe',1]]);o.age=a+ri(-12,15);o.pol=f.pol+ri(-10,10);o.tr=R()<.4?'열정':null;
    const k=R();role=k<.25?'경쟁자':k<.4?'스승':'동료';w=role==='스승'?`${f.n} 모임에서 연설로 이름난 사람`:`${f.n} 모임에서 만난 사람`;o.resp=role==='스승'?ri(55,75):null}
  else if(ctx==='salon'){o.estate=noble()?(R()<.7?pick(['epee','robe']):'bourgeois'):wpick([['bourgeois',3],['robe',2],['epee',1]]);o.age=a+ri(-8,20);sx=R()<.5?'M':'F';
    const k=R();role=k<.3&&o.age>a+10?'후원자':k<.45?'경쟁자':'친구';w=`${t<1789?pick(['조프랭 부인의','네케르 부인의','팔레루아얄의']):t<1793?pick(['롤랑 부인의','콩도르세 부인의','스탈 부인의']):t<1815?pick(['레카미에 부인의','탈리앵 부인의','스탈 부인의']):pick(['레카미에 부인의','뒤라스 공작 부인의','라파예트 저택의'])} 살롱에서 만난 사람`}
  else if(ctx==='army'){o.estate=wpick([['artisan',4],['peasant',4],['bourgeois',1]]);sx='M';o.age=a+ri(-3,5);role=R()<.2?'경쟁자':'친구';o.trust=ri(45,65);o.cond='army';w='같은 중대의 전우';o.job=pick(['척탄병','보병','기병','포병'])}
  else if(ctx==='prison'){const tr=inTerror()||T()<1794.7&&T()>=1792.6;o.estate=tr?wpick([['epee',3],['robe',2],['bourgeois',3],['artisan',2]]):wpick([['artisan',5],['bourgeois',2]]);o.age=clamp(a+ri(-15,20),16,75);role='친구';o.trust=ri(50,70);o.close=ri(45,60);o.cond='prison';
    w=tr?`${pick(['뤽상부르','라포르스','생트펠라지','콩시에르주리','카름'])} 감옥의 같은 방 수감자`:`${pick(['비세트르','생트펠라지','라포르스'])} 감옥의 같은 방 수감자`;if(tr&&R()<.25){o.cler=true;o.refr=true;sx='M'}}
  else if(ctx==='love'){sx=isM()?'F':'M';o.estate=R()<.75?s.estate:(noble()?'bourgeois':pick(['artisan','bourgeois']));o.age=isM()?clamp(a-ri(0,6),16,40):clamp(a+ri(0,7),17,45);role='연인';o.close=ri(45,60);o.mar=null;
    w=pick(noble()?['오페라 무도회에서 만난 사람','튈르리 정원 산책길에서 만난 사람','사촌의 혼례식에서 만난 사람']:['성당 미사에서 눈이 마주친 사람','이웃 공방의 사람','성 요한 축일 밤 모닥불 곁에서 만난 사람','강변 선술집 무도회에서 만난 사람'])}
  else if(ctx==='exile'){o.estate=pick(['epee','robe']);o.age=a+ri(-10,15);o.cond='emigre';role=R()<.3?'후원자':'친구';w=`망명지 ${s.emiPlace||'코블렌츠'}에서 만난 프랑스 사람`}
  else{o.estate=R()<.6?s.estate:pick(['artisan','bourgeois']);o.age=a+ri(-10,10);role=R()<.15?'경쟁자':'친구';w=pick(['단골 카페에서 알게 된 사람','같은 셋집에 든 사람','본당 형제회에서 만난 사람','장터에서 시비 끝에 친해진 사람'])}
  o.sex=sx;o.w=w;if(o.age<3)o.age=3;
  if(role==='연인'&&(s.married||priest()||nun()))role='친구';
  const r=addFic(role,o);if(!r)return null;
  if(r.cond==='army')r.ay=s.year;if(r.cond==='prison')r.py=s.year;if(r.cond==='emigre')r.emi=s.emiPlace||'코블렌츠';
  L(`${w} — ${r.n}(${npAge(r)}세, ${npJob(r)}, ${r.home}). 성격은 ${r.tr}, ${NP_TRD[r.tr]}.`,'ev');return r}
function npMeetTry(){if(s.dead)return;const al=npLive().length;if(npAll().length>=10||al>=7||relsAlive().length>=14)return;
  const a=s.age,c=[];
  if(s.cond==='prison')c.push(['prison',.5]);else if(s.cond==='emigre')c.push(['exile',.25]);else if(s.cond==='normal'){
    if(a>=5&&a<=13)c.push(['nbr',a<=9?.4:.3]);
    if(inSchool(['college','convent','seminary','univ']))c.push(['school',.35]);
    if(soldier())c.push(['army',.35]);else if(job()&&a>=14)c.push(['work',.18]);
    if(s.party&&a>=16&&FAC[s.party])c.push(['club',.22]);
    if(a>=17&&(noble()||s.estate==='bourgeois'||s.st.soc>=55)&&(T()<1792.5||T()>=1795))c.push(['salon',.12]);
    if(a>=16&&a<=30&&!s.married&&!priest()&&!nun()&&!npLive().some(r=>r.role==='연인'))c.push(['love',.13]);
    if(a>=16&&c.length<=1)c.push(['street',.1])}
  const damp=Math.max(.25,1-al*.14);let made=0;
  for(const [k,p] of c.sort(()=>R()-.5)){if(made>=2)break;if(R()<p*damp*(made?.35:1)&&npcMeet(k))made++}}
/* ---------- 그들의 삶 ---------- */
function npFate(r,t){r.fate=r.fate||[];r.fate.push(`${s.year}년 ${t}`)}
const npKind=(r,big)=>big?(r.close>=50||r.hate>=50||r.riv>=60?'big':'ev'):(r.close>=40||r.hate>=40||r.riv>=50?'ev':'sys');
// 그의 일을 기록하고 그대에게 알린다
function npEv(r,t,big){npFate(r,t);L(`${npWho(r)}${bat(r.n)?'은':'는'} ${t}`,npKind(r,big))}
function npDie(r,cause,t){if(!r.alive)return;r.alive=false;r.dead=s.year;r.dc=cause;npFate(r,t);const b=relBond(r);
  let tail='';if(!child()){if(r.close>=60)tail=fx({hp:-2,vfam:1});else if(r.hate>=60)tail=fx({vjus:-1})}
  say(`${b} ${r.n}${bat(r.n)?'은':'는'} ${t}${r.close>=70?' 그대는 오래도록 그 이름을 입에 올리지 못했다.':r.hate>=60?' 미움도 함께 땅에 묻었다.':''}`+tail,npKind(r,true))}
function npFacOk(r,f){if(['devot','philosophe','parlement'].includes(f.id))return npAge(r)>=20&&r.estate!=='artisan'&&r.estate!=='peasant';
  if(['cordelier','babeuf','jacobin','neojacobin','republican'].includes(f.id))return !npNob(r)||r.pol>=50;
  if(['royalist','ultra','legitimist','absolutist','clichy'].includes(f.id))return npNob(r)||r.tr==='경건'||r.pol<=-45;return true}
const NP_JOIN={jacobin:'자코뱅 클럽(헌우회)에 가입하였다.',cordelier:'코르들리에 클럽에 드나들기 시작하였다.',patriote:'애국파의 집회에 나가기 시작하였다.',feuillant:'푀양 클럽에 이름을 올렸다.',girondin:'브리소와 롤랑을 따르는 지롱드파가 되었다.',royalist:'왕당파의 비밀 연락망에 끼었다.',babeuf:'바뵈프의 ‘평등파’ 모임에 나갔다.',bonapartist:'보나파르트를 열렬히 따르게 되었다.',ultra:'극우 왕당파(윌트라)가 되었다.',republican:'공화파의 모임에 나가기 시작하였다.',legitimist:'부르봉 장자계를 따르는 정통왕조파가 되었다.',neojacobin:'신자코뱅의 ‘마네주 클럽’에 드나들었다.',thermidor:'테르미도르파 편에 섰다.',clichy:'클리시 클럽의 왕당파와 어울렸다.'};
function npFacPick(r,quiet){const fs=activeFactions().filter(f=>npFacOk(r,f));if(!fs.length)return;let best=null,bd=99;
  for(const f of fs){let d=Math.abs(f.pol-r.pol);if(r.tr==='야심'&&RULING(T()).includes(f.id))d-=20;if(d<bd){bd=d;best=f}}
  if(!best||bd>25||best.id===r.fac)return;const was=r.fac;r.fac=best.id;if(!quiet)npEv(r,NP_JOIN[best.id]||`${best.n}에 가담하였다.`);
  if(!quiet&&!child()&&s.party&&was!==best.id){const fp=facPair(s.party,best.id);if(fp<=-50)L(`${r.n}${bat(r.n)?'과':'와'}는 이제 서로 적대하는 편이다.`+relFx(r,{close:-6,trust:-4}),'sys');else if(fp>=50)L(`${r.n}${bat(r.n)?'과':'와'} 한편이 되었다.`+relFx(r,{close:4,trust:3}),'sys')}}
function npPol(r){const E=npEst(r);const tg=npEraPol(E)+r.po*.7;r.pol=clamp(Math.round(r.pol+(tg-r.pol)*.15+ri(-3,3)),-100,100);
  if(r.close>=70&&!child())r.pol=clamp(Math.round(r.pol+(s.pol-r.pol)*.05),-100,100);
  if(r.fac){const f=FAC[r.fac];if(!f||T()>=f.b){const nx=typeof SUCC!=='undefined'&&SUCC[r.fac];r.fac=nx&&FAC[nx]&&T()>=FAC[nx].a&&T()<FAC[nx].b?nx:null}
    else if(Math.abs(f.pol-r.pol)>40){npEv(r,`${jo(f.n,'과','와')} 갈라섰다.`);r.fac=null}}
  if(!r.fac&&npAge(r)>=18&&R()<r.eng/250)npFacPick(r);
  const t=T(),E2=npEst(r);
  if(!r.grp&&t>=1789.5&&t<1792.6&&E2==='bourgeois'&&npM(r)&&R()<.25){r.grp='ng';npEv(r,'국민방위대에 들어가 삼색 모표를 달았다.')}
  else if((!r.grp||r.grp==='ng')&&t>=1792.6&&t<1795.3&&E2==='artisan'&&r.pol>=35&&R()<r.eng/150){r.grp='sc';npEv(r,'구민회(섹시옹)에 드나드는 상퀼로트가 되었다. 붉은 모자를 쓰고 동무라 부른다.')}
  else if(r.grp==='sc'&&t>=1795.5){r.grp=null}
  else if(!r.grp&&t>=1794.6&&t<1796&&E2==='bourgeois'&&npAge(r)<30&&r.pol<15&&(r.tr==='허영'||r.tr==='다혈질'||R()<.15)){r.grp='jd';npEv(r,'몽둥이를 든 금빛 청년단(뮈스카댕)과 어울려 다녔다.')}
  else if(r.grp==='jd'&&t>=1797)r.grp=null;
  else if(!r.grp&&t>=1830.6&&t<1834.5&&r.pol>=40&&npAge(r)<45&&R()<r.eng/180){r.grp='sdh';npEv(r,'공화파 비밀결사 인권협회에 들어갔다.')}
  else if(r.grp==='sdh'&&t>=1834.5){r.grp=R()<.3&&r.pol>=60?'sais':null;if(r.grp)npEv(r,'블랑키와 바르베스의 비밀결사 계절회에 들어갔다.')}
  else if(r.grp==='sais'&&t>=1840)r.grp=null;
  else if(!r.grp&&t>=1830.6&&E2==='bourgeois'&&npM(r)&&R()<.15){r.grp='ng';npEv(r,'7월 왕정의 국민방위대에 들어갔다.')}}
function npWar(y=s.year){return y<1792?pick(['플랑드르 주둔지','로렌의 수비대']):y<1793?pick(['발미','제마프']):y<1795?pick(['방데','북부군','라인군','툴롱 포위전','플뢰뤼스']):y<1798?pick(['이탈리아 원정군','라인군','아르콜레']):y<1800?pick(['이집트 원정군','스위스','방데']):y<1803?pick(['마렝고','호엔린덴']):y<1806?pick(['아우스터리츠','울름']):y<1808?pick(['예나','아일라우','프리틀란트']):y<1812?pick(['에스파냐','바그람','포르투갈']):y<1813?'러시아':y<1814?pick(['라이프치히','뤼첸','에스파냐']):y<1815?'샹파뉴 전역':y<1816?'워털루':y<1830?pick(['에스파냐 원정','국경 수비대']):'알제리'}
function npEnlist(r,how){r.cond='army';r.ay=s.year;r.pjob=r.job;const w=npWar();npEv(r,`${how} ${jo(w,'으로')} 떠났다.`)}
function npArmyYear(r){const y=s.year,a=npAge(r);let p=y<1792?.01:y<1803?.06:y<1812?(y===1809?.08:.06):y===1812?(r.rus?0:.08):y===1813?.2:y===1814?.1:y===1815?0:y<1830?.01:.03;if(r.tr==='신중')p*=.8;
  if(R()<p){const fr=npWar();npDie(r,'battle',`${fr}에서 전사하였다.`);return}
  if(R()<.06){npEv(r,`${npWar()}에서 ${pick(['다리에 총탄을 맞고','사브르에 얼굴을 베이고','포탄 파편에 팔을 다쳐'])} 돌아왔다.`,true);r.cond='normal';r.wound=1;r.job=r.pjob||r.job;return}
  if(y-r.ay>=(y<1800?4:7)&&R()<(y>=1814&&y<=1815?.6:.2)||a>=45){r.cond='normal';r.job=r.pjob||r.job;npEv(r,`제대하여 파리로 돌아왔다.`);if(r.close>=40&&!child())say(`오랜만에 ${npWith(r)} 마주 앉았다. 그는 말수가 줄었다.`+relFx(r,{close:5}))}}
function npLife(r){const a=npAge(r),y=s.year,t=T();if(!r.alive)return;
  if(a===14&&!r.job){r.job=npJobPick(r);npFate(r,`${r.job} 일을 시작하였다.`)}
  // 병과 노환
  let m=baseMort(a)*(npNob(r)?.75:r.estate==='bourgeois'?.85:1.12)*(price(y)>=1.5&&!npNob(r)?1.3:1)*(r.cond==='prison'?1.6:r.cond==='emigre'?1.15:r.cond==='deported'?3:1)*(r.wound?1.2:1);
  if(r.cond==='deported')m+=.15;
  if(R()<m){const c=r.cond==='deported'?'유형지의 열병으로 죽었다.':a>=60?pick(['늑막염으로 세상을 떠났다.','중풍으로 쓰러져 세상을 떠났다.','수종을 앓다 세상을 떠났다.','자리에 누운 지 며칠 만에 숨을 거두었다.']):pick(['폐결핵으로 세상을 떠났다.','장티푸스로 세상을 떠났다.','열병으로 세상을 떠났다.','늑막염으로 세상을 떠났다.',...(y<1801?['천연두로 세상을 떠났다.']:[])]);npDie(r,'ill',`${a}세에 ${c}`);return}
  if(r.cond==='army'){npArmyYear(r);if(!r.alive)return}
  else if(r.cond==='emigre'){if((y>=1800&&y<=1803&&R()<.4)||(y>=1814&&R()<.7)){r.cond='normal';npEv(r,`망명 ${y-(r.ey||r.y)}년 만에 파리로 돌아왔다. 옛 저택은 남의 손에 넘어가 있었다.`,true)}}
  else if(r.cond==='prison'&&!(t>=1793.4&&t<1794.6)){if(R()<.55){r.cond='normal';npEv(r,'감옥에서 풀려났다.')}}
  else if(r.cond==='hiding'&&(t>=1794.6||t<1793)){if(R()<.6){r.cond='normal';npEv(r,'숨어 지내던 곳에서 나와 집으로 돌아왔다.')}}
  else if(r.cond==='deported'&&R()<.12){r.cond='normal';npEv(r,'유형지에서 살아 돌아왔다. 얼굴이 해골 같았다.',true)}
  if(r.cond!=='normal')return;
  // 혼인·자식
  if(!r.mar&&a>=18&&a<=40&&!(r.cler&&!(t>=1793.6&&t<1795))&&R()<(npM(r)?.11:.14)){r.mar=npM(r)?woman():person();r.marY=y;if(r.cler)r.cler=false;npEv(r,`${jo(r.mar,'과','와')} 혼인하였다.`)}
  else if(r.mar&&a<(npM(r)?55:44)&&R()<(r.kids<2?.3:r.kids<4?.18:.08)){r.kids=(r.kids||0)+1;r.kidY=y;if(!npM(r)&&R()<.012){npDie(r,'childbirth','아이를 낳다가 숨을 거두었다.');return}if(r.kids===1||r.close>=55)npFate(r,r.kids===1?'첫아이를 얻었다.':`${r.kids}번째 아이를 얻었다.`)}
  // 일
  if(r.job&&NP_UP[r.job]&&a>=22&&R()<.1){const nj=NP_UP[r.job];r.job=nj;npEv(r,`${jo(nj,'이','가')} 되었다.`);if(!child()&&r.tr==='야심')r.riv=clamp(r.riv+5,0,100)}
  if(r.job&&/궁정|근위|고등법원/.test(r.job)&&t>=(/고등법원/.test(r.job)?1790.75:1792.6)&&!/^옛 /.test(r.job))r.job='옛 '+r.job;
  // 징병(1798년 주르당 법 ~ 1813년)
  if(npM(r)&&!r.cler&&y>=1798&&y<=1813&&a>=19&&a<=(y===1813?30:25)&&!r.mar&&R()<(y===1813?.3:r.estate==='bourgeois'?.04:npNob(r)?.03:.12)*(r.wound?0:1))npEnlist(r,y===1813?'1813년의 대징집으로':'징병 추첨에 뽑혀');
  // 빚
  if(r.debt){if(R()<(r.tr==='냉소'?.1:r.tr==='다정'?.6:.35)){const d=r.debt;r.debt=0;if(!child())L(`${npSub(r)} 꾸어 간 돈을 갚았다.`+fx({money:d})+relFx(r,{trust:8}),'ev')}else if(y-r.debtY>=3){r.debt=0;if(!child())L(`${npTop(r)} 꾸어 간 돈을 끝내 갚지 않았다.`+relFx(r,{trust:-14,hate:6,close:-6}),'ev')}}}
// 그대의 처신에 대한 그들의 반응
function npReact(r){if(child()||!npIn(r))return;const g=npGap(r);
  if(r.eng>=45&&g>=70&&R()<.6){const t=r.pol>s.pol?`${npTop(r)} 그대가 ‘${polLabel(pubPol())}’ 쪽에 섰다며 냉담해졌다.`:`${npTop(r)} 그대의 ‘과격한’ 생각을 두려워하게 되었다.`;L(t+relFx(r,{close:-5,resp:-4}),'sys')}
  else if(r.eng>=45&&g<=20&&R()<.4)L(`${npWith(r)} 시국 이야기를 나누면 말이 잘 통했다.`+relFx(r,{close:3,resp:2}),'sys');
  if(s.party&&r.fac&&FAC[r.fac]&&r.fac!==s.party&&facPair(s.party,r.fac)<=-50&&R()<.5)L(`${npTop(r)} ${FAC[r.fac].n}, 그대는 ${FAC[s.party].n}. 식탁에서 정치 이야기는 금기가 되었다.`+relFx(r,{close:-4,trust:-3}),'sys');
  const j=relJudge(r);if(j&&R()<.3)L(j>0?`${npTop(r)} 그대를 ${VALUES.find(x=>x[0]===r.v)[1]}${bat(VALUES.find(x=>x[0]===r.v)[1])?'을':'를'} 아는 사람이라 했다.`+relFx(r,{resp:4}):`${npTop(r)} 그대의 요즘 처신을 못마땅해한다.`+relFx(r,{resp:-4}),'sys');
  // 시간이 흐르면 저절로 조금씩 식는다
  if(R()<.5)r.close=clamp(r.close-1,0,100);if(r.hate>0&&R()<.4)r.hate=clamp(r.hate-2,0,100);if(r.riv>0&&R()<.3)r.riv=clamp(r.riv-2,0,100)}
// 관계의 성격이 바뀌면 알린다
function npBondNote(r){const b=relBond(r);if(b===r.bd)return;const was=r.bd;r.bd=b;
  if(b==='혐오'&&!['경쟁자'].includes(r.role))r.role='경쟁자';
  const m={친우:`${npWith(r)}는 이제 서로 목숨을 맡길 만한 친우가 되었다.`,라이벌:`${npTop(r)} 이제 그대의 라이벌이다.`,존경:`${r.n}${bat(r.n)?'을':'를'} 마음 깊이 존경하게 되었다.`,혐오:`${r.n}${bat(r.n)?'이라면':'라면'} 이름만 들어도 이가 갈린다.`}[b];
  if(m)L(m,'ev');else if(was==='친우')L(`${npWith(r)}의 사이가 예전 같지 않다.`,'sys')}
/* ---------- 한 해의 장면 ---------- */
const NP_TAV=r=>{const t=T(),E=npEst(r);return E==='noble'?pick(t<1789?['오페라 무도회','롱샹 산책길','튈르리 정원']:t<1815?['튈르리 정원','팔레루아얄 회랑','레카미에 부인의 살롱']:['오페라 무도회','불로뉴 숲 산책길','그랑 불바르의 카페']):E==='bourgeois'?pick(t<1784?['카페 프로코프','카페 드 라 레장스','뤽상부르 정원']:t<1830?['카페 프로코프','팔레루아얄 회랑의 카페 드 푸아','팔레루아얄 회랑']:['그랑 불바르의 카페','카페 프로코프','뤽상부르 정원']):pick(t<1830?['라 쿠르티유 문밖의 선술집','센 강 부두의 술집','생앙투안 거리의 선술집','시 문밖 갱게트(술집)']:['벨빌의 갱게트','생앙투안 거리의 선술집','센 강 부두의 술집'])};
const npDuelOk=r=>isM()&&npM(r)&&s.age>=16&&(noble()||soldier()||npNob(r)||r.cond==='army'||inSchool('univ')||s.estate==='bourgeois');
const NP_SC=[
 // ----- 어린 시절 -----
 {id:'c_seine',k:['child'],w:2,c:r=>npAge(r)<16,f:async r=>{say(noble()?`${npWith(r)} ${pick(['튈르리 정원에서 굴렁쇠를 굴렸다','뤽상부르 정원 분수에 종이배를 띄웠다','저택 마구간에 숨어 하인들의 이야기를 엿들었다'])}.`+fx({soc:1})+relFx(r,{close:6}):`${npWith(r)} ${pick(['센 강가에서 맨발로 물장구를 쳤다','퐁뇌프 다리 위 약장수와 인형극을 구경하였다','부두의 장작더미 위를 뛰어다녔다','강에 떠내려온 나무토막으로 뗏목을 엮었다'])}.`+fx({str:1})+relFx(r,{close:6,trust:2}))}},
 {id:'c_orchard',k:['child'],w:1.2,c:r=>npAge(r)<16&&s.age>=7,f:async r=>{const i=await Q('서리','la maraude',`${npWith(r)} ${noble()?'정원사의 온실에서 복숭아를':'수도원 담장 너머 과수원에서 배를'} 따다가 들켰다. 성난 ${noble()?'정원사':'문지기'}가 몽둥이를 들고 쫓아온다.`,[{l:'함께 달아난다',s:'',a:'bold'},{l:`${npObj(r)} 두고 혼자 달아난다`,s:'',a:'safe'},{l:'내가 했다고 나선다',s:'',a:'family'}]);
   if(i===0){const ok=R()<.6;say(ok?'골목 셋을 지나 겨우 따돌렸다. 숨이 차서 둘이 한참을 웃었다.'+fx({cour:1})+relFx(r,{close:8,trust:6}):'둘 다 붙잡혀 귀를 잡혀 끌려갔다.'+fx({rfam:-1})+relFx(r,{close:6,trust:4}))}
   else if(i===1)say(`${npTop(r)} 붙잡혀 혼쭐이 났다. 다음 날부터 그대를 보면 고개를 돌렸다.`+relFx(r,{trust:-15,close:-8,hate:12}));
   else say(`매를 대신 맞았다. ${npTop(r)} 그날 일을 오래 잊지 않았다.`+fx({hp:-1,cour:1,rfam:-1})+relFx(r,{close:14,trust:14,resp:6}));await done()}},
 {id:'c_fight',k:['child'],w:1,c:r=>npAge(r)<16&&s.age>=7,f:async r=>{say(R()<.5?`옆 골목 아이들과의 돌팔매 싸움에서 ${npSub(r)} 그대 편을 들어 주었다.`+fx({cour:1})+relFx(r,{close:7,trust:5}):`${npSub(r)} 덩치 큰 아이에게 얻어맞는 것을 보고 뛰어들었다.`+fx({cour:2,hp:-1})+relFx(r,{close:9,trust:6,resp:3}))}},
 {id:'c_secret',k:['child'],w:1,c:r=>npAge(r)<16,f:async r=>{say(`${npWith(r)} ${pick(['다락방에 둘만의 비밀 장소를 만들었다','버려진 성당 지하실을 둘러보고 비밀로 하자고 맹세하였다','서로의 피를 한 방울씩 섞어 형제가 되기로 하였다'])}.`+relFx(r,{trust:8,close:5}))}},
 {id:'c_tease',k:['child'],w:.8,c:r=>npAge(r)<16&&['허영','야심','다혈질','냉소'].includes(r.tr),f:async r=>{say(`${npSub(r)} ${pick(['그대의 낡은 옷을 놀렸다','그대가 교리문답을 틀렸다고 동네방네 떠들었다','그대의 사투리를 흉내 내었다'])}.`+relFx(r,{riv:8,hate:6,close:-5}))}},
 {id:'c_catech',k:['child'],w:.8,c:r=>npAge(r)<16&&s.age>=10&&s.faithKind==='catholic'&&T()<1793,f:async r=>{say(`${npWith(r)} 나란히 첫영성체를 받았다. 하얀 옷을 입고 촛불을 들었다.`+fx({faith:2})+relFx(r,{close:5}))}},
 {id:'c_fair',k:['child'],w:.8,c:r=>npAge(r)<16&&T()<1789,f:async r=>{say(`${npWith(r)} ${pick(['생제르맹 장터','생로랑 장터'])}의 줄타기 광대와 인형극을 구경하였다.`+relFx(r,{close:5}))}},
 // ----- 친구·친우 -----
 {id:'f_tavern',k:['friend','close'],w:2,c:r=>npIn(r),f:async r=>{const p=NP_TAV(r);say(`${npWith(r)} ${p}에서 ${pick(['밤늦도록 이야기하였다','신문을 소리 내어 같이 읽었다','노래를 부르며 술잔을 비웠다','앞날의 꿈을 이야기하였다'])}.`+fx({soc:1})+relFx(r,{close:6,trust:2}))}},
 {id:'f_trip',k:['friend','close'],w:1,c:r=>npIn(r),f:async r=>{say(`일요일에 ${npWith(r)} ${pick(['생클루 공원','뱅센 숲','몽마르트르 풍차 언덕','센 강 건너 섬'])}${T()<1830?'까지 걸어갔다':'에 놀러 갔다'}.`+fx({hp:1})+relFx(r,{close:5}))}},
 {id:'f_loan',k:['friend','close'],w:1,c:r=>npIn(r)&&s.money>=60&&!r.debt,f:async r=>{const n=Math.max(20,Math.min(Math.round(s.money*.2),r.estate==='artisan'?60:300));
   const i=await Q('돈 부탁','un prêt',`${npSub(r)} ${pick(['집세가 밀려 쫓겨나게 생겼다','아이가 아파 의사를 불러야 한다','장사 밑천이 모자란다','노름빚에 몰렸다'])}며 ${n} ${money()}을 꾸어 달라고 한다.`,[{l:'빌려준다',s:`재산 -${n}`,a:'family social'},{l:'거절한다',s:'',a:'safe greedy'}]);
   if(i===0){r.debt=n;r.debtY=s.year;say(`${n} ${money()}을 쥐여 주었다.`+fx({money:-n})+relFx(r,{close:6,trust:8}))}else say(`${npTop(r)} 고개를 끄덕이고 돌아섰다.`+relFx(r,{close:-8,trust:-4}));await done()}},
 {id:'f_god',k:['friend','close'],w:1.5,c:r=>npIn(r)&&r.kidY===s.year,f:async r=>{say(`${r.n}의 아이 세례식에 ${isM()?'대부':'대모'}로 섰다.${T()>=1793.8&&T()<1795?' 세례 대신 구청에서 공화국식 이름을 지어 주었다.':''}`+fx({rloc:1})+relFx(r,{close:8,trust:5}))}},
 {id:'f_wed',k:['friend','close'],w:1.5,c:r=>npIn(r)&&r.marY===s.year,f:async r=>{say(`${r.n}의 혼례에 증인으로 섰다. ${jo(r.mar,'은','는')} 수줍게 웃었다.`+relFx(r,{close:6,trust:4}))}},
 {id:'f_mygod',k:['close'],w:1.5,c:r=>npIn(r)&&s.kids.some(k=>k.y===s.year),f:async r=>{say(`갓 태어난 아이의 ${r.sex==='M'?'대부':'대모'}를 ${r.n}에게 부탁하였다.`+relFx(r,{close:8,trust:6}))}},
 {id:'f_nurse',k:['close','friend'],w:2,c:r=>npIn(r)&&s.st.hp<45&&r.close>=50,f:async r=>{say(`앓아누운 그대를 ${npSub(r)} 날마다 찾아와 ${pick(['수프를 떠먹였다','이마의 땀을 닦아 주었다','약값을 대신 치렀다'])}.`+fx({hp:3})+relFx(r,{close:6,trust:6}))}},
 {id:'f_warn',k:['close','friend'],w:2,c:r=>npIn(r)&&s.sus>=35&&r.close>=55,f:async r=>{say(`${npSub(r)} 밤늦게 찾아와 속삭였다. “구 위원회에서 자네 이름이 나왔네. 당분간 조심하게.”`+fx({sus:-6})+relFx(r,{trust:8}))}},
 {id:'f_save',k:['close','friend'],w:.6,c:r=>npIn(r)&&r.close>=55&&['다정','열정','다혈질'].includes(r.tr),f:async r=>{say(`${pick(['밤길에 강도를 만났을 때','센 강 얼음판이 꺼졌을 때','짐마차에 깔릴 뻔했을 때','불난 셋집에서 연기에 갇혔을 때'])} ${npSub(r)} 그대를 구해 냈다.`+fx({cour:1})+relFx(r,{close:10,trust:10,resp:6}),'ev')}},
 {id:'p_cell',k:['friend','close','admire','rival','hate','love'],w:4,c:r=>s.cond==='prison'&&r.cond==='prison',f:async r=>{say(`같은 감방의 ${npWith(r)} ${pick(['한 덩이 빵을 나누어 먹었다','짚더미 위에서 카드놀이를 하였다','벽에 날짜를 새기며 바깥 소식을 주고받았다','밤마다 서로 고향 이야기를 들려주었다','호명 소리에 함께 숨을 죽였다'])}.`+relFx(r,{close:7,trust:6,hate:-4}))}},
 {id:'f_letter',k:['friend','close','admire','love'],w:3,c:r=>r.alive&&['army','emigre','prison','deported','hiding'].includes(r.cond)&&!(s.cond==='prison'&&r.cond==='prison'),f:async r=>{const tx={army:`${npWar()}의 진중에서 ${r.n}의 편지가 왔다. “발이 부르트도록 걸었네. 빵은 딱딱하고 이가 들끓지만 아직 살아 있네.”`,emigre:`${r.emi||'런던'}에서 ${r.n}의 편지가 몰래 왔다. 망명지의 가난과 고향 그리움이 줄마다 배어 있다.`,prison:`감옥의 ${npSub(r)} 간수 손을 빌려 쪽지를 보냈다. “속옷과 빵을 부탁하네.”`,deported:`멀리 유형지에서 ${r.n}의 편지가 한 해 늦게 닿았다.`,hiding:`숨어 지내는 ${r.n}에게서 이름 없는 쪽지가 왔다.`}[r.cond];
   if(r.cond==='prison'&&inTerror()&&!child()){const i=await Q('감옥에서 온 쪽지','un billet',tx,[{l:'음식과 속옷을 넣어 준다',s:'재산 -15, 혐의 +3',a:'family bold'},{l:'답하지 않는다',s:'',a:'safe'}]);
     if(i===0)say('바구니를 감옥 문지기에게 맡겼다.'+fx({money:-15,sus:3})+relFx(r,{close:10,trust:10}));else say('쪽지를 난로에 넣었다.'+relFx(r,{close:-10,trust:-8}));await done();return}
   say(tx+(lit()?' 답장을 썼다.':' 대서인에게 답장을 부탁하였다.')+relFx(r,{close:3}))}},
 {id:'f_pol',k:['friend','close'],w:1.6,c:r=>npIn(r)&&!child()&&r.eng>=40&&npGap(r)>=45&&T()>=1788.5,f:async r=>{const left=r.pol>pubPol();
   const i=await Q('식탁의 논쟁','la dispute',`${npSub(r)} 술잔을 내려놓고 목소리를 높였다. ${left?'“아직도 그 늙은 질서를 믿는가? 인민이 일어섰네!”':'“자네들이 나라를 피바다로 만들고 있어. 질서 없이는 자유도 없네!”'}`,[{l:'맞서 논쟁한다',s:'웅변 판정',a:'bold'},{l:'화제를 돌린다',s:'',a:'safe social'},{l:'그의 말에 귀 기울인다',s:'성향이 그쪽으로 움직인다',a:left?'radical':'royal'}]);
   if(i===0){const x=await roll(md([[s.sk.orat>=30,1,'웅변'],[s.st.edu>=55,1,'학식'],[r.tr==='다혈질',-1,'상대가 다혈질']]).m,{label:'논쟁'});
     if(x.v>=5){r.pol=clamp(r.pol+(s.pol-r.pol)*.25,-100,100);say(`${npTop(r)} 한참 말이 없다가 “자네 말에도 일리가 있군” 하였다.`+fx({orat:1})+relFx(r,{resp:8}))}else say(`언성이 높아졌다. ${npTop(r)} 문을 쾅 닫고 나갔다.`+relFx(r,{close:-10,riv:6,hate:4}))}
   else if(i===1)say('포도주 이야기로 화제를 돌렸다. 둘 다 웃었지만 무언가 남았다.'+relFx(r,{close:-2}));
   else{const d=Math.round((r.pol-s.pol)*.12);say(`그의 말을 끝까지 들었다.`+fx({pol:d,brg:left?2:-2})+relFx(r,{close:5,resp:4}))}await done()}},
 {id:'f_lover',k:['friend','close','rival'],w:.8,c:r=>npIn(r)&&!s.married&&r.sex===s.sex&&s.age>=17&&s.age<=32&&!r.mar&&!priest()&&!nun(),f:async r=>{const who=isM()?woman():person();
   const opts=[{l:'물러선다',s:'',a:'safe social'},{l:'겨룬다',s:'사교 판정',a:'bold'}];if(npDuelOk(r))opts.push({l:'결투를 청한다',s:'불법이다. 목숨이 걸린다',a:'bold'});
   const i=await Q('연적','le rival en amour',`${who}에게 마음을 둔 줄 알았는데, ${npSub(r)} 같은 사람에게 꽃을 보낸다는 것을 알았다.`,opts);
   if(i===0)say(`${npWith(r)}의 우정을 택하였다. ${npTop(r)} 미안한 얼굴로 그대의 손을 잡았다.`+relFx(r,{close:8,trust:6}));
   else if(i===1){const x=await roll(md([[s.st.soc>=50,1,'사교'],[s.sk.dance>=30||s.sk.conv>=30,1,'춤·대화'],[r.tr==='쾌활'||r.tr==='허영',-1,'상대가 사교적']]).m,{label:'연적'});say(x.v>=5?`${who}${bat(who)?'은':'는'} 그대를 택하였다. ${npTop(r)} 축하한다고 했지만 눈이 웃지 않았다.`+fx({soc:1})+relFx(r,{riv:15,close:-10}):`${who}${bat(who)?'은':'는'} ${r.n}의 팔을 잡았다.`+relFx(r,{riv:12,close:-8,hate:5}))}
   else await npDuel(r,'연적');await done()}},
 {id:'f_betray',k:['friend','close'],w:.8,c:r=>npIn(r)&&!child()&&(['냉소','야심','허영'].includes(r.tr))&&r.trust<60,f:async r=>{const t=job()&&job().tr==='craft'?'그대의 단골손님들을 가로챘다':job()&&['law','letters','pol'].includes(job().tr)?'그대가 털어놓은 일을 윗사람에게 고자질하였다':'그대가 털어놓은 집안 사정을 온 동네에 퍼뜨렸다';
   const i=await Q('배신','la trahison',`${npSub(r)} ${t}. 사람들이 그대를 보고 수군거린다.`,[{l:'따지러 간다',s:'',a:'bold'},{l:'용서한다',s:'',a:'pious safe'},{l:'똑같이 갚아 준다',s:'',a:'greedy'}]);
   if(i===0)say(`${npTop(r)} 처음엔 잡아떼다가 결국 고개를 숙였다.`+fx({cour:1})+relFx(r,{trust:-10,close:-6,hate:6}));else if(i===1)say('아무 말도 하지 않았다. 대신 다시는 속을 털어놓지 않았다.'+fx({faith:1,vjus:-1})+relFx(r,{trust:-15}));
   else say(`${r.n}의 뒤를 캐어 그의 약점을 퍼뜨렸다.`+fx({rloc:-2,vhon:-2})+relFx(r,{hate:18,close:-15,riv:10}));await done()}},
 {id:'f_jeal',k:['friend','close','rival'],w:1.5,c:r=>npIn(r)&&!child()&&s.job&&s.jobSince===s.year&&['야심','허영','냉소'].includes(r.tr),f:async r=>{say(`그대가 ${job().n} 자리에 오르자 ${npTop(r)} 축하한다는 말 대신 입술을 깨물었다.`+relFx(r,{riv:12,close:-4}))}},
 {id:'f_confide',k:['close','friend'],w:1,c:r=>npIn(r),f:async r=>{say(`${npSub(r)} ${pick(['아무에게도 말하지 못한 빚 이야기를','몰래 사랑하는 사람 이야기를','아버지와 의절한 사연을','신앙을 잃었다는 고백을'])} 털어놓았다.`+relFx(r,{trust:8,close:4}))}},
 {id:'f_book',k:['close','friend','admire'],w:.7,c:r=>npIn(r)&&lit()&&(r.tr==='계몽'||r.estate!=='artisan'),f:async r=>{const b=T()<1789?pick(['루소의 『신 엘로이즈』','볼테르의 『캉디드』','레날의 『두 인도의 역사』','몰래 찍은 금서 한 권']):T()<1800?pick(['마라의 『인민의 벗』 묶음','콩도르세의 글','데물랭의 『비외 코르들리에』']):T()<1830?pick(['스탈 부인의 『코린』','샤토브리앙의 『그리스도교의 정수』','베랑제의 노래집']):pick(['위고의 『파리의 노트르담』','라므네의 『한 신자의 말』','발자크의 소설']);say(`${npSub(r)} ${jo(b,'을','를')} 빌려주었다.`+fx({edu:1,kphil:1})+relFx(r,{close:3,resp:3}))}},
 // ----- 맞수·라이벌 -----
 {id:'r_comp',k:['rival'],w:2,c:r=>npIn(r)&&!child(),f:async r=>{const what=job()?{craft:'장인 시험 작품(걸작)',law:'법정 변론',med:'외과 수술 시연',letters:'아카데미 현상 논문',church:'강론',army:'승진 심사',pol:'선거',farm:'장터 품평'}[job().tr]||'일':s.party?'클럽 연설':'살롱의 시 낭송';
   const i=await Q('맞수','la rivalité',`${npWith(r)} ${jo(what,'으로')} 겨루게 되었다. 사람들이 누가 이길지 내기를 건다.`,[{l:'정면으로 겨룬다',s:'실력 판정',a:'bold work'},{l:'뒤에서 손을 쓴다',s:'',a:'greedy'},{l:'양보한다',s:'',a:'safe'}]);
   if(i===0){const x=await roll(md([[s.st.dex>=50||s.st.edu>=55,1,'실력'],[s.st.soc>=55,1,'사교'],[r.tr==='야심',-1,'상대의 야심']]).m,{label:what});say(x.v>=5?`${npObj(r)} 눌렀다. ${npTop(r)} 패배를 인정하고 손을 내밀었다.`+fx({fame:1,rguild:3})+relFx(r,{riv:5,resp:8}):x.v>=3?'승부가 나지 않았다. 다음을 기약하였다.'+relFx(r,{riv:5}):`${r.n}에게 졌다. 그의 웃음이 귀에 남았다.`+fx({rguild:-2})+relFx(r,{riv:6,hate:4}))}
   else if(i===1){const bad=await chance(.35,'들통','뒷거래가 드러날 확률');say(bad?'뒷거래가 드러났다. 사람들이 그대를 손가락질하였다.'+fx({rguild:-5,vhon:-3})+relFx(r,{hate:15,riv:10}):`${npTop(r)} 영문도 모른 채 밀려났다.`+fx({rguild:2,vhon:-2})+relFx(r,{riv:8}))}
   else say(`${r.n}에게 자리를 양보하였다.`+relFx(r,{riv:-12,close:6,resp:-2}));await done()}},
 {id:'r_insult',k:['rival','hate'],w:1.4,c:r=>npIn(r)&&!child()&&s.age>=16,f:async r=>{const opts=[{l:'못 들은 척한다',s:'',a:'safe'},{l:npNob(r)||noble()?'법정에 명예훼손으로 고소한다':'주먹으로 갚아 준다',s:'',a:'bold'}];if(npDuelOk(r))opts.push({l:'결투를 청한다',s:'불법이다. 목숨이 걸린다',a:'bold'});
   const i=await Q('모욕','l’insulte',`${npSub(r)} ${pick(['여럿 앞에서 그대를 거짓말쟁이라 불렀다','그대 집안을 비웃는 노래를 지어 퍼뜨렸다','그대의 얼굴에 장갑을 던졌다','그대가 뇌물을 받았다고 떠들었다'])}.`,opts);
   if(i===0)say('이를 악물고 지나쳤다.'+fx({vhon:-2,faith:1})+relFx(r,{riv:3}));
   else if(i===1){if(npNob(r)||noble()){const x=await roll(md([[s.st.edu>=55,1,'학식'],[!!patron(),1,'후원자']]).m,{label:'소송'});say(x.v>=4?`법정이 ${r.n}에게 사과문을 쓰게 하였다.`+fx({money:-30,vhon:3,relite:2})+relFx(r,{hate:8,riv:5}):'소송비만 들었다.'+fx({money:-40})+relFx(r,{riv:6}))}
     else{const x=await roll(md([[s.st.str>=55,1,'체력'],[s.sk.arms>=30,1,'무예']]).m,{label:'주먹다짐'});say(x.v>=4?`${npObj(r)} 진창에 메쳤다. 이웃들이 박수를 쳤다.`+fx({str:1,rloc:1,cour:1})+relFx(r,{hate:8,resp:3}):`코피를 흘리며 돌아왔다.`+fx({hp:-3})+relFx(r,{hate:8,riv:5}))}}
   else await npDuel(r,'모욕');await done()}},
 {id:'r_recon',k:['rival'],w:1,c:r=>npIn(r)&&!child()&&r.riv>=35&&r.hate<45,f:async r=>{const i=await Q('화해의 기회','la réconciliation',`${npSub(r)} ${pick(['상을 당하였다','파산할 지경이라 한다','병들어 누웠다'])}. 그동안의 맞수에게 무엇을 하겠는가.`,[{l:'찾아가 손을 내민다',s:'',a:'social pious'},{l:'모른 척한다',s:'',a:'safe'}]);
   if(i===0){say(`${npTop(r)} 그대의 손을 오래 잡고 있었다. 맞수가 벗이 되었다.`+fx({vjus:1})+relFx(r,{riv:-25,close:15,trust:10,hate:-15}));if(r.role==='경쟁자'&&r.riv<40)r.role='친구'}else say('그 집 앞을 지나치지 않았다.'+relFx(r,{riv:2}));await done()}},
 {id:'r_rumor',k:['rival','hate'],w:1.2,c:r=>npIn(r)&&!child(),f:async r=>{say(`${npSub(r)} 뒤에서 그대를 헐뜯고 다닌다는 말이 들렸다.`+fx(job()?{rguild:-3}:{rloc:-2})+relFx(r,{hate:4,riv:3}))}},
 {id:'r_help',k:['rival'],w:.5,c:r=>npIn(r)&&!child()&&(s.st.hp<45||s.money<30),f:async r=>{say(`곤경에 빠진 그대를 뜻밖에도 ${npSub(r)} 도왔다. “내가 이길 상대가 없어지면 곤란하니까.”`+fx({money:20})+relFx(r,{resp:12,riv:-8,close:6}))}},
 // ----- 존경·스승·후원자 -----
 {id:'a_speech',k:['admire'],w:2,c:r=>npIn(r)&&!child()&&r.eng>=35,f:async r=>{const t=T(),where=t<1789?pick(['본당 강론','아카데미 공개 강연','카페의 낭독']):t<1795?pick(['구민회 연단','자코뱅 클럽 연단','코르들리에 클럽']):t<1815?pick(['학사원 강연','살롱의 낭독']):t<1848?pick(['의회 방청석에서 들은 연설','공화파 연회의 건배사','소르본 강의']):'민중 클럽 연단';
   const d=Math.round(clamp(r.pol-s.pol,-30,30)*.15);say(`${r.n}의 ${where}${bat(where)?'을':'를'} 들었다. 가슴이 뜨거워졌다.`+fx({pol:d,orat:1,kphil:1})+relFx(r,{resp:8,close:3}))}},
 {id:'a_teach',k:['admire'],w:1.5,c:r=>npIn(r)&&(r.role==='스승'||r.resp>=60),f:async r=>{const k=job()?(job().tr==='craft'?(s.spec||'craft'):job().tr==='med'?'heal':job().tr==='law'?'klaw':job().tr==='letters'?'klett':job().tr==='army'?'arms':'pen'):lit()?'klat':'craft';
   say(`${npSub(r)} ${pick(['몇 달 동안 저녁마다','손수 본을 보이며','편지로 꼼꼼히'])} 일을 가르쳐 주었다.`+fx({[k]:3})+relFx(r,{resp:5,close:4}))}},
 {id:'a_reco',k:['admire'],w:1,c:r=>npIn(r)&&!child()&&!!job()&&(r.role==='후원자'||r.role==='스승')&&r.trust>=50,f:async r=>{say(`${npSub(r)} 그대를 위해 추천장을 써 주었다.`+fx({inf:2,rguild:2})+relFx(r,{trust:4,resp:4}))}},
 {id:'a_fall',k:['admire','close'],w:3,c:r=>r.alive&&r.cond==='prison'&&!child()&&s.cond==='normal',f:async r=>{const i=await Q('갇힌 사람','la visite',`존경하던 ${npSub(r)} 감옥에 갇혔다. 면회를 가면 이름이 적힌다.`,[{l:'면회를 간다',s:'혐의 +',a:'bold family'},{l:'멀리서 기도만 한다',s:'',a:'safe pious'}]);
   if(i===0)say(`철창 너머로 ${npTop(r)} 그대를 알아보고 눈물을 글썽였다.`+fx({sus:inTerror()?8:3,vjus:2})+relFx(r,{close:12,trust:12}));else say('면회 가지 않았다.'+relFx(r,{close:-5}));await done()}},
 // ----- 혐오 -----
 {id:'h_denounce',k:['hate'],w:3,c:r=>npIn(r)&&!child()&&s.cond==='normal'&&(inTerror()||T()>=1815.5&&T()<1816.5)&&Math.abs(r.pol-pubPol())>=30,f:async r=>{const opts=[{l:'버틴다',s:'',a:'safe'},{l:'돈으로 입을 막는다',s:'재산 -80',a:'greedy',dis:s.money<80},{l:'먼저 그를 고발한다',s:'',a:'radical'}];const fr=npLive().find(x=>x!==r&&npIn(x)&&x.close>=60&&x.fac&&RULING(T()).includes(x.fac));if(fr)opts.push({l:`${fr.n}에게 도움을 청한다`,s:'',a:'social'});
   const i=await Q('밀고','la dénonciation',`${npSub(r)} 구 감시위원회에 그대를 고발하겠다고 떠들고 다닌다. 그 한마디면 충분한 세상이다.`,opts);
   if(i===0)say(`${npTop(r)} 정말로 고발장을 냈다.`+fx({sus:12,cour:1}),'dark');else if(i===1)say(`${npTop(r)} 돈을 받고 입을 다물었다.`+fx({money:-80})+relFx(r,{hate:5}));
   else if(i===2){say(`먼저 위원회 문을 두드렸다. ${npTop(r)} 그날 밤 끌려갔다.`+fx({sus:-6,vjus:-4,vhon:-3,rloc:-2}),'dark');r.cond='prison';r.py=s.year;r.denounced=1;npFate(r,'고발당해 감옥에 갇혔다.')}
   else{say(`${npSub(fr)} 위원회에 말을 넣어 고발장을 묻어 주었다.`+relFx(fr,{trust:5})+relFx(r,{hate:5}))}await done()}},
 {id:'h_street',k:['hate'],w:1.5,c:r=>npIn(r)&&!child(),f:async r=>{say(`${pick(['장터에서','성당 앞에서','선술집 문간에서','구민회장에서'])} ${npWith(r)} 마주쳤다. ${pick(['서로 침을 뱉었다','그가 들으라는 듯 그대 이야기를 큰소리로 하였다','눈길이 칼날처럼 부딪쳤다'])}.`+relFx(r,{hate:4}))}},
 {id:'h_gloat',k:['hate','rival'],w:3,c:r=>r.alive&&['prison','deported','emigre'].includes(r.cond)&&!child()&&s.cond==='normal'&&!r.gl,f:async r=>{r.gl=1;const i=await Q('원수의 몰락','la chute d’un ennemi',`그토록 미워하던 ${npSub(r)} ${r.cond==='prison'?'감옥에 갇혔다':r.cond==='emigre'?'모든 것을 버리고 나라 밖으로 달아났다':'유형지로 끌려갔다'}. 그의 식구들이 끼니를 거른다고 한다.`,[{l:'그 식구들에게 빵을 보낸다',s:'재산 -20',a:'pious family'},{l:'속으로 쾌재를 부른다',s:'',a:'safe'}]);
   if(i===0)say(`이름을 밝히지 않고 빵 바구니를 보냈다. 나중에 ${npTop(r)} 그것이 누구였는지 알게 되었다.`+fx({money:-20,vjus:3,faith:1})+relFx(r,{hate:-30,resp:10,close:8}));else say('그날 밤 포도주 한 병을 땄다.'+fx({vjus:-1})+relFx(r,{hate:3}));await done()}},
 // ----- 연인 -----
 {id:'l_meet',k:['love'],w:2,c:r=>npIn(r)&&!s.married,f:async r=>{say(`${npWith(r)} ${pick(noble()?['오페라 무도회의 가면 뒤에서','튈르리 정원 산책길에서','시녀를 사이에 둔 편지로']:['성당 뒤 골목에서','뤽상부르 정원 벤치에서','강변 갱게트 무도회에서','이웃 아낙들의 눈을 피해 다락방에서'])} 만났다.`+relFx(r,{close:8,trust:4}))}},
 {id:'l_prop',k:['love'],w:2.5,c:r=>npIn(r)&&!s.married&&r.close>=62&&s.age>=18&&!priest()&&!nun()&&!r.mar,f:async r=>{const gap=npNob(r)!==noble()||(r.estate==='artisan')!==(s.estate==='artisan');
   const i=await Q('청혼','la demande',`${npWith(r)} 함께 늙어 가고 싶다.${gap?' 그러나 두 집안의 처지가 다르다. 양쪽 집안이 고개를 저을 것이다.':''}`,[{l:'청혼한다',s:gap?'집안의 반대를 넘어야 한다':'',a:'family bold'},{l:'좀 더 기다린다',s:'',a:'safe'},{l:'헤어진다',s:'',a:'safe'}]);
   if(i===0){const x=gap?await roll(md([[s.st.soc>=50,1,'사교'],[s.st.cour>=50,1,'의지'],[!s.fa.alive&&!s.mo.alive,1,'반대할 부모가 없다'],[noble()&&!npNob(r),-1,'귀족 집안의 체면']]).m,{label:'집안의 반대'}):{v:6};
     if(x.v>=4){const E=r.estate,dowry=isM()?({peasant:80,artisan:300,bourgeois:3000,robe:15000,epee:40000,hobereau:8000}[E]||300):0;const pay=isM()?({peasant:60,artisan:150}[E]||0):Math.round(({artisan:330,bourgeois:1200,robe:3000,epee:5000,peasant:200,hobereau:1500}[E]||300));
       s.married=true;s.spouse={n:r.n,age:npAge(r),alive:true,pay,estate:E};if(dowry)s.money+=dowry;say(`${npWith(r)} 본당에서 혼인 미사를 올렸다.${dowry?` 지참금 ${fmt(dowry)} ${money()}.`:''}`+fx({soc:2,vfam:3}),'big');s.rel.splice(s.rel.indexOf(r),1)}
     else{say('집안이 끝내 허락하지 않았다. 둘은 울며 헤어졌다.'+fx({hp:-2,rfam:-2})+relFx(r,{close:-20}));r.role='친구'}}
   else if(i===1)say('조금 더 기다리기로 하였다.'+relFx(r,{close:-3}));else{say(`${npWith(r)} 헤어졌다.`+relFx(r,{close:-25,trust:-10}));r.role='친구'}await done()}},
 {id:'l_other',k:['love'],w:1,c:r=>npIn(r)&&r.close<58,f:async r=>{r.mar=npM(r)?woman():person();r.marY=s.year;r.role='친구';npFate(r,`${jo(r.mar,'과','와')} 혼인하였다.`);say(`${npTop(r)} 집안이 정해 준 ${jo(r.mar,'과','와')} 혼인하였다. 혼례 행렬이 그대의 집 앞을 지나갔다.`+fx({hp:-1})+relFx(r,{close:-10}),'ev')}},
];
// 결투: 1626년 이래 금지였으나 귀족·장교·학생 사이에 흔했다. 대개 첫 피에서 멈췄다.
async function npDuel(r,why){const x=await roll(md([[s.sk.arms>=35,1,'검술'],[s.st.cour>=55,1,'의지'],[s.st.str>=60,1,'체력'],[r.cond==='army'||npNob(r),-1,'상대가 칼을 다룰 줄 안다']]).m,{label:'결투'});
  if(x.v<=1&&await chance(.25,'결투의 상처','결투에서 크게 다친 이가 죽은 비율')){die('duel');return}
  if(x.v>=6&&await chance(.15,'치명상','결투 상대가 숨진 비율')){npDie(r,'duel','결투에서 그대의 칼에 맞아 숨졌다.');fx({sus:15,vhon:2});return}
  say(x.v>=4?`불로뉴 숲 새벽, ${r.n}의 팔에 첫 피가 흘렀다. 입회인들이 결투를 멈췄다.`+fx({vhon:4,cour:2,arms:2,sus:3})+relFx(r,{resp:10,riv:-10,hate:-5}):`어깨에 칼을 맞고 쓰러졌다. ${npTop(r)} 칼을 거두었다.`+fx({hp:-8,vhon:2,arms:1,sus:3})+relFx(r,{resp:4,hate:5}))}
function npBkey(r){if(child())return npAge(r)<16||r.role==='스승'?['child']:[];const b=relBond(r);return b==='혐오'?['hate']:b==='라이벌'||b==='경쟁자'?['rival']:b==='친우'?['close','friend']:b==='존경'||b==='스승'||b==='후원자'?['admire']:b==='연인'?['love']:['friend']}
async function npScene(){const L0=npLive().filter(r=>r.cond==='normal'||['army','emigre','prison','deported','hiding'].includes(r.cond));if(!L0.length)return;
  const r=wpick(L0.map(r=>[r,10+r.close*.6+r.riv*.4+(r.hate||0)*.5]));const ks=npBkey(r);
  const pool=NP_SC.filter(sc=>sc.k.some(k=>ks.includes(k))).filter(sc=>{try{return sc.c(r)}catch(e){return false}});if(!pool.length)return;
  const sc=wpick(pool.map(x=>[x,x.w]));s.npLast=sc.id;await sc.f(r)}
/* ---------- 12월마다 ---------- */
async function npcYear(){if(s.dead)return;npMeetTry();
  for(const r of npLive()){npLife(r);if(!r.alive)continue;if(r.cond==='normal')npPol(r);npReact(r)}
  if(s.cond==='normal'||s.cond==='prison')if(R()<(child()?.45:.6)){await npScene();if(s.dead)return}
  for(const r of npLive())npBondNote(r)}
/* ---------- 날짜 사건 (npcMonth) ---------- */
let npQ=0; // 한 번의 진행에서 선택 장면은 하나만
const npP=(p,r)=>p*(r.tr==='신중'?.6:r.tr==='열정'?1.5:r.tr==='다혈질'?1.25:1);
const npFriend=list=>list.filter(r=>r.close>=50).sort((a,b)=>b.close-a.close)[0];
const npCanQ=(lv=1)=>npQ<lv&&!child()&&s.cond==='normal'&&inParis()&&!s.dead;
// 체포: 공포정치기에는 감옥, 그 밖에는 재판 또는 석방
function npArrest(r,t){r.cond='prison';r.py=s.year;npEv(r,t||'체포되어 감옥에 갇혔다.',true)}
// 바리케이드에 함께 설 것인가: 1830 · 1832 · 1834 · 1839 · 1848
async function npBarri(r,o){npQ=1;const opts=[{l:'함께 바리케이드에 선다',s:'목숨이 걸린다',a:'bold radical'},{l:'그를 말린다',s:'설득 판정',a:'family safe'},{l:'문을 닫고 집에 있는다',s:'',a:'safe'}];
  const i=await Q(o.t,o.fr,o.txt,opts);let goes=true;
  if(i===0){if(await chance(o.pd,o.t,o.why)){die('riot',o.dt);await done();return 'dead'}say(o.ok+fx(o.fx));r.close=clamp(r.close+12,0,100);r.trust=clamp(r.trust+10,0,100);s.flags.npBarri=(s.flags.npBarri||0)+1}
  else if(i===1){const x=await roll(md([[r.close>=70,1,'깊은 우정'],[r.trust>=65,1,'신뢰'],[s.sk.orat>=30,1,'웅변'],[r.tr==='열정',-1,'그의 열정'],[r.pol>=70,-1,'굳은 신념']]).m,{label:'설득'});
    if(x.v>=5){goes=false;say(`${npTop(r)} 한참을 노려보다가 총을 내려놓았다. “겁쟁이라고 불러도 좋네. 자네 때문이야.”`+relFx(r,{close:-4,resp:-3}))}else say(`${npTop(r)} 그대의 손을 뿌리치고 나갔다.`+relFx(r,{close:-3}))}
  else say('덧문을 닫고 총소리를 들었다.'+relFx(r,{close:-6,resp:-5}));
  await done();return goes?(i===0?'with':'go'):'stay'}
// 진압 뒤 쫓기는 벗: 숨길 것인가
async function npHide(r,t){npQ=2;const i=await Q('쫓기는 벗','la cache',`${t} 피투성이가 된 ${npSub(r)} 밤중에 그대의 문을 두드렸다. 경찰과 국민방위대가 집집마다 뒤진다.`,[{l:'다락에 숨겨 준다',s:'혐의 +',a:'bold family'},{l:'돈을 쥐여 돌려보낸다',s:'재산 -20',a:'safe'},{l:'경찰에 알린다',s:'혐의 -, 평판 -',a:'royal'}]);
  if(i===0){if(await chance(.12,'가택 수색','숨겨 준 사람이 들킨 비율')){say(`수색대가 다락을 열었다. ${npTop(r)} 끌려가고 그대도 조서를 썼다.`+fx({sus:15,rloc:-2})+relFx(r,{trust:10,close:8}),'big');npArrest(r,'숨어 있다가 붙잡혔다.')}
    else{say(`${npTop(r)} 사흘 밤을 다락에서 앓다가 새벽에 빠져나갔다. 평생 이 일을 잊지 않을 것이다.`+fx({sus:5,vjus:2,cour:1})+relFx(r,{close:20,trust:25,resp:12}),'big');r.cond='hiding';r.hy=s.year}}
  else if(i===1){say(`${npObj(r)} 돌려보냈다.`+fx({money:-20})+relFx(r,{close:-12,trust:-10}));if(R()<.5)npArrest(r,'거리에서 붙잡혔다.')}
  else{say(`${npObj(r)} 경찰에 넘겼다. 이웃들은 그대를 다른 눈으로 본다.`+fx({sus:-8,rloc:-6,rpeople:-6,vjus:-4,vhon:-4}),'dark');r.close=0;r.trust=0;r.hate=clamp((r.hate||0)+60,0,100);r.role='경쟁자';npArrest(r,'고발당해 붙잡혔다.')}
  await done()}
// 봉기의 하루: 가담한 벗들의 생사
async function npRising(o){const L0=npLive().filter(r=>npIn(r)&&o.who(r));if(!L0.length)return;const go=L0.filter(r=>R()<npP(o.p(r),r));if(!go.length)return;
  const fr=npFriend(go);let mine=null;
  if(fr&&npCanQ()&&o.q&&!(o.skipQ&&o.skipQ())){mine=await npBarri(fr,o.q(fr));if(mine==='dead'||s.dead)return}
  for(const r of go){if(r===fr&&mine==='stay')continue;
    const pd=o.pd(r)*(r===fr&&mine==='with'?.7:1);if(R()<pd){npDie(r,o.dc||'riot',typeof o.dt==='function'?o.dt(r):o.dt);continue}
    npEv(r,typeof o.ok==='function'?o.ok(r):o.ok);if(o.after)o.after(r);
    if(o.lost&&R()<o.lost){if(r===fr&&npCanQ(2)&&r.close>=45){await npHide(r,o.lostT);if(s.dead)return}else npArrest(r,o.arT)}}
  if(fr&&mine==='stay'&&fr.alive)npFate(fr,'그대의 설득으로 집에 머물렀다.')}
const npRad=(r,p=40)=>r.pol>=p&&npM(r)&&npAge(r)>=16&&npAge(r)<=60;
// 파벌이 무너질 때 그 파벌의 가상 벗들 (relPurge가 숨겨 주었는지 r.pg로 안다)
function npPurge(id,arrest,death,txt){for(const r of npLive()){if(r.fac!==id||!['normal','hiding'].includes(r.cond))continue;const pg=r.pg&&r.pg.id===id&&r.pg.y===s.year?r.pg:null;
  if(pg&&pg.i===0){r.cond='hiding';r.hy=s.year;npFate(r,`${FAC[id].n} 숙청 때 그대의 집에 숨었다가 몰래 몸을 피했다.`);continue}
  const p=pg&&pg.i===2?.9:arrest*(.4+r.eng/100)*(r.tr==='신중'?.6:1);
  if(R()<p){if(R()<death*(pg&&pg.i===2?1.3:1))npDie(r,'guillotine',txt);else npArrest(r,`${FAC[id].n} 숙청 때 체포되었다.`)}else npFate(r,`${FAC[id].n} 숙청을 용케 피했다.`)}}
const NP_D=[
 [1789,7,async()=>{for(const r of npLive().filter(npIn)){const E=npEst(r);
   if(E==='noble'&&r.estate==='epee'&&R()<.15){r.cond='emigre';r.ey=s.year;r.emi=pick(['토리노','코블렌츠','브뤼셀']);npEv(r,`아르투아 백작을 따라 첫 망명길에 올라 ${jo(r.emi,'으로')} 떠났다.`,true);continue}
   if(npM(r)&&E!=='noble'&&npAge(r)>=16&&npAge(r)<=55&&r.pol>=5&&R()<npP(.12+(r.pol>=30?.15:0),r)){
     if(R()<.09){npDie(r,'riot','7월 14일 바스티유 공격 중 수비대의 총탄에 쓰러졌다.');continue}r.bast=1;r.pol=clamp(r.pol+8,-100,100);npEv(r,'7월 14일 바스티유 공격에 가담해 ‘바스티유의 정복자’ 명단에 이름을 올렸다.',true);if(s.flags.bastille&&!child())L(`포연 속에서 ${npWith(r)} 어깨를 나란히 했다.`+relFx(r,{close:12,trust:10}),'ev')}
   else if(E==='bourgeois'&&npM(r)&&npAge(r)>=18&&R()<.35&&!r.grp){r.grp='ng';npEv(r,'부르주아 민병(국민방위대)에 들어가 삼색 모표를 달았다.')}}}],
 [1789,10,async()=>{for(const r of npLive().filter(npIn))if(!npM(r)&&['artisan','peasant'].includes(r.estate)&&npAge(r)>=15&&npAge(r)<=60&&r.pol>=-5&&R()<npP(.35,r)){npEv(r,'빵을 달라며 베르사유로 행진하는 시장 여인들 틈에 끼어 비를 맞으며 걸었다.',true);if(!isM()&&!child()&&s.estate==='artisan'&&R()<.5)L(`베르사유 길에서 ${npWith(r)} 팔짱을 끼고 노래를 불렀다.`+relFx(r,{close:8}),'ev')}}],
 [1790,7,async()=>{for(const r of npLive().filter(npIn))if(npAge(r)>=12&&r.pol>=0&&R()<.4)npFate(r,'샹드마르스 연맹제 터를 고르는 데 삽을 들고 나갔다.')}],
 [1791,1,async()=>{for(const r of npLive().filter(x=>x.alive&&x.cler&&npM(x)&&npAge(x)>=20)){r.refr=R()<(r.tr==='경건'?.7:.4);npEv(r,r.refr?'성직자 시민헌법에 대한 선서를 거부하였다. ‘선서 거부 사제’가 되었다.':'성직자 시민헌법에 충성을 선서하였다.')}}],
 [1791,6,async()=>{for(const r of npLive().filter(npIn))if(npNob(r)&&npM(r)&&npAge(r)>=18&&npAge(r)<=60&&R()<.22){r.cond='emigre';r.ey=s.year;r.emi='코블렌츠';npEv(r,'왕이 바렌에서 붙잡히자 군대를 떠나 코블렌츠의 망명 귀족군으로 갔다.',true)}}],
 [1791,7,async()=>{await npRising({who:r=>npRad(r,50)||r.fac==='cordelier',p:()=>.35,pd:()=>.03,dt:'7월 17일 샹드마르스에서 폐위 청원 중 국민방위대의 총탄에 쓰러졌다.',ok:'7월 17일 샹드마르스의 폐위 청원에 서명하러 갔다가 국민방위대의 발포를 겪었다.',after:r=>{r.pol=clamp(r.pol+6,-100,100)}})}],
 [1791,8,async()=>{for(const r of npLive().filter(npIn))if(npM(r)&&!r.cler&&npAge(r)>=18&&npAge(r)<=40&&!r.mar&&r.pol>=20&&R()<npP(.12,r))npEnlist(r,'파리 의용병 대대에 자원하여')}],
 [1792,7,async()=>{for(const r of npLive().filter(npIn))if(npM(r)&&!r.cler&&npAge(r)>=18&&npAge(r)<=45&&r.pol>=15&&R()<npP(.18,r))npEnlist(r,'“조국이 위기에 처했다”는 포고에 의용병으로 자원하여')}],
 [1792,8,async()=>{for(const r of npLive().filter(npIn)){const a=npAge(r);
   if(npNob(r)&&npM(r)&&a>=18&&a<=60&&r.pol<=-20&&R()<npP(.12,r)){if(R()<.5){npDie(r,'massacre','8월 10일 튈르리 궁을 지키다 군중에게 살해되었다.');continue}npArrest(r,'8월 10일 튈르리 궁을 지키다 붙잡혀 아베 감옥에 갇혔다.');continue}
   if(npRad(r,25)&&!npNob(r)&&R()<npP(.3,r)){if(R()<.03){npDie(r,'riot','8월 10일 튈르리 궁 공격 중 스위스 근위대의 총탄에 쓰러졌다.');continue}npEv(r,'8월 10일 튈르리 궁 공격에 가담하였다.',true);r.pol=clamp(r.pol+6,-100,100);continue}
   if(r.cler&&!npM(r)){r.cler=false;r.job='수녀원에서 쫓겨난 옛 수녀';npEv(r,'수녀원이 문을 닫아 세속으로 돌아왔다.');continue}
   if(r.cler&&r.refr&&R()<.45){npArrest(r,'선서 거부 사제로 붙잡혀 카름 수도원에 갇혔다.');continue}
   if(npNob(r)&&R()<.15)npArrest(r,'혐의자로 붙잡혀 라포르스 감옥에 갇혔다.')}
   }],
 [1792,9,async()=>{const pr=npLive().filter(r=>r.cond==='prison');if(pr.length){const fr=npFriend(pr);let vouch=null;
   if(fr&&npCanQ()){npQ=1;const i=await Q('감옥 문 앞','massacres de Septembre',`감옥마다 군중이 들이닥쳐 즉석 재판을 연다는 소식이다. ${fr.n}${bat(fr.n)?'이':'가'} 거기 있다.`,[{l:'감옥으로 달려가 그를 위해 증언한다',s:'혐의 +, 그의 목숨이 걸린다',a:'bold family'},{l:'집에서 기다린다',s:'',a:'safe'}]);
     if(i===0){vouch=fr;say('피 냄새 나는 마당에서 ‘재판관’들 앞에 섰다. “이 사람은 애국자요, 내가 보증하오!”'+fx({sus:8,cour:3,vjus:3}))}else say('밤새 잠들지 못했다.');await done()}
   for(const r of pr){const p=(r.cler?.75:npNob(r)?.55:.3)*(r===vouch?.4:1);if(R()<p)npDie(r,'massacre',`9월 ${ri(2,6)}일 ${r.cler?'카름 수도원':pick(['아베 감옥','라포르스 감옥','콩시에르주리'])}에 들이닥친 군중에게 살해되었다.`);else{r.cond='normal';npEv(r,`“국민 만세!” 소리와 함께 감옥에서 풀려났다.${r===vouch?' 그대의 증언 덕분이었다.':''}`,true);if(r===vouch)relFx(r,{close:25,trust:30,resp:15})}}}
   for(const r of npLive().filter(npIn)){if(npRad(r,75)&&r.estate==='artisan'&&R()<.05){r.sept=1;npEv(r,'감옥 학살에 끼었다는 소문이 돌았다.',true);if(!child()&&s.val.vjus>=50)relFx(r,{hate:15,resp:-10,close:-10})}
     else if(npNob(r)&&R()<.35){r.cond='emigre';r.ey=s.year;r.emi=pick(['런던','함부르크','브뤼셀']);npEv(r,`가짜 통행증을 구해 ${jo(r.emi,'으로')} 망명하였다.`,true)}
     else if(r.cler&&r.refr&&R()<.6){r.cond='emigre';r.ey=s.year;r.emi=pick(['런던','에스파냐','로마']);npEv(r,`추방령에 따라 ${jo(r.emi,'으로')} 떠났다.`)}}}],
 [1793,3,async()=>{for(const r of npLive().filter(npIn))if(npM(r)&&!r.cler&&npAge(r)>=18&&npAge(r)<=40&&!r.mar&&R()<npP(.15,r))npEnlist(r,'30만 명 징집령에 뽑혀')}],
 [1793,6,async()=>{for(const r of npLive().filter(npIn))if((r.grp==='sc'||npRad(r,60))&&R()<.5)npEv(r,'대포를 끌고 국민공회를 에워싼 구민들 틈에 있었다.');npPurge('girondin',.35,.35,'지롱드파로 몰려 혁명 광장의 단두대에서 처형되었다.')}],
 [1793,8,async()=>{for(const r of npLive().filter(npIn)){const a=npAge(r);if(npM(r)&&!r.cler&&a>=18&&a<=25&&!r.mar&&R()<.7)npEnlist(r,'국민총동원령으로');else if(npM(r)&&a>=25&&a<=60&&r.estate==='artisan'&&R()<.25)npFate(r,'뤽상부르의 국영 무기 제작소에서 총을 만들었다.');else if(!npM(r)&&a>=14&&R()<.25)npFate(r,'구청에서 군복과 천막을 꿰매었다.')}}],
 [1793,11,async()=>{for(const r of npLive().filter(npIn)){if(r.cler&&!r.refr&&R()<.35){r.cler=false;r.job='사제직을 내려놓은 옛 신부';npEv(r,'비기독교화의 바람 속에 사제직을 내려놓았다.')}else if(r.tr==='경건'&&R()<.5){npFate(r,'노트르담이 ‘이성의 신전’이 되던 날 몰래 성호를 그었다.');if(!child()&&['reason','supreme'].includes(faithModeNow()))relFx(r,{close:-8,resp:-6})}}}],
 [1794,3,async()=>{npPurge('cordelier',.25,.4,'에베르파로 몰려 단두대에서 처형되었다.')}],
 [1794,4,async()=>{npPurge('indulgent',.25,.4,'관용파로 몰려 단두대에서 처형되었다.')}],
 [1794,7,async()=>{for(const r of npLive().filter(x=>x.alive&&x.fac==='jacobin'&&x.cond==='normal')){const pg=r.pg&&r.pg.id==='jacobin'&&r.pg.y===s.year?r.pg:null;if(pg&&pg.i===0){r.cond='hiding';r.hy=s.year;npFate(r,'테르미도르 9일 뒤 그대의 다락에 숨었다.');continue}
   if(R()<(pg&&pg.i===2?.9:.12*(.5+r.eng/100))){if(R()<.5)npDie(r,'guillotine','테르미도르 10~12일 파리 코뮌 사람들과 함께 단두대에서 처형되었다.');else npArrest(r,'‘로베스피에르의 꼬리’로 몰려 체포되었다.')}else npFate(r,'테르미도르 9일 뒤 숨을 죽이고 지냈다.')}}],
 [1794,11,async()=>{for(const r of npLive().filter(npIn)){if((r.fac==='jacobin'||r.grp==='sc')&&R()<.3){npEv(r,'금빛 청년단의 몽둥이에 맞아 길바닥에 쓰러졌다.');r.wound=1}else if(r.grp==='jd'&&R()<.5)npFate(r,'자코뱅 클럽 문을 부수는 데 끼었다.')}}],
 [1795,5,async()=>{await npRising({who:r=>(r.grp==='sc'||npRad(r,50))&&r.estate!=='bourgeois'&&!npNob(r),p:()=>.4,pd:()=>.03,dt:'프레리알 봉기 때 국민공회 앞에서 쓰러졌다.',ok:'“빵과 1793년 헌법!”을 외치며 국민공회로 밀고 들어갔다.',lost:.25,arT:'프레리알 봉기 뒤 생탕투안 문밖이 포위되었을 때 붙잡혔다.',lostT:'생탕투안 문밖이 군대에 포위되었다.'})}],
 [1795,7,async()=>{for(const r of npLive().filter(x=>x.alive&&x.cond==='emigre'&&npNob(x)&&npM(x)&&npAge(x)<55))if(R()<.1){if(R()<.65)npDie(r,'shot','키브롱에 상륙했다가 붙잡혀 오레의 들판에서 총살되었다.');else npEv(r,'키브롱 상륙에 나섰다가 영국 배로 겨우 달아났다.',true)}}],
 [1795,10,async()=>{await npRising({who:r=>r.pol<=0&&npM(r)&&npAge(r)>=16&&npAge(r)<=60&&(r.estate==='bourgeois'||npNob(r)||r.grp==='jd'),p:()=>.3,pd:()=>.06,dt:'방데미에르 13일 생로슈 성당 앞에서 보나파르트의 포도탄을 맞고 쓰러졌다.',ok:'방데미에르 13일 왕당파 구민들과 함께 국민공회로 진격했다가 포도탄 앞에서 흩어졌다.'})}],
 [1796,5,async()=>{npPurge('babeuf',.5,.05,'평등파 음모로 방돔에서 재판받아 처형되었다.')}],
 [1797,9,async()=>{for(const r of npLive().filter(x=>x.alive&&x.fac==='clichy'&&x.cond==='normal'))if(R()<.12){r.cond='deported';npEv(r,'프뤽티도르 18일 뒤 기아나로 유형되었다. 사람들은 그곳을 ‘마른 단두대’라 불렀다.',true)}}],
 [1801,1,async()=>{for(const r of npLive().filter(x=>npIn(x)&&(x.fac==='neojacobin'||x.pol>=65)&&npM(x)))if(R()<.12){r.cond='deported';npEv(r,'생니카즈 거리 폭탄 사건(실은 왕당파의 짓)의 죄를 뒤집어쓰고 세이셸 제도로 유형되었다.',true)}}],
 [1802,4,async()=>{for(const r of npLive().filter(x=>x.alive&&x.cler&&x.refr)){if(r.cond==='emigre')r.cond='normal';npEv(r,'콩코르다트 뒤 다시 공공연히 미사를 드리게 되었다.')}}],
 [1812,7,async()=>{for(const r of npLive().filter(x=>x.alive&&x.cond==='army'))if(R()<.55){r.rus=1;npFate(r,'대육군과 함께 네만 강을 건너 러시아로 들어갔다.')}}],
 [1813,1,async()=>{for(const r of npLive().filter(x=>x.alive&&x.rus)){r.rus=0;if(R()<.7)npDie(r,'battle',pick(['러시아 퇴각 중 눈 속에서 쓰러졌다.','베레지나 강을 건너다 얼음물에 휩쓸렸다.','빌나 길가에서 얼어 죽었다.']));else npEv(r,'러시아에서 살아 돌아왔다. 동상으로 발가락 셋을 잃었다.',true)}}],
 [1814,3,async()=>{for(const r of npLive().filter(x=>npIn(x)&&npM(x)&&npAge(x)>=16&&npAge(x)<=55&&(x.grp==='ng'||/폴리테크니크/.test(x.job||''))))if(R()<.4){if(R()<.04)npDie(r,'battle','3월 30일 파리 성문 앞(트론 관문)에서 연합군과 싸우다 쓰러졌다.');else npEv(r,'3월 30일 파리 방어전에서 성문을 지켰다.')}}],
 [1815,6,async()=>{for(const r of npLive().filter(x=>x.alive&&x.cond==='army'))if(R()<.2)npDie(r,'battle','워털루의 몽생장 고지에서 전사하였다.');else if(R()<.4)npEv(r,'워털루에서 살아남았다. “근위대는 죽을지언정 항복하지 않는다”는 외침을 들었다고 했다.')}],
 [1815,9,async()=>{for(const r of npLive().filter(npIn))if(r.fac==='bonapartist'&&R()<.3)npEv(r,'백일천하 때 황제를 섬겼다는 이유로 일자리에서 쫓겨났다.')}],
 [1830,7,async()=>{await npRising({who:r=>npRad(r,15)||(r.fac==='ideologue'&&npM(r)),p:r=>.3+(/학생/.test(r.job||'')?.2:0),pd:()=>.05,dt:'7월 혁명(영광의 사흘) 바리케이드에서 근위대의 총탄에 쓰러졌다.',ok:'영광의 사흘 동안 포석을 뜯어 바리케이드를 쌓았다. 7월 훈장을 받았다.',skipQ:()=>isM()&&s.pol>=10&&s.age<60,
   q:r=>({t:'영광의 사흘',fr:'Trois Glorieuses',txt:`${npSub(r)} 삼색기를 두르고 왔다. “칙령이 우리 입을 막았네. 오늘은 포석이 말할 차례야!”`,pd:.02,why:'7월 혁명 바리케이드 전투원의 사망률',dt:'7월 혁명의 바리케이드에서 쓰러졌다.',ok:`${npWith(r)} 오텔드빌 앞 바리케이드를 지켰다. 사흘 만에 왕이 달아났다.`,fx:{fame:3,pol:4,rpeople:4,brg:3,vlib:2}})});
   for(const r of npLive().filter(npIn))if((r.fac==='ultra'||r.fac==='legitimist')&&/판사|대위|대령|시종|도지사|장교/.test(r.job||'')&&R()<.5)npEv(r,'루이 필리프에게 충성 선서를 거부하고 관직을 내놓았다.')}],
 [1832,6,async()=>{await npRising({who:r=>(r.grp==='sdh'||r.fac==='republican'||r.pol>=45)&&npM(r)&&npAge(r)>=16&&npAge(r)<=50,p:r=>.35+(/학생/.test(r.job||'')?.15:0),pd:r=>(r.smq=R()<.4)?.3:.05,
   dt:r=>r.smq?'6월 6일 생메리 수도원 바리케이드에서 마지막까지 버티다 쓰러졌다.':'6월 5일 생드니 거리 바리케이드에서 쓰러졌다.',ok:r=>r.smq?'생메리 수도원 바리케이드에서 마지막까지 싸우고 살아남았다.':'라마르크 장군 장례 행렬에서 붉은 깃발을 따라 생드니 거리 바리케이드에 섰다.',
   lost:.4,arT:'6월 봉기 뒤 붙잡혀 감옥에 갇혔다.',lostT:'생메리의 마지막 바리케이드가 무너졌다.',
   q:r=>({t:'라마르크 장군의 장례',fr:'5 juin 1832',txt:`라마르크 장군의 운구 행렬이 오스테를리츠 다리에 이르자 붉은 깃발이 올랐다. “자유가 아니면 죽음을!” ${npSub(r)} 숨을 몰아쉬며 왔다. “생드니 거리 샹브르리 골목에 바리케이드를 쌓고 있네. 같이 가세.”`,pd:isM()?.07:.03,why:'6월 봉기 바리케이드 가담자의 사망률',dt:'1832년 6월 봉기의 바리케이드에서 쓰러졌다.',ok:`${npWith(r)} 바리케이드 뒤에서 밤을 새웠다. 새벽에 국민방위대의 대포가 다가왔고, 뒷골목으로 겨우 빠져나왔다.`,fx:{fame:2,pol:5,sus:15,cour:3,rpeople:4,relite:-4,brg:4,veq:2}})})}],
 [1834,4,async()=>{await npRising({who:r=>(r.grp==='sdh'||r.pol>=60)&&npM(r)&&npAge(r)<=55,p:()=>.2,pd:()=>.08,dt:'4월 봉기 때 트랑스노냉 거리에서 군대에 살해되었다.',ok:'4월 봉기의 바리케이드에 섰다.',lost:.4,arT:'4월 봉기 뒤 붙잡혀 이듬해 ‘4월 재판’에 넘겨졌다.'})}],
 [1839,5,async()=>{await npRising({who:r=>(r.grp==='sais'||r.pol>=70)&&npM(r)&&npAge(r)<=55,p:()=>.2,pd:()=>.1,dt:'5월 12일 계절회 봉기 때 시청 앞에서 쓰러졌다.',ok:'5월 12일 블랑키·바르베스의 계절회 봉기에 가담하였다.',lost:.45,arT:'계절회 봉기 뒤 붙잡혀 몽생미셸 감옥으로 보내졌다.'})}],
 [1848,2,async()=>{await npRising({who:r=>npRad(r,20),p:()=>.35,pd:()=>.03,dt:'2월 혁명 때 카퓌신 대로의 발포에 쓰러졌다.',ok:'2월 혁명의 바리케이드에 섰다. 튈르리 궁의 왕좌가 바스티유 광장에서 불탔다.',skipQ:()=>false,
   q:r=>({t:'2월 혁명',fr:'février 1848',txt:`카퓌신 대로에서 군대가 시위대에 발포했다는 소식이다. ${npSub(r)} 문을 두드린다. “시체를 수레에 싣고 횃불을 들었네. 오늘 밤 왕정은 끝이야!”`,pd:.02,why:'2월 혁명 바리케이드 가담자의 사망률',dt:'2월 혁명의 바리케이드에서 쓰러졌다.',ok:`${npWith(r)} 바리케이드를 지켰다. 이튿날 루이 필리프가 물러나고 공화국이 선포되었다.`,fx:{fame:3,pol:5,rpeople:5,brg:4,veq:2}})})}],
 [1848,6,async()=>{await npRising({who:r=>r.pol>=35&&r.estate!=='bourgeois'&&!npNob(r)&&npM(r)&&npAge(r)>=16&&npAge(r)<=60,p:()=>.4,pd:()=>.1,dt:'6월 봉기 때 생탕투안 문밖 바리케이드에서 카베냐크의 군대에 쓰러졌다.',ok:'국립작업장 폐쇄에 맞서 생탕투안 문밖 바리케이드에 섰다.',lost:.35,arT:'6월 봉기 뒤 붙잡혀 알제리 유형 판결을 받았다.',lostT:'생탕투안 문밖이 함락되었다.',after:r=>{},
   q:r=>({t:'6월 봉기',fr:'juin 1848',txt:`국립작업장이 문을 닫았다. ${npSub(r)} 말했다. “빵이냐 납탄이냐. 생탕투안 문밖에 바리케이드를 쌓네.”`,pd:isM()?.08:.03,why:'6월 봉기 가담자의 사망률',dt:'1848년 6월 봉기의 바리케이드에서 쓰러졌다.',ok:`${npWith(r)} 바리케이드를 지켰다. 나흘째 대포가 골목을 부수었고, 둘은 하수구로 빠져나왔다.`,fx:{pol:6,sus:20,cour:3,rpeople:5,relite:-6,veq:3}})});
   for(const r of npLive().filter(x=>npIn(x)&&x.grp==='ng'&&npM(x)&&npAge(x)<=60))if(R()<.4){if(R()<.03)npDie(r,'battle','6월 봉기 진압에 나섰다가 바리케이드의 총탄에 쓰러졌다.');else npEv(r,'국민방위대로 6월 봉기 진압에 나섰다.')}
   for(const r of npLive().filter(x=>x.cond==='prison'&&x.py===s.year))if(R()<.4){r.cond='deported';npFate(r,'알제리로 유형되었다.')}}],
 [1851,12,async()=>{for(const r of npLive().filter(x=>npIn(x)&&x.pol>=50&&npM(x)))if(R()<.15){r.cond='deported';npEv(r,'12월 2일 쿠데타에 맞서다 붙잡혀 알제리로 유형되었다.',true)}}],
];
// 공포정치의 한 달 (1793년 9월 ~ 1794년 7월): 체포와 혁명재판소. 테르미도르 뒤에는 석방.
async function npTerrorMonth(mi){const t=(mi-2)/12;const great=t>=1794.25&&t<1794.4;let q=null;
  for(const r of npLive()){if(r.cond==='normal'){let p=.0015+(npNob(r)?.02:0)+(r.cler&&r.refr?.04:0)+(r.pol<=-30?.006:0)+(['girondin','feuillant','royalist','monarchien','indulgent'].includes(r.fac)?.01:0)+(r.denounced?.08:0);
      p*=(great?1.8:1)*(r.tr==='신중'?.6:1);if(R()<p){npArrest(r,`혐의자법에 따라 ${pick(['뤽상부르','포르리브르','라포르스','생라자르','카름'])} 감옥에 갇혔다.`);if(r.close>=55&&!q)q=r}}
    else if(r.cond==='prison'){const p=(npNob(r)||r.cler||['girondin','royalist','feuillant'].includes(r.fac)?.05:.015)*(great?2.5:1)*(r.saved?.4:1);
      if(R()<p)npDie(r,'guillotine',`혁명재판소에서 사형 판결을 받고 ${great?'왕좌 전복 광장':'혁명 광장'}의 단두대에 올랐다.`);else if(R()<.03){r.cond='normal';npEv(r,'구 위원회의 증명서를 얻어 감옥에서 풀려났다.')}}}
  if(q&&npCanQ()){npQ=1;const i=await Q('갇힌 벗','les suspects',`${q.n}${bat(q.n)?'이':'가'} 혐의자로 끌려갔다. 구 감시위원회에 탄원서를 낼 수 있다. 그러나 혐의자를 감싸는 자도 혐의자다.`,[{l:'탄원서를 내고 보증을 선다',s:'혐의 +, 사교·영향력 판정',a:'bold family'},{l:'감옥에 음식만 넣어 준다',s:'재산 -15',a:'family safe'},{l:'모른 척한다',s:'',a:'safe'}]);
    if(i===0){const x=await roll(md([[s.st.soc>=55,1,'사교'],[influence().v>=30,1,'영향력'],[!!s.party&&RULING(T()).includes(s.party),1,'집권 파벌 소속'],[noble(),-1,'그대도 귀족']]).m,{label:'탄원'});
      if(x.v>=5){q.cond='normal';q.saved=1;say(`위원회가 탄원을 받아들였다. ${npTop(q)} 열흘 만에 풀려났다.`+fx({sus:6,vjus:2})+relFx(q,{close:20,trust:25,resp:12}),'big')}else{q.saved=1;say('탄원서는 서류 더미에 묻혔다. 그대의 이름만 위원회 장부에 올랐다.'+fx({sus:10})+relFx(q,{close:10,trust:12}))}}
    else if(i===1)say('빵과 속옷을 감옥 문지기에게 맡겼다.'+fx({money:-15,sus:2})+relFx(q,{close:8,trust:6}));else say('그 이름을 입에 올리지 않았다.'+relFx(q,{close:-15,trust:-15}));await done()}}
function npRelease(){for(const r of npLive())if(r.cond==='prison'&&R()<.35){r.cond='normal';npEv(r,'테르미도르 뒤 감옥 문이 열려 풀려났다.',true)}else if(r.cond==='hiding'&&R()<.3){r.cond='normal';npFate(r,'숨어 지내던 곳에서 나왔다.')}}
// 콜레라(1832년 4~9월 파리 사망률 약 2.3%, 1849년 약 1.9%): 가난하고 늙을수록 위험
function npCholera(mi){const y=Math.floor(mi/12),m=mi%12+1;const tot=y===1832?.023:.019;const sh=y===1832?{4:.55,5:.1,6:.08,7:.12,8:.1,9:.05}:{3:.05,4:.15,5:.2,6:.35,7:.15,8:.07,9:.03};const f=sh[m]||0;if(!f)return;
  for(const r of npLive().filter(x=>x.cond==='normal'||x.cond==='prison')){const mult=(npNob(r)?.5:r.estate==='bourgeois'?.8:1.4)*(npAge(r)>=50?2:npAge(r)<10?1.3:1);if(R()<tot*f*mult)npDie(r,'cholera',`${npAge(r)}세에 콜레라에 걸려 하루 만에 숨을 거두었다.`)}}
async function npcMonth(a,b){if(s.dead||!(s.rel||[]).some(r=>r.kind==='fic'&&r.alive))return;npQ=0;const A=Math.round(a*12+2),B=Math.round(b*12+2);
  for(const [y,m,f] of NP_D){const mi=npTm(y,m);if(mi>A&&mi<=B){await f();if(s.dead)return}}
  for(let mi=A+1;mi<=B;mi++){const t=(mi-2)/12;
    if(t>=1793.5&&t<1794.4){await npTerrorMonth(mi);if(s.dead)return}
    else if(t>=1794.4&&t<1795.2)npRelease();
    const y=Math.floor(mi/12);if(y===1832||y===1849)npCholera(mi)}}
/* ---------- 화면: 가상 인물 줄 ---------- */
// ui.js의 relRow를 감싸 가상의 벗에게 나이·일·동네·성격·관계의 성격·지난 일을 덧붙인다.
const npRelRow0=relRow;
relRow=function(r,full){const d=npRelRow0(r,full);if(!r||r.kind!=='fic')return d;try{const b=relBond(r);
  const tag=d.querySelector('.tag');if(tag&&b!==r.role)tag.textContent=`${r.role} · ${b}`;
  const rh=d.querySelector('.rh');if(rh){const sp=el('span','mut small',`${npAge(r)}세 · ${npJob(r)} · ${r.home}${r.cond!=='normal'?` · ${{army:'군 복무 중',emigre:'망명 중',prison:'수감 중',hiding:'숨어 지냄',deported:'유형 중'}[r.cond]||''}`:''}`);rh.insertBefore(sp,rh.children[1]||null)}
  if(full){const p=el('p','small mut',`성격 ${r.tr}(${NP_TRD[r.tr]}). ${r.w}${r.w?'.':''}${r.grp?` ${NP_GRP[r.grp]}.`:''}${r.mar?` 배우자 ${r.mar}${r.kids?`, 자녀 ${r.kids}`:''}.`:''}`);d.insertBefore(p,d.querySelector('.rv'));
    if(r.fate&&r.fate.length){const f=el('p','small mut',r.fate.slice(-4).join(' · '));d.appendChild(f)}}
  if((r.hate||0)>=20){const rv=d.querySelector('.rv');if(rv)rv.appendChild(el('span','warn',`미움 ${r.hate}`))}}catch(e){}return d};
