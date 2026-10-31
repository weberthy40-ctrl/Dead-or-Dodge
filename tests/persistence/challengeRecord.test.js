import { it, expect } from 'vitest';
import { challengeRecord } from '../fixtures/challengeRecord.js';
import { recordFixture } from '../fixtures/record.js';
import { validateChallengeRecord } from '../../src/persistence/challengeRecord.js';
import { validateAttemptRecord } from '../../src/persistence/attemptRecord.js';
import { createBackup, parseBackup } from '../../src/persistence/backup.js';
import { createSkillRating } from '../../src/progression/skillRating.js';
import { createDodgeProgress } from '../../src/progression/dodgeProgress.js';

it('records real challenge defeat and completion without becoming an official dodge record', () => {
  const defeat = challengeRecord(), completion = challengeRecord({ position: { x: 13, z: 21 } });
  expect(defeat).toMatchObject({ modality: 'dodge-challenge', mode: 'challenge', endReason: 'defeat', metrics: { validHits: 3 } });
  expect(completion).toMatchObject({ endReason: 'victory', metrics: { elapsedActiveSeconds: 30 } });
  expect(validateAttemptRecord(defeat)).toBe(defeat);
  const rating = createSkillRating('dodge'), progress = createDodgeProgress();
  rating.add(defeat); progress.add(defeat); expect(rating.snapshot().samples).toBe(0); expect(progress.snapshot().total).toBe(0);
});
it('round trips both old records and series through the current backup without rewriting either', () => {
  const old = recordFixture(), series = challengeRecord(), before = JSON.stringify([old, series]);
  const text = createBackup({ attempts: [old, series] }), restored = parseBackup(text);
  expect(JSON.stringify(restored.attempts)).toBe(before);
  expect(parseBackup(createBackup({ attempts: [old] })).attempts).toEqual([old]);
});
it('rejects mismatched codes, rules, metrics, outcomes and inconsistent time buckets', () => {
  const source = challengeRecord();
  const edits = [r => { r.code = 'dd1-areas-1A2B3C4D'; }, r => { r.seriesVersion = 'future'; }, r => { r.metrics.validHits = 2; }, r => { r.metrics.attacksNonThreatening = 999; }, r => { r.metrics.buckets[0].hit++; }, r => { r.metrics.elapsedActiveSeconds = 31; }, r => { r.endReason = r.metrics.endReason = 'abandoned'; }];
  for (const edit of edits) { const record = structuredClone(source); edit(record); expect(() => validateChallengeRecord(record)).toThrow(); }
});
