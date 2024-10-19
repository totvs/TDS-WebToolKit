import * as React from "react";
import { TGroupingInfo, TTdsDataGridColumnDef } from "./dataGrid.type";

interface DataSourceContextInterface {
    modelField: string;
    setModelField: (fieldName: string) => void;
    dataSource: any[];
    setDataSource: (dataSource: any[]) => void;
    setFilter: (filter: string) => void;
    filter: string;
    showFieldsFilter: boolean;
    setShowFieldsFilter: (show: boolean) => void;
    filterByField: Record<string, string>;
    setFilterByField: (filter: Record<string, string>) => void;
    sortedColumn: TTdsDataGridColumnDef | undefined;
    setSortedColumn: (columnDef: TTdsDataGridColumnDef | undefined) => void
    sortedDirection: string;
    setSortedDirection: (direction: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    pageSize: number;
    setPageSize: (page: number) => void;
    itemOffset: number;
    setItemOffset: (offset: number) => void;
    groupingInfo: TGroupingInfo | undefined;
    setGroupingInfo: (groupingInfo: TGroupingInfo | undefined) => void;
    groupingFilter: string[];
    setGroupingFilter: (groupingFilter: string[]) => void;
}

const DataSourceContext = React.createContext<DataSourceContextInterface | undefined>(undefined);

export function useDataSourceContext() {
    const context = React.useContext(DataSourceContext);

    if (context === undefined) {
        throw new Error("useDataSourceContext must be used within a DataSourceProvider");
    }

    return context;
};

interface DataSourceProviderProps {
    modelField: string;
    children: React.ReactElement;
}

export function DataSourceProvider(props: DataSourceProviderProps) {
    const [filter, setFilter] = React.useState<string>(undefined);
    const [filterByField, setFilterByField] = React.useState<Record<string, string>>(undefined);
    const [showFieldsFilter, setShowFieldsFilter] = React.useState<boolean>(false);
    const [sortedColumn, setSortedColumn] = React.useState<TTdsDataGridColumnDef | undefined>(undefined);
    const [sortedDirection, setSortedDirection] = React.useState<string>(undefined);
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const [pageSize, setPageSize] = React.useState<number>(0);
    const [itemOffset, setItemOffset] = React.useState<number>(0);
    const [groupingInfo, setGroupingInfo] = React.useState<TGroupingInfo | undefined>(undefined);
    const [groupingFilter, setGroupingFilter] = React.useState<string[]>([]);
    const [modelField, setModelField] = React.useState<string>(props.modelField);
    const [dataSource, setDataSource] = React.useState<any[]>(undefined);

    return (
        <DataSourceContext.Provider value={{
            dataSource: dataSource,
            setDataSource: setDataSource,
            setFilter: setFilter,
            filter: filter,
            showFieldsFilter: showFieldsFilter,
            setShowFieldsFilter: setShowFieldsFilter,
            sortedColumn: sortedColumn,
            setSortedColumn: setSortedColumn,
            sortedDirection: sortedDirection,
            setSortedDirection: setSortedDirection,
            currentPage: currentPage,
            setCurrentPage: setCurrentPage,
            pageSize: pageSize,
            setPageSize: setPageSize,
            itemOffset: itemOffset,
            setItemOffset: setItemOffset,
            filterByField: filterByField,
            setFilterByField: setFilterByField,
            groupingInfo: groupingInfo,
            setGroupingInfo: setGroupingInfo,
            groupingFilter: groupingFilter,
            setGroupingFilter: setGroupingFilter,
            modelField: modelField,
            setModelField: setModelField
        }}>
            {props.children}
        </DataSourceContext.Provider>
    );
};

export default DataSourceContext;