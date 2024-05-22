import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { ControllerFieldState, useController, useFormContext } from "react-hook-form";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";

type TdsSimpleCheckBoxFieldProps = TdsFieldProps & {
	textLabel: string;
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
export function TdsSimpleCheckBoxField(props: TdsSimpleCheckBoxFieldProps): React.ReactElement {
	const { register } = props.methods;
	const fieldState: ControllerFieldState = props.methods.control.getFieldState(props.name);
	const registerField = register(props.name, props.rules);

	const originalChange = registerField.onChange;
	registerField.onChange = (e) => {
		if (originalChange) {
			originalChange(e)
		}

		if ((e.target as HTMLInputElement).indeterminate) {
			props.methods.setValue(registerField.name, null);
		} else {
			props.methods.setValue(registerField.name, e.target.checked ? true : false);
		}

		return e.target.checked;
	}

	return (
		<section
			className={`tds-field-container tds-simple-checkbox-field  ${props.className ? props.className : ''}`}
		>
			<VSCodeCheckbox
				checked={props.methods.getValues(props.name).toString() === "true"}
				indeterminate={props.methods.getValues(props.name).toString() !== "true" && props.methods.getValues(props.name).toString() !== "false"}
				readOnly={props.readOnly || false}
				{...registerField}
			>
				{props.textLabel}
				<PopupMessage field={props} fieldState={fieldState} />
			</VSCodeCheckbox>
		</section>
	)
}