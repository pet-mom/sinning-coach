/* ================= 장면 공통 =================
   논리 해상도 256×96, 땅선 GY=80. 모든 장면 함수는 ART[kind](g) 형태이고 g는 다음을 준다.
   g.px(x,y,w,h,색)  사각형 칠하기 (정수 좌표)
   g.rnd()           0~1 고정 시드 난수(같은 인물·장소면 같은 배치)
   g.t               연도+달 (1789.5 = 1789년 7월 무렵)
   g.era             'ancien'|'constit'|'republic'|'directory'|'consulate'|'empire'|'restoration'|'july'|'republic2'|'empire2'
   g.season          0봄 1여름 2가을 3겨울,  g.winter = 겨울 여부
   g.loc             지역 키(paris, lyon, bordeaux, marseille, nantes, rouen, bretagne, vendee …)
   g.place           망명지 이름 등 부가 정보
   g.flag(x,y)       깃대+시대 깃발(왕정 흰 기 / 삼색기 / 제국 삼색기)
   g.win()           창문 색(불 켜짐/꺼짐 무작위)
   g.snow(x,y,w)     지붕 위 눈 한 줄(겨울에만)
*/
const SW=256,SH=96,GY=80;
const ART={};
const PAL={stone:'#8a8274',stoneD:'#6b6458',stoneL:'#a59c8c',slate:'#3e4658',slateD:'#2d3342',tile:'#8a4a36',thatch:'#9a8250',thatchD:'#7a6438',
  wood:'#5a3e28',woodD:'#3e2a1a',plaster:'#b8ab92',plasterD:'#998d76',glow:'#f3c65a',glowD:'#c8902e',dark:'#1c2130',grass:'#2e4a2a',grassD:'#203823',
  water:'#1e3558',waterL:'#35588a',sky0:'#0b1230',sky1:'#2a3a62',snow:'#e3e9f2',red:'#b8323a',blue:'#2c4fa8',white:'#eeeeea',gold:'#d8b25a'};
function makeG(c,opt){const px=(x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
  const rnd=srng(opt.seed||1);const winter=opt.season===3;
  const g={px,rnd,t:opt.t,era:opt.era,season:opt.season,winter,loc:opt.loc,place:opt.place||'',
    win:()=>rnd()<.42?PAL.glow:'#2a3048',
    snow:(x,y,w)=>{if(winter)px(x,y,w,1,PAL.snow)},
    flag:(x,y)=>{px(x,y,1,16,'#9aa3b5');const e=opt.era;const royal=(e==='ancien'||e==='restoration');
      if(royal){px(x+1,y,11,7,PAL.white);px(x+5,y+2,3,3,PAL.gold)}else{px(x+1,y,4,7,PAL.blue);px(x+5,y,4,7,PAL.white);px(x+9,y,4,7,PAL.red);if(e==='empire'||e==='consulate')px(x+6,y+2,2,2,PAL.gold)}}};
  return g}
function artSky(g,night=true){for(let y=0;y<GY;y++){const k=y/GY;const r=Math.round(10+16*k),gg=Math.round(16+24*k),b=Math.round(42+36*k);g.px(0,y,SW,1,`rgb(${r},${gg},${b})`)}
  const st=srng(Math.round(g.t*12));for(let i=0;i<46;i++)g.px(st()*SW|0,st()*40|0,1,1,st()<.3?'#fff7d6':'#9fb0d8');
  g.px(216,8,6,6,'#efe6c4');g.px(217,7,4,1,'#efe6c4');g.px(217,14,4,1,'#efe6c4')}
function artGround(g,kind){if(kind==='cobble'){g.px(0,GY,SW,SH-GY,'#2b2e36');g.px(0,GY,SW,1,'#4a4f5c');for(let y=GY+3;y<SH;y+=4)for(let x=(y%8?0:3);x<SW;x+=6)g.px(x,y,4,2,'#353945')}
  else if(kind==='dirt'){g.px(0,GY,SW,SH-GY,'#3a3226');g.px(0,GY,SW,1,'#4e4433');for(let i=0;i<60;i++)g.px(g.rnd()*SW|0,GY+2+(g.rnd()*(SH-GY-3)|0),2,1,'#4a4030')}
  else {g.px(0,GY,SW,SH-GY,'#262b36');g.px(0,GY,SW,1,'#3b4252')}
  if(g.winter)for(let i=0;i<70;i++)g.px(g.rnd()*SW|0,GY+1+(g.rnd()*(SH-GY-2)|0),1,1,PAL.snow)}
