"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TdsSelectionField = void 0;
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
function TdsSelectionField(props) {
    var _a;
    const { register, getValues, formState: { isDirty } } = (0, react_hook_form_1.useFormContext)();
    const { field, fieldState } = (0, react_hook_form_1.useController)(props);
    const registerField = register(props.name, props.rules);
    const options = props.options || [];
    const currentValue = getValues(props.name);
    return (<section className={`tds-field-container tds-selection-field ${props.className ? props.className : ''}`}>
			<label htmlFor={field.name}>
				{props.label}
				{((_a = props.rules) === null || _a === void 0 ? void 0 : _a.required) && <span className="tds-required"/>}
			</label>
			<br />
			<react_1.VSCodeDropdown {...registerField}>
				{options.map(({ value, text }, index) => {
            return (<react_1.VSCodeOption key={index} value={value} checked={currentValue === value}>{text}</react_1.VSCodeOption>);
        })}
				<popup_message_1.default field={props} fieldState={fieldState}/>
			</react_1.VSCodeDropdown>
		</section>);
}
exports.TdsSelectionField = TdsSelectionField;
