import { it,expect } from 'vitest';
import { buildComparisonReport,fluencySummary,reportCondition } from '../../src/diagnostics/reportComparison.js';

const report=(n=0)=>({format:'rift-fluency-report-v1',quality:'medio',createdAt:String(n),viewportChanges:0,loadingMs:250,render:{renderWidth:1920,renderHeight:1080},metrics:{status:'measured',averageFps:144,p95Ms:8.2,p95Capped:false,longFrames:0,observedSeconds:30},playerFeedback:{controls:null,clarity:null,smoothness:null}});
it('exports the last eight complete records as an independent snapshot with their answers',()=>{
 const records=Array.from({length:10},(_,i)=>report(i));records[9].playerFeedback.controls='responsive';const bundle=buildComparisonReport(records,'test','now');expect(bundle.format).toBe('rift-fluency-comparison-v1');expect(bundle.reports).toHaveLength(8);expect(bundle.reports[0].createdAt).toBe('2');expect(bundle.reports[7].playerFeedback.controls).toBe('responsive');bundle.reports[7].metrics.averageFps=1;expect(records[9].metrics.averageFps).toBe(144);
});
it('labels short samples and viewport changes without hiding their measurements or grading hardware',()=>{
 const r=report();expect(reportCondition(r)).toEqual({stable:true,label:'Janela estável'});r.viewportChanges=1;r.metrics.status='short';expect(reportCondition(r)).toEqual({stable:false,label:'Amostra curta · Dimensões mudaram'});const text=fluencySummary([r],'test');expect(text).toContain('FPS médio: 144');expect(text).toContain('p95: 8,2 ms');expect(text).toContain('Dimensões mudaram');expect(text).toContain('não respondido');expect(text).toContain('não medem latência física');
});
it('keeps capped quantiles explicit and player answers distinct from observed numbers',()=>{
 const r=report();r.metrics.p95Capped=true;r.metrics.p95Ms=1000;r.playerFeedback={controls:'delayed',clarity:'clear',smoothness:'occasional'};const text=fluencySummary([r],'test');expect(text).toContain('p95: ≥ 1.000 ms');expect(text).toContain('Senti atraso');expect(text).toContain('FPS médio: 144');expect(text).toContain('Travadas ocasionais');
});
