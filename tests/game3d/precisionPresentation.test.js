import { expect,it,vi } from 'vitest';
import * as THREE from 'three';
import { createPrecisionVisuals } from '../../src/game3d/precisionVisuals.js';

it.each([.01,.48,1,2])('keeps next/late marks inside the logical sphere and outside the hit-selection API (radius %s)',radius=>{
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(44,16/9,.1,160);camera.position.set(0,34,.001);camera.lookAt(0,0,0);camera.updateMatrixWorld();
 const exercise={setProjectionValidator:vi.fn()},v=createPrecisionVisuals(scene,camera,exercise),target={id:'one',position:{x:1,z:-3},radius,order:1,overdue:true},snapshot={priority:true,nextTargetId:'one',targets:[target]},before=JSON.stringify(snapshot);
 v.sync(snapshot);scene.updateMatrixWorld(true);const body=v.clickTargets()[0];expect(v.clickTargets()).toHaveLength(1);expect(body.scale.x).toBe(radius);expect(body.geometry.parameters.radius).toBe(1);
 for(const name of ['precision-next-focus','precision-late-badge']){const node=scene.getObjectByName(name);expect(node.visible).toBe(true);const vertices=node.geometry.attributes.position;for(let i=0;i<vertices.count;i++){const point=new THREE.Vector3().fromBufferAttribute(vertices,i).applyMatrix4(node.matrixWorld);expect(point.distanceTo(body.position)).toBeLessThan(radius+1e-7);}const hits=[];node.raycast(new THREE.Raycaster(),hits);expect(hits).toEqual([]);}
 const ray=new THREE.Raycaster(new THREE.Vector3(1,10,-3),new THREE.Vector3(0,-1,0)),hit=ray.intersectObjects(v.clickTargets())[0];expect(hit.object).toBe(body);expect(v.acceptHit(ray,hit)).toBe(true);
 const outside=new THREE.Raycaster(new THREE.Vector3(1+radius*1.05,10,-3),new THREE.Vector3(0,-1,0));expect(outside.intersectObjects(v.clickTargets())).toHaveLength(0);expect(JSON.stringify(snapshot)).toBe(before);v.dispose();
});

it('reuses the focus mark, removes stale badges and releases shared GPU resources once',()=>{
 const scene=new THREE.Scene(),v=createPrecisionVisuals(scene,new THREE.PerspectiveCamera(),{setProjectionValidator(){}});
 for(let i=0;i<40;i++){const id=`target-${i}`;v.sync({priority:true,nextTargetId:id,targets:[{id,position:{x:0,z:0},radius:.7,overdue:true,order:1}]});expect(scene.children[0].children).toHaveLength(3);}
 const owned=new Set();scene.traverse(n=>{if(n.geometry&&!n.isSprite)owned.add(n.geometry);if(n.material)owned.add(n.material);});const spies=[...owned].map(resource=>vi.spyOn(resource,'dispose'));
 v.dispose();v.dispose();expect(scene.children).toHaveLength(0);for(const spy of spies)expect(spy).toHaveBeenCalledOnce();
});
