import { it,expect } from 'vitest';
import { createFocusExercise } from '../../src/training/dodge/focusExercise.js';
import { PREMIUM_FAMILIES } from '../../src/game3d/artDirection.js';
import { createEventBus } from '../../src/core/eventBus.js';
import { createDodgeTelemetry } from '../../src/training/dodge/telemetry.js';
import { createSession } from '../../src/training/session.js';
import { createDodgeMode } from '../../src/training/dodge/mode.js';
import { createAttemptRecord } from '../../src/persistence/attemptRecord.js';
it.each(Object.keys(PREMIUM_FAMILIES))('uses real warnings, collisions and pause for focused %s practice',family=>{
 const events=createEventBus(),session=createSession({countdown:0,events,timeLimit:30}),id=session.snapshot().id;
 const mode=createDodgeMode({session,mode:'challenge',level:5,events}),telemetry=createDodgeTelemetry({session,mode:'challenge',level:5,events,rulesetVersion:'rift-focus-v1'});
 const exercise=createFocusExercise({family,events,attemptId:id,isRunning:()=>session.snapshot().state==='running',getVitals:()=>({lives:mode.snapshot().lives,maxLives:3})});
 const position={x:0,z:0};session.start();
 for(let i=0;i<16;i++){session.update(.1);exercise.update(.1,position,position);telemetry.step(.1,position,position);}
 expect(exercise.snapshot().projectiles).toHaveLength(1);expect(exercise.snapshot().projectiles[0].variant).toBe(PREMIUM_FAMILIES[family].variant);
 session.pause();const before=exercise.snapshot();exercise.update(.1,position,position);expect(exercise.snapshot()).toEqual(before);session.resume();
 for(let i=0;i<300&&session.snapshot().state==='running';i++){session.update(.1);exercise.update(.1,position,position);telemetry.step(.1,position,position);mode.evaluate();}
 expect(telemetry.isFinal()).toBe(true);expect(telemetry.snapshot().validHits).toBeGreaterThan(0);expect(()=>createAttemptRecord(telemetry.snapshot(),{})).toThrow();
 const final=exercise.snapshot();exercise.dispose();exercise.dispose();expect(exercise.snapshot().projectiles).toHaveLength(0);exercise.update(.1,position,position);expect(exercise.snapshot().elapsed).toBe(final.elapsed);telemetry.dispose();mode.dispose();session.dispose();
});
