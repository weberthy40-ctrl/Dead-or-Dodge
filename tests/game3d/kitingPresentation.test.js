import { expect,it,vi } from 'vitest';
import * as THREE from 'three';
import { createKitingPractice } from '../../src/training/kiting/practice.js';
import { createKitingVisuals } from '../../src/game3d/kitingVisuals.js';
import { createKitingMotion } from '../../src/game3d/kitingMotion.js';

it('separates the selected enemy from another enemy preparing an attack, preserving range and source state',()=>{
 const p=createKitingPractice(),scene=new THREE.Scene(),v=createKitingVisuals(scene),base=p.snapshot();
 const snapshot={...base,selectedTargetId:base.targets[0].id,targets:base.targets.map((target,i)=>({...target,attackPhase:i===1?'windup':'ready'}))},before=JSON.stringify(snapshot);
 v.sync(snapshot);v.setRangeVisible(true);const group=scene.getObjectByName('kiting-presentation'),selected=group.children.filter(n=>n.name==='kiting-selected-target'&&n.visible),warnings=group.children.filter(n=>n.name==='kiting-enemy-windup'&&n.visible);
 expect(selected).toHaveLength(1);expect(warnings).toHaveLength(1);expect(selected[0].position.x).toBe(snapshot.targets[0].position.x);expect(warnings[0].position.x).toBe(snapshot.targets[1].position.x);
 expect(selected[0].geometry.parameters.thetaLength).toBe(Math.PI*2);expect(warnings[0].geometry.parameters.thetaLength).toBeLessThan(Math.PI*2);
 expect(group.getObjectByName('kiting-range').scale.x).toBe(base.config.attackRange);expect(group.getObjectByName('kiting-range-backing').visible).toBe(true);expect(JSON.stringify(snapshot)).toBe(before);
 v.setRangeVisible(false);expect(group.getObjectByName('kiting-range').visible).toBe(false);v.dispose();p.dispose();
});

it('shows a player phase cue only during real preparation or recovery and releases pooled resources once',()=>{
 const p=createKitingPractice(),scene=new THREE.Scene(),v=createKitingVisuals(scene,{reducedMotion:true});p.start();v.sync(p.snapshot());expect(scene.getObjectByName('kiting-player-phase').visible).toBe(false);
 p.click('kiting-target');p.update(.1);v.sync(p.snapshot());const cue=scene.getObjectByName('kiting-player-phase');expect(cue.visible).toBe(true);const count=cue.geometry.drawRange.count;
 p.update(.05);v.sync(p.snapshot());expect(cue.geometry.drawRange.count).toBeGreaterThan(count);
 const snapshot=p.snapshot();for(let i=0;i<30;i++)v.sync({...snapshot,targets:snapshot.targets.map(t=>({...t,id:`${i}-${t.id}`})),selectedTargetId:null,elapsed:i});
 const resources=new Set();scene.traverse(node=>{if(node.geometry&&!node.isSprite)resources.add(node.geometry);if(node.material)for(const material of [node.material].flat())resources.add(material);});const spies=[...resources].map(r=>vi.spyOn(r,'dispose'));
 v.dispose();v.dispose();expect(scene.children).toHaveLength(0);for(const spy of spies)expect(spy).toHaveBeenCalledOnce();p.dispose();
});

it('keeps the attack posture bounded, freezes zero delta and removes motion when requested',()=>{
 const pose=createKitingMotion();const windup=pose.update({phase:'windup'},.05);expect(windup).toBeLessThan(0);expect(windup).toBeGreaterThanOrEqual(-.075);
 const release=pose.update({phase:'recovery',confirmed:true},.05);expect(release).toBeGreaterThan(windup);expect(release).toBeLessThanOrEqual(.055);expect(pose.update({phase:'ready'},0)).toBe(release);
 expect(pose.update({phase:'windup',reducedMotion:true},.1)).toBe(0);
});
