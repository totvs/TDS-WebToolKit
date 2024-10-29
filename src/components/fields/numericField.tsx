import { VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeTextfield } from "@vscode-elements/react-elements";
import { TdsFieldProps } from "../form/form";
import { mdToHtml } from "../mdToHtml";
import { PageContext, TStatePage } from "../page/pageContext";
import React from "react";
import { useFormContext } from "react-hook-form";
import { TdsTextField } from "./textField";

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
		<TdsTextField {...props} type="number" />
	)
}