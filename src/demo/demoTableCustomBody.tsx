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

import "./demoTableCustomBody.css";
import React from "react";
//import { SubmitHandler, useForm } from "react-hook-form";
import { sendSaveAndClose, ReceiveMessage, CommonCommandEnum } from "../utilities/common-command-webview";
import { setDataModel, setErrorModel, TdsForm } from "../components/form/form";
import { TdsPage } from "../components/page/page";
import { tdsVscode } from "../utilities/vscodeWrapper";
import countries from './countries.json'; // This import style requires "esModuleInterop", see "side notes"
import { TdsTable } from "../components/table";
import { TTdsTableColumn } from "../components/table/table.type";
import { VscodeTableCell, VscodeTableRow } from "@vscode-elements/react-elements";

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
    dataSource: TCountry[];
}

type TDemoTableCustomBodyProps = {
    dataSource: TCountry[];
}

export default function DemoTableCustomBody(props: TDemoTableCustomBodyProps) {
    // const methods = useForm<TDemoModel>({
    //     defaultValues: {
    //         datasource: countries.map((country: any) => {
    //             return {
    //                 ...country,
    //                 independenceDate: new Date(country.independenceDate),
    //                 area: Number.parseInt(country.area)
    //             } as TCountry
    //         })
    //     },
    //     mode: "all"
    // })

    const onSubmit = (data: TDemoModel) => {
        sendSaveAndClose(data);
    }

    React.useEffect(() => {
        const listener = (event: any) => {
            const command: ReceiveCommand = event.data as ReceiveCommand;

            switch (command.command) {
                case CommonCommandEnum.UpdateModel:
                    const model: TDemoModel = command.data.model;
                    const errors: any = command.data.errors;

                    // setDataModel<TDemoModel>(methods.setValue, model);
                    // setErrorModel(methods.setError, errors);

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
                name: "country",
                type: "string",
                label: tdsVscode.l10n.t("_Country/Population"),
            },
            {
                name: "capital",
                type: "string",
                label: tdsVscode.l10n.t("_Capital/Area"),
            },
            {
                name: "continent",
                type: "number",
                label: tdsVscode.l10n.t("_Continent/Independence"),
            },
        ];
    }

    const model: TDemoModel = {
        dataSource: countries.map((country: any) => {
            return {
                ...country,
                independenceDate: new Date(country.independenceDate),
                area: Number.parseInt(country.area)
            } as TCountry
        })
    }

    return (
        <TdsPage title="Demo: TdsTable (Custom Body)">
            <TdsForm<TDemoModel>
                actions={[]}
                onSubmit={onSubmit}>

                <TdsTable id={"result_table"}
                    columns={columnsDef()}
                    dataSource={model.dataSource}
                    onCustomBody={(dataSource: any[]) => <>
                        {
                            dataSource.map((row: any, index: number) => {
                                return (
                                    <>
                                        <VscodeTableRow key={index}>
                                            <VscodeTableCell key={`${index}.1`} grid-column="1">{row.name}</VscodeTableCell>
                                            <VscodeTableCell key={`${index}.2`} grid-column="2">{row.capital}</VscodeTableCell>
                                            <VscodeTableCell key={`${index}.3`} grid-column="3">{row.continent}</VscodeTableCell>
                                        </VscodeTableRow>
                                        <VscodeTableRow key={index}>
                                            <VscodeTableCell key={`${index}.4`} grid-column="1">{row.population}</VscodeTableCell>
                                            <VscodeTableCell key={`${index}.5`} grid-column="2">{row.area}</VscodeTableCell>
                                            <VscodeTableCell key={`${index}.6`} grid-column="3">{row.independenceDate}</VscodeTableCell>
                                        </VscodeTableRow>
                                    </>
                                );
                            })
                        }
                    </>
                    }
                />
            </TdsForm >
        </TdsPage >
    );
}

