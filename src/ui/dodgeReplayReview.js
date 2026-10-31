import { element } from './elements.js';
import { VARIANTS } from '../training/dodge/projectiles.js';

/** Read-only reconstruction: seeking never resumes or changes the completed session. */
export function mountDodgeReplayReview({ container, recording, loadPreview = () => import('../game3d/mountPreview.js') }) {
  const doc = container.ownerDocument, win = doc.defaultView, frames = recording.frames;
  const button = element(doc, 'button', 'button replay-open', 'Rever últimos 6 s'); button.type = 'button';
  button.disabled = frames.length < 2; button.setAttribute('aria-expanded', 'false');
  const panel = element(doc, 'section', 'replay-review'); panel.hidden = true;
  container.append(button, panel);
  // Results may mount this component before attaching its content to the dialog.
  const dialog = () => container.closest('dialog');
  const start = frames[0]?.time ?? 0, end = frames.at(-1)?.time ?? start;
  const markers = recording.markers.filter(marker => marker.time >= start && marker.time <= end);
  const afterImpact=time=>{const at=frames.findIndex(frame=>frame.time>=time-1e-8);return at<0?frames.length-1:at;};
  const nearest = time => Math.max(0, frames.findLastIndex(frame => frame.time <= time));
  let index = markers.length ? nearest(Math.max(start, markers.at(-1).time - .5)) : 0;
  let active = true, preview = null, frameId = null, playing = false, last = null, playhead = start, generation = 0;
  const stage = element(doc, 'div', 'stage replay-stage'), controls = element(doc, 'div', 'replay-controls');
  const play = element(doc, 'button', 'button', 'Reproduzir'); play.type = 'button';
  const slider = element(doc, 'input'); slider.type = 'range'; slider.min = '0'; slider.max = String(Math.max(0, frames.length - 1)); slider.step = '1'; slider.value = String(index); slider.setAttribute('aria-label', 'Instante da revisão');
  const speed = element(doc, 'select'); speed.setAttribute('aria-label', 'Velocidade da revisão');
  for (const value of [.25, .5, 1]) { const option = element(doc, 'option', '', `${value}×`); option.value = String(value); speed.append(option); }
  speed.value = '0.5';
  const status = element(doc, 'p', 'muted');
  const timeline = element(doc, 'div', 'replay-timeline');
  for (const [i, marker] of markers.entries()) {
    const label = `${VARIANTS[marker.variant]?.label ?? 'Impacto'} · ${marker.time.toFixed(2)} s`;
    const dot = element(doc, 'button', 'replay-marker', String(i + 1)); dot.type = 'button';
    dot.style.left = `${(marker.time - start) / Math.max(.001, end - start) * 100}%`;
    dot.title = label; dot.setAttribute('aria-label', `Rever impacto: ${label}`); dot.dataset.time = String(marker.time);
    dot.addEventListener('click', () => { stop(); present(afterImpact(marker.time)); });
    timeline.append(dot);
  }
  controls.append(play, speed, slider);
  panel.append(element(doc, 'h3', '', 'Revisão da esquiva'),
    element(doc, 'p', 'muted', markers.length ? 'Clique em um impacto numerado para rever aquele instante. A revisão começa perto do último impacto.' : 'Reveja suas posições nos últimos segundos. Esta revisão fica apenas em memória.'),
    stage, timeline, controls, status);
  function stop() {
    playing = false; last = null;
    if (frameId !== null) win.cancelAnimationFrame(frameId);
    frameId = null; play.textContent = 'Reproduzir';
  }
  function present(next) {
    index = Math.max(0, Math.min(frames.length - 1, next));
    const frame = frames[index]; if (!frame) return;
    slider.value = String(index);
    status.textContent = `${frame.time.toFixed(2)} s da tentativa · ${(frame.time - start).toFixed(2)} / ${(end - start).toFixed(2)} s de revisão`;
    preview?.presentFrame?.(frame);
  }
  function tick(time) {
    frameId = null; if (!active || !playing) return;
    if (last !== null) playhead += Math.max(0, Math.min(.1, (time - last) / 1000)) * Number(speed.value);
    last = time; let next = index;
    while (next < frames.length - 1 && frames[next + 1].time <= playhead) next++;
    if (next !== index) present(next);
    if (playhead >= end) { present(frames.length - 1); stop(); return; }
    frameId = win.requestAnimationFrame(tick);
  }
  play.addEventListener('click', () => {
    if (playing) { stop(); return; }
    if (index === frames.length - 1) present(0);
    playhead = frames[index].time; playing = true; play.textContent = 'Pausar revisão'; last = null;
    frameId = win.requestAnimationFrame(tick);
  });
  slider.addEventListener('input', () => { stop(); present(Number(slider.value)); });
  button.addEventListener('click', async () => {
    panel.hidden = !panel.hidden; dialog()?.classList.toggle('reviewing', !panel.hidden);
    button.setAttribute('aria-expanded', String(!panel.hidden));
    if (panel.hidden) { stop(); preview?.dispose(); preview = null; generation++; button.textContent = 'Rever últimos 6 s'; return; }
    button.textContent = 'Fechar revisão'; present(index);
    const token = ++generation;
    try {
      const { mountPreview } = await loadPreview();
      if (!active || token !== generation) return;
      preview = mountPreview(stage, { controls: false, fullscreenControls: false, exercise: { kind: 'dodge', snapshot: () => frames[index].snapshot }, onError: () => { status.textContent = 'Revisão 3D indisponível neste navegador.'; } });
      present(index);
    } catch { if (active) status.textContent = 'Não foi possível abrir a revisão.'; }
  });
  return { dispose() { active = false; generation++; dialog()?.classList.remove('reviewing'); stop(); preview?.dispose(); button.remove(); panel.remove(); } };
}
