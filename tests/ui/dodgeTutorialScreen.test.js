// @vitest-environment jsdom
import { it, expect, vi } from 'vitest';
import { createCore } from '../../src/core/createCore.js';
import { mountNavigation } from '../../src/ui/navigation.js';
import { DEFAULT_PREFERENCES, PREFERENCES_KEY } from '../../src/settings/preferences.js';

it('teaches configured controls, pauses and completes without writing official progress or placement', async () => {
  localStorage.clear(); localStorage.setItem(PREFERENCES_KEY, JSON.stringify({ ...DEFAULT_PREFERENCES, flashKey: 'KeyF' }));
  history.replaceState(null, '', '#/learn/dodge');
  const root = document.createElement('div'); document.body.append(root);
  const core = createCore(), repository = { close: vi.fn(), saveCompletedAttempt: vi.fn() };
  let frame;
  const view = mountNavigation({ root, core, attemptRepository: repository, loadPreview: async () => ({ mountPreview(stage, options) { stage.dataset.visuals = 'ready'; frame = options; return { dispose() {}, movement: { stop() {} } }; } }) });
  try {
    for (let i = 0; i < 8; i++) await Promise.resolve();
    root.querySelector('.arena-ready button').click();
    frame.exercise.update(.1, { x: 0, z: 0 }, { x: .58, z: 0 }); frame.onTick();
    expect(root.querySelector('.tutorial-actions button').hidden).toBe(true);
    for (let i = 0; i < 5; i++) frame.exercise.update(.1, { x: i * .58, z: 0 }, { x: (i + 1) * .58, z: 0 });
    frame.onTick(); root.querySelector('.tutorial-actions button').click();
    expect(root.textContent).toContain('pressione F');
    frame.session.pause(); frame.exercise.onControl({ type: 'flash' }); frame.onTick();
    expect(frame.exercise.snapshot().verified).toBe(false);
    frame.session.resume(); frame.exercise.onControl({ type: 'flash' }); frame.onTick();
    root.querySelector('.tutorial-actions button').click();
    frame.exercise.onControl({ type: 'dash' }); frame.onTick(); root.querySelector('.tutorial-actions button').click();
    frame.exercise.launchThreat();
    let from = { x: 3, z: 0 };
    for (let i = 0; i < 30; i++) { const to = { x: 6, z: 0 }; frame.exercise.update(.1, from, to); from = to; }
    frame.onTick();
    expect(root.querySelector('.dodge-tutorial').dataset.step).toBe('complete');
    expect(repository.saveCompletedAttempt).not.toHaveBeenCalled();
    expect(localStorage.getItem('moba-training:dodge-placement:v1')).toBeNull();
    expect(localStorage.getItem(PREFERENCES_KEY)).toBe(JSON.stringify({ ...DEFAULT_PREFERENCES, flashKey: 'KeyF' }));
  } finally { view.dispose(); core.dispose(); root.remove(); localStorage.clear(); history.replaceState(null, '', '/'); }
});

it('ignores a late scene import after leaving the tutorial', async () => {
  history.replaceState(null, '', '#/learn/dodge');
  const root = document.createElement('div'), core = createCore(), mountPreview = vi.fn(); document.body.append(root);
  let resolve;
  const view = mountNavigation({ root, core, loadPreview: () => new Promise(done => { resolve = done; }) });
  await Promise.resolve();
  view.dispose(); resolve({ mountPreview }); await Promise.resolve(); await Promise.resolve();
  expect(mountPreview).not.toHaveBeenCalled(); core.dispose(); root.remove(); history.replaceState(null, '', '/');
});
