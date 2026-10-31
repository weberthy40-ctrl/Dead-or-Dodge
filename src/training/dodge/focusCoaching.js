import { FOCUS_RULESET_VERSION } from './focusExercise.js';
import { PREMIUM_FAMILIES } from '../../game3d/artDirection.js';
import { readonlySnapshot } from '../snapshot.js';

export const FOCUS_GOAL=Object.freeze({seconds:30,dodges:8});
export const FOCUS_GOAL_TEXT='Conclua 30 segundos e evite pelo menos oito ameaças.';

/** A practice objective, separate from official scoring, rank and placement. */
export function buildFocusCoaching(family,metrics,previous=null){
 if(!Object.hasOwn(PREMIUM_FAMILIES,family))throw new TypeError('Família de treino inválida.');
 const m=metrics??{},valid=m.terminal===true&&m.mode==='challenge'&&m.rulesetVersion===FOCUS_RULESET_VERSION&&['victory','defeat'].includes(m.endReason)&&Number.isFinite(m.elapsedActiveSeconds)&&m.elapsedActiveSeconds>0&&m.elapsedActiveSeconds<=30.001&&[m.attacksEmitted,m.threatsQualified,m.threatsDodged,m.threatsHit,m.contactsIgnored,m.validHits].every(n=>Number.isInteger(n)&&n>=0)&&m.validHits===m.threatsHit&&m.validHits<=3&&m.threatsDodged+m.threatsHit+m.contactsIgnored<=m.threatsQualified&&m.threatsQualified<=m.attacksEmitted&&(m.endReason!=='victory'||Math.abs(m.elapsedActiveSeconds-30)<=.001);
 if(!valid)return readonlySnapshot({status:'interrupted',headline:'Objetivo sem conclusão válida',action:'Abra o exercício novamente para repetir o objetivo.',checks:[],summary:null,comparison:null});
 const summary={family,seconds:m.elapsedActiveSeconds,dodged:m.threatsDodged,hits:m.validHits},timeReached=m.endReason==='victory'&&summary.seconds>=30-1e-6,dodgesReached=summary.dodged>=FOCUS_GOAL.dodges;
 const complete=timeReached&&dodgesReached;
 const baseline=previous?.family===family&&Number.isFinite(previous.seconds)&&previous.seconds>0&&previous.seconds<=30.001&&[previous.dodged,previous.hits].every(n=>Number.isInteger(n)&&n>=0)?previous:null;
 return readonlySnapshot({status:complete?'achieved':'practice',headline:complete?'Objetivo cumprido nesta rodada':'Seu próximo objetivo',
  action:complete?'Repita para conferir a execução ou escolha outra habilidade na preparação.':!timeReached?PREMIUM_FAMILIES[family].lesson:'Conclua outra rodada e procure evitar oito ameaças; não é necessário ficar perto do perigo para contar uma esquiva.',
  checks:[{label:'Concluir 30 segundos',achieved:timeReached,value:`${Math.min(30,summary.seconds).toFixed(1)} / 30 s`},{label:'Evitar oito ameaças',achieved:dodgesReached,value:`${summary.dodged} / ${FOCUS_GOAL.dodges}`}],
  summary,comparison:baseline?{previous:{...baseline},current:summary}:null,
 });
}
