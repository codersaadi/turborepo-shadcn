"use client";

import { type Table as TanstackTable, flexRender } from "@tanstack/react-table";
import type React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../ui/table";

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
	/**
	 * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
	 * @type TanstackTable<TData>
	 */
	table: TanstackTable<TData>;

	/**
	 * The floating bar to render at the bottom of the table on row selection.
	 * @default null
	 * @type React.ReactNode | null
	 * @example floatingBar={<TasksTableFloatingBar table={table} />}
	 */
	floatingBar?: React.ReactNode | null;
}

export function DataTable<TData>({
	table,
	floatingBar = null,
	children,
	className,
	...props
}: DataTableProps<TData>) {
	return (
		<div
			className={cn("w-full space-y-2.5 overflow-auto", className)}
			{...props}
		>
			{children}
			<div className="overflow-hidden rounded-md border ">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											colSpan={header.colSpan}
											style={{
												...getCommonPinningStyles({ column: header.column }),
											}}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											style={{
												...getCommonPinningStyles({ column: cell.column }),
											}}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={table.getAllColumns().length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex flex-col gap-2.5">
				<DataTablePagination table={table} />
				{table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
			</div>
		</div>
	);
}
import type { Column } from "@tanstack/react-table";
import { cn } from "repo-ui/lib/utils";
import { DataTablePagination } from "./data-table-pagination";

export function getCommonPinningStyles<TData>({
	column,
	withBorder = false,
}: {
	column: Column<TData>;
	/**
	 * Whether to show a box shadow on the right side of the last left pinned column or the left side of the first right pinned column.
	 * This is useful for creating a border between the pinned columns and the scrollable columns.
	 * @default false
	 */
	withBorder?: boolean;
}): React.CSSProperties {
	const isPinned = column.getIsPinned();
	const isLastLeftPinnedColumn =
		isPinned === "left" && column.getIsLastColumn("left");
	const isFirstRightPinnedColumn =
		isPinned === "right" && column.getIsFirstColumn("right");

	return {
		boxShadow: withBorder
			? isLastLeftPinnedColumn
				? "-4px 0 4px -4px hsl(var(--border)) inset"
				: isFirstRightPinnedColumn
					? "4px 0 4px -4px hsl(var(--border)) inset"
					: undefined
			: undefined,
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		opacity: isPinned ? 0.97 : 1,
		position: isPinned ? "sticky" : "relative",
		background: isPinned ? "hsl(var(--background))" : "hsl(var(--background))",
		width: column.getSize(),
		zIndex: isPinned ? 1 : 0,
	};
}
