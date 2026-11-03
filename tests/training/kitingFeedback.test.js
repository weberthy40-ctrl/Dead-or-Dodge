import { expect,it } from 'vitest';
import { createEventBus } from '../../src/core/eventBus.js';
import { createKitingPractice } from '../../src/training/kiting/practice.js';
import { createKitingAttempt } from '../../src/training/kiting/attempt.js';
import { createSession } from '../../src/training/session.js';
import { describeKitingPhase,observeKitingCancellations,buildKitingCoaching } from '../../src/training/kiting/feedback.js';
import { kitingRecord } from '../fixtures/kitingRecord.js';
const step=(practice,seconds)=>{for(let i=0;i<Math.round(seconds*100);i++)practice.update(.01);};

it('reports actual cancellation reasons without changing acceptance, clocks or persisted metrics',()=>{
 const events=createEventBus(),session=createSession({countdown:0,timeLimit:60}),id=session.snapshot().id;
 let player={x:0,z:0};const p=createKitingPractice({variant:'static',events,attemptId:id,playerPosition:()=>player,isRunning:()=>session.snapshot().state==='running'}),observer=observeKitingCancellations({events,attemptId:id}),attempt=createKitingAttempt({session,practice:p,variant:'static',level:1});
 p.start();session.start();p.click('kiting-target');p.moveCommand();expect(p.snapshot()).toMatchObject({hits:0,shots:0,cancellations:1,phase:'recovery',cooldown:p.snapshot().config.cancelCooldown,lastCancellation:{reason:'command'}});
 step(p,.2);p.click('kiting-target');player={x:8,z:18};step(p,.3);expect(p.snapshot().lastCancellation.reason).toBe('range');expect(observer.snapshot()).toEqual({command:1,range:1});
 events.emit('kiting:cancelled',{attemptId:'other',attackId:'attack-3',reason:'command'});events.emit('kiting:cancelled',{attemptId:id,attackId:'attack-2',reason:'range'});expect(observer.snapshot()).toEqual({command:1,range:1});
 for(let i=0;i<600;i++){const before=session.snapshot().elapsed;session.update(.1);p.update(session.snapshot().elapsed-before);attempt.evaluate();}
 const m=attempt.snapshot();expect(m.cancellations).toBe(2);expect(m.shots).toBe(0);expect(m).not.toHaveProperty('lastCancellation');expect(m).not.toHaveProperty('reason');
 observer.dispose();expect(events.emit('kiting:cancelled',{attemptId:id,attackId:'attack-3',reason:'command'})).toBe(0);attempt.dispose();p.dispose();session.dispose();
});

it('uses the actual recovery interval after a shot and the shorter cancellation cooldown',()=>{
 const p=createKitingPractice();p.start();p.click('kiting-target');step(p,.1);
 const windup=describeKitingPhase(p.snapshot());expect(windup.state).toBe('windup');expect(windup.progress).toBeCloseTo(.1/p.snapshot().config.windupDuration);
 step(p,.12);const shot=p.snapshot();expect(shot.phase).toBe('recovery');expect(describeKitingPhase(shot).progress).toBeCloseTo(0,6);expect(describeKitingPhase(shot).title).toBe('Disparo confirmado');
 step(p,1);p.click('kiting-target');p.moveCommand();const cancelled=p.snapshot();expect(describeKitingPhase(cancelled)).toMatchObject({state:'cancelled',progress:0});
 step(p,.05);expect(describeKitingPhase(p.snapshot()).progress).toBeCloseTo(1/3);const frozen=p.snapshot(),paused=describeKitingPhase(frozen,{sessionState:'paused'});expect(paused.state).toBe('paused');expect(paused.progress).toBe(describeKitingPhase(frozen).progress);
 step(p,.2);expect(describeKitingPhase(p.snapshot()).state).toBe('ready');expect(describeKitingPhase(p.snapshot()).hint).toContain('já pode atacar');p.dispose();
});

it('distinguishes armed, approaching, countdown and idle commands without inventing a shot',()=>{
 const p=createKitingPractice(),snapshot=p.snapshot(),before=JSON.stringify(snapshot);
 expect(describeKitingPhase(snapshot,{commands:{armed:true}}).state).toBe('armed');expect(describeKitingPhase(snapshot,{commands:{pending:{x:10,z:10}}}).state).toBe('approach');
 for(const state of ['idle','countdown','paused'])expect(describeKitingPhase(snapshot,{sessionState:state}).state).toBe(state);
 expect(JSON.stringify(snapshot)).toBe(before);expect(snapshot.shots).toBe(0);p.dispose();
});

it('grounds guidance in observed cancellations and keeps unavailable causes explicit',()=>{
 const m={...kitingRecord({hits:2}).metrics,cancellations:4,accepted:6},before=JSON.stringify(m);
 const range=buildKitingCoaching(m,{command:1,range:3});expect(range.priority).toBe('cancellations');expect(range.action).toContain('distância');expect(range.smallSample).toBe(true);
 const unknown=buildKitingCoaching(m);expect(unknown).toMatchObject({command:0,range:0,unknown:4});expect(JSON.stringify(m)).toBe(before);
 expect(buildKitingCoaching({...m,endReason:'abandoned'}).priority).toBe('interrupted');
});

it('separates rhythm, survival and small samples without making a skill estimate',()=>{
 const m=kitingRecord({hits:12,cycles:1}).metrics;expect(buildKitingCoaching(m).priority).toBe('rhythm');
 expect(buildKitingCoaching({...m,rhythmCycles:11,endReason:'defeat',damageTaken:100}).priority).toBe('survival');
 const small=kitingRecord({hits:1}).metrics;expect(buildKitingCoaching(small).priority).toBe('sample');expect(buildKitingCoaching(small).smallSample).toBe(true);
 expect(buildKitingCoaching({...m,rhythmCycles:11}).priority).toBe('repeat');expect(buildKitingCoaching(m)).not.toHaveProperty('score');
});
