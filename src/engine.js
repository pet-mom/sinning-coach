/* ================= 새 인생 ================= */
function rollName(sex,estate,region){const g=pick(sex==='M'?M_NAMES:F_NAMES);let f;
  if(ESTATES[estate].noble)f=pick(NOBLE_SURS);else if(REG_SURS[region]&&R()<.55)f=pick(REG_SURS[region]);else f=pick(SURS);return {g,f}}
function newState(o){const sex=o.sex||(R()<.5?'M':'F');const by=o.year||ri(1750,1790),bm=ri(0,11);const estate=o.estate||wpick(Object.entries(ESTATES).map(([k,v])=>[k,v.w]));
  let region=o.region;if(!region){const urbanBias=estate==='epee'?[['paris',6],['bourgogne',1],['ile',2]]:estate==='bourgeois'?Object.entries(REGIONS).map(([k,v])=>[k,v.w*(v.urban?12:1)]):estate==='artisan'?Object.entries(REGIONS).map(([k,v])=>[k,v.w*(v.urban?20:.6)]):Object.entries(REGIONS).map(([k,v])=>[k,v.urban?0:v.w]);region=wpick(urbanBias)}
  const nm=rollName(sex,estate,region);
  const given=o.given?[o.given,'']:[nm.g[0],nm.g[1]],sur=o.sur?[o.sur,'']:[nm.f[0],nm.f[1]];
  const fk=region==='languedoc'&&R()<.12||region==='alsace'&&R()<.18||R()<.004?'protestant':(region==='alsace'&&R()<.03)||(region==='bordeaux'&&R()<.03)?'jewish':'catholic';
  const st={edu:ri(4,14),soc:ri(12,30),hp:ri(42,70),cour:ri(18,42)};
  const E=ESTATES[estate];let fame=0,pol=ri(-12,8),faith=ri(45,75);
  if(E.noble){st.edu+=ri(14,24);st.soc+=12;fame=estate==='epee'?20:estate==='robe'?14:8;pol=ri(-45,-10)}
  if(estate==='bourgeois'){st.edu+=ri(12,22);st.soc+=5;fame=5;pol=ri(-5,18)}
  if(estate==='artisan'){st.edu+=ri(3,8);pol=ri(-8,15)}
  if(estate==='peasant'){st.hp+=6;pol=ri(-15,6)}
  if(['bretagne','vendee'].includes(region))faith+=15;if(region==='paris')faith-=12;if(fk!=='catholic')faith=ri(50,80);
  return attrsInit({v:2,sex,given,sur,estate,region,loc:null,fk,faithKind:fk,hard:o.hard!==false,
    st,money:0,land:0,dues:0,fame,sus:0,pol,faith:clamp(faith,0,100),literate:false,
    age:0,year:by,month:bm-(bm%3)+2,season:seasonOf(bm-(bm%3)+2),by,bm,tick:3,party:null,prank:0,stance:{},polHist:[],trait:null,goal:null,goalDone:false,plan:'근면',
    job:null,jobSince:0,prevJob:null,best:{},hist:[],cond:'normal',condSince:0,
    fa:{alive:true,age:ri(24,40)},mo:{alive:true,age:ri(19,34)},sibs:ri(1,6),eldest:R()<.35,inherit:0,
    spouse:null,married:false,kids:[],widowed:0,divorced:false,
    seeds:[],met:[],flags:{},cnt:{arrest:0,wound:0,battle:0,emigre:0},acts:{},cd:{},done:{},log:[],dead:false,death:null})}
function birth(){L(`${yl()}`,'yr');const E=ESTATES[s.estate],Rg=REGIONS[s.region];
  const who=isM()?'아들':'딸';
  say(`${s.year}년 ${s.month+1}월, ${Rg.n}의 ${E.noble?`${s.sur[0]} 가문 영지`:`${s.sur[0]} 집안`}에서 ${who}로 태어났다. ${E.d}`,'big');
  say(`세례명은 ${s.given[0]}${s.given[1]?` (${s.given[1]} ${s.sur[1]})`:''}.`+(s.faithKind==='protestant'?(s.year<1788?' 집안은 몰래 신교 예배를 지키는 위그노다. 왕국의 법은 신교도의 혼인조차 인정하지 않는다.':' 집안은 신교(위그노)를 믿는다.'):s.faithKind==='jewish'?(s.year<1791?' 집안은 유대교를 믿는다. 왕국에서 유대인은 시민이 아니다.':' 집안은 유대교를 믿는다.'):''));
  L(`지금 프랑스를 다스리는 것은 ${ruler()}. 시대는 ${era().n}.`,'sys')}

/* ================= 시간 =================
   1789년 이전은 계절(3개월) 단위, 1789년 1월부터는 한 달 단위로 진행한다.
   s.month: 0=1월 … 11=12월. s.season은 달에서 얻는다(3~5월 봄 … 12~2월 겨울). */
const REV_START=1789*12;
const MI=()=>s.year*12+s.month;
const monthly=()=>MI()>=REV_START;
function tickMonths(){return monthly()?1:3}
const seasonOf=m=>m>=2&&m<=4?0:m>=5&&m<=7?1:m>=8&&m<=10?2:3;
const quarter=()=>s.month%3===2; // 3·6·9·12월: 계절이 바뀌는 달
function msPer(){return monthly()?4200:9000}
function secPerYear(){return Math.round(msPer()*(12/tickMonths())/speed/1000)}
function ageNow(){return s.year-s.by-(s.month<s.bm?1:0)}
async function advanceSeason(){
  const k=tickMonths();const prev=MI();
  // 1788년 12월 다음은 1789년 1월(월 단위 진입)
  let nx=prev+k;if(prev<REV_START&&nx>REV_START)nx=REV_START;
  const oldYear=s.year;s.year=Math.floor(nx/12);s.month=nx%12;s.season=seasonOf(s.month);s.tick=(nx-prev);
  if(s.year!==oldYear)newYear();
  const na=ageNow();if(na!==s.age){s.age=na;birthday()}
  if(s.dead)return;
  const f=s.tick/12; // 이번 진행 길이(년)
  // 사망
  if(R()<deathP(s.age)*f){die(s.age>=60?'old':'ill');return}
  // 역사: 지난 진행 구간 안의 사건을 모두 처리
  await runHistory(prev,nx);if(s.dead)return;
  await partyTick();if(s.dead)return;
  // 개인 처지 (계절마다)
  if(quarter()){
    if(s.cond==='prison'){await prisonSeason();if(s.dead)return}
    else if(s.cond==='hiding'){await hidingSeason();if(s.dead)return}
    else if(s.cond==='emigre'){await emigreSeason();if(s.dead)return}
  }
  if(s.cond==='normal'&&!child()){
    if(T()>=1793.25&&T()<1794.5){await terrorCheck(f*4);if(s.dead)return}
    if(soldier()&&atWar()){await warSeason(f*4);if(s.dead)return}
    if(s.job&&quarter()&&(s.season===1||s.season===3))await promoCheck();
  }
  if(quarter()&&s.cond==='normal'&&!child()&&!s.job&&!inSchool()&&!s.flags.retired&&s.flags.adult&&s.age<55&&s.season===0&&!(noble()&&s.land>=300)&&R()<.6)await careerChoice(false);
  if(child()&&quarter())await childhood();
  await schoolTick();if(s.dead)return;
  if(s.age>=14&&!s.flags.adult)await comingOfAge();
  if(s.dead)return;
  await randomEvent(monthly()?.42:.72);if(s.dead)return;
  if(s.month===11){await family();if(s.dead)return;await relTick();if(s.dead)return;await seeds();if(s.dead)return;if(!child()&&s.cond==='normal')await marriageCheck();goalCheck()}
}
function birthday(){if(s.age>=50)s.st.hp=clamp(s.st.hp-(s.age>=65?2:1),0,100);else if(s.st.hp<50)s.st.hp+=2;else if(s.st.hp<60)s.st.hp+=1}
function newYear(){s.fa.age++;s.mo.age++;if(s.spouse)s.spouse.age++;
  const ry=repYear(s.year);L(`${yl()}${ry?' · '+ry:''}`,'yr');
  s.polHist=s.polHist||[];s.polHist.push([s.year,s.pol]);s.pol=Math.round(s.pol*.96);
  s.sus=Math.max(0,s.sus-(inTerror()?0:3));
  attrsYear(s.plan);
  if(child())return;
  if(trait('경건'))s.faith=clamp(s.faith+1,0,100);if(trait('열정'))s.st.cour=clamp(s.st.cour+1,0,100);
  // 방침
  let pl=s.plan;if(pl==='학업'&&!lit())pl='근면';if(pl==='정치'&&s.year<1788)pl='교제';
  if(s.cond==='prison'||s.cond==='hiding')pl='양생';
  const pf={근면:{},수련:{},단련:{},학업:{edu:2},교제:{soc:3,money:-Math.round(20+s.money*.01)},양생:{hp:3},신앙:{faith:3,sus:inTerror()?4:0},정치:{fame:1,pol:s.pol>=0?3:-3,sus:inTerror()&&s.pol<40?3:0},절약:{soc:-1}}[pl];
  const ptxt=fx(pf);
  economy(pl,ptxt);
  const E0=econ(),cp=(CUR[s.year-1]||1),drop=1-E0.cur/cp;
  if(drop>0&&s.money>200){const loss=Math.round(s.money*drop*(s.land>0?.22:.36));s.money-=loss;
    L(`${s.year<=1796?'아시냐':'지폐'} 가치가 떨어져 모아 둔 돈이 녹아내렸다. (재산 -${fmt(loss)})`,'sys')}
}
function economy(pl,ptxt){const j=job();const away=s.cond!=='normal';
  const E=econ();let pay=j&&!away?j.pay:0;if(pl==='근면')pay*=1.25;let slack='';
  if(pay&&wageEarner()){pay*=E.wage;if(E.jobs<45){pay*=.5+E.jobs/90;slack=' 일감이 줄어 벌이가 깎였다.'}}
  if(pay&&j.tr==='craft'&&j.t>=3)pay*=1+(s.sk.trade+s.sk.craft-60)/400;if(j&&j.tr==='farm'&&s.year>=1790)pay*=1.12;
  const sp=s.spouse&&s.spouse.alive?s.spouse.pay:0;
  const land=s.cond==='emigre'?0:s.land, dues=s.cond==='emigre'?0:s.dues;
  const inc=pay+land+dues+sp;
  const kids=kidsAlive().filter(k=>s.year-k.y<15).length;
  const need=110*E.price*(1+(s.spouse&&s.spouse.alive?.35:0)+.2*kids)*(s.cond==='emigre'?1.6:1);
  let life=Math.max(need,inc*(noble()?.92:.78));if(pl==='절약')life*=.8;if(trait('쾌활'))life*=1.06;
  if(s.cond==='prison')life=need*.7;
  const net=Math.round(inc-life);s.money+=net;
  const parts=[pay?`벌이 +${fmt(pay)}`:'',sp?`배우자 +${fmt(sp)}`:'',land?`지대 +${fmt(land)}`:'',dues?`영주 공납 +${fmt(dues)}`:'',`생활비 -${fmt(life)}`].filter(Boolean);
  L(`방침 ${pl}${ptxt}.${slack} 살림 ${net>=0?'+':''}${fmt(net)} ${money()} (${parts.join(', ')}).`,'sys');
  if(s.money<0){s.money=0;say(price(s.year)>=1.4?'빵값이 치솟아 끼니를 거르는 날이 많았다.'+fx({hp:-4}):'빚과 가난에 시달렸다.'+fx({hp:-2}))}}

/* ================= 죽음 ================= */
const CAUSE={ill:'병',old:'노환',guillotine:'단두대',battle:'전사',massacre:'학살',famine:'굶주림',childbirth:'산욕',duel:'결투',executed:'처형',drowned:'익사형',deported:'유형지',murdered:'피살',cholera:'콜레라',smallpox:'천연두',riot:'봉기',shot:'총살',cold:'동사'};
function die(cause,detail){if(s.dead)return;s.dead=true;closeJob();
  if(cause==='ill')detail=detail||(s.age<5?pick(['천연두','홍역','이질','디프테리아']):s.age<60?pick(['폐결핵','장티푸스','늑막염','열병','이질']):pick(['뇌졸중','폐렴','수종']));
  s.death={cause,detail,year:s.year,season:SEASON[s.season],age:s.age};
  const txt={ill:`${detail}으로 세상을 떠났다.`,old:'자리에 누운 지 며칠 만에 조용히 숨을 거두었다.',guillotine:'혁명 광장의 단두대에서 처형되었다.',battle:detail?`${detail}에서 전사하였다.`:'전장에서 쓰러졌다.',massacre:'감옥에 들이닥친 군중에게 살해되었다.',famine:'굶주림 끝에 숨을 거두었다.',childbirth:'아이를 낳다가 숨을 거두었다.',duel:'결투에서 치명상을 입고 죽었다.',executed:detail||'처형되었다.',drowned:'루아르 강의 익사형으로 죽었다.',deported:'기아나 유형지의 열병으로 죽었다.',murdered:detail||'원한을 품은 자들에게 살해되었다.',cholera:'콜레라에 걸려 하루 만에 죽었다.',smallpox:'천연두로 죽었다.',riot:detail||'봉기 중에 총탄을 맞고 쓰러졌다.',shot:detail||'총살되었다.',cold:detail||'혹한 속에 얼어 죽었다.'}[cause];
  say(txt,'dark')}

/* ================= 유년 ================= */
async function childhood(){
  if(s.age===7&&s.season===1&&!s.flags.school){s.flags.school=true;
    const north=['paris','picardie','champagne','normandie','alsace','ile','rouen','bourgogne'].includes(s.region);
    let p=noble()?1:s.estate==='bourgeois'?.95:s.estate==='artisan'?.62:north?.48:.28;if(!isM()&&!noble())p*=s.estate==='bourgeois'?.9:.55;
    if(R()<p){s.literate=true;say(noble()?'가정교사에게 읽기와 쓰기를 배우기 시작하였다.'+fx({edu:4}):'본당 신부가 여는 작은 학교에서 글을 깨쳤다.'+fx({edu:3}))}
    else say(s.estate==='peasant'?'학교에 갈 형편이 못 되어 양떼를 몰았다. 글은 깨치지 못했다.'+fx({hp:2}):'일손을 거들어야 해서 글을 배우지 못했다.');schoolStart7()}
  if(s.age===10&&s.season===2&&!s.flags.at10){s.flags.at10=true;await schoolAt10()}
}
async function comingOfAge(){s.flags.adult=true;
  const E=s.estate;s.money={peasant:15,artisan:30,bourgeois:1200,hobereau:2500,robe:9000,epee:25000}[E];
  s.land={peasant:0,artisan:0,bourgeois:0,hobereau:300,robe:1200,epee:5000}[E];
  s.dues={hobereau:300,robe:600,epee:3000}[E]||0;
  if(s.inherit){s.money+=s.inherit;s.inherit=0}
  if(s.estate==='peasant'&&R()<.25){s.land+=40}
  // 첫 영성체 · 성품
  sheetOpen('첫 영성체를 마치고','première communion');
  shText('어른들 틈에 섞여 일할 나이가 되었다. 사람들은 이 아이가 어떤 사람이 될지 벌써 말하기 시작한다.','q');
  const i=await shButtons(TRAITS.map(t=>({l:t.k,s:t.s,a:''})));s.trait=TRAITS[i].k;
  say(`사람들은 ${jo(s.given[0],'이','가')} ${{열정:'불같은',신중:'조심스러운',경건:'신심 깊은',계몽:'책을 좋아하는',야심:'야망이 큰',쾌활:'잘 웃고 사람 좋은'}[s.trait]} 아이라고 하였다.`);
  await shContinue();sheetClose();
  if(inSchool(['college','convent','univ','seminary'])){say(SCH().st==='convent'?'기숙학교에서 몇 해를 더 보내게 되었다.':'학업을 계속하였다.','sys');return}
  await careerChoice(true);
}
function entryOptions(first){const E=s.estate,o=[];const add=(id,why)=>{if(POST[id]&&meets(POST[id]))o.push({id,why})};
  if(!isM()&&lit()&&['peasant','artisan','bourgeois'].includes(E)&&T()>=1759)add('m1','산파 강습을 받는다(뒤 쿠드레 부인의 순회 강습)');
  if(E==='peasant'){add('f1','부모 곁에서 남의 밭일을 거든다');add('f2','소작지를 얻어 반타작 농사를 짓는다');add('c1',isM()?'도시로 나가 견습공이 된다':'도시로 나가 남의 집 하녀가 된다');if(isM())add('a1','군에 지원한다. 밥은 굶지 않는다')}
  if(E==='artisan'){add('c1',isM()?'아버지 공방의 견습공이 된다':'부잣집 하녀로 들어간다');add('c2',isM()?'직인이 되어 프랑스 일주(투르 드 프랑스)를 떠난다':'재봉사로 일한다');if(isM())add('a1','군에 지원한다')}
  if(E==='bourgeois'){add('l1','법률사무소 서기로 들어가 법을 익힌다');add('c2','가업을 거들며 장사를 배운다');add('w1','귀족 집안의 가정교사가 된다');add('r1',isM()?'신학교에 들어간다':'수녀원에 들어간다')}
  if(noble()){if(isM()){add('a3','왕의 군대에 소위로 임관한다');add('r1','교회에 들어간다. 주교관을 노린다')}else add('r1','수녀원에 들어간다');
    if(E==='robe'&&isM())add('l2','법학을 마치고 변호사로 등록한다. 고등법원 자리를 이을 준비를 한다');add('w2',isM()?'문필과 학문에 몸을 바친다':'살롱을 열 준비를 한다')}
  if(!first){for(const id of ['f2','f3','f4','c2','c3','c4','c5','l1','l2','w1','w2','w3','r1','a1','p1','p2'])if(!o.some(x=>x.id===id)&&id!==s.job)add(id,'')}
  return o}
async function careerChoice(first){const opts=entryOptions(first);
  sheetOpen(first?'앞날을 정한다':'진로를 바꾼다','état');
  shText(first?`${s.age}세. 이제 먹고살 길을 정해야 한다. ${ESTATES[s.estate].n} 집안의 ${isM()?'아들':'딸'}에게 열린 길은 많지 않다.`:'지금 일을 그만두고 다른 길을 찾는다. 조건을 갖춘 자리만 보인다.','q');
  const list=opts.map(o=>({l:pname(POST[o.id])+(o.why?` — ${o.why}`:''),s:[`연 ${fmt(POST[o.id].pay)} ${money()}`,needText(POST[o.id])].filter(Boolean).join(' · '),a:POST[o.id].tr+' work'}));
  list.push({l:first?(noble()?'집에 머물며 영지 수입으로 산다':'집에서 일을 거든다'):'지금 그대로 지낸다',s:'',a:noble()&&first?'safe':''});
  const i=await shButtons(list);
  if(i<opts.length){const id=opts[i].id;takeJob(id);if(id==='a3'&&noble())say('연대장에게 인사를 올렸다. 1781년 세귀르 법령 이후로 장교는 4대 귀족 혈통만 될 수 있다.','sys')}
  else if(first)say(noble()?'영지에 머물며 사냥과 독서로 세월을 보냈다.':'집안일을 거들며 지냈다.');
  await shContinue();sheetClose()}

/* ================= 승진 ================= */
async function promoCheck(){const j=job();if(!j||j.tr==='pol'&&j.t>=3)return;const yrs=s.year-s.jobSince;
  const war=atWar()&&j.tr==='army',purge=j.tr==='army'&&T()>=1791.5&&T()<1795;
  if(yrs<(war?1:2))return;
  const next=PL.filter(x=>x[1]===j.tr&&x[2]===j.t+1).map(x=>POST[x[0]]).filter(p=>meets(p));if(!next.length)return;
  let p={farm:.05,craft:.07,law:.07,church:.06,army:.05,pol:.08,letters:.05,med:.06}[j.tr];
  if(war)p=.14;if(purge)p=.3;if(trait('야심'))p*=1.4;if(trait('신중'))p*=.8;if(s.plan==='근면')p*=1.3;
  if(R()>=p)return;const n=pick(next);
  const key={farm:['soc',40],craft:['soc',45],law:['edu',60],church:['edu',50],army:['cour',50],pol:['soc',50],letters:['edu',60],med:['edu',60]}[j.tr];
  const {m,why}=md([[s.st[key[0]]>=key[1],1,FXN[key[0]]],[s.fame>=40,1,'명성'],[s.st[key[0]]<key[1]-20,-1,FXN[key[0]]+' 부족'],[['law','church','med','letters'].includes(j.tr)&&SCH().grade>=80,1,'학업 성적'],[!!patron(),1,'후원자'],[!!rival(),-1,'맞수'],[s.rep.rguild>=70,1,'동업자들의 신망'],[s.rep.rguild<=30,-1,'나쁜 평판'],[j.tr==='craft'&&s.st.dex>=60,1,'기술'],[j.tr==='farm'&&s.st.str>=60,1,'체력'],[j.tr==='army'&&s.st.str>=60,1,'체력']]);
  const r=await roll(m,{label:`${pname(n)} 승진`,why});
  if(r.v>=4){takeJob(n.id,purge?'귀족 장교들이 떠난 자리를 메우며 ':'');if(n.tr==='army')fx({fame:2})}}

/* ================= 가족 ================= */
async function family(){
  for(const [k,who] of [['fa','아버지'],['mo','어머니']]){const P=s[k];if(!P.alive)continue;
    if(R()<baseMort(P.age)*.95){P.alive=false;
      if(k==='fa'){const base={peasant:60,artisan:250,bourgeois:9000,hobereau:20000,robe:60000,epee:160000}[s.estate];
        const eldestNoble=noble()&&isM()&&s.eldest&&s.year<1791;let share=eldestNoble?.7:1/(1+s.sibs*.8);if(s.flags.disowned)share=0;
        const amt=Math.round(base*share),landAdd=noble()?Math.round({hobereau:500,robe:2000,epee:7000}[s.estate]*share):0;
        if(child()){s.inherit+=amt;say(`${who}가 ${P.age}세로 세상을 떠났다.`,'big')}
        else{s.money+=amt;s.land+=landAdd;if(eldestNoble)s.dues+=Math.round(s.dues*.5);
          say(`${who}가 ${P.age}세로 세상을 떠났다. 유산 ${fmt(amt)} ${money()}${landAdd?`과 땅(지대 +${fmt(landAdd)})`:''}을 물려받았다.`+(eldestNoble?' 장자 상속의 관습에 따라 몫이 컸다.':'')+fx({hp:-2}),'big')}}
      else say(`${who}가 ${P.age}세로 세상을 떠났다.`+(child()?'':fx({hp:-2})),'big')}}
  if(child())return;
  // 배우자
  if(s.spouse&&s.spouse.alive&&R()<baseMort(s.spouse.age)*.9){s.spouse.alive=false;s.widowed++;say(`${isM()?'아내':'남편'} ${jo(s.spouse.n,'이','가')} 병으로 세상을 떠났다.`+fx({hp:-5}),'big')}
  // 출산
  const motherAge=isM()?(s.spouse&&s.spouse.alive?s.spouse.age:0):s.age;
  if(s.spouse&&s.spouse.alive&&s.cond!=='emigre'&&s.cond!=='prison'&&motherAge>=17&&motherAge<=44){
    const p=(motherAge<30?.42:motherAge<38?.33:.18)*(s.flags.army?.4:1);
    if(R()<p){const sx=R()<.51?'M':'F';const nm=pick(sx==='M'?M_NAMES:F_NAMES)[0];s.kids.push({n:nm,sex:sx,y:s.year,alive:true});
      if(!isM()){if(R()<.011*(motherAge>35?1.5:1)*(s.hard?1:.5)){say(`${sx==='M'?'아들':'딸'} ${jo(nm,'을','를')} 낳았다.`);die('childbirth');return}
        say(`${sx==='M'?'아들':'딸'} ${jo(nm,'을','를')} 낳았다.`+fx({hp:-4}))}
      else{if(R()<.011){s.spouse.alive=false;s.widowed++;say(`아내가 ${sx==='M'?'아들':'딸'} ${jo(nm,'을','를')} 낳다가 숨을 거두었다.`+fx({hp:-6}),'big')}else say(`아내가 ${sx==='M'?'아들':'딸'} ${jo(nm,'을','를')} 낳았다.`)}}}
  // 자녀 사망
  for(const k of s.kids){if(!k.alive)continue;const a=s.year-k.y;if(a<20&&R()<childP(a)){k.alive=false;say(`${a<1?'갓난':a+'살 난'} ${k.sex==='M'?'아들':'딸'} ${jo(k.n,'이','가')} ${a<5?pick(['열병','천연두','이질','경련']):pick(['열병','천연두','디프테리아'])}으로 죽었다.`+fx({hp:-3}))}}
}
async function marriageCheck(){if(s.married&&s.spouse&&s.spouse.alive)return;if(priest()||nun())return;
  if(s.married&&s.age>55)return;
  const a=s.age;let p=isM()?(a<20?.01:a<25?.1:a<30?.24:a<40?.16:.05):(a<18?.03:a<21?.1:a<25?.2:a<30?.24:a<36?.12:.03);
  if(noble())p*=1.4;if(s.married)p*=.8;if(R()>=p)return;
  const sameEst=R()<.8?s.estate:wpick([['peasant',3],['artisan',3],['bourgeois',2]]);
  const nm=isM()?woman():person();const age=isM()?clamp(a-ri(1,7),16,45):clamp(a+ri(-1,8),17,60);
  const dowry=isM()?{peasant:80,artisan:300,bourgeois:6000,hobereau:12000,robe:30000,epee:80000}[sameEst]:0;
  const pay=isM()?{peasant:60,artisan:150,bourgeois:0,hobereau:0,robe:0,epee:0}[sameEst]:Math.round((POST[pick(['f2','c2','c3','l2','c4'])].pay)*({peasant:.5,artisan:.9,bourgeois:1.4,hobereau:2,robe:3,epee:5}[sameEst]));
  sheetOpen('혼담','mariage');
  shText(`${ESTATES[sameEst].n} 집안의 ${nm}(${age}세)와의 혼담이 들어왔다.${dowry?` 지참금은 ${fmt(dowry)} ${money()}이라 한다.`:''}`,'q');
  const i=await shButtons([{l:'혼인한다',s:isM()?`지참금 +${fmt(dowry)}`:`남편의 벌이가 살림에 더해진다`,a:'family'},{l:'거절한다',s:'',a:''}]);
  if(i===0){s.married=true;s.spouse={n:nm,age,alive:true,pay,estate:sameEst};if(dowry)s.money+=dowry;
    if(s.faithKind==='protestant'&&s.year<1788)say(`${jo(nm,'과','와')} 사막(숲속 비밀 예배)에서 혼인하였다. 국법은 이 혼인을 인정하지 않는다.`,'big');
    else say(`본당에서 ${jo(nm,'과','와')} 혼인 미사를 올렸다.`+fx({soc:2}),'big')}
  else say('혼담을 물렸다.');
  await shContinue();sheetClose()}

function goalCheck(){if(!s.goal||s.goalDone)return;const g=s.goal;
  const ok=g==='부'?s.money>=50000:g==='명예'?!!(s.flags.legion||s.flags.title):g==='자유'?!!s.flags.wasDeputy:g==='장수'?s.age>=75:g==='가문'?adultKids()>=4:g==='학문'?!!(s.flags.book||s.best.letters>=4):g==='무공'?(s.best.army||0)>=6:false;
  if(ok){s.goalDone=true;say(`평생의 뜻(${g})을 이루었다.`+fx({fame:4,hp:2}),'big')}}

/* ================= 공포정치 ================= */
function arrestP(){let p=.0045;const why=[];
  p*=1+s.sus/12;if(s.sus>=30)why.push('혐의');
  if(noble()){p*=4;why.push('귀족 출신')}
  if(s.flags.refractory){p*=7;why.push('선서 거부 사제')}
  if(nun()||s.flags.exNun){p*=2}
  if(s.flags.emigreKin){p*=2;why.push('망명자 가족')}
  if(s.pol<-25){p*=2.2;why.push('왕당파 성향')}else if(s.pol>=40&&s.flags.club){p*=.3;why.push('클럽 회원(감)')}
  if(s.flags.girondin){p*=4;why.push('지롱드파')}
  if(inParis())p*=1.4;if(['lyon','nantes','vendee','marseille'].includes(loc())){p*=1.8;why.push('반란 지역')}
  if(rich()){p*=1.5;why.push('부유함')}
  if(deputy()&&s.pol<35){p*=2.5}
  if(frelOf('jacobin')<=-30){p*=1.5;why.push('자코뱅의 적의')}else if(frelOf('jacobin')>=40)p*=.8;
  if(s.rep.rloc>=70)p*=.75;else if(s.rep.rloc<=30){p*=1.4;why.push('이웃의 고발')}
  if(T()<1793.5)p*=.5;if(greatTerror())p*=1.3;if(trait('신중'))p*=.85;
  return {p:clamp(p,0,.6),why:why.join(', ')}}
async function terrorCheck(q=1){const {p,why}=arrestP();if(R()<p*q)await arrest(why||'고발')}
async function arrest(why){s.cnt.arrest++;sheetOpen('체포','arrestation');
  shText(`밤중에 감시위원회 사람들과 국민방위대가 문을 두드렸다. 혐의자법에 따라 체포한다고 한다. (사유: ${why})`,'q b');
  const opts=[{l:'무고를 항변한다',s:'사교·학식 판정',a:'safe'},{l:'뇌물을 찔러 준다',s:'500 이상 든다',a:'greedy',dis:s.money<500},{l:'창문으로 달아난다',s:'의지 판정. 실패하면 위험하다',a:'bold'},{l:'순순히 따라간다',s:'',a:'safe'}];
  const i=await shButtons(opts);
  if(i===0){const {m,why:w}=md([[s.st.soc>=55,1,'사교'],[s.st.edu>=60,1,'학식'],[s.pol>=40,1,'혁명 열성'],[noble(),-1,'귀족'],[s.sus>=50,-1,'짙은 혐의']]);
    const r=await roll(m-1,{label:'항변',why:w});if(r.v>=5){say('위원들이 서류를 다시 보더니 돌아갔다. 이번에는 넘어갔다.'+fx({sus:-8}));await done();return}}
  if(i===1){const pay=Math.min(s.money,Math.round(500+s.money*.15));const r=await roll(s.st.soc>=45?1:0,{label:'뇌물'});
    if(r.v>=4){say(`위원 한 사람에게 ${fmt(pay)} ${money()}을 쥐여 주었다. 명단에서 이름이 빠졌다.`+fx({money:-pay,sus:-5}));await done();return}
    say('뇌물을 내밀었다가 오히려 부패 혐의까지 덧씌워졌다.'+fx({money:-Math.round(pay/2),sus:10}))}
  if(i===2){const r=await roll(s.st.cour>=55?1:s.st.cour<30?-1:0,{label:'도주'});
    if(r.v>=5){s.cond='hiding';s.condSince=T();say('지붕을 타고 달아나 친지의 다락방에 숨었다.'+fx({cour:3}),'big');await done();return}
    if(r.v===1&&await chance(.35,'도주 중 총격','도망치다 총에 맞을 확률')){die('shot','달아나다 국민방위대의 총에 맞아 죽었다.');await done();return}
    say('얼마 못 가 붙잡혔다.'+fx({sus:8}))}
  s.cond='prison';s.condSince=T();s.prisonKind='terror';
  say(`${inParis()?pick(['콩시에르주리','라포르스','생트펠라지','뤽상부르','카름'])+' 감옥':'고을 감옥으로 쓰는 옛 수도원'}에 갇혔다.`,'big');
  await done()}
async function prisonSeason(){const t=T();
  if(s.prisonKind==='terror'&&t>=1794.5){if(R()<.7){s.cond='normal';s.sus=Math.max(0,s.sus-25);say('테르미도르 이후 혐의자들이 풀려났다. 몇 달 만에 감옥 문을 나섰다.'+fx({hp:-4}),'big')}return}
  if(s.prisonKind==='terror'&&t>=1793.25){const tp=greatTerror()?.45:.25;if(R()<tp)await trial();return}
  if(R()<.3){s.cond='normal';say('감옥에서 풀려났다.','big')}else fx({hp:-2})}
async function trial(){sheetOpen('혁명재판소','Tribunal révolutionnaire');
  const where=inParis()?'파리 혁명재판소. 검사 푸키에탱빌이 기소장을 읽는다.':loc()==='lyon'?'리옹 혁명위원회. 하루에 수십 명씩 판결이 내려진다.':loc()==='nantes'?'낭트. 파견의원 카리에의 감시 아래 재판이 열린다.':'지방 혁명위원회 앞에 섰다.';
  shText(where+(greatTerror()?' 프레리알 22일 법 이후로 변호인도 증인도 없다.':''),'q b');
  const {m,why}=md([[s.st.soc>=60,1,'사교'],[s.pol>=40,1,'애국자의 증언'],[s.fame>=50&&s.pol>=20,1,'명성'],[noble(),-1,'귀족'],[!!s.flags.refractory,-1,'선서 거부'],[s.pol<-25,-1,'왕당파'],[greatTerror(),-1,'대공포정치']]);
  const i=await shButtons([{l:'당당히 공화국에 대한 충성을 말한다',s:'판정',a:'bold'},{l:'고개를 숙이고 자비를 구한다',s:'판정',a:'safe'}]);
  const r=await roll(m,{label:'판결',why});const harsh=inParis()||['lyon','nantes'].includes(loc())||greatTerror();
  if(r.v<=(harsh?3:2)){say('“사형.” 판결은 오 분도 걸리지 않았다.','dark');s.flags.condemned=true;
    if(i===0)say('수레 위에서 마지막까지 고개를 들고 있었다.');die(loc()==='nantes'&&R()<.4?'drowned':'guillotine')}
  else if(r.v<=4){say('판결이 미뤄졌다. 다시 감방으로 돌아갔다.')}
  else{s.cond='normal';s.sus=Math.max(0,s.sus-15);say('무죄 방면. 법정 밖에서 지켜보던 사람들이 박수를 쳤다.'+fx({fame:3}),'big')}
  await done()}
async function hidingSeason(){const t=T();s.money=Math.max(0,s.money-60);
  if(t>=1794.75||(!inTerror()&&t>=1794.5)){s.cond='normal';s.sus=Math.max(0,s.sus-20);say('숨어 지내던 곳에서 나왔다. 공포정치는 끝났다.','big');return}
  if(s.flags.refractory&&t>=1801.5){s.cond='normal';s.flags.refractory=false;say('콩코르다트로 숨어 지내던 사제들이 다시 제단에 섰다.','big');return}
  if(s.flags.refractaire&&t>=1814.25){s.cond='normal';s.flags.refractaire=false;say('제국이 무너지자 징집을 피해 숨어 지내던 이들이 집으로 돌아왔다.','big');return}
  if(inTerror()&&R()<.07){say('숨은 곳이 발각되었다.','big');await arrest('은신처 발각');return}
  if(s.flags.refractaire&&R()<.06){say('헌병대가 마을을 뒤져 징집 기피자들을 잡아갔다.','big');s.cond='normal';s.flags.refractaire=false;fx({sus:5});await enlist('붙잡혀 강제로 ');return}
  fx({hp:-1})}

/* ================= 전쟁 ================= */
// 해당 연도 프랑스군 병사의 대략적 연간 사망률 (전사·부상사·병사 포함).
const WARD={1756:.05,1757:.07,1758:.06,1759:.06,1760:.05,1761:.05,1762:.04,1778:.02,1779:.03,1780:.03,1781:.04,1782:.03,1792:.06,1793:.12,1794:.1,1795:.07,1796:.08,1797:.06,1798:.05,1799:.09,1800:.07,1801:.03,1803:.02,1804:.02,1805:.06,1806:.06,1807:.09,1808:.08,1809:.1,1810:.06,1811:.06,1812:.1,1813:.25,1814:.12,1815:.1};
const FRONTS=y=>y<1763?['독일 전선','하노버','캐나다']:y<1784?['아메리카','앤틸리스 제도']:y<1796?['북부 전선','라인 전선','방데','알프스 전선','피레네 전선']:y<1800?['이탈리아','라인 전선','이집트','스위스']:y<1805?['마렝고','라인 전선','불로뉴 해안 진지']:y<1808?['아우스터리츠','예나','아일라우','프리틀란트']:y<1812?['에스파냐','바그람','포르투갈']:y<1813?['에스파냐']:['작센','라이프치히','샹파뉴','워털루'];
async function warSeason(q=1){const j=job();let p=(WARD[s.year]||.03)/4*q;
  if(j.t>=6)p*=.55;else if(j.t>=3)p*=1.1;if(s.st.hp<40)p*=1.3;if(s.st.str>=60)p*=.85;else if(s.st.str<30)p*=1.2;if(s.sk.arms>=50)p*=.85;if(trait('신중'))p*=.85;
  const front=pick(FRONTS(s.year));s.flags.front=front;
  if(R()<p){die('battle',front);return}
  if(R()<p*2){s.cnt.wound++;const sev=R();
    if(sev<.25){say(`${front}에서 크게 다쳐 다리 하나를 잃었다. 군에서 물러나야 했다.`+fx({hp:-25,fame:3}),'big');s.flags.invalid=true;discharge('부상으로 ')}
    else say(`${front}에서 ${pick(['총탄이 어깨를 꿰뚫었다','칼에 베였다','포탄 파편에 맞았다','이질에 걸려 야전병원에 실려 갔다'])}.`+fx({hp:-ri(6,14)}));return}
  if(R()<.3*q){await battleEvent(front)}}
async function battleEvent(front){s.cnt.battle++;sheetOpen(front,'bataille');
  shText(pick([`${front}. 새벽 안개 속에서 적의 대열이 다가온다.`,`${front}. 포격이 멎자 북소리가 진격을 알린다.`,`${front}. 적의 기병이 측면을 노리고 있다.`]),'q');
  const i=await shButtons([{l:'선두에 서서 돌격한다',s:'의지 판정. 공을 세우면 승진, 실패하면 크게 다친다',a:'bold'},{l:'대열을 지키며 버틴다',s:'',a:'safe'},{l:'몸을 사린다',s:'명성 -',a:'safe'}]);
  if(i===0){const r=await roll(s.st.cour>=55?1:s.st.cour<35?-1:0,{label:'돌격'});
    if(r.v>=5){say('적의 깃발을 빼앗았다. 장군이 이름을 물었다.'+fx({fame:6,cour:3}),'big');const n=PL.filter(x=>x[1]==='army'&&x[2]===job().t+1).map(x=>POST[x[0]]).filter(p=>meets(p));if(n.length&&R()<.6)takeJob(n[0].id,'전장에서 진급하여 ');
      if(s.year>=1802&&!s.flags.legion&&R()<.25){s.flags.legion=true;say('레지옹 도뇌르 훈장을 받았다.'+fx({fame:6}),'big')}}
    else if(r.v<=1){if(await chance(.3,'돌격 중 치명상','선두에 선 병사의 사망률')){die('battle',front);await done();return}say('총탄에 쓰러졌으나 목숨은 건졌다.'+fx({hp:-15,fame:2}))}
    else say('돌격은 막혔고, 많은 동료가 쓰러졌다.'+fx({cour:2}))}
  else if(i===1)say('대열을 지켰다. 해가 질 무렵 전투가 끝났다.'+fx({cour:1}));
  else say('뒤로 처져 몸을 지켰다.'+fx({fame:-2}));
  await done()}
async function enlist(pre){if(s.job&&!soldier())s.prevJob=s.job;takeJob('a1',pre||'');s.flags.army=true}
function discharge(pre){if(!soldier())return;loseJob(`${pre||''}% 자리에서 물러나 집으로 돌아왔다.`);s.flags.army=false;if(s.prevJob&&meets(POST[s.prevJob])){const pj=s.prevJob;s.prevJob=null;takeJob(pj,'예전 일로 돌아가 ')}}
// 징집 추첨
async function conscript(p,label,o={}){if(!isM()||child()||s.cond!=='normal'||soldier()||priest()||deputy()||s.flags.invalid||s.st.hp<22)return;
  if(o.min&&s.age<o.min||o.max&&s.age>o.max)return;if(o.single&&s.married&&s.spouse&&s.spouse.alive)return;
  sheetOpen(label,'conscription');shText(o.text||'징집 추첨이 열렸다. 해당 나이의 젊은이들이 면사무소 앞에 줄을 섰다.','q');
  if(!await chance(p,'징집 추첨',o.why)){say('검은 표가 아닌 흰 표를 뽑았다. 이번엔 면했다.');await done();return}
  const cost=o.repl||0;
  const opts=[{l:'입대한다',s:'',a:'bold radical'},{l:`대리인을 산다`,s:cost?`${fmt(cost)} ${money()}`:'이번 징집은 대리인을 허락하지 않는다',a:'greedy safe',dis:!cost||s.money<cost},{l:'숲으로 달아난다',s:'징집 기피자가 된다. 붙잡히면 끌려간다',a:'bold'}];
  const i=await shButtons(opts);
  if(i===0){await enlist();fx({pol:3,cour:2})}
  else if(i===1){s.money-=cost;say(`가난한 집 청년 하나를 ${fmt(cost)} ${money()}에 대신 보냈다.`+fx({fame:-1}))}
  else{s.cond='hiding';s.flags.refractaire=true;say('징집 기피자가 되어 숲과 외딴 농가를 떠돌았다.'+fx({sus:10}),'big')}
  await done()}

/* ================= 망명 ================= */
async function emigrate(dest){s.cond='emigre';s.condSince=T();s.cnt.emigre++;s.emiPlace=dest||pick(['코블렌츠','런던','토리노','함부르크','브뤼셀']);
  const carry=Math.round(s.money*.5);s.money=carry;loseJob();say(`국경을 넘어 ${jo(s.emiPlace,'으로')} 망명하였다. 가져간 것은 ${fmt(carry)} ${money()}와 보석 몇 점뿐.`,'big')}
async function emigreSeason(){const t=T();
  if(t>=1802.25&&!s.flags.amnestyAsked){s.flags.amnestyAsked=true;sheetOpen('대사면','amnistie');
    shText('제1통령이 망명자 대사면령을 내렸다. 공화국에 충성을 맹세하면 돌아갈 수 있다. 팔리지 않은 재산은 되찾을 수 있다고 한다.','q');
    const i=await shButtons([{l:'프랑스로 돌아간다',s:'',a:'safe family'},{l:'왕이 돌아올 때까지 남는다',s:'',a:'royal'}]);
    if(i===0)returnHome(.35);else{say('부르봉 왕가에 대한 충성을 지키며 망명지에 남았다.'+fx({pol:-5}));s.flags.loyalEmigre=true}await done();return}
  if(t>=1814.25&&s.cond==='emigre'){say('부르봉 왕가와 함께 마침내 프랑스 땅을 밟았다.','big');returnHome(.4);fx({fame:5});return}
  if(s.season===2&&R()<.25){const ev=pick([['프랑스어와 춤을 가르쳐 끼니를 이었다.',{money:120,soc:1}],['가져온 보석을 하나씩 팔았다.',{money:300}],['망명 귀족들의 무도회에서 고향 소식을 들었다.',{soc:1}],['낯선 기후에 병을 앓았다.',{hp:-5}],['모자 만드는 일을 배워 먹고살았다.',{money:150}],['고향의 땅이 국유재산으로 경매에 붙었다는 소식을 들었다.',{hp:-2}]]);say(ev[0]+fx(ev[1]))}
  if(t>=1795&&t<1800&&s.season===3&&R()<.12){sheetOpen('몰래 귀국','retour clandestin');shText('가짜 여권을 구해 몰래 돌아가는 이들이 있다. 붙잡히면 망명자법에 따라 총살이다.','q');
    const i=await shButtons([{l:'몰래 돌아간다',s:'의지 판정',a:'bold family'},{l:'아직은 이르다',s:'',a:'safe'}]);
    if(i===0){const r=await roll(s.st.cour>=50?1:0,{label:'귀국'});if(r.v<=1&&await chance(.5,'망명자 처형','붙잡힌 귀국 망명자가 처형될 확률')){die('shot','몰래 돌아왔다가 붙잡혀 총살되었다.');await done();return}
      if(r.v>=3){returnHome(.2);say('가명을 쓰며 고향 근처에 숨어 살았다.'+fx({sus:15}))}else say('국경에서 되돌아와야 했다.')}
    await done()}}
function returnHome(rec){s.cond='normal';const back=Math.round((s.lostLand||0)*rec);s.land+=back;
  say(`${s.emiPlace}에서의 ${Math.max(1,Math.round(T()-s.condSince))}년 망명을 끝내고 돌아왔다.`+(back?` 팔리지 않은 땅 일부를 되찾았다. (지대 +${fmt(back)})`:''),'big')}

/* ================= 씨앗(뒤늦은 결과) ================= */
async function seeds(){for(const sd of s.seeds.slice()){const rm=()=>s.seeds.splice(s.seeds.indexOf(sd),1);
  if(sd.t==='denounced'&&inTerror()&&R()<.3){rm();say(`예전에 원한을 산 ${jo(sd.n,'이','가')} 감시위원회에 그대를 고발하였다.`+fx({sus:20}),'big');return}
  if(sd.t==='hidPriest'&&inTerror()&&R()<.15){rm();say('숨겨 주었던 사제가 붙잡혀, 그를 숨긴 사람을 찾는다는 소문이 돌았다.'+fx({sus:15}));return}
  if(sd.t==='hidPriest'&&s.year>=1801&&R()<.4){rm();say('콩코르다트 뒤에 예전에 숨겨 준 사제가 찾아와 축복을 내렸다.'+fx({faith:5,fame:2}));s.flags.blessed=true;return}
  if(sd.t==='saved'&&(s.cond==='prison'||s.sus>30)&&R()<.4){rm();say(`예전에 도와준 ${jo(sd.n,'이','가')} 위원회에서 그대를 변호하였다.`+fx({sus:-20}),'big');if(s.cond==='prison'&&R()<.6){s.cond='normal';say('덕분에 풀려났다.')}return}
  if(sd.t==='debtor'&&s.year-sd.y>=3&&R()<.35){rm();if(R()<.6){s.money+=sd.a;say(`${jo(sd.n,'이','가')} 빌려 간 돈을 갚았다. (재산 +${fmt(sd.a)})`)}else say(`${jo(sd.n,'이','가')} 끝내 빚을 갚지 못하고 사라졌다.`);return}
  if(sd.t==='student'&&s.year-sd.y>=8&&R()<.2){rm();say(`옛 제자 ${jo(sd.n,'이','가')} 출세하여 인사를 왔다.`+fx({fame:3}));return}}}
