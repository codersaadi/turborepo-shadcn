import type { Table } from "@tanstack/react-table";
import {
	CopyIcon,
	Ellipsis as DotsHorizontalIcon,
	AlignCenter as TextAlignCenterIcon,
	TrashIcon,
} from "lucide-react";

import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../../ui/select";

import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Separator } from "../../ui/separator";

import { useDebounce } from "repo-ui/hooks/use-debounce";
import { DataTableFacetedFilter } from "../facets-filter";
import { type DataTableConfig, dataTableConfig } from "../table-config";
import type { DataTableFilterOption } from "../table-types";
import type { FrameworkAgnosticUrlProps } from "./filters-toolbar";

interface DataTableMultiFilterProps<TData> {
	table: Table<TData>;
	allOptions: DataTableFilterOption<TData>[];
	options: DataTableFilterOption<TData>[];
	setSelectedOptions: React.Dispatch<
		React.SetStateAction<DataTableFilterOption<TData>[]>
	>;
	onRouterPush: (url: string) => void;
	defaultOpen: boolean;
}

export function DataTableMultiFilter<TData>({
	table,
	allOptions,
	options,
	pathname,
	searchParams,
	onRouterPush,
	setSelectedOptions,
	defaultOpen,
}: DataTableMultiFilterProps<TData> & FrameworkAgnosticUrlProps) {
	const [open, setOpen] = React.useState(defaultOpen);
	const [operator, setOperator] = React.useState(
		dataTableConfig.logicalOperators[0]
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-7 truncate rounded-full"
				>
					<TextAlignCenterIcon className="mr-2 size-3" aria-hidden="true" />
					{options.length} rule
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-fit p-0 text-xs" align="start">
				<div className="space-y-2 p-4">
					{options.map((option, i) => (
						<MultiFilterRow
							pathname={pathname}
							searchParams={searchParams}
							key={option.id ?? i}
							i={i}
							onRouterPush={onRouterPush}
							option={option}
							table={table}
							allOptions={allOptions}
							options={options}
							setSelectedOptions={setSelectedOptions}
							operator={operator}
							setOperator={
								setOperator as React.Dispatch<
									React.SetStateAction<typeof operator | undefined>
								>
							}
						/>
					))}
				</div>
				<Separator />
				<div className="p-1">
					<Button
						aria-label="Delete filter"
						variant="ghost"
						size="sm"
						className="w-full justify-start"
						onClick={() => {
							setSelectedOptions((prev) =>
								prev.filter((item) => !item.isMulti)
							);
						}}
					>
						Delete filter
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

interface MultiFilterRowProps<TData> {
	i: number;
	table: Table<TData>;
	allOptions: DataTableFilterOption<TData>[];
	option: DataTableFilterOption<TData>;
	options: DataTableFilterOption<TData>[];
	setSelectedOptions: React.Dispatch<
		React.SetStateAction<DataTableFilterOption<TData>[]>
	>;
	operator?: DataTableConfig["logicalOperators"][number];
	setOperator: React.Dispatch<
		React.SetStateAction<
			DataTableConfig["logicalOperators"][number] | undefined
		>
	>;
}

export function MultiFilterRow<TData>({
	i,
	table,
	option,
	searchParams,
	pathname,
	onRouterPush,
	allOptions,
	options,
	setSelectedOptions,
	operator,
	setOperator,
}: MultiFilterRowProps<TData> & FrameworkAgnosticUrlProps) {
	// const router = useRouter();
	const [value, setValue] = React.useState("");
	const debounceValue = useDebounce(value, 500);

	const [selectedOption, setSelectedOption] = React.useState<
		DataTableFilterOption<TData> | undefined
	>(options[0]);

	const filterVarieties = selectedOption?.options.length
		? ["is", "is not"]
		: ["contains", "does not contain", "is", "is not"];

	const [filterVariety, setFilterVariety] = React.useState(filterVarieties[0]);

	// Update filter variety
	React.useEffect(() => {
		if (selectedOption?.options.length) {
			setFilterVariety("is");
		}
	}, [selectedOption?.options.length]);

	// Create query string
	const createQueryString = React.useCallback(
		(params: Record<string, string | number | null>) => {
			const newSearchParams = new URLSearchParams(searchParams?.toString());

			for (const [key, value] of Object.entries(params)) {
				if (value === null) {
					newSearchParams.delete(key);
				} else {
					newSearchParams.set(key, String(value));
				}
			}

			return newSearchParams.toString();
		},
		[searchParams]
	);

	// Update query string
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (debounceValue.length > 0) {
			onRouterPush(
				`${pathname}?${createQueryString({
					[selectedOption?.value ?? ""]: `${debounceValue}${
						debounceValue.length > 0 ? `.${filterVariety}` : ""
					}`,
				})}`
			);
		}

		if (debounceValue.length === 0) {
			onRouterPush(
				`${pathname}?${createQueryString({
					[selectedOption?.value ?? ""]: null,
				})}`
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debounceValue, filterVariety, selectedOption?.value]);

	// Update operator query string
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	React.useEffect(() => {
		if (operator?.value) {
			onRouterPush(
				`${pathname}?${createQueryString({
					operator: operator.value,
				})}`
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [operator?.value]);

	return (
		<div className="flex items-center space-x-2">
			{i === 0 ? (
				<div>Where</div>
			) : i === 1 ? (
				<Select
					value={operator?.value}
					onValueChange={(value) =>
						setOperator(
							dataTableConfig.logicalOperators.find((o) => o.value === value)
						)
					}
				>
					<SelectTrigger className="h-8 w-fit text-xs">
						<SelectValue placeholder={operator?.label} />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							{dataTableConfig.logicalOperators.map((operator) => (
								<SelectItem
									key={operator.value}
									value={operator.value}
									className="text-xs"
								>
									{operator.label}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			) : (
				<div key={operator?.value}>{operator?.label}</div>
			)}
			<Select
				value={String(selectedOption?.value)}
				onValueChange={(value) => {
					setSelectedOption(
						allOptions.find((option) => option.value === value)
					);
					setSelectedOptions((prev) =>
						prev.map((item) => {
							if (item.id === option.id) {
								return {
									...item,
									value: value as keyof TData,
								};
							}
							return item;
						})
					);
				}}
			>
				<SelectTrigger className="h-8 w-full text-xs capitalize">
					<SelectValue placeholder={selectedOption?.label} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{allOptions.map((option) => (
							<SelectItem
								key={String(option.value)}
								value={String(option.value)}
								className="text-xs capitalize"
							>
								{option.label}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Select
				value={filterVariety}
				onValueChange={(value) => setFilterVariety(value)}
			>
				<SelectTrigger className="h-8 w-full truncate px-2 py-0.5 hover:bg-muted/50">
					<SelectValue placeholder={filterVarieties[0]} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{filterVarieties.map((variety) => (
							<SelectItem key={variety} value={variety}>
								{variety}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			{selectedOption?.options.length ? (
				table.getColumn(selectedOption.value ? String(option.value) : "") && (
					<DataTableFacetedFilter
						key={selectedOption.id}
						column={table.getColumn(
							selectedOption.value ? String(selectedOption.value) : ""
						)}
						title={selectedOption.label}
						options={selectedOption.options}
					/>
				)
			) : (
				<Input
					placeholder="Type here..."
					className="h-8"
					value={value}
					onChange={(event) => setValue(event.target.value)}
					autoFocus
				/>
			)}
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="size-8 shrink-0">
						<DotsHorizontalIcon className="size-4" aria-hidden="true" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem
						onClick={() => {
							setSelectedOptions((prev) =>
								prev.filter((item) => item.id !== option.id)
							);
						}}
					>
						<TrashIcon className="mr-2 size-4" aria-hidden="true" />
						Remove
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							if (!selectedOption) return;

							setSelectedOptions((prev) => [
								...prev,
								{
									id: crypto.randomUUID(),
									label: selectedOption.label,
									value: selectedOption.value,
									options: selectedOption.options ?? [],
									isMulti: true,
								},
							]);
						}}
					>
						<CopyIcon className="mr-2 size-4" aria-hidden="true" />
						Duplicate
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
