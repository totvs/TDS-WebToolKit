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

import { VscodeScrollable } from "@vscode-elements/react-elements";
import React from "react";

export interface IContent {
	columnWidth: string[] | string;
	children: any
}

/**
 * Renders the content section.
 * @param props - The content section props.
 */
export default function TdsContentForm(props: IContent) {
	const gridTemplateColumns: string = typeof (props.columnWidth) == "string" ? props.columnWidth : props.columnWidth.join(" ");
	let result: React.ReactElement = (
		<VscodeScrollable className="tds-content-flex-form">
			<div
				className="tds-content-grid-form"
				style={{
					"gridTemplateColumns": `${gridTemplateColumns}`
				}}
			>
				{...React.Children.toArray(props.children)}
			</div>
		</VscodeScrollable>
	);

	return React.Children.toArray(result);
	// return (
	// 	<VscodeFormContainer responsive={true}>
	// 		{React.Children.toArray(result)}
	// 	</VscodeFormContainer>
	// )
}
