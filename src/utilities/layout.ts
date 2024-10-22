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

import { FormGroupVariant } from "@vscode-elements/elements/dist/vscode-form-group";

export class Layout {
  private _layoutForm: FormGroupVariant = "horizontal";

  constructor() {
    //
  }

  public set layoutForm(value: FormGroupVariant) {
    this._layoutForm = value;
  }

  public get layoutForm(): FormGroupVariant {
    return this._layoutForm;
  }

}

export const layout: Layout = new Layout();
