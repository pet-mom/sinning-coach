/* ================= 생활사 개편 =================
   근거 자료: Daniel Roche, Le Peuple de Paris (1981) · Arlette Farge, La Vie fragile (1986) · Olwen Hufton, Women and the Limits of Citizenship (1992)
   · Maurice Garden, Lyon et les Lyonnais (1970) · Dominique Godineau, Citoyennes tricoteuses (1988) · Timothy Tackett, The Coming of the Terror (2015)
   · Nina Rattner Gelbart, The King's Midwife (1998) · Lynn Hunt, Politics, Culture, and Class (1984).
   1. 남녀의 길: 여자에게 열린 일(재봉·모자·세탁·하녀·행상·유모·산파·수녀·살롱)과 남자의 일(견습·직인·병사·서기·사제)이 다르다. 1791년까지 길드는 남자의 것이었고,
      투표(능동시민)와 국민방위대는 남자에게만 열렸다. 여자들은 빨래터와 시장에서 소식을 나누고, 1789년 10월 베르사유로 행진했으며, 1793년 혁명공화여성협회를 만들었다.
   2. 신분마다 여섯 길, 길마다 여섯 계단.  3. ‘방침과 사회 활동’→‘생활’.  4. 사건과 고른 선택을 기록에 남긴다.  5. 자료 보기를 없앤다.
   6. 떠난 부모가 기록에 다시 나오지 않는다.  7. 1789~1794년의 큰 사건마다 태도를 고른다.  8. 당파가 일상에 스민다.
   9. 1758년생이면 루이르그랑 콜레주의 로베스피에르와 데물랭이 오랜 벗이 된다.  10. 벗과 정치가 갈리면 설득·비난·절교. */

/* ---------- 1·2. 신분과 성별에 따른 여섯 길 ---------- */
const RF_TRK={
 peasant:{M:['farm','craft','peuple','serv','army','church'],F:['farm','serv','peuple','craft','med','church']},
 artisan:{M:['craft','peuple','art','army','serv','church'],F:['craft','peuple','serv','art','med','church']},
 bourgeois:{M:['craft','law','med','letters','state','church'],F:['craft','letters','med','art','church','state']},
 noble:{M:['army','church','law','letters','state','pol'],F:['church','letters','art']}};
const RF_MINT={bourgeois:{craft:2},noble:{army:3,law:2,letters:2}};
const RF_WHY={
 farm:{M:'남의 밭에서 품을 판다. 추수철 하루 품삯은 15수 안팎이다',F:'밭일과 이삭줍기, 실잣기로 품을 판다'},
 craft:{M:'공방에 들어가 견습·직인·장인의 길을 밟는다. 1791년까지는 길드의 규칙을 따른다',F:'바느질과 모자 만들기. 재봉사에서 의상실 주인까지 오를 수 있다'},
 peuple:{M:'짐을 지고 물을 나른다. 중앙시장과 강가의 일이다',F:'세탁부, 행상, 시장 아낙의 길. 파리 여자 셋 중 하나가 걷던 길이다'},
 serv:{M:'남의 집 제복 하인으로 들어간다. 먹고 자는 것은 해결된다',F:'남의 집 하녀로 들어간다. 파리의 미혼 여자 가운데 가장 흔한 일이다'},
 army:{M:'군에 지원한다. 밥은 굶지 않는다',F:''},
 church:{M:'신학교에 들어간다',F:'수녀원에 들어간다. 지참금은 혼인보다 싸다'},
 med:{M:'의학부에 들어간다',F:'산파 강습을 받는다(뒤 쿠드레 부인의 순회 강습, 1759년부터)'},
 law:{M:'법률사무소 서기로 들어가 법을 익힌다',F:''},
 letters:{M:'가정교사로 시작해 글로 산다',F:'가정교사로 시작한다. 잘 풀리면 살롱을 연다'},
 state:{M:'관청의 사무원이 된다',F:'담배 판매소를 맡는다. 과부와 홀몸 여자에게 주던 자리다'},
 art:{M:'화실이나 극단에 들어간다',F:'무대나 화실에 선다. 여배우와 가수, 세밀화가의 길이다'},
 pol:{M:'시정과 의회의 자리를 노린다(1789년 이후)',F:''}};
function rfEntries(first){const E=noble()?'noble':s.estate,sx=isM()?'M':'F';const trs=(RF_TRK[E]||RF_TRK.artisan)[sx]||[];const o=[];
  for(const tr of trs){let mint=((RF_MINT[E]||{})[tr])||1;if(tr==='craft'&&!isM())mint=Math.max(mint,2);const rows=PL.filter(x=>x[1]===tr&&x[2]>=mint).map(x=>POST[x[0]]).filter(p=>p.ok()&&canSex(p)).sort((a,b)=>a.t-b.t);
    const p=rows.find(p=>meets(p,true));if(!p||p.id===s.job)continue;const why=(RF_WHY[tr]||{})[sx]||'';o.push({id:p.id,why})}
  return o}
entryOptions=function(first){const o=rfEntries(first);if(o.length)return o;const E=s.estate;const add=(id,why)=>{if(POST[id]&&meets(POST[id])&&!o.some(x=>x.id===id))o.push({id,why})};
  (isM()?['c1','f1','a1']:['c1','sv1','pe1b']).forEach(id=>add(id,''));return o};
// 사다리는 여섯 계단까지만 보인다
statusLadder=function(){const j=job();if(!j)return '';const rows=PL.filter(x=>x[1]===j.tr&&x[2]<=6).map(x=>POST[x[0]]).filter(p=>p.ok()&&canSex(p)).sort((a,b)=>a.t-b.t);
  const seen=new Set();return rows.filter(p=>{if(p.id===j.id)return true;if(seen.has(p.t)||p.t===j.t)return false;seen.add(p.t);return true}).map(p=>`<span class="lad${p.id===j.id?' on':p.t<j.t?' past':''}">${pname(p)}</span>`).join('<i>›</i>')};
// 남자의 일, 여자의 일
{const gate=(k,c)=>{const a=ACTS.find(x=>x.k===k);if(a){const c0=a.c;a.c=()=>{try{return c0()&&c()}catch(e){return false}}}};
 gate('garde',()=>isM());gate('vote',()=>isM());gate('train',()=>isM()||noble());gate('study',()=>isM());
 defineAct({k:'lavoir',g:'social',n:'빨래터에서 소문을 듣는다',s:'사교 +1, 이웃 평판 +1. 세상 소식',c:()=>free()&&!isM()&&!noble(),f:()=>say(pick(['센 강가 빨래터에서 방망이를 두드리며 동네 소식을 다 들었다.','빨래터의 아낙들은 신문보다 빠르고 신문보다 정확했다.','빨래터에서 누구네 남편이 술을 마시는지, 빵값이 어디가 싼지 들었다.'])+fx({soc:1,rloc:1}))});
 defineAct({k:'marche',g:'social',n:'시장 여인들과 어울린다',s:'민중 평판 +2. 1789년 이후엔 급진 성향',c:()=>free()&&!isM()&&!noble(),f:()=>say((T()>=1789.5?'레알의 생선 장수 아낙들 틈에서 빵값과 반역자 이야기를 들었다. 10월에 베르사유로 걸어간 여자들이 바로 이들이었다.':'레알의 생선 장수 아낙들 틈에 끼어 흥정과 욕설을 배웠다.')+fx({rpeople:2,soc:1,pol:T()>=1789.5?2:0}))});
 defineAct({k:'femclub',g:'politics',n:'혁명공화여성협회 모임에 나간다',s:'급진 +4, 명성 +1. 1793년 10월 폐쇄',c:()=>free()&&!isM()&&inParis()&&T()>=1793.35&&T()<1793.85,f:()=>say('붉은 모자를 쓴 클레르 라콩브와 폴린 레옹의 협회에서 여자들이 무장할 권리를 외쳤다.'+fx({pol:4,fame:1,sus:2,rpeople:1}))});
 defineAct({k:'salon_f',g:'social',n:'부인들의 응접실에 드나든다',s:'사교 +2, 상류사회 평판 +1',cost:20,c:()=>free()&&!isM()&&(noble()||s.estate==='bourgeois'),f:()=>say(pick(['이웃 부인의 응접실에서 차를 마시며 혼담과 소문을 나누었다.','부인들의 수놓기 모임에서 책 한 권을 돌려 읽었다.'])+fx({money:-20,soc:2,relite:1}))});
 defineAct({k:'cabaret',g:'social',n:'성 밖 선술집에 간다',s:'사교 +2, 민중 평판 +1. 재산 5',cost:5,c:()=>free()&&isM()&&!noble(),f:()=>say(pick(['성문 밖 길게트에서 세금 안 붙은 포도주를 마시고 노래했다.','선술집에서 직인들과 월요일을 보냈다. 성 월요일은 아무도 일하지 않는다.'])+fx({money:-5,soc:2,rpeople:1}))})}

/* ---------- 3·5. 생활 카드 이름 · 자료 보기 끄기 ---------- */
{const _lt=lifeTab;lifeTab=function(H){_lt(H);H.querySelectorAll('section.card .ch h2').forEach(h=>{if(h.textContent.trim()==='방침과 사회 활동')h.textContent='생활'})}}
{const b=$('#dataT');if(b)b.hidden=true;document.body.classList.remove('showdata')}

/* ---------- 4. 사건과 선택을 기록에 ---------- */
{const _Q=Q;Q=async function(title,fr,text,opts){const i=await _Q(title,fr,text,opts);try{const o=opts[i];if(o&&o.l&&!rfNoLog&&typeof rf2Pend!=='undefined')rf2Pend.push({n:s.log.length,mem:s.bf&&s.bf.mem?s.bf.mem.length:0,l:o.l,text:typeof text==='function'?'':String(text||'')})}catch(e){}return i}}

/* ---------- 6. 떠난 사람은 다시 나오지 않는다 ---------- */
const RF_MEMO=/세상을 떠|죽|돌아가|무덤|장례|유산|유품|생전|기억|떠올|그리|기일|고아|잃|남긴|남겨|없는|없이|묘|부고|불러도|대답이 없|물려|빈자리|그날|옛|예전|어린 시절|어릴 적|그때|온기|냄새|들꽃|조문/;
{const _L=L;L=function(t,k='ev',d){try{if(['ev','big','story','dark'].includes(k)&&s&&!(d&&d.choice)){const tx=String(t);
    if(s.fa&&!s.fa.alive&&PAR_RE.fa.test(tx)&&!RF_MEMO.test(tx))return;
    if(s.mo&&!s.mo.alive&&PAR_RE.mo.test(tx)&&!RF_MEMO.test(tx))return;
    if(s.fa&&s.mo&&!s.fa.alive&&!s.mo.alive&&PAR_RE.par.test(tx)&&!RF_MEMO.test(tx))return}}catch(e){}return _L(t,k,d)}}

/* ---------- 7. 1789~1794: 사건에 대한 태도 ---------- */
const RF_ATT=[
 [1789,7,'bastille','7월 14일','le 14 juillet','거리마다 경종이 울리고 총성이 들린다. 바스티유가 떨어졌다는 소리가 골목을 달린다. 당신은 어떻게 하는가?',[
   ['거리로 나가 환호한다','radical',{pol:6,rpeople:3,relite:-2}],['덧문을 닫고 지켜본다','safe',{vord:1}],['폭도들의 짓이라고 개탄한다','royal',{pol:-6,relite:2,rpeople:-3}]]],
 [1789,8,'aug4','8월 4일 밤','la nuit du 4 août','국민의회가 하룻밤 사이에 봉건적 특권을 폐지했다. 영주권, 십일조, 매관매직, 신분의 특권이 모두 사라졌다고 한다.',[
   ['새 세상이 열렸다고 믿는다','radical',{pol:5,veq:2}],['너무 빠르다고 걱정한다','safe',{pol:-2,vord:2}],['가문과 재산의 권리를 빼앗겼다고 분노한다','royal',{pol:-6,relite:2},()=>noble()||rich()]]],
 [1789,10,'october','베르사유로 가는 여인들','les journées d’octobre','10월 5일 아침, 레알의 여인들이 북을 치며 빵을 달라고 외친다. 수천의 여자들이 빗속에 베르사유로 걷기 시작한다.',[
   ['행렬에 끼어 베르사유까지 걷는다','radical bold',{pol:6,rpeople:4,cour:2,fame:1},()=>!isM()&&!noble()],['길가에서 빵과 물을 건넨다','family',{rpeople:2,rloc:1}],['여자들이 할 일이 아니라고 혀를 찬다','royal',{pol:-4,rpeople:-2}],['멀리서 구경만 한다','safe',{}]]],
 [1791,1,'oath','선서 거부 사제','le serment','성직자들이 헌법에 선서해야 한다. 본당 신부가 선서를 거부했다. 주일 미사를 어디서 드릴 것인가?',[
   ['선서한 새 신부의 미사에 간다','radical',{pol:3,faith:-1,rloc:1}],['선서 거부 신부의 몰래 미사를 찾아간다','pious royal',{pol:-4,faith:3,sus:3}],['미사에 가지 않는다','safe',{faith:-2}]],()=>s.faithKind==='catholic'],
 [1791,6,'varennes','바렌의 밤','Varennes','왕 일가가 하인으로 변장해 달아나다 바렌에서 붙잡혀 돌아왔다. 거리는 침묵 속에 왕의 마차를 맞았다.',[
   ['“왕은 우리를 배신했다. 공화국이다.”','radical',{pol:8,fame:1}],['“왕은 납치당한 것이다.”라고 믿기로 한다','royal',{pol:-5}],['모자를 벗지도 쓰지도 않는다','safe',{}]]],
 [1792,8,'aug10','튈르리의 8월 10일','le 10 août','구민들과 연맹병이 튈르리 궁을 습격했다. 스위스 근위대가 학살당하고 왕정이 정지되었다.',[
   ['구민들과 함께 궁으로 달려간다','radical bold',{pol:8,rpeople:3,cour:2,sus:-2},()=>isM()],['부상자를 돌본다','family',{rloc:2,faith:1}],['근위대의 죽음에 치를 떤다','royal',{pol:-6,sus:3}],['문을 걸고 숨는다','safe',{}]]],
 [1792,9,'sept','9월의 감옥','les massacres de Septembre','감옥마다 수감자들이 끌려 나와 죽는다. 거리에서 사람들은 “인민의 정의”라고 말한다. 누군가는 당신에게 묻는다. “그래서 어떻게 생각해?”',[
   ['“배신자들에게 마땅한 일이다.”','radical',{pol:6,sus:-3,vjus:-2}],['“끔찍한 일이다.”라고 말한다','bold',{pol:-3,sus:5,vjus:2}],['아무 대답도 하지 않는다','safe',{sus:1}]]],
 [1793,1,'regicide','혁명 광장','le 21 janvier','1월 21일, 루이 카페가 단두대에 오른다. 광장으로 사람들이 몰려간다.',[
   ['광장에 가서 “공화국 만세”를 외친다','radical',{pol:6,rpeople:2}],['광장에 가서 손수건을 피에 적신다','royal',{pol:-8,faith:2,sus:4}],['집에 머물며 덧문을 닫는다','safe',{}]]],
 [1793,6,'girondin','지롱드의 몰락','le 2 juin','대포를 앞세운 구민들이 국민공회를 포위하고 지롱드파 의원들을 쫓아냈다.',[
   ['산악파가 옳았다고 말한다','radical',{pol:5,sus:-2}],['쫓겨난 의원들을 안타까워한다','safe',{pol:-3,sus:3}],['정치에는 입을 닫는다','safe',{sus:1}]]],
 [1793,9,'terror','혐의자법','la loi des suspects','혐의자법이 공포되었다. 구 혁명위원회가 밤마다 명단을 적는다. 이웃이 이웃을 고발하는 시절이다.',[
   ['위원회에 협조하고 시민증을 받는다','radical',{pol:4,sus:-6,rloc:-2}],['쫓기는 이웃을 집에 숨겨 준다','bold',{sus:8,vjus:3,rloc:2,cour:3}],['고개를 숙이고 조용히 산다','safe',{sus:-1,cour:-1}]]],
 [1794,7,'thermidor','테르미도르','le 9 Thermidor','로베스피에르가 쓰러졌다. 형장에서 춤추는 사람들이 있다. 거리에서는 자코뱅들이 몽둥이에 맞는다.',[
   ['안도의 숨을 쉰다','safe',{sus:-4,pol:-3}],['형장에서 환호한다','royal',{pol:-6,relite:2,rpeople:-1}],['로베스피에르를 애도한다(위험)','radical bold',{pol:5,sus:8,cour:2}]]]];
async function rfAttitude(a,b){if(!s||s.dead||!adult()||!inParis())return;s.att=s.att||{};
  for(const [y,m,id,title,fr,text,opts,cond] of RF_ATT){const mi=y*12+m-1;if(mi<=a||mi>b||s.att[id])continue;if(cond&&!cond())continue;s.att[id]=1;
    const os=opts.filter(o=>!o[3]||o[3]());if(!os.length)continue;
    const i=await Q(title,fr,text,os.map(o=>({l:o[0],s:'',a:o[1]})));const o=os[i];const f=Object.assign({},o[2]);
    const tag=o[1];say((/radical/.test(tag)?'그날 밤 당신은 거리의 노래를 따라 불렀다.':/royal/.test(tag)?'그 말을 아무에게나 하지 않도록 조심해야 했다.':/bold/.test(tag)?'손이 떨렸지만 후회하지는 않았다.':/family/.test(tag)?'작은 일이었지만 누군가는 기억할 것이다.':'세상이 어디로 가는지 당신은 지켜보기만 했다.')+fx(f),'ev');
    // 벗들의 반응: 태도와 성향이 가까우면 가까워지고, 멀면 멀어진다
    try{const rad=/radical/.test(o[1]),roy=/royal/.test(o[1]);for(const k of BF_KEYS){const r=bfR(k);if(!r||!r.alive||r.cut)continue;const fp=r.pol||0;const near=(rad&&fp>=30)||(roy&&fp<=-20)||(!rad&&!roy&&Math.abs(fp)<40);const far=(rad&&fp<=-20)||(roy&&fp>=30);if(near)relFx(r,{close:3,trust:2});else if(far)relFx(r,{close:-4,riv:3})}}catch(e){}
    await done()}}
{const _Q2=Q;Q=async function(){if(s)s.qN=(s.qN||0)+1;return _Q2.apply(this,arguments)}}

/* ---------- 8. 당파가 일상에 스민다 ---------- */
const RF_GRP=f=>['jacobin','cordelier','babeuf','neojacobin','republican','patriote','sdh'].includes(f)?'rad':['royalist','ultra','legitimist','absolutist','devot','clichy'].includes(f)?'roy':'mod';
const RF_PLIFE={
 jacobin:['저녁마다 생토노레 거리의 옛 자코뱅 수도원에 갔다. 회비 12리브르는 아까웠지만, 연단에서 들리는 말은 어디서도 들을 수 없는 것이었다.','모자에 붉은 모표를 꿰매 달았다. 빵집 줄의 사람들이 그 모표를 보고 길을 비켜 주었다.','클럽 통신원이 보내온 지방 소식을 돌려 읽었다. 저녁이 길었다.'],
 cordelier:['코르들리에 클럽의 회비는 한 달에 2수. 당신 같은 사람들로 회의장이 터져 나갔다.','마라의 『인민의 벗』을 돌려 읽었다. 글자를 모르는 이웃에게는 소리 내어 읽어 주었다.'],
 girondin:['롤랑 부인의 살롱에서 브리소의 말을 들었다. 지방의 상인들이 모이는 자리였다.','지롱드파 신문 『파리 연대기』를 구독했다.'],
 feuillant:['푀양 클럽의 회비는 비쌌다. 모이는 사람들의 옷도 비쌌다.','라파예트의 국민방위대 군복을 입은 이웃들과 저녁을 먹었다.'],
 royalist:['흰 모표는 서랍 깊이 넣어 두었다. 일요일 밤 몰래 모여 왕의 건강을 위해 잔을 들었다.','『왕의 벗』 신문을 몰래 돌려 읽었다. 읽고 나면 태웠다.'],
 ultra:['미사가 끝나면 성당 뒤뜰에서 옛 귀족들과 인사를 나누었다. 흰 깃발 아래의 사람들이었다.'],
 legitimist:['샤를 10세의 손자를 위해 조용히 기도했다. 신문은 읽지 않았다.'],
 bonapartist:['황제의 판화를 벽에 걸었다. 승전보가 올 때마다 앵발리드 쪽을 바라보았다.'],
 thermidor:['금빛 청년단이 거리에서 자코뱅을 몽둥이로 쫓는 것을 못 본 척했다. 당신 편이었다.'],
 babeuf:['바뵈프의 『호민관』을 돌려 읽었다. 모임은 늘 지하실이었다.'],
 republican:['공화파 신문 『라 트리뷘』을 읽고 비밀결사의 암호를 외웠다.'],
 doctrinaire:['기조의 강연을 들으러 갔다. 신문 『글로브』를 읽었다.'],
 patriote:['애국파 카페에서 삼부회 소식을 들었다. 모두가 동시에 말했다.']};
function rfPartyYear(){if(!s.party||!FAC[s.party]||child())return;const f=FAC[s.party],g=RF_GRP(f.id),t=T();
  const L0=RF_PLIFE[f.id]||(g==='rad'?['클럽의 저녁 회의에 빠지지 않았다.']:g==='roy'?['같은 편 사람들과 조용히 모였다. 창문은 닫았다.']:['카페에서 같은 편 신문을 읽었다.']);
  L(stPick('plife'+f.id,L0),'story');
  const fxo={};if(g==='rad'){fxo.rpeople=2;fxo.relite=-1;fxo.money=-(f.id==='jacobin'?12:2);if(t>=1793.7&&t<1794.6)fxo.sus=-3;if(t>=1794.6&&t<1799.8)fxo.sus=3}
  else if(g==='roy'){fxo.relite=2;fxo.rpeople=-1;if(t>=1792.6&&t<1794.6)fxo.sus=5;else if(t>=1795&&t<1799.8)fxo.sus=2}
  else{fxo.relite=1;if(t>=1793.5&&t<1794.6&&!RULING(MI()).includes(f.id))fxo.sus=3}
  const r=fx(fxo);if(r)L(`${f.n}의 한 해.`+r,'sys');
  // 벗들도 당신의 당파를 안다
  try{for(const k of BF_KEYS){const r=bfR(k);if(!r||!r.alive||r.cut)continue;const gap=Math.abs((r.pol||0)-f.pol);if(gap>60)relFx(r,{close:-2});else if(gap<20)relFx(r,{close:1})}}catch(e){}}

/* ---------- 9. 1758년생의 오랜 벗: 로베스피에르와 데물랭 ---------- */
Object.assign(BF,{
 robespierre:{sex:()=>'M',name:()=>'막시밀리앙 로베스피에르',estate:()=>'bourgeois',tr:'신중',v:'veq',pol:90,motif:'루소의 『에밀』',
   home:()=>'루이르그랑 콜레주 기숙사',w:()=>'아라스에서 온 루이르그랑의 장학생. 고아나 다름없는 아이',
   inner:{desire:'덕이 다스리는 공화국',fear:'타락과 조롱',shame:'아버지가 가족을 버린 일',bond:'누이 샤를로트',lie:'나는 아무것도 바라지 않는다'},
   sec:{father:['막시밀리앙은 아버지 이야기를 하지 않았다. 어머니는 그가 여섯 살 때 죽었다고만 했다.','그의 아버지는 아내가 죽자 아이들을 버리고 떠났다. 그는 조부모 집에서 자랐다.','그가 그토록 엄격했던 것은, 누구에게도 다시 버림받지 않기 위해서였다.'],
     pigeon:['막시밀리앙은 비둘기를 길렀다. 누이에게 맡겼다가 죽자 며칠을 울었다고 했다.','그는 피를 보지 못했다. 아라스 판사 시절 사형 판결에 서명하고 사직했다.','그런 그가 단두대의 시대를 이끌었다. 그 모순을 그 자신도 알았을 것이다.']}},
 desmoulins:{sex:()=>'M',name:()=>'카미유 데물랭',estate:()=>'bourgeois',tr:'열정',v:'vlib',pol:80,motif:'나뭇잎 모표',
   home:()=>'루이르그랑 콜레주 기숙사',w:()=>'기즈에서 온 장학생. 말을 더듬지만 글은 번개 같은 아이',
   inner:{desire:'펜으로 세상을 뒤집는 것',fear:'잊히는 것',shame:'더듬는 말',bond:'뤼실',lie:'농담이면 다 용서된다'},
   sec:{stutter:['카미유는 말을 더듬었다. 변론을 맡을 수 없어 법복은 옷장에 걸려만 있었다.','그런데 1789년 7월 12일, 팔레루아얄의 탁자 위에서 그는 한 번도 더듬지 않았다.','그는 평생 그날의 자신을 다시 만나려 했다. 펜으로는 되었고 입으로는 되지 않았다.']}}});
const RF_RD=['robespierre','desmoulins'];
ST_BF.robespierre=[['막시밀리앙은 쉬는 시간에도 책을 놓지 않았다. 옷은 낡았지만 늘 단정했고, 누가 놀려도 대꾸하지 않았다.','막시밀리앙은 루소를 읽고 또 읽었다. 그 책을 빌려 달라고 하면 하루만 빌려주고 반드시 되찾아 갔다.'],['막시밀리앙은 장학금을 지키려고 누구보다 일찍 일어나 공부했다. 아라스의 동생들에게 보내는 편지를 쓸 때만 펜이 느려졌다.','막시밀리앙은 한 번도 술에 취하지 않았다. 그래서 다들 그를 조금 무서워했다.'],['막시밀리앙은 뒤플레 목수의 집 2층에 살았다. 창가에서 그는 늘 무언가를 쓰고 있었다.','막시밀리앙의 연설은 길었다. 그러나 끝까지 듣고 나면 반박할 말이 떠오르지 않았다.']];
ST_BF.desmoulins=[['카미유는 더듬거리며 농담을 했고, 농담은 늘 끝까지 들을 만했다.','카미유는 선생님의 가발에 대해 라틴어로 풍자시를 썼다. 손바닥을 맞고도 웃었다.'],['카미유는 변호사 명부에 이름을 올렸지만 변론을 맡지 못했다. 대신 팔레루아얄의 카페에서 하루를 보냈다.','카미유는 돈이 없어도 늘 누군가의 저녁 자리에 끼어 있었다. 사람들이 그를 좋아했다.'],['카미유의 신문은 나오는 족족 팔렸다. 그는 뤼실과 어린 오라스 이야기를 할 때 가장 행복해 보였다.','카미유는 웃으면서 무서운 말을 했고, 무서운 말을 하면서 웃었다.']];
Object.assign(G_CORE_GIFT,{robespierre:['『에밀』 한 구절을 읽어 준다','책 한 구절'],desmoulins:['나뭇잎 하나를 모자에 꽂는다','나뭇잎']});Object.assign(G_CORE_OBJ,{robespierre:null,desmoulins:null});
Object.assign(SL_BF_X,{robespierre:[[],[],[]],desmoulins:[[],[],[]]});
function rfRDon(){return s&&s.by===1758&&inParis()}
beat('robespierre','rb_meet',{when:()=>rfRDon()&&s.age>=11&&bfHere(),until:()=>s.age>=14,run:async()=>{const r=bfMake('robespierre');r.pid='robespierre';r.by=1758;const col=inSchool(['college']);
  await bfScene('아라스에서 온 아이','Louis-le-Grand',col?'루이르그랑 콜레주에 아라스에서 온 장학생이 들어왔다. 열한 살, 낡은 외투, 반듯하게 빗은 머리. 막시밀리앙 로베스피에르라고 했다. 아이들이 그의 시골 억양을 놀리자 그는 대꾸 대신 책을 펼쳤다. 『에밀』이었다.':'라탱 구역 서점 앞에서 낡은 외투의 아이가 진열창의 책을 한참 들여다보고 있었다. 아라스에서 온 루이르그랑 장학생, 막시밀리앙 로베스피에르라고 했다. 책값이 없어 매일 창 너머로 한 쪽씩 읽는다고 했다.',[
   {l:'옆에 앉아 무슨 책이냐고 묻는다',a:'study social',f:()=>{bfMem('m_rb_meet','robespierre','루이르그랑에서 아라스에서 온 막시밀리앙을 만났다. 그는 『에밀』을 읽고 있었다. “사람은 선하게 태어난다.” 그가 처음 한 말이었다.',{obj:'루소의 『에밀』',place:'루이르그랑 콜레주',their:'그 아이는 내 억양을 놀리지 않은 첫 사람이었다. 나는 그것을 잊지 않았다.'});bfRel('robespierre',{close:10,trust:8})}},
   {l:'다른 아이들과 함께 억양을 흉내 낸다',a:'bold',f:()=>{bfMem('m_rb_meet','robespierre','루이르그랑에서 아라스에서 온 막시밀리앙의 억양을 다른 아이들과 함께 흉내 냈다. 그는 고개를 들지 않았다.',{tone:'부끄러움',place:'루이르그랑 콜레주',their:'그 아이도 웃었다. 나는 웃는 얼굴들을 하나씩 기억해 두었다.'});bfRel('robespierre',{close:-4,riv:8})}},
   {l:'모른 척 지나간다',a:'safe',f:()=>{bfMem('m_rb_meet','robespierre','루이르그랑에서 아라스에서 온 막시밀리앙을 보았다. 아무도 그에게 말을 걸지 않았다. 당신도 그랬다.',{tone:'그리움',place:'루이르그랑 콜레주',their:'아무도 말을 걸지 않았다. 나는 그 편이 나았다.'})}}])}});
beat('desmoulins','ds_meet',{when:()=>rfRDon()&&s.age>=13&&bfMet('robespierre')&&bfHere(),until:()=>s.age>=16,run:async()=>{const r=bfMake('desmoulins');r.pid='desmoulins';r.by=1760;
  await bfScene('더듬는 아이','Camille',`기즈에서 온 열한 살 장학생이 막시밀리앙의 옆자리에 앉았다. 카미유 데물랭. 말을 더듬었지만, 선생님의 가발을 두고 쓴 라틴어 풍자시는 반 전체가 외웠다. 손바닥을 맞으면서도 그는 웃었다.`,[
   {l:'풍자시를 베껴 돌린다',a:'bold social',f:()=>{bfMem('m_ds_meet','desmoulins','카미유의 라틴어 풍자시를 베껴 반에 돌렸다. 둘 다 손바닥을 맞았다. 카미유는 맞으면서도 더듬더듬 다음 시를 지었다.',{place:'루이르그랑 콜레주',their:'그 아이가 내 시를 베꼈다. 처음으로 독자가 생긴 날이었다.'});bfRel('desmoulins',{close:10,trust:6})}},
   {l:'더듬는 말을 끝까지 들어 준다',a:'social',f:()=>{bfMem('m_ds_meet','desmoulins','카미유가 더듬으며 말할 때 끝까지 기다려 주었다. 막시밀리앙도 기다렸다. 셋은 그렇게 친구가 되었다.',{place:'루이르그랑 콜레주',their:'그 아이는 내 말을 대신 끝내지 않았다. 그런 사람은 드물었다.'});bfRel('desmoulins',{close:8,trust:8});bfRel('robespierre',{close:3})}},
   {l:'더듬는 말투를 흉내 낸다',a:'bold',f:()=>{bfMem('m_ds_meet','desmoulins','카미유의 더듬는 말투를 흉내 냈다. 그는 웃었다. 막시밀리앙은 웃지 않았다.',{tone:'부끄러움',place:'루이르그랑 콜레주',their:'그 아이가 내 말투를 흉내 냈다. 나는 웃었다. 웃는 게 제일 쉬웠다.'});bfRel('desmoulins',{close:-2});bfRel('robespierre',{close:-3})}}])}});
beat('robespierre','rb_rain',{when:()=>rfRDon()&&bfAlive('robespierre')&&bfW(1775.42,1775.6)&&bfHere(),until:()=>T()>=1775.6,gap:0,run:async()=>{
  await bfScene('빗속의 라틴어 축사','juin 1775','대관식에서 돌아오는 새 왕 루이 16세의 마차가 루이르그랑 앞에 멈췄다. 학교 대표로 뽑힌 막시밀리앙이 빗속에 무릎을 꿇고 라틴어 축사를 읽었다. 왕은 마차 창을 열지 않았고, 축사가 끝나기 전에 마차는 떠났다.',[
   {l:'젖은 그의 어깨를 두드린다',a:'social',f:()=>{bfMem('m_rb_rain','robespierre','1775년 6월, 막시밀리앙이 빗속에서 새 왕에게 라틴어 축사를 읽었다. 왕의 마차는 끝까지 듣지 않고 떠났다. 당신은 젖은 그의 어깨를 두드렸다.',{tone:'씁쓸함',place:'루이르그랑 앞길',their:'왕은 창을 열지 않았다. 나는 그날 비를 오래 기억했다.'});bfRel('robespierre',{close:6,trust:4})}},
   {l:'왕의 마차를 따라 달려간다',a:'royal',f:()=>{bfMem('m_rb_rain','robespierre','1775년 6월, 막시밀리앙이 빗속에서 왕에게 축사를 읽는 동안 당신은 왕의 마차를 따라 달렸다.',{tone:'그리움',place:'루이르그랑 앞길',their:'다들 마차를 따라 달렸다. 나는 빗속에 혼자 서 있었다.'});bfRel('robespierre',{close:-3})}}])}});
beat('robespierre','rb_leave',{when:()=>rfRDon()&&bfAlive('robespierre')&&bfW(1781.5,1782)&&bfHere(),until:()=>T()>=1782,run:async()=>{bfJob('robespierre','아라스의 변호사');bfFate('robespierre','법학을 마치고 아라스로 돌아갔다');
  await bfScene('아라스로','le retour à Arras','막시밀리앙이 법학 학위를 받고 아라스로 돌아간다. 마차 삯을 아끼려 짐은 하나뿐이다. 퐁뇌프에서 그가 말한다. “파리는 나를 바꾸지 못했어. 아라스도 그럴 거야.”',[
   {l:'편지를 하자고 약속한다',a:'social',f:()=>{bfMem('m_rb_leave','robespierre','1781년, 막시밀리앙이 아라스로 돌아갔다. 퐁뇌프에서 편지를 하자고 약속했다. 그의 편지는 늘 길고 글씨는 작았다.',{tone:'그리움',place:'퐁뇌프',their:'그 사람은 편지를 하자고 했다. 나는 지켰다. 그 사람도 한동안은 지켰다.'});bfRel('robespierre',{close:5})}},
   {l:'『에밀』을 선물한다',a:'study',f:()=>{bfMem('m_rb_leave','robespierre','1781년, 아라스로 돌아가는 막시밀리앙에게 『에밀』 새 판을 선물했다. 그는 책을 받고 한참 말이 없었다.',{tone:'기쁨',place:'퐁뇌프',their:'책을 받았다. 평생 가지고 다녔다. 뒤플레의 집 책상 위에도 그 책이 있었다.'});bfRel('robespierre',{close:8,trust:6})}}])}});
beat('desmoulins','ds_leaf',{when:()=>rfRDon()&&bfAlive('desmoulins')&&bfW(1789.52,1789.56)&&bfHere()&&!child(),until:()=>T()>=1789.56,gap:0,run:async()=>{bfJob('desmoulins','팔레루아얄의 연설가');bfFate('desmoulins','7월 12일 팔레루아얄에서 무기를 들자고 외쳤다');
  await bfScene('팔레루아얄의 탁자','le 12 juillet','네케르가 파면되었다. 팔레루아얄의 카페 드 푸아 앞에서 카미유가 탁자 위로 뛰어올랐다. 권총을 쥐고, 나뭇잎을 모자에 꽂고, 한 번도 더듬지 않고 외친다. “시민들이여, 무기를 들라!” 사람들이 마로니에 잎을 따서 모자에 꽂는다.',[
   {l:'나뭇잎을 꽂고 뒤따른다',a:'radical bold',f:()=>{bfBrave();bfKnow('desmoulins','stutter',2);s.pol=clamp(s.pol+6,-100,100);bfMem('m_ds_leaf','desmoulins','1789년 7월 12일, 팔레루아얄의 탁자 위에서 카미유가 한 번도 더듬지 않고 외쳤다. 당신은 나뭇잎을 모자에 꽂고 그를 뒤따랐다.',{tone:'희망',place:'팔레루아얄',their:'탁자 위에서 그 사람의 얼굴을 보았다. 그래서 더듬지 않았는지도 모른다.'});bfObj('leaf','1789년 7월 12일의 마로니에 잎',{from:'desmoulins'});bfRel('desmoulins',{close:10,trust:6})}},
   {l:'군중 뒤에서 지켜본다',a:'safe',f:()=>{bfKnow('desmoulins','stutter',2);bfMem('m_ds_leaf','desmoulins','1789년 7월 12일, 팔레루아얄의 탁자 위에서 카미유가 외쳤다. 당신은 군중 뒤에서 지켜보았다. 그는 한 번도 더듬지 않았다.',{tone:'그리움',place:'팔레루아얄',their:'군중 속에 그 사람이 있었다. 뒤에 있어도 보였다.'})}},
   {l:'위험하다며 끌어내리려 한다',a:'safe',f:()=>{bfMem('m_ds_leaf','desmoulins','1789년 7월 12일, 탁자 위의 카미유를 끌어내리려 했다. 그는 당신의 손을 뿌리쳤다.',{tone:'씁쓸함',place:'팔레루아얄',their:'그 사람이 내 소매를 잡았다. 평생 처음 뿌리친 손이었다.'});bfRel('desmoulins',{close:-4,riv:4})}}])}});
beat('robespierre','rb_duplay',{when:()=>rfRDon()&&bfAlive('robespierre')&&bfW(1792.0,1793.3)&&bfHere()&&!child(),until:()=>T()>=1793.3,run:async()=>{bfJob('robespierre','자코뱅 클럽의 연설가');bfFate('robespierre','생토노레 거리 뒤플레 목수의 집에 묵었다');
  await bfScene('뒤플레의 집','rue Saint-Honoré','생토노레 거리 목수 뒤플레의 집. 막시밀리앙이 2층 방에서 당신을 맞는다. 방에는 침대와 책상, 그리고 그의 초상화뿐이다. 뒤플레의 딸 엘레오노르가 오렌지를 깎는다. “오랜만이야. 아라스 억양은 다 없어졌지?”',[
   {l:'옛날 이야기를 한다',a:'social',f:()=>{bfMem('m_rb_duplay','robespierre','뒤플레의 집 2층에서 막시밀리앙과 오렌지를 먹으며 루이르그랑 시절 이야기를 했다. 그는 그날만은 연설하듯 말하지 않았다.',{tone:'위로',place:'뒤플레의 집',their:'그 사람과 있으면 열한 살로 돌아갔다. 그런 사람이 이제 하나뿐이었다.'});bfRel('robespierre',{close:8,trust:5})}},
   {l:'공포가 너무 멀리 간다고 말한다',a:'bold',f:()=>{bfMem('m_rb_duplay','robespierre','뒤플레의 집에서 막시밀리앙에게 공포가 너무 멀리 간다고 말했다. 그는 오렌지를 내려놓고 오래 당신을 보았다. “덕 없는 공포는 해롭고, 공포 없는 덕은 무력해.”',{tone:'두려움',place:'뒤플레의 집',their:'그 사람이 그 말을 했을 때, 나는 그 사람을 지켜야겠다고 생각했다. 명단에서.'});bfRel('robespierre',{trust:-4,resp:4});bfAsk('q_rb_list','robespierre','막시밀리앙은 당신의 이름을 어느 명단에서 지웠을까?')}},
   {l:'그를 위해 일하겠다고 한다',a:'radical',f:()=>{s.pol=clamp(s.pol+8,-100,100);bfMem('m_rb_duplay','robespierre','뒤플레의 집에서 막시밀리앙을 위해 일하겠다고 했다. 그는 고개를 끄덕였다. “공화국을 위해서지, 나를 위해서가 아니야.”',{tone:'희망',place:'뒤플레의 집',their:'그 사람은 나를 위해 일하겠다고 했다. 나는 공화국이라고 고쳐 말했다. 그래야 했다.'});bfRel('robespierre',{close:6,trust:8});s.sus=clamp((s.sus||0)-5,0,100)}}])}});
beat('desmoulins','ds_vieux',{when:()=>rfRDon()&&bfAlive('desmoulins')&&bfW(1793.93,1794.2)&&bfHere()&&!child(),until:()=>T()>=1794.2,gap:0,run:async()=>{bfJob('desmoulins','『비외 코르들리에』 발행인');bfFate('desmoulins','『비외 코르들리에』에서 관용을 외쳤다');
  await bfScene('비외 코르들리에','le Vieux Cordelier','카미유가 새 신문 『비외 코르들리에』 셋째 호를 들고 왔다. 손이 떨린다. “타키투스를 읽어 봐. 로마도 이랬어. 혐의자들을 풀어 주는 관용위원회를 세우자고 썼어. 막시밀리앙이 화를 낼 거야. 그래도 써야 했어.”',[
   {l:'함께 서명하겠다고 한다',a:'bold',f:()=>{bfBrave();s.sus=clamp((s.sus||0)+8,0,100);bfMem('m_ds_vieux','desmoulins','카미유가 『비외 코르들리에』 셋째 호를 들고 왔다. 함께 서명하겠다고 했다. 그는 당신을 끌어안고 울었다.',{tone:'두려움',place:'당신의 집',their:'그 사람이 서명하겠다고 했다. 나는 그 사람을 말렸어야 했다. 말리지 못했다.'});bfRel('desmoulins',{close:12,trust:10});bfRel('robespierre',{trust:-8})}},
   {l:'막시밀리앙에게 먼저 보이라고 한다',a:'safe',f:()=>{bfMem('m_ds_vieux','desmoulins','카미유에게 『비외 코르들리에』를 막시밀리앙에게 먼저 보이라고 했다. “보였어. 셋째 호는 안 보였어.” 그가 말했다.',{tone:'두려움',place:'당신의 집',their:'그 사람은 막시밀리앙에게 보이라고 했다. 보였다면 그 호는 나오지 못했을 것이다.'})}},
   {l:'신문을 태우라고 한다',a:'safe',f:()=>{bfCare();bfMem('m_ds_vieux','desmoulins','카미유에게 『비외 코르들리에』를 태우라고 했다. 그는 웃었다. “이미 사천 부가 팔렸는걸.”',{tone:'후회',place:'당신의 집',their:'태우라고 했다. 그 사람이 옳았다. 그런데 나는 쓰는 것밖에 할 줄 몰랐다.'});bfReg('r_ds_burn','desmoulins','카미유에게 신문을 태우라고만 했다. 함께 서지 않았다.')}}])}});
beat('desmoulins','ds_death',{when:()=>rfRDon()&&bfAlive('desmoulins')&&T()>=1794.27,until:()=>T()>=1794.45&&!bfAlive('desmoulins'),gap:0,dead:true,run:async()=>{if(!bfAlive('desmoulins'))return;
  bfKnow('desmoulins','stutter',3);bfDie('desmoulins','guillotine','4월 5일, 당통과 함께 단두대에 올랐다. 서른네 살이었다. 수레 위에서 그는 뤼실의 머리카락을 쥐고 있었다. 뤼실은 열하루 뒤 같은 길을 갔다.');
  if(bfAlive('robespierre')){bfRel('robespierre',{close:-15,hate:10});bfRe('m_ds_meet','카미유가 단두대에 오른 날, 루이르그랑의 세 아이를 생각했다. 하나가 하나를 죽였다.','죄책감')}}});
beat('robespierre','rb_death',{when:()=>rfRDon()&&bfAlive('robespierre')&&T()>=1794.57,until:()=>T()>=1794.7&&!bfAlive('robespierre'),gap:0,dead:true,run:async()=>{if(!bfAlive('robespierre'))return;
  bfKnow('robespierre','pigeon',3);bfKnow('robespierre','father',3);bfDie('robespierre','guillotine','7월 28일(테르미도르 10일), 턱이 부서진 채 단두대에 올랐다. 서른여섯 살이었다. 군중은 환호했다. 당신은 환호하지 못했다.');
  if(bfM('m_rb_meet'))bfRe('m_rb_meet','루이르그랑에서 『에밀』을 읽던 아이가 단두대에 올랐다. “사람은 선하게 태어난다.” 그 말이 오래 귀에 남았다.','그리움')}});
{const _st=start;start=function(f,o){const on=f&&o&&+o.year===1758;BF_KEYS.length=0;BF_KEYS.push('louise','etienne','jules','antoine','gabriel');if(on)BF_KEYS.push(...RF_RD);_st(f,o);
  if(!f&&s&&s.by===1758&&!BF_KEYS.includes('robespierre'))BF_KEYS.push(...RF_RD)}}

/* ---------- 10. 벗과 정치가 갈릴 때 ---------- */
const RF_QWIN=()=>T()>=1789.4&&T()<1849;
async function rfQuarrel(){if(!s||s.dead||child()||s.cond!=='normal'||!RF_QWIN())return;s.qr=s.qr||{};
  const ks=BF_KEYS.filter(k=>{const r=bfR(k);return r&&r.alive&&r.cond==='normal'&&!r.cut&&Math.abs((r.pol||0)-s.pol)>=40&&(s.qr[k]||0)+3<=s.year});if(!ks.length||R()>.55)return;
  const k=pick(ks),r=bfR(k),N=bN(k);s.qr[k]=s.year;const him=r.pol>s.pol;
  const topic=typeof rf10Topic==='function'?rf10Topic():(T()<1800?'왕의 재판':'7월 왕정');
  await bfScene(`${N}${jo(N,'과','와').slice(-1)}의 말다툼`,'la querelle',typeof rf10QText==='function'?rf10QText(k,topic,him):`${topic} 이야기가 나왔다. ${bU(k)} ${him?'당신이 너무 미지근하다고':'당신이 너무 멀리 갔다고'} 했다.`,[
   {l:'설득한다',s:'웅변·학식 판정',a:'social',f:async()=>{const {m,why}=md([[(s.sk.orat||0)>=30,1,'웅변'],[(s.st.edu||0)>=55,1,'학식'],[r.trust>=60,1,'오랜 신뢰'],[r.tr==='열정',-1,'불같은 성미']]);const x=await roll(m,{label:`${N} 설득`,why});
     if(x.v>=5){r.pol=Math.round(r.pol+(s.pol-r.pol)*.35);bfRel(k,{close:6,trust:4});bfMem('m_qr_'+k+s.year,k,`${jo(topic,'을','를')} 두고 ${bW(k)} 다투었다. 밤이 깊도록 설득한 끝에 ${bU(k)} “네 말에도 일리가 있어.”라고 했다.`,{tone:'위로',their:'그 사람 말이 맞는 데가 있었다. 인정하기 싫었지만.'});say(`${bU(k)} 끝내 고개를 끄덕였다.`,'big')}
     else{bfRel(k,{close:-4});bfMem('m_qr_'+k+s.year,k,`${jo(topic,'을','를')} 두고 ${bW(k)} 다투었다. 설득하려 했지만 ${bU(k)} 듣지 않았다.`,{tone:'씁쓸함',their:'그 사람은 나를 가르치려 들었다. 어릴 때부터 그랬다.'});say(`${bU(k)} 끝까지 듣지 않았다.`)}}},
   {l:'비난한다',a:'bold',f:()=>{bfRel(k,{close:-10,riv:10,hate:8,trust:-6});bfMem('m_qr_'+k+s.year,k,`${jo(topic,'을','를')} 두고 ${bL(k)} 비난했다. ${him?'“너는 피에 취했어.”':'“너는 겁쟁이야.”'} 그 말은 오래 남았다.`,{tone:'후회',their:him?'그 사람이 나를 피에 취했다고 했다. 그날 밤 나는 잠들지 못했다. 그 말이 맞을까 봐.':'그 사람이 나를 겁쟁이라고 했다. 맞는 말이었다. 그래서 더 아팠다.'});say(`${bU(k)} 자리를 박차고 나갔다.`,'dark')}},
   {l:'절교한다',a:'bold',f:()=>{r.cut=s.year;r.close=Math.min(r.close,5);r.trust=Math.min(r.trust,5);bfRel(k,{hate:20});bfFate(k,'당신과 절교했다');bfReg('r_cut_'+k,k,`${jo(topic,'을','를')} 두고 ${bW(k)} 절교했다.`);
     bfMem('m_qr_'+k+s.year,k,`${jo(topic,'을','를')} 두고 ${bW(k)} 절교했다. “다시는 보지 말자.” 둘 중 누가 먼저 말했는지는 기억나지 않는다.`,{tone:'후회',their:'그날 우리는 서로를 버렸다. 나는 그 사람의 뒷모습을 오래 보았다.'});
     const ms=(s.bf&&s.bf.mem||[]).filter(m=>m.k.includes(k));if(ms.length)bfRe(ms[0].id,`${N}${jo(N,'과','와').slice(-1)} 절교한 날, 이 기억이 가장 아팠다.`,'후회');say(`${bW(k)} 다시 만나지 않았다. 골목에서 마주치면 서로 고개를 돌렸다.`,'dark')}},
   {l:'말을 아낀다',a:'safe',f:()=>{bfRel(k,{close:-1});bfMem('m_qr_'+k+s.year,k,`${jo(topic,'을','를')} 두고 ${bW(k)} 목소리가 높아졌지만, 당신은 말을 아꼈다. 둘은 다른 이야기로 넘어갔다.`,{tone:'그리움',their:'그 사람은 말을 아꼈다. 고마웠다. 그리고 조금 외로웠다.'})}}])}
{const _ny=npcYear;npcYear=async function(){await _ny();if(!s||s.dead)return;try{await rfQuarrel()}catch(e){console.error(e)}}}
