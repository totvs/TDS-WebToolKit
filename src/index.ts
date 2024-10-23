/*
import { TdsCheckBoxGroup } from './components/fields/checkBoxGroup';
Copyright 2024 TOTVS S.A

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http: //www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

export { mdToHtml } from './components/mdToHtml'

export { TdsForm, TdsFormAction, setErrorModel } from './components/form/form'
export { setDataModel, getDefaultActionsForm, getCloseActionForm } from './components/form/form'
export { sendSave, sendReady, sendClose, sendSaveAndClose, sendSelectResource, sendUpdateModel, sendValidateModel, TCommonCommand } from './utilities/common-command-webview'

export { TdsCheckBoxField, TdsCheckBox } from './components/fields/checkBoxField'
export { TdsCheckBoxGroup } from './components/fields/checkBoxGroup'

export { TdsNumericField } from './components/fields/numericField'
export { TdsPage } from './components/page/page'
export { TdsSelectionField } from './components/fields/selectionField'
export { TdsSelectionFileField, TdsSelectionFolderField, TdsSelectionResourceField } from './components/fields/selectionResourceField'
export { TdsSimpleTextField } from './components/fields/simpleTextField'
export { TdsTextField } from './components/fields/textField'

export { TdsAbstractModel } from './model/modelData'
export { CommonCommandEnum } from './utilities/common-command-webview'
export { tdsVscode } from './utilities/vscodeWrapper';
export { ReceiveMessage } from './utilities/common-command-webview';
export { ErrorBoundary } from './components/error-boundary'

export { TdsProgressRing } from './components/decorator/progress-ring';

export { TdsDataGrid } from './components/dataGrid';
export type { TTdsDataGridColumnDef, TTdsDataGridAction } from './components/dataGrid/dataGrid.type'

export type { IPopupMessage } from './components/popup-message/popup-message'

export { TdsTable } from './components/table';
export type { TTdsTableColumn, TTdsOnClickTableCell } from "./components/table"
//export type { TTdsOnCaptureKey } from "./components/table"

export { TdsPaginator } from './components/paginator';

export { TdsDialog } from './components/dialog';

export { TdsLabelField } from './components/fields/labelField'
export type { TdsLabelFieldProps } from './components/fields/labelField'

export { TdsTree } from "./components/tree";
export type { TdsTreeItem, TdsTreeItemAction, TdsTreeItemDecoration, TdsTreeActionEvent, TdsTreeSelectEvent } from "./components/tree";

declare global {
  interface Window {
    initialData: any;
    translations: any;
  }
}
