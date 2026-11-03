import { expect, it, vi } from 'vitest';
import * as THREE from 'three';
import { createAnimatedModel } from '../../src/game3d/sceneAssets.js';
import { createCharacter } from '../../src/game3d/character.js';
import { disposeObject } from '../../src/game3d/resources.js';

function asset() {
  const scene = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1, 2, 1), new THREE.MeshStandardMaterial({ color: 0x778899 }));
  body.name = 'Knight_Body'; scene.add(body);
  return { scene, animations: [
    new THREE.AnimationClip('Idle', 1, [new THREE.NumberKeyframeTrack('Knight_Body.rotation[x]', [0, 1], [0, 0])]),
    new THREE.AnimationClip('Running_A', 1, [new THREE.NumberKeyframeTrack('Knight_Body.rotation[x]', [0, 1], [.8, .8])]),
  ] };
}

it('blends the real animation mixer without restarting the gait or moving its world pose', () => {
  const source = asset(), spy = vi.spyOn(THREE.AnimationMixer.prototype, 'clipAction');
  const model = createAnimatedModel(source, { dodge: true });
  try {
    const origin = model.root.position.clone();
    expect(spy).toHaveBeenCalledTimes(1);
    const body = model.root.getObjectByName('Knight_Body');
    for (const weight of [.2, .7, .35]) {
      model.update({ moving: weight > .35, locomotion: { run: weight } }, .02);
      expect(body.rotation.x).toBeCloseTo(.8 * weight, 6);
      expect(model.root.position.equals(origin)).toBe(true);
    }
    const running = spy.mock.results[1].value, phase = running.time;
    model.update({ moving: false, locomotion: { run: 0 } }, .02);
    expect(body.rotation.x).toBeCloseTo(0, 6);
    expect(running.time).toBe(phase);
    // Exponential easing approaches zero without reaching it: subvisible tails
    // must settle too, or the hidden running cycle keeps advancing forever.
    model.update({ moving: false, locomotion: { run: .0005 } }, .02);
    expect(body.rotation.x).toBeCloseTo(0, 6);
    expect(running.time).toBe(phase);
    model.update({ moving: true, locomotion: { run: .4 } }, .02);
    expect(running.time).toBeCloseTo(phase + .02 * 1.45, 6);
    expect(spy).toHaveBeenCalledTimes(2);
    const frozen = body.rotation.x;
    model.update({ moving: false, reducedMotion: true }, .1);
    expect(body.rotation.x).toBe(frozen);
    expect(source.scene.getObjectByName('Knight_Body').rotation.x).toBe(0);
    expect(source.scene.getObjectByName('Knight_Body').material.color.getHex()).toBe(0x778899);
  } finally { spy.mockRestore(); model.dispose(); disposeObject(model.root); disposeObject(source.scene); }
});

it('keeps the selection marker cosmetic, uniquely owned and exclusive to the local dodge player', () => {
  const player = createCharacter({ dodge: true });
  const enemy = createCharacter({ dodge: true, enemy: true });
  const otherMode = createCharacter();
  try {
    const ring = player.group.getObjectByName('duelist-selection-ring');
    const heading = player.group.getObjectByName('duelist-heading');
    expect(ring.material.toneMapped).toBe(false);
    expect(heading.material).toBe(ring.material);
    expect(enemy.group.getObjectByName('duelist-heading')).toBeUndefined();
    expect(otherMode.group.getObjectByName('duelist-heading')).toBeUndefined();
    player.setPose({ x: 2, z: 3 }, Math.PI / 2);
    player.group.updateMatrixWorld(true);
    const before = player.group.position.clone(), facing = player.group.rotation.y;
    player.onAbility('dash'); player.animate({ moving: true, state: 'running' }, .05);
    expect(player.group.position.equals(before)).toBe(true);
    expect(player.group.rotation.y).toBe(facing);
    const hits = [], ray = new THREE.Raycaster(new THREE.Vector3(2, 5, 3), new THREE.Vector3(0, -1, 0));
    for (const node of [ring, heading, player.group.getObjectByName('duelist-selection-backing')]) node.raycast(ray, hits);
    expect(hits).toEqual([]);
    const geometryDisposal = vi.spyOn(heading.geometry, 'dispose'), materialDisposal = vi.spyOn(ring.material, 'dispose');
    player.dispose(); player.dispose();
    expect(geometryDisposal).toHaveBeenCalledOnce(); expect(materialDisposal).toHaveBeenCalledOnce();
  } finally { player.dispose(); enemy.dispose(); otherMode.dispose(); }
});
