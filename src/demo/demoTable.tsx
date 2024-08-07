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

import "./demoTable.css";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { sendSaveAndClose, ReceiveMessage, CommonCommandEnum } from "../utilities/common-command-webview";
import { setDataModel, setErrorModel, TdsForm } from "../components/form/form";
import { TdsPage } from "../components/page/page";
import { tdsVscode } from "../utilities/vscodeWrapper";
import countries from './countries.json'; // This import style requires "esModuleInterop", see "side notes"
import { TdsTable } from "../components/table";
import { TTdsTableColumn } from "../components/table/table.type";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TDemoModel>

type TCountry = {
    name: string;
    capital: string;
    area: number;
}

type TDemoModel = {
    datasource: TCountry[];
}

type TDemoTableProps = {
    highlightRows?: number[];
    highlightGroups?: Record<string, number[]>;
}

export default function DemoTable(props: TDemoTableProps) {
    const methods = useForm<TDemoModel>({
        defaultValues: {
            datasource: countries.map((country: any) => {
                return {
                    name: country.name,
                    capital: country.capital,
                    area: Number.parseInt(country.area)
                }
            })
        },
        mode: "all"
    })

    const onSubmit: SubmitHandler<TDemoModel> = (data) => {
        sendSaveAndClose(data);
    }

    React.useEffect(() => {
        const listener = (event: any) => {
            const command: ReceiveCommand = event.data as ReceiveCommand;

            switch (command.command) {
                case CommonCommandEnum.UpdateModel:
                    const model: TDemoModel = command.data.model;
                    const errors: any = command.data.errors;

                    setDataModel<TDemoModel>(methods.setValue, model);
                    setErrorModel(methods.setError, errors);

                    break;
                default:
                    break;
            }
        };

        window.addEventListener('message', listener);

        return () => {
            window.removeEventListener('message', listener);
        }
    }, []);

    function columnsDef(): TTdsTableColumn[] {
        return [
            {
                type: "string",
                label: tdsVscode.l10n.t("Country"),
            },
            {
                type: "string",
                label: tdsVscode.l10n.t("Capital"),
            },
            {
                type: "number",
                label: tdsVscode.l10n.t("Area"),
            },
        ];
    }

    const model: TDemoModel = methods.getValues();
    //const indexFirstPathFree: number = model.includePaths.findIndex((row: TIncludePath) => row.path == "");

    //    actions={formActions}
    return (
        <TdsPage title="Demo: TdsTable" >
            <TdsForm<TDemoModel>
                methods={methods}
                actions={[]}
                onSubmit={onSubmit}>

                <TdsTable id={"result_table"}
                    columns={columnsDef()}
                    dataSource={model.datasource}
                    highlightRows={props.highlightRows}
                    highlightGroups={props.highlightGroups}
                />
            </TdsForm>
        </TdsPage>
    );
}

