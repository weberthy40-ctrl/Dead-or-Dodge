# RIFT LAB — impactos e objetivos de prática — rc.20

A rc.20 melhora a leitura das habilidades e transforma os exercícios focados em rodadas com um objetivo verificável. A direção e o protótipo da [rc.19](RIFT_VERTICAL_RC19.md) continuam preservados.

## Confirmação visual de impacto

Feixes, áreas e projéteis podem ser removidos pela simulação no mesmo passo em que colidem. Agora um observador somente de apresentação reconstrói um sinal breve a partir da trajetória e do impacto já confirmados. Não participa da decisão de dano, não emite eventos de combate e não escreve posições, tempos ou colisões.

O sinal permanece por até 0,24 segundos ativos, com limite de oito simultâneos. O feixe conserva a faixa e a direção reais; áreas conservam origem e raio; a gaiola preserva suas duas bordas; projéteis usam o contato da trajetória percorrida. Os sinais ficam abaixo dos avisos ativos na ordem de renderização. Leve mantém uma indicação simples; outros presets podem acrescentar pequenos fragmentos. Redução de movimento mantém o desenho estático. Não há tremor de câmera, loop de animação próprio ou nova área de dano.

As cores dos conjuradores das famílias prioritárias acompanham a paleta dos projéteis. Elos de corrente só são alocados para o gancho, reduzindo objetos invisíveis nas outras famílias.

## Revisão

As capturas em memória incluem os sinais de impacto como metadados opcionais de apresentação. A captura final pode ocorrer entre duas amostras regulares para preservar uma derrota ou conclusão. O buffer continua limitado a até seis segundos e 121 quadros na configuração padrão; o último quadro adicional pode substituir a amostra mais antiga.

Os marcadores de impacto selecionam o primeiro quadro disponível a partir daquele instante. Buscar um momento anterior remove os sinais daquele impacto; buscar novamente os restaura sem recalcular combate. A revisão não retoma a sessão nem injeta entradas. Quadros antigos sem os metadados continuam aceitos.

O painel dos exercícios focados e das séries agora também reconhece seu diálogo quando o conteúdo é anexado após a montagem. Abrir a revisão expande o painel e oculta o relatório, mantendo os controles visíveis; fechar restaura o resultado. A velocidade inicial de reprodução é selecionada corretamente em 0,5×, evitando uma opção vazia que deixava o relógio parado.

## Objetivo dos exercícios focados

Nas cinco famílias, o objetivo inicial é **concluir 30 segundos e evitar pelo menos oito ameaças**. O HUD mostra a contagem; o resultado apresenta as duas condições separadamente e uma orientação para a próxima rodada. Só ameaças qualificadas e efetivamente evitadas entram na contagem existente de esquivas; pendências e contatos durante proteção não viram sucessos.

O objetivo é uma referência de prática, não uma nota oficial ou classificação de habilidade. Só é avaliado para uma rodada técnica válida de `rift-focus-v1`. Uma derrota pode atingir a condição de esquivas e ainda não concluir o objetivo de tempo. Interrupções e métricas contraditórias não recebem um objetivo concluído. Os cinco objetivos foram exercitados com trajetórias simuladas partindo do centro e respeitando a velocidade disponível; isso não substitui calibração com jogadores.

Ao repetir o exercício na mesma tela, o relatório compara tempo ativo, ameaças evitadas e impactos válidos com a rodada anterior. As rotas e a exposição podem variar, por isso a comparação é descritiva e não atribui uma melhora de habilidade. Apenas a última rodada é mantida em memória; sair da prática ou recarregar descarta a referência. Cumprir o objetivo permite repetir ou escolher outra habilidade, sem obrigar avanço.

## Dados e validação

Não há novo registro oficial, campo de backup, preferência ou alteração no IndexedDB. Sinais de impacto, objetivos e comparação ficam em memória. Histórico, patentes, pontuações, controles, dificuldade, avaliação opcional e códigos `dd1` mantêm seus contratos.

Os testes verificam a independência da apresentação em relação à sequência de eventos físicos, limites de recursos, pausa, captura final, busca de revisão, objetivos possíveis com movimento legal e ausência de salvamento oficial. Capturas no Chromium verificam o sinal após um acerto real e a comparação de duas rodadas. Resultados executados e limites ficam em [VALIDATION.md](VALIDATION.md).
