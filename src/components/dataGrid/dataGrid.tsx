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
import { TTdsDataGridAction, TTdsDataGridColumnDef, TTdsDataGridProps } from "./dataGrid.type";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { TdsTextField } from "../fields/textField";
import TdsPaginator from "./paginator";

/**
 * Renders the data grid component.
 *
 * @param props - The data grid component props.
 */
type TFieldFilterProps = {
	methods: UseFormReturn;
	fieldDef: TTdsDataGridColumnDef;
	dataSource: any;
	onFilterChanged(fieldName: string, filter: string): void;
}

type TFieldDataProps = {
	fieldDef: TTdsDataGridColumnDef;
	row: any;
	fieldName?: string;
}

type TBuildRowsProps = {
	pageSize: number;
	id: string;  //ID Datagrid 
	itemOffset: number;
	columnsDef: TTdsDataGridColumnDef[];
	rows: any[];
	rowSeparator: boolean;
	sortedColumn: TTdsDataGridColumnDef;
	groupingInfo: TGroupingInfo;
	allFieldsFilter: string;
	fieldsFilter: Record<string, string>;
}

function prepareDataSource(props: TBuildRowsProps): any[] {
	const initFilters = (value?: RegExp): Record<string, RegExp[]> => {
		const filters: Record<string, RegExp[]> = {};

		props.columnsDef.forEach((columnDef: TTdsDataGridColumnDef) => {
			filters[columnDef.name] = value !== undefined ? [value] : [];
		});

		return filters;
	};

	const applyOrFilter = (rows: any[], filters: Record<string, RegExp[]>): any[] => {
		if (Object.keys(filters).length > 0) {
			rows = rows.filter((row: any, index: number) => {
				let found: boolean = false;

				Object.keys(filters).forEach((key: string) => {
					filters[key].forEach((filter: RegExp) => {
						if (filter.test(row[key])) {
							found = true;
						}
					});
				});

				return found ? row : null;
			})
		}

		return rows;
	}

	const applyAndFilter = (rows: any[], filters: Record<string, RegExp[]>): any[] => {
		if (Object.keys(filters).length > 0) {
			rows = rows.filter((row: any, index: number) => {
				let found: boolean = true;

				Object.keys(filters).forEach((key: string) => {
					filters[key].forEach((filter: RegExp) => {
						found &&= filter.test(row[key])
					});
				});

				return found ? row : null;
			})
		}

		return rows;
	}

	let rows: any[] = [...props.rows];

	if (props.allFieldsFilter) {
		const filter: RegExp = new RegExp(`${props.allFieldsFilter}`, "i");
		const filters: Record<string, RegExp[]> = initFilters(filter);

		rows = applyOrFilter(rows, filters);
	}

	if ((props.fieldsFilter) && (Object.keys(props.fieldsFilter).length > 0)) {
		const filters: Record<string, RegExp[]> = initFilters();

		Object.keys(props.fieldsFilter).forEach((key: string) => {
			filters[key].push(new RegExp(`${props.fieldsFilter[key]}`, "i"));
		});

		rows = applyAndFilter(rows, filters);
	};

	if (props.groupingInfo && props.groupingInfo.groupingFilter) {
		const filters: Record<string, RegExp[]> = initFilters();

		props.groupingInfo.groupingFilter.forEach((filter: string) => {
			filters[props.groupingInfo.groupingCol.name].push(new RegExp(`${filter}`, "i"));
		});

		rows = applyOrFilter(rows, filters);
	}

	if (props.sortedColumn.sortDirection == "asc") {
		rows = rows.sort((r1: any, r2: any) => r1[props.sortedColumn.name] > r2[props.sortedColumn.name] ? 1 : -1);
	} else if (props.sortedColumn.sortDirection == "desc") {
		rows = rows.sort((r1: any, r2: any) => r1[props.sortedColumn.name] > r2[props.sortedColumn.name] ? -1 : 1);
	}

	return rows
		.slice(props.itemOffset, props.itemOffset + props.pageSize);
}

function BuildRows(props: TBuildRowsProps) {
	const buildRow = (row: any, index: number, itemOffset: number): React.ReactElement[] => {
		let reactElements: React.ReactElement[] = [];
		let rowNumber: number = 0;

		while (rowNumber != -1) {
			reactElements.push(
				<VSCodeDataGridRow row-type="default" key={`${props.id}_row_${index + itemOffset}`}>
					{props.columnsDef.filter(column => column.visible)
						.filter(column => (column.row || 0) == rowNumber)
						.map((column, indexCol: number) => (
							<VSCodeDataGridCell
								key={`${props.id}_cell_${index + itemOffset}${indexCol + 1}`}
								grid-column={indexCol + 1}>
								{fieldData(
									{
										fieldDef: column,
										row: row,
										fieldName: `${props.id}.${itemOffset + index}.${column.name}`
									})
								}
							</VSCodeDataGridCell>
						))}
				</VSCodeDataGridRow>
			);

			rowNumber = rowNumber + 1;

			if (props.columnsDef.findIndex(column => (column.row || 0) == rowNumber) == -1) {
				rowNumber = -1;
			}
		}

		if (props.rowSeparator) {
			reactElements.push(
				<VSCodeDataGridRow row-type="default" key={`${props.id}_row_separator_${index + itemOffset}`}>
					{props.columnsDef.filter(column => column.visible)
						.filter(column => (column.row || 0) == 0)
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

	const initFilters = (value?: RegExp): Record<string, RegExp[]> => {
		const filters: Record<string, RegExp[]> = {};

		props.columnsDef.forEach((columnDef: TTdsDataGridColumnDef) => {
			filters[columnDef.name] = value !== undefined ? [value] : [];
		});

		return filters;
	};

	const applyOrFilter = (rows: any[], filters: Record<string, RegExp[]>): any[] => {
		if (Object.keys(filters).length > 0) {
			rows = rows.filter((row: any, index: number) => {
				let found: boolean = false;

				Object.keys(filters).forEach((key: string) => {
					filters[key].forEach((filter: RegExp) => {
						if (filter.test(row[key])) {
							found = true;
						}
					});
				});

				return found ? row : null;
			})
		}

		return rows;
	}

	const applyAndFilter = (rows: any[], filters: Record<string, RegExp[]>): any[] => {
		if (Object.keys(filters).length > 0) {
			rows = rows.filter((row: any, index: number) => {
				let found: boolean = true;

				Object.keys(filters).forEach((key: string) => {
					filters[key].forEach((filter: RegExp) => {
						found &&= filter.test(row[key])
					});
				});

				return found ? row : null;
			})
		}

		return rows;
	}

	let rows: any[] = [...props.rows];

	if (props.allFieldsFilter) {
		const filter: RegExp = new RegExp(`${props.allFieldsFilter}`, "i");
		const filters: Record<string, RegExp[]> = initFilters(filter);

		rows = applyOrFilter(rows, filters);
	}

	if ((props.fieldsFilter) && (Object.keys(props.fieldsFilter).length > 0)) {
		const filters: Record<string, RegExp[]> = initFilters();

		Object.keys(props.fieldsFilter).forEach((key: string) => {
			filters[key].push(new RegExp(`${props.fieldsFilter[key]}`, "i"));
		});

		rows = applyAndFilter(rows, filters);
	};

	if (props.groupingInfo && props.groupingInfo.groupingFilter) {
		const filters: Record<string, RegExp[]> = initFilters();

		props.groupingInfo.groupingFilter.forEach((filter: string) => {
			filters[props.groupingInfo.groupingCol.name].push(new RegExp(`${filter}`, "i"));
		});

		rows = applyOrFilter(rows, filters);
	}

	if (props.sortedColumn.sortDirection == "asc") {
		rows = rows.sort((r1: any, r2: any) => r1[props.sortedColumn.name] > r2[props.sortedColumn.name] ? 1 : -1);
	} else if (props.sortedColumn.sortDirection == "desc") {
		rows = rows.sort((r1: any, r2: any) => r1[props.sortedColumn.name] > r2[props.sortedColumn.name] ? -1 : 1);
	}

	return rows
		.slice(props.itemOffset, props.itemOffset + props.pageSize)
		.map((row: any, index: number) => buildRow(row, index, props.itemOffset))
}

function FieldFilter(props: TFieldFilterProps) {
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
		>
			<span slot="end" className="codicon codicon-list-filter"></span>
		</VSCodeTextField>
	)
}

function fieldData(props: TFieldDataProps) {
	const methods = useFormContext();
	const column = props.fieldDef;
	const row = props.row;
	let alignClass: string | undefined = column.align ? `tds-text-${column.align}` : undefined;

	//Campo DATE, TIME e DATETIME
	if ((column.type == "date") || (column.type == "time") || (column.type == "datetime")) {
		const text: string = tdsVscode.l10n.format(row[column.name], (column.displayType || column.type) as "date" | "time" | "datetime");
		alignClass = alignClass || "tds-text-right";
		return (
			<VSCodeTextField
				className={alignClass}
				data-type={column.type}
				key={props.fieldName}
				readOnly={column.readOnly == undefined ? true : column.readOnly}
				value={text}
				title={text}
			></VSCodeTextField>
		)
	}

	//Campo BOOLEAN
	if (column.type == "boolean") {
		alignClass = alignClass || "tds-text-center";

		return (
			<VSCodeCheckbox
				className={alignClass}
				key={props.fieldName}
				readOnly={column.readOnly == undefined ? true : column.readOnly}
				checked={column.lookup && column.lookup[row[column.name]]
					? column.lookup[row[column.name]] : row[column.name]}
				onChange={(e) => {
					e.preventDefault();
					const target = e.target as HTMLInputElement;
					methods.setValue(props.fieldName, target.checked ? true : false);
					column.onChange!(e, props.fieldName, row);

					return target.checked;
				}}
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
			key={props.fieldName}
			readOnly={column.readOnly == undefined ? true : column.readOnly}
			value={text}
		></VSCodeTextField>
	)
}

type TGroupingBlockProps = {
	groupingInfo: TGroupingInfo;
	onFilterValues: (Filter: string[] | undefined) => void;
}

type TGroupingInfo = {
	groupingCol: TTdsDataGridColumnDef;
	groupingValues?: Record<string, number>;
	groupingFilter?: string[];
}

function GroupingBlock(props: TGroupingBlockProps) {
	const groupingCol: TTdsDataGridColumnDef = props.groupingInfo.groupingCol;
	const groupingFilter = props.groupingInfo.groupingFilter;
	const groupingValues: Record<string, number> = props.groupingInfo.groupingValues;
	const values = Object.keys(groupingValues).sort((v1: string, v2: string) => v1.localeCompare(v2));

	return (
		<section className="tds-row-container">
			<div className="tds-data-grid-grouping">
				<span className="label">{tdsVscode.l10n.t("Group by:")}</span>
				<span className="field_name">{groupingCol.label || groupingCol.name}</span>
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
				label={tdsVscode.l10n.t("Filter (accept Regular Expression)")}
				info={tdsVscode.l10n.t("FilterInfo")}
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
	datasource: any[];
}

function BuildRowFilter(props: BuildRowFilterProps): React.ReactElement[] {
	let reactElements: React.ReactElement[] = [];
	let rowNumber: number = 0;

	while (rowNumber != -1) {
		reactElements.push(
			<VSCodeDataGridRow row-type="default" key={`${props.id}_filter_${0}`}>
				{props.columnDefs
					.filter(column => column.visible)
					.filter(column => (column.row || 0) == rowNumber)
					.map((column, indexCol: number) => (
						<VSCodeDataGridCell
							grid-column={indexCol + 1}
							key={`${props.id}_cell_${indexCol + 1}`}
						>
							<FieldFilter
								key={`${props.id}_field_filter_${indexCol + 1}`}
								methods={props.methods}
								fieldDef={column}
								onFilterChanged={
									(fieldName: string, filter: string) => {
										let filters: Record<string, string> = props.fieldsFilter || {};

										if (filter.trim() !== "") {
											filters[fieldName] = filter;
										} else if (filters[fieldName]) {
											delete filters[fieldName];
										}

										props.onFilterFieldChanged(filters);
									}
								}
								dataSource={props.datasource}
							/>
						</VSCodeDataGridCell>
					))}
			</VSCodeDataGridRow>
		)

		rowNumber = rowNumber + 1;

		if (props.columnDefs.findIndex(column => (column.row || 0) == rowNumber) == -1) {
			rowNumber = -1;
		}
	}

	reactElements.push(
		<VSCodeDataGridRow row-type="default" key={`${props.id}_filter_separator`}>
			{props.columnDefs.filter(column => column.visible)
				.filter(column => (column.row || 0) == 0)
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
	const methods = useFormContext();
	const [itemOffset, setItemOffset] = React.useState(0);
	const [currentPage, setCurrentPage] = React.useState(1);
	const [pageSize, setPageSize] = React.useState(props.options.pageSize || 50);
	const [totalItems, setTotalItems] = React.useState(props.dataSource ? props.dataSource.length : 0);
	const [showFieldsFilter, setShowFieldsFilter] = React.useState(false);
	const [sortedInfo, setSortedInfo] = React.useState(props.columnDef[0]);
	const [groupingInfo, setGroupingInfo] = React.useState<TGroupingInfo>();
	const [allFieldsFilter, setAllFieldsFilter] = React.useState<string | undefined>(undefined);
	const [fieldsFilter, setFieldsFilter] = React.useState<Record<string, string> | undefined>(undefined);
	const [dataSource, setDataSource] = React.useState((props.dataSource || []).slice(0));

	React.useEffect(() => {
		setPageSize(props.options.pageSize);
		setTotalItems(dataSource.length);
		//setDataSource(props.dataSource);
	}, [dataSource, props.options.pageSize]);

	const handlePageClick = (newPage: number) => {
		const newOffset = (newPage * (props.options.pageSize)) % dataSource.length;

		setItemOffset(newOffset);
		setCurrentPage(newPage);
	};

	const handlePageSizeClick = (newSize: number) => {
		setPageSize(newSize);
		setItemOffset(0);
		setCurrentPage(1);
	};

	const handleSortClick = (columnDef: TTdsDataGridColumnDef) => {
		const newColumnDef: TTdsDataGridColumnDef = {
			...columnDef,
			sortDirection: columnDef.sortDirection === "asc" ? "desc" : columnDef.sortDirection === "desc" ? "" : "asc"
		}

		props.columnDef.forEach((columnDef: TTdsDataGridColumnDef) => {
			columnDef.sortDirection = "";
		})

		const indexColumn = props.columnDef.indexOf(columnDef);
		props.columnDef[indexColumn] = newColumnDef;

		setSortedInfo(props.columnDef[indexColumn])
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

			const indexColumn = props.columnDef.indexOf(columnDef);
			//			props.columnDef[indexColumn] = newColumnDef;
			setGroupingInfo({
				groupingCol: props.columnDef[indexColumn],
				groupingValues: groupingValues,
				groupingFilter: []
			})
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

	props.columnDef.forEach((columnDef: TTdsDataGridColumnDef, index: number) => {
		if (columnDef.visible == undefined) {
			props.columnDef[index].visible = true;
		}
		if (columnDef.grouping == undefined) {
			props.columnDef[index].grouping = false;
		}
	});

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
							.filter((column) => (column.row || 0) == rowNumber)
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

			if (columnDefs.findIndex(column => (column.row || 0) == rowNumber) == -1) {
				rowNumber = -1;
			}
		}

		return reactElements;
	}

	return (
		<section className="tds-data-grid" id={`${props.id}`}>
			<div className="tds-data-grid-header">
				{(props.options.filter) && <FilterBlock
					filter={allFieldsFilter}
					showFilter={true}
					actions={props.options.topActions}
					onFilterChanged={(value: string) => {
						setAllFieldsFilter(value);
					}}
					onShowFieldsFilter={(value: boolean) => {
						setShowFieldsFilter(value);
					}}
				/>}
				{groupingInfo &&
					<GroupingBlock
						groupingInfo={groupingInfo}
						onFilterValues={(filterValues: string[]) => {
							if (filterValues) {
								setGroupingInfo({ ...groupingInfo, groupingFilter: filterValues });
							} else {
								setGroupingInfo(undefined);
							}
						}}
					/>}
			</div>

			<div className="tds-data-grid-content">
				<VSCodeDataGrid
					id={`${props.id}_grid`}
					key={`${props.id}_grid`}
					generate-header="sticky"
					grid-template-columns={
						props.columnDef
							.filter(column => column.visible)
							.filter(column => (column.row || 0) == 0)
							.map(column => column.width || "1fr").join(" ")
					}
				>
					{buildRowHeader(props.columnDef)}

					{showFieldsFilter && <BuildRowFilter
						id={`${props.id}_grid`}
						columnDefs={props.columnDef}
						methods={methods}
						fieldsFilter={fieldsFilter}
						onFilterFieldChanged={(filter: Record<string, string>) => {
							setFieldsFilter(filter);
						}}
						datasource={dataSource}
					/>}

					<BuildRows
						key={`${props.id}_build_rows`}
						id={props.id}
						columnsDef={props.columnDef}
						rows={dataSource}
						rowSeparator={props.options.rowSeparator || false}
						itemOffset={itemOffset}
						pageSize={pageSize}
						sortedColumn={sortedInfo}
						groupingInfo={groupingInfo}
						allFieldsFilter={allFieldsFilter}
						fieldsFilter={fieldsFilter}
					/>
				</VSCodeDataGrid>
			</div>

			<div className="tds-data-grid-footer">
				<TdsPaginator
					key={"paginator"}
					pageSize={pageSize}
					currentPage={currentPage}
					currentItem={itemOffset}
					totalItems={totalItems}
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
