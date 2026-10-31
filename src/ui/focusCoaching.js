import { element,link } from './elements.js';
import { FOCUS_GOAL_TEXT } from '../training/dodge/focusCoaching.js';

export function mountFocusCoaching(container,coaching){
 const doc=container.ownerDocument,section=element(doc,'section','focus-coaching');section.dataset.status=coaching.status;
 section.append(element(doc,'p','eyebrow','OBJETIVO DO EXERCÍCIO'),element(doc,'h3','',coaching.headline),element(doc,'p','muted',FOCUS_GOAL_TEXT));
 const checks=element(doc,'ul','focus-goal-checks');
 for(const check of coaching.checks){const item=element(doc,'li');item.dataset.achieved=String(check.achieved);item.append(element(doc,'span','',`${check.achieved?'✓':'○'} ${check.label}`),element(doc,'strong','',check.value));checks.append(item);}
 section.append(checks,element(doc,'p','focus-next-action',coaching.action));
 if(coaching.comparison){
  const {previous,current}=coaching.comparison,table=element(doc,'table','focus-comparison'),caption=element(doc,'caption','','Rodada anterior nesta tela'),head=element(doc,'tr');
  for(const text of ['Medida','Anterior','Agora']){const th=element(doc,'th','',text);th.scope='col';head.append(th);}const thead=element(doc,'thead');thead.append(head);table.append(caption,thead);const body=element(doc,'tbody');
  for(const [label,a,b]of [['Tempo ativo',`${previous.seconds.toFixed(1)} s`,`${current.seconds.toFixed(1)} s`],['Ameaças evitadas',previous.dodged,current.dodged],['Impactos válidos',previous.hits,current.hits]]){const row=element(doc,'tr'),th=element(doc,'th','',label);th.scope='row';row.append(th,element(doc,'td','',String(a)),element(doc,'td','',String(b)));body.append(row);}table.append(body);section.append(table,element(doc,'p','muted','As rotas e a exposição podem variar. Esta comparação descreve as duas rodadas e fica apenas nesta tela.'));
 }
 if(coaching.status==='achieved')section.append(link(doc,'Escolher outra habilidade','/prepare/dodge','button focus-next-skill'));
 container.append(section);return section;
}
