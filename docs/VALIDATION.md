# Validação — bloco 001–002.1

Verificações executadas em 25/10/2026 no ambiente de desenvolvimento em nuvem.

## Escopo entregue

Fundação e página inicial do Prompt 001, núcleo técnico do Prompt 002 e seleção/revisão de segurança das dependências prevista em 002.1. A implementação começou em um repositório vazio; as afirmações de aprovação prévia contidas nos prompts não foram usadas como evidência.

## Resultados

| Verificação | Resultado |
| --- | --- |
| Instalação e reinstalação pelo lockfile | `npm install` e `npm ci` concluídos; lockfile gerado pelo npm. |
| `npm run test` | 47 testes aprovados em 5 arquivos, sem testes ignorados ou falhas. |
| `npm run lint` | Aprovado, sem erros ou avisos. |
| `npm run build` | Build de produção concluído pelo Vite. |
| `npm audit` | Nenhuma vulnerabilidade conhecida reportada na consulta realizada. |
| Execução com `npm run dev` | Página funcional verificada em Chromium. |
| Execução com `npm run preview` | Build de produção funcional verificado em Chromium. |
| Viewports 1440×900 e 360×800 | Título/mensagem corretos, CSS carregado, um único `main` e sem overflow horizontal. |
| Recarregamento da página | Interface reinicializada corretamente, sem duplicação ou erros de JavaScript. |

Versões verificadas: Node.js 24.19.0, npm 11.9.0, Vite 8.3.5, Three.js 0.186.1, Vitest 5.0.5, ESLint 10.13.0 e jsdom 30.1.3. A auditoria representa a base de vulnerabilidades conhecida na data da consulta.

Os testes cobrem estado imutável, atualizações sem alteração, cancelamento de inscrições, isolamento de listeners, execução única reentrante, deduplicação de erros, falha fatal, transições, inicialização simultânea, recursos parciais/tardios e descarte. A revisão corrigiu falha fatal reentrante, ordem de notificações, preservação da causa fatal e inscrições após descarte; esses casos têm regressões automatizadas.

## Limites

Este bloco ainda não contém menu, arena, personagem, exercícios ou salvamento. A verificação no navegador cobre a fundação atual; não valida gameplay futuro nem todos os navegadores. A instalação e execução em uma nova tarefa após publicação do ambiente ainda não foram verificadas. Aprovação de produto e publicação no GitHub são etapas distintas destas verificações técnicas.


## Bloco 003–006

56 testes passaram em 7 arquivos; lint aprovado; build aprovado. O build informa chunk 3D de aproximadamente 533 kB, carregado apenas na rota da prévia, sem aumentar o carregamento inicial pela mesma quantidade. Chromium verificou 40 níveis selecionáveis, contexto WebGL2 real, navegação de entrada/saída da prévia três vezes com exatamente um canvas, desktop/mobile, reload e ausência de erros JS. Nenhum pacote foi alterado. Estes resultados não constituem validação das etapas seguintes.


## Bloco 007–012

62 testes aprovados em 8 arquivos. Build, lint e npm audit aprovados (0 vulnerabilidades reportadas). Regressão de 003–006 preservada. Novos testes verificam movimento em diferentes FPS, raycast com canvas deslocado, rejeição de input inválido, zoom/modos, preferências, countdown/pausa/abandono, listeners e RAF removidos. Chromium verificou countdown real, ESC pausa, tempo congelado, Retomar, armazenamento e recarga das preferências, WebGL e ausência de erros JS. O aviso de tamanho do chunk Three.js persiste; carregamento é lazy.


## Bloco 013–018

73 testes aprovados em 10 arquivos; lint e build aprovados. Testes novos cobrem colisão relativa contínua, tangência, quase erro, TTL/alcance, hit único, cabo sem colisão, área ativa, tentativas finitas de spawn seguro, seed, limites, combos reais, perfis e rejeição de ameaça sem fuga. Chromium voltou a verificar a navegação, WebGL real, countdown, disparos técnicos, pausa sem novos disparos e preferências persistentes. Não há modos Normal/Sobrevivência nesta versão técnica. O aviso de tamanho do chunk 3D permanece documentado.


## Bloco 019–020

78 testes aprovados em 11 arquivos; lint e build aprovados. Simulações verificam Normal nos dez níveis, vitória em 60 s, derrota por três danos, imunidade/pausa, sobrevivência acima de 120 s, primeiro hit terminal, evento antigo e borda fatal antes da vitória. Chromium verificou HUD Normal 3/3 e 60 s, Sobrevivência até derrota por ataques reais com RNG de fixture do teste, replay limpo com 1/1 vida e countdown, retorno e configurações. A fixture altera apenas a fonte de seed no navegador de teste, sem cheats ou botões de dano na aplicação.


## Bloco 021–022

85 testes passaram em 12 arquivos; lint e build aprovados. Cobrem disparos distantes, pendências, contato imune, dano aceito, movimento/reset, congelamento, nota conhecida 94/100, versões inválidas, janelas inconsistentes, amostra única e monotonicidade do componente temporal. Simulação completa com seed 1 gerou tentativa elegível e score real (33/100, sobrevivência 16,05 s no step de 1/60 s). Chromium verificou resultado com métricas reais e motivo de indisponibilidade por amostra curta, preservando replay. Ainda não há persistência nesta etapa.


## Blocos 023–030

Salvamento real de uma tentativa de Sobrevivência elegível, com score 33/100, foi confirmado pelo commit e pela mensagem na interface. IndexedDB real verificou save/get/list/count, repetição sem duplicata, conflito sem overwrite e reabertura. A revisão encontrou e corrigiu um guard de geração da UI; regressão testa a mensagem pós-commit e gravação única. Erros de abertura, indisponibilidade, retry e resposta tardia têm testes.

Histórico, filtros, recordes, SVG+tabela, seis conquistas e rating sem amostra foram verificados com registros reais no Chromium. Domínio e UI têm testes de paginação/corrida, data/ID, três resultados recentes, queda do rating, conquistas fora de amostra limitada e gráfico após filtro.

102 testes passaram em 18 arquivos antes do último ajuste defensivo de importação e metadado gameVersion; build/lint aprovados. Avaliação guiada real completa percorreu 2/5/8, com duas rodadas de 20 s e terceira encerrada por vidas aos ~17 s; exibiu dados reais e sugestão experimental 7/10. Contagem de registros oficiais ficou igual antes/depois. Refazer limpou o fluxo. Nova regressão final após os ajustes está registrada na continuação do trabalho.


## Bloco 031–045

Vitest: **121 testes em 23 arquivos passaram**. ESLint sem avisos. Build de produção passou; permanece aviso de tamanho do chunk Three.js carregado sob demanda (aproximadamente 550 kB minificado). Testes novos verificam snapshots de Precisão, nota zero, isolamento de modalidades, rating recente e rebaixamento, seis conquistas, ordenação de recordes, filtros e evolução; diagnóstico puro, tabela, dados inválidos/amostra insuficiente, três rodadas com relógio real do domínio, pausa, reset e imports tardios.

Chromium real: completou tentativa oficial de 60 s com nota zero, confirmou commit e leitura pelo histórico de Precisão. Completou 3×20 s diagnósticos sem cliques: mostrou amostra insuficiente, sem recomendação numérica; o total de registros oficiais não mudou, e Refazer restaurou a introdução. Verificações automatizadas não atestam sensibilidade física do mouse, calibração humana das metas ou aprovação no Windows.

## Candidata 1.0.0-rc.1 — blocos 046–105

Instalação limpa pelo lockfile executada novamente: 150 pacotes, Node 24.19.0/npm 11.9.0. **158 testes em 35 arquivos passaram**, sem skips ou assertions desativadas. ESLint sem avisos; build passou; auditoria apontou **zero vulnerabilidades**. O chunk Three.js sob demanda mantém aviso de tamanho (aproximadamente 556 kB minificado).

Chromium/Linux real executou:

- Kiting: seleção sem ataque no primeiro clique, windup, cancelamento por direito, confirmação única, tecla A e troca das três variantes; oficial real de 60 s com zero e commit; três diagnósticos reais de 20 s, insuficiência, Refazer e isolamento.
- Reflexos: cinco respostas reais ao sinal, latências corretas, oficial real de 60 s com omissões e zero salvo; três diagnósticos reais de 20 s sem resposta, insuficiência e isolamento. Recomendação positiva 9/10 foi verificada na integração determinística com o motor real e clock injetado.
- DPI: proxy 1200 e equivalência 0,75; duas rodadas reais de dez cliques, comparação com unidades e quatro cartões do Perfil.
- IndexedDB/backup: upgrade v1→v2 bloqueado e recuperado, preservação, snapshots das quatro modalidades, export/import, idempotência, conflito e falha de quota com rollback. Conquistas de Kiting foram verificadas também com 25 sessões de fixture em banco separado e reabertura, sem contaminar o banco oficial.
- Dez entradas/saídas de arena: um RAF na cena, nenhum RAF/canvas no menu. Heap observado de ~8,75 MB no segundo ciclo a ~9,45 MB no décimo após GC; não foi medido FPS ou memória de GPU. Screenshots de 1366×768, 1920×1080 e 390×844 foram inspecionadas sem overflow nos menus.

A suíte acrescentou uma checagem independente de rota: dez níveis por 120 s de simulação, quatro ataques admitidos em todos, concorrência limitada e rota amostrada a cada 5 ms no horizonte de 1,2 s. Isso não prova fairness humana universal. Animação e VFX têm testes de raycast neutro, limite de recursos, pausa e remoção de assinaturas. Áudio usa mocks de Web Audio para testar unlock/volume/mute/concorrência; a percepção sonora em hardware real não foi homologada.

A página inicial deixou os textos de placeholder da fundação durante o polimento; o teste semântico foi atualizado para a identidade atual, preservando as mesmas verificações de inicialização, acessibilidade e ownership. Nenhuma fórmula oficial foi recalculada retroativamente.

Relatórios finais: [099](validacao/099-linha-de-base.md), [100](validacao/100-fluxos.md), [101](validacao/101-gameplay-3d.md), [102](validacao/102-integridade-dados.md), [103](validacao/103-diagnosticos-perfil.md), [104](validacao/104-estabilidade.md), [105](validacao/105-criterios-lancamento.md). Permanecem pendentes Windows, calibração com jogadores, estabilidade longa, CI remoto e restauração de uma nova tarefa após publicação do ambiente. A decisão é **RC**, sem declarar 1.0 aprovada.


### Verificação da distribuição

O ZIP foi extraído em diretório separado, sem node_modules ou dist. Nessa extração, npm ci instalou 150 pacotes; os mesmos 158 testes passaram, assim como lint, build e audit (zero vulnerabilidades). O preview do build extraído passou pelo teste real de navegador, inclusive dez remontagens e os três viewports. Em DPR 2, o mesmo canvas de 1168,75 pixels CSS usou larguras internas 1169/1636/2045 em Leve/Médio/Alto, confirmando diferenças reais sem alteração da área CSS. A preferência anterior foi restaurada ao terminar o teste. CRC e comparação byte a byte validam o pacote final; os últimos ajustes de documentação não alteram os fontes testados.

## Revisão da experiência — 1.0.0-rc.2

- `npm test -- --maxWorkers=2`: **165 testes em 37 arquivos**, todos passaram.
- `npm run lint`: passou, sem avisos. `npm run build`: passou; chunk Three continua carregado sob demanda e gera o aviso de tamanho já conhecido.
- `npm run test:browser`: passou em Chromium. Cinco rotas principais, 40 níveis, quatro avaliações; dez reentradas com um RAF em cena e nenhum RAF/canvas após sair. Heap após GC foi de aproximadamente 9,1 para 9,7 MB entre ciclos 2 e 10. Presets gráficos respeitaram DPR 1/1,4/1,75; menus verificados em 1366×768, 1920×1080 e 390×844.
- `npm run test:storage`: passou; upgrade bloqueado recuperado, migração, quatro modalidades no round-trip, conflitos preservados, rollback de quota e seis conquistas permanentes.
- Interação Chromium real em 1024×768: kiting abriu no perseguidor; primeiro clique confirmou um ataque; A + clique no terreno próximo confirmou o segundo. Precisão aceitou clique real no alvo; reflexo abriu na variante mista; perfil exibiu quatro cartões; dez cliques no teste DPI produziram uma rodada real, sem recomendar com apenas uma amostra. Início, perfil, DPI e configurações também ficaram sem overflow horizontal em 390×844. Nenhum erro JS foi registrado nesse roteiro.
- Inspeção visual dos novos início, arena, precisão e perfil. Uma falha de integração no cartão de Esquiva, causada por esquemas diferentes dos resumos, foi corrigida e coberta por teste.
- O passo físico do DPI depende de régua e hardware e permanece pendente de teste humano; as fórmulas, rejeições e repetição são testadas automaticamente. Balanceamento e aceitação artística continuam sujeitos ao próximo teste do jogador.

Detalhes funcionais e fórmulas: `ARENA_REVISION.md`. Resultados oficiais antigos permanecem salvos; o rebalanceamento limita comparações entre versões.

## Visual e combate — 1.0.0-rc.3

- **174 testes / 38 arquivos**, todos passaram (`npm test -- --maxWorkers=2`); lint sem avisos e build de produção aprovados. Inclui origens nos oito setores, tentativas limitadas, trajetórias fixas, escape independente nos dez níveis, escolha de um alvo por clique, preparação sem redirecionamento, perseguição de todos os inimigos, legado sem população e aplicação imediata da pose Idle.
- Chromium: cliques reais em chão vazio confirmaram ataques nos níveis 1 (dois inimigos) e 10 (seis). A pressionado não gerou ataques; direito não acrescentou ataques. Esquiva com origens aleatórias foi renderizada sem erro JS. Capturas inspecionadas para mapa, personagens e alcance.
- Smoke: cinco rotas principais, 40 níveis e quatro avaliações passaram. Dez reentradas em **Leve**, aguardando modelos prontos: um RAF em cena e zero RAF/canvas após sair; heap após GC passou de 11,1 para 11,7 MB entre ciclos 2 e 10. Presets Leve/Médio/Alto renderizaram com DPR 1/1,4/1,75. Sem overflow nos menus em 1366×768, 1920×1080 e 390×844.
- A primeira sequência de reentradas em Alto excedeu o timeout de 15 s do CDP no Chromium por software desta máquina. O smoke final fixa Leve para o teste de recursos e verifica os três presets separadamente. Isso não é um benchmark de FPS ou de memória da GPU.
- IndexedDB: bloqueio/upgrade, migração, round-trip das quatro modalidades, conflito, rollback de quota e seis conquistas permanentes passaram.
- Build servido estaticamente em **`/MELHORE-NO-LOL/`**: versão rc.3, JS/CSS, sete GLBs e seis inimigos carregaram sem erro JS. Confirma os caminhos relativos usados pelo GitHub Pages.
- Balanceamento com jogadores e desempenho no computador do usuário continuam sujeitos ao teste humano. Os modelos são CC0 com fontes, hashes e licenças incluídas; detalhes em `VISUAL_COMBAT_REVISION.md`.

## Projéteis e resumo — 1.0.0-rc.4

- `npm test -- --maxWorkers=2`: **177 testes em 38 arquivos**, todos aprovados. Lint e build também passaram.
- Cobertura nova: halo com diâmetro mínimo de 26 pixels quando a câmera afasta, recursos visuais liberados uma vez, dados físicos preservados; derrota Normal e Sobrevivência com replay/menu no diálogo, foco no replay e nova sessão ao reiniciar.
- Chromium real em 1366×768: após morrer nos dois modos, o resumo abriu na camada modal, HUD atrás oculto, foco inicial correto e Tab restrito ao painel. Hit test e cliques reais confirmaram Jogar novamente iniciando outra tentativa e Voltar ao menu retornando ao início.
- Em 390×640, as ações permaneceram inteiramente dentro da tela, com rolagem separada para o conteúdo. Capturas inspecionadas para projéteis e resumo. Nenhum erro JS registrado no roteiro.
- Raios, velocidades, colisão e pontuação não foram modificados nesta revisão. O rastro, o contorno e o halo são somente apresentação.

## Revisão rc.11 — 27/10/2026

237 testes em 48 arquivos passaram. Lint e build aprovados. Novos cenários verificam dash contínuo, parada durante dash, limites da arena, tecla alternativa, recarga congelada na pausa, distância igual com as duas câmeras, suavização independente da subdivisão de tempo, chegada justa dos disparos em 180%, gaiolas com espaço e intervalo, Normal acima de 120 s, encerramento voluntário salvo e compatibilidade dos registros anteriores.

Chromium verificou entrada padrão em desafio de três vidas, aquecimento adaptativo, Flash em F e Dash em E por eventos nativos em 1920 × 1080, clique direito sem menu sobre arena/HUD, pausa, revisão dos seis segundos, troca de objetivo, jogar novamente e derrota oficial salva com ações centrais visíveis. Precisão completou quatro grupos com cliques nativos, reflexo respondeu a teclas e às três cores, e kite confirmou cancelamento, abate, dano, morte e salvamento. Tela cheia real foi explicitamente excluída desta execução: a chamada permanece pendente no Chromium headless, inclusive em página mínima. Não foi declarada uma verificação manual de fluidez ou de tela cheia no Windows.

Armazenamento nativo aprovou migração, ida e volta de backup, conflitos, rollback e seis conquistas permanentes. A checagem de navegação aprovou 40 níveis, quatro diagnósticos, dez reentradas com zero canvas/RAF remanescentes e crescimento de heap abaixo de 5 MiB após aquecimento, os três limites de resolução gráfica e menus em 1366, 1920 e 390 px. Duas execuções anteriores expiraram no comando do DevTools `HeapProfiler.collectGarbage`; uma comparação isolada com rc.10 e a repetição completa de rc.11 passaram. Isso não constitui medição de FPS no computador do jogador.

## Revisão rc.12 — 27/10/2026

A bateria completa de 247 testes passou após a mudança da curva dos vinte níveis. Depois, nove testes direcionados confirmaram o bloqueio de resultados anteriores à nova avaliação e os ajustes do perfil; seis testes de patente, incluindo um caso adicional para os registros das outras três modalidades, também passaram. Total atual: 248 testes em 50 arquivos. Lint e build aprovados.

Cobertura nova: todas as fronteiras de patente, limite de pontos por dificuldade, ausência de XP acumulável, janela de vinte tentativas independente da ordem de leitura, duplicatas, histórico antigo imutável, média geral com cobertura parcial, avaliação completa persistida, backup da avaliação, bloqueio de URLs diretas do Normal, escolha do nível 20 em Sobrevivência, avanço somente após gravação confirmada e idempotência de callbacks. Os vinte perfis de esquiva foram comparados com um verificador independente de trajetórias, incluindo passos curtos seguidos de parada em gaiolas.

Chromium, build de produção: Sobrevivência no nível 20 sem avaliação, derrota real e salvamento com pontos; três etapas diagnósticas reais, avaliação salva e entrada automática no Normal; movimento, Flash remapeado, dash e câmera; resultado central, replay e perfil calculado dos registros efetivos. Nenhuma exceção de execução foi capturada no cenário principal de esquiva. Menus, seletor de nível e perfil foram verificados sem transbordamento horizontal em 1366 × 768, 1920 × 1080 e 390 × 844. A execução `QA_MENUS_ONLY=1` verifica navegação/perfil e não declara o teste de heap ou dos três níveis gráficos.

A rotina adicional de gameplay passou pelos ataques, cancelamento, abate e Flash de kite, quatro grupos de precisão com cliques nativos e reflexo com teclado e as três cores. Execuções da rotina inteira expiraram em chamadas do DevTools ou esperando a reentrada de recursos 3D no renderizador por software; o cenário final de derrota do kite foi repetido isoladamente (`QA_GAMEPLAY_CASE=kiting-defeat`) e passou com pontos e salvamento. O transporte CDP aceita timeout configurável; a execução por software usou 45 s. Isso não mede FPS no computador do usuário. Tela cheia real continua fora desta execução headless.

Armazenamento nativo passou: bloqueio, migração, leitura/gravação, ida e volta de backup, conflitos, rollback e seis conquistas permanentes. Os dados anteriores continuam legíveis. Documentação funcional em [PLAYER_FEEDBACK_RC12.md](PLAYER_FEEDBACK_RC12.md).


## Revisão rc.13 — 27/10/2026

254 testes em 52 arquivos passaram; lint sem avisos e build de produção aprovados. O build mantém o aviso de tamanho do chunk 3D que inclui Three.js. Cobertura nova: orçamento de disparos dentro da gaiola, rejeição de áreas/raios/lanças e gaiolas duplicadas, janela de gaiola em uma simulação real de nível 20, desbloqueios graduais, continuidade da caminhada após Dash/Flash, parada com S, avaliação anterior preservada e prevenção do menu de contexto/voltar/avançar dentro do treino. O bloqueio de margens em tela cheia é verificado com estado simulado no DOM; não representa teste manual da API no Windows.

Chromium, build de produção, 1920 × 1080: seleção livre de Sobrevivência 20, derrota real e pontos salvos; três etapas diagnósticas reais e entrada automática no Normal 1; movimento direito, Dash E, Flash F, câmera livre e Espaço por eventos nativos; clique direito sem menu, resultado central, revisão dos seis segundos, perfil com patente/média parcial e saída sem canvas/RAF remanescentes. Nenhuma exceção de execução capturada na sequência aprovada. Tentativas anteriores expiraram no transporte CDP e ao esperar uma avaliação com duas páginas de teste competindo por foco; a sequência isolada em um Chromium novo passou. Não se infere FPS ou fluidez no equipamento do jogador.

Navegação e perfil passaram em 1366 × 768, 1920 × 1080 e 390 × 844: seis rotas, trinta níveis das outras modalidades, vinte de esquiva e quatro diagnósticos. `QA_MENUS_ONLY=1` não exercita heap ou presets gráficos. Capturas de apresentação controladas foram inspecionadas para silhuetas, gaiola e arena; são composições visuais, não resultados de partidas oficiais.

Fontes, licença CC0 e hashes dos novos modelos estão em `public/assets/kaykit-nature/`. Referências e regras atuais: [PLAYER_FEEDBACK_RC13.md](PLAYER_FEEDBACK_RC13.md). Tela cheia e sensação de controle no Windows continuam dependentes do teste manual do usuário.

Armazenamento nativo aprovado: bloqueio/upgrade, migração, gravação das quatro modalidades, ida e volta de backup, conflito, rollback e seis conquistas permanentes. Todos os hashes declarados dos novos modelos conferem.

## Revisão rc.14 — 27/10/2026

A bateria completa passou com 259 testes em 54 arquivos. Depois dos ajustes finais de enquadramento, escopo das sombras e apresentação da avaliação, passaram novamente os testes direcionados de controles/câmera (18), animação real e navegação (12), e navegação/percurso diagnóstico (11). Lint sem avisos e build aprovados; permanece o aviso de tamanho do chunk que inclui Three.js.

A cobertura nova verifica início manual sem contagem, tempo zerado enquanto a arena carrega, saída da preparação sem controles órfãos, enquadramento amplo/ativo com proporção 0,86/1,7, percurso adaptativo, limites de evidência, recomendação sem extrapolação, recusa de etapas fora da sequência/duplicadas e compatibilidade das avaliações anteriores. O backup de uma avaliação nova com cinco etapas foi exportado/importado e preservou nível e resultados. Um teste adicional carrega a geometria, esqueleto e animações do arquivo real do cavaleiro, alterna corrida/repouso/direção por 120 quadros e confere estabilidade espacial e configuração de sombras/recorte.

Chromium, build de produção, 1920 × 1080: Sobrevivência no nível 20 aguardou o clique em Iniciar com relógio zerado; derrota real salva com pontos; cinco etapas adaptativas reais percorreram 5, 2, 1, 1 e 1 e salvaram o acesso ao Normal, que também aguardou início manual. Movimento direito, Dash E, Flash F, câmera livre e Espaço passaram com eventos nativos; o cabeçalho ficou oculto durante o jogo. Resultado central, revisão, perfil com pontos e saída sem canvas/RAF remanescentes passaram. Nenhuma exceção de execução capturada.

A apresentação final foi conferida separadamente em qualidade Alta, com sombras ligadas e movimento por clique nativo: enquadramento ativo medido em 0,505882 da distância de preparação (0,86/1,7), capturas em diferentes poses e nenhuma exceção. Essa composição não gera resultados oficiais; não é benchmark de FPS nem teste do monitor do jogador. Tela cheia real no Windows continua dependente do teste humano.

Menus/perfil sem transbordamento em 1366 × 768, 1920 × 1080 e 390 × 844: seis rotas, trinta níveis das outras modalidades, vinte de esquiva e quatro diagnósticos. A execução `QA_MENUS_ONLY=1` não mede heap nem presets. Armazenamento nativo aprovou bloqueio, migração, ida e volta de backup, conflitos, rollback e seis conquistas permanentes. O ambiente ficou temporariamente indisponível durante a preparação dos documentos; os arquivos foram preservados e os resultados dos processos foram conferidos após a reconexão.

Regras e limitações: [PLAYER_FEEDBACK_RC14.md](PLAYER_FEEDBACK_RC14.md).

## Base corrigida — 1.0.0-rc.15 — 31/10/2026

As seções anteriores são evidências históricas de suas respectivas versões. Regras atuais: [CURRENT_SCOPE.md](CURRENT_SCOPE.md). Alterações desta revisão: [FOUNDATION_RC15.md](FOUNDATION_RC15.md).

Executado `QA_NO_SANDBOX=1 npm run check` no checkout `/workspace/Dead-or-Dodge`, Node 24.19.0/npm 11.9.0 e Chromium 154.0.8037.57 em Linux. Comando concluído com exit status 0:

- **262 testes em 54 arquivos**, sem falhas, seguidos de ESLint sem avisos. Novas regressões cobrem Reflexos integrado alcançando o topo da escala, preservação de scores/backups antigos e apresentação da correção no perfil.
- **Auditoria completa: zero vulnerabilidades reportadas.** O override instala minimatch 11.0.3 no lugar de 10.2.6. A atualização acrescenta a dependência transitiva `@isaacs/nonrecursive-glob-match`; não atualiza as demais versões diretas.
- **Build aprovado**, 117 módulos. Bundle principal de 232,81 kB minificados / 75,27 kB gzip; módulo 3D de 714,70 kB / 187,52 kB gzip. Permanece o aviso de chunk maior que 500 kB; não foi ocultado.
- **Isolamento real aprovado:** um contexto recebeu um registro oficial de Kiting e uma preferência; outro contexto permaneceu sem patentes e sem essa preferência. Os contextos tinham IDs diferentes e suas páginas desapareceram ao fechar.
- **Smoke aprovado:** navegação, 20 níveis de Esquiva e 30 das demais modalidades, quatro diagnósticos, dez remontagens e três presets. Após sair da cena, zero canvas e RAF retidos. Heap do segundo ao décimo ciclo: aproximadamente 11,81 MB → 12,47 MB, dentro do limite do teste, sem extrapolar para estabilidade durante horas.
- **IndexedDB nativo aprovado:** upgrade bloqueado, migração com preservação de um registro, três adições no backup das quatro modalidades, round trip, conflito preservado, rollback e seis conquistas permanentes.
- **Gameplay aprovado no escopo automatizado:** Kiting confirmou cancelamento, três ataques, abate, Flash, derrota e commit; Precisão completou quatro grupos com cliques nativos e relógio controlado no trecho dos alvos; Reflexos teve 22 respostas corretas, quatro inibições e zero erros de escolha.
- **Esquiva aprovada depois de gameplay no mesmo navegador gerenciado**, com outro contexto: Sobrevivência nível 20, cinco etapas adaptativas, avaliação salva, Normal no nível indicado, movimento, E/dash, F/Flash configurado, câmera livre, recenter, revisão e perfil com somente a modalidade daquele contexto. A expectativa `1/4` passou sem apagar progresso de outros contextos.
- **Preview de produção aprovado:** versão rc.15, modelos 3D carregados sem erro detectado e zero canvas após voltar ao menu.
- O runner encerrou os processos que iniciou e removeu seu diretório temporário. Logs e capturas desta execução ficam em `artifacts/qa/1793452846399/` na máquina de desenvolvimento, ignorados pelo Git; a ausência desses arquivos em um clone não invalida os comandos reproduzíveis.

**Tela cheia ficou explicitamente NÃO VERIFICADA no headless.** O sandbox interno do Chrome foi desativado somente pela opção explícita na máquina de nuvem isolada. Não foram medidos FPS em hardware físico, latência percebida, precisão física de DPI ou áudio, nem executados testes manuais no Windows. CI/Pages remoto e publicação do ambiente não foram executados.

Instalação limpa final com `npm ci --cache /workspace/.cache/npm --no-fund`: **151 pacotes instalados**, exit status 0. Versões de `package.json`, lockfile e aplicação consistentes; `npm ls minimatch` confirma 11.0.3 nos dois consumidores. Nenhum link local quebrado foi encontrado nos documentos atuais.


## Experiência de Esquiva — 1.0.0-rc.16 — 31/10/2026

Alterações: [DODGE_EXPERIENCE_RC16.md](DODGE_EXPERIENCE_RC16.md). Mesmos Node 24.19.0/npm 11.9.0 e Chromium 154 em Linux, no checkout `/workspace/Dead-or-Dodge`.

Executado `QA_NO_SANDBOX=1 npm run check` com o código estabilizado: **exit status 0**, **273 testes em 58 arquivos**, lint sem avisos e auditoria completa com **zero vulnerabilidades reportadas**. Build aprovado com 121 módulos; bundle principal de 241,45 kB minificados / 78,65 kB gzip e módulo 3D de 715,25 kB / 187,76 kB gzip. O aviso de chunk maior que 500 kB continua explícito.

Sete suítes reais de navegador passaram:

- Isolamento de preferências e progresso oficial entre contextos, com descarte das páginas.
- Tutorial de Esquiva em 1366×768: clique direito, Flash configurado em F, dash em E, input ignorado na pausa, impacto real da área, repetição e saída bem-sucedida. Perfil permaneceu com quatro modalidades sem patente e sem avaliação salva. Capturas confirmaram a conclusão sem efeito antigo congelado.
- Navegação, presets gráficos e dez remontagens da cena, sem canvas ou RAF retidos no menu.
- IndexedDB nativo, migração, backup, conflitos, rollback e conquistas.
- Kiting, Precisão e Reflexos nos cenários já registrados na rc.15; os sete testes de navegador são suítes, não uma contagem de partidas humanas.
- Esquiva oficial depois de gameplay, incluindo avaliação adaptativa, nível indicado, mobilidade, câmera, presença de orientação no resultado, abertura e busca na revisão e perfil. A nova interface preservou ações visíveis no resultado em 1920×1080.
- Preview do build de produção: rc.16, modelos carregados e cena descartada ao retornar ao menu.

As novas regressões unitárias também verificam o último frame sincronizado na conclusão, pausa e descarte do tutorial, import de cena tardio, preservação de preferências e ausência de gravação oficial. O feedback foi testado para as nove habilidades, amostra curta, ameaças pendentes/contatos ignorados e contagens de impacto desconhecidas ou contraditórias.

Evidências da execução final: `artifacts/qa/1793454517647/` na máquina de desenvolvimento; o diretório é ignorado pelo Git. Uma execução anterior foi interrompida porque uma edição do renderizador provocou reload do Vite durante um teste. Essa execução não foi tratada como aprovação; a bateria completa acima foi repetida com os fontes estabilizados.

Comparação com a rc.15 confirmou **47 arquivos idênticos byte a byte** nas regras oficiais selecionadas, movimento, módulos de persistência/progressão e assets. Os únicos campos alterados no lockfile foram os de versão da aplicação; não houve atualização de dependências nesta revisão.

Tela cheia ficou explicitamente **NÃO VERIFICADA** no headless. Não foram executados testes manuais em Windows, benchmark de FPS/latência física, calibração com jogadores, CI remoto ou publicação. A checagem visual das capturas ajuda a revisar layout; não substitui o uso no equipamento do jogador.


## Séries reproduzíveis — 1.0.0-rc.17 — 31/10/2026

Alterações e limites do calendário: [DODGE_SERIES_RC17.md](DODGE_SERIES_RC17.md).

`QA_NO_SANDBOX=1 npm run check` concluiu com **exit status 0** no checkout `/workspace/Dead-or-Dodge`: Node 24.19.0/npm 11.9.0, Chromium 154 em Linux. **285 testes em 62 arquivos**, lint sem avisos, auditoria completa com **zero vulnerabilidades reportadas** e oito suítes de navegador aprovadas.

Novas verificações executadas:

- Códigos canônicos, semente zero, rejeição de versões/desafios inválidos e calendário imutável. Para os três temas, os 19 lançamentos mantiveram horários, variantes, origens e direções com passos de 0,1 s, 0,05 s e 1/60 s, com jogadores em posições diferentes. O teste compara os lançamentos, não promete igualdade de resultados físicos em todos os equipamentos.
- Colisão real gerou tentativas elegíveis de derrota e conclusão nos testes de registros. Validação recusou contexto, contagens, tempo, resultado e janelas contraditórios.
- Séries ficaram fora da progressão e da classificação oficial. Histórico filtrou o código exato, deduplicou IDs e manteve 20 recentes. Retry de gravação reutilizou a mesma identidade; abandono não gravou resultado.
- `browser-series` em 1366×768 repetiu `dd1-linha-1A2B3C4D` duas vezes e exibiu duas linhas de comparação com IDs distintos. Pausa congelou o tempo. Um registro oficial previamente inserido e a patente do perfil permaneceram iguais. O menu permitiu retomar o código salvo.
- O mesmo teste exportou um backup com um registro oficial e duas séries e importou em um banco temporário de IndexedDB: três adições na primeira importação, zero na repetição e três registros restaurados. O banco temporário foi fechado e removido. Abandonar uma nova série deixou o total de tentativas salvas em duas.
- Adicionalmente, um backup foi gerado pelos fontes originais da rc.14 preservados na inspeção. A rc.17 aceitou o arquivo e o reexportou com conteúdo serializado idêntico.

As sete suítes anteriores continuaram aprovadas: isolamento, tutorial, navegação/remontagens/presets, IndexedDB nativo, gameplay de Kiting/Precisão/Reflexos, Esquiva oficial e produção. O smoke de produção também abriu o hub das séries, iniciou uma série no build compilado e voltou ao menu sem canvas retido.

Build: 127 módulos; bundle principal de 258,61 kB minificados / 83,78 kB gzip; módulo 3D de 715,25 kB / 187,76 kB gzip. O aviso de chunk maior que 500 kB permanece. Logs e capturas locais: `artifacts/qa/1793457407157/`, ignorado pelo Git.

Backups anteriores continuam aceitos. Backups com séries precisam de rc.17 ou posterior, pois as versões anteriores não conhecem a categoria adicional. Não houve alteração da versão 2 do banco, exclusão de registros ou mudança nas fórmulas de patente oficial.

Tela cheia ficou explicitamente **NÃO VERIFICADA** no headless. Não foram medidos FPS/latência em hardware real ou transferência de habilidade para o LoL. Pressão, conforto e adequação dos cenários exigem calibração humana. CI remoto, publicação e integração ao client não foram executados.

Instalação limpa final da rc.17: `npm ci --cache /workspace/.cache/npm --no-fund` concluiu com exit status 0 e 151 pacotes. Dependências fixadas permaneceram iguais às da rc.16.
