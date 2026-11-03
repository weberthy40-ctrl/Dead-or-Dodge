import { expect, it } from 'vitest';
import { createEventBus } from '../../src/core/eventBus.js';
import { createRandom } from '../../src/core/random.js';
import { createReflexExercise } from '../../src/training/reflex/exercise.js';
import { REFLEX_CUES } from '../../src/training/reflex/difficulty.js';
import { buildReflexCoaching, describeReflexPresentation, describeReflexResponse, observeReflexFeedback } from '../../src/training/reflex/feedback.js';
import { reflexRecord } from '../fixtures/reflexRecord.js';

it('explains six resolved categories without revealing an anticipated cue or inventing inhibitory latency', () => {
  const round = { index: 1, presented: true, cue: 'KeyQ', response: 'KeyW', reactionMs: 125 };
  expect(describeReflexResponse({ ...round, status: 'wrong' }).detail).toContain('Era Q; resposta: W');
  expect(describeReflexResponse({ ...round, status: 'missed', response: null, reactionMs: null }).detail).toContain('sem resposta válida');
  for (const cue of ['KeyQ', 'MouseBlue']) expect(describeReflexResponse({ ...round, cue, status: 'anticipated', presented: false }).detail).not.toMatch(/Q|direito/);
  expect(describeReflexResponse({ ...round, status: 'commission', cue: 'MouseStop', reactionMs: null }).title).toBe('Erro por impulso');
  expect(describeReflexResponse({ ...round, status: 'inhibited', cue: 'MouseStop', response: null, reactionMs: null }).detail).not.toContain('0 ms');
  expect(describeReflexResponse({ ...round, status: 'correct', response: 'KeyQ', reactionMs: 0 }).detail).toContain('0 ms');
});

it('shows the requested command only during a presented phase, including pause and both mouse sides', () => {
  const snapshot = { phase: 'waiting', cue: REFLEX_CUES.KeyQ, rounds: [] }, session = { state: 'running' };
  expect(describeReflexPresentation(snapshot, session)).toMatchObject({ visible: false, input: 'none', command: '···', symbol: '' });
  for (const [cue, input, command] of [['KeyQ', 'keyboard', 'Q'], ['Space', 'keyboard', 'ESPAÇO'], ['MouseGreen', 'left', 'ESQUERDO'], ['MouseBlue', 'right', 'DIREITO'], ['MouseStop', 'inhibit', 'AGUARDE']]) {
    const active = { ...snapshot, phase: 'cue-pending', cue: REFLEX_CUES[cue] };
    expect(describeReflexPresentation(active, session)).toMatchObject({ visible: true, input, command, text: REFLEX_CUES[cue].text });
    expect(describeReflexPresentation(active, { state: 'paused' })).toMatchObject({ visible: false, input: 'none', text: 'Pausado' });
  }
  expect(describeReflexPresentation(snapshot, { state: 'countdown', countdown: 3, preparation: 1.1 })).toMatchObject({ visible: false, command: '2' });
});

it('retains one matching event, freezes its lifetime by active time and discards its listener', () => {
  const events = createEventBus(), round = { index: 1, status: 'wrong', cue: 'KeyQ', presented: true }; let time = 1;
  const feedback = observeReflexFeedback({ events, attemptId: 'one', getRound: () => round, activeTime: () => time });
  events.emit('reflex:response', { attemptId: 'other', index: 1, status: 'wrong' }); expect(feedback.snapshot()).toBeNull();
  events.emit('reflex:response', { attemptId: 'one', index: 1, status: 'correct' }); expect(feedback.snapshot()).toBeNull();
  events.emit('reflex:response', { attemptId: 'one', index: 1, status: 'wrong' }); expect(feedback.snapshot().round).toEqual(round);
  const frozen = feedback.snapshot(); expect(Object.isFrozen(frozen.round)).toBe(true); expect(feedback.snapshot()).toBe(frozen);
  time = 2.5; expect(feedback.snapshot()).toBeNull(); feedback.dispose(); expect(events.emit('reflex:response', { attemptId: 'one', index: 1, status: 'wrong' })).toBe(0);
});

it('keeps engine results and monotonic response times identical with and without feedback', () => {
  const events = createEventBus(); let clock = 0;
  const a = createReflexExercise({ variant: 'integrated', now: () => clock, rng: createRandom(53), events, attemptId: 'one' });
  const b = createReflexExercise({ variant: 'integrated', now: () => clock, rng: createRandom(53) });
  const feedback = observeReflexFeedback({ events, attemptId: 'one', getRound: index => a.snapshot().rounds[index - 1], activeTime: () => clock / 1000 });
  a.start(); b.start(); a.setRunning(true); b.setRunning(true); a.respond('Space'); b.respond('Space');
  for (let frame = 0; frame < 1600 && a.snapshot().state !== 'completed'; frame++) {
    clock += 50; a.update(.05); b.update(.05); const p = a.snapshot();
    if (p.phase === 'cue-pending') { a.present(); b.present(); }
    else if (p.phase === 'cue-visible' && p.cue.answer) { a.respond(p.cue.answer, clock); b.respond(p.cue.answer, clock); }
    feedback.snapshot(); expect(a.snapshot()).toEqual(b.snapshot());
  }
  expect(a.snapshot().state).toBe('completed'); expect(a.snapshot().summary.anticipations).toBe(1); expect(a.snapshot()).not.toHaveProperty('feedback'); feedback.dispose(); a.dispose(); b.dispose();
});

it('separates inhibitory successes, selects an observed error and preserves every official counter', () => {
  const s = structuredClone(reflexRecord({ variant: 'integrated', roundCount: 22 }).metrics.summary), before = JSON.stringify(s);
  expect(buildReflexCoaching({ summary: s, completed: true }).answered).toBe(s.correct - s.inhibited);
  expect(JSON.stringify(s)).toBe(before);
  for (const [field, priority] of [['commissions', 'impulse'], ['anticipations', 'anticipation'], ['wrong', 'choice'], ['omissions', 'omission']]) expect(buildReflexCoaching({ summary: { ...s, [field]: 4 }, completed: true }).priority).toBe(priority);
  expect(buildReflexCoaching({ summary: s, completed: false }).priority).toBe('interrupted');
  const small = { ...s, reactionTimes: [100], presented: 2 };
  expect(buildReflexCoaching({ summary: small, completed: true, technical: true })).toMatchObject({ priority: 'sample', smallSample: true });
  expect(buildReflexCoaching({ summary: { ...small, wrong: 1 }, completed: true, technical: true }).action).toContain('prática técnica');
});
