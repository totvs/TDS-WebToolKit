import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";
import { mdToHtml } from "../mdToHtml";
import { VscodeCheckbox, VscodeFormGroup, VscodeFormHelper, VscodeTextfield } from "@vscode-elements/react-elements";
import { tdsVscode } from './../../utilities/vscodeWrapper';
import React from "react";
import { PageContext, TStatePage } from "../page/pageContext";

export type TdsCheckBoxFieldProps = TdsFieldProps & {
	value: string;
	checked: boolean;
};

//TODO: colocar labelOn, labelOff e label

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
export function TdsCheckBoxField(props: TdsCheckBoxFieldProps): React.ReactElement {
	const pageContext: TStatePage = React.useContext(PageContext);

	return (
		<VscodeFormGroup
			variant={pageContext.formOrientation}
			key={props.name}
		>
			<VscodeCheckbox name={props.name}
				disabled={props.readOnly || false}
				required={props.rules?.required || false}
				value={props.value}
			>
				{mdToHtml(props.label)}
			</VscodeCheckbox>
			{props.info &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup>
	)
}

export function TdsCheckBox(props: TdsCheckBoxFieldProps): React.ReactElement {
	return (
		<VscodeCheckbox name={props.name}
			key={props.name}
			disabled={props.readOnly || false}
			required={props.rules?.required || false}
		>
			{mdToHtml(props.label)}
		</VscodeCheckbox>
	)
}