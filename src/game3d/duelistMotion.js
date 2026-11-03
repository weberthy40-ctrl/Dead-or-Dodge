const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
/** Cosmetic lean only. It never supplies a world position, facing or collider. */
export function createDuelistMotion(){
 let facing=null,run=0,roll=0,pitch=0;
 return {update({angle,moving=false,ability=null,reducedMotion=false},dt){
  if(!Number.isFinite(angle)||!Number.isFinite(dt)||dt<0)return {pitch,roll,run};
  if(reducedMotion){facing=angle;run=roll=pitch=0;return {pitch,roll,run};}
  if(dt===0)return {pitch,roll,run};
  const delta=facing===null?0:Math.atan2(Math.sin(angle-facing),Math.cos(angle-facing));facing=angle;
  const alpha=1-Math.exp(-Math.min(dt,.1)/(moving?.065:.045));run+=((moving?1:0)-run)*alpha;
  roll+=(clamp(-delta/Math.max(.001,dt)*.012,-.065,.065)*(moving?1:0)-roll)*alpha;
  const stance=ability==='dash'?1-Math.exp(-Math.min(dt,.1)/.028):alpha;
  pitch+=((ability==='dash'?-.14:-.025*run)-pitch)*stance;
  return {pitch,roll,run};
 }};
}
