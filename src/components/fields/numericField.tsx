import { VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeTextfield } from "@vscode-elements/react-elements";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";
import { mdToHtml } from "../mdToHtml";

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
	return (
		<VscodeFormGroup variant={props.formLayout}
			key={props.name}
		>
			<VscodeLabel htmlFor={props.name}
				required={props.rules?.required || false}
			>
				{mdToHtml(props.label || props.name)}
			</VscodeLabel>
			<VscodeTextfield name={props.name}
				type="number"
				pattern={(props.rules?.pattern ? props.rules.pattern : /\d+/).source}
				readonly={props.rules?.readOnly || false}
				required={props.rules?.required || false}
			/>
			{props.info &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup>
	)

	// const { register, control, getValues, getFieldState } = useFormContext();
	// const fieldState: ControllerFieldState = getFieldState(props.name);

	const rules = {
		...props.rules,
		valueAsNumber: true,
		pattern: {
			value: /\d+/gm,
			message: `[${props.label}] only accepts numbers`
		},
	};

	return (
		<section
			className={`tds-field-container tds-numeric-field ${props.className ? props.className : ''}`}
		>
			<VscodeLabel
				htmlFor={props.name}
				required={props.rules?.required || false}
			>
				{props.label}
			</VscodeLabel>
			<VscodeTextfield
				readonly={rules.readOnly}
				key={`text_field_${props.name}`}
				required={rules.required}
				type="number"
				pattern={rules.pattern.value.source}
			>
				<PopupMessage field={props} />
			</VscodeTextfield>
		</section>
	)
}