# Publicação no GitHub Pages

Repositório: [weberthy40-ctrl/Dead-or-Dodge](https://github.com/weberthy40-ctrl/Dead-or-Dodge).

Endereço do site após o deployment: **https://weberthy40-ctrl.github.io/Dead-or-Dodge/**.

Cada push em `main` aciona [Publicar site de teste](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions/workflows/pages.yml). O workflow instala pelo lockfile, executa `npm run check`, gera o build e publica `dist`. Se a validação falhar, aquele workflow não publica a nova versão. Não é necessário instalar Node para jogar no site.

## Atualizações solicitadas

O proprietário autorizou que as próximas alterações entregues sejam commitadas e enviadas ao GitHub, com acompanhamento da publicação. Essa orientação está em [AGENTS.md](../AGENTS.md).

Após cada mudança:

1. Validar o escopo alterado e atualizar os documentos necessários.
2. Conferir o histórico remoto, criar o commit e enviar para `main` sem sobrescrever alterações remotas.
3. Acompanhar o workflow correspondente ao commit e confirmar os jobs de build/deploy.
4. Abrir o endereço público e verificar a versão servida. Informar o link e qualquer bloqueio real; não tratar o envio dos arquivos como prova de publicação.

## Configuração do repositório

Em [Settings → Pages](https://github.com/weberthy40-ctrl/Dead-or-Dodge/settings/pages), a fonte deve ser **GitHub Actions**. A configuração inicial pode ser ativada pela API do GitHub com permissão de administração. A execução manual opcional fica em [Actions → Publicar site de teste](https://github.com/weberthy40-ctrl/Dead-or-Dodge/actions/workflows/pages.yml), em **Run workflow → main**.

O Vite usa caminhos relativos (`base: './'`), compatíveis com a subpasta do repositório. Não envie `node_modules`, `dist`, logs ou perfis de navegador; o workflow cria os artefatos necessários. Os arquivos fonte podem ser baixados em [Code → Download ZIP](https://github.com/weberthy40-ctrl/Dead-or-Dodge/archive/refs/heads/main.zip).

O progresso continua local ao navegador e à origem do site. Os dados usados em outra porta, perfil ou servidor local não são sincronizados ao publicar; use o backup da aplicação para transferi-los.
