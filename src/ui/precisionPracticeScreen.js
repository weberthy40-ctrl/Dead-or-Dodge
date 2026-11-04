import { createPrecisionPractice,PRECISION_VARIANTS } from '../training/precision/practice.js';
import { observePrecisionFeedback,describePrecisionGuidance } from '../training/precision/feedback.js';
import { mountTrainingPresentation,formatTrainingClock } from './trainingPresentation.js';
import { mountPrecisionCoaching } from './precisionCoaching.js';
import { mountSaveAttempt } from './saveAttempt.js';
import { calculatePrecisionScore } from '../training/precision/score.js';
import { precisionDifficulty } from '../training/precision/difficulty.js';
import { createPrecisionAttempt } from '../training/precision/attempt.js';
import { createRandom } from '../training/dodge/random.js';
import { createSession } from '../training/session.js';
import { element,link,updateHud } from './elements.js';
export function mountPrecisionPractice({screen,core,timed=false,initialLevel=1,repository,loadPreview=()=>import('../game3d/mountPreview.js')}){
 const document=screen.ownerDocument,window=document.defaultView,host=element(document,'section','precision-practice'),select=element(document,'select'),label=element(document,'label','','Variante ');
 for(const [id,variant]of Object.entries(PRECISION_VARIANTS).filter(([id])=>id==='mixed')){const option=element(document,'option','',variant.label);option.value=id;select.append(option);}select.value='mixed';label.append(select);const controls=element(document,'div','data-controls');controls.append(label);
 const levelSelect=element(document,'select');for(let n=1;n<=10;n++){const option=element(document,'option','',String(n));option.value=String(n);levelSelect.append(option);}levelSelect.value=String(initialLevel);if(timed){const levelLabel=element(document,'label','','Nível ');levelLabel.append(levelSelect);controls.append(levelLabel);}
 const result=element(document,'dialog','precision-result result-metrics');result.hidden=true;result.setAttribute('aria-labelledby','precision-result-title');result.addEventListener('cancel',event=>event.preventDefault());
 const start=element(document,'button','button primary',timed?'Iniciar treino':'Iniciar prática'),restart=element(document,'button','button',timed?'Reiniciar treino':'Reiniciar prática'),pause=element(document,'button','button','Pausar'),back=link(document,'Voltar','/levels','button');for(const b of [start,restart,pause])b.type='button';
 const abandon=element(document,'button','button','Abandonar treino');abandon.type='button';abandon.hidden=!timed;abandon.addEventListener('click',()=>{current?.attempt?.abandon();current?.update();});controls.append(abandon);
 const hud=element(document,'p','muted training-statistics','Acertos: 0 · Erros: 0 · Cliques válidos: 0 · Precisão observada: —'),notice=element(document,'p','status-note','Preparando arena...'),stage=element(document,'div','stage');
 const guidance=element(document,'section','precision-guidance'),instruction=element(document,'strong','precision-instruction'),feedbackText=element(document,'span','precision-feedback');guidance.setAttribute('aria-label','Orientação do grupo');feedbackText.setAttribute('role','status');guidance.append(instruction,feedbackText);
 controls.append(start,restart,pause,back);host.append(controls,hud,guidance,notice,stage,result);screen.append(host);
 let active=true,generation=0,current=null;
 function clean(){if(result.open){if(typeof result.close==='function')result.close();else result.removeAttribute('open');}generation++;current?.presentation?.dispose();current?.feedback?.dispose();current?.preview?.dispose();current?.attempt?.dispose();current?.exercise.dispose();current?.session.dispose();current=null;}
 function setup(autoStart=false){
   clean();const token=generation;const chosenLevel=Number(levelSelect.value),config=precisionDifficulty(timed?chosenLevel:4,select.value);
   result.hidden=true;result.replaceChildren();select.disabled=levelSelect.disabled=false;
   const session=createSession({countdown:timed?3:0,timeLimit:timed?60:null,events:core.events,metadata:{origin:timed?'precision-official':'precision-practice',level:timed?chosenLevel:null,variant:select.value}});
   let movement;const exercise=createPrecisionPractice({...config,events:core.events,attemptId:session.snapshot().id,clock:timed?()=>session.snapshot().elapsed:undefined,variant:select.value,rng:createRandom(window.crypto.getRandomValues(new Uint32Array(1))[0]),playerPosition:()=>movement?.snapshot().position??{x:0,z:0}});
   const attempt=timed?createPrecisionAttempt({session,practice:exercise,level:chosenLevel,variant:select.value}):null;let summarized=false;
   const feedback=observePrecisionFeedback({events:core.events,attemptId:session.snapshot().id,activeTime:()=>session.snapshot().elapsed});
   current={session,exercise,attempt,feedback};start.disabled=restart.disabled=pause.disabled=true;abandon.disabled=true;notice.textContent='Preparando arena...';
   current.presentation=mountTrainingPresentation({host,stage,controls,session,events:core.events,startButton:start,pauseButton:pause,context:{title:timed?`Precisão · Nível ${chosenLevel}`:'Precisão · Prática técnica',objective:'Conclua todos os alvos do grupo. Nas sequências, siga o próximo número.',conditions:timed?'60 segundos ativos · nota e histórico local.':'Sem limite de tempo · ajustes do nível 4 · sem nota ou histórico.',commands:'Clique esquerdo acerta · ESC pausa. As marcas ficam dentro da área válida da esfera.'}});
   function update(){if(!active||token!==generation)return;const s=exercise.snapshot(),phase=session.snapshot().state;
     updateHud(hud,`${formatTrainingClock(session.snapshot(),{duration:timed?60:null})}   •   ${s.priority&&s.targets.length?"ORDEM: "+s.targets[0].order+" → ":"LIVRE · "}${s.pattern==='single-moving'?'Órbitas':s.pattern==='multi-moving'?'Zigue-zague':s.pattern==='multi-static'?'Tamanhos variados':'Alvos fixos'}   •   GRUPO ${s.groupsCompleted+1} · ${s.groupRemaining}/${s.groupTotal} ALVOS RESTANTES   •   ${s.hits} ACERTOS   •   ${s.misses} ERROS (${s.orderErrors} DE ORDEM)   •   ${s.expired} ATRASADOS   •   ${s.accuracy===null?'—':(s.accuracy*100).toFixed(0)+'%'}`);
     const guide=describePrecisionGuidance(s,{sessionState:phase,feedback:feedback.snapshot()});guidance.dataset.mode=guide.mode;guidance.dataset.next=guide.nextOrder??'';if(instruction.textContent!==guide.instruction)instruction.textContent=guide.instruction;if(feedbackText.textContent!==guide.message)feedbackText.textContent=guide.message;

     if(s.fallback)notice.textContent='Espaço limitado: quantidade ou movimento dos alvos reduzidos para manter posições seguras. Ajuste a câmera e reinicie se necessário.';
     const completed=attempt?.evaluate();
     if(completed&&!summarized){summarized=true;result.hidden=false;pause.disabled=true;abandon.disabled=true;select.disabled=levelSelect.disabled=false;
       const title=element(document,'h2','result-title',completed.endReason==='completed'?'Treino concluído':'Treino abandonado');title.id='precision-result-title';const content=element(document,'div','result-content'),actions=element(document,'div','result-actions'),save=element(document,'div','precision-save-status'),details=element(document,'details','precision-evidence');details.append(element(document,'summary','','Ver métricas e pontuação'),element(document,'p','muted',`Nível ${completed.level} · ${PRECISION_VARIANTS[completed.variant].label} · ${completed.elapsedActiveSeconds.toFixed(1)} s · ${completed.hits} acertos · ${completed.misses} erros · ${completed.clicksEligible} cliques válidos · ${completed.groupsCompleted} grupos concluídos`));result.append(title,content,actions);content.append(element(document,'p','precision-result-context',`Nível ${completed.level} · ${PRECISION_VARIANTS[completed.variant].label} · ${completed.elapsedActiveSeconds.toFixed(1)} s ativos`),save);mountPrecisionCoaching(content,completed);
       if(completed.endReason==='completed'){
         const score=calculatePrecisionScore(completed);
         details.append(element(document,'h2','',score.status==='scored'?`Pontuação desta tentativa: ${score.score}/100`:'Pontuação indisponível nesta tentativa'));
         if(score.status==='scored')mountSaveAttempt({container:save,repository,metrics:completed,score,core,isActive:()=>active&&token===generation});
         for(const c of score.components)details.append(element(document,'p','muted',`${c.name}: ${c.contribution.toFixed(1)} / ${c.weight}`));
         if(score.smallSample)details.append(element(document,'p','status-note','Poucos acertos: interprete a nota com cautela. A precisão isolada não mede produtividade.'));
         details.append(element(document,'p','status-note','Referências de produtividade provisórias; compare apenas tentativas da mesma variante e nível.'));
       }
       content.append(details);const replay=element(document,'button','button','Jogar novamente');replay.type='button';replay.addEventListener('click',()=>setup(true));actions.append(replay,link(document,'Voltar ao menu','/','button'));if(typeof result.showModal==='function')result.showModal();else result.setAttribute('open','');replay.focus();
     }
     pause.textContent=phase==='paused'?'Retomar':'Pausar';
   }
   current.update=update;
   const onError=error=>{if(!active||token!==generation)return;core.errors.report(error,{source:'precision.practice'});clean();notice.textContent='Não foi possível iniciar a prática. Volte ao menu ou tente reiniciar.';restart.disabled=false;};
   Promise.resolve().then(loadPreview).then(({mountPreview})=>{
     if(!active||token!==generation)return;const preview=mountPreview(stage,{events:core.events,session,exercise,onTick:update,onError});
     if(!active||token!==generation){preview.dispose();return;}current.preview=preview;movement=preview.movement;
     start.disabled=false;restart.disabled=false;notice.textContent=timed?`Complete o grupo para mudar. Grupos numerados exigem ordem; o próximo fica verde e recebe uma marca interna. O símbolo ! indica atraso, sem impedir o acerto. Evite atrasos acima de ${config.maxLifetime.toFixed(2)} s; atrasos são contados, mas os alvos ficam até você acertar. Nível ${chosenLevel}: ${config.speed.toFixed(1)} u/s.`: 'Prática mista sem nota ou histórico. Acerte todo o grupo para mudar entre alvos parados, móveis e grupos. Esquerdo: acertar; ESC: pausar.';
     if(autoStart)begin();else update();
   }).catch(onError);
 }
 function focusArena(){const canvas=stage.querySelector('canvas');if(canvas){canvas.tabIndex=-1;canvas.focus({preventScroll:true});}}
 function begin(){if(!current)return;if(current.exercise.start()){current.session.start();start.disabled=true;pause.disabled=false;if(timed){select.disabled=levelSelect.disabled=true;abandon.disabled=false;}focusArena();}else if(current.exercise.snapshot().targets.length===0)notice.textContent='Não há posição visível segura para um alvo. Ajuste a câmera e reinicie.';}
 start.addEventListener('click',begin);restart.addEventListener('click',()=>setup(true));pause.addEventListener('click',()=>{if(!current)return;if(current.session.snapshot().state==='paused')current.session.resume();else current.session.pause();focusArena();});
 select.addEventListener('change',()=>setup());levelSelect.addEventListener('change',()=>setup());
 setup();return {dispose(){if(!active)return;active=false;clean();host.remove();}};
}
