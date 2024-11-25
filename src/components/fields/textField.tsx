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

import React from "react";
import { TdsFieldProps } from "../form/form";
import { mdToHtml } from "../mdToHtml";
import { VscodeFormGroup, VscodeIcon, VscodeTextarea, VscodeTextfield } from "@vscode-elements/react-elements";
import { VscodeLabel, VscodeFormHelper } from "@vscode-elements/react-elements";
import { PageContext, TStatePage } from "../page/pageContext";
import { FieldError, GlobalError, useFormContext } from "react-hook-form";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { Children } from 'react';

export type TdsTypeField = "text" | "password" | "email" | "number" | "tel" | "url" | "date" | "time" | "datetime-local" | "month" | "week" | "color" | "search";

type TdsTextFieldProps = TdsFieldProps & {
    type?: TdsTypeField;
    textArea?: boolean
    placeholder?: string;
    size?: number;
    cols?: number;
    rows?: number;
    value?: string;
    format?: (value: string) => string;
    title?: string;
    children?: any
};

type TdsTextFieldProps2 = Omit<TdsFieldProps, "label"> & {
    type?: TdsTypeField;
    placeholder?: string;
    value?: string;
    format?: (value: string) => string;
    title?: string;
    showInfo?: boolean;
    children?: any
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
function buildMessage(props: TdsFieldProps & { fieldError: FieldError }): string {
    const { label, info, error: errorText } = props;
    let message: string = info || "";

    if (props.fieldError) {
        const error = props.fieldError;

        if (error.type == "required") {
            message = error.message || tdsVscode.l10n.t(`_[{0}] is required.`, label);
        } else if (error.type == "min") {
            message = error.message || tdsVscode.l10n.t(`_[{0}] is not valid range (min value).`, label);
        } else if (error.type == "max") {
            message = error.message || tdsVscode.l10n.t(`_[{0}] is not valid range (max value).`, label);
        } else {
            message = error.message || error.message || `${error.type}<Unknown>`
        }
    }

    return message;
}

function formHelper(props: TdsTextFieldProps & {
    fieldError: FieldError;
    tooltipVisible: any,
    mousePosition: any
}) {
    const pageContext: TStatePage = React.useContext(PageContext);

    if (props.fieldError) {
        console.log("Error", props.fieldError);
    }

    if (!pageContext.compact) {
        return (
            <VscodeFormHelper >
                {buildMessage({ ...props, fieldError: props.fieldError })}
            </VscodeFormHelper>
        );
    } else if (props.tooltipVisible) {
        return (
            <div
                style={{
                    position: 'absolute',
                    top: props.mousePosition.y + 10,
                    left: props.mousePosition.x + 10,
                    padding: '8px',
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                }}
            >
                {buildMessage({ ...props, fieldError: props.fieldError })}
            </div>
        );
    }

    return <></>;
}

export function TdsTextField(props: TdsTextFieldProps): any {
    const pageContext: TStatePage = React.useContext(PageContext);
    const methods = useFormContext();
    const { register, formState, getFieldState } = methods ? methods :
        { register: null, formState: null, getFieldState: null };
    const [tooltipVisible, setTooltipVisible] = React.useState(false);
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

    const handleMouseEnter = (e: React.MouseEvent) => {
        setTooltipVisible(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        const OFFSET_LEFT: number = 20;
        const OFFSET_TOP: number = 2;
        const popup = e.currentTarget as HTMLElement;
        const parent = popup.parentElement as HTMLElement;

        if (parent) {
            const width: number = parent.clientWidth - OFFSET_LEFT;
            const left: number = OFFSET_LEFT + parent.offsetLeft + width;
            const top: number = parent.offsetTop - OFFSET_TOP;
            setMousePosition({
                x: left,
                y: top,
            });
        } else {
            setMousePosition({
                x: e.clientX - 300, //revisar, acredito estar errado
                y: e.clientY - 100,
            });
        }
    };

    const handleMouseLeave = () => {
        setTooltipVisible(false);
    };

    const fieldError: FieldError | undefined = getFieldState ? getFieldState(props.name).error : undefined;

    return (
        <VscodeFormGroup variant={pageContext.formOrientation}
            key={props.name}
            id={`grp_${props.name}`}
        >
            {
                props.label &&
                <VscodeLabel
                    htmlFor={props.name}
                    required={props.rules?.required}
                >
                    {mdToHtml(props.label || props.name)}
                </VscodeLabel>
            }
            {
                register ?
                    <VscodeTextfield
                        {...register(`${props.name}`,
                            {
                                disabled: props.readOnly,
                                required: props.rules?.required,
                                maxLength: props.rules?.maxLength,
                                pattern: props.rules?.pattern || undefined
                            }) as any}
                        name={props.name}
                        type={props.type || "text"}
                        placeholder={props.placeholder}
                        title={props.title}
                    >
                        {...React.Children.toArray(props.children)}
                        {pageContext.compact &&
                            <VscodeIcon
                                slot="content-after"
                                name={fieldError ? "error" : "info"}
                                onMouseEnter={handleMouseEnter}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            />
                        }
                    </VscodeTextfield>
                    :
                    <VscodeTextfield
                        name={props.name}
                        type={props.type || "text"}
                        title={props.title}
                        readonly={props.readOnly || false}
                        required={props.rules?.required || false}
                        placeholder={props.placeholder}
                        pattern={props.rules?.pattern?.source || undefined}
                        onInput={(e: any) => {
                            if (props.onInput) {
                                e.preventDefault();
                                props.onInput(e);
                            }
                        }}
                    >
                        {...React.Children.toArray(props.children)}
                        {pageContext.compact &&
                            <VscodeIcon
                                slot="content-after"
                                name={props.error ? "error" : "info"}
                                onMouseEnter={handleMouseEnter}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            />
                        }
                    </VscodeTextfield>
            }

            {formHelper({
                ...props,
                fieldError: fieldError,
                tooltipVisible: tooltipVisible,
                mousePosition: mousePosition
            })}
        </VscodeFormGroup>
    )
}
