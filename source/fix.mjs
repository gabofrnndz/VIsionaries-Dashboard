import fs from 'fs';
const f='../index.html';
fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace(/ type="module" crossorigin/g,' defer').replace(/ crossorigin/g,''));
