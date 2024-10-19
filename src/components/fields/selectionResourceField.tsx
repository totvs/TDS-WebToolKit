import { TSendSelectResourceOptions, sendSelectResource } from "../../utilities/common-command-webview";
import { TdsFieldProps } from "../form/form";
import PopupMessage from "../popup-message/popup-message";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { VscodeButton, VscodeFormGroup, VscodeFormHelper, VscodeIcon, VscodeLabel, VscodeTextfield } from "@vscode-elements/react-elements";
import { mdToHtml } from "../mdToHtml";

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
		<VscodeFormGroup variant="vertical"
			key={props.name}
		>
			<VscodeLabel htmlFor={props.name}
				required={props.rules?.required || false}
			>
				{mdToHtml(props.openLabel)}
			</VscodeLabel>
			<VscodeTextfield name={props.name}
				readonly={props.rules?.readOnly || false}
				required={props.rules?.required || false}
			>
				<VscodeIcon
					slot="content-after"
					name={options.canSelectFolders ? "folder" : "file"}
					title="Select resource"
					action-icon
				/>
			</VscodeTextfield>
			{props.info &&
				<VscodeFormHelper>
					{mdToHtml(props.info)}
				</VscodeFormHelper>
			}
		</VscodeFormGroup>
	)

	return (
		<section
			className={`tds-field-container tds-selection-resource-field tds-label-field ${props.className ? props.className : ''}`}
		>
			<VscodeButton
				key={`selection_resource_button_${props.name}`}
				onClick={() => {
					//sendSelectResource(props.name, getValues(), options);
				}}
				disabled={(props.rules && props.rules.readOnly)}
			>
				{props.openLabel}
				<PopupMessage field={{ ...props, label: props.openLabel }} />
			</VscodeButton>
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
		key={`selection_folder_${props.name}`}
		name={props.name || "btnSelectionFolder"}
		title={props.title || tdsVscode.l10n.t("_Select Folder")}
		openLabel={props.openLabel || tdsVscode.l10n.t("_Select Folder")}
		canSelectFolders={true}
		canSelectFiles={false}
		canSelectMany={false}
		currentFolder={props.currentFolder || ""}
		filters={{}}
		//readOnly={props.rules.readOnly || false}
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
		key={`selection_file_${props.name}`}
		name={props.name || "btnSelectionFile"}
		title={props.title || tdsVscode.l10n.t("_Select File")}
		openLabel={props.openLabel || tdsVscode.l10n.t("_Select File")}
		canSelectFolders={false}
		canSelectFiles={true}
		canSelectMany={props.canSelectMany || false}
		currentFolder={props.currentFolder || ""}
		filters={filters || {}}
	//readOnly={props.readOnly || false}
	/>)
}