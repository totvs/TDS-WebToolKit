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
import React from 'react';
import TdsHeaderForm from "./header";
import TdsContentForm from "./content";
import TdsFooterForm from "./footer";
import { TdsAbstractModel } from "../../model/modelData";
import { tdsVscode } from "../../utilities/vscodeWrapper";

export type TdsFieldRules = {
	required?: boolean;
	min?: { value: number, message: string };
	max?: { value: number, message: string };
	pattern?: RegExp
}

/**
 * Interface for form field components.
 * Defines the props shape for form fields.
 */
export type TdsFieldProps = {
	id?: string;
	name: string;
	label: string;
	info?: string;
	className?: string;
	ref?: React.MutableRefObject<any>;
	rules?: TdsFieldRules;
	readOnly?: boolean
	//https://github.com/microsoft/vscode-webview-ui-toolkit/blob/main/src/react/README.md#use-oninput-instead-of-onchange-to-handle-keystrokes
	onInput?: React.FormEventHandler<any>; //VscodeTextfield
	onChange?: React.FormEventHandler<any>; //VscodeTextfield
}

export type TdsFormAction = {
	id: number | string;
	caption: string;
	hint?: string;
	//onClick?: any;
	enabled?: boolean | ((isDirty: boolean, isValid: boolean) => boolean);
	visible?: boolean | ((isDirty: boolean, isValid: boolean) => boolean);
	isProcessRing?: boolean
	type?: "submit" | "reset" | "button" | "link" | "checkbox";
	appearance?: string;  //ButtonAppearance;
	//href?: string;
	form?: any;
}

type TdsFormProps<M extends TdsAbstractModel> = {
	onSubmit: (data: M) => void;
	id?: string;
	title?: string;
	onManualReset?: () => void;
	actions?: TdsFormAction[];
	children: any
	onActionEvent?: (action: TdsFormAction) => void;
	isProcessRing?: boolean;
	description?: string;
};

/**
 * Renders a page layout with header, content and footer sections.
 * 
 * @param props - Page properties
 * @param [props.title] - Page title 
 * @param props.children - Content to render in main section
 * @param [props.showFooter] - Show footer page
 */
export function TdsForm<M extends TdsAbstractModel>(props: TdsFormProps<M>): React.ReactElement {

	return (
		<section className="tds-form">
			<form className="tds-form"
				id={props.id}
				autoComplete="off"
				onSubmit={(e) => {
					e.preventDefault();

					const form: HTMLFormElement = e.target as HTMLFormElement;
					const fd: FormData = new FormData(form);
					let out: TdsAbstractModel = {};
					for (let [name, value] of fd) {
						out[name] = value;
					}

					props.onSubmit(out as M);
				}}
			>
				{props.title && <TdsHeaderForm title={props.title} />}

				<TdsContentForm>
					{props.children.map((child: any) => {
						return child;
					})}
				</TdsContentForm>

				<TdsFooterForm
					actions={props.actions || getDefaultActionsForm()}
					onActionEvent={props.onActionEvent}
				/>
			</form>
		</section>
	);
}

// /*
// Copyright 2024 TOTVS S.A

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//   http: //www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// */

// import "./form.css";
// import React from "react";
// import { ButtonAppearance } from "../vscode-elements";
// import { sendClose } from "../../utilities/common-command-webview";
// import { tdsVscode } from "../../utilities/vscodeWrapper";
// import { TdsProgressRing } from "../decorator/progress-ring";
// import { mdToHtml } from "../mdToHtml";
// import { TdsAbstractModel } from "../../model/modelData";
// import { VscodeButton, VscodeCheckbox, VscodeDivider, VscodeScrollable } from "@vscode-elements/react-elements";
// import { TdsLink } from './../decorator/link';

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
export function getDefaultActionsForm(): TdsFormAction[] {
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
 * Passing ``setErro vc8r`` is necessary, as this function
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
 * Returns the close  actions for the form.
 *
 */
export function getCloseActionForm(): TdsFormAction {
	return getDefaultActionsForm()
		.filter(action => action.id === TdsFormActionsEnum.Close)
		.map((action) => {
			action.appearance = "primary";

			return action;
		})[0];
}

// /**
// * Notas:
// * - Usar _hook_ ``FormProvider`` antes de iniciar ``TDSForm``.
// *   Esse _hook_ proverá informações para os elementos filhos e
// *   fará a interface entre a aplicação e o formulário.
// *
// * - O tipo ``DataModel`` que complementa a definição de ``TDSFormProps``,
// *   descreve a estrutura de dados do formulário. Normalmente,
// *	você não precisa instanciar um objeto para armazenar os dados,
// *   o _hook_ ``FormProvider`` proverá esse armazenamento e acesso aos dados,
// *   através dos métodos ``getValues()``, ``setValues()``.
// **/



// /**
//  *
//  * Se usar em _hook_ useFieldArray, ver nota inicio do fonte.
//  *
//  * @param props
//  * @returns
//  */
// let isProcessRing: boolean = false;

// /**
//  * Renders a form component with state management and actions.
//  *
//  * Accepts a generic DataModel for the form values and errors.
//  * Provides form state values and common form handling methods.
//  * Renders form content, messages, and action buttons.
//  * Handles submit and reset events.
//  */
// export function TdsForm<M extends TdsAbstractModel>(props: TDSFormProps<M>): React.ReactElement {
// 	//const methods = props.methods;
// 	//const isSubmitting: boolean = methods ? methods.formState.isSubmitting : false;
// 	const isDirty: boolean = false;  //methods ? methods.formState.isDirty : false;
// 	const isValid: boolean = true;  //methods ?
// 	// 	(methods.formState.errors === undefined || Object.keys(methods.formState.errors).length === 0)
// 	//	: true;
// 	let actions: IFormAction[] = props.actions ? props.actions : getDefaultActionsForm();

// 	if (actions.length == 1) {
// 		actions[0].appearance = "primary"
// 	}

// 	// if (isSubmitting && (actions.length > 0)) {
// 	// 	isProcessRing = props.isProcessRing !== undefined ? props.isProcessRing : true;
// 	// } else if (!isValid) {
// 	// 	isProcessRing = props.isProcessRing !== undefined ? props.isProcessRing : false;
// 	// }

// 	actions.forEach((action: IFormAction) => {
// 		action.isProcessRing = (action.isProcessRing !== undefined ? action.isProcessRing && isProcessRing : undefined)
// 	});

// 	const id: string = props.id || "form";
// 	const children = React.Children.toArray(props.children);

// 	return (
// 		<form className="tds-form"
// 			id={id}
// 			onSubmit={(e) => {
// 				e.preventDefault();
// 				console.log(e);
// 				const form: HTMLFormElement = document.querySelector(`#${id}`) as HTMLFormElement;
// 				const fd: FormData = new FormData(form);
// 				let out: TdsAbstractModel = {};

// 				for (let [name, value] of fd) {
// 					out[name] = value;
// 				}

// 				props.onSubmit(out as M);
// 			}}
// 			onReset={(e) => {
// 				// if (methods) {
// 				// 	e.preventDefault();
// 				// 	methods.reset(methods.formState.defaultValues as DefaultValues<M>);
// 				// 	if (props.onManualReset) {
// 				// 		props.onManualReset();
// 				// 	}
// 				// }
// 			}}
// 			autoComplete="off"
// 		>
// 			<section className={"tds-form-header"}>
// 				{props.description && <h3>{mdToHtml(props.description)}</h3>}
// 			</section>

// 			<VscodeScrollable className="tds-form-content">
// 				<p>campos</p>
// 				<p>campos</p>
// 				<p>campos</p>
// 				<p>campos</p>
// 				<p>campos</p>
// 				<p>campos</p>
// 				{/* {...children} */}
// 			</VscodeScrollable>

// 		</form >
// 	);
// }
