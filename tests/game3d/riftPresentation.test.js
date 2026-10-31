import { it,expect } from 'vitest';
import * as THREE from 'three';
import { createDodgeArena } from '../../src/game3d/dodgeArena.js';
import { createDodgeVisuals } from '../../src/game3d/dodgeVisuals.js';
import { GRAPHICS_PRESETS } from '../../src/settings/preferences.js';
import { DODGE_ARENA } from '../../src/game3d/spatial.js';
import { PREMIUM_FAMILIES } from '../../src/game3d/artDirection.js';
import { createAttackData } from '../../src/training/dodge/projectiles.js';
it.each(Object.keys(GRAPHICS_PRESETS))('keeps arcane architecture outside the arena and collision contours readable (%s)',quality=>{
 const arena=createDodgeArena({quality});arena.group.updateMatrixWorld(true);const bounds=DODGE_ARENA.bounds;
 arena.group.traverse(n=>{if(!n.name.startsWith('arcane-'))return;const box=new THREE.Box3().setFromObject(n);expect(box.max.x<bounds.minX||box.min.x>bounds.maxX||box.max.z<bounds.minZ||box.min.z>bounds.maxZ).toBe(true);});
 const scene=new THREE.Scene(),visuals=createDodgeVisuals(scene,{quality,effects:GRAPHICS_PRESETS[quality].effects});
 for(const family of Object.values(PREMIUM_FAMILIES)){const p={...createAttackData({variant:family.variant,origin:{x:0,z:0},direction:{x:1,z:0}}),id:family.variant,phase:'active',age:2};const original=JSON.stringify(p);visuals.sync({projectiles:[p],elapsed:2});const root=scene.children[0].children.find(n=>n.visible);expect(root.getObjectByName(p.shape==='beam'?'beam':p.shape==='circle'?'impact-edge':'collision-footprint').visible).toBe(true);expect(JSON.stringify(p)).toBe(original);visuals.sync({projectiles:[],elapsed:2});}
 visuals.dispose();arena.dispose();
});
