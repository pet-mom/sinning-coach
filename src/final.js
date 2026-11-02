/* ================= 마무리 손질 =================
   프로필: ‘형편과 능력’ 카드를 ‘능력’ 패널로(명성·재산·혐의는 뺀다), 평판·영향력과 같은 초록 패널로 세례증서 바로 아래에. 세례증서의 재능 별을 지운다.
   관계: 관계 상태에 ‘애정’. 편지 보내기는 내용 네 가지 가운데 고른다.
   사건 카드의 그림을 뺀다. 사망 뒤에는 네 줄짜리 유언만 남긴다. */
const FN_STATS=[['hp','건강'],['edu','학식'],['soc','사교'],['dex','기술'],['str','체력'],['cour','의지']];
const fnWord=v=>v>=75?'뛰어나다':v>=55?'좋다':v>=35?'보통':v>=15?'모자라다':'매우 약하다';
{const _rp=renderProfile;renderProfile=function(){_rp();try{const C=$('#profCard');if(!C||!s)return;
  C.querySelectorAll('.pf2-tag i').forEach(x=>x.remove());
  const p=el('section','pf2-panel pf2-rep pf2-cap');p.setAttribute('aria-label','능력');p.innerHTML=pfFlora()+`<h2 class="pf2-ph">능력<small>Capacités</small></h2>`;
  const g=el('div','cap-bars');FN_STATS.forEach(([k,n])=>{const v=s.st[k]||0;const d=el('div','cap-row'+(v<=25?' low':''));d.innerHTML=`<span>${n}</span><s><u style="width:${v}%"></u></s><b>${v}</b>`;g.appendChild(d)});p.appendChild(g);
  const id=C.querySelector('.pf2-id');if(id)id.after(p);else C.prepend(p)}catch(e){console.error(e)}}}
{const _pe=profileExtra;profileExtra=function(H){_pe(H);tdDropCard(H,'형편과 능력')}}

/* ---------- 관계: 애정 · 편지 ---------- */
const fnAff=r=>r.aff??Math.round((r.close||0)*.7+(r.trust||0)*.3);
function fnAffAdd(r,n){r.aff=clamp(fnAff(r)+n,0,100)}
const FN_LETTER=[
 {l:'안부를 묻는다',s:'친밀 +, 애정 +',f:r=>{fnAffAdd(r,2);return `${r.n}에게 안부 편지를 보냈다. 날씨와 빵값과 식구들 이야기를 적었다.`+fx({pen:1})+relFx(r,{close:4,trust:1})}},
 {l:'속마음을 털어놓는다',s:'신뢰 +, 애정 +',f:r=>{fnAffAdd(r,3);return `${r.n}에게 요즘의 걱정을 털어놓는 편지를 썼다. 쓰고 나니 마음이 조금 가벼워졌다.`+fx({pen:1})+relFx(r,{trust:5,close:2})}},
 {l:'함께한 추억을 적는다',s:'애정 ++',f:r=>{fnAffAdd(r,6);let m='';if(r.core&&s.bf){const ms=s.bf.mem.filter(x=>x.k.includes(r.core));if(ms.length){const x=pick(ms);bfWake(x.id);m=` ${x.y}년의 일을 떠올리며 적었다.`}}return `${r.n}에게 어린 날의 일을 적어 보냈다.${m}`+fx({pen:1})+relFx(r,{close:2})}},
 {l:'세상일을 논한다',s:'존경 또는 경쟁심',f:r=>{const near=Math.abs((r.pol||0)-(s.pol||0))<30;fnAffAdd(r,near?1:-2);return `${r.n}에게 시국에 대한 생각을 적어 보냈다. ${near?'생각이 맞닿는 데가 많았다.':'답장에는 날 선 반박이 가득할 것 같았다.'}`+fx({pen:1})+relFx(r,near?{resp:4,close:2}:{riv:4,close:-2})}}];
{const _pp=personPage;personPage=function(r){_pp(r);if(!r)return;try{const pin=$('#pin');
  // 관계 상태에 애정
  const g=pin.querySelector('.pf-stats');if(g&&!g.querySelector('.aff')){const v=fnAff(r);const d=el('div','ps aff');d.innerHTML=`<span>애정</span><s><u style="width:${v}%"></u></s><b>${v}</b>`;g.insertBefore(d,g.children[1]||null)}
  // 편지 내용 고르기
  const b=[...pin.querySelectorAll('button')].find(x=>x.textContent.includes('편지 보내기'));if(!b||b.disabled)return;
  b.onclick=()=>{const box=el('div','letter-ch');box.appendChild(el('div','lab','무엇을 쓸까?'));FN_LETTER.forEach(o=>{const c=el('button','opt row');c.type='button';const sp=el('span');sp.appendChild(el('span','ol',o.l));sp.appendChild(el('small',null,o.s));c.appendChild(sp);
    c.onclick=()=>{s.acts['let_'+(r.fid||r.pid)]=s.year;say(o.f(r));save();personPage(r);render()};box.appendChild(c)});b.replaceWith(box)}}catch(e){console.error(e)}}}

/* ---------- 사망 뒤: 마지막 말 ----------
   삶의 모양(어린아이 · 후회 · 혁명 · 출세와 명예 · 진리 · 신앙 · 평범한 행복)에 따라 고르고, 신분에 따라 말투를 바꾼다.
   귀족: 예스럽고 격식 있는 말투 / 부르주아: 단정한 문어체 / 서민: 입말. */
const FN_LAST={
 child:{alive:{noble:'어머님… 유모를 불러 주세요. 추워요.',bourg:'어머니, 손 잡아 주세요. 촛불 끄지 마세요.',common:'엄마… 엄마 어디 있어? 무서워.'},
   gone:{noble:'어머님이… 저기 문가에 서 계세요. 이제 춥지 않아요.',bourg:'어머니가 저기 계세요. 이제 안 무서워요.',common:'엄마가 저기 있어. 이제 안 무서워.'}},
 regret:{noble:'다른 길을 택할 수 있었을까… 이제는 그 답을 알 길이 없구려.',bourg:'다른 선택을 할 수 있었을까? 이제는 그 답을 알 수 없겠구나.',common:'다르게 살 수도 있었을까? 이젠 알 수가 없네.'},
 rev:{noble:'내가 옳았는지는 역사가 판단하리라. 다만 내가 믿은 바를 저버리지는 않았노라.',bourg:'내가 옳았는지는 역사가 판단하겠지. 다만 내가 믿었던 것을 배반하지는 않았다.',common:'내가 옳았는지는 나중 사람들이 따지겠지. 그래도 내가 믿은 걸 팔아넘기진 않았어.'},
 royal:{noble:'신과 국왕 폐하께 바친 생이었노라. 부끄러움은 없다.',bourg:'왕과 교회를 지키려 했다. 그것을 후회하지 않는다.',common:'임금님 편에 섰던 걸 후회 안 해. 하느님은 아실 거야.'},
 fame:{noble:'후세가 내 이름을 기억하겠지. 그렇지 않소?',bourg:'사람들은 나를 기억할 것이다. 그렇지 않은가?',common:'사람들이 날 기억하겠지? 그렇지?'},
 truth:{noble:'평생 진리를 찾아 헤맸노라. 이제야 내가 알지 못한 것이 얼마나 많았는지 알 것 같구나.',bourg:'나는 평생 진리를 찾아 헤맸다. 이제야 내가 알지 못했던 것들이 얼마나 많았는지 알 것 같다.',common:'평생 뭔가를 알고 싶어 했지. 이제 보니 모르는 게 훨씬 많았어.'},
 faith:{noble:'주여, 제 영혼을 당신 손에 맡기나이다.',bourg:'하느님, 이제 당신께 돌아갑니다. 저를 받아 주소서.',common:'하느님, 이제 가요. 받아 주세요.'},
 happy:{noble:'내게는 넉넉한 세월이 있었소. 사랑하는 이들과 함께였으니, 그것으로 족하오.',bourg:'내게는 충분한 시간이 있었다. 사랑하는 사람들과 함께했으니, 그것으로 충분하다.',common:'살 만큼 살았어. 좋아하는 사람들이랑 같이 있었으니, 그거면 됐지.'},
 plain:{noble:'가문의 이름에 부끄럽지 않게 살았노라. 이제 쉬어도 되겠지.',bourg:'장부는 다 맞췄다. 이제 셈을 끝내도 되겠지.',common:'아, 따뜻하다. 이제 좀 쉬어야겠어.'}};
function fnKind(){if(s.age<14)return 'child';
  const reg=s.bf?s.bf.reg.filter(r=>!r.ease).length:0;if(reg>=2)return 'regret';
  if(s.pol>=45&&(s.party||s.flags.bastille||s.flags.regicide))return 'rev';
  if(s.pol<=-45&&(s.party||noble()))return 'royal';
  if(['부','명예'].includes(s.goal)||s.trait==='야심'||s.fame>=50)return 'fame';
  if(s.goal==='학문'||s.trait==='계몽'||(s.st.edu||0)>=70)return 'truth';
  if(s.goal==='신앙'||s.faith>=80||priest()||nun())return 'faith';
  if((s.spouse&&(s.spouse.alive||s.married))&&kidsAlive().length&&reg===0)return 'happy';
  if(reg===1)return 'regret';
  return kidsAlive().length?'happy':'plain'}
function fnLast(){const st=noble()?'noble':s.estate==='bourgeois'?'bourg':'common';const k=fnKind();
  if(k==='child'){const alive=(s.mo&&s.mo.alive)||(s.fa&&s.fa.alive);return FN_LAST.child[alive?'alive':'gone'][st]}
  return FN_LAST[k][st]}
{const _se=showEnd;showEnd=function(){_se();try{const w=$('#obWill');if(!w||!s)return;w.innerHTML='';w.appendChild(el('span','wl-k','마지막 말'));w.appendChild(el('span','wl',`“${fnLast()}”`));
  document.querySelectorAll('#end .ob-sec').forEach(x=>x.hidden=true)}catch(e){console.error(e)}}}
