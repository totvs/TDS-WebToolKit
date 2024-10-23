import { mdToHtml } from "../mdToHtml";
import { VscodeCheckboxGroup, VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeRadio } from "@vscode-elements/react-elements";
import * as React from "react"
import { TdsFieldProps } from "../form/form";
import { PageContext, TStatePage } from "../page/pageContext";
import { TdsCheckBoxFieldProps } from "./checkBoxField";

type TdsCheckBoxGroupProps = TdsFieldProps & {
	orientation?: 'horizontal' | 'vertical';
	options?: Omit<TdsCheckBoxFieldProps, "name">[];
	children: any;  //typeof TdsCheckBoxField[];
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
	if (props.options && props.children) {
		throw new Error("Use only one of the properties: Options or Children")
	}

	const pageContext: TStatePage = React.useContext(PageContext);

	return (
		<VscodeFormGroup
			variant={pageContext.formOrientation}
		>
			<VscodeLabel>
				{mdToHtml(props.label || "")}
			</VscodeLabel>
			<VscodeCheckboxGroup variant={props.orientation}>
				{props.children && React.Children.toArray(props.children.map((e: any) => {
					return { ...e, name: props.name, rules: e.rules, group: true }
				}))}
				{props.options && props.options.map((e: TdsCheckBoxFieldProps, index: number) =>
					<VscodeRadio
						checked={e.checked}
						onClick={
							(e: any) => {
								props.onChange && props.onChange(e);
							}
						}
					>
						{mdToHtml(e.label)}
					</VscodeRadio>
				)}
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