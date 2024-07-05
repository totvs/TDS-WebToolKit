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
	const { register, control, getValues, getFieldState } = useFormContext();
	const fieldState: ControllerFieldState = getFieldState(props.name);

	return (
		<section
			className={`tds-field-container tds-simple-text-field ${props.className ? props.className : ''}`}
		>
			<VSCodeTextField
				key={`text_field_${props.name}`}
				readOnly={props.readOnly || false}
				{...register(props.name, props.rules)}
			>
				<PopupMessage field={{ ...props, label: "" }} fieldState={fieldState} />
			</VSCodeTextField>
		</section>
	)
}