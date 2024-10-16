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

import React from "react";

type TTdsLink = {
    href: string;
    target?: string;
    title?: string;
    onClick?: (event: React.MouseEventHandler<HTMLAnchorElement>) => void;
    children: React.ReactElement | string;
}

export function TdsLink(props: TTdsLink): React.ReactElement {
    return (<a
        target={props.target}
        title={props.title || ""}
        href={props.href}
        onClick={(e: any) => props.onClick && props.onClick(e)}>
        {props.children}
    </a>)
}
