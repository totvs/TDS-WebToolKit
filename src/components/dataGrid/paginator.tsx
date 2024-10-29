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

import React, { useState } from "react";
import { tdsVscode } from './../../utilities/vscodeWrapper';
import { VscodeIcon, VscodeOption, VscodeSingleSelect, VscodeTextfield } from "@vscode-elements/react-elements";

export interface ITdsPaginatorProps {
	currentPage: number;
	currentItem: number;
	totalItems: number;
	pageSize: number;
	pageSizeOptions: number[];

	onPageChange(selectedPage: number): void;
	onPageSizeChange(size: number): void;
}

export default function TdsPaginator(props: ITdsPaginatorProps): React.ReactElement {
	const [currentPage, setCurrentPage] = useState(props.currentPage);
	const [totalPages, setTotalPages] = useState(0);
	const [currentItem, setCurrentItem] = useState(0);
	const [totalItems, setTotalItems] = useState(props.totalItems);
	const lastItem: number = currentItem + props.pageSize > totalItems ? totalItems : currentItem + props.pageSize;

	const changePage = (selectedPage: number) => {
		if (currentPage != selectedPage) {
			if (selectedPage < 0) {
				selectedPage = 0;
			} else if (selectedPage > totalPages - 1) {
				selectedPage = totalPages - 1;
			}

			if (props.onPageChange) {
				props.onPageChange(selectedPage);
			}

			setCurrentPage(selectedPage);
			setCurrentItem((selectedPage * props.pageSize));
		}
	}

	React.useEffect(() => {
		setCurrentItem(props.currentItem);
		setCurrentPage(props.currentPage);
		setTotalItems(props.totalItems);
		setTotalPages(Math.ceil(props.totalItems / props.pageSize));
	}, [props.totalItems, props.pageSize]);

	return (
		<div className="tds-data-grid-paginator">
			{(props.pageSizeOptions.length > 0) &&
				<>
					<span>{tdsVscode.l10n.t("_Elements/page")}</span>
					<VscodeSingleSelect
						key={`dropdown_elements_page`}
						value={`${props.pageSize}`}
						onChange={(event: any) => {
							if (props.onPageSizeChange) {
								props.onPageSizeChange(parseInt(event.target.value));
							}
						}}
					>
						{props.pageSizeOptions.map((size: number, index: number) => (
							<VscodeOption
								key={`${index}`}
								value={`${size}`}
								selected={props.pageSize === size}
							>
								{size}
							</VscodeOption>
						))}
					</VscodeSingleSelect>
				</>
			}

			<VscodeIcon
				className="mirrorX"
				name="export"
				title={tdsVscode.l10n.t("_First Page")}
				actionIcon
				onClick={() => {
					changePage(0);
				}}
			/>

			<VscodeIcon
				className="rotate025"
				name="fold-down"
				title={tdsVscode.l10n.t("_Previous 10 pages")}
				onClick={() => {
					changePage(currentPage - 10);
				}}
				actionIcon={(totalPages - currentPage) < 10}
			/>

			<VscodeIcon
				name="chevron-left"
				title={tdsVscode.l10n.t("_Previous page")}
				onClick={() => {
					changePage(currentPage - 1);
				}}
			/>

			{tdsVscode.l10n.formatNumber(currentItem + 1)}-{tdsVscode.l10n.formatNumber(lastItem)} of {tdsVscode.l10n.formatNumber(totalItems)}
			&nbsp;(Page:&nbsp;

			<VscodeTextfield
				key="current-page"
				value={`${currentPage + 1}`}
				onChange={
					(e: any) => {
						let page = parseInt(e.target.value);

						if (page < 1) {
							page = 1;
						} else if (page > totalPages) {
							page = totalPages;
						}

						changePage(page - 1);
					}
				}
			/>
			&nbsp;of {tdsVscode.l10n.formatNumber(totalPages)})

			<VscodeIcon
				name="chevron-right"
				title={tdsVscode.l10n.t("_Next page")}
				onClick={() => {
					changePage(currentPage + 1);
				}}
			/>

			<VscodeIcon
				className="rotate025"
				name="fold-up"
				title={tdsVscode.l10n.t("_Next 10 pages")}
				onClick={() => {
					changePage(currentPage + 10);
				}}
				actionIcon={totalPages < 10}
			/>

			<VscodeIcon
				name="export"
				title={tdsVscode.l10n.t("_Last Page")}
				actionIcon
				onClick={() => {
					changePage(totalPages + 1);
				}}
			/>
		</div >
	);
}
