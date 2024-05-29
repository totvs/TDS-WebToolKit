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
	const { register } = props.methods;
	const fieldState: ControllerFieldState = props.methods.control.getFieldState(props.name);
	const registerField = register(props.name, props.rules);

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
				checked={props.methods.getValues(props.name).toString() === "true"}
				indeterminate={props.methods.getValues(props.name).toString() !== "true" && props.methods.getValues(props.name).toString() !== "false"}
				readOnly={props.readOnly || false}

				{...registerField}
			>
				{props.textLabel}
				{props.info && <PopupMessage field={props} fieldState={fieldState} />}
			</VSCodeCheckbox>
		</section>
	)
}