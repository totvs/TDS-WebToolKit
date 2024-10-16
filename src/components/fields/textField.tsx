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

import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";
import { mdToHtml } from "../mdToHtml";
import { VscodeFormGroup, VscodeTextarea, VscodeTextfield } from "@vscode-elements/react-elements";
import { VscodeLabel, VscodeFormHelper } from "@vscode-elements/react-elements";

type TdsTextFieldProps = TdsFieldProps & {
    textArea?: boolean
    placeholder?: string;
    size?: number;
    cols?: number;
    rows?: number;
    value?: string;
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
export function TdsTextField(props: TdsTextFieldProps): any {
    const textValue: string = props.value !== undefined ? props.value : "currentValue"

    return (
        <VscodeFormGroup variant="vertical"
            key={props.name}
        >
            <VscodeLabel htmlFor={props.name}
                required={props.rules?.required || false}
            >
                {mdToHtml(props.label || props.name)}
            </VscodeLabel>
            <VscodeTextfield name={props.name}
                readonly={props.rules?.readOnly || false}
                required={props.rules?.required || false}
                placeholder={props.placeholder}
            />
            {props.info &&
                <VscodeFormHelper>
                    {mdToHtml(props.info)}
                </VscodeFormHelper>
            }
        </VscodeFormGroup>
    )
    return (
        <section
            className={`tds-field-container tds-text-field ${props.className ? props.className : ''}`}
        >
            <label
                htmlFor={props.name}
            >
                {mdToHtml(props.label)}
                {props.rules?.required && <span className="tds-required" />}
            </label>
            {props.textArea ?? false ? (
                <VscodeTextarea
                    placeholder={props.placeholder}
                    resize="vertical"
                    cols={props.cols ?? 30}
                    rows={props.rows ?? 15}
                    onInput={props.onInput}
                    key={`text_area_${props.name}`}
                    value={textValue}
                >
                    <PopupMessage field={props} />
                </VscodeTextarea>
            ) : (
                <>
                    <VscodeTextfield
                        placeholder={props.placeholder}
                        onInput={props.onInput}
                        onChange={props.onChange}
                        key={`text_field_${props.name}`}
                        value={textValue}
                    >
                        <PopupMessage field={props} />
                    </VscodeTextfield>
                </>
            )}
        </section>
    )
}