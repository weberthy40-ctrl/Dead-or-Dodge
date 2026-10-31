import { it, expect } from 'vitest';
import { createDodgeTutorial } from '../../src/training/dodge/tutorial.js';
import { createMovement, DODGE_MOVEMENT_SPEED } from '../../src/training/movement.js';
import { DODGE_ARENA } from '../../src/game3d/spatial.js';

function setup() {
  let running = true;
  const tutorial = createDodgeTutorial({ isRunning: () => running });
  const movement = createMovement({ arena: DODGE_ARENA, speed: DODGE_MOVEMENT_SPEED });
  function advance(seconds) {
    for (let i = 0; i < Math.round(seconds / .05); i++) {
      const before = movement.snapshot().position;
      if (running) movement.update(.05);
      tutorial.update(.05, before, movement.snapshot().position);
    }
  }
  return { tutorial, movement, advance, pause: () => { running = false; }, resume: () => { running = true; } };
}
function reachRead(r) {
  r.movement.moveTo({ x: 3, z: 0 }); r.advance(1); r.tutorial.next();
  r.tutorial.onControl({ type: 'flash' }); r.tutorial.next();
  r.tutorial.onControl({ type: 'dash' }); r.tutorial.next();
}
it('requires walking and the accepted ability of each step, with explicit transitions', () => {
  const r = setup();
  expect(r.tutorial.next()).toBe(false);
  r.tutorial.onControl({ type: 'flash' });
  expect(r.tutorial.snapshot().verified).toBe(false);
  r.movement.blink({ x: 4, z: 0 });
  r.tutorial.update(.05, { x: 0, z: 0 }, { x: 4, z: 0 });
  expect(r.tutorial.snapshot().distance).toBe(0);
  r.movement.moveTo({ x: 8, z: 0 }); r.advance(1);
  expect(r.tutorial.snapshot().verified).toBe(true); expect(r.tutorial.next()).toBe(true);
  r.tutorial.onControl({ type: 'dash' }); expect(r.tutorial.snapshot().verified).toBe(false);
  r.tutorial.onControl({ type: 'flash' }); expect(r.tutorial.next()).toBe(true);
  r.tutorial.onControl({ type: 'dash' }); expect(r.tutorial.next()).toBe(true);
  expect(r.tutorial.snapshot()).toMatchObject({ step: 'read', verified: false, complete: false });
  r.tutorial.dispose();
});
it('uses real warning and collision: a hit retries, leaving the announced area completes', () => {
  const r = setup(); reachRead(r);
  expect(r.tutorial.launchThreat()).toBe(true); expect(r.tutorial.launchThreat()).toBe(false);
  r.advance(1.9); expect(r.tutorial.snapshot().hits).toBe(0);
  r.advance(.4); expect(r.tutorial.snapshot()).toMatchObject({ hits: 1, verified: false, casting: false });
  r.tutorial.launchThreat();
  const origin = r.tutorial.snapshot().projectiles[0].origin;
  r.movement.moveTo({ x: origin.x + 4, z: origin.z }); r.advance(2.5);
  expect(r.tutorial.snapshot()).toMatchObject({ attempts: 2, hits: 1, complete: true, projectiles: [] });
  expect(r.tutorial.next()).toBe(false); r.tutorial.dispose();
});
it('freezes while paused and releases the live threat on disposal', () => {
  const r = setup(); reachRead(r); r.tutorial.launchThreat(); r.advance(.5); r.pause();
  const before = r.tutorial.snapshot(); r.advance(10); r.tutorial.onControl({ type: 'dash' });
  expect(r.tutorial.snapshot()).toEqual(before); expect(r.tutorial.next()).toBe(false);
  r.tutorial.dispose(); r.resume(); r.advance(2); expect(r.tutorial.snapshot().projectiles).toEqual([]);
  expect(r.tutorial.launchThreat()).toBe(false);
});
