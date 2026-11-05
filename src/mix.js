/* ================= 기록 사이에 섞는 짧은 줄글 =================
   한 해 가운데 무작위 달에 신분과 나이에 맞는 일상 한 줄을, 또 다른 달에 가끔 벗의 일상 한 줄을 넣는다(reform2.js의 rfDaily가 부른다). */
function mixClass(){if(!s||s.dead||s.age<1)return;const c=ssClassLines(s.year,s.age,1)[0];if(c)L(c,'story')}
function mixFriend(){try{if(!s||s.dead||s.age<1)return;
  if(s.age>=7&&R()<.6&&typeof BF_KEYS!=='undefined'){const ks=BF_KEYS.filter(k=>bfMet(k)&&bfAlive(k)&&bfR(k).cond==='normal'&&!bfR(k).cut);if(ks.length){const k=pick(ks);const ph=s.age<14?0:s.age<23?1:2;const t=stPick('mix'+k+ph,ST_BF[k][ph].map(x=>typeof x==='function'?x():x));if(t)L(t,'story')}}}catch(e){console.error(e)}}
