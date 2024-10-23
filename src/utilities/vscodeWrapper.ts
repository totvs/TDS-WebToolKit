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

import type { WebviewApi } from 'vscode-webview'
import { L10n, l10n } from './l10n'
import { FormGroupVariant } from '@vscode-elements/elements/dist/vscode-form-group';

export interface IPageState {
  formOrientation: FormGroupVariant;
  compact: boolean;
}

var NODE_MODE = false;
var DEV_MODE = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

/**
 * A utility wrapper around the acquireVsCodeApi() function, which enables
 * message passing and state management between the webview and extension
 * contexts.
 *
 * This utility also enables webview code to be run in a web browser-based
 * dev server by using native web browser features that mock the functionality
 * enabled by acquireVsCodeApi.
 */
class VSCodeAPIWrapper {
  private readonly vsCodeApi: WebviewApi<unknown> | undefined

  constructor() {
    // Check if the acquireVsCodeApi function exists in the current development
    // context (i.e. VS Code development window or web browser)
    if (typeof acquireVsCodeApi === 'function') {
      this.vsCodeApi = acquireVsCodeApi()
    }
  }

  private message(text: string) {
    if (DEV_MODE && !NODE_MODE) {
      const consoleDiv = document.getElementById('console');
      consoleDiv!.innerHTML = text;
    }

    console.log(text)
  }

  /**
   * Post a message (i.e. send arbitrary data) to the owner of the webview.
   *
   * @remarks When running webview code inside a web browser, postMessage will instead
   * log the given message to the console.
   *
   * @param message Arbitrary data (must be JSON serializable) to send to the extension context.
   */
  public postMessage(message: unknown): void {
    if (this.vsCodeApi !== undefined) {
      this.vsCodeApi.postMessage(message)
    } else {
      this.message(`<div><code>${JSON.stringify(message)}</code></div>`);
    }
  }

  /**
   * Get the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, getState will retrieve state
   * from local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @return The current state or `undefined` if no state has been set.
   */
  private getState(): any | undefined {
    let state = undefined;

    if (this.vsCodeApi !== undefined) {
      state = this.vsCodeApi.getState()
    } else {
      const data: string | null = localStorage.getItem('vscodeState')
      state = data !== null ? JSON.parse(data) : undefined
    }

    this.message(`<div>getState: <code>${JSON.stringify(state)}</code></div>`);
    return state;
  }

  /**
   * Set the persistent state stored for this webview.
   *
   * @remarks When running webview source code inside a web browser, setState will set the given
   * state using local storage (https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
   *
   * @param newState New persisted state. This must be a JSON serializable object. Can be retrieved
   * using {@link getState}.
   *
   * @return The new state.
   */
  private setState<T extends unknown | undefined>(newState: T): T {
    let state: T = undefined;

    if (this.vsCodeApi !== undefined) {
      state = this.vsCodeApi.setState(newState)
    } else if (newState == undefined) {
      localStorage.removeItem("vscodeState");
    } else {
      localStorage.setItem('vscodeState', JSON.stringify(newState))
      state = newState
    }

    this.message(`<div>setState: <code>${JSON.stringify(state)}</code></div>`);

    return state;
  }

  get l10n(): L10n {
    return l10n;
  }

  public pageStateReset() {
    this.message(`<div>pageStateReset:</div>`);
    this.setState(undefined);
  }

  public set pageState(state: Partial<IPageState>) {
    const pageState: IPageState = this.getState();

    if (pageState) {
      this.setState({ ...pageState, ...state });
    } else {
      this.setState(state);
    }

  }

  public get pageState(): IPageState {
    let pageState: IPageState = this.getState();

    if (!pageState) {
      pageState = {
        formOrientation: "vertical",
        compact: true
      }

      this.setState(pageState);
    }

    return pageState;
  }

}

// Exports class singleton to prevent multiple invocations of acquireVsCodeApi.
export const tdsVscode = new VSCodeAPIWrapper()
