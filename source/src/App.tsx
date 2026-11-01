import {useEffect,useState,Component} from 'react';
import {useLocal,useSettings,resetAll,fmtDate,termOf,SEED_EVENTS,CROSSED} from './store';
import Calendar from './Calendar';
import {Announcements,Assignments,Subjects,Roster,Committees,Grades,Attendance,Governance,Discipline,Elections,Constitution,Resources,Settings,Hazard} from './pages';
class EB extends Component<any,any>{state={e:null as any};static getDerivedStateFromError(e:any){return{e}}render(){return this.state.e?<div style={{padding:24}}><h2>Something went wrong</h2><p>{String(this.state.e.message)}</p><p>Saved data may be corrupted. Resetting clears this device’s dashboard data.</p><button onClick={()=>{resetAll();location.reload()}}>Reset data and reload</button></div>:this.props.children}}
const today=()=>new Date().toISOString().slice(0,10);const arr=(x:any)=>Array.isArray(x)?x:[];
function Dash({go}:any){
  const [S]=useSettings();const W=S.widgets;
  const [ev0]=useLocal<any[]>('events',SEED_EVENTS),[as0]=useLocal<any[]>('assignments',[]),[an0]=useLocal<any[]>('announcements',[]);const ev=arr(ev0),as=arr(as0),an=arr(an0);
  const pend=as.filter(a=>!['Completed','Submitted'].includes(a.status));
  const up=[...ev.filter(e=>!CROSSED.includes(e.cat)).map(e=>({id:e.id,date:e.date,title:e.title,cat:e.cat})),...pend.filter(a=>a.due).map(a=>({id:a.id,date:a.due,title:a.title,cat:a.type||'Assignment'}))].filter(e=>e.date>=today()).sort((a,b)=>a.date.localeCompare(b.date));
  const live=an.filter(a=>!a.archived).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||(b.date||'').localeCompare(a.date||''));
  const tn=termOf(S,today());const left=tn?Math.max(0,Math.ceil((+new Date(S['t'+tn+'e']+'T00:00')-+new Date(today()+'T00:00'))/864e5)):0;
  const C=({t,v,to}:any)=><button className="card" onClick={()=>go(to)}><span>{v}</span>{t}</button>;
  return <div><div className="stats"><C t="Upcoming" v={up.length} to="calendar"/><C t="Exams ahead" v={up.filter(e=>e.cat==='Examination').length} to="calendar"/><C t="Pending requirements" v={pend.length} to="assignments"/><C t="Announcements" v={live.length} to="announcements"/></div>
  <div className="widgets">
  {W.terms&&<section className="panel"><h3>Current term</h3>{tn?<><p className="big">Term {tn}</p><p className="meta">{fmtDate(S['t'+tn+'s'],'short')} – {fmtDate(S['t'+tn+'e'],'short')} · {left} days left</p></>:<p className="meta">Outside a term (break or before/after the school year).</p>}</section>}
  {W.hazard&&<section className="panel"><h3>Weather and hazards</h3><p className="meta">Generate the class Multi-Hazard Bulletin.</p><button className="pri" onClick={()=>go('hazard')}>Open bulletin generator</button></section>}
  {W.events&&<section className="panel"><h3>Next on the board</h3>{up.slice(0,6).map(e=><p key={e.id}><b>{fmtDate(e.date,'short')}</b> {e.title}</p>)}{!up.length&&<p className="empty">Nothing upcoming. Click a day in Calendar.</p>}</section>}
  {W.announcements&&<section className="panel"><h3>Latest announcements</h3>{live.slice(0,4).map(a=><p key={a.id}>{a.pinned?'📌 ':''}<b>{a.title}</b> <small>{a.category}</small></p>)}{!live.length&&<p className="empty">No announcements yet.</p>}</section>}
  {W.deadlines&&<section className="panel"><h3>Deadlines</h3>{pend.sort((a,b)=>(a.due||'9').localeCompare(b.due||'9')).slice(0,5).map(a=><p key={a.id}><b>{a.due?fmtDate(a.due,'short'):'No date'}</b> {a.title}</p>)}{!pend.length&&<p className="empty">All caught up.</p>}</section>}</div></div>;
}
const NAV:[string,string,string][]=[['dashboard','Dashboard','🏠'],['announcements','Announcements','📢'],['calendar','Calendar','📅'],['assignments','Assignments','📝'],['subjects','Subjects','📚'],['grades','Grade Tracker','📊'],['roster','Class Roster','👥'],['committees','Committees','🧩'],['attendance','Attendance','✅'],['governance','Governance','🏛️'],['discipline','Discipline','⚖️'],['elections','Elections & Removal','🗳️'],['constitution','Constitution','📜'],['hazard','Hazard Bulletin','🌀'],['resources','Resources','📁'],['settings','Settings','⚙️']];
export default function App(){
  const [S]=useSettings();
  const read=()=>location.hash.replace('#/','')||S.defaultPage||'dashboard';const [p,setP]=useState(read());const [open,setOpen]=useState(false);
  useEffect(()=>{const h=()=>setP(read());addEventListener('hashchange',h);return()=>removeEventListener('hashchange',h)},[S.defaultPage]);
  useEffect(()=>{const r=document.documentElement;const dark=S.theme==='dark'||(S.theme==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);r.dataset.theme=dark?'dark':'light';r.dataset.density=S.density;r.style.setProperty('--accent',S.accent);r.style.setProperty('--font',S.font==='Arial Narrow'?'"Arial Narrow","Liberation Sans Narrow",Arial,sans-serif':S.font+',Arial,sans-serif')},[S]);
  const go=(x:string)=>{location.hash='#/'+x;setOpen(false)};
  const pg:any={dashboard:<Dash go={go}/>,announcements:<Announcements/>,calendar:<Calendar/>,assignments:<Assignments/>,subjects:<Subjects/>,grades:<Grades/>,roster:<Roster/>,committees:<Committees/>,attendance:<Attendance/>,governance:<Governance/>,discipline:<Discipline/>,elections:<Elections/>,constitution:<Constitution/>,hazard:<Hazard/>,resources:<Resources/>,settings:<Settings/>};
  const cur=NAV.find(n=>n[0]===p)||NAV[0];
  return <EB><div className="app"><header><button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu">☰</button><div><h1>{S.name}</h1><small>{S.sub}{S.adviser?' · Adviser: '+S.adviser:''}</small></div><time>{fmtDate(today(),S.dateFmt)}</time></header>
   <nav className={open?'open':''}>{NAV.map(([k,l,i])=><a key={k} href={'#/'+k} className={cur[0]===k?'on':''} onClick={()=>setOpen(false)}><span>{i}</span>{l}</a>)}</nav>
   <main><h2>{cur[2]} {cur[1]}</h2>{pg[cur[0]]}</main></div></EB>;
}
