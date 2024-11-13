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

import "./dataGrid.css";
import React from "react";
import { TGroupingInfo, TTdsDataGridAction, TTdsDataGridColumnDef, TTdsDataGridProps } from "./dataGrid.type";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import TdsPaginator from "./paginator";
import { BuildRowFilter, FilterBlock } from "./fieldFilter";
import { DataSourceProvider, useDataSourceContext } from "./dataSourceContext";
import { GroupingPanel } from "./groupingPanel";
import { VscodeButton, VscodeCheckbox, VscodeDivider, VscodeIcon, VscodeTable, VscodeTableCell, VscodeTableHeader, VscodeTableHeaderCell, VscodeTableRow } from "@vscode-elements/react-elements";
import { VscodeTableBody } from "@vscode-elements/react-elements";
import { TdsLink } from './../decorator/link';

/**
 * Renders the data grid component.
 *
 * @param props - The data grid component props.
 */
type TFieldDataProps = {
	rows: any[];
	fieldDef: TTdsDataGridColumnDef;
	row: any;
	fieldName?: string;
}

type TBuildRowsProps = {
	id: string;  //ID Datagrid 
	columnsDef: TTdsDataGridColumnDef[];
	//rows: any[];
	rowSeparator: boolean;
	itemOffset: number;
}

function getColumnAlign(columnDef: TTdsDataGridColumnDef): string | undefined {
	let alignClass: string | undefined = columnDef.align ? `tds-text-${columnDef.align}` : undefined;
	let type: string = columnDef.displayType || columnDef.type;

	if (type == "boolean") {
		alignClass = "tds-text-center";
	} else if ((type == "date") || (type == "time")) {
		alignClass = "tds-text-center";
	} else if (type == "datetime") {
		alignClass = "tds-text-right";
	} else if ((columnDef.type == "number")) {
		alignClass = "tds-text-right";
	}

	return alignClass;
}

function BuildRows(props: TBuildRowsProps) {
	const { rows, itemOffset, modelField } = useDataSourceContext();

	const buildRow = (row: any, index: number, itemOffset: number): React.ReactElement[] => {
		let reactElements: React.ReactElement[] = [];
		let rowNumber: number = 0;

		while (rowNumber != -1) {
			let gridTemplate: string = "";

			props.columnsDef
				.filter(column => column.visible)
				.filter((column) => (column.rowGroup || 0) == rowNumber)
				.map((column, _index: number) => {
					gridTemplate += ` ${column.width || "1fr"} `;
				});

			reactElements.push(
				<VscodeTableRow row-type="default"
					key={`${props.id}_row_${rowNumber}_${index + itemOffset}`}
					id={`${props.id}_row_${rowNumber}_${index + itemOffset}`}
				>
					{
						//gridTemplateColumns = { gridTemplate }
					}
					{props.columnsDef.filter((column: TTdsDataGridColumnDef) => column.visible)
						.filter(column => (column.rowGroup || 0) == rowNumber)
						.map((column, indexCol: number) => (
							<VscodeTableCell
								id={`${props.id}_cell_${rowNumber}_${index + itemOffset}${indexCol + 1}`}
								key={`${props.id}_cell__${rowNumber}_${index + itemOffset}${indexCol + 1}`}
								grid-column={indexCol + 1}
								className={getColumnAlign(column)}
							>
								{
									fieldData(
										{
											rows: rows,
											fieldDef: column,
											row: row,
											fieldName: `${modelField || "dataSource"}.${index + itemOffset}.${column.name}`
										})
								}
							</VscodeTableCell>
						))}
				</VscodeTableRow>
			);

			rowNumber = rowNumber + 1;

			if (props.columnsDef.findIndex(column => (column.rowGroup || 0) == rowNumber) == -1) {
				rowNumber = -1;
			}
		}

		if (props.rowSeparator) {
			reactElements.push(
				<VscodeTableRow row-type="default" key={`${props.id}_row_separator_${index + itemOffset}`}>
					{props.columnsDef.filter(column => column.visible)
						.filter(column => (column.rowGroup || 0) == 0)
						.map((_column, indexCol: number) => (
							<VscodeTableCell
								key={`${props.id}_cell_separator_${index + itemOffset}${indexCol + 1}`}
								grid-column={indexCol + 1}
								cell-type="rowseparator"
							>
								<VscodeDivider role="separator"></VscodeDivider>
							</VscodeTableCell>
						))}
				</VscodeTableRow>
			);
		}

		return reactElements;
	}

	return rows
		.slice(itemOffset, itemOffset + 10)
		.map((row: any, index: number) => {
			if (row.index_) {
				return buildRow(row, row.index_, props.itemOffset)
			} else {
				return buildRow(row, index, props.itemOffset)
			}
		});
}

function fieldData(props: TFieldDataProps) { //, forceRefresh: number = -1
	const column = props.fieldDef;
	const row = props.row;

	if (column.type == "boolean") {
		return (
			<VscodeCheckbox
				key={`${props.fieldName}`}
				checked={row.mark || false}
				name={props.fieldName}
			></VscodeCheckbox>
		)
	}

	let value: string = "";
	let title: string = "";

	//Campo DATE, TIME e DATETIME
	if ((column.type == "date") || (column.type == "time") || (column.type == "datetime")) {
		value = tdsVscode.l10n.format(row[column.name], (column.displayType || column.type) as "date" | "time" | "datetime") || "";
		title = value.startsWith("Invalid") ? row[column.name] : value;
	} else if ((column.type == "number")) {
		value = tdsVscode.l10n.formatNumber(row[column.name], (column.displayType || column.type) as "int" | "float" | "hex" | "HEX" | "number") || "";
		title = value.startsWith("Invalid") ? row[column.name] : value;
	} else { // string
		value = (column.lookup && column.lookup[row[column.name]])
			? column.lookup[row[column.name]]
			: tdsVscode.l10n.format(row[column.name], (column.displayType || column.type)) || "";
		title = value;
	}

	//return <VscodeLabel title={value}>{title}</VscodeLabel>
	return <span title={title}>{value}</span>;
}

function prepareDataSource(columnsDef: TTdsDataGridColumnDef[], dataSource: any[],
	allFieldsFilter: string, fieldsFilter: Record<string, string>,
	groupingInfo: TGroupingInfo, groupingFilter: string[], sortedColumn: TTdsDataGridColumnDef): any[] {

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

	let rows: any[] = dataSource.map((row: any, index: number) => { return { ...row, index_: index } });

	if (allFieldsFilter) {
		try {
			const filter: RegExp = new RegExp(`${allFieldsFilter}`, "i");
			const filters: Record<string, RegExp[]> = initFilters(filter);

			rows = applyOrFilter(rows, filters);
		} catch (error) {
			console.log("Invalid RegExp");
		}
	}

	if ((fieldsFilter) && (Object.keys(fieldsFilter).length > 0)) {
		const filters: Record<string, RegExp[]> = initFilters();

		Object.keys(fieldsFilter).forEach((key: string) => {
			filters[key].push(new RegExp(`${fieldsFilter[key]}`, "i"));
		});

		rows = applyAndFilter(rows, filters);
	};

	if (groupingInfo && groupingFilter) {
		const filters: Record<string, RegExp[]> = initFilters();

		groupingFilter.forEach((filter: string) => {
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

/**
 * Renders a data grid component with features like pagination, sorting, filtering, and grouping.
 *
 * @param props - The props for the data grid component.
 * @param props.id - The unique identifier for the data grid.
 * @param props.dataSource - The data source for the data grid.
 * @param props.columnDef - The column definitions for the data grid.
 * @param props.options - The options for the data grid, including pagination, filtering, and grouping settings.
 * @returns A React element representing the data grid.
 */
export function TdsDataGrid(props: TTdsDataGridProps): React.ReactElement {
	return (
		<DataSourceProvider modelField={props.modelField} >
			<TdsDataGrid2 {...props} />
		</DataSourceProvider>
	)
}

function TdsDataGrid2(props: TTdsDataGridProps): React.ReactElement {
	const {
		rows, setRows,
		filter, setFilter,
		sortedColumn, setSortedColumn,
		sortedDirection, setSortedDirection,
		currentPage, setCurrentPage,
		pageSize, setPageSize,
		itemOffset, setItemOffset,
		showFieldsFilter, setShowFieldsFilter,
		filterByField, setFilterByField,
		groupingInfo, setGroupingInfo,
		groupingFilter, setGroupingFilter
	} = useDataSourceContext();

	const handlePageClick = (newPage: number) => {
		const newOffset = (newPage * (props.options.pageSize)) % rows.length;

		setCurrentPage(newPage);
		setItemOffset(newOffset);
	}

	const handlePageSizeClick = (newSize: number) => {
		setPageSize(newSize);
		setCurrentPage(0);
		setItemOffset(0);
	};

	const handleSortClick = (columnSort: TTdsDataGridColumnDef) => {
		columnSort.sortDirection = columnSort.sortDirection === "asc" ? "desc"
			: columnSort.sortDirection === "desc" ? "" : "asc";

		setSortedColumn(columnSort);
		setSortedDirection(columnSort.sortDirection);
	}

	const handleGroupingClick = (columnDef: TTdsDataGridColumnDef | undefined) => {
		if (columnDef) {
			const groupingValues: Record<string, number> = rows.reduce((acc: Record<string, number>, item: any) => {
				if (acc[item[columnDef.name]]) {
					acc[item[columnDef.name]] += 1;
				} else {
					acc[item[columnDef.name]] = 1;
				}

				return acc;
			}, []);

			const indexColumn = props.columnsDef.indexOf(columnDef);
			setGroupingInfo({
				groupingCol: props.columnsDef[indexColumn],
				groupingValues: groupingValues
			});
			setGroupingFilter([]);
		} else {
			setGroupingInfo(undefined);
		}
	}
	if (props.options.topActions == undefined) {
		props.options.topActions = [];
	}
	if (props.options.bottomActions == undefined) {
		props.options.bottomActions = [];
	}
	if (props.options.grouping == undefined) {
		props.options.grouping = true;
	}
	if (props.options.filter == undefined) {
		props.options.filter = true;
	}
	if (props.options.sortable == undefined) {
		props.options.sortable = true;
	}
	if (props.options.pageSize == undefined) {
		props.options.pageSize = 50;
	}
	if (props.options.pageSizeOptions == undefined) {
		props.options.pageSizeOptions = [50, 100, 250, 500, 1000];
	}

	props.columnsDef.forEach((columnDef: TTdsDataGridColumnDef) => {
		columnDef.sortable = columnDef.sortable == undefined ? true : columnDef.sortable;
		columnDef.sortDirection = columnDef.sortDirection == undefined ? "" : columnDef.sortDirection;
		columnDef.visible = columnDef.visible == undefined ? true : columnDef.visible;
		columnDef.grouping = columnDef.grouping == undefined ? false : columnDef.grouping;
	});

	const buildRowHeader = (columnDefs: TTdsDataGridColumnDef[]): React.ReactElement[] => {
		let reactElements: React.ReactElement[] = [];
		let rowNumber: number = 0;

		while (rowNumber != -1) {
			let gridTemplate: string = "";

			columnDefs
				.filter(column => column.visible)
				.filter((column) => (column.rowGroup || 0) == rowNumber)
				.map((column, _index: number) => {
					gridTemplate += ` ${column.width || "1fr"} `;
				});

			//gridTemplateColumns={gridTemplate}
			reactElements.push(
				<VscodeTableRow
					row-type="header"
					id={`${props.id}_header_${rowNumber}`}
					key={`${props.id}_header_${rowNumber}`}
				>
					{
						columnDefs
							.filter(column => column.visible)
							.filter((column) => (column.rowGroup || 0) == rowNumber)
							.map((column, _index: number) => (
								<VscodeTableHeaderCell
									key={`${props.id}_header_column_${rowNumber}_${_index}`}
									className={getColumnAlign(column)}
								>
									{column.label || column.name}&nbsp;
									{props.options.sortable && column.sortable &&
										<VscodeIcon
											name={
												column.sortDirection == "asc" ? "arrow-down"
													: column.sortDirection == "desc" ? "arrow-up"
														: "sort-precedence"
											}
											actionIcon
											onClick={() => {
												handleSortClick(column);
											}} />
									}
									{((props.options.grouping && column.grouping) || false) &&
										<VscodeIcon
											actionIcon
											name="group-by-ref-type"
											onClick={() => {
												handleGroupingClick(column);
											}}
										/>
									}
								</VscodeTableHeaderCell>
							))
					}
				</VscodeTableRow >
			);

			rowNumber = rowNumber + 1;

			if (columnDefs.findIndex(column => (column.rowGroup || 0) == rowNumber) == -1) {
				rowNumber = -1;
			}
		}

		return reactElements;
	}

	React.useEffect(() => {
		props.columnsDef.forEach((columnDef: TTdsDataGridColumnDef) => {
			if (!sortedColumn && (columnDef.sortDirection != "")) {
				setSortedColumn(columnDef);
				setSortedDirection(columnDef.sortDirection);
			}
		});

		if (props.options.pageSize !== pageSize) {
			setPageSize(props.options.pageSize);
		}

		const data = prepareDataSource(props.columnsDef, props.dataSource,
			filter, filterByField, groupingInfo, groupingFilter,
			sortedColumn);
		setRows(data);
	}, [
		filter,
		groupingInfo, groupingFilter,
		itemOffset, currentPage, pageSize,
		showFieldsFilter, filterByField,
		sortedColumn, sortedDirection
	]);

	return (
		<section className="tds-data-grid" id={`${props.id}`}>
			<div className="tds-data-grid-header">
				{(props.options.filter) &&
					<FilterBlock actions={props.options.topActions} />
				}
				{groupingInfo && <GroupingPanel />}
			</div>

			<div className="tds-data-grid-content" key={`${props.id}_content`}>
				<VscodeTable
					id={`${props.id}_grid`}
					key={`${props.id}_grid`}
					bordered-columns
					resizable={true}
				>
					<VscodeTableHeader slot="header">
						{buildRowHeader(props.columnsDef)}
					</VscodeTableHeader>

					<VscodeTableBody
						key={`${props.id}body`}
						slot="body"
					>
						{
							showFieldsFilter &&
							<BuildRowFilter
								id={`${props.id}_grid_filter`}
								key={`${props.id}_grid_filter`}
								columnDefs={props.columnsDef}
								rows={rows}
							/>
						}

						{((rows == undefined) || (rows.length == 0)) ?
							<>No data to show.</>
							: <BuildRows
								key={`${props.id}_rows`}
								id={`${props.id}`}
								columnsDef={props.columnsDef}
								rowSeparator={props.options.rowSeparator || false}
								itemOffset={itemOffset}
							/>
						}
					</VscodeTableBody>
				</VscodeTable>
			</div>

			<div className="tds-data-grid-footer">
				<TdsPaginator
					key={"paginator"}
					pageSize={pageSize}
					currentPage={currentPage}
					currentItem={itemOffset}
					totalItems={rows ? rows.length : 0}
					pageSizeOptions={props.options.pageSizeOptions}
					onPageChange={handlePageClick}
					onPageSizeChange={handlePageSizeClick}
				/>
				{props.options.bottomActions && <div className="tds-data-grid-actions">
					{props.options.bottomActions.map((action: TTdsDataGridAction) => {
						let propsField: any = {};
						let visible: string = "";

						if (typeof action.id === "string") {
							propsField["id"] = action.id;
						}

						propsField["type"] = action.type || "button";

						if (action.enabled !== undefined) {
							if (typeof action.enabled === "function") {
								propsField["disabled"] = !(action.enabled as Function)(false, true);
							} else {
								propsField["disabled"] = !action.enabled;
							}
						}

						if (action.appearance) {
							propsField["appearance"] = action.appearance;
						}

						if (action.onClick) {
							propsField["onClick"] = action.onClick;
						}

						if (action.visible !== undefined) {
							let isVisible: boolean = false;

							if (action.visible = typeof action.visible === "function") {
								isVisible = (Function)(action.visible)(false, true)
							} else {
								isVisible = action.visible;
							}

							visible = isVisible ? "" : "tds-hidden";
						}

						if (action.type == "link") {
							return (
								<TdsLink
									href={action.href}
									key={action.id}>
									{action.caption}
								</TdsLink>
							)
						} else if (action.type == "checkbox") {
							return (
								<VscodeCheckbox
									key={action.id}
									className={`tds-button-button ${visible}`}
									{...propsField} >
									{action.caption}
								</VscodeCheckbox>
							)
						} else {
							return (<VscodeButton
								key={action.id}
								className={`tds-button-button ${visible}`}
								{...propsField} >
								{action.caption}
							</VscodeButton>)
						}
					})}
				</div>
				}
			</div>
		</section >
	);
}
