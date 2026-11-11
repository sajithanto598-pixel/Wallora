import{useState}from'react'
import{Heart,Trash2}from'lucide-react'
import{useNavigate}from'react-router-dom'
import{useApp}from'../context/AppContext'
export function Thumb({p,className=''}){
const[bad,setBad]=useState(false),src=p.thumb||p.image
return<div className={`overflow-hidden bg-stone-200 dark:bg-stone-700 ${className}`}>
{src&&!bad?<img src={src} srcSet={p.thumb?undefined:p.srcSet} sizes="(min-width:1024px) 33vw, 100vw" alt={p.name} loading="lazy" decoding="async" onError={()=>setBad(true)} className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"/>
:<div role="img" aria-label={`${p.name} placeholder`} className="h-full w-full" style={{background:`linear-gradient(120deg,#e7e2d8 45%,${p.s?.color||'#d9d2c3'} 45%)`}}/>}</div>}
export default function ProjectCard({p}){
const{setCurrent,toggleFav,del}=useApp(),nav=useNavigate()
return<article className="group card overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md">
<Thumb p={p} className="aspect-[4/3] w-full"/>
<div className="space-y-2 p-4"><div className="flex items-start justify-between gap-2"><h3 className="text-lg leading-tight">{p.name}{p.sample&&<span className="ml-2 rounded bg-stone-200 px-1.5 py-0.5 align-middle font-sans text-[10px] dark:bg-stone-700">Demo</span>}</h3>
<button onClick={()=>toggleFav(p.id)} aria-pressed={!!p.fav} aria-label={p.fav?'Remove favorite':'Add favorite'} title="Favorite"><Heart size={18} className={p.fav?'fill-red-500 text-red-500':''}/></button></div>
<p className="flex items-center gap-2 text-xs text-stone-500"><span className="h-3 w-3 rounded-full border" style={{background:p.s.color}}/>{p.s.colorName} • {p.s.finish} • {new Date(p.ts).toLocaleDateString()}</p>
<div className="flex gap-2"><button className="btn-p flex-1" onClick={()=>{setCurrent(p);nav('/visualizer')}}>Open</button>
<button className="btn-s" onClick={()=>window.confirm(`Delete "${p.name}"?`)&&del(p.id)} aria-label={`Delete ${p.name}`} title="Delete"><Trash2 size={16}/></button></div></div></article>}
