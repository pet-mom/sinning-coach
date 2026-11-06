/* ================= 개편 13 =================
   1. 1789~1794년에 사건 창이 연달아 뜨면, 앞 창이 닫히고 4초 뒤에 다음 창이 뜬다(그 밖의 해에는 5초).
   2. 생활의 시설: 예전 일곱 곳 그대로 두고, 온천 요양만 체육관에서 떼어 ‘온천’으로 옮긴다.
   3. 신분에 어울리는 직업 열 갈래, 갈래마다 여섯 계단을 더한다.
      근거: William Doyle, Venality (1996) · Daniel Roche, La France des Lumières (1993) · Jean Meyer, La Noblesse bretonne (1966)
      · Louis Bergeron, Banquiers, négociants et manufacturiers parisiens (1978) · Steven Kaplan, Provisioning Paris (1984)
      · Clare Haru Crowston, Fabricating Women (2001) · Martin Nadaud, Mémoires de Léonard (1895). */

/* ---------- 1. 사건 창 간격 ---------- */
/* reform11.js의 rf11Gap에서 처리한다. */

/* ---------- 2. 시설: 예전 일곱 곳으로 되돌리고, 온천만 따로 둔다 ---------- */
RF2_FAC.splice(RF2_FAC.findIndex(x=>x[0]==='shop'),0,['spa','온천','les eaux']);
RF2_FK.spa='spa';

/* ---------- 3. 새 직업 열 갈래 ---------- */
const r13Court=()=>T()<1792.6||T()>=1804.4;
const r13Nob=()=>noble()||T()>=1789.5;
const r13CtN=()=>r13Court()&&noble();
const r13Bourse=()=>T()<1793.45||T()>=1795.6;
defineTrack('court','궁정',{key:['soc',50],p:.06,sk:{manner:3,conv:2,dance:1,main:'manner'}});
defineTrack('dipl','외교',{key:['edu',55],p:.06,sk:{conv:3,pen:2,khist:1,main:'conv'}});
defineTrack('navy','해군',{key:['cour',45],p:.06,sk:{arms:2,ksci:1,kastr:1,main:'arms'}});
defineTrack('fin','금융',{key:['edu',45],p:.06,sk:{trade:3,karith:2,main:'trade'}});
defineTrack('notary','공증',{key:['edu',50],p:.07,sk:{pen:3,klaw:2,karith:1,main:'pen'}});
defineTrack('pharm','약제',{key:['edu',45],p:.06,sk:{heal:1,kmed:2,ksci:2,trade:1,main:'heal'}});
defineTrack('build','건축 시공',{key:['str',40],p:.07,lit:false,sk:{labor:2,craft:2,keng:1,main:'craft'}});
defineTrack('mode','양장·모자',{key:['dex',40],p:.07,lit:false,sk:{sew:3,trade:1,manner:1,main:'sew'}});
defineTrack('post','역참·운송',{key:['str',35],p:.07,lit:false,sk:{ride:3,trade:1,main:'ride'}});
defineTrack('mill','제분·곡물',{key:['str',35],p:.07,lit:false,sk:{farm:1,labor:1,trade:2,main:'trade'}});
const J=defineJob;
// 궁정(귀족): 1792년 8월 왕정이 무너지면 사라지고, 1804년 제정과 함께 돌아온다
J('ct1','court',1,'궁정 시동','궁정 견습 시녀','page de la Grande Écurie',200,{sk:{manner:10}},r13CtN);
J('ct2','court',2,'궁정 근위 기사','궁정 시녀','garde du corps',900,{soc:35,sk:{manner:20}},r13CtN);
J('ct3','court',3,'궁정 시종','궁정 부인','gentilhomme de la Chambre',3000,{soc:45,sk:{manner:30}},r13CtN);
J('ct4','court',4,'궁정 의전관','의상 담당 부인','maître des cérémonies',6000,{soc:50,fame:20,sk:{manner:40}},r13CtN);
J('ct5','court',5,'궁정 대시종','왕실 아이들의 가정교사','premier gentilhomme de la Chambre',15000,{soc:55,fame:35},r13CtN);
J('ct6','court',6,'궁내 대신','궁정 시녀장','grand maître de la Maison',40000,{soc:65,fame:50},r13CtN);
// 외교(귀족, 1789년 이후 부르주아)
J('dp1','dipl',1,'대사관 수행원',null,'attaché d’ambassade',300,{edu:45,sk:{conv:15}},r13Nob);
J('dp2','dipl',2,'대사관 서기관',null,'secrétaire d’ambassade',1500,{edu:50,sk:{pen:25,conv:25}},r13Nob);
J('dp3','dipl',3,'대리 공사',null,'chargé d’affaires',4000,{edu:55,soc:40},r13Nob);
J('dp4','dipl',4,'전권 공사',null,'ministre plénipotentiaire',12000,{edu:58,soc:50,fame:25},r13Nob);
J('dp5','dipl',5,'대사',null,'ambassadeur',30000,{edu:60,soc:55,fame:40},r13Nob);
J('dp6','dipl',6,'외무 장관',null,'ministre des Relations extérieures',60000,{edu:65,soc:60,fame:55},r13Nob);
// 해군(귀족; 1789년 이후 누구나)
J('nv1','navy',1,'해군 사관후보생',null,'garde de la Marine',150,{str:30,kn:{karith:15}},r13Nob);
J('nv2','navy',2,'해군 소위',null,'enseigne de vaisseau',700,{cour:35,kn:{kastr:15}},r13Nob);
J('nv3','navy',3,'해군 대위',null,'lieutenant de vaisseau',1500,{cour:40,soc:25},r13Nob);
J('nv4','navy',4,'함장',null,'capitaine de vaisseau',4000,{cour:45,soc:35,fame:15},r13Nob);
J('nv5','navy',5,'해군 소장',null,'contre-amiral',9000,{cour:50,soc:40,fame:30},r13Nob);
J('nv6','navy',6,'해군 중장',null,'vice-amiral',18000,{cour:55,soc:45,fame:45},r13Nob);
// 금융(부르주아): 증권거래소는 1793년 6월부터 1795년 가을까지 닫혀 있었다
J('fn1','fin',1,'은행 사환',null,'garçon de banque',200,{kn:{karith:10}});
J('fn2','fin',2,'은행 서기',null,'commis de banque',600,{edu:35,kn:{karith:25}});
J('fn3','fin',3,'환어음 중개인',null,'courtier de change',2000,{edu:40,sk:{trade:25}});
J('fn4','fin',4,'증권 중개인',null,'agent de change',6000,{cost:3000,soc:40,sk:{trade:35}},r13Bourse);
J('fn5','fin',5,'은행가',null,'banquier',20000,{money:30000,soc:50,sk:{trade:45}});
J('fn6','fin',6,'프랑스 은행 이사',null,'régent de la Banque de France',40000,{money:100000,soc:55,fame:30},()=>T()>=1800.1);
// 공증(부르주아): 공증인 자리는 1791년까지 사고파는 관직이었다
J('nt_1','notary',1,'공증 사무소 사환',null,'petit clerc',80,{edu:25});
J('nt_2','notary',2,'공증 서기',null,'clerc de notaire',400,{edu:35,sk:{pen:20}});
J('nt_3','notary',3,'수석 서기',null,'maître clerc',1000,{edu:45,kn:{klaw:20}});
J('nt_4','notary',4,'공증인',null,'notaire',4000,{edu:50,cost:8000,kn:{klaw:30}});
J('nt_5','notary',5,'공증인회 이사',null,'membre de la chambre des notaires',7000,{edu:55,soc:40,fame:15});
J('nt_6','notary',6,'공증인회 회장',null,'président de la chambre des notaires',12000,{edu:58,soc:50,fame:25});
// 약제(부르주아·장인)
J('ph1','pharm',1,'약방 견습',null,'garçon apothicaire',60,{kn:{kread:20}});
J('ph2','pharm',2,'약제 직인',null,'compagnon apothicaire',350,{edu:35,kn:{kmed:10}});
J('ph3','pharm',3,'약제사',null,'maître apothicaire',1500,{edu:45,cost:1500,kn:{kmed:20,ksci:15}});
J('ph4','pharm',4,'약제사 조합 감독',null,'garde des apothicaires',3000,{edu:50,soc:35});
J('ph5','pharm',5,'군 병원 약제장',null,'pharmacien en chef des armées',6000,{edu:55,kn:{ksci:30}},()=>T()>=1792.3);
J('ph6','pharm',6,'파리 약학교 교장',null,'directeur de l’École de pharmacie',9000,{edu:62,fame:30,kn:{ksci:40}},()=>T()>=1803.2);
// 건축 시공(농민·장인): 리무쟁의 석공들은 봄마다 파리로 올라왔다
J('bd1','build',1,'석공 잡역부',null,'manœuvre maçon',120,{str:30});
J('bd2','build',2,'석공 직인',null,'compagnon maçon',320,{str:35,sk:{craft:15}});
J('bd3','build',3,'석재 다듬기 반장',null,'appareilleur',700,{dex:35,sk:{craft:25},kn:{keng:10}});
J('bd4','build',4,'석공 장인',null,'maître maçon',1500,{cost:400,soc:30,sk:{craft:35}});
J('bd5','build',5,'건설 청부업자',null,'entrepreneur de bâtiments',5000,{money:4000,soc:40,sk:{trade:25}});
J('bd6','build',6,'국가 건설 청부업자',null,'entrepreneur des bâtiments publics',15000,{money:15000,soc:50,fame:20});
// 양장·모자(여자): 1776년 양장상 조합이 생겼다
const r13F=()=>!isM();
J('md1','mode',1,'양장점 견습',  '양장점 견습 소녀','apprentie en modes',30,{},r13F);
J('md2','mode',2,'양장 직공','양장 직녀','ouvrière en modes',220,{dex:30,sk:{sew:20}},r13F);
J('md3','mode',3,'양장점 수석','양장점 수석 직녀','première',500,{dex:40,sk:{sew:30}},r13F);
J('md4','mode',4,'양장점 주인','양장점 여주인','marchande de modes',1500,{cost:600,soc:35,sk:{sew:35,trade:20}},r13F);
J('md5','mode',5,'상류층 단골 양장상','상류층 단골 양장상','marchande de modes en vogue',4000,{soc:45,fame:15,sk:{sew:45}},r13F);
J('md6','mode',6,'궁정 양장상','궁정 양장상','marchande de modes de la Cour',12000,{soc:50,fame:35,sk:{sew:55}},()=>r13F()&&r13Court());
// 역참·운송(농민·장인)
J('ps1','post',1,'마구간 소년',null,'garçon d’écurie',60,{});
J('ps2','post',2,'역참 기수',null,'postillon',200,{str:30,sk:{ride:15}});
J('ps3','post',3,'역마차 마부',null,'cocher de diligence',400,{str:35,sk:{ride:25}});
J('ps4','post',4,'역참장',null,'maître de poste',1500,{cost:1200,soc:30,sk:{ride:30,trade:15}});
J('ps5','post',5,'운송 회사 지점장',null,'directeur des messageries',3500,{soc:40,sk:{trade:30}});
J('ps6','post',6,'역마차 회사 사주',null,'entrepreneur des messageries',12000,{money:20000,soc:45,sk:{trade:40}},()=>T()<1790.5||T()>=1797.9);
// 제분·곡물(농민)
J('ml1','mill',1,'방앗간 일꾼',null,'garçon meunier',100,{str:30});
J('ml2','mill',2,'방앗간 직인',null,'compagnon meunier',260,{str:35,sk:{farm:10}});
J('ml3','mill',3,'방앗간 주인',null,'meunier',700,{cost:800,soc:25});
J('ml4','mill',4,'곡물상',null,'marchand de grains',1800,{soc:30,sk:{trade:25}});
J('ml5','mill',5,'곡물 도매상',null,'négociant en grains',5000,{money:5000,soc:40,sk:{trade:35}});
J('ml6','mill',6,'파리 식량 납품업자',null,'munitionnaire des vivres',15000,{money:20000,soc:50,fame:15},()=>T()<1793.3||T()>=1795.3);

// 승진 사다리
for(const [a,n] of [['ct',6],['dp',6],['nv',6],['fn',6],['ph',6],['bd',6],['md',6],['ps',6],['ml',6]])for(let i=1;i<n;i++)RF7_LINE[a+i]=[a+(i+1)];
for(let i=1;i<6;i++)RF7_LINE['nt_'+i]=['nt_'+(i+1)];
// 1792년 8월부터 1804년까지 궁정 자리는 없다
const R13_CTJ=new Set(['ct1','ct2','ct3','ct4','ct5','ct6','md6']);

// 신분마다 열리는 길(귀족은 관리직을 둘째 계단부터 시작한다)
RF_MINT.noble.state=2;
RF_TRK.noble.M.push('court','dipl','navy');RF_TRK.noble.F.push('court');
RF_TRK.bourgeois.M.push('fin','notary','pharm','dipl');RF_TRK.bourgeois.F.push('mode');
RF_TRK.artisan.M.push('build','pharm','post');RF_TRK.artisan.F.push('mode');
RF_TRK.peasant.M.push('build','post','mill');RF_TRK.peasant.F.push('mode');
Object.assign(RF_WHY,{
 court:{M:'궁정 시동으로 들어가 왕실의 예법을 익힌다. 출셋길은 국왕의 눈길 하나에 달렸다',F:'궁정의 견습 시녀가 된다. 왕비 곁의 자리는 집안의 이름으로 얻는다'},
 dipl:{M:'대사관 수행원으로 외국 궁정을 돈다. 프랑스어가 유럽 외교의 말이다',F:''},
 navy:{M:'브레스트나 툴롱에서 해군 사관후보생이 된다. 1789년까지는 귀족만 받았다',F:''},
 fin:{M:'은행 사환으로 어음을 나른다. 파리의 돈은 생토노레 거리와 증권거래소를 오간다',F:''},
 notary:{M:'공증 사무소 사환으로 들어가 계약서를 베낀다. 혼인과 상속은 모두 공증인의 손을 거친다',F:''},
 pharm:{M:'약방 견습이 되어 약초를 빻는다. 약제사 장인이 되려면 시험과 자릿값이 필요하다',F:''},
 build:{M:'석공 잡역부로 공사판에 선다. 리무쟁 사람들처럼 봄에 올라와 겨울에 돌아간다',F:''},
 mode:{M:'',F:'양장점 견습 소녀가 된다. 리본과 레이스, 모자 하나로 귀부인을 사로잡는 일이다'},
 post:{M:'역참 마구간에서 말을 돌본다. 기수, 마부, 역참장으로 오른다',F:''},
 mill:{M:'방앗간 일꾼으로 밀 포대를 진다. 곡물이 모자라는 해에는 방앗간 주인이 미움을 산다',F:''}});

// 연말: 궁정이 사라지면 자리를 잃는다
{const _rd13=rfDaily;rfDaily=async function(){await _rd13();if(!s||s.dead)return;try{
  const j=job();if(j&&R13_CTJ.has(j.id)&&!r13Court()){loseJob('8월 10일 튈르리궁이 무너지자 궁정도 사라졌다. %의 자리는 하루아침에 없어졌다.');fx({sus:6})}
  if(j&&j.id==='fn4'&&!r13Bourse()){loseJob('증권거래소가 문을 닫았다. %의 일은 이제 투기로 몰린다.')}
}catch(e){console.error(e)}}}
