import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { ControllerFieldState, useController, useFormContext } from "react-hook-form";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";
import { mdToHtml } from "../mdToHtml";

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
	const { register, control, getValues, setValue, getFieldState } = useFormContext();
	const fieldState: ControllerFieldState = getFieldState(props.name);
	const value: string = getValues(props.name) ? getValues(props.name).toString() : "false";
	//const registerField = register(props.name, props.rules);

	// const originalChange = registerField.onChange;
	// registerField.onChange = (e) => {
	// 	if (originalChange) {
	// 		originalChange(e)
	// 	}

	// 	if ((e.target as HTMLInputElement).indeterminate) {
	// 		setValue(registerField.name, null);
	// 	} else {
	// 		setValue(registerField.name, e.target.checked ? true : false);
	// 	}

	// 	return e.target.checked;
	// }

	return (
		<section
			className={`tds-field-container tds-simple-checkbox-field  ${props.className ? props.className : ''}`}
		>
			<VSCodeCheckbox
				checked={value === "true" || value === "on"}
				indeterminate={value !== "true" && value !== "false" && value !== "on" && value !== "off"}
				readOnly={props.readOnly || false}
				key={`check_box_${props.name}`}
				{...register(props.name, props.rules)}
			>
				{mdToHtml(props.textLabel)}
				{props.info && <PopupMessage field={props} fieldState={fieldState} />}
			</VSCodeCheckbox>
		</section>
	)
}