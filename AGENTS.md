# Entrega e publicação

- O produto é um treinador web para computador, teclado e mouse. Use o checkout existente; cada tarefa na nuvem já é isolada.
- O proprietário pediu que as alterações entregues sejam atualizadas no GitHub e no site. Depois de validar as mudanças solicitadas, crie um commit e envie para `main` em `weberthy40-ctrl/Dead-or-Dodge`. O workflow Pages publica automaticamente após a validação remota. Essa autorização permanece para as próximas alterações solicitadas neste projeto.
- Preserve trabalho existente e o histórico remoto. Atualize a referência remota antes de enviar; não use force-push para contornar divergências.
- Execute `npm run check` quando houver mudança de comportamento. Em uma máquina de nuvem isolada que necessite dessa opção, use `QA_NO_SANDBOX=1 npm run check`. Ajustes só de documentação não exigem repetir as suítes de gameplay.
- Depois do push, acompanhe o workflow de Pages e confira o site publicado. Relate o link e o estado real do deploy; um push bem-sucedido não equivale a publicação concluída. Investigue e corrija falhas de instalação, validação ou deployment que estejam no escopo.
- Não publique dependências instaladas, builds locais, logs, artefatos de QA, credenciais ou dados de jogador. O workflow gera `dist` para o Pages.
- As regras atuais estão em `docs/CURRENT_SCOPE.md`; comandos de QA e limites em `docs/QA.md`. Preserve notas e backups existentes. Documente mudanças nos contratos de pontuação e persistência.

- A direção de produto atual é [RIFT LAB](docs/RIFT_LAB_VISION.md). Jornada e avaliação são opcionais; o Normal aceita escolha livre de níveis. Preserve a resposta dos controles e a independência entre arte, colisões e pontuação. O protagonista usa base KayKit CC0 adaptada; mantenha os créditos e distinga componentes originais de reutilizados.
