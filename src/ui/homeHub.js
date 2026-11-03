import { element, link } from './elements.js';
import { MODALITIES } from './routes.js';
import { trainingPlan, resumeTraining } from './homeTraining.js';
import { formatDate } from './formatters.js';

/** Read-only home view. Pending reads cannot update a detached screen. */
export function mountHomeHub({ screen, repository, dodgePlacement }) {
  const document = screen.ownerDocument;
  const host = element(document, 'section', 'training-hub');
  host.setAttribute('aria-labelledby', 'training-hub-title');
  const heading = element(document, 'div', 'hub-heading');
  const intro = element(document, 'div');
  const title = element(document, 'h2', '', 'Qual mecânica você quer afiar?');
  title.id = 'training-hub-title';
  intro.append(element(document, 'span', 'eyebrow', 'SEU PRÓXIMO PASSO'), title,
    element(document, 'p', 'muted', 'Escolha um foco. Prepare, pratique e revise — cada etapa é opcional.'));
  heading.append(intro, link(document, 'Ver meu perfil →', '/profile', 'text-link'));
  const choices = element(document, 'div', 'hub-choices');
  choices.setAttribute('role', 'group');
  choices.setAttribute('aria-label', 'Foco do treino');
  const plan = element(document, 'div', 'hub-plan');
  const planTitle = element(document, 'h3', 'hub-plan-title');
  const steps = element(document, 'ol', 'hub-steps');
  plan.id = 'home-training-plan';
  plan.append(planTitle, steps);
  const recent = element(document, 'aside', 'hub-recent');
  recent.setAttribute('aria-label', 'Retomar treino salvo');
  const status = element(document, 'p', 'hub-load-status', 'Consultando seu último treino neste dispositivo…');
  status.setAttribute('role', 'status');
  recent.append(status);
  const body = element(document, 'div', 'hub-body');
  body.append(plan, recent);
  host.append(heading, choices, body);
  screen.insertBefore(host, screen.querySelector('.home-modes'));
  let active = true, selected = 'dodge', records = new Map(), request = 0;
  const buttons = new Map();

  function renderPlan() {
    const mode = MODALITIES.find(mode => mode.id === selected);
    planTitle.textContent = `Foco em ${mode.title}`;
    steps.replaceChildren();
    for (const [index, step] of trainingPlan(selected, { level: records.get(selected)?.level ?? 1, dodgeLevel: dodgePlacement?.level ?? 1 }).entries()) {
      const item = element(document, 'li', 'hub-step');
      item.append(element(document, 'span', 'hub-step__number', `0${index + 1}`),
        element(document, 'span', 'hub-step__context', step.context),
        element(document, 'h4', '', step.title), element(document, 'p', 'muted', step.detail),
        link(document, `${step.action} →`, step.path, 'text-link'));
      steps.append(item);
    }
    for (const [id, button] of buttons) button.setAttribute('aria-pressed', String(id === selected));
  }
  for (const mode of MODALITIES) {
    const button = element(document, 'button', 'hub-choice');
    button.type = 'button';
    button.setAttribute('aria-controls', plan.id);
    const icon = element(document, 'span', 'hub-choice__icon', mode.icon);
    icon.setAttribute('aria-hidden', 'true');
    button.append(icon, element(document, 'span', '', mode.title));
    button.addEventListener('click', () => { selected = mode.id; renderPlan(); });
    buttons.set(mode.id, button);
    choices.append(button);
  }
  renderPlan();

  async function loadRecent() {
    const revision = ++request;
    status.textContent = 'Consultando seu último treino neste dispositivo…';
    recent.setAttribute('aria-busy', 'true');
    const results = await Promise.allSettled(MODALITIES.map(async mode => {
      const response = await repository.listCompletedAttempts({ modality: mode.id, limit: 1 });
      const record = response.items[0];
      return resumeTraining(record) && record.modality === mode.id ? record : null;
    }));
    if (!active || revision !== request) return;
    records = new Map(results.filter(result => result.status === 'fulfilled' && result.value).map(result => [result.value.modality, result.value]));
    const latest = [...records.values()].sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt) || b.attemptId.localeCompare(a.attemptId))[0];
    const failed = results.some(result => result.status === 'rejected');
    recent.replaceChildren(element(document, 'span', 'eyebrow', latest ? 'CONTINUE SUA PRÁTICA' : 'CADA SESSÃO CONTA'));
    if (latest) {
      const mode = MODALITIES.find(mode => mode.id === latest.modality);
      const context = latest.modality === 'dodge' ? ` · ${latest.mode === 'normal' ? 'Normal' : 'Sobrevivência'}` : '';
      recent.append(element(document, 'h3', '', mode.title),
        element(document, 'p', 'hub-recent__level', `Nível ${latest.level}${context}`),
        element(document, 'p', 'muted', `Último treino salvo: ${formatDate(latest.completedAt)}.`),
        link(document, `Retomar no nível ${latest.level} →`, resumeTraining(latest), 'button primary'),
        element(document, 'p', 'hub-recent__note', 'Nova tentativa, com início manual e suas preferências atuais. Os resultados anteriores ficam preservados.'));
    } else {
      recent.append(element(document, 'h3', '', failed ? 'Seu treino está à mão' : 'Sua primeira sessão'),
        element(document, 'p', 'muted', failed ? 'Você pode treinar mesmo sem consultar o histórico.' : 'Comece com os fundamentos ou entre direto na modalidade que quer desenvolver.'),
        link(document, 'Aprender na arena →', '/learn/dodge', 'button'));
    }
    if (failed) {
      const retry = element(document, 'button', 'text-link hub-retry', 'Tentar consultar novamente');
      retry.type = 'button';
      retry.addEventListener('click', () => { retry.disabled = true; void loadRecent(); });
      recent.append(element(document, 'p', 'hub-recent__note', 'Parte do histórico não pôde ser consultada. A retomada pode estar incompleta.'), retry);
    }
    status.textContent = failed ? 'Histórico parcialmente indisponível.' : latest ? 'Último treino carregado.' : 'Nenhum treino oficial salvo ainda.';
    status.classList.add('sr-only');
    recent.append(status);
    recent.setAttribute('aria-busy', 'false');
    renderPlan();
  }
  void loadRecent();
  return { dispose() { active = false; request++; host.remove(); } };
}
