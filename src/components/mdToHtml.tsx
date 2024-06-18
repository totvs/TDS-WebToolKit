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

import { VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import React from "react";

const PARAGRAPH_RE = /\n\n/i
const PHRASE_RE = /\n/i
const LINK_COMMAND_RE = /\[([^\]]+)\]\((command:[^\)]+)\)/i
const LINK_SOURCE_RE = /\[([^\]]+)\]\(link:([^\)]+)\)/i

type InlineTagName = "code" | "bold" | "italic" | "link" | "blockquote";
type BlockTagName = "code";

//mapeamento parcial (somente as utilizadas) das marcações MD
const mdTags: Record<InlineTagName, RegExp> = {
    "code": /\`([^\`]+)\`/g,
    "bold": /\*\*([^\*\*]+)\*\*/g,
    "italic": /_([^_])+_/g,
    "link": /\[([^\]]+)\]\(([^\)]+)\)/g,
    "blockquote": /^>/gs,
}

const allTags_re = new RegExp(`(${mdTags.code.source})|(${mdTags.bold.source})|(${mdTags.italic.source})|(${mdTags.link.source})|(${mdTags.blockquote.source})`, "ig");

const tagsBlockMap: Record<BlockTagName, RegExp> = {
    "code": /[\`\`\`|~~~]\w*(.*)[\`\`\`|~~~]/gis
};

let spanSeq: number = 0;

/**
 * Converts Markdown-formatted text to HTML elements.
 *
 * This function takes a string of Markdown-formatted text and converts it to an array of React elements that can be rendered in the UI. It supports the following Markdown syntax:
 *
 * - `code`: Inline code blocks
 * - `**bold**`: Bold text
 * - `_italic_`: Italic text
 * - `[link text](command:link)`: Links that execute a command when clicked
 * - `[link text](link:url)`: Links that open a URL when clicked
 * - `> blockquote`: Blockquotes (warning)
 *
 * The function returns an array of React elements that can be directly rendered in the UI.
 *
 * @param text - The Markdown-formatted text to be converted to HTML.
 * @returns An array of React elements representing the HTML equivalent of the input Markdown text.
 */
export function mdToHtml(text: string): any[] {
    let children: any[] = [];
    let parts: string[] | null = text.split(allTags_re);

    for (let index = 0; index < parts.length; index++) {
        const part: string = parts[index];

        if (part) {
            //A ordem de teste deve ser: Code, Link e demais tags (cuidado ao alterar)
            if (part.match(mdTags.code)) {
                index++;
                children.push(<code key={spanSeq++}> {parts[index]} </code>);
            } else if (part.match(mdTags.link)) {
                index++;
                const caption: string = parts[index];
                index++;
                const link: string = part;
                let matchesLink: any;  //RegExpMatchArray | null;
                if (matchesLink = link.match(LINK_COMMAND_RE)) {
                    children.push(
                        <VSCodeLink key={spanSeq++} href={matchesLink[2]}
                            onClick={() => {
                                (document.getElementsByName("newMessage")[0] as any).control.value = caption;
                            }
                            }> {matchesLink[1]}
                        </VSCodeLink>
                    );
                } else {
                    children.push(<span key={spanSeq++}> {part} </span>);
                }
            } else if (part.match(mdTags.bold)) {
                index++;
                children.push(<b key={spanSeq++}> {parts[index]} </b>);
            } else if (part.match(mdTags.italic)) {
                index++;
                children.push(<i key={spanSeq++}> {parts[index]} </i>);
            } else if (part.match(mdTags.blockquote)) {
                index++;
                children.push(<blockquote key={spanSeq++}> {parts[index]} </blockquote>);
            } else {
                children.push(<span key={spanSeq++}> {part} </span>);
            }
        }
    }

    if (children.length == 0) {
        children.push(<>{text}</>);
    }

    return React.Children.toArray(children);
}

