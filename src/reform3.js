/* ================= 개편 3 =================
   1. 1789년 이전의 연표 사건에는 태도 창을 띄우지 않는다 (reform2.js의 rf2CanAsk)
   2. 시작 신분은 넷: 대귀족 · 하급귀족 · 부르주아 · 도시 서민
   3. 대귀족·하급귀족·부르주아는 시작 화면과 게임 사이에 초상을 고른다(성별마다 다른 판화). 고른 초상은 세례 증서에 들어간다. 도시 서민은 고르지 않는다.
   4. 혁명기, 벗들끼리 정치 이념으로 부딪치는 장면 */

/* ---------- 2. 신분 넷 ---------- */
ESTATES.hobereau.n='하급귀족';ESTATES.hobereau.fr='petite noblesse';ESTATES.hobereau.d='작위는 있으나 살림은 넉넉지 않은 하급 귀족 집안.';
const RF3_EST=['epee','hobereau','bourgeois','artisan'];
rollPre=function(){const sex=R()<.5?'M':'F';const PW={epee:.8,hobereau:1.7,bourgeois:16,artisan:81.5};const estate=wpick(Object.entries(PW));const nm=rollName(sex,estate,'paris');
  pre={sex,estate,given:nm.g[0],givenFr:nm.g[1],sur:nm.f[0],surFr:nm.f[1],year:ri(1750,1790),month:ri(1,12),day:ri(1,28)};fillPre()};
{const es=$('#estSel');if(es){const v=es.value;es.innerHTML=RF3_EST.map(k=>`<option value="${k}">${ESTATES[k].n}</option>`).join('');if(RF3_EST.includes(v))es.value=v}
  if(typeof pre!=='undefined'&&pre&&!RF3_EST.includes(pre.estate))rollPre();else if(typeof pre!=='undefined'&&pre)fillPre()}

/* ---------- 3. 초상 고르기 ---------- */
// 판화마다 얼굴이 있는 곳(x·y %)과 확대 배율: 세례 증서의 타원 안에 머리와 어깨가 들어오게
const RF3_POR={F:[['sel_f1.jpg',50,9,2.3],['sel_f2.jpg',52,20,2],['sel_f3.jpg',46,9,2.3],['sel_f4.jpg',40,9,2.2],['sel_f5.jpg',30,10,2.2],['sel_f6.jpg',50,7,2.2]],
  M:[['sel_m1.jpg',57,6,2.4],['sel_m2.jpg',54,8,2.2],['sel_m3.jpg',44,7,2.4],['sel_m4.jpg',45,30,1.25]]};
const rf3PorNeed=e=>['epee','hobereau','bourgeois'].includes(e);
function rf3PorOf(f){for(const k in RF3_POR){const x=RF3_POR[k].find(p=>p[0]===f);if(x)return x}return null}
function rf3Pick(sex){return new Promise(res=>{const list=RF3_POR[sex==='F'?'F':'M'];let sel=null;
  const W=el('div','porsel');W.setAttribute('role','dialog');W.setAttribute('aria-label','초상 고르기');
  const inn=el('div','ps-in');inn.innerHTML=`<div class="ps-h"><h2>초상</h2><span class="fr">Le portrait</span></div><p class="ps-d">세례 증서에 들어갈 초상을 고르세요.</p>`;
  const g=el('div','ps-grid');const cred=el('p','ps-cred','');
  list.forEach(([f])=>{const b=el('button','ps-it');b.type='button';b.setAttribute('aria-pressed','false');const im=el('img');im.src=imgSrc(f);im.alt=(IMGS[f]&&IMGS[f].title)||'초상';im.decoding='async';b.appendChild(im);
    b.onclick=()=>{sel=f;g.querySelectorAll('.ps-it').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));go.disabled=false;cred.textContent=typeof credLine==='function'?credLine(f):''};g.appendChild(b)});
  inn.appendChild(g);inn.appendChild(cred);
  const bar=el('div','ps-bar');const back=el('button','pill','← 돌아가기');back.type='button';const go=el('button','pill pri','이 초상으로 시작');go.type='button';go.disabled=true;
  back.onclick=()=>{W.remove();res(null)};go.onclick=()=>{if(!sel)return;W.remove();res(sel)};bar.appendChild(back);bar.appendChild(go);inn.appendChild(bar);
  W.appendChild(inn);document.body.appendChild(W);W.scrollTop=0})}
$('#goB').onclick=async()=>{const g=$('#inGiven').value.trim(),sr=$('#inSur').value.trim();
  const o={hard:true,sex:pre.sex,estate:pre.estate,year:+$('#bY').value,month:+$('#bM').value,day:+$('#bD').value,given:g||pre.given,givenFr:(!g||g===pre.given)?pre.givenFr:'',sur:sr||pre.sur,surFr:(!sr||sr===pre.sur)?pre.surFr:''};
  if(rf3PorNeed(o.estate)){const f=await rf3Pick(o.sex);if(!f)return;o.portrait=f}
  start(true,o)};
{const _ns=newState;newState=function(o){const x=_ns(o);x.portrait=o&&o.portrait&&rf3PorNeed(x.estate)?o.portrait:null;return x}}
// 세례 증서(신분증 카드)의 초상
{const _rp=renderProfile;renderProfile=function(){_rp();try{if(!s)return;
  // 평민(초상을 고르지 않는 신분)은 세례 증서의 초상 틀을 비워 둔다
  if(!rf3PorNeed(s.estate)){const b=document.querySelector('#profCard .pf2-por');if(b){b.innerHTML='';b.classList.add('pf2-empty');b.setAttribute('aria-hidden','true')}return}
  if(!s.portrait)return;const p=rf3PorOf(s.portrait);const box=document.querySelector('#profCard .pf2-por');if(!p||!box)return;
  box.innerHTML='';const d=el('div','pf2-sel');d.style.backgroundImage=`url("${imgSrc(p[0])}")`;d.style.backgroundSize=`${p[3]*100}% auto`;d.style.backgroundPosition=`${p[1]}% ${p[2]}%`;d.setAttribute('role','img');d.setAttribute('aria-label','초상');
  d.title=typeof credLine==='function'?credLine(p[0]):'';box.appendChild(d)}catch(e){console.error(e)}}}

/* ---------- 4. 혁명기, 벗들끼리 부딪치다 ---------- */
const rf3Two=(a,b)=>[a,b].every(k=>bfMet(k)&&bfAlive(k)&&!bfR(k).cut&&bfR(k).cond!=='prison');
const rf3Win=(a,b)=>bfRev()&&!child()&&s.age>=16&&T()>=a&&T()<b;
const cf=(k,id,when,run)=>RF2_SIDE.push({k,id,when,run,pri:1});

cf('etienne','cf_oath',()=>rf3Win(1791,1792.6)&&rf3Two('etienne','jules'),async()=>{const E=bN('etienne'),J=bN('jules');const pr=/신부/.test(bfR('jules').job||'');
  await bfScene('선서','le serment civique',`${bfPar()} 앞 광장. 구민 몇 사람과 함께 온 ${bI('etienne')} 성당 계단 위의 ${jo(J,'을','를')} 올려다보며 소리친다. “헌법에 선서해. 오늘 해. 안 하면 너는 국민의 적이야.” ${bU('jules')} 얼굴이 하얗게 질려 말을 더듬는다. “야, 양심은… 서, 선서로 바꿀 수 있는 게 아니야.” ${pr?'그의 사제복 소매가 떨리고 있다.':'신학생의 검은 옷자락이 떨리고 있다.'} 사람들이 하나둘 모여든다. 두 사람이 동시에 당신을 본다.`,[
   {l:'에티엔 곁에 서서 “법은 모두에게 같아야 해.”라고 말한다',a:'radical',f:()=>{bfMem('m_cf_oath',['etienne','jules'],`${bfPar()} 앞에서 ${bI('etienne')} ${J}에게 선서를 요구했다. 당신은 에티엔 편에 섰다. 법은 모두에게 같아야 한다고 말했다.`,{tone:'씁쓸함',place:bfPar()+' 앞',their:'그 사람까지 저쪽에 서 있었다. 그날 계단이 그렇게 높은 줄 처음 알았다.'});
     bfRel('etienne',{close:6,trust:4});bfRel('jules',{close:-10,trust:-8,riv:6});bfSet('jules','cfOath','against');s.pol=clamp(s.pol+4,-100,100);
     say(`${bU('etienne')} 당신 어깨를 툭 쳤다. ${bU('jules')} 아무 말 없이 성당 안으로 들어가 문을 닫았다. 그 문이 닫히는 소리가 광장 끝까지 들렸다. 그날 저녁 에티엔은 신이 나서 떠들었지만, 당신은 그 소리를 오래 잊지 못했다.`+fx({rpeople:2,faith:-1}))}},
   {l:'쥘 앞을 막아서며 “양심은 법이 정하는 게 아니야.”라고 말한다',a:'pious bold',f:()=>{bfMem('m_cf_oath',['etienne','jules'],`${bfPar()} 앞에서 ${bI('etienne')} ${J}에게 선서를 요구했다. 당신은 쥘 앞을 막아섰다.`,{tone:'두려움',place:bfPar()+' 앞',their:'그 사람이 내 앞에 섰다. 말을 더듬지 않아도 되었다. 그 사람이 대신 말해 주었으니까.'});
     bfRel('jules',{close:10,trust:10});bfRel('etienne',{close:-6,riv:8});bfSet('etienne','cfOath','against');s.pol=clamp(s.pol-4,-100,100);
     say(`구민들이 웅성거렸다. ${bI('etienne')} 이를 악물고 당신을 보았다. “너까지 그러는구나.” ${bHe('etienne')}는 돌아섰지만, 모퉁이에서 한 번 뒤돌아보았다. 계단 위에서 ${bU('jules')} 처음으로 더듬지 않고 “고마워.”라고 말했다.`+fx({cour:2,faith:1,sus:T()>=1792?3:1}))}},
   {l:'둘 사이에 서서 “오늘은 그냥 돌아가자.”라고 달랜다',a:'social',f:()=>{const ok=R()<.35+s.st.soc/250;bfMem('m_cf_oath',['etienne','jules'],`${bfPar()} 앞에서 ${bW('etienne')} ${J} 사이에 섰다. ${ok?'그날은 둘 다 물러섰다':'아무도 물러서지 않았다'}.`,{tone:ok?'위로':'씁쓸함',place:bfPar()+' 앞'});
     if(ok){bfRel('etienne',{close:2});bfRel('jules',{close:3});say(`당신은 ${bL('etienne')} 팔을 붙들고 광장 밖으로 끌고 나왔다. 선술집에서 포도주 한 병을 비우는 동안 ${bU('etienne')} 씩씩거리다 결국 웃었다. “쥘 녀석, 어릴 때부터 고집은 세었지.” 그 웃음이 오래가지는 않으리라는 것을, 둘 다 알고 있었다.`+fx({soc:1}))}
     else{bfRel('etienne',{close:-3});bfRel('jules',{close:-3});say(`“너는 늘 그렇게 가운데 서 있지.” ${bI('etienne')} 쏘아붙였다. ${bU('jules')} 당신 눈을 피했다. 양쪽 모두에게 당신은 아무 편도 아닌 사람이 되었다.`)}}}])});

cf('gabriel','cf_varennes',()=>rf3Win(1791.45,1792.2)&&rf3Two('gabriel','etienne'),async()=>{const Ga=bN('gabriel'),E=bN('etienne');
  await bfScene('바렌 뒤의 카페','après Varennes',`왕 일가가 바렌에서 붙잡혀 돌아온 지 며칠 뒤, 팔레루아얄의 카페. ${bU('gabriel')} 은테 손거울을 탁자에 탁 내려놓는다. “왕은 납치당한 거야. 오를레앙 공 패거리가 꾸민 일이라고.” ${bI('etienne')} 컵을 쾅 내려놓는다. “도망친 왕을 감싸는 놈도 배신자야.” 옆 탁자 사람들이 돌아본다. ${bU('gabriel')} 장갑을 벗어 손에 쥔다. 결투를 신청하려는 손짓이다.`,[
   {l:'에티엔 편을 들어 “왕은 국민을 버렸어.”라고 말한다',a:'radical',f:()=>{bfMem('m_cf_var',['gabriel','etienne'],`바렌 사건 뒤 팔레루아얄 카페에서 ${bW('gabriel')} ${jo(E,'이','가')} 부딪쳤다. 당신은 왕이 국민을 버렸다고 말했다.`,{tone:'씁쓸함',place:'팔레루아얄',their:'그 사람마저 저쪽이었다. 나는 장갑을 다시 끼었다. 손이 떨려서 단추를 잘못 채웠다.'});
     bfRel('etienne',{close:6});bfRel('gabriel',{close:-8,riv:6});s.pol=clamp(s.pol+5,-100,100);
     say(`${bU('gabriel')} 장갑을 천천히 다시 끼었다. 손가락 하나하나에. “알았어. 너희는 너희 공화국이나 해.” ${bHe('gabriel')}가 나간 뒤, 탁자 위에 은테 손거울이 남아 있었다. 당신은 그것을 주머니에 넣었다가 사흘 뒤에야 돌려주었다. ${bHe('gabriel')}는 고맙다는 말도 하지 않았다.`+fx({rpeople:1}))}},
   {l:'가브리엘 편을 들어 “왕을 심판할 권리는 아무에게도 없어.”라고 말한다',a:'royal',f:()=>{bfMem('m_cf_var',['gabriel','etienne'],`바렌 사건 뒤 팔레루아얄 카페에서 ${bW('gabriel')} ${jo(E,'이','가')} 부딪쳤다. 당신은 가브리엘 편을 들었다.`,{tone:'두려움',place:'팔레루아얄',their:'그 사람이 내 편을 들었다. 카페 안의 누구도 그러지 않았는데.'});
     bfRel('gabriel',{close:8,trust:6});bfRel('etienne',{close:-8,riv:8});s.pol=clamp(s.pol-5,-100,100);
     say(`카페 안이 조용해졌다. ${bI('etienne')} 의자를 밀치고 일어섰다. “기억해 둘게.” 문이 쾅 닫혔다. ${bU('gabriel')} 장갑을 탁자에 내려놓더니 웃었다. 그런데 그 웃음이 끝나기도 전에 ${bHe('gabriel')}는 창밖을 내다보며 낮게 말했다. “저 녀석, 정말 기억해 둘 거야.”`+fx({relite:2,sus:2}))}},
   {l:'장갑을 빼앗아 들고 “결투는 내가 대신 받지.” 하고 농담한다',a:'social bold',f:()=>{const ok=R()<.5+s.st.soc/300;bfMem('m_cf_var',['gabriel','etienne'],`바렌 사건 뒤 팔레루아얄 카페에서 ${bW('gabriel')} ${jo(E,'이','가')} 부딪쳤다. 당신은 가브리엘의 장갑을 빼앗아 들고 농담을 했다.`,{tone:ok?'기쁨':'씁쓸함',place:'팔레루아얄'});
     if(ok){bfRel('gabriel',{close:4});bfRel('etienne',{close:4});say(`옆 탁자에서 누군가 웃음을 터뜨렸다. ${bU('gabriel')} 어이없다는 듯 당신을 보더니 결국 따라 웃었다. ${bU('etienne')} 웃지 않았지만, 다시 앉았다. 그날 셋은 밤늦게까지 같은 탁자에 앉아 있었다. 정치 이야기는 한 마디도 하지 않았다.`+fx({soc:2}))}
     else{bfRel('gabriel',{close:-3});bfRel('etienne',{close:-3});say(`아무도 웃지 않았다. ${bU('gabriel')} 장갑을 낚아채 갔고, ${bU('etienne')} 계산도 하지 않고 나가 버렸다. 당신 혼자 세 사람 몫의 커피값을 냈다.`+fx({money:-3}))}}}])});

cf('louise','cf_sept',()=>rf3Win(1792.7,1793.3)&&rf3Two('louise','jules'),async()=>{const Lo=bN('louise'),J=bN('jules');
  await bfScene('9월의 저녁','après Septembre',`9월의 학살이 지나간 뒤, ${bN('louise')}의 빵집 뒷방. ${bU('louise')} 반죽을 치대며 말한다. “감옥의 귀족들이랑 신부들이 적군이 오면 문을 열어 주려 했대. 우리 아이들 다 죽이려고.” 구석에 앉아 있던 ${bU('jules')} 수프 그릇을 내려놓는다. 카름 수도원에서 죽은 사제들 가운데 그를 가르친 신부님이 있었다. “그, 그분은 아무것도 안 했어. 기도만… 했어.” 반죽을 치대던 손이 멈춘다.`,[
   {l:'“루이즈, 그건 소문이야.”라고 말한다',a:'pious social',f:()=>{bfMem('m_cf_sept',['louise','jules'],`9월 학살 뒤, ${Lo}의 빵집 뒷방에서 그 일이 소문 때문이었다고 말했다. ${bU('louise')} 오래 대답하지 않았다.`,{tone:'씁쓸함',place:'빵집 뒷방',their:'그 사람은 내가 들은 걸 소문이라고 했다. 나는 소문밖에 들을 수 없는 사람이었다. 글을 모르니까.'});
     bfRel('jules',{close:8,trust:6});bfRel('louise',{close:-6});s.pol=clamp(s.pol-3,-100,100);
     say(`${bU('louise')} 반죽을 다시 치대기 시작했다. 아까보다 세게. “너는 글을 읽으니까 다 알겠지.” 그날 당신은 꽁다리를 얻어먹지 못했다. 돌아가는 길에 ${bU('jules')} 당신 소매를 붙잡았다가, 아무 말도 못 하고 놓았다.`)}},
   {l:'“루이즈 말도 틀리진 않아.”라고 말한다',a:'radical',f:()=>{bfMem('m_cf_sept',['louise','jules'],`9월 학살 뒤, ${Lo}의 빵집 뒷방에서 루이즈 편을 들었다. ${bU('jules')} 수프를 남기고 나갔다.`,{tone:'죄책감',place:'빵집 뒷방',their:'그 사람도 그렇게 생각하는 줄 몰랐다. 그날 밤 나는 신부님의 이름을 혼자 불렀다.'});
     bfRel('louise',{close:6});bfRel('jules',{close:-10,trust:-8});s.pol=clamp(s.pol+4,-100,100);
     say(`${bU('jules')} 숟가락을 내려놓고 조용히 일어섰다. 문간에서 “자, 잘 먹었어.”라고 말했다. 한 번도 더듬지 않았다. 그게 더 무서웠다. ${bU('louise')} 남은 수프를 당신 그릇에 부어 주면서도 문 쪽을 자꾸 보았다.`+fx({rpeople:1}))}},
   {l:'아무 말 없이 쥘의 손을 잡는다',a:'family',f:()=>{bfMem('m_cf_sept',['louise','jules'],`9월 학살 뒤, ${Lo}의 빵집 뒷방에서 아무 말 없이 ${J}의 손을 잡았다.`,{tone:'위로',place:'빵집 뒷방',their:'그 사람이 손을 잡았다. 루이즈가 그걸 보고 반죽을 내려놓았다. 그날은 그걸로 충분했다.'});
     bfRel('jules',{close:6});bfRel('louise',{close:2});
     say(`${bU('louise')} 그 손을 보더니 반죽을 내려놓았다. 한참 뒤 그녀가 말했다. “그 신부님… 너한테 성가 가르쳐 준 분이지?” ${bU('jules')} 고개를 끄덕였다. 그날 밤 셋은 정치 이야기를 하지 않았다. 대신 어린 시절 종탑 이야기를 했다.`)}}])});

cf('antoine','cf_max',()=>rf3Win(1793.4,1794.6)&&rf3Two('antoine','louise'),async()=>{const A=bN('antoine'),Lo=bN('louise');
  await bfScene('최고가격제','le maximum',`최고가격제가 시행되었다. 비누 한 덩이, 설탕 한 근에도 값이 정해졌다. 밤늦게 ${bI('antoine')} 찾아와 문을 두드린다. “설탕 상자 여섯 개만 네 지하실에 맡아 줘. 한 달이면 돼.” 이튿날 아침에는 ${bI('louise')} 찾아온다. “우리 구 위원회에서 사재기꾼을 고발하재. ${A} 가게 뒤창고에 상자가 쌓여 있는 걸 봤어. 네가 같이 가서 말해 줘. 너는 글을 아니까.”`,[
   {l:'지하실에 앙투안의 상자를 숨겨 준다',a:'greedy bold',f:()=>{bfMem('m_cf_max',['antoine','louise'],`최고가격제 시절, ${A}의 설탕 상자를 지하실에 숨겨 주었다. ${bN('louise')}에게는 아무것도 모른다고 했다.`,{tone:'두려움',their:'그 사람이 상자를 맡아 주었다. 그 덕에 살았다. 루이즈를 볼 때마다 그 생각이 났다.'});
     bfRel('antoine',{close:10,trust:10});bfRel('louise',{trust:-8});bfReg('r_cf_max','louise',`${bN('louise')}에게 사재기꾼을 모른다고 거짓말했다.`);
     say(`한밤중, 상자들이 하나씩 계단을 내려왔다. 설탕 냄새가 지하실에 배었다. 이튿날 ${bN('louise')}에게 아무것도 모른다고 하자, 그녀는 당신 얼굴을 오래 보더니 “알았어.” 하고 돌아섰다. 한 달 뒤 ${bU('antoine')} 설탕 한 근을 놓고 갔다. 당신은 그 설탕을 끝내 먹지 못했다.`+fx({money:30,sus:6}))}},
   {l:'루이즈와 함께 위원회에 가서 증언한다',a:'radical',f:()=>{bfMem('m_cf_max',['antoine','louise'],`최고가격제 시절, ${bW('louise')} 함께 구 위원회에 가서 ${A}의 창고를 증언했다.`,{tone:'죄책감',their:'그 사람이 증언했다. 벌금으로 끝났지만, 나는 그 사람 얼굴을 다시 볼 수 없었다.'});
     bfRel('louise',{close:6,trust:6});bfRel('antoine',{close:-14,trust:-12,hate:8});bfSet('antoine','cfMax','told');s.pol=clamp(s.pol+5,-100,100);
     say(`위원회 서기가 당신의 말을 받아 적었다. 사흘 뒤 ${bN('antoine')}의 창고 문에 봉인이 붙었다. 벌금과 압수로 끝났다. 감옥은 피했다. 그 뒤로 생드니 거리에서 ${bU('antoine')} 당신을 보면 길을 건넜다. ${bU('louise')} 압수된 설탕이 구민들에게 나눠지던 날 당신 몫까지 받아 왔다.`+fx({rpeople:3,sus:-4}))}},
   {l:'앙투안에게 몰래 알려 정해진 값에 팔게 한다',a:'social',f:()=>{const ok=R()<.55;bfMem('m_cf_max',['antoine','louise'],`최고가격제 시절, ${A}에게 고발이 있을 거라고 몰래 알려 주었다. ${ok?bHe('antoine')+'는 이튿날 정해진 값에 설탕을 내놓았다':bHe('antoine')+'는 듣지 않았다'}.`,{tone:ok?'위로':'씁쓸함'});
     if(ok){bfRel('antoine',{close:6,resp:6});bfRel('louise',{close:2});say(`이튿날 아침 ${bN('antoine')}의 가게 앞에 “설탕 있음 · 최고가격”이라는 쪽지가 붙었다. 줄이 골목 끝까지 섰다. 위원회 사람들이 왔다가 빈손으로 돌아갔다. ${bU('louise')} 그 줄에 서 있다가 당신을 보고 눈을 찡긋했다. 알고 있었던 것이다.`+fx({rloc:2}))}
     else{bfRel('antoine',{close:-3});bfRel('louise',{trust:-4});say(`${bU('antoine')} 코웃음을 쳤다. “위원회? 다 아는 사람들이야.” 사흘 뒤 창고에 봉인이 붙었다. ${bU('louise')} 위원회 문 앞에서 당신을 기다리다 혼자 들어갔다. 둘 다 당신에게 서운했다.`)}}}])});

cf('etienne','cf_list',()=>rf3Win(1793.7,1794.55)&&rf3Two('etienne','gabriel'),async()=>{const E=bN('etienne'),Ga=bN('gabriel');
  await bfScene('명단','la liste des suspects',`구 혁명감시위원회 사무실. 등잔 아래 ${bI('etienne')} 혐의자 명단 초안을 당신 앞에 밀어 놓는다. 손가락이 한 이름 위에 멈춘다. ${Ga}. “옛 귀족들과 어울린다는 신고가 세 번 들어왔어.” ${bHe('etienne')}는 당신을 보지 않고 말한다. “그 녀석, 정말 공화국의 적이야? 네 말 한마디면 돼. 지울 수도 있고.”`,[
   {l:'“내가 보증해. 그 애는 겉멋만 들었지 아무 짓도 안 해.”',a:'bold social',f:()=>{bfMem('m_cf_list',['etienne','gabriel'],`공포정치 때, ${E}의 혐의자 명단에 오른 ${Ga}의 이름을 보증으로 지웠다.`,{tone:'두려움',their:bfR('gabriel')?'나중에야 알았다. 그 사람이 나를 보증했다는 걸. 그날 이후 나는 그 사람에게 목숨을 빚졌다.':null});
     bfRel('gabriel',{trust:12,close:6});bfRel('etienne',{trust:-4});
     say(`${bU('etienne')} 한참 펜을 들고 있다가 그 이름 위에 줄을 그었다. “네 이름으로 지우는 거야. 알지?” 당신은 고개를 끄덕였다. 그날부터 당신의 이름도 어딘가에 적혔다. 그 사실을 ${bU('gabriel')} 몇 해 뒤에야 알게 되었다.`+fx({sus:8,cour:3}))}},
   {l:'“모르겠어. 요즘은 아무도 모르잖아.”',a:'safe',f:()=>{bfMem('m_cf_list',['etienne','gabriel'],`공포정치 때, ${jo(E,'이','가')} ${Ga}에 대해 물었다. 모르겠다고 대답했다.`,{tone:'죄책감'});bfReg('r_cf_list','gabriel',`${bN('etienne')}의 명단에 ${Ga}의 이름이 있을 때 보증하지 않았다.`);bfRel('etienne',{close:-2});
     say(`${bU('etienne')} 명단을 접었다. 이름은 그대로 남았다. 그 주에 ${bU('gabriel')} 파리를 떠나 시골 친척 집으로 숨었다. 누가 알려 주었는지는 아무도 몰랐다. 당신은 그 일을 오래 생각했다. 지우지도, 적지도 않은 그 이름을.`+fx({sus:-2}))}},
   {l:'“그 애는 늘 왕 편이었어.”라고 말한다',a:'radical',f:()=>{bfMem('m_cf_list',['etienne','gabriel'],`공포정치 때, ${E}의 혐의자 명단에 오른 ${jo(Ga,'이','가')} 늘 왕 편이었다고 말했다.`,{tone:'죄책감'});bfRel('etienne',{trust:6});bfRel('gabriel',{trust:-15,hate:10});bfSet('gabriel','cfList','told');s.pol=clamp(s.pol+5,-100,100);
     bfReg('r_cf_list2','gabriel',`${bN('etienne')}의 명단 앞에서 ${jo(Ga,'이','가')} 왕 편이었다고 말했다.`);
     say(`${bU('etienne')} 아무 말 없이 펜을 내려놓았다. 이튿날 위원들이 생토노레 거리의 그 집에 갔지만, ${bU('gabriel')} 이미 떠난 뒤였다. 창가에 푸른 리본 하나가 걸려 있었다고 했다. 당신은 그 말을 듣고 잠을 이루지 못했다.`+fx({sus:-5,rpeople:1}))}}])});

cf('gabriel','cf_gourdin',()=>rf3Win(1794.7,1795.7)&&rf3Two('gabriel','etienne'),async()=>{const Ga=bN('gabriel'),E=bN('etienne');
  await bfScene('몽둥이','le gourdin',`테르미도르 뒤. ${bU('gabriel')} 이제 금빛 청년단의 맨 앞줄에 선다. 귀를 덮는 머리, 넥타이를 높이 맨 목, 손에는 납을 박은 몽둥이. 생토노레 거리에서 당신을 붙잡고 웃는다. “에티엔 어디 숨었는지 알지? 그 녀석이 우리 아버지 이름을 명단에 적었어.” 당신은 ${bI('etienne')} 어느 다락방에 숨어 있는지 알고 있다.`,[
   {l:'“몰라. 파리를 떴다던데.”라고 거짓말한다',a:'bold',f:()=>{bfMem('m_cf_gourdin',['gabriel','etienne'],`테르미도르 뒤, 몽둥이를 든 ${Ga}에게 ${E}의 은신처를 모른다고 거짓말했다.`,{tone:'두려움',their:bfR('etienne')?'그 사람이 나를 숨겨 주었다는 걸 나중에 알았다. 가브리엘에게 거짓말을 했다는 것도.':null});
     bfRel('etienne',{close:10,trust:12});bfRel('gabriel',{trust:-4});bfBrave();
     say(`${bU('gabriel')} 당신 얼굴을 한참 보더니 어깨를 으쓱했다. “그래? 아깝네.” ${bHe('gabriel')}가 돌아선 뒤 당신은 다리가 풀려 벽에 기댔다. 그날 밤, 다락방에 빵과 초를 가져다주었다. ${bU('etienne')} 처음으로 당신 앞에서 울었다.`+fx({cour:3}))}},
   {l:'“그만둬. 그러면 너도 그 녀석이랑 똑같아.”라고 말한다',a:'social bold',f:()=>{bfMem('m_cf_gourdin',['gabriel','etienne'],`테르미도르 뒤, 몽둥이를 든 ${Ga}에게 그러면 에티엔과 똑같다고 말했다.`,{tone:'씁쓸함',their:'그 사람 말이 맞았다. 그래서 그날 몽둥이를 강물에 던졌다. 다음 날 새 몽둥이를 샀지만.'});
     bfRel('gabriel',{resp:8,close:-2});
     say(`${bU('gabriel')} 웃음을 거두었다. 몽둥이 끝이 길바닥을 몇 번 두드렸다. “똑같다고?” 그러고는 아무 말 없이 가 버렸다. 그날 저녁 센 강에 몽둥이 하나가 떠내려갔다는 이야기를, 당신은 나중에 들었다.`)}},
   {l:'아무 대답도 하지 않는다',a:'safe',f:()=>{bfMem('m_cf_gourdin',['gabriel','etienne'],`테르미도르 뒤, 몽둥이를 든 ${jo(Ga,'이','가')} ${E}의 은신처를 물었다. 아무 대답도 하지 않았다.`,{tone:'의문'});bfRel('gabriel',{close:-2});bfRel('etienne',{close:-2});
     say(`침묵이 길어졌다. ${bU('gabriel')} 피식 웃었다. “너는 옛날부터 그랬어. 늘 아무 편도 아니지.” 그 말이 칼처럼 박혔다. 그 주에 ${bU('etienne')} 다락방을 옮겼다. 누가 알려 주었는지는 묻지 않았다.`)}}])});

