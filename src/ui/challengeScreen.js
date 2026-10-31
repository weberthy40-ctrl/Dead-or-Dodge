import { parseSeriesCode, SERIES_VERSION } from '../training/dodge/series.js';
import { createSeriesExercise } from '../training/dodge/seriesExercise.js';
import { createDodgeMode } from '../training/dodge/mode.js';
import { createDodgeTelemetry } from '../training/dodge/telemetry.js';
import { createDodgeReplay } from '../training/dodge/replay.js';
import { createSession } from '../training/session.js';
import { createChallengeRecord } from '../persistence/challengeRecord.js';
import { loadChallengeProgress, recommendSeriesStep } from '../progression/challengeProgress.js';
import { mountDodgeReady } from './dodgeReady.js';
import { mountDodgeFeedback } from './dodgeFeedback.js';
import { mountDodgeReplayReview } from './dodgeReplayReview.js';
import { element, link } from './elements.js';
import { formatDate } from './formatters.js';

function historyView(host, progress, doc) {
  host.replaceChildren(element(doc, 'h3', '', 'Tentativas deste código'), element(doc, 'code', 'series-code', progress.code));
  host.append(element(doc, 'p', 'muted', 'Compare usando o mesmo computador e os mesmos controles. A exposição às ameaças depende de onde você se movimentou.'));
  const table = element(doc, 'table', 'series-history-table'), head = element(doc, 'tr');
  for (const label of ['Quando', 'Tempo', 'Impactos', 'Evitadas / resolvidas']) head.append(element(doc, 'th', '', label));
  const thead = element(doc, 'thead'); thead.append(head); table.append(thead);
  const body = element(doc, 'tbody');
  for (const record of progress.recent) {
    const m = record.metrics, row = element(doc, 'tr');
    row.dataset.attempt = record.attemptId;
    for (const value of [formatDate(record.completedAt), `${m.elapsedActiveSeconds.toFixed(1)} s`, `${m.validHits}/3`, `${m.threatsDodged}/${m.threatsDodged + m.threatsHit}`]) row.append(element(doc, 'td', '', value));
    body.append(row);
  }
  table.append(body); const scroll = element(doc, 'div', 'table-wrapper'); scroll.append(table); host.append(scroll);
  host.append(element(doc, 'p', 'series-next-step', recommendSeriesStep(progress.recent)));
  if (progress.recent.length < 2) host.append(element(doc, 'p', 'status-note', 'Repita este código para ter outra tentativa com a mesma sequência de lançamentos.'));
}

export function mountChallengeScreen({ screen, core, repository, code, loadPreview = () => import('../game3d/mountPreview.js') }) {
  const series = parseSeriesCode(code), doc = screen.ownerDocument, host = element(doc, 'section', 'series-play');
  screen.classList.add('dodge-screen'); screen.append(host);
  let active = true, revision = 0, cleanupRound = () => {};
  function renderRound() {
    revision++; cleanupRound(); const token = revision;
    const session = createSession({ countdown: 0, timeLimit: series.duration, events: core.events, metadata: { origin: 'challenge', code: series.code } });
    const rules = createDodgeMode({ session, mode: 'challenge', level: series.level, events: core.events });
    const telemetry = createDodgeTelemetry({ session, mode: 'challenge', level: series.level, events: core.events, rulesetVersion: SERIES_VERSION });
    const recording = createDodgeReplay();
    const exercise = createSeriesExercise({ code: series.code, events: core.events, attemptId: session.snapshot().id, isRunning: () => session.snapshot().state === 'running', getVitals: () => ({ lives: rules.snapshot().lives, maxLives: 3 }) });
    const stage = element(doc, 'div', 'stage'), badge = element(doc, 'div', 'series-playing-code');
    badge.append(element(doc, 'span', 'eyebrow', series.title), element(doc, 'code', 'series-code', series.code));
    const hud = element(doc, 'div', 'session-hud'), status = element(doc, 'p', 'series-status');
    const pause = element(doc, 'button', 'button', 'Pausar'); pause.type = 'button';
    pause.addEventListener('click', () => { if (session.snapshot().state === 'paused') session.resume(); else session.pause(); focus(); });
    hud.append(status, pause, link(doc, 'Sair / abandonar', '/challenges/dodge', 'button dodge-exit'));
    const dialog = element(doc, 'dialog', 'result-metrics series-result'); dialog.hidden = true;
    dialog.setAttribute('aria-labelledby', 'series-result-title'); dialog.addEventListener('cancel', event => event.preventDefault());
    const errorHost = element(doc, 'section', 'series-error'); errorHost.hidden = true; errorHost.setAttribute('role', 'alert');
    host.replaceChildren(stage, badge, hud, dialog, errorHost);
    let preview, review, ready, shown = false;
    const current = () => active && revision === token;
    function focus() { const canvas = stage.querySelector('canvas'); if (canvas) { canvas.tabIndex = -1; canvas.focus({ preventScroll: true }); } }
    function failure(error) {
      if (!current()) return;
      core.errors.report(error, { source: 'series.dodge' });
      ready?.dispose(); rules.fail(); pause.disabled = true;
      errorHost.hidden = false;
      errorHost.replaceChildren(element(doc, 'h2', '', 'Série interrompida'), element(doc, 'p', '', 'Não foi possível continuar a arena. Esta tentativa não será registrada.'), link(doc, 'Voltar às séries', '/challenges/dodge', 'button'));
    }
    function finish() {
      shown = true; hud.hidden = true; dialog.hidden = false;
      const metrics = telemetry.snapshot(), result = recording.snapshot();
      const title = element(doc, 'h2', 'result-title', rules.snapshot().outcome === 'victory' ? 'Série concluída' : 'Fim desta tentativa'); title.id = 'series-result-title';
      const content = element(doc, 'div', 'result-content');
      mountDodgeFeedback({ container: content, metrics, recording: result });
      content.append(element(doc, 'p', 'status-note', 'Resultado das séries: não altera sua patente ou seu nível no Normal.'));
      const saveStatus = element(doc, 'p', 'series-save-status', 'Salvando tentativa da série…'); saveStatus.setAttribute('role', 'status');
      const retry = element(doc, 'button', 'button', 'Tentar salvar novamente'); retry.type = 'button'; retry.hidden = true;
      const history = element(doc, 'section', 'series-comparison');
      const readRetry = element(doc, 'button', 'button', 'Recarregar comparação'); readRetry.type = 'button'; readRetry.hidden = true;
      content.append(saveStatus, retry, history, readRetry);
      let busy = false, record;
      async function compare() {
        readRetry.hidden = true;
        try { const progress = await loadChallengeProgress(repository, series.code); if (current()) historyView(history, progress, doc); }
        catch (error) { core.errors.report(error, { source: 'series.history' }); if (current()) { history.replaceChildren(element(doc, 'p', 'status-note', 'Não foi possível ler as tentativas anteriores.')); readRetry.hidden = false; } }
      }
      async function save() {
        if (busy) return; busy = true; retry.hidden = true; saveStatus.textContent = 'Salvando tentativa da série…';
        try {
          record ??= createChallengeRecord(series.code, metrics);
          await repository.saveCompletedAttempt(record);
          if (!current()) return;
          saveStatus.textContent = 'Salvo neste dispositivo'; await compare();
        } catch (error) {
          core.errors.report(error, { source: 'series.save' });
          if (current()) { saveStatus.textContent = 'Não foi possível salvar esta tentativa. Você pode tentar novamente.'; retry.hidden = false; }
        } finally { busy = false; }
      }
      retry.addEventListener('click', save); readRetry.addEventListener('click', compare);
      review = mountDodgeReplayReview({ container: content, recording: result, loadPreview });
      const actions = element(doc, 'div', 'result-actions');
      const again = element(doc, 'button', 'button primary', 'Repetir a mesma série'); again.type = 'button'; again.addEventListener('click', renderRound);
      actions.append(again, link(doc, 'Escolher outra série', '/challenges/dodge', 'button')); dialog.append(title, content, actions);
      if (dialog.showModal) dialog.showModal(); else dialog.setAttribute('open', '');
      again.focus(); save();
    }
    function update() {
      if (!current()) return;
      const s = session.snapshot(), lives = rules.snapshot().lives;
      const label = s.state === 'paused' ? 'Pausado' : s.state === 'idle' ? 'Pronto para iniciar' : `Restam ${Math.max(0, series.duration - s.elapsed).toFixed(1)} s`;
      status.textContent = `${label} · Vidas: ${lives}/3`; pause.disabled = s.state === 'idle'; pause.textContent = s.state === 'paused' ? 'Retomar' : 'Pausar';
      rules.evaluate();
      const outcome = rules.snapshot().outcome;
      if (['victory', 'defeat'].includes(outcome) && !shown) { telemetry.step(0); if (telemetry.isFinal()) finish(); }
    }
    const unsubscribe = core.events.on('session:changed', update);
    const stopDamage = core.events.on('dodge:damage', event => { if (event.attemptId === session.snapshot().id) recording.mark({ time: session.snapshot().elapsed, variant: event.variant, id: event.attackId }); });
    ready = mountDodgeReady({ screen, stage, session, title: series.title, help: '30 segundos, três vidas. Repita o mesmo código para reencontrar os mesmos lançamentos.', startLabel: 'Iniciar série', onStart: update });
    cleanupRound = () => { unsubscribe(); stopDamage(); ready.dispose(); review?.dispose(); preview?.dispose(); if (dialog.open) dialog.close?.(); rules.dispose(); telemetry.dispose(); exercise.dispose(); session.dispose(); recording.clear(); };
    update();
    Promise.resolve().then(loadPreview).then(({ mountPreview }) => {
      if (!current()) return;
      const mounted = mountPreview(stage, { session, exercise, events: core.events, onTick: update, onStep: (dt, from, to) => {
        telemetry.step(dt, from, to);
        if (dt > 0) recording.capture(exercise.snapshot(), to, preview?.movement?.snapshot().angle ?? 0);
      }, onError: failure });
      if (current()) preview = mounted; else mounted.dispose();
    }).catch(failure);
  }
  renderRound();
  return { dispose() { active = false; revision++; cleanupRound(); host.remove(); } };
}
