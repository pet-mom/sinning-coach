/* ================= 행동 확장 (한 해에 한 번씩 고르는 일) =================
   defineAct({k,n,s,g,cost,c,f|inter}). g: body learn social faith money politics risk life (ACT_GROUPS).
   cost는 버튼에 보이는 값이고 실제로 빼는 것은 f/inter 안의 fx({money:-…})다. 기다림(Q·roll·chance)이 있으면 inter로 쓴다. */
const acCult=()=>!(T()>=1792.6&&T()<1801.6); // 공개 예배·신도회·순례가 막힌 시기 밖
const acTown=()=>free()&&urban();
const acGent=()=>urban()||noble()||rich();
const acPick=a=>pick(a.filter(x=>!x[1]||x[1]()))[0];
const acM=n=>`${fmt(n)} ${money()}`;

/* ---------- 배움과 솜씨 ---------- */
defineAct({k:'cabinet',g:'learn',n:'독서실·책 대여점에 다닌다',s:'재산 20. 문학·철학 +',cost:20,c:()=>acTown()&&lit()&&T()>=1760,f:()=>say(acPick([
  ['책방 뒤 열람실에 연회비를 내고 새 책과 신문을 읽었다.'],
  ['루소의 『신엘로이즈』를 시간당 몇 수에 빌려 읽었다. 책방은 권을 나눠 빌려주었다.',()=>T()<1775],
  ['독서실(카비네 드 렉튀르)에서 월터 스콧의 소설 번역본을 빌렸다. 대기 명단이 길었다.',()=>T()>=1820],
  ['신문 아래쪽 연재소설(푀유통)을 읽으러 독서실에 갔다. 다들 외젠 쉬의 『파리의 비밀』 이야기뿐이다.',()=>T()>=1842.5],
  ['볼테르와 디드로의 책을 몰래 빌려주는 책방 뒷방에 드나들었다.',()=>T()<1789]])+fx({money:-20,klett:3,kphil:2,edu:1}))});
defineAct({k:'lang',g:'learn',n:'외국어를 배운다',s:'재산 60. 외국어 +4',cost:60,c:()=>free()&&lit()&&s.age<60,f:()=>{const l=acPick([
  ['영어를 배웠다. 영국 정원과 영국 헌정이 유행이라 다들 셰익스피어를 들먹인다.',()=>T()>=1760],['이탈리아어를 배웠다. 오페라 대본을 원어로 읽고 싶었다.'],
  ['스페인어를 배웠다. 국경 너머 상인들과 거래가 잦다.',()=>['gascogne','languedoc','bordeaux'].includes(loc())],['독일어를 배웠다. 라인 강 건너 책과 사람이 오간다.',()=>loc()!=='alsace'],
  ['영어 문법책을 붙들었다. 런던과의 무역 서신을 직접 읽으려 했다.',()=>['nantes','bordeaux','rouen','marseille'].includes(loc())]]);
  say(l+fx({money:-60,klang:4,edu:1}))}});
defineAct({k:'math',g:'learn',n:'수학과 측량을 공부한다',s:'재산 30. 수학·자연과학 +4',cost:30,c:()=>free()&&lit()&&s.age<60,f:()=>say(acPick([
  ['베주의 『수학 강의』를 처음부터 풀었다. 해군 사관 후보생들이 보는 교본이다.',()=>T()>=1765],['측량사에게 사슬자와 측판으로 밭 넓이 재는 법을 배웠다.'],
  ['클레로의 『기하학 원론』으로 삼각형과 원을 그렸다.'],['새 미터법의 미터·그램·리터를 옛 자·파운드와 맞춰 보는 표를 만들었다.',()=>T()>=1795.5],
  ['라크루아의 교과서로 미적분을 익혔다. 이공과 학교 시험을 보는 젊은이들이 보는 책이다.',()=>T()>=1798]])+fx({money:-30,ksci:4,pen:1}))});
defineAct({k:'latin',g:'learn',n:'라틴어를 복습한다',s:'라틴어·고전 +3, 문학 +1',c:()=>free()&&lit()&&((s.kn.klat||0)>=5||s.st.edu>=45),f:()=>say(pick(['베르길리우스의 『농경시』를 사전을 끼고 다시 읽었다.','키케로의 『의무론』 한 장을 옮겨 적었다.','타키투스를 읽으며 로마 공화정의 몰락을 생각하였다.','호라티우스의 송가를 외워 저녁 식탁에서 읊었다.'])+fx({klat:3,klett:1}))});
defineAct({k:'lecture',g:'learn',n:'공개 강의를 청강한다',s:'의학 +3, 자연과학 +2',c:()=>free()&&lit()&&s.age>=15&&(inParis()||(urban()&&T()>=1760)),f:()=>say(acPick([
  ['왕립 식물원(자르댕 뒤 루아)의 공개 화학 강의에서 루엘이 플라스크를 터뜨렸다.',()=>inParis()&&T()<1768.5],
  ['왕립 식물원의 원형 강의실에서 해부학 공개 강의를 들었다. 여인들도 자리를 메웠다.',()=>inParis()&&T()<1793.5],
  ['자연사 박물관(1793)의 공개 강의에서 라마르크의 무척추동물 이야기를 들었다.',()=>inParis()&&T()>=1793.5],
  ['의학교 강의실 뒤편에 서서 임상 강의를 청강하였다. 환자 침대 곁에서 가르친다.',()=>inParis()&&T()>=1795],
  ['콜레주 드 프랑스의 무료 강의를 들었다. 누구나 들어갈 수 있다.',()=>inParis()],
  ['외과 학교의 공개 해부 강의에 앉았다. 지독한 냄새에 몇 사람이 뛰쳐나갔다.',()=>!inParis()]])+fx({kmed:3,ksci:2,edu:1}))});
defineAct({k:'drawl',g:'learn',n:'그림을 배운다',s:'재산 40. 그림 +4',cost:40,c:()=>free()&&s.age<60&&acGent(),f:()=>say(acPick([
  ['왕립 무료 데생 학교에서 장인의 아들들과 함께 장식 도안을 베꼈다.',()=>inParis()&&T()>=1766&&s.estate==='artisan'&&isM()],
  ['드로잉 선생을 집으로 불러 파스텔로 꽃 그리는 법을 배웠다.',()=>noble()||rich()],
  ['석고 두상을 놓고 목탄 데생을 하였다. 선생은 그림자를 더 깊게 하라고 하였다.'],
  ['수채 물감 상자를 사서 강가 풍경을 그렸다.',()=>T()>=1790]])+fx({money:-40,draw:4,dex:1}))});
defineAct({k:'musicl',g:'learn',n:'악기를 배운다',s:'재산 100. 악기 +4',cost:100,c:()=>free()&&s.age<60&&acGent(),f:()=>say(acPick([
  ['하프시코드(클라브생) 선생에게 라모의 소품을 배웠다.',()=>T()<1785],['포르테피아노를 배웠다. 건반을 세게 누르면 소리가 커진다.',()=>T()>=1775],
  ['페달 하프를 배웠다. 왕비 덕에 귀부인들 사이에 유행이다.',()=>!isM()&&T()>=1770],['바이올린 선생에게 활 긋는 법을 배웠다.'],
  ['플루트를 불었다. 저녁마다 이웃이 창문을 닫았다.',()=>isM()],['기타를 배웠다. 스페인 선생이 가르친다.',()=>T()>=1800]])+fx({money:-100,music:4,dex:1}))});
defineAct({k:'dance',g:'learn',n:'춤과 예법을 배운다',s:'재산 60. 예법 +4',cost:60,c:()=>free()&&s.age<45&&acGent(),f:()=>say(acPick([
  ['무용 선생에게 미뉴에트와 깊이 숙이는 인사(레베랑스)를 배웠다.',()=>T()<1795],['콩트르당스와 카드리유의 짝 바꾸는 순서를 익혔다.'],
  ['왈츠를 배웠다. 나이 든 사람들은 남녀가 너무 붙는다고 혀를 찼다.',()=>T()>=1800],['궁정식 몸가짐을 배웠다. 걸음걸이와 부채 쥐는 법까지 정해져 있다.',()=>noble()&&T()<1789.5]])+fx({money:-60,manner:4,soc:1,str:1}))});
defineAct({k:'physique',g:'learn',n:'과학 실험 구경을 간다',s:'재산 10. 자연과학 +2, 사교 +1',cost:10,c:()=>acTown(),f:()=>say(acPick([
  ['전기 실험 구경을 갔다. 손잡은 사람들이 줄줄이 전기 충격에 펄쩍 뛰었다.',()=>T()<1790],
  ['튈르리 정원에서 수소 기구가 떠오르는 것을 보았다. 수십만 명이 하늘을 올려다보았다.',()=>inParis()&&T()>=1783.9&&T()<1786],
  ['메스머의 자기 요법 통(바케) 둘레에 앉은 귀부인들이 경련을 일으키는 것을 구경하였다.',()=>inParis()&&T()>=1778&&T()<1786],
  ['볼타 전지의 불꽃 실험을 보았다.',()=>T()>=1801],['다게르의 은판 사진을 보았다. 거리 풍경이 그대로 은판에 박혀 있었다.',()=>T()>=1839.6],
  ['순회 실험가가 공기 펌프 속에서 새가 숨이 막히는 것을 보여 주었다.']])+fx({money:-10,ksci:2,soc:1}))});

/* ---------- 몸과 마음 ---------- */
defineAct({k:'hunt',g:'body',n:'사냥을 나간다',s:'승마·무예 +. 다칠 수 있다',c:()=>free()&&s.age>=16&&s.age<65&&((noble()&&T()<1789.6)||(T()>=1789.6&&(noble()||s.land>=100||rich()))),inter:async()=>{
  const {m,why}=md([[s.sk.ride>=40,1,'말을 잘 탐'],[s.sk.arms>=35,1,'총 솜씨'],[s.st.str>=55,1,'체력'],[s.sk.ride<15,-1,'서툰 말솜씨'],[s.st.hp<35,-1,'병약']]);const r=await roll(m,{label:'사냥',why});
  const pre=T()<1789.6?'영지 숲에서 몰이꾼과 사냥개를 앞세웠다.':T()>=1844.4?'사냥 면허(1844년 법)를 사서 엽총을 메고 나갔다.'+fx({money:-25}):'8월 4일 밤 이후로 사냥은 귀족만의 특권이 아니다. 내 땅에서 엽총을 들었다.';
  if(r.v>=5)say(pre+' 큰 사슴을 몰아 잡았다. 저녁 식탁에 손님들이 모였다.'+fx({ride:3,arms:2,str:1,fame:1,relite:2}));
  else if(r.v<=1){if(await chance(.2,'낙마','사냥 중 낙마 부상 비율'))say(pre+' 말이 도랑 앞에서 멈춰 서는 바람에 떨어졌다.'+fx({hp:-10,ride:1}));else say(pre+' 하루 종일 토끼 한 마리 보지 못했다.'+fx({ride:1}))}
  else say(pre+' 메추라기와 토끼 몇 마리를 잡았다.'+fx({ride:2,arms:2,str:1}))}});

/* ---------- 신앙 ---------- */
defineAct({k:'pilgr',g:'faith',n:'순례를 떠난다',s:'재산이 든다. 신앙 +, 가호',c:()=>free()&&s.faithKind==='catholic'&&s.age>=12&&s.age<70&&acCult()&&s.money>=30,inter:async()=>{
  const L=[['몽생미셸','바닷물이 빠진 모래톱을 건너 대천사 미카엘의 수도원에 올랐다.',80,()=>T()<1790.2&&['normandie','bretagne','ile','paris','picardie'].includes(loc())],
   ['생트안도레','브르타뉴의 성 안나 순례(파르동)에 갔다. 브르통어 성가가 들판에 울렸다.',30,()=>['bretagne','vendee','nantes'].includes(loc())],
   ['로카마두르','절벽에 매달린 검은 성모 성당의 계단을 무릎으로 올랐다.',60,()=>['gascogne','languedoc','auvergne','bordeaux'].includes(loc())],
   ['푸르비에르','리옹 언덕 위 푸르비에르 성모 성당에 초를 바쳤다.',10,()=>loc()==='lyon'],
   ['리에스 성모','피카르디의 리에스 성모 성당에 걸어서 다녀왔다.',40,()=>['picardie','champagne','ile','paris'].includes(loc())],
   ['생트봄','프로방스 산속 막달라 마리아의 동굴에 올랐다.',50,()=>['provence','marseille'].includes(loc())],
   ['라살레트','알프스 산중 성모 발현지 라살레트까지 걸어 올랐다.',120,()=>T()>=1847],
   ['뤼뒤바크','뤼 뒤 바크 수녀원 성당에서 기적의 메달을 받았다.',5,()=>inParis()&&T()>=1832.5],
   ['산티아고','왕의 여권을 받아 피레네를 넘어 콤포스텔라의 성 야고보 무덤까지 갔다. 몇 달이 걸렸다.',250,()=>T()<1789&&s.age<50],
   ['이웃 고을 성인의 축일','이웃 고을 수호성인의 축일 행렬을 따라 걸었다.',10,()=>true]].filter(x=>x[3]()&&s.money>=x[2]);
  const i=await Q('순례','pèlerinage','어디로 떠날 것인가?',L.map(x=>({l:x[0],s:`재산 ${x[2]}`,a:'pious'})).concat([{l:'그만둔다',s:'',a:'safe'}]));
  if(i>=L.length){say('순례를 다음으로 미뤘다.');await done();return}const x=L[i],far=x[2]>=80;
  say(x[1]+fx({money:-x[2],faith:far?6:4,hp:far?-3:-1,khist:far?2:1,rloc:1}));if(await chance(far?.5:.3,'순례의 가호','순례자가 은총을 느꼈다고 기록한 비율'))s.flags.blessed=true;await done()}});
defineAct({k:'confr',g:'faith',n:'신도회에 나간다',s:'재산 10. 신앙·이웃 평판 +',cost:10,c:()=>free()&&s.faithKind==='catholic'&&acCult(),f:()=>say(acPick([
  ['흰 두건을 쓴 고행 신도회(페니탕)의 성목요일 행렬에 섰다.',()=>['provence','languedoc','marseille','lyon'].includes(loc())],
  ['자선 신도회(샤리테) 회원으로 이웃의 장례 행렬에서 관을 메었다.',()=>['normandie','rouen','picardie'].includes(loc())],
  ['묵주 기도 신도회 여인들과 성모 제대를 꽃으로 꾸몄다.',()=>!isM()],['성체 신도회의 성체 행렬에서 초를 들었다.'],
  ['동업 신도회의 수호성인 축일 미사에 나갔다. 끝나고 다 같이 술을 마셨다.',()=>urban()&&isM()]])+fx({money:-10,faith:2,rloc:3,soc:1}))});
defineAct({k:'worship',g:'faith',get n(){return s&&s.faithKind==='jewish'?'회당 예배에 나간다':'개신교 예배에 나간다'},s:'신앙 +3. 박해 시기엔 위험',c:()=>free()&&s.faithKind!=='catholic',inter:async()=>{
  if(s.faithKind==='jewish'){say((T()>=1808?'중앙 종교회의(콩시스투아르) 아래 랍비가 이끄는 회당 예배에 나갔다.':T()>=1791.7?'시민이 된 뒤 처음 맞는 안식일, 회당에 사람이 가득하였다.':'회당에서 안식일 예배를 드렸다. 유대인은 아직 시민이 아니다.')+fx({faith:3,rloc:1}));return}
  if(T()<1787.9){const p=T()<1763?.12:.04;say('밤에 골짜기에서 열리는 ‘광야의 집회’에 갔다. 망을 보는 사람이 바위 위에 섰다.');
    if(await chance(p,'집회 적발','광야 집회가 군대에 습격당한 비율')){if(isM()&&T()<1763){s.cond='prison';s.prisonKind='plain';s.condSince=T();loseJob();say('기마경찰대에 붙잡혀 갤리선 노역형을 받았다.'+fx({sus:10,faith:3}),'big')}else say('군대가 들이닥쳤다. 벌금을 물고 풀려났다.'+fx({money:-Math.round(Math.min(s.money*.2,200)),faith:3,sus:5}))}
    else say('목사가 시편을 읽었다. 무사히 집으로 돌아왔다.'+fx({faith:4,cour:1,rloc:1}));return}
  say((T()>=1802.3?'국가가 인정한 개신교 교회(1802년 조직 조례)의 예배당에 나갔다.':'이제 숨지 않고 예배를 드린다. 1787년 관용 칙령이 혼인과 출생을 인정하였다.')+fx({faith:3,rloc:1}))}});
defineAct({k:'hotel',g:'faith',n:'병원에서 환자를 돌본다',s:'신앙·민중 평판 +, 외과 손기술 +. 병이 옮을 수 있다',c:()=>acTown()&&s.age>=16&&s.age<70,inter:async()=>{
  say((inParis()?'오텔디외 병원에서 한 침대에 넷씩 누운 환자들에게 수프를 떠먹였다.':'시립 병원에서 붕대를 감고 환자들의 침대보를 갈았다.')+(isM()?'':' 사랑의 딸회 수녀들 곁에서 일하였다.')+fx({faith:2,heal:2,kmed:1,rpeople:2,rloc:1}));
  if(await chance(.06,'병원 열병','병원 봉사자가 열병에 걸린 비율'))say('병원 열병이 옮아 몇 주를 앓았다.'+fx({hp:-8}))}});

/* ---------- 사람과 사교 ---------- */
defineAct({k:'theatre',g:'social',n:'극장에 간다',s:'재산 15. 문학 +2, 사교 +1',cost:15,c:()=>acTown(),f:()=>{const P=inParis();say(acPick([
  ['코메디프랑세즈에서 라신의 비극을 보았다.',()=>P&&(T()<1793.67||T()>=1799.4)],['코메디프랑세즈에서 『피가로의 결혼』을 보았다. 관객들이 귀족을 비웃는 대사마다 박수를 쳤다.',()=>P&&T()>=1784.3&&T()<1789.5],
  ['오페라 극장에서 글루크의 『타우리스의 이피게니아』를 보았다. 글루크파와 피치니파가 객석에서 다투었다.',()=>P&&T()>=1779.4&&T()<1781],
  ['탕플 대로의 니콜레 극장에서 줄타기와 어릿광대 촌극을 보았다.',()=>P&&T()>=1760&&T()<1830],['탕플 대로에서 픽세레쿠르의 멜로드라마를 보았다. 악당이 나올 때마다 객석이 야유하였다.',()=>P&&T()>=1800],
  ['『에르나니』 첫 공연에 갔다. 붉은 조끼의 낭만파 청년들과 고전파 관객이 객석에서 맞붙었다.',()=>P&&s.year===1830&&T()<1830.5],['오페라 극장에서 마이어베어의 『악마 로베르』를 보았다.',()=>P&&T()>=1832],
  ['푸낭뷜 극장에서 드뷔로의 하얀 피에로를 보았다.',()=>P&&T()>=1825],['혁명기의 극장에서 『샤를 9세』를 보았다. 객석이 왕을 욕하였다.',()=>P&&T()>=1789.85&&T()<1792],
  ['보르도 대극장의 열두 기둥 아래로 들어갔다. 프랑스에서 가장 아름다운 극장이라 한다.',()=>loc()==='bordeaux'&&T()>=1780.3],['수플로가 지은 리옹 극장에서 희가극을 보았다.',()=>loc()==='lyon'],
  ['도시 극장에서 순회 극단의 희극을 보았다.',()=>!P]])+fx({money:-15,soc:1,klett:2,relite:P?1:0}))}});
defineAct({k:'guing',g:'social',n:'관문 밖 선술집에서 춤춘다',s:'재산 5. 사교 +2',cost:5,c:()=>acTown()&&s.age<50,f:()=>say(acPick([
  ['일요일, 입시세가 붙지 않는 관문 밖 선술집(갱게트)에서 싼 포도주를 마시고 춤추었다.',()=>inParis()],['쿠르티유의 선술집에서 사육제 마지막 날 밤을 새웠다.',()=>inParis()],
  ['성문 밖 풀밭 무도회에서 바이올린 소리에 맞춰 돌았다.']])+fx({money:-5,soc:2,rpeople:1,hp:R()<.3?-1:0}))});
defineAct({k:'billet',g:'social',n:'연애편지를 쓴다',s:'글솜씨 판정. 혼담이 될 수도',c:()=>free()&&lit()&&s.age>=16&&s.age<45&&!(s.spouse&&s.spouse.alive)&&!priest()&&!nun(),inter:async()=>{
  const lv=relsAlive().find(r=>r.role==='연인');
  const {m,why}=md([[s.sk.pen>=30,1,'글솜씨'],[(s.kn.klett||0)>=25,1,'문학'],[s.st.soc>=50,1,'사교'],[s.sk.pen<10,-1,'서툰 글씨']]);const r=await roll(m,{label:'연애편지',why});
  if(lv){say(`${lv.n}에게 편지를 보냈다.`+(r.v>=4?' 답장이 왔다.':' 답장은 짧았다.')+fx({pen:1,klett:1})+relFx(lv,{close:r.v>=4?8:2}));return}
  if(r.v<=2){say('편지가 상대 부모 손에 들어갔다. 동네에 소문이 돌았다.'+fx({pen:1,rfam:-3,rloc:-1}));return}
  if(r.v<5){say('밤새 고쳐 쓴 편지를 보냈다. 답장은 없었다.'+fx({pen:1,klett:1}));return}
  const nm=isM()?woman():person();const age=clamp(s.age+(isM()?-ri(1,6):ri(0,6)),16,60);
  const i=await Q('답장','billet doux',`${nm}에게서 답장이 왔다. 다음 주일 미사가 끝나면 성당 앞에서 만나자고 한다.`,[{l:isM()?'청혼한다':'청혼을 받아들인다',s:'',a:'family social'},{l:'편지만 주고받는다',s:'',a:'safe'}]);
  if(i===0){const pay=isM()?{peasant:60,artisan:150}[s.estate]||0:Math.round(POST[pick(['f2','c2','c3','l2','c4'])].pay*({peasant:.5,artisan:.9,bourgeois:1.4,hobereau:2,robe:3,epee:5}[s.estate]||1));
    s.married=true;s.spouse={n:nm,age,alive:true,pay,estate:s.estate};say(`${jo(nm,'과','와')} 혼인하였다. 편지 묶음은 리본으로 묶어 상자에 넣었다.`+fx({soc:2,vfam:2}),'big')}
  else say(`${jo(nm,'과','와')} 편지를 주고받았다.`+fx({pen:1,klett:1}));await done()}});
defineAct({k:'mediate',g:'social',n:'이웃 다툼을 중재한다',s:'사교·웅변 판정. 이웃 평판 +',c:()=>free()&&s.age>=25&&s.rep.rloc>=45,inter:async()=>{
  const d=pick(['밭 경계석을 누가 옮겼느냐','우물 물을 누가 먼저 긷느냐','빌려준 돈 20리브르를 갚느냐','술집에서 오간 욕설을 사과하느냐','닭이 남의 밭을 헤집었느냐']);
  const {m,why}=md([[s.st.soc>=50,1,'사교'],[s.sk.orat>=30,1,'웅변'],[(s.kn.klaw||0)>=20,1,'법을 앎'],[s.rep.rloc>=65,1,'이웃의 신망'],[s.fame>=30,1,'명성'],[s.st.soc<30,-1,'숫기 없음']]);const r=await roll(m,{label:'중재',why});
  const jp=T()>=1791?' 치안판사에게 가기 전에 매듭지었다.':'';
  if(r.v>=4)say(`이웃 둘이 ${d}로 다투었다. 양쪽 말을 다 듣고 술 한 병씩 사게 하였다.${jp}`+fx({rloc:4,inf:1,orat:1,vjus:1}));else say(`이웃 둘이 ${d}로 다투었다. 끼어들었다가 양쪽 모두에게 원망을 샀다.`+fx({rloc:-2,orat:1}))}});
defineAct({k:'mutual',g:'social',n:'공제회에 든다',s:'재산 20. 동업자 평판 +',cost:20,c:()=>acTown()&&!noble()&&!s.flags.mutual&&(T()<1791.4||T()>=1806),f:()=>{s.flags.mutual=true;say((T()<1791.4?'직인 조합의 상호부조 금고에 회비를 냈다. 떠돌이 직인이 앓으면 동료들이 돌본다.':'공제회(소시에테 드 스쿠르 뮈튀엘) 명부에 이름을 올렸다. 다달이 회비를 내면 앓을 때 일당을 받는다.')+fx({money:-20,rguild:3,rloc:1,vfam:1}))}});
defineAct({k:'lodge',g:'social',n:'프리메이슨 지부에 입회한다',s:'재산 150. 사교·영향력 +',cost:150,c:()=>free()&&lit()&&s.age>=21&&!s.flags.mason&&(T()<1793||T()>=1800)&&(isM()?(noble()||rich()||s.estate==='bourgeois'||urban()):(T()>=1774&&(noble()||rich()))),f:()=>{s.flags.mason=true;
  say((isM()?'눈가리개를 쓰고 입회 의식을 치렀다. 지부의 ‘형제’들 가운데 귀족도 상인도 있었다.':'귀부인들의 입양 지부(로주 다돕시옹)에 들었다. 1774년 그랑토리앙이 여성 지부를 인정하였다.')+fx({money:-150,soc:3,inf:2,relite:2,vlib:2,kphil:1}))}});
defineAct({k:'lodgem',g:'social',n:'지부 모임에 나간다',s:'재산 20. 사교·영향력 +',cost:20,c:()=>free()&&s.flags.mason&&(T()<1793||T()>=1800),f:()=>say(acPick([['지부 연회에서 건배가 이어졌다. 자선 모금도 하였다.'],['지부에서 볼테르를 맞아들인 ‘아홉 자매’ 지부 이야기를 들었다.',()=>inParis()&&T()>=1778.3&&T()<1790],
  ['제국의 고관들이 지부 의장석에 앉아 있었다. 캉바세레스가 대(大)지부장이다.',()=>T()>=1804&&T()<1814.3],['경찰이 지부 명단을 들여다본다는 말이 돌았다.',()=>T()>=1815.5]])+fx({money:-20,soc:1,inf:1,kphil:1}))});
defineAct({k:'travel',g:'life',n:'역마차로 여행한다',s:'재산 80. 역사·지리 +3',cost:80,c:()=>free()&&s.age>=14&&s.age<70,f:()=>{const to=inParis()?pick(['리옹','루앙','보르도','랭스']):'파리';
  say(acPick([[`역마차를 타고 ${to}까지 갔다. 덜컹대는 길에 엿새가 걸렸다.`,()=>T()<1775.5],[`튀르고가 바꾼 새 역마차(튀르고틴)로 ${to}까지 갔다. 예전보다 이틀이 빨랐다.`,()=>T()>=1775.5&&T()<1820],
   [`왕립 역마차 회사의 승합 마차로 ${to}까지 갔다. 지붕 위 짐칸에 앉으면 싸다.`,()=>T()>=1820],['파리에서 생제르맹까지 기차를 탔다. 서른 분 만에 닿았다.',()=>inParis()&&T()>=1837.65],[`새 철도로 ${to}까지 갔다. 창밖 풍경이 날아갔다.`,()=>T()>=1843.4&&inParis()]])+fx({money:-80,khist:3,soc:1,hp:-1,vlib:1}))}});

/* ---------- 돈과 땅 ---------- */
defineAct({k:'lottery',g:'money',n:'복권을 산다',s:'재산 12. 드물게 당첨',cost:12,c:()=>free()&&s.money>=12&&((T()>=1757.5&&T()<1793.9)||(T()>=1797.75&&T()<1836.1)),inter:async()=>{
  const nm=T()<1776.3?'사관학교 복권':T()<1793.9?'왕립 복권':'국영 복권';say(`${nm} 사무소에서 아흔 숫자 가운데 하나를 골랐다. 다섯 개를 뽑는다.`+fx({money:-12}));
  if(await chance(1/400,'두 숫자 맞히기','앙브(두 숫자) 당첨 확률')){say('두 숫자가 다 나왔다. 270배다!'+fx({money:3240,fame:1}),'big');return}
  if(await chance(1/18,'한 숫자 맞히기','엑스트레(한 숫자) 당첨 확률 5/90'))say('고른 숫자가 나왔다. 열다섯 배를 받았다.'+fx({money:180}));else say('숫자는 나오지 않았다.')}});
const acSav=()=>s.flags.epargne||null;
function acSavNow(){const e=acSav();if(!e)return 0;const y=s.year-e.y;if(y>0){e.a=Math.round(e.a*Math.pow(1.04,y));e.y=s.year}return e.a}
defineAct({k:'epargne',g:'money',n:'저축 금고를 쓴다',s:'연 4% 이자. 맡기거나 찾는다',c:()=>free()&&T()>=1818.4&&(inParis()||(urban()&&T()>=1819.5)||T()>=1835)&&(s.money>=50||acSavNow()>0),inter:async()=>{
  const cur=acSavNow(),cap=T()>=1845.5?1500:T()>=1835.5?3000:1e9,room=Math.max(0,cap-cur),q=Math.min(room,Math.round(s.money/4));
  const o=[];if(s.money>=50&&room>=50)o.push({l:'50 맡긴다',s:'',a:'safe',v:50});if(q>50)o.push({l:`${fmt(q)} 맡긴다`,s:'재산의 4분의 1',a:'safe greedy',v:q});if(cur>0)o.push({l:`모두 찾는다`,s:`${acM(cur)}`,a:'',v:-cur});o.push({l:'그만둔다',s:'',a:'',v:0});
  const i=await Q('저축 금고','Caisse d’épargne',`${inParis()?'1818년 들레세르가 세운 파리 저축 금고':'저축 금고'}가 일요일에도 문을 연다. 날품팔이와 하녀도 몇 프랑씩 맡긴다. 맡긴 돈 ${acM(cur)}.${cap<1e9?` 한도는 ${fmt(cap)}프랑이다.`:''}`,o);const v=o[i].v;
  if(v>0){s.money-=v;s.flags.epargne={a:cur+v,y:s.year};say(`저축 금고 통장에 ${acM(v)}을 적었다.`+fx({vord:1,vfam:1}))}else if(v<0){s.money+=-v;s.flags.epargne=null;say(`저축 금고에서 ${acM(-v)}을 찾았다.`)}await done()}});
function acRentP(){const t=T();return t<1789?.9:t<1797.75?Math.max(.25,econ().cur*.8):t<1800?.15:t<1802?.45:t<1814.25?.8:t<1816?.6:t<1830.5?.9:1.05}
function acRent(){const r=s.flags.rente;if(!r)return null;if(r.t0<1797.75&&T()>=1797.75&&!r.cut){r.cut=1;r.p=Math.round(r.p/3);say('1797년 9월, ‘3분의 2 파산’으로 국채의 3분의 2가 휴지 같은 증권으로 바뀌었다. 남은 것은 ‘3분의 1 확정 국채’뿐이다.','big')}return r}
defineAct({k:'rente',g:'money',n:'국채(연금)를 사고판다',s:'액면의 5% 이자. 나라가 갚지 못할 수도',c:()=>free()&&s.age>=18&&(s.money>=500||!!s.flags.rente)&&!(T()>=1793.5&&T()<1795),inter:async()=>{
  const r=acRent(),pr=acRentP(),o=[];
  const due=r?Math.round(r.p*.05*Math.min(5,s.year-r.y)*(T()>=1789.5&&T()<1797.2?econ().cur:1)):0;
  if(due>0)o.push({l:'밀린 이자를 받는다',s:acM(due),a:'safe',v:'i'});const amt=Math.round(s.money/3/100)*100;
  if(amt>=300)o.push({l:`${fmt(amt)}어치를 산다`,s:`시세 ${Math.round(pr*100)}`,a:'greedy',v:'b'});if(r)o.push({l:'모두 판다',s:acM(Math.round(r.p*pr)),a:'',v:'s'});o.push({l:'그만둔다',s:'',a:'safe',v:0});
  const nm=T()<1789?'시청 연금(랑트 쉬르 로텔 드 빌)':T()<1797.75?'공채 대장(그랑 리브르)의 국채':'5% 확정 국채';
  const i=await Q('국채','rentes',`${nm}. 액면 100의 국채가 지금 ${Math.round(pr*100)}에 거래된다.${r?` 지닌 국채는 액면 ${acM(r.p)}.`:''}`,o);const v=o[i].v;
  if(v==='i'){r.y=s.year;say('이자 증서를 끊어 금고 창구에서 돈을 받았다.'+fx({money:due}))}
  else if(v==='b'){const p=Math.round(amt/pr);s.money-=amt;if(r){if(r.y<s.year&&due>0){fx({money:due})}r.p+=p;r.y=s.year;if(T()>=1797.75)r.cut=1}else s.flags.rente={p,y:s.year,t0:T(),cut:T()>=1797.75?1:0};say(`${acM(amt)}로 액면 ${acM(p)}의 국채를 샀다.`+fx({trade:1}))}
  else if(v==='s'){const g=Math.round(r.p*pr)+due;s.flags.rente=null;say('증권 중개인에게 국채를 넘겼다.'+fx({money:g,trade:1}))}await done()}});
defineAct({k:'shop',g:'money',n:'가게를 연다',s:'조건을 갖춘 가게 자리로 옮긴다',c:()=>acTown()&&s.age>=20&&s.age<60&&s.money>=400&&!(job()&&job().t>=4)&&!soldier()&&!deputy(),inter:async()=>{
  const ids=['pe3a','pe3i','c3b','c3p','c3t','c3s','c3','c4','pe2v'].filter(id=>POST[id]&&id!==s.job&&meets(POST[id]));
  if(!ids.length){say('가게 자리를 알아보았지만 밑천과 솜씨가 모자랐다.'+fx({trade:1}));return}
  const i=await Q('가게','boutique','가게 자리를 알아보았다. 어떤 가게를 열 것인가?',ids.map(id=>({l:pname(POST[id]),s:[`연 ${fmt(POST[id].pay)}`,needText(POST[id])].filter(Boolean).join(' · '),a:'work greedy'})).concat([{l:'그만둔다',s:'',a:'safe'}]));
  if(i<ids.length)takeJob(ids[i],'가게를 열고 ');else say('가게는 다음에 열기로 했다.');await done()}});

/* ---------- 정치와 시민 ---------- */
defineAct({k:'paper',g:'politics',n:'카페에서 신문을 읽는다',s:'재산 5. 역사·지리 +2. 신문 논조에 물든다',cost:5,c:()=>acTown()&&lit(),f:()=>{const t=T();const P=t<1789.4?[['관보 『가제트 드 프랑스』',0],['『메르퀴르 드 프랑스』의 문예란',0],['첫 일간지 『주르날 드 파리』',0,()=>t>=1777],['런던에서 오는 『쿠리에 드 뢰롭』',1,()=>t>=1776]]
  :t<1792.6?[['마라의 『인민의 벗』',4],['『파리의 혁명』',3],['브리소의 『프랑스 애국자』',2],['왕당파의 『사도행전』',-3],['『왕의 벗』',-3]]
  :t<1794.6?[['에베르의 『뒤셴 영감』',5,()=>t<1794.25],['데물랭의 『옛 코르들리에』',-1,()=>t>=1793.9&&t<1794.1],['관보 『모니퇴르』',1]]
  :t<1799.9?[['『모니퇴르』',0],['바뵈프의 『인민의 호민관』',4,()=>t<1796.4],['왕당파의 『코티디엔』',-3],['『법의 벗』',0]]
  :t<1814.3?[['『모니퇴르』',0],['『주르날 드 랑피르』',0,()=>t>=1805.5],['『주르날 데 데바』',-1,()=>t<1805.5]]
  :t<1830.6?[['자유파의 『콩스티튀시오넬』',2],['『주르날 데 데바』',0],['극우 왕당파의 『코티디엔』',-3],['『드라포 블랑』',-3]]
  :[['공화파의 『나시오날』',3],['지라르댕의 싸구려 일간지 『프레스』',0,()=>t>=1836.5],['『시에클』',1,()=>t>=1836.5],['도미에의 풍자화가 실린 『샤리바리』',2,()=>t>=1832.9],['『주르날 데 데바』',-1]];
  const p=pick(P.filter(x=>!x[2]||x[2]()));say(`카페에서 ${p[0]}${bat(p[0].replace(/[』)]$/,''))?'을':'를'} 돌려 읽었다. ${t>=1800&&t<1814.3?'검열을 거친 기사뿐이다.':t>=1789.4&&t<1794.6?'목청 큰 사람이 소리 내어 읽고 다들 거들었다.':'신문 한 부를 열 사람이 돌려 본다.'}`+fx({money:-5,khist:2,kphil:1,pol:p[1]}))}});
defineAct({k:'petition',g:'politics',n:'청원서를 쓴다',s:'글솜씨 판정. 이웃 평판·영향력',c:()=>free()&&lit()&&s.age>=18,inter:async()=>{
  const {m,why}=md([[s.sk.pen>=35,1,'글솜씨'],[(s.kn.klaw||0)>=25,1,'법을 앎'],[s.fame>=30,1,'명성'],[s.rep.rloc>=65,1,'이웃의 서명'],[s.sk.pen<10,-1,'서툰 글']]);const r=await roll(m,{label:'청원',why});const ok=r.v>=4,t=T();
  const what=t<1789?'지방 감독관에게 도로 부역을 덜어 달라는 청원(플라세)을 올렸다.':t<1789.35?'삼부회 진정서(카이에 드 돌레앙스)에 마을의 고충을 적어 넣었다.':t<1800?'의회에 청원서를 보냈다. 시민이면 누구나 청원할 수 있다.':t<1814.3?'도지사에게 마을 다리를 고쳐 달라는 청원서를 냈다.':'하원에 청원서를 보냈다. 청원 위원회가 의사당에서 읽는다.';
  say(what+(ok?' 회답이 왔고 고을에서 이름이 났다.':' 아무 회답도 없었다.')+fx(ok?{rloc:3,fame:1,inf:1,pen:1,sus:inTerror()&&s.pol<20?3:0}:{pen:1}))}});
defineAct({k:'garde',g:'politics',n:'국민방위대 근무를 선다',s:'재산 20. 무예·이웃 평판·영향력 +',cost:20,c:()=>free()&&isM()&&s.age>=18&&s.age<60&&!soldier()&&!deputy()&&((T()>=1789.54&&T()<1795.8)||(T()>=1830.58&&T()<1848.15)),f:()=>{const t=T();
  say((t<1792.6?'라파예트의 국민방위대 군복을 맞춰 입고 시청 앞에서 보초를 섰다. 군복값은 제 돈이다.':t<1795.8?'창을 든 구민들과 함께 구 국민방위대의 밤 순찰을 돌았다.':'7월 왕정의 국민방위대 사열에 나갔다. 근무를 빠지면 ‘강낭콩 호텔’ 영창에 갇힌다.')+fx({money:-20,arms:2,cour:1,rloc:2,inf:1,pol:t<1796?2:-1,vord:1}))}});
const acVote=()=>{const t=T();if(!isM())return null;if(t>=1789.05&&t<1789.35&&s.age>=25)return 'eg';if(t>=1790&&t<1792.75&&s.age>=25&&(s.estate!=='peasant'||s.land>0||s.money>=100))return 'act';if(t>=1792.6&&t<1792.75&&s.age>=21)return 'act';
  if(t>=1795.7&&t<1799.4&&s.age>=21)return 'prim';if([1800,1802,1804].includes(s.year)&&s.age>=21)return 'pleb';if(t>=1815.3&&t<1815.45&&s.age>=21)return 'pleb';
  if(t>=1815.6&&t<1848.15&&s.age>=(t<1831?30:25)&&(s.land>=(t<1831?300:200)||s.money>=(t<1831?20000:12000)))return 'cens';return null};
defineAct({k:'vote',g:'politics',n:'선거 집회에 나간다',s:'한쪽에 표를 던진다',c:()=>free()&&!!acVote(),inter:async()=>{const k=acVote();
  if(k==='pleb'){const i=await Q('국민투표','plébiscite',`${s.year===1800?'새 헌법(통령정부)':s.year===1802?'종신 통령':s.year===1804?'제정':'제국 헌법 추가법'}에 찬성하는지 시청 명부에 이름과 함께 ‘예’나 ‘아니오’를 적는다. 비밀투표가 아니다.`,[{l:'‘예’라고 적는다',s:'',a:'safe'},{l:'‘아니오’라고 적는다',s:'',a:'bold radical'}]);
    if(i===0)say('‘예’라고 적었다.'+fx({vord:1,sus:-1}));else say('‘아니오’라고 적었다. 서기가 그대를 한 번 쳐다보았다.'+fx({vlib:2,sus:3}));await done();return}
  const intro={eg:'삼부회 대표를 뽑는 본당 집회에 나갔다. 세금을 내는 스물다섯 살 넘은 남자들이 모였다.',act:'능동시민 자격으로 1차 선거 집회에 나갔다.',prim:'총재정부의 1차 선거 집회에 나갔다.',cens:'세금을 많이 내는 선거인들만 모이는 선거 집회에 나갔다. 프랑스 전체에 몇만 명뿐이다.'}[k];
  const i=await Q('선거','assemblée électorale',intro,[{l:'개혁·급진 쪽 후보를 민다',s:'',a:'radical'},{l:'온건한 후보를 민다',s:'',a:'safe'},{l:'왕정·교회 쪽 후보를 민다',s:'',a:'royal pious'}]);
  say(['개혁파 후보를 위해 목청을 높였다.','온건한 공증인을 밀었다.','교회와 질서를 지키겠다는 후보를 밀었다.'][i]+fx({pol:[4,0,-4][i],inf:1,orat:1,soc:1,bch:[2,-1,-2][i]}));await done()}});

/* ---------- 위험한 선택 ---------- */
defineAct({k:'poach',g:'risk',n:'밀렵을 한다',s:'고기와 돈. 붙잡히면 벌금이나 갤리선',c:()=>free()&&!noble()&&!urban()&&s.age>=14&&s.age<60,inter:async()=>{const pre=T()<1789.6;
  const {m,why}=md([[s.st.dex>=45,1,'솜씨'],[s.sk.arms>=30,1,'총 솜씨'],[s.st.str<25,-1,'힘 부족']]);const r=await roll(m,{label:'밀렵',why});
  if(await chance(pre?(r.v>=4?.08:.16):.06,'산림 감시인에게 발각',pre?'영주 사냥터 밀렵 적발 비율':'남의 땅 밀렵 적발 비율')){
    if(pre&&s.flags.poached&&isM()){s.cond='prison';s.prisonKind='plain';s.condSince=T();loseJob();say('두 번째로 붙잡혔다. 영주 법정이 갤리선 노역형을 내렸다.'+fx({sus:8,rpeople:2}),'big');return}
    s.flags.poached=1;say((pre?'영주의 산림 감시인에게 붙잡혔다. 영주 법정에서 벌금을 물었다.':'치안판사 앞에 끌려가 벌금을 물었다.')+fx({money:-Math.round(Math.min(s.money,pre?100:40)),sus:4,rloc:-1}));return}
  say((r.v>=4?'올가미에 토끼가 셋이나 걸렸다. 장날에 몰래 팔았다.':'밤새 숲에 엎드렸다가 꿩 한 마리를 잡았다.')+fx({money:r.v>=4?15:4,hp:2,cour:1,rpeople:1,veq:pre?1:0}))}});
defineAct({k:'fauxsel',g:'risk',n:'소금을 밀수한다',s:'큰돈. 붙잡히면 갤리선',c:()=>free()&&T()<1790.2&&!noble()&&s.age>=14&&s.age<60&&['bretagne','vendee','normandie','auvergne','gascogne','nantes'].includes(loc()),inter:async()=>{
  const {m,why}=md([[s.st.str>=50,1,'힘'],[s.st.cour>=50,1,'의지'],[s.rep.rloc>=60,1,'마을이 숨겨 줌'],[s.st.str<25,-1,'힘 부족']]);const r=await roll(m,{label:'소금 밀수',why});
  const where=['bretagne','nantes'].includes(loc())?'소금세가 없는 브르타뉴에서 산 소금을 지고 멘 지방 경계를 넘었다.':loc()==='vendee'?'소금세가 가벼운 푸아투에서 앙주로 소금 자루를 날랐다.':'소금세가 무거운 고을로 소금 자루를 지고 밤길을 걸었다.';
  if(await chance(r.v>=4?.08:.18,'소금 감시대에 발각','소금 밀수꾼 적발 비율')){
    if(isM()&&s.age>=18){s.cond='prison';s.prisonKind='plain';s.condSince=T();loseJob();say(where+' 감시대에 붙잡혀 갤리선 노역형을 받았다.'+fx({sus:10,rpeople:3}),'big')}
    else say(where+' 감시대에 붙잡혔다. 매를 맞고 벌금을 물었다.'+fx({hp:-6,money:-Math.round(Math.min(s.money,50)),sus:5}));return}
  say(where+' 이익이 반 년치 품삯이었다.'+fx({money:ri(40,90),str:1,cour:1,rpeople:2}))}});
