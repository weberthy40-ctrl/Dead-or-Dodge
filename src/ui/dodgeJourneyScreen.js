import { FOCUS_GOAL_TEXT } from '../training/dodge/focusCoaching.js';
import { readDodgePlacement } from '../progression/dodgePlacement.js';
import { loadPreferences } from '../settings/preferences.js';
import { PREMIUM_FAMILIES } from '../game3d/artDirection.js';
import { element,link } from './elements.js';

export function mountDodgeJourney(screen,{preparation=false}={}){
 const doc=screen.ownerDocument;let storage;try{storage=doc.defaultView.localStorage;}catch{ /* Journey also works without storage. */ }
 const placement=readDodgePlacement(storage),level=placement?.level??1,p=loadPreferences(storage),host=element(doc,'section','rift-journey');
 host.append(element(doc,'p','eyebrow',preparation?'PREPARE SUA EXECUÇÃO':'ESQUIVA 2.0 / PERCURSO RECOMENDADO'),element(doc,'p','lead','Avalie seu ponto de partida, pratique os controles e entre na rota central. Você pode pular qualquer etapa ou escolher outro desafio.'));
 const steps=element(doc,'ol','journey-steps');
 for(const [title,text,path,label]of [
  ['Avaliação',placement?`Ponto de partida salvo: nível ${level}.`:'Cinco amostras adaptativas para sugerir uma dificuldade.','/assessment/dodge?guided=1',placement?'Refazer avaliação':'Avaliar minha Esquiva'],
  ['Preparação','Confira alcance visual, controles, áudio e qualidade.','/prepare/dodge','Preparar treino'],
  ['Treino guiado','Movimento, Flash, dash e leitura de uma área, no seu ritmo.','/learn/dodge?guided=1','Aprender na arena'],
  ['Esquiva Normal',`Três vidas no nível ${level}; resultados e revisão ao terminar.`,`/play/dodge/normal/${level}`,'Entrar no Normal'],
 ]){const item=element(doc,'li','journey-step');item.append(element(doc,'h2','',title),element(doc,'p','muted',text),link(doc,label,path,'button'+(preparation&&title==='Treino guiado'?' primary':'')));steps.append(item);}
 host.append(steps);
 if(preparation){const controls=element(doc,'section','mode-card preparation-controls');controls.append(element(doc,'h2','','Seu Duelista Arcano'),element(doc,'p','muted',`Direito: mover · ${p.stopKey.replace('Key','')}: parar · ${p.flashKey.replace('Key','')}: Flash · ${p.dashKey.replace('Key','')}: dash · Y: câmera livre/travada · Espaço: centralizar.`),element(doc,'p','muted',`Qualidade: ${({leve:'Leve',medio:'Médio',alto:'Alto',ultra:'Ultra'})[p.quality]} · Áudio: ${p.muted?'silenciado':`${p.volume}%`}. Avisos e contornos de colisão permanecem legíveis nos quatro presets.`),link(doc,'Ajustar preferências','/settings','button'));host.append(controls);}
 const families=element(doc,'section','focus-families');families.append(element(doc,'h2','','Treine uma ameaça por vez'),element(doc,'p','muted',`${FOCUS_GOAL_TEXT} Três vidas por exercício. O objetivo não altera patente, avaliação ou histórico oficial.`));
 const grid=element(doc,'div','focus-grid');
 for(const [id,family]of Object.entries(PREMIUM_FAMILIES)){const card=element(doc,'article','mode-card focus-card');card.style.setProperty('--family-color','#'+family.color.toString(16));card.append(element(doc,'span','focus-symbol',({linear:'➤',lance:'◇',hook:'⌁',beam:'═',area:'◎'})[id]),element(doc,'h3','',family.label),element(doc,'p','muted',family.lesson),link(doc,'Treinar esta habilidade',`/focus/dodge/${id}`,'button'));grid.append(card);}
 families.append(grid);host.append(families,link(doc,'Escolher modalidades e níveis livremente','/levels','button'));screen.append(host);
 return {dispose(){host.remove();}};
}
