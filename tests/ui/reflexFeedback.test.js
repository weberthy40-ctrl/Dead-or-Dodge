// @vitest-environment jsdom
import { expect, it, vi } from 'vitest';
import { createCore } from '../../src/core/createCore.js';
import { mountReflex } from '../../src/ui/reflexScreen.js';
import { mountReflexCoaching } from '../../src/ui/reflexCoaching.js';
import { reflexRecord } from '../fixtures/reflexRecord.js';
const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };

it('shows real error categories, pauses the signal and saves original metrics before repeating', async () => {
  let clock = 0, current; vi.spyOn(window.performance, 'now').mockImplementation(() => clock);
  const core = createCore(), screen = document.createElement('main'), repository = { saveCompletedAttempt: vi.fn(async () => {}) }; document.body.append(screen);
  const view = mountReflex({ screen, core, timed: true, repository, loadPreview: async () => ({ mountPreview(_stage, options) { current = options; return { dispose() {} }; } }) }); await flush();
  const tick = () => { clock += 100; const before = current.session.snapshot().elapsed; current.session.update(.1); current.exercise.update(current.session.snapshot().elapsed - before); current.onTick(); };
  const key = code => { const event = new KeyboardEvent('keydown', { code, key: code.slice(3).toLowerCase(), bubbles: true }); Object.defineProperty(event, 'timeStamp', { value: clock }); window.dispatchEvent(event); window.dispatchEvent(new KeyboardEvent('keyup', { code })); };
  [...screen.querySelectorAll('button')].find(b => b.textContent === 'Iniciar treino').click(); for (let i = 0; i < 30; i++) tick(); key('Space');
  expect(screen.querySelector('.reflex-response-title').textContent).toBe('Antecipação'); expect(screen.querySelector('.cue-command').textContent).not.toBe('Q');
  let wrong = false, omitted = false, impulse = false, omissionIndex = null;
  for (let frame = 0; frame < 650 && !screen.querySelector('dialog').open; frame++) {
    tick(); const p = current.exercise.snapshot(); if (p.phase !== 'cue-visible') continue;
    if (!omitted && p.cue.answer) { omissionIndex = p.round; omitted = true; }
    if (p.round === omissionIndex) continue;
    if (!wrong && p.cue.answer) { wrong = true; key(p.cue.answer === 'KeyQ' ? 'KeyW' : 'KeyQ'); expect(screen.querySelector('.reflex-response-title').textContent).toBe('Erro de escolha');
      current.session.pause(); current.onTick(); const frozen = current.exercise.snapshot(); clock += 10000; current.session.update(.1); current.exercise.update(.1); current.onTick(); expect(current.exercise.snapshot()).toEqual(frozen); expect(screen.querySelector('.reflex-signal').dataset.phase).toBe('paused'); expect(screen.querySelector('.reflex-signal').dataset.color).toBe('idle'); current.session.resume();
    } else if (!impulse && p.cue.answer === null) { impulse = true; key('KeyQ'); expect(screen.querySelector('.reflex-response-title').textContent).toBe('Erro por impulso'); }
    else if (p.cue.answer) current.exercise.respond(p.cue.answer, clock);
  }
  await flush(); expect(wrong && omitted && impulse).toBe(true); expect(screen.querySelector('dialog').open).toBe(true); expect(screen.querySelector('.reflex-save-status').textContent).toContain('Salvo neste dispositivo');
  const record = repository.saveCompletedAttempt.mock.calls[0][0], s = record.metrics.summary;
  expect(repository.saveCompletedAttempt).toHaveBeenCalledOnce(); expect(s).toMatchObject({ wrong: 1, anticipations: 1, omissions: 1, commissions: 1 }); expect(record.metrics).not.toHaveProperty('feedback'); expect(record.score.scoringVersion).toBe('reflex-score-v1');
  for (const [metric, value] of [['answered', s.correct - s.inhibited], ['inhibited', s.inhibited], ['anticipations', 1], ['wrong', 1], ['omissions', 1], ['commissions', 1]]) expect(screen.querySelector(`[data-metric='${metric}'] dd`).textContent).toBe(String(value));
  expect(screen.querySelector('.reflex-practice-link').hash).toBe('#/practice/reflex'); expect(screen.querySelectorAll('.reflex-rounds li')).toHaveLength(record.metrics.rounds.length); expect(screen.querySelector('.reflex-evidence').hasAttribute('open')).toBe(false);
  const previous = current.session.snapshot().id; screen.querySelector('.result-actions button').click(); await flush(); expect(current.session.snapshot().id).not.toBe(previous); expect(current.exercise.snapshot().summary.correct).toBe(0); expect(screen.querySelector('dialog').open).toBe(false); expect(screen.querySelector('.reflex-response-feedback').hidden).toBe(true);
  view.dispose(); expect(core.events.emit('reflex:response', { attemptId: previous, index: 1, status: 'wrong' })).toBe(0); core.dispose(); screen.remove();
});

it('finishes the existing 22-signal technical exercise without a score or persistence', async () => {
  let clock = 0, current; vi.spyOn(window.performance, 'now').mockImplementation(() => clock);
  const core = createCore(), screen = document.createElement('main'), repository = { saveCompletedAttempt: vi.fn() }; document.body.append(screen);
  const view = mountReflex({ screen, core, repository, loadPreview: async () => ({ mountPreview(_stage, options) { current = options; return { dispose() {} }; } }) }); await flush(); [...screen.querySelectorAll('button')].find(b => b.textContent === 'Iniciar prática').click();
  for (let frame = 0; frame < 800 && !screen.querySelector('dialog').open; frame++) { clock += 100; const before = current.session.snapshot().elapsed; current.session.update(.1); current.exercise.update(current.session.snapshot().elapsed - before); current.onTick(); const p = current.exercise.snapshot(); if (p.phase === 'cue-visible' && p.cue.answer) current.exercise.respond(p.cue.answer, clock); }
  expect(screen.querySelector('dialog').open).toBe(true); expect(screen.querySelector('.reflex-result').textContent).toContain('22 respostas corretas'); expect(current.exercise.config).toMatchObject({ technical: true, level: null, rounds: 22, responseWindow: 1400 }); expect(repository.saveCompletedAttempt).not.toHaveBeenCalled(); expect(screen.querySelector('.reflex-practice-link')).toBeNull(); view.dispose(); core.dispose(); screen.remove();
});

it('leaves missing reaction statistics empty instead of assigning zero milliseconds to inhibition', () => {
  const container = document.createElement('div'), s = reflexRecord().metrics.summary;
  mountReflexCoaching(container, { summary: { ...s, correct: 4, inhibited: 4, meanMs: null, medianMs: null, bestMs: null, reactionTimes: [] }, completed: true });
  expect([...container.querySelectorAll('.reflex-times dd')].map(e => e.textContent)).toEqual(['—', '—', '—']); expect(container.querySelector('[data-metric=answered] dd').textContent).toBe('0');
});

it('explains an unscorable minute and an abandoned replay without saving either one', async () => {
  let clock = 0, current; vi.spyOn(window.performance, 'now').mockImplementation(() => clock);
  const core = createCore(), screen = document.createElement('main'), repository = { saveCompletedAttempt: vi.fn() }; document.body.append(screen);
  const view = mountReflex({ screen, core, timed: true, repository, loadPreview: async () => ({ mountPreview(_stage, options) { current = options; return { dispose() {} }; } }) }); await flush(); [...screen.querySelectorAll('button')].find(b => b.textContent === 'Iniciar treino').click();
  for (let frame = 0; frame < 650 && !screen.querySelector('dialog').open; frame++) {
    clock += 100; const before = current.session.snapshot().elapsed; current.session.update(.1); current.exercise.update(current.session.snapshot().elapsed - before); current.onTick();
    if (current.exercise.snapshot().phase === 'waiting') { current.exercise.respond('Space', clock); current.onTick(); }
  }
  expect(screen.querySelector('dialog').open).toBe(true); expect(screen.querySelector('.reflex-save-status').textContent).toContain('não gerou registro oficial'); expect(repository.saveCompletedAttempt).not.toHaveBeenCalled();
  screen.querySelector('.result-actions button').click(); await flush(); [...screen.querySelectorAll('button')].find(b => b.textContent === 'Abandonar').click();
  expect(screen.querySelector('.reflex-save-status').textContent).toContain('Nenhum resultado oficial foi salvo'); expect(repository.saveCompletedAttempt).not.toHaveBeenCalled(); view.dispose(); core.dispose(); screen.remove();
});
