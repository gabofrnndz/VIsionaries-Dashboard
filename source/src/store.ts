import {useState,useEffect,useRef} from 'react';
export const VERSION=1, PRE='visionaries:v'+VERSION+':';
export function useLocal<T>(k:string,d:T):[T,(v:T)=>void]{
  const [s,set]=useState<T>(()=>{try{const r=localStorage.getItem(PRE+k);if(!r)return d;const v=JSON.parse(r);return Array.isArray(d)&&!Array.isArray(v)?d:v}catch{return d}});
  const ref=useRef(s);ref.current=s;
  useEffect(()=>{try{localStorage.setItem(PRE+k,JSON.stringify(s));window.dispatchEvent(new CustomEvent('vs',{detail:k}))}catch{}},[k,s]);
  useEffect(()=>{const h=(e:any)=>{if(e.detail!==k)return;try{const r=localStorage.getItem(PRE+k);if(r&&r!==JSON.stringify(ref.current))set(JSON.parse(r))}catch{}};window.addEventListener('vs',h);return()=>window.removeEventListener('vs',h)},[k]);
  return [s,set as any];
}
export const uid=()=>Math.random().toString(36).slice(2,10);
export const exportAll=()=>{const o:any={_version:VERSION};
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)!;if(k.startsWith(PRE)){try{o[k.slice(PRE.length)]=JSON.parse(localStorage.getItem(k)!)}catch{}}}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,2)],{type:'application/json'}));a.download='visionaries-backup.json';a.click();};
export const importAll=(text:string)=>{const o=JSON.parse(text);if(!o||o._version!==VERSION)throw new Error('Not a valid Visionaries backup (version mismatch).');
  Object.keys(o).filter(k=>k[0]!=='_').forEach(k=>localStorage.setItem(PRE+k,JSON.stringify(o[k])));};
export const resetAll=()=>Object.keys(localStorage).filter(k=>k.startsWith(PRE)).forEach(k=>localStorage.removeItem(k));
export const POSITIONS=['None','President','Vice-President','Secretary','Assistant Secretary','Treasurer','Auditor','Public Information Officer','Peace Officer','Muse','Escort','Classroom Adviser'];
export const OFFICERS=['President','Vice-President','Secretary','Assistant Secretary','Treasurer','Auditor','Public Information Officer','Peace Officer','Muse','Escort'];
export const COMMITTEES=['Design','Cleanliness','Socialization','Information','Discipline'];
export const CATS=['Task','Assignment','Examination','Performance Task','School Activity','Class Meeting','Submission Deadline','Holiday','No Class','Other'];
export const CROSSED=['Holiday','No Class'];
const e=(date,title,cat='School Activity')=>({id:'s'+date+title.length,date,title,cat});
export const SEED_EVENTS=[e('2026-11-02','No classes','No Class'),e('2026-11-04','MK – Class Observation & brochure deadline','Submission Deadline'),e('2026-11-06','Talumpati sa PKLP'),e('2026-11-11','Gen Sci – 5-day healthy living'),
 e('2026-11-16','No classes','No Class'),e('2026-11-17','No classes','No Class'),e('2026-11-18','No classes','No Class'),e('2026-11-20','MK – Advocacy Seminar 1A & 1B'),e('2026-11-25','MK – Advocacy Seminar 2A & 2B'),e('2026-11-27','MK – Advocacy Seminar 3A & 3B'),e('2026-11-30','No classes','No Class')];
export const SEED_NOTES='Environmental Literacy (100 days) until Dec. 25\nStart: Sept. 17\nOct. 30\nLCS – Pathways\nMK – ST #2\nGen. Math – LAS #6';
export const SEED_SUBJECTS=['LCS','General Science','General Mathematics','MK'].map((name,i)=>({id:'sub'+i,name,teacher:'',schedule:''}));
export const SEED_COMMITTEES=COMMITTEES.map((name,i)=>({id:'c'+i,name:name+' Committee',chair:'',members:'',duties:''}));
export const DEF:any={name:'Grade 11 – Visionaries',sub:'ICT-CSS & ASSH | School Year 2026–2027',school:'',adviser:'',theme:'light',accent:'#2f5bea',font:'Arial',density:'comfortable',dateFmt:'long',defaultPage:'dashboard',
 t1s:'2026-06-08',t1e:'2026-09-15',t2s:'2026-09-16',t2e:'2026-12-18',t3s:'2027-01-04',t3e:'2027-04-08',
 wWW:20,wPT:50,wEX:30,pass:75,trans:'adjusted',bulletin:'https://gabofrnndz.github.io/11-visionaries-weather-bulletin/',
 widgets:{terms:true,events:true,announcements:true,deadlines:true,hazard:true}};
export const useSettings=():[any,(v:any)=>void]=>{const [s,set]=useLocal<any>('settings',DEF);const o=s||{};return [{...DEF,...o,widgets:{...DEF.widgets,...(o.widgets||{})}},set]};
export const fmtDate=(d:string,f='long')=>{if(!d)return '';const x=new Date(d+'T00:00');return f==='iso'?d:x.toLocaleDateString('en-PH',f==='short'?{month:'short',day:'numeric',year:'numeric'}:{dateStyle:'full'})};
export const termOf=(s:any,d:string)=>[1,2,3].find(n=>d>=s['t'+n+'s']&&d<=s['t'+n+'e'])||0;
export const TASKT=['Assignment','Task','Performance Task','Submission Deadline'];
// Approximation of the SY 2026-27 adjusted table (raw 70 -> 75). Verify against the official table / E-Class Record.
export const transmute=(raw:number,mode:string)=>{if(mode==='off')return Math.round(raw);const r=Math.max(0,Math.min(100,raw));return Math.round(r>=70?75+(r-70)*(25/30):60+r*(15/70))};
