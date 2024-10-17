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

import "./tree.css";
import React, { useState } from "react";
import { tdsVscode } from "../../utilities/vscodeWrapper";
import { VscodeTree } from "@vscode-elements/react-elements";
import { TreeItem, TreeItemAction, TreeItemDecoration, VscTreeActionEvent, VscTreeSelectEvent } from "@vscode-elements/elements/dist/vscode-tree/vscode-tree";

/**
 * Renders the data grid component.
 *
 * @param props - The data grid component props.
 */
type TdsTreeProps = {
	arrows?: boolean;
	indentGuides?: boolean;
	id: string;
	data: any[];
	onTreeAction?: (e: TdsTreeActionEvent) => void;
	onTreeSelect?: (e: TdsTreeSelectEvent) => void;
}

export type TdsTreeItem = TreeItem;
export type TdsTreeItemAction = TreeItemAction;
export type TdsTreeItemDecoration = TreeItemDecoration;
export type TdsTreeActionEvent = {
	actionId: string;
	item: TdsTreeItem | null;
	value: string;
}

export type TdsTreeSelectEvent = {
	icons: {
		branch?: string;
		open?: string;
		leaf?: string;
	};
	itemType: 'branch' | 'leaf';
	label: string;
	open: boolean;
	value: string;
	path: string;
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
export function TdsTree(props: TdsTreeProps): React.ReactElement {
	const [
		data, setData
	] = React.useState<TdsTreeItem[]>(props.data);

	React.useEffect(() => {
		console.log(">>>> useEffect")
	}, [
	]);

	return (
		<section className="tds-tree" id={`${props.id}`}>

			<div className="tds-tree-content" key={`${props.id}_content`}>
				<VscodeTree
					id={`${props.id}_tree`}
					key={`${props.id}_tree`}
					data={data}
					indent-guides={props.indentGuides == undefined ? true : props.indentGuides}
					arrows={props.arrows == undefined ? true : props.arrows}
					onVscTreeAction={(e: VscTreeActionEvent) => {
						props.onTreeAction && props.onTreeAction(e.detail);
					}}
					onVscTreeSelect={(e: VscTreeSelectEvent) => {
						props.onTreeSelect && props.onTreeSelect(e.detail);
					}}
				/>
			</div>

		</section>
	);
}
