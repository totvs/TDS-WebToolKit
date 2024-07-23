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

import "./paginator.css";
import React, { useState } from "react";
import { VSCodeButton, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { tdsVscode } from './../../utilities/vscodeWrapper';
import { TTdsPaginatorProps } from "./paginator.type";


const FirstPage = () => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			height="1em"
			width="1em"
		>
			<path d="M18 6h2v12h-2zm-2 5H7.414l4.293-4.293-1.414-1.414L3.586 12l6.707 6.707 1.414-1.414L7.414 13H16z" />
		</svg>
	);
}

const LastPage = () => {

	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			height="1em"
			width="1em"
		>
			<path d="M4 6h2v12H4zm4 7h8.586l-4.293 4.293 1.414 1.414L20.414 12l-6.707-6.707-1.414 1.414L16.586 11H8z" />
		</svg>
	);
}

const LeftPage = () => {

	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			height="1em"
			width="1em"
		>
			<path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
		</svg>
	);
}

const RightPage = () => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			height="1em"
			width="1em"
			transform="matrix(-1,0,0,1,0,0)"
		>
			<path d="M21 11H6.414l5.293-5.293-1.414-1.414L2.586 12l7.707 7.707 1.414-1.414L6.414 13H21z" />
		</svg>
	);
}

export function TdsPaginator(props: TTdsPaginatorProps): React.ReactElement {
	const totalPages: number = Math.ceil(props.totalItems / props.pageSize);
	const changePageCallback = (selectedPage: number) => {
		if (props.currentPage != selectedPage) {
			if (selectedPage < 0) {
				selectedPage = 0;
			} else if (selectedPage > totalPages - 1) {
				selectedPage = totalPages - 1;
			}

			props.onPageChange(selectedPage);
		}
	}

	return (
		<div className="tds-paginator">
			<VSCodeButton appearance="icon"
				aria-label="First page"
				title="First page"
				onClick={() => {
					changePageCallback(0);
				}}
			>
				<FirstPage />
			</VSCodeButton>

			<VSCodeButton appearance="icon"
				aria-label="Previous 10 pages"
				title="Previous 10 pages"
				onClick={() => {
					changePageCallback(props.currentPage - 10);
				}}
				disabled={(totalPages - props.currentPage) < 10}
			>
				<LeftPage />
				<LeftPage />
			</VSCodeButton>

			<VSCodeButton appearance="icon"
				aria-label="Previous page"
				title="Previous page"
				onClick={() => {
					changePageCallback(props.currentPage - 1);
				}}
			>
				<LeftPage />
			</VSCodeButton>

			<div className="tds-paginator-label">
				{tdsVscode.l10n.formatNumber(props.firstPageItem + 1)}-{tdsVscode.l10n.formatNumber(props.firstPageItem + props.pageSize)} of {tdsVscode.l10n.formatNumber(props.totalItems)} (Page:
				<VSCodeTextField
					key="current-page"
					value={`${props.currentPage + 1}`}
					onChange={(e: any) => {
						let page = parseInt(e.target.value);

						if (page < 1) {
							page = 1;
						} else if (page > totalPages) {
							page = totalPages;
						}

						changePageCallback(page - 1);
					}
					}
				/>
				of {tdsVscode.l10n.formatNumber(totalPages)})
			</div>

			<VSCodeButton appearance="icon"
				aria-label="Next page"
				title="Next page"
				onClick={() => {
					changePageCallback(props.currentPage + 1);
				}}
			>
				<RightPage />
			</VSCodeButton>

			<VSCodeButton appearance="icon"
				aria-label="Next 10 page"
				title="Next 10 page"
				onClick={() => {
					changePageCallback(props.currentPage + 10);
				}}
				disabled={totalPages < 10}
			>
				<RightPage />
				<RightPage />
			</VSCodeButton>

			<VSCodeButton appearance="icon" aria-label="Last page"
				onClick={() => {
					changePageCallback(totalPages + 1);
				}}
			>
				<LastPage />
			</VSCodeButton>
		</div >
	);
}
