import { VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import { ControllerFieldState, useController, useFormContext } from "react-hook-form";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";

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
	const { register, control, getValues, getFieldState } = useFormContext();
	const fieldState: ControllerFieldState = getFieldState(props.name);
	const options = props.options || [];
	const currentValue: string = getValues(props.name) as string;

	// registerField.onChange = (e) => {
	// 	return new Promise(() => {
	// 		if (props.onInput) {
	// 			props.onInput(e)
	// 		};

	// 		return true;
	// 	});
	// }

	return (
		<section
			className={`tds-field-container tds-selection-field ${props.className ? props.className : ''}`}
		>
			<label
				htmlFor={props.name}
			>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeDropdown
				key={`dropdown_${props.name}`}

				{...register(`${props.name}` as const, props.rules)}
			>
				{options.map(({ value, text }, index) => {
					return (
						<VSCodeOption
							key={`dropdown_${props.name}_${index}`}
							value={value}
							checked={currentValue === value}>
							{text}
						</VSCodeOption>
					)
				})}
				<PopupMessage field={props} fieldState={fieldState} />
			</VSCodeDropdown>
		</section>
	)
}