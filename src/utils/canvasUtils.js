const rng=()=>{let s=7;return()=>(s=(s*16807)%2147483647)/2147483647}
export function drawPattern(x,w,h,p){if(p==='none')return;const r=rng(),g=Math.max(24,w/24);x.save();x.strokeStyle='rgba(0,0,0,.2)';x.fillStyle='rgba(0,0,0,.12)';x.lineWidth=Math.max(1,w/600)
const L=(a,b,c,d)=>{x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke()}
if(p==='lines')for(let i=0;i<w;i+=g/2)L(i,0,i,h)
if(p==='grid'){for(let i=0;i<w;i+=g)L(i,0,i,h);for(let i=0;i<h;i+=g)L(0,i,w,i)}
if(p==='geometric')for(let y=0;y<h;y+=g)for(let i=0;i<w;i+=g){x.beginPath();x.moveTo(i+g/2,y);x.lineTo(i+g,y+g/2);x.lineTo(i+g/2,y+g);x.lineTo(i,y+g/2);x.closePath();x.stroke()}
if(p==='concrete')for(let i=0;i<w*h/90;i++){x.fillStyle=`rgba(${r()>.5?255:0},${r()>.5?255:0},${r()>.5?255:0},${r()*.12})`;x.fillRect(r()*w,r()*h,2+r()*3,2+r()*3)}
if(p==='marble')for(let v=0;v<9;v++){x.strokeStyle=v%2?'rgba(255,255,255,.4)':'rgba(0,0,0,.18)';x.lineWidth=1+r()*2;x.beginPath();let px=r()*w,py=0;x.moveTo(px,py);while(py<h){px+=(r()-.5)*g;py+=g/2;x.lineTo(px,py)}x.stroke()}
if(p==='wood')for(let i=0;i<w;i+=g/3){x.beginPath();x.moveTo(i,0);for(let y=0;y<h;y+=40)x.lineTo(i+(r()-.5)*6,y);x.stroke()}
if(p==='floral')for(let y=g;y<h;y+=g*2)for(let i=g;i<w;i+=g*2){for(let k=0;k<5;k++){const a=k*1.2566;x.beginPath();x.arc(i+Math.cos(a)*g/3,y+Math.sin(a)*g/3,g/4,0,7);x.fill()}x.fillStyle='rgba(255,255,255,.35)';x.beginPath();x.arc(i,y,g/6,0,7);x.fill();x.fillStyle='rgba(0,0,0,.12)'}
if(p==='abstract')for(let k=0;k<14;k++){x.beginPath();x.arc(r()*w,r()*h,g*(1+r()*4),r()*6,r()*6+2);x.stroke()}
x.restore()}
export function drawFinish(x,w,h,f){const r=rng();x.save()
const gr=a=>{const g=x.createLinearGradient(0,0,w,h);a.forEach(([o,c])=>g.addColorStop(o,c));x.fillStyle=g;x.fillRect(0,0,w,h)}
if(f==='satin')gr([[0,'rgba(255,255,255,.12)'],[.5,'rgba(255,255,255,0)'],[1,'rgba(255,255,255,.1)']])
if(f==='gloss')gr([[0,'rgba(255,255,255,0)'],[.35,'rgba(255,255,255,.38)'],[.5,'rgba(255,255,255,0)'],[1,'rgba(255,255,255,.15)']])
if(f==='metallic')gr([[0,'rgba(255,255,255,.4)'],[.25,'rgba(0,0,0,.15)'],[.5,'rgba(255,255,255,.35)'],[.75,'rgba(0,0,0,.18)'],[1,'rgba(255,255,255,.3)']])
if(f==='textured'||f==='cement'){const a=f==='cement'?.18:.09;for(let i=0;i<w*h/60;i++){x.fillStyle=`rgba(${r()>.5?255:0},${r()>.5?255:0},${r()>.5?255:0},${r()*a})`;x.fillRect(r()*w,r()*h,2,2)}}
x.restore()}
export function drawLight(x,w,h,l,k){const a=k/100;x.save()
const f=(c,al,m)=>{x.globalCompositeOperation=m;x.fillStyle=c.replace('A',al);x.fillRect(0,0,w,h)}
if(l==='daylight')f('rgba(255,250,230,A)',a*.25,'soft-light')
if(l==='warm evening')f('rgba(255,140,40,A)',a*.4,'overlay')
if(l==='cool light')f('rgba(80,140,255,A)',a*.35,'overlay')
if(l==='soft light')f('rgba(255,255,255,A)',a*.3,'soft-light')
if(l==='dramatic'){const g=x.createRadialGradient(w/2,h/2,Math.min(w,h)*.2,w/2,h/2,Math.max(w,h)*.75);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,`rgba(0,0,0,${a*.8})`);x.fillStyle=g;x.fillRect(0,0,w,h)}
x.restore()}
export const hexToRgb=h=>{const m=/^#?([\da-f]{6})$/i.exec(h);if(!m)return null;const n=parseInt(m[1],16);return[n>>16,(n>>8)&255,n&255]}
export function loadScaled(file,max=1600){return new Promise((res,rej)=>{const u=URL.createObjectURL(file),i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.85))};i.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('Could not read image'))};i.src=u})}
