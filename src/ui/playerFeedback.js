import { element } from './elements.js';
import { downloadReport } from './downloadReport.js';
import { GAME_VERSION } from '../app/version.js';
import { FOCUS_GOAL } from '../training/dodge/focusCoaching.js';
import { FOCUS_RULESET_VERSION } from '../training/dodge/focusExercise.js';

export const PLAYER_QUESTIONS=Object.freeze({
 controls:['Resposta dos controles',[['responsive','Confortável'],['delayed','Senti atraso'],['unsure','Não sei avaliar']]],
 clarity:['Leitura das ameaças',[['clear','Clara'],['mixed','Alguns avisos confusos'],['unclear','Difícil de entender']]],
 difficulty:['Dificuldade do objetivo',[['easy','Fácil'],['balanced','Adequada'],['hard','Difícil']]],
 smoothness:['Fluidez percebida',[['smooth','Fluida'],['occasional','Travadas ocasionais'],['frequent','Travadas frequentes']]],
});
export function mountPlayerQuestions(container,keys){
 const doc=container.ownerDocument,fields=new Map();
 for(const key of keys){const [title,options]=PLAYER_QUESTIONS[key],label=element(doc,'label','player-question',title),select=element(doc,'select');select.dataset.feedback=key;select.append(element(doc,'option','','Selecione…'));select.firstChild.value='';for(const [value,text]of options){const option=element(doc,'option','',text);option.value=value;select.append(option);}label.append(select);container.append(label);fields.set(key,select);}
 return {read:()=>Object.fromEntries([...fields].map(([key,select])=>[key,select.value||null])),complete:()=>[...fields.values()].every(select=>Boolean(select.value))};
}
export function mountPracticeFeedback(container,{family,summary,render=null,achieved=false,download=downloadReport}){
 const doc=container.ownerDocument,details=element(doc,'details','practice-calibration');details.append(element(doc,'summary','','Avaliar esta experiência (opcional)'),element(doc,'p','muted','A meta de 30 segundos e oito esquivas está em calibração. Seu relato ajuda a avaliá-la. Nada é enviado automaticamente.'));
 const fields=mountPlayerQuestions(details,['difficulty','clarity','controls']),button=element(doc,'button','button','Baixar relato desta rodada');button.type='button';button.disabled=true;details.addEventListener('change',()=>{button.disabled=!fields.complete();});
 button.addEventListener('click',()=>{if(!fields.complete())return;download(doc,`rift-lab-pratica-${family}.json`,{format:'rift-practice-feedback-v1',gameVersion:GAME_VERSION,ruleset:FOCUS_RULESET_VERSION,family,goal:FOCUS_GOAL,goalAchieved:achieved,round:summary,render,playerFeedback:fields.read(),createdAt:new Date().toISOString()});});
 details.append(element(doc,'p','muted','O arquivo contém só esta rodada e suas respostas; não inclui seu histórico ou identidade.'),button);container.append(details);return details;
}
