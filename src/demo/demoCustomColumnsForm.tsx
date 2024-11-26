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

import "./demoCustomColumnsForm.css";
import React from "react";
import { sendSaveAndClose, ReceiveMessage, CommonCommandEnum } from "../utilities/common-command-webview";
import { TdsPage } from "../components/page/page";
import { tdsVscode } from "../utilities/vscodeWrapper";
import { getDefaultActionsForm, TdsForm, TdsFormAction } from "../components/form/form";
import { TdsTextField, TdsTypeField } from "../components/fields/textField";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TDemoModel>

type TDemoModel = {
    fieldR1C1: string;
    fieldR1C2: string;
    fieldR1C3: string;
    fieldR1C4: string;
    fieldR1C5: string;
    fieldR2C1: string;
    fieldR2C2: string;
    fieldR2C3: string;
    fieldR3C1: string;
    fieldR3C2: string;
    fieldR4C1: string;
}

type TDemoFormProps = {
}

export default function DemoCustomColumnsForm(props: TDemoFormProps) {
    const methods: UseFormReturn<TDemoModel> = useForm<TDemoModel>({
        defaultValues: {
            fieldR1C1: "_Row 1 - 1 Col",
            fieldR1C2: "_Row 1 - 2 Col",
            fieldR1C3: "_Row 1 - 3 Col",
            fieldR1C4: "_Row 1 - 4 Col",
            fieldR2C1: "_Row 2 - 1 Col",
            fieldR2C2: "_Row 2 - 2 Col",
            fieldR2C3: "_Row 2 - 3 Col",
            fieldR3C1: "_Row 3 - 1 Col",
            fieldR3C2: "_Row 3 - 2 Col",
            fieldR4C1: "_Row 4 - 1 Col",
        },
        mode: "all"
    })
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

    return (
        <TdsPage id="demoForm" title="Demo: TdsForm" showFooter={true} >
            <FormProvider {...methods}>
                <TdsForm<TDemoModel>
                    id="frmDemoForm"
                    onSubmit={methods.handleSubmit(onSubmit)}
                    actions={getDefaultActionsForm()}
                    onActionEvent={(action: TdsFormAction) => {
                        console.log(action);
                    }}
                    description={tdsVscode.l10n.t("_Customized Columns")}
                    columnWidths={"repeat(3, auto)"}
                >
                    <TdsTextField
                        name="fieldR1C1"
                        label={tdsVscode.l10n.t("_Field Width=C1")}
                        info={tdsVscode.l10n.t("_This field occupies 1/5 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR1C2"
                        label={tdsVscode.l10n.t("_Field Width=C1")}
                        info={tdsVscode.l10n.t("_This field occupies 1/5 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR1C3"
                        label={tdsVscode.l10n.t("_Field Width=C1")}
                        info={tdsVscode.l10n.t("_This field occupies 1/5 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR1C4"
                        label={tdsVscode.l10n.t("_Field Width=C1")}
                        info={tdsVscode.l10n.t("_This field occupies 1/5 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR1C5"
                        label={tdsVscode.l10n.t("_Field Width=C1")}
                        info={tdsVscode.l10n.t("_This field occupies 1/5 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR2C1"
                        label={tdsVscode.l10n.t("_Field Width=C3")}
                        info={tdsVscode.l10n.t("_This field occupies 1/3 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR2C2"
                        label={tdsVscode.l10n.t("_Field Width=C3")}
                        info={tdsVscode.l10n.t("_This field occupies 1/3 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR2C3"
                        label={tdsVscode.l10n.t("_Field Width=C3")}
                        info={tdsVscode.l10n.t("_This field occupies 1/3 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR3C1"
                        label={tdsVscode.l10n.t("_Field Width=C3")}
                        info={tdsVscode.l10n.t("_This field occupies 1/3 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR3C2"
                        label={tdsVscode.l10n.t("_Field Width=C3")}
                        info={tdsVscode.l10n.t("_This field occupies 1/3 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR4C1"
                        label={tdsVscode.l10n.t("_Field Width=C3")}
                        info={tdsVscode.l10n.t("_This field occupies 1/3 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                    <TdsTextField
                        name="fieldR4C2"
                        label={tdsVscode.l10n.t("_Field Width=C3")}
                        info={tdsVscode.l10n.t("_This field occupies 1/3 columns")}
                        rules={{ required: true }}
                        readOnly={false}
                    />
                </TdsForm>
            </FormProvider>
        </TdsPage >
    );
}

