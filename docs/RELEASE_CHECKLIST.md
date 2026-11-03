# Checklist — 1.0.0-rc.24

Resultados locais de 02/11/2026, Node 24.19.0/npm 11.9.0 e Chromium 154 em Linux. A [checklist anterior](history/RELEASE_CHECKLIST-RC1.md) é histórica. Evidência e limites estão em [VALIDATION.md](VALIDATION.md).

| Critério | Estado | Evidência/limite |
| --- | --- | --- |
| Instalação pelo lockfile | PASSOU | 151 pacotes instalados no onboarding; dependências preservadas na rc.24, metadados de versão sincronizados no lockfile |
| Testes automatizados | PASSOU | 364 testes, 77 arquivos; inclui mistura real de clipes, fase preservada, repouso de pesos residuais, pose física, descarte e esqueleto congelado na pausa/redução de movimento |
| Lint | PASSOU | ESLint sem avisos, usando minimatch corrigido |
| Build | PASSOU COM AVISO | Chunk 3D de 733,88 kB minificados; carregado sob demanda |
| Auditoria completa | PASSOU | Zero vulnerabilidades reportadas na consulta |
| Isolamento de QA | PASSOU | localStorage e progresso oficial não vazam entre contextos; páginas descartadas |
| IndexedDB nativo | PASSOU | Migração, conflito, idempotência, rollback e conquistas |
| Navegação e remontagens | PASSOU | Dez ciclos; presets e verificações de layout |
| Central de treino | PASSOU | Quatro focos por teclado nativo, três etapas opcionais, IndexedDB real preservado, retomada sem início automático, layout com texto ampliado em 390/1366/1920 pixels |
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
| Contexto de Kiting | PASSOU | Histórico e evolução filtrados, recordes separados, derrota real com comandos registrados e backup de três registros |
| Backup com séries | PASSOU | Mesclagem idempotente de três registros em IndexedDB real; backup original rc.14 reexportado sem alteração |
| Tutorial interativo | PASSOU | Movimento e teclas reais, pausa, colisão e repetição; perfil sem resultados oficiais |
| Esquiva após gameplay | PASSOU | Avaliação adaptativa opcional, escolha livre em Sobrevivência e Normal, mobilidade, feedback, revisão e perfil |
| Build servido pelo preview | PASSOU | Versão correta, modelos e início de série carregados; cena descartada ao sair |
| Encerramento do runner | PASSOU | Processos próprios encerrados e diretório temporário removido |
| Tela cheia interativa | NÃO VERIFICADO | Exige execução com interface e aceitação manual |
| Windows/Chrome/Edge e hardware real | NÃO VERIFICADO | Roteiro em QA.md |
| Calibração com jogadores | NÃO VERIFICADO | Escala interna, sem equivalência comprovada ao elo do LoL |
| CI/Pages remoto | CONSULTAR ACTIONS | Ambos executam npm run check após o push; consulte a execução vinculada ao commit da rc.24 em [Actions](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions). A aprovação local não substitui o resultado remoto nem a conferência do site publicado |
| Publicação/restauração do ambiente | NÃO VERIFICADO | Não faz parte desta alteração de código |

Decisão: manter **release candidate**. A experiência de Esquiva e as regressões anteriores passaram nos checks locais; não há certificação de versão final nem alegação de integração com o client do LoL.
