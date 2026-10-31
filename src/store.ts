import {useState,useEffect} from 'react';
export const VERSION=1, PRE='visionaries:v'+VERSION+':';
export function useLocal<T>(k:string,d:T):[T,(v:T)=>void]{
  const [s,set]=useState<T>(()=>{try{const r=localStorage.getItem(PRE+k);return r?JSON.parse(r):d}catch{return d}});
  useEffect(()=>{try{localStorage.setItem(PRE+k,JSON.stringify(s))}catch{}},[k,s]);
  return [s,set as any];
}
export const uid=()=>Math.random().toString(36).slice(2,10);
export const exportAll=()=>{const o:any={_version:VERSION};
  for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)!;if(k.startsWith(PRE)){try{o[k.slice(PRE.length)]=JSON.parse(localStorage.getItem(k)!)}catch{}}}
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(o,null,2)],{type:'application/json'}));a.download='visionaries-backup.json';a.click();};
export const importAll=(text:string)=>{const o=JSON.parse(text);if(!o||o._version!==VERSION)throw new Error('Not a valid Visionaries backup (version mismatch).');
  Object.keys(o).filter(k=>k[0]!=='_').forEach(k=>localStorage.setItem(PRE+k,JSON.stringify(o[k])));};
export const resetAll=()=>Object.keys(localStorage).filter(k=>k.startsWith(PRE)).forEach(k=>localStorage.removeItem(k));
export const OFFICERS=['President','Vice-President','Secretary','Assistant Secretary','Treasurer','Auditor','Public Information Officer','Peace Officer','Muse','Escort'];
export const COMMITTEES=['Design','Cleanliness','Socialization','Information','Discipline'];
export const CATS=['Examination','Assignment Deadline','Performance Task','School Activity','Class Meeting','Holiday','Submission Deadline','No Class','Other'];
const e=(date,title,cat='School Activity')=>({id:'s'+date+title.length,date,title,cat});
export const SEED_EVENTS=[e('2026-11-02','No classes','No Class'),e('2026-11-04','MK – Class Observation & brochure deadline','Submission Deadline'),e('2026-11-06','Talumpati sa PKLP'),e('2026-11-11','Gen Sci – 5-day healthy living'),
 e('2026-11-16','No classes','No Class'),e('2026-11-17','No classes','No Class'),e('2026-11-18','No classes','No Class'),e('2026-11-20','MK – Advocacy Seminar 1A & 1B'),e('2026-11-25','MK – Advocacy Seminar 2A & 2B'),e('2026-11-27','MK – Advocacy Seminar 3A & 3B'),e('2026-11-30','No classes','No Class')];
export const SEED_NOTES='Environmental Literacy (100 days) until Dec. 25\nStart: Sept. 17\nOct. 30\nLCS – Pathways\nMK – ST #2\nGen. Math – LAS #6';
export const SEED_DIR=OFFICERS.map((r,i)=>({id:'o'+i,name:'(vacant)',role:r,committee:'None',duties:''}));
