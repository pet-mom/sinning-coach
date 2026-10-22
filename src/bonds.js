/* ================= 다섯 벗: 기억과 후회 =================
   어린 시절 일상에서 만난 다섯 사람. 역할(혁명가·왕당파·희생자)이 아니라 함께 보낸 시간으로 기억되게 한다.
   - 인물마다 욕망·두려움·수치심·애착·자기기만이 있지만 처음부터 보여 주지 않는다. 비밀은 겪은 일 → 단서 → 진실의 세 단계로 드러나고, 끝내 드러나지 않기도 한다.
   - 기억(s.bf.mem): 함께한 장면이 기록되고, 해마다 흐려지며, 편지·물건·재회로 되살아난다. 같은 기억도 나중에 다른 의미(후회·위로·죄책감·희망)를 얻는다.
   - 같은 장면을 친구는 다르게 기억할 수 있다(their). 그 비대칭은 나중에야 알게 된다.
   - 선택은 수치보다 흔적을 남긴다: 기억, 물건, 편지, 답을 얻지 못한 질문, 후회.
   - 생애 마지막에는 업적 대신 생애 기록(편지·물건·벗들의 회고·끝내 확인하지 못한 사실)을 남긴다.
   두 갈래 시대: 1774년 이전에 태어나면 대혁명(1789~1794)이, 그 뒤에 태어나면 7월 혁명과 1832년(콜레라·6월 봉기)이 시험의 시간이 된다.
   가상의 벗(kind:'fic')과 같은 s.rel에 core 표시를 달고 들어가지만, npc.js의 무작위 운명은 받지 않고 이 파일의 이야기만 따른다. */
const BF_KEYS=['louise','etienne','jules','antoine','gabriel'];
const bfS=()=>{if(!s.bf)s.bf={st:{},f:{},mem:[],q:[],reg:[],obj:[],let:[],nx:0,amb:{},br:0,ca:0};return s.bf};
const bfR=k=>(s.rel||[]).find(r=>r.core===k)||null;
const bfMet=k=>!!bfR(k);
const bfAlive=k=>{const r=bfR(k);return !!(r&&r.alive)};
const bfF=k=>{const B=bfS();return B.f[k]||(B.f[k]={fl:{},kn:{}})};
const bfFl=(k,f)=>!!bfF(k).fl[f];
const bfSet=(k,f,v=true)=>{bfF(k).fl[f]=v};
const bfEra=()=>s.by<=1774?'rev':'july';
const bfRev=()=>bfEra()==='rev';
const bN=k=>{const r=bfR(k);return r?r.n.split(' ')[0]:''};
const bI=k=>jo(bN(k),'이','가'),bU=k=>jo(bN(k),'은','는'),bL=k=>jo(bN(k),'을','를'),bW=k=>jo(bN(k),'과','와');
const bHe=k=>{const r=bfR(k);return r&&r.sex==='F'?'그녀':'그'};
const bAge=k=>{const r=bfR(k);return r?s.year-r.by:0};
const bG=()=>s.given[0];
const bfHere=()=>s.cond==='normal'&&!s.dead;
const bfPar=()=>noble()?'생쉴피스 성당':'생테티엔뒤몽 성당';
// 관계 수치는 조용히 바꾼다(장면 글에 숫자를 붙이지 않는다)
function bfRel(k,o){const r=bfR(k);if(!r)return;for(const x in o)r[x]=clamp((r[x]||0)+o[x],0,100);r.bd=relBond(r)}
function bfFate(k,t){const r=bfR(k);if(!r)return;r.fate=r.fate||[];r.fate.push(`${s.year}년 ${t}`)}
function bfJob(k,j){const r=bfR(k);if(r)r.job=j}
function bfDie(k,cause,t,quiet){const r=bfR(k);if(!r||!r.alive)return;r.alive=false;r.dead=s.year;r.dc=cause;bfFate(k,t);
  // 그와 함께한 기억은 모두 다시 떠오르고, 다른 의미가 된다
  bfS().mem.filter(m=>m.k.includes(k)).forEach(m=>{m.w=100});
  if(!quiet)say(`${bU(k)} ${t}`,'big')}

/* ---------- 기억 · 의미 · 비밀 · 질문 · 후회 · 물건 · 편지 ---------- */
const BF_TONE=['기쁨','그리움','후회','죄책감','위로','희망','씁쓸함','부끄러움','두려움','감사','의문'];
function bfMem(id,k,t,o={}){const B=bfS();if(B.mem.some(m=>m.id===id))return null;const m={id,k:[].concat(k),y:s.year,a:s.age,t,tone:o.tone||'기쁨',obj:o.obj||null,place:o.place||null,their:o.their||null,tk:false,w:100,re:[]};B.mem.push(m);return m}
const bfM=id=>bfS().mem.find(m=>m.id===id)||null;
// 같은 기억이 새 의미를 얻는다
function bfRe(id,t,tone){const m=bfM(id);if(!m)return;m.re.push({y:s.year,a:s.age,t,tone});m.w=100}
function bfWake(id){const m=bfM(id);if(m)m.w=100}
// 친구가 그 장면을 어떻게 기억했는지 알게 된다
function bfTheirs(id,t){const m=bfM(id);if(!m)return;if(t)m.their=t;m.tk=true;m.w=100}
function bfKnow(k,sec,tier){const f=bfF(k);f.kn[sec]=Math.max(f.kn[sec]||0,tier)}
const bfKn=(k,sec)=>bfF(k).kn[sec]||0;
function bfAsk(id,k,t){const B=bfS();if(!B.q.some(q=>q.id===id))B.q.push({id,k,t,y:s.year,ans:null})}
function bfAns(id,t){const q=bfS().q.find(x=>x.id===id);if(q&&!q.ans){q.ans=t;q.ay=s.year}}
function bfReg(id,k,t){const B=bfS();if(!B.reg.some(x=>x.id===id))B.reg.push({id,k,t,y:s.year,ease:null})}
function bfEase(id,t){const x=bfS().reg.find(r=>r.id===id);if(x&&!x.ease){x.ease=t;x.ey=s.year}}
function bfObj(id,t,o={}){const B=bfS();if(B.obj.some(x=>x.id===id))return;B.obj.push({id,t,from:o.from||null,y:s.year,lost:null})}
function bfLose(id,t){const x=bfS().obj.find(o=>o.id===id);if(x&&!x.lost){x.lost=t;x.ly=s.year}}
const bfHas=id=>bfS().obj.some(o=>o.id===id&&!o.lost);
function bfLetter(k,t,o={}){bfS().let.push({k,y:s.year,t,mine:!!o.mine});(o.wake||[]).forEach(bfWake)}
const bfBrave=()=>{bfS().br++},bfCare=()=>{bfS().ca++};

/* ---------- 다섯 사람 ----------
   inner는 화면에 바로 보이지 않는다. 장면 글과 비밀(sec)의 단계로만 드러난다. */
const BF={
 louise:{sex:()=> 'F',name:()=> '루이즈 브레앙',estate:()=> 'artisan',tr:'다정',v:'vfam',pol:5,motif:'빵 꽁다리',
   home:()=> noble()?'당신 집 뒷골목의 빵집':'같은 골목의 빵집',
   w:()=> noble()?'저택 부엌문으로 빵을 나르던 빵집 딸':'같은 골목 빵집의 딸',
   inner:{desire:'누구도 굶지 않는 부엌',fear:'배고픔',shame:'글을 모른다는 것',bond:'남동생 피에르',lie:'나는 아무도 필요 없다'},
   sec:{read:['루이즈는 벽보나 편지를 늘 당신에게 읽어 달라고 했다. 눈이 침침하다고 했다.','그녀가 벽보를 거꾸로 들고 서 있는 것을 보았다.','루이즈는 글을 읽지 못했다. 당신이 읽어 준 것을 모두 외워 두었다고 했다.'],
     hunger:['루이즈는 남이 먹는 모습을 오래 지켜보곤 했다.','어린 시절 기근에 막내 동생을 잃었다고 했다. 그 뒤로 빵을 버리는 사람을 용서하지 못한다고 했다.']}},
 etienne:{sex:()=> s.sex,name:sx=>sx==='F'?'엘리즈 모렐':'에티엔 모렐',estate:()=> noble()?'bourgeois':'artisan',tr:'열정',v:'veq',pol:55,motif:'『텔레마코스의 모험』',
   home:()=> noble()?'당신 집안 저택의 별채':'라탱 구역 셋집 3층',
   w:()=> noble()?'당신 집안 집사의 아이. 가정교사의 공부방에서 함께 배웠다':'작은 학교에서 한 책상을 쓰던 아이',
   inner:{desire:'세상의 잘못을 바로잡는 사람이 되는 것',fear:'아버지처럼 되는 것',shame:'아버지가 하는 일',bond:'책 한 권',lie:'나의 분노는 남을 위한 것이다'},
   sec:{father:['에티엔은 아버지 이야기를 꺼내지 않았다.',()=>`${bN('etienne')}의 아버지는 ${noble()?'당신 집안의 집사로, 소작인들의 밀린 지대를 받아 내는':'집달리로, 빚진 집의 침대와 냄비를 끌어내는'} 일을 했다.`,()=>`${bI('etienne')} 법을 바꾸려 한 것은 아버지의 일을 지우고 싶어서였다. ${bHe('etienne')}는 그것을 정의라고 불렀다.`],
     name:[()=>`그날 밤 ${bU('etienne')} 명단을 든 채 오래 서 있었다.`,()=>`나중에 들으니 그 명단에서 한 이름이 빠져 있었다고 했다.`,()=>`${bI('etienne')} 직접 그 이름을 지웠다. ${bHe('etienne')}는 그 일을 누구에게도, 당신에게도 말하지 않았다.`]}},
 jules:{sex:()=> 'M',name:()=> '쥘 오베르',estate:()=> 'artisan',tr:'경건',v:'vord',pol:-40,motif:'참새 깃털과 종소리',
   home:()=> `${bfPar()} 종탑 아래`,
   w:()=> `${bfPar()} 종지기의 아이`,
   inner:{desire:'조용한 삶과 신앙',fear:'큰 소리와 강요된 선택',shame:'말더듬',bond:'성당의 종',lie:'나는 겁쟁이다'},
   sec:{stutter:[()=>`${bU('jules')} 말을 더듬었다. 노래할 때만은 더듬지 않았다.`,()=>`${bU('jules')} 스스로를 겁쟁이라고 불렀다.`,()=>`${bU('jules')} 양심에 걸린 일 하나만은 끝내 물러서지 않았다. 겁이 없어서가 아니었다.`]}},
 antoine:{sex:()=> s.sex,name:sx=>sx==='F'?'앙투아네트 르페브르':'앙투안 르페브르',estate:()=> 'artisan',tr:'야심',v:'vfam',pol:10,motif:'은단추',
   home:()=> '생드니 거리 잡화상 2층',
   w:()=> '생드니 거리 잡화상의 아이. 무엇이든 사고팔던 아이',
   inner:{desire:'다시는 가난하지 않은 것',fear:'가족의 가난',shame:'빚 때문에 갇힌 아버지',bond:'어머니',lie:'내가 하는 일은 모두 가족을 위한 것이다'},
   sec:{silence:[()=>`열다섯 살 무렵 어느 날, ${bI('antoine')} 말을 하다 말고 갑자기 입을 다물었다. 이유는 알 수 없었다.`,()=>`몇 달 뒤 받은 편지에서, ${bN('antoine')}의 아버지가 빚 때문에 감옥에 갇혔다는 것을 알았다.`,()=>`그날 ${bU('antoine')} 도움을 청하려 했다. 그러나 우정이 동정으로 바뀌는 것이 싫어 그만두었다.`]}},
 gabriel:{sex:()=> s.sex,name:sx=>noble()?'가브리엘 드 사브리':'가브리엘 마르상',estate:()=> noble()?(s.estate==='robe'?'robe':'epee'):'bourgeois',tr:'허영',v:'vhon',pol:-15,motif:'푸른 리본',
   home:()=> noble()?'생제르맹 문밖의 이웃 저택':'생토노레 거리 포목 도매상 저택',
   w:()=> noble()?'이웃 저택의 아이. 늘 새 옷을 입고 다녔다':'포목 도매상의 아이. 늘 새 옷을 입고 다녔다',
   inner:{desire:'남들의 눈에 특별한 사람으로 남는 것',fear:'평범하게 잊히는 것',shame:'개가 달려들던 날 달아난 일',bond:'푸른 리본',lie:'나는 겉멋만 든 겁쟁이다'},
   sec:{dog:[()=>`개가 달려들던 날 ${bU('gabriel')} 달아났다.`,()=>`${bU('gabriel')} 그날 일을 한 번도 잊은 적이 없었다.`,()=>`${bI('gabriel')} 목숨을 걸고 남을 숨겨 준 것은 그날의 자신을 용서하지 못해서였다.`]}}
};
const bfSecT=(k,sec,i)=>{const x=BF[k].sec[sec][i];return typeof x==='function'?x():x};
function bfMake(k){const T0=BF[k];const sex=T0.sex();const r={kind:'fic',core:k,fid:'c_'+k,n:T0.name(sex),sex,role:'친구',by:s.by+(k==='gabriel'?1:k==='antoine'?-1:0),estate:T0.estate(),job:null,home:T0.home(),tr:T0.tr,v:T0.v,pol:T0.pol,po:0,eng:k==='etienne'?80:30,
  fac:null,grp:null,close:45,trust:40,resp:30,riv:k==='gabriel'?25:5,hate:0,alive:true,cond:'normal',fate:[],y:s.year,w:T0.w(),inf:0,mar:null,kids:0,cler:false,refr:false};
  s.rel=s.rel||[];s.rel.push(r);bfF(k);r.bd=relBond(r);return r}

/* ---------- 장면 도구 ---------- */
async function bfScene(title,fr,text,opts){opts=opts.filter(Boolean);const i=await Q(title,fr,typeof text==='function'?text():text,opts.map(o=>({l:o.l,s:o.s||'',a:o.a||'',dis:o.dis})));
  try{await opts[i].f()}catch(e){console.error(e)}await done();return i}
const BFB=[];
// k: 사람(또는 'group'), when: 일어날 조건, until: 이 조건이 되면 지나간 것으로 친다(miss 실행), dead: 그 사람이 죽은 뒤에도 일어나는 장면
const beat=(k,id,o)=>BFB.push(Object.assign({k,id,gap:3},o));
const bfMetN=()=>BF_KEYS.filter(bfMet).length;
const bfList=ks=>{const n=ks.map(bN);if(n.length<2)return n[0]||'';return n.slice(0,-1).map((x,i)=>i<n.length-2?x:jo(x,'과','와')).join(', ')+' '+n[n.length-1]};
const bfListW=ks=>jo(bfList(ks),'과','와');
const bfAt=(k,c)=>bfMet(k)&&bfAlive(k)&&c;

/* ================= 어린 시절: 사소한 일상으로 만나기 ================= */
beat('louise','lo_meet',{when:()=>s.age>=6&&bfHere(),run:async()=>{const r=bfMake('louise');const L=bN('louise');
  await bfScene('빵집 뒷계단','le quignon',noble()?`새벽마다 부엌문으로 빵 바구니를 나르는 여자아이가 있다. 빵집 딸 ${jo(L,'이다','다')}. 오늘은 바구니를 내려놓더니 갓 구운 빵의 꽁다리를 뚝 떼어 당신에게 내민다. “제일 바삭한 데야. 아무한테나 안 줘.”`:`골목 끝 빵집 뒷계단에 밀가루를 뒤집어쓴 여자아이가 앉아 있다. 빵집 딸 ${jo(L,'이다','다')}. 갓 구운 빵의 꽁다리를 뚝 떼어 당신에게 내민다. “제일 바삭한 데야. 아무한테나 안 줘.”`,[
   {l:'받아서 먹는다',a:'social',f:()=>{bfMem('m_bread','louise',`빵집 뒷계단에서 ${bI('louise')} 갓 구운 빵의 꽁다리를 떼어 주었다. 제일 바삭한 데라고 했다.`,{obj:'빵 꽁다리',place:'빵집 뒷계단',their:'그 아이는 받자마자 다 먹어 버렸다. 고맙다는 말도 잊고. 나는 그게 좋았다.'});bfRel('louise',{close:6});say(`${bU('louise')} 그 뒤로 날마다 꽁다리를 남겨 두었다.`)}},
   {l:'반으로 갈라 나눠 먹는다',a:'family',f:()=>{bfSet('louise','shared');bfMem('m_bread','louise',`빵집 뒷계단에서 ${bI('louise')} 갓 구운 빵의 꽁다리를 떼어 주었다. 반으로 갈라 나눠 먹었다.`,{obj:'빵 꽁다리',place:'빵집 뒷계단',their:'반을 돌려준 아이는 처음이었다. 그 꽁다리가 그날 내 저녁이었다는 걸 그 아이는 몰랐다.'});bfRel('louise',{close:10,trust:5});say(`둘이서 꽁다리를 반씩 나눠 먹었다. ${bU('louise')} 이상하다는 듯이 당신을 보더니 웃었다.`)}},
   {l:'배가 고프지 않다며 사양한다',a:'safe',f:()=>{bfSet('louise','refused');bfMem('m_bread','louise',`빵집 뒷계단에서 ${bI('louise')} 빵 꽁다리를 내밀었지만 받지 않았다.`,{tone:'그리움',place:'빵집 뒷계단',their:'그 아이는 내 빵을 받지 않았다. 부잣집 애들은 다 그런 줄 알았다. 그래도 이튿날 또 찾아왔다.'});say(`${bU('louise')} 어깨를 으쓱했다. 이튿날 당신은 다시 뒷계단에 갔다.`)}}])}});

beat('etienne','et_meet',{when:()=>s.age>=7&&s.month>=3&&bfHere(),run:async()=>{bfMake('etienne');const E=bN('etienne');const sch=noble()?'가정교사의 공부방':lit()?'본당의 작은 학교':'본당 교리반';
  bfJob('etienne',noble()?'집사의 아이':'학교에 다니는 아이');
  await bfScene('한 책상','Télémaque',noble()?`집사의 아이 ${jo(E,'이','가')} ${sch}에서 당신과 함께 배우게 되었다. 라틴어 문법책 밑에 다른 책을 몰래 펴 놓고 있다. 『텔레마코스의 모험』이다. 표지가 다 해졌다.`:lit()?`${sch}의 긴 의자에 함께 앉은 아이 ${jo(E,'이','가')} 교리문답 밑에 다른 책을 몰래 펴 놓고 있다. 『텔레마코스의 모험』이다. 표지가 다 해졌다.`:`${sch}에서 옆자리에 앉은 아이 ${jo(E,'이','가')} 신부님 몰래 다른 책을 펴 놓고 있다. 『텔레마코스의 모험』이다. 당신이 글을 모른다고 하자, 아이는 귓속말로 읽어 주기 시작한다.`,[
   {l:'같이 읽자고 한다',a:'study social',f:()=>{bfSet('etienne','read');bfMem('m_book','etienne',`${sch}에서 ${bW('etienne')} 한 책상에 앉아 『텔레마코스의 모험』을 몰래 읽었다. 멘토르가 “좋은 왕은 백성을 위해 있다”고 말하는 대목에서 둘 다 숨을 죽였다.`,{obj:'『텔레마코스의 모험』',place:sch,their:'그 아이는 책장을 넘기는 속도가 나보다 느렸다. 나는 기다렸다. 그게 좋았다.'});bfRel('etienne',{close:10});say(`${E}의 책은 보리수 잎 하나가 책갈피 대신 꽂혀 있었다.`)}},
   {l:'선생님에게 이른다',a:'safe',f:()=>{bfSet('etienne','snitch');bfMem('m_book','etienne',`${sch}에서 ${bI('etienne')} 몰래 읽던 『텔레마코스의 모험』을 선생님께 일렀다. 책은 빼앗겼다.`,{tone:'부끄러움',place:sch,their:'그 아이가 일렀다. 책은 빼앗겼지만, 그 덕에 나는 내용을 다 외워야 했다. 지금도 외운다.'});bfRel('etienne',{riv:15,close:-5});say(`${bU('etienne')} 손바닥을 맞고도 울지 않았다. 이튿날 아무 일 없다는 듯이 당신 옆에 앉았다.`)}},
   {l:'모른 척한다',a:'safe',f:()=>{bfMem('m_book','etienne',`${sch}에서 옆자리 ${bI('etienne')} 『텔레마코스의 모험』을 몰래 읽는 것을 모른 척해 주었다.`,{place:sch,their:'그 아이는 못 본 척해 주었다. 나는 그 아이가 정말 못 본 줄 알았다.'});bfRel('etienne',{close:4})}}])}});

beat('jules','ju_meet',{when:()=>s.age>=8&&bfHere(),run:async()=>{bfMake('jules');const J=bN('jules');bfJob('jules','종지기의 아이');
  await bfScene('종탑 계단 아래','le moineau',`${bfPar()} 종탑 계단 아래에서 종지기의 아이 ${jo(J,'이','가')} 궤짝 뒤에 무언가를 숨기고 있다. 날개 다친 참새다. 아이는 당신을 보더니 얼굴이 새빨개져 말을 더듬는다. “시, 신부님한테는… 마, 말하지 마.”`,[
   {l:'비밀로 해 주겠다고 한다',a:'social',f:()=>{bfSet('jules','kept');bfMem('m_sparrow','jules',`종탑 계단 밑에 ${bI('jules')} 날개 다친 참새를 숨겨 두었다. 둘만의 비밀로 하기로 했다. 참새는 열흘 뒤 날아갔다.`,{obj:'참새 깃털',place:'종탑 계단',their:'그 아이는 한 번도 나를 흉내 내며 더듬지 않았다. 그런 아이는 처음이었다.'});bfObj('feather',`${bI('jules')} 준 참새 깃털`,{from:'jules'});bfRel('jules',{close:10,trust:12});say(`참새가 날아간 날, ${bU('jules')} 당신에게 깃털 하나를 주었다. 그날은 한 번도 더듬지 않았다.`)}},
   {l:'더듬는 말투를 흉내 낸다',a:'bold',f:()=>{bfSet('jules','mock');bfMem('m_sparrow','jules',`종탑 계단 밑에서 ${bI('jules')} 참새를 숨기는 것을 보았다. 더듬는 말투를 흉내 냈더니 아이가 울었다.`,{tone:'부끄러움',place:'종탑 계단',their:'그 아이도 다른 애들처럼 웃었다. 그래도 참새 일은 아무에게도 말하지 않았다. 그래서 용서했다.'});bfRel('jules',{close:-4,riv:5});say(`${bU('jules')} 울면서도 참새를 꼭 감싸 쥐고 있었다.`)}},
   {l:'신부님께 알린다',a:'pious safe',f:()=>{bfSet('jules','told');bfMem('m_sparrow','jules',`종탑 계단 밑의 참새를 신부님께 알렸다. 신부님은 참새를 창밖으로 날려 보냈다.`,{tone:'씁쓸함',place:'종탑 계단',their:'참새는 아직 날 수 없었다. 그날 밤 종탑 아래에서 참새를 찾았지만 없었다.'});bfRel('jules',{trust:-8});say(`${bU('jules')} 아무 말도 하지 않았다. 원래 말이 적은 아이였다.`)}}])}});

beat('antoine','an_meet',{when:()=>s.age>=9&&bfHere(),run:async()=>{bfMake('antoine');const A=bN('antoine');bfJob('antoine','잡화상의 아이');
  await bfScene('구슬 내기','le bouton d’argent',`생드니 거리의 ${bU('antoine')} 무엇이든 사고판다. 구슬, 단추, 깨진 거울 조각. 오늘은 구슬 내기를 하자며 걸 것을 내놓는다. 낡은 외투에서 뜯어낸 은단추다. “진짜 은이야. 너는 구슬 세 개만 걸어.”`,[
   {l:'내기를 하고, 딴 단추를 갖는다',a:'bold',f:()=>{bfSet('antoine','button');bfObj('button',`${A}에게서 딴 은단추`,{from:'antoine'});bfMem('m_button','antoine',`구슬 내기에서 ${A}의 은단추를 땄다. ${bU('antoine')} 돌려 달라는 말을 하지 않았다. 다음엔 꼭 되찾겠다며 웃었다.`,{obj:'은단추',place:'생드니 거리',their:'아버지 외투에 남은 마지막 은단추였다. 그날 저녁 아버지는 단추가 어디 갔느냐고 묻지 않았다. 그게 더 아팠다.'});bfRel('antoine',{close:6,riv:8});say(`${bU('antoine')} 지고도 웃었다. 그런데 집에 가는 길에 한 번 뒤돌아보았다.`)}},
   {l:'내기를 하고, 딴 단추를 돌려준다',a:'social',f:()=>{bfSet('antoine','gave');bfMem('m_button','antoine',`구슬 내기에서 ${A}의 은단추를 땄다가 돌려주었다. ${bU('antoine')} 한참 단추를 만지작거리다 “빚진 거야.”라고 했다.`,{obj:'은단추',place:'생드니 거리',their:'그 아이는 단추를 돌려주었다. 나는 그 빚을 평생 기억했다. 빚은 갚아야 하는 거니까.'});bfRel('antoine',{close:8,resp:10});say(`${bU('antoine')} 단추를 주머니 깊숙이 넣었다.`)}},
   {l:'내기를 하지 않는다',a:'safe',f:()=>{bfMem('m_button','antoine',`${bI('antoine')} 은단추를 걸고 구슬 내기를 하자고 했지만 하지 않았다.`,{tone:'그리움',place:'생드니 거리',their:'그 아이는 내기를 하지 않았다. 조심성 많은 아이였다. 나는 그런 사람이 부러웠다.'});bfRel('antoine',{close:3});say(`${bU('antoine')} 어깨를 으쓱하더니 다른 아이와 내기를 했다. 그리고 졌다.`)}}])}});

beat('gabriel','ga_meet',{when:()=>s.age>=10&&bfHere(),run:async()=>{bfMake('gabriel');const Ga=bN('gabriel');bfJob('gabriel',noble()?'이웃 저택의 아이':'도매상의 아이');
  say(`레알 시장 뒷골목. ${bU('gabriel')} 당신의 낡은 신발을 보고 깔깔 웃었다. 그때 푸줏간의 커다란 개가 줄을 끊고 달려들었다. ${bU('gabriel')} 비명을 지르며 달아났고, 개는 당신의 다리를 물었다.`+fx({hp:-2}),'ev');
  await bfScene('누가 먼저 도망쳤나','le chien du boucher',`이튿날, 골목 아이들이 붕대 감은 당신 다리를 둘러싸고 묻는다. “누가 먼저 도망쳤어?” 저만치 ${bI('gabriel')} 새 옷을 입은 채 굳은 얼굴로 서 있다.`,[
   {l:'“둘 다 도망쳤어.”라고 말한다',a:'social',f:()=>{bfSet('gabriel','kept');bfKnow('gabriel','dog',1);bfMem('m_dog','gabriel',`푸줏간 개가 달려들던 날 ${bU('gabriel')} 달아났고, 당신은 다리를 물렸다. 아이들에게는 둘 다 도망쳤다고 말했다.`,{tone:'그리움',place:'레알 시장 뒷골목',their:'그 아이는 내가 먼저 도망쳤다고 말하지 않았다. 나는 평생 그 거짓말에 빚졌다.'});bfObj('ribbon',`${bI('gabriel')} 말없이 쥐여 준 푸른 리본`,{from:'gabriel'});bfRel('gabriel',{close:10,trust:12,riv:-10});say(`며칠 뒤 ${bI('gabriel')} 말없이 푸른 리본 하나를 당신 손에 쥐여 주었다.`)}},
   {l:'“가브리엘이 먼저 도망쳤어.”라고 말한다',a:'bold',f:()=>{bfSet('gabriel','told');bfKnow('gabriel','dog',1);bfMem('m_dog','gabriel',`푸줏간 개가 달려들던 날 ${bU('gabriel')} 달아났고, 당신은 다리를 물렸다. 아이들에게 ${bI('gabriel')} 먼저 도망쳤다고 말했다. 다들 웃었다.`,{tone:'씁쓸함',place:'레알 시장 뒷골목',their:'모두가 웃었다. 그 아이는 사실을 말했을 뿐이다. 나는 그날부터 다시는 도망치지 않겠다고 다짐했다.'});bfRel('gabriel',{riv:15,close:-4});say(`${bU('gabriel')} 한 달 동안 골목에 나오지 않았다.`)}},
   {l:'아무 말도 하지 않는다',a:'safe',f:()=>{bfSet('gabriel','silent');bfKnow('gabriel','dog',1);bfMem('m_dog','gabriel',`푸줏간 개가 달려들던 날 ${bU('gabriel')} 달아났고, 당신은 다리를 물렸다. 누가 먼저 도망쳤느냐는 물음에 아무 말도 하지 않았다.`,{tone:'그리움',place:'레알 시장 뒷골목',their:'그 아이는 아무 말도 하지 않았다. 차라리 나를 비웃었으면 했다.'});bfRel('gabriel',{close:4})}}])}});

const BF_LAW={debt:'빚을 못 갚으면 사람을 가두는 법',tax:'가난한 사람만 무거운 세금을 내는 법',birth:'태어난 집안이 평생을 정하는 법',vote:'돈 없는 사람은 투표도 못 하게 하는 법',seize:()=>noble()?'밀린 지대 때문에 남의 집 냄비를 가져갈 수 있게 하는 법':'빚진 집의 침대를 끌어낼 수 있게 하는 법'};
const bfLawN=k=>{const x=BF_LAW[k];return typeof x==='function'?x():x};
// 그 법이 실제로 없어진 때(이 해 이후 에티엔이 소식을 전한다). seize는 끝내 없어지지 않는다.
const bfLawEnd=k=>({debt:bfRev()?1793.2:1848.2,tax:1789.6,birth:1790.45,vote:1848.2})[k]||null;
beat('etienne','et_promise',{when:()=>s.age>=10&&s.year>=bfR('etienne').y+1&&bfHere(),until:()=>s.age>=15,run:async()=>{const E=bN('etienne');const post=T()>=1790;
  await bfScene('퐁뇌프 난간','la promesse',`해 질 녘, ${bW('etienne')} 퐁뇌프 난간에 나란히 걸터앉았다. 앙리 4세 기마상 너머로 강물이 붉다. ${bI('etienne')} 불쑥 말한다. “우리가 어른이 되면, 세상에서 가장 부당한 법을 하나 없애자. 딱 하나만. 무슨 법이 좋을까?”`,[
   {l:'“빚을 못 갚으면 사람을 가두는 법.”',a:'radical',f:()=>{bfS().law='debt'}},
   post?{l:'“돈 없는 사람은 투표도 못 하게 하는 법.”',a:'radical',f:()=>{bfS().law='vote'}}:{l:'“가난한 사람만 무거운 세금을 내는 법.”',a:'radical',f:()=>{bfS().law='tax'}},
   post?null:{l:'“태어난 집안이 평생을 정하는 법.”',a:'radical',f:()=>{bfS().law='birth'}},
   {l:'“모르겠어. 네가 골라.”',a:'safe',f:()=>{bfS().law='seize';bfKnow('etienne','father',1)}}]);
  const law=bfS().law,ln=bfLawN(law);
  bfMem('m_promise','etienne',law==='seize'?`퐁뇌프 난간에 ${bW('etienne')} 나란히 앉아 약속했다. “어른이 되면 세상에서 가장 부당한 법을 하나 없애자.” ${bI('etienne')} 고른 법은 ‘${ln}’이었다. 고르고 나서 한참 강물만 보았다.`:`퐁뇌프 난간에 ${bW('etienne')} 나란히 앉아 약속했다. “어른이 되면 세상에서 가장 부당한 법을 하나 없애자.” 당신이 고른 법은 ‘${ln}’이었다.`,
    {tone:'희망',place:'퐁뇌프',their:law==='seize'?'그 아이가 나더러 고르라고 했다. 그래서 그 법을 말해 버렸다. 왜 그 법이었는지는 묻지 않았다. 고마웠다.':'그날 그 아이가 고른 법보다, 내가 차마 말하지 못한 법이 더 오래 생각났다.'});
  bfRel('etienne',{close:8,trust:8});say(law==='seize'?`${bI('etienne')} 고른 법을 듣고, 당신은 왜 하필 그 법이냐고 묻지 않았다.`:`${bU('etienne')} 진지하게 고개를 끄덕였다. “좋아. 약속이야.”`)}});

beat('group','g_scold',{when:()=>s.age>=11&&bfMetN()>=3&&bfHere(),until:()=>s.age>=14,run:async()=>{const ks=BF_KEYS.filter(k=>bfMet(k)&&bfAlive(k));const who=bfList(ks);const tch=noble()?'가정교사':'본당 신부';
  const TH={louise:'사과 맛밖에 기억나지 않는다. 그렇게 단 사과는 그 뒤로 없었다.',etienne:'그 아이가 나섰을 때 나는 나서지 못했다. 그게 오래 부끄러웠다.',jules:'신부님이 “용기는 매를 맞는 쪽에 있다”고 하셨다. 그 말을 평생 외웠다.',antoine:'사실 담을 넘자고 한 건 나였다. 다들 그걸 알면서 아무도 말하지 않았다.',gabriel:'아버지가 돈을 보내 나만 빠졌다. 그날 다른 아이들의 손바닥이 부어 있었다.'};
  const mk=(t,ov={})=>{const m=bfMem('m_apple',ks,t,{place:'카르투지오 수도원 과수원',tone:'기쁨'});if(m){m.their=Object.assign({},TH,ov);Object.keys(m.their).forEach(k=>{if(!ks.includes(k))delete m.their[k]})}ks.forEach(k=>bfRel(k,{close:4}))};
  await bfScene('수도원 과수원','les pommes des Chartreux',`${who}, 그리고 당신. 카르투지오 수도원 과수원 담을 넘어 사과를 따다가 수사에게 붙잡혔다. ${tch} 앞에 줄지어 섰다. “누가 먼저 넘자고 했느냐?” 모두 발끝만 내려다본다.`,[
   {l:'“제가 했습니다.” 하고 나선다',a:'bold',f:()=>{bfBrave();mk(`${bfList(ks)}, 그리고 당신이 함께 수도원 과수원 담을 넘었다가 붙잡혔다. 당신이 먼저 나섰다. 손바닥을 열 대 맞았다.`);say('손바닥을 열 대 맞았다. 저녁에 친구들이 몰래 사과 한 알을 남겨 두었다.')}},
   bfMet('gabriel')?{l:`“${bN('gabriel')}가 하자고 했어요.”`,a:'safe',f:()=>{bfCare();mk(`${bfList(ks)}, 그리고 당신이 함께 수도원 과수원 담을 넘었다가 붙잡혔다. 당신은 ${bN('gabriel')}의 이름을 댔다.`,{gabriel:'그 아이가 내 이름을 댔다. 맞는 말은 아니었지만 틀린 말도 아니었다. 다들 내가 빠져나갈 걸 알았으니까.'});bfRel('gabriel',{riv:8});say(`${bN('gabriel')}의 집에서 돈을 보내 왔고, 나머지는 모두 손바닥을 맞았다.`)}}:null,
   {l:'아무도 말하지 않는다',a:'social',f:()=>{mk(`${bfList(ks)}, 그리고 당신이 함께 수도원 과수원 담을 넘었다가 붙잡혔다. 아무도 입을 열지 않아 모두 함께 벌을 받았다.`,{antoine:'아무도 말하지 않았다. 그날 우리가 한 패라는 걸 알았다. 그런 날은 다시 오지 않았다.'});say('모두 함께 손바닥을 맞았다. 돌아오는 길에 누군가 먼저 웃음을 터뜨렸다.')}}])}});

beat('group','g_bridge',{when:()=>s.age>=13&&bfMetN()>=3&&bfHere(),until:()=>s.age>=17,run:async()=>{const ks=BF_KEYS.filter(k=>bfMet(k)&&bfAlive(k));
  const go={louise:'빵집 일을 도맡게 되었다',etienne:noble()?'집사 일을 거드는 서기가 되었다':'공증인 사무소의 사환이 되었다',jules:'성가대 장학생으로 신학교 예비 학교에 가게 되었다',antoine:'포목상 견습으로 들어가게 되었다',gabriel:noble()?'쥘리 기숙학교로 떠나게 되었다':'루이르그랑 콜레주 기숙생이 되었다'};
  const J={louise:'빵집 일꾼',etienne:noble()?'집사 서기':'공증인 사무소 사환',jules:'신학교 예비 학생',antoine:'포목상 견습',gabriel:'기숙학교 학생'};ks.forEach(k=>bfJob(k,J[k]));
  const t=ks.map(k=>`${bU(k)} ${go[k]}`).join('. ')+'.';
  await bfScene('다리 위의 저녁','le Pont-Neuf',`각자 다른 길로 떠나기 전날, ${bfListW(ks)} 당신은 퐁뇌프에 모였다. ${t} 누군가 말한다. “이제 이렇게 다 같이 모이기는 어렵겠다.”`,[
   {l:'“스무 해 뒤 오늘, 여기서 다시 만나자.”',a:'social',f:()=>{bfS().meetY=s.year+20;bfS().meetM=s.month;bfMem('m_bridge',ks,`떠나기 전날 퐁뇌프에 다 같이 모였다. 스무 해 뒤 같은 날, 같은 자리에서 다시 만나자고 약속했다.`,{tone:'희망',place:'퐁뇌프'});say('모두 손을 포개고 맹세했다. 당신은 그 날짜를 마음에 새겼다.')}},
   {l:'난간 돌에 각자 이름을 새기자고 한다',a:'bold',f:()=>{bfS().carved=true;bfMem('m_bridge',ks,`떠나기 전날 퐁뇌프에 다 같이 모였다. 칼끝으로 난간 돌에 다섯 이름을 나란히 새겼다.`,{tone:'희망',place:'퐁뇌프',obj:'난간 돌의 이름들'});say('삐뚤빼뚤한 이름들이 난간 돌에 남았다.')}},
   {l:'아무 말 없이 함께 강물을 본다',a:'safe',f:()=>{bfMem('m_bridge',ks,`떠나기 전날 퐁뇌프에 다 같이 모였다. 아무도 말하지 않고 해가 질 때까지 강물을 보았다.`,{tone:'그리움',place:'퐁뇌프'});say('해가 졌다. 아무도 먼저 일어나지 않았다.')}}]);ks.forEach(k=>bfRel(k,{close:5}))}});

/* ================= 자라면서: 내면의 단서 ================= */
const BF_DEARTH=[1767,1768,1770,1771,1775,1784,1785,1788,1789,1795,1796,1802,1812,1816,1817,1828,1829,1846,1847];
const bfDear=()=>{let p=1;try{p=econ().price}catch(e){}return p>=1.2||BF_DEARTH.includes(s.year)};
beat('louise','lo_hunger',{when:()=>s.age>=11&&bfAlive('louise')&&bfDear()&&bfHere(),until:()=>s.age>=26,run:async()=>{const L=bN('louise');bfJob('louise','빵 배달꾼');bfKnow('louise','hunger',1);
  bfRe('m_bread','그때 그 꽁다리가 그녀 몫의 저녁이었을지도 모른다는 생각이 들었다.','씁쓸함');
  await bfScene('빈 진열대','la cherté',`빵값이 올랐다. ${L}네 빵집 진열대가 반쯤 비었다. 그 집 식구들은 하루 한 끼를 줄였다고 한다. 이제 둘은 빵집 뒷계단 대신 ${bfPar()} 계단에서 만난다. ${bU('louise')} 새벽 네 시부터 빵 바구니를 지고 거리를 돈다. 오늘 ${bU('louise')} 당신이 먹는 것을 오래 바라본다.`,[
   {l:'집에서 빵을 몰래 가져다준다',a:'family social',f:()=>{bfKnow('louise','hunger',2);bfMem('m_loaf','louise',`빵값이 오른 해, 집에서 빵을 몰래 가져다 ${L}에게 주었다. 받지 않으려다 결국 받았다. 그날 그녀는 기근에 잃은 막내 동생 이야기를 했다.`,{tone:'기쁨',place:`${bfPar()} 계단`,their:'그 아이는 내가 배고픈 걸 봤다. 그게 빵보다 오래 남았다. 고마웠고, 창피했다.'});bfRel('louise',{close:8,trust:6});say(`${bU('louise')} 빵을 앞치마에 싸서 집으로 가져갔다. 자기는 한 입도 먹지 않았다.`)}},
   {l:'모르는 척 예전처럼 대한다',a:'safe',f:()=>{bfMem('m_loaf','louise',`빵값이 오른 해, ${bI('louise')} 배고픈 것을 알면서도 모르는 척 예전처럼 대했다.`,{tone:'그리움',place:`${bfPar()} 계단`,their:'그 아이는 모르는 척해 주었다. 그해 받은 것 가운데 그게 가장 좋은 것이었다.'});bfRel('louise',{close:4});say('둘은 예전처럼 쓸데없는 이야기로 웃었다.')}},
   {l:'동전을 쥐여 준다',a:'social',f:()=>{bfMem('m_loaf','louise',`빵값이 오른 해, ${L}에게 동전을 쥐여 주었다. “나는 거지가 아니야.” 그녀는 동전을 던지고 가 버렸다.`,{tone:'부끄러움',place:`${bfPar()} 계단`,their:'그 아이가 동전을 내밀었다. 나는 동전을 던져 버렸다. 그날 밤 그 동전을 찾으러 다시 나갔다. 찾지 못했다.'});bfRel('louise',{close:-6,trust:-4});say(`${bU('louise')} 한 달 동안 당신을 피했다.`)}}])}});

beat('louise','lo_read',{when:()=>s.age>=13&&bfAlive('louise')&&s.year>=(bfM('m_loaf')?bfM('m_loaf').y+1:0)&&bfHere(),until:()=>s.age>=32,run:async()=>{const L=bN('louise');
  if(!lit()){await bfScene('벽보 앞에서','l’affiche',`${bfPar()} 앞에 새 벽보가 붙었다. 사람들이 웅성거린다. ${bI('louise')} 당신 옆구리를 찌른다. “뭐라고 쓰여 있어?” 당신도 글을 모른다. 둘은 서로를 보다가 웃음을 터뜨린다.`,[
    {l:'지나가는 학생에게 읽어 달라고 한다',a:'social',f:()=>{bfKnow('louise','read',3);bfSet('louise','both');bfMem('m_read','louise',`벽보 앞에서 ${L}도 당신도 글을 모른다는 것을 알았다. 둘이서 한참 웃었다.`,{place:'성당 앞 벽보',their:'그 아이도 몰랐다. 세상에 나 혼자가 아니라는 걸 그날 알았다.'});bfRel('louise',{close:8})}}]);return}
  bfKnow('louise','read',2);
  await bfScene('거꾸로 든 전단','l’affiche',`${bfPar()} 앞에 새 벽보가 붙었다. ${bI('louise')} 당신을 불러 세운다. “눈이 침침해서 그래. 읽어 줘.” 그런데 그녀가 손에 든 전단은 거꾸로 되어 있다.`,[
   {l:'모른 척 읽어 준다',a:'safe social',f:()=>{bfSet('louise','pretend');bfMem('m_read','louise',`${bI('louise')} 거꾸로 든 전단을 모른 척 읽어 주었다.`,{place:'성당 앞 벽보',their:'그 아이는 끝까지 모른 척했다. 그래서 나는 들킨 줄도 몰랐다.'});bfAsk('q_lou_read','louise',`${bU('louise')} 정말 글을 읽지 못했을까?`);say(`${bU('louise')} 고개를 끄덕이며 들었다. 그리고 당신이 읽어 준 문장을 소리 내어 한 번 더 외웠다.`)}},
   {l:'조용히 글을 가르쳐 주겠다고 한다',a:'study social',f:()=>{const r=bfR('louise');bfKnow('louise','read',3);
     if(r.close>=55||R()<.4){bfSet('louise','taught');bfMem('m_read','louise',`${bI('louise')} 거꾸로 든 전단을 보고, 조용히 글을 가르쳐 주겠다고 했다. ${bU('louise')} 한참 말이 없더니 고개를 끄덕였다. 겨울 내내 빵집 뒷계단에서 철자를 익혔다.`,{place:'빵집 뒷계단',their:'처음 읽은 단어는 내 이름이었다. 그 아이가 밀가루 위에 손가락으로 써 주었다.'});bfRel('louise',{close:10,trust:10});say(`봄이 오자 ${bU('louise')} 떠듬떠듬 벽보를 읽었다. 첫 문장을 다 읽고 그녀는 울 것 같은 얼굴로 웃었다.`)}
     else{bfSet('louise','refuse');bfMem('m_read','louise',`${bI('louise')} 거꾸로 든 전단을 보고 글을 가르쳐 주겠다고 했다. “나는 필요 없어. 아무도 필요 없어.”`,{tone:'씁쓸함',place:'성당 앞 벽보',their:'필요 없다고 했다. 사실은 그 아이 앞에서 틀리는 게 싫었다.'});say(`${bU('louise')} 전단을 구겨 쥐고 가 버렸다.`)}}},
   {l:'거꾸로 들었다고 놀린다',a:'bold',f:()=>{bfSet('louise','teased');bfMem('m_read','louise',`${bI('louise')} 거꾸로 든 전단을 보고 놀렸다. 그녀는 얼굴이 빨개져 가 버렸다.`,{tone:'부끄러움',place:'성당 앞 벽보',their:'그 아이가 웃었다. 나는 그 뒤로 그 아이 앞에서 다시는 종이를 들지 않았다.'});bfRel('louise',{close:-8});bfAsk('q_lou_read','louise',`${bU('louise')} 정말 글을 읽지 못했을까?`)}}])}});

beat('etienne','et_seize',{when:()=>s.age>=14&&bfAlive('etienne')&&bfHere(),until:()=>s.age>=21,run:async()=>{const E=bN('etienne');bfKnow('etienne','father',2);
  await bfScene('끌려 나오는 침대','la saisie',noble()?`당신 집안 소작인의 집 앞이 시끄럽다. 집사가 밀린 지대 대신 냄비와 이불을 끌어내고 있다. 수레를 붙든 아이는 ${jo(E,'이다','다')}. 집사는 ${E}의 아버지다. 눈이 마주친다. ${bU('etienne')} 고개를 돌린다.`:`옆 골목 과부의 집 앞이 시끄럽다. 집달리가 빚 대신 침대와 냄비를 끌어내고 있다. 수레를 붙든 아이는 ${jo(E,'이다','다')}. 집달리는 ${E}의 아버지다. 눈이 마주친다. ${bU('etienne')} 고개를 돌린다.`,[
   {l:'이튿날 그 일을 묻는다',a:'social',f:()=>{bfSet('etienne','asked');bfMem('m_seize','etienne',`${E}의 아버지가 빚진 집의 살림을 끌어내는 것을 보았다. 이튿날 물었더니 ${bI('etienne')} 말했다. “그게 법이야. 그러니까 법을 바꿔야 해.”`,{tone:'씁쓸함',their:'그 아이는 물어봐 주었다. 아무도 묻지 않던 것을.'});bfRel('etienne',{close:5,trust:6})}},
   {l:'못 본 척한다',a:'safe',f:()=>{bfSet('etienne','unseen');bfMem('m_seize','etienne',`${E}의 아버지가 빚진 집의 살림을 끌어내는 것을 보았다. 당신은 못 본 척했다. 둘 다 그 일을 입에 올리지 않았다.`,{tone:'씁쓸함',their:'그 아이는 못 본 척했다. 나는 그 아이가 정말 못 본 줄 알고 싶었다.'});bfRel('etienne',{close:6,trust:4})}},
   {l:'그 집 아이들에게 빵을 갖다 준다',a:'social',f:()=>{bfSet('etienne','helped');bfBrave();bfMem('m_seize','etienne',`${E}의 아버지가 빚진 집의 살림을 끌어내던 날, 그 집 아이들에게 빵을 갖다 주었다. 멀리서 ${bI('etienne')} 보고 있었다.`,{tone:'씁쓸함',their:'그 아이가 빵을 들고 그 집에 들어가는 걸 보았다. 내가 했어야 하는 일이었다.'});bfRel('etienne',{resp:12})}}]);
  if(bfS().law==='seize')bfRe('m_promise',`그날 ${bI('etienne')} 고른 법이 왜 그 법이었는지 알 것 같았다.`,'씁쓸함')}});

beat('jules','ju_vow',{when:()=>s.age>=15&&bfAlive('jules')&&bfHere(),until:()=>s.age>=22,run:async()=>{const J=bN('jules'),F=bfR('jules').sex==='F';bfKnow('jules','stutter',1);bfJob('jules',F?'수련 수녀':'신학생');
  await bfScene('종탑 꼭대기','la vocation',`${bfPar()} 종탑 꼭대기. 종지기의 아이였던 ${bI('jules')} ${F?'수녀원':'신학교'}에 들어간다고 한다. 바람 속에서 ${bHe('jules')}가 말한다. 처음으로 한 번도 더듬지 않는다. “하느님 앞에서는 말을 더듬어도 괜찮대. 노래하면 되니까.”`,[
   {l:'축복해 준다',a:'pious',f:()=>{bfMem('m_vow','jules',`종탑 꼭대기에서 ${bI('jules')} ${F?'수녀원':'신학교'}에 간다고 말했다. 그날 ${bHe('jules')}는 한 번도 더듬지 않았다.`,{tone:'희망',place:'종탑 꼭대기',their:`그 아이는 “잘 어울려.”라고 했다. 그 말을 ${F?'서원':'서품'}하는 날까지 붙들었다.`});bfRel('jules',{close:6})}},
   {l:'“너처럼 겁 많은 애가?” 하고 웃는다',a:'bold',f:()=>{bfKnow('jules','stutter',2);bfMem('m_vow','jules',`종탑 꼭대기에서 ${bI('jules')} ${F?'수녀원':'신학교'}에 간다고 했다. 겁 많은 애가 무슨, 하고 웃었더니 ${bHe('jules')}가 말했다. “그러니까 가는 거야. 나는 겁쟁이니까.”`,{tone:'그리움',place:'종탑 꼭대기',their:'그 아이 말이 맞았다. 나는 겁쟁이였다. 그래서 숨을 곳이 필요했다. 그때는 그렇게 믿었다.'});bfRel('jules',{close:-2})}},
   {l:'왜 가는지 묻는다',a:'social',f:()=>{bfKnow('jules','stutter',2);bfMem('m_vow','jules',`종탑 꼭대기에서 ${bI('jules')} ${F?'수녀원':'신학교'}에 간다고 했다. 왜냐고 물었더니 “시끄러운 데가 무서워. 거기선 아무도 소리 지르지 않잖아.”라고 했다.`,{tone:'그리움',place:'종탑 꼭대기',their:'그 아이는 이유를 물었다. 나는 진짜 이유를 말하지 않았다. 나도 몰랐으니까.'});bfRel('jules',{close:4,trust:4})}}])}});

beat('antoine','an_silence',{when:()=>s.age>=14&&bfAlive('antoine')&&bfHere(),until:()=>s.age>=20,run:async()=>{const A=bN('antoine');bfKnow('antoine','silence',1);bfSet('antoine','silY',s.year);
  bfAsk('q_an_silence','antoine',`그날 ${bU('antoine')} 왜 갑자기 말을 멈췄을까?`);
  const mk=(their)=>bfMem('m_silence','antoine',`선술집 구석에서 ${bI('antoine')} 가게 주인 흉을 보며 떠들다가 갑자기 말을 멈췄다. 무언가 말하려다 그만둔 얼굴이었다. 이유는 알 수 없었다.`,{tone:'의문',place:'선술집 구석',their});
  await bfScene('말을 멈춘 친구','le silence',`포목상 견습이 된 ${bW('antoine')} 오랜만에 선술집 구석에 앉았다. ${bU('antoine')} 가게 주인 흉을 보며 떠들다가 갑자기 말을 멈춘다. 무언가 말하려다 그만둔 얼굴이다. 잠시 뒤 ${bHe('antoine')}는 아무 일 없다는 듯이 술값을 치르고 일어난다.`,[
   {l:'무슨 일이냐고 묻는다',a:'social',f:()=>{mk('그 아이가 물었다. 나는 웃었다. 웃는 건 쉬웠다.');say(`“아무것도 아니야.” ${bU('antoine')} 웃었다.`)}},
   {l:'그냥 둔다',a:'safe',f:()=>{mk('그 아이는 묻지 않았다. 고마웠고, 조금 서운했다.')}},
   {l:'농담으로 분위기를 바꾼다',a:'social',f:()=>{mk('그 아이가 농담을 했다. 나도 따라 웃었다. 그날 말했어야 했다.')}}])}});

const bfDebtJail=()=>T()<1780.6?'포르레베크':T()<1797.6?'라포르스':'생트펠라지';
beat('antoine','an_letter',{when:()=>bfAlive('antoine')&&s.year>=(bfF('antoine').fl.silY||9999)+1&&bfHere(),until:()=>s.age>=26,run:async()=>{const A=bN('antoine');bfKnow('antoine','silence',2);
  const txt=`“아버지가 ${bfDebtJail()} 감옥에 계셔. 빚 때문이야. 가게는 팔았어. 별일 아니야. 그냥 알고 있으라고.”`;bfLetter('antoine',txt);
  bfRe('m_silence',`그날 ${bI('antoine')} 말을 멈춘 것은 아버지 일 때문이었을까.`,'씁쓸함');
  if(bfS().law==='debt')bfRe('m_promise',`퐁뇌프에서 고른 법이 바로 ${bN('antoine')}의 아버지를 가둔 법이었다.`,'씁쓸함');
  await bfScene(`${A}의 편지`,'la lettre',`${lit()?'':'이웃이 대신 읽어 준 '}${A}의 편지는 짧다. ${txt}`,[
   (!child()||s.money>=40)?{l:'돈을 보낸다',s:'재산 -',a:'social',f:()=>{const m=Math.max(10,Math.min(150,Math.round(s.money*.2)));s.money-=m;bfSet('antoine','lent');
     if(R()<.5){say(`보낸 돈은 이레 만에 그대로 돌아왔다. 쪽지 한 장이 끼어 있었다. “빚은 빚이야. 이건 안 받을래.”`);bfMem('m_debt','antoine',`${A}의 아버지가 빚 때문에 갇혔을 때 돈을 보냈다. 돈은 그대로 돌아왔다. “빚은 빚이야.”`,{tone:'씁쓸함',their:'그 아이가 돈을 보냈다. 받으면 다시는 그 아이와 나란히 앉을 수 없을 것 같았다.'});s.money+=m}
     else{say(`${bU('antoine')} 돈을 받았다. 답장은 한 줄이었다. “빚진 거야.${bfFl('antoine','gave')?' 두 번째로.':''}”`);bfMem('m_debt','antoine',`${A}의 아버지가 빚 때문에 갇혔을 때 돈을 보냈다. 답장은 한 줄이었다. “빚진 거야.”`,{tone:'감사',their:'그 아이가 돈을 보냈다. 받았다. 그날부터 그 아이 앞에서 나는 늘 빚진 사람이었다.'});bfRel('antoine',{close:6,trust:6})}}}:null,
   {l:`감옥으로 ${A}의 아버지를 찾아간다`,a:'bold social',f:()=>{bfBrave();bfSet('antoine','visited');bfMem('m_jail','antoine',`${bfDebtJail()} 감옥으로 ${A}의 아버지를 찾아갔다. 노인의 외투에는 단추가 하나도 없었다.`,{tone:'씁쓸함',their:'그 아이가 아버지를 찾아갔다는 걸 나중에 알았다. 나는 한 번도 가지 않았는데.'});bfRel('antoine',{close:8,resp:8});
     if(bfHas('button'))bfRe('m_button',`단추 없는 외투를 보고서야 알았다. 서랍 속 은단추가 어디서 떨어진 것인지.`,'죄책감')}},
   {l:'아무에게도 말하지 않는다',a:'safe',f:()=>{bfSet('antoine','quiet');bfMem('m_debt','antoine',`${A}의 아버지가 빚 때문에 갇혔다는 편지를 받았다. 아무에게도 말하지 않았다.`,{tone:'그리움',their:'그 아이는 아무에게도 말하지 않았다. 그래서 그 아이에게만은 말할 수 있었다.'});bfRel('antoine',{trust:8})}}])}});

beat('gabriel','ga_mirror',{when:()=>s.age>=16&&bfAlive('gabriel')&&bfHere(),until:()=>s.age>=24,run:async()=>{const Ga=bN('gabriel');bfJob('gabriel',noble()?'궁정에 드나드는 젊은 귀족':'도매상의 상속자');
  const place=noble()?(T()<1789.5?'베르사유 무도회':'생제르맹 문밖의 살롱'):'팔레루아얄의 카페';
  await bfScene('손거울','le miroir',`${bU('gabriel')} 이제 ${place}에서 가장 옷 잘 입는 젊은이로 통한다. 분 바른 머리, 손에는 은테 손거울. 당신의 옷차림을 보고 여전히 웃는다. 그런데 밤늦게 둘만 남자 손거울을 내려놓고 묻는다. ${bfFl('gabriel','told')?'“그 개 기억나? 다들 아직도 그 얘길 할까?”':'“그 개 기억나? 누구한테 말한 적 있어?”'}`,[
   bfFl('gabriel','told')?null:{l:'“아무에게도 말하지 않았어.”',a:'social',f:()=>{bfKnow('gabriel','dog',2);bfMem('m_mirror','gabriel',`${place}에서 돌아오는 밤, ${bI('gabriel')} 개 이야기를 꺼냈다. 아무에게도 말하지 않았다고 하자, ${bHe('gabriel')}는 오래 고개를 숙이고 있었다.`,{tone:'그리움',their:'그 아이는 정말로 말하지 않았다. 그 아이 앞에서만은 거울을 내려놓을 수 있었다.'});bfRel('gabriel',{close:8,trust:8})}},
   {l:'“그런 일이 있었나? 다 잊었어.”',a:'safe',f:()=>{bfKnow('gabriel','dog',2);bfMem('m_mirror','gabriel',`${place}에서 돌아오는 밤, ${bI('gabriel')} 개 이야기를 꺼냈다. 다 잊었다고 하자 ${bHe('gabriel')}는 이상한 얼굴로 웃었다.`,{tone:'그리움',their:'그 아이는 잊었다고 했다. 나는 하루도 잊은 적이 없는데.'})}},
   {l:'“아직도 그 생각을 해? 겁쟁이.”',a:'bold',f:()=>{bfKnow('gabriel','dog',2);bfMem('m_mirror','gabriel',`${place}에서 돌아오는 밤, ${bI('gabriel')} 개 이야기를 꺼냈다. 아직도 그 생각을 하느냐고, 겁쟁이라고 놀렸다. ${bHe('gabriel')}는 웃었다.`,{tone:'부끄러움',their:'그 아이가 웃으며 겁쟁이라고 했다. 맞는 말이었다. 그래서 웃었다.'});bfRel('gabriel',{riv:8})}}])}});

beat('etienne','et_debate',{when:()=>s.age>=18&&bfAlive('etienne')&&bfHere(),until:()=>s.age>=28,run:async()=>{const E=bN('etienne');bfJob('etienne',bfR('etienne').sex==='F'?'필경사':'변호사 서기');
  await bfScene('카페 프로코프','le café Procope',`카페 프로코프 구석에서 ${bW('etienne')} 밤늦도록 이야기한다. 퐁뇌프의 약속이 화제에 오른다. ${bU('etienne')} 이제 루소와 마블리를 줄줄 외운다. “사람들이 동의할 때까지 기다려야 할까? 사람들이 언제 동의했어? 필요하면 억지로라도 바꿔야 해.”`,[
   {l:'“맞아. 기다리는 동안 누군가는 굶어.”',a:'radical',f:()=>{bfSet('etienne','stance','with');s.pol=clamp(s.pol+4,-100,100);bfMem('m_procope','etienne',`카페 프로코프에서 ${bW('etienne')} 밤새 이야기했다. 필요하면 억지로라도 법을 바꿔야 한다는 말에 당신도 고개를 끄덕였다.`,{tone:'희망',place:'카페 프로코프',their:'그 아이는 나와 같은 걸 믿었다. 적어도 그날 밤에는.'});bfRel('etienne',{close:6})}},
   {l:'“억지로 바꾼 법은 억지로 뒤집혀.”',a:'safe',f:()=>{bfSet('etienne','stance','against');bfMem('m_procope','etienne',`카페 프로코프에서 ${bW('etienne')} 밤새 이야기했다. 억지로 바꾼 법은 억지로 뒤집힌다고 하자 ${bHe('etienne')}는 처음으로 당신을 낯선 사람 보듯 보았다.`,{tone:'씁쓸함',place:'카페 프로코프',their:'그 아이가 겁이 많아졌다고 생각했다. 지금은 그 아이가 옳았는지도 모른다고 생각한다.'});bfRel('etienne',{riv:6})}},
   {l:'“세상보다 내일 빵값이 더 걱정이야.”',a:'safe',f:()=>{bfSet('etienne','stance','aside');bfMem('m_procope','etienne',`카페 프로코프에서 ${bW('etienne')} 이야기했다. 세상보다 내일 빵값이 더 걱정이라고 하자 ${bHe('etienne')}는 웃었다.`,{tone:'그리움',place:'카페 프로코프',their:'그 아이는 빵 이야기를 했다. 나는 그때 그 아이를 조금 경멸했다. 부끄러운 일이다.'})}}]);
  bfWake('m_promise')}});

/* ================= 시험의 시대 =================
   rev: 1774년 이전 출생 — 바스티유, 선서 거부, 최고가격제, 공포정치, 테르미도르.
   july: 그 뒤 출생 — 7월 혁명, 1831년 성당 약탈, 1832년 콜레라와 6월 봉기, 1834년 트랑스노냉, 1848년 6월. */
const bfW=(a,b)=>T()>=a&&T()<b;
beat('etienne','et_dawn',{when:()=>bfAlive('etienne')&&bfHere()&&!child()&&(bfRev()?bfW(1789.53,1790.9):bfW(1830.56,1831.3)),until:()=>bfRev()?T()>=1790.9:T()>=1831.3,run:async()=>{const E=bN('etienne'),rv=bfRev(),F=bfR('etienne').sex==='F';
  bfSet('etienne','together');bfJob('etienne',rv?(F?'남장을 하고 구민 회의에 나가는 사람':'구민 회의 서기'):(F?'남장을 한 공화파 신문 기자':'공화파 신문 기자'));bfFate('etienne',F?(rv?'머리를 자르고 남자 옷을 입은 채 구민 회의에 나가기 시작했다':'남자 옷을 입고 7월의 바리케이드에 섰다'):rv?'구민 회의에 드나들기 시작했다':'7월의 바리케이드에 섰다');const dis=F?' 머리를 짧게 자르고 남자 옷을 입었다. “거기선 다들 나를 시민 에티엔이라고 불러.”':'';
  await bfScene(rv?'바스티유가 떨어진 날':'영광의 사흘',rv?'le 14 juillet':'les Trois Glorieuses',rv?`7월의 어느 날, ${bI('etienne')} 숨을 몰아쉬며 달려온다. 모자에 푸른색과 붉은색 모표를 꽂았다.${dis} “바스티유가 떨어졌어! 퐁뇌프에서 한 약속 기억해? 이제 시작이야.”`:`7월의 사흘. ${bI('etienne')} 화약 냄새를 풍기며 달려온다. 손에 삼색기를 들었다.${dis} “부르봉이 쫓겨났어! 퐁뇌프에서 한 약속 기억해? 이제 시작이야.”`,[
   {l:rv?'구민 회의에 함께 나간다':'시청 앞 광장으로 함께 간다',a:'radical',f:()=>{bfSet('etienne','withYou');s.pol=clamp(s.pol+4,-100,100);bfMem('m_dawn','etienne',rv?`바스티유가 떨어진 날, ${bW('etienne')} 구민 회의에 나갔다. 모두가 동시에 말하고 있었다.`:`영광의 사흘, ${bW('etienne')} 시청 앞 광장에 섰다. 삼색기가 다시 올라갔다.`,{tone:'희망',their:'그 아이와 함께였다. 그날은 세상이 우리 편이었다.'});bfRel('etienne',{close:6})}},
   {l:'“조심해.”라고만 한다',a:'safe',f:()=>{bfMem('m_dawn','etienne',`${rv?'바스티유가 떨어진 날':'영광의 사흘'}, ${bI('etienne')} 들떠서 달려왔다. 당신은 조심하라고만 했다.`,{tone:'두려움',their:'그 아이는 조심하라고만 했다. 그 말이 그때는 비겁하게 들렸다.'})}},
   {l:'“우리 법도 없앨 수 있을까?” 하고 묻는다',a:'radical',f:()=>{bfWake('m_promise');bfMem('m_dawn','etienne',`${rv?'바스티유가 떨어진 날':'영광의 사흘'}, ${bI('etienne')} 달려왔다. 우리 법도 없앨 수 있겠느냐고 묻자, ${bHe('etienne')}는 당신의 두 손을 잡았다.`,{tone:'희망',their:'그 아이는 약속을 기억하고 있었다. 그 순간 나는 우리가 이길 거라고 믿었다.'});bfRel('etienne',{close:8})}}])}});

// 공포정치: 에티엔은 적극 가담하고 쥘과 멀어진다
beat('etienne','et_rift',{when:()=>bfRev()&&bfAlive('etienne')&&bfAlive('jules')&&bfFl('jules','refr')&&bfHere()&&!child()&&bfW(1792.75,1793.85),until:()=>!bfRev()||T()>=1793.85||!bfAlive('jules'),run:async()=>{const E=bN('etienne'),J=bN('jules');bfSet('etienne','vsJules');bfFate('etienne','구 회의에서 선서 거부 사제들을 고발하는 연설을 했다');
  await bfScene('공화국의 적','l’ennemi de la République',`구 회의장. 연단에 선 ${bI('etienne')} 숨어서 미사를 드리는 선서 거부 사제들의 이름을 읽는다. 그 가운데 ${J}의 이름도 있다. 회의가 끝난 뒤 ${bI('etienne')} 당신 곁에 와서 낮게 말한다. “${J}는 아직도 지하실에서 미사를 드린대. 어릴 적 친구라도 공화국의 적은 적이야.”`,[
   {l:`“${J}는 참새 한 마리도 못 죽이는 애야.”`,a:'pious bold',f:()=>{bfBrave();bfMem('m_rift',['etienne','jules'],`구 회의장에서 ${bI('etienne')} ${jo(J,'을','를')} 공화국의 적이라고 불렀다. 당신은 ${jo(J,'이','가')} 참새 한 마리도 못 죽이는 아이라고 말했다.`,{tone:'씁쓸함',their:{etienne:'그 사람이 참새 이야기를 했다. 나도 그 참새를 기억했다. 그래서 더 화가 났다.',jules:'에티엔이 나를 적이라 불렀다는 말을 들었다. 미워하지 않았다. 그를 위해 기도했다.'}});bfRel('etienne',{close:-6,riv:6});bfRel('jules',{close:6,trust:6})}},
   {l:'“네 말이 맞아.”',a:'radical',f:()=>{s.pol=clamp(s.pol+4,-100,100);bfMem('m_rift',['etienne','jules'],`구 회의장에서 ${bI('etienne')} ${jo(J,'을','를')} 공화국의 적이라고 불렀다. 당신은 그 말이 맞다고 했다.`,{tone:'죄책감',their:{etienne:'그 사람이 내 편을 들었다. 그날 밤 쥘의 얼굴이 자꾸 떠올랐다.',jules:'그 사람마저 에티엔의 말이 맞다고 했다고 들었다. 그날은 기도가 잘 되지 않았다.'}});bfRel('etienne',{close:6});bfRel('jules',{trust:-10});bfReg('r_rift','jules',`${jo(J,'을','를')} 공화국의 적이라 부르는 말에 맞장구를 쳤다.`)}},
   {l:'말없이 자리를 뜬다',a:'safe',f:()=>{bfCare();bfMem('m_rift',['etienne','jules'],`구 회의장에서 ${bI('etienne')} ${jo(J,'을','를')} 공화국의 적이라고 불렀다. 당신은 아무 말 없이 자리를 떴다.`,{tone:'씁쓸함',their:{etienne:'그 사람은 아무 말 없이 나갔다. 대답보다 그게 더 오래 남았다.',jules:'그 사람은 아무 말도 하지 않았다고 했다. 그 시절엔 그것도 용기였다.'}})}}]);
  bfRe('m_apple',`한 담을 함께 넘던 ${bW('etienne')} ${J}는 이제 서로를 적이라 부른다.`,'씁쓸함');bfRe('m_bridge','퐁뇌프에 모였던 아이들 가운데 둘이 이제 서로 반대편에 섰다.','씁쓸함')}});

// 쥘: 단 하나 물러서지 않는 것
beat('jules','ju_test',{when:()=>bfAlive('jules')&&bfHere()&&(bfRev()?(bfR('jules').sex==='F'?bfW(1792.62,1793.4):bfW(1791.0,1792.4)):bfW(1831.1,1831.5)),until:()=>bfRev()?T()>=(bfR('jules').sex==='F'?1793.4:1792.4):T()>=1831.5,run:async()=>{const J=bN('jules'),rv=bfRev(),F=bfR('jules').sex==='F';
  bfKnow('jules','stutter',3);const r=bfR('jules');r.cler=true;r.refr=rv;const pr=bAge('jules')>=24;
  if(rv){bfJob('jules',pr?'선서 거부 신부':'선서 거부 신학생');bfFate('jules',pr?'성직자 시민 헌법 선서를 거부했다':'선서한 주교에게 서품받기를 거부했다');bfSet('jules','refr')}else{bfJob('jules',`${bfPar()} 보좌 신부`);bfFate('jules','성당 앞에서 군중을 막아섰다')}
  const T0=rv?(F?`1792년 가을. 수도회는 해산되었고, 수녀들은 연금을 받으려면 자유·평등 서약을 해야 한다. 수녀원 응접실에서 ${bI('jules')} 서약서를 앞에 두고 앉아 있다. 위원이 재촉한다. ${bHe('jules')}가 입을 연다. 더듬지 않는다. “저는 할 수 없습니다.”`:`1791년 1월. 성직자는 시민 헌법에 선서해야 한다. ${bfPar()} 설교단에 선 ${pr?'젊은 보좌 신부':'신학생'} ${bI('jules')} ${pr?'선서문을':'선서한 주교의 서품 명단을'} 든 채 한참 말이 없다. 신자석에서 누군가 “선서해!” 하고 외친다. ${bHe('jules')}가 입을 연다. 더듬지 않는다. “저는 할 수 없습니다.”`):`1831년 2월. 군중이 생제르맹로세루아 성당과 대주교관을 부수고 있다. ${bfPar()}에도 사람들이 몰려왔다. 십자가를 끌어내리려는 사람들 앞에 보좌 신부 ${bI('jules')} 혼자 서 있다. 떨면서도 비키지 않는다.`;
  await bfScene(rv?'저는 할 수 없습니다':'성당 문 앞',rv?'le serment':'le sac de Saint-Germain-l’Auxerrois',T0,[
   {l:rv?'끝까지 그 자리에 남는다':`${J}의 옆에 가서 선다`,a:'bold pious',f:()=>{bfBrave();bfSet('jules','stood');bfMem('m_oath','jules',rv?`${bI('jules')} 선서를 거부하던 날, 당신은 끝까지 그 자리에 남았다. ${bHe('jules')}는 한 번도 더듬지 않았다.`:`군중이 ${bfPar()}에 몰려온 날, 문 앞에 선 ${J}의 옆에 가서 섰다.`,{tone:'감사',their:'그 아이가 맨 앞에 있었다. 그래서 끝까지 서 있을 수 있었다.'});bfRel('jules',{close:8,trust:8});s.sus=clamp((s.sus||0)+(rv?3:0),0,100)}},
   {l:rv?'조용히 빠져나온다':'그를 억지로 끌고 나온다',a:'safe',f:()=>{bfCare();bfMem('m_oath','jules',rv?`${bI('jules')} 선서를 거부하던 날, 당신은 조용히 빠져나왔다.`:`군중이 ${bfPar()}에 몰려온 날, 문 앞에 선 ${bL('jules')} 억지로 끌고 나왔다.`,{tone:'씁쓸함',their:rv?'그 아이가 나가는 뒷모습을 보았다. 원망하지 않았다. 나도 나가고 싶었으니까.':'그 아이가 나를 끌어냈다. 살았다. 그런데 그 십자가가 끌려 내려가는 소리가 오래 귀에 남았다.'})}},
   {l:'나중에 찾아가 살라고 설득한다',a:'family',f:()=>{bfMem('m_oath','jules',`${J}에게 ${rv?'선서하고':'몸을 피하고'} 살라고 설득했다. ${bHe('jules')}는 고맙다고만 했다.`,{tone:'그리움',their:'그 아이는 살라고 했다. 그게 나를 아끼는 방식이라는 걸 알았다. 그래서 거절하기가 더 힘들었다.'})}}]);
  if(rv)say(`그 뒤로 ${bU('jules')} 숨어 지냈다. 주일마다 ${bfPar()} 종탑이 조용했다.`)}});
// 1792년 9월 학살(카름 수도원 등)
beat('jules','ju_sept',{when:()=>bfRev()&&bfAlive('jules')&&bfFl('jules','refr')&&bfW(1792.67,1792.8),until:()=>!bfRev()||T()>=1792.8||!bfFl('jules','refr'),gap:0,run:async()=>{
  if(await chance(.12,`9월 학살 · ${bN('jules')}`,'수감된 선서 거부 사제 약 220명이 카름 수도원 등에서 살해'))bfDie('jules','massacre',`1792년 9월, 카름 수도원에서 다른 선서 거부 사제들과 함께 살해되었다.`);
  else say(`9월, 감옥마다 사제들이 끌려 나와 죽었다는 소식이 돌았다. ${bU('jules')} 잡히지 않았다.`,'dark')}});

beat('jules','ju_terror',{when:()=>bfRev()&&bfAlive('jules')&&bfFl('jules','refr')&&!bfFl('jules','atGab')&&bfW(1794.2,1794.55),until:()=>!bfRev()||T()>=1794.55||!bfFl('jules','refr'),gap:0,run:async()=>{
  if(await chance(.35,`공포정치 · ${bN('jules')}`,'숨어 지내던 선서 거부 사제의 상당수가 1793~94년에 붙잡혀 처형')){bfFate('jules','숨어 있던 지하실에서 붙잡혔다');bfDie('jules','guillotine','혁명재판소에서 사형을 선고받고 단두대에 올랐다. 수레 위에서 낮은 목소리로 노래했다고 한다.')}
  else say(`${bU('jules')} 이 지하실 저 다락방을 옮겨 다니며 공포정치를 버텼다.`,'ev')}});
beat('louise','lo_crisis',{when:()=>bfAlive('louise')&&bfHere()&&!child()&&(bfRev()?bfW(1793.72,1794.5):bfW(1848.47,1848.95)),until:()=>bfRev()?T()>=1794.5:T()>=1848.95,run:async()=>{const L=bN('louise'),rv=bfRev();bfJob('louise','빵집 안주인');
  const etOK=rv&&bfAlive('etienne')&&bfFl('etienne','together');
  const T0=rv?`1793년 가을. 최고가격제가 시행되었다. ${L}의 빵집 앞에 새벽부터 줄이 늘어선다. 밀가루는 모자라고, 정해진 값에 팔면 남는 게 없다. 어젯밤 구 혁명위원회가 ${L}의 남편을 매점매석 혐의로 데려갔다. ${bI('louise')} 당신 집 문을 두드린다. 처음으로 도와 달라고 한다.`:`1848년 6월. 생앙투안 문밖의 바리케이드가 무너졌다. ${L}의 아들이 돌아오지 않았다. 튈르리 지하실과 요새 감옥에 붙잡힌 사람이 수천이라고 한다. 알제리로 보낸다는 소문이 돈다. ${bI('louise')} 당신 집 문을 두드린다. 처음으로 도와 달라고 한다.`;
  const ok=t=>{bfMem('m_bake','louise',t,{tone:'감사',their:rv?'그 사람은 위원회 앞에서 내 남편이 반죽을 몇 번 치대는지까지 말했다. 반은 지어낸 말이었는데, 그래서 살았다.':'그 사람은 나와 함께 감옥 문마다 이름을 불렀다. 대답은 열한 번째 문에서 들렸다.'});bfRel('louise',{close:10,trust:10})};
  const bad=t=>{bfMem('m_bake','louise',t,{tone:'후회',their:'그 사람은 나설 수 없다고 했다. 무서웠겠지. 나도 무서웠다. 그래도 그 문 앞에서 오래 서 있었다.'});bfReg('r_bake','louise',rv?`빵집 일로 도와 달라던 ${bL('louise')} 돌려보냈다.`:`아들을 찾아 달라던 ${bL('louise')} 돌려보냈다.`);bfRe('m_bread','그날 문 앞에서 돌려보낸 사람이, 예전에 제일 바삭한 꽁다리를 떼어 주던 아이였다.','죄책감');bfRel('louise',{close:-10,trust:-12})};
  await bfScene(rv?'빵집의 밤':'열한 번째 문',rv?'le maximum':'les journées de Juin',T0,[
   {l:rv?'구 위원회에 가서 그녀를 위해 증언한다':'함께 감옥들을 찾아다닌다',s:rv?'혐의 +':'',a:'bold',f:async()=>{bfBrave();if(rv)s.sus=clamp((s.sus||0)+5,0,100);
     if(await chance(.7,rv?'증언':'수소문','')){ok(rv?`최고가격제 시절, ${L}의 남편을 위해 구 위원회에서 증언했다. 남편은 사흘 만에 풀려났다.`:`1848년 6월, ${bW('louise')} 감옥마다 아들 이름을 부르며 다녔다. 열한 번째 문에서 대답이 들렸다.`);say(rv?'사흘 뒤 남편이 풀려났다.':'아들은 이브리 요새에 갇혀 있었다. 가을에 풀려났다.','big')}
     else{bfMem('m_bake','louise',rv?`최고가격제 시절, ${L}의 남편을 위해 구 위원회에서 증언했지만 소용없었다. 남편은 테르미도르 뒤에야 풀려났다.`:`1848년 6월, ${bW('louise')} 감옥마다 아들을 찾아다녔지만 찾지 못했다. 아들은 알제리로 보내졌다.`,{tone:'씁쓸함',their:'그 사람은 끝까지 함께 다녔다. 찾지 못했어도 그건 잊지 않는다.'});bfRel('louise',{close:8,trust:8});bfFate('louise',rv?'남편이 감옥에 갇혔다':'아들이 알제리로 유형을 갔다');say(rv?'남편은 풀려나지 못했다.':'아들의 이름은 알제리행 명단에 있었다.','dark')}}},
   etOK?{l:`${bN('etienne')}에게 부탁한다`,a:'social',f:()=>{bfSet('etienne','owed');ok(`최고가격제 시절, ${L}의 남편 일을 ${bN('etienne')}에게 부탁했다. 남편은 이튿날 풀려났다.`);say(`${bU('etienne')} 아무것도 묻지 않고 서류에 서명했다. 그리고 말했다. “이번엔 내가 도왔어.”`)}}:null,
   (!rv&&lit())?{l:'아는 관리에게 탄원서를 써 준다',a:'study',f:async()=>{if(await chance(.5,'탄원','')){ok(`1848년 6월, ${L}의 아들을 위해 탄원서를 썼다. 아들은 가을에 풀려났다.`)}else{bfMem('m_bake','louise',`1848년 6월, ${L}의 아들을 위해 탄원서를 썼지만 답이 없었다. 아들은 알제리로 보내졌다.`,{tone:'씁쓸함',their:'그 사람이 써 준 탄원서를 나는 읽을 수 없었다. 그래도 날마다 그 종이를 꺼내 보았다.'});bfFate('louise','아들이 알제리로 유형을 갔다')}}}:null,
   {l:'나설 수 없다고 말한다',a:'safe',f:()=>{bfCare();bad(rv?`최고가격제 시절, 남편을 구해 달라는 ${bL('louise')} 돌려보냈다. 남편은 테르미도르 뒤에야 풀려났다.`:`1848년 6월, 아들을 찾아 달라는 ${bL('louise')} 돌려보냈다. 아들은 알제리로 보내졌다.`);bfFate('louise',rv?'남편이 감옥에 갇혔다':'아들이 알제리로 유형을 갔다')}}])}});

// 가브리엘: 허영심 많던 아이가 누구보다 용감해진다
const bfGuest=()=>bfRev()?(bfAlive('jules')&&bfFl('jules','refr')?bN('jules'):'선서 거부 신부 한 사람'):'생메리 바리케이드에서 다친 학생 하나';
beat('gabriel','ga_hide',{when:()=>bfAlive('gabriel')&&bfHere()&&!child()&&(bfRev()?bfW(1793.85,1794.5):bfW(1832.44,1832.8)),until:()=>bfRev()?T()>=1794.5:T()>=1832.8,run:async()=>{const Ga=bN('gabriel'),rv=bfRev(),g=bfGuest(),isJ=rv&&g===bN('jules');
  bfSet('gabriel','hid');bfKnow('gabriel','dog',3);bfFate('gabriel',rv?`다락방에 ${isJ?jo(bN('jules'),'을','를'):'선서 거부 신부를'} 숨겼다`:'6월 봉기의 부상자를 숨겼다');if(isJ)bfSet('jules','atGab');
  await bfScene('다락방','la mansarde',`${Ga}에게서 짧은 쪽지가 왔다. 찾아가 보니 분 바른 머리도 손거울도 없다. 낡은 옷을 입은 ${bI('gabriel')} 다락방 문을 연다. 그 안에 ${jo(g,'이','가')} 있다. ${bI('gabriel')} 낮게 말한다. “그 개 기억나? 그날 이후로 다시는 도망치지 않기로 했어.”`,[
   {l:'먹을 것과 옷을 날라 주겠다고 한다',s:rv?'혐의 +':'',a:'bold',f:()=>{bfBrave();bfSet('gabriel','helped');if(rv)s.sus=clamp((s.sus||0)+4,0,100);bfMem('m_attic',isJ?['gabriel','jules']:'gabriel',`${Ga}의 다락방에 ${jo(g,'이','가')} 숨어 있었다. 당신은 몇 달 동안 빵과 옷을 날랐다.`,{tone:'두려움',place:'다락방',their:'그 사람이 빵을 날라 왔다. 그 사람 앞에서 나는 처음으로 겁쟁이가 아니었다.'});bfRel('gabriel',{close:10,trust:12,resp:10});if(isJ)bfRel('jules',{close:8})}},
   {l:'“너까지 죽어. 그만둬.”라고 말린다',a:'safe',f:()=>{bfMem('m_attic','gabriel',`${Ga}의 다락방에 ${jo(g,'이','가')} 숨어 있었다. 그만두라고 말렸지만 ${bHe('gabriel')}는 듣지 않았다.`,{tone:'두려움',place:'다락방',their:'그 사람은 나를 말렸다. 나를 아껴서라는 걸 알았다. 그래도 그만두지 않았다.'});bfRel('gabriel',{close:4})}},
   {l:'아무것도 보지 못한 것으로 하겠다고 한다',a:'safe',f:()=>{bfCare();bfMem('m_attic','gabriel',`${Ga}의 다락방에 ${jo(g,'이','가')} 숨어 있었다. 당신은 아무것도 보지 못한 것으로 하겠다고 했다.`,{tone:'두려움',place:'다락방',their:'그 사람은 아무것도 못 본 걸로 하겠다고 했다. 그 시절엔 그것만으로도 충분했다.'})}}]);
  bfRe('m_dog',bfFl('gabriel','told')?'다락방 문을 열던 그 얼굴을 보며, 골목에서 모두가 웃던 날을 생각했다.':'다락방 문을 열던 그 얼굴을 보며, 그날 달아나던 아이를 다시 생각했다.',bfFl('gabriel','told')?'죄책감':'위로')}});

// 에티엔: 같은 약속, 다른 정의 — 서로 반대편에 서는 밤
beat('etienne','et_list',{when:()=>bfAlive('etienne')&&bfHere()&&!child()&&(bfRev()?bfW(1793.9,1794.55)&&(bfFl('gabriel','hid')||T()>=1794.15):bfW(1832.45,1832.9)&&(bfFl('gabriel','hid')||T()>=1832.6)),until:()=>bfRev()?T()>=1794.55:T()>=1832.9,run:async()=>{const E=bN('etienne'),rv=bfRev(),F=bfR('etienne').sex==='F';
  const gab=bfAlive('gabriel')&&bfFl('gabriel','hid');const tgt=gab?bfGuest():(bfAlive('gabriel')?bN('gabriel'):'옆 골목의 늙은 신부');const isJ=gab&&rv&&tgt===bN('jules');const where=gab?`${bN('gabriel')}의 다락방`:'숨은 곳';
  bfJob('etienne',rv?(F?'남장을 한 구 혁명감시위원':'구 혁명감시위원회 위원'):(F?'경시청 관리의 아내':'경시청 관리'));bfFate('etienne',rv?(F?'남장을 한 채 구 혁명감시위원회 위원이 되었다. 아무도 그녀가 여자라는 것을 몰랐다':'구 혁명감시위원회 위원이 되었다'):'경시청 관리가 되었다');
  bfKnow('etienne','name',1);bfAsk('q_et_name','etienne',`그 명단에서 이름이 빠졌다면, 그것은 ${bN('etienne')} 덕이었을까?`);
  const lawTxt=bfS().law?`‘${bfLawN(bfS().law)}’`:'가장 부당한 법';
  const T0=rv?`밤늦게 문을 두드리는 소리. ${jo(E,'이다','다')}. ${F?'짧은 머리에 남자 옷, 모자에 붉은 모표, 허리에 구 혁명감시위원회의 띠. 위원회에서는 모두 시민 에티엔이라고 부른다':'모자에 붉은 모표, 허리에 구 혁명감시위원회의 띠'}. ${bU('etienne')} 명단을 든 채 오래 서 있다. “${gab?jo(tgt,'이','가')+' 숨어 있다는':tgt+'에 대한'} 밀고가 들어왔어. 어디 있는지 알지? 말해 주면 처형 대신 유형으로 돌려 볼게. 말하지 않으면… 나도 어쩔 수 없어.”`
   :`생메리 바리케이드가 무너진 뒤, 경시청 ${F?'관리의 아내가 된':'관리가 된'} ${bI('etienne')} 찾아온다. 두 해 전 삼색기를 들던 손에 체포 명단이 들려 있다. “${gab?jo(tgt,'이','가')+' 숨어 있다는':tgt+'에 대한'} 밀고가 들어왔어. 어디 있는지 알지? 말해 주면 가볍게 끝나게 해 볼게.”`;
  let pick=-1;
  await bfScene('명단','la liste',T0,[
   {l:'“모른다.”고 잘라 말한다',a:'bold',f:()=>{pick=0;bfBrave();bfSet('etienne','rupture');bfRel('etienne',{close:-15,hate:10,trust:-10});bfMem('m_list','etienne',`${bI('etienne')} 명단을 들고 찾아온 밤, ${jo(tgt,'이','가')} 어디 있는지 모른다고 잘라 말했다. ${bHe('etienne')}가 말했다. “너도 결국 그쪽이구나.”`,{tone:'두려움',their:'그 사람은 모른다고 했다. 알면서. 그 거짓말이 나를 살렸는지도 모른다.'});say(`${bU('etienne')} 아무 말 없이 돌아섰다. 그날부터 둘은 서로 반대편에 섰다.`,'dark')}},
   {l:'퐁뇌프의 약속을 꺼낸다',a:'social',f:()=>{pick=1;bfSet('etienne','rupture');bfSet('etienne','reminded');bfRel('etienne',{close:-6,trust:-4});bfMem('m_list','etienne',`${bI('etienne')} 명단을 들고 찾아온 밤, 퐁뇌프의 약속을 꺼냈다. “우리가 없애자던 ${lawTxt}이 이런 거였어?” ${bHe('etienne')}는 대답하지 않고 돌아갔다.`,{tone:'씁쓸함',their:'그 사람이 약속을 꺼냈다. 나는 대답하지 못했다. 그날 밤 집에 돌아가 명단을 다시 펼쳤다.'});bfRe('m_promise','그날 밤, 그 약속은 둘 사이에 칼처럼 놓였다.','후회');say(`${bU('etienne')} 오래 당신을 보다가, 명단을 접어 품에 넣고 돌아갔다.`,'dark')}},
   {l:'숨은 곳을 말한다',a:'safe',f:()=>{pick=2;bfCare();bfSet('etienne','told');bfMem('m_list','etienne',`${bI('etienne')} 명단을 들고 찾아온 밤, 당신은 ${jo(tgt,'이','가')} ${where}에 있다고 말했다.`,{tone:'죄책감',their:'그 사람은 말해 주었다. 나는 약속을 지키려 했다. 그것이 그 시절 내가 지킨 유일한 약속이었다.'});bfReg('r_told','etienne',`${bI('etienne')} 명단을 들고 온 밤, ${jo(tgt,'이','가')} 숨은 곳을 말했다.`);if(isJ)bfSet('jules','betrayed');say('입 밖으로 나온 말은 다시 주워 담을 수 없었다.','dark')}}]);
  // 그는 이름을 지웠을까: 당신이 고른 말에 따라 달라지지만, 당신은 그 사실을 거의 알 수 없다
  const erase=pick===2?false:R()<(pick===1?.75:.5)*(bfF('etienne').fl.stance==='with'?1.1:1);bfS().erased=erase;
  if(erase){bfKnow('etienne','name',2);say(`몇 주 뒤, 그 명단에서 한 이름이 빠져 있었다는 말을 들었다. 누가 뺐는지는 아무도 몰랐다.`,'ev');return}
  // 들이닥친다
  const caught=pick===2?true:await chance(.5,'수색','숨은 이를 찾아낼 확률');if(!caught){say('위원회 사람들이 다락방 문 앞까지 왔다가 돌아갔다.','ev');return}
  if(isJ&&rv&&await chance(.5,`혁명재판소 · ${bN('jules')}`,'붙잡힌 선서 거부 사제는 재판 없이 처형되기도 했다')){bfFate('jules','다락방에서 붙잡혔다');bfDie('jules','guillotine','혁명재판소에서 사형을 선고받고 단두대에 올랐다. 수레 위에서 낮은 목소리로 노래했다고 한다.')}
  else if(isJ){bfFate('jules',rv?'붙잡혀 로슈포르 앞바다의 감옥선으로 보내졌다':'붙잡혔다');bfSet('jules','deported');
    if(rv&&await chance(.55,`감옥선 · ${bN('jules')}`,'1794년 로슈포르 감옥선에 실린 사제 829명 가운데 547명 사망'))bfDie('jules','pontons',`로슈포르 앞바다 감옥선에서 굶주림과 열병으로 세상을 떠났다.`);else say(`${bU('jules')} 감옥선에서 살아남았다고 한다.`,'ev')}
  if(gab){bfFate('gabriel',rv?'숨긴 죄로 붙잡혀 콩시에르주리에 갇혔다':'숨긴 죄로 생트펠라지 감옥에 갇혔다');bfSet('gabriel','jailed');bfR('gabriel').cond='prison';
    if(rv&&T()<1794.55&&await chance(.5,`혁명재판소 · ${bN('gabriel')}`,'공포정치 말기 파리 혁명재판소 피고의 약 절반이 사형'))bfDie('gabriel','guillotine',`혁명재판소에서 사형을 선고받고 단두대에 올랐다. 마지막까지 머리를 꼿꼿이 들었다고 한다.`);
    else say(`${bU('gabriel')} 감옥에 갇혔다.`,'dark')}
  if(!gab&&!isJ){if(bfAlive('gabriel')&&tgt===bN('gabriel')){bfFate('gabriel',rv?'밀고로 붙잡혀 감옥에 갇혔다':'밀고로 붙잡혀 생트펠라지에 갇혔다');bfR('gabriel').cond='prison'}say(`${jo(tgt,'은','는')} 붙잡혀 갔다.`,'dark')}}});

beat('etienne','et_fall',{when:()=>bfAlive('etienne')&&!child()&&(bfRev()?bfW(1794.56,1795.7):bfW(1834.28,1835.6))&&s.cond!=='prison',until:()=>bfRev()?T()>=1795.7:T()>=1835.6,run:async()=>{const E=bN('etienne'),rv=bfRev();bfKnow('etienne','father',3);
  const gab=bfR('gabriel');if(rv&&gab&&gab.alive&&gab.cond==='prison'){gab.cond='normal';bfFate('gabriel','테르미도르 뒤 감옥에서 풀려났다');say(`테르미도르 뒤, ${bU('gabriel')} 감옥에서 풀려났다.`,'big')}
  if(rv&&await chance(.3,`테르미도르 · ${E}`,'테르미도르 10~12일, 로베스피에르파 코뮌 사람과 위원 약 100명이 단두대에 올랐다')){const F=bfR('etienne').sex==='F';
    await bfScene('마지막 수레','le 10 thermidor',`테르미도르 10일 저녁. 혁명 광장으로 가는 수레들이 생토노레 거리를 지난다. 묶인 사람들 사이에 ${bI('etienne')} 있다.${F?' 붙잡히고 나서야 위원회 사람들은 시민 에티엔이 여자라는 것을 알았다.':''} 군중이 야유를 퍼붓는다. ${bU('etienne')} 고개를 들고 누군가를 찾는 얼굴이다.`,[
     {l:'군중을 헤치고 나가 눈을 맞춘다',a:'bold',f:()=>{bfBrave();bfMem('m_cart','etienne',`테르미도르 10일, 단두대로 가는 수레 위의 ${bW('etienne')} 눈이 마주쳤다. ${bHe('etienne')}는 입 모양으로 무언가를 말했다. 퐁뇌프, 라고 한 것 같았다.`,{tone:'그리움',their:'마지막에 그 사람을 찾았다. 있었다. 그거면 됐다.'});bfAsk('q_et_cart','etienne',`수레 위의 ${bU('etienne')} 마지막에 무슨 말을 했을까?`)}},
     {l:'이름을 부른다',a:'bold social',f:()=>{bfMem('m_cart','etienne',`테르미도르 10일, 단두대로 가는 수레를 따라가며 ${bN('etienne')}의 이름을 불렀다. 야유 속에서 ${bHe('etienne')}가 돌아보았다.`,{tone:'그리움',their:'누군가 내 이름을 불렀다. 시민 에티엔이 아니라, 어릴 적 이름으로.'})}},
     {l:'고개를 돌린다',a:'safe',f:()=>{bfCare();bfMem('m_cart','etienne',`테르미도르 10일, 단두대로 가는 수레에 ${bI('etienne')} 실려 갔다. 당신은 고개를 돌렸다.`,{tone:'후회',their:'그 사람은 없었다. 아니, 있었는데 내가 못 본 것이었으면 좋겠다.'});bfReg('r_et_cart','etienne',`단두대로 가는 ${bN('etienne')}의 수레에서 고개를 돌렸다.`)}}]);
    bfRe('m_promise','테르미도르 10일, 약속을 함께 한 아이가 단두대에 올랐다. 그 법은 하나도 없애지 못했다.','후회');if(bfAlive('jules')&&bfM('m_rift'))bfRe('m_rift',`${bI('etienne')} 단두대에 올랐다는 소식에 ${bU('jules')} 그를 위해 미사를 드렸다고 한다.`,'위로');
    bfDie('etienne','guillotine','테르미도르 10일, 로베스피에르파와 함께 혁명 광장의 단두대에 올랐다.');return}
  if(rv){bfFate('etienne','테르미도르 뒤 플레시 감옥에 갇혔다');bfR('etienne').cond='prison'}else bfFate('etienne','트랑스노냉 거리 사건 보고서에 서명했다는 소문이 돌았다');
  const T0=rv?`테르미도르 9일. 로베스피에르가 쓰러졌다. 구 위원회 사람들이 잡혀간다. ${bU('etienne')} 플레시 감옥에 갇혔다. 거리에서는 금빛 청년단이 자코뱅을 몽둥이로 때린다. 당신이 찾아가자 ${bHe('etienne')}가 창살 너머에서 말한다. “결국 나도 남의 침대를 끌어내는 사람이 되었어. 아버지처럼.”`
   :`1834년 4월. 트랑스노냉 거리 12번지에서 군대가 잠옷 차림의 주민들을 죽였다. 경시청의 ${bI('etienne')} 그 보고서에 서명했다는 소문이다. 찾아가자 ${bHe('etienne')}가 말한다. “질서가 없으면 법도 없어. 그런데 있지… 결국 나도 남의 침대를 끌어내는 사람이 되었어. 아버지처럼.”`;
  await bfScene(rv?'창살 너머':'트랑스노냉 거리 12번지',rv?'Thermidor':'la rue Transnonain',T0,[
   {l:'“너는 아버지가 아니야.”라고 말한다',a:'social',f:()=>{bfSet('etienne','consoled');bfMem('m_fall','etienne',rv?`테르미도르 뒤, 감옥의 ${bN('etienne')}를 찾아갔다. “결국 아버지처럼 되었다”는 ${bHe('etienne')}에게, 너는 아버지가 아니라고 말했다.`:`트랑스노냉 사건 뒤, ${bN('etienne')}를 찾아갔다. “결국 아버지처럼 되었다”는 ${bHe('etienne')}에게, 너는 아버지가 아니라고 말했다.`,{tone:'위로',their:'그 사람은 내가 아버지가 아니라고 했다. 믿지 않았다. 그래도 그 말을 오래 붙들었다.'});bfRel('etienne',{close:8,hate:-8});if(bfFl('etienne','rupture'))bfSet('etienne','thaw')}},
   {l:'“그래서 그 명단은 어떻게 했어?” 하고 묻는다',a:'bold',f:()=>{bfMem('m_fall','etienne',`${rv?'테르미도르 뒤 감옥에서':'트랑스노냉 사건 뒤'} ${bN('etienne')}에게 그 명단을 어떻게 했느냐고 물었다. ${bHe('etienne')}는 “됐어.” 하고 고개를 돌렸다.`,{tone:'의문',their:'그 사람이 명단을 물었다. 말할 수 있었다. 그런데 말하면 그 일이 그 사람을 위한 일이 되어 버릴 것 같았다.'});bfRel('etienne',{trust:-4})}},
   {l:'아무 말 없이 돌아온다',a:'safe',f:()=>{bfMem('m_fall','etienne',`${rv?'테르미도르 뒤 감옥에':'트랑스노냉 사건 뒤'} ${bN('etienne')}를 찾아갔지만 아무 말도 하지 못하고 돌아왔다.`,{tone:'후회',their:'그 사람은 아무 말도 하지 않았다. 그게 가장 정직한 대답이었다.'});if(bfFl('etienne','rupture'))bfReg('r_et_fall','etienne',`${rv?'감옥의':'무너진'} ${bL('etienne')} 찾아가고도 아무 말도 하지 못했다.`)}}]);
  if(rv){{bfR('etienne').cond='normal';bfFate('etienne','감옥에 갇혔다가 이듬해 사면으로 풀려났다');bfJob('etienne',bfR('etienne').sex==='F'?'삯바느질하는 사람':'사환 노릇을 하는 옛 자코뱅')}}}});

// 1801년 생니케즈 거리 폭발 사건 뒤 옛 자코뱅 130여 명이 세이셸 제도 등지로 유형
beat('etienne','et_exile',{when:()=>bfRev()&&bfAlive('etienne')&&bfFl('etienne','together')&&bfR('etienne').sex!=='F'&&bfW(1801.0,1801.3),until:()=>!bfRev()||T()>=1801.3,gap:0,run:async()=>{
  if(await chance(.25,`유형 · ${bN('etienne')}`,'1801년 1월, 옛 자코뱅 약 130명이 재판 없이 유형')){bfSet('etienne','exiled');bfR('etienne').cond='deported';bfFate('etienne','생니케즈 거리 폭발 사건 뒤 재판 없이 세이셸 제도로 유형을 갔다');say(`생니케즈 거리 폭발 사건 뒤, 옛 자코뱅들이 재판 없이 유형을 떠났다. 그 명단에 ${bN('etienne')}의 이름이 있었다.`,'dark');
    if(await chance(.6,'유형지',''))bfDie('etienne','exile','세이셸 제도와 앙주앙 섬의 열병 속에서 세상을 떠났다. 소식은 두 해 뒤에야 닿았다.')}}});

beat('jules','ju_cholera',{when:()=>!bfRev()&&bfAlive('jules')&&bfHere()&&bfW(1832.22,1832.5),until:()=>bfRev()||T()>=1832.5,run:async()=>{const J=bN('jules'),F=bfR('jules').sex==='F';
  await bfScene('콜레라의 봄','le choléra',`1832년 봄. 콜레라가 파리를 휩쓴다. 하루에 수백 명이 죽는다. 피난 가라는 권유를 거절한 ${bI('jules')} 오텔디외 병원과 골목을 돌며 ${F?'병자를 씻기고 먹인다':'종부성사를 준다'}. 그 곁에서 말을 더듬는 사람은 아무도 없다.`,[
   {l:'함께 병자들을 돌본다',a:'bold pious',f:()=>{bfBrave();say('한 달 동안 병자들 곁에 있었다.'+fx({hp:-3,faith:2,rloc:3}));bfMem('m_cholera','jules',`1832년 콜레라의 봄, ${bW('jules')} 함께 병자들을 돌보았다.`,{tone:'감사',their:'그 사람이 곁에 있었다. 그래서 무섭다는 말을 하느님께만 하지 않아도 되었다.'});bfRel('jules',{close:10})}},
   {l:'떠나라고 설득한다',a:'family',f:()=>{bfMem('m_cholera','jules',`1832년 콜레라의 봄, ${J}에게 떠나라고 했다. ${bHe('jules')}는 “여기가 제 자리예요.”라고 했다.`,{tone:'두려움',their:'떠나라는 말을 들었다. 고마웠다. 떠날 수 없었다.'})}},
   {l:'멀리서 기도한다',a:'pious safe',f:()=>{bfCare();bfMem('m_cholera','jules',`1832년 콜레라의 봄, 병자들 곁의 ${bL('jules')} 위해 멀리서 기도했다.`,{tone:'두려움',their:'그 사람이 기도한다고 했다. 나도 그 사람을 위해 기도했다.'})}}]);
  if(await chance(.22,`콜레라 · ${J}`,'1832년 파리 콜레라 사망 약 1만 9천 명, 병자를 돌본 사제·의사의 사망률이 높았다'))bfDie('jules','cholera','병자들을 돌보다 콜레라에 걸려 세상을 떠났다. 마지막까지 노래하듯 기도했다고 한다.')}});

beat('antoine','an_rise',{when:()=>bfAlive('antoine')&&bfHere()&&!child()&&(bfRev()?bfW(1791.3,1797):bfW(1838,1846.5)),until:()=>bfRev()?T()>=1797:T()>=1846.5,run:async()=>{const A=bN('antoine'),rv=bfRev();bfJob('antoine',rv?'국유재산 투기꾼':'은행가');bfFate('antoine',rv?'국유재산 경매로 큰돈을 벌었다':'철도 주식으로 이름난 은행가가 되었다');
  const jc=rv&&bfFl('jules','refr');const lc=!rv&&bfAlive('louise');
  const T0=rv?`${bI('antoine')} 마차를 타고 나타났다. 국유재산 경매에서 수도원 땅을 헐값에 사들였다고 한다.${jc?` ${bN('jules')}가 쫓겨난 ${bfPar()} 부속 건물도 그중 하나다.`:''} “너도 한몫 끼어. 지금 안 사면 바보야. 다 가족 때문이야. 다시는 가난하게 살지 않을 거야.”`
   :`${bU('antoine')} 이제 증권거래소에서 이름난 은행가다. 철도 주식 이야기를 한다. “기조 총리가 그랬지. 부자가 되라고.”${lc?` 새 역이 들어설 자리에 ${bN('louise')}의 빵집 골목도 들어 있다.`:''} “너도 한몫 끼어. 다 가족 때문이야. 다시는 가난하게 살지 않을 거야.”`;
  await bfScene(rv?'국유재산':'철도 주식',rv?'les biens nationaux':'enrichissez-vous',T0,[
   s.money>=60?{l:'돈을 댄다',s:'재산 -',a:'greedy',f:()=>{const m=Math.min(600,Math.round(s.money*.3));s.money-=m;bfSet('antoine','invested',m);bfMem('m_rise','antoine',`${bI('antoine')} ${rv?'국유재산':'철도 주식'}에 한몫 끼라고 했다. 돈을 댔다.`,{tone:'씁쓸함',their:'그 사람이 돈을 댔다. 나 혼자 더러워지는 게 아니라서 조금 덜 무서웠다.'});say(`${bU('antoine')} 당신의 손을 꽉 쥐었다. “후회하지 않을 거야.”`)}}:null,
   {l:'거절한다',a:'safe',f:()=>{bfMem('m_rise','antoine',`${bI('antoine')} ${rv?'국유재산':'철도 주식'}에 한몫 끼라고 했다. 거절했다.`,{tone:'그리움',their:'그 사람은 거절했다. 늘 조심성 많은 사람이었다. 나는 그런 사람이 부러웠다.'})}},
   (jc||lc)?{l:jc?`“그건 ${bN('jules')}의 성당이잖아.” 하고 따진다`:`“거긴 ${bN('louise')}의 빵집이잖아.” 하고 따진다`,a:'bold',f:()=>{bfMem('m_rise','antoine',`${bI('antoine')} 한몫 끼라고 했을 때, 그건 ${jc?bN('jules')+'의 성당':bN('louise')+'의 빵집'}이 아니냐고 따졌다. ${bHe('antoine')}가 말했다. “누군가는 살 거였어. 나 아니면 다른 놈이.”`,{tone:'씁쓸함',their:'그 사람이 따졌다. 맞는 말이었다. 그래서 더 크게 웃었다.'});bfRel('antoine',{close:-6,resp:4})}}:null])}});

beat('antoine','an_ask',{when:()=>bfAlive('antoine')&&bfHere()&&!child()&&(bfRev()?bfW(1797.5,1812):bfW(1847.6,1849.5)),until:()=>bfRev()?T()>=1812:T()>=1849.5,run:async()=>{const A=bN('antoine'),rv=bfRev();const inv=bfF('antoine').fl.invested;
  if(inv){if(rv||R()<.4){s.money+=inv*2;say(`${bI('antoine')} 예전에 댄 돈을 두 배로 돌려주었다.`+` (재산 +${fmt(inv*2)})`)}else say(`${bI('antoine')} 받아 간 돈은 철도 거품과 함께 사라졌다.`,'dark')}
  const twice=bfFl('antoine','lent')||bfFl('antoine','gave');
  await bfScene('보증','la caution',`${bI('antoine')} 찾아왔다. ${rv?'군납 장화 밑창이 종이였다는 고발이 들어와 재판을 앞두고 있다':'철도 거품이 꺼지고 은행이 무너졌다. 채권자들이 그를 고소했다'}. 법정에서 그의 사람됨을 증언하고 보증을 서 달라고 한다. ${twice?'“너한테 두 번 빚지는 건 정말 싫은데.”':'“너한테만은 부탁하고 싶지 않았는데.”'}`,[
   {l:'증언하고 보증을 선다',s:'재산 -, 명성 -',a:'social',f:()=>{bfBrave();const m=Math.min(400,Math.round(s.money*.15));s.money-=m;bfSet('antoine','vouched');bfMem('m_vouch','antoine',`${bI('antoine')} 법정에 섰을 때 증언하고 보증을 섰다.`,{tone:'감사',their:twice?'그 사람은 두 번이나 나를 구했다. 첫 번째는 단추였다.':'그 사람이 증언대에 섰다. 나는 그 사람 얼굴을 볼 수 없었다.'});bfRel('antoine',{close:10,trust:10});say(`${bU('antoine')} 가벼운 벌금으로 풀려났다.`+fx({fame:-1}))}},
   {l:'돈은 빌려주지만 증언은 못 한다',a:'safe',f:()=>{const m=Math.min(200,Math.round(s.money*.1));s.money-=m;bfMem('m_vouch','antoine',`${bI('antoine')} 법정에 섰을 때 돈은 빌려주었지만 증언은 하지 않았다.`,{tone:'씁쓸함',their:'그 사람은 돈을 주고 얼굴은 주지 않았다. 나라도 그랬을 것이다.'});
     if(R()<.5){bfFate('antoine','재판에서 지고 재산을 잃었다');bfJob('antoine','몰락한 상인')}}},
   {l:'거절한다',a:'safe',f:()=>{bfCare();bfMem('m_vouch','antoine',`${bI('antoine')} 법정에 섰을 때 보증을 서 달라고 했지만 거절했다.`,{tone:'후회',their:'그 사람은 거절했다. 괜찮다고 했다. 정말 괜찮았는지는 나도 모른다.'});bfFate('antoine','재판에서 지고 재산을 모두 잃었다');bfJob('antoine','몰락한 상인');bfReg('r_ant','antoine',`법정에 선 ${bL('antoine')} 외면했다.`);say(`${bU('antoine')} “괜찮아. 나라도 거절했을 거야.”라고 했다. 석 달 뒤 그의 가게에 경매 딱지가 붙었다.`,'dark')}}])}});

beat('gabriel','ga_after',{when:()=>bfAlive('gabriel')&&bfFl('gabriel','hid')&&bfHere()&&bfR('gabriel').cond==='normal'&&(bfRev()?bfW(1795.2,1800):bfW(1833.2,1838)),until:()=>bfRev()?T()>=1800:T()>=1838,run:async()=>{const Ga=bN('gabriel'),rv=bfRev();bfJob('gabriel',noble()?'몰락한 옛 귀족':'가게를 줄인 도매상');
  await bfScene('거울 없는 사람','le miroir vendu',rv?`테르미도르 뒤, 금빛 청년단과 앵크루아야블의 시대다. 다들 다시 화려하게 차려입는데 ${bU('gabriel')} 검은 옷만 입는다. 은테 손거울은 전당포에 맡겼다고 한다. “이젠 거울이 필요 없어.”`:`감옥에서 나온 ${bU('gabriel')} 대로의 멋쟁이들 사이에 다시 나타나지 않는다. 은테 손거울은 전당포에 맡겼다고 한다. “이젠 거울이 필요 없어.”`,[
   s.money>=30?{l:'전당포에서 거울을 찾아다 돌려준다',s:'재산 -30',a:'social',f:()=>{s.money-=30;bfMem('m_mirror2','gabriel',`전당포에서 ${Ga}의 은테 손거울을 찾아다 돌려주었다.`,{tone:'위로',their:'그 사람이 거울을 찾아왔다. 다시 들여다보니, 거울 속 얼굴이 처음으로 싫지 않았다.'});bfRel('gabriel',{close:10});bfRe('m_mirror','그 손거울을 다시 쥐여 주던 날, 밤늦게 거울을 내려놓던 그의 얼굴이 떠올랐다.','위로')}}:null,
   {l:'“검은 옷이 잘 어울려.”라고 말한다',a:'social',f:()=>{bfMem('m_mirror2','gabriel',`검은 옷만 입는 ${Ga}에게 잘 어울린다고 했다. ${bHe('gabriel')}는 오랜만에 소리 내어 웃었다.`,{tone:'위로',their:'그 사람은 검은 옷이 어울린다고 했다. 거짓말이었다. 고마운 거짓말이었다.'});bfRel('gabriel',{close:6})}},
   {l:'옛날처럼 놀린다',a:'bold',f:()=>{bfMem('m_mirror2','gabriel',`검은 옷만 입는 ${bL('gabriel')} 옛날처럼 놀렸다. ${bHe('gabriel')}는 놀림을 듣고서야 마음이 놓인 얼굴이었다.`,{tone:'그리움',their:'그 사람이 옛날처럼 놀렸다. 그제야 다 지나갔다는 걸 알았다.'})}}])}});

beat('jules','ju_return',{when:()=>bfRev()&&bfAlive('jules')&&bfFl('jules','refr')&&bfHere()&&bfW(1801.6,1804),until:()=>!bfRev()||T()>=1804,run:async()=>{const J=bN('jules'),F=bfR('jules').sex==='F';bfJob('jules',bAge('jules')>=42?'본당 신부':'보좌 신부');bfFate('jules','콩코르다 뒤 다시 성당으로 돌아왔다');
  const how=bfFl('jules','deported')?'로슈포르 감옥선에서 살아남았다':bfFl('jules','atGab')?`${bN('gabriel')}의 다락방과 지하실을 전전하며 살아남았다`:'숨어 지내며 살아남았다';
  await bfScene('다시 울리는 종','le Concordat',`콩코르다 뒤 ${bI('jules')} 돌아왔다. ${how}. 머리가 하얗게 셌다. 대포를 만든다며 끌려 내려갔던 ${bfPar()}의 종 대신 새 종이 걸렸다. 그 아래서 ${bI('jules')} 당신 이름을 부른다. 더듬지 않는다.`,[
   bfFl('jules','betrayed')?{l:'용서를 구한다',a:'pious',f:()=>{bfMem('m_bells','jules',`콩코르다 뒤 돌아온 ${J}에게 그 밤의 일을 말하고 용서를 구했다. “알고 있었어요. 오래전에 용서했어요. 당신을 위해서가 아니라, 제가 살기 위해서.”`,{tone:'위로',place:'종탑 아래',their:'그 사람이 용서를 구했다. 나는 이미 용서했다. 그래도 그 말을 직접 듣고 싶었다는 걸 그때 알았다.'});bfEase('r_told',`${bI('jules')} 용서했다. 자기가 살기 위해서라고 했다.`)}}:null,
   {l:'종소리를 함께 듣는다',a:'pious social',f:()=>{bfMem('m_bells','jules',`콩코르다 뒤 돌아온 ${bW('jules')} ${bfPar()} 종탑 아래서 새 종소리를 들었다.`,{tone:'위로',place:'종탑 아래',their:'그 사람과 함께 종소리를 들었다. 종지기의 아이였을 때와 같은 자리였다.'});bfRel('jules',{close:6})}},
   bfHas('feather')?{l:'간직한 참새 깃털을 보여 준다',a:'social',f:()=>{bfMem('m_bells','jules',`콩코르다 뒤 돌아온 ${J}에게 서랍에 간직해 온 참새 깃털을 보여 주었다. ${bHe('jules')}는 깃털을 쥐고 소리 내어 웃었다.`,{tone:'기쁨',place:'종탑 아래',their:'그 사람이 깃털을 아직 가지고 있었다. 그 참새는 열흘 만에 날아갔는데.'});bfRe('m_sparrow','깃털을 다시 꺼내 보던 날, 종탑 아래 참새는 이 모든 일을 몰랐을 것이라는 생각을 했다.','위로');bfRel('jules',{close:8})}}:null])}});

/* ================= 늦은 날들: 다시 해석되는 기억 ================= */
beat('etienne','et_late',{when:()=>bfAlive('etienne')&&s.age>=55&&(bfRev()?T()>=1815.5:T()>=1840)&&s.cond!=='prison',until:()=>false,run:async()=>{const E=bN('etienne');const law=bfS().law,ln=law?bfLawN(law):'';const gone=law&&bfLawEnd(law)&&T()>=bfLawEnd(law)&&!(law==='debt'&&bfRev());
  const ex=bfFl('etienne','exiled');
  const lawLine=!law?'':law==='seize'?`내가 고른 그 법은 아직 그대로야.`:gone?`네가 고른 ‘${ln}’은 없어졌지. 우리가 없앤 건 아니지만.`:`네가 고른 ‘${ln}’은 아직 그대로야.`;
  const ps=bfS().erased&&R()<.5;
  const txt=`“그 약속 기억해? 우리는 무슨 법을 없앴을까. ${lawLine} 나는 평생 법을 없애려다 법이 되었어. 그래도 퐁뇌프는 아직 거기 있더라.${ps?' 추신. 그해 겨울 명단에서 이름 하나를 지웠어. 말하면 그게 너를 위한 일이 될 것 같아서 말하지 않았어.':''}”`;
  bfLetter('etienne',txt,{wake:['m_promise','m_book']});
  if(ps){bfKnow('etienne','name',3);bfAns('q_et_name',`${bI('etienne')} 직접 그 이름을 지웠다. 늙어서 보낸 편지의 추신에 그렇게 썼다.`)}
  await bfScene(`${E}의 편지`,'la vieille promesse',`${ex?'먼 섬에서 온 ':''}편지의 글씨가 많이 떨린다. ${txt}`,[
   ex?null:{l:'퐁뇌프에서 만나자고 답장한다',a:'social',f:async()=>{const rup=bfFl('etienne','rupture')&&!bfFl('etienne','thaw');
     if(!rup||R()<.6){bfSet('etienne','reconciled');bfMem('m_old_bridge','etienne',`늙어서 ${bW('etienne')} 퐁뇌프 난간에 다시 앉았다. 둘 다 한동안 말이 없었다. ${bI('etienne')} 먼저 『텔레마코스의 모험』 한 구절을 외웠다.`,{tone:'위로',place:'퐁뇌프',their:'그 사람이 와 주었다. 오십 년 전 그 자리에. 나는 그거면 됐다.'});bfRe('m_promise','다리 위에서 다시 만난 날, 그 약속은 지키지 못한 약속이 아니라 함께 했던 약속이 되었다.','위로');if(bfFl('etienne','rupture'))bfEase('r_et_fall','늙어서 퐁뇌프에서 다시 만났다.');bfRel('etienne',{close:12,hate:-20});say(`${bU('etienne')} 와 있었다. 먼저 와서 난간에 앉아 있었다.`,'big')}
     else{bfAsk('q_et_bridge','etienne',`그날 ${bU('etienne')} 왜 퐁뇌프에 오지 않았을까?`);bfMem('m_old_bridge','etienne',`늙어서 퐁뇌프에서 만나자고 답장했다. 해가 질 때까지 기다렸지만 ${bU('etienne')} 오지 않았다.`,{tone:'후회',place:'퐁뇌프'});bfReg('r_et_wait','etienne',`${bW('etienne')}의 화해를 끝내 이루지 못했다.`);say(`해가 질 때까지 기다렸다. ${bU('etienne')} 오지 않았다.`,'dark')}}},
   {l:'긴 답장을 쓴다',a:'study',f:()=>{bfLetter('etienne','당신이 쓴 긴 답장',{mine:true});bfMem('m_old_letter','etienne',`늙은 ${E}에게 긴 답장을 썼다. 퐁뇌프의 저녁, 『텔레마코스의 모험』, 카페 프로코프의 밤을 차례로 적었다.`,{tone:'그리움',their:'그 사람의 답장에는 내가 잊은 것들이 적혀 있었다. 나는 그 편지를 머리맡에 두었다.'});bfRel('etienne',{close:6,hate:-6})}},
   {l:'답장하지 않는다',a:'safe',f:()=>{bfReg('r_et_noreply','etienne',`늙은 ${E}의 편지에 끝내 답장하지 않았다.`);bfRe('m_promise','답장하지 않은 편지가 서랍에 있었다. 약속은 거기서 멈췄다.','후회')}}])}});

beat('louise','lo_late',{when:()=>bfAlive('louise')&&s.age>=45&&bfHere(),until:()=>false,run:async()=>{const L=bN('louise');const pret=!bfFl('louise','taught')&&!bfFl('louise','both');
  if(pret&&lit()){bfKnow('louise','read',3);bfAns('q_lou_read',`${bU('louise')} 글을 읽지 못했다. 평생 당신이 읽어 준 것을 외워 두었다.`);
    await bfScene('편지 다발','les lettres jamais lues',`${bI('louise')} 보자기를 들고 왔다. 풀어 보니 편지 다발이다. ${bfRev()?'러시아로 끌려간 아들':'알제리로 간 아들'}과 고향을 떠난 동생이 보낸 편지들이다. 봉투는 대부분 뜯겨 있다. “한 번도 못 읽었어. 대서인한테 읽어 달라면 돈이 들고, 너한테는… 창피했어. 네가 읽어 준 건 다 외웠지. 이번엔 그냥, 처음부터 끝까지 읽어 줘.”`,[
     {l:'밤새 다 읽어 준다',a:'family',f:()=>{bfMem('m_letters','louise',`${bI('louise')} 평생 읽지 못한 편지 다발을 가져왔다. 밤새 처음부터 끝까지 읽어 주었다.`,{tone:'위로',their:'그 사람의 목소리로 아들의 편지를 들었다. 아들 목소리는 아니었는데, 이상하게 그게 더 좋았다.'});bfRe('m_read',bfFl('louise','pretend')?'그때 거꾸로 든 전단을 모른 척 읽어 준 일이, 그녀에게는 평생의 비밀을 지켜 준 일이었다.':'그때 그 전단 앞에서 그녀가 무엇을 숨기고 있었는지 이제야 알았다.','위로');if(bfFl('louise','pretend'))bfTheirs('m_read','그 사람은 끝까지 모른 척했다. 그래서 나는 들킨 줄도 몰랐다. 오늘에야 그게 모른 척이었다는 걸 알았다.');bfRel('louise',{close:10})}},
     {l:'지금이라도 글을 가르쳐 주겠다고 한다',a:'study',f:()=>{bfSet('louise','taught');bfMem('m_letters','louise',`${bI('louise')} 평생 읽지 못한 편지 다발을 가져왔다. 지금이라도 글을 가르쳐 주겠다고 했다. 그해 겨울, ${bHe('louise')}는 처음으로 자기 이름을 썼다.`,{tone:'희망',their:'쉰 살에 내 이름을 썼다. 삐뚤었다. 그 사람이 박수를 쳤다.'});bfRel('louise',{close:10})}}]);return}
  const txt='“빵 꽁다리 기억해? 아직도 제일 바삭한 데는 너 줄게.”';bfLetter('louise',bfFl('louise','taught')?`철자가 엉망인 편지. ${txt}`:`손자가 받아 적은 편지. ${txt}`,{wake:['m_bread']});
  await bfScene(`${L}의 편지`,'une lettre',bfFl('louise','taught')?`${bI('louise')} 처음으로 당신에게 편지를 썼다. 철자가 엉망이다. ${txt}`:`${L}의 손자가 받아 적은 편지가 왔다. ${txt}`,[{l:'편지를 서랍에 넣는다',a:'family',f:()=>{bfMem('m_letters','louise',`${L}에게서 편지가 왔다. “아직도 제일 바삭한 데는 너 줄게.”`,{tone:'위로'})}}])}});

beat('louise','lo_final',{when:()=>bfAlive('louise')&&s.age>=62&&bfHere(),until:()=>false,run:async()=>{const L=bN('louise');
  await bfScene('꽁다리','le quignon',`${bI('louise')} 빵 한 덩이를 들고 왔다. 둘 다 머리가 하얗다. ${bHe('louise')}는 말없이 꽁다리를 뚝 떼어 당신에게 내민다. “제일 바삭한 데야. 아무한테나 안 줘.”`,[
   {l:'받아서 반으로 가른다',a:'family',f:()=>{bfRe('m_bread','예순 해가 지나도, 그 꽁다리는 제일 바삭한 데였다.','위로');bfEase('r_bake',`늙은 ${bI('louise')} 다시 꽁다리를 떼어 주었다. 아무 말도 하지 않았다.`);bfMem('m_bread2','louise',`늙은 ${bI('louise')} 다시 빵 꽁다리를 떼어 주었다. 반으로 갈라 나눠 먹었다.`,{tone:'위로',place:'당신의 부엌',their:'그 사람은 또 반을 돌려주었다. 처음 그날처럼.'});bfRel('louise',{close:6})}}])}});

beat('antoine','an_truth',{when:()=>s.age>=58&&bfHere()&&bfMet('antoine'),dead:true,until:()=>false,run:async()=>{const A=bN('antoine');const r=bfR('antoine');
  if(!r.alive){if(bfKn('antoine','silence')<1)return;const ok=R()<.5;
    if(ok){bfKnow('antoine','silence',3);bfAns('q_an_silence',`${A}의 미망인이 보낸 편지에 적혀 있었다. 그날 ${bHe('antoine')}는 도움을 청하려다 그만두었다.`);bfTheirs('m_silence','그날 도움을 청하려 했다. 그런데 우정이 동정으로 바뀌는 게 싫었다.')}
    bfLetter('antoine',ok?`${A}의 미망인이 보낸 편지. “그이는 젊었을 적 선술집에서 당신에게 말하지 못한 일이 있다고 자주 말했어요. 도와 달라는 말이었대요. 우정이 동정이 되는 게 싫었다고요.”`:`${A}의 미망인이 보낸 편지. “그이가 당신 이야기를 자주 했어요. 무슨 이야기였는지는 말해 주지 않았지만요.”`,{wake:['m_silence']});
    say(`${A}의 미망인에게서 편지가 왔다.${ok?' 오래 묻어 둔 질문의 답이 적혀 있었다.':''}`,'ev');return}
  await bfScene('같은 자리','le même coin',`늙은 ${bI('antoine')} 찾아왔다. 선술집 구석, 예전 그 자리. 이번엔 ${bI('antoine')} 먼저 잔을 든다. “우리 여기서 마지막으로 이렇게 앉은 게 언제였지?”`,[
   bfKn('antoine','silence')>=1?{l:'“그날 왜 말을 멈췄어?” 하고 묻는다',a:'social',f:()=>{if(R()<.6){bfKnow('antoine','silence',3);bfAns('q_an_silence',`${bI('antoine')} 늙어서 말해 주었다. 도움을 청하려다 그만두었다고.`);bfTheirs('m_silence','그날 도움을 청하려 했다. 그런데 우정이 동정으로 바뀌는 게 싫었다.');say(`${bU('antoine')} 한참 잔만 보다가 말했다. “도와 달라고 하려 했어. 그런데 네가 나를 불쌍하게 보면, 우리는 다시는 이렇게 못 앉을 것 같았어.”`,'big')}else say(`${bU('antoine')} 웃었다. “그런 일이 있었나? 기억 안 나.” 정말 기억나지 않는 얼굴이었다.`)}}:null,
   bfHas('button')?{l:'서랍 속 은단추를 돌려준다',a:'social',f:()=>{bfLose('button',`${A}에게 돌려주었다`);bfTheirs('m_button','아버지 외투에 남은 마지막 은단추였다. 그날 저녁 아버지는 단추가 어디 갔느냐고 묻지 않았다.');bfRe('m_button','쉰 해 만에 단추를 돌려주던 날, 그것이 그의 아버지 외투의 마지막 단추였다는 것을 들었다.','위로');say(`${bU('antoine')} 단추를 손바닥에 올려놓고 오래 내려다보았다. “아버지 외투의 마지막 단추였어.”`,'big')}}:null,
   {l:'그냥 함께 잔을 비운다',a:'social',f:()=>{bfMem('m_old_tavern','antoine',`늙은 ${bW('antoine')} 예전 그 선술집 구석에서 잔을 비웠다. 둘 다 옛날 일은 묻지 않았다.`,{tone:'그리움',their:'그 사람은 아무것도 묻지 않았다. 고마웠고, 조금 서운했다. 젊을 때와 똑같이.'})}}])}});

beat('gabriel','ga_late',{when:()=>bfAlive('gabriel')&&s.age>=56&&bfHere(),until:()=>false,run:async()=>{const Ga=bN('gabriel');const hid=bfFl('gabriel','hid');
  await bfScene('늙은 멋쟁이','le vieux dandy',`${bU('gabriel')} 일흔이 다 되어서도 머리에 물을 들인다. 손거울을 보며 웃는다. “늙은 얼굴도 볼만하지?” 그러다 묻는다. “그 개 기억나?”`,[
   hid?{l:'“다락방 문을 열던 네 얼굴이 기억나.”',a:'social',f:()=>{bfTheirs('m_dog',bfM('m_dog')&&bfM('m_dog').their);bfRe('m_dog','늙어서 다시 그 개 이야기를 했다. 이제 그 골목은 달아난 날이 아니라, 다시는 달아나지 않기로 한 날로 기억된다.','위로');say(`${bU('gabriel')} 손거울을 내려놓았다. 오래전 그 밤처럼.`)}}:null,
   {l:'“기억나. 네가 제일 빨랐지.”',a:'bold',f:()=>{bfRe('m_dog','늙어서 다시 그 개 이야기를 하며 둘이 깔깔 웃었다.','기쁨');say('둘은 늙은이답지 않게 깔깔 웃었다.')}},
   {l:'푸른 리본을 꺼내 보여 준다',dis:!bfHas('ribbon'),a:'social',f:()=>{bfRe('m_dog','늙어서 그가 준 푸른 리본을 꺼내 보였다. 그는 그 리본을 기억하지 못했다.','그리움');bfMem('m_ribbon','gabriel',`늙은 ${Ga}에게 그가 열 살 때 준 푸른 리본을 보여 주었다. ${bHe('gabriel')}는 그 리본을 기억하지 못했다.`,{tone:'그리움',their:'그 사람이 리본을 꺼냈다. 내가 준 거라고 했다. 기억나지 않았다. 그래도 그 사람이 그걸 오십 년 동안 가지고 있었다는 건 잊지 않을 것이다.'})}}])}});

beat('jules','ju_late',{when:()=>bfAlive('jules')&&s.age>=60&&bfHere(),until:()=>false,run:async()=>{const J=bN('jules'),F=bfR('jules').sex==='F';
  await bfScene('종탑','le clocher',`${bI('jules')} 종탑에 올라가자고 한다. 종지기는 이제 없다. ${bHe('jules')}가 직접 줄을 당긴다. 종소리가 지붕들 위로 퍼진다. “어릴 때 여기서 참새를 숨겼었죠. 기억해요?”`,[
   {l:'“기억해. 열흘 만에 날아갔지.”',a:'pious',f:()=>{bfRe('m_sparrow','늙어서 다시 종탑에 올랐다. 참새는 열흘 만에 날아갔고, 그 아이는 평생 그 자리에 남았다.','위로');bfMem('m_bells2','jules',`늙은 ${bW('jules')} 종탑에 올라 종을 쳤다.`,{tone:'위로',place:'종탑',their:'그 사람과 종을 쳤다. 참새를 숨기던 아이 둘이 여기까지 왔다.'})}},
   {l:'“네가 겁쟁이였던 적은 없어.”',a:'social',f:()=>{bfKnow('jules','stutter',3);bfRe('m_vow','“나는 겁쟁이니까”라던 그 말을, 이제는 누구보다 용감했던 사람의 말로 기억한다.','위로');bfMem('m_bells2','jules',`늙은 ${J}에게 겁쟁이였던 적은 없다고 말했다. ${bHe('jules')}는 대답 대신 종을 한 번 더 쳤다.`,{tone:'위로',place:'종탑',their:'그 사람이 내가 겁쟁이가 아니었다고 했다. 처음으로 그 말을 믿어 보기로 했다.'})}}])}});

// 스무 해 뒤의 다리
beat('group','g_reunion',{when:()=>bfS().meetY&&s.year===bfS().meetY&&s.month>=(bfS().meetM||0)&&bfHere(),dead:true,until:()=>bfS().meetY?s.year>bfS().meetY:false,
  miss:()=>{if(!bfS().meetY||bfS().reunion)return;bfReg('r_reunion','group','퐁뇌프에서 스무 해 뒤에 만나자던 날, 그 자리에 가지 못했다.');bfAsk('q_reunion','group','스무 해 뒤 그날, 다리에는 누가 왔을까?')},
  run:async()=>{const B=bfS();B.reunion=true;const all=BF_KEYS.filter(bfMet);const came=[],absent=[];
  for(const k of all){const r=bfR(k);if(!r.alive){absent.push(`${bU(k)} 이미 세상에 없었다`);continue}if(r.cond!=='normal'){absent.push(`${bU(k)} ${r.cond==='prison'?'감옥에':r.cond==='deported'?'먼 유형지에':'먼 곳에'} 있었다`);continue}
    if(k==='louise'&&R()<.35){absent.push(`${bU(k)} 오지 않았다`);bfAsk('q_lou_bridge','louise',`약속한 날 ${bU('louise')} 왜 다리에 오지 않았을까?`);continue}
    if(r.close<35&&R()<.6){absent.push(`${bU(k)} 오지 않았다`);continue}came.push(k)}
  const T0=`스무 해 전에 약속한 날이다. 퐁뇌프 난간. ${came.length?`${bfListW(came)} 당신이 왔다.`:'당신 혼자다.'} ${absent.join('. ')}${absent.length?'.':''}${B.carved?' 난간 돌에 새긴 이름들은 비바람에 반쯤 지워졌다.':''}`;
  await bfScene('스무 해 뒤','vingt ans après',T0,[{l:came.length?'해가 질 때까지 함께 있는다':'해가 질 때까지 기다린다',a:'social',f:()=>{bfMem('m_reunion',came.length?came:all,came.length?`스무 해 만에 퐁뇌프에서 ${bfListW(came)} 다시 만났다. ${absent.length?absent[0]+'.':''}`:'스무 해 만에 약속한 다리에 갔다. 아무도 오지 않았다.',{tone:came.length?'그리움':'씁쓸함',place:'퐁뇌프'});bfRe('m_bridge',came.length?'스무 해 뒤 같은 자리에서, 그날의 저녁이 다시 떠올랐다.':'스무 해 뒤 혼자 선 다리 위에서, 그날의 약속이 얼마나 가벼웠는지 알았다.',came.length?'위로':'씁쓸함');came.forEach(k=>bfRel(k,{close:6}))}}])}});

/* ---------- 그 법이 없어진 날 ---------- */
async function bfLawEcho(){const B=bfS(),law=B.law;if(!law||law==='seize'||!bfMet('etienne'))return false;const end=bfLawEnd(law);if(!end)return false;
  if(!B.lawEcho&&T()>=end&&(T()<end+3)){B.lawEcho=1;const ln=bfLawN(law);
    if(bfAlive('etienne')&&s.cond!=='prison'){const txt=`“‘${ln}’, 없어졌어. 우리 약속, 하나는 지켜졌다.”`;bfLetter('etienne',txt,{wake:['m_promise']});bfMem('m_lawgone','etienne',`퐁뇌프에서 고른 ‘${ln}’이 없어졌다. ${bN('etienne')}에게서 쪽지가 왔다. ${txt}`,{tone:'희망',their:'그 법이 없어진 날, 맨 먼저 그 사람에게 쪽지를 썼다.'});bfRe('m_promise','퐁뇌프에서 한 약속 하나가 지켜졌다. 둘이 지킨 것은 아니었다.','희망');say(`${bN('etienne')}에게서 짧은 쪽지가 왔다. ${txt}`,'big')}
    else{bfRe('m_promise',`퐁뇌프에서 고른 ‘${ln}’이 없어졌다. 이 소식을 함께 들을 사람이 없었다.`,'그리움');say(`퐁뇌프에서 고른 ‘${ln}’이 없어졌다는 소식을 들었다. 함께 들을 사람이 없었다.`,'ev')}return true}
  if(law==='debt'&&bfRev()&&B.lawEcho===1&&T()>=1797.6&&T()<1800){B.lawEcho=2;bfRe('m_promise','빚 때문에 사람을 가두는 감옥이 다시 문을 열었다. 지켜진 약속은 네 해를 가지 못했다.','씁쓸함');say('채무 구금이 되살아났다. 빚진 사람들이 다시 생트펠라지로 끌려갔다.','ev');return true}
  return false}

/* ---------- 해마다: 흐려지는 기억, 그들의 삶, 편지, 시대의 흔적 ---------- */
const BF_AMB=[
 ['a_tu',()=>bfRev()&&bfAlive('etienne')&&bfW(1792.7,1794.5)&&lit(),()=>`${bN('etienne')}의 편지에서 ‘당신’이 사라지고 ‘너’와 ‘시민’이 들어섰다. 끝인사는 ‘형제애로’였다.`],
 ['a_cit',()=>bfRev()&&bfAlive('etienne')&&bfW(1795,1797.5)&&lit(),()=>`${bN('etienne')}의 편지에서 ‘시민’이라는 말이 사라졌다. 편지는 점점 짧아졌다.`],
 ['a_bells',()=>bfRev()&&bfMet('jules')&&bfW(1793.3,1794.6),()=>`${bfPar()}의 종이 대포를 만든다며 끌려 내려갔다. ${bfAlive('jules')?`${bU('jules')} 어디 숨어 있는지 아무도 모른다.`:'종지기의 아이는 이 광경을 보지 못했다.'}`],
 ['a_table',()=>bfAlive('louise')&&!child()&&bfDear()&&s.age>=25,()=>`${bN('louise')}네 식탁에서 고기가 사라졌다. 그녀는 아이들 몫의 빵을 자기 몫에서 뗀다. 둘은 이제 빵집 대신 성당 계단에서 만난다.`],
 ['a_rest',()=>bfRev()&&bfAlive('etienne')&&bfW(1815.5,1818),()=>`${bU('etienne')} 이제 남들 앞에서 정치 이야기를 하지 않는다. 대신 동네 아이들에게 『텔레마코스의 모험』을 가르친다고 한다.`],
 ['a_sept',()=>!bfRev()&&bfAlive('etienne')&&bfW(1835.7,1838),()=>`9월 법 이후 ${bN('etienne')}의 글은 날이 무뎌졌다. ${bHe('etienne')}의 이름은 이제 훈장 명단에 오른다.`],
 ['a_coach',()=>bfAlive('antoine')&&bfFl('antoine','invested'),()=>`${bI('antoine')} 새 마차를 샀다는 소문이 들린다. 문짝에 가문 문장 비슷한 것을 그려 넣었다고 한다.`],
 ['a_newbell',()=>bfRev()&&bfMet('jules')&&bfW(1802.3,1806),()=>`${bfPar()}에 새 종이 걸렸다.${bfAlive('jules')?'':` ${bU('jules')} 이 소리를 듣지 못했다.`}`],
 ['a_gabjail',()=>bfAlive('gabriel')&&bfR('gabriel').cond==='prison'&&!bfRev()&&s.year>=1833,()=>{bfR('gabriel').cond='normal';bfFate('gabriel','감옥에서 풀려났다');return `${bU('gabriel')} 감옥에서 풀려났다. 머리가 많이 셌다.`}]];
const BF_REPLY={
 louise:()=>bfFl('louise','taught')?'“빵값이 또 올랐어. 그래도 꽁다리는 남겨 둘게.” 철자가 군데군데 틀렸다.':'대서인이 대신 쓴 편지. “빵값이 또 올랐어. 그래도 꽁다리는 남겨 둘게.”',
 etienne:()=>bfRev()&&bfW(1792.7,1794.6)?'“형제애로. 너의 형제, 시민 '+bN('etienne')+'.” 편지는 공화국 이야기뿐이었다.':bfFl('etienne','rupture')&&!bfFl('etienne','thaw')?'답장은 오지 않았다.':'“멘토르의 말을 다시 읽었어. ‘좋은 왕은 백성을 위해 있다.’ 왕이 없어도 그 말은 맞는 것 같아.”',
 jules:()=>bfR('jules')&&bfR('jules').cond!=='normal'||(bfRev()&&bfW(1791,1801.6)&&bfFl('jules','refr'))?'이름 없는 쪽지 한 장. “살아 있어요. 기도합니다.”':'“당신을 위해 기도합니다. 깃털은 아직 가지고 있나요?”',
 antoine:()=>'“장사는 그럭저럭이야. 빚진 거 잊지 않았어.”',
 gabriel:()=>bfFl('gabriel','hid')?'“거울 없이도 그럭저럭 지내. 너는 여전히 옷을 못 입겠지.”':'“올해 유행은 짧은 조끼야. 너는 여전히 옷을 못 입겠지.”'};
function bfYear(){const B=bfS();if(!BF_KEYS.some(bfMet))return;
  // 기억은 흐려진다. 그 사람이 곁에 없으면 더 빨리.
  for(const m of B.mem){const alive=m.k.some(k=>k==='group'||bfAlive(k));m.w=Math.max(12,m.w-(alive?3:5))}
  // 그들의 삶: 늙고, 병들고, 떠난다
  for(const k of BF_KEYS){const r=bfR(k);if(!r||!r.alive)continue;const a=s.year-r.by;if(a<40)continue;
    if(R()<baseMort(a)*.75){bfDie(k,a>=60?'old':'ill',`${a}세로 세상을 떠났다.`);
      if(r.close>=55){const ms=B.mem.filter(m=>m.k.includes(k));const m=ms[ms.length-1];if(m)bfRe(m.id,`${bN(k)}의 부고를 받은 날, 이 기억을 다시 꺼냈다.`,'그리움')}}}
  // 쥘의 서품과 본당
  {const r=bfR('jules');if(r&&r.alive){const a=s.year-r.by;if(r.job==='신학생'&&a>=24){r.job='보좌 신부';bfFate('jules','사제 서품을 받았다');L(`${bU('jules')} 사제 서품을 받았다. 첫 미사에서 한 번도 더듬지 않았다.`,'ev')}else if(r.job==='보좌 신부'&&a>=42){r.job='본당 신부';bfFate('jules','본당 신부가 되었다')}}}
  // 당신의 혼례에 오지 않은 사람(끝내 이유를 모른다)
  if(s.married&&!B.lwed&&bfAlive('louise')){B.lwed=1;if(R()<.45){bfAsk('q_lou_wed','louise',`${bU('louise')} 왜 당신의 혼례에 오지 않았을까?`);L(`혼례 날 ${bU('louise')} 오지 않았다. 나중에 물으니 “일이 있었어.”라고만 했다.`,'ev')}}
  // 당신이 보낸 편지에 답장이 온다
  for(const k of BF_KEYS){const r=bfR(k);if(!r||!r.alive)continue;if(s.acts&&s.acts['let_'+r.fid]===s.year){const t=BF_REPLY[k]();bfLetter(k,t);L(`${bN(k)}의 답장. ${t}`,'ev');const ms=B.mem.filter(m=>m.k.includes(k));if(ms.length)bfWake(pick(ms).id)}}
  // 시대의 흔적
  for(const [id,c,t] of BF_AMB){if(B.amb[id])continue;let ok=false;try{ok=c()}catch(e){}if(ok){B.amb[id]=1;L(t(),'ev');break}}}

/* ---------- 진행 ---------- */
async function bfTick(){if(!s||s.dead)return;const B=bfS();const now=MI();
  if(await bfLawEcho())return;
  // 지나가 버린 장면은 건너뛴다
  const order=BF_KEYS.concat(['group']);const ready=[];
  for(const k of order){const L0=BFB.filter(b=>b.k===k);let st=B.st[k]||0;
    while(st<L0.length){const b=L0[st];if(k!=='group'&&st>0&&!bfMet(k)){st=L0.length;break}
      if(k!=='group'&&st>0&&!bfAlive(k)&&!b.dead){st++;continue}
      let exp=false;try{exp=b.until&&b.until()}catch(e){exp=true}
      if(exp){try{b.miss&&b.miss()}catch(e){console.error(e)}st++;continue}break}
    B.st[k]=st;const b=L0[st];if(!b)continue;let ok=false;try{ok=b.when()}catch(e){}if(ok)ready.push(b)}
  if(!ready.length)return;
  // 역사적 날짜에 묶인 장면(gap 0)은 쉬는 틈과 상관없이, 나머지는 몇 달씩 띄운다
  const urgent=ready.filter(b=>b.gap===0);const pickB=urgent.length?urgent[0]:(now>=(B.nx||0)?ready.sort((a,b)=>BF_KEYS.indexOf(a.k)-BF_KEYS.indexOf(b.k))[0]:null);
  if(!pickB)return;B.st[pickB.k]=(B.st[pickB.k]||0)+1;if(pickB.gap)B.nx=now+pickB.gap+(child()?2:0);
  try{await pickB.run()}catch(e){console.error('bonds',pickB.id,e)}}
{const _nm=npcMonth;npcMonth=async function(a,b){await _nm(a,b);if(!s||s.dead)return;try{await bfTick()}catch(e){console.error(e)}}}
{const _ny=npcYear;npcYear=async function(){await _ny();if(!s||s.dead)return;try{bfYear()}catch(e){console.error(e)}}}

/* ================= 화면: 오래된 벗 · 기억 탭 ================= */
const bfLatest=m=>m.re.length?m.re[m.re.length-1]:null;
function bfMemEl(m,k){const li=el('li','bm'+(m.w<35?' faded':''));const ag=m.a!=null?` · ${m.a}세`:'';
  li.appendChild(el('div','bm-y',`${m.y}년${ag}${m.place?` · ${m.place}`:''}`));
  const t=m.w<35?m.t.slice(0,Math.max(14,Math.round(m.t.length*m.w/60)))+'…':m.t;li.appendChild(el('p','bm-t',t));
  const L0=bfLatest(m);if(L0&&m.w>=35){const p=el('p','bm-re');p.appendChild(el('span','tone t-'+(BF_TONE.indexOf(L0.tone)),L0.tone));p.appendChild(document.createTextNode(` ${L0.y}년, ${L0.t}`));li.appendChild(p)}
  else if(!L0&&m.w>=35){li.appendChild(el('span','tone t-'+BF_TONE.indexOf(m.tone),m.tone))}
  const th=typeof m.their==='object'&&m.their?m.their[k]:m.their;if(m.tk&&th)li.appendChild(el('p','bm-th',`${bN(k)}의 기억: “${th}”`));
  if(m.w<35)li.appendChild(el('p','bm-fade','흐릿해진 기억이다. 편지나 물건, 다시 만나는 일이 있으면 떠오를지도 모른다.'));return li}
function bfPage(r,box){const k=r.core,B=bfS();
  box.appendChild(el('div','lab',`${bHe(k)}에 대해 아는 것`));const kn=el('ul','bk');
  for(const sec in BF[k].sec){const t=bfKn(k,sec);for(let i=0;i<t;i++)kn.appendChild(el('li',i===2?'truth':i===1?'clue':'seen',bfSecT(k,sec,i)))}
  if(!kn.children.length)box.appendChild(el('p','small mut','아직 잘 모른다. 함께 보낸 시간이 쌓이면 알게 되는 것들이 있다.'));else box.appendChild(kn);
  const ms=B.mem.filter(m=>m.k.includes(k));box.appendChild(el('div','lab',`함께한 시간 · ${ms.length}`));const ul=el('ul','bms');ms.forEach(m=>ul.appendChild(bfMemEl(m,k)));box.appendChild(ul);
  const qs=B.q.filter(q=>q.k===k);if(qs.length){box.appendChild(el('div','lab','알지 못하는 것'));const ql=el('ul','bq');qs.forEach(q=>{const li=el('li',q.ans?'ans':'',q.t);if(q.ans)li.appendChild(el('small',null,` — ${q.ans}`));ql.appendChild(li)});box.appendChild(ql)}
  const ob=B.obj.filter(o=>o.from===k);if(ob.length){box.appendChild(el('div','lab','당신이 간직한 것'));const c=el('div','chips');ob.forEach(o=>c.appendChild(el('span','chip',o.t+(o.lost?` (${o.lost})`:''))));box.appendChild(c)}
  const ls=B.let.filter(l=>l.k===k&&!l.mine);if(ls.length){box.appendChild(el('div','lab',`받은 편지 · ${ls.length}통`));const lu=el('ul','bl');ls.slice(-4).reverse().forEach(l=>lu.appendChild(el('li',null,`${l.y}년 — ${l.t}`)));box.appendChild(lu)}
  const rg=B.reg.filter(x=>x.k===k);if(rg.length){box.appendChild(el('div','lab','마음에 걸린 일'));const gu=el('ul','bq');rg.forEach(x=>{const li=el('li',x.ease?'ans':'',x.t);if(x.ease)li.appendChild(el('small',null,` — ${x.ease}`));gu.appendChild(li)});box.appendChild(gu)}}
let bfLastPP=null;
{const _pp=personPage;personPage=function(r){if(!r||!r.core){bfLastPP=null;return _pp(r)}
  if(bfLastPP!==r.fid){bfLastPP=r.fid;ppTab='mem'}const isMem=ppTab==='mem';if(isMem)ppTab='sum';_pp(r);if(isMem)ppTab='mem';
  const pin=$('#pin');const seg=pin&&pin.querySelector('.seg');if(!seg)return;const b=el('button',null,'기억');b.type='button';b.setAttribute('aria-pressed',String(isMem));b.onclick=()=>{ppTab='mem';personPage(r)};seg.insertBefore(b,seg.firstChild);
  if(!isMem)return;seg.querySelectorAll('button').forEach(x=>{if(x!==b)x.setAttribute('aria-pressed','false')});
  let n=seg.nextSibling;while(n){const nx=n.nextSibling;const keep=n.tagName==='BUTTON'||(n.tagName==='P'&&n.classList.contains('center'));if(!keep)n.remove();n=nx}
  const box=el('div','bfmem');bfPage(r,box);seg.after(box)}}
const bfStatus=r=>{if(!r.alive)return `${r.dead}년 세상을 떠남`;const c={prison:'감옥에 있다',deported:'먼 유형지에 있다',emigre:'망명 중',hiding:'숨어 지낸다'}[r.cond];return `${s.year-r.by}세 · ${c||r.job||''}`};
{const _rm=relMore;relMore=function(H){_rm(H);try{const ks=BF_KEYS.filter(bfMet);if(!ks.length||relFilter!=='all')return;const c=el('section','card bfc');const h=el('div','ch');h.innerHTML='<h2>오래된 벗</h2><span class="fr">les amis d’enfance</span>';c.appendChild(h);
  ks.forEach(k=>{const r=bfR(k);const b=el('button','prow bfrow'+(r.alive?'':' dead'));b.type='button';const t=el('div','pt');const n=bfS().mem.filter(m=>m.k.includes(k)).length;
    t.innerHTML=`<b>${r.n}</b><span>${BF[k].motif}</span><small>${bfStatus(r)} · 기억 ${n}</small>`;b.appendChild(t);b.appendChild(el('span','pic b-'+(r.alive?'love':'mid'),r.alive?'❦':'✝'));b.onclick=()=>personPage(r);c.appendChild(b)});
  c.appendChild(el('p','mut small center','어린 시절 일상에서 만난 사람들. 함께 보낸 시간은 기억이 되고, 기억은 세월에 따라 뜻이 바뀝니다.'));H.insertBefore(c,H.firstChild)}catch(e){console.error(e)}}}

/* ================= 생애 기록: 결말 대신 남는 것 ================= */
function bfRecord(){const B=s.bf;if(!B||!BF_KEYS.some(bfMet))return null;const he=isM()?'그':'그녀';const o={intro:[],drawer:[],voices:[],eval:'',unknown:[],mem:[],reg:[]};
  const young=!!(B.law&&(bfM('m_procope')||bfM('m_dawn')))||bfFl('etienne','together')||bfF('etienne').fl.stance==='with';
  if(young){o.intro.push(`${he}는 한때 세상을 바꿀 수 있다고 믿었다.`);if(bfM('m_procope')||bfM('m_dawn'))o.intro.push('젊은 시절에는 친구들과 밤늦도록 새로운 사회에 관해 이야기했다.');if(s.age>=40)o.intro.push(`그러나 시간이 흐르면서 ${he}는 거대한 선언보다 식탁 위의 빵과 가족의 안부를 더 자주 걱정하게 되었다.`)}
  else if(s.age>=14)o.intro.push(`${he}는 세상을 바꾸겠다고 말한 적이 없다. 다만 곁에 있던 사람들을 오래 기억했다.`);
  else o.intro.push(`${he}의 생애는 짧았다. 그래도 골목에는 ${he}와 빵을 나눠 먹고 담을 넘던 아이들이 있었다.`);
  const wait=B.reg.some(r=>r.id==='r_et_wait'&&!r.ease)||(bfFl('etienne','rupture')&&!bfFl('etienne','reconciled')&&!bfFl('etienne','thaw'));
  if(wait)o.intro.push(`${he}는 평생 한 친구와의 화해를 기다렸다. 끝내 화해가 이루어졌는지는 기록에 남아 있지 않다.`);
  if(B.law==='seize'&&bfMet('etienne'))o.intro.push(`퐁뇌프에서 ${bI('etienne')} 고른 ‘${bfLawN('seize')}’은 끝내 없어지지 않았다.`);
  else if(B.law&&B.lawEcho)o.intro.push(B.lawEcho===2?`퐁뇌프에서 고른 ‘${bfLawN(B.law)}’은 한때 없어졌다가 되살아났다.`:`퐁뇌프에서 고른 ‘${bfLawN(B.law)}’은 ${he}의 생전에 없어졌다.`);
  // 서랍 속에서
  const cnt={};B.let.filter(l=>!l.mine).forEach(l=>{cnt[l.k]=(cnt[l.k]||0)+1});
  Object.entries(cnt).forEach(([k,n])=>o.drawer.push(`${bN(k)}에게서 받은 편지 ${n}통${k==='etienne'&&B.let.some(l=>l.k==='etienne'&&/추신/.test(l.t))?', 마지막 편지에는 추신이 붙어 있었다':''}`));
  B.obj.filter(x=>!x.lost).forEach(x=>o.drawer.push(x.t));
  if(bfFl('etienne','told'))o.drawer.push('이름 하나가 까맣게 지워진 수첩');
  if(B.reg.some(r=>r.id==='r_et_noreply'))o.drawer.push(`답장하지 않은 ${bN('etienne')}의 편지 한 통`);
  B.obj.filter(x=>x.lost).forEach(x=>o.drawer.push(`없어진 것: ${x.t} — ${x.lost}`));
  // 벗들의 서로 다른 회고: 당신이 몰랐던 그들의 기억
  for(const k of BF_KEYS){if(!bfMet(k))continue;const ms=B.mem.filter(m=>m.k.includes(k)&&(typeof m.their==='object'&&m.their?m.their[k]:m.their));if(!ms.length)continue;
    const pref=ms.filter(m=>!m.tk);const m=(pref.length?pref:ms).sort((a,b)=>b.re.length-a.re.length||a.y-b.y)[0];const th=typeof m.their==='object'?m.their[k]:m.their;
    o.voices.push([bfR(k).n,th,bfAlive(k)?'':'생전에 남긴 말']) }
  const br=B.br||0,ca=B.ca||0;o.eval=br>ca+1?`${he}를 기억하는 사람들은 ${he}가 용감했다고 말한다. 몇몇은 무모했다고도 한다.`:ca>br+1?`${he}를 기억하는 사람들은 ${he}가 신중했다고 말한다. 몇몇은 지나치게 신중했다고도 한다.`:`${he}를 기억하는 사람들은 ${he}가 용감했다고 말하기도 하고, 지나치게 신중했다고 말하기도 한다. 두 평가 모두 ${he}의 생애 일부를 설명하지만, 어느 쪽도 ${he}의 전부를 설명하지 못한다.`;
  B.q.filter(q=>!q.ans).forEach(q=>o.unknown.push(q.t));
  o.mem=B.mem.slice().sort((a,b)=>(b.re.length*30+b.w)-(a.re.length*30+a.w)).slice(0,4).map(m=>{const L0=bfLatest(m);return {t:m.t,y:m.y,re:L0?L0.t:null,tone:L0?L0.tone:m.tone}});
  o.reg=B.reg.map(r=>({t:r.t,ease:r.ease}));return o}
{const _se=showEnd;showEnd=function(){_se();const host=$('#obLife'),sec=$('#obLifeSec');if(!host||!sec)return;host.innerHTML='';let o=null;try{o=bfRecord()}catch(e){console.error(e)}if(!o){sec.hidden=true;return}sec.hidden=false;
  const k=el('div','ob-lk',`인생 기록 · ${s.by}–${s.year}`);host.appendChild(k);o.intro.forEach(t=>host.appendChild(el('p','ob-lp',t)));
  const sub=(t,arr,f)=>{if(!arr.length)return;host.appendChild(el('h4','ob-lh',t));const ul=el('ul','ob-ll');arr.forEach(x=>ul.appendChild(f(x)));host.appendChild(ul)};
  sub('기억과 그 뒤의 의미',o.mem,m=>{const li=el('li');li.appendChild(el('span',null,`${m.y}년 — ${m.t}`));if(m.re)li.appendChild(el('small',null,` 훗날: ${m.re}`));return li});
  sub('서랍 속에서',o.drawer,t=>el('li',null,t));
  sub('벗들의 회고',o.voices,([n,t,d])=>{const li=el('li');li.appendChild(el('b',null,n));li.appendChild(el('span',null,` “${t}”${d?` (${d})`:''}`));return li});
  host.appendChild(el('p','ob-lp',o.eval));
  sub('끝내 확인하지 못한 것',o.unknown,t=>el('li',null,t));
  sub('후회',o.reg,r=>{const li=el('li',null,r.t);if(r.ease)li.appendChild(el('small',null,` — 그 뒤: ${r.ease}`));return li})}}
