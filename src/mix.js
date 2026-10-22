/* ================= 기록 사이에 섞는 짧은 줄글 =================
   해가 바뀔 때마다 신분과 나이에 맞는 일상 한 줄을 기록에 넣는다. 학교에 들어간 뒤에는 가끔 벗의 일상 한 줄을 더한다. */
{const _ny=newYear;newYear=function(){_ny();try{if(!s||s.dead||s.age<1)return;
  const c=ssClassLines(s.year,s.age,1)[0];if(c)L(c,'story');
  if(s.age>=7&&R()<.45&&typeof BF_KEYS!=='undefined'){const ks=BF_KEYS.filter(k=>bfMet(k)&&bfAlive(k)&&bfR(k).cond==='normal');if(ks.length){const k=pick(ks);const ph=s.age<14?0:s.age<23?1:2;const t=stPick('mix'+k+ph,ST_BF[k][ph].map(x=>typeof x==='function'?x():x));if(t)L(t,'story')}}}catch(e){console.error(e)}}}
