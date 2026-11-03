// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { mountHomeHub } from '../../src/ui/homeHub.js';
import { trainingPlan, resumeTraining } from '../../src/ui/homeTraining.js';
import { resolveRoute } from '../../src/ui/routes.js';
import { recordFixture } from '../fixtures/record.js';
import { precisionRecord } from '../fixtures/precisionRecord.js';
import { kitingRecord } from '../fixtures/kitingRecord.js';

afterEach(() => document.body.replaceChildren());
const settle = () => new Promise(resolve => setTimeout(resolve, 0));
function mount(repository, dodgePlacement = null) {
  const screen = document.createElement('main');
  document.body.append(screen);
  const view = mountHomeHub({ screen, repository, dodgePlacement });
  return { screen, view };
}
const emptyRepository = () => ({ listCompletedAttempts: vi.fn(async () => ({ items: [] })) });

it('offers existing optional training routes with the saved dodge recommendation, without changing it', async () => {
  const repository = emptyRepository(), placement = { level: 12 };
  const { screen, view } = mount(repository, placement);
  await settle();
  expect(repository.listCompletedAttempts.mock.calls.map(([filters]) => filters)).toEqual([
    { modality: 'dodge', limit: 1 }, { modality: 'precision', limit: 1 },
    { modality: 'kiting', limit: 1 }, { modality: 'reflex', limit: 1 },
  ]);
  expect(screen.querySelector('.hub-steps a[href="#/play/dodge/normal/12"]')).not.toBeNull();
  expect(screen.querySelector('.hub-recent').textContent).toContain('Sua primeira sessão');
  const choices = [...screen.querySelectorAll('.hub-choice')];
  for (const [index, modality] of ['dodge', 'precision', 'kiting', 'reflex'].entries()) {
    choices[index].click();
    expect(choices.filter(button => button.getAttribute('aria-pressed') === 'true')).toEqual([choices[index]]);
    expect(screen.querySelectorAll('.hub-steps li')).toHaveLength(3);
    for (const step of trainingPlan(modality, { dodgeLevel: 12 })) expect(resolveRoute(`#${step.path}`).path).not.toBe('/404');
  }
  expect(placement).toEqual({ level: 12 });
  view.dispose();
});

it('resumes the newest real saved level, while the selected plan keeps its own modality', async () => {
  const kiting = kitingRecord({ level: 7, date: '2026-11-02T10:00:00.000Z', controlProfile: 'quick-attack' });
  const precision = precisionRecord({ level: 4, date: '2026-11-01T10:00:00.000Z' });
  const before = JSON.stringify([kiting, precision]);
  const repository = { async listCompletedAttempts({ modality }) { return { items: modality === 'kiting' ? [kiting] : modality === 'precision' ? [precision] : [] }; } };
  const { screen, view } = mount(repository);
  screen.querySelectorAll('.hub-choice')[1].click();
  await settle();
  expect(screen.querySelector('.hub-recent a').hash).toBe('#/train/kiting/7');
  expect(screen.querySelector('.hub-recent').textContent).toContain('Nível 7');
  expect(screen.querySelector('.hub-plan-title').textContent).toBe('Foco em Precisão de clique');
  expect(screen.querySelector('.hub-steps a[href="#/timed/precision/4"]')).not.toBeNull();
  expect(JSON.stringify([kiting, precision])).toBe(before);
  view.dispose();
});

it('preserves survival routing and rejects unknown modes, invalid levels and malformed dates', () => {
  const normal = recordFixture();
  expect(resumeTraining(normal)).toBe('/play/dodge/normal/1');
  expect(resumeTraining({ ...normal, mode: 'survival', level: 20 })).toBe('/play/dodge/survival/20');
  for (const patch of [{ mode: 'technical' }, { modality: 'dodge-challenge' }, { level: 21 }, { level: 0 }, { completedAt: 'invalid' }]) {
    expect(resumeTraining({ ...normal, ...patch })).toBeNull();
  }
  expect(resumeTraining(null)).toBeNull();
});

it('distinguishes unavailable history from empty history and can retry without blocking training', async () => {
  let failing = true;
  const repository = { async listCompletedAttempts({ modality }) {
    if (failing && modality === 'dodge') throw Error('blocked');
    return { items: modality === 'dodge' ? [recordFixture()] : [] };
  } };
  const { screen, view } = mount(repository);
  await settle();
  expect(screen.textContent).toContain('Parte do histórico não pôde ser consultada');
  expect(screen.textContent).not.toContain('Nenhum treino oficial');
  expect(screen.querySelectorAll('.hub-steps a')).toHaveLength(3);
  failing = false;
  screen.querySelector('.hub-retry').click();
  await settle();
  expect(screen.querySelector('.hub-retry')).toBeNull();
  expect(screen.querySelector('.hub-recent a').hash).toBe('#/play/dodge/normal/1');
  view.dispose();
});

it('marks partial reads and does not silently call the available record the newest across all history', async () => {
  const repository = { async listCompletedAttempts({ modality }) {
    if (modality === 'precision') throw Error('unavailable');
    return { items: modality === 'dodge' ? [recordFixture()] : [] };
  } };
  const { screen, view } = mount(repository);
  await settle();
  expect(screen.querySelector('.hub-recent a').hash).toBe('#/play/dodge/normal/1');
  expect(screen.querySelector('.hub-recent').textContent).toContain('A retomada pode estar incompleta');
  view.dispose();
});

it('ignores late history reads after leaving the home screen', async () => {
  let resolve;
  const pending = new Promise(done => { resolve = done; });
  const repository = { listCompletedAttempts: () => pending };
  const { screen, view } = mount(repository);
  view.dispose();
  resolve({ items: [] });
  await settle();
  expect(screen.children).toHaveLength(0);
});
