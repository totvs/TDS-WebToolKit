import { TdsFieldProps } from "../form/form";
import { mdToHtml } from "../mdToHtml";
import PopupMessage from "../popup-message/popup-message";
import { VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeOption, VscodeSingleSelect } from "@vscode-elements/react-elements";

type TdsSelectionFieldProps = TdsFieldProps & {
	options?: {
		value: string;
		text: string;
	}[]
}

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
export function TdsSelectionField(props: TdsSelectionFieldProps): React.ReactElement {
	// const { register, control, getValues, getFieldState } = useFormContext();
	// const fieldState: ControllerFieldState = getFieldState(props.name);
	const options = props.options || [];
	const currentValue: string = "currentValue";  //getValues(props.name) as string;

	// registerField.onChange = (e) => {
	// 	return new Promise(() => {
	// 		if (props.onInput) {
	// 			props.onInput(e)
	// 		};

	// 		return true;
	// 	});
	// }

	return (
		<VscodeFormGroup variant="vertical"
			key={props.name}
		>
			<VscodeLabel htmlFor={props.name}
				required={props.rules?.required || false}
			>
				{mdToHtml(props.label || props.name)}
			</VscodeLabel>
			<VscodeSingleSelect name={props.name}
				disabled={props.rules?.readOnly || false}
				required={props.rules?.required || false}
			>
				{options.map(({ value, text }, index) => {
					return (
						<VscodeOption
							key={`dropdown_${props.name}_${index}`}
							value={value}>
							{text}
						</VscodeOption>
					)
				})}
			</VscodeSingleSelect>
			{props.info &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup>
	)


	return (
		<section
			className={`tds-field-container tds-selection-field ${props.className ? props.className : ''}`}
		>
			<VscodeLabel
				htmlFor={props.name}
				required={props.rules?.required || false}
			>
				{props.label}
			</VscodeLabel>
			<VscodeSingleSelect
				key={`dropdown_${props.name}`}
				required={props.rules?.readOnly || false}
			>
				{options.map(({ value, text }, index) => {
					return (
						<VscodeOption
							key={`dropdown_${props.name}_${index}`}
							value={value}>
							{text}
						</VscodeOption>
					)
				})}
				<PopupMessage field={props} />
			</VscodeSingleSelect>
		</section>
	)
}