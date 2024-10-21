/*
Copyright 2021-2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import "./demo.css"
import React from "react";
import { DemoPage } from "./demoPage";
import DemoForm from "./demoForm";
import DemoDataGrid from "./demoDatagrid";
import DemoTable from "./demoTable";
import DemoDualSelection from "./demoDualSelection";
import { VscodeButton } from "@vscode-elements/react-elements";
import DemoGroup from "./demoGroup";
import DemoTree from "./demoTree";

enum DemoEnum {
  None,
  Page,
  Form,
  FormCustomActions,
  FormGroups,
  FormVerticalGroups,
  DataGrid,
  DataGridMultiRow,
  DataGridLocale,
  DualSelection,
  Table,
  TableHighlightRows,
  TableHighlightGroup,
  TableZebra,
  Tree
}
export function Demo() {
  const [demo, setDemo] = React.useState<DemoEnum>(DemoEnum.None);

  return (
    <React.StrictMode>
      <div className="demo-left-side tds-column-container">
        <VscodeButton onClick={() => setDemo(DemoEnum.Page)}>TdsPage</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.Form)}>TdsForm</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.FormCustomActions)}>TdsForm (custom actions)</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.FormGroups)}>TdsForm with Groups</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.FormVerticalGroups)}>TdsForm with Vertical Groups</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.DataGrid)}>TdsDataGrid</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.DataGridMultiRow)}>TdsDataGrid (MultiRow)</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.DataGridLocale)}>TdsDataGrid (pt-BR)</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.Table)}>TdsTable</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.TableHighlightRows)}>TdsTable (highlight rows)</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.TableHighlightGroup)}>TdsTable (highlight groups)</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.TableZebra)}>TdsTable (zebra)</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.DualSelection)}>Dual Selection List</VscodeButton>
        <VscodeButton onClick={() => setDemo(DemoEnum.Tree)}>Tree</VscodeButton>
      </div>
      <div className="demo-right-side" id="root">
        {demo == 0 && <>
          <div id="warning">
            <h3>Painel de Demo</h3>
            <p>Selecione ao lado a demo desejada.</p>
          </div>
        </>}
        {demo == DemoEnum.Page && <DemoPage />}
        {demo == DemoEnum.Form && <DemoForm />}
        {demo == DemoEnum.FormCustomActions && <DemoForm customActions={true} />}
        {demo == DemoEnum.FormGroups && <DemoGroup />}
        {demo == DemoEnum.FormVerticalGroups && <DemoGroup orientation="vertical" />}
        {demo == DemoEnum.DataGrid && <DemoDataGrid />}
        {demo == DemoEnum.DataGridMultiRow && <DemoDataGrid multiRow={true} />}
        {demo == DemoEnum.DataGridLocale && <DemoDataGrid locale="pt-BR" />}
        {demo == DemoEnum.DualSelection && <DemoDualSelection />}
        {demo == DemoEnum.Table && <DemoTable />}
        {demo == DemoEnum.TableHighlightRows && <DemoTable highlightRows={[2, 5, 8, 11, 14]} />}
        {demo == DemoEnum.TableHighlightGroup && <DemoTable highlightGroups={{
          "demo-table-g1": [0, 1, 2],
          "demo-table-g2": [6, 7, 8],
        }}
        />}
        {demo == DemoEnum.TableZebra && <DemoTable highlightGroups={{
          "demo-table-g1": (row, index) => index % 2 == 0,
        }}
        />}
        {demo == DemoEnum.Tree && <DemoTree />}

        <div className="demo-console" id="console">
          <>
            Última mensagem emitida por componentes.
          </>
        </div>
      </div>
    </React.StrictMode >)
}
