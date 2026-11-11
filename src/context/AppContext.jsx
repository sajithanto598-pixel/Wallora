import{createContext,useCallback,useContext,useEffect,useState}from'react'
import{SAMPLES}from'../data/sampleProjects'
const Ctx=createContext(null);export const useApp=()=>useContext(Ctx)
const load=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch{return d}}
export function AppProvider({children}){
const[projects,setProjects]=useState(()=>load('wallora.projects',SAMPLES).map(p=>p.sample?{...(SAMPLES.find(x=>x.id===p.id)||p),fav:p.fav}:p))
const[prefs,setPrefs]=useState(()=>load('wallora.prefs',{theme:'system',opacity:85,intensity:40}))
const[current,syncCurrent]=useState(null),[nonce,setNonce]=useState(0),setCurrent=p=>{syncCurrent(p);setNonce(n=>n+1)}
const[toasts,setToasts]=useState([])
const toast=useCallback((msg,type='ok')=>{const id=Math.random();setToasts(t=>[...t,{id,msg,type}]);setTimeout(()=>setToasts(t=>t.filter(x=>x.id!==id)),3500)},[])
const persist=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{toast('Storage is full or unavailable. Delete projects to free space.','err');return false}}
const commit=next=>{const prev=projects;setProjects(next);if(!persist('wallora.projects',next)){setProjects(prev);return false}return true}
const save=p=>{const i=projects.findIndex(x=>x.id===p.id);if(commit(i<0?[p,...projects]:projects.map(x=>x.id===p.id?p:x)))toast('Project saved')}
const del=id=>{if(commit(projects.filter(p=>p.id!==id)))toast('Project deleted')}
const toggleFav=id=>commit(projects.map(p=>p.id===id?{...p,fav:!p.fav}:p))
const clearAll=()=>{if(commit([]))toast('All projects cleared')}
const updatePrefs=p=>{const n={...prefs,...p};setPrefs(n);persist('wallora.prefs',n)}
useEffect(()=>{const mq=matchMedia('(prefers-color-scheme: dark)'),f=()=>document.documentElement.classList.toggle('dark',prefs.theme==='dark'||(prefs.theme==='system'&&mq.matches));f();mq.addEventListener('change',f);return()=>mq.removeEventListener('change',f)},[prefs.theme])
return<Ctx.Provider value={{projects,save,del,toggleFav,clearAll,prefs,updatePrefs,current,setCurrent,syncCurrent,nonce,toast}}>{children}
<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2" role="status" aria-live="polite">{toasts.map(t=><div key={t.id} className={`fade rounded-xl px-4 py-2 text-sm text-white shadow-lg ${t.type==='err'?'bg-red-700':'bg-stone-900'}`}>{t.msg}</div>)}</div></Ctx.Provider>}
