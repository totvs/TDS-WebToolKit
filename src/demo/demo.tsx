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
import { TdsPage } from "../components/page/page";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { DemoPage } from "./demoPage";
import DemoForm from "./demoForm";
import DemoDataGrid from "./demoDatagrid";
import DemoTable from "./demoTable";
import DemoTableCustomBody from "./demoTableCustomBody";

enum DemoEnum {
  None,
  Page,
  Form,
  FormCustomActions,
  DataGrid,
  DataGridMultiRow,
  DataGridLocale,
  DataGridSelectRow,
  Table,
  TableHighlightRows,
  TableHighlightGroup,
  TableZebra
}
export function Demo() {
  const [demo, setDemo] = React.useState<DemoEnum>(DemoEnum.None);

  return (
    <React.StrictMode>
      <TdsPage title="TOTVS Web Toolkit: Demo" showFooter={true}>
        <div className="demo-left-side tds-column-container">
          <VSCodeButton onClick={() => setDemo(DemoEnum.Page)}>TdsPage</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.Form)}>TdsForm</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.FormCustomActions)}>TdsForm (custom actions)</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.DataGrid)}>TdsDataGrid</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.DataGridMultiRow)}>TdsDataGrid (MultiRow)</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.DataGridLocale)}>TdsDataGrid (pt-BR)</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.DataGridSelectRow)}>TdsDataGrid (select row)</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.Table)}>TdsTable</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.TableHighlightRows)}>TdsTable (highlight rows)</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.TableHighlightGroup)}>TdsTable (highlight groups)</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(DemoEnum.TableZebra)}>TdsTable (zebra)</VSCodeButton>
        </div>
        <div className="demo-right-side" id="root">
          {demo == 0 && <>
            <div id="warning">
              <h3>Painel de Demo</h3>
              <p>As cores dos componentes não são necessariamente a mesma do VSCode.</p>
              <p>Selecione ao lado a demo desejada.</p>
            </div>
          </>}
          {demo == DemoEnum.Page && <DemoPage />}
          {demo == DemoEnum.Form && <DemoForm />}
          {demo == DemoEnum.FormCustomActions && <DemoForm customActions={true} />}
          {demo == DemoEnum.DataGrid && <DemoDataGrid />}
          {demo == DemoEnum.DataGridMultiRow && <DemoDataGrid multiRow={true} />}
          {demo == DemoEnum.DataGridLocale && <DemoDataGrid locale="pt-BR" />}
          {demo == DemoEnum.DataGridSelectRow && <DemoDataGrid selectRow={true} locale="pt-BR" />}
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
        </div>
      </TdsPage>
      {/* <div className="demo-console" id="demo-console">
        <>
          Abra o console do navegador, para observar as mensagens emitidas pelos componentes
        </>
      </div> */}
    </React.StrictMode >)
}
