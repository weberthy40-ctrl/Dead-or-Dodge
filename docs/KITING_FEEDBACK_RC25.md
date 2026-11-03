# Kiting — leitura de combate e orientação — 1.0.0-rc.25

Incremento dedicado a perceber o alvo, entender o ciclo do ataque e escolher o que praticar depois. Clique direto, A + clique e A imediato continuam com a mesma semântica: uma ordem explícita pode produzir um ataque, sem repetição automática ou fila durante a recuperação.

## Alvo e alcance

O alvo selecionado tem um anel fechado dourado, que fica neutro fora do alcance. Um inimigo preparando seu próprio ataque recebe um arco aberto rosado. Seleção e ameaça inimiga não compartilham mais o mesmo sinal. O painel informa por texto se o alvo selecionado está dentro/fora do alcance; sem seleção, mostra quantos inimigos estão no alcance.

O limite exibido por A mantém o mesmo raio configurado e ganha um fundo escuro para leitura. As regras de A de cada perfil são preservadas: em Clique direto, mostra o alcance; em A + clique, prepara a confirmação; em A imediato, executa a ordem no cursor. O painel distingue comando preparado e aproximação até poder atacar. Pausa, perda de foco e cancelamento continuam descartando ordens pendentes conforme as regras existentes.

## Ciclo do ataque

O painel apresenta preparação, disparo confirmado e movimento durante a recuperação. A indicação “Mover” fica disponível desde a confirmação, sem acrescentar espera ao comando. A barra usa a duração da fase atual: preparação, recuperação após o disparo ou cooldown curto de cancelamento. Ela não decide quando o ataque está pronto.

Uma indicação discreta ao redor do jogador acompanha a mesma fase. O Duelista usa o tratamento de silhueta clara da rc.24 no Kiting, com inclinação de preparação e uma resposta corporal apenas quando o evento de disparo é confirmado. A posição, a orientação física, os danos, o alcance, os tempos e a pontuação continuam definidos pelos mesmos sistemas.

Inimigos e jogador respeitam redução de movimento nas animações cosméticas. Os sinais essenciais de seleção, ameaça, alcance e fase não dependem de efeitos opcionais; continuam presentes no Leve. Os marcadores não têm raycast nem alteram a seleção lógica ou hitboxes.

## Por que um ataque foi cancelado

A simulação passa a publicar um detalhe transitório no evento `kiting:cancelled`: `reason: command` para movimento/parada/Flash antes da confirmação, ou `reason: range` quando o alvo sai do alcance antes do disparo. Os textos anteriores de `lastAction` são preservados, mas não são usados para inferir a causa.

O snapshot da prática inclui apenas o último cancelamento (`lastCancellation`), para indicar a fase correta. Um observador da tela conta as causas por tentativa, com deduplicação de sequência e descarte das assinaturas ao reiniciar/sair. A memória do observador é constante; não guarda um histórico ilimitado de eventos.

Esses campos não são acrescentados a `createKitingAttempt`, registros oficiais, scores ou backups. Não há migração de banco, alteração da versão de métricas/pontuação nem regravação de tentativas antigas. Quando uma causa não está disponível, a orientação a mantém como “Sem detalhe”, sem inventar uma explicação.

## Resultado e próxima prática

A confirmação de salvamento permanece visível. O resultado prioriza quatro medidas — disparos, cancelamentos, ciclos com movimento e dano recebido — e uma sugestão baseada nos dados observados. As métricas completas, fórmula e nota continuam disponíveis em “Ver métricas e pontuação”.

A orientação pode sugerir priorizar a confirmação, acompanhar o alcance, usar a recuperação para se mover, manter espaço ou reunir uma amostra maior. Os limiares de orientação são provisórios: 20% de cancelamentos entre ataques resolvidos ou menos de 60% de ciclos com movimento, com pelo menos três oportunidades para a orientação de ritmo. Eles não mudam nota, patente ou dificuldade. Menos de seis acertos (mínimo configurado) ou dez segundos ativos é identificado como amostra curta.

“Jogar novamente” permite repetir a condição atual. Treinos oficiais oferecem também a prática técnica sem nota no nível 1, usando a preferência atual de comandos. Não há estimativa de elo, causa de derrota inferida ou progressão automática a partir desse relatório. Os detalhes das causas são descartados ao sair da tela.

## Validação e limites

Testes cobrem causas reais, tempos da barra, pausa, comandos preparados/em aproximação, orientação, ausência dos detalhes transitórios nos registros, descarte das assinaturas e recursos 3D. O esqueleto real também é verificado com postura de ataque, pausa e redução de movimento.

A suíte de comandos usa teclado/mouse nativos nos três perfis e verifica preparação, indicação imediata de movimento após o disparo, cancelamento por comando e retorno à prontidão. Histórico, filtros e backup antigo continuam exercitados. As capturas usam relógio controlado para estabilizar as fronteiras dos cooldowns; não são medição de latência física. Resultados executados estão em [VALIDATION.md](VALIDATION.md).
