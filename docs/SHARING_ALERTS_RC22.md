# RIFT LAB — compartilhamento e origens — rc.22

Esta revisão facilita o uso dos relatórios da [rc.21](QUALITY_RC21.md) e melhora a identificação das preparações na borda ou fora da câmera. Não retuna movimento, dano, colisões, dificuldade, avaliação ou pontuação.

## Relatórios locais

O botão **Baixar relatório** continua exportando só a rodada atual em `rift-fluency-report-v1`. A seção **Compartilhar medições** acrescenta:

- **Baixar comparação (N):** exporta até as oito últimas rodadas da tela em `rift-fluency-comparison-v1`, incluindo medidas, contexto e respostas pertencentes a cada rodada.
- **Selecionar resumo:** apresenta um texto somente de leitura, pronto para copiar com Ctrl+C e enviar manualmente. Não acessa a área de transferência nem solicita permissão de clipboard.

As respostas opcionais são mantidas junto da respectiva rodada ao repetir a verificação; a próxima começa sem respostas. Exportar a comparação cria uma cópia independente dos dados. Nada é enviado ao assistente, a um servidor ou a outro jogador. Navegar para fora/recarregar continua descartando a lista, e não há novos campos em tentativas oficiais, banco ou backup.

A tabela e o resumo distinguem **Janela estável**, **Dimensões mudaram** e **Amostra curta**. Isso qualifica a janela/amostra; não certifica equivalência entre computadores ou desempenho. As medidas de rodadas com mudanças permanecem visíveis, acompanhadas do contexto.

O aviso de redimensionamento passa a comparar largura, altura e escala do navegador. Eventos de `resize` sem alteração real não incrementam o contador. Mudanças antes do início estabelecem a referência inicial; mudanças durante a rodada, inclusive na pausa, continuam registradas. A entrada orienta ativar tela cheia antes de iniciar se ela for utilizada.

## Preparações na borda da câmera

Os indicadores usam nome curto e símbolo das cinco famílias prioritárias, conservando cores e identificação das demais habilidades. O texto permanece em pé; apenas a seta pequena gira para apontar para o conjurador. A origem anunciada não implica que o ataque necessariamente atingirá o jogador.

Até quatro rótulos reutilizáveis são exibidos, priorizando as preparações mais próximas da ativação. Não é uma previsão de dano ou de tempo até colisão. Rótulos são separados ao longo das bordas, reservando espaço para HUD e comandos. Quando há mais preparações, um contador informa as omitidas. O cenário continua exibindo todos os avisos físicos existentes.

Os indicadores aparecem só na preparação, somem quando a ameaça ativa/é removida e são descartados ao sair. A projeção considera a câmera atual, trata origens atrás da câmera e funciona nos quatro presets. Não cria RAF, listener de entrada, área de colisão ou escrita na simulação. A revisão mantém esses indicadores ocultos, conforme o comportamento anterior.

## Limites

Metas de treino e parâmetros gráficos globais permanecem iguais. Nenhuma medição ou resposta recebida de jogador é incorporada ao repositório. Os testes usam fixtures próprias. Uma captura de FPS não mede latência do mouse ou monitor nem homologa todos os modos/equipamentos. Evidências executadas estão em [VALIDATION.md](VALIDATION.md), e o roteiro de aceitação está em [QA.md](QA.md).
