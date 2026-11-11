import{useCallback,useEffect,useRef,useState}from'react'
import{Download,Eraser,Brush,Maximize,Redo2,RotateCcw,Save,SplitSquareHorizontal,Trash2,Undo2,Upload,ZoomIn,ZoomOut}from'lucide-react'
import{useApp}from'../context/AppContext'
import{COLORS,DEFAULT_S,FINISHES,LIGHTS,PATTERNS}from'../data/data'
import{drawFinish,drawLight,drawPattern,hexToRgb,loadScaled}from'../utils/canvasUtils'
const TABS=['Room','Selection','Colors','Finishes','Patterns','Lighting']
const OK=['image/jpeg','image/png','image/webp']
const Chip=({on,...p})=><button aria-pressed={on} className={`rounded-lg border px-3 py-1.5 text-sm capitalize ${on?'border-stone-900 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900':'hover:bg-stone-100 dark:hover:bg-stone-700'}`} {...p}/>
const Icon=({t,children,...p})=><button className="btn-s px-2.5" title={t} aria-label={t} {...p}>{children}</button>
const img=src=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('Image failed to load'));i.src=src})
export default function Visualizer(){
const{current,syncCurrent,save,toast,prefs}=useApp()
const[src,setSrc]=useState(current&&!current.sample?current.image:null),[ready,setReady]=useState(false)
const[s,setS]=useState(current?.s||{...DEFAULT_S,opacity:prefs.opacity,intensity:prefs.intensity})
const[tab,setTab]=useState(current&&!current.sample&&current.image?'Selection':'Room'),[tool,setTool]=useState('brush'),[size,setSize]=useState(40),[zoom,setZoom]=useState(100)
const[cmp,setCmp]=useState(null),[after,setAfter]=useState(''),[pos,setPos]=useState(50),[hi,setHi]=useState(0),[tick,setTick]=useState(0),[bs,setBs]=useState({w:0,h:0})
const[name,setName]=useState(current?(current.sample?current.name+' (copy)':current.name):''),[drag,setDrag]=useState(false),[hex,setHex]=useState(s.color),[showMask,setShowMask]=useState(true)
const cv=useRef(),mk=useRef(),im=useRef(),hist=useRef([]),hiRef=useRef(0),wrap=useRef(),box=useRef(),draw=useRef(null),init=useRef(current?.mask),cache=useRef({k:''}),tmp=useRef()
const push=n=>{const m=mk.current.toDataURL(),last=hist.current[hiRef.current];if(last&&last.m===m&&JSON.stringify(last.s)===JSON.stringify(n))return
hist.current=hist.current.slice(0,hiRef.current+1).concat({m,s:n}).slice(-50);hiRef.current=hist.current.length-1;setHi(hiRef.current)}
const upd=p=>{const n={...s,...p};setS(n);push(n)}
useEffect(()=>{const ro=new ResizeObserver(([e])=>setBs({w:e.contentRect.width,h:e.contentRect.height}));ro.observe(box.current);return()=>ro.disconnect()},[])
const render=useCallback((overlay=true)=>{const c=cv.current;if(!c||!im.current||!mk.current)return;const w=c.width,h=c.height,x=c.getContext('2d')
x.globalCompositeOperation='source-over';x.globalAlpha=1;x.drawImage(im.current,0,0)
const k=[s.color,s.pattern,s.finish,w,h].join()
if(cache.current.k!==k){const L=document.createElement('canvas');L.width=w;L.height=h;const l=L.getContext('2d');l.fillStyle=s.color;l.fillRect(0,0,w,h);drawPattern(l,w,h,s.pattern);drawFinish(l,w,h,s.finish);cache.current={k,c:L}}
const T=tmp.current||(tmp.current=document.createElement('canvas'));if(T.width!==w||T.height!==h){T.width=w;T.height=h}
const t=T.getContext('2d');t.globalCompositeOperation='copy';t.drawImage(cache.current.c,0,0);t.globalCompositeOperation='destination-in';t.drawImage(mk.current,0,0)
x.globalCompositeOperation='multiply';x.globalAlpha=s.opacity/100;x.drawImage(T,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over'
drawLight(x,w,h,s.light,s.intensity)
if(overlay&&showMask){x.globalAlpha=.4;x.drawImage(mk.current,0,0);x.globalAlpha=1}},[s,showMask])
useEffect(()=>{if(ready)render(!cmp)},[render,ready,tick,cmp])
const flat=useCallback((w=0,type='image/jpeg')=>{render(false);const c=cv.current;let o=c;if(w){o=document.createElement('canvas');o.width=w;o.height=Math.round(c.height*w/c.width);o.getContext('2d').drawImage(c,0,0,o.width,o.height)}const u=o.toDataURL(type,.85);render(!cmp);return u},[render,cmp])
useEffect(()=>{if(cmp&&ready)setAfter(flat(0,'image/png'))},[cmp,ready,s,tick,flat])
useEffect(()=>{setReady(false);if(!src)return;let dead=false
img(src).then(async i=>{if(dead)return;im.current=i;cv.current.width=i.width;cv.current.height=i.height;cache.current={k:''}
const m=document.createElement('canvas');m.width=i.width;m.height=i.height;mk.current=m
if(init.current){try{m.getContext('2d').drawImage(await img(init.current),0,0)}catch{toast('Saved mask could not be restored','err')}init.current=null}
hist.current=[{m:m.toDataURL(),s}];hiRef.current=0;setHi(0);setReady(true);setTick(t=>t+1)}).catch(e=>toast(e.message,'err'))
return()=>{dead=true}},[src])// eslint-disable-line react-hooks/exhaustive-deps
const restore=async i=>{const h=hist.current[i],m=mk.current.getContext('2d');const im2=await img(h.m);m.globalCompositeOperation='source-over';m.clearRect(0,0,mk.current.width,mk.current.height);m.drawImage(im2,0,0);hiRef.current=i;setHi(i);setS(h.s);setHex(h.s.color);setTick(t=>t+1)}
const upload=async f=>{if(!f)return;if(!OK.includes(f.type))return toast('Unsupported file. Use JPG, PNG or WEBP.','err')
if(f.size>25e6)return toast('Image is over 25 MB. Choose a smaller photo.','err')
try{const u=await loadScaled(f);init.current=null;setCmp(null);setSrc(u);setTab('Selection')}catch(e){toast(e.message,'err')}}
const pt=e=>{const r=cv.current.getBoundingClientRect();return[(e.clientX-r.left)*cv.current.width/r.width,(e.clientY-r.top)*cv.current.height/r.height,cv.current.width/r.width]}
const paint=tab==='Selection'&&ready&&!cmp
const stroke=e=>{const[x,y,k]=pt(e),m=mk.current.getContext('2d'),a=draw.current;m.globalCompositeOperation=tool==='eraser'?'destination-out':'source-over';m.strokeStyle='#ff3b30';m.lineWidth=size*k;m.lineCap=m.lineJoin='round';m.beginPath();m.moveTo(a[0],a[1]);m.lineTo(x,y);m.stroke();draw.current=[x,y];render(true)}
const down=e=>{if(!paint||e.button>0)return;e.currentTarget.setPointerCapture(e.pointerId);const[x,y]=pt(e);draw.current=[x,y];stroke(e)}
const move=e=>{if(draw.current)stroke(e)}
const up=()=>{if(draw.current){draw.current=null;push(s)}}
const wipe=()=>{const m=mk.current;m.getContext('2d').clearRect(0,0,m.width,m.height)}
const clear=()=>{wipe();push(s);setTick(t=>t+1)}
const reset=()=>{if(!ready)return;wipe();const n={...DEFAULT_S,opacity:prefs.opacity,intensity:prefs.intensity};setS(n);setHex(n.color);push(n);setTick(t=>t+1)}
const doSave=()=>{if(!src||!ready)return toast('Upload a room image first','err');if(!name.trim())return toast('Enter a project name first','err')
const own=current&&!current.sample,p={id:own?current.id:'p'+Date.now(),name:name.trim(),image:src,mask:mk.current.toDataURL(),thumb:flat(480),s,ts:Date.now(),fav:own?!!current.fav:false};save(p);syncCurrent(p)}
const doExport=()=>{if(!src||!ready)return toast('Upload a room image first','err');try{render(false);cv.current.toBlob(b=>{render(!cmp);if(!b)return toast('Export failed','err');const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=`wallora-${(name.trim()||'design').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'design'}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1e3)},'image/png')}catch{toast('Export failed','err')}}
const toggleCmp=m=>{if(!ready)return toast('Upload a room image first','err');setCmp(cmp===m?null:m)}
const fs=()=>{document.fullscreenElement?document.exitFullscreen():wrap.current.requestFullscreen?.().catch(()=>toast('Fullscreen not available','err'))}
const slider=(k,l)=><label className="block text-sm">{l}: {s[k]}<input type="range" className="w-full" min="0" max="100" value={s[k]} onChange={e=>setS({...s,[k]:+e.target.value})} onPointerUp={()=>push(s)} onKeyUp={()=>push(s)}/></label>
const rgb=hexToRgb(s.color),pick=(c,n)=>{setHex(c);upd({color:c,colorName:n})}
const fit=ready&&im.current&&bs.w?Math.min(bs.w-16,(bs.h-16)*im.current.width/im.current.height):0,cw=Math.max(40,fit*zoom/100),sideW=Math.max(80,(bs.w-16)*zoom/100)
const panel={
Room:<div className="space-y-3"><label onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)} onDrop={e=>{e.preventDefault();setDrag(false);upload(e.dataTransfer.files[0])}} className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-6 text-center text-sm transition ${drag?'border-stone-900 bg-stone-100 dark:bg-stone-700':'border-stone-300'}`}><Upload/>Drop a room photo or click to browse<span className="text-xs text-stone-500">JPG, PNG or WEBP</span><input type="file" accept={OK.join()} className="sr-only" onChange={e=>{upload(e.target.files[0]);e.target.value=''}}/></label></div>,
Selection:<div className="space-y-3"><h3 className="text-lg">Manual Wall Selection</h3><p className="text-xs text-stone-500">Paint over the wall. The color is applied only to the painted area.</p>
<div className="flex gap-2"><Chip on={tool==='brush'} onClick={()=>setTool('brush')}><Brush size={14} className="mr-1 inline"/>Brush</Chip><Chip on={tool==='eraser'} onClick={()=>setTool('eraser')}><Eraser size={14} className="mr-1 inline"/>Eraser</Chip></div>
<label className="block text-sm">Brush size: {size}px<input type="range" className="w-full" min="5" max="150" value={size} onChange={e=>setSize(+e.target.value)}/></label>
<label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showMask} onChange={e=>setShowMask(e.target.checked)}/>Show selection overlay</label>
<button className="btn-s w-full" onClick={clear} disabled={!ready}><Trash2 size={16}/>Clear selection</button></div>,
Colors:<div className="space-y-4">{[...new Set(COLORS.map(c=>c.cat))].map(cat=><div key={cat}><h3 className="mb-1 text-sm font-medium">{cat}</h3><div className="flex flex-wrap gap-2">{COLORS.filter(c=>c.cat===cat).map(c=><button key={c.name} title={`${c.name} ${c.hex}`} aria-label={c.name} aria-pressed={s.color===c.hex} onClick={()=>pick(c.hex,c.name)} className={`h-9 w-9 rounded-full border-2 ${s.color===c.hex?'border-stone-900 ring-2 ring-offset-2 dark:border-white':'border-stone-300'}`} style={{background:c.hex}}/>)}</div></div>)}
<div className="space-y-2 border-t pt-3"><h3 className="text-sm font-medium">Custom color</h3><div className="flex gap-2"><input type="color" aria-label="Pick color" value={/^#[\da-f]{6}$/i.test(hex)?hex:'#ffffff'} onChange={e=>setHex(e.target.value)} className="h-10 w-12 rounded"/><input className="inp" value={hex} onChange={e=>setHex(e.target.value)} aria-label="HEX value" maxLength={7}/></div>
<button className="btn-s w-full" onClick={()=>hexToRgb(hex)?pick(hex.startsWith('#')?hex.toUpperCase():'#'+hex.toUpperCase(),'Custom'):toast('Enter a valid HEX like #A1B2C3','err')}>Apply color</button></div></div>,
Finishes:<div className="flex flex-wrap gap-2">{FINISHES.map(f=><Chip key={f} on={s.finish===f} onClick={()=>upd({finish:f})}>{f}</Chip>)}</div>,
Patterns:<div className="flex flex-wrap gap-2">{PATTERNS.map(p=><Chip key={p} on={s.pattern===p} onClick={()=>upd({pattern:p})}>{p==='none'?'Plain':p}</Chip>)}</div>,
Lighting:<div className="space-y-3"><div className="flex flex-wrap gap-2">{LIGHTS.map(l=><Chip key={l} on={s.light===l} onClick={()=>upd({light:l})}>{l}</Chip>)}</div>{slider('intensity','Lighting intensity')}</div>}
return<div ref={wrap} className="mx-auto flex max-w-[1500px] flex-col gap-4 bg-stone-50 dark:bg-stone-900 xl:flex-row">
<aside className="card w-full shrink-0 p-4 xl:w-72" aria-label="Design tools"><div className="mb-4 flex flex-wrap gap-1" role="tablist">{TABS.map(t=><Chip key={t} role="tab" on={tab===t} onClick={()=>setTab(t)}>{t}</Chip>)}</div><div className="max-h-[40vh] overflow-y-auto pr-1 xl:max-h-[60vh]">{panel[tab]}</div></aside>
<section className="min-w-0 flex-1 space-y-3" aria-label="Canvas">
<div className="flex flex-wrap items-center gap-2"><Icon t="Zoom out" onClick={()=>setZoom(z=>Math.max(50,z-25))}><ZoomOut size={16}/></Icon><span className="w-12 text-center text-sm" aria-live="polite">{zoom}%</span><Icon t="Zoom in" onClick={()=>setZoom(z=>Math.min(300,z+25))}><ZoomIn size={16}/></Icon><button className="btn-s" onClick={()=>setZoom(100)}>Reset zoom</button>
<div className="ml-auto flex gap-2"><Chip on={cmp==='slider'} onClick={()=>toggleCmp('slider')}>Compare slider</Chip><Chip on={cmp==='side'} onClick={()=>toggleCmp('side')}><SplitSquareHorizontal size={14} className="mr-1 inline"/>Side by side</Chip></div></div>
<div ref={box} className="card relative flex h-[60vh] overflow-auto bg-stone-200 dark:bg-stone-800 xl:h-[72vh]">
{!ready&&<div className="m-auto p-8 text-center"><Upload className="mx-auto mb-2"/><p>{src?'Loading image...':'Upload a room photo to begin'}</p>{!src&&<button className="btn-p mt-3" onClick={()=>setTab('Room')}>Choose in Room tab</button>}</div>}
<canvas ref={cv} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} aria-label="Room visualization canvas" style={{width:cw,margin:'auto',flexShrink:0,touchAction:paint?'none':'auto',cursor:paint?'crosshair':'default',display:ready&&!cmp?'block':'none'}}/>
{ready&&cmp==='slider'&&<div className="relative m-auto shrink-0 select-none" style={{width:cw}}><img src={after} alt="After" className="block w-full"/><div className="absolute inset-0" style={{clipPath:`inset(0 ${100-pos}% 0 0)`}}><img src={src} alt="Before" className="block w-full"/></div><div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow" style={{left:`${pos}%`}}/><input type="range" min="0" max="100" value={pos} onChange={e=>setPos(+e.target.value)} aria-label="Before and after divider" className="absolute bottom-3 left-4 w-[calc(100%-2rem)]"/></div>}
{ready&&cmp==='side'&&<div className="m-auto grid shrink-0 grid-cols-2 gap-2 p-2" style={{width:sideW}}>{[['Before',src],['After',after]].map(([l,u])=><figure key={l}><figcaption className="mb-1 text-xs font-medium">{l.toUpperCase()}</figcaption><img src={u} alt={l} className="w-full rounded-lg"/></figure>)}</div>}</div></section>
<aside className="card w-full shrink-0 space-y-4 p-4 xl:w-72" aria-label="Design details">
<div className="flex flex-wrap gap-2"><Icon t="Undo" onClick={()=>restore(hi-1)} disabled={hi<1}><Undo2 size={16}/></Icon><Icon t="Redo" onClick={()=>restore(hi+1)} disabled={hi>=hist.current.length-1}><Redo2 size={16}/></Icon><Icon t="Reset" onClick={reset}><RotateCcw size={16}/></Icon><Icon t="Fullscreen" onClick={fs}><Maximize size={16}/></Icon></div>
<div className="flex items-center gap-3"><span className="h-12 w-12 rounded-xl border" style={{background:s.color}}/><div><p className="font-medium">{s.colorName}</p><p className="text-xs text-stone-500">{s.color}{rgb&&` , rgb(${rgb.join(', ')})`}</p></div></div>
<dl className="grid grid-cols-2 gap-1 text-sm"><dt className="text-stone-500">Finish</dt><dd className="capitalize">{s.finish}</dd><dt className="text-stone-500">Pattern</dt><dd className="capitalize">{s.pattern}</dd><dt className="text-stone-500">Lighting</dt><dd className="capitalize">{s.light}</dd></dl>
{slider('opacity','Wall overlay opacity (%)')}
<label className="block text-sm">Project name<input className="inp mt-1" value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Sage Bedroom"/></label>
<div className="grid gap-2"><button className="btn-p" onClick={doSave}><Save size={16}/>Save project</button><button className="btn-s" onClick={doExport}><Download size={16}/>Export Design</button></div></aside></div>}
