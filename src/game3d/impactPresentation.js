import { PLAYER_RADIUS,trajectoryTouches } from '../training/dodge/geometry.js';
import { sweptCircle } from '../training/dodge/collision.js';
import { VARIANTS } from '../training/dodge/projectiles.js';
import { readonlySnapshot } from '../training/snapshot.js';

export const IMPACT_ECHO_SECONDS=.24;
export const IMPACT_ECHO_LIMIT=8;
export const EMPTY_IMPACTS=Object.freeze([]);
const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t});

/** Reconstruct a contact from the already accepted trajectory. Never decides damage. */
function contactPoint(path){
 if(!path||!['from','to','playerFrom','playerTo'].every(k=>[path[k]?.x,path[k]?.z].every(Number.isFinite))||!Number.isFinite(path.radius)||path.radius<=0)return null;
 if(!trajectoryTouches(path))return null;
 if(!['beam','ring'].includes(path.shape)){
  const t=sweptCircle({x:path.from.x-path.playerFrom.x,z:path.from.z-path.playerFrom.z},{x:path.to.x-path.playerTo.x,z:path.to.z-path.playerTo.z},path.radius+PLAYER_RADIUS);
  return t===null?null:lerp(path.from,path.to,t);
 }
 // A prefix of an intersecting path remains intersecting as it grows.
 let low=0,high=1;
 for(let i=0;i<18;i++){const t=(low+high)/2;if(trajectoryTouches({...path,playerTo:lerp(path.playerFrom,path.playerTo,t)}))high=t;else low=t;}
 return lerp(path.playerFrom,path.playerTo,high);
}

/** Bounded read-only observer; its snapshots are optional replay presentation data. */
export function createImpactPresentation({events,attemptId,getSnapshot}){
 const paths=new Map();let pending=[],recent=[],lastTime=0,disposed=false;
 const valid=e=>!disposed&&e.attemptId===attemptId&&typeof e.id==='string';
 const subscriptions=[
  events.on('dodge:trajectory',e=>{if(valid(e)&&(paths.has(e.id)||paths.size<20))paths.set(e.id,e);}),
  events.on('dodge:impact',e=>{
   if(!valid(e)||!Object.hasOwn(VARIANTS,e.variant))return;
   const point=contactPoint(paths.get(e.id)),p=getSnapshot()?.projectiles?.find(p=>p.id===e.id);
   if(!point||!p||p.variant!==e.variant||![p.origin?.x,p.origin?.z,p.direction?.x,p.direction?.z,p.radius,p.length??0,p.wallWidth??0].every(Number.isFinite)||p.radius<=0)return;
   const shape=p.shape??'bolt';if(!['bolt','beam','circle','ring'].includes(shape))return;
   pending.push(readonlySnapshot({id:p.id,variant:p.variant,shape,position:point,origin:p.origin,direction:p.direction,radius:p.radius,length:p.length??0,wallWidth:p.wallWidth??0}));
   pending=pending.slice(-IMPACT_ECHO_LIMIT);
  }),
  events.on('dodge:removed',e=>{if(valid(e))paths.delete(e.id);}),
 ];
 return {sample(time){
  if(disposed||!Number.isFinite(time)||time<0)return EMPTY_IMPACTS;
  lastTime=Math.max(lastTime,time);recent=recent.filter(e=>lastTime-e.at<IMPACT_ECHO_SECONDS);
  for(const impact of pending)recent.push({impact,at:lastTime});pending=[];recent=recent.slice(-IMPACT_ECHO_LIMIT);
  return Object.freeze(recent.map(({impact,at})=>Object.freeze({...impact,age:lastTime-at})));
 },dispose(){if(disposed)return;disposed=true;subscriptions.forEach(f=>f());paths.clear();pending=[];recent=[];}};
}
