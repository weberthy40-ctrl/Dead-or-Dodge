import { it, expect } from 'vitest';
import { buildSeriesSchedule, parseSeriesCode, seriesCode, SERIES_DEFINITIONS } from '../../src/training/dodge/series.js';
import { createSeriesExercise } from '../../src/training/dodge/seriesExercise.js';
import { createEventBus } from '../../src/core/eventBus.js';

it('normalizes codes, preserves seed zero and rejects unsupported versions or malformed input', () => {
  expect(parseSeriesCode(' DD1-LINHA-00000000 ').code).toBe('dd1-linha-00000000');
  expect(seriesCode('misto', 0xffffffff)).toBe('dd1-misto-FFFFFFFF');
  for (const value of ['dd2-linha-12345678', 'dd1-linha-123', 'dd1-unknown-12345678', 'dd1-linha-12345678/extra', null]) expect(() => parseSeriesCode(value)).toThrow();
  for (const seed of [-1, 1.1, 0x100000000]) expect(() => seriesCode('linha', seed)).toThrow();
});
it('fixes timings and world positions independently of any player state and returns immutable schedules', () => {
  for (const item of SERIES_DEFINITIONS) {
    const code = seriesCode(item.id, item.seed), a = buildSeriesSchedule(code);
    expect(a).toEqual(buildSeriesSchedule(code.toLowerCase()));
    expect(a.jobs).toHaveLength(19); expect(a.jobs.at(-1).at).toBeLessThan(30);
    expect(Object.isFrozen(a.jobs[0].origin)).toBe(true);
    expect(a).not.toEqual(buildSeriesSchedule(seriesCode(item.id, item.seed + 1)));
  }
});
it('launches the same jobs at the same logical times with different frame slices and player positions', () => {
  for (const definition of SERIES_DEFINITIONS) {
    const run = (dt, position) => {
      const events = createEventBus(), launches = [];
      events.on('series:launch', event => { const { attemptId: _id, ...job } = event; void _id; launches.push(job); });
      const exercise = createSeriesExercise({ code: seriesCode(definition.id, definition.seed), events, attemptId: 'test' });
      for (let t = 0; t < 30 - 1e-9; t += dt) exercise.update(Math.min(dt, 30 - t), position, position);
      exercise.dispose(); return launches;
    };
    const reference = run(.05, { x: 0, z: 0 });
    expect(reference).toHaveLength(19);
    expect(run(.1, { x: 12, z: 20 })).toEqual(reference);
    expect(run(1 / 60, { x: -12, z: -20 })).toEqual(reference);
  }
});
it('does not advance or spawn while paused and stops accepting updates after disposal', () => {
  let running = true;
  const exercise = createSeriesExercise({ code: 'dd1-linha-1A2B3C4D', isRunning: () => running });
  const p = { x: 0, z: 0 }; for (let i = 0; i < 30; i++) exercise.update(.1, p, p);
  running = false; const before = exercise.snapshot(); for (let i = 0; i < 200; i++) exercise.update(.1, p, p);
  expect(exercise.snapshot()).toEqual(before); exercise.dispose(); running = true; exercise.update(.1, p, p);
  expect(exercise.snapshot().projectiles).toEqual([]);
});
