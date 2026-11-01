import {useState} from 'react';
import {useLocal,useSettings,uid,fmtDate,termOf,SEED_EVENTS,SEED_NOTES,SEED_SUBJECTS,CATS,CROSSED,TASKT} from './store';
const DN=['Mon','Tue','Wed','Thu','Fri'],DF=['Monday','Tuesday','Wednesday','Thursday','Friday'];
const arr=(x:any)=>Array.isArray(x)?x:[];
export default function Calendar(){
  const [S]=useSettings();
  const [ev0,setEv]=useLocal<any[]>('events',SEED_EVENTS);const [as0,setAs]=useLocal<any[]>('assignments',[]);const [sub0]=useLocal<any[]>('subjects',SEED_SUBJECTS);
  const ev=arr(ev0),as=arr(as0),subs=arr(sub0);
  const [notes,setNotes]=useLocal('boardnotes',SEED_NOTES);const [cl,setCl]=useLocal<any>('cleaners',{});
  const now=new Date();const [m,setM]=useState(()=>{const d=new Date(now.getFullYear(),now.getMonth()+(now.getDate()>=25?1:0),1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')});
  const [sel,setSel]=useState<string|null>(null);const [f,setF]=useState<any>(null);const [err,setErr]=useState('');
  const [y,mo]=m.split('-').map(Number);const last=new Date(y,mo,0).getDate();
  const weeks:any[][]=[];let w:any[]=[];
  for(let d=1;d<=last;d++){const wd=new Date(y,mo-1,d).getDay();if(wd===0||wd===6)continue;if(!w.length)for(let p=1;p<wd;p++)w.push(null);w.push(d);if(wd===5){weeks.push(w);w=[]}}
  if(w.length){while(w.length<5)w.push(null);weeks.push(w)}
  const key=(d:number)=>m+'-'+String(d).padStart(2,'0');
  const shift=(n:number)=>{const d=new Date(y,mo-1+n,1);setM(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'))};
  // One source of truth: task-type entries live in Assignments; the calendar reads them by due date.
  const items=(date:string)=>[...ev.filter(e=>e.date===date).map(e=>({...e,src:'e'})),...as.filter(a=>a.due===date).map(a=>({id:a.id,title:a.title,cat:a.type||'Assignment',subject:a.subject,status:a.status,src:'a'}))];
  const marks=(date:string)=>[1,2,3].flatMap(n=>[S['t'+n+'s']===date?'Term '+n+' begins':'',S['t'+n+'e']===date?'Term '+n+' ends':'']).filter(Boolean);
  const blank={title:'',cat:CATS[0],subject:'—',status:'Not Started'};
  const open=(date:string)=>{setSel(date);setF(blank);setErr('')};
  const save=()=>{if(!f.title.trim()){setErr('Enter a title.');return}setErr('');const id=f.id||uid();let nev=ev.filter(e=>e.id!==id),nas=as.filter(a=>a.id!==id);
    if(TASKT.includes(f.cat)){const old:any=as.find(a=>a.id===id)||{};nas=[...nas,{...old,id,title:f.title,subject:f.subject||'—',type:f.cat,due:sel,status:f.status||'Not Started'}]}
    else nev=[...nev,{id,title:f.title,cat:f.cat,subject:f.subject,date:sel}];setEv(nev);setAs(nas);setF(blank)};
  const del=(it:any)=>{if(confirm('Delete "'+it.title+'"?')){setEv(ev.filter(e=>e.id!==it.id));setAs(as.filter(a=>a.id!==it.id))}};
  const done=(it:any)=>setAs(as.map(a=>a.id===it.id?{...a,status:'Completed'}:a));
  const wdT=now.getDay();const day=DF[wdT>=1&&wdT<=5?wdT-1:0];const c=cl[day]||{boys:'',girls:''};
  const mname=new Date(y,mo-1,1).toLocaleString('en',{month:'long'});const tn=termOf(S,m+'-15')||termOf(S,m+'-01');
  const dayItems=sel?items(sel):[];
  return <div>
    <div className="termbar">{tn?<><b>Term {tn}</b> · {fmtDate(S['t'+tn+'s'],'short')} – {fmtDate(S['t'+tn+'e'],'short')}</>:<>Between terms or outside the school year</>} <span>Three-term calendar (DepEd Order 009, s. 2026)</span></div>
    <div className="board"><div className="bhead"><button onClick={()=>shift(-1)} aria-label="Previous month">‹</button><h2>{mname} <small>Monthly Schedule {y}</small></h2><input type="month" value={m} onChange={e=>e.target.value&&setM(e.target.value)} aria-label="Jump to month" style={{width:'auto'}}/><button onClick={()=>shift(1)} aria-label="Next month">›</button></div>
    <div className="bwrap"><div className="gscroll"><div className="grid">{DN.map(d=><div key={d} className="dh">{d}</div>)}
      {weeks.flat().map((d,i)=>{if(!d)return <div key={i} className="cell blank"/>;const es=items(key(d));const x=es.some(e=>CROSSED.includes(e.cat));
        return <div key={i} className={'cell'+(x?' xed':'')} role="button" tabIndex={0} onClick={()=>open(key(d))} onKeyDown={e=>{if(e.key==='Enter')open(key(d))}}><b>{d}</b>
          {marks(key(d)).map(t=><div key={t} className="chip term">{t}</div>)}
          {es.map(e=><div key={e.id} className={'chip '+(TASKT.includes(e.cat)?'task':e.cat==='Examination'?'exam':'')+(e.status==='Completed'||e.status==='Submitted'?' done':'')}>{e.title}{e.subject&&e.subject!=='—'?' ('+e.subject+')':''}</div>)}</div>})}</div></div>
    <aside><div className="side"><h4>Notes</h4><textarea rows={8} value={notes} onChange={e=>setNotes(e.target.value)} aria-label="Board notes"/></div>
      <div className="side"><h4>Cleaners – today, {day}</h4><label>Boys<textarea rows={3} value={c.boys} onChange={e=>setCl({...cl,[day]:{...c,boys:e.target.value}})}/></label><label>Girls<textarea rows={3} value={c.girls} onChange={e=>setCl({...cl,[day]:{...c,girls:e.target.value}})}/></label></div></aside></div></div>
    <p className="meta">Click any box to add or edit. Assignments, tasks and deadlines you add here appear in Assignments (and the other way around). Holiday or No Class crosses out the whole box.</p>
    {sel&&f&&<div className="modal" onClick={()=>setSel(null)}><div className="dlg" role="dialog" aria-label="Day entries" onClick={e=>e.stopPropagation()}>
      <h3>{fmtDate(sel,S.dateFmt)}</h3>{marks(sel).map(t=><p key={t} className="meta">{t}</p>)}
      {dayItems.map(e=><div className="item" key={e.id}><b>{e.title}</b> <small>{e.cat}{e.subject&&e.subject!=='—'?' · '+e.subject:''}{e.src==='a'?' · '+e.status:''}</small><div><button onClick={()=>setF(e)}>Edit</button>{e.src==='a'&&e.status!=='Completed'&&e.status!=='Submitted'&&<button onClick={()=>done(e)}>Mark done</button>}<button className="danger" onClick={()=>del(e)}>Delete</button></div></div>)}
      <div className="form"><h4>{f.id?'Edit entry':'New entry'}</h4><label>Title<input autoFocus value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></label>
        <label>Type<select value={f.cat} onChange={e=>setF({...f,cat:e.target.value})}>{CATS.map(o=><option key={o}>{o}</option>)}</select></label>
        <label>Subject<select value={f.subject} onChange={e=>setF({...f,subject:e.target.value})}><option>—</option>{subs.map(s=><option key={s.id}>{s.name}</option>)}</select></label>
        {TASKT.includes(f.cat)&&<label>Status<select value={f.status||'Not Started'} onChange={e=>setF({...f,status:e.target.value})}>{['Not Started','In Progress','Completed','Submitted','Returned'].map(o=><option key={o}>{o}</option>)}</select></label>}
        {err&&<p className="err" role="alert">{err}</p>}<div><button className="pri" onClick={save}>{f.id?'Save changes':'Save entry'}</button> <button onClick={()=>setSel(null)}>Close</button></div></div></div></div>}
  </div>;
}
