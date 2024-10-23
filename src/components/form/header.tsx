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

import React from "react";
import { TdsTypeField } from "../fields/textField";
import { FormGroupVariant } from "@vscode-elements/elements/dist/vscode-form-group";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { VscodeRadio, VscodeRadioGroup } from "@vscode-elements/react-elements";

export interface IHeader {
	title: string;
}

/**
 * Header component that renders the TOTVS logo, page title, and help link.
 * 
 * @param props - Header component props
 * @param props.title - Page title to display
 */
export default function TdsHeaderForm(props: IHeader): React.ReactElement {

	return (
		<section className="tds-header-form">
			<h3>{props.title}</h3>
		</section>
	);
}
