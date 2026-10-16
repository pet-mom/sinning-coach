/* ================= 직업 확장: 하인·바다·예술·관리·도시 품팔이 · 전문 장인 (job_) =================
   defineTrack / defineJob / defineEntry 등록부로 더한다. 새 직업을 더하려면 아래 표에 한 줄씩 보태면 된다.
   pay: 연 수입(리브르, 1795년 뒤엔 프랑). 기존 표의 눈금(날품팔이 160, 직인 330, 장인 900, 변호사 1800)에 맞춘다.
   need: {edu,soc,dex,str,cour,faith,fame,cost,money,land, sk:{숙련}, kn:{학식}}. ok(): 그 시대·성별·지역에 그 자리가 있는가. */
const jbPort=()=>['nantes','bordeaux','marseille','rouen','bretagne','normandie'].includes(loc());
const jbPortN=()=>({nantes:'낭트',bordeaux:'보르도',marseille:'마르세유',rouen:'루앙',bretagne:pick(['생말로','브레스트','로리앙']),normandie:pick(['르아브르','옹플뢰르','디에프'])}[loc()]||'항구');
const jbIs=(...ids)=>!!s.job&&ids.includes(s.job);
const jbF=()=>!isM();
const jbCult=()=>!(T()>=1792.6&&T()<1801.6);

/* ---------- 트랙 ---------- */
// sk: 해마다 그 트랙이 기르는 숙련·학식(값이 0이면 자라지 않는다). main: ‘솜씨를 갈고닦는다’가 기르는 숙련.
defineTrack('serv','하인·가사',{key:['soc',40],p:.05,lit:false,sk:{manner:2,trade:1,get cook(){return jbIs('sv2','sv3')?2:0},get sew(){return jbIs('sv2b')&&!isM()?2:0},get main(){return jbIs('sv2')?'cook':'manner'}}});
defineTrack('sea','바다·항구',{key:['str',45],p:.06,lit:false,sk:{str:2,khist:1,get ksci(){return jbIs('se3','se4')?2:0},get trade(){return jbIs('se4','se5')?2:0},main:'craft'}});
defineTrack('art','예술·공연',{key:['dex',50],p:.05,lit:false,sk:{dex:1,
  get draw(){return jbIs('ar1','ar2p','ar2m','ar3p','ar4')?3:0},get music(){return jbIs('ar1m','ar2o','ar2s','ar3o')?3:0},get orat(){return jbIs('ar2c','ar3')?3:0},get klett(){return jbIs('ar2c','ar3')?1:0},
  get main(){return jbIs('ar1m','ar2o','ar2s','ar3o')?'music':jbIs('ar2c','ar3')?'orat':'draw'}}});
defineTrack('state','관리·기술직',{key:['edu',50],p:.07,sk:{pen:2,trade:1,get ksci(){return jbIs('st2x','st3i','st4')?3:0},get arms(){return jbIs('st1m','st1e','st2b','st1g','st1d')?2:0},get ride(){return jbIs('st1m','st1e','st2b')?2:0},get klaw(){return jbIs('st2r','st3n','st4d','st5')?1:0},
  get main(){return jbIs('st1m','st1e','st2b')?'ride':jbIs('st1g','st1d')?'arms':'pen'}}});
defineTrack('peuple','도시 품팔이·행상',{key:['soc',35],p:.04,lit:false,sk:{str:1,get trade(){return jbIs('pe1r','pe2p','pe2v','pe3a','pe3i')?2:0},get cook(){return jbIs('pe3a','pe3i')?1:0},
  get main(){return jbIs('pe1r','pe2p','pe2v','pe3a')?'trade':jbIs('pe3i')?'cook':jbIs('pe1b','pe1f')?'sew':'craft'}}});
// 영향력 계산의 공직·직책 몫(트랙 단계별)
Object.assign(OFFICE,{serv:[0,0,0,1,2],sea:[0,0,0,1,2,6],art:[0,0,1,3,6],state:[0,1,3,6,10,15],peuple:[0,0,0,1]});

/* ---------- 하인·가사 ---------- */
defineJob('sv1','serv',1,'제복 하인','집안 하녀','laquais / fille de service',110,{});
defineJob('sv1n','serv',1,'유모','유모','nourrice',90,{hp:45},()=>jbF()&&s.married&&s.age>=18&&s.age<42&&!urban());
defineJob('sv2','serv',2,'요리사','여자 요리사','cuisinier / cuisinière',300,{dex:25,sk:{cook:20}});
defineJob('sv2b','serv',2,'시종','몸종','valet de chambre / femme de chambre',250,{soc:30,sk:{manner:20}});
defineJob('sv3','serv',3,'집사장','살림 총괄 가정부','maître d’hôtel / gouvernante de maison',700,{soc:35,sk:{manner:30,trade:15}});
defineJob('sv4','serv',4,'영지·저택 관리인',null,'intendant de maison / régisseur',2000,{edu:35,soc:40,sk:{trade:30}});

/* ---------- 바다·항구 ---------- */
defineJob('se1','sea',1,'수습 선원',null,'mousse',40,{},()=>jbPort()&&isM());
defineJob('se2','sea',2,'선원',null,'matelot',240,{str:35},()=>jbPort()&&isM());
defineJob('se3','sea',3,'갑판장',null,'maître d’équipage',500,{str:40,cour:35},()=>jbPort()&&isM());
defineJob('se4','sea',4,'상선 선장',null,'capitaine marchand',2000,{edu:35,cour:40,kn:{ksci:20}},()=>jbPort()&&isM());
defineJob('se5','sea',5,'선주','선주','armateur',10000,{money:30000,soc:45,sk:{trade:40}},()=>jbPort());

/* ---------- 예술·공연 ---------- */
defineJob('ar1','art',1,'화실 제자','화실 제자','élève d’atelier',0,{dex:20,cost:100},()=>urban());
defineJob('ar1m','art',1,'성가대 학교 학생',null,'enfant de la maîtrise',30,{},()=>isM()&&s.age<19&&jbCult()&&s.faithKind==='catholic');
defineJob('ar2p','art',2,'화가','화가','peintre',800,{dex:40,sk:{draw:35}},()=>urban());
defineJob('ar2m','art',2,'세밀화가','세밀화가','miniaturiste',700,{dex:45,sk:{draw:30}},()=>urban());
defineJob('ar2o','art',2,'악단 연주자','악단 연주자','musicien d’orchestre',600,{dex:35,sk:{music:35}},()=>urban()&&(isM()||T()>=1795.8));
defineJob('ar2c','art',2,'배우','여배우','comédien / comédienne',1200,{soc:40,edu:35,sk:{orat:30}},()=>urban());
defineJob('ar2s','art',2,'오페라 가수','오페라 가수','chanteur / chanteuse de l’Opéra',1500,{soc:35,sk:{music:40}},()=>inParis());
defineJob('ar3','art',3,'코메디프랑세즈 정단원','코메디프랑세즈 정단원','sociétaire de la Comédie-Française',6000,{fame:30,sk:{orat:45}},()=>inParis()&&(T()<1793.67||T()>=1799.4));
defineJob('ar3p','art',3,'아카데미 준회원 화가','아카데미 준회원 화가','agréé de l’Académie royale de peinture',2000,{fame:20,sk:{draw:55}},()=>T()<1793.6);
defineJob('ar3o','art',3,'악단장',null,'maître de musique / chef d’orchestre',2000,{soc:35,sk:{music:55}},()=>urban());
defineJob('ar4','art',4,'미술 아카데미 회원','미술 아카데미 여성 회원','académicien (peinture) / membre de l’Institut',4000,{fame:40,sk:{draw:65}},()=>T()<1793.6||(T()>=1795.8&&isM()));

/* ---------- 관리·기술직 ---------- */
defineJob('st1f','state',1,'징세 청부 사무원',null,'commis des Fermes',450,{edu:30},()=>T()<1791.2&&isM());
defineJob('st1g','state',1,'소금세 감시원',null,'garde des gabelles (gabelou)',250,{str:30,cour:25},()=>T()<1790.2&&isM());
defineJob('st1d','state',1,'세관원',null,'préposé des douanes',350,{str:30},()=>T()>=1791.3&&isM());
defineJob('st1m','state',1,'기마경찰대원',null,'cavalier de la maréchaussée',300,{str:40,cour:35,sk:{ride:20}},()=>T()<1791.1&&isM());
defineJob('st1e','state',1,'헌병',null,'gendarme',500,{str:40,cour:35,sk:{ride:20}},()=>T()>=1791.1&&isM());
defineJob('st1b','state',1,'관청 사무원',null,'commis de bureau',500,{edu:35,sk:{pen:20}},()=>isM());
defineJob('st1t','state',1,'담배 판매소 주인','담배 판매소 여주인','débitant / débitante de tabac',300,{sk:{trade:10}},()=>T()<1791.1||T()>=1811);
defineJob('st2x','state',2,'이공과 학교 학생',null,'élève de l’École polytechnique',1200,{edu:45,kn:{ksci:30}},()=>isM()&&T()>=1794.9);
Object.defineProperty(POST.st2x,'pay',{get(){return T()<1805?1200:0}}); // 1805년부터 봉급 대신 학비를 냈다
defineJob('st2r','state',2,'징수관',null,'receveur des tailles / des contributions',1800,{edu:40,cost:4000,sk:{trade:25}},()=>isM());
defineJob('st2e','state',2,'중앙 부처 직원',null,'employé de ministère',1500,{edu:45,sk:{pen:35}},()=>isM());
defineJob('st2b','state',2,'헌병 반장',null,'brigadier (maréchaussée / gendarmerie)',600,{cour:40,str:40,sk:{ride:25}},()=>isM());
defineJob('st3i','state',3,'토목 기사',null,'ingénieur des Ponts et Chaussées',2400,{edu:55,kn:{get ksci(){return T()>=1795?50:40}}},()=>isM());
defineJob('st3n','state',3,'세무 감독관',null,'inspecteur des contributions / de l’enregistrement',3000,{edu:50,soc:35},()=>isM());
defineJob('st4','state',4,'수석 기사',null,'ingénieur en chef des Ponts et Chaussées',5000,{edu:60,fame:15,kn:{ksci:55}},()=>isM());
defineJob('st4d','state',4,'세무·세관 국장',null,'directeur des Contributions / des Douanes',6000,{edu:55,soc:45,fame:20},()=>isM());
defineJob('st5','state',5,'총징세관',null,'receveur général des finances',25000,{money:80000,soc:50,edu:45},()=>isM()&&(T()<1791||T()>=1799.9));

/* ---------- 도시 품팔이·행상 ---------- */
defineJob('pe1w','peuple',1,'물장수',null,'porteur d’eau',180,{str:35},()=>isM()&&(urban()||loc()==='auvergne'));
defineJob('pe1c','peuple',1,'짐꾼',null,'crocheteur / portefaix',170,{str:40},()=>isM()&&urban());
defineJob('pe1b','peuple',1,'세탁부','세탁부','blanchisseuse',150,{str:20},()=>jbF()&&(urban()||loc()==='ile'));
defineJob('pe1f','peuple',1,'실 잣는 여인','실 잣는 여인','fileuse',70,{},()=>jbF()&&T()<1830);
defineJob('pe1r','peuple',1,'등짐장수','길거리 채소 장수','colporteur / marchande des quatre-saisons',160,{});
defineJob('pe2f','peuple',2,'중앙시장 짐꾼',null,'fort des Halles',450,{str:55},()=>isM()&&inParis());
defineJob('pe2p','peuple',2,'중앙시장 생선 장수','중앙시장 생선 장수','poissarde / dame de la Halle',350,{soc:25,sk:{trade:15}},()=>jbF()&&inParis());
defineJob('pe2v','peuple',2,'헌옷 장수','헌옷 장수','fripier / revendeuse à la toilette',300,{sk:{trade:20}},()=>urban());
defineJob('pe3a','peuple',3,'선술집 주인','선술집 안주인','cabaretier / cabaretière',700,{cost:600,soc:30,sk:{trade:20}});
defineJob('pe3i','peuple',3,'여관 주인','여관 안주인','aubergiste',1200,{cost:1500,soc:35,sk:{cook:20,trade:25}});

/* ---------- 수공업·상업: 전문 직인과 장인 ---------- */
defineJob('c2t','craft',2,'인쇄 식자공',null,'compagnon imprimeur / compositeur',450,{dex:30,sk:{print:20}},()=>isM()&&lit()&&urban());
defineJob('c2c','craft',2,'제빵 직인',null,'garçon boulanger / geindre',300,{str:30,sk:{cook:20}},()=>isM());
defineJob('c2k','craft',2,'견직공','견직 여공','ouvrier en soie (canut) / ouvrière en soie',300,{sk:{weave:20}},()=>loc()==='lyon');
defineJob('c2l','craft',2,null,'속옷 재봉사','lingère',280,{dex:25,sk:{sew:30}},()=>jbF());
defineJob('c3p','craft',3,'인쇄 출판업자','인쇄소 여주인','imprimeur-libraire',2200,{cost:3000,soc:30,sk:{print:35}},()=>lit()&&urban());
defineJob('c3b','craft',3,'제빵 장인','빵집 안주인','maître boulanger / boulangère',800,{cost:400,sk:{cook:35}});
defineJob('c3m','craft',3,'가구 장인',null,'maître menuisier-ébéniste',1000,{cost:500,dex:45,sk:{wood:40}},()=>isM());
defineJob('c3h','craft',3,'시계 장인',null,'maître horloger',1200,{cost:600,dex:50,sk:{metal:45}},()=>isM()&&urban());
defineJob('c3l','craft',3,'자물쇠 장인',null,'maître serrurier',800,{cost:400,sk:{metal:35}},()=>isM());
defineJob('c3s','craft',3,'견직물 제조업자','견직물 제조업자','fabricant de soieries',2000,{cost:2000,soc:30,sk:{weave:40,trade:20}},()=>loc()==='lyon');
defineJob('c3t','craft',3,'재단 장인','재봉 장인','maître tailleur / maîtresse couturière',900,{cost:400,sk:{sew:40}});
// 여성 전용 직업은 n을 nf와 같게 둔다(성별은 ok가 거른다)
POST.c2l.n=POST.c2l.nf;PL.find(x=>x[0]==='c2l')[3]=POST.c2l.nf;

/* ---------- 문필: 학교 선생 ---------- */
defineJob('w0','letters',1,'마을 학교 선생','학교 여선생','maître / maîtresse d’école (instituteur)',200,{edu:30});

/* ---------- 수공업 전문 분야를 직업에 맞춘다 · 자리를 얻을 때 함께 일어나는 일 ---------- */
const JOB_SPEC={c2t:'print',c3p:'print',c2c:'cook',c3b:'cook',c2k:'weave',c3s:'weave',c2l:'sew',c3t:'sew',c3m:'wood',c3h:'metal',c3l:'metal'};
const JOB_ON={pe1w:()=>{if(!urban()){s.loc='paris';say('동향 사람들을 따라 파리로 올라가 물통을 멨다. 오베르뉴 사람 물장수는 파리 어디에나 있다.')}},
  st2x:()=>{if(T()<1805)say('입학시험을 통과했다. 학생에게 봉급이 나온다. 몽주와 라그랑주가 가르친다.','sys');else say('입학시험을 통과했다. 학비는 한 해 800프랑, 군복을 입고 기숙한다.'+fx({money:-800}),'sys')},
  ar3:()=>fx({fame:3}),ar4:()=>fx({fame:4,relite:3}),se5:()=>fx({relite:2}),sv1n:()=>say('파리 유모 사무소의 짐수레꾼이 젖먹이를 데려왔다.','sys')};
{const tj0=takeJob;takeJob=function(id,pre){tj0(id,pre);if(JOB_SPEC[id])s.spec=JOB_SPEC[id];if(JOB_ON[id]){try{JOB_ON[id]()}catch(e){console.error(e)}}}}

/* ---------- 진로 (열네 살 · 진로 바꾸기) ---------- */
const jbE=(...es)=>es.includes(s.estate);
defineEntry('sv1','부잣집 제복 하인으로 들어간다. 먹고 자는 것은 주인 몫이다',()=>isM()&&jbE('peasant','artisan'));
defineEntry('sv1','부잣집 하녀로 들어간다. 먹고 자는 것은 주인 몫이다',()=>jbF()&&jbE('peasant','artisan'));
defineEntry('sv1n','파리에서 온 젖먹이를 맡아 젖을 먹인다',()=>jbE('peasant','artisan'));
defineEntry('sv2','대갓집 부엌에 요리사로 들어간다',()=>!noble());
defineEntry('sv2b','귀족 집안의 몸시중을 든다',()=>jbE('peasant','artisan','bourgeois'));
defineEntry('sv3','큰 저택의 살림을 맡는다',()=>!noble());
defineEntry('sv4','귀족의 영지와 저택을 관리한다',()=>jbE('bourgeois','artisan','peasant'));
defineEntry('se1','배에 수습 선원으로 오른다',()=>s.age<=20&&!noble());
defineEntry('se2','상선의 선원으로 계약한다',()=>!noble());
defineEntry('se4','상선의 지휘를 맡는다(수로 학교 시험)',()=>!noble()||s.estate==='hobereau');
defineEntry('se5','배를 꾸려 원양 무역에 나선다',()=>jbE('bourgeois')||rich());
defineEntry('ar1','화가의 화실에 제자로 들어간다',()=>jbE('artisan','bourgeois')&&s.sk.draw>=5);
defineEntry('ar1m','대성당 성가대 학교에 들어간다',()=>jbE('artisan','peasant','bourgeois')&&s.age<16,{firstOnly:true});
defineEntry('ar2p','붓 하나로 먹고산다',()=>!noble()||s.estate==='hobereau');
defineEntry('ar2m','상아판에 세밀 초상을 그린다',()=>!noble()||!isM());
defineEntry('ar2o','극장 악단에 들어간다',()=>!noble());
defineEntry('ar2c','극단에 들어가 무대에 선다',()=>!noble());
defineEntry('ar2s','오페라 무대에 선다',()=>!noble());
defineEntry('st1f','징세 청부 회사(페름 제네랄)의 사무원이 된다',()=>jbE('artisan','bourgeois','peasant'));
defineEntry('st1g','소금세 감시대에 들어간다. 미움받지만 봉급은 꼬박 나온다',()=>jbE('peasant','artisan'));
defineEntry('st1d','국경 세관원이 된다',()=>jbE('peasant','artisan','bourgeois'));
defineEntry('st1m','기마경찰대(마레쇼세)에 들어간다',()=>jbE('peasant','artisan','bourgeois')&&s.age>=18);
defineEntry('st1e','헌병대에 들어간다',()=>jbE('peasant','artisan','bourgeois')&&s.age>=18);
defineEntry('st1b','관청 사무실에서 서류를 쓴다',()=>jbE('artisan','bourgeois','hobereau'));
defineEntry('st1t','담배 판매소를 맡는다',()=>(jbF()&&s.age>=30)||(s.flags.army&&s.age>=40));
defineEntry('st2x','이공과 학교(에콜 폴리테크니크) 입학시험을 친다',()=>s.age>=16&&s.age<=20&&!jbE('peasant'));
defineEntry('st3i','토목 학교를 마치고 왕국의 길과 다리를 놓는다',()=>!jbE('peasant'));
defineEntry('pe1w','물통을 지고 물을 판다',()=>jbE('peasant','artisan')&&(urban()||loc()==='auvergne'));
defineEntry('pe1c','부두와 시장에서 짐을 진다',()=>jbE('peasant','artisan'));
defineEntry('pe1b','강가 빨래배에서 남의 빨래를 한다',()=>jbE('peasant','artisan'));
defineEntry('pe1f','집에서 물레를 돌려 실을 잣는다',()=>jbE('peasant','artisan'));
defineEntry('pe1r','등짐을 지고 물건을 팔러 다닌다',()=>jbE('peasant','artisan'));
defineEntry('pe2f','중앙시장 짐꾼 조합에 든다',()=>jbE('peasant','artisan'));
defineEntry('pe2p','중앙시장에 생선 좌판을 얻는다',()=>jbE('artisan','peasant'));
defineEntry('pe2v','헌옷 장사를 한다',()=>jbE('artisan','peasant'));
defineEntry('pe3a','선술집을 차린다',()=>!noble());
defineEntry('pe3i','큰길가에 여관을 차린다',()=>!noble());
defineEntry('c2t','인쇄소 직인으로 들어간다',()=>jbE('artisan','bourgeois'));
defineEntry('c2c','빵집 지하 화덕에서 반죽을 친다',()=>jbE('artisan','peasant'));
defineEntry('c2k','견직 공방에서 직기를 돌린다',()=>jbE('artisan','peasant'));
defineEntry('c2l','속옷과 리넨을 짓는다',()=>jbE('artisan','peasant','bourgeois'));
defineEntry('c3p','인쇄소와 책방을 차린다',()=>jbE('artisan','bourgeois'));
defineEntry('c3b','빵집을 연다',()=>jbE('artisan','peasant'));
defineEntry('c3m','장인 시험작을 내고 가구 공방을 연다',()=>jbE('artisan'));
defineEntry('c3h','시계 공방을 연다',()=>jbE('artisan','bourgeois'));
defineEntry('c3l','자물쇠 공방을 연다',()=>jbE('artisan'));
defineEntry('c3s','견직물 주문을 받아 직공들에게 일감을 나눈다',()=>jbE('artisan','bourgeois'));
defineEntry('c3t','재단 공방을 연다',()=>jbE('artisan','bourgeois'));
defineEntry('w0','마을 아이들에게 읽기와 교리문답을 가르친다',()=>jbE('peasant','artisan','bourgeois'));

/* ---------- 직업 생활 장면 ---------- */
const jbFree=(...ids)=>free()&&jbIs(...ids);
EV.push(
 // 시대가 바뀌어 자리가 없어졌을 때
 {id:'job_gone',c:()=>free()&&!!job()&&!!JOB_GONE[s.job]&&!job().ok(),w:40,cd:0,run:async()=>{const g=JOB_GONE[s.job];if(g)g()}},
 // ---------- 하인·가사 ----------
 S('job_serv',()=>free()&&onTrack('serv'),1.5,0,[
   ['새벽 다섯 시에 일어나 벽난로에 불을 지피고 주인의 구두를 닦았다.',{str:1},()=>s.job!=='sv1n'],
   ['마님의 마차 뒤 발판에 서서 제복 차림으로 시내를 돌았다.',{manner:1},()=>s.job==='sv1'&&isM()],
   ['대기실(앙티샹브르)에서 다른 집 하인들과 주인 흉을 보며 기다렸다.',{soc:1,rguild:1},()=>s.job!=='sv1n'],
   ['주인이 한 해 품삯(가주)을 미루었다. 하인은 품삯을 따질 처지가 못 된다.',{money:-30,vjus:1},()=>s.job!=='sv1n'&&R()<.5],
   ['새해 선물(에트렌)로 주인에게서 은화 몇 닢을 받았다.',{money:12},()=>s.job!=='sv1n'&&s.month<=1],
   ['보마르셰의 『피가로의 결혼』 대사가 하인 방에 돌았다. “나리께서는 태어나는 수고밖에 하신 게 없지요.”',{veq:2,bor:1},()=>T()>=1784.3&&T()<1790&&s.job!=='sv1n'],
   ['남에게 매인 하인이라는 이유로 능동시민 명부에 오르지 못했다.',{veq:2,vjus:1},()=>isM()&&T()>=1790&&T()<1795&&s.job!=='sv1n',1],
   ['소스를 졸이다 손을 데었다. 주인은 손님 스무 명의 만찬을 기다린다.',{cook:1,hp:-1},()=>s.job==='sv2'],
   ['다섯 가지 코스의 만찬을 차려 냈다. 손님들이 요리사를 불러 칭찬하였다.',{cook:2,rguild:2},()=>s.job==='sv2'],
   ['혁명 뒤 주인 잃은 요리사들이 거리에 식당(레스토랑)을 차린다는 소문을 들었다.',{trade:1},()=>s.job==='sv2'&&T()>=1790&&T()<1800,1],
   ['마님의 머리를 매만지고 레이스를 다리며 하루를 보냈다.',{sew:1,manner:1},()=>s.job==='sv2b'&&!isM()],
   ['은그릇과 리넨 목록을 맞추고 하인들의 품삯 장부를 정리하였다.',{trade:1},()=>jbIs('sv3','sv4')],
   ['영지의 소작료 장부를 들고 소작인들을 돌았다. 다들 내년에 내겠다고 하였다.',{trade:2,rloc:-1},()=>s.job==='sv4'],
   ['파리 유모 사무소의 짐수레꾼(므뇌르)이 석 달치 젖삯을 가지고 왔다.',{money:15},()=>s.job==='sv1n'],
   ['젖먹이가 밤새 울었다. 내 아이에게 돌아갈 젖이 모자랐다.',{hp:-1,rfam:-1},()=>s.job==='sv1n'],
   ['맡은 젖먹이가 겨울을 넘기지 못했다. 신부가 작은 관 위에 성수를 뿌렸다.',{faith:1,hp:-1},()=>s.job==='sv1n'&&R()<.5]]),
 C('job_silver',()=>free()&&jbIs('sv1','sv2','sv2b','sv3'),.6,6,'은수저 한 벌','vol domestique',()=>`찬장에서 은수저 한 벌이 사라졌다. 주인은 하인들을 의심한다. 주인집 물건을 훔친 하인은 ${T()<1791.75?'교수형까지 받을 수 있다':'쇠사슬 징역형을 받는다'}.`,[
   {l:'동료 하인이 수상하다고 말한다',s:'',a:'safe greedy',f:()=>say('부엌데기 아이가 쫓겨났다. 하인 방에서는 그대와 말을 섞지 않았다.'+fx({rguild:-5,vjus:-2,relite:1}))},
   {l:'내 짐부터 뒤져 보라고 내민다',s:'',a:'bold',f:()=>say('보따리를 풀어 보였다. 은수저는 나중에 마님의 바느질 상자에서 나왔다.'+fx({manner:1,relite:2,rguild:1,vhon:2}))},
   {l:'모른다고 버틴다',s:'사교 판정',a:'safe',f:async()=>{const {m,why}=md([[s.st.soc>=45,1,'사교'],[s.sk.manner>=30,1,'몸가짐'],[s.rep.rguild<=35,-1,'동료의 미움']]);const r=await roll(m,{label:'의심',why});
     if(r.v>=3)say('주인은 더 캐묻지 않았다.'+fx({cour:1}));else{say('주인이 소개장(세르티피카) 없이 내보냈다. 소개장 없는 하인은 새 자리를 얻기 어렵다.'+fx({rloc:-3,relite:-2}));loseJob('% 자리를 잃었다.')}}}]),
 // ---------- 바다·항구 ----------
 S('job_sea',()=>free()&&onTrack('sea'),1.5,0,[
   ['돛대 꼭대기에 올라 젖은 돛을 접었다. 손바닥이 밧줄에 쓸렸다.',{str:2,hp:-1},()=>job().t<=2],
   ['배 안 심부름을 하다 갑판장의 밧줄 끝에 맞았다.',{hp:-1,cour:1},()=>s.job==='se1'],
   ['대구잡이 배를 타고 뉴펀들랜드 어장에 다녀왔다.',{str:2,money:30},()=>['bretagne','normandie'].includes(loc())&&job().t<=3],
   ['생도맹그에서 설탕과 커피를 싣고 돌아왔다.',{money:40,khist:2},()=>loc()!=='marseille'&&T()<1791.6&&job().t<=4],
   ['레반트의 스미르나에서 목화와 비단을 싣고 왔다.',{money:40,klang:1},()=>loc()==='marseille'&&job().t<=4],
   ['괴혈병으로 동료 둘을 바다에 묻었다.',{hp:-3,faith:1},()=>job().t<=4&&R()<.4],
   ['폭풍에 돛대가 부러져 사흘을 떠다녔다.',{cour:2,hp:-2},()=>job().t<=4],
   ['영국 사략선에 쫓겨 항구로 달아났다.',{cour:1},()=>atWar()&&job().t<=4],
   ['대륙봉쇄로 배가 부두에 묶였다. 하릴없이 그물만 기웠다.',{money:-30},()=>T()>=1806.9&&T()<1814.3],
   ['육분의로 정오의 해 높이를 재어 위도를 셈하였다.',{ksci:2},()=>jbIs('se3','se4')],
   ['실을 짐과 선원 품삯을 놓고 선주와 셈을 맞추었다.',{trade:2},()=>s.job==='se4'],
   ['선박 보험 계약서에 서명하였다. 배 한 척이 가라앉으면 집안이 기운다.',{trade:2},()=>s.job==='se5'],
   ['부두의 상품 거래소에서 설탕과 인디고 값을 흥정하였다.',{trade:2,soc:1},()=>s.job==='se5']]),
 C('job_classes',()=>free()&&isM()&&jbIs('se1','se2','se3')&&atWar()&&s.age>=18,1,3,'해군 징집','les classes / l’inscription maritime',()=>`전쟁이 나자 ${T()<1795?'해군 징집 명부(클라스)':'해양 등록부(앵스크립시옹 마리팀)'}에 오른 선원들에게 군함에 오르라는 명령이 내려왔다. 군함의 품삯은 상선보다 적고 군함의 병은 대포보다 무섭다.`,[
   {l:'군함에 오른다',s:'',a:'bold royal',f:async()=>{if(await chance(.07,'군함에서의 죽음','18세기 말 해군 징집 선원의 사망률(전투·괴혈병·열병)')){die('battle','바다');return}say(`${jbPortN()}에서 군함에 올라 한 철을 보냈다. 포탄 소리에 귀가 먹먹하였다.`+fx({cour:3,fame:1,money:40,rloc:2,str:1}))}},
   {l:'숨어 버린다',s:'붙잡히면 감옥',a:'safe',f:async()=>{if(await chance(.25,'징집 기피자 체포','해안 마을의 기피 선원 체포 비율')){s.cond='prison';s.prisonKind='plain';s.condSince=T();say('해군 감시인에게 붙잡혀 감옥에 갇혔다.'+fx({sus:6}),'big')}else say('뭍의 친척 집 헛간에 숨어 지냈다.'+fx({hp:-1,rloc:-1,sus:3}))}}]),
 C('job_traite',()=>free()&&jbIs('se4','se5')&&loc()!=='marseille'&&(T()<1794.1||(T()>=1802.4&&T()<1831)),.6,8,'아프리카로 가는 배','la traite',()=>`선주들이 아프리카 해안으로 갈 배를 꾸린다. 기니 해안에서 사람을 사서 서인도에 팔고 설탕을 싣고 돌아오는 ‘삼각 무역’이다. ${T()>=1815?'1815년부터 노예 무역은 금지되었지만 배들은 몰래 떠난다.':T()>=1788?'파리의 ‘흑인의 벗 협회’는 이 무역을 그만두라고 외친다.':'한 번 성공하면 큰돈을 번다. 배의 열에 하나는 돌아오지 못한다.'}`,()=>{const g=s.job==='se5'?ri(4000,9000):ri(800,1600);return [
   {l:s.job==='se5'?'배를 꾸린다':'배를 지휘한다',s:'',a:'greedy bold',f:async()=>{if(await chance(.12,'항해 실패','노예 무역선의 손실 비율')){say('배가 반란과 열병으로 돌아오지 못했다.'+fx({money:-Math.round(g*.6),vjus:-2,rguild:-2}),'dark');return}say('배가 돌아왔다. 장부에는 돈이 남았고, 화물칸에서 죽은 사람들의 이름은 남지 않았다.'+fx({money:g,veq:-3,vjus:-4,relite:1,sus:T()>=1815?6:0}))}},
   {l:'손대지 않는다',s:'',a:'pious',f:()=>say('그 일에는 끼지 않겠다고 했다. 다른 선주들은 그대를 물정 모르는 사람이라 했다.'+fx({vjus:3,veq:2,rguild:-2}))}]}),
 // ---------- 예술·공연 ----------
 S('job_art',()=>free()&&onTrack('art'),1.5,0,[
   ['석고상을 목탄으로 베꼈다. 스승은 한 번 보고 빵 조각으로 지워 버렸다.',{draw:2},()=>s.job==='ar1'],
   ['스승의 큰 그림에 하늘과 옷 주름을 대신 칠하였다.',{draw:2,dex:1},()=>s.job==='ar1'],
   ['로마상(프리 드 로마) 경연에 나간 선배가 돌아와 이탈리아 이야기를 하였다.',{draw:1,khist:1},()=>s.job==='ar1'&&(T()<1793.6||T()>=1797)],
   ['새벽 미사에서 성가를 불렀다. 라틴어 가사를 외웠다.',{music:2,klat:1},()=>s.job==='ar1m'],
   ['상아판에 귀부인의 세밀 초상을 그렸다. 코담배갑 뚜껑에 들어갈 그림이다.',{draw:2,money:30},()=>s.job==='ar2m'],
   ['초상화 주문을 받아 상인 부부를 그렸다.',{draw:2,money:60},()=>jbIs('ar2p','ar3p','ar4')],
   ['루브르의 살롱 전시회를 보러 갔다. 아카데미 회원이 아니면 그림을 걸 수 없다.',{draw:1},()=>jbIs('ar2p','ar2m')&&T()<1791],
   ['다비드의 『호라티우스 형제의 맹세』 앞에 사람들이 몰려 있었다.',{draw:1,brg:1},()=>jbIs('ar1','ar2p','ar2m','ar3p','ar4')&&s.year>=1785&&s.year<=1787,1],
   ['극장 악단석에서 밤마다 같은 곡을 켰다.',{music:2},()=>jbIs('ar2o','ar3o')],
   ['성 주간 음악회(콩세르 스피리튀엘)에서 연주하였다.',{music:2,fame:1},()=>jbIs('ar2o','ar3o','ar2s')&&inParis()&&T()<1790.5],
   ['파리 음악원(1795년 설립) 연주회에 불려 나갔다.',{music:2,fame:1},()=>jbIs('ar2o','ar3o')&&inParis()&&T()>=1796],
   ['새 배역의 대사 천 줄을 외웠다.',{orat:2,klett:2},()=>jbIs('ar2c','ar3')],
   ['서서 보는 바닥석(파르테르)의 관객들이 휘파람과 야유를 퍼부었다.',{fame:-1,cour:1},()=>jbIs('ar2c','ar3','ar2s')],
   ['혁명 축제의 합창에 불려 나가 「라 마르세예즈」를 불렀다.',{music:1,pol:2},()=>jbIs('ar2s','ar2o','ar3o')&&T()>=1792.6&&T()<1795,1]]),
 C('job_excom',()=>free()&&jbIs('ar2c','ar3','ar2s')&&T()<1789.95&&s.faithKind==='catholic',.8,10,'배우의 파문','l’excommunication des comédiens','교회는 배우를 파문된 자로 여긴다. 무대를 버리겠다고 맹세하지 않으면 혼배성사도 병자성사도 받지 못하고, 죽어서 성당 묘지에 묻히지도 못한다. 아드리엔 르쿠브뢰르는 길가에 묻혔다.',[
   {l:'신부 앞에서 무대를 떠나겠다고 맹세한다',s:'',a:'pious',f:()=>{say('맹세하고 분장을 지웠다.'+fx({faith:4,rfam:2,fame:-2}));loseJob('% 일을 그만두었다.')}},
   {l:'맹세하고 몇 달 뒤 무대로 돌아간다',s:'',a:'social',f:()=>say('많은 배우가 하는 대로 하였다. 성사를 받고, 다시 분장을 하였다.'+fx({faith:-1,fame:1,rguild:2}))},
   {l:'아무 맹세도 하지 않는다',s:'',a:'bold radical',f:()=>say('무대가 내 신앙이라고 하였다. 신부는 고개를 저었다.'+fx({faith:-4,vlib:3,brl:3,rloc:-2,fame:1}))}]),
 C('job_salon',()=>free()&&jbIs('ar2p','ar2m','ar3p','ar4')&&(!jbIs('ar2p','ar2m')||T()>=1791)&&s.year%2===1,.9,2,'살롱 출품','le Salon',()=>`루브르의 살롱 전시회가 열린다. ${T()<1791?'아카데미 회원과 준회원만 그림을 걸 수 있다.':'1791년부터는 누구나 출품할 수 있다. 심사단이 그림을 고른다.'} 비평가들의 글 한 줄이 주문을 좌우한다.`,[
   {l:'큰 역사화를 낸다',s:'그림 판정',a:'bold work',f:async()=>{const {m,why}=md([[s.sk.draw>=55,1,'그림 솜씨'],[s.sk.draw<35,-1,'솜씨 부족'],[s.fame>=30,1,'명성'],[!!patron(),1,'후원자'],[s.kn.khist>=25,1,'역사 지식']]);const r=await roll(m,{label:'살롱 출품',why});
     if(r.v>=5)say('비평가들이 그림 앞에 오래 머물렀다. 주문이 밀려들었다.'+fx({fame:4,money:300,relite:3,draw:2}),'big');else if(r.v>=3)say('그림이 높은 벽 구석에 걸렸다. 몇 사람이 알아보았다.'+fx({fame:1,draw:1}));else say('비평가 하나가 그대의 그림을 두고 ‘간판 그림’이라 썼다.'+fx({fame:-2,cour:1}))}},
   {l:'초상화 몇 점만 낸다',s:'',a:'safe',f:()=>say('얌전한 초상화가 팔려 나갔다.'+fx({money:120,fame:1}))}]),
 // ---------- 관리·기술직 ----------
 S('job_state',()=>free()&&onTrack('state'),1.5,0,[
   ['밀수꾼(포소니에)의 발자국을 쫓아 밤길을 걸었다. 마을 사람들은 문을 닫아걸었다.',{str:1,rloc:-2},()=>s.job==='st1g'],
   ['장터에서 소금 자루를 뒤지다 아낙들에게 욕을 먹었다. ‘가블루’는 욕이다.',{rpeople:-2},()=>s.job==='st1g'],
   ['파리 입시 관문에서 포도주 통마다 입시세를 매겼다.',{trade:1,rpeople:-1},()=>s.job==='st1f'&&inParis()],
   ['징세 청부 회사 사무실에서 담배와 소금 판매 장부를 맞추었다.',{trade:1,pen:1},()=>s.job==='st1f'],
   ['국경 초소에서 밤새 밀수 길목을 지켰다.',{str:1,hp:-1},()=>s.job==='st1d'],
   ['영국 면포를 숨긴 수레를 잡았다. 압수품의 몫이 돌아왔다.',{money:40,rpeople:-1},()=>s.job==='st1d'&&R()<.5],
   ['큰길을 순찰하며 떠돌이와 탈영병을 검문하였다.',{ride:2,arms:1},()=>jbIs('st1m','st1e','st2b')],
   ['장날 싸움판을 말리고 술 취한 짐마차꾼을 묶어 갔다.',{str:1,rloc:1},()=>jbIs('st1m','st1e','st2b')],
   ['징집을 피해 숲에 숨은 젊은이들(레프락테르)을 쫓아 산을 뒤졌다.',{rloc:-3,str:1},()=>jbIs('st1e','st2b')&&T()>=1799&&T()<1814.3],
   ['서류 더미 사이에서 하루 열 시간 사본을 베꼈다.',{pen:2},()=>jbIs('st1b','st2e')],
   ['새 과장이 오자 사무실 사람 절반이 바뀌었다.',{soc:1},()=>jbIs('st1b','st2e')&&R()<.4],
   ['계산대에서 코담배를 저울에 달아 팔았다.',{trade:1,money:10},()=>s.job==='st1t'],
   ['몽주의 화법기하학 강의를 받아 적었다.',{ksci:3},()=>s.job==='st2x'],
   ['측량을 나가 길의 경사와 물길을 재었다.',{ksci:2},()=>jbIs('st3i','st4')],
   ['부역(코르베)으로 끌려 나온 농민들을 부려 왕의 길을 닦았다.',{rpeople:-2},()=>jbIs('st3i','st4')&&T()<1787],
   ['새 다리의 아치 틀을 걷어 내는 날, 숨을 죽였다. 다리는 버티었다.',{fame:2,ksci:1},()=>jbIs('st3i','st4')&&R()<.4],
   ['알프스를 넘는 심플롱 길 공사 보고서를 읽었다.',{ksci:1,khist:1},()=>jbIs('st3i','st4')&&T()>=1801&&T()<1806],
   ['철도 노선 측량에 불려 나갔다.',{ksci:2,fame:1},()=>jbIs('st3i','st4')&&T()>=1835],
   ['밀린 세금 명단을 만들어 집행관에게 넘겼다.',{trade:2,rpeople:-1},()=>jbIs('st2r','st3n','st4d','st5')]]),
 C('job_bribe',()=>free()&&jbIs('st1g','st1d','st1f'),.7,4,'밀수꾼의 돈','la contrebande',()=>`밀수꾼이 은화 주머니를 내밀며 한 번만 눈감아 달라고 한다. ${s.job==='st1g'?'붙잡힌 소금 밀수꾼은 갤리선의 노를 젓게 된다.':'수레에는 영국 물건이 가득하다.'}`,[
   {l:'돈을 받는다',s:'',a:'greedy',f:async()=>{if(await chance(.15,'뇌물 발각','감시원 뇌물 적발 비율')){say('상관에게 들켰다.'+fx({sus:6,rguild:-4}));loseJob('% 자리에서 쫓겨났다.')}else say('주머니를 받아 넣고 다른 쪽을 보았다.'+fx({money:60,vhon:-2,rpeople:1}))}},
   {l:'붙잡아 넘긴다',s:'',a:'work safe',f:()=>say('밀수꾼을 묶어 넘겼다. 압수품의 몫이 나왔다. 그날 밤 집 앞에 돌이 날아왔다.'+fx({money:20,rguild:2,rpeople:-3,vord:2,cour:1}))},
   {l:'돈은 안 받고 그냥 보낸다',s:'',a:'pious',f:()=>say('가난한 사람이었다. 그냥 가라고 했다.'+fx({rpeople:2,vjus:1}))}]),
 C('job_refr',()=>free()&&jbIs('st1e','st2b')&&T()>=1799&&T()<1814.3,1,3,'징집 기피자','les réfractaires','징집을 피한 젊은이가 어머니 집 다락에 숨어 있다는 밀고가 들어왔다. 붙잡으면 상여금이 나온다. 마을 사람들이 그대를 지켜본다.',[
   {l:'붙잡는다',s:'',a:'work safe',f:()=>{frelAdd('bonapartist',2);say('다락에서 끌어내렸다. 어머니가 길바닥에 주저앉아 울었다.'+fx({money:30,rloc:-5,vord:2,vjus:-1}))}},
   {l:'몰래 알려 달아나게 한다',s:'들키면 쫓겨난다',a:'bold family',f:async()=>{if(await chance(.25,'상관에게 발각','헌병의 묵인이 드러난 비율')){say('반장이 눈치챘다.'+fx({sus:8}));loseJob('% 자리에서 쫓겨났다.')}else say('도착했을 때 다락은 비어 있었다.'+fx({rloc:4,vjus:2}))}}]),
 // ---------- 전문 장인 ----------
 S('job_shop',()=>free()&&jbIs('c2t','c3p','c2c','c3b','c3m','c3h','c3l','c2k','c3s','c3t','c2l'),1.5,0,[
   ['새벽 두 시에 화덕에 불을 넣고 반죽을 쳤다. 반죽꾼의 신음이 지하실에 울렸다.',{cook:2,str:1,hp:-1},()=>jbIs('c2c','c3b')],
   ['경찰이 빵 무게를 달아 보고 갔다. 모자라면 벌금이다.',{cook:1},()=>jbIs('c2c','c3b')],
   ['조판대 앞에 서서 납 활자를 한 자씩 골라 식자하였다.',{print:2,pen:1},()=>jbIs('c2t','c3p')],
   ['인쇄기 손잡이를 당겨 하루 이천 장을 찍었다.',{print:1,str:1},()=>s.job==='c2t'],
   ['출판 허가(프리빌레주)를 받으러 서적 감독관실에 다녀왔다.',{pen:1},()=>s.job==='c3p'&&T()<1789.5],
   ['출판 자유가 선포되자 인쇄기가 쉴 새 없이 돌았다. 팸플릿 주문이 줄을 섰다.',{money:150,print:1},()=>jbIs('c3p','c2t')&&T()>=1789.5&&T()<1792.7],
   ['자단과 마호가니 판을 붙여 서랍장을 짰다. 손님이 상감 무늬를 쓰다듬었다.',{wood:2,dex:1},()=>s.job==='c3m'],
   ['시계 톱니바퀴의 이를 줄로 깎으며 돋보기를 눈에 끼웠다.',{metal:2,dex:1},()=>s.job==='c3h'],
   ['자물쇠와 열쇠를 맞추고 대문 경첩을 달았다.',{metal:2},()=>s.job==='c3l'],
   ['직기 위에 몸을 웅크리고 하루 열다섯 시간 북을 던졌다.',{weave:2,hp:-1},()=>s.job==='c2k'],
   ['파리와 런던에서 온 주문서를 받아 무늬 도안을 정하였다.',{trade:2,weave:1},()=>s.job==='c3s'],
   ['자카르 직기를 들였다. 무늬 끈을 당기던 아이들이 필요 없어졌다.',{weave:2,trade:1},()=>jbIs('c3s','c2k')&&T()>=1806,1],
   ['손님의 몸 치수를 재고 외투를 재단하였다.',{sew:2},()=>s.job==='c3t'],
   ['신부의 혼수 속옷과 시트에 머리글자를 수놓았다.',{sew:2},()=>s.job==='c2l']]),
 C('job_press',()=>free()&&jbIs('c2t','c3p')&&(T()<1789.4||(T()>=1810.1&&T()<1814.3)),.7,5,'금서','livres défendus',()=>T()<1789.4?'스위스 출판사의 짐꾼이 상자를 들고 왔다. 국왕 검열을 거치지 않은 ‘철학 책’과 궁정 비방문이다. 몰래 찍어 팔면 큰돈이 되지만, 들키면 바스티유다.':'1810년 법령으로 인쇄소는 허가증(브르베)이 있어야 하고 파리에는 예순 곳만 남았다. 손님이 황제를 비꼬는 노래책을 몰래 찍어 달라고 한다.',[
   {l:'밤에 몰래 찍는다',s:'',a:'bold radical greedy',f:async()=>{if(await chance(.15,'경찰 수색','금서 인쇄 적발 비율')){s.cond='prison';s.prisonKind='plain';s.condSince=T();say(`경찰이 인쇄소를 덮쳤다. ${T()<1789.4?'바스티유':'감옥'}에 갇혔다.`+fx({sus:12,fame:2}),'big')}else say('새벽마다 마차가 책 꾸러미를 실어 갔다.'+fx({money:250,print:1,vlib:2,sus:2}))}},
   {l:'거절한다',s:'',a:'safe',f:()=>say('허가 없는 일은 받지 않는다고 했다.'+fx({vord:1}))}]),
 C('job_bread',()=>free()&&s.job==='c3b'&&econ().price>=1.3,1,2,'빵값','la taxe du pain',()=>`밀가루 값이 평년의 ${econ().price}배다. 경찰은 빵값을 정해 놓고(빵값 공정가) 그 값 이상 받지 못하게 한다. 문 앞에는 새벽부터 아낙들이 줄을 섰다.`,[
   {l:'공정가대로 판다',s:'손해를 본다',a:'safe pious',f:()=>say('손해를 보며 빵을 구웠다. 아낙들이 고맙다고 하였다.'+fx({money:-40,rpeople:3,rloc:2,vjus:1}))},
   {l:'빵을 조금 가볍게 굽는다',s:'',a:'greedy',f:async()=>{if(await chance(.3,'빵 무게 검사','빵 무게 위반 적발 비율')){say('경찰이 빵을 달아 보았다. 벌금을 물고 가게 앞에서 욕을 먹었다.'+fx({money:-60,rpeople:-5,sus:3}))}else say('아무도 눈치채지 못했다.'+fx({money:50,vhon:-1}))}}]),
 // ---------- 도시 품팔이·행상 ----------
 S('job_peuple',()=>free()&&onTrack('peuple'),1.5,0,[
   ['물통 두 개를 멜대에 지고 6층 다락까지 물을 날랐다. 한 통에 2수다.',{str:2,money:5},()=>s.job==='pe1w'],
   ['물 긷는 샘터에서 줄을 서다 다른 물장수와 멱살을 잡았다.',{str:1,hp:-1},()=>s.job==='pe1w'],
   ['오베르뉴 동향 사람들과 한방에서 지내며 번 돈을 고향에 부쳤다.',{rfam:3,money:-20},()=>s.job==='pe1w'&&s.region==='auvergne'],
   ['지게(크로셰)에 상자를 지고 부두에서 창고까지 날랐다.',{str:2},()=>s.job==='pe1c'],
   ['강가 빨래배에서 남의 빨래를 방망이로 두드렸다. 잿물에 손이 갈라졌다.',{str:1,hp:-1,money:4},()=>s.job==='pe1b'],
   ['사순절 중간 목요일(미카렘)에 빨래 여인들이 저마다 여왕을 뽑아 행진하였다.',{soc:2,rguild:2},()=>s.job==='pe1b'&&inParis()&&T()>=1830],
   ['물레 앞에 앉아 해 질 녘까지 실을 자았다. 상인이 실 한 타래에 몇 수를 쳐 주었다.',{dex:1,money:3},()=>s.job==='pe1f'],
   ['방적 공장의 실이 싸게 나와 물레 일감이 줄었다.',{money:-5},()=>s.job==='pe1f'&&T()>=1800&&R()<.4],
   ['광주리에 채소를 이고 골목마다 외치며 다녔다.',{trade:1,str:1},()=>s.job==='pe1r'&&!isM()],
   ['등짐에 달력과 파란 표지 이야기책(비블리오테크 블뢰)을 지고 마을을 돌았다.',{trade:1,str:1},()=>s.job==='pe1r'&&isM()],
   ['중앙시장(레 알)에서 커다란 밀가루 자루를 등에 지고 날랐다.',{str:2,rguild:1},()=>s.job==='pe2f'],
   ['생선 좌판에서 손님과 걸쭉한 욕설을 주고받았다. 시장 여인들의 말투는 연극에서도 흉내 낸다.',{trade:1,soc:1},()=>s.job==='pe2p'],
   ['왕자가 태어나자 시장 여인 대표로 꽃다발을 들고 궁에 축하하러 갔다.',{fame:2,relite:1},()=>s.job==='pe2p'&&T()<1789.5&&R()<.3,1],
   ['헌옷 보따리를 풀어 소매를 고치고 다시 팔았다.',{trade:1,sew:1},()=>s.job==='pe2v'],
   ['탁자마다 포도주를 따르며 손님들 이야기를 들었다.',{soc:1,trade:1},()=>jbIs('pe3a','pe3i')],
   ['관문 밖 선술집은 입시세가 붙지 않아 술이 싸다. 일요일마다 손님이 몰렸다.',{money:40},()=>s.job==='pe3a'&&inParis()],
   ['역마차 손님들이 묵어 갔다. 마구간과 방이 모두 찼다.',{money:50,trade:1},()=>s.job==='pe3i'],
   ['밤늦게 경찰 사람이 와서 투숙객 명부를 들여다보았다.',{sus:1},()=>s.job==='pe3i']]),
 C('job_tavern',()=>free()&&jbIs('pe3a','pe3i')&&((T()>=1789.4&&T()<1795.5)||(T()>=1816&&T()<1848.1)),.7,4,'뒷방의 모임','le cabaret',()=>`단골들이 뒷방에서 ${T()<1796?'구 총회 이야기를 하고 혁명가를 부른다':'베랑제의 노래를 부르며 정부를 비웃는다'}. 구석 자리의 낯선 손님이 귀를 기울이고 있다.`,[
   {l:'그냥 둔다',s:'',a:'radical social',f:()=>say('노래가 밤늦도록 이어졌다.'+fx({rpeople:3,money:20,sus:3,pol:2}))},
   {l:'정치 이야기는 그만하라고 한다',s:'',a:'safe',f:()=>say('단골 몇이 발길을 끊었다.'+fx({money:-10,rpeople:-2,vord:1}))},
   {l:'낯선 손님에게 이름들을 알려 준다',s:'',a:'greedy royal',f:()=>say('경찰 밀정이었다. 며칠 뒤 단골 하나가 잡혀갔다.'+fx({money:30,sus:-4,rpeople:-6,vjus:-3}))}]),
 // ---------- 학교 선생 ----------
 S('job_school',()=>free()&&s.job==='w0',1.5,0,[
   ['아이들에게 기도문과 교리문답을 외우게 하였다.',{faith:1},()=>jbCult()],
   ['읽기만 배우는 아이는 달마다 몇 수, 쓰기까지 배우면 더 받는다. 셈까지 가르치면 또 더 받는다.',{money:5}],
   ['본당 신부를 도와 미사에서 성가를 부르고 종을 쳤다.',{faith:1,music:1},()=>isM()&&jbCult()],
   ['추수철이라 교실이 텅 비었다. 아이들은 모두 들에 나갔다.',{money:-5},()=>!urban()],
   ['공화국 교과서와 『인권 선언』을 아이들에게 읽혔다.',{pol:2,kphil:1},()=>T()>=1793.8&&T()<1795.5],
   ['기조 법(1833)으로 코뮌마다 남자 초등학교를 두게 되었다. 시장이 교사 봉급 200프랑을 약속하였다.',{money:30,rloc:2},()=>T()>=1833.5&&isM(),1],
   ['초등학교 시학관이 와서 아이들의 받아쓰기를 살폈다.',{pen:1},()=>T()>=1835],
   ['석판에 분필로 글자를 써 보이며 아이들에게 따라 쓰게 하였다.',{pen:1}]])
);
// 시대가 바뀌어 사라지는 자리
const JOB_GONE={
  st1g:()=>{loseJob('3월, 소금세(가벨)가 폐지되어 % 자리를 잃었다.');say('마을 사람들은 소금 창고 문을 부수고 잔치를 벌였다.'+fx({rpeople:1}))},
  st1f:()=>{if(meets(POST.st1b)){takeJob('st1b','징세 청부 회사가 해산되자 새 관청으로 옮겨 ')}else loseJob('징세 청부 회사가 해산되어 % 자리를 잃었다.')},
  st1m:()=>takeJob('st1e','기마경찰대가 국가 헌병대로 바뀌어 '),
  st1t:()=>loseJob('담배 전매가 풀려 % 자리가 없어졌다.'),
  st5:()=>loseJob('옛 징세 기구가 해체되어 % 자리를 잃었다.'),
  ar3:()=>{if(!inParis()){loseJob('파리를 떠나 % 일을 그만두었다.');return}loseJob('9월, 국민극장 배우들이 왕당파로 몰려 체포되었다. % 일을 잃었다.');if(R()<.5){s.cond='prison';s.prisonKind='terror';s.condSince=T();say('마들로네트 감옥에 갇혔다.','big')}},
  ar3p:()=>loseJob('8월, 국민공회가 왕립 아카데미들을 폐지하였다. % 자리가 사라졌다.'),
  ar4:()=>loseJob('8월, 국민공회가 왕립 아카데미들을 폐지하였다. % 자리가 사라졌다.'),
  ar1m:()=>loseJob(jbCult()?'목소리가 변해 성가대 학교를 나왔다.':'성당 성가대 학교가 문을 닫았다.'),
  sv1n:()=>loseJob('젖이 말라 더는 % 일을 할 수 없었다.'),
  se1:()=>loseJob('항구를 떠나 % 일을 그만두었다.'),se2:()=>loseJob('항구를 떠나 % 일을 그만두었다.'),se3:()=>loseJob('항구를 떠나 % 일을 그만두었다.'),se4:()=>loseJob('항구를 떠나 % 일을 그만두었다.'),se5:()=>loseJob('항구를 떠나 % 일을 그만두었다.'),
  pe1f:()=>loseJob('방적 공장에 밀려 물레 일감이 끊겼다. % 일을 그만두었다.'),
  pe2f:()=>loseJob('파리를 떠나 % 일을 그만두었다.'),pe2p:()=>loseJob('파리를 떠나 % 일을 그만두었다.'),ar2s:()=>loseJob('파리를 떠나 % 일을 그만두었다.')};
// 이공과 학교 졸업: 2년 뒤 토목·포병·관청으로
EV.push({id:'job_x',c:()=>free()&&s.job==='st2x'&&s.year-s.jobSince>=2,w:30,cd:0,run:async()=>{
  const opts=[['st3i','토목 학교(에콜 데 퐁 에 쇼세)로 간다'],['a3','포병 장교로 임관한다'],['st1b','관청에 들어간다']].filter(([id])=>POST[id]&&meets(POST[id]));
  if(!opts.length){loseJob('이공과 학교를 마쳤다. % 시절이 끝났다.');return}
  const i=await Q('졸업 서열','classement de sortie','이공과 학교의 졸업 서열이 발표되었다. 서열이 높은 학생부터 토목·광산·포병·공병으로 갈 곳을 고른다.',opts.map(([id,l])=>({l,s:pname(POST[id]),a:id==='a3'?'bold':'work'})));
  takeJob(opts[i][0],'이공과 학교를 마치고 ');await done()}});
