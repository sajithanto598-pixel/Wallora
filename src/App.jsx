import{Link,NavLink,Outlet,Route,Routes,useLocation,useNavigate}from'react-router-dom'
import{useState}from'react'
import{GitCompare,Heart,Images,LayoutDashboard,Menu,Paintbrush,Search,Settings as Cog,X}from'lucide-react'
import{useApp}from'./context/AppContext'
import Landing from'./pages/Landing'
import Dashboard from'./pages/Dashboard'
import Visualizer from'./pages/Visualizer'
import Projects from'./pages/Projects'
import Compare from'./pages/Compare'
import Settings from'./pages/Settings'
const NAV=[['/dashboard','Dashboard',LayoutDashboard],['/visualizer','Visualizer',Paintbrush],['/projects','Projects',Images],['/favorites','Favorites',Heart],['/compare','Compare',GitCompare],['/settings','Settings',Cog]]
export const Logo=()=><Link to="/" className="font-serif text-xl font-semibold tracking-[.2em]" aria-label="WALLORA home">WALLORA</Link>
function Shell(){
const[open,setOpen]=useState(false),loc=useLocation(),nav=useNavigate(),{prefs}=useApp()
return<div className="min-h-screen">
<header className="sticky top-0 z-30 flex items-center gap-3 border-b border-stone-200 bg-stone-50/90 px-4 py-3 backdrop-blur dark:border-stone-700 dark:bg-stone-900/90">
<button className="btn-s lg:hidden" onClick={()=>setOpen(!open)} aria-label="Toggle navigation" title="Menu">{open?<X size={18}/>:<Menu size={18}/>}</button><Logo/>
<form className="relative ml-auto w-full max-w-xs" role="search" onSubmit={e=>{e.preventDefault();nav('/projects?q='+encodeURIComponent(new FormData(e.target).get('q')))}}>
<Search size={16} className="absolute left-3 top-2.5 text-stone-400"/><input name="q" className="inp pl-9" placeholder="Search projects" aria-label="Search projects"/></form>
<Link to="/settings" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-stone-900 text-sm font-semibold text-white dark:bg-stone-100 dark:text-stone-900" title="Settings" aria-label="Account settings">S</Link></header>
<div className="flex">
<nav className={`${open?'block':'hidden'} fixed inset-x-0 top-[61px] z-20 border-b bg-stone-50 p-3 dark:bg-stone-900 lg:sticky lg:top-[61px] lg:block lg:h-[calc(100vh-61px)] lg:w-56 lg:shrink-0 lg:border-b-0 lg:border-r lg:border-stone-200 lg:dark:border-stone-700`} aria-label="Main">
{NAV.map(([to,l,I])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={({isActive})=>`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${isActive?'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900':'hover:bg-stone-200/60 dark:hover:bg-stone-800'}`}><I size={18}/>{l}</NavLink>)}</nav>
<main key={loc.pathname} data-p={prefs.theme} className="fade min-w-0 flex-1 p-4 md:p-8"><Outlet/></main></div></div>}
export default function App(){return<Routes><Route path="/" element={<Landing/>}/><Route element={<Shell/>}>
<Route path="/dashboard" element={<Dashboard/>}/><Route path="/visualizer" element={<VisualizerRoute/>}/><Route path="/projects" element={<Projects/>}/>
<Route path="/favorites" element={<Projects favorites/>}/><Route path="/compare" element={<Compare/>}/><Route path="/settings" element={<Settings/>}/></Route>
<Route path="*" element={<Landing/>}/></Routes>}
function VisualizerRoute(){const{nonce}=useApp();return<Visualizer key={nonce}/>}
