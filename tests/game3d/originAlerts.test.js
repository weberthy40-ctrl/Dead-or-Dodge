// @vitest-environment jsdom
import { it,expect } from 'vitest';
import * as THREE from 'three';
import { createOriginAlerts,layoutOriginAlerts,ORIGIN_ALERT_LIMIT } from '../../src/game3d/originAlerts.js';
import { createDodgeVisuals } from '../../src/game3d/dodgeVisuals.js';
import { createAttackData,VARIANTS } from '../../src/training/dodge/projectiles.js';
const size={width:1366,height:768};
function camera(){const c=new THREE.PerspectiveCamera(44,size.width/size.height,.1,200);c.position.set(0,26,18);c.lookAt(0,0,0);c.updateMatrixWorld(true);return c;}
const projectile=(i,variant='arcane_bolt')=>({...createAttackData({variant,origin:{x:45,z:0},direction:{x:-1,z:0},caster:{x:45,z:0},config:{...VARIANTS[variant],windup:1}}),id:`test-${i}`,phase:'warning',age:i*.01});

it('prioritizes the nearest activation, limits clutter and separates badges while preserving every physical snapshot',()=>{
 const p=Array.from({length:12},(_,i)=>projectile(i)),before=JSON.stringify(p),result=layoutOriginAlerts(p,camera(),size);expect(result.alerts).toHaveLength(ORIGIN_ALERT_LIMIT);expect(result.hiddenCount).toBe(8);expect(result.alerts[0].id).toBe('test-11');expect(JSON.stringify(p)).toBe(before);
 for(const a of result.alerts){expect(a.x).toBeGreaterThanOrEqual(52);expect(a.x).toBeLessThanOrEqual(size.width-52);expect(a.y).toBeGreaterThan(100);expect(a.y).toBeLessThan(size.height-100);expect(Number.isFinite(a.angle)).toBe(true);for(const b of result.alerts)if(a!==b)expect(Math.abs(a.x-b.x)>=112-1e-6||Math.abs(a.y-b.y)>=38-1e-6).toBe(true);}
 expect(layoutOriginAlerts([...p].reverse(),camera(),size)).toEqual(result);
});
it('omits expired/on-screen/invalid origins and projects a caster behind the perspective camera without mirroring left/right',()=>{
 const c=camera(),p=projectile(0);expect(layoutOriginAlerts([{...p,caster:{x:0,z:0}},{...p,phase:'active'},{...p,caster:{x:NaN,z:0}}],c,size).alerts).toEqual([]);const behind=layoutOriginAlerts([{...p,caster:{x:45,z:120}}],c,size).alerts[0];expect(behind.x).toBeGreaterThan(size.width/2);expect(layoutOriginAlerts([p],c,{width:0,height:0}).alerts).toEqual([]);
});
it('reuses four upright labels, preserves old variants and clears immediately on phase change or disposal',()=>{
 const host=document.createElement('div'),c=camera(),view=createOriginAlerts(host,c),p=projectile(0,'hook_linear');view.sync([p]);let label=host.querySelector('.dodge-origin-alert:not([hidden])');expect(label.dataset.variant).toBe('hook_linear');expect(label.textContent).toContain('Gancho');expect(label.querySelector('.origin-direction').style.transform).toContain('rotate');expect(label.style.transform).toBe('');
 for(let i=0;i<100;i++)view.sync([projectile(i,i%2?'heavy_lance':'meteor_rain')]);expect(host.querySelectorAll('.dodge-origin-alert')).toHaveLength(4);expect(host.textContent).toContain('Lança');view.sync([{...p,phase:'active'}]);expect(host.querySelectorAll('.dodge-origin-alert:not([hidden])')).toHaveLength(0);view.dispose();view.dispose();expect(host.children).toHaveLength(0);
});
it('integrates labels into all visual quality levels without changing warning footprints',()=>{
 for(const quality of ['leve','medio','alto','ultra']){const host=document.createElement('div'),scene=new THREE.Scene(),p=projectile(0,'sun_beam'),snapshot={elapsed:.1,level:5,projectiles:[p]},before=JSON.stringify(snapshot),v=createDodgeVisuals(scene,{camera:camera(),container:host,quality,effects:quality!=='leve'});v.sync(snapshot);expect(host.querySelector('.dodge-origin-alert:not([hidden])').textContent).toContain('Feixe');expect(scene.getObjectByName('cast-path').scale.x).toBe(1.6);expect(JSON.stringify(snapshot)).toBe(before);v.sync({...snapshot,projectiles:[]});expect(host.querySelectorAll('.dodge-origin-alert:not([hidden])')).toHaveLength(0);v.dispose();expect(host.children).toHaveLength(0);}
});
