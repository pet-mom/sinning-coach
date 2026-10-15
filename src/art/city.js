/* ================= 도시·항구 장면 (18세기 프랑스) =================
   ART.city : 밤의 도시 거리. 파리면 노트르담 두 탑, 퐁뇌프, 센강, (1789.7 이전) 바스티유, (공포정치) 단두대.
   ART.port : 18세기 대서양/지중해 항구. 돌 부두, 아치문 창고, 세 돛대 범선, 등대 탑.
   좌우에 건물을 두고 가운데(x≈95~200)는 강·다리·원경이 보이도록 비워 인물 자리를 남긴다. */

/* ---------- 공용 도우미 ---------- */
function city_line(g,x0,y0,x1,y1,c){x0|=0;y0|=0;x1|=0;y1|=0;const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
  for(let n=0;n<600;n++){g.px(x0,y0,1,1,c);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
/* 늘어진 밧줄(포물선) — 중간점 좌표를 돌려준다 */
function city_rope(g,x0,y0,x1,y1,sag,c){let px0=x0,py0=y0;const n=Math.max(4,Math.abs(x1-x0)/3|0);
  for(let i=1;i<=n;i++){const k=i/n;const x=x0+(x1-x0)*k,y=y0+(y1-y0)*k+sag*4*k*(1-k);city_line(g,px0,py0,x,y,c);px0=x;py0=y}
  return [(x0+x1)/2,(y0+y1)/2+sag]}
/* 빛 번짐 */
function city_halo(g,x,y,r){for(let i=r;i>0;i-=2){const a=(0.07+0.05*(r-i)/r).toFixed(3);g.px(x-i,y-i*0.8,i*2+1,i*1.6+1,`rgba(243,198,90,${a})`)}}
/* 반사광(물 위 흔들리는 빛줄기) */
function city_reflect(g,x,y0,y1,c){for(let y=y0;y<y1;y+=2){const w=2+((y*7+x)%3);g.px(x-(w>>1)+((y>>1)%2),y,w,1,c)}}
/* 기름 가로등(레베르베르): 육각 유리 갓 + 위 반사판 */
function city_lantern(g,x,y){city_halo(g,x+1,y+3,9);g.px(x-1,y,5,1,'#2a2a2a');g.px(x,y+1,3,4,PAL.glow);g.px(x+1,y+2,1,2,'#fff4c0');g.px(x-1,y+1,1,3,'#3a3020');g.px(x+3,y+1,1,3,'#3a3020');g.px(x,y+5,3,1,'#2a2a2a');g.px(x+1,y+6,1,1,'#2a2a2a')}
/* 덧창 달린 창 */
function city_window(g,x,y,h,shut){const lit=g.win();const open=g.rnd()<.7;
  if(open){g.px(x,y,3,h,lit);if(lit===PAL.glow){g.px(x+1,y,1,h,'#e0a848');g.px(x,y+(h>>1),3,1,'#c8902e')}else g.px(x+1,y,1,h,'#232838');
    g.px(x-1,y,1,h,shut);g.px(x+3,y,1,h,shut)}
  else{g.px(x,y,3,h,shut);g.px(x+1,y,1,h,'rgba(0,0,0,.25)');for(let i=1;i<h;i+=2)g.px(x,y+i,3,1,'rgba(0,0,0,.18)')}
  g.px(x-1,y+h,5,1,'rgba(255,255,255,.12)')}
/* 사다리꼴 지붕 한 줄씩 */
function city_roofShape(g,x,w,yb,h,step,col,edge){for(let i=0;i<h;i++){const ins=Math.floor(i/step);if(w-2*ins<1)break;g.px(x+ins,yb-1-i,w-2*ins,1,i===0?edge:col)}}
function city_chimney(g,x,y,h){g.px(x,y-h,4,h,'#6e4234');g.px(x,y-h,4,1,'#8a5a44');g.px(x-1,y-h-1,6,1,'#5a3428');g.px(x,y-h-3,1,2,'#9a6a4a');g.px(x+2,y-h-3,1,2,'#9a6a4a');g.snow(x-1,y-h-2,6)}
function city_dormer(g,x,y){g.px(x,y,5,5,PAL.slateD);g.px(x+1,y+1,3,4,g.win());g.px(x+2,y-1,1,1,PAL.slateD);g.px(x+1,y,3,1,PAL.slateD);g.px(x,y,1,5,'#4a536a');g.snow(x,y-1,5)}
/* 가게 간판 */
function city_sign(g,x,y,dir){const c=['#7a2a2a','#2a4a6a','#6a5a1a','#3a5a3a'][g.rnd()*4|0];g.px(dir>0?x:x-8,y,9,1,'#222');g.px(dir>0?x+5:x-5,y+1,1,2,'#222');
  g.px(dir>0?x+2:x-7,y+3,8,6,c);g.px(dir>0?x+2:x-7,y+3,8,1,PAL.gold);g.px(dir>0?x+2:x-7,y+8,8,1,PAL.gold);g.px(dir>0?x+4:x-5,y+5,4,2,PAL.gold)}

/* 집 한 채. o={wall,fl,roof:'mansard'|'gable'|'hip',timber,shop,sign:±1} — 지붕 꼭대기 y 반환 */
function city_house(g,x,w,o){const fl=o.fl,fh=9,gh=13;const top=GY-gh-(fl-1)*fh;const wall=o.wall;
  g.px(x,top,w,GY-top,wall);g.px(x+w-1,top,1,GY-top,'rgba(0,0,0,.25)');g.px(x,top,1,GY-top,'rgba(255,255,255,.06)');
  const shut=o.shut||(g.rnd()<.5?'#3e5446':'#5a4232');
  if(o.timber){// 콜롱바주(목골): 층마다 들보, 기둥, 엇갈린 가새
    const tb='#3a2618';for(let f=0;f<fl-1;f++){const y=top+f*fh;g.px(x,y+fh-1,w,1,tb);g.px(x-1,y+fh-1,w+2,1,tb);
      for(let k=0;k<=w-1;k+=Math.max(5,w/4|0)){g.px(x+k,y,1,fh,tb)}g.px(x+w-1,y,1,fh,tb);
      const kk=(w/4|0);city_line(g,x+1,y+fh-2,x+kk,y+1,tb);city_line(g,x+w-2,y+fh-2,x+w-1-kk,y+1,tb)}
  }else{for(let f=1;f<fl;f++)g.px(x,top+f*fh-1,w,1,'rgba(0,0,0,.14)');g.px(x-1,top,w+2,2,o.cornice||PAL.stoneL)}
  // 위층 창
  const n=Math.max(2,Math.round((w-2)/7));const sp=w/n;
  for(let f=0;f<fl-1;f++){const y=top+f*fh+2;const h=(f===0&&!o.timber)?6:(f===fl-2?4:5);
    for(let i=0;i<n;i++){if(g.rnd()<.12)continue;const wx=x+Math.round(sp*i+sp/2-1.5)+(o.timber?(g.rnd()*3|0)-1:0);city_window(g,wx,y+(f===0&&!o.timber?0:1),h,shut)}
    if(f===0&&!o.timber&&g.rnd()<.75){g.px(x+1,y+6,w-2,1,'#1c1c22');for(let k=x+1;k<x+w-1;k+=2)g.px(k,y+4,1,2,'#1c1c22');g.px(x+1,y+3,w-2,1,'#1c1c22')}}
  // 1층: 아치문, 가게
  const gy=GY-gh;g.px(x,gy,w,1,'rgba(0,0,0,.3)');
  const dx=x+2+(g.rnd()*(w-10)|0);g.px(dx,gy+4,6,9,'#24180f');g.px(dx+1,gy+3,4,1,'#24180f');g.px(dx+1,gy+5,4,8,PAL.woodD);g.px(dx+3,gy+5,1,8,'#24180f');
  if(o.shop){const sx=dx>x+w/2?x+2:x+w-11;const lit=g.rnd()<.6;g.px(sx,gy+4,9,7,lit?'#d9a040':'#2a3048');g.px(sx,gy+3,9,1,PAL.woodD);g.px(sx+4,gy+4,1,7,PAL.woodD);g.px(sx,gy+7,9,1,PAL.woodD);g.px(sx-1,gy+11,11,1,PAL.woodD);
    if(lit){g.px(sx-1,GY,11,2,'rgba(243,198,90,.18)')}}
  // 지붕
  let rt=top;
  if(o.roof==='gable'){const rh=Math.round(w*0.55);for(let i=0;i<rh;i++){const ins=Math.round(i*(w/2+1)/rh);g.px(x-1+ins,top-1-i,w+2-2*ins,1,i===0?PAL.slateD:PAL.slate)}
    if(o.timber){g.px(x+(w>>1)-1,top-rh+3,3,4,g.win())}else{g.px(x+(w>>1)-1,top-rh+4,3,3,g.win())}
    for(let i=0;i<rh;i++){const ins=Math.round(i*(w/2+1)/rh);if(i%1===0&&g.winter&&i<rh-1){g.px(x-1+ins,top-1-i,1,1,PAL.snow);g.px(x+w-ins,top-1-i,1,1,PAL.snow)}}
    rt=top-rh;city_chimney(g,x+w-6,top-4,5)}
  else{// 망사르드: 가파른 아랫면 + 완만한 윗면
    const h1=9;g.px(x-1,top-1,w+2,1,PAL.slateD);for(let i=1;i<h1;i++){const ins=i>>2;g.px(x-1+ins,top-1-i,w+2-2*ins,1,PAL.slate)}
    const wt=w+2-2*(h1>>2);const xt=x-1+(h1>>2);for(let i=0;i<4;i++)g.px(xt+i*2,top-h1-i,wt-i*4,1,'#353c4e');
    for(let i=0;i<w;i+=3)g.px(x+i,top-h1+1,1,h1-2,'rgba(0,0,0,.12)');
    const nd=Math.max(1,Math.round(w/11));for(let i=0;i<nd;i++){const dxp=x+Math.round(w*(i+.5)/nd)-2;city_dormer(g,dxp,top-h1+2)}
    g.snow(xt,top-h1-4,wt);g.snow(x-1,top-h1,w+2);rt=top-h1-4;
    const nc=1+(g.rnd()*2|0);for(let i=0;i<nc;i++)city_chimney(g,i?x+w-6:x+2,top-h1-2,5+(g.rnd()*3|0))}
  if(o.sign)city_sign(g,o.sign>0?x+w:x,gy-3,o.sign);
  return rt}

/* 먼 지붕선 실루엣 */
function city_skyline(g,x0,x1,yb,col){let x=x0;while(x<x1){const w=6+(g.rnd()*10|0),h=6+(g.rnd()*9|0);g.px(x,yb-h,w,h,col);
  if(g.rnd()<.5)city_roofShape(g,x,w,yb-h,3,1,col,col);if(g.rnd()<.5)g.px(x+2,yb-h-3,2,3,col);
  if(g.rnd()<.35)g.px(x+2+(g.rnd()*(w-3)|0),yb-h+3,1,1,'rgba(243,198,90,.6)');x+=w-1}}
/* 노트르담 서쪽 정면(두 사각 탑) + 신랑 지붕 */
function city_notreDame(g,cx,yb){const c='#222b4a',d='#141a30',l='#38436a';
  g.px(cx+10,yb-20,34,20,c);city_roofShape(g,cx+10,34,yb-20,4,1,c,c);// 신랑
  for(let k=0;k<5;k++)g.px(cx+14+k*6,yb-22,1,5,c);// 부벽
  g.px(cx+40,yb-30,2,10,c);g.px(cx+40,yb-36,1,6,c);// 교차부 작은 첨탑
  g.px(cx-14,yb-24,28,24,c);// 정면
  g.px(cx-14,yb-36,10,12,c);g.px(cx+4,yb-36,10,12,c);// 두 탑
  g.px(cx-15,yb-37,12,1,l);g.px(cx+3,yb-37,12,1,l);for(const tx of [cx-15,cx-5,cx+3,cx+13]){g.px(tx,yb-39,2,2,c)}
  g.px(cx-11,yb-34,1,7,d);g.px(cx-8,yb-34,1,7,d);g.px(cx+7,yb-34,1,7,d);g.px(cx+10,yb-34,1,7,d);// 종탑 루버
  g.px(cx-14,yb-24,28,1,l);g.px(cx-14,yb-19,28,1,l);// 왕의 회랑
  g.px(cx-2,yb-17,4,4,l);g.px(cx-1,yb-18,2,6,l);g.px(cx-1,yb-16,2,2,'rgba(243,198,90,.55)');// 장미창
  for(const px of [cx-10,cx-2,cx+6]){g.px(px,yb-8,4,8,d);g.px(px+1,yb-9,2,1,d)}// 세 개의 문
  g.px(cx-14,yb-24,1,24,l)}
/* 지방 대성당: 높은 첨탑 하나 */
function city_cathedral(g,cx,yb){const c='#222b4a',d='#141a30',l='#38436a';
  g.px(cx-6,yb-22,40,22,c);city_roofShape(g,cx-6,40,yb-22,5,1,c,c);for(let k=0;k<6;k++)g.px(cx-4+k*7,yb-25,2,8,c);
  g.px(cx-4,yb-38,10,38,c);for(let i=0;i<22;i++){const ins=Math.round(i*5/22);g.px(cx-4+ins,yb-39-i,10-2*ins,1,c)}g.px(cx+1,yb-64,1,4,l);g.px(cx,yb-62,3,1,l);
  g.px(cx-1,yb-34,2,6,d);g.px(cx+2,yb-34,2,6,d);g.px(cx-1,yb-14,6,14,d);g.px(cx+12,yb-16,4,4,l);g.px(cx+13,yb-15,2,2,'rgba(243,198,90,.5)')}
/* 바스티유: 거대한 원형 탑과 성벽 */
function city_bastille(g,x0,x1){const c='#4a4744',d='#38363a',l='#5e5a54';const top=22;
  g.px(x0,top+8,x1-x0,GY-top-8,d);for(let x=x0;x<x1;x+=4)g.px(x,top+6,2,2,d);
  const towers=[x0+1,x0+19,x0+37];for(const tx of towers){if(tx+14>x1+4)continue;
    g.px(tx+1,top,12,GY-top,c);g.px(tx,top+2,14,GY-top-2,c);g.px(tx+1,top,2,GY-top,l);g.px(tx+11,top,3,GY-top,'#3a3836');
    g.px(tx-1,top-1,16,3,l);g.px(tx-1,top+2,16,1,'#2a2828');for(let k=0;k<16;k+=3)g.px(tx-1+k,top-3,2,2,l);// 마시쿨리·총안
    for(let k=0;k<3;k++)g.px(tx+6,top+10+k*14,1,4,'#16141a');g.snow(tx-1,top-3,16)}
  g.px(x0,GY-4,x1-x0,4,'#2c2a2c');// 해자 둑
  g.px(x0+26,GY-12,6,12,'#16141a');g.px(x0+27,GY-13,4,1,'#16141a')}
/* 단두대 실루엣: 처형대 + 두 기둥 + 칼날 */
function city_guillotine(g,x){const w='#3a2620',wl='#5a3a2c';
  g.px(x-8,GY-8,26,8,'#4a2c22');g.px(x-8,GY-8,26,1,'#7a4a36');for(let k=x-6;k<x+18;k+=5)g.px(k,GY-7,1,7,'#2e1c16');
  for(let i=0;i<4;i++)g.px(x-12+i*1,GY-2-i*2,4,2,'#3e2820');// 계단
  g.px(x+2,GY-38,2,30,w);g.px(x+9,GY-38,2,30,w);g.px(x+1,GY-40,11,2,wl);g.px(x+2,GY-38,1,30,wl);
  g.px(x+4,GY-34,5,3,'#b8c0cc');g.px(x+4,GY-31,5,1,'#8a929e');g.px(x+4,GY-34,1,1,w);g.px(x+8,GY-31,1,1,'#ccd4de');// 비스듬한 칼날
  g.px(x+4,GY-16,5,3,w);g.px(x+6,GY-15,1,1,'#14100e');g.px(x+11,GY-14,7,2,wl);g.px(x+3,GY-33,1,20,'#2a1c16')}
/* 아치 돌다리 */
function city_bridge(g,x0,x1,deck,wl,col,arch){g.px(x0,deck,x1-x0,wl-deck,col);g.px(x0,deck-2,x1-x0,2,PAL.stoneL);for(let x=x0;x<x1;x+=3)g.px(x,deck-3,2,1,PAL.stoneL);
  const aw=arch;let x=x0+3;while(x+aw<x1){const ah=wl-deck-3;for(let i=0;i<ah;i++){const k=i/ah;const ins=Math.round((aw/2)*(1-Math.sqrt(Math.max(0,1-(1-k)*(1-k)))));g.px(x+ins,wl-ah+i,aw-2*ins,1,PAL.water)}
    g.px(x+aw,deck+2,3,wl-deck-2,'rgba(0,0,0,.18)');city_halfround(g,x+aw+1,deck+3);x+=aw+4}
  g.px(x0,deck,x1-x0,1,'rgba(0,0,0,.25)')}
function city_halfround(g,x,y){g.px(x-1,y-4,3,2,PAL.stoneD)}// 퐁뇌프 반원 전망대(교각 위)

/* ===================== 도시 ===================== */
ART.city=function(g){const paris=g.loc==='paris';const t=g.t;
  const bast=paris&&t<1789.55,guil=paris&&t>=1793.4&&t<1794.6;
  // 원경: 건너편 지붕선, 성당
  city_skyline(g,60,240,60,'#18203a');
  if(paris)city_notreDame(g,150,60);else city_cathedral(g,138,60);
  if(paris){/* 판테옹은 아직 없음 — 대신 먼 돔 하나(발드그라스) */g.px(206,44,10,16,'#161d36');g.px(207,40,8,4,'#161d36');g.px(208,38,6,2,'#161d36');g.px(210,34,2,4,'#161d36')}
  // 센강과 다리
  g.px(80,58,140,16,PAL.water);for(let i=0;i<30;i++)g.px(84+g.rnd()*132|0,60+(g.rnd()*13|0),3+(g.rnd()*4|0),1,PAL.waterL);
  city_bridge(g,82,218,57,68,'#7a7466',8);
  // 강둑 난간(앞 부두 벽)
  g.px(80,75,140,5,PAL.stoneD);g.px(80,74,140,1,PAL.stoneL);for(let x=82;x<220;x+=12)g.px(x,75,1,5,'rgba(0,0,0,.2)');
  // 강물에 비친 불빛
  for(const rx of [110,135,172,196])city_reflect(g,rx,68,74,'rgba(243,198,90,.45)');

  // 왼쪽: 바스티유 또는 집들
  let lx=0;const houses=[];
  if(bast){city_bastille(g,0,52);g.flag(20,4);lx=52}
  const wallsL=['#b8ab92','#a89c84','#c2b49a','#9c9078','#b0a088'];
  while(lx<92){const w=Math.min(92-lx,18+(g.rnd()*8|0));if(w<12){break}
    const timber=!bast&&lx>20&&houses.filter(h=>h.timber).length<1&&g.rnd()<.6;
    const rt=city_house(g,lx,w,{wall:timber?'#c8b898':wallsL[houses.length%5],fl:timber?4:4+(g.rnd()*2|0),roof:timber?'gable':'mansard',timber,shop:g.rnd()<.7,sign:lx+w>=80?1:0});
    houses.push({x:lx,w,rt,timber});lx+=w}
  // 오른쪽 집들
  let rx=256;const right=[];
  while(rx>202){const w=Math.min(rx-200,18+(g.rnd()*8|0));if(w<12)break;const x=rx-w;const timber=right.length===1;
    const rt=city_house(g,x,w,{wall:timber?'#c4b090':wallsL[(right.length+2)%5],fl:timber?4:5-(right.length%2),roof:timber?'gable':'mansard',timber,shop:true,sign:x<=214?-1:0});
    right.push({x,w,rt});rx=x}
  // 깃발: 오른쪽 첫 지붕 위(바스티유가 없을 때도 하나)
  const fh=right[right.length-1],fr=right[0];g.flag(Math.min(fr.x+(fr.w>>1),SW-15),fr.rt-16);
  // 단두대(혁명 광장) — 가운데 오른쪽
  if(guil){city_guillotine(g,180);g.px(176,GY-1,30,1,'rgba(120,20,20,.5)')}
  // 레베르베르: 집과 집 사이 밧줄에 매달린 기름등
  const lh=houses[houses.length-1];const ax=lh.x+lh.w,ay=34;g.px(ax,ay-1,3,1,'#222');
  const bx=fh.x,by=32;g.px(bx-3,by-1,3,1,'#222');
  const [mx,my]=city_rope(g,ax+2,ay,bx-2,by,8,'#2a2622');if(!guil||true)city_lantern(g,mx-1,my);
  // 왼쪽 골목 벽에도 하나
  if(!bast){const r2=city_rope(g,houses[0].x+houses[0].w-4,40,houses[1]?houses[1].x+houses[1].w-3:60,41,4,'#2a2622');city_lantern(g,r2[0]-1,r2[1])}
  else{g.px(54,46,6,1,'#222');city_lantern(g,58,47)}
  // 강변 기둥등
  for(const x of [100,214]){g.px(x,58,1,14,'#222');city_lantern(g,x-1,52)}
  artGround(g,'cobble');
  // 길 위 불빛 웅덩이
  for(const x of [mx,100,214])g.px(x-10,GY+1,20,2,'rgba(243,198,90,.12)');
  g.px(0,GY,SW,1,'#4a4f5c')};

/* ===================== 항구 ===================== */
function city_ship(g,x,wl,s,flagMast){// x=뱃머리 왼쪽 기준, s=크기 배율
  const L=Math.round(70*s),H=Math.round(9*s);const hull='#2e2018',band='#b08a3a';
  // 선체: 아래로 좁아짐, 선미(오른쪽) 높음
  for(let i=0;i<H;i++){const ins=Math.round(i*i/H*0.6);g.px(x+ins+2,wl-H+i,L-ins*2-2,1,hull)}
  g.px(x+L-12*s,wl-H-6*s,12*s,6*s,hull);g.px(x+L-12*s,wl-H-6*s,12*s,1,band);// 선미루
  for(let k=0;k<3;k++)g.px(x+L-10*s+k*3*s,wl-H-4*s,2,2,PAL.glow);g.px(x+L-1,wl-H-5*s,2,H+3*s,'#3e2a1a');
  g.px(x+2,wl-H,L-12*s,1,'#4a3424');g.px(x+3,wl-H+2,L-6,2,band);for(let k=x+8;k<x+L-10;k+=5)g.px(k,wl-H+2,2,2,'#1a120c');// 포문 띠
  g.px(x,wl-H-2,6,2,hull);city_line(g,x+2,wl-H-2,x-16*s,wl-H-10*s,'#3e2a1a');// 뱃머리·바우스프릿
  // 돛대 3개
  const masts=[[x+L*0.25,0.82],[x+L*0.5,1],[x+L*0.74,0.72]];const tops=[];
  for(const [mx0,k] of masts){const mx=Math.round(mx0);const mh=Math.round(50*s*k);const top=wl-H-mh;g.px(mx,top,1,mh,'#4a3424');g.px(mx-1,top+mh*0.38,3,1,'#4a3424');
    for(let j=0;j<3;j++){const yy=Math.round(top+4+j*mh*0.27);const yw=Math.round((22-j*0)*s*k*(1-j*0.18));g.px(mx-yw,yy,yw*2+1,1,'#3e2a1a');// 활대
      g.px(mx-yw+1,yy+1,yw*2-1,2,'#c9bc9a');g.px(mx-yw+1,yy+2,yw*2-1,1,'#a89c7c');for(let q=mx-yw+3;q<mx+yw;q+=4)g.px(q,yy+1,1,2,'#8a7e62');// 감아 묶은 돛
      g.snow(mx-yw+1,yy,yw*2-1)}
    tops.push([mx,top])}
  // 삭구
  const rc='rgba(40,30,24,.9)';const [f,m,a]=tops;city_line(g,x-16*s,wl-H-10*s,f[0],f[1]+2,rc);city_line(g,f[0],f[1],m[0],m[1]+4,rc);city_line(g,m[0],m[1],a[0],a[1]+4,rc);city_line(g,a[0],a[1],x+L,wl-H-6*s,rc);
  for(const [tx,ty] of tops){city_line(g,tx,ty+3,tx-8*s,wl-H,rc);city_line(g,tx,ty+3,tx+8*s,wl-H,rc)}
  g.px(x+L*0.75-1,wl-H-1,1,1,PAL.glow);
  if(flagMast)g.flag(m[0],m[1]-9);else g.px(a[0],a[1]-5,1,5,'#9aa3b5');
  return tops}
function city_boat(g,x,y){g.px(x,y,14,2,'#3a281a');g.px(x+1,y+2,12,1,'#2a1c12');g.px(x-1,y-1,2,1,'#3a281a');g.px(x+13,y-1,2,1,'#3a281a');g.px(x+6,y-1,2,1,'#5a4030');city_line(g,x+4,y,x-2,y+3,'#5a4030')}
function city_warehouse(g,x,w,h){const top=GY-h;g.px(x,top,w,h,PAL.stone);g.px(x,top,w,1,PAL.stoneL);g.px(x+w-1,top,1,h,'rgba(0,0,0,.25)');
  for(let y=top+3;y<GY;y+=3)for(let k=x+((y/3|0)%2)*3;k<x+w-1;k+=6)g.px(k,y,1,1,'rgba(0,0,0,.12)');// 마름돌 줄눈
  city_roofShape(g,x-2,w+4,top,8,1,PAL.tile,'#6a3828');for(let i=0;i<w;i+=3)g.px(x+i+2,top-6,1,5,'rgba(0,0,0,.12)');g.snow(x+4,top-8,w-8);
  const n=Math.max(1,Math.round(w/16));for(let i=0;i<n;i++){const ax=x+Math.round(w*(i+.5)/n)-5;// 아치문
    g.px(ax,GY-12,10,12,'#1e140c');for(let r=0;r<3;r++)g.px(ax+2-r,GY-15+r,6+2*r,1,'#1e140c');g.px(ax+1,GY-11,8,11,PAL.woodD);g.px(ax+5,GY-11,1,11,'#1e140c');
    g.px(ax-1,GY-16,12,1,PAL.stoneL);g.px(ax+4,GY-17,2,2,PAL.stoneL);// 쐐기돌
    g.px(ax+3,top+4,4,5,'#1e140c');g.px(ax+4,top+5,2,4,g.win());}
  g.px(x+w-6,top+1,8,1,PAL.woodD);g.px(x+w+1,top+2,1,10,'#2a2622');g.px(x+w,top+12,3,3,'#5a4030')}// 도르래 들보
function city_barrels(g,x){for(let i=0;i<3;i++){g.px(x+i*5,GY-6,4,6,'#5a3a24');g.px(x+i*5,GY-5,4,1,'#2a1c12');g.px(x+i*5,GY-2,4,1,'#2a1c12')}g.px(x+2,GY-12,4,6,'#5a3a24');g.px(x+2,GY-11,4,1,'#2a1c12');g.px(x+16,GY-7,7,7,'#6a5034');g.px(x+16,GY-7,7,1,'#8a6a44');city_line(g,x+16,GY-7,x+22,GY-1,'#4a3824')}
/* 등대 겸 요새 탑(라 로셸·마르세유 생장 요새 느낌) */
function city_lighthouse(g,x,yb){const c='#5a5650',l='#76706a';g.px(x-10,yb-8,26,8,'#3a3a40');for(let k=x-10;k<x+16;k+=3)g.px(k,yb-10,2,2,'#3a3a40');
  g.px(x-4,yb-30,14,22,c);g.px(x-4,yb-30,2,22,l);g.px(x-5,yb-32,16,2,l);for(let k=0;k<16;k+=3)g.px(x-5+k,yb-34,2,2,l);
  g.px(x+1,yb-42,4,8,'#3a3a40');g.px(x+2,yb-40,2,4,'#fff2b0');g.px(x,yb-44,6,2,'#2a2a30');g.px(x+2,yb-46,2,2,'#2a2a30');
  for(let i=0;i<2;i++)g.px(x+2,yb-24+i*9,1,3,'#1a181c');g.snow(x-5,yb-35,16);
  // 불빛 번짐과 빛줄기
  city_halo(g,x+3,yb-38,12);for(let i=1;i<30;i++)g.px(x+3-i*2,yb-38+(i>>2),2,1,`rgba(255,240,180,${(0.3-i*0.009).toFixed(3)})`)}

ART.port=function(g){const WL=74;
  // 먼 해안선과 언덕
  for(let x=0;x<256;x++){const h=Math.round(5+3*Math.sin(x*0.05)+2*Math.sin(x*0.13));g.px(x,56-h,1,h,'#151c33')}
  city_skyline(g,150,212,56,'#18203a');
  // 물
  g.px(0,56,256,WL-56+6,PAL.water);for(let i=0;i<50;i++)g.px(g.rnd()*256|0,57+(g.rnd()*22|0),3+(g.rnd()*5|0),1,PAL.waterL);
  city_lighthouse(g,232,58);
  for(let y=60;y<GY;y+=2)g.px(222+((y>>1)%3),y,4,1,'rgba(255,240,180,.35)');
  // 먼 배 (작게)
  city_ship(g,196,60,0.35,false);
  // 큰 세 돛대 범선
  city_ship(g,92,WL,1,true);
  for(const rx of [158,163,168])city_reflect(g,rx,WL+1,GY,'rgba(243,198,90,.5)');
  // 작은 배들
  city_boat(g,58,WL+1);city_boat(g,198,WL+2);g.px(206,WL-8,1,8,'#4a3424');city_line(g,206,WL-8,212,WL+1,'#2a1c12');
  // 부두 벽(앞쪽 돌 안벽) — 물과 땅 사이
  g.px(0,WL+4,256,GY-WL-4,PAL.stoneD);g.px(0,WL+4,256,1,PAL.stoneL);for(let x=0;x<256;x+=8)g.px(x,WL+5,1,GY-WL-5,'rgba(0,0,0,.2)');
  // 왼쪽 창고들과 통
  city_warehouse(g,0,34,30);city_warehouse(g,36,40,24);city_barrels(g,78);
  g.flag(18,GY-30-8-16+1);
  // 계류주
  for(const x of [96,180,240]){g.px(x,GY-3,3,3,'#2a2a2e');g.px(x-1,GY-4,5,1,'#3a3a40')}city_line(g,97,GY-3,112,WL-6,'#2a2622');
  // 부두 가로등 기둥
  for(const x of [86,248]){g.px(x,GY-22,1,22,'#222');g.px(x-2,GY-22,5,1,'#222');city_lantern(g,x-1,GY-28)}
  for(const x of [86,248])city_reflect(g,x,WL+1,WL+4,'rgba(243,198,90,.4)');
  artGround(g,'cobble');
  for(const x of [86,248])g.px(x-10,GY+1,20,2,'rgba(243,198,90,.12)')};
