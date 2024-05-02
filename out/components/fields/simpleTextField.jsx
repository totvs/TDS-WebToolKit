"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TdsSimpleTextField = void 0;
const react_1 = require("@vscode/webview-ui-toolkit/react");
const react_hook_form_1 = require("react-hook-form");
const popup_message_1 = __importDefault(require("../popup-message/popup-message"));
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
function TdsSimpleTextField(props) {
    const { register, setValue, formState: { isDirty } } = (0, react_hook_form_1.useFormContext)();
    const { field, fieldState } = (0, react_hook_form_1.useController)(props);
    const registerField = register(props.name, props.rules);
    return (<section className={`tds-field-container tds-simple-text-field ${props.className ? props.className : ''}`}>
			<react_1.VSCodeTextField readOnly={props.readOnly || false} {...registerField}>
				<popup_message_1.default field={Object.assign(Object.assign({}, props), { label: "" })} fieldState={fieldState}/>
			</react_1.VSCodeTextField>
		</section>);
}
exports.TdsSimpleTextField = TdsSimpleTextField;
