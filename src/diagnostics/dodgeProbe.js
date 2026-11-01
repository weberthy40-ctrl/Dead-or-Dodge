import { createProjectiles,VARIANTS } from '../training/dodge/projectiles.js';
import { PREMIUM_FAMILIES } from '../game3d/artDirection.js';
import { DODGE_MOVEMENT_SPEED } from '../training/movement.js';
import { readonlySnapshot } from '../training/snapshot.js';

export const PROBE_VERSION='rift-fluency-v1';
export const PROBE_SECONDS=32;
const families=Object.values(PREMIUM_FAMILIES);
export const PROBE_SCHEDULE=Object.freeze(Array.from({length:24},(_,i)=>Object.freeze({time:2.5+i*1.2,variant:families[i%5].variant,angle:(i%8)*Math.PI/4})));

/** A pinned presentation workload; no lives, rank, placement or repository. */
export function createDodgeProbe({events,attemptId,isRunning=()=>true}={}){
 let elapsed=0,index=0,disposed=false;
 const projectiles=createProjectiles({capacity:12,isRunning,onEvent:event=>events?.emit(`dodge:${event.type}`,Object.freeze({...event,attemptId,mode:'probe'}))});
 return {kind:'dodge',snapshot:()=>readonlySnapshot({kind:'dodge',level:5,elapsed,playerSpeed:DODGE_MOVEMENT_SPEED,probe:PROBE_VERSION,projectiles:projectiles.snapshot()}),update(dt,from,to){
  if(disposed||!isRunning()||!Number.isFinite(dt)||dt<=0||dt>.1)return;
  elapsed+=dt;projectiles.update(dt,from,to);
  while(index<PROBE_SCHEDULE.length&&elapsed+1e-9>=PROBE_SCHEDULE[index].time){
   const launch=PROBE_SCHEDULE[index++],v=VARIANTS[launch.variant],center={x:Math.cos(launch.angle)*2,z:Math.sin(launch.angle)*2},origin=v.shape==='circle'?center:{x:Math.cos(launch.angle)*14,z:Math.sin(launch.angle)*14};
   projectiles.spawn({variant:launch.variant,origin,direction:v.shape==='circle'?{x:0,z:1}:{x:-origin.x,z:-origin.z},caster:v.shape==='circle'?{x:15.8,z:0}:origin,aim:{x:0,z:0},config:{...v,windup:launch.variant==='hook_linear'?.65:v.windup,pathHint:'full',hintDuration:5}});
  }
 },dispose(){if(disposed)return;disposed=true;projectiles.clear();}};
}
