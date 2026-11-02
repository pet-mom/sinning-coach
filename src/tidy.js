/* ================= 화면 정리 =================
   프로필: ‘성격 · 신념 · 지위’ 카드를 뺀다. 세부 정보에서 건강·평판·명성·가치와 의지를 빼고(위 카드들과 겹친다), 재능의 별을 지우고, 분야별 숙련은 접어 둔다.
   생활: 물가·이력 카드를 뺀다. 거주지를 신분과 형편에 맞게 나눈다. 사회 활동은 일곱 살부터(어린이용 활동).
   시대: 정치 세력만 남긴다. */
// 카드 제목(h2)으로 카드 하나를 지운다
function tdDropCard(H,title){H.querySelectorAll('section.card').forEach(c=>{const h=c.querySelector('.ch h2');if(h&&h.textContent.trim()===title)c.remove()})}
// h3 제목부터 다음 h3 전까지를 지운다
function tdDropH3(pin,test){const hs=[...pin.querySelectorAll(':scope > h3')];hs.forEach(h=>{if(!test(h.textContent))return;let n=h.nextSibling;h.remove();while(n&&!(n.tagName==='H3')){const nx=n.nextSibling;n.remove();n=nx}})}

/* ---------- 프로필 ---------- */
{const _pe=profileExtra;profileExtra=function(H){_pe(H);tdDropCard(H,'성격 · 신념 · 지위')}}
{const _bi=buildInfo;buildInfo=function(pin){_bi(pin);try{
  tdDropH3(pin,t=>/^건강/.test(t)||/^평판$/.test(t.trim())||/^명성/.test(t)||/^가치와 의지/.test(t));
  pin.querySelectorAll('.tals .st').forEach(x=>x.remove());
  // 분야별 숙련은 접는다
  [...pin.querySelectorAll(':scope > h3')].filter(h=>/분야$/.test(h.textContent.trim())).forEach(h=>{const g=h.nextElementSibling;const d=el('details','fold');const sm=el('summary',null,h.textContent);d.appendChild(sm);h.replaceWith(d);if(g&&g.tagName!=='H3')d.appendChild(g)});
  }catch(e){console.error(e)}}}

/* ---------- 생활 ---------- */
{const _lt=lifeTab;lifeTab=function(H){_lt(H);tdDropCard(H,'물가');tdDropCard(H,'이력')}}
// 거주지: 신분 · 나이(부모 집) · 형편
{const _hl=homeLabel;homeLabel=function(){const k=typeof sceneKind==='function'?sceneKind():'';if(['prison','abroad','forest','camp','church','chateau'].includes(k)||!urban())return _hl();
  const E=s.estate,m=s.money,young=s.age<18||(!s.flags.adult);
  if(E==='epee')return young?'생제르맹 문밖 가문 저택(오텔)':m>=20000||s.land>=1000?'생제르맹 문밖 저택(오텔)':m>=4000?'마레의 낡은 저택 한 층':'빚에 쫓겨 빌린 셋집';
  if(E==='robe')return young?'마레의 법관 저택':m>=8000||s.land>=500?'마레의 법관 저택':m>=2000?'생루이 섬의 석조 집':'라탱 구역 셋집';
  if(E==='hobereau')return young?'파리 친척 저택의 곁방':s.land>=300?'영지의 낡은 성관(겨울엔 파리 셋방)':'마레의 셋방 두 칸';
  if(E==='bourgeois')return young?'가게 위층 집':m>=20000?'팔레루아얄 근처 새 석조 집':m>=3000?'석조 아파르트망 2층':m>=800?'가게 딸린 집':'4층 셋방';
  if(E==='peasant')return young?'성 밖 오두막':m>=300?'성 밖 문밖 마을의 셋집':'하숙집 침대 한 칸';
  return young?'공방 옆 한 칸 셋방':m>=1500?'공방 딸린 2층 셋집':m>=200?'골목 안 셋방':m>=40?'지붕 밑 다락방':'지하 방'}}
// 일곱 살부터 하는 일
const KID_ACTS=[
 {k:'k_play',n:'골목 친구들과 논다',s:'사교 +2',f:()=>say(pick(['골목 끝까지 굴렁쇠를 굴리며 달렸다.','숨바꼭질을 하다 해가 지는 줄도 몰랐다.','센 강가에서 물수제비를 떴다. 다섯 번 튀었다.'])+fx({soc:2}))},
 {k:'k_cate',n:'교리 공부를 한다',s:'신앙 +2, 학식 +1',f:()=>say(pick(['교리문답을 외웠다. 신부님이 고개를 끄덕였다.','성인들의 이야기를 들었다. 순교 대목에서 잠이 들 뻔했다.'])+fx({faith:2,edu:1}))},
 {k:'k_read',n:'책을 읽는다',s:'학식 +2',c:()=>lit(),f:()=>say(pick(['『텔레마코스의 모험』을 끝까지 읽었다.','이솝 우화를 소리 내어 읽었다.','성경 이야기책의 그림을 오래 들여다보았다.'])+fx({edu:2}))},
 {k:'k_help',n:'집안일을 거든다',s:'평판(가족) +2, 체력 +1',f:()=>say(pick(['물동이를 날랐다. 팔이 빠질 것 같았다.','동생들을 돌보며 어머니 대신 수프를 저었다.','장작을 쌓았다. 아버지가 머리를 쓰다듬었다.'])+fx({rfam:2,str:1}))},
 {k:'k_run',n:'뛰어놀며 몸을 키운다',s:'체력 +2, 건강 +1',f:()=>say(pick(['튈르리 정원을 몇 바퀴나 달렸다.','담장 위를 걸으며 균형을 잡았다.','성 밖 들판에서 연을 날렸다.'])+fx({str:2,hp:1}))},
 {k:'k_craft',n:'어른 곁에서 솜씨를 배운다',s:'기술 +1',f:()=>say(pick(['아버지 곁에서 연장 쓰는 법을 어깨너머로 보았다.','어머니에게 바느질을 배웠다. 손가락을 세 번 찔렸다.','가게에서 저울 다는 법을 배웠다.'])+fx({dex:1}))},
 {k:'k_friend',n:'친한 벗을 찾아간다',s:'가장 가까운 벗과 친밀 +',c:()=>relsAlive().length>0,f:()=>{const r=relsAlive().sort((a,b)=>b.close-a.close)[0];say(`${r.n}의 집에 놀러 가 해 질 녘까지 놀았다.`+relFx(r,{close:6,trust:3}))}},
 {k:'k_noble',n:'무용과 펜싱 수업을 받는다',s:'사교 +2, 의지 +1',c:()=>noble(),f:()=>say(pick(['무용 선생 앞에서 절하는 법을 백 번 연습했다.','목검으로 펜싱 자세를 익혔다. 선생은 아름답게 지는 법부터 가르쳤다.'])+fx({soc:2,cour:1}))},
 {k:'k_shop',n:'가게 일을 구경한다',s:'사교 +1, 학식 +1',c:()=>s.estate==='bourgeois',f:()=>say(pick(['계산대 뒤에서 손님들의 흥정을 구경했다.','아버지가 장부에 숫자를 적는 것을 따라 적었다.'])+fx({soc:1,edu:1}))}];
{const _ba=buildActs;buildActs=function(pin){if(!s)return;if(!child())return _ba(pin);
  if(s.age<7){pin.appendChild(el('p','mut','일곱 살이 되면 할 수 있는 일이 생깁니다.'));return}
  if(s.cond!=='normal'){pin.appendChild(el('p','mut','지금은 할 수 있는 일이 없다.'));return}
  pin.appendChild(el('p','mut','어린 시절의 활동은 각각 한 해에 한 번. 시간이 멈춘 동안 고를 수 있습니다.'));
  const box=el('div','acts');actButtons(KID_ACTS.filter(a=>{try{return !a.c||a.c()}catch(e){return false}}),box);pin.appendChild(box)}}

/* ---------- 시대: 정치 세력만 ---------- */
eraTab=function(H){H.innerHTML='';const pc=el('section','card polc');H.appendChild(pc);try{renderPolCard(pc)}catch(e){console.error(e)}buildPolitics(cardIn(H,'정치','La politique'))};
