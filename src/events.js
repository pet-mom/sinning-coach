/* ================= 무작위 사건 ================= */
const S=(id,c,w,cd,lines,k)=>({id,c,w,cd,run:async()=>{let ls=lines.filter(l=>(!l[2]||l[2]())&&!(l[3]&&s.done['L:'+l[0]]));if(ls.length>1)ls=ls.filter(l=>l[0]!==s.lastLine);if(!ls.length)return;const x=pick(ls);s.lastLine=x[0];if(x[3])s.done['L:'+x[0]]=1;say(x[0]+fx(typeof x[1]==='function'?x[1]():x[1]||{}),k)}});
const C=(id,c,w,cd,title,fr,text,opts)=>({id,c,w,cd,run:async()=>{const T0=typeof text==='function'?text():text,os=typeof opts==='function'?opts():opts;
  const i=await Q(title,fr,T0,os.map(o=>({l:o.l,s:o.s,a:o.a,dis:o.dis})));await os[i].f();await done()}});
const pre89=()=>T()<1789.25, rev=()=>T()>=1789.25&&T()<1799.75, terror=()=>inTerror(), imp=()=>T()>=1799.75&&T()<1814;
const peas=()=>free()&&(s.estate==='peasant'||onTrack('farm'))&&!urban();
const town=()=>free()&&urban();
const gentry=()=>free()&&(noble()||rich());

const EV=[
 // ---------- 어린 시절 ----------
 S('baby',()=>s.age<4,2,0,[
   ['걸음마를 떼었다.',{},null,1],['처음으로 “엄마”라고 말했다.',{},null,1],['밤새 열이 올라 어머니가 성모상 앞에서 기도하였다.',{hp:-2}],
   ['유모의 집이 있는 시골 마을로 보내져 젖을 먹고 자랐다.',{hp:-2},()=>(noble()||s.estate==='bourgeois'||s.region==='paris'),1],
   ['세례 대부가 은수저를 선물하였다.',{},()=>rich()||noble(),1],['이가 나느라 보챘다.',{}],['형들 뒤를 따라 아장아장 마당을 돌았다.',{hp:1}]]),
 S('cpeas',()=>child()&&s.age>=4&&s.estate==='peasant',1.6,0,[
   ['어린 손으로 이삭을 주웠다.',{hp:1}],['거위 떼를 몰다가 개울에 빠졌다.',{}],['장날에 아버지를 따라 읍내에 갔다.',{soc:1}],['나막신이 닳아 맨발로 다녔다.',{hp:-1}],
   ['성 요한 축일 밤 모닥불을 뛰어넘었다.',{cour:2}],['영주님의 마차가 지나가자 모자를 벗고 길가에 섰다.',{},pre89],['늑대가 마을 근처에 나타났다는 소문에 밤새 떨었다.',{}],
   ['봄 순례 행렬을 따라 성당까지 걸었다.',{faith:2}],['흉년에 어머니가 메밀죽을 묽게 쑤었다.',{hp:-2},()=>price(s.year)>=1.3]]),
 S('ctown',()=>child()&&s.age>=4&&s.estate==='artisan',1.6,0,[
   ['퐁뇌프 다리 위 약장수와 인형극을 구경하였다.',{},()=>s.region==='paris'],['아버지 공방에서 대패 밥을 쓸었다.',{}],['빵집 앞 긴 줄에 서서 빵을 사 왔다.',{}],
   ['거리 가수가 왕비를 비꼬는 노래를 부르는 것을 따라 불렀다.',{pol:2},()=>s.year>=1780],['강가에서 동무들과 물장구를 쳤다.',{hp:1}],['공방 직인 형들의 패싸움을 구경하였다.',{cour:1}],
   ['교구 자선학교에서 교리문답을 외웠다.',{faith:2,edu:1}],['짐마차에 치일 뻔하였다.',{}]]),
 S('cnoble',()=>child()&&s.age>=5&&noble(),1.6,0,[
   ['무용 교사에게 미뉴에트를 배웠다.',{soc:2}],['처음으로 조랑말을 탔다.',{cour:2}],['가정교사가 라틴어 문법책을 펼쳤다.',{edu:2}],
   ['아버지의 사냥에 따라나섰다.',{cour:1,hp:1}],['영지의 소작인 아이들과 몰래 어울리다 꾸중을 들었다.',{soc:1}],['펜싱 교사에게 처음 칼을 받았다.',{cour:2},()=>isM()],
   ['베르사유 궁의 거울의 방을 구경하였다.',{soc:1},()=>s.estate==='epee'&&pre89(),1],['클라브생을 배우기 시작하였다.',{edu:1},()=>!isM()]]),
 S('cbour',()=>child()&&s.age>=5&&s.estate==='bourgeois',1.6,0,[
   ['아버지의 상점 계산대에서 주판을 배웠다.',{edu:1,soc:1}],['『텔레마크의 모험』을 읽었다.',{edu:2},()=>lit()],['어머니를 따라 마차를 타고 친척 집에 갔다.',{soc:1}],
   ['극장에서 몰리에르 희극을 보았다.',{soc:1}],['라틴어 동사 변화를 외우다 꾸중을 들었다.',{edu:1}]]),
 {id:'inoc',c:()=>child()&&s.age>=2&&s.age<=10&&s.year>=1756&&(noble()||s.estate==='bourgeois')&&!s.flags.inoc,w:.6,cd:99,run:async()=>{s.flags.inoc=true;
   if(R()<.5){say('부모가 의사를 불러 천연두 인두 접종을 시켰다. 며칠 앓고 털고 일어났다.'+fx({hp:3}));s.flags.immune=true}else say('부모는 인두 접종이 위험하다며 하지 않았다.')}},
 {id:'cill',c:()=>child()&&s.age>=1,w:1.1,cd:2,run:async()=>{const r=await roll(s.st.hp>=55?1:0,{label:'병치레'});if(r.v<=1)say(pick(['천연두를 앓았다. 얼굴에 곰보 자국이 남았다.','홍역으로 사경을 헤맸다.','이질로 몇 주를 앓았다.'])+fx({hp:-10}));else if(r.v===2)say('잔병치레가 잦았다.'+fx({hp:-4}));else say('감기를 앓다 털고 일어났다.'+fx({hp:1}))}},
 C('ccat',()=>child()&&s.age>=7,1,3,'어린 날','enfance','본당 신부가 교리 수업에 빠지지 말라고 했다. 동무들은 강가로 가재 잡으러 가자고 조른다.',[{l:'교리 수업에 간다',s:'신앙·학식',a:'pious study',f:()=>say('교리문답을 외웠다.'+fx({faith:3,edu:1}))},{l:'강가로 간다',s:'건강·처세',a:'social',f:()=>say('하루 종일 강가에서 놀았다.'+fx({hp:2,soc:2}))}]),

 // ---------- 농촌 ----------
 S('farm',peas,1.6,0,[
   ['보리 수확을 마쳤다.',{hp:1}],['포도 수확철, 발로 포도를 밟았다.',{soc:1}],['장터에서 송아지를 팔았다.',{money:30}],['소금세 관리가 집집마다 소금 통을 검사하였다.',{},pre89],
   ['십일조 징수원이 볏단 열 단 가운데 한 단을 실어 갔다.',{},()=>T()<1790],['영주의 비둘기 떼가 갓 뿌린 씨앗을 쪼아 먹었다.',{pol:2},pre89],['영주의 방앗간에서 밀을 빻느라 하루를 기다렸다.',{},pre89],
   ['왕의 길 닦는 부역에 엿새 동안 끌려 나갔다.',{hp:-2,pol:1},()=>T()<1787],['이웃 결혼식에서 밤새 춤을 추었다.',{soc:2}],['우박이 쏟아져 밀밭이 쓰러졌다.',{money:-20,hp:-1}],
   ['마을 자유의 나무 아래서 공화력 축제를 열었다.',{pol:2},()=>T()>=1792.5&&T()<1800],['국민방위대 보초를 섰다.',{},()=>rev()&&isM()],['감자를 처음 심어 보았다.',{},()=>s.year>=1785],
   ['징발대가 와서 곡식과 말을 거두어 갔다.',{money:-30,pol:-3},()=>T()>=1793&&T()<1795],['교회 종탑의 종이 내려져 대포 공장으로 실려 갔다.',{faith:-1,pol:-2},()=>T()>=1793.5&&T()<1795],
   ['순례길에 생자크 성지 순례자들을 재워 주었다.',{faith:2}],['가뭄에 우물이 말랐다.',{hp:-2}]]),
 C('salt',()=>peas()&&pre89()&&['bretagne','normandie','vendee'].includes(loc())&&s.age<50,.8,3,'소금 밀매','faux-saunage','브르타뉴는 소금세가 없다. 국경 넘어 소금을 지고 오면 열 배 값에 팔린다. 붙잡히면 갤리선 노예다.',[
   {l:'밤에 소금 자루를 지고 넘는다',s:'담력 판정',a:'bold greedy',f:async()=>{const r=await roll(s.st.cour>=50?1:0,{label:'밀매'});if(r.v>=4)say('소금을 팔아 한철 벌이를 했다.'+fx({money:60,cour:2}));else if(r.v===1){say('소금세 순찰대에게 붙잡혔다.','big');if(await chance(.35,'갤리선 형','붙잡힌 밀매꾼 가운데 갤리선 노역형을 받은 비율')){say('툴롱 갤리선 노역장으로 끌려가 여섯 해를 노를 저었다.'+fx({hp:-25,cour:5}),'big')}else{say('벌금을 물고 풀려났다.'+fx({money:-50}))}}else say('순찰대를 피해 빈손으로 돌아왔다.')}},
   {l:'손대지 않는다',s:'',a:'safe',f:()=>say('밀매꾼들의 발소리를 모른 척하였다.')}]),
 C('poach',()=>peas()&&pre89()&&isM(),.7,4,'영주의 숲','braconnage','영주의 토끼가 밭을 망친다. 숲에 덫을 놓으면 고기를 먹을 수 있지만, 밀렵은 영주재판에 끌려간다.',[
   {l:'덫을 놓는다',s:'',a:'bold',f:async()=>{const r=await roll(0,{label:'밀렵'});if(r.v>=3)say('토끼 두 마리를 잡았다.'+fx({hp:2}));else say('산지기에게 들켜 벌금을 물었다.'+fx({money:-30,pol:3}))}},
   {l:'참는다',s:'',a:'safe',f:()=>say('밭을 망치는 토끼를 바라만 보았다.'+fx({pol:2}))}]),

 // ---------- 도시 ----------
 S('town',town,1.5,0,[
   ['카바레에서 직인들과 싸구려 포도주를 마셨다.',{soc:1}],['빵집 앞 줄이 길어져 해 뜨기 전부터 섰다.',{hp:-1},()=>price(s.year)>=1.3],['센 강변 헌책방에서 낡은 책을 샀다.',{edu:1},()=>lit()&&s.region==='paris'],
   ['거리 가수가 왕비를 조롱하는 노래를 불렀다.',{pol:2},()=>s.year>=1780&&pre89()],['공방 직인들이 품삯을 올려 달라고 일손을 놓았다.',{pol:2}],['성 엘루아 축일에 대장장이 조합의 행렬이 지나갔다.',{}],
   ['광장 신문 낭독회에서 『페르 뒤셴』을 들었다.',{pol:4},()=>T()>=1790.5&&T()<1794.25],['구민회에서 서로를 ‘시민’이라고 부른다.',{pol:2},()=>T()>=1792.5&&T()<1795],['거리 이름이 혁명식으로 바뀌었다.',{},()=>T()>=1792.5&&T()<1795,1],
   ['단두대로 가는 수레를 보았다.',{hp:-1},()=>T()>=1793&&T()<1794.5],['붉은 프리지아 모자를 쓴 상퀼로트가 퀼로트 입은 사람을 노려보았다.',{},()=>T()>=1792.5&&T()<1795],
   ['승전 축포가 울려 퍼졌다.',{},imp],['아케이드의 가스등 아래를 걸었다.',{},()=>s.year>=1820],['저녁 무렵 강물에 빠진 아이를 건져 냈다.',{fame:2,cour:2}]]),
 C('cafe',()=>town()&&lit()&&s.year>=1760,.8,3,'카페','café Procope','카페에 둘러앉은 사람들이 최근 팸플릿을 두고 언성을 높인다.',()=>[
   {l:'개혁을 지지하는 쪽에 선다',s:'',a:'radical social',f:()=>say('논쟁에서 이겼다.'+fx({pol:5,soc:2,sus:terror()?0:0}))},
   {l:'왕권과 질서를 옹호한다',s:'',a:'royal',f:()=>say('질서를 옹호했다가 야유를 받았다.'+fx({pol:-5,soc:1,sus:terror()?6:0}))},
   {l:'커피만 마신다',s:'',a:'safe',f:()=>say('조용히 커피를 마셨다.')}]),
 C('bookleg',()=>town()&&lit()&&pre89()&&s.year>=1760,.5,5,'금서','livres philosophiques','뇌샤텔에서 몰래 들여온 금서 꾸러미를 팔아 달라는 부탁을 받았다. 『철학자 테레즈』, 『2440년』… 붙잡히면 바스티유다.',[
   {l:'맡아서 판다',s:'',a:'greedy bold',f:async()=>{const r=await roll(s.st.soc>=50?1:0,{label:'금서 판매'});if(r.v>=3)say('금서는 금세 팔렸다.'+fx({money:150,pol:3}));else if(r.v===1){say('국왕의 봉인장(레트르 드 카셰)으로 바스티유에 갇혔다.','big');s.cond='prison';s.prisonKind='plain';s.condSince=T();fx({fame:3,pol:6})}else say('경찰 첩자의 눈치를 채고 꾸러미를 강물에 버렸다.')}},
   {l:'거절한다',s:'',a:'safe',f:()=>say('거절하였다.')}]),

 // ---------- 귀족·부유층 ----------
 S('gentry',gentry,1.3,0,[
   ['파로 도박판에서 하룻밤에 큰돈을 잃었다.',{money:()=>-Math.round(s.money*.05)},()=>noble()],['오페라 극장에서 글루크의 오페라를 보았다.',{soc:1}],['영지 관리인이 올해 지대 장부를 올렸다.',{}],
   ['살롱에서 볼테르의 새 편지가 낭독되었다.',{edu:1,pol:2},()=>pre89()&&s.year<1779],['초상화가에게 초상화를 맡겼다.',{money:-200}],['사냥에서 사슴을 쫓다 낙마하였다.',{hp:-4}],
   ['국유재산 경매장에서 수도원 건물이 헐값에 팔리는 것을 보았다.',{},()=>T()>=1790&&T()<1800],['총재정부 시절의 무도회에 ‘희생자 무도회’가 유행하였다.',{soc:1},()=>T()>=1795&&T()<1799],
   ['황후의 말메종 정원을 거닐었다.',{soc:1},()=>imp()&&s.fame>=50],['돌아온 망명 귀족들이 거들먹거렸다.',{},()=>T()>=1814&&T()<1830]]),
 C('duel',()=>gentry()&&isM()&&noble()&&s.age>=18&&s.age<=45,.5,6,'결투 신청','duel','무도회에서 한 기사가 그대의 가문을 모욕하였다. 장갑이 던져졌다.',[
   {l:'결투를 받아들인다',s:'담력 판정',a:'bold',f:async()=>{const r=await roll(s.st.cour>=55?1:s.st.cour<35?-1:0,{label:'결투'});if(r.v>=4)say('상대의 팔을 베어 명예를 지켰다.'+fx({fame:4,cour:3}));else if(r.v===1){if(await chance(.3,'결투의 상처','결투 부상의 치사율')){die('duel');return}say('옆구리를 찔려 몇 달을 앓았다.'+fx({hp:-15}))}else say('첫 피를 보고 결투가 끝났다.'+fx({fame:1}))}},
   {l:'사과를 받아 내고 물러선다',s:'',a:'safe',f:()=>say('비겁하다는 뒷말이 돌았다.'+fx({fame:-3}))}]),
 C('mason',()=>free()&&lit()&&s.year>=1755&&s.year<1793&&(gentry()||s.estate==='bourgeois'||onTrack('law'))&&!s.flags.mason,.6,99,'프리메이슨','franc-maçonnerie','지인이 프리메이슨 지부에 들어오라고 권한다. 귀족과 상인과 법률가가 ‘형제’로 앉는 곳이다.',()=>[
   {l:'입회한다',s:'입회비 150',a:'social',dis:s.money<150,f:()=>{s.flags.mason=true;say('눈가리개를 쓰고 입회 의식을 치렀다.'+fx({money:-150,soc:3,fame:2,pol:3}))}},
   {l:'사양한다',s:'',a:'safe pious',f:()=>say('정중히 사양하였다.')}]),

 // ---------- 혁명기 ----------
 C('denounce',()=>free()&&terror(),1.2,1,'고발','dénonciation',()=>`감시위원회 사람이 넌지시 묻는다. 이웃 ${person()}이 왕당파 노래를 흥얼거리지 않더냐고.`,[
   {l:'들은 대로 말한다',s:'혐의는 줄지만 원한을 산다',a:'safe radical',f:()=>{s.seeds.push({t:'denounced',n:person(),y:s.year});say('이웃의 이름을 댔다. 사흘 뒤 그 집에 불이 꺼졌다.'+fx({sus:-8,faith:-3}))}},
   {l:'모른다고 한다',s:'',a:'pious',f:()=>{s.seeds.push({t:'saved',n:person(),y:s.year});say('아무것도 못 들었다고 했다.'+fx({sus:4}))}}]),
 S('revcity',()=>free()&&rev(),1.1,0,[
   ['삼색 모표를 모자에 달았다.',{pol:1},()=>T()<1795,1],['공화력의 열흘 주(데카드)에 맞춰 쉬었다.',{},()=>T()>=1793.75&&T()<1802],['‘최고존재’ 제전의 행렬을 보았다.',{},()=>s.year===1794&&s.season===1],
   ['빵 배급표를 받았다.',{},()=>T()>=1793.5&&T()<1796&&urban()],['아시냐 지폐를 받지 않겠다는 상인과 다투었다.',{money:-10},()=>T()>=1792&&T()<1797],['위조 아시냐가 섞여 있었다.',{money:-20},()=>T()>=1791&&T()<1796],
   ['미터법의 새 저울과 자를 장만했다.',{},()=>s.year>=1799,1],['혁명 연극 『왕들의 최후 심판』을 보았다.',{pol:3},()=>T()>=1793.5&&T()<1794.5&&urban()]]),
 C('femclub',()=>free()&&!isM()&&inParis()&&T()>=1793&&T()<1793.75&&!s.flags.femClub,1.5,99,'혁명 여성 시민 클럽','citoyennes républicaines','클레르 라콩브와 폴린 레옹이 혁명 여성 시민 클럽을 열었다. 붉은 모자를 쓴 여인들이 무기를 들 권리를 외친다.',[
   {l:'회원이 된다',s:'',a:'radical bold',f:()=>{s.flags.femClub=true;say('붉은 모자를 쓰고 클럽 회합에 나갔다.'+fx({pol:10,fame:3,cour:3}))}},
   {l:'멀리한다',s:'',a:'safe',f:()=>say('지나가며 소리만 들었다.')}]),
 C('olympe',()=>free()&&!isM()&&lit()&&T()>=1791.5&&T()<1793.75&&!s.done.olympe,1,99,'여성의 권리','Déclaration des droits de la femme','올랭프 드 구주의 「여성과 여성 시민의 권리 선언」이 돌고 있다. “여성은 단두대에 오를 권리가 있다. 그렇다면 연단에 오를 권리도 있다.”',[
   {l:'읽고 친구들에게 돌린다',s:'',a:'radical',f:()=>{s.done.olympe=1;say('친구들과 밤새 이야기를 나누었다.'+fx({pol:6,edu:2,sus:2}))}},
   {l:'관심 없다',s:'',a:'safe',f:()=>{s.done.olympe=1;say('읽지 않았다.')}}]),

 // ---------- 교회 ----------
 S('church',()=>free()&&(priest()||nun()),1.6,0,[
   ['아침 미사를 집전하였다.',{faith:1},()=>priest()],['교구민의 고해를 들었다.',{soc:1},()=>priest()],['흉년에 교구 빈민에게 빵을 나누었다.',{fame:2,money:-20},()=>priest()],['주교의 순시를 맞았다.',{}],
   ['성무일도를 바쳤다.',{faith:2}],['수녀원 봉쇄 정원에서 장미를 돌보았다.',{hp:1},()=>nun()],['병원에서 환자들을 돌보았다.',{fame:1,hp:-1},()=>nun()],['수련 수녀들에게 성가를 가르쳤다.',{},()=>nun()]]),
 // ---------- 군대 ----------
 S('army',()=>free()&&soldier(),1.6,0,[
   ['밤새 행군하였다.',{hp:-2}],['야영지에서 동료들과 「라 마르세예즈」를 불렀다.',{pol:2},()=>T()>=1792.5&&T()<1804],['군화가 닳아 해진 천으로 발을 감쌌다.',{hp:-1},()=>T()>=1792&&T()<1800],
   ['사열식에서 황제를 가까이에서 보았다.',{cour:1},imp],['동료의 편지를 대신 써 주었다.',{soc:1},()=>lit()],['병참이 끊겨 농가를 징발하였다.',{},()=>atWar()],['막사에 이질이 돌았다.',{hp:-5}],['주둔지 처녀와 정분이 났다.',{soc:1}]]),
 C('desert',()=>free()&&soldier()&&job().t<=2&&atWar(),.5,4,'탈영','désertion','동료 몇이 오늘 밤 탈영하자고 한다. 고향이 멀지 않다.',[
   {l:'따라간다',s:'붙잡히면 총살될 수 있다',a:'bold family',f:async()=>{const r=await roll(s.st.cour>=50?0:-1,{label:'탈영'});if(r.v>=3){loseJob('밤중에 진영을 빠져나와 % 자리를 버렸다.');s.cond='hiding';s.flags.refractaire=true;fx({sus:15})}else{if(await chance(.2,'탈영병 처형','붙잡힌 탈영병의 총살 비율')){die('shot','탈영하다 붙잡혀 본보기로 총살되었다.');return}say('붙잡혀 영창에 갇혔다.'+fx({hp:-5,fame:-3}))}}},
   {l:'남는다',s:'',a:'safe',f:()=>say('남기로 했다.'+fx({cour:1}))}]),

 // ---------- 공통 ----------
 S('daily',()=>free(),1,0,[
   ['독감으로 일주일을 누워 지냈다.',{hp:-3}],['옛 친구를 우연히 만났다.',{soc:1}],['성탄 자정 미사에 갔다.',{faith:1},()=>!(T()>=1793.75&&T()<1795)],['이가 아파 떠돌이 치과의사에게 뽑았다.',{hp:-1}],
   ['혜성이 나타나 사람들이 불길하다고 수군댔다.',{},()=>[1759,1769,1811].includes(s.year)],['일식을 보았다.',{},()=>[1764,1788,1820,1842].includes(s.year)],['맑은 날, 먼 데까지 걸었다.',{hp:1}]]),
 C('loan',()=>free()&&s.money>=400,.6,4,'돈 부탁','prêt',()=>`${person()}가 사업이 어렵다며 300 ${money()}을 빌려 달라고 한다.`,[
   {l:'빌려준다',s:'재산 -300',a:'social',f:()=>{s.seeds.push({t:'debtor',n:person(),y:s.year,a:Math.round(300*(1+R()*.3))});say('돈을 빌려주었다.'+fx({money:-300,soc:2}))}},
   {l:'거절한다',s:'',a:'greedy safe',f:()=>say('거절하였다.')}]),
 C('unhappy',()=>free()&&s.married&&s.spouse&&s.spouse.alive&&!s.flags.unhappy,.4,8,'부부 사이','ménage',()=>`${jo(s.spouse.n,'과','와')} 다툼이 잦아졌다.`,[
   {l:'참고 화해한다',s:'',a:'safe family',f:()=>say('성당에 함께 가며 화해하였다.'+fx({soc:1}))},
   {l:'따로 지낸다',s:'',a:'',f:()=>{s.flags.unhappy=true;say('한 지붕 아래 남처럼 지냈다.'+fx({hp:-2}))}}]),
 C('paris',()=>free()&&loc()!=='paris'&&s.age>=16&&s.age<=35&&!s.flags.askedParis,.5,99,'파리로','monter à Paris','고향 친구가 파리로 올라가자고 한다. 일자리도, 기회도, 위험도 거기 있다.',[
   {l:'파리로 올라간다',s:'',a:'bold',f:()=>{s.flags.askedParis=true;s.loc='paris';if(onTrack('farm'))loseJob();say('역마차를 타고 파리에 닿았다. 생탕투안 문밖에 셋방을 얻었다.'+fx({soc:2}),'big')}},
   {l:'고향에 남는다',s:'',a:'safe family',f:()=>{s.flags.askedParis=true;say('고향에 남기로 했다.')}}]),
 C('memoir',()=>free()&&lit()&&s.age>=50&&!s.flags.book,.4,99,'회고록','mémoires','지나온 일을 적어 두라고 권하는 이가 있다.',[
   {l:'붓을 든다',s:'학식 판정',a:'study',f:async()=>{const r=await roll(s.st.edu>=60?1:0,{label:'집필'});if(r.v>=4){s.flags.book=true;say('회고록을 펴냈다. 생각보다 많이 팔렸다.'+fx({fame:6,money:200}),'big')}else say('원고는 서랍 속에 남았다.'+fx({edu:1}))}},
   {l:'지난 일은 묻어 둔다',s:'',a:'safe',f:()=>say('지난 일은 말하지 않았다.')}])
];
async function randomEvent(p=.72){if(s.dead||s.cond==='prison'||s.cond==='emigre')return;if(R()>p)return;
  s.cd=s.cd||{};const pool=EV.filter(e=>{try{return e.c()&&!(s.cd[e.id]>s.year)}catch(x){return false}});if(!pool.length)return;
  const tot=pool.reduce((a,e)=>a+e.w,0);let r=R()*tot,e=pool[0];for(const x of pool){r-=x.w;if(r<=0){e=x;break}}
  if(e.cd)s.cd[e.id]=s.year+e.cd;await e.run()}

/* ================= 행동 ================= */
const ACTS=[
 {k:'read',n:'계몽 서적을 읽는다',s:'학식 +3, 급진 성향',c:()=>free()&&lit(),f:()=>say(pick(['볼테르의 『철학 서간』을 읽었다.','몽테스키외의 『법의 정신』을 읽었다.','루소의 『신엘로이즈』를 밤새 읽었다.','『백과전서』의 한 권을 빌려 읽었다.'])+fx({edu:3,pol:2}))},
 {k:'learn',n:'글을 배운다',s:'재산 40. 학식 판정',cost:40,c:()=>free()&&!lit(),inter:async()=>{const r=await roll(s.age<30?0:-1,{label:'글 배우기'});s.money-=40;if(r.v>=3){s.literate=true;say('떠듬떠듬 글을 읽을 수 있게 되었다.'+fx({edu:4}),'big')}else say('밤마다 촛불 아래 철자를 익혔지만 아직은 어렵다.'+fx({edu:1}))}},
 {k:'mass',n:'미사와 고해에 나간다',s:'신앙 +3. 1793~94년엔 혐의',c:()=>free()&&s.faithKind==='catholic',f:()=>{const t=T()>=1793.75&&T()<1795;say((t?'숲 속 헛간에서 선서 거부 사제의 비밀 미사를 드렸다.':'미사에 나가 고해성사를 보았다.')+fx({faith:3,sus:t?4:0}))}},
 {k:'salon',n:'살롱과 카페에 드나든다',s:'재산 40. 처세 +3',cost:40,c:()=>free()&&(urban()||noble()||s.estate==='bourgeois'),f:()=>say(pick(['조프랭 부인의 살롱에서 철학자들과 마주 앉았다.','카페 드 라 레장스에서 체스를 두었다.','팔레루아얄 회랑의 카페를 돌았다.'])+fx({money:-40,soc:3}))},
 {k:'train',n:'검술과 사격을 익힌다',s:'재산 30. 담력 +3',cost:30,c:()=>free()&&s.age<55,f:()=>say('검술 도장에서 땀을 흘렸다.'+fx({money:-30,cour:3}))},
 {k:'study',n:'대학에서 법학을 공부한다',s:'재산 300. 학식 +5',cost:300,c:()=>free()&&lit()&&isM()&&s.age<35,f:()=>say('법학부 강의를 들으며 로마법을 익혔다.'+fx({money:-300,edu:5}))},
 {k:'spa',n:'온천에서 요양한다',s:'재산 150. 건강 +6',cost:150,c:()=>free(),f:()=>say(pick(['플롱비에르의 온천에서 한 철을 보냈다.','비시 온천에서 몸을 추슬렀다.','바레주의 유황 온천을 찾았다.'])+fx({money:-150,hp:6}))},
 {k:'charity',n:'가난한 이웃을 돕는다',s:'재산 60. 명성 +2',cost:60,c:()=>free(),f:()=>{s.seeds.push({t:'saved',n:person(),y:s.year});say('흉년에 이웃들에게 빵과 장작을 나누었다.'+fx({money:-60,fame:2,faith:1}))}},
 {k:'club',hide:1,n:'자코뱅 클럽에 가입한다',s:'급진 +10, 명성 +2. 공포정치기 혐의 감소',c:()=>free()&&T()>=1790&&T()<1794.75&&!s.flags.club&&(lit()||urban())&&isM(),f:()=>{s.flags.club=true;say('헌우회(자코뱅 클럽) 회원증을 받았다. 저녁마다 생토노레 거리의 옛 수도원 회합에 나갔다.'+fx({pol:10,fame:2,sus:-6}))}},
 {k:'cert',n:'시민증(공민 증명서)을 신청한다',s:'처세 판정. 혐의 감소',c:()=>free()&&T()>=1793.25&&T()<1794.5,inter:async()=>{const r=await roll(s.pol>=30?1:noble()?-1:0,{label:'시민증'});if(r.v>=4)say('구 위원회에서 시민증을 받았다.'+fx({sus:-12}));else say('위원회가 서류를 보류하였다.'+fx({sus:4}))}},
 {k:'pamph',n:'팸플릿을 써서 돌린다',s:'학식 판정. 명성과 성향',c:()=>free()&&lit()&&s.year>=1787,inter:async()=>{
   const i=await Q('팸플릿','pamphlet','어떤 논조로 쓸 것인가?',[{l:'혁명을 더 밀어붙이자',s:'',a:'radical'},{l:'질서와 화해를 말한다',s:'',a:'safe'},{l:'왕과 교회를 옹호한다',s:'',a:'royal pious'}]);
   const r=await roll(s.st.edu>=60?1:s.st.edu<40?-1:0,{label:'집필'});const k=r.v>=4?2:1;
   if(i===0)say('“귀족들을 가로등에 매달아라!”'+fx({pol:6,fame:3*k,sus:T()>=1794.5&&T()<1800?6:0}));else if(i===1)say('관용과 법치를 호소하는 팸플릿을 썼다.'+fx({pol:-2,fame:2*k,sus:terror()?10:0}));else say('왕당파 팸플릿을 몰래 찍었다.'+fx({pol:-8,fame:2*k,sus:rev()?15:0}));if(r.v>=5)s.flags.book=true;await done()}},
 {k:'land',n:'국유재산 경매에서 땅을 산다',s:'교회·망명자 땅. 수익률 5%',c:()=>free()&&T()>=1790.75&&T()<1800&&s.money>=1500,inter:async()=>{
   const amts=[1500,5000,20000].filter(a=>s.money>=a);const i=await Q('국유재산 경매','biens nationaux','촛불 경매가 열렸다. 촛불이 꺼지기 전 마지막 호가가 낙찰된다. 옛 수도원의 밭과 망명 귀족의 농장이 나왔다.',amts.map(a=>({l:`${fmt(a)} ${money()}어치를 산다`,s:`연 지대 +${fmt(a*.05)}`,a:'greedy radical'})).concat([{l:'사지 않는다',s:'',a:'safe pious'}]));
   if(i<amts.length){const a=amts[i];s.money-=a;s.land+=Math.round(a*.05);s.flags.bienNat=true;say(`${fmt(a)} ${money()}에 국유재산을 낙찰받았다.`+fx({pol:5,faith:-2}),'big')}await done()}},
 {k:'buy',n:'땅을 사들인다',s:'수익률 4%',c:()=>free()&&s.money>=4000&&!(T()>=1790.75&&T()<1800),inter:async()=>{const a=Math.round(s.money*.4/1000)*1000;const i=await Q('토지 매입','achat de terres',`공증인이 ${fmt(a)} ${money()}짜리 농지를 소개하였다.`,[{l:'산다',s:`연 지대 +${fmt(a*.04)}`,a:'greedy'},{l:'그만둔다',s:'',a:'safe'}]);if(i===0){s.money-=a;s.land+=Math.round(a*.04);say('땅문서에 서명하였다.')}await done()}},
 {k:'hide',n:'몸을 숨긴다',s:'공포정치가 끝날 때까지 은신. 철마다 돈이 든다',c:()=>free()&&T()>=1793.25&&T()<1794.5&&s.sus>=20,f:()=>{s.cond='hiding';s.condSince=T();loseJob();say('친지의 다락방으로 숨어들었다.','big')}},
 {k:'emig',n:'국경을 넘어 망명한다',s:'재산 절반을 잃고 일을 버린다',c:()=>free()&&T()>=1789.25&&T()<1799.75&&(noble()||s.sus>=25||s.flags.refractory||s.pol<-40),inter:async()=>{const r=await roll(s.st.cour>=50?1:0,{label:'국경 넘기'});if(r.v>=3)await emigrate();else if(r.v===1&&T()>=1792.5){say('국경에서 붙잡혔다.','big');s.cond='prison';s.prisonKind='terror';s.condSince=T();fx({sus:25})}else say('국경 경비가 삼엄해 되돌아왔다.'+fx({sus:5}));await done()}},
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
