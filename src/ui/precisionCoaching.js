import { element, link } from './elements.js';
import { buildPrecisionCoaching } from '../training/precision/feedback.js';

export function mountPrecisionCoaching(container, metrics) {
  const doc = container.ownerDocument, coaching = buildPrecisionCoaching(metrics), section = element(doc, 'section', 'precision-coaching');
  section.dataset.priority = coaching.priority;
  section.append(element(doc, 'p', 'eyebrow', 'LEITURA DA RODADA'), element(doc, 'h3', '', coaching.title));
  const grid = element(doc, 'dl', 'precision-summary-grid');
  for (const [label, value] of [['Acertos', metrics.hits], ['Cliques sem alvo', coaching.outside], ['Erros de ordem', coaching.order], ['Alvos atrasados', coaching.late]]) {
    const item = element(doc, 'div'); item.append(element(doc, 'dt', '', label), element(doc, 'dd', '', String(value))); grid.append(item);
  }
  section.append(grid, element(doc, 'p', 'precision-next-action', coaching.action));
  if (coaching.smallSample) section.append(element(doc, 'p', 'status-note', 'Amostra pequena: menos de 12 acertos. Esta orientação descreve a rodada, sem estimar habilidade nem recomendar subir de nível.'));
  if (coaching.priority !== 'interrupted') section.append(link(doc, 'Ensaiar sem nota — ajustes do nível 4', '/practice/precision', 'button precision-practice-link'));
  section.append(element(doc, 'p', 'precision-coaching-note', 'Erros de ordem também contam nos erros de clique; aqui são separados para análise. Atrasos são eventos de prazo, não cliques adicionais. “Jogar novamente” repete a condição atual.'));
  container.append(section); return section;
}
