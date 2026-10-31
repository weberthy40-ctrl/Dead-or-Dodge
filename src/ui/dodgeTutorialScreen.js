import { readDodgePlacement } from '../progression/dodgePlacement.js';
import { createDodgeTutorial } from '../training/dodge/tutorial.js';
import { createSession } from '../training/session.js';
import { loadPreferences } from '../settings/preferences.js';
import { mountDodgeReady } from './dodgeReady.js';
import { element, link } from './elements.js';

/** No repository, scoring or placement writes are available to this screen. */
export function mountDodgeTutorial({ screen, core, guided=false, loadPreview = () => import('../game3d/mountPreview.js') }) {
  const document = screen.ownerDocument;
  let storage;
  try { storage = document.defaultView.localStorage; } catch { /* Defaults work without storage. */ }
  const preferences = loadPreferences(storage), key = value => value.replace('Key', '');
  const steps = [
    ['Mova com intenção', 'Clique com o botão direito no chão e caminhe um pouco. A câmera acompanha seu personagem.'],
    ['Reposicione com Flash', `Aponte para o chão e pressione ${key(preferences.flashKey)}. O Flash desloca você imediatamente, até 4 unidades.`],
    ['Atravesse com dash', `Aponte para o chão e pressione ${key(preferences.dashKey)}. O dash é um deslocamento curto e não concede invulnerabilidade.`],
    ['Leia o aviso e saia da área', 'Lance o aviso abaixo e use o clique direito para sair do círculo antes do impacto. O aviso fica no ponto onde foi lançado.'],
  ];
  const host = element(document, 'section', 'dodge-tutorial');
  const panel = element(document, 'section', 'tutorial-panel');
  const eyebrow = element(document, 'p', 'eyebrow'), title = element(document, 'h2');
  const description = element(document, 'p', 'tutorial-description'), status = element(document, 'p', 'tutorial-status');
  status.setAttribute('role', 'status');
  const progress = element(document, 'progress'); progress.max = 4; progress.setAttribute('aria-label', 'Etapas do tutorial concluídas');
  const next = element(document, 'button', 'button primary', 'Continuar'); next.type = 'button';
  const cast = element(document, 'button', 'button primary', 'Lançar aviso'); cast.type = 'button';
  const pause = element(document, 'button', 'button', 'Pausar'); pause.type = 'button';
  const actions = element(document, 'div', 'tutorial-actions');
  actions.append(next, cast, pause, link(document, 'Sair do tutorial', '/train/dodge', 'text-link'));
  const destinations = element(document, 'div', 'tutorial-destinations'); destinations.hidden = true;
  destinations.append(link(document, 'Descobrir meu nível', '/assessment/dodge', 'button primary'), link(document, 'Escolher um desafio', '/train/dodge', 'button'));
  if(guided){destinations.replaceChildren(link(document,'Iniciar Esquiva Normal',`/play/dodge/normal/${readDodgePlacement(storage)?.level??1}`,'button primary'),link(document,'Preparar outro treino','/prepare/dodge','button'));}
  panel.append(eyebrow, progress, title, description, status, actions, destinations);
  const stage = element(document, 'div', 'stage'); stage.setAttribute('aria-label', 'Arena do tutorial de Esquiva');
  host.append(stage, panel); screen.append(host);
  const session = createSession({ countdown: 0, events: core.events, metadata: { origin: 'tutorial', modality: 'dodge' } });
  const exercise = createDodgeTutorial({ isRunning: () => session.snapshot().state === 'running' });
  let active = true, preview, ready, previousView = '';
  function focusArena() { const canvas = stage.querySelector('canvas'); if (canvas) { canvas.tabIndex = -1; canvas.focus({ preventScroll: true }); } }
  function update() {
    if (!active) return;
    const s = exercise.snapshot(), state = session.snapshot().state;
    if (s.complete && state === 'running') session.finish('tutorial-completed');
    const paused = state === 'paused', view = `${s.index}:${s.verified}:${s.casting}:${s.hits}:${state}`;
    if (view === previousView) return;
    previousView = view; host.dataset.step = s.complete ? 'complete' : s.step;
    progress.value = s.index + (s.verified ? 1 : 0);
    eyebrow.textContent = s.complete ? 'CONTROLES APRENDIDOS' : `APRENDER A ESQUIVAR · ${s.index + 1}/4`;
    title.textContent = s.complete ? 'Pronto para seu primeiro desafio' : steps[s.index][0];
    description.textContent = s.complete ? 'Você moveu, usou Flash e dash e saiu de uma área anunciada. A avaliação ajuda a encontrar seu ponto de partida.' : steps[s.index][1];
    status.textContent = paused ? 'Tutorial pausado. Retome quando estiver pronto.' : s.complete ? 'Tutorial concluído. Seu histórico e sua patente não foram alterados.' : s.verified ? 'Boa execução. Continue para a próxima etapa.' : s.casting ? 'Saia do círculo antes de o aviso terminar.' : s.hits && s.step === 'read' ? 'A área acertou você. Tente novamente: basta sair do círculo.' : 'Faça a ação na arena para avançar.';
    next.hidden = !s.verified || s.complete; next.disabled = paused;
    cast.hidden = s.step !== 'read' || s.verified; cast.disabled = s.casting || paused;
    cast.textContent = s.hits ? 'Tentar aviso novamente' : 'Lançar aviso';
    pause.hidden = state === 'idle' || s.complete; pause.textContent = paused ? 'Retomar tutorial' : 'Pausar';
    destinations.hidden = !s.complete;
  }
  next.addEventListener('click', () => { preview?.movement?.stop(); exercise.next(); update(); focusArena(); });
  cast.addEventListener('click', () => { preview?.movement?.stop(); exercise.launchThreat(); update(); focusArena(); });
  pause.addEventListener('click', () => { if (session.snapshot().state === 'paused') session.resume(); else session.pause(); update(); focusArena(); });
  const unsubscribe = core.events.on('session:changed', update);
  ready = mountDodgeReady({ screen, stage, session, title: 'Aprenda na arena', help: 'Quatro passos no seu ritmo. Você pode repetir ou sair a qualquer momento.', startLabel: 'Começar tutorial', onStart: update });
  update();
  Promise.resolve().then(loadPreview).then(({ mountPreview }) => {
    if (!active) return;
    const mounted = mountPreview(stage, { session, exercise, events: core.events, onTick: update, onError: error => {
      if (!active) return;
      host.dataset.failed='true';
      core.errors.report(error, { source: 'tutorial.dodge' }); session.finish('error'); ready.dispose();
      status.textContent = 'A arena não pôde continuar. Volte ao menu e tente novamente.';
      next.hidden = cast.hidden = pause.hidden = true;
    } });
    if (active) preview = mounted; else mounted.dispose();
  }).catch(error => {
    if (!active) return;
    host.dataset.failed='true';
    core.errors.report(error, { source: 'tutorial.dodge.load' }); ready.dispose();
    status.textContent = 'Não foi possível carregar a arena. Volte ao menu e tente novamente.';
    next.hidden = cast.hidden = pause.hidden = true;
  });
  return { dispose() { active = false; ready.dispose(); preview?.dispose(); unsubscribe(); exercise.dispose(); session.dispose(); host.remove(); } };
}
