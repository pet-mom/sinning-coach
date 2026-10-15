/* ================= 장소 장면: 감옥 · 야영지 · 교회 · 망명지 (1750–1850) =================
   모든 보조 함수는 places_ 접두어. 사람은 x≈90–170, y=GY에 나중에 그려지므로 그 앞쪽은 비워 둔다. */

/* ---------- 보조 도형 ---------- */
function places_line(g,x0,y0,x1,y1,col,w=1){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);
  const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;
  for(;;){g.px(x0,y0,w,w,col);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}
function places_disc(g,cx,cy,r,col){for(let dy=-r;dy<=r;dy++){const w=Math.round(Math.sqrt(r*r-dy*dy+.3*r));g.px(cx-w,cy+dy,w*2+1,1,col)}}
function places_dome(g,cx,by,r,col,colD){for(let dy=0;dy<=r;dy++){const w=Math.round(Math.sqrt(r*r-dy*dy+.3*r));g.px(cx-w,by-dy,w*2+1,1,col);if(colD)g.px(cx+Math.ceil(w*.35),by-dy,Math.max(1,w-Math.ceil(w*.35)+1),1,colD)}}
// 뾰족 고깔(원뿔) 지붕: 꼭짓점 (cx,ty), 높이 h, 밑변 폭 w
function places_cone(g,cx,ty,h,w,col,colD){for(let i=0;i<h;i++){const ww=Math.max(1,Math.round(w*(i+1)/h));const x=cx-ww/2;g.px(x,ty+i,ww,1,col);if(colD&&ww>2)g.px(x+ww*.55,ty+i,ww*.45,1,colD)}}
// 끝이 뾰족한 고딕 아치 구멍
function places_parch(g,x,y,w,h,col){const a=Math.max(2,Math.ceil(w*.8));for(let i=0;i<a;i++){const ww=Math.max(1,Math.round(w*Math.sqrt((i+1)/a)));g.px(x+(w-ww)/2,y+i,ww,1,col)}if(h>a)g.px(x,y+a,w,h-a,col)}
// 둥근 아치 구멍
function places_rarch(g,x,y,w,h,col){const r=w/2;for(let i=0;i<Math.ceil(r);i++){const dy=r-i-.5;const ww=Math.max(1,Math.round(2*Math.sqrt(Math.max(0,r*r-dy*dy))));g.px(x+(w-ww)/2,y+i,ww,1,col)}g.px(x,y+Math.ceil(r),w,h-Math.ceil(r),col)}
// 돌 쌓기 결
function places_blocks(g,x,y,w,h,base,line,hi){g.px(x,y,w,h,base);for(let yy=y+3,r=0;yy<y+h;yy+=4,r++){g.px(x,yy,w,1,line);for(let xx=x+(r%2?3:0);xx<x+w;xx+=7)g.px(xx,yy-3,1,3,line)}
  if(hi)for(let i=0;i<w*h/60;i++)g.px(x+g.rnd()*w|0,y+g.rnd()*h|0,2,1,hi)}
// 벽돌 결
function places_bricks(g,x,y,w,h,base,line){g.px(x,y,w,h,base);for(let yy=y+2;yy<y+h;yy+=3)g.px(x,yy,w,1,line)}
// 철창 창문
function places_barred(g,x,y,w,h,inside){g.px(x-1,y-1,w+2,h+2,'#26262a');g.px(x,y,w,h,inside);for(let xx=x+1;xx<x+w;xx+=2)g.px(xx,y,1,h,'#101114');g.px(x,y+(h>>1),w,1,'#101114')}
function places_wheel(g,cx,cy,r,col,hub){for(let a=0;a<24;a++){const t=a/24*Math.PI*2;g.px(cx+Math.cos(t)*r,cy+Math.sin(t)*r,1,1,col)}
  for(let a=0;a<6;a++){const t=a/6*Math.PI;places_line(g,cx-Math.cos(t)*(r-1),cy-Math.sin(t)*(r-1),cx+Math.cos(t)*(r-1),cy+Math.sin(t)*(r-1),col)}g.px(cx-1,cy-1,2,2,hub||col)}
function places_glow(g,cx,cy,r,rgb,a){for(let i=r;i>0;i-=2){g.px(cx-i,cy-i*.7,i*2,i*1.4,`rgba(${rgb},${(a*(1-i/(r+1))).toFixed(3)})`)}}
function places_lantern(g,x,y){g.px(x,y-3,4,1,'#2a2a2e');g.px(x+1,y-4,2,1,'#2a2a2e');g.px(x,y-2,4,5,'#2a2a2e');g.px(x+1,y-1,2,3,PAL.glow);places_glow(g,x+2,y,10,'243,198,90',.22)}
function places_snowfall(g,n){for(let i=0;i<n;i++)g.px(g.rnd()*SW|0,g.rnd()*SH|0,1,1,g.rnd()<.5?PAL.snow:'#b9c3d4')}

/* ================= 감옥: 콩시에르주리 / 개조된 수도원 ================= */
function places_tower(g,cx,top,w){const x=cx-(w>>1);
  places_blocks(g,x,top,w,GY-top,'#4a4846','#333236','#55524e');
  g.px(x,top,2,GY-top,'#5d5a55');g.px(x+w-5,top,5,GY-top,'#2e2e32');g.px(x+w-2,top,2,GY-top,'#242429');
  // 돌출 처마(마치콜레이션)
  g.px(x-2,top-3,w+4,3,'#3d3c3c');for(let xx=x-1;xx<x+w+1;xx+=3)g.px(xx,top,1,2,'#1c1c20');
  // 원뿔 슬레이트 지붕 + 꼭대기 장식
  const h=Math.round(w*1.15);places_cone(g,cx,top-3-h,h,w+6,'#353c4c','#262b38');
  for(let i=4;i<h;i+=4)g.px(cx-((w+6)*i/h)/2+1,top-3-h+i,(w+6)*i/h-2,1,'#2b3140');
  g.px(cx,top-h-7,1,5,'#6a6e78');
  // 좁은 창(살창)
  for(let yy=top+8;yy<GY-14;yy+=13)places_barred(g,cx-2,yy,3,6,g.rnd()<.25?'#6a5428':'#141519')}
ART.prison=function(g){
  // 먼 도시 지붕 실루엣
  for(let x=0;x<SW;x+=9){const h=6+g.rnd()*10|0;g.px(x,52-h,9,h+4,'#161c2e')}
  // 본관: 두꺼운 중세 석벽 + 가파른 슬레이트 지붕
  places_blocks(g,74,30,136,GY-30,'#46443f','#32312f','#524f49');
  for(let i=0;i<14;i++)g.px(76-i*.0+i*.6,16+i,132-i*1.2+i*2.4-i*1.2,1,i%4===3?'#2b3140':'#333a4a');
  g.px(74,29,136,2,'#2a2a2c');
  for(const dx of [96,128,160,190]){g.px(dx,20,8,10,'#46443f');places_cone(g,dx+4,15,6,10,'#333a4a','#262b38');g.px(dx+2,23,4,5,'#141519');g.px(dx+3,23,1,5,'#2b2e36')}
  // 버팀벽
  for(const bx of [74,106,138,170,204]){g.px(bx,34,6,GY-34,'#3c3a36');g.px(bx,34,2,GY-34,'#4f4c46')}
  // 철창 창문 두 줄
  for(let x=84;x<200;x+=16){if(x>=104&&x<=110)continue;places_barred(g,x,40,6,8,g.rnd()<.18?'#7a6030':'#121318');places_barred(g,x,57,6,7,g.rnd()<.12?'#7a6030':'#121318')}
  // 세 개의 둥근 탑 (콩시에르주리식)
  places_tower(g,20,30,24);places_tower(g,62,34,22);places_tower(g,228,26,28);
  // 탑 사이 성벽과 철 징 박힌 성문
  places_blocks(g,32,44,20,GY-44,'#43413d','#302f2d');for(let x=32;x<52;x+=4)g.px(x,41,3,3,'#43413d');
  places_rarch(g,34,56,16,24,'#1a1a1d');places_rarch(g,35,57,14,23,'#3a2616');
  for(let x=36;x<49;x+=3)g.px(x,60,1,20,'#2a1a0f');g.px(35,64,14,1,'#1d1d22');g.px(35,72,14,1,'#1d1d22');
  for(let y=62;y<80;y+=4)for(let x=37;x<49;x+=4)g.px(x,y,1,1,'#8a8a90');
  g.px(41,66,2,3,'#0c0c0e');
  // 오른쪽 낮은 성벽(총안)
  places_blocks(g,242,48,14,GY-48,'#43413d','#302f2d');for(let x=242;x<256;x+=5)g.px(x,45,3,3,'#43413d');
  // 성문 쪽 등불 + 경비 초소 등불
  g.px(30,56,4,1,'#2a2a2e');places_lantern(g,26,59);
  g.px(196,48,6,1,'#2a2a2e');g.px(201,48,1,4,'#2a2a2e');places_lantern(g,199,55);
  // 경비 초소(줄무늬): 1789 이후 삼색, 그 전·왕정복고기에는 백·청
  const tri=g.t>=1789.5&&g.era!=='restoration'&&g.era!=='ancien';
  const bx=178;g.px(bx-1,58,14,2,'#20242e');places_cone(g,bx+6,52,6,16,'#2a2f3c','#20242e');
  const cols=tri?[PAL.blue,PAL.white,PAL.red]:[PAL.white,PAL.blue,PAL.white];
  for(let i=0;i<3;i++)g.px(bx+i*4,60,4,GY-60,cols[i]);
  g.px(bx+3,63,6,GY-63,'#14161c');g.px(bx,GY-1,12,1,'#202228');
  for(let i=0;i<3;i++)g.px(bx+i*4+3,60,1,GY-60,'rgba(0,0,0,.25)');
  // 음울한 안개
  g.px(0,64,SW,16,'rgba(26,30,44,.35)');g.px(0,72,SW,8,'rgba(26,30,44,.3)');
  artGround(g,'cobble');
  g.px(14,GY+1,40,3,'rgba(243,198,90,.08)');g.px(186,GY+1,30,3,'rgba(243,198,90,.08)')};

/* ================= 야영지: 혁명·나폴레옹 전쟁 ================= */
function places_tent(g,x,base,w,h,canvas,shade,snowy,lit){const d=Math.round(w*.7);
  for(let i=0;i<h;i++){const half=w/2*(i+1)/h;g.px(x+w/2+half-1,base-h+i,d+1,1,shade)}
  g.px(x+w/2,base-h,d,1,snowy?PAL.snow:'#d8d0b8');
  for(let i=0;i<h;i++){const half=w/2*(i+1)/h;g.px(x+w/2-half,base-h+i,half*2,1,canvas)}
  const dh=Math.round(h*.6);for(let i=0;i<dh;i++){const half=w*.18*(i+1)/dh;g.px(x+w/2-half,base-dh+i,half*2+1,1,lit?'#8a5a24':'#1d1a18')}
  g.px(x+w/2,base-h-2,1,2,'#3e2a1a');
  if(snowy){for(let i=0;i<h;i+=1){const half=w/2*(i+1)/h;if(i<h*.5)g.px(x+w/2-half,base-h+i,2,1,PAL.snow)}g.px(x-1,base-1,w+d+2,1,PAL.snow)}}
function places_muskets(g,cx,steel){const ay=63;for(const bx of [-7,-3,2,6]){places_line(g,cx,ay,cx+bx,GY-1,'#5a3e28');g.px(cx+bx-(bx<0?1:0),GY-2,2,2,'#3e2a1a')}
  places_line(g,cx-3,57,cx,ay,steel);places_line(g,cx+3,57,cx,ay,steel);g.px(cx,56,1,7,steel);g.px(cx-1,ay+1,3,2,'#6a6e78')}
function places_cannon(g,cx,snowy){const car='#47552f';
  places_line(g,cx-2,72,cx-20,GY-1,car,2);g.px(cx-22,GY-2,4,2,car);
  places_line(g,cx-6,69,cx+14,64,'#7a5e30',3);g.px(cx+14,63,2,4,'#5e4824');g.px(cx-8,69,3,3,'#5e4824');
  places_line(g,cx-6,68,cx+12,63,'#a07c42');
  places_wheel(g,cx,73,6,'#3a2a18',PAL.glowD);g.px(cx+18,GY-1,1,1,'#222');
  if(snowy){g.px(cx-6,62,18,1,PAL.snow);g.px(cx-8,GY-3,30,3,PAL.snow)}
  // 포탄 무더기
  g.px(cx+12,GY-3,3,3,'#22252c');g.px(cx+15,GY-3,3,3,'#22252c');g.px(cx+13,GY-6,3,3,'#2a2e36')}
function places_fire(g,cx,dying){places_glow(g,cx,GY-4,dying?10:22,'243,150,60',dying?.18:.3);
  places_line(g,cx-6,GY-1,cx+5,GY-4,'#3e2a1a',2);places_line(g,cx-5,GY-4,cx+6,GY-1,'#4e3420',2);
  if(dying){g.px(cx-1,GY-4,3,2,PAL.red);for(let i=0;i<8;i++)g.px(cx+Math.sin(i)*2+i*.6,GY-8-i*3,2,2,'rgba(150,160,180,.35)');return}
  const fl=[[9,PAL.red],[7,'#e07a2a'],[5,PAL.glow],[2,'#fff2c0']];
  for(const [h,c] of fl){for(let i=0;i<h;i++){const w=Math.max(1,Math.round((h-i)*.6));g.px(cx-w/2+(i%2),GY-3-i,w,1,c)}}
  for(let i=0;i<10;i++)g.px(cx-5+g.rnd()*10,GY-14-g.rnd()*22,1,1,g.rnd()<.5?PAL.glow:'#e07a2a');
  // 쇠솥
  g.px(cx-6,GY-17,1,14,'#2a2a2e');g.px(cx+6,GY-17,1,14,'#2a2a2e');g.px(cx-6,GY-17,13,1,'#2a2a2e');g.px(cx-2,GY-13,5,4,'#1c1c20')}
function places_wagon(g,x,broken,snowy){const wood='#4e3622';
  if(broken){places_line(g,x,66,x+34,72,wood,4);places_line(g,x+2,62,x+30,68,'#9a927c',4);
    places_wheel(g,x+28,74,6,'#3a2a18');g.px(x-2,GY-2,14,2,'#3a2a18');places_line(g,x+34,72,x+46,GY-1,wood);
    if(snowy){places_line(g,x+2,60,x+30,66,PAL.snow,2);g.px(x-4,GY-3,52,3,PAL.snow)}return}
  g.px(x,62,36,9,wood);g.px(x,62,36,1,'#6a4a2e');for(let xx=x+6;xx<x+36;xx+=8)g.px(xx,62,1,9,'#3e2a1a');
  for(let i=0;i<10;i++){const w=Math.round(Math.sqrt(100-(10-i)*(10-i)*.85)*1.8);g.px(x+2+(16-w/2*1)-0+0,52+i,32,1,i<1?'#b8b09a':'#c8bfa4')}
  for(let xx=x+6;xx<x+34;xx+=7)g.px(xx,53,1,9,'#a8a088');
  places_wheel(g,x+7,73,6,'#3a2a18');places_wheel(g,x+29,73,6,'#3a2a18');places_line(g,x+36,68,x+48,74,wood)}
function places_eagle(g,x,y){const G=PAL.gold,D=PAL.glowD;
  g.px(x-2,y-1,5,1,D);g.px(x-1,y-2,3,1,G);
  g.px(x-1,y-6,3,4,G);g.px(x,y-8,1,2,G);g.px(x+1,y-8,1,1,D);
  g.px(x-4,y-7,3,1,G);g.px(x-4,y-6,2,2,G);g.px(x+2,y-7,3,1,G);g.px(x+3,y-6,2,2,G)}
function places_standard(g,x,y){g.px(x,y+16,1,GY-y-16,'#9aa3b5');g.flag(x,y);
  if(g.era==='empire'||g.era==='empire2'){g.px(x,y-2,1,2,'#9aa3b5');places_eagle(g,x,y-2)}
  else{g.px(x,y-3,1,3,'#c8ccd4');g.px(x-1,y-2,3,1,'#c8ccd4')}}
ART.camp=function(g){
  const russia=g.t>=1812.7&&g.t<1813.1;
  // 먼 언덕
  for(let x=0;x<SW;x++){const h=Math.round(8+Math.sin(x*.035)*4+Math.sin(x*.11)*2);g.px(x,58-h,1,h+4,russia?'#7c8698':'#18242a')}
  if(russia){
    // 얼어붙은 러시아 벌판: 자작나무·전나무, 눈보라, 버려진 장비
    for(let i=0;i<12;i++){const x=g.rnd()*SW|0;if(x>84&&x<172)continue;const h=10+g.rnd()*10|0;
      if(g.rnd()<.5){for(let j=0;j<h;j++){const w=Math.round((j+1)*.45);g.px(x-w,60-h+j,w*2+1,1,'#1e2a28')}g.px(x-3,60-h+3,7,1,PAL.snow)}
      else{g.px(x,60-h,1,h,'#c8ccd0');for(let j=0;j<3;j++)places_line(g,x,60-h+3+j*3,x+(j%2?3:-3),60-h+j*3,'#6a6a6a')}}
    g.px(0,58,SW,GY-58,'#c8d0dc');for(let i=0;i<40;i++)g.px(g.rnd()*SW|0,58+g.rnd()*22|0,4,1,'#e3e9f2');
    for(const [x,b] of [[18,68],[200,70],[232,66]])places_tent(g,x,b,14,10,'#a8a290','#7a7462',true);
    places_wagon(g,20,true,true);
    places_cannon(g,214,true);
    places_fire(g,72,true);
    places_line(g,184,GY-1,180,62,'#5a3e28');places_line(g,186,GY-1,192,64,'#5a3e28');g.px(176,GY-3,22,3,PAL.snow);
    places_standard(g,190,40);
    g.px(0,GY,SW,SH-GY,'#d4dbe6');g.px(0,GY,SW,1,PAL.snow);for(let i=0;i<50;i++)g.px(g.rnd()*SW|0,GY+1+(g.rnd()*(SH-GY-2)|0),3,1,'#b9c3d4');
    for(let i=0;i<12;i++){const x=g.rnd()*SW|0;g.px(x,GY+2+(g.rnd()*10|0),2,1,'#5a3e28')}
    g.px(0,0,SW,SH,'rgba(200,210,230,.08)');places_snowfall(g,140);return}
  // 멀리 늘어선 천막과 모닥불
  for(let x=-4;x<SW;x+=19){places_tent(g,x,64,10,7,'#9a9480','#6e6a5c',g.winter);if(g.rnd()<.35)g.px(x+5,62,1,1,PAL.glow)}
  // 중간 줄 천막
  for(const x of [2,30,184,214,240])places_tent(g,x,72,16,12,'#c8bfa4','#8e8774',g.winter,g.rnd()<.4);
  places_wagon(g,6,false,g.winter);
  places_fire(g,72,false);
  places_muskets(g,56,'#c8ccd4');places_muskets(g,186,'#c8ccd4');
  places_cannon(g,220,false);
  places_standard(g,176,38);
  artGround(g,'dirt');
  places_glow(g,72,GY+2,12,'243,150,60',.12)};

/* ================= 교회: 고딕 성당 / 수도원 ================= */
ART.church=function(g){
  const S='#625d54',SD='#4a4640',SL='#7a7468',L='#1c1d24';
  const temple=g.t>=1793.8&&g.t<1795;
  // 먼 마을 지붕
  for(let x=0;x<SW;x+=11){const h=4+g.rnd()*8|0;g.px(x,54-h,11,h+4,'#161c2e')}
  // 왼쪽: 수도원 건물 + 회랑 아케이드
  places_blocks(g,0,36,62,GY-36,'#56524a','#45423c');
  for(let i=0;i<10;i++)g.px(0,26+i,62-i*0+(i>8?0:0),1,i%3===2?'#2b3140':'#333a4a');
  for(let x=4;x<60;x+=10){g.px(x,40,4,6,g.rnd()<.35?PAL.glowD:'#1d2030');g.px(x,40,4,1,SD)}
  g.px(0,52,62,4,'#333a4a');g.px(0,55,62,1,'#262b38');
  for(let x=2;x<58;x+=9){places_parch(g,x,58,7,GY-58,'#14161c');g.px(x+7,58,2,GY-58,SL)}
  g.px(0,GY-2,62,2,SD);
  // 신랑(본당): 고창층 벽 + 가파른 지붕
  places_blocks(g,62,30,118,GY-30,S,SD);
  for(let i=0;i<12;i++)g.px(62,18+i,118,1,i%3===2?'#2b3140':'#353c4c');g.px(62,18,118,1,'#4a5266');
  const glass=['#c8902e','#b8323a','#3d5fb8','#d8a84a'];
  for(let x=70,k=0;x<174;x+=28,k++){places_parch(g,x+6,33,6,16,L);places_parch(g,x+7,34,4,14,glass[k%4]);g.px(x+9,36,1,12,L);g.px(x+7,42,4,1,L)}
  // 측랑 지붕
  g.px(62,50,118,4,'#333a4a');g.px(62,53,118,1,'#262b38');
  for(let x=72;x<176;x+=28){places_parch(g,x+5,57,5,13,L);places_parch(g,x+6,58,3,11,glass[(x/28|0)%4])}
  // 플라잉 버트레스: 버팀벽 + 첨탑 + 날개 아치
  for(const px of [66,94,122,150]){
    g.px(px,40,5,GY-40,SL);g.px(px+3,40,2,GY-40,SD);
    places_cone(g,px+2,32,8,5,SL,SD);g.px(px+2,30,1,2,SL);
    for(let s=0;s<=10;s++){const t=s/10;const x=px+5+t*14,y=44-t*9-Math.sin(t*Math.PI)*3;g.px(x,y,1,2,SL);g.px(x,y+2,1,1,SD)}}
  // 서쪽 정면 + 종탑
  places_blocks(g,180,24,64,GY-24,S,SD,SL);
  g.px(180,24,5,GY-24,SL);g.px(239,24,5,GY-24,SD);
  places_cone(g,182,16,8,5,SL,SD);places_cone(g,241,16,8,5,SL,SD);
  // 장미창 (빛남)
  places_glow(g,212,38,16,'243,198,90',.25);
  places_disc(g,212,38,9,SD);places_disc(g,212,38,8,'#c8902e');places_disc(g,212,38,5,'#e8b84a');places_disc(g,212,38,2,PAL.red);
  for(let a=0;a<12;a++){const t=a/12*Math.PI*2;places_line(g,212+Math.cos(t)*2,38+Math.sin(t)*2,212+Math.cos(t)*8,38+Math.sin(t)*8,SD)}
  for(let a=0;a<12;a+=2){const t=(a+.5)/12*Math.PI*2;g.px(212+Math.cos(t)*6,38+Math.sin(t)*6,1,1,'#3d5fb8')}
  // 종탑 (정면 위)
  places_blocks(g,200,6,24,18,S,SD);g.px(200,6,3,18,SL);g.px(221,6,3,18,SD);
  places_parch(g,204,9,5,12,L);places_parch(g,215,9,5,12,L);for(let y=12;y<21;y+=2){g.px(204,y,5,1,'#3a2a1c');g.px(215,y,5,1,'#3a2a1c')}
  g.px(198,5,28,2,SL);for(let x=198;x<226;x+=3)g.px(x,3,2,2,SL);
  // 탑 꼭대기: 십자가 / 이성의 신전 시기엔 삼색기
  if(temple){g.flag(212,0);g.px(211,0,3,1,PAL.gold);
    // 정문 위 '이성의 신전' 현판
    g.px(196,52,32,4,'#c8c0aa');for(let x=198;x<226;x+=2)g.px(x,53,1,2,'#3a3530')}
  else{g.px(211,-1,2,7,PAL.gold);g.px(209,1,6,1,PAL.gold)}
  // 정문: 뾰족 아치 + 아치볼트 + 나무문
  places_parch(g,200,56,24,GY-56,SL);places_parch(g,202,58,20,GY-58,S);places_parch(g,204,60,16,GY-60,SD);
  places_parch(g,206,62,12,GY-62,'#3a2616');g.px(211,68,2,GY-68,'#24180e');
  for(let y=70;y<GY;y+=4){g.px(207,y,4,1,'#1e1e22');g.px(213,y,4,1,'#1e1e22')}
  for(const sx of [186,230]){places_parch(g,sx-2,62,10,GY-62,SD);places_parch(g,sx,64,6,GY-64,'#2e1f12')}
  // 옆 벽감 창
  places_parch(g,186,36,6,14,L);places_parch(g,187,37,4,12,'#9a6a2a');places_parch(g,232,36,6,14,L);places_parch(g,233,37,4,12,'#9a6a2a');
  artGround(g,'cobble');
  g.px(200,GY+1,24,2,'rgba(243,198,90,.07)')};

/* ================= 망명지 ================= */
function places_london(g){
  // 템스 강 건너편 벽돌 집과 첨탑들
  for(let x=0;x<SW;){const w=8+g.rnd()*8|0,h=10+g.rnd()*12|0;g.px(x,58-h,w,h,g.rnd()<.5?'#3e2622':'#33201e');g.px(x,58-h-2,w,2,'#262b38');
    for(let wy=58-h+3;wy<56;wy+=5)for(let wx=x+2;wx<x+w-2;wx+=4)if(g.rnd()<.4)g.px(wx,wy,1,2,PAL.glow);x+=w}
  for(const sx of [40,112,150]){g.px(sx,30,4,22,'#4a4842');places_cone(g,sx+2,20,10,4,'#4a4842','#38362f');g.px(sx+1,36,2,3,'#1c1d24')}
  // 세인트 폴 대성당
  const cx=196,P='#7a7670',PD='#5a5752',PL='#8e8a82';
  g.px(170,40,52,18,P);g.px(170,40,52,2,PL);for(let x=172;x<220;x+=4)g.px(x,46,1,12,PD);g.px(184,42,24,3,PL);places_cone(g,196,36,6,26,PL,P);
  for(const tx of [170,212]){g.px(tx,24,10,16,P);g.px(tx+7,24,3,16,PD);places_parch(g,tx+3,28,4,8,'#1c1d24');places_dome(g,tx+5,24,4,PL,PD);g.px(tx+5,17,1,3,PL)}
  g.px(184,26,24,14,P);for(let x=185;x<207;x+=3)g.px(x,28,1,12,PD);g.px(183,25,26,2,PL);
  places_dome(g,cx,25,13,PL,PD);for(let a=-2;a<=2;a++)places_line(g,cx+a*4,24,cx+a*2,13,P);
  g.px(cx-2,6,5,7,PL);g.px(cx+1,6,2,7,PD);places_cone(g,cx,3,3,5,PL,PD);g.px(cx-1,0,3,2,PAL.gold);g.px(cx,-1,1,1,PAL.gold);
  // 템스 강과 반사광
  g.px(0,58,SW,16,PAL.water);for(let i=0;i<40;i++)g.px(g.rnd()*SW|0,59+g.rnd()*14|0,3+g.rnd()*4|0,1,g.rnd()<.3?'rgba(243,198,90,.5)':PAL.waterL);
  // 아치 돌다리
  g.px(0,48,118,6,'#55524c');g.px(0,46,118,2,'#6a665e');for(let x=0;x<118;x+=3)g.px(x,44,1,2,'#6a665e');
  for(let x=4;x<118;x+=20){g.px(x-4,54,24,12,'#55524c');places_rarch(g,x,54,16,12,PAL.water);g.px(x-4,54,4,12,'#4a4740')}
  for(const lx of [20,60,100]){g.px(lx,38,1,6,'#2a2a2e');g.px(lx-1,36,3,3,PAL.glow)}
  // 거룻배
  g.px(130,66,16,3,'#2a1e14');g.px(131,65,14,1,'#3e2a1a');g.px(140,58,1,8,'#3e2a1a');
  // 가까운 강둑 조지 양식 벽돌집
  places_bricks(g,226,22,30,58,'#5a3228','#4a2a22');g.px(226,20,30,3,'#2b3140');g.px(228,14,4,7,'#3e2622');g.px(240,14,4,7,'#3e2622');
  for(let y=28;y<70;y+=12)for(let x=230;x<254;x+=9){g.px(x-1,y-1,6,9,'#c8c0aa');g.px(x,y,4,7,g.win());g.px(x,y+3,4,1,'#c8c0aa');g.px(x+2,y,1,7,'#c8c0aa')}
  g.px(229,70,8,10,'#1e2a22');g.px(229,68,8,2,'#c8c0aa');
  g.px(0,72,SW,8,'#3a3832');g.px(0,72,SW,1,'#55524c');
  // 런던 안개
  g.px(0,50,SW,10,'rgba(150,160,170,.12)');g.px(0,64,SW,10,'rgba(150,160,170,.1)');
  artGround(g,'cobble')}
function places_timber(g,x,w,h,col){const top=GY-h;g.px(x,top,w,h,col);const B='#2e2016';
  g.px(x,top,1,h,B);g.px(x+w-1,top,1,h,B);for(let y=top;y<GY;y+=10){g.px(x,y,w,1,B)}
  for(let y=top;y+10<=GY;y+=10){places_line(g,x+1,y+9,x+5,y+1,B);places_line(g,x+w-2,y+9,x+w-6,y+1,B);
    for(let wx=x+7;wx<x+w-8;wx+=6){g.px(wx,y+3,4,5,B);g.px(wx+1,y+4,2,3,g.win())}}
  // 박공(삼각 지붕면)
  const gh=Math.round(w*.75);for(let i=0;i<gh;i++){const ww=Math.max(1,Math.round(w*(i+1)/gh));g.px(x+(w-ww)/2,top-gh+i,ww,1,col)}
  for(let i=0;i<gh;i++){const ww=Math.round(w*(i+1)/gh);g.px(x+(w-ww)/2-1,top-gh+i,2,1,'#2b3140');g.px(x+(w+ww)/2-1,top-gh+i,2,1,'#2b3140')}
  g.px(x+w/2,top-gh+3,1,gh-3,B);g.px(x+w/2-1,top-gh*.45,3,3,g.win());g.px(x-1,top,w+2,1,'#24180e')}
function places_koblenz(g){
  // 에렌브라이트슈타인 요새 언덕 (라인 강 건너편)
  for(let x=96;x<SW;x++){const t=(x-96)/160;const top=Math.round(t<.35?58-t/.35*34:24+Math.sin(x*.2)*1);g.px(x,top,1,60-top,'#1c2620');if(g.rnd()<.4)g.px(x,top+3+g.rnd()*20|0,1,3,'#3a3a36')}
  const F='#5e5a50',FD='#46433c';
  g.px(150,14,106,10,F);g.px(150,14,106,1,'#726d61');for(let x=152;x<256;x+=5)g.px(x,11,3,3,F);
  for(const bx of [146,196,236]){g.px(bx,16,10,10,FD);g.px(bx+1,14,8,2,F)}
  g.px(170,6,50,8,F);g.px(170,4,50,2,'#333a4a');for(let x=174;x<218;x+=6)g.px(x,8,2,3,g.rnd()<.35?PAL.glow:'#1c1d24');
  for(let x=154;x<254;x+=7)g.px(x,18,2,2,g.rnd()<.2?PAL.glow:'#1c1d24');
  // 라인 강 + 배다리
  g.px(0,58,SW,16,PAL.water);for(let i=0;i<34;i++)g.px(g.rnd()*SW|0,59+g.rnd()*14|0,4,1,g.rnd()<.25?'rgba(243,198,90,.45)':PAL.waterL);
  for(let x=86;x<214;x+=10){g.px(x,64,8,3,'#2e2016');g.px(x+1,67,6,1,'#1e1610')}g.px(86,62,128,2,'#5a3e28');
  for(let x=90;x<214;x+=16)g.px(x,58,1,4,'#3e2a1a');
  // 성모 교회 양파 쌍탑
  for(const tx of [52,64]){g.px(tx,22,8,30,'#6a6458');g.px(tx+5,22,3,30,'#524d44');places_disc(g,tx+4,18,4,'#3a4a44');g.px(tx+3,10,2,5,'#3a4a44');g.px(tx+4,6,1,4,PAL.gold);places_parch(g,tx+2,30,4,8,'#1c1d24')}
  // 목조 골조 집들
  places_timber(g,0,22,42,'#8c8068');places_timber(g,22,20,36,'#9a8c70');places_timber(g,42,24,30,'#857a64');places_timber(g,66,20,38,'#958870');
  places_timber(g,214,22,40,'#8c8068');places_timber(g,236,20,34,'#9a8c70');
  g.px(0,72,SW,8,'#363430');g.px(0,72,SW,1,'#4e4b44');
  artGround(g,'cobble')}
function places_south(g){
  // 사이프러스 언덕
  for(let x=0;x<SW;x++){const h=Math.round(14+Math.sin(x*.03+1)*6+Math.sin(x*.09)*2);g.px(x,56-h,1,h+4,'#1e2820')}
  for(let i=0;i<14;i++){const x=g.rnd()*SW|0,h=8+g.rnd()*6|0,b=50-(g.rnd()*8|0);for(let j=0;j<h;j++){const w=j<2?1:j<h-2?2:1;g.px(x-w/2,b-h+j,w+1,1,'#142018')}}
  const W=['#8a6e4c','#7c6446','#94784e','#86704e'],R='#8a4a36',RL='#a45a3e';
  // 큰 돔 성당 (납빛 돔, 랜턴)
  const dx=56;g.px(30,40,52,28,'#8c7656');g.px(30,40,52,2,'#a08a66');for(let x=34;x<80;x+=6)g.px(x,44,2,22,'#6e5c42');
  g.px(44,28,24,12,'#8c7656');for(let x=46;x<66;x+=4)g.px(x,30,1,10,'#6e5c42');places_dome(g,dx,28,14,'#5a6070','#454a58');
  for(let a=-2;a<=2;a++)places_line(g,dx+a*5,27,dx+a*2,15,'#6a7080');
  g.px(dx-2,8,5,6,'#8c7656');places_dome(g,dx,8,3,'#5a6070');g.px(dx,2,1,3,PAL.gold);g.px(dx-1,3,3,1,PAL.gold);
  // 종탑(캄파닐레)
  g.px(208,10,14,58,'#7a5a40');g.px(218,10,4,58,'#5e4430');for(let y=18;y<60;y+=10)g.px(208,y,14,1,'#5e4430');
  places_rarch(g,210,12,4,8,'#1c1d24');places_rarch(g,216,12,4,8,'#1c1d24');g.px(206,9,18,2,'#94784e');places_cone(g,215,2,7,18,R,'#6e3a2a');
  // 테라코타 지붕 집들
  const houses=[[0,26],[84,22],[106,30],[136,24],[160,28],[186,20],[226,30]];
  for(const [x,h] of houses){const w=x===0?30:22,c=W[(x/7|0)%4],top=64-h;g.px(x,top,w,h+4,c);
    for(let i=0;i<4;i++)g.px(x-2+i,top-4+i,w+4-i*2,1,i%2?R:RL);g.px(x-2,top,w+4,1,'#5e3226');
    for(let wy=top+4;wy<62;wy+=8)for(let wx=x+3;wx<x+w-3;wx+=7){g.px(wx,wy,3,5,g.win());g.px(wx-1,wy,1,5,'#4a5a3a');g.px(wx+3,wy,1,5,'#4a5a3a')}}
  // 아케이드(로지아)
  g.px(226,64,30,16,'#8c7656');for(let x=228;x<256;x+=8)places_rarch(g,x,66,6,14,'#2a2420');
  g.px(0,64,30,16,'#7c6446');for(let x=2;x<28;x+=8)places_rarch(g,x,67,6,13,'#2a2420');
  artGround(g,'dirt')}
function places_north(g){
  // 동판 첨탑 교회 (함부르크 성 미카엘 식)
  g.px(196,20,18,40,'#4e3a2c');g.px(196,20,3,40,'#5e4634');places_rarch(g,201,24,8,12,'#1c1d24');
  g.px(198,12,14,8,'#3e6a5a');places_dome(g,205,12,6,'#3e6a5a','#2e5446');g.px(203,2,5,6,'#4a7a68');places_cone(g,205,-4,6,4,'#4a7a68');
  places_disc(g,205,30,0,PAL.glow);g.px(203,40,5,5,PAL.glowD);
  // 계단식 박공 상인 집들
  const C=['#5a3228','#4e3a2c','#6a4a30','#7e786c','#5c2e26'];let x=0;
  while(x<SW){const w=18+(g.rnd()*6|0),top=26+(g.rnd()*12|0),c=C[g.rnd()*C.length|0];
    if(x>=190&&x<214){x=214;continue}
    g.px(x,top,w,64-top,c);
    const steps=4;for(let s=0;s<steps;s++){const sw=Math.max(4,w-s*2*Math.floor(w/9));g.px(x+(w-sw)/2,top-(s+1)*3,sw,3,c);g.px(x+(w-sw)/2,top-(s+1)*3,sw,1,'#2a2a30')}
    g.px(x+w/2-1,top-steps*3-2,2,2,c);
    g.px(x+w/2-1,top-6,2,2,'#1c1d24');g.px(x+w/2,top-9,1,2,'#3e2a1a');
    for(let wy=top+3;wy<60;wy+=7)for(let wx=x+3;wx<x+w-3;wx+=5){g.px(wx,wy,3,4,g.win());g.px(wx,wy+2,3,1,'#c8c0aa')}
    g.px(x+w-1,top-12,1,52+12-top+top-26+26,'rgba(0,0,0,.25)');x+=w+1}
  // 운하
  g.px(0,64,SW,10,PAL.water);for(let i=0;i<34;i++)g.px(g.rnd()*SW|0,65+g.rnd()*8|0,3,1,g.rnd()<.35?'rgba(243,198,90,.5)':PAL.waterL);
  g.px(36,68,26,3,'#2a1e14');g.px(38,67,22,1,'#3e2a1a');g.px(48,48,1,19,'#3e2a1a');g.px(42,52,6,10,'#8e8670');
  g.px(0,74,SW,6,'#3a3832');g.px(0,74,SW,1,'#55524c');for(let x=4;x<SW;x+=24)g.px(x,71,2,3,'#2a2a2e');
  artGround(g,'cobble')}
ART.abroad=function(g){const p=g.place||'';
  if(p.includes('런던'))places_london(g);
  else if(p.includes('코블렌츠'))places_koblenz(g);
  else if(p.includes('토리노')||p.includes('로마')||p.includes('에스파냐'))places_south(g);
  else places_north(g);
  if(g.winter)for(let i=0;i<50;i++)g.px(g.rnd()*SW|0,g.rnd()*GY|0,1,1,PAL.snow)};
