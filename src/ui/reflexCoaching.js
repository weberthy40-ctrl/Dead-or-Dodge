import { buildReflexCoaching } from '../training/reflex/feedback.js';
import { element, link } from './elements.js';

export function mountReflexCoaching(container, context) {
  const doc = container.ownerDocument, s = context.summary, coaching = buildReflexCoaching(context), section = element(doc, 'section', 'reflex-coaching');
  section.dataset.priority = coaching.priority;
  section.append(element(doc, 'p', 'eyebrow', 'LEITURA DA RODADA'), element(doc, 'h3', '', coaching.title));
  const grid = element(doc, 'dl', 'reflex-summary-grid');
  for (const [key, label, value] of [['answered', 'Acertos no comando', coaching.answered], ['inhibited', 'Inibições corretas', s.inhibited], ['anticipations', 'Antecipações', s.anticipations], ['wrong', 'Erros de escolha', s.wrong], ['omissions', 'Omissões', s.omissions], ['commissions', 'Erros por impulso', s.commissions]]) {
    const item = element(doc, 'div'); item.dataset.metric = key; item.append(element(doc, 'dt', '', label), element(doc, 'dd', '', String(value))); grid.append(item);
  }
  section.append(grid, element(doc, 'p', 'reflex-next-action', coaching.action));
  const times = element(doc, 'dl', 'reflex-times');
  for (const [label, value] of [['Média', s.meanMs], ['Mediana', s.medianMs], ['Melhor', s.bestMs]]) { const item = element(doc, 'div'); item.append(element(doc, 'dt', '', label), element(doc, 'dd', '', value === null ? '—' : `${Math.round(value)} ms`)); times.append(item); }
  section.append(times, element(doc, 'p', 'reflex-coaching-note', 'Tempos calculados apenas dos acertos no comando. Inibições corretas entram nos acertos totais, sem gerar tempo de reação.'));
  if (coaching.smallSample) section.append(element(doc, 'p', 'status-note', 'Amostra curta: menos de cinco sinais apresentados ou cinco acertos cronometrados. Interprete os tempos com cautela; esta orientação não estima habilidade nem recomenda subir de nível.'));
  if (!context.technical && coaching.priority !== 'interrupted') section.append(link(doc, 'Ensaiar sem nota — 22 sinais', '/practice/reflex', 'button reflex-practice-link'));
  container.append(section); return section;
}
