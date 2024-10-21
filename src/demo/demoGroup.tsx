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

import "./demoGroup.css";
import React from "react";
import { sendSaveAndClose, ReceiveMessage, CommonCommandEnum } from "../utilities/common-command-webview";
import { TdsForm, TdsFormLayout } from "../components/form/form";
import { TdsPage } from "../components/page/page";
import { tdsVscode } from "../utilities/vscodeWrapper";
import { TdsCheckBox } from "../components/fields/checkBoxField";
import { TdsCheckBoxGroup } from "../components/fields/checkBoxGroup";
import { TdsRadioGroup } from "../components/fields/checkRadioGroup";
import { TdsRadio } from "../components/fields/radioField";

enum ReceiveCommandEnum {
}

type ReceiveCommand = ReceiveMessage<CommonCommandEnum & ReceiveCommandEnum, TDemoModel>

type TDemoModel = {
    name: string;
    age: number;

}

type TDemoFormProps = {
    orientation?: TdsFormLayout;
}

export default function DemoGroup(props: TDemoFormProps) {

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
        <TdsPage title="Demo: TdsForm with Groups" showFooter={true}>
            <TdsForm<TDemoModel>
                onSubmit={onSubmit}
                description={tdsVscode.l10n.t("_Form with Groups Fields")}
                formLayout="horizontal"
                onActionEvent={(action: any) => {
                    console.log("onActionEvent", action);
                }}
            >
                <section className="tds-row-container" >
                    <TdsCheckBoxGroup
                        name="words"
                        orientation={props.orientation}
                        label={tdsVscode.l10n.t("_Select Words")}
                        info={tdsVscode.l10n.t("Select one or more words")} >
                        <TdsCheckBox name={"loren"} label={"Loren"} checked={false} />
                        <TdsCheckBox name={"ipsun"} label={"Ipsun"} checked={false} />
                        <TdsCheckBox name={"dolor"} label={"Dolor"} checked={false} />
                    </TdsCheckBoxGroup>
                </section>

                <section className="tds-row-container" >
                    <TdsRadioGroup orientation={props.orientation}
                        key={"one-word"}
                        name="one-word"
                        label={tdsVscode.l10n.t("_Select One Word")}
                        info={tdsVscode.l10n.t("Select one word")}
                        rules={{ required: true }}>
                        <TdsRadio label={"Loren"} checked={false} />
                        <TdsRadio label={"Ipsun"} checked={false} />
                        <TdsRadio label={"Dolor"} checked={false} />
                    </TdsRadioGroup>
                </section>

            </TdsForm>
        </TdsPage >
    );
}

