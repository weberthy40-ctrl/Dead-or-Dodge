// @vitest-environment jsdom
import { it, expect, vi } from 'vitest';
import { mountNavigation } from '../../src/ui/navigation.js';
import { createCore } from '../../src/core/createCore.js';

async function setup(save) {
  history.replaceState(null, '', '#/challenge/dodge/dd1-linha-1A2B3C4D');
  const root = document.createElement('div'); document.body.append(root);
  const core = createCore(), saved = [], repository = {
    close() {},
    saveCompletedAttempt: vi.fn(save ?? (async record => { saved.push(record); return { status: 'saved' }; })),
    async scanCompletedAttempts({ modality, onRecord }) { for (const record of saved) if (record.modality === modality) onRecord(record); return { invalid: 0 }; },
  };
  let frame;
  const view = mountNavigation({ root, core, attemptRepository: repository, loadPreview: async () => ({ mountPreview(stage, options) { stage.dataset.visuals = 'ready'; frame = options; return { dispose() {} }; } }) });
  const settle = async () => { for (let i = 0; i < 10; i++) await Promise.resolve(); };
  await settle();
  return { root, core, repository, settle, get frame() { return frame; }, dispose() { view.dispose(); core.dispose(); root.remove(); history.replaceState(null, '', '/'); } };
}
function play(app) {
  app.root.querySelector('.arena-ready button').click();
  const f = app.frame, position = { x: 0, z: 0 };
  for (let i = 0; i < 1000 && f.session.snapshot().state === 'running'; i++) {
    const before = f.session.snapshot().elapsed; f.session.update(.05);
    const dt = f.session.snapshot().elapsed - before;
    f.exercise.update(dt, position, position); f.onStep(dt, position, position); f.onTick();
  }
}
it('saves a separate challenge and retries the same ID after a storage failure', async () => {
  let calls = 0;
  const app = await setup(async () => { if (++calls === 1) throw new Error('quota'); return { status: 'saved' }; });
  try {
    play(app); await app.settle();
    expect(app.repository.saveCompletedAttempt).toHaveBeenCalledOnce();
    const record = app.repository.saveCompletedAttempt.mock.calls[0][0];
    expect(record.modality).toBe('dodge-challenge');
    const retry = [...app.root.querySelectorAll('button')].find(b => b.textContent === 'Tentar salvar novamente');
    expect(retry.hidden).toBe(false); retry.click(); await app.settle();
    expect(app.repository.saveCompletedAttempt.mock.calls[1][0]).toBe(record);
    expect(app.root.querySelector('.series-save-status').textContent).toBe('Salvo neste dispositivo');
    expect(localStorage.getItem('moba-training:dodge-placement:v1')).toBeNull();
  } finally { app.dispose(); }
});
it('repeats the exact code with a new identity and shows the matching history', async () => {
  const app = await setup();
  try {
    play(app); await app.settle(); const first = app.frame.session.snapshot().id;
    expect(app.root.querySelectorAll('.series-history-table tbody tr')).toHaveLength(1);
    [...app.root.querySelectorAll('button')].find(b => b.textContent === 'Repetir a mesma série').click(); await app.settle();
    expect(app.frame.session.snapshot().id).not.toBe(first); play(app); await app.settle();
    expect(app.root.querySelectorAll('.series-history-table tbody tr')).toHaveLength(2);
    expect(new Set(app.repository.saveCompletedAttempt.mock.calls.map(([record]) => record.code))).toEqual(new Set(['dd1-linha-1A2B3C4D']));
  } finally { app.dispose(); }
});
it('abandons an unfinished series without recording a result', async () => {
  const app = await setup();
  try {
    app.root.querySelector('.arena-ready button').click();
    history.replaceState(null, '', '#/challenges/dodge'); window.dispatchEvent(new Event('hashchange')); await app.settle();
    expect(app.repository.saveCompletedAttempt).not.toHaveBeenCalled();
    expect(app.root.querySelectorAll('.series-grid article')).toHaveLength(3);
    const form = app.root.querySelector('.series-code-form'), input = form.querySelector('input');
    input.value = 'dd2-linha-12345678'; form.dispatchEvent(new Event('submit', { cancelable: true }));
    expect(form.textContent).toContain('Use um código'); expect(location.hash).toBe('#/challenges/dodge');
  } finally { app.dispose(); }
});
