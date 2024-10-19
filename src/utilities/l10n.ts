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

type TDateFormat = "date" | "time" | "datetime";
type TNumberFormat = "int" | "float" | "hex" | "HEX" | "number";

export class L10n {
  private _translations: any = {};
  private _formatLocale: string = "";

  constructor() {
    this.loadInternalTranslations();
  }

  public set translations(value: any) {
    this._translations = value.translations || {};
    this._formatLocale = value.formatLocale || "";

    this.loadInternalTranslations();
  }

  public get formatLocale(): string {
    return this._formatLocale;
  }

  public get translations(): any {
    return this._translations;
  }

  /**
   * Formats a date or date&time value using the specified format type and the configured locale.
   *
   * @param value - The date or date&time value to format.
   * @param type - The format type, can be "date", "time", or "datetime".
   * @returns The formatted date or date&time string.
   */
  public formatDate(value: Date, type: TDateFormat = "datetime"): string {
    let result: string = (value || "").toLocaleString();

    if (this._formatLocale !== "") {
      try {
        let options: Intl.DateTimeFormatOptions = {};

        if (type === "date") {
          options = {
            year: "numeric",
            month: "numeric",
            day: "numeric"
          };
        } else if (type === "time") {
          options = {
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
          };
        } else if (type === "datetime") {
          options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric"
          };
        }

        const dateTimeFormat = new Intl.DateTimeFormat(this._formatLocale, options);
        result = dateTimeFormat.format(value);
      } catch (error) {
        result = value.toLocaleString()
      }
    }

    return result;
  }

  /**
   * Formats a number value using the specified format type and the configured locale.
   *
   * @param value - The number value to format.
   * @param type - The format type, can be "int", "float", "hex", or "HEX".
   * @param decimalsOrHexDigits - The number of decimal places or hex digits to use for the formatted number.
   * @returns The formatted number string.
   */
  public formatNumber(value: number, type: TNumberFormat = "int", decimalsOrHexDigits: number = 8): string {
    let result: string = value.toLocaleString();
    const locale: string = this._formatLocale || Intl.DateTimeFormat().resolvedOptions().locale;

    if (locale !== "") {
      try {
        if ((type === "hex") || (type === "HEX")) {
          result = "0".repeat(decimalsOrHexDigits) + value.toString(16);
          result = result.substring(result.length - decimalsOrHexDigits);
          if (type === "HEX") {
            result = result.toUpperCase();
          }
        } else {
          let options: Intl.NumberFormatOptions = {
            useGrouping: true,
            minimumIntegerDigits: 1
          }

          if (type === "int") {
            options = {
              ...options,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              // minimumSignificantDigits: 0,
              // maximumSignificantDigits: 0
            };
          } else if (type === "float") {
            options = {
              ...options,
              minimumFractionDigits: decimalsOrHexDigits,
              maximumFractionDigits: decimalsOrHexDigits,
              // minimumSignificantDigits: decimalsOrHexDigits,
              // maximumSignificantDigits: decimalsOrHexDigits
            };
          }
          const valueFormat = new Intl.NumberFormat(locale, options);
          result = valueFormat.format(value);
        }
      } catch (error) {
        console.error(error);
      }
    }

    return result;
  }

  /**
   * Formats a number or date value based on the specified format type.
   *
   * @param value - The string, number or date value to format.
   * @param type - The format type, can be a `TDateFormat` or `TNumberFormat`.
   * @returns The formatted string.
   * 
   * @remarks Type `string` is not formatted. Always return original value.
   */
  public format(value: string | number | Date, type: string | TDateFormat | TNumberFormat): string {
    if ((typeof value === "number") ||
      (type == "int") ||
      (type == "float") ||
      (type == "hex") ||
      (type == "HEX") ||
      (type == "number")
    ) {
      return this.formatNumber(value as number, type as TNumberFormat);
    } else if ((value instanceof Date) ||
      (type == "date") ||
      (type == "time") ||
      (type == "datetime")
    ) {
      return this.formatDate(value as Date, type as TDateFormat);
    }

    return value;
  }

  /**
   * Translates a message string with optional arguments.
   *
   * @param message - The message string to translate.
   * @param args - Optional arguments to insert into the translated message. Use `{index}` for arguments. 
   * @returns The translated message string with any arguments inserted.
   */
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

  private loadInternalTranslations() {
    if (this._formatLocale == "pt-BR") {
      this._translations["_Filter"] = "Filtro";
      this._translations["_Filters on all columns and can accept regular expressions"] = "Filtros em todas as colunas e aceita expressões regulares";
      this._translations["_Elements/page"] = "Elementos/página";
      this._translations["_Save"] = "Salvar";
      this._translations["_Save the information and close the page"] = "Salva as informações e fecha a página";
      this._translations["_Close"] = "Fechar";
      this._translations["_Closes the page without saving the information"] = "Fecha a página sem salvar as informações";
      this._translations["_Clear"] = "Limpar";
      this._translations["_Reset the fields"] = "Restaura valores padrões";
      this._translations["_Select Folder"] = "Selecionar Pasta";
      this._translations["_Select File"] = "Selecionar Arquivo";
      this._translations["_There is invalid information. See the error by hovering the mouse over the field marking."] = "Há informações inválidas. Veja o erro passando o mouse sobre a marcação do campo.";
      this._translations["_Wait please. Processing..."] = "Espere, por favor. Processando...";
      this._translations["_[{0}] is required."] = "[{0}] é obrigatório.";
      this._translations["_[{0}] is not valid range (min value)."] = "[{0}] não é válido para faixa (valor mínimo).";
      this._translations["_[{0}] is not valid range (max value)."] = "[{0}] não é válido para faixa (valor máximo).";
    } else if (this._formatLocale == "es") {
      this._translations["_Filter"] = "Filtrar";
      this._translations["_Filters on all columns and can accept regular expressions"] = "Filtros en todas las columnas y puede aceptar expresiones regulares";
      this._translations["_Elements/page"] = "Elementos/página";
      this._translations["_Save"] = "Guarde";
      this._translations["_Save the information and close the page"] = "Guarde la información y cierre la página";
      this._translations["_Close"] = "Cierra";
      this._translations["_Closes the page without saving the information"] = "Cierra la página sin guardar la información";
      this._translations["_Clear"] = "Clara";
      this._translations["_Reset the fields"] = "Restablecer los campos";
      this._translations["_Select Folder"] = "Seleccionar Carpeta";
      this._translations["_Select File"] = "Seleccionar Archivo";
      this._translations["_There is invalid information. See the error by hovering the mouse over the field marking."] = "Hay información inválida. Vea el error flotando el ratón sobre el marcado de campo.";
      this._translations["_Wait please. Processing..."] = "Espera por favor. Tratamiento...";
      this._translations["_[{0}] is required."] = "[{0}] se requiere.";
      this._translations["_[{0}] is not valid range (min value)."] = "[{0}] no es un rango válido (valor mínimo).";
      this._translations["_[{0}] is not valid range (max value)."] = "[{0}] no es un rango válido (valor máximo).";
    } else {
      this._translations["_Filter"] = "Filter";
      this._translations["_Filters on all columns and can accept regular expressions"] = "Filters on all columns and can accept regular expressions";
      this._translations["_Elements/page"] = "Elements/page";
      this._translations["_Save"] = "Save";
      this._translations["_Save the information and close the page"] = "Save the information and close the page";
      this._translations["_Close"] = "Close";
      this._translations["_Closes the page without saving the information"] = "Closes the page without saving the information";
      this._translations["_Clear"] = "Clear";
      this._translations["_Reset the fields"] = "Reset the fields";
      this._translations["_Select Folder"] = "Select Folder";
      this._translations["_Select File"] = "Select File";
      this._translations["_There is invalid information. See the error by hovering the mouse over the field marking."] = "There is invalid information. See the error by hovering the mouse over the field marking.";
      this._translations["_Wait please. Processing..."] = "Wait please. Processing...";
      this._translations["_[{0}] is required."] = "[{0}] is required.";
      this._translations["_[{0}] is not valid range (min value)."] = "[{0}] is not valid range (min value).";
      this._translations["_[{0}] is not valid range (max value)."] = "[{0}] is not valid range (max value).";
    }
  }
}


export const l10n: L10n = new L10n();
