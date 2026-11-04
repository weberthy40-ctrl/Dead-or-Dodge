# Checklist — 1.0.0-rc.28

Resultados locais da sessão de 03/11/2026, Node 24.19.0/npm 11.9.0 e Chromium 154 em Linux. A bateria local foi interrompida por reinício do ambiente após os testes unitários e seis suítes; os fluxos novos, o combate e a produção passaram isoladamente. Os critérios marcados CONSULTAR CI dependem da execução integral remota do próprio commit, também exigida antes do deploy. A [checklist anterior](history/RELEASE_CHECKLIST-RC1.md) é histórica. Evidência e limites estão em [VALIDATION.md](VALIDATION.md).

| Critério | Estado | Evidência/limite |
| --- | --- | --- |
| Instalação pelo lockfile | PASSOU | 151 pacotes instalados no onboarding; dependências preservadas na rc.28, metadados de versão sincronizados no lockfile |
| Testes automatizados | PASSOU | 403 testes, 86 arquivos; inclui preparação explícita, botões reutilizados, Tab/ESC, foco, pausa na contagem, descarte e práticas com tempo decorrido após um minuto |
| Lint | PASSOU | ESLint sem avisos, usando minimatch corrigido |
| Build | PASSOU COM AVISO | Chunk 3D de 737,07 kB minificados; carregado sob demanda |
| Auditoria completa | PASSOU | Zero vulnerabilidades reportadas na consulta |
| Isolamento de QA | PASSOU | localStorage e progresso oficial não vazam entre contextos; páginas descartadas |
| IndexedDB nativo | CONSULTAR CI | Migração, conflito, idempotência, rollback e conquistas na suíte remota; dados preservados nos fluxos isolados. |
| Navegação e remontagens | CONSULTAR CI | Dez ciclos, presets e layout na suíte remota; oito fluxos novos aprovados isoladamente. |
| Central de treino | CONSULTAR CI | Retomada e consultas unitárias aprovadas; matriz completa e fixture no roteiro remoto. |
| Gameplay automatizado | PASSOU NO ESCOPO | Kiting, Precisão e Reflexos; tela cheia explicitamente excluída |
| Séries reproduzíveis | PASSOU | Mesmo código em duas tentativas, pausa, comparação, retomada, abandono, perfil e registro oficial preservados |
| Protótipo RIFT LAB | PASSOU NO ESCOPO | Cinco famílias nos quatro presets, jornada opcional, entrada livre no Normal, resultado e revisão focados; dados anteriores preservados |
| Impactos e objetivos focados | PASSOU NO ESCOPO | Sinal de impacto real, última amostra, objetivo de 30 s/oito esquivas e comparação de duas rodadas; revisão expandida com reprodução em 0,5× |
| Verificação de fluidez | PASSOU NO ESCOPO | Relógio natural, Leve/Ultra, seis comandos, pausa, comparação, exportação explícita, preferência e registro oficial preservados; hardware físico pendente |
| Compartilhamento local | PASSOU | JSON individual/comparação, respostas por rodada e resumo selecionável; nenhum envio automático |
| Origens de habilidades | PASSOU NO ESCOPO | Quatro rótulos reutilizáveis, prioridade/separação/projeção e integração nos quatro presets; não prevê acertos |
| Apresentação do Duelista | PASSOU NO ESCOPO | Base KayKit adaptada, silhueta mais clara, anel e orientação; capturas antes/depois nos quatro presets sem erros de shader; aceitação artística comercial permanece pendente |
| Transições do Duelista | PASSOU NO ESCOPO | Mistura Idle/Running_A com fase contínua, repouso residual encerrado e inclinação do dash mais rápida; posição, orientação de mundo e comandos físicos preservados |
| Áudio adaptativo | PASSOU NO ESCOPO | Cues originais, pressão, limite de quatro vozes e preparações espaçadas; mixagem em hardware exige teste manual |
| Comandos de Kiting | PASSOU | Três opções com teclado/mouse nativos, uma ordem por ataque, ausência de fila, pausa e preferência |
| Leitura de Kiting | PASSOU | Seleção separada de ataque inimigo, alcance com texto, fases e recuperação de cancelamento; indicação de movimento desde a confirmação nos três comandos |
| Orientação de Kiting | PASSOU | Causas observadas, amostra curta, prática sem nota e métricas expansíveis; cancelamento real salvo no IndexedDB sem incluir detalhes transitórios no registro |
| Leitura de Precisão | PASSOU | Próximo alvo com marca interna, atraso com símbolo, instrução contínua e mensagens por evento; marcas dentro da esfera, sem raycast |
| Resultado de Precisão | PASSOU | Cliques nativos fora/ordem, quatro grupos, nota preservada, salvamento em IndexedDB sem metadata transitória, ações visíveis e repetição zerada |
| Leitura de Reflexos | PASSOU | Comando, lado do mouse e freio legíveis; espera/pausa ocultam a ação, seis resultados explicados e instruções de pausa separadas |
| Resultado de Reflexos | PASSOU | 22 acertos técnicos, minuto oficial natural com quatro erros isolados, nota anterior, IndexedDB, pausa, foco, revisão e repetição; casos não pontuáveis não salvam |
| Preparação nas quatro modalidades | PASSOU ISOLADAMENTE | Foco, condições e comandos; opções acessíveis, botão real e início por teclado em duas resoluções |
| Pausa e foco | PASSOU ISOLADAMENTE | Oito fluxos, Tab/ESC, tempo congelado, foco restaurado, blur/focus simulado, saída sem registro e preferências preservadas |
| Contexto de Kiting | PASSOU | Histórico e evolução filtrados, recordes separados, derrota real com comandos registrados e backup de três registros |
| Backup com séries | PASSOU | Mesclagem idempotente de três registros em IndexedDB real; backup original rc.14 reexportado sem alteração |
| Tutorial interativo | PASSOU | Movimento e teclas reais, pausa, colisão e repetição; perfil sem resultados oficiais |
| Esquiva após gameplay | CONSULTAR CI | Avaliação, Sobrevivência, Normal e mobilidade exigidos na execução remota após combate. |
| Build servido pelo preview | PASSOU ISOLADAMENTE | rc.28, assets, série, Precisão/Reflexos e quatro fluxos de preparação/pausa/saída aprovados isoladamente no preview compilado |
| Encerramento do runner | CONSULTAR CI | O processo local foi encerrado pelo reinício do ambiente; a limpeza normal é conferida no runner remoto. |
| Tela cheia interativa | NÃO VERIFICADO | Exige execução com interface e aceitação manual |
| Windows/Chrome/Edge e hardware real | NÃO VERIFICADO | Roteiro em QA.md |
| Calibração com jogadores | NÃO VERIFICADO | Escala interna, sem equivalência comprovada ao elo do LoL |
| CI/Pages remoto | CONSULTAR ACTIONS | Ambos executam npm run check após o push; consulte a execução vinculada ao commit da rc.28 em [Actions](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions). A aprovação local não substitui o resultado remoto nem a conferência do site publicado |
| Publicação/restauração do ambiente | NÃO VERIFICADO | Não faz parte desta alteração de código |

Decisão: manter **release candidate**. A experiência de Esquiva e as regressões anteriores passaram nos checks locais; não há certificação de versão final nem alegação de integração com o client do LoL.
