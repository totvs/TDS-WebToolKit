/*
import { vscode } from './utilities/vscodeWrapper';
import { sendClose } from './utilities/common-command-webview';
import { sendReset } from './utilities/common-command-webview';
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

import { IFormAction, setErrorModel } from './components/form/form'
import { setDataModel, getDefaultActionsForm } from './components/form/form'
import { sendSave, sendReady, sendClose, sendReset, sendSaveAndClose, sendSelectResource, sendUpdateModel, sendValidateModel, TCommonCommand } from './utilities/common-command-webview'

import { TdsCheckBoxField } from './components/fields/checkBoxField'
import { TdsForm } from './components/form/form'
import { TdsLabelField } from './components/fields/labelField'
import { TdsNumericField } from './components/fields/numericField'
import { TdsPage } from './components/page/page'
import { TdsSelectionField } from './components/fields/selectionField'
import { TdsSelectionFileField, TdsSelectionFolderField, TdsSelectionResourceField } from './components/fields/selectionResourceField'
import { TdsSimpleCheckBoxField } from './components/fields/simpleCheckBoxField'
import { TdsSimpleTextField } from './components/fields/simpleTextField'
import { TdsTextField } from './components/fields/textField'

import { TdsAbstractModel } from './model/modelData'
import { CommonCommandEnum } from './utilities/common-command-webview'
import { tdsVscode } from './utilities/vscodeWrapper';
import { ReceiveMessage } from './utilities/common-command-webview';

export {
  IFormAction,
  setDataModel,
  setErrorModel,
  getDefaultActionsForm,
  TCommonCommand,
  CommonCommandEnum,
  sendSave,
  sendReady,
  sendClose,
  sendReset,
  sendSaveAndClose,
  sendSelectResource,
  sendUpdateModel,
  sendValidateModel,
  TdsCheckBoxField,
  TdsForm,
  TdsLabelField,
  TdsNumericField,
  TdsPage,
  TdsSelectionField,
  TdsSelectionResourceField,
  TdsSimpleCheckBoxField,
  TdsSimpleTextField,
  TdsTextField,
  TdsSelectionFolderField,
  TdsSelectionFileField,
  TdsAbstractModel,
  tdsVscode,
  ReceiveMessage,
}

declare global {
  interface Window {
    initialData: any;
    translations: any;
  }
}
