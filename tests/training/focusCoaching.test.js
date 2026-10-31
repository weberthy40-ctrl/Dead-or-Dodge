import { it,expect } from 'vitest';
import { buildFocusCoaching } from '../../src/training/dodge/focusCoaching.js';
import { createFocusExercise,FOCUS_RULESET_VERSION } from '../../src/training/dodge/focusExercise.js';
import { createEventBus } from '../../src/core/eventBus.js';
import { createSession } from '../../src/training/session.js';
import { createDodgeMode } from '../../src/training/dodge/mode.js';
import { createDodgeTelemetry } from '../../src/training/dodge/telemetry.js';
const metrics={terminal:true,mode:'challenge',rulesetVersion:FOCUS_RULESET_VERSION,endReason:'victory',elapsedActiveSeconds:30,attacksEmitted:13,threatsQualified:13,threatsDodged:8,threatsHit:2,contactsIgnored:0,validHits:2};
it('requires both time and real dodges and never turns unresolved or protected contacts into successes',()=>{
 expect(buildFocusCoaching('area',metrics).status).toBe('achieved');expect(buildFocusCoaching('area',{...metrics,threatsDodged:7,contactsIgnored:3}).status).toBe('practice');expect(buildFocusCoaching('area',{...metrics,endReason:'defeat',elapsedActiveSeconds:20}).checks[0].achieved).toBe(false);
 for(const patch of [{mode:'normal'},{rulesetVersion:'dodge-series-v1'},{endReason:'error'},{elapsedActiveSeconds:25},{threatsDodged:99},{validHits:4},{terminal:false}])expect(buildFocusCoaching('area',{...metrics,...patch}).status).toBe('interrupted');
});
it('compares only a valid prior round of the same family without mutating either result',()=>{
 const previous=buildFocusCoaching('area',{...metrics,endReason:'defeat',elapsedActiveSeconds:15,threatsDodged:2}).summary,before=JSON.stringify(previous),next=buildFocusCoaching('area',metrics,previous);expect(next.comparison.previous.dodged).toBe(2);expect(next.comparison.current.dodged).toBe(8);expect(JSON.stringify(previous)).toBe(before);expect(buildFocusCoaching('beam',metrics,previous).comparison).toBeNull();expect(buildFocusCoaching('area',metrics,{...previous,seconds:NaN}).comparison).toBeNull();
});
it.each([['linear',.8],['lance',.8],['hook',.6],['beam',1],['area',.6]])('allows the %s objective through a legal moving path with real collision telemetry', (family,omega)=>{
 const events=createEventBus(),session=createSession({events,countdown:0,timeLimit:30}),mode=createDodgeMode({session,mode:'challenge',level:5,events}),telemetry=createDodgeTelemetry({session,mode:'challenge',level:5,events,rulesetVersion:FOCUS_RULESET_VERSION}),exercise=createFocusExercise({family,events,attemptId:session.snapshot().id,isRunning:()=>session.snapshot().state==='running'});session.start();let previous={x:0,z:0};
 for(let i=1;i<=601&&session.snapshot().state==='running';i++){session.update(.05);const time=session.snapshot().elapsed,player={x:Math.min(5,5*time)*Math.cos(Math.max(0,time-1)*omega),z:Math.min(5,5*time)*Math.sin(Math.max(0,time-1)*omega)};expect(Math.hypot(player.x-previous.x,player.z-previous.z)).toBeLessThanOrEqual(5.8*.05);exercise.update(.05,previous,player);telemetry.step(.05,previous,player);mode.evaluate();telemetry.step(0,player,player);previous=player;}
 expect(buildFocusCoaching(family,telemetry.snapshot()).status).toBe('achieved');expect(telemetry.snapshot().threatsDodged).toBeGreaterThanOrEqual(8);exercise.dispose();mode.dispose();telemetry.dispose();session.dispose();
});
