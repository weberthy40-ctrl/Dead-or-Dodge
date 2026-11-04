// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { createEventBus } from '../../src/core/eventBus.js';
import { createSession } from '../../src/training/session.js';
import { formatTrainingClock, mountTrainingPresentation } from '../../src/ui/trainingPresentation.js';

const flush = async () => { for (let i = 0; i < 5; i++) await Promise.resolve(); };
const context = { title: 'Precisão · Nível 3', objective: 'Conclua o grupo.', conditions: '60 segundos ativos.', commands: 'Esquerdo acerta · ESC pausa.' };
const cleanups = [];
afterEach(() => { cleanups.splice(0).forEach(fn => fn()); vi.restoreAllMocks(); document.body.replaceChildren(); });
function setup(countdown = 3) {
  const host = document.createElement('main'), controls = document.createElement('div'), stage = document.createElement('div'), canvas = document.createElement('canvas'), start = document.createElement('button'), pause = document.createElement('button');
  controls.append(start, pause); stage.append(canvas); host.append(controls, stage); document.body.append(host); start.textContent = 'Iniciar treino'; start.disabled = pause.disabled = true; pause.textContent = 'Pausar';
  const events = createEventBus(), session = createSession({ countdown, events, metadata: { level: 3 } }), begin = vi.fn(() => { session.start(); start.disabled = true; pause.disabled = false; });
  start.addEventListener('click', begin); pause.addEventListener('click', () => session.snapshot().state === 'paused' ? session.resume() : session.pause());
  const view = mountTrainingPresentation({ host, stage, controls, session, events, context, startButton: start, pauseButton: pause });
  cleanups.push(() => { view.dispose(); session.dispose(); }); return { host, controls, stage, canvas, start, pause, events, session, view, begin };
}

it('keeps loading and configuration idle, then reuses the original start and resume controls', async () => {
  const app = setup(), before = app.session.snapshot();
  expect(app.host.querySelector('.training-ready button')).toBe(app.start); app.start.click(); expect(app.begin).not.toHaveBeenCalled();
  app.start.disabled = false; await flush(); expect(app.host.querySelector('.training-ready-status').textContent).toContain('Arena pronta'); expect(app.session.snapshot()).toEqual(before);
  app.start.click(); app.start.click(); expect(app.begin).toHaveBeenCalledOnce(); expect(app.session.snapshot().state).toBe('countdown'); expect(app.host.querySelector('.training-ready').hidden).toBe(true);
  app.pause.click(); await flush(); const dialog = app.host.querySelector('.training-pause'); expect(dialog.open).toBe(true); expect(dialog.querySelector('button')).toBe(app.pause); expect(document.activeElement).toBe(app.pause);
  const key = vi.fn(); window.addEventListener('keydown', key); dialog.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyQ', key: 'q', bubbles: true })); expect(key).not.toHaveBeenCalled(); window.removeEventListener('keydown', key);
  const menu = dialog.querySelector('a'); menu.focus(); const tab = new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', bubbles: true, cancelable: true }); menu.dispatchEvent(tab); expect(tab.defaultPrevented).toBe(true); expect(document.activeElement).toBe(app.pause);
  app.pause.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', code: 'Tab', shiftKey: true, bubbles: true, cancelable: true })); expect(document.activeElement).toBe(menu);
  const escape = new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true }); menu.dispatchEvent(escape); expect(escape.defaultPrevented).toBe(true); expect(dialog.open).toBe(false); expect(app.session.snapshot().state).toBe('countdown'); expect(app.pause.parentNode).toBe(app.controls); expect(document.activeElement).toBe(app.canvas);
});

it('waits for visibility before showing pause and never resumes from a visibility event', async () => {
  const app = setup(0); app.start.disabled = false; app.start.click(); app.session.update(.1);
  const hidden = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true); app.session.pause(); await flush(); expect(app.host.querySelector('.training-pause').open).toBe(false);
  const frozen = app.session.snapshot(); app.session.update(.1); expect(app.session.snapshot()).toEqual(frozen);
  hidden.mockReturnValue(false); document.dispatchEvent(new Event('visibilitychange')); await flush(); expect(app.host.querySelector('.training-pause').open).toBe(true); expect(app.session.snapshot()).toEqual(frozen);
  app.pause.click(); expect(app.session.snapshot().state).toBe('running'); expect(app.session.snapshot().elapsed).toBe(.1);
});

it('closes on completion and releases both moved controls and its listener on disposal', async () => {
  const app = setup(0); app.start.disabled = false; app.start.click(); app.pause.click(); await flush(); app.session.finish('abandoned');
  expect(app.host.querySelector('.training-pause').open).toBe(false); expect(app.session.snapshot().state).toBe('abandoned'); expect(app.pause.parentNode).toBe(app.controls);
  app.view.dispose(); app.view.dispose(); expect(app.start.parentNode).toBe(app.controls); expect(app.host.querySelectorAll('.training-ready,.training-pause,.training-phase')).toHaveLength(0); expect(app.events.emit('session:changed', app.session.snapshot())).toBe(0);
});

it('labels active practice time beyond a minute without manufacturing a countdown or changing the snapshot', () => {
  const snapshot = { state: 'running', elapsed: 125.2, countdown: 3, preparation: 0 }, before = JSON.stringify(snapshot);
  expect(formatTrainingClock(snapshot)).toBe('125s ativos'); expect(formatTrainingClock(snapshot, { duration: 60 })).toBe('0s restantes'); expect(formatTrainingClock({ ...snapshot, state: 'paused' })).toBe('PAUSADO'); expect(formatTrainingClock({ ...snapshot, state: 'countdown', preparation: 1.1 })).toBe('COMEÇA EM 2'); expect(JSON.stringify(snapshot)).toBe(before);
});
