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
import { TTdsTableProps } from "./table.type";
import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from "@vscode/webview-ui-toolkit/react";

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
	console.log("tdsTable.start");

	const buildRow = (row: any[] | any, rowIndex: number): React.ReactElement => {
		let reactElements: React.ReactElement[] = [];
		const rowClassName: string = props.highlighRows.includes(rowIndex) ? "tds-table-row-highlight" : "";

		if (props.dataColumns) {
			props.dataColumns.forEach((element: string, index: number) => {
				reactElements.push(
					<VSCodeDataGridCell
						key={`${props.id}_cell_${rowIndex}_${index}`}
						grid-column={index + 1}>
						{row[element]}
					</VSCodeDataGridCell>
				);
			});
		} else {
			row.forEach((element: any, index: number) => {
				reactElements.push(
					<VSCodeDataGridCell
						key={`${props.id}_cell_${rowIndex}_${index}`}
						grid-column={index + 1}>
						{element}
					</VSCodeDataGridCell>
				);
			});
		}
		return (
			<VSCodeDataGridRow
				row-type="default"
				key={`${props.id}_row_${rowIndex}`}
				className={rowClassName}
				onClick={(event: React.MouseEvent<HTMLElement, MouseEvent>) => {
					props.onClick && props.onClick(
						event.target as HTMLElement,
						rowIndex,
						{
							altKey: event.altKey,
							ctrlKey: event.ctrlKey,
							shiftKey: event.shiftKey,
							metaKey: event.metaKey
						})
				}}
			>
				{...reactElements}
			</VSCodeDataGridRow >
		);
	}

	return (
		<section className="tds-table" id={`${props.id}`}>
			<div className="tds-table-content">
				{props.dataSource && props.dataSource.length == 0 && <div className="tds-table-empty-message">Nenhum registro encontrado</div>}
				{props.dataSource && props.dataSource.length != 0 &&
					<VSCodeDataGrid
						ref={props.ref}
						id={`${props.id}_table`}
						key={`${props.id}_table`}
						generate-header="sticky"
						grid-template-columns={
							props.widthColumns
								.map((width: string | number) => typeof (width) == "string" ? width : `${width}fr`).join(" ")
						}
					>
						<VSCodeDataGridRow
							key={`${props.id}_header`}
						>
							{props.headerColumns.map((header: string, index: number) =>
								<VSCodeDataGridCell
									key={`${props.id}_header_${index}`}
									grid-column={index + 1}
								>
									{header}
								</VSCodeDataGridCell>)}
						</VSCodeDataGridRow>

						{props.dataSource.map((row: any, index: number) => buildRow(row, index))}
					</VSCodeDataGrid>
				}
			</div>

		</section>
	);
}
