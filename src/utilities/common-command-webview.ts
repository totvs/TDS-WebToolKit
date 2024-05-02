/*
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

import { type TAbstractModel } from '../model/modelData'
import { vscode } from './vscodeWrapper'

/**
 * Enumeration of common command names used for communication
 * between the webview and the extension.
 */
export enum CommonCommandFromPanelEnum {
  InitialData = 'INITIAL_DATA',
  UpdateModel = 'UPDATE_MODEL',
  AfterSelectResource = 'AFTER_SELECT_RESOURCE',
  Close = 'CLOSE',
  Ready = 'READY',
  Reset = 'RESET',
  Save = 'SAVE',
  SaveAndClose = 'SAVE_AND_CLOSE',
  SelectResource = 'SELECT_RESOURCE',
}

/**
 * Enumeration of common command names used for communication
 * between the webview and the extension.
 */
export type CommonCommandFromPanel = CommonCommandFromPanelEnum

/**
 * Type for messages received from the webview panel.
 * Contains the command name and data payload.
 * The data payload contains the updated model and any other data.
*/
export interface ReceiveMessage<C extends CommonCommandFromPanel, T extends TAbstractModel> {
  command: C
  data: {
    model: T
  }
}

/**
 * Enumeration of command names used for communication
 * from the extension to the webview.
 */
export enum CommonCommandToPanelEnum {
  Save = 'SAVE',
  SaveAndClose = 'SAVE_AND_CLOSE',
  Close = 'CLOSE',
  Ready = 'READY',
  Reset = 'RESET',
  Validate = 'VALIDATE',
  UpdateModel = 'UPDATE_MODEL',
  LinkMouseOver = 'LINK_MOUSE_OVER',
  Feedback = 'FEEDBACK',
  SelectResource = 'SELECT_RESOURCE',
  CopyToClipboard = 'COPY_TO_CLIPBOARD'
}

export type CommonCommandToPanel = CommonCommandToPanelEnum

/**
 * Type for messages received from the webview panel.
 * Contains the command name and data payload.
 * The data payload contains the updated model and any other data.
*/
export interface CommandFromPanel<C extends CommonCommandFromPanel, T extends TAbstractModel> {
  readonly command: C
  data: {
    model: T
  }
}

/**
 * Type for messages sent from the extension to the webview panel.
 * Contains the command name and data payload.
 * The data payload contains the model and any other data.
*/
export interface TSendMessage<C extends CommonCommandToPanel, T extends TAbstractModel> {
  command: C
  data: {
    model: T | undefined
    [key: string]: unknown
  }
}

/**
 * Sends a ready message to the webview panel
 * indicating the extension is ready for communication.
 */
export function sendReady(): void {
  const message: TSendMessage<CommonCommandToPanelEnum, TAbstractModel> = {
    command: CommonCommandToPanelEnum.Ready,
    data: {
      model: undefined
    }
  }

  vscode.postMessage(message)
}

/**
 * Sends a reset message to the webview panel
 * with the provided model to reset the state.
 */
export function sendReset<T extends TAbstractModel>(model: T): void {
  const message: TSendMessage<CommonCommandToPanelEnum, TAbstractModel> = {
    command: CommonCommandToPanelEnum.Reset,
    data: {
      model
    }
  }

  vscode.postMessage(message)
}

/**
 * Sends a validate model message to the webview panel
 * containing the provided model to validate.
 */
export function sendValidateModel<T extends TAbstractModel>(model: T): void {
  const message: TSendMessage<CommonCommandToPanelEnum, TAbstractModel> = {
    command: CommonCommandToPanelEnum.Validate,
    data: {
      model
    }
  }

  vscode.postMessage(message)
}

/**
 * Sends a save model message to the webview panel
 * containing the provided model to save.
 */
export function sendSave<T extends TAbstractModel>(model: T): void {
  const message: TSendMessage<CommonCommandToPanelEnum, TAbstractModel> = {
    command: CommonCommandToPanelEnum.Save,
    data: {
      model
    }
  }

  vscode.postMessage(message)
}

/**
 * Sends a save and close message to the webview panel
 * containing the provided model to save and close.
 */
export function sendSaveAndClose<T extends TAbstractModel | undefined>(model: T): void {
  const message: TSendMessage<CommonCommandToPanelEnum, TAbstractModel> = {
    command: CommonCommandToPanelEnum.SaveAndClose,
    data: {
      model
    }
  }

  vscode.postMessage(message)
}

/**
 * Sends an update model message to the webview panel
 * containing the provided model to update.
 */
export function sendUpdateModel<T extends TAbstractModel>(model: T): void {
  const message: TSendMessage<CommonCommandToPanelEnum, TAbstractModel> = {
    command: CommonCommandToPanelEnum.UpdateModel,
    data: {
      model
    }
  }

  vscode.postMessage(message);
}

/**
 * Sends a close message to the webview panel.
 */
export function sendClose(): void {
  const message: TSendMessage<CommonCommandToPanelEnum, TAbstractModel> = {
    command: CommonCommandToPanelEnum.Close,
    data: {
      model: undefined
    }
  }

  vscode.postMessage(message)
}

/**
 * Type for options to send when requesting the user to select resources.
 *
 * @param canSelectMany - Whether multiple resources can be selected.
 * @param canSelectFiles - Whether files can be selected.
 * @param canSelectFolders - Whether folders can be selected.
 * @param currentFolder - The current folder path.
 * @param title - The title for the resource selection dialog.
 * @param openLabel - The label for the open button.
 * @param filters - The allowed file filters.
 */
export interface TSendSelectResourceOptions {
  canSelectMany: boolean
  canSelectFiles: boolean
  canSelectFolders: boolean
  currentFolder: string
  title: string
  openLabel: string
  filters: Record<string, string[]>
}

/**
* Sends a message to the webview panel to select a resource.
*
* @param firedBy - The string identifier of the entity that triggered the resource selection.
* @param props - An object containing the properties related to the resource selection, including the model data.
*/
export function sendSelectResource<T extends TAbstractModel>(firedBy: string, model: T, options: TSendSelectResourceOptions): void {
  const message: TSendMessage<CommonCommandToPanelEnum, TAbstractModel> = {
    command: CommonCommandToPanelEnum.SelectResource,
    data: {
      model,
      options,
      firedBy
    }
  }

  vscode.postMessage(message)
}
