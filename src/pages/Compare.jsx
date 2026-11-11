import{useState}from'react'
import{useApp}from'../context/AppContext'
import{Thumb}from'../components/ProjectCard'
function Side({label,projects,id,setId}){const p=projects.find(x=>x.id===id)
return<div className="card space-y-3 p-4"><label className="text-sm font-medium">{label}<select className="inp mt-1" value={id} onChange={e=>setId(e.target.value)}>{projects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
{p&&<><Thumb p={p} className="h-64 w-full rounded-xl"/><dl className="grid grid-cols-2 gap-2 text-sm"><dt className="text-stone-500">Color</dt><dd>{p.s.colorName} ({p.s.color})</dd><dt className="text-stone-500">Finish</dt><dd className="capitalize">{p.s.finish}</dd><dt className="text-stone-500">Pattern</dt><dd className="capitalize">{p.s.pattern}</dd><dt className="text-stone-500">Lighting</dt><dd className="capitalize">{p.s.light}</dd></dl></>}</div>}
export default function Compare(){const{projects}=useApp(),[a,setA]=useState(projects[0]?.id),[b,setB]=useState(projects[1]?.id||projects[0]?.id)
if(projects.length<1)return<p className="text-stone-500">Save at least one project to compare designs.</p>
return<div className="mx-auto max-w-6xl space-y-6"><h1 className="text-3xl">Compare designs</h1><div className="grid gap-5 md:grid-cols-2"><Side label="Design A" projects={projects} id={a} setId={setA}/><Side label="Design B" projects={projects} id={b} setId={setB}/></div></div>}
