import { readonlySnapshot } from '../snapshot.js';

/** One short-lived observation, measured in active session time. Never stored in a record. */
export function observePrecisionFeedback({ events, attemptId, activeTime }) {
  let last = null;
  const stop = events.on('precision:feedback', event => {
    if (event.attemptId !== attemptId || !['hit', 'miss', 'order', 'late'].includes(event.type)) return;
    last = { type: event.type, expectedOrder: event.expectedOrder, retained: event.retained, at: activeTime() };
  });
  return { snapshot() { return last && activeTime() - last.at <= 1.2 ? readonlySnapshot(last) : null; }, dispose() { stop(); last = null; } };
}

export function describePrecisionGuidance(snapshot, { sessionState = 'running', feedback = null } = {}) {
  const next = snapshot.priority ? snapshot.targets.find(target => target.id === snapshot.nextTargetId)?.order ?? null : null;
  let mode = snapshot.priority ? 'priority' : 'free';
  let instruction = next !== null ? `Siga a ordem · próximo: ${next}` : 'Escolha livre neste grupo';
  let message = snapshot.priority ? 'Acerte o número indicado antes dos demais.' : 'Conclua todos os alvos para mudar de grupo.';
  if (snapshot.fallback) message = 'Espaço limitado: este grupo usa menos alvos ou menos movimento.';
  if (feedback?.type === 'hit') message = '✓ Acerto confirmado';
  if (feedback?.type === 'miss') message = '× Clique sem alvo válido';
  if (feedback?.type === 'order') message = `↔ Ordem incorreta · clique no ${feedback.expectedOrder}`;
  if (feedback?.type === 'late') message = feedback.retained ? '! Prazo excedido · o alvo permanece até o acerto' : '! Prazo excedido · alvo renovado';
  if (sessionState === 'idle') { mode = 'idle'; instruction = 'Prepare sua precisão'; message = 'Clique esquerdo para acertar; grupos numerados exigem ordem.'; }
  else if (sessionState === 'countdown') { mode = 'countdown'; instruction = 'Prepare-se'; message = 'Os alvos ficam disponíveis ao terminar a contagem.'; }
  else if (sessionState === 'paused') { mode = 'paused'; instruction = 'Treino pausado'; message = 'Posições, prazos e tempo ativo estão congelados.'; }
  else if (snapshot.state === 'stopped' || snapshot.state === 'disposed') { mode = 'inactive'; instruction = 'Rodada encerrada'; message = 'Revise sua execução no resultado.'; }
  return { mode, instruction, message, nextOrder: next };
}

/** Existing counters explain the round; guidance is separate from the score and level. */
export function buildPrecisionCoaching(metrics) {
  const m = metrics, order = Math.min(m.misses, Math.max(0, m.orderErrors ?? 0)), outside = Math.max(0, m.misses - order), late = m.expiredTargets ?? 0;
  const smallSample = m.hits < 12;
  let priority = 'repeat', title = 'Confira a consistência', action = 'Repita a mesma variante e nível para comparar rodadas com condições semelhantes. A precisão isolada não descreve toda a execução.';
  if (m.endReason !== 'completed') { priority = 'interrupted'; title = 'Rodada interrompida'; action = 'Inicie outra rodada para analisar uma conclusão. Abandono não gera resultado oficial.'; }
  else if (order > 0 && order >= outside) { priority = 'order'; title = 'Leia a sequência antes do clique'; action = 'Repita este nível conferindo o próximo número. O alvo com a marca interna é o próximo; os demais continuam esperando.'; }
  else if (outside > 0 && outside / Math.max(1, m.clicksEligible) >= .15) { priority = 'aim'; title = 'Priorize o centro do alvo'; action = 'Repita este nível buscando cliques dentro da esfera antes de acelerar. As marcas são indicações visuais, sem ampliar a área válida.'; }
  else if (late > 0) { priority = 'deadline'; title = 'Observe o prazo do grupo'; action = 'Repita este nível procurando localizar os próximos alvos mais cedo. O símbolo de atraso não impede o acerto; termine o grupo para mudar.'; }
  else if (order > 0) { priority = 'order'; title = 'Revise os cliques fora da ordem'; action = 'Repita a mesma condição, conferindo o número indicado antes de cada clique na sequência.'; }
  else if (smallSample) { priority = 'sample'; title = 'Reúna mais uma amostra'; action = 'Repita a rodada e procure completar mais grupos. Esta amostra ainda é pequena para orientar uma mudança de dificuldade.'; }
  return readonlySnapshot({ priority, title, action, smallSample, order, outside, late });
}
