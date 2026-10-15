/* ================= 픽셀 장면 =================
   배경은 src/art/*.js의 ART[장소](g), 인물은 drawPeople(g, 목록)이 그린다.
   논리 256×96 픽셀을 CSS로 확대한다(image-rendering: pixelated). */
function srng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function sceneKind(){if(s.cond==='prison')return 'prison';if(s.cond==='emigre')return 'abroad';if(s.cond==='hiding')return 'forest';
  if(soldier()&&atWar())return 'camp';if(priest()||nun())return 'church';
  const r=REGIONS[loc()];if(r.urban)return r.port?'port':'city';if(noble()&&s.land>=300)return 'chateau';return 'village'}
function homeLabel(){const k=sceneKind();if(k==='prison')return '감옥';if(k==='abroad')return `망명지 하숙방 · ${s.emiPlace||''}`;if(k==='forest')return '은신처';if(k==='camp')return '야영지';
  if(k==='church')return isM()?'사제관':'수녀원';if(k==='chateau')return '성관';
  const rich=s.money>=20000||s.land>=1000;if(urban())return rich?'저택(오텔)':s.money>=1500?'석조 셋집':'다락방';return rich?'영지 저택':s.money>=600||s.land>0?'돌담 농가':'초가'}
function companions(){const k0=sceneKind();if(k0==='prison')return '독방';if(k0==='camp')return '전우들과 함께';if(k0==='forest')return '홀로 숨어서';const a=[];const kids=kidsAlive().filter(k=>s.year-k.y<18);
  if(s.spouse&&s.spouse.alive)a.push(isM()?'아내':'남편');
  if(s.age<25&&!(s.spouse&&s.spouse.alive)&&(s.fa.alive||s.mo.alive))a.push(s.fa.alive&&s.mo.alive?'부모님':s.fa.alive?'아버지':'어머니');
  if(s.age<18&&s.sibs)a.push(`형제자매 ${Math.min(s.sibs,4)}명`);
  if(kids.length)a.push(`자녀 ${kids.length}명`);
  if(!a.length)return '혼자';const j=a.join('·');return `${jo(j,'과','와')} 함께`}
function familyAges(){const a=[`나 ${s.age}세`];if(s.spouse&&s.spouse.alive)a.push(`${isM()?'아내':'남편'} ${s.spouse.age}세`);
  if(s.age<25&&!(s.spouse&&s.spouse.alive)){if(s.mo.alive)a.push(`어머니 ${s.mo.age}세`);if(s.fa.alive)a.push(`아버지 ${s.fa.age}세`)}
  kidsAlive().slice(-4).forEach(k=>a.push(`${k.sex==='M'?'아들':'딸'} ${s.year-k.y}세`));return a.join(' · ')}
function sceneRole(){if(s.cond==='prison')return 'prisoner';if(soldier())return (job().t>=3?'officer':'soldier');if(priest())return 'priest';if(nun())return 'nun';if(deputy())return 'deputy';
  if(isM()&&!noble()&&s.pol>=40&&T()>=1792.25&&T()<1795.5)return 'sansculotte';return null}
function drawScene(cv){if(!cv||!s||typeof makeG!=='function')return;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  const kind=sceneKind();const g=makeG(c,{seed:(s.by*977+s.region.length*131+(s.loc||'').length*17+kind.length*7)>>>0,t:T(),era:era().k,season:s.season,loc:loc(),place:s.emiPlace||''});
  artSky(g);(ART[kind]||ART.city)(g);
  if(typeof drawPeople!=='function')return;
  const P=[];const add=(sex,age,me,estate,role)=>P.push({sex,age,me,estate:estate||s.estate,role:role||null,pol:me?s.pol:0});
  const alone=kind==='prison'||kind==='camp'||kind==='forest';
  if(!alone&&s.age<25&&!(s.spouse&&s.spouse.alive)){if(s.fa.alive)add('M',s.fa.age,false);if(s.mo.alive)add('F',s.mo.age,false)}
  add(s.sex,s.age,true,s.estate,sceneRole());
  if(!alone&&s.spouse&&s.spouse.alive)add(isM()?'F':'M',s.spouse.age,false,s.spouse.estate);
  if(!alone&&s.age<18)for(let i=0;i<Math.min(s.sibs,2);i++)add(i%2?'F':'M',clamp(s.age+(i?-3:3),1,30),false);
  if(!alone)kidsAlive().filter(k=>s.year-k.y<18).slice(-4).forEach(k=>add(k.sex,s.year-k.y,false));
  drawPeople(g,P)}
