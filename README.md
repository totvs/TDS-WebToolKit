# TDS-WebToolKit, standard UI for TDS products

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

- VSCodeAPIWrapper

### TdsPanel

Abstração de um painel (_WebViewPanel_) com base em modelo de dados e com procedimentos pré-definidos. Além destes, o desenvolvedor por customizar o comportamento do painel, sobrescrevendo métodos, reaproveitando comandos pré-existentes ou adicionando seus próprios comandos.

## Componentes visuais

Componentes visuais baseados em **React** e **VSCode-WebToolkit**, que agiliza a criação de visões (_views_), simplificando e padronizando-as através da abstração do visual (tema), de definições (propriedades) e de detalhes de funcionamento do **React**, mas sem perder a flexibilidade no desenvolvimento de visões mais complexas.

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
