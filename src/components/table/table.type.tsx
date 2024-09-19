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

export type TTdsTableColumn = (
	string |
	{
		label: string;
		type: "string" | "number" | "boolean" | "date" | "time" | "datetime";
		displayType?: "date" | "time" | "datetime" | "int" | "float" | "hex" | "HEX";
		width?: string | number;
		align?: "left" | "center" | "right";
	});

export type TTdsOnClickTableCell = (target: HTMLElement,
	rowIndex: number,
	modifiers?: {
		altKey?: boolean,
		ctrlKey?: boolean,
		shiftKey?: boolean,
		metaKey?: boolean
	}
) => void;

// export type TTdsOnCaptureKey = (target: HTMLElement,
// 	rowIndex: number,
// 	modifiers?: {
// 		altKey?: boolean,
// 		ctrlKey?: boolean,
// 		shiftKey?: boolean,
// 		metaKey?: boolean
// 	}
// ) => void;

export type TTdsTableProps = {
	dataSource: any[] //Record<string, string | number | Date | boolean>[]
	id?: string;
	columns?: TTdsTableColumn[],
	highlightRows?: number[];
	highlightGroups?: Record<string, number[]> | Record<string, (row: any[], index: number) => boolean>;
	onCustomBody?: (dataSource: any[]) => React.ReactElement;
	onClick?: TTdsOnClickTableCell;
	//onKeyCapture?: TTdsOnCaptureKey;
}
