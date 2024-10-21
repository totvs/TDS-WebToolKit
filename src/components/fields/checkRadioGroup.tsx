import { mdToHtml } from "../mdToHtml";
import { VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeRadio, VscodeRadioGroup } from "@vscode-elements/react-elements";
import * as React from "react"
import { TdsFieldProps, TdsFormLayout } from "../form/form";
import { TdsRadioField, TdsRadioFieldProps, TdsRadioProps } from "./radioField";

type TdsRadioGroupProps = TdsFieldProps & {
	options?: Omit<TdsRadioFieldProps, "name">[];
	children?: any;
	orientation?: TdsFormLayout;
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

	if (props.options && props.children) {
		throw new Error("Use only one of the properties: Options or Children")
	}

	return (
		<VscodeFormGroup variant={props.formLayout}
			key={props.name}
		>
			<VscodeLabel
				required={props.rules?.required || false}
			>
				{mdToHtml(props.label || "")}
			</VscodeLabel>
			<VscodeRadioGroup variant={props.orientation}
			>
				{props.children && React.Children.toArray(props.children.map((e: any) => {
					return { ...e, name: props.name, rules: e.rules }
				}))}
				{props.options && props.options.map((e: TdsRadioFieldProps, index: number) =>
					<VscodeRadio
						name={props.name}
						disabled={props.rules?.readOnly || false}
						required={props.rules?.required || false}
						value={e.value}
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