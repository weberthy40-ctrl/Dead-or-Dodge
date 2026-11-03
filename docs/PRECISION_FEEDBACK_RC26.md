# Precisão — leitura e orientação — 1.0.0-rc.26

Incremento para distinguir a ordem do grupo, o prazo de cada alvo e o motivo de um erro. Reutiliza os grupos, movimentos, níveis e pontuação existentes.

## Alvos e mensagens

O próximo alvo de uma sequência mantém o verde e recebe uma marca branca interna. O atraso recebe um símbolo ! persistente, além da cor laranja dos demais alvos atrasados. Quando o próximo alvo atrasa, a marca de próximo e o símbolo de prazo aparecem juntos. Ambos ficam inteiramente dentro da esfera lógica; não recebem raycast nem ampliam a área válida de clique.

Uma faixa na região superior reservada aos controles informa escolha livre ou o próximo número exigido. Uma mensagem curta confirma acerto, clique sem alvo, ordem incorreta ou prazo excedido. A instrução de sequência continua visível enquanto a mensagem muda. A faixa usa cores neutras e não cobre a região permitida para gerar alvos na câmera padrão.

As mensagens vêm de eventos observados da prática, com identificação da tentativa. O observador guarda somente a mensagem mais recente por até 1,2 segundos de tempo ativo; a pausa congela sua duração. Reiniciar ou sair remove a assinatura. Não há histórico crescente de cliques nem inferência a partir de cores ou texto de HUD.

## Resultado e prática

O resultado usa um diálogo com ações visíveis e confirmação de salvamento. Destaca acertos, cliques sem alvo, erros de ordem e alvos atrasados. Os erros de ordem já integram o contador oficial de erros; a apresentação calcula os demais erros como `misses - orderErrors`. Atrasos são eventos de prazo, não cliques adicionais. Métricas completas, componentes da nota e cautelas permanecem expansíveis.

A orientação pode sugerir conferir a sequência, priorizar o centro, localizar os alvos mais cedo ou repetir para comparar consistência. Os limiares são provisórios: erros de ordem em quantidade igual ou maior que os demais erros, pelo menos 15% dos cliques sem alvo, ou algum atraso. Menos de 12 acertos recebe o mesmo aviso de amostra pequena usado na avaliação existente. Não há estimativa de habilidade, elo ou subida automática de nível.

“Jogar novamente” repete a condição selecionada. O atalho “Ensaiar sem nota — ajustes do nível 4” abre a prática técnica existente, cuja configuração continua no nível 4. Essa prática permanece fora do histórico oficial. O foco volta ao canvas ao iniciar/retomar para que ESC responda imediatamente.

## Contratos preservados

As esferas, áreas de clique, validação de projeção, distribuição aleatória, movimentos, tamanhos, tempos e grupos de 4–10 alvos não mudam. Nos grupos mistos, o alvo atrasado continua até o acerto e o prazo é contado uma única vez por alvo. A troca de padrão exige concluir o grupo.

Os eventos `precision:feedback` não entram nos snapshots oficiais, métricas, pontuação, banco ou backups. Versões de métricas e score permanecem iguais; não há migração ou regravação de dados. Nenhuma dependência ou asset externo foi acrescentado.

## Validação

Testes verificam equivalência de snapshots com e sem observador, classificação dos cliques/prazos, pausa, descarte, geometria interna das marcas, ausência de raycast, recursos compartilhados e formato de salvamento. A suíte de navegador clica nos pixels das esferas, conclui quatro grupos, provoca uma ordem incorreta e um clique fora, termina a rodada, verifica o IndexedDB e repete. O preview compilado confere a orientação e ESC com entrada nativa.

As capturas antes/depois usam o mesmo seed e relógio controlado para comparar grupos e prazos. Isso não mede latência física. Evidências executadas estão em [VALIDATION.md](VALIDATION.md); sensação de clique e clareza em hardware real continuam no [roteiro manual](QA.md).
