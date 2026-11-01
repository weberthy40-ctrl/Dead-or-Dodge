# RIFT LAB — fluidez, controles e leitura — rc.21

Esta entrega mantém a Esquiva como demonstração principal e acrescenta instrumentos para validá-la no computador do jogador. A direção de [RIFT LAB](RIFT_LAB_VISION.md), a jornada opcional e os sistemas existentes continuam vigentes.

## Verificação no computador

`/check/dodge`, acessível pela preparação, executa o cenário fixo `rift-fluency-v1`: 24 lançamentos das cinco famílias prioritárias, com horários, posições e direções definidos. Os lançamentos não seguem a posição do jogador. A cena usa as colisões existentes; contatos são visuais e não encerram a observação. Não há vidas, nota, patente, avaliação ou salvamento de tentativa.

A rodada tem dois segundos de aquecimento e 30 segundos de observação em tempo de simulação. A coleta usa o relógio real entre quadros do loop da arena, após a chamada de renderização. Pausa e perda de foco suspendem a coleta e descartam o intervalo até a retomada. Travamentos durante atividade permanecem na amostra, mesmo quando o passo da simulação é limitado. Por isso, o tempo real observado pode diferir do tempo simulado.

O relatório apresenta FPS médio observado, intervalo mediano, p95, maior intervalo, quadros acima de 50 ms, tempo até a arena pronta e contexto de renderização. p95 usa um histograma limitado em memória, com resolução de 0,25 ms e último intervalo em 1.000 ms; se o p95 atingir esse intervalo, a interface mostra `≥ 1000 ms`. O máximo mantém o valor real. Menos de 30 intervalos ou cinco segundos observados são explicitamente uma amostra curta.

Isso mede cadência no navegador, **não latência física do mouse, tempo isolado de GPU ou atraso do monitor**. A contagem de comandos indica ações aceitas, não certifica a sensação do controle. O carregamento pode usar cache. Resultados em Chromium headless e renderização por software não representam o desempenho no computador do jogador.

Leve, Médio, Alto e Ultra podem ser escolhidos só para a verificação. Essa escolha não escreve preferências. As últimas oito verificações ficam em memória e exibem resolução, qualidade e medidas. Redimensionamento é registrado e recebe aviso para repetir antes de comparar. Rotas, zoom, câmera e outros programas também afetam a carga; não há classificação automática de hardware, recomendação compulsória ou mudança automática de preset.

O jogador pode responder sobre controles, clareza e fluidez e baixar um JSON deliberadamente. As respostas são separadas das medidas. Não há envio a servidor, coleta de identidade, detecção do modelo de GPU, conta ou serviço pago. Sair/recarregar descarta a lista; o arquivo só existe se o jogador o baixar.

## Personagem e controles

O Duelista mantém posição e orientação de mundo imediatas. A inclinação cosmética do corpo acompanha corrida, parada, curvas e dash, com limites de 0,065 rad na curva e 0,14 rad na inclinação frontal. A capa acompanha a transição; a redução de movimento mantém os ajustes estáticos. Nenhum desses valores fornece colisões ou espera para aceitar comandos.

As ações de animação do modelo são criadas apenas quando utilizadas: a inicialização passa de quatro ações para uma. Corrida e ataques continuam disponíveis e são reutilizados após a primeira criação. A base CC0, os quatro clipes, suas transições e os tempos físicos permanecem preservados. A redução de alocações é verificável no modelo real; não implica um ganho de FPS certificado em hardware.

## Leitura das cinco famílias

Além das silhuetas existentes, a preparação distingue projétil, lança, gancho, feixe e área por marcas geométricas. Chevrons, losango, anel, bordas do corredor e quatro marcas radiais usam geometrias/materiais compartilhados e ficam dentro do contorno físico real. São essenciais nos quatro presets, não aumentam hitboxes e desaparecem com a fase de preparação. As demais habilidades são preservadas.

## Calibração com jogadores

A meta de 30 segundos e oito ameaças evitadas permanece uma referência provisória. Os testes simulados verificam possibilidade técnica, não sua adequação a pessoas. Não houve relato humano nesta entrega até o momento da implementação; o proprietário informou que ainda não havia testado a versão anterior.

O resultado dos treinos focados oferece um formulário opcional de dificuldade, clareza e resposta dos controles. Exportar exige responder às três perguntas e clicar em baixar. O relato inclui família, versão, objetivo, resultado observado, contexto de renderização disponível e respostas. Não altera comparação entre rodadas, histórico oficial, patentes, progresso, configurações, banco ou backup. O jogador pode ignorá-lo e repetir normalmente.

Homologação de controles, sensação de movimento, metas e suporte a hardware continuam dependendo de sessões com jogadores. O roteiro está em [QA.md](QA.md), e evidências executadas ficam em [VALIDATION.md](VALIDATION.md).
