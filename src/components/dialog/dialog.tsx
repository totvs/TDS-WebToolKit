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

import "../page/page.css";
import "./dialog.css";
import React from 'react';
import { ErrorBoundary } from "../error-boundary";
import { VscodeIcon } from "@vscode-elements/react-elements";
import TdsHeader from "../page/header";
import TdsContent from "../page/content";

export interface ITdsDialog {
	title?: string;
	onClose: (ok: boolean, data: any) => void;
	children: any;
}

/**
 * Renders a page layout with header, content and footer sections.
 * 
 * @param props - Page properties
 * @param [props.title] - Page title 
 * @param props.children - Content to render in main section
 */
export function TdsDialog(props: ITdsDialog): React.ReactElement {

	return (
		<ErrorBoundary fallback={<p>Something unexpected occurred. See navigator console log for details.</p>}>
			<div
				className="tds-dialog-overlay"
				onClick={
					(e: any) => {
						if (e.target == e.currentTarget) {
							e.preventDefault();
							e.stopPropagation();
							props.onClose(false, {});
						}
					}
				}
				onKeyUp={(e: any) => {
					console.log("onKeyUp", e);
				}}
			>
				<div className="tds-dialog">
					{props.title &&
						<TdsHeader title={props.title}
							extra={<>
								<VscodeIcon
									name="close"
									action-icon
									onClick={
										(e: any) => {
											props.onClose(false, {});
										}
									}
								></VscodeIcon>

							</>}
						/>}

					<TdsContent>
						{props.children}
					</TdsContent>

				</div>
			</div>
		</ErrorBoundary>
	);
}
