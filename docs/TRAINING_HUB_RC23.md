# Central de treino — 1.0.0-rc.23

A página inicial integra quatro focos de prática e retoma o nível do último treino oficial disponível no dispositivo. A identidade grafite, azul, prata e violeta permanece; o layout dá prioridade às ações e aos objetivos de cada etapa.

## Comportamento

- Esquiva: preparação, prática de projétil linear por até 30 segundos sem nota e Normal no nível recomendado, ou nível 1 sem avaliação salva.
- Precisão, Kiting e Reflexos: prática técnica, rodada oficial no último nível salvo daquela modalidade, ou nível 1 sem histórico, e evolução com dados locais.
- Os focos são atalhos opcionais. As quatro modalidades, seleção livre de níveis, jornada, diagnósticos, ferramentas, perfil e configurações continuam acessíveis.
- A retomada escolhe a conclusão mais recente entre as quatro modalidades oficiais. Séries não substituem esse atalho. Esquiva preserva Normal/Sobrevivência e nível; as demais abrem a seleção do treino no nível salvo.
- Retomar cria uma nova tentativa com início manual e preferências atuais. Não restaura a sessão concluída, não altera resultados antigos e não promete reproduzir variantes ou comandos históricos.
- Falhas parciais do histórico são identificadas, com botão para tentar de novo. É possível treinar sem a consulta. Uma leitura que termina depois de sair da página não modifica a nova tela.
- Seleção de foco fica apenas em memória da tela; não altera preferências, avaliação, banco, backup, pontuação ou progressão.

## Validação

Os testes de unidade cobrem recomendação de Esquiva, seleção e rotas, último nível por modalidade, retomada, falha parcial, nova consulta e descarte de leituras pendentes. O smoke de navegador verifica teclado nativo, consulta real ao IndexedDB, preservação integral do registro de teste e ausência de início automático ao retomar Kiting.

A central também entra nas verificações de overflow em 390, 1366 e 1920 pixels, nos quatro focos com texto ampliado e alto contraste. Capturas são geradas em `artifacts/qa/<execução>/browser-smoke/home-<largura>.png`. Os perfis de QA são isolados dos dados do jogador.

Estado das execuções e limitações: [VALIDATION.md](VALIDATION.md). Direção de evolução: [PRODUCT_EVOLUTION.md](PRODUCT_EVOLUTION.md).
