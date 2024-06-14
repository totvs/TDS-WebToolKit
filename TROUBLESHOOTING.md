# Resolução de Problemas

> Antes de abrir uma nova **Ocorrência (_issue_)**:
> Verifique se a extensão esta atualizada (`Manage | Check for Update..`) e se necessário, faça as atualizações e refaça a operação que esta gerando uma ocorrência.
> Verifique se o seu problema está na lista de problemas conhecidos e se existe uma solução de contorno para ele. Caso contrário abra uma nova **Ocorrência** e adicione o maior número de informações possíveis (veja abaixo na seção **"Informações importantes"**) para ajudar a identificar a causa do problema.
> **Ocorrências** abertas sem as **informações importantes** serão analisadas somente após receberem tais informações.

## Obtendo mensagem ``Invalid hook call. Hooks can only be called inside of the body..``

Essa ocorrência pode ocorrer por vários motivos. No caso dela acontecer ao usar essa extensão/biblioteca, pode tentar corrigir adicionando a propriedades ``alias`` no ``webpack.config.js`` como mostrado abaixo:

```json
...
    resolve: {
...
      alias: {
        react: path.resolve('./node_modules/react')
      }
...      
    },
...
```

Fonte: [Hooks + multiple instances of React](https://github.com/facebook/react/issues/13991), acessado 06/2024.
