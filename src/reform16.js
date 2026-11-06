/* ================= 개편 16: 벗을 고발한 뒤 =================
   벗을 위원회에 넘기면, 한 달쯤 뒤 그 일의 값이 온다.
   · 정치적 입장이 다른 벗들이 찾아와 비난한다 → 정당화하거나, 후회하거나, 돌아선다.
   · 비난할 벗이 없으면 홀로 그 밤을 견딘다 → 스스로 정당화하거나, 후회하거나, 속죄하려 한다.
   고발의 방향(dir): +1은 혁명 쪽(사재기꾼·선서 거부 사제·숨긴 사람), -1은 테르미도르 뒤 반동 쪽(옛 자코뱅).
   고발할 수 있는 자리: 최고가격제(앙투안) · 명단(쥘·가브리엘) · 지하실의 미사(쥘) · 프레리알 22일(가브리엘) · 혁명력 3년의 명단(에티엔). */

const r16Live=k=>bfMet(k)&&bfAlive(k)&&!bfR(k).cut;
function r16Q(v,dir,what){s.r16q=s.r16q||[];if(s.r16q.some(x=>x.v===v&&x.what===what))return;s.r16q.push({v,dir,what,at:MI()+1,y:s.year})}
function r16Jail(k,out,fate){const r=bfR(k);if(!r||!r.alive)return;r.cond='prison';r.r16out=out;bfFate(k,fate)}
const r16Pol=k=>{const r=bfR(k);return r?(r.pol||0):0};

/* ---------- 새로 고발할 수 있는 자리 ---------- */
function r16OptJules(){if(T()<1792.7||T()>=1801.6)return null;return {l:'구 위원회에 이 미사를 알린다',a:'radical',f:async()=>{const J=bN('jules'),ter=T()>=1793.7&&T()<1794.56;
  bfRel('jules',{close:-30,trust:-35,hate:15});bfSet('jules','betrayed');bfReg('r16_jules','jules',`${jo(J,'이','가')} 숨어서 드리던 미사를 위원회에 알렸다.`);
  bfMem('m16_jules','jules',`${jo(J,'이','가')} 드리던 지하실 미사를 구 위원회에 알렸다.`,{tone:'죄책감',their:'계단 위에 서 있던 그 사람이 내려가지 않고 돌아섰을 때, 나는 알았다. 그래도 그 사람을 위해 기도했다. 그것밖에 할 줄 몰랐다.'});
  say(`이튿날 밤 위원회 사람들이 지하실 문을 열었다. 흰 천과 촛대가 마당에 내던져졌다. 촛대 하나가 당신 발 앞으로 굴러왔다. 당신은 그것을 외투 밑에 숨겼다. ${jo(J,'은','는')} 끌려가면서 한 번도 당신 쪽을 보지 않았다. 그게 더 견디기 어려웠다.`+fx({pol:4,sus:-6}),'dark');
  if(ter&&R()<.5)bfDie('jules','guillotine','혁명재판소에서 선서 거부 사제로 사형을 선고받고 단두대에 올랐다. 수레 위에서 낮은 목소리로 노래했다고 한다.');
  else r16Jail('jules',ter?1794.7:T()+1.5,T()<1795?'고발당해 감옥에 갇혔다':'고발당해 레 섬의 사제 감옥으로 보내졌다');
  r16Q('jules',1,'지하실 미사를 위원회에 알렸다')}}}
function r16OptGabriel(){return {l:'구 위원회에 알린다',a:'radical safe',f:async()=>{const G=bN('gabriel');
  bfRel('gabriel',{close:-30,trust:-35,hate:15});bfReg('r16_gab','gabriel',`${jo(G,'이','가')} 사람들을 숨긴 다락방을 위원회에 알렸다.`);
  bfMem('m16_gab','gabriel',`대공포 때, ${jo(G,'이','가')} 사람들을 숨긴 다락방을 구 위원회에 알렸다.`,{tone:'죄책감',their:'그날 다락방 문을 세 번 두드린 건 그 사람이 아니었다. 그것만으로 다 알았다.'});
  say(`위원회 사람들이 다락방 문을 부쉈다. 숨어 있던 둘과 함께 ${jo(G,'이','가')} 끌려 나왔다. 계단참에서 ${jo(G,'은','는')} 거울 조각 하나를 떨어뜨렸다. 당신은 그것을 주워 주머니에 넣었다. 왜 그랬는지는 당신도 몰랐다.`+fx({pol:4,sus:-8}),'dark');
  if(R()<.5)bfDie('gabriel','guillotine','숨긴 죄로 혁명재판소에서 사형을 선고받고 단두대에 올랐다. 마지막까지 머리를 꼿꼿이 들었다고 한다.');
  else r16Jail('gabriel',1794.7,'고발당해 콩시에르주리에 갇혔다');
  r16Q('gabriel',1,'숨은 사람들의 다락방을 위원회에 알렸다')}}}
// 혁명력 3년(1795) 프레리알 봉기 뒤: 옛 ‘테러리스트’의 무장 해제와 체포
RF2_SIDE.push({k:'etienne',id:'r16_an3',pri:1,when:()=>T()>=1795.38&&T()<1795.75&&!child()&&s.cond==='normal'&&r16Pol('etienne')>=30&&bfR('etienne').cond==='normal',run:async()=>{const E=bN('etienne');
  await bfScene('혁명력 3년의 명단','la liste de l’an III',`1795년 프레리알 봉기가 꺾인 뒤. 구 회의가 다시 열렸다. 이번에는 ‘공포정치의 하수인’을 찾는다. 금빛 청년단이 몽둥이를 들고 문 앞을 지킨다. 의장이 묻는다. “이 구에서 감시위원회 띠를 두르던 자를 아는 시민은 말하시오.” 몇 사람이 당신 쪽을 본다. 다들 당신이 ${jo(E,'과','와')} 친하다는 걸 안다.`,[
   {l:`${E}의 이름을 댄다`,a:'safe royal',f:()=>{bfRel('etienne',{close:-30,trust:-35,hate:15});bfReg('r16_et','etienne',`혁명력 3년, 구 회의에서 ${E}의 이름을 댔다.`);
     bfMem('m16_et','etienne',`혁명력 3년, 구 회의에서 ${E}의 이름을 댔다.`,{tone:'죄책감',their:'그 사람이 내 이름을 말했다. 이상하지. 나는 화가 나지 않았다. 내가 먼저 그렇게 살았으니까.'});
     say(`당신 목소리는 작았다. 그래도 서기가 받아 적기에는 충분했다. 이튿날 ${jo(E,'은','는')} 무장 해제를 당하고 플레시 감옥으로 끌려갔다. 금빛 청년들이 그 뒤를 따라가며 휘파람을 불었다.`+fx({pol:-4,sus:-5}),'dark');
     r16Jail('etienne',1795.83,'혁명력 3년, 고발당해 플레시 감옥에 갇혔다');r16Q('etienne',-1,'구 회의에서 이름을 댔다')}},
   {l:'“모른다.”고 말한다',a:'bold',f:()=>{bfRel('etienne',{close:4,trust:6});say('의장이 당신을 오래 보았다. 금빛 청년 하나가 몽둥이로 바닥을 두드렸다. 다른 누군가가 그 이름을 댔다. 당신이 대지 않았다는 것만은, 그날 그 자리의 모두가 알았다.'+fx({cour:2,sus:4}))}},
   {l:'회의가 끝나자마자 그에게 달려가 알린다',a:'family bold',f:()=>{bfRel('etienne',{close:8,trust:10});bfMem('m16_et_warn','etienne',`혁명력 3년, 구 회의가 끝나자마자 ${bN('etienne')}에게 달려가 알렸다.`,{tone:'위로',their:'그 사람이 숨이 차서 왔다. 그날 밤 나는 파리를 떠났다. 그 사람 덕이다.'});say(`${jo(E,'은','는')} 짐 하나만 꾸려 그날 밤 문밖으로 나갔다. 떠나기 전 당신 손을 꽉 쥐었다. “너는 늘 반대편에서 나를 구하는구나.”`+fx({cour:2,sus:3}))}}])}});

/* ---------- 이미 있던 고발 자리: 최고가격제(앙투안), 명단(쥘·가브리엘) ---------- */
{const _b16=bfScene;bfScene=async function(title,fr,text,opts){let cf0=null,told0=false;
  try{if(title==='최고가격제'&&bfMet('antoine'))cf0=bfF('antoine').fl.cfMax;if(title==='명단'&&bfMet('etienne'))told0=bfFl('etienne','told')}catch(e){}
  const i=await _b16(title,fr,text,opts);
  try{if(title==='최고가격제'&&cf0!=='told'&&bfMet('antoine')&&bfF('antoine').fl.cfMax==='told')r16Q('antoine',1,'최고가격제 때 위원회에 가서 창고를 증언했다');
    if(title==='명단'&&!told0&&bfFl('etienne','told'))r16Q('?list',1,'명단을 든 에티엔에게 숨은 곳을 말했다')}catch(e){}
  return i}}

/* ---------- 비난하는 벗, 고개를 끄덕이는 벗 ---------- */
const R16_BLAME={
 louise:(V,w)=>`${bU('louise')} 앞치마를 움켜쥐고 서 있었다. “${V}… 우리 골목에서 같이 큰 애야. 빵 꽁다리를 나눠 먹던 애를, 네가.” 목소리가 떨렸다. 화가 나서가 아니라, 당신이 낯설어서.`,
 etienne:(V,w)=>`${bU('etienne')} 문간에 기대어 웃었다. 웃음이 아니었다. “혁명이 끝났다고 우리가 한 일까지 지워질 줄 알았어? 너는 이긴 쪽에 줄을 섰을 뿐이야. 나도 그랬지. 그래서 알아.”`,
 jules:(V,w)=>`${bU('jules')} 당신 앞에 섰다. 손이 떨렸지만 이번에는 말을 더듬지 않았다. “하느님 앞에서도 똑같이 말할 수 있어? ${V}의 이름을 부를 때, 네 목소리가 어땠는지.”`,
 antoine:(V,w)=>`${bU('antoine')} 장부를 덮듯 탁 소리를 내며 말했다. “장사꾼도 친구는 안 팔아. ${V}의 값이 얼마였어? 혐의 몇 점이 깎였는데?”`,
 gabriel:(V,w)=>`${bU('gabriel')} 손거울을 내려놓았다. “얼음이 깨지던 날 나는 달아났어. 평생 그게 부끄러웠지. 그런데 너는 달아나지도 않고 ${jo(V,'을','를')} 밀어 넣었구나. 이제 우리 둘 중 누가 겁쟁이인지 모르겠다.”`};
const R16_NOD={
 louise:()=>`${bU('louise')} “할 일을 한 거야.”라고 했다. 하지만 당신 눈을 보지 않았다.`,
 etienne:()=>`${bN('etienne')}만은 당신 어깨를 두드렸다. “잘했어. 공화국은 감정으로 지키는 게 아니야.” 그 말이 조금도 위로가 되지 않았다.`,
 jules:()=>`${bU('jules')} 작게 성호를 그었다. “벌은 하느님이 내리시는 거야.” 그것이 당신 편을 드는 말인지 아닌지 알 수 없었다.`,
 antoine:()=>`${bU('antoine')} 어깨를 으쓱했다. “세상이 바뀌면 줄도 바꿔 서야지.” 그는 그렇게 말하고 다른 이야기를 했다.`,
 gabriel:()=>`${bU('gabriel')} “이제야 정신이 들었구나.”라며 웃었다. 그 웃음이 거울 속에서처럼 매끈했다.`};

function r16Victim(x){if(x.v!=='?list')return x.v;
  if(bfMet('jules')&&bfFl('jules','betrayed'))return 'jules';
  if(bfMet('gabriel')&&(bfFl('gabriel','jailed')||bfR('gabriel').cond==='prison'||!bfAlive('gabriel')))return 'gabriel';return null}
async function r16After(x){const v=r16Victim(x);if(!v||!bfMet(v))return;const V=bN(v),r=bfR(v);
  const state=!r.alive?`${jo(V,'은','는')} 이제 세상에 없다.`:r.cond==='prison'?`${jo(V,'은','는')} 지금 감옥에 있다.`:`${jo(V,'은','는')} 당신을 피해 다닌다.`;
  const others=['louise','etienne','jules','antoine','gabriel'].filter(k=>k!==v&&r16Live(k)&&bfR(k).cond==='normal');
  const opp=k=>x.dir>0?r16Pol(k)<0:r16Pol(k)>=30,ally=k=>x.dir>0?r16Pol(k)>=30:r16Pol(k)<0;
  const crit=others.filter(opp).slice(0,2),nod=others.filter(ally).slice(0,1);
  if(crit.length){const names=crit.length>1?`${jo(bN(crit[0]),'과','와')} ${bN(crit[1])}`:bN(crit[0]);
    await bfScene('벗들의 비난','le reproche',`한 달 뒤. ${state} ${crit.map(k=>R16_BLAME[k](V,x.what)).join(' ')}${nod.length?' '+R16_NOD[nod[0]]():''}`,[
     {l:'“공화국을 위해서였다. 너희도 언젠가 알게 될 거다.”',a:x.dir>0?'radical bold':'safe royal',f:()=>{crit.forEach(k=>{bfRel(k,{close:-8,trust:-8,riv:4});bfMem('m16_j_'+k+'_'+v,k,`${jo(V,'을','를')} 고발한 일을 두고 ${bN(k)}에게 정당화했다. “나라를 위해서였다.”`,{tone:'씁쓸함',their:'그 사람은 끝까지 옳았다고 했다. 그 말을 믿고 싶어 하는 얼굴이었다.'})});
       say(`당신 목소리는 단단했다. 너무 단단해서, 말하는 동안 스스로 그 말을 붙잡고 있는 것 같았다. ${crit.length>1?'둘은':crit.map(bU)[0]} 아무 대답 없이 돌아갔다.`+fx({pol:x.dir*3,hap:-2,cour:1}))}},
     {l:'고개를 숙이고 “내가 틀렸다.”고 말한다',a:'family',f:()=>{crit.forEach(k=>{bfRel(k,{trust:3,close:-2});bfMem('m16_r_'+k+'_'+v,k,`${jo(V,'을','를')} 고발한 일을 두고 ${bN(k)} 앞에서 내가 틀렸다고 말했다.`,{tone:'죄책감',their:'그 사람이 틀렸다고 했다. 쉬운 말이 아니었을 것이다. 그래도 돌이킬 수는 없었다.'})});bfReg('r16_regret_'+v,v,`${jo(V,'을','를')} 고발했다. 벗들 앞에서 틀렸다고 말했다.`);
       say(`말을 하고 나니 무릎이 떨렸다. ${crit.map(bU)[0]} 한참 당신을 보다가 말했다. “그 말, ${V}한테도 할 수 있어?” 당신은 대답하지 못했다.`+fx({hap:-5}))}},
     {l:'아무 말 없이 자리를 뜬다',a:'safe',f:()=>{crit.forEach(k=>bfRel(k,{close:-5}));say(`등 뒤에서 ${names}의 목소리가 들렸지만 돌아보지 않았다. 계단을 내려오는데 다리가 자꾸 헛디뎠다. 그날부터 당신은 그 골목을 돌아서 다녔다.`+fx({hap:-3}))}}]);return}
  // 비난할 벗이 없을 때: 홀로
  await bfScene('홀로 남은 밤','seul',`한 달 뒤. ${state} 아무도 당신을 비난하지 않는다. ${nod.length?R16_NOD[nod[0]]()+' ':''}그래서 더 조용하다. 밤이면 ${V}의 얼굴이 떠오른다. 어린 시절의 얼굴, 그리고 그날의 얼굴.`,[
   {l:'“그때는 그것이 옳았다.”고 스스로에게 말한다',a:x.dir>0?'radical':'safe',f:()=>{bfMem('m16_self_'+v,v,`${jo(V,'을','를')} 고발한 뒤, 그때는 그것이 옳았다고 스스로에게 말했다.`,{tone:'씁쓸함'});say('당신은 그 문장을 밤마다 되뇌었다. 처음에는 위로였고, 다음에는 습관이었고, 나중에는 주문이었다. 효과는 점점 짧아졌다.'+fx({pol:x.dir*2,hap:-2}))}},
   {l:'밤새 그 이름을 부르며 후회한다',a:'pious family',f:()=>{bfReg('r16_alone_'+v,v,`${jo(V,'을','를')} 고발했다. 혼자 밤새 후회했다.`);bfMem('m16_regret_'+v,v,`${jo(V,'을','를')} 고발한 뒤, 밤새 그 이름을 부르며 후회했다.`,{tone:'죄책감'});say(`촛불이 다 탈 때까지 앉아 있었다. ${V}. 이름을 소리 내어 부르자 방이 더 조용해졌다. 새벽에 당신은 처음으로 기도라는 것을 했다. 누구에게 하는지도 모르면서.`+fx({hap:-6,faith:1}))}},
   r.alive&&r.cond==='prison'&&{l:'감옥으로 빵과 담요를 보낸다',a:'family bold',f:()=>{bfRel(v,{hate:-6,trust:2});bfMem('m16_atone_'+v,v,`${jo(V,'을','를')} 고발한 뒤, 감옥으로 빵과 담요를 보냈다.`,{tone:'죄책감',their:'담요가 왔다. 보낸 사람 이름은 없었다. 냄새로 알았다.'});say(`이름은 적지 않았다. 간수는 꾸러미를 받아 들고 웃었다. “이런 건 대개 고발한 쪽에서 보내지.” 당신은 아무 말도 하지 않았다.`+fx({money:-20,sus:3,hap:-1}))}},
   !r.alive&&{l:'남은 가족을 찾아가 무릎을 꿇는다',a:'family bold',f:()=>{bfReg('r16_fam_'+v,v,`${jo(V,'을','를')} 고발했다. 남은 가족을 찾아가 무릎을 꿇었다.`);say(`문을 연 사람은 당신을 알아보았다. 오래 서 있다가, 문을 닫지는 않았다. 그것이 용서가 아니라는 것을 당신은 알았다. 그래도 문은 닫히지 않았다.`+fx({hap:-4,cour:2}))}}])}

/* ---------- 차례가 되면 꺼내고, 갇힌 벗은 때가 되면 풀려난다 ---------- */
{const _rd16=rfDaily;rfDaily=async function(){await _rd16();if(!s||s.dead)return;try{
  for(const k of ['louise','etienne','jules','antoine','gabriel']){const r=bfMet(k)&&bfR(k);if(r&&r.alive&&r.cond==='prison'&&r.r16out&&T()>=r.r16out){r.cond='normal';r.r16out=null;bfFate(k,'감옥에서 풀려났다');L(`${jo(bN(k),'이','가')} 감옥에서 풀려났다는 소식이 들렸다.`,'ev')}}
  if(s.r16q&&s.r16q.length&&!sheetLive&&!child()&&s.cond==='normal'){const i=s.r16q.findIndex(x=>MI()>=x.at);if(i>=0){const x=s.r16q.splice(i,1)[0];await r16After(x)}}
}catch(e){console.error(e);if(sheetLive)sheetClose()}}}
