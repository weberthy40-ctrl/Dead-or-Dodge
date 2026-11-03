import { MODALITIES } from './routes.js';

/** Curated entry points reuse the existing training contracts; no new scoring. */
export function trainingPlan(modality, { level = 1, dodgeLevel = 1 } = {}) {
  if (modality === 'dodge') return [
    { title: 'Prepare os controles', detail: 'Confira teclas, câmera e qualidade antes de entrar na rota.', path: '/prepare/dodge', action: 'Preparar', context: 'NO SEU RITMO' },
    { title: 'Leia uma ameaça', detail: 'Pratique o deslocamento lateral contra o projétil linear.', path: '/focus/dodge/linear', action: 'Praticar', context: 'ATÉ 30 S · SEM NOTA' },
    { title: 'Coloque em jogo', detail: `Normal, nível ${dodgeLevel}. Termine e consulte os impactos na revisão.`, path: `/play/dodge/normal/${dodgeLevel}`, action: 'Entrar no Normal', context: '3 VIDAS · TREINO OFICIAL' },
  ];
  const goals = {
    precision: ['Ajuste o clique', 'Explore alvos e sequências sem pressão de pontuação.', 'Busque precisão antes de acelerar. Confira erros e acertos no resultado.'],
    kiting: ['Encontre seu ritmo', 'Experimente os três comandos de ataque e observe as fases do disparo.', 'Alterne ataque e movimento. Confira dano, abates e cancelamentos.'],
    reflex: ['Reconheça os sinais', 'Pratique a sequência de teclado e mouse, incluindo quando não responder.', 'Responda com controle. Confira acertos, antecipações e omissões.'],
  };
  const [title, practice, measure] = goals[modality];
  return [
    { title, detail: practice, path: `/practice/${modality}`, action: 'Praticar sem nota', context: 'PRÁTICA TÉCNICA' },
    { title: 'Registre uma rodada', detail: measure, path: `/timed/${modality}/${level}`, action: `Treinar no nível ${level}`, context: 'ATÉ 60 S · TREINO OFICIAL' },
    { title: 'Revise a execução', detail: 'Compare tentativas do mesmo exercício e nível antes de mudar a dificuldade.', path: `/evolution/${modality}`, action: 'Ver minha evolução', context: 'SEUS DADOS LOCAIS' },
  ];
}

export function resumeTraining(record) {
  if (!record || !MODALITIES.some(mode => mode.id === record.modality)) return null;
  const max = record.modality === 'dodge' ? 20 : 10;
  if (!Number.isInteger(record.level) || record.level < 1 || record.level > max || !Number.isFinite(Date.parse(record.completedAt))) return null;
  if (record.modality === 'dodge' && !['normal', 'survival'].includes(record.mode)) return null;
  return record.modality === 'dodge'
    ? `/play/dodge/${record.mode}/${record.level}`
    : `/train/${record.modality}/${record.level}`;
}
