export const KITING_CONTROLS=Object.freeze({
 direct:Object.freeze({label:'Clique direto',help:'Esquerdo: atacar um inimigo no alcance, próximo do cursor. Segure A para mostrar o alcance.'}),
 'attack-click':Object.freeze({label:'A + clique',help:'A prepara o comando; esquerdo confirma na arena. Fora do alcance, aproxima até poder atacar uma vez.'}),
 'quick-attack':Object.freeze({label:'A imediato',help:'A executa o comando na posição do cursor na arena. Fora do alcance, aproxima até poder atacar uma vez.'}),
});
/** Records made before input profiles used direct clicks. Never rewrite those records. */
export function kitingControlProfile(value){
 const profile=value??'direct';
 if(!Object.hasOwn(KITING_CONTROLS,profile))throw new TypeError('Comandos de Kiting incompatíveis.');
 return profile;
}
