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

/* ---------- 사망 뒤: 네 줄 유언 ---------- */
function fnWill(){const nm=`${s.given[0]} ${s.sur[0]}`,L0=[];const kids=kidsAlive(),sp=s.spouse&&s.spouse.alive?s.spouse:null;
  if(s.age<14){L0.push(`나는 ${s.age}살이에요.`);L0.push(s.mo&&s.mo.alive?'엄마, 울지 마세요.':s.fa&&s.fa.alive?'아빠, 울지 마세요.':'누군가 내 이름을 기억해 주면 좋겠어요.');
    const f=(typeof BF_KEYS!=='undefined'?BF_KEYS:[]).map(bfR).find(r=>r&&r.alive);L0.push(f?`${bN(f.core)}에게, 내일 강가에 못 가서 미안해.`:'내 구슬은 골목 아이들에게 나눠 주세요.');L0.push(willLine());return L0}
  L0.push(`나 ${jo(nm,'은','는')} ${s.year}년, ${s.age}세에 이 글을 남긴다.`);
  if(kids.length)L0.push(`사랑하는 ${kids.map(k=>k.n).slice(0,3).join(', ')}에게. 서로 의지하며 살고${sp?`, ${jo(sp.n||(isM()?'어머니':'아버지'),'의','의')} 곁을 지켜 다오`:''}.`);
  else if(sp)L0.push(`${sp.n||(isM()?'아내':'남편')}에게, 함께한 날들에 고맙다. 나를 너무 오래 슬퍼하지 마라.`);
  else L0.push('남길 식구가 없으니, 내 몫의 빵은 골목의 가난한 아이들에게 나눠 주기를 바란다.');
  const fr=(typeof BF_KEYS!=='undefined'?BF_KEYS:[]).map(bfR).filter(Boolean);const alive=fr.filter(r=>r.alive).sort((a,b)=>b.close-a.close)[0],gone=fr.filter(r=>!r.alive).sort((a,b)=>b.close-a.close)[0];
  if(alive){const o=(s.bf&&s.bf.obj||[]).find(x=>!x.lost);L0.push(`${bN(alive.core)}에게 ${o?jo(o.t,'을','를'):'내 책 몇 권을'} 남긴다. 퐁뇌프에서의 약속을 잊지 마라.`)}
  else if(gone)L0.push(`먼저 간 ${bN(gone.core)}의 곁에 묻어 다오. 할 이야기가 많다.`);
  else L0.push('장례는 소박하게, 종은 한 번만 울려 다오.');
  let w='';try{w=willLine()}catch(e){}L0.push(w||'신이 허락한 날들에 감사한다. 모두 잘 있거라.');return L0.slice(0,4)}
{const _se=showEnd;showEnd=function(){_se();try{const w=$('#obWill');if(!w||!s)return;w.innerHTML='';fnWill().forEach(t=>w.appendChild(el('span','wl',t)));
  document.querySelectorAll('#end .ob-sec').forEach(x=>x.hidden=true)}catch(e){console.error(e)}}}
