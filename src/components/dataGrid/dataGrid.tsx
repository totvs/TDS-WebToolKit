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
import {
	VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow,
	VSCodeTextField,
	VSCodeLink,
	VSCodeCheckbox,
	VSCodeDivider
} from "@vscode/webview-ui-toolkit/react";
import { useFormContext } from "react-hook-form";
import { TGroupingInfo, TTdsDataGridAction, TTdsDataGridColumnDef, TTdsDataGridProps } from "./dataGrid.type";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import TdsPaginator from "./paginator";
import { BuildRowFilter, FilterBlock } from "./fieldFilter";
import { DataSourceProvider, useDataSourceContext } from "./dataSourceContext";
import { GroupingPanel } from "./groupingPanel";

/**
 * Renders the data grid component.
 *
 * @param props - The data grid component props.
 */
type TFieldDataProps = {
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

function BuildRows(props: TBuildRowsProps) {
	const { dataSource, itemOffset } = useDataSourceContext();

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
				<VSCodeDataGridRow row-type="default"
					id={`${props.id}_row_${rowNumber}_${index + itemOffset}`}
					key={`${row.id}`}
					gridTemplateColumns={gridTemplate}
				>
					{props.columnsDef.filter(column => column.visible)
						.filter(column => (column.rowGroup || 0) == rowNumber)
						.map((column, indexCol: number) => (
							<VSCodeDataGridCell
								id={`${props.id}_cell_${rowNumber}_${index + itemOffset}${indexCol + 1}`}
								key={`${props.id}_cell__${rowNumber}_${index + itemOffset}${indexCol + 1}`}
								grid-column={indexCol + 1}>
								{fieldData(
									{
										fieldDef: column,
										row: row,
										fieldName: `${props.id}.${index + itemOffset}.${column.name}`
									})
								}
							</VSCodeDataGridCell>
						))}
				</VSCodeDataGridRow>
			);

			rowNumber = rowNumber + 1;

			if (props.columnsDef.findIndex(column => (column.rowGroup || 0) == rowNumber) == -1) {
				rowNumber = -1;
			}
		}

		if (props.rowSeparator) {
			reactElements.push(
				<VSCodeDataGridRow row-type="default" key={`${props.id}_row_separator_${index + itemOffset}`}>
					{props.columnsDef.filter(column => column.visible)
						.filter(column => (column.rowGroup || 0) == 0)
						.map((_column, indexCol: number) => (
							<VSCodeDataGridCell
								key={`${props.id}_cell_separator_${index + itemOffset}${indexCol + 1}`}
								grid-column={indexCol + 1}
								cell-type="rowseparator"
							>
								<VSCodeDivider role="separator"></VSCodeDivider>
							</VSCodeDataGridCell>
						))}
				</VSCodeDataGridRow>
			);
		}

		return reactElements;
	}

	return dataSource
		.slice(itemOffset, itemOffset + 10)
		.map((row: any, index: number) => buildRow(row, index, props.itemOffset))
}

function fieldData(props: TFieldDataProps) { //, forceRefresh: number = -1
	const methods = useFormContext();
	const column = props.fieldDef;
	const row = props.row;
	let alignClass: string | undefined = column.align ? `tds-text-${column.align}` : undefined;

	if (!row) {
		console.log("noRow");
	}

	//Campo DATE, TIME e DATETIME
	if ((column.type == "date") || (column.type == "time") || (column.type == "datetime")) {
		const text: string = tdsVscode.l10n.format(row[column.name], (column.displayType || column.type) as "date" | "time" | "datetime");
		alignClass = alignClass || "tds-text-right";
		return (
			<VSCodeTextField
				className={alignClass}
				data-type={column.type}
				key={`${props.fieldName}}`}
				readOnly={column.readOnly == undefined ? true : column.readOnly}
				value={text}
				title={text.startsWith("Invalid") ? row[column.name] : text}
			></VSCodeTextField>
		)
	}

	//Campo BOOLEAN
	if (column.type == "boolean") {
		alignClass = alignClass || "tds-text-center";

		return (
			<VSCodeCheckbox
				className={alignClass}
				key={`${props.fieldName}`}
				readOnly={column.readOnly == undefined ? true : column.readOnly}
				checked={methods.getValues(props.fieldName) || false}
				onChange={(e) => {
					e.preventDefault();
					e.stopPropagation();
					const target = e.target as HTMLInputElement;

					methods.setValue(props.fieldName, target.checked ? true : false);
					if (column.onChange) {
						column.onChange(e, props.fieldName, row);
					}
					return target.checked;
				}
				}
			></VSCodeCheckbox>
		)

	}

	const text: string = (column.lookup && column.lookup[row[column.name]])
		? column.lookup[row[column.name]]
		: tdsVscode.l10n.format(row[column.name], (column.displayType || column.type));

	if ((column.type == "number")) {
		alignClass = alignClass || "tds-text-right";
	}

	return (
		<VSCodeTextField
			className={alignClass}
			title={text}
			data-type={column.type}
			key={`${props.fieldName}`}
			readOnly={column.readOnly == undefined ? true : column.readOnly}
			value={(text || "<error>").startsWith("Invalid") ? row[column.name] || "<error>" : text}
		></VSCodeTextField>
	)
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

	let rows: any[] = [...dataSource];

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

	return (<DataSourceProvider>
		<TdsDataGrid2 {...props} />
	</DataSourceProvider>
	)
}

function TdsDataGrid2(props: TTdsDataGridProps): React.ReactElement {
	const {
		dataSource, setDataSource,
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
	const methods = useFormContext();
	const handlePageClick = (newPage: number) => {
		const newOffset = (newPage * (props.options.pageSize)) % dataSource.length;

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
		//}

		//dispatch({ type: "set_columns_def", columnsDef: props.columnsDef });
		setSortedColumn(columnSort);
		setSortedDirection(columnSort.sortDirection);
		//dispatch({ type: "set_sorted_column", columnIndex: indexColumn, direction: newColumnDef.sortDirection });
	}

	const handleGroupingClick = (columnDef: TTdsDataGridColumnDef | undefined) => {
		if (columnDef) {
			const groupingValues: Record<string, number> = dataSource.reduce((acc: Record<string, number>, item: any) => {
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

			reactElements.push(
				<VSCodeDataGridRow
					gridTemplateColumns={gridTemplate}
					row-type="header"
					id={`${props.id}_header_${rowNumber}`}
					key={`${props.id}_header_${rowNumber}`}
				>
					{
						columnDefs
							.filter(column => column.visible)
							.filter((column) => (column.rowGroup || 0) == rowNumber)
							.map((column, _index: number) => (
								<VSCodeDataGridCell
									cell-type="columnheader"
									grid-column={_index + 1}
									key={`${props.id}_header_column_${rowNumber}_${_index}`}
								>
									{column.label || column.name}
									{props.options.sortable && column.sortable &&
										<VSCodeButton
											appearance="icon"
											onClick={() => {
												handleSortClick(column);
											}}
										>
											{column.sortDirection == "asc" && <span className="codicon codicon-arrow-small-down"></span>}
											{column.sortDirection == "desc" && <span className="codicon codicon-arrow-small-up"></span>}
											{column.sortDirection == "" && <span className="codicon codicon-sort-precedence"></span>}
										</VSCodeButton>
									}
									{((props.options.grouping && column.grouping) || false) &&
										<VSCodeButton
											appearance="icon"
											aria-label={`Grouping by ${column.label || column.name}`}
											onClick={() => {
												handleGroupingClick(column);
											}}
										>
											<span className="codicon codicon-group-by-ref-type"></span>
										</VSCodeButton>
									}
								</VSCodeDataGridCell>
							))
					}
				</VSCodeDataGridRow >
			);

			rowNumber = rowNumber + 1;

			if (columnDefs.findIndex(column => (column.rowGroup || 0) == rowNumber) == -1) {
				rowNumber = -1;
			}
		}

		return reactElements;
	}

	props.columnsDef.forEach((columnDef: TTdsDataGridColumnDef) => {
		if (!sortedColumn && (columnDef.sortDirection != "")) {
			setSortedColumn(columnDef);
			setSortedDirection(columnDef.sortDirection);
		}
	});

	if (props.options.pageSize !== pageSize) {
		setPageSize(props.options.pageSize);
	}

	React.useEffect(() => {
		console.log(">>>> useEffect")
		const data = prepareDataSource(props.columnsDef, props.dataSource,
			filter, filterByField, groupingInfo, groupingFilter,
			sortedColumn);
		setDataSource(data);
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
				{(props.options.filter) && <FilterBlock
					actions={props.options.topActions}
				/>}
				{groupingInfo && <GroupingPanel />}
			</div>

			<div className="tds-data-grid-content" key={`${props.id}_content`}>
				<VSCodeDataGrid
					id={`${props.id}_grid`}
					key={`${props.id}_grid`}
					generate-header="sticky"
				>
					{buildRowHeader(props.columnsDef)}

					{showFieldsFilter && <BuildRowFilter
						id={`${props.id}_grid_filter`}
						key={`${props.id}_grid_filter`}
						columnDefs={props.columnsDef}
						methods={methods}
						dataSource={dataSource}
					/>}

					{((dataSource == undefined) || (dataSource.length == 0)) ?
						<>No data to show.</>
						: <BuildRows
							key={`${props.id}`}
							id={`${props.id}`}
							columnsDef={props.columnsDef}
							rowSeparator={props.options.rowSeparator || false}
							itemOffset={itemOffset}
						/>
					}
				</VSCodeDataGrid>
			</div>

			<div className="tds-data-grid-footer">
				<TdsPaginator
					key={"paginator"}
					pageSize={pageSize}
					currentPage={currentPage}
					currentItem={itemOffset}
					totalItems={dataSource ? dataSource.length : 0}
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
							return (<VSCodeLink
								key={action.id}
								href={action.href}>{action.caption}
							</VSCodeLink>)
						} else if (action.type == "checkbox") {
							return (<VSCodeCheckbox
								key={action.id}
								className={`tds-button-button ${visible}`}
								{...propsField} >
								{action.caption}
							</VSCodeCheckbox>)
						} else {
							return (<VSCodeButton
								key={action.id}
								className={`tds-button-button ${visible}`}
								{...propsField} >
								{action.caption}
							</VSCodeButton>)
						}
					})}
				</div>
				}
			</div>
		</section >
	);
}
