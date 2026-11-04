import { appendTrainingBrief } from './trainingPresentation.js';
import { element } from './elements.js';
/** Session remains idle until assets are ready and the player explicitly starts. */
export function mountDodgeReady({screen,stage,session,title='Pronto para desviar?',help='Entre em tela cheia se preferir. Clique em Iniciar quando estiver pronto.',startLabel='Iniciar desafio',onStart=()=>{},brief}){
 const document=screen.ownerDocument,panel=element(document,'section','arena-ready'),card=element(document,'div','arena-ready-card');
 const heading=element(document,'h2','',title),helpText=element(document,'p','muted',help),button=element(document,'button','button primary',startLabel),status=element(document,'p','ready-status','Carregando arena…');
 button.type='button';button.disabled=true;panel.setAttribute('aria-label','Preparação da arena');card.append(heading,helpText,button,status);if(brief){panel.classList.add('training-ready');card.classList.add('training-ready-card');card.prepend(element(document,'p','eyebrow','ANTES DE COMEÇAR'));const facts=appendTrainingBrief(card,brief);helpText.before(facts);}panel.append(card);screen.append(panel);let disposed=false;
 const update=()=>{const ready=['ready','basic'].includes(stage.dataset.visuals)&&!stage.querySelector('.preview-error');button.disabled=!ready;status.textContent=ready?(brief?'Arena pronta. O treino começa ao iniciar.':'Direito · mover   Espaço · centralizar   ESC · pausar'):(brief?'Preparando arena…':'Carregando arena…');};
 const observer=new document.defaultView.MutationObserver(update);observer.observe(stage,{attributes:true,attributeFilter:['data-visuals'],childList:true});update();
 function dispose(){if(disposed)return;disposed=true;observer.disconnect();panel.remove();}
 button.addEventListener('click',()=>{if(button.disabled||session.snapshot().state!=='idle')return;if(session.start()){dispose();onStart();const canvas=stage.querySelector('canvas');if(canvas){canvas.tabIndex=-1;canvas.focus({preventScroll:true});}}});
 return {dispose};
}
