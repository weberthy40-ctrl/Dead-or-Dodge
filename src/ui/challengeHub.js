import { SERIES_DEFINITIONS, seriesCode, parseSeriesCode } from '../training/dodge/series.js';
import { element, link } from './elements.js';

export function mountChallengeHub(screen, { repository } = {}) {
  let active = true;
  const doc = screen.ownerDocument;
  const intro = element(doc, 'section', 'mode-card series-intro');
  intro.append(element(doc, 'span', 'eyebrow', 'MESMA SEQUÊNCIA. OUTRA TENTATIVA.'),
    element(doc, 'h2', '', 'Crie sua referência de treino'),
    element(doc, 'p', 'muted', 'Cada série dura até 30 segundos, com três vidas. O código fixa habilidades, horários e posições dos avisos. Seus movimentos e sua exposição às ameaças continuam mudando o resultado.'),
    element(doc, 'p', 'status-note', 'O histórico das séries é separado. Estas tentativas não alteram sua patente ou seu nível no Normal.'));
  const grid = element(doc, 'div', 'mode-grid series-grid');
  for (const item of SERIES_DEFINITIONS) {
    const card = element(doc, 'article', 'mode-card'), code = seriesCode(item.id, item.seed);
    card.append(element(doc, 'span', 'eyebrow', '30 S · 3 VIDAS'), element(doc, 'h2', '', item.title), element(doc, 'p', 'muted', item.description),
      element(doc, 'code', 'series-code', code), link(doc, 'Começar série →', `/challenge/dodge/${code}`, 'button primary'));
    const fresh = element(doc, 'button', 'button', 'Criar outra sequência'); fresh.type = 'button';
    fresh.addEventListener('click', () => { const seed = doc.defaultView.crypto.getRandomValues(new Uint32Array(1))[0]; doc.defaultView.location.hash = `/challenge/dodge/${seriesCode(item.id, seed)}`; });
    card.append(fresh); grid.append(card);
  }
  const form = element(doc, 'form', 'mode-card series-code-form'), label = element(doc, 'label', '', 'Abrir pelo código');
  const input = element(doc, 'input'); input.required = true; input.maxLength = 40; input.autocomplete = 'off'; input.placeholder = 'dd1-linha-1A2B3C4D';
  label.append(input);
  const submit = element(doc, 'button', 'button', 'Abrir série'); submit.type = 'submit';
  const status = element(doc, 'p', 'status-note'); status.setAttribute('role', 'status');
  form.append(label, submit, status);
  form.addEventListener('submit', event => {
    event.preventDefault();
    try { const series = parseSeriesCode(input.value); doc.defaultView.location.hash = `/challenge/dodge/${series.code}`; }
    catch (error) { status.textContent = error.message; }
  });
  const recent = element(doc, 'section', 'mode-card series-recent');
  async function loadRecent() {
    recent.replaceChildren(element(doc, 'h2', '', 'Retomar uma série'), element(doc, 'p', 'muted', 'Carregando tentativas recentes…'));
    try {
      const records = [];
      await repository.scanCompletedAttempts({ modality: 'dodge-challenge', onRecord(record) {
        const existing = records.find(item => item.code === record.code);
        if (existing && Date.parse(existing.completedAt) >= Date.parse(record.completedAt)) return;
        if (existing) records.splice(records.indexOf(existing), 1);
        records.push(record); records.sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt) || b.attemptId.localeCompare(a.attemptId)); records.splice(5);
      } });
      if (!active) return;
      recent.replaceChildren(element(doc, 'h2', '', 'Retomar uma série'));
      if (!records.length) recent.append(element(doc, 'p', 'muted', 'Suas séries recentes aparecerão aqui depois de salvar uma tentativa.'));
      for (const record of records) {
        const item = element(doc, 'div', 'series-recent-item'), series = parseSeriesCode(record.code);
        item.append(link(doc, `${series.title} · ${record.code}`, `/challenge/dodge/${record.code}`, 'text-link'), element(doc, 'p', 'muted', `Última tentativa: ${record.metrics.elapsedActiveSeconds.toFixed(1)} s · ${record.metrics.validHits} impactos`)); recent.append(item);
      }
    } catch {
      if (!active) return;
      recent.replaceChildren(element(doc, 'h2', '', 'Retomar uma série'), element(doc, 'p', 'status-note', 'Não foi possível ler suas séries recentes. Você ainda pode abrir uma série pelo código.'));
      const retry = element(doc, 'button', 'button', 'Recarregar séries recentes'); retry.type = 'button'; retry.addEventListener('click', loadRecent); recent.append(retry);
    }
  }
  screen.append(intro, grid, recent, form);
  if (repository) loadRecent(); else recent.hidden = true;
  return { dispose() { active = false; } };
}
