import { TdsFieldProps } from "../form/form";
import { TdsCheckBoxField } from "./checkBoxField";

type TdsSimpleCheckBoxFieldProps = TdsFieldProps;

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
