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

import "./form.css";
import React from "react";
import { ButtonAppearance } from "../vscode-elements";
import { sendClose } from "../../utilities/common-command-webview";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { TdsProgressRing } from "../decorator/progress-ring";
import { mdToHtml } from "../mdToHtml";
import { TdsAbstractModel } from "../../model/modelData";
import { VscodeButton, VscodeCheckbox, VscodeDivider } from "@vscode-elements/react-elements";
import { TdsLink } from './../decorator/link';

/**
 * Enum representing the default actions available in a form.
 *
 * - `Save`: Represents the action to save the form data and close the page.
 * - `Close`: Represents the action to close the page without saving.
 * - `Clear`: Represents the action to reset the form fields.
 */
export enum TdsFormActionsEnum {
	Save = -1,
	Close = -2,
	Clear = -3
}

/**
 * Returns the default set of actions for the form.
 *
 * The default actions include:
 * - Save: Submits the form and closes the page. Enabled when form is dirty and valid.
 * - Close: Closes the page without saving.
 * - Clear: Resets the form fields. Initially hidden.
 */
export function getDefaultActionsForm(): IFormAction[] {
	return [
		{
			id: TdsFormActionsEnum.Save,
			caption: tdsVscode.l10n.t("_Save"),
			hint: tdsVscode.l10n.t("_Save the information and close the page"),
			appearance: "primary", //enter acione o botão
			type: "submit",
			isProcessRing: true,
			enabled: (isDirty: boolean, isValid: boolean) => {
				return isDirty && isValid;
			},
		},
		{
			id: TdsFormActionsEnum.Close,
			caption: tdsVscode.l10n.t("_Close"),
			hint: tdsVscode.l10n.t("_Closes the page without saving the information"),
			onClick: () => {
				sendClose();
			},
		},
		{
			id: TdsFormActionsEnum.Clear,
			caption: tdsVscode.l10n.t("_Clear"),
			hint: tdsVscode.l10n.t("_Reset the fields"),
			type: "reset",
			visible: false,
			enabled: (isDirty: boolean, _isValid: boolean) => { // _ evita aviso de não utilizado
				return isDirty;
			},
		}
	];
}

/**
 * Returns the close  actions for the form.
 *
 */
export function getCloseActionForm(): IFormAction {
	return getDefaultActionsForm()
		.filter(action => action.id === TdsFormActionsEnum.Close)
		.map((action) => {
			action.appearance = "primary";

			return action;
		})[0];
}

/**
* Notas:
* - Usar _hook_ ``FormProvider`` antes de iniciar ``TDSForm``.
*   Esse _hook_ proverá informações para os elementos filhos e
*   fará a interface entre a aplicação e o formulário.
*
* - O tipo ``DataModel`` que complementa a definição de ``TDSFormProps``,
*   descreve a estrutura de dados do formulário. Normalmente,
*	você não precisa instanciar um objeto para armazenar os dados,
*   o _hook_ ``FormProvider`` proverá esse armazenamento e acesso aos dados,
*   através dos métodos ``getValues()``, ``setValues()``.
**/

/**
 * Defines the props shape for the TDSForm component.
 *
 * @template M - The data model type for the form.
 * @property {string} [id] - An optional unique identifier for the form.
 * @property {UseFormReturn<M>} methods - The form methods returned by the `useForm` hook.
 * @property {(data: any) => void} onSubmit - The function to call when the form is submitted.
 * @property {() => void} onReset - The function to call when the form is reset after reset default executed.
 * @property {IFormAction[]} [actions] - An optional array of form action buttons.
 * @property {React.ReactNode} children - The child components of the form.
 * @property {boolean} [isProcessRing] - An optional flag to show a processing indicator when necessary.
 * @property {string} [description] - An optional description for the form. You can use Markdown format.
 */
type TDSFormProps<M extends TdsAbstractModel> = {
	id?: string;
	onSubmit: (data: M) => void;
	onManualReset?: () => void;
	actions?: IFormAction[];
	children: any
	isProcessRing?: boolean;
	description?: string;
};

/**
 * Interface for form action buttons.
 * Defines the shape of action button configs used in TDS forms.
*/
export interface IFormAction {
	id: number | string;
	caption: string;
	hint?: string;
	onClick?: any;
	enabled?: boolean | ((isDirty: boolean, isValid: boolean) => boolean);
	visible?: boolean | ((isDirty: boolean, isValid: boolean) => boolean);
	isProcessRing?: boolean
	type?: "submit" | "reset" | "button" | "link" | "checkbox";
	appearance?: ButtonAppearance;
	href?: string;
}

export type TdsFieldRules = {
	readOnly?: boolean
	required?: boolean;
	min?: { value: number, message: string };
	max?: { value: number, message: string };
	pattern?: RegExp;
}
/**
 * Interface for form field components.
 * Defines the props shape for form fields.
 */
export type TdsFieldProps = {
	name: string;
	label: string;
	info?: string;
	className?: string;
	rules?: TdsFieldRules;
	//https://github.com/microsoft/vscode-webview-ui-toolkit/blob/main/src/react/README.md#use-oninput-instead-of-onchange-to-handle-keystrokes
	onInput?: React.FormEventHandler<any>; //VscodeTextfield
	onChange?: React.FormEventHandler<any>; //VscodeTextfield
}

/**
 * Sets form values from a data model object.
 * Maps the data model object values to the form values by field name.
 * Handles undefined values to avoid errors.
 *
 * Passing ``setValue`` is necessary, as this function
 * is executed outside the form context.
*/
export function setDataModel<M extends TdsAbstractModel>
	(setValue: any, dataModel: Partial<M>) {
	if (dataModel) {
		Object.keys(dataModel).forEach((fieldName: string) => {
			if (dataModel[fieldName] !== undefined) {
				setValue(fieldName as any, dataModel[fieldName]!);
			} else {
				console.error(`Erro chamar setValue no campo ${fieldName}`);
			}
		})
	} else {
		console.error("Parâmetro [DataModel] não informando (indefinido)");
	}
}

type TFieldError = {
	type: string;
	message?: string
};

type TFieldErrors<M> = Partial<Record<keyof M | "root", TFieldError>>;

/**
 * Sets form field errors from an error model object.
 * Maps the error model object to field errors by field name.
 * Handles undefined error values to avoid errors.
 *
 * Passing ``setError`` is necessary, as this function
 * is executed outside the form context.
*
*/
export function setErrorModel<M extends TdsAbstractModel>(setError: any, errorModel: TFieldErrors<M>) {
	if (errorModel) {
		Object.keys(errorModel).forEach((fieldName: string) => {
			if (errorModel[fieldName] !== undefined) {
				setError(fieldName as any, {
					message: errorModel[fieldName]?.message,
					type: errorModel[fieldName]?.type
				})
			} else {
				console.error(`Erro ao chamar setError no campo ${fieldName}`);
			}
		});
	}
}

/**
 *
 * Se usar em _hook_ useFieldArray, ver nota inicio do fonte.
 *
 * @param props
 * @returns
 */
let isProcessRing: boolean = false;

/**
 * Renders a form component with state management and actions.
 *
 * Accepts a generic DataModel for the form values and errors.
 * Provides form state values and common form handling methods.
 * Renders form content, messages, and action buttons.
 * Handles submit and reset events.
 */
export function TdsForm<M extends TdsAbstractModel>(props: TDSFormProps<M>): React.ReactElement {
	//const methods = props.methods;
	//const isSubmitting: boolean = methods ? methods.formState.isSubmitting : false;
	const isDirty: boolean = false;  //methods ? methods.formState.isDirty : false;
	const isValid: boolean = true;  //methods ?
	// 	(methods.formState.errors === undefined || Object.keys(methods.formState.errors).length === 0)
	//	: true;
	let actions: IFormAction[] = props.actions ? props.actions : getDefaultActionsForm();

	if (actions.length == 1) {
		actions[0].appearance = "primary"
	}

	// if (isSubmitting && (actions.length > 0)) {
	// 	isProcessRing = props.isProcessRing !== undefined ? props.isProcessRing : true;
	// } else if (!isValid) {
	// 	isProcessRing = props.isProcessRing !== undefined ? props.isProcessRing : false;
	// }

	actions.forEach((action: IFormAction) => {
		action.isProcessRing = (action.isProcessRing !== undefined ? action.isProcessRing && isProcessRing : undefined)
	});

	const id: string = props.id ? props.id : "form";
	const children = React.Children.toArray(props.children);

	return (
		<form className="tds-form"
			id={id}
			onSubmit={(e) => {
				e.preventDefault();
				console.log(e);
				const form = document.querySelector(`#${id}`) as HTMLFormElement;
				const fd = new FormData(form);
				let out: TdsAbstractModel = {};

				for (let [name, value] of fd) {
					out[name] = value;
				}

				props.onSubmit(out as M);
			}}
			onReset={(e) => {
				// if (methods) {
				// 	e.preventDefault();
				// 	methods.reset(methods.formState.defaultValues as DefaultValues<M>);
				// 	if (props.onManualReset) {
				// 		props.onManualReset();
				// 	}
				// }
			}}
			autoComplete="off"
		>
			{props.description && <h3>{mdToHtml(props.description)}</h3>}
			<section className={"tds-form-content"}>
				{...children}
			</section>

			<VscodeDivider role="presentation" />

			<section className="tds-form-footer">
				<div className="tds-message">
					!isValid && <span className={"tds-error"}>{tdsVscode.l10n.t("_There is invalid information. See the error by hovering the mouse over the field marking.")}</span>
					isProcessRing && isSubmitting && <><TdsProgressRing /><span>{tdsVscode.l10n.t("_Wait please. Processing...")}</span></>
				</div>
				<div className="tds-actions">
					{actions.map((action: IFormAction) => {
						let propsField: any = {};
						let visible: string = "";

						if (typeof action.id === "string") {
							propsField["id"] = action.id;
						}

						propsField["type"] = action.type || "button";

						if (isProcessRing) {
							propsField["disabled"] = true;
						} else if (action.enabled !== undefined) {
							if (typeof action.enabled === "function") {
								propsField["disabled"] = !(action.enabled as Function)(isDirty, isValid);
							} else {
								propsField["disabled"] = !action.enabled;
							}
						} else {
							propsField["disabled"] = false;
						}

						if (action.onClick) {
							propsField["onClick"] = action.onClick;
						}

						if (action.visible !== undefined) {
							let isVisible: boolean = false;

							if (action.visible = typeof action.visible === "function") {
								isVisible = (Function)(action.visible)(isDirty, isValid)
							} else {
								isVisible = action.visible;
							}

							visible = isVisible ? "" : "tds-hidden";
						}

						if (action.type == "link") {
							(<TdsLink
								key={action.id}
								href={action.href}
								title={action.hint}
							>{action.caption}
							</TdsLink>)
						} else if (action.type == "checkbox") {
							return (<VscodeCheckbox
								key={action.id}
								className={`tds-button-button ${visible}`}
								{...propsField} >
								{action.caption}
							</VscodeCheckbox>)
						} else {
							return (<VscodeButton
								key={action.id}
								className={`tds-button-button ${visible}`}
								title={action.hint}
								appearance={action.appearance || "secondary"}
								{...propsField}>
								{action.caption}
							</VscodeButton>)
						}
					})}
				</div>
			</section>
		</form >
	);
}
