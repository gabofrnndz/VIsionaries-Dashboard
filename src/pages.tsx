import {Crud} from './Crud';
import {useLocal,OFFICERS,COMMITTEES,SEED_DIR,SEED_EVENTS,exportAll,importAll,resetAll} from './store';
const today=()=>new Date().toISOString().slice(0,10);
export const Announcements=()=><Crud k="announcements" addLabel="New announcement" empty="No announcements. Post the first one." sort={(a,b)=>(b.pinned-a.pinned)||(b.date||'').localeCompare(a.date||'')}
 fields={[{n:'title',label:'Title'},{n:'category',label:'Category',opts:['General Announcement','Academic Reminder','Examination','School Activity','Class Officers','Urgent Notice','Class Suspension']},{n:'priority',label:'Priority',opts:['Normal','High','Urgent']},{n:'date',label:'Date',t:'date',def:today()},{n:'pinned',label:'Pinned',t:'check'},{n:'archived',label:'Archived',t:'check'},{n:'body',label:'Details',t:'textarea'},{n:'link',label:'Link',t:'url'}]}/>;
export const Assignments=()=><Crud k="assignments" addLabel="Add requirement" sort={(a,b)=>(a.due||'9').localeCompare(b.due||'9')}
 fields={[{n:'title',label:'Requirement'},{n:'subject',label:'Subject'},{n:'teacher',label:'Teacher'},{n:'due',label:'Due date',t:'date'},{n:'status',label:'Status',opts:['Not Started','In Progress','Completed','Submitted','Returned']},{n:'instructions',label:'Instructions',t:'textarea'},{n:'link',label:'Submission link',t:'url'}]}
 extra={i=>i.due&&i.due<today()&&!['Completed','Submitted'].includes(i.status)?<p className="err">Overdue</p>:null}/>;
export const Directory=()=><Crud k="directory" seed={SEED_DIR} addLabel="Add member" sort={(a,b)=>{const r=(x:any)=>OFFICERS.includes(x.role)?OFFICERS.indexOf(x.role):50;return r(a)-r(b)}}
 fields={[{n:'name',label:'Name'},{n:'role',label:'Role',opts:[...OFFICERS,'Classroom Adviser','Subject Teacher','Committee Chairperson','Member']},{n:'committee',label:'Committee',opts:['None',...COMMITTEES]},{n:'duties',label:'Responsibilities',t:'textarea'}]}/>;
const pct=(s:any,t:any)=>+t>0?(+s/+t)*100:0;
export const Grades=()=><div><p className="meta">Private tracking only: stored in this browser and never shared. Weights are examples; set them per your subject teacher’s criteria (Art. IV §9).</p><Crud k="grades" addLabel="Add grade record"
 fields={[{n:'subject',label:'Subject'},{n:'quarter',label:'Quarter',opts:['Q1','Q2','Q3','Q4']},{n:'ws',label:'Written Work score',t:'number'},{n:'wt',label:'Written Work total',t:'number'},{n:'ps',label:'Performance Task score',t:'number'},{n:'pt',label:'Performance Task total',t:'number'},{n:'qs',label:'Quarterly Assessment score',t:'number'},{n:'qt',label:'Quarterly Assessment total',t:'number'},{n:'w1',label:'WW weight %',t:'number',def:25},{n:'w2',label:'PT weight %',t:'number',def:50},{n:'w3',label:'QA weight %',t:'number',def:25}]}
 extra={g=>{const s=+g.w1+ +g.w2+ +g.w3;if(s!==100)return <p className="err">Weights total {s}%; they must total 100%.</p>;const a=pct(g.ws,g.wt),b=pct(g.ps,g.pt),c=pct(g.qs,g.qt);
  return <p><b>Percent:</b> WW {a.toFixed(1)}, PT {b.toFixed(1)}, QA {c.toFixed(1)} · <b>Weighted:</b> {(a*g.w1/100).toFixed(2)} + {(b*g.w2/100).toFixed(2)} + {(c*g.w3/100).toFixed(2)} · <b>Final: {((a*g.w1+b*g.w2+c*g.w3)/100).toFixed(2)}</b></p>}}/></div>;
export function Attendance(){
  const [rows]=useLocal<any[]>('attendance',[]);
  const counted=rows.filter(r=>r.status!=='Class Suspension');const n=(s:string)=>counted.filter(r=>r.status===s).length;
  const rate=counted.length?(((n('Present')+n('Late'))/counted.length)*100).toFixed(1):'–';
  const warn:string[]=[];[...new Set(counted.map(r=>r.name))].forEach(nm=>{let run=0,mx=0;counted.filter(r=>r.name===nm).sort((a,b)=>a.date.localeCompare(b.date)).forEach(r=>{run=r.status==='Late'?run+1:0;mx=Math.max(mx,run)});if(mx>=6)warn.push(nm)});
  return <div><p className="meta">Use initials or seat numbers on a public site. Suspension days are not counted (Art. XV §1a).</p>
   <div className="stats"><span>Present {n('Present')}</span><span>Late {n('Late')}</span><span>Absent {n('Absent')}</span><span>Excused {n('Excused')}</span><span>Attendance rate {rate}%</span></div>
   {warn.map(w=><p key={w} className="err">{w}: 6 or more consecutive tardiness. Adviser sends written notice to parent/guardian.</p>)}
   <Crud k="attendance" addLabel="Record attendance" sort={(a,b)=>b.date.localeCompare(a.date)} fields={[{n:'name',label:'Member (initials/seat no.)'},{n:'date',label:'Date',t:'date',def:today()},{n:'status',label:'Status',opts:['Present','Absent','Late','Excused','Class Suspension']},{n:'note',label:'Note'}]}/></div>;
}
export const Governance=()=><div>
 <h3>Resolutions</h3><Crud k="resolutions" addLabel="New resolution" fields={[{n:'title',label:'Title'},{n:'no',label:'Resolution no.'},{n:'date',label:'Date adopted',t:'date'},{n:'sponsor',label:'Sponsor'},{n:'status',label:'Status',opts:['Draft','Proposed','Adopted','Implemented','Archived']},{n:'text',label:'Full text',t:'textarea'}]}/>
 <h3>Meetings and minutes</h3><Crud k="meetings" addLabel="New meeting" fields={[{n:'title',label:'Title'},{n:'type',label:'Type',opts:['General Assembly',"Officers' Meeting",'Special Meeting']},{n:'date',label:'Date',t:'date'},{n:'quorum',label:'Quorum met (majority present)?',opts:['Yes','No']},{n:'agenda',label:'Agenda',t:'textarea'},{n:'minutes',label:'Minutes and decisions',t:'textarea'},{n:'actions',label:'Action items',t:'textarea'}]}/>
 <h3>Committee projects</h3><Crud k="projects" addLabel="New project" fields={[{n:'title',label:'Project'},{n:'committee',label:'Committee',opts:COMMITTEES},{n:'assigned',label:'Assigned to'},{n:'status',label:'Status',opts:['Planned','Ongoing','Completed']},{n:'progress',label:'Progress %',t:'number'}]}/>
 <h3>Finance ledger (Treasurer, countersigned by Auditor)</h3><p className="meta">Collect only for purposes approved by officers and the Adviser (Art. XI).</p><Crud k="ledger" addLabel="Record transaction" fields={[{n:'particulars',label:'Particulars'},{n:'type',label:'Type',opts:['Collection','Disbursement']},{n:'amount',label:'Amount (PHP)',t:'number'},{n:'date',label:'Date',t:'date',def:today()},{n:'approved',label:'Approved by'}]}/></div>;
export const Resources=()=><Crud k="resources" addLabel="Add resource" fields={[{n:'title',label:'Title'},{n:'subject',label:'Subject'},{n:'category',label:'Category',opts:['Learning Materials','Reviewers','Worksheets','Presentations','Reference Documents','School Policies','Technical Resources']},{n:'link',label:'Link',t:'url'},{n:'fav',label:'Favorite',t:'check'}]} sort={(a,b)=>(b.fav?1:0)-(a.fav?1:0)}/>;
export function Settings({s,set}:any){
  return <div className="form"><label>Class name<input value={s.name} onChange={e=>set({...s,name:e.target.value})}/></label><label>Subtitle<input value={s.sub} onChange={e=>set({...s,sub:e.target.value})}/></label>
  <label>Theme<select value={s.theme} onChange={e=>set({...s,theme:e.target.value})}><option>light</option><option>dark</option></select></label><label>Accent color<input type="color" value={s.accent} onChange={e=>set({...s,accent:e.target.value})}/></label>
  <p className="meta">Data lives only in this browser and does not sync across devices. Export a backup regularly.</p>
  <div><button onClick={exportAll}>Export JSON backup</button> <label className="btn">Import JSON<input hidden type="file" accept="application/json" onChange={async e=>{const f=e.target.files?.[0];if(!f)return;try{if(confirm('Replace current data with this backup?')){importAll(await f.text());location.reload()}}catch(x:any){alert(x.message)}}}/></label>
  <button className="danger" onClick={()=>{if(confirm('Erase ALL dashboard data on this device?')){resetAll();location.reload()}}}>Reset all data</button></div></div>;
}
export {SEED_EVENTS};
