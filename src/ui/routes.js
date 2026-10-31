import { PREMIUM_FAMILIES } from '../game3d/artDirection.js';
import { parseSeriesCode } from '../training/dodge/series.js';
import { MAX_DODGE_LEVEL } from '../training/dodge/constants.js';
export const MODALITIES = Object.freeze([
  Object.freeze({ id: 'dodge', title: 'Esquiva', description: 'Leia ameaças e encontre espaço para reagir.', icon: '→' }),
  Object.freeze({ id: 'precision', title: 'Precisão de clique', description: 'Transforme intenção em cliques precisos.', icon: '◎' }),
  Object.freeze({ id: 'kiting', title: 'Kiting', description: 'Encontre o ritmo entre atacar e movimentar.', icon: '◇' }),
  Object.freeze({ id: 'reflex', title: 'Reflexos e reação', description: 'Responda aos sinais com atenção e controle.', icon: 'ϟ' }),
]);
export const NAVIGATION = Object.freeze([
  ['/', 'Início'], ['/diagnostics', 'Descubra seu nível'], ['/levels', 'Todos os níveis'],
  ['/dpi', 'DPI e sensibilidade'], ['/profile', 'Perfil'], ['/settings', 'Configurações'],
]);
export function resolveRoute(hash = '') {
  if(/^#?\/(assessment|learn)\/dodge\?guided=1$/.test(hash)){const route=resolveRoute(hash.replace('?guided=1',''));return {...route,guided:true};}
  const path = hash.replace(/^#/, '') || '/';
  if (NAVIGATION.some(([route]) => route === path) || ['/journey/dodge','/prepare/dodge','/challenges/dodge','/learn/dodge','/preview','/demo','/history/dodge','/records/dodge','/evolution/dodge','/achievements/dodge','/assessment/dodge','/assessment/kiting','/history/kiting','/records/kiting','/evolution/kiting','/achievements/kiting','/assessment/reflex','/history/reflex','/records/reflex','/evolution/reflex','/achievements/reflex','/practice/reflex','/timed/reflex','/practice/kiting','/timed/kiting','/practice/precision','/timed/precision','/assessment/precision','/history/precision','/records/precision','/evolution/precision','/achievements/precision'].includes(path)) return { path };
  if(path.startsWith('/focus/dodge/')){const family=path.slice('/focus/dodge/'.length);return Object.hasOwn(PREMIUM_FAMILIES,family)?{path,family}:{path:'/404'};}
  if(path.startsWith('/challenge/dodge/')){try{const series=parseSeriesCode(path.slice('/challenge/dodge/'.length));return {path:`/challenge/dodge/${series.code}`,code:series.code};}catch{return {path:'/404'};}}
  if(path==='/train/dodge')return {path,modality:'dodge',level:1};
  if(path==='/play/dodge/normal')return {path,modality:'dodge',mode:'normal',level:null};
  if(/^\/(practice\/dodge|dodge-tech)(\/|$)/.test(path))return {path:'/train/dodge',modality:'dodge',level:1};
  const reflex = /^\/timed\/reflex\/(10|[1-9])$/.exec(path);
  if(reflex)return {path,modality:'reflex',level:Number(reflex[1]),timed:true};
  const kiting = /^\/timed\/kiting\/(10|[1-9])$/.exec(path);
  if(kiting)return {path,modality:'kiting',level:Number(kiting[1]),timed:true};
  const precision = /^\/timed\/precision\/(10|[1-9])$/.exec(path);
  if(precision)return {path,modality:'precision',level:Number(precision[1]),timed:true};
  const play = /^\/play\/dodge\/(normal|survival)\/(\d+)$/.exec(path);
  if(play&&Number(play[2])>=1&&Number(play[2])<=MAX_DODGE_LEVEL)return {path,modality:'dodge',mode:play[1],level:Number(play[2])};
  const dodge=/^\/train\/dodge\/(\d+)$/.exec(path);
  if(dodge&&Number(dodge[1])>=1&&Number(dodge[1])<=MAX_DODGE_LEVEL)return {path,modality:'dodge',level:Number(dodge[1])};
  const match = /^\/train\/([a-z]+)\/(10|[1-9])$/.exec(path);
  if (match && MODALITIES.some(({ id }) => id === match[1])) {
    return { path, modality: match[1], level: Number(match[2]) };
  }
  return { path: '/404' };
}
