/* ================= 개편 10 =================
   2·10. 관계 상태 순서(친밀 · 신뢰 · 경쟁심 · 로맨틱 · 분노), 로맨틱 사건을 인물마다 다르게
   3. 벗의 기억은 흐려지지 않는다
   5. 새해에는 연도 표지 다음에 한 해 살림이 먼저
   6. 일상 기록은 예전처럼: 새 기록이 맨 위에 쌓이고 연도 표지는 아래로 밀린다
   7·8. 정치 말다툼: 그 시기의 쟁점, 그 사람다운 말 / 데물랭의 혼인 → 아이 순서
   9. 단두대로 떠난 벗을 애도하는 선택지를 인물마다
   12. 유언 다양화
   13. 무작위 이름: 오랜 벗과 겹치지 않게, 이름과 성을 더
   14. ⋯ 메뉴: 세부 정보·정치·이력·설명·자동 선택을 빼고 ‘생활 활동’·‘학교 생활’
   15. 행복 */

/* ---------- 2. 관계 상태 ---------- */
relFx=function(r,o){const parts=[];for(const [k,lab] of [['close','친밀'],['trust','신뢰'],['resp','존경'],['riv','경쟁심'],['hate','분노']])if(o[k]){r[k]=r[k]||0;r[k]=clamp(r[k]+o[k],0,100);parts.push(`${lab} ${o[k]>0?'+':''}${o[k]}`)}
  try{if(o.close&&o.close<=-5)rf10Hap(-1,true)}catch(e){}return parts.length?` (${r.n}: ${parts.join(', ')})`:''};
{const _pp=personPage;personPage=function(r){_pp(r);try{if(!r)return;const g=$('#pin .pf-stats');if(!g)return;
  g.innerHTML=[['친밀',r.close||0],['신뢰',r.trust||0],['경쟁심',r.riv||0],['로맨틱',r.rom||0],['분노',r.hate||0]].map(([n,v])=>`<div class="ps${n==='로맨틱'?' rom':''}"><span>${n}</span><s><u style="width:${v}%"></u></s><b>${v}</b></div>`).join('')}catch(e){console.error(e)}}}

/* ---------- 3. 기억은 흐려지지 않는다 ---------- */
{const _by=bfYear;bfYear=function(){_by();try{(s.bf&&s.bf.mem||[]).forEach(m=>{m.w=100})}catch(e){}}}

/* ---------- 5. 새해: 연도 표지 → 한 해 살림 → 나머지 ---------- */
{const _ny=newYear;newYear=function(){const buf=[],L0=L;L=function(t,k='ev',d){buf.push([t,k,d])};try{_ny()}finally{L=L0}
  const yr=buf.filter(x=>x[1]==='yr'),bud=buf.filter(x=>x[1]==='sys'&&/^한 해 살림/.test(String(x[0]))),rest=buf.filter(x=>!yr.includes(x)&&!bud.includes(x));
  [...yr,...bud,...rest].forEach(([t,k,d])=>L0(t,k,d))}}

/* ---------- 6. 일상 기록: 예전처럼 맨 위에 쌓는다 ---------- */
flushLog=function(){const box=logBox||$('#log');if(!box||!s)return;for(;shown<s.log.length;shown++)box.prepend(entryNode(s.log[shown]));while(box.childElementCount>360)box.lastElementChild.remove();foldLog()};

/* ---------- 7. 정치 말다툼: 시기와 사람에 맞게 ---------- */
// 자코뱅 연구(클럽의 사회적 구성, 1791년 분열, 산악파와 상퀼로트, 공포정치와 덕의 정치)를 바탕으로 시기마다 실제로 다투던 쟁점을 고른다
const RF10_QT=[
 [1789.4,1790.5,['바스티유의 피','8월 4일 밤','국왕의 거부권']],
 [1790.5,1791.5,['성직자 선서','교회 재산 매각','능동시민과 수동시민']],
 [1791.5,1792.6,['바렌 뒤의 왕','샹드마르스 발포','전쟁이냐 평화냐']],
 [1792.6,1793.1,['9월 학살','왕의 재판']],
 [1793.1,1793.6,['왕의 처형','지롱드와 산악파']],
 [1793.6,1794.6,['혐의자법','최고가격제','비기독교화','관용']],
 [1794.6,1795.5,['테르미도르','자코뱅 클럽 폐쇄']],
 [1795.5,1799.9,['방데미에르의 포도탄','바뵈프의 평등파']],
 [1799.9,1815.5,['황제의 대관식','정교협약','징병']],
 [1815.5,1830.6,['복고 왕정','망명 귀족 배상','샤를 10세의 칙령']],
 [1830.6,1849,['7월 왕정','선거권','6월 봉기']]];
function rf10Topic(){const t=T();const x=RF10_QT.find(([a,b])=>t>=a&&t<b);return pick(x?x[2]:['선거권'])}
// 그 사람다운 말: 성향(him=그가 더 급진적)과 성격으로
const RF10_QV={
 louise:(t,h)=>h?`“${t}? 그게 빵값을 내려 줘? 굶는 사람 편에 서지 않는 정치는 다 말장난이야.”`:`“${t} 때문에 우리 골목 사람이 또 끌려가면? 빵을 굽는 사람한테는 피가 필요 없어.”`,
 etienne:(t,h)=>h?`“${jo(t,'을','를')} 두고 망설이는 순간 혁명은 끝나. 미지근한 사람이 제일 위험해.”`:`“${t}… 나도 처음엔 그렇게 믿었어. 그런데 너는 너무 멀리 갔어. 명단에 이름을 적는 손이 떨리지 않게 되면 끝이야.”`,
 jules:(t,h)=>h?`“${t}… 너, 너는 왜 그렇게 조용해? 하느님 앞에서 침묵도 죄야.”`:`“${jo(t,'으로')}… 하, 하느님을 법으로 갈아 끼울 순 없어. 너는 그걸 몰라.”`,
 antoine:(t,h)=>h?`“${t}? 상인들이 지금 다 숨죽이고 있어. 너처럼 계산만 하면 아무것도 안 바뀌어.”`:`“${t} 좋지. 그런데 그 바람에 장사가 망하면 다 망해. 너는 장부를 본 적이 없잖아.”`,
 gabriel:(t,h)=>h?`“${jo(t,'을','를')} 두고 아직도 저울질이야? 네가 그렇게 품위 있게 망설이는 동안 사람들은 죽어.”`:`“${t}? 품위 없는 혁명은 혁명이 아니야. 네 친구들은 몽둥이를 정의라고 부르지.”`,
 robespierre:(t,h)=>h?`“${t}에 관해서는 덕이 타협을 허락하지 않소. 자네는 미지근하오.”`:`“${t}는… 자네가 말하는 것보다 복잡하오. 열정만으로 공화국을 세울 수는 없소.”`,
 desmoulins:(t,h)=>h?`“${t}? 펜으로 싸워야 할 때 너는 늘 펜을 내려놓더라.”`:`“${t}… 그만, 그만 좀 해. 나는 이제 관용을 말하고 싶어.”`,
 danton:(t,h)=>h?`“${t}! 대담해야 해. 언제나 더 대담하게.”`:`“${jo(t,'으로')} 피를 더 볼 셈이야? 나는 이제 아르시로 가서 강물이나 보고 싶어.”`};
function rf10QText(k,topic,him){const N=bN(k);const v=(RF10_QV[k]||((t,h)=>h?`“${t}를 두고 그렇게 미지근해서야.”`:`“${t}를 두고 너는 너무 멀리 갔어.”`))(topic,him);
  return `${jo(topic,'이','가')} 화제에 오르자 ${bU(k)} 잔을 내려놓았다. ${v} 목소리가 높아지고 옆자리 사람들이 돌아본다. 어린 시절의 얼굴이 낯선 사람의 얼굴로 보인다.`}

/* ---------- 8. 데물랭: 혼인(1790년 12월) 뒤에 아이(1792년 7월) ---------- */
const rf10Wed=()=>T()>=1790+11/12,rf10Hor=()=>T()>=1792.5;
try{RF2_RX.desmoulins.birth=[()=>rf10Hor()?'카미유가 아이를 보러 와서 말했다. “우리 오라스와 같이 놀게 하자.” 그는 아이를 안는 법이 서툴렀다.':rf10Wed()?'카미유가 뤼실과 함께 아이를 보러 왔다. 뤼실이 아이를 안는 동안 카미유는 아이 이름으로 짧은 시를 지었다.':'카미유가 아이를 보러 와서 요람 옆에 쪼그려 앉았다. “나도 언젠가는 이런 걸 갖고 싶어.” 그는 결혼도 하기 전이었다.'];
  RF2_RX.desmoulins.wed=[()=>rf10Wed()?'카미유와 뤼실이 혼례에 왔다. 카미유는 축사를 하다가 더듬었고 하객들이 웃었다. 뤼실이 그의 손을 잡아 주었다.':'카미유가 혼례에 왔다. 축사를 하다가 더듬었고 하객들이 웃었다. 그 축사는 나중에 그의 신문에 실렸다.'];
  RF2_VISIT.desmoulins=[()=>rf10Hor()?'카미유와 뤼실의 집에 갔다. 뤼실은 피아노를 치고 카미유는 어린 오라스를 안고 서투르게 춤을 추었다.':rf10Wed()?'카미유와 뤼실의 신혼집에 갔다. 뤼실이 피아노를 치는 동안 카미유는 새 신문의 제목을 열 번쯤 바꿨다.':'카미유의 하숙방에 갔다. 원고 더미 사이에 앉아 그는 뤼실 뒤플레시라는 아가씨 이야기만 했다.',
    ()=>'카미유가 새 신문 교정쇄를 보여 주었다. 잉크가 손에 묻어도 그는 개의치 않았다.',()=>'카미유와 팔레루아얄 카페 드 푸아에 갔다. 그가 탁자에 올라섰던 자리에서 둘은 커피를 마셨다.'];
  RF2_VISIT.robespierre=[()=>T()>=1791.55?'생토노레 거리 뒤플레 목수의 집에서 막시밀리앙을 만났다. 그는 오렌지 껍질을 가지런히 벗기며 덕과 공화국에 대해 오래 말했다.':'생통주 거리 하숙방에서 막시밀리앙을 만났다. 책상 위에 원고가 쌓여 있었다. 그는 아라스에서 가져온 커피를 직접 끓여 주었다.',
    ()=>'막시밀리앙과 아라스 이야기를 했다. 그는 누이 샤를로트와 장미 시인회 친구들 이야기를 할 때만 조금 웃었다.',()=>'막시밀리앙의 방에는 자기 초상화가 여러 장 걸려 있었다. 당신이 웃자 그도 조금 민망한 얼굴을 했다.']}catch(e){console.error(e)}

/* ---------- 9. 단두대로 떠난 벗: 그 사람다운 애도 ---------- */
const RF10_GU={
 louise:N=>[{l:'빵집 화덕에 불을 지펴 그녀가 굽던 빵을 굽는다',a:'family',t:`새벽에 ${N}의 빵집 화덕에 불을 지폈다. 손이 기억하는 대로 반죽을 치대고, 그녀가 늘 떼어 주던 꽁다리를 떼어 화덕 앞에 놓았다. 골목 아이들이 냄새를 맡고 모여들었다. 아무도 왜 우느냐고 묻지 않았다.`}],
 etienne:N=>[{l:'『텔레마코스의 모험』의 그 구절을 소리 내어 읽는다',a:'study',t:`밤새 『텔레마코스의 모험』을 소리 내어 읽었다. 좋은 왕은 백성을 위해 있다는 그 구절에서 목이 멨다. 두 아이가 한 책상에서 숨죽이던 대목이었다.`},{l:'그가 고발한 사람들의 가족을 찾아가 사과한다',a:'bold',t:`${N}의 이름으로 적힌 명단 속 집 몇 곳을 찾아갔다. 문은 대부분 열리지 않았다. 한 집에서 늙은 여자가 말했다. “그 사람도 결국 같은 수레를 탔다면서요.” 그 말이 사과보다 무거웠다.`}],
 jules:N=>[{l:'몰래 종탑에 올라 조종을 친다',a:'pious bold',t:`밤중에 종탑에 올랐다. 종은 대포가 되어 사라지고 줄만 남아 있었다. 당신은 빈 줄을 세 번 당겼다. 아무 소리도 나지 않았다. 그래도 그 사람에게는 들렸을 것이다.`,fx:{faith:2,sus:3}},{l:'숨은 사제를 찾아 그를 위한 미사를 청한다',a:'pious',t:`다락방에 숨어 지내는 사제를 찾아가 ${N}을 위한 미사를 청했다. 사제는 그 이름을 듣고 오래 말이 없더니, 자기도 그에게서 성가를 배웠다고 했다.`,fx:{faith:3}}],
 antoine:N=>[{l:'그가 남긴 빚 장부를 대신 정리해 준다',a:'social',t:`${N}의 가게에 봉인이 붙기 전에 장부를 정리했다. 마지막 장에 당신 이름이 있었다. 빚진 사람 칸이 아니라, ‘갚아야 할 사람’ 칸에. 금액은 적혀 있지 않았다.`},{l:'은단추 하나를 그의 무덤 대신 강물에 던진다',a:'family',t:`구슬 내기의 그 은단추를 퐁뇌프에서 강물에 던졌다. 단추는 반짝이며 가라앉았다. 이번에는 아무도 다시 찾으러 오지 않을 것이다.`}],
 gabriel:N=>[{l:'푸른 리본을 손목에 맨다',a:'family',t:`그날부터 손목에 푸른 리본을 맸다. 누가 물으면 유행이라고 했다. ${N}이라면 그렇게 대답했을 것이다.`},{l:'그의 손거울을 찾아 간직한다',a:'social',t:`압수된 물건 더미에서 은테 손거울을 찾아냈다. 거울 속에는 당신 얼굴만 비쳤다. 그래도 한동안 그 사람이 거기서 웃고 있는 것 같았다.`}],
 robespierre:N=>[{l:'뒤플레의 집 문 앞에 오렌지 하나를 놓는다',a:'social bold',t:`밤에 생토노레 거리 뒤플레의 집 앞에 오렌지 하나를 놓고 왔다. 덧문은 닫혀 있었다. 이튿날 아침, 오렌지는 사라지고 없었다.`,fx:{sus:2}},{l:'그가 쓴 연설문을 찾아 끝까지 읽는다',a:'study',t:`그가 남긴 연설문을 구해 밤새 읽었다. 사형제를 없애자던 1791년의 연설과, 공포 없는 덕은 무력하다던 1794년의 연설이 한 사람의 글이었다. 당신은 그 사이의 세월을 오래 생각했다.`}],
 desmoulins:N=>[{l:'『비외 코르들리에』를 몰래 베껴 돌린다',a:'bold',t:`압수된 『비외 코르들리에』를 한 부 구해 밤새 베꼈다. 관용위원회를 세우자는 그 대목에서 펜이 자꾸 멈췄다. 베낀 종이는 이튿날 카페의 신문 더미 사이에 끼워 두었다.`,fx:{sus:4,pen:1}},{l:T()<1794.3?'뤼실에게 위로의 편지를 쓴다':'오라스를 맡은 할머니 집에 빵을 보낸다',a:'family',t:T()<1794.3?`뤼실에게 짧은 편지를 썼다. 무슨 말을 써도 모자랐다. 열흘 뒤 그녀도 같은 길을 갔다는 소식을 들었다. 답장은 오지 않았다.`:`부모를 모두 잃은 어린 오라스가 외할머니 집에 있다고 했다. 빵과 장난감 말 한 마리를 보냈다. 아이가 웃었다는 말만 전해 들었다.`}],
 danton:N=>[{l:'그가 좋아하던 포도주를 한 잔 붓는다',a:'social',t:`선술집 구석에서 그가 늘 마시던 포도주를 한 잔 따라 빈자리에 놓았다. 주인이 아무 말 없이 한 잔을 더 따라 당신 앞에 놓았다. 이 동네는 그 거구의 웃음소리를 기억했다.`},{l:'아르시쉬르오브 쪽 하늘을 오래 바라본다',a:'safe',t:`그가 늘 돌아가고 싶어 하던 고향, 아르시쉬르오브 쪽 하늘을 오래 바라보았다. 그 강가에서 그가 늙어 가는 모습을 상상해 보았다. 끝내 그려지지 않았다.`}],
 saintjust:N=>[{l:'그가 남긴 초고 이야기를 묻는다',a:'study',t:`그가 죽기 전까지 쓰던 공화국의 제도에 관한 초고가 있었다고 했다. 스물여섯의 청년이 꿈꾼 나라는 누구에게도 읽히지 않은 채 상자에 담겼다.`}]};
let rf10Extra=null;
{const _bs=bfScene;bfScene=async function(title,fr,text,opts){if(rf10Extra&&/마지막 수레$/.test(title)){const ex=rf10Extra;rf10Extra=null;opts=opts.filter(Boolean);const last=opts.pop();opts=opts.concat(ex,[last])}return _bs(title,fr,text,opts)}}
{const _rg=rf4Guillo;rf4Guillo=async function(r){try{const k=r.core||r.pid,N=r.n.split(' ')[0];const f=RF10_GU[k];if(f)rf10Extra=f(N).map(o=>({l:o.l,a:o.a,f:()=>{bfMem('g_guil_'+k,k,`${s.year}년, ${jo(N,'이','가')} 단두대에 올랐다. ${(rfPast(o.l)||'').replace(/\.$/,'')}.`,{tone:'그리움'});say(o.t+(o.fx?fx(o.fx):''),'big')}}))}catch(e){console.error(e)}return _rg(r)}}

/* ---------- 10. 로맨틱 사건: 그 사람다운 고백 ---------- */
const RF10_ROM={
 louise:{in:N=>`${jo(N,'이','가')} 밀가루 묻은 앞치마도 벗지 않고 찾아왔다. 손에 리본으로 묶은 당신의 편지 다발이 있다. 글을 배우고 나서 처음으로 혼자 다 읽은 편지들이다. “다 읽었어. 한 글자도 안 빼고. 그러니까… 이제 네 입으로 말해 줘.”`,yes:N=>`${jo(N,'은','는')} 웃다가 울다가 결국 당신 어깨에 밀가루 자국을 남겼다. 그날 저녁 빵집 꽁다리는 두 사람 몫이었다.`},
 etienne:{in:N=>`${jo(N,'이','가')} 구 회의가 끝난 밤 찾아왔다. “혁명에 사랑할 시간은 없다고 생각했어. 그런데 네 편지를 기다리는 동안에는 혁명도 잊어.” 그 말을 하고 ${bHe('etienne')}는 스스로 놀란 얼굴을 했다.`,yes:N=>`${jo(N,'은','는')} 그날 처음으로 연설하지 않고 말했다. 짧고, 서툴고, 진심인 말이었다.`},
 jules:{in:N=>`종탑 계단에서 ${jo(N,'이','가')} 당신의 편지를 꺼냈다. “노, 노래할 때는 안 더듬잖아. 그러니까…” ${bHe('jules')}는 낮게 성가 한 소절을 불렀다. 가사 대신 당신 이름이 들어가 있었다.`,yes:N=>`종탑 위로 비둘기들이 날아올랐다. ${jo(N,'은','는')} 그날 한 번도 더듬지 않았다.`},
 antoine:{in:N=>`${jo(N,'이','가')} 장부를 덮고 말했다. “나는 평생 계산만 했어. 그런데 너한테 쓴 편지는 한 번도 계산을 안 했어. 손해 보는 장사인데도.”`,yes:N=>`${jo(N,'은','는')} 주머니에서 은단추를 꺼내 당신 손에 쥐여 주었다. “이번엔 내기가 아니야.”`},
 gabriel:{in:N=>`${jo(N,'이','가')} 손거울을 내려놓았다. “거울을 볼 때마다 네가 보내 준 편지가 생각나. 이상하지? 내 얼굴보다 네 글씨가 더 보고 싶어.”`,yes:N=>`${jo(N,'은','는')} 푸른 리본을 당신 손목에 매어 주었다. “이제야 어울리네.”`},
 robespierre:{in:N=>`뒤플레의 집 정원에서 ${jo(N,'이','가')} 오렌지 껍질을 오래 벗겼다. “나는 공화국과 약혼한 사람이라고들 하오.” 그가 처음으로 당신 눈을 피했다. “그런데 자네 편지를 받는 날이면 그 약혼이 조금 흔들리오.”`,yes:N=>`그는 대답 대신 당신 손등에 아주 잠깐 손을 얹었다. 그것이 그가 할 수 있는 가장 큰 고백이었다.`},
 desmoulins:{in:N=>`${jo(N,'이','가')} 더듬으며 말을 꺼냈다. “편, 편지를 쓰다 보면 말이 다 나와. 그런데 마, 막상 앞에 서면…” 그는 시 한 장을 내밀었다. 첫 줄의 첫 글자들을 이으면 당신 이름이 되었다.`,yes:N=>`카미유는 소리 내어 웃더니 그 시를 신문에 싣겠다고 했다. 이름은 빼고.`},
 danton:{in:N=>`${jo(N,'이','가')} 술잔을 내려놓고 커다란 손으로 당신 손을 덮었다. “나는 말로 사람을 움직여 왔지. 그런데 너한테는 말이 안 나와. 이상하지.”`,yes:N=>`당통은 천장이 울리도록 웃었다. 그러고는 아주 작게, 아무도 못 듣게 다시 한 번 말했다.`},
 saintjust:{in:N=>`${jo(N,'이','가')} 늘 그렇듯 표정 없이 말했다. “혁명가는 사사로운 감정을 버려야 하오.” 그러고는 당신의 편지를 한 장도 버리지 않고 모아 둔 상자를 열어 보였다.`,yes:N=>`생쥐스트는 처음으로 웃었다. 스물다섯 살다운 웃음이었다.`}};
{const _rc=rf7RomCheck;rf7RomCheck=async function(){if(!s||s.dead||sheetLive||child()||s.cond!=='normal')return;const r=(s.rel||[]).find(r=>r.alive&&(r.rom||0)>=80&&!r.romEv);if(!r)return;
  const k=r.core||r.pid,R0=RF10_ROM[k];if(!R0)return _rc();r.romEv=s.year;const N=r.n.split(' ')[0],obs=rf7Obstacles(r);
  if(!obs.length){const i=await Q('고백',"l’aveu",R0.in(N),[{l:'“나도 같은 마음이야.”라고 말한다',a:'social family'},{l:'“우리 혼인하자.”라고 청한다',a:'family',dis:r.sex===s.sex},{l:'아직은 친구로 남자고 한다',a:'safe'}]);
    if(i===0){r.role='연인';say(R0.yes(N)+relFx(r,{close:10,trust:8})+fx({hap:8}),'big')}
    else if(i===1){r.role='배우자';s.married=true;s.spouse={n:r.n,age:Math.max(16,s.year-(r.by||(perOf(r)?perOf(r).b:s.by))),alive:true,pay:0,estate:r.estate||s.estate,rid:r.fid||r.pid};say(R0.yes(N)+` 몇 달 뒤 두 사람은 혼례를 올렸다.`+fx({rfam:4,hap:12})+relFx(r,{close:15,trust:10}),'big')}
    else{r.rom=60;say(`${jo(N,'은','는')} 고개를 끄덕였다. “알았어. 기다릴게.” 그 말이 오래 마음에 걸렸다.`+relFx(r,{close:-2})+fx({hap:-3}))}
    await done();return}
  const why=obs.join('. ')+'.';
  const i=await Q('고백','l’aveu impossible',`${R0.in(N)} 그러나 둘 다 알고 있다. ${why}`,[{l:'몰래 사랑을 이어 간다',a:'bold',s:'들킬 위험'},{l:'모든 것을 걸고 함께하자고 한다',a:'bold family',s:'큰 대가'},{l:'마음을 접자고 한다',a:'safe'}]);
  if(i===0){r.role='연인';r.secret=1;say(`${R0.yes(N)} 그날부터 두 사람의 편지에는 둘만 아는 암호가 생겼다.`+fx({hap:5,rfam:-3})+relFx(r,{close:8}),'big');if(R()<.4)say('얼마 지나지 않아 소문이 돌았다. 골목 사람들이 당신을 보는 눈이 달라졌다.'+fx({rloc:-6,rfam:-5,hap:-4}),'dark')}
  else if(i===1){if(R()<.35){r.role='연인';say(`당신은 모든 것을 걸었다. ${R0.yes(N)} 대가는 컸지만, 그 손은 끝까지 당신 손 안에 있었다.`+fx({rfam:-10,rloc:-4,cour:3,hap:6})+relFx(r,{close:15,trust:12}),'big')}else{r.rom=40;say(`당신은 모든 것을 걸려 했다. 그러나 세상이 먼저 움직였다. ${jo(N,'은','는')} 짧은 편지 한 장만 남겼다. “당신까지 잃게 할 수는 없었어.”`+fx({hp:-3,hap:-10})+relFx(r,{close:-5}),'dark')}}
  else{r.rom=50;say(`“그래, 그게 맞아.” ${jo(N,'이','가')} 웃으려 했다. 문이 닫히고 나서야 당신은 울었다.`+fx({hap:-8})+relFx(r,{close:-3}),'dark')}
  await done()}}

/* ---------- 12. 유언 다양화 ---------- */
const RF10_LAST={
 regret:{noble:['다른 길을 택할 수 있었을까… 이제는 그 답을 알 길이 없구려.','용서를 구하지 못한 이름들이 있소. 그들에게 내 대신 말해 주시오.'],bourg:['다른 선택을 할 수 있었을까? 이제는 그 답을 알 수 없겠구나.','부치지 못한 편지가 서랍에 있다. 태우지 말고 부쳐 다오.'],common:['다르게 살 수도 있었을까? 이젠 알 수가 없네.','미안하다고, 그 사람한테 꼭 전해 줘. 내가 먼저 말했어야 했는데.']},
 rev:{noble:['나는 태어난 문장보다 내가 고른 깃발을 믿었노라.','후회는 없노라. 다만 그 많은 이름들이 눈에 밟히는구나.'],bourg:['내가 옳았는지는 역사가 판단하겠지. 다만 내가 믿었던 것을 배반하지는 않았다.','공화국이 늙어 가는 걸 보고 싶었는데. 그게 조금 아쉽구나.'],common:['우리가 바꿨어. 적어도 빵 줄에서 굽신거리지는 않게 됐잖아.','내가 옳았는지는 나중 사람들이 따지겠지. 그래도 내가 믿은 걸 팔아넘기진 않았어.']},
 royal:{noble:['신과 국왕 폐하께 바친 생이었노라. 부끄러움은 없다.','백합꽃 아래서 태어나 백합꽃 아래서 가노라.'],bourg:['왕과 교회를 지키려 했다. 그것을 후회하지 않는다.','세상이 아무리 바뀌어도 미사는 계속될 것이다. 그것이면 됐다.'],common:['임금님 편에 섰던 걸 후회 안 해. 하느님은 아실 거야.','종소리가 다시 들리더라. 그거면 됐어.']},
 fame:{noble:['후세가 내 이름을 기억하겠지. 그렇지 않소?','초상화는 잘 걸어 두시오. 빛이 왼쪽에서 들게.'],bourg:['사람들은 나를 기억할 것이다. 그렇지 않은가?','내 이름이 적힌 신문은 다 모아 두었다. 버리지 마라.'],common:['사람들이 날 기억하겠지? 그렇지?','그 거리에서 내 이름 한 번쯤은 불러 줘.']},
 truth:{noble:['평생 진리를 찾아 헤맸노라. 모르는 것이 얼마나 많은지 이제야 알겠구나.','책장을 그대로 두시오. 다 읽지 못한 책이 너무 많소.'],bourg:['이제야 내가 알지 못했던 것들이 얼마나 많았는지 알 것 같다.','펼쳐 둔 책은 덮지 마라. 마지막 장은 누군가가 읽겠지.'],common:['평생 뭔가를 알고 싶어 했지. 이제 보니 모르는 게 훨씬 많았어.','글을 배운 게 내 평생 제일 잘한 일이야.']},
 faith:{noble:['주여, 긴 길이었나이다. 이제 문을 열어 주소서.','묵주를 손에 쥐여 주시오. 마지막 기도는 내가 바치리다.'],bourg:['하느님, 이제 당신께 돌아갑니다. 저를 받아 주소서.','종이 울리면 나를 위해 한 번만 기도해 다오.'],common:['하느님, 이제 가요. 받아 주세요.','성당 종소리가 들리네. 이제 가도 되겠다.']},
 happy:{noble:['내게는 넉넉한 세월이 있었소. 사랑하는 이들과 함께였으니, 그것으로 족하오.','정원의 장미가 올해도 피었소? 그럼 됐소.'],bourg:['사랑하는 사람들과 함께했으니, 그것으로 충분하다.','아이들에게 전해라. 너희 덕에 웃었다고.'],common:['살 만큼 살았어. 좋아하는 사람들이랑 같이 있었으니, 그거면 됐지.','따뜻한 수프 한 그릇이면 돼. 다들 같이 먹자.']},
 plain:{noble:['가문의 이름에 부끄럽지 않게 살았노라. 이제 쉬어도 되겠지.','촛불을 끄시오. 이제 어둡지 않소.'],bourg:['장부는 다 맞췄다. 이제 셈을 끝내도 되겠지.','창문을 열어 다오. 파리의 소리를 한 번만 더 듣고 싶다.'],common:['아, 따뜻하다. 이제 좀 쉬어야겠어.','내일은 일 안 나가도 되겠네.']},
 soldier:{noble:['깃발을 내 관 위에 덮어 주시오. 그것이면 족하오.'],bourg:['진군 나팔 소리가 들리는 것 같다. 이번에는 따라가지 않아도 되겠지.'],common:['전우들이 먼저 갔지. 이제 나도 행군해야겠어.']},
 cleric:{noble:['내 양 떼를 두고 가는구나. 주께서 돌보시리라.'],bourg:['평생 남의 고해를 들었는데, 이제야 내 고해를 하는구나.'],common:['내 기도는 다 끝났어. 이제 남이 해 줄 차례야.']},
 artist:{noble:['미완성 그림은 그대로 두시오. 미완성도 그림이오.'],bourg:['마지막 붓질은 하지 못했구나. 누군가가 대신 하겠지.'],common:['그 노래, 끝 소절 기억나? 불러 줘.']},
 exile:{noble:['국경 너머에서 죽는구나. 내 흙은 저 너머에 있는데.'],bourg:['파리의 지붕들이 보고 싶다. 한 번만 더.'],common:['고향 골목 냄새가 나는 것 같아.']},
 widow:{noble:['이제 곧 그 사람 곁으로 가오. 기다리게 해서 미안했다고 전하리다.'],bourg:['먼저 간 사람에게 가는 길이니 무섭지 않다.'],common:['그 사람이 저기서 손짓하네. 이제 가.']}};
const rf10Pick=a=>{if(!a||!a.length)return null;let h=0;const k=`${s.given[0]}${s.sur[0]}${s.by}`;for(const c of k)h=(h*31+c.charCodeAt(0))>>>0;return a[h%a.length]};
{const _fl=fnLast;fnLast=function(){try{if(!s)return _fl();if(s.death&&s.death.cause==='guillotine')return _fl();if(s.age<14)return _fl();
  const st=noble()?'noble':s.estate==='bourgeois'?'bourg':'common';let k=fnKind();const j=job();
  if(s.cond==='emigre'||s.cond==='exile')k='exile';else if(j&&j.tr==='army'&&R()<.99&&k!=='regret')k='soldier';else if(j&&j.tr==='church'&&k!=='regret')k='cleric';else if(j&&['art','sci'].includes(j.tr)&&k!=='regret')k='artist';
  else if(s.spouse&&!s.spouse.alive&&!s.divorced&&['plain','happy'].includes(k))k='widow';
  const c=RF10_LAST[k]&&RF10_LAST[k][st];const v=rf10Pick(c);return v||_fl()}catch(e){console.error(e);return _fl()}}}

/* ---------- 13. 이름 ---------- */
M_NAMES.push(['아르망','Armand'],['바티스트','Baptiste'],['쥐스탱','Justin'],['레옹','Léon'],['오노레','Honoré'],['마르탱','Martin'],['테오도르','Théodore'],['펠릭스','Félix'],['이폴리트','Hippolyte'],['로랑','Laurent'],['쥘리앙','Julien'],['에두아르','Édouard'],['클레망','Clément'],['아드리앵','Adrien'],['바르텔레미','Barthélemy']);
F_NAMES.push(['외제니','Eugénie'],['아델','Adèle'],['쥘리','Julie'],['클레르','Claire'],['오르탕스','Hortense'],['세실','Cécile'],['델핀','Delphine'],['파니','Fanny'],['나르시스','Narcisse'],['비르지니','Virginie'],['에밀리','Émilie'],['로잘리','Rosalie'],['펠리시테','Félicité'],['멜라니','Mélanie'],['조세핀','Joséphine']);
SURS.push(['부르동','Bourdon'],['카레','Carré'],['드루에','Drouet'],['위송','Husson'],['마르샹','Marchand'],['오지에','Ogier'],['테시에','Tessier'],['바이양','Vaillant'],['쇼뱅','Chauvin'],['펠티에','Pelletier'],['르쿠르','Lecour'],['뒤샹','Duchamp'],['아르노','Arnaud'],['쿠쟁','Cousin'],['니콜레','Nicolet']);
NOBLE_SURS.push(['생로랑','de Saint-Laurent'],['몽포르','de Montfort'],['라바르','de Labarre'],['보르페르','de Beaurepaire'],['생시르','de Saint-Cyr'],['플레시','du Plessis'],['라그랑주','de Lagrange'],['쿠르테','de Courtet']);
const RF10_CORE_SUR=['브레앙','모렐','오베르','프뤼노','보클레르','사브리'];const RF10_CORE_G=['루이즈','에티엔','엘리즈','쥘','쥘리','앙투안','앙투아네트','가브리엘'];
{const bad=a=>a.filter(x=>!RF10_CORE_SUR.includes(x[0])&&!RF10_CORE_G.includes(x[0]));
  [M_NAMES,F_NAMES,SURS,NOBLE_SURS].forEach(arr=>{const keep=bad(arr);arr.length=0;keep.forEach(x=>arr.push(x))});
  Object.values(REG_SURS).forEach(arr=>{const keep=bad(arr);arr.length=0;keep.forEach(x=>arr.push(x))})}

/* ---------- 14. ⋯ 메뉴 ---------- */
{const go=(fn)=>()=>{try{$('#menu').hidden=true}catch(e){}fn()};
  const a=$('#mActs');if(a)a.onclick=go(()=>{setTab('life');setTimeout(()=>{const c=[...document.querySelectorAll('#lifeHost > section.card')].find(x=>/^생활$/.test((x.querySelector('.ch h2')||{}).textContent||''));if(c)c.scrollIntoView({block:'start'})},60)});
  const b=$('#mSchool');if(b)b.onclick=go(()=>{setTab('life');setTimeout(()=>{const c=[...document.querySelectorAll('#lifeHost > section.card')].find(x=>/^교육$/.test((x.querySelector('.ch h2')||{}).textContent||''));if(c){c.scrollIntoView({block:'start'});const f=[...c.querySelectorAll('.fac')][0];if(f&&!rf7Sch)f.click()}},60)})}

/* ---------- 15. 행복 ---------- */
FXN.hap='행복';if(!FN_STATS.some(x=>x[0]==='hap'))FN_STATS.push(['hap','행복']);
function rf10HapInit(){if(s&&s.st&&s.st.hap==null)s.st.hap=60}
function rf10Hap(n,quiet){if(!s||!s.st)return '';rf10HapInit();if(quiet){s.st.hap=clamp(s.st.hap+n,0,100);return ''}return fx({hap:n})}
{const _ns=newState;newState=function(o){const x=_ns(o);if(x.st&&x.st.hap==null)x.st.hap=60;return x}}
{const _rd10=rfDaily;rfDaily=async function(){rf10HapInit();await _rd10();if(!s||s.dead)return;try{if(rfDue('hapD'))rf10Mood()}catch(e){console.error(e)}}}
// 슬픔: 가까운 사람의 죽음
for(const g of ['gParent','gSpouse','gKid','gCore','gFriend']){try{const f=window[g]||eval(g);const w=async function(){rf10HapInit();const n={gParent:-12,gSpouse:-18,gKid:-15,gCore:-12,gFriend:-6}[g];const r=await f.apply(this,arguments);try{if(s&&!s.dead)L('그 뒤로 한동안 웃음이 나오지 않았다.'+rf10Hap(n),'sys')}catch(e){}return r};eval(`${g}=w`)}catch(e){}}
// 다툼: 친밀이 크게 떨어지면
{const _br=bfRel;bfRel=function(k,o){_br(k,o);try{if(o&&o.close&&o.close<=-4)rf10Hap(-2,true)}catch(e){}}}
// 즐거움: 사교 활동과 물건
try{RF2_SHOP.forEach(it=>{it.fx=Object.assign({},it.fx,{hap:it.p>=150?5:2})})}catch(e){}
try{ACTS.forEach(a=>{if(typeof rf2FacOf==='function'&&rf2FacOf(a)==='soc'){if(a.f){const f0=a.f;a.f=function(){const r=f0.apply(this,arguments);rf10Hap(2,true);return r}}if(a.inter){const i0=a.inter;a.inter=async function(){const r=await i0.apply(this,arguments);rf10Hap(2,true);return r}}}})}catch(e){}
// 해마다 조금씩 제자리로
{const _ny10=newYear;newYear=function(){_ny10();try{rf10HapInit();const h=s.st.hap;s.st.hap=clamp(h+(h<50?3:h>70?-2:0),0,100)}catch(e){}}}
// 20 이하: 우울
const RF10_BLUE=['아침에 눈을 떠도 일어날 이유가 떠오르지 않았다. 창밖의 소리가 멀게만 들렸다.','식탁에 앉아 수프가 식는 것을 보고만 있었다. 숟가락을 들 기운이 없었다.','거리에서 아는 얼굴을 보고 일부러 길을 건넜다. 누구와도 말하고 싶지 않았다.','밤마다 같은 생각이 맴돌았다. 다 무슨 소용인가.','좋아하던 일도 손에 잡히지 않았다. 하루가 길고, 한 해는 짧았다.'];
function rf10Mood(){if(child()||s.st.hap>20)return;let t=pick(RF10_BLUE);try{const fr=(typeof BF_KEYS!=='undefined'?BF_KEYS:[]).filter(k=>bfMet(k)&&bfAlive(k)&&!bfR(k).cut&&bfR(k).close>=50);
  if(fr.length){const k=pick(fr);t+=` ${jo(bN(k),'이','가')} 요즘 왜 그렇게 말이 없느냐고 물었다. 당신은 대답하지 못했다.`;bfRel(k,{close:2})}}catch(e){}L(t+fx({hp:-1}),'dark')}
