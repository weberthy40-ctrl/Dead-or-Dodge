/** RIFT LAB art tokens. Rendering never supplies collision or timing constants. */
export const RIFT_PALETTE=Object.freeze({graphite:0x192231,stone:0x58667d,silver:0xb7c8e2,blue:0x63ccff,violet:0xa38bfa,ink:0x101421});
export const PREMIUM_FAMILIES=Object.freeze({
 linear:Object.freeze({variant:'arcane_bolt',label:'Projétil linear',lesson:'Defina a direção do disparo e saia pela lateral.',color:0x65d6ff}),
 lance:Object.freeze({variant:'heavy_lance',label:'Lança arcana',lesson:'Leia a preparação e antecipe sua saída lateral.',color:0xc5b3ff}),
 hook:Object.freeze({variant:'hook_linear',label:'Gancho rúnico',lesson:'Use passos curtos para sair da linha estreita do gancho.',color:0x8babff}),
 beam:Object.freeze({variant:'sun_beam',label:'Feixe arcano',lesson:'Saia do corredor anunciado antes da ativação.',color:0xb4e7ff}),
 area:Object.freeze({variant:'artillery',label:'Ruptura astral',lesson:'Escolha a borda mais próxima e deixe a área anunciada.',color:0xb79aff}),
});
export const premiumFamilyForVariant=variant=>Object.entries(PREMIUM_FAMILIES).find(([,family])=>family.variant===variant)?.[0]??null;
