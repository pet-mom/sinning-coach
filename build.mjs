// src/ 의 조각들을 하나의 index.html로 묶는다.
import {readFileSync,writeFileSync} from 'node:fs';
const r=f=>readFileSync(new URL('./src/'+f,import.meta.url),'utf8');
const js=['core.js','life.js','engine.js','history.js','events.js','ui.js'].map(r).join('\n');
const html=r('index.template.html').replace('/*@@CSS@@*/',()=>r('style.css')).replace('/*@@JS@@*/',()=>js);
writeFileSync(new URL('./index.html',import.meta.url),html);
console.log('index.html',html.length,'bytes');
