# Experiência de Esquiva — 1.0.0-rc.16

Esta revisão acrescenta aprendizado guiado e feedback da tentativa. Mantém as quatro modalidades, os resultados antigos e as regras oficiais de dificuldade da rc.14, com a classificação corrigida na rc.15.

## Aprender na arena

O menu de Esquiva oferece **Aprender a esquivar** (`#/learn/dodge`). É opcional e não exige avaliação anterior. Quatro etapas, com avanço por ação confirmada e pelo botão Continuar:

1. Caminhar com clique direito.
2. Usar Flash na tecla configurada.
3. Usar dash na tecla configurada.
4. Lançar um aviso de área e sair do círculo antes do impacto.

A área usa a mesma geometria e colisão do treino, com aviso didático de dois segundos. Se acertar o jogador, permite nova tentativa; não conclui automaticamente por tempo. O tutorial pausa com ESC, perda de foco ou botão. Não salva progresso oficial, não concede pontos e não libera o Normal. Ao concluir, oferece avaliação ou retorno à escolha de desafios.

O modelo e a tela do tutorial não recebem um repositório de tentativas. A confirmação de Flash/dash vem do controlador depois de a habilidade ser aceita, respeitando pausa, foco, teclas configuradas e cooldown. A cena desenha o último frame sincronizado ao concluir, evitando congelar um efeito que já terminou.

## Câmera e resultado

Um botão discreto mostra e alterna câmera livre/travada na Esquiva. Ele usa o mesmo controlador de Y; Espaço mantém sua função anterior. Não há alteração de zoom inicial, enquadramento, curva, velocidades ou colisão nos desafios oficiais.

O resultado agora prioriza tempo ativo, ameaças evitadas entre as resolvidas e impactos válidos. Uma orientação usa a família de habilidade dos impactos registrados; há dicas para as nove habilidades atuais. Contagens desconhecidas ou contraditórias não viram uma explicação inventada. Ameaças pendentes e contatos ignorados não contam como esquivas bem-sucedidas. Amostras com menos de oito resoluções têm ressalva visível.

Métricas e composição da nota continuam em **Detalhes e pontuação**, expansível. Pontos de desempenho e confirmação de salvamento ficam fora desse painel, visíveis no resultado. A análise não altera a nota, as métricas persistidas, o avanço de nível ou a classificação.

## Rever impactos

A revisão continua usando somente seis segundos em memória. Abre perto do último impacto daquele intervalo e oferece marcadores numerados acessíveis por clique ou teclado. Clicar em um marcador pausa a revisão e busca o frame correspondente, sem retomar ou modificar a tentativa original. Reprodução lenta e slider permanecem disponíveis.

## Verificação

Além da suíte anterior, testes cobrem fluxo/pausa/repetição do tutorial, colisão real, teclas aceitas, botão da câmera, ausência de gravação oficial, import tardio, orientação fiel à amostra, busca de impactos e último frame de conclusão.

`browser-tutorial` executa o tutorial por cliques e teclas reais em Chromium com Flash configurado em F. O fluxo oficial de Esquiva verifica a nova orientação e a abertura da revisão. Evidências executadas e limites estão em [VALIDATION.md](VALIDATION.md).

Tela cheia, sensação do mouse, adequação visual e desempenho no computador do jogador permanecem sujeitos a aceitação manual. A revisão não declara validação competitiva nem integração com o client do LoL.
