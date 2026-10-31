import { it, expect } from 'vitest';
import { buildDodgeFeedback, DODGE_ADVICE } from '../../src/training/dodge/feedback.js';
const metrics = { validHits: 3, threatsHit: 3, threatsDodged: 9, elapsedActiveSeconds: 42, endReason: 'defeat' };
it('uses actual impacts to offer advice for every current spell family', () => {
  expect(Object.keys(DODGE_ADVICE)).toHaveLength(10);
  for (const variant of Object.keys(DODGE_ADVICE)) {
    const result = buildDodgeFeedback(metrics, { [variant]: 2 });
    expect(result.observation).toContain('2 de 3 impactos'); expect(result.action).toBe(DODGE_ADVICE[variant]);
    expect(result).toMatchObject({ resolved: 12, dodged: 9, hits: 3, rate: 75 });
  }
});
it('does not turn unresolved or ignored contacts into successful dodges or overstate a short sample', () => {
  const result = buildDodgeFeedback({ ...metrics, validHits: 0, threatsHit: 0, threatsDodged: 2, threatsUnresolved: 18, contactsIgnored: 3 }, {});
  expect(result).toMatchObject({ resolved: 2, sample: false, rate: null });
  expect(result.headline).toBe('Ainda é cedo para avaliar');
  const good = buildDodgeFeedback({ ...metrics, validHits: 0, threatsHit: 0 }, {});
  expect(good.headline).toBe('Boa leitura nesta tentativa');
});
it('does not invent spell evidence from unknown, fractional or contradictory counts', () => {
  for (const counts of [{ toString: 2, unknown: 1 }, { artillery: 1.5 }, { artillery: 4 }]) {
    expect(buildDodgeFeedback(metrics, counts).headline).toBe('Encontre sua próxima saída');
  }
  expect(buildDodgeFeedback({ ...metrics, endReason: 'error' }, { artillery: 2 }).headline).toBe('Tentativa interrompida');
});
