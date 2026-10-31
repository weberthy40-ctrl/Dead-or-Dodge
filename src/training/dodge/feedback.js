import { premiumFamilyForVariant } from '../../game3d/artDirection.js';
import { VARIANTS } from './projectiles.js';
import { readonlySnapshot } from '../snapshot.js';

export const DODGE_ADVICE = Object.freeze({
  hook_linear:'Observe a linha do gancho e use um passo lateral curto para sair dela.',
  arcane_bolt: 'Espere a direção ser definida e dê um passo para o lado; não corra na mesma linha do disparo.',
  heavy_lance: 'Observe a preparação da lança e saia pela lateral da trajetória.',
  needle_burst: 'Faça ajustes laterais curtos e confira a direção de cada disparo da salva.',
  dark_orb: 'Saia da trajetória do orbe; o brilho ao redor dele é apenas visual.',
  sun_beam: 'Durante o aviso, saia pela lateral mais próxima do feixe.',
  artillery: 'Saia do círculo antes do fim do aviso. O centro anunciado não acompanha você.',
  flame_circle: 'Procure a borda mais próxima e deixe todo o círculo antes de ele ativar.',
  cage: 'O centro da gaiola é seguro. Evite atravessar a borda enquanto ela estiver ativa.',
  meteor_rain: 'Saia de cada círculo anunciado e confira o próximo antes de voltar.',
});

/** Describes this attempt only; never infers rank, cause of death or unseen inputs. */
export function buildDodgeFeedback(metrics, counts = {}) {
  const hits = metrics.validHits, dodged = metrics.threatsDodged, resolved = dodged + metrics.threatsHit;
  const elapsed = metrics.elapsedActiveSeconds;
  const sample = resolved >= 8;
  const known = Object.entries(counts ?? {}).filter(([id, n]) => Object.hasOwn(DODGE_ADVICE, id) && Number.isInteger(n) && n > 0);
  known.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const top = known.reduce((total, [, n]) => total + n, 0) <= hits ? known[0] : null;
  let headline, observation, action;
  if (metrics.endReason === 'error') {
    headline = 'Tentativa interrompida';
    observation = 'A arena encontrou um problema. Estes dados não representam um treino concluído.';
    action = 'Volte ao menu e abra a arena novamente.';
  } else if (top) {
    const [variant, count] = top;
    headline = count > 1 ? 'Uma ameaça para trabalhar' : 'Um impacto para revisar';
    observation = `${VARIANTS[variant].label}: ${count} de ${hits} impacto${hits === 1 ? '' : 's'} registrado${hits === 1 ? '' : 's'} nesta tentativa.`;
    action = DODGE_ADVICE[variant];
  } else if (hits) {
    headline = 'Encontre sua próxima saída';
    observation = `${hits} impacto${hits === 1 ? '' : 's'} em ${elapsed.toFixed(1)} segundos ativos.`;
    action = 'Reveja o último impacto e procure uma saída lateral antes de gastar Flash ou dash.';
  } else if (sample) {
    headline = 'Boa leitura nesta tentativa';
    observation = `${dodged} de ${resolved} ameaças resolvidas foram evitadas, sem impactos válidos.`;
    action = 'Repita este nível e confira se consegue manter essa execução em outra sequência.';
  } else {
    headline = 'Ainda é cedo para avaliar';
    observation = `${resolved} ameaça${resolved === 1 ? '' : 's'} resolvida${resolved === 1 ? '' : 's'} nesta tentativa.`;
    action = 'Faça outra tentativa para reunir mais evidências. Ameaças ainda na arena não contam como esquivadas.';
  }
  const practiceFamily=top?(premiumFamilyForVariant(top[0])??(['flame_circle','meteor_rain'].includes(top[0])?'area':['needle_burst','dark_orb'].includes(top[0])?'linear':null)):null;
  return readonlySnapshot({ practiceFamily,headline, observation, action, hits, dodged, resolved, elapsed, sample, rate: sample ? Math.round(dodged / resolved * 100) : null });
}
