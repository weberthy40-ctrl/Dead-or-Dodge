import { expect,it } from 'vitest';
import { createEventBus } from '../../src/core/eventBus.js';
import { createRandom } from '../../src/core/random.js';
import { createPrecisionPractice } from '../../src/training/precision/practice.js';
import { observePrecisionFeedback,describePrecisionGuidance,buildPrecisionCoaching } from '../../src/training/precision/feedback.js';
import { precisionRecord } from '../fixtures/precisionRecord.js';

it('emits the observed click/order/deadline category without changing targets, counters or RNG results',()=>{
 const events=createEventBus(),messages=[];events.on('precision:feedback',event=>messages.push(event));
 const a=createPrecisionPractice({variant:'mixed',level:1,maxLifetime:1.6,rng:createRandom(53),events,attemptId:'one'}),b=createPrecisionPractice({variant:'mixed',level:1,maxLifetime:1.6,rng:createRandom(53)});
 a.start();b.start();for(let group=0;group<2;group++){const total=a.snapshot().targets.length;for(let i=0;i<total;i++){a.hit(a.snapshot().targets[0].id);b.hit(b.snapshot().targets[0].id);}}
 expect(a.snapshot().priority).toBe(true);const wrong=a.snapshot().targets[1];a.hit(wrong.id);b.hit(wrong.id);expect(messages.at(-1)).toMatchObject({type:'order',expectedOrder:1,attemptId:'one'});
 a.miss();b.miss();expect(messages.at(-1).type).toBe('miss');
 const remaining=a.snapshot().targets.length;for(let i=0;i<18;i++){a.update(.1);b.update(.1);}expect(messages.filter(m=>m.type==='late')).toHaveLength(remaining);
 a.update(.1);b.update(.1);expect(messages.filter(m=>m.type==='late')).toHaveLength(remaining);expect(a.snapshot()).toEqual(b.snapshot());expect(a.snapshot()).toMatchObject({misses:2,orderErrors:1,expired:remaining});
 a.hit(a.snapshot().targets[0].id);b.hit(b.snapshot().targets[0].id);expect(messages.at(-1).type).toBe('hit');expect(a.snapshot()).toEqual(b.snapshot());a.dispose();b.dispose();
});

it('keeps only the latest observation, excludes other attempts and expires by active time',()=>{
 const events=createEventBus();let time=1;const view=observePrecisionFeedback({events,attemptId:'one',activeTime:()=>time});
 events.emit('precision:feedback',{attemptId:'other',type:'miss'});expect(view.snapshot()).toBeNull();events.emit('precision:feedback',{attemptId:'one',type:'order',expectedOrder:3});expect(view.snapshot()).toMatchObject({type:'order',expectedOrder:3});
 expect(view.snapshot()).toEqual(view.snapshot());time=1.8;expect(view.snapshot()).not.toBeNull();time=2.3;expect(view.snapshot()).toBeNull();events.emit('precision:feedback',{attemptId:'one',type:'hit'});expect(view.snapshot().type).toBe('hit');view.dispose();expect(events.emit('precision:feedback',{attemptId:'one',type:'miss'})).toBe(0);
});

it('retains the next-order instruction when that target is late and distinguishes paused/prepared states',()=>{
 const snapshot={priority:true,nextTargetId:'third',state:'active',targets:[{id:'third',order:3,overdue:true}],fallback:false};
 expect(describePrecisionGuidance(snapshot,{feedback:{type:'late',retained:true}})).toMatchObject({mode:'priority',nextOrder:3});expect(describePrecisionGuidance(snapshot,{feedback:{type:'late',retained:true}}).message).toContain('permanece');
 for(const state of ['idle','countdown','paused'])expect(describePrecisionGuidance(snapshot,{sessionState:state}).mode).toBe(state);
 expect(describePrecisionGuidance({...snapshot,state:'stopped'}).mode).toBe('inactive');expect(describePrecisionGuidance({...snapshot,priority:false,nextTargetId:null}).mode).toBe('free');
});

it('separates order errors from other misses without counting deadline events as clicks',()=>{
 const m={...precisionRecord({hits:20,misses:5}).metrics,orderErrors:3,expiredTargets:7},before=JSON.stringify(m),result=buildPrecisionCoaching(m);
 expect(result).toMatchObject({order:3,outside:2,late:7,priority:'order',smallSample:false});expect(JSON.stringify(m)).toBe(before);expect(result).not.toHaveProperty('score');
 expect(buildPrecisionCoaching({...m,orderErrors:0}).priority).toBe('aim');expect(buildPrecisionCoaching({...m,misses:0,orderErrors:0}).priority).toBe('deadline');
 expect(buildPrecisionCoaching({...m,endReason:'abandoned'}).priority).toBe('interrupted');expect(buildPrecisionCoaching(precisionRecord({hits:1}).metrics).smallSample).toBe(true);
});
