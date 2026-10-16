/* ================= 무작위 사건 ================= */
const S=(id,c,w,cd,lines,k)=>({id,c,w,cd,run:async()=>{let ls=lines.filter(l=>(!l[2]||l[2]())&&!(l[3]&&s.done['L:'+l[0]]));if(ls.length>1)ls=ls.filter(l=>l[0]!==s.lastLine);if(!ls.length)return;const x=pick(ls);s.lastLine=x[0];if(x[3])s.done['L:'+x[0]]=1;say(x[0]+fx(typeof x[1]==='function'?x[1]():x[1]||{}),k)}});
const C=(id,c,w,cd,title,fr,text,opts)=>({id,c,w,cd,run:async()=>{const T0=typeof text==='function'?text():text,os=typeof opts==='function'?opts():opts;
  const i=await Q(title,fr,T0,os.map(o=>({l:o.l,s:o.s,a:o.a,dis:o.dis})));await os[i].f();await done()}});
const pre89=()=>T()<1789.25, rev=()=>T()>=1789.25&&T()<1799.75, terror=()=>inTerror(), imp=()=>T()>=1799.75&&T()<1814;
const peas=()=>free()&&(s.estate==='peasant'||onTrack('farm'))&&!urban();
const town=()=>free()&&urban();
const gentry=()=>free()&&(noble()||rich());
// 장면 안에서 본문과 선택지가 같은 사람을 가리키도록 잠시 담아 두는 자리
let ev2P=null,ev2N='';
const skN=k=>(SKILLS.find(x=>x[0]===k)||[k,k])[1];
const ev2Who=r=>`${r.role} ${r.n}`;
const ev2He=r=>r.sex==='F'?'그녀':'그';

const EV=[
 // ---------- 어린 시절 ----------
 S('baby',()=>s.age<4,2,0,[
   ['걸음마를 떼었다.',{},null,1],['처음으로 “엄마”라고 말했다.',{},null,1],['밤새 열이 올라 어머니가 성모상 앞에서 기도하였다.',{hp:-2}],
   ['유모의 집이 있는 시골 마을로 보내져 젖을 먹고 자랐다.',{hp:-2},()=>(noble()||s.estate==='bourgeois'||s.region==='paris'),1],
   ['세례 대부가 은수저를 선물하였다.',{},()=>rich()||noble(),1],['이가 나느라 보챘다.',{}],['형들 뒤를 따라 아장아장 마당을 돌았다.',{hp:1}]]),
 S('cpeas',()=>child()&&s.age>=4&&s.estate==='peasant',1.6,0,[
   ['어린 손으로 이삭을 주웠다.',{hp:1,farm:1}],['거위 떼를 몰다가 개울에 빠졌다.',{str:1}],['장날에 아버지를 따라 읍내에 갔다.',{soc:1}],['나막신이 닳아 맨발로 다녔다.',{hp:-1}],['아버지를 따라 돌투성이 밭의 돌을 골라냈다.',{str:1,farm:1}],
   ['성 요한 축일 밤 모닥불을 뛰어넘었다.',{cour:2}],['영주님의 마차가 지나가자 모자를 벗고 길가에 섰다.',{},pre89],['늑대가 마을 근처에 나타났다는 소문에 밤새 떨었다.',{}],
   ['봄 순례 행렬을 따라 성당까지 걸었다.',{faith:2}],['흉년에 어머니가 메밀죽을 묽게 쑤었다.',{hp:-2},()=>price(s.year)>=1.3]]),
 S('ctown',()=>child()&&s.age>=4&&s.estate==='artisan',1.6,0,[
   ['퐁뇌프 다리 위 약장수와 인형극을 구경하였다.',{},()=>s.region==='paris'],['아버지 공방에서 대패 밥을 쓸었다.',{craft:1}],['빵집 앞 긴 줄에 서서 빵을 사 왔다.',{}],
   ['거리 가수가 왕비를 비꼬는 노래를 부르는 것을 따라 불렀다.',{pol:2},()=>s.year>=1780],['강가에서 동무들과 물장구를 쳤다.',{hp:1}],['공방 직인 형들의 패싸움을 구경하였다.',{cour:1}],
   ['교구 자선학교에서 교리문답을 외웠다.',{faith:2,edu:1}],['짐마차에 치일 뻔하였다.',{}],['직인 형이 버린 자투리로 작은 상자를 짜 보았다.',{dex:1,craft:1}]]),
 S('cnoble',()=>child()&&s.age>=5&&noble(),1.6,0,[
   ['무용 교사에게 미뉴에트를 배웠다.',{soc:2}],['처음으로 조랑말을 탔다.',{cour:2,ride:2}],['가정교사가 라틴어 문법책을 펼쳤다.',{edu:2}],
   ['아버지의 사냥에 따라나섰다.',{cour:1,hp:1}],['영지의 소작인 아이들과 몰래 어울리다 꾸중을 들었다.',{soc:1}],['펜싱 교사에게 처음 칼을 받았다.',{cour:2,arms:2},()=>isM()],
   ['베르사유 궁의 거울의 방을 구경하였다.',{soc:1},()=>s.estate==='epee'&&pre89(),1],['클라브생을 배우기 시작하였다.',{edu:1,music:2},()=>!isM()],['자수틀 앞에서 비단실로 꽃을 수놓았다.',{sew:2,dex:1},()=>!isM()]]),
 S('cbour',()=>child()&&s.age>=5&&s.estate==='bourgeois',1.6,0,[
   ['아버지의 상점 계산대에서 셈을 배웠다.',{edu:1,soc:1,trade:1}],['『텔레마크의 모험』을 읽었다.',{edu:2},()=>lit()],['어머니를 따라 마차를 타고 친척 집에 갔다.',{soc:1}],
   ['극장에서 몰리에르 희극을 보았다.',{soc:1}],['라틴어 동사 변화를 외우다 꾸중을 들었다.',{edu:1}],['습자 교사가 동판본을 펴 놓고 둥근 필기체를 가르쳤다.',{pen:2},()=>lit()]]),
 {id:'inoc',c:()=>child()&&s.age>=2&&s.age<=10&&s.year>=1756&&(noble()||s.estate==='bourgeois')&&!s.flags.inoc,w:.6,cd:99,run:async()=>{s.flags.inoc=true;
   if(R()<.5){say('부모가 의사를 불러 천연두 인두 접종을 시켰다. 며칠 앓고 털고 일어났다.'+fx({hp:3}));s.flags.immune=true}else say('부모는 인두 접종이 위험하다며 하지 않았다.')}},
 {id:'cill',c:()=>child()&&s.age>=1,w:1.1,cd:2,run:async()=>{const r=await roll(s.st.hp>=55?1:0,{label:'병치레'});if(r.v<=1)say(pick(['천연두를 앓았다. 얼굴에 곰보 자국이 남았다.','홍역으로 사경을 헤맸다.','이질로 몇 주를 앓았다.'])+fx({hp:-10}));else if(r.v===2)say('잔병치레가 잦았다.'+fx({hp:-4}));else say('감기를 앓다 털고 일어났다.'+fx({hp:1}))}},
 C('ccat',()=>child()&&s.age>=7,1,3,'어린 날','enfance','본당 신부가 교리 수업에 빠지지 말라고 했다. 동무들은 강가로 가재 잡으러 가자고 조른다.',[{l:'교리 수업에 간다',s:'신앙·학식',a:'pious study',f:()=>say('교리문답을 외웠다.'+fx({faith:3,edu:1}))},{l:'강가로 간다',s:'건강·사교',a:'social',f:()=>say('하루 종일 강가에서 놀았다.'+fx({hp:2,soc:2}))}]),

 // ---------- 농촌 ----------
 S('farm',peas,1.6,0,[
   ['보리 수확을 마쳤다.',{hp:1,farm:1,str:1}],['포도 수확철, 발로 포도를 밟았다.',{soc:1}],['장터에서 송아지를 팔았다.',{money:30,trade:1}],['소금세 관리가 집집마다 소금 통을 검사하였다.',{},pre89],
   ['십일조 징수원이 볏단 열 단 가운데 한 단을 실어 갔다.',{},()=>T()<1790],['영주의 비둘기 떼가 갓 뿌린 씨앗을 쪼아 먹었다.',{pol:2,bor:2},pre89],['영주의 방앗간에서 밀을 빻느라 하루를 기다렸다.',{},pre89],
   ['왕의 길 닦는 부역에 엿새 동안 끌려 나갔다.',{hp:-2,pol:1,str:1},()=>T()<1787],['이웃 결혼식에서 밤새 춤을 추었다.',{soc:2,rloc:1}],['우박이 쏟아져 밀밭이 쓰러졌다.',{money:-20,hp:-1}],
   ['마을 자유의 나무 아래서 공화력 축제를 열었다.',{pol:2},()=>T()>=1792.5&&T()<1800],['국민방위대 보초를 섰다.',{},()=>rev()&&isM()],['감자를 처음 심어 보았다.',{},()=>s.year>=1785],
   ['징발대가 와서 곡식과 말을 거두어 갔다.',{money:-30,pol:-3,bpw:2},()=>T()>=1793&&T()<1795],['교회 종탑의 종이 내려져 대포 공장으로 실려 갔다.',{faith:-1,pol:-2},()=>T()>=1793.5&&T()<1795],
   ['순례길에 생자크 성지 순례자들을 재워 주었다.',{faith:2,rloc:1}],['가뭄에 우물이 말랐다.',{hp:-2}]]),
 C('salt',()=>peas()&&pre89()&&['bretagne','normandie','vendee'].includes(loc())&&s.age<50,.8,3,'소금 밀매','faux-saunage','브르타뉴는 소금세가 없다. 국경 넘어 소금을 지고 오면 열 배 값에 팔린다. 붙잡히면 갤리선 노예다.',[
   {l:'밤에 소금 자루를 지고 넘는다',s:'의지·체력 판정',a:'bold greedy',f:async()=>{const {m,why}=md([[s.st.cour>=50,1,'의지'],[s.st.str>=55,1,'무거운 자루를 짊어질 힘'],[s.st.str<30,-1,'힘 부족'],[s.rep.rloc>=65,1,'마을이 숨겨 줌']]);const r=await roll(m,{label:'밀매',why});if(r.v>=4)say('소금을 팔아 한철 벌이를 했다. 마을 사람들은 밀매꾼을 제 편으로 여겼다.'+fx({money:60,cour:2,str:1,rpeople:2}));else if(r.v===1){say('소금세 순찰대에게 붙잡혔다.','big');if(await chance(.35,'갤리선 형','붙잡힌 밀매꾼 가운데 갤리선 노역형을 받은 비율')){say('툴롱 갤리선 노역장으로 끌려가 여섯 해를 노를 저었다.'+fx({hp:-25,cour:5}),'big')}else{say('벌금을 물고 풀려났다.'+fx({money:-50}))}}else say('순찰대를 피해 빈손으로 돌아왔다.')}},
   {l:'손대지 않는다',s:'',a:'safe',f:()=>say('밀매꾼들의 발소리를 모른 척하였다.')}]),
 C('poach',()=>peas()&&pre89()&&isM(),.7,4,'영주의 숲','braconnage','영주의 토끼가 밭을 망친다. 숲에 덫을 놓으면 고기를 먹을 수 있지만, 밀렵은 영주재판에 끌려간다.',[
   {l:'덫을 놓는다',s:'기술 판정',a:'bold',f:async()=>{const {m,why}=md([[s.st.dex>=50,1,'손재주'],[s.sk.farm>=40,1,'숲길을 앎'],[s.st.dex<25,-1,'서툰 손']]);const r=await roll(m,{label:'밀렵',why});if(r.v>=3)say('토끼 두 마리를 잡았다.'+fx({hp:2,dex:1}));else say('산지기에게 들켜 벌금을 물었다.'+fx({money:-30,pol:3,bor:2}))}},
   {l:'참는다',s:'',a:'safe',f:()=>say('밭을 망치는 토끼를 바라만 보았다.'+fx({pol:2,vord:1}))}]),

 // ---------- 도시 ----------
 S('town',town,1.5,0,[
   ['카바레에서 직인들과 싸구려 포도주를 마셨다.',{soc:1}],['빵집 앞 줄이 길어져 해 뜨기 전부터 섰다.',{hp:-1},()=>price(s.year)>=1.3],['센 강변 헌책방에서 낡은 책을 샀다.',{edu:1},()=>lit()&&s.region==='paris'],
   ['거리 가수가 왕비를 조롱하는 노래를 불렀다.',{pol:2},()=>s.year>=1780&&pre89()],['공방 직인들이 품삯을 올려 달라고 일손을 놓았다.',{pol:2,veq:1}],['성 엘루아 축일에 대장장이 조합의 행렬이 지나갔다.',{}],
   ['광장 신문 낭독회에서 『페르 뒤셴』을 들었다.',{pol:4},()=>T()>=1790.5&&T()<1794.25],['구민회에서 서로를 ‘시민’이라고 부른다.',{pol:2},()=>T()>=1792.5&&T()<1795],['거리 이름이 혁명식으로 바뀌었다.',{},()=>T()>=1792.5&&T()<1795,1],
   ['단두대로 가는 수레를 보았다.',{hp:-1},()=>T()>=1793&&T()<1794.5],['붉은 프리지아 모자를 쓴 상퀼로트가 퀼로트 입은 사람을 노려보았다.',{},()=>T()>=1792.5&&T()<1795],
   ['승전 축포가 울려 퍼졌다.',{},imp],['아케이드의 가스등 아래를 걸었다.',{},()=>s.year>=1820],['저녁 무렵 강물에 빠진 아이를 건져 냈다.',{fame:2,cour:2,rloc:4}],['부두에서 짐꾼들이 서로 먼저 짐을 지겠다고 다투었다.',{},()=>REGIONS[loc()].port||inParis()]]),
 C('cafe',()=>town()&&lit()&&s.year>=1760,.8,3,'카페','café Procope','카페에 둘러앉은 사람들이 최근 팸플릿을 두고 언성을 높인다.',()=>[
   {l:'개혁을 지지하는 쪽에 선다',s:'웅변 판정',a:'radical social',f:async()=>{const {m,why}=md([[s.sk.orat>=35,1,'웅변'],[s.st.soc>=55,1,'사교'],[s.st.edu>=60,1,'학식'],[s.sk.orat<10,-1,'말주변 없음']]);const r=await roll(m,{label:'논쟁',why});if(r.v>=4)say('논쟁에서 이겼다. 옆자리 사람들이 그대의 이름을 물었다.'+fx({pol:5,soc:2,orat:2,bch:2}));else say('말이 꼬여 상대에게 밀렸다. 그래도 생각은 바뀌지 않았다.'+fx({pol:3,orat:1}))}},
   {l:'왕권과 질서를 옹호한다',s:'웅변 판정',a:'royal',f:async()=>{const {m,why}=md([[s.sk.orat>=35,1,'웅변'],[s.st.edu>=60,1,'학식'],[T()>=1789.25,-1,'청중이 적대적']]);const r=await roll(m,{label:'논쟁',why});if(r.v>=5)say('조리 있는 말에 야유하던 이들도 잠잠해졌다.'+fx({pol:-5,soc:1,orat:2,brg:-2,sus:terror()?6:0}));else say('질서를 옹호했다가 야유를 받았다.'+fx({pol:-5,soc:1,orat:1,sus:terror()?6:0}))}},
   {l:'커피만 마신다',s:'',a:'safe',f:()=>say('조용히 커피를 마셨다.')}]),
 C('bookleg',()=>town()&&lit()&&pre89()&&s.year>=1760,.5,5,'금서','livres philosophiques','뇌샤텔에서 몰래 들여온 금서 꾸러미를 팔아 달라는 부탁을 받았다. 『철학자 테레즈』, 『2440년』… 붙잡히면 바스티유다.',[
   {l:'맡아서 판다',s:'사교·장사 판정',a:'greedy bold',f:async()=>{const {m,why}=md([[s.st.soc>=50,1,'사교'],[s.sk.trade>=35,1,'장사 솜씨'],[s.rep.rguild>=65,1,'믿을 만한 거래처']]);const r=await roll(m,{label:'금서 판매',why});if(r.v>=3)say('금서는 금세 팔렸다.'+fx({money:150,pol:3,trade:1,brl:2}));else if(r.v===1){say('국왕의 봉인장(레트르 드 카셰)으로 바스티유에 갇혔다.','big');s.cond='prison';s.prisonKind='plain';s.condSince=T();fx({fame:3,pol:6})}else say('경찰 첩자의 눈치를 채고 꾸러미를 강물에 버렸다.')}},
   {l:'거절한다',s:'',a:'safe',f:()=>say('거절하였다.')}]),

 // ---------- 귀족·부유층 ----------
 S('gentry',gentry,1.3,0,[
   ['파로 도박판에서 하룻밤에 큰돈을 잃었다.',{money:()=>-Math.round(s.money*.05)},()=>noble()],['오페라 극장에서 글루크의 오페라를 보았다.',{soc:1}],['영지 관리인이 올해 지대 장부를 올렸다.',{}],
   ['살롱에서 볼테르의 새 편지가 낭독되었다.',{edu:1,pol:2},()=>pre89()&&s.year<1779],['초상화가에게 초상화를 맡겼다.',{money:-200,relite:1}],['사냥에서 사슴을 쫓다 낙마하였다.',{hp:-4},()=>s.sk.ride<40],['사슴 사냥에서 몰이꾼보다 먼저 사슴을 따라잡았다. 손님들이 그대의 말솜씨를 칭찬했다.',{ride:1,relite:2},()=>s.sk.ride>=40],
   ['국유재산 경매장에서 수도원 건물이 헐값에 팔리는 것을 보았다.',{},()=>T()>=1790&&T()<1800],['총재정부 시절의 무도회에 ‘희생자 무도회’가 유행하였다.',{soc:1},()=>T()>=1795&&T()<1799],
   ['황후의 말메종 정원을 거닐었다.',{soc:1},()=>imp()&&s.fame>=50],['돌아온 망명 귀족들이 거들먹거렸다.',{},()=>T()>=1814&&T()<1830]]),
 C('duel',()=>gentry()&&isM()&&noble()&&s.age>=18&&s.age<=45,.5,6,'결투 신청','duel','무도회에서 한 기사가 그대의 가문을 모욕하였다. 장갑이 던져졌다.',[
   {l:'결투를 받아들인다',s:'의지·무예 판정',a:'bold',f:async()=>{const {m,why}=md([[s.st.cour>=55,1,'의지'],[s.st.cour<35,-1,'겁'],[s.sk.arms>=40,1,'검술'],[s.sk.arms<15,-1,'칼이 서툶'],[s.st.str>=60,1,'완력'],[s.st.hp<35,-1,'병약']]);const r=await roll(m,{label:'결투',why});if(r.v>=4)say('상대의 팔을 베어 명예를 지켰다.'+fx({fame:4,cour:3,arms:2,relite:3,vhon:2}));else if(r.v===1){if(await chance(.3,'결투의 상처','결투 부상의 치사율')){die('duel');return}say('옆구리를 찔려 몇 달을 앓았다.'+fx({hp:-15}))}else say('첫 피를 보고 결투가 끝났다.'+fx({fame:1}))}},
   {l:'사과를 받아 내고 물러선다',s:'',a:'safe',f:()=>say('비겁하다는 뒷말이 돌았다. 결투를 금한 왕의 칙령을 들어 변명했다.'+fx({fame:-3,relite:-4,vhon:-2,vord:1}))}]),
 C('mason',()=>free()&&lit()&&s.year>=1755&&s.year<1793&&(gentry()||s.estate==='bourgeois'||onTrack('law'))&&!s.flags.mason,.6,99,'프리메이슨','franc-maçonnerie','지인이 프리메이슨 지부에 들어오라고 권한다. 귀족과 상인과 법률가가 ‘형제’로 앉는 곳이다.',()=>[
   {l:'입회한다',s:'입회비 150',a:'social',dis:s.money<150,f:()=>{s.flags.mason=true;say('눈가리개를 쓰고 입회 의식을 치렀다. 지부의 ‘형제’들 가운데 쓸모 있는 사람이 많았다.'+fx({money:-150,soc:3,fame:2,pol:3,relite:2,inf:2,vlib:2}))}},
   {l:'사양한다',s:'',a:'safe pious',f:()=>say('정중히 사양하였다.')}]),

 // ---------- 혁명기 ----------
 C('denounce',()=>free()&&terror(),1.2,1,'고발','dénonciation',()=>`감시위원회 사람이 넌지시 묻는다. 이웃 ${person()}이 왕당파 노래를 흥얼거리지 않더냐고.`,[
   {l:'들은 대로 말한다',s:'혐의는 줄지만 원한을 산다',a:'safe radical',f:()=>{s.seeds.push({t:'denounced',n:person(),y:s.year});say('이웃의 이름을 댔다. 사흘 뒤 그 집에 불이 꺼졌다. 골목 사람들이 그대 앞에서 말을 아꼈다.'+fx({sus:-8,faith:-3,rloc:-6,vjus:-3}))}},
   {l:'모른다고 한다',s:'',a:'pious',f:()=>{s.seeds.push({t:'saved',n:person(),y:s.year});say('아무것도 못 들었다고 했다.'+fx({sus:4,rloc:2,vjus:2}))}}]),
 S('revcity',()=>free()&&rev(),1.1,0,[
   ['삼색 모표를 모자에 달았다.',{pol:1},()=>T()<1795,1],['공화력의 열흘 주(데카드)에 맞춰 쉬었다.',{},()=>T()>=1793.75&&T()<1802],['‘최고존재’ 제전의 행렬을 보았다.',{},()=>s.year===1794&&s.season===1],
   ['빵 배급표를 받았다.',{},()=>T()>=1793.5&&T()<1796&&urban()],['빵집 앞 줄에서 아낙들이 정부를 욕하였다. 하루치 배급이 반 리브르로 줄었다.',{hp:-1,pol:2},()=>T()>=1795&&T()<1796&&urban()&&econ().supply<40],['아시냐 지폐를 받지 않겠다는 상인과 다투었다.',()=>({money:-Math.round(10/Math.max(.1,econ().cur))}),()=>T()>=1792&&T()<1797],['위조 아시냐가 섞여 있었다.',{money:-20},()=>T()>=1791&&T()<1796],
   ['미터법의 새 저울과 자를 장만했다.',{},()=>s.year>=1799,1],['혁명 연극 『왕들의 최후 심판』을 보았다.',{pol:3},()=>T()>=1793.5&&T()<1794.5&&urban()]]),
 C('femclub',()=>free()&&!isM()&&inParis()&&T()>=1793&&T()<1793.75&&!s.flags.femClub,1.5,99,'혁명 여성 시민 클럽','citoyennes républicaines','클레르 라콩브와 폴린 레옹이 혁명 여성 시민 클럽을 열었다. 붉은 모자를 쓴 여인들이 무기를 들 권리를 외친다.',[
   {l:'회원이 된다',s:'',a:'radical bold',f:()=>{s.flags.femClub=true;say('붉은 모자를 쓰고 클럽 회합에 나갔다.'+fx({pol:10,fame:3,cour:3,rpeople:3,relite:-3,veq:3}))}},
   {l:'멀리한다',s:'',a:'safe',f:()=>say('지나가며 소리만 들었다.')}]),
 C('olympe',()=>free()&&!isM()&&lit()&&T()>=1791.5&&T()<1793.75&&!s.done.olympe,1,99,'여성의 권리','Déclaration des droits de la femme','올랭프 드 구주의 「여성과 여성 시민의 권리 선언」이 돌고 있다. “여성은 단두대에 오를 권리가 있다. 그렇다면 연단에 오를 권리도 있다.”',[
   {l:'읽고 친구들에게 돌린다',s:'',a:'radical',f:()=>{s.done.olympe=1;say('친구들과 밤새 이야기를 나누었다.'+fx({pol:6,edu:2,sus:2,veq:3}))}},
   {l:'관심 없다',s:'',a:'safe',f:()=>{s.done.olympe=1;say('읽지 않았다.')}}]),

 // ---------- 교회 ----------
 S('church',()=>free()&&(priest()||nun()),1.6,0,[
   ['아침 미사를 집전하였다.',{faith:1},()=>priest()],['교구민의 고해를 들었다.',{soc:1},()=>priest()],['주일 강론을 하였다. 졸던 교구민들이 고개를 들었다.',{orat:2},()=>priest()],['흉년에 교구 빈민에게 빵을 나누었다.',{fame:2,money:-20,rloc:3,rpeople:2},()=>priest()],['주교의 순시를 맞았다.',{}],
   ['성무일도를 바쳤다.',{faith:2}],['수녀원 봉쇄 정원에서 장미를 돌보았다.',{hp:1},()=>nun()],['병원에서 환자들을 돌보았다.',{fame:1,hp:-1,heal:1,rpeople:1},()=>nun()],['수련 수녀들에게 성가를 가르쳤다.',{},()=>nun()]]),
 // ---------- 군대 ----------
 S('army',()=>free()&&soldier(),1.6,0,[
   ['밤새 행군하였다.',{hp:-2,str:1}],['야영지에서 동료들과 「라 마르세예즈」를 불렀다.',{pol:2},()=>T()>=1792.5&&T()<1804],['군화가 닳아 해진 천으로 발을 감쌌다.',{hp:-1},()=>T()>=1792&&T()<1800],
   ['사열식에서 황제를 가까이에서 보았다.',{cour:1},imp],['동료의 편지를 대신 써 주었다.',{soc:1,pen:1,rguild:1},()=>lit()],['총검술 훈련에서 하사관에게 칭찬을 들었다.',{arms:2},()=>s.st.str>=45],['병참이 끊겨 농가를 징발하였다.',{},()=>atWar()],['막사에 이질이 돌았다.',{hp:-5}],['주둔지 처녀와 정분이 났다.',{soc:1}]]),
 C('desert',()=>free()&&soldier()&&job().t<=2&&atWar(),.5,4,'탈영','désertion','동료 몇이 오늘 밤 탈영하자고 한다. 고향이 멀지 않다.',[
   {l:'따라간다',s:'붙잡히면 총살될 수 있다',a:'bold family',f:async()=>{const {m,why}=md([[s.st.cour<50,-1,'겁'],[s.st.str>=60,1,'밤새 걸을 힘'],[s.st.str<30,-1,'지친 몸'],[s.sk.ride>=40,1,'말을 훔쳐 탐']]);const r=await roll(m,{label:'탈영',why});if(r.v>=3){loseJob('밤중에 진영을 빠져나와 % 자리를 버렸다.');s.cond='hiding';s.flags.refractaire=true;fx({sus:15})}else{if(await chance(.2,'탈영병 처형','붙잡힌 탈영병의 총살 비율')){die('shot','탈영하다 붙잡혀 본보기로 총살되었다.');return}say('붙잡혀 영창에 갇혔다.'+fx({hp:-5,fame:-3}))}}},
   {l:'남는다',s:'',a:'safe',f:()=>say('남기로 했다.'+fx({cour:1,rguild:2,vhon:1}))}]),

 // ---------- 공통 ----------
 S('daily',()=>free(),1,0,[
   ['독감으로 일주일을 누워 지냈다.',{hp:-3}],['옛 친구를 우연히 만났다.',{soc:1}],['성탄 자정 미사에 갔다.',{faith:1},()=>!(T()>=1793.75&&T()<1795)],['이가 아파 떠돌이 치과의사에게 뽑았다.',{hp:-1}],
   ['혜성이 나타나 사람들이 불길하다고 수군댔다.',{},()=>[1759,1769,1811].includes(s.year)],['일식을 보았다.',{},()=>[1764,1788,1820,1842].includes(s.year)],['맑은 날, 먼 데까지 걸었다.',{hp:1}]]),
 C('loan',()=>free()&&s.money>=400,.6,4,'돈 부탁','prêt',()=>{ev2P=relsAlive().find(r=>['친구','동료'].includes(r.role)&&r.close>=40)||null;ev2N=ev2P?ev2P.n:person();return `${ev2P?ev2Who(ev2P):ev2N}${bat(ev2N)?'이':'가'} 사업이 어렵다며 300 ${money()}을 빌려 달라고 한다.`},()=>{const r=ev2P,n=ev2N;return [
   {l:'빌려준다',s:'재산 -300',a:'social',f:()=>{s.seeds.push({t:'debtor',n,y:s.year,a:Math.round(300*(1+R()*.3))});say('돈을 빌려주었다.'+fx({money:-300,soc:2})+(r?relFx(r,{trust:10,close:6}):''))}},
   {l:'거절한다',s:'',a:'greedy safe',f:()=>say('거절하였다.'+(r?relFx(r,{close:-10,trust:-4}):''))}]}),
 C('unhappy',()=>free()&&s.married&&s.spouse&&s.spouse.alive&&!s.flags.unhappy,.4,8,'부부 사이','ménage',()=>`${jo(s.spouse.n,'과','와')} 다툼이 잦아졌다.`,[
   {l:'참고 화해한다',s:'',a:'safe family',f:()=>say('성당에 함께 가며 화해하였다.'+fx({soc:1,rfam:2,vfam:1}))},
   {l:'따로 지낸다',s:'',a:'',f:()=>{s.flags.unhappy=true;say('한 지붕 아래 남처럼 지냈다.'+fx({hp:-2,rfam:-4}))}}]),
 C('paris',()=>free()&&loc()!=='paris'&&s.age>=16&&s.age<=35&&!s.flags.askedParis,.5,99,'파리로','monter à Paris','고향 친구가 파리로 올라가자고 한다. 일자리도, 기회도, 위험도 거기 있다.',[
   {l:'파리로 올라간다',s:'',a:'bold',f:()=>{s.flags.askedParis=true;s.loc='paris';if(onTrack('farm'))loseJob();say('역마차를 타고 파리에 닿았다. 생탕투안 문밖에 셋방을 얻었다.'+fx({soc:2,rfam:-2,vlib:2}),'big')}},
   {l:'고향에 남는다',s:'',a:'safe family',f:()=>{s.flags.askedParis=true;say('고향에 남기로 했다.'+fx({rfam:2,vfam:1}))}}]),
 C('memoir',()=>free()&&lit()&&s.age>=50&&!s.flags.book,.4,99,'회고록','mémoires','지나온 일을 적어 두라고 권하는 이가 있다.',[
   {l:'붓을 든다',s:'학식·문장 판정',a:'study',f:async()=>{const {m,why}=md([[s.st.edu>=60,1,'학식'],[s.sk.pen>=45,1,'문장력'],[s.sk.pen<10,-1,'붓이 낯섦']]);const r=await roll(m,{label:'집필',why});if(r.v>=4){s.flags.book=true;say('회고록을 펴냈다. 생각보다 많이 팔렸다.'+fx({fame:6,money:200,pen:2}),'big')}else say('원고는 서랍 속에 남았다.'+fx({edu:1,pen:1}))}},
   {l:'지난 일은 묻어 둔다',s:'',a:'safe',f:()=>say('지난 일은 말하지 않았다.')}]),

 // ---------- 사람 · 평판 · 솜씨 · 몸 · 고장 살림 (능력치 체계) ----------
 // 빵 폭동: 물가가 오르고 곡물이 모자란 해에 일어나고, 품삯으로 사는 이일수록 절박하다
 C('ev2_bread',()=>free()&&s.age>=16&&!priest()&&!nun()&&(econ().price>=1.35||econ().supply<=45),1.4,3,'곡물 수레','taxation populaire',()=>{const e=econ();
   return `장날, 시장에 밀 자루가 ${e.supply<35?'거의 보이지 않았다':'적게 나왔다'}. ${urban()?`4리브르짜리 빵 한 덩이가 ${Math.round(9*e.price)}수까지 올랐다.`:'곡물상들이 마을 밀을 도시로 실어 가려 한다.'} ${wageEarner()?'하루 품삯의 절반 넘게 빵값으로 나간다. ':rich()?'그대의 곳간에는 아직 밀이 있다. ':''}아낙들이 앞장서서 곡물 수레를 막아섰다. 정당한 값에 팔라는 것이다.`},()=>[
   {l:'무리에 끼어 정당한 값에 팔게 한다',s:'의지·체력 판정',a:'bold radical',f:async()=>{const e=econ();const {m,why}=md([[s.st.cour>=45,1,'의지'],[s.st.str>=55,1,'완력'],[s.rep.rpeople>=60,1,'민중의 신망'],[e.supply<35,1,'군중이 크게 불어남'],[s.st.str<30,-1,'힘 부족']]);const r=await roll(m,{label:'곡물 수레',why});
     if(r.v>=4)say('군중은 밀을 평년 값에 팔게 하고 그 돈을 자루 옆에 두고 갔다. 아무것도 훔치지 않았다는 것이 자랑이었다.'+fx({money:wageEarner()?15:5,rpeople:4,relite:-3,veq:2,bor:2,sus:rev()?0:3}));
     else{say(`${T()<1791?'기마경찰대(마레쇼세)':'헌병대'}가 몰려와 앞장선 몇 사람을 붙잡았다.`+fx({hp:-4,sus:8,rpeople:2}));if(r.v===1&&await chance(.25,'투옥','곡물 폭동 가담자 가운데 재판에 넘겨진 비율')){say('주동자로 몰려 감옥에 갇혔다.','big');s.cond='prison';s.prisonKind='plain';s.condSince=T()}}}},
   {l:'사람들을 달래고 관리에게 공정가를 청한다',s:'웅변·평판 판정',a:'social safe',f:async()=>{const {m,why}=md([[s.sk.orat>=35,1,'웅변'],[s.st.soc>=55,1,'사교'],[s.rep.rloc>=60,1,'이웃의 신망'],[influence().v>=20,1,'영향력'],[s.rep.rloc<=30,-1,'나쁜 평판']]);const r=await roll(m,{label:'중재',why});
     if(r.v>=4)say('관리가 곡물상에게 시장에서 정해진 값에 팔라고 명했다. 수레는 무사히 지나갔다.'+fx({rloc:4,inf:2,orat:1,vord:2}));else say('“배부른 소리!” 야유가 돌아왔다.'+fx({rpeople:-3,orat:1}))}},
   rich()?{l:'곳간의 밀을 이웃에게 원가에 푼다',s:'재산 -80',a:'family pious',f:()=>say('곳간 문을 열고 밀을 됫박으로 팔았다. 매점꾼이라는 말은 그대에게 붙지 않았다.'+fx({money:-80,rloc:5,rpeople:3,vjus:2}))}:
   {l:'문을 걸어 잠근다',s:'',a:'safe',f:()=>say('창 너머로 고함 소리를 들었다.'+fx({vord:1}))}]),
 // 벗의 부탁: 관계 인물이 실제로 도움을 청한다
 C('ev2_friend',()=>free()&&relsAlive().some(r=>['친구','동료'].includes(r.role)&&r.close>=40),.8,3,'벗의 부탁','un service',()=>{ev2P=pick(relsAlive().filter(r=>['친구','동료'].includes(r.role)&&r.close>=40));
   const r=ev2P;return `${ev2Who(r)}${bat(r.n)?'이':'가'} 찾아왔다. ${!urban()?'비가 오기 전에 밀단을 거둬들여야 하는데 일손이 모자란다고 한다.':R()<.5?'셋방에서 쫓겨나 오늘 안에 짐을 옮겨야 한다고 한다.':'빚쟁이에게 몰려 집기를 압류당하게 생겼다고 한다.'} ${ev2He(r)}의 눈빛이 간절하다.`},()=>{const r=ev2P;return [
   {l:'팔을 걷어붙이고 거든다',s:'체력 판정',a:'family work',f:async()=>{const {m,why}=md([[s.st.str>=50,1,'체력'],[!urban()&&s.sk.farm>=30,1,'농사 솜씨'],[s.st.str<30,-1,'힘 부족'],[s.age>=55,-1,'나이']]);const r2=await roll(m,{label:'일손 거들기',why});
     if(r2.v>=3)say(`해 질 녘까지 ${r.n}${bat(r.n)?'과':'와'} 함께 일을 끝냈다. ${ev2He(r)}는 그대 손을 오래 붙잡았다.`+fx({str:1,rloc:1})+relFx(r,{close:10,trust:6}));else say(`짐을 들다 허리를 삐끗했다. 그래도 ${ev2He(r)}는 고마워했다.`+fx({hp:-3})+relFx(r,{close:6,trust:3}))}},
   {l:'돈을 보탠다',s:'재산 -40',a:'social',dis:s.money<40,f:()=>say(`${r.n}에게 40 ${money()}을 쥐여 주었다.`+fx({money:-40})+relFx(r,{trust:6,close:4}))},
   {l:'바쁘다며 돌려보낸다',s:'',a:'safe greedy',f:()=>say(`${r.n}${bat(r.n)?'은':'는'} 말없이 돌아갔다.`+fx({rloc:-1})+relFx(r,{close:-12,trust:-8}))}]}),
 // 스승: 숙련을 기르는 길. 이미 스승이 있으면 그에게서 배운다
 C('ev2_mentor',()=>free()&&s.age>=14&&s.age<40&&!rich()&&(!!job()||['artisan','peasant'].includes(s.estate)),.8,6,'솜씨를 물려받다','le tour de main',()=>{const k=mainSkill();ev2P=relsAlive().find(r=>r.role==='스승')||null;ev2N=ev2P?ev2P.n:person();
   const j=job(),who=ev2P?'스승 ':({army:'고참 하사관 ',church:'노신부 ',law:'노련한 선배 ',med:'늙은 외과의 ',farm:'늙은 농부 ',letters:'나이 든 문필가 ',pol:'노련한 선배 '}[j&&j.tr]||(s.estate==='peasant'?'늙은 농부 ':'늙은 장인 '));return `${who}${ev2N}${bat(ev2N)?'이':'가'} 그대의 ${skN(k)} 솜씨를 눈여겨보았다. 저녁마다 손수 요령을 가르쳐 주겠다고 한다. 대신 ${ev2P?ev2He(ev2P):'그'}의 일을 거들어야 한다.`},()=>{const k=mainSkill(),r=ev2P,n=ev2N;return [
   {l:'배운다',s:'기술 판정',a:'study work',f:async()=>{const {m,why}=md([[s.st.dex>=45,1,'손재주'],[(s.sk[k]||0)>=30,1,'기초가 있음'],[s.st.edu>=50,1,'배움이 빠름'],[s.st.dex<25,-1,'둔한 손']]);const r2=await roll(m,{label:'수련',why});
     const g=r2.v>=5?7:r2.v>=3?5:2;let rel='';if(r)rel=relFx(r,{resp:6,close:5});else{const nr=addRel('스승',{n,close:55,resp:60,sex:'M'});if(nr)rel=` (${n}${bat(n)?'을':'를'} 스승으로 모시게 되었다)`}
     say((r2.v>=5?'몇 해 걸릴 요령을 한 철 만에 익혔다.':r2.v>=3?'손끝에 새 요령이 붙었다.':'꾸중만 실컷 들었다. 그래도 조금은 늘었다.')+fx({[k]:g,dex:1})+rel)}},
   {l:'사양한다',s:'',a:'safe',f:()=>say('저녁은 쉬고 싶었다.'+(r?relFx(r,{close:-5}):''))}]}),
 // 맞수의 모함
 C('ev2_rival',()=>free()&&!!rival(),.8,3,'맞수의 모함','calomnie',()=>{ev2P=rival();const r=ev2P;
   return terror()?`맞수 ${r.n}${bat(r.n)?'이':'가'} 구 감시위원회에 그대가 ‘온건파’라고 귀띔했다는 말이 들린다.`:`맞수 ${r.n}${bat(r.n)?'이':'가'} 동업자들 사이에 그대의 일솜씨가 엉터리라고 떠들고 다닌다.`},()=>{const r=ev2P,k=mainSkill();return [
   {l:'솜씨로 보여 준다',s:'숙련 판정',a:'work bold',f:async()=>{const {m,why}=md([[(s.sk[k]||0)>=40,1,skN(k)],[s.st.dex>=55,1,'기술'],[s.rep.rguild>=60,1,'동업자들의 신뢰'],[(s.sk[k]||0)<15,-1,'솜씨 부족']]);const r2=await roll(m,{label:'솜씨 겨루기',why});
     if(r2.v>=4)say(`동업자들 앞에서 일을 해 보였다. 아무도 ${r.n}의 말을 믿지 않게 되었다.`+fx({rguild:5,[k]:1,sus:terror()?-3:0})+relFx(r,{riv:5,resp:8}));else say('하필 그날 손이 떨렸다. 뒷말이 더 커졌다.'+fx({rguild:-4,sus:terror()?6:0})+relFx(r,{riv:3}))}},
   {l:'사람들 앞에서 따져 묻는다',s:'웅변 판정',a:'social bold',f:async()=>{const {m,why}=md([[s.sk.orat>=35,1,'웅변'],[s.st.soc>=55,1,'사교'],[s.rep.rloc>=60,1,'이웃의 신망']]);const r2=await roll(m,{label:'말싸움',why});
     if(r2.v>=4)say(`${r.n}의 거짓말을 하나하나 짚었다. ${ev2He(r)}는 얼굴을 붉히고 자리를 떴다.`+fx({rloc:2,rguild:2,orat:1,sus:terror()?-3:0})+relFx(r,{riv:6}));else say('언성만 높아졌다. 둘 다 체면을 잃었다.'+fx({rloc:-2,orat:1})+relFx(r,{riv:4}))}},
   {l:'같은 수로 갚아 준다',s:'',a:'greedy',f:()=>say(`${r.n}의 빚 이야기를 술집에 흘렸다. ${ev2He(r)}도 한동안 고개를 들지 못했다.`+fx({rguild:1,rloc:-2,vhon:-2})+relFx(r,{riv:10,close:-10}))}]}),
 // 후원자의 손길: 영향력을 얻는 대신 그의 편이 된다
 C('ev2_patron',()=>free()&&!!patron(),.8,4,'후원자의 만찬','protection',()=>{ev2P=patron();const r=ev2P;const f=r.fac&&FAC[r.fac]&&activeFactions().some(x=>x.id===r.fac)?FAC[r.fac]:null;
   return `후원자 ${r.n}${bat(r.n)?'이':'가'} ${ev2He(r)}의 집 만찬에 그대를 불렀다. 쓸모 있는 사람들을 소개해 주겠다고 한다. ${f?`${ev2He(r)}는 ${f.n} 사람이다. 식탁에서 그대가 어느 편인지 모두가 알게 될 것이다.`:'대신 그의 일에 그대의 이름을 빌려 달라고 한다.'}`},()=>{const r=ev2P;const f=r.fac&&FAC[r.fac]&&activeFactions().some(x=>x.id===r.fac)?r.fac:null;return [
   {l:`${ev2He(r)}의 사람이 된다`,s:'영향력 +',a:'social greedy',f:()=>{let x='';if(f){frelAdd(f,8);if(s.party&&s.party!==f&&facPair(s.party,f)<=-40){frelAdd(s.party,-8);x=` ${FAC[s.party].n}의 동지들이 그대를 곱지 않게 보았다.`}}
     say(`만찬에서 ${jo(pick(T()<1790?['재무관','고등법원 판사','징세청부인','지방 감독관의 비서']:T()<1800?['의원','은행가','군납업자','구 위원']:['도지사','은행가','국사원 위원','의원']),'과','와')} 인사를 나누었다.`+x+fx({inf:4,relite:3,soc:1})+relFx(r,{trust:8,close:5}))}},
   {l:'만찬에는 가되 약속은 하지 않는다',s:'',a:'safe social',f:()=>say('정중히 웃으며 술잔만 비웠다.'+fx({inf:1,relite:1})+relFx(r,{trust:-3}))},
   {l:'남의 그늘에 서지 않겠다며 사양한다',s:'',a:'bold',f:()=>say(`홀로 서겠다고 말했다. ${ev2He(r)}는 서운한 기색이었다.`+fx({vlib:2,vhon:1})+relFx(r,{close:-8,trust:-5}))}]}),
 // 몸으로 하는 일: 체력
 S('ev2_body',()=>free()&&s.age<60&&(peas()||wageEarner()||soldier()),1,2,[
   ['장정 둘이 드는 밀 자루를 혼자 짊어지고 방앗간까지 걸었다.',{str:1,rloc:1},()=>s.st.str>=60&&!urban()],
   ['큰 낫으로 하루 종일 풀을 베었다. 저녁엔 팔이 올라가지 않았다.',{str:1,farm:1,hp:-1},()=>!urban()],
   ['쟁기를 끌던 소가 멈춰 섰다. 손잡이를 붙든 채 한 고랑을 끝까지 갈았다.',{farm:2,str:1},()=>peas()],
   ['짐을 지다 허리를 삐끗해 사흘을 누웠다.',{hp:-3,money:-10},()=>s.st.str<35],
   ['센 강 하역장에서 장작 뗏목을 끌어올렸다.',{str:2,money:8},()=>inParis()&&wageEarner()&&isM()],
   ['빨래터에서 젖은 빨래 바구니를 이고 언덕을 올랐다.',{str:1},()=>!isM()&&!urban()],['강가 빨래배에서 남의 빨래를 두드려 품삯을 받았다. 저녁엔 손이 갈라졌다.',{str:1,money:5,hp:-1},()=>!isM()&&urban()&&wageEarner()],['물장수가 오지 않아 우물물을 길어 다락방까지 여섯 층을 올랐다.',{str:1},()=>urban()&&!rich()],['장작 한 짐을 지고 장터에서 돌아왔다.',{str:1},()=>!rich()],
   ['품팔이 장(그레브 광장)에서 체격이 좋다며 맨 먼저 뽑혔다.',{money:12},()=>inParis()&&wageEarner()&&s.st.str>=55],
   ['품팔이 장에서 해가 질 때까지 아무도 불러 주지 않았다.',{money:-5},()=>wageEarner()&&(s.st.str<35||econ().jobs<45)],
   ['행군 중 쓰러진 동료의 배낭을 대신 졌다.',{str:1,rguild:2},()=>soldier()&&s.st.str>=45],['진지 공사로 하루 종일 참호를 팠다.',{str:1,hp:-1},()=>soldier()],['행군 대열에서 뒤처져 하사관에게 욕을 먹었다.',{rguild:-1},()=>soldier()&&s.st.str<40],
   ['수확 일꾼들과 낫질 내기를 해서 이겼다.',{str:1,farm:1,rloc:2},()=>!urban()&&s.st.str>=55&&isM()],
   ['품삯이 올라 일꾼들이 웃었다. 일손이 모자라 농가마다 사람을 찾는다.',{money:10},()=>!urban()&&wageEarner()&&econ().wage>=1.2]]),
 // 솜씨가 쓰이는 자리: 숙련
 S('ev2_skill',()=>free()&&s.age>=14,1,1,[
   ['신부가 성당 제단보를 기워 달라고 맡겼다. 바늘땀이 곱다는 칭찬을 들었다.',{sew:1,rloc:2},()=>s.sk.sew>=35&&s.faithKind==='catholic'],
   ['이웃 처녀의 혼례 옷 품을 맞추어 주었다.',{sew:1,money:10,rloc:1},()=>s.sk.sew>=45],
   ['글 모르는 이웃의 청원서와 편지를 대신 써 주었다.',{pen:1,rloc:2},()=>lit()&&s.sk.pen>=30&&!rich()],
   ['공증인 사무소의 증서를 정서해 주고 품삯을 받았다.',{pen:1,money:15},()=>lit()&&s.sk.pen>=45&&!rich()],
   ['부러진 아이의 팔을 맞추고 부목을 대 주었다.',{heal:1,rloc:3},()=>s.sk.heal>=30],
   ['조합 검사관(쥐레)이 그대가 만든 물건에 흠잡을 데가 없다고 했다.',{craft:1,rguild:3},()=>s.sk.craft>=45&&T()<1791.25],
   ['단골들이 그대의 물건만 찾는다며 다른 가게 주인들이 시샘했다.',{craft:1,rguild:-1,money:20},()=>s.sk.craft>=55],
   ['장터에서 흥정 끝에 도매상보다 싸게 물건을 떼어 왔다.',{trade:1,money:20},()=>s.sk.trade>=40],
   ['외상 장부를 맞춰 보다 셈이 틀린 곳을 찾아냈다.',{trade:1,money:10},()=>s.sk.trade>=25&&lit()],
   ['미사 때 성가대 옆에서 세르팡(뱀 모양 나팔)을 불었다.',{music:1,rloc:2},()=>s.sk.music>=30&&s.faithKind==='catholic'],
   ['저녁 모임에서 클라브생을 연주해 박수를 받았다.',{music:1,relite:2,soc:1},()=>s.sk.music>=40&&(noble()||rich())&&s.year<1810],
   ['손님들 앞에서 피아노포르테를 쳤다.',{music:1,relite:2,soc:1},()=>s.sk.music>=40&&(noble()||rich())&&s.year>=1790],
   ['아이들 얼굴을 목탄으로 그려 주었다.',{draw:1,rfam:2},()=>s.sk.draw>=35],
   ['인쇄소에서 활자를 거꾸로 읽으며 하루치 판을 짰다.',{print:1,money:10},()=>s.sk.print>=30],
   ['말 다루는 솜씨를 보고 이웃이 사나운 망아지를 길들여 달라고 했다.',{ride:1,rloc:1},()=>s.sk.ride>=40],
   ['손이 둔해 맡은 일을 망쳤다. 주인이 품삯을 깎았다.',{money:-10,rguild:-2},()=>wageEarner()&&s.st.dex<30&&R()<.4],['사격 훈련에서 표적 한가운데를 맞혔다.',{arms:1,rguild:1},()=>soldier()&&s.st.dex>=50]]),
 // 일감이 끊긴 해: 지역 경제의 일자리
 C('ev2_jobless',()=>free()&&wageEarner()&&econ().jobs<=50,1.2,3,'일감이 끊겼다','chômage',()=>{const y=s.year;
   return `${AREAN[econ().a]}에 일감이 말랐다. ${y>=1786&&y<=1790?'영국과의 통상조약 뒤 값싼 영국 천이 밀려와 직물 공방들이 문을 닫았다.':y>=1810&&y<=1812?'은행과 공장이 잇달아 쓰러졌다.':y>=1827&&y<=1832?'불황이 몇 해째 이어진다.':y>=1846&&y<=1848?'흉년과 철도 투기의 붕괴가 겹쳤다.':'주인들이 일꾼을 줄였다.'} 주인은 내일부터 나오지 말라고 했다.`},()=>{const w=econ().wage;const site=T()<1792?'자선 작업장(아틀리에 드 샤리테)':s.year===1848?'국민 작업장(아틀리에 나시오노)':'시의 토목 공사장';return [
   {l:`${site}에서 흙을 나른다`,s:'체력 판정',a:'work',f:async()=>{const {m,why}=md([[s.st.str>=50,1,'체력'],[s.st.str<30,-1,'힘 부족'],[s.st.hp<35,-1,'병약']]);const r=await roll(m,{label:'흙일',why});
     say(r.v>=3?`${site}에서 수레를 밀었다. 품삯은 적어도 굶지는 않았다.`+fx({money:Math.round(40*w),str:1,hp:-1}):'하루 만에 손바닥이 터지고 감독에게 쫓겨났다.'+fx({money:Math.round(10*w),hp:-2}))}},
   {l:'동업자들에게 일감을 수소문한다',s:'평판·숙련 판정',a:'social work',f:async()=>{const k=mainSkill();const {m,why}=md([[s.rep.rguild>=60,1,'동업자들의 신뢰'],[(s.sk[k]||0)>=40,1,skN(k)],[s.st.soc>=50,1,'사교'],[s.rep.rguild<=30,-1,'나쁜 평판']]);const r=await roll(m,{label:'일감 찾기',why});
     say(r.v>=4?'옛 동료가 다른 공방에 자리를 마련해 주었다.'+fx({money:Math.round(60*w),rguild:1}):'어디서나 사람을 줄인다는 말뿐이었다.'+fx({money:-10}))}},
   {l:'교구의 빈민 구호에 기댄다',s:'',a:'safe pious',f:()=>say('구호소에서 빵과 수프를 받았다. 아는 얼굴을 만날까 고개를 숙였다.'+fx({money:15,rloc:-1,vhon:-1}))}]}),
 // 불난 집: 의지와 체력
 C('ev2_fire',()=>free()&&s.age>=16&&s.age<60,.5,6,'불이야','au feu !',()=>`${urban()?'골목 끝 다락방':'이웃 초가'}에서 불길이 치솟았다. 위층에 아이가 남아 있다고 어머니가 울부짖는다. ${urban()?(s.year>=1811?'소방대(사푀르 퐁피에)가':'펌프 소방대가')+' 아직 오지 않았다.':'마을 사람들이 물동이를 들고 뛰어온다.'}`,[
   {l:'불 속으로 뛰어든다',s:'의지·체력 판정',a:'bold',f:async()=>{const {m,why}=md([[s.st.cour>=50,1,'의지'],[s.st.str>=55,1,'체력'],[s.st.hp<35,-1,'병약'],[s.age>=45,-1,'나이']]);const r=await roll(m,{label:'불길',why});
     if(r.v>=4)say('연기 속에서 아이를 안고 나왔다. 그날부터 골목 사람들이 그대에게 먼저 인사했다.'+fx({fame:3,cour:2,rloc:6,rpeople:2}),'big');else if(r.v===1)say('무너진 들보에 깔려 화상을 입었다. 아이는 이웃이 사다리로 구했다.'+fx({hp:-12,rloc:3}));else say('계단이 무너져 되돌아 나왔다. 아이는 창문으로 내려졌다.'+fx({hp:-3,rloc:2}))}},
   {l:'물동이 줄에 선다',s:'',a:'safe work',f:()=>say('밤새 물동이를 날랐다.'+fx({str:1,rloc:2}))},
   {l:'멀리서 지켜본다',s:'',a:'safe',f:()=>say('불이 꺼지고 나서야 집에 들어갔다.'+fx({rloc:-2}))}]),
 // 이웃과의 다툼: 정의와 질서
 C('ev2_neigh',()=>free()&&s.age>=20&&(s.land>0||peas()||s.estate==='artisan'),.6,5,'경계 다툼','bornage',()=>`이웃 ${jo(person(),'이','가')} ${R()<.5?'밭 경계석을 한 자 옮겼다':'그대 집 벽에 기대어 헛간을 올렸다'}. ${T()>=1790.9?'새로 생긴 치안판사(쥐주 드 페)에게 갈 수도 있다.':T()<1789.6&&!urban()?'영주 재판소에 가면 수수료가 든다.':'재판에 가면 돈과 시간이 든다.'}`,()=>[
   {l:'재판으로 가린다',s:'재산 -30, 글씨·평판 판정',a:'bold',f:async()=>{const {m,why}=md([[lit()&&s.sk.pen>=30,1,'문서를 갖춤'],[s.rep.rloc>=60,1,'증인이 되어 줄 이웃'],[influence().v>=25,1,'영향력'],[s.rep.rloc<=30,-1,'이웃의 미움']]);const r=await roll(m,{label:'재판',why});
     say(r.v>=4?'판결이 그대 편이었다. 경계석이 제자리로 돌아갔다.'+fx({money:-30,vjus:2,rloc:-1}):'판결이 애매하게 났다. 비용만 들었다.'+fx({money:-30,vord:-1}))}},
   {l:'포도주 한 병을 들고 찾아가 푼다',s:'사교 판정',a:'social safe',f:async()=>{const r=await roll(md([[s.st.soc>=50,1,'사교'],[s.rep.rloc>=60,1,'이웃의 신망']]).m,{label:'화해'});say(r.v>=3?'반씩 양보하기로 했다. 그 뒤로 사이가 좋아졌다.'+fx({rloc:3,soc:1,vord:1}):'문전박대를 당했다.'+fx({rloc:-1}))}},
   {l:'참고 넘어간다',s:'',a:'safe',f:()=>say('한 자 땅으로 원수를 만들지 않기로 했다.'+fx({vord:1,vjus:-1}))}]),
 // 노동 심판소(1806 리옹, 이후 여러 도시): 동업자들의 신망이 자리가 된다
 C('ev2_prud',()=>free()&&onTrack('craft')&&job().t>=3&&s.rep.rguild>=60&&T()>=1806.25&&(loc()==='lyon'||s.year>=1808)&&urban(),.7,10,'노동 심판소','conseil de prud’hommes',`1806년 리옹에서 처음 생긴 노동 심판소(콩세유 드 프뤼돔)는 공장주와 장인 대표가 함께 앉아 품삯과 도제 다툼을 가린다. 동업자들이 그대를 심판관으로 뽑자고 한다.`,[
   {l:'자리를 맡는다',s:'영향력 +',a:'work social',f:()=>say('심판소 탁자에 앉아 견습공과 주인의 다툼을 들었다.'+fx({inf:4,rguild:3,vjus:2,fame:1}))},
   {l:'일이 바쁘다며 사양한다',s:'',a:'safe',f:()=>say('다른 사람이 뽑혔다.'+fx({rguild:-1}))}]),
 // 정치가 우정을 가를 때: 사람 사이와 파벌 사이
 C('ev2_split',()=>free()&&!!s.party&&relsAlive().some(r=>r.fac&&FAC[r.fac]&&r.fac!==s.party&&facPair(s.party,r.fac)<=-40&&r.close>=40),1,3,'갈라진 식탁','la politique et l’amitié',()=>{ev2P=relsAlive().find(r=>r.fac&&FAC[r.fac]&&r.fac!==s.party&&facPair(s.party,r.fac)<=-40&&r.close>=40);const r=ev2P;
   return `${ev2Who(r)}${bat(r.n)?'은':'는'} ${FAC[r.fac].n} 사람이다. ${FAC[s.party].n}의 동지들은 ${ev2He(r)}와 어울리지 말라고 한다. 오늘 저녁 ${ev2He(r)}가 늘 하던 대로 식사를 하자고 청해 왔다.`},()=>{const r=ev2P;return [
   {l:'정치보다 벗이 먼저다',s:'파벌 신뢰 -',a:'family',f:()=>{frelAdd(s.party,-4);say(`${r.n}${bat(r.n)?'과':'와'} 정치 이야기는 빼고 밤늦도록 마셨다.`+fx({vfam:1,sus:inTerror()?4:0})+relFx(r,{close:8,trust:6}))}},
   {l:'당분간 만나지 않는다',s:'',a:'safe',f:()=>{frelAdd(s.party,3);say('핑계를 대고 가지 않았다.'+relFx(r,{close:-10}))}},
   {l:`식탁에서 ${ev2He(r)}를 설득해 본다`,s:'웅변 판정',a:'radical social',f:async()=>{const r2=await roll(md([[s.sk.orat>=40,1,'웅변'],[r.trust>=60,1,'벗의 신뢰']]).m,{label:'설득'});if(r2.v>=5){r.fac=s.party;say(`${r.n}${bat(r.n)?'이':'가'} 그대 쪽으로 마음을 돌렸다.`+fx({orat:2,inf:1})+relFx(r,{resp:8}))}else say('언성이 높아졌다. 둘 다 말을 아끼게 되었다.'+fx({orat:1})+relFx(r,{close:-8,riv:6}))}}]}),
 // 비싼 해의 수확: 자영농은 흉년에 벌고, 이웃은 굶는다
 C('ev2_sell',()=>free()&&onTrack('farm')&&job().t>=3&&econ().price>=1.25,1.2,2,'곡물 값','le prix du blé',()=>`곡물 값이 평년의 ${econ().price}배다. 곳간의 밀을 시장에 내면 큰돈이 된다. 그러나 품팔이 이웃들은 빵을 사지 못해 쩔쩔맨다.`,()=>{const e=econ();const g=Math.round(job().t*60*(e.price-1)*2);return [
   {l:'시장값에 판다',s:`재산 +${g}`,a:'greedy',f:()=>say('도시 곡물상에게 밀을 넘겼다. 마을에서는 매점꾼이라는 말이 나왔다.'+fx({money:g,trade:1,rloc:-3,rpeople:-3}))},
   {l:'이웃에게 평년 값에 판다',s:`재산 +${Math.round(g/3)}`,a:'family pious',f:()=>say('이웃들에게 됫박으로 나누어 팔았다.'+fx({money:Math.round(g/3),rloc:4,rpeople:3,vjus:1}))},
   {l:'값이 더 오를 때까지 묵힌다',s:'',a:'greedy bold',f:async()=>{if(await chance(T()>=1793.6&&T()<1795?.4:.15,'매점 고발',T()>=1793.6&&T()<1795?'매점 금지법(1793년 7월) 시기의 고발 비율':'곡물 매점꾼이 고발당한 비율')){say('매점꾼으로 고발당했다. 곳간이 열려 밀이 공정가에 팔렸다.'+fx({sus:12,rloc:-6,rpeople:-4}))}else say('이듬해 봄에 더 비싸게 팔았다.'+fx({money:Math.round(g*1.3),rloc:-4,rpeople:-2}))}}]})
];
async function randomEvent(p=.72){if(s.dead||s.cond==='prison'||s.cond==='emigre')return;if(R()>p)return;
  s.cd=s.cd||{};
  // 생활사 데이터(학술 자료 근거)를 60% 확률로 먼저 고른다
  if(R()<.6){const dp=dataPool();if(dp.length){const tot=dp.reduce((a,e)=>a+e.w,0);let r=R()*tot;for(const e of dp){r-=e.w;if(r<=0){await runData(e);return}}await runData(dp[dp.length-1]);return}}
  const pool=EV.filter(e=>{try{return e.c()&&!(s.cd[e.id]>s.year)}catch(x){return false}});if(!pool.length)return;
  const tot=pool.reduce((a,e)=>a+e.w,0);let r=R()*tot,e=pool[0];for(const x of pool){r-=x.w;if(r<=0){e=x;break}}
  if(e.cd)s.cd[e.id]=s.year+e.cd;await e.run()}

/* ================= 행동 ================= */
const ACTS=[
 {k:'read',n:'계몽 서적을 읽는다',s:'학식 +3, 급진 성향',c:()=>free()&&lit(),f:()=>say(pick(['볼테르의 『철학 서간』을 읽었다.','몽테스키외의 『법의 정신』을 읽었다.','루소의 『신엘로이즈』를 밤새 읽었다.','『백과전서』의 한 권을 빌려 읽었다.'])+fx({edu:3,pol:2,bch:1,brl:1,kphil:2}))},
 {k:'learn',n:'글을 배운다',s:'재산 40. 학식 판정',cost:40,c:()=>free()&&!lit(),inter:async()=>{const r=await roll(s.age<30?0:-1,{label:'글 배우기'});s.money-=40;if(r.v>=3){s.literate=true;say('떠듬떠듬 글을 읽을 수 있게 되었다.'+fx({edu:4}),'big')}else say('밤마다 촛불 아래 철자를 익혔지만 아직은 어렵다.'+fx({edu:1}))}},
 {k:'mass',n:'미사와 고해에 나간다',s:'신앙 +3. 1793~94년엔 혐의',c:()=>free()&&s.faithKind==='catholic',f:()=>{const t=T()>=1793.75&&T()<1795;say((t?'숲 속 헛간에서 선서 거부 사제의 비밀 미사를 드렸다.':'미사에 나가 고해성사를 보았다.')+fx({faith:3,sus:t?4:0,rloc:t?0:1}))}},
 {k:'salon',n:'살롱과 카페에 드나든다',s:'재산 40. 사교 +3',cost:40,c:()=>free()&&(urban()||noble()||s.estate==='bourgeois'),f:()=>say(pick(['조프랭 부인의 살롱에서 철학자들과 마주 앉았다.','카페 드 라 레장스에서 체스를 두었다.','팔레루아얄 회랑의 카페를 돌았다.'])+fx({money:-40,soc:3,relite:2,orat:1}))},
 {k:'train',n:'검술과 사격을 익힌다',s:'재산 30. 의지 +3, 무예 숙련',cost:30,c:()=>free()&&s.age<55,f:()=>say('검술 도장에서 땀을 흘렸다.'+fx({money:-30,cour:3,arms:4,str:1}))},
 {k:'skill',n:'솜씨를 갈고닦는다',s:'기술 +2, 주 기술 숙련 +4',c:()=>free()&&s.age<65,f:()=>{const k=mainSkill();say(`${SKILLS.find(x=>x[0]===k)[1]} 솜씨를 익히느라 밤늦도록 손을 놀렸다.`+fx({dex:2,[k]:4}))}},
 {k:'labor',n:'몸을 단련한다',s:'체력 +3, 건강 +1',c:()=>free()&&s.age<60,f:()=>say(pick(['새벽마다 장작을 패고 물을 길었다.','들판을 달리고 강에서 헤엄쳤다.','무거운 짐을 지고 언덕길을 오르내렸다.'])+fx({str:3,hp:1}))},
 {k:'orat',n:'웅변을 연습한다',s:'웅변 숙련 +4, 사교 +1',c:()=>free()&&lit()&&s.age>=16,f:()=>say(pick(['키케로의 연설문을 소리 내어 외웠다.','거울 앞에서 몸짓과 목소리를 다듬었다.','토론 모임에서 반대편을 맡아 논박했다.'])+fx({orat:4,soc:1}))},
 {k:'visit',n:'친지와 지인을 찾아다닌다',s:'가장 가까운 이와 친밀 +, 가족 평판 +',c:()=>free()&&relsAlive().length>0,f:()=>{const r=relsAlive().sort((a,b)=>b.close-a.close)[0];say(`${r.n}의 집에 들러 저녁을 함께 먹었다.`+fx({rfam:2})+relFx(r,{close:8,trust:3}))}},
 {k:'study',n:'대학에서 법학을 공부한다',s:'재산 300. 학식 +5',cost:300,c:()=>free()&&lit()&&isM()&&s.age<35,f:()=>say('법학부 강의를 들으며 로마법을 익혔다. 모의 변론에서 목청을 틔웠다.'+fx({money:-300,edu:5,pen:2,orat:1,klaw:5}))},
 {k:'spa',n:'온천에서 요양한다',s:'재산 150. 건강 +6',cost:150,c:()=>free(),f:()=>say(pick(['플롱비에르의 온천에서 한 철을 보냈다.','비시 온천에서 몸을 추슬렀다.','바레주의 유황 온천을 찾았다.'])+fx({money:-150,hp:6,relite:1}))},
 {k:'charity',n:'가난한 이웃을 돕는다',s:'재산 60. 명성 +2',cost:60,c:()=>free(),f:()=>{s.seeds.push({t:'saved',n:person(),y:s.year});const e=econ(),hard=e.price>=1.3||e.supply<50;say((hard?'빵값이 치솟은 해, 이웃들에게 빵과 장작을 나누었다. 문 앞에 줄이 늘어섰다.':'가난한 이웃들에게 빵과 장작을 나누었다.')+fx({money:-60,fame:2,faith:1,rloc:hard?5:3,rpeople:hard?4:2,vjus:1}))}},
 {k:'club',hide:1,n:'자코뱅 클럽에 가입한다',s:'급진 +10, 명성 +2. 공포정치기 혐의 감소',c:()=>free()&&T()>=1790&&T()<1794.75&&!s.flags.club&&(lit()||urban())&&isM(),f:()=>{s.flags.club=true;frelAdd('jacobin',8);say('헌우회(자코뱅 클럽) 회원증을 받았다. 저녁마다 생토노레 거리의 옛 수도원 회합에 나갔다.'+fx({pol:10,fame:2,sus:-6,rpeople:2,relite:-2,inf:2,brg:3}))}},
 {k:'cert',n:'시민증(공민 증명서)을 신청한다',s:'성향·이웃 평판 판정. 혐의 감소',c:()=>free()&&T()>=1793.25&&T()<1794.5,inter:async()=>{const {m,why}=md([[s.pol>=30,1,'애국 성향'],[noble(),-1,'귀족 출신'],[s.rep.rloc>=65,1,'이웃의 보증'],[s.rep.rloc<=30,-1,'이웃의 의심'],[s.rep.rpeople>=65,1,'상퀼로트의 신망']]);const r=await roll(m,{label:'시민증',why});if(r.v>=4)say('구 위원회에서 시민증을 받았다.'+fx({sus:-12}));else say('위원회가 서류를 보류하였다.'+fx({sus:4}))}},
 {k:'pamph',n:'팸플릿을 써서 돌린다',s:'학식 판정. 명성과 성향',c:()=>free()&&lit()&&s.year>=1787,inter:async()=>{
   const i=await Q('팸플릿','pamphlet','어떤 논조로 쓸 것인가?',[{l:'혁명을 더 밀어붙이자',s:'',a:'radical'},{l:'질서와 화해를 말한다',s:'',a:'safe'},{l:'왕과 교회를 옹호한다',s:'',a:'royal pious'}]);
   const {m,why}=md([[s.st.edu>=60,1,'학식'],[s.st.edu<40,-1,'학식 부족'],[s.sk.pen>=45,1,'문장력'],[s.sk.print>=30,1,'인쇄를 앎']]);const r=await roll(m,{label:'집필',why});const k=r.v>=4?2:1;fx({pen:2});
   if(i===0)say('“귀족들을 가로등에 매달아라!”'+fx({pol:6,fame:3*k,sus:T()>=1794.5&&T()<1800?6:0,rpeople:2*k,relite:-3,bch:3}));else if(i===1)say('관용과 법치를 호소하는 팸플릿을 썼다.'+fx({pol:-2,fame:2*k,sus:terror()?10:0,bch:-2,vord:1}));else say('왕당파 팸플릿을 몰래 찍었다.'+fx({pol:-8,fame:2*k,sus:rev()?15:0,relite:2,brg:-3,brl:-2}));if(r.v>=5)s.flags.book=true;await done()}},
 {k:'land',n:'국유재산 경매에서 땅을 산다',s:'교회·망명자 땅. 수익률 5%',c:()=>free()&&T()>=1790.75&&T()<1800&&s.money>=1500,inter:async()=>{
   const amts=[1500,5000,20000].filter(a=>s.money>=a);const i=await Q('국유재산 경매','biens nationaux','촛불 경매가 열렸다. 촛불이 꺼지기 전 마지막 호가가 낙찰된다. 옛 수도원의 밭과 망명 귀족의 농장이 나왔다.',amts.map(a=>({l:`${fmt(a)} ${money()}어치를 산다`,s:`연 지대 +${fmt(a*.05)}`,a:'greedy radical'})).concat([{l:'사지 않는다',s:'',a:'safe pious'}]));
   if(i<amts.length){const a=amts[i];s.money-=a;s.land+=Math.round(a*.05);s.flags.bienNat=true;say(`${fmt(a)} ${money()}에 국유재산을 낙찰받았다.`+(west()&&s.faith>=40?' 신앙 깊은 이웃들이 그대를 ‘교회 도둑’이라 수군댔다.':'')+fx({pol:5,faith:-2,rloc:west()?-4:0,brl:2}),'big')}await done()}},
 {k:'buy',n:'땅을 사들인다',s:'수익률 4%',c:()=>free()&&s.money>=4000&&!(T()>=1790.75&&T()<1800),inter:async()=>{const a=Math.round(s.money*.4/1000)*1000;const i=await Q('토지 매입','achat de terres',`공증인이 ${fmt(a)} ${money()}짜리 농지를 소개하였다.`,[{l:'산다',s:`연 지대 +${fmt(a*.04)}`,a:'greedy'},{l:'그만둔다',s:'',a:'safe'}]);if(i===0){s.money-=a;s.land+=Math.round(a*.04);say('땅문서에 서명하였다.')}await done()}},
 {k:'hide',n:'몸을 숨긴다',s:'공포정치가 끝날 때까지 은신. 철마다 돈이 든다',c:()=>free()&&T()>=1793.25&&T()<1794.5&&s.sus>=20,f:()=>{s.cond='hiding';s.condSince=T();loseJob();say('친지의 다락방으로 숨어들었다.','big')}},
 {k:'emig',n:'국경을 넘어 망명한다',s:'재산 절반을 잃고 일을 버린다',c:()=>free()&&T()>=1789.25&&T()<1799.75&&(noble()||s.sus>=25||s.flags.refractory||s.pol<-40),inter:async()=>{const {m,why}=md([[s.st.cour>=50,1,'의지'],[s.sk.ride>=40,1,'말을 잘 탐'],[s.st.str>=55,1,'산길을 걸을 힘'],[s.st.hp<30,-1,'병약'],[!!patron(),1,'후원자의 통행증']]);const r=await roll(m,{label:'국경 넘기',why});if(r.v>=3)await emigrate();else if(r.v===1&&T()>=1792.5){say('국경에서 붙잡혔다.','big');s.cond='prison';s.prisonKind='terror';s.condSince=T();fx({sus:25})}else say('국경 경비가 삼엄해 되돌아왔다.'+fx({sus:5}));await done()}},
 {k:'career',n:'진로를 바꾼다',s:'조건을 갖춘 다른 일로 옮긴다',c:()=>free()&&s.age<60&&!soldier()&&!deputy(),inter:async()=>{await careerChoice(false)}},
 {k:'match',n:'중매를 넣는다',s:'혼담이 들어온다',c:()=>free()&&s.age>=16&&s.age<55&&!(s.spouse&&s.spouse.alive)&&!priest()&&!nun(),inter:async()=>{await forceMarriage()}},
 {k:'retire',n:'일에서 물러난다',s:'일을 그만두고 지대로 산다',c:()=>free()&&s.job&&s.age>=50&&!soldier(),f:()=>{loseJob('% 자리에서 물러나 노년을 보내기로 했다.');s.flags.retired=true}},
 {k:'gamble',n:'도박판에 앉는다',s:'재산이 오르내린다',c:()=>free()&&s.money>=200&&(noble()||urban()),inter:async()=>{const st=Math.round(s.money*.1);const r=await roll(0,{label:'파로 도박'});if(r.v>=5)say('판돈을 쓸어 담았다.'+fx({money:st*2}));else if(r.v<=2)say('가진 돈을 꽤 잃었다.'+fx({money:-st*2}));else say('본전치기였다.')}}
];
async function forceMarriage(){const a=s.age;
  const sameEst=R()<.8?s.estate:wpick([['peasant',3],['artisan',3],['bourgeois',2]]);const nm=isM()?woman():person();const age=isM()?clamp(a-ri(1,7),16,45):clamp(a+ri(-1,8),17,60);
  const dowry=isM()?{peasant:80,artisan:300,bourgeois:6000,hobereau:12000,robe:30000,epee:80000}[sameEst]:0;
  const pay=isM()?{peasant:60,artisan:150}[sameEst]||0:Math.round(POST[pick(['f2','c2','c3','l2','c4'])].pay*({peasant:.5,artisan:.9,bourgeois:1.4,hobereau:2,robe:3,epee:5}[sameEst]));
  const i=await Q('혼담','mariage',`중매쟁이가 ${ESTATES[sameEst].n} 집안의 ${nm}(${age}세)${bat(nm)?'을':'를'} 소개하였다.${dowry?` 지참금은 ${fmt(dowry)} ${money()}.`:''}`,[{l:'혼인한다',s:'',a:'family social'},{l:'다음 기회를 본다',s:'',a:'safe'}]);
  if(i===0){s.married=true;s.spouse={n:nm,age,alive:true,pay,estate:sameEst};s.money+=dowry;say(`${jo(nm,'과','와')} 혼인하였다.`+fx({soc:2}),'big')}else say('혼담을 미뤘다.');await done()}

/* ---------- 행동 등록부 ----------
   새 행동은 어느 파일에서든 defineAct({k,n,s,g,cost,c,f|inter})로 더한다. g는 아래 묶음 가운데 하나.
   k가 같으면 덮어쓴다. c()가 false면 보이지 않는다. 한 해에 한 번씩 할 수 있다. */
const ACT_GROUPS=[['body','몸과 마음'],['learn','배움과 솜씨'],['social','사람과 사교'],['faith','신앙'],['money','돈과 땅'],['politics','정치와 시민'],['risk','위험한 선택'],['life','삶의 큰 결정']];
const ACT_G={read:'learn',learn:'learn',study:'learn',skill:'learn',orat:'learn',mass:'faith',salon:'social',visit:'social',charity:'social',gamble:'money',land:'money',buy:'money',train:'body',labor:'body',spa:'body',club:'politics',cert:'politics',pamph:'politics',hide:'risk',emig:'risk',career:'life',match:'life',retire:'life'};
function actGroup(a){return ACT_G[a.k]||'life'}
function defineAct(a){const i=ACTS.findIndex(x=>x.k===a.k);if(i>=0)ACTS[i]=a;else ACTS.push(a);return a}
