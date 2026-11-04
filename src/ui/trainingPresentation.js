import { element, link } from './elements.js';

let sequence = 0;
const PHASES = { idle: 'PRONTO', countdown: 'PREPARAÇÃO', running: 'EM TREINO', paused: 'PAUSADO', finishing: 'ENCERRANDO', completed: 'CONCLUÍDO', abandoned: 'ABANDONADO', disposed: 'ENCERRADO' };

export function formatTrainingClock(snapshot, { duration = null, precision = 0 } = {}) {
  if (snapshot.state === 'countdown') return `COMEÇA EM ${Math.ceil(snapshot.countdown - snapshot.preparation)}`;
  if (snapshot.state === 'paused') return 'PAUSADO';
  return duration === null ? `${snapshot.elapsed.toFixed(precision)}s ativos` : `${Math.max(0, duration - snapshot.elapsed).toFixed(precision)}s restantes`;
}

/** Reuse the same facts without changing configuration, readiness or start behavior. */
export function appendTrainingBrief(container, context) {
  const doc = container.ownerDocument, facts = element(doc, 'dl', 'training-brief-facts');
  for (const [label, value] of [['Foco', context.objective], ['Condições', context.conditions], ['Comandos', context.commands]]) {
    const row = element(doc, 'div'); row.append(element(doc, 'dt', '', label), element(doc, 'dd', '', value)); facts.append(row);
  }
  container.append(facts); return facts;
}

/** Presentation follows one existing session. The original buttons keep their listeners. */
export function mountTrainingPresentation({ host, stage, controls, session, events, context, pauseButton, startButton, focusTarget = () => stage.querySelector('canvas') ?? stage }) {
  const doc = host.ownerDocument, id = `training-pause-${++sequence}`, attemptId = session.snapshot().id;
  let disposed = false, previousState = session.snapshot().state;
  const badge = element(doc, 'span', 'training-phase'); badge.setAttribute('aria-live', 'off');
  controls.classList.add('training-controls'); controls.prepend(badge);
  const pauseSlot = doc.createComment('training pause control'); pauseButton.before(pauseSlot);
  const dialog = element(doc, 'dialog', 'training-pause'), title = element(doc, 'h2', 'training-pause-title', 'Treino pausado');
  title.id = id; dialog.setAttribute('aria-labelledby', id);
  const content = element(doc, 'div', 'training-pause-content'), actions = element(doc, 'div', 'training-pause-actions');
  content.append(element(doc, 'p', 'training-context', context.title), element(doc, 'p', 'training-pause-note', 'Tempo ativo e exercício estão congelados. Retome quando estiver pronto.'));
  appendTrainingBrief(content, context);
  content.append(element(doc, 'p', 'training-exit-note', 'Voltar ao menu abandona esta rodada. Resultados já concluídos continuam salvos.'));
  const menu = link(doc, 'Voltar ao menu', '/', 'button'); actions.append(menu); dialog.append(title, content, actions); host.append(dialog);
  // Keep game shortcuts out of the modal; Tab and native button activation still work.
  const keydown = event => {
    event.stopPropagation();
    if (event.key === 'Escape' && !event.ctrlKey && !event.altKey && !event.metaKey) {
      event.preventDefault(); if (!event.repeat && session.snapshot().state === 'paused') pauseButton.click(); return;
    }
    if (event.key !== 'Tab' || event.ctrlKey || event.altKey || event.metaKey) return;
    const first = content.tabIndex === 0 ? content : pauseButton;
    if (event.shiftKey && doc.activeElement === first) { event.preventDefault(); menu.focus(); }
    else if (!event.shiftKey && doc.activeElement === menu) { event.preventDefault(); first.focus(); }
  }; dialog.addEventListener('keydown', keydown);
  const cancel = event => { event.preventDefault(); if (session.snapshot().state === 'paused') pauseButton.click(); };
  dialog.addEventListener('cancel', cancel);
  function restorePause() { if (pauseSlot.parentNode) pauseSlot.after(pauseButton); }
  function focusArena() { const target = focusTarget(); if (target) { if (target.tagName === 'CANVAS') target.tabIndex = -1; target.focus({ preventScroll: true }); } }
  function closePause(focus = false) {
    if (dialog.open) { if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open'); }
    restorePause(); if (focus) focusArena();
  }
  function openPause() {
    pauseButton.textContent = 'Retomar'; actions.prepend(pauseButton);
    if (doc.hidden) return;
    if (!dialog.open) { if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', ''); }
    content.tabIndex = content.scrollHeight > content.clientHeight ? 0 : -1;
    pauseButton.focus({ preventScroll: true });
    // Existing click handlers can focus the arena after session.pause() returns.
    queueMicrotask(() => { if (!disposed && dialog.open && session.snapshot().state === 'paused') pauseButton.focus({ preventScroll: true }); });
  }
  let ready, startSlot, readyStatus, observer, wasPrimary;
  if (startButton) {
    startSlot = doc.createComment('training start control'); startButton.before(startSlot);wasPrimary=startButton.classList.contains('primary');startButton.classList.add('primary');
    ready = element(doc, 'section', 'training-ready'); ready.setAttribute('aria-label', 'Preparação do treino');
    const card = element(doc, 'div', 'training-ready-card');
    card.append(element(doc, 'p', 'eyebrow', 'ANTES DE COMEÇAR'), element(doc, 'h2', '', context.title)); appendTrainingBrief(card, context);
    card.append(element(doc, 'p', 'training-configuration-note', 'Ajuste as opções acima antes de iniciar.'));
    readyStatus = element(doc, 'p', 'training-ready-status'); readyStatus.setAttribute('role', 'status');
    card.append(startButton, readyStatus); ready.append(card); host.append(ready);
    const updateReadiness = () => { if (!disposed && session.snapshot().state === 'idle') readyStatus.textContent = startButton.disabled ? 'Preparando arena…' : 'Arena pronta. O treino começa ao iniciar.'; };
    observer = new doc.defaultView.MutationObserver(updateReadiness); observer.observe(startButton, { attributes: true, attributeFilter: ['disabled'] }); updateReadiness();
  }
  function update() {
    if (disposed) return;
    const state = session.snapshot().state, label = PHASES[state] ?? 'PREPARAÇÃO';
    if (badge.textContent !== label) badge.textContent = label;
    if (badge.dataset.phase !== state) badge.dataset.phase = state;
    if (host.dataset.trainingPhase !== state) host.dataset.trainingPhase = state;
    if (ready) ready.hidden = state !== 'idle';
    if (state === 'paused') openPause();
    else { closePause(previousState === 'paused' && ['running', 'countdown'].includes(state)); pauseButton.textContent = 'Pausar'; }
    previousState = state;
  }
  const stop = events.on('session:changed', snapshot => { if (snapshot.id === attemptId) update(); });
  const visible = () => { if (!disposed && session.snapshot().state === 'paused') update(); };
  doc.addEventListener('visibilitychange', visible); update();
  return {
    dispose() {
      if (disposed) return; disposed = true; stop(); observer?.disconnect(); doc.removeEventListener('visibilitychange', visible);
      closePause(); if (startSlot?.parentNode) startSlot.after(startButton); if(startButton&&!wasPrimary)startButton.classList.remove('primary');delete host.dataset.trainingPhase; startSlot?.remove(); pauseSlot.remove(); ready?.remove(); badge.remove();
      dialog.removeEventListener('keydown', keydown); dialog.removeEventListener('cancel', cancel); dialog.remove(); controls.classList.remove('training-controls');
    },
  };
}
