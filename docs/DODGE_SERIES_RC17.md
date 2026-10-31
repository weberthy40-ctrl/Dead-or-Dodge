# Séries reproduzíveis — 1.0.0-rc.17

Esta revisão acrescenta uma forma de repetir condições de treino sem alterar o fluxo oficial de Normal, Sobrevivência ou das demais modalidades.

## Fluxo do jogador

Em **Esquiva → Repetir uma sequência**, escolha entre:

- **Passos laterais:** disparos anunciados para trabalhar saída lateral.
- **Leitura de áreas:** círculos com aviso para trabalhar deslocamento e atenção ao próximo sinal.
- **Ameaças combinadas:** disparos, áreas, feixes e gaiola.

Cada série oferece três vidas e até 30 segundos ativos. É possível repetir o mesmo código, criar outro código para o tema ou informar um código recebido. A pausa e a perda de foco congelam a sessão. Ao terminar, aparecem orientação, revisão dos últimos seis segundos, confirmação de salvamento e as últimas 20 tentativas daquele código.

O menu mostra até cinco códigos recentes com links para retomada. A sugestão do próximo passo considera repetição, conclusão e quantidade de ameaças resolvidas. Não associa esses resultados a elo, patente ou prova de domínio humano.

## O que é reproduzível

Reutilizar somente o RNG do treino oficial não bastava: ele escolhe ataques conforme o jogador e faz admissão por rota de fuga. As séries têm um gerador próprio e um calendário imutável, anterior à partida.

- Formato do código: `dd1-<linha|areas|misto>-<seed hexadecimal de 8 dígitos>`.
- Versão do contexto: `dodge-series-v1`.
- 19 lançamentos, de 2 a 27,2 segundos ativos, em intervalos de 1,4 s.
- Posições, direções, famílias e avisos não são escolhidos durante o gameplay. Os valores físicos usados por `dd1` estão fixados no gerador; não herdam rebalanceamento futuro dos perfis oficiais.
- O scheduler divide uma atualização que cruza um lançamento no instante do evento. Não descarta eventos por diferenças de ritmo de renderização.
- Ataques continuam usando a geometria e a colisão comuns ao jogo. A posição real do jogador é usada para medir exposição, não para redirecionar os ataques da série.

A garantia é sobre o calendário e as configurações dos lançamentos. Movimento, latência de entrada, colisão amostrada, proteção entre danos, exposição e momento da derrota dependem da execução. Uma derrota também encerra os lançamentos restantes. **O código não garante igualdade de resultado nem teste comparativo universal entre equipamentos.**

Os cenários podem permitir que o jogador fique longe de parte das ameaças. Por isso a interface mostra resoluções e ressalva de amostra, em vez de transformar tempo sobrevivido em uma patente. A calibração com pessoas continua pendente.

## Histórico e backup

Os resultados usam categoria própria `dodge-challenge` no store `attempts`, com código canônico, versão, tema, data, identidade e métricas. Não geram score de patente. Consultas oficiais continuam filtradas por modalidade; comparação de séries exige o código exato, que também incorpora tema e versão.

Não houve migração destrutiva nem mudança da versão 2 do IndexedDB. O validador de tentativas reconhece a categoria adicional, e o backup existente a inclui na exportação/mesclagem por ID. O retry de uma gravação reutiliza a mesma identidade. Conflitos continuam preservados.

Backups anteriores permanecem legíveis. Backups que contenham séries precisam desta versão ou posterior; versões antigas não conhecem a nova categoria. Preferências, avaliação salva e notas dos treinos anteriores são preservadas.

## Verificação e limites

Testes verificam códigos, imutabilidade, lançamentos com passos de 0,1 s / 0,05 s / 1⁄60 s e jogadores em posições diferentes; pausa; descarte; validação de registros; exclusão das patentes; histórico por código; persistência, retry e abandono.

A suíte `browser-series` usa Chromium e IndexedDB reais. Mantém uma tentativa oficial antiga, repete uma série duas vezes, confirma IDs distintos e o mesmo código, verifica perfil inalterado, exporta/importa o backup em um banco temporário e confirma idempotência. Também testa retomada e abandono. O smoke de produção abre e inicia uma série no build servido pelo preview.

Evidências executadas estão em [VALIDATION.md](VALIDATION.md). Tela cheia, fluidez em hardware real, adequação da pressão e transferência de habilidade para o LoL seguem dependentes de validação manual. Nenhuma publicação foi executada nesta revisão.
