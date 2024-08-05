import React from "react";
import { TdsPage } from "../components/page/page";


export function DemoPage(): any {
    return (
        <React.StrictMode>
            <TdsPage title="TdsPage: Demo" showFooter={true}>
                Elementos React que compõem a página.
            </TdsPage>;
        </React.StrictMode>
    )
}
