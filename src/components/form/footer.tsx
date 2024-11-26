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

import { VscodeButton, VscodeCheckbox, VscodeDivider } from "@vscode-elements/react-elements";
import React from "react";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { TdsProgressRing } from "../decorator/progress-ring";
import { TdsFormAction, TdsFormActionsEnum } from "./form";
import { sendClose } from "../../utilities/common-command-webview";
import { useFormContext } from "react-hook-form";
import { PageContext } from "../page/pageContext";

export type TdsFooter = {
	actions: TdsFormAction[];
	onActionEvent: (action: TdsFormAction) => void;
}

/**
 * Renders the footer component.
 * 
 * @param props - The footer component props.
 * @param props.children - The content to render within the footer.
 */
export default function TdsFooterForm(props: TdsFooter): React.ReactElement {
	const { formState } = useFormContext();
	const pageContext = React.useContext(PageContext);
	const isSubmitting: boolean = formState.isSubmitting
	const isLoading: boolean = formState.isLoading
	const isValid: boolean = formState.isValid;
	const isDirty: boolean = formState.isDirty;
	let isProcessRing: boolean = false;

	if (isSubmitting && (props.actions.length > 0)) {
		isProcessRing = true;
	} else if (!isValid) {
		isProcessRing = false;
	}

	props.actions.forEach((action: TdsFormAction) => {
		action.isProcessRing = (action.isProcessRing !== undefined ? action.isProcessRing && isProcessRing : undefined)
	});

	// console.log(
	// 	"isProcessRing", isProcessRing,
	// 	"isSubmitting", isSubmitting,
	// 	"isLoading", isLoading,
	// 	"isValid", isValid,
	// 	"isDirty", isDirty
	// );
	// console.log(formState.errors);

	return (
		<section className="tds-footer-form">
			<VscodeDivider key="divider" role="presentation" />
			<div className="tds-message">
				{!isValid &&
					<>
						<span className={"tds-error"}>{tdsVscode.l10n.t("_There is invalid information.")}</span>
						{pageContext.compact &&
							<span className={"tds-error"}>&nbsp;{tdsVscode.l10n.t("_See the error by hovering the mouse over the field marking.")}</span>
						}
					</>
				}
				{isProcessRing && isSubmitting && <><TdsProgressRing /><span>{tdsVscode.l10n.t("_Wait please. Processing...")}</span></>}
			</div>
			<div className="tds-actions">
				{props.actions.map((action: TdsFormAction, index: number) => {
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
					if (action.visible !== undefined) {
						let isVisible: boolean = false;
						if (action.visible = typeof action.visible === "function") {
							isVisible = (Function)(action.visible)(isDirty, isValid)
						} else {
							isVisible = action.visible;
						}
						visible = isVisible ? "" : "tds-hidden";
					}
					// if (action.type == "link") {
					// 	(<TdsLink
					// 		key={action.id}
					// 		href={action.href}
					// 		title={action.hint}
					// 	>{action.caption}
					// 	</TdsLink>)
					//} else
					if (action.type == "checkbox") {
						return (<VscodeCheckbox
							key={index}
							className={`tds-button-button ${visible}`}
							onChange={(e: any) => {
								e.preventDefault();
								props.onActionEvent({ ...action, form: e.currentTarget.form });
							}}
						>
							{action.caption}
						</VscodeCheckbox>)
					} else {
						return (<VscodeButton
							key={index}
							type={action.type || "button"}
							className={`tds-button-button ${visible}`}
							title={action.hint}
							appearance={action.appearance || "secondary"}
							{...propsField}
							onClick={(e: any) => {
								if (action.id == TdsFormActionsEnum.Close) {
									sendClose();
								} else if (action.id == TdsFormActionsEnum.Save) {
									//e.currentTarget.form.submit();
								} else if (action.id == TdsFormActionsEnum.Clear) {
									e.currentTarget.form.reset();
								} else {
									e.preventDefault();
									props.onActionEvent({ ...action, form: e.currentTarget.form });
								}
							}}
						>
							{action.caption}
						</VscodeButton>)
					}
				})}
			</div>
		</section>
	);
}
