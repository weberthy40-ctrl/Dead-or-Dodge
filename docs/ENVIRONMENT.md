# Desenvolvimento na nuvem

Checkout deste ambiente: `/workspace/Dead-or-Dodge`. O conteúdo do ZIP recebido foi incorporado a esse repositório na rc.15; a distribuição original permanece preservada fora do checkout para comparação. Cada tarefa já tem isolamento; não é necessário criar worktree.

Requisitos: Node 24.19.0 e npm compatível; Chrome/Chromium para testes de navegador. Não há backend, banco externo ou credenciais de aplicação. Use a configuração de proxy e certificados fornecida pelo ambiente.

```sh
cd /workspace/Dead-or-Dodge
npm ci --cache /workspace/.cache/npm --no-fund
QA_NO_SANDBOX=1 npm run check
```

`QA_NO_SANDBOX=1` é uma opção para o Chrome nesta máquina isolada; não é requisito no computador pessoal. O runner gerencia os seus próprios processos e portas; não depende de um Chrome ou servidor retido da sessão anterior. As portas e processos são temporários e o perfil de QA é descartado.

Para desenvolver: `npm run dev -- --host 0.0.0.0 --port 5173 --strictPort`. Para inspecionar o build: `npm run build` e `npm run preview`. Use requisições locais e [QA.md](QA.md) para validação; não é necessário publicar o site para testar.

Os comandos deste documento não afirmam que uma configuração reutilizável foi salva, publicada ou restaurada em nova tarefa. A publicação do ambiente e a do site são operações distintas. O progresso do jogador fica no navegador e não é sincronizado por nenhuma delas.
