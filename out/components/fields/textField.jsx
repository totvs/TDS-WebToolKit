"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TdsTextField = void 0;
const react_1 = require("@vscode/webview-ui-toolkit/react");
const react_hook_form_1 = require("react-hook-form");
const popup_message_1 = __importDefault(require("../popup-message/popup-message"));
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
function TdsTextField(props) {
    var _a, _b, _c, _d, _e;
    const { register } = (0, react_hook_form_1.useFormContext)();
    const { field, fieldState } = (0, react_hook_form_1.useController)(props);
    const registerField = register(props.name, props.rules);
    // // https://github.com/microsoft/vscode-webview-ui-toolkit/blob/main/src/react/README.md#use-oninput-instead-of-onchange-to-handle-keystrokes
    //  if (props.onInput) {
    // //     registerField.onInput = props.onInput;
    // // }
    return (<section className={`tds-field-container tds-text-field ${props.className ? props.className : ''}`}>
            <label htmlFor={field.name}>
                {props.label}
                {((_a = props.rules) === null || _a === void 0 ? void 0 : _a.required) && <span className="tds-required"/>}
            </label>
            {((_b = props.textArea) !== null && _b !== void 0 ? _b : false) ? (<react_1.VSCodeTextArea readOnly={props.readOnly || false} {...registerField} placeholder={props.placeholder} resize="vertical" cols={(_c = props.cols) !== null && _c !== void 0 ? _c : 30} rows={(_d = props.rows) !== null && _d !== void 0 ? _d : 15} onInput={props.onInput}>
                    <popup_message_1.default field={props} fieldState={fieldState}/>
                </react_1.VSCodeTextArea>) : (<react_1.VSCodeTextField readOnly={props.readOnly || false} {...registerField} placeholder={props.placeholder} size={(_e = props.size) !== null && _e !== void 0 ? _e : 30} onInput={props.onInput}>
                    <popup_message_1.default field={props} fieldState={fieldState}/>
                </react_1.VSCodeTextField>)}
        </section>);
}
exports.TdsTextField = TdsTextField;
