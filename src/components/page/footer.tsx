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

import { VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import "./footer.css";
import React from "react";
import { VSCodeLink } from '@vscode/webview-ui-toolkit/react';

export interface IFooter {
	//linkToDoc?: string
	//children: any
}

/**
 * Renders the footer component.
 * 
 * @param props - The footer component props.
 * @param props.children - The content to render within the footer.
 */
export default function TdsFooter(props: IFooter): React.ReactElement {
	return (
		<section className="tds-footer">
			<VSCodeDivider role="presentation" />
			<div className="tds-logo">
				{/* <img src="/icons/totvs24x24.png" alt="TOTVS S.A." /> */}
			</div>
			<div className="tds-footer-content">
				<VSCodeLink href="https://wwww.totvs.com" target="_blank">TOTVS S.A. </VSCodeLink>
			</div>
		</section>
	);
}
