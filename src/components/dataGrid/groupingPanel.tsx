import { VscodeBadge, VscodeButton } from "@vscode-elements/react-elements";
import { TTdsDataGridColumnDef } from "./dataGrid.type";
import { useDataSourceContext } from "./dataSourceContext";

export function GroupingPanel() {
    const {
        groupingInfo, setGroupingInfo,
        groupingFilter, setGroupingFilter
    } = useDataSourceContext();
    const groupingCol: TTdsDataGridColumnDef = groupingInfo.groupingCol;
    const values = Object.keys(groupingInfo.groupingValues || []).sort((v1: string, v2: string) => v1.localeCompare(v2));

    //appearance={groupingFilter.indexOf(data) > -1 ? "primary" : "secondary"}
    return (
        <section className="tds-row-container">
            <div className="tds-data-grid-grouping">
                {
                    //<span className="label">{tdsVscode.l10n.t("_Group by:")}</span>
                }
                <span className="field_name">{groupingCol.label || groupingCol.name}: </span>
                {values.map((data: string, index: number) => (
                    <VscodeButton
                        key={`btn_grouping_filter_${groupingCol.name}.${index}`}
                        onClick={() => {
                            let filter: string[] = groupingFilter;
                            let pos: number = groupingFilter.indexOf(data);

                            if (pos > -1) {
                                delete filter[pos];
                            } else {
                                filter.push(data);
                            }

                            setGroupingFilter(filter);
                        }}
                    >
                        {groupingCol.lookup && groupingCol.lookup[data]
                            ? groupingCol.lookup[data] : data}
                        <VscodeBadge>{groupingInfo.groupingValues[data]}</VscodeBadge>
                    </VscodeButton>
                ))
                }
                <VscodeButton aria-label="Ungroup"
                    key={`btn_grouping_${groupingCol.name}`}
                    onClick={() => {
                        setGroupingFilter(undefined);
                    }}
                >
                    <span className="codicon codicon-close"></span>
                </VscodeButton>
            </div>
        </section>
    )
}
