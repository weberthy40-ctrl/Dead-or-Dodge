import { it,expect } from 'vitest';
import * as THREE from 'three';
import { createEventBus } from '../../src/core/eventBus.js';
import { createProjectiles,VARIANTS } from '../../src/training/dodge/projectiles.js';
import { createImpactPresentation } from '../../src/game3d/impactPresentation.js';
import { createDodgeImpactVisuals } from '../../src/game3d/dodgeImpactVisuals.js';
import { createDodgeReplay } from '../../src/training/dodge/replay.js';
import { PLAYER_RADIUS } from '../../src/training/dodge/geometry.js';

const zero={x:0,z:0};
function setup(observe=true){
 const events=createEventBus(),log=[];
 const projectiles=createProjectiles({capacity:20,onEvent:e=>{log.push(e);events.emit(`dodge:${e.type}`,{...e,attemptId:'one'});}});
 const collector=observe?createImpactPresentation({events,attemptId:'one',getSnapshot:()=>({projectiles:projectiles.snapshot()})}):null;
 return {events,projectiles,collector,log};
}
it('retains a confirmed beam after physics removes it, expires on active time and releases listeners',()=>{
 const {events,projectiles,collector}=setup();projectiles.spawn({variant:'sun_beam',origin:{x:-10,z:0},direction:{x:1,z:0}});projectiles.update(1.2,zero,zero);
 expect(projectiles.snapshot()).toHaveLength(0);const first=collector.sample(1.2);expect(first).toHaveLength(1);expect(first[0]).toMatchObject({shape:'beam',radius:.8,length:40,age:0});expect(Object.isFrozen(first[0].origin)).toBe(true);
 expect(collector.sample(1.2)).toEqual(first);expect(collector.sample(1.32)[0].age).toBeCloseTo(.12);expect(collector.sample(1.45)).toHaveLength(0);collector.dispose();collector.dispose();expect(events.emit('dodge:impact',{attemptId:'one',id:'late',variant:'sun_beam'})).toBe(0);
});
it('places a fast projectile echo at swept contact, while leaving the physical timeline unchanged',()=>{
 const a=setup(),b=setup(false);
 for(const test of [a,b]){test.projectiles.spawn({variant:'fast',origin:{x:-10,z:0},direction:{x:1,z:0}});test.projectiles.update(1.5,zero,zero);}
 expect(a.log).toEqual(b.log);expect(a.projectiles.snapshot()).toEqual(b.projectiles.snapshot());expect(a.collector.sample(1.5)[0].position.x).toBeCloseTo(-VARIANTS.fast.radius-PLAYER_RADIUS);a.collector.dispose();
});
it('ignores expiration, foreign attempts and unobserved impact events; bounds bursts at eight echoes',()=>{
 const {events,projectiles,collector}=setup();events.emit('dodge:impact',{attemptId:'foreign',id:'projectile-1',variant:'fast'});events.emit('dodge:impact',{attemptId:'one',id:'missing',variant:'fast'});expect(collector.sample(0)).toHaveLength(0);
 projectiles.spawn({variant:'fast',origin:{x:0,z:15},direction:{x:1,z:0}});projectiles.update(7,zero,zero);expect(collector.sample(7)).toHaveLength(0);
 for(let i=0;i<20;i++)projectiles.spawn({variant:'artillery',origin:zero,direction:{x:0,z:1},config:{...VARIANTS.artillery,windup:0}});
 projectiles.update(.05,zero,zero);const echoes=collector.sample(7.05);expect(echoes).toHaveLength(8);expect(new Set(echoes.map(e=>e.id)).size).toBe(8);collector.dispose();expect(echoes).toHaveLength(8);
});
it('captures the fatal sub-frame and supports seeking echoes backward without changing collision snapshots',()=>{
 const {projectiles,collector}=setup(),recording=createDodgeReplay();const snap=elapsed=>({kind:'dodge',level:5,elapsed,projectiles:projectiles.snapshot(),impactEchoes:collector.sample(elapsed)});
 recording.capture(snap(0),zero);projectiles.spawn({variant:'artillery',origin:zero,direction:{x:0,z:1},config:{...VARIANTS.artillery,windup:0}});projectiles.update(.025,zero,zero);
 expect(recording.capture(snap(.025),zero)).toBe(false);expect(recording.capture(snap(.025),zero,0,{force:true})).toBe(true);expect(recording.capture(snap(.025),zero,0,{force:true})).toBe(false);
 const frames=recording.snapshot().frames;expect(frames[1].snapshot.impactEchoes).toHaveLength(1);expect(frames[0].snapshot.impactEchoes).toHaveLength(0);
 const scene=new THREE.Scene(),visuals=createDodgeImpactVisuals(scene,{effects:false,reducedMotion:true});visuals.sync(frames[1].snapshot.impactEchoes);expect(scene.children[0].children.filter(n=>n.visible)).toHaveLength(1);visuals.sync(frames[0].snapshot.impactEchoes);expect(scene.children[0].children.every(n=>!n.visible)).toBe(true);visuals.sync(frames[1].snapshot.impactEchoes);expect(scene.getObjectByName('impact-rim').scale.x).toBe(1.6);expect(projectiles.snapshot()).toHaveLength(0);visuals.dispose();visuals.dispose();expect(scene.children).toHaveLength(0);collector.dispose();
});
it.each([false,true])('keeps echo footprints stable with cosmetic effects %s and never ray-selects them',effects=>{
 const scene=new THREE.Scene(),visuals=createDodgeImpactVisuals(scene,{effects});
 const echo={id:'beam',variant:'sun_beam',shape:'beam',origin:{x:-10,z:0},position:zero,direction:{x:1,z:0},radius:.8,length:40,wallWidth:0,age:.01},original=JSON.stringify(echo);
 visuals.sync([echo]);expect(scene.getObjectByName('impact-beam').scale.x).toBe(1.6);expect(scene.getObjectByName('impact-beam').scale.z).toBe(40);const before=scene.getObjectByName('impact-beam').material.opacity;visuals.sync([{...echo,age:.2}]);expect(scene.getObjectByName('impact-beam').material.opacity).toBeLessThan(before);visuals.sync([echo]);expect(scene.getObjectByName('impact-beam').material.opacity).toBe(before);scene.updateMatrixWorld(true);expect(new THREE.Raycaster(new THREE.Vector3(0,5,0),new THREE.Vector3(0,-1,0)).intersectObjects(scene.children,true)).toHaveLength(0);expect(JSON.stringify(echo)).toBe(original);visuals.dispose();expect(scene.children).toHaveLength(0);
});
