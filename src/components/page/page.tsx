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
import { VscodeRadio, VscodeRadioGroup, VscodeLabel, VscodeIcon } from "@vscode-elements/react-elements";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { FormGroupVariant } from "@vscode-elements/elements/dist/vscode-form-group";
import { PageContext } from "./pageContext";

export interface IPageView {
	title?: string;
	showFooter?: boolean;
	extra?: React.ReactElement
	children: any;
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
	// const [reducer, pageDispatch] = React.useReducer(
	// 	pageReducer,
	// 	{
	// 		layout: "vertical"
	// 	}
	// );
	const [formOrientation, setFormOrientation] = React.useState<FormGroupVariant>(tdsVscode.pageState.formOrientation);

	const orientationSelect = (
		<VscodeRadioGroup>
			<VscodeLabel>
				Orientação:&nbsp;
			</VscodeLabel>
			<VscodeRadio
				checked={formOrientation == "horizontal"}
				onClick={
					(e: any) => {
						setFormOrientation("horizontal");
						tdsVscode.pageState = { formOrientation: "horizontal" };
					}
				}
			>
				Horizontal
			</VscodeRadio>
			<VscodeRadio
				checked={formOrientation == "vertical"}
				onClick={
					(e: any) => {
						setFormOrientation("vertical");
						tdsVscode.pageState = { formOrientation: "vertical" };
					}
				}
			>
				Vertical
			</VscodeRadio>
			<VscodeIcon
				name="clear-all"
				action-icon
				onClick={
					(e: any) => {
						tdsVscode.pageStateReset();
					}
				}
			></VscodeIcon>
		</VscodeRadioGroup>
	);

	return (
		<ErrorBoundary fallback={<p>Something unexpected occurred. See navigator console log for details.</p>}>
			<section className="tds-page">
				{props.title && <TdsHeader title={props.title} extra={props.extra || orientationSelect} />}

				<TdsContent>
					<PageContext.Provider value={{
						formOrientation: formOrientation
					}}>
						{props.children}
					</PageContext.Provider>
				</TdsContent>

				{props.showFooter && <TdsFooter />}
			</section>
		</ErrorBoundary>
	);
}
