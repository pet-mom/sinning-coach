/* ================= 인물(가족) 픽셀 아트 =================
   drawPeople(g, list) — 땅선 GY 위에 가족을 가운데(x≈128) 정렬해 그린다.
   list 항목: {sex:'M'|'F', age, me, estate, role, pol}
   시대(g.t)·신분·역할에 따라 1750–1850 프랑스 복식을 고른다. 모든 보조 함수는 people_ 접두사.
*/
const PEOPLE_OUT='#0b0d14';
const PEOPLE_SKIN=['#f0d2b4','#e6c09c','#d8aa84','#c8966c','#b58058'];
const PEOPLE_HAIR=['#2a1a10','#3e2616','#5a3a20','#7a5230','#a07a44','#c8a060','#8a3a1a'];
const PEOPLE_C={blue:'#2a4592',blueD:'#1e3270',white:'#ecebe4',red:'#bc2c2c',gold:'#e0b850',black:'#1e1e24',steel:'#9aa2ae',wood:'#6a4424',woodL:'#8a6a3a'};

function people_hash(n){n=(n|0)^0x9e3779b9;n=Math.imul(n^(n>>>16),0x85ebca6b);n=Math.imul(n^(n>>>13),0xc2b2ae35);n^=n>>>16;return (n>>>0)/4294967296}
function people_pick(arr,h){return arr[Math.floor(h*arr.length)%arr.length]}
function people_shade(c,k){const n=parseInt(c.slice(1),16);const f=v=>Math.max(0,Math.min(255,Math.round(k<0?v*(1+k):v+(255-v)*k)));
  return '#'+((1<<24)|(f(n>>16)<<16)|(f((n>>8)&255)<<8)|f(n&255)).toString(16).slice(1)}

/* 스프라이트 버퍼: 그린 뒤 바깥 1px 어두운 외곽선을 둘러 밤 배경에서도 읽히게 한다 */
function people_buf(){const m=new Map();
  const px=(x,y,w,h,c)=>{x=Math.round(x);y=Math.round(y);w=Math.max(1,Math.round(w));h=Math.max(1,Math.round(h));
    for(let j=0;j<h;j++)for(let i=0;i<w;i++){const k=((y+j+512)<<12)|(x+i+1024);if(c==null)m.delete(k);else m.set(k,c)}};
  return {m,px}}
function people_flush(g,B){let minY=1e9;const out=new Set();
  for(const k of B.m.keys()){const x=(k&4095)-1024,y=(k>>12)-512;if(y<minY)minY=y;
    for(const d of [[1,0],[-1,0],[0,1],[0,-1]]){const kk=((y+d[1]+512)<<12)|(x+d[0]+1024);if(!B.m.has(kk))out.add(kk)}}
  for(const k of out)g.px((k&4095)-1024,(k>>12)-512,1,1,PEOPLE_OUT);
  for(const [k,c] of B.m)g.px((k&4095)-1024,(k>>12)-512,1,1,c);
  return minY}

/* 몸의 기준점 */
function people_layout(p,cx,b){const a=p.age,F=p.sex==='F',old=a>=60;
  let H=a>=15?(F?25:27):Math.max(12,Math.min(F?24:25,11+Math.round(a)));if(old)H-=1;
  const tw=a>=13?7:5,hh=H>=17?5:4;
  const legH=Math.round((H-hh)*(a>=13?0.5:0.45)),torsoH=H-hh-legH,top=b-H+1;
  const x0=cx-Math.floor(tw/2);const torsoTop=top+hh,legTop=torsoTop+torsoH;
  return {cx,b,H,tw,x0,hx:cx-2+(old?1:0),ht:top,hh,torsoTop,torsoH,legTop,legH,knee:legTop+Math.round(legH*0.45),
    hand:Math.min(b-2,torsoTop+torsoH),kid:a<13,old,F}}

/* ---------- 머리 ---------- */
function people_head(B,L,skin,hair,style){const {hx,ht,hh}=L;
  B.px(hx,ht,5,hh,skin);
  if(style!=='bald'&&style!=='none'){B.px(hx,ht,5,1,hair);B.px(hx,ht+1,1,1,hair);B.px(hx+4,ht+1,1,1,hair)}
  if(style==='bald'){B.px(hx,ht+1,1,2,hair);B.px(hx+4,ht+1,1,2,hair)}
  if(style==='long'){B.px(hx,ht+1,1,hh-1,hair);B.px(hx+4,ht+1,1,hh-1,hair)}
  if(style==='side'){B.px(hx,ht+1,1,3,hair);B.px(hx+4,ht+1,1,3,hair)}
  if(style==='wig'){const w='#e9e6dc',w2='#c9c5ba';B.px(hx,ht,5,1,w);B.px(hx,ht+1,1,1,w);B.px(hx+4,ht+1,1,1,w);
    B.px(hx-1,ht+1,1,2,w2);B.px(hx+5,ht+1,1,2,w2);B.px(hx-1,ht+2,1,1,w);B.px(hx+5,ht+2,1,1,w)}
  if(style==='messy'){B.px(hx-1,ht,7,1,hair);B.px(hx+1,ht-1,2,1,hair);B.px(hx,ht+1,1,2,hair);B.px(hx+4,ht+1,1,2,hair)}
  // 눈
  B.px(hx+1,ht+2,1,1,'#1a1410');B.px(hx+3,ht+2,1,1,'#1a1410');
  if(hh>=5)B.px(hx+2,ht+3,1,1,people_shade(skin,-.18))}

/* ---------- 모자 ---------- */
function people_cockade(B,x,y,kind){if(kind==='tri'){B.px(x,y,1,1,PEOPLE_C.blue);B.px(x+1,y,1,1,PEOPLE_C.white);B.px(x+2,y,1,1,PEOPLE_C.red)}
  else if(kind==='white')B.px(x,y,1,1,'#ffffff');else if(kind==='black')B.px(x,y,1,1,'#3a3a40')}
function people_hat(B,L,type,col,o){o=o||{};const {hx,ht}=L;col=col||PEOPLE_C.black;const tr=o.trim;
  switch(type){
  case 'tricorne':
    B.px(hx-2,ht-3,2,1,col);B.px(hx+5,ht-3,2,1,col);B.px(hx+1,ht-4,3,1,col);B.px(hx,ht-3,5,1,col);
    B.px(hx-2,ht-2,9,1,col);B.px(hx-1,ht-1,7,1,col);B.px(hx+2,ht,1,1,col);
    if(tr){B.px(hx-2,ht-3,1,1,tr);B.px(hx+6,ht-3,1,1,tr);B.px(hx-1,ht-2,1,1,tr);B.px(hx+5,ht-2,1,1,tr);B.px(hx+1,ht-1,3,1,tr)}
    if(o.cockade)people_cockade(B,hx+3,ht-1,o.cockade);break;
  case 'bicorne':
    B.px(hx+1,ht-4,3,1,col);B.px(hx-1,ht-3,7,1,col);B.px(hx-3,ht-2,11,1,col);B.px(hx-1,ht-1,7,1,col);
    if(tr){B.px(hx-3,ht-2,1,1,tr);B.px(hx+7,ht-2,1,1,tr);B.px(hx-1,ht-3,1,1,tr);B.px(hx+5,ht-3,1,1,tr);B.px(hx+1,ht-4,3,1,tr)}
    if(o.cockade)people_cockade(B,hx+1,ht-2,o.cockade);
    if(o.plume){B.px(hx+2,ht-6,1,1,PEOPLE_C.blue);B.px(hx+2,ht-5,1,1,PEOPLE_C.white);if(o.plume==='tri')B.px(hx+2,ht-7,1,1,PEOPLE_C.red);else B.px(hx+2,ht-6,1,2,o.plume)}
    break;
  case 'tophat':
    B.px(hx,ht-6,5,5,col);B.px(hx-1,ht-1,7,1,col);B.px(hx,ht-2,5,1,people_shade(col,-.4));B.px(hx,ht-6,5,1,people_shade(col,.15));break;
  case 'roundhat': // 1790년대 둥근 높은 모자
    B.px(hx,ht-4,5,3,col);B.px(hx-2,ht-1,9,1,col);B.px(hx,ht-2,5,1,people_shade(col,-.35));break;
  case 'felt': // 농민의 넓은 챙 모자
    B.px(hx+1,ht-3,3,1,col);B.px(hx,ht-2,5,1,col);B.px(hx-2,ht-1,9,1,col);B.px(hx-3,ht-1,1,1,people_shade(col,.1));B.px(hx+7,ht-1,1,1,people_shade(col,.1));break;
  case 'priest':
    B.px(hx+1,ht-2,3,1,col);B.px(hx-2,ht-1,9,1,col);break;
  case 'shako':
    B.px(hx-1,ht-6,7,1,col);B.px(hx,ht-5,5,4,col);B.px(hx-1,ht-1,7,1,col);
    B.px(hx+2,ht-4,1,2,PEOPLE_C.gold);B.px(hx+1,ht-3,3,1,PEOPLE_C.gold);
    B.px(hx+2,ht-8,1,2,o.pompom||PEOPLE_C.red);if(o.cockade)people_cockade(B,o.cockade==='tri'?hx+1:hx+2,ht-5,o.cockade);break;
  case 'phrygian': {const r='#c62a2a',rd='#9a1c1c';
    B.px(hx+1,ht-3,3,1,r);B.px(hx,ht-2,5,1,r);B.px(hx-1,ht-1,7,1,r);B.px(hx-1,ht,1,1,rd);B.px(hx+5,ht,1,1,rd);
    B.px(hx+4,ht-4,2,1,r);B.px(hx+6,ht-3,1,2,rd);B.px(hx+4,ht-3,2,1,rd);
    B.px(hx,ht-1,1,1,PEOPLE_C.blue);B.px(hx+1,ht-1,1,1,PEOPLE_C.white);B.px(hx+2,ht-1,1,1,'#e04040');break}
  case 'cap': // 장인의 털모자
    B.px(hx,ht-2,5,1,col);B.px(hx-1,ht-1,7,1,col);B.px(hx-1,ht-1,7,1,people_shade(col,-.2));B.px(hx+4,ht-3,2,1,col);break;
  case 'mob': {const w='#f4f2ea',w2='#d6d2c6';
    B.px(hx,ht-2,5,1,w);B.px(hx-1,ht-1,7,1,w);B.px(hx-1,ht,7,1,w2);B.px(hx-1,ht+1,1,1,w);B.px(hx+5,ht+1,1,1,w);
    if(o.ribbon)B.px(hx+4,ht-1,2,1,o.ribbon);if(o.cockade)people_cockade(B,hx,ht-1,o.cockade);break}
  case 'coif': {const w='#f0ede2';B.px(hx-1,ht-1,7,2,w);B.px(hx,ht-2,5,1,w);B.px(hx-1,ht+1,1,2,w);B.px(hx+5,ht+1,1,2,w);break}
  case 'pouf': {const w='#e6e2d8',w2='#c8c3b6';
    B.px(hx,ht-5,5,1,w);B.px(hx-1,ht-4,7,4,w);B.px(hx-1,ht-2,7,1,w2);B.px(hx-1,ht,1,2,w2);B.px(hx+5,ht,1,2,w2);B.px(hx-1,ht+1,1,1,w);B.px(hx+5,ht+1,1,1,w);
    B.px(hx+4,ht-6,1,2,o.ribbon||'#e890a8');B.px(hx+5,ht-5,1,1,'#ffffff');B.px(hx+1,ht-4,1,1,o.ribbon||'#e890a8');break}
  case 'chignon':
    B.px(hx+1,ht-2,3,2,col);B.px(hx-1,ht+1,1,1,col);B.px(hx+5,ht+1,1,1,col);if(o.ribbon)B.px(hx,ht-1,5,1,o.ribbon);break;
  case 'bonnet': { // 차양이 얼굴을 감싸는 보닛(1810 이후)
    B.px(hx,ht-4,5,1,col);B.px(hx-1,ht-3,7,3,col);B.px(hx-2,ht-2,1,4,col);B.px(hx+6,ht-2,1,4,col);B.px(hx-1,ht,1,2,col);B.px(hx+5,ht,1,2,col);
    B.px(hx,ht-1,5,1,people_shade(col,-.25));if(o.ribbon){B.px(hx+5,ht+3,1,2,o.ribbon);B.px(hx,ht-3,2,1,o.ribbon)}
    if(o.flower)B.px(hx+4,ht-4,1,1,o.flower);break}
  case 'veil': { // 수녀
    B.px(hx-1,ht-2,7,2,col);B.px(hx-2,ht-1,1,L.hh+4,col);B.px(hx+5,ht,1,L.hh+3,col);B.px(hx-1,ht,1,L.hh+3,col);
    B.px(hx,ht,5,1,'#f4f4f0');B.px(hx,ht+1,1,L.hh-1,'#f4f4f0');B.px(hx+4,ht+1,1,L.hh-1,'#f4f4f0');B.px(hx,ht+L.hh-1,5,1,'#f4f4f0');break}
  case 'babycap': {const w='#f6f4ee';B.px(hx,ht-1,5,2,w);B.px(hx,ht+1,1,2,w);B.px(hx+4,ht+1,1,2,w);break}
  }}

/* ---------- 남자 몸 ---------- */
function people_male(B,L,S,skin){const {x0,tw,torsoTop,legTop,knee,b,hand}=L;const big=tw>=7;
  const uw=big?3:2,lw=S.trousers?uw:2;
  const legL=x0,legR=x0+tw-uw;const lowL=S.trousers?legL:(big?x0+1:x0),lowR=S.trousers?legR:(big?x0+4:x0+3);
  // 다리
  if(S.coat!=='cassock'){
    B.px(x0,legTop,tw,1,S.breeches);B.px(legL,legTop+1,uw,knee-legTop,S.breeches);B.px(legR,legTop+1,uw,knee-legTop,S.breeches);
    const low=S.trousers?S.breeches:S.stockings;
    B.px(lowL,knee+1,lw,b-knee-1,low);B.px(lowR,knee+1,lw,b-knee-1,low);
    if(S.stripes){for(let y=legTop;y<b;y++)for(let x=x0;x<x0+tw;x++){if(B.m.has(((y+512)<<12)|(x+1024))&&(x-x0)%2===1)B.px(x,y,1,1,S.stripes)}}
    if(!S.trousers&&S.kneeBand){B.px(legL,knee,uw,1,S.kneeBand);B.px(legR,knee,uw,1,S.kneeBand)}
    if(S.gaiters){const gy=S.longGaiters?knee-1:knee+1;B.px(lowL,gy,lw,b-gy,S.gaiters);B.px(lowR,gy,lw,b-gy,S.gaiters);
      if(!S.trousers&&lw<uw){B.px(legL,gy,uw,1,S.gaiters);B.px(legR,gy,uw,1,S.gaiters)}}
  }
  // 신발
  if(S.barefoot){B.px(lowL-1,b,lw+1,1,skin);B.px(lowR,b,lw+1,1,skin)}
  else if(S.sabots){B.px(lowL-1,b,lw+2,1,PEOPLE_C.woodL);B.px(lowR-1,b,lw+2,1,PEOPLE_C.woodL);B.px(lowL-1,b-1,1,1,PEOPLE_C.woodL);B.px(lowR+lw,b-1,1,1,PEOPLE_C.woodL)}
  else {const sh=S.shoes||'#24201c';B.px(lowL-1,b,lw+1,1,sh);B.px(lowR,b,lw+1,1,sh);
    if(S.buckle){B.px(lowL,b,1,1,S.buckle);B.px(lowR+1,b,1,1,S.buckle)}}
  // 몸통 기본(조끼/셔츠)
  B.px(x0,torsoTop,tw,legTop-torsoTop,S.vest||S.shirt);
  const c=S.coatCol;
  if(S.coat==='full'){const cw=big?2:1;
    B.px(x0,torsoTop,cw,legTop-torsoTop,c);B.px(x0+tw-cw,torsoTop,cw,legTop-torsoTop,c);
    B.px(x0-1,legTop,cw+1,knee-legTop,c);B.px(x0+tw-cw,legTop,cw+1,knee-legTop,c);
    B.px(x0-1,legTop+2,1,knee-legTop-1,S.lining||people_shade(c,-.25));B.px(x0+tw,legTop+2,1,knee-legTop-1,S.lining||people_shade(c,-.25));
    if(S.trim){for(let y=torsoTop+1;y<knee;y+=2){B.px(x0+cw-1,y,1,1,S.trim);B.px(x0+tw-cw,y,1,1,S.trim)}B.px(x0-1,knee-1,cw+1,1,S.trim);B.px(x0+tw-cw,knee-1,cw+1,1,S.trim)}
    if(S.vestBtn)for(let y=torsoTop+2;y<legTop;y+=2)B.px(x0+Math.floor(tw/2),y,1,1,S.vestBtn)}
  else if(S.coat==='tail'){const cw=big?2:1;
    B.px(x0,torsoTop,cw,legTop-torsoTop-1,c);B.px(x0+tw-cw,torsoTop,cw,legTop-torsoTop-1,c);
    B.px(x0+cw,torsoTop+1,1,2,c);B.px(x0+tw-cw-1,torsoTop+1,1,2,c);// 접힌 깃
    B.px(x0-1,legTop-1,1,knee-legTop+2,c);B.px(x0+tw,legTop-1,1,knee-legTop+2,c);
    if(big){B.px(x0,torsoTop-1,1,1,c);B.px(x0+tw-1,torsoTop-1,1,1,c)}
    if(S.vestBtn)for(let y=torsoTop+3;y<legTop;y+=2)B.px(x0+Math.floor(tw/2),y,1,1,S.vestBtn)}
  else if(S.coat==='jacket'){B.px(x0,torsoTop,tw,legTop-torsoTop+1,c);B.px(x0+Math.floor(tw/2)-(big?1:0),torsoTop+1,big?3:1,legTop-torsoTop-1,S.vest||S.shirt);
    if(big){B.px(x0+1,torsoTop+1,1,3,people_shade(c,.18));B.px(x0+tw-2,torsoTop+1,1,3,people_shade(c,.18))}
    if(S.vestStripe)for(let y=torsoTop+1;y<legTop;y+=2)B.px(x0+2,y,3,1,S.vestStripe)}
  else if(S.coat==='smock'){B.px(x0,torsoTop,tw,knee-torsoTop,c);B.px(x0-1,legTop,tw+2,knee-legTop,c);
    B.px(x0,torsoTop+2,tw,1,people_shade(c,.15));B.px(x0+Math.floor(tw/2),torsoTop,1,2,people_shade(c,-.3));
    B.px(x0-1,knee-1,tw+2,1,people_shade(c,-.15));if(S.belt)B.px(x0,legTop-2,tw,1,S.belt)}
  else if(S.coat==='cassock'){B.px(x0,torsoTop,tw,b-torsoTop,c);B.px(x0-1,b-4,tw+2,4,c);
    for(let y=torsoTop+2;y<b-1;y+=2)B.px(x0+Math.floor(tw/2),y,1,1,'#3a3a46');
    const sh='#1a1a1a';B.px(x0,b,2,1,sh);B.px(x0+tw-2,b,2,1,sh);B.px(x0-1,b-1,tw+2,1,c)}
  else if(S.coat==='skel'){const wy=legTop-Math.max(2,Math.round(L.torsoH*0.35));
    B.px(x0,torsoTop,tw,wy-torsoTop,c);B.px(x0,wy,tw,legTop-wy,S.breeches);
    for(let y=torsoTop+1;y<legTop;y+=2){B.px(x0+1,y,1,1,PEOPLE_C.gold);B.px(x0+tw-2,y,1,1,PEOPLE_C.gold)}}
  else if(S.coat==='shirt'){B.px(x0,legTop-1,tw,1,S.breeches)}
  // 소매·팔
  const sl=S.sleeve||(S.coat==='skel'||S.coat==='cassock'||S.coat==='smock'||S.coat==='jacket'||S.coat==='full'||S.coat==='tail'?c:S.shirt);
  if(S.bound){B.px(x0-1,torsoTop+1,1,4,sl);B.px(x0+tw,torsoTop+1,1,4,sl);B.px(x0,torsoTop+5,1,1,sl);B.px(x0+tw-1,torsoTop+5,1,1,sl);
    const cy=torsoTop+6;B.px(x0+1,cy,tw-2,1,skin);B.px(x0+Math.floor(tw/2)-1,cy,3,1,'#b89a5a');B.px(x0+Math.floor(tw/2),cy+1,1,2,'#b89a5a')}
  else{B.px(x0-1,torsoTop+1,1,hand-torsoTop-1,sl);B.px(x0+tw,torsoTop+1,1,hand-torsoTop-1,sl);
    if(S.cuff){B.px(x0-1,hand-1,1,1,S.cuff);B.px(x0+tw,hand-1,1,1,S.cuff)}
    B.px(x0-1,hand,1,1,skin);B.px(x0+tw,hand,1,1,skin)}
  // 목·깃
  if(S.collar){B.px(x0,torsoTop,tw,1,S.collar)}
  if(S.cravat){B.px(x0+Math.floor(tw/2)-1,torsoTop,3,1,S.cravat);if(S.jabot)B.px(x0+Math.floor(tw/2),torsoTop+1,1,2,S.jabot)}
  if(S.lapels){B.px(x0+Math.floor(tw/2)-1,torsoTop+1,3,Math.min(5,legTop-torsoTop-2),S.lapels);if(S.lapBtn)for(let y=torsoTop+2;y<torsoTop+6&&y<legTop-1;y+=2){B.px(x0+Math.floor(tw/2)-1,y,1,1,S.lapBtn);B.px(x0+Math.floor(tw/2)+1,y,1,1,S.lapBtn)}}
  if(S.bands){B.px(x0+Math.floor(tw/2)-1,torsoTop,3,1,'#f4f4f0');B.px(x0+Math.floor(tw/2)-1,torsoTop+1,1,2,'#f4f4f0');B.px(x0+Math.floor(tw/2)+1,torsoTop+1,1,2,'#f4f4f0')}
  if(S.apron){B.px(x0+1,torsoTop+2,tw-2,knee-torsoTop-1,S.apron);B.px(x0+Math.floor(tw/2),torsoTop,1,2,people_shade(S.apron,-.2));B.px(x0+1,torsoTop+2,tw-2,1,people_shade(S.apron,-.2))}
  if(S.sash){const y=legTop-3;B.px(x0,y,tw,1,PEOPLE_C.blue);B.px(x0,y+1,tw,1,PEOPLE_C.white);B.px(x0,y+2,tw,1,PEOPLE_C.red);B.px(x0+tw-2,y+3,1,2,PEOPLE_C.red);B.px(x0+tw-2,y+5,1,1,PEOPLE_C.gold)}
  if(S.belt&&S.coat!=='smock')B.px(x0,legTop-2,tw,1,S.belt);
  if(S.crossbelt){for(let i=0;i<legTop-torsoTop-1;i++){const x=x0+i%tw;B.px(x,torsoTop+1+i,1,1,S.crossbelt)}}
  if(S.epaul){B.px(x0-1,torsoTop,2,1,S.epaul);B.px(x0+tw-1,torsoTop,2,1,S.epaul);B.px(x0-2,torsoTop,1,2,S.epaul);B.px(x0+tw+1,torsoTop,1,2,S.epaul)}
  // 들고 있는 것
  const rx=x0+tw+1;
  if(S.musket){B.px(rx,L.ht-1,1,b-L.ht,'#5a5c64');B.px(rx,torsoTop+3,1,b-torsoTop-3,PEOPLE_C.wood);B.px(rx,b-2,2,2,PEOPLE_C.wood);
    B.px(rx,L.ht-6,1,5,'#d0d4dc');B.px(rx+1,L.ht-1,1,1,'#d0d4dc')}
  if(S.pike){B.px(rx,L.ht-2,1,b-L.ht+2,PEOPLE_C.woodL);B.px(rx,L.ht-6,1,4,'#c0c6d0');B.px(rx-1,L.ht-3,3,1,'#9aa0aa');B.px(rx+1,L.ht-1,1,2,'#c62a2a')}
  if(S.sabre){for(let i=0;i<6;i++)B.px(x0-2-Math.floor(i/2),legTop+i,1,1,'#3a3a44');B.px(x0-1,legTop-1,1,1,PEOPLE_C.gold);B.px(x0-2,legTop-2,1,1,PEOPLE_C.gold)}
  if(S.sword){for(let i=0;i<5;i++)B.px(x0-2-Math.floor(i/3),legTop+1+i,1,1,'#c8ccd4');B.px(x0-1,legTop,1,1,PEOPLE_C.gold)}
  if(S.cane){B.px(rx,hand,1,b-hand+1,'#6a4a2a');B.px(rx-1,hand-1,2,1,'#6a4a2a')}
  if(S.book){B.px(x0+tw-1,hand-2,2,3,'#3a2416');B.px(x0+tw,hand-1,1,1,PEOPLE_C.gold)}
  if(S.tool){B.px(rx,hand-1,1,5,PEOPLE_C.woodL);B.px(rx-1,hand+3,3,1,'#8a9098')}
}

/* ---------- 여자 몸 ---------- */
function people_female(B,L,S,skin){const {x0,tw,torsoTop,b,hand,torsoH}=L;const big=tw>=7;
  const w=S.empire?torsoTop+2:torsoTop+Math.max(2,Math.round(torsoH*(S.lowWaist?0.75:0.62)));
  const hem=S.ankle?b-1:b;
  // 신발(짧은 치마일 때)
  if(S.ankle){const f=S.sabots?PEOPLE_C.woodL:'#2a2420';B.px(x0,b,2,1,f);B.px(x0+tw-2,b,2,1,f)}
  // 치마
  for(let y=w+1;y<=hem;y++){const k=(y-w)/(hem-w);let ex;
    if(S.panniers)ex=y===w+1?3:4;else if(S.empire)ex=Math.round(k*1.6);else if(S.bell)ex=Math.min(3,Math.round(1+k*2.6));else ex=Math.round(k*2.2);
    B.px(x0-ex,y,tw+ex*2,1,S.skirt);
    if(S.petticoat){const pw=Math.max(1,Math.round(1+k*(big?4:2)));B.px(x0+Math.floor(tw/2)-Math.floor(pw/2),y,pw,1,S.petticoat)}
    if(S.flounce&&(hem-y)%3===0&&y>w+2)B.px(x0-ex,y,tw+ex*2,1,S.flounce);
    if(S.dots&&(y+(x0&1))%2===0)for(let x=x0-ex+((y>>1)&1);x<x0+tw+ex;x+=3)B.px(x,y,1,1,S.dots);
    if(S.stripes)for(let x=x0-ex;x<x0+tw+ex;x++)if((x-x0+16)%3===0)B.px(x,y,1,1,S.stripes)}
  if(S.hemBand)B.px(x0-(S.panniers?4:2),hem-1,tw+(S.panniers?8:4),1,S.hemBand);
  if(S.apron){const ay=Math.round(w+1+(hem-w)*0.7);B.px(x0+1,w+1,tw-2,ay-w,S.apron);B.px(x0,w,tw,1,people_shade(S.apron,-.15))}
  // 몸통
  B.px(x0,torsoTop,tw,w-torsoTop+1,S.bodice);
  if(!S.empire&&big){B.px(x0,w,1,1,S.skirt);B.px(x0+tw-1,w,1,1,S.skirt)}
  if(S.stomacher){B.px(x0+2,torsoTop+1,3,w-torsoTop,S.stomacher);for(let y=torsoTop+2;y<=w;y+=2)B.px(x0+3,y,1,1,'#e890a8');B.px(x0+1,torsoTop,5,1,skin);B.px(x0+1,torsoTop+1,1,1,'#f8f6f0');B.px(x0+5,torsoTop+1,1,1,'#f8f6f0')}
  if(S.fichu){const f='#f6f4ee';B.px(x0,torsoTop,tw,1,f);B.px(x0+1,torsoTop+1,tw-2,1,f);B.px(x0+Math.floor(tw/2)-(big?1:0),torsoTop+2,big?3:1,1,f);
    if(big)B.px(x0+3,torsoTop+3,1,1,f);if(S.fichuCockade)people_cockade(B,x0+1,torsoTop+1,'tri')}
  if(S.empire){B.px(x0+1,torsoTop,tw-2,1,skin);B.px(x0,w,tw,1,S.ribbon||S.bodice)}
  if(S.ribbonWaist)B.px(x0,w,tw,1,S.ribbonWaist);
  if(S.wimple){B.px(x0,torsoTop,tw,2,'#f4f4f0');B.px(x0+1,torsoTop+2,tw-2,1,'#f4f4f0');B.px(x0+Math.floor(tw/2),torsoTop+4,1,3,'#c8a850');B.px(x0+Math.floor(tw/2)-1,torsoTop+5,3,1,'#c8a850')}
  // 팔
  const sl=S.sleeve||S.bodice;const ah=hand-torsoTop-1;
  if(S.sleeveLen==='short'){B.px(x0-1,torsoTop+1,1,2,sl);B.px(x0+tw,torsoTop+1,1,2,sl);B.px(x0-1,torsoTop+3,1,hand-torsoTop-2,skin);B.px(x0+tw,torsoTop+3,1,hand-torsoTop-2,skin)}
  else if(S.sleeveLen==='elbow'){const e=torsoTop+1+Math.ceil(ah*0.55);B.px(x0-1,torsoTop+1,1,e-torsoTop-1,sl);B.px(x0+tw,torsoTop+1,1,e-torsoTop-1,sl);
    B.px(x0-1,e,1,1,'#f8f6f0');B.px(x0+tw,e,1,1,'#f8f6f0');B.px(x0-2,e,1,1,'#f8f6f0');B.px(x0+tw+1,e,1,1,'#f8f6f0');B.px(x0-1,e+1,1,hand-e,skin);B.px(x0+tw,e+1,1,hand-e,skin)}
  else {B.px(x0-1,torsoTop+1,1,ah,sl);B.px(x0+tw,torsoTop+1,1,ah,sl);B.px(x0-1,hand,1,1,skin);B.px(x0+tw,hand,1,1,skin);
    if(S.gigot){B.px(x0-2,torsoTop+1,1,3,sl);B.px(x0+tw+1,torsoTop+1,1,3,sl)}}
  if(S.shawl){const s=S.shawl,s2=people_shade(S.shawl,.25);B.px(x0-1,torsoTop+3,1,hand-torsoTop-3,s);B.px(x0+tw,torsoTop+3,1,hand-torsoTop-3,s);
    B.px(x0-2,torsoTop+4,1,hand-torsoTop,s);B.px(x0+tw+1,torsoTop+4,1,hand-torsoTop,s);B.px(x0-2,hand+4,1,1,s2);B.px(x0+tw+1,hand+4,1,1,s2);
    B.px(x0,torsoTop+1,1,1,s);B.px(x0+tw-1,torsoTop+1,1,1,s)}
  if(S.cane){const rx=x0+tw+1;B.px(rx,hand,1,b-hand+1,'#6a4a2a');B.px(rx-1,hand-1,2,1,'#6a4a2a')}
  if(S.basket){B.px(x0+tw,hand,3,2,'#a07a40');B.px(x0+tw+1,hand-1,1,1,'#a07a40')}
  if(S.fan){B.px(x0+tw,hand-1,2,1,'#f0d0e0');B.px(x0+tw+1,hand-2,1,1,'#f0d0e0')}
  return w}

/* ---------- 아기 ---------- */
function people_baby_standing(B,cx,b,skin){const w='#f4f2ea',band='#c8b890';
  B.px(cx-2,b-5,4,6,w);B.px(cx-2,b-3,4,1,band);B.px(cx-2,b-1,4,1,band);B.px(cx-1,b,2,1,w);
  B.px(cx-2,b-8,4,3,w);B.px(cx-1,b-7,2,2,skin);B.px(cx-1,b-6,1,1,'#1a1410')}
function people_baby_carried(B,L,skin){const {x0,tw,torsoTop}=L;const w='#f4f2ea';
  const y=torsoTop+3;B.px(x0+2,y,tw-1,3,w);B.px(x0+2,y+1,tw-1,1,'#d8d0bc');B.px(x0+tw+1,y-1,2,2,skin);B.px(x0+tw+1,y-2,2,1,w);B.px(x0+tw+3,y-1,1,2,w);
  B.px(x0+tw,y+3,1,1,skin)}

/* ---------- 복식 결정 ---------- */
function people_dress(p,t,id){
  const a=p.age,M=p.sex!=='F',est=p.estate||'peasant',role=p.role||null,pol=p.pol||0;
  const noble=est==='hobereau'||est==='robe'||est==='epee';
  const by=Math.round(t-a);const h1=people_hash(by*131+(M?17:29)+est.length*7),h2=people_hash(by*977+(M?3:5)+id),h3=people_hash(by*53+id*7+11);
  let skin=people_pick(est==='peasant'?PEOPLE_SKIN.slice(1):PEOPLE_SKIN.slice(0,4),h1);
  let hair=people_pick(PEOPLE_HAIR,h2);
  if(a>=70)hair='#eeeeea';else if(a>=60)hair='#c4c4c0';else if(a>=50)hair=people_shade(hair,.45);
  const revo=t>=1792.6&&t<1795.6,pre89=t<1789.5,wigOK=t<1792&&(noble||(est==='robe'))&&a>=13;
  const triOK=(t>=1789.5&&t<1815.3)||t>=1830.6,royalWhite=t>=1815.3&&t<1830.6;
  const cockade=triOK?'tri':(royalWhite?'white':null);
  const kid=a<13,small=a<6;
  const hd={hair,style:M?'short':'side'},S={},F={};
  const o={M,skin,hd,S,F,hat:null,hatCol:null,hatO:{}};
  if(a<2){o.baby=true;return o}
  // ---- 어린아이: 남녀 모두 드레스
  if(small){o.M=false;F.bodice=people_pick(['#e8e2d0','#d8e0ea','#ead8d8'],h3);F.skirt=F.bodice;F.ankle=true;F.ribbonWaist=people_pick(['#5a7ac0','#c05a6a','#7aa060'],h2);
    F.sleeveLen='long';if(est==='peasant'){F.bodice='#8a7a62';F.skirt='#7a6a52';F.apron='#c8bfa8';F.sabots=true;F.ribbonWaist=null}
    if(a<4||est==='peasant'){o.hat='mob'}hd.style='side';return o}
  // ---- 역할: 수녀
  if(role==='nun'){o.M=false;F.bodice='#1e1e24';F.skirt='#1e1e24';F.sleeve='#1e1e24';F.wimple=true;o.hat='veil';o.hatCol='#141418';hd.style='none';return o}
  if(M){
    // ---- 남자 역할
    if(role==='soldier'||role==='officer'){const off=role==='officer';
      S.coat='full';S.collar=PEOPLE_C.red;S.cravat='#202024';S.stockings=PEOPLE_C.white;S.gaiters='#18181c';S.longGaiters=true;S.shoes='#18181c';
      if(pre89){S.coatCol='#e6e4dc';S.lapels=PEOPLE_C.blue;S.cuff=PEOPLE_C.blue;S.vest=PEOPLE_C.white;S.breeches=PEOPLE_C.white;S.lining=PEOPLE_C.blue;S.collar=PEOPLE_C.blue;
        o.hat='tricorne';o.hatO={trim:off?PEOPLE_C.gold:PEOPLE_C.white,cockade:'white'};hd.style=off&&noble?'wig':'short';hd.style=off?'wig':'short'}
      else{S.coatCol=PEOPLE_C.blue;S.lapels=PEOPLE_C.white;S.cuff=PEOPLE_C.red;S.vest=PEOPLE_C.white;S.breeches=PEOPLE_C.white;S.lining=PEOPLE_C.red;
        if(t>=1829){S.breeches='#b82a2a';S.trousers=true;S.gaiters=null}
        if(off||t<1806.5){o.hat='bicorne';o.hatO={cockade:cockade||'tri',trim:off?PEOPLE_C.gold:null,plume:off?'tri':null}}
        else{o.hat='shako';o.hatO={cockade:royalWhite?'white':null,pompom:off?PEOPLE_C.gold:PEOPLE_C.red}}
        if(royalWhite&&o.hat==='bicorne')o.hatO.cockade='white';
        if(!off&&t>=1800&&a>=20)hd.moustache=true}
      S.lapBtn=off?PEOPLE_C.gold:'#c8c8c0';
      if(off){S.epaul=PEOPLE_C.gold;S.sabre=true;S.gaiters=t>=1829?null:'#18181c';S.longGaiters=true;if(!pre89&&t<1829){S.gaiters='#18181c'}}
      else S.musket=true;
      S.buckle=null;return o}
    if(role==='priest'){S.coat='cassock';S.coatCol='#18181e';S.bands=true;S.shirt='#18181e';hd.style=a>=60?'bald':'short';
      o.hat=t<1800?'tricorne':'priest';o.hatCol='#141418';S.book=true;if(a>=65)S.cane=true;return o}
    if(role==='prisoner'){S.coat='shirt';S.shirt='#8e8e8a';S.breeches='#55554f';S.stockings='#55554f';S.trousers=true;S.barefoot=true;S.bound=true;S.sleeve='#8e8e8a';hd.style='messy';skin=people_shade(skin,-.12);o.skin=skin;return o}
    const sanscul=role==='sansculotte'||(revo&&!noble&&pol>=40&&a>=13&&role!=='deputy');
    if(sanscul){S.coat='jacket';S.coatCol=people_pick(['#3a3a5e','#4a3a2a','#2e3e5a'],h3);S.vest='#ecebe4';S.vestStripe='#c62a2a';S.shirt='#ecebe4';
      S.breeches='#ecebe4';S.stripes='#3050a8';S.trousers=true;S.sabots=true;S.cravat='#c62a2a';o.hat='phrygian';hd.style='long';
      if(role==='sansculotte'&&a>=16)S.pike=true;return o}
    if(role==='deputy'){S.coat=t<1796?'full':'tail';S.coatCol='#22242e';S.vest=t>=1792.6?'#ecebe4':'#5a4a3a';S.shirt='#ecebe4';S.cravat='#f4f4f0';S.jabot='#f4f4f0';
      S.breeches=t<1800?'#e8e0c8':'#22242e';S.stockings='#ecebe4';S.trousers=t>=1810;S.buckle='#c8c8c0';S.sash=t>=1792.6;S.book=true;
      if(t<1795.5){o.hat=t>=1792.6?'roundhat':'tricorne';o.hatO={cockade:t>=1789.5?'tri':null}}
      else if(t<1800){o.hat='bicorne';o.hatO={cockade:'tri',plume:'tri'}}else{o.hat='tophat'}
      hd.style=wigOK?'wig':(t>=1820?'side':'short');return o}
    // ---- 민간 남자: 신분별
    const trousers=t>=1810||(est==='artisan'&&t>=1792)||(est==='peasant'&&t>=1820);
    S.shirt='#ecebe4';S.stockings='#ecebe4';S.trousers=trousers;
    if(est==='peasant'){S.coat='smock';S.coatCol=t>=1815?people_pick(['#3a5a9a','#34508a'],h3):people_pick(['#8a8a80','#7a6e5a','#6a7480'],h3);
      S.breeches='#7a6440';S.stockings='#b8b0a0';S.gaiters=people_pick(['#5a4a34','#8a8070'],h2);S.sabots=true;S.kneeBand=null;
      if(!kid){o.hat='felt';o.hatCol=people_pick(['#2a2420','#3a2e22','#4a3a28'],h2)}hd.style='long';if(a>=16&&a<60&&h3<.4)S.tool=true}
    else if(est==='artisan'){S.coat='shirt';S.vest=people_pick(['#5a3a2a','#3a4a3a','#6a5a3a'],h3);S.sleeve='#e2ded2';S.breeches=trousers?'#4a4438':'#6a5a40';
      S.stockings='#8a8478';S.apron=a>=12?'#8a6038':null;S.shoes='#2a2018';S.cravat=null;if(!kid){o.hat='cap';o.hatCol=people_pick(['#3a4a6a','#5a3a2a','#6a2a2a'],h2)}}
    else { // 부르주아·귀족
      const pal=noble&&est!=='robe'?['#6a3a7a','#2f6a5a','#8a2a3a','#3a4f9a','#7a6a2a']:est==='robe'?['#1e1e24','#24222a']:['#5a4232','#2e3c58','#3e4a3a','#5a3a2e'];
      S.coatCol=people_pick(pal,h3);S.breeches=noble?'#e8e0c8':people_pick(['#d8ccb0','#3a3a40','#6a5a48'],h2);S.vest=noble?'#f0e6c8':people_pick(['#e8dcc0','#c8a85a','#d8d0c0'],h2);
      S.cravat='#f4f4f0';S.buckle=t<1800?'#d8d8d0':null;S.vestBtn=noble?PEOPLE_C.gold:'#8a7a5a';
      if(t<1789.5){S.coat='full';if(noble&&est==='epee'){S.trim=PEOPLE_C.gold;S.jabot='#f8f8f4';S.sword=a>=16}
        if(est==='hobereau'){S.coatCol=people_pick(['#3e4a2a','#5a4428'],h3);S.gaiters='#2a221c';S.longGaiters=true;S.buckle=null}
        if(est==='robe'){S.bands=true;S.cravat=null}}
      else if(t<1795.5){S.coat=noble?'full':(h2<.5?'full':'tail')}else S.coat='tail';
      if(t>=1800)S.coatCol=people_pick(noble?['#1e2a48','#22242a','#3a2a24','#2a3a2e']:['#1e2a48','#22242a','#3a2a24','#4a3a2a'],h3);
      if(t>=1810){S.breeches=people_pick(['#c8bca0','#6a6a6e','#3a3a40','#d8d0bc'],h2);S.vest=people_pick(['#e8dcc0','#c8a85a','#6a2a2a','#ece6d8'],h3)}
      if(t>=1795.5&&t<1815){S.boots=true}
      if(kid&&a>=6){ // 소년
        if(t>=1785&&t<1830){S.coat='skel';S.coatCol=people_pick(['#3a5a8a','#5a3a2a','#2e4a3a'],h3);S.breeches='#e8e0c8';S.trousers=true;S.collar='#f8f8f4';S.collarWide=true}
        S.sword=false}
      else if(!kid){
        if(t<1795.5){o.hat='tricorne';o.hatO={trim:noble?PEOPLE_C.gold:null,cockade:t>=1789.5?(revo||pol>=0?'tri':null):null}}
        else if(t<1800){o.hat='bicorne';o.hatO={cockade:'tri'}}
        else{o.hat='tophat';o.hatCol=people_pick(['#1e1e24','#2a2420','#5a5048'],h2)}}
      if(wigOK&&!kid)hd.style='wig';else if(t>=1815)hd.style='side'}
    if(S.boots){S.gaiters='#1a1614';S.longGaiters=true;S.buckle=null}
    if(a>=62&&!S.tool)S.cane=true;
    return o}
  // ---- 여자
  F.sleeveLen='long';
  const sansF=role==='sansculotte'||(revo&&!noble&&pol>=40);
  const empire=t>=1795.5&&t<1822,late=t>=1822;
  if(role==='prisoner'){F.bodice='#8e8e8a';F.skirt='#6e6e6a';F.ankle=true;F.sabots=false;hd.style='long';o.hat=null;return o}
  if(role==='deputy'||role==='priest'||role==='soldier'||role==='officer'){/* 드문 경우: 부르주아처럼 */}
  if(est==='peasant'||(est==='artisan'&&!empire&&!late)||(est==='artisan'&&h3<.4)){
    // 전통 서민 복장: 몸판·치마·앞치마·피슈·모자
    F.bodice=people_pick(['#7a3a2e','#4a4a6a','#6a5a3a','#3a4a3a'],h3);F.skirt=people_pick(['#6a5a7a','#7a4a3a','#4a5a6a','#7a6a4a'],h2);
    F.apron=est==='peasant'?'#c8bfa8':'#d8d2c4';F.fichu=true;F.ankle=true;F.sabots=est==='peasant';F.sleeveLen=a>=13?'elbow':'long';
    if(est==='artisan')F.stripes=people_shade(F.skirt,.3);
    o.hat=est==='peasant'?'coif':'mob';o.hatO={ribbon:est==='artisan'?'#c05a6a':null};
    if(sansF){o.hat='mob';o.hatO={cockade:'tri'};F.skirt='#b8302e';F.fichuCockade=true}
    if(a>=13&&a<55&&h2<.5&&est==='peasant')F.basket=true}
  else if(!empire&&!late){ // 1795 이전 부르주아·귀족
    if(noble&&pre89&&a>=15){F.bodice=people_pick(['#8ab0d8','#e8a8b8','#e8d890','#a8d0a8'],h3);F.skirt=F.bodice;F.sleeve=F.bodice;F.panniers=true;
      F.petticoat=people_shade(F.bodice,.45);F.flounce=people_shade(F.bodice,.3);F.stomacher=people_shade(F.bodice,.35);F.sleeveLen='elbow';o.hat='pouf';o.hatO={ribbon:'#e86a8a'};F.fan=a<50;hd.style='side';hair='#e6e2d8';hd.hair=hair}
    else{F.bodice=people_pick(noble?['#6a8ab0','#b06a7a','#8a7aa8']:['#5a6a8a','#8a5a4a','#6a7a5a','#9a7a5a'],h3);F.skirt=F.bodice;F.petticoat=people_shade(F.bodice,.35);F.fichu=true;
      F.dots=noble?null:people_shade(F.bodice,.4);F.sleeveLen=a>=13?'elbow':'long';o.hat=kid?null:'mob';o.hatO={ribbon:people_pick(['#5a7ac0','#c05a6a','#7aa060'],h2),cockade:sansF||(revo&&pol>=0)?'tri':null}}}
  else if(empire){ // 고전풍 하이웨이스트
    F.empire=true;F.bodice=noble||est==='bourgeois'?'#f4f2ea':people_pick(['#e8e0c8','#d8dce8'],h3);F.skirt=F.bodice;F.sleeve=F.bodice;F.sleeveLen=a>=13?'short':'long';
    F.ribbon=people_pick(['#4a6ab0','#c05a6a','#5a8a5a','#d8b25a'],h2);F.hemBand=a>=13?people_shade(F.ribbon,.2):null;
    if(a>=13)F.shawl=people_pick(['#b83a2a','#c88a2a','#5a3a7a','#2a5a8a'],h3);
    if(est==='artisan'){F.bodice=people_pick(['#6a7a9a','#9a6a5a','#7a8a6a'],h3);F.skirt=F.bodice;F.sleeve=F.bodice;F.sleeveLen='long';F.shawl=null;F.apron='#e0dacb';o.hat='mob'}
    else if(!kid){if(t>=1810){o.hat='bonnet';o.hatCol=people_pick(['#d8c080','#e8e0d0','#6a7aa8'],h2);o.hatO={ribbon:F.ribbon,flower:'#e86a8a'}}else{o.hat='chignon';o.hatCol=hair;o.hatO={ribbon:F.ribbon}}}
    if(a>=50&&o.hat!=='bonnet'&&!kid){o.hat='mob';o.hatO={ribbon:F.ribbon}}}
  else { // 1822 이후: 허리 내려오고 종 모양 치마, 지고 소매
    F.bell=true;F.lowWaist=true;F.bodice=people_pick(['#6a3a5a','#3a5a7a','#7a5a3a','#5a6a4a','#8a6a7a'],h3);F.skirt=F.bodice;F.sleeve=F.bodice;
    F.gigot=t>=1826&&t<1838&&a>=13;F.flounce=t<1830?people_shade(F.bodice,.25):null;F.fichu=a>=40;F.ribbonWaist=people_shade(F.bodice,-.3);
    if(est==='artisan'){F.apron='#d8d2c4';o.hat='mob'}else if(!kid){o.hat='bonnet';o.hatCol=people_pick(['#d8c080','#3a3a4a','#e8e0d0'],h2);o.hatO={ribbon:people_pick(['#c05a6a','#4a6ab0'],h3)}}
    if(F.dots===undefined&&est!=='bourgeois'&&!noble)F.dots=people_shade(F.bodice,.35)}
  if(a>=65&&!F.cane&&role!=='nun'){F.cane=true;F.basket=false;F.fan=false}
  if(kid&&o.hat==='pouf')o.hat=null;
  return o}

/* 한 사람 그리기 */
function people_figure(B,p,cx,b,t,id){
  const d=people_dress(p,t,id);
  if(d.baby){people_baby_standing(B,cx,b,d.skin);return d}
  const L=people_layout(p,cx,b);
  if(d.M){people_male(B,L,d.S,d.skin);if(d.S.collarWide){B.px(L.x0-1,L.torsoTop,L.tw+2,1,'#f8f8f4')}}
  else people_female(B,L,d.F,d.skin);
  people_head(B,L,d.skin,d.hd.hair,d.hd.style);
  if(d.hd.moustache)B.px(L.hx+1,L.ht+3,3,1,people_shade(d.hd.hair,-.1));
  if(d.hat)people_hat(B,L,d.hat,d.hatCol,d.hatO);
  d.L=L;return d}

function people_width(p,t){const a=p.age,F=p.sex==='F';if(a<2)return 6;
  let w=a>=13?11:8;const r=p.role;
  if(r==='soldier'||r==='sansculotte')w+=2;
  if(F&&a>=15&&t<1789.5&&(p.estate==='hobereau'||p.estate==='robe'||p.estate==='epee')&&!r)w=15;
  return w}

function people_marker(g,cx,y){const B=people_buf();B.px(cx-2,y,5,1,'#ffffff');B.px(cx-1,y+1,3,1,'#ffffff');B.px(cx,y+2,1,1,'#ffffff');people_flush(g,B)}

function drawPeople(g,list){
  if(!list||!list.length)return;const t=typeof g.t==='number'?g.t:1789;const b=GY+2;
  const items=list.map((p,i)=>({p,i}));
  // 아기는 성인 여성이 안고 있게
  const carriers=items.filter(o=>o.p.sex==='F'&&o.p.age>=16&&o.p.role!=='nun'&&o.p.role!=='prisoner');
  let ci=0;items.forEach(o=>{if(o.p.age<2&&ci<carriers.length){carriers[ci].baby=o;o.carried=true;ci++}});
  const shown=items.filter(o=>!o.carried);
  shown.forEach(o=>o.w=people_width(o.p,t));
  let gap=2;let total=shown.reduce((s,o)=>s+o.w,0)+gap*(shown.length-1);
  if(total>SW-8){const k=(SW-8)/total;shown.forEach(o=>o.w=Math.max(5,Math.floor(o.w*k)));gap=1;total=shown.reduce((s,o)=>s+o.w,0)+gap*(shown.length-1)}
  let x=Math.round(SW/2-total/2);
  shown.forEach(o=>{o.cx=x+Math.floor(o.w/2);x+=o.w+gap});
  shown.forEach(o=>{const B=people_buf();const d=people_figure(B,o.p,o.cx,b,t,o.i);
    if(o.baby&&d.L)people_baby_carried(B,d.L,people_dress(o.baby.p,t,o.baby.i).skin);
    const top=people_flush(g,B);
    if(o.p.me)people_marker(g,o.cx,top-5);else if(o.baby&&o.baby.p.me&&d.L)people_marker(g,d.L.x0+d.L.tw+2,d.L.torsoTop-4)})}

/* 미리보기용 표본 가족 */
function SAMPLE_PEOPLE(o){const t=o&&typeof o.t==='number'?o.t:1789;
  if(t<1789.5)return [
    {sex:'M',age:70,me:false,estate:'robe',role:null,pol:0},
    {sex:'M',age:38,me:true,estate:'epee',role:null,pol:-20},
    {sex:'F',age:33,me:false,estate:'epee',role:null,pol:-10},
    {sex:'M',age:8,me:false,estate:'epee',role:null,pol:0},
    {sex:'F',age:1,me:false,estate:'epee',role:null,pol:0},
    {sex:'F',age:4,me:false,estate:'epee',role:null,pol:0},
    {sex:'M',age:24,me:false,estate:'peasant',role:'soldier',pol:0},
    {sex:'F',age:30,me:false,estate:'peasant',role:null,pol:0}];
  if(t<1795.5)return [
    {sex:'M',age:46,me:false,estate:'bourgeois',role:'deputy',pol:60},
    {sex:'M',age:31,me:true,estate:'artisan',role:'sansculotte',pol:80},
    {sex:'F',age:28,me:false,estate:'artisan',role:null,pol:60},
    {sex:'F',age:0,me:false,estate:'artisan',role:null,pol:0},
    {sex:'M',age:9,me:false,estate:'artisan',role:null,pol:0},
    {sex:'M',age:20,me:false,estate:'peasant',role:'soldier',pol:40},
    {sex:'F',age:66,me:false,estate:'peasant',role:null,pol:0},
    {sex:'M',age:40,me:false,estate:'epee',role:'prisoner',pol:-80}];
  if(t<1815.3)return [
    {sex:'M',age:58,me:false,estate:'peasant',role:'priest',pol:-20},
    {sex:'M',age:35,me:true,estate:'bourgeois',role:'officer',pol:30},
    {sex:'F',age:28,me:false,estate:'bourgeois',role:null,pol:0},
    {sex:'M',age:9,me:false,estate:'bourgeois',role:null,pol:0},
    {sex:'M',age:22,me:false,estate:'peasant',role:'soldier',pol:0},
    {sex:'M',age:42,me:false,estate:'peasant',role:null,pol:0},
    {sex:'F',age:50,me:false,estate:'peasant',role:'nun',pol:0},
    {sex:'M',age:48,me:false,estate:'bourgeois',role:null,pol:0}];
  return [
    {sex:'M',age:40,me:true,estate:'bourgeois',role:null,pol:0},
    {sex:'F',age:34,me:false,estate:'bourgeois',role:null,pol:0},
    {sex:'F',age:10,me:false,estate:'bourgeois',role:null,pol:0},
    {sex:'M',age:3,me:false,estate:'bourgeois',role:null,pol:0},
    {sex:'M',age:24,me:false,estate:'peasant',role:'soldier',pol:0},
    {sex:'M',age:68,me:false,estate:'peasant',role:null,pol:0}]}

if(typeof ART!=='undefined'&&!ART.blank)ART.blank=function(g){artGround(g,'cobble')};
