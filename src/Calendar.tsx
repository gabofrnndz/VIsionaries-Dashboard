import {useState} from 'react';
import {useLocal,uid,SEED_EVENTS,SEED_NOTES,CATS} from './store';
const DN=['Mon','Tue','Wed','Thu','Fri'],DF=['Monday','Tuesday','Wednesday','Thursday','Friday'];
export default function Calendar(){
  const [ev,setEv]=useLocal<any[]>('events',SEED_EVENTS);
  const [notes,setNotes]=useLocal('boardnotes',SEED_NOTES);
  const [cl,setCl]=useLocal<any>('cleaners',{});
  const now=new Date();const [m,setM]=useState(()=>{const d=new Date(now.getFullYear(),now.getMonth()+(now.getDate()>=25?1:0),1);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')});
  const [f,setF]=useState({date:'',title:'',cat:CATS[0]});const [err,setErr]=useState('');
  const [y,mo]=m.split('-').map(Number);const last=new Date(y,mo,0).getDate();
  const weeks:any[][]=[];let w:any[]=[];
  for(let d=1;d<=last;d++){const wd=new Date(y,mo-1,d).getDay();if(wd===0||wd===6)continue;
    if(!w.length)for(let p=1;p<wd;p++)w.push(null);w.push(d);if(wd===5){weeks.push(w);w=[]}}
  if(w.length){while(w.length<5)w.push(null);weeks.push(w)}
  const key=(d:number)=>m+'-'+String(d).padStart(2,'0');
  const shift=(n:number)=>{const d=new Date(y,mo-1+n,1);setM(d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'))};
  const add=()=>{if(!f.date||!f.title.trim()){setErr('Date and title are required.');return}setErr('');setEv([...ev,{...f,id:uid()}]);setF({...f,title:''})};
  const wdToday=now.getDay();const day=DF[wdToday>=1&&wdToday<=5?wdToday-1:0];const c=cl[day]||{boys:'',girls:''};
  const mname=new Date(y,mo-1,1).toLocaleString('en',{month:'long'});
  return <div>
    <div className="board"><div className="bhead"><button onClick={()=>shift(-1)} aria-label="Previous month">‹</button><h2>{mname} <small>Monthly Schedule {y}</small></h2><button onClick={()=>shift(1)} aria-label="Next month">›</button></div>
    <div className="bwrap"><div className="grid">{DN.map(d=><div key={d} className="dh">{d}</div>)}
      {weeks.flat().map((d,i)=>{if(!d)return <div key={i} className="cell blank"/>;const es=ev.filter(e=>e.date===key(d));const x=es.some(e=>e.cat==='No Class');
        return <div key={i} className={'cell'+(x?' xed':'')}><b>{d}</b>{es.filter(e=>e.cat!=='No Class').map(e=><div key={e.id} className="chip" title="Click to delete" onClick={()=>confirm('Delete "'+e.title+'"?')&&setEv(ev.filter(z=>z.id!==e.id))}>{e.title}</div>)}</div>})}</div>
    <aside><div className="side"><h4>Notes</h4><textarea rows={8} value={notes} onChange={e=>setNotes(e.target.value)} aria-label="Board notes"/></div>
      <div className="side"><h4>Cleaners – today, {day}</h4><label>Boys<textarea rows={3} value={c.boys} onChange={e=>setCl({...cl,[day]:{...c,boys:e.target.value}})}/></label><label>Girls<textarea rows={3} value={c.girls} onChange={e=>setCl({...cl,[day]:{...c,girls:e.target.value}})}/></label></div></aside></div></div>
    <div className="form"><h3>Add event</h3><label>Date<input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/></label><label>Title<input value={f.title} onChange={e=>setF({...f,title:e.target.value})}/></label>
      <label>Type<select value={f.cat} onChange={e=>setF({...f,cat:e.target.value})}>{CATS.map(o=><option key={o}>{o}</option>)}</select></label>{err&&<p className="err" role="alert">{err}</p>}<button className="pri" onClick={add}>Add to calendar</button>
      <p className="meta">Choose “No Class” to cross out a day. Click an event chip to delete it. Notes and cleaners are saved on this device.</p></div></div>;
}
