/* ================= 개편 6: 평판이 말이 되어 돌아온다 =================
   평판(가족 · 이웃 · 민중 · 귀족)이 20 이하면 주변 사람이나 모르는 사람에게 비난을, 80 이상이면 찬사를 듣는다.
   한 해에 한두 번, 무작위 달에 인생 기록에 남는다. */
const RF6_WHO={
 rfam:()=>{const o=[];if(s.mo&&s.mo.alive)o.push('어머니');if(s.fa&&s.fa.alive)o.push('아버지');if(s.spouse&&s.spouse.alive)o.push(s.spouse.n||(isM()?'아내':'남편'));(s.kids||[]).filter(k=>k.alive&&s.year-k.y>=12).forEach(k=>o.push(k.n));o.push('사촌 하나','외숙모','큰집 형님');return pick(o)},
 rloc:()=>pick(['이웃 아낙','빵집 주인','건물 수위','물장수','맞은편 집 노파','골목 끝 구둣방 주인','본당 성구지기']),
 rpeople:()=>pick(['장터의 생선 장수','모르는 날품팔이','선술집의 낯선 사내','빨래터 여인들','줄 선 사람 하나','처음 보는 짐꾼']),
 relite:()=>pick(['어느 백작부인','오페라 칸막이석의 귀부인','은행가 부인','살롱 안주인','늙은 후작 부인','궁정에 드나드는 젊은 부인'])};
// 아는 사람이 있으면 가끔 그 사람이 말한다
function rf6Speaker(k){try{const rs=(typeof relsAlive==='function'?relsAlive():[]).filter(r=>!r.core&&r.cond!=='prison');
  if(k!=='rfam'&&k!=='relite'&&rs.length&&R()<.35){const r=pick(rs);return r.n}}catch(e){}return RF6_WHO[k]()}
const RF6_LOW={
 rfam:['{W} 식탁에서 당신 쪽을 보지도 않고 말했다. “집안 망신은 너 하나로 충분해.” 수프가 목에 걸렸다.','명명 축일 잔치에 당신만 부르지 않았다는 것을, {W}의 입을 통해 알았다.','{W} 당신 등 뒤에서 한숨을 쉬었다. “저 애는 대체 누굴 닮았는지.”'],
 rloc:['{W} 당신이 지나가자 들으라는 듯 침을 뱉었다. “저 집 사람이야. 상종 마.”','계단에서 마주친 {W} 길을 비켜 주지 않았다. 등 뒤로 수군거리는 소리가 계단을 따라 내려왔다.','당신 집 문에 누군가 분필로 욕설을 적어 놓았다. {W} 그걸 보고도 지우지 않았다.'],
 rpeople:['{W} 당신을 알아보고 소리쳤다. “저기 저 사람이야! 우리 같은 사람은 사람으로도 안 보는.” 몇 사람이 돌아보았다.','장터에서 {W} 당신에게만 값을 두 배로 불렀다. “당신 같은 사람한텐 이 값이오.”','어디선가 날아온 썩은 사과가 당신 외투에 맞았다. {W} 낄낄 웃었다.'],
 relite:['살롱에서 {W} 부채 뒤로 웃었다. “어머, 저런 사람도 여기 오는군요.” 당신 귀까지 다 들렸다.','{W} 당신의 인사를 못 본 척하고 지나갔다. 그 뒤로 초대장이 한 장도 오지 않았다.','{W} 만찬 자리에서 당신 이름을 꺼내며 웃었다. 그 웃음이 다음 날 온 파리를 돌았다.']};
const RF6_HIGH={
 rfam:['{W} 손님들 앞에서 당신 이야기를 꺼냈다. “우리 집안의 자랑이지요.” 당신은 괜히 창밖만 보았다.','{W} 당신 손을 잡고 오래 놓지 않았다. “네가 있어서 이 집이 버틴다.”','명명 축일에 {W} 당신 자리를 식탁 맨 윗자리에 마련해 두었다.'],
 rloc:['{W} 갓 구운 빵 하나를 당신 손에 쥐여 주었다. “돈은 됐어요. 늘 고마워서.”','골목 아이들이 당신 이름을 부르며 뛰어왔다. {W} 그 모습을 보고 웃으며 말했다. “이 골목의 어른이시지.”','{W} 이웃끼리 다투던 일을 당신에게 판가름해 달라고 들고 왔다. “당신 말이라면 다들 따를 거요.”'],
 rpeople:['장터를 지나는데 {W} 모자를 벗어 인사했다. “당신 같은 사람이 더 있어야 하는데.”','{W} 당신을 알아보고 박수를 쳤다. 그러자 주위 사람들도 따라 쳤다. 당신은 어색하게 모자를 들어 답했다.','선술집에서 누군가 당신을 위해 잔을 들었다. {W}였다. 당신은 그 사람을 처음 보았다.'],
 relite:['{W} 당신을 저녁 만찬의 상석에 앉혔다. “오늘 밤 손님 가운데 가장 이야기를 듣고 싶은 분이에요.”','살롱에서 {W} 당신 말에 부채를 접고 고개를 끄덕였다. 그다음 주, 초대장이 세 장 더 왔다.','{W} 당신을 ‘우리 시대의 {GENT}’라고 불렀다. 그 말이 칭찬인지 놀림인지, 처음에는 알 수 없었다. 칭찬이었다.']};
const RF6_FX={rfam:'rfam',rloc:'rloc',rpeople:'rpeople',relite:'relite'};
function rf6Year(){if(!s||s.dead||child()||s.cond!=='normal'||!s.rep)return;
  const hit=Object.keys(RF6_LOW).filter(k=>{const v=s.rep[k];return v!=null&&(v<=20||v>=80)});if(!hit.length)return;
  const k=pick(hit),v=s.rep[k],low=v<=20;const W=rf6Speaker(k);
  const t=pick((low?RF6_LOW:RF6_HIGH)[k]).replace('{W} ',jo(W,'이','가')+' ').replace('{W}였다',`${W}${bat(W)?'이었다':'였다'}`).replace('{W}의',W+'의').replace('{GENT}',isM()?'신사':'귀부인');
  L(t+(low?fx({hp:-1,cour:-1}):fx({cour:1})),low?'dark':'ev')}
{const _rd=rfDaily;rfDaily=async function(){await _rd();if(!s||s.dead)return;try{if(rfDue('repA'))rf6Year();if(rfDue('repB')&&R()<.5)rf6Year()}catch(e){console.error(e)}}}
