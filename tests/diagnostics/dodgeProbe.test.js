import { it,expect } from 'vitest';
import { createEventBus } from '../../src/core/eventBus.js';
import { createDodgeProbe,PROBE_SCHEDULE } from '../../src/diagnostics/dodgeProbe.js';

it('pins all five families independently of player routes and step rate, without gameplay writes',()=>{
 function run(step,moving){const events=createEventBus(),launches=[],damage=[];events.on('dodge:warning',e=>launches.push([e.variant,e.from,e.to,e.radius]));events.on('dodge:damage',e=>damage.push(e));const exercise=createDodgeProbe({events,attemptId:'probe'});let from={x:0,z:0};for(let t=step;t<=32+1e-8;t+=step){const to=moving?{x:Math.sin(t)*3,z:Math.cos(t)*3}:from;exercise.update(step,from,to);from=to;}const snapshot=exercise.snapshot();exercise.dispose();return {launches,damage,snapshot};}
 const a=run(.05,false),b=run(1/60,true);expect(a.launches).toEqual(b.launches);expect(a.launches).toHaveLength(PROBE_SCHEDULE.length);expect(new Set(a.launches.map(x=>x[0])).size).toBe(5);expect(a.damage).toEqual([]);expect(a.snapshot.maxLives).toBeUndefined();expect(a.snapshot.projectiles.length).toBeLessThanOrEqual(12);
});
it('freezes the scenario on pause and releases its projectiles on disposal',()=>{
 let running=true;const e=createDodgeProbe({isRunning:()=>running});for(let i=0;i<60;i++)e.update(.05,{x:8,z:8},{x:8,z:8});const before=e.snapshot();running=false;e.update(.05,{x:8,z:8},{x:8,z:8});expect(e.snapshot()).toEqual(before);e.dispose();e.dispose();expect(e.snapshot().projectiles).toHaveLength(0);
});
