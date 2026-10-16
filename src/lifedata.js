/* ================= 생활사 데이터 =================
   src/data/*.json(학술 자료 근거)을 빌드가 LIFE_DATA·LIFE_SRC로 넣어 준다.
   조건(연도·달·나이·성별·신분·지역·도시·혼인·문해·직업·신앙)이 맞는 생애에만 장면으로 나오고,
   근거는 기록의 ‘자료’ 줄과 출처 링크로 남는다. */
const URBAN_REG=['paris','lyon','bordeaux','marseille','nantes','rouen'];
function dataOk(e){const w=e.wh||{},o=e.who||{};
  if(w.from&&s.year<w.from)return false;if(w.to&&s.year>w.to)return false;
  if(w.months){const span=tickMonths();let hit=false;for(let k=0;k<span;k++){const m=((s.month-k)%12+12)%12+1;if(w.months.includes(m))hit=true}if(!hit)return false}
  const age=o.age||[12,120];if(s.age<age[0]||s.age>age[1])return false;
  if(o.sex&&o.sex!==s.sex)return false;
  if(o.estate&&!o.estate.includes(s.estate))return false;
  if(o.region&&!o.region.includes(loc())&&!o.region.includes(s.region))return false;
  if(o.urban!=null&&o.urban!==URBAN_REG.includes(loc()))return false;
  if(o.married!=null&&o.married!==!!(s.spouse&&s.spouse.alive))return false;
  if(o.literate!=null&&o.literate!==lit())return false;
  if(o.job&&!(job()&&o.job.includes(job().tr)))return false;
  if(o.faith&&o.faith!==s.faithKind)return false;
  // 부모: true = 살아 계셔야, false = 돌아가셨어야
  if(o.fa!=null&&o.fa!==!!s.fa.alive)return false;if(o.mo!=null&&o.mo!==!!s.mo.alive)return false;
  if(o.parent!=null&&o.parent!==!!(s.fa.alive||s.mo.alive))return false;
  // 부모를 여읜 뒤의 장면: 그 부모가 최근 2년 안에 실제로 세상을 떠났을 때만 (장면이 부모를 죽이지는 않는다)
  // 배우자를 여읜 뒤(최근 2년), 아기를 잃은 뒤(최근 1년, 두 살 아래)의 장면
  if(o.widow&&!(s.spouse&&!s.spouse.alive&&!s.divorced&&s.spouse.dy>=s.year-2))return false;
  if(o.lostBaby&&!s.kids.some(k=>!k.alive&&k.dy>=s.year-1&&k.dy-k.y<2))return false;
  if(o.school&&!o.school.includes(SCH().st))return false;
  if(e.k)for(const k of e.k)if(s[k].alive||!(s[k].dy>=s.year-2))return false;
  return true}
function dataPool(){if(typeof LIFE_DATA==='undefined')return [];s.cd=s.cd||{};
  return LIFE_DATA.filter(e=>{const k='d:'+e.id;if(e.o&&s.done[k])return false;if(s.cd[k]>s.year)return false;try{return dataOk(e)}catch(x){return false}})}
async function runData(e){const k='d:'+e.id;if(e.o)s.done[k]=1;s.cd[k]=s.year+8;
  say(e.t+fx(e.f||{}));if(e.fa)L(e.fa,'fact',{src:e.s||[]})}
function srcShort(i){const x=LIFE_SRC[i];if(!x)return '';const m=x.c.match(/^([^,(]+?)\s*\((\d{4}[a-z]?)\)/);return m?`${m[1].trim()} (${m[2]})`:x.c.slice(0,40)}
