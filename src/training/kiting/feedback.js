import { readonlySnapshot } from '../snapshot.js';

const clamp = value => Math.max(0, Math.min(1, value));
export const CANCELLATION_HINTS = Object.freeze({
  command: 'Movimento, parada ou Flash interrompeu a preparação antes do disparo.',
  range: 'O alvo saiu do alcance antes da confirmação do disparo.',
});

/** Presentation only: reads the same clocks that decide readiness, never sets them. */
export function describeKitingPhase(snapshot, { sessionState = 'running', commands = null } = {}) {
  const p = snapshot, cancelled = p.phase === 'recovery' && p.lastCancellation && p.lastCancellation.at >= (p.lastAttack?.at ?? -Infinity);
  let state = 'ready', title = 'Ataque pronto', hint = 'Escolha um alvo. Cada comando executa um ataque.', progress = 0;
  if (p.phase === 'windup') {
    state = 'windup'; title = 'Preparando ataque'; hint = 'Mover agora cancela. Aguarde o disparo.';
    progress = clamp(1 - p.windupRemaining / p.config.windupDuration);
  } else if (p.phase === 'recovery') {
    state = cancelled ? 'cancelled' : 'recovery';
    title = cancelled ? 'Ataque cancelado' : 'Disparo confirmado';
    hint = cancelled ? `${CANCELLATION_HINTS[p.lastCancellation.reason] ?? 'A preparação foi interrompida.'} Aguarde para atacar novamente.` : 'Mova durante a recuperação. O disparo já ocorreu.';
    const duration = cancelled ? p.config.cancelCooldown : p.config.attackInterval - p.config.windupDuration;
    progress = clamp(1 - p.cooldown / Math.max(.001, duration));
  } else if (p.phase === 'inactive') {
    state = 'inactive'; title = 'Rodada encerrada'; hint = 'Revise sua execução no resultado.';
  } else if (commands?.pending) {
    state = 'approach'; title = 'Aproximando para atacar'; hint = 'Uma ordem, um ataque. Direito, parada ou Flash cancela a aproximação.';
  } else if (commands?.armed) {
    state = 'armed'; title = 'Comando preparado'; hint = 'Clique esquerdo na arena para confirmar o ataque.';
  } else if (p.lastCancellation && p.elapsed - p.lastCancellation.at < .8) {
    hint = `Você já pode atacar novamente. ${CANCELLATION_HINTS[p.lastCancellation.reason] ?? ''}`;
  }
  if (sessionState === 'idle') return { state: 'idle', title: 'Prepare seu ritmo', hint: 'Inicie para praticar preparação, disparo e movimento.', progress: 0 };
  if (sessionState === 'countdown') return { state: 'countdown', title: 'Prepare-se', hint: 'Os comandos ficam disponíveis ao terminar a contagem.', progress: 0 };
  if (sessionState === 'paused') return { state: 'paused', title: 'Treino pausado', hint: 'Retome para continuar. Os tempos do ataque estão congelados.', progress };
  return { state, title, hint, progress };
}

/** Round-local observations. Reasons do not become persisted scoring metrics. */
export function observeKitingCancellations({ events, attemptId }) {
  let lastSequence = 0; const counts = { command: 0, range: 0 };
  const stop = events.on('kiting:cancelled', event => {
    const sequence = Number(/^attack-(\d+)$/.exec(event.attackId)?.[1]);
    if (event.attemptId !== attemptId || !Object.hasOwn(counts, event.reason) || !Number.isSafeInteger(sequence) || sequence <= lastSequence) return;
    lastSequence = sequence; counts[event.reason]++;
  });
  return { snapshot: () => readonlySnapshot(counts), dispose() { stop(); } };
}

/** Guidance describes the observed round; it does not estimate skill or change score. */
export function buildKitingCoaching(metrics, reasons = {}) {
  const m = metrics, command = Math.min(m.cancellations, Math.max(0, reasons.command ?? 0));
  const range = Math.min(m.cancellations - command, Math.max(0, reasons.range ?? 0));
  const smallSample = m.hits < (m.config?.minSampleHits ?? 6) || m.elapsedActiveSeconds < 10;
  let priority = 'repeat', title = 'Consolide o ritmo', action = 'Repita o mesmo nível e os mesmos comandos para conferir a execução. Compare rodadas com tempo e exposição semelhantes.';
  if (m.endReason === 'abandoned') {
    priority = 'interrupted'; title = 'Rodada interrompida'; action = 'Inicie outra rodada para analisar uma conclusão. Abandono não gera resultado oficial.';
  } else if (m.cancellations > 0 && (m.shots === 0 || m.cancellations / Math.max(1, m.shots + m.cancellations) >= .2)) {
    priority = 'cancellations'; title = 'Priorize a confirmação do disparo';
    action = range > command ? 'Repita este nível acompanhando a distância até o alvo. Confirme o disparo antes de recuar além do alcance.' : 'Repita este nível: ataque, aguarde “Disparo confirmado” e só então mova. Se quiser ensaiar sem nota, use a prática técnica.';
  } else if (m.rhythmOpportunities >= 3 && m.rhythmCycles / m.rhythmOpportunities < .6) {
    priority = 'rhythm'; title = 'Use a janela para se mover'; action = 'Repita este nível dando um passo durante a recuperação, depois de cada disparo confirmado. Evite emitir outra ordem antes de o ataque ficar pronto.';
  } else if (m.endReason === 'defeat' && m.damageTaken > 0) {
    priority = 'survival'; title = 'Pratique mantendo espaço'; action = 'Repita este nível observando os inimigos que se aproximam e os disparos recebidos. Use a recuperação para mudar de posição.';
  } else if (smallSample) {
    priority = 'sample'; title = 'Reúna mais uma amostra'; action = 'Repita o mesmo nível e tente concluir mais disparos. Esta rodada ainda é curta para orientar uma mudança de dificuldade.';
  }
  return readonlySnapshot({ priority, title, action, smallSample, command, range, unknown: Math.max(0, m.cancellations - command - range) });
}
