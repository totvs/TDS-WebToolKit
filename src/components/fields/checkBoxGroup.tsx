import { mdToHtml } from "../mdToHtml";
import { VscodeCheckboxGroup, VscodeFormGroup, VscodeFormHelper, VscodeLabel } from "@vscode-elements/react-elements";
import * as React from "react"
import { TdsFieldProps } from "../form/form";
import { tdsVscode } from "../../utilities/vscodeWrapper";

type TdsCheckBoxGroupProps = TdsFieldProps & {
	children: any;  //typeof TdsCheckBoxField[];
	orientation?: 'horizontal' | 'vertical';
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
		<VscodeFormGroup variant={tdsVscode.layout.layoutForm}
		>
			<VscodeLabel>
				{mdToHtml(props.label || "")}
			</VscodeLabel>
			<VscodeCheckboxGroup variant={props.orientation}>
				{React.Children.toArray(props.children.map((e: any) => {
					return { ...e, name: props.name, rules: e.rules, group: true }
				}))}
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