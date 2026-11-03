# Evolução do RIFT LAB

Direção confirmada pelo proprietário em 02/11/2026: produto de treino individual para jogadores de MOBA no PC, com compra do produto, mantendo a fantasia arcana e a marca RIFT LAB. Modelo de distribuição, preço e eventual serviço online ainda não foram definidos.

## Método de entrega

Evoluir os sistemas existentes em incrementos utilizáveis. Cada entrega relevante inclui implementação, testes, revisão visual quando aplicável, commit no GitHub e acompanhamento do deployment Pages. Não remover funcionalidades sem consultar o proprietário. Decisões que dependam de preferência devem vir em questionário. Alterações técnicas rotineiras seguem autonomamente.

## Primeira entrega — central de treino, rc.23

A entrada passa a conectar apresentação e prática: foco em uma das quatro modalidades, três etapas opcionais usando os exercícios existentes e retomada no nível do último treino oficial consultado. A recomendação salva de Esquiva continua orientando o percurso Normal; selecionar um foco ou retomar uma tentativa não a reescreve.

A central consulta apenas dados locais, diferencia histórico vazio de falha de leitura e oferece nova consulta quando necessário. Retomar abre uma nova tentativa com início manual e preferências atuais; não restaura uma sessão em andamento nem os comandos históricos de um resultado antigo. Nenhuma modalidade, nível ou ferramenta foi removida.

## Segunda entrega — leitura e postura, rc.24

A [rc.24](DUELIST_READABILITY_RC24.md) entrega uma primeira camada de refinamento de arena e personagem: piso mais discreto, silhueta do Duelista mais clara, marcador de orientação e mistura de corrida/parada. Melhora a resposta visual do dash sem alterar comandos ou simulação. Aceitação de controles e arte em hardware real continua necessária.

## Linhas de evolução

A [terceira entrega, rc.25](KITING_FEEDBACK_RC25.md), aplica o refinamento ao combate de Kiting: alvo, alcance, fases, resposta do disparo e orientação no resultado. Preserva os três comandos e os contratos oficiais de dados.

Os itens 1 e 2 receberam o incremento inicial da rc.24 e continuam abertos a refinamento com avaliação do proprietário e de jogadores.

| Ordem | Área | Resultado a buscar | Evidência para aceitar |
| --- | --- | --- | --- |
| 1 | Leitura da arena | Melhor hierarquia entre terreno, personagem, avisos e impactos nos quatro presets | Capturas das mesmas ameaças, concordância com hitboxes e teste de controles |
| 2 | Resposta do personagem | Refinar transições de corrida, parada, direção, Flash e dash | Comandos imediatos, animações sem atraso de simulação e comparação com redução de movimento |
| 3 | Treinamento | Levar o acabamento dos exercícios de Esquiva às demais modalidades; orientar a próxima prática por métricas observadas | Sessões reais, feedback explicável e comparação dentro do mesmo contexto |
| 4 | Consistência de interface | Uniformizar preparação, HUD, pausa, resultado e revisão entre modalidades | Navegação por teclado, legibilidade e funcionamento em resoluções desktop |
| 5 | Desempenho e aceitação | Medir fluidez e clareza em máquinas e jogadores representativos | Relatórios de hardware, testes de controles e critérios de aceitação registrados |
| 6 | Distribuição comercial | Definir formato de venda e empacotamento com o proprietário, preservando autoria e licenças | Questionário de distribuição, pacote verificável e aceitação humana |

Esta lista orienta entregas futuras; não declara os itens implementados. Melhorias de gameplay dependem de validar resultados e controles, não apenas de alterar cores ou aumentar efeitos. A classificação interna permanece separada de qualquer elo ou certificação externa.

## Pendências antes de uma afirmação de prontidão comercial

Aceitação em Windows/Chrome/Edge, tela cheia interativa, percepção dos controles, calibração dos exercícios com jogadores e desempenho em GPU real. Os testes headless verificam funcionamento e regressões; não certificam essas experiências. Preço, cobrança, contas e sincronização exigem uma decisão de produto antes de implementação.
