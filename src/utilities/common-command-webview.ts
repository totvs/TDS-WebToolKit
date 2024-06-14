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

import { TdsAbstractModel } from "../model/modelData";
import { tdsVscode } from "./vscodeWrapper";

/**
 * Enumeration of command names used for communication 
 * from the extension to the webview.
 */
export enum CommonCommandEnum {
  Save = "SAVE",
  SaveAndClose = "SAVE_AND_CLOSE",
  Close = "CLOSE",
  Ready = "READY",
  Reset = "RESET",
  Validate = "VALIDATE",
  UpdateModel = "UPDATE_MODEL",
  LinkMouseOver = "LINK_MOUSE_OVER",
  SelectResource = "SELECT_RESOURCE",
  AfterSelectResource = "AFTER_SELECT_RESOURCE",
  CopyToClipboard = "COPY_TO_CLIPBOARD"
}

export type TCommonCommand = CommonCommandEnum;

/**
 * Type for messages received from the webview panel. 
 * Contains the command name and data payload.
 * The data payload contains the updated model and any other data.
*/
export type ReceiveMessage<C extends TCommonCommand, T = any> = {
  command: C,
  data: {
    model: T,
    errors: any
    [key: string]: any,
  }
}

/**
 * Type for messages received from the webview panel. 
 * Contains the command name and data payload.
 * The data payload contains the updated model and any other data.
*/
export type CommandFromPanel<C extends TCommonCommand, T = any> = {
  readonly command: C,
  data: {
    model: T,
    [key: string]: any,
  }
}

/**
 * Type for messages sent from the extension to the webview panel. 
 * Contains the command name and data payload.
 * The data payload contains the model and any other data.
*/
export type SendMessage<C extends TCommonCommand, T = any> = {
  command: C,
  data: {
    model: T | undefined,
    [key: string]: any,
  }
}

/**
 * Sends a ready message to the webview panel 
 * indicating the extension is ready for communication.
 */
export function sendReady() {
  const message: SendMessage<CommonCommandEnum, any> = {
    command: CommonCommandEnum.Ready,
    data: {
      model: undefined
    }
  }

  tdsVscode.postMessage(message);
}

/**
 * Sends a reset message to the webview panel 
 * with the provided model to reset the state.
 */
export function sendReset(model: TdsAbstractModel) {
  const message: SendMessage<CommonCommandEnum, TdsAbstractModel> = {
    command: CommonCommandEnum.Reset,
    data: {
      model: model
    }
  }

  tdsVscode.postMessage(message);
}

/**
 * Type for props to send when requesting the user to select resources.
 * 
 * @param canSelectMany - Whether multiple resources can be selected. 
 * @param canSelectFiles - Whether files can be selected.
 * @param canSelectFolders - Whether folders can be selected.
 * @param currentFolder - The current folder path.
 * @param title - The title for the resource selection dialog.
 * @param openLabel - The label for the open button. 
 * @param filters - The allowed file filters.
 */
export type TSendSelectResourceOptions = {
  fileSystem?: string;
  canSelectMany: boolean,
  canSelectFiles: boolean,
  canSelectFolders: boolean,
  currentFolder: string,
  title: string,
  openLabel: string,
  filters: {
    [key: string]: string[]
  }
}

/**
 * Sends a validate model message to the webview panel
 * containing the provided model to validate.
 */
export function sendValidateModel(model: TdsAbstractModel) {
  const message: SendMessage<CommonCommandEnum, TdsAbstractModel> = {
    command: CommonCommandEnum.Validate,
    data: {
      model: model
    }
  }

  tdsVscode.postMessage(message);
}

/**
 * Sends a save model message to the webview panel
 * containing the provided model to save.
 */
export function sendSave(model: TdsAbstractModel) {
  const message: SendMessage<CommonCommandEnum, TdsAbstractModel> = {
    command: CommonCommandEnum.Save,
    data: {
      model: model
    }
  }

  tdsVscode.postMessage(message);
}

/**
 * Sends a save and close message to the webview panel
 * containing the provided model to save and close.
 */
export function sendSaveAndClose(model: TdsAbstractModel) {
  const message: SendMessage<CommonCommandEnum, TdsAbstractModel> = {
    command: CommonCommandEnum.SaveAndClose,
    data: {
      model: model
    }
  }

  tdsVscode.postMessage(message);
}

/**
 * Sends an update model message to the webview panel
 * containing the provided model to update.
 */
export function sendUpdateModel(model: any) {
  const message: SendMessage<CommonCommandEnum, TdsAbstractModel> = {
    command: CommonCommandEnum.UpdateModel,
    data: {
      model: model
    }
  }

  tdsVscode.postMessage(message);
}

/**
 * Sends a close message to the webview panel.
 */
export function sendClose() {
  const message: SendMessage<CommonCommandEnum, TdsAbstractModel> = {
    command: CommonCommandEnum.Close,
    data: {
      model: undefined
    }
  }

  tdsVscode.postMessage(message);
}

/**
* Sends a message to the webview panel to select a resource.
* 
* @param firedBy - The string identifier of the entity that triggered the resource selection.
* @param props - An object containing the properties related to the resource selection, including the model data.
*/
export function sendSelectResource<M extends TdsAbstractModel>(firedBy: string, model: M, options: TSendSelectResourceOptions) {
  const message: SendMessage<CommonCommandEnum, M> = {
    command: CommonCommandEnum.SelectResource,
    data: {
      model: model,
      ...options,
      firedBy: firedBy
    }
  }

  tdsVscode.postMessage(message);
}

