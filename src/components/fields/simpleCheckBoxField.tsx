import { TdsFieldProps } from "../form/form";
import { TdsCheckBoxField } from "./checkBoxField";

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
	return <TdsCheckBoxField {...props} />
}
// 	const { register, control, getValues, getFieldState } = useFormContext();
// 	const fieldState: ControllerFieldState = getFieldState(props.name);

// 	const {
// 		field: { onChange, value },
// 	} = useController({
// 		name: props.name,
// 		control,
// 		rules: props.rules,
// 	});

// 	return (
// 		<section
// 			className={`tds-field-container tds-simple-checkbox-field ${props.className ? props.className : ''}`}
// 		>
// 			<VSCodeCheckbox
// 				checked={value}
// 				onChange={e => onChange((e.target as Checkbox).checked)}>
// 				{mdToHtml(props.textLabel)}
// 				{props.info && <PopupMessage field={{ ...props, label: "" }} fieldState={fieldState} />}
// 			</VSCodeCheckbox>
// 		</section>
// 	)
// }