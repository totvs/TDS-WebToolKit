import { VscodeFormGroup, VscodeFormHelper, VscodeLabel, VscodeTextfield } from "@vscode-elements/react-elements";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";
import { mdToHtml } from "../mdToHtml";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { PageContext, TStatePage } from "../page/pageContext";
import React from "react";

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
	const pageContext: TStatePage = React.useContext(PageContext);

	return (
		<VscodeFormGroup variant={pageContext.formOrientation}

			key={props.name}
		>
			<VscodeTextfield name={props.name}
				readonly={props.readOnly || false}
				required={props.rules?.required || false}
				placeholder={props.placeholder}
			/>
			{props.info && !pageContext.compact &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup>
	)
}