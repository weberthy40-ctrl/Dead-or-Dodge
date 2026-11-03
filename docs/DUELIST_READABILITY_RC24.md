# Arena e Duelista — 1.0.0-rc.24

Incremento da [evolução comercial](PRODUCT_EVOLUTION.md) dedicado à Esquiva: separar visualmente o jogador do terreno e dar continuidade às transições do corpo, preservando os sistemas de movimento, colisão e pontuação.

## Leitura da arena

O piso mantém o desenho de pedra existente, com menos variação entre blocos, juntas menos contrastadas e bordas suavizadas. As cores das margens, molduras e vegetação ficam mais discretas. Estruturas, plantas, árvores e modelos continuam presentes; não foram adicionados obstáculos à área jogável.

O Duelista ganha prata mais clara, material menos metálico e um realce azul suave nas bordas da silhueta. Uma luz de preenchimento sem sombras reforça a leitura na Esquiva. O tratamento é aplicado aos materiais clonados do jogador local; os arquivos KayKit, texturas originais, inimigos e personagens das outras modalidades não são reescritos. Os créditos e licenças existentes continuam válidos.

O anel de seleção recebe um fundo escuro e uma pequena seta de orientação. Ambos seguem o personagem, não têm raycast e não definem hitbox, alcance, proteção ou direção obrigatória de movimento. O contorno físico dos avisos continua sob o sistema de habilidades existente. O anel e a seta compartilham material e usam uma passagem de transparência para superfícies planas.

Leve, Médio, Alto e Ultra recebem a mesma informação essencial. A luz adicional não cria outro mapa de sombras; os limites de resolução, efeitos e sombras de cada preset permanecem sob as configurações existentes.

## Movimento do corpo

Idle e Running_A, do modelo KayKit já utilizado, são misturados pelo peso cosmético de corrida existente. Os clipes não são reiniciados a cada troca entre correr e parar; o ciclo de corrida fica pausado quando seu peso chega a zero. As ações continuam sendo criadas somente quando necessárias e liberadas ao descartar a cena.

A desaceleração da postura fica mais curta, e a inclinação visual do dash entra mais cedo. Posição, orientação de mundo, alvo, velocidade, duração física do dash, Flash, cooldowns e momento dos comandos continuam definidos pelos mesmos controladores. Não há espera por animação para executar uma ação.

Pausa congela as transformações do corpo e o tempo visual das habilidades. Redução de movimento mantém a pose neutra, o anel e a indicação de orientação, sem inclinação ou oscilação adicional. A revisão usa o mesmo tratamento de leitura do personagem, sem avançar a sessão concluída.

## Evidência e limites

Capturas comparáveis foram realizadas antes/depois nos quatro presets, a 1280 × 900, com câmera de revisão, pose e avisos de área/feixe fixados. Os materiais compilaram sem erros de console. Os arquivos locais estão em `artifacts/qa/rc24-comparison/` e são ignorados pelo Git.

Nesse enquadramento específico, `renderer.info` passou de 62 para 63 chamadas de desenho e somou um triângulo, com duas geometrias a mais e a mesma quantidade de texturas. Esses números não constituem medição de FPS, latência ou aceitação em GPU física.

Testes verificam pesos reais no AnimationMixer, continuidade de fase, isolamento dos assets, descarte dos recursos, posição física preservada e congelamento do esqueleto real na pausa/redução de movimento. A bateria oficial continua cobrindo os quatro presets, avisos, comandos nativos, revisão, armazenamento e outras modalidades. Resultados executados: [VALIDATION.md](VALIDATION.md).
