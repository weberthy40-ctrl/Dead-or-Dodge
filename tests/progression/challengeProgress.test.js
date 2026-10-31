import { it, expect } from 'vitest';
import { createChallengeProgress, recommendSeriesStep } from '../../src/progression/challengeProgress.js';
import { challengeRecord } from '../fixtures/challengeRecord.js';

it('compares only the exact code, deduplicates identities and keeps twenty recent attempts', () => {
  const record = challengeRecord(), progress = createChallengeProgress(record.code);
  progress.add(challengeRecord({ code: 'dd1-linha-00000000' }));
  for (let i = 0; i < 25; i++) progress.add({ ...record, attemptId: `attempt-${i}`, metrics:{...record.metrics,attemptId:`attempt-${i}`}, completedAt: `2026-10-${String(i + 1).padStart(2, '0')}T10:00:00.000Z` });
  progress.add({ ...record, attemptId: 'attempt-24', metrics:{...record.metrics,attemptId:'attempt-24'}, completedAt: '2026-10-25T10:00:00.000Z' });
  expect(progress.snapshot().recent).toHaveLength(20);
  expect(progress.snapshot().recent[0].attemptId).toBe('attempt-24');
  expect(progress.snapshot().recent.at(-1).attemptId).toBe('attempt-5');
});
it('does not claim mastery from low exposure or recommend variation from mixed codes', () => {
  const record = challengeRecord();
  expect(recommendSeriesStep([])).toContain('primeira tentativa');
  expect(recommendSeriesStep([record])).toContain('Poucas ameaças');
  const complete = { ...record, endReason: 'victory', metrics: { ...record.metrics, threatsDodged: 8, threatsHit: 0 } };
  expect(recommendSeriesStep([complete])).toContain('até três');
  expect(recommendSeriesStep([complete, { ...complete, code: 'other' }, { ...complete, code: 'other' }])).toContain('até três');
  expect(recommendSeriesStep([complete, complete, complete])).toContain('outra série');
});
