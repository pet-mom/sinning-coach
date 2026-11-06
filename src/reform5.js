/* ================= 개편 5: 혁명의 사람들 =================
   1789~1794년 파리. 당통 · 로베스피에르 · 데물랭 · 생쥐스트가 주인공 앞에 나타나 관계를 맺고,
   네 사람 사이의 우정과 균열(데물랭과 당통의 코르들리에, 로베스피에르와 데물랭의 옛 우정, 로베스피에르와 생쥐스트, 당통과 로베스피에르의 결별)이 눈앞에서 드러난다.
   오랜 벗 에티엔도 로베스피에르·데물랭과 관계를 맺는다.
   - 1758년생: 로베스피에르·데물랭은 이미 루이르그랑 시절의 벗이다(bonds 카드). 당통과 생쥐스트만 새로 만나고, 선택지는 두 사람이 벗이라는 전제에서 나온다.
   - 그 밖의 생: 네 사람 모두 실존 인물로 관계 목록에 들어온다(죽음은 역사대로).
   장면은 날짜 창 안에서 차례로, 장면 사이를 두 달 이상 띄워서 나온다. */

const RV_F=()=>s&&s.by===1758&&typeof rfRDon==='function'&&rfRDon()&&bfMet('robespierre');
const RV_BFK={robespierre:1,desmoulins:1};
// 사람 찾기: 1758년생이면 로베스피에르·데물랭은 오랜 벗 카드, 아니면 실존 인물 관계
function rvR(k){if(RV_F()&&RV_BFK[k])return bfR(k);return (s.rel||[]).find(r=>r.pid===k)||null}
function rvMeet(k,role,o={}){let r=rvR(k);if(r)return r;const p=PBY[k];if(!p)return null;s.rel=s.rel||[];
  r={pid:p.id,n:p.n,role:role||'지인',sex:p.sex,fac:at(p.fac),close:o.close??45,trust:o.trust??40,resp:o.resp??50,riv:o.riv??5,y:s.year,alive:true,v:p.v||'vjus',inf:at(p.inf)||0,tr:null,w:o.w||''};
  s.rel.push(r);try{r.bd=relBond(r)}catch(e){}return r}
function rvRel(k,o){const r=rvR(k);if(!r)return;if(RV_F()&&RV_BFK[k]){bfRel(k,o);return}for(const x in o)r[x]=clamp((r[x]||0)+o[x],0,100);try{r.bd=relBond(r)}catch(e){}}
const rvAlive=k=>{const r=rvR(k);return !!(r&&r.alive)};
// 부르는 이름: 가까워지면 이름으로 부른다
function rvN(k){const r=rvR(k);if(k==='robespierre')return RV_F()||(r&&r.close>=62)?'막시밀리앙':'로베스피에르';if(k==='desmoulins')return RV_F()||(r&&r.close>=55)?'카미유':'데물랭';return {danton:'당통',saintjust:'생쥐스트'}[k]||''}
const rvI=k=>jo(rvN(k),'이','가'),rvU=k=>jo(rvN(k),'은','는'),rvL=k=>jo(rvN(k),'을','를'),rvW=k=>jo(rvN(k),'과','와');
const rvEt=()=>bfMet('etienne')&&bfAlive('etienne')&&!bfR('etienne').cut&&bfR('etienne').cond==='normal';
function rvMem(id,ks,t,o){try{bfMem(id,ks,t,o)}catch(e){}}

const RV=[];
const rv=(id,a,b,c,run)=>RV.push({id,a,b,c,run});
function rvOn(){return s&&!s.dead&&typeof bfRev==='function'&&bfRev()&&!child()&&s.age>=15&&inParis()&&s.cond==='normal'}
async function rvTick(){if(!rvOn()||sheetLive)return;s.rv=s.rv||{d:{},nx:0};const t=T(),now=MI();
  for(const x of RV){if(s.rv.d[x.id])continue;if(t>=x.b){s.rv.d[x.id]='miss';continue}if(t<x.a)continue;
    if(now<s.rv.nx)return;let ok=false;try{ok=x.c()}catch(e){}if(!ok)continue;
    s.rv.d[x.id]=s.year;s.rv.nx=now+2;try{await x.run()}catch(e){console.error('rv',x.id,e);sheetClose()}return}}
{const _rd=rfDaily;rfDaily=async function(){await _rd();if(!s||s.dead)return;try{await rvTick()}catch(e){console.error(e)}}}

/* ---------- 1789 ---------- */
// 7월 12일, 팔레루아얄 (1758년생은 이미 ds_leaf 장면이 있다)
rv('rv_palais',1789.45,1789.6,()=>!RV_F(),async()=>{
  await bfScene('푸아 카페의 탁자','le 12 juillet','7월 12일 일요일, 팔레루아얄. 네케르가 파면되었다는 소식에 정원이 들끓는다. 푸아 카페 앞 탁자 위로 마른 청년 하나가 뛰어오른다. 처음에는 말을 더듬더니, 이내 목소리가 터져 나온다. “시민들이여, 무기를 들라!” 그는 권총을 흔들며 마로니에 잎을 따 모자에 꽂는다. 희망의 빛, 초록이라고. 사람들이 너도나도 나뭇잎을 딴다.',[
   {l:'잎을 따서 모자에 꽂고 그 청년 곁으로 다가간다',a:'radical bold',f:()=>{rvMeet('desmoulins','지인',{close:52,trust:45});rvMem('m_rv_palais','desmoulins','1789년 7월 12일, 팔레루아얄 푸아 카페 앞에서 탁자 위의 청년이 무기를 들라고 외쳤다. 당신은 마로니에 잎을 모자에 꽂고 그에게 다가갔다. 카미유 데물랭이라고 했다.',{tone:'희망',place:'팔레루아얄'});
     say('탁자에서 뛰어내린 청년은 숨을 헐떡이며 당신 모자의 잎을 보고 웃었다. “카, 카미유 데물랭이오. 변호사인데… 손님이 없소.” 그 말에 둘 다 웃음을 터뜨렸다. 그날 밤 정원의 나무들은 잎이 반쯤 뜯겨 있었다.'+fx({pol:4,cour:1,fame:1}),'big')}},
   {l:'떨어질까 봐 탁자를 붙잡아 준다',a:'social',f:()=>{rvMeet('desmoulins','지인',{close:48,trust:50});rvMem('m_rv_palais','desmoulins','1789년 7월 12일, 팔레루아얄 푸아 카페 앞에서 연설하던 청년의 흔들리는 탁자를 붙잡아 주었다. 카미유 데물랭이라고 했다.',{tone:'기쁨',place:'팔레루아얄'});
     say('연설이 끝나자 청년은 탁자를 붙잡은 당신을 내려다보았다. “당신이 없었으면 혁명보다 내 코가 먼저 부러졌을 거요.” 그는 당신 손을 꽉 쥐고 군중 속으로 사라졌다. 이름은 데물랭이라고 했다.'+fx({pol:2,soc:1}))}},
   {l:'인파에서 빠져나와 집으로 간다',a:'safe',f:()=>{rvMem('m_rv_palais','desmoulins','1789년 7월 12일, 팔레루아얄에서 한 청년이 무기를 들라고 외쳤다. 당신은 인파를 빠져나와 집으로 갔다.',{tone:'두려움',place:'팔레루아얄'});
     say('골목 끝에서 뒤돌아보니 정원 위로 나뭇잎이 흩날리고 있었다. 그날 밤 멀리서 경종이 울렸다. 이틀 뒤, 그 청년의 이름이 온 파리에 퍼졌다. 카미유 데물랭.'+fx({pol:-1}))}}])});

// 브르타뉴 클럽(자코뱅): 로베스피에르, 그리고 에티엔
rv('rv_breton',1789.6,1790.2,()=>true,async()=>{const F=RV_F(),et=rvEt(),E=et?bN('etienne'):null;
  const T0=F?`생토노레 거리의 자코뱅 수도원. ${et?`${bI('etienne')} 당신 소매를 잡아끈다. “아라스 의원이 오늘 말한대. 네가 학교 때 친구였다며? 소개해 줘.” `:''}연단의 막시밀리앙은 루이르그랑 시절과 똑같이 반듯한 머리에 초록 안경을 쓰고 있다. 목소리는 작고, 뒷자리 의원들은 떠든다. 연설을 마치고 내려온 그가 당신을 알아보고 아주 잠깐 웃는다.`
    :`${et?`${bI('etienne')} 당신을 생토노레 거리의 자코뱅 수도원으로 끌고 간다. “오늘 아라스 의원이 말한대. 들어 봐.” `:'생토노레 거리의 옛 자코뱅 수도원. '}연단에 오른 사람은 키가 작고, 분 바른 머리를 반듯하게 빗었으며, 초록 안경을 쓰고 있다. 목소리는 작다. 뒷자리 의원들이 웃고 떠든다. 그래도 그는 원고에서 눈을 떼지 않는다. 투표권은 재산이 아니라 사람에게 있어야 한다고 말하고 있다. 로베스피에르라는 이름이다.`;
  await bfScene('작은 목소리','les Jacobins',T0,[
   F?{l:et?`${bL('etienne')} 막시밀리앙에게 소개한다`:'다가가 어깨를 두드린다',a:'social',f:()=>{rvRel('robespierre',{close:4,trust:3});if(et){bfSet('etienne','maxFan');bfRel('etienne',{close:4});rvMem('m_rv_breton',['robespierre','etienne'],`자코뱅 수도원에서 ${bL('etienne')} 막시밀리앙에게 소개했다. ${bU('etienne')} 그날 밤 한숨도 자지 못했다고 했다.`,{tone:'기쁨',their:'그 사람 덕에 그분 손을 잡았다. 내 인생이 거기서 갈라졌다.'})}
     say(et?`“루이르그랑에서 같이 굶던 사이야.” 당신 말에 막시밀리앙은 드물게 소리 내어 웃었다. 그는 ${bN('etienne')}의 손을 오래 잡고 어디 구에 사는지, 무엇을 읽는지 물었다. 돌아오는 길에 ${bU('etienne')} 말이 없었다. 집 앞에서야 겨우 입을 열었다. “저 사람이 세상을 바꿀 거야.”`:'막시밀리앙은 어깨를 두드린 손을 내려다보더니 작게 말했다. “여기서는 의원이라고 부르게.” 그러고는 웃었다. 루이르그랑 기숙사의 그 얼굴이었다.')}}
    :{l:'연설이 끝나자 다가가 인사한다',a:'social radical',f:()=>{rvMeet('robespierre','지인',{close:45,trust:45,resp:60});rvMem('m_rv_breton','robespierre','자코뱅 수도원에서 아라스 의원 로베스피에르에게 인사했다. 그는 당신 이름과 구를 수첩에 적었다.',{tone:'의문'});if(et){bfSet('etienne','maxFan');bfRel('etienne',{close:3})}
     say(`로베스피에르는 당신 이름을 묻더니 작은 수첩에 적었다. 무엇을 하는 사람인지, 어느 구에 사는지, 무엇을 읽는지도 물었다. 대답할 때마다 그는 고개를 끄덕였다. 칭찬도, 웃음도 없었다. ${et?`옆에서 ${bU('etienne')} 그 수첩을 경건한 눈으로 바라보고 있었다.`:'수첩이 닫히는 소리가 이상하게 오래 귀에 남았다.'}`+fx({pol:2}))}},
   {l:F?'멀리서 박수만 치고 나온다':'뒷자리에서 날카로운 질문을 던진다',a:F?'safe':'bold',f:()=>{if(F){rvMem('m_rv_breton','robespierre','자코뱅 수도원에서 막시밀리앙의 연설을 멀리서 들었다. 박수만 치고 나왔다.',{tone:'그리움'});say('나오는 길에 뒤돌아보니 막시밀리앙이 회랑 끝에서 당신 쪽을 보고 있었다. 손을 들어 보였지만, 그는 이미 다른 의원에게 둘러싸여 있었다. 기숙사 시절에는 둘 사이에 아무도 없었다.')}
     else{rvMeet('robespierre','지인',{close:38,trust:35,resp:62,riv:12});rvMem('m_rv_breton','robespierre','자코뱅 수도원에서 로베스피에르에게 재산 없는 사람도 투표하면 누가 질서를 지키느냐고 물었다.',{tone:'의문'});
       say('“가난한 사람이 투표하면 누가 질서를 지킵니까?” 회의장이 술렁였다. 로베스피에르는 안경을 고쳐 쓰고 당신 쪽을 정확히 바라보았다. “질서를 무너뜨리는 것은 굶주림이지 투표가 아니오.” 박수가 터졌다. 연설이 끝나고 그는 당신 이름을 물었다.'+fx({orat:1,fame:1}))}if(et)bfRel('etienne',{close:-2})}},
   et?{l:`${bN('etienne')}만 남겨 두고 먼저 나온다`,a:'safe',f:()=>{bfSet('etienne','maxFan');rvMem('m_rv_breton2','etienne',`자코뱅 수도원에 ${bL('etienne')} 남겨 두고 먼저 나왔다. 그날부터 ${bU('etienne')} 거의 매일 밤 그곳에 갔다.`,{tone:'의문'});
     say(`${bU('etienne')} 당신이 나가는 것도 몰랐다. 이튿날 아침, 그는 클럽 회원증을 자랑스럽게 내밀었다. 회비는 한 해 24리브르였다. 그 돈이면 석 달 치 빵값이라는 것을, 당신은 말하지 않았다.`)}}:null])});

/* ---------- 1790 ---------- */
rv('rv_danton',1790.0,1790.9,()=>true,async()=>{const F=RV_F(),cm=rvR('desmoulins')&&(F||rvR('desmoulins').close>=45);
  rvMeet('danton','지인',{close:45,trust:40,resp:55});
  await bfScene('코르들리에의 거인','les Cordeliers',`${cm?`${rvI('desmoulins')} 당신을 코르들리에 수도원으로 데려간다. “내 친구를 소개하지. 이 동네 사람들은 그 사람 목소리 하나로 산다네.” `:'코르들리에 수도원의 집회. '}연단에 선 사내는 황소 같은 어깨에 얼굴이 마맛자국과 흉터로 얽혀 있다. 그가 입을 열자 천장이 울린다. 당통이다. 연설이 끝나자 그는 땀을 닦으며 성큼성큼 내려와${cm?` ${rvL('desmoulins')} 번쩍 들어 안더니, 당신을 내려다본다. “카미유 친구면 내 친구지.”`:' 당신 앞에 선다. “처음 보는 얼굴이군. 마시러 가지.”'}`,[
   {l:'프로코프에서 그와 포도주를 마신다',a:'social',f:()=>{rvRel('danton',{close:10,trust:6});rvMem('m_rv_danton',['danton'].concat(cm?['desmoulins']:[]),`코르들리에 집회가 끝나고 당통과 카페 프로코프에서 포도주를 마셨다.${cm?' 카미유는 당통의 무릎에 다리를 올리고 시를 읊었다.':''}`,{tone:'기쁨',place:'카페 프로코프'});
     say(`당통은 포도주를 물처럼 마셨다. 혁명 이야기보다 아르시의 강가, 아내 가브리엘의 요리, 어릴 때 황소에게 받혀 입술이 찢어진 이야기를 더 많이 했다. ${cm?`카미유는 그 옆에서 깔깔 웃으며 당통의 잔에 자기 잔을 부딪쳤다. 두 사람은 형제 같았다. `:''}계산은 당통이 했다. 어디서 난 돈인지는 아무도 묻지 않았다.`+fx({soc:2,money:-2}))}},
   {l:'“그 돈은 어디서 나오오?” 하고 묻는다',a:'bold',f:()=>{rvRel('danton',{resp:6,riv:6});rvMem('m_rv_danton','danton','코르들리에에서 처음 만난 당통에게 그 많은 돈이 어디서 나오느냐고 물었다. 그는 크게 웃었다.',{tone:'의문'});
     say(`당통은 잠시 당신을 내려다보더니 천장이 울리도록 웃었다. “좋아! 이 동네엔 그런 질문을 하는 놈이 없어서 심심했지.” 그는 당신 어깨를 툭 쳤다. 손바닥이 쟁반만 했다. 대답은 끝내 하지 않았다.${cm?` 카미유가 당신 귀에 속삭였다. “그런 건 묻는 게 아니야.”`:''}`+fx({cour:1}))}},
   {l:'정중히 인사만 하고 물러난다',a:'safe',f:()=>{rvMem('m_rv_danton','danton','코르들리에 집회에서 당통을 처음 보았다. 정중히 인사만 하고 물러났다.',{tone:'의문'});
     say('당통은 어깨를 으쓱하고 다른 무리 속으로 들어갔다. 그가 지나가는 곳마다 사람들이 웃음을 터뜨렸다. 저 사내는 사람을 끌어당기는 법을 안다고, 당신은 생각했다. 그리고 그런 사람을 조심해야 한다는 것도.')}}])});

rv('rv_etcam',1790.3,1791.5,()=>rvEt()&&rvAlive('desmoulins')&&(RV_F()||(rvR('desmoulins')&&rvR('desmoulins').close>=40)),async()=>{const E=bN('etienne');
  await bfScene('신문의 한 단','les Révolutions de France et de Brabant',`${bI('etienne')} 인쇄소 잉크가 덜 마른 신문을 흔들며 뛰어든다. 『프랑스와 브라방의 혁명』 최신 호, 그 셋째 단에 ${E}의 글이 실렸다. ${rvU('desmoulins')} 교정쇄에 “이 친구, 쓸 줄 안다”고 적어 보냈다고 한다. 그런데 글 끝에 이웃 빵집 주인의 이름이 실명으로 나와 있다. ‘매점매석꾼’이라고.`,[
   {l:'함께 기뻐하며 축하주를 산다',a:'social',f:()=>{bfRel('etienne',{close:6});rvRel('desmoulins',{close:2});bfSet('etienne','camWriter');rvMem('m_rv_etcam',['etienne','desmoulins'],`${E}의 글이 데물랭의 신문에 실렸다. 둘이서 축하주를 마셨다.`,{tone:'기쁨',their:'그날 그 사람이 사 준 포도주가 내 첫 원고료였다.'});
     say(`${bU('etienne')} 그날 밤 신문을 베개 밑에 넣고 잤다고 했다. 이튿날 빵집 주인은 덧문을 내렸다. 사흘 뒤 다시 열었을 때, 진열대 유리에 금이 가 있었다.`+fx({soc:1}))}},
   {l:'“이름까지 실은 건 너무했어.”라고 말한다',a:'social',f:()=>{bfRel('etienne',{close:-2,resp:4});rvMem('m_rv_etcam',['etienne','desmoulins'],`${E}의 글이 데물랭의 신문에 실렸다. 빵집 주인의 이름까지 실은 건 너무했다고 말했다.`,{tone:'씁쓸함',their:'그 사람 말이 맞았다. 그 빵집 유리를 볼 때마다 생각났다. 그래도 그때는 인정할 수 없었다.'});
     say(`${bU('etienne')} 얼굴이 굳었다. “카미유는 이름을 대야 사람들이 움직인다고 했어.” 그날 저녁, 당신은 빵집 앞을 지나다 주인과 눈이 마주쳤다. 그는 당신이 그 글을 쓴 사람의 친구라는 것을 알고 있었다.`)}},
   {l:'신문사에 같이 가서 데물랭을 직접 만나 본다',a:'study social',f:()=>{rvRel('desmoulins',{close:6});bfRel('etienne',{close:3});bfSet('etienne','camWriter');rvMem('m_rv_etcam',['etienne','desmoulins'],`${bW('etienne')} 데물랭의 신문사에 갔다. 카미유는 두 사람에게 다음 호 원고를 맡겼다.`,{tone:'희망'});
     say(`신문사는 테아트르프랑세 거리의 좁은 방이었다. 카미유는 잉크 묻은 손으로 두 사람을 끌어안더니 다음 호 원고 두 단을 맡겼다. “마감은 내일이야. 맞춤법은 안 봐.” 그날 밤 ${bW('etienne')} 당신은 촛불 하나로 새벽까지 썼다.`+fx({pen:2,pol:2}))}}])});

rv('rv_wed',1790.9,1791.1,()=>!RV_F()&&rvAlive('desmoulins')&&rvR('desmoulins').close>=50,async()=>{
  await bfScene('생쉴피스의 증인들','les noces',`12월 29일, 생쉴피스 성당. ${rvU('desmoulins')} 뤼실 뒤플레시와 혼례를 올린다. 하객석 맨 앞, 증인 자리에 ${rvR('robespierre')?jo(rvN('robespierre'),'이','가'):'아라스 의원 로베스피에르가'} 앉아 있다. 카미유가 루이르그랑 시절부터의 벗이라며 꼭 증인이 되어 달라고 했다고 한다. 미사 내내 신랑이 운다. 로베스피에르는 신랑의 어깨에 손을 얹은 채 끝까지 표정을 바꾸지 않는다.`,[
   {l:'혼례 뒤 두 사람에게 다가가 함께 축배를 든다',a:'social',f:()=>{rvMeet('robespierre','지인',{close:42});rvRel('desmoulins',{close:5});rvRel('robespierre',{close:5,trust:3});rvMem('m_rv_wed',['desmoulins','robespierre'],'생쉴피스에서 카미유와 뤼실의 혼례를 보았다. 증인 로베스피에르와 함께 축배를 들었다.',{tone:'기쁨',place:'생쉴피스 성당'});
     say('카미유가 당신을 로베스피에르에게 소개했다. “막시밀리앙, 이 사람은 내 탁자를 붙잡아 준 사람이야.” 로베스피에르는 물 탄 포도주 잔을 살짝 들었다. 카미유가 둘의 잔을 억지로 부딪치게 했다. 그날 로베스피에르는 두 번 웃었다. 두 번 다 카미유 때문이었다.'+fx({soc:2}))}},
   {l:'뒷자리에서 조용히 지켜본다',a:'safe',f:()=>{rvRel('desmoulins',{close:2});rvMem('m_rv_wed','desmoulins','생쉴피스에서 카미유와 뤼실의 혼례를 뒷자리에서 지켜보았다.',{tone:'그리움',place:'생쉴피스 성당'});
     say('뒷자리에서 보니 증인석의 로베스피에르가 신랑 쪽으로 몸을 약간 기울이고 있었다. 무언가 귓속말을 하자 카미유가 울다 말고 웃었다. 저 두 사람은 오래된 사이라는 것을, 그 몸짓 하나로 알 수 있었다.')}}])});

/* ---------- 1791 ---------- */
rv('rv_duplay',1791.5,1791.75,()=>rvAlive('robespierre')&&(RV_F()||(rvR('robespierre')&&rvR('robespierre').close>=40)),async()=>{const F=RV_F();
  await bfScene('목수의 집','chez Duplay',`7월 17일, 샹드마르스에서 국민방위대가 청원자들에게 총을 쏘았다. 그날 밤 생토노레 거리. ${F?'막시밀리앙이':'로베스피에르가'} 골목에서 사람들에게 둘러싸여 있다. 붙잡힐지도 모르는 밤이다. 그때 목수 뒤플레가 문을 열고 그를 자기 집으로 들인다. 당신은 그 장면을 길 건너에서 보고 있다. ${rvAlive('danton')?'당통은 벌써 영국으로 몸을 피했다는 소문이고, ':''}${rvAlive('desmoulins')?'카미유는 어디 숨었는지 아무도 모른다.':''}`,[
   {l:'뒤플레의 집 문을 두드려 그가 무사한지 확인한다',a:'bold family',f:()=>{rvRel('robespierre',{close:7,trust:8});rvMem('m_rv_duplay','robespierre',`샹드마르스의 밤, 뒤플레 목수의 집에 숨은 ${jo(F?'막시밀리앙':'로베스피에르','을','를')} 찾아가 무사한지 확인했다.`,{tone:'두려움',place:'뒤플레의 집',their:'그날 밤 문을 두드린 사람은 둘이었다. 하나는 경찰, 하나는 그 사람.'});
     say(`뒤플레 부인이 문을 반만 열었다. 안쪽 작업장의 대팻밥 냄새 너머로 그가 보였다. 탁자에 앉아 원고를 쓰고 있었다. “괜찮소.” 그는 펜을 내려놓지도 않고 말했다. 그런데 당신이 돌아서자 그가 한 마디 덧붙였다. “와 줘서 고맙소.” 그는 그 집에서 다시는 나가지 않았다. 마지막 해까지.`+fx({cour:2,sus:2}))}},
   {l:'모르는 척 그 자리를 떠난다',a:'safe',f:()=>{rvMem('m_rv_duplay','robespierre',`샹드마르스의 밤, ${jo(F?'막시밀리앙':'로베스피에르','이','가')} 뒤플레의 집으로 피신하는 것을 보았다. 모르는 척 그 자리를 떠났다.`,{tone:'의문'});
     say('이튿날 들으니 그는 그 목수의 집에 하숙을 정했다고 했다. 2층의 작은 방, 창문은 마당 쪽으로 나 있다고. 그 방이 나중에 파리에서 가장 무거운 방이 되리라는 것을 그때는 아무도 몰랐다.')}}])});

rv('rv_sjletter',1790.5,1792.5,()=>rvAlive('robespierre')&&(RV_F()||(rvR('robespierre')&&rvR('robespierre').close>=48)),async()=>{const F=RV_F();
  await bfScene('블레랑쿠르에서 온 편지','une lettre de Blérancourt',`뒤플레의 집 2층, ${F?'막시밀리앙':'로베스피에르'}의 방. 그가 드물게 들뜬 얼굴로 편지 한 장을 내민다. 피카르디의 작은 마을 블레랑쿠르에서 온 스물셋의 청년이 보낸 것이다. 당신을 신처럼 우러른다고, 당신을 위해서라면 무엇이든 하겠다고, 시장이 서는 날 마을 광장에서 반혁명 소책자를 불태웠다고 적혀 있다. 서명은 생쥐스트.`,[
   {l:'“이런 열성은 무섭기도 해.”라고 말한다',a:'safe',f:()=>{rvRel('robespierre',{resp:4,close:-1});rvMem('m_rv_sjletter','robespierre','블레랑쿠르의 청년 생쥐스트가 보낸 편지를 보았다. 이런 열성은 무섭기도 하다고 말했다.',{tone:'의문'});
     say(`그는 편지를 조심스럽게 접었다. “열성이 무서운 건 그것이 향하는 곳이 틀렸을 때뿐이오.” 그는 그 편지를 서랍이 아니라 가슴 안주머니에 넣었다. 당신은 그 손짓을 오래 기억했다.`)}},
   {l:'“답장해 줘. 그런 사람이 필요하잖아.”라고 말한다',a:'radical',f:()=>{rvRel('robespierre',{close:4,trust:3});rvMem('m_rv_sjletter','robespierre','블레랑쿠르의 청년 생쥐스트가 보낸 편지를 보고 답장하라고 권했다.',{tone:'희망'});
     say(`그는 그날 밤 답장을 썼다. 당신은 옆에서 촛불을 들고 있었다. 짧은 답장이었다. 마지막 줄을 쓰고 나서 그는 펜 끝을 오래 들여다보았다. “이 아이는 나보다 멀리 갈 거요.” 그것이 칭찬인지 걱정인지, 그도 모르는 것 같았다.`+fx({pol:2}))}}])});

/* ---------- 1792 ---------- */
rv('rv_audace',1792.6,1792.85,()=>rvAlive('danton'),async()=>{
  await bfScene('법무장관','le ministre',`9월 초, 프로이센군이 베르됭을 넘었다는 소식. 법무장관이 된 당통이 의회 연단에서 포효한다. 겁먹지 말고, 더 대담하게, 언제나 더 대담하게 나서라고. 같은 시각, 감옥마다 사람들이 끌려 나와 죽고 있다. 이튿날 당신은 장관 관저 앞에서 그를 마주친다. 그의 눈 밑이 검다.`,[
   {l:'“감옥의 일을 막을 수 없었소?”라고 묻는다',a:'bold',f:()=>{rvRel('danton',{resp:4,close:-3});rvMem('m_rv_audace','danton','9월 학살 직후, 법무장관 당통에게 감옥의 일을 막을 수 없었느냐고 물었다.',{tone:'씁쓸함'});
     say(`당통은 대답 대신 오래 당신을 보았다. 그리고 아주 낮게 말했다. “전선이 무너지면 이 도시 전체가 감옥이 되오. 나는 그걸 고른 거요.” 그는 마차에 올랐다. 문이 닫히기 전에 덧붙였다. “당신은 그 질문을 계속하시오. 누군가는 해야 하니까.”`+fx({cour:2}))}},
   {l:'의용군 등록소로 가는 길을 묻는다',a:'radical bold',f:()=>{rvRel('danton',{close:6,trust:4});rvMem('m_rv_audace','danton','9월, 당통의 연설을 듣고 의용군 등록소로 가는 길을 물었다.',{tone:'희망'});
     say(`당통은 당신 어깨를 움켜쥐었다. “바로 그거요!” 그는 비서를 불러 등록소 주소를 적어 주게 했다. ${isM()?'그날 오후 당신은 퐁뇌프의 천막 앞 줄에 섰다. 앞에 선 소년은 열여섯 살이라고 우겼다.':'등록소 앞에서 당신은 의용군에 나가는 이웃 아들들에게 빵과 양말을 나눠 주었다.'}`+fx({pol:4,rpeople:2}))}},
   {l:'고개만 숙이고 지나간다',a:'safe',f:()=>{rvMem('m_rv_audace','danton','9월 학살 직후, 장관 관저 앞에서 지친 당통을 보았다. 고개만 숙이고 지나갔다.',{tone:'의문'});
     say('지나가며 곁눈으로 보니, 그 거구의 사내가 마차 손잡이를 잡은 채 한참 서 있었다. 대담하라고 외치던 사람의 등이 그날은 조금 굽어 보였다.')}}])});

rv('rv_sj',1792.85,1793.1,()=>true,async()=>{const F=RV_F(),mx=rvAlive('robespierre')&&rvR('robespierre');rvMeet('saintjust','지인',{close:35,trust:30,resp:55});
  await bfScene('스물다섯의 의원','Saint-Just',`11월 13일, 국민공회. 왕의 재판을 두고 처음 연단에 오른 의원은 스물다섯이다. 창백하고 잘생긴 얼굴, 높이 맨 넥타이, 한 번도 떨리지 않는 목소리. 그는 왕은 재판받을 피고가 아니라 쓰러뜨릴 적이라고, 왕으로 있었다는 것 자체가 죄라고 말한다. 회의장이 얼어붙는다. 생쥐스트다.${mx?` 연설이 끝나자 그는 곧장 ${F?'막시밀리앙':'로베스피에르'} 곁으로 가서 앉는다. ${jo(F?'막시밀리앙':'로베스피에르','이','가')} 그의 소매를 한 번 두드린다. 아끼는 아우에게 하듯이.`:''}`,[
   {l:'복도에서 그에게 다가가 말을 건다',a:'social bold',f:()=>{rvRel('saintjust',{close:5,resp:4});rvMem('m_rv_sj','saintjust','1792년 11월, 국민공회 복도에서 생쥐스트에게 말을 걸었다. 그는 당신 눈을 똑바로 보았다.',{tone:'두려움'});
     say(`생쥐스트는 걸음을 멈추고 당신 눈을 똑바로 보았다. 스물다섯의 눈이 아니었다. “당신은 어느 편이오?” 첫마디가 그것이었다. 당신이 대답하기도 전에 그는 고개를 끄덕였다. “괜찮소. 곧 알게 될 테니.” 그가 떠난 뒤에야 당신은 숨을 쉬었다.`+fx({cour:1}))}},
   mx?{l:`${F?'막시밀리앙':'로베스피에르'}에게 저 젊은이를 어떻게 보느냐고 묻는다`,a:'social',f:()=>{rvRel('robespierre',{close:3});rvMem('m_rv_sj',['saintjust','robespierre'],'1792년 11월, 생쥐스트의 첫 연설 뒤 로베스피에르에게 그를 어떻게 보느냐고 물었다.',{tone:'의문'});
     say(`그는 대답하기 전에 안경을 벗어 닦았다. “저 아이는 내가 망설이는 곳에서 망설이지 않소.” 그리고 안경을 다시 썼다. “그게 저 아이의 재능이고, 어쩌면 나의 짐이오.” 회의장 건너편에서 생쥐스트가 두 사람 쪽을 보고 있었다.`)}}:null,
   {l:'방청석에서 일어나 나온다',a:'safe',f:()=>{rvRel('saintjust',{riv:3});rvMem('m_rv_sj','saintjust','1792년 11월, 생쥐스트의 첫 연설을 듣다 방청석을 나왔다.',{tone:'두려움'});
     say('바깥 공기는 차가웠다. 왕으로 있었다는 것 자체가 죄라면, 귀족으로 태어난 것은, 부자로 태어난 것은, 잘못된 편에 서 있었던 것은 어떻게 되는가. 당신은 그 생각을 끝까지 하지 않기로 했다.')}}])});

/* ---------- 1793 ---------- */
rv('rv_etmax',1793.2,1793.8,()=>rvEt()&&rvAlive('robespierre')&&bfFl('etienne','maxFan'),async()=>{const E=bN('etienne'),F=RV_F();
  await bfScene('2층의 방','la chambre de Duplay',`${bI('etienne')} 당신을 뒤플레의 집으로 데려간다. 구 감시위원회 위원이 된 ${bU('etienne')} 오늘 처음으로 ${F?'막시밀리앙':'로베스피에르'}의 방에 불려 왔다. 그런데 방 안의 그는 ${E}의 보고서를 한 장씩 넘기며 차갑게 묻는다. “이 이름은 왜 빠졌소, 시민?” ${bI('etienne')} 지워 버린 그 이름이다. ${bHe('etienne')}의 손이 떨린다. ${F?'막시밀리앙이 당신 쪽을 본다. 오랜 벗의 얼굴이 아니다.':''}`,[
   {l:`${E} 편을 들어 “그 사람은 내가 아는 사람이오.”라고 말한다`,a:'bold social',f:()=>{bfRel('etienne',{close:8,trust:10});rvRel('robespierre',{trust:-5});bfKnow('etienne','name',2);rvMem('m_rv_etmax',['etienne','robespierre'],`뒤플레의 방에서 ${jo(E,'이','가')} 지운 이름 때문에 추궁당했다. 당신은 그 사람을 안다고 말했다.`,{tone:'두려움',their:'그 사람이 나 대신 거짓말을 했다. 그분 앞에서. 나는 그날 처음으로 그분이 무서웠다.'});
     say(`방 안이 조용해졌다. 그는 당신을 오래 보더니 보고서를 덮었다. “좋소. 당신 말을 믿겠소. ${F?'자네가 거짓말하는 걸 본 적이 없으니.':'이번에는.'}” 계단을 내려오며 ${bU('etienne')} 당신 팔을 붙잡았다. 손이 얼음장 같았다. “나는 저 사람을 위해서라면 뭐든 할 수 있다고 생각했어.” 그 뒤의 말은 하지 않았다.`+fx({sus:5,cour:2}))}},
   {l:'아무 말 없이 두 사람을 지켜본다',a:'safe',f:()=>{bfRel('etienne',{close:-3});bfKnow('etienne','name',1);rvMem('m_rv_etmax',['etienne','robespierre'],`뒤플레의 방에서 ${jo(E,'이','가')} 추궁당하는 것을 말없이 지켜보았다.`,{tone:'죄책감'});
     say(`${bU('etienne')} 실수였다고, 다음 회의에서 그 이름을 다시 올리겠다고 말했다. 그는 고개를 끄덕이고 다음 장을 넘겼다. 돌아오는 길에 ${bU('etienne')} 한마디도 하지 않았다. 사흘 뒤, 그 이름이 명단에 다시 올랐다.`)}},
   {l:`나와서 ${E}에게 “그 사람을 너무 믿지 마.”라고 말한다`,a:'social',f:()=>{bfRel('etienne',{resp:3,close:-2});bfSet('etienne','warnedMax');rvMem('m_rv_etmax',['etienne','robespierre'],`뒤플레의 집을 나와 ${E}에게 그 사람을 너무 믿지 말라고 했다.`,{tone:'의문',their:'그 사람이 그분을 너무 믿지 말라고 했다. 그때는 화가 났다. 테르미도르에 그 말이 떠올랐다.'});
     say(`${bU('etienne')} 걸음을 멈추고 당신을 노려보았다. “너는 그분을 몰라.” 그러고는 혼자 앞서 걸어갔다. 모퉁이를 돌기 전, ${bHe('etienne')}는 한 번 뒤를 돌아보았다. 그 얼굴에 확신과 의심이 반반 섞여 있었다.`)}}])});

rv('rv_split',1793.7,1794.0,()=>rvAlive('danton')&&rvAlive('robespierre'),async()=>{const F=RV_F(),cm=rvAlive('desmoulins');
  await bfScene('두 사람의 저녁','Danton et Robespierre',`가을, ${cm?'카미유의 집':'팔레루아얄의 식당'}에서 저녁을 먹는다. 아르시에서 돌아온 당통은 새 아내 이야기를 하며 웃고, 맞은편의 ${jo(F?'막시밀리앙':'로베스피에르','은','는')} 물 탄 포도주를 거의 마시지 않는다. 당통이 잔을 들고 말한다. “덕, 덕, 덕. 시민 ${F?'막시밀리앙':'로베스피에르'}, 사람은 덕만으로 살지 않소. 고기도 먹고 여자도 사랑하지.” 웃음이 터진다. 그는 웃지 않는다. 냅킨을 접어 놓고 일어선다.${cm?' 카미유가 두 사람을 번갈아 보며 어쩔 줄 몰라 한다.':''}`,[
   {l:'당통의 농담에 같이 웃는다',a:'social',f:()=>{rvRel('danton',{close:6});rvRel('robespierre',{close:-6,trust:-4});rvMem('m_rv_split',['danton','robespierre'],'당통이 덕을 놀리던 저녁, 당신도 같이 웃었다. 로베스피에르는 냅킨을 접고 일어섰다.',{tone:'씁쓸함'});
     say(`문간에서 그가 돌아보았다. 당신 얼굴에서 웃음이 미처 지워지지 않은 것을, 그는 보았다. 아무 말 없이 나갔다. 당통은 어깨를 으쓱했다. “저 친구는 웃는 법을 아라스에 두고 왔어.” 그날 밤 당신은 그 마지막 눈빛 때문에 잠을 설쳤다.`)}},
   {l:`따라 나가 ${jo(F?'막시밀리앙':'로베스피에르','을','를')} 붙잡는다`,a:'social bold',f:()=>{rvRel('robespierre',{close:6,trust:4});rvRel('danton',{close:-3});rvMem('m_rv_split',['danton','robespierre'],'당통이 덕을 놀리던 저녁, 자리를 뜬 로베스피에르를 따라 나갔다.',{tone:'두려움'});
     say(`어두운 골목에서 그가 말했다. “저 사람은 공화국을 사랑하오. 다만 공화국보다 자기를 더 사랑하지.” 잠시 뒤 덧붙였다. “${cm?'카미유가 걱정이오. 저 사람 곁에 너무 오래 있었소.':'언젠가는 둘 중 하나를 골라야 할 거요.'}” 그것이 그의 결심이었다는 것을, 당신은 몇 달 뒤에야 알았다.`+fx({sus:-2}))}},
   cm?{l:'카미유와 함께 두 사람을 화해시키려 한다',a:'social',f:()=>{const ok=R()<.3;rvRel('desmoulins',{close:6});rvMem('m_rv_split',['danton','robespierre','desmoulins'],`당통과 로베스피에르가 갈라선 저녁, 카미유와 함께 두 사람을 화해시키려 했다.${ok?' 그날은 둘이 다시 잔을 부딪쳤다.':''}`,{tone:ok?'희망':'씁쓸함'});
     say(ok?'카미유가 더듬으며 옛날 이야기를 꺼냈고, 당신이 거들었다. 로베스피에르는 다시 앉았다. 당통이 먼저 잔을 내밀었다. 둘의 잔이 부딪쳤다. 그날 밤은 그것으로 충분해 보였다. 그 뒤로 그런 밤은 다시 오지 않았다.':'카미유는 두 사람 사이를 오가며 말을 더듬었다. 당신이 거들수록 둘의 얼굴은 굳어 갔다. 결국 셋은 각자 다른 문으로 나갔다. 카미유가 계단에 주저앉아 말했다. “어릴 땐 막시밀리앙이 내 숙제를 대신 해 줬어. 알아?”')}}:null])});

rv('rv_vieux',1793.95,1794.15,()=>!RV_F()&&rvAlive('desmoulins')&&rvAlive('robespierre'),async()=>{
  await bfScene('비외 코르들리에','le Vieux Cordelier',`데물랭의 새 신문 『비외 코르들리에』가 파리를 뒤흔든다. 감옥 문을 열고 관용위원회를 만들자고 썼다. 자코뱅 클럽에서 로베스피에르가 일어나, 옛 친구를 감싸듯 말한다. 카미유는 버릇없는 아이일 뿐이니 신문만 태우자고. 카미유가 소리친다. 태우는 것은 대답이 아니라고. 회의장이 술렁인다. ${rvAlive('saintjust')?'맨 앞줄의 생쥐스트가 카미유를 바라본다. 아무 표정도 없이.':''}`,[
   {l:'카미유 곁에 가서 선다',a:'bold',f:()=>{rvRel('desmoulins',{close:10,trust:8});rvRel('robespierre',{close:-5});rvRel('saintjust',{riv:6});rvMem('m_rv_vieux',['desmoulins','robespierre'],'자코뱅 클럽에서 로베스피에르가 『비외 코르들리에』를 태우자고 했을 때, 카미유 곁에 가서 섰다.',{tone:'두려움'});
     say('카미유가 당신을 보고 눈을 크게 떴다. 그는 당신 손을 잡았다. 손바닥이 땀에 젖어 있었다. 연단의 로베스피에르는 두 사람을 오래 내려다보았다. 그 눈빛에 노여움보다 슬픔이 먼저 있었다는 것을, 당신은 나중에야 이해했다.'+fx({sus:8,cour:3}))}},
   {l:'로베스피에르의 말이 옳다고 생각한다',a:'radical',f:()=>{rvRel('robespierre',{close:3});rvRel('desmoulins',{close:-4});rvMem('m_rv_vieux',['desmoulins','robespierre'],'자코뱅 클럽에서 『비외 코르들리에』를 둘러싼 다툼을 보았다. 로베스피에르가 옳다고 생각했다.',{tone:'씁쓸함'});
     say('신문을 태우는 것이 친구를 태우는 것보다 낫다고 당신은 생각했다. 그것이 로베스피에르가 내민 마지막 손이었다는 것을, 카미유는 끝내 잡지 않았다.'+fx({pol:3,sus:-2}))}},
   {l:'회의장을 조용히 빠져나온다',a:'safe',f:()=>{rvMem('m_rv_vieux','desmoulins','자코뱅 클럽에서 『비외 코르들리에』를 둘러싼 다툼을 보다 조용히 빠져나왔다.',{tone:'두려움'});
     say('바깥은 1월의 진눈깨비였다. 등 뒤의 회의장에서 함성이 터졌다. 누구를 위한 함성인지 당신은 돌아보지 않았다.')}}])});

/* ---------- 1794 ---------- */
rv('rv_arrest',1794.15,1794.27,()=>rvAlive('danton')||rvAlive('desmoulins'),async()=>{const F=RV_F(),mx=rvAlive('robespierre'),sj=rvAlive('saintjust'),cm=rvAlive('desmoulins'),et=rvEt();
  await bfScene('3월의 밤','la nuit du 30 mars',`3월 말. ${sj?'생쥐스트가 공안위원회에서 밤새 보고서를 쓰고 있다는 소문이다. 당통과 그 친구들을 겨냥한 보고서라고. ':''}${cm?`뤼실이 당신 집 문을 두드린다. 머리가 헝클어져 있다. “카미유가 위험해요. 막시밀리앙은 카미유의 결혼 증인이었어요. ${F?'당신은 둘의 오랜 벗이잖아요. ':''}부탁해요.” `:''}당통은 도망치라는 권유를 받고도 웃었다고 한다. 조국을 신발 밑창에 묻혀 갈 수는 없다고.${et?` ${bU('etienne')} 구 위원회에서 체포 명령서에 이름을 쓸 사람을 찾고 있다는 말을 들었다.`:''}`,[
   mx?{l:`뒤플레의 집으로 가서 ${F?'막시밀리앙':'로베스피에르'}에게 간청한다`,a:'bold social',f:()=>{const fail=true;rvRel('robespierre',{close:F?-4:-6,trust:-3});rvMem('m_rv_arrest',['robespierre','desmoulins','danton'].filter(rvR),`1794년 3월, 당통파 체포 전날 밤 뒤플레의 집으로 가서 로베스피에르에게 간청했다.`,{tone:'후회'});
     say(`2층 방 창문에 불이 켜져 있었다. 그는 당신 말을 끝까지 들었다. 한 번도 끊지 않았다. 그리고 말했다. “${F?'자네도 나도, 카미유를 사랑하지.':'나도 카미유를 사랑하오.'} 그러나 공화국은 한 사람의 우정보다 크오.” 그의 목소리가 처음으로 갈라졌다. 그날 새벽 당통과 카미유가 체포되었다.`+fx({sus:6,cour:2}),'big')}}:null,
   rvAlive('danton')?{l:'당통의 집으로 달려가 피하라고 말한다',a:'bold',f:()=>{rvRel('danton',{close:8,trust:8});rvMem('m_rv_arrest2','danton','1794년 3월, 체포 전날 밤 당통의 집으로 달려가 피하라고 말했다. 그는 웃었다.',{tone:'후회'});
     say('당통은 잠옷 바람으로 문을 열었다. 당신 말을 듣고 그는 크게 웃었다. “어디로? 국경 너머로? 그 사람들이 감히 나를?” 그는 당신 손에 포도주 잔을 쥐여 주었다. 새벽 여섯 시, 헌병들이 그의 문을 두드렸다. 그는 그때도 웃고 있었다고 한다.'+fx({sus:5}),'big')}}:null,
   et?{l:`${jo(bN('etienne'),'을','를')} 찾아가 명령서에 이름을 쓰지 말라고 한다`,a:'social',f:()=>{const ok=bfR('etienne').close>=55||bfFl('etienne','warnedMax');bfRel('etienne',ok?{close:5,trust:6}:{close:-3});rvMem('m_rv_arrest3','etienne',`1794년 3월, ${jo(bN('etienne'),'을','를')} 찾아가 당통파 체포 명령서에 이름을 쓰지 말라고 했다. ${ok?'그는 그날 밤 위원회에 나가지 않았다.':'그는 이미 서명한 뒤였다.'}`,{tone:ok?'위로':'후회'});
     say(ok?`${bU('etienne')} 오래 창밖을 보다가 외투를 벗어 걸었다. “오늘 밤엔 아프다고 할게.” 명령서에는 다른 사람의 이름이 적혔다. 그래도 그 명령서는 집행되었다. 바뀐 것은 ${bN('etienne')}의 이름 하나뿐이었다. 그것도 무언가이긴 했다.`:`${bU('etienne')} 이미 서명한 뒤였다. 책상 위에 펜이 그대로 놓여 있었다. “카미유 신문에 내 글이 처음 실렸었지.” ${bHe('etienne')}는 그 말만 하고 등을 돌렸다. 어깨가 흔들리고 있었다.`)}}:null,
   {l:'문을 걸어 잠그고 아무것도 하지 않는다',a:'safe',f:()=>{rvMem('m_rv_arrest4',['danton','desmoulins'].filter(rvR),'1794년 3월, 당통과 카미유가 체포되던 밤, 문을 걸어 잠그고 아무것도 하지 않았다.',{tone:'죄책감'});try{bfReg('r_rv_arrest','group','당통과 카미유가 체포되던 밤, 아무것도 하지 않았다.')}catch(e){}
     say(`${cm?'뤼실은 대답 없는 문 앞에 한참 서 있다가 돌아갔다. ':''}새벽에 마차 소리가 났다. 창문 틈으로 보니 헌병들이 골목을 지나가고 있었다. 당신은 촛불을 끄고 침대에 누웠다. 잠은 오지 않았다.`,'dark')}}])});

rv('rv_after',1794.27,1794.5,()=>rvAlive('robespierre')&&rvR('robespierre')&&(RV_F()||rvR('robespierre').close>=40),async()=>{const F=RV_F(),sj=rvAlive('saintjust');
  await bfScene('튈르리의 정원','après Germinal',`4월, 당통과 ${RV_F()?'카미유':'데물랭'}의 목이 떨어진 지 몇 주. 튈르리 정원에서 ${jo(F?'막시밀리앙':'로베스피에르','을','를')} 본다. 개 한 마리를 데리고 혼자 걷고 있다. 예전보다 더 마르고, 더 꼿꼿하다.${sj?' 멀리 정원 입구에서 생쥐스트가 서류를 든 채 그를 기다리고 있다.':''}`,[
   {l:'다가가 “카미유 이야기를 하고 싶어.”라고 말한다',a:'bold social',f:()=>{rvRel('robespierre',{close:F?2:-2,trust:-2});rvMem('m_rv_after','robespierre','1794년 봄, 튈르리 정원에서 로베스피에르에게 카미유 이야기를 꺼냈다.',{tone:'씁쓸함'});
     say(`그는 걸음을 멈추지 않았다. “카미유는…” 그가 처음으로 말을 고르는 것을 보았다. “…루이르그랑에서 내 숙제를 베꼈소. 늘.” 그 말을 끝으로 그는 정원 입구 쪽으로 걸어갔다.${sj?' 생쥐스트가 서류를 내밀었고, 그는 받아 들었다.':''} 그 뒷모습이 너무 가벼워 보였다.`)}},
   {l:'멀리서 바라만 본다',a:'safe',f:()=>{rvMem('m_rv_after','robespierre','1794년 봄, 튈르리 정원에서 혼자 걷는 로베스피에르를 멀리서 바라보았다.',{tone:'그리움'});
     say('그는 한 번도 고개를 돌리지 않았다. 개만 한 번 당신 쪽을 돌아보았다. 파리에서 가장 많은 사람의 운명을 쥔 사내가, 그날은 파리에서 가장 외로운 사람처럼 보였다.')}},
   sj?{l:'생쥐스트에게 다가가 “이제 만족하오?”라고 묻는다',a:'bold',f:()=>{rvRel('saintjust',{riv:10,resp:3});rvMem('m_rv_after2','saintjust','1794년 봄, 튈르리 정원에서 생쥐스트에게 이제 만족하느냐고 물었다.',{tone:'두려움'});
     say(`생쥐스트는 서류에서 눈을 들지 않았다. “만족은 혁명의 말이 아니오.” 그러고는 당신 이름을 정확히 불렀다. 그가 당신 이름을 안다는 사실이, 그 대답보다 무서웠다.`+fx({sus:6}))}}:null])});

rv('rv_therm',1794.52,1794.6,()=>rvAlive('robespierre')||rvAlive('saintjust'),async()=>{const F=RV_F(),et=rvEt();
  await bfScene('테르미도르 9일','le 9 thermidor',`7월 27일. 국민공회에서 생쥐스트가 연설을 시작하자마자 고함에 묻혔다고 한다. 로베스피에르는 말을 하려다 목이 막혔고, 누군가 외쳤다. 당통의 피가 목을 막는다고. 밤이 되자 파리 시청 앞에 시 자치회 쪽 구민들이 모인다. 비가 쏟아진다.${et?` 젖은 군중 속에 ${bI('etienne')} 보인다.`:''} 국민공회는 그들을 법 밖의 사람이라고 선언했다.`,[
   {l:'시청 앞 광장으로 간다',a:'radical bold',f:()=>{rvRel('robespierre',{close:5});if(et)bfRel('etienne',{close:5});rvMem('m_rv_therm',['robespierre','saintjust'].concat(et?['etienne']:[]),'테르미도르 9일 밤, 빗속의 파리 시청 앞 광장으로 갔다.',{tone:'두려움',place:'시청 앞 광장'});
     say(`자정이 지나자 광장의 구민들이 하나둘 빠져나갔다. 비, 명령 없는 기다림, 그리고 소문. 새벽 두 시, 국민공회 군대가 시청으로 들어갔다. 총소리 한 발. 당신은 ${et?`${bN('etienne')}의 소매를 붙잡고`:'골목으로'} 뛰었다. 등 뒤에서 누군가 창문으로 뛰어내렸다는 외침이 들렸다.`+fx({sus:8,cour:3,pol:3}),'big')}},
   {l:'국민공회 쪽 구민들 편에 선다',a:'safe',f:()=>{rvRel('robespierre',{close:-6});if(et)bfRel('etienne',{close:-4});rvMem('m_rv_therm',['robespierre'],'테르미도르 9일 밤, 국민공회 편에 섰다.',{tone:'죄책감'});
     say('당신의 구는 국민공회 편에 섰다. 새벽, 시청에서 끌려 나오는 사람들의 행렬이 지나갔다. 들것 위의 한 사람은 턱이 깨져 손수건으로 감싸고 있었다. 당신은 그 얼굴을 보지 않으려 했다.'+fx({sus:-6,pol:-3}),'big')}},
   {l:'집에서 덧문을 닫고 밤을 새운다',a:'safe',f:()=>{rvMem('m_rv_therm','robespierre','테르미도르 9일 밤, 덧문을 닫고 집에서 밤을 새웠다.',{tone:'두려움'});
     say('경종이 밤새 울렸다. 누구를 부르는 종인지 알 수 없었다. 새벽에 빗소리가 멎었을 때, 당신은 모든 것이 끝났다는 것을 알았다. 무엇이 끝났는지는 그 뒤로도 오래 이름 붙일 수 없었다.')}}])});

/* ---------- 실존 인물이 단두대에서 죽었을 때: 가까운 사이면 애도 장면 ---------- */
{const _gf=gFriend;gFriend=async function(r){try{const P=typeof perOf==='function'?perOf(r):null;if(P&&P.dc==='단두대'&&['danton','robespierre','desmoulins','saintjust'].includes(P.id)&&typeof rf4Guillo==='function'){r.dc='guillotine';return rf4Guillo(r)}}catch(e){console.error(e)}return _gf(r)}}
