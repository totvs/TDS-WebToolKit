# TDS-WebToolKit, standard UI for TDS products [English](README-EN.MD)

<!-- prettier-ignore-start -->
[![GitHub license](https://img.shields.io/github/license/totvs/tds-webtoolKit?style=plastic)](https://github.com/totvs/tds-webtoolKit/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/totvs/tds-webtoolKit?style=plastic)](https://github.com/totvs/tds-webtoolKit/issues)
[![GitHub forks](https://img.shields.io/github/forks/totvs/tds-webtoolKit?style=plastic)](https://github.com/totvs/tds-webtoolKit/network)
<!-- markdownlint-disable -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- markdownlint-enabled -->
<!-- prettier-ignore-end -->

A extensão **TDS-WebToolKit** é um conjunto de componentes para o desenvolvimento de extensões **VSCode** e recomendado para quem deseja desenvolver extensões **VSCode** para os produtos **TDS**, seguindo o padrão de desenvolvimento visual da [**TOTVS**](https://github.com/totvs), com agilidade e facilidade.

## Funcionalidades

- Componentes padronizados (visual e uso)
- Visual integrado aos temas do **VSCode**
- Baseado em [**React**](https://www.npmjs.com/package/react)
- Abstrações de painéis (_WebViewPanel_) e modelos de dados

## Instalação

Na pasta principal do projeto, execute o comando:

```bash
npm i @totvs/tds-webtoolkit
```

## Componente não visual

## Componentes visuais

Componentes visuais baseados em **React** e **@vscode-elements**, que agiliza a criação de visões (_views_), simplificando e padronizando-as através da abstração do visual (tema), de definições (propriedades) e de detalhes de funcionamento do **React**, mas sem perder a flexibilidade no desenvolvimento de visões mais complexas.

- TdsPage
- TdsForm
- TdsCheckBoxField
- TdsLabelField
- TdsNumericField
- TdsSelectionField
- TdsSelectionResourceField
- TdsSimpleCheckBoxField
- TdsSimpleLabelField
- TdsTextField
- TdsButton

## Demonstração

Para executar as demonstrações dos diversos componentes, faça:

1. Compile a extensão
```bash
npm run compile
```

2. Inicie o servidor Vite
```bash
npm run start:vite
```

3. Inicie a execução do lançador ``Demo (port 3000)``
