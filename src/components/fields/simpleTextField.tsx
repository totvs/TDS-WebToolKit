import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { ControllerFieldState, useController, useFormContext } from "react-hook-form";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";

type TdsSimpleTextFieldProps = Omit<TdsFieldProps, "label">;

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
export function TdsSimpleTextField(props: TdsSimpleTextFieldProps): React.ReactElement {
	const { register } = props.methods;
	const fieldState: ControllerFieldState = props.methods.control.getFieldState(props.name);
	const registerField = register(props.name, props.rules);

	return (
		<section
			className={`tds-field-container tds-simple-text-field ${props.className ? props.className : ''}`}
		>
			<VSCodeTextField
				key={props.name}
				readOnly={props.readOnly || false}
				{...registerField}
			>
				<PopupMessage field={{ ...props, label: "" }} fieldState={fieldState} />
			</VSCodeTextField>
		</section>
	)
}