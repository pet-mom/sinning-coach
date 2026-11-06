/* ================= 개편 2 =================
   1. 당파의 한 해·신분별 일상·벗의 일상 줄은 한 해 가운데 무작위 달에 (rfDaily)
   2. 열여덟 살부터 사망·병 판정은 한 해에 한 번, 무작위 달에 (engine.js의 rfDue·hpRisk)
   3. 연표 사건마다 태도를 고르는 사건창
   4. 벗과의 첫 만남은 “~에서 ~을 만났다.”로 기록
   5. 망명은 언제나 국경에서 붙잡힌다
   6. 1758년생 남자아이는 루이르그랑 콜레주
   7. 생활사 자료 장면은 당신 자신의 일만
   d. 고른 선택지는 과거형 문장으로 기록
   e. 생활 활동은 시설 카드(체육관·도서관·강의실·사교 시설·성당·상점·그 밖의 일)로
   f. 다섯 벗과 로베스피에르·데물랭: 곁가지 장면, 찾아가기, 당신의 삶에 대한 반응 */

/* ---------- d. 선택지를 과거형 문장으로 ---------- */
const RF_HG=0xAC00;
const rfSyl=c=>{const n=c.charCodeAt(0)-RF_HG;if(n<0||n>11171)return null;return {l:Math.floor(n/588),v:Math.floor(n%588/28),t:n%28}};
const rfMk=(l,v,t)=>String.fromCharCode(RF_HG+(l*21+v)*28+t);
// 받침 없는 어간의 마지막 음절에 과거 ‘-었/았’을 붙인다
function rfPastSyl(stem){const c=stem.slice(-1),pre=stem.slice(0,-1),x=rfSyl(c);if(!x)return null;
  if(c==='하')return pre+'했';
  const V={0:0,4:4,1:1,5:5,6:6,3:3,7:7,9:9,14:14,10:10}[x.v];
  if(V!=null)return pre+rfMk(x.l,x.v,20);
  if(x.v===8)return pre+rfMk(x.l,9,20);       // 보 → 봤
  if(x.v===13)return pre+rfMk(x.l,14,20);     // 주 → 줬
  if(x.v===20)return pre+(x.l===11?'였':rfMk(x.l,6,20)); // 지키 → 지켰, 이 → 였
  if(x.v===11)return pre+rfMk(x.l,10,20);     // 되 → 됐
  if(x.v===18){const p=pre.slice(-1),px=rfSyl(p||'');const bright=px&&[0,8].includes(px.v);
    if(c==='르'&&!['따','치'].includes(p)&&px&&px.t===0)return pre.slice(0,-1)+rfMk(px.l,px.v,8)+(bright?'랐':'렀'); // 부르 → 불렀
    return pre+rfMk(x.l,bright?0:4,20)}       // 쓰 → 썼, 따르 → 따랐
  return stem+'었'}
const RF_IRR={'듣':'들었','걷':'걸었','묻':'물었','싣':'실었','돕':'도왔','줍':'주웠','눕':'누웠','굽':'구웠','짓':'지었','잇':'이었','긋':'그었','붓':'부었','낫':'나았'};
const RF_LV={'안':'알았','논':'놀았','만든':'만들었','몬':'몰았','돈':'돌았','존':'졸았','머문':'머물렀','다문':'다물었','푼':'풀었','우는':'울었','연':'열었','판':'팔았','든':'들었','건':'걸었','번':'벌었','빈':'빌었','민':'밀었','분':'불었','단':'달았','튼':'틀었','끈':'끌었','떠든':'떠들었','흔든':'흔들었','어울린':'어울렸','산':'샀'};
function rfPastWord(w){if(w==='운다')return '울었다';
  if(/않는다$/.test(w))return w.replace(/않는다$/,'않았다');
  if(/한다$/.test(w))return w.replace(/한다$/,'했다');
  if(/는다$/.test(w)){const st=w.slice(0,-2),c=st.slice(-1);if(RF_IRR[c])return st.slice(0,-1)+RF_IRR[c]+'다';const x=rfSyl(c);if(!x)return null;return st+([0,8,2,12].includes(x.v)?'았다':'었다')}
  if(/다$/.test(w)&&w.length>=2){const c=w.slice(-2,-1),x=rfSyl(c);if(!x)return null;
    if(x.t===4){const pre=w.slice(0,-2);for(const k of Object.keys(RF_LV).sort((a,b)=>b.length-a.length)){if((pre+c).endsWith(k))return (pre+c).slice(0,-k.length)+RF_LV[k]+'다'}
      const p=rfPastSyl(pre+rfMk(x.l,x.v,0));return p?p+'다':null}
    if(/있다$|없다$/.test(w))return w.slice(0,-1)+'었다';return null}
  return null}
function rfPast(label){let t=String(label||'').replace(/\s*\([^)]*\)\s*$/,'').replace(/[.\s]+$/,'').trim();if(t.length<3||/^(계속|확인|닫기|그만)/.test(t))return null;
  if(/[”"!?]$/.test(t))return `${t} 하고 말했다.`;
  if(/함께 산다$|같이 산다$/.test(t))return t.replace(/산다$/,'살았다.');
  const m=t.match(/(\S+)$/);const p=m&&rfPastWord(m[1]);if(!p)return null;return t.slice(0,-m[1].length)+p+'.'}
let rfNoLog=false;
// 고른 선택지: 사건 결과 글이 따로 있으면 선택지 줄은 남기지 않는다.
// 결과 글이 없으면 그 장면의 기억 글을, 그것도 없으면 사건의 첫 문장과 고른 행동을 이어 과거형 문장으로 남긴다.
const rf2Pend=[];
function rf2First(text){const m=String(text).replace(/\s+/g,' ').match(/^[^“”"]*?[.!?](?=\s|$)/);if(!m)return null;const x=m[0].trim();
  {const c=x.slice(-3,-2),y=rfSyl(c);if(/다\.$/.test(x)&&y&&y.t===20)return x}const w=x.replace(/\.$/,'').match(/(\S+)$/);const p=w&&rfPastWord(w[1]);return p?x.replace(/\.$/,'').slice(0,-w[1].length)+p+'.':null}
function rf2Flush(){if(!s)return;const ps=rf2Pend.splice(0);for(const p of ps){
  const after=s.log.slice(p.n).some(e=>['ev','big','dark'].includes(e.k)&&!(e.d&&e.d.choice));if(after)continue;
  const ms=s.bf&&s.bf.mem?s.bf.mem.slice(p.mem):[];if(ms.length){L(ms[ms.length-1].t,'ev',{choice:1});continue}
  const c=rfPast(p.l);if(!c)continue;const f=rf2First(p.text);L(f&&f.length<=120?`${f} 당신은 ${c.replace(/^당신은\s*/,'')}`:c,'ev',{choice:1})}}
// 고른 뒤 첫 결과 글이 너무 짧으면 사건의 첫 문장을 앞에 붙여 무슨 일이었는지 알 수 있게 한다
{const _L2=L;L=function(t,k='ev',d){try{const p=rf2Pend[rf2Pend.length-1];if(p&&!p.ctx&&['ev','big','dark'].includes(k)&&!(d&&d.choice)&&s&&s.log.length>=p.n){
    const bare=String(t).replace(/\s*\([^()]*\)\s*/g,'').trim();if(bare.length<34){const f=rf2First(p.text);if(f&&f.length<=110&&!String(t).startsWith(f.slice(0,8))){t=f+' '+t}}p.ctx=1}}catch(e){}return _L2(t,k,d)}}
{const _dn=done;done=async function(){try{rf2Flush()}catch(e){console.error(e)}return _dn.apply(this,arguments)}}

/* ---------- 1. 무작위 달의 일상 줄 ---------- */
// 글 속에 나이(“여섯 살에”)가 나오면 그 나이가 된 뒤에만 쓴다
const RF2_NUM={한:1,두:2,세:3,네:4,다섯:5,여섯:6,일곱:7,여덟:8,아홉:9};
function rf2AgeIn(t){const m=String(t).match(/(?:^|[^가-힣])(열|스무|서른|마흔|쉰|예순|일흔|여든)?\s?(한|두|세|네|다섯|여섯|일곱|여덟|아홉)?\s?살/);if(!m||(!m[1]&&!m[2]))return 0;
  const tens={열:10,스무:20,서른:30,마흔:40,쉰:50,예순:60,일흔:70,여든:80}[m[1]]||0;return tens+(RF2_NUM[m[2]]||0)}
{const _cl=ssClassLines;ssClassLines=function(y,a,n){for(let i=0;i<8;i++){const r=_cl(y,a,n);if(r.every(x=>rf2AgeIn(x)<=a))return r}return []}}
async function rfDaily(){if(!s||s.dead)return;
  try{if(rfDue('cls'))mixClass()}catch(e){console.error(e)}
  try{if(rfDue('bf'))mixFriend()}catch(e){console.error(e)}
  try{if(rfDue('party')&&!child())rfPartyYear()}catch(e){console.error(e)}
  try{if(rfDue('side')&&!child())await rf2Side()}catch(e){console.error(e)}
  try{if(s.age>=7&&rfDue('side2')&&R()<.5)await rf2Side()}catch(e){console.error(e)}}

/* ---------- 3. 연표 사건: 태도를 고르는 사건창 ---------- */
function rf2Kind(t){if(/전쟁|전투|격파|함락|승리|패배|원정|포위|휴전|강화|조약|군이|군을|군대|함대|점령|침공|퇴각/.test(t))return 'war';
  if(/왕|의회|혁명|헌법|공화|선거|법|칙령|정부|통령|황제|국민|클럽|폐지|선포|처형|단두대|봉기|내각|재상|장관|삼부회|고등법원|파벌|당|투표|자코뱅|지롱드|국왕|왕비/.test(t))return 'pol';return 'news'}
// 선택지: [글, 태도, 효과, 결과 글(여러 개 중 하나)]
const RF2_ERA=()=>{const y=T();return y<1789?'old':y<1800?'rev':y<1815?'emp':'rest'};
const RF2_ATT={
 war:()=>[
  [RF2_ERA()==='old'?'카페에 가서 장교 출신 손님들의 이야기를 듣는다':'이웃들과 신문 지도를 펴 놓고 전황을 짚어 본다','social',{soc:1,rloc:1},[
    '저녁마다 이웃집 부엌에 모여 신문의 지도를 펼쳤다. 누군가 손가락으로 강 이름을 짚을 때마다 다들 고개를 끄덕였지만, 그 강이 어디로 흐르는지 아는 사람은 없었다.',
    '카페 구석에서 다리를 저는 퇴역 장교가 그 전투를 직접 본 것처럼 이야기했다. 당신은 술 한 잔을 사 주고 끝까지 들었다. 이야기는 들을 때마다 조금씩 길어졌다.']],
  ['전장에 나간 젊은이들을 위해 촛불을 켠다','pious',{faith:1},[
    '성당 옆 제단에 촛불 두 자루를 켰다. 하나는 이름 모를 병사들을 위해, 하나는 그 병사들의 어머니를 위해서였다.',
    RF2_ERA()==='rev'||RF2_ERA()==='emp'?'이웃집 아들의 이름이 징집 명단에 있었다. 당신은 그 집 어머니와 나란히 앉아 묵주를 돌렸다. 그녀는 기도문을 자꾸 틀렸고, 당신은 바로잡아 주지 않았다.':'저녁 기도 끝에 전장의 젊은이들 이름을 하나씩 떠올리려 했다. 아는 이름은 하나도 없었다. 그래서 더 오래 기도했다.']],
  ['먼 데서 일어나는 일이라 여기고 하던 일을 계속한다','safe',{},[
    '대포 소리는 파리까지 들리지 않았다. 당신은 그날도 하던 일을 마치고 평소처럼 저녁을 먹었다. 다만 빵값이 또 오를 거라는 생각은 떨쳐지지 않았다.',
    '승전이든 패전이든 장터의 양배추 값은 그대로였다. 당신은 그 소식을 접어 두고 하루를 살았다. 전쟁은 늘 남의 아들들이 치르는 것이었다. 아직은.']]],
 pol:()=>[
  [RF2_ERA()==='old'?'“이제야 무언가 바뀌려나 보다.” 하고 반긴다':RF2_ERA()==='rev'?'“새 세상이 온다.” 하며 거리로 나간다':'“이번엔 정말 달라질 거야.” 하며 반긴다','radical',{rpeople:1},[
    '그날 밤 당신은 창문을 열어 두고 거리의 소리를 들었다. 누군가 노래를 불렀고, 누군가 그 노래를 따라 불렀다. 당신도 모르게 발끝으로 박자를 맞추고 있었다.',
    '광장에는 처음 보는 사람들이 서로 어깨를 두드리고 있었다. 당신도 모르는 사람과 악수를 했다. 그 손이 얼마나 따뜻했는지, 그 뒤로 오래 기억했다.']],
  ['“너무 빠르다.” 하며 걱정한다','royal',{relite:1},[
    '당신은 저녁 식탁에서 그 소식을 몇 번이고 되풀이해 말했다. 너무 빠르다고, 이렇게 빨리 변하는 세상은 어디선가 반드시 무너진다고. 식구들은 말없이 수프만 떠먹었다.',
    '잠이 오지 않았다. 당신은 촛불을 켜고 오래된 달력을 넘겨 보았다. 어제와 오늘 사이에 무언가 크게 끊어진 것 같았는데, 그것이 무엇인지 이름을 붙일 수 없었다.']],
  ['모자를 눌러쓰고 말을 아낀다','safe',{},[
    '이웃들이 그 소식으로 떠들썩할 때 당신은 모자를 눌러쓰고 지나갔다. 누가 어느 편인지 모르는 시절에는 입을 닫는 것이 가장 안전했다.',
    '카페에서 누군가 당신 생각을 물었다. 당신은 커피가 식었다는 말로 대답을 대신했다. 그 사람은 웃었지만, 당신 얼굴을 한 번 더 쳐다보았다.']]],
 news:()=>[
  [lit()?'신문을 구해 그 기사를 꼼꼼히 읽는다':'글 아는 이웃에게 다시 읽어 달라고 한다','study',{edu:1},lit()?[
    '신문을 구해 그 기사를 두 번 읽었다. 모르는 낱말은 연필로 밑줄을 그어 두었다가, 이튿날 아는 사람에게 물었다.',
    '독서실에서 신문 세 가지를 나란히 놓고 같은 소식을 비교해 읽었다. 세 신문이 하는 말이 다 달랐다. 당신은 그중 무엇이 사실인지 오래 생각했다.']:[
    '글 아는 이웃을 붙잡고 그 소식을 다시 읽어 달라고 했다. 이웃은 귀찮아하면서도 끝까지 읽어 주었고, 당신은 그 문장 몇 개를 외워 두었다.',
    '본당 신부님께 그 소식이 무슨 뜻이냐고 물었다. 신부님은 한참 설명하다가 결국 “하느님만 아시지요.” 하고 웃었다.']],
  ['카페나 선술집에서 이야깃거리로 삼는다','social',{soc:1},[
    '그 주 내내 카페와 선술집의 이야깃거리는 그 소식뿐이었다. 당신도 술잔을 앞에 두고 아는 척을 좀 했다. 듣는 사람들은 당신보다 더 아는 척을 했다.',
    '선술집 주인이 그 소식을 두고 내기를 걸었다. 당신은 2수를 걸었다. 그 내기가 어떻게 끝났는지는 아무도 기억하지 못했다.']],
  ['흘려듣고 내 일을 한다','safe',{},[
    '당신은 그 소식을 흘려들었다. 세상 일보다 오늘 저녁 땔감이 더 급했다. 그래도 잠들기 전, 그 이야기가 한 번 더 떠올랐다.',
    '세상은 늘 무언가로 떠들썩했다. 당신은 하던 일로 돌아갔다. 몇 해 뒤에야 그날의 소식이 당신 삶에 어떤 그림자를 드리웠는지 알게 되었다.']]]};
const rf2CanAsk=()=>s&&!s.dead&&!child()&&s.age>=14&&s.cond==='normal'&&T()>=1789;
// 같은 달에 7. 태도 장면(RF_ATT)이 따로 뜨는가
const rf2AttSame=mi=>inParis()&&adult()&&RF_ATT.some(x=>x[0]*12+x[1]-1===mi&&!(s.att&&s.att[x[2]])&&(!x[7]||x[7]()));
async function rf2Att(h,tx){const k=rf2Kind(tx);const os=RF2_ATT[k]();const y=Math.floor(h.mi/12),m=h.mi%12+1;
  rfNoLog=true;let i;try{i=await Q(`${y}년 ${m}월`,k==='war'?'nouvelles du front':k==='pol'?'nouvelles politiques':'les nouvelles',tx,os.map(o=>({l:o[0],s:'',a:o[1]})))}finally{rfNoLog=false}
  const o=os[i]||os[2];say(pick(o[3])+fx(Object.assign({},o[2])),'ev');await done()}
runHistory=async function(a,b){if(!histSorted)histSorted=HIST.slice().sort((x,y)=>x.mi-y.mi||x.i-y.i);
  for(const h of histSorted){if(h.mi<=a||h.mi>b)continue;
    const tx=typeof h.text==='function'?h.text():h.text;if(tx)L(tx,'hist');
    const q0=s.qN||0;if(h.fn&&!s.dead){await h.fn();if(s.dead)return}
    if(tx&&(s.qN||0)===q0&&rf2CanAsk()&&!rf2AttSame(h.mi)){try{await rf2Att(h,tx)}catch(e){console.error(e);sheetClose()}if(s.dead)return}}
  try{await rfAttitude(a,b)}catch(e){console.error(e)}};

/* ---------- 4. 첫 만남 ---------- */
const RF2_MEETP={louise:()=>noble()?'저택 부엌문 앞':'빵집 뒷계단',etienne:()=>noble()?'가정교사의 공부방':lit()?'본당의 작은 학교':'본당 교리반',jules:()=>`${bfPar()} 종탑 계단 아래`,antoine:()=>'생드니 거리',gabriel:()=>'튈르리 정원의 얼어붙은 연못가',
  robespierre:()=>inSchool(['college'])?'루이르그랑 콜레주':'라탱 구역 서점 앞',desmoulins:()=>'루이르그랑 콜레주'};
{const _bm=bfMake;bfMake=function(k){const r=_bm(k);try{const p=RF2_MEETP[k]?RF2_MEETP[k]():'골목';L(`${p}에서 ${jo(r.n,'을','를')} 만났다.`,'ev')}catch(e){}return r}}

/* ---------- 5. 망명은 언제나 붙잡힌다 ---------- */
emigrate=async function(dest){const p=dest||pick(['코블렌츠','런던','토리노','브뤼셀','바젤']);
  say(`${jo(p,'으로')} 가는 길, 국경 검문소에서 붙잡혔다. 위조 통행증의 잉크가 아직 덜 말라 있었다. 짐 속의 금붙이와 편지는 모두 압수되었다.`+fx({sus:25,money:-Math.round(Math.max(0,s.money)*.2)}),'big');
  s.cond='prison';s.prisonKind=T()>=1792.5?'terror':'plain';s.condSince=T()};
{const a=ACTS.find(x=>x.k==='emig');if(a){a.s='국경 검문이 삼엄하다';a.f=null;a.inter=async()=>{sheetOpen('국경','la frontière');shText('밤 마차를 타고 국경으로 향한다. 품에는 남의 이름이 적힌 통행증이 있다.','q');await shButtons([{l:'검문소로 다가간다',s:'',a:'bold'}]);await emigrate();await done()}}}

/* ---------- 6. 1758년생은 루이르그랑 ---------- */
{const _sa=schoolAt10;schoolAt10=async function(){const x=SCH();if(s.by===1758&&isM()&&x.st==='petite'){const poor=!noble()&&s.estate!=='bourgeois';
    enterCollege({school:'llg',board:true});if(poor){x.scholar=true;say('본당 신부의 추천으로 루이르그랑 콜레주의 장학생 자리(부르스)를 얻었다. 부잣집 아이들 사이에서 낡은 옷이 눈에 띄었다.'+fx({edu:2,soc:-1}),'big')}return}
  return _sa()}}
{const _pc=pickCollege;pickCollege=function(){if(s&&s.by===1758&&isM())return 'llg';return _pc()}}

/* ---------- 7. 생활사 자료: 당신의 일만 ---------- */
const RF2_OTH=/(말|소문|이야기|얘기|공고|공고문|벽보|통계|소식)[이가] (돌았다|붙었다|나돌았다|퍼졌다|들려왔다|전해졌다)|(사람들|이웃들|마을 사람들)[이은] |다고 했다\.?$|수군댔다\.?$|혀를 찼다\.?$|고개를 저었다\.?$|고개를 갸웃했다\.?$/;
const RF2_SUBJ=/^[^.,]{0,24}?(들이|들은|들도|들까지|사람이|사람은|이웃이|이웃은|이웃집|선생이|신부가|신부는|의사가|청년이|처녀가|과부가|남자가|여자가|아이가|대농이|주인이|부부가|노인이|군의관이|관리가|감독관이|판사가|서기가|상인이|형제가|딸이|아들이|공작가의)\s(?!된|되)/;
function rf2Mine(e){if(!e.fx||!Object.keys(e.fx).length)return false;const t=e.text||'';if(RF2_OTH.test(t))return false;if(RF2_SUBJ.test(t.split('.')[0]))return false;if(/^1[78]\d\d년/.test(t))return false;return true}
{const _dp=dataPool;dataPool=function(){return _dp().filter(rf2Mine)}}

/* ---------- e. 시설 카드와 상점 ---------- */
const RF2_FAC=[['gym','체육관','la salle d’armes'],['lib','도서관','la bibliothèque'],['lec','강의실','l’amphithéâtre'],['soc','사교 시설','le salon'],['church','성당','l’église'],['shop','상점','la boutique'],['etc','그 밖의 일','la vie']];
const RF2_FK={train:'gym',labor:'gym',spa:'gym',hunt:'gym',read:'lib',cabinet:'lib',latin:'lib',paper:'lib',
  learn:'lec',skill:'lec',orat:'lec',study:'lec',lang:'lec',math:'lec',lecture:'lec',drawl:'lec',musicl:'lec',dance:'lec',physique:'lec',
  salon:'soc',visit:'soc',charity:'soc',theatre:'soc',guing:'soc',billet:'soc',mediate:'soc',mutual:'soc',lodge:'soc',lodgem:'soc',lavoir:'soc',marche:'soc',salon_f:'soc',cabaret:'soc',gamble:'soc',lottery:'soc',bfvisit:'soc',
  mass:'church',pilgr:'church',confr:'church',worship:'church',hotel:'church'};
const rf2FacOf=a=>RF2_FK[a.k]||({body:'gym',learn:'lec',social:'soc',faith:'church'})[a.g||actGroup(a)]||'etc';
let rf2Fac=null;
const RF2_SHOP=[
 {k:'coffee',n:'모카 커피와 설탕 한 봉',p:25,rep:1,fx:{soc:1,hp:1},t:'카페 드 라 레장스에서 산 모카 원두를 집에서 볶았다. 설탕을 두 덩이나 넣었다.'},
 {k:'sweets',n:'아이스크림과 과자',p:12,rep:1,fx:{soc:1},t:()=>T()<1800?'카페 프로코프에서 셔벗을 사 먹었다. 이 사치는 한 숟가락에 끝났다.':'토르토니에서 아이스크림을 사 먹었다. 대로의 멋쟁이들이 다 거기 있었다.'},
 {k:'perfume',n:'우비강의 향수',p:45,rep:1,c:()=>s.year>=1775,fx:{soc:1},t:'포부르 생토노레의 우비강 가게에서 향수 한 병을 샀다. 바구니 모양의 간판이 걸린 가게였다.'},
 {k:'umbrella',n:'비단 양산',p:40,fx:{soc:1},t:'비단 양산을 샀다. 비 오는 날 거리에서 우산을 펴는 사람은 아직 드물었다.'},
 {k:'snuff',n:'에나멜 코담뱃갑',p:90,fx:{soc:2},t:'에나멜에 작은 풍경화를 그려 넣은 코담뱃갑을 샀다. 손님 앞에서 뚜껑을 여는 손짓을 연습했다.'},
 {k:'fan',n:'상아 부채',p:70,c:()=>!isM(),fx:{soc:2},t:'상아 살에 양치기 그림을 그린 부채를 샀다. 부채를 접는 방식에도 말이 있었다.'},
 {k:'wig',n:'가발과 분',p:60,c:()=>s.year<1792,fx:{soc:2,relite:1},t:'가발 장인에게 곱슬 가발을 맞추고 쌀가루 분을 샀다. 외투 어깨에 분이 하얗게 내려앉았다.'},
 {k:'silk',n:'리옹 비단 옷 한 벌',p:180,fx:{soc:3,relite:2},t:()=>T()>=1793.4&&T()<1794.6?'리옹 비단 옷을 샀다. 지금은 입고 나갈 수 없는 옷이었다.':'리옹 비단으로 옷 한 벌을 맞췄다. 재단사가 세 번이나 치수를 쟀다.'},
 {k:'shawl',n:'카시미르 숄',p:300,c:()=>!isM()&&s.year>=1798,fx:{soc:3,relite:2},t:'이집트 원정 뒤 유행한 카시미르 숄을 샀다. 황후도 수백 장을 가졌다고 했다.'},
 {k:'watch',n:'금 회중시계',p:240,fx:{soc:2,fame:1},t:()=>s.year>=1775?'브레게 공방에서 금 회중시계를 샀다. 조끼 주머니에서 금줄이 반짝였다.':'금 회중시계를 샀다. 조끼 주머니에서 금줄이 반짝였다.'},
 {k:'books',n:'『백과전서』 전질',p:900,c:()=>s.year>=1772&&lit(),fx:{edu:3,relite:1},t:'『백과전서』 전질을 들였다. 책장 한 벽이 다 찼다. 도판 권을 넘기는 데만 겨울 한 철이 걸렸다.'},
 {k:'silver',n:'은식기 한 벌',p:800,fx:{relite:2,soc:1},t:'은 식기 한 벌을 샀다. 손님이 오는 날이면 하녀가 밤새 닦았다.'},
 {k:'portrait',n:'초상화 주문',p:400,fx:{fame:2,relite:1},t:()=>s.year<1785?'그뢰즈 공방의 화가에게 초상화를 맡겼다. 석 달 동안 같은 옷을 입고 앉아 있었다.':s.year<1806?'다비드의 제자에게 초상화를 맡겼다. 배경은 아무것도 없는 갈색이었다.':'앵그르 공방의 화가에게 초상화를 맡겼다. 손이 실제보다 희게 그려졌다.'},
 {k:'opera',n:'오페라 칸막이석 한 해 빌리기',p:500,rep:1,fx:{soc:3,relite:2,fame:1},t:'오페라 칸막이석을 한 해 빌렸다. 무대보다 다른 칸막이석의 사람들을 보는 날이 더 많았다.'},
 {k:'piano',n:'에라르 피아노포르테',p:1200,c:()=>s.year>=1785,fx:{soc:2,relite:2},t:'에라르 공방의 피아노포르테를 들였다. 계단으로 올리는 데 일꾼 여섯이 붙었다.'},
 {k:'carriage',n:'자가용 마차',p:3000,fx:{fame:3,relite:4,soc:2},t:'자가용 마차를 장만했다. 마부와 말 두 필도 함께였다. 진흙탕 길을 걸어 다니던 날들은 끝났다.'}];
const rf2Price=it=>Math.max(1,Math.round(it.p*(typeof price==='function'?price(s.year):1)));
function rf2Shop(box){s.own=s.own||{};
  box.appendChild(el('p','mut','사치는 사교와 체면을 올리지만 돈이 든다. 공포정치 때는 혐의를 산다.'));
  RF2_SHOP.filter(it=>{try{return !it.c||it.c()}catch(e){return false}}).forEach(it=>{const pr=rf2Price(it),own=!it.rep&&s.own[it.k],used=it.rep&&s.acts['shop_'+it.k]===s.year;
    const b=el('button','opt row');b.type='button';const sp=el('span');sp.appendChild(el('span','ol',it.n));sp.appendChild(el('small',null,own?`${s.own[it.k]}년에 샀다`:it.rep?'한 해에 한 번':Object.keys(it.fx).map(k=>FXN[k]||({relite:'평판(상류층)',rloc:'평판(이웃)'})[k]||k).join(' · ')+' +'));b.appendChild(sp);
    b.appendChild(el('em',null,own?'소유':used?'올해 함':`${fmt(pr)}`));b.disabled=own||used||s.money<pr||sheetLive||busy||s.cond!=='normal';
    b.onclick=()=>{if(busy||sheetLive)return;s.money-=pr;if(it.rep)s.acts['shop_'+it.k]=s.year;else s.own[it.k]=s.year;
      const f=Object.assign({},it.fx);if(T()>=1793.4&&T()<1794.6&&pr>=60)f.sus=(f.sus||0)+3;
      const tx=typeof it.t==='function'?it.t():it.t;L(tx+` (재산 -${fmt(pr)})`+fx(f),'ev');if(pr>=150)rf2React('lux');render();save();toast(tx)};box.appendChild(b)})}
function rf2FacBody(W){W.innerHTML='';const list=ACTS.filter(a=>{try{return !a.hide&&a.c()}catch(e){return false}});
  const grid=el('div','fac-grid');RF2_FAC.forEach(([k,n,fr])=>{const sub=k==='shop'?null:list.filter(a=>rf2FacOf(a)===k);if(sub&&!sub.length)return;
    const b=el('button','fac'+(rf2Fac===k?' on':''));b.type='button';b.innerHTML=`<b>${n}</b><small>${fr}</small>`;b.setAttribute('aria-pressed',String(rf2Fac===k));
    b.onclick=()=>{rf2Fac=rf2Fac===k?null:k;rf2FacBody(W)};grid.appendChild(b)});W.appendChild(grid);
  if(!rf2Fac)return;const box=el('div','acts fac-acts');W.appendChild(box);
  if(rf2Fac==='shop'){rf2Shop(box);return}
  const sub=list.filter(a=>rf2FacOf(a)===rf2Fac);if(!sub.length){box.appendChild(el('p','mut','지금 이곳에서 할 수 있는 일이 없다.'));return}actButtons(sub,box)}
{const _ba=buildActs;buildActs=function(pin){if(!s)return;if(child())return _ba(pin);
  if(s.cond!=='normal'){const list=ACTS.filter(a=>{try{return !a.hide&&a.c()}catch(e){return false}});const box=el('div','acts');
    if(!list.length)box.appendChild(el('p','mut',s.cond==='prison'?'감옥에서는 할 수 있는 일이 없다.':s.cond==='emigre'?'망명지에서는 기다릴 수밖에 없다.':'지금은 할 수 있는 일이 없다.'));else actButtons(list,box);pin.appendChild(box);return}
  pin.appendChild(el('p','mut','시설을 고르면 그곳에서 할 수 있는 일이 나옵니다. 활동은 각각 한 해에 한 번, 시간이 멈춘 동안 고를 수 있습니다.'));
  const W=el('div','facw');pin.appendChild(W);rf2FacBody(W)}}

/* ---------- f. 벗들: 당신의 삶에 대한 반응 ---------- */
const RF2_ALL=()=>BF_KEYS.filter(k=>bfMet(k)&&bfAlive(k)&&!bfR(k).cut);
const RF2_RX={
 louise:{wed:[()=>`${bU('louise')} 혼례 빵을 직접 구워 왔다. 가운데에 두 사람의 이름 첫 글자를 반죽으로 붙여 놓았다.`,()=>`${bU('louise')} 신부 들러리 옆에서 제일 크게 울었다. “잘 먹고 잘 살아. 둘 다.”`],
  birth:[()=>`${bU('louise')} 갓난아이를 안아 보더니 “빵 반죽처럼 따뜻하네.” 하고 웃었다. 그 뒤로 날마다 우유 한 병을 문 앞에 두고 갔다.`],
  prison:[()=>`${bU('louise')} 날마다 감옥 문 앞에 빵을 맡겼다. 간수에게 빵 한 덩이를 더 쥐여 주어야 했다.`],
  ill:[()=>`${bU('louise')} 앓아누운 당신에게 부이용 수프를 끓여 왔다. “먹어. 남기면 혼나.”`],
  job:[()=>`${bU('louise')} 소식을 듣고 가게 문을 닫고 달려왔다. “내 그럴 줄 알았어.”`],
  lux:[()=>`${bU('louise')} 새로 산 물건을 한참 보더니 물었다. “그거면 빵이 몇 덩이야?” 웃었지만 농담만은 아니었다.`],
  free:[()=>`감옥에서 나온 날, ${bU('louise')} 아무 말 없이 갓 구운 빵을 내밀었다. 제일 바삭한 꽁다리였다.`]},
 etienne:{wed:[()=>`${bU('etienne')} 혼례 축사에서 “사랑은 평등한 두 사람의 계약”이라고 했다. 신부님이 헛기침을 했다.`],
  birth:[()=>`${bU('etienne')} 아이에게 『텔레마코스의 모험』을 선물했다. “글을 읽게 되면 줘. 표지는 내가 새로 붙였어.”`],
  prison:[()=>`${bI('etienne')} 위원회를 찾아다니며 당신의 이름을 대신 말해 주었다. 그것이 ${bHe('etienne')}에게도 위험한 일이라는 것을 나중에야 알았다.`],
  ill:[()=>`${bU('etienne')} 앓는 당신 머리맡에서 신문을 소리 내어 읽어 주었다. 당신이 잠들 때까지 멈추지 않았다.`],
  job:[()=>`${bU('etienne')} 축하한다면서도 물었다. “그 자리에서 무엇을 바꿀 거야?”`],
  lux:[()=>`${bU('etienne')} 새로 산 물건을 보고 입을 다물었다. 그날 저녁 내내 ${bHe('etienne')}는 평등에 대해서만 이야기했다.`],
  free:[()=>`${bU('etienne')} 당신이 풀려난 날 아무 말 없이 오래 끌어안았다. 그 어깨가 떨리고 있었다.`]},
 jules:{wed:[()=>bfR('jules').job&&/신부/.test(bfR('jules').job)?`혼배 미사는 ${bI('jules')} 집전했다. 강론 내내 한 번도 더듬지 않았다.`:`${bU('jules')} 혼례 미사에서 성가를 불렀다. 노래할 때는 한 번도 더듬지 않았다.`],
  birth:[()=>`아이의 세례 날 ${bU('jules')} 종탑에 올라가 종을 쳐 주었다. 당신 아이를 위한 종소리였다.`],
  prison:[()=>`${bU('jules')} 감옥으로 쪽지를 보냈다. 서툰 글씨로 “매일 기도해.”라고만 적혀 있었다.`],
  ill:[()=>`${bU('jules')} 앓는 당신 곁에서 묵주 기도를 바쳤다. 말을 더듬어 기도가 길어졌다. 당신은 그 소리를 들으며 잠들었다.`],
  job:[()=>`${bU('jules')} 축하의 말을 하려다 더듬었다. 대신 손을 꼭 잡았다.`],
  lux:[()=>`${bU('jules')} 새로 산 물건을 보더니 조용히 말했다. “가, 가난한 사람들도 잊지 마.”`],
  free:[()=>`${bU('jules')} 당신이 풀려나자 감사 미사를 드렸다. 성당에는 당신과 ${bHe('jules')} 둘뿐이었다.`]},
 antoine:{wed:[()=>`${bU('antoine')} 혼례 선물로 은수저 한 벌을 보냈다. 상자 안에는 “이자는 안 받아.”라는 쪽지가 있었다.`],
  birth:[()=>`${bU('antoine')} 아이 이름으로 저축 금고에 돈을 넣어 주었다. “스무 살이 되면 이자가 꽤 붙을 거야.”`],
  prison:[()=>`${bI('antoine')} 간수에게 돈을 쥐여 주어 당신 감방에 짚과 담요가 들어왔다. 누가 보냈는지는 나중에 알았다.`],
  ill:[()=>`${bU('antoine')} 제일 비싼 의사를 보내 주었다. 청구서는 끝내 오지 않았다.`],
  job:[()=>`${bU('antoine')} 축하주를 사며 계산부터 했다. “그 자리면 한 해에 얼마야?” 그러고는 진심으로 기뻐했다.`],
  lux:[()=>`${bU('antoine')} 새로 산 물건의 값을 정확히 맞혔다. “다음엔 나한테 사. 반값에 구해 줄게.”`],
  free:[()=>`${bU('antoine')} 당신이 풀려난 날 마차를 보내 주었다. 마부는 아무것도 묻지 말라는 말을 들었다고 했다.`]},
 gabriel:{wed:[()=>`${bU('gabriel')} 혼례에 신랑 신부보다 더 화려하게 차려입고 왔다. 그러고는 축배를 들며 처음으로 진지한 얼굴을 했다.`],
  birth:[()=>`${bU('gabriel')} 아이에게 수놓은 비단 배내옷을 보냈다. 아이보다 배내옷이 더 비쌌다.`],
  prison:[()=>`${bU('gabriel')} 감옥 면회에 낡은 옷을 입고 왔다. 그렇게 수수한 차림은 처음 보았다.`],
  ill:[()=>`${bU('gabriel')} 앓는 당신에게 거울을 들이밀었다. “얼굴 좀 봐. 빨리 나아. 이건 내가 못 보겠어.”`],
  job:[()=>`${bU('gabriel')} 축하한다며 당신의 옷차림부터 고쳐 주었다. “이제 그런 옷은 안 돼.”`],
  lux:[()=>`${bU('gabriel')} 새로 산 물건을 보고 손뼉을 쳤다. “드디어! 너도 사람답게 사는구나.”`],
  free:[()=>`${bU('gabriel')} 당신이 풀려난 날 제일 좋은 옷을 빌려주었다. “걸어 나올 때만큼은 멋있어야지.”`]},
 robespierre:{wed:[()=>`막시밀리앙이 혼례에 왔다. 춤은 추지 않았고 포도주는 물을 탔다. 그래도 끝까지 자리를 지켰다.`],
  birth:[()=>`막시밀리앙이 아이에게 루소의 『에밀』을 보냈다. “아이를 자연이 가르치게 하게.”`],
  prison:[()=>`막시밀리앙에게 편지를 썼다. 답장은 오지 않았다. 다만 그 뒤로 심문이 조금 짧아졌다.`],
  ill:[()=>`막시밀리앙이 오렌지 한 바구니를 보냈다. 쪽지에는 단정한 글씨로 “쾌차를 빈다”고만 적혀 있었다.`],
  job:[()=>`막시밀리앙은 당신의 새 자리를 축하하며 덧붙였다. “덕이 없는 권력은 해롭다네.”`],
  lux:[()=>`막시밀리앙은 새로 산 물건에 눈길도 주지 않았다. 그것이 그의 대답이었다.`],
  free:[()=>`풀려난 날, 막시밀리앙에게서 짧은 쪽지가 왔다. “공화국은 무고한 이를 벌하지 않는다.” 당신은 그 말을 오래 들여다보았다.`]},
 desmoulins:{wed:[()=>`카미유는 혼례 축사를 하다가 더듬었다. 하객들이 웃었고 카미유도 웃었다. 그 축사는 나중에 그의 신문에 실렸다.`],
  birth:[()=>`카미유가 아이를 보러 와서 말했다. “우리 오라스와 같이 놀게 하자.” 그는 아이를 안는 법이 서툴렀다.`],
  prison:[()=>`카미유가 신문에 이름을 밝히지 않고 당신 이야기를 썼다. “죄 없는 시민이 갇혀 있다.”`],
  ill:[()=>`카미유가 앓는 당신을 웃기려고 온갖 풍자시를 읊었다. 웃다가 기침이 더 났다.`],
  job:[()=>`카미유가 소식을 듣고 와서 샴페인을 터뜨렸다. 코르크가 천장에 맞았다.`],
  lux:[()=>`카미유는 새로 산 물건을 보고 웃었다. “좋은 건 좋은 거지. 공화국도 아름다워야 해.”`],
  free:[()=>`카미유가 문 앞에서 기다리고 있었다. “자유! 자유!” 그는 더듬지 않고 외쳤다.`]}};
function rf2React(kind){try{if(!s.bf)return;const ks=RF2_ALL().filter(k=>RF2_RX[k]&&RF2_RX[k][kind]&&bfR(k).close>=30&&bfR(k).cond!=='prison');if(!ks.length)return;
  const sel=ks.sort(()=>R()-.5).slice(0,kind==='lux'||kind==='job'?1:2);
  for(const k of sel){const t=pick(RF2_RX[k][kind])();L(t,'ev');bfRel(k,kind==='lux'?(['etienne','jules','robespierre'].includes(k)?{close:-2}:{close:2}):{close:3,trust:2})}}catch(e){console.error(e)}}
// 당신의 삶이 바뀐 순간을 잡는다
{const _as=advanceSeason;advanceSeason=async function(){const b={m:!!s.married,k:(s.kids||[]).length,c:s.cond,j:s.job};await _as();if(!s||s.dead)return;
  try{if(!b.m&&s.married)rf2React('wed');if((s.kids||[]).length>b.k)rf2React('birth');if(b.c!=='prison'&&s.cond==='prison')rf2React('prison');if(b.c==='prison'&&s.cond==='normal')rf2React('free');
    if(b.j&&s.job&&s.job!==b.j&&!child())rf2React('job')}catch(e){console.error(e)}}}
{const _fi=fallIll;fallIll=async function(d){await _fi(d);if(s&&!s.dead&&R()<.7)rf2React('ill')}}

/* ---------- f. 벗을 찾아간다 (사교 시설) ---------- */
const RF2_VISIT={
 louise:[()=>`새벽에 빵집에 들렀다. ${bU('louise')} 반죽을 치대다 말고 밀가루 묻은 손으로 당신 볼을 꼬집었다.`,()=>`${bW('louise')} 빵집 뒷계단에 앉아 식은 꽁다리를 나눠 먹었다. 어릴 때와 똑같은 자리였다.`,()=>`${bU('louise')} 동생 피에르 이야기를 한참 했다. 당신은 끝까지 들어 주었다.`,()=>`${bI('louise')} 새로 배운 글자로 가게 간판을 고쳐 썼다며 자랑했다. 철자가 하나 틀렸지만 말하지 않았다.`],
 etienne:[()=>`${bW('etienne')} 카페 프로코프 구석에서 신문 세 개를 펼쳐 놓고 밤늦도록 떠들었다.`,()=>`${bU('etienne')} 새로 쓴 글을 읽어 주었다. 문장마다 느낌표가 있었다.`,()=>`${bW('etienne')} 센 강변 헌책방을 돌았다. ${bU('etienne')} 『텔레마코스의 모험』 다른 판본을 또 샀다.`],
 jules:[()=>`${bfPar()} 종탑에 올라가 ${bW('jules')} 지붕들을 내려다보았다. ${bU('jules')} 종마다 이름이 있다고 했다.`,()=>`${bU('jules')} 저녁 기도 전 성가대 연습을 하고 있었다. 당신은 맨 뒷자리에서 끝까지 들었다.`,()=>`${bW('jules')} 성당 뜰을 천천히 걸었다. 둘 다 말이 적었다. 그래도 좋았다.`],
 antoine:[()=>`${bU('antoine')} 가게 장부를 보여 주며 올해 장사를 자랑했다. 마지막 장은 덮어 버렸다.`,()=>`${bW('antoine')} 선술집 구석에서 잔을 기울였다. ${bU('antoine')} 어머니 이야기를 할 때만 목소리가 낮아졌다.`,()=>`${bU('antoine')} 새로 들여온 물건을 보여 주었다. “너한테만 원가에 줄게.” 정말 원가인지는 알 수 없었다.`],
 gabriel:[()=>`${bU('gabriel')} 재단사에게 당신을 끌고 가 새 조끼 천을 골라 주었다. 값은 끝내 말하지 않았다.`,()=>`${bW('gabriel')} 팔레루아얄 회랑을 걸었다. ${bU('gabriel')} 지나가는 사람마다 옷차림을 평했다. 다 맞는 말이었다.`,()=>`${bU('gabriel')} 손거울을 내려놓고 오래된 푸른 리본 이야기를 꺼냈다. 그러다 금세 다른 이야기로 넘어갔다.`],
 robespierre:[()=>`생토노레 거리 뒤플레 목수의 집에서 막시밀리앙을 만났다. 그는 오렌지 껍질을 가지런히 벗기며 말했다. “덕이 없으면 공포는 해롭고, 공포가 없으면 덕은 무력하네.”`,()=>`막시밀리앙과 아라스 이야기를 했다. 그는 누이 샤를로트와 장미 시인회(로자티) 친구들 이야기를 할 때만 조금 웃었다.`,()=>`막시밀리앙의 방에는 자기 초상화가 여러 장 걸려 있었다. 당신이 웃자 그도 조금 민망한 얼굴을 했다.`],
 desmoulins:[()=>`카미유와 뤼실의 집에 갔다. 뤼실은 피아노를 치고 카미유는 갓난 오라스를 안고 서투르게 춤을 추었다.`,()=>`카미유가 새 신문 교정쇄를 보여 주었다. 잉크가 손에 묻어도 그는 개의치 않았다.`,()=>`카미유와 팔레루아얄 카페 드 푸아에 갔다. 그가 탁자에 올라섰던 자리에서 둘은 커피를 마셨다.`]};
defineAct({k:'bfvisit',g:'social',n:'벗을 찾아간다',s:'벗 한 사람과 친밀 +',c:()=>!child()&&s.cond==='normal'&&RF2_ALL().some(k=>RF2_VISIT[k]&&bfR(k).cond!=='prison'),inter:async()=>{
  const ks=RF2_ALL().filter(k=>RF2_VISIT[k]&&bfR(k).cond!=='prison');rfNoLog=true;let i;try{i=await Q('벗을 찾아간다','chez un ami','누구를 찾아갈까?',ks.map(k=>({l:bfR(k).n,s:bfR(k).job||'',a:'social'})))}finally{rfNoLog=false}
  const k=ks[i];const t=stPick('vis'+k,RF2_VISIT[k].map(f=>f()));say(t,'ev');bfRel(k,{close:5,trust:2});const ms=bfS().mem.filter(m=>m.k.includes(k));if(ms.length)bfWake(pick(ms).id);await done()}});

/* ---------- f. 곁가지 장면: 한 해에 한두 번, 무작위 달에 ---------- */
const RF2_SIDE=[];
const side=(k,id,when,run)=>RF2_SIDE.push({k,id,when,run});
async function rf2Side(){const B=bfS();B.side=B.side||{};const ok=RF2_SIDE.filter(x=>!B.side[x.id]&&(x.k==='group'||(bfMet(x.k)&&bfAlive(x.k)&&!bfR(x.k).cut&&bfR(x.k).cond!=='prison'))&&(()=>{try{return x.when()}catch(e){return false}})());
  if(!ok.length||!bfHere()||sheetLive)return;const pr=ok.filter(x=>x.pri);const x=pick(pr.length?pr:ok);B.side[x.id]=s.year;try{await x.run()}catch(e){console.error('side',x.id,e);sheetClose()}}
const aB=k=>s.year-(bfR(k)?bfR(k).by:s.by);

// 루이즈
side('louise','lo_fair',()=>s.age>=13&&s.age<=24,async()=>{const L0=bN('louise');
  await bfScene('생제르맹 장터','la foire Saint-Germain',`${bI('louise')} 생제르맹 장터에 같이 가자고 졸랐다. 줄타기 광대와 와플 장수 사이에서 ${bU('louise')} 리본 가게 앞에 오래 서 있다. 노란 리본 하나에 6수. 그녀의 주머니에는 2수뿐이다.`,[
   {l:'리본을 사 준다',a:'social',dis:s.money<1,f:()=>{bfMem('m_lo_fair','louise',`생제르맹 장터에서 ${L0}에게 노란 리본을 사 주었다.`,{obj:'노란 리본',place:'생제르맹 장터',their:'그 리본은 결혼식 날에도 맸다. 그 사람은 기억 못 하겠지만.'});bfRel('louise',{close:8});say(`${bU('louise')} 리본을 머리에 매고 장터 끝까지 깡충깡충 뛰어갔다.`+fx({money:-1}))}},
   {l:'와플을 사서 나눠 먹는다',a:'family',f:()=>{say(`둘은 와플 하나를 반으로 갈라 들고 줄타기 광대를 구경했다. 설탕 가루가 ${bN('louise')}의 코끝에 묻었다. 당신은 말해 주지 않았고, ${bU('louise')} 하루 종일 그 얼굴로 장터를 돌아다녔다.`);bfMem('m_lo_fair','louise',`생제르맹 장터에서 ${bW('louise')} 와플 하나를 나눠 먹었다.`,{place:'생제르맹 장터',their:'와플은 반으로 갈라도 컸다. 그날은 배가 불렀다.'});bfRel('louise',{close:5})}},
   {l:'“리본은 사치야.”라고 말한다',a:'safe',f:()=>{say(`${bU('louise')} 리본에서 눈을 떼더니 “누가 산대?” 하고 앞서 걸어갔다. 장터를 나설 때까지 한 번도 뒤돌아보지 않았다. 그날 저녁, 당신은 그 노란 리본이 자꾸 떠올랐다.`);bfMem('m_lo_fair','louise',`생제르맹 장터에서 ${bU('louise')} 리본을 오래 보았다. 사치라고 말했다.`,{tone:'씁쓸함',place:'생제르맹 장터',their:'맞는 말이었다. 그래서 더 서운했다.'});bfRel('louise',{close:-2})}}])});
side('louise','lo_pierre',()=>s.age>=17&&s.age<=40,async()=>{
  await bfScene('피에르의 도제 계약','le contrat d’apprentissage',`${bU('louise')} 남동생 피에르를 제빵 장인에게 도제로 보내려 한다. 계약서를 대신 읽어 줄 사람이 필요하고, 도제 비용 30리브르가 모자란다. ${bU('louise')} 부탁하는 일이 서툴다.`,[
   {l:'계약서를 읽어 주고 조항을 따진다',a:'study social',dis:!lit(),f:()=>{bfMem('m_lo_pierre','louise',`${bN('louise')}의 동생 피에르의 도제 계약서를 대신 읽어 주었다. 장인이 숨겨 둔 조항 하나를 찾아냈다.`,{place:'제빵 장인의 가게',their:'그 사람이 없었으면 피에르는 칠 년 동안 공짜로 일할 뻔했다.'});bfRel('louise',{close:6,trust:8,resp:6});say('장인이 끼워 넣은 “숙식 비용은 도제 부담” 조항을 지우게 했다.'+fx({rloc:1}))}},
   {l:'모자란 돈을 빌려준다',a:'family',dis:s.money<30,f:()=>{bfMem('m_lo_pierre','louise',`${bN('louise')}에게 피에르의 도제 비용 30리브르를 빌려주었다.`,{place:'빵집',their:'그 돈은 삼 년에 걸쳐 갚았다. 마지막 동전을 건넬 때 둘 다 울었다.'});bfRel('louise',{close:8,trust:6});say(`${bU('louise')} 삼 년에 걸쳐 갚겠다고 했다. 정말로 그렇게 했다.`+fx({money:-30}))}},
   {l:'형편이 안 된다고 한다',a:'safe',f:()=>{say(`${bU('louise')} “괜찮아, 다른 데 알아볼게.” 하고 웃었다. 그 웃음이 너무 빨리 나왔다. 피에르는 한 해 더 빵집 화덕 앞에서 장작을 날랐다.`);bfMem('m_lo_pierre','louise',`${bN('louise')}의 부탁을 거절했다. 피에르의 도제 계약은 한 해 미뤄졌다.`,{tone:'후회',their:'그 사람도 어려웠을 것이다. 알면서도 오래 서운했다.'});bfRel('louise',{close:-3})}}])});
side('louise','lo_flour',()=>!child()&&(price(s.year)>=1.35||(T()>=1789.3&&T()<1789.7)||(T()>=1795.2&&T()<1795.6)),async()=>{
  await bfScene('밀가루 자루','la farine',`밀가루 값이 하루가 다르게 오른다. 빵집 앞에는 새벽부터 줄이 섰다. ${bI('louise')} 당신을 뒷문으로 불러 속삭인다. “밀가루 두 자루가 남았어. 줄 선 사람들 몫이야. 그런데 내 동생들도 배가 고파.”`,[
   {l:'“줄 선 사람들 몫이야.”라고 말한다',a:'social',f:()=>{bfMem('m_lo_flour','louise',`밀가루가 모자라던 해, ${bN('louise')}에게 줄 선 사람들 몫을 지키라고 했다.`,{tone:'씁쓸함',place:'빵집 뒷문',their:'그 사람 말대로 했다. 그해 겨울 내 동생들은 말랐지만, 골목 사람들은 나를 잊지 않았다.'});bfRel('louise',{resp:8});say(`${bU('louise')} 고개를 끄덕였다. 그날 빵은 줄 끝의 노파까지 돌아갔다.`+fx({rloc:2}))}},
   {l:'한 자루는 동생들 몫으로 숨기라고 한다',a:'family',f:()=>{say(`그날 밤 ${bU('louise')} 밀가루 한 자루를 침대 밑에 밀어 넣었다. 이튿날 빵집 앞 줄의 끝에서 빵이 모자랐다. 빈손으로 돌아서는 노파의 뒷모습을 당신도 보았다.`);bfMem('m_lo_flour','louise',`밀가루가 모자라던 해, ${bN('louise')}에게 한 자루는 동생들 몫으로 숨기라고 했다.`,{tone:'죄책감',place:'빵집 뒷문',their:'그 사람이 숨기라고 했다. 내 동생들은 살았다. 그 말이 고마웠고, 부끄러웠다.'});bfRel('louise',{close:8,trust:5})}},
   {l:'당신 몫의 빵을 동생들에게 준다',a:'family bold',f:()=>{bfMem('m_lo_flour','louise',`밀가루가 모자라던 해, 당신 몫의 빵을 ${bN('louise')}의 동생들에게 주었다.`,{tone:'감사',place:'빵집 뒷문',their:'그 사람은 자기 빵을 내 동생들에게 주었다. 그해 겨울을 평생 갚지 못했다.'});bfRel('louise',{close:12,trust:10});say('그 주 내내 당신은 배가 고팠다.'+fx({hp:-2,rloc:2}))}}])});
side('louise','lo_god',()=>s.age>=24&&aB('louise')<=42,async()=>{
  await bfScene('대모','la marraine',`${bI('louise')} 갓 태어난 딸을 안고 왔다. “이 아이 ${jo(isM()?'대부':'대모','이','가')} 되어 줘. 글을 아는 사람이었으면 해. 나처럼 살지 않게.”`,[
   {l:'기꺼이 받아들인다',a:'family pious',f:()=>{bfMem('m_lo_god','louise',`${bN('louise')}의 딸의 ${jo(isM()?'대부':'대모','이','가')} 되었다. 세례반 앞에서 아이 이름을 대신 말했다.`,{obj:'세례 증서',place:bfPar(),their:'그 사람이 우리 딸의 이름을 불러 주었다. 그 아이는 커서 글을 배웠다.'});bfObj('godchild',`${bN('louise')}의 딸의 세례 증서`,{from:'louise'});bfRel('louise',{close:10,trust:10});say('세례반의 물이 차가웠는지 아이가 크게 울었다. 다들 좋은 징조라고 했다.'+fx({faith:1,rfam:1}))}},
   {l:'더 좋은 사람을 찾으라고 한다',a:'safe',f:()=>{say(`${bU('louise')} 아이를 고쳐 안으며 “그래, 알았어.” 하고 말했다. 세례식 날 당신은 맨 뒷자리에 앉았다. 세례반 앞에 선 사람은 글을 모르는 이웃 아낙이었다.`);bfMem('m_lo_god','louise',`${bN('louise')}의 딸의 ${jo(isM()?'대부':'대모','이','가')} 되어 달라는 부탁을 사양했다.`,{tone:'후회',their:'그 사람은 사양했다. 겸손해서인지, 귀찮아서인지 끝내 묻지 못했다.'});bfAsk('q_lo_god','louise',`${bU('louise')} 왜 하필 당신에게 부탁했을까?`);bfRel('louise',{close:-3})}}])});

// 에티엔
side('etienne','et_pamph',()=>s.age>=17&&s.age<=34&&lit(),async()=>{const E=bN('etienne');
  await bfScene('첫 팸플릿','le pamphlet',`${bI('etienne')} 밤새 쓴 팸플릿 원고를 내민다. 제목은 『${bfRev()&&T()<1789.5?'제3신분에게 고함':bfRev()?'인민의 이름으로':'노동하는 자에게 빵을'}』. 문장은 뜨겁고 철자는 엉망이다. “솔직하게 말해 줘.”`,[
   {l:'밤새 철자와 문장을 고쳐 준다',a:'study',f:()=>{bfMem('m_et_pamph','etienne',`${E}의 첫 팸플릿을 밤새 함께 고쳤다. 새벽에 인쇄소로 가져갔다.`,{obj:'팸플릿 교정쇄',place:'라탱 구역 셋방',their:'그 사람이 고친 문장이 제일 많이 인용되었다. 나는 그걸 아무에게도 말하지 않았다.'});bfRel('etienne',{close:8,trust:6});say('새벽 인쇄소의 잉크 냄새가 코를 찔렀다.'+fx({pen:1,pol:2}))}},
   {l:'“너무 과격해.”라고 말한다',a:'safe',f:()=>{say(`${bU('etienne')} 원고를 말아 쥐고 한참 당신을 보았다. “과격한 건 세상이야. 나는 받아 적을 뿐이고.” 그 팸플릿은 한 글자도 고쳐지지 않은 채 인쇄소로 갔다.`);bfMem('m_et_pamph','etienne',`${E}의 첫 팸플릿을 읽고 너무 과격하다고 말했다.`,{tone:'씁쓸함',their:'그 사람은 과격하다고 했다. 나는 한 글자도 고치지 않았다. 지금 보면 그 사람 말이 맞았다.'});bfRel('etienne',{riv:5,close:-2})}},
   {l:'이름을 함께 올리겠다고 한다',a:'radical bold',f:()=>{bfMem('m_et_pamph','etienne',`${E}의 팸플릿에 당신 이름도 함께 올렸다.`,{tone:'희망',their:'그 사람이 자기 이름도 올리자고 했다. 그날 우리는 같은 편이었다.'});bfRel('etienne',{close:10,trust:8});say('팸플릿은 팔레루아얄에서 사흘 만에 다 팔렸다.'+fx({fame:2,pol:4,sus:T()>=1789&&T()<1795?0:3}))}}])});
side('etienne','et_love',()=>s.age>=19&&s.age<=34,async()=>{const E=bN('etienne'),F=bfR('etienne').sex==='F';
  await bfScene('부치지 못한 편지','la lettre',`${bU('etienne')} 연설은 잘하면서 연애편지는 한 줄도 못 쓴다. 인쇄소 집 ${F?'아들':'딸'}에게 쓴 편지를 세 번째 찢고 있다. “네가 좀 써 줘. 너는 이런 거 잘하잖아.”`,[
   {l:'대신 써 준다',a:'social',dis:!lit(),f:()=>{bfMem('m_et_love','etienne',`${E} 대신 연애편지를 써 주었다. 답장이 왔다.`,{their:'그 편지 덕에 결혼했다. 아내는 지금도 내가 쓴 줄 안다.'});bfRel('etienne',{close:6});bfS().etWed=1;say(`답장이 왔다. ${bU('etienne')} 그 답장을 당신에게 열 번쯤 읽어 주었다.`)}},
   {l:'“네 말로 써야 해.”라고 말한다',a:'bold',f:()=>{say(`${bU('etienne')} 투덜거리면서도 새 종이를 꺼냈다. 밤새 창문에 촛불이 켜져 있었다. 이튿날 본 편지는 철자가 엉망이고 문장은 서툴렀지만, 한 줄 한 줄이 ${bN('etienne')}의 목소리였다.`);bfMem('m_et_love','etienne',`${bI('etienne')} 연애편지를 대신 써 달라고 했다. 네 말로 쓰라고 했다.`,{their:'그 사람 말대로 내 말로 썼다. 엉망이었다. 그래도 답장이 왔다.'});bfRel('etienne',{resp:6,close:3})}},
   {l:'“혁명이 먼저 아니었어?”라고 놀린다',a:'safe',f:()=>{say(`${bU('etienne')} 얼굴이 새빨개져 편지 조각을 난로에 던졌다. “혁명이 먼저야. 당연하지.” 그 뒤로 ${bHe('etienne')}는 그 사람 이야기를 다시 꺼내지 않았다.`);bfMem('m_et_love','etienne',`연애편지를 찢는 ${jo(bN('etienne'),'을','를')} 놀렸다.`,{tone:'부끄러움',their:'놀림을 받고 편지를 부치지 않았다. 그 사람은 다른 사람과 결혼했다.'});bfRel('etienne',{close:-2})}}])});
side('etienne','et_father',()=>s.age>=24&&bfKn('etienne','father')>=1,async()=>{const E=bN('etienne');
  await bfScene('아버지의 임종','le père',`${bN('etienne')}의 아버지가 위독하다는 소식이 왔다. ${bU('etienne')} 가지 않겠다고 한다. “그 사람이 끌어낸 침대가 몇 개인지 알아?” 그런데 외투는 벌써 입고 있다.`,[
   {l:'같이 가 주겠다고 한다',a:'family',f:()=>{bfMem('m_et_father','etienne',`${E}의 아버지 임종에 함께 갔다. 아버지는 아들의 이름을 부르고 숨을 거두었다.`,{tone:'위로',their:'그 사람이 같이 가 주지 않았다면 나는 문 앞에서 돌아섰을 것이다.'});bfKnow('etienne','father',2);bfRel('etienne',{close:10,trust:10});say(`${bU('etienne')} 장례식에서 울지 않았다. 묘지를 나와서야 울었다.`)}},
   {l:'“가지 않으면 평생 후회해.”라고 말한다',a:'bold',f:()=>{say(`${bU('etienne')} 당신을 노려보다가 문을 박차고 나갔다. 사흘 뒤 짧은 쪽지가 왔다. “늦지 않았어. 고마워. 그래도 너 미워.”`);bfMem('m_et_father','etienne',`${E}에게 아버지 임종에 가라고 했다. ${bHe('etienne')}는 갔다.`,{their:'그 사람 말이 맞았다. 그래도 그 말을 들을 때는 미웠다.'});bfKnow('etienne','father',2);bfRel('etienne',{resp:6})}},
   {l:'아무 말도 하지 않는다',a:'safe',f:()=>{say(`${bU('etienne')} 외투를 벗어 의자에 걸었다. 그리고 그날 밤 내내 신문을 읽었다. 같은 쪽을 몇 번이고. 이튿날 아침, 아버지의 부고가 왔다.`);bfMem('m_et_father','etienne',`${E}의 아버지가 위독하던 날, 아무 말도 하지 않았다. ${bHe('etienne')}는 가지 않았다.`,{tone:'후회',their:'아무도 가라고 하지 않았다. 나는 가지 않았다.'});bfReg('r_et_father','etienne',`${bN('etienne')}에게 아버지 임종에 가라고 말해 주지 못했다.`)}}])});

// 쥘
side('jules','ju_bells',()=>s.age>=12&&s.age<=30,async()=>{const J=bN('jules');
  await bfScene('부활절 종','les cloches de Pâques',`성 목요일부터 종은 울리지 않는다. 종들이 로마에 갔다고 아이들은 믿는다. 부활절 아침, ${bI('jules')} 종탑 위에서 손짓한다. “가, 같이 쳐 볼래?”`,[
   {l:'종탑에 올라가 함께 종을 친다',a:'social pious',f:()=>{bfMem('m_ju_bells','jules',`부활절 아침, ${bW('jules')} 함께 종을 쳤다. 줄에 매달려 발이 바닥에서 떴다.`,{obj:'종 줄',place:'종탑',their:'그날 종소리는 내 평생 가장 컸다. 그 사람이 같이 매달려 있었으니까.'});bfRel('jules',{close:8});say('온 동네가 종소리에 잠을 깼다. 손바닥에 물집이 잡혔다.'+fx({faith:1}))}},
   {l:'아래에서 듣는다',a:'safe',f:()=>{say(`종탑 아래 광장에 서서 종소리를 들었다. 첫 종이 울리자 비둘기 떼가 한꺼번에 날아올랐다. 종탑 창문으로 ${bN('jules')}의 작은 얼굴이 보였다. 당신은 손을 흔들었다.`);bfMem('m_ju_bells','jules',`부활절 아침, 종탑 아래에서 ${jo(bN('jules'),'이','가')} 치는 종소리를 들었다.`,{place:'종탑 아래',their:'그 사람이 아래에서 듣고 있었다. 나는 더 세게 쳤다.'});bfRel('jules',{close:3})}}])});
side('jules','ju_confess',()=>s.age>=26&&bfR('jules').job&&/신부/.test(bfR('jules').job),async()=>{const J=bN('jules');
  await bfScene('고해소','le confessionnal',`고해소 칸막이 너머의 목소리가 낯익다. ${J}다. 그도 당신을 알아보았는지 잠시 숨을 고른다. “말, 말씀하세요.”`,[
   {l:'평생 숨겨 온 잘못을 털어놓는다',a:'pious',f:()=>{bfMem('m_ju_conf','jules',`${bN('jules')}에게 고해했다. 칸막이 너머에서 그는 한 번도 더듬지 않았다.`,{tone:'위로',place:'고해소',their:'그 사람의 고해는 무덤까지 가지고 간다. 그것이 내 일이다.'});bfRel('jules',{trust:10,close:4});say('보속은 주님의 기도 세 번이었다. 성당을 나오는데 몸이 가벼웠다.'+fx({faith:3,cour:1}))}},
   {l:'다른 신부를 찾아간다',a:'safe',f:()=>{say(`당신은 무릎을 꿇었다가 그대로 일어나 고해소를 나왔다. 칸막이 너머에서 ${bU('jules')} 아무 말도 하지 않았다. 다음 주일, 당신은 다른 본당의 고해소 앞에 줄을 섰다.`);bfMem('m_ju_conf','jules',`${bN('jules')}의 고해소에 들어갔다가 그냥 나왔다.`,{tone:'의문',their:'그 사람이 고해소를 나갔다. 무엇을 말하려 했는지 나는 끝내 모른다.'});bfAsk('q_ju_conf','jules',`${bU('jules')} 당신이 무엇을 고해하려 했는지 짐작했을까?`)}}])});
side('jules','ju_song',()=>s.age>=18,async()=>{const J=bN('jules');
  await bfScene('장례 성가','le Dies irae',`이웃의 장례 미사. 성가대석에서 ${bI('jules')} 「진노의 날」을 부른다. 말을 할 때는 그렇게 더듬던 사람이, 노래할 때는 한 음도 흔들리지 않는다. 미사가 끝나고 ${bU('jules')} 당신 옆에 앉는다.`,[
   {l:'“네 노래는 하나도 안 더듬어.”라고 말한다',a:'social',f:()=>{say(`${bU('jules')} 한참 말이 없더니 웃었다. “노, 노래할 때는 하느님이 대신 말씀하시니까.” 그날은 성당을 나설 때까지 한 번도 더듬지 않았다.`);bfMem('m_ju_song','jules',`장례 미사에서 ${J}의 노래를 들었다. 노래할 때는 하나도 더듬지 않는다고 말했다.`,{their:'그 말을 들은 날부터 강론을 노래하듯 했다. 그러자 덜 더듬었다.'});bfKnow('jules','stutter',2);bfRel('jules',{close:6,trust:4})}},
   {l:'말없이 함께 앉아 있는다',a:'safe',f:()=>{say(`텅 빈 성당에 촛불 냄새가 남아 있었다. 둘은 성가대석에 나란히 앉아 아무 말도 하지 않았다. 해가 기울어 스테인드글라스의 빛이 바닥을 천천히 건너갔다.`);bfMem('m_ju_song','jules',`장례 미사가 끝나고 ${bW('jules')} 말없이 오래 앉아 있었다.`,{tone:'위로',their:'그 사람은 아무 말도 하지 않았다. 나한테는 그게 제일 편했다.'});bfRel('jules',{close:5})}}])});

// 앙투안
side('antoine','an_coffee',()=>s.age>=18&&s.age<=40&&s.money>=100,async()=>{const A=bN('antoine');
  await bfScene('커피 화물','le café des Îles',`${bI('antoine')} 눈을 빛내며 제안한다. “생도맹그에서 커피 화물이 온대. 지금 지분을 사 두면 낭트에 배가 들어올 때 두 배야. 100리브르만 넣어.”`,[
   {l:'100리브르를 넣는다',a:'greedy bold',f:()=>{const win=R()<(T()>=1791.6&&T()<1803?.25:.6);bfMem('m_an_coffee','antoine',`${A}의 커피 화물에 100리브르를 넣었다. ${win?'배는 무사히 들어왔다':'배는 돌아오지 않았다'}.`,{tone:win?'기쁨':'씁쓸함',their:win?'그 사람 돈으로 처음 크게 벌었다. 그 뒤로 운을 믿게 되었다.':'그 사람 돈을 잃었다. 그 사람은 한 번도 그 이야기를 꺼내지 않았다. 그게 더 무거웠다.'});
     if(win){say(`낭트에 배가 들어왔다. ${bU('antoine')} 약속대로 두 배를 돌려주었다.`+fx({money:100}));bfRel('antoine',{close:6,trust:8})}else{say(T()>=1791.6&&T()<1803?'생도맹그에서 노예들이 봉기했다는 소식이 왔다. 배는 돌아오지 않았다.'+fx({money:-100}):'배가 비스케이 만에서 폭풍을 만났다는 소식이 왔다.'+fx({money:-100}));bfRel('antoine',{close:2,resp:-2})}}},
   {l:'“그 커피는 누가 따는데?”라고 묻는다',a:'radical',f:()=>{bfMem('m_an_coffee','antoine',`${A}의 커피 화물 제안에 그 커피는 누가 따느냐고 물었다.`,{tone:'의문',their:'그 사람이 그 커피는 누가 따느냐고 물었다. 대답하지 못했다. 그 뒤로 커피를 마실 때마다 그 질문이 생각났다.'});bfAsk('q_an_coffee','antoine',`${bU('antoine')} 그 질문을 기억할까?`);bfRel('antoine',{riv:4});say(`${bU('antoine')} 한참 말이 없더니 “장사는 장사야.”라고 했다.`+fx({pol:2}))}},
   {l:'정중히 사양한다',a:'safe',f:()=>{say(`${bU('antoine')} 어깨를 으쓱하고 다른 투자자를 찾으러 갔다. 몇 달 뒤 낭트에서 소식이 왔을 때, 당신은 그 배가 어떻게 되었는지 끝내 묻지 않았다.`);bfMem('m_an_coffee','antoine',`${A}의 커피 화물 제안을 사양했다.`,{their:'그 사람은 조심스러웠다. 나는 그게 늘 부러웠다.'})}}])});
side('antoine','an_mother',()=>s.age>=22&&aB('antoine')<=55,async()=>{const A=bN('antoine');
  await bfScene('어머니의 병','la mère',`${bN('antoine')}의 어머니가 앓아누웠다. 가게는 닫혀 있고, ${bU('antoine')} 처음으로 당신 앞에서 돈 이야기를 하지 않는다. “어머니가 너를 보고 싶어 하셔. 어릴 때 구슬 내기 하던 애 말이야.”`,[
   {l:'꽃을 사 들고 찾아간다',a:'family',f:()=>{bfMem('m_an_mother','antoine',`${bN('antoine')}의 어머니를 찾아뵈었다. 어머니는 당신 손을 잡고 “우리 애를 부탁해.”라고 했다.`,{tone:'그리움',place:'생드니 거리 2층',their:'어머니가 그 사람 손을 잡고 나를 부탁했다. 나는 문밖에서 그 말을 들었다.'});bfRel('antoine',{close:10,trust:8});say('어머니의 손은 가볍고 따뜻했다.'+fx({rfam:1}))}},
   {l:'의사 비용을 보탠다',a:'family',dis:s.money<40,f:()=>{bfMem('m_an_mother','antoine',`${bN('antoine')}의 어머니 병원비로 40리브르를 보탰다.`,{their:'그 사람이 돈을 보탰다. 장사꾼인 내가 처음으로 빚을 갚지 못했다.'});bfRel('antoine',{close:8,resp:8});say(`${bU('antoine')} 돈을 받고 한참 고개를 들지 못했다.`+fx({money:-40}))}},
   {l:'바빠서 가지 못한다',a:'safe',f:()=>{say(`그 주에 당신은 끝내 생드니 거리에 가지 못했다. 한 달 뒤 ${bU('antoine')} 가게 문을 다시 열었다. 어머니 이야기는 하지 않았고, 당신도 묻지 않았다.`);bfReg('r_an_mother','antoine',`${bN('antoine')}의 어머니가 보고 싶어 했는데 가지 못했다.`);bfRel('antoine',{close:-4})}}])});
side('antoine','an_offer',()=>s.age>=32&&aB('antoine')>=30,async()=>{const A=bN('antoine');
  await bfScene('동업 제안','l’associé',`${bU('antoine')} 이제 생드니 거리에서 손꼽히는 상인이다. 새 마차에서 내리며 말한다. “내 가게 장부를 맡아 줄 사람이 필요해. 믿을 수 있는 사람. 너 말고는 없어.”`,[
   {l:'장부를 맡는다',a:'greedy social',f:()=>{bfMem('m_an_offer','antoine',`${A}의 장부를 맡았다. 첫 장부에서 맞지 않는 숫자를 찾아냈다.`,{their:'그 사람이 찾아낸 숫자는 내 매형이 빼돌린 돈이었다. 나는 그 사람에게 평생 빚졌다.'});bfRel('antoine',{close:6,trust:10});say('일 년 내내 저녁마다 장부를 맞췄다.'+fx({money:Math.round(60*(price(s.year)||1)),trade:2}))}},
   {l:'“우정과 돈은 섞지 않을래.”라고 말한다',a:'safe',f:()=>{say(`${bU('antoine')} 잠시 당신을 바라보다 크게 웃었다. “역시 너는 너구나.” 그리고 마차에 오르며 덧붙였다. “그래도 한 번쯤은 후회하게 해 줄게.”`);bfMem('m_an_offer','antoine',`${A}의 동업 제안을 거절했다. 우정과 돈은 섞지 않겠다고 했다.`,{their:'그 사람 말이 맞았다. 그래서 우리는 끝까지 친구였다.'});bfRel('antoine',{resp:6})}}])});

// 가브리엘
side('gabriel','ga_tailor',()=>s.age>=15&&s.age<=32,async()=>{const Ga=bN('gabriel');
  await bfScene('재단사의 가게','chez le tailleur',`${bU('gabriel')} 당신을 생토노레 거리 재단사에게 끌고 갔다. “네 외투는 범죄야.” 줄자를 든 재단사가 당신을 위아래로 훑는다. 비단 조끼 한 벌에 40리브르다.`,[
   {l:'조끼를 맞춘다',a:'social',dis:s.money<40,f:()=>{bfMem('m_ga_tailor','gabriel',`${Ga}에게 끌려가 생토노레 거리에서 비단 조끼를 맞췄다.`,{obj:'비단 조끼',place:'생토노레 거리',their:'그 사람이 처음으로 내 말을 들었다. 조끼는 정말 잘 어울렸다.'});bfRel('gabriel',{close:8});say(`${bU('gabriel')} 거울 앞에 선 당신을 보고 박수를 쳤다.`+fx({money:-40,soc:2}))}},
   {l:'“내 외투가 어때서?”라고 버틴다',a:'bold',f:()=>{say(`재단사가 눈썹을 치켜올렸다. ${bU('gabriel')} 한숨을 쉬더니 당신의 낡은 외투 깃을 손수 바로 세워 주었다. “좋아. 그럼 적어도 똑바로 입어.”`);bfMem('m_ga_tailor','gabriel',`${Ga}의 재단사 앞에서 낡은 외투를 고집했다.`,{their:'그 사람은 낡은 외투를 벗지 않았다. 나는 그 고집이 부러웠다. 나는 한 번도 그래 본 적이 없다.'});bfRel('gabriel',{resp:6,riv:3})}},
   {l:'가브리엘의 조끼를 골라 준다',a:'social',f:()=>{say(`당신은 화려한 비단 두루마리들을 지나 맨 아래 칸의 회색 모직을 골랐다. ${bU('gabriel')} 질색을 하면서도 그 천을 오래 만지작거렸다. 결국 그 조끼를 맞췄다.`);bfMem('m_ga_tailor','gabriel',`재단사 가게에서 ${Ga}의 조끼를 대신 골라 주었다. 수수한 회색이었다.`,{their:'그 사람이 골라 준 회색 조끼는 아무도 칭찬하지 않았다. 그래도 제일 자주 입었다.'});bfRel('gabriel',{close:6,trust:4})}}])});
side('gabriel','ga_duel',()=>s.age>=18&&s.age<=32&&isM()&&bfR('gabriel').sex==='M',async()=>{const Ga=bN('gabriel');
  await bfScene('입회인','le témoin',`${bI('gabriel')} 파리 오페라 무도회에서 농담 한마디로 근위 장교의 체면을 건드렸다. 내일 새벽 불로뉴 숲에서 결투다. “입회인이 되어 줘. 그리고… 내가 도망치지 않게 봐 줘.”`,[
   {l:'상대 입회인과 화해를 주선한다',a:'social',f:()=>{const ok=R()<.6;bfMem('m_ga_duel','gabriel',ok?`${Ga}의 결투 입회인이 되어 화해를 이끌어 냈다. 둘은 칼을 뽑지 않았다.`:`${Ga}의 결투 입회인이 되었다. 화해는 실패했고 ${bU('gabriel')} 팔을 베였다.`,{tone:ok?'위로':'두려움',place:'불로뉴 숲',their:'그 사람 앞이라 도망칠 수 없었다. 그게 그 사람을 부른 이유였다.'});bfRel('gabriel',{close:8,trust:8});say(ok?'해가 뜨기 전에 사과문이 오갔다. 넷은 숲 입구에서 브랜디를 나눠 마셨다.'+fx({soc:2}):`칼끝이 ${bN('gabriel')}의 팔을 스쳤다. 피를 보고 결투는 끝났다. ${bU('gabriel')} 끝까지 서 있었다.`+fx({cour:2}))}},
   {l:'옆에 서서 끝까지 지켜본다',a:'bold',f:()=>{bfMem('m_ga_duel','gabriel',`${Ga}의 결투에 입회인으로 섰다. ${bU('gabriel')} 도망치지 않았다.`,{tone:'두려움',place:'불로뉴 숲',their:'그 사람이 지켜보고 있었다. 그래서 나는 서 있을 수 있었다.'});bfKnow('gabriel','dog',2);bfRel('gabriel',{close:10,trust:10});say(`첫 합에 ${bU('gabriel')} 상대의 소매를 베었다. 명예는 지켜졌다.`+fx({cour:2}))}},
   {l:'결투는 어리석은 짓이라며 거절한다',a:'safe',f:()=>{say(`${bU('gabriel')} 웃으며 “그래, 네 말이 맞아.” 하고 돌아섰다. 그 웃음이 떨리고 있었다. 이튿날 불로뉴 숲에서 돌아온 ${bU('gabriel')} 멀쩡했다. 다만 한동안 당신을 보러 오지 않았다.`);bfMem('m_ga_duel','gabriel',`${Ga}의 결투 입회인 부탁을 거절했다.`,{tone:'씁쓸함',their:'그 사람은 거절했다. 옳았다. 나는 다른 입회인을 구했고, 그날도 도망치지 않았다.'});bfRel('gabriel',{close:-3})}}])});
side('gabriel','ga_portrait',()=>s.age>=28&&aB('gabriel')>=28,async()=>{const Ga=bN('gabriel');
  await bfScene('초상화','le portrait',`${bU('gabriel')} 초상화를 그리게 했다. 손거울, 푸른 리본, 비단 옷. 그런데 화가 앞에 앉기 전 ${bI('gabriel')} 당신에게 묻는다. “같이 그려질래? 둘이 함께. 늙으면 보게.”`,[
   {l:'함께 그려진다',a:'social',f:()=>{bfMem('m_ga_portrait','gabriel',`${bW('gabriel')} 함께 초상화에 그려졌다. 석 달 동안 같은 옷을 입고 나란히 앉았다.`,{obj:'두 사람의 초상화',their:'그림 속 그 사람은 웃지 않았다. 나는 웃었다. 그게 우리였다.'});bfObj('portrait2',`${bW('gabriel')} 함께 그려진 초상화`,{from:'gabriel'});bfRel('gabriel',{close:10,trust:6});say('화가는 당신 쪽을 조금 어둡게 그렸다. 가브리엘이 그렇게 하라고 했다는 것은 나중에 알았다.'+fx({fame:1}))}},
   {l:'“네 그림이잖아.”라고 사양한다',a:'safe',f:()=>{say(`화가는 ${jo(bN('gabriel'),'을','를')} 혼자 그렸다. 석 달 뒤 완성된 그림 속 ${bU('gabriel')} 손거울을 들고 웃고 있었다. 오른쪽에 이상하게 빈 자리가 있었다.`);bfMem('m_ga_portrait','gabriel',`${Ga}의 초상화에 함께 그려지자는 말을 사양했다.`,{tone:'그리움',their:'그림 속 나는 혼자였다. 나중에 그 옆의 빈자리가 자꾸 눈에 들어왔다.'})}}])});

// 로베스피에르 (1758년생, 1794년까지)
side('robespierre','rb_rod',()=>s.year>=1783&&s.year<=1784&&s.age>=20,async()=>{
  await bfScene('아라스의 피뢰침','le paratonnerre',`아라스에서 막시밀리앙의 편지가 왔다. 생토메르의 드 비세리 씨가 지붕에 피뢰침을 세웠다가 이웃들이 벼락을 부른다며 소송을 걸었다. 막시밀리앙이 변론을 맡았다. “과학이 미신을 이기는 재판이 될 거야. 자네 생각은?”`,[
   {l:'프랭클린의 실험을 적어 답장한다',a:'study',dis:!lit(),f:()=>{bfMem('m_rb_rod','robespierre','막시밀리앙의 피뢰침 소송에 프랭클린의 실험을 적어 보냈다. 그는 이겼다.',{obj:'아라스에서 온 편지',their:'그 사람이 보낸 편지의 한 줄을 변론에 썼다. 신문이 그 변론을 실었다. 처음으로 내 이름이 파리에 알려졌다.'});bfRel('robespierre',{close:8,trust:6});say('막시밀리앙은 소송에서 이겼다. 그의 변론문이 파리 신문에 실렸다.'+fx({edu:1}))}},
   {l:'“시골 소송에 너무 힘쓰지 마.”라고 답한다',a:'safe',f:()=>{say(`답장은 오지 않았다. 몇 달 뒤 파리 신문에 아라스의 젊은 변호사가 피뢰침 소송에서 이겼다는 기사가 실렸다. 당신은 그 기사를 오려 두었다가 끝내 부치지 못했다.`);bfMem('m_rb_rod','robespierre','막시밀리앙의 피뢰침 소송 편지에 시골 소송이라며 가볍게 답했다.',{tone:'씁쓸함',their:'그 사람은 시골 소송이라고 했다. 나는 그 시골에서 이름을 얻었다.'});bfRel('robespierre',{close:-3})}}])});
side('robespierre','rb_rosati',()=>s.year>=1786&&s.year<=1788,async()=>{
  await bfScene('장미 시인회','les Rosati',`막시밀리앙이 아라스의 장미 시인회(로자티)에 들었다며 시 한 편을 보내왔다. 장미와 포도주를 노래하는 시다. 그 근엄한 친구가 쓴 시라고는 믿기지 않는다.`,[
   {l:'시로 답장한다',a:'social',dis:!lit(),f:()=>{say(`당신은 촛불 아래서 밤새 운을 맞췄다. 장미와 포도주, 그리고 루이르그랑의 차가운 기숙사 이야기를 썼다. 막시밀리앙의 답장에는 “자네 시가 내 시보다 낫네.”라는 한 줄이 있었다.`);bfMem('m_rb_rosati','robespierre','막시밀리앙이 장미 시인회의 시를 보내왔다. 당신도 시로 답장했다.',{obj:'장미 시인회의 시',their:'그 사람의 시는 서툴렀다. 그래서 좋았다. 그 편지를 오래 가지고 다녔다.'});bfRel('robespierre',{close:8});bfLetter('robespierre','장미와 포도주의 시. 마지막 줄에 “친구여, 우리는 늙지 않으리”라고 적혀 있었다.')}},
   {l:'“네가 장미를?”이라고 놀린다',a:'bold',f:()=>{say(`막시밀리앙의 다음 편지에는 시가 없었다. 아라스의 날씨와 소송 이야기만 적혀 있었다. 당신은 그 편지를 두 번 읽고서야 무엇이 빠졌는지 알았다.`);bfMem('m_rb_rosati','robespierre','막시밀리앙의 장미 시를 놀렸다.',{tone:'부끄러움',their:'그 사람이 놀렸다. 그 뒤로 시를 쓰지 않았다.'});bfRel('robespierre',{close:-2,riv:3})}}])});
side('robespierre','rb_gallery',()=>s.year>=1789&&s.year<=1791&&inParis()&&!child(),async()=>{
  await bfScene('방청석','la tribune',`국민의회 방청석. 연단에 오른 막시밀리앙의 목소리는 작고 아라스 억양이 남아 있다. 의원들이 웃고 떠든다. 그래도 그는 원고에서 눈을 떼지 않는다. 사형제 폐지를 말하고 있다.`,[
   {l:'방청석에서 크게 박수를 친다',a:'radical bold',f:()=>{bfMem('m_rb_gallery','robespierre','국민의회 방청석에서 막시밀리앙의 사형제 폐지 연설에 크게 박수를 쳤다.',{tone:'희망',place:'국민의회 방청석',their:'방청석의 박수 하나가 들렸다. 누구인지 알았다.'});bfRel('robespierre',{close:8,trust:6});say('주위의 의원 몇이 방청석을 올려다보았다.'+fx({pol:4,rpeople:1}))}},
   {l:'끝나고 원고를 고쳐 주겠다고 한다',a:'study',f:()=>{say(`회의장 복도에서 막시밀리앙이 원고를 내밀었다. 당신은 촛불 아래서 형용사 몇 개를 지웠다. 그는 하나하나 따지다가 한 문장만 고쳐 쓰기로 했다. 다음 연설에서 바로 그 문장에 박수가 터졌다.`);bfMem('m_rb_gallery','robespierre','막시밀리앙의 연설 원고를 읽고 몇 군데를 고쳐 주었다. 그는 한 군데만 받아들였다.',{place:'국민의회 방청석',their:'그 사람이 고친 원고에서 한 문장만 받아들였다. 그 문장에서 박수가 나왔다.'});bfRel('robespierre',{close:5,resp:5})}},
   {l:'조용히 듣고 나온다',a:'safe',f:()=>{say(`연설이 끝나자 의원들의 웃음소리가 다시 높아졌다. 당신은 방청석을 조용히 빠져나왔다. 밖은 벌써 어두웠다. 사형제를 없애자던 그 작은 목소리가 오래 귀에 남았다.`);bfMem('m_rb_gallery','robespierre','국민의회 방청석에서 막시밀리앙의 연설을 들었다. 사형제를 없애자는 연설이었다.',{tone:'의문',place:'국민의회 방청석'});bfAsk('q_rb_gallery','robespierre','사형제 폐지를 말하던 막시밀리앙은 왜 단두대의 사람이 되었을까?')}}])});

// 데물랭
side('desmoulins','ds_wed',()=>s.year===1790&&s.month>=10&&inParis()&&!child(),async()=>{
  await bfScene('생쉴피스의 혼례','les noces de Camille',`12월 29일, 생쉴피스 성당. 카미유가 뤼실 뒤플레시와 혼례를 올린다. 증인석에는 막시밀리앙과 브리소, 페티옹이 앉았다. 카미유가 당신을 보더니 손을 흔든다. 신부님이 “당신의 신문에 하느님을 모독하는 글이 있소.” 하고 혼배를 망설인다.`,[
   {l:'카미유 곁에 서서 웃어 준다',a:'social',f:()=>{bfMem('m_ds_wed','desmoulins','생쉴피스에서 카미유와 뤼실의 혼례를 보았다. 카미유는 미사 내내 울었다.',{place:'생쉴피스 성당',their:'그 사람이 웃고 있었다. 그래서 울어도 괜찮았다.'});bfRel('desmoulins',{close:8});if(bfAlive('robespierre'))bfRel('robespierre',{close:2});say('신부님은 결국 혼배를 허락했다. 카미유는 미사 내내 울었다. 막시밀리앙은 끝까지 울지 않았다.'+fx({soc:1}))}},
   {l:'신부님께 혼배를 간청한다',a:'pious social',f:()=>{bfMem('m_ds_wed','desmoulins','생쉴피스에서 카미유의 혼배를 망설이는 신부님께 간청했다.',{place:'생쉴피스 성당',their:'그 사람이 신부에게 간청했다. 나는 그때 처음으로 신부에게 고개를 숙였다.'});bfRel('desmoulins',{close:10,trust:6});say('신부님이 한숨을 쉬고 반지를 축복했다.'+fx({faith:1}))}}])});
side('desmoulins','ds_journal',()=>s.year>=1789&&s.year<=1791&&inParis()&&!child()&&lit(),async()=>{
  await bfScene('브라방 혁명 신문','les Révolutions de France et de Brabant',`카미유가 『프랑스와 브라방의 혁명』 다음 호에 실을 글이 모자란다며 당신을 붙든다. “구 소식이든, 빵값이든, 아무거나. 네 이름은 안 넣을게.”`,[
   {l:'우리 구의 빵값 이야기를 쓴다',a:'radical social',f:()=>{bfMem('m_ds_journal','desmoulins','카미유의 신문에 우리 구의 빵값 이야기를 썼다. 이름 없이 실렸다.',{obj:'『프랑스와 브라방의 혁명』 한 호',their:'그 사람 글이 그 호에서 제일 많이 읽혔다. 내 글보다.'});bfRel('desmoulins',{close:8,trust:6});say('그 주 동네 카페마다 그 글을 소리 내어 읽었다. 아무도 당신이 쓴 줄 몰랐다.'+fx({pen:2,pol:3,rpeople:1}))}},
   {l:'“네 신문은 너무 독해.”라고 사양한다',a:'safe',f:()=>{say(`카미유는 더듬으며 웃었다. “도, 독해야 읽히지.” 그는 다른 사람을 붙들러 카페를 나갔다. 다음 호에는 당신 동네 빵집 주인을 조롱하는 풍자가 실려 있었다.`);bfMem('m_ds_journal','desmoulins','카미유의 신문에 글을 써 달라는 부탁을 사양했다.',{their:'그 사람은 내 신문이 독하다고 했다. 몇 해 뒤 나는 그 말을 『비외 코르들리에』에 썼다.'});bfRel('desmoulins',{close:-2})}}])});
side('desmoulins','ds_horace',()=>s.year===1792&&s.month>=6&&inParis()&&!child(),async()=>{
  await bfScene('오라스의 출생 신고','Horace',`7월, 카미유의 아들 오라스가 태어났다. 카미유는 아이를 성당이 아니라 시청에 데려가 신고하겠다고 한다. 세례 대신 시민 등록. 파리에서 처음 있는 일이다. “증인이 되어 줄래?”`,[
   {l:'시청까지 함께 간다',a:'radical',f:()=>{bfMem('m_ds_horace','desmoulins','카미유의 아들 오라스를 시청에 신고하는 날 증인이 되었다. 세례 대신 시민 등록이었다.',{place:'파리 시청',their:'그 사람이 증인으로 서명했다. 오라스가 크면 그 이름을 보여 주려 했다.'});bfRel('desmoulins',{close:10,trust:8});say('등록부에 이름을 적었다. 카미유는 아이 귀에 대고 “너는 자유롭게 태어났다.”라고 속삭였다.'+fx({pol:3,faith:-1}))}},
   {l:'세례를 받게 하라고 권한다',a:'pious',f:()=>{bfMem('m_ds_horace','desmoulins','카미유에게 오라스의 세례를 권했다.',{tone:'의문',their:'그 사람은 세례를 권했다. 뤼실도 같은 생각이었다. 나는 듣지 않았다.'});bfRel('desmoulins',{close:-2});say('카미유는 웃으며 고개를 저었다.'+fx({faith:1}))}}])});

// 모두 함께
side('group','g_picnic',()=>s.age>=16&&s.age<=40&&RF2_ALL().filter(k=>BF_KEYS.slice(0,5).includes(k)).length>=3,async()=>{const ks=RF2_ALL().filter(k=>BF_KEYS.slice(0,5).includes(k)).slice(0,4);
  await bfScene('뱅센 숲의 일요일','un dimanche à Vincennes',`일요일, ${bfListW(ks)} 뱅센 숲으로 소풍을 갔다. ${ks.includes('louise')?`${bI('louise')} 빵과 치즈를 싸 왔고, `:''}${ks.includes('antoine')?`${bU('antoine')} 포도주를 “원가에” 가져왔고, `:''}${ks.includes('gabriel')?`${bU('gabriel')} 풀밭에 앉기를 거부했다. `:''}해가 기울자 누군가 “우리 늙어서도 여기 오자.”라고 말했다.`,[
   {l:'“약속이야.”라고 말한다',a:'social',f:()=>{say(`누군가 “약속이야.” 하고 따라 말했고, 모두가 따라 말했다. 해 지는 뱅센 숲길을 돌아오며 다들 말이 없었다. 그 약속을 다 지킬 수는 없으리라는 걸 다들 조금씩 알고 있었다.`);bfMem('m_g_picnic',ks,`일요일에 뱅센 숲에서 ${bfListW(ks)} 소풍을 갔다. 늙어서도 여기 오자고 약속했다.`,{tone:'기쁨',place:'뱅센 숲',their:'그날의 약속을 지킨 사람은 많지 않았다. 그래도 그날은 있었다.'});bfAsk('q_g_picnic','group','뱅센 숲의 약속을 지킬 수 있을까?');ks.forEach(k=>bfRel(k,{close:4}))}},
   {l:'말없이 풀밭에 눕는다',a:'safe',f:()=>{say(`당신은 풀밭에 누워 구름이 흘러가는 것을 보았다. 옆에서 누군가 코를 골기 시작했고, 누군가는 그걸 보고 웃었다. 그 웃음소리를 들으며 당신도 눈을 감았다.`);bfMem('m_g_picnic',ks,`일요일에 뱅센 숲에서 벗들과 소풍을 갔다. 풀밭에 누워 구름을 보았다.`,{tone:'그리움',place:'뱅센 숲'});ks.forEach(k=>bfRel(k,{close:3}))}}])});
