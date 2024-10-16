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

import "./demoForm.css";
import React from "react";
import { sendSaveAndClose, ReceiveMessage, CommonCommandEnum } from "../utilities/common-command-webview";
import { IFormAction, setDataModel, setErrorModel, TdsForm } from "../components/form/form";
import { TdsPage } from "../components/page/page";
import { TdsTextField } from "../components/fields/textField";
import { tdsVscode } from "../utilities/vscodeWrapper";
import { TdsNumericField } from "../components/fields/numericField";
import { TdsCheckBoxField } from "../components/fields/checkBoxField";
import { TdsSelectionField } from "../components/fields/selectionField";
import { TdsSelectionFileField, TdsSelectionFolderField } from "../components/fields/selectionResourceField";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TDemoModel>

type TDemoModel = {
    name: string;
    age: number;

}

type TDemoFormProps = {
    customActions?: boolean;
}

export default function DemoForm(props: TDemoFormProps) {

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

    const customActions: IFormAction[] = [{
        id: 0,
        caption: tdsVscode.l10n.t("_Link"),
        type: "link",
        href: "command:tds-gaia.clear",
    }, {
        id: 1,
        caption: tdsVscode.l10n.t("_Button"),
        type: "button",
        href: "command:tds-gaia.help",
    },
        , {
        id: 1,
        caption: tdsVscode.l10n.t("_Checkbox"),
        type: "checkbox",
        href: "command:tds-gaia.help",
    }];

    return (
        <TdsPage title="Demo: TdsForm" showFooter={true}>
            <TdsForm<TDemoModel>
                onSubmit={onSubmit}
                description={props.customActions ? tdsVscode.l10n.t("_Customized Food Operations") : tdsVscode.l10n.t("_Main components of a form")}
                actions={props.customActions ? customActions : undefined}
            >
                <section className="tds-row-container" >
                    <TdsTextField
                        name="name"
                        label={tdsVscode.l10n.t("_Name")}
                        info={tdsVscode.l10n.t("_Enter a name to identify the user")}
                        rules={{ required: true }}
                    />

                    <TdsNumericField
                        name="age"
                        label={tdsVscode.l10n.t("_Age")}
                        info={tdsVscode.l10n.t("_Enter the Age")}
                        rules={{
                            required: true,
                            min: { value: 1, message: tdsVscode.l10n.t("_[Age] is not valid range. Min: 18 Max: 60") },
                            max: { value: 60, message: tdsVscode.l10n.t("_[Age] is not valid range. Min: 1 Max: 60") }
                        }} />
                </section>

                <section className="tds-row-container" >
                    <TdsTextField
                        name="name"
                        label={tdsVscode.l10n.t("_First Column")}
                        rules={{ required: true }}
                        placeholder="First Columns: sempre ocupa o máximo da largura"
                    />
                </section>

                {!props.customActions && <>
                    <section className="tds-row-container" >
                        <TdsTextField
                            name="name"
                            label={tdsVscode.l10n.t("_First Column")}
                            rules={{ required: true }}
                            placeholder="First Columns: sempre ocupa o máximo da largura"
                        />
                        <TdsTextField
                            name="name"
                            label={tdsVscode.l10n.t("_Second Column")}
                            rules={{ required: true }}
                            placeholder="Second Column"
                        />
                    </section>

                    <section className="tds-row-container" >
                        <TdsTextField
                            name="name"
                            label={tdsVscode.l10n.t("_First Column")}
                            rules={{ required: true }}
                            placeholder="First Columns: sempre ocupa o máximo da largura"
                        />

                        <TdsTextField
                            name="name"
                            label={tdsVscode.l10n.t("_Second Column")}
                            rules={{ required: true }}
                            placeholder="Second Column"
                        />

                    </section>

                    <section className="tds-row-container" >
                        <TdsCheckBoxField
                            checked={false}
                            name="ofLegalAge"
                            label={tdsVscode.l10n.t("_CheckBox")}
                        />

                        <TdsSelectionField
                            name="name"
                            label={tdsVscode.l10n.t("_Selection List")}
                            options={[
                                { value: "1", text: "Option 1" },
                                { value: "2", text: "Option 2" },
                                { value: "3", text: "Option 3" },
                                { value: "4", text: "Option 4" },
                                { value: "5", text: "Option 5" },
                            ]}
                        />

                    </section>

                    <section className="tds-row-container" >
                        <TdsSelectionFileField />
                        <TdsSelectionFolderField />
                    </section>
                </>
                }
            </TdsForm>
        </TdsPage>
    );
}

