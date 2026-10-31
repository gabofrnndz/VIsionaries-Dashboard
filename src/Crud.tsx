import {useState} from 'react';
import {useLocal,uid} from './store';
export type F={n:string;label:string;t?:string;opts?:string[];def?:any};
export function Crud({k,fields,seed=[],sort,extra,empty='Nothing here yet. Use Add to create the first entry.',addLabel='Add entry'}:{k:string;fields:F[];seed?:any[];sort?:(a:any,b:any)=>number;extra?:(i:any)=>any;empty?:string;addLabel?:string}){
  const [items,setItems]=useLocal<any[]>(k,seed);
  const blank=()=>Object.fromEntries(fields.map(f=>[f.n,f.def??(f.opts?f.opts[0]:f.t==='check'?false:'')]));
  const [f,setF]=useState<any>(null);const [err,setErr]=useState('');
  const save=()=>{const first=fields[0];if(!String(f[first.n]||'').trim()){setErr(first.label+' is required.');return}
    if(f.id)setItems(items.map(i=>i.id===f.id?f:i));else setItems([...items,{...f,id:uid()}]);setErr('');setF(null)};
  const del=(i:any)=>{if(confirm('Delete this entry? This cannot be undone.'))setItems(items.filter(x=>x.id!==i.id))};
  const list=sort?[...items].sort(sort):items;
  return <div>
    {!f&&<button className="pri" onClick={()=>setF(blank())}>+ {addLabel}</button>}
    {f&&<div className="form">{fields.map(x=><label key={x.n}>{x.label}
      {x.opts?<select value={f[x.n]} onChange={e=>setF({...f,[x.n]:e.target.value})}>{x.opts.map(o=><option key={o}>{o}</option>)}</select>
      :x.t==='textarea'?<textarea rows={3} value={f[x.n]} onChange={e=>setF({...f,[x.n]:e.target.value})}/>
      :x.t==='check'?<input type="checkbox" checked={!!f[x.n]} onChange={e=>setF({...f,[x.n]:e.target.checked})}/>
      :<input type={x.t||'text'} value={f[x.n]} onChange={e=>setF({...f,[x.n]:e.target.value})}/>}</label>)}
      {err&&<p className="err" role="alert">{err}</p>}
      <div><button className="pri" onClick={save}>Save entry</button> <button onClick={()=>{setF(null);setErr('')}}>Cancel</button></div></div>}
    {!list.length&&<p className="empty">{empty}</p>}
    {list.map(i=><article className="item" key={i.id}>
      <h4>{i[fields[0].n]}</h4>
      <p className="meta">{fields.slice(1).filter(x=>i[x.n]!==''&&i[x.n]!==false&&i[x.n]!=null).map(x=>x.t==='check'?x.label:x.t==='url'?<a key={x.n} href={i[x.n]} target="_blank" rel="noreferrer">{x.label}</a>:<span key={x.n}><b>{x.label}:</b> {String(i[x.n])}; </span>)}</p>
      {extra&&extra(i)}
      <button onClick={()=>setF(i)}>Edit</button> <button className="danger" onClick={()=>del(i)}>Delete</button></article>)}
  </div>;
}
