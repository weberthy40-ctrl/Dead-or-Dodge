import { createProjectiles, VARIANTS } from './projectiles.js';
import { DODGE_MOVEMENT_SPEED } from '../movement.js';
import { readonlySnapshot } from '../snapshot.js';

export const TUTORIAL_STEPS = Object.freeze(['move', 'flash', 'dash', 'read']);
/** Guided actions use the real movement and collision systems, never official records. */
export function createDodgeTutorial({ isRunning = () => true } = {}) {
  let index = 0, elapsed = 0, distance = 0, verified = false, disposed = false;
  let position = { x: 0, z: 0 }, casting = false, attempts = 0, hits = 0;
  const projectiles = createProjectiles({ capacity: 1, isRunning, onEvent(event) {
    if (event.type === 'impact') hits++;
    if (event.type === 'removed' && event.reason !== 'disposed') {
      casting = false;
      verified = event.reason === 'expired';
    }
  } });
  const step = () => TUTORIAL_STEPS[index];
  return {
    kind: 'dodge',
    snapshot: () => readonlySnapshot({
      kind: 'dodge', tutorial: true, level: 1, playerSpeed: DODGE_MOVEMENT_SPEED,
      elapsed, projectiles: projectiles.snapshot(), step: step(), index, distance,
      verified, casting, attempts, hits, complete: index === 3 && verified,
    }),
    onControl({ type }) {
      if (disposed || !isRunning() || verified) return;
      if ((step() === 'flash' && type === 'flash') || (step() === 'dash' && type === 'dash')) verified = true;
    },
    next() {
      if (disposed || !isRunning() || !verified || index === 3) return false;
      index++; verified = false; distance = 0;
      return true;
    },
    launchThreat() {
      if (disposed || !isRunning() || step() !== 'read' || casting || verified) return false;
      casting = true; attempts++;
      projectiles.spawn({
        variant: 'artillery', origin: position, aim: position, direction: { x: 0, z: 1 },
        config: { ...VARIANTS.artillery, windup: 2 },
      });
      return true;
    },
    update(dt, previous, next) {
      if (disposed || !isRunning() || !Number.isFinite(dt) || dt <= 0 || dt > .1) return;
      if (![previous?.x, previous?.z, next?.x, next?.z].every(Number.isFinite)) return;
      elapsed += dt; position = { ...next };
      const moved = Math.hypot(next.x - previous.x, next.z - previous.z);
      if (step() === 'move' && moved <= DODGE_MOVEMENT_SPEED * dt + 1e-6) {
        distance += moved;
        if (distance >= 2.5) verified = true;
      }
      projectiles.update(dt, previous, next);
    },
    dispose() { disposed = true; projectiles.clear(); },
  };
}
