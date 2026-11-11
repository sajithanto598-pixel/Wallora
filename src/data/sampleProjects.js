// Demo projects. Photos: Unsplash (free under the Unsplash License). Replace ids/URLs here to change them.
const photo=(id,w)=>`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=70&w=${w}&h=${Math.round(w*.75)}`
const srcSet=id=>[480,800,1200].map(w=>`${photo(id,w)} ${w}w`).join(', ')
const base={color:'#D9C7A7',colorName:'Sand',finish:'matte',pattern:'none',light:'daylight',intensity:40,opacity:85}
const P={living:'1771888703723-01d85da1dae1',bedroom:'1750420556288-d0e32a6f517b',coastal:'1762529716272-b316f61502e7',wheat:'1767720580810-58be50f89bf8'}
const d=(name,pid,color,colorName,finish,pattern,light,ago)=>({id:'sample-'+name,name,image:photo(P[pid],800),srcSet:srcSet(P[pid]),thumb:null,mask:null,sample:true,fav:/Sage|Warm/.test(name),ts:Date.now()-ago*864e5,s:{...base,color,colorName,finish,pattern,light}})
export const SAMPLES=[d('Warm Minimal Living Room','living','#D9C7A7','Sand','matte','none','warm evening',1),d('Modern Sage Bedroom','bedroom','#A7B59E','Sage','satin','none','soft light',3),d('Urban Concrete Accent','coastal','#9EA1A2','Ash Grey','cement','concrete','dramatic',5),d('Soft Beige Workspace','wheat','#DDD0BC','Oatmeal','matte','lines','daylight',8)]
export const INSPIRATION=SAMPLES.map((p,i)=>({id:'insp-'+i,name:['Earth tones','Soft greens','Neutral calm','Wheat palette'][i],image:p.image,srcSet:p.srcSet}))
