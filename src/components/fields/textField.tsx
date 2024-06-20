/*
Copyright 2024 TOTVS S.A

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

import { VSCodeTextArea, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { ControllerFieldState, UseFormReturn, useController, useFormContext } from "react-hook-form";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";

type TdsTextFieldProps = TdsFieldProps & {
    textArea?: boolean
    placeholder?: string;
    size?: number;
    cols?: number;
    rows?: number;
    format?: (value: string) => string;
};

/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * @param props
 *
 * @returns
 */
export function TdsTextField(props: TdsTextFieldProps): React.ReactElement {
    const { register, control, getValues, getFieldState } = useFormContext();
    const fieldState: ControllerFieldState = getFieldState(props.name);

    return (
        <section
            className={`tds-field-container tds-text-field ${props.className ? props.className : ''}`}
        >
            <label
                htmlFor={props.name}
            >
                {props.label}
                {props.rules?.required && <span className="tds-required" />}
            </label>
            {props.textArea ?? false ? (
                <VSCodeTextArea
                    readOnly={props.readOnly || false}
                    placeholder={props.placeholder}
                    resize="vertical"
                    cols={props.cols ?? 30}
                    rows={props.rows ?? 15}
                    onInput={props.onInput}
                    key={`text_area_${props.name}`}
                    value={props.format ? props.format(getValues(props.name) as string) : getValues(props.name)}
                    {...register(`${props.name}` as const, props.rules)}
                >
                    <PopupMessage field={props} fieldState={fieldState} />
                </VSCodeTextArea>
            ) : (
                <VSCodeTextField
                    readOnly={props.readOnly || false}
                    placeholder={props.placeholder}
                    size={props.size ?? 30}
                    onInput={props.onInput}
                    key={`text_field_${props.name}`}
                    value={props.format ? props.format(getValues(props.name) as string) : getValues(props.name)}
                    {...register(`${props.name}` as const, props.rules)}
                >
                    <PopupMessage field={props} fieldState={fieldState} />
                </VSCodeTextField>
            )}
        </section>
    )
}