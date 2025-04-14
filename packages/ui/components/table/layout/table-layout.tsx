"use client";

import type { ColumnDef, Row } from "@tanstack/react-table";
import * as React from "react";
import { DataTable } from "../components/data-table";
import { DataTableAdvancedToolbar } from "../components/data-table-advanced-toolbar";
import { DataTableFilterList } from "../components/data-table-filter-list";
import { DataTableFilterMenu } from "../components/data-table-filter-menu";
import { DataTableSortList } from "../components/data-table-sort-list";
import { DataTableToolbar } from "../components/data-table-toolbar";
import { useDataTable } from "../hooks/use-data-table";
import type { DataTableRowAction, ExtendedColumnSort } from "../types/data-table";


// Base props interface that all action dialogs will share
interface BaseActionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    showTrigger?: boolean;
    onSuccess?: () => void;
}

// Props for single-item operations
interface SingleItemActionDialogProps<TData> extends BaseActionDialogProps {
    data: TData | null;
}

// Props for multi-item operations
interface MultiItemActionDialogProps<TData> extends BaseActionDialogProps {
    data: TData[];
}

interface TableData<TData> {
    data: TData[];
    pageCount: number;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
interface AdvancedDataTableProps<TData extends Record<string, any>, TFilterMetadataSchema> {
    /**
     * The data and pagination information for the table
     */
    tableData: TableData<TData>;

    /**
     * Filter metadata for generating columns and filters
     */
    filterMetadata: TFilterMetadataSchema;

    /**
     * Function to generate columns based on filter metadata
     */
    getColumns: (
        filterMetadata: TFilterMetadataSchema,
        setRowAction: (action: DataTableRowAction<TData> | null) => void,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ) => ColumnDef<TData, any>[];

    /**
     * Function to get a unique identifier for each row
     */
    getRowId: (row: TData) => string;

    /**
     * Initial sorting state for the table
     */
    initialSorting?: ExtendedColumnSort<TData>[];

    /**
     * Initial column pinning configuration
     */
    initialColumnPinning?: { left?: string[]; right?: string[] };

    /**
     * Component to render as the action bar
     */
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ActionBar?: React.ComponentType<{ table: any }>;

    /**
     * Optional feature flags for advanced filtering
     */
    enableAdvancedFilter?: boolean;
    filterFlag?: string;

    /**
     * Optional shallow update flag
     */
    shallow?: boolean;

    /**
     * Optional debounce time in milliseconds
     */
    debounceMs?: number;

    /**
     * Optional throttle time in milliseconds
     */
    throttleMs?: number;

    /**
     * Components for handling different row actions as render props
     */
    actionComponents?: {
        update?: React.ComponentType<SingleItemActionDialogProps<TData>>;
        delete?: React.ComponentType<MultiItemActionDialogProps<TData>>;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        [key: string]: React.ComponentType<any> | undefined;
    };

    /**
     * Whether to clear filters when they match default values
     */
    clearOnDefault?: boolean;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function AdvancedDataTable<TData extends Record<string, any>, TFilterMetadataSchema>({
    tableData,
    filterMetadata,
    getColumns,
    getRowId,
    initialSorting = [],
    initialColumnPinning = { right: ["actions"] },
    ActionBar,
    enableAdvancedFilter = false,
    filterFlag = "default",
    shallow = false,
    debounceMs,
    throttleMs,
    actionComponents = {},
    clearOnDefault = true,
}: AdvancedDataTableProps<TData, TFilterMetadataSchema>) {
    const { data, pageCount } = tableData;

    // State for handling row actions
    const [rowAction, setRowAction] = React.useState<DataTableRowAction<TData> | null>(null);

    // Generate columns with the provided function
    const columns = React.useMemo(
        () => getColumns(filterMetadata, setRowAction),
        [filterMetadata, getColumns]
    );

    // Setup the data table with our config
    const { table, shallow: tableShallow, debounceMs: tableDebounceMs, throttleMs: tableThrottleMs } = useDataTable({
        data,
        columns,
        pageCount,
        enableAdvancedFilter,
        initialState: {
            sorting: initialSorting,
            columnPinning: initialColumnPinning,
        },
        getRowId,
        shallow,
        clearOnDefault,
    });

    return (
        <>
            <DataTable
                table={table}
                actionBar={ActionBar ? <ActionBar table={table} /> : undefined}
            >
                {enableAdvancedFilter ? (
                    <DataTableAdvancedToolbar table={table}>
                        <DataTableSortList table={table} align="start" />
                        {filterFlag === "advancedFilters" ? (
                            <DataTableFilterList
                                table={table}
                                shallow={tableShallow}
                                debounceMs={tableDebounceMs}
                                throttleMs={tableThrottleMs}
                                align="start"
                            />
                        ) : (
                            <DataTableFilterMenu
                                table={table}
                                shallow={tableShallow}
                                debounceMs={tableDebounceMs}
                                throttleMs={tableThrottleMs}
                            />
                        )}
                    </DataTableAdvancedToolbar>
                ) : (
                    <DataTableToolbar table={table}>
                        <DataTableSortList table={table} align="end" />
                    </DataTableToolbar>
                )}
            </DataTable>

            {/* Render update component if defined */}
            {actionComponents.update && rowAction?.variant === "update" && (
                <actionComponents.update
                    open={true}
                    onOpenChange={() => setRowAction(null)}
                    data={rowAction.row.original}
                    showTrigger={false}
                    onSuccess={() => {
                        if (rowAction.row) {
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            (rowAction.row as Row<any>).toggleSelected(false);
                        }
                    }}
                />
            )}

            {/* Render delete component if defined */}
            {actionComponents.delete && rowAction?.variant === "delete" && (
                <actionComponents.delete
                    open={true}
                    onOpenChange={() => setRowAction(null)}
                    data={rowAction.row.original ? [rowAction.row.original] : []}
                    showTrigger={false}
                    onSuccess={() => {
                        if (rowAction.row) {
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            (rowAction.row as Row<any>).toggleSelected(false);
                        }
                    }}
                />
            )}

            {/* Render other action components */}
            {Object.entries(actionComponents).map(([variant, Component]) => {
                if (!Component || variant === "update" || variant === "delete") {
                    return null;
                }

                return (
                    <Component
                        key={variant}
                        open={rowAction?.variant === variant}
                        onOpenChange={() => setRowAction(null)}
                        data={rowAction?.row.original ?? null}
                        showTrigger={false}
                        onSuccess={() => {
                            if (rowAction?.row) {
                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                (rowAction.row as Row<any>).toggleSelected(false);
                            }
                        }}
                    />
                );
            })}
        </>
    );
}

/**
 * Example (Use case)
 */

// interface CoursesTableProps {
//     promise: Promise<{
//       data: {
//         data: CourseColumn[];
//         pageCount: number;
//         totalCount: number;
//       };
//       draft: number;
//       published: number;
//       categoryCount: Record<string, number>;
//     }>;
//   }


//   export function CoursesTable({ promise }: CoursesTableProps) {
//     const { enableAdvancedFilter, filterFlag } = useFeatureFlags();
//     const { data, draft, published, categoryCount } = React.use(promise);
  
//     const filterMetadata = {
//       statusCounts: { draft, published },
//       categoryCount,
//     };
  
//     return (
//       <AdvancedDataTable<CourseColumn, typeof filterMetadata>
//         tableData={data}
//         filterMetadata={filterMetadata}
//         getColumns={(metadata, setRowAction) =>
//           getCoursesTableColumns({
//             statusCounts: metadata.statusCounts,
//             categoryCount: metadata.categoryCount,
//             setRowAction,
//           })
//         }
//         getRowId={(course) => course._id as string}
//         initialSorting={[{ id: 'createdAt', desc: true }]}
//         initialColumnPinning={{ right: ['actions'] }}
//         ActionBar={CoursesTableActionBar}
//         enableAdvancedFilter={enableAdvancedFilter}
//         filterFlag={filterFlag}
//         actionComponents={{
//           update: UpdateCourseSheet,
//           delete: DeleteCoursesDialog,
//         }}
//       />
//     );
//   }
  