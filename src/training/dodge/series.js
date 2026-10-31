import { createRandom } from '../../core/random.js';
import { readonlySnapshot } from '../snapshot.js';

export const SERIES_VERSION = 'dodge-series-v1';
export const SERIES_DURATION = 30;
// Pin the physical values for dd1; future official balance changes must not retune these codes.
const SERIES_ABILITIES = Object.freeze({
  arcane_bolt: { shape: 'bolt', speed: 14, radius: .6, windup: 1, ttl: 5, range: 80 },
  heavy_lance: { shape: 'bolt', speed: 12, radius: .7, windup: 1, ttl: 7, range: 80 },
  needle_burst: { shape: 'bolt', speed: 14, radius: .4, windup: 1, ttl: 6, range: 80 },
  dark_orb: { shape: 'bolt', speed: 13.5, radius: .55, windup: 1, ttl: 7, range: 80 },
  artillery: { shape: 'circle', speed: 0, radius: 1.6, windup: 1.4, ttl: .24, range: 0 },
  flame_circle: { shape: 'circle', speed: 0, radius: 2.2, windup: 1.4, ttl: .35, range: 0 },
  meteor_rain: { shape: 'circle', speed: 0, radius: 1.35, windup: 1.4, ttl: .35, range: 0 },
  sun_beam: { shape: 'beam', speed: 0, radius: .8, windup: 1.4, ttl: .22, range: 0, length: 60 },
  cage: { shape: 'ring', speed: 0, radius: 6.4, wallWidth: .2, windup: 1.45, ttl: 1.8, range: 0 },
});
export const SERIES_DEFINITIONS = Object.freeze([
  Object.freeze({ id: 'linha', title: 'Passos laterais', level: 1, description: 'Leia disparos anunciados e encontre uma saída lateral.', seed: 0x1a2b3c4d }),
  Object.freeze({ id: 'areas', title: 'Leitura de áreas', level: 5, description: 'Saia dos círculos antes do impacto, sem perder o próximo aviso.', seed: 0x2b3c4d5e }),
  Object.freeze({ id: 'misto', title: 'Ameaças combinadas', level: 10, description: 'Combine leitura de disparos, áreas, feixes e gaiola.', seed: 0x3c4d5e6f }),
]);
export function seriesCode(id, seed) {
  if (!SERIES_DEFINITIONS.some(item => item.id === id) || !Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) throw new TypeError('Série ou semente inválida.');
  return `dd1-${id}-${seed.toString(16).padStart(8, '0').toUpperCase()}`;
}
export function parseSeriesCode(value) {
  if (typeof value !== 'string') throw new TypeError('Informe o código da série.');
  const match = /^dd1-(linha|areas|misto)-([a-f0-9]{8})$/i.exec(value.trim());
  if (!match) throw new TypeError('Use um código como dd1-linha-1A2B3C4D.');
  const definition = SERIES_DEFINITIONS.find(item => item.id === match[1].toLowerCase());
  const seed = Number.parseInt(match[2], 16);
  return readonlySnapshot({ ...definition, seed, code: seriesCode(definition.id, seed), version: SERIES_VERSION, duration: SERIES_DURATION });
}

/** Fixed world positions and active-time schedule; no player state, frame count or live RNG. */
export function buildSeriesSchedule(code) {
  const series = parseSeriesCode(code), random = createRandom(series.seed), jobs = [];
  const mixed = ['arcane_bolt', 'heavy_lance', 'artillery', 'needle_burst', 'sun_beam', 'flame_circle', 'dark_orb', 'meteor_rain', 'cage'];
  for (let index = 0; index < 19; index++) {
    const variant = series.id === 'linha' ? 'arcane_bolt' : series.id === 'areas' ? (index % 2 ? 'flame_circle' : 'artillery') : mixed[index % mixed.length];
    const base = SERIES_ABILITIES[variant], side = random() < .5 ? -1 : 1;
    const caster = { x: side * 16.8, z: (random() - .5) * 12 };
    const target = index < 3 ? { x: 0, z: 0 } : { x: (Math.floor(random() * 3) - 1) * 6, z: (Math.floor(random() * 5) - 2) * 7 };
    const ground = ['circle', 'ring'].includes(base.shape), dx = target.x - caster.x, dz = target.z - caster.z;
    const config = { ...base, pathHint: 'full', hintDuration: 5 };
    jobs.push({ at: Number((2 + index * 1.4).toFixed(3)), variant, origin: ground ? target : caster, caster, direction: { x: dx, z: dz }, config });
  }
  return readonlySnapshot({ series, jobs });
}
