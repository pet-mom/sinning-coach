/* ================= 학업 =================
   s.sch = {st, grade, fac, y0, dur, scholar, prizes}
   st: none → petite(작은 학교) → college(콜레주·중앙학교·리세) / convent(여학생 수녀원 기숙학교) → univ(대학 학부) / seminary(신학교) → done
   grade(성적) 0~100은 해마다 8월 학년말 시험(상장 수여식)으로 오르내리고, 진학할 수 있는 학부와 첫 직업을 정한다.
   다른 파일의 학교 장면은 inSchool('college') 같은 조건과 addGrade(n)을 쓴다. */
const SCH=()=>s.sch||(s.sch={st:'none',grade:0,fac:null,y0:0,dur:0,scholar:false,prizes:0});
const inSchool=(st)=>{const x=SCH();return st?(Array.isArray(st)?st.includes(x.st):x.st===st):['petite','college','convent','univ','seminary'].includes(x.st)};
const faculty=f=>SCH().st==='univ'&&SCH().fac===f||(f==='theo'&&SCH().st==='seminary');
function addGrade(n){const x=SCH();x.grade=clamp(Math.round(x.grade+n),0,100);return ` (성적 ${n>0?'+':''}${n})`}
function gradeLabel(g=SCH().grade){return g>=85?'우등':g>=70?'상위권':g>=50?'중간':g>=35?'하위권':'낙제권'}
function collegeName(t=T()){return t<1762.5?'예수회 콜레주':t<1792.5?'콜레주':t<1796?'(학교가 문을 닫아) 가정교사 수업':t<1802.5?'중앙학교(에콜 상트랄)':'리세'}
const STAGE_N={none:'',petite:'작은 학교',college:'콜레주',convent:'수녀원 기숙학교',univ:'대학',seminary:'신학교',done:'학업 마침'};
const FAC_N={law:'법학부',med:'의학부',theo:'신학부',arts:'인문학부',mil:'사관학교'};
function schoolStatus(){const x=SCH();if(!inSchool())return '';const st=x.st==='college'?collegeName():x.st==='univ'?FAC_N[x.fac]:STAGE_N[x.st];return `${st} · 성적 ${x.grade} (${gradeLabel()})`}

// 일곱 살: 글 배우기(엔진의 문해 판정 뒤 호출)
function schoolStart7(){const x=SCH();if(lit()&&x.st==='none'){x.st='petite';x.grade=clamp(35+s.st.edu+ri(-10,10),10,90);x.y0=s.year}}
// 열 살: 콜레주·수녀원 기숙학교·장학생
async function schoolAt10(){const x=SCH();if(x.st!=='petite')return;
  if(isM()&&(noble()||s.estate==='bourgeois')){x.st='college';x.y0=s.year;say(`${collegeName()}에 들어가 라틴어 문법반부터 시작하였다.`+fx({edu:4,soc:1}));return}
  if(!isM()&&(noble()||s.estate==='bourgeois')){x.st='convent';x.y0=s.year;say(`${noble()?'우르술라회':'성모방문회'} 수녀원 기숙학교에 맡겨졌다. 교리와 바느질, 예법과 셈을 배운다.`+fx({edu:3,faith:4}));return}
  if(isM()&&x.grade>=72&&R()<.4){sheetOpen('장학생','boursier');shText(`본당 신부가 ${s.fa.alive?'아버지':s.mo.alive?'어머니':'후견인'}를 찾아왔다. 머리가 좋은 아이니 ${collegeName()}의 장학금 자리를 알아보겠다고 한다.`,'q');
    const i=await shButtons([{l:'콜레주에 보낸다',s:'집안 일손을 잃는다',a:'study'},{l:'집안일을 거들게 한다',s:'',a:'safe family'}]);
    if(i===0){x.st='college';x.scholar=true;x.y0=s.year;say('장학생으로 콜레주에 들어갔다. 부잣집 아이들 사이에서 낡은 옷이 눈에 띄었다.'+fx({edu:5,soc:-1}),'big')}else{x.st='done';say('학교를 그만두고 집안일을 거들었다.')}await done();return}
}
// 학년말 시험(8월 상장 수여식)
async function schoolExam(){const x=SCH();if(!inSchool())return;
  const {m,why}=md([[s.st.edu>=60,1,'학식'],[trait('계몽'),1,'계몽'],[s.plan==='학업',1,'학업 방침'],[trait('쾌활'),-1,'놀기 좋아함'],[s.st.hp<35,-1,'병약']]);
  const r=await roll(m,{label:'학년말 시험',why});const d={6:8,5:5,4:2,3:0,2:-4,1:-8}[r.v];addGrade(d);fx({edu:r.v>=4?2:1});
  if(r.v===6||(r.v===5&&x.grade>=80)){x.prizes++;say(`${x.st==='univ'?'학위 시험':'상장 수여식'}에서 ${pick(['라틴어 작문','수사학','라틴어 번역','기하학','철학 논술','교리 문답'])} 1등상을 받았다. 상품으로 금박 장정 책을 받았다.`+fx({fame:2,cour:1}),'big')}
  else L(`학년말 시험 결과 ${gradeLabel()}(${x.grade}).`,'sys')}
// 쉬는 학교 소식과 졸업·진학을 계절마다 확인
// 이번 진행 구간에 그 달(0=1월)이 들어 있는가 — 계절 단위 진행에서도 놓치지 않게
const inMonth=m=>{for(let k=0;k<tickMonths();k++)if(((s.month-k)%12+12)%12===m)return true;return false};
async function schoolTick(){const x=SCH();if(s.dead)return;
  if(inMonth(7)&&inSchool())await schoolExam();
  if(x.st==='petite'&&s.age>=12&&inMonth(8)){x.st='done';L('작은 학교를 마쳤다.','sys')}
  if(x.st==='convent'&&s.age>=16&&inMonth(8)){x.st='done';say('수녀원 기숙학교를 나와 집으로 돌아왔다.'+fx({soc:2}))}
  if(x.st==='college'&&s.age>=17&&inMonth(8))await universityChoice();
  if((x.st==='univ'||x.st==='seminary')&&inMonth(6)&&s.year-x.y0>=x.dur)await graduate();
}
function univOpen(f){const t=T();if(f==='law')return !(t>=1793.7&&t<1804.2);if(f==='theo')return !(t>=1792.6&&t<1802);if(f==='mil')return (t<1788.7)||(t>=1802.4);return true}
async function universityChoice(){const x=SCH(),g=x.grade;
  const opts=[
   {f:'law',l:'법학부에 진학한다',s:`3년. 학비 600. 성적 50 이상${univOpen('law')?'':' · 1793~1804년 법학부 폐지'}`,ok:g>=50&&s.money>=600&&univOpen('law'),a:'study work'},
   {f:'med',l:'의학부에 진학한다',s:`4년. 학비 900. 성적 60 이상`,ok:g>=60&&s.money>=900,a:'study work'},
   {f:'theo',l:'신학교에 들어간다',s:`스물네 살 사제 서품까지. 성적 45·신앙 40 이상${univOpen('theo')?'':' · 신학교 폐쇄 중'}`,ok:g>=45&&s.faith>=40&&univOpen('theo')&&s.faithKind==='catholic',a:'pious study'},
   {f:'mil',l:'사관학교에 들어간다',s:'귀족(1802년부터는 누구나). 성적 40 이상',ok:g>=40&&univOpen('mil')&&(noble()||T()>=1802.4),a:'bold'},
   {f:null,l:'학업을 접고 일을 찾는다',s:'',ok:true,a:'safe work'}];
  sheetOpen('진로','après le collège');shText(`${collegeName()}의 철학반을 마쳤다. 성적은 ${g}점(${gradeLabel(g)}). 어느 길로 가겠는가.`,'q');
  const i=await shButtons(opts.map(o=>({l:o.l,s:o.ok?o.s:'조건 부족 · '+o.s,a:o.a,dis:!o.ok})));const o=opts[i];
  if(!o.f){x.st='done';await done();await careerChoice(true);return}
  if(o.f==='mil'){x.st='done';say(`${T()<1789?'파리 사관학교':'생시르 특별사관학교'}에 들어가 2년을 보낸 뒤 소위로 임관하였다.`+fx({cour:4,soc:2}),'big');takeJob('a3');await done();return}
  x.st=o.f==='theo'?'seminary':'univ';x.fac=o.f;x.y0=s.year;x.dur=o.f==='law'?3:o.f==='med'?4:Math.max(5,24-s.age);
  if(o.f==='law'){s.money-=600;const c=pick(['파리','툴루즈','렌','엑스','디종','푸아티에']);s.flags.schCity=c;say(`${c} 법학부에 등록하였다. 로마법과 교회법, 프랑스 관습법을 배운다.`+fx({edu:3}),'big')}
  if(o.f==='med'){s.money-=900;const c=pick(['파리','몽펠리에','스트라스부르']);s.flags.schCity=c;say(`${c} 의학부에 등록하였다. 해부학 강의실의 냄새에 처음엔 구역질이 났다.`+fx({edu:3,hp:-1}),'big')}
  if(o.f==='theo'){takeJob('r1','신학교에 들어가 ');say('검은 수단을 입고 삭발례를 받았다.'+fx({faith:5}))}
  await done()}
async function graduate(){const x=SCH(),g=x.grade;
  if(g<30){x.st='done';say(`${FAC_N[x.fac]||'학교'}에서 끝내 학위를 받지 못하고 나왔다.`+fx({fame:-2}),'big');await careerChoice(true);return}
  if(g<40&&R()<.6){x.y0++;L('학위 시험에 떨어져 한 해를 더 다니게 되었다.','sys');return}
  x.st='done';const top=g>=85;
  if(x.fac==='law'){takeJob('l2',`법학사 학위를 받고 ${pick(['파리','렌','툴루즈','디종'])} 고등법원 변호사 명부에 이름을 올려 `);if(top)say('동기들 가운데 수석이었다.'+fx({fame:5}))}
  else if(x.fac==='med'){if(g>=65){takeJob('m3',`학위 논문을 라틴어로 방어하고 의학 박사가 되어 `)}else takeJob('m2',T()>=1803.2?'보건관(오피시에 드 상테) 자격을 얻어 ':'외과 장인 시험에 붙어 ');if(top)fx({fame:5})}
  else if(x.fac==='theo'){if(s.age<24){x.st='seminary';return}takeJob('r2','주교에게서 사제 서품을 받고 ');if(top){say('신학 박사 학위까지 받았다.'+fx({fame:5,edu:3}))}}
}
