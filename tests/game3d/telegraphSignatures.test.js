import { it,expect } from 'vitest';
import * as THREE from 'three';
import { createDodgeVisuals } from '../../src/game3d/dodgeVisuals.js';
import { createAttackData,VARIANTS } from '../../src/training/dodge/projectiles.js';
import { PREMIUM_FAMILIES } from '../../src/game3d/artDirection.js';
import { GRAPHICS_PRESETS } from '../../src/settings/preferences.js';

it.each(Object.keys(GRAPHICS_PRESETS))('keeps distinctive preparation marks inside the real footprint on %s',quality=>{
 for(const {variant}of Object.values(PREMIUM_FAMILIES)){
  const scene=new THREE.Scene(),visuals=createDodgeVisuals(scene,{quality,effects:GRAPHICS_PRESETS[quality].effects}),p={...createAttackData({variant,origin:{x:0,z:0},direction:{x:1,z:0},config:{...VARIANTS[variant],windup:.65}}),id:'test',phase:'warning'},snapshot={elapsed:0,level:5,projectiles:[p]},before=JSON.stringify(snapshot);visuals.sync(snapshot);scene.updateMatrixWorld(true);const marks=[];scene.traverse(n=>{if(n.name==='telegraph-signature')marks.push(n);});expect(marks.length).toBe(({arcane_bolt:2,heavy_lance:1,hook_linear:1,sun_beam:2,artillery:4})[variant]);
  for(const mark of marks){const positions=mark.geometry.attributes.position;for(let i=0;i<positions.count;i++){const at=new THREE.Vector3().fromBufferAttribute(positions,i).applyMatrix4(mark.matrixWorld);if(p.shape==='circle')expect(Math.hypot(at.x,at.z)).toBeLessThanOrEqual(p.radius+1e-6);else{expect(Math.abs(at.z)).toBeLessThanOrEqual(p.radius+1e-6);expect(at.x).toBeGreaterThanOrEqual(-1e-6);expect(at.x).toBeLessThanOrEqual((p.length||p.range)+1e-6);}}}
  expect(JSON.stringify(snapshot)).toBe(before);expect(new THREE.Raycaster(new THREE.Vector3(0,10,0),new THREE.Vector3(0,-1,0)).intersectObjects(marks,true)).toEqual([]);visuals.sync({...snapshot,elapsed:1,projectiles:[{...p,phase:'active',age:1}]});expect(marks.every(n=>n.parent.visible===false)).toBe(true);visuals.dispose();expect(scene.children).toHaveLength(0);
 }
});
