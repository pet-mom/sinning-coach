'use strict';
/* ================= 기본 도구 ================= */
const $=q=>document.querySelector(q);
const R=Math.random, ri=(a,b)=>a+Math.floor(R()*(b-a+1)), pick=a=>a[Math.floor(R()*a.length)], clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const KEY='fr1789_life_v1', LKEY='fr1789_lives_v1';
const SEASON=['봄','여름','가을','겨울'];
const SEASON_FR=['printemps','été','automne','hiver'];
function wpick(list){const t=list.reduce((a,x)=>a+x[1],0);let r=R()*t;for(const x of list){r-=x[1];if(r<=0)return x[0]}return list[list.length-1][0]}
function el(t,c,x){const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
/* 한국어 조사 */
function bat(w){const c=String(w).trim().slice(-1).charCodeAt(0);if(c>=0xAC00&&c<=0xD7A3)return (c-0xAC00)%28;if(/[0-9]$/.test(w))return [1,1,0,1,0,0,1,1,1,0][+String(w).slice(-1)]?1:0;return 0}
function jo(w,a,b){if(a==='으로')return w+(bat(w)&&bat(w)!==8?'으로':'로');return w+(bat(w)?a:b)}
const fmt=n=>Math.round(n).toLocaleString('ko-KR');

/* ================= 신분 · 지역 · 이름 ================= */
// 1789년 무렵 인구 2,800만 중 성직자 약 0.5%, 귀족 약 1.5%, 제3신분 98%. 제3신분 중 농민이 약 4분의 3.
const ESTATES={
  epee:{n:'대귀족',fr:'noblesse d’épée',w:.3,noble:true,d:'대대로 칼을 찬 오랜 귀족 가문. 베르사유 궁정에 출입한다.'},
  robe:{n:'법복귀족',fr:'noblesse de robe',w:.5,noble:true,d:'관직을 사서 귀족이 된 법관 가문. 고등법원에 자리가 있다.'},
  hobereau:{n:'시골 귀족',fr:'hobereau',w:.9,noble:true,d:'작위는 있으나 살림은 넉넉지 않은 지방 영주 집안.'},
  bourgeois:{n:'부르주아',fr:'bourgeoisie',w:8,noble:false,d:'상인·법률가·의사 같은 도시 유산층.'},
  artisan:{n:'도시 서민',fr:'menu peuple',w:14.5,noble:false,d:'장인, 직인, 가게 주인, 날품팔이로 사는 도시 사람들.'},
  peasant:{n:'농민',fr:'paysannerie',w:75.8,noble:false,d:'영주에게 공납을, 교회에 십일조를, 왕에게 타유세를 바치는 농촌 사람들.'}
};
const REGIONS={
  paris:{n:'파리',fr:'Paris',w:2.4,urban:true,d:'왕국의 수도. 인구 60만.'},
  lyon:{n:'리옹',fr:'Lyon',w:.6,urban:true,d:'견직물의 도시.'},
  bordeaux:{n:'보르도',fr:'Bordeaux',w:.4,urban:true,port:true,d:'대서양 무역항. 지롱드의 중심.'},
  marseille:{n:'마르세유',fr:'Marseille',w:.4,urban:true,port:true,d:'지중해 무역항.'},
  nantes:{n:'낭트',fr:'Nantes',w:.3,urban:true,port:true,d:'루아르 강어귀의 무역항.'},
  rouen:{n:'루앙',fr:'Rouen',w:.3,urban:true,d:'노르망디의 직물 도시.'},
  bretagne:{n:'브르타뉴',fr:'Bretagne',w:8,d:'신앙심 깊은 서부의 반도.'},
  vendee:{n:'방데',fr:'Vendée (Bas-Poitou)',w:3,d:'숲과 울타리 밭이 이어진 서부 농촌.'},
  normandie:{n:'노르망디',fr:'Normandie',w:7,d:'곡창과 목초지의 북서부.'},
  picardie:{n:'피카르디',fr:'Picardie',w:6,d:'북부 국경에 가까운 평야.'},
  champagne:{n:'샹파뉴',fr:'Champagne',w:5,d:'동부로 가는 길목.'},
  alsace:{n:'알자스',fr:'Alsace',w:3,d:'독일어를 쓰는 라인강 국경 지방.'},
  bourgogne:{n:'부르고뉴',fr:'Bourgogne',w:6,d:'포도밭의 동부 내륙.'},
  auvergne:{n:'오베르뉴',fr:'Auvergne',w:5,d:'가난한 화산 고원. 젊은이들이 도시로 떠난다.'},
  languedoc:{n:'랑그도크',fr:'Languedoc',w:7,d:'남부. 위그노(신교도) 마을이 남아 있다.'},
  provence:{n:'프로방스',fr:'Provence',w:4,d:'올리브와 포도의 남동부. 툴롱 군항이 있다.'},
  gascogne:{n:'가스코뉴',fr:'Gascogne',w:6,d:'남서부의 구릉 농촌.'},
  ile:{n:'일드프랑스',fr:'Île-de-France',w:5,d:'파리를 둘러싼 곡창 농촌.'}
};
const M_NAMES=[['장','Jean'],['피에르','Pierre'],['자크','Jacques'],['루이','Louis'],['프랑수아','François'],['조제프','Joseph'],['앙투안','Antoine'],['니콜라','Nicolas'],['클로드','Claude'],['샤를','Charles'],['에티엔','Étienne'],['미셸','Michel'],['기욤','Guillaume'],['오노레','Honoré'],['장바티스트','Jean-Baptiste'],['오귀스탱','Augustin'],['카미유','Camille'],['조르주','Georges'],['앙드레','André'],['마티외','Mathieu'],['폴','Paul'],['드니','Denis'],['쥘리앵','Julien'],['가브리엘','Gabriel']];
const F_NAMES=[['마리','Marie'],['잔','Jeanne'],['마르그리트','Marguerite'],['안','Anne'],['카트린','Catherine'],['프랑수아즈','Françoise'],['루이즈','Louise'],['마들렌','Madeleine'],['엘리자베트','Élisabeth'],['주느비에브','Geneviève'],['마리안','Marie-Anne'],['샤를로트','Charlotte'],['테레즈','Thérèse'],['빅투아르','Victoire'],['클로딘','Claudine'],['로즈','Rose'],['소피','Sophie'],['마농','Manon'],['쥐스틴','Justine'],['아델라이드','Adélaïde']];
const SURS=[['마르탱','Martin'],['베르나르','Bernard'],['뒤부아','Dubois'],['뒤랑','Durand'],['르페브르','Lefebvre'],['모로','Moreau'],['로랑','Laurent'],['시몽','Simon'],['가르니에','Garnier'],['포르','Faure'],['루소','Rousseau'],['블랑','Blanc'],['게랭','Guérin'],['루','Roux'],['푸르니에','Fournier'],['지라르','Girard'],['보네','Bonnet'],['메르시에','Mercier'],['랑베르','Lambert'],['퐁텐','Fontaine'],['슈발리에','Chevalier'],['로뱅','Robin'],['마송','Masson'],['피카르','Picard'],['르메르','Lemaire'],['바레','Barrè'],['다비드','David'],['코르디에','Cordier']];
const REG_SURS={bretagne:[['르 고프','Le Goff'],['르 갈','Le Gall'],['케랑부룬','Kerambrun']],alsace:[['뮐러','Muller'],['슈미트','Schmitt'],['메이에르','Meyer']],provence:[['자이유','Jaille'],['베르트랑','Bertrand']],languedoc:[['바르','Barre'],['카즈','Cazes']],vendee:[['고댕','Godin'],['라투르','Latour']]};
const NOBLE_SURS=[['몽테귀','de Montaigu'],['라 로슈','de La Roche'],['빌뇌브','de Villeneuve'],['보몽','de Beaumont'],['생토레르','de Saint-Aulaire'],['샤토브룅','de Châteaubrun'],['로슈포르','de Rochefort'],['로앙빌','de Rohanville'],['라 투르','de La Tour'],['브리삭','de Brissac'],['쿠르셀','de Courcelles'],['발랑스','de Valence']];
const PEOPLE_M=[['뒤퐁','Dupont'],['르루','Leroux'],['바이이','Bailly'],['르클레르','Leclerc'],['고티에','Gautier'],['방상','Vincent'],['카롱','Caron'],['우댕','Houdin']];
function person(){const g=pick(M_NAMES),f=pick(PEOPLE_M.concat(SURS));return g[0]+' '+f[0]}
function woman(){const g=pick(F_NAMES),f=pick(SURS);return g[0]+' '+f[0]}

/* ================= 지표 ================= */
// 핵심 능력치 5개(0~100). 의지(cour)는 신념과 함께 '신념 및 의지'에 속한다.
const STATS=[['hp','건강','CON'],['edu','학식','INT'],['soc','사교','CHA'],['dex','기술','DEX'],['str','체력','STR']];
const FXN={edu:'학식',soc:'사교',hp:'건강',dex:'기술',str:'체력',cour:'의지',money:'재산',fame:'명성',sus:'혐의',pol:'성향',faith:'신앙',inf:'영향력'};
const TRAITS=[
  {k:'열정',s:'의지가 굳고 대의에 몸을 던진다. 혐의도 쉽게 산다'},
  {k:'신중',s:'위험을 피하는 판정에 강하나 출세가 더디다'},
  {k:'경건',s:'해마다 신앙이 깊어진다. 교회를 버리기 어렵다'},
  {k:'계몽',s:'학식이 잘 자라고 새 사상에 끌린다'},
  {k:'야심',s:'승진과 선거에 유리하나 적을 만든다'},
  {k:'쾌활',s:'사람을 잘 사귀어 사교가 오른다. 돈을 헤프게 쓴다'}
];
const GOALS=[
  {k:'부',s:'재산 5만 리브르를 모은다'},
  {k:'명예',s:'레지옹 도뇌르를 받거나 작위를 얻는다'},
  {k:'자유',s:'국민의 대표(의원)가 된다'},
  {k:'신앙',s:'신앙을 지키며 생을 마친다 (신앙 70 이상)'},
  {k:'장수',s:'일흔 다섯을 넘겨 산다'},
  {k:'가문',s:'성인이 된 자녀 넷을 둔다'},
  {k:'학문',s:'아카데미 회원이 되거나 책을 펴낸다'},
  {k:'무공',s:'장군의 반열에 오른다'}
];
const PLANS=[
  {k:'근면',s:'일에 전념한다. 수입 +25%'},
  {k:'학업',s:'학식 +2 (글을 알아야 한다)'},
  {k:'교제',s:'사교 +3, 재산이 든다'},
  {k:'양생',s:'건강 +3'},
  {k:'수련',s:'기술 +2, 주 기술 숙련 +3'},
  {k:'단련',s:'체력 +3, 건강 +1'},
  {k:'신앙',s:'신앙 +3, 공포정치기엔 혐의'},
  {k:'정치',s:'명성 +1, 성향이 짙어진다 (1788년부터)'},
  {k:'절약',s:'생활비 -20%, 사교 -1'}
];
function polLabel0(p){return p<=-60?'절대왕정파':p<=-25?'왕당파':p<=8?'온건파':p<=35?'공화파':p<=65?'자코뱅':'급진 상퀼로트'}

/* ================= 시대 ================= */
// t = 연도 + 계절/4. 봄=3~5월, 여름=6~8월, 가을=9~11월, 겨울=12~2월.
const ERAS=[
  {k:'ancien',a:1750,b:1789.25,n:'구체제',c:'roi',h:'De par le Roi',em:'lis'},
  {k:'constit',a:1789.25,b:1792.5,n:'입헌왕정',c:'or',h:'La Nation, la Loi, le Roi',em:'cocarde'},
  {k:'republic',a:1792.5,b:1794.5,n:'국민공회',c:'rouge',h:'République française, une et indivisible',em:'bonnet'},
  {k:'directory',a:1794.5,b:1799.75,n:'테르미도르·총재정부',c:'gris',h:'République française · Directoire exécutif',em:'cocarde'},
  {k:'consulate',a:1799.75,b:1804.25,n:'통령정부',c:'vert',h:'Bonaparte, Premier Consul de la République',em:'laurel'},
  {k:'empire',a:1804.25,b:1814,n:'제1제국',c:'vert',h:'Napoléon, Empereur des Français',em:'N'},
  {k:'restoration',a:1814,b:1830.5,n:'복고왕정',c:'roi',h:'De par le Roi · Charte constitutionnelle',em:'lis'},
  {k:'july',a:1830.5,b:1848,n:'7월 왕정',c:'or',h:'Louis-Philippe, Roi des Français',em:'cocarde'},
  {k:'republic2',a:1848,b:1852,n:'제2공화국',c:'rouge',h:'République française',em:'bonnet'},
  {k:'empire2',a:1852,b:1900,n:'제2제국',c:'vert',h:'Empire français',em:'N'}
];
function T(){return s.year+(s.month-2)/12}
function era(t=T()){if(t>=1815&&t<1815.25)return ERAS[5];return ERAS.find(e=>t>=e.a&&t<e.b)||ERAS[ERAS.length-1]}
function ruler(t=T()){return t<1774?'루이 15세':t<1792.5?'루이 16세':t<1795.75?'국민공회':t<1799.75?'총재정부':t<1804.25?'제1통령 보나파르트':t<1814?'황제 나폴레옹 1세':t<1815?'루이 18세':t<1815.25?'나폴레옹 (백일천하)':t<1824.5?'루이 18세':t<1830.5?'샤를 10세':t<1848?'루이 필리프':t<1852?'대통령 루이 나폴레옹':'나폴레옹 3세'}
const inTerror=()=>{const t=T();return t>=1793.5&&t<1794.5}
const greatTerror=()=>{const t=T();return t>=1794&&t<1794.5}
const atWar=()=>{const t=T();return (t>=1756&&t<1763)||(t>=1778&&t<1783.5)||(t>=1792.25&&t<1802.25)||(t>=1803.25&&t<1814.25)||(t>=1815&&t<1815.5)}
function repYear(y){return y>=1793&&y<=1805?`공화력 ${['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV'][y-1792]}년`:''}
// 곡물가 지수 (파리 빵값 기준, 평년 1.0). 1770, 1775, 1788~89, 1795, 1812, 1816~17은 흉년·기근.
const PRICE={1752:1.1,1757:1.1,1766:1.15,1767:1.2,1768:1.25,1770:1.45,1771:1.35,1775:1.4,1776:1.1,1784:1.15,1785:1.1,1788:1.4,1789:1.7,1790:1.2,1791:1.1,1792:1.3,1793:1.4,1794:1.5,1795:2.1,1796:1.4,1801:1.2,1802:1.35,1803:1.1,1811:1.2,1812:1.55,1813:1.2,1816:1.6,1817:1.8,1818:1.1,1828:1.15,1829:1.3,1830:1.2,1832:1.15,1839:1.15,1846:1.4,1847:1.65};
const price=y=>PRICE[y]||1;
// 현금 가치 하락률 (아시냐 지폐 붕괴): 1795~96년이 최악.
const INFL={1791:.06,1792:.15,1793:.25,1794:.2,1795:.6,1796:.45};

/* ================= 사망률 ================= */
// 18세기 프랑스 생명표(INED)를 단순화한 연간 사망 확률.
function baseMort(a){return a<1?.21:a<5?.045:a<10?.012:a<20?.006:a<30?.009:a<40?.011:a<50?.014:a<60?.022:a<70?.042:a<80?.09:a<90?.19:a<100?.32:.55}
function deathP(a){let p=baseMort(a);if(!s.hard&&a<10)p*=.35;
  const e=s.estate;p*=e==='epee'||e==='robe'?.72:e==='hobereau'||e==='bourgeois'?.85:e==='peasant'?1.08:1;
  if(REGIONS[s.region].urban)p*=1.12;
  if(s.st.hp<25)p*=2.6;else if(s.st.hp<40)p*=1.5;else if(s.st.hp>=75)p*=.65;
  if(a>=1&&price(s.year)>=1.4&&!rich())p*=1.35;
  if(s.cond==='prison')p*=1.6;if(s.cond==='emigre')p*=1.15;
  return p}
function childP(a){let p=baseMort(a);if(!s.hard&&a<10)p*=.35;return p}
