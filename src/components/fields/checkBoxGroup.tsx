import PopupMessage from "../popup-message/popup-message";
import { mdToHtml } from "../mdToHtml";
import { VscodeCheckbox, VscodeCheckboxGroup, VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeTextfield } from "@vscode-elements/react-elements";
import { TdsCheckBoxField } from "./checkBoxField"
import * as React from "react"

type TdsCheckBoxGroupProps = {
	children: any;  //typeof TdsCheckBoxField[];
	orientation?: "vertical" | "horizontal";
	name: string;
	info?: string;
	label?: string;
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
export function TdsCheckBoxGroup(props: TdsCheckBoxGroupProps): React.ReactElement {
	return (
		<VscodeFormGroup variant="vertical">
			<VscodeLabel>
				{mdToHtml(props.label || "")}
			</VscodeLabel>
			<VscodeCheckboxGroup variant={props.orientation}>
				{React.Children.toArray(props.children)}
			</VscodeCheckboxGroup>
			{
				props.info &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup>
	)
}