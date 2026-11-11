import{Link}from'react-router-dom'
import{Upload}from'lucide-react'
import{useApp}from'../context/AppContext'
import ProjectCard,{Thumb}from'../components/ProjectCard'
import{INSPIRATION}from'../data/sampleProjects'
export default function Dashboard(){
const{projects,setCurrent}=useApp(),h=new Date().getHours(),g=h<12?'morning':h<18?'afternoon':'evening',favs=projects.filter(p=>p.fav)
return<div className="mx-auto max-w-6xl space-y-10">
<h1 className="text-3xl">Good {g}, Sajith</h1>
<section className="card flex flex-wrap items-center justify-between gap-4 p-8"><div><h2 className="text-2xl">Start a New Visualization</h2><p className="text-sm text-stone-500">Upload a room photo and paint your wall in any color.</p></div><Link to="/visualizer" onClick={()=>setCurrent(null)} className="btn-p"><Upload size={16}/>Upload Room</Link></section>
<section><h2 className="mb-4 text-2xl">Recent Projects</h2>{projects.some(p=>!p.sample)?<div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{projects.filter(p=>!p.sample).sort((a,b)=>b.ts-a.ts).slice(0,6).map(p=><ProjectCard key={p.id} p={p}/>)}</div>:<p className="text-stone-500">No saved projects yet. Upload a room to create one.</p>}</section>
<section><h2 className="mb-4 text-2xl">Demo projects</h2><div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{projects.filter(p=>p.sample).map(p=><ProjectCard key={p.id} p={p}/>)}</div></section>
<section><h2 className="mb-4 text-2xl">Favorites</h2>{favs.length?<div className="flex gap-4 overflow-x-auto pb-2">{favs.map(p=><Link key={p.id} to="/visualizer" onClick={()=>setCurrent(p)} className="card group w-60 shrink-0 overflow-hidden"><Thumb p={p} className="aspect-[4/3] w-full"/><p className="p-3 text-sm">{p.name}</p></Link>)}</div>:<p className="text-stone-500">Your favorite designs will appear here.</p>}</section>
<section><h2 className="mb-4 text-2xl">Design inspiration</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{INSPIRATION.map(i=><figure key={i.id} className="group overflow-hidden rounded-2xl border"><Thumb p={i} className="aspect-[4/3] w-full"/><figcaption className="p-2 text-xs">{i.name}</figcaption></figure>)}</div></section></div>}
