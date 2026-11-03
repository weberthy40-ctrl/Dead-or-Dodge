# QA da versão atual

Consulte [CURRENT_SCOPE.md](CURRENT_SCOPE.md) para as regras e [RELEASE_CHECKLIST.md](RELEASE_CHECKLIST.md) para a aceitação. O [roteiro anterior](history/QA-RC14.md) foi preservado como histórico; suas regras antigas não devem orientar esta versão.

## Validação automática completa

Requisitos: Node 24.19.0, `npm ci` e Chrome/Chromium instalado. Não é necessária biblioteca adicional de automação.

```sh
npm run check
```

A sequência é: testes Vitest, lint, auditoria completa, build e testes em navegador real. O runner usa portas livres, inicia Vite e Chrome/Chromium e encerra os processos que criou. Usa um perfil temporário e um **browser context isolado por página de QA**, com localStorage/IndexedDB próprios. Os testes podem salvar tentativas oficiais somente nesses contextos descartáveis; nenhum banco do perfil normal é apagado.

`CHROME_BIN` seleciona o executável. Em Linux, são procurados `chromium`, `chromium-browser`, `google-chrome` e `google-chrome-stable`. No Windows/PowerShell:

```powershell
$env:CHROME_BIN = "$env:ProgramFiles\Google\Chrome\Application\chrome.exe"
npm run check
```

No ambiente de nuvem já isolado, se o sandbox do Chrome não for suportado:

```sh
QA_NO_SANDBOX=1 npm run check
```

Essa opção é explícita e não deve ser necessária no computador pessoal. Preserve TLS e as verificações de integridade dos pacotes.

Por padrão o navegador é headless. **Tela cheia fica NÃO VERIFICADA**, com aviso no início e no resultado do gameplay. Não é considerada aprovação por mocks. Para executar com interface, em um sistema com sessão gráfica:

```sh
QA_HEADED=1 npm run test:e2e
```

Não defina `QA_SKIP_FULLSCREEN` nessa execução; a suíte deve validar a entrada e saída reais. Aceitação manual de tela cheia e sensação dos controles continua necessária.

Logs e capturas ficam em `artifacts/qa/<execução>/`, ignorado pelo Git. `QA_ARTIFACT_DIR` permite escolher outro diretório. Um comando que falha mantém seu status de falha; artefatos não equivalem a aprovação. Servidor/navegador têm limite de prontidão de 45 segundos; cada suíte tem limite de dez minutos.

### Suítes executadas

| Suíte | Verificação |
| --- | --- |
| `browser-isolation` | Salva progresso em um contexto, verifica outro vazio e confirma remoção das páginas ao fechar |
| `browser-tutorial` | Movimento e teclas configuradas, pausa, colisão/repetição, saída da área e perfil sem resultados oficiais |
| `browser-series` | Duas tentativas do mesmo código, pausa, IDs distintos, perfil/registro oficial preservados, comparação, recentes, abandono e backup em IndexedDB real |
| `browser-rift` | Jornada opcional, preparação, acesso livre ao Normal 20, cinco famílias nos quatro presets, impacto confirmado, objetivo, comparação de duas rodadas, revisão com reprodução em 0,5×, origem identificada da área e progresso anterior preservado |
| `browser-quality` | Dois presets com relógio natural, seis comandos nativos, pausa, comparação com condição da amostra, exportação individual/conjunta, resumo selecionável, respostas por rodada e preferência/registro anterior preservados e descarte da cena |
| `browser-smoke` | Navegação, 20 níveis de Esquiva e 30 das demais modalidades, quatro diagnósticos, dez remontagens, canvas/RAF, heap e quatro presets gráficos |
| `browser-native` | IndexedDB nativo: migração, bloqueio, quatro modalidades, backup, conflitos, idempotência, quota/rollback e conquistas |
| `browser-kiting-controls` | Clique direto, A + clique e A imediato com entrada nativa, uma ordem/um ataque, preferência após reload, salvamento real, filtros e backup com registro antigo |
| `browser-feedback` | Ataque/cancelamento/abate/derrota em Kiting, quatro grupos de Precisão com erro de ordem nativo, resultado/salvamento/repetição e sinais de Reflexos; relógio controlado no trecho de Precisão |
| `browser-dodge` | Sobrevivência 20, acesso livre ao Normal, cinco etapas adaptativas, nível indicado, mobilidade, câmera, revisão e perfil |
| `browser-production` | Página e versão do build, modelos 3D, orientação/clique fora/ESC de Precisão com foco e retorno ao menu sem canvas retido |

Gameplay é executado antes de Esquiva, na ordem que reproduzia a interferência de resultados na rc.14. Os contextos isolados devem impedir essa regressão.

O smoke ainda verifica ausência de overflow em 390×844 como proteção de menus; isso não declara suporte ao gameplay mobile. Os testes headless não medem FPS em GPU física, sensação do mouse ou habilidade humana.

## Execução individual com navegador existente

É possível manter Vite e um perfil separado de QA ativos para diagnóstico. Não use o perfil pessoal. Exemplo de Chromium em Linux isolado:

```sh
npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Em outro terminal:

```sh
chromium --headless --no-sandbox --disable-dev-shm-usage --remote-debugging-address=127.0.0.1 --remote-debugging-port=9222 --user-data-dir=/tmp/moba-qa-manual about:blank
```

Execute `npm run test:isolation`, `npm run test:browser`, `npm run test:storage`, `npm run test:gameplay` ou `npm run test:dodge`. Use `QA_SKIP_FULLSCREEN=1` no gameplay headless, registrando a exclusão. `CDP_URL` seleciona o endpoint CDP. Os scripts também aceitam a URL do app como argumento: `npm run test:browser -- http://127.0.0.1:5173/`.

## Aceitação manual desktop — pendente

O caso de Precisão do `browser-production` fixa 1366×768 antes dos cliques nativos; as coordenadas desktop não devem ser usadas no viewport padrão de 780×493 do Chromium headless.

Na rc.26, conferir a marca interna do próximo alvo de Precisão e o símbolo ! dos atrasados; ambos devem permanecer dentro da esfera, sem área adicional de clique. Esperar o próximo alvo atrasar: ele deve continuar verde, com marca e símbolo. Testar clique fora, ordem incorreta e acerto; a instrução da sequência deve permanecer enquanto a mensagem curta muda. Pausar pelo ESC logo após iniciar/retomar. No resultado, comparar os quatro contadores com as métricas expansíveis, verificar salvamento visível e repetir a mesma condição. O atalho de ensaio deve informar que usa os ajustes técnicos do nível 4. Repetir com Leve e Ultra, níveis 1 e 10, texto ampliado e redução de movimento.

Na rc.25, verificar os três comandos de Kiting com A, cursor e clique direito; o alvo selecionado usa círculo fechado e a preparação inimiga usa arco aberto. Conferir texto dentro/fora do alcance, preparação, indicação de movimento imediatamente após o disparo, recuperação curta após cancelamento e pausa. No resultado, verificar causas, amostra curta, nova prática, métricas expansíveis e salvamento. As causas devem permanecer na tela atual e não aparecer nos registros/backups. Repetir com Leve e redução de movimento.

Na rc.24, conferir também a distinção entre personagem, piso e avisos nos quatro presets; a seta do anel acompanha a orientação e não representa hitbox. Alternar direito → S → direito, mudanças curtas de direção, dash e Flash; a resposta física deve continuar imediata. Comparar com redução de movimento e pausar durante a corrida/dash para verificar congelamento. Julgar clareza e sensação em hardware real, sem tratar capturas ou contagens de draw calls como aprovação de fluidez.

A central da rc.23 também é verificada por `browser-smoke`: quatro focos selecionáveis por teclado nativo, três atalhos por foco, retomada com IndexedDB real sem alterar o registro, preservação do nível e ausência de início automático. A página inicial entra nas capturas e verificações de overflow em 390, 1366 e 1920 pixels, incluindo texto ampliado e alto contraste.

Matriz inicial: Chrome e Edge atuais no Windows; 1366×768, 1920×1080 e 2560×1440; notebook com GPU integrada e computador de referência. Registrar versão do navegador, hardware, qualidade e cenário. Outros sistemas/navegadores entram no suporte após validação explícita.

1. **Entrada e controles:** abrir o tutorial de Esquiva, concluir as quatro etapas, falhar no aviso, repetir, pausar e sair sem criar resultado oficial. Conferir também o botão de câmera e os marcadores clicáveis da revisão. Depois, abrir as quatro modalidades e entender como começar. Testar direito para mover, parada, Flash, dash, Y, Espaço e zoom; conferir teclas personalizadas e foco em inputs. No Kiting, testar os três comandos: Clique direto, A + clique e A imediato. Conferir confirmação armada, cursor fora da arena, ausência de repetição automática e descarte na pausa/perda de foco.
2. **Esquiva:** testar níveis 1, 5, 10, 15 e 20 na Sobrevivência. Conferir aviso e contorno das nove habilidades, contato e borda da gaiola, ausência de dano cosmético e leitura de ameaças externas. Normal tem três vidas e tempo ilimitado; Sobrevivência tem uma vida e tempo ilimitado. Testar Encerrar e analisar com evidência suficiente.
3. **Avaliação e avanço:** concluir cinco etapas adaptativas de Esquiva, cada uma com início manual e até 30 s; conferir nível salvo, reload, revisão e avanço após desempenho elegível. Concluir também três etapas de 20 s nas outras modalidades. Diagnósticos não aumentam o histórico oficial.
4. **Precisão:** completar grupos fixos, móveis e de prioridade. Conferir erro por clique fora, ordem, atraso, último alvo e transição de grupo. Repetir em níveis 1 e 10.
5. **Kiting:** alternar comandos antes de iniciar; conferir seleção bloqueada na rodada, fases visíveis e histórico filtrado. Nos modos com A, aproximar para um único ataque e cancelar a aproximação com direito/parada/Flash. Depois, atacar, cancelar a preparação com movimento/parada/Flash, confirmar dano e abate, acompanhar perseguidor e atirador, sofrer dano e derrota. Repetir em níveis 1 e 10; velocidades e intervalos variam com o nível.
6. **Reflexos:** responder às teclas e às três cores; testar antecipação, tecla mantida, erro, omissão e inibição. Uma inibição correta não deve inventar tempo de reação zero. Conferir que comandos em campos/botões não respondem ao treino.
7. **Pausa e foco:** pausar durante preparação e ação; trocar de aba, voltar e retomar explicitamente. Conferir relógio, cooldown e animações congelados. Abandonar e atualizar não podem gerar conclusão oficial falsa.
8. **Dados:** testar as três séries, repetir o mesmo código, abrir outro e recarregar o navegador. Comparações devem incluir só o código exato; recentes devem permitir retomada. Pausa congela o tempo; abandono não salva. Conferir que as séries não alteram patentes ou nível do Normal e entram no backup. Depois, concluir treinos oficiais, conferir confirmação de commit e reload. Exportar backup, pré-visualizar, importar repetidamente e preservar conflitos. Na rc.15, patentes de Reflexos integrado são recalculadas; notas, métricas e datas antigas permanecem iguais.
9. **Interface:** testar tela cheia, sair, repetir e voltar ao menu; ações do resultado devem continuar visíveis. Conferir contraste, texto ampliado, tabulação, redução de movimento, mute e volume. Testar troca de qualidade ao reabrir a arena.
10. **Mouse:** medir três passagens físicas com régua e entrada bruta; comparar três rodadas por DPI nas mesmas condições. Resize deve invalidar a rodada. Confirmar conforto no computador, sem tratar a comparação como medição do elo do LoL.
11. **Falhas e estabilidade:** negar armazenamento, simular falta/perda de WebGL, alternar modalidades e repetir sessões longas. Conferir mensagens úteis, ausência de registros falsos e recuperação possível. Medir tempos de frame e memória; a aprovação dos testes não substitui essa medição.

### Aceitação do protótipo RIFT LAB

Conferir no computador do jogador: leitura do Duelista em corrida, parada, virada, dash e Flash; ausência de atraso introduzido pelos efeitos; cinco famílias na preparação; áudio em baixa/alta densidade, mute e volume; contornos e iluminação nos quatro presets; entrada livre no Normal e continuidade da recomendação; avaliação guiada levando à preparação; tutorial e revisão sem modificar notas ou dados antigos. Capturas com relógio de simulação controlado demonstram estados visuais, não medem FPS ou latência.

O trecho de mobilidade de `browser-dodge` controla o relógio de simulação entre os comandos nativos para que atrasos do DevTools não encerrem a rodada antes da checagem de Y/Espaço. Ele confere sessão ativa, foco no canvas e estado do botão de câmera, preservando todas as verificações. Sobrevivência, avaliação, derrota, salvamento e perfil usam tempo normal; o relógio é restaurado antes da conclusão do Normal.

`browser-kiting-controls` aguarda a cena pronta, um canvas presente e o botão de início habilitado após trocar os comandos. A seleção remonta a arena; observar apenas o atributo de prontidão da cena anterior não prova que a nova tentativa já pode começar.

### Impactos e prática focada

Após um acerto de feixe, área ou projétil, conferir um sinal breve e a atualização correta de vidas. Pausar deve congelar a apresentação; o sinal não pode causar novo dano ou interceptar cliques. Repetir nos quatro presets e com redução de movimento. Na revisão, clicar no último impacto e voltar a um instante anterior, verificando que os sinais seguem os quadros.

Concluir uma rodada técnica observando o objetivo de tempo e oito esquivas; comparar com uma segunda rodada, depois sair e reabrir para verificar o descarte da comparação. Conferir que tentativas oficiais, patentes, avaliação e backup permanecem inalterados pelos exercícios focados. Os números do objetivo são uma referência inicial de prática, sujeita à calibração com jogadores.

### Verificação de fluidez e relatos — rc.21

Na preparação, abrir **Verificar fluidez no meu computador**. Rodar Leve/Médio/Alto/Ultra com a mesma resolução, zoom, câmera e rota; registrar navegador, hardware e outros programas abertos. Aguardar dois segundos de aquecimento e 30 de observação. Conferir comandos usados, pausa/perda de foco e aviso de redimensionamento, inclusive se a janela mudar durante uma pausa. Comparar FPS/p95/quadros longos e exportar deliberadamente. Sair/recarregar deve descartar a lista sem modificar preferências, tentativas, patentes ou avaliação. Os números de headless/software não homologam GPU física.

Concluir práticas focadas com jogadores, observar a meta de 30 segundos/oito esquivas e colher os três campos opcionais de dificuldade, clareza e resposta dos controles. Distinguir respostas de pessoas de fixtures automatizadas. Avaliar os relatos antes de retunar a meta; esta entrega mantém os valores. Conferir corpo/capa em corrida, parada, curva e dash, sem atraso na posição ou orientação; redução de movimento deve eliminar inclinações. Verificar as marcas distintas das cinco preparações dentro dos contornos reais nos quatro presets.

Com navegador/servidor de QA já abertos, a verificação individual é `node scripts/browser-quality.js http://127.0.0.1:5173/`. Ela usa contextos temporários, coleta em tempo natural e gera `observed-reports.json` no diretório de artefatos. Esse arquivo é evidência de funcionamento da instrumentação, não benchmark de GPU física.

### Compartilhamento e avisos de origem — rc.22

Comparar pelo menos dois presets, responder um campo na primeira rodada e deixar a segunda sem respostas. Exportar a rodada atual e a comparação: cada uma deve manter suas respostas e medidas. Selecionar o resumo, usar Ctrl+C e conferir todos os dados de ambas. Nenhuma ação deve enviar dados remotamente ou alterar histórico/preferências. A lista continua limitada às oito últimas rodadas e é descartada ao sair.

Ativar tela cheia antes de iniciar e conferir ausência de aviso sem mudança durante a rodada. Repetir com redimensionamento real na execução e durante pausa: o aviso deve aparecer na tabela, no resumo e no JSON. Eventos sem alteração de dimensões/escala não devem marcar a amostra.

Na Esquiva, identificar as cinco famílias e habilidades antigas por preparações na periferia da câmera. Conferir texto em pé, direção da seta, quatro rótulos no máximo, separação, contador e desaparecimento ao ativar/remover. Repetir com câmera livre, zoom, muitos ataques e quatro presets; avisos físicos e comandos devem continuar iguais. Os indicadores não significam que toda preparação atingirá o jogador.
