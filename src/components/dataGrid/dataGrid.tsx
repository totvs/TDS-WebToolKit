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
	VSCodeTextField, VSCodeDropdown, VSCodeOption,
	VSCodeLink,
	VSCodeCheckbox,
	VSCodeDivider,
	VSCodeBadge
} from "@vscode/webview-ui-toolkit/react";
import { UseFormReturn, useFormContext } from "react-hook-form";
import { TGroupingInfo, TTdsDataGridAction, TTdsDataGridColumnDef, TTdsDataGridProps } from "./dataGrid.type";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { TdsTextField } from "../fields/textField";
import TdsPaginator from "./paginator";
import { dataGridState, prepareDataSource, TDataGridState } from './dataGridState';

/**
 * Renders the data grid component.
 *
 * @param props - The data grid component props.
 */
type TFieldFilterProps = {
	methods: UseFormReturn;
	fieldDef: TTdsDataGridColumnDef;
	values: Record<string, string>;
	dataSource: any;
	onFilterChanged(fieldName: string, filter: string): void;
}

type TFieldDataProps = {
	fieldDef: TTdsDataGridColumnDef;
	row: any;
	fieldName?: string;
}

type TBuildRowsProps = {
	id: string;  //ID Datagrid 
	columnsDef: TTdsDataGridColumnDef[];
	rows: any[];
	rowSeparator: boolean;
	itemOffset: number;
}

function BuildRows(props: TBuildRowsProps) {
	const buildRow = (row: any, index: number, itemOffset: number): React.ReactElement[] => {
		let reactElements: React.ReactElement[] = [];
		let rowNumber: number = 0;

		while (rowNumber != -1) {
			reactElements.push(
				<VSCodeDataGridRow row-type="default"
					id={`${props.id}_row_${index + itemOffset}`}
					key={`${props.id}_row_${index + itemOffset}`}>
					{props.columnsDef.filter(column => column.visible)
						.filter(column => (column.rowGroup || 0) == rowNumber)
						.map((column, indexCol: number) => (
							<VSCodeDataGridCell
								id={`${props.id}_cell_${index + itemOffset}${indexCol + 1}`}
								key={`${props.id}_cell_${index + itemOffset}${indexCol + 1}`}
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

	return props.rows.map((row: any, index: number) => buildRow(row, index, props.itemOffset))
}

function FieldFilter(props: TFieldFilterProps) {
	let currentValue: string = props.values[props.fieldDef.name] || "";

	if (props.fieldDef.lookup) {
		const currentValue: string = props.methods.getValues(props.fieldDef.name) as string;
		const options: Record<string, string> = !props.dataSource
			? {}
			: props.dataSource.reduce((acc: Record<string, string>, item: any) => {

				if (!acc[item[props.fieldDef.name]]) {
					acc[item[props.fieldDef.name]] = props.fieldDef.lookup![item[props.fieldDef.name]];
				}

				return acc;
			}, []);

		if (Object.keys(options).length > 0) {
			return (
				<VSCodeDropdown
					onChange={(e: any) => {
						e.preventDefault();
						const value: string = e?.target?.value;
						return props.onFilterChanged(props.fieldDef.name, value);
					}}>
					<VSCodeOption key={0}
						value={""}
						checked={currentValue === ""}>{"(All)"}
					</VSCodeOption>
					{Object.keys(options).map((key: string, index: number) => {
						return (
							<VSCodeOption key={index}
								value={key}
								checked={currentValue === key}>{options[key]}
							</VSCodeOption>
						)
					})}
				</VSCodeDropdown>
			)
		}
	}

	return (
		<VSCodeTextField
			onInput={(e: any) => {
				e.preventDefault();
				return props.onFilterChanged(props.fieldDef.name, e.target.value);
			}}
			value={currentValue}
		>
			<span slot="end" className="codicon codicon-list-filter"></span>
		</VSCodeTextField>
	)
}

function fieldData(props: TFieldDataProps) { //, forceRefresh: number = -1
	const methods = useFormContext();
	const column = props.fieldDef;
	const row = props.row;
	let alignClass: string | undefined = column.align ? `tds-text-${column.align}` : undefined;


	const forceRefresh = 0;


	//Campo DATE, TIME e DATETIME
	if ((column.type == "date") || (column.type == "time") || (column.type == "datetime")) {
		const text: string = tdsVscode.l10n.format(row[column.name], (column.displayType || column.type) as "date" | "time" | "datetime");
		alignClass = alignClass || "tds-text-right";
		return (
			<VSCodeTextField
				className={alignClass}
				data-type={column.type}
				key={`${props.fieldName}${forceRefresh > 0 ? forceRefresh : ""}`}
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
				key={`${props.fieldName}${forceRefresh > 0 ? forceRefresh : ""}`}
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
			value={text.startsWith("Invalid") ? row[column.name] : text}
		></VSCodeTextField>
	)
}

type TGroupingBlockProps = {
	groupingInfo: TGroupingInfo;
	onFilterValues: (Filter: string[] | undefined) => void;
}

function GroupingBlock(props: TGroupingBlockProps) {
	const groupingCol: TTdsDataGridColumnDef = props.groupingInfo.groupingCol;
	const groupingFilter = props.groupingInfo.groupingFilter;
	const groupingValues: Record<string, number> = props.groupingInfo.groupingValues;
	const values = Object.keys(groupingValues).sort((v1: string, v2: string) => v1.localeCompare(v2));

	return (
		<section className="tds-row-container">
			<div className="tds-data-grid-grouping">
				{
					//<span className="label">{tdsVscode.l10n.t("Group by:")}</span>
				}
				<span className="field_name">{groupingCol.label || groupingCol.name}: </span>
				{values.map((data: string, index: number) => (
					<VSCodeButton
						key={`btn_grouping_filter_${groupingCol.name}.${index}`}
						appearance={groupingFilter.indexOf(data) > -1 ? "primary" : "secondary"}
						onClick={() => {
							let filter: string[] = groupingFilter;
							let pos: number = groupingFilter.indexOf(data);

							if (pos > -1) {
								delete filter[pos];
							} else {
								filter.push(data);
							}

							props.onFilterValues(filter);
						}}
					>
						{groupingCol.lookup && groupingCol.lookup[data]
							? groupingCol.lookup[data] : data}
						<VSCodeBadge>{groupingValues[data]}</VSCodeBadge>
					</VSCodeButton>
				))
				}
				<VSCodeButton appearance="icon" aria-label="Ungroup"
					key={`btn_grouping_${groupingCol.name}`}
					onClick={() => {
						props.onFilterValues(undefined);
					}}
				>
					<span className="codicon codicon-close"></span>
				</VSCodeButton>

			</div>
		</section>
	)
}


type TFilterBlockProps = {
	filter: string;
	showFilter: boolean;
	actions: TTdsDataGridAction[];
	onFilterChanged: (filter: string | undefined) => void;
	onShowFieldsFilter: (value: boolean) => void;
}

function FilterBlock(props: TFilterBlockProps) {
	const [filterValue, setFilterValue] = React.useState(props.filter || "");
	const [showFieldsFilter, setShowFieldsFilter] = React.useState(false);

	return (
		<section className="tds-row-container">
			<TdsTextField
				name="filter"
				key={`all_filter`}
				label={tdsVscode.l10n.t("Filter")}
				info={tdsVscode.l10n.t("Filters on all columns and can accept regular expressions")}
				value={filterValue}
				onInput={(e: any) => {
					e.preventDefault();
					const filter: string = e.target.value.trim();

					setFilterValue(filter);
					if (filter.length > 0) {
						props.onFilterChanged(filter);
					} else {
						props.onFilterChanged(undefined);
					}
				}}
			/>

			<VSCodeButton appearance="icon" aria-label="Filter"
				onClick={() => {
					setShowFieldsFilter(!showFieldsFilter);
					props.onShowFieldsFilter(!showFieldsFilter); //ainda não deu tempo de atualizar useState
				}}
			>
				<span className="codicon codicon-list-filter"></span>
			</VSCodeButton>

			{props.actions &&
				<div className="tds-data-grid-actions">
					{props.actions.map((action: TTdsDataGridAction) => {
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

						return (action.type == "link" ?
							<VSCodeLink
								key={action.id}
								href={action.href}>{action.caption}
							</VSCodeLink>
							: <VSCodeButton
								key={action.id}
								className={`tds-button-button ${visible}`}
								{...propsField} >
								{action.caption}
							</VSCodeButton>)
					})}
				</div>
			}
		</section>
	)
}

type BuildRowFilterProps = {
	id: string;
	columnDefs: TTdsDataGridColumnDef[];
	methods: any;
	fieldsFilter: any;
	onFilterFieldChanged: (filter: Record<string, string> | undefined) => void;
	dataSource: any[];
	show: boolean;
}

function BuildRowFilter(props: BuildRowFilterProps): React.ReactElement[] {
	const forceRefresh: number = Date.now();
	const [filterValue, setFilterValue] = React.useState(props.fieldsFilter || {});
	let reactElements: React.ReactElement[] = [];
	let rowNumber: number = 0;

	if (props.show) {
		while (rowNumber != -1) {
			reactElements.push(
				<VSCodeDataGridRow row-type="default" key={`${props.id}_filter_${0}`}>
					{props.columnDefs
						.filter(column => column.visible)
						.filter(column => (column.rowGroup || 0) == rowNumber)
						.map((column, indexCol: number) => (
							<VSCodeDataGridCell
								grid-column={indexCol + 1}
								key={`${props.id}_cell_${indexCol + 1}`}
							>
								<FieldFilter
									key={`${props.id}_field_filter_${indexCol + 1}`}
									methods={props.methods}
									fieldDef={column}
									values={props.fieldsFilter || {}}
									onFilterChanged={
										(fieldName: string, filter: string) => {
											let filters: Record<string, string> = props.fieldsFilter || {};

											if (filter.trim() !== "") {
												filters[fieldName] = filter;
											} else if (filters[fieldName]) {
												delete filters[fieldName];
											}

											if (Object.keys(filters).length == 0) {
												filters = undefined;;
											}

											setFilterValue(filters);
											props.onFilterFieldChanged(filters);
										}
									}
									dataSource={props.dataSource}
								/>
							</VSCodeDataGridCell>
						))}
				</VSCodeDataGridRow>
			)

			rowNumber = rowNumber + 1;

			if (props.columnDefs.findIndex(column => (column.rowGroup || 0) == rowNumber) == -1) {
				rowNumber = -1;
			}
		}

		reactElements.push(
			<VSCodeDataGridRow row-type="default"
				key={`${props.id}_filter_separator_${forceRefresh}`}
			>
				{props.columnDefs.filter(column => column.visible)
					.filter(column => (column.rowGroup || 0) == 0)
					.map((_column, indexCol: number) => (
						<VSCodeDataGridCell
							key={`${props.id}_filter_separator_${indexCol}`}
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
	const [keyContent, setKeyContent] = React.useState(0);
	const [dataSource, setDataSource] = React.useState([]);
	const methods = useFormContext();
	const [state, dispatch] = React.useReducer<TDataGridState>(dataGridState, {
		timeStamp: Date.now(),
		isReady: false,
		itemOffset: 0,
		currentPage: 0,
		pageSize: props.options.pageSize || 50,
		columnsDef: props.columnsDef.map((columnDef: TTdsDataGridColumnDef) => {
			columnDef.sortable = columnDef.sortable == undefined ? true : columnDef.sortable;
			columnDef.sortDirection = columnDef.sortDirection == undefined ? "" : columnDef.sortDirection;
			columnDef.visible = columnDef.visible == undefined ? true : columnDef.visible;
			columnDef.grouping = columnDef.grouping == undefined ? false : columnDef.grouping;

			return columnDef;
		}),
		showFieldsFilter: false,
		allFieldsFilter: undefined,
		fieldsFilter: undefined,
		sortedColumn: props.columnsDef.find((columnDef: TTdsDataGridColumnDef) => {

			return (columnDef.sortable && (columnDef.sortDirection !== "")) ? columnDef.sortable : undefined;
		}),

		groupingInfo: undefined,
	});

	const handlePageClick = (newPage: number) => {
		const newOffset = (newPage * (props.options.pageSize)) % dataSource.length;

		dispatch({ type: "set_item_offset", value: newOffset });
		dispatch({ type: "set_current_page", value: newPage });
	}

	const handlePageSizeClick = (newSize: number) => {
		dispatch({ type: "set_page_size", value: newSize });
		dispatch({ type: "set_item_offset", value: 0 });
		dispatch({ type: "set_current_page", value: 0 });
	};

	const handleSortClick = (columnSort: TTdsDataGridColumnDef) => {
		const newColumnDef: TTdsDataGridColumnDef = {
			...columnSort,
			sortDirection: columnSort.sortDirection === "asc" ? "desc"
				: columnSort.sortDirection === "desc" ? "" : "asc"
		}

		state.columnsDef.forEach((column: TTdsDataGridColumnDef) => {
			column.sortDirection = "";
		})

		const indexColumn = state.columnsDef.indexOf(columnSort);
		state.columnsDef[indexColumn] = newColumnDef;

		dispatch({ type: "set_columns_def", columnsDef: state.columnsDef });
		dispatch({ type: "set_sorted_column", columnIndex: indexColumn, direction: newColumnDef.sortDirection });
	}

	const handleGroupingClick = (columnDef: TTdsDataGridColumnDef | undefined) => {
		if (columnDef) {
			const groupingValues: Record<string, number> = props.dataSource.reduce((acc: Record<string, number>, item: any) => {
				if (acc[item[columnDef.name]]) {
					acc[item[columnDef.name]] += 1;
				} else {
					acc[item[columnDef.name]] = 1;
				}

				return acc;
			}, []);

			const indexColumn = state.columnsDef.indexOf(columnDef);
			dispatch({
				type: "set_grouping_info", grouping: {
					groupingCol: state.columnsDef[indexColumn],
					groupingValues: groupingValues,
					groupingFilter: []
				}
			})
		} else {
			dispatch({
				type: "set_grouping_info", grouping: undefined
			})
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

	const buildRowHeader = (columnDefs: TTdsDataGridColumnDef[]): React.ReactElement[] => {
		let reactElements: React.ReactElement[] = [];
		let rowNumber: number = 0;

		while (rowNumber != -1) {
			reactElements.push(
				<VSCodeDataGridRow
					row-type="header"
					key={`${props.id}_header`}
				>
					{
						columnDefs
							.filter(column => column.visible)
							.filter((column) => (column.rowGroup || 0) == rowNumber)
							.map((column, _index: number) => (
								<VSCodeDataGridCell
									cell-type="columnheader"
									grid-column={_index + 1}
									key={`${props.id}_header_column_${_index}`}
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

	if (!state.isReady) {
		dispatch({ type: "is_ready" });
	}

	if (keyContent !== state.timeStamp) {
		setKeyContent(state.timeStamp);
		setDataSource(prepareDataSource(state.columnsDef, [...props.dataSource],
			state.allFieldsFilter, state.fieldsFilter, state.groupingInfo,
			state.sortedColumn));
	}

	return (
		<section className="tds-data-grid" id={`${props.id}`}>
			<div className="tds-data-grid-header">
				{(props.options.filter) && <FilterBlock
					filter={state.allFieldsFilter}
					showFilter={true}
					actions={props.options.topActions}
					onFilterChanged={(value: string) => {
						dispatch({ type: "set_all_fields_filter", filter: value })
					}}
					onShowFieldsFilter={(value: boolean) => {
						dispatch({ type: "set_show_fields_filter", value: value });
					}}
				/>}
				{state.groupingInfo &&
					<GroupingBlock
						groupingInfo={state.groupingInfo}
						onFilterValues={(filterValues: string[]) => {
							if (filterValues) {
								dispatch({
									type: "set_grouping_info", grouping: {
										...state.groupingInfo,
										groupingFilter: filterValues
									}
								})

							} else {
								dispatch({
									type: "set_grouping_info", grouping: undefined
								});
							}
						}}
					/>}
			</div>

			<div className="tds-data-grid-content" key={`${props.id}_content`}>
				<VSCodeDataGrid
					id={`${props.id}_grid`}
					key={`${props.id}_grid`}
					generate-header="sticky"
					grid-template-columns={
						state.columnsDef
							.filter(column => column.visible)
							.filter(column => (column.rowGroup || 0) == 0)
							.map(column => column.width || "1fr").join(" ")
					}
				>
					{buildRowHeader(state.columnsDef)}

					{<BuildRowFilter
						show={state.showFieldsFilter}
						id={`${props.id}_grid_filter`}
						key={`${props.id}_grid_filter`}
						columnDefs={state.columnsDef}
						methods={methods}
						fieldsFilter={state.fieldsFilter || ""}
						onFilterFieldChanged={(filter: Record<string, string>) => {
							dispatch({ type: "set_fields_filter", filter: filter });
						}}
						dataSource={dataSource}
					/>}

					{((dataSource == undefined) || (dataSource.length == 0)) ?
						<>No data to show.</>
						: <BuildRows
							key={`${props.id}`}
							id={`${props.id}`}
							columnsDef={state.columnsDef}
							rows={dataSource.slice(state.itemOffset, state.itemOffset + state.pageSize)}
							rowSeparator={props.options.rowSeparator || false}
							itemOffset={state.itemOffset}
						/>
					}
				</VSCodeDataGrid>
			</div>

			<div className="tds-data-grid-footer">
				<TdsPaginator
					key={"paginator"}
					pageSize={state.pageSize}
					currentPage={state.currentPage}
					currentItem={state.itemOffset}
					totalItems={dataSource.length}
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

						propsField["key"] = action.id;
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
