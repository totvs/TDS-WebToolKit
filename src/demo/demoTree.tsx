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

import "./demoTree.css";
import React, { Children } from "react";
import { sendSaveAndClose, ReceiveMessage, CommonCommandEnum } from "../utilities/common-command-webview";
import { TdsForm } from "../components/form/form";
import { TdsPage } from "../components/page/page";
import { tdsVscode } from "../utilities/vscodeWrapper";
import countries from './countries.json'; // This import style requires "esModuleInterop", see "side notes"
import { TdsTree, TdsTreeItem, TdsTreeItemAction } from "../components/tree/tree";
import { TreeItemDecoration } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";

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
    root: TdsTreeItem[];
}

type TDemoTreeProps = {
}

export default function DemoTree(props: TDemoTreeProps) {
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

    const rootValues: Record<string, number> = countries.reduce((acc, item: any) => {
        if (acc[item.continent]) {
            acc[item.continent] += 1;
        } else {
            acc[item.continent] = 1;
        }

        return acc;
    }, {} as Record<string, number>);

    const actions: TdsTreeItemAction[] = [
        {
            icon: "edit",
            actionId: "rename",
            tooltip: "Rename",
        },
        {
            icon: "trash",
            actionId: "delete",
            tooltip: "Delete",
        },
    ];

    const model: TDemoModel = {
        root: Object.keys(rootValues).map((key: string) => {
            const decorationCounter: TreeItemDecoration = {
                appearance: 'counter-badge',
                content: `${rootValues[key]}`

            };
            const decorationCircle: TreeItemDecoration = {
                appearance: 'filled-circle',
            };

            return {
                label: key,
                icons: true,
                actions: actions,
                decorations: [
                    decorationCounter,
                    decorationCircle
                ],
                subItems: countries.filter((element: any) => element.continent == key)
                    .map((element: any) => {
                        const decorationText: TreeItemDecoration = {
                            appearance: 'text',
                            content: tdsVscode.l10n.formatNumber(element.area),
                        };
                        const decorationColor: TreeItemDecoration = {
                            appearance: 'text',
                            content: `${tdsVscode.l10n.formatNumber(element.population / 1000000, "int", 0)}M`,
                            color: (element.population % 2 === 0) ? "red" : "blue"
                        };

                        return {
                            label: element.capital,
                            icons: true,
                            decorations: [
                                decorationText,
                                decorationColor
                            ]
                        }
                    })
            }
        })
    }

    return (
        <TdsPage title="Demo: TdsTree" >
            <TdsForm<TDemoModel>
                actions={[]}
                onSubmit={onSubmit}>

                <TdsTree id={"result_dataGrid"}
                    data={model.root}
                    onTreeAction={(e) => {
                        console.log(e);
                    }}
                    onTreeSelect={(e) => {
                        console.log(e);
                    }}
                // options={{
                // }}
                />
            </TdsForm>
        </TdsPage>
    );
}
