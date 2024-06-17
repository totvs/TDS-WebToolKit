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

import "./progress-ring.css";
import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";
import React from "react";

type TTdsProcessRing = {
    size?: "small" | "medium" | "larger";
}

export function TdsProgressRing(props: TTdsProcessRing): React.ReactElement {
    const classSize = props.size
        ? ` tds-process-ring-${props.size}`
        : ""

    return (
        <VSCodeProgressRing className={`tds-progress-ring${classSize}`} />
    );
}
