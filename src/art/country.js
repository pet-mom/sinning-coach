/* ================= 시골 장면: 마을 · 성 · 숲 (18~19세기 프랑스 농촌) =================
   모든 보조 함수는 country_ 접두사. 인물은 x≈90~170, y=GY에 서므로 그 앞쪽은 비워 둔다. */

/* ---------- 기본 도형 ---------- */
function country_blob(g,cx,cy,rx,ry,col){for(let dy=-ry;dy<=ry;dy++){const k=1-(dy*dy)/(ry*ry+.01);if(k<=0)continue;const w=Math.round(rx*Math.sqrt(k));g.px(cx-w,cy+dy,w*2+1,1,col)}}
// 꼭짓점이 위인 계단식 삼각형(지붕·첨탑)
function country_tri(g,cx,top,halfw,h,col){for(let i=0;i<h;i++){const w=Math.round(halfw*(i+1)/h);g.px(cx-w,top+i,w*2+1,1,col)}}
// 언덕 실루엣: 사인 합으로 매 열의 높이를 정하고 그 아래를 칠한다
function country_hills(g,base,amp,col,ph,f1,f2){for(let x=0;x<SW;x++){const y=Math.round(base-amp*(.6*Math.sin(x*f1+ph)+.4*Math.sin(x*f2+ph*2.3)));g.px(x,y,1,GY-y,col)}}
function country_hillY(base,amp,ph,f1,f2,x){return Math.round(base-amp*(.6*Math.sin(x*f1+ph)+.4*Math.sin(x*f2+ph*2.3)))}
function country_line(g,x0,y0,x1,y1,col){const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0))||1;for(let i=0;i<=n;i++)g.px(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n,1,1,col)}
function country_smoke(g,x,y){if(g.season===1&&g.rnd()<.5)return;let sx=x;for(let i=0;i<6;i++){sx+=(i%2?1:0)+(g.rnd()<.3?1:0);g.px(sx,y-2-i*2,i>2?2:1,1,i<3?'#8d93a3':'#5f6678')}}
function country_isNorth(loc){return ['paris','ile','rouen','normandie','picardie','champagne','nantes','bretagne','vendee','alsace','lyon'].includes(loc)}
function country_fieldCol(g){return g.winter?'#aab4c4':['#2f5230','#6e6432','#4e3d2a'][g.season]}

/* ---------- 나무 ---------- */
function country_tree(g,x,base,r,col,colD){g.px(x-1,base-r-2,2,r+2,PAL.woodD);
  if(g.winter){country_line(g,x,base-r,x-r+1,base-2*r,'#3a3028');country_line(g,x,base-r,x+r-1,base-2*r+1,'#3a3028');country_line(g,x,base-r-2,x,base-2*r-2,'#3a3028');g.px(x-r+1,base-2*r,2,1,PAL.snow);g.px(x+r-2,base-2*r+1,2,1,PAL.snow);return}
  country_blob(g,x,base-r-3,r,Math.max(2,r-1),colD);country_blob(g,x-1,base-r-4,r-1,Math.max(2,r-2),col)}
function country_poplar(g,x,base,h){g.px(x,base-3,1,3,PAL.woodD);
  if(g.winter){for(let i=3;i<h;i++)g.px(x,base-i,1,1,'#3a3028');for(let i=4;i<h-2;i+=2){g.px(x-1,base-i,1,1,'#3a3028');g.px(x+1,base-i-1,1,1,'#3a3028')}return}
  const c=g.season===2?'#5a5a2a':'#1f3a24';for(let i=3;i<h;i++){const w=i<h*.25||i>h-3?1:2;g.px(x-w+1,base-i,w*2-1+(i%3===0?1:0),1,c)}}
function country_cypress(g,x,base,h){g.px(x,base-2,1,2,PAL.woodD);for(let i=2;i<h;i++){const k=(i-2)/(h-2);const w=k<.15?2:k>.85?0:k>.6?1:2;g.px(x-w,base-i,w*2+1,1,i%4?'#173024':'#1d3a2c')}g.px(x,base-h,1,1,'#173024')}
function country_olive(g,x,base){g.px(x-1,base-5,2,5,'#4a3a2a');g.px(x+1,base-7,1,3,'#4a3a2a');
  const c=g.winter?'#4c5a52':'#4a5a44';country_blob(g,x-2,base-9,4,2,c);country_blob(g,x+3,base-10,4,2,'#57684f');if(g.winter)g.px(x-4,base-11,6,1,PAL.snow)}

/* ---------- 건물 ---------- */
// 시골집: 돌벽 + 초가(북·서) 또는 기와(남) 지붕, 작은 창, 굴뚝 연기
function country_cottage(g,x,w,h,thatch){const by=GY-h;const wall=g.rnd()<.5?PAL.stoneD:'#7a705e';
  g.px(x,by,w,h,wall);for(let i=0;i<w*h/10;i++)g.px(x+(g.rnd()*(w-1)|0),by+(g.rnd()*(h-1)|0),2,1,'#5c5548');
  const rh=thatch?Math.round(w*.55):Math.round(w*.32);const rc=thatch?PAL.thatchD:'#6e3a2c',rl=thatch?'#8a7244':'#7e4634';
  for(let i=0;i<rh;i++){const k=(i+1)/rh;const ww=Math.round((w/2+2)*k);g.px(x+w/2-ww,by-rh+i,ww*2,1,i%3?rc:rl)}
  if(thatch)g.px(x-2,by-1,w+4,2,PAL.thatchD);else g.px(x-1,by-1,w+2,1,'#5a2e24');
  g.snow(x+w/2-3,by-rh,6);if(g.winter)for(let i=0;i<rh;i+=2){const ww=Math.round((w/2+2)*(i+1)/rh);g.px(x+w/2-ww,by-rh+i,1,1,PAL.snow);g.px(x+w/2+ww-1,by-rh+i,1,1,PAL.snow)}
  const cx=x+w-5;g.px(cx,by-rh+1,3,Math.round(rh*.7),PAL.stoneD);g.px(cx-1,by-rh,5,1,PAL.stone);country_smoke(g,cx+1,by-rh);
  g.px(x+3,GY-8,4,8,PAL.woodD);g.px(x+3,GY-8,4,1,PAL.stoneL);
  const wc=g.win();g.px(x+w-10,by+3,4,3,'#2a2a2a');g.px(x+w-9,by+3,2,3,wc);g.px(x+w-10,by+4,4,1,'#2a2a2a');
  if(wc===PAL.glow)g.px(x+w-10,by+7,4,1,'rgba(243,198,90,.25)');
  return by-rh}
// 성당: 로마네스크 본당 + 고딕 첨탑 종탑 + 십자가
function country_church(g,x,flag){const nb=54;g.px(x+10,nb,36,GY-nb,PAL.stone);g.px(x+10,nb,36,1,PAL.stoneL);
  for(let i=0;i<10;i++){const w=Math.round(19*(i+1)/10);g.px(x+28-w,nb-10+i,w*2,1,i%2?PAL.slate:PAL.slateD)}g.snow(x+20,nb-10,16);
  // 부벽
  for(const bx of [x+18,x+28,x+38]){g.px(bx,nb+4,2,GY-nb-4,PAL.stoneD);g.px(bx-1,GY-6,4,6,PAL.stoneD)}
  // 반원 아치 창 (가끔 미사 불빛)
  for(const wx of [x+22,x+32,x+42]){const c=g.rnd()<.35?PAL.glowD:'#2a3048';g.px(wx,nb+6,3,9,c);g.px(wx+1,nb+5,1,1,c)}
  // 후진(apse)
  g.px(x+46,nb+8,6,GY-nb-8,PAL.stoneD);for(let i=0;i<4;i++)g.px(x+46,nb+4+i,6-i,1,PAL.slateD);
  // 종탑
  const tx=x,tw=12,tt=28;g.px(tx,tt,tw,GY-tt,PAL.stoneL);g.px(tx+tw-2,tt,2,GY-tt,PAL.stone);
  for(let y=tt+6;y<GY;y+=7)g.px(tx,y,tw,1,PAL.stone);
  g.px(tx-1,tt,tw+2,2,PAL.stoneD);
  // 종루 아치 + 종
  g.px(tx+2,tt+4,3,6,'#141826');g.px(tx+7,tt+4,3,6,'#141826');g.px(tx+3,tt+4,1,1,'#141826');g.px(tx+3,tt+7,1,2,PAL.gold);g.px(tx+8,tt+7,1,2,PAL.gold);
  // 문: 로마네스크 아치 포탈
  g.px(tx+3,GY-10,6,10,PAL.woodD);g.px(tx+4,GY-11,4,1,PAL.woodD);g.px(tx+2,GY-12,8,1,PAL.stoneD);
  // 팔각 첨탑
  for(let i=0;i<18;i++){const w=Math.round(6*(i+1)/18);g.px(tx+6-w,tt-18+i,w*2,1,i%3?PAL.slate:PAL.slateD)}
  if(g.winter)for(let i=2;i<18;i+=3){const w=Math.round(6*(i+1)/18);g.px(tx+6-w,tt-18+i,1,1,PAL.snow)}
  // 십자가 + 수탉
  g.px(tx+5,tt-25,1,7,PAL.gold);g.px(tx+3,tt-23,5,1,PAL.gold);
  // 시계
  g.px(tx+4,tt+13,4,4,PAL.white);g.px(tx+5,tt+14,1,2,'#222');g.px(tx+6,tt+14,1,1,'#222');
  if(flag)g.flag(tx+tw,tt-16)}
// 풍차 (북·서부의 기둥 풍차)
function country_windmill(g,x,base){g.px(x-1,base-14,2,14,PAL.woodD);country_line(g,x,base-6,x-5,base,PAL.woodD);country_line(g,x,base-6,x+5,base,PAL.woodD);
  g.px(x-5,base-24,10,11,'#6e5638');g.px(x-5,base-24,10,1,'#8a6e48');for(let i=0;i<3;i++)g.px(x-6+i,base-27+i,12-2*i,1,'#4a3a26');g.snow(x-4,base-27,8);
  const wc=g.win();g.px(x-1,base-20,2,3,wc);g.px(x+5,base-16,2,1,PAL.woodD);
  const hx=x,hy=base-21;g.px(hx-1,hy-1,2,2,'#2a1e14');
  const sails=[[1,1],[-1,1],[1,-1],[-1,-1]];for(const [dx,dy] of sails){for(let i=2;i<15;i++){g.px(hx+dx*i,hy+dy*i,1,1,'#c8bca0');if(i>4&&i%2===0){g.px(hx+dx*i+dx,hy+dy*i,1,1,'#8a8070');g.px(hx+dx*i,hy+dy*i+dy*-1,1,1,'#8a8070')}}}}
// 비둘기집 (남부의 둥근 피종니에)
function country_dovecote(g,x,base){g.px(x-5,base-18,10,18,PAL.plasterD);g.px(x-5,base-18,3,18,PAL.plaster);g.px(x-6,base-12,12,1,PAL.stoneL);
  country_tri(g,x,base-27,7,9,'#7a3e2e');g.px(x,base-29,1,2,PAL.wood);g.snow(x-2,base-27,4);
  for(let i=0;i<3;i++)g.px(x-3+i*3,base-16,1,2,'#141826');g.px(x-1,base-6,3,6,PAL.woodD)}
function country_haystack(g,x,base,s){const c=g.winter?'#8a7a58':'#a08a48',d=g.winter?'#6a5c40':'#7a6834';
  for(let i=0;i<s;i++){const w=Math.round(Math.sqrt(1-((s-i)/s)**2)*s*.8)+1;g.px(x-w,base-s+i,w*2,1,i%3?c:d)}g.px(x,base-s-2,1,2,PAL.woodD);if(g.winter)country_blob(g,x,base-s+2,s*.5|0,1,PAL.snow)}
function country_sheaf(g,x,base){g.px(x-1,base-6,3,6,'#b39a4a');g.px(x-2,base-7,5,2,'#c8ae5a');g.px(x-1,base-4,3,1,'#7a6834')}
function country_calvaire(g,x){g.px(x-3,GY-3,7,3,PAL.stoneD);g.px(x-2,GY-5,5,2,PAL.stone);g.px(x,GY-20,2,15,PAL.stoneL);g.px(x-3,GY-17,8,2,PAL.stoneL);g.px(x,GY-16,2,4,'#4a4436');g.snow(x-3,GY-18,8)}
function country_libertyTree(g,x){country_tree(g,x,GY,5,'#2e4a2a','#203823');g.px(x+5,GY-26,1,26,'#c8b896');g.px(x+3,GY-28,5,3,PAL.red);g.px(x+4,GY-29,3,1,PAL.red);
  g.px(x+6,GY-24,1,6,PAL.blue);g.px(x+7,GY-23,1,7,PAL.white);g.px(x+8,GY-22,1,6,PAL.red)}
function country_oxcart(g,x){g.px(x,GY-9,22,3,PAL.wood);g.px(x,GY-14,1,5,PAL.wood);g.px(x+21,GY-14,1,5,PAL.wood);for(let i=2;i<20;i+=4)g.px(x+i,GY-13,1,4,PAL.woodD);
  const load=g.winter?'#7a6a4a':g.season===1?'#b39a4a':g.season===2?'#7a5a34':'#5a6a3a';g.px(x+1,GY-15,20,5,load);g.px(x+3,GY-17,15,2,load);if(g.winter)g.px(x+3,GY-17,15,1,PAL.snow);
  for(const wx of [x+4,x+15]){country_blob(g,wx,GY-4,4,4,PAL.woodD);country_blob(g,wx,GY-4,2,2,'#2a1e14');g.px(wx,GY-4,1,1,PAL.wood)}
  g.px(x-14,GY-8,14,1,PAL.woodD);
  // 소
  const ox='#5a4636';g.px(x-30,GY-12,14,6,ox);g.px(x-34,GY-13,5,4,ox);g.px(x-35,GY-15,1,2,'#d8d0b8');g.px(x-30,GY-15,1,2,'#d8d0b8');g.px(x-34,GY-11,1,1,'#222');
  g.px(x-29,GY-6,2,6,ox);g.px(x-19,GY-6,2,6,ox);g.px(x-16,GY-11,1,5,ox);g.px(x-31,GY-14,3,2,PAL.wood)}
function country_hedge(g,x0,x1,y,col){for(let x=x0;x<x1;x+=3){const h=2+(g.rnd()*3|0);g.px(x,y-h,4,h+1,col)}if(g.winter)for(let x=x0;x<x1;x+=4)g.px(x,y-3,2,1,PAL.snow)}
function country_vines(g,y0,y1){for(let y=y0;y<y1;y+=3){for(let x=(y%2?0:3);x<SW;x+=6){g.px(x,y-2,1,3,'#3a2a1c');if(!g.winter){g.px(x-1,y-2,3,1,g.season===2?'#7a4a2a':g.season===1?'#2e4a24':'#3e5a2e');if(g.season>=1&&g.rnd()<.3)g.px(x+1,y-1,1,1,'#3a1a40')}}}}

/* ================= 마을 ================= */
ART.village=function(g){const loc=g.loc,south=['provence','languedoc','gascogne','marseille','bordeaux','auvergne'].includes(loc);
  const bocage=loc==='bretagne'||loc==='vendee',vine=['bourgogne','champagne','gascogne','bordeaux'].includes(loc),med=['provence','languedoc','marseille'].includes(loc);
  // 먼 언덕 두 겹
  country_hills(g,52,5,'#1a2438',1.3,.031,.07);country_hills(g,62,4,'#1e2c34',4.1,.024,.055);
  // 언덕 위 밭 띠
  const fc=country_fieldCol(g);for(let x=0;x<SW;x++){const y=country_hillY(62,4,4.1,.024,.055,x)+2;if(y<GY)g.px(x,y,1,GY-y,fc)}
  for(let y=66;y<GY;y+=3)for(let x=(y%2)*5;x<SW;x+=10)g.px(x,y,6,1,g.winter?'#8e98aa':'rgba(0,0,0,.18)');
  if(g.winter)for(let i=0;i<160;i++)g.px(g.rnd()*SW|0,64+(g.rnd()*16|0),1,1,'#5a5448');
  if(vine)country_vines(g,68,GY);
  if(bocage){for(const y of [65,71,77])country_hedge(g,0,SW,y,'#173020');for(const x of [36,104,176,232])for(let y=64;y<GY;y+=2)g.px(x,y,3,2,'#173020')}
  else{country_hedge(g,0,60,72,'#1c3424');country_hedge(g,180,SW,70,'#1c3424')}
  // 언덕 위 풍차 / 비둘기집
  if(country_isNorth(loc)||!south)country_windmill(g,214,country_hillY(52,5,1.3,.031,.07,214)+3);else country_dovecote(g,214,country_hillY(62,4,4.1,.024,.055,214)+4);
  // 원경의 포플러 줄 / 남부 사이프러스
  if(med){for(const x of [122,130,138,246])country_cypress(g,x,66,14+(x%5));}
  else for(let x=150;x<200;x+=6)country_poplar(g,x,64,14+(x*7%5));
  // 수확: 여름 밀단, 가을엔 건초더미
  if(g.season===1)for(let x=170;x<250;x+=11)country_sheaf(g,x,69+(x%3));
  // 성당 + 마을 집들
  const rev=g.t>=1790.5;
  country_church(g,8,true);
  const thatch=!south;
  country_cottage(g,68,22,14,thatch);country_cottage(g,94,18,12,thatch&&g.rnd()<.6);country_cottage(g,146,20,13,thatch);
  // 남부: 올리브
  if(med){country_olive(g,200,GY-2);country_olive(g,242,GY-1)}
  // 건초더미
  country_haystack(g,118,68,6);country_haystack(g,128,68,4);
  // 나무
  // 길가 십자가
  country_calvaire(g,62);
  // 혁명 이후 자유의 나무
  if(rev)country_libertyTree(g,176);
  else country_tree(g,178,GY,5,g.season===2?'#5a4a24':'#2e4a2a','#203823');
  // 소달구지
  country_oxcart(g,232);
  artGround(g,'dirt');
  // 바큇자국 길
  g.px(0,GY+5,SW,1,'#2e281e');g.px(0,GY+9,SW,1,'#2e281e');
  if(g.winter)for(let i=0;i<12;i++)g.px(g.rnd()*SW|0,GY+1+(g.rnd()*10|0),6+(g.rnd()*8|0),1,PAL.snow);
  else if(g.season===0)for(let i=0;i<40;i++)g.px(g.rnd()*SW|0,GY+1+(g.rnd()*14|0),1,1,'#3c5a30')};

/* ================= 성 ================= */
function country_win(g,x,y,lit,h){g.px(x-1,y-1,5,h+2,PAL.stoneL);g.px(x,y,3,h,lit?PAL.glow:'#232a40');g.px(x+1,y,1,h,lit?PAL.glowD:'#1a2034');g.px(x,y+(h>>1),3,1,PAL.stoneL)}
function country_mansard(g,x,w,y,h,dormers){for(let i=0;i<h;i++){const ins=i<3?3-i:0;g.px(x+ins,y+i,w-ins*2,1,i<3?PAL.slateD:PAL.slate)}g.px(x-1,y+h,w+2,1,PAL.stoneL);
  if(g.winter){g.px(x+3,y,w-6,1,PAL.snow);for(let i=0;i<w;i+=5)g.px(x+i,y+4,2,1,PAL.snow)}
  for(let i=0;i<dormers;i++){const dx=x+Math.round((i+.5)*w/dormers)-2;g.px(dx,y+3,5,5,PAL.stoneL);g.px(dx+1,y+4,3,4,g.rnd()<.25?PAL.glow:'#232a40');g.px(dx,y+2,5,1,PAL.slateD)}}
function country_tower(g,cx,top,w){g.px(cx-w/2,top,w,GY-8-top,PAL.stone);g.px(cx-w/2,top,2,GY-8-top,PAL.stoneL);g.px(cx+w/2-2,top,2,GY-8-top,PAL.stoneD);
  for(let i=0;i<16;i++){const ww=Math.round((w/2+1)*(i+1)/16);g.px(cx-ww,top-16+i,ww*2,1,i%3?PAL.slate:PAL.slateD)}g.px(cx,top-19,1,3,PAL.gold);
  if(g.winter)for(let i=3;i<16;i+=3){const ww=Math.round((w/2+1)*(i+1)/16);g.px(cx-ww,top-16+i,1,1,PAL.snow)}
  country_win(g,cx-1,top+6,g.rnd()<.4,6);country_win(g,cx-1,top+18,g.rnd()<.4,6)}
ART.chateau=function(g){
  country_hills(g,56,4,'#1a2438',2.2,.03,.08);
  // 공원 수목 (양옆)
  for(let x=0;x<44;x+=7)country_tree(g,x+3,66,6+(x%3),'#22402a','#18301f');for(let x=212;x<SW;x+=7)country_tree(g,x+2,66,6+(x%3),'#22402a','#18301f');
  const base=GY-8;// 성 기단선
  // 중앙 본채
  const cx0=72,cx1=184;g.px(cx0,44,cx1-cx0,base-44,PAL.plaster);g.px(cx0,44,cx1-cx0,1,PAL.stoneL);g.px(cx0,58,cx1-cx0,1,PAL.plasterD);
  country_mansard(g,cx0,cx1-cx0,30,14,6);
  // 굴뚝
  for(const x of [86,168]){g.px(x,24,4,8,PAL.stone);g.px(x-1,23,6,1,PAL.stoneL)}
  // 중앙 돌출부 + 페디먼트
  g.px(116,40,24,base-40,PAL.stoneL);country_tri(g,128,32,13,8,PAL.stone);g.px(115,40,26,1,PAL.plaster);g.px(126,35,4,3,PAL.gold);
  g.flag(127,16);
  // 창: 2층 + 1층, 대칭
  for(let x=cx0+6;x<cx1-4;x+=8){if(x>112&&x<142)continue;const lit=g.rnd()<.3;country_win(g,x,47,lit,8);country_win(g,x,61,g.rnd()<.3,9)}
  country_win(g,121,47,g.rnd()<.5,8);country_win(g,132,47,g.rnd()<.5,8);
  g.px(124,base-12,8,12,PAL.woodD);g.px(125,base-13,6,1,PAL.woodD);g.px(123,base-14,10,1,PAL.stone);
  // 양쪽 모서리 파비용
  const fire=g.t>=1789.55&&g.t<1790;
  for(const [px0,pw] of [[50,24],[182,24]]){g.px(px0,38,pw,base-38,PAL.plaster);g.px(px0,38,2,base-38,PAL.stoneL);g.px(px0+pw-2,38,2,base-38,PAL.plasterD);
    for(let i=0;i<16;i++){const ins=Math.round((15-i)*.3);g.px(px0+ins,22+i,pw-ins*2,1,i%3?PAL.slate:PAL.slateD)}
    g.px(px0-1,38,pw+2,1,PAL.stoneL);if(g.winter)g.px(px0+2,30,pw-4,1,PAL.snow);
    for(let x=px0+5;x<px0+pw-4;x+=8){country_win(g,x,43,g.rnd()<.35,8);country_win(g,x,58,g.rnd()<.35,9)}}
  // 바깥 둥근 탑 (원뿔 지붕)
  country_tower(g,40,42,12);country_tower(g,216,42,12);
  // 대공포: 한쪽 날개 화재
  if(fire){for(let i=0;i<40;i++){const fx=186+(g.rnd()*20|0),fy=28+(g.rnd()*30|0);g.px(fx,fy,2,2,g.rnd()<.5?'#e8742a':'#f3c65a')}
    for(let r=4;r>0;r--)country_blob(g,196,30,6+r*4,4+r*4,'rgba(232,116,42,.06)');for(let i=0;i<10;i++)g.px(188+(g.rnd()*16|0),8+(g.rnd()*18|0),2,1,'#4a4048')}
  // 테라스 기단 + 계단
  g.px(30,base,196,2,PAL.stoneL);g.px(30,base+2,196,1,PAL.stoneD);
  // 파르테르: 낮은 회양목 무늬
  g.px(0,base+3,SW,GY-base-3,'#1a2a20');
  for(let x=4;x<SW;x+=16){g.px(x,base+4,12,1,'#2e4a2a');g.px(x,GY-1,12,1,'#2e4a2a');g.px(x+5,base+4,2,4,'#2e4a2a');g.px(x+2,base+5,1,2,'#2e4a2a');g.px(x+9,base+5,1,2,'#2e4a2a')}
  if(g.winter)for(let x=0;x<SW;x+=5)g.px(x,base+4,3,1,PAL.snow);
  // 다듬은 주목 (원뿔)
  for(const x of [14,30,226,242]){country_tri(g,x,GY-14,3,12,'#173024');g.px(x,GY-3,1,3,PAL.woodD);g.snow(x-1,GY-14,3)}
  for(const x of [62,194]){country_tri(g,x,GY-11,2,9,'#173024');g.snow(x,GY-11,1)}
  // 돌기둥 문 + 철책
  for(const x of [4,250]){g.px(x-2,GY-18,5,18,PAL.stoneL);g.px(x-3,GY-19,7,2,PAL.stone);g.px(x-1,GY-22,3,3,PAL.stone);g.px(x,GY-23,1,1,PAL.gold);g.snow(x-3,GY-20,7)}
  for(const [a,b] of [[7,46],[208,248]]){g.px(a,GY-11,b-a,1,'#20242e');for(let x=a;x<b;x+=3){g.px(x,GY-12,1,12,'#20242e');g.px(x,GY-13,1,1,PAL.gold)}}
  artGround(g,'dirt');
  // 자갈 진입로
  for(let i=0;i<30;i++)g.px(g.rnd()*SW|0,GY+1+(g.rnd()*14|0),1,1,'#6a6252')};

/* ================= 숲 ================= */
function country_trunk(g,x,w,top,col,hl){g.px(x,top,w,GY-top,col);g.px(x,top,1,GY-top,hl);g.px(x-1,GY-3,w+2,3,col);
  for(let y=top+4;y<GY;y+=5+(g.rnd()*4|0))g.px(x+1+(g.rnd()*(w-2)|0),y,1,2,'rgba(0,0,0,.25)')}
ART.forest=function(g){const w=g.winter,au=g.season===2;
  // 하늘을 덮는 먼 숲 실루엣
  for(let x=0;x<SW;x+=5){const h=18+(g.rnd()*14|0);country_blob(g,x,GY-h-8,5,6,'#121b26')}
  g.px(0,58,SW,GY-58,'#121b26');
  // 뒤쪽 나무줄기
  for(let x=2;x<SW;x+=9+(g.rnd()*6|0))g.px(x,20+(g.rnd()*20|0),2,GY,'#18202c');
  // 중간층 수관 (참나무·너도밤나무)
  const can=w?'#1f2833':au?'#4a3a22':'#162a20',can2=w?'#2a3440':au?'#5e4628':'#1c3426';
  if(!w)for(let x=-4;x<SW+8;x+=14){const y=12+(g.rnd()*14|0);country_blob(g,x,y,11,8,can);country_blob(g,x+3,y-2,7,5,can2);if(au)for(let i=0;i<6;i++)g.px(x-8+(g.rnd()*16|0),y-4+(g.rnd()*10|0),1,1,'#7a5a2a')}
  // 중간층 줄기
  for(let x=6;x<SW;x+=16+(g.rnd()*8|0))country_trunk(g,x,3,14,'#262a2a','#3a3e3a');
  // 겨울: 맨가지 + 눈
  if(w)for(let x=4;x<SW;x+=12){const bx=x+(g.rnd()*4|0),by=10+(g.rnd()*16|0);country_line(g,bx,by+16,bx-7,by,'#3a3e44');country_line(g,bx,by+12,bx+8,by+1,'#3a3e44');country_line(g,bx-4,by+8,bx-9,by+5,'#3a3e44');g.px(bx-8,by,3,1,PAL.snow);g.px(bx+7,by+1,3,1,PAL.snow);g.px(bx-10,by+5,2,1,PAL.snow)}
  // 숯쟁이 오두막 (원뿔형 장작·흙 오두막) + 숯가마
  const hx=196;
  for(let i=0;i<22;i++){const ww=Math.round(13*(i+1)/22);g.px(hx-ww,GY-22+i,ww*2,1,i%2?'#4a3a28':'#3e3020')}
  for(let i=4;i<22;i+=3)g.px(hx-Math.round(13*(i+1)/22)+1,GY-22+i,2,1,'#5a4630');
  g.px(hx-1,GY-26,1,5,'#3a2a1c');g.px(hx+1,GY-25,1,4,'#3a2a1c');
  g.px(hx-3,GY-9,6,9,'#0c0e14');g.px(hx-2,GY-8,4,8,'#c8862e');g.px(hx-1,GY-7,2,6,PAL.glow);
  for(let i=0;i<12;i++)g.px(hx-10+i*2-(i>>1),GY-1,3,1,'rgba(243,198,90,.18)');
  if(w)country_tri(g,hx,GY-22,6,6,PAL.snow);
  country_smoke(g,hx,GY-26);
  // 숯가마 (흙 둔덕, 틈새의 불씨)
  const mx=232;country_blob(g,mx,GY-1,14,9,'#3a3026');for(let i=0;i<20;i++)g.px(mx-20+i*2,GY-1,2,1,'rgba(232,116,42,.2)');g.px(mx-13,GY-1,27,1,'#2e2820');
  for(let i=0;i<5;i++)g.px(mx-8+i*4,GY-4+(i%2)*2,1,1,'#e8742a');g.px(mx,GY-8,1,1,'#f3c65a');country_smoke(g,mx,GY-8);country_smoke(g,mx-4,GY-6);if(w)country_blob(g,mx,GY-6,7,1,PAL.snow);
  // 장작더미
  for(let y=0;y<3;y++)for(let x=0;x<4;x++){g.px(168+x*4+(y%2)*2,GY-3-y*3,3,3,'#5a4630');g.px(169+x*4+(y%2)*2,GY-2-y*3,1,1,'#8a7050')}
  // 앞쪽 굵은 참나무 줄기 (인물 영역 밖)
  country_trunk(g,18,8,0,'#2a2622','#46403a');country_trunk(g,70,6,0,'#2a2622','#46403a');country_trunk(g,246,7,0,'#2a2622','#46403a');
  country_line(g,25,30,40,14,'#2a2622');country_line(g,25,31,40,15,'#2a2622');country_line(g,76,24,88,8,'#2a2622');
  // 앞 수관 (화면 위쪽)
  if(!w){for(let x=0;x<SW;x+=20){country_blob(g,x+(g.rnd()*6|0),2,14,8,can);country_blob(g,x+8,4,8,4,can2)}}
  else for(let x=0;x<SW;x+=10)g.px(x,0,8,1,'#2a3440');
  // 고사리·가시덤불
  for(const [a,b] of [[0,88],[172,SW]])for(let x=a;x<b;x+=3){const h=2+(g.rnd()*5|0);g.px(x,GY-h,2,h,w?'#3a3a3a':au?'#5a3e22':'#1d3a22');if(!w&&g.rnd()<.25)g.px(x+1,GY-h,1,1,g.season===1?'#3a1a40':'#7a2a2a')}
  artGround(g,'dirt');
  // 낙엽·이끼
  for(let i=0;i<50;i++)g.px(g.rnd()*SW|0,GY+1+(g.rnd()*14|0),2,1,w?'#c8d0dc':au?'#6a4a24':'#2c3a24')};
