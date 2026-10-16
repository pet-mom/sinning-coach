/* ================= 농민의 삶 (pea_) =================
   농사의 한 해, 가축, 영주·교회·왕에게 바치는 몫, 마을 살림, 여성의 일.
   기본 조건 peas() = 성인·평상시이고 농민 신분이거나 농업 트랙이며 도시가 아닌 곳 (events.js).
   1789년 이전은 3개월 단위 진행이므로 달 조건은 peaM()으로 지난 진행 구간 전체를 본다. */
const peaM=(...ms)=>{const n=tickMonths();for(let k=0;k<n;k++){if(ms.includes(((s.month-k)%12+12)%12))return true}return false};
const peaAt=(...rs)=>rs.includes(loc());
const peaFarm=()=>peas()&&(onTrack('farm')||!s.job);
const peaT=()=>onTrack('farm')?job().t:(s.land>0?2:1);
const peaV=n=>Math.max(1,Math.round(n*[1,1,1.3,2,3.5,6][peaT()]));
const peaLand=()=>peaFarm()&&peaT()>=2;
const peaCom=()=>peas()&&!noble();
const peaGG=()=>peaAt('ile','picardie','champagne','bourgogne','normandie');
const peaWine=()=>peaAt('bourgogne','champagne','gascogne','languedoc','provence','alsace','ile');
const peaFeud=()=>T()<1793.35;
const peaYr=(a,b)=>T()>=a&&T()<b;
const peaBad=()=>econ().price>=1.25, peaFine=()=>econ().price<=.95;   // 고장의 곡식값(지역 경제)으로 흉풍을 본다
const peaSon=(a,b)=>kidsAlive().find(k=>k.sex==='M'&&!k.peaDrawn&&s.year-k.y>=a&&s.year-k.y<=b);
const peaSp=()=>isM()?'아내':'남편';
const peaWed=()=>s.married&&s.spouse&&s.spouse.alive;
const peaRiver=()=>({provence:'론 강',languedoc:'론 강',gascogne:'가론 강',bourgogne:'손 강',ile:'센 강',vendee:'세브르 강',champagne:'마른 강',picardie:'솜 강',normandie:'센 강',alsace:'일 강',auvergne:'알리에 강',bretagne:'빌렌 강'})[loc()]||'강';
const PEA_LADDER=['f1','f2','f3','f4','f5'];
function peaNext(){const t=onTrack('farm')?job().t:1;const id=PEA_LADDER[t];return id?POST[id]:null}
function peaSet(id,pre){const n=POST[id].need,c=n.cost;n.cost=0;try{takeJob(id,pre)}finally{n.cost=c}}
function peaGood(n=1){s.flags.peaGood=(s.flags.peaGood||0)+n}
function peaBadY(n=1){s.flags.peaBad=(s.flags.peaBad||0)+n}
function peaUp(pre){const p=peaNext();if(p&&meets(p)){takeJob(p.id,pre);s.flags.peaGood=0;s.flags.peaBad=0;return true}return false}
function peaDown(pre,keep=.5){s.land=Math.round(s.land*keep);if(s.job!=='f1')takeJob('f1',pre);s.flags.peaBad=0;s.flags.peaGood=0}
// 지역 경제: 장에서 받는 값(곡식값·장사 솜씨·1795~96 지폐 폭락), 품삯(임금 배율), 가내 일감(일자리)
const peaSale=n=>{const e=econ();return Math.max(1,Math.round(peaV(n)*e.price*(1+(s.sk.trade||0)/250)*(e.cur<.5?.55:1)))};
const peaWage=n=>{const e=econ();return Math.max(1,Math.round(n*e.wage*(e.cur<.5?.6:1)))};
const peaJob=n=>Math.max(1,Math.round(n*econ().jobs/70));
// 이름 있는 영주와 본당 신부: 관계 인물로 남긴다
const peaLord=()=>s.flags.peaLord||(s.flags.peaLord=pick(NOBLE_SURS)[0]+' 영주');
const peaCure=()=>s.flags.peaCureN||(s.flags.peaCureN=pick(M_NAMES)[0]+' 신부');
function peaRel(role,n,o={}){return relsAlive().find(x=>x.n===n)||addRel(role,Object.assign({n,sex:'M'},o))}
const peaRF=(r,o)=>r?relFx(r,o):'';
async function peaReap(extra=0,why=''){
  const m=md([[peaFine(),1,'순한 날씨'],[peaBad(),-1,'궂은 해'],[s.flags.peaHands===s.year,1,'일꾼을 넉넉히 둠'],[!!s.flags.peaClover,1,'인공 목초로 거름이 늘어남'],[!!s.flags.peaOx,1,'제 소로 제때 갈아엎음'],[s.flags.peaSeedEaten===s.year,-1,'씨앗을 먹어 버림'],[s.flags.peaTilled===s.year,1,'깊이 갈아 둔 밭'],[s.sk.farm>=45,1,'농사 솜씨'],[s.st.str<25,-1,'힘 부족'],[extra>0,1,why],[extra<0,-1,why]]);
  return await roll(m.m,{label:'수확',why:m.why})}
function peaHarvestOut(r){const wheat=s.flags.peaCrop==='wheat',half=s.job==='f2'?' 지주 몫 절반을 떼어 보냈다.':'';
  if(r.v>=5){say(`${wheat?'밀':'메테유(호밀 섞은 밀)'} 이삭이 묵직하였다. 곳간이 가득 찼다.${half}`+fx({money:Math.round(peaV(wheat?70:45)*(r.v===6?1.5:1)),hp:1,farm:2}));peaGood(r.v===6?2:1)}
  else if(r.v>=3)say(`여느 해만큼 거두었다. 한 해 먹을 것과 씨앗은 남았다.${half}`+fx({money:peaV(wheat?25:18),farm:1}));
  else if(r.v===2)say(`이삭이 가볍다. 씨앗 몫을 떼고 나니 겨울이 걱정이다.${half}`+fx({money:peaV(4),hp:-1}));
  else{say(`${wheat?'밀이 깜부기병과 비에 상해':'곡식이 쓰러져 썩어'} 뿌린 씨앗의 서너 배밖에 거두지 못하였다.${half}`+fx({money:-peaV(wheat?30:15),hp:-2}),'dark');peaBadY()}}

EV.push(
 /* ---------------- 농사의 한 해 ---------------- */
 C('pea_sow',()=>peaLand()&&peaM(9,10),.8,1,'가을 파종','semailles d’automne',()=>`가을갈이를 마쳤다. 겨울 곡식을 뿌릴 차례다. 밀(froment)은 값이 좋지만 추위와 장마에 약하고, 호밀을 섞어 뿌리는 메테유(méteil)는 소출이 적어도 잘 버틴다.${peaAt('auvergne','bretagne','champagne')?' 이 메마른 땅에서는 호밀이 주곡이다.':''}`,[
   {l:'밀을 뿌린다',s:'풍년이면 큰돈, 흉년이면 큰 손해',a:'greedy bold',f:()=>{s.flags.peaCrop='wheat';say('씨앗 바구니를 허리에 차고 이랑을 따라 밀을 흩뿌렸다.'+fx({hp:-1}))}},
   {l:'메테유를 뿌린다',s:'적게 거두되 덜 잃는다',a:'safe',f:()=>{s.flags.peaCrop='rye';say('늘 하던 대로 호밀과 밀을 섞어 뿌렸다.')}}]),
 C('pea_spring',()=>peaLand()&&peaM(2,3,4),.7,1,'봄 파종','les mars',()=>`봄 곡식(les mars)을 뿌릴 밭이 비어 있다. 귀리와 보리가 늘 하던 일이지만, ${peaAt('bretagne')?'메마른 황무지에는 메밀(blé noir)이 낫다고들 한다.':peaAt('gascogne')?'요즘 남서부에서는 옥수수(blé d’Espagne)를 많이 심는다.':s.flags.peaPotato||peaAt('alsace')||T()>=1795?'감자를 심는 집도 늘었다.':'올해도 별다른 수는 없어 보인다.'}`,()=>{const o=[{l:'귀리와 보리를 뿌린다',s:'말먹이와 보리빵',a:'safe',f:()=>{s.flags.peaSpring='oats';say('귀리와 보리를 뿌리고 써레로 흙을 덮었다.')}}];
   if(peaAt('bretagne','normandie'))o.push({l:'메밀을 뿌린다',s:'석 달이면 여무는 가난한 이의 곡식',a:'work',f:()=>{s.flags.peaSpring='buck';s.flags.peaFood=s.year+1;say('초여름 황무지를 태우고 메밀을 뿌렸다. 겨울 내내 메밀 갈레트와 죽으로 버틸 것이다.'+fx({hp:1}))}});
   if(peaAt('gascogne','languedoc','bourgogne'))o.push({l:'옥수수를 심는다',s:'소출은 밀의 두 배, 김매기가 고되다',a:'work',f:()=>{s.flags.peaSpring='maize';s.flags.peaFood=s.year+1;say('옥수수를 심고 여름 내내 김을 맸다. 가을이면 옥수수죽(millas)이 식구를 먹일 것이다.'+fx({hp:-1}))}});
   if(s.flags.peaPotato||peaAt('alsace')||T()>=1795)o.push({l:'감자를 심는다',s:'흉년에 강하다',a:'study',f:()=>{s.flags.peaSpring='potato';s.flags.peaFood=s.year+1;say('밭 한 귀퉁이에 감자를 심었다. 이웃 노인들은 돼지나 먹는 것이라며 혀를 찼다.'+fx({soc:-1}))}});
   return o}),
 C('pea_hands',()=>peaLand()&&peaT()>=3&&peaM(5,6),.6,2,'추수 일꾼','les moissonneurs',()=>`밀이 누렇게 익었다. 낫질할 일꾼을 더 불러야 한다. 산골에서 내려온 떠돌이 추수꾼(aoûterons)들이 광장에 서서 품삯을 부른다. ${econ().wage>=1.2?'젊은이들이 군대로 빠져 올해는 품삯이 비싸다.':econ().jobs<55?'일감 없는 이들이 넘쳐 품삯이 헐하다.':'올해도 품삯은 만만치 않다.'}`,[
   {l:'넉넉히 부른다',s:'돈이 들지만 제때 거둔다',a:'work',f:()=>{s.flags.peaHands=s.year;say('추수꾼 여럿과 품삯, 하루 네 끼 밥, 포도주를 약조하였다.'+fx({money:-Math.round(peaV(20)*econ().wage)}))}},
   {l:'식구끼리 해치운다',s:'돈은 아끼나 몸이 상한다',a:'family safe',f:()=>say('새벽부터 해 질 녘까지 온 식구가 낫을 들었다.'+fx({hp:-3,cour:1,str:1,farm:1}))},
   {l:'품삯을 깎는다',s:'사교 판정',a:'greedy',f:async()=>{const m=md([[s.st.soc>=45,1,'사교'],[s.sk.trade>=30,1,'셈이 밝음'],[econ().jobs<55,1,'일감이 귀한 해'],[econ().wage>=1.2,-1,'일손이 귀한 해']]);const r=await roll(m.m,{label:'품삯 흥정',why:m.why});if(r.v>=4){s.flags.peaHands=s.year;say('싼 값에 일꾼들을 붙잡았다.'+fx({money:-peaV(10)}))}else say('일꾼들은 침을 뱉고 이웃 농가로 가 버렸다.'+fx({soc:-1,rloc:-3,hp:-2}))}}]),
 C('pea_harvest',()=>peaLand()&&peaM(6,7),1,1,'추수','la moisson',()=>peaBad()?'비가 그치지 않는다. 쓰러진 이삭이 밭에서 싹을 틔울 지경이다. 하늘이 갤 날을 기다릴 것인가, 젖은 채로 베어 들일 것인가.':'뙤약볕 아래 밀이 바스락거린다. 다 익기를 하루 이틀 더 기다리면 낟알이 여물지만, 우박 철이다.',[
   {l:'서둘러 베어 들인다',s:'수확 판정',a:'safe work',f:async()=>peaHarvestOut(await peaReap())},
   {l:'한껏 익기를 기다린다',s:'날씨가 좋으면 유리, 나쁘면 불리',a:'bold',f:async()=>peaHarvestOut(await peaReap(peaFine()?1:peaBad()?-1:R()<.5?1:-1,peaFine()?'다 여문 낟알':'기다리다 비를 맞음'))},
   {l:'성당에서 축복을 받고 벤다',s:'신앙',a:'pious',f:async()=>{say('신부가 밭머리에서 성수를 뿌렸다.'+fx({faith:2})+peaRF(peaRel('후원자',peaCure(),{v:'vfam',inf:20}),{close:3}));peaHarvestOut(await peaReap())}}]),
 C('pea_thresh',()=>peaLand()&&peaT()>=3&&peaM(11,0,1),.5,2,'겨울 탈곡','le battage',()=>`헛간에 볏단이 쌓여 있다. 겨우내 도리깨로 조금씩 털 것인가, 탈곡꾼을 불러 낟알 열다섯 말에 한 말을 품삯으로 줄 것인가.${T()>=1830?' 요즘은 말이 돌리는 탈곡기(manège)를 빌려주는 사람도 있다.':''}`,()=>{const o=[
   {l:'식구끼리 도리깨질한다',s:'',a:'family work',f:()=>say('얼어붙은 헛간에서 겨우내 도리깨 소리가 끊이지 않았다.'+fx({hp:-2,str:1,farm:1}))},
   {l:'탈곡꾼을 부른다',s:'곡식으로 품삯',a:'safe',f:()=>say('탈곡꾼 셋이 박자를 맞추어 도리깨를 내리쳤다. 품삯으로 낟알을 덜어 주었다.'+fx({money:-peaV(8)}))}];
   if(T()>=1830)o.push({l:'탈곡기를 빌린다',s:'빠르지만 이웃 탈곡꾼들의 원성',a:'study greedy',f:()=>say('말 두 필이 돌리는 탈곡기가 사흘 만에 일을 끝냈다. 일감을 잃은 날품팔이들이 헛간 앞에서 수군거렸다.'+fx({money:peaV(10),rloc:-4,bor:-1}))});return o}),
 C('pea_sell',()=>peaLand()&&peaM(10,11,0)&&!(s.flags.peaStore&&T()-s.flags.peaStore<1.2),.6,1,'곡식을 팔까','au marché',()=>`장날이다. 타작한 곡식을 지금 팔면 값이 헐하고, 봄 보릿고개(la soudure)까지 쟁여 두면 값이 오른다. 하지만 바구미와 쥐가 있고, ${T()>=1789.5?'곡식을 쌓아 두는 자는 ‘매점꾼(accapareur)’이라고 손가락질 받는다.':'흉년이면 이웃들의 눈길이 따갑다.'}${econ().cur<.5?' 게다가 상인들은 휴지가 된 아시냐 지폐로만 값을 치르려 한다.':econ().price>=1.3?' 올해는 읍내 곡식값이 높다.':econ().price<=.95?' 올해는 어디나 곡식이 흔해 값이 헐하다.':''}`,()=>[
   {l:'지금 장에 내다 판다',s:'',a:'safe',f:()=>say('곡식 자루를 수레에 싣고 장에 가서 팔았다.'+fx({money:peaSale(25),trade:1}))},
   {l:'곡물 상인과 흥정한다',s:'장사 판정',a:'greedy social',f:async()=>{const m=md([[s.sk.trade>=35,1,'셈과 흥정'],[s.st.soc>=50,1,'말솜씨'],[econ().supply<50,1,'곡식이 귀한 해'],[econ().supply>=85,-1,'곡식이 넘치는 해']]);const r=await roll(m.m,{label:'곡물 흥정',why:m.why});if(r.v>=4)say('상인이 혀를 차면서도 웃돈을 얹어 주었다.'+fx({money:Math.round(peaSale(25)*1.25),trade:2}));else say('상인은 낟알에 쭉정이가 섞였다며 값을 깎았다.'+fx({money:Math.round(peaSale(25)*.85),trade:1}))}},
   {l:'봄까지 쟁여 둔다',s:'봄에 값이 오르면 이득',a:'greedy',f:()=>{s.flags.peaStore=T();say('곡식을 다락에 펴 말리고 쥐덫을 놓았다.'+fx({sus:T()>=1793&&T()<1795?4:0}))}},
   {l:'가난한 이웃에게 싸게 넘긴다',s:'신앙·사교',a:'pious social',f:()=>say('씨앗조차 없는 이웃들에게 시세보다 싸게 넘겼다.'+fx({money:peaV(12),soc:1,rloc:4,faith:2}))}]),
 C('pea_storeout',()=>peas()&&s.flags.peaStore&&T()-s.flags.peaStore>.1&&T()-s.flags.peaStore<1.2&&peaM(2,3,4,5),1.5,0,'보릿고개의 곡식값','la soudure','봄이 되자 곡식값이 뛰었다. 이웃들은 굶주리고, 다락의 곡식 자루는 아직 묵직하다.',[
   {l:'장에서 높은 값에 판다',s:'바구미 판정',a:'greedy',f:async()=>{s.flags.peaStore=0;const r=await roll(0,{label:'곡식 상태'});if(r.v>=3)say('높은 값에 곡식을 팔았다. 돌아오는 길에 아낙들이 등 뒤에서 욕을 하였다.'+fx({money:peaSale(40),rloc:-5,trade:1,sus:rev()?3:0}));else say('자루를 열어 보니 바구미가 슬어 절반은 가루가 되어 있었다.'+fx({money:peaV(10)}))}},
   {l:'이웃에게 제값에 나눈다',s:'',a:'pious social',f:()=>{s.flags.peaStore=0;say('시세보다 낮은 값에 이웃들에게 나누어 팔았다. 신부가 강론에서 칭찬하였다.'+fx({money:peaV(20),soc:1,rloc:5,faith:2})+peaRF(peaRel('후원자',peaCure(),{v:'vjus',inf:20}),{close:6,resp:5}))}}]),
 C('pea_soudure',()=>peas()&&peaT()<=2&&peaM(2,3,4,5)&&!(s.flags.peaFood>=s.year),.7,1,'보릿고개','la soudure',()=>`독이 바닥났다. 새 곡식은 석 달 뒤에야 여문다.${peaBad()?' 올해는 빵값이 두 배로 뛰었다.':''}${econ().supply<45?' 장에는 곡식 자루조차 드물다.':''} 다락에는 가을에 뿌릴 씨앗 자루 하나만 남았다.`,()=>{const o=[
   {l:'부농에게 곡식을 꾼다',s:'추수 때 한 말 반으로 갚는다',a:'safe',f:()=>{s.flags.peaDebt={a:peaV(30),y:s.year};say('마을 부농의 곳간에서 호밀 몇 말을 꾸었다. 추수 때 한 말 반으로 갚기로 하였다.'+fx({hp:1,soc:-1}))}},
   {l:'씨앗을 먹어 버린다',s:'당장은 살지만 다음 수확이 줄어든다',a:'family',f:()=>{s.flags.peaSeedEaten=s.year;say('씨앗 자루를 풀어 죽을 쑤었다.'+fx({hp:1}))}},
   {l:'풀죽과 밀기울로 버틴다',s:'',a:'safe',f:()=>say('쐐기풀과 밀기울을 끓여 먹으며 버텼다.'+fx({hp:peaBad()?-5:-3}))}];
   if(T()>=1770)o.push({l:'자선 작업장에 나간다',s:'길 닦기 품삯',a:'work',f:()=>say('지방 당국이 연 자선 작업장(atelier de charité)에서 흙을 날랐다.'+fx({money:peaWage(12),hp:-2,str:1}))});
   o.push({l:'신부의 구호소에 손을 벌린다',s:'',a:'pious',f:()=>say('본당 구호회(bureau de charité)에서 빵 몇 덩이를 받았다.'+fx({hp:1,soc:-2,faith:1}))});return o}),
 C('pea_lend',()=>peaLand()&&peaT()>=3&&peaM(2,3,4),.5,2,'씨앗을 꾸러 온 이웃','prêt de semence',()=>`${jo(person(),'이','가')} 모자를 손에 쥐고 찾아왔다. 겨우내 씨앗까지 먹어 버렸다며 봄 곡식 씨앗 몇 말만 꾸어 달라고 한다.`,[
   {l:'그냥 꾸어 준다',s:'추수 때 같은 양으로',a:'pious social',f:async()=>{if(await chance(.25,'떼인 씨앗','흉년 뒤 갚지 못한 소농의 비율 추정'))say('그 집은 가을에도 갚지 못하였다. 대신 추수 때 사흘 일을 해 주었다.'+fx({soc:1,rloc:3,money:-peaV(5)}));else say('가을에 그는 씨앗을 고스란히 갚고 고맙다며 닭 한 마리를 들고 왔다.'+fx({soc:1,rloc:4,faith:1}))}},
   {l:'한 말 반으로 갚으라고 한다',s:'이자를 받는다',a:'greedy',f:()=>say('추수 때 한 말 반으로 갚겠다는 증서에 십자 표시를 받았다.'+fx({money:peaV(8),soc:-2}))},
   {l:'거절한다',s:'',a:'safe',f:()=>say('우리 먹을 것도 빠듯하다며 돌려보냈다.'+fx({rloc:-3}))}]),
 C('pea_louee',()=>peas()&&peaT()===1&&s.age<=55&&peaM(5,6),.6,1,'품팔이 장','la louée de la Saint-Jean',()=>`성 요한 축일(6월 24일) 품팔이 장이 섰다. 이삭을 모자에 꽂은 일꾼들이 광장에 늘어서 있다. 큰 농장 관리인과 이웃 마을 부농이 사람을 고른다. ${econ().jobs<55?'올해는 사람이 넘쳐 관리인들이 팔뚝부터 만져 본다.':econ().wage>=1.2?'일손이 귀해 관리인들이 먼저 품삯을 부른다.':''}`,[
   {l:'먼 평야의 큰 농장으로 간다',s:'품삯이 높지만 고되다',a:'work bold',f:async()=>{const m=md([[s.st.hp>=55,1,'건강'],[s.st.str>=50,1,'체력'],[s.sk.farm>=40,1,'낫질 솜씨'],[s.st.str<30,-1,'힘 부족']]);const r=await roll(m.m,{label:'한 철 추수',why:m.why});if(r.v>=3)say('평야의 큰 농장에서 한 철 추수를 마치고 품삯을 받았다.'+fx({money:peaWage(45),hp:-2,farm:2,str:1}));else say('일사병으로 쓰러져 품삯의 절반만 받고 돌아왔다.'+fx({money:peaWage(20),hp:-6}))}},
   {l:'마을 부농 집에 머슴으로 들어간다',s:'숙식과 품삯',a:'safe',f:()=>say('한 해 품삯과 셔츠 두 벌, 나막신 한 켤레를 약조받고 부농 집에 들어갔다.'+fx({money:peaWage(25),hp:1,farm:1}))},
   {l:'날마다 품을 판다',s:'',a:'social',f:()=>say('그날그날 일감을 찾아 이 밭 저 밭을 다녔다.'+fx({money:Math.round(peaWage(15)*econ().jobs/70),rloc:1}))}]),
 C('pea_glean',()=>peas()&&(peaT()===1||!isM())&&peaM(6,7),.6,2,'이삭줍기','le glanage','볏단이 실려 나간 밭에는 이삭줍기 권리가 있다. 과부와 아이들, 가난한 아낙들이 허리를 굽힌다. 그런데 아직 볏단이 남아 있는 옆 밭에도 이삭이 수북하다.',[
   {l:'볏단이 나간 밭에서만 줍는다',s:'',a:'safe',f:()=>say('해 질 녘까지 이삭을 주워 앞치마 가득 담았다. 겨울 빵 몇 덩이 몫이다.'+fx({money:6,hp:-1}))},
   {l:'볏단 사이로 몰래 들어간다',s:'의지 판정',a:'bold greedy',f:async()=>{const r=await roll(0,{label:'몰래 줍기'});if(r.v>=4)say('볏단에서 이삭 한 줌씩을 뽑아 앞치마에 감추었다.'+fx({money:12}));else say(`${T()>=1791?'들판 감시인(garde champêtre)':'밭 지기(messier)'}에게 들켜 이삭을 빼앗기고 벌금을 물었다.`+fx({money:-8,soc:-2}))}}]),
 C('pea_glean2',()=>peaLand()&&peaT()>=3&&peaM(6,7),.4,3,'이삭줍는 사람들','glaneuses','볏단을 다 실어 내기도 전에 마을 아낙과 아이들이 밭머리에 몰려왔다. 관습으로는 이삭줍기를 막을 수 없지만, 갈퀴로 밭을 먼저 긁어 버리는 농가도 있다.',[
   {l:'밭을 열어 준다',s:'신앙·사교',a:'pious social',f:()=>say('볏단을 서둘러 실어 내고 밭을 열어 주었다.'+fx({faith:2,rloc:3}))},
   {l:'갈퀴로 먼저 긁는다',s:'',a:'greedy',f:()=>say('일꾼들에게 갈퀴로 밭을 긁게 하였다. 아낙들이 저주를 퍼부었다.'+fx({money:peaV(5),rloc:-5,pol:-1}))}]),
 C('pea_hay',()=>peaLand()&&peaM(5,6),.5,2,'건초 말리기','la fenaison','풀을 베어 널어 두었는데 서쪽 하늘이 시커멓다. 덜 마른 건초를 지금 들이면 곳간에서 뜨거워져 불이 날 수 있다. 두면 비에 썩는다.',[
   {l:'덜 말랐어도 들인다',s:'',a:'bold',f:async()=>{if(await chance(.12,'건초 자연 발화','젖은 건초 더미의 발열'))say('사흘 뒤 건초 더미에서 연기가 올라 반을 마당에 끌어내 태웠다.'+fx({money:-peaV(20),hp:-1}));else say('비가 오기 직전에 마지막 수레가 곳간에 들어갔다.'+fx({hp:-1,str:1}))}},
   {l:'더미로 쌓고 비를 견딘다',s:'',a:'safe',f:async()=>{const r=await roll(peaFine()?1:0,{label:'건초'});if(r.v>=3)say('비는 금세 그쳤다. 이튿날 다시 널어 말렸다.');else say('비가 일주일 내렸다. 건초가 검게 썩어 겨울 말먹이가 모자란다.'+fx({money:-peaV(12)}))}}]),
 C('pea_vendange',()=>peaFarm()&&peaWine()&&peaM(8,9),.8,1,'포도 수확','les vendanges',()=>`포도 수확 공고(ban des vendanges)가 났다. 당도를 생각하면 며칠 더 기다리고 싶지만, 가을비가 들면 송이가 터져 썩는다.${peaAt('champagne')?' 에페르네의 포도주상들이 거품 포도주를 만든다며 좋은 송이를 찾는다.':''}${peaAt('gascogne')?' 아르마냐크에서는 포도주를 증류해 네덜란드 상인에게 브랜디로 판다.':''}`,()=>{const o=[
   {l:'공고 날에 바로 딴다',s:'',a:'safe',f:()=>say('온 마을이 바구니를 지고 포도밭에 나섰다. 시큼하지만 상하지 않은 포도주를 얻었다.'+fx({money:peaV(18),soc:1}))},
   {l:'며칠 더 익힌다',s:'날씨 판정',a:'bold greedy',f:async()=>{const r=await roll(peaFine()?1:peaBad()?-1:0,{label:'포도 수확'});if(r.v>=4){say('잘 익은 송이로 빛깔 좋은 포도주를 담갔다. 상인이 웃돈을 쳐 주었다.'+fx({money:peaV(40)}));peaGood()}else if(r.v>=2)say('비를 조금 맞았지만 그럭저럭 거두었다.'+fx({money:peaV(12)}));else{say('우박과 비에 송이가 터져 반 넘게 썩었다.'+fx({money:-peaV(10)}),'dark');peaBadY()}}}];
   if(peaAt('gascogne'))o.push({l:'증류해 브랜디로 판다',s:'',a:'study greedy',f:()=>say('떠돌이 증류꾼의 솥을 빌려 포도주를 내렸다. 보르도로 가는 거룻배에 실어 보냈다.'+fx({money:peaV(30),hp:-1}))});
   if(peaAt('champagne'))o.push({l:'에페르네 상인에게 송이째 판다',s:'',a:'social',f:()=>say('포도주상 대리인이 송이를 통째로 사 갔다.'+fx({money:peaV(28),soc:1}))});return o}),
 C('pea_chestnut',()=>peas()&&peaAt('auvergne','languedoc')&&peaM(9,10),.6,2,'밤 줍기','la châtaigne','밤나무 숲에 알밤이 떨어진다. 밤은 산골의 ‘빵 나무’다. 연기 나는 건조실(clède)에서 말려 두면 겨우내 끼니가 되고, 도시에 팔면 돈이 된다.',[
   {l:'말려서 겨울 양식으로 둔다',s:'보릿고개 걱정을 던다',a:'family safe',f:()=>{s.flags.peaFood=s.year+1;say('건조실 위층에 밤을 펴 놓고 한 달 동안 연기를 쐬었다.'+fx({hp:2}))}},
   {l:'읍내 장에 내다 판다',s:'',a:'greedy',f:()=>say('밤 자루를 노새에 싣고 읍내 장에 팔았다.'+fx({money:peaV(15)}))}]),
 C('pea_shear',()=>peaLand()&&peaAt('provence','languedoc','champagne','gascogne','auvergne','picardie','ile','bourgogne')&&peaM(4,5),.4,2,'양털 깎기','la tonte','양털을 깎았다. 양털 상인이 문 앞에서 값을 부른다. 집에서 실을 자아 천을 짜면 더 쳐주겠지만 손이 많이 든다.',()=>{const o=[
   {l:'상인에게 털째 판다',s:'',a:'safe',f:()=>say('양털 뭉치를 저울에 달아 팔았다.'+fx({money:peaV(12)}))},
   {l:'집에서 실을 잣는다',s:'',a:'family work',f:()=>say('겨우내 물레를 돌려 실을 자았다. 식구들 옷감이 넉넉해졌다.'+fx({money:peaV(6),hp:1,craft:1,dex:1}))}];
   if(T()>=1786&&peaT()>=3)o.push({l:'메리노 숫양을 빌려 교배한다',s:'랑부예 왕립 목장의 에스파냐 양',a:'study',f:async()=>{const r=await roll(0,{label:'메리노 교배'});if(r.v>=4){say('새끼 양들의 털이 가늘고 길었다. 직물업자들이 다투어 샀다.'+fx({money:peaV(35),edu:1}));peaGood()}else say('새끼들이 겨울 추위에 약해 여럿이 죽었다.'+fx({money:-peaV(10)}))}});return o}),
 C('pea_transhum',()=>peaLand()&&peaAt('provence','languedoc','gascogne')&&peaM(4,5),.5,2,'산으로 가는 양 떼','la transhumance',()=>`여름이 오면 평야의 풀이 탄다. ${peaAt('provence')?'크로 평야의 양 떼는 우두머리 목자(bayle)를 따라 알프스 고원으로 올라간다.':peaAt('languedoc')?'양 떼는 옛 양몰이 길(draille)을 따라 세벤 산지로 올라간다.':'베아른의 양 떼는 피레네의 여름 목초지(estive)로 올라간다.'} 목자 품삯과 통행세가 든다.`,[
   {l:'목자에게 맡겨 올려 보낸다',s:'',a:'work',f:async()=>{const r=await roll(0,{label:'여름 목초지'});if(r.v>=3)say('가을에 양 떼가 살이 올라 내려왔다. 방울 소리에 마을이 들썩였다.'+fx({money:peaV(25)}));else say(`${peaAt('gascogne')?'곰':'늑대'}와 눈보라에 양 여럿을 잃었다.`+fx({money:-peaV(15)}))}},
   {l:'평야에 남긴다',s:'',a:'safe',f:()=>say('평야의 마른 풀로 버텼다. 양들이 비쩍 말랐다.'+fx({money:-peaV(5)}))}]),
 C('pea_potato',()=>peaFarm()&&!s.flags.peaPotato&&T()>=1771&&T()<1815&&!peaAt('ile','alsace'),.4,99,'감자','la pomme de terre',()=>`${T()>=1800?'도지사':T()>=1790?'구청':'지방 감독관'}이 감자 씨알과 파르망티에의 재배법을 적은 인쇄물을 나누어 주었다. 이웃 노인들은 감자를 먹으면 나병에 걸린다며, 돼지에게나 줄 것이라고 한다.`,[
   {l:'심어 본다',s:'흉년에 대비',a:'study bold',f:()=>{s.flags.peaPotato=true;s.flags.peaFood=s.year+1;say('밭 가장자리에 감자를 심었다. 가을에 캐 보니 한 포기에 주먹만 한 덩이가 여럿 달려 있었다.'+fx({hp:2,edu:1}))}},
   {l:'돼지 먹이로나 조금 심는다',s:'',a:'safe',f:()=>{s.flags.peaPotato=true;say('돼지우리 옆에 몇 이랑 심었다.')}},
   {l:'받지 않는다',s:'',a:'safe',f:()=>say('씨알 자루를 돌려보냈다.')}]),
 C('pea_cure',()=>peaLand()&&s.year>=1760&&!s.flags.peaClover,.4,4,'인공 목초','prairies artificielles',()=>`${peaYr(1793.5,1802)?'구청의 농업 위원':'본당 신부'}가 농업협회(Société d’agriculture)의 소책자를 들고 왔다. 놀리는 휴경지에 클로버나 잠두, 에스파르세트를 뿌리면 가축이 늘고, 거름이 늘고, 밀이 는다고 한다. 그러나 휴경지는 온 마을 가축이 풀을 뜯는 공동 방목지(vaine pâture)다.`,[
   {l:'휴경지에 클로버를 뿌린다',s:'수확에 유리, 이웃의 원성',a:'study bold',f:()=>{s.flags.peaClover=true;say('휴경지에 클로버를 뿌리고 말뚝을 박았다. 목동들이 투덜거렸다.'+fx({edu:2,farm:1,rloc:-3}))}},
   {l:'소책자를 읽어 달라고만 한다',s:'',a:'study',f:()=>say('신기한 이야기로 듣고 말았다.'+fx({edu:1}))},
   {l:'조상들의 삼포식을 지킨다',s:'',a:'safe',f:()=>say('밀, 봄 곡식, 휴경. 할아버지 때부터 그렇게 해 왔다.')}]),
 C('pea_comice',()=>peaLand()&&peaT()>=3&&T()>=1830,.5,3,'농업 공진회','le comice agricole','군청 소재지에서 농업 공진회(comice)가 열린다. 가장 좋은 황소, 가장 곧은 쟁기 이랑에 상금과 메달을 준다. 도지사도 온다.',[
   {l:'황소를 끌고 나간다',s:'판정',a:'bold social',f:async()=>{const r=await roll(s.flags.peaOx?1:0,{label:'공진회'});if(r.v>=5)say('일등 상을 받았다. 도지사가 메달을 걸어 주고 신문에 이름이 실렸다.'+fx({money:peaV(20),fame:4,soc:3}));else say('상은 이웃 군 대농에게 돌아갔다. 새 쟁기 구경만 실컷 하였다.'+fx({edu:1}))}},
   {l:'구경만 한다',s:'',a:'study',f:()=>say('도발 쟁기(Dombasle)와 인산 비료 이야기를 들었다.'+fx({edu:2}))}]),

 /* ---------------- 가축 ---------------- */
 C('pea_fair',()=>peaLand()&&peaM(2,3,8,9),.6,2,'가축 장','la foire aux bestiaux',()=>`읍내 큰 장날이다. 리무쟁 소, 노르망디 젖소, 푸아투 노새가 줄지어 섰다. 말 장수(maquignon)들이 손바닥을 마주치며 값을 정한다.${s.flags.peaOx?' 집에는 쟁기 끌 소가 이미 있다.':' 아직 쟁기 끌 소가 없어 남의 소를 빌려 밭을 간다.'}`,()=>[
   {l:'쟁기 끌 소 한 겨리를 산다',s:`재산 -${fmt(peaV(110))}`,a:'greedy work',dis:s.money<peaV(110)||!!s.flags.peaOx,f:()=>{s.flags.peaOx=true;say('뿔이 고른 황소 두 마리를 사서 멍에를 맞추었다.'+fx({money:-peaV(110),soc:1}))}},
   {l:'젖소 한 마리를 산다',s:'재산 -60',a:'family',dis:s.money<60,f:()=>say('젖소를 끌고 돌아왔다. 아이들 죽에 우유가 들어간다.'+fx({money:-60,hp:2}))},
   {l:'말 장수와 흥정한다',s:'사교 판정. 속을 수도',a:'bold',f:async()=>{const m=md([[s.st.soc>=50,1,'말솜씨'],[s.sk.trade>=35,1,'장사 셈'],[s.sk.farm>=50,1,'가축 보는 눈']]);const r=await roll(m.m,{label:'흥정',why:m.why});if(r.v>=4)say('늙은 말 장수를 이겨 쓸 만한 말을 싸게 샀다.'+fx({money:-peaV(20),trade:2}));else say('이빨을 검게 물들여 젊어 보이게 한 늙은 말이었다. 집에 오는 길에 절름거렸다.'+fx({money:-peaV(30)}))}},
   {l:'구경만 한다',s:'',a:'safe',f:()=>say('소 값만 묻고 돌아왔다.')}]),
 C('pea_epizoo',()=>peaLand()&&peaAt('gascogne','languedoc')&&s.year>=1774&&s.year<=1776,1.5,3,'소 역병','l’épizootie de 1774',`플랑드르에서 바욘으로 들어온 소 역병이 남서부를 휩쓸고 있다. 파리에서 내려온 의사 비크다지르(Vicq d’Azyr)와 군인들이 병든 소를 모두 죽여 생석회에 묻고, 값의 3분의 1을 보상한다고 한다. 우리 외양간 소가 침을 흘린다.`,[
   {l:'신고하고 살처분을 받아들인다',s:'',a:'safe',f:()=>{s.flags.peaOx=false;say('군인들이 소를 끌어내 구덩이에 묻었다. 보상금은 소 값의 3분의 1이었다.'+fx({money:-peaV(50),pol:1}))}},
   {l:'숲속에 소를 숨긴다',s:'판정',a:'bold',f:async()=>{const r=await roll(-1,{label:'숨긴 소'});if(r.v>=4)say('소가 앓다가 살아났다. 아무도 몰랐다.'+fx({cour:2}));else{s.flags.peaOx=false;say('소는 결국 죽고, 숨긴 것이 들통나 벌금까지 물었다. 이웃 외양간에도 병이 번졌다.'+fx({money:-peaV(80),soc:-4}),'dark');peaBadY()}}},
   {l:'성 안토니오에게 빌고 약초를 먹인다',s:'',a:'pious',f:async()=>{const r=await roll(-1,{label:'민간요법'});if(r.v>=5)say('기도 덕인지 소가 일어섰다.'+fx({faith:3}));else{s.flags.peaOx=false;say('소가 쓰러져 죽었다.'+fx({money:-peaV(70),faith:1}),'dark');peaBadY()}}}]),
 C('pea_wolf',()=>peas()&&peaAt('auvergne','languedoc','bretagne','vendee','bourgogne','champagne','alsace','gascogne','provence')&&peaM(11,0,1,2),.5,3,'늑대','le loup','눈 덮인 새벽, 양 우리 울타리가 부서지고 양 세 마리가 목이 물린 채 죽어 있었다. 숲 가장자리에 커다란 발자국이 이어진다.',[
   {l:'이웃과 몰이사냥(battue)을 한다',s:'의지 판정. 늑대 포상금',a:'bold social',f:async()=>{const m=md([[s.st.cour>=50,1,'의지'],[s.st.str>=50,1,'체력'],[s.sk.arms>=20,1,'총 솜씨']]);const r=await roll(m.m,{label:'늑대 사냥',why:m.why});if(r.v>=4)say(`늑대를 잡아 ${T()>=1800?'군청':'지방 감독관 사무소'}에 머리를 가져가 포상금을 받았다. 마을을 돌며 달걀과 베이컨도 얻었다.`+fx({money:15,fame:2,cour:2,rloc:4,arms:1}));else if(r.v===1)say('덤불에서 뛰쳐나온 늑대에게 팔을 물렸다. 미친 늑대가 아니기만 빌었다.'+fx({hp:-8}));else say('하루 종일 숲을 헤맸지만 그림자도 못 보았다.'+fx({hp:-1}))}},
   {l:'개를 풀고 밤새 지킨다',s:'',a:'safe',f:()=>say('가시 목걸이를 채운 개와 함께 우리 옆에서 밤을 새웠다.'+fx({hp:-2,money:-peaV(4)}))},
   {l:'손해를 감수한다',s:'',a:'safe',f:()=>say('죽은 양 가죽이라도 벗겨 팔았다.'+fx({money:-peaV(8)}))}]),
 C('pea_vet',()=>peaLand()&&peaT()>=3&&s.year>=1768,.4,3,'아픈 말','le vétérinaire',()=>`밭 가는 말이 배를 부여잡고 뒹군다. 산통이다. ${T()>=1800?'읍내에 알포르 수의학교(1765년 설립)를 나온 수의사가 있다.':'리옹과 알포르의 왕립 수의학교를 나온 ‘수의 기술자’가 군청 소재지에 산다고 한다.'} 마을에는 말발굽 장이와 접골사가 있다.`,[
   {l:'수의사를 부른다',s:'돈이 들지만 유리',a:'study',f:async()=>{say('수의사가 말을 타고 왔다.'+fx({money:-peaV(8)}));const r=await roll(1,{label:'말의 산통'});if(r.v>=3)say('관장과 약물로 말이 살아났다.'+fx({edu:1}));else say('손쓸 새 없이 말이 죽었다.'+fx({money:-peaV(40)}))}},
   {l:'말발굽 장이에게 피를 뽑게 한다',s:'',a:'safe',f:async()=>{const r=await roll(0,{label:'사혈'});if(r.v>=4)say('목에서 피를 한 동이 뽑자 말이 일어섰다.');else say('말이 쓰러져 다시 일어나지 못하였다.'+fx({money:-peaV(40)}))}},
   {l:'성 엘루아에게 빈다',s:'',a:'pious',f:async()=>{const r=await roll(-1,{label:'기도'});if(r.v>=5)say('밤새 기도하자 말이 똥을 누고 살아났다.'+fx({faith:3}));else say('말이 죽었다. 가죽 장이에게 가죽을 팔았다.'+fx({money:-peaV(35),faith:1}))}}]),
 C('pea_pig',()=>peas()&&peaM(10,11,0),.6,1,'돼지 잡는 날','la tue-cochon',()=>`도토리를 먹여 키운 돼지가 살이 올랐다. 장에 팔면 지대와 세금 낼 돈이 되고, 잡아서 소금에 절이면 한 해 식구들의 기름과 고기가 된다.${peaGG()&&T()<1790?' 다만 고기를 절일 소금은 소금 창고에서 따로 비싸게 사야 한다.':peaAt('bretagne')?' 브르타뉴는 소금세가 없어 절임 소금이 싸다.':''}`,[
   {l:'장에 내다 판다',s:'',a:'greedy',f:()=>say('돼지를 몰고 장에 가서 팔았다.'+fx({money:peaV(20)}))},
   {l:'잡아서 절인다',s:'',a:'family social',f:()=>say(`온 동네가 모여 돼지를 잡았다. 순대와 살코기를 이웃에 돌리고 나머지는 소금 통에 재웠다.`+fx({hp:3,soc:2,money:peaGG()&&T()<1790?-6:0}))}]),

 /* ---------------- 영주와 교회와 왕 ---------------- */
 C('pea_tithe',()=>peaCom()&&peaLand()&&T()<1790.8&&peaM(6,7),.6,2,'십일조','la dîme',()=>`십일조 징수원이 밭머리에서 볏단을 센다. 이 교구에서는 ${pick(['열한','열세','열다섯'])} 단에 한 단을 교회 몫으로 가져간다. 걷은 곡식은 대부분 본당 신부가 아니라 먼 수도원과 참사회의 곳간으로 간다.`,()=>{const o=[
   {l:'정직하게 낸다',s:'',a:'pious safe',f:()=>say('징수원이 볏단을 골라 수레에 실었다.'+fx({money:-peaV(10),faith:1,brl:-2}))},
   {l:'밤에 볏단 몇 개를 숨긴다',s:'판정',a:'bold greedy',f:async()=>{const r=await roll(0,{label:'볏단 숨기기'});if(r.v>=3)say('달밤에 볏단 몇 개를 곳간에 먼저 들였다.'+fx({money:-peaV(5)}));else say('징수원이 볏단 수를 맞춰 보고 고발하였다. 벌금과 소송 비용을 물었다.'+fx({money:-peaV(30),pol:2,rloc:-1,brl:3}))}}];
   if(['potato','maize'].includes(s.flags.peaSpring))o.push({l:'새 작물엔 십일조가 없다고 버틴다',s:'사교 판정',a:'radical',f:async()=>{const m=md([[s.sk.orat>=25,1,'말솜씨'],[s.st.soc>=50,1,'사교'],[s.rep.rloc>=60,1,'마을이 편을 든다']]);const r=await roll(m.m,{label:'새 작물 십일조 다툼',why:m.why});if(r.v>=4)say(`${s.flags.peaSpring==='potato'?'감자':'옥수수'}는 옛 관습에 없는 작물이라는 주장이 받아들여졌다.`+fx({money:-peaV(5),pol:2,orat:1,rloc:2,brl:3}));else say('수도원이 소송을 걸었다. 결국 새 작물에도 ‘노발’ 십일조를 물게 되었다.'+fx({money:-peaV(20),pol:3,brl:4}))}});
   return o}),
 C('pea_champart',()=>peaCom()&&peaLand()&&peaFeud()&&!peaAt('bretagne')&&peaM(6,7),.5,2,'영주의 몫','le champart',`영주의 소작료 징수인이 와서 열두 단에 한 단(champart)을 골라 가기 전에는 제 볏단을 실어 갈 수 없다. 징수인은 사흘째 오지 않고, 하늘엔 비구름이 몰려온다.`,[
   {l:'징수인을 기다린다',s:'날씨 판정',a:'safe',f:async()=>{const r=await roll(peaBad()?-1:0,{label:'기다림'});if(r.v>=3)say('나흘째 징수인이 와서 볏단을 골라 갔다.');else say('기다리는 사이 비가 쏟아져 볏단에서 싹이 텄다.'+fx({money:-peaV(15),pol:3,bor:3}))}},
   {l:'영주 몫만 남기고 제 볏단을 실어 간다',s:'판정',a:'bold radical',f:async()=>{const r=await roll(0,{label:'먼저 실어 가기'});if(r.v>=4)say('영주 몫 볏단을 밭에 세워 두고 나머지를 들였다. 징수인은 투덜대고 말았다.'+fx({pol:2,bor:2,rloc:1}));else say('영주 재판소에 불려 가 벌금을 물었다.'+fx({money:-peaV(20),pol:4,bor:4})+peaRF(peaRel('경쟁자',peaLord(),{v:'vord',inf:40,riv:55}),{riv:6}))}},
   {l:'징수인에게 닭 두 마리를 보낸다',s:'',a:'social',f:()=>say('닭을 받은 징수인이 그날로 달려왔다.'+fx({money:-3,soc:1}))}]),
 C('pea_mill',()=>peaCom()&&T()<1790,.5,3,'영주의 방앗간','le moulin banal','영주의 방앗간(moulin banal) 말고는 곡식을 빻을 수 없다. 방앗간지기는 열여섯 말에 한 말이라는 삯보다 더 떼어 간다는 소문이다. 오늘도 밀가루 자루가 가벼워 보인다.',[
   {l:'제 저울로 달아 따진다',s:'사교 판정',a:'bold',f:async()=>{const m=md([[s.st.soc>=50,1,'말솜씨'],[s.st.str>=55,1,'덩치'],[s.rep.rloc>=60,1,'이웃들이 거든다']]);const r=await roll(m.m,{label:'방앗간 시비',why:m.why});if(r.v>=4)say('방앗간지기가 얼굴을 붉히며 가루를 한 바가지 더 퍼 주었다.'+fx({rloc:2,pol:1,bor:2}));else say('방앗간지기는 다음번엔 일주일을 기다리게 하였다.'+fx({pol:2,hp:-1}))}},
   {l:'몰래 이웃 교구 방앗간에 간다',s:'판정',a:'bold greedy',f:async()=>{const r=await roll(0,{label:'몰래 빻기'});if(r.v>=3)say('강 건너 방앗간에서 제대로 빻아 왔다.'+fx({money:3}));else say('영주의 방앗간지기에게 들켜 밀가루와 나귀를 압수당하고 벌금을 물었다.'+fx({money:-peaV(15),pol:4}))}},
   {l:'참는다',s:'',a:'safe',f:()=>say('도둑 방앗간지기라는 노래를 흥얼거리며 가벼운 자루를 메고 왔다.'+fx({pol:1}))}]),
 C('pea_corvee',()=>peaCom()&&isM()&&s.age<=60&&T()<1787.4&&!peaYr(1775.95,1776.5)&&peaM(2,3,8,9),.5,2,'왕의 길 부역','la corvée royale','지방 감독관의 명으로 왕의 길(grand chemin)을 닦는 부역에 나오라는 통지가 왔다. 한 해 엿새에서 열흘, 소와 수레가 있는 집은 수레까지 내야 한다. 하필 밭갈이 철이다.',[
   {l:'직접 나간다',s:'',a:'safe',f:()=>say('삽과 곡괭이를 메고 길 공사장에 나갔다. 측량 기사가 말 위에서 고함을 질렀다.'+fx({hp:-3,pol:1,str:1,bpw:2}))},
   {l:'품을 사서 대신 보낸다',s:'',a:'greedy',f:()=>say('날품팔이 하나에게 품삯을 주어 대신 보냈다.'+fx({money:-peaV(8)}))},
   {l:'나가지 않는다',s:'판정',a:'bold radical',f:async()=>{const r=await roll(0,{label:'부역 회피'});if(r.v>=4)say('바쁜 철이라 공사 감독도 눈감아 주었다.');else say('기마경찰대(maréchaussée)가 와서 벌금을 물리고 다음 부역을 갑절로 매겼다.'+fx({money:-peaV(15),pol:3,hp:-2,bpw:3}))}}]),
 C('pea_collect',()=>peaCom()&&isM()&&s.age>=25&&peaT()>=2&&T()<1790.8&&!peaAt('provence','languedoc')&&!s.flags.peaCollector,.4,99,'타유세 징수인','collecteur de la taille','올해 마을의 타유세(taille) 징수인으로 뽑혔다. 돌아가며 맡는 자리지만, 다 걷지 못하면 모자라는 돈을 징수인이 제 재산으로 채워야 하고, 감옥에 갇히기도 한다.',[
   {l:'이웃을 닦달해 다 걷는다',s:'',a:'greedy',f:()=>{s.flags.peaCollector=1;say('과부의 냄비와 가난한 집 침대 이불까지 압류하여 기한 안에 다 걷었다. 마을 사람들이 등을 돌렸다.'+fx({soc:-2,rloc:-8,pol:-1}))}},
   {l:'가난한 집은 사정을 봐준다',s:'',a:'pious social',f:()=>{s.flags.peaCollector=1;say('모자라는 돈을 제 주머니에서 채웠다.'+fx({money:-peaV(30),soc:1,rloc:6,faith:1}))}},
   {l:'선물을 써서 빠진다',s:'사교 판정',a:'bold',f:async()=>{const r=await roll(s.st.soc>=50?1:0,{label:'징수인 면제'});if(r.v>=4){s.flags.peaCollector=1;say('지방 관리에게 버터와 닭을 보내 다른 사람으로 바꾸게 하였다.'+fx({money:-peaV(8),soc:-1}))}else{s.flags.peaCollector=1;say('뇌물은 받고 자리는 그대로였다. 결국 모자라는 돈을 채웠다.'+fx({money:-peaV(35)}))}}}]),
 C('pea_assess',()=>peaCom()&&peaLand()&&T()<1790.8&&!peaAt('provence','languedoc')&&peaM(11,0,1),.4,3,'세금 할당','la taille arbitraire','마을 할당인들이 우리 집 타유세를 크게 올렸다. 지난봄 젖소를 들이고 지붕을 새로 이은 것을 보았다는 것이다. 그래서 다들 일부러 집을 허름하게 둔다.',[
   {l:'감면 청원을 낸다',s:'학식·사교 판정',a:'study',f:async()=>{const m=md([[lit(),1,'글을 앎'],[s.sk.pen>=30,1,'문서 솜씨'],[s.rep.rloc>=60,1,'마을 유지들의 보증']]);const r=await roll(m.m,{label:'감면 청원',why:m.why});if(r.v>=4)say(`${lit()?'직접 쓴':'대서인에게 맡긴'} 청원이 받아들여져 세액이 깎였다.`+fx({money:-peaV(4),edu:1,pen:lit()?1:0}));else say('청원은 묵살되었다. 대서료만 날렸다.'+fx({money:-peaV(18)}))}},
   {l:'젖소를 팔고 일부러 허름하게 산다',s:'',a:'safe',f:()=>say('젖소를 팔고 깨진 창을 그대로 두었다. 이듬해 세액이 줄었다.'+fx({money:-peaV(4),hp:-1}))},
   {l:'그대로 낸다',s:'',a:'safe',f:()=>say('세리에게 돈을 셈해 주었다.'+fx({money:-peaV(15),pol:1}))}]),
 C('pea_gabelle',()=>peaCom()&&T()<1790&&(peaGG()||peaAt('provence','languedoc')),.5,3,'소금세 순찰','les gabelous',()=>peaGG()?'소금세 순찰원(gabelous)들이 들이닥쳤다. 이 대염세 지방에서는 집집마다 ‘의무 소금(sel du devoir)’을 해마다 정해진 만큼 비싼 값에 사야 한다. 순찰원들이 찬장과 절임 통을 뒤지며 밀매 소금을 찾는다. 시장에서 싸게 산 소금 한 봉지가 부엌에 있다.':'소금세 순찰원들이 마을을 돈다. 이 지방은 소금세가 가벼운 편이지만, 밀매 소금은 여전히 범죄다. 부엌에 출처 모를 소금 한 봉지가 있다.',[
   {l:'뒤지게 둔다',s:'판정',a:'safe',f:async()=>{const r=await roll(0,{label:'소금 수색'});if(r.v>=3)say('소금 봉지는 밀가루 통 바닥에 묻혀 있었다. 순찰원들은 빈손으로 나갔다.');else say('밀매 소금이 발각되었다. 벌금 수백 리브르를 물 수 없어 가구를 압류당했다.'+fx({money:-peaV(60),pol:4}),'dark')}},
   {l:'순찰원에게 돈을 쥐여 준다',s:'',a:'greedy',f:()=>say('순찰대장에게 은화를 쥐여 주자 수색이 건성으로 끝났다.'+fx({money:-peaV(10)}))},
   {l:'문을 막아선다',s:'의지 판정',a:'bold radical',f:async()=>{const m=md([[s.st.cour>=50,1,'의지'],[s.st.cour<50,-1,'겁이 남'],[s.st.str>=55,1,'완력'],[s.rep.rloc>=60,1,'이웃들이 달려옴']]);const r=await roll(m.m,{label:'저항',why:m.why});if(r.v>=4)say('이웃들이 쇠스랑을 들고 몰려나오자 순찰원들이 물러갔다.'+fx({pol:4,cour:3,rloc:4,bpw:3}));else say('순찰원 폭행 혐의로 붙잡혀 몇 주를 감옥에서 보냈다.'+fx({hp:-6,money:-peaV(30),pol:5}),'dark')}}]),
 C('pea_cens',()=>peaCom()&&peaLand()&&pre89()&&s.year>=1765,.4,5,'토지 대장 갱신','la réaction seigneuriale','영주가 고용한 봉건법 전문가(feudiste)가 낡은 토지 대장(terrier)을 들고 왔다. 백 년 동안 잊혔던 공조와 밀린 지대를 되살려 받겠다고 한다. 마을 사람 여럿이 함께 소송을 하자고 한다.',()=>[
   {l:'밀린 지대를 낸다',s:'',a:'safe',f:()=>say('잊혔던 닭 공조와 귀리 몇 말에, 밀린 몫까지 셈하여 바쳤다.'+fx({money:-peaV(25),pol:2,bor:2}))},
   {l:'마을 소송에 돈을 보탠다',s:'사교 판정',a:'social radical',f:async()=>{say('마을이 바이아주 재판소에 소장을 냈다.'+fx({money:-peaV(10)}));const m=md([[s.sk.orat>=25,1,'회의에서의 말솜씨'],[s.rep.rloc>=60,1,'이웃의 신망'],[s.st.soc>=50,1,'사교']]);const r=await roll(m.m,{label:'마을 소송',why:m.why});if(r.v>=4)say('재판소가 옛 공조의 증빙이 모자란다며 마을 손을 들어 주었다.'+fx({rloc:5,orat:1,pol:3,bor:3})+peaRF(peaRel('경쟁자',peaLord(),{v:'vord',inf:40,riv:55}),{riv:8}));else say('소송에 졌다. 비용까지 물어야 했다.'+fx({money:-peaV(25),pol:5,bor:4}))}},
   {l:'원본 문서를 보여 달라고 버틴다',s:'학식 판정',a:'study bold',dis:!lit(),f:async()=>{const r=await roll(s.st.edu>=40?1:0,{label:'문서 대조'});if(r.v>=4)say('토지 대장의 경계가 지금 밭과 다르다는 것을 찾아냈다. 우리 밭은 빠졌다.'+fx({edu:2,pol:2}));else say('라틴어와 옛 글씨를 읽어 낼 수 없었다.'+fx({money:-peaV(15)}))}}]),
 C('pea_hunt',()=>peaCom()&&pre89()&&peaAt('ile','champagne','picardie','bourgogne'),.4,3,'영주의 사냥감','les capitaineries',()=>`${peaAt('ile')?'왕실 사냥 관할구(capitainerie)':'영주의 사냥터'} 안에서는 밭에 울타리를 칠 수도, 사냥감을 쫓을 수도 없다. 밤마다 사슴과 멧돼지 떼가 밀밭을 짓밟는다.`,[
   {l:'손해 배상을 청원한다',s:'판정',a:'safe',f:async()=>{const r=await roll(0,{label:'배상 청원'});if(r.v>=5)say('사냥 관리관이 몇 리브르를 내주었다.'+fx({money:8}));else say('청원은 사냥 관리관 책상 서랍에 처박혔다.'+fx({pol:2,money:-peaV(8)}))}},
   {l:'밤에 사슴을 잡는다',s:'의지 판정',a:'bold radical',f:async()=>{const m=md([[s.st.str>=50,1,'체력'],[s.sk.arms>=20,1,'덫과 총 솜씨'],[s.rep.rloc<35,-1,'고발할 이웃이 있다']]);const r=await roll(m.m,{label:'밤 사냥',why:m.why});if(r.v>=4)say('사슴을 잡아 숲속에서 해체하고 고기를 나누었다.'+fx({hp:2,pol:3,rloc:2,bor:2}));else say('사냥터 지기에게 붙잡혀 사냥 재판에 넘겨졌다. 벌금에 칼을 쓰고 장터에 섰다.'+fx({money:-peaV(30),hp:-3,soc:-2,pol:5}),'dark')}},
   {l:'허수아비를 세우고 참는다',s:'',a:'safe',f:()=>say('밤새 냄비를 두드리며 사슴을 쫓았다.'+fx({hp:-2,pol:2,money:-peaV(5)}))}]),
 C('pea_rachat',()=>peaCom()&&peaLand()&&peaYr(1790.2,1793.35)&&!s.flags.peaRachat,.6,99,'공조 되사기','le rachat des droits',`1790년 5월 법령에 따르면 영주의 지대와 소작료는 돈을 내야 없앨 수 있다. 돈으로 내는 지대는 스무 해 치, 현물 소작료는 스물다섯 해 치를 한꺼번에 치러야 한다. 영주의 관리인이 셈을 들고 왔다.`,[
   {l:'돈을 치르고 되산다',s:'땅이 온전히 내 것이 된다',a:'safe royal',f:()=>{s.flags.peaRachat='paid';say('공증인 앞에서 몇 해 모은 돈을 치르고 되사기 증서를 받았다.'+fx({money:-peaV(90),pol:-1}))}},
   {l:'기다린다',s:'',a:'safe',f:()=>{s.flags.peaRachat='wait';say('마을 누구도 되사지 않았다. 다들 더 좋은 법을 기다린다.'+fx({pol:2}))}},
   {l:'아예 내지 않는다',s:'판정',a:'bold radical',f:async()=>{s.flags.peaRachat='refuse';const r=await roll(0,{label:'공조 거부'});if(r.v>=3)say('온 마을이 소작료를 거부하였다. 관리인은 다시 오지 않았다.'+fx({pol:5,bor:4,rloc:2}));else say('국민방위대가 와서 밀린 소작료를 받아 갔다.'+fx({money:-peaV(25),pol:6,bor:3,bpw:2}))}}]),
 C('pea_bn',()=>peaCom()&&peaYr(1790.9,1797)&&s.money>=120,.6,3,'국유재산 경매','vente des biens nationaux',()=>`구청에서 ${T()>=1793?'망명 귀족과 ':''}수도원의 땅을 경매한다. 작은 덩이로 쪼개 팔고, 값은 열두 해에 나누어 낼 수 있다. ${T()<1793.3?'이웃 몇이 돈을 모아 함께 사자고 한다.':''} 선서를 거부한 신부는 교회 땅을 사는 자는 지옥에 간다고 했다.`,()=>{const a=Math.max(120,Math.round(s.money*.35));const o=[
   {l:'혼자 입찰한다',s:`재산 -${fmt(a)}`,a:'greedy radical',f:async()=>{const r=await roll(0,{label:'경매'});if(r.v>=3){s.money-=a;s.land+=Math.round(a*.07);say(`수도원 포도밭 한 자락을 ${fmt(a)} ${money()}에 낙찰받았다. 연 지대 +${fmt(Math.round(a*.07))}.`+fx({pol:4,faith:-2}),'big');peaGood()}else say('읍내 상인과 공증인이 값을 끝없이 올려 놓쳤다.'+fx({pol:2}))}}];
   if(T()<1793.3)o.push({l:'이웃들과 돈을 모은다',s:'',a:'social radical',f:()=>{const b=Math.round(a*.5);s.money-=b;s.land+=Math.round(b*.07);say(`이웃 여섯과 함께 낙찰받아 땅을 나누었다. 연 지대 +${fmt(Math.round(b*.07))}.`+fx({soc:3,pol:3,faith:-1}))}});
   o.push({l:'사지 않는다',s:'',a:'pious safe',f:()=>say('도둑맞은 하느님의 땅이라며 손대지 않았다.'+fx({faith:2,pol:-2}))});return o}),
 C('pea_hoard',()=>peaLand()&&peaYr(1793.6,1794.9),.7,1,'곡물 징발','le Maximum',`최고가격령(Maximum)이 내렸다. 구청의 징발 위원이 곳간의 곡식을 신고하라고 한다. 공정 가격은 시세의 절반도 안 되고, 숨기다 들키면 매점꾼으로 혁명재판에 넘겨진다.`,[
   {l:'정직하게 신고한다',s:'',a:'safe radical',f:()=>say('곡식을 신고하고 공정 가격에 군대 몫을 넘겼다.'+fx({money:-peaV(20),pol:2,bpw:-2}))},
   {l:'마룻바닥 밑에 숨긴다',s:'판정',a:'bold greedy',f:async()=>{const r=await roll(0,{label:'곡식 숨기기'});if(r.v>=3)say('곡식 자루를 마룻바닥 밑과 거름 더미 속에 묻었다.'+fx({money:peaV(10),bpw:2}));else say('혁명군(armée révolutionnaire) 분견대가 들이닥쳐 숨긴 곡식을 찾아냈다.'+fx({money:-peaV(30),sus:15,pol:-3}),'dark')}},
   {l:'밤에 도시 사람들에게 웃돈 받고 판다',s:'',a:'greedy',f:()=>say('밤에 찾아온 도시 아낙들에게 시세대로 팔았다.'+fx({money:peaV(25),sus:8}))}]),
 C('pea_assignat',()=>peas()&&peaYr(1795,1796.2),.6,99,'휴지가 된 지폐','les assignats',()=>`몇 해 전 곡식을 꾸어 간 이웃이 아시냐 지폐 다발로 빚을 갚겠다고 한다. 법으로는 지폐를 거절할 수 없다. 그러나 지폐 값은 이제 정화의 ${Math.max(1,Math.round(econ().cur*100))}%도 안 되어, 백 리브르로 빵 몇 덩이도 못 산다.`,[
   {l:'지폐를 받는다',s:'',a:'safe',f:()=>say('지폐 다발을 받았다. 그날로 값이 또 떨어졌다.'+fx({money:-Math.round(peaV(15)*(1-econ().cur)),pol:1,rloc:1}))},
   {l:'곡식으로 갚으라고 버틴다',s:'사교 판정',a:'bold',f:async()=>{const m=md([[s.st.soc>=45,1,'사교'],[s.sk.trade>=30,1,'셈이 밝음'],[s.rep.rloc>=60,1,'이웃들이 편을 든다']]);const r=await roll(m.m,{label:'빚 다툼',why:m.why});if(r.v>=4)say('결국 호밀 몇 말로 받아 냈다.'+fx({money:peaV(8)}));else say('이웃이 치안판사에게 가서 지폐로 갚았다는 증서를 받아 갔다. 원수가 되었다.'+fx({money:-peaV(15),rloc:-3}))}}]),

 /* ---------------- 빚과 땅 ---------------- */
 C('pea_borrow',()=>peaLand()&&!s.flags.peaDebt&&s.money<peaV(40)&&peaM(2,3,4),.6,2,'빚','emprunt',()=>`지대 낼 날과 씨앗 살 날이 겹쳤다. 돈 나올 데는 셋이다. 공증인을 통한 연 5푼짜리 정기 이자 증서(rente constituée), 이자가 곱절인 방앗간지기, 그리고 ${T()>=1800?'읍내 고리대금업자':'마을의 부농'}.`,[
   {l:'공증인을 통해 빌린다',s:'이자가 싸지만 땅을 잡힌다',a:'safe',f:()=>{const a=peaV(40);s.flags.peaDebt={a:Math.round(a*1.05),y:s.year,land:1};say('밭을 담보로 잡히고 공증인 앞에서 증서에 서명하였다.'+fx({money:a}))}},
   {l:'방앗간지기에게 빌린다',s:'이자가 비싸다',a:'greedy',f:()=>{const a=peaV(40);s.flags.peaDebt={a:Math.round(a*1.3),y:s.year};say('방앗간지기가 장부에 십자 표시를 받고 돈을 내주었다.'+fx({money:a}))}},
   {l:'허리띠를 졸라맨다',s:'',a:'safe',f:()=>say('빚 대신 끼니를 줄였다.'+fx({hp:-3}))}]),
 C('pea_debt',()=>peas()&&s.flags.peaDebt&&(s.flags.peaDebt.n||0)<=s.year&&peaM(9,10,11),1.4,0,'성 마르탱의 빚','la Saint-Martin',()=>`성 마르탱 축일(11월 11일)이다. 빚 ${fmt(s.flags.peaDebt.a)} ${money()}의 기한이 돌아왔다.`,()=>{const d=s.flags.peaDebt;const o=[
   {l:'갚는다',s:`재산 -${fmt(d.a)}`,a:'safe',dis:s.money<d.a,f:()=>{s.flags.peaDebt=null;say('빚을 다 갚고 증서를 돌려받아 아궁이에 넣었다.'+fx({money:-d.a,soc:1}))}},
   {l:'기한을 늘려 달라고 빈다',s:'사교 판정',a:'social',f:async()=>{const m=md([[s.st.soc>=50,1,'사교'],[s.rep.rloc>=60,1,'성실하다는 평판'],[s.rep.rloc<35,-1,'믿을 수 없다는 평판'],[econ().price>=1.3,-1,'빚쟁이도 곡식이 귀한 해']]);const r=await roll(m.m,{label:'빚 연장',why:m.why});if(r.v>=4){d.a=Math.round(d.a*1.1);d.n=s.year+1;say('한 해를 더 받았다. 이자는 불었다.')}else{s.flags.peaDebt=null;if(s.land>0||peaT()>=3){peaBadY(2);say('빚쟁이가 집달리를 데리고 와서 가축과 농기구를 압류하였다.'+fx({money:-Math.round(d.a*.6),soc:-3}),'dark')}else say('빚쟁이가 냄비와 이불을 가져갔다.'+fx({money:-Math.round(d.a*.5),hp:-2}),'dark')}}}];
   if(s.land>0)o.push({l:'밭 한 뙈기를 판다',s:'땅이 줄어든다',a:'safe',f:()=>{s.flags.peaDebt=null;const l=Math.round(s.land*.4);s.land-=l;say(`밭 한 뙈기를 공증인 앞에서 넘겨주고 빚을 지웠다. 연 지대 -${fmt(l)}.`+fx({money:Math.max(0,l*20-d.a)}),'big')}});
   if(econ().cur<.5)o.push({l:'아시냐 지폐로 갚는다',s:'법은 막지 못하지만 빚쟁이는 이를 간다',a:'greedy',f:()=>{s.flags.peaDebt=null;say('휴지 같은 지폐 다발을 공증인 앞에 내밀었다. 법정 통화라 빚쟁이는 받을 수밖에 없었다. 이웃들은 그대를 다시 보았다.'+fx({money:-Math.max(1,Math.round(d.a*econ().cur*4)),rloc:-4,vjus:-2}))}});
   else if(econ().price>=1.3)o.push({l:'곡식으로 갚겠다고 한다',s:'곡식값이 비싼 해라 빚쟁이가 반긴다',a:'safe',f:()=>{s.flags.peaDebt=null;s.flags.peaFood=0;say('다락의 곡식 자루를 내주고 빚을 지웠다. 보릿고개가 걱정이다.'+fx({money:-Math.round(d.a*.7),rloc:1}))}});
   return o}),
 C('pea_plot',()=>peaFarm()&&peaT()<=4&&s.money>=180,.5,3,'밭 한 뙈기','achat d’un lopin',()=>`${pick(['홀아비가 된','빚에 몰린','도시로 떠나는'])} 이웃이 마을 어귀 밭 한 뙈기를 판다고 한다. 땅을 사는 것은 모든 농부의 꿈이다.${T()<1790?' 땅을 사면 영주에게 거래세(lods et ventes)로 값의 열두에 하나를 따로 바쳐야 한다.':''}`,()=>{const a=Math.min(600,Math.max(180,Math.round(s.money*.4)));const lods=T()<1790?Math.round(a/12):0;return [
   {l:'산다',s:`재산 -${fmt(a+lods)}`,a:'greedy family',f:()=>{s.money-=a+lods;const g=Math.round(a*.05);s.land+=g;say(`공증인 앞에서 땅값${lods?'과 영주의 거래세':''}를 치르고 땅문서를 받았다. 연 지대 +${fmt(g)}.`+fx({soc:1}),'big');peaGood()}},
   {l:'아직 이르다',s:'',a:'safe',f:()=>say('부농 집 아들이 그 밭을 샀다.')}]}),
 C('pea_promo',()=>peaFarm()&&(s.flags.peaGood||0)>=2&&!!peaNext()&&meets(peaNext()),1.4,2,'살림이 피다','une bonne passe',()=>({
   f2:'몇 해 부지런히 품을 판 것을 눈여겨본 지주의 관리인이 비어 있는 메테리(소작 농장)를 맡아 보라고 한다. 수확의 절반과 가축 이익의 절반을 지주에게 바치는 조건이다.',
   f3:'몇 해 모은 돈이면 쟁기와 소 한 겨리를 사고 밭을 늘려, 남의 땅이 아닌 제 땅을 가는 자영농(laboureur)이 될 수 있다.',
   f4:`${T()<1790?'수도원 소유의':'부재지주의'} 큰 농장 임차인을 구한다. 아홉 해 계약, 지대는 돈으로 내고 일꾼 수십을 부린다. 보증금이 크다.`,
   f5:'땅에서 나오는 지대만으로 살 만해졌다. 쟁기에서 손을 떼고 소작인들에게 땅을 맡긴 채 지주로 살 수 있다.'})[peaNext().id],()=>[
   {l:'붙잡는다',s:needText(peaNext())||'',a:'bold greedy work',f:()=>{if(!peaUp('몇 해 풍작 끝에 '))say('막상 셈해 보니 아직 모자랐다.')}},
   {l:'지금 살림을 지킨다',s:'',a:'safe',f:()=>{s.flags.peaGood=1;say('욕심을 접었다. 하던 대로 땅을 갈았다.')}}]),
 C('pea_ruin',()=>peaLand()&&(s.flags.peaBad||0)>=2&&s.money<peaV(60),1.4,3,'몰락','la ruine',()=>`흉작이 거듭되었다. 지대도, 세금도, 빚도 밀렸다. ${s.job==='f2'?'지주의 관리인이 소작 계약을 끝내겠다고 통보하였다.':'빚쟁이들이 땅을 넘기라고 한다.'}`,()=>{const o=[];
   if(s.land>0)o.push({l:'땅 절반을 팔아 버틴다',s:'땅이 줄어든다',a:'safe',f:()=>{const l=Math.round(s.land*.5);s.land-=l;s.flags.peaBad=0;say(`조상 대대의 밭 절반을 넘겼다. 연 지대 -${fmt(l)}.`+fx({money:l*15,soc:-2}),'big')}});
   o.push({l:'모든 것을 넘기고 날품팔이로 나선다',s:'날품팔이로 떨어진다',a:'safe',f:()=>{peaDown('쟁기와 소를 넘기고 ',.3);say('남의 밭에서 품을 팔아 살게 되었다.'+fx({soc:-3,hp:-2}),'dark')}});
   o.push({l:'한 해만 더 버텨 본다',s:'판정',a:'bold',f:async()=>{const r=await roll(0,{label:'버티기'});if(r.v>=4){s.flags.peaBad=0;say('친척에게 돈을 꾸어 겨우 한 해를 넘겼다.'+fx({soc:-1}))}else{peaDown('끝내 빚에 밀려 ',.3);say('집달리가 가재도구까지 경매에 부쳤다.'+fx({hp:-3}),'dark')}}});return o}),
 C('pea_metayage',()=>s.job==='f2'&&peas()&&peaM(8,9,10),.6,3,'소작 계약 갱신','le bail à mi-fruits',`성 미카엘 축일(9월 29일), 소작 계약을 다시 쓸 때다. 수확도 가축 이익도 지주와 반씩 나눈다. 지주의 관리인은 이번에 거세한 수탉 여섯 마리와 짐 나르기 부역 열흘을 더 얹겠다고 한다.`,()=>{const o=[
   {l:'그대로 받아들인다',s:'',a:'safe',f:()=>say('관리인이 내미는 계약서에 십자 표시를 하였다.'+fx({money:-peaV(8),pol:1}))},
   {l:'조건을 따진다',s:'사교 판정',a:'bold',f:async()=>{const r=await roll(s.st.soc>=50?1:0,{label:'계약 흥정'});if(r.v>=4)say('수탉은 둘로 줄고 부역은 빠졌다. 관리인은 좋은 소작인을 잃기 싫었다.'+fx({soc:2}));else if(r.v===1){loseJob('관리인이 다른 소작인을 들였다. %에서 쫓겨났다.');takeJob('f1','짐을 꾸려 마을 어귀 오두막으로 옮겨 ')}else say('결국 관리인 뜻대로 되었다.'+fx({money:-peaV(10)}))}}];
   if(meets(POST.f3))o.push({l:'떠나서 제 땅을 장만한다',s:needText(POST.f3),a:'bold greedy',f:()=>takeJob('f3','소작을 그만두고 소 한 겨리와 밭을 사서 ')});return o}),
 C('pea_lease',()=>s.job==='f4'&&peas()&&peaM(8,9,10),.6,4,'임대 계약 갱신','le renouvellement du bail',()=>`아홉 해 임대 계약이 끝난다. 지주가 지대를 3분의 1 올리겠다고 한다. 이웃 군의 대농 하나가 더 높은 값을 부르며 이 농장을 노린다는 소문이다.${peaAt('picardie')?' 피카르디에는 쫓겨난 임차인의 편을 들어 새 임차인을 위협하는 ‘나쁜 뜻(mauvais gré)’의 관습이 있다.':''}`,()=>{const o=[
   {l:'올린 지대를 받아들인다',s:'',a:'safe',f:()=>say('새 계약서에 서명하였다. 밀값이 오르기만 빌었다.'+fx({money:-peaV(25)}))},
   {l:'지주와 흥정한다',s:'사교 판정',a:'social',f:async()=>{const r=await roll(s.st.soc>=55?1:0,{label:'임대 흥정'});if(r.v>=4)say('지대를 조금만 올리는 데 합의하였다.'+fx({money:-peaV(8),soc:2}));else if(r.v===1){peaSet('f3','농장을 경쟁자에게 빼앗기고 제 땅만 가는 ');}else say('지주는 한 푼도 깎아 주지 않았다.'+fx({money:-peaV(30)}))}}];
   if(peaAt('picardie'))o.push({l:'경쟁자에게 ‘나쁜 뜻’을 보낸다',s:'협박. 위험',a:'bold',f:async()=>{const r=await roll(0,{label:'나쁜 뜻'});if(r.v>=4)say('경쟁자의 곳간 문에 협박장이 붙고 그는 물러났다. 계약은 옛 조건대로 이어졌다.'+fx({sus:4,cour:2}));else say('경쟁자의 양이 독살되자 의심이 우리에게 쏠렸다. 재판 비용과 벌금을 물었다.'+fx({money:-peaV(40),soc:-4,sus:8}),'dark')}});
   return o}),
 C('pea_tenant',()=>peas()&&(s.job==='f4'||s.job==='f5')&&peaM(9,10,11),.5,3,'지대를 못 내는 소작인','le fermier insolvable',()=>`소작인 ${jo(person(),'이','가')} 흉년이라 올해 지대를 못 내겠다며 모자를 쥐고 서 있다. 식구가 일곱이다.`,[
   {l:'내쫓고 새 소작인을 들인다',s:'',a:'greedy',f:()=>say('집달리를 보내 가축을 압류하였다. 마을에 원망이 퍼졌다.'+fx({money:peaV(10),soc:-1,rloc:-6,pol:-2,sus:rev()?4:0}))},
   {l:'한 해 미루어 준다',s:'',a:'pious social',f:()=>say('한 해 지대를 미루어 주었다.'+fx({money:-peaV(10),soc:1,rloc:5,faith:2}))},
   {l:'절반만 받는다',s:'',a:'safe',f:()=>say('지대 절반을 받고 나머지는 탕감하였다.'+fx({money:-peaV(5),soc:1}))}]),
 C('pea_partage',()=>peaLand()&&T()>=1804&&kidsAlive().filter(k=>s.year-k.y>=15).length>=2,.4,99,'유산 나누기','le partage égal',`나폴레옹 민법전은 자식들에게 땅을 똑같이 나누라고 한다. 이대로 나누면 밭이 손바닥만 해진다. 공증인은 재산의 일부(quotité disponible)는 마음대로 줄 수 있다고 귀띔한다.`,[
   {l:'맏이에게 몰아주고 동생들에겐 돈으로',s:'',a:'family greedy',f:()=>say('공증인과 함께 맏이에게 농장을 몰아주는 유언장을 썼다. 동생들이 이를 갈았다.'+fx({money:-peaV(10),soc:-2}))},
   {l:'법대로 똑같이 나눈다',s:'',a:'safe',f:()=>say('밭을 이랑 단위로 갈라 자식들 몫을 정하였다.'+fx({soc:2}))},
   {l:'작은아이들을 도시로 보낸다',s:'',a:'bold',f:()=>say('둘째는 읍내 장인 밑으로 보내고 땅은 맏이에게 남겼다.'+fx({money:-peaV(5)}))}]),

 /* ---------------- 마을 ---------------- */
 C('pea_communal',()=>peas()&&!noble(),.5,5,'공유지 회의','l’assemblée des habitants',()=>peaYr(1793.4,1796)?'1793년 6월 법에 따라 마을 공유지(communaux)를 주민 머릿수대로 나눌지 투표한다. 가난한 이는 손바닥만 한 땅이라도 갖게 되고, 가축 많은 부농은 방목지를 잃는다.':pre89()?'영주가 마을 공유 목초지의 3분의 1을 떼어 가겠다며 ‘3분할(triage)’을 요구하였다. 일요일 미사 뒤 교회 앞에서 주민 회의가 열렸다.':'마을 의회가 빚을 갚으려고 공유 목초지를 경매에 부치겠다고 한다. 땅 없는 이들은 거위 한 마리 풀 뜯길 곳이 없어진다.',()=>{const poor=peaT()<=2;return [
   {l:peaYr(1793.4,1796)&&poor?'머릿수대로 나누자고 한다':'공유지를 지키자고 목소리를 높인다',s:'사교 판정',a:'social radical',f:async()=>{const m=md([[s.sk.orat>=25,1,'말솜씨'],[s.rep.rloc>=60,1,'이웃의 신망'],[s.st.soc>=50,1,'사교'],[s.rep.rloc<35,-1,'평판이 나쁨']]);const r=await roll(m.m,{label:'주민 회의',why:m.why});if(r.v>=4){if(peaYr(1793.4,1796)&&poor){s.land+=3;say('공유지가 머릿수대로 나뉘었다. 손바닥만 한 밭이 생겼다. 연 지대 +3.'+fx({pol:3,orat:1,rloc:3,bor:3}))}else say('회의가 뜻대로 정해졌다. 공유지가 지켜졌다.'+fx({orat:2,rloc:4,pol:2,bpw:2,bor:pre89()?3:0})+(pre89()?peaRF(peaRel('경쟁자',peaLord(),{v:'vord',inf:40,riv:55}),{riv:6}):''))}else say('부농들과 마을 유지들이 뜻대로 밀어붙였다.'+fx({pol:3,orat:1}))}},
   {l:'유력자들 편에 선다',s:'',a:'royal greedy',f:()=>say('유지들 편에 섰다. 땅 없는 이웃들이 등을 돌렸다.'+fx({rloc:-5,money:peaT()>=3?peaV(8):0,pol:-2,bor:-2}))},
   {l:'말없이 듣기만 한다',s:'',a:'safe',f:()=>say('뒷줄에서 모자를 만지작거리며 듣기만 하였다.')}]}),
 C('pea_enclose',()=>peas()&&((pre89()&&s.year>=1767&&peaAt('champagne','bourgogne','alsace','gascogne'))||T()>=1791.75),.4,5,'울타리','la clôture',()=>`${pre89()?'울타리 칙령(édit des clôtures)이 내리자':'1791년 농촌법이 울타리를 칠 자유를 주자'} 이웃 부농이 제 밭에 도랑을 파고 산울타리를 둘렀다. 추수가 끝나면 온 마을 가축이 그루터기를 뜯던 밭이다.`,()=>[
   {l:'밤에 이웃들과 울타리를 뽑는다',s:'의지 판정',a:'bold radical',f:async()=>{const m=md([[s.st.str>=50,1,'힘'],[s.rep.rloc>=60,1,'이웃들이 입을 다문다']]);const r=await roll(m.m,{label:'울타리 뽑기',why:m.why});if(r.v>=4)say('하룻밤 새 울타리가 사라졌다. 누가 했는지 아무도 입을 열지 않았다.'+fx({pol:3,cour:2,rloc:3}));else say('기마경찰대가 주동자를 찾는다며 마을을 뒤졌다. 벌금을 물었다.'+fx({money:-peaV(20),sus:5,pol:3}))}},
   {l:'관습을 들어 소송을 건다',s:'',a:'study',f:()=>say('재판은 해를 넘기며 늘어졌다.'+fx({money:-peaV(12),edu:1}))},
   {l:'우리도 울타리를 친다',s:'',a:'greedy',dis:peaT()<3,f:()=>say('제 밭에도 울타리를 둘렀다. 가축이 늘었다.'+fx({money:peaV(10),rloc:-4}))},
   {l:'받아들인다',s:'',a:'safe',f:()=>say('가축을 길가 풀밭으로 몰았다.'+fx({money:-peaV(4)}))}]),
 C('pea_boundary',()=>peaLand(),.4,4,'경계석','la borne déplacée',()=>`밭 경계석이 한 걸음쯤 우리 쪽으로 옮겨져 있다. 옆 밭 ${jo(person(),'이','가')} 쟁기질하다 슬쩍 밀었다고 다들 수군거린다.`,()=>[
   {l:'멱살을 잡는다',s:'의지 판정',a:'bold',f:async()=>{const m=md([[s.st.str>=55,1,'완력'],[s.st.cour>=50,1,'의지'],[s.sk.arms>=20,1,'몽둥이 솜씨'],[s.st.str<30,-1,'힘 부족']]);const r=await roll(m.m,{label:'주먹다짐',why:m.why});if(r.v>=4)say('밭고랑에서 뒹굴며 싸웠다. 이튿날 경계석이 제자리로 돌아와 있었다.'+fx({cour:2,hp:-2}));else say('쇠스랑 자루에 머리를 맞았다. 앙금만 남았다.'+fx({hp:-6,rloc:-2}))}},
   {l:'마을 노인들과 측량사를 부른다',s:'',a:'social',f:()=>say('노인들이 옛 경계를 증언하고 측량사가 돌을 다시 박았다.'+fx({money:-peaV(4),rloc:3}))},
   {l:T()>=1790.9?'치안판사에게 간다':'영주 재판소에 소를 낸다',s:'',a:'study',f:async()=>{const r=await roll(T()>=1790.9?1:0,{label:'경계 소송'});if(r.v>=4)say(T()>=1790.9?'치안판사가 한나절 만에 화해 조서를 써 주었다.':'영주 재판소 판결로 경계가 돌아왔다. 소송비가 땅값보다 더 들었다.'+fx({money:-peaV(8)}));else say('판결은 흐지부지되었다.'+fx({money:-peaV(10)}))}}]),
 C('pea_jp',()=>peas()&&T()>=1790.9,.4,4,'치안판사','la justice de paix',()=>`${person()}의 염소들이 울타리를 넘어와 우리 ${peaWine()?'포도 새순':'양배추 밭'}을 다 뜯어 먹었다. 새로 생긴 치안판사(juge de paix)가 먼저 화해 절차(conciliation)를 하자고 부른다.`,[
   {l:'손해를 다 물리라고 한다',s:'사교 판정',a:'greedy',f:async()=>{const r=await roll(s.st.soc>=45?1:0,{label:'화해 재판'});if(r.v>=4)say('치안판사가 손해를 모두 물어 주라고 하였다.'+fx({money:peaV(10),soc:-1}));else say('치안판사는 반반씩 양보하라고 하였다.'+fx({money:peaV(3)}))}},
   {l:'포도주 한 병으로 화해한다',s:'',a:'social',f:()=>say('치안판사 앞에서 악수하고 카바레에서 한잔하였다.'+fx({soc:3}))},
   {l:'염소를 가두어 버린다',s:'',a:'bold',f:()=>say('농촌법대로 염소를 우리에 가두고 벌금을 받고서야 풀어 주었다.'+fx({money:peaV(5),soc:-2}))}]),
 C('pea_wood',()=>peas()&&peaM(11,0,1),.5,2,'땔감','le bois',()=>T()>=1827.5?'1827년 산림법이 내린 뒤로 국유림과 공유림에서 마른 가지 줍기와 가축 방목이 막혔다. 산림 감시인이 숲을 돈다. 아궁이가 차갑다.':pre89()?'영주의 숲에서는 마른 나무와 잡목(bois mort et mort-bois)만 주울 수 있다. 참나무 생가지를 치면 산림 재판소에 끌려간다. 아궁이가 차갑다.':'숲 주인들이 땔감 줍는 이들을 쫓아낸다. 아궁이가 차갑다.',[
   {l:'마른 가지만 줍는다',s:'',a:'safe',f:()=>say('눈 덮인 숲에서 마른 가지를 한 짐 지고 왔다.'+fx({hp:-1}))},
   {l:'생나무를 벤다',s:'판정',a:'bold',f:async()=>{const r=await roll(0,{label:'도벌'});if(r.v>=4)say('밤에 참나무 한 그루를 베어 장작을 쌓았다. 겨울이 따뜻하였다.'+fx({hp:2}));else say('산림 감시인에게 들켜 도끼를 빼앗기고 벌금을 물었다.'+fx({money:-peaV(15),pol:3}))}},
   {l:'장작을 산다',s:'',a:'safe',f:()=>say('장작 한 수레를 샀다.'+fx({money:-peaV(10),hp:1}))}]),
 C('pea_demoiselles',()=>peas()&&isM()&&peaAt('languedoc','gascogne')&&s.year>=1829&&s.year<=1832&&s.age<=50,1,99,'아가씨들의 전쟁','la guerre des Demoiselles','피레네 아리에주 골짜기에서 사내들이 얼굴에 검댕을 칠하고 여자 옷을 입은 채 산림 감시인과 숯 굽는 사람들을 내쫓는다. 1827년 산림법으로 빼앗긴 숲을 되찾겠다는 것이다. 마을 젊은이들이 함께 가자고 한다.',[
   {l:'흰 치마를 입고 따라간다',s:'의지 판정',a:'bold radical',f:async()=>{const m=md([[s.st.cour>=50,1,'의지'],[s.st.str>=50,1,'산을 타는 체력'],[s.rep.rloc>=60,1,'골짜기가 숨겨 준다']]);const r=await roll(m.m,{label:'아가씨들',why:m.why});if(r.v>=4)say('밤에 감시인 오두막을 불태우고 달아났다. 감시인들은 숲에 발을 들이지 못하였다.'+fx({pol:5,cour:3,rloc:3,bpw:4}));else say('헌병대에 붙잡혀 몇 달 동안 갇혔다.'+fx({hp:-6,money:-peaV(20),pol:5}),'dark')}},
   {l:'집에 머문다',s:'',a:'safe',f:()=>say('산에서 불빛을 바라만 보았다.')}]),
 C('pea_hail',()=>peaLand()&&peaM(4,5,6,7),.4,3,'우박','la grêle',()=>s.year===1788?'7월 13일 일요일 아침, 하늘이 검게 변하더니 달걀만 한 우박이 쏟아졌다. 일드프랑스에서 플랑드르까지 수많은 교구의 곡식이 한 시간 만에 쓰러졌다.':'하늘이 노랗게 물들더니 우박이 쏟아졌다. 반 시간 만에 밭이 짓이겨졌다.',[
   {l:'종을 치고 행렬을 올린다',s:'신앙',a:'pious',f:()=>{peaBadY();say('신부가 성체를 모시고 밭을 돌았다. 남은 이삭이라도 지켜 달라고 빌었다.'+fx({money:-peaV(25),faith:3}))}},
   {l:'세금 감면을 청원한다',s:'사교 판정',a:'study social',f:async()=>{peaBadY();const r=await roll(s.st.soc>=45||lit()?1:0,{label:'감면 청원'});say('우박에 밭이 결딴났다.'+fx({money:-peaV(25)}));if(r.v>=4)say(`${T()<1790?'지방 감독관':'도청'}이 피해 교구의 세금을 깎아 주었다.`+fx({money:peaV(10)}));else say('조사관은 오지 않았다.'+fx({pol:2}))}},
   {l:'다시 뿌린다',s:'메밀이나 순무를 늦게라도',a:'work',f:()=>say('쓰러진 밀을 갈아엎고 늦게라도 순무를 뿌렸다.'+fx({money:-peaV(12),hp:-2}))}]),
 C('pea_fire',()=>peas()&&peaT()>=2,.3,5,'곳간의 불','l’incendie',()=>`한밤중 "불이야!" 소리에 깼다. 곳간 초가지붕이 활활 탄다. 외양간에서 소가 울부짖는다.${s.flags.peaInsured?' 다행히 화재 공제조합에 들어 있다.':''}`,[
   {l:'외양간으로 뛰어든다',s:'의지 판정',a:'bold',f:async()=>{const m=md([[s.st.cour>=50,1,'의지'],[s.st.str>=50,1,'체력']]);const r=await roll(m.m,{label:'불길',why:m.why});if(r.v>=4)say('연기 속에서 소의 고삐를 풀어 끌어냈다.'+fx({cour:3,hp:-2,money:-peaV(s.flags.peaInsured?5:25)}));else say('불붙은 서까래가 떨어져 팔에 화상을 입었다. 소도 잃었다.'+fx({hp:-10,money:-peaV(s.flags.peaInsured?15:60)}),'dark')}},
   {l:'양동이 줄을 세워 곡식을 지킨다',s:'',a:'social',f:()=>say('이웃들이 우물에서 양동이를 날랐다. 곳간은 탔지만 집은 지켰다.'+fx({rloc:s.rep.rloc>=50?2:0,money:-peaV(s.flags.peaInsured?8:35)}))},
   {l:'식구들만 데리고 피한다',s:'',a:'safe family',f:()=>{peaBadY();say('잿더미만 남았다.'+fx({money:-peaV(s.flags.peaInsured?15:50)}),'dark')}}]),
 C('pea_insure',()=>peaLand()&&peaT()>=3&&T()>=1820&&!s.flags.peaInsured,.3,5,'화재 공제조합','assurance mutuelle','도청 소재지의 화재 공제조합(assurance mutuelle contre l’incendie) 대리인이 와서 해마다 조금씩 내면 불이 났을 때 물어 준다고 한다.',[
   {l:'든다',s:'',a:'safe study',f:()=>{s.flags.peaInsured=true;say('증서를 받아 성모상 옆에 모셔 두었다.'+fx({money:-peaV(5)}))}},
   {l:'사기꾼이라며 내쫓는다',s:'',a:'safe',f:()=>say('도시 놈들 말은 믿을 수 없다며 돌려보냈다.')}]),
 C('pea_flood',()=>peas()&&peaAt('languedoc','provence','gascogne','bourgogne','ile','vendee','champagne','picardie')&&peaM(9,10,11,0,1,2,3,4),.3,4,'물난리','l’inondation',()=>`${peaRiver()}이 둑을 넘었다. 물이 밤새 불어 마당까지 차올랐다.`,[
   {l:'가축을 언덕으로 몬다',s:'',a:'safe',f:()=>say('물살을 헤치고 소와 양을 언덕으로 몰았다. 곳간 곡식은 젖었다.'+fx({money:-peaV(15),hp:-2}))},
   {l:'곡식 자루를 다락에 올린다',s:'',a:'family',f:()=>say('곡식은 지켰지만 돼지 한 마리가 떠내려갔다.'+fx({money:-peaV(10),hp:-1}))},
   {l:'배를 저어 이웃을 구한다',s:'의지 판정',a:'bold social',f:async()=>{const m=md([[s.st.cour>=50,1,'의지'],[s.st.str>=50,1,'노 젓는 힘'],[s.st.str<30,-1,'힘 부족']]);const r=await roll(m.m,{label:'구조',why:m.why});if(r.v>=3)say('지붕에 올라앉은 이웃 식구들을 배로 실어 날랐다. 신문에 이름이 났다.'+fx({fame:3,rloc:6,money:-peaV(15)}));else say('배가 뒤집혀 간신히 헤엄쳐 나왔다.'+fx({hp:-8,money:-peaV(15)}))}}]),
 C('pea_fete',()=>peas()&&peaM(5,7,8),.5,2,'마을 잔치','la fête votive',()=>pick(['성 요한 축일 밤, 광장에 모닥불이 올랐다.','수호성인 축일(fête patronale)이다. 백파이프와 바이올린이 울린다.','마지막 볏단을 꽃으로 꾸며 실어 들이는 추수 잔치(la gerbe)다.'])+' 젊은이들의 씨름판과 볼링(quilles) 내기에는 양 한 마리가 걸렸다.',[
   {l:'밤새 춤춘다',s:'',a:'social',f:()=>say('부레와 론도를 추며 새벽까지 놀았다.'+fx({soc:2,rloc:2,hp:-1}))},
   {l:'씨름판에 나선다',s:'의지 판정',a:'bold',f:async()=>{const m=md([[s.st.str>=55,1,'힘'],[s.sk.arms>=20,1,'몸싸움 솜씨'],[s.st.cour>=50,1,'의지'],[!isM(),-1,'아낙이 씨름판에'],[s.st.str<30,-1,'힘 부족']]);const r=await roll(m.m,{label:'씨름',why:m.why});if(r.v>=5)say('이웃 마을 장사를 넘어뜨리고 양을 탔다.'+fx({money:8,fame:2,cour:2,str:1,rloc:3}));else say('첫판에 나가떨어졌다. 다들 웃었다.'+fx({hp:-1,soc:1}))}},
   {l:'카바레에서 마신다',s:'',a:'social',f:()=>say('카바레에서 외상 술을 마시다 이웃 마을 패와 시비가 붙었다.'+fx({money:-5,soc:1,hp:-2}))},
   {l:'일찍 들어간다',s:'',a:'pious safe',f:()=>say('신부는 춤을 죄라고 했다. 일찍 들어가 묵주를 돌렸다.'+fx({faith:2}))}]),
 C('pea_pedlar',()=>peas(),.5,2,'방물장수','le colporteur',()=>`${pick(['도피네 산골','코탕탱','오베르뉴'])}에서 온 방물장수가 등짐을 풀었다. 바늘과 실, 리본, 안경, 약초, 그리고 파란 표지의 싸구려 책(Bibliothèque bleue)과 ${T()>=1800?'에피날의 채색 판화와 ':''}달력(almanach)이 있다.`,()=>[
   {l:'달력을 산다',s:lit()?'학식':'그림으로 날씨와 장날을 본다',a:'study',f:()=>say(lit()?'달력의 날씨 점과 재판 소식을 읽었다.'+fx({money:-1,edu:2}):'달력의 달 모양 그림을 보고 파종 날을 정했다.'+fx({money:-1,edu:1}))},
   {l:'리본과 레이스를 산다',s:'',a:'social',f:()=>say(`${peaWed()?peaSp()+'에게':'마음에 둔 이에게'} 리본을 선물하였다.`+fx({money:-3,soc:2}))},
   {l:'만병통치약을 산다',s:'',a:'bold',f:async()=>{const r=await roll(-1,{label:'만병통치약'});say('오르비에탕이라는 약을 한 병 샀다.'+(r.v>=5?' 묘하게도 허리 통증이 나았다.'+fx({money:-4,hp:2}):' 맛은 쓰고 효험은 없었다.'+fx({money:-4})))}},
   {l:'구경만 한다',s:'',a:'safe',f:()=>say('방물장수가 들려주는 파리 소식만 들었다.'+fx({soc:1}))}]),
 C('pea_beggar',()=>peas(),.4,2,'떠돌이','le vagabond',()=>`해 질 녘 누더기 차림의 떠돌이가 문을 두드린다. 빵 한 조각과 곳간에서 하룻밤을 청한다.${peaBad()?' 흉년이라 길에 이런 이들이 넘친다. 곳간에 불을 지르는 떠돌이가 있다는 소문도 돈다.':''}`,[
   {l:'빵을 주고 곳간에 재운다',s:'',a:'pious',f:async()=>{if(await chance(.1,'도둑','떠돌이를 재워 준 농가의 도난 신고 비율 추정'))say('아침에 보니 떠돌이도 닭 두 마리도 사라졌다.'+fx({faith:1,money:-4}));else say('떠돌이는 새벽에 장작을 패 주고 떠났다.'+fx({faith:2,soc:1}))}},
   {l:'빵만 주어 보낸다',s:'',a:'safe',f:()=>say('빵 한 조각을 쥐여 보냈다.'+fx({faith:1}))},
   {l:'개를 풀어 쫓는다',s:'',a:'safe',f:()=>say('개를 풀어 쫓았다.'+fx({faith:-1}))}]),
 C('pea_syndic',()=>peas()&&isM()&&peaT()>=3&&s.age>=30&&!s.flags.peaSyndic,.3,99,'마을의 대표','syndic / marguillier',()=>pre89()?'주민 회의가 마을 대표(syndic)로 뽑았다. 지방 감독관의 명령을 받아 전하고, 부역과 민병 추첨을 맡아야 한다. 귀찮고 미움받는 자리다.':'교회 재산을 관리하는 교회 관리위원(marguillier) 자리를 맡아 달라고 한다. 교회 맨 앞자리 의자가 따라온다.',[
   {l:'맡는다',s:'',a:'social',f:()=>{s.flags.peaSyndic=1;say('마을 일을 맡았다. 일요일마다 교회 문 앞에서 공고문을 읽었다.'+fx({soc:2,rloc:4,orat:2,inf:4,fame:2,hp:-1}))}},
   {l:'사양한다',s:'',a:'safe',f:()=>{s.flags.peaSyndic=1;say('밭일이 바쁘다며 사양하였다.')}}]),
 C('pea_militia',()=>peaCom()&&isM()&&!s.married&&s.age>=18&&s.age<=40&&pre89()&&s.year>=1765&&peaM(1,2,3),.5,3,'민병 추첨','le tirage de la milice','지방 감독관의 하위 관리가 교회 앞에 모자를 놓았다. 미혼 사내들이 차례로 쪽지를 뽑는다. ‘민병(milicien)’이라 쓰인 쪽지를 뽑으면 여섯 해 동안 지방 민병대에 묶인다.',[
   {l:'쪽지를 뽑는다',s:'',a:'safe',f:async()=>{if(await chance(.08,'민병 당첨','교구 미혼 남성 가운데 민병으로 뽑힌 비율')){say('검은 글씨가 적힌 쪽지였다. 해마다 몇 주씩 훈련에 불려 다녀야 한다.'+fx({hp:-2,cour:2,money:-10}),'big')}else say('흰 쪽지였다. 다들 모자를 던지며 환호하였다.'+fx({soc:1}))}},
   {l:'추첨 전날 숲으로 숨는다',s:'판정',a:'bold',f:async()=>{const r=await roll(0,{label:'도망'});if(r.v>=3)say('추첨이 끝날 때까지 숯 굽는 오두막에 숨어 지냈다. 대신 다른 집 아들이 뽑혔다.'+fx({soc:-3}));else say('기마경찰대에 붙잡혀 도망자로 바로 민병에 끼었다.'+fx({hp:-3,cour:1,money:-15}),'dark')}},
   {l:'마을 모금으로 지원자를 산다',s:'',a:'greedy social',f:()=>say('법으로는 금지되었지만, 미혼 사내들이 돈을 모아 떠돌이 하나를 지원자로 세웠다.'+fx({money:-12,soc:2}))}]),
 C('pea_conscript',()=>peas()&&(peaYr(1804.8,1814.3)||peaYr(1818.5,1850))&&!!peaSon(20,21),.8,1,'아들의 징병 추첨','le tirage au sort',()=>`${jo(peaSon(20,21).n,'이','가')} 징병 추첨을 받을 나이가 되었다. 낮은 번호를 뽑으면 ${T()<1815?'황제의 군대로 끌려간다.':'일곱 해를 군대에서 보낸다.'} 돈이 있으면 대리 복무자(remplaçant)를 살 수 있다.`,()=>{const cost=T()<1815?2200:1300;const k=peaSon(20,21);k.peaDrawn=1;return [
   {l:'대리 복무자를 산다',s:`재산 -${fmt(cost)}`,a:'family greedy',dis:s.money<cost,f:()=>{k.peaFree=1;say(`대리 복무자 중개인에게 ${fmt(cost)} ${jo(money(),'을','를')} 치렀다. 이웃 마을 가난한 청년이 ${k.n} 대신 군복을 입었다.`+fx({money:-cost}),'big')}},
   {l:'운에 맡긴다',s:'',a:'safe',f:async()=>{if(await chance(T()<1815?.35:.3,'낮은 번호','해당 연령 가운데 실제로 입대한 비율')){say(`${jo(k.n,'이','가')} 낮은 번호를 뽑았다. 어머니가 셔츠에 성패를 꿰매 주었다.`+fx({hp:-2,faith:1}),'big');if(T()>=1811&&T()<1814.3&&await chance(.4,'돌아오지 못한 아들','1812~1813년 징집병의 손실')){k.alive=false;say(`이듬해 ${jo(k.n,'이','가')} 러시아의 눈밭에서 돌아오지 못하였다는 소식이 왔다.`+fx({hp:-6}),'dark')}}else say(`${jo(k.n,'이','가')} 높은 번호를 뽑았다. 온 식구가 카바레에서 한잔하였다.`+fx({soc:1}))}},
   {l:'앞니를 뽑게 한다',s:'탄약 봉지를 물어뜯지 못하면 면제',a:'bold',f:async()=>{const r=await roll(0,{label:'면제 꾀'});if(r.v>=3)say(`${k.n}의 앞니를 뽑았다. 징병 심사관은 혀를 차며 면제를 내주었다.`+fx({faith:-1}));else say('자해로 징병을 피하려 했다는 고발이 들어왔다. 벌금을 물고 아들은 결국 끌려갔다.'+fx({money:-peaV(20),sus:5}),'dark')}}]}),
 C('pea_migrate',()=>peas()&&isM()&&s.age>=16&&s.age<=45&&peaT()<=2&&((peaAt('auvergne')&&peaM(8,9,10))||(peaAt('bretagne','normandie','picardie','vendee')&&peaM(5,6))),.5,2,'철새 일꾼','les migrants saisonniers',()=>peaAt('auvergne')?'가을이면 고원의 사내들이 떼 지어 산을 내려간다. 톱장이, 땜장이, 물장수가 되어 파리와 리옹, 멀리 에스파냐에서 겨울을 나고 봄에 돌아온다.':'평야의 큰 농장에서 추수꾼을 부른다. 고향 밭은 아낙과 노인들에게 맡기고 한 철 품을 팔러 가는 이들이 많다.',[
   {l:'한 철 떠난다',s:'건강 판정',a:'work bold',f:async()=>{const m=md([[s.st.hp>=55,1,'건강'],[s.st.str>=50,1,'체력'],[econ().jobs<55,-1,'일감이 귀한 해']]);const r=await roll(m.m,{label:'객지살이',why:m.why});if(r.v>=4)say(peaAt('auvergne')?'파리에서 겨울 내내 톱질을 해서 은화를 허리띠에 꿰매어 돌아왔다.'+fx({money:peaWage(60),rloc:2,hp:-2,str:1,craft:1}):'한 철 추수를 마치고 품삯을 받아 돌아왔다.'+fx({money:peaWage(40),hp:-2,farm:1,str:1}));else if(r.v===1)say('객지에서 열병에 걸려 번 돈을 약값으로 다 쓰고 돌아왔다.'+fx({hp:-8,money:5}),'dark');else say('일감이 적어 겨우 노잣돈만 벌었다.'+fx({money:12,hp:-2}))}},
   {l:'남는다',s:'',a:'family safe',f:()=>say('떠나는 이웃들을 마을 어귀에서 배웅하였다.')}]),
 C('pea_sweep',()=>peas()&&peaAt('auvergne')&&!!kidsAlive().find(k=>k.sex==='M'&&s.year-k.y>=7&&s.year-k.y<=11)&&peaM(8,9,10),.5,99,'굴뚝 청소부','petit ramoneur',()=>`굴뚝 청소부 우두머리가 마을에 왔다. 몸집 작은 사내아이를 데려가 파리와 리옹의 굴뚝을 청소시키고 봄에 돌려보낸다고 한다. 사부아와 오베르뉴의 아이들이 그렇게 겨울을 난다.`,()=>{const k=kidsAlive().find(x=>x.sex==='M'&&s.year-x.y>=7&&s.year-x.y<=11);return [
   {l:`${jo(k.n,'을','를')} 딸려 보낸다`,s:'입 하나 덜고 돈을 번다',a:'greedy',f:async()=>{if(await chance(.08,'굴뚝 사고','어린 굴뚝 청소부의 사고·질병')){k.alive=false;say(`${jo(k.n,'이','가')} 봄에 돌아오지 않았다. 굴뚝에서 떨어졌다는 소식만 왔다.`+fx({hp:-5,faith:-2}),'dark')}else say(`봄에 ${jo(k.n,'이','가')} 그을음투성이로 돌아와 은화 몇 닢을 내밀었다.`+fx({money:20}))}},
   {l:'안 된다',s:'',a:'family',f:()=>say('아이는 집에서 소를 치게 하였다.')}]}),
 C('pea_spin',()=>peas()&&!isM(),.6,2,'물레질','la filature à domicile',()=>`${peaAt('normandie')?'루앙의 면직물 상인':peaAt('bretagne')?'아마포(toile) 상인':peaAt('picardie','champagne')?'아미앵과 랭스의 모직물 상인':peaAt('languedoc','provence')?'명주 상인':'읍내 직물 상인'}이 실감을 맡기러 왔다. 무게를 달아 주고 무게를 달아 받는다.${T()>=1825?' 기계 방적이 퍼져 품삯이 해마다 줄어든다.':''}${econ().jobs<55?' 요즘은 상인이 맡기는 실감이 부쩍 줄었다.':''}`,[
   {l:'밤까지 물레를 돌린다',s:'',a:'work',f:()=>say('밤마다 등잔 아래서 물레를 돌렸다.'+fx({money:peaJob((T()>=1825?8:15)*(1+(s.sk.craft||0)/200)),hp:-2,craft:1,dex:1}))},
   {l:'실을 축여 무게를 늘린다',s:'판정',a:'greedy bold',f:async()=>{const m=md([[s.st.dex>=50,1,'솜씨 좋은 손'],[s.rep.rloc<35,-1,'상인이 의심한다']]);const r=await roll(m.m,{label:'실 무게',why:m.why});if(r.v>=4)say('눅눅한 지하실에 실을 두어 무게를 늘렸다. 상인은 눈치채지 못했다.'+fx({money:peaJob(T()>=1825?12:20)}));else say('상인이 실을 쥐어 보고 품삯을 깎았다. 다음부터 일감을 주지 않았다.'+fx({money:4,rloc:-3}))}},
   {l:'이웃 아낙들과 밤마실(veillée)에서 잣는다',s:'',a:'social',f:()=>say('외양간 온기 속에서 이야기와 노래를 나누며 실을 자았다.'+fx({money:peaJob(T()>=1825?5:10),soc:1,rloc:2,craft:1}))}]),
 C('pea_dairy',()=>peas()&&!isM()&&peaAt('normandie','bretagne','vendee','auvergne','alsace','picardie'),.5,2,'버터와 치즈','la laiterie',()=>`${peaAt('normandie')?'이지니 버터는 파리에서 금값이다.':peaAt('auvergne')?'여름 목초지 오두막(buron)에서 캉탈 치즈를 만든다.':peaAt('bretagne')?'소금세가 없는 브르타뉴의 짭짤한 버터는 멀리까지 팔린다.':'우유를 휘저어 버터를 만들었다.'} 버터 덩이를 이고 장에 갈 것인가, 문 앞에 오는 달걀·버터 중간상(coquetier)에게 넘길 것인가.`,[
   {l:'장에 직접 이고 간다',s:'',a:'social work',f:()=>say('새벽 세 시간을 걸어 장에 버터를 팔았다.'+fx({money:Math.round(12*econ().price*(1+(s.sk.trade||0)/250)*(econ().cur<.5?.55:1)),trade:1,craft:1,hp:-1}))},
   {l:'중간상에게 넘긴다',s:'',a:'safe',f:()=>say('중간상이 값을 후려쳤지만 하루를 벌었다.'+fx({money:Math.round(7*econ().price),craft:1}))},
   {l:'식구들 먹게 둔다',s:'',a:'family',f:()=>say('아이들 빵에 버터를 듬뿍 발라 주었다.'+fx({hp:2}))}]),
 C('pea_nurse',()=>peas()&&!isM()&&peaWed()&&peaAt('ile','picardie','normandie','bourgogne','champagne')&&!!kidsAlive().find(k=>s.year-k.y<=1),.7,3,'파리의 젖먹이','nourrice',()=>`파리 유모 사무소(bureau des nourrices)의 ‘메뇌즈’가 마차 가득 갓난아기들을 싣고 왔다. 파리 장인 집 아기를 맡아 젖을 먹이면 ${T()<1795?'달마다 7~8리브르':'달마다 몇 프랑'}을 받는다. 우리 아기 몫의 젖이 줄어들 것이다.`,[
   {l:'아기를 맡는다',s:'',a:'greedy work',f:async()=>{if(await chance(.3,'맡은 아기의 죽음','시골 유모에게 보내진 파리 아기의 사망률'))say('파리 아기가 겨울을 넘기지 못하였다. 메뇌즈가 와서 장부에 줄을 그었다.'+fx({money:25,faith:-1,hp:-2}),'dark');else say('파리 아기를 두 해 동안 키워 돌려보냈다. 떠나는 날 아기가 울었다.'+fx({money:70,hp:-2}))}},
   {l:'거절한다',s:'',a:'family',f:()=>say('우리 아기 젖을 나눌 수 없다며 돌려보냈다.')}]),
 C('pea_flourwar',()=>peas()&&peaAt('ile','picardie','champagne','bourgogne')&&peaYr(1775.0,1775.35),2,99,'밀가루 전쟁','la guerre des farines','튀르고가 곡물 거래를 풀자 빵값이 치솟았다. 장날, 아낙들과 날품팔이들이 곡물 상인의 수레를 둘러싸고 ‘정당한 값’에 팔라고 외친다. 밀 한 스티에(setier)에 12리브르!',()=>{const o=[
   {l:'군중과 함께 값을 매긴다',s:'위험',a:'radical bold',f:async()=>{if(await chance(.08,'체포','폭동 가담자 가운데 처벌된 비율'))say('기마경찰대에 붙잡혀 감옥에 갇혔다. 파리에서는 두 사람이 교수형을 당하였다.'+fx({hp:-6,pol:6}),'dark');else say('상인의 밀을 정당한 값에 사 들고 왔다.'+fx({money:5,pol:5}))}},
   {l:'멀찍이 서서 지켜본다',s:'',a:'safe',f:()=>say('군대가 장터에 들어오는 것을 보았다.'+fx({pol:1}))}];
   if(peaT()>=3)o.push({l:'제 곡식을 군중 값에 내준다',s:'',a:'social',f:()=>say('곳간을 열어 군중이 매긴 값에 곡식을 팔았다. 손해였지만 곳간은 무사하였다.'+fx({money:-peaV(15),soc:3}))});return o}),
 C('pea_blight',()=>peas()&&peaYr(1845.5,1847.6),1,99,'감자 역병','la maladie de la pomme de terre','감자 잎이 하룻밤 새 검게 오그라들었다. 캐 보니 덩이가 물러 썩는 냄새가 난다. 아일랜드에서 시작된 병이라고 한다. 빵값도 치솟는다.',[
   {l:'성한 것만 서둘러 캔다',s:'',a:'work',f:()=>say('밤낮으로 캐서 성한 감자만 골라 지하실에 두었다.'+fx({hp:-3,money:-peaV(10)}))},
   {l:'면사무소 자선 작업장에 나간다',s:'',a:'safe',f:()=>say('면이 연 길 닦기 작업장(atelier de charité)에서 흙을 날랐다.'+fx({money:15,hp:-2}))},
   {l:'읍내 곡물 상인 집 앞에 몰려간다',s:'위험',a:'radical bold',f:async()=>{const r=await roll(0,{label:'곡물 소동'});if(r.v>=4)say('상인이 겁먹고 곡식을 싸게 풀었다.'+fx({money:5,pol:4}));else say('헌병대가 주동자들을 잡아갔다.'+fx({hp:-5,pol:5,sus:5}),'dark')}}])
);

/* ---------------- 몸과 손, 장터와 회의 (pea2_) ----------------
   체력·농사(str·farm), 손재주·수공(dex·craft·sew), 장사(trade), 고을 평판(rloc)·웅변(orat),
   영주·신부와의 관계(addRel), 신념(bor 영주 공조 · brl 십일조·교회 · bpw 고을 대 파리)과 지역 경제 econ(). */
EV.push(
 C('pea2_plough',()=>peaLand()&&peaM(2,3,9,10),.6,2,'밭갈이','le labour',()=>`${s.flags.peaOx?'제 소 한 겨리':'이웃에게 빌린 소'}에 멍에를 메웠다. ${peaAt('provence','languedoc','gascogne')?'가벼운 나무 쟁기(araire)는 흙을 얕게 긁을 뿐이라 같은 밭을 두세 번 갈아야 한다.':'무거운 바퀴 쟁기(charrue)는 깊이 갈지만 쟁기 자루를 잡은 팔이 끊어질 듯하다.'} 이랑을 곧게 내는 솜씨는 온 마을이 지켜본다.`,[
   {l:'깊고 곧게 간다',s:'체력·농사 판정',a:'work',f:async()=>{const m=md([[s.st.str>=50,1,'힘'],[s.sk.farm>=45,1,'쟁기 솜씨'],[!!s.flags.peaOx,1,'길든 제 소'],[s.st.str<30,-1,'힘 부족'],[s.st.hp<35,-1,'몸이 성치 않음']]);const r=await roll(m.m,{label:'밭갈이',why:m.why});
     if(r.v>=5){s.flags.peaTilled=peaM(9,10)?s.year+1:s.year;say('이랑이 줄을 그은 듯 곧았다. 노인들이 밭머리에서 고개를 끄덕였다.'+fx({farm:3,str:1,rloc:2}))}
     else if(r.v>=3){s.flags.peaTilled=peaM(9,10)?s.year+1:s.year;say('해 질 녘까지 밭을 다 갈았다. 어깨가 돌처럼 굳었다.'+fx({farm:2,hp:-1}))}
     else say('보습이 돌에 걸려 부러졌다. 대장간에 맡기느라 이틀을 잃었다.'+fx({money:-peaV(4),hp:-2,farm:1}))}},
   {l:'젊은 손에 맡기고 씨앗을 고른다',s:'',a:'safe',f:()=>say('쟁기는 아들과 머슴에게 맡기고 씨앗 자루를 체로 쳤다.'+fx({farm:1}))}]),
 C('pea2_cart',()=>peaLand()&&peaT()>=2&&peaM(9,10,11,0),.5,2,'읍내까지 수레','le charroi',()=>`곡식 자루 열 개를 수레에 실었다. 읍내 장까지 진창길로 반나절이다. ${pre89()?'다리 어귀에서는 영주의 통행세(péage)를 받는다. ':''}${econ().price>=1.3?'읍내 곡식값이 높다는 소문이다.':econ().price<=.95?'올해는 어디나 곡식이 흔하다.':'값은 여느 해와 비슷하다고 한다.'}`,[
   {l:'직접 몰고 가서 판다',s:'체력·장사 판정',a:'work greedy',f:async()=>{const m=md([[s.st.str>=45,1,'자루를 메는 힘'],[s.sk.trade>=30,1,'장사 솜씨'],[s.st.str<25,-1,'힘 부족'],[peaBad(),-1,'비에 길이 진창']]);const r=await roll(m.m,{label:'장까지',why:m.why});const toll=pre89()?2:0;
     if(r.v>=4)say('바퀴가 빠질 때마다 어깨로 들어 올리며 장에 닿았다. 첫 손님에게 좋은 값을 받았다.'+fx({money:peaSale(22)-toll,str:1,trade:2}));
     else say('굴대가 부러져 진창에서 자루를 옮겨 싣다 해가 졌다. 파장 무렵 헐값에 넘겼다.'+fx({money:Math.max(1,peaSale(12)-toll),hp:-2,str:1}))}},
   {l:'마당까지 온 중간상에게 넘긴다',s:'',a:'safe',f:()=>say('곡물 중간상(blatier)이 노새를 끌고 와서 자루째 사 갔다. 값은 장보다 한 푼 박했다.'+fx({money:Math.round(peaSale(22)*.75)}))}]),
 C('pea2_lace',()=>peas()&&!isM()&&peaAt('normandie','auvergne'),.6,2,'레이스 베개','la dentelle aux fuseaux',()=>`${peaAt('auvergne')?'르퓌의 레이스 상인':'바이외와 캉의 레이스 상인'}이 도안과 실을 맡기고 갔다. 무릎에 둥근 베개(carreau)를 얹고 실패 수십 개를 핀 사이로 엇갈려 넘기면 한 철에 몇 자가 나온다.${T()>=1830?' 요즘은 영국 기계 망사(tulle)가 싸게 들어와 손 레이스 값이 떨어졌다.':''}${econ().jobs<55?' 올해는 맡기는 일감도 적다.':''}`,[
   {l:'정교한 무늬를 맡는다',s:'기술·바느질 판정',a:'work study',f:async()=>{const m=md([[s.st.dex>=50,1,'손재주'],[s.sk.sew>=40||s.sk.craft>=40,1,'실패 다루는 솜씨'],[s.age>=50,-1,'눈이 침침함'],[s.st.dex<25,-1,'굳은 손']]);const r=await roll(m.m,{label:'레이스',why:m.why});
     if(r.v>=4)say('상인이 레이스를 등불에 비춰 보더니 웃돈을 쳐 주었다. 파리 귀부인의 소맷부리가 될 것이다.'+fx({money:peaJob(T()>=1830?14:24),craft:2,sew:1,dex:1}));
     else if(r.v>=2)say('무늬 한 곳이 어긋났다. 상인이 값을 깎았다.'+fx({money:peaJob(8),craft:1}));
     else say('실이 엉켜 한 철 일을 거의 버렸다.'+fx({money:2,hp:-1}))}},
   {l:'밤마실에서 성긴 레이스를 뜬다',s:'',a:'social safe',f:()=>say('외양간 온기 속에서 이웃 아낙들과 노래를 부르며 성긴 레이스를 떴다.'+fx({money:peaJob(8),craft:1,rloc:1}))}]),
 C('pea2_loom',()=>peas()&&peaAt('bretagne','picardie','normandie','champagne','vendee')&&peaM(11,0,1,2),.5,2,'겨울 베틀','le métier à tisser',()=>`${peaAt('bretagne')?'레옹과 캥탱의 아마포(toile)':peaAt('vendee')?'숄레의 손수건 천':peaAt('picardie')?'아미앵의 모직':peaAt('champagne')?'랭스의 모직':'루앙의 줄무늬 면포'} 상인이 날실을 맡겼다. 습기가 있어야 실이 끊기지 않아 베틀은 반지하 움집에 둔다.${peaYr(1786.7,1790)?' 영국과의 통상조약(1786) 뒤 영국 면포가 밀려와 상인들이 일감을 줄였다.':''}${econ().jobs<55?' 맡기는 날실이 지난해의 절반이다.':''}`,[
   {l:'날마다 북을 놀린다',s:'기술·수공 판정',a:'work',f:async()=>{const m=md([[s.st.dex>=50,1,'손재주'],[s.sk.craft>=35,1,'베 짜는 솜씨'],[s.st.dex<25,-1,'굳은 손']]);const r=await roll(m.m,{label:'베 짜기',why:m.why});
     if(r.v>=4)say('씨실이 고르고 촘촘한 천을 짰다. 상인이 다음 겨울 몫까지 맡기겠다고 하였다.'+fx({money:peaJob(20),craft:2,dex:1}));
     else say('흠이 난 천이라 상인이 무게값만 쳐 주었다.'+fx({money:peaJob(8),craft:1,hp:-1}))}},
   {l:'베틀을 접고 땔감과 바구니 일을 한다',s:'',a:'safe',f:()=>say('베틀을 덮어 두고 버들가지 바구니를 엮었다.'+fx({money:4,craft:1}))}]),
 C('pea2_thatch',()=>peas()&&peaM(2,3,8,9),.4,4,'지붕 이엉','la toiture',()=>`겨울 폭풍에 초가지붕이 군데군데 내려앉았다. 빗물이 다락의 곡식 자루 위로 떨어진다.${s.job==='f2'?' 지주의 관리인은 수리는 소작인 몫이라고 한다.':''} 이엉 장이(couvreur)를 부르려면 ${econ().wage>=1.2?'올해는 품삯이 비싸다.':'품삯이 든다.'}`,[
   {l:'직접 호밀짚을 엮어 잇는다',s:'기술·수공 판정',a:'work family',f:async()=>{const m=md([[s.st.dex>=45,1,'손재주'],[s.sk.craft>=30,1,'수공 솜씨'],[s.st.str>=45,1,'짚단 나르는 힘'],[s.age>=60,-1,'나이']]);const r=await roll(m.m,{label:'지붕 잇기',why:m.why});
     if(r.v>=4)say('호밀짚을 단단히 묶어 용마루까지 이었다. 이웃이 제 지붕도 봐 달라고 하였다.'+fx({craft:2,dex:1,rloc:2}));
     else if(r.v>=2)say('그럭저럭 비는 막았다.'+fx({craft:1,hp:-1}));
     else say('사다리에서 떨어져 허리를 다쳤다. 결국 이엉 장이를 불렀다.'+fx({hp:-6,money:-Math.round(peaV(8)*econ().wage)}),'dark')}},
   {l:'이엉 장이를 부른다',s:'',a:'safe',f:()=>say('이엉 장이가 사흘 만에 새 지붕을 올렸다.'+fx({money:-Math.round(peaV(8)*econ().wage)}))}]),
 C('pea2_market',()=>peas()&&peaT()<=3,.6,2,'장날','le jour de marché',()=>`달걀 두 꾸러미와 거세한 수탉 두 마리, 버터 한 덩이를 바구니에 담아 장에 나왔다. ${econ().cur<.5?`장사꾼들은 아시냐 지폐 다발을 내밀지만, 지폐 값은 정화의 ${Math.max(1,Math.round(econ().cur*100))}%도 안 된다.`:econ().price>=1.3?'흉년이라 도시 아낙들이 닭 한 마리에도 값을 묻지 않고 산다.':'장터 자리세(droit de place)를 내고 자리를 잡았다.'}`,()=>{const e=econ(),k=e.cur<.5?.5:1;const o=[
   {l:'값을 높게 부르고 버틴다',s:'장사 판정',a:'greedy',f:async()=>{const m=md([[s.sk.trade>=35,1,'흥정 솜씨'],[s.st.soc>=50,1,'말솜씨'],[e.price>=1.3,1,'물건이 귀한 해'],[e.price<=.95,-1,'물건이 흔한 해']]);const r=await roll(m.m,{label:'흥정',why:m.why});
     if(r.v>=4)say('해 지기 전에 바구니를 다 비웠다. 단골이 둘 생겼다.'+fx({money:Math.round(9*e.price*k),trade:2,rloc:1}));else say('끝까지 버티다 파장 무렵 헐값에 넘겼다.'+fx({money:Math.round(5*e.price*k),trade:1}))}},
   {l:'시세대로 빨리 판다',s:'',a:'safe',f:()=>say('시세대로 팔고 바늘과 소금을 사서 돌아왔다.'+fx({money:Math.round(7*e.price*k),trade:1}))}];
   if(e.cur<.5)o.push({l:'지폐는 받지 않고 물물교환만 한다',s:'법으로는 지폐를 거절할 수 없다',a:'bold',f:()=>say('달걀을 주고 구두장이에게 나막신 수선을, 잡화상에게 양초를 받았다. 지폐 다발보다 나았다.'+fx({money:4,trade:2,sus:rev()?2:0}))});return o}),
 C('pea2_wage',()=>peas()&&peaT()===1&&peaM(5,6,7),.6,2,'품삯 다툼','le prix de la journée',()=>{const e=econ();return `추수가 한창인데 부농이 하루 품삯을 지난해 그대로 주겠다고 한다. ${e.wage>=1.2?'젊은이들이 군대로 빠져 일손이 귀하다. 날품팔이들이 품삯을 올리지 않으면 낫을 들지 않겠다고 한다.':e.jobs<55?'일감 없는 사람이 넘친다. 싫으면 다른 사람을 쓰겠다는 투다.':'날품팔이들이 광장에서 웅성거린다.'}`},()=>{const e=econ();return [
   {l:'날품팔이들과 함께 버틴다',s:'웅변·평판 판정',a:'bold radical',f:async()=>{const m=md([[e.wage>=1.2,1,'일손이 귀함'],[e.jobs<55,-1,'일감이 귀함'],[s.sk.orat>=25||s.st.soc>=50,1,'말솜씨'],[s.rep.rloc>=60,1,'이웃의 신망']]);const r=await roll(m.m,{label:'품삯 다툼',why:m.why});
     if(r.v>=4)say('부농이 손을 들었다. 하루 품삯에 포도주 한 병이 더 붙었다.'+fx({money:peaWage(10),orat:1,rloc:2,bor:2}));
     else say(`${T()>=1790.9?'치안판사':'영주 재판소'}가 일꾼들의 담합은 금지된 일이라며 주동자들에게 벌금을 물렸다.`+fx({money:-3,orat:1,bor:3,sus:rev()?3:0}))}},
   {l:'주는 대로 받고 일한다',s:'',a:'safe work',f:()=>say('말없이 허리를 굽혀 낫질을 하였다.'+fx({money:peaWage(6),farm:1,str:1}))},
   {l:'더 주는 이웃 마을로 간다',s:'',a:'greedy',f:()=>say('새벽에 이웃 마을 큰 농장으로 넘어갔다. 배신자라는 말이 뒤따랐다.'+fx({money:peaWage(8),rloc:-2,str:1}))}]}),
 C('pea2_assembly',()=>peaCom()&&isM()&&s.age>=25&&(pre89()||T()>=1800),.4,6,'주민 회의','l’assemblée des habitants',()=>`종탑이 갈라지고 마을 우물이 무너졌다. 고치는 돈을 집집마다 나눠 낼 일을 두고 일요일 미사 뒤 교회 앞에서 회의가 열렸다. ${pre89()?'회의가 정한 분담금도 지방 감독관의 하위 관리(subdélégué)가 허락해야 걷을 수 있다.':'면 의회가 정해도 도지사가 승인해야 한다.'} 부농들은 머릿수로, 가난한 집들은 땅 크기로 나누자고 한다.`,[
   {l:'땅 크기대로 나누자고 일어선다',s:'웅변·평판 판정',a:'social radical',f:async()=>{const m=md([[s.sk.orat>=25,1,'말솜씨'],[s.rep.rloc>=60,1,'이웃의 신망'],[s.st.soc>=50,1,'사교'],[s.rep.rloc<35,-1,'평판이 나쁨']]);const r=await roll(m.m,{label:'주민 회의',why:m.why});
     if(r.v>=4)say('그대 말대로 정해졌다. 가난한 집들이 그대에게 고개를 숙였다. 그런데 승인서는 석 달이 지나서야 내려왔다.'+fx({orat:2,rloc:4,money:peaT()>=3?-peaV(6):-2,bpw:3,inf:2}));
     else say('부농들 뜻대로 머릿수로 나뉘었다. 승인서를 기다리는 사이 겨울이 왔다.'+fx({orat:1,money:-3,bpw:2}))}},
   {l:'머릿수로 나누자는 쪽에 선다',s:'',a:'greedy safe',f:()=>say('분담금은 정해졌다. 날품팔이들이 그대를 흘겨보았다.'+fx({money:-3,rloc:-3,bor:-1}))},
   {l:'돈 대신 일손을 내놓겠다고 한다',s:'',a:'work social',f:()=>say('사흘 동안 돌을 나르고 석회를 개었다.'+fx({str:1,craft:1,rloc:3,hp:-1}))}]),
 C('pea2_cure',()=>peaCom()&&(T()<1791.3||T()>=1802),.4,6,'본당 신부','monsieur le curé',()=>`${peaCure()}가 집에 들렀다. 성당 지붕을 고칠 일손과 돈이 모자란다고 한다. ${T()<1790?'십일조는 먼 수도원으로 가고 신부는 쥐꼬리만 한 몫(portion congrue)으로 산다.':'신부의 봉급은 나라가 준다지만 늘 늦는다.'} 신부는 마을 일에 그대의 힘을 빌리고 싶어 한다.`,[
   {l:'주일마다 일손을 보탠다',s:'',a:'pious work',f:()=>{const r=peaRel('후원자',peaCure(),{v:'vfam',inf:20,close:55,trust:55});say('주일 오후마다 돌을 나르고 석회를 개었다. 신부가 강론에서 그대 이름을 불렀다.'+fx({faith:3,rloc:3,str:1,craft:1})+peaRF(r,{close:8,trust:6}))}},
   {l:'돈만 조금 보낸다',s:'',a:'safe',f:()=>{const r=peaRel('후원자',peaCure(),{v:'vfam',inf:20});say('은화 한 닢을 보냈다.'+fx({money:-peaV(3),faith:1})+peaRF(r,{close:2}))}},
   {l:'십일조부터 바로잡으라고 쏘아붙인다',s:'',a:'radical bold',f:()=>{const r=peaRel('경쟁자',peaCure(),{v:'vord',inf:20,riv:50});s.flags.anticler=true;say('신부의 얼굴이 굳었다. 카바레에서는 그대 말이 옳다는 이들도 있었다.'+fx({faith:-2,brl:4,rloc:-1})+peaRF(r,{close:-8,riv:6}))}}]),
 C('pea2_oath',()=>peaCom()&&peaYr(tm(1791,1),tm(1792,8))&&!s.flags.peaOath,1.5,99,'신부의 선서','le serment constitutionnel',()=>`${peaCure()}가 성직자 시민헌법에 선서할지 온 마을이 숨죽여 지켜본다. ${west()?'이 고장 신부들은 대부분 선서를 거부했다. 도청이 보낸 선서 신부(intrus)는 빈 성당에서 미사를 올린다.':'선서한 신부도, 거부한 신부도 있다. 교황은 거부하라 하고 도청은 하라고 한다.'}`,[
   {l:'선서 거부 신부 편에 선다',s:'',a:'pious royal',f:()=>{s.flags.peaOath='ref';const r=peaRel('후원자',peaCure(),{v:'vord',inf:20});say('도청이 보낸 새 신부를 마을 아낙들이 성당 문 앞에서 막아섰다. 옛 신부는 헛간에서 미사를 올렸다.'+fx({faith:3,brl:-5,bpw:3,sus:3,rloc:2})+peaRF(r,{close:8,trust:8}));activeFactions().filter(f=>['absolutist','royalist'].includes(f.id)).forEach(f=>frelAdd(f.id,3))}},
   {l:'법을 따르는 선서 신부를 받아들인다',s:'',a:'radical',f:()=>{s.flags.peaOath='jur';say('선서 신부의 미사에 나갔다. 할머니들은 그 신부의 성사는 무효라며 따로 묵주를 돌렸다.'+fx({brl:4,bpw:-2,pol:3,rloc:west()?-3:-1}));activeFactions().filter(f=>['jacobin','patriote','feuillant'].includes(f.id)).forEach(f=>frelAdd(f.id,3))}},
   {l:'어느 편도 들지 않는다',s:'',a:'safe',f:()=>{s.flags.peaOath='mid';say('두 신부 사이에서 눈치를 보며 세례와 장례만 챙겼다.'+fx({faith:1}))}}]),
 C('pea2_seigneur',()=>peaCom()&&pre89()&&s.age>=18&&s.age<=50,.4,8,'성에서 온 부름','au château',()=>`${peaLord()}의 집사가 불렀다. 영주가 ${isM()?'사냥터 지기(garde-chasse)를 새로 뽑는다':'성의 빨래와 바느질을 맡을 아낙을 찾는다'}고 한다. 품삯도 좋고 겨울 땔감도 나오지만, 마을 사람들은 영주 편에 선 사람을 곱게 보지 않는다.`,()=>[
   {l:'성에 들어간다',s:isM()?'체력 판정':'기술 판정',a:'greedy royal',f:async()=>{const m=isM()?md([[s.st.str>=50,1,'체력'],[s.sk.arms>=20,1,'총 솜씨'],[s.st.cour>=50,1,'의지']]):md([[s.st.dex>=50,1,'손재주'],[s.sk.sew>=40,1,'바느질 솜씨']]);const r=await roll(m.m,{label:'성의 일',why:m.why});const lord=peaRel('후원자',peaLord(),{v:'vord',inf:45});
     if(r.v>=4)say((isM()?'영주가 총과 제복을 내주었다. 밀렵꾼을 잡을 때마다 상금이 나온다. 이웃들은 그대 앞에서 말을 아꼈다.':'마님의 레이스 깃을 감쪽같이 고쳐 놓자 마님이 그대 이름을 기억하였다.')+fx(isM()?{money:peaWage(30),arms:2,rloc:-5,bor:-3}:{money:peaWage(20),sew:2,rloc:-2,bor:-2})+peaRF(lord,{close:10,trust:8}));
     else say('한 철 만에 집사와 다투고 쫓겨났다.'+fx({money:peaWage(6),rloc:1})+peaRF(lord,{close:-6,trust:-5}))}},
   {l:'집안일이 바쁘다며 사양한다',s:'',a:'safe',f:()=>say('모자를 쥐고 정중히 사양하였다. 집사가 혀를 찼다.'+fx({rloc:2,bor:1}))}]),
 C('pea2_brawl',()=>peas()&&isM()&&s.age<=45&&peaM(5,6,7,8),.4,3,'마을끼리 싸움','la rixe',`수호성인 축일 저녁, 이웃 마을 젊은이들이 우리 마을 처녀들을 놀렸다. 카바레 앞에 몽둥이와 나막신이 날아다닌다. 대대로 내려오는 마을끼리의 앙숙이다.`,[
   {l:'앞장서 주먹을 휘두른다',s:'체력 판정',a:'bold',f:async()=>{const m=md([[s.st.str>=55,1,'힘'],[s.sk.arms>=20,1,'몽둥이 솜씨'],[s.st.cour>=50,1,'의지'],[s.st.str<30,-1,'힘 부족']]);const r=await roll(m.m,{label:'몸싸움',why:m.why});
     if(r.v>=4)say('이웃 마을 장사를 개울에 처박았다. 그날 밤 우리 마을 젊은이들이 그대를 어깨에 메고 돌았다.'+fx({str:1,arms:1,rloc:3,cour:2,hp:-1}));
     else if(r.v>=2)say('눈두덩이 시퍼렇게 부었다. 피장파장이었다.'+fx({hp:-3,arms:1}));
     else say(`머리가 깨져 ${T()>=1790.9?'치안판사':'영주 재판소'}에 불려 갔다. 벌금과 접골사 삯을 물었다.`+fx({hp:-7,money:-peaV(6),rloc:-1}),'dark')}},
   {l:'뜯어말린다',s:'사교 판정',a:'social safe',f:async()=>{const m=md([[s.st.soc>=50,1,'말솜씨'],[s.rep.rloc>=60,1,'신망'],[s.st.str>=55,1,'덩치']]);const r=await roll(m.m,{label:'말리기',why:m.why});
     if(r.v>=4)say('양쪽 우두머리에게 포도주를 한 병씩 안기고 화해시켰다.'+fx({rloc:4,orat:1,money:-2}));else say('말리다가 양쪽에서 얻어맞았다.'+fx({hp:-3}))}},
   {l:'집으로 간다',s:'',a:'safe',f:()=>say('등 뒤에서 겁쟁이라는 소리가 들렸다.'+fx({rloc:-1}))}]),
 C('pea2_mairie',()=>peaCom()&&isM()&&s.age>=25&&peaYr(tm(1790,1),tm(1790,4))&&!s.flags.peaMairie,3,99,'첫 면장 선거','les municipalités de 1790',()=>`1789년 12월 법에 따라 모든 교구가 ‘코뮌’이 되어 면장(maire)과 면 의회를 뽑는다. 사흘 품삯 넘게 직접세를 내는 ‘능동 시민’만 표를 던진다. ${peaT()>=3?'그대는 능동 시민이다. 이웃들이 그대를 면 의원으로 밀자고 한다.':'그대는 세금이 모자라 표가 없다. 그래도 교회에 모인 회의를 지켜볼 수는 있다.'}`,()=>peaT()>=3?[
   {l:'면 의원 후보로 나선다',s:'웅변·평판 판정',a:'social radical',f:async()=>{s.flags.peaMairie=1;const m=md([[s.rep.rloc>=60,1,'이웃의 신망'],[s.sk.orat>=25,1,'말솜씨'],[lit(),1,'글을 앎'],[s.rep.rloc<40,-1,'평판이 나쁨']]);const r=await roll(m.m,{label:'면 선거',why:m.why});
     if(r.v>=4){s.flags.peaSyndic=1;say('면 의원으로 뽑혔다. 삼색 띠를 두른 면장 곁에서 첫 회의록에 이름을 올렸다. 이제 마을 일은 영주의 관리가 아니라 우리가 정한다.'+fx({rloc:4,orat:2,inf:6,bpw:5,pol:3}),'big')}
     else say('표가 부농 집 사위에게 몰렸다.'+fx({orat:1,bpw:2}))}},
   {l:'글 잘 쓰는 옛 영주 관리인을 면장으로 민다',s:'',a:'royal safe',f:()=>{s.flags.peaMairie=1;say('옛 관리인이 면장이 되었다. 바뀐 것은 띠 색깔뿐이라는 말이 돌았다.'+fx({bpw:-1,bor:-2,rloc:-1}))}}]:[
   {l:'교회 뒷줄에서 지켜본다',s:'',a:'safe',f:()=>{s.flags.peaMairie=1;say('세금 몇 푼 차이로 표가 없다는 것이 분했다.'+fx({bor:4,pol:2}))}},
   {l:'수동 시민에게도 말할 권리를 달라고 외친다',s:'',a:'radical bold',f:()=>{s.flags.peaMairie=1;say('몇몇이 박수를 쳤고 새 면장은 못 들은 척하였다.'+fx({bor:5,orat:1,rloc:1,pol:4}))}}]),
 C('pea2_requis',()=>peaCom()&&peaYr(tm(1793,9),tm(1794,8)),.8,2,'파리에서 온 위원','le commissaire aux réquisitions',()=>`${pick(['파견의원이 보낸 위원','혁명군 분견대장','파리 구민회 출신 위원'])}이 면사무소에 들이닥쳤다. 군대와 파리를 먹일 곡식과 말과 수레를 내놓으라는 징발 명령이다.${econ().supply<50?' 마을 곳간도 바닥이 보이는데,':''} 면장은 우물쭈물한다.`,[
   {l:'면장과 함께 마을 사정을 호소한다',s:'웅변·평판 판정',a:'social',f:async()=>{const m=md([[s.sk.orat>=25,1,'말솜씨'],[s.rep.rloc>=60,1,'이웃의 신망'],[s.pol>=30,1,'애국자라는 평판'],[s.sus>=30,-1,'혐의']]);const r=await roll(m.m,{label:'징발 호소',why:m.why});
     if(r.v>=4)say('위원이 할당량을 3분의 1 깎았다. 면 사람들이 그대 손을 잡고 고마워하였다.'+fx({rloc:5,orat:2,bpw:4}));
     else{say('위원은 “공화국이 먼저다” 하고 장부를 덮었다. 그대 이름이 그의 수첩에 적혔다.'+fx({sus:6,bpw:4,money:-peaV(10)}));frelAdd('jacobin',-4)}}},
   {l:'공화국을 위해 앞장서 내놓는다',s:'',a:'radical',f:()=>{say('제 수레와 곡식을 먼저 내놓았다. 위원이 그대를 ‘좋은 상퀼로트’라 불렀다. 이웃들은 눈을 흘겼다.'+fx({money:-peaV(15),pol:3,bpw:-4,sus:-4,rloc:-3}));frelAdd('jacobin',5)}},
   {l:'말과 곡식을 숲에 숨긴다',s:'평판 판정',a:'bold greedy',f:async()=>{const m=md([[s.rep.rloc>=60,1,'이웃들이 입을 다문다'],[s.rep.rloc<35,-1,'고발할 이웃이 있다']]);const r=await roll(m.m,{label:'숨기기',why:m.why});
     if(r.v>=4)say('이웃 누구도 입을 열지 않았다.'+fx({bpw:3,rloc:2}));else{say('누군가 고발하였다. 혐의자 명단에 이름이 올랐다.'+fx({sus:12,money:-peaV(20),bpw:3}),'dark');frelAdd('jacobin',-6)}}}])
);

/* ---------------- 한 줄 장면들 ---------------- */
EV.push(
 S('pea_s_winter',()=>peas()&&peaM(11,0,1),.5,0,[
   ['외양간 짐승들 온기 곁에서 밤마실(veillée)을 하며 늑대 인간과 요정 이야기를 들었다.',{soc:1}],
   ['얼어붙은 날 쟁기 보습을 대장간에 맡겨 갈았다.',{money:-2}],
   ['성 안토니오 축일(1월 17일), 신부가 마당의 돼지와 소에게 축복을 내렸다.',{faith:1}],
   ['주현절 과자 속 콩을 찾아 하루 동안 ‘콩의 왕’이 되었다.',{soc:1}],
   ['눈 속에 갇혀 사흘을 밤과 메밀죽으로 버텼다.',{hp:-1}],
   ['겨우내 버들가지로 바구니를 엮어 장에 팔았다.',{money:4}],
   ['헛간에서 쥐가 쏠아 놓은 곡식 자루를 꿰맸다.',{}]]),
 S('pea_s_spring',()=>peas()&&peaM(2,3,4),.5,0,[
   ['기도 행렬 날(Rogations), 신부를 따라 밭을 돌며 축복을 받았다.',{faith:2}],
   ['양들이 새끼를 낳았다. 밤새 우리를 지켰다.',{hp:-1}],
   ['나무 쟁기(araire)로 메마른 밭을 얕게 긁었다.',{hp:-1},()=>peaAt('provence','languedoc','gascogne')],
   ['바퀴 달린 무쇠 보습 쟁기(charrue)로 밭을 깊게 갈았다.',{hp:-1},()=>!peaAt('provence','languedoc','gascogne')],
   ['겨울 곡식 밭의 잡초를 맸다.',{hp:-1}],
   ['5월의 늦서리에 새순이 검게 얼었다.',{money:-5},()=>peaWine()],
   ['거름 더미를 수레로 밭에 날라 펼쳤다.',{hp:-1}],
   ['부활절에 새 셔츠를 입고 고해성사를 하였다.',{faith:2}]]),
 S('pea_s_summer',()=>peas()&&peaM(5,6,7),.5,0,[
   ['올해는 낫(faucille) 대신 긴 자루 낫(faux)으로 밀을 베었다. 빠르지만 낟알이 더 떨어진다.',{hp:-2},()=>T()>=1820],
   ['허리를 굽혀 낫으로 밀 밑동을 한 줌씩 잡고 베었다.',{hp:-2}],
   ['한낮 그늘에서 물 탄 포도주와 양파, 빵으로 끼니를 때웠다.',{hp:1}],
   ['일사병으로 쓰러진 일꾼을 개울로 옮겼다.',{}],
   ['볏단을 꽃으로 꾸며 마지막 수레를 들이고 추수 잔치를 열었다.',{soc:2}],
   ['비를 비는 행렬이 마을 성인 유해를 모시고 샘까지 갔다.',{faith:2},()=>!peaFine()],
   ['아이들이 밭에서 새 떼를 쫓느라 하루 종일 딸랑이를 흔들었다.',{}]]),
 S('pea_s_autumn',()=>peas()&&peaM(8,9,10),.5,0,[
   ['성 미카엘 축일(9월 29일), 영주와 지주에게 바칠 몫을 셈하였다.',{money:-5}],
   ['성 마르탱 축일(11월 11일), 이사하는 머슴들의 수레가 길을 메웠다.',{}],
   ['도토리 철, 돼지들을 숲에 풀어 먹였다.',{}],
   ['씨앗 바구니를 걸고 반원을 그리며 고르게 씨를 뿌렸다.',{hp:-1}],
   ['만성절 밤 묘지에 촛불을 켜고 죽은 이들을 위해 기도하였다.',{faith:2}],
   ['장에서 사 온 새 나막신이 발에 물집을 냈다.',{money:-2}]]),
 S('pea_s_bretagne',()=>peas()&&peaAt('bretagne'),.5,0,[
   ['바닷가에서 해초(goémon)를 갈퀴로 긁어 거름으로 밭에 뿌렸다.',{hp:-1}],
   ['메밀 갈레트에 버터를 발라 먹었다.',{hp:1}],
   ['성인의 축일 순례(pardon)에 가서 레슬링(gouren) 구경을 하였다.',{soc:2,faith:1}],
   ['신부가 브르타뉴 말로 강론하였다. 프랑스 말은 장날 상인들만 쓴다.',{}],
   ['가시금작화(ajonc)를 베어 빻아 말먹이로 주었다.',{}],
   ['아마를 늪에 담가 불리느라 온 마을에 썩은 냄새가 났다.',{}],
   ['소금세가 없어 소금이 싸다. 국경 너머 사람들이 부러워한다.',{},()=>T()<1790],
   ['영주 땅을 빌려 짓는 ‘해약 가능 임차(domaine congéable)’ 집이라 지붕도 마음대로 못 고쳤다.',{pol:1},()=>T()<1792]]),
 S('pea_s_normandie',()=>peas()&&peaAt('normandie'),.5,0,[
   ['사과를 짓이겨 사과술(cidre)을 담갔다.',{soc:1}],
   ['오주(Auge) 지방의 목초지에서 살찌운 소 떼가 푸아시 가축 시장으로 떠났다.',{}],
   ['젖소를 하루 세 번 짰다.',{hp:-1}],
   ['산울타리를 쳐 놓은 밭 사이 오솔길로 장에 갔다.',{}],
   ['사과술 증류주(calvados)에 세무원이 세금을 매기러 왔다.',{money:-3},()=>T()>=1804]]),
 S('pea_s_ile',()=>peas()&&peaAt('ile'),.5,0,[
   ['밤새 건초 수레를 몰아 새벽 파리 시장에 닿았다.',{money:5,hp:-1}],
   ['보스 평야의 대농장에서 수십 명의 추수꾼이 한 줄로 낫질하였다.',{}],
   ['파리 사람들이 마차를 타고 와서 시골 잔치를 구경하였다.',{}],
   ['파리 거름(gadoue)을 사서 밭에 뿌렸다.',{money:-3}],
   ['랑부예 왕립 목장에 에스파냐 메리노 양 떼가 들어왔다는 소문이 돌았다.',{},()=>s.year>=1786&&s.year<1800]]),
 S('pea_s_north',()=>peas()&&peaAt('picardie','champagne'),.5,0,[
   ['겨울에는 베틀에 앉아 상인이 맡긴 모직을 짰다.',{money:5}],
   ['사탕무를 심으라는 도지사의 공문이 왔다. 대륙 봉쇄로 설탕이 귀하다.',{},()=>T()>=1811&&T()<1815],
   ['사탕무 공장에 무를 실어 갔다.',{money:6},()=>T()>=1830],
   ['샹파뉴 메마른 백악 땅에서 양을 쳤다.',{},()=>peaAt('champagne')],
   ['코사크 기병들이 마을에 숙영하며 닭과 건초를 다 먹어 치웠다.',{money:-20,pol:-2},()=>T()>=1814&&T()<1816]]),
 S('pea_s_alsace',()=>peas()&&peaAt('alsace'),.5,0,[
   ['담배 잎을 헛간 서까래에 매달아 말렸다.',{money:4}],
   ['홉 덩굴을 장대에 감아 올렸다.',{}],
   ['재세례파(메노파) 농부가 클로버와 석회 거름으로 소출을 두 배로 올렸다고 한다.',{edu:1}],
   ['장날 독일 말과 프랑스 말이 뒤섞였다.',{}],
   ['감자를 삶아 아침으로 먹었다. 이곳에서는 오래전부터 먹던 것이다.',{hp:1}]]),
 S('pea_s_bourgogne',()=>peas()&&peaAt('bourgogne'),.5,0,[
   ['모르방 숲에서 벤 장작을 개울에 띄워 파리로 흘려보냈다(flottage).',{money:4,hp:-1}],
   ['포도밭 비탈의 흙이 빗물에 쓸려 내려가 바구니로 다시 져 올렸다.',{hp:-2}],
   ['브레스의 옥수수를 먹여 키운 닭을 장에 팔았다.',{money:4}],
   ['모르방 아낙들이 젖을 팔러 파리로 떠났다.',{},()=>T()>=1820]]),
 S('pea_s_auvergne',()=>peas()&&peaAt('auvergne'),.5,0,[
   ['여름 목초지 오두막(buron)에서 캉탈 치즈 덩이를 뒤집었다.',{hp:-1}],
   ['겨울에 사내들이 떠나 마을에 아낙과 노인만 남았다.',{}],
   ['파리에서 돌아온 이웃이 은화와 도시 소식을 풀어 놓았다.',{soc:1}],
   ['호밀빵이 돌처럼 굳어 도끼로 쪼갰다.',{}],
   ['살레르 붉은 소에 멍에를 메웠다.',{}]]),
 S('pea_s_south',()=>peas()&&peaAt('languedoc','provence'),.5,0,[
   ['올리브를 털어 방앗간에서 기름을 짰다.',{money:5},()=>peaM(10,11,0)],
   ['누에를 쳤다. 뽕잎 따는 소리가 밤낮으로 들렸다.',{money:6,hp:-1},()=>peaM(3,4,5)],
   ['미스트랄이 사흘을 불어 갓 심은 모종이 쓰러졌다.',{money:-3}],
   ['광야(désert)의 신교도 집회에서 목사의 설교를 몰래 들었다.',{faith:2},()=>s.faithKind==='protestant'&&s.year<1787],
   ['포도주를 통째로 팔았는데 값이 헐하다. 랑그도크의 포도주가 너무 많다.',{money:2},()=>peaAt('languedoc')],
   ['우물가 무화과나무 그늘에서 이웃들과 낮잠을 잤다.',{hp:1}]]),
 S('pea_s_gascogne',()=>peas()&&peaAt('gascogne'),.5,0,[
   ['옥수수 껍질 벗기기(dépouillère) 밤에 노래와 수수께끼가 오갔다.',{soc:2}],
   ['랑드의 목동이 높은 죽마를 타고 양 떼를 몰고 지나갔다.',{}],
   ['소달구지로 메테리의 수확 절반을 지주 집에 실어 날랐다.',{pol:1}],
   ['옥수수죽(millas)을 썰어 구워 먹었다.',{hp:1}],
   ['소나무 껍질에 칼집을 내어 송진을 받았다.',{money:4},()=>T()>=1820]]),
 S('pea_s_vendee',()=>peas()&&peaAt('vendee'),.5,0,[
   ['울타리 밭(bocage) 사이 움푹 꺼진 길이 비에 진창이 되었다.',{}],
   ['푸아투 노새를 키워 에스파냐 상인에게 팔았다.',{money:8}],
   ['늪지(marais)에서 장대를 짚고 수로를 건넜다.',{}],
   ['살찌운 소 떼를 몰고 파리로 가는 상인을 따라 장까지 걸었다.',{}]]),
 S('pea_s_dues',()=>peaCom()&&pre89(),.4,0,[
   ['성 마르탱 축일, 영주 관리인에게 거세한 수탉 두 마리와 귀리 몇 말을 바쳤다.',{money:-3}],
   ['영주의 화덕(four banal)에서 빵을 굽느라 아낙들이 줄을 섰다.',{}],
   ['영주의 토끼 사육장에서 나온 토끼들이 양배추 밭을 갉았다.',{money:-3,pol:1}],
   ['영주 재판소의 판사가 술집 다툼에 벌금을 매겼다.',{}],
   ['영주의 포도 수확이 끝나기 전에는 우리 포도를 딸 수 없다(ban de vendange).',{pol:1},()=>peaWine()],
   ['교회 맨 앞자리 영주 가족석이 텅 비어 있다. 영주는 파리에 산다.',{pol:1}]]),
 S('pea_s_rev',()=>peas()&&rev(),.5,0,[
   ['영주 집 마당에 5월의 나무(mai)를 세우고 “이제 지대는 없다”는 팻말을 걸었다.',{pol:3},()=>T()<1792.5],
   ['교회에서 영주 가족석 의자를 끌어내 불태웠다.',{pol:2},()=>T()<1793.5],
   ['광장에서 영주의 토지 대장과 공조 문서를 불살랐다. 1793년 7월 법이 그렇게 하라고 하였다.',{pol:3},()=>T()>=1793.35&&T()<1794],
   ['십일조가 사라졌다. 볏단을 하나도 떼지 않고 곳간에 들였다.',{money:8,pol:2},()=>T()>=1790.8],
   ['열흘마다 오는 휴일(décadi)에도 아낙들은 몰래 일요일을 지켰다.',{faith:2},()=>T()>=1793.75&&T()<1800],
   ['새 미터법의 ‘아르’와 ‘리터’를 아무도 쓰지 않았다. 다들 아르팡과 부아소로 셈한다.',{},()=>T()>=1795.5],
   ['선서를 거부한 신부가 헛간에서 몰래 미사를 올렸다.',{faith:3,sus:2},()=>T()>=1791.3&&T()<1801]]),
 S('pea_s_empire',()=>peas()&&T()>=1799.75&&T()<1815,.4,0,[
   ['측량사들이 와서 밭마다 줄자를 대고 번호를 매겼다. 새 토지 대장(cadastre)을 만든다고 한다.',{},()=>T()>=1808],
   ['통합세(droits réunis) 세무원이 지하실 포도주 통을 세었다.',{money:-4,pol:1},()=>T()>=1804.5],
   ['군대 수송에 말과 수레를 징발당했다.',{money:-12}],
   ['면장이 황제의 승전 소식을 교회 문 앞에서 읽었다.',{}],
   ['교회 종이 다시 울리고 신부가 돌아왔다. 정교 협약 덕이라고 한다.',{faith:3},()=>T()<1804]]),
 S('pea_s_after',()=>peas()&&T()>=1815,.4,0,[
   ['돌아온 귀족들이 십일조와 공조를 되살린다는 헛소문에 마을이 술렁였다.',{pol:2},()=>T()<1830],
   ['1816년 여름은 오지 않았다. 7월에도 비와 눈이 내려 밀이 여물지 못하였다.',{money:-15,hp:-3},()=>s.year===1816],
   ['면마다 초등학교를 세우라는 기조 법에 따라 마을에 학교가 생겼다.',{},()=>T()>=1833],
   ['밭에 석회를 뿌려 신 흙을 다스렸다. 소출이 늘었다.',{money:5},()=>T()>=1825],
   ['멀리서 철길 공사장의 망치 소리가 들렸다.',{},()=>T()>=1842],
   ['도발의 무쇠 쟁기를 이웃이 들여왔다.',{edu:1},()=>T()>=1825],
   ['저축은행(caisse d’épargne) 통장을 만든 이웃이 자랑하였다.',{},()=>T()>=1835]]),
 S('pea_s_women',()=>peas()&&!isM(),.5,0,[
   ['봄의 큰 빨래(la buée)를 하느라 잿물을 내리고 빨래터에서 사흘을 보냈다.',{hp:-1,soc:1}],
   ['빨래터에서 이웃 아낙들과 마을 소문을 나누었다.',{soc:2}],
   ['한 주 먹을 빵 열 덩이를 한꺼번에 구웠다.',{hp:-1}],
   ['거위 떼를 몰고 장에 가서 달걀과 함께 팔았다.',{money:5}],
   ['남자 품삯의 절반을 받고 포도밭 순 따기를 하였다.',{money:3}],
   ['젖을 뗀 아이를 업고 밭에서 김을 맸다.',{hp:-1},()=>kidsAlive().some(k=>s.year-k.y<=3)]]),
 S('pea_s_poor',()=>peas()&&peaT()===1,.5,0,[
   ['남의 곳간 짚더미에서 잠을 잤다.',{hp:-1}],
   ['부농의 밭에서 하루 품을 팔고 빵 한 덩이와 몇 수를 받았다.',{money:2}],
   ['비 오는 날은 품이 없어 공쳤다.',{}],
   ['한 칸짜리 초가에 짐승과 식구가 함께 잤다.',{}],
   ['품삯 대신 감자 한 자루를 받았다.',{hp:1},()=>T()>=1795],
   ['흉년에 빵값이 하루 품삯을 넘었다.',{hp:-3},()=>peaBad()]]),
 S('pea_s_rich',()=>peas()&&peaT()>=4,.4,0,[
   ['머슴과 하녀를 열 명 넘게 부렸다.',{}],
   ['읍내 공증인과 곡식 값을 의논하였다.',{soc:1}],
   ['아들을 읍내 중학교(collège)에 보냈다. 이웃들은 건방지다고 하였다.',{money:-20},()=>kidsAlive().some(k=>k.sex==='M'&&s.year-k.y>=10&&s.year-k.y<=16)],
   ['소작인들이 바친 지대 장부를 정리하였다.',{}],
   ['교회 앞줄 의자를 샀다.',{money:-5,soc:1}]]),
 S('pea_s_health',()=>peas(),.3,0,[
   ['무거운 자루를 지다 탈장이 생겨 띠를 둘렀다.',{hp:-3}],
   ['낫에 정강이를 베였다. 거미줄을 감아 피를 멎게 하였다.',{hp:-2},()=>peaM(5,6,7)],
   ['검게 변한 호밀(맥각)로 빵을 구운 집 사람들이 손발이 타는 듯하다며 쓰러졌다.',{hp:-2},()=>peaAt('auvergne','bretagne','champagne')],
   ['늪지의 열병(fièvres)이 가을마다 돌아왔다.',{hp:-3},()=>peaAt('gascogne','vendee','bourgogne','languedoc')],
   ['접골사가 삔 발목을 맞춰 주었다.',{hp:2,money:-1}]]),
 S('pea_s_village',()=>peas(),.4,0,[
   ['홀아비가 젊은 처녀와 재혼하자 젊은이들이 밤새 냄비를 두드리며 샤리바리를 벌였다.',{soc:1}],
   ['이웃 마을 젊은이들과 돌팔매 싸움이 벌어졌다.',{hp:-1,cour:1},()=>isM()&&s.age<30],
   ['종지기가 폭풍을 쫓으려고 종을 쳤다.',{}],
   ['마을 샘이 말라 먼 개울까지 물을 길으러 다녔다.',{hp:-1}],
   ['신부의 하녀와 방앗간지기가 수상하다는 소문이 돌았다.',{}],
   ['장터에서 다른 마을 사투리를 듣고 웃었다.',{}]]),
 S('pea_s_beasts',()=>peas()&&peaT()>=2,.4,0,[
   ['암소가 송아지를 거꾸로 낳아 밤새 씨름하였다.',{hp:-1}],
   ['암퇘지가 새끼 열 마리를 낳았다.',{money:5}],
   ['대장간에서 소 편자를 박았다.',{money:-2}],
   ['성 엘루아 축일에 말들을 꾸며 축복을 받았다.',{faith:1}],
   ['양 떼에 진드기병이 돌았다.',{money:-5}]])
);
