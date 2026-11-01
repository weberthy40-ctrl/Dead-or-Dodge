const qualityNames={leve:'Leve',medio:'Médio',alto:'Alto',ultra:'Ultra'};
const feedbackNames={responsive:'Confortável',delayed:'Senti atraso',unsure:'Não sei avaliar',clear:'Clara',mixed:'Alguns avisos confusos',unclear:'Difícil de entender',smooth:'Fluida',occasional:'Travadas ocasionais',frequent:'Travadas frequentes'};
const number=value=>Number.isFinite(value)?value.toLocaleString('pt-BR',{maximumFractionDigits:1}):'Sem amostra';

export function reportCondition(report){
 const notes=[];if(report.metrics.status!=='measured')notes.push('Amostra curta');if(report.viewportChanges>0)notes.push('Dimensões mudaram');
 return {stable:notes.length===0,label:notes.join(' · ')||'Janela estável'};
}

/** Explicit export of at most eight in-memory rounds, including their own answers. */
export function buildComparisonReport(reports,gameVersion,createdAt=new Date().toISOString()){
 return {format:'rift-fluency-comparison-v1',gameVersion,createdAt,reports:structuredClone(reports.slice(-8))};
}

export function fluencySummary(reports,gameVersion){
 const lines=[`RIFT LAB · ${gameVersion}`,'Verificação de fluidez — cadência observada no navegador.'];
 for(const [index,r]of reports.slice(-8).entries()){
  const m=r.metrics,answers=r.playerFeedback??{};
  lines.push('',`${index+1}. ${qualityNames[r.quality]??r.quality} · ${r.render.renderWidth??'—'}×${r.render.renderHeight??'—'} · ${reportCondition(r).label}`,
   `FPS médio: ${number(m.averageFps)} · p95: ${m.p95Capped?'≥ ':''}${number(m.p95Ms)} ms · Quadros >50 ms: ${m.longFrames}`,
   `Observação: ${number(m.observedSeconds)} s · Arena pronta: ${number(r.loadingMs)} ms`,
   `Relato: controles ${feedbackNames[answers.controls]??'não respondido'}; leitura ${feedbackNames[answers.clarity]??'não respondido'}; fluidez ${feedbackNames[answers.smoothness]??'não respondido'}.`);
 }
 lines.push('','Mudanças de janela, câmera, rota e carga do computador afetam comparações. Estes dados não medem latência física do mouse ou monitor.');
 return lines.join('\n');
}
