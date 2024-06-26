import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { ControllerFieldState } from "react-hook-form";
import { TSendSelectResourceOptions, sendSelectResource } from "../../utilities/common-command-webview";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";

type TdsSelectionResourceFieldProps = Omit<TdsFieldProps, "label"> & TSendSelectResourceOptions;
type TdsSelectionFolderFieldProps = Omit<TdsSelectionResourceFieldProps, "model" | "canSelectMany" | "canSelectFiles" | "canSelectFolders" | "filters">;
type TdsSelectionFileFieldProps = Omit<TdsSelectionResourceFieldProps, "folders" | "files">;

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
export function TdsSelectionResourceField(props: TdsSelectionResourceFieldProps): React.ReactElement {
	const { register } = props.methods;
	const fieldState: ControllerFieldState = props.methods.control.getFieldState(props.name);
	const registerField = register(props.name, props.rules);

	registerField.disabled = props.readOnly || false;

	const options: TSendSelectResourceOptions = {
		canSelectMany: props.canSelectMany,
		canSelectFiles: props.canSelectFiles,
		canSelectFolders: props.canSelectFolders,
		currentFolder: props.currentFolder,
		title: props.title,
		openLabel: props.openLabel,
		fileSystem: props.fileSystem,
		filters: props.filters ? {
			...props.filters
		} : {}
	}

	return (
		<section
			className={`tds-field-container tds-selection-resource-field tds-label-field ${props.className ? props.className : ''}`}
		>
			<VSCodeButton
				onClick={() => {
					sendSelectResource(props.name, props.methods.getValues(), options);
				}}
				{...registerField}
			>
				{props.openLabel}
				<PopupMessage field={{ ...props, label: props.openLabel }} fieldState={fieldState} />
			</VSCodeButton>
		</section >
	)
}

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
export function TdsSelectionFolderField(props: Partial<TdsSelectionFolderFieldProps>): React.ReactElement {
	return (<TdsSelectionResourceField
		methods={props.methods}
		name={props.name || "btnSelectionFolder"}
		title={props.title || "Select Folder"}
		canSelectFolders={true}
		canSelectFiles={false}
		canSelectMany={false}
		currentFolder={props.currentFolder || ""}
		openLabel={props.openLabel || "Select Folder"}
		filters={{}}
		readOnly={props.readOnly || false}
		fileSystem={props.fileSystem}
	/>)
}

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
export function TdsSelectionFileField(props: Partial<TdsSelectionFileFieldProps>): React.ReactElement {
	const filters = props.filters ? props.filters : {};

	return (<TdsSelectionResourceField
		methods={props.methods}
		name={props.name || "btnSelectionFile"}
		title={props.title || "Select File"}
		canSelectFolders={false}
		canSelectFiles={true}
		canSelectMany={props.canSelectMany || false}
		currentFolder={props.currentFolder || ""}
		openLabel={props.openLabel || "Select File"}
		filters={filters || {}}
		readOnly={props.readOnly || false}
	/>)
}