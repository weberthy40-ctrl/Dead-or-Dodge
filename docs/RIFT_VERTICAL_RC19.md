# RIFT LAB — protótipo vertical de Esquiva — rc.19

A [direção aprovada](RIFT_LAB_VISION.md) passa a orientar o produto. A rc.19 integra apresentação, preparação e treino focado sobre os sistemas existentes.

## Apresentação

- Nome público RIFT LAB; menus em grafite, azul, prata e violeta, com ilustração original da rota central. Os identificadores internos de armazenamento permanecem iguais.
- Duelista Arcano usa a malha, esqueleto e animações Knight da KayKit (CC0), com materiais próprios, runas anexadas, capa e espada reduzida estética. O escudo é ocultado. Movimentação, parada e direção continuam vindo diretamente da simulação; o dash inclina a apresentação e Flash/dash ativam sinais cosméticos e sonoros.
- Rota de pedra com menor variação de contraste, vegetação atenuada e arquitetura arcana original. Pilares, cristais orbitais e portais ficam fora da área jogável. Luz principal fria e materiais consistentes nos quatro presets.
- Leve, Médio, Alto e Ultra limitam resolução e qualidade cosmética. Ultra acrescenta detalhe e sombras de 1536 pixels. Geometria de colisão, avisos essenciais, tempos e controles não dependem do preset.
- Cinco famílias têm acabamento inicial: projétil linear, lança, gancho, feixe e ruptura em área. As demais habilidades permanecem no jogo. Contornos essenciais aparecem mesmo com efeitos cosméticos reduzidos. O gancho recebe um exercício focado; a distribuição e a dificuldade oficiais permanecem iguais.
- HUD mantém vida e habilidades legíveis durante a ação, mostra a preparação antes do início e concentra a análise no resultado. Os atalhos configurados continuam refletidos na interface.
- Sinais Web Audio originais de preparação, impacto, dash e Flash; a pressão de ameaças varia a altura do sinal de preparação, sem aumentar o volume geral. Preparações são limitadas a uma a cada 350 ms e há no máximo quatro vozes. Mute, volume, desbloqueio por gesto e descarte continuam respeitados. Não há trilha ou serviço externo.

## Jornada opcional

`/journey/dodge` apresenta avaliação, preparação, tutorial e Normal. A avaliação guiada por esse percurso abre `/prepare/dodge`; a avaliação independente continua podendo entrar diretamente no Normal sugerido. A preparação expõe teclas, qualidade e áudio e permite seguir ao tutorial, entrar no Normal ou escolher uma ameaça.

O tutorial guiado termina oferecendo o Normal no nível sugerido, ou nível 1 se não houver avaliação. Os resultados oficiais continuam com relatório, salvamento, orientação e revisão dos seis segundos em memória. Quando há impactos observados de uma família reconhecida, o relatório oferece um exercício relacionado.

## Acesso livre e dados

Os 20 níveis do Normal podem ser escolhidos diretamente, sem avaliação obrigatória. `/play/dodge/normal` retoma a recomendação salva ou abre nível 1; `/play/dodge/normal/N` respeita N. Escolher outro nível não altera a recomendação. O avanço automático exige os critérios existentes, um salvamento confirmado e a mesma dificuldade da recomendação. O botão para o próximo nível navega ao nível efetivamente liberado.

Cinco exercícios em `/focus/dodge/{linear,lance,hook,beam,area}` duram até 30 segundos ativos, com três vidas. Eles reutilizam projéteis, colisão contínua, movimento, regras de sessão, métricas e revisão. Os lançamentos são voltados à posição observada do jogador, com avisos completos. São práticas técnicas em memória: não salvam resultados oficiais ou de séries, não concedem patente e não escrevem avaliação. A ordem das séries reproduzíveis `dd1` continua preservada.

Histórico, notas, conquistas, backups, preferências anteriores e IndexedDB v2 permanecem legíveis. O nome interno `moba-training` é preservado para compatibilidade. Backups com qualidade Ultra precisam de rc.19 ou superior para interpretar essa preferência.

## Aceitação

Este é um primeiro recorte integrado, com arte derivada licenciada e componentes originais, não uma afirmação de acabamento comercial concluído. Sensação do controle, desempenho em hardware físico, mixagem percebida, tela cheia e calibração com jogadores exigem aceitação manual. Veja [QA.md](QA.md) e os resultados executados em [VALIDATION.md](VALIDATION.md).
