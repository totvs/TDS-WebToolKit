import { mdToHtml } from "../mdToHtml";
import { VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeRadio, VscodeRadioGroup } from "@vscode-elements/react-elements";
import * as React from "react"
import { TdsFieldProps } from "../form/form";
import { TdsCheckBoxFieldProps } from './checkBoxField';
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { TdsRadioFieldProps } from "./radioField";
import { PageContext, TStatePage } from "../page/pageContext";
import { useFormContext } from "react-hook-form";

type TdsRadioGroupProps = TdsFieldProps & {
	orientation?: "horizontal" | "vertical";
	options?: Omit<TdsRadioFieldProps, "name">[];
	children?: any;
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
	const pageContext: TStatePage = React.useContext(PageContext);
	const { register, formState: { errors }, getFieldState } = useFormContext();

	if (props.options && props.children) {
		throw new Error("Use only one of the properties: Options or Children")
	}

	return (
		<VscodeFormGroup
			variant={pageContext.formOrientation}
			key={props.name}
			id={props.id}
		>
			<VscodeLabel
				required={props.rules?.required || false}
			>
				{mdToHtml(props.label || "")}
			</VscodeLabel>
			{register ?
				<VscodeRadioGroup
					variant={props.orientation}
				>
					{props.children && React.Children.toArray(props.children.map((e: any) => {
						return { ...e, name: props.name, rules: e.rules }
					}))}
					{props.options && props.options.map((radioProps: TdsRadioFieldProps, index: number) =>
						<VscodeRadio
							{...register(`${props.name}`,
								{
									disabled: props.readOnly,
									required: props.rules?.required,
								}) as any}
							name={props.name}
							value={radioProps.value}
							checked={radioProps.checked}
							onClick={
								(e: any) => {
									console.log("onCLick", radioProps.value)
									e.preventDefault();
									props.onChange && props.onChange(e);
								}
							}
						>
							{mdToHtml(radioProps.label)}
						</VscodeRadio>
					)}
				</VscodeRadioGroup>
				:
				<VscodeRadioGroup
					variant={props.orientation}
				>
					{props.children && React.Children.toArray(props.children.map((e: any) => {
						return { ...e, name: props.name, rules: e.rules }
					}))}
					{props.options && props.options.map((e: TdsRadioFieldProps, index: number) =>
						<VscodeRadio
							disabled={props.readOnly || false}
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
			}
			{
				props.info &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup >
	)
}