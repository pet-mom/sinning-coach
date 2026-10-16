/* ================= 귀부인의 일생 (nob_) =================
   여성 귀족(대귀족 epee · 법복귀족 robe · 시골 귀족 hobereau)의 어린 시절, 수녀원, 혼담, 결혼 생활,
   혁명과 망명, 제국·복고 궁정, 과부살이와 노년. 부유한 부르주아 부인(bourgeois + rich)의 장면 일부 포함.
   상태 플래그: s.flags.presented(궁정 알현) salon(살롱) husEmi(남편 망명) paperDiv(서류상 이혼)
   lover(애인) wetnurse/nursed(유모·직접 수유) sepBiens(재산 분리) dame(궁정 시녀) widowRun(과부 영지 경영) */
{
const nf=()=>!isM()&&noble();
const nfa=()=>nf()&&free()&&!nun();                                   // 성인 귀족 여성(평상시)
const ngirl=(a=8,b=15)=>nf()&&s.cond==='normal'&&s.age>=a&&s.age<=b;
const hus=()=>!!(s.spouse&&s.spouse.alive);
const maiden=()=>!s.married&&!hus();
const widow=()=>s.married&&s.spouse&&!s.spouse.alive&&!s.divorced;
const wife=()=>nfa()&&hus();
const epee=()=>s.estate==='epee', robe=()=>s.estate==='robe', hob=()=>s.estate==='hobereau';
const bl=()=>!isM()&&s.estate==='bourgeois'&&rich()&&free()&&!nun();
const blw=()=>bl()&&hus();
const tt=(a,b)=>T()>=a&&T()<b;
const hn=()=>s.spouse?s.spouse.n:'남편';
const baby=()=>s.kids.some(k=>k.alive&&s.year-k.y<=1);
const kidsAt=(a,b)=>s.kids.filter(k=>k.alive&&s.year-k.y>=a&&s.year-k.y<=b);
const TITLES=['백작','후작','자작','남작','기사'];
const nobleMan=(t)=>`${pick(NOBLE_SURS)[0]} ${t||pick(TITLES)}`;
const HPAY={epee:9000,robe:5000,hobereau:1400,bourgeois:3500};
const wedTo=(nm,age,est,pay,line,o={})=>{s.married=true;s.spouse={n:nm,age,alive:true,pay,estate:est};s.flags.nobWed=s.year;if(o.flags)Object.assign(s.flags,o.flags);
  say(line+fx(o.fx||{soc:2}),'big')};
const leaveConv=()=>{const x=SCH();if(x.st==='convent')x.st='done'};
// 관계 인물(연인·경쟁자·후원자)과 파벌 신뢰. 그 시기에 있는 파벌에만 쓴다.
const nRel=(role,o)=>(o.n&&relsAlive().find(x=>x.n===o.n))||addRel(role,o);
const nRF=(r,o)=>r?relFx(r,o):'';
const nFac=(ids,n)=>activeFactions().filter(f=>ids.includes(f.id)).forEach(f=>frelAdd(f.id,n));
const nLady=t=>`${pick(NOBLE_SURS)[0]} ${t||pick(['공작부인','후작부인','백작부인'])}`;

EV.push(
 /* ---------------- 어린 시절과 수녀원 ---------------- */
 S('nob_conv',()=>ngirl(8,16)&&SCH().st==='convent',1.8,0,[
   ['수녀원 기숙학교의 하루는 새벽 미사로 시작하여 저녁 기도로 끝났다.',{faith:2}],
   ['색실로 제단보에 꽃무늬를 수놓았다.',{sew:2,dex:1}],
   ['면회실 쇠창살 너머로 어머니가 사탕 상자를 건네주었다.',{}],
   ['언니뻘 기숙생들이 사교계와 혼담 이야기를 소곤거리는 것을 엿들었다.',{soc:1}],
   ['첫 영성체를 받았다. 흰 베일을 쓰고 촛불을 들었다.',{faith:4},null,1],
   ['수녀님이 집으로 보내는 편지를 먼저 읽고 철자를 고쳐 주었다.',{edu:1}],
   ['음악 교사가 쇠창살 너머에서 클라브생 수업을 하였다.',{music:2,edu:1}],
   ['귀족 아가씨들은 따로 방을 쓰고 하녀를 두었다. 상인 집 딸들이 부러운 눈으로 보았다.',{soc:1},()=>epee()||robe()],
   ['아베오부아 수녀원에는 공작 집안 딸들이 사교계처럼 저녁 방문객을 맞았다.',{soc:2},()=>epee()&&s.region==='paris'&&T()<1790],
   ['몸이 아파 수녀원 의무실에서 보리차를 마시며 누워 지냈다.',{hp:-2}],
   ['교리 시간에 졸다가 무릎을 꿇고 벌을 섰다.',{faith:1}]]),
 S('nob_girl',()=>ngirl(8,15)&&SCH().st!=='convent',1.5,0,[
   ['가정교사에게 페늘롱의 『여자아이 교육론』에 따라 셈과 살림을 배웠다.',{edu:2}],
   ['어머니의 아침 화장(투알레트)을 문틈으로 구경하였다. 분첩과 연지와 애교점(무슈)이 놓여 있었다.',{soc:1}],
   ['오빠가 콜레주로 떠나는 날, 자신은 라틴어를 배우지 못한다는 것을 알았다.',{}],
   ['무용 교사가 바이올린을 켜며 미뉴에트 걸음을 고쳐 주었다.',{soc:1,dex:1}],
   ['고래수염을 넣은 어린이용 코르셋을 처음 입었다. 등이 곧아야 한다고 했다.',{hp:-1}],
   ['영지 마을 아이들에게 어머니와 함께 겨울옷을 나누어 주었다.',{faith:1,soc:1}],
   ['하프를 배우기 시작하였다. 왕비가 하프를 즐긴다고 했다.',{music:2},()=>s.year>=1775&&s.year<1792],
   ['아버지의 서재에서 몰래 『텔레마크의 모험』을 꺼내 읽었다.',{edu:2},()=>lit()],
   ['낡은 비단 드레스를 줄여 입었다. 집안 형편이 넉넉하지 않았다.',{},()=>hob()],
   ['오빠와 함께 말을 타고 들판을 달리다 어머니께 꾸중을 들었다.',{cour:1,ride:2,str:1},()=>hob()]]),
 C('nob_saintcyr',()=>ngirl(7,11)&&hob()&&T()<1792&&!s.flags.saintcyr,1.2,99,'생시르','Maison royale de Saint-Louis',
   '가난한 귀족 집안의 딸들을 위해 맹트농 부인이 세운 생시르 왕립 학교에 자리가 났다. 부계 4대, 140년의 귀족 증명이 있어야 하고, 스무 살에 나올 때 왕이 지참금 3천 리브르를 내려 준다.',[
   {l:'증명 서류를 갖추어 보낸다',s:'학식·사교, 지참금',a:'study family',f:()=>{s.flags.saintcyr=true;const x=SCH();x.st='convent';x.y0=s.year;if(!x.grade)x.grade=clamp(40+s.st.edu,10,90);
     say('검은 비단 옷에 신분을 나타내는 색 리본을 달고 생시르의 기숙생이 되었다. 라신의 『에스테르』를 외웠다.'+fx({edu:4,soc:3,faith:3}),'big')}},
   {l:'집에서 기른다',s:'',a:'safe family',f:()=>say('어머니가 딸을 멀리 보낼 수 없다고 하였다.'+fx({hp:1}))}]),
 C('nob_overhear',()=>ngirl(12,16)&&maiden()&&!s.flags.overheard,1.3,99,'엿들은 이야기','la dot',
   ()=>`서재 문틈으로 부모님의 목소리가 들렸다. “${s.sibs>=3?'딸이 셋이면 지참금도 셋이오. 막내는 수녀원에 넣읍시다.':'지참금을 마련하려면 숲을 팔아야겠소.'}” 그대의 이름이 오갔다.`,()=>[
   {l:'끝까지 엿듣는다',s:'혼담의 속사정을 안다',a:'bold',f:()=>{s.flags.overheard=true;say(`지참금 액수와 상대 집안의 빚까지 들었다. 혼인은 집안끼리의 계약이라는 것을 알았다.`+fx({soc:2,cour:1}))}},
   {l:'어머니께 직접 묻는다',s:'',a:'family',f:async()=>{s.flags.overheard=true;const r=await roll(s.st.soc>=40?1:0,{label:'어머니와의 대화'});
     if(r.v>=4)say('어머니는 한숨을 쉬고 그대의 뜻도 듣겠다고 약속하였다.'+fx({soc:2}));else say('“딸은 부모가 정해 준 대로 따르는 것이다.” 한마디로 끝났다.'+fx({cour:1}))}},
   {l:'성모께 기도한다',s:'',a:'pious',f:()=>{s.flags.overheard=true;say('방으로 돌아가 묵주를 돌렸다.'+fx({faith:3}))}}]),
 C('nob_curtsey',()=>ngirl(10,16)&&!s.flags.curtsey,1.3,99,'인사법','la révérence',
   '무용 교사가 손뼉을 친다. 들어가며 한 번, 가운데서 한 번, 상대 앞에서 한 번. 무릎을 굽히는 깊이는 상대의 신분에 따라 다르다.',[
   {l:'하루 종일 연습한다',s:'사교 판정',a:'social study',f:async()=>{s.flags.curtsey=true;const m=md([[s.st.soc>=35,1,'사교'],[s.st.dex>=40,1,'몸놀림'],[s.st.str<15,-1,'다리 힘이 모자람']]);const r=await roll(m.m,{label:'인사법',why:m.why});
     if(r.v>=4)say('치맛자락을 흔들림 없이 펼치며 깊이 몸을 낮추었다. 교사가 궁정에 내보내도 되겠다고 하였다.'+fx({soc:3,dex:1,relite:2}));else say('뒤로 물러나다 치맛자락을 밟고 휘청였다.'+fx({soc:1}))}},
   {l:'창밖의 말을 구경한다',s:'',a:'bold',f:()=>{s.flags.curtsey=true;say('교사가 어머니께 일렀다.'+fx({cour:1}))}}]),
 C('nob_leaveconv',()=>ngirl(14,16)&&SCH().st==='convent'&&maiden(),1.4,99,'수녀원을 나서며','sortie du couvent',
   '아버지의 편지가 왔다. 혼담이 오가니 집으로 돌아오라고 한다. 원장 수녀님은 한 해 더 머물며 공부를 마치라고 권한다.',[
   {l:'곧장 집으로 돌아간다',s:'사교계로',a:'social family',f:()=>{leaveConv();say('수녀원 문을 나서자 어머니가 보낸 재봉사가 새 드레스 치수를 재었다.'+fx({soc:3}))}},
   {l:'한 해 더 머문다',s:'학식·신앙',a:'study pious',f:()=>say('수녀님들 곁에서 한 해를 더 지냈다.'+fx({edu:2,faith:2}))}]),
 C('nob_firstball',()=>nf()&&s.cond==='normal'&&s.age>=15&&s.age<=19&&maiden()&&!s.flags.firstBall,1.6,99,'첫 무도회','premier bal',
   ()=>`처음으로 무도회에 나간다. ${T()<1790?'어머니는 분을 바르고 머리에 분가루를 뿌려 주었다.':T()<1815?'흰 모슬린 드레스에 진주 한 줄을 걸었다.':'허리를 졸라맨 드레스에 꽃 장식을 달았다.'} 누가 춤을 청할지 모두가 지켜본다.`,[
   {l:'밤새 춤춘다',s:'사교 판정',a:'social',f:async()=>{s.flags.firstBall=true;const m=md([[s.st.soc>=40,1,'사교'],[s.st.dex>=45,1,'춤 솜씨'],[s.rep.relite>=60,1,'집안의 평판']]);const r=await roll(m.m,{label:'첫 무도회',why:m.why});
     if(r.v>=5){say(`${nobleMan()}의 아들이 세 번이나 춤을 청하였다. 다음 날 그 집안에서 사람을 보냈다는 소문이 돌았다.`+fx({soc:3,fame:2,relite:4,dex:1}),'big');s.flags.suitor=true}
     else if(r.v>=3)say(T()<1790?'미뉴에트와 콩트르당스를 무사히 추었다.'+fx({soc:3}):T()<1820?'카드리유와 왈츠를 추었다. 왈츠가 점잖지 못하다는 노부인들의 수군거림이 들렸다.'+fx({soc:3}):'카드리유를 추었다.'+fx({soc:3}));
     else say('벽가에 앉아 부채만 부쳤다.'+fx({soc:1,relite:-1}))}},
   {l:'어머니 곁에 얌전히 앉아 있는다',s:'',a:'safe',f:()=>{s.flags.firstBall=true;say('노부인들이 얌전한 아가씨라고 칭찬하였다.'+fx({soc:1,faith:1}))}}]),
 C('nob_present',()=>nf()&&epee()&&free()&&T()<1789.25&&s.age>=16&&s.age<=35&&!s.flags.presented&&(hus()||s.age>=18),3,99,'궁정 알현','présentation à la Cour',
   '베르사유 궁정에 나가려면 왕실 계보관에게 1400년까지 거슬러 올라가는, 관직으로 산 작위가 없는 귀족 증명을 내야 한다. 고래수염 몸판에 넓은 파니에, 몇 자나 끌리는 옷자락(바 드 로브)의 궁정 예복이 필요하다. 이미 알현한 귀부인이 대모가 되어 데려가 준다.',()=>[
   {l:'증명서와 예복을 갖추어 알현한다',s:'비용 3,000. 사교 판정',a:'royal social',dis:s.money<3000&&s.land<300,f:async()=>{s.money=Math.max(0,s.money-3000);
     const sp=nRel('후원자',{n:nLady('공작부인'),sex:'F',v:'vhon',inf:55,close:55,trust:55,w:'알현 대모'});const m=md([[s.flags.curtsey,1,'인사법 연습'],[s.st.soc>=50,1,'사교'],[s.st.dex>=50,1,'옷자락 다루는 몸놀림'],[s.rep.relite>=60,1,'사교계의 평판'],[s.rep.relite<35,-1,'평판이 나쁨']]);const r=await roll(m.m,{label:'세 번의 인사',why:m.why});s.flags.presented=true;meet(s.year<1774?'루이 15세':'루이 16세');
     if(r.v>=4)say('거울의 방을 지나 세 번 무릎을 굽히고 왕비의 치맛자락에 입을 맞추었다. 뒷걸음으로 물러나며 발끝으로 옷자락을 차 넘겼다. 이제 왕의 사냥과 마차에 오를 자격이 생겼다.'+fx({fame:6,soc:3,relite:8,inf:3})+nRF(sp,{close:6,resp:5}),'big');
     else say('뒷걸음치다 옷자락에 걸려 휘청였다. 궁정 사람들의 웃음소리가 들렸지만 알현은 끝났다.'+fx({fame:3,soc:1,relite:-3})+nRF(sp,{resp:-4}),'big')}},
   {l:'궁정은 허영이다. 영지에 머문다',s:'',a:'safe pious',f:()=>{s.flags.presented=false;s.flags.noCourt=true;say('베르사유의 빚더미를 피해 영지에 남았다.'+fx({money:500,soc:-1}))}}]),
 S('nob_court',()=>nfa()&&s.flags.presented&&T()<1789.5,1.4,0,[
   ['왕비의 카드놀이 탁자에 둘러서서 몇 시간을 서 있었다. 공작부인만 접이 의자(타부레)에 앉을 수 있었다.',{soc:1,relite:2,hp:-1}],
   ['왕의 대식탁(그랑 쿠베르)을 구경하러 갔다. 구경꾼들이 왕이 수프를 드는 모습을 지켜보았다.',{soc:1}],
   ['궁정 연지를 짙게 발랐다. 연지 색으로 신분이 드러났다.',{relite:1}],
   ['베르사유 궁의 비좁은 다락 처소에서 겨울을 났다. 장작값이 파리의 두 배였다.',{money:-300,hp:-1}],
   ['트리아농의 왕비 무리와 옛 궁정 노부인들 사이의 반목이 깊어졌다.',{pol:-1},()=>s.year>=1775],
   ['궁정 상복을 입으라는 명령이 내려왔다. 먼 외국 왕족이 세상을 떠났다.',{money:-200}],
   ['왕의 사냥이 끝난 뒤 마차를 타고 돌아오는 행렬에 끼었다.',{fame:1,relite:2}],
   ['목걸이 사건의 재판 소식에 궁정이 술렁였다. 왕비의 이름이 더럽혀졌다.',{pol:2},()=>s.year>=1785&&s.year<=1786]]),

 /* ---------------- 혼담 ---------------- */
 S('nob_market',()=>nfa()&&maiden()&&s.age>=15&&s.age<=25,1.2,0,[
   ['아버지의 공증인이 지참금 문서를 들고 몇 번이나 드나들었다.',{}],
   ['노부인들이 그대의 집안 계보와 치아까지 따지는 이야기를 들었다.',{soc:1}],
   ['혼담 상대의 초상화가 도착하였다. 화가가 얼마나 손을 보았는지 알 수 없었다.',{}],
   ['사촌 언니가 마흔 살 많은 후작에게 시집갔다는 소식을 들었다.',{}],
   ['상대 집안의 빚이 지참금보다 많다는 소문이 들렸다.',{soc:1}],
   ['혼인 전에는 신랑을 두세 번밖에 보지 못한다는 것이 이 신분의 관습이었다.',{},()=>T()<1800]]),
 C('nob_match_epee',()=>nfa()&&epee()&&maiden()&&s.age>=15&&s.age<=24,1.6,3,'혼담','contrat de mariage',
   ()=>{const t=T()<1789.25;return `아버지가 ${t?'공작 집안 장남':'옛 망명 귀족 명문가 아들'}과의 혼인을 정해 왔다. 신랑은 ${ri(19,30)}살, 아직 얼굴도 본 적 없다. 지참금은 ${fmt(ri(10,30)*10000)} 리브르.${t?' 혼인 계약서에는 왕과 왕실 가족이 서명한다.':''}`},()=>[
   {l:'아버지의 뜻을 따른다',s:'명성·사교',a:'family royal',f:()=>{const nm=nobleMan(pick(['공작','후작','백작']));
     wedTo(nm,s.age+ri(2,10),'epee',HPAY.epee,T()<1789.25?`베르사유 왕의 방에서 왕과 왕비, 왕족들이 차례로 혼인 계약서에 서명하였다. 사흘 뒤 성당에서 ${jo(nm,'과','와')} 혼인하였다. 신랑 집에서 보낸 혼례 바구니(코르베유)에는 다이아몬드와 레이스가 가득했다.`:`공증인 앞에서 계약서에 서명하고 시청과 성당에서 ${jo(nm,'과','와')} 혼인하였다.`,{fx:{fame:5,soc:3}})}},
   {l:'한 해만 미뤄 달라고 애원한다',s:'',a:'safe',f:async()=>{const r=await roll(0,{label:'아버지 설득'});if(r.v>=4)say('아버지가 마지못해 한 해를 미뤄 주었다.'+fx({cour:1}));else{say('아버지는 듣지 않았다. 혼례 날짜가 잡혔다.');const nm=nobleMan();wedTo(nm,s.age+ri(3,12),'epee',HPAY.epee,`눈물을 감추고 ${jo(nm,'과','와')} 혼인하였다.`,{fx:{fame:4,hp:-2}})}}},
   {l:'단호히 거절한다',s:'수녀원에 갇힐 수 있다',a:'bold',f:async()=>{if(await chance(T()<1789.25?.5:.15,'아버지의 진노','딸의 거부에 수녀원 감금으로 답하는 아버지가 많았다')){say('아버지가 그대를 수녀원에 기숙생으로 넣고 반성할 때까지 나오지 못하게 하였다.'+fx({faith:3,hp:-2,cour:3}),'big')}else say('아버지는 노했지만 혼담을 물렸다.'+fx({cour:3}))}}]),
 C('nob_match_robe',()=>nfa()&&robe()&&maiden()&&s.age>=15&&s.age<=25,1.6,3,'법관 집안의 혼담','alliance de robe',
   ()=>`${T()<1790.75?'고등법원 판사':'법원장'} 집안의 아들과 혼담이 오간다. 법복 집안끼리 관직과 땅을 묶는 혼인이다. 신랑은 학자풍에 말수가 적다고 한다. 지참금은 ${fmt(ri(4,8)*10000)} 리브르.`,[
   {l:'혼인한다',s:'',a:'family',f:()=>{const nm=`${pick(NOBLE_SURS)[0]} ${T()<1790.75?'판사':'법원장'}`;wedTo(nm,s.age+ri(4,12),'robe',HPAY.robe,`생쉴피스 성당 소성당에서 ${jo(nm,'과','와')} 혼인하였다. 마레 지구의 시댁 저택으로 들어갔다.`,{fx:{soc:3,fame:3}})}},
   {l:'칼을 찬 집안으로 시집가고 싶다고 버틴다',s:'',a:'bold',f:async()=>{const r=await roll(s.st.soc>=50?1:-1,{label:'설득'});if(r.v>=5){const nm=nobleMan('백작');wedTo(nm,s.age+ri(3,9),'epee',HPAY.epee,`어머니 쪽 인맥으로 대검귀족 ${jo(nm,'과','와')} 혼인하였다. 시댁은 법복 집안 며느리를 은근히 깔보았다.`,{fx:{fame:4,soc:1}})}else say('아버지는 “칼은 빚을 낳고 법복은 땅을 낳는다”며 들어주지 않았다.'+fx({cour:1}))}}]),
 C('nob_match_hob',()=>nfa()&&hob()&&maiden()&&s.age>=16&&s.age<=27,1.6,3,'이웃 영주의 아들','mariage de voisinage',
   '이웃 영지의 장남이 청혼하였다. 두 집 땅을 합치면 교구 하나가 된다. 지참금은 1만 리브르 남짓이고, 그것도 몇 해에 걸쳐 나누어 치른다.',[
   {l:'혼인한다',s:'',a:'family safe',f:()=>{const nm=nobleMan(pick(['기사','남작','영주']));wedTo(nm,s.age+ri(1,8),'hobereau',HPAY.hobereau,`마을 성당에서 ${jo(nm,'과','와')} 혼인하였다. 소작인들이 축포를 쏘고 마당에서 춤을 추었다.`,{fx:{soc:2,hp:1}})}},
   {l:'도시로 가 더 나은 혼처를 찾는다',s:'사교 판정',a:'social bold',f:async()=>{const r=await roll(s.st.soc>=45?1:0,{label:'도시 사교계'});if(r.v>=5){const nm=nobleMan('후작');wedTo(nm,s.age+ri(5,15),'epee',HPAY.epee,`외숙모의 주선으로 ${jo(nm,'과','와')} 혼인하였다. 가난한 시골 귀족 딸로서는 큰 혼처였다.`,{fx:{fame:5,soc:3}})}else say('도시의 친척 집에 한 철 머물렀지만 지참금이 적다는 말만 들었다.'+fx({money:-200,soc:1}))}}]),
 C('nob_widower',()=>(nfa()||bl())&&maiden()&&s.age>=16&&s.age<=28,.8,5,'늙은 홀아비','un veuf',
   ()=>`예순을 넘긴 ${noble()?nobleMan('후작'):'은퇴한 징세 청부인'}이 청혼하였다. 첫 부인을 여의고 자식은 이미 장성하였다. 지참금은 필요 없고, 도리어 과부 연금(두에르)을 넉넉히 약속한다.`,[
   {l:'받아들인다',s:'재산, 그러나 행복은 장담 못한다',a:'greedy',f:()=>{const nm=noble()?nobleMan('후작'):person();wedTo(nm,ri(58,68),noble()?s.estate:'bourgeois',noble()?HPAY[s.estate]*1.5:6000,`${jo(nm,'과','와')} 혼인하였다. 사람들은 ‘봄과 겨울의 혼인’이라고 수군거렸다.`,{fx:{money:3000,soc:1,hp:-1}})}},
   {l:'거절한다',s:'',a:'safe',f:()=>say('정중히 거절하였다. 노인은 다른 집 딸에게 청혼하였다.'+fx({cour:1}))}]),
 C('nob_finance',()=>nfa()&&maiden()&&(hob()||epee())&&s.age>=16&&s.age<=27&&(T()<1789||T()>=1800),1,6,'돈 많은 신랑','mésalliance',
   ()=>T()<1789?'집안 빚이 쌓였다. 징세 청부인(페르미에 제네랄)의 아들이 그대를 원한다. 귀족들은 이런 혼인을 “땅에 거름을 준다”고 비웃지만, 지참금 없이 도리어 빚을 갚아 준다고 한다.':'은행가의 아들이 청혼하였다. 쇼세당탱의 저택과 증권 거래소의 돈이 오래된 이름을 원한다.',[
   {l:'혼인한다',s:'재산 대신 체면',a:'greedy family',f:()=>{const nm=person();wedTo(nm,s.age+ri(2,10),'bourgeois',12000,`${jo(nm,'과','와')} 혼인하였다. 친정의 빚이 깨끗이 갚아졌다. 시댁 식구들은 그대의 작위를 손님들에게 자랑하였다.`,{fx:{money:8000,fame:-2,soc:1}});s.flags.mesalliance=true}},
   {l:'가문의 피를 지킨다',s:'',a:'royal',f:()=>say('“우리 집안 피는 팔지 않는다.” 아버지가 웃으며 맞장구쳤으나 빚 문서는 그대로였다.'+fx({fame:1,money:-300}))}]),
 C('nob_love',()=>nfa()&&maiden()&&s.age>=16&&s.age<=24,1,5,'사랑과 혼맹','amour ou alliance',
   ()=>`무도회에서 만난 가난한 ${jo(T()<1792?'둘째 아들 출신 기병 중위':T()<1815?'젊은 장교':'시인','이','가')} 몰래 편지를 보냈다. 같은 시기에 부모님은 부유한 집안과 혼담을 진척시키고 있다.`,[
   {l:'편지를 불태우고 부모를 따른다',s:'',a:'family safe',f:()=>{const nm=nobleMan();wedTo(nm,s.age+ri(5,15),s.estate,HPAY[s.estate],`${jo(nm,'과','와')} 혼인하였다. 불태운 편지의 구절이 오래 떠올랐다.`,{fx:{soc:2,hp:-1}})}},
   {l:'그를 택하겠다고 부모에게 맞선다',s:'의지 판정',a:'bold',f:async()=>{const r=await roll(md([[s.st.cour>=50,1,'의지'],[T()>=1792.75,1,'혁명 후 혼인법'],[hob(),1,'관대한 시골 집안']]).m,{label:'부모와의 담판'});
     if(r.v>=4){const nm=nobleMan('기사');wedTo(nm,s.age+ri(1,5),s.estate,Math.round(HPAY[s.estate]*.3),`마침내 ${jo(nm,'과','와')} 혼인하였다. 지참금은 깎였지만 서로를 고른 혼인이었다.`,{fx:{hp:3,money:-1000,soc:1}});s.flags.loveMatch=true}
     else say('아버지는 그 청년을 집에 들이지 말라고 하였다. 그는 연대를 따라 먼 주둔지로 떠났다.'+fx({hp:-3,cour:2}))}},
   {l:'둘 다 마다하고 기다린다',s:'',a:'safe',f:()=>say('누구에게도 답하지 않았다.'+fx({}))}]),
 C('nob_veil',()=>nfa()&&maiden()&&s.age>=16&&s.age<=30&&(T()<1790||T()>=1802)&&!s.job,.9,6,'수녀원','prendre le voile',
   ()=>`${s.sibs>=2?'지참금은 언니에게 먼저 돌아간다.':'혼인이 마음에 들지 않는다.'} 수녀원에 들어가는 지참금은 혼인 지참금의 몇 분의 일이다. ${T()<1790?'귀족 딸만 받는 참사회 수녀(샤누아네스)가 되면 서원 없이 지내다 나중에 혼인할 수도 있다.':''}`,()=>[
   {l:'베일을 쓴다',s:'수련 수녀',a:'pious',f:()=>{takeJob('r1','수녀원 담장 안으로 들어가 ');say('긴 머리를 자르고 흰 베일을 받았다.'+fx({faith:8}),'big')}},
   ...(T()<1790&&(epee()||robe())?[{l:'귀족 참사회 수녀가 된다',s:'명성, 자유는 남는다',a:'social pious',f:()=>{s.flags.chanoinesse=true;say('여러 대에 걸친 양가 귀족 증명을 내고 귀족 참사회의 참사회 수녀가 되었다. 참사회 십자 훈장을 달고 백작부인(마담 라 콩테스) 칭호를 받았다.'+fx({fame:4,faith:3}),'big')}}]:[]),
   {l:'세속에 남는다',s:'',a:'safe',f:()=>say('수녀원 대신 혼처를 기다리기로 하였다.')}]),
 C('nob_bourg_title',()=>bl()&&maiden()&&s.age>=16&&s.age<=27,1.5,4,'작위 있는 신랑','épouser un titre',
   ()=>`${T()<1789?'빚에 몰린':'몰락한'} ${nobleMan('자작')}이 청혼하였다. 그대 아버지의 돈과 그의 작위를 바꾸자는 혼인이다. 그 집안 노부인들은 벌써부터 ‘장사꾼 딸’이라고 수군거린다.`,[
   {l:'자작부인이 된다',s:'재산 -, 명성 +',a:'social greedy',f:()=>{const nm=nobleMan('자작');wedTo(nm,s.age+ri(3,14),'hobereau',800,`${jo(nm,'과','와')} 혼인하였다. 지참금으로 시댁의 저당 잡힌 성을 되찾았다. 마차 문에 그 집안 문장을 새겼다.`,{fx:{money:-Math.round(s.money*.3),fame:5,soc:2,relite:4}});s.flags.marriedNoble=true}},
   {l:'같은 상인 집안 아들을 고른다',s:'',a:'family safe',f:()=>{const nm=person();wedTo(nm,s.age+ri(1,8),'bourgeois',HPAY.bourgeois,`${jo(nm,'과','와')} 혼인하였다. 공증인이 재산 공동제 계약서를 꼼꼼히 읽어 주었다.`,{fx:{soc:1,money:1000}})}}]),
 C('nob_match_new',()=>nfa()&&maiden()&&s.age>=16&&s.age<=27&&tt(1804.2,1814),1.4,4,'제국의 신랑','noblesse d’Empire',
   ()=>`나폴레옹의 장군 하나가 옛 귀족 집 딸과의 혼인을 바란다. 황제는 새 귀족과 옛 귀족이 섞이기를 원한다. 신랑은 ${pick(['여관집','통장이','방앗간집'])} 아들 출신, 지금은 제국 백작이다. 생제르맹 구역의 친척들은 기겁한다.`,[
   {l:'제국 장군과 혼인한다',s:'명성·재산',a:'social bold',f:()=>{const nm=`${pick(SURS)[0]} 장군`;wedTo(nm,s.age+ri(8,18),'bourgeois',15000,`튈르리 궁 예배당에서 ${jo(nm,'과','와')} 혼인하였다. 황제가 혼인 계약서에 서명하고 결혼 선물로 연금을 내렸다. 옛 친척들은 혼례에 오지 않았다.`,{fx:{fame:5,money:5000,pol:3}});s.flags.empireWed=true}},
   {l:'옛 가문끼리 혼인한다',s:'',a:'royal family',f:()=>{const nm=nobleMan();wedTo(nm,s.age+ri(2,10),s.estate,Math.round(HPAY[s.estate]*.5),`생제르맹 구역 성당에서 ${jo(nm,'과','와')} 조촐하게 혼인하였다. 둘 다 혁명으로 땅의 절반을 잃은 집안이었다.`,{fx:{soc:2,pol:-3}})}}]),
 C('nob_match_charte',()=>(nfa()||bl())&&maiden()&&s.age>=16&&s.age<=28&&T()>=1815,1.4,4,'민법전의 혼인','contrat dotal',
   '공증인이 혼인 계약서를 펼친다. 민법전에 따라 아내는 남편의 허락 없이 재산을 팔 수도 소송을 낼 수도 없다. 다만 지참금을 ‘지참재산제’로 묶어 두면 남편도 함부로 팔지 못한다.',[
   {l:'지참재산제로 묶어 혼인한다',s:'재산을 지킨다',a:'safe family',f:()=>{const nm=noble()?nobleMan():person();wedTo(nm,s.age+ri(2,10),noble()?s.estate:'bourgeois',noble()?HPAY[s.estate]:HPAY.bourgeois,`시청에서 시장 앞에 서고 이튿날 성당에서 ${jo(nm,'과','와')} 혼인하였다. 지참금은 그대의 이름으로 묶였다.`,{fx:{soc:2}});s.flags.dotal=true}},
   {l:'공동재산제로 혼인한다',s:'',a:'family',f:()=>{const nm=noble()?nobleMan():person();wedTo(nm,s.age+ri(2,10),noble()?s.estate:'bourgeois',noble()?HPAY[s.estate]:HPAY.bourgeois,`${jo(nm,'과','와')} 혼인하였다. 살림은 이제 남편의 손에 있다.`,{fx:{soc:2,money:500}})}}]),

 /* ---------------- 결혼 생활 ---------------- */
 S('nob_toilette',()=>wife()&&(epee()||robe()||s.flags.presented)&&T()<1792,1.6,0,[
   ['한낮에 일어나 화장대 앞에서 손님을 맞았다. 수도원장 신부가 가제트 신문을 읽어 주고 기사들이 농담을 건넸다.',{soc:1,relite:2}],
   ['미용사가 두 시간 동안 머리를 높이 쌓고 분가루를 뿌렸다. 손님들은 종이 고깔으로 얼굴을 가렸다.',{soc:1}],
   ['광대뼈에 연지를 동그랗게 바르고 눈가에 애교점(무슈)을 붙였다. 점의 자리마다 뜻이 있었다.',{soc:1}],
   ['화장 시간에 상인들이 레이스와 부채를 펼쳐 보였다.',{money:-150}],
   ['남편과는 각자의 처소에서 지냈다. 저녁 식탁에서만 손님들 앞에서 마주 앉았다.',{}],
   ['밤 두 시까지 카드놀이를 하고 새벽에 마차로 돌아왔다.',{hp:-1,soc:1}],
   ['미용사 레오나르가 왕비의 머리 이야기를 늘어놓았다.',{soc:1},()=>s.year>=1772&&s.year<1789&&s.region==='paris']]),
 S('nob_house',()=>(wife()||bl()&&hus()||nfa()&&widow()),0.9,0,[
   ['집사(메트르 도텔)가 다음 주 만찬 차림표를 올렸다.',{}],
   ['몸종이 주인 부인의 낡은 옷을 받아 헌옷 장수에게 팔았다. 몸종의 오래된 특권이었다.',{}],
   ['하인이 은수저를 훔치다 들켰다. 내쫓을지 경찰에 넘길지 고민하였다.',{}],
   ['제복 입은 하인 열둘을 거느렸다. 마부와 하인의 제복 값만 한 해 수천 리브르였다.',{money:-500},()=>epee()],
   ['요리사를 바꾸었다. 새 요리사는 옛 대공 댁 출신이라 했다.',{money:-100}],
   ['하녀가 임신하여 쫓겨날 처지가 되었다. 몰래 돈을 쥐여 주었다.',{faith:1,money:-50}],
   ['하인들 사이 서열 다툼을 정리하였다. 몸종이 요리사보다 높았다.',{soc:1}],
   ['겨울 장작과 양초를 들여놓았다. 양초 값이 살림의 큰 몫이었다.',{money:-80}]]),
 C('nob_bertin',()=>(wife()||blw())&&tt(1774,1786)&&(urban()||s.flags.presented),1.4,3,'유행의 장관','pouf',
   ()=>`로즈 베르탱이 ${pick(['왕의 천연두 접종을 기념한 ‘접종의 푸프’','군함 ‘라 벨 풀’을 얹은 머리 장식','‘감정의 푸프’(머리 위에 아기와 앵무새 인형)','아메리카 독립을 기린 ‘반란자의 푸프’'])}를 내놓았다. 머리 높이가 석 자나 되어 마차 안에서 무릎을 꿇고 앉아야 한다. 한 개에 수백 리브르다.`,()=>[
   {l:'최신 푸프를 맞춘다',s:'재산 -600, 명성 +',a:'social greedy',dis:s.money<600,f:()=>say('오페라 극장 칸막이석에 앉자 뒷자리 사람들이 무대를 볼 수 없다고 투덜댔다. 다음 날 신문 『유행 소식』에 실렸다.'+fx({money:-600,fame:3,soc:1,relite:3}))},
   {l:'점잖은 모자로 만족한다',s:'',a:'safe',f:()=>say('유행을 쫓다 파산한 귀부인들 이야기를 떠올렸다.'+fx({money:50}))}]),
 C('nob_chemise',()=>(wife()||blw())&&tt(1783.45,1790),1.2,4,'왕비의 슈미즈','chemise à la reine',
   '비제 르브룅이 그린 왕비의 초상이 살롱전에서 내려졌다. 왕비가 속옷 같은 흰 모슬린 슈미즈 차림이었기 때문이다. 리옹 비단 상인들은 왕비가 영국 면직물만 입는다며 원망한다. 그런데도 귀부인들은 너도나도 모슬린을 입는다.',[
   {l:'모슬린 슈미즈를 입는다',s:'사교 +, 몸이 차다',a:'social',f:()=>say('코르셋 없이 허리에 띠만 둘렀다. 숨쉬기가 편했다.'+fx({soc:2,hp:1}))},
   {l:'리옹 비단 드레스를 고집한다',s:'',a:'royal safe',f:()=>say('“프랑스 귀부인은 프랑스 비단을 입는다.”'+fx({money:-200,fame:1}))}]),
 C('nob_merv',()=>(nfa()||bl())&&tt(1795,1815)&&s.age<=45,1.2,8,'흰 모슬린','robe à la grecque',
   ()=>`${T()<1800?'메르베이외즈(멋쟁이 여인)들이 그리스 여신처럼 가슴 아래 띠를 맨 얇은 흰 드레스를 입는다.':'이집트 원정 뒤로 인도 캐시미어 숄이 유행이다. 한 장에 수천 프랑이다.'} 겨울에도 맨팔이다. 의사들은 ‘모슬린 병’(폐렴)을 경고한다.`,[
   {l:'유행을 따른다',s:'사교 +, 건강 판정',a:'social',f:async()=>{const r=await roll(s.st.hp>=55?1:0,{label:'겨울 무도회'});if(r.v<=2)say('얇은 모슬린 차림으로 겨울 무도회에 나갔다가 폐렴을 앓았다.'+fx({hp:-8,soc:2}));else say(T()<1800?'튀니카 차림으로 프라스카티 정원을 거닐었다.'+fx({soc:3}):'캐시미어 숄을 어깨에 두르고 오페라 극장에 나갔다.'+fx({soc:3,money:-800}))}},
   {l:'두꺼운 옷을 입는다',s:'',a:'safe',f:()=>say('젊은 여자들이 그대를 옛날 사람이라 놀렸다.'+fx({hp:1}))}]),
 C('nob_faro',()=>s.age>=18&&(nfa()||bl())&&(s.year<1838)&&s.money>=500,0.8,6,'파로 도박판','pharaon',
   ()=>`${T()<1789.25?'왕비의 탁자에서도 파로를 한다. 경찰이 금해도 귀부인 살롱의 도박판은 밤새 이어진다.':T()<1800?'팔레루아얄 회랑 위층 도박장에 귀부인들이 가면을 쓰고 드나든다.':'살롱의 카드 탁자에 판돈이 쌓였다.'} 오늘 밤 패가 잘 들어온다.`,()=>[
   {l:'판돈을 올린다',s:'운 판정',a:'bold greedy',f:async()=>{const st=Math.round(s.money*.15);const r=await roll(0,{label:'파로'});
     if(r.v>=5)say('카드를 연달아 맞혀 판돈을 쓸어 담았다.'+fx({money:st*2,soc:1}));
     else if(r.v<=2){s.flags.debt=(s.flags.debt||0)+st*2;say(`약속 어음까지 써 가며 ${fmt(st*3)} ${money()}를 잃었다. 남은 빚을 어찌 갚을지 막막하였다.`+fx({money:-st,hp:-2}),'big')}else say('본전치기였다.')}},
   {l:'일찍 자리를 뜬다',s:'',a:'safe',f:()=>say('카드를 내려놓고 마차를 불렀다.')}]),
 C('nob_debt',()=>(nfa()||bl())&&s.flags.debt>0,2,1,'도박 빚','dettes de jeu',
   ()=>`도박 빚 ${fmt(s.flags.debt)} ${money()}를 갚으라는 쪽지가 왔다. 도박 빚은 ‘명예의 빚’이라 갚지 않으면 다시는 그 살롱에 발을 들일 수 없다.`,()=>[
   {l:'다이아몬드를 몰래 전당 잡힌다',s:'',a:'safe',f:()=>{const d=s.flags.debt;s.flags.debt=0;say('귀걸이를 몽드피에테(공영 전당포)에 맡기고 모조품을 대신 달았다.'+fx({money:-Math.min(s.money,Math.round(d*.5)),cour:1}))}},
   {l:'남편에게 털어놓는다',s:'',a:'family',dis:!hus(),f:async()=>{const d=s.flags.debt;s.flags.debt=0;const r=await roll(0,{label:'남편의 반응'});
     if(r.v>=4)say(`${jo(hn(),'은','는')} 웃으며 빚을 갚아 주었다. 자기 빚이 더 많았다.`+fx({soc:1}));else{say(`${jo(hn(),'은','는')} 노하여 그대의 용돈(핀 머니)을 끊었다.`+fx({money:-Math.min(s.money,d),hp:-2}));s.flags.unhappy=true}}},
   {l:'고리대금업자에게 빌린다',s:'',a:'greedy',f:()=>{const d=s.flags.debt;s.flags.debt=0;say('유대인 거리의 대금업자가 아니라 같은 귀족 부인의 집사가 더 비싼 이자를 불렀다. 빚이 빚을 낳았다.'+fx({money:-Math.min(s.money,Math.round(d*1.3)),soc:-1}))}}]),
 C('nob_accounts',()=>(wife()||bl()&&hus()||nfa()&&widow())&&lit(),1.2,4,'살림 장부','livre de comptes',
   '영지 관리인(레지쇠르)이 올린 장부의 숫자가 이상하다. 밀 값은 올랐는데 지대 수입은 줄었다.',[
   {l:'장부를 밤새 맞추어 본다',s:'학식 판정',a:'study greedy',f:async()=>{const m=md([[s.st.edu>=50,1,'학식'],[s.sk.trade>=30,1,'셈이 밝음'],[s.sk.pen>=40,1,'문서 다루는 솜씨']]);const r=await roll(m.m,{label:'장부 검토',why:m.why});
     if(r.v>=4)say('관리인이 수년간 빼돌린 돈을 찾아냈다. 그를 내보내고 새 관리인을 들였다.'+fx({money:Math.round(400+s.land*.3),edu:1,trade:3}),'big');else say('숫자는 맞지 않았지만 어디서 샜는지 끝내 찾지 못했다.'+fx({edu:1,trade:1}))}},
   {l:'남자들의 일이니 맡겨 둔다',s:'',a:'safe',f:()=>say('장부를 덮었다.'+fx({money:-200}))}]),
 C('nob_lover',()=>(wife()||blw())&&s.age>=20&&s.age<=42&&!s.flags.lover,1,6,'단골 손님','l’ami de la maison',
   ()=>`${jo(s.flags.nobLv=pick(['젊은 기병 장교','시를 쓰는 기사','외교관','이웃 영지의 백작']),'이','가')} 화장 시간마다 찾아와 부채를 들어 주고 오페라 칸막이석까지 따라온다. ${T()<1789?'사교계에서는 남편이 아닌 남자가 아내를 모시는 것을 흉으로 여기지 않는다. 남편들도 저마다 정부가 있다.':'세상은 예전보다 엄격해졌다.'}`,()=>[
   {l:'애인으로 받아들인다',s:'사교 +, 위험',a:'bold social',f:async()=>{s.flags.lover=true;const lv=nRel('연인',{n:person(),sex:'M',w:s.flags.nobLv,v:'vlib',close:60,trust:50});say(`${lv?jo(lv.n,'을','를'):'그를'} 받아들였다. 몸종만이 비밀을 알았다.`+fx({hp:2,soc:2,faith:-3,vhon:-2})+nRF(lv,{close:10,trust:6}));
     if(await chance(T()<1789?.25:.4,'남편이 알아챔','편지가 들키는 일이 잦았다')){say(`${jo(hn(),'이','가')} 몸종이 숨겨 둔 편지를 찾아냈다.`+fx({hp:-3,relite:-4}),'big');s.flags.unhappy=true;s.flags.caught=true}}},
   {l:'정숙한 우정으로만 둔다',s:'',a:'safe pious',f:()=>say('그는 몇 해 동안 충실한 벗으로 남았다.'+fx({soc:2,vhon:1})+nRF(nRel('친구',{n:person(),sex:'M',w:s.flags.nobLv,v:'vhon'}),{resp:8,close:5}))},
   {l:'발길을 끊게 한다',s:'',a:'pious',f:()=>say('문지기에게 그가 오면 부인은 안 계신다고 하라 일렀다.'+fx({faith:2}))}]),
 C('nob_cachet',()=>wife()&&s.flags.caught&&T()<1789.25,2,99,'봉인장','lettre de cachet',
   ()=>`${jo(hn(),'이','가')} 대신을 통해 왕의 봉인장을 청원하겠다고 한다. 부정한 아내를 수녀원에 가두는 데 흔히 쓰는 방법이다.`,[
   {l:'무릎 꿇고 용서를 빈다',s:'',a:'safe family',f:async()=>{s.flags.caught=false;const r=await roll(s.st.soc>=50?1:0,{label:'용서'});if(r.v>=3)say('남편은 청원을 거두었다. 대신 애인은 연대로 떠났다.'+fx({hp:-2}));else{say('봉인장이 내려졌다. 생토르 수녀원에서 두 해 동안 갇혀 지냈다.'+fx({faith:4,hp:-5,soc:-4,fame:-3}),'big')}}},
   {l:'친정을 움직여 맞선다',s:'의지·명성 판정',a:'bold',f:async()=>{s.flags.caught=false;const r=await roll(md([[s.fame>=30,1,'친정의 위세'],[s.st.cour>=50,1,'의지']]).m,{label:'친정의 힘'});
     if(r.v>=4)say('친정아버지가 대신을 찾아가 일을 덮었다. 남편과 따로 살게 되었다.'+fx({cour:2,soc:1}));else say('스캔들이 사교계에 퍼졌다. 수녀원에 한 해 갇혔다가 나왔다.'+fx({fame:-5,hp:-3}))}}]),
 C('nob_mistress',()=>wife()&&s.age>=20&&!s.flags.husMistress,1,8,'남편의 정부','la maîtresse',
   ()=>`${jo(hn(),'이','가')} ${s.flags.nobMs=pick(['오페라 극장의 무용수','코메디이탈리엔 여배우','친구의 아내'])}에게 작은 집(프티트 메종)을 마련해 주었다는 소문이 들려왔다.`,[
   {l:'관습이니 모른 척한다',s:'',a:'safe',f:()=>{s.flags.husMistress=true;say('웃는 얼굴로 저녁 손님을 맞았다. 이 신분에서 질투는 촌스러운 일이었다.'+fx({soc:1,relite:3,hp:-1,vhon:-1})+nRF(nRel('경쟁자',{n:woman(),sex:'F',w:s.flags.nobMs,v:'vlib',riv:55}),{riv:4}))}},
   {l:'남편에게 따진다',s:'',a:'bold',f:async()=>{s.flags.husMistress=true;const r=await roll(0,{label:'담판'});if(r.v>=4)say('남편은 그 여자와의 관계를 정리하겠다고 약속하였다.'+fx({cour:2,vhon:2}));else{say('남편은 “사교계의 웃음거리가 되고 싶소?” 하고 문을 닫았다.'+fx({hp:-2,relite:-2})+nRF(nRel('경쟁자',{n:woman(),sex:'F',w:s.flags.nobMs,v:'vlib',riv:60}),{riv:8}));s.flags.unhappy=true}}},
   {l:'고해 신부에게 털어놓는다',s:'',a:'pious',f:()=>{s.flags.husMistress=true;say('신부는 인내와 기도를 권하였다.'+fx({faith:3}))}}]),
 C('nob_sepbiens',()=>(wife()||blw())&&!s.flags.sepBiens&&(s.flags.unhappy||s.flags.debt||s.flags.husMistress),.9,99,'재산 분리 소송','séparation de biens',
   ()=>`${hn()}의 빚이 그대 지참금까지 삼키려 한다. 채권자들이 영지에 압류장을 붙였다. 아내는 ${T()<1791?'샤틀레 법원':'민사 법원'}에 지참금을 남편 재산에서 떼어 달라는 소송을 낼 수 있다.`,[
   {l:'소송을 낸다',s:'학식·사교 판정',a:'bold greedy',f:async()=>{s.flags.sepBiens=true;const r=await roll(md([[s.st.edu>=50,1,'학식'],[s.fame>=25,1,'친정의 이름']]).m,{label:'재산 분리 소송'});
     if(r.v>=4)say('판결이 났다. 지참금과 그대 몫의 땅은 그대가 관리한다. 남편의 채권자들은 손을 대지 못한다.'+fx({money:Math.round(3000+s.money*.1),cour:2}),'big');
     else say('소송은 질질 끌렸고 변호사 비용만 나갔다.'+fx({money:-500}))}},
   {l:'집안 망신이니 참는다',s:'',a:'safe family',f:()=>say('채권자들이 은식기와 그림을 실어 갔다.'+fx({money:-Math.round(s.money*.2),hp:-2}))}]),
 S('nob_preg',()=>(wife()||blw())&&s.age<=44,1,0,[
   ['임신하자 의사가 사혈을 권하였다. 당시엔 임신부도 피를 뽑았다.',{hp:-2}],
   ['산부인과 의사(아쿠쇠르)를 불렀다. 귀부인들은 산파보다 남자 의사를 찾기 시작하였다.',{money:-200},()=>s.year>=1760],
   ['배가 불러오자 무도회를 멀리하고 소파에서 지냈다.',{soc:-1}],
   ['아들을 바라는 시어머니가 성 마르그리트의 허리띠를 보내왔다.',{faith:1}],
   ['출산 뒤 사십 일을 누워 지내고 축복 예식(산후 정결례)을 받았다.',{faith:2}],
   ['상속자를 낳아야 한다는 말을 혼례 날부터 들었다.',{},()=>epee()]]),
 C('nob_nurse',()=>(wife()||blw())&&baby()&&!s.flags['nurse'+s.year],2.5,1,'유모냐 젖이냐','nourrice ou allaitement',
   ()=>`갓난아기를 두고 결정해야 한다. 귀부인들은 아기를 시골 유모에게 보낸다. ${s.year>=1762?'그런데 루소의 『에밀』 이후 어머니가 직접 젖을 먹이는 것이 덕이라는 말이 퍼졌다.':'어머니가 직접 젖을 물리는 것은 아낙네들이나 하는 일이라 여겨진다.'}`,()=>[
   {l:'시골 유모에게 보낸다',s:'아기 건강 위험',a:'safe social',f:async()=>{s.flags['nurse'+s.year]=1;s.flags.wetnurse=true;say(`${pick(['보베','노르망디','모르방'])} 시골 유모의 집으로 아기를 보냈다. 유모 사무소에 석 달 치 삯을 미리 냈다.`+fx({money:-120,soc:1}));
     const k=s.kids.filter(k=>k.alive&&s.year-k.y<=1).pop();if(k&&await chance(.12,'유모 집의 아기','시골 유모에게 맡긴 아기의 사망률이 높았다')){k.alive=false;say(`유모 집에서 ${jo(k.n,'이','가')} 열병으로 죽었다는 편지가 왔다.`+fx({hp:-5}),'dark')}}},
   {l:'유모를 집에 들인다',s:'재산 -400',a:'family',f:()=>{s.flags['nurse'+s.year]=1;say('건강한 시골 아낙을 골라 집에 들였다. 유모의 젖이 마르지 않게 고기와 포도주를 먹였다.'+fx({money:-400}))}},
   {l:'직접 젖을 먹인다',s:s.year>=1762?'루소식 어머니':'관습을 거스른다',a:'family bold',f:()=>{s.flags['nurse'+s.year]=1;s.flags.nursed=true;say(s.year>=1762?'아기를 직접 품에 안았다. 남편은 한동안 그대 침실을 찾지 않았지만, 친구들은 『에밀』의 어머니라고 칭찬하였다.'+fx({hp:-1,soc:1,pol:1}):'직접 젖을 물렸다. 시어머니가 혀를 찼다.'+fx({hp:-1,soc:-1}))}}]),
 C('nob_inoc',()=>(nfa()||bl())&&s.year>=1756&&kidsAt(1,10).length&&!s.flags['inocK'+s.kids.length],1.2,99,'아이들의 접종','inoculation',
   ()=>s.year<1800?`${s.year>=1774?'왕과 왕제들이 천연두 접종을 받았다.':'제네바 의사 트롱섕이 오를레앙 공의 아이들에게 천연두 고름을 접종하였다.'} 접종하면 가볍게 앓고 평생 걸리지 않지만, 접종 뒤 죽는 아이도 있다.`:'영국 의사 제너의 우두(백신) 접종이 들어왔다. 소의 고름이라 천연두보다 훨씬 안전하다고 한다.',[
   {l:'접종시킨다',s:'',a:'study family',f:async()=>{s.flags['inocK'+s.kids.length]=1;const ks=kidsAt(1,10);
     if(s.year<1800&&await chance(.02*ks.length,'접종 사고','인두 접종 사망률은 약 2%')){const k=pick(ks);k.alive=false;say(`접종 뒤 ${jo(k.n,'이','가')} 고열을 이기지 못하고 죽었다.`+fx({hp:-6}),'dark')}
     else say(`의사가 ${ks.map(k=>k.n).join(', ')}의 팔에 작은 상처를 내고 ${s.year<1800?'천연두':'우두'} 고름을 묻혔다. 며칠 앓더니 일어났다.`+fx({edu:1}));ks.forEach(k=>k.inoc=true)}},
   {l:'하늘에 맡긴다',s:'',a:'pious safe',f:()=>{s.flags['inocK'+s.kids.length]=1;say('“신이 정하신 병을 사람이 앞질러서는 안 된다.”'+fx({faith:2}))}}]),
 S('nob_kids',()=>(nfa()||bl())&&kidsAt(3,18).length>0,1,0,[
   ['아들을 콜레주에 보내고 딸은 수녀원 기숙학교에 맡겼다.',{},()=>T()<1792],
   ['아이들의 가정교사를 새로 들였다. 라틴어는 아들에게만 가르쳤다.',{money:-200}],
   ['딸에게 자수와 클라브생을 가르쳤다.',{soc:1}],
   ['아들의 장교 임관에 필요한 4대 귀족 증명서를 계보관에게 맡겼다.',{money:-150},()=>s.year>=1781&&s.year<1789&&noble()],
   ['아이들을 데리고 튈르리 정원을 산책하였다.',{hp:1},()=>s.region==='paris'||urban()],
   ['아들을 리세에 보냈다. 북소리에 맞추어 일어나고 군복을 입는다고 한다.',{},()=>T()>=1803],
   ['딸을 에쿠앙의 레지옹 도뇌르 여학교에 넣었다. 캉팡 부인이 교장이다.',{edu:1},()=>tt(1807,1814.2)],
   ['딸을 사크레쾨르 수녀회 기숙학교에 보냈다.',{faith:2},()=>T()>=1820]]),
 C('nob_regiment',()=>wife()&&(epee()||hob())&&(T()<1789||atWar()),1.3,3,'남편 없는 영지','l’absence du mari',
   ()=>`${jo(hn(),'은','는')} ${T()<1789?'연대를 따라 주둔지로':'전선으로'} 떠나 한 해의 대부분을 비운다. 영지 일은 그대 몫이다. 올해는 ${pick(['우박이 내려 소작인들이 지대를 깎아 달라 한다','이웃 영주와 숲 경계를 두고 송사가 붙었다','본당 신부와 십일조 몫을 두고 다툼이 생겼다','방앗간이 무너져 새로 지어야 한다'])}.`,()=>[
   {l:'직접 소작인들을 만나 정리한다',s:'사교 판정',a:'work bold',f:async()=>{const m=md([[s.st.soc>=45,1,'사교'],[s.sk.trade>=30,1,'셈이 밝음'],[s.sk.ride>=25,1,'말을 타고 농가를 돎'],[s.rep.rloc>=60,1,'소작인들의 신망'],[s.rep.rloc<35,-1,'원한을 산 영주 집안']]);const r=await roll(m.m,{label:'영지 경영',why:m.why});
     if(r.v>=4)say('말을 타고 농가를 돌며 담판을 지었다. 소작인들이 ‘부인 마님’의 셈이 남편보다 밝다고 하였다.'+fx({money:Math.round(200+s.land*.2),trade:2,ride:1,rloc:4,cour:1}));else say('일이 꼬여 공증인과 변호사만 바빠졌다.'+fx({money:-200}))}},
   {l:'관리인에게 맡기고 편지만 쓴다',s:'',a:'safe',f:()=>say(`${hn()}에게 길고 자세한 편지를 썼다. 답장은 석 달 뒤에 왔다.`+fx({edu:1}))}]),
 C('nob_charity',()=>(nfa()||bl()),1,6,'교구의 가난한 이들','les pauvres de la paroisse',
   ()=>`${price(s.year)>=1.3?'흉년이라 빵값이 올랐다. ':''}본당 신부가 찾아와 교구의 병자와 가난한 가족 명단을 내민다. ${T()>=1784?'자선 모성회에서도 가난한 산모를 돌볼 부인들을 찾는다.':''}`,()=>[
   {l:'직접 가난한 집을 찾아다닌다',s:'재산 -200, 신앙·명성',a:'pious',f:()=>{say('수프 냄비와 아마포를 들고 다락방을 찾아다녔다. 병자의 손을 잡아 주었다.'+fx({money:-200,faith:4,fame:2,[rev()?'rpeople':'rloc']:4}));if(R()<.4)s.seeds.push({t:'saved',n:woman(),y:s.year})}},
   {l:'돈만 보낸다',s:'재산 -100',a:'safe',f:()=>say('지갑을 열어 신부에게 건넸다.'+fx({money:-100,faith:1}))},
   {l:'거절한다',s:'',a:'greedy',f:()=>say('올해는 형편이 어렵다고 하였다.'+fx({faith:-1,[rev()?'rpeople':'rloc']:-3}))}]),
 C('nob_salon',()=>(nfa()||bl())&&lit()&&!s.flags.salon&&s.age>=25&&(hus()||widow())&&(urban()||s.region==='ile'),1.6,10,'살롱을 연다','tenir salon',
   ()=>`일주일에 하루 저녁을 정해 문인과 학자를 부르면 살롱이 된다. ${T()<1789?'요리 솜씨보다 대화를 이끄는 솜씨가 중요하다.':T()<1800?'요즘 살롱은 정치를 논한다.':'제국의 경찰이 살롱 손님 명단을 궁금해한다.'}`,()=>[
   {l:'화요일 저녁마다 손님을 맞는다',s:'재산 -800, 사교 판정',a:'social study',dis:s.money<800,f:async()=>{s.money-=800;const m=md([[s.st.soc>=50,1,'사교'],[s.sk.orat>=30,1,'대화를 이끄는 솜씨'],[s.st.edu>=55,1,'학식'],[s.fame>=30||s.rep.relite>=65,1,'이름과 평판']]);const r=await roll(m.m,{label:'살롱',why:m.why});
     if(r.v>=4){s.flags.salon=true;say('철학자와 시인과 외교관이 그대의 난롯가에 모였다. 그대는 말을 아끼고 남의 재치를 끌어냈다.'+fx({fame:5,soc:3,edu:2,orat:2,relite:4,inf:6}),'big');if(!s.job&&meets(POST.w2))takeJob('w2','이름난 ')}
     else say('손님이 반쯤 비었다. 경쟁하는 살롱으로 문인들이 몰려갔다.'+fx({soc:1,orat:1})+nRF(nRel('경쟁자',{n:noble()?nLady('후작부인'):woman()+' 부인',sex:'F',v:'vhon',inf:35,w:'살롱 맞수'}),{riv:8}))}},
   {l:'남의 살롱에나 다닌다',s:'',a:'safe',f:()=>say('남의 살롱에서 귀를 기울였다.'+fx({edu:1}))}]),
 S('nob_salonlife',()=>(nfa()||bl())&&s.flags.salon,1.5,0,[
   ['살롱에서 새로 나온 비극의 한 막을 작가가 직접 낭독하였다.',{edu:2,fame:1}],
   ['아카데미 프랑세즈 선거를 두고 손님들이 표를 셈하였다. 살롱의 표가 당락을 갈랐다.',{fame:1,inf:3},()=>T()<1793||T()>=1803],
   ['외국 대사가 처음으로 그대 살롱에 들렀다.',{fame:2,relite:2,inf:2}],
   ['손님 둘이 볼테르와 루소를 두고 언성을 높였다. 화제를 날씨로 돌렸다.',{soc:2},()=>T()<1790],
   ['살롱에서 지롱드파 의원들이 저녁을 들었다.',{pol:4,sus:3,inf:3,orat:1},()=>tt(1791,1793.5)],
   ['경찰 장관 푸셰의 첩자가 손님 사이에 섞여 있다는 귀띔을 받았다.',{sus:2},()=>tt(1800,1815)],
   ['낭만파 젊은 시인이 시를 읊었다. 노신사들이 하품을 하였다.',{edu:1},()=>T()>=1820]]),
 C('nob_geoffrin',()=>(nfa()||bl())&&s.region==='paris'&&tt(1750,1777)&&lit()&&!s.done.nob_geoffrin_m,1.5,99,'조프랭 부인의 수요일','rue Saint-Honoré',
   '생토노레 거리 조프랭 부인 댁에서 월요일엔 화가들이, 수요일엔 문인들이 점심을 든다. 부인은 거울 유리 공장 상인의 미망인이지만 대귀족과 외국 왕자까지 그 식탁에 앉으려 한다. 초대장을 받았다.',[
   {l:'수요일 모임에 간다',s:'학식·사교',a:'social study',f:()=>{s.done.nob_geoffrin_m=1;meet('조프랭 부인');meet('달랑베르');say('달랑베르와 마르몽텔이 재치를 다투었다. 부인은 이야기가 위험해지면 “자, 그쯤 해 두시죠” 하고 끊었다.'+fx({edu:3,soc:2,orat:1,relite:2}))}},
   {l:'뒤 데팡 부인 쪽에 간다',s:'',a:'social',f:()=>{s.done.nob_geoffrin_m=1;meet('뒤 데팡 부인');say('생조제프 수녀원의 눈먼 후작부인 뒤 데팡의 노란 비단 살롱에 갔다. 날카로운 혀가 조프랭 부인을 비꼬았다.'+fx({soc:3,edu:1}))}}]),
 C('nob_necker',()=>(nfa()||bl())&&s.region==='paris'&&tt(1765,1790)&&lit()&&!s.done.nob_necker_m,1.3,99,'금요일 살롱','le vendredi de Mme Necker',
   '제네바 목사의 딸 네케르 부인이 금요일마다 살롱을 연다. 손님들은 디드로와 뷔퐁, 마르몽텔이다. 어린 딸 제르멘이 작은 의자에 앉아 어른들의 대화를 듣는다.',[
   {l:'금요일 모임에 나간다',s:'',a:'social study',f:()=>{s.done.nob_necker_m=1;meet('네케르 부인');say('부인이 미리 공책에 적어 둔 화제를 차례로 꺼냈다. 꼬마 제르멘이 어른처럼 대답해 모두를 놀라게 했다.'+fx({edu:2,soc:2,pol:1}))}},
   {l:'오퇴유의 엘베시우스 부인 댁에 간다',s:'',a:'social radical',f:()=>{s.done.nob_necker_m=1;meet('엘베시우스 부인');say('오퇴유 정원에서 고양이와 개에 둘러싸인 엘베시우스 부인이 손님을 맞았다.'+(s.year>=1777&&s.year<1785?' 털모자를 쓴 미국 사절 프랭클린이 부인에게 청혼했다는 농담이 돌았다.':'')+fx({edu:2,pol:3}))}}]),
 C('nob_polsalon',()=>(nfa()||bl())&&s.region==='paris'&&tt(1786,1792.6)&&lit()&&!s.done.nob_polsalon_m,1.6,99,'정치 살롱','salon politique',
   ()=>`${T()<1789?'바크 거리의 스웨덴 대사관에서 네케르의 딸 스탈 부인이 살롱을 연다.':'조폐국 관사의 콩도르세 부인과 바크 거리의 스탈 부인 살롱에서 헌법을 논한다.'} 여자들의 살롱에서 의원들의 연설이 미리 다듬어진다.`,[
   {l:'스탈 부인 살롱에 간다',s:'입헌파',a:'social radical',f:()=>{s.done.nob_polsalon_m=1;meet('스탈 부인');say('스탈 부인은 손에 나뭇가지를 만지작거리며 쉬지 않고 말하였다. 라파예트와 탈레랑이 그 곁에 있었다.'+fx({pol:5,edu:2,soc:1,orat:1,brg:3}));nFac(['patriote','monarchien','feuillant'],4)}},
   {l:'콩도르세 부인 살롱에 간다',s:'공화파',a:'radical study',f:()=>{s.done.nob_polsalon_m=1;meet('소피 드 콩도르세');say('소피 드 콩도르세가 애덤 스미스를 번역하는 이야기를 하였다. 노예제 폐지와 여성의 시민권까지 거론되었다.'+fx({pol:8,edu:3,brg:5,bor:4}));nFac(['girondin','patriote'],5)}},
   {l:'정치는 남자들의 일이다',s:'',a:'royal safe',f:()=>{s.done.nob_polsalon_m=1;say('살롱에 가지 않고 성당에 나갔다.'+fx({pol:-2,faith:1}))}}]),
 C('nob_patron',()=>s.age>=18&&(nfa()||bl())&&s.money>=3000&&(urban()||s.flags.presented),1,10,'초상화','portrait',
   ()=>`${T()<1790?'비제 르브룅 부인':T()<1815?'제라르 남작':T()<1835?'앵그르':'빈터할터'}에게 초상화를 맡길 수 있다. 화가는 몇 달 동안 아침마다 그대를 앉혀 둘 것이다. 젊은 무명 화가를 후원하는 길도 있다.`,()=>[
   {l:'이름난 화가에게 맡긴다',s:'재산 -2,500, 명성 +',a:'social greedy',f:()=>say('살롱전에 그대의 초상이 걸렸다. 사람들이 그림 앞에서 이름을 수군거렸다.'+fx({money:-2500,fame:5}))},
   {l:'무명 화가를 후원한다',s:'재산 -600',a:'study',f:()=>{say('가난한 젊은 화가에게 화실 세를 대주었다.'+fx({money:-600,fame:1}));s.seeds.push({t:'student',n:person(),y:s.year})}},
   {l:'그만둔다',s:'',a:'safe',f:()=>say('거울 속 얼굴로 충분하였다.')}]),
 S('nob_letters',()=>(nfa()||bl())&&lit(),0.9,0,[
   ['세비녜 부인의 편지를 본떠 시골의 친구에게 긴 편지를 썼다.',{edu:1,pen:2}],
   ['편지는 모두 우편국에서 뜯어 읽는다는 소문(검은 방)이 돌아 중요한 이야기는 암호로 썼다.',{},()=>T()<1790||tt(1800,1815)],
   ['밤마다 일기를 썼다.',{edu:1,pen:1}],
   ['고해 신부에게 영적 지도 편지를 받았다.',{faith:2}],
   ['『신엘로이즈』의 쥘리처럼 정원의 숲길을 거닐며 울었다.',{edu:1},()=>s.year>=1761&&s.year<1800],
   ['라클로의 『위험한 관계』를 몰래 읽었다. 메르퇴유 후작부인이 누구를 본뜬 것이냐는 추측이 오갔다.',{edu:2},()=>s.year>=1782&&s.year<1795],
   ['『폴과 비르지니』를 읽으며 섬의 바닷가를 꿈꾸었다.',{edu:1},()=>s.year>=1788],
   ['스탈 부인의 『코린』을 단숨에 읽었다.',{edu:2,pol:1},()=>s.year>=1807],
   ['샤토브리앙의 『아탈라』를 읽고 눈물을 흘렸다.',{edu:1,faith:1},()=>s.year>=1801],
   ['조르주 상드의 『앵디아나』를 읽었다. 부인들이 남장 소설가를 두고 수군거렸다.',{edu:1,pol:1},()=>s.year>=1832]]),
 C('nob_novel',()=>(nfa()||bl())&&lit()&&s.year>=1761&&s.age<=45&&!s.flags.heloise,1.2,99,'신엘로이즈','La Nouvelle Héloïse',
   '루소의 『쥘리, 또는 신엘로이즈』가 나왔다. 대본소에서는 한 권을 한 시간 단위로 빌려준다. 귀부인들이 무도회에 가려다 마차를 돌리고 밤새 읽었다는 이야기가 돈다.',[
   {l:'밤새 읽는다',s:'학식 +, 정념',a:'study',f:()=>{s.flags.heloise=true;meet('루소(책으로)');say('새벽 네 시에 마지막 장을 덮었다. 쥘리의 죽음에 숨이 막힐 만큼 울었다. 루소에게 편지를 쓰고 싶어졌다.'+fx({edu:3,hp:-1,pol:2}),'big')}},
   {l:'고해 신부가 금한 책이다',s:'',a:'pious',f:()=>{s.flags.heloise=true;say('책을 덮고 『준주성범』을 읽었다.'+fx({faith:3}))}}]),
 S('nob_seasons',()=>(wife()||nfa()&&widow())&&(epee()||robe())&&(T()<1789.5||T()>=1800),1.3,0,[
   ['부활절 무렵 시골 성(샤토)으로 내려갔다. 마차에 짐이 아홉 수레였다.',{hp:2}],
   ['여름 성에서 이웃 귀족들과 사냥과 연극 놀이를 하였다. 하인들이 관객이었다.',{soc:2}],
   ['영지 교회의 영주 전용석에 앉아 미사를 들었다. 신부가 영주 가족에게 먼저 성수를 뿌렸다.',{faith:1},()=>T()<1789.5],
   ['만성절이 지나 파리의 저택(오텔)으로 돌아왔다. 사교 철이 시작되었다.',{soc:2}],
   ['생제르맹 구역 저택의 정원을 영국식으로 고쳤다.',{money:-800}],
   ['성의 정원에 소박한 초가 마을(아모)을 지었다. 왕비의 트리아농을 본뜬 것이다.',{money:-1200,soc:1},()=>s.year>=1783&&s.year<1790],
   ['플롱비에르 온천으로 물 치료를 떠났다.',{hp:3,money:-300}]]),
 C('nob_theatre',()=>s.age>=18&&(nfa()||bl())&&urban()&&(T()<1792.5||T()>=1795),1.2,5,'칸막이석','la loge',
   ()=>`${T()<1790?'코메디프랑세즈':T()<1830?'오페라 극장':'이탈리앵 극장'}의 칸막이석 한 철 사용권이 나왔다. 칸막이석은 연극을 보는 곳이기보다 남에게 보이는 곳이다.`,()=>[
   {l:'한 철 사용권을 산다',s:'재산 -1,200',a:'social',dis:s.money<1200,f:()=>say(`${s.year>=1784&&s.year<1790?'『피가로의 결혼』 첫 공연 날, 귀족들이 자기들을 비웃는 대사에 손뼉을 쳤다.':T()<1830?'칸막이석에서 손님을 맞고 막간마다 방문을 다녔다.':'로시니 오페라를 보며 쌍안경으로 맞은편 칸막이석을 살폈다.'}`+fx({money:-1200,soc:2,fame:1,relite:2}))},
   {l:'오페라 가면무도회에 간다',s:'가면 아래 모험',a:'bold',f:async()=>{say('검은 도미노 망토와 가면을 쓰고 오페라 극장 무도회에 갔다. 가면 아래서는 공작부인과 여배우가 구별되지 않았다.');
     const r=await roll(0,{label:'가면무도회'});if(r.v>=5)say('가면 쓴 남자가 그대 이름을 알아맞히고 사라졌다. 며칠 뒤 꽃다발이 왔다.'+fx({soc:2,hp:1}));else if(r.v<=1)say('남편도 가면을 쓰고 그곳에 있었다. 서로 모른 척하였다.'+fx({soc:1}));else say('새벽까지 춤추었다.'+fx({soc:2,hp:-1}))}},
   {l:'집에 머문다',s:'',a:'safe',f:()=>say('난롯가에서 수를 놓았다.')}]),
 S('nob_robe',()=>nfa()&&robe()&&(hus()||widow())&&T()<1790.75,1.2,0,[
   ['남편이 법복을 입고 고등법원 대법정에 나갔다. 왕의 칙령 등록을 거부할지 밤늦게까지 논의하였다.',{pol:2}],
   ['법관 집안 부인들끼리 마레 지구에서 조촐한 저녁 모임을 열었다. 대검 귀족의 사치를 흉보았다.',{soc:1}],
   ['모푸 대법관의 사법 개혁으로 고등법원이 해산되어 남편이 지방으로 유배되었다.',{pol:-3,money:-500},()=>s.year>=1771&&s.year<=1774],
   ['고등법원이 복권되어 남편이 의기양양하게 파리로 돌아왔다.',{fame:2},()=>s.year>=1774&&s.year<=1775],
   ['얀센파 신부가 집안 고해 신부가 되었다. 엄격한 신앙이 집안의 자랑이었다.',{faith:3}],
   ['남편의 관직값이 떨어졌다는 소식에 집안이 술렁였다.',{money:-300},()=>s.year>=1787]]),
 S('nob_hob',()=>nfa()&&hob()&&!urban()&&(hus()||widow())&&T()<1789.5,1.3,0,[
   ['닭과 버터를 직접 장부에 적었다. 시골 귀족 집 부인은 농가 안주인과 다를 바 없었다.',{edu:1}],
   ['낡은 성의 지붕이 새어 대야를 받쳐 놓았다.',{money:-100,hp:-1}],
   ['영주 법정의 판결 장부를 정리하였다.',{}],
   ['마을 산파가 오지 않아 소작인 아낙의 해산을 도왔다.',{faith:2,fame:1}],
   ['주교구 도시의 사교 모임에 일 년에 한 번 나갔다.',{soc:2}],
   ['파리에서 온 유행 잡지를 아껴 가며 읽었다. 이미 두 해 지난 유행이었다.',{}]]),
 S('nob_faith',()=>(nfa()||bl())&&s.age>=30,1,0,[
   ['사순절에 수녀원에서 피정을 하였다.',{faith:3}],
   ['고해 신부를 예수회 신부에서 얀센파 신부로 바꾸었다가 남편과 다투었다.',{faith:2},()=>s.year<1764],
   ['성체 축일 행렬에 자수 놓은 천을 창밖에 내걸었다.',{faith:1},()=>T()<1791||T()>=1802],
   ['선서 거부 사제의 비밀 미사에 다녀왔다.',{faith:4,sus:3},()=>tt(1791,1801.5)],
   ['아침마다 기도대(프리외디외)에 무릎을 꿇었다.',{faith:2}],
   ['성 뱅상 드 폴 사랑의 딸회 수녀들에게 기부하였다.',{faith:2,money:-100}]]),

 /* ---------------- 혁명 ---------------- */
 C('nob_grandpeur',()=>nfa()&&!urban()&&tt(1789.3,1789.5)&&!s.flags.grandPeur,8,99,'대공포','la Grande Peur',
   ()=>`“산적 떼가 온다!” 소문이 마을을 휩쓸었다. 그런데 몰려온 것은 낫과 쇠스랑을 든 이웃 농민들이다. ${hus()?jo(hn(),'은','는')+' 집에 없다.':''} 그들은 성 문서고의 영주 권리 문서(테리에)를 내놓으라고 한다.`,[
   {l:'문서고를 열어 준다',s:'',a:'safe',f:()=>{s.flags.grandPeur=true;say('마당에서 양피지 장부가 불탔다. 농민들은 포도주를 얻어 마시고 돌아갔다. 영주 공납의 근거가 재가 되었다.'+fx({money:-300,pol:3,bor:4,rloc:3}),'big');s.dues=Math.round((s.dues||0)*.5)}},
   {l:'성문을 걸어 잠그고 하인들을 무장시킨다',s:'의지 판정',a:'bold royal',f:async()=>{s.flags.grandPeur=true;const m=md([[s.st.cour>=50,1,'의지'],[s.st.cour<50,-1,'겁먹은 하인들'],[s.rep.rloc>=60,1,'마을이 영주 집안을 아낀다'],[s.rep.rloc<35,-1,'원한을 산 영주 집안']]);const r=await roll(m.m,{label:'성 지키기',why:m.why});
     if(r.v>=4)say('농민들은 성벽 아래서 소리치다 흩어졌다. 그러나 원한은 남았다.'+fx({cour:3,sus:6,rloc:-6,bor:-3}));else{say('성문이 부서지고 문서고와 별채가 불탔다. 가구와 그림이 마당에 내던져졌다.'+fx({money:-Math.round(s.money*.2),hp:-4}),'big');s.dues=0;s.seeds.push({t:'denounced',n:person(),y:s.year})}}},
   {l:'아이들을 데리고 읍내로 피한다',s:'',a:'family safe',f:()=>{s.flags.grandPeur=true;say('밤길로 읍내 친척 집에 피했다. 돌아오니 비둘기장과 문장 새긴 풍향계가 부서져 있었다.'+fx({money:-200,hp:-1}))}}]),
 S('nob_rev89',()=>nfa()&&tt(1789.4,1792.5),1.4,0,[
   ['8월 4일 밤, 영주 특권이 폐지되었다는 소식을 들었다.',{pol:2},()=>s.year===1789],
   ['애국 헌금으로 귀걸이와 은 버클을 국민의회에 바쳤다. 화가들의 아내들이 먼저 시작한 일이었다.',{money:-200,pol:4},()=>s.year===1789],
   ['세습 귀족 칭호와 문장이 폐지되었다. 마차 문의 문장을 페인트로 덮었다.',{pol:2},()=>T()>=1790.5],
   ['시중드는 하인이 그대를 ‘마담’ 대신 ‘시민 부인’이라 불렀다.',{pol:1},()=>T()>=1792],
   ['친구들이 하나둘 국경 너머로 떠났다. 응접실이 비어 갔다.',{soc:-1}],
   ['삼색 휘장을 달지 않고 외출했다가 거리에서 봉변을 당했다.',{sus:3,hp:-1},()=>urban()]]),
 C('nob_emig',()=>wife()&&tt(1789.33,1792.5)&&!s.flags.husEmi&&!s.flags.emigAsk,5,99,'망명','l’émigration',
   ()=>`${jo(hn(),'이','가')} ${pick(['코블렌츠의 왕제들 곁으로','토리노로','브뤼셀로'])} 가겠다고 한다. 친구들은 칼 대신 실패(물레)를 보내 망명하지 않는 귀족을 비웃는다. 그대가 남아 있으면 땅은 몰수되지 않을지도 모른다.`,[
   {l:'남편과 함께 떠난다',s:'망명',a:'royal family',f:async()=>{s.flags.emigAsk=true;say(`하녀 옷을 입고 ${jo(hn(),'과','와')} 밤 마차를 탔다.`+fx({cour:2,vhon:3,brg:-4}));nFac(['absolutist','royalist'],8);await emigrate()}},
   {l:'홀로 남아 땅과 아이들을 지킨다',s:'남편만 망명',a:'family bold',f:()=>{s.flags.emigAsk=true;s.flags.husEmi=true;s.spouse.pay0=s.spouse.pay;s.spouse.pay=0;say(`${jo(hn(),'은','는')} 홀로 국경을 넘었다. 그대는 영지에 남아 국가에 바칠 서류와 시청 증명서를 챙겼다.`+fx({cour:3,sus:4,vfam:4}),'big')}},
   {l:'떠나지 말라고 설득한다',s:'사교 판정',a:'safe',f:async()=>{s.flags.emigAsk=true;const m=md([[s.st.soc>=50,1,'사교'],[s.sk.orat>=30,1,'말솜씨'],[s.val.vfam>=60,1,'가족을 앞세움']]);const r=await roll(m.m,{label:'설득',why:m.why});
     if(r.v>=4){say('남편은 남기로 하였다. 국민방위대 장교복을 맞추었다.'+fx({pol:3,vfam:2,brg:2}));nFac(['patriote','feuillant'],4)}else{s.flags.husEmi=true;s.spouse.pay0=s.spouse.pay;s.spouse.pay=0;say('남편은 “명예가 걸린 일”이라며 끝내 떠났다.'+fx({hp:-2,sus:4}),'big')}}}]),
 C('nob_divorce',()=>nfa()&&hus()&&s.flags.husEmi&&tt(1792.55,1795.5)&&!s.flags.paperDiv,5,99,'서류상의 이혼','divorce pour émigration',
   '새 이혼법은 배우자의 망명을 이혼 사유로 인정한다. 망명자의 재산은 몰수되지만, 이혼한 아내는 지참금과 자기 몫을 되찾을 수 있다. 많은 귀부인들이 남편과 미리 짜고 시청에 이혼을 신청한다.',[
   {l:'시청에 이혼을 신청한다',s:'재산을 지킨다',a:'family bold',f:()=>{s.flags.paperDiv=true;s.flags.husEmi2=hn();s.spouse.alive=false;s.divorced=true;
     say('시청 관리 앞에서 남편의 망명을 사유로 이혼을 선언하였다. 지참금 몫의 땅이 그대 이름으로 남았다. 몰래 보낸 편지에 남편은 “잘했소”라고 썼다.'+fx({money:Math.round(2000+s.land*2),sus:-8,faith:-2,vfam:3,vhon:-2}),'big')}},
   {l:'혼인의 성사를 깰 수 없다',s:'',a:'pious royal',f:()=>{s.flags.paperDiv=false;s.flags.noDiv=true;say('이혼을 거부하였다. 망명자 아내로 감시위원회 명단에 이름이 올랐다.'+fx({faith:4,sus:10,vhon:4,brl:-3}));nFac(['jacobin'],-4);if(s.land>0){s.lostLand=(s.lostLand||0)+Math.round(s.land*.5);s.land=Math.round(s.land*.5);L('망명자 재산으로 땅의 절반이 봉인되었다.','sys')}}}]),
 S('nob_terror',()=>(nfa()||bl())&&tt(1792.5,1794.5),1.6,0,[
   ['가문 문서와 문장 새긴 은그릇을 정원에 묻었다.',{sus:-2}],
   ['구청에 가서 시민증(공민 증명서)을 받으려 몇 시간을 기다렸다.',{}],
   ['비단 옷을 버리고 줄무늬 무명 치마에 삼색 휘장을 달았다.',{sus:-2,soc:-1}],
   ['현관문에 사는 사람 이름과 나이를 써 붙이라는 법령이 내려왔다.',{}],
   ['이웃 귀부인이 체포되었다는 소식에 밤새 잠들지 못했다.',{hp:-2}],
   ['하녀가 아직 그대를 ‘마담’이라 부르다 구청 사람에게 들킬 뻔하였다.',{sus:2}],
   ['혁명 광장 쪽으로 가는 수레 소리를 듣지 않으려 창을 닫았다.',{hp:-1},()=>s.region==='paris']]),
 C('nob_arrest',()=>nfa()&&tt(1793.5,1794.5)&&(s.flags.husEmi||s.flags.noDiv||s.sus>=15||epee()||s.flags.presented)&&!s.flags.nobArrest,4,99,'체포','loi des suspects',
   ()=>`밤중에 구 감시위원회 사람들이 문을 두드렸다. 혐의자법에 따라 ‘옛 귀족(시드방)의 아내’를 체포한다. ${s.region==='paris'?'카름 수도원 감옥이나 포르리브르(옛 포르루아얄 수녀원)로 데려갈 것이다.':'읍내의 옛 수녀원이 감옥이 되었다.'}`,[
   {l:'담담히 따라나선다',s:'감옥에서 품위를 지킨다',a:'safe royal',f:()=>{s.flags.nobArrest=true;s.flags.prisonMem=true;s.cond='prison';s.prisonKind='terror';s.condSince=T();
     say((s.region==='paris'?'카름 감옥의 복도 벽에는 1792년 9월 학살 때 죽은 사제들의 핏자국이 남아 있었다. '+(T()>=1794.1?'같은 방에는 보아르네 자작부인 조제핀과 에기용 공작부인이 있었다. ':'')+'여자들은 매일 아침 머리를 빗고 화장을 하였다. 단두대에 오를 때 흐트러진 모습이고 싶지 않았다.':'옛 수녀원 방에 귀부인, 수녀, 상인 아내들이 뒤섞여 갇혔다. 밀짚 침대와 쥐와 매일 부르는 출두 명단.')+fx({hp:-3,cour:3,vhon:3}),'big');nFac(['jacobin'],-6)}},
   {l:'임신했다고 주장한다',s:'처형 유예를 노린다',a:'bold',f:async()=>{s.flags.nobArrest=true;s.flags.prisonMem=true;s.cond='prison';s.prisonKind='terror';s.condSince=T();
     say('임신한 여자는 해산할 때까지 처형하지 않는다. 의사의 진찰을 청했다.'+fx({cour:2}),'big');if(await chance(.5,'의사의 소견','의사들이 처형을 늦추려 거짓 소견을 써 주기도 했다')){say('늙은 의사가 눈을 찡긋하며 ‘임신 의심’이라고 적었다. 몇 달을 벌었다.'+fx({sus:-10}))}else say('의사는 고개를 저었다.'+fx({hp:-2}))}},
   {l:'뒷문으로 달아난다',s:'의지 판정',a:'bold',f:async()=>{s.flags.nobArrest=true;const m=md([[s.st.cour>=50,1,'의지'],[s.st.cour<50,-1,'겁이 남'],[s.rep.rpeople>=60,1,'이웃 민중이 숨겨 줌'],[s.rep.rpeople<35,-1,'고발할 이웃이 많다']]);const r=await roll(m.m,{label:'도주',why:m.why});
     if(r.v>=4){s.cond='hiding';s.condSince=T();say('정원 담을 넘어 옛 하녀의 다락방에 숨었다.'+fx({cour:4}),'big')}else{s.cond='prison';s.prisonKind='terror';s.condSince=T();s.flags.prisonMem=true;say('골목에서 붙잡혀 감옥으로 끌려갔다. 도주 기록이 붙었다.'+fx({sus:15,hp:-3}),'big')}}}]),
 C('nob_plead',()=>nfa()&&hus()&&!s.flags.husEmi&&tt(1793.5,1794.5)&&!s.flags.pleaded,3,99,'남편의 체포','pétition au Comité',
   ()=>`${jo(hn(),'이','가')} 체포되어 ${s.region==='paris'?'뤽상부르 감옥':'읍내 감옥'}에 갇혔다. 아내들은 국민공회 보안위원회 대기실에 줄을 서서 청원서를 낸다. 소용이 없을 수도 있고, 그대마저 눈에 띌 수도 있다.`,[
   {l:'보안위원회에 직접 탄원한다',s:'의지·사교 판정',a:'bold family',f:async()=>{s.flags.pleaded=true;const m=md([[s.st.soc>=50,1,'사교'],[s.st.cour>=50,1,'의지'],[s.pol>=0,1,'애국적 평판'],[s.sk.orat>=30||s.sk.pen>=40,1,'청원서를 다듬는 솜씨'],[s.rep.rpeople>=60,1,'구민들의 증언'],[s.rep.rpeople<35,-1,'구민들의 미움']]);const r=await roll(m.m,{label:'탄원',why:m.why});
     if(r.v>=5)say('위원 하나가 그대의 청원서를 끝까지 읽었다. 몇 주 뒤 남편이 석방 명령서를 받았다.'+fx({cour:3,fame:2,vfam:3,pen:1}),'big');
     else if(r.v>=3)say('청원서는 서류 더미에 묻혔다. 남편은 감옥에서 겨울을 났다.'+fx({hp:-2,sus:4,pen:1}));
     else{if(T()<1794.5&&await chance(.6,'혁명재판소','귀족 혐의자의 사형 판결률')){s.spouse.alive=false;s.widowed++;say(`${jo(hn(),'은','는')} 혁명재판소에 회부되어 그날 오후 단두대에 올랐다.${s.region==='paris'?` 시신은 ${T()>=1794.2?'피크퓌스':'마들렌'} 묘지의 공동 구덩이에 던져졌다.`:''}`+fx({hp:-8,vord:-4}),'dark');nFac(['jacobin','cordelier'],-10)}else say('남편은 감옥에 그대로 남았다.'+fx({sus:5}))}}},
   {l:'뇌물로 간수를 매수한다',s:'재산 -1,500',a:'greedy',f:async()=>{s.flags.pleaded=true;s.money=Math.max(0,s.money-1500);if(await chance(.35,'매수','감옥 서기를 매수해 서류를 아래로 묻어 두는 일이 있었다'))say('감옥 서기가 남편의 서류를 맨 아래로 옮겼다. 테르미도르까지 버티면 된다.'+fx({cour:2}));else say('돈만 날렸다.'+fx({sus:5}))}},
   {l:'몸을 낮추고 기다린다',s:'',a:'safe',f:()=>{s.flags.pleaded=true;say('매일 감옥 창 아래서 손수건을 흔들었다. 남편이 창살 너머로 고개를 끄덕였다.'+fx({hp:-2}))}}]),
 S('nob_after',()=>(nfa()||bl())&&s.flags.prisonMem&&s.cond==='normal'&&T()>=1794.5,1,0,[
   ['감옥에서 함께 지낸 부인들이 해마다 모여 죽은 이들을 위해 미사를 올렸다.',{faith:2}],
   ['밤마다 출두 명단을 부르는 간수의 목소리가 꿈에 나왔다.',{hp:-1}],
   ['감옥에서 사귄 친구가 이제 권력자의 아내가 되었다.',{soc:2}],
   ['머리를 짧게 자르는 ‘티투스 머리’가 유행하였다. 단두대 앞에서 잘린 머리를 기리는 것이라 했다.',{soc:1},()=>T()<1800]]),
 C('nob_tallien',()=>(nfa()||bl())&&s.region==='paris'&&tt(1794.6,1797)&&!s.done.nob_tallien_m,4,99,'테르미도르의 성모','la Chaumière',
   '감옥에서 나온 테레자 탈리앵이 샹젤리제 근처 초가집(쇼미에르)에서 손님을 맞는다. ‘테르미도르의 성모’라 불린다. 보아르네 미망인 조제핀과 레카미에 부인도 온다. 붉은 실을 목에 두른 ‘희생자 무도회’도 열린다.',[
   {l:'쇼미에르에 간다',s:'새 권력자들과 어울린다',a:'social',f:()=>{s.done.nob_tallien_m=1;meet('탈리앵 부인');meet('조제핀 드 보아르네');say('맨발에 샌들, 반지 낀 발가락. 탈리앵 부인 곁에 바라스와 군납업자들, 마른 체구의 보나파르트 장군이 있었다.'+fx({soc:3,fame:2,pol:2,sus:-6,relite:4,inf:3}));nFac(['thermidor'],8)}},
   {l:'희생자 무도회에 간다',s:'가족을 잃은 이만',a:'royal',f:()=>{s.done.nob_tallien_m=1;say('목에 붉은 실을 두르고 머리를 짧게 자른 채 춤추었다. 단두대에 가족을 잃은 이들만 들어올 수 있었다.'+fx({soc:2,pol:-3,hp:-1,vhon:2,brg:-3}));nFac(['royalist','clichy'],5)}},
   {l:'상복을 입고 집에 머문다',s:'',a:'pious safe',f:()=>{s.done.nob_tallien_m=1;say('무도회 소식을 들으며 묵주를 돌렸다.'+fx({faith:3}))}}]),
 C('nob_return',()=>nfa()&&tt(1800,1806)&&(s.cnt.emigre>0||s.lostLand>0||s.flags.husEmi)&&!s.flags.nobReturn,3,99,'잃어버린 땅','radiation',
   ()=>`망명자 명단에서 이름을 지우려면 경찰청과 도청에 청원해야 한다. 옛 성은 국유재산 경매로 ${pick(['읍내 공증인','군납업자','부농'])}에게 넘어갔다. 그는 성의 정원을 감자밭으로 만들었다.`,()=>[
   {l:'새 주인에게서 성을 되산다',s:'재산 -',a:'family greedy',dis:s.money<3000,f:()=>{s.flags.nobReturn=true;const c=Math.round(s.money*.5);s.money-=c;s.land+=Math.round(c*.05);say(`새 주인과 공증인 앞에서 흥정하여 성과 정원을 되샀다. 예전 땅의 일부일 뿐이었다. (재산 -${fmt(c)})`,'big')}},
   {l:'도청에 줄을 대어 팔리지 않은 숲을 되찾는다',s:'사교 판정',a:'social',f:async()=>{s.flags.nobReturn=true;const r=await roll(s.st.soc>=50?1:0,{label:'청원'});if(r.v>=4){const b=Math.round((s.lostLand||300)*.3);s.land+=b;say(`팔리지 않은 숲과 목장이 돌아왔다. (지대 +${fmt(b)})`,'big')}else say('서류는 도청 서랍에서 잠들었다.'+fx({money:-200}))}},
   {l:'옛 일은 잊는다',s:'',a:'safe',f:()=>{s.flags.nobReturn=true;say('파리의 작은 아파르트망에서 새 삶을 꾸렸다.'+fx({hp:1}))}}]),
 C('nob_husback',()=>nf()&&free()&&s.flags.husEmi&&T()>=1802.25&&!s.flags.husBack,5,99,'남편의 귀국','retour de l’émigré',
   ()=>s.flags.paperDiv?`망명 사면령이 나왔다. 서류상 이혼했던 ${s.flags.husEmi2||'옛 남편'}이 십 년 만에 돌아왔다. 머리가 희끗하고 런던 억양이 섞였다. 다시 혼인하자고 한다.`:`망명 사면령이 나왔다. ${jo(hn(),'이','가')} 십 년 만에 돌아왔다.`,()=>s.flags.paperDiv?[
   {l:'시청에서 다시 혼인한다',s:'',a:'family',f:()=>{s.flags.husBack=true;s.flags.husEmi=false;s.divorced=false;s.spouse={n:s.flags.husEmi2||nobleMan(),age:s.age+ri(2,10),alive:true,pay:Math.round(HPAY[s.estate]*.3),estate:s.estate};say('같은 남자와 두 번째 혼인을 하였다. 이번에는 시청 관리가 증인이었다.'+fx({hp:2,soc:1}),'big')}},
   {l:'이혼한 채로 산다',s:'자유와 재산을 지킨다',a:'bold',f:()=>{s.flags.husBack=true;s.flags.husEmi=false;say('십 년 동안 홀로 땅을 지킨 것은 그대였다. 옛 남편은 친구로 남았다.'+fx({cour:3}))}}]:[
   {l:'반갑게 맞는다',s:'',a:'family',f:()=>{s.flags.husBack=true;s.flags.husEmi=false;if(s.spouse)s.spouse.pay=Math.round((s.spouse.pay0||HPAY[s.estate])*.3);say(`${jo(hn(),'을','를')} 끌어안았다. 아이들이 아버지를 알아보지 못했다.`+fx({hp:2}),'big')}}]),
 C('nob_dame',()=>nfa()&&(epee()||robe()||s.flags.empireWed)&&tt(1804.5,1814)&&s.fame>=20&&s.age>=22&&s.age<=55&&!s.flags.dame,3,99,'궁정 시녀','dame du palais',
   ()=>`${T()<1809.8?'조제핀 황후':'마리루이즈 황후'}의 궁정 시녀(담 뒤 팔레) 자리를 제안받았다. 황제는 옛 귀족 이름이 궁정을 빛내기를 바란다. 생제르맹 구역 친척들은 ‘찬탈자’를 섬긴다고 등을 돌릴 것이다.`,[
   {l:'자리를 받아들인다',s:'명성·재산, 왕당파의 눈총',a:'social bold',f:()=>{s.flags.dame=true;meet(T()<1809.8?'조제핀 황후':'마리루이즈 황후');s.dues=(s.dues||0)+3000;
     say((T()<1809.8?'말메종과 튈르리에서 황후를 모셨다. 황후는 다정했지만 빚이 끝이 없었다. 하루에 옷을 세 번 갈아입었다.':'오스트리아에서 온 젊은 황후는 수줍고 무뚝뚝하였다. 몬테벨로 공작부인이 시녀장이었다. 엄격한 빈의 예법이 들어왔다.')+fx({fame:6,soc:2,pol:4,relite:4,inf:8,brg:-2}),'big');nFac(['bonapartist'],10);nFac(['royalist'],-8)}},
   {l:'왕가에 대한 충성으로 사양한다',s:'',a:'royal',f:()=>{s.flags.dame=false;s.flags.refusedDame=true;say('병을 핑계로 사양하였다. 경찰 장관의 눈길이 그대 집에 머물렀다.'+fx({pol:-5,sus:4,vhon:3}));nFac(['royalist'],8);nFac(['bonapartist'],-5)}}]),
 C('nob_stael',()=>(nfa()||bl())&&lit()&&tt(1803.5,1814)&&!s.done.nob_stael_m,1.2,99,'코페의 손님','Coppet',
   '황제가 스탈 부인을 파리에서 40리외 밖으로 추방하였다. 부인은 제네바 호숫가 코페의 성에 유럽의 문인들을 모은다. 그곳에 다녀오는 이는 경찰의 명단에 오른다.',[
   {l:'코페에 다녀온다',s:'학식·혐의',a:'study bold',f:()=>{s.done.nob_stael_m=1;meet('스탈 부인');say('코페에서 슐레겔과 콩스탕, 레카미에 부인을 만났다. 저녁마다 라신 비극을 상연하였다. 돌아오자 경찰이 여권을 조사하였다.'+fx({edu:3,fame:2,sus:6,pol:3}))}},
   {l:'편지만 보낸다',s:'',a:'safe',f:()=>{s.done.nob_stael_m=1;say('조심스러운 문안 편지를 보냈다.'+fx({edu:1}))}}]),
 S('nob_empire',()=>nfa()&&tt(1800,1814),1.2,0,[
   ['옛 귀족들이 생제르맹 구역에 틀어박혀 새 궁정을 비웃었다. 그러면서도 아들들은 황제의 시종이 되었다.',{soc:1}],
   ['튈르리 궁정 무도회에서 원수 부인들이 옛 공작부인들에게 예법을 물었다.',{soc:2},()=>s.flags.dame||s.flags.empireWed],
   ['아들이 징집되지 않게 대리병을 사는 데 수천 프랑을 썼다.',{money:-3000},()=>kidsAt(18,26).some(k=>k.sex==='M')],
   ['콩코르다트 뒤 다시 열린 성당에서 미사를 드렸다.',{faith:3},()=>s.year>=1802],
   ['캉팡 부인이 쓴 예법 지침을 신흥 귀족 부인들에게 빌려주었다.',{soc:1}],
   ['러시아 원정 소식을 기다리며 신문의 전사자 명단을 훑었다.',{hp:-1},()=>s.year===1812||s.year===1813]]),
 C('nob_restor',()=>nfa()&&tt(1814.1,1830.4)&&!s.flags.restCourt&&s.age>=18,3,99,'왕가의 귀환','la Restauration',
   '부르봉 왕가가 돌아왔다. 튈르리 궁 마르상관의 앙굴렘 공작부인, 루이 16세와 마리 앙투아네트의 딸이 귀부인들을 맞는다. 탕플 탑에서 부모를 잃은 공주는 웃지 않는다고 한다.',[
   {l:'옛 예법대로 알현한다',s:'왕당파의 영광',a:'royal social',f:()=>{s.flags.restCourt=true;meet('앙굴렘 공작부인');say(`${s.flags.dame?'황후의 시녀였던 과거를 수군대는 소리가 들렸다. ':''}공작부인은 짧게 고개를 끄덕였다. 그녀의 말은 거의 언제나 미사와 1월 21일 속죄 예식에 관한 것이었다.`+fx({fame:4,faith:3,pol:-6,relite:5,brg:-3}),'big');nFac(['ultra'],8)}},
   {l:'과격 왕당파(울트라)의 살롱에 드나든다',s:'',a:'royal',f:()=>{s.flags.restCourt=true;say('뒤라스 공작부인 살롱에서 샤토브리앙이 자유주의자들을 성토하였다.'+fx({pol:-8,soc:1,relite:2,brl:-3}));nFac(['ultra'],10);nFac(['doctrinaire'],-4)}},
   {l:'멀리서 지켜본다',s:'',a:'safe',f:()=>{s.flags.restCourt=true;say('새 헌장 아래의 왕정을 조용히 지켜보았다.')}}]),
 S('nob_restlife',()=>(nfa()||bl())&&tt(1815,1848),1.2,0,[
   ['생제르맹 구역의 저택에서 휘스트 판을 벌였다.',{soc:1}],
   ['딸의 혼인 지참금 문제로 공증인과 하루를 보냈다.',{}],
   ['10억 프랑 보상법을 둘러싸고 망명 귀족 집안끼리 다툼이 일었다.',{},()=>s.year>=1825&&s.year<=1827],
   ['옛 망명 귀족 부인이 런던에서 배운 차 마시는 습관을 퍼뜨렸다.',{soc:1}],
   ['양 다리 소매(지고 소매)가 부풀어 문을 옆으로 지나가야 했다.',{soc:1},()=>s.year>=1827&&s.year<=1836],
   ['불로뉴 숲에서 마차 산책을 하였다.',{hp:1},()=>s.region==='paris'],
   ['콜레라가 번지자 영지로 피신하였다.',{hp:-1},()=>s.year===1832]]),
 C('nob_recamier',()=>(nfa()||bl())&&s.region==='paris'&&tt(1819,1849)&&lit()&&!s.done.nob_recamier_m,1.3,99,'아베오부아','l’Abbaye-aux-Bois',
   '쉰 줄의 레카미에 부인이 세브르 거리 아베오부아 수녀원 3층 방에서 손님을 맞는다. 늙은 샤토브리앙이 날마다 오후 세 시에 찾아와 『무덤 저편의 회상』을 읽는다.',[
   {l:'오후 모임에 간다',s:'',a:'social study',f:()=>{s.done.nob_recamier_m=1;meet('레카미에 부인');meet('샤토브리앙');say('창밖으로 수녀원 정원의 나무가 보였다. 샤토브리앙이 자기 회상록을 읽자 모두 숨을 죽였다.'+fx({edu:2,soc:3,fame:1}))}},
   {l:'관심 없다',s:'',a:'safe',f:()=>{s.done.nob_recamier_m=1;say('옛사람들의 모임이라 여겼다.')}}]),
 C('nob_1830',()=>nfa()&&tt(1830.4,1834)&&!s.flags.july,4,99,'7월 왕정','l’émigration intérieure',
   '샤를 10세가 다시 망명길에 올랐다. 오를레앙 공 루이 필리프가 ‘프랑스인의 왕’이 되었다. 정통 왕당파 귀부인들은 새 궁정에 발길을 끊고 생제르맹 구역에 틀어박혔다. 남편이나 아들이 충성 서약을 거부하고 관직을 내던진다.',[
   {l:'새 궁정을 거부한다',s:'정통왕당파',a:'royal',f:()=>{s.flags.july='legit';say('튈르리의 초대장을 뜯지도 않고 돌려보냈다. 응접실에는 샤를 10세의 초상이 걸렸다.'+fx({pol:-5,fame:1,soc:-1,vhon:3}));nFac(['legitimist'],10)}},
   {l:'튈르리 궁 무도회에 간다',s:'',a:'social',f:()=>{s.flags.july='orl';say('은행가와 공장주 부인들 사이에서 춤추었다. 옛 친구들이 그대를 ‘변절자’라 불렀다.'+fx({soc:2,pol:3,relite:-2,inf:3}));nFac(['doctrinaire'],6);nFac(['legitimist'],-6)}}]),
 C('nob_berry',()=>nfa()&&tt(1832.08,1832.75)&&s.flags.july==='legit'&&!s.done.nob_berry_m,6,99,'베리 공작부인','équipée de la duchesse de Berry',
   '베리 공작부인이 아들 보르도 공작을 왕위에 올리려 몰래 프로방스에 상륙하여 방데로 향했다. 정통왕당파 귀부인들이 돈과 보석을 모아 보낸다.',[
   {l:'보석을 보낸다',s:'재산 -1,500, 혐의',a:'royal bold',f:()=>{s.done.nob_berry_m=1;say('보석 상자를 신부 편에 보냈다. 몇 달 뒤 공작부인이 낭트의 벽난로 뒤에 숨어 있다가 붙잡혔다는 소식이 왔다.'+fx({money:-1500,pol:-5,sus:5}))}},
   {l:'무모한 일이다',s:'',a:'safe',f:()=>{s.done.nob_berry_m=1;say('“방데는 1793년에 이미 충분히 피를 흘렸다.”'+fx({}))}}]),

 C('nob_mesmer',()=>(nfa()||bl())&&s.region==='paris'&&tt(1778,1785)&&!s.done.nob_mesmer_m,1.4,99,'메스머의 통','le baquet de Mesmer',
   '빈에서 온 의사 메스머가 방돔 광장 근처에서 ‘동물 자기’ 치료를 한다. 귀부인들이 쇠막대가 꽂힌 나무통 둘레에 손을 잡고 앉으면 유리 하모니카 소리 속에 하나둘 발작을 일으킨다고 한다. 우울증(바푀르)에 좋다는 소문이다.',[
   {l:'치료를 받아 본다',s:'재산 -100',a:'bold social',f:()=>{s.done.nob_mesmer_m=1;meet('메스머');say('통 둘레에 앉아 쇠막대를 아랫배에 댔다. 옆자리 백작부인이 비명을 지르며 쓰러져 ‘발작의 방’으로 옮겨졌다.'+fx({money:-100,soc:2})+(s.year>=1784?' 몇 달 뒤 프랭클린과 라부아지에가 낀 왕립 조사단이 동물 자기는 상상의 산물이라고 발표하였다.':''))}},
   {l:'사기꾼이다',s:'',a:'study safe',f:()=>{s.done.nob_mesmer_m=1;say('의사의 사혈이나 그 통이나 매한가지라고 웃었다.'+fx({edu:1}))}}]),
 C('nob_daughter',()=>(nfa()||bl())&&s.age>=34&&kidsAt(15,22).some(k=>k.sex==='F')&&!s.flags['dauWed'+s.year],1.4,4,'딸의 혼처','marier sa fille',
   ()=>{const d=kidsAt(15,22).filter(k=>k.sex==='F')[0];return `딸 ${jo(d.n,'이','가')} ${s.year-d.y}살이 되었다. 이제 그대가 어머니로서 혼처를 고를 차례다. ${noble()?'오래된 가문이지만 가난한 집안과, 이름은 없지만 부유한 집안':'작위 있는 집안과, 같은 상인 집안'}에서 사람이 왔다.`},()=>[
   {l:'이름을 택한다',s:'지참금 -, 명성 +',a:'royal family',f:()=>{s.flags['dauWed'+s.year]=1;say('지참금을 마련하느라 숲 하나를 팔았다. 딸은 백작부인이 되었다.'+fx({money:-Math.round(s.money*.2),fame:3}))}},
   {l:'재산을 택한다',s:'',a:'greedy family',f:()=>{s.flags['dauWed'+s.year]=1;say('딸을 부유한 집안에 보냈다. 사돈댁이 그대 집안의 빚까지 떠맡았다.'+fx({money:1500,fame:-1}))}},
   {l:'딸에게 고르게 한다',s:'',a:'family',f:()=>{s.flags['dauWed'+s.year]=1;say(`딸이 스스로 고른 사람과 혼인하였다. ${T()<1789?'친척들은 그대가 루소에 물들었다고 하였다.':'세상이 달라졌다.'}`+fx({hp:2,soc:1}))}}]),
 S('nob_vapeurs',()=>(nfa()||bl())&&s.age>=20,0.7,0,[
   ['우울증(바푀르)으로 며칠을 덧문을 내린 방에 누워 지냈다.',{hp:-1}],
   ['의사가 냉수욕과 당나귀 젖을 처방하였다.',{hp:1,money:-50}],
   ['코르셋을 너무 졸라 무도회장에서 기절하였다. 기사가 각성제 병(소금 냄새)을 코에 대 주었다.',{hp:-1}],
   ['치통 때문에 이 뽑는 사람을 불렀다.',{hp:-2}],
   ['피를 맑게 한다며 봄마다 사혈을 하였다.',{hp:-1}]]),

 /* ---------------- 과부살이와 노년 ---------------- */
 C('nob_widow',()=>(nfa()||bl())&&widow()&&s.age>=22&&!s.flags['widowQ'+s.widowed],2,99,'과부','le veuvage',
   ()=>`상복을 입은 지 한 해. ${T()<1804?'관습법에 따라 과부 연금(두에르)으로 남편 재산의 일부에서 평생 수입을 받는다.':'민법전에 따라 아이들의 후견인이 되었다. 가족회의가 그대의 결정을 감독한다.'} 처음으로 그대 이름으로 서명하고, 그대 뜻대로 돈을 쓸 수 있다.`,()=>[
   {l:'영지와 재산을 직접 경영한다',s:'학식·사교 판정',a:'work',f:async()=>{s.flags['widowQ'+s.widowed]=1;s.flags.widowRun=true;const m=md([[s.st.edu>=50,1,'학식'],[s.st.soc>=50,1,'사교'],[s.sk.trade>=35,1,'셈이 밝음']]);const r=await roll(m.m,{label:'과부의 경영',why:m.why});
     if(r.v>=4)say('관리인을 갈고 숲을 팔아 빚을 갚았다. 남편 생전보다 수입이 늘었다.'+fx({money:Math.round(1500+s.land*.5),edu:1,trade:3,rloc:2}),'big');else say('친척들이 끼어들어 땅을 두고 송사를 걸었다.'+fx({money:-500}))}},
   {l:'재혼을 생각한다',s:'',a:'family social',f:()=>{s.flags['widowQ'+s.widowed]=1;s.married=false;say('상복을 반상복으로 바꾸고 다시 살롱에 나갔다.'+fx({soc:2}))}},
   {l:'수녀원의 하숙인이 된다',s:'신앙',a:'pious',f:()=>{s.flags['widowQ'+s.widowed]=1;say('수녀원 안의 하숙 방을 얻어 조용히 지냈다. 귀부인 하숙인들끼리 카드놀이와 기도로 하루를 보냈다.'+fx({faith:5,hp:2,money:-300}))}}]),
 C('nob_tutelle',()=>(nfa()||bl())&&widow()&&kidsAt(0,20).length>0&&!s.flags.tutelle,1.4,99,'아이들의 후견','tutelle',
   ()=>`시동생이 가족회의를 소집하였다. 과부는 장남의 재산을 관리할 수 없다며 자기가 후견인이 되겠다고 한다. 장남은 이제 ${s.year-(kidsAt(0,20)[0]||{y:s.year}).y}살.`,[
   {l:'법원에 맞서 후견권을 지킨다',s:'의지 판정',a:'bold family',f:async()=>{s.flags.tutelle=true;const r=await roll(md([[s.st.cour>=50,1,'의지'],[s.fame>=30,1,'이름']]).m,{label:'후견 다툼'});
     if(r.v>=3)say('판사가 어머니의 후견을 인정하였다. 시동생은 감독 후견인으로만 남았다.'+fx({cour:3}));else say('시동생이 아이들 재산의 관리를 맡았다. 아이들의 교육까지 간섭하였다.'+fx({hp:-2,money:-300}))}},
   {l:'시동생에게 맡긴다',s:'',a:'safe',f:()=>{s.flags.tutelle=true;say('서류에 서명하였다.'+fx({}))}}]),
 S('nob_widowlife',()=>(nfa()||bl())&&widow()&&s.age>=30,1.2,0,[
   ['검은 크레이프 베일의 상복을 한 해 반 동안 입었다.',{}],
   ['과부 연금이 들어오는 날, 공증인이 서류를 들고 왔다.',{money:200}],
   ['남편의 빚쟁이들이 줄지어 찾아왔다.',{money:-300}],
   ['딸의 혼처를 직접 고르러 다녔다.',{soc:1}],
   ['과부가 된 뒤 처음으로 혼자 마차를 몰고 영지를 돌았다.',{cour:2}],
   ['젊은 과부에게 사람들이 재혼 이야기를 넣었다.',{soc:1},()=>s.age<40]]),
 S('nob_old',()=>(nfa()||bl())&&s.age>=55,1.4,0,[
   ['손주들에게 베르사유 거울의 방과 왕비의 머리 장식 이야기를 들려주었다.',{},()=>s.flags.presented],
   ['젊은 부인들이 이제 아무도 머리에 분을 뿌리지 않는다고 혀를 찼다.',{},()=>s.year>=1800],
   ['보스턴 카드놀이 판에서 옛 친구들과 혁명 이야기를 하였다.',{soc:1}],
   ['류머티즘으로 지팡이를 짚었다.',{hp:-1}],
   ['감옥 시절 이야기를 손녀에게 들려주었다. 손녀는 믿지 않았다.',{},()=>s.flags.prisonMem],
   ['유언장을 고쳐 썼다. 하녀에게 연금을 남겼다.',{faith:1}],
   ['고해 신부가 매주 목요일에 찾아왔다.',{faith:2}],
   ['그대 시대의 예법을 아는 이가 이제 몇 남지 않았다.',{}]]),
 C('nob_memoir',()=>(nfa()||bl())&&s.age>=50&&lit()&&!s.flags.book&&!s.flags.nobMemoir,1.2,99,'회상록','Mémoires',
   ()=>`${T()>=1815?'캉팡 부인, 라 투르 뒤 팽 부인, 부아뉴 백작부인 같은 귀부인들의 회상록이 잇달아 나오고 있다.':'노부인들이 옛 궁정 이야기를 써 남긴다.'} 그대도 보고 겪은 것을 써 두고 싶다.`,[
   {l:'회상록을 쓴다',s:'학식 판정',a:'study',f:async()=>{s.flags.nobMemoir=true;const m=md([[s.st.edu>=55,1,'학식'],[s.sk.pen>=40,1,'글 솜씨'],[s.rep.relite>=60,1,'궁정 시절의 인맥']]);const r=await roll(m.m,{label:'회상록',why:m.why});
     if(r.v>=4){s.flags.book=true;say('『한 귀부인의 회상』을 써서 출판하였다. 살롱에서 그 구절이 낭독되었다.'+fx({fame:6,edu:2}),'big')}else say('원고를 다 쓰고 손녀에게 물려주었다. 출판은 다음 세대에 맡겼다.'+fx({edu:2}))}},
   {l:'과거는 묻어 둔다',s:'',a:'safe',f:()=>{s.flags.nobMemoir=true;say('편지 묶음을 리본으로 묶어 상자에 넣었다.'+fx({}))}}]),

 /* ---------------- 부유한 부르주아 부인 ---------------- */
 S('nob_bl',()=>bl()&&s.age>=18,1.5,0,[
   ['남편의 상점 장부를 몰래 봐 주었다. 상인 집 아내들은 셈이 밝았다.',{edu:1}],
   ['교외의 별장(메종 드 캉파뉴)에서 여름을 났다.',{hp:2}],
   ['마차를 새로 맞추었다. 귀족처럼 문장을 그려 넣고 싶었다.',{money:-500}],
   ['귀족 부인의 살롱에 초대받았지만 아랫자리에 앉았다.',{soc:1},()=>T()<1789],
   ['쇼세당탱의 새 저택으로 이사하였다. 은행가들의 동네였다.',{soc:2},()=>s.region==='paris'&&s.year>=1780],
   ['딸에게 피아노와 영어를 가르쳤다.',{edu:1},()=>s.year>=1800],
   ['국유재산 경매에서 남편이 수도원 땅을 샀다. 고해 신부의 눈길이 차가워졌다.',{faith:-2,money:-1000},()=>tt(1791,1800)],
   ['7월 왕정의 튈르리 궁 무도회에 초대받았다. 은행가 부인들이 옛 귀족보다 많았다.',{soc:2,fame:1},()=>tt(1830.5,1848)]]),
 C('nob_bl_snub',()=>bl()&&hus()&&T()<1789.25&&!s.flags.blSnub,1.2,99,'후작부인의 문턱','la morgue',
   '후작부인 댁 음악회에 초대받았다. 그런데 하인이 그대 이름을 부르는 소리에 귀부인들이 부채 뒤에서 웃는다. “징세 청부인 부인이라더군.”',[
   {l:'우아하게 맞받아친다',s:'사교 판정',a:'social bold',f:async()=>{s.flags.blSnub=true;const m=md([[s.st.soc>=50,1,'사교'],[s.sk.orat>=25,1,'재치 있는 말솜씨'],[s.sk.music>=35,1,'음악회에서 한 곡 탐'],[s.rep.relite<35,-1,'벼락부자라는 평판']]);const r=await roll(m.m,{label:'재치',why:m.why});if(r.v>=4)say('재치 있는 한마디에 후작부인이 웃었다. 다음 주에 또 초대장이 왔다.'+fx({soc:2,fame:2,relite:5,orat:1})+nRF(nRel('후원자',{n:nLady('후작부인'),sex:'F',v:'vhon',inf:40}),{close:6}));else say('얼굴이 붉어진 채 일찍 자리를 떴다.'+fx({soc:-1,relite:-3}))}},
   {l:'남편에게 비서관 관직을 사자고 조른다',s:'‘평민 비누’',a:'greedy',f:()=>{s.flags.blSnub=true;if(s.money>=100000){s.money-=100000;s.flags.anobli=true;const ok=s.rep.relite>=55;say('남편이 10만 리브르를 치르고 왕의 비서관 관직을 샀다. 이 관직을 사면 귀족이 되기에 ‘평민 비누’라 불린다. 이제 그대도 귀부인이다.'+(ok?' 그대를 아는 귀부인들이 축하 편지를 보냈다.':' 그러나 옛 귀부인들은 여전히 ‘비누로 씻은 귀부인’이라 부르며 문을 반쯤만 열었다.')+fx({fame:5,relite:ok?6:2}),'big')}else say('남편은 관직값이 너무 비싸다고 하였다.'+fx({}))}},
   {l:'그런 자리에는 다시 가지 않는다',s:'',a:'safe',f:()=>{s.flags.blSnub=true;say('같은 상인 집안 부인들과의 모임이 더 편했다.')}}]),
 C('nob_bl_charity',()=>bl()&&s.age>=25&&!s.flags.charMat&&(tt(1784,1793)||T()>=1810),1.3,99,'자선 모성회','Société de charité maternelle',
   ()=>`${T()<1793?'파리 귀부인들이 가난한 산모에게 아기 옷과 돈을 주는 자선 모성회를 열었다. 왕비가 후원자다. 아기를 고아원에 버리지 않고 젖을 먹이겠다고 약속한 어머니만 돕는다.':'마리루이즈 황후가 후원하는 자선 모성회가 다시 세워졌다. 부르주아 부인들도 회원이 된다.'}`,[
   {l:'회원이 되어 산모들을 찾아다닌다',s:'재산 -300',a:'pious social',f:()=>{s.flags.charMat=true;say('다락방의 산모들에게 배내옷 꾸러미를 전하였다. 귀부인들과 나란히 이사회 명단에 이름이 올랐다.'+fx({money:-300,faith:3,fame:3,soc:2}));if(R()<.4)s.seeds.push({t:'saved',n:woman(),y:s.year})}},
   {l:'기부금만 낸다',s:'',a:'safe',f:()=>{s.flags.charMat=true;say('기부자 명단에 이름을 올렸다.'+fx({money:-150,fame:1}))}}]),
 C('nob_bl_salon',()=>bl()&&lit()&&s.region==='paris'&&(tt(1795,1815)||T()>=1830.5)&&!s.flags.salon&&s.age>=25,1.2,99,'새 시대의 살롱','salon de la Chaussée-d’Antin',
   ()=>`${T()<1815?'총재정부와 제국의 새 부자들이 살롱을 연다. 레카미에 부인은 은행가의 아내다.':'7월 왕정은 은행가의 시대다. 쇼세당탱의 부인들이 생제르맹 구역의 공작부인들과 손님을 다툰다.'}`,()=>[
   {l:'살롱을 연다',s:'재산 -1,000',a:'social',dis:s.money<1000,f:async()=>{s.money-=1000;const m=md([[s.st.soc>=50,1,'사교'],[s.st.edu>=50,1,'학식'],[s.sk.orat>=30,1,'대화를 이끄는 솜씨'],[s.rep.relite>=60,1,'사교계의 평판']]);const r=await roll(m.m,{label:'살롱',why:m.why});
     if(r.v>=4){s.flags.salon=true;say((T()<1815?'장군과 은행가, 배우들이 그대 살롱의 단골이 되었다.':'발자크와 젊은 하원의원들이 그대 살롱을 찾았다.')+fx({fame:5,soc:3,relite:4,inf:6}),'big');if(!s.job&&meets(POST.w2))takeJob('w2','이름난 ')}
     else say('손님은 남편의 거래처 사람들뿐이었다.'+fx({soc:1}))}},
   {l:'그만둔다',s:'',a:'safe',f:()=>say('조용한 저녁을 택했다.')}])
);
/* ---------------- 손끝과 몸가짐, 줄과 맞수 (nob2_) ----------------
   악기·그림·자수(music·draw·sew·dex), 승마(ride·str), 사교·웅변(soc·orat), 편지(pen), 살림(trade).
   평판은 무대마다 다르다: 궁정 relite, 영지 rloc, 혁명기 rpeople. 연인·경쟁자·후원자는 addRel로 남긴다. */
EV.push(
 C('nob2_concert',()=>(nfa()||bl())&&s.age>=15&&s.age<=60&&(urban()||s.flags.presented||epee()),1,3,'음악회','le concert de salon',()=>`${T()<1790?'저녁 음악회에서 안주인이 그대에게 한 곡을 청하였다.':T()<1815?'살롱 음악회에서 로망스 한 곡을 청받았다.':'저녁 모임에서 피아노 앞에 앉아 달라는 청을 받았다.'} ${T()<1795?(s.year>=1770?'하프는 왕비 덕분에 귀부인들의 악기가 되었다. 클라브생도 뚜껑이 열려 있다.':'클라브생 뚜껑이 열려 있다.'):'에라르 공방의 새 피아노가 놓여 있다.'} 손님들의 눈이 그대 손끝에 모였다.`,()=>[
   {l:T()<1795&&s.year>=1770?'하프를 탄다':T()<1795?'클라브생을 친다':'피아노를 친다',s:'기술·악기 판정',a:'social study',f:async()=>{const m=md([[s.sk.music>=40,1,'악기 솜씨'],[s.st.dex>=50,1,'손끝'],[s.sk.music<15,-1,'연습 부족'],[s.st.soc>=55,1,'사람들 앞의 여유']]);const r=await roll(m.m,{label:'연주',why:m.why});
     if(r.v>=5)say('마지막 화음이 사라지자 잠깐 정적이 흐르고 박수가 터졌다. 이튿날 여기저기서 초대장이 왔다.'+fx({music:2,relite:5,fame:2,soc:1}));
     else if(r.v>=3)say('틀린 데 없이 끝까지 쳤다. 노부인들이 점잖게 부채를 접었다 폈다.'+fx({music:2,relite:1}));
     else say('줄이 끊어지고 박자가 엉켰다. 안주인이 서둘러 다음 사람을 불렀다.'+fx({music:1,relite:-3}))}},
   {l:'노래로 대신한다',s:'',a:'social',f:()=>say(`${T()<1800?'그레트리의 아리에트':'로망스'}를 한 곡 불렀다.`+fx({soc:1,music:1,relite:1}))},
   {l:'사양한다',s:'',a:'safe',f:()=>say('손가락을 다쳤다며 사양하였다.'+fx({relite:-1}))}]),
 C('nob2_draw',()=>(nfa()||bl())&&s.age>=14&&s.age<=55&&lit(),.7,4,'그림','le pastel',()=>`${T()<1790?'파스텔과 수채 물감 상자를 샀다. 귀부인이 그림을 그리는 것은 미덕이지만, 왕립 회화 아카데미는 여자 회원을 넷까지만 받는다.':T()<1816?'1791년부터 살롱전은 아카데미 회원이 아닌 화가에게도 열렸다. 여자 화가들도 그림을 건다.':'수채화가 유행이다. 앨범에 꽃 그림을 그려 주고받는다.'} 정원의 장미, 아이들의 얼굴, 영지의 풍경이 그대 앞에 있다.`,()=>[
   {l:'아이들의 초상을 그린다',s:'기술·그림 판정',a:'study family',f:async()=>{const m=md([[s.sk.draw>=35,1,'그림 솜씨'],[s.st.dex>=50,1,'손재주'],[s.sk.draw<10,-1,'배운 적이 거의 없음']]);const r=await roll(m.m,{label:'그림',why:m.why});
     if(r.v>=5)say(T()>=1791&&T()<1816?'초상을 살롱전에 냈다. 비평가가 ‘귀부인의 손이라 믿기 어려운 필치’라고 썼다.'+fx({draw:3,fame:3,relite:2}):'파스텔 초상이 살롱에서 돌려 보였다. 화가 선생이 칭찬하였다.'+fx({draw:3,relite:2,vfam:1}));
     else if(r.v>=3)say('아이 얼굴이 제법 닮게 나왔다. 서재 벽에 걸었다.'+fx({draw:2,vfam:1}));
     else say('코가 비뚤어진 그림을 보고 아이들이 웃었다.'+fx({draw:1}))}},
   {l:'화가의 화실에서 수업을 받는다',s:'재산 -150',a:'study',f:()=>say(`${T()<1790?'라비유귀아르 부인의 화실에서 여제자들 틈에 앉았다.':'이름난 화가의 화실에 일주일에 두 번 나갔다.'}`+fx({money:-150,draw:3,dex:1}))},
   {l:'붓을 놓는다',s:'',a:'safe',f:()=>say('물감 상자를 딸에게 물려주었다.')}]),
 C('nob2_embroid',()=>(nfa()||bl())&&s.age>=16,.8,3,'자수틀','le métier à broder',()=>`${s.year>=1770&&T()<1790?'요즘 귀부인들은 낡은 금실 장식을 풀어 금을 파는 ‘파르필라주(parfilage)’에 빠져 있다. ':''}수틀에 비단을 메웠다. ${hob()||!urban()?'영지 성당의 제단보가 해졌다.':'남편의 조끼에 놓을 꽃무늬 도안이 왔다.'}`,()=>{const o=[
   {l:hob()||!urban()?'성당 제단보를 수놓아 바친다':'조끼에 꽃무늬를 수놓는다',s:'기술·바느질 판정',a:'pious family',f:async()=>{const m=md([[s.sk.sew>=40,1,'바느질 솜씨'],[s.st.dex>=50,1,'손재주'],[s.age>=55,-1,'눈이 침침함']]);const r=await roll(m.m,{label:'자수',why:m.why});
     if(r.v>=4)say(hob()||!urban()?'성모 축일 미사에 새 제단보가 걸렸다. 신부가 강론에서 부인 마님의 손을 칭찬하였다.'+fx({sew:2,dex:1,faith:2,rloc:4}):'조끼를 입은 남편이 무도회에서 그 무늬를 자랑하였다.'+fx({sew:2,dex:1,relite:2,vfam:1}));
     else say('바늘땀이 고르지 않아 몇 번이나 뜯어냈다.'+fx({sew:1}))}}];
   if(s.year>=1770&&T()<1790)o.push({l:'파르필라주를 한다',s:'금실을 팔아 용돈을 번다',a:'greedy social',f:()=>say('낡은 견장의 금실을 풀어 금 세공사에게 팔았다. 남자 손님들은 빼앗길까 봐 금단추를 감추었다.'+fx({money:60,dex:1,relite:1}))});
   o.push({l:'하녀에게 맡긴다',s:'',a:'safe',f:()=>say('수틀을 하녀 방으로 보냈다.')});return o}),
 C('nob2_hunt',()=>nfa()&&s.age>=16&&s.age<=55&&(T()<1789.5||T()>=1800),.8,3,'몰이사냥','la chasse à courre',()=>`${s.flags.presented&&T()<1789.5?'왕의 사냥에 귀부인들도 말을 타고 따른다. 젊은 왕비는 남자처럼 걸터앉아 탄다는 소문이다.':'이웃 영주가 사슴 몰이사냥에 초대하였다.'} 사냥개 떼와 뿔나팔 소리가 숲을 울린다. 부인들은 대개 마차로 따라가지만, 옆안장(selle d’amazone)에 앉아 말을 몰 줄 아는 이는 사냥을 앞에서 본다.`,[
   {l:'말을 타고 사냥개 뒤를 따른다',s:'승마·체력 판정',a:'bold social',f:async()=>{const m=md([[s.sk.ride>=35,1,'승마 솜씨'],[s.st.str>=40,1,'체력'],[s.sk.ride<10,-1,'말을 잘 못 탐'],[s.st.cour>=50,1,'의지']]);const r=await roll(m.m,{label:'사냥',why:m.why});
     if(r.v>=5)say('도랑을 뛰어넘어 사슴이 쓰러지는 자리에 남자들보다 먼저 닿았다. 사냥 주인이 사슴의 앞발을 그대에게 바쳤다.'+fx({ride:3,str:1,relite:4,fame:1}));
     else if(r.v>=2)say('하루 종일 숲길을 달렸다. 치맛자락이 진흙투성이였다.'+fx({ride:2,hp:-1}));
     else say('말이 도랑 앞에서 멈춰 서는 바람에 떨어졌다. 어깨를 다쳐 몇 주를 누워 지냈다.'+fx({hp:-7,ride:1}),'dark')}},
   {l:'마차를 타고 구경한다',s:'',a:'safe social',f:()=>say('마차 안에서 부인들과 사냥 소문을 나누었다.'+fx({soc:1,relite:1}))}]),
 C('nob2_rival',()=>(nfa()||bl())&&s.age>=20&&(urban()||s.flags.presented)&&(T()<1792||T()>=1795),.8,4,'사교계의 맞수','la rivale',()=>{const rv=relsAlive().find(r=>r.role==='경쟁자'&&r.sex==='F');s.flags.nobRv=rv?rv.n:(noble()?nLady():woman()+' 부인');return `${s.flags.nobRv}${bat(s.flags.nobRv)?'이':'가'} 그대 이야기를 퍼뜨린다는 말이 들렸다. ${pick(['그대의 드레스가 두 해 지난 유행이라고','그대 집안 지참금이 아직 다 치러지지 않았다고','그대가 남편 친구와 너무 가깝다고'])} 하였다는 것이다. 오늘 밤 같은 응접실에서 마주친다.`},()=>[
   {l:'재치로 되받아친다',s:'사교·웅변 판정',a:'bold social',f:async()=>{const rv=nRel('경쟁자',{n:s.flags.nobRv,sex:'F',v:'vhon',inf:35,riv:60,w:'사교계 맞수'});const m=md([[s.st.soc>=55,1,'사교'],[s.sk.orat>=30,1,'말재간'],[s.rep.relite>=60,1,'평판'],[s.rep.relite<35,-1,'평판이 나쁨']]);const r=await roll(m.m,{label:'말의 결투',why:m.why});
     if(r.v>=4)say('그대의 한마디가 이튿날 여러 응접실에서 되풀이되었다. 맞수는 한 철 동안 얼굴을 내밀지 않았다.'+fx({orat:2,relite:4,fame:1})+nRF(rv,{riv:8,resp:6}));
     else say('맞수가 더 날카로운 말로 응수하였다. 웃음은 그쪽에서 났다.'+fx({orat:1,relite:-3})+nRF(rv,{riv:5}))}},
   {l:'먼저 다가가 손을 내민다',s:'',a:'social safe',f:()=>{const rv=nRel('경쟁자',{n:s.flags.nobRv,sex:'F',v:'vhon',inf:35,riv:60,w:'사교계 맞수'});say('부채를 접고 먼저 인사를 건넸다. 맞수는 놀란 얼굴로 답례하였다.'+fx({soc:1,relite:1})+nRF(rv,{riv:-15,close:10}))}},
   {l:'못 들은 척한다',s:'',a:'safe',f:()=>say('소문은 한 달쯤 돌다 잦아들었다.'+fx({relite:-1}))}]),
 C('nob2_protect',()=>nfa()&&(s.flags.presented||s.flags.dame||s.flags.restCourt)&&(T()<1789.5||tt(1804,1830.5))&&s.age>=22&&(hus()||kidsAt(15,25).some(k=>k.sex==='M')),1,5,'궁정의 줄','la protection',()=>{const p=patron();return `${hus()?hn()+'에게 연대':'아들에게 장교 자리'}를 얻어 주려면 궁정에 줄이 있어야 한다. ${p?`${p.n}${bat(p.n)?'이':'가'} 도와줄지도 모른다.`:`${T()<1790?'왕비의 측근':'궁정 시녀장'} 곁의 귀부인에게 줄을 대야 한다.`} 청원 편지 한 장, 방문 한 번이 몇 해의 운을 가른다.`},()=>[
   {l:'정성껏 청원 편지를 쓰고 찾아간다',s:'글씨·사교 판정',a:'social family',f:async()=>{const p=patron()||nRel('후원자',{n:nLady(),sex:'F',v:'vhon',inf:60,w:'궁정의 후원자'});const m=md([[s.sk.pen>=35,1,'편지 솜씨'],[s.st.soc>=55,1,'사교'],[s.rep.relite>=60,1,'궁정의 평판'],[!!p&&p.close>=60,1,'후원자와 가까움']]);const r=await roll(m.m,{label:'청원',why:m.why});
     if(r.v>=4){say(`${hus()?hn()+'의 연대장 임명장':'아들의 임관 증서'}이 내려왔다. 후원자에게 세브르 도자기 한 벌을 보냈다.`+fx({pen:2,inf:5,relite:3,money:-300,vfam:2})+nRF(p,{close:6,trust:5}),'big');if(hus()&&s.spouse.pay)s.spouse.pay=Math.round(s.spouse.pay*1.2)}
     else say('정중한 답장만 왔다. “때가 오면 기억하겠습니다.”'+fx({pen:1})+nRF(p,{close:2}))}},
   {l:'궁정의 청탁 놀음에는 끼지 않는다',s:'',a:'safe',f:()=>say('줄을 대는 대신 영지에서 아이들을 가르쳤다.'+fx({vhon:2,relite:-1}))}]),
 C('nob2_steward',()=>(wife()||blw()||nfa()&&widow())&&s.age>=20,.8,3,'살림 셈','l’économie domestique',()=>{const e=econ();return `집사가 이달 장부를 올렸다. ${e.price>=1.3?'빵과 장작값이 뛰어 부엌 지출이 지난해보다 훨씬 많다.':e.price<=.95?'올해는 곡식이 싸서 부엌 살림에 여유가 있다.':'지출은 여느 해와 비슷하다.'}${e.cur<.5?' 지폐로 받은 지대는 휴지가 되었고 상인들은 금화만 달라고 한다.':''} 하인들의 급료와 제복, 마구간 귀리가 줄지어 적혀 있다.`},()=>{const e=econ();return [
   {l:'직접 장부를 맞추고 지출을 줄인다',s:'장사·셈 판정',a:'work study',f:async()=>{const m=md([[s.sk.trade>=30,1,'셈이 밝음'],[s.st.edu>=50,1,'학식'],[e.price>=1.3,-1,'물가가 높은 해']]);const r=await roll(m.m,{label:'살림',why:m.why});
     if(r.v>=4)say('마부 하나를 내보내고 밀랍 초를 수지 초로 바꾸었다. 한 해 지출이 눈에 띄게 줄었다.'+fx({money:Math.round(200*e.price),trade:2}));
     else say('줄인 만큼 하인들이 뒤에서 빼돌렸다.'+fx({trade:1,money:-Math.round(50*e.price)}))}},
   {l:'집사에게 맡긴다',s:'',a:'safe',f:()=>say('장부를 덮고 서명만 하였다.'+fx({money:-Math.round(150*Math.max(0,e.price-.9))}))},
   {l:'하인들 급료를 올려 준다',s:'',a:'pious family',dis:e.price<1.2,f:()=>say('물가가 뛰어 하인들 급료를 조금 올려 주었다. 하인들이 마님을 위해 미사를 드렸다.'+fx({money:-Math.round(120*e.price),rloc:2,vjus:2}))}]}),
 C('nob2_tenants',()=>nfa()&&!urban()&&(hus()||widow())&&s.land>0&&(T()<1789.5||T()>=1800),1,3,'영지의 소작인들','les tenanciers',()=>{const e=econ();return `${e.price>=1.3?'흉년이다. ':''}소작인 대표들이 성 마당에 모자를 쥐고 서 있다. ${T()<1789.5?'영주 공납과 소작료를':'지대를'} ${e.price>=1.3?'올해만 미뤄 달라고 한다.':'예전대로 내겠으니 방앗간 삯만은 내려 달라고 한다.'} 관리인은 한 푼도 깎아 주지 말라고 귀띔한다.`},()=>[
   {l:'청을 들어주고 곳간을 연다',s:'재산 -, 마을의 평판 +',a:'pious social',f:()=>say('곡식 몇 말과 지대 반 해 치를 깎아 주었다. 일요일 미사 뒤 아낙들이 부인 마님의 손에 입을 맞추었다.'+fx({money:-Math.round(150+s.land*.15),rloc:7,faith:1,bor:2}))},
   {l:'관리인 말대로 다 받는다',s:'',a:'greedy',f:()=>say('관리인이 장부대로 다 걷었다. 마을 카바레에서 부인 마님을 욕하는 노래가 불렸다.'+fx({money:Math.round(80+s.land*.1),rloc:-7,bor:-2}))},
   {l:'직접 농가를 돌며 사정을 듣는다',s:'사교·승마 판정',a:'work',f:async()=>{const m=md([[s.st.soc>=50,1,'사교'],[s.sk.ride>=25,1,'말을 타고 돎'],[s.sk.trade>=30,1,'셈이 밝음']]);const r=await roll(m.m,{label:'영지 순회',why:m.why});
     if(r.v>=4)say('형편이 어려운 집만 골라 미뤄 주고 나머지는 받았다. 관리인도 소작인도 불만이 없었다.'+fx({money:Math.round(30+s.land*.05),rloc:4,trade:1,ride:1}));
     else say('사정이 다 딱해 보여 결국 모두 미뤄 주었다.'+fx({money:-Math.round(100+s.land*.1),rloc:5}))}}]),
 C('nob2_lady',()=>nfa()&&epee()&&s.flags.presented&&T()<1789.5&&s.age>=20&&s.age<=50&&!s.flags.nobLady,.8,99,'왕녀의 수행 귀부인','dame pour accompagner',()=>`${s.year<1774?'왕의 딸들(메담)':s.year>=1779?'왕의 누이 엘리자베트 공주':'왕의 고모들(메담)'}의 수행 귀부인(dame pour accompagner) 자리 하나가 비었다. 한 주씩 돌아가며 시중들고 연금이 나온다. 무엇보다 왕족의 귀에 말 한마디 넣을 수 있는 자리다. 노리는 부인이 여럿이다.`,()=>[
   {l:'자리를 청한다',s:'사교·평판 판정',a:'social royal',f:async()=>{s.flags.nobLady=1;const p=patron();const m=md([[s.rep.relite>=60,1,'궁정의 평판'],[s.st.soc>=55,1,'사교'],[!!p,1,'후원자'],[s.sk.music>=40,1,'저녁 연주 솜씨'],[s.rep.relite<40,-1,'평판이 모자람']]);const r=await roll(m.m,{label:'수행 귀부인',why:m.why});
     if(r.v>=4){s.dues=(s.dues||0)+2000;say('자리를 얻었다. 왕족의 산책과 미사와 카드놀이를 한 주씩 따라다녔다. 그대 집 응접실에 청탁하는 이들이 줄을 섰다. (연금 +2,000)'+fx({inf:10,relite:5,fame:3})+nRF(p,{close:5}),'big')}
     else{const rv=nRel('경쟁자',{n:nLady(),sex:'F',v:'vhon',inf:45,riv:65,w:'궁정 자리의 맞수'});say('자리는 다른 부인에게 돌아갔다. 그 부인은 그대를 보며 부채 뒤로 웃었다.'+fx({relite:-2})+nRF(rv,{riv:6}))}}},
   {l:'궁정살이는 사양한다',s:'',a:'safe family',f:()=>{s.flags.nobLady=1;say('아이들 곁에 머물기로 하였다.'+fx({vfam:3}))}}]),
 C('nob2_feder',()=>(nfa()||bl())&&loc()==='paris'&&tt(tm(1790,6),tm(1790,8))&&!s.flags.nobFeder,5,99,'샹드마르스의 손수레','la Fête de la Fédération','7월 14일 연맹제를 앞두고 샹드마르스에 관중석 둑을 쌓을 일손이 모자란다. 파리 사람들이 신분을 가리지 않고 삽을 든다. 비단옷 차림의 귀부인들이 손수레를 미는 모습이 판화로 팔린다.',[
   {l:'손수레를 밀러 간다',s:'체력, 민중의 평판',a:'radical social',f:()=>{s.flags.nobFeder=1;const ok=s.st.str>=35;say((ok?'장갑을 끼고 흙을 가득 실은 손수레를 밀었다. 숯장수와 수도사와 후작부인이 나란히 ‘사 이라(Ça ira)’를 불렀다.':'손수레 두 번에 팔이 떨어질 듯하였다. 그래도 사람들이 박수를 쳐 주었다.')+fx({str:1,rpeople:ok?6:4,relite:-2,brg:4,bor:3,pol:3}));nFac(['patriote','jacobin'],4)}},
   {l:'마차를 세우고 구경한다',s:'',a:'safe',f:()=>{s.flags.nobFeder=1;say('구경꾼들이 ‘귀족 마님 손은 희기도 하다’며 놀렸다.'+fx({rpeople:-2}))}},
   {l:'광대놀음이라 비웃는다',s:'',a:'royal',f:()=>{s.flags.nobFeder=1;say('응접실에서 연맹제를 비웃는 농담을 하였다. 하인들이 그 말을 밖으로 옮겼다.'+fx({rpeople:-4,relite:2,brg:-3}));nFac(['absolutist'],4)}}]),
 C('nob2_emisend',()=>nfa()&&s.flags.husEmi&&tt(1791.5,1797)&&s.money>=300&&!s.flags.nobEmiSend,2,99,'국경 너머의 편지','lettre de Coblence',()=>`${s.flags.husEmi2||hn()}의 편지가 스위스 상인의 손을 거쳐 왔다. 망명지에서 돈이 떨어졌다고 한다. ${T()>=1792.6?'망명자에게 돈을 보내는 것은 이제 사형까지 받을 수 있는 죄다.':'망명자에게 돈을 보내면 의심을 산다.'}`,()=>[
   {l:'은화와 보석을 몰래 보낸다',s:'혐의 +',a:'family royal bold',f:async()=>{s.flags.nobEmiSend=1;const a=Math.round(s.money*.3);
     if(await chance(inTerror()?.2:.08,'발각','망명자 송금으로 고발된 사례')){say('송금이 들통났다. 구 감시위원회가 그대를 망명자의 공범으로 적었다.'+fx({money:-a,sus:20,vfam:3,vhon:2}),'dark');nFac(['jacobin'],-8)}
     else{say(`${fmt(a)} ${money()}어치 은화를 레이스 꾸러미에 숨겨 보냈다. 답장에는 고맙다는 말과 왕제들 곁의 소식이 적혀 있었다.`+fx({money:-a,sus:6,vfam:4,vhon:2}));nFac(['royalist','absolutist'],6)}}},
   {l:'답장만 쓰고 돈은 보내지 않는다',s:'',a:'safe',f:()=>{s.flags.nobEmiSend=1;say('아이들 이야기만 적어 보냈다. 이 땅을 지키는 것도 집안을 지키는 일이었다.'+fx({vfam:1,vord:2,pen:1}))}},
   {l:'편지를 구청에 내보인다',s:'혐의 -, 남편과는 끝',a:'radical',f:()=>{s.flags.nobEmiSend=1;say('편지를 구청에 가져가 공화국에 대한 충성을 보였다. 위원들이 그대를 다른 눈으로 보았다.'+fx({sus:-10,rpeople:4,vfam:-6,vhon:-4,pol:4}),'big');nFac(['jacobin'],6)}}]),
 C('nob2_civism',()=>(nfa()||bl())&&tt(tm(1793,9),tm(1794,8))&&!s.flags.nobCiv,3,99,'공민 증명서','certificat de civisme',()=>`혐의자법이 내렸다. 구 감시위원회에서 공민 증명서를 받지 못하면 연금도 여권도 없고, 혐의자 명단에 오른다. 위원들은 이웃의 증언을 듣는다. ${s.rep.rpeople>=60?'구민들은 그대를 ‘착한 시민 부인’이라 부른다.':s.rep.rpeople<35?'구민들은 그대를 아직도 ‘마님’이라 부르며 눈을 흘긴다.':''}`,()=>[
   {l:'이웃 증인을 세워 신청한다',s:'민중의 평판 판정',a:'safe social',f:async()=>{s.flags.nobCiv=1;const m=md([[s.rep.rpeople>=60,1,'구민들의 증언'],[s.rep.rpeople<35,-1,'구민들의 미움'],[s.pol>=20,1,'애국 헌금 기록'],[epee(),-1,'대귀족 집안'],[s.sus>=30,-1,'혐의']]);const r=await roll(m.m,{label:'공민 증명서',why:m.why});
     if(r.v>=4){say('구두장이와 물장수가 그대를 위해 증언하였다. 증명서에 붉은 도장이 찍혔다.'+fx({sus:-10,rpeople:3}));nFac(['jacobin'],3)}
     else say(`위원 하나가 “${noble()?'옛 귀족의 아내':'부자 상인의 아내'}에게 공민 정신이 있을 리 없다”며 서류를 밀어냈다.`+fx({sus:8,vord:-2}))}},
   {l:'위원에게 선물을 보낸다',s:'재산 -400',a:'greedy',f:()=>{s.flags.nobCiv=1;s.money=Math.max(0,s.money-400);say('위원의 아내에게 옷감을 보냈다. 증명서는 나왔지만 언제든 다시 빼앗길 수 있었다.'+fx({sus:-5,vjus:-2}))}},
   {l:'신청하지 않고 숨어 지낸다',s:'',a:'bold',f:()=>{s.flags.nobCiv=1;say('외출을 끊고 덧문을 닫았다.'+fx({sus:5,hp:-1,vhon:2}))}}]),
 C('nob2_hostess',()=>(nfa()||bl())&&s.flags.salon&&(T()<1792.5||T()>=1795),1,3,'살롱의 청탁','le crédit d’une salonnière',()=>`${pick(['젊은 시인','가난한 학자','지방에서 올라온 법률가'])} 하나가 그대 살롱에 드나든 지 한 해다. ${T()<1793||T()>=1803?'아카데미 회원 자리':T()<1815?'도청의 자리':'관보의 편집 자리'}를 얻게 힘써 달라고 한다. 살롱 안주인의 말 한마디가 장관의 서명보다 빠를 때가 있다.`,()=>[
   {l:'손님들에게 그를 밀어 준다',s:'영향력·웅변 판정',a:'social',f:async()=>{const iv=influence().v;const m=md([[iv>=30,1,'영향력'],[s.sk.orat>=35,1,'대화를 이끄는 솜씨'],[s.rep.relite>=65,1,'사교계의 평판'],[relsAlive().some(r=>r.role==='경쟁자'&&r.w==='살롱 맞수'&&r.riv>=60),-1,'맞수 살롱의 방해']]);const r=await roll(m.m,{label:'청탁',why:m.why});const cl=nRel('친구',{n:person(),sex:'M',v:'vlib',w:'살롱의 피후견인'});
     if(r.v>=4)say('그가 자리를 얻었다. 사람들은 그 자리를 그대 살롱이 만들었다고 말하였다.'+fx({inf:6,relite:3,orat:1,fame:1})+nRF(cl,{close:10,trust:10,resp:10}));
     else say('다른 살롱이 민 사람이 자리를 가져갔다.'+fx({inf:-2,orat:1})+nRF(cl,{close:-4}))}},
   {l:'살롱은 대화를 위한 곳이라며 거절한다',s:'',a:'safe',f:()=>say('정중히 거절하였다. 그는 다음 주부터 오지 않았다.'+fx({vhon:1}))}]),
 C('nob2_bl_title',()=>bl()&&hus()&&(tt(1808.2,1814)||tt(1815,1830.5))&&s.money>=30000&&!s.flags.anobli&&!s.flags.nobTitle,1,99,'칭호를 청하다','majorat / lettres de noblesse',()=>T()<1814?'1808년 황제가 제국 귀족을 만들었다. 연 수입 1만 5천 프랑이 나오는 세습 재산(majorat)을 묶어 두면 남편이 남작 칭호를 받을 수 있다. 칭호와 문장을 내리는 인장국(Conseil du sceau)에 줄을 대야 한다.':'왕이 돌아오자 은행가와 공장주들이 국왕의 귀족 서임장(lettres de noblesse)을 청한다. 생제르맹 구역의 귀부인들이 그대 집안을 어떻게 보느냐가 서임 못지않게 중요하다.',()=>[
   {l:'칭호를 청원하고 사교계에 줄을 댄다',s:'재산 -20,000, 상류사회 평판 판정',a:'greedy social',f:async()=>{s.flags.nobTitle=1;s.money-=20000;const m=md([[s.rep.relite>=60,1,'사교계의 평판'],[s.rep.relite<40,-1,'벼락부자라는 평판'],[!!patron(),1,'후원자'],[s.sk.pen>=35,1,'청원서 솜씨']]);const r=await roll(m.m,{label:'서임',why:m.why});
     if(r.v>=4){s.flags.anobli=true;say(`${T()<1814?'남편이 제국 남작이 되었다. 마차 문에 새 문장을 그렸다.':'국왕의 서임장이 나왔다. 그대는 이제 남작부인이다.'} (재산 -20,000)`+fx({fame:4,relite:6,inf:3}),'big')}
     else say('서류는 인장국 서랍에서 잠들었다. 옛 귀부인들이 그 소문을 듣고 웃었다. (재산 -20,000)'+fx({relite:-4}))}},
   {l:'돈은 공장과 땅에 쓴다',s:'',a:'safe',f:()=>{s.flags.nobTitle=1;say('“칭호로 빵을 굽지는 못하오.” 남편이 웃었다.'+fx({vlib:1}))}}])
);

}
