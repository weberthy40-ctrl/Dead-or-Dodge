import { createProjectiles } from './projectiles.js';
import { buildSeriesSchedule } from './series.js';
import { DODGE_MOVEMENT_SPEED } from '../movement.js';
import { readonlySnapshot } from '../snapshot.js';

export function createSeriesExercise({ code, events, attemptId, isRunning = () => true, getVitals = () => ({}) }) {
  const { series, jobs } = buildSeriesSchedule(code);
  let elapsed = 0, index = 0, disposed = false;
  const projectiles = createProjectiles({ capacity: 20, isRunning, onEvent(event) {
    events?.emit(`dodge:${event.type}`, Object.freeze({ ...event, attemptId, mode: 'challenge', level: series.level }));
  } });
  return {
    kind: 'dodge',
    snapshot: () => readonlySnapshot({ kind: 'dodge', series: true, level: series.level, code: series.code, elapsed, playerSpeed: DODGE_MOVEMENT_SPEED, ...getVitals(), projectiles: projectiles.snapshot() }),
    update(dt, previous, player) {
      if (disposed || !isRunning() || !Number.isFinite(dt) || dt <= 0 || dt > .1) return;
      if (![previous?.x, previous?.z, player?.x, player?.z].every(Number.isFinite)) throw new TypeError('Posição de série inválida.');
      const start = elapsed, end = Math.min(series.duration, elapsed + dt);
      let cursor = start;
      const at = time => { const t = Math.max(0, Math.min(1, (time - start) / dt)); return { x: previous.x + (player.x - previous.x) * t, z: previous.z + (player.z - previous.z) * t }; };
      while (index < jobs.length && jobs[index].at <= end + 1e-9 && isRunning()) {
        const job = jobs[index++], time = Math.max(cursor, Math.min(end, job.at));
        if (time > cursor) projectiles.update(time - cursor, at(cursor), at(time));
        cursor = time;
        if (!isRunning()) break;
        // aim is used only to measure exposure; origins/directions are precomputed.
        const id = projectiles.spawn({ ...job, aim: at(time) });
        if (!id) throw new Error('Capacidade da sequência excedida.');
        events?.emit('series:launch', readonlySnapshot({ attemptId, at: job.at, variant: job.variant, origin: job.origin, direction: job.direction }));
      }
      if (end > cursor && isRunning()) projectiles.update(end - cursor, at(cursor), at(end));
      elapsed = end;
    },
    dispose() { if (disposed) return; disposed = true; projectiles.clear(); },
  };
}
