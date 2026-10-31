import { createProjectiles,VARIANTS } from './projectiles.js';
import { PREMIUM_FAMILIES } from '../../game3d/artDirection.js';
import { DODGE_MOVEMENT_SPEED } from '../movement.js';
import { readonlySnapshot } from '../snapshot.js';

/** Unscored focused practice reuses authoritative projectiles and swept collisions. */
export function createFocusExercise({family,events,attemptId,isRunning=()=>true,getVitals=()=>({})}){
 const definition=PREMIUM_FAMILIES[family];if(!definition)throw new TypeError('Família de treino inválida.');
 let elapsed=0,next=1.5,sequence=0,disposed=false;
 const projectiles=createProjectiles({capacity:8,isRunning,onEvent:event=>events?.emit(`dodge:${event.type}`,Object.freeze({...event,attemptId,mode:'challenge',level:5}))});
 return {kind:'dodge',snapshot:()=>readonlySnapshot({kind:'dodge',focus:family,level:5,elapsed,playerSpeed:DODGE_MOVEMENT_SPEED,...getVitals(),projectiles:projectiles.snapshot()}),
 update(dt,previous,player){
  if(disposed||!isRunning()||!Number.isFinite(dt)||dt<=0||dt>.1)return;
  if(![previous?.x,previous?.z,player?.x,player?.z].every(Number.isFinite))throw new TypeError('Posição de treino inválida.');
  elapsed+=dt;projectiles.update(dt,previous,player);if(!isRunning()||elapsed+1e-9<next||elapsed>28)return;
  next+=2.2;const v=VARIANTS[definition.variant],angle=(sequence++%8)*Math.PI/4,origin=v.shape==='circle'?{...player}:{x:player.x+Math.cos(angle)*14,z:player.z+Math.sin(angle)*14},dx=player.x-origin.x,dz=player.z-origin.z;
  projectiles.spawn({variant:definition.variant,origin,direction:v.shape==='circle'?{x:0,z:1}:{x:dx,z:dz},aim:player,caster:v.shape==='circle'?{x:15.8,z:0}:origin,config:{...v,windup:definition.variant==='hook_linear'?.65:v.windup,pathHint:'full',hintDuration:5}});
 },dispose(){if(disposed)return;disposed=true;projectiles.clear();}};
}
