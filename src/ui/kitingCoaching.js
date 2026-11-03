import { element, link } from './elements.js';
import { buildKitingCoaching } from '../training/kiting/feedback.js';

export function mountKitingCoaching(container, metrics, reasons, { timed = false } = {}) {
  const doc = container.ownerDocument, coaching = buildKitingCoaching(metrics, reasons);
  const section = element(doc, 'section', 'kiting-coaching'); section.dataset.priority = coaching.priority;
  section.append(element(doc, 'p', 'eyebrow', 'LEITURA DA RODADA'), element(doc, 'h3', '', coaching.title));
  const grid = element(doc, 'dl', 'kiting-summary-grid');
  for (const [label, value] of [
    ['Disparos confirmados', `${metrics.shots}`], ['Cancelamentos', `${metrics.cancellations}`],
    ['Ciclos com movimento', `${metrics.rhythmCycles} / ${metrics.rhythmOpportunities}`],
    ['Dano recebido', `${metrics.damageTaken ?? 0}`],
  ]) { const cell = element(doc, 'div'); cell.append(element(doc, 'dt', '', label), element(doc, 'dd', '', value)); grid.append(cell); }
  section.append(grid);
  if (metrics.cancellations > 0) section.append(element(doc, 'p', 'kiting-cancel-summary', `Interrupções por comando: ${coaching.command} · Alvo fora de alcance: ${coaching.range}${coaching.unknown ? ` · Sem detalhe: ${coaching.unknown}` : ''}.`));
  section.append(element(doc, 'p', 'kiting-next-action', coaching.action));
  if (coaching.smallSample) section.append(element(doc, 'p', 'status-note', 'Amostra curta: estas orientações descrevem a tentativa, sem estimar sua habilidade nem sugerir subir de nível.'));
  if (timed && coaching.priority !== 'interrupted') section.append(link(doc, 'Ensaiar sem nota — nível 1', '/practice/kiting', 'button kiting-practice-link'));
  section.append(element(doc, 'p', 'kiting-coaching-note', '“Jogar novamente” repete o exercício, o nível e os comandos desta rodada. Os detalhes de cancelamento ficam apenas nesta tela.'));
  container.append(section); return section;
}
