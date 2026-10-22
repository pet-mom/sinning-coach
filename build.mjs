// src/ 의 조각들을 하나의 HTML로 묶는다.
//  - docs/index.html : GitHub Pages(docs/ 폴더)에 그대로 올라가는 완전한 HTML 문서
//  - dist/artifact.html : Claude 아티팩트용 조각(doctype·head 없이). 저장소에는 올리지 않는다.
import {readFileSync,writeFileSync,mkdirSync,readdirSync} from 'node:fs';
const here=p=>new URL('./'+p,import.meta.url);
const r=f=>readFileSync(here('src/'+f),'utf8');
const content=readdirSync(here('src/content')).filter(f=>f.endsWith('.js')).sort().map(f=>'content/'+f);
const art=['art/common.js',...readdirSync(here('src/art')).filter(f=>f.endsWith('.js')&&f!=='common.js').sort().map(f=>'art/'+f)];
// 생활사 데이터: src/data/*.json → LIFE_DATA, LIFE_SRC
const dataDir=here('src/data');const srcIdx=new Map(),LIFE_SRC=[],LIFE_DATA=[];
for(const f of readdirSync(dataDir).filter(f=>f.endsWith('.json')&&f!=='people.json').sort()){for(const e of JSON.parse(readFileSync(new URL('./src/data/'+f,import.meta.url),'utf8'))){
  const s=(e.src||[]).map(x=>{const key=x.url;if(!srcIdx.has(key)){srcIdx.set(key,LIFE_SRC.length);LIFE_SRC.push({c:x.cite,u:x.url,n:0})}const i=srcIdx.get(key);LIFE_SRC[i].n++;return i});
  const d={id:e.id,c:e.cat,t:e.text,fa:e.fact,s,w:e.w??1};if(e.fx)d.f=e.fx;if(e.once)d.o=1;if(e.when)d.wh=e.when;if(e.who)d.who=e.who;if(e.kill)d.k=e.kill;LIFE_DATA.push(d)}}
// 실존 인물: src/data/people.json → PEOPLE (관계는 실존 인물만)
let PEOPLE=[];try{PEOPLE=JSON.parse(readFileSync(new URL('./src/data/people.json',import.meta.url),'utf8')).people||[]}catch(e){}
let IMGC=[];try{IMGC=JSON.parse(readFileSync(new URL('./docs/img/credits.json',import.meta.url),'utf8'))}catch(e){}
const dataJs=`const IMG_CREDITS=${JSON.stringify(IMGC)};\nconst LIFE_DATA=${JSON.stringify(LIFE_DATA)};\nconst LIFE_SRC=${JSON.stringify(LIFE_SRC)};\nconst PEOPLE=${JSON.stringify(PEOPLE)};`;
const js=['core.js'].map(r).concat([dataJs]).concat(['life.js','engine.js','history.js','events.js','stories.js','politics.js','react.js','school.js','attrs.js','health.js','npc.js',...content,'scene.js'].map(r)).concat([r('lifedata.js'),r('ui.js'),r('ui2.js'),r('bonds.js'),r('profile.js'),r('grief.js'),r('story.js'),r('storylong.js'),r('page.js')]).join('\n');
const frag=r('index.template.html').replace('/*@@CSS@@*/',()=>r('style.css')).replace('/*@@JS@@*/',()=>js);
const cut=frag.indexOf('<div id="app">');
const head=frag.slice(0,cut).trim(),body=frag.slice(cut).trim();
const page=`<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="1750년 프랑스에서 태어나 혁명·공포정치·나폴레옹 제국을 지나는 한 사람의 일생을 살아 보는 인생 시뮬레이션">
${head}
</head>
<body>
${body}
</body>
</html>
`;
mkdirSync(here('docs'),{recursive:true});mkdirSync(here('dist'),{recursive:true});
writeFileSync(here('docs/index.html'),page);
writeFileSync(here('docs/.nojekyll'),'');
writeFileSync(here('dist/artifact.html'),frag);
console.log('docs/index.html',page.length,'bytes · 생활사',LIFE_DATA.length,'건 · 출처',LIFE_SRC.length,'개');
