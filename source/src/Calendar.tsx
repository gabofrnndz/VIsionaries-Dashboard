import {useState} from 'react';
import {useLocal,uid,SEED_EVENTS,SEED_NOTES,SEED_SUBJECTS,CATS,CROSSED} from './store';
const DN=['Mon','Tue','Wed','Thu','Fri'],DF=['Monday','Tuesday','Wednesday','Thursday','Friday'];
export default function Calendar(){
  const [ev,setEv]=useLocal<any[]>('events',SEED_EVENTS);
  const [subs]=useLocal<any[]>('subjects',SEED_SUBJECTS);
  const [notes,setNotes]=useLocal('boardnotes',SEED_NOTES);
  const [cl,setCl]=useLocal<any>('cleaners',{});
  const now=new Date();const [m,setM]=useState(()=>{const d=new Date(now.getFullYear(),now.getMonth()+(now.getDate()>=25?1:0),1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')});
  const [sel,setSel]=useState<string|null>(null);const [f,setF]=useState<any>(null);const [err,setErr]=useState('');
  const [y,mo]=m.split('-').map(Number);const last=new Date(y,mo,0).getDate();
  const weeks:any[][]=[];let w:any[]=[];
  for(let d=1;d<=last;d++){const wd=new Date(y,mo-1,d).getDay();if(wd===0||wd===6)continue;
    if(!w.length)for(let p=1;p<wd;p++)w.push(null);w.push(d);if(wd===5){weeks.push(w);w=[]}}
  if(w.length){while(w.length<5)w.push(null);weeks.push(w)}
  const key=(d:number)=>m+'-'+String(d).padStart(2,'0');
  const shift=(n:number)=>{const d=new Date(y,mo-1+n,1);setM(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'))};
  const blank={title:'',cat:CATS[0],subject:''};
  const save=()=>{if(!f.title.trim()){setErr('Enter a title.');return}setErr('');setEv(f.id?ev.map(e=>e.id===f.id?{...f,date:sel}:e):[...ev,{...f,id:uid(),date:sel}]);setF(blank)};
  const wdT=now.getDay();const day=DF[wdT>=1&&wdT<=5?wdT-1:0];const c=cl[day]||{boys:'',girls:''};
  const mname=new Date(y,mo-1,1).toLocaleString('en',{month:'long'});
  const dayEv=ev.filter(e=>e.date===sel);
  return <div>
    <div className="board"><div className="bhead"><button onClick={()=>shift(-1)} aria-label="Previous month">‹</button><h2>{mname} <small>Monthly Schedule {y}</small></h2><input type="month" value={m} onChange={e=>e.target.value&&setM(e.target.value)} aria-label="Jump to month" style={{width:'auto'}}/><button onClick={()=>shift(1)} aria-label="Next month">›</button></div>
    <div className="bwrap"><div className="gscroll"><div className="grid">{DN.map(d=><div key={d} className="dh">{d}</div>)}
      {weeks.flat().map((d,i)=>{if(!d)return <div key={i} className="cell blank"/>;const es=ev.filter(e=>e.date===key(d));const x=es.some(e=>CROSSED.includes(e.cat));
        return <div key={i} className={'cell'+(x?' xed':'')} role="button" tabIndex={0} onClick={()=>{setSel(key(d));setF(blank);setErr('')}} onKeyDown={e=>{if(e.key==='Enter'){setSel(key(d));setF(blank)}}}><b>{d}</b>{es.map(e=><div key={e.id} className="chip">{e.title}{e.subject?' ('+e.subject+')':''}</div>)}</div>})}</div></div>
    <aside><div className="side"><h4>Notes</h4><textarea rows={8} value={notes} onChange={e=>setNotes(e.target.value)} aria-label="Board notes"/></div>
      <div className="side"><h4>Cleaners – today, {day}</h4><label>Boys<textarea rows={3} value={c.boys} onChange={e=>setCl({...cl,[day]:{...c,boys:e.target.value}})}/></label><label>Girls<textarea rows={3} value={c.girls} onChange={e=>setCl({...cl,[day]:{...c,girls:e.target.value}})}/></label></div></aside></div></div>
    <p className="meta">Click any box to add, edit or delete tasks, assignments, exams or holidays. A Holiday or No Class entry crosses out the whole box.</p>
    {sel&&f&&<div className="modal" onClick={()=>setSel(null)}><div className="dlg" role="dialog" aria-label="Day entries" onClick={e=>e.stopPropagation()}>
      <h3>{new Date(sel+'T00:00').toLocaleDateString('en-PH',{dateStyle:'full'})}</h3>
      {dayEv.map(e=><div className="item" key={e.id}><b>{e.title}</b> <small>{e.cat}{e.subject?' · '+e.subject:''}</small><div><button onClick={()=>setF(e)}>Edit</button><button className="danger" onClick={()=>confirm('Delete "'+e.title+'"?')&&setEv(ev.filter(z=>z.id!==e.id))}>Delete</button></div></div>)}
      <div className="form"><h4>{f.id?'Edit entry':'New entry'}</h4><label>Title<input autoFocus value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></label>
        <label>Type<select value={f.cat} onChange={e=>setF({...f,cat:e.target.value})}>{CATS.map(o=><option key={o}>{o}</option>)}</select></label>
        <label>Subject<select value={f.subject} onChange={e=>setF({...f,subject:e.target.value})}><option value="">(none)</option>{subs.map(s=><option key={s.id}>{s.name}</option>)}</select></label>
        {err&&<p className="err" role="alert">{err}</p>}<div><button className="pri" onClick={save}>{f.id?'Save changes':'Save entry'}</button> <button onClick={()=>setSel(null)}>Close</button></div></div></div></div>}
  </div>;
}
