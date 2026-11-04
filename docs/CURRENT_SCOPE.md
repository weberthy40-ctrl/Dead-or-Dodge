# Escopo atual — 1.0.0-rc.28

A [rc.28](TRAINING_FLOW_RC28.md) padroniza preparação, estado e pausa nos treinos principais das quatro modalidades. Reutiliza sessões e botões, mantém as opções antes de iniciar, devolve foco ao jogo na retomada e deixa explícito que sair abandona a rodada. Práticas sem limite exibem tempo ativo decorrido. Regras, controles ativos, dificuldade, pontuação e dados são preservados.

A [rc.27](REFLEX_FEEDBACK_RC27.md) refina Reflexos: comando e lado do mouse destacados, retorno dos seis resultados e relatório com contadores separados, tempos válidos e orientação de prática. A espera permanece imprevisível; exercícios, relógios, avaliação guiada, pontuação e dados oficiais são preservados.

A [rc.26](PRECISION_FEEDBACK_RC26.md) melhora a leitura da Precisão: marca interna do próximo alvo, símbolo persistente de atraso, orientação de sequência e confirmação transitória do clique. O resultado separa erros de ordem dos demais cliques errados e sugere a próxima prática. Preserva hitboxes, dificuldade, prazos, pontuação e registros oficiais.

A [rc.25](KITING_FEEDBACK_RC25.md) refina alvo, alcance e ciclo de ataque do Kiting e acrescenta orientação ao resultado. Os cancelamentos recebem causas transitórias observadas; controles, regras físicas, pontuação e registros oficiais continuam preservados.

A [rc.24](DUELIST_READABILITY_RC24.md) melhora a leitura do Duelista e do terreno na Esquiva, acrescenta orientação no anel de seleção e mistura corrida/parada sem reiniciar os clipes. O tratamento é cosmético e preserva os contratos físicos e de dados.

A [rc.23](TRAINING_HUB_RC23.md) acrescenta a central de treino à página inicial: quatro focos com percursos opcionais e retomada no nível do último treino oficial local. Preserva regras, pontuação, dados e exercícios existentes. A direção comercial e a sequência proposta de melhorias estão em [PRODUCT_EVOLUTION.md](PRODUCT_EVOLUTION.md).

Esta é a referência das regras atuais. A [rc.22](SHARING_ALERTS_RC22.md) melhora o compartilhamento local dos relatórios e os indicadores de preparação na borda da câmera. A [rc.21](QUALITY_RC21.md) acrescenta verificação local de fluidez, sinais de preparação distintos, movimento cosmético do Duelista e relatos opcionais de jogadores. A [rc.20](IMPACTS_COACHING_RC20.md) acrescenta confirmação visual de impactos, captura final na revisão e objetivos de prática com comparação em memória. A direção vigente é [RIFT LAB](RIFT_LAB_VISION.md); a [rc.19](RIFT_VERTICAL_RC19.md) integra o protótipo vertical de Esquiva, com jornada opcional e acesso livre ao Normal. Documentos de blocos e revisões anteriores são históricos; não substituem este escopo nem o [QA atual](QA.md). A [rc.18](KITING_CONTROLS_RC18.md) acrescenta controles e contexto de comparação ao Kiting. A [rc.17](DODGE_SERIES_RC17.md) acrescenta séries reproduzíveis ao aprendizado e à análise da [rc.16](DODGE_EXPERIENCE_RC16.md), preservando as regras de dificuldade da rc.14 e as correções da [rc.15](FOUNDATION_RC15.md).

O RIFT LAB é um treinador web em português para **computador, teclado e mouse**. Menus podem se adaptar a telas estreitas, mas gameplay mobile não faz parte do suporte. A aplicação é estática, sem instalação para jogar no site publicado.

## Modalidades

- **Esquiva:** 20 níveis, nove famílias de habilidades, movimento por clique direito, Flash, dash e parada. Normal: três vidas, tempo ilimitado, escolha livre entre os 20 níveis e percurso recomendado com avaliação opcional e avanço por desempenho. Sobrevivência: uma vida, tempo ilimitado e escolha livre entre os 20 níveis. Preparação parada e início manual; câmera ampla antes do início e próxima durante a tentativa. O resultado oferece revisão dos últimos seis segundos, somente em memória.
- **Precisão:** dez níveis, desafio misto com grupos de alvos fixos e móveis e sequências ocasionais por prioridade. O grupo muda somente após todos os alvos serem acertados. Cliques errados, ordem e atrasos são medidos. Treino oficial dura 60 segundos ativos.
- **Kiting:** dez níveis, combate em ondas, perseguidores e atiradores, vida, dano, abates e reposição. Comandos selecionáveis antes da rodada: Clique direto (esquerdo ataca, A mostra alcance), A + clique (A prepara, esquerdo confirma) e A imediato (A no cursor). Cada ordem executa um ataque contra um inimigo elegível no alcance, próximo do cursor. Nos modos com A, sem inimigo elegível o personagem caminha ao ponto indicado até poder atacar uma vez. Direito move e cancela a aproximação; direito, parada e Flash podem cancelar a preparação. Tempos de ataque e velocidades variam com o nível. Treino oficial dura até 60 segundos ativos ou a derrota.
- **Reflexos:** dez níveis, desafio integrado Q/W/E/R, Espaço, F/J e mouse. Verde: esquerdo; azul: direito; vermelho: não responder. Texto e símbolos acompanham as cores. Treino oficial dura 60 segundos ativos; prática técnica tem 22 sinais. Variantes antigas continuam legíveis no histórico.

Pausa e perda de foco não contam como tempo ativo; o retorno requer retomada explícita. Abandonar não gera conclusão oficial. Encerrar e analisar na Esquiva pode salvar uma tentativa com amostra válida.

## Avaliação, progressão e dados

Esquiva: cinco etapas adaptativas de até 30 segundos, três vidas e início manual em cada etapa. Começa no nível 5 e recomenda a maior dificuldade demonstrada, com pelo menos 24 segundos sobrevividos, seis ameaças resolvidas e 80% de esquiva. Sem domínio demonstrado, o nível 1 é um ponto de partida provisório. As demais avaliações têm três etapas de 20 segundos; seus resultados ficam em memória. Diagnósticos não geram pontos oficiais.

A classificação pessoal usa até 20 tentativas recentes por modalidade, com peso maior para as recentes. A escala vai de 0 a 10.000 pontos; menos de cinco tentativas é provisório. A média geral explicita cobertura e permanece provisória se faltar alguma modalidade. **Patente interna não equivale ao elo do LoL ou a certificação profissional.**

Na rc.15, `trainer-rating-v2` corrige o redutor indevido de Reflexos integrado. Tanto o integrado quanto o misto antigo podem alcançar 10.000 pontos; exercícios auxiliares mantêm fator 0,7. O perfil e os pontos exibidos ao consultar tentativas usam o cálculo corrigido. Notas 0–100, métricas, IDs, datas, conquistas e registros dos backups permanecem intactos. Não há migração destrutiva nem alteração do banco para aplicar essa correção.

Histórico e conquistas usam IndexedDB local; preferências e avaliação salva de Esquiva usam localStorage. Backups fazem mesclagem por ID e preservam conflitos. Trocar de origem, porta, perfil ou navegador cria outro contexto de dados. Não há contas, backend, sincronização, API Riot ou ranking online.

## Aprendizado e análise de Esquiva

O menu oferece **Aprender a esquivar**, um tutorial opcional: caminhar, usar o Flash configurado, usar o dash configurado e sair de uma área anunciada. O tutorial usa o movimento e a colisão reais, permite pausa e repetição após impacto e não tem acesso a pontuação, repositório de tentativas ou avaliação salva. No percurso guiado, leva ao Normal sugerido; a avaliação e o tutorial são opcionais.

A arena de Esquiva tem botão de câmera livre/travada, equivalente a Y; Espaço continua centralizando sem alterar o modo. Enquadramento, velocidade, cooldowns, hitboxes, habilidades e curva de dificuldade oficiais permanecem iguais.

O resultado mostra tempo ativo, ameaças evitadas/resolvidas e impactos válidos, além de uma orientação baseada nos impactos observados. Com menos de oito ameaças resolvidas, a amostra é explicitamente curta. A orientação não infere elo, causa de morte ou ações não registradas. Detalhes e pontuação podem ser expandidos; confirmação de salvamento permanece visível.

A revisão começa perto do último impacto disponível nos seis segundos em memória. Cada marcador numerado permite ir àquele instante; slider, câmera da revisão e reprodução não alteram a sessão concluída.

## Séries de Esquiva

A opção **Repetir uma sequência** abre três temas: Passos laterais, Leitura de áreas e Ameaças combinadas. Cada série tem três vidas e até 30 segundos ativos. Não exige avaliação anterior. O código `dd1-<tema>-<8 dígitos hexadecimais>` identifica tema, versão e semente; são 19 lançamentos predefinidos entre 2 e 27,2 segundos ativos, com posições, direções e avisos fixos. A sequência não depende da posição do jogador e não usa o diretor adaptativo de Normal/Sobrevivência.

As respostas do jogador, contatos, duração até derrota e exposição às ameaças podem variar. Os horários dos lançamentos não tornam a latência do navegador ou os resultados de colisão iguais entre computadores. Compare usando o mesmo equipamento, controles e versão do aplicativo.

As últimas 20 tentativas de cada código aparecem na comparação, com tempo, impactos e ameaças evitadas/resolvidas. A orientação sugere repetir ou variar, com ressalva quando a exposição é pequena. O menu permite retomar cinco códigos recentes, abrir um código informado ou criar outro. Não há placar entre pessoas nem equivalência competitiva.

Tentativas concluídas ou encerradas por derrota são salvas como `dodge-challenge`, fora das quatro modalidades que compõem patentes e dos recordes de Normal/Sobrevivência. Abandono ou erro não registra resultado. As séries usam o IndexedDB existente e entram no backup por mesclagem, sem mudar o schema do banco ou sobrescrever treinos anteriores. Backups antigos continuam aceitos; backups contendo séries precisam de rc.17 ou superior.

## Comandos e comparação de Kiting

A escolha fica salva nas preferências e é congelada durante a rodada. Repetição automática de tecla e comandos emitidos durante a recuperação não enfileiram ataques. Sem cursor conhecido dentro da arena, A imediato não emite ordem. Pausa, perda de foco e saída descartam ordens de aproximação e confirmação pendentes. A indicação das fases explica quando mover cancela a preparação e quando o disparo já ocorreu. As avaliações guiadas existentes continuam usando Clique direto.

Novas métricas e pontuações de Kiting registram `controlProfile`; registros antigos sem o campo são interpretados como Clique direto, sem regravação. Histórico, recordes e evolução têm filtro de comandos; recordes e amostras de três sessões da estimativa de nível são separados por comandos. Em cada nível/calibração, a amostra completa do comando usado mais recentemente é preferida; uma amostra anterior continua válida até haver três sessões do novo comando. Patentes gerais continuam agregando sessões oficiais, usando a mesma fórmula e tempos físicos. Não há equivalência declarada com os comandos ou o patch atual do LoL.

## Controles, qualidade e limites

Controles completos estão no README. Os presets Leve/Médio/Alto/Ultra afetam renderização, não dificuldade. Contraste, texto ampliado, redução de movimento e áudio opcional já existem. DPI é uma ferramenta auxiliar: depende de distância física medida e suporte a entrada bruta; não configura o mouse nem reproduz a sensibilidade do LoL.

Arena, habilidades, velocidades e patentes são adaptações próprias. As referências históricas não comprovam equivalência ao patch atual do LoL. Modelos KayKit têm origem e licenças CC0 incluídas; demais recursos estão documentados em `public/assets`.

Windows/Chrome/Edge, tela cheia interativa, latência percebida, desempenho em hardware real e calibração com jogadores continuam exigindo validação manual. Evidências executadas ficam em [VALIDATION.md](VALIDATION.md), separadas de requisitos ainda pendentes.

## Protótipo vertical RIFT LAB

Identidade grafite, azul, prata e violeta; Duelista Arcano com base animada KayKit CC0 adaptada, runas e espada estética; arquitetura original fora da área jogável, rota de pedra e vegetação. Efeitos prioritários de projétil, lança, gancho, feixe e área mantêm os contornos essenciais em todos os presets. Leve/Médio/Alto/Ultra afetam renderização e ornamentos, sem alterar hitboxes, controles, tempo ou nota.

A entrada oferece `/journey/dodge`, com avaliação → preparação → tutorial → Normal → relatório e revisão. `/prepare/dodge` mostra teclas e preferências e oferece cinco treinos focados. A jornada pode ser pulada em qualquer etapa. `/play/dodge/normal/N` respeita o nível pedido; a URL sem N usa a recomendação ou nível 1. Escolha livre não regrava a avaliação. O avanço confirmado só vale no nível da recomendação e mantém os critérios anteriores.

Os cinco exercícios `/focus/dodge/{linear,lance,hook,beam,area}` usam três vidas e até 30 segundos ativos, com métricas, orientação e revisão em memória. Não acessam o salvamento oficial, não concedem patente e não escrevem avaliação. O gancho está disponível nesse recorte focado; pesos, dificuldade e famílias do diretor oficial e as sequências `dd1` permanecem preservados.

Sinais sonoros originais de preparação, impacto e mobilidade usam o AudioContext existente, com no máximo quatro vozes e preparações espaçadas em pelo menos 350 ms. A pressão muda a altura do sinal, sem ampliar o volume geral; mute e volume continuam disponíveis. Não há música contínua, serviços pagos, backend ou mudanças no schema de dados.

## Impactos e objetivos de prática

Um observador de apresentação cria até oito sinais visuais de impactos confirmados, por até 0,24 segundos ativos. A simulação continua removendo as ameaças e decidindo dano nos mesmos passos; o sinal não tem colisão. Os contornos essenciais aparecem no Leve, e a redução de movimento mantém a indicação estática. A revisão guarda os sinais em seus quadros, inclui o instante final entre amostras quando necessário e abre o primeiro quadro a partir de um marcador. Buscar a revisão nunca altera a sessão.

Os exercícios focados passam a mostrar o objetivo provisório de concluir 30 segundos e evitar oito ameaças. As condições são separadas e não geram nota, patente ou avanço oficial. A repetição na mesma tela compara tempo, esquivas e impactos com a última rodada, sem inferir melhora de habilidade ou igualdade de exposição. Sair ou recarregar descarta a comparação. Não há campos novos em registros oficiais, preferências, banco ou backups.

## Fluidez e calibração — rc.21

`/check/dodge` executa 24 lançamentos fixos das cinco famílias em 32 segundos de simulação: dois de aquecimento e 30 de observação. Mede cadência real dos quadros do loop da arena, p95, intervalos acima de 50 ms e carregamento. Pausa é excluída; travamentos ativos são preservados. Não mede latência física, não cria tentativa oficial e não certifica hardware. Mudança de dimensões durante a rodada, inclusive na pausa, é sinalizada.

Quatro presets podem ser comparados sem escrever preferências. Até oito verificações ficam em memória, com resolução e contexto. Exportação de JSON exige clique; não há envio remoto. As práticas oferecem relato opcional de dificuldade, clareza e controles. A meta de 30 segundos/oito esquivas permanece provisória, sem mudança de dificuldade ou pontuação.

O movimento corporal e a capa são cosméticos e respeitam redução de movimento. As marcas de preparação das cinco famílias permanecem dentro da geometria física original. Ações de animação são criadas quando utilizadas, preservando clipes e transições. Posição de mundo, orientação, comandos, tempos, colisões, persistência e progressão oficiais permanecem sob os sistemas existentes.

## Compartilhamento e origens — rc.22

A verificação de fluidez permite exportar a rodada atual, uma comparação das oito últimas rodadas ou selecionar um resumo em texto para copiar. Respostas opcionais permanecem associadas à sua rodada. Nada é enviado automaticamente, e sair/recarregar descarta a lista. A tabela e o resumo identificam mudanças de dimensões e amostras curtas; eventos de resize sem mudança real são ignorados. A referência é estabelecida ao iniciar.

Os avisos de origem usam rótulos e símbolos, com texto em pé e seta orientada ao conjurador. Até quatro preparações mais próximas da ativação aparecem separadas nas bordas, com contador das demais. Não classificam perigo, não preveem dano e não alteram avisos físicos. As cinco famílias prioritárias e as demais habilidades permanecem disponíveis nos quatro presets; desaparecem após a preparação e são descartados com a cena. Não há mudança de controles, dificuldade, metas, banco ou pontuação.
