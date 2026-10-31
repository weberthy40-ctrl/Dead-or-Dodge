# Kiting — comandos e contexto de comparação — rc.18

A arena oferece três maneiras de emitir ataques antes de iniciar a prática ou o treino oficial:

| Opção | Ação | Sem inimigo elegível no alcance |
| --- | --- | --- |
| Clique direto (padrão anterior) | Esquerdo solicita um ataque; A segurado mostra alcance | O clique não inicia aproximação |
| A + clique | A prepara a ordem e mostra alcance; esquerdo na arena confirma | Caminha ao ponto indicado até poder executar um ataque |
| A imediato | A solicita a ordem na posição conhecida do cursor na arena | Caminha ao ponto indicado até poder executar um ataque |

Cada ordem pode produzir **um ataque**. Não há ataque contínuo ao segurar a tecla nem fila durante preparação/recuperação. A seleção continua escolhendo o inimigo elegível no alcance mais próximo do cursor. O alvo fica fixo durante a preparação. A aproximação caminha ao ponto indicado; não persegue automaticamente um alvo que saiu dali. Se chegar ao ponto sem inimigo elegível, termina sem disparar.

Direito substitui a aproximação por movimento normal. Parada, Flash aceito, pausa, perda de foco e descarte da arena removem ordens pendentes. Sem uma posição conhecida do cursor dentro da arena, A imediato não emite ordem. Repetição de tecla, atalhos com Ctrl/Alt/Meta e foco em campos, links, botões ou diálogos não iniciam ataques.

A preferência pode ser escolhida também em Configurações. A escolha feita na preparação é salva quando o armazenamento está disponível e permanece fixa durante a rodada, inclusive na prática. A arena recebe foco ao iniciar. O texto das teclas de parada e Flash reflete as preferências do jogador. A avaliação guiada existente permanece no padrão Clique direto.

A indicação de fase distingue preparação (mover cancela), disparo confirmado (janela para mover) e ataque pronto. A barra usa os mesmos tempos já presentes na simulação. Velocidades, dano, alcance, cancelamento, cooldown, dificuldade e fórmula de nota não mudam.

## Dados e comparação

- `kitingControls` é um campo opcional das preferências v1; ausente significa `direct`.
- `controlProfile` acompanha novas métricas e pontuações (`direct`, `attack-click` ou `quick-attack`). A validação exige concordância entre ambos e rejeita valores desconhecidos.
- Registros antigos sem o campo são interpretados como `direct`, sem regravar IDs, datas, métricas ou notas. A versão 2 do IndexedDB continua a mesma.
- Histórico, recordes e evolução permitem escolher os comandos. O filtro ocorre antes da paginação e do limite do gráfico; a estatística usa todas as tentativas daquele filtro. Recordes têm chave por variante, nível e comandos.
- Cada amostra de três sessões da estimativa de nível tem a mesma calibração, dificuldade e comandos. Em cada nível da referência, prefere-se a amostra completa do comando usado mais recentemente; até completá-la, uma amostra anterior completa permanece elegível. As três notas recentes continuam exigindo mediana de pelo menos 60.
- Conquistas e patentes gerais seguem agregando sessões oficiais válidas. A mudança de comandos não cria uma modalidade adicional nem muda a fórmula de patente.
- Exportação e mesclagem incluem os campos novos. Para ler seu significado, use rc.18 ou superior; backups anteriores continuam aceitos.

Compare o mesmo exercício, nível, calibração e comandos. Essas opções são adaptações do treinador; não comprovam equivalência ao comportamento do client ou ao patch atual do LoL.

## Validação

O roteiro automatizado cobre armar/confirmar, cursor desconhecido, ausência de repetição e fila, aproximação para um ataque, cancelamento e pausa, foco/modificadores, preferência, compatibilidade de registros e separação de evidências. A suíte `browser-kiting-controls` usa teclado e mouse nativos no Chromium, salva uma derrota real e verifica filtros, registro anterior sem metadados e backup em IndexedDB nativo. Resultados executados e limites estão em [VALIDATION.md](VALIDATION.md); o roteiro de hardware e tela cheia está em [QA.md](QA.md).
