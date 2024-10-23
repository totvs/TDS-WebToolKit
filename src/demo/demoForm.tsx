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
import { TdsPage } from "../components/page/page";
import { tdsVscode } from "../utilities/vscodeWrapper";
import { TdsForm, TdsFormAction } from "../components/form/form";
import { TdsTextField, TdsTypeField } from "../components/fields/textField";
import { TdsSelectionField } from "../components/fields/selectionField";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TDemoModel>

type TDemoModel = {
    name: string;
    age: number;

}

type TDemoFormProps = {
    _customActions?: boolean;
}

export default function DemoForm(props: TDemoFormProps) {
    const [variantType, setVariantType] = React.useState<TdsTypeField>("text");

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

    const customActions: TdsFormAction[] = [{
        id: 0,
        caption: tdsVscode.l10n.t("_Link"),
        type: "link",
        //href: "command:tds-gaia.clear",
    }, {
        id: 1,
        caption: tdsVscode.l10n.t("_Button"),
        type: "button",
        //href: "command:tds-gaia.help",
    },
        , {
        id: 1,
        caption: tdsVscode.l10n.t("_Checkbox"),
        type: "checkbox",
        //href: "command:tds-gaia.help",
    }];

    /*
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
                                { value: "1",label: "Option 1" },
                                { value: "2",label: "Option 2" },
                                { value: "3",label: "Option 3" },
                                { value: "4",label: "Option 4" },
                                { value: "5",label: "Option 5" },
                            ]}
                        />

                    </section>

                    <section className="tds-row-container" >
                        <TdsSelectionFileField />
                        <TdsSelectionFolderField />
                    </section>
                </>
                }
                */
    return (
        <TdsPage title="Demo: TdsForm" showFooter={true} >
            <TdsForm<TDemoModel>
                onSubmit={onSubmit}
                actions={props._customActions ? customActions : undefined}
                onActionEvent={(action: TdsFormAction) => {
                    console.log(action);
                }}
                description={props._customActions ? tdsVscode.l10n.t("_Customized Food Operations") : tdsVscode.l10n.t("_Main components of a form")}
            >
                <TdsTextField
                    name="name"
                    label={tdsVscode.l10n.t("_Name")}
                    info={tdsVscode.l10n.t("_Enter a name to identify the user")}
                    rules={{ required: true }}
                />
                <TdsTextField
                    name="character"
                    label={tdsVscode.l10n.t("_Favorite")}
                    info={tdsVscode.l10n.t("_Favorite character among: Donald Duck or Mickey")}
                    rules={{
                        required: true,
                        pattern: /Donald Duck|Mickey/i
                    }}
                />
                <TdsSelectionField
                    name="fieldType" label={tdsVscode.l10n.t("_Field Type")} options={[
                        { value: "text", label: "text", selected: true },
                        { value: "password", label: "password" },
                        { value: "email", label: "e-mail" },
                        { value: "number", label: "number" },
                        { value: "tel", label: "tel" },
                        { value: "url", label: "url" },
                        { value: "date", label: "date" },
                        { value: "time", label: "time" },
                        { value: "datetime-local", label: "datetime-local" },
                        { value: "month", label: "month" },
                        { value: "week", label: "week" },
                        { value: "color", label: "color" },
                        { value: "search", label: "search" }
                    ]}
                    onChange={(e: any) => {
                        setVariantType(e.currentTarget.value);
                    }}
                />
                <TdsTextField
                    type={variantType}
                    name="variantField"
                    label={tdsVscode.l10n.t("_Variant Field")}
                    info={tdsVscode.l10n.t(`_Inform the value according to the type: ${variantType}`)}
                    rules={{
                        required: true,
                    }}
                    placeholder={`Enter a value: (${variantType})`}
                />
            </TdsForm>
        </TdsPage >
    );
}

