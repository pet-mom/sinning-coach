// src/ 의 조각들을 하나의 HTML로 묶는다.
//  - docs/index.html : GitHub Pages(docs/ 폴더)에 그대로 올라가는 완전한 HTML 문서
//  - dist/artifact.html : Claude 아티팩트용 조각(doctype·head 없이). 저장소에는 올리지 않는다.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const here=p=>new URL('./'+p,import.meta.url);
const r=f=>readFileSync(here('src/'+f),'utf8');
const js=['core.js','life.js','engine.js','history.js','events.js','ui.js'].map(r).join('\n');
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
console.log('docs/index.html',page.length,'bytes');
