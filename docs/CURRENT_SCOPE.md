# Escopo atual — 1.0.0-rc.17

Esta é a referência das regras atuais. Documentos de blocos e revisões anteriores são históricos; não substituem este escopo nem o [QA atual](QA.md). A [rc.17](DODGE_SERIES_RC17.md) acrescenta séries reproduzíveis ao aprendizado e à análise da [rc.16](DODGE_EXPERIENCE_RC16.md), preservando as regras de dificuldade da rc.14 e as correções da [rc.15](FOUNDATION_RC15.md).

O produto é um treinador web em português para **computador, teclado e mouse**. Menus podem se adaptar a telas estreitas, mas gameplay mobile não faz parte do suporte. A aplicação é estática, sem instalação para jogar no site publicado.

## Modalidades

- **Esquiva:** 20 níveis, nove famílias de habilidades, movimento por clique direito, Flash, dash e parada. Normal: três vidas, tempo ilimitado, avaliação salva obrigatória e avanço por desempenho. Sobrevivência: uma vida, tempo ilimitado e escolha livre entre os 20 níveis. Preparação parada e início manual; câmera ampla antes do início e próxima durante a tentativa. O resultado oferece revisão dos últimos seis segundos, somente em memória.
- **Precisão:** dez níveis, desafio misto com grupos de alvos fixos e móveis e sequências ocasionais por prioridade. O grupo muda somente após todos os alvos serem acertados. Cliques errados, ordem e atrasos são medidos. Treino oficial dura 60 segundos ativos.
- **Kiting:** dez níveis, combate em ondas, perseguidores e atiradores, vida, dano, abates e reposição. Um clique esquerdo solicita ataque contra um inimigo elegível no alcance, próximo do cursor; direito move e pode cancelar a preparação. A apenas mostra alcance. Tempos de ataque e velocidades variam com o nível. Treino oficial dura até 60 segundos ativos ou a derrota.
- **Reflexos:** dez níveis, desafio integrado Q/W/E/R, Espaço, F/J e mouse. Verde: esquerdo; azul: direito; vermelho: não responder. Texto e símbolos acompanham as cores. Treino oficial dura 60 segundos ativos; prática técnica tem 22 sinais. Variantes antigas continuam legíveis no histórico.

Pausa e perda de foco não contam como tempo ativo; o retorno requer retomada explícita. Abandonar não gera conclusão oficial. Encerrar e analisar na Esquiva pode salvar uma tentativa com amostra válida.

## Avaliação, progressão e dados

Esquiva: cinco etapas adaptativas de até 30 segundos, três vidas e início manual em cada etapa. Começa no nível 5 e recomenda a maior dificuldade demonstrada, com pelo menos 24 segundos sobrevividos, seis ameaças resolvidas e 80% de esquiva. Sem domínio demonstrado, o nível 1 é um ponto de partida provisório. As demais avaliações têm três etapas de 20 segundos; seus resultados ficam em memória. Diagnósticos não geram pontos oficiais.

A classificação pessoal usa até 20 tentativas recentes por modalidade, com peso maior para as recentes. A escala vai de 0 a 10.000 pontos; menos de cinco tentativas é provisório. A média geral explicita cobertura e permanece provisória se faltar alguma modalidade. **Patente interna não equivale ao elo do LoL ou a certificação profissional.**

Na rc.15, `trainer-rating-v2` corrige o redutor indevido de Reflexos integrado. Tanto o integrado quanto o misto antigo podem alcançar 10.000 pontos; exercícios auxiliares mantêm fator 0,7. O perfil e os pontos exibidos ao consultar tentativas usam o cálculo corrigido. Notas 0–100, métricas, IDs, datas, conquistas e registros dos backups permanecem intactos. Não há migração destrutiva nem alteração do banco para aplicar essa correção.

Histórico e conquistas usam IndexedDB local; preferências e avaliação salva de Esquiva usam localStorage. Backups fazem mesclagem por ID e preservam conflitos. Trocar de origem, porta, perfil ou navegador cria outro contexto de dados. Não há contas, backend, sincronização, API Riot ou ranking online.

## Aprendizado e análise de Esquiva

O menu oferece **Aprender a esquivar**, um tutorial opcional: caminhar, usar o Flash configurado, usar o dash configurado e sair de uma área anunciada. O tutorial usa o movimento e a colisão reais, permite pausa e repetição após impacto e não tem acesso a pontuação, repositório de tentativas ou avaliação salva. Não substitui a avaliação para entrar no Normal.

A arena de Esquiva tem botão de câmera livre/travada, equivalente a Y; Espaço continua centralizando sem alterar o modo. Enquadramento, velocidade, cooldowns, hitboxes, habilidades e curva de dificuldade oficiais permanecem iguais.

O resultado mostra tempo ativo, ameaças evitadas/resolvidas e impactos válidos, além de uma orientação baseada nos impactos observados. Com menos de oito ameaças resolvidas, a amostra é explicitamente curta. A orientação não infere elo, causa de morte ou ações não registradas. Detalhes e pontuação podem ser expandidos; confirmação de salvamento permanece visível.

A revisão começa perto do último impacto disponível nos seis segundos em memória. Cada marcador numerado permite ir àquele instante; slider, câmera da revisão e reprodução não alteram a sessão concluída.

## Séries de Esquiva

A opção **Repetir uma sequência** abre três temas: Passos laterais, Leitura de áreas e Ameaças combinadas. Cada série tem três vidas e até 30 segundos ativos. Não exige avaliação anterior. O código `dd1-<tema>-<8 dígitos hexadecimais>` identifica tema, versão e semente; são 19 lançamentos predefinidos entre 2 e 27,2 segundos ativos, com posições, direções e avisos fixos. A sequência não depende da posição do jogador e não usa o diretor adaptativo de Normal/Sobrevivência.

As respostas do jogador, contatos, duração até derrota e exposição às ameaças podem variar. Os horários dos lançamentos não tornam a latência do navegador ou os resultados de colisão iguais entre computadores. Compare usando o mesmo equipamento, controles e versão do aplicativo.

As últimas 20 tentativas de cada código aparecem na comparação, com tempo, impactos e ameaças evitadas/resolvidas. A orientação sugere repetir ou variar, com ressalva quando a exposição é pequena. O menu permite retomar cinco códigos recentes, abrir um código informado ou criar outro. Não há placar entre pessoas nem equivalência competitiva.

Tentativas concluídas ou encerradas por derrota são salvas como `dodge-challenge`, fora das quatro modalidades que compõem patentes e dos recordes de Normal/Sobrevivência. Abandono ou erro não registra resultado. As séries usam o IndexedDB existente e entram no backup por mesclagem, sem mudar o schema do banco ou sobrescrever treinos anteriores. Backups antigos continuam aceitos; backups contendo séries precisam de rc.17 ou superior.

## Controles, qualidade e limites

Controles completos estão no README. Os presets Leve/Médio/Alto afetam renderização, não dificuldade. Contraste, texto ampliado, redução de movimento e áudio opcional já existem. DPI é uma ferramenta auxiliar: depende de distância física medida e suporte a entrada bruta; não configura o mouse nem reproduz a sensibilidade do LoL.

Arena, habilidades, velocidades e patentes são adaptações próprias. As referências históricas não comprovam equivalência ao patch atual do LoL. Modelos KayKit têm origem e licenças CC0 incluídas; demais recursos estão documentados em `public/assets`.

Windows/Chrome/Edge, tela cheia interativa, latência percebida, desempenho em hardware real e calibração com jogadores continuam exigindo validação manual. Evidências executadas ficam em [VALIDATION.md](VALIDATION.md), separadas de requisitos ainda pendentes.
