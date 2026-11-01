# Checklist — 1.0.0-rc.22

Resultados locais de 01/11/2026, Node 24.19.0/npm 11.9.0 e Chromium 154 em Linux. A [checklist anterior](history/RELEASE_CHECKLIST-RC1.md) é histórica. Evidência e limites estão em [VALIDATION.md](VALIDATION.md).

| Critério | Estado | Evidência/limite |
| --- | --- | --- |
| Instalação pelo lockfile | PASSOU | Instalação limpa da rc.17: 151 pacotes; dependências preservadas na rc.22, metadados de versão sincronizados no lockfile |
| Testes automatizados | PASSOU | 355 testes, 75 arquivos; inclui comparação exportável, respostas por rodada, resize real, resumo selecionável e projeção/prioridade/separação dos rótulos de origem |
| Lint | PASSOU | ESLint sem avisos, usando minimatch corrigido |
| Build | PASSOU COM AVISO | Chunk 3D de 732,09 kB minificados; carregado sob demanda |
| Auditoria completa | PASSOU | Zero vulnerabilidades reportadas na consulta |
| Isolamento de QA | PASSOU | localStorage e progresso oficial não vazam entre contextos; páginas descartadas |
| IndexedDB nativo | PASSOU | Migração, conflito, idempotência, rollback e conquistas |
| Navegação e remontagens | PASSOU | Dez ciclos; presets e verificações de layout |
| Gameplay automatizado | PASSOU NO ESCOPO | Kiting, Precisão e Reflexos; tela cheia explicitamente excluída |
| Séries reproduzíveis | PASSOU | Mesmo código em duas tentativas, pausa, comparação, retomada, abandono, perfil e registro oficial preservados |
| Protótipo RIFT LAB | PASSOU NO ESCOPO | Cinco famílias nos quatro presets, jornada opcional, entrada livre no Normal, resultado e revisão focados; dados anteriores preservados |
| Impactos e objetivos focados | PASSOU NO ESCOPO | Sinal de impacto real, última amostra, objetivo de 30 s/oito esquivas e comparação de duas rodadas; revisão expandida com reprodução em 0,5× |
| Verificação de fluidez | PASSOU NO ESCOPO | Relógio natural, Leve/Ultra, seis comandos, pausa, comparação, exportação explícita, preferência e registro oficial preservados; hardware físico pendente |
| Compartilhamento local | PASSOU | JSON individual/comparação, respostas por rodada e resumo selecionável; nenhum envio automático |
| Origens de habilidades | PASSOU NO ESCOPO | Quatro rótulos reutilizáveis, prioridade/separação/projeção e integração nos quatro presets; não prevê acertos |
| Apresentação do Duelista | INSPECIONADA | Base KayKit adaptada, runas, capa e espada estética; aceitação artística comercial permanece pendente |
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
| CI/Pages remoto | PÓS-PUSH | Ambos executam npm run check; consulte a execução vinculada ao commit em [Actions](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions). A rc.21 anterior teve CI/Pages aprovados e os assets públicos conferidos; isso não substitui a validação da rc.22 |
| Publicação/restauração do ambiente | NÃO VERIFICADO | Não faz parte desta alteração de código |

Decisão: manter **release candidate**. A experiência de Esquiva e as regressões anteriores passaram nos checks locais; não há certificação de versão final nem alegação de integração com o client do LoL.
