import {useEffect,useState} from 'react';
import {useLocal,SEED_EVENTS} from './store';
import Calendar from './Calendar';
import {Announcements,Assignments,Subjects,Roster,Committees,Grades,Attendance,Governance,Discipline,Elections,Constitution,Resources,Settings} from './pages';
import {Component} from 'react';
import {resetAll} from './store';
class EB extends Component<any,any>{state={e:null as any};static getDerivedStateFromError(e:any){return{e}}render(){return this.state.e?<div style={{padding:24}}><h2>Something went wrong</h2><p>{String(this.state.e.message)}</p><p>Saved data may be corrupted. Resetting clears this device’s dashboard data.</p><button onClick={()=>{resetAll();location.reload()}}>Reset data and reload</button></div>:this.props.children}}
const today=()=>new Date().toISOString().slice(0,10);
function Dash({go}:any){
  const [ev]=useLocal<any[]>('events',SEED_EVENTS),[as]=useLocal<any[]>('assignments',[]),[an]=useLocal<any[]>('announcements',[]);
  const up=ev.filter(e=>e.date>=today()&&!['No Class','Holiday'].includes(e.cat)).sort((a,b)=>a.date.localeCompare(b.date));
  const pend=as.filter(a=>!['Completed','Submitted'].includes(a.status));
  const live=an.filter(a=>!a.archived).sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0)||(b.date||'').localeCompare(a.date||''));
  const C=({t,v,to}:any)=><button className="card" onClick={()=>go(to)}><span>{v}</span>{t}</button>;
  return <div><div className="stats"><C t="Upcoming activities" v={up.length} to="calendar"/><C t="Examinations ahead" v={up.filter(e=>e.cat==='Examination').length} to="calendar"/><C t="Pending requirements" v={pend.length} to="assignments"/><C t="Announcements" v={live.length} to="announcements"/></div>
  <h3>Next on the board</h3>{up.slice(0,6).map(e=><p key={e.id}><b>{e.date}</b> {e.title}</p>)}{!up.length&&<p className="empty">No upcoming events. Add one in Calendar.</p>}
  <h3>Latest announcements</h3>{live.slice(0,4).map(a=><p key={a.id}>{a.pinned?'📌 ':''}<b>{a.title}</b> <small>{a.category}</small></p>)}{!live.length&&<p className="empty">No announcements yet.</p>}
  <h3>Deadlines</h3>{pend.slice(0,5).map(a=><p key={a.id}><b>{a.due||'No date'}</b> {a.title} ({a.subject})</p>)}</div>;
}
const NAV:[string,string][]=[['dashboard','Dashboard'],['announcements','Announcements'],['calendar','Calendar'],['assignments','Assignments'],['subjects','Subjects'],['grades','Grade Tracker'],['roster','Class Roster'],['committees','Committees'],['attendance','Attendance'],['governance','Governance'],['discipline','Discipline'],['elections','Elections & Removal'],['constitution','Constitution'],['resources','Resources'],['settings','Settings']];
export default function App(){
  const [s,set]=useLocal('settings',{name:'Grade 11 – Visionaries',sub:'ICT-CSS & ASSH | School Year 2026–2027',theme:'light',accent:'#c1121f'});
  const read=()=>location.hash.replace('#/','')||'dashboard';const [p,setP]=useState(read());const [open,setOpen]=useState(false);
  useEffect(()=>{const h=()=>setP(read());addEventListener('hashchange',h);return()=>removeEventListener('hashchange',h)},[]);
  useEffect(()=>{document.documentElement.dataset.theme=s.theme;document.documentElement.style.setProperty('--accent',s.accent)},[s]);
  const go=(x:string)=>{location.hash='#/'+x;setOpen(false)};
  const pg:any={dashboard:<Dash go={go}/>,announcements:<Announcements/>,calendar:<Calendar/>,assignments:<Assignments/>,grades:<Grades/>,subjects:<Subjects/>,roster:<Roster/>,committees:<Committees/>,discipline:<Discipline/>,elections:<Elections/>,constitution:<Constitution/>,attendance:<Attendance/>,governance:<Governance/>,resources:<Resources/>,settings:<Settings s={s} set={set}/>};
  return <EB><div className="app"><header><button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu">☰</button><div><h1>{s.name}</h1><small>{s.sub} · {new Date().toLocaleDateString('en-PH',{dateStyle:'full'})}</small></div></header>
   <nav className={open?'open':''}>{NAV.map(([k,l])=><a key={k} href={'#/'+k} className={p===k?'on':''} onClick={()=>setOpen(false)}>{l}</a>)}</nav>
   <main><h2>{NAV.find(n=>n[0]===p)?.[1]||'Dashboard'}</h2>{pg[p]||pg.dashboard}</main></div></EB>;
}
