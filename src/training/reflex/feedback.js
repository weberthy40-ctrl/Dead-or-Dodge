import { REFLEX_CUES } from './difficulty.js';
import { readonlySnapshot } from '../snapshot.js';

export function formatReflexInput(code) {
  if (code === null) return 'não responder';
  if (code === 'Space') return 'ESPAÇO';
  if (code === 'MouseLeft') return 'clique esquerdo';
  if (code === 'MouseRight') return 'clique direito';
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  return ({ ArrowUp: 'seta para cima', ArrowDown: 'seta para baixo', ArrowLeft: 'seta para esquerda', ArrowRight: 'seta para direita' })[code] ?? 'comando indicado';
}

/** Only the last resolved event, timed by the session. Never part of official metrics. */
export function observeReflexFeedback({ events, attemptId, getRound, activeTime }) {
  let last = null;
  const stop = events.on('reflex:response', event => {
    if (event.attemptId !== attemptId) return;
    const round = getRound(event.index);
    if (!round || round.index !== event.index || round.status !== event.status) return;
    last = readonlySnapshot({ round, at: activeTime() });
  });
  return {
    snapshot() { return last && activeTime() - last.at <= 1.4 ? last : null; },
    dispose() { stop(); last = null; },
  };
}

export function describeReflexResponse(round) {
  if (!round) return null;
  // A pre-signal response must not disclose the hidden cue selected by the engine.
  const expected = round.presented ? formatReflexInput(REFLEX_CUES[round.cue]?.answer) : 'comando indicado';
  const messages = {
    correct: ['Resposta correta', `${formatReflexInput(round.response)}${Number.isFinite(round.reactionMs) ? ` · ${Math.round(round.reactionMs)} ms` : ''}.`],
    wrong: ['Erro de escolha', `Era ${expected}; resposta: ${formatReflexInput(round.response)}. Leia o comando antes de responder.`],
    missed: ['Omissão', `O sinal terminou sem resposta válida. Era ${expected}.`],
    anticipated: ['Antecipação', 'Uma resposta chegou antes do sinal. Aguarde o comando aparecer.'],
    inhibited: ['Inibição correta', 'Você aguardou o fim do sinal de freio. Esta inibição não tem tempo de reação.'],
    commission: ['Erro por impulso', 'O sinal pedia não responder. Espere o próximo comando.'],
  };
  const message = messages[round.status];
  return message ? { status: round.status, index: round.index, title: message[0], detail: message[1] } : null;
}

/** Presentation only: never samples the hidden waiting cue or starts a reaction clock. */
export function describeReflexPresentation(snapshot, session) {
  const visible = session.state === 'running' && ['cue-pending', 'cue-visible'].includes(snapshot.phase);
  if (visible) {
    const cue = snapshot.cue, inhibit = cue.answer === null;
    const input = inhibit ? 'inhibit' : cue.answer === 'MouseLeft' ? 'left' : cue.answer === 'MouseRight' ? 'right' : 'keyboard';
    return { visible, phase: inhibit ? 'inhibit' : 'respond', badge: inhibit ? 'CONTROLE O IMPULSO' : 'RESPONDA AO COMANDO', symbol: cue.symbol, text: cue.text, command: inhibit ? 'AGUARDE' : input === 'left' ? 'ESQUERDO' : input === 'right' ? 'DIREITO' : formatReflexInput(cue.answer), input, color: cue.color ?? 'keyboard', inhibit };
  }
  let phase = 'waiting', badge = 'AGUARDE', text = 'Aguarde o sinal', command = '···';
  if (session.state === 'idle') { phase = 'idle'; badge = 'PREPARE-SE'; text = 'Prepare-se'; command = 'PRONTO'; }
  else if (session.state === 'countdown') { phase = 'countdown'; badge = 'PREPARAÇÃO'; command = String(Math.ceil(session.countdown - session.preparation)); text = `Começar em ${command}`; }
  else if (session.state === 'paused') { phase = 'paused'; badge = 'TREINO PAUSADO'; command = '||'; text = 'Pausado'; }
  else if (snapshot.phase === 'inter-round') { const response = describeReflexResponse(snapshot.rounds.at(-1)); phase = 'resolved'; badge = 'RESPOSTA REGISTRADA'; text = response?.title ?? 'Resposta registrada'; command = ['correct', 'inhibited'].includes(response?.status) ? '✓' : '!'; }
  return { visible: false, phase, badge, text, command, symbol: '', input: 'none', color: 'idle', inhibit: false };
}

/** Explain existing counters; no new rating, score or difficulty recommendation. */
export function buildReflexCoaching({ summary: s, completed, technical = false }) {
  const smallSample = s.presented < 5 || s.reactionTimes.length < 5;
  const repeat = technical ? 'Repita a prática técnica' : 'Repita a mesma variante e nível';
  const categories = [
    ['impulse', s.commissions, 'Segure a resposta nos sinais de freio', `${repeat} identificando primeiro os sinais de não responder. Aguarde o fim deles antes de preparar o próximo comando.`],
    ['anticipation', s.anticipations, 'Espere o sinal aparecer', `${repeat} sem tentar prever o intervalo de espera. Responda apenas depois de ler o comando apresentado.`],
    ['choice', s.wrong, 'Leia o comando antes de responder', `${repeat} conferindo a tecla ou o lado do mouse indicado. Priorize escolher a ação correta antes de acelerar.`],
    ['omission', s.omissions, 'Localize o sinal e a ação pedida', `${repeat} mantendo a atenção no painel central. Identifique a ação pedida enquanto o sinal está visível.`],
  ];
  const main = categories.reduce((best, candidate) => candidate[1] > best[1] ? candidate : best, ['repeat', 0]);
  let priority = main[0], title = main[2] ?? 'Confira a consistência', action = main[3] ?? `${repeat} para comparar precisão e tempos em condições semelhantes. Os tempos refletem também o navegador e o dispositivo.`;
  if (!completed) { priority = 'interrupted'; title = 'Rodada interrompida'; action = 'Inicie outra rodada para analisar uma conclusão. Abandono não gera resultado oficial.'; }
  else if (priority === 'repeat' && smallSample) { priority = 'sample'; title = 'Reúna mais respostas válidas'; action = `${repeat} para reunir mais acertos com tempo válido. Uma amostra curta limita a comparação de velocidade e consistência.`; }
  return readonlySnapshot({ priority, title, action, smallSample, answered: Math.max(0, s.correct - s.inhibited) });
}
