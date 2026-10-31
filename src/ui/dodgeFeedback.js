import { buildDodgeFeedback } from '../training/dodge/feedback.js';
import { element,link } from './elements.js';

export function mountDodgeFeedback({ container, metrics, recording }) {
  const document = container.ownerDocument, feedback = buildDodgeFeedback(metrics, recording.counts);
  const section = element(document, 'section', 'dodge-feedback');
  const stats = element(document, 'dl', 'dodge-result-stats');
  for (const [label, value] of [
    ['Tempo ativo', `${feedback.elapsed.toFixed(1)} s`],
    ['Ameaças evitadas', `${feedback.dodged}/${feedback.resolved}`],
    ['Impactos válidos', String(feedback.hits)],
  ]) {
    const item = element(document, 'div'); item.append(element(document, 'dt', '', label), element(document, 'dd', '', value)); stats.append(item);
  }
  section.append(element(document, 'p', 'eyebrow', 'SUA TENTATIVA EM FOCO'), stats,
    element(document, 'h3', '', feedback.headline), element(document, 'p', 'feedback-observation', feedback.observation),
    element(document, 'p', 'eyebrow', 'NA PRÓXIMA TENTATIVA'), element(document, 'p', 'feedback-action', feedback.action));
  if (!feedback.sample) section.append(element(document, 'p', 'muted feedback-sample', 'Amostra curta: use estes dados para revisar a tentativa, sem tirar conclusões sobre sua habilidade.'));
  if(feedback.practiceFamily&&metrics.endReason!=='error')section.append(link(document,'Praticar esta ameaça',`/focus/dodge/${feedback.practiceFamily}`,'button feedback-practice'));
  container.prepend(section);
  return section;
}
