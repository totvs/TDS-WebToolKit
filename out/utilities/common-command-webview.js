"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSelectResource = exports.sendClose = exports.sendUpdateModel = exports.sendSaveAndClose = exports.sendSave = exports.sendValidateModel = exports.sendReset = exports.sendReady = exports.CommonCommandToPanelEnum = exports.CommonCommandFromPanelEnum = void 0;
const vscodeWrapper_1 = require("./vscodeWrapper");
/**
 * Enumeration of common command names used for communication
 * between the webview and the extension.
 */
var CommonCommandFromPanelEnum;
(function (CommonCommandFromPanelEnum) {
    CommonCommandFromPanelEnum["InitialData"] = "INITIAL_DATA";
    CommonCommandFromPanelEnum["UpdateModel"] = "UPDATE_MODEL";
    CommonCommandFromPanelEnum["AfterSelectResource"] = "AFTER_SELECT_RESOURCE";
    CommonCommandFromPanelEnum["Close"] = "CLOSE";
    CommonCommandFromPanelEnum["Ready"] = "READY";
    CommonCommandFromPanelEnum["Reset"] = "RESET";
    CommonCommandFromPanelEnum["Save"] = "SAVE";
    CommonCommandFromPanelEnum["SaveAndClose"] = "SAVE_AND_CLOSE";
    CommonCommandFromPanelEnum["SelectResource"] = "SELECT_RESOURCE";
})(CommonCommandFromPanelEnum || (exports.CommonCommandFromPanelEnum = CommonCommandFromPanelEnum = {}));
/**
 * Enumeration of command names used for communication
 * from the extension to the webview.
 */
var CommonCommandToPanelEnum;
(function (CommonCommandToPanelEnum) {
    CommonCommandToPanelEnum["Save"] = "SAVE";
    CommonCommandToPanelEnum["SaveAndClose"] = "SAVE_AND_CLOSE";
    CommonCommandToPanelEnum["Close"] = "CLOSE";
    CommonCommandToPanelEnum["Ready"] = "READY";
    CommonCommandToPanelEnum["Reset"] = "RESET";
    CommonCommandToPanelEnum["Validate"] = "VALIDATE";
    CommonCommandToPanelEnum["UpdateModel"] = "UPDATE_MODEL";
    CommonCommandToPanelEnum["LinkMouseOver"] = "LINK_MOUSE_OVER";
    CommonCommandToPanelEnum["Feedback"] = "FEEDBACK";
    CommonCommandToPanelEnum["SelectResource"] = "SELECT_RESOURCE";
    CommonCommandToPanelEnum["CopyToClipboard"] = "COPY_TO_CLIPBOARD";
})(CommonCommandToPanelEnum || (exports.CommonCommandToPanelEnum = CommonCommandToPanelEnum = {}));
/**
 * Sends a ready message to the webview panel
 * indicating the extension is ready for communication.
 */
function sendReady() {
    const message = {
        command: CommonCommandToPanelEnum.Ready,
        data: {
            model: undefined
        }
    };
    vscodeWrapper_1.vscode.postMessage(message);
}
exports.sendReady = sendReady;
/**
 * Sends a reset message to the webview panel
 * with the provided model to reset the state.
 */
function sendReset(model) {
    const message = {
        command: CommonCommandToPanelEnum.Reset,
        data: {
            model
        }
    };
    vscodeWrapper_1.vscode.postMessage(message);
}
exports.sendReset = sendReset;
/**
 * Sends a validate model message to the webview panel
 * containing the provided model to validate.
 */
function sendValidateModel(model) {
    const message = {
        command: CommonCommandToPanelEnum.Validate,
        data: {
            model
        }
    };
    vscodeWrapper_1.vscode.postMessage(message);
}
exports.sendValidateModel = sendValidateModel;
/**
 * Sends a save model message to the webview panel
 * containing the provided model to save.
 */
function sendSave(model) {
    const message = {
        command: CommonCommandToPanelEnum.Save,
        data: {
            model
        }
    };
    vscodeWrapper_1.vscode.postMessage(message);
}
exports.sendSave = sendSave;
/**
 * Sends a save and close message to the webview panel
 * containing the provided model to save and close.
 */
function sendSaveAndClose(model) {
    const message = {
        command: CommonCommandToPanelEnum.SaveAndClose,
        data: {
            model
        }
    };
    vscodeWrapper_1.vscode.postMessage(message);
}
exports.sendSaveAndClose = sendSaveAndClose;
/**
 * Sends an update model message to the webview panel
 * containing the provided model to update.
 */
function sendUpdateModel(model) {
    const message = {
        command: CommonCommandToPanelEnum.UpdateModel,
        data: {
            model
        }
    };
    vscodeWrapper_1.vscode.postMessage(message);
}
exports.sendUpdateModel = sendUpdateModel;
/**
 * Sends a close message to the webview panel.
 */
function sendClose() {
    const message = {
        command: CommonCommandToPanelEnum.Close,
        data: {
            model: undefined
        }
    };
    vscodeWrapper_1.vscode.postMessage(message);
}
exports.sendClose = sendClose;
/**
* Sends a message to the webview panel to select a resource.
*
* @param firedBy - The string identifier of the entity that triggered the resource selection.
* @param props - An object containing the properties related to the resource selection, including the model data.
*/
function sendSelectResource(firedBy, model, options) {
    const message = {
        command: CommonCommandToPanelEnum.SelectResource,
        data: {
            model,
            options,
            firedBy
        }
    };
    vscodeWrapper_1.vscode.postMessage(message);
}
exports.sendSelectResource = sendSelectResource;
