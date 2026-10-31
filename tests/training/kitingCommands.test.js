import { it,expect } from 'vitest';
import { createKitingCommands } from '../../src/game3d/kitingCommands.js';
import { createMovement } from '../../src/training/movement.js';
import { createKitingPractice } from '../../src/training/kiting/practice.js';
import { createRandom } from '../../src/core/random.js';
import { kitingRecord } from '../fixtures/kitingRecord.js';
import { validateAttemptRecord } from '../../src/persistence/attemptRecord.js';
import { calculateKitingProgress,prepareKitingEvolution } from '../../src/progression/kitingProgress.js';
import { DEFAULT_PREFERENCES,validatePreferences } from '../../src/settings/preferences.js';

function setup(profile,position={x:0,z:0}){
 let running=true;
 const movement=createMovement({position}),exercise=createKitingPractice({variant:'static',rng:createRandom(5),controlProfile:profile,isRunning:()=>running,playerPosition:()=>movement.snapshot().position});exercise.start();
 const controls=createKitingCommands({exercise,movement,isRunning:()=>running,profile});
 const step=(n=1)=>{for(let i=0;i<n;i++){controls.update();const before=movement.snapshot().position;if(running){movement.update(.05);exercise.update(.05,before,movement.snapshot().position);}}};
 return {controls,movement,exercise,step,pause(){running=false;controls.update();},resume(){running=true;}};
}
it('keeps direct clicks and hold-A range without automatic attacks',()=>{
 const a=setup('direct');a.controls.pressA();a.step(20);expect(a.exercise.snapshot().hits).toBe(0);expect(a.controls.snapshot().rangeVisible).toBe(true);a.controls.releaseA();expect(a.controls.snapshot().rangeVisible).toBe(false);a.controls.leftClick({x:0,z:0});a.step(40);expect(a.exercise.snapshot().hits).toBe(1);
});
it('requires A then a ground click, retains arming after keyup and consumes it once',()=>{
 const a=setup('attack-click');expect(a.controls.leftClick({x:0,z:0})).toBe(false);a.controls.pressA();a.controls.releaseA();expect(a.controls.snapshot()).toMatchObject({armed:true,rangeVisible:true});expect(a.controls.leftClick({x:0,z:0})).toBe(true);expect(a.controls.snapshot().armed).toBe(false);a.step(30);a.controls.leftClick({x:0,z:0});a.step(30);expect(a.exercise.snapshot().hits).toBe(1);
});
it('uses A at a known cursor, ignores left clicks and never queues attacks during recovery',()=>{
 const a=setup('quick-attack');expect(a.controls.pressA(null)).toBe(false);a.controls.leftClick({x:0,z:0});expect(a.exercise.snapshot().accepted).toBe(0);a.controls.pressA({x:0,z:0});a.step(6);a.controls.pressA({x:0,z:0});a.step(60);expect(a.exercise.snapshot()).toMatchObject({accepted:1,hits:1});
});
it.each(['attack-click','quick-attack'])('approaches for one shot and stops, without repeating (%s)',profile=>{
 const a=setup(profile,{x:-12,z:-16}),target=a.exercise.snapshot().targets[0].position;
 a.controls.pressA(target);if(profile==='attack-click')a.controls.leftClick(target);
 expect(a.controls.snapshot().pending).not.toBeNull();a.step(150);expect(a.exercise.snapshot().hits).toBe(1);expect(a.controls.snapshot().pending).toBeNull();expect(a.movement.snapshot().target).toBeNull();
});
it('cancels a pending approach on pause, stop or replacement movement',()=>{
 for(const action of ['pause','stop','move']){const a=setup('quick-attack',{x:-12,z:-16}),target=a.exercise.snapshot().targets[0].position;a.controls.pressA(target);a.step(2);if(action==='pause'){a.pause();a.step(20);a.resume();}else{a.controls.cancel();if(action==='move')a.movement.moveTo({x:-11,z:-16});}a.step(160);expect(a.exercise.snapshot().hits).toBe(0);expect(a.controls.snapshot()).toMatchObject({armed:false,pending:null,rangeVisible:false});}
});
it('preserves preparation cancellation and physical rules across all command profiles',()=>{
 for(const profile of ['direct','attack-click','quick-attack']){const a=setup(profile);const config=a.exercise.snapshot().config;a.controls.pressA({x:0,z:0});if(profile!=='quick-attack')a.controls.leftClick({x:0,z:0});a.exercise.moveCommand();a.step(30);expect(a.exercise.snapshot()).toMatchObject({hits:0,cancellations:1});expect(config).toEqual(setup('direct').exercise.snapshot().config);}
});
it('accepts old preferences and records without rewriting them; rejects unknown or mismatched modes',()=>{
 const old={...DEFAULT_PREFERENCES};delete old.kitingControls;expect(validatePreferences(old).kitingControls).toBe('direct');expect(()=>validatePreferences({...old,kitingControls:'auto'})).toThrow();
 const record=structuredClone(kitingRecord());delete record.metrics.controlProfile;delete record.score.controlProfile;const original=JSON.stringify(record);expect(validateAttemptRecord(record)).toBe(record);expect(JSON.stringify(record)).toBe(original);
 for(const patch of [{controlProfile:'auto'},{controlProfile:'quick-attack'}])expect(()=>validateAttemptRecord({...record,metrics:{...record.metrics,...patch}})).toThrow();
});
it('separates records, evolution and three-session evidence by command profile',()=>{
 const data=['direct','direct','quick-attack'].map((controlProfile,i)=>kitingRecord({id:String(i),controlProfile,score:80,date:`2026-10-0${i+1}T00:00:00.000Z`}));
 let result=calculateKitingProgress(data);expect(result.records).toHaveLength(2);expect(result.rating.rating).toBeNull();expect(prepareKitingEvolution(data,{controlProfile:'quick-attack'})).toHaveLength(1);
 data.push(kitingRecord({id:'3',controlProfile:'direct',score:80,date:'2026-10-04T00:00:00.000Z'}));result=calculateKitingProgress(data);expect(result.rating.rating).toBe(1);expect(result.rating.evidenceByLevel[0]).toMatchObject({controlProfile:'direct',count:3});
 data.push(kitingRecord({id:'4',controlProfile:'quick-attack',score:80,date:'2026-10-05T00:00:00.000Z'}));expect(calculateKitingProgress(data).rating.evidenceByLevel[0].controlProfile).toBe('direct');
 data.push(kitingRecord({id:'5',controlProfile:'quick-attack',score:80,date:'2026-10-06T00:00:00.000Z'}));expect(calculateKitingProgress(data).rating.evidenceByLevel[0]).toMatchObject({controlProfile:'quick-attack',count:3});
});
