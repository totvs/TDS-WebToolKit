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

import "./table.css";
import React from "react";
import { TTdsTableColumn, TTdsOnClickTableCell, TTdsTableProps } from "./table.type";
import { VSCodeCheckbox, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { tdsVscode } from "../../utilities/vscodeWrapper";

type TBuildRowsProps = {
	id: string;  //ID tabela 
	row: any[];
	rowIndex: number;
	highlightRow: boolean;
	extraClassName: string[];
	headerColumn: TTdsTableColumn[];
	onClick?: TTdsOnClickTableCell;
	//onKeyCapture?: TTdsOnCaptureKey;
}

function fieldData(rowKey: string, colIndex: number, headerColumn: TTdsTableColumn, value: any) {
	const column: TTdsTableColumn =
		typeof (headerColumn) !== "string"
			? headerColumn
			: {
				label: headerColumn,
				type: "string"
			}
	let alignClass: string | undefined = column.align !== undefined ? `tds-text-${column.align}` : undefined;

	//Campo BOOLEAN
	if (column.type == "boolean") {
		alignClass = alignClass || "tds-text-center";

		return (
			<VSCodeCheckbox
				className={alignClass}
				key={`${rowKey}_${colIndex}`}
				readOnly={true}
				checked={value || value.toString() == "true"}
			></VSCodeCheckbox>
		)
	}

	//Campo DATE, TIME e DATETIME
	if ((column.type == "date") || (column.type == "time") || (column.type == "datetime")) {
		alignClass = alignClass || "tds-text-right";
	}

	//Campo Number
	if ((column.type == "number")) {
		alignClass = alignClass || "tds-text-right";
	}

	const text: string = tdsVscode.l10n.format(value, (column.displayType || column.type));

	return (
		<VSCodeTextField
			className={alignClass}
			title={text}
			data-type={column.type}
			key={`${rowKey}_${colIndex}`}
			readOnly={false}
			value={text}
		></VSCodeTextField>
	)
}

function BuildRow(props: TBuildRowsProps) {
	let reactElements: React.ReactElement[] = [];
	let rowClassName: string = "";

	if (props.highlightRow) {
		rowClassName = "tds-table-row-highlight";
	} else if (props.extraClassName) {
		rowClassName = props.extraClassName.join(" ");
	}

	let dataList: string[];

	if (!Array.isArray(props.row)) {
		dataList = Object.keys(props.row).map((key: any) => {
			return props.row[key].toString();
		})
	} else {
		dataList = props.row;
	}

	dataList.forEach((value: any, index: number) => {
		reactElements.push(
			<VSCodeDataGridCell
				key={`${props.id}_cell_${props.rowIndex}_${index}`}
				grid-column={index + 1}>
				{fieldData(
					`${props.id}_cell_${props.rowIndex}_${index}`,
					index,
					props.headerColumn[index],
					value
				)}
			</VSCodeDataGridCell>
		);
	});

	return (
		<VSCodeDataGridRow
			row-type="default"
			className={rowClassName}
			key={`${props.id}_row_${props.rowIndex}`}
		>
			{...reactElements}
		</VSCodeDataGridRow>
	);
}

/**
 * Renders a table component with the provided data source and configuration.
 *
 * @param props - The props for the table component.
 * @param props.id - The unique identifier for the table.
 * @param props.dataSource - The data to be displayed in the table.
 * @param props.headerColumns - The headers for the table columns.
 * @param props.widthColumns - The widths for the table columns.
 * @param props.highlighRows - The indices of the rows to be highlighted.
 * @returns The rendered table component.
 */
export function TdsTable(props: TTdsTableProps): React.ReactElement {
	const widthColumns: string[] = props.columns
		.map((headerColumn: TTdsTableColumn) =>
			typeof (headerColumn) == "string"
				? "1fr"
				: typeof (headerColumn.width) == "string" ? `${headerColumn.width}` : `1fr` //TODO: revisar
		);
	const headerColumns: string[] = props.columns
		.map((headerColumn: TTdsTableColumn) =>
			typeof (headerColumn) == "string"
				? headerColumn
				: `${headerColumn.label}`
		);


	//	ref={props._ref}
	return (
		<section className="tds-table" id={`${props.id}`}>
			<div className="tds-table-content"
				onKeyDown={(event) => console.log("TdsTable keyDown", event)}
				onKeyUp={(event) => console.log("TdsTable keyUp", event)}
				onKeyUpCapture={(event) => console.log("TdsTable onKeyUpCapture", event)}
			>
				{props.dataSource && props.dataSource.length != 0 &&
					<VSCodeDataGrid
						id={`${props.id}_table`}
						key={`${props.id}_table`}
						generate-header="sticky"
						grid-template-columns={widthColumns}
					>
						{widthColumns.length > 0 &&
							<VSCodeDataGridRow
								id={`${props.id}_header`}
								key={`${props.id}_header`}
							>
								{headerColumns.map((header: string, index: number) =>
									<VSCodeDataGridCell
										key={`${props.id}_header_${index}`}
										grid-column={index + 1}
									>
										{header}
									</VSCodeDataGridCell>)}
							</VSCodeDataGridRow>
						}
						{props.onCustomBody && props.onCustomBody(props.dataSource)}
						{!props.onCustomBody && props.dataSource.map((row: any, index: number) =>
							<BuildRow
								id={`${props.id}_table`}
								key={`${props.id}_row_${index}`}
								row={row}
								rowIndex={index}
								highlightRow={(props.highlightRows || []).includes(index)}
								onClick={props.onClick}
								headerColumn={props.columns}
								extraClassName={
									Object.keys(props.highlightGroups || []).map((key: string) => {
										if (typeof props.highlightGroups[key] === "function") {
											const highlightGroups: Record<NamedCurve, Function> = props.highlightGroups as Record<NamedCurve, Function>
											if (highlightGroups[key](row, index)) {
												return key;
											}
										} else {
											const highlightGroups: Record<NamedCurve, number[]> = props.highlightGroups as Record<NamedCurve, number[]>
											if (highlightGroups[key].includes(index)) {
												return key;
											}
										}
										return ""
									})}
							/>
						)}
					</VSCodeDataGrid>
				}
			</div>

		</section>
	);
}
