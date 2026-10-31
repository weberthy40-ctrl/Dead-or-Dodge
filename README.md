# MOBA Training

Treinador web de mecânicas de MOBA, em português, com arena própria e personagens animados KayKit (CC0). **Versão candidata 1.0.0-rc.17**: séries reproduzíveis de Esquiva, comparação por código e histórico integrado ao backup. Veja [as mudanças desta versão](docs/DODGE_SERIES_RC17.md), [o aprendizado e a revisão da rc.16](docs/DODGE_EXPERIENCE_RC16.md) e [a correção da base na rc.15](docs/FOUNDATION_RC15.md), [o escopo atual](docs/CURRENT_SCOPE.md) e [a revisão visual e de combate](docs/VISUAL_COMBAT_REVISION.md). Texturas originais, VFX e escala da arena foram revistos; veja [a calibração e suas referências](docs/LOL_REFERENCE_CALIBRATION.md). A aceitação manual no Windows e a calibração com jogadores permanecem pendentes; esta entrega não declara uma versão 1.0 aprovada.

- **Esquiva:** tutorial opcional em quatro passos, sem alterar histórico ou patente; feedback da tentativa e revisão com impactos clicáveis. 20 níveis. O Normal começa após uma avaliação salva e abre diretamente no nível indicado; três vidas, tempo ilimitado e avanço após desempenho consistente. Sobrevivência com uma vida e escolha livre de nível. Pressão maior desde o nível 1, nove habilidades e conjuradores externos aleatórios mirando o personagem. Início manual sem contagem, visão ampla antes de começar e câmera mais próxima durante a partida. Flash e dash curto (E) configuráveis; revisão dos últimos seis segundos. Áreas mantêm aviso; trajetória prévia apenas nos níveis 1 e 2. Laboratório e prática sem pontuação removidos.
- **Séries de Esquiva:** três temas de até 30 s e três vidas, com habilidades, horários e posições fixados por código. Repita, consulte suas tentativas e retome códigos recentes; resultados separados das patentes e do avanço no Normal, incluídos no backup.
- **Precisão:** grupos de 4–10 alvos fixos, com tamanhos variados, órbitas e zigue-zague; um grupo a cada três exige sequência numérica (a cada dois nos níveis 7–10); o padrão só muda depois de acertar todos os alvos do grupo. Cliques errados e atrasos são contados; quantidade, velocidade, tamanho e prazo variam com o nível.
- **Kiting:** ondas mistas com perseguidores e atiradores, vida do jogador, dano e morte; começa com um perseguidor com vida; acertos causam dano, abates geram reposição e níveis maiores sobrepõem ondas até oito inimigos. Movimento e velocidade de ataque escalam com o nível; perseguidores correm a 98% da velocidade do jogador. Derrotas também são salvas no histórico. Esquerdo em qualquer ponto ataca um inimigo no alcance, direito move e A exibe o alcance.
- **Reflexos:** um desafio integrado de Q/W/E/R, Espaço, F/J e mouse, sem setas. Verde pede clique esquerdo, azul pede direito e vermelho pede não responder; símbolos e texto acompanham as cores.
- **DPI:** estimativa por contagens brutas e distância medida com régua; comparação de DPIs com três rodadas por valor. O campo de referência do LoL usa 0–100, padrão 50.

Esquiva tem 20 níveis; precisão, kiting e reflexo têm dez cada. A seleção livre da esquiva fica em Sobrevivência; o Normal segue a avaliação e a progressão. Cada modalidade tem histórico local, recordes por contexto, evolução, seis conquistas, classificação pessoal e avaliação guiada: cinco etapas adaptativas de até 30 segundos na esquiva e três etapas de 20 segundos nas demais. Na esquiva, a avaliação e o nível ficam salvos; os outros diagnósticos ficam em memória. Diagnósticos não concedem pontos de treino. O perfil mostra pontos e patentes por habilidade e uma média geral das modalidades treinadas. Não há contas, placar online, backend, API Riot ou sincronização.

## Testar pelo navegador

Site: **https://weberthy40-ctrl.github.io/Dead-or-Dodge/**. O endereço passa a servir a versão atual quando o deployment correspondente concluir.

O GitHub Pages atualiza automaticamente após um push em `main` que passe nos testes. A execução manual de **Publicar site de teste** continua disponível; veja [a configuração](docs/PUBLISH.md). O link do site só estará disponível após o deployment concluir; não é necessário baixar ZIP ou instalar Node para jogar no site publicado.

## Executar no Windows ou Linux

Instale **Node.js 24 LTS >=24.15.0 e <25**; a versão validada está em `.nvmrc` (24.19.0). Extraia o ZIP, abra o terminal na pasta que contém `package.json` e execute:

```sh
npm ci
npm run dev
```

Abra no navegador o endereço mostrado pelo Vite. O terminal precisa continuar aberto. O gameplay é otimizado para PC com teclado e mouse; menus e relatórios se adaptam a telas estreitas. Use um navegador com WebGL e IndexedDB.

Para a distribuição de produção:

```sh
npm run build
npm run preview
```

Não abra `index.html` diretamente pelo explorador de arquivos. O projeto usa ES Modules e requer o servidor. O lockfile contém as versões reais; não é necessário atualizar dependências para executar.

## Controles

| Ação | Controle |
| --- | --- |
| Mover o personagem | Clique direito na arena |
| Câmera travada/livre | Y |
| Centralizar no personagem, mantendo câmera livre e zoom | Espaço |
| Aproximar/afastar | Roda do mouse |
| Mover câmera livre | Bordas da arena, conforme preferência |
| Pausar/retomar | ESC ou botão; perda de foco pausa |
| Acertar alvos de Precisão | Clique esquerdo |
| Selecionar / solicitar ataque de Kiting | Clique esquerdo em qualquer ponto da arena: ataca um inimigo no alcance, próximo do cursor |
| Cancelar preparação de Kiting | Clique direito, parar ou Flash antes do disparo |
| Parar o personagem | S (configurável) |
| Flash na direção do cursor | D (configurável): até 4 unidades, 15 segundos ativos de recarga |
| Dash na direção do cursor (Esquiva) | E (configurável): 2,6 unidades em 170 ms, recarga de 5 s ativos, sem invulnerabilidade |
| Tela cheia | Botão na arena; permanece ao jogar novamente |
| Ver alcance de Kiting | Segurar A |
| Responder em Reflexos | Q/W/E/R, Espaço, F/J ou mouse; aguarde nos sinais de inibição |

Pausa, preparação e tempo sem foco não contam como tempo ativo. A retomada após perda de foco é explícita. Sair / abandonar não salva conclusão oficial. Na esquiva, Encerrar e analisar conclui a tentativa e salva quando existe amostra válida.

## Dados e configurações

O progresso fica no **IndexedDB deste navegador e origem**. Trocar de porta, navegador ou dispositivo cria outro contexto de dados. No resultado, “Salvo neste dispositivo” aparece somente após commit; falhas oferecem nova tentativa com o mesmo ID.

Configurações inclui câmera, contraste, tamanho do texto, redução de movimento, qualidade gráfica, áudio e backup. Leve/Médio/Alto mudam somente renderização; qualidade é aplicada na próxima abertura da arena. Áudio é original, opcional e liberado por gesto do usuário.

Exporte o backup JSON deliberadamente em Configurações; ele inclui também as tentativas de séries. Backups anteriores continuam aceitos; backups com séries exigem rc.17 ou mais recente para leitura. Importação aceita até 10 MiB, mostra prévia e mescla IDs ausentes, preservando conflitos. Não oferece substituição ou apagamento. Preferências ausentes podem ser importadas mediante opção explícita; valores locais existentes permanecem. Resultados temporários de diagnóstico e DPI não entram no backup.

## Validação

Com Node 24.19.0 e Chrome/Chromium instalado:

```sh
npm ci
npm run check
```

O comando executa testes unitários, lint, auditoria, build e oito suítes reais de navegador. O runner inicia e encerra servidor e navegador automaticamente, usa portas livres e cria contextos temporários isolados para cada página de QA. Os dados do jogador não entram nesses contextos.

No ambiente de nuvem já isolado desta tarefa, use `QA_NO_SANDBOX=1 npm run check`; essa opção não é necessária no computador pessoal. `CHROME_BIN` permite informar o caminho do navegador. Consulte [QA.md](docs/QA.md) para Windows, execução com interface e comandos individuais.

Tela cheia não é verificada pelo runner headless; o resultado é comunicado explicitamente. Windows, sensação dos controles, desempenho em GPU real e calibração com jogadores continuam exigindo aceitação manual. Logs e capturas ficam em `artifacts/qa/`, ignorado pelo Git.

CI e publicação executam o mesmo `npm run check`. Um roteiro ou workflow fornecido não equivale a uma execução aprovada. Evidências atuais e históricas estão em [VALIDATION.md](docs/VALIDATION.md) e [RELEASE_CHECKLIST.md](docs/RELEASE_CHECKLIST.md).

## Organização

| Pasta | Responsabilidade |
| --- | --- |
| `src/core`, `src/app` | Estado, eventos, lifecycle, erros e composição |
| `src/ui` | Navegação, telas e adapters de entrada |
| `src/game3d` | Arena, personagem, câmera, visuais e ownership de recursos |
| `src/training` | Sessões, exercícios, métricas, scores e diagnósticos |
| `src/progression` | Agregação de histórico, recordes, conquistas e rating |
| `src/persistence` | Snapshots, IndexedDB, migração e backup |
| `src/settings`, `src/audio`, `src/tools` | Preferências, áudio e ferramenta de mouse |
| `tests`, `scripts` | Testes puros, de interface e de navegador |

O cenário combina arte procedural própria e modelos KayKit de Kay Lousberg, licenciados em CC0 e servidos pelo próprio site. Modelos, licenças e origem estão em `public/assets/kaykit` e `public/assets/kaykit-nature`; veja [os créditos e modificações](docs/VISUAL_COMBAT_REVISION.md). Consulte [ARCHITECTURE.md](docs/ARCHITECTURE.md) para fórmulas, versões e contratos.

## Distribuir

O ZIP inclui fontes, testes, scripts, documentos e lockfile; não inclui node_modules, dist, .git, caches ou dados do jogador. Em um clone Git, o mesmo conjunto rastreado pode ser empacotado com:

```sh
git archive --format=zip --prefix=moba-training/ HEAD -o MOBA_Training.zip
```
