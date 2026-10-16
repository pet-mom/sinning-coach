/* ================= 학업 =================
   s.sch = {st, grade, fac, y0, dur, scholar, prizes, pk, school, home, ext, tutor}
   st: none → petite(작은 학교·가정교사) → college(콜레주·중앙학교·리세) / convent(여학생 수녀원·기숙학원) → univ(대학 학부) / seminary(신학교) → done
   pk: 일곱 살에 정한 첫 배움터(tutor 가정교사 · gouv 여자 가정교사 · pension 기숙 학원 · parish 본당 학교 · ursul 우르술라회 통학반 · freres 그리스도교 학교 수사회 · charite 애덕의 딸회 · charity 자선학교)
   school: 열 살에 들어간 콜레주·수녀원 열쇠(COL·CONV 표). home: 집에서 가정교사에게 배운다. ext: 통학생(엑스테른). tutor: 가정교사의 내력.
   grade(성적) 0~100은 해마다 8월 학년말 시험(상장 수여식)으로 오르내린다. 재능(s.talent)·학식(s.st.edu)·그 과목 지식·노력(방침)·건강·운이 정하고, 진학할 수 있는 학부와 첫 직업을 정한다.
   다른 파일의 학교 장면은 inSchool('college') 같은 조건과 addGrade(n)을 쓴다. */
const SCH=()=>s.sch||(s.sch={st:'none',grade:0,fac:null,y0:0,dur:0,scholar:false,prizes:0,pk:null,school:null,home:false,ext:false,tutor:''});
const inSchool=(st)=>{const x=SCH();return st?(Array.isArray(st)?st.includes(x.st):x.st===st):['petite','college','convent','univ','seminary'].includes(x.st)};
const faculty=f=>SCH().st==='univ'&&SCH().fac===f||(f==='theo'&&SCH().st==='seminary');
function addGrade(n){const x=SCH();x.grade=clamp(Math.round(x.grade+n),0,100);return ` (성적 ${n>0?'+':''}${n})`}
function gradeLabel(g=SCH().grade){return g>=85?'우등':g>=70?'상위권':g>=50?'중간':g>=35?'하위권':'낙제권'}
const schHomeT=()=>SCH().home&&SCH().st==='petite'; // 집에서 가정교사에게 배우는 중
// 파리의 콜레주: 시대별 이름 [예수회기(~1762) · 구체제(~1792) · 중앙학교기(1796~1802) · 리세(1802~1815) · 왕립 콜레주(1815~)]. null이면 그 시기에 없다.
const COL={
 llg:['루이르그랑 예수회 콜레주','루이르그랑 콜레주','프리타네 프랑세(옛 루이르그랑)','리세 앵페리알(옛 루이르그랑)','왕립 루이르그랑 콜레주'],
 harcourt:['아르쿠르 콜레주','아르쿠르 콜레주','팡테옹 중앙학교','리세 나폴레옹(옛 생트주느비에브 수도원)',t=>t>=1820.7?'왕립 생루이 콜레주(옛 아르쿠르 자리)':'왕립 앙리 4세 콜레주'],
 plessis:['플레시스 콜레주','플레시스 콜레주','팡테옹 중앙학교','리세 나폴레옹(옛 생트주느비에브 수도원)','왕립 앙리 4세 콜레주'],
 mazarin:['네 나라 콜레주(마자랭)','네 나라 콜레주(마자랭)','네 나라 중앙학교','리세 보나파르트','왕립 부르봉 콜레주'],
 lisieux:['리지외 콜레주','리지외 콜레주','생탕투안 거리 중앙학교','리세 샤를마뉴','왕립 샤를마뉴 콜레주'],
 montaigu:['몽테귀 콜레주','몽테귀 콜레주','생탕투안 거리 중앙학교','리세 샤를마뉴','왕립 샤를마뉴 콜레주'],
 grassins:['그라생 콜레주','그라생 콜레주','팡테옹 중앙학교','리세 나폴레옹(옛 생트주느비에브 수도원)','왕립 앙리 4세 콜레주'],
 juilly:['쥘리 오라토리오회 콜레주','쥘리 오라토리오회 콜레주','쥘리 학원(옛 오라토리오회 신부들이 되산 학교)','쥘리 학원','쥘리 콜레주'],
 stbarbe:['생트바르브 콜레주','생트바르브 콜레주','생트바르브 학원(라노의 기숙학원)','생트바르브 학원','생트바르브 콜레주'],
 stanislas:[null,null,null,'스타니슬라스 학원','스타니슬라스 콜레주'],
 milit:[t=>t>=1753.5?'파리 왕립 사관학교(에콜 밀리테르)':null,t=>t<1787.8?'파리 왕립 사관학교(에콜 밀리테르)':null,null,null,null],
 brienne:[null,t=>t>=1776.2?'브리엔 왕립 사관 예비학교(미님회)':null,null,null,null],
 fleche:['라플레슈 예수회 콜레주',t=>t<1776.2?'라플레슈 왕립 콜레주(사관학교 예비반)':'라플레슈 왕립 콜레주(교리 신부회)',null,t=>t>=1808.4?'라플레슈 군사 프리타네':null,'라플레슈 왕립 군사 프리타네']};
const colEra=t=>t<1762.5?0:t<1792.5?1:t<1796?-1:t<1802.5?2:t<1815.5?3:4;
function collegeName(t=T()){const x=SCH(),e=colEra(t);
  if(e<0)return x.school==='llg'?'평등 콜레주(옛 루이르그랑)':'(학교가 문을 닫아) 가정교사 수업';
  const c=x.school&&COL[x.school];let n=c&&c[e];if(typeof n==='function')n=n(t);if(n)return n;
  return ['예수회 콜레주','콜레주','중앙학교(에콜 상트랄)','리세','왕립 콜레주'][e]}
// 여학교
const CONV={abbaye:'아베오부아 수녀원 기숙학교',pentemont:'팡트몽 수녀원 기숙학교',visit:'성모방문회 수녀원 기숙학교',ursul:'생자크 거리 우르술라회 수녀원 기숙학교',stcyr:'생시르 생루이 왕립학교',
 campan:'생제르맹앙레 캉팡 부인 학교',pensionF:'여자 기숙 학원(팡시오나)',ecouen:'에쿠앙 레지옹 도뇌르 여학교',oiseaux:'우아조 수녀원 기숙학교(노트르담 수녀회)'};
const CONV_REL=new Set(['abbaye','pentemont','visit','ursul','stcyr']);
function convName(t=T()){const k=SCH().school;if(!k)return '수녀원 기숙학교';if(CONV_REL.has(k)&&t>=1792.6&&t<1801)return '(수녀원이 해산되어) 여자 사설 학원';return CONV[k]||'수녀원 기숙학교'}
// 첫 배움터
function petName(t=T()){const x=SCH(),cl=t>=1792.6&&t<1803;
  switch(x.pk){case 'tutor':return '집안 가정교사(아베)';case 'gouv':return '집안 가정교사(구베르낭트)';case 'pension':return '기숙 학원(메트르 드 팡시옹)';
   case 'parish':return t>=1794&&t<1802.5?'구역 초등학교':'본당 작은 학교';case 'ursul':return cl?'여자 사설 학원':'우르술라회 수녀원 통학반';
   case 'freres':return cl?(t>=1794?'구역 초등학교(앵스티튀퇴르)':'(수사회가 해산되어) 동네 글방'):'그리스도교 학교 수사회 무료 학교';
   case 'charite':return cl&&t<1801?'구역 여자 초등학교':'애덕의 딸회 무료 학교';case 'charity':return '본당 자선학교';default:return '작은 학교'}}
const STAGE_N={none:'',petite:'작은 학교',college:'콜레주',convent:'수녀원 기숙학교',univ:'대학',seminary:'신학교',done:'학업 마침'};
const FAC_N={law:'법학부',med:'의학부',theo:'신학부',arts:'인문학부',mil:'사관학교'};
function schoolName(){const x=SCH();return x.st==='petite'?petName():x.st==='college'?collegeName():x.st==='convent'?convName():x.st==='univ'?FAC_N[x.fac]:STAGE_N[x.st]}
function schoolStatus(){const x=SCH();if(!inSchool())return '';return `${schoolName()}${x.st==='college'&&x.ext&&colEra(T())>=0?' 통학생':''} · 성적 ${x.grade} (${gradeLabel()})`}
const wpk=a=>wpick(a.filter(x=>x[1]>0));

/* ---------- 성적의 바탕: 재능 · 학식 · 그 과목 지식 · 노력 · 건강 · 운 ---------- */
function examKey(){const x=SCH(),t=T();if(x.st==='petite')return x.pk==='tutor'?'klat':x.pk==='gouv'?'klett':'pen';
  if(x.st==='college'){if(s.age>=16&&colEra(t)!==2)return 'kphil';const e=colEra(t);return e===2?(R()<.5?'ksci':'khist'):e===3&&R()<.4?'ksci':'klat'}
  if(x.st==='convent')return R()<.6?'klett':'klang';if(x.st==='seminary')return 'ktheo';return x.fac==='med'?'kmed':x.fac==='law'?'klaw':'klat'}
const SUBJ_N={klat:'라틴어',kphil:'철학',ksci:'수학',khist:'역사',klett:'프랑스어 작문',klang:'이탈리아어',ktheo:'신학',kmed:'해부학',klaw:'로마법',pen:'글씨'};
function effort(){return (s.plan==='학업'?12:s.plan==='근면'?4:s.plan==='수련'?2:s.plan==='교제'?-3:0)+(trait('계몽')?5:0)+(trait('신중')?2:0)+(trait('쾌활')?-4:0)+(trait('야심')?2:0)}
// perf: 이번 시험에서 보인 실력. 성적은 이 실력 쪽으로 움직인다.
function examPerf(k){const kn=k?((s.kn&&s.kn[k])||(s.sk&&s.sk[k])||0):0,tal=s.talent||50,ef=effort(),hp=s.st.hp<35?-10:s.st.hp<50?-3:0,gift=k&&s.gift===k?8:0,luck=ri(-15,15);
  return {v:tal*.4+s.st.edu*.3+kn*.3+ef+hp+gift+luck,tal,ef,hp,gift,luck}}
function examWhy(p,d){if(p.hp<=-10)return pick(['병치레로 시험 준비를 제대로 못 했다.','열이 내리지 않은 채 시험장에 앉았다.']);if(p.gift&&d>=0)return '';
  if(p.luck>=11)return pick(['운 좋게 아는 문제만 나왔다.','마침 전날 밤 외운 대목이 나왔다.']);if(p.luck<=-11)return pick(['시험날 머리가 하얘져 아는 것도 틀렸다.','답안에 잉크를 엎질러 반을 다시 썼다.','하필 건너뛴 대목에서 문제가 나왔다.']);
  if(R()<.35)return '';
  if(p.tal>=70&&p.ef<=4)return pick(['타고난 머리가 빛났다. 크게 애쓰지 않고도 앞줄에 섰다.','한 번 읽은 것을 잊지 않는 머리였다.','선생은 게으르지만 영리한 아이라고 적었다.']);if(p.tal>=70)return pick(['타고난 머리에 노력까지 더해졌다.','재능과 끈기를 함께 갖췄다는 평을 들었다.']);
  if(p.tal<45&&p.ef>=10)return d>=0?pick(['머리는 남만 못해도 노력으로 따라붙었다.','밤마다 촛불 아래 외운 것이 빛을 보았다.']):'밤새 외웠지만 머리가 따라 주지 않았다.';
  if(p.tal<40)return pick(['아무리 외워도 머리에 잘 들어오지 않았다.','선생은 성실하지만 이해가 더디다고 적었다.','동사 변화표가 머릿속에서 자꾸 엉켰다.']);if(p.ef<0)return pick(['놀러 다니느라 책을 덜 펼쳤다.','친구들과 어울리느라 숙제를 자주 걸렀다.']);return ''}
function initGrade(k){return clamp(Math.round(15+(s.talent||50)*.45+s.st.edu*.4+(k?((s.kn&&s.kn[k])||0)*.2:0)+ri(-10,10)),8,92)}

/* ---------- 일곱 살: 첫 배움터(엔진의 문해 판정 뒤 호출) ---------- */
function schoolStart7(){const x=SCH();if(!lit()||x.st!=='none')return;const t=T(),E=s.estate,cl=t>=1792.6&&t<1803;
  x.st='petite';x.y0=s.year;x.grade=initGrade();
  if(noble()){x.home=true;
    if(isM()){x.pk='tutor';x.tutor=wpk([['소르본에서 신학 학사를 받은 젊은 아베',t<1790?3:t>=1802?1:0],['예수회가 해산된 뒤 갈 곳을 잃은 옛 예수회 신부',t>=1762.5&&t<1785?3:0],['오라토리오회를 나온 신부',t<1792?1:0],
      ['제네바에서 온 개신교도 가정교사',s.faithKind==='protestant'?6:t>=1760&&t<1790?.4:0],['콜레주가 닫혀 일자리를 잃은 옛 교수',cl?4:0],['망명에서 돌아온 늙은 신부',t>=1800?2:0],['법학을 공부하다 돈이 떨어진 가난한 법학도',E!=='epee'?1:.3]]);
      say(`가정교사(프레셉퇴르)는 ${x.tutor}였다. ${E==='epee'?'저택 3층 방 하나를 얻고 식탁 끝에 앉았다.':E==='robe'?'아버지는 라틴어 문법과 교리, 정확한 글씨를 먼저 가르치라고 하였다.':'삯이 싼 사람이었다. 시골 귀족 살림에 가정교사는 큰 지출이었다.'}`)}
    else{x.pk='gouv';x.tutor=t>=1792.6&&t<1800?'수녀원이 닫혀 갈 곳을 잃은 옛 수녀':pick(['몰락한 귀족 집안의 노처녀','스위스 뇌샤텔 출신 여자 가정교사','과부가 된 장교 부인']);
      say(`가정교사(구베르낭트)는 ${x.tutor}였다. 읽기와 교리, 몸가짐과 바느질을 가르쳤다.`+fx({manner:1}))}
    return}
  if(E==='bourgeois'){if(isM()){x.pk=R()<.55?'pension':'parish';
      say(x.pk==='pension'?`아버지가 ${pick(['생자크 거리','에스트라파드 광장 근처','마레 지구','생빅토르 거리'])}의 기숙 학원(메트르 드 팡시옹)에 보냈다. 원장은 글씨와 셈, 라틴어 첫걸음을 가르쳤다.`+fx({pen:1}):`${t>=1794&&t<1802.5?'구역 초등학교':'본당 작은 학교'}에 다녔다. 아버지는 집에서 따로 셈을 가르쳤다.`+fx({trade:1}))}
    else{x.pk='ursul';say(cl?'수녀원 학교가 닫혀 있어 동네 여자 사설 학원에 다녔다. 원장 부인은 글씨와 바느질, 예법을 가르쳤다.':'우르술라회 수녀원의 통학반에 다녔다. 수녀님들은 읽기와 교리, 바느질과 셈을 가르쳤다.'+fx({faith:1}))}
    return}
  if(isM()){x.pk=(t<1792.6||t>=1803)?(R()<.75?'freres':'charity'):'freres';
    say(x.pk==='charity'?'본당 자선학교(에콜 드 샤리테)에 다녔다. 가난한 집 아이들이라 수업료를 받지 않았다.':cl?(t>=1794?'구역 초등학교에 다녔다. 공화국의 교사(앵스티튀퇴르)가 인권 선언으로 읽기를 가르쳤다.':'수사회가 해산되어 동네 글방에서 읽기를 배웠다. 수업료가 한 달에 몇 수였다.'):'검은 수도복에 흰 띠깃을 단 그리스도교 학교 수사회의 무료 학교에 다녔다. 수업은 프랑스어로 했다.'+fx({faith:1}))}
  else{x.pk='charite';say(t>=1792.6&&t<1801?'구역 여자 초등학교에 다녔다. 여선생은 읽기와 바느질만 가르쳤다.':'애덕의 딸회 수녀들의 무료 학교에 다녔다. 읽기와 교리문답, 실 잣기와 바느질을 배웠다.'+fx({sew:1}))}}

/* ---------- 열 살: 콜레주 · 수녀원 · 장학생 ---------- */
function pickCollege(){const t=T(),e=colEra(t),E=s.estate,x=SCH();
  if(e<0)return null;
  if(E==='hobereau'&&isM()&&e<=1){const m=t<1776.2&&t>=1753.5?'milit':t>=1776.2&&t<1787.8?'brienne':null;if(m&&R()<.65)return m;if(t>=1764&&t<1776.2&&R()<.5)return 'fleche'}
  const tbl=e<=1?(noble()?[['llg',E==='robe'?2:t<1762.5?3:1.5],['harcourt',2],['juilly',E==='epee'?2:1.5],['plessis',E==='robe'?1.5:.8],['mazarin',1]]:[['lisieux',2],['montaigu',x.grade<45?1.5:.6],['grassins',1.2],['harcourt',1],['plessis',1],['mazarin',.8],['stbarbe',.8]])
   :e===2?(noble()?[['juilly',2],['stbarbe',t>=1798?2:0],['harcourt',1],['mazarin',1]]:[['harcourt',2],['lisieux',2],['mazarin',1.5],['stbarbe',t>=1798?1:0]])
   :(noble()?[['llg',2],['harcourt',2],['mazarin',1],['stanislas',t>=1804.7?1.5:0],['juilly',1]]:[['llg',1.5],['harcourt',1.5],['lisieux',1.5],['mazarin',1.5],['stbarbe',1]]);
  return wpk(tbl)}
function enterCollege(o={}){const x=SCH(),t=T(),e=colEra(t);x.st='college';x.y0=s.year;x.home=false;x.school=o.school||pickCollege();
  x.ext=!!o.ext||(e===2&&!['juilly','stbarbe'].includes(x.school))||(s.estate==='bourgeois'&&!o.board&&R()<.55);
  x.grade=Math.round(x.grade*.5+initGrade('klat')*.5);const nm=collegeName();
  const mil=['milit','brienne'].includes(x.school);
  if(e<0)return say(`콜레주들이 문을 닫아 집에서 ${x.tutor||'가정교사'}에게 라틴어와 수학을 계속 배웠다.`+fx({edu:3}));
  if(mil)return say(`${nm}에 들어갔다. 부계 4대 귀족 증명서와 가난 증명서를 내고 왕의 장학생이 되었다. 파란 제복을 입고 북소리에 맞추어 일어났다.`+fx({edu:3,cour:2,vord:2}),'big');
  if(x.ext)return say(`${nm}에 통학생(엑스테른)으로 다니기 시작하였다. ${e===2?'기숙사도 정해진 학년도 없이 강의를 골라 들었다.':'날마다 책가방을 메고 생트주느비에브 언덕길을 올랐다.'}`+fx({edu:4,soc:1}));
  say(`${nm}에 기숙생(팡시오네르)으로 들어가 ${e===2?'수학과 고전어 반':'라틴어 문법반(제6반)'}부터 시작하였다.${noble()&&e<=1&&s.estate==='epee'?' 가정교사가 따라와 학교 안 개인 방(샹브르)을 함께 썼다.':''}`+fx({edu:4,soc:1}))}
function pickConvent(){const t=T(),E=s.estate;
  if(t<1792.6)return wpk(E==='epee'?[['abbaye',2],['pentemont',2],['visit',1]]:E==='robe'?[['visit',2],['ursul',1],['pentemont',1],['abbaye',.8]]:E==='hobereau'?[['ursul',2],['visit',1]]:[['ursul',3],['visit',1]]);
  if(t<1795.5)return null;
  return wpk([['campan',t<1814.3?(noble()?2:.6):0],['ecouen',t>=1807.4&&t<1814.3&&R()<.2?1:0],['oiseaux',t>=1818?1.5:0],['abbaye',t>=1808&&noble()?1:0],['pensionF',noble()?1:3]])}
async function schoolAt10(){const x=SCH();if(x.st!=='petite')return;const t=T(),E=s.estate,tal=s.talent||50;
  if(isM()&&noble()){enterCollege();return}
  if(isM()&&E==='bourgeois'){if(x.grade<40&&R()<.5){say('라틴어는 무리라고 본 아버지가 셈과 장부, 상업 서신을 가르치는 학원에 그대로 두었다.'+fx({trade:2,pen:1}));return}enterCollege();return}
  if(!isM()&&(noble()||E==='bourgeois')){const k=pickConvent();
    if(!k){x.st='done';say('수녀원 학교가 모두 문을 닫아 집에서 어머니와 가정교사에게 배웠다.'+fx({edu:2,sew:1}));return}
    x.st='convent';x.school=k;x.y0=s.year;x.home=false;x.grade=Math.round(x.grade*.6+initGrade('klett')*.4);const nm=convName();
    say(k==='campan'?`${nm}에 들어갔다. 옛 왕비의 시녀였던 원장은 역사·지리·그림·음악·살림까지 가르쳤다.`+fx({edu:4,soc:3,manner:2}):k==='pensionF'?`${nm}에 들어갔다. 글씨와 문법, 피아노와 그림, 바느질을 배웠다.`+fx({edu:3,soc:2,music:1}):`${nm}에 맡겨졌다. 교리와 바느질, 예법과 셈을 배운다.`+fx({edu:3,faith:4,manner:1}));return}
  // 도시 서민: 장학생
  const cl=t>=1792.5&&t<1796,ce=colEra(t);
  if(isM()&&!cl&&x.grade>=65&&R()<(tal>=70?.55:tal>=55?.35:.15)){const where=ce<=1?'루이르그랑 콜레주':ce===2?'중앙학교':'리세';
    sheetOpen('장학생','boursier');shText(`${x.pk==='freres'?'수사 선생':'본당 신부'}가 ${s.fa.alive?'아버지':s.mo.alive?'어머니':'후견인'}를 찾아왔다. ${tal>=70?'이렇게 머리 좋은 아이는 처음 본다며':'성실하고 셈이 빠르다며'} ${ce<=1?'루이르그랑의 장학금 자리(부르스)':ce===2?'수업료 없는 중앙학교':'국가 장학금(부르스 나시오날)'}를 알아보겠다고 한다.`,'q');
    const i=await shButtons([{l:`${where}에 보낸다`,s:'집안 일손을 잃는다',a:'study'},{l:'집안일을 거들게 한다',s:'',a:'safe family'}]);
    if(i===0){enterCollege({school:ce<=1?'llg':ce===2?'harcourt':'llg',ext:ce===2,board:ce!==2});x.scholar=ce!==2;say(`장학생으로 들어갔다. 부잣집 아이들 사이에서 낡은 옷이 눈에 띄었다.`+fx({edu:2,soc:-1}),'big')}else{x.st='done';say('학교를 그만두고 집안일을 거들었다.')}await done();return}
}

/* ---------- 학년말 시험(8월 상장 수여식) — 주사위 없이 재능·학식·노력·건강·운으로 ---------- */
async function schoolExam(){const x=SCH();if(!inSchool())return;
  const k=examKey(),p=examPerf(k),imp=clamp(Math.round(p.v*1.3+5),0,100),d=clamp(Math.round((imp-x.grade)*.35+ri(-1,1)),-9,9);
  addGrade(d);const why=examWhy(p,d),sub=SUBJ_N[k]||FXN[k]||'라틴어';
  const gtxt=p.gift&&d>=0?`${sub}만큼은 따를 아이가 없었다. `:'';
  const ef=fx(Object.assign({edu:d>=3?2:1},k&&KNK.has(k)?{[k]:d>=0?2:1}:{}));
  if(imp>=82&&x.grade>=72&&R()<.45+(p.gift?.2:0)){x.prizes++;say(`${x.st==='univ'?'학위 시험':x.home?'가정교사의 시험':'상장 수여식'}에서 ${p.gift?sub:pick(['라틴어 작문','수사학','라틴어 번역','기하학','철학 논술','교리 문답',sub])} 1등상을 받았다. ${gtxt}${why}`+ef+fx({fame:2,cour:1,rfam:3}),'big');return}
  say(`학년말 시험 — ${gtxt}${why}${why||gtxt?' ':''}성적 ${gradeLabel()}(${x.grade}, ${d>0?'+':''}${d}).`+ef,d<=-5?'ev':'sys')}

// 쉬는 학교 소식과 졸업·진학을 계절마다 확인
// 이번 진행 구간에 그 달(0=1월)이 들어 있는가 — 계절 단위 진행에서도 놓치지 않게
const inMonth=m=>{for(let k=0;k<tickMonths();k++)if(((s.month-k)%12+12)%12===m)return true;return false};
async function schoolTick(){const x=SCH();if(s.dead)return;
  if(inMonth(7)&&inSchool())await schoolExam();
  if(x.st==='petite'&&s.age>=12&&inMonth(8)){x.st='done';x.home=false;
    L(s.estate==='artisan'?(isM()?'학교를 마치고 공방 심부름과 물 길어 오기를 시작하였다.':'학교를 마치고 바느질 일감을 받아 오기 시작하였다.'):x.pk==='gouv'?'가정교사와의 수업을 마쳤다.':'작은 학교를 마쳤다.','sys')}
  if(x.st==='convent'&&s.age>=16&&inMonth(8)){x.st='done';say(`${convName()}를 나와 집으로 돌아왔다.`+fx({soc:2}))}
  if(x.st==='college'&&s.age>=(s.flags.schSkip?16:17)&&inMonth(8)){if(['milit','brienne'].includes(x.school)&&univOpen('mil')&&x.grade>=40){x.st='done';say(`${collegeName()}를 마치고 소위로 임관하였다.`+fx({cour:3,soc:2,arms:2}),'big');takeJob('a3');return}await universityChoice()}
  if((x.st==='univ'||x.st==='seminary')&&inMonth(6)&&s.year-x.y0>=x.dur)await graduate();
}
function univOpen(f){const t=T();if(f==='law')return !(t>=1793.7&&t<1804.2);if(f==='theo')return !(t>=1792.6&&t<1802);if(f==='mil')return (t<1788.7)||(t>=1802.4);if(f==='poly')return t>=1794.9;return true}
async function universityChoice(){const x=SCH(),g=x.grade,ks=(s.kn&&s.kn.ksci)||0;
  const opts=[
   {f:'law',l:'법학부에 진학한다',s:`3년. 학비 600. 성적 50 이상${univOpen('law')?'':' · 1793~1804년 법학부 폐지'}`,ok:g>=50&&s.money>=600&&univOpen('law'),a:'study work'},
   {f:'med',l:'의학부에 진학한다',s:`4년. 학비 900. 성적 60 이상`,ok:g>=60&&s.money>=900,a:'study work'},
   {f:'theo',l:'신학교에 들어간다',s:`스물네 살 사제 서품까지. 성적 45·신앙 40 이상${univOpen('theo')?'':' · 신학교 폐쇄 중'}`,ok:g>=45&&s.faith>=40&&univOpen('theo')&&s.faithKind==='catholic',a:'pious study'},
   {f:'mil',l:'사관학교에 들어간다',s:'귀족(1802년부터는 누구나). 성적 40 이상',ok:g>=40&&univOpen('mil')&&(noble()||T()>=1802.4),a:'bold'},
   {f:'poly',l:'이공과학교(에콜 폴리테크니크) 입학시험을 치른다',s:'1794년 설립. 성적 70·수학 20 이상. 합격은 재능과 수학 실력에 달렸다',ok:univOpen('poly')&&g>=70&&ks>=20&&isM(),hide:!univOpen('poly')||!isM(),a:'study bold'},
   {f:null,l:'학업을 접고 일을 찾는다',s:'',ok:true,a:'safe work'}].filter(o=>!o.hide);
  sheetOpen('진로','après le collège');shText(`${collegeName()}의 ${colEra(T())===2?'과정':'철학반'}을 마쳤다. 성적은 ${g}점(${gradeLabel(g)}). 어느 길로 가겠는가.`,'q');
  const i=await shButtons(opts.map(o=>({l:o.l,s:o.ok?o.s:'조건 부족 · '+o.s,a:o.a,dis:!o.ok})));const o=opts[i];
  if(!o.f){x.st='done';await done();await careerChoice(true);return}
  if(o.f==='poly'){const p=clamp(((s.talent||50)-40)/60*.5+ks/100*.6+(g-70)/100,.08,.9);x.st='done';
    if(R()<p){say(`몽주와 라그랑주의 문제를 풀어 이공과학교에 합격하였다. ${(s.talent||50)>=70?'시험관이 타고난 수학 머리라고 하였다.':'몇 해 동안 밤마다 미분을 붙든 보람이 있었다.'} 두 해를 마치고 포병 소위가 되었다.`+fx({edu:4,ksci:6,cour:2,fame:3}),'big');takeJob('a3');await done();return}
    say('이공과학교 입학시험에서 떨어졌다. 시험관의 칠판 앞에서 적분 문제가 풀리지 않았다.'+fx({ksci:2,cour:-1}));await done();await careerChoice(true);return}
  if(o.f==='mil'){x.st='done';say(`${T()<1789?'파리 사관학교':'생시르 특별사관학교'}에 들어가 2년을 보낸 뒤 소위로 임관하였다.`+fx({cour:4,soc:2}),'big');takeJob('a3');await done();return}
  x.st=o.f==='theo'?'seminary':'univ';x.fac=o.f;x.y0=s.year;x.dur=o.f==='law'?3:o.f==='med'?4:Math.max(5,24-s.age);
  if(o.f==='law'){s.money-=600;const c=inParis()&&R()<.7?'파리':pick(['파리','툴루즈','렌','엑스','디종','푸아티에']);s.flags.schCity=c;say(`${c} 법학부에 등록하였다. 로마법과 교회법, 프랑스 관습법을 배운다.`+fx({edu:3}),'big')}
  if(o.f==='med'){s.money-=900;const c=inParis()&&R()<.7?'파리':pick(['파리','몽펠리에','스트라스부르']);s.flags.schCity=c;say(`${c} 의학부에 등록하였다. 해부학 강의실의 냄새에 처음엔 구역질이 났다.`+fx({edu:3,hp:-1}),'big')}
  if(o.f==='theo'){takeJob('r1',inParis()?'생쉴피스 신학교에 들어가 ':'신학교에 들어가 ');say('검은 수단을 입고 삭발례를 받았다.'+fx({faith:5}))}
  await done()}
async function graduate(){const x=SCH(),g=x.grade;
  if(g<30){x.st='done';say(`${FAC_N[x.fac]||'학교'}에서 끝내 학위를 받지 못하고 나왔다.`+fx({fame:-2}),'big');await careerChoice(true);return}
  if(g<40&&R()<.6){x.y0++;L('학위 시험에 떨어져 한 해를 더 다니게 되었다.','sys');return}
  x.st='done';const top=g>=85;
  if(x.fac==='law'){takeJob('l2',`법학사 학위를 받고 ${s.flags.schCity==='파리'?'파리':pick(['파리','렌','툴루즈','디종'])} 고등법원 변호사 명부에 이름을 올려 `);if(top)say('동기들 가운데 수석이었다.'+fx({fame:5}))}
  else if(x.fac==='med'){if(g>=65){takeJob('m3',`학위 논문을 라틴어로 방어하고 의학 박사가 되어 `)}else takeJob('m2',T()>=1803.2?'보건관(오피시에 드 상테) 자격을 얻어 ':'외과 장인 시험에 붙어 ');if(top)fx({fame:5})}
  else if(x.fac==='theo'){if(s.age<24){x.st='seminary';return}takeJob('r2','주교에게서 사제 서품을 받고 ');if(top){say('신학 박사 학위까지 받았다.'+fx({fame:5,edu:3}))}}
}
