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
import DemoDatagrid from "./demoDatagrid";
import DemoTable from "./demoTable";

export function Demo() {
  const [demo, setDemo] = React.useState<number>(0);

  return (
    <React.StrictMode>
      <TdsPage title="TOTVS Web Toolkit: Demo" showFooter={true}>
        <div className="demo-left-side tds-column-container">
          <VSCodeButton onClick={() => setDemo(1)}>TdsPage</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(2)}>TdsForm</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(3)}>TdsDataGrid</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(4)}>TdsDataGrid (MultiRow)</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(5)}>TdsDataGrid (pt-BR)</VSCodeButton>
          <VSCodeButton onClick={() => setDemo(6)}>TdsTable</VSCodeButton>
        </div>
        <div className="demo-right-side" id="root">
          {demo == 0 && <>
            <div id="warning">
              <h3>Painel de Demo</h3>
              <p>As cores dos componentes não são necessariamente a mesma do VSCode.</p>
              <p>Selecione ao lado a demo desejada.</p>
            </div>
          </>}
          {demo == 1 && <DemoPage />}
          {demo == 2 && <DemoForm />}
          {demo == 3 && <DemoDatagrid multiRow={false} />}
          {demo == 4 && <DemoDatagrid multiRow={true} />}
          {demo == 5 && <DemoDatagrid multiRow={false} locale="pt-BR" />}
          {demo == 6 && <DemoTable />}
        </div>
      </TdsPage>
      {/* <div className="demo-console" id="demo-console">
        <>
          Abra o console do navegador, para observar as mensagens emitidas pelos componentes
        </>
      </div> */}
    </React.StrictMode >)
}
