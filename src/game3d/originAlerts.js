import * as THREE from 'three';
import { PREMIUM_FAMILIES } from './artDirection.js';
import { VARIANTS } from '../training/dodge/projectiles.js';

export const ORIGIN_ALERT_LIMIT=4;
const WIDTH=104,HEIGHT=30,GAP=8;
const identities={arcane_bolt:['➤','Projétil'],heavy_lance:['◇','Lança'],hook_linear:['⌁','Gancho'],sun_beam:['═','Feixe'],artillery:['◎','Área']};
const colors=Object.fromEntries(Object.values(PREMIUM_FAMILIES).map(f=>[f.variant,f.color]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

/** Presentation-only projection. It neither classifies hits nor changes warnings. */
export function layoutOriginAlerts(projectiles,camera,{width,height}){
 if(!camera||![width,height].every(Number.isFinite)||width<200||height<240||!Array.isArray(projectiles))return {alerts:[],hiddenCount:0};
 const minX=WIDTH/2+12,maxX=width-minX,minY=Math.min(Math.max(120,height*.2),height*.4),maxY=Math.max(minY,height-Math.min(150,height*.25)),cx=width/2,cy=height/2,point=new THREE.Vector3(),view=new THREE.Vector3(),candidates=[];
 for(const p of projectiles.slice(0,20)){
  if(p.phase!=='warning'||typeof p.id!=='string'||!Object.hasOwn(VARIANTS,p.variant)||![p.caster?.x,p.caster?.z].every(Number.isFinite))continue;
  point.set(p.caster.x,1.5,p.caster.z);view.copy(point).applyMatrix4(camera.matrixWorldInverse);point.project(camera);
  if(![point.x,point.y].every(Number.isFinite))continue;
  const behind=Boolean(camera.isPerspectiveCamera&&view.z>=0);let x=behind?-point.x:point.x,y=behind?point.y:-point.y;
  if(!behind&&Math.abs(x)<=.92&&Math.abs(y)<=.85)continue;
  if(Math.abs(x)+Math.abs(y)<1e-8){x=0;y=1;}
  const dx=x*width/2,dy=y*height/2,tx=Math.abs(dx)>1e-8?(dx>0?maxX-cx:minX-cx)/dx:Infinity,ty=Math.abs(dy)>1e-8?(dy>0?maxY-cy:minY-cy)/dy:Infinity,t=Math.min(tx,ty);
  candidates.push({id:p.id,variant:p.variant,x:cx+dx*t,y:cy+dy*t,edge:tx<=ty?(dx>0?'right':'left'):(dy>0?'bottom':'top'),targetX:cx+dx,targetY:cy+dy,remaining:Number.isFinite(p.windup-p.age)?Math.max(0,p.windup-p.age):Infinity});
 }
 candidates.sort((a,b)=>a.remaining-b.remaining||a.id.localeCompare(b.id));
 const alerts=[];
 for(const candidate of candidates){
  if(alerts.length===ORIGIN_ALERT_LIMIT)break;
  const vertical=['left','right'].includes(candidate.edge),step=(vertical?HEIGHT:WIDTH)+GAP;
  for(const offset of [0,-1,1,-2,2,-3,3,-4,4]){
   const x=clamp(candidate.x+(vertical?0:offset*step),minX,maxX),y=clamp(candidate.y+(vertical?offset*step:0),minY,maxY);
   if(alerts.some(a=>Math.abs(a.x-x)<WIDTH+GAP-1e-6&&Math.abs(a.y-y)<HEIGHT+GAP-1e-6))continue;
   alerts.push({...candidate,x,y,angle:Math.atan2(candidate.targetY-y,candidate.targetX-x)+Math.PI/2});break;
  }
 }
 return {alerts,hiddenCount:candidates.length-alerts.length};
}

/** Four reusable, upright badges. Their small arrow alone rotates toward the caster. */
export function createOriginAlerts(container,camera){
 const doc=container?.ownerDocument;if(!doc)return {sync(){},dispose(){}};
 const root=doc.createElement('div');root.className='dodge-origin-alerts';root.setAttribute('aria-hidden','true');container.append(root);
 const slots=Array.from({length:ORIGIN_ALERT_LIMIT},()=>{
  const badge=doc.createElement('span'),pointer=doc.createElement('span'),symbol=doc.createElement('span'),label=doc.createElement('span');badge.className='dodge-origin-alert';pointer.className='origin-direction';symbol.className='origin-spell-symbol';label.className='origin-spell-label';badge.hidden=true;badge.append(pointer,symbol,label);root.append(badge);return {badge,pointer,symbol,label};
 });
 const extra=doc.createElement('span');extra.className='origin-extra';extra.hidden=true;root.append(extra);let disposed=false;
 return {sync(projectiles){
  if(disposed)return;const {alerts,hiddenCount}=layoutOriginAlerts(projectiles,camera,{width:container.clientWidth||doc.defaultView.innerWidth,height:container.clientHeight||doc.defaultView.innerHeight});
  for(const [i,slot]of slots.entries()){
   const alert=alerts[i];slot.badge.hidden=!alert;if(!alert)continue;
   const identity=identities[alert.variant]??['!',VARIANTS[alert.variant].label??'Ameaça'];slot.badge.dataset.variant=alert.variant;slot.badge.dataset.attackId=alert.id;slot.badge.style.left=`${alert.x}px`;slot.badge.style.top=`${alert.y}px`;slot.badge.style.color='#'+(colors[alert.variant]??VARIANTS[alert.variant].color).toString(16).padStart(6,'0');slot.pointer.style.transform=`rotate(${alert.angle}rad)`;
   if(slot.symbol.textContent!==identity[0])slot.symbol.textContent=identity[0];if(slot.label.textContent!==identity[1])slot.label.textContent=identity[1];slot.badge.title=`${VARIANTS[alert.variant].label??identity[1]} · preparação fora da câmera`;
  }
  extra.hidden=hiddenCount===0;if(hiddenCount)extra.textContent=`+${hiddenCount} ${hiddenCount===1?'preparação fora':'preparações fora'} da câmera`;
 },dispose(){if(disposed)return;disposed=true;root.remove();}};
}
