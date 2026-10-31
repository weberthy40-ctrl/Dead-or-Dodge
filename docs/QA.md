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
| `browser-smoke` | Navegação, 20 níveis de Esquiva e 30 das demais modalidades, quatro diagnósticos, dez remontagens, canvas/RAF, heap e presets gráficos |
| `browser-native` | IndexedDB nativo: migração, bloqueio, quatro modalidades, backup, conflitos, idempotência, quota/rollback e conquistas |
| `browser-kiting-controls` | Clique direto, A + clique e A imediato com entrada nativa, uma ordem/um ataque, preferência após reload, salvamento real, filtros e backup com registro antigo |
| `browser-feedback` | Ataque/cancelamento/abate/derrota em Kiting, quatro grupos de Precisão e sinais de Reflexos; relógio controlado no trecho de Precisão |
| `browser-dodge` | Sobrevivência 20, bloqueio do Normal, cinco etapas adaptativas, nível indicado, mobilidade, câmera, revisão e perfil |
| `browser-production` | Página e versão do build, carregamento de modelos 3D e retorno ao menu sem canvas retido |

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
