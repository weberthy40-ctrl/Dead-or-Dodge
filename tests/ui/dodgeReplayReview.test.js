// @vitest-environment jsdom
import { it, expect, vi } from 'vitest';
import { mountDodgeReplayReview } from '../../src/ui/dodgeReplayReview.js';

it.each([false,true])('starts near the last impact and adapts the dialog when attached after mounting: %s', async attachAfterMount => {
  const container = document.createElement('div'), dialog = document.createElement('dialog'); if(!attachAfterMount)dialog.append(container);document.body.append(dialog);
  const frames = Array.from({ length: 7 }, (_, i) => ({ time: i * .5, player: { x: i, z: 0 }, angle: 0, snapshot: { level: 1, elapsed: i * .5, projectiles: [] } }));
  const presentFrame = vi.fn(), dispose = vi.fn(), mountPreview = vi.fn(() => ({ presentFrame, dispose }));
  const review = mountDodgeReplayReview({ container, recording: { frames, markers: [{ time: 1.01, variant: 'artillery' }, { time: 2.5, variant: 'cage' }], counts: {} }, loadPreview: async () => ({ mountPreview }) });
  if(attachAfterMount)dialog.append(container);
  container.querySelector('.replay-open').click(); await Promise.resolve(); await Promise.resolve();
  expect(dialog.classList.contains('reviewing')).toBe(true);
  expect(presentFrame).toHaveBeenLastCalledWith(frames[4]);
  expect(mountPreview.mock.calls[0][1]).toMatchObject({ controls: false, fullscreenControls: false });
  container.querySelector('.replay-marker').click(); expect(presentFrame).toHaveBeenLastCalledWith(frames[3]);
  expect(container.querySelector('.replay-open').getAttribute('aria-expanded')).toBe('true');
  let tick;vi.spyOn(window,'requestAnimationFrame').mockImplementation(callback=>{tick=callback;return 1;});vi.spyOn(window,'cancelAnimationFrame').mockImplementation(()=>{});
  container.querySelector('.replay-controls button').click();for(let time=0;time<=1100;time+=100)tick(time);expect(presentFrame).toHaveBeenLastCalledWith(frames[4]);expect(container.querySelector('select').selectedOptions[0].textContent).toBe('0.5×');
  container.querySelector('.replay-open').click(); expect(dispose).toHaveBeenCalledOnce();
  expect(dialog.classList.contains('reviewing')).toBe(false);container.querySelector('.replay-open').click();await Promise.resolve();review.dispose();expect(dialog.classList.contains('reviewing')).toBe(false);dialog.remove();
});
