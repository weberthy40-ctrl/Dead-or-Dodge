# Preparação, HUD e pausa — 1.0.0-rc.28

Incremento de consistência nos treinos principais de Esquiva Normal/Sobrevivência, Precisão, Kiting e Reflexos, incluindo as práticas técnicas das três últimas modalidades. Reaproveita os sistemas aprovados e conserva seus percursos, objetivos e regras.

## Preparação

As quatro modalidades apresentam foco, condições e comandos no mesmo formato. A Esquiva mantém seu cartão e sua espera pelos assets; as demais reutilizam o botão de início já existente, que permanece indisponível enquanto a própria tela prepara a arena. O usuário continua ajustando as opções acima do cartão, antes de iniciar por clique ou teclado.

A camada visual não inicia sessões nem exercícios por conta própria. O clique chama o mesmo handler anterior e mantém contagem, configuração, sorteio e foco originais. Reiniciar pelos controles existentes continua com o comportamento de repetição anterior. Trocar nível/comandos antes de iniciar descarta a apresentação e a importação antigas.

As condições diferenciam três/uma vida da Esquiva, os minutos oficiais e o encerramento por derrota no Kiting. As práticas técnicas continuam com ajustes do nível 4 na Precisão, nível 1 no Kiting e 22 sinais em Reflexos. Não há nova configuração de dificuldade nem nova regra de pontuação.

## Estado e tempo

Uma identificação comum acompanha pronto, preparação, treino, pausa e encerramento. Os contadores específicos permanecem sob cada modalidade. Durante a preparação, os contadores vazios e as indicações de jogo ficam ocultos para liberar as opções; reaparecem ao iniciar. Reflexos passa a usar os mesmos chips de HUD das outras modalidades.

O texto do relógio vem do mesmo snapshot da sessão: contagem inicial, pausa, segundos restantes do treino oficial ou segundos ativos decorridos na prática sem limite. Precisão/Kiting técnicos deixam de exibir uma contagem fictícia que parava em 0s após um minuto. Seus limites reais e seus relógios não mudam.

## Pausa e teclado

O painel de pausa mostra contexto, foco, condições e comandos e oferece Retomar ou Voltar ao menu. Retomar reutiliza o botão original: o mesmo handler continua a mesma sessão e devolve o foco ao canvas ou à área de Reflexos. A contagem inicial também pode ser pausada e retomada, sem reiniciar seus segundos.

Tab/Shift+Tab circulam no painel; o conteúdo ganha foco de leitura quando há rolagem. ESC chama a mesma retomada uma vez. Atalhos do jogo ficam suspensos dentro do painel. Fechar por pedido nativo do diálogo também passa pela retomada explícita. A pausa por perda de foco continua congelando tempo e exercício; mostrar a página novamente apenas apresenta o painel, sem retomar.

Voltar ao menu utiliza a navegação existente, que descarta a tentativa incompleta sem salvar uma conclusão oficial. Resultados já concluídos, preferências, recomendações e backups não são apagados. Reiniciar/sair fecha o diálogo, restaura os botões e remove observadores/assinaturas; eventos de outra tentativa não controlam o painel atual.

## Escopo preservado

A preparação de Esquiva reutiliza o cartão anterior apenas quando recebe o contexto dos treinos principais. Tutorial, séries, exercícios focados, avaliação e verificação de fluidez mantêm seus percursos próprios. A avaliação de Reflexos não recebe a nova preparação, preservando suas três etapas. Não há alteração de motores, RNG, movimento, colisões, tempos de habilidades, janelas de reação, pontuação, progressão, schema ou formato de backups.

## Validação

Testes verificam início explícito, carregamento, reutilização dos botões, pausa na contagem, ESC, ciclo de Tab, foco, visibilidade sem retomada automática, descarte e saída sem persistência nas quatro modalidades. Dois casos conferem os relógios das práticas após um minuto.

O roteiro de navegador cobre as quatro modalidades em 1366×768 e 1920×1080, com texto ampliado/alto contraste na segunda resolução. Usa teclado nativo para iniciar, pausar, circular, retomar e sair; compara registros e preferências antes/depois. Blur/focus também é simulado por eventos, distinguindo essa verificação de troca física de janela. O build compilado repete os quatro fluxos desktop. Resultados executados estão em [VALIDATION.md](VALIDATION.md).

Menus estreitos continuam no escopo anterior, sem ampliar suporte de gameplay para celular. Sensação, tela cheia interativa, troca real de janela e aceitação em Windows/Chrome/Edge e GPU física continuam no [roteiro manual](QA.md).
