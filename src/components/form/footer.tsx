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
import { TdsLink } from "../decorator/link";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { TdsProgressRing } from "../decorator/progress-ring";
import { TdsFormAction } from "./form";
import { Event } from "vscode";

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
	let isProcessRing: boolean = false;
	let isValid: boolean = false;
	let isDirty: boolean = false;

	return (
		<section className="tds-footer-form">
			<VscodeDivider role="presentation" />
			<div className="tds-message">
				!isValid && <span className={"tds-error"}>{tdsVscode.l10n.t("_There is invalid information. See the error by hovering the mouse over the field marking.")}</span>
				isProcessRing && isSubmitting && <><TdsProgressRing /><span>{tdsVscode.l10n.t("_Wait please. Processing...")}</span></>
			</div>
			<div className="tds-actions">
				{props.actions.map((action: TdsFormAction) => {
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
							key={action.id}
							className={`tds-button-button ${visible}`}
							{...propsField}
							onChange={(e: any) => {
								e.preventDefault();
								props.onActionEvent(action);
							}}
						>
							{action.caption}
						</VscodeCheckbox>)
					} else {
						return (<VscodeButton
							key={action.id}
							className={`tds-button-button ${visible}`}
							title={action.hint}
							appearance={action.appearance || "secondary"}
							{...propsField}
							onClick={(e: any) => {
								e.preventDefault();
								props.onActionEvent(action);
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
