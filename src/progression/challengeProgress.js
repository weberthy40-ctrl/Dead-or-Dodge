import { validateChallengeRecord } from '../persistence/challengeRecord.js';
import { parseSeriesCode } from '../training/dodge/series.js';
import { readonlySnapshot } from '../training/snapshot.js';

export function createChallengeProgress(code) {
  const series = parseSeriesCode(code), recent = [];
  return {
    add(record) {
      if (record?.code !== series.code || recent.some(item => item.attemptId === record.attemptId)) return;
      try { validateChallengeRecord(record); } catch { return; }
      recent.push(record);
      recent.sort((a, b) => Date.parse(b.completedAt) - Date.parse(a.completedAt) || b.attemptId.localeCompare(a.attemptId));
      recent.splice(20);
    },
    snapshot: () => readonlySnapshot({ code: series.code, recent }),
  };
}
export async function loadChallengeProgress(repository, code) {
  const progress = createChallengeProgress(code);
  await repository.scanCompletedAttempts({ modality: 'dodge-challenge', onRecord: record => progress.add(record) });
  return progress.snapshot();
}
export function recommendSeriesStep(recent) {
  const latest = recent[0];
  const attempts = recent.filter(item => item.code === latest?.code && item.seriesVersion === latest?.seriesVersion).slice(0, 3);
  if (!latest) return 'Faça uma primeira tentativa e repita o mesmo código para criar uma referência.';
  const resolved = latest.metrics.threatsDodged + latest.metrics.threatsHit;
  if (resolved < 6) return 'Poucas ameaças foram resolvidas. Use a próxima tentativa para observar os avisos e reunir uma amostra maior.';
  if (latest.endReason === 'defeat') return 'Repita o mesmo código e tente alcançar o próximo aviso antes de gastar suas três vidas.';
  if (attempts.length < 3) return 'Complete até três tentativas deste código antes de avaliar sua consistência.';
  return attempts.every(item => item.endReason === 'victory' && item.metrics.threatsDodged + item.metrics.threatsHit >= 6) ? 'Você completou três tentativas recentes. Experimente outra série e mantenha esta como referência.' : 'Repita este código e procure concluir três tentativas com uma execução mais estável.';
}
