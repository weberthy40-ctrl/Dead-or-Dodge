import { GAME_VERSION } from '../app/version.js';
import { parseSeriesCode, SERIES_VERSION } from '../training/dodge/series.js';
import { readonlySnapshot } from '../training/snapshot.js';
import { StorageError, assertRecordData } from './storageError.js';

export function validateChallengeRecord(record) {
  assertRecordData(record);
  let series;
  try { series = parseSeriesCode(record?.code); } catch { throw new StorageError('Código da tentativa inválido.', 'INVALID_RECORD'); }
  const r = record, m = r.metrics;
  if (r.recordSchemaVersion !== 1 || r.modality !== 'dodge-challenge' || r.mode !== 'challenge' || r.code !== series.code || r.seriesVersion !== SERIES_VERSION || r.variant !== series.id || r.level !== series.level || !Number.isFinite(Date.parse(r.completedAt)) || typeof r.attemptId !== 'string' || !r.attemptId.trim() || !m || !m.terminal || m.attemptId !== r.attemptId || m.level !== r.level || m.mode !== r.mode || m.rulesetVersion !== SERIES_VERSION || m.metricsVersion !== 'dodge-metrics-v1' || m.endReason !== r.endReason || !['victory', 'defeat'].includes(r.endReason)) throw new StorageError('Tentativa de série incompatível.', 'INVALID_RECORD');
  const counts = ['attacksEmitted', 'threatsQualified', 'threatsDodged', 'threatsHit', 'validHits', 'contactsIgnored', 'attacksNonThreatening', 'threatsUnresolved'];
  if (counts.some(key => !Number.isInteger(m[key]) || m[key] < 0) || m.validHits !== m.threatsHit || m.validHits > 3 || m.attacksEmitted > 19 || m.attacksEmitted < m.threatsQualified || m.threatsQualified !== m.threatsDodged + m.threatsHit + m.contactsIgnored + m.threatsUnresolved || m.attacksNonThreatening > m.attacksEmitted - m.threatsQualified) throw new StorageError('Contagens de série inválidas.', 'INVALID_RECORD');
  if (!Number.isFinite(m.elapsedActiveSeconds) || m.elapsedActiveSeconds < 0 || m.elapsedActiveSeconds > series.duration || (r.endReason === 'victory' ? m.elapsedActiveSeconds !== series.duration || m.validHits >= 3 : m.validHits !== 3)) throw new StorageError('Resultado de série contraditório.', 'INELIGIBLE');
  const movement = ['totalDistanceMoved', 'activeMovementSeconds', 'stationarySeconds', 'riskDistance'];
  if (movement.some(key => !Number.isFinite(m[key]) || m[key] < 0) || Math.abs(m.activeMovementSeconds + m.stationarySeconds - m.elapsedActiveSeconds) > .001 || !Array.isArray(m.buckets) || m.buckets.length > 120) throw new StorageError('Métricas de série inválidas.', 'INVALID_RECORD');
  for (const bucket of m.buckets) {
    if (!bucket || !['start', 'end', 'distance', 'movementSeconds', 'stationarySeconds', 'qualified', 'dodged', 'hit', 'ignored'].every(key => Number.isFinite(bucket[key]) && bucket[key] >= 0) || bucket.end < bucket.start || ['qualified', 'dodged', 'hit', 'ignored'].some(key => !Number.isInteger(bucket[key]))) throw new StorageError('Janela de série inválida.', 'INVALID_RECORD');
  }
  for (const [key, total] of [['qualified', m.threatsQualified], ['dodged', m.threatsDodged], ['hit', m.validHits], ['ignored', m.contactsIgnored], ['distance', m.totalDistanceMoved], ['movementSeconds', m.activeMovementSeconds], ['stationarySeconds', m.stationarySeconds]]) {
    if (Math.abs(m.buckets.reduce((sum, item) => sum + item[key], 0) - total) > .001) throw new StorageError('Janelas de série divergentes.', 'INVALID_RECORD');
  }
  return r;
}
export function createChallengeRecord(code, metrics, { completedAt = new Date().toISOString() } = {}) {
  const series = parseSeriesCode(code);
  return readonlySnapshot(validateChallengeRecord({ recordSchemaVersion: 1, attemptId: metrics.attemptId, modality: 'dodge-challenge', mode: 'challenge', variant: series.id, level: series.level, code: series.code, seriesVersion: series.version, endReason: metrics.endReason, completedAt, gameVersion: GAME_VERSION, metrics }));
}
