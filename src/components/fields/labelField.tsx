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

import { VscodeFormGroup, VscodeLabel } from "@vscode-elements/react-elements";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";
import { mdToHtml } from './../mdToHtml';

export type TdsLabelFieldProps = Omit<TdsFieldProps, "onChange" | "onInput">

/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * @param props
 *
 * @returns
 */
export function TdsLabelField(props: TdsLabelFieldProps): any /*React.ReactElement*/ {

	return (
		<VscodeFormGroup variant="vertical"
			key={props.name}
		>
			<VscodeLabel id={props.name}
				required={props.rules?.required || false}
			>
				{mdToHtml(props.label)}
			</VscodeLabel>
		</VscodeFormGroup>
	)

	return (
		<section
			className={`tds-field-container tds-label-field ${props.className ? props.className : ''}`}
		>
			<VscodeLabel required={props.rules.required || false}>
				{mdToHtml(props.label)}
				<PopupMessage field={props} />
			</VscodeLabel>
		</section>
	)
}

