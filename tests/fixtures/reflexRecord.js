import { reflexDifficulty, REFLEX_CUES, REFLEX_VARIANTS } from '../../src/training/reflex/difficulty.js';
import { summarizeReactions } from '../../src/training/reflex/exercise.js';
import { calculateReflexScore } from '../../src/training/reflex/score.js';
import { createAttemptRecord } from '../../src/persistence/attemptRecord.js';

export function reflexRecord({
  id = 'reflex-test', variant = 'simple', level = 1,
  date = '2026-10-01T00:00:00.000Z', score, status = 'correct',
  reactionMs = 200, roundCount = 8,
} = {}) {
  const config = reflexDifficulty(level, variant);
  const cues = {
    integrated: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'Space', 'KeyF', 'KeyJ', 'MouseGreen', 'MouseBlue', 'MouseStop'],
    mixed: ['KeyQ', 'KeyW', 'KeyE', 'KeyR', 'Space', 'ArrowUp', 'go', 'noGo'],
    simple: ['Space'], choice: ['KeyF', 'KeyJ'], inhibition: ['go', 'noGo'],
    direction: ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'],
  }[variant];
  const rounds = Array.from({ length: roundCount }, (_, i) => {
    const cue = cues[i % cues.length], answer = REFLEX_CUES[cue].answer;
    const actualStatus = answer === null ? 'inhibited' : status;
    const timed = ['correct', 'wrong'].includes(actualStatus);
    return {
      index: i + 1, cue, status: actualStatus,
      response: timed ? (actualStatus === 'correct' ? answer : REFLEX_VARIANTS[variant].keys.find(key => key !== answer)) : null,
      reactionMs: timed ? reactionMs : null, presented: true,
      delayMs: config.waitMin, responseWindow: config.responseWindow,
    };
  });
  const metrics = {
    attemptId: id, origin: 'official', modality: 'reflex', metricsVersion: 'reflex-metrics-v1',
    variant, level, config, terminal: true, endReason: 'completed', elapsedActiveSeconds: 60,
    rounds, summary: summarizeReactions(rounds), extraAnticipations: 0, partialRound: null,
  };
  const calculated = structuredClone(calculateReflexScore(metrics));
  if (score !== undefined) {
    calculated.score = score;
    calculated.components.forEach(c => { c.index = score / 100; c.contribution = c.weight * c.index; });
  }
  return createAttemptRecord(metrics, calculated, { completedAt: date });
}
