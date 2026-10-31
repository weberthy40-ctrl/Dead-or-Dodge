// @vitest-environment jsdom
import { it, expect, vi } from 'vitest';
import { mountNavigation } from '../../src/ui/navigation.js';
import { createCore } from '../../src/core/createCore.js';

async function setup(save,path='#/challenge/dodge/dd1-linha-1A2B3C4D') {
  history.replaceState(null, '', path);
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

it.each(['linear','lance','hook','beam','area'])('reviews focused %s practice without recording an official or series result',async family=>{
 const app=await setup(undefined,`#/focus/dodge/${family}`);try{play(app);await app.settle();const dialog=app.root.querySelector('dialog');expect(dialog.open).toBe(true);expect(dialog.textContent).toContain('Treino focado');expect(app.repository.saveCompletedAttempt).not.toHaveBeenCalled();expect(app.root.querySelector('.series-save-status')).toBeNull();expect(app.root.querySelector('.replay-open')).not.toBeNull();expect(localStorage.getItem('moba-training:dodge-placement:v1')).toBeNull();const id=app.frame.session.snapshot().id;[...app.root.querySelectorAll('button')].find(b=>b.textContent==='Repetir exercício').click();await app.settle();expect(app.frame.session.snapshot().id).not.toBe(id);}finally{app.dispose();}
});

it('keeps focused comparison in memory across repeats and clears it when leaving the practice',async()=>{
 const app=await setup(undefined,'#/focus/dodge/area');try{play(app);await app.settle();expect(app.root.querySelector('.focus-coaching').dataset.status).toBe('practice');expect(app.root.querySelector('.focus-comparison')).toBeNull();[...app.root.querySelectorAll('button')].find(b=>b.textContent==='Repetir exercício').click();await app.settle();play(app);await app.settle();expect(app.root.querySelectorAll('.focus-comparison tbody tr')).toHaveLength(3);expect(app.repository.saveCompletedAttempt).not.toHaveBeenCalled();history.replaceState(null,'','#/prepare/dodge');window.dispatchEvent(new Event('hashchange'));history.replaceState(null,'','#/focus/dodge/area');window.dispatchEvent(new Event('hashchange'));await app.settle();play(app);await app.settle();expect(app.root.querySelector('.focus-comparison')).toBeNull();}finally{app.dispose();}
});
it('shows a completed practice objective from real moving telemetry without awarding official points',async()=>{
 const app=await setup(undefined,'#/focus/dodge/area');try{app.root.querySelector('.arena-ready button').click();const f=app.frame;let previous={x:0,z:0};for(let i=1;i<=601&&f.session.snapshot().state==='running';i++){f.session.update(.05);const t=f.session.snapshot().elapsed,player={x:Math.min(5,5*t)*Math.cos(Math.max(0,t-1)*.6),z:Math.min(5,5*t)*Math.sin(Math.max(0,t-1)*.6)};f.exercise.update(.05,previous,player);f.onStep(.05,previous,player);f.onTick();previous=player;}await app.settle();expect(app.root.querySelector('.focus-coaching').dataset.status).toBe('achieved');expect(app.root.querySelectorAll('.focus-goal-checks [data-achieved="true"]')).toHaveLength(2);expect(app.root.querySelector('.focus-next-skill').hash).toBe('#/prepare/dodge');expect(app.repository.saveCompletedAttempt).not.toHaveBeenCalled();}finally{app.dispose();}
});
