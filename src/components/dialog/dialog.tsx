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

import "./dialog.css";
import "../page/page.css";
import React from 'react';
import { ErrorBoundary } from "../error-boundary";
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
			<section className="tds-dialog-overlay">
				<section className="tds-dialog">
					{props.title && <TdsHeader title={props.title} />}

					<TdsContent>
						{props.children}
					</TdsContent>

				</section>
			</section>
		</ErrorBoundary>
	);
}
