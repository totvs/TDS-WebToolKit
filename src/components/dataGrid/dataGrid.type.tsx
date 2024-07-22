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

import { ButtonAppearance } from "@vscode/webview-ui-toolkit";

/**
 * Defines the configuration for a column in the data grid component.
 *
 * @property name - The unique identifier for the column.
 * @property label - The display label for the column.
 * @property type - The data type of the column, which can be "string", "number", "boolean", "date", "time", or "datetime".
 * @property displayType - Type of formatting to be used to present the value.
 * @property width - The width of the column, specified as a CSS value.
 * @property lookup - An optional object that maps values to display labels for the column.
 * @property sortable - Indicates whether the column is sortable.
 * @property sortDirection - The initial sort direction for the column, which can be "asc", "desc", or an empty string.
 * @property grouping - Indicates whether the column can be used for grouping.
 * @property visible - Indicates whether the column should be visible in the data grid.
 * @property readOnly - Indicates whether the column is read-only.
 */
export type TTdsDataGridColumnDef = {
	name: string;
	label: string;
	type: "string" | "number" | "boolean" | "date" | "time" | "datetime";
	displayType?: "date" | "time" | "datetime" | "int" | "float" | "hex" | "HEX";
	width?: string;
	lookup?: Record<string, string>;
	//align?: "left" | "center" | "right";
	sortable?: boolean;
	sortDirection?: "asc" | "desc" | "";
	grouping?: boolean;
	visible?: boolean;
	readOnly?: boolean;
	//onSort?: (key: string) => void;
	onChange?: any;
	row?: number
}

/**
 * Defines the configuration for an action in the data grid component.
 *
 * @property id - The unique identifier for the action.
 * @property caption - The display label for the action.
 * @property hint - An optional tooltip or hint for the action.
 * @property onClick - An optional callback function to be executed when the action is clicked.
 * @property enabled - A boolean or a function that determines whether the action should be enabled.
 * @property visible - A boolean or a function that determines whether the action should be visible.
 * @property isProcessRing - Indicates whether a process ring should be displayed while the action is being executed.
 * @property type - The type of the action, which can be "button" or "link".
 * @property appearance - The appearance of the action, which can be a button appearance.
 * @property href - The URL to navigate to when the action is a link.
 */
export type TTdsDataGridAction = {
	id: number | string;
	caption: string;
	hint?: string;
	onClick?: any;
	enabled?: boolean | ((isDirty: boolean, isValid: boolean) => boolean);
	visible?: boolean | ((isDirty: boolean, isValid: boolean) => boolean);
	isProcessRing?: boolean;
	type?: "button" | "link" | "checkbox";
	appearance?: ButtonAppearance;
	href?: string;
};

/**
 * Defines the props for the data grid component.
 *
 * @property id - The unique identifier for the data grid.
 * @property columnDef - An array of column definitions for the data grid.
 * @property dataSource - The data source for the data grid, which can be an array of objects.
 * @property options - Additional options for configuring the data grid, including bottom actions, top actions, filtering, pagination, and grouping.
 */
export type TTdsDataGridProps = {
	id: string;
	columnDef: TTdsDataGridColumnDef[]
	dataSource: any[] //Record<string, string | number | Date | boolean>[]
	options: {
		bottomActions?: TTdsDataGridAction[];
		topActions?: TTdsDataGridAction[];
		sortable?: boolean;
		filter?: boolean;
		grouping?: boolean;
		pageSize?: number,
		pageSizeOptions?: number[],
		moveRow?: boolean,
		rowSeparator?: boolean
	}
	//onFilterChanged?(fieldName: string, filter: string): void;
}
