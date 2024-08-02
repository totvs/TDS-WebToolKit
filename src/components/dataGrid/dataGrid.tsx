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
import { TdsSelectionField } from "../fields/selectionField";
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
	_rows: any[];
	rowSeparator: boolean;
	sortedColumn: TTdsDataGridColumnDef;
	groupingInfo: TGroupingInfo;
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

	let rows: any[] = [...props._rows];

	if (props.sortedColumn.sortDirection == "asc") {
		rows = rows.sort((r1: any, r2: any) => r1[props.sortedColumn.name] > r2[props.sortedColumn.name] ? 1 : -1);
	} else if (props.sortedColumn.sortDirection == "desc") {
		rows = rows.sort((r1: any, r2: any) => r1[props.sortedColumn.name] > r2[props.sortedColumn.name] ? -1 : 1);
	}

	let filters: Record<string, RegExp[]> = {}

	if (props.groupingInfo && props.groupingInfo.groupingFilter) {
		props.groupingInfo.groupingFilter.forEach((filter: string) => {
			if (!filters[props.groupingInfo.groupingCol.name]) {
				filters[props.groupingInfo.groupingCol.name] = [];
			}
			filters[props.groupingInfo.groupingCol.name].push(new RegExp(`^${filter}$`, "gi"));
		});
	}

	if (Object.keys(filters).length > 0) {
		rows = rows.filter((row: any, index: number) => {
			let found: boolean = false;

			Object.keys(filters).forEach((key: string) => {
				filters[key].forEach((filter: RegExp) => {
					found = found || filter.test(row[key]);
				});
			});

			return found ? row : null;
		})
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

	//Campo DATE, TIME e DATETIME
	if ((column.type == "date") || (column.type == "time") || (column.type == "datetime")) {
		const text: string = tdsVscode.l10n.format(row[column.name], (column.displayType || column.type) as "date" | "time" | "datetime");
		return (
			<VSCodeTextField
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
		return (
			<VSCodeCheckbox
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

	return (
		<VSCodeTextField
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

type TGroupingInfo = {
	groupingCol: TTdsDataGridColumnDef;
	groupingValues?: Record<string, number>;
	groupingFilter?: string[];
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
	const [showFilter, setShowFilter] = React.useState(false);
	const [sortedInfo, setSortedInfo] = React.useState(props.columnDef[0]);
	const [groupingInfo, setGroupingInfo] = React.useState<TGroupingInfo>();
	const [dataSource, setDataSource] = React.useState((props.dataSource || []).slice(0));

	React.useEffect(() => {
		setPageSize(props.options.pageSize);
		setTotalItems(props.dataSource.length);
		setDataSource(props.dataSource);
	}, [props.dataSource.length, props.options.pageSize]);

	const handlePageClick = (newPage: number) => {
		const newOffset = (newPage * (props.options.pageSize)) % dataSource.length;

		setItemOffset(newOffset);
		setCurrentPage(newPage);
	};

	const changeSortCallback = (columnDef: TTdsDataGridColumnDef) => {
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

	const changeGrouping = (columnDef: TTdsDataGridColumnDef | undefined) => {
		// props.columnDef.forEach((columnDef: TTdsDataGridColumnDef) => {
		// 	columnDef.visible = true;
		// })

		if (columnDef) {
			const groupingValues: Record<string, number> = props.dataSource.reduce((acc: Record<string, number>, item: any) => {
				if (acc[item[columnDef.name]]) {
					acc[item[columnDef.name]] += 1;
				} else {
					acc[item[columnDef.name]] = 1;
				}

				return acc;
			}, []);

			// const newColumnDef: TTdsDataGridColumnDef = {
			// 	...columnDef,
			// 	//visible: false
			// }

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

	const applyFilter = (filter: any, objects: any[]): any[] => {
		if (Object.keys(filter).length > 0) {
			return objects
				.filter((row: any) => {
					let found: boolean = false;
					Object.keys(filter).forEach((key: string) => {
						const wildcard: RegExp = new RegExp(`${filter[key]}`, "gi");

						found = found || (wildcard.test(row[key]))
					});

					return found ? row : null;
				});
		};

		return objects;
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

	const filterBlock = () => {
		return (
			<section className="tds-row-container">
				<TdsTextField
					name="filter"
					key={`${props.id}_filter`}
					label={tdsVscode.l10n.t("Filter")}
					info={tdsVscode.l10n.t("FilterInfo")}
					onInput={(e: any) => {
						e.preventDefault();

						let filters: any = {};
						if (e.target.value.trim() !== "") {
							props.columnDef.forEach((columnDef: TTdsDataGridColumnDef) => {
								filters[columnDef.name] = e.target.value;
							});
						}

						//setDataSource(applyFilter(filters, props.dataSource));
					}}
				/>

				<VSCodeButton appearance="icon" aria-label="Filter"
					onClick={() => {
						setShowFilter(!showFilter);
					}}
				>
					<span className="codicon codicon-list-filter"></span>
				</VSCodeButton>

				{props.options.topActions &&
					<div className="tds-data-grid-actions">
						{props.options.topActions.map((action: TTdsDataGridAction) => {
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

	props.columnDef.forEach((columnDef: TTdsDataGridColumnDef, index: number) => {
		if (columnDef.visible == undefined) {
			props.columnDef[index].visible = true;
		}
		if (columnDef.grouping == undefined) {
			props.columnDef[index].grouping = false;
		}
	});

	const buildRowFilter = (columnDefs: TTdsDataGridColumnDef[]): React.ReactElement[] => {
		let reactElements: React.ReactElement[] = [];
		let rowNumber: number = 0;

		while (rowNumber != -1) {
			reactElements.push(
				<VSCodeDataGridRow row-type="default" key={`${props.id}_filter_${0}`}>
					{props.columnDef
						.filter(column => column.visible)
						.filter(column => (column.row || 0) == rowNumber)
						.map((column, indexCol: number) => (
							<VSCodeDataGridCell
								grid-column={indexCol + 1}
								key={`${props.id}_cell_${indexCol + 1}`}
							>
								<FieldFilter
									key={`${props.id}_field_filter_${indexCol + 1}`}
									methods={methods}
									fieldDef={column}
									onFilterChanged={
										(fieldName: string, filter: string) => {
											let filters: any = {};
											if (filter.trim() !== "") {
												filters = { [fieldName]: filter };
											}
											setDataSource(applyFilter(filters, props.dataSource));
										}
									}
									dataSource={dataSource}
								/>
							</VSCodeDataGridCell>
						))}
				</VSCodeDataGridRow>
			)

			rowNumber = rowNumber + 1;

			if (columnDefs.findIndex(column => (column.row || 0) == rowNumber) == -1) {
				rowNumber = -1;
			}
		}

		reactElements.push(
			<VSCodeDataGridRow row-type="default" key={`${props.id}_filter_separator`}>
				{props.columnDef.filter(column => column.visible)
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
												changeSortCallback(column);
											}}
										>
											{column.sortDirection == "asc" && <span className="codicon codicon-arrow-small-down"></span>}
											{column.sortDirection == "desc" && <span className="codicon codicon-arrow-small-up"></span>}
											{column.sortDirection == "" && <span className="codicon codicon-sort-precedence"></span>}
										</VSCodeButton>
									}
									{((props.options.grouping && column.grouping) || false) &&
										<VSCodeButton appearance="icon" aria-label="Grouping"
											onClick={() => {
												changeGrouping(column);
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
				{(props.options.filter) && filterBlock()}
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
							.filter((column) => (column.row || 0) == 0)
							.map(column => column.width || "1fr").join(" ")
					}
				>
					{buildRowHeader(props.columnDef)}

					{showFilter && buildRowFilter(props.columnDef)}

					<BuildRows
						key={`${props.id}_build_rows`}
						id={props.id}
						columnsDef={props.columnDef}
						_rows={dataSource}
						rowSeparator={props.options.rowSeparator || false}
						itemOffset={itemOffset}
						pageSize={pageSize}
						sortedColumn={sortedInfo}
						groupingInfo={groupingInfo}
					/>
				</VSCodeDataGrid>
			</div>

			<div className="tds-data-grid-footer">
				{props.options.pageSizeOptions.length &&
					<TdsSelectionField
						key={"pagesize"}
						name={"pageSize"}
						label={tdsVscode.l10n.t("Elements/page")}
						options={(props.options.pageSizeOptions || [])
							.map((value: number) => { return { value: value.toString(), text: value.toString() } })
						}
						onInput={(e: any) => {
							e.preventDefault();
							setPageSize(parseInt(e.target.value));
							setCurrentPage(0);
							setItemOffset(0);
						}}
					/>
				}
				<TdsPaginator
					key={"paginator"}
					onPageChange={handlePageClick}
					pageSize={pageSize}
					currentPage={currentPage}
					currentItem={itemOffset}
					totalItems={totalItems}
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
