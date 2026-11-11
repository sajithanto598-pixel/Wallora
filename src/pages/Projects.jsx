import{useState}from'react'
import{Link,useSearchParams}from'react-router-dom'
import{useApp}from'../context/AppContext'
import ProjectCard from'../components/ProjectCard'
import{FINISHES}from'../data/data'
export default function Projects({favorites}){
const{projects,setCurrent}=useApp(),[sp]=useSearchParams(),[q,setQ]=useState(sp.get('q')||''),[sort,setSort]=useState('recent'),[fin,setFin]=useState(''),[fav,setFav]=useState(!!favorites)
let list=projects.filter(p=>(!favorites||p.fav)&&(!fav||p.fav)&&(!fin||p.s.finish===fin)&&(p.name+p.s.colorName+p.s.color).toLowerCase().includes(q.toLowerCase()))
list=[...list].sort((a,b)=>sort==='name'?a.name.localeCompare(b.name):sort==='color'?a.s.colorName.localeCompare(b.s.colorName):b.ts-a.ts)
return<div className="mx-auto max-w-6xl space-y-6"><h1 className="text-3xl">{favorites?'Favorites':'Projects'}</h1>
<div className="flex flex-wrap gap-3"><input className="inp max-w-xs" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name or color" aria-label="Search"/>
<select className="inp w-auto" value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort"><option value="recent">Recent</option><option value="name">Name</option><option value="color">Color</option></select>
<select className="inp w-auto" value={fin} onChange={e=>setFin(e.target.value)} aria-label="Filter by finish"><option value="">All finishes</option>{FINISHES.map(f=><option key={f}>{f}</option>)}</select>
{!favorites&&<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={fav} onChange={e=>setFav(e.target.checked)}/>Favorites only</label>}</div>
{list.length?<>{[['Your projects',list.filter(p=>!p.sample)],['Demo projects',list.filter(p=>p.sample)]].map(([t,a])=>a.length>0&&<section key={t} className="space-y-3"><h2 className="text-xl">{t}</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{a.map(p=><ProjectCard key={p.id} p={p}/>)}</div></section>)}</>
:<div className="card p-10 text-center"><p>{favorites?'Your favorite designs will appear here.':'No projects match.'}</p><Link to="/visualizer" onClick={()=>setCurrent(null)} className="btn-p mt-4">Start Visualizing</Link></div>}</div>}
