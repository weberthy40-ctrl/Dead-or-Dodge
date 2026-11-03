/** Upper-body presentation only; the controller owns world position and facing. */
export function createKitingMotion() {
  let pitch = 0;
  return { update({ phase, confirmed = false, reducedMotion = false }, dt) {
    if (reducedMotion) { pitch = 0; return pitch; }
    if (!Number.isFinite(dt) || dt <= 0) return pitch;
    const target = confirmed ? .055 : phase === 'windup' ? -.075 : 0;
    const alpha = 1 - Math.exp(-Math.min(.1, dt) / (confirmed ? .03 : .055));
    pitch += (target - pitch) * alpha;
    return pitch;
  } };
}
