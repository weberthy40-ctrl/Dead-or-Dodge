import { kitingControlProfile } from '../settings/kitingControls.js';
import { inAttackRange } from '../training/kiting/practice.js';
import { ARENA } from './spatial.js';

/** One explicit command can produce one attack. No repeating or cooldown queue. */
export function createKitingCommands({exercise,movement,isRunning,profile}){
 profile=kitingControlProfile(profile);
 let armed=false,held=false,pending=null;
 const valid=aim=>aim&&[aim.x,aim.z].every(Number.isFinite);
 function cancel({stop=true}={}){armed=false;held=false;if(pending&&stop)movement.stop();pending=null;}
 function command(aim){
  if(!isRunning()||!valid(aim))return false;
  if(profile==='direct'){const accepted=exercise.click(aim);if(accepted)movement.stop();return accepted;}
  const snapshot=exercise.snapshot();
  if(snapshot.phase!=='ready'||snapshot.cooldown>1e-8)return false;
  pending=null;
  if(exercise.click(aim)){movement.stop();return true;}
  const target={x:Math.max(ARENA.bounds.minX,Math.min(ARENA.bounds.maxX,aim.x)),z:Math.max(ARENA.bounds.minZ,Math.min(ARENA.bounds.maxZ,aim.z))};
  if(movement.moveTo(target)){pending=target;return true;}
  return false;
 }
 return {
  pressA(aim){if(!isRunning())return false;held=true;if(profile==='attack-click'){armed=true;return true;}return profile==='quick-attack'?command(aim):true;},
  releaseA(){held=false;},
  leftClick(aim){if(profile==='quick-attack'||profile==='attack-click'&&!armed)return false;armed=false;return command(aim);},
  cancel,
  update(){
   if(!isRunning()){cancel();return;}
   if(!pending)return;
   const snapshot=exercise.snapshot(),position=movement.snapshot().position;
   if(snapshot.phase==='ready'&&snapshot.cooldown<=1e-8&&(snapshot.targets??[snapshot.target]).some(t=>t&&inAttackRange(position,t.position,snapshot.config.attackRange))&&exercise.click(pending)){movement.stop();pending=null;}
   else if(!movement.snapshot().target)pending=null;
  },
  snapshot:()=>({profile,armed,pending:pending?{...pending}:null,rangeVisible:held||armed}),
 };
}
