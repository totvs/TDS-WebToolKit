import { TdsFieldProps, TdsFieldRules } from "../form/form";
import { mdToHtml } from "../mdToHtml";
import { VscodeFormGroup, VscodeFormHelper, VscodeRadio } from "@vscode-elements/react-elements";

export type TdsRadioFieldProps = TdsFieldProps & {
	checked?: boolean;
	value: string;
};

export type TdsRadioProps = {
	name?: string;
	label: string;
	checked?: boolean;
	rules?: TdsFieldRules;
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
export function TdsRadioField(props: TdsRadioFieldProps): React.ReactElement {
	return (
		<VscodeFormGroup variant={props.formLayout}
			key={props.name}
		>
			<VscodeRadio
				name={props.name}
				disabled={props.rules?.readOnly || false}
				required={props.rules?.required || false}
				value={props.value}
				onClick={
					(e: any) => {
						props.onChange && props.onChange(e);
					}
				}
				onBlur={
					(e: any) => {
						console.log(e);
					}
				}
				onChange={
					(e: any) => {
						props.onChange && props.onChange(e);
					}
				}
			>
				{mdToHtml(props.label)}
			</VscodeRadio>
			{props.info &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup>
	)
}

export function TdsRadio(props: TdsRadioProps): React.ReactElement {
	return (
		<VscodeRadio name={props.name}
			disabled={props.rules?.readOnly || false}
			required={props.rules?.required || false}
		>
			{mdToHtml(props.label)}
		</VscodeRadio>
	)
}