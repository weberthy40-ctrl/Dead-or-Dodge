import { createEventBus } from '../../src/core/eventBus.js';
import { createSession } from '../../src/training/session.js';
import { createDodgeMode } from '../../src/training/dodge/mode.js';
import { createDodgeTelemetry } from '../../src/training/dodge/telemetry.js';
import { createSeriesExercise } from '../../src/training/dodge/seriesExercise.js';
import { parseSeriesCode, SERIES_VERSION } from '../../src/training/dodge/series.js';
import { createChallengeRecord } from '../../src/persistence/challengeRecord.js';

export function challengeRecord({ code = 'dd1-linha-1A2B3C4D', date = '2026-10-31T10:00:00.000Z', dt = .05, position = { x: 0, z: 0 } } = {}) {
  const series = parseSeriesCode(code), events = createEventBus(), session = createSession({ countdown: 0, timeLimit: 30, events });
  const rules = createDodgeMode({ session, mode: 'challenge', level: series.level, events });
  const metrics = createDodgeTelemetry({ session, mode: 'challenge', level: series.level, events, rulesetVersion: SERIES_VERSION });
  const exercise = createSeriesExercise({ code, events, attemptId: session.snapshot().id, isRunning: () => session.snapshot().state === 'running' });
  session.start();
  for (let n = 0; n < 10000 && !rules.snapshot().outcome; n++) {
    const before = session.snapshot().elapsed; session.update(dt);
    const delta = session.snapshot().elapsed - before;
    exercise.update(delta, position, position); metrics.step(delta, position, position); rules.evaluate(); metrics.step(0);
  }
  const record = createChallengeRecord(code, metrics.snapshot(), { completedAt: date });
  rules.dispose(); metrics.dispose(); exercise.dispose(); session.dispose();
  return record;
}
