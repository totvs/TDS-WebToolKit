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

import { VscodeFormContainer, VscodeScrollable, VscodeSplitLayout } from "@vscode-elements/react-elements";
import React, { Children } from "react";

export interface IContent {
	columns?: number;
	children: any
}

/**
 * Renders the content section.
 * @param props - The content section props.
 */
export default function TdsContentForm(props: IContent) {
	let result: React.ReactElement = undefined;

	if ((props.columns || 1) > 1) {
		result = (
			<VscodeScrollable className="tds-content-flex-form">
				<div className={`tds-content-grid-form tds-content-cols-${props.columns || 2}`}>
					{...React.Children.toArray(props.children)}
				</div>
			</VscodeScrollable>
		);
	} else {
		result = (
			<VscodeScrollable className="tds-content-flex-form">
				{...React.Children.toArray(props.children)}
			</VscodeScrollable>
		);
	}

	return React.Children.toArray(result);
	// return (
	// 	<VscodeFormContainer responsive={true}>
	// 		{React.Children.toArray(result)}
	// 	</VscodeFormContainer>
	// )
}
