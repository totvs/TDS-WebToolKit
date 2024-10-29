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

import "./page.css";
import React from 'react';
import TdsHeader from "./header";
import TdsFooter from "./footer";
import TdsContent from "./content";
import { ErrorBoundary } from "../error-boundary";
import { VscodeRadio, VscodeRadioGroup, VscodeLabel, VscodeIcon, VscodeCheckbox } from "@vscode-elements/react-elements";
import { DEFAULT_PAGE_STATE, tdsVscode } from "../../utilities/vscodeWrapper";
import { FormGroupVariant } from "@vscode-elements/elements/dist/vscode-form-group";
import { PageContext } from "./pageContext";
import { TdsDialog } from "../dialog";
import { TdsForm, TdsFormAction } from "../form/form";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { TdsRadioGroup } from "../fields/checkRadioGroup";
import { TdsCheckBoxField } from "../fields/checkBoxField";
import { TdsTextField } from "../fields/textField";

export interface IPageView {
	children: any;
	title?: string;
	showFooter?: boolean;
	extra?: React.ReactElement
	layoutControl?: boolean;
}

/**
 * Renders a page layout with header, content and footer sections.
 * 
 * @param props - Page properties
 * @param [props.title] - Page title 
 * @param props.children - Content to render in main section
 * @param [props.showFooter] - Show footer page

 */
export function TdsPage(props: IPageView): React.ReactElement {
	const [configDialog, setConfigDialog] = React.useState<boolean>(false);
	const [formOrientation, setFormOrientation] = React.useState<FormGroupVariant>(tdsVscode.pageState.formOrientation);
	const [compact, setCompact] = React.useState<boolean>(tdsVscode.pageState.compact);
	const closeSettings = (ok: boolean, data: any) => {
		console.log("close");

		if (ok) {
			tdsVscode.pageState = {
				formOrientation: data.formOrientation,
				compact: data.compact
			}
		}

		if (ok) {
			setFormOrientation(tdsVscode.pageState.formOrientation);
			setCompact(tdsVscode.pageState.compact);
		}

		setConfigDialog(false);
	};

	const extra: React.ReactElement = <>
		{props.extra}
		{((props.layoutControl == undefined) || props.layoutControl) &&
			<VscodeIcon
				name="settings"
				action-icon
				onClick={
					(e: any) => {
						setConfigDialog(true);
					}
				}
			></VscodeIcon>
		}
	</>

	return (
		<ErrorBoundary fallback={<p>Something unexpected occurred. See navigator console log for details.</p>}>
			<section className="tds-page">
				{props.title &&
					<TdsHeader title={props.title} extra={extra} />
				}

				<TdsContent>
					<PageContext.Provider value={{
						formOrientation: formOrientation,
						compact: compact
					}}>
						{props.children}
					</PageContext.Provider>
				</TdsContent>

				{props.showFooter && <TdsFooter />}
			</section>

			{configDialog && <ConfigDialog onClose={closeSettings} />}
		</ErrorBoundary>
	);
}

type TSettingsModel = {
	formOrientation: FormGroupVariant;
	compact: boolean;
}

function ConfigDialog(props: { onClose: (ok: boolean, data: any) => void }) {
	const methods: UseFormReturn<TSettingsModel> = useForm<TSettingsModel>({
		defaultValues: {
			formOrientation: tdsVscode.pageState.formOrientation,
			compact: tdsVscode.pageState.compact,
		},
		mode: "all"
	})

	const customActions: TdsFormAction[] = [
		{
			id: 0,
			caption: tdsVscode.l10n.t("_Apply"),
			hint: tdsVscode.l10n.t("_Close and apply changes"),
		},
		{
			id: 1,
			caption: tdsVscode.l10n.t("_Cancel"),
			hint: tdsVscode.l10n.t("_Close without changes"),
		},
		{
			id: 2,
			caption: tdsVscode.l10n.t("_Restore"),
			hint: tdsVscode.l10n.t("_Restore default settings"),
		}
	];

	const model: TSettingsModel = methods.getValues();

	return (
		<PageContext.Provider value={{
			formOrientation: "vertical",
			compact: false
		}}>
			<TdsDialog title={tdsVscode.l10n.t("_Settings")} onClose={props.onClose} >
				<FormProvider {...methods}>
					<TdsForm<TSettingsModel>
						onSubmit={(e) => {
							//methods.handleSubmit(onSubmit)
						}}
						actions={customActions}
						onActionEvent={(action: TdsFormAction) => {
							if (action.id == 0) {
								props.onClose(true, methods.getValues());
							} else if (action.id == 1) {
								props.onClose(false, undefined);
							} else if (action.id == 2) {
								methods.setValue("formOrientation", DEFAULT_PAGE_STATE.formOrientation)
								methods.setValue("compact", DEFAULT_PAGE_STATE.compact)
							}
						}}
						description={tdsVscode.l10n.t("_Settings")}
					>
						<TdsRadioGroup
							orientation="horizontal"
							name={"formOrientation"}
							label={tdsVscode.l10n.t("_Orientation")}
							options={
								[
									{
										value: "vertical",
										label: tdsVscode.l10n.t("_Vertical"),
										checked: model.formOrientation == "vertical"
									},
									{
										value: "horizontal",
										label: tdsVscode.l10n.t("_Horizontal"),
										checked: model.formOrientation == "horizontal"
									}
								]
							}
						/>

						<TdsCheckBoxField
							name="compact"
							label={tdsVscode.l10n.t("_Compact mode")}
							value={"true"}
							checked={model.compact}
						/>
					</TdsForm>
				</FormProvider>
			</TdsDialog >
		</PageContext.Provider>
	);
}