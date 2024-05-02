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
exports.TdsForm = exports.setErrorModel = exports.setDataModel = exports.getDefaultActionsForm = void 0;
require("./form.css");
const react_hook_form_1 = require("react-hook-form");
const react_1 = require("@vscode/webview-ui-toolkit/react");
const react_2 = __importDefault(require("react"));
const common_command_webview_1 = require("../../utilities/common-command-webview");
/**
 * Returns the default set of actions for the form.
 *
 * The default actions include:
 * - Save: Submits the form and closes the page. Enabled when form is dirty and valid.
 * - Close: Closes the page without saving.
 * - Clear: Resets the form fields. Initially hidden.
 */
function getDefaultActionsForm() {
    return [
        {
            id: -1,
            caption: "Save",
            hint: "Salva as informações e fecha a página",
            //appearance: "primary", evita que enter acione o botão
            type: "button",
            isProcessRing: true,
            enabled: (isDirty, isValid) => {
                return isDirty && isValid;
            },
        },
        {
            id: -2,
            caption: "Close",
            hint: "Fecha a página, sem salvar as informações",
            appearance: "secondary",
            onClick: () => {
                (0, common_command_webview_1.sendClose)();
            },
        },
        {
            id: -3,
            caption: "Clear",
            hint: "Reinicia os campos do formulário",
            appearance: "secondary",
            type: "reset",
            visible: false
        }
    ];
}
exports.getDefaultActionsForm = getDefaultActionsForm;
/**
 * Sets form values from a data model object.
 * Maps the data model object values to the form values by field name.
 * Handles undefined values to avoid errors.
 *
 * Passing ``setValue`` is necessary, as this function
 * is executed outside the form context.
*/
function setDataModel(setValue, dataModel) {
    if (dataModel) {
        Object.keys(dataModel).forEach((fieldName) => {
            if (dataModel[fieldName] !== undefined) {
                setValue(fieldName, dataModel[fieldName]);
            }
            else {
                console.error(`Erro chamar setValue no campo ${fieldName}`);
            }
        });
    }
    else {
        console.error("Parâmetro [DataModel] não informando (indefinido)");
    }
}
exports.setDataModel = setDataModel;
/**
 * Sets form field errors from an error model object.
 * Maps the error model object to field errors by field name.
 * Handles undefined error values to avoid errors.
 *
 * Passing ``setError`` is necessary, as this function
 * is executed outside the form context.
*
*/
function setErrorModel(setError, errorModel) {
    if (errorModel) {
        Object.keys(errorModel).forEach((fieldName) => {
            var _a, _b;
            if (errorModel[fieldName] !== undefined) {
                setError(fieldName, {
                    message: (_a = errorModel[fieldName]) === null || _a === void 0 ? void 0 : _a.message,
                    type: (_b = errorModel[fieldName]) === null || _b === void 0 ? void 0 : _b.type
                });
            }
            else {
                console.error(`Erro ao chamar setError no campo ${fieldName}`);
            }
        });
    }
}
exports.setErrorModel = setErrorModel;
/**
 *
 * Se usar em _hook_ useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
let isProcessRing = false;
/**
 * Renders a form component with state management and actions.
 *
 * Accepts a generic DataModel for the form values and errors.
 * Provides form state values and common form handling methods.
 * Renders form content, messages, and action buttons.
 * Handles submit and reset events.
 */
function TdsForm(props) {
    const { formState: { errors, isDirty, isValid, isSubmitting }, } = (0, react_hook_form_1.useFormContext)();
    let actions = props.actions ? props.actions : getDefaultActionsForm();
    if (isSubmitting && (actions.length > 0)) {
        isProcessRing = props.isProcessRing !== undefined ? props.isProcessRing : true;
    }
    else if (!isValid) {
        isProcessRing = props.isProcessRing !== undefined ? props.isProcessRing : false;
    }
    actions.forEach((action) => {
        action.isProcessRing = (action.isProcessRing !== undefined ? action.isProcessRing && isProcessRing : undefined);
    });
    const id = props.id ? props.id : "form";
    const children = react_2.default.Children.toArray(props.children);
    return (<form className="tds-form" id={id} onSubmit={props.methods.handleSubmit(props.onSubmit)} onReset={() => (0, common_command_webview_1.sendReset)(props.methods.getValues())} autoComplete="off">
			<section className={"tds-form-content"}>
				{...children}
			</section>
			<section className="tds-form-footer">
				<div className="tds-message">
					{errors.root && <span className={`tds-error`}>{errors.root.message}.</span>}
					{isProcessRing && <><react_1.VSCodeProgressRing /><span>Wait please. Processing...</span></>}
				</div>
				<div className="tds-actions">
					{actions.map((action) => {
            let propsField = {};
            let visible = "";
            if (typeof action.id === "string") {
                propsField["id"] = action.id;
            }
            propsField["key"] = action.id;
            propsField["type"] = action.type || "button";
            if (isProcessRing) {
                propsField["disabled"] = true;
            }
            else if (action.enabled !== undefined) {
                if (typeof action.enabled === "function") {
                    propsField["disabled"] = !action.enabled(isDirty, isValid);
                }
                else {
                    propsField["disabled"] = !action.enabled;
                }
            }
            if (action.appearance) {
                propsField["appearance"] = action.appearance;
            }
            if (action.onClick) {
                propsField["onClick"] = action.onClick;
            }
            if (action.visible !== undefined) {
                let isVisible;
                if (action.visible = typeof action.visible === "function") {
                    isVisible = (Function)(action.visible)(isDirty, isValid);
                }
                else {
                    isVisible = action.visible;
                }
                visible = isVisible ? "" : "tds-hidden";
            }
            return (action.type == "link" ?
                <react_1.VSCodeLink key={action.id} href={action.href}>{action.caption}
							</react_1.VSCodeLink>
                : <react_1.VSCodeButton className={`tds-button-button ${visible}`} {...propsField}>
								{action.caption}
							</react_1.VSCodeButton>);
        })}
				</div>
			</section>
		</form>);
}
exports.TdsForm = TdsForm;
