"use client";

import * as React from "react";

import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { type DataTableConfig, dataTableConfig } from "./table-config";

type FeatureFlagValue = DataTableConfig["featureFlags"][number]["value"];

interface BaseTableContextProps {
	featureFlags: FeatureFlagValue[];
	setFeatureFlags: React.Dispatch<React.SetStateAction<FeatureFlagValue[]>>;
}

const BaseTableContext = React.createContext<BaseTableContextProps>({
	featureFlags: [],
	setFeatureFlags: () => {},
});

export function useBaseTable() {
	const context = React.useContext(BaseTableContext);
	if (!context) {
		throw new Error("useBaseTable must be used within a BaseTableProvider");
	}
	return context;
}

export function BaseTableProvider({ children }: React.PropsWithChildren) {
	const [featureFlags, setFeatureFlags] = React.useState<FeatureFlagValue[]>(
		[]
	);

	return (
		<BaseTableContext.Provider
			value={{
				featureFlags,
				setFeatureFlags,
			}}
		>
			<div className="w-full overflow-x-auto">
				<ToggleGroup
					type="multiple"
					variant="outline"
					size="sm"
					value={featureFlags}
					onValueChange={(value: FeatureFlagValue[]) => setFeatureFlags(value)}
					className="w-fit"
				>
					{dataTableConfig.featureFlags.map((flag) => (
						<Tooltip key={flag.value} delayDuration={250}>
							<ToggleGroupItem
								value={flag.value}
								className="whitespace-nowrap px-3 text-xs"
								asChild
							>
								<TooltipTrigger>
									<flag.icon
										className="mr-2 size-3.5 shrink-0"
										aria-hidden="true"
									/>
									{flag.label}
								</TooltipTrigger>
							</ToggleGroupItem>
							<TooltipContent
								align="start"
								side="bottom"
								sideOffset={6}
								className="flex max-w-60 flex-col space-y-1.5 border bg-background py-2 font-semibold text-foreground"
							>
								<div>{flag.tooltipTitle}</div>
								<div className="text-xs text-muted-foreground">
									{flag.tooltipDescription}
								</div>
							</TooltipContent>
						</Tooltip>
					))}
				</ToggleGroup>
			</div>
			{children}
		</BaseTableContext.Provider>
	);
}
