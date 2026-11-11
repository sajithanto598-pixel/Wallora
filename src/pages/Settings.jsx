import{useApp}from'../context/AppContext'
export default function Settings(){const{prefs,updatePrefs,clearAll,projects}=useApp()
const S=({t,children})=><section className="card space-y-3 p-6"><h2 className="text-xl">{t}</h2>{children}</section>
return<div className="mx-auto max-w-2xl space-y-5"><h1 className="text-3xl">Settings</h1>
<S t="Appearance"><div className="flex gap-4">{['light','dark','system'].map(t=><label key={t} className="flex items-center gap-2 capitalize"><input type="radio" name="theme" checked={prefs.theme===t} onChange={()=>updatePrefs({theme:t})}/>{t}</label>)}</div></S>
<S t="Visualization"><label className="block text-sm">Default opacity: {prefs.opacity}%<input type="range" className="w-full" min="0" max="100" value={prefs.opacity} onChange={e=>updatePrefs({opacity:+e.target.value})}/></label>
<label className="block text-sm">Default lighting intensity: {prefs.intensity}<input type="range" className="w-full" min="0" max="100" value={prefs.intensity} onChange={e=>updatePrefs({intensity:+e.target.value})}/></label></S>
<S t="Storage"><p className="text-sm text-stone-500">{projects.length} projects stored in this browser.</p><button className="btn-s" onClick={()=>window.confirm('Delete all local projects?')&&clearAll()}>Clear local projects</button></S>
<S t="About"><p className="text-sm">WALLORA, version 1.0.0. Runs entirely in your browser; nothing is uploaded.</p></S></div>}
