/* ================= 개편 4 =================
   - 단두대에서 죽으면 마지막 말이 당파(또는 성향)에 따라 달라진다
   - 벗이 단두대에서 죽으면 그에 맞는 애도의 선택지가 뜬다
   (일상 줄의 양식은 style.css, 첫 영성체 사건 삭제는 engine.js) */

/* ---------- 단두대의 마지막 말 ---------- */
const RF4_GRP=p=>({jacobin:'jac',neojacobin:'jac',babeuf:'jac',cordelier:'cord',indulgent:'ind',girondin:'gir',
  feuillant:'mod',monarchien:'mod',patriote:'mod',plaine:'mod',thermidor:'mod',ideologue:'mod',philosophe:'mod',parlement:'mod',
  royalist:'roy',absolutist:'roy',devot:'roy',clichy:'roy',ultra:'roy',legitimist:'roy'})[p]||null;
const RF4_LAST={
 jac:{noble:'나는 태어난 신분을 버리고 공화국을 택했노라. 공화국이 나를 버리는구나. 그래도 공화국 만세.',bourg:'나는 덕과 공화국을 위해 살았다. 내 머리가 떨어져도 공화국은 남을 것이다. 공화국 만세!',common:'공화국 만세! 나는 빵과 평등을 위해 싸웠어. 내 머리 값은 인민이 매기겠지.'},
 cord:{noble:'인민의 벗이라 불리던 자들이 인민의 이름으로 나를 죽이는구나. 웃음이 나오는군.',bourg:'코르들리에의 북소리가 그립군. 내 머리를 인민에게 보여 주게. 그만한 값어치는 있으니.',common:'내 머리를 들어서 구경꾼들한테 보여 줘. 생탕투안 사람들은 날 알아볼 거야.'},
 ind:{noble:'관용을 말한 것이 죄라면, 나는 기꺼이 그 죄인이 되겠노라.',bourg:'관용을 청한 것이 내 죄였다. 피는 피를 부를 뿐이다. 언젠가 모두 알게 되겠지.',common:'그만 좀 죽이자고 했을 뿐이야. 그게 죄라면, 그래, 나 죄인이야.'},
 gir:{noble:'오 자유여, 너의 이름으로 얼마나 많은 죄가 저질러지는가. 「라 마르세예즈」의 마지막 절을 마저 불러 다오.',bourg:'오 자유여, 너의 이름으로 얼마나 많은 죄가 저질러지는가! 우리는 노래하며 간다. 공화국 만세.',common:'노래 불러 줘. 「라 마르세예즈」. 우리 동지들처럼 노래하면서 갈래.'},
 mod:{noble:'나는 법과 헌법을 믿었노라. 그 법이 나를 죽이는구나.',bourg:'나는 헌법과 법을 믿었다. 법의 이름으로 죽는 것이 이렇게 쓸쓸할 줄은 몰랐다.',common:'법대로 하자고 했을 뿐인데. 법이 이렇게 사람을 죽이네.'},
 roy:{noble:'국왕 만세! 주여, 이 나라를 용서하소서. 나는 내 조상들 곁으로 가노라.',bourg:'국왕 만세! 하느님, 프랑스를 용서하소서. 저들은 자기가 무엇을 하는지 모릅니다.',common:'임금님 만세! 하느님, 이 사람들을 용서해 주세요. 뭘 하는지 몰라서 그래요.'},
 none:{noble:'나는 아무 편도 아니었노라. 그것이 죄였던 모양이구나.',bourg:'나는 어느 편도 아니었다. 이 시대에는 그것이 가장 큰 죄였던 모양이다.',common:'난 아무 편도 아니었어. 그냥 살고 싶었을 뿐이야.'}};
function rf4Grp(){return RF4_GRP(s.party)||(s.pol>=35?'jac':s.pol<=-25?'roy':'none')}
{const _fl=fnLast;fnLast=function(){try{if(s&&s.death&&s.death.cause==='guillotine'&&s.age>=14){const st=noble()?'noble':s.estate==='bourgeois'?'bourg':'common';return RF4_LAST[rf4Grp()][st]}}catch(e){console.error(e)}return _fl()}}

/* ---------- 단두대에서 떠난 벗을 애도한다 ---------- */
const rf4Pit=()=>{const t=T();return t<1794.24?'마들렌 묘지':t<1794.45?'에랑시 묘지':t<1794.57?'픽퓌스의 구덩이':'에랑시 묘지'};
const rf4Terror=()=>T()>=1793.2&&T()<1794.65;
async function rf4Guillo(r){const k=r.core,N=r.n.split(' ')[0],a=(r.dead||s.year)-r.by,pit=rf4Pit(),tr=rf4Terror();
  const ms=(s.bf&&s.bf.mem||[]).filter(m=>m.k.includes(k));const first=ms[0];
  const gift=typeof G_CORE_GIFT!=='undefined'&&G_CORE_GIFT[k];const ob=typeof G_CORE_OBJ!=='undefined'&&G_CORE_OBJ[k];const has=ob&&bfHas(ob);
  const obN={feather:'참새 깃털',button:'은단추',ribbon:'푸른 리본'}[ob];
  await bfScene(`${N}의 마지막 수레`,'l’échafaud',`${jo(N,'이','가')} 단두대에 올랐다. ${a}세였다. 수레가 혁명 광장으로 가는 동안 구경꾼들은 웃고 떠들었다. 시신은 다른 이들과 함께 ${pit}에 던져졌다. 무덤도, 이름을 새긴 돌도 없다.${first?` 당신은 ${first.y}년의 일을 떠올렸다. ${first.t}`:''}${tr?' 이 도시에서 처형된 사람을 대놓고 슬퍼하는 것은 위험한 일이다.':''}`,[
   {l:`밤에 몰래 ${pit} 담장 밑에 꽃을 놓고 온다`,a:'bold family',f:()=>{bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 당신은 밤에 몰래 ${pit} 담장 밑에 꽃을 놓고 왔다.`,{tone:'그리움',place:pit});if(first)bfRe(first.id,`${N}이 단두대에 오른 날, 이 기억을 꽃과 함께 담장 밑에 두고 왔다.`,'그리움');
     say(`달도 없는 밤이었다. 담장 너머에서 생석회 냄새가 났다. 당신은 들꽃 한 줌을 담장 밑 흙 위에 놓고, 그 사람의 이름을 아주 작게 한 번 불렀다. 대답 대신 개 짖는 소리가 멀리서 들렸다. 돌아오는 길 내내 누가 뒤따라오는 것 같았다.`+fx({cour:2,sus:tr?5:1}),'big')}},
   {l:`문을 걸어 잠그고 ${N}의 이름으로 미사를 드린다`,a:'pious',f:()=>{bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 당신은 문을 걸어 잠그고 그 이름으로 기도를 드렸다.`,{tone:'위로'});
     say(`${tr?'선서 거부 신부가 숨어 사는 다락방을 찾아갔다. 촛불 하나, 낡은 성작 하나. ':''}신부는 죽은 이의 이름을 묻고 라틴어 기도문 사이에 그 이름을 넣었다. “${N}.” 한 번도 미사에서 불릴 줄 몰랐던 이름이었다. 당신은 무릎을 꿇고 그 이름이 다 사라질 때까지 일어나지 않았다.`+fx({faith:3,sus:tr?4:0}),'big')}},
   {l:'남겨진 가족을 찾아가 돕는다',a:'family',f:()=>{const m=Math.min(Math.max(0,s.money),Math.round(40*(price(s.year)||1)));bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 당신은 남겨진 가족을 찾아가 돈과 빵을 건넸다.`,{tone:'위로'});
     say(`처형된 사람의 재산은 공화국이 거두어 갔다. 문이 봉인된 집 앞 계단에 ${N}의 가족이 앉아 있었다. 당신은 빵과 돈 꾸러미를 건넸다. 아무도 고맙다는 말을 하지 않았다. 다만 가장 어린 아이가 당신 소매를 오래 붙잡고 놓지 않았다.`+fx({money:-m,rloc:1,sus:tr?3:0}),'big')}},
   gift?{l:`${gift[1]}로 혼자 작별한다`,a:'social',f:()=>{bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 무덤이 없어 ${gift[1]}로 혼자 작별했다.`,{tone:'그리움'});
     say(`무덤이 없으니 작별할 곳도 없었다. 당신은 둘만 아는 곳에서 ${gift[1]}로 혼자 작별했다. 아무도 보지 않았고, 그래서 마음껏 울 수 있었다.`,'big')}}:null,
   has?{l:`간직해 온 ${obN}을 센 강에 띄워 보낸다`,a:'family',f:()=>{bfLose(ob,`${N}이 단두대에 오른 날 센 강에 띄워 보냈다`);bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 관이 없어 간직해 온 ${obN}을 센 강에 띄워 보냈다.`,{tone:'그리움',place:'센 강'});
     say(`관이 없으니 넣어 줄 곳도 없었다. 당신은 퐁뇌프 난간에서 ${obN}을 강물에 놓았다. 그것은 잠시 물 위에 떠 있다가 다리 그늘 속으로 사라졌다. 어린 시절의 한 조각이 그렇게 흘러갔다.`,'big')}}:null,
   {l:'아무에게도 슬픔을 보이지 않는다',a:'safe',f:()=>{bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. 당신은 아무에게도 슬픔을 보이지 않았다.`,{tone:'죄책감'});bfReg('r_guil_'+k,k,`${N}이 단두대에 오른 날, 슬퍼하는 것조차 숨겼다.`);
     say(`구 회의에서 누군가 ${N}의 이름을 비웃었다. 당신도 따라 웃었다. 집에 돌아와 문을 닫고 나서야 손이 떨리기 시작했다. 그날 밤 당신은 한숨도 자지 못했다.`+fx({sus:-3,cour:-2}),'dark')}}])}
{const _gc=gCore;gCore=async function(r){if(r&&r.dc==='guillotine')return rf4Guillo(r);return _gc(r)}}
