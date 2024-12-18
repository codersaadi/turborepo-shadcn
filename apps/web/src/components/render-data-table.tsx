import React from "react";
import { Shell } from "repo-ui/components/shell";
import { DataTableSkeleton } from "repo-ui/components/table/data-table-skeleton";
import { Skeleton } from "repo-ui/components/ui/skeleton";
import NextDateRangePicker from "./NextDateRangePicker";
export const RenderDataTable = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return (
		<Shell className="gap-2 container">
			<React.Suspense fallback={<Skeleton className="h-7 w-52" />}>
				<NextDateRangePicker />
			</React.Suspense>
			<React.Suspense
				fallback={
					<DataTableSkeleton
						columnCount={5}
						searchableColumnCount={1}
						filterableColumnCount={2}
						cellWidths={["10rem", "40rem", "12rem", "12rem", "8rem"]}
						shrinkZero
					/>
				}
			>
				{children}
			</React.Suspense>
		</Shell>
	);
};
