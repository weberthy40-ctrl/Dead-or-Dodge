# Checklist — 1.0.0-rc.17

Resultados locais de 31/10/2026, Node 24.19.0/npm 11.9.0 e Chromium 154 em Linux. A [checklist anterior](history/RELEASE_CHECKLIST-RC1.md) é histórica. Evidência e limites estão em [VALIDATION.md](VALIDATION.md).

| Critério | Estado | Evidência/limite |
| --- | --- | --- |
| Instalação pelo lockfile | PASSOU | npm ci após as alterações: 151 pacotes, versões e lockfile consistentes |
| Testes automatizados | PASSOU | 285 testes, 62 arquivos; inclui calendário reproduzível, registros, histórico por código, backup e regressões anteriores |
| Lint | PASSOU | ESLint sem avisos, usando minimatch corrigido |
| Build | PASSOU COM AVISO | Chunk 3D de 715,25 kB minificados; carregado sob demanda |
| Auditoria completa | PASSOU | Zero vulnerabilidades reportadas na consulta |
| Isolamento de QA | PASSOU | localStorage e progresso oficial não vazam entre contextos; páginas descartadas |
| IndexedDB nativo | PASSOU | Migração, conflito, idempotência, rollback e conquistas |
| Navegação e remontagens | PASSOU | Dez ciclos; presets e verificações de layout |
| Gameplay automatizado | PASSOU NO ESCOPO | Kiting, Precisão e Reflexos; tela cheia explicitamente excluída |
| Séries reproduzíveis | PASSOU | Mesmo código em duas tentativas, pausa, comparação, retomada, abandono, perfil e registro oficial preservados |
| Backup com séries | PASSOU | Mesclagem idempotente de três registros em IndexedDB real; backup original rc.14 reexportado sem alteração |
| Tutorial interativo | PASSOU | Movimento e teclas reais, pausa, colisão e repetição; perfil sem resultados oficiais |
| Esquiva após gameplay | PASSOU | Avaliação adaptativa, Sobrevivência, Normal, mobilidade, feedback, revisão e perfil |
| Build servido pelo preview | PASSOU | Versão correta, modelos e início de série carregados; cena descartada ao sair |
| Encerramento do runner | PASSOU | Processos próprios encerrados e diretório temporário removido |
| Tela cheia interativa | NÃO VERIFICADO | Exige execução com interface e aceitação manual |
| Windows/Chrome/Edge e hardware real | NÃO VERIFICADO | Roteiro em QA.md |
| Calibração com jogadores | NÃO VERIFICADO | Escala interna, sem equivalência comprovada ao elo do LoL |
| CI/Pages remoto | NÃO VERIFICADO | Ambos usam npm run check; execução remota não realizada |
| Publicação/restauração do ambiente | NÃO VERIFICADO | Não faz parte desta alteração de código |

Decisão: manter **release candidate**. A experiência de Esquiva e as regressões anteriores passaram nos checks locais; não há certificação de versão final nem alegação de integração com o client do LoL.
