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
import React from "react";
import { TGroupingInfo, TTdsDataGridColumnDef } from "./dataGrid.type";

export type TDataGridState = React.Reducer<TState, TAction>;

type TState = {
	isReady: boolean;
	itemOffset: number;
	currentPage: number;
	pageSize: number;
	totalItems: number;
	dataSource: any[] | undefined;
	dataSourceOriginal: any[];
	columnsDef: TTdsDataGridColumnDef[]
	allFieldsFilter: string;
	fieldsFilter: Record<string, string> | undefined;
	groupingInfo: TGroupingInfo;
	sortedColumn: TTdsDataGridColumnDef | undefined;
	showFieldsFilter: boolean;
}

type TAction =
	| { type: "is_ready", value?: boolean; }
	| { type: "set_item_offset", value: number }
	| { type: "set_current_page", value: number }
	| { type: "set_page_size", value: number }
	| { type: "set_columns_def", columnsDef: TTdsDataGridColumnDef[] }
	| { type: "set_data_source", dataSource: any[] | undefined }
	| { type: "set_all_fields_filter", filter: string | undefined }
	| { type: "set_fields_filter", filter: Record<string, string> | undefined }
	| { type: "set_sorted_column", columnIndex: number, direction: string }
	| { type: "set_show_fields_filter", value: boolean }
	| { type: "set_grouping_info", grouping: TGroupingInfo }
	;

export function dataGridState(state: TState, action: TAction) {
	let update: boolean = false;

	switch (action.type) {
		case "is_ready":
			state.isReady = action.value == undefined ? true : action.value;
			update = state.isReady;
			break;

		case "set_item_offset":
			state.itemOffset = action.value;
			break;

		case "set_current_page":
			state.currentPage = action.value;
			update = true;
			break;

		case "set_page_size":
			state.pageSize = action.value;
			update = true;
			break;

		case "set_show_fields_filter":
			state.fieldsFilter = undefined;
			state.showFieldsFilter = action.value;
			update = !action.value;
			break;

		case "set_grouping_info":
			state.groupingInfo = action.grouping;
			update = true;
			break;

		case "set_sorted_column":
			state.columnsDef[action.columnIndex].sortDirection = action.direction as any;
			state.sortedColumn = state.columnsDef[action.columnIndex];
			update = true;
			break;

		case "set_columns_def":
			state.columnsDef = [...action.columnsDef];
			update = true;
			break;

		case "set_data_source":
			state.dataSourceOriginal = [...action.dataSource];
			update = true;
			break;

		case "set_all_fields_filter":
			state.allFieldsFilter = action.filter;
			update = true;
			break;

		case "set_fields_filter":
			state.fieldsFilter = action.filter;
			update = true;
			break;

		default:
			console.error("Set 'state' unknown. Type: %s", (action as any).type);

			break;
	}

	if (update) {
		state = {
			...state, dataSource: prepareDataSource(state.columnsDef, state.dataSourceOriginal,
				state.allFieldsFilter, state.fieldsFilter, state.groupingInfo,
				state.sortedColumn).slice(state.itemOffset, state.itemOffset + state.pageSize)
		}

		state.totalItems = state.dataSource.length;
	}

	return state;
}


function prepareDataSource(columnsDef: TTdsDataGridColumnDef[], dataSource: any[],
	allFieldsFilter: string, fieldsFilter: Record<string, string>,
	groupingInfo: TGroupingInfo, sortedColumn: TTdsDataGridColumnDef): any[] {

	const initFilters = (value?: RegExp): Record<string, RegExp[]> => {
		const filters: Record<string, RegExp[]> = {};

		columnsDef.forEach((columnDef: TTdsDataGridColumnDef) => {
			filters[columnDef.name] = value !== undefined ? [value] : [];
		});

		return filters;
	};

	const applyOrFilter = (rows: any[], filters: Record<string, RegExp[]>): any[] => {
		if (Object.keys(filters).length > 0) {
			rows = rows.filter((row: any, index: number) => {
				let found: boolean = false;
				const filtersKey: string[] = Object.keys(filters).filter((key: string) => {
					return filters[key].length > 0 ? key : undefined;
				});

				if (filtersKey.length > 0) {
					filtersKey.forEach((key: string) => {
						filters[key].forEach((filter: RegExp) => {
							if (filter.test(row[key])) {
								found = true;
							}
						});
					});
				} else {
					found = true;
				}

				return found ? row : null;
			})
		}

		return rows;
	}

	const applyAndFilter = (rows: any[], filters: Record<string, RegExp[]>): any[] => {
		if (Object.keys(filters).length > 0) {
			rows = rows.filter((row: any, index: number) => {
				let found: boolean = true;

				const filtersKey: string[] = Object.keys(filters).filter((key: string) => {
					return filters[key].length > 0 ? key : undefined;
				});

				if (filtersKey.length > 0) {
					filtersKey.forEach((key: string) => {
						filters[key].forEach((filter: RegExp) => {
							found &&= filter.test(row[key])
						});
					});
				} else {
					found = true;
				}

				return found ? row : null;
			})
		}

		return rows;
	}

	let rows: any[] = [...dataSource];

	if (allFieldsFilter) {
		const filter: RegExp = new RegExp(`${allFieldsFilter}`, "i");
		const filters: Record<string, RegExp[]> = initFilters(filter);

		rows = applyOrFilter(rows, filters);
	}

	if ((fieldsFilter) && (Object.keys(fieldsFilter).length > 0)) {
		const filters: Record<string, RegExp[]> = initFilters();

		Object.keys(fieldsFilter).forEach((key: string) => {
			filters[key].push(new RegExp(`${fieldsFilter[key]}`, "i"));
		});

		rows = applyAndFilter(rows, filters);
	};

	if (groupingInfo && groupingInfo.groupingFilter) {
		const filters: Record<string, RegExp[]> = initFilters();

		groupingInfo.groupingFilter.forEach((filter: string) => {
			filters[groupingInfo.groupingCol.name].push(new RegExp(`${filter}`, "i"));
		});

		rows = applyOrFilter(rows, filters);
	}

	if (sortedColumn) {
		if (sortedColumn.sortDirection == "asc") {
			rows = rows.sort((r1: any, r2: any) => r1[sortedColumn.name] > r2[sortedColumn.name] ? 1 : -1);
		} else if (sortedColumn.sortDirection == "desc") {
			rows = rows.sort((r1: any, r2: any) => r1[sortedColumn.name] > r2[sortedColumn.name] ? -1 : 1);
		}
	}

	return rows;
}
