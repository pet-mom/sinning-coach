/* ================= 개편 7 =================
   생활 탭: 카드 순서(생활 → 직업과 지위 → 교육 → 재산·거주지·소지품 → 수입과 지출), 교육 카드의 학교란, 승진은 같은 직업의 다음 계단만, 예술가·과학자 직업
   일상 탭: 머리말 없애기, 해마다 연도 표지는 그해 기록 위에, 벗과의 첫 만남 표지, 사건 결과 카드는 일상 탭 밖에서만, 방침 문구 삭제, 사건 창 잠시 내리기,
            역사 기록은 그 사건의 달과 그때의 나이로, 죽은 사람은 다시 나오지 않는다
   프로필 탭: ‘재능’ 접기
   관계 탭: 편지·선물(횟수 제한 없음), 애정 대신 로맨틱, 로맨틱 사건(방해물 계산)
   엔딩: 유언 아래 사인 */

/* ================= 생활 탭 ================= */
const RF7_ORDER=['생활','직업과 지위','교육','재산 · 거주지 · 소지품','수입과 지출'];
// 학교 이름: 내부 이름이 아니라 학교 이름으로
function rf7SchoolName(){const x=SCH();try{if(x.st==='college'||(x.school&&COL&&COL[x.school]))return collegeName();if(x.st==='convent')return convName()}catch(e){}return x.school||''}

/* ---------- 교육 카드의 학교란 ---------- */
let rf7Sch=null;
const RF7_SCH=[['class','수업','la classe'],['lib','도서실','la bibliothèque'],['yard','기숙사·운동장','la cour'],['master','선생님','le maître']];
const rf7Uni=()=>SCH().st==='univ',rf7Conv=()=>SCH().st==='convent',rf7Pet=()=>SCH().st==='petite';
const RF7_SACTS=[
 {k:'s_night',p:'class',n:'밤늦게까지 복습한다',s:'학식 +, 성적 +, 건강 -',f:()=>{addGrade(ri(2,4));say(pick(['기숙사 촛불이 꺼진 뒤에도 창가의 달빛에 기대어 공책을 넘겼다. 이튿날 아침 눈이 벌겠지만, 선생님의 질문에 막힘없이 답했다.','동사 변화표를 벽에 붙여 두고 잠들기 전에 소리 내어 외웠다. 옆 침대 아이가 베개를 던졌다.']) +fx({edu:2,hp:-1}))}},
 {k:'s_front',p:'class',n:'맨 앞자리에 앉아 손을 든다',s:'성적 +, 사교 ±',f:()=>{addGrade(ri(1,3));say(pick(['맨 앞자리에서 손을 들었다. 선생님이 처음으로 당신 이름을 기억해 불렀다. 뒷자리에서 누군가 “아첨쟁이”라고 속삭였다.','질문 하나가 수업을 삼십 분이나 붙잡았다. 선생님은 끝내 웃으며 “다음 시간에 답하마.”라고 했다.']) +fx({edu:1,orat:1}))}},
 {k:'s_contest',p:'class',n:()=>rf7Uni()?'공개 논증에 나선다':rf7Conv()?'낭독 발표회를 준비한다':'라틴어 작문 경시대회를 준비한다',s:'성적·명성 판정',c:()=>!rf7Pet(),inter:async()=>{sheetOpen(rf7Uni()?'공개 논증':rf7Conv()?'낭독 발표회':'라틴어 경시대회','le concours');shText(rf7Uni()?'강당의 교수들 앞에서 논제를 방어해야 한다. 질문은 사정없이 날아온다.':rf7Conv()?'수녀님들과 학부모들 앞에서 라신의 비극 한 대목을 낭독한다.':'파리의 콜레주들이 겨루는 경시대회(콩쿠르 제네랄)에 낼 라틴어 작문을 쓴다. 상은 소르본 강당에서 준다.','q');
   await shButtons([{l:'몇 주 동안 매달린다',s:'',a:'study'}]);const r=await roll(s.st.edu>=60?1:s.st.edu<35?-1:0,{label:'경시'});
   if(r.v>=5){addGrade(5);say('이름이 불렸다. 강당이 박수로 가득 찼다. 상으로 받은 책 표지에는 금박으로 학교 문장이 찍혀 있었다. 그날 저녁 식구들이 그 책을 돌려 가며 만져 보았다.'+fx({fame:2,edu:2,rfam:3}),'big')}
   else if(r.v>=3){addGrade(2);say('상은 받지 못했지만 심사 위원 하나가 당신 글의 한 문장에 밑줄을 그어 돌려주었다. “이 문장은 좋다.” 당신은 그 종이를 오래 간직했다.'+fx({edu:1}))}
   else{addGrade(-1);say('발표 날 머릿속이 하얘졌다. 외워 둔 문장이 하나도 떠오르지 않았다. 돌아오는 길, 당신은 다음에는 다를 거라고 몇 번이고 중얼거렸다.'+fx({cour:1}))}await done()}},
 {k:'s_book',p:'lib',n:'도서실에서 책을 빌린다',s:'학식 +',c:()=>lit(),f:()=>say(pick([T()<1789?'도서실 맨 위 칸의 플루타르코스 『영웅전』을 빌렸다. 카이사르 대목에서 밤을 새웠다.':'도서실에서 새로 들어온 『백과전서』 한 권을 빌렸다. 무거워서 두 손으로 안고 다녔다.','지리책의 지도를 베끼다가 아메리카 대륙의 해안선에서 손이 멈췄다. 저 끝에도 사람이 산다.'])+fx({edu:2}))},
 {k:'s_banned',p:'lib',n:'금서를 몰래 돌려 읽는다',s:'학식 +, 들킬 위험',c:()=>lit()&&!rf7Pet(),inter:async()=>{sheetOpen('침대 밑의 책','le livre défendu');shText(T()<1789?'기숙사 침대 밑으로 표지 없는 책이 돌고 있다. 볼테르의 소책자라는 소문이다.':'기숙사에서 몰래 돌려 읽는 신문이 있다. 사감은 정치 이야기를 금했다.','q');
   const i=await shButtons([{l:'이불 속에서 촛불을 켜고 읽는다',s:'',a:'bold study'},{l:'다음 사람에게 바로 넘긴다',s:'',a:'safe'}]);
   if(i===0){if(R()<.3){addGrade(-2);say('사감의 등불이 이불 위에서 멈췄다. 책은 압수되었고 당신은 일주일 동안 식당 맨 끝자리에서 빵과 물만 먹었다. 그래도 마지막 장까지는 읽었다.'+fx({edu:1,cour:1}))}else say('새벽까지 읽었다. 책장마다 누군가 연필로 밑줄을 그어 두었다. 당신도 한 줄에 밑줄을 보탰다.'+fx({edu:2,pol:2}))}
   else say('책을 다음 침대로 밀어 넣었다. 표지를 넘겨 보지도 않았지만, 그 책 이야기는 한 달 내내 기숙사를 떠돌았다.');await done()}},
 {k:'s_prank',p:'yard',n:'친구들과 장난을 친다',s:'사교 +, 성적 -',f:()=>{addGrade(-1);say(pick(['사감 신부의 모자에 몰래 깃털을 꽂았다. 그날 오후 미사 내내 모두가 웃음을 참느라 어깨를 떨었다.','운동장 담을 넘어 과자 가게에 다녀왔다. 돌아올 때 담 위에서 바지가 찢어졌다.','공놀이를 하다 식당 유리창을 깼다. 범인은 끝내 나오지 않았다. 모두가 함께 벌을 섰다.'])+fx({soc:2,cour:1}))}},
 {k:'s_sport',p:'yard',n:()=>isM()?'펜싱과 공놀이로 몸을 쓴다':'정원에서 산책과 춤 연습을 한다',s:'체력 +, 건강 +',f:()=>say(isM()?pick(['운동장에서 주드폼(손바닥 테니스)을 했다. 손바닥이 빨갛게 부었다.','펜싱 사범이 목검으로 당신 어깨를 툭 쳤다. “자세가 좋다.”']):pick(['수녀원 정원을 두 줄로 서서 산책했다. 장미 덩굴 너머로 바깥 거리의 소리가 들렸다.','미뉴에트 스텝을 연습했다. 선생님은 발끝이 아니라 마음으로 추라고 했다.']))+fx({str:2,hp:1})},
 {k:'s_play',p:'yard',n:'학교 연극에 나간다',s:'사교 +, 명성 +',c:()=>!rf7Pet(),f:()=>say(pick(['학년말 연극에서 라틴어 비극의 하인 역을 맡았다. 대사는 세 줄이었지만 객석의 부모들이 가장 크게 웃은 장면이었다.','연극 의상으로 받은 낡은 비단 망토를 입고 무대에 섰다. 커튼이 걷히는 순간 다리가 떨렸다.'])+fx({soc:2,fame:1}))},
 {k:'s_tutor',p:'master',n:'선생님께 따로 가르침을 청한다',s:'성적 +, 재산 -',cost:20,f:()=>{addGrade(ri(2,4));say(pick(['저녁마다 선생님 방에 찾아갔다. 난로 옆에서 선생님은 교과서에 없는 이야기를 해 주었다.','선생님은 당신 작문에 빨간 잉크로 빼곡히 적어 돌려주었다. 마지막 줄에는 “계속하라.”라고 쓰여 있었다.'])+fx({money:-20,edu:1}))}},
 {k:'s_confide',p:'master',n:'앞날에 대해 상담한다',s:'의지 +',c:()=>s.age>=12,f:()=>say(pick(['“무엇이 되고 싶으냐?” 선생님이 물었다. 당신은 대답하지 못했다. 선생님은 그것도 좋은 대답이라고 했다.','선생님은 창밖을 보며 말했다. “세상은 네가 생각하는 것보다 빨리 변할 거다. 무엇을 배우든 생각하는 법을 배워라.”'])+fx({cour:1,edu:1}))}];
function rf7SchoolBox(card){if(!inSchool()||s.cond!=='normal')return;
  const W=el('div','facw');W.appendChild(el('h3','ag','학교'));const g=el('div','fac-grid');const box=el('div','acts fac-acts');
  const list=k=>RF7_SACTS.filter(a=>a.p===k&&(!a.c||a.c())).map(a=>Object.assign({},a,{k:a.k,n:typeof a.n==='function'?a.n():a.n}));
  const draw=()=>{g.innerHTML='';box.innerHTML='';RF7_SCH.forEach(([k,n,fr])=>{if(!list(k).length)return;const b=el('button','fac'+(rf7Sch===k?' on':''));b.type='button';b.innerHTML=`<b>${n}</b><small>${fr}</small>`;b.onclick=()=>{rf7Sch=rf7Sch===k?null:k;draw()};g.appendChild(b)});
    if(rf7Sch){box.hidden=false;actButtons(list(rf7Sch),box)}else box.hidden=true};
  W.appendChild(el('p','mut small','학교에 다니는 동안 고를 수 있다. 각각 한 해에 한 번.'));W.appendChild(g);W.appendChild(box);draw();card.appendChild(W)}

{const _lt=lifeTab;lifeTab=function(H){_lt(H);try{
  const cards=[...H.querySelectorAll(':scope > section.card')];const byT=t=>cards.find(c=>{const h=c.querySelector('.ch h2');return h&&h.textContent.trim()===t});
  RF7_ORDER.map(byT).filter(Boolean).forEach(c=>H.appendChild(c));cards.filter(c=>!RF7_ORDER.map(byT).includes(c)).forEach(c=>H.appendChild(c));
  // 다음 자리: 같은 직업의 다음 계단만
  const job0=job(),c1=byT('직업과 지위');if(c1){const old=[...c1.querySelectorAll('p.small.mut')].find(p=>/^다음 자리/.test(p.textContent));if(old)old.remove();
    if(job0){const nx=rf7Next(job0).filter(p=>p.ok()&&canSex(p));if(nx.length)c1.appendChild(el('p','small mut',`다음 자리: ${nx.map(p=>`${pname(p)}${needText(p)?` (${needText(p)})`:''}`).join(' / ')}`))}}
  // 교육: 학교 이름 바로잡기 + 학교란
  const c4=byT('교육');if(c4){const p=c4.querySelector('p.small');if(p&&!inSchool()&&SCH().school){p.textContent=p.textContent.replace(/다닌 학교: [^ ·]+/,`다닌 학교: ${rf7SchoolName()}`)}rf7SchoolBox(c4)}
}catch(e){console.error(e)}}}

/* ---------- 승진: 같은 직업의 다음 계단만 ---------- */
const RF7_LINE={f1:['f2'],f2:['f3'],f3:['f4'],f4:['f5'],
  c1:['c2','c2c','c2k','c2l','c2t'],c2:['c3','c3t','c3h','c3l','c3m'],c2c:['c3b'],c2k:['c3s'],c2l:['c3t'],c2t:['c3p'],c3s:['c4'],c4:['c5'],c5:['c6'],
  l1:['l2'],l2:['l3'],l3:['l4','l4b'],l4:['l5b'],l4b:['l5b'],
  r1:['r2'],r2:['r3'],r3:['r4'],r4:['r5'],a1:['a2'],a2:['a3'],a3:['a4'],a4:['a5'],a5:['a6'],a6:['a7'],p1:['p2'],p2:['p3'],p3:['p4'],p4:['p5'],
  w0:['w1'],w2:['w3'],w3:['w4'],m1:['m2'],m2:['m3'],m3:['m4'],m4:['m5'],
  sv1:['sv2','sv2b'],sv2b:['sv3'],sv3:['sv4'],se1:['se2'],se2:['se3'],se3:['se4'],se4:['se5'],
  ar1:['ar2p','ar2m'],ar1m:['ar2o','ar2s','ar2z'],ar2c:['ar3'],ar2o:['ar3o'],ar2z:['ar3o'],ar2p:['ar3p'],ar2m:['ar3p'],ar3p:['ar4'],ar1s:['ar2k'],ar2k:['ar3k'],ar3k:['ar4'],ar1a:['ar2a'],ar2a:['ar3a'],
  st1b:['st2e'],st1d:['st2r'],st1f:['st2r'],st1g:['st2r'],st2r:['st3n'],st3n:['st4d'],st4d:['st5'],st1e:['st2b'],st1m:['st2b'],st2x:['st3i'],st3i:['st4'],
  pe1c:['pe2f'],pe1r:['pe2v','pe2p'],
  sc1:['sc2'],sc2:['sc3'],ch1:['ch2'],ch2:['sc3'],nt1:['nt2'],nt2:['sc3']};
function rf7Next(j){return (RF7_LINE[j.id]||[]).map(id=>POST[id]).filter(Boolean)}
promoCheck=async function(){const j=job();if(!j||j.tr==='pol'&&j.t>=3)return;const yrs=s.year-s.jobSince;
  const war=atWar()&&j.tr==='army',purge=j.tr==='army'&&T()>=1791.5&&T()<1795;if(yrs<(war?1:2))return;
  const next=rf7Next(j).filter(p=>meets(p)&&p.ok()&&canSex(p));if(!next.length)return;
  let p=PROMO_P[j.tr]||.06;if(war)p=.14;if(purge)p=.3;if(trait('야심'))p*=1.4;if(trait('신중'))p*=.8;if(R()>=p)return;const n=pick(next);
  const key=PROMO_KEY[j.tr]||['soc',45];const sk=(s.sk[mainSkill()]||s.kn[mainSkill()]||0);
  const {m,why}=md([[s.st[key[0]]>=key[1],1,FXN[key[0]]],[s.fame>=40,1,'명성'],[s.st[key[0]]<key[1]-20,-1,FXN[key[0]]+' 부족'],[!!patron(),1,'후원자'],[sk>=50,1,'숙련'],[sk<15&&['craft','med','art','sea','sci'].includes(j.tr),-1,'서툰 솜씨']]);
  const r=await roll(m,{label:`${pname(n)} 승진`,why});if(r.v>=4){takeJob(n.id,purge?'귀족 장교들이 떠난 자리를 메우며 ':'');if(n.tr==='army')fx({fame:2})}};

/* ---------- 예술가 · 과학자 ---------- */
TRACKS.sci='과학';TRACKS.art=TRACKS.art||'예술';PROMO_KEY.sci=['edu',65];PROMO_P.sci=.06;PROMO_KEY.art=PROMO_KEY.art||['dex',50];PROMO_P.art=PROMO_P.art||.06;
const rfAcad=()=>T()<1793.6||T()>=1795.8;
defineJob('ar1s','art',1,'조각 공방 제자','조각 공방 제자','élève sculpteur',80);
defineJob('ar2k','art',2,'조각가','조각가','sculpteur',900,{dex:45});
defineJob('ar3k','art',3,'아카데미 준회원 조각가',null,'sculpteur agréé',2000,{dex:60,fame:20},rfAcad);
defineJob('ar2z','art',2,'작곡가','작곡가','compositeur',1000,{edu:45});
defineJob('ar1a','art',1,'건축 사무소 제도사',null,'dessinateur d’architecte',250,{edu:35});
defineJob('ar2a','art',2,'건축가',null,'architecte',1500,{edu:50});
defineJob('ar3a','art',3,'왕립 건축 아카데미 회원',null,'architecte de l’Académie',3500,{edu:60,fame:30},rfAcad);
defineJob('sc1','sci',1,'천문대 조수','천문 계산 조수','élève astronome',300,{edu:45});
defineJob('sc2','sci',2,'천문학자',null,'astronome',1200,{edu:60});
defineJob('sc3','sci',3,'과학 아카데미 회원',null,'membre de l’Académie des sciences',3000,{edu:70,fame:30},rfAcad);
defineJob('ch1','sci',1,'약제사 실험실 조수',null,'aide-chimiste',200,{edu:40});
defineJob('ch2','sci',2,'화학자',null,'chimiste',1400,{edu:58});
defineJob('nt1','sci',1,'왕립 식물원 조수','식물 표본 화가','aide-naturaliste',250,{edu:40});
defineJob('nt2','sci',2,'박물학자',null,'naturaliste',1200,{edu:55});
// 진로 고르기: 과학·예술의 길을 열고, 같은 길에서는 첫 계단 가운데 하나를 고른다
['bourgeois','noble'].forEach(E=>['M','F'].forEach(x=>{const a=RF_TRK[E]&&RF_TRK[E][x];if(a&&!a.includes('sci'))a.push('sci');if(a&&!a.includes('art'))a.push('art')}));
RF_WHY.sci={M:'천문대, 실험실, 식물원. 별과 원소와 풀잎을 재는 일이다',F:'계산과 표본 그림으로 학자들을 돕는다. 여자에게 열린 자리는 드물다'};
if(!RF_WHY.art)RF_WHY.art={M:'화실, 조각 공방, 건축 사무소. 손과 눈으로 사는 길이다',F:'화실과 무대의 길'};
rfEntries=function(first){const E=noble()?'noble':s.estate,sx=isM()?'M':'F';const trs=(RF_TRK[E]||RF_TRK.artisan)[sx]||[];const o=[];
  for(const tr of trs){let mint=((RF_MINT[E]||{})[tr])||1;if(tr==='craft'&&!isM())mint=Math.max(mint,2);
    const rows=PL.filter(x=>x[1]===tr&&x[2]>=mint).map(x=>POST[x[0]]).filter(p=>p.ok()&&canSex(p)&&meets(p,true)&&p.id!==s.job).sort((a,b)=>a.t-b.t);if(!rows.length)continue;
    const low=rows.filter(p=>p.t===rows[0].t);const p=pick(low);const why=(RF_WHY[tr]||{})[sx]||'';o.push({id:p.id,why})}
  return o};

/* ================= 일상 탭 ================= */
// 연도 표지는 그해 기록들 위에: 새 기록은 맨 위 연도 표지 바로 아래에 끼운다
flushLog=function(){const box=logBox||$('#log');if(!box||!s)return;
  for(;shown<s.log.length;shown++){const e=s.log[shown];const n=entryNode(e);const f=box.firstElementChild;
    if(e.k!=='yr'&&f&&f.classList.contains('yr'))f.after(n);else box.prepend(n)}
  while(box.childElementCount>360)box.lastElementChild.remove();foldLog()};
// 방침 문구 없애기 · 죽은 사람은 다시 나오지 않는다(기억·애도 문장은 남는다)
const RF7_DEADOK=/세상을 떠|죽|숨을 거|처형|단두대|전사|무덤|장례|부고|기억|떠올|그리|생전|유품|유산|잃|기일|애도|추모|묘/;
{const _L7=L;L=function(t,k='ev',d){try{if(s){let x=String(t);
    if(k==='sys'&&/^방침 /.test(x)){x=x.replace(/^방침 [^.]*\.\s*/,'').replace(/^살림/,'한 해 살림');t=x}
    if(['ev','big','story','dark'].includes(k)&&!(d&&d.choice)&&!RF7_DEADOK.test(x)){
      const dead=(s.rel||[]).filter(r=>!r.alive&&r.n&&r.n.length>=3).map(r=>r.n);if(s.spouse&&!s.spouse.alive&&!s.divorced&&s.spouse.n&&s.spouse.n.length>=3)dead.push(s.spouse.n);
      if(dead.some(n=>x.includes(n)))return}}}catch(e){}return _L7(t,k,d)}}
// 역사 기록: 그 사건이 일어난 달과 그때의 나이로
{const _rh=runHistory;runHistory=async function(a,b){const n0=s.log.length;const hs=(histSorted||HIST.slice().sort((x,y)=>x.mi-y.mi||x.i-y.i)).filter(h=>h.mi>a&&h.mi<=b);await _rh(a,b);
  try{let j=0;for(let i=n0;i<s.log.length&&j<hs.length;i++){const e=s.log[i];if(e.k!=='hist')continue;while(j<hs.length){const h=hs[j];const tx=typeof h.text==='function'?null:h.text;j++;if(!h.text)continue;if(tx&&tx!==e.t)continue;
      e.m=h.mi%12;e.y=Math.floor(h.mi/12);e.a=Math.max(0,Math.floor((h.mi-(s.by*12+s.bm))/12));break}}}catch(e){console.error(e)}}}
// 사건 창 머리의 날짜와 화면 위쪽의 날짜를 맞춘다
{const _so=sheetOpen;sheetOpen=function(t,fr){_so(t,fr);try{$('#age').textContent=s.age;$('#subline').innerHTML=`<b>${s.given[0]} ${s.sur[0]}</b> · ${ym()} · <span class="mut">1년 ≈ ${secPerYear()}초</span>`}catch(e){}rf7SheetBar()}}
// 사건 결과 카드는 일상 탭이 아닐 때만
{const _to=toast;toast=function(t){if(typeof curTab!=='undefined'&&curTab==='daily'&&!rf7ToastForce)return;return _to(t)}}
let rf7ToastForce=false;
// 사건 창 잠시 내리기
function rf7SheetBar(){const sh=$('#sheet');if(!sh)return;let b=$('#shMin');if(!b){b=el('button','shmin','▾ 잠시 내리기');b.id='shMin';b.type='button';b.onclick=()=>rf7Minimize(true);const host=sh.querySelector('.sh-top')||sh.firstElementChild||sh;host.appendChild(b)}
  rf7Minimize(false)}
function rf7Minimize(on){const sh=$('#sheet');let pill=$('#shBack');
  if(!pill){pill=el('button','shback');pill.id='shBack';pill.type='button';pill.onclick=()=>rf7Minimize(false);document.body.appendChild(pill)}
  if(on&&sheetLive){sh.hidden=true;document.body.classList.remove('modal');pill.innerHTML=`<span>▴ 사건으로 돌아가기</span><small>${$('#shT').textContent}</small>`;pill.hidden=false}
  else{pill.hidden=true;if(sheetLive){sh.hidden=false;document.body.classList.add('modal')}}}
{const _sc=sheetClose;sheetClose=function(){_sc();const p=$('#shBack');if(p)p.hidden=true}}
// 벗과의 첫 만남은 다른 표지로
{const _bm=bfMake;bfMake=function(k){const n0=s.log.length;const r=_bm(k);try{for(let i=n0;i<s.log.length;i++){const e=s.log[i];if(/에서 .*만났다\.$/.test(e.t)&&e.k==='ev'){e.k='meet';try{rebuildLog()}catch(x){}break}}}catch(e){}return r}}

/* ================= 프로필 탭: 재능 접기 ================= */
{const _bi=buildInfo;buildInfo=function(pin){_bi(pin);try{const h=[...pin.querySelectorAll(':scope > h3')].find(x=>/^재능/.test(x.textContent.trim()));if(!h)return;
  const g=h.nextElementSibling;const d=el('details','fold');d.appendChild(el('summary',null,'재능'));h.replaceWith(d);if(g&&g.tagName!=='H3'&&g.tagName!=='DETAILS')d.appendChild(g)}catch(e){console.error(e)}}}

/* ================= 관계 탭: 편지 · 선물 · 로맨틱 ================= */
const rf7Rom=r=>r.rom||0;
const RF7_LET=[
 {l:'안부를 묻는다',s:'친밀 +',lit:1,f:r=>`${r.n}에게 안부 편지를 보냈다. 날씨와 빵값과 식구들 이야기를 적었다.`+fx({pen:1})+relFx(r,{close:4,trust:1})},
 {l:'속마음을 털어놓는다',s:'신뢰 +',lit:1,f:r=>`${r.n}에게 요즘의 걱정을 털어놓는 편지를 썼다. 쓰고 나니 마음이 조금 가벼워졌다.`+fx({pen:1})+relFx(r,{trust:5,close:2})},
 {l:'함께한 추억을 적는다',s:'친밀 ++',lit:1,f:r=>{let m='';if(r.core&&s.bf){const ms=s.bf.mem.filter(x=>x.k.includes(r.core));if(ms.length){const x=pick(ms);bfWake(x.id);m=` ${x.y}년의 일을 떠올리며 적었다.`}}return `${r.n}에게 어린 날의 일을 적어 보냈다.${m}`+fx({pen:1})+relFx(r,{close:6})}},
 {l:'세상일을 논한다',s:'존경 또는 경쟁심',lit:1,f:r=>{const near=Math.abs((r.pol||0)-(s.pol||0))<30;return `${r.n}에게 시국에 대한 생각을 적어 보냈다. ${near?'생각이 맞닿는 데가 많았다.':'답장에는 날 선 반박이 가득할 것 같았다.'}`+fx({pen:1})+relFx(r,near?{resp:4,close:2}:{riv:4,close:-2})}},
 {l:'연서를 쓴다',s:'로맨틱 +',lit:1,rom:1,f:r=>{const g=rf7RomAdd(r,ri(7,11));return pick([`${r.n}에게 쓴 편지를 세 번 고쳐 썼다. 마지막 줄에는 차마 쓰지 못한 말 대신 말린 제비꽃 한 송이를 끼워 넣었다.`,`촛불 아래서 ${r.n}에게 편지를 썼다. “당신의 편지를 기다리는 날이 내 한 주의 전부입니다.” 봉랍을 누르는 손이 떨렸다.`])+fx({pen:1})+relFx(r,{close:2})+g}}];
const RF7_GIFT=[
 {l:'꽃다발',p:6,s:'친밀 +',f:r=>`${r.n}에게 시장에서 산 꽃다발을 보냈다. 제철 꽃이라 값은 싸고 향은 진했다.`+relFx(r,{close:4})},
 {l:'책 한 권',p:15,s:'존경 +',f:r=>`${r.n}에게 책 한 권을 보냈다. 첫 장에 짧은 헌사를 적었다.`+relFx(r,{close:3,resp:3})},
 {l:'과자와 초콜릿',p:10,s:'친밀 +',f:r=>`${r.n}에게 팔레루아얄 과자점의 초콜릿 상자를 보냈다. 리본을 두 번 고쳐 맸다.`+relFx(r,{close:4})},
 {l:'포도주 한 상자',p:30,s:'친밀 +, 신뢰 +',f:r=>`${r.n}에게 부르고뉴 포도주 한 상자를 보냈다. “우리가 함께 비울 날을 위해.”라고 적었다.`+relFx(r,{close:4,trust:3})},
 {l:'레이스 손수건',p:25,s:'로맨틱 +',rom:1,f:r=>`${r.n}에게 이니셜을 수놓은 레이스 손수건을 보냈다. 손수건 한 모서리에 당신 이름의 첫 글자를 아주 작게 수놓았다.`+relFx(r,{close:2})+rf7RomAdd(r,ri(6,9))},
 {l:'초상 메달',p:60,s:'로맨틱 ++',rom:1,f:r=>`${r.n}에게 당신의 작은 초상을 넣은 메달을 보냈다. 뚜껑을 닫으면 그냥 은 메달이다. 열면 당신이 있다.`+relFx(r,{close:3})+rf7RomAdd(r,ri(9,13))},
 {l:'향수 한 병',p:40,s:'로맨틱 +',rom:1,f:r=>`${r.n}에게 향수 한 병을 보냈다. 당신이 늘 뿌리던 그 향이었다.`+relFx(r,{close:2})+rf7RomAdd(r,ri(6,10))}];
function rf7RomAdd(r,n){if(child())return '';r.rom=clamp(rf7Rom(r)+n,0,100);return ` (${r.n.split(' ')[0]}: 로맨틱 +${n})`}
{const _pp=personPage;personPage=function(r){_pp(r);if(!r)return;try{const pin=$('#pin');
  // 애정 → 로맨틱
  pin.querySelectorAll('.pf-stats .aff').forEach(x=>x.remove());const g=pin.querySelector('.pf-stats');if(g&&!g.querySelector('.rom')){const v=rf7Rom(r);const d=el('div','ps rom');d.innerHTML=`<span>로맨틱</span><s><u style="width:${v}%"></u></s><b>${v}</b>`;g.insertBefore(d,g.children[1]||null)}
  // 편지·선물: 횟수 제한 없음
  [...pin.querySelectorAll('button')].filter(x=>/편지 보내기/.test(x.textContent)).forEach(x=>x.remove());pin.querySelectorAll('.letter-ch').forEach(x=>x.remove());
  [...pin.querySelectorAll('p.mut.small.center')].filter(x=>/편지/.test(x.textContent)).forEach(x=>x.remove());
  if(!r.alive||child()||s.cond==='prison')return;
  const b=el('button','pill pri wide','✉ 편지 · 선물 보내기');b.type='button';
  b.onclick=()=>{const box=el('div','letter-ch');const sec=(t,list,gift)=>{box.appendChild(el('div','lab',t));list.forEach(o=>{const c=el('button','opt row');c.type='button';const sp=el('span');sp.appendChild(el('span','ol',o.l));sp.appendChild(el('small',null,o.s+(gift?` · ${o.p} ${money()}`:'')));c.appendChild(sp);
      c.disabled=(o.lit&&!lit())||(gift&&s.money<o.p);c.onclick=()=>{s.acts['let_'+(r.fid||r.pid)]=s.year;if(gift)s.money-=o.p;const t=o.f(r);L(t+(gift?` (재산 -${o.p})`:''),'ev');save();toast(t.replace(/\s*\([^()]*\)/g,''));personPage(r);render();rf7RomCheck()};box.appendChild(c)})};
    sec('편지',RF7_LET);sec('선물',RF7_GIFT,true);if(!lit())box.appendChild(el('p','mut small','글을 몰라 편지는 쓸 수 없다. 선물은 보낼 수 있다.'));b.replaceWith(box)};
  pin.appendChild(b)}catch(e){console.error(e)}}}

/* ---------- 로맨틱 사건: 로맨틱 80 이상, 방해물 계산 ---------- */
function rf7Obstacles(r){const o=[];const P=typeof perOf==='function'?perOf(r):null;
  if(s.married&&s.spouse&&s.spouse.alive&&!s.divorced)o.push(['wed','당신에게는 이미 배우자가 있다']);
  if(r.mar||(r.kids>0)||(P&&['danton','desmoulins','lucile'].includes(P.id)))o.push(['wed2',`${r.n.split(' ')[0]}에게는 이미 가정이 있다`]);
  if((typeof priest==='function'&&priest())||(typeof nun==='function'&&nun()))o.push(['vow','당신은 성직의 서원을 했다']);
  if(r.cler||/신부|수녀|신학/.test(r.job||''))o.push(['vow2',`${r.n.split(' ')[0]}은(는) 성직자다`]);
  const fp=s.party&&r.fac&&typeof facPair==='function'?facPair(s.party,r.fac):0;if(fp<=-40||Math.abs((r.pol||0)-(s.pol||0))>=70)o.push(['pol','두 사람은 정치적으로 서로 다른 편에 서 있다']);
  const nb=e=>['epee','robe','hobereau'].includes(e);if(r.estate&&nb(s.estate)!==nb(r.estate))o.push(['cls','두 집안의 신분이 다르다']);
  if(r.sex===s.sex)o.push(['same','세상은 두 사람의 사랑을 죄라고 부른다']);
  return o.map(x=>x[1].replace('은(는)',/[가-힣]/.test(r.n.split(' ')[0].slice(-1))&&bat(r.n.split(' ')[0])?'은':'는'))}
async function rf7RomCheck(){if(!s||s.dead||sheetLive||child()||s.cond!=='normal')return;const r=(s.rel||[]).find(r=>r.alive&&rf7Rom(r)>=80&&!r.romEv);if(!r)return;r.romEv=s.year;
  const N=r.n.split(' ')[0],obs=rf7Obstacles(r);
  if(!obs.length){const i=await Q('고백',"l’aveu",`${jo(N,'이','가')} 당신의 편지 다발을 리본으로 묶어 들고 찾아왔다. 손이 떨리고 있다. “편지마다 같은 말을 하고 있었어. 이제 직접 듣고 싶어.”`,[{l:'“사랑해.”라고 말한다',a:'social family'},{l:'“우리 혼인하자.”라고 청한다',a:'family',dis:r.sex===s.sex},{l:'아직은 친구로 남자고 한다',a:'safe'}]);
    if(i===0){r.role='연인';say(`${jo(N,'이','가')} 웃었다. 우는 것처럼. 그날 저녁 두 사람은 센 강변을 걸었다. 강물에 비친 가로등 불빛이 둘의 그림자를 하나로 겹쳐 놓았다.`+relFx(r,{close:10,trust:8}),'big')}
    else if(i===1){r.role='배우자';s.married=true;s.spouse={n:r.n,age:Math.max(16,s.year-(r.by||s.by)),alive:true,pay:0,estate:r.estate||s.estate,rid:r.fid||r.pid};
      say(`${jo(N,'은','는')} 대답 대신 당신 손을 꼭 쥐었다. 몇 달 뒤 ${typeof bfPar==='function'?bfPar():'본당'}에서 혼례를 올렸다. 하객석 맨 앞에서 오랜 벗들이 울고 웃었다.`+fx({rfam:4})+relFx(r,{close:15,trust:10}),'big')}
    else{r.rom=60;say(`${jo(N,'은','는')} 고개를 끄덕였다. “알았어. 기다릴게.” 그 말이 오래 마음에 걸렸다.`+relFx(r,{close:-2}))}
    await done();return}
  const why=obs.join('. ')+'.';
  const i=await Q('고백','l’aveu impossible',`${jo(N,'이','가')} 늦은 밤 찾아왔다. 당신이 보낸 편지들이 품에 안겨 있다. “우리는 안 되는 거 알아. ${why} 그래도 한 번은 말하고 싶었어.”`,[{l:'몰래 사랑을 이어 간다',a:'bold',s:'들킬 위험'},{l:'모든 것을 걸고 함께하자고 한다',a:'bold family',s:'큰 대가'},{l:'마음을 접자고 한다',a:'safe'}]);
  if(i===0){r.role='연인';r.secret=1;say(`그날부터 두 사람의 편지에는 둘만 아는 암호가 생겼다. 만나는 곳은 늘 달랐고, 헤어질 때는 늘 먼저 뒤돌아섰다. 행복과 두려움이 같은 무게로 쌓여 갔다.`+fx({cour:1,rfam:-3})+relFx(r,{close:8}),'big');if(R()<.4){say('얼마 지나지 않아 소문이 돌았다. 골목 사람들이 당신을 보는 눈이 달라졌다.'+fx({rloc:-6,rfam:-5,sus:obs.some(x=>/정치/.test(x))?5:0}),'dark')}}
  else if(i===1){const ok=R()<.35;if(ok){r.role='연인';say(`당신은 모든 것을 걸었다. ${obs.some(x=>/배우자|가정/.test(x))?'이혼 법정에, ':''}${obs.some(x=>/신분/.test(x))?'집안의 반대에, ':''}${obs.some(x=>/편/.test(x))?'동지들의 눈총에, ':''}끝내 굴하지 않았다. 대가는 컸지만, 그 사람의 손은 끝까지 당신 손 안에 있었다.`+fx({rfam:-10,rloc:-4,cour:3})+relFx(r,{close:15,trust:12}),'big')}
    else{r.rom=40;say(`당신은 모든 것을 걸려 했다. 그러나 세상이 먼저 움직였다. ${jo(N,'은','는')} 어느 날 짧은 편지 한 장만 남기고 파리를 떠났다. “당신까지 잃게 할 수는 없었어.”`+fx({hp:-3,cour:-1})+relFx(r,{close:-5}),'dark')}}
  else{r.rom=50;say(`“그래, 그게 맞아.” ${jo(N,'이','가')} 웃으려 했다. 문이 닫히고 나서야 당신은 울었다. 그 편지들은 서랍 맨 아래 칸에 리본으로 묶여 남았다.`+relFx(r,{close:-3}),'dark');try{if(r.core)bfReg('r_rom_'+r.core,r.core,`${N}의 고백에 마음을 접자고 했다.`)}catch(e){}}
  await done()}
{const _rd7=rfDaily;rfDaily=async function(){await _rd7();if(!s||s.dead)return;try{await rf7RomCheck()}catch(e){console.error(e)}}}

/* ================= 엔딩: 유언 아래 사인 ================= */
{const _se=showEnd;showEnd=function(){_se();try{const w=$('#obWill');if(!w||!s||!s.death)return;const d=s.death;
  const c=d.cause==='ill'?d.detail:(CAUSE[d.cause]||d.detail||'알 수 없음');const t=`사인 · ${c}${d.cause!=='ill'&&d.detail&&d.detail!==c?` (${d.detail})`:''} · ${d.year}년 ${d.age}세`;
  if(!w.querySelector('.wl-c'))w.appendChild(el('span','wl-c',t))}catch(e){console.error(e)}}}
// 사건 결과 카드(resultCard)도 일상 탭에서는 띄우지 않고, 일상 탭으로 오면 감춘다
{const _rc=resultCard;resultCard=function(h,d){if(typeof curTab!=='undefined'&&curTab==='daily'){const b=$('#toast');if(b)b.hidden=true;return}return _rc(h,d)}}
{const _st7=setTab;setTab=function(t){_st7(t);if(t==='daily'){const b=$('#toast');if(b)b.hidden=true}}}
