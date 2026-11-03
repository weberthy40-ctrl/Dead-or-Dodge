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

## Comandos de Kiting — 1.0.0-rc.18 — 31/10/2026

Execução final de `QA_NO_SANDBOX=1 npm run check`: **exit status 0**. Node 24.19.0, npm 11.9.0, Chromium 154 e Linux. Logs e capturas locais em `artifacts/qa/1793463571438/`, ignorados pelo Git; relatório consolidado preservado no ambiente em `/workspace/project-review-evidence/rc18-full-check5.log`.

- **297 testes em 63 arquivos**, ESLint sem avisos e auditoria completa com **zero vulnerabilidades**.
- **Nove suítes de navegador aprovadas**, incluindo a nova `browser-kiting-controls`; as oito suítes anteriores permaneceram aprovadas.
- Clique direto, A + clique e A imediato receberam entrada nativa de teclado/mouse. Foram verificados um ataque por ordem, ausência de fila durante recuperação, descarte da confirmação na pausa e seleção bloqueada durante a rodada.
- A preferência sobreviveu ao recarregamento real. Uma derrota no nível 10 foi salva com `quick-attack` tanto nas métricas quanto na pontuação.
- IndexedDB nativo filtrou leitura paginada e varredura por comandos. A interface exibiu histórico e evolução filtrados e dois recordes separados para o mesmo exercício/nível com comandos diferentes.
- Um registro sem os campos novos permaneceu serializado de forma idêntica após salvar, exportar e mesclar o backup em outro banco. O backup do cenário continha três tentativas, incluindo a derrota real.
- Testes de movimento/simulação verificaram aproximação para um único disparo, cancelamento de ordens, foco/modificadores, compatibilidade das preferências, validação de metadados e separação das amostras de três sessões.
- Capturas dos três comandos foram inspecionadas. A indicação das fases foi posicionada acima da barra de ataque, sem ficar sob os controles.
- O build compilado exibiu `1.0.0-rc.18`, carregou a arena e as três opções de Kiting, iniciou uma série de Esquiva e descartou a cena ao voltar.

As fronteiras de preparação/recuperação no teste novo usam relógio de simulação controlado para que a duração de uma chamada do DevTools não faça a recarga terminar antes da próxima entrada. A derrota, o recarregamento e o salvamento usam tempo normal. Isso não mede latência percebida, FPS em GPU física ou habilidade humana. Tela cheia interativa, Windows/Chrome/Edge e calibração com jogadores continuam pendentes.

O chunk 3D permanece sob demanda, com aviso de tamanho: **717,09 kB minificados**. Dependências e fórmulas de nota/patente foram preservadas. Preferências v1 e IndexedDB v2 continuam compatíveis, com metadados opcionais de comandos; não houve apagamento ou regravação do histórico anterior.

A checagem do cabeçalho de Esquiva é feita na mesma observação que confirma a sessão ativa. Entradas e capturas podem deixar a sessão avançar; verificar a aparência de partida ativa depois dessas operações produzia uma falha intermitente no GitHub quando a sessão já não estava naquele estado. A condição visual foi preservada e posicionada antes da sequência de mobilidade. O roteiro nativo de Esquiva foi repetido isoladamente e passou, com ESLint sem avisos.

## RIFT LAB — protótipo vertical — 1.0.0-rc.19 — 31/10/2026

Execução final de `QA_NO_SANDBOX=1 npm run check`: **exit status 0**, com **313 testes em 65 arquivos**, ESLint sem avisos, auditoria com **zero vulnerabilidades**, build e **dez suítes de navegador aprovadas**. Node 24.19.0/npm 11.9.0 e Chromium 154 em Linux. Artefatos locais: `artifacts/qa/1793473138598/`; relatório consolidado no ambiente: `/workspace/project-review-evidence/rc19-final-check.log`.

A suíte `browser-rift` verificou:

- Nome público RIFT LAB, entrada da jornada, quatro etapas, preparação com teclas/preferências e cinco famílias disponíveis. O layout de preparação também ficou sem overflow em 390×844; gameplay continua destinado a computador.
- Normal no nível 20 aberto sem avaliação e sem escrever uma recomendação falsa. A avaliação adaptativa independente e o Normal indicado continuaram aprovados em `browser-dodge`.
- Exercícios de projétil linear, lança, gancho, feixe e área, com capturas nos quatro presets: Leve, Médio, Alto e Ultra. Materiais/avisos foram inspecionados; as runas do personagem foram reposicionadas para permanecer sobre a armadura.
- Resultado e revisão de um exercício focado, incluindo deslocamento por Flash para sair da primeira área. Não houve resultado oficial ou de séries salvo por esses exercícios.
- Um registro de Kiting preexistente permaneceu serializado de forma idêntica. A patente exibida permaneceu igual e nenhuma avaliação foi criada.

Os testes unitários adicionais verificaram colisões reais nas cinco práticas, pausa, descarte e inelegibilidade para registro oficial; arquitetura arcana fora da área jogável; contornos essenciais nos quatro presets sem mutar os dados dos ataques; jornada guiada levando à preparação; escolha livre preservando recomendação; equipamento do Duelista em malha animada real; e limite de sinais/vozes e mute do áudio adaptativo.

As demais suítes passaram: isolamento, tutorial, séries reproduzíveis, comandos de Kiting, navegação/remontagens/presets, IndexedDB e backups nativos, combate de Kiting/Precisão/Reflexos, Esquiva e produção. O build servido pelo preview exibiu rc.19, carregou a ilustração original e a preparação, iniciou uma série e descartou a arena ao sair.

As capturas das práticas usam relógio de simulação controlado para reproduzir estados visuais; não constituem medição de FPS ou latência. O áudio tem testes de estado, limites e isolamento, mas a mixagem percebida precisa de escuta em hardware real. Aparência e animação foram inspecionadas em headless; aprovação artística comercial, sensação de controle, Windows/Chrome/Edge, tela cheia interativa e calibração com jogadores continuam pendentes.

O chunk 3D permanece carregado sob demanda, com aviso de tamanho: **722,15 kB minificados**. Não foram adicionadas dependências, serviços pagos, alterações no banco ou migrações destrutivas. A dificuldade, as fórmulas oficiais e os códigos `dd1` foram preservados. O acesso livre ao Normal é uma mudança deliberada da direção de produto; avaliação e tutorial agora são opcionais.

## Impactos e objetivos de prática — 1.0.0-rc.20 — 31/10/2026

Alterações: [IMPACTS_COACHING_RC20.md](IMPACTS_COACHING_RC20.md). A execução final de `QA_NO_SANDBOX=1 npm run check` concluiu com **exit status 0**: **331 testes em 67 arquivos**, ESLint sem avisos, auditoria completa com **zero vulnerabilidades**, build e **dez suítes reais de navegador aprovadas**. Node 24.19.0/npm 11.9.0, Chromium 154 e Linux. Logs e capturas locais: `artifacts/qa/1793490593758/`; relatório consolidado no ambiente: `/workspace/project-review-evidence/rc20-final-check3.log`. Esses artefatos são ignorados pelo Git.

Novas verificações:

- O observador de apresentação manteve a mesma sequência de eventos físicos e os mesmos projéteis da execução sem observação. Foram testados contato contínuo de projétil rápido, feixe removido após colisão, pausa, expiração, eventos de outra tentativa e limite de oito sinais.
- A cena montada com a simulação real mostrou o impacto do feixe em um treino de três vidas e na derrota de uma vida com passos de 33 ms. O último quadro incluiu o impacto mesmo entre amostras regulares. A revisão restaurou e removeu os sinais ao buscar quadros, sem modificar a sessão concluída; malhas de apresentação não receberam raycast.
- As cinco famílias atingiram o objetivo de 30 segundos/oito esquivas em trajetórias simuladas partindo do centro e respeitando a velocidade disponível. Métricas contraditórias, contatos ignorados, ameaças pendentes e derrotas sem conclusão não receberam o objetivo completo. Isso verifica possibilidade técnica, sem calibrar dificuldade humana.
- A interface exibiu objetivo cumprido a partir da telemetria real e não chamou o salvamento oficial. Repetições compararam três medidas com a última rodada; sair e reabrir descartou essa referência.
- O Chromium verificou as cinco famílias nos quatro presets, um acerto real de feixe, o resultado focado, a comparação de duas rodadas e o último marcador de impacto. O painel expandiu para a revisão, a velocidade inicial ficou selecionada em 0,5× e o replay avançou antes de ser pausado. Capturas da revisão e da tabela foram inspecionadas.
- A nova verificação visual revelou dois problemas anteriores: o componente procurava o diálogo antes de seu conteúdo ser anexado, e o valor inicial do seletor não correspondia a nenhuma opção. Ambos foram corrigidos e receberam regressões; a execução final acima contém essas correções.
- O registro oficial preexistente e a patente do perfil permaneceram iguais. Tutorial, séries, comandos de Kiting, navegação/remontagens, IndexedDB/backups, gameplay de Kiting/Precisão/Reflexos e Esquiva oficial continuaram aprovados. O preview compilado exibiu rc.20, carregou os assets e descartou a cena ao sair.

Build: **138 módulos**, bundle principal de **273,96 kB minificados / 88,73 kB gzip** e módulo 3D de **726,81 kB / 192,03 kB gzip**. O aviso de chunk maior que 500 kB permanece explícito; o módulo 3D continua sob demanda. Dependências, colisões, movimento, dificuldade, fórmulas oficiais, persistência/progressão e códigos `dd1` foram preservados. Os novos dados de apresentação e comparação ficam em memória, sem migração do banco ou novos campos de backup.

Os relógios controlados reproduzem estados e entradas; não medem FPS ou latência física. Tela cheia interativa, Windows/Chrome/Edge, mixagem de áudio em hardware, aceitação artística comercial e calibração com jogadores continuam pendentes. O estado remoto de CI e Pages é confirmado após o push na execução vinculada ao commit em [Actions](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions); aprovação local não equivale a deploy concluído.

### Sincronização de QA após a publicação — 01/11/2026

O [Pages do commit 0761f1d](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions/runs/41254697518) passou e publicou a rc.20. O endereço público respondeu HTTP 200, informou rc.20 e serviu JavaScript principal, CSS, módulo 3D e ilustração com hashes SHA-256 idênticos ao build local validado.

A [validação independente](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions/runs/41254697448) falhou na expectativa de câmera livre de `browser-dodge`. O roteiro permitia que o tempo da partida avançasse entre a captura e os comandos de mobilidade, tornando a observação dependente da duração das chamadas do DevTools. O trecho agora controla esse intervalo e verifica sessão ativa, foco no canvas, Y, Espaço e estado do botão de câmera, sem retirar assertions. O tempo normal é restaurado antes de aguardar a derrota e o salvamento; avaliação e Sobrevivência continuam em tempo normal.

Com esse ajuste exclusivo de QA e documentação, `npm run lint` e a repetição isolada de `browser-dodge` no Chromium passaram com exit status 0. Relatório local: `/workspace/project-review-evidence/rc20-dodge-native/suite.log`. Os arquivos de aplicação, dependências e build permaneceram idênticos aos da checagem completa de 331 testes/dez suítes registrada acima. O push seguinte repete os gates completos de CI/Pages para este roteiro revisado.

A [execução seguinte de CI](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions/runs/41255832386) identificou outra condição de prontidão em `browser-kiting-controls`: após a troca de comandos, o atributo `data-visuals` anterior podia ser observado antes de o botão de início ser habilitado. O roteiro passou a aguardar também canvas e botão habilitado, com o mesmo timeout, preservando as assertions de jogo. Lint e repetição isolada dos três comandos, persistência e backup passaram no Chromium, com exit status 0; relatório em `/workspace/project-review-evidence/rc20-kiting-native/suite.log`. A alteração continua restrita a QA/documentação; não modifica o produto publicado.

## Fluidez, controles e leitura — 1.0.0-rc.21 — 01/11/2026

Escopo: [QUALITY_RC21.md](QUALITY_RC21.md). Execução completa de `QA_NO_SANDBOX=1 npm run check`: **exit status 0**, **348 testes em 73 arquivos**, ESLint sem avisos, auditoria com **zero vulnerabilidades**, build e **onze suítes de navegador aprovadas**. Node 24.19.0/npm 11.9.0 e Chromium 154 em Linux. Log no ambiente: `/workspace/project-review-evidence/rc21-final-check.log`; capturas e relatórios locais em `artifacts/qa/1793496389649/`, ignorados pelo Git.

Evidências novas:

- O coletor reproduziu 60 FPS conhecidos, manteve travamentos de dois segundos, excluiu intervalos de pausa e rejeitou timestamps inválidos/antigos. Quantis têm histograma limitado, resolução de 0,25 ms e limite superior sinalizado; a conclusão congela os dados. Não utiliza um array de tamanho crescente por quadro.
- O roteiro de 24 lançamentos manteve famílias, posições e direções com passos de 0,05 s e 1/60 s e trajetórias diferentes do jogador. A pausa congelou o cenário. Não houve evento de dano oficial, acesso a repositório ou mecanismo de vidas.
- Nos quatro presets, os vértices das marcas de preparação ficaram dentro do raio/corredor real das cinco famílias. A sincronização não mudou snapshots nem introduziu alvos de raycast. Redução de movimento mantém a apresentação estática.
- O modelo real continuou na posição e orientação de mundo impostas ao correr, parar, virar, usar dash e pausar. Ações de animação passaram a ser criadas ao usar: uma na inicialização, duas após alternar entre corrida e espera, com os quatro clipes preservados. Não foi inferido ganho percentual de FPS a partir dessa redução de alocações.
- A interface comparou presets em memória sem alterar a preferência salva, excluiu uma pausa de dez segundos da medição, registrou redimensionamento durante pausa e recusou um relatório válido após erro de WebGL. Importação tardia foi descartada ao sair. O observador de comandos registrou só ações aceitas e não criou outro loop de animação.
- `browser-quality` usou relógio natural e entradas nativas em Leve e Ultra, registrou os seis comandos, conferiu pausa, duas linhas de comparação e download explícito. O JSON identificou qualidade e contexto corretos. Preferência e registro oficial preexistentes permaneceram serializados de forma idêntica; não houve avaliação nova. Cancelar outra verificação deixou zero canvas no menu.
- `browser-rift` preservou cinco famílias/quatro presets, jornada, Normal livre e revisão. Também respondeu e exportou o formulário opcional como **fixture automatizada**, verificando família, objetivo e respostas; isso não representa relato de uma pessoa. Capturas do formulário, marcas de área, tela inicial da verificação e comparação foram inspecionadas.
- As dez suítes anteriores continuaram aprovadas: isolamento, tutorial, séries, comandos de Kiting, RIFT LAB, navegação/remontagens, IndexedDB/backups, combate, Esquiva oficial e produção. O preview compilado exibiu rc.21, abriu a verificação com quatro opções, iniciou e descartou a cena e executou as verificações anteriores de assets e modalidades.

Build: bundle principal de **285,90 kB minificados / 93,57 kB gzip**, CSS de **39,18 kB / 10,12 kB gzip** e módulo 3D sob demanda de **729,56 kB / 193,01 kB gzip**. O aviso de chunk maior que 500 kB permanece. O lockfile muda apenas a versão da aplicação; não há dependências novas. Comparação de fontes confirmou persistência, progressão, movimento, dificuldade, regras de modos, projéteis e geometria/colisões oficiais intactos.

O relatório natural de headless contém medidas observadas nesse ambiente de software, **sem homologação de GPU física ou latência de entrada**. O proprietário informou que ainda não havia testado a versão anterior; portanto não se reivindica calibração humana. A meta de 30 segundos/oito esquivas foi mantida, e os formulários são instrumentos para coletar relatos futuros. Windows/Chrome/Edge, tela cheia interativa, sensação dos controles, estabilidade prolongada, áudio e aceitação artística comercial continuam pendentes. CI/Pages do commit entregue são conferidos após o push em [Actions](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions), sem confundir aprovação local com publicação concluída.

## Compartilhamento e origens — 1.0.0-rc.22 — 01/11/2026

Escopo: [SHARING_ALERTS_RC22.md](SHARING_ALERTS_RC22.md). A execução completa de `QA_NO_SANDBOX=1 npm run check` terminou com **exit status 0**: **355 testes em 75 arquivos**, ESLint sem avisos, auditoria com **zero vulnerabilidades**, build e **onze suítes de navegador aprovadas**. Ambiente: Node 24.19.0/npm 11.9.0, Chromium 154 e Linux. Log local: `/workspace/project-review-evidence/rc22-final-check.log`; capturas e relatórios em `artifacts/qa/1793501909130/`, ignorados pelo Git.

- A comparação exportada reteve até oito relatórios completos em uma cópia independente, com as respostas próprias de cada rodada. Janela alterada e amostra curta receberam contexto sem ocultar os números; p95 limitado continuou sinalizado com ≥.
- A interface preservou as respostas ao repetir, iniciou a próxima rodada sem respostas e gerou um resumo somente de leitura com seleção completa. Alterações reais da janela durante pausa foram registradas; eventos de resize sem mudança e dimensões escolhidas antes do início não produziram aviso falso. Preferências e registros oficiais permaneceram iguais.
- `browser-quality`, com relógio natural e entradas nativas em Leve/Ultra, verificou exportação individual, comparação de duas rodadas, respostas distintas e foco/seleção do resumo. A captura do resumo foi inspecionada. Nenhuma área de transferência, transmissão automática ou persistência adicional foi utilizada.
- Os rótulos de origem tiveram prioridade por preparação mais próxima da ativação, limite de quatro, separação, projeção atrás da câmera, ordem determinística e descarte verificados. A integração nos quatro presets manteve os contornos do feixe e os snapshots físicos inalterados. O DOM reutilizou quatro rótulos e preservou a identificação das outras habilidades.
- `browser-rift` exibiu o rótulo de área na preparação. A captura no preset Médio foi inspecionada: texto em pé, indicação de direção e contorno central legíveis. Jornada, cinco famílias/quatro presets, Normal livre, resultado e revisão continuaram aprovados.
- As suítes de isolamento, tutorial, séries, comandos de Kiting, navegação/remontagens, IndexedDB/backups, combate, Esquiva oficial e produção também passaram. O preview compilado exibiu rc.22, carregou os assets e descartou a cena ao sair.

Build: **146 módulos**, bundle principal de **288,55 kB minificados / 94,55 kB gzip**, CSS de **40,31 kB / 10,36 kB gzip** e módulo 3D sob demanda de **732,09 kB / 194,04 kB gzip**. O aviso de chunk maior que 500 kB permanece. Dependências, coletor de cadência, movimento, colisões, dificuldade, metas, pontuação, progressão e persistência oficial foram preservados.

As respostas dos testes são fixtures automatizadas; não representam avaliação de uma pessoa. Nenhum relatório, captura ou resposta recebida de jogador foi incorporado ao repositório. A leitura de cadência não certifica latência física, equivalência entre presets ou estabilidade prolongada. Os rótulos indicam origem e preparação, sem prever acerto ou dano. Calibração com jogadores, hardware físico, Windows/Chrome/Edge, tela cheia interativa, áudio e aceitação artística comercial continuam pendentes. O resultado remoto e o site são verificados após o push na execução vinculada ao commit em [Actions](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions).

## Central de treino — 1.0.0-rc.23 — 02/11/2026

Ambiente: Node 24.19.0, npm 11.9.0, Chromium 154, Linux isolado. `QA_NO_SANDBOX=1 npm run check`: **PASSOU**, exit status 0. Foram executados **361 testes em 76 arquivos**, lint sem avisos, auditoria com **zero vulnerabilidades**, build e as **onze suítes de navegador**. Artefatos locais desta execução: `artifacts/qa/1793668620110/` (ignorado pelo Git).

- A central oferece os quatro focos e três etapas opcionais por modalidade. Esquiva usa a recomendação salva no Normal; as demais usam o último nível oficial consultado ou nível 1.
- Seis novos testes verificam rotas, seleção, preservação da recomendação, retomada de Normal/Sobrevivência, rejeição de contexto inválido, falha parcial, nova consulta e descarte de respostas tardias. O teste da mensagem inicial foi atualizado porque o texto de apresentação mudou intencionalmente.
- O smoke de menus foi executado isoladamente e passou. Na bateria completa, o smoke repetiu a seleção com tecla Espaço nativa, salvou uma fixture de Kiting no IndexedDB real, abriu a preparação do nível 7 sem iniciar a sessão e confirmou que o registro e a quantidade de tentativas não foram alterados pela central.
- Layout sem overflow em 390, 1366 e 1920 pixels, nos quatro focos, incluindo texto ampliado e alto contraste. A captura desktop da central e a captura estreita foram inspecionadas. A largura estreita valida menus, sem estender o suporte de gameplay a dispositivos móveis.
- Isolamento, tutorial, séries, três comandos de Kiting, cinco famílias/quatro presets, revisão, fluidez/exportações, dez remontagens, armazenamento, combate e Esquiva oficial passaram. O preview de produção exibiu **1.0.0-rc.23**, carregou os modelos e descartou as cenas.

A consulta da central é somente leitura. Não há mudanças em schema, preferências, backup, pontuação, colisões, tempos de habilidades ou dificuldade. O aviso do módulo 3D acima de 500 kB permanece; ele continua carregado sob demanda. Tela cheia interativa, Windows/Chrome/Edge, GPU física, calibração com jogadores e aceitação artística comercial permanecem pendentes. CI e Pages são acompanhados após o push na execução correspondente ao commit em [Actions](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions).
