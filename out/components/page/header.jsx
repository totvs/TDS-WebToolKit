"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@vscode/webview-ui-toolkit/react");
require("./header.css");
/**
 * Header component that renders the TOTVS logo, page title, and help link.
 *
 * @param props - Header component props
 * @param props.title - Page title to display
 * @param [props.linkToDoc] - Optional help link to render
 */
function TdsHeader(props) {
    const re = /\[(.*)]\]?(.*)/g;
    let match = re.exec(props.linkToDoc || "");
    let text;
    let href;
    if (match && match.length > 1) {
        text = "Help"; //match[1];
        href = "https://github.com/totvs/tds-vscode/blob/master/docs/" + match[2];
    }
    else {
        text = props.linkToDoc || "";
        href = props.linkToDoc || "";
    }
    return (<section className="tds-header">
			<div className="tds-logo">
				<img src="..\..\icons\totvs-32x32.png" alt="TOTVS S.A."/>
			</div>
			<h1>{props.title}</h1>
			{props.linkToDoc && <div className="tds-help-doc"><react_1.VSCodeLink href={href}>{text}</react_1.VSCodeLink></div>}
		</section>);
}
exports.default = TdsHeader;
