import { VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeTextfield } from "@vscode-elements/react-elements";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";
import { mdToHtml } from "../mdToHtml";

type TdsSimpleTextFieldProps = Omit<TdsFieldProps, "label"> &
{
	placeholder?: string;
};

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

	return (
		<VscodeFormGroup variant={props.formLayout}
			key={props.name}
		>
			<VscodeTextfield name={props.name}
				readonly={props.rules?.readOnly || false}
				required={props.rules?.required || false}
				placeholder={props.placeholder}
			/>
			{props.info &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup>
	)
	return (
		<section
			className={`tds-field-container tds-simple-text-field ${props.className ? props.className : ''}`}
		>
			<VscodeTextfield
				key={`text_field_${props.name}`}
				readonly={props.rules.readOnly || false}
			>
				<PopupMessage field={{ ...props, label: "" }} />
			</VscodeTextfield>
		</section>
	)
}