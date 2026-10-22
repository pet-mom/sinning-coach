/* ================= 태어남과 죽음: 그에 맞는 반응 =================
   한 번의 진행(advanceSeason) 앞뒤로 가족·벗의 생사를 비교해, 새로 태어난 아이와 세상을 떠난 사람에게 장면을 띄운다.
   - 죽음: 장례와 밤샘, 유품, 남은 기억. 시대에 따라 종이 울리지 않거나(1793~95) 무덤조차 없을 수 있다(처형·학살).
   - 태어남: 세례(또는 1793~95년의 시민 등록), 대부·대모, 혁명력 이름.
   - 이름난 사람의 탄생과 죽음에는 거리의 분위기와 당신·벗들의 반응을 적는다.
   한 번의 진행에서 장면은 둘까지만 띄우고, 나머지는 기록으로 남긴다. */
const gTerror=()=>T()>=1793.8&&T()<1795.3;
const gGrave=()=>T()>=1804.4?'페르라셰즈 묘지':T()>=1780.9?'성벽 밖 묘지':'본당 묘지';
function gBell(){return gTerror()?'종은 대포가 되어 내려갔고, 신부도 없이 구청 사람이 이름만 적어 갔다.':s.faithKind==='protestant'&&T()<1788?'신교도에게는 묘지도 종소리도 허락되지 않았다. 밤에 정원 구석에 몰래 묻었다.':`${typeof bfPar==='function'?bfPar():'본당'}의 종이 느리게 울렸다.`}
function gSnap(){return {fa:!!(s.fa&&s.fa.alive),mo:!!(s.mo&&s.mo.alive),sp:s.spouse&&s.spouse.alive?s.spouse:null,kids:s.kids.map(k=>k.alive),nk:s.kids.length,
  rel:new Set((s.rel||[]).filter(r=>r.alive).map(r=>r.fid||r.pid||r.n))}}
const gKey=r=>r.fid||r.pid||r.n;
function gDiff(a){const o=[];if(s.dead)return o;
  for(const k of ['fa','mo'])if(a[k]&&s[k]&&!s[k].alive)o.push({t:'death',who:k});
  if(a.sp&&!a.sp.alive&&a.sp.dy===s.year&&!s.divorced)o.push({t:'death',who:'sp',p:a.sp});
  a.kids.forEach((al,i)=>{const k=s.kids[i];if(al&&k&&!k.alive)o.push({t:'death',who:'kid',p:k})});
  for(let i=a.nk;i<s.kids.length;i++)if(s.kids[i].alive)o.push({t:'birth',p:s.kids[i]});
  for(const r of s.rel||[]){if(r.alive||!a.rel.has(gKey(r))||r.lost)continue;const P=typeof perOf==='function'?perOf(r):null;
    if(r.core)o.push({t:'death',who:'core',p:r});else if((r.close||0)>=70)o.push({t:'death',who:'friend',p:r});else if((r.close||0)>=50||(P&&(r.close||0)>=45))o.push({t:'line',p:r})}
  return o}
const gWho=k=>k==='fa'?'아버지':'어머니';
const gFaKeep=()=>({epee:'아버지의 인장 반지',robe:'아버지의 인장 반지',hobereau:'아버지의 낡은 사냥총',bourgeois:'아버지의 회중시계',artisan:'아버지가 쓰던 연장',peasant:'아버지의 낫'}[s.estate]||'아버지의 회중시계');
const gMoKeep=()=>s.faithKind==='protestant'?'어머니의 낡은 성경':s.faithKind==='jewish'?'어머니의 안식일 촛대':pick(['어머니의 묵주','어머니의 은 골무']);
function gKeep(id,t){if(typeof bfObj==='function')bfObj(id,t,{from:'family'})}
function gMem(id,t,tone){if(typeof bfMem==='function')bfMem(id,'family',t,{tone:tone||'그리움'})}

/* ---------- 부모 ---------- */
async function gParent(k){const P=s[k],who=gWho(k),a=P.age,kid=child();
  const mem=k==='fa'?pick(['투박한 손으로 당신의 머리를 쓰다듬던','일요일이면 당신을 어깨에 태우고 강가를 걷던','저녁마다 장부를 덮으며 낮게 한숨 쉬던','당신이 처음 글자를 읽던 날 소리 내어 웃던']):pick(['겨울밤 당신의 언 발을 두 손으로 녹여 주던','부엌에서 낮게 노래를 흥얼거리던','당신이 앓을 때 밤새 이마를 짚어 주던','당신의 헤진 소매를 말없이 기워 놓던']);
  const id='g_'+k;const T0=`${who}가 ${a}세로 세상을 떠났다.${kid?` 당신은 겨우 ${s.age}살이었다.`:''} 문에 검은 휘장이 걸리고, 이웃들이 촛불을 들고 왔다. ${mem} ${who}의 모습이 자꾸만 떠오른다. ${gBell()}`;
  await bfScene(`${who}의 장례`,'les funérailles',T0,kid?[
   {l:'어른들 틈에서 소리 내어 운다',a:'family',f:()=>{gMem(id,`${s.age}살 때 ${who}가 세상을 떠났다. 어른들 틈에서 소리 내어 울었다. ${mem} 모습만 남았다.`,'그리움');say(`누군가 당신을 안아 올렸다. 그 품에서도 ${who}의 냄새는 나지 않았다.`,'big')}},
   {l:'관 위에 들꽃을 올려놓는다',a:'family',f:()=>{gMem(id,`${s.age}살 때 ${who}가 세상을 떠났다. 관 위에 들꽃 한 줌을 올려놓았다.`,'그리움');say('들꽃은 금세 시들었다. 당신은 그 뒤로 그 꽃이 피는 철마다 울었다.','big')}}]:[
   {l:'밤새 곁을 지킨다',a:'family',f:()=>{gMem(id,`${s.year}년, ${who}가 세상을 떠났다. 마지막 밤을 곁에서 지켰다. 촛불이 꺼질 때까지 ${mem} 모습을 생각했다.`,'그리움');say(pick(['새벽녘, 식어 가는 손을 끝까지 놓지 않았다.','촛농이 다 녹아내릴 때까지 그 얼굴을 들여다보았다. 잠든 것 같았다.',`“${who}.” 몇 번을 불러도 대답이 없었다. 그래도 계속 불렀다.`])+fx({hp:-2,rfam:2}),'big')}},
   {l:k==='fa'?`${gFaKeep()}를 간직한다`:`${gMoKeep()}을 간직한다`,a:'family',f:()=>{const t=k==='fa'?gFaKeep():gMoKeep();gKeep('k_'+k,t);gMem(id,`${s.year}년, ${who}가 세상을 떠났다. ${t}을 품에 넣고 장례를 치렀다.`,'그리움');say(`${t}은 아직 ${who}의 온기를 품고 있는 것 같았다.`+fx({hp:-1}),'big')}},
   {l:'울음을 삼키고 장례를 맡는다',a:'safe',f:()=>{const c=Math.min(Math.round(s.money*.05),noble()?600:120);s.money-=c;gMem(id,`${s.year}년, ${who}가 세상을 떠났다. 울음을 삼키고 장례를 도맡았다. 다 끝나고 혼자 남았을 때에야 울었다.`,'그리움');say(pick(['조문객이 모두 돌아간 밤, 빈 의자 앞에서 비로소 울었다.','장례를 마친 날 저녁, 습관처럼 두 사람 몫의 그릇을 꺼냈다가 하나를 도로 넣었다.'])+fx({rfam:3,rloc:1})+(c?` (재산 -${fmt(c)})`:''),'big')}}])}

/* ---------- 배우자 ---------- */
async function gSpouse(p){const n=p.n||(isM()?'아내':'남편'),ka=kidsAlive().length,id='g_sp_'+s.year;
  await bfScene(`${n}을 묻던 날`,'le veuvage',`${jo(n,'이','가')} 숨을 거두었다. 마지막으로 당신의 손을 쥔 손에 아직 힘이 남아 있었다. 함께 앉던 식탁의 의자 하나가 비었다.${ka?` 아이들이 당신의 옷자락에 매달려 운다.`:''} ${gBell()}`,[
   {l:'혼인 반지를 빼어 간직한다',a:'family',f:()=>{gKeep('k_ring_'+s.year,`${n}의 혼인 반지`);gMem(id,`${s.year}년, ${jo(n,'을','를')} 잃었다. ${n}의 반지를 빼어 목걸이 줄에 꿰었다.`,'그리움');say(`반지는 당신의 손가락에 맞지 않았다. 목에 걸었다.`+fx({hp:-3}),'big')}},
   ka?{l:'아이들을 끌어안는다',a:'family',f:()=>{gMem(id,`${s.year}년, ${jo(n,'을','를')} 잃었다. 우는 아이들을 끌어안고 당신은 울지 않으려 애썼다.`,'그리움');say(`그날 밤 아이들은 당신 침대에서 잠들었다. 당신은 잠들지 못했다.`+fx({hp:-2,rfam:3}),'big')}}:null,
   {l:'밤새 곁을 지킨다',a:'family',f:()=>{gMem(id,`${s.year}년, ${jo(n,'을','를')} 잃었다. 마지막 밤을 곁에서 지켰다.`,'그리움');say(`새벽이 와도 당신은 커튼을 걷지 않았다.`+fx({hp:-4}),'big')}}])}

/* ---------- 자녀 ---------- */
async function gKid(k){const a=s.year-k.y,son=k.sex==='M',w=son?'아들':'딸',id='g_kid_'+k.n+k.y;const baby=a<2;
  const T0=baby?`${w} ${jo(k.n,'이','가')} 숨을 거두었다. 배내옷이 아직 빨랫줄에서 마르지도 않았다. 작은 관은 한 팔로 들 수 있을 만큼 가벼웠다. 이웃 여자들은 “하느님이 데려가신 거야.”라고 했다. 위로가 되지 않았다.`
    :`${a}살 난 ${w} ${jo(k.n,'이','가')} 숨을 거두었다. 이름을 부르면 대답하던 목소리가 집 안 어디에도 없다. ${a<10?'구석에 굴러다니는 나무 장난감을 차마 치우지 못했다.':'그 아이가 앉던 창가 자리에 오후 햇빛만 든다.'}`;
  await bfScene(baby?'작은 관':`${k.n}의 장례`,'la petite bière',T0+' '+gBell(),[
   {l:baby?'배내옷을 간직한다':'아이의 물건 하나를 간직한다',a:'family',f:()=>{const t=baby?`${k.n}의 배내옷`:a<10?`${k.n}의 나무 장난감`:`${k.n}의 손때 묻은 책`;gKeep('k_kid_'+k.n+k.y,t);gMem(id,`${s.year}년, ${a<1?'갓난':a+'살 난'} ${w} ${jo(k.n,'을','를')} 잃었다. ${t}을 서랍 깊이 넣었다.`,'그리움');say(pick([`서랍을 열 때마다 ${k.n}의 냄새가 났다. 그래서 오래도록 그 서랍을 열지 못했다.`,`${t}을 쥔 손이 떨렸다. 이렇게 작았던가.`])+fx({hp:-3}),'big')}},
   {l:'밤새 작은 몸을 안고 있는다',a:'family',f:()=>{gMem(id,`${s.year}년, ${a<1?'갓난':a+'살 난'} ${w} ${jo(k.n,'을','를')} 잃었다. 밤새 작은 몸을 안고 있었다.`,'그리움');say(`아침이 되자 사람들이 아이를 데려갔다. 팔이 한동안 그 무게를 기억했다.`+fx({hp:-4}),'big')}},
   s.faithKind==='catholic'?{l:'하늘을 원망한다',a:'bold',f:()=>{gMem(id,`${s.year}년, ${w} ${jo(k.n,'을','를')} 잃었다. 그해 당신은 미사에 나가지 않았다.`,'씁쓸함');say(`어떤 기도도 입 밖으로 나오지 않았다.`+fx({hp:-3,faith:-4}),'big')}}:null,
   {l:'신부를 찾아가 함께 기도한다',a:'pious',dis:gTerror(),f:()=>{gMem(id,`${s.year}년, ${w} ${jo(k.n,'을','를')} 잃었다. 신부와 함께 작은 무덤 앞에서 기도했다.`,'위로');say(`“천사가 하나 늘었습니다.” 신부의 말을 믿고 싶었다.`+fx({hp:-2,faith:3}),'big')}}])}

/* ---------- 오래된 벗 ---------- */
const G_CORE_GIFT={louise:['빵 한 덩이를 무덤에 놓는다','빵 한 덩이'],etienne:['『텔레마코스의 모험』 한 구절을 읽어 준다','책 한 구절'],jules:['종탑에 올라 종을 친다','종소리'],antoine:['선술집 그 자리에 잔 하나를 놓는다','빈 잔'],gabriel:['푸른 리본을 무덤에 묶는다','푸른 리본']};
const G_CORE_OBJ={louise:null,etienne:null,jules:'feather',antoine:'button',gabriel:'ribbon'};
function gNoGrave(r){return ['guillotine','massacre'].includes(r.dc)?'시신은 구덩이에 던져져 무덤조차 없다.':r.dc==='cholera'?'시신은 석회를 뿌려 서둘러 묻혔다.':r.dc==='pontons'?'시신은 로슈포르 앞 마담 섬 모래밭에 묻혔다고 한다.':r.dc==='exile'?'무덤은 바다 건너 먼 섬에 있다.':`${gGrave()}에 묻혔다.`}
async function gCore(r){const k=r.core;if(k==='etienne'&&r.dc==='guillotine'&&bfM('m_cart'))return gLine(r,true);
  const ms=(s.bf&&s.bf.mem||[]).filter(m=>m.k.includes(k));const first=ms[0];const N=r.n.split(' ')[0];const a=(r.dead||s.year)-r.by;
  const T0=`${jo(N,'이','가')} 세상을 떠났다. ${a}세였다. ${gNoGrave(r)} ${first?`당신은 ${first.y}년의 일을 떠올렸다. ${first.t}`:''}`;
  const g=G_CORE_GIFT[k],ob=G_CORE_OBJ[k];const has=ob&&bfHas(ob);
  await bfScene(`${N}의 부고`,'l’ami perdu',T0,[
   {l:g[0],a:'social',f:()=>{bfMem('g_core_'+k,k,`${s.year}년, ${jo(N,'이','가')} 세상을 떠났다. 당신은 ${g[1]}로 작별했다.`,{tone:'그리움'});if(first)bfRe(first.id,`${N}을 보내던 날, 이 기억이 가장 먼저 떠올랐다.`,'그리움');say(pick([`${N}에게 하지 못한 말이 많았다. 그 말들은 이제 어디에도 닿지 않는다.`,`${N}의 이름을 부르면 아직도 어린 날의 얼굴이 먼저 떠오른다. 그 얼굴은 이제 늙지 않는다.`,`어린 날 함께 걷던 골목을 혼자 걸었다. ${N}의 웃음소리가 들리는 것만 같았다.`,`이제 그 시절을 함께 기억해 줄 사람이 하나 줄었다. 그것이 가장 견디기 어려웠다.`])+fx({hp:-3}),'big')}},
   has?{l:`간직해 온 ${{feather:'참새 깃털',button:'은단추',ribbon:'푸른 리본'}[ob]}을 관에 넣어 준다`,a:'family',f:()=>{bfLose(ob,`${N}의 관에 넣어 주었다`);bfMem('g_core_'+k,k,`${s.year}년, ${jo(N,'이','가')} 세상을 떠났다. 오래 간직해 온 것을 ${N}에게 돌려주었다.`,{tone:'위로'});say(`이제 그것은 ${N}과 함께 있다. 그편이 맞는 것 같았다.`+fx({hp:-2}),'big')}}:null,
   {l:'혼자 퐁뇌프에 간다',a:'safe',f:()=>{bfMem('g_core_'+k,k,`${s.year}년, ${jo(N,'이','가')} 세상을 떠났다. 그날 저녁 혼자 퐁뇌프 난간에 앉아 있었다.`,{tone:'그리움',place:'퐁뇌프'});if(bfM('m_bridge'))bfRe('m_bridge',`${N}이 떠난 날, 혼자 그 난간에 앉았다. 강물은 그날처럼 붉었다.`,'그리움');say(pick(['강물은 어린 날처럼 붉었다. 옆자리가 비어 있었다.',`해가 질 때까지 앉아 있었다. 누군가 옆에 와서 앉을 것만 같았다.`])+fx({hp:-3}),'big')}}])}

/* ---------- 가까운 벗 ---------- */
async function gFriend(r){const N=r.n,P=typeof perOf==='function'?perOf(r):null;
  await bfScene(`${N}의 부고`,'le deuil',`${jo(N,'이','가')} 세상을 떠났다는 소식이 왔다. ${P?'신문에도 부고가 실렸다. 그러나 당신이 아는 그 사람은 신문 속 이름과 달랐다.':'함께 웃던 저녁들이 한꺼번에 밀려왔다.'} ${gGrave()}에서 장례가 있다고 한다.`,[
   {l:'장례에 간다',a:'social',f:()=>{say(pick(['관 위에 흙이 떨어지는 소리가 오래 귀에 남았다.',`${N}의 이름이 적힌 나무 십자가 앞에서 오래 서 있었다.`,'장례가 끝나고도 한참 동안 무덤가를 떠나지 못했다.'])+fx({hp:-2,rloc:1}),'big')}},
   {l:'혼자 그 사람을 위해 잔을 든다',a:'safe',f:()=>{say(pick(['잔을 두 개 채웠다. 하나는 끝내 비지 않았다.',`${N}이 즐겨 부르던 노래를 혼자 흥얼거렸다. 끝 소절이 기억나지 않았다.`])+fx({hp:-2}),'big')}}])}
function gLine(r,quiet){if(quiet)return;L(`${jo(r.n,'이','가')} 세상을 떠났다는 소식을 들었다. ${pick(['한동안 그 이름을 입에 올리지 못했다.','그 사람과 마지막으로 나눈 말이 무엇이었는지 기억나지 않아 괴로웠다.','창밖을 오래 바라보았다.'])}`,'ev')}

/* ---------- 태어남 ---------- */
async function gBirth(k){const son=k.sex==='M',w=son?'아들':'딸',id='g_birth_'+k.n+k.y;const civ=gTerror(),prot=s.faithKind==='protestant'&&T()<1788;
  const T0=`${w} ${jo(k.n,'이','가')} 태어났다. 작은 주먹이 당신의 손가락을 꽉 쥐었다. ${civ?'성당 문은 닫혔고, 구청에 가서 시민 명부에 이름을 올려야 한다.':prot?'신교도의 아이라 숲속 비밀 예배에서 몰래 세례를 받아야 한다.':`${typeof bfPar==='function'?bfPar():'본당'}에서 세례를 받을 것이다.`}`;
  const fr=(typeof BF_KEYS!=='undefined'?BF_KEYS:[]).map(bfR).filter(r=>r&&r.alive&&r.cond==='normal'&&r.core!=='jules').sort((a,b)=>b.close-a.close)[0];
  const ju=typeof bfR==='function'?bfR('jules'):null;const juOK=ju&&ju.alive&&ju.cond==='normal'&&/신부/.test(ju.job||'')&&!civ;
  const REV=son?['브루투스','리베르테','메시도르','그라쿠스']:['리베르테','에갈리테','플로레알','로즈마랭'];
  await bfScene(civ?'시민 명부':'세례','le baptême',T0,[
   juOK?{l:`${bN('jules')} 신부에게 세례를 부탁한다`,a:'pious',f:()=>{bfRel('jules',{close:8});bfMem(id,['family','jules'],`${s.year}년, ${w} ${jo(k.n,'이','가')} 태어났다. ${bU('jules')} 그 아이에게 세례를 주었다. 물을 붓는 손이 떨렸지만 기도문은 한 번도 더듬지 않았다.`,{tone:'기쁨',their:'친구의 아이에게 세례를 주었다. 종지기의 아이였던 내가.'});say(`${bU('jules')} 세례를 마치고 아기를 한참 내려다보았다.`+fx({faith:2}),'big')}}:null,
   fr?{l:`${bN(fr.core)}에게 ${son?'대부':'대모'}를 부탁한다`,a:'social',f:()=>{bfRel(fr.core,{close:10,trust:6});bfMem(id,['family',fr.core],`${s.year}년, ${w} ${jo(k.n,'이','가')} 태어났다. ${bN(fr.core)}에게 ${son?'대부':'대모'}를 부탁했다. ${bHe(fr.core)}는 아이를 안고 어쩔 줄 몰라 했다.`,{tone:'기쁨',their:'그 사람의 아이를 안았다. 너무 가벼워서 무서웠다.'});say(`${bU(fr.core)} 아이를 받아 안고 한참 웃었다.`,'big')}}:null,
   civ?{l:'혁명력의 이름을 지어 준다',a:'radical',f:()=>{const old=k.n;k.n=pick(REV);gMem(id,`${s.year}년, ${w}가 태어났다. 구청 명부에 ‘${k.n}’이라는 공화국의 이름을 올렸다.`,'희망');say(`${old} 대신 ${jo(k.n,'이','가')} 그 아이의 이름이 되었다.`+fx({pol:3}),'big')}}:null,
   {l:'아이를 품에 안고 한참 들여다본다',a:'family',f:()=>{gMem(id,`${s.year}년, ${w} ${jo(k.n,'이','가')} 태어났다. 품에 안고 한참 들여다보았다. 당신을 닮은 데를 찾았다.`,'기쁨');say(pick(['아이가 하품을 했다. 당신은 소리 내어 웃었다.','아이의 작은 발가락을 하나씩 세어 보았다. 열 개 다 있었다.','아이가 당신의 목소리에 눈을 떴다. 그 눈을 오래 들여다보았다.'])+fx({hp:1,rfam:2}),'big')}}])}

/* ---------- 이름난 사람의 탄생과 죽음 ----------
   [연, 달(0~11), 키, 거리의 분위기, 당신의 반응(급진·보수·신앙에 따라), 벗들의 반응] */
const G_FAME=[
 [1774,4,'louis15',()=>'왕의 장례 행렬이 생드니로 갈 때 길가의 사람들이 “사냥이다!” 하고 야유를 퍼부었다.',()=>s.pol<=-30?'당신은 모자를 벗고 고개를 숙였다. 야유하는 사람들이 미웠다.':'당신도 슬프지 않았다. 모두가 새 왕을 기다렸다.',{}],
 [1778,4,'voltaire',()=>'볼테르가 죽었다. 교회는 장례를 거부했고, 시신은 몰래 샹파뉴의 수도원으로 옮겨졌다고 한다.',()=>lit()&&s.pol>=10?'당신은 『캉디드』를 꺼내 한 장을 읽었다. “우리는 우리의 정원을 가꾸어야 한다.”':s.faith>=60?'신부는 강론에서 불경한 늙은이가 지옥에 갔다고 했다.':'',{etienne:'에티엔은 하루 종일 볼테르의 문장을 외우며 다녔다.'}],
 [1778,6,'rousseau',()=>'루소가 에르므농빌에서 죽었다. 포플러 섬의 무덤에 순례객이 몰려든다.',()=>lit()?'『신엘로이즈』를 읽으며 울던 사람들이 이번에는 그 작가 때문에 울었다.':'',{etienne:'에티엔은 『사회계약론』 첫 줄을 당신에게 들려주며 목이 메었다.'}],
 [1781,9,'dauphin',()=>'왕세자가 태어났다. 노트르담에서 감사 찬가가 울리고, 레알의 생선 장수 아낙들이 베르사유까지 축하하러 갔다. 밤에는 불꽃이 올랐다.',()=>s.pol<=10?'당신도 창가에 촛불을 밝혔다. 왕국에 아들이 생겼다.':'당신은 불꽃을 구경했다. 왕의 아들이든 누구의 아들이든 빵값은 그대로였다.',{louise:'루이즈네 빵집은 그날 왕세자 빵을 구워 팔았다.',gabriel:'가브리엘은 새로 맞춘 옷을 입고 축하연에 나갔다.'}],
 [1785,2,'normandie',()=>'왕비가 둘째 아들을 낳았다. 노르망디 공작이라는 칭호를 받았다.',()=>'',{}],
 [1789,5,'dauphin_d',()=>'일곱 살 왕세자가 뫼동에서 척추병으로 죽었다. 삼부회가 한창이라 왕은 아들의 장례조차 조용히 치렀다.',()=>s.pol<=0?'당신은 아들을 잃은 왕을 생각하며 기도했다.':'사람들은 삼부회 이야기만 했다. 당신도 그랬다. 나중에야 조금 미안했다.',{jules:'쥘은 어린 왕세자를 위해 미사를 드렸다.'}],
 [1793,0,'louis16',()=>'1월 21일, 혁명 광장에서 루이 카페가 처형되었다. 북소리가 그의 마지막 말을 덮었다. 사람들이 손수건을 피에 적셨다.',()=>s.pol>=40?'당신은 이제 되돌릴 수 없다는 것을 알았다. 두렵고, 동시에 홀가분했다.':s.pol<=-20?'당신은 문을 걸어 잠그고 울었다. 왕을 위해 운다는 것을 아무도 몰라야 했다.':'그날 파리는 이상하게 조용했다.',{jules:'숨어 있던 쥘은 그날 밤 지하실에서 왕을 위한 미사를 드렸다.',etienne:'에티엔은 처형대 아래에 있었다. 돌아와서는 아무 말도 하지 않았다.',gabriel:'가브리엘은 그날 검은 옷을 꺼내 입었다. 다시는 벗지 않을 것처럼.'}],
 [1793,6,'marat',()=>'마라의 장례 행렬이 밤늦도록 횃불을 들고 거리를 돌았다. 코르들리에 사람들은 그의 심장을 단지에 담아 천장에 매달았다. 다비드가 그의 죽음을 그린다고 한다.',()=>s.pol>=40?'당신도 상장을 달았다. 거리마다 “마라는 죽지 않았다!”는 외침이 울렸다.':'거리의 곡소리가 당신에게는 무서웠다. 슬픔이 곧 복수가 될 것 같았다.',{etienne:'에티엔은 사흘 동안 검은 띠를 두르고 다녔다. “이제 자비는 없어.”'}],
 [1793,9,'marie',()=>'10월 16일, 마리 앙투아네트가 짐수레에 실려 혁명 광장으로 갔다. 다비드가 길가에서 그 모습을 스케치했다.',()=>s.pol<=-20?'머리가 하얗게 센 왕비가 짐수레에 앉아 있었다는 말에 당신은 숨이 막혔다.':s.pol>=40?'당신은 “오스트리아 여자”의 죽음을 반겼다. 그러면서도 그 아이들 생각이 났다.':'',{gabriel:'가브리엘은 왕비가 형장에서 사형 집행인의 발을 밟고 “미안합니다”라고 했다는 말을 몇 번이고 되뇌었다.'}],
 [1794,6,'robespierre',()=>'테르미도르 10일, 로베스피에르가 턱이 부서진 채 단두대에 올랐다. 구경꾼들은 환호했고, 형장에서 춤을 추는 사람도 있었다.',()=>s.pol>=50?'당신은 환호하는 사람들을 보며 혁명이 끝났다는 것을 알았다.':'당신은 오랜만에 깊이 잠들었다.',{}],
 [1795,5,'louis17',()=>'탕플의 아이가 죽었다는 소식에 성당 뒷자리에서 몰래 우는 여인들이 있었다. 의사가 아이의 심장을 손수건에 싸서 가져갔다는 말도 돌았다.',()=>s.pol<=10?'당신은 혼자 남아 죽어 간 아이를 생각하며 오래 앉아 있었다.':'왕의 아들이었지만, 그래도 열 살 아이였다.',{jules:'쥘은 그 아이의 영혼을 위해 미사를 올렸다.',louise:'루이즈는 “열 살짜리를 그렇게 혼자 두다니.” 하고 화를 냈다.'}],
 [1811,2,'roi_rome',()=>'3월 20일, 황제의 아들 로마 왕이 태어났다. 앵발리드의 대포가 울렸다. 사람들은 숨을 죽이고 세었다. 스물두 번째 대포가 울리자 아들이라는 뜻이었다. 파리 전체가 환호했다.',()=>s.pol>=0||s.flags.bonap?'당신도 거리로 나가 모자를 흔들었다. 제국에 내일이 생겼다.':'당신은 대포 소리를 세다가 그만두었다.',{antoine:'앙투안은 그날 황실 납품 계약을 따냈다며 들떠 있었다.'}],
 [1820,8,'bordeaux',()=>'9월 29일, 암살당한 베리 공작의 유복자가 태어났다. 왕당파는 “기적의 아이”라고 불렀다.',()=>s.pol<=-20?'당신은 성당에 촛불을 바쳤다. 부르봉의 대가 끊기지 않았다.':'',{jules:'쥘은 기적의 아이를 위해 감사 미사를 올렸다.'}],
 [1821,6,'napoleon',()=>'세인트헬레나에서 나폴레옹이 죽었다는 소식이 두 달 만에 파리에 닿았다. 늙은 병사들이 카페에서 소리 없이 울었다.',()=>s.flags.bonap||s.flags.centjours||soldier()?'당신도 잔을 들었다. 한 시대가 그 섬에서 끝났다.':'당신은 그 사람 때문에 죽은 젊은이들을 생각했다.',{antoine:'앙투안은 “그 덕에 부자가 된 사람이 한둘이 아니지.” 하고 씁쓸하게 웃었다.'}],
 [1834,4,'lafayette',()=>'5월 20일, 라파예트가 죽었다. 두 세계의 영웅이라는 노인의 장례 행렬을 군대가 지켰다. 사람들은 그가 한 번 더 혁명을 이끌기를 바랐었다.',()=>s.age>=50?'당신은 1789년 그가 삼색 모표를 나눠 주던 날을 기억했다.':'',{etienne:'에티엔은 “7월에 그 노인을 믿은 게 잘못이었어.” 하고 중얼거렸다.'}]];
function gFame(prev,now){s.gfame=s.gfame||{};for(const [y,m,id,pub,me,fr] of G_FAME){const mi=y*12+m;if(mi<=prev||mi>now||s.gfame[id])continue;s.gfame[id]=1;if(s.age<6)continue;
  let t=pub();const my=me();if(my)t+=' '+my;const fs=Object.entries(fr).filter(([k])=>typeof bfAlive==='function'&&bfAlive(k)).map(([,v])=>v);if(fs.length)t+=' '+pick(fs);L(t,'ev')}}

/* ---------- 진행에 끼우기 ---------- */
{const _adv=advanceSeason;advanceSeason=async function(){const a=gSnap();const prev=MI();await _adv();if(!s||s.dead)return;
  try{gFame(prev,MI())}catch(e){console.error(e)}
  let ev=[];try{ev=gDiff(a)}catch(e){console.error(e)}
  // 죽음을 먼저, 가까운 사람부터
  const rank=e=>e.t!=='death'?(e.t==='birth'?5:9):{sp:0,kid:1,fa:2,mo:2,core:3,friend:4}[e.who]??6;ev.sort((x,y)=>rank(x)-rank(y));
  let shown=0;for(const e of ev){if(s.dead)return;try{
    if(e.t==='line'){gLine(e.p);continue}
    if(shown>=2){if(e.t==='death')L(`${e.who==='fa'||e.who==='mo'?gWho(e.who):e.p.n||''}의 죽음을 슬퍼할 겨를도 없이 날이 지나갔다.`,'ev');continue}
    shown++;if(e.t==='birth')await gBirth(e.p);else if(e.who==='fa'||e.who==='mo')await gParent(e.who);else if(e.who==='sp')await gSpouse(e.p);else if(e.who==='kid')await gKid(e.p);else if(e.who==='core')await gCore(e.p);else if(e.who==='friend')await gFriend(e.p)}catch(x){console.error('grief',x)}}}}
