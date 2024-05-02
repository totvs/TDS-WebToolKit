"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TdsSelectionFileField = exports.TdsSelectionFolderField = exports.TdsSelectionResourceField = void 0;
const react_1 = require("@vscode/webview-ui-toolkit/react");
const react_hook_form_1 = require("react-hook-form");
const common_command_webview_1 = require("../../utilities/common-command-webview");
const popup_message_1 = __importDefault(require("../popup-message/popup-message"));
/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * - A utilização deste campo, requer a implementação do processamento
 *   da mensagem ``AfterSelectResource`` em ``yourPanel extends TdsPanel<?>: panelListener(...)``
 *
 * Exemplo de ``filter``:
 *
 * ```
 * {
 *   "All Files": ["*"],
 *   "JSON": ["json"],
 *   "AdvPL Source Siles": ["prw", "prx", "tlpp"],
 * }``
 * ```

 * @param props
 *
 * @returns
 */
function TdsSelectionResourceField(props) {
    const { register, getValues } = (0, react_hook_form_1.useFormContext)();
    const { fieldState } = (0, react_hook_form_1.useController)(props);
    const registerField = register(props.name, props.rules);
    registerField.disabled = props.readOnly || false;
    const options = {
        canSelectMany: props.canSelectMany,
        canSelectFiles: props.canSelectFiles,
        canSelectFolders: props.canSelectFolders,
        currentFolder: props.currentFolder,
        title: props.title,
        openLabel: props.openLabel,
        filters: props.filters ? Object.assign({}, props.filters) : {}
    };
    return (<section className={`tds-field-container tds-selection-resource-field tds-label-field ${props.className ? props.className : ''}`}>
			<react_1.VSCodeButton onClick={() => {
            (0, common_command_webview_1.sendSelectResource)(props.name, getValues(), options);
        }} {...registerField}>
				{props.openLabel}
				<popup_message_1.default field={Object.assign(Object.assign({}, props), { label: props.openLabel })} fieldState={fieldState}/>
			</react_1.VSCodeButton>
		</section>);
}
exports.TdsSelectionResourceField = TdsSelectionResourceField;
/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * - A utilização deste campo, requer a implementação do processamento
 *   da mensagem ``AfterSelectResource``em ``yourPanel extends TdsPanel<?>: panelListener(...)``
 *   na aplicação (_view_).
 *
 * Exemplo de ``filter``:
 *
 * ```
 * {
 *   "All Files": ["*"],
 *   "JSON": ["json"],
 *   "AdvPL Source Siles": ["prw", "prx", "tlpp"],
 * }``
 * ```
 *
 * @param props
 *
 * @returns
 */
function TdsSelectionFolderField(props) {
    const { getValues, } = (0, react_hook_form_1.useFormContext)();
    return (<TdsSelectionResourceField name={props.name || "btnSelectionFolder"} title={props.title || "Select Folder"} canSelectFolders={true} canSelectFiles={false} canSelectMany={false} currentFolder={props.currentFolder || ""} openLabel={props.openLabel || "Select Folder"} filters={{}} readOnly={props.readOnly || false}/>);
}
exports.TdsSelectionFolderField = TdsSelectionFolderField;
/**
 *
 * - Uso de _hook_ ``useFieldArray`` e propriedade ``disabled``:
 *   Por comportamento do _hook_, campos com ``disabled`` ativo não são armazenados
 *   no _array_ associado ao _hook_.
 *   Caso seja necessário sua manipulação, use ``readOnly`` como alternativa.
 *
 * - A utilização deste campo, requer a implementação do processamento
 *   da mensagem ``SELECTION_FOLDER``no painel e da mensagem ```SELECTED_FOLDER``
 *   na aplicação (_view_).
 *
 * Exemplo de ``filter``:
 *
 * ```
 * {
 *   "All Files": ["*"],
 *   "JSON": ["json"],
 *   "AdvPL Source Siles": ["prw", "prx", "tlpp"],
 * }``
 * ```
 *
 * @param props
 *
 * @returns
 */
function TdsSelectionFileField(props) {
    const filters = props.filters ? props.filters : {};
    return (<TdsSelectionResourceField name={props.name || "btnSelectionFile"} title={props.title || "Select File"} canSelectFolders={false} canSelectFiles={true} canSelectMany={props.canSelectMany || false} currentFolder={props.currentFolder || ""} openLabel={props.openLabel || "Select File"} filters={filters || {}} readOnly={props.readOnly || false}/>);
}
exports.TdsSelectionFileField = TdsSelectionFileField;
