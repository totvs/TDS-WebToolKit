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
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { sendSaveAndClose, ReceiveMessage, CommonCommandEnum } from "../utilities/common-command-webview";
import { setDataModel, setErrorModel, TdsForm } from "../components/form/form";
import { TdsPage } from "../components/page/page";
import { TdsTextField } from "../components/fields/textField";
import { tdsVscode } from "../utilities/vscodeWrapper";
import { TdsNumericField } from "../components/fields/numericField";
import { TdsCheckBoxField } from "../components/fields/checkBoxField";
import { TdsSelectionField } from "../components/fields/selectionField";
import { TdsSelectionFileField } from "../components/fields/selectionResourceField";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TDemoModel>

type TDemoModel = {
    name: string;
    age: number;

}
export default function DemoForm() {
    const methods = useForm<TDemoModel>({
        defaultValues: {
            name: "",
            age: 0
        },
        mode: "all"
    })

    // const { fields, remove, insert } = useFieldArray(
    //     {
    //         control: methods.control,
    //         name: "includePaths"
    //     });

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

    // function addIncludePath(folder: string, index: number) {

    //     if (methods.getValues().includePaths.findIndex((includePath: TIncludePath) => includePath.path.toLowerCase() == folder.toLowerCase()) == -1) {
    //         remove(index);
    //         insert(index, { path: folder });
    //     };
    // }

    // function removeIncludePath(index: number) {
    //     remove(index);
    //     insert(index + 1, { path: "" });
    // }

    const model: TDemoModel = methods.getValues();
    //const indexFirstPathFree: number = model.includePaths.findIndex((row: TIncludePath) => row.path == "");

    return (
        <TdsPage title="Demo: TdsForm" showFooter={true}>
            <TdsForm<TDemoModel>
                methods={methods}
                onSubmit={onSubmit}
                description={"Principais componentes de um formulários"}>

                <section className="tds-row-container" >
                    <TdsTextField
                        name="name"
                        label={tdsVscode.l10n.t("Name")}
                        info={tdsVscode.l10n.t("Enter a name to identify the user")}
                        rules={{ required: true }}
                    />

                    <TdsNumericField
                        name="age"
                        label={tdsVscode.l10n.t("Age")}
                        info={tdsVscode.l10n.t("Enter the Age")}
                        rules={{
                            required: true,
                            min: { value: 1, message: tdsVscode.l10n.t("[Age] is not valid range. Min: 18 Max: 60") },
                            max: { value: 60, message: tdsVscode.l10n.t("[Age] is not valid range. Min: 1 Max: 60") }
                        }} />
                </section>

                <section className="tds-row-container" >
                    <TdsTextField
                        name="name"
                        label={tdsVscode.l10n.t("First Column")}
                        rules={{ required: true }}
                        placeholder="First Columns: sempre ocupa o máximo da largura"
                    />
                </section>

                <section className="tds-row-container" >
                    <TdsTextField
                        name="name"
                        label={tdsVscode.l10n.t("First Column")}
                        rules={{ required: true }}
                        placeholder="First Columns: sempre ocupa o máximo da largura"
                    />
                    <TdsTextField
                        name="name"
                        label={tdsVscode.l10n.t("Second Column")}
                        rules={{ required: true }}
                        placeholder="Second Column"
                    />
                </section>

                <section className="tds-row-container" >
                    <TdsTextField
                        name="name"
                        label={tdsVscode.l10n.t("First Column")}
                        rules={{ required: true }}
                        placeholder="First Columns: sempre ocupa o máximo da largura"
                    />

                    <TdsTextField
                        name="name"
                        label={tdsVscode.l10n.t("Second Column")}
                        rules={{ required: true }}
                        placeholder="Second Column"
                    />

                    <TdsCheckBoxField
                        name="age"
                        label={tdsVscode.l10n.t("CheckBox")}
                    />
                </section>

                <section className="tds-row-container" >
                    <TdsSelectionField
                        name="name"
                        label={tdsVscode.l10n.t("Selection List")}
                        options={[
                            { value: "1", text: "Option 1" },
                            { value: "2", text: "Option 2" },
                            { value: "3", text: "Option 3" },
                            { value: "4", text: "Option 4" },
                            { value: "5", text: "Option 5" },
                        ]}
                    />

                    <TdsSelectionFileField />
                </section>
            </TdsForm>
        </TdsPage>
    );
}

