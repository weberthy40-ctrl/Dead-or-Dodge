# Reflexos — leitura e orientação — 1.0.0-rc.27

Incremento de apresentação para ler a ação pedida, entender o resultado de cada sinal e escolher a próxima prática. Reutiliza o motor, os exercícios, os níveis e os registros existentes.

## Comando e espera

O painel central destaca a tecla pedida. Nos sinais de mouse, uma ilustração estática identifica o botão esquerdo ou direito. Símbolos, cores e textos anteriores permanecem; sinais de freio recebem indicação explícita de controle de impulso. Os estados de preparação, espera, resposta, registro e pausa têm identificação própria.

A espera não mostra a tecla selecionada pelo motor, nem recebe cronômetro preditivo, animação cíclica ou aviso antecipado. O comando entra no DOM no mesmo ponto que já apresentava o sinal; `present()` continua sendo chamado em seguida, no mesmo fluxo. Não há novo RAF, temporizador ou mudança de latência mínima, janela de resposta ou relógio. Pausa esconde a ação pedida e mantém o congelamento anterior dos tempos. Retomar pelo botão devolve o foco à área de reação.

O acabamento é estático e permanece em Leve e com redução de movimento. Textos e atributos são atualizados apenas quando mudam, inclusive a região de status, evitando recriar o mesmo anúncio a cada quadro.

## Resposta anterior

Uma faixa separada do comando atual identifica a rodada e explica um dos seis resultados observados: resposta correta, erro de escolha, omissão, antecipação, inibição correta ou erro por impulso. Erros de escolha mostram a ação esperada e a recebida. Antecipações não revelam o comando oculto. Inibições corretas explicam a ausência de tempo de reação.

O observador utiliza o evento existente `reflex:response`, confere tentativa, índice e resultado contra a rodada real e conserva apenas a última observação por até 1,4 segundos ativos. A pausa congela essa duração. Reiniciar/sair descarta a assinatura. Não há novos eventos no motor nem campos acrescentados aos seus snapshots ou aos registros oficiais.

## Resultado e próxima prática

O diálogo mantém o salvamento visível e as ações de repetir/voltar acessíveis. Rodadas abandonadas ou sem evidência elegível para pontuar informam explicitamente que não geraram registro oficial. Destaca seis contagens: acertos no comando, inibições corretas, antecipações, erros de escolha, omissões e erros por impulso. O total oficial de respostas corretas continua incluindo as inibições; a apresentação separa os acertos no comando como `correct - inhibited`.

Média, mediana e melhor tempo usam apenas respostas corretas com latência válida. Valores ausentes aparecem como —; inibições não se tornam respostas de 0 ms. As rodadas individuais e os tempos anteriores, inclusive tempos de erros de escolha, continuam disponíveis junto das métricas e dos componentes da nota.

A orientação escolhe a categoria de erro com maior contagem. Empates priorizam impulso, antecipação, escolha e omissão, nessa ordem; é uma convenção provisória de prática. Menos de cinco sinais apresentados ou cinco acertos cronometrados recebe um aviso de amostra curta para interpretar os tempos. Essas condições não alteram elegibilidade de salvamento, nota, patente ou avaliação guiada e não estimam elo.

Repetir mantém a variante e o nível atuais. O treino oficial oferece também “Ensaiar sem nota — 22 sinais”, que abre a prática técnica existente. A prática segue com seu conjunto de 22 sinais e janela de 1.400 ms, fora do histórico oficial. O minuto oficial e as três etapas diagnósticas de 20 segundos mantêm seus contratos e configurações.

## Validação e limites

Testes verificam a ocultação do comando na espera/pausa, os seis resultados, o descarte do observador, a equivalência dos snapshots/tempos com e sem feedback, os contadores separados, a prática sem histórico e o salvamento/repetição. O roteiro nativo mantém os 22 acertos da prática e acrescenta uma rodada oficial em tempo natural com um erro de cada categoria, pausa, nota recalculada pela fórmula anterior e leitura do IndexedDB real. O preview compilado verifica antecipação, pausa e descarte da cena.

As capturas antes/depois usam a mesma sequência para revisar a apresentação; seus tempos naturais variam e não são benchmark. Evidências executadas ficam em [VALIDATION.md](VALIDATION.md). Latência física, sensação do comando, aceitação artística e calibração com jogadores continuam no [roteiro manual](QA.md). Não há dependência nova, alteração de assets, migração, regravação de tentativas antigas ou mudança das versões de métricas/pontuação.
