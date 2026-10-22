/* ================= 이야기: 한 해를 한 장(章)의 줄글로 =================
   일상 탭은 시간이 흐르는 대로 한 줄씩 쌓이는 기록 대신, 해가 바뀔 때마다 지난 한 해를 여덟 줄 안팎의 소설처럼 적는다.
   - 유아기(0~6세): 부모와 형제의 서사. 유모 집, 첫걸음, 동생의 탄생과 죽음, 부모의 하루.
   - 학교에 들어간 뒤(7세~): 친구들의 서사. 다섯 벗의 그해 기억과 성장, 그 밖의 벗들.
   - 어른이 된 뒤: 벗과 가족, 그리고 그해 있었던 일과 세상의 소식.
   그해의 기록(s.log)에서 중요한 일을 골라 계절을 붙여 문장으로 엮는다. 같은 문장은 되도록 되풀이하지 않는다.
   원래의 한 줄 기록은 ‘연대기 보기’로 그대로 볼 수 있다. */
const stG=()=>noble()?'noble':s.estate==='bourgeois'?'bourg':'art';
const stSeason=m=>m<=1?'그해 겨울':m<=4?'봄에는':m<=7?'여름에':m<=10?'가을에':'해가 저물 무렵';
const stSeasonN=m=>m<=1||m===11?'겨울':m<=4?'봄':m<=7?'여름':'가을';
function stPick(key,list){list=list.filter(Boolean);if(!list.length)return '';s.stUsed=s.stUsed||{};const u=s.stUsed[key]=s.stUsed[key]||[];let c=list.filter(x=>!u.includes(x));if(!c.length){s.stUsed[key]=[];c=list}const x=pick(c);s.stUsed[key].push(x);return x}
const stTopic=(w,a,b)=>jo(w,a,b);

/* ---------- 형제 ---------- */
const stOlder=sb=>sb.by<s.by||(sb.by===s.by&&sb.old);
function stTerm(sb){if(!stOlder(sb))return sb.sex==='M'?'남동생':'여동생';return isM()?(sb.sex==='M'?'형':'누나'):(sb.sex==='M'?'오빠':'언니')}
function stSibs(){if(s.sibl)return s.sibl;const n=s.sibs||0;const L0=[];let older=s.eldest?0:Math.min(n,ri(1,Math.max(1,n)));
  let ob=s.by,yb=s.by;const olds=[],youngs=[];for(let i=0;i<older;i++){ob-=ri(1,3);olds.unshift(ob)}for(let i=older;i<n;i++){yb+=ri(2,3);youngs.push(yb)}
  olds.concat(youngs).forEach((by,i)=>{const sx=R()<.5?'M':'F';L0.push({n:pick(sx==='M'?M_NAMES:F_NAMES)[0],sex:sx,by,alive:true,old:by<s.by})});
  // 이름이 겹치지 않게
  const used=new Set([s.given[0],'루이즈','에티엔','엘리즈','쥘','앙투안','앙투아네트','가브리엘']);L0.forEach(sb=>{let k=0;while(used.has(sb.n)&&k++<10)sb.n=pick(sb.sex==='M'?M_NAMES:F_NAMES)[0];used.add(sb.n)});
  s.sibl=L0;return L0}
const stSibAlive=()=>stSibs().filter(sb=>sb.alive&&sb.by<=s.year);
function stSibYear(){for(const sb of stSibs()){if(!sb.alive)continue;
  if(sb.by===s.year){sb.born=s.year;L(`${stTerm(sb)} ${jo(sb.n,'이','가')} 태어났다.`,'ev',{sib:1});continue}
  if(sb.by>s.year)continue;const a=s.year-sb.by;if(a<15&&R()<(a<1?.14:a<5?.05:.012)*(price(s.year)>=1.5?1.3:1)){sb.alive=false;sb.dy=s.year;sb.dc=pick(a<5?['천연두','열병','이질','홍역']:['열병','천연두','디프테리아']);
    L(`${stTerm(sb)} ${jo(sb.n,'이','가')} ${jo(sb.dc,'으로')} 세상을 떠났다. ${a<2?'겨우 걸음마를 떼던 무렵이었다.':`${a}살이었다.`}`,'big',{sib:1})}}}

/* ---------- 문장 창고 ---------- */
const ST_MO={noble:['어머니는 낮이면 살롱에 나가고, 저녁 무렵에야 분 냄새를 풍기며 아이 방에 들렀다. 당신은 그 냄새를 맡으려고 일부러 잠든 척했다.','어머니는 당신의 곱슬머리를 손가락에 감으며 이탈리아 노래를 불러 주었다. 가정교사가 들어오면 노래는 뚝 끊겼다.','어머니는 당신에게 절하는 법과 손등에 입 맞추는 법을 가르쳤다. 틀릴 때마다 부채 끝으로 손목을 톡 쳤다.','어머니는 아플 때만 당신의 침대 곁에 오래 앉아 있었다. 그래서 당신은 가끔 아프고 싶었다.'],
 bourg:['어머니는 가게 계산대 뒤에서 장부를 적다가도 당신이 넘어지는 소리에 펜을 내던지고 달려 나왔다.','일요일 아침이면 어머니는 당신의 옷깃을 몇 번이고 매만진 뒤에야 미사에 데리고 나갔다.','어머니는 밤마다 촛불 아래서 『성인전』을 읽어 주었다. 당신은 늘 순교 대목에서 잠이 들었다.','어머니는 손님이 오면 당신을 의자 위에 세워 놓고 교리문답을 외우게 했다. 손님이 가면 사탕 한 알을 주었다.'],
 art:['어머니는 동트기 전에 일어나 물을 길어 오고, 당신이 깨어날 무렵이면 벌써 빨래 광주리를 이고 있었다.','어머니는 남의 옷을 기우며 당신을 무릎 사이에 앉혀 두었다. 바늘이 지나갈 때마다 실 냄새가 났다.','빵이 모자란 저녁이면 어머니는 자기 몫을 당신의 그릇에 밀어 넣고 배가 부르다고 했다.','어머니는 빨래터에서 돌아오면 언 손을 당신의 볼에 대고 깔깔 웃었다. 당신은 비명을 지르며 도망쳤다.']};
const ST_FA={noble:[()=>s.estate==='robe'?'아버지는 고등법원의 붉은 법복을 입고 나갔다가, 밤늦게 서류 뭉치를 안고 돌아왔다. 그 서류 냄새가 아버지의 냄새였다.':'아버지는 베르사유에 가 있는 날이 더 많았다. 돌아온 날이면 당신을 말 앞에 태우고 정원을 한 바퀴 돌았다.','아버지는 족보를 펼쳐 놓고 선조들의 이름을 하나씩 짚어 주었다. 당신은 그중 누구의 얼굴도 알지 못했다.','아버지는 사냥에서 돌아오면 장화도 벗지 않고 아이 방에 들러 당신의 이마에 입을 맞추었다. 수염이 따가웠다.'],
 bourg:['아버지는 저녁마다 장부를 덮고 한숨을 쉬었다. 그러고는 당신을 보며 이내 웃었다.','아버지는 『메르퀴르 드 프랑스』를 소리 내어 읽으며 세상 돌아가는 일을 혼잣말처럼 평했다. 당신은 무슨 말인지 몰라도 고개를 끄덕였다.','아버지는 일요일 오후면 당신의 손을 잡고 팔레루아얄 회랑을 걸었다. 진열창 앞에서 한참씩 서 있었다.'],
 art:['아버지의 손에는 늘 대팻밥과 기름 냄새가 배어 있었다. 그 손으로 당신에게 나무 팽이를 깎아 주었다.','공방이 쉬는 성 월요일이면 아버지는 당신을 데리고 센 강가에 나가 배를 구경했다.','아버지는 선술집에서 늦게 돌아온 밤이면 콧노래를 부르며 당신을 깨워 안아 주었다. 어머니는 그런 아버지를 흘겨보았다.','아버지는 일이 없는 날이면 하루 종일 창가에 앉아 골목만 내려다보았다. 그런 날은 집 안이 조용했다.']};
const ST_KID={noble:['튈르리 정원에서 굴렁쇠를 굴리다 넘어진 당신을 하인이 달려와 일으켜 세웠다. 당신은 울지 않으려고 입술을 깨물었다.','유모는 당신을 재우며 시골 마을의 늑대 이야기를 들려주었다. 당신은 늑대보다 유모의 목소리가 좋았다.','성탄 밤에는 저택의 예배당에 촛불이 수백 개 켜졌다. 당신은 그 불빛 속에서 잠이 들었다.'],
 bourg:['부활절 아침, 어머니가 색칠한 달걀을 당신 손에 쥐여 주었다. 당신은 그것을 깨뜨리지 못하고 일주일을 들고 다녔다.','성 요한 축일 밤, 아버지 어깨 위에서 그레브 광장의 모닥불을 보았다. 불티가 별처럼 날아올랐다.','퐁뇌프의 약장수와 원숭이 재주를 구경하느라 당신은 어머니의 손을 놓쳤다. 다시 찾았을 때 어머니는 울고 있었다.'],
 art:['여름이면 골목 아이들과 센 강가에서 맨발로 물장구를 쳤다. 집에 돌아오면 어머니에게 귀를 잡혔다.','겨울이면 온 식구가 하나뿐인 난로 곁에 모여 앉았다. 서로의 숨결로 방이 데워졌다.','성 요한 축일 밤, 아버지 어깨 위에서 그레브 광장의 모닥불을 보았다. 불티가 별처럼 날아올랐다.','골목 끝 물장수의 외침이 당신의 시계였다. 그 소리가 들리면 어머니가 물동이를 들고 나갔다.']};
const ST_OLD=[sb=>`${stTerm(sb)} ${stTopic(sb.n,'은','는')} 당신을 데리고 골목 끝까지 달음박질을 쳤다. 넘어진 당신보다 ${jo(stTerm(sb),'이','가')} 더 크게 울었다.`,
 sb=>`${stTerm(sb)} ${stTopic(sb.n,'은','는')} 어른들 몰래 설탕 조각을 나눠 주며 꼭 비밀로 하라고 했다.`,
 sb=>`${stTerm(sb)} ${jo(sb.n,'이','가')} 당신 대신 꾸중을 들은 날이 있었다. 그날 밤 ${jo(stTerm(sb),'은','는')} 이불 속에서 당신의 귀를 잡아당기고는 웃었다.`,
 sb=>`${stTerm(sb)} ${stTopic(sb.n,'은','는')} 글자를 먼저 배웠다며 손가락으로 당신 손바닥에 이름을 써 주었다. 간지러워서 당신은 몸을 비틀었다.`];
const ST_YNG=[sb=>`${stTerm(sb)} ${stTopic(sb.n,'은','는')} 걸음마를 떼자마자 당신 뒤만 졸졸 따라다녔다. 귀찮다고 하면서도 당신은 자꾸 뒤를 돌아보았다.`,
 sb=>`당신은 요람 곁에 앉아 ${stTerm(sb)} ${sb.n}의 작은 손가락을 세어 보았다. 몇 번을 세어도 열 개였다.`,
 sb=>`${stTerm(sb)} ${jo(sb.n,'이','가')} 처음으로 당신 이름을 부른 날, 당신은 온 집 안을 뛰어다니며 자랑했다.`,
 sb=>`${stTerm(sb)} ${sb.n}에게 당신은 팽이 돌리는 법을 가르쳤다. ${jo(sb.n,'은','는')} 팽이보다 당신을 더 오래 쳐다보았다.`];
const ST_END0=['그 시절의 일들은 대부분 잊혔다. 다만 어떤 냄새와 어떤 목소리는 평생 당신 곁에 남았다.','그해 겨울, 창에 낀 성에에 손가락으로 그림을 그리며 당신은 봄을 기다렸다.','세상이 집과 골목만 하던 시절이었다.','밤이면 부모님의 낮은 말소리가 벽 너머로 들려왔다. 그 소리를 들으며 잠드는 것이 좋았다.'];
const ST_END1=['그해가 저물 무렵, 당신은 처음으로 시간이 빨리 간다는 생각을 했다.','저녁 종이 울리면 아이들은 저마다의 집으로 흩어졌다. 내일도 만날 줄 알았다.','그 시절에는 어떤 다툼도 하룻밤을 넘기지 않았다.','돌이켜 보면 그해의 날씨는 기억나지 않는다. 함께 있던 얼굴들만 남았다.'];
const ST_END2=['한 해가 또 지나갔다. 당신은 거울 속 얼굴이 조금 낯설었다.','해가 바뀌는 밤, 당신은 촛불 앞에서 지난 일들을 하나씩 떠올렸다.','세상은 빠르게 변했지만, 아침마다 빵을 사러 가는 길은 그대로였다.','그해의 마지막 저녁, 당신은 오래 창밖을 내다보았다.'];
// 다섯 벗의 일상: [어린 시절, 젊은 날, 어른]
const ST_BF={louise:[['루이즈는 여전히 빵집 뒷계단에서 당신을 기다렸다. 주머니에서 꺼낸 꽁다리는 늘 따뜻했다.','루이즈는 반죽을 치대느라 팔뚝이 굵어졌다며 당신에게 팔씨름을 걸었다. 당신은 매번 졌다.','루이즈는 동생 피에르를 등에 업고도 골목에서 가장 빨리 뛰었다.'],
   ['새벽 네 시, 빵 바구니를 진 루이즈가 당신의 창 밑을 지나며 휘파람을 불었다. 그 소리로 하루가 시작되었다.','루이즈는 손님들이 빵값을 깎으려 들면 한 치도 물러서지 않았다. 그러다가도 가난한 과부에게는 몰래 덤을 얹어 주었다.'],
   ['루이즈의 빵집 문은 여전히 새벽마다 열렸다. 당신은 가끔 그 앞을 지나며 따뜻한 냄새를 맡았다.','루이즈는 아이들 이야기를 하다가도 늘 빵값 이야기로 돌아갔다. 그녀에게 세상은 빵값으로 재는 것이었다.']],
 etienne:[[()=>`${bU('etienne')} 쉬는 시간마다 『텔레마코스의 모험』을 펼쳤다. 멘토르의 대사를 당신에게 외워 보이며 우쭐해했다.`,()=>`${bU('etienne')} 선생님의 질문에 늘 먼저 손을 들었다. 틀린 답에도 부끄러워하지 않았다.`,()=>`${bU('etienne')} 골목 아이들 싸움을 말리다가 코피가 터졌다. 그래도 “누가 옳았는지는 말해야지.” 하고 우겼다.`],
   [()=>`${bU('etienne')} 금서를 몇 권씩 품에 넣고 다녔다. 당신을 붙잡고 볼테르와 루소를 번갈아 인용했다.`,()=>`${bU('etienne')} 밤늦도록 촛불을 켜 두고 무언가를 썼다. 무엇을 쓰느냐고 물으면 “세상을 고치는 법”이라며 웃었다.`],
   [()=>`${bN('etienne')}의 목소리는 갈수록 커졌다. 당신에게는 가끔 그 목소리가 어린 날의 것과 다르게 들렸다.`,()=>`${bU('etienne')} 만날 때마다 새 신문을 내밀었다. 그 신문 속 이름들이 당신에게는 점점 낯설었다.`]],
 jules:[['쥘은 성가대 연습이 끝나면 종탑으로 올라가 비둘기에게 빵 부스러기를 던졌다. 노래할 때만은 말을 더듬지 않았다.','다른 아이들이 쥘의 말투를 흉내 내면, 쥘은 대꾸 대신 얼굴만 붉혔다. 당신이 대신 화를 냈다.','쥘은 교리 시간마다 맨 앞줄에 앉아 신부님의 말을 받아 적었다.'],
   ['신학교에 들어간 쥘은 검은 수단을 입고 돌아왔다. 수단 자락이 커서 걸을 때마다 발에 걸렸다.','쥘은 휴가 때마다 종탑에 올라 당신과 함께 지붕들을 내려다보았다. 말은 적었지만 그 침묵이 편했다.'],
   ['쥘 신부의 미사는 늘 짧았다. 강론을 시작할 때면 여전히 첫마디를 조금 더듬었다.','쥘은 가난한 집 아이들에게 글을 가르쳤다. 아이들은 그를 놀리지 않았다.']],
 antoine:[[()=>`${bU('antoine')} 생드니 거리에서 주운 물건들로 작은 좌판을 벌였다. 단추 하나도 그냥 넘기는 법이 없었다.`,()=>`${bU('antoine')} 내기에 지면 꼭 다음 날 다른 내기를 걸어 왔다. 그리고 대개 이겼다.`,()=>`${bU('antoine')} 어른들의 흥정을 흉내 내며 당신을 웃겼다.`],
   [()=>`포목상 견습이 된 ${bU('antoine')} 옷감을 손가락으로 비벼 보기만 해도 값을 맞혔다.`,()=>`${bU('antoine')} 돈 이야기를 할 때면 눈이 반짝였다. 당신이 웃으면 “너는 몰라.” 하고 짧게 말했다.`],
   [()=>`${bN('antoine')}의 외투는 해마다 새것이 되었다. 그런데 단추를 만지작거리는 버릇만은 그대로였다.`,()=>`${bU('antoine')} 바빠서 좀처럼 만나지 못했다. 가끔 짧은 편지가 왔고, 끝에는 늘 “빚진 거 잊지 않았어.”라고 적혀 있었다.`]],
 gabriel:[['가브리엘은 새 옷을 입고 나타날 때마다 골목을 한 바퀴 돌며 자랑했다. 그러다 진흙탕에 넘어져 울었다.','가브리엘은 당신의 낡은 신발을 놀리면서도 자기 과자는 꼭 반을 나눠 주었다.','가브리엘은 큰 개만 보면 당신 뒤로 숨었다. 당신은 모른 척해 주었다.'],
   ['가브리엘은 분 바른 머리를 하고 손거울을 들여다보았다. 당신이 놀리면 거울 속 당신을 보며 혀를 내밀었다.','가브리엘은 유행하는 노래와 춤을 누구보다 먼저 배웠다. 그런데 밤길에서는 여전히 당신의 팔을 꼭 붙들었다.'],
   ['가브리엘은 여전히 옷맵시에 공을 들였다. 그러나 예전처럼 남의 옷차림을 놀리지는 않았다.','가브리엘은 만나면 사교계 소문을 한 보따리 풀어 놓았다. 당신은 그 소문들보다 그의 웃음소리가 반가웠다.']]};

/* ---------- 그해의 기록을 문장으로 ---------- */
const ST_SKIP=/—|주사위|→|% |세례명은|지금 프랑스를 다스리는|^\d{4}년/;
function stClean(t){t=String(t);for(let i=0;i<3;i++)t=t.replace(/\s*\([^()]*\)\s*\.?$/,'').trim();t=t.replace(/\s*\((?:[^()]|\([^()]*\))*[+-]\s?\d(?:[^()]|\([^()]*\))*\)\.?/g,'').replace(/\s*\((?:[^()]|\([^()]*\))*\)\s*$/,'').replace(/\.\./g,'.');if(t.length>150){const k=t.indexOf('. ',60);if(k>0)t=t.slice(0,k+1)}if(!/[.!?”]$/.test(t))t+='.';return t}
function stEvents(from,to,n){const y=s.year-1;const memK=new Set((s.bf&&s.bf.mem||[]).filter(m=>m.y===y).flatMap(m=>m.k));const named=(s.sibl||[]).length>0;let roleN=0;
  const rows=s.log.slice(from,to).filter(e=>{if(!['big','dark','ev'].includes(e.k)||ST_SKIP.test(e.t)||(e.d&&e.d.sib))return false;
    // 그해 벗과의 기억이 이미 적혔으면 그 장면의 결과 줄은 뺀다
    if(BF_KEYS.some(k=>memK.has(k)&&bfMet(k)&&e.t.includes(bN(k))))return false;
    // 이름 있는 형제가 있으면 이름 없는 ‘동생·막내’ 이야기는 뺀다
    if(named&&/동생|막내|형제|형들|언니들|누나들|오빠들/.test(e.t))return false;if(s.flags.stNurse&&/유모/.test(e.t))return false;
    if(/^(경쟁자|연인|동료|친구|스승|후원자|친우|라이벌) /.test(e.t)){if(roleN++)return false}
    return true});
  const score=e=>(e.k==='big'?3:e.k==='dark'?2:1)+(/어머니|아버지|형|누나|언니|오빠|동생|아내|남편|아들|딸/.test(e.t)?1:0)+(BF_KEYS.some(k=>bfMet(k)&&e.t.includes(bN(k)))?1:0);
  const pickd=rows.map((e,i)=>({e,i,sc:score(e)})).sort((a,b)=>b.sc-a.sc||a.i-b.i).slice(0,n).sort((a,b)=>a.i-b.i);
  let last='';return pickd.map(({e})=>{const sea=stSeason(e.m||0);const t=stClean(e.t);const pre=sea!==last&&!/^[“‘]|^\d+월/.test(t)?sea+' ':'';last=sea;return pre+t})}
function stHist(from,to){const h=s.log.slice(from,to).filter(e=>e.k==='hist');if(!h.length)return '';const t=stClean(pick(h).t).replace(/^\d+월(\s?\d+일)?,?\s?/,'');return stPick('hist',[`세상은 시끄러웠다. ${t}`,`어른들은 저녁마다 같은 소식을 이야기했다. ${t}`,`그해 파리에 전해진 소식이 있었다. ${t}`])}
const stCount=a=>a.join(' ').split(/(?<=[.!?”])\s+/).filter(x=>x.trim()).length;

/* ---------- 한 장 쓰기 ---------- */
function stTitle(from,to,a){const rows=s.log.slice(from,to);const has=re=>rows.find(e=>re.test(e.t));let x;
  if((x=has(/(아버지|어머니)가 \d+세로 세상을 떠났다/)))return `${x.t.match(/아버지|어머니/)[0]}를 잃은 해`;
  if((x=has(/(형|누나|언니|오빠|남동생|여동생) .*세상을 떠났다/)))return '작은 관이 나가던 해';
  if(has(/(아내|남편).*(세상을 떠났다|숨을 거두었다)/)&&s.widowed)return '홀로 남은 해';
  if((x=has(/(남동생|여동생) \S+ 태어났다/)))return '동생이 태어난 해';
  if(has(/(아들|딸) \S+ 낳았다|낳았다\./))return '아이가 태어난 해';
  if(a>=15&&has(/혼인 미사를 올렸다|사막\(숲속 비밀 예배\)에서 혼인/))return '혼인한 해';
  const met=(s.bf&&s.bf.mem||[]).find(m=>m.y===s.year-1&&['m_bread','m_book','m_sparrow','m_button','m_dog'].includes(m.id));if(met)return `${bN(met.k[0])}${jo(bN(met.k[0]),'을','를').slice(-1)} 만난 해`;
  if(a===0)return '세상에 온 해';if(a===7)return '글자를 배우기 시작한 해';
  return stPick('title',a<7?['골목의 계절','집 안의 한 해','자라는 해']:a<14?['담 너머의 해','친구들의 계절','골목대장들의 해']:a<25?['스무 살 무렵','바람이 불던 해','어른이 되어 가는 해']:['평범한 한 해','계절이 지나간 해','조용한 해','바쁜 한 해'])}
function stWrite(){if(!s||!s.log)return;const from=s.stMark||0,to=s.log.length;s.stMark=to;const y=s.year-1,a=y-s.by;if(a<0)return;const G=stG(),out=[];
  const faOK=s.fa&&s.fa.alive,moOK=s.mo&&s.mo.alive;const sib=stSibs().filter(sb=>sb.by<=y);const sibA=sib.filter(sb=>sb.alive);
  if(a<7){ // 유아기: 부모와 형제
    if(a===0){out.push(noble()?'당신은 저택 아이 방의 요람에서 첫해를 보냈다. 젖을 먹인 것은 어머니가 아니라 브르타뉴에서 온 유모였다.':s.flags.stNurse?'':'태어난 지 사흘 만에 당신은 유모 수레에 실려 노르망디의 시골 마을로 보내졌다. 파리의 많은 아기들이 그렇게 낯선 여인의 젖을 먹고 자랐다.');if(!noble())s.flags.stNurse=1}
    else if(a===1&&s.flags.stNurse)out.push('유모의 집에서는 소똥 냄새와 우유 냄새가 났다. 당신은 그 집 아이들과 같은 젖을 먹고 같은 흙바닥을 기었다.');
    else if(a===2&&s.flags.stNurse)out.push(moOK?'두 살이 되던 해, 당신은 덜컹거리는 마차를 타고 파리로 돌아왔다. 처음 보는 여자가 울면서 당신을 안았다. 어머니였다.':'두 살이 되던 해, 당신은 파리로 돌아왔다. 당신을 안아 줄 어머니는 이미 없었다.');
    if(a>=2&&moOK)out.push(stPick('mo'+G,ST_MO[G]));
    if(a>=2&&faOK){const f=stPick('fa'+G,ST_FA[G].map(x=>typeof x==='function'?x():x));if(f)out.push(f)}
    const born=sib.find(sb=>sb.by===y);if(born)out.push(`${stSeason(ri(0,11))} ${stTerm(born)} ${jo(born.n,'이','가')} 태어났다. 어머니는 한동안 자리에서 일어나지 못했고, 당신은 처음으로 혼자 옷을 입었다.`);
    const died=sib.find(sb=>sb.dy===y);if(died)out.push(`${stTerm(died)} ${jo(died.n,'이','가')} ${jo(died.dc,'으로')} 세상을 떠났다. 작은 관이 나가던 날, 당신은 무슨 일인지도 모른 채 어머니의 치맛자락을 붙들고 있었다.`);
    const oth=sibA.filter(sb=>sb!==born&&s.year-1-sb.by>=1);if(oth.length&&a>=2){const sb=pick(oth);out.push(stPick('sib',(stOlder(sb)?ST_OLD:ST_YNG).map(f=>f(sb))))}
    if(a>=3)out.push(stPick('kid'+G,ST_KID[G]));
    stEvents(from,to,2).forEach(t=>out.push(t));
    if(a>=3&&stCount(out)<7){const h=stHist(from,to);if(h)out.push(h)}
    out.push(stPick('end0',ST_END0))}
  else{ // 학교에 들어간 뒤: 친구들
    const ph=a<14?0:a<23?1:2;
    if(a<14)out.push(stPick('sch',[inSchool(['college'])?`${schoolName()}의 아침은 라틴어 문법 암송으로 시작했다. 회초리를 든 선생님 앞에서 당신은 동사 변화를 외웠다.`:inSchool(['convent'])?'수녀원 기숙학교의 하루는 종소리로 나뉘었다. 바느질과 교리, 그리고 침묵의 시간.':noble()?'가정교사의 공부방에서 라틴어 문법과 교리를 배웠다. 창밖으로 골목 아이들의 소리가 들려오면 펜 끝이 자꾸 멈췄다.':lit()?'본당의 작은 학교에서는 한 방에 서른 명이 넘는 아이들이 모여 철자를 소리 내어 읽었다. 그 소리가 골목까지 들렸다.':'당신은 학교 대신 일을 거들었다. 그래도 교리 시간만은 빠지지 않았다. 그곳에 친구들이 있었다.']));
    else if(a<23)out.push(stPick('youth',[`${statusLine()}. 그것이 그 무렵 사람들이 당신을 부르는 말이었다.`,'어른들 틈에 끼기 시작한 당신은 저녁이면 옛 친구들을 찾아 골목으로 나갔다.','하루하루가 바빴다. 그래도 친구들과 마주 앉는 저녁만큼은 거르지 않았다.']));
    else out.push(stPick('adult',[`${statusLine()}의 나날이었다.`,'일과 살림에 쫓기는 한 해였다. 그 틈에도 옛 얼굴들은 가끔 찾아왔다.','당신은 이제 누군가를 돌보는 쪽이 되었다. 어린 날의 친구들도 저마다 그랬다.']));
    // 그해 다섯 벗과의 기억이 있으면 그것부터, 없으면 그들의 일상
    const ks=BF_KEYS.filter(bfMet);const memY=(s.bf&&s.bf.mem||[]).filter(m=>m.y===y&&m.k.some(k=>ks.includes(k)));
    memY.slice(0,2).forEach(m=>{out.push(m.t);const k=m.k.find(x=>ks.includes(x));const th=typeof m.their==='object'&&m.their?m.their[k]:m.their;if(th&&R()<.35&&k)out.push(`훗날 ${bU(k)} 그날을 이렇게 말했다. “${th}”`)});
    const left=ks.filter(k=>!memY.some(m=>m.k.includes(k)));const feat=left.sort(()=>R()-.5).slice(0,Math.max(0,(a<14?3:2)-memY.length));
    feat.forEach(k=>{const r=bfR(k);if(!r.alive){if(r.dead<y)out.push(stPick('gone'+k,[`${bN(k)} 없는 ${stSeasonN(ri(0,11))}이었다. 당신은 가끔 ${jo(BF[k].motif,'을','를')} 떠올렸다.`,`${bN(k)}의 이름을 입에 올리는 사람은 이제 당신뿐이었다.`]));return}
      if(r.cond!=='normal'){out.push(`${bU(k)} ${({prison:'감옥에',deported:'먼 유형지에',emigre:'망명지에',hiding:'어딘가에 숨어',army:'전선에'})[r.cond]||'멀리'} 있었다. 소식은 드물게 왔다.`);return}
      const L0=ST_BF[k][ph].map(x=>typeof x==='function'?x():x);out.push(stPick('bf'+k+ph,L0))});
    // 그 밖의 벗
    const oth=(s.rel||[]).filter(r=>r.alive&&!r.core&&r.kind==='fic'&&r.close>=45);if(oth.length&&stCount(out)<6){const r=pick(oth);out.push(stPick('oth',[`${jo(r.n,'과','와')}도 자주 어울렸다.`,`${jo(r.n,'은','는')} 당신보다 웃음이 많았다. 그 웃음 덕에 버틴 날들이 있었다.`,`${jo(r.n,'과','와')}는 말없이 걸어도 어색하지 않았다.`]))}
    // 가족 한 줄
    if(a>=14&&(s.married&&s.spouse&&s.spouse.alive||kidsAlive().length))out.push(stPick('fam',[s.spouse&&s.spouse.alive?`집에서는 ${jo(s.spouse.n||(isM()?'아내':'남편'),'이','가')} 기다렸다. 식탁의 이야기는 늘 아이들과 빵값이었다.`:'',kidsAlive().length?`아이들은 하루가 다르게 자랐다. ${jo(kidsAlive()[0].n,'은','는')} 벌써 당신의 말투를 흉내 냈다.`:'']));
    else if(a<14&&(faOK||moOK)&&R()<.5)out.push(stPick('fam0',[moOK?'저녁마다 어머니는 오늘은 누구와 놀았느냐고 물었다. 당신은 친구들 이름을 손가락으로 꼽았다.':'',faOK?'아버지는 당신의 친구들을 “골목대장들”이라고 불렀다.':'']));
    stEvents(from,to,a<14?2:3).forEach(t=>out.push(t));
    if(stCount(out)<8){const h=stHist(from,to);if(h)out.push(h)}
    out.push(stPick('end'+(a<14?1:2),a<14?ST_END1:ST_END2))}
  const txt=out.filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
  s.story=s.story||[];s.story.push({y,a,t:stTitle(from,to,a),x:txt})}

/* ---------- 화면 ---------- */
let stShown=-1,stMore=false;
function renderStory(force){const B=$('#storyBox');if(!B||!s)return;const n=(s.story||[]).length;const key=n*100+s.month;if(!force&&key===stShown)return;stShown=key;B.innerHTML='';
  const now=el('p','st-now',`${s.year}년 · ${s.age}세 — ${stSeasonN(s.month)}. 이 해의 이야기는 해가 바뀌면 적힌다.`);B.appendChild(now);
  const list=(s.story||[]).slice().reverse();const show=stMore?list:list.slice(0,4);
  if(!list.length)B.appendChild(el('p','mut small','아직 적힌 이야기가 없다.'));
  show.forEach(c=>{const ar=el('article','st-ch');ar.appendChild(el('div','st-h',`${c.y}년 · ${c.a}세`));ar.appendChild(el('h3','st-t',c.t));ar.appendChild(el('p','st-x',c.x));B.appendChild(ar)});
  if(list.length>4){const b=el('button','pill',stMore?'접기':`지난 이야기 ${list.length-4}장 더 보기`);b.type='button';b.onclick=()=>{stMore=!stMore;renderStory(true)};B.appendChild(b)}}
{const _ny=newYear;newYear=function(){try{stWrite()}catch(e){console.error('story',e)}_ny();try{stSibYear()}catch(e){console.error(e)}}}
{const _r=render;render=function(){_r();try{renderStory()}catch(e){console.error(e)}}}
{const b=$('#storyT');if(b)b.onclick=()=>{const lc=$('#logCard');const on=lc.hidden;lc.hidden=!on;b.setAttribute('aria-pressed',String(on));b.textContent=on?'이야기만 보기':'연대기 보기';if(on){try{rebuildLog()}catch(e){}}}}
{const _st=start;start=function(f,o){_st(f,o);stShown=-1;stMore=false;try{if(f)stSibs();renderStory(true)}catch(e){console.error(e)}}}
