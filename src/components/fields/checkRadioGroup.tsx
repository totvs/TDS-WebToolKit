import { mdToHtml } from "../mdToHtml";
import { VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeRadioGroup } from "@vscode-elements/react-elements";
import * as React from "react"
import { TdsFieldProps } from "../form/form";

type TdsRadioGroupProps = TdsFieldProps & {
	children: any;  //typeof TdsCheckBoxField[];
	orientation?: "vertical" | "horizontal";
};

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
export function TdsRadioGroup(props: TdsRadioGroupProps): React.ReactElement {
	return (
		<VscodeFormGroup variant="vertical">
			<VscodeLabel
				required={props.rules?.required || false}
			>
				{mdToHtml(props.label || "")}
			</VscodeLabel>
			<VscodeRadioGroup variant={props.orientation}>
				{React.Children.toArray(props.children.map((e: any) => {
					return { ...e, name: props.name, rules: e.rules }
				}))}
			</VscodeRadioGroup>
			{
				props.info &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup>
	)
}