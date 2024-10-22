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

import "./demoDualSelection.css";
import React from "react";
import { sendSaveAndClose, ReceiveMessage, CommonCommandEnum } from "../utilities/common-command-webview";
import { setDataModel, setErrorModel, TdsForm } from "../components/form/form";
import { TdsPage } from "../components/page/page";
import { tdsVscode } from "../utilities/vscodeWrapper";
import { TdsDataGrid, TTdsDataGridColumnDef } from "../components/dataGrid";
import countries from './countries.json'; // This import style requires "esModuleInterop", see "side notes"
import { VscodeButton } from "@vscode-elements/react-elements";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TDemoModelDualSelectionModel>

type TCountry = {
    mark: boolean,
    name: string;
    capital: string;
    population: number;
    area: number;
    continent: string;
    independenceDate: Date;
}

type TDemoModelDualSelectionModel = {
    left: TCountry[];
    right: TCountry[];
}

export default function DemoDualSelection() {
    const loadData = () => {
        return countries.map((country) => {
            return {
                ...country,
                independenceDate: new Date(`${country.independenceDate}T00:00:00`),
                mark: false
            }
        })
    };
    // const methods = useForm<TDemoModelDualSelectionModel>({
    //     defaultValues: {
    //         left: countries.map((country) => {
    //             return {
    //                 ...country,
    //                 independenceDate: new Date(`${country.independenceDate}T00:00:00`),
    //                 mark: false
    //             }
    //         }),
    //         right: []
    //     },
    //     mode: "all"
    // })
    // const [leftSide, setLeftSide] = React.useState<TCountry[]>(loadData());
    // const [rightSide, setRightSide] = React.useState<TCountry[]>([]);

    // const { fields: fieldsLeft, append: appendLeft, remove: removeLeft } = useFieldArray(
    //     {
    //         control: methods.control,
    //         name: "left"
    //     });

    // const { fields: fieldsRight, append: appendRight, remove: removeRight } = useFieldArray(
    //     {
    //         control: methods.control,
    //         name: "right"
    //     });

    const onSubmit = (data: TDemoModelDualSelectionModel) => {
        sendSaveAndClose(data);
    }

    React.useEffect(() => {
        const listener = (event: any) => {
            const command: ReceiveCommand = event.data as ReceiveCommand;

            switch (command.command) {
                case CommonCommandEnum.UpdateModel:
                    const model: TDemoModelDualSelectionModel = command.data.model as any as TDemoModelDualSelectionModel;
                    const errors: any = command.data.errors;

                    // setDataModel<TDemoModelDualSelectionModel>(methods.setValue, model);
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

    function columnsDef(): TTdsDataGridColumnDef[] {
        return [
            {
                type: "boolean",
                name: "mark",
                label: " ",
                width: "30px",
                sortable: false,
                readOnly: false,
                onChange: (e: any, fieldName: string, row: any[]) => {
                    const target = e.target as HTMLInputElement;
                    const parts = fieldName.split(".");

                    if (fieldName === "left") {
                        //fieldsLeft[parseInt(parts[1])].mark = target.checked;
                    } else {
                        //fieldsRight[parseInt(parts[1])].mark = target.checked;
                    }
                }
            },
            {
                type: "string",
                name: "name",
                label: tdsVscode.l10n.t("_Country"),
                width: "8fr",
                sortDirection: "asc",
            },
            {
                type: "string",
                name: "capital",
                label: tdsVscode.l10n.t("_Capital"),
                width: "10fr",
            }
        ];
    }

    return (
        <TdsPage title="Demo: Dual Selection Model" >
            <TdsForm<TDemoModelDualSelectionModel>
                key="x"
                actions={[]}
                onSubmit={onSubmit}
                onActionEvent={(action) => console.log(action)}
            >

                <section className="tds-row-container" id="selectGrid" >

                    <TdsDataGrid id={"leftDataGrid"}
                        columnsDef={columnsDef()}
                        dataSource={[]/*fieldsLeft*/}
                        modelField="left"
                        options={{
                            pageSize: 10,
                            pageSizeOptions: [],
                        }} />

                    <section className="tds-row-container-column" id="directionButtons" >
                        <VscodeButton
                            disabled={false /*fieldsLeft.length == 0*/}
                            onClick={() => {
                                const indexes: number[] = [];
                                // const x = methods.getValues();
                                // const objects = fieldsLeft
                                //     .filter((value: TCountry, index: number) => {
                                //         if (value.mark) {
                                //             indexes.push(index);
                                //         }

                                //         return value.mark;
                                //     })

                                // appendRight(objects);
                                // removeLeft(indexes);
                            }} >
                            <span className="codicon codicon-arrow-right"></span>
                        </VscodeButton>
                        <VscodeButton
                            disabled={false /*fieldsRight.length == 0*/}
                            onClick={() => {
                                const indexes: number[] = [];
                                // const objects = fieldsRight
                                //     .filter((value: TCountry, index: number) => {
                                //         if (value.mark) {
                                //             indexes.push(index);
                                //         }

                                //         return value.mark;
                                //     })

                                // appendLeft(objects);
                                // removeRight(indexes);
                            }} >
                            <span className="codicon codicon-arrow-left"></span>
                        </VscodeButton>
                    </section>
                    <TdsDataGrid id={"rightDataGrid"}
                        columnsDef={columnsDef()}
                        dataSource={[] /*fieldsRight*/}
                        modelField={"right"}
                        options={{
                            pageSize: 10,
                            pageSizeOptions: [],
                        }} />

                </section>
            </TdsForm>
        </TdsPage >
    );
}
