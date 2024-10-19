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
import { TTdsDataGridAction, TTdsDataGridColumnDef } from "./dataGrid.type";
import React from "react";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { TdsTextField } from "../fields/textField";
import { useDataSourceContext } from "./dataSourceContext";
import { VscodeButton, VscodeDivider, VscodeSingleSelect, VscodeTableCell, VscodeTableRow, VscodeTextfield } from "@vscode-elements/react-elements";
import { TdsLink } from './../decorator/link';

/**
 * Renders the data grid component.
 *
 * @param props - The data grid component props.
 */
type TFieldFilterProps = {
	fieldDef: TTdsDataGridColumnDef;
	values: Record<string, string>;
	dataSource: any;
	onFilterChanged(fieldName: string, filter: string): void;
}

function FieldFilter(props: TFieldFilterProps) {
	let currentValue: string = props.values[props.fieldDef.name] || "";

	if (props.fieldDef.lookup) {
		const currentValue: string = "currentValue";
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
				<VscodeSingleSelect
					onChange={(e: any) => {
						e.preventDefault();
						const value: string = e?.target?.value;
						return props.onFilterChanged(props.fieldDef.name, value);
					}}>
					VscodeOption
					key={0}
					value={""}
					selected={currentValue === ""}
					{"(All)"}
					VscodeOption
					{Object.keys(options).map((key: string, index: number) => {
						return (
							<>VscodeOption key={index}
								value={key}
								checked={currentValue === key}{options[key]}
								/VscodeOption </>
						)
					})}
				</VscodeSingleSelect>
			)
		}
	}

	return (
		<VscodeTextfield
			onInput={(e: any) => {
				e.preventDefault();
				return props.onFilterChanged(props.fieldDef.name, e.target.value);
			}}
			value={currentValue}
		>
			<span slot="end" className="codicon codicon-list-filter"></span>
		</VscodeTextfield>
	)
}

type TFilterBlockProps = {
	actions: TTdsDataGridAction[];
}

export function FilterBlock(props: TFilterBlockProps) {
	const { setFilter, filter, showFieldsFilter, setShowFieldsFilter } = useDataSourceContext();

	return (
		<section className="tds-row-container">
			<TdsTextField
				name="filter"
				key={`all_filter`}
				label={tdsVscode.l10n.t("_Filter")}
				info={tdsVscode.l10n.t("_Filters on all columns and can accept regular expressions")}
				value={filter}
				onInput={(e: any) => {
					e.preventDefault();

					setFilter(e.target.value.trim());
				}}
			/>

			<VscodeButton icon="list-filter" aria-label="Filter"
				onClick={() => {
					setShowFieldsFilter(!showFieldsFilter);
					//props.onShowFieldsFilter(!showFieldsFilter); //ainda não deu tempo de atualizar useState
				}}
			>
			</VscodeButton>

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
							<TdsLink
								href={action.href}>
								{action.caption}
							</TdsLink>
							: <VscodeButton
								key={action.id}
								className={`tds-button-button ${visible}`}
								{...propsField} >
								{action.caption}
							</VscodeButton>)
					})}
				</div>
			}
		</section>
	)
}

type BuildRowFilterProps = {
	id: string;
	columnDefs: TTdsDataGridColumnDef[];
	dataSource: any[];
}

export function BuildRowFilter(props: BuildRowFilterProps): React.ReactElement[] {
	const {
		filterByField,
		setFilterByField
	} = useDataSourceContext();
	let reactElements: React.ReactElement[] = [];
	let rowNumber: number = 0;

	while (rowNumber != -1) {
		let gridTemplate: string = "";

		props.columnDefs
			.filter(column => column.visible)
			.filter((column) => (column.rowGroup || 0) == rowNumber)
			.map((column, _index: number) => {
				gridTemplate += ` ${column.width || "1fr"} `;
			});

		//gridTemplateColumns={gridTemplate}
		reactElements.push(
			<VscodeTableRow
				row-type="default"
				key={`${props.id}_filter_${rowNumber}_${0}`}
			>
				{props.columnDefs
					.filter(column => column.visible)
					.filter(column => (column.rowGroup || 0) == rowNumber)
					.map((column, indexCol: number) => (
						<VscodeTableCell
							grid-column={indexCol + 1}
							key={`${props.id}_filter_cell_${rowNumber}_${indexCol + 1}`}
						>
							<FieldFilter
								key={`${props.id}_filter_field_${rowNumber}_${indexCol + 1}`}
								fieldDef={column}
								values={filterByField || {}}
								onFilterChanged={
									(fieldName: string, filter: string) => {
										let filters: Record<string, string> = filterByField || {};

										if (filter.trim() !== "") {
											filters[fieldName] = filter;
										} else if (filters[fieldName]) {
											delete filters[fieldName];
										}

										if (Object.keys(filters).length == 0) {
											filters = undefined;;
										}

										setFilterByField(filters);
									}
								}
								dataSource={props.dataSource}
							/>
						</VscodeTableCell>
					))}
			</VscodeTableRow>
		)

		rowNumber = rowNumber + 1;

		if (props.columnDefs.findIndex(column => (column.rowGroup || 0) == rowNumber) == -1) {
			rowNumber = -1;
		}
	}

	let gridTemplate: string = "";

	props.columnDefs
		.filter(column => column.visible)
		.filter((column) => (column.rowGroup || 0) == rowNumber)
		.map((column, _index: number) => {
			gridTemplate += ` ${column.width || "1fr"} `;
		});

	//gridTemplateColumns={gridTemplate}
	reactElements.push(
		<VscodeTableRow row-type="default"
			key={`${props.id}_filter_separator`}
		>
			{props.columnDefs.filter(column => column.visible)
				.filter(column => (column.rowGroup || 0) == 0)
				.map((_column, indexCol: number) => (
					<VscodeTableCell
						key={`${props.id}_filter_separator_${indexCol}`}
						grid-column={indexCol + 1}
						cell-type="rowseparator"
					>
						<VscodeDivider role="separator"></VscodeDivider>
					</VscodeTableCell>
				))}
		</VscodeTableRow>
	);

	return reactElements;
}
