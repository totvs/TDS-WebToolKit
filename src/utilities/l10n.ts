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

export class L10n {
  private _translations: any = {};
  private _formatDate: string = "";

  public set translations(value: any) {
    this._translations = value.translations || {};
    this._formatDate = value.formatDate || "";
  }

  public get translations(): any {
    return this._translations;
  }

  public formatDate(value: Date): string {
    let result: string = value.toLocaleString();

    if (this._formatDate !== "") {
      try {
        const options: Intl.DateTimeFormatOptions = {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric"
        };
        const dateTimeFormat1 = new Intl.DateTimeFormat(this._formatDate, options);

        result = dateTimeFormat1.format(value);
      } catch (error) {
        result = value.toLocaleString()
      }
    }

    return result;
  }

  public t(
    message: string,
    ...args: (string | number | boolean | undefined | null)[]
  ): string {
    let result = message;

    if (this._translations.hasOwnProperty(message)) {
      result = this._translations[message];
    }

    if (args && args.length > 0) {
      args.forEach((arg: any, index: number) => {
        result = result.replace(
          "{" + index + "}",
          "" + (args[index] || "{" + index + "}")
        );
      });
    }

    return result;
  }
}

export const l10n: L10n = new L10n();
