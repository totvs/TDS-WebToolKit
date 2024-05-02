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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./page.css");
const header_1 = __importDefault(require("./header"));
const footer_1 = __importDefault(require("./footer"));
const content_1 = __importDefault(require("./content"));
/**
 * Renders a page layout with header, content and footer sections.
 *
 * @param props - Page properties
 * @param props.title - Page title
 * @param props.linkToDoc - Link to documentation
 * @param props.children - Content to render in main section
 * @param props.footerContent - Content to render in footer
 */
function TdsPage(props) {
    return (<section className="tds-page">
			<header_1.default title={props.title} linkToDoc={props.linkToDoc}/>
			<content_1.default>
				{props.children}
			</content_1.default>
			<footer_1.default>
				{props.footerContent}
			</footer_1.default>
		</section>);
}
exports.default = TdsPage;
