# TDS-WebToolKit, standard UI for TDS products [Português](README.MD)

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

The **TDS-Webtoolkit** extension is a set of components for the development of **VSCode** extensions and recommended for those who want to develop **VSCode** extensions for products **TDS**, following the development standard Visual of [** TOTVS**](https://github.com/totvs), with agility and ease.

## Resources

- Standardized components (visual and use)
- Visual integrated with the **VSCode** themes
- Based on [**React**](https://www.npmjs.com/package/react)
- Panel abstractions (_WebViewPanel_) and data models

## Installation

In the main folder of the project, run the command:

```bash
npm i @totvs/tds-webtoolkit
```

## Non-visual component

## Visual components

Visual components based on **React** and **@vscode-Elements**, which streamlines the creation of views, simplifying and standardizing them through visual (theme), definitions (properties) and of **React** operating details, but without losing flexibility in developing more complex views.

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

## Demonstration

To perform the demonstrations of the various components, do:

1. Compile the extension
```bash
npm run compile
```

2. Start **Vite** server
```bash
npm run start:vite
```

3. Start the execution of the  ``Demo (port 3000)`` launcher
