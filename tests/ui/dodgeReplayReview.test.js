// @vitest-environment jsdom
import { it, expect, vi } from 'vitest';
import { mountDodgeReplayReview } from '../../src/ui/dodgeReplayReview.js';

it('starts near the last impact and seeks numbered markers without touching a session', async () => {
  const container = document.createElement('div'), dialog = document.createElement('dialog'); dialog.append(container); document.body.append(dialog);
  const frames = Array.from({ length: 7 }, (_, i) => ({ time: i * .5, player: { x: i, z: 0 }, angle: 0, snapshot: { level: 1, elapsed: i * .5, projectiles: [] } }));
  const presentFrame = vi.fn(), dispose = vi.fn(), mountPreview = vi.fn(() => ({ presentFrame, dispose }));
  const review = mountDodgeReplayReview({ container, recording: { frames, markers: [{ time: 1, variant: 'artillery' }, { time: 2.5, variant: 'cage' }], counts: {} }, loadPreview: async () => ({ mountPreview }) });
  container.querySelector('.replay-open').click(); await Promise.resolve(); await Promise.resolve();
  expect(presentFrame).toHaveBeenLastCalledWith(frames[4]);
  expect(mountPreview.mock.calls[0][1]).toMatchObject({ controls: false, fullscreenControls: false });
  container.querySelector('.replay-marker').click(); expect(presentFrame).toHaveBeenLastCalledWith(frames[2]);
  expect(container.querySelector('.replay-open').getAttribute('aria-expanded')).toBe('true');
  container.querySelector('.replay-open').click(); expect(dispose).toHaveBeenCalledOnce();
  review.dispose(); dialog.remove();
});
