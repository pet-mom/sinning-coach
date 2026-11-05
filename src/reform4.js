/* ================= 개편 4 =================
   - 단두대에서 죽으면 마지막 말이 당파(또는 성향)에 따라 달라진다
   - 벗이 단두대에서 죽으면 그에 맞는 애도의 선택지가 뜬다
   (일상 줄의 양식은 style.css, 첫 영성체 사건 삭제는 engine.js) */

/* ---------- 단두대의 마지막 말 ---------- */
const RF4_GRP=p=>({jacobin:'jac',neojacobin:'jac',babeuf:'jac',cordelier:'cord',indulgent:'ind',girondin:'gir',
  feuillant:'mod',monarchien:'mod',patriote:'mod',plaine:'mod',thermidor:'mod',ideologue:'mod',philosophe:'mod',parlement:'mod',
  royalist:'roy',absolutist:'roy',devot:'roy',clichy:'roy',ultra:'roy',legitimist:'roy'})[p]||null;
// 실제 인물의 유명한 말은 쓰지 않는다. 두 문장, 비슷한 결로 새로 쓴 말.
const RF4_LAST={
 jac:{noble:'태어난 문장(紋章)을 버리고 공화국을 택했노라. 공화국이 나를 버려도, 나는 공화국을 버리지 않으리.',bourg:'나는 덕을 믿었고 그 믿음대로 살았다. 내 목은 여기서 끝나도 공화국은 내일 아침에도 깨어날 것이다.',common:'빵 한 덩이, 투표 한 장. 내가 바란 건 그게 다였어. 공화국 만세, 그래도 만세다.'},
 cord:{noble:'인민의 이름을 부르던 입들이 이제 내 이름을 지우는구나. 북을 울려라, 나는 웃으며 오르겠노라.',bourg:'구 회의장의 그 시끄러운 밤들이 그립군. 칼날이 빠른 것만은 고맙다.',common:'생탕투안 골목 사람들한테 전해 줘. 나는 끝까지 고개 안 숙였다고.'},
 ind:{noble:'그만 멈추자 했을 뿐이노라. 자비를 청한 것이 죄라면, 나는 기꺼이 죄인으로 가겠노라.',bourg:'피로 씻은 칼은 다시 피를 찾는다. 내가 먼저 그 말을 했을 뿐이다.',common:'이제 그만 죽이자고 했어. 그 말 한마디가 이렇게 비쌀 줄은 몰랐네.'},
 gir:{noble:'자유를 위해 일어선 자들이 자유의 이름으로 서로를 베는구나. 그래도 나는 그 이름을 원망하지 않노라.',bourg:'함께 온 동지들이 노래를 부른다. 한 사람씩 노래가 줄어들어도, 마지막 소절은 내가 부르겠다.',common:'노래 불러 줘, 우리 다 같이 부르던 그거. 끝까지 부르면서 갈래.'},
 mod:{noble:'법을 믿었노라. 그 법이 오늘 나를 데리러 왔구나.',bourg:'나는 늘 법과 절차를 말했다. 법의 이름으로 끝나는 것이 이토록 조용할 줄은 몰랐다.',common:'법대로 하자고 했을 뿐인데. 법이 사람을 이렇게 데려가네.'},
 roy:{noble:'국왕 만세. 조상들이 지킨 이름을 나도 지켰으니, 부끄럽지 않게 그분들 곁으로 가노라.',bourg:'왕과 제단을 끝까지 버리지 않았다. 하느님, 이 도시를 너그럽게 보아 주소서.',common:'임금님 편이었던 거 후회 안 해. 하느님, 저 사람들도 언젠간 알게 해 주세요.'},
 none:{noble:'어느 깃발도 들지 않았노라. 이 시대에는 그것이 가장 무거운 죄였던 모양이구나.',bourg:'나는 어느 편에도 서지 않았다. 이 시대에는 가운데 서 있는 것이 가장 위험한 자리였다.',common:'난 아무 편도 아니었어. 그냥 내 식구들이랑 살고 싶었을 뿐이야.'}};
function rf4Grp(){return RF4_GRP(s.party)||(s.pol>=35?'jac':s.pol<=-25?'roy':'none')}
{const _fl=fnLast;fnLast=function(){try{if(s&&s.death&&s.death.cause==='guillotine'&&s.age>=14){const st=noble()?'noble':s.estate==='bourgeois'?'bourg':'common';return RF4_LAST[rf4Grp()][st]}}catch(e){console.error(e)}return _fl()}}

/* ---------- 단두대에서 떠난 벗을 애도한다 ---------- */
const rf4Pit=()=>{const t=T();return t<1794.24?'마들렌 묘지':t<1794.45?'에랑시 묘지':t<1794.57?'픽퓌스의 구덩이':'에랑시 묘지'};
const rf4Terror=()=>T()>=1793.2&&T()<1794.65;
async function rf4Guillo(r){const k=r.core||r.pid,N=r.n.split(' ')[0],a=(r.dead||s.year)-(r.by||(typeof perOf==='function'&&perOf(r)?perOf(r).b:s.by)),pit=rf4Pit(),tr=rf4Terror();
  const ms=(s.bf&&s.bf.mem||[]).filter(m=>m.k.includes(k));const first=ms[0];
  const gift=typeof G_CORE_GIFT!=='undefined'&&G_CORE_GIFT[k];const ob=typeof G_CORE_OBJ!=='undefined'&&G_CORE_OBJ[k];const has=ob&&bfHas(ob);
  const obN={feather:'참새 깃털',button:'은단추',ribbon:'푸른 리본'}[ob];
  await bfScene(`${N}의 마지막 수레`,'l’échafaud',`${jo(N,'이','가')} 단두대에 올랐다. ${a}세였다. 수레가 혁명 광장으로 가는 동안 구경꾼들은 웃고 떠들었다. 시신은 다른 이들과 함께 ${pit}에 던져졌다. 무덤도, 이름을 새긴 돌도 없다.${first?` 당신은 ${first.y}년의 일을 떠올렸다. ${first.t}`:''}${tr?' 이 도시에서 처형된 사람을 대놓고 슬퍼하는 것은 위험한 일이다.':''}`,[
   {l:`밤에 몰래 ${pit} 담장 밑에 꽃을 놓고 온다`,a:'bold family',f:()=>{bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 당신은 밤에 몰래 ${pit} 담장 밑에 꽃을 놓고 왔다.`,{tone:'그리움',place:pit});if(first)bfRe(first.id,`${jo(N,'이','가')} 단두대에 오른 날, 이 기억을 꽃과 함께 담장 밑에 두고 왔다.`,'그리움');
     say(`달도 없는 밤이었다. 담장 너머에서 생석회 냄새가 났다. 당신은 들꽃 한 줌을 담장 밑 흙 위에 놓고, 그 사람의 이름을 아주 작게 한 번 불렀다. 대답 대신 개 짖는 소리가 멀리서 들렸다. 돌아오는 길 내내 누가 뒤따라오는 것 같았다.`+fx({cour:2,sus:tr?5:1}),'big')}},
   {l:`문을 걸어 잠그고 ${N}의 이름으로 미사를 드린다`,a:'pious',f:()=>{bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 당신은 문을 걸어 잠그고 그 이름으로 기도를 드렸다.`,{tone:'위로'});
     say(`${tr?'선서 거부 신부가 숨어 사는 다락방을 찾아갔다. 촛불 하나, 낡은 성작 하나. ':''}신부는 죽은 이의 이름을 묻고 라틴어 기도문 사이에 그 이름을 넣었다. “${N}.” 한 번도 미사에서 불릴 줄 몰랐던 이름이었다. 당신은 무릎을 꿇고 그 이름이 다 사라질 때까지 일어나지 않았다.`+fx({faith:3,sus:tr?4:0}),'big')}},
   {l:'남겨진 가족을 찾아가 돕는다',a:'family',f:()=>{const m=Math.min(Math.max(0,s.money),Math.round(40*(price(s.year)||1)));bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 당신은 남겨진 가족을 찾아가 돈과 빵을 건넸다.`,{tone:'위로'});
     say(`처형된 사람의 재산은 공화국이 거두어 갔다. 문이 봉인된 집 앞 계단에 ${N}의 가족이 앉아 있었다. 당신은 빵과 돈 꾸러미를 건넸다. 아무도 고맙다는 말을 하지 않았다. 다만 가장 어린 아이가 당신 소매를 오래 붙잡고 놓지 않았다.`+fx({money:-m,rloc:1,sus:tr?3:0}),'big')}},
   gift?{l:`${jo(gift[1],'으로')} 혼자 작별한다`,a:'social',f:()=>{bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 무덤이 없어 ${jo(gift[1],'으로')} 혼자 작별했다.`,{tone:'그리움'});
     say(`무덤이 없으니 작별할 곳도 없었다. 당신은 둘만 아는 곳에서 ${jo(gift[1],'으로')} 혼자 작별했다. 아무도 보지 않았고, 그래서 마음껏 울 수 있었다.`,'big')}}:null,
   has?{l:`간직해 온 ${jo(obN,'을','를')} 센 강에 띄워 보낸다`,a:'family',f:()=>{bfLose(ob,`${jo(N,'이','가')} 단두대에 오른 날 센 강에 띄워 보냈다`);bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 관이 없어 간직해 온 ${jo(obN,'을','를')} 센 강에 띄워 보냈다.`,{tone:'그리움',place:'센 강'});
     say(`관이 없으니 넣어 줄 곳도 없었다. 당신은 퐁뇌프 난간에서 ${jo(obN,'을','를')} 강물에 놓았다. 그것은 잠시 물 위에 떠 있다가 다리 그늘 속으로 사라졌다. 어린 시절의 한 조각이 그렇게 흘러갔다.`,'big')}}:null,
   {l:'아무에게도 슬픔을 보이지 않는다',a:'safe',f:()=>{bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 당신은 아무에게도 슬픔을 보이지 않았다.`,{tone:'죄책감'});bfReg('r_guil_'+k,k,`${jo(N,'이','가')} 단두대에 오른 날, 슬퍼하는 것조차 숨겼다.`);
     say(`구 회의에서 누군가 ${N}의 이름을 비웃었다. 당신도 따라 웃었다. 집에 돌아와 문을 닫고 나서야 손이 떨리기 시작했다. 그날 밤 당신은 한숨도 자지 못했다.`+fx({sus:-3,cour:-2}),'dark')}}])}
{const _gc=gCore;gCore=async function(r){if(r&&r.dc==='guillotine')return rf4Guillo(r);return _gc(r)}}

/* ---------- 관계 탭: 가족 줄을 누르면 가족 기록이 열린다 ---------- */
function rf4FamPage(p){const pin=openPanel('가족');pin.innerHTML='';
  const top=el('div','pp-top noimg');top.innerHTML=`<div><b style="font-size:1.25rem">${p.n}</b><div class="mut">${p.role}${p.n!==p.role?'':''} · ${p.alive?`${p.age}세`:p.note}</div></div>`;pin.appendChild(top);
  const keys=p.fam==='fa'?['아버지']:p.fam==='mo'?['어머니']:p.fam==='sp'?[s.spouse&&s.spouse.n,isM()?'아내':'남편'].filter(Boolean):[p.n];
  const hits=s.log.filter(e=>['ev','big','dark','story'].includes(e.k)&&keys.some(k=>k&&String(e.t).includes(k))).slice(-8).reverse();
  pin.appendChild(el('h3',null,'함께한 기록'));
  if(!hits.length)pin.appendChild(el('p','mut','아직 기록에 남은 일이 없다.'));
  else{const ul=el('ul','infl');hits.forEach(e=>ul.appendChild(el('li',null,`${e.a}세 · ${String(e.t).replace(/\s*\([^()]*[+-]\d[^()]*\)/g,'')}`)));pin.appendChild(ul)}}
{const _rm=relMore;relMore=function(H){_rm(H);try{const fam=famPeople();H.querySelectorAll('.prow').forEach(b=>{if(!b.querySelector('.pic.fam'))return;const nm=b.querySelector('b')&&b.querySelector('b').textContent;const p=fam.find(x=>x.n===nm);if(p)b.onclick=()=>rf4FamPage(p)})}catch(e){console.error(e)}}}
