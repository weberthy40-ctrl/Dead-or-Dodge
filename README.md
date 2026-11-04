# RIFT LAB

Plataforma de treinamento de mecânicas de MOBA para navegador em computador. **Versão candidata 1.0.0-rc.28:** preparação com foco, condições e comandos; estado de sessão consistente; pausa com teclado, retomada e saída nas quatro modalidades principais. Mantém os refinamentos de Esquiva, Kiting, Precisão e Reflexos, a central de treino e o progresso local. Veja [esta entrega](docs/TRAINING_FLOW_RC28.md), [o plano de evolução](docs/PRODUCT_EVOLUTION.md), [a direção aprovada](docs/RIFT_LAB_VISION.md) e [as regras atuais](docs/CURRENT_SCOPE.md). A base animada do personagem e parte do cenário são KayKit CC0, adaptados com materiais, runas e estruturas originais. Testes manuais de hardware e calibração com jogadores continuam pendentes.

- **Esquiva 2.0:** rota central arcana, Duelista animado e quatro presets. A jornada opcional integra avaliação, preparação, tutorial, Normal, resultados e revisão. Normal e Sobrevivência permitem escolher os 20 níveis; Normal tem três vidas e Sobrevivência, uma. A recomendação salva mantém seu avanço por desempenho, sem restringir a escolha livre. Flash, dash e parada são configuráveis; Y alterna a câmera. As nove famílias oficiais e suas regras foram preservadas; projétil, lança, gancho, feixe e área têm exercícios focados de 30 s com revisão em memória. O objetivo é concluir a rodada e evitar oito ameaças; ao repetir, o resultado compara a rodada anterior nesta tela.
- **Séries de Esquiva:** três temas de até 30 s e três vidas, com habilidades, horários e posições fixados por código. Repita, consulte suas tentativas e retome códigos recentes; resultados separados das patentes e do avanço no Normal, incluídos no backup.
- **Precisão:** grupos de 4–10 alvos fixos, com tamanhos variados, órbitas e zigue-zague; um grupo a cada três exige sequência numérica (a cada dois nos níveis 7–10); o padrão só muda depois de acertar todos os alvos do grupo. Cliques errados e atrasos são contados; quantidade, velocidade, tamanho e prazo variam com o nível.
- **Kiting:** ondas mistas com perseguidores e atiradores, vida do jogador, dano e morte; começa com um perseguidor com vida; acertos causam dano, abates geram reposição e níveis maiores sobrepõem ondas até oito inimigos. Movimento e velocidade de ataque escalam com o nível; perseguidores correm a 98% da velocidade do jogador. Derrotas também são salvas no histórico. Escolha Clique direto, A + clique ou A imediato antes da sessão; cada comando executa um ataque. Os modos com A aproximam até poder atacar uma vez. Direito move; preparação, disparo e recuperação têm indicação na arena.
- **Reflexos:** um desafio integrado de Q/W/E/R, Espaço, F/J e mouse, sem setas. Verde pede clique esquerdo, azul pede direito e vermelho pede não responder; símbolos e texto acompanham as cores.
- **DPI:** estimativa por contagens brutas e distância medida com régua; comparação de DPIs com três rodadas por valor. O campo de referência do LoL usa 0–100, padrão 50.

Esquiva tem 20 níveis; precisão, kiting e reflexo têm dez cada. A escolha de níveis é livre em Normal e Sobrevivência; avaliação e progressão orientam o percurso recomendado. Cada modalidade tem histórico local, recordes por contexto, evolução, seis conquistas, classificação pessoal e avaliação guiada: cinco etapas adaptativas de até 30 segundos na esquiva e três etapas de 20 segundos nas demais. Na esquiva, a avaliação e o nível ficam salvos; os outros diagnósticos ficam em memória. Diagnósticos não concedem pontos de treino. O perfil mostra pontos e patentes por habilidade e uma média geral das modalidades treinadas. Não há contas, placar online, backend, API Riot ou sincronização.

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
| Solicitar ataque de Kiting | Clique direto: esquerdo. A + clique: A prepara e esquerdo confirma. A imediato: A na posição do cursor na arena. Cada comando executa um ataque |
| Cancelar preparação de Kiting | Clique direito, parar ou Flash antes do disparo |
| Parar o personagem | S (configurável) |
| Flash na direção do cursor | D (configurável): até 4 unidades, 15 segundos ativos de recarga |
| Dash na direção do cursor (Esquiva) | E (configurável): 2,6 unidades em 170 ms, recarga de 5 s ativos, sem invulnerabilidade |
| Tela cheia | Botão na arena; permanece ao jogar novamente |
| Ver alcance de Kiting | Segurar A; no modo A + clique, fica visível enquanto aguarda confirmação |
| Responder em Reflexos | Q/W/E/R, Espaço, F/J ou mouse; aguarde nos sinais de inibição |

Pausa, preparação e tempo sem foco não contam como tempo ativo. A retomada após perda de foco é explícita. Sair / abandonar não salva conclusão oficial. Na esquiva, Encerrar e analisar conclui a tentativa e salva quando existe amostra válida.

## Dados e configurações

A preparação da Esquiva oferece **Verificar fluidez no meu computador**: cenário fixo com os quatro presets, FPS, p95, carregamento e comparação em memória. A qualidade escolhida ali não altera sua preferência. É possível baixar uma rodada, exportar até oito na comparação ou selecionar um resumo para copiar. Relatórios de fluidez e relatos opcionais das práticas dependem de ação explícita; ficam separados do backup e não são enviados a servidor. Metas e sensação dos controles ainda dependem de calibração humana.

O progresso fica no **IndexedDB deste navegador e origem**. Trocar de porta, navegador ou dispositivo cria outro contexto de dados. No resultado, “Salvo neste dispositivo” aparece somente após commit; falhas oferecem nova tentativa com o mesmo ID.

Configurações inclui câmera, contraste, tamanho do texto, redução de movimento, qualidade gráfica, áudio e backup. Leve/Médio/Alto/Ultra mudam somente renderização; qualidade é aplicada na próxima abertura da arena. Áudio é original, opcional e liberado por gesto do usuário.

Exporte o backup JSON deliberadamente em Configurações; ele inclui também as tentativas de séries. Backups anteriores continuam aceitos. Backups com séries exigem rc.17 ou mais recente; para interpretar os comandos de Kiting, use rc.18 ou mais recente. A preferência Ultra exige rc.19 ou superior. Importação aceita até 10 MiB, mostra prévia e mescla IDs ausentes, preservando conflitos. Não oferece substituição ou apagamento. Preferências ausentes podem ser importadas mediante opção explícita; valores locais existentes permanecem. Resultados temporários de diagnóstico e DPI não entram no backup.

## Validação

Com Node 24.19.0 e Chrome/Chromium instalado:

```sh
npm ci
npm run check
```

O comando executa testes unitários, lint, auditoria, build e onze suítes reais de navegador. O runner inicia e encerra servidor e navegador automaticamente, usa portas livres e cria contextos temporários isolados para cada página de QA. Os dados do jogador não entram nesses contextos.

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
