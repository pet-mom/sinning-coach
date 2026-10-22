/* ================= 프로필: 신분증 · 평판 · 영향력 =================
   맨 위: 18세기 신분증(시대에 따라 세례 증서 → 시민증 → 신분증 → 여권). 이름, 생년월일, 현거주지, 종교, 당파, 재능.
   가운데: 짙은 초록 아르누보 패널에 평판 네 갈래(가족 · 이웃·고을 · 민중 · 귀족).
   마지막: 지금의 영향력을 작은 카드에 한 줄로. 능력치·명성·재산·혐의는 아래 ‘형편’ 카드로 옮겼다. */
const PF_CORNER="<svg viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"#B08D45\" stroke-linecap=\"round\"><path d=\"M3 54V16A13 13 0 0 0 16 3H54\" stroke-width=\"1.1\"/><path d=\"M8 44V8H44\" stroke-width=\".6\"/><path d=\"M8 4.5L11.5 8L8 11.5L4.5 8Z\" fill=\"#B08D45\" stroke=\"none\" transform=\"translate(5 5)\"/><circle cx=\"3\" cy=\"57\" r=\"1.2\" fill=\"#B08D45\" stroke=\"none\"/><circle cx=\"57\" cy=\"3\" r=\"1.2\" fill=\"#B08D45\" stroke=\"none\"/></svg>";
const PF_FLORA="<svg viewBox=\"0 0 64 64\" fill=\"none\" stroke=\"#D9BC7A\" stroke-width=\"1\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M62,6C30,6 6,30 6,62\" stroke-width=\"1.1\"/><path d=\"M28.5 16.5Q32.1 19.9 37.4 17.6Q32.8 14.1 28.5 16.5z\" fill=\"#EFE4CB\" fill-opacity=\".5\"/><path d=\"M28.5 16.5L34.7 17.3\" stroke-width=\".6\" stroke-opacity=\".7\"/><path d=\"M16.5 28.5Q14.1 32.8 17.6 37.4Q19.9 32.1 16.5 28.5z\" fill=\"#EFE4CB\" fill-opacity=\".5\"/><path d=\"M16.5 28.5L17.3 34.7\" stroke-width=\".6\" stroke-opacity=\".7\"/><path d=\"M35.8 12Q39.4 9.6 38.6 4.5Q34.6 7.8 35.8 12z\" fill=\"#EFE4CB\" fill-opacity=\".5\"/><path d=\"M35.8 12L37.7 6.8\" stroke-width=\".6\" stroke-opacity=\".7\"/><path d=\"M12 35.8Q7.8 34.6 4.5 38.6Q9.6 39.4 12 35.8z\" fill=\"#EFE4CB\" fill-opacity=\".5\"/><path d=\"M12 35.8L6.8 37.7\" stroke-width=\".6\" stroke-opacity=\".7\"/><path d=\"M43 9Q44.8 12.1 49 11.7Q46.6 8.3 43 9z\" fill=\"#EFE4CB\" fill-opacity=\".5\"/><path d=\"M43 9L47.2 10.9\" stroke-width=\".6\" stroke-opacity=\".7\"/><path d=\"M9 43Q8.3 46.6 11.7 49Q12.1 44.8 9 43z\" fill=\"#EFE4CB\" fill-opacity=\".5\"/><path d=\"M9 43L10.9 47.2\" stroke-width=\".6\" stroke-opacity=\".7\"/><path d=\"M50 7.2Q52.6 6.3 52.9 3.1Q50 4.4 50 7.2z\" fill=\"#EFE4CB\" fill-opacity=\".5\"/><path d=\"M50 7.2L52 4.3\" stroke-width=\".6\" stroke-opacity=\".7\"/><path d=\"M7.2 50Q4.4 50 3.1 52.9Q6.3 52.6 7.2 50z\" fill=\"#EFE4CB\" fill-opacity=\".5\"/><path d=\"M7.2 50L4.3 52\" stroke-width=\".6\" stroke-opacity=\".7\"/></svg>";
const PF_BLOOM="<svg viewBox=\"0 0 150 22\" fill=\"none\" stroke=\"#D9BC7A\" stroke-width=\"1.1\" stroke-linecap=\"round\"><path d=\"M4 12c14-9 26 9 40 0s26-9 31 0\"/><path d=\"M146 12c-14-9-26 9-40 0s-26-9-31 0\"/><path d=\"M75 3c3 3 3 6 0 9-3-3-3-6 0-9zM75 19c3-3 3-6 0-9-3 3-3 6 0 9zM66 11c3-3 6-3 9 0-3 3-6 3-9 0zM84 11c-3-3-6-3-9 0 3 3 6 3 9 0z\" fill=\"#EFE4CB\" fill-opacity=\".7\"/><path d=\"M22 7c4-3 8-2 9 1-4 2-7 2-9-1zM128 7c-4-3-8-2-9 1 4 2 7 2 9-1z\" fill=\"#EFE4CB\" fill-opacity=\".45\"/></svg>";
const PF_REPBG="url(\"data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%20viewBox%3D%270%200%2028%2028%27%20fill%3D%27none%27%20stroke%3D%27%23D9BC7A%27%20stroke-width%3D%271.1%27%20stroke-linecap%3D%27round%27%3E%3Cpath%20d%3D%27M1%2027V9A8%208%200%200%200%209%201H27%27%2F%3E%3Ccircle%20cx%3D%276%27%20cy%3D%276%27%20r%3D%271.4%27%20fill%3D%27%23D9BC7A%27%20stroke%3D%27none%27%2F%3E%3C%2Fsvg%3E\")";
const pfCorners=()=>['tl','tr','bl','br'].map(k=>`<span class="pf2-c c-${k}" aria-hidden="true">${PF_CORNER}</span>`).join('');
const pfFlora=()=>['tl','tr','bl','br'].map(k=>`<span class="pf2-f f-${k}" aria-hidden="true">${PF_FLORA}</span>`).join('');
function pfBirth(){return `${s.by}년 ${(s.bm||0)+1}월 ${s.bd||1}일`}
function pfParty(){if(child())return '어려서 아직 없다';if(s.party&&FAC[s.party])return `${FAC[s.party].n} ${PRANK[s.prank]||''}`.trim();return `무소속 · ${polLabel(s.pol)}`}
function pfInitials(){const g=(s.given[1]||s.given[0]||'').trim(),sr=(s.sur[1]||s.sur[0]||'').trim().split(/\s+/).pop();return ((g[0]||'')+(sr[0]||'')).toUpperCase()}
// 영향력을 한 줄로: 얼마나 넓게(규모)와 무엇 덕분에(원천)
const PF_SRC={'공직·직책':'맡은 직책 덕에','파벌 내 지위':'파벌 안의 자리 덕에','인맥':'아는 사람들 덕에','재산':'돈의 힘으로','대중의 지지':'민중의 지지로','정권과의 관계':'정권과 가까운 덕에','쌓아 온 영향력':'쌓아 온 이름으로'};
function pfInfLine(inf){if(child())return '아직 어린아이다. 영향력은 어른들의 몫이다.';const v=inf.v;
  if(s.cond==='prison')return '감옥 안에서는 어떤 이름도 통하지 않는다.';if(s.cond==='emigre')return '망명지에서는 옛 이름이 <b>추억거리</b>일 뿐이다.';
  const top=inf.b.filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])[0];const src=top?PF_SRC[top[0]]||'':'';
  if(v<5)return '아직 누구도 그대의 이름으로 <b>움직이지 않는다</b>.';
  const sc=v<15?'골목에서는':v<30?`${quartier()}에서는`:v<50?'파리에서는':v<75?'나라 안에서':'나라의 운명을 좌우할 만큼';
  const tail=v<15?'말이 통한다':v<30?'이름이 통한다':v<50?'이름이 오르내린다':v<75?'모르는 사람이 없다':'이름이 무겁다';
  return `${src?src+' ':''}${sc} <b>${tail}</b>.`}
renderProfile=function(){const C=$('#profCard');if(!C||!s)return;C.className='pf2';C.innerHTML='';const [dt,dtf]=docTitle();
  // 1. 신분증
  const id=el('section','pf2-id');id.setAttribute('aria-label',dt);if(typeof hasImg==='function'&&hasImg('title.jpg'))id.style.setProperty('--pf2-bg',`url("${imgSrc('title.jpg')}")`);
  const inn=el('div','pf2-in');inn.innerHTML=pfCorners()+`<div class="pf2-doc">${dtf}<small>${dt} · ${inParis()?'PARIS':REGIONS[loc()].n}</small></div>`;
  const row=el('div','pf2-row');const por=el('div','pf2-por');por.appendChild(figBox({sex:s.sex,age:s.age,estate:s.estate,role:sceneRole(),pol:s.pol}));row.appendChild(por);
  const who=el('div','pf2-who');const fr=[s.given[1],s.sur[1]].filter(Boolean).join(' ');
  who.innerHTML=`<div class="pf2-nm">${s.given[0]} ${s.sur[0]}</div>${fr?`<div class="pf2-fr">${fr}</div>`:''}<dl><dt>생년월일</dt><dd>${pfBirth()} · ${s.age}세</dd><dt>현거주지</dt><dd>${quartier()} · ${homeLabel()}</dd><dt>종교</dt><dd>${faithLabel()}</dd><dt>당파</dt><dd>${pfParty()}</dd></dl>`;row.appendChild(who);inn.appendChild(row);
  const tg=el('div','pf2-tags');const tl=topTalents(3).filter(x=>x[2]>=55);tg.appendChild(el('span','pf2-lab','재능'));
  if(tl.length)tl.forEach(x=>{const t=el('span','pf2-tag');t.innerHTML=`<i>${stars(x[2])}</i>${x[1]}`;tg.appendChild(t)});else tg.appendChild(el('span','pf2-none','아직 드러나지 않았다'));inn.appendChild(tg);
  inn.appendChild(el('div','pf2-seal',pfInitials()));id.appendChild(inn);C.appendChild(id);
  // 2. 평판
  const rp=el('section','pf2-panel pf2-rep');rp.setAttribute('aria-label','평판');rp.innerHTML=pfFlora()+`<h2 class="pf2-ph">평판<small>Réputation</small></h2><div class="pf2-bloom" aria-hidden="true">${PF_BLOOM}</div>`;
  const g=el('div','pf2-rg');[['rfam','가족'],['rloc','이웃·고을'],['rpeople','민중'],['relite','귀족']].forEach(([k,n])=>{const v=s.rep[k]??50;const w=repWord(k);const d=el('div','pf2-ri');d.title=w&&w!=='—'?w:'';d.style.setProperty('--repbg',PF_REPBG);
    d.innerHTML=`<div class="pf2-rk">${n}</div><div class="pf2-rv${v<=35?' low':''}">${v}</div><div class="pf2-rw">${w&&w!=='—'?w:''}</div><div class="pf2-rb"><i style="width:${v}%"></i></div>`;g.appendChild(d)});rp.appendChild(g);C.appendChild(rp);
  // 3. 영향력(한 줄)
  const inf=influence();const ip=el('section','pf2-panel pf2-inf');ip.setAttribute('aria-label','영향력');ip.innerHTML=pfFlora()+`<div class="pf2-ib"><div class="pf2-in-n">${inf.v}</div></div><div><div class="pf2-ik">영향력<small>Influence</small></div><div class="pf2-in-l">${pfInfLine(inf)}</div></div>`;C.appendChild(ip);
  if(s.sus>=30){const w=el('p','pf2-warn',`혐의 ${s.sus} · ${s.sus>=50?'위험하다. 누군가 그대의 이름을 적고 있다.':'주목받고 있다.'}`);C.appendChild(w)}};
// 능력치 · 명성 · 재산 · 혐의는 아래 카드로
{const _pe=profileExtra;profileExtra=function(H){const c=cardIn(H,'형편과 능력','Condition');
  const bd=el('div','pf-badges');bd.innerHTML=[['명성',s.fame,s.fame>=60?'나라 안에 이름이 났다':s.fame>=30?'고장의 유명인':s.fame>=10?'아는 사람만 안다':'이름 없는 사람','fame'],['재산',fmt(s.money),money()+(s.land?` · 지대 ${fmt(s.land)}`:''),'money'],['혐의',s.sus,s.sus>=50?'위험':s.sus>=25?'주목받음':'깨끗함','sus']]
   .map(([n,v,sm,k])=>`<div class="bdg ${k}${k==='sus'&&s.sus>=30?' warn':''}"><span>${n}</span><b>${v}</b><small>${sm}</small></div>`).join('');c.appendChild(bd);
  const st=el('div','pf-stats');st.innerHTML=STATS.map(([k,n,ab])=>`<div class="ps"><span>${n}<i>${ab}</i></span><s><u style="width:${s.st[k]}%;background:${STATC[k]}"></u></s><b>${s.st[k]}</b></div>`).join('');c.appendChild(st);
  c.appendChild(el('p','small mut',`${statusLine()}${s.trait?` · 성품 ${s.trait}`:''}${s.goal?` · 평생의 뜻 ‘${s.goal}’`:''}`));_pe(H)}}
