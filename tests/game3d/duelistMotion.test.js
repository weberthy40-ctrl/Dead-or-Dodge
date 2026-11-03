import { it,expect } from 'vitest';
import { createDuelistMotion } from '../../src/game3d/duelistMotion.js';

it('blends running and stopping at equal rates across frame sizes, with no world pose output',()=>{
 function run(step){const motion=createDuelistMotion();let pose;for(let t=0;t<1-1e-8;t+=step)pose=motion.update({angle:0,moving:true},step);return {motion,pose};}
 const a=run(.05),b=run(1/60);expect(a.pose.run).toBeCloseTo(b.pose.run,6);expect(a.pose.pitch).toBeLessThan(0);expect(Object.keys(a.pose).sort()).toEqual(['pitch','roll','run']);for(let i=0;i<20;i++)a.pose=a.motion.update({angle:0,moving:false},.05);expect(a.pose.run).toBeLessThan(.001);expect(Math.abs(a.pose.pitch)).toBeLessThan(.001);
});
it('handles heading wrap, bounds turn lean, freezes at zero delta and resets reduced motion',()=>{
 const m=createDuelistMotion();m.update({angle:Math.PI-.01,moving:true},.05);const small=m.update({angle:-Math.PI+.01,moving:true},.05);expect(Math.abs(small.roll)).toBeLessThan(.01);const turn=m.update({angle:0,moving:true,ability:'dash'},.05);expect(Math.abs(turn.roll)).toBeLessThanOrEqual(.065);expect(turn.pitch).toBeGreaterThanOrEqual(-.14);expect(m.update({angle:2,moving:false},0)).toEqual(turn);expect(m.update({angle:2,moving:false,reducedMotion:true},.05)).toEqual({pitch:0,roll:0,run:0});
});
it('settles stopping promptly and reaches the dash stance within its short active window',()=>{
 const motion=createDuelistMotion();for(let i=0;i<30;i++)motion.update({angle:0,moving:true},1/60);
 const dash=motion.update({angle:0,moving:true,ability:'dash'},.05);expect(dash.pitch).toBeLessThan(-.11);
 let stop;for(let i=0;i<9;i++)stop=motion.update({angle:0,moving:false},1/60);
 expect(stop.run).toBeLessThan(.04);expect(Math.abs(stop.roll)).toBeLessThan(.001);expect(stop.pitch).toBeGreaterThan(-.01);
});
