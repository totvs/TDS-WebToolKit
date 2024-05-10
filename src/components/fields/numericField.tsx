import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { ControllerFieldState, useController, useFormContext } from "react-hook-form";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";

type TdsNumericFieldProps = TdsFieldProps & {

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
export function TdsNumericField(props: TdsNumericFieldProps): React.ReactElement {
	const { register } = props.methods;
	const fieldState: ControllerFieldState = props.methods.control.getFieldState(props.name);

	const rules = {
		...props.rules,
		valueAsNumber: true,
		pattern: {
			value: /\d+/gm,
			message: `[${props.label}] only accepts numbers`
		},
	};
	const registerField = register(props.name, props.rules);

	return (
		<section
			className={`tds-field-container tds-numeric-field ${props.className ? props.className : ''}`}
		>
			<label
				htmlFor={props.name}
			>
				{props.label}
				{props.rules?.required && <span className="tds-required" />}
			</label>
			<VSCodeTextField
				readOnly={props.readOnly || false}
				{...registerField}
			>
				<PopupMessage field={props} fieldState={fieldState} />
			</VSCodeTextField>
		</section>
	)
}