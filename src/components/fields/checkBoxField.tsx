import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { ControllerFieldState, useController, useFormContext } from "react-hook-form";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";

type TdsCheckBoxFieldProps = TdsFieldProps & {
	textLabel: string;
	//onChange?: (event: ChangeEvent<HTMLInputElement>) => any;
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
export function TdsCheckBoxField(props: TdsCheckBoxFieldProps): React.ReactElement {
	const { register, control, getValues, getFieldState } = useFormContext();
	const fieldState: ControllerFieldState = getFieldState(props.name);

	const value: string = getValues(props.name) ? getValues(props.name).toString() : "false";
	console.dir(value, getValues());

	return (
		<section
			className={`tds-field-container tds-checkbox-field ${props.className ? props.className : ''}`}
		>
			<label
				htmlFor={props.name}
			>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeCheckbox
				checked={value === "true" || value === "on"}
				indeterminate={value !== "true" && value !== "false" && value !== "on" && value !== "off"}
				readOnly={props.readOnly || false}
				key={props.name}
				{...register(`${props.name}` as const, props.rules)}
			>
				{props.textLabel}
				{props.info && <PopupMessage field={props} fieldState={fieldState} />}
			</VSCodeCheckbox>
		</section>
	)
}