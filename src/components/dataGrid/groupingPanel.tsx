import { VscodeBadge, VscodeButton, VscodeIcon } from "@vscode-elements/react-elements";
import { TTdsDataGridColumnDef } from "./dataGrid.type";
import { useDataSourceContext } from "./dataSourceContext";

export function GroupingPanel() {
    const {
        groupingInfo, setGroupingInfo,
        groupingFilter, setGroupingFilter
    } = useDataSourceContext();

    const groupingCol: TTdsDataGridColumnDef = groupingInfo.groupingCol;
    const values = Object.keys(groupingInfo.groupingValues || []).sort((v1: string, v2: string) => v1.localeCompare(v2));
    const groupingFilterValue: string[] = groupingFilter || [];
    
    return (
        <section className="tds-row-container">
            <div className="tds-data-grid-grouping">
                <span className="field_name">{groupingCol.label || groupingCol.name}: </span>
                {
                    values.map((data: string, index: number) => {
                        const secondary: {} = groupingFilterValue.indexOf(data) == -1 ? { secondary: true } : {}

                        return (
                            <VscodeButton
                                {...secondary}
                                key={`btn_grouping_filter_${groupingCol.name}.${index}`}
                                onClick={() => {
                                    let filter: string[] = groupingFilterValue;
                                    let pos: number = groupingFilterValue.indexOf(data);

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
                        )
                    })
                }
                <VscodeIcon
                    key={`btn_grouping_${groupingCol.name}`}
                    name="close"
                    actionIcon
                    onClick={() => {
                        setGroupingFilter(undefined);
                    }}
                />
            </div>
        </section>
    )
}
