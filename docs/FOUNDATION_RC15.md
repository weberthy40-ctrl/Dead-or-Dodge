# Base corrigida — 1.0.0-rc.15

Esta revisão trata os problemas reproduzidos na inspeção do ZIP. Preserva as quatro modalidades e o gameplay da rc.14; melhorias de tutorial, arena, controles e feedback são próximas etapas de produto.

## Classificação de Reflexos

O modo integrado atual recebia um fator 0,7 destinado aos exercícios auxiliares, enquanto o misto antigo recebia 1. Isso limitava o integrado a 7.000 pontos. Agora ambos os desafios completos recebem fator 1; variantes auxiliares mantêm 0,7. A versão da classificação passa a `trainer-rating-v2`.

Não foi mudado o score 0–100 dos treinos, nem o formato do registro ou do backup. O cálculo do perfil e dos pontos exibidos ao consultar tentativas usa a correção, inclusive para treinos integrados antigos. A explicação do perfil informa a mudança. Testes verificam topo da escala, preservação das notas e round trip de backup.

## Dependências

O `minimatch` transitivo da cadeia ESLint foi fixado em `11.0.3` por override do npm. Os consumidores ainda declaram a série 10; o override é uma exceção explícita para corrigir o advisory `GHSA-g3hv-75wg-m249`. É compatível com o Node 24 exigido pelo projeto; lint e validação precisam continuar aprovados. Remover a exceção quando os consumidores adotarem uma versão corrigida. Não foi usado `npm audit fix --force`, downgrade de ESLint ou desativação de verificação.

## QA e publicação

Cada chamada de `openBrowserPage` cria um browser context descartável com localStorage e IndexedDB isolados; o fechamento ou a desconexão do controlador descarta o contexto. O novo teste de isolamento salva um registro oficial, verifica outro contexto vazio e confirma que as páginas foram removidas.

`npm run check` unifica testes unitários, lint, auditoria e `test:e2e`. O runner inicia e encerra os processos, usa portas livres, mantém logs e executa gameplay antes de Esquiva. Também verifica o build servido pelo preview. CI e Pages usam esse mesmo comando; falhas impedem a publicação naquele workflow.

Tela cheia não é aprovada pelo headless. O runner comunica a exclusão; a validação com interface e o roteiro manual são separados. O `--no-sandbox` do Chromium só é ativado por opção explícita no ambiente isolado.

## Documentação

[CURRENT_SCOPE.md](CURRENT_SCOPE.md) centraliza as regras atuais. [QA.md](QA.md) e [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) foram atualizados; os documentos anteriores foram preservados em `docs/history`. O caminho do checkout no documento de ambiente agora corresponde ao repositório utilizado. A descrição de Todos os níveis esclarece a diferença entre Normal e Sobrevivência.

Resultados executados constam em [VALIDATION.md](VALIDATION.md). Mudanças nos workflows não significam execução remota nem publicação realizada.
