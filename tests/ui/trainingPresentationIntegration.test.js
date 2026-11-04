// @vitest-environment jsdom
import { expect, it, vi } from 'vitest';
import { createCore } from '../../src/core/createCore.js';
import { mountNavigation } from '../../src/ui/navigation.js';
const flush = async () => { for (let i = 0; i < 8; i++) await Promise.resolve(); };

it.each([
  ['/play/dodge/normal/1', 'Esquiva', 'Três vidas', 'running'],
  ['/timed/precision/3', 'Precisão', '60 segundos', 'countdown'],
  ['/timed/kiting/3', 'Kiting', '60 segundos', 'countdown'],
  ['/timed/reflex/3', 'Reflexos', '60 segundos', 'countdown'],
])('preserves start, pause, resume and abandoned navigation for %s', async (path, name, condition, startedState) => {
  window.history.replaceState(null, '', `#${path}`); const root = document.createElement('div'); document.body.append(root); const core = createCore(), repository = { saveCompletedAttempt: vi.fn(), close() {} }; let frame;
  const app = mountNavigation({ root, core, attemptRepository: repository, loadPreview: async () => ({ mountPreview(stage, options) { frame = options; const canvas = document.createElement('canvas'); stage.append(canvas); stage.dataset.visuals = 'ready'; return { dispose() { canvas.remove(); } }; } }) });
  try {
    await flush(); const ready = root.querySelector('.training-ready'); expect(ready.textContent).toContain(name); expect(ready.textContent).toContain(condition); expect(ready.querySelectorAll('.training-brief-facts>div')).toHaveLength(3); expect(frame.session.snapshot()).toMatchObject({ state: 'idle', elapsed: 0 });
    ready.querySelector('button').click(); await flush(); expect(frame.session.snapshot().state).toBe(startedState);
    const button = [...root.querySelectorAll('button')].find(b => b.textContent === 'Pausar'); button.click(); await flush(); const dialog = root.querySelector('.training-pause'); expect(dialog.open).toBe(true); expect(dialog.querySelector('button')).toBe(button); expect(document.activeElement).toBe(button);
    const frozen = frame.session.snapshot(), exercise = frame.exercise.snapshot(); frame.session.update(.1); frame.onTick(); expect(frame.session.snapshot()).toEqual(frozen); expect(frame.exercise.snapshot()).toEqual(exercise);
    dialog.dispatchEvent(new Event('cancel', { cancelable: true })); await flush(); expect(dialog.open).toBe(false); expect(frame.session.snapshot().state).toBe(startedState); expect(document.activeElement).toBe(name === 'Reflexos' ? root.querySelector('.reflex-stage') : root.querySelector('canvas'));
    button.click(); await flush(); expect(dialog.open).toBe(true); const menu = dialog.querySelector('a'); expect(menu.hash).toBe('#/'); window.history.replaceState(null, '', '#/levels'); window.dispatchEvent(new Event('hashchange')); await flush(); expect(root.querySelector('.training-pause')).toBeNull(); expect(frame.session.snapshot().state).toBe('disposed'); expect(repository.saveCompletedAttempt).not.toHaveBeenCalled();
  } finally { app.dispose(); core.dispose(); root.remove(); window.history.replaceState(null, '', '/'); window.localStorage.clear(); }
});

it.each(['/practice/precision', '/practice/kiting'])('shows elapsed practice time after one minute in %s', async path => {
  window.history.replaceState(null, '', `#${path}`); const root = document.createElement('div'); document.body.append(root); const core = createCore(), repository = { saveCompletedAttempt: vi.fn(), close() {} }; let frame;
  const app = mountNavigation({ root, core, attemptRepository: repository, loadPreview: async () => ({ mountPreview(stage, options) { frame = options; const canvas = document.createElement('canvas'); stage.append(canvas); stage.dataset.visuals = 'ready'; return { dispose() { canvas.remove(); } }; } }) });
  try {
    await flush(); root.querySelector('.training-ready button').click(); for (let step = 0; step < 710; step++) frame.session.update(.1); frame.onTick();
    expect(frame.session.snapshot().elapsed).toBeGreaterThan(60); expect(root.querySelector('.training-statistics').textContent).toContain(`${frame.session.snapshot().elapsed.toFixed(0)}s ativos`); expect(repository.saveCompletedAttempt).not.toHaveBeenCalled();
  } finally { app.dispose(); core.dispose(); root.remove(); window.history.replaceState(null, '', '/'); window.localStorage.clear(); }
});
