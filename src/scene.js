/* ================= 픽셀 장면 =================
   192×72 논리 픽셀을 캔버스에 그리고 CSS로 확대한다(image-rendering: pixelated).
   장소(도시·항구·마을·성관·감옥·막사·망명지·숲·수도원)와 시대(바스티유, 단두대, 깃발), 계절, 가족을 그린다. */
const SW=192,SH=72,GY=60;
function srng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function sceneKind(){if(s.cond==='prison')return 'prison';if(s.cond==='emigre')return 'abroad';if(s.cond==='hiding')return 'forest';
  if(soldier()&&atWar())return 'camp';if(priest()||nun())return 'church';
  const r=REGIONS[loc()];if(r.urban)return r.port?'port':'city';if(noble()&&s.land>=300)return 'chateau';return 'village'}
function homeLabel(){const k=sceneKind();if(k==='prison')return '감옥';if(k==='abroad')return `망명지 하숙방 · ${s.emiPlace||''}`;if(k==='forest')return '은신처';if(k==='camp')return '야영지';
  if(k==='church')return isM()?'사제관':'수녀원';if(k==='chateau')return '성관';
  const rich=s.money>=20000||s.land>=1000;if(urban())return rich?'저택':s.money>=1500?'아파르트망':'다락 셋방';return rich?'영지 저택':s.money>=600||s.land>0?'농가':'초가'}
function companions(){const a=[];const kids=kidsAlive().filter(k=>s.year-k.y<18);
  if(s.spouse&&s.spouse.alive)a.push(isM()?'아내':'남편');
  if(s.age<25&&!(s.spouse&&s.spouse.alive)&&(s.fa.alive||s.mo.alive))a.push(s.fa.alive&&s.mo.alive?'부모님':s.fa.alive?'아버지':'어머니');
  if(s.age<18&&s.sibs)a.push(`형제자매 ${Math.min(s.sibs,4)}명`);
  if(kids.length)a.push(`자녀 ${kids.length}명`);
  if(!a.length)return '혼자';const j=a.join('·');return `${jo(j,'과','와')} 함께`}
function familyAges(){const a=[`나 ${s.age}세`];if(s.spouse&&s.spouse.alive)a.push(`${isM()?'아내':'남편'} ${s.spouse.age}세`);
  if(s.age<25&&!(s.spouse&&s.spouse.alive)){if(s.mo.alive)a.push(`어머니 ${s.mo.age}세`);if(s.fa.alive)a.push(`아버지 ${s.fa.age}세`)}
  kidsAlive().slice(-4).forEach(k=>a.push(`${k.sex==='M'?'아들':'딸'} ${s.year-k.y}세`));return a.join(' · ')}
function drawScene(cv){if(!cv||!s)return;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
  const R2=srng((s.by*977+s.region.length*131+(s.loc||'').length*17)>>>0);const kind=sceneKind();const winter=s.season===3,t=T();
  const px=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),w,h)};
  // 하늘
  for(let y=0;y<GY;y++){const k=y/GY;const r=Math.round(10+14*k),g=Math.round(16+22*k),b=Math.round(42+34*k);px(0,y,SW,1,`rgb(${r},${g},${b})`)}
  const st=srng(s.year*12+s.month);for(let i=0;i<34;i++)px(st()*SW|0,st()*30|0,1,1,st()<.3?'#fff7d6':'#9fb0d8');
  px(160,7,5,5,'#efe6c4');px(161,6,3,1,'#efe6c4');px(161,12,3,1,'#efe6c4');
  const lit=()=>R2()<.45?'#f3c65a':'#29324a';
  const flag=(x,y)=>{px(x,y,1,12,'#9aa3b5');const e=era().k;
    if(['ancien','restoration'].includes(e)&&!(t>=1815&&t<1815.25)){px(x+1,y,8,5,'#eeeeea');px(x+4,y+2,2,1,'#d8b25a')}
    else{px(x+1,y,3,5,'#2c4fa8');px(x+4,y,3,5,'#eeeeea');px(x+7,y,3,5,'#c8323a');if(e==='empire'||e==='consulate')px(x+5,y+2,1,1,'#d8b25a')}};
  const building=(x,w,h,base='#2b3550',roof='#1d2438')=>{px(x,GY-h,w,h,base);px(x-1,GY-h-3,w+2,3,roof);if(winter)px(x-1,GY-h-4,w+2,1,'#dfe6f2');
    px(x+2,GY-h-6,2,3,roof);for(let yy=GY-h+3;yy<GY-4;yy+=5)for(let xx=x+2;xx<x+w-2;xx+=4)px(xx,yy,2,2,lit())};
  if(kind==='city'||kind==='port'){
    if(loc()==='paris'){px(128,GY-40,7,40,'#1c2540');px(140,GY-40,7,40,'#1c2540');px(135,GY-30,5,30,'#1c2540');px(129,GY-36,2,3,'#3a4466');px(141,GY-36,2,3,'#3a4466');}
    let x=0;while(x<SW){const w=14+(R2()*14|0),h=22+(R2()*20|0);if(!(loc()==='paris'&&x>118&&x<150))building(x,w,h,R2()<.5?'#2b3550':'#323d5c');x+=w+1}
    if(loc()==='paris'&&t<1789.5){px(8,GY-30,34,30,'#202a40');for(const tx of [6,16,26,36])px(tx,GY-34,6,34,'#262f48');px(10,GY-26,2,3,'#f3c65a');}
    if(kind==='port'){px(0,GY-6,SW,6,'#132342');for(let i=0;i<SW;i+=7)px(i,GY-4,3,1,'#2f4f86');for(const mx of [30,70,150]){px(mx,GY-34,1,28,'#4a3a2a');px(mx-6,GY-30,12,8,'#cfc8b0');px(mx-5,GY-20,10,6,'#cfc8b0')}}
    flag(96,GY-52);
    if(loc()==='paris'&&t>=1793.25&&t<1794.5){px(108,GY-22,1,22,'#5a3a2a');px(115,GY-22,1,22,'#5a3a2a');px(108,GY-22,8,1,'#5a3a2a');px(109,GY-20,6,2,'#b8c0cc');px(106,GY-3,12,3,'#4a2f22')}
  }
  if(kind==='village'||kind==='chateau'||kind==='forest'){
    for(let x=0;x<SW;x++){const h=8+Math.round(5*Math.sin(x/23)+3*Math.sin(x/9));px(x,GY-h,1,h,'#1b3326')}
    for(let x=0;x<SW;x+=2)px(x,GY-6,1,6,winter?'#cfd6e2':s.season===1?'#5b6a2a':'#3d4f2a');
    if(kind!=='forest'){px(150,GY-30,10,22,'#3a3f52');px(153,GY-40,4,10,'#3a3f52');px(154,GY-44,2,4,'#3a3f52');px(154,GY-47,2,1,'#c9c2a6');px(155,GY-48,1,3,'#c9c2a6');px(154,GY-24,2,3,'#f3c65a');
      for(const hx of [18,44,120,172]){px(hx,GY-12,14,12,'#5a4636');px(hx-1,GY-17,16,5,winter?'#dfe6f2':'#7a6a3a');px(hx+5,GY-8,3,4,'#2a1e16');px(hx+10,GY-10,2,2,'#f3c65a')}}
    const trees=kind==='forest'?24:6;for(let i=0;i<trees;i++){const tx=R2()*SW|0,th=10+(R2()*14|0);px(tx,GY-th,2,th,'#2a1e16');px(tx-4,GY-th-6,10,9,winter?'#c9d2df':'#163b25')}
    if(kind==='chateau'){px(60,GY-34,56,34,'#4a4a5a');for(const cx of [56,112]){px(cx,GY-42,10,42,'#555566');px(cx+1,GY-48,8,6,'#2b2f45');px(cx+3,GY-52,4,4,'#2b2f45')}
      for(let yy=GY-30;yy<GY-6;yy+=7)for(let xx=64;xx<112;xx+=6)px(xx,yy,3,4,lit());flag(87,GY-48)}
  }
  if(kind==='church'){building(0,40,24);building(150,42,26);px(66,GY-40,60,40,'#3c4058');px(90,GY-54,12,14,'#3c4058');px(95,GY-60,2,6,'#c9c2a6');px(93,GY-58,6,2,'#c9c2a6');
    px(92,GY-32,8,8,'#7a4ab0');px(94,GY-30,4,4,'#f3c65a');for(let xx=70;xx<122;xx+=8)px(xx,GY-14,5,14,'#252a3e')}
  if(kind==='prison'){px(0,GY-46,SW,46,'#3b3d46');for(let yy=GY-40;yy<GY-4;yy+=9)for(let xx=6;xx<SW;xx+=14){px(xx,yy,6,6,'#15171e');for(let b=1;b<6;b+=2)px(xx+b,yy,1,6,'#6a6e7a')}
    for(let xx=0;xx<SW;xx+=4)px(xx,GY-48,2,2,'#3b3d46');px(100,GY-20,3,3,'#f3c65a')}
  if(kind==='camp'){for(let x=0;x<SW;x+=2)px(x,GY-4,1,4,'#2a3324');for(const tx of [20,60,130,168]){for(let i=0;i<10;i++)px(tx-i,GY-14+i,2*i+1,1,'#cfc6aa');px(tx,GY-4,1,4,'#2a1e16')}
    px(96,GY-6,16,4,'#2a2a2a');px(100,GY-8,12,2,'#3a3a3a');px(98,GY-4,4,4,'#5a3a2a');px(84,GY-4,6,2,'#5a3a2a');px(85,GY-7,4,3,R2()<.5?'#f39a3a':'#f3c65a');flag(140,GY-26)}
  if(kind==='abroad'){building(0,30,26,'#2f3448');building(150,42,30,'#2f3448');px(30,GY-8,120,8,'#132342');for(let i=0;i<4;i++){px(36+i*28,GY-18,24,4,'#4a4a52');px(44+i*28,GY-14,8,8,'#132342')}px(80,GY-44,26,14,'#2a2f45');px(86,GY-52,14,8,'#2a2f45');px(92,GY-56,2,4,'#c9c2a6')}
  // 길
  px(0,GY,SW,SH-GY,'#262b36');px(0,GY,SW,1,'#3b4252');for(let x=4;x<SW;x+=12)px(x,GY+7,6,1,'#6b7280');if(winter)for(let i=0;i<40;i++)px(R2()*SW|0,GY+1+(R2()*10|0),1,1,'#dfe6f2');
  // 사람들
  const people=[];const me=look(s.sex,s.age,true);people.push(me);
  if(s.spouse&&s.spouse.alive)people.push(look(isM()?'F':'M',s.spouse.age,false,s.spouse.estate));
  if(s.age<25&&!(s.spouse&&s.spouse.alive)){if(s.fa.alive&&kind!=='prison'&&kind!=='camp')people.unshift(look('M',s.fa.age,false));if(s.mo.alive&&kind!=='prison'&&kind!=='camp')people.unshift(look('F',s.mo.age,false))}
  if(s.age<18&&kind!=='prison')for(let i=0;i<Math.min(s.sibs,2);i++)people.push(look(R2()<.5?'M':'F',clamp(s.age+(i?-3:3),2,30),false));
  if(kind!=='prison'&&kind!=='camp')kidsAlive().filter(k=>s.year-k.y<18).slice(-4).forEach(k=>people.push(look(k.sex,s.year-k.y,false)));
  let x=Math.round(SW/2-people.length*5);people.forEach(p=>{drawPerson(px,x,GY+3,p);x+=p.w+4})}
function look(sex,age,me,est=s.estate){const t=T();const nob=ESTATES[est]&&ESTATES[est].noble;const skin=['#f1c9a5','#e3b38c','#c98e66'][(s.by+age+(sex==='M'?1:0))%3];
  let coat='#5a4a3a',legs='#3a3028',hat=null,hair=age>=62?'#c8c8c8':['#3a2a1a','#6a4a2a','#2a2020','#8a6a3a'][(s.by+age)%4],dress=null;
  if(est==='peasant')coat=sex==='M'?'#6b5236':'#7a5a4a';else if(est==='artisan')coat='#4a5a6a';else if(est==='bourgeois')coat='#2f3b5a';else if(nob)coat=['#7a2f4a','#2f5a7a','#4a6a2f'][(s.by)%3];
  if(sex==='F'){dress=nob?'#c99ab0':est==='bourgeois'?'#5a7a9a':est==='artisan'?'#7a6a8a':'#8a6a4a';hat=age>=14?'cap':null}
  if(me){if(soldier()){coat='#2b3f8f';legs='#d8d8d8';hat='bicorne'}else if(priest()){coat='#1a1a1e';legs='#1a1a1e';hat=null}else if(nun()){dress='#1a1a1e';hat='veil'}
    else if(sex==='M'&&!nob&&s.pol>=40&&t>=1792.25&&t<1795.5){hat='bonnet';legs='stripe'}
    if(s.cond==='prison')coat='#5a5a5a'}
  if(sex==='M'&&nob&&t<1792.5&&age>=16&&!hat)hat='wig';if(sex==='M'&&!hat&&age>=16&&t<1800&&(est==='bourgeois'||nob))hat='tricorne';
  const h=age<2?7:age<6?10:age<12?13:age<16?16:19;return {sex,age,me,skin,coat,legs,hat,hair,dress,h,w:age<6?4:age<12?5:6}}
function drawPerson(px,x,base,p){const top=base-p.h,w=p.w,hd=p.age<6?3:4;const hx=x+Math.floor((w-hd)/2);
  if(p.me){px(x+w/2-1,top-5,3,1,'#ffffff');px(x+w/2,top-4,1,1,'#ffffff')}
  // 머리
  px(hx,top,hd,hd,p.skin);px(hx,top,hd,1,p.hair);if(p.hat==='wig'){px(hx-1,top,hd+2,2,'#eeeeee');px(hx+hd,top+1,1,3,'#eeeeee')}
  if(p.hat==='bonnet'){px(hx-1,top-2,hd+2,2,'#c8323a');px(hx+hd,top-3,2,2,'#c8323a')}
  if(p.hat==='bicorne'){px(hx-2,top-2,hd+4,2,'#141414');px(hx+1,top-3,2,1,'#141414');px(hx+hd-1,top-2,1,1,'#c8323a')}
  if(p.hat==='tricorne'){px(hx-1,top-2,hd+2,2,'#1a1a1a')}
  if(p.hat==='cap'){px(hx-1,top-1,hd+2,2,'#eeeeea')}
  if(p.hat==='veil'){px(hx-1,top-1,hd+2,hd+2,'#1a1a1e');px(hx,top+1,hd,hd-1,p.skin);px(hx,top,hd,1,'#eeeeea')}
  const by=top+hd,bodyH=p.h-hd;
  if(p.dress){px(x,by,w,Math.ceil(bodyH*.45),p.dress);px(x-1,by+Math.ceil(bodyH*.45),w+2,bodyH-Math.ceil(bodyH*.45),p.dress);px(x+1,by+1,w-2,1,'#eeeeea')}
  else{const th=Math.ceil(bodyH*.5);px(x,by,w,th,p.coat);
    if(p.legs==='stripe'){for(let i=0;i<bodyH-th;i++)px(x+1,by+th+i,w-2,1,i%2?'#e8e8e8':'#3050a0')}else{px(x+1,by+th,2,bodyH-th,p.legs);px(x+w-3,by+th,2,bodyH-th,p.legs)}
    px(x-1,by+1,1,th-1,p.coat);px(x+w,by+1,1,th-1,p.coat)}
}
