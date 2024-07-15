import { VSCodeCheckbox } from "@vscode/webview-ui-toolkit/react";
import { ControllerFieldState, useController, useFormContext } from "react-hook-form";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";
import { mdToHtml } from "../mdToHtml";
import { Checkbox } from "@vscode/webview-ui-toolkit";

type TdsCheckBoxFieldProps = TdsFieldProps & {
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
export function TdsCheckBoxField(props: TdsCheckBoxFieldProps): React.ReactElement {
	const { register, control, getValues, getFieldState } = useFormContext();
	const fieldState: ControllerFieldState = getFieldState(props.name);

	const {
		field: { onChange, value },
	} = useController({
		name: props.name,
		control,
		rules: props.rules,
	});

	return (
		<section
			className={`tds-field-container tds-simple-checkbox-field ${props.className ? props.className : ''}`}
		>
			<VSCodeCheckbox
				checked={value}
				onChange={e => onChange((e.target as Checkbox).checked)}>
				{mdToHtml(props.textLabel)}
				{props.info && <PopupMessage field={{ ...props, label: "" }} fieldState={fieldState} />}
			</VSCodeCheckbox>
		</section>
	)
}