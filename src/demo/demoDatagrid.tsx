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

import "./demoDatagrid.css";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { sendSaveAndClose, ReceiveMessage, CommonCommandEnum } from "../utilities/common-command-webview";
import { setDataModel, setErrorModel, TdsForm } from "../components/form/form";
import { TdsPage } from "../components/page/page";
import { tdsVscode } from "../utilities/vscodeWrapper";
import { TdsDataGrid, TTdsDataGridColumnDef } from "../components/dataGrid";
import countries from './countries.json'; // This import style requires "esModuleInterop", see "side notes"

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TDemoModel>

type TCountry = {
    name: string;
    capital: string;
    population: number;
    area: number;
    continent: string;
    independenceDate: Date;
}

type TDemoModel = {
    datasource: TCountry[];
}

type TDemoDataGridProps = {
    multiRow: boolean;
    locale?: string;
}

export default function DemoDatagrid(props: TDemoDataGridProps) {
    const methods = useForm<TDemoModel>({
        defaultValues: {
            datasource: countries.map((country) => {
                return {
                    ...country,
                    independenceDate: new Date(`${country.independenceDate}T00:00:00`)
                }
            })
        },
        mode: "all"
    })

    if (props.locale) {
        tdsVscode.l10n.translations = { formatLocale: props.locale };
    }
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

    function columnsDef(): TTdsDataGridColumnDef[] {
        return [
            {
                type: "string",
                name: "name",
                label: tdsVscode.l10n.t("Country"),
                width: "8fr",
                sortDirection: "asc",
                rowGroup: props.multiRow ? 0 : undefined,
            },
            {
                type: "string",
                name: "capital",
                label: tdsVscode.l10n.t("Capital"),
                width: "10fr",
                rowGroup: props.multiRow ? 0 : undefined,
            },
            {
                type: "number",
                name: "population",
                label: tdsVscode.l10n.t("Population"),
                width: "5fr",
                rowGroup: props.multiRow ? 1 : undefined,
            },
            {
                type: "number",
                name: "area",
                label: tdsVscode.l10n.t("Area"),
                width: "4fr",
                rowGroup: props.multiRow ? 1 : undefined,
            },
            {
                type: "string",
                name: "continent",
                label: tdsVscode.l10n.t("Continent"),
                width: "10fr",
                grouping: true,
                rowGroup: props.multiRow ? 0 : undefined,
            },
            {
                type: "datetime",
                name: "independenceDate",
                label: tdsVscode.l10n.t("Independence"),
                width: "10fr",
                displayType: "datetime",
                rowGroup: props.multiRow ? 1 : undefined,
            }
        ];
    }

    const model: TDemoModel = methods.getValues();
    //const indexFirstPathFree: number = model.includePaths.findIndex((row: TIncludePath) => row.path == "");

    //    actions={formActions}
    return (
        <TdsPage title="Demo: TdsDataGrid" >
            <TdsForm<TDemoModel>
                methods={methods}
                actions={[]}
                onSubmit={onSubmit}>

                <TdsDataGrid id={"result_dataGrid"}
                    columnsDef={columnsDef()}
                    dataSource={model.datasource}
                    options={{
                        grouping: true,
                        pageSize: 10,
                        pageSizeOptions: [5, 10, 15, 20, 25, 50, 100],
                        rowSeparator: props.multiRow
                    }} />
            </TdsForm>
        </TdsPage>
    );
}

