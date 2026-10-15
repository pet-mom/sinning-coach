/* ================= 연표 =================
   H(연도, 달(1~12), 기록문, 개인 처리). 진행 구간 안에 든 사건을 차례로 처리한다. */
const HIST=[];
function H(y,m,text,fn){HIST.push({mi:y*12+m-1,text,fn,i:HIST.length})}
let histSorted=null;
async function runHistory(a,b){if(!histSorted)histSorted=HIST.slice().sort((x,y)=>x.mi-y.mi||x.i-y.i);
  for(const h of histSorted){if(h.mi<=a||h.mi>b)continue;
    const tx=typeof h.text==='function'?h.text():h.text;if(tx)L(tx,'hist');
    if(h.fn&&!s.dead){await h.fn();if(s.dead)return}}}
const adult=()=>!child()&&s.cond==='normal';
const maleAdult=(a=16,b=60)=>adult()&&isM()&&s.age>=a&&s.age<=b;
async function Q(title,fr,text,opts){sheetOpen(title,fr);shText(text,'q');return await shButtons(opts)}
// 날짜가 정해진 일화를 연표에서 직접 부른다(무작위 사건과 중복되지 않게)
async function fireStory(id){const e=EV.find(x=>x.id===id);if(!e||s.dead)return;s.cd=s.cd||{};if(s.cd[id]>s.year)return;let ok=false;try{ok=e.c()}catch(x){}if(!ok)return;s.cd[id]=s.year+(e.cd||99);await e.run()}

/* ---------- 루이 15세 ---------- */
H(1751,7,'디드로와 달랑베르의 『백과전서』 제1권이 나왔다.');
H(1754,7,'북아메리카 오하이오 강 유역에서 영국 식민지군과 프랑스군이 충돌하였다.');
H(1756,7,'영국과의 7년 전쟁이 시작되었다. 왕은 오스트리아와 손을 잡았다.',async()=>{});
for(const y of [1757,1758,1759,1760,1761,1762])H(y,4,null,async()=>{if(maleAdult(18,40)&&!noble()&&['peasant','artisan'].includes(s.estate))await conscript(.07,'민병대 추첨',{single:true,why:'미혼 남성 중 민병으로 뽑힌 비율',text:'7년 전쟁에 보낼 민병을 뽑는 추첨이 열렸다. 미혼 남자들이 모자 속 쪽지를 뽑는다.'})});
H(1758,1,'다미앵이 베르사유에서 왕을 칼로 찔렀다. 그는 그레브 광장에서 사지가 찢기는 형을 받았다.');
H(1758,1,'로스바흐에서 프로이센의 프리드리히 대왕이 프랑스군을 격파하였다.');
H(1759,10,'퀘벡이 영국군에게 함락되었다.');
H(1762,4,'볼테르가 툴루즈의 신교도 상인 장 칼라스의 억울한 처형을 고발하기 시작하였다.',async()=>{if(s.faithKind==='protestant'&&adult())say('위그노 마을 사람들이 칼라스 사건 소식에 숨을 죽였다.'+fx({pol:3}))});
H(1762,7,'루소의 『사회계약론』과 『에밀』이 출간되자마자 금서가 되었다.',async()=>{if(adult()&&lit()&&R()<.3)say('몰래 『사회계약론』을 구해 읽었다. “인간은 자유롭게 태어났으나 어디서나 사슬에 묶여 있다.”'+fx({edu:2,pol:5}))});
H(1763,4,'파리 조약으로 7년 전쟁이 끝났다. 프랑스는 캐나다와 인도 대부분을 잃었다.',async()=>{if(soldier()&&s.job==='a1'&&R()<.6)discharge('전쟁이 끝나 ')});
H(1764,10,'예수회가 왕국에서 해산되었다. 예수회 학교들은 다른 교단에 넘어갔다.');
H(1766,4,'로렌 공국이 프랑스에 병합되었다.');
H(1768,7,'제노바로부터 코르시카 섬을 사들였다.');
H(1769,7,'코르시카 아작시오에서 나폴레오네 부오나파르테라는 아이가 태어났다.');
H(1770,4,'왕세자 루이와 오스트리아 황녀 마리 앙투아네트가 베르사유에서 혼인하였다. 파리의 축하 불꽃놀이에서 압사 사고로 백여 명이 죽었다.',async()=>{if(inParis()&&adult()&&R()<.08)say('루이 15세 광장 불꽃놀이에서 군중에 휩쓸려 갈비뼈를 다쳤다.'+fx({hp:-8}))});
H(1770,10,'흉년이 들어 빵값이 크게 올랐다.');
H(1771,4,'대법관 모푸가 고등법원을 해산하고 법관들을 유배 보냈다.',async()=>{if(s.job==='l4'){say('고등법원 동료들과 함께 지방으로 유배되었다.'+fx({fame:4,pol:4}),'big')}});
H(1774,4,'루이 15세가 천연두로 죽었다. 스무 살의 루이 16세가 즉위하였다.',async()=>{if(adult())say(pick(['새 왕에게 기대를 거는 사람들이 많았다.','왕의 시신은 썩는 냄새 때문에 밤중에 서둘러 생드니로 옮겨졌다고 한다.']))});
H(1774,10,'재무총감 튀르고가 곡물 거래를 자유화하였다.');
H(1775,4,'밀가루 전쟁. 빵값이 오르자 파리 분지 곳곳에서 군중이 곡물 창고와 시장을 털었다.',async()=>{
  if(!adult()||!['paris','ile','picardie','champagne','normandie','bourgogne'].includes(loc())||noble()||rich())return;
  const i=await Q('밀가루 전쟁','guerre des farines','장터에 사람들이 모였다. 곡물상이 빵값을 올려 받는다며 자루를 끌어내 “정당한 값”에 팔자고 외친다.',[{l:'함께 곡물 자루를 끌어낸다',s:'군대가 진압에 나섰다',a:'bold radical'},{l:'멀찍이 지켜본다',s:'',a:'safe'}]);
  if(i===0){if(await chance(.04,'주동자로 체포','진압 후 체포·처벌된 비율')){say('주동자로 붙잡혔다. 파리에서는 두 사람이 본보기로 교수형을 당했다.','big');if(await chance(.15,'교수형','붙잡힌 이들 중 처형된 비율')){die('executed','밀가루 전쟁의 주동자로 교수형을 당했다.');await done();return}s.cond='prison';s.prisonKind='plain';s.condSince=T()}
    else say('정당한 값에 밀가루 한 자루를 샀다.'+fx({money:20,pol:4,cour:2}))}
  else say('멀찍이 서서 지켜보았다.');await done()});
H(1776,7,'튀르고가 실각하였다. 길드 폐지와 부역 폐지는 없던 일이 되었다.');
H(1776,7,'아메리카 13개 식민지가 영국으로부터 독립을 선언하였다.');
H(1778,4,'프랑스가 아메리카와 동맹을 맺고 영국과 전쟁에 들어갔다. 볼테르와 루소가 같은 해에 죽었다.',async()=>{
  if(soldier()&&R()<.35){say('라파예트를 따라 아메리카로 건너가는 부대에 편성되었다.'+fx({pol:6,fame:2}),'big');s.flags.america=true}});
H(1781,7,'세귀르 법령. 4대에 걸친 귀족 혈통이 아니면 장교가 될 수 없게 되었다. 재무총감 네케르가 왕실 재정 보고서를 펴냈다.');
H(1781,10,'요크타운에서 영국군이 항복하였다.',async()=>{if(s.flags.america&&soldier())say('요크타운의 승리를 직접 보았다.'+fx({fame:4,pol:4}),'big')});
H(1783,10,'몽골피에 형제의 열기구가 베르사유 하늘에 떠올랐다. 양과 오리와 수탉을 태웠다.');
H(1784,1,'아이슬란드 라키 화산 폭발 뒤로 유난히 혹독한 겨울이 찾아왔다.',async()=>{if(adult()&&!rich()&&R()<.3)say('혹한에 장작이 떨어져 손발이 얼었다.'+fx({hp:-4}))});
H(1784,4,'보마르셰의 『피가로의 결혼』이 공연되었다. 귀족을 조롱하는 대사에 귀족들이 박수를 쳤다.',async()=>{if(inParis()&&adult()&&(rich()||lit())&&R()<.4)say('코메디프랑세즈에서 『피가로의 결혼』을 보았다.'+fx({pol:3,soc:1}))});
H(1785,7,'목걸이 사건. 왕비의 이름을 사칭한 사기극이 터지며 왕실의 위신이 땅에 떨어졌다.',async()=>{if(adult())fx({pol:2})});
H(1786,10,'영국과 통상조약을 맺었다. 값싼 영국 면직물이 밀려들었다.',async()=>{if(adult()&&onTrack('craft')&&['rouen','lyon','normandie','picardie'].includes(loc())){say('영국산 직물에 밀려 일감이 줄었다.'+fx({money:-Math.round(s.money*.1)}))}});
H(1787,4,'왕이 명사회를 소집하였으나 귀족과 성직자는 세금을 내라는 재무총감 칼론의 안을 거부하였다.');
H(1787,10,'관용 칙령. 신교도의 혼인과 출생이 처음으로 법적으로 인정되었다.',async()=>{if(s.faithKind==='protestant'&&adult())say('백 년 만에 신교도도 법적으로 혼인하고 아이의 출생을 신고할 수 있게 되었다.'+fx({pol:5}),'big')});
H(1788,7,'7월 13일, 거대한 우박 폭풍이 파리 분지의 밀밭을 쓸어버렸다. 그르노블에서는 ‘기왓장의 날’ 봉기가 일어났다.',async()=>{if(adult()&&onTrack('farm')&&!['provence','languedoc','gascogne'].includes(loc()))say('우박에 한 해 농사를 망쳤다.'+fx({money:-Math.round(s.money*.3),hp:-2}))});
H(1788,10,'왕이 1614년 이후 처음으로 삼부회 소집을 약속하였다. 네케르가 다시 불려 왔다.');
H(1789,1,'세기에 드문 혹한. 센 강이 얼어붙고 빵값은 계속 올랐다. 시에예스가 『제3신분이란 무엇인가』를 펴냈다.',async()=>{if(adult()&&lit()&&!noble()&&R()<.5)say('시에예스의 팸플릿을 읽었다. “제3신분이란 무엇인가? 모든 것이다.”'+fx({pol:5,edu:1}))});

/* ---------- 1789: 혁명 (여기부터 한 달 단위) ---------- */
H(1789,3,'3월, 전국에서 삼부회 선거가 시작되었다. 교구와 길드마다 왕에게 올릴 진정서(카이에 드 돌레앙스)를 쓴다.',async()=>{
  if(!adult()||s.age<20)return;
  const i=await Q('진정서','cahier de doléances',`${noble()?'귀족 신분회':priest()?'성직자 신분회':'교구 회의'}가 열려 왕에게 올릴 진정서를 쓴다.`,[{l:'회의에 나가 목소리를 낸다',s:'처세·학식 판정. 대표로 뽑힐 수도 있다',a:'social radical'},{l:'이름만 올린다',s:'',a:'safe'}]);
  if(i===1){say('진정서에 이름만 올렸다.');await done();return}
  const ok=lit()&&s.st.edu>=45&&s.fame>=25&&isM();
  const {m,why}=md([[s.st.soc>=50,1,'처세'],[s.fame>=45,1,'명성'],[onTrack('law'),1,'법률가'],[trait('야심'),1,'야심'],[!lit(),-2,'문맹']]);
  const r=await roll(m,{label:'회의',why});
  if(r.v>=4)say(pick(['소금세와 십일조를 없애 달라는 조항을 넣자고 했다.','영주의 비둘기와 토끼가 밭을 망친다는 조항을 넣었다.','신분에 상관없이 세금을 고르게 내자는 조항을 넣었다.','왕의 권위를 지키되 헌법을 세우자고 주장하였다.'])+fx({fame:3,pol:4}));
  else say('발언 기회를 얻지 못했다.');
  if(ok&&r.v>=5){const p=(s.fame>=55?.35:.15)*(onTrack('law')||noble()||priest()?1.4:1);
    if(await chance(p,'삼부회 대표 선출','바야주 선거인단에서 대표로 뽑힐 확률')){s.flags.wasDeputy=true;s.flags.constituent=true;s.loc='paris';if(s.job)s.prevJob=s.job;takeJob('p3',`${noble()?'귀족':priest()?'성직자':'제3신분'} 대표로 뽑혀 삼부회 `);fx({fame:10})}}
  await done()});
H(1789,4,'4월 27~28일, 파리 생탕투안 문밖에서 레베용 벽지공장 폭동이 일어났다. 군대의 발포로 수십에서 수백 명이 죽었다.',async()=>{
  if(!adult()||!inParis()||s.estate!=='artisan'||R()>.5)return;
  const i=await Q('레베용 폭동','émeute Réveillon','벽지공장 주인 레베용이 “노동자는 하루 15수로도 살 수 있다”고 말했다는 소문이 돌았다. 생탕투안 문밖이 들끓는다.',[{l:'군중과 함께 공장으로 간다',s:'군대가 발포할 것이다',a:'bold radical'},{l:'집에 머문다',s:'',a:'safe'}]);
  if(i===0){if(await chance(.08,'발포','군대의 발포로 죽은 폭도의 비율(추정 수십~수백 명)')){die('riot','레베용 폭동에서 군대의 총탄에 쓰러졌다.');await done();return}say('군대가 발포하기 직전 골목으로 빠져나왔다.'+fx({pol:6,cour:3}))}else say('문을 걸어 잠갔다.');await done()});
H(1789,5,'5월 5일, 베르사유 므뉘플레지르 홀에서 삼부회가 개회하였다. 신분별 투표냐 머릿수 투표냐를 놓고 제3신분과 특권 신분이 맞섰다.',async()=>{
  if(s.flags.constituent&&deputy()){const i=await Q('투표 방식','vote par tête','제3신분은 세 신분이 한 회의장에서 머릿수로 투표하자고 한다. 귀족과 고위 성직자는 신분별 투표를 고집한다.',[{l:'머릿수 투표를 주장한다',s:'',a:'radical'},{l:'신분별 투표를 지킨다',s:'',a:'royal'}]);
    setStance('vote',i===0?2:0,true);await done()}});
H(1789,6,'6월 17일, 제3신분 대표들이 스스로 ‘국민의회’를 선포하였다. 6월 20일, 회의장 문이 닫히자 실내 정구장에서 헌법을 만들 때까지 흩어지지 않겠다고 서약하였다.',async()=>{
  if(!s.flags.constituent||!deputy())return;
  const i=await Q('테니스코트의 서약','serment du Jeu de paume','회의장 문이 닫혀 있다. 대표들이 근처 실내 정구장으로 몰려가 바이이의 선창에 따라 서약한다.',[{l:'손을 들고 서약한다',s:'',a:'radical bold'},{l:'서명을 거부한다',s:'단 한 사람만이 거부했다',a:'royal'}]);
  if(i===0)say('“헌법이 세워질 때까지 결코 흩어지지 않는다!” 다비드가 이 장면을 그렸다.'+fx({pol:10,fame:6,cour:3}),'big');else say('홀로 반대표를 던졌다. 마르탱 도슈처럼.'+fx({pol:-10,fame:3,sus:10}));await done()});
H(1789,7,'7월 11일, 왕이 재무총감 네케르를 파면하였다. 파리가 술렁인다.',async()=>{await fireStory('desmoulins')});
H(1789,7,'7월 14일, 파리 민중이 앵발리드에서 총을 빼앗고 바스티유 요새를 함락하였다. 수비대장 로네의 머리가 창끝에 꽂혀 거리를 돌았다.',async()=>{
  if(!adult()||!inParis()||deputy())return;
  if(noble()||rich()){say('거리에서 들려오는 총성과 경종 소리에 덧문을 닫아걸었다.'+fx({pol:-3}));return}
  if(!isM()){say('생탕투안 거리에서 바스티유 쪽으로 몰려가는 사람들을 보았다.'+fx({pol:3}));return}
  const i=await Q('바스티유','14 juillet','경종이 울린다. 앵발리드에서 총을 챙긴 군중이 생탕투안 거리의 요새로 몰려간다.',[{l:'총을 들고 함께 간다',s:'공격자 약 900명 중 98명이 죽었다',a:'bold radical'},{l:'국민방위대로 질서를 지킨다',s:'',a:'safe social'},{l:'집에 머문다',s:'',a:'safe'}]);
  if(i===0){if(await chance(.1,'요새의 총격','공격자 가운데 전사자 비율')){die('riot','바스티유 공격 중 수비대의 총탄에 쓰러졌다.');await done();return}
    s.flags.bastille=true;say('도개교가 내려오고 요새가 함락되었다. ‘바스티유의 정복자’ 명단에 이름이 올랐다.'+fx({fame:12,pol:12,cour:5}),'big')}
  else if(i===1){s.flags.garde=true;say('국민방위대의 삼색 모표를 달고 거리를 순찰하였다.'+fx({pol:5,soc:2}))}else say('바스티유가 떨어졌다는 소식을 저녁에 들었다.');await done()});
H(1789,7,'7월 17일, 왕이 파리 시청에 와서 삼색 모표를 받았다. 아르투아 백작 등 왕족과 대귀족들이 첫 망명길에 올랐다.');
H(1789,8,'7월 말부터 8월 초까지 대공포. 귀족들이 도적을 풀어 곡식을 망친다는 소문에 농민들이 무장하고 영주의 성관을 습격하였다.',async()=>{
  if(!adult()||urban())return;
  if(noble()&&s.land>0){const i=await Q('대공포','Grande Peur','마을 사람들이 낫과 쇠스랑을 들고 성관으로 몰려온다. 영주권 문서를 내놓으라고 한다.',[{l:'문서를 내주고 달랜다',s:'처세 판정',a:'safe'},{l:'하인들을 무장시켜 막는다',s:'담력 판정',a:'bold royal'},{l:'몸만 빠져나와 도시로 피한다',s:'',a:'safe'}]);
    if(i===0){const r=await roll(s.st.soc>=50?1:0,{label:'협상'});if(r.v>=3)say('문서들이 마당에서 불탔다. 성관은 무사했다.'+fx({money:-Math.round(s.money*.05)}));else{say('성관에 불이 붙었다.'+fx({money:-Math.round(s.money*.3)}));s.land=Math.round(s.land*.7)}}
    else if(i===1){const r=await roll(s.st.cour>=55?0:-1,{label:'방어'});if(r.v<=1&&await chance(.25,'습격','성관 방어 중 영주가 죽을 확률')){die('murdered','성관을 지키다 농민들에게 맞아 죽었다.');await done();return}
      if(r.v>=4)say('군중이 물러갔다. 그러나 원한은 남았다.'+fx({sus:15,pol:-6}));else{say('성관이 불탔다.'+fx({sus:10,money:-Math.round(s.money*.35)}));s.land=Math.round(s.land*.6)}}
    else{say('밤중에 마차를 타고 도시로 달아났다. 빈 성관이 약탈당했다.'+fx({money:-Math.round(s.money*.2)}));s.land=Math.round(s.land*.8)}
    await done();return}
  if(s.estate==='peasant'||onTrack('farm')){const i=await Q('대공포','Grande Peur','도적 떼가 온다는 소문에 경종이 울린다. 도적은 오지 않았고, 사람들은 영주의 성관으로 향한다.',[{l:'성관으로 가서 영주권 문서를 불태운다',s:'',a:'bold radical'},{l:'마을 자경단으로 남는다',s:'',a:'safe social'}]);
    if(i===0){if(await chance(.03,'기마경찰대의 진압','습격 가담자가 처벌된 비율')){say('기마경찰대에 붙잡혀 감옥에 갇혔다.','big');s.cond='prison';s.prisonKind='plain';s.condSince=T()}else say('공납 장부가 불길 속에서 타올랐다.'+fx({pol:8,cour:3}))}
    else say('밤새 마을 어귀를 지켰다.'+fx({soc:2}));await done()}});
H(1789,8,'8월 4일 밤, 국민의회가 봉건적 특권 폐지를 결의하였다. 8월 26일 「인간과 시민의 권리 선언」이 채택되었다. “인간은 자유롭고 권리에서 평등하게 태어나 존재한다.”',async()=>{
  if(adult()&&noble()&&s.dues){const d=Math.round(s.dues*.5);s.dues-=d;say(`영주 공납의 상당 부분이 사라졌다. (공납 수입 -${fmt(d)})`)}
  if(adult()&&s.estate==='peasant')say('부역과 영주재판권이 사라졌다. 남은 공납은 돈을 내고 사들여야 한다고 한다.'+fx({pol:4}));
  if(s.flags.constituent&&deputy()){const i=await Q('8월 4일 밤','nuit du 4 août','노아유 자작이 귀족의 특권을 포기하자고 외치자, 대표들이 앞다투어 일어나 자기 신분과 도시의 특권을 내놓는다.',[{l:'일어나 특권 포기를 외친다',s:'',a:'radical'},{l:'자리를 지키며 신중론을 편다',s:'',a:'safe royal'}]);
    if(i===0){say('새벽 두 시까지 이어진 열광 속에서 박수를 받았다.'+fx({pol:8,fame:4}));setStance('prop',1,true)}else{say('신중론은 환호성에 묻혔다.'+fx({pol:-4}));setStance('prop',0,true)}await done()}});
H(1789,9,'9월, 국민의회가 왕에게 법률을 미룰 수 있는 ‘유예적 거부권’만 주기로 하였다. 양원제를 주장한 무니에 등 군주제파가 패하였다. 마라가 『인민의 벗』을 펴내기 시작하였다.',async()=>{
  if(s.flags.constituent&&deputy()){const i=await Q('거부권 논쟁','veto royal','왕에게 어떤 거부권을 줄 것인가. 좌석의 오른쪽에는 절대 거부권 지지자들이, 왼쪽에는 반대자들이 모여 앉는다. ‘좌파’와 ‘우파’라는 말이 여기서 생겼다.',[{l:'절대 거부권 (오른쪽에 앉는다)',s:'',a:'royal'},{l:'유예적 거부권',s:'',a:'safe'},{l:'거부권 반대 (왼쪽에 앉는다)',s:'',a:'radical'}]);
    setStance('crown',i===0?0:i===1?1:1,true);fx({pol:i===0?-8:i===2?8:0});await done()}
  await fireStory('bastille7');await fireStory('dons')});
H(1789,10,'10월 5~6일, 파리 시장의 여인들이 빵을 달라며 베르사유로 행진하였다. 왕 일가는 파리 튈르리 궁으로 끌려왔고, 의회도 파리로 옮겼다.',async()=>{
  if(!adult()||!inParis()||noble()||rich())return;
  if(!isM()){const i=await Q('베르사유 행진','marche des femmes','중앙시장 여인들이 북을 치며 시청 앞에 모였다. 빵을 달라, 베르사유로 가자!',[{l:'함께 비를 맞으며 베르사유까지 걷는다',s:'',a:'bold radical'},{l:'아이들 곁에 남는다',s:'',a:'safe family'}]);
    if(i===0){s.flags.marche=true;say('여섯 시간을 걸어 베르사유에 닿았다. 이튿날, “빵집 주인과 그 마누라와 꼬마 견습공”을 데리고 파리로 돌아왔다.'+fx({pol:10,cour:5,fame:4}),'big')}else say('밤새 소식을 기다렸다.');await done()}
  else say('여인들의 행렬이 베르사유로 떠나는 것을 보았다.')});
H(1789,11,'11월 2일, 교회 재산이 국가에 귀속되었다. 생토노레 거리의 자코뱅 수도원에서 ‘헌우회’(자코뱅 클럽)가 모이기 시작하였다.',async()=>{
  if(priest()&&s.job!=='r1')say('교회 재산이 국유화되었다. 이제 성직자도 국가에서 봉급을 받는다.'+fx({faith:2,pol:-3}));
  await partyInvite('jacobin')});
H(1789,12,'12월, 교회 재산을 담보로 한 아시냐 발행이 결정되었다. 시정부를 주민 선거로 뽑는 법이 만들어졌다. 세금을 사흘치 품삯 이상 내는 ‘능동시민’만 투표할 수 있다.');

/* ---------- 1790 ---------- */
H(1790,2,'1~2월, 전국에서 첫 시정부 선거가 치러졌다. 2월 13일, 수도 서원이 금지되었다.',async()=>{
  await municipal();
  if(!nun()&&!(priest()&&R()<.2))return;
  const i=await Q('수도원의 문','vœux monastiques','법은 이제 종신서원을 인정하지 않는다. 원하는 이는 수도원을 떠나 연금을 받을 수 있다.',[{l:'수도원에 남는다',s:'',a:'pious'},{l:'세상으로 나간다',s:'',a:'radical'}]);
  if(i===1){s.flags.exNun=!isM();loseJob('%의 자리를 떠나 속세로 나왔다.');s.faith-=10;s.money+=300}else say('봉쇄의 담장 안에 남았다.'+fx({faith:4}));await done()});
H(1790,3,'3월, 왕국이 83개 도(데파르트망)로 새로 나뉘었다. 부역은 무상으로 사라지고, 지대는 돈을 내고 사들여야 한다는 법령이 나왔다.');
H(1790,4,'4월, 당통과 마라가 드나드는 코르들리에 클럽이 문을 열었다. 회비가 싸서 장인과 소상인도 들어갈 수 있다.',async()=>{await partyInvite('cordelier')});
H(1790,5,'5월, 국유재산 경매가 시작되었다. 옛 수도원의 밭과 건물이 촛불 경매에 붙여졌다.');
H(1790,6,'6월 19일, 세습 귀족제와 작위가 폐지되었다.',async()=>{if(adult()&&noble())say('문장과 작위가 법으로 사라졌다. 이름 앞의 ‘드(de)’도 쓸 수 없다.'+fx({pol:-5,fame:-3}),'big')});
H(1790,7,'7월 12일, 성직자 시민헌법. 주교와 신부는 주민 선거로 뽑고 국가가 봉급을 준다.',async()=>{if(priest()){const i=await Q('성직자 시민헌법','Constitution civile du clergé','동료 사제들이 갈린다. 국가가 교회를 다스리는가, 교회를 바로 세우는가.',[{l:'교회 개혁이라며 지지한다',s:'',a:'radical'},{l:'교황의 권위를 침해한다며 반대한다',s:'',a:'pious royal'}]);setStance('church',i===0?1:0,true);await done()}});
H(1790,7,'7월 14일, 샹드마르스에서 전국 연맹제가 열렸다. 30만 명이 비를 맞으며 “국민, 법, 왕”에게 충성을 맹세하였다. 오툉 주교 탈레랑이 미사를 집전하고 라파예트가 맹세를 선창하였다.',async()=>{
  if(adult()&&(inParis()||s.flags.garde)&&R()<.7){meet('라파예트');say('샹드마르스의 연맹제에 참가하였다.'+fx({pol:4,soc:1}))}});
H(1790,8,'8월, 낭시 주둔 연대의 병사 반란이 부예 장군에게 진압되었다. 반란병 한 명이 수레바퀴형, 스물두 명이 교수형을 받았다.',async()=>{if(soldier()&&job().t<=2)say('낭시 사건 소식에 병영이 술렁였다.'+fx({pol:3}))});
H(1790,9,'9월, 네케르가 사임하고 스위스로 떠났다. 아무도 그를 붙잡지 않았다.');
H(1790,11,'11월 27일, 모든 성직자에게 헌법 충성 선서가 요구되었다. 기한은 1791년 1월.',async()=>{
  if(!priest())return;
  const i=await Q('선서','serment constitutionnel','교구민들 앞 주일 미사에서 헌법에 충성 선서를 해야 한다. 교황은 아직 침묵하고 있다. 동료 사제들의 절반가량이 선서할 것이다.',[{l:'선서한다 (선서 사제)',s:'성직을 지킨다. 교구민 일부가 등을 돌린다',a:'radical safe'},{l:'거부한다 (선서 거부 사제)',s:'자리를 잃고 혐의를 산다',a:'pious royal'}]);
  if(i===0){s.flags.juror=true;setStance('church',1,false);say('강론대에서 선서하였다.'+fx({pol:10,faith:-6}),'big');if(west())say('미사에 오는 이가 절반으로 줄었다. 마을 사람들은 숲 속에서 선서 거부 사제의 미사를 드린다.'+fx({fame:-4}))}
  else{s.flags.refractory=true;setStance('church',0,false);loseJob('선서를 거부하여 % 자리에서 쫓겨났다.');fx({faith:8,pol:-12,sus:25,fame:4})}
  await done()});

/* ---------- 1791 ---------- */
H(1791,3,'3월 2·17일, 알라르드 법으로 길드가 폐지되었다. 누구나 영업세만 내면 장사를 할 수 있다. 3~4월, 교황 비오 6세가 성직자 시민헌법을 단죄하였다.',async()=>{
  if(adult()&&s.job==='c2'&&s.money>=300)say('길드 가입비 없이도 장인으로 독립할 수 있게 되었다.')});
H(1791,4,'4월 2일, 혁명의 웅변가 미라보가 죽었다.',async()=>{await fireStory('mirabeau')});
H(1791,6,'6월 14일, 르 샤플리에 법이 노동자의 단결과 파업을 금지하였다.',async()=>{if(adult()&&onTrack('craft')&&job().t<=2)fx({pol:2})});
H(1791,6,'6월 20~21일, 왕 일가가 하인으로 변장하고 달아나다 바렌에서 붙잡혔다. 지폐에 그려진 왕의 얼굴을 알아본 역참장 드루에가 길을 막았다.',async()=>{
  if(adult())fx({pol:s.pol>=-10?4:-2});
  if(noble()&&soldier()&&job().t>=3){const i=await Q('국경 너머','émigration des officiers','바렌 사건 이후 동료 귀족 장교들이 하나둘 연대를 버리고 국경을 넘는다. 코블렌츠의 왕제들이 귀족의 명예를 지키라고 부른다.',[{l:'망명한다',s:'',a:'royal'},{l:'연대에 남는다',s:'',a:'safe'}]);
    if(i===0)await emigrate('코블렌츠');else say('연대에 남았다. 사병들의 눈빛이 예전 같지 않다.'+fx({sus:5,pol:4}));await done()}});
H(1791,7,'7월 16일, 왕의 폐위 문제로 자코뱅 클럽이 갈라졌다. 라파예트와 바르나브 등 온건파가 푀양 수도원으로 나가 ‘푀양 클럽’을 세웠다.',async()=>{await partySplit()});
H(1791,7,'7월 17일, 샹드마르스에서 왕의 폐위를 청원하던 군중에게 라파예트의 국민방위대가 발포하였다.',async()=>{
  if(adult()&&inParis()&&s.pol>=25&&!noble()&&isM()){const i=await Q('샹드마르스','fusillade du Champ-de-Mars','코르들리에 클럽이 조국의 제단 위에 왕의 폐위 청원서를 펼쳤다. 서명하러 간다.',[{l:'샹드마르스로 가 서명한다',s:'',a:'radical bold'},{l:'가지 않는다',s:'',a:'safe'}]);
    if(i===0){if(await chance(.01,'국민방위대의 발포','청원 군중 가운데 사망자 비율(약 50명)')){die('shot','샹드마르스에서 국민방위대의 일제 사격에 쓰러졌다.');await done();return}setStance('crown',2,false);say('라파예트의 국민방위대가 발포했다. 피 묻은 청원서를 두고 달아났다.'+fx({pol:8,sus:5}))}else say('저녁에 총성이 들렸다.');await done()}});
H(1791,7,'7월 11일, 볼테르의 유해가 판테옹으로 옮겨졌다.',async()=>{await fireStory('voltaire2')});
H(1791,8,'8월 22일 밤, 생도맹그(아이티)에서 노예 반란이 일어났다. 8월 27일, 오스트리아와 프로이센이 필니츠 선언으로 프랑스 왕을 돕겠다고 하였다.',async()=>{if(adult()&&['bordeaux','nantes','marseille'].includes(loc())&&onTrack('craft')&&job().t>=4){say('생도맹그 설탕 무역이 끊겨 큰 손해를 보았다.'+fx({money:-Math.round(s.money*.3)}),'big')}});
H(1791,9,'9월, 헌법이 완성되고 왕이 서명하였다. 입법의회 선거가 치러졌다. 제헌의원은 다시 출마할 수 없다. 9월 27일, 유대인이 시민권을 얻었다.',async()=>{
  if(s.faithKind==='jewish'&&adult())say('유대인도 시민이 되었다. 알자스의 유대인 공동체에 환호와 두려움이 섞였다.'+fx({pol:6}),'big');
  if(s.flags.constituent&&deputy()){loseJob('제헌의회가 해산되어 % 임기를 마쳤다.');s.loc=null;if(s.prevJob&&meets(POST[s.prevJob]))takeJob(s.prevJob,'고향으로 돌아가 ');return}
  if(adult()&&isM()&&s.age>=25&&!deputy()&&s.fame>=40&&lit()&&s.pol>=-15)await election('입법의회 선거',.12)});
H(1791,10,'10월 1일, 입법의회가 열렸다. 브리소를 따르는 지롱드 출신 의원들이 왕과 망명자들을 향한 전쟁을 부르짖는다.',async()=>{await partyInvite('girondin')});
H(1791,11,'11월, 망명자와 선서 거부 사제를 처벌하는 법령에 왕이 거부권을 행사하였다. 사람들은 왕비를 ‘오스트리아 여자’, 왕을 ‘거부권 씨’라 불렀다.');

/* ---------- 1792 ---------- */
H(1792,2,'1~2월, 생도맹그 반란으로 설탕값이 치솟자 파리 여인들이 식료품 가게를 털었다.',async()=>{if(adult()&&inParis()&&onTrack('craft')&&job().t>=4&&R()<.3)say('가게가 털려 설탕 자루를 빼앗겼다.'+fx({money:-Math.round(s.money*.05)}))});
H(1792,3,'3월, 지롱드파 내각(롤랑, 뒤무리에, 클라비에르)이 들어섰다.');
H(1792,4,'4월 20일, 프랑스가 오스트리아 왕에게 선전포고하였다. 로베스피에르는 “무장한 선교사를 좋아하는 사람은 없다”며 반대했다. 4월 25일, 단두대가 처음으로 쓰였다.',async()=>{
  if(adult()&&s.age>=18&&politic()){const i=await Q('전쟁인가 평화인가','la guerre','브리소는 전쟁이 배신자를 가려내고 자유를 퍼뜨릴 것이라 한다. 로베스피에르는 적은 코블렌츠가 아니라 파리 안에 있다고 한다.',[{l:'혁명을 유럽에 퍼뜨리자 (브리소)',s:'',a:'radical bold'},{l:'방어전이면 족하다',s:'',a:'safe'},{l:'전쟁은 독재를 부른다 (로베스피에르)',s:'',a:'radical'}]);
    setStance('war',i===0?2:i===1?1:0,true);await done()}
  await fireStory('guillotine1');await fireStory('marseillaise')});
H(1792,6,'6월 20일, 군중이 튈르리 궁에 난입해 왕에게 붉은 프리지아 모자를 씌우고 국민의 건강을 위해 건배하게 하였다.');
H(1792,7,'7월 11일, 의회가 “조국이 위기에 처했다”고 선포하였다. 마르세유 연맹병들이 새 군가를 부르며 파리로 들어왔다. 7월 25일 브라운슈바이크 공작이 왕을 해치면 파리를 쑥대밭으로 만들겠다고 선언하였다.',async()=>{
  if(!maleAdult(18,40)||noble()||priest())return;
  const i=await Q('조국이 위기에','la patrie en danger','광장에 연단이 섰다. 의용병 명부에 이름을 적는 젊은이들 사이로 「라 마르세예즈」가 울린다.',[{l:'의용병으로 지원한다',s:'',a:'bold radical'},{l:'집과 가족을 지킨다',s:'',a:'safe family'}]);
  if(i===0){await enlist('의용병으로 ');fx({pol:8,fame:3})}else say('지원하지 않았다.');await done()});
H(1792,8,'8월 10일, 파리 구민과 연맹병이 튈르리 궁을 습격하였다. 스위스 근위대 대부분이 죽고 왕정은 정지되었다. 왕 일가는 탕플 탑에 갇혔다.',async()=>{
  await purge('feuillant');if(s.dead)return;
  if(!adult()||!inParis())return;
  if(noble()&&isM()){const i=await Q('8월 10일','journée du 10 août','튈르리 궁을 지킬 귀족들을 모은다는 전갈이 왔다.',[{l:'궁으로 가 왕을 지킨다',s:'궁에 남은 수비대의 대부분이 죽었다',a:'royal bold'},{l:'몸을 숨긴다',s:'',a:'safe'}]);
    if(i===0){if(await chance(.55,'튈르리 수비','궁을 지킨 이들의 사망률')){die('massacre','튈르리 궁을 지키다 군중에게 살해되었다.');await done();return}say('피투성이가 되어 빠져나왔다. 이름이 혐의자 명단에 올랐다.'+fx({sus:30,pol:-10}),'big')}else say('지하실에 숨어 총성을 들었다.'+fx({sus:5}));await done();return}
  if(isM()&&s.pol>=25){const i=await Q('8월 10일','journée du 10 août','생탕투안과 생마르소의 구민들이 무장하고 튈르리로 향한다.',[{l:'함께 궁으로 진격한다',s:'',a:'bold radical'},{l:'가지 않는다',s:'',a:'safe'}]);
    if(i===0){if(await chance(.04,'튈르리 공격','공격자 가운데 사망자 비율(약 400명)')){die('riot','튈르리 궁 공격 중 스위스 근위대의 총탄에 쓰러졌다.');await done();return}s.flags.dix=true;setStance('crown',2,false);say('궁이 함락되었다.'+fx({pol:10,fame:5,cour:3}))}else say('총성이 오후 내내 이어졌다.');await done()}});
H(1792,8,'8월 19일, 라파예트가 군대를 버리고 오스트리아 쪽으로 넘어갔다. 8월 26일, 선서 거부 사제는 보름 안에 나라를 떠나라는 법령이 내려졌다. 망명자의 재산 몰수가 시작되었다.',async()=>{
  if(s.cond==='emigre'&&s.land>0){s.lostLand=(s.lostLand||0)+s.land;s.land=0;L('망명자 재산 몰수령으로 고향의 땅이 국유재산이 되었다.','sys')}
  if(noble()&&adult()&&R()<.4)s.flags.emigreKin=true;
  if(s.flags.refractory&&s.cond==='normal'){const i=await Q('추방령','déportation','선서 거부 사제는 나라를 떠나야 한다. 남으면 기아나 유형이다.',[{l:'에스파냐로 떠난다',s:'',a:'safe'},{l:'숨어서 교우들을 돌본다',s:'붙잡히면 사형이다',a:'pious bold'}]);
    if(i===0)await emigrate(pick(['에스파냐','로마','런던']));else{s.cond='hiding';s.condSince=T();say('농가의 헛간과 다락을 옮겨 다니며 밤중에 미사를 드렸다.'+fx({faith:6,cour:4}),'big')}await done()}});
H(1792,9,'9월 2~6일, 파리 감옥들에서 학살이 벌어졌다. 수감자 약 2,700명 가운데 1,100~1,400명이 끌려나와 죽었다.',async()=>{
  if(s.cond==='prison'&&inParis()){sheetOpen('9월 학살','massacres de Septembre');shText('감방 문이 열리고 군중이 들이닥쳤다. 즉석 ‘재판관’들이 이름을 부른다.','q b');
    if(await chance(s.flags.refractory||noble()?.75:.45,'감옥 학살','갇혀 있던 이들 중 죽은 비율')){die('massacre');await done();return}
    s.cond='normal';say('“국민 만세!” 소리와 함께 풀려났다. 피 웅덩이를 밟고 나왔다.'+fx({hp:-5}),'big');await done()}});
H(1792,9,'9월 20일, 발미에서 프로이센군을 막아냈다. 같은 날 이혼법이 통과되었다. 9월 21~22일, 보통선거로 뽑힌 국민공회가 왕정을 폐지하고 공화국을 선포하였다.',async()=>{
  await fireStory('goethe');
  if(adult()&&isM()&&s.age>=21&&!deputy()&&lit()&&s.fame>=35&&s.pol>=10)await election('국민공회 선거',.15);
  if(adult()&&s.married&&s.spouse&&s.spouse.alive&&s.flags.unhappy){const i=await Q('이혼법','loi sur le divorce','이제 부부는 합의만으로도 갈라설 수 있다.',[{l:'이혼한다',s:'',a:'radical'},{l:'그대로 산다',s:'',a:'safe family'}]);if(i===0){s.spouse.alive=false;s.divorced=true;s.flags.unhappy=false;say('시청에서 이혼 서류에 서명하였다.'+fx({pol:4}),'big')}else say('참고 살기로 했다.');await done()}});
H(1792,10,'10월, 국민공회의 의석이 갈렸다. 높은 왼쪽 자리의 ‘산악파’, 오른쪽의 지롱드파, 그 사이 낮은 자리의 ‘평원파’.',async()=>{await partyInvite(s.pol>=45?'jacobin':s.pol>=15?'girondin':'plaine')});
H(1792,11,'11월 20일, 튈르리 궁의 벽장에서 왕의 비밀 문서가 든 ‘쇠 궤짝’이 발견되었다. 11월 6일 즈마프에서 이긴 군대가 벨기에로 들어갔다.');
H(1792,12,'12월 11일, 국민공회가 루이 카페(전 국왕 루이 16세)의 재판을 시작하였다. 생쥐스트가 말했다. “사람은 죄 없이 왕으로 군림할 수 없다.”');

/* ---------- 1793 ---------- */
H(1793,1,'1월 15~17일, 국민공회 의원들이 한 사람씩 연단에 올라 루이의 형벌을 말했다. 사형 387표 대 334표.',async()=>{
  if(!deputy())return;
  const i=await Q('국왕 재판','procès du roi','의원 한 사람씩 연단에 올라 루이의 형벌을 말한다. 방청석의 상퀼로트들이 노려본다.',[{l:'사형',s:'',a:'radical'},{l:'국민투표에 부치자',s:'지롱드파의 안',a:'safe'},{l:'구금 후 추방',s:'',a:'royal safe'}]);
  if(i===0){s.flags.regicide=true;setStance('justice',2,false);say('“사형.” 짧게 말하고 연단을 내려왔다.'+fx({pol:15,fame:4}),'big')}else{if(s.pol<50&&!s.party)joinParty('girondin',true);say('“형벌을 국민에게 묻자.” 방청석에서 야유가 쏟아졌다.'+fx({pol:-8,sus:15}))}await done()});
H(1793,1,'1월 21일 아침, 루이 16세가 혁명 광장에서 처형되었다. 그는 군중에게 “나는 죄 없이 죽는다”고 말하려 했으나 북소리가 그의 목소리를 덮었다.',async()=>{if(adult()){fx({pol:s.pol>=20?3:-3});if(noble()||s.faith>=70)say('왕이 죽었다는 소식에 몰래 미사를 올렸다.'+fx({sus:3}))}});
H(1793,2,'2월 1일 영국과 네덜란드에 선전포고. 2월 24일, 30만 명 징집령이 내려졌다.',async()=>{if(maleAdult(18,40))await conscript(.12,'30만 명 징집',{single:true,repl:900,why:'미혼 남성 가운데 뽑힌 비율'})});
H(1793,3,'3월 10일, 혁명재판소가 세워졌다. 같은 달, 방데에서 징집에 반대하는 농민 반란이 일어났다.',async()=>{
  if(adult()&&(loc()==='vendee'||(loc()==='bretagne'&&R()<.4))&&!deputy()&&!soldier()){
    const i=await Q('방데 봉기','guerre de Vendée','교회 종이 울린다. 마을 남자들이 성심(聖心) 휘장을 달고 낫과 사냥총을 들었다. “하느님과 왕을 위하여!”',[{l:'가톨릭 왕당군에 가담한다',s:'방데 지역 인구의 약 4분의 1이 전쟁 중 죽었다',a:'royal pious bold'},{l:'공화국 편에 선다',s:'',a:'radical'},{l:'숲으로 몸을 피한다',s:'',a:'safe'}]);
    if(i===0){s.flags.vendeen=true;joinParty('royalist',true);s.pol=Math.min(s.pol,-40);say('가톨릭 왕당군에 들어갔다. 숄레와 소뮈르에서 이겼다.'+fx({faith:8,cour:6,fame:4}),'big');
      if(await chance(.3,'방데 전쟁','반란군 전투원의 1년간 사망률')){die('battle','방데 전쟁');await done();return}}
    else if(i===1){say('공화파로 낙인찍혀 이웃의 눈을 피해 살았다.'+fx({pol:8,sus:-5}));if(await chance(.06,'왕당군의 보복','공화파 주민이 보복당한 비율')){die('murdered','왕당군에게 공화파로 몰려 살해되었다.');await done();return}}
    else say('숲 속 오두막에 숨어 지냈다.'+fx({hp:-3}));await done()}});
H(1793,4,'4월 5일, 뒤무리에 장군이 적에게 넘어갔다. 4월 6일, 공안위원회가 만들어졌다.');
H(1793,5,'5월 4일, 곡물 최고가격제가 처음 정해졌다. 파리 구민회와 지롱드파의 대립이 극에 달했다.',async()=>{
  if(adult()&&politic()){const i=await Q('최고가격제','le Maximum','빵값을 법으로 묶을 것인가. 상퀼로트는 매점매석범을 단두대로 보내라 하고, 지롱드파는 자유 거래가 굶주림을 끝낸다고 한다.',[{l:'최고가격제를 지지한다',s:'',a:'radical'},{l:'자유 거래를 지킨다',s:'',a:'safe greedy'}]);setStance('econ',i===0?1:0,true);await done()}});
H(1793,6,'5월 31일~6월 2일, 대포를 앞세운 파리 구민들이 국민공회를 포위하였다. 지롱드파 의원 29명이 체포되었다.',async()=>{
  if(deputy()&&(s.party==='girondin'||s.flags.girondin||s.pol<30)){const i=await Q('6월 2일','journées du 31 mai–2 juin','대포를 앞세운 국민방위대가 의사당을 둘러쌌다. 지롱드파 의원들의 체포 명단이 읽힌다. 그대의 이름도 들어 있다.',[{l:'지방으로 달아나 반란을 일으킨다',s:'',a:'bold'},{l:'남아서 체포된다',s:'',a:'safe'}]);
    if(i===0){s.cond='hiding';s.condSince=T();s.flags.girondin=true;loseJob('% 자리를 버리고 칼바도스로 달아났다.');fx({sus:30})}else{s.flags.girondin=true;loseJob();s.cond='prison';s.prisonKind='terror';say('가택 연금을 거쳐 감옥에 갇혔다.'+fx({sus:30}),'big')}await done();return}
  await purge('girondin');if(s.dead)return;
  if(adult()&&['lyon','marseille','bordeaux'].includes(loc())&&s.pol<40&&(rich()||s.estate==='bourgeois')){const i=await Q('연방주의 반란','insurrection fédéraliste',`${REGIONS[loc()].n}의 구민회가 파리의 자코뱅에 맞서 일어섰다.`,[{l:'반란 시 정부에 가담한다',s:'',a:'bold'},{l:'관망한다',s:'',a:'safe'}]);
    if(i===0){s.flags.federalist=true;say('구민회의 위원이 되었다.'+fx({sus:30,fame:4}),'big')}else fx({sus:5});await done()}});
H(1793,7,'7월 13일, 캉에서 온 샤를로트 코르데가 욕조의 마라를 찔렀다. 7월 17일, 남은 영주 공납이 보상 없이 폐지되었다. 7월 27일, 로베스피에르가 공안위원회에 들어갔다.',async()=>{if(adult()&&noble()&&s.dues){say('남은 영주 공납이 보상 없이 사라졌다.'+` (공납 수입 -${fmt(s.dues)})`);s.dues=0}});
H(1793,8,'8월 23일, 국민총동원령. “젊은이는 싸우러 나가고, 기혼자는 무기를 만들고, 여자는 천막과 옷을 짓는다.” 8월 27일, 툴롱이 영국 함대에 항구를 열었다.',async()=>{
  if(maleAdult(18,25))await conscript(.75,'국민총동원',{single:true,why:'18~25세 미혼 남성 가운데 실제로 입대한 비율',text:'국민총동원령. 18세에서 25세까지의 미혼 남자는 모두 징발 대상이다. 대리인은 허락되지 않는다.'})});
H(1793,9,'9월 5일, 국민공회가 “공포를 의사일정에” 올렸다. 9월 17일 혐의자법, 9월 29일 전면 최고가격제.',async()=>{
  if(adult()&&onTrack('craft')&&job().t>=4){say('최고가격제로 정해진 값 이상을 받으면 매점매석범으로 사형이다.'+fx({money:-Math.round(s.money*.1),sus:5}))}
  if(adult()&&politic()){const i=await Q('공포를 의사일정에','la Terreur','“공포는 신속하고 엄격하며 굽힐 수 없는 정의일 뿐이다.” 혁명은 배신자에게 어떻게 해야 하는가.',[{l:'공포로 혁명을 지킨다',s:'',a:'radical'},{l:'공정한 재판은 지켜야 한다',s:'',a:'safe'},{l:'관용을 베풀어야 한다',s:'공포정치기에는 위험하다',a:'pious'}]);setStance('justice',i===0?2:i===1?1:0,true);await done()}});
H(1793,10,'10월 9일 리옹 함락. 10월 16일 마리 앙투아네트 처형. 10월 30일 여성 정치클럽 금지. 10월 31일 지롱드파 21명이 「라 마르세예즈」를 부르며 단두대에 올랐다.',async()=>{
  if(adult()&&s.flags.federalist&&loc()==='lyon'){say('리옹이 함락되었다. 공화국은 “리옹은 더 이상 없다”고 선언하였다.','big');if(await chance(.35,'리옹 처형','가담자 가운데 처형된 비율(총 약 1,900명)')){die('shot','리옹 브로토 평원에서 산탄 총살을 당했다.');return}fx({sus:20})}
  if(adult()&&!isM()&&s.flags.femClub)say('여성 정치클럽이 금지되었다. “여자의 자리는 가정”이라고 의원들이 말했다.'+fx({pol:3}));
  await fireStory('marieAntoinette');
  if(s.party==='girondin'&&s.cond==='prison'&&s.prank>=2){if(await chance(.7,'지롱드파 재판','지도부 재판의 사형 비율')){die('guillotine');return}}});
H(1793,11,'11월 10일, 노트르담이 ‘이성의 신전’이 되었다. 교회 종이 녹아 대포가 되었다. 11월 8일 롤랑 부인 처형.',async()=>{
  await fireStory('roland');
  if(priest()&&s.flags.juror&&s.cond==='normal'){const i=await Q('사제직 포기','abdication de prêtrise','지역 혁명위원회가 사제들에게 “미신의 직분”을 버리고 서품장을 넘기라고 요구한다. 결혼하면 의심을 덜 받는다.',[{l:'사제직을 내려놓는다',s:'',a:'radical safe'},{l:'버티며 미사를 계속한다',s:'혐의가 짙어진다',a:'pious bold'}]);
    if(i===0){loseJob('서품장을 위원회에 넘기고 % 자리를 버렸다.');fx({faith:-15,sus:-15,pol:6});s.flags.abdicated=true;setStance('church',2,false)}else fx({faith:6,sus:25});await done()}
  if(adult()&&s.faith>=70&&!priest()&&R()<.35){const i=await Q('숨은 사제','prêtre caché','선서 거부 사제 한 사람이 밤중에 찾아와 하룻밤 재워 달라고 한다.',[{l:'다락에 숨겨 준다',s:'발각되면 사형',a:'pious bold'},{l:'돌려보낸다',s:'',a:'safe'}]);
    if(i===0){s.seeds.push({t:'hidPriest',y:s.year});say('다락에 숨겨 주고 새벽 미사를 드렸다.'+fx({faith:5,sus:5}))}else say('문을 닫았다.'+fx({faith:-2}));await done()}});
H(1793,12,'12월, 데물랭이 신문 『비외 코르들리에』에서 “관용위원회”를 세우자고 썼다. 12월 19일 툴롱 탈환, 젊은 포병 대위 보나파르트가 이름을 알렸다. 낭트에서는 카리에가 수천 명을 루아르 강에 수장하였다.',async()=>{await partyInvite('indulgent')});

/* ---------- 1794 ---------- */
H(1794,1,'1~5월, 방데에 튀로 장군의 ‘지옥의 종대’가 휩쓸며 마을을 불태웠다.',async()=>{
  if(adult()&&loc()==='vendee'){if(await chance(s.flags.vendeen?.25:.08,'지옥의 종대','방데 주민 가운데 1794년 초에 죽은 비율')){die('massacre');return}say('마을이 불탔다. 살아남은 사람들은 숲으로 흩어졌다.'+fx({hp:-8,money:-Math.round(s.money*.5)}),'big')}});
H(1794,2,'2월 4일(플뤼비오즈 16일), 국민공회가 식민지의 노예제를 폐지하였다.');
H(1794,3,'3월 24일, 에베르와 코르들리에 지도자들이 단두대에 올랐다.',async()=>{await purge('cordelier')});
H(1794,4,'4월 5일, 당통과 데물랭이 처형되었다.',async()=>{await fireStory('danton');await purge('indulgent')});
H(1794,5,'5월 8일, 징세청부인 스물여덟 명이 처형되었다. 그 가운데 화학자 라부아지에가 있었다.',async()=>{await fireStory('lavoisier')});
H(1794,6,'6월 8일, 샹드마르스에서 최고존재의 제전. 6월 10일 프레리알 22일 법으로 피고는 변호인도 증인도 없이 재판받게 되었다. 대공포정치. 6월 26일 플뢰뤼스 승리.',async()=>{
  if(adult()&&inParis()&&R()<.5)say('최고존재의 제전에서 로베스피에르가 무신론의 허수아비에 불을 붙였다. 의원들 사이에서 “독재자”라는 수군거림이 돌았다.');
  await fireStory('carmelites')});
H(1794,7,'7월 27일(테르미도르 9일), 로베스피에르가 국민공회에서 체포되었다. 이튿날 그와 생쥐스트, 쿠통 등 22명이 처형되었다.',async()=>{
  await fireStory('chenier');
  if(deputy()&&s.cond==='normal'){const i=await Q('테르미도르 9일','9 Thermidor','탈리앵이 단검을 휘두르며 연단으로 뛰어오른다. “폭군을 타도하라!” 로베스피에르가 말하려 하지만 종소리가 그의 목소리를 덮는다.',[{l:'체포에 찬성한다',s:'',a:'safe'},{l:'로베스피에르를 변호한다',s:'',a:'radical bold'}]);
    if(i===1){say('로베스피에르와 함께 체포되었다.','big');if(await chance(.85,'테르미도르 처형','로베스피에르파로 체포된 이들의 처형 비율')){die('guillotine');await done();return}}
    else{say('“폭군 타도!” 함께 외쳤다.'+fx({pol:-10,sus:-10}));if(s.party==='jacobin'||s.party==='plaine')joinParty('thermidor',true)}await done();return}
  await purge('jacobin')});
H(1794,8,'8월, 혐의자들이 풀려나기 시작하였다. 혁명재판소가 개편되고 프레리알 법이 폐지되었다.');
H(1794,11,'11월 12일, 자코뱅 클럽이 문을 닫았다. 금빛 청년단(뮈스카댕)이 몽둥이를 들고 자코뱅을 쫓았다.',async()=>{if(adult()&&s.pol>=55&&inParis()&&R()<.3)say('금빛 청년단에게 몽둥이로 얻어맞았다.'+fx({hp:-5,sus:8}))});
H(1794,12,'12월 24일, 최고가격제가 폐지되자 물가가 폭등하였다. 세기에 드문 혹한이 겹쳐 굶주림이 번졌다.',async()=>{if(adult()&&!rich()&&R()<.4)say('빵 배급 줄에서 몇 시간을 떨었다.'+fx({hp:-6}))});

/* ---------- 1795~1799 ---------- */
H(1795,4,'4월 1일(제르미날 12일), “빵과 1793년 헌법”을 외치는 파리 민중이 국민공회에 난입했다가 쫓겨났다. 남부에서 백색테러가 시작되었다.',async()=>{
  if(adult()&&south()&&s.pol>=45&&s.fame>=15){if(await chance(.08,'백색테러','남부에서 알려진 자코뱅이 습격당한 비율')){die('murdered','예후단(Compagnie de Jéhu)에게 살해되었다.');return}say('예후단이 자코뱅을 찾아다닌다는 소문에 몸을 낮췄다.'+fx({sus:5}))}});
H(1795,5,'5월 20일(프레리알 1일), 굶주린 파리 민중이 다시 국민공회로 밀고 들어가 의원 페로의 목을 창에 꽂았다. 군대가 생탕투안 문밖을 포위해 무장을 해제시켰다.',async()=>{
  if(adult()&&inParis()&&!rich()&&s.pol>=35&&R()<.6){const i=await Q('프레리알 봉기','insurrection de Prairial','여인들이 앞장서 국민공회로 밀고 들어간다. 빵과 1793년 헌법!',[{l:'함께 의사당으로 들어간다',s:'',a:'bold radical'},{l:'가지 않는다',s:'',a:'safe'}]);
    if(i===0){if(await chance(.06,'프레리알 진압','가담자 가운데 처형·사살된 비율')){die('executed','프레리알 봉기 가담자로 군사위원회에서 사형 선고를 받았다.');await done();return}s.sus+=15;say('군대가 생탕투안 문밖을 포위해 무장을 해제시켰다.'+fx({pol:5}))}else say('봉기 소식을 들으며 문을 닫았다.');await done()}});
H(1795,6,'6월 8일, 탕플 탑의 열 살 루이 17세가 죽었다. 망명한 프로방스 백작이 스스로 루이 18세라 칭하였다.',async()=>{await fireStory('louis17')});
H(1795,7,'6~7월, 영국 함대가 망명 귀족군을 브르타뉴 키브롱에 상륙시켰으나 오슈 장군에게 궤멸되었다. 포로 약 750명이 총살되었다.',async()=>{
  if(s.cond==='emigre'&&isM()&&noble()&&s.age<55){const i=await Q('키브롱 원정','expédition de Quiberon','영국이 망명 귀족 연대를 배에 태워 브르타뉴로 보낸다. 슈앙들이 맞이할 것이라 한다.',[{l:'원정에 참가한다',s:'',a:'royal bold'},{l:'남는다',s:'',a:'safe'}]);
    if(i===0){if(await chance(.6,'키브롱','상륙한 망명자 가운데 죽거나 총살된 비율')){die('shot','키브롱 원정에서 포로가 되어 오레에서 총살되었다.');await done();return}say('영국 배로 겨우 돌아왔다.'+fx({cour:5}))}await done()}});
H(1795,8,'8월 22일, 공화력 3년 헌법이 채택되었다. 다시 납세자만 투표하고, 오백인회와 원로회의 양원제를 둔다. 새 의회의 3분의 2는 국민공회 의원 중에서 뽑기로 하였다.',async()=>{if(adult()&&politic()){const i=await Q('공화력 3년 헌법','Constitution de l’an III','보통선거를 버리고 납세자 선거로 돌아가자는 헌법이다. “재산을 가진 이가 다스려야 한다”고 부아시 당글라는 말했다.',[{l:'유산자의 질서를 지지한다',s:'',a:'safe'},{l:'1793년 헌법과 보통선거를 지킨다',s:'',a:'radical'}]);setStance('vote',i===0?1:2,true);await done()}});
H(1795,10,'10월 5일(방데미에르 13일), 왕당파 봉기를 보나파르트 장군이 포도탄으로 진압하였다. 10월 26일 국민공회가 해산되고 총재정부가 들어섰다. 리브르 대신 프랑이 화폐 단위가 되었다.',async()=>{
  if(deputy()&&s.pol>-10)say('3분의 2 법령에 따라 오백인회 의원으로 자리를 이어 갔다.');
  else if(deputy()){loseJob('국민공회가 해산되어 % 임기를 마쳤다.');s.loc=null}
  await partyInvite(s.pol>=50?'babeuf':s.pol<=-20?'clichy':'thermidor')});
H(1796,3,'3월, 보나파르트가 조제핀과 혼인하고 이탈리아 원정군 사령관이 되었다. 아시냐가 폐지되고 토지 증권(만다)으로 바뀌었다.');
H(1796,5,'5월 10일, 바뵈프의 ‘평등파의 음모’가 적발되었다. 바뵈프는 이듬해 처형되었다.',async()=>{await purge('babeuf')});
H(1797,4,'3~4월 선거에서 왕당파가 크게 이겼다. 클리시 클럽 의원들이 오백인회를 장악하였다.',async()=>{if(adult()&&isM()&&s.age>=30&&!deputy()&&lit()&&s.fame>=40&&s.pol<=10)await election('오백인회 선거',.12)});
H(1797,9,'9월 4일(프뤽티도르 18일), 총재정부가 군대를 동원해 왕당파 의원들을 축출하고 기아나로 유형 보냈다. 9월 30일 국채의 3분의 2가 파기되었다.',async()=>{
  if(deputy()&&s.pol<-5){loseJob('프뤽티도르 정변으로 의원직을 박탈당했다.');if(await chance(.3,'기아나 유형','축출된 의원 가운데 유형당한 비율')){say('철창 수레에 실려 로슈포르 항으로 끌려갔다. ‘마른 단두대’ 기아나로 간다.','big');if(await chance(.5,'유형지 열병','기아나 유형수의 사망률')){die('deported');return}say('기아나를 탈출해 미국으로 건너갔다.'+fx({hp:-15}))}}
  else await purge('clichy');if(s.dead)return;
  if(adult()&&s.money>=8000&&!s.land){const l=Math.round(s.money*.15);s.money-=l;say(`국채의 3분의 2가 파기되어 이자 수입을 잃었다. (재산 -${fmt(l)})`)}});
H(1798,4,'4월 선거에서 신자코뱅이 크게 이겼다. 5월 11일(플로레알 22일), 총재정부가 그 당선을 무효로 만들었다.',async()=>{if(adult()&&isM()&&s.age>=30&&!deputy()&&lit()&&s.fame>=40&&s.pol>=20)await election('오백인회 선거',.12)});
H(1798,5,'5월 19일, 보나파르트가 학자 167명과 함께 이집트 원정을 떠났다.');
H(1798,9,'9월 5일, 주르당 법으로 20~25세 남자에 대한 정기 징병이 시작되었다.');
H(1799,4,'징병 대상 전 연령에 소집령이 내려졌다. 서부에서 슈앙들이 다시 일어났다.',async()=>{if(maleAdult(20,25))await conscript(.5,'주르당 징병',{why:'20~25세 해당 연령 남성 중 소집된 비율',text:'주르당 법에 따른 징병. 해당 연령의 청년들이 모두 소집된다.'})});
H(1799,7,'7월, 이집트 로제타에서 원정군이 비문이 새겨진 검은 돌을 찾았다.');
H(1799,11,'11월 9~10일(브뤼메르 18~19일), 보나파르트가 생클루에서 총재정부를 무너뜨렸다. 통령정부가 들어섰다.',async()=>{
  if(deputy()){const i=await Q('브뤼메르 18일','18 Brumaire','생클루의 오렌지 온실. 척탄병들이 총검을 들고 회의장으로 들어온다. 보나파르트의 동생이 군인들에게 의원들을 내쫓으라고 외친다.',[{l:'보나파르트를 지지한다',s:'',a:'safe'},{l:'“독재자를 타도하라!” 외친다',s:'',a:'radical bold'}]);
    if(i===0){say('그날 밤, 남은 의원들과 함께 통령정부 수립에 찬성하였다.'+fx({fame:3}));s.flags.bonap=true;joinParty('bonapartist',true);if(s.fame>=55&&R()<.5){loseJob();takeJob('p5','원로원(Sénat)에 지명되어 ')}}
    else{loseJob('창문으로 뛰어내려 달아났다. % 자리는 사라졌다.');fx({pol:6,sus:15})}await done();return}
  await purge('neojacobin')});

/* ---------- 통령정부·제국 ---------- */
for(const [y,p,r] of [[1800,.25,1500],[1801,.2,1500],[1802,.2,1600],[1803,.22,1800],[1804,.25,2000],[1805,.28,2200],[1806,.3,2400],[1807,.3,2600],[1808,.3,3000],[1809,.33,3200],[1810,.3,3500],[1811,.35,3800],[1812,.4,4000],[1813,.65,5000]])
  H(y,10,null,async()=>{if(maleAdult(20,y>=1813?30:21))await conscript(p,`${y}년 징병`,{repl:r,single:y<1809,why:'해당 연령 남성 가운데 실제로 끌려간 비율',text:y>=1813?'라이프치히의 패전 뒤 이미 면제받았던 연령까지 다시 소집되었다.':'징병 추첨이 열렸다. 기혼자는 면제되고, 돈이 있으면 대리인을 살 수 있다.'})});
H(1800,7,'6월 14일, 마렝고 전투에서 승리하였다. 망명자 명단에서 이름을 지우는 사면이 시작되었다.');
H(1800,4,'신문 73종 가운데 60종이 폐간되었다.',async()=>{if(s.job==='w3'&&R()<.8)loseJob('경찰장관 푸셰의 명령으로 신문이 폐간되어 % 일을 잃었다.')});
H(1801,7,'7월, 교황과 콩코르다트를 맺었다. 가톨릭은 “프랑스인 대다수의 종교”로 돌아왔다.',async()=>{
  if(s.flags.refractory&&s.cond!=='emigre'){s.flags.refractory=false;s.cond='normal';say('콩코르다트로 다시 공개적으로 미사를 드릴 수 있게 되었다.'+fx({faith:6}),'big');if(isM()&&meets(POST.r3))takeJob('r3','새 주교의 임명으로 ')}
  if(adult()&&s.faith>=60)say('부활절에 십 년 만에 교회 종소리가 울렸다.'+fx({faith:3}))});
H(1802,4,'아미앵 조약으로 잠시 평화가 찾아왔다. 5월, 레지옹 도뇌르가 제정되었다. 8월, 보나파르트가 종신 통령이 되었다.',async()=>{
  if(adult()&&s.fame>=55&&!s.flags.legion&&(soldier()||onTrack('law')||onTrack('letters')||deputy())&&R()<.35){s.flags.legion=true;say('레지옹 도뇌르 훈장을 받았다.'+fx({fame:6}),'big')}});
H(1804,4,'3월, 민법전(나폴레옹 법전)이 공포되었다. 3월 21일 앙기앵 공작이 처형되었다.',async()=>{if(adult()&&!isM()&&s.married)say('민법전은 아내가 남편에게 복종해야 한다고 정했다.')});
H(1805,1,'12월 2일, 노트르담에서 나폴레옹이 스스로 황제의 관을 썼다.',async()=>{if(adult()&&soldier()&&job().t>=7)say('대관식 행렬에서 원수의 지휘봉을 들고 걸었다.'+fx({fame:5}))});
H(1805,10,'10월 21일 트라팔가르 해전에서 함대를 잃었다. 12월 2일 아우스터리츠에서 러시아·오스트리아 연합군을 격파하였다.');
H(1806,10,'10월, 예나와 아우어슈테트에서 프로이센을 격파하였다. 11월, 대륙봉쇄령.',async()=>{if(adult()&&['bordeaux','nantes','marseille'].includes(loc())&&onTrack('craft')&&job().t>=4)say('대륙봉쇄로 항구가 텅 비었다.'+fx({money:-Math.round(s.money*.2)}))});
H(1807,4,'아일라우의 눈보라 속 전투. 양쪽에서 수만 명이 쓰러졌다. 7월 틸지트 조약.');
H(1808,4,'에스파냐에서 반란이 일어났다. 제국 귀족 작위가 만들어졌다.',async()=>{
  if(adult()&&!s.flags.title&&((soldier()&&job().t>=5)||s.job==='p5'||s.job==='l5b'||s.job==='l4c')&&R()<.5){s.flags.title=true;say(`제국 ${(soldier()&&job().t>=6)||s.job==='p5'?'백작':'남작'} 작위를 받았다.`+fx({fame:6}),'big')}
  if(soldier()&&R()<.3){say('에스파냐로 가는 부대에 배속되었다. 게릴라의 나라다.','big')}});
H(1810,7,'4월, 나폴레옹이 오스트리아 황녀 마리 루이즈와 재혼하였다.');
H(1812,7,'6월 24일, 60만 대군이 네만 강을 건너 러시아로 들어갔다.',async()=>{if(soldier()){s.flags.russia=R()<.65;if(s.flags.russia)say('대육군에 편성되어 네만 강을 건넜다.','big')}});
H(1812,10,'9월 7일 보로디노 전투, 9월 14일 모스크바 입성. 모스크바는 불탔다. 10월 19일 퇴각이 시작되었다.',async()=>{
  if(!s.flags.russia||!soldier())return;sheetOpen('보로디노','la Moskova');shText('라에프스키 보루를 향해 진격한다. 하루에 양쪽 합쳐 7만 명이 쓰러졌다.','q');
  if(await chance(.12,'보로디노','대육군 병사의 이날 사망률')){die('battle','보로디노');await done();return}say('살아남아 불타는 모스크바에 들어갔다.'+fx({hp:-4}));await done()});
H(1813,1,'영하 30도의 퇴각. 11월 26~29일 베레지나 강 도하. 러시아에 들어간 대육군 가운데 돌아온 이는 열에 하나 남짓이었다.',async()=>{
  if(!s.flags.russia||!soldier())return;sheetOpen('러시아의 겨울','la retraite de Russie');shText('말을 잡아먹고 눈 속에서 잔다. 코사크가 낙오병을 노린다.','q');
  const i=await shButtons([{l:'대열을 따라 버틴다',s:'',a:'safe'},{l:'약탈로 먹을 것을 구한다',s:'담력 판정',a:'bold'}]);
  if(i===1){const r=await roll(s.st.cour>=50?1:0,{label:'약탈'});if(r.v>=4)fx({hp:5})}
  if(await chance(s.st.hp>=60?.45:.6,'퇴각','퇴각 중 대육군의 사망률')){die('cold','러시아에서 퇴각하던 중 눈 속에 쓰러졌다.');await done();return}
  if(await chance(.2,'베레지나','베레지나 도하에서의 손실')){if(R()<.5){die('drowned','베레지나 강을 건너다 얼음물에 빠져 죽었다.');await done();return}say('코사크에게 사로잡혔다. 1814년에야 풀려났다.'+fx({hp:-10}),'big');s.flags.pow=true}
  say('넉 달 만에 몰골이 된 채 프로이센 땅에 닿았다.'+fx({hp:-15,cour:6,fame:4}),'big');s.flags.russia=false;await done()});
H(1813,10,'10월 16~19일, 라이프치히 ‘국민전투’에서 패하였다.');
H(1814,4,'3월 31일 연합군이 파리에 들어왔다. 4월 6일 나폴레옹이 퇴위하고 엘바로 떠났다. 루이 18세가 돌아왔다.',async()=>{
  if(soldier()&&job().t<=2&&R()<.7)discharge('전쟁이 끝나 ');
  if(soldier()&&job().t>=3)say('반급 장교(드미솔드)로 대기 명령을 받았다.'+fx({money:-Math.round(s.money*.05)}));
  if(adult())fx({pol:s.pol<0?-3:0})});
H(1815,4,'3월 1일, 나폴레옹이 엘바를 탈출해 쥐앙만에 상륙하였다. 3월 20일 파리 입성. 백일천하.',async()=>{
  if(!adult())return;if(soldier()||s.flags.bonap||(s.job&&job().t>=4)){const i=await Q('백일천하','les Cent-Jours','황제가 돌아왔다. 다시 독수리 깃발 아래로 가겠는가?',[{l:'황제에게 달려간다',s:'',a:'bold'},{l:'왕에게 충성을 지킨다',s:'',a:'royal safe'}]);
    if(i===0){s.flags.centjours=true;if(!soldier()&&isM()&&s.age<50&&R()<.4)await enlist('황제의 부름에 ');say('“황제 만세!”'+fx({fame:3}))}else{s.flags.loyal1815=true;say('겐트로 피신한 왕의 편에 섰다.'+fx({pol:-4}))}await done()}});
H(1815,7,'6월 18일, 워털루에서 나폴레옹이 패하였다. 7월 왕이 돌아오고, 남부에서 2차 백색테러가 일어났다.',async()=>{
  if(soldier()&&s.flags.centjours){if(await chance(.15,'워털루','참전 프랑스군의 사망률')){die('battle','워털루');return}say('워털루의 패주 속에서 살아 돌아왔다.'+fx({hp:-6}))}
  if(adult()&&s.flags.centjours&&s.fame>=55&&(soldier()&&job().t>=6)){say('네 원수처럼 반역죄로 재판에 회부되었다.','big');if(await chance(.3,'반역죄 재판','백일천하 가담 고위 장성 처벌 비율')){die('shot','백일천하 가담죄로 총살되었다.');return}loseJob();s.flags.purged=true}
  if(adult()&&south()&&(s.faithKind==='protestant'||s.flags.centjours||s.pol>=40)){if(await chance(.04,'2차 백색테러','남부의 신교도·보나파르트파가 습격당한 비율')){die('murdered','님 근처에서 왕당파 폭도에게 살해되었다.');return}}
  if(soldier()&&s.flags.centjours)discharge('제국군 해산으로 ')});
H(1816,4,'1월, 국왕 시해자 추방법. 루이 16세 사형에 투표하고 백일천하에 가담한 이들은 나라를 떠나야 했다. 5월, 이혼이 다시 금지되었다.',async()=>{if(s.flags.regicide&&s.flags.centjours&&adult()){say('국왕 시해자로 추방되어 브뤼셀로 떠났다.','big');s.cond='emigre';s.emiPlace='브뤼셀';s.condSince=T();loseJob()}});
H(1816,7,'‘여름 없는 해’. 탐보라 화산 폭발 뒤 냉해로 흉년이 들었다.');
H(1820,4,'2월, 왕위 계승자 베리 공작이 오페라 극장 앞에서 암살되었다.');
H(1821,7,'5월 5일, 나폴레옹이 세인트헬레나 섬에서 죽었다.',async()=>{if(adult()&&(s.flags.centjours||s.flags.bonap))say('황제가 죽었다는 소식에 홀로 술잔을 들었다.'+fx({hp:-1}))});
H(1824,10,'루이 18세가 죽고 샤를 10세가 즉위하였다.');
H(1825,4,'망명 귀족 보상법(‘10억 프랑법’)이 통과되었다.',async()=>{if(adult()&&s.lostLand){const c=Math.round(s.lostLand*18);s.money+=c;say(`몰수당했던 땅에 대한 보상금 ${fmt(c)} 프랑을 받았다.`,'big')}});
H(1830,7,'7월 27~29일 ‘영광의 사흘’. 파리 시민이 바리케이드를 쌓고 샤를 10세를 몰아냈다. 루이 필리프가 ‘프랑스인의 왕’이 되었다.',async()=>{if(adult()&&inParis()&&s.age<60&&s.pol>=10&&isM()){const i=await Q('영광의 사흘','Trois Glorieuses','삼색기가 다시 노트르담에 올랐다. 골목마다 포석을 뜯어 바리케이드를 쌓는다.',[{l:'바리케이드에 선다',s:'',a:'bold radical'},{l:'창문 너머로 본다',s:'',a:'safe'}]);if(i===0){if(await chance(.03,'7월 혁명','바리케이드 전투원의 사망률')){die('riot','7월 혁명의 바리케이드에서 쓰러졌다.');await done();return}say('사흘 만에 왕이 달아났다.'+fx({fame:4,pol:4}))}await done()}});
H(1832,4,'파리에 콜레라가 번져 약 1만 8천 명이 죽었다.',async()=>{if(adult()&&inParis()&&await chance(.025,'콜레라','파리 주민의 콜레라 사망률')){die('cholera')}});
H(1832,7,'6월 5~6일, 라마르크 장군의 장례식에서 공화파 봉기가 일어났다가 진압되었다.');
H(1841,1,'12월, 나폴레옹의 유해가 앵발리드로 돌아왔다.',async()=>{if(adult()&&(s.flags.centjours||s.flags.bonap||s.cnt.battle>2))say('눈 내리는 샹젤리제에서 황제의 영구 행렬을 지켜보았다. 옛 근위대원들이 울고 있었다.'+fx({hp:1}))});
H(1848,1,'흉년과 공황 뒤 2월 22~24일, 파리에서 혁명이 일어나 루이 필리프가 물러나고 제2공화국이 선포되었다.');
H(1848,4,'남성 보통선거가 실시되었다. 노예제가 폐지되었다.',async()=>{if(adult()&&isM())say('평생 처음으로, 신분도 재산도 묻지 않는 선거에서 투표하였다.'+fx({pol:2}))});
H(1848,7,'6월, 국립작업장 폐쇄에 맞선 노동자 봉기가 카베냐크 장군에게 진압되었다.');
H(1849,1,'루이 나폴레옹 보나파르트가 대통령에 뽑혔다.');
H(1852,1,'12월 2일, 대통령 루이 나폴레옹이 친위 쿠데타를 일으켰다.');

/* 선거 */
async function election(name,base){const {m,why}=md([[s.fame>=60,1,'명성'],[s.st.soc>=55,1,'처세'],[onTrack('law'),1,'법률가'],[trait('야심'),1,'야심'],[!!s.party&&partyFit()>0,1,'당의 지지'],[s.prank>=2,1,'당 지도부'],[s.flags.bastille||s.flags.dix,1,'혁명의 공'],[s.pol<0,-1,'온건']]);
  const i=await Q(name,'élections','선거인 회의가 열린다. 출마하겠는가?',[{l:'출마한다',s:'처세·명성 판정',a:'social radical'},{l:'나서지 않는다',s:'',a:'safe'}]);
  if(i===1){await done();return}
  const r=await roll(m,{label:name,why});
  if(r.v>=5&&await chance(base*2+(s.fame-40)/150,'당선','선거인단의 표를 얻을 확률')){s.flags.wasDeputy=true;s.loc='paris';if(s.job)s.prevJob=s.job;takeJob('p3','파리로 올라가 ');fx({fame:8})}
  else say('낙선하였다.'+fx({fame:1}));await done()}
