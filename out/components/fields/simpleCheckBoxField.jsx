"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TdsSimpleCheckBoxField = void 0;
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
function TdsSimpleCheckBoxField(props) {
    const { register, getValues, setValue, formState: { isDirty } } = (0, react_hook_form_1.useFormContext)();
    const { field, fieldState } = (0, react_hook_form_1.useController)(props);
    const registerField = register(props.name, props.rules);
    const originalChange = registerField.onChange;
    registerField.onChange = (e) => {
        if (originalChange) {
            originalChange(e);
        }
        if (e.target.indeterminate) {
            setValue(registerField.name, null);
        }
        else {
            setValue(registerField.name, e.target.checked ? true : false);
        }
        return e.target.checked;
    };
    return (<section className={`tds-field-container tds-simple-checkbox-field  ${props.className ? props.className : ''}`}>
			<react_1.VSCodeCheckbox checked={field.value.toString() === "true"} indeterminate={field.value.toString() !== "true" && field.value.toString() !== "false"} readOnly={props.readOnly || false} {...registerField}>
				{props.textLabel}
				<popup_message_1.default field={props} fieldState={fieldState}/>
			</react_1.VSCodeCheckbox>
		</section>);
}
exports.TdsSimpleCheckBoxField = TdsSimpleCheckBoxField;
