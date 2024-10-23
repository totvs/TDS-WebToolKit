import React from "react";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { TdsFieldProps } from "../form/form";
import { mdToHtml } from "../mdToHtml";
import { PageContext, TStatePage } from "../page/pageContext";
import PopupMessage from "../popup-message/popup-message";
import { VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeOption, VscodeSingleSelect } from "@vscode-elements/react-elements";

export type TdsOptionsSelection = {
	label: string;
	value: string;
	description?: string;
	selected?: boolean;
	disabled?: boolean;
};

type TdsSelectionFieldProps = TdsFieldProps & {
	options: TdsOptionsSelection[]
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

	const pageContext: TStatePage = React.useContext(PageContext);

	return (
		<VscodeFormGroup variant={pageContext.formOrientation}

			key={props.name}
		>
			<VscodeLabel htmlFor={props.name}
				required={props.rules?.required || false}
			>
				{mdToHtml(props.label || props.name)}
			</VscodeLabel>
			<VscodeSingleSelect name={props.name}
				onClick={(e) => {
					props.onChange && props.onChange(e);
				}}
				onChange={(e) => {
					props.onChange && props.onChange(e);
				}}
				disabled={props.readOnly || false}
				required={props.rules?.required || false}
			>
				{options.map((option: TdsOptionsSelection, index: number) => {
					return (
						<VscodeOption
							key={`${index}`}
							value={option.value}
							description={option.description}
							selected={option.selected}
							disabled={option.disabled}
						>
							{option.label}
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
}