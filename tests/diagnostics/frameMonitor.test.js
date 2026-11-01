import { it,expect } from 'vitest';
import { createFrameMonitor } from '../../src/diagnostics/frameMonitor.js';

it('measures natural frame intervals after warmup, including long stalls instead of simulation caps',()=>{
 const m=createFrameMonitor();m.frame(0,{elapsed:0});m.frame(2000,{elapsed:2});
 for(let i=1;i<=600;i++)m.frame(2000+i*1000/60,{elapsed:2+i/60});
 const s=m.snapshot();expect(s.frames).toBe(600);expect(s.observedSeconds).toBeCloseTo(10);expect(s.averageFps).toBeCloseTo(60);expect(s.p95Ms).toBeCloseTo(16.625,3);expect(s.longFrames).toBe(0);expect(s.status).toBe('measured');
 m.frame(14000,{elapsed:13});expect(m.snapshot().maxMs).toBeCloseTo(2000);expect(m.snapshot().longFrames).toBe(1);
});
it('excludes paused/hidden gaps, rejects invalid/backward samples and freezes completed results',()=>{
 const m=createFrameMonitor({warmupSeconds:0});m.frame(100);m.frame(120);m.suspend();m.frame(10000);m.frame(10020);m.frame(20000,{active:false});m.frame(30000);m.frame(30020);m.frame(NaN);m.frame(40000);m.frame(39900);m.frame(40020);m.command('dash');m.command('injected');
 const s=m.finish();expect(s.frames).toBe(4);expect(s.averageFps).toBe(50);expect(s.commands.dash).toBe(1);expect(Object.isFrozen(s.commands)).toBe(true);m.command('dash');m.frame(50000);expect(m.snapshot()).toEqual(s);expect(s.status).toBe('short');
});
it('bounds quantiles at one second and explicitly marks their upper bucket',()=>{
 const m=createFrameMonitor({warmupSeconds:0});m.frame(0);for(let i=1;i<=40;i++)m.frame(i*1500);const s=m.snapshot();expect(s.p95Capped).toBe(true);expect(s.p95Ms).toBe(1000);expect(s.maxMs).toBe(1500);expect(s.longFrames).toBe(40);expect(s.quantileResolutionMs).toBe(.25);expect(()=>createFrameMonitor({warmupSeconds:-1})).toThrow();
});
